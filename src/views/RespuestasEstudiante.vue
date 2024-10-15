<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>
    <main class="student-survey-container">
      <h1>Respuestas de la Encuesta</h1>
      
      <div v-if="estudiante" class="student-info">
        <h2>Estudiante: {{ estudiante.nombre }} {{ estudiante.apellido }}</h2>
        <p><strong>Fecha de envio de encuesta:</strong> {{ formattedFechaEncuesta || 'Fecha no disponible' }}</p>
      </div>

      <div v-if="respuestas.length > 0" class="questions-container">
        <ul>
          <li v-for="(respuesta, index) in respuestas" :key="index" class="question-item">
            <p><strong>Pregunta {{ index + 1 }}:</strong> {{ respuesta.pregunta?.pregunta || 'Pregunta no disponible' }}</p>
            <input type="text" :value="respuesta.respuesta || 'Respuesta no disponible'" readonly class="response-input"/>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No se encontraron respuestas para este estudiante.</p>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'RespuestasEstudiante',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      estudiante: null, 
      respuestas: [], 
      fechaEncuesta: null, 
    };
  },
  computed: {
    formattedFechaEncuesta() {
      if (this.fechaEncuesta) {
        const date = new Date(this.fechaEncuesta);
        return date.toLocaleDateString(); 
      }
      return null;
    }
  },
  mounted() {
    this.fetchFechaEncuesta(); 
    this.fetchRespuestas(); 
  },
  methods: {

    async fetchFechaEncuesta() {
      const idEstudiante = this.$route.params.idEstudiante; 
      try {
        const response = await axios.get(`http://localhost:8082/estado_encuesta/estudiante/${idEstudiante}`);
        if (response.data) {
          this.fechaEncuesta = response.data.fechaEstado; 
          this.estudiante = response.data.estudianteIdEstudiante;
        } else {
          console.error('No se encontró estado de encuesta para este estudiante');
        }
      } catch (error) {
        console.error('Error al obtener la fecha de la encuesta:', error);
      }
    },

    async fetchRespuestas() {
      const idEstudiante = this.$route.params.idEstudiante; 
      try {
        const response = await axios.get(`http://localhost:8082/respuesta/estudiante/${idEstudiante}`); // Solicitud al backend
        if (response.data && response.data.length > 0) {
          this.respuestas = response.data.map(respuesta => ({
            pregunta: respuesta.preguntaIdPregunta || null, 
            respuesta: respuesta.respuesta || 'Sin respuesta'
          }));
        } else {
          console.error('No se encontraron respuestas para este estudiante');
        }
      } catch (error) {
        console.error('Error al obtener las respuestas:', error);
      }
    }
  }
}
</script>

<style scoped>
.student-survey-container {
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.student-info h2 {
  margin-bottom: 10px;
  line-height: 1.6;
}
.student-info p {
  line-height: 1.6;
}

.questions-container {
  background-color: #c6d7d7;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}
.question-item {
  margin-bottom: 20px;
}

.response-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #e9e9e9;
}
</style>


  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
  
  .sortable {
    cursor: pointer;
  }
  
  .sortable i {
    margin-left: 5px;
    font-size: 0.9em;
  }
  
  
  .filters-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    width: 100%;
    max-width: 48rem;
    gap: 20px; 
  }
  
  
  .search-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #929292;
    border-radius: 15px;
    width: 60%;
  }
  
  .filter-select {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #929292;
    border-radius: 15px;
    width: 35%;
  }
  
  
  
  header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
  .student-list-container {
    padding-top: 80px;
    min-height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
  }
  .student-list-title {
    font-size: 25px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 1.5rem;
  }
  .student-table-container {
    background-color: #CBDADB;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 48rem;
  }
  .student-table-container table {
    width: 100%;
    border-collapse: collapse;
  }
  .student-table-container th,
  .student-table-container td {
    border: 1px solid #263D42;
    padding: 12px;
    text-align: left;
  }
  .student-table-container th {
    background-color: #263D42;
    color: white;
  }
  .send-button {
    background-color: #263D42;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 15px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }
  /* .send-button:hover {
    background-color: #1F2E34;
  } */
  
  .send-button:disabled {
    background-color: #bab7b7;
    cursor: not-allowed;
  }
  
  .send-button:hover:enabled {
    background-color: #1F2E34;
  }
  </style>