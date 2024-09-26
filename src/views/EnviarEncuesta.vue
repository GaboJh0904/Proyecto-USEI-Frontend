<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>

    <main class="survey-completion-container">
      <h1 class="survey-completion-title">Completar Encuesta</h1>

      <!-- Formulario de encuesta (simplificado para este ejemplo) -->
      <div class="survey-form-container">
        <h2>Encuesta de Satisfacción</h2>
        <form @submit.prevent="submitSurvey">
          <div class="form-group">
            <label for="question1">Pregunta 1:</label>
            <input v-model="respuesta.pregunta1" type="text" id="question1" placeholder="Tu respuesta..." required />
          </div>
          <div class="form-group">
            <label for="question2">Pregunta 2:</label>
            <input v-model="respuesta.pregunta2" type="text" id="question2" placeholder="Tu respuesta..." required />
          </div>
          <button type="submit" class="submit-button">Enviar Encuesta</button>
        </form>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'CompletarEncuesta',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      respuesta: {
        pregunta1: '', // Respuesta a la pregunta 1
        pregunta2: '', // Respuesta a la pregunta 2
        estudianteIdEstudiante: 1, // Supongamos que el estudiante tiene ID 1
        preguntaIdPregunta: 1 // Supongamos que es la primera pregunta
      }
    };
  },
  methods: {
    // Método para enviar la respuesta de la encuesta
    async submitSurvey() {
      try {
        const response = await axios.post('http://localhost:8082/respuesta', this.respuesta);
        // Verificar que la respuesta del servidor sea satisfactoria
        if (response.status === 201) {
          // Mostrar la notificación de éxito usando SweetAlert2
          Swal.fire({
            icon: 'success',
            title: '¡Encuesta completada!',
            text: 'Tu respuesta ha sido registrada exitosamente.',
            confirmButtonText: 'Aceptar'
          });
          // Resetear el formulario después de enviar la encuesta
          this.respuesta = {
            pregunta1: '',
            pregunta2: '',
            estudianteIdEstudiante: 1,
            preguntaIdPregunta: 1
          };
        } else {
          // Manejar otros casos de respuesta
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo registrar tu respuesta. Inténtalo nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      } catch (error) {
        // Mostrar mensaje de error en caso de fallo de la solicitud
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar la respuesta. Por favor, inténtalo más tarde.',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error al enviar la respuesta:', error);
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

.survey-completion-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
}

.survey-completion-title {
  font-size: 25px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 1.5rem;
}

.survey-form-container {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
}

.survey-form-container h2 {
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #263D42;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #263D42;
  border-radius: 5px;
}

.submit-button {
  background-color: #263D42;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #1F2E34;
}
</style>
