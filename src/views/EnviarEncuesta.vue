<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>
    <main class="student-list-container">
      <h1 class="student-list-title">Estudiantes que Completaron la Encuesta</h1>

      <div class="student-table-container">
        <h2 class="table-subtitle">Lista de Estudiantes</h2>
        <table>
          <thead>
            <tr>
              <th @click="toggleSort('nombre')" class="sortable">
                Nombre del Estudiante
                <i :class="sortOrder === 'asc' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'"></i>
              </th>
              <th>Estado</th>
              <th>Encuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody v-if="sortedEstudiantes.length > 0">
            <tr v-for="estudiante in sortedEstudiantes" :key="estudiante.idEstudiante">
              <td>{{ estudiante.estudianteIdEstudiante.nombre }} {{ estudiante.estudianteIdEstudiante.apellido }}</td>
              <td :class="estudiante.estado.toLowerCase()">{{ estudiante.estado }}</td>
              <td>
                <button @click="verEncuesta(estudiante.estudianteIdEstudiante.idEstudiante)" class="view-survey-button">
                  Ver Encuesta
                </button>
              </td>
              <td>
                <button 
                  @click="enviarCertificado(estudiante.estudianteIdEstudiante.idEstudiante)" 
                  class="send-button"
                  :disabled="estudiante.estado.trim().toLowerCase() === 'enviado'">
                  Enviar Certificado
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="no-results">No se encontraron estudiantes que coincidan con los criterios de búsqueda.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';  
import { BASE_URL } from '@/config/globals';

export default {
  name: 'EnviarEncuesta',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      estudiantes: [], 
      searchQuery: '',
      selectedEstado: '', 
      sortOrder: 'asc',
    };
  },
  mounted() {
    this.fetchEstudiantes(); 
  },
  computed: {
    filteredEstudiantes() {
      return this.estudiantes.filter(estudiante => {
        const fullName = `${estudiante.estudianteIdEstudiante.nombre} ${estudiante.estudianteIdEstudiante.apellido}`.toLowerCase();
        const matchesName = fullName.includes(this.searchQuery.toLowerCase());
        const matchesEstado = this.selectedEstado 
          ? estudiante.estado.trim().toLowerCase() === this.selectedEstado.trim().toLowerCase() 
          : true;

        return matchesName && matchesEstado;
      });
    },
    sortedEstudiantes() {
      return this.filteredEstudiantes.sort((a, b) => {
        const fullNameA = `${a.estudianteIdEstudiante.nombre} ${a.estudianteIdEstudiante.apellido}`.toLowerCase();
        const fullNameB = `${b.estudianteIdEstudiante.nombre} ${b.estudianteIdEstudiante.apellido}`.toLowerCase();

        if (this.sortOrder === 'asc') {
          return fullNameA.localeCompare(fullNameB);
        } else {
          return fullNameB.localeCompare(fullNameA);
        }
      });
    }
  },
  methods: {
    async fetchEstudiantes() {
      try {
        const response = await axios.get(`${BASE_URL}/estado_certificado`);
        if (response.data && Array.isArray(response.data)) {
          this.estudiantes = response.data;
        } else {
          console.error('Respuesta inesperada:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
      }
    },
    toggleSort() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    async enviarCertificado(idEstudiante) {
      if (!idEstudiante) {
        Swal.fire('Error', 'ID del estudiante no encontrado', 'error');
        return;
      }

      try {
        const response = await axios.post(`${BASE_URL}/certificado/remision`, null, {
          params: {
            idEstudiante: idEstudiante
          }
        });

        await Swal.fire({
          icon: 'success',
          title: 'Certificado enviado correctamente',
          confirmButtonText: 'Continuar'
        });

        this.fetchEstudiantes();
        
      } catch (error) {
        Swal.fire('Error', 'No se pudo enviar el certificado o registrar la notificación', 'error');
        console.error('Error al enviar el certificado o registrar la notificación:', error);
      }
    },
    verEncuesta(idEstudiante) {
      this.$router.push({
        name: 'RespuestasEstudiante',
        params: { idEstudiante }
      });
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.student-list-container {
  padding-top: 100px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.student-list-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #263d42;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.student-table-container {
  background-color: #ccdbdc;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
  animation: fadeIn 0.5s ease;
}

.table-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #263d42;
  text-align: center;
  margin-bottom: 1.5rem;
}

.student-table-container table {
  width: 100%;
  border-collapse: collapse;
}

.student-table-container th,
.student-table-container td {
  border: 1px solid #263d42;
  padding: 14px;
  text-align: left;
}

.student-table-container th {
  background-color: #263d42;
  color: #ccdbdc;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.student-table-container th:hover {
  background-color: #1F2E34;
}

.student-table-container td {
  font-size: 1rem;
  color: #333;
}

.student-table-container .no-results {
  text-align: center;
  font-size: 1rem;
  color: #8e6c88;
  padding: 2rem 0;
}

.sortable {
  display: flex;
  align-items: center;
}

.sortable i {
  margin-left: 5px;
  font-size: 0.9em;
}

.view-survey-button,
.send-button {
  background-color: #80ced7;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
}

.view-survey-button:hover,
.send-button:hover:enabled {
  background-color: #63c7b2;
  transform: scale(1.05);
}

.send-button:disabled {
  background-color: #bab7b7;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
