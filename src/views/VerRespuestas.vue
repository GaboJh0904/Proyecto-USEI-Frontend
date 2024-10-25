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
  background-color: #263D42; /* Fondo fijo para el header */
}

.resume-container {
  padding-top: 100px; /* Ajuste para compensar el header fijo */
  min-height: 100vh;
  background-color: #f2f4f5;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  width: 90%;
  max-width: 800px;
}

.resume-title {
  font-size: 28px;
  font-weight: 700;
  color: #263D42;
  text-align: center;
  margin-bottom: 2rem;
}

.resume-form {
  background-color: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.resume-form p {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 1.2rem;
  line-height: 1.5;
}

.resume-form strong {
  font-weight: 600;
  color: #263D42;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.back-button {
  background-color: #263D42;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 30px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #1F2E34;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0 1rem;
}

.pagination-controls button {
  margin: 0 0.5rem;
  padding: 0.5rem 1.5rem;
  background-color: #6c5b7b;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-controls button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination-controls button:not(:disabled):hover {
  background-color: #5a4864;
}

.pagination-info {
  font-size: 0.875rem;
  color: #495057;
  margin: 0 0.5rem;
}
</style>
