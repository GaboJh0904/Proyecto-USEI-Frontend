<template>
  <div>
    <header>
      <NavBar userRole="Student" />
    </header>

    <main class="resume-container">
      <h1 class="resume-title">Revisión de Respuestas</h1>

      <div class="resume-form">
        <!-- Iterar sobre las respuestas, pero excluir el 'estudianteId' -->
        <p v-for="(respuesta, preguntaId) in filteredForm" :key="preguntaId">
          <strong>{{ getPreguntaTexto(preguntaId) }}:</strong> {{ respuesta }}
        </p>
        
        <div class="form-actions">
          <button class="back-button" @click="goBackToSurvey">Regresar a la Encuesta</button>
          <button class="submit-button" @click="submitSurvey">Enviar</button>
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
  name: 'ResumePage',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      form: this.$route.query, // Recibe los datos del formulario desde query params
      preguntas: [], // Lista de preguntas obtenida desde la base de datos
      encuestaId: this.$route.params.idEncuesta || 1, // ID dinámico de la encuesta (cambiar según sea necesario)
    };
  },
  computed: {
    // Excluir 'estudianteId' del formulario para mostrar sólo las preguntas y respuestas
    filteredForm() {
      const { estudianteId, ...preguntasRespuestas } = this.form;
      return preguntasRespuestas;
    }
  },
  mounted() {
    // Obtener todas las preguntas para mostrar el texto en el resumen
    this.fetchPreguntas();
  },
  methods: {
    async fetchPreguntas() {
      try {
        const response = await axios.get('http://localhost:8082/pregunta');
        this.preguntas = response.data;
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        Swal.fire('Error', 'Ocurrió un problema al cargar las preguntas.', 'error');
      }
    },

    // Método para obtener el texto de una pregunta según su ID
    getPreguntaTexto(idPregunta) {
      const pregunta = this.preguntas.find(p => p.idPregunta == idPregunta);
      return pregunta ? pregunta.pregunta : `Pregunta no encontrada para ID: ${idPregunta}`;
    },

    goBackToSurvey() {
      localStorage.setItem('surveyAnswers', JSON.stringify(this.form));
      this.$router.push({ name: 'encuestaEstudiante', query: { fromResume: true } });
    },

    async submitSurvey() {
      try {
        const estudianteId = this.form.estudianteId;
        if (!estudianteId) {
          throw new Error('El ID del estudiante no está disponible.');
        }

        // Enviar respuestas del estudiante a la API
        for (const [preguntaId, respuesta] of Object.entries(this.filteredForm)) {
          await axios.post('http://localhost:8082/respuesta', {
            respuesta: respuesta,
            preguntaIdPregunta: { idPregunta: preguntaId },
            estudianteIdEstudiante: { idEstudiante: estudianteId }
          });
        }

        // Cambiar el estado de la encuesta a "Completada"
        const estadoEncuesta = {
          estado: 'Completada',
          fechaEstado: new Date().toISOString(), // Fecha actual
          estudianteIdEstudiante: { idEstudiante: estudianteId },
          encuestaIdEncuesta: { idEncuesta: this.encuestaId }
        };

        await axios.post('http://localhost:8082/estado_encuesta', estadoEncuesta);

        // Mostrar notificación de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Encuesta enviada!',
          text: 'Tu encuesta ha sido enviada y marcada como completada exitosamente.',
          confirmButtonText: 'Aceptar'
        });

        // Limpiar respuestas guardadas en localStorage
        localStorage.removeItem('surveyAnswers');
        this.$router.push('/menu-estudiante');
      } catch (error) {
        console.error('Detalles del error:', error);

        // Mostrar mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar la encuesta. Por favor, inténtalo más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
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

.submit-button, .back-button {
  background-color: #263D42;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.submit-button:hover, .back-button:hover {
  background-color: #1F2E34;
}
</style>
