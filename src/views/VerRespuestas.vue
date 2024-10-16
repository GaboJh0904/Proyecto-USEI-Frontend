<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>

    <main class="resume-container">
      <h1 class="resume-title">Respuestas de la Encuesta</h1>

      <div class="resume-form">
        <!-- Mostrar un mensaje si no hay respuestas -->
        <p v-if="!respuestas.length">
          No se encontraron respuestas para este estudiante.
        </p>

        <!-- Iterar sobre las respuestas -->
        <p v-else v-for="(respuesta, preguntaId) in respuestasForm" :key="preguntaId">
          <strong>{{ getPreguntaTexto(preguntaId) }}:</strong> {{ respuesta }}
        </p>
        
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
      preguntas: [],  // Lista de preguntas obtenida desde la base de datos
      estudianteId: this.$route.params.idEstudiante, // ID del estudiante cuyas respuestas se están viendo
    };
  },
  computed: {
    // Transformar las respuestas para mostrarlas con sus respectivas preguntas
    respuestasForm() {
      const respuestasTransformadas = {};
      this.respuestas.forEach((respuesta) => {
        respuestasTransformadas[respuesta.preguntaIdPregunta.idPregunta] = respuesta.respuesta;
      });
      return respuestasTransformadas;
    }
  },
  mounted() {
    this.fetchRespuestas();
    this.fetchPreguntas();
  },
  methods: {
    async fetchRespuestas() {
      try {
        const response = await axios.get(`http://localhost:8082/respuesta/estudiante/${this.estudianteId}`);
        this.respuestas = response.data;
      } catch (error) {
        console.error('Error al obtener las respuestas:', error);
        Swal.fire('Error', 'Ocurrió un problema al cargar las respuestas.', 'error');
      }
    },

    async fetchPreguntas() {
      try {
        const response = await axios.get('http://localhost:8082/pregunta');
        this.preguntas = response.data;
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        Swal.fire('Error', 'Ocurrió un problema al cargar las preguntas.', 'error');
      }
    },

    // Obtener el texto de una pregunta según su ID
    getPreguntaTexto(idPregunta) {
      const pregunta = this.preguntas.find(p => p.idPregunta == idPregunta);
      return pregunta ? pregunta.pregunta : `Pregunta no encontrada para ID: ${idPregunta}`;
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
</style>
