<template>
    <div>
      <header class="header-section">
        <NavBar :userRole="userRole" :userName="userName" />
      </header>

      <div class="survey-page">
        <h1 class="title">Gestión de Encuestas</h1>

        <!-- Sección del gráfico y selector de año -->
        <div class="chart-container">
          <div class="chart-section">
            <canvas id="surveyChart"></canvas>
          </div>
          <!--<div class="year-selector">
            <label for="yearSelect">Año:</label>
            <select v-model="selectedYear" @change="updateChart" id="yearSelect">
              <option value="">Todos</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>-->
        </div>

        <!-- Botón para enviar correos electrónicos -->
        <button class="send-all-btn" @click="sendEmails">Enviar Correos a Todos</button>

        <!-- Mensaje personalizado -->
        <textarea v-model="customMessage" class="message-input" placeholder="Escribe un mensaje personalizado..."></textarea>

        <!-- Última vez que se envió mensaje -->
        <p class="last-sent">Última vez enviado: {{ lastSentDate || 'No enviado aún' }}</p>

        <!-- Tabla de estudiantes que no completaron la encuesta -->
        <div class="table-section">
          <div class="table-controls">
            <input v-model="searchTerm" class="search-input" placeholder="Buscar por nombre..." @input="fetchPendingStudents"/>
            <select v-model="filterYear" class="filter-select" @change="fetchPendingStudents">
              <option value="">Filtrar por año</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <table class="student-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>CI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Año de Ingreso</th>
                <th>Telefono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in filteredStudents" :key="student.ci">
                <td>{{ index + 1 }}</td>
                <td>{{ student.ci }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.lastName }}</td>
                <td>{{ student.year }}</td>
                <td>{{ student.phone }}</td>
                <td>
                  <button class="action-btn" @click="sendEmail(student.mail)">Enviar Correo</button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Controles de paginación -->
          <div class="pagination-controls">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
            <span>Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Siguiente</button>
          </div>
        </div>

        <!-- Botón para abrir la ventana modal -->
        <button class="settings-btn" @click="openModal">Modificar Parámetros de Porcentaje</button>
      </div>
  
      <!-- Ventana Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <h2>Modificar Parámetros</h2>
          
          <label for="minPercentage">Porcentaje Mínimo para Notificación:</label>
          <input type="number" v-model="minPercentage" id="minPercentage" min="0" max="100" />
  
          <label for="defaultMessage">Mensaje Predeterminado:</label>
          <textarea v-model="defaultMessage" id="defaultMessage" placeholder="Mensaje predeterminado para los estudiantes..."></textarea>
  
          <div class="modal-buttons">
            <button @click="saveSettings" class="save-btn">Guardar</button>
            <button @click="closeModal" class="cancel-btn">Cancelar</button>
          </div>
        </div>
      </div>
  
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  import Swal from 'sweetalert2';  // Utiliza SweetAlert para mensajes
  import { BASE_URL } from '@/config/globals';
  
  export default {
    name: 'SurveyPage',
    components: {
      NavBar,
      FooterComponent,
    },
    data() {
      return {
        userRole: '',
        userName: '',
        showModal: false,
        minPercentage: 70,
        defaultMessage: "Por favor complete la encuesta.",
        surveyData: { completed: 0, notCompleted: 0 },
        customMessage: '',
        lastSentDate: '2024-10-30',
        students: [],
        searchTerm: '',
        filterYear: '',
        selectedYear: '',
        years: [2020, 2021, 2022, 2023, 2024],
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
      };
    },
    computed: {
      filteredStudents() {
        return this.students.filter(student => {
          return (
            (!this.filterYear || student.year == this.filterYear) &&
            (!this.searchTerm || student.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
          );
        });
      },
    },
    methods: {
      async fetchSurveyData() {
        try {
          const response = await this.$protectedAxios.get(`${BASE_URL}/estado_encuesta`);
          const completedCount = response.data.filter(item => item.estado === 'Completado').length;
          const notCompletedCount = response.data.filter(item => item.estado === 'Pendiente').length;
          this.surveyData = { completed: completedCount, notCompleted: notCompletedCount };
          this.renderChart();
        } catch (error) {
          console.error('Error fetching survey data:', error);
        }
      },
      async fetchPendingStudents() {
        try {
          const response = await this.$protectedAxios.get(`${BASE_URL}/estado_encuesta/pendientes/paginated`, {
            params: {
              page: this.currentPage - 1,
              size: this.pageSize,
            },
          });
          // Ajuste para mapear los datos del DTO
          this.students = response.data.content.map(student => ({
            id: student.idEstudiante,
            ci: student.ci,
            name: student.nombre,
            lastName: student.apellido,
            year: student.anio,
            phone: student.telefono,
            mail: student.correoInstitucional,
          }));
          this.totalPages = response.data.totalPages;
        } catch (error) {
          console.error('Error fetching pending students:', error);
        }
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
          this.fetchPendingStudents();
        }
      },
      async openModal() {
        try {
          const response = await this.$protectedAxios.get(`${BASE_URL}/parametros_aviso/1`);
          this.minPercentage = response.data.porcentaje;
          this.defaultMessage = response.data.mensajePredeterminado;
          this.lastSentDate = response.data.fechaNotificacion;
          this.showModal = true;
        } catch (error) {
          console.error('Error fetching parameters:', error);
        }
      },
      closeModal() {
        this.showModal = false;
      },
      async sendEmails() {
        // Mostrar mensaje de carga
        Swal.fire({
          title: 'Enviando correos...',
          text: 'Por favor espera un momento.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        try{
          await this.$protectedAxios.post(`${BASE_URL}/estado_encuesta/recordatorio_correo`);

          // Cerrar el mensaje de carga
        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Correos enviados',
          text: 'Se han enviado correos recodatorios a todos lo estudiantes.',
          confirmButtonText: 'Aceptar',
        });
        } catch (error) {
          // Cerrar el mensaje de carga si hay error
          Swal.close();

        // Mostrar mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el código de verificación. Intente nuevamente.',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      async sendEmail(correoInstitucional) {
        // Mostrar mensaje de carga
        Swal.fire({
          title: 'Enviando correo...',
          text: 'Por favor espera un momento.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        try{
          await this.$protectedAxios.post(`${BASE_URL}/estado_encuesta/recordatorio_personal`, {
            correo: correoInstitucional,
            cuerpo: this.customMessage
        });
        // Cerrar el mensaje de carga
        Swal.close();

        // Manejar respuesta exitosa
        Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'Correo recordatorio enviado correctamente.',
            confirmButtonText: 'Aceptar',
          });
  
          // Cerrar el popup
          this.$emit('close');
        } catch (error) {
          // Cerrar el mensaje de carga si hay error
          Swal.close();
          // Manejar errores
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar el correo',
            text: 'Ha ocurrido un error, por favor intenta nuevamente.',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      async saveSettings() {
        try {
          const currentDate = new Date().toISOString().split('T')[0];
          const data = {
            porcentaje: this.minPercentage,
            mensajePredeterminado: this.defaultMessage,
            fechaCambio: currentDate,
            fechaNotificacion: this.lastSentDate
          };
          await this.$protectedAxios.put(`${BASE_URL}/parametros_aviso/1`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          alert('Configuración guardada correctamente');
          this.closeModal();
        } catch (error) {
          console.error('Error saving settings:', error);
          alert('No se pudo guardar la configuración');
        }
      },
      renderChart() {
        const ctx = document.getElementById('surveyChart').getContext('2d');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Completado', 'No Completado'],
            datasets: [
              {
                data: [this.surveyData.completed, this.surveyData.notCompleted],
                backgroundColor: ['#4CAF50', '#F44336'],
              },
            ],
          },
        });
      },
    },
    mounted() {
      this.userRole = localStorage.getItem('rol') || '';
      this.fetchSurveyData();
      this.fetchPendingStudents();
    },
  };
  </script>
  
  <style scoped>
  /* Estilos de la tabla, botones y paginación */
  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .pagination-controls button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .pagination-controls span {
    margin: 0 10px;
  }
  
  /* Estilos generales */
  .survey-page {
  padding: 30px;
  max-width: 900px;
  margin: 60px auto 80px; /* Agrega margen superior e inferior */
  background-color: #f7f9fb;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
  
  .title {
    font-size: 1.8em;
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  /* Botones */
  .send-all-btn, .settings-btn {
    margin: 15px 0;
    padding: 12px 20px;
    background-color: #8e6c88;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .send-all-btn:hover, .settings-btn:hover {
    background-color: #80ced7;
  }

  .message-input {
  width: 100%;
  height: 80px;
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  font-size: 1em;
  color: #555;
}

.last-sent {
  font-style: italic;
  color: #666;
}

.table-section {
  margin-top: 20px;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.search-input,
.filter-select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1em;
  color: #333;
  width: 45%;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
}

.student-table th,
.student-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
  color: #555;
}

.student-table th {
  background-color: #263d42;
  color: #fff;
  font-weight: bold;
}

.student-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.action-btn {
  padding: 6px 12px;
  background-color: #63c7b2;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background-color: #218838;
}

.settings-btn {
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #6c757d;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.settings-btn:hover {
  background-color: #5a6268;
}
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .modal-content h2 {
    margin-top: 0;
    color: #333;
  }
  
  .modal-content label {
    display: block;
    margin-top: 10px;
    font-weight: bold;
    color: #555;
  }

.modal-content input[type="number"],
.modal-content textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1em;
  }
  
.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
.save-btn {
    background-color: #63c7b2;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
.save-btn:hover {
    background-color: #ccdbdc;
  }
  
.cancel-btn {
    background-color: #263d42;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
.cancel-btn:hover {
    background-color: #ccdbdc;
  }

.header-section {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #ffffff;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px; 
}


.chart-section {
  flex: 3;
  max-width: 300px; 
  max-height: 300px; 
  margin: 0 auto; 
}

.year-selector {
  flex: 1;
  text-align: right;
  padding-left: 20px;
}

.year-selector label {
  margin-right: 10px;
}
</style>
  