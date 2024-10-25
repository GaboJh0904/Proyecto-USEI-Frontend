<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>

    <main class="resume-container">
    

      <div class="resume-form">
        <h1 class="resume-title">Respuestas de la Encuesta</h1>
        <!-- Mostrar un mensaje si no hay respuestas -->
        <p v-if="respuestas.length === 0">
          No se encontraron respuestas para este estudiante.
        </p>

        <!-- Iterar sobre las respuestas y mostrar la pregunta asociada -->
        <p v-else v-for="(respuesta, index) in respuestas" :key="index">
          <strong>{{ respuesta.preguntaIdPregunta?.pregunta || 'Pregunta no disponible' }}</strong>
          {{ respuesta.respuesta || 'Sin respuesta' }}
        </p>

        <div class="pagination-controls">
          <button @click="fetchRespuestas(currentPage - 1)" :disabled="currentPage === 0">Anterior</button>
          <span class="pagination-info">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
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
  background-color: #263D42;
  padding: 15px 0px;
}

.resume-container {
  padding: 110px 40px; /* Ajuste para el header fijo */
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  width: 90%;
  max-width: 850px;
}

.resume-title {
  font-size: 32px;
  font-weight: 700;
  color: #34495e;
  text-align: center;
  margin-bottom: 2rem;
} 

.resume-form {
  background-color: #F0F5EF;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
}

.resume-form p {
  font-size: 1.1rem;
  color: #34495e;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.resume-form strong {
  font-weight: 600;
  color: #2c3e50;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.back-button {
  background-color: #34495e;
  color: white;
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.back-button:hover {
  background-color: #2c3e50;
  transform: translateY(-2px);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2.5rem 0 1.5rem;
}

.pagination-controls button {
  margin: 0 1rem;
  padding: 0.5rem 2rem;
  background-color: #34495e;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.pagination-controls button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination-controls button:not(:disabled):hover {
  background-color: #2c3e50;
  transform: translateY(-2px);
}

.pagination-info {
  font-size: 0.95rem;
  color: #34495e;
  margin: 0 0.5rem;
}
</style>
