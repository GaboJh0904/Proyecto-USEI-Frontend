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
        <input type="text" v-model="searchQuery" @input="fetchRespuestas" placeholder="Buscar por pregunta o respuesta" class="search-input" />
        
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
                <button class="sort-button" @click="sort('idPregunta')">
                  <i class="fas fa-sort"></i>
                </button>
              </th>
              <th>Pregunta 
                <button class="sort-button" @click="sort('pregunta')">
                  <i class="fas fa-sort"></i>
                </button>
              </th>
              <th>Respuesta 
                <button class="sort-button" @click="sort('respuesta')">
                  <i class="fas fa-sort"></i>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(respuesta, index) in respuestas" :key="index">
              <td>{{ respuesta.pregunta.idPregunta || 'ID no disponible' }}</td>
              <td>{{ respuesta.pregunta?.pregunta || 'Pregunta no disponible' }}</td>
              <td class="wide-column">
                <input type="text" :value="respuesta.respuesta || 'Respuesta no disponible'" readonly class="response-input" /></td>
            </tr>
          </tbody>
        </table>
      </div>
   <!-- Mostrar mensaje si no hay coincidencias -->
   <div v-else>
        <p>No hay coincidencias para la búsqueda realizada.</p>
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
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import { BASE_URL } from '@/config/globals';

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
      selectedSortBy: '', // Campo a ordenar
      selectedSortType: 'ASC', // Tipo de ordenacion (ASC o DESC)     
      currentPage: 1, // Pagina actual para la paginacion
      totalPages: 5, 
      pageSize: 10,  
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
    this.currentPage = 1;  // Establecer página inicial en 1
    this.pageSize = 10;  // Tamaño de página por defecto
    this.selectedSortBy = 'idPregunta'; // Ordenar por idPregunta por defecto
    this.selectedSortType = 'ASC'; // Ordenar de forma ascendente por defecto
    this.fetchFechaEncuesta(); 
    this.fetchRespuestas(); 
    this.fetchTiposDePregunta();
  },
  methods: {
    async fetchFechaEncuesta() {
      const idEstudiante = this.$route.params.idEstudiante; 
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/estado_encuesta/estudiante/${idEstudiante}`);
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
    handlePageClick(pageNumber) {
    this.currentPage = pageNumber; 
    this.fetchRespuestas();        
  },

  async fetchRespuestas() {
  console.log('Ejecutando fetchRespuestas');
  const idEstudiante = this.$route.params.idEstudiante;
  try {
    const pageToFetch = this.currentPage - 2;
    console.log('Solicitando página', pageToFetch, 'con tamaño de página', this.pageSize);

    // Llamar a la API con el parámetro de búsqueda (searchQuery)
    const response = await this.$protectedAxios.get(`${BASE_URL}/respuesta/estudiante/${idEstudiante}`, {
      params: {
        tipoPregunta: this.selectedFilter !== '' ? this.selectedFilter : null,
        sortBy: this.selectedSortBy || 'pregunta',
        sortType: this.selectedSortType || 'ASC',
        page: pageToFetch,
        pageSize: this.pageSize,
        searchQuery: this.searchQuery || '' // Pasar el parámetro de búsqueda
      }
    });

    console.log('Datos recibidos:', response.data);

      if (response.data && response.data.content && response.data.content.length > 0) {
        // Si hay respuestas, las asignamos
        this.respuestas = response.data.content.map(respuesta => ({
          pregunta: respuesta.preguntaIdPregunta || null,
          respuesta: respuesta.respuesta || 'Sin respuesta'
        }));
        this.totalPages = response.data.totalPages;
      } else {
        // Si no se encontraron respuestas, vaciar el array
        this.respuestas = [];
        console.error('No se encontraron respuestas para este estudiante');
      }
    } catch (error) {
      console.error('Error al obtener las respuestas:', error);
      this.respuestas = []; // Manejar el caso de error vacío
    }
  },


    async fetchTiposDePregunta() {
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/pregunta/tipos`); 
        this.tiposPregunta = response.data; 
      } catch (error) {
        console.error('Error al obtener los tipos de pregunta:', error);
      }
    },
   


    sort(column) {
      if (this.selectedSortBy === column) {
        // Si ya se está ordenando por esta columna, invierte el tipo de ordenación
        this.selectedSortType = this.selectedSortType === 'ASC' ? 'DESC' : 'ASC';
      } else {
        // Si se selecciona una nueva columna, ordena por esa columna en orden ascendente
        this.selectedSortBy = column;
        this.selectedSortType = 'ASC';
      }
      this.fetchRespuestas(); // Vuelve a cargar las respuestas con el nuevo orden
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