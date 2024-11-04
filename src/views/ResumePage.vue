<template>
  <div>
    <header>
      <NavBar userRole="Student" />
    </header>

    <main class="resume-container">
     

      <div class="resume-form">
        <h1 class="resume-title">Revisión de Respuestas</h1>
        <!-- Si no hay respuestas, mostrar un mensaje -->
        <p v-if="Object.keys(filteredForm).length === 0" class="no-responses-message">
          No se encontraron respuestas para mostrar.
        </p>
        
        <!-- Mostrar respuestas si están presentes -->
        <div v-else class="response-list">
          <p v-for="(respuesta, preguntaId) in filteredForm" :key="preguntaId" class="response-item">
            <strong class="question-text">{{ getPreguntaTexto(preguntaId) }}:</strong> {{ respuesta }}
          </p>
        </div>
        
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
import { BASE_URL } from '@/config/globals';

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
      console.log('Datos recibidos en la vista de resumen:', preguntasRespuestas);
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
        const response = await axios.get(`${BASE_URL}/pregunta`);
        this.preguntas = response.data;
        console.log('Preguntas obtenidas:', this.preguntas); // Verificar si las preguntas son obtenidas correctamente
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

        // Verificar si hay preguntas y respuestas
        if (Object.keys(this.filteredForm).length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin respuestas',
            text: 'Por favor responde a todas las preguntas antes de enviar la encuesta.',
            confirmButtonText: 'Aceptar'
          });
          return;
        }

        // Registrar notificación
        const notification = {
          titulo: "Encuesta completada exitosamente",
          contenido: "La encuesta se completó exitosamente, se le envió su certificado a su correo personal. Solicite apoyo si no recibió su certificado.",
          fecha: new Date().toISOString(), // Fecha actual
          estadoNotificacion: false, // Estado inicial como no leído
          estudianteIdEstudiante: { idEstudiante: estudianteId }, // ID del estudiante corregido
          tipoNotificacionIdNotificacion: { idNotificacion: 1 } // Tipo de notificación por defecto
        };

        // Enviar la notificación
        await axios.post(`${BASE_URL}/notificacion`, notification);

        // Enviar respuestas del estudiante a la API
        for (const [preguntaId, respuesta] of Object.entries(this.filteredForm)) {
          if (!respuesta) {
            console.warn(`La pregunta con ID ${preguntaId} no tiene respuesta.`);
            continue; // Saltar respuestas vacías
          }

          const payload = {
            respuesta: respuesta,
            preguntaIdPregunta: { idPregunta: preguntaId },
            estudianteIdEstudiante: { idEstudiante: estudianteId }
          };

          console.log('Enviando respuesta:', payload); // Para depuración

          try {
            await axios.post(`${BASE_URL}/respuesta`, payload);
          } catch (error) {
            console.error(`Error al enviar la respuesta de la pregunta ${preguntaId}:`, error);
          }
        }

        // Cambiar el estado de la encuesta a "Completada"
        const estadoEncuesta = {
          estado: 'Completado',
          fechaEstado: new Date().toISOString(), // Fecha actual
          estudianteIdEstudiante: { idEstudiante: estudianteId },
          encuestaIdEncuesta: { idEncuesta: this.encuestaId }
        };

        await axios.post(`${BASE_URL}/estado_encuesta`, estadoEncuesta);

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

*, h1 {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

header{
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: #263D42;
}

.resume-container {
  padding: 110px 40px; /* Ajuste para que el contenido no sea cubierto por el header */
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.resume-form {
  background-color: #F0F5EF;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
}

.resume-title {
  font-size: 28px;
  font-weight: 700;
  color: #263D42;
  text-align: center;
  margin-bottom: 1.5rem;
}

.no-responses-message {
  font-size: 18px;
  color: #8B8B8B;
  text-align: center;
  margin: 2rem 0;
}

.response-list {
  margin: 1rem 0;
}

.response-item {
  font-size: 1rem;
  color: #34495e;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.75rem;
}

.question-text {
  font-weight: 600;
  color: #263D42;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.back-button,
.submit-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.back-button {
  background-color: #6c5b7b;
  color: white;
}

.back-button:hover {
  background-color: #574e6d;
  transform: translateY(-2px);
}

.submit-button {
  background-color: #263D42;
  color: white;
}

.submit-button:hover {
  background-color: #1e2f34;
  transform: translateY(-2px);
}
</style>
