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

         <!-- Contenedor de filtros, busqueda y ordenacion -->
      <div class="filter-search-container">
        <input type="text" v-model="searchQuery" placeholder="Buscar..." class="search-input" />
        
        <select v-model="selectedFilter" class="filter-select" @change="fetchRespuestas">
          <option value="">Filtrar por tipo de pregunta</option>
          <option value="">Todos</option>

          <option v-for="tipo in tiposPregunta" :key="tipo" :value="tipo">{{ tipo }}</option>
        </select>
      </div>

      <!-- Tabla de preguntas y respuestas -->
      <div v-if="respuestas.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th># 
                <button class="sort-button">
                  <i class="fas fa-sort"></i>
                </button>
              </th>
              <th>Pregunta 
                <button class="sort-button">
                  <i class="fas fa-sort"></i>
                </button>
              </th>
              <th>Respuesta 
                <button class="sort-button">
                  <i class="fas fa-sort"></i>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(respuesta, index) in respuestas" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ respuesta.pregunta?.pregunta || 'Pregunta no disponible' }}</td>
              <td class="wide-column">
                <input type="text" :value="respuesta.respuesta || 'Respuesta no disponible'" readonly class="response-input" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else>
        <p>No se encontraron respuestas para este estudiante.</p>
      </div>
      <PaginationComponent
        :page-count="totalPages"
        :current-page="currentPage"
        @page-changed="handlePageClick"
      />
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
export default {
  name: 'RespuestasEstudiante',
  components: {
    NavBar,
    FooterComponent,
    PaginationComponent,

  },
  data() {
    return {
      estudiante: null, 
      respuestas: [], 
      fechaEncuesta: null, 
      searchQuery: '', // Campo de busqueda
      selectedFilter: '', // Filtro seleccionado
      selectedSort: '', // Orden seleccionado
      currentPage: 1, // Pagina actual para la paginacion
      totalPages: 3, 
      tiposPregunta: [],
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
    this.fetchTiposDePregunta();
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
      console.log('Ejecutando fetchRespuestas'); 
      console.log('Tipo de pregunta seleccionado:', this.selectedFilter);

      const idEstudiante = this.$route.params.idEstudiante; 
      try {
        const response = await axios.get(`http://localhost:8082/respuesta/estudiante/${idEstudiante}`, {
          params: {
            tipoPregunta: this.selectedFilter !== '' ? this.selectedFilter : null // Asegúrate de que el filtro se envíe si está seleccionado
          }
      });
      console.log('Datos recibidos:', response.data); // Verifica si se reciben datos

      if (response.data && response.data.length > 0) {
          this.respuestas = response.data.map(respuesta => ({
            pregunta: respuesta.preguntaIdPregunta || null,
            respuesta: respuesta.respuesta || 'Sin respuesta'
          }));
        } else {
          this.respuestas = []; 

          console.error('No se encontraron respuestas para este estudiante');
        }
      } catch (error) {
        console.error('Error al obtener las respuestas:', error);
      }
    },
    async fetchTiposDePregunta() {
      try {
        const response = await axios.get('http://localhost:8082/pregunta/tipos'); 
        this.tiposPregunta = response.data; 
      } catch (error) {
        console.error('Error al obtener los tipos de pregunta:', error);
      }
    },
    handlePageClick(pageNumber) {
      this.currentPage = pageNumber;
    },
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

.filter-search-container {
  margin: 20px 0;
  display: flex;
  gap: 20px;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #929292;
  border-radius: 10px;
  width: 60%;
}

.filter-select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #929292;
  border-radius: 10px;
  width: 30%;
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
.table-container {
  margin-top: 20px;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #263d42;
  color: white;
  position: relative;

}

td input.response-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #e9e9e9;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}
.wide-column {
  width: 50%;
}

.sort-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0 5px;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.sort-button:hover {
  color: #4a787b; 
}
.sort-button:active {
  color: #916d9f; 
}

.sort-button i {
  font-size: 12px;
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
  
  header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
  
 
  </style>