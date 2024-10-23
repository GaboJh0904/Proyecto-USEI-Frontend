<!-- <template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>

    <main class="resume-container">
      <h1 class="resume-title">Respuestas de la Encuesta</h1>

      <div class="resume-form">
        <p v-if="!respuestas.length">
          No se encontraron respuestas para este estudiante.
        </p>

        <p v-else v-for="(respuesta, index) in respuestas" :key="index">
          <strong>{{ getPreguntaTexto(respuesta.preguntaIdPregunta.idPregunta) }}:</strong> {{ respuesta.respuesta }}
        </p>

        <div class="pagination-controls">
          <button @click="fetchRespuestas(currentPage - 1)" :disabled="currentPage === 0">Anterior</button>
          <span>Página {{ currentPage + 1 }} de {{ totalPages }}</span>
          <button @click="fetchRespuestas(currentPage + 1)" :disabled="currentPage + 1 === totalPages">Siguiente</button>
        </div>

        <div class="form-actions">
          <button class="back-button" @click="goBackToMenu">Regresar al Menú</button>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template> -->

<!-- <script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';  
import axios from 'axios';

export default {
  name: 'VerRespuestas',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      respuestas: [], 
      preguntas: [],  
      estudianteId: this.$route.params.idEstudiante, 
      pageSize: 10, 
      totalPages: 0 
    };
  },
  mounted() {
    this.fetchAllPreguntas();
    this.fetchRespuestas(this.currentPage); 
  },
  methods: {
    async fetchRespuestas(page) {
      try {
        if (page < 0 || (this.totalPages && page >= this.totalPages)) return;

        this.currentPage = page;

        const response = await axios.get(`http://localhost:8082/respuesta/estudiante/${this.estudianteId}`, {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            sortBy: 'IdRespuesta',
            sortType: 'ASC'
          }
        });
        console.log('Datos recibidos:', response.data); 

        this.respuestas = response.data.content;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('Error al obtener las respuestas:', error);
        Swal.fire('Error', 'Ocurrió un problema al cargar las respuestas.', 'error');
      }
    },

    async fetchAllPreguntas() {
      try {
        const response = await axios.get('http://localhost:8082/pregunta', {
          params: {
            page: 0,
            pageSize: 1000, // Un número suficientemente grande para cubrir todas las preguntas
            sortBy: 'numPregunta',
            sortType: 'ASC'
          }
        });

        this.preguntas = response.data.content;
      } catch (error) {
        console.error('Error al obtener todas las preguntas:', error);
        Swal.fire('Error', 'Ocurrió un problema al cargar las preguntas.', 'error');
      }
    },

    getPreguntaTexto(idPregunta) {
      const pregunta = this.preguntas.find(p => p.idPregunta == idPregunta);
      return pregunta ? pregunta.pregunta : `Pregunta no encontrada para ID: ${idPregunta}`;
    },

    goBackToMenu() {
      this.$router.push('/menu-estudiante');
    }
  }
};
</script> -->

<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>

    <main class="resume-container">
      <h1 class="resume-title">Respuestas de la Encuesta</h1>

      <div class="resume-form">
        <!-- Mostrar un mensaje si no hay respuestas -->
        <p v-if="respuestas.length === 0">
          No se encontraron respuestas para este estudiante.
        </p>

        <!-- Iterar sobre las respuestas y mostrar la pregunta asociada -->
        <p v-else v-for="(respuesta, index) in respuestas" :key="index">
          <strong>{{ respuesta.preguntaIdPregunta?.pregunta || 'Pregunta no disponible' }}:</strong>
          {{ respuesta.respuesta || 'Sin respuesta' }}
        </p>

        <div class="pagination-controls">
          <button @click="fetchRespuestas(currentPage - 1)" :disabled="currentPage === 0">Anterior</button>
          <span>Página {{ currentPage + 1 }} de {{ totalPages }}</span>
          <button @click="fetchRespuestas(currentPage + 1)" :disabled="currentPage + 1 === totalPages">Siguiente</button>
        </div>

        <div class="form-actions">
          <button class="back-button" @click="goBackToMenu">Regresar al Menú</button>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  name: 'VerRespuestas',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      respuestas: [], // Respuestas obtenidas desde la API
      estudianteId: this.$route.params.idEstudiante, // ID del estudiante cuyas respuestas se están viendo
      currentPage: 0, // Página actual
      pageSize: 10, // Tamaño de página
      totalPages: 0 // Número total de páginas
    };
  },
  mounted() {
    this.fetchRespuestas(this.currentPage); // Cargar las respuestas de la primera página
  },
  methods: {
    async fetchRespuestas(page) {
      const idEstudiante = this.$route.params.idEstudiante; 

      try {
        // Verificar que la página no sea negativa o superior al límite
        if (page < 0 || (this.totalPages && page >= this.totalPages)) return;

        // Actualizar la página actual
        this.currentPage = page;

        // Llamar a la API para obtener las respuestas
        const response = await axios.get(`http://localhost:8082/respuesta/estudiante/${idEstudiante}`, {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            sortBy: 'IdRespuesta',
            sortType: 'ASC'
          }
        });

        // Depuración para verificar la estructura de los datos recibidos
        console.log('Respuestas recibidas:', response.data.content);

        // Asignar los datos recibidos y la información de la paginación
        this.respuestas = response.data.content || [];
        this.totalPages = response.data.totalPages || 0;
      } catch (error) {
        console.error('Error al obtener las respuestas:', error);
        Swal.fire('Error', 'Ocurrió un problema al cargar las respuestas.', 'error');
      }
    },

    goBackToMenu() {
      this.$router.push('/menu-estudiante');
    }
  }
};
</script>


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

.resume-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 15px;
}

.resume-form {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
}

.resume-title {
  font-size: 25px;
  font-weight: bold;
  color: #000000;
  text-align: left;
  margin-bottom: 1.5rem;
}

.resume-form p {
  font-size: 1rem;
  color: #000000;
  margin-bottom: 1rem;
}

.resume-form strong {
  font-weight: 500;
  color: #263D42;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  width: 100%;
}

.back-button {
  background-color: #263D42;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.back-button:hover {
  background-color: #1F2E34;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.pagination-controls button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #6c5b7b;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.pagination-controls button:hover {
  background-color: #664583;
}
</style>
