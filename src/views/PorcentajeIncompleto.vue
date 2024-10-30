<template>
    <div>
      <header>
        <NavBar :userRole="userRole" :userName="userName" />
      </header>
  
      <div class="survey-page">
        <h1 class="title">Gestión de Encuestas</h1>
  
        <!-- Gráfico circular del porcentaje de encuesta completada -->
        <div class="chart-section">
          <canvas id="surveyChart"></canvas>
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
            <input v-model="searchTerm" class="search-input" placeholder="Buscar por nombre..." />
            <select v-model="filterYear" class="filter-select" @change="filterByYear">
              <option value="">Filtrar por año</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
  
          <table class="student-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Año de Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in filteredStudents" :key="student.id">
                <td>{{ index + 1 }}</td>
                <td>{{ student.id }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.year }}</td>
                <td>
                  <button class="action-btn" @click="sendEmail(student.id)">Enviar Correo</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Botón para cambiar a la página de parámetros -->
        <button class="settings-btn" @click="goToSettings">Modificar Parámetros de Porcentaje</button>
      </div>
  
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  
  export default {
    name: 'SurveyPage',
    components: {
      NavBar,
      FooterComponent,
    },
    data() {
      return {
        surveyData: { completed: 70, notCompleted: 30 },
        customMessage: '',
        lastSentDate: '2024-10-30',
        students: [
          { id: 1, name: 'Juan Perez', year: 2020 },
          { id: 2, name: 'Maria Gomez', year: 2021 },
          // Agrega más estudiantes ficticios
        ],
        searchTerm: '',
        filterYear: '',
        years: [2020, 2021, 2022],
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
      sendEmails() {
        alert("Enviando correos a todos los estudiantes que no completaron la encuesta.");
      },
      sendEmail(id) {
        alert(`Enviando correo al estudiante con ID: ${id}`);
      },
      goToSettings() {
        this.$router.push('/settings');
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
      this.renderChart();
    },
  };
  </script>
  
  <style scoped>
  .survey-page {
    padding: 30px;
    max-width: 900px;
    margin: auto;
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
  
  .chart-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .send-all-btn {
    margin: 15px 0;
    padding: 12px 20px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .send-all-btn:hover {
    background-color: #0056b3;
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
    background-color: #007BFF;
    color: #fff;
    font-weight: bold;
  }
  
  .student-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  .action-btn {
    padding: 6px 12px;
    background-color: #28a745;
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
  </style>
  