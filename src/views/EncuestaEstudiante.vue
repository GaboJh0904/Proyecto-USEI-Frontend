<template>
  <div>
    <!-- Header Section -->
    <header>
      <NavBar userRole="Student" />
    </header>

    <!-- Main Section with Form -->
    <main class="survey-container">
      <div class="survey-form-container">
        <h1 class="survey-title">ENCUESTA</h1>
        <form @submit.prevent="goToResume" class="survey-form">
          <!-- Render Dynamic Questions -->
          <div
            v-for="(question, index) in questions"
            :key="question.idPregunta"
            class="form-group"
          >
            <label :for="'question-' + index">{{ question.pregunta }}</label>
            <div class="input-warning-container">
              <span
                v-if="!isAnswered(question.idPregunta)"
                class="warning-icon"
                @click="showWarning(question.pregunta)"
              >
                <i class="fas fa-exclamation-circle"></i>
              </span>
              <!-- Question Types -->
              <template v-if="question.tipoPregunta === 'Seleccion'">
                <select
                  :id="'question-' + index"
                  v-model="answers[question.idPregunta]"
                  :disabled="isFieldDisabled(index)"
                >
                  <option
                    v-for="option in question.opciones"
                    :key="option.idOpciones"
                    :value="option.opcion"
                  >
                    {{ option.opcion }}
                  </option>
                </select>
              </template>

              <template v-else-if="question.tipoPregunta === 'Texto'">
                <input
                  :id="'question-' + index"
                  type="text"
                  v-model="answers[question.idPregunta]"
                  @input="validateTextInput($event, question.idPregunta)"
                  :disabled="isFieldDisabled(index)"
                />
              </template>

              <template v-else-if="question.tipoPregunta === 'Numerico'">
                <input
                  :id="'question-' + index"
                  type="text"
                  v-model="answers[question.idPregunta]"
                  @input="validatePhoneInput($event, question.idPregunta)"
                  :disabled="isFieldDisabled(index)"
                />
              </template>

              <template v-else-if="question.tipoPregunta === 'Multiple'">
                <div
                  v-for="option in question.opciones"
                  :key="option.idOpciones"
                  class="checkbox-group"
                >
                  <input
                    type="checkbox"
                    :id="'option-' + option.idOpciones"
                    :value="option.opcion"
                    v-model="answers[question.idPregunta]"
                    :disabled="isFieldDisabled(index)"
                  />
                  <label :for="'option-' + option.idOpciones">{{ option.opcion }}</label>
                </div>
              </template>
            </div>
          </div>

          <div class="form-actions">
            <button class="volver-button" @click="goBack">Volver</button>
            <button
              class="clear-button"
              type="button"
              @click="clearForm"
            >
              Limpiar Respuestas
            </button>
            <button
              class="submit-button"
              :disabled="isNextDisabled()"
              :class="{ 'disabled-button': isNextDisabled(), 'enabled-button': !isNextDisabled() }"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';
import { BASE_URL } from '@/config/globals';

export default {
  name: 'EncuestaEstudiante',
  components: {
    NavBar,
    FooterComponent,
  },
  data() {
    return {
      questions: [], // Preguntas obtenidas de la API
      answers: JSON.parse(localStorage.getItem('surveyAnswers')) || {}, // Respuestas almacenadas en localStorage
      estudianteId: null, // ID del estudiante que inició sesión
    };
  },
  mounted() {
    // Obtener el ID del estudiante desde localStorage
    this.estudianteId = localStorage.getItem('id_estudiante');
    if (!this.estudianteId) {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'No se encontró un ID de estudiante válido',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        this.$router.push({ name: 'Home' });
      });
    } else {
      // Cargar las preguntas al montar el componente
      this.fetchQuestions();
    }
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/pregunta`);
        let questions = response.data;

        // Filtrar solo preguntas con estado ACTIVO
        questions = questions.filter((question) => question.estado === 'ACTIVO');

        // Para cada pregunta, obtener sus opciones (si aplica)
        for (let question of questions) {
          if (question.tipoPregunta === 'Seleccion' || question.tipoPregunta === 'Multiple') {
            const optionsResponse = await this.$protectedAxios.get(
              `${BASE_URL}/opciones_pregunta/pregunta/${question.idPregunta}`
            );
            question.opciones = optionsResponse.data;
          } else {
            question.opciones = []; // No hay opciones para preguntas de tipo 'Texto'
          }
        }

        this.questions = questions;

        // Sincronizar respuestas con preguntas actuales
        this.syncAnswersWithQuestions();
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        Swal.fire('Error', 'Ocurrió un problema al cargar las preguntas.', 'error');
      }
    },

    syncAnswersWithQuestions() {
      // Asegurarse de que las respuestas previas se mantengan para las preguntas actuales
      this.questions.forEach((question) => {
        if (!(question.idPregunta in this.answers)) {
          this.answers[question.idPregunta] = ''; // Inicializar respuesta si no existe
        }
      });

      // Guardar las respuestas sincronizadas en localStorage
      this.saveAnswersToLocalStorage();
    },

    saveAnswersToLocalStorage() {
      // Guardar respuestas actuales en localStorage
      localStorage.setItem('surveyAnswers', JSON.stringify(this.answers));
    },

    validateTextInput(event, field) {
      const value = event.target.value.replace(/[^a-zA-Z\s@.]/g, ''); // Solo letras y espacios
      this.answers[field] = value;
      this.saveAnswersToLocalStorage(); // Guardar respuestas actualizadas
    },

    validatePhoneInput(event, field) {
      const value = event.target.value.replace(/\D/g, ''); // Solo números
      this.answers[field] = value;
      this.saveAnswersToLocalStorage(); // Guardar respuestas actualizadas
    },

    isFieldDisabled(index) {
      if (index === 0) {
        return false; // La primera pregunta siempre está habilitada
      }

      for (let i = 0; i < index; i++) {
        const questionId = this.questions[i].idPregunta;
        const answer = this.answers[questionId];

        if (!answer) {
          return true; // Si una pregunta anterior no ha sido respondida, deshabilitar esta
        }
      }

      return false;
    },

    isAnswered(questionId) {
      const answer = this.answers[questionId];
      return answer !== '' && answer !== undefined;
    },

    showWarning(questionText) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo incompleto',
        text: `Por favor, completa la pregunta: "${questionText}" para continuar con la siguiente pregunta.`,
        confirmButtonText: 'Aceptar',
      });
    },
    clearForm() {
      // Restablecer respuestas y campos
      this.answers = {};
      Swal.fire("Formulario limpiado", "Todas las respuestas han sido borradas.", "info");
    },

    goBack() {
      this.$router.go(-1);
    },

    goToResume() {
      if (this.isFormComplete()) {
        // Guardar respuestas en localStorage
        this.saveAnswersToLocalStorage();

        // Navegar al resumen
        this.$router.push({
          name: 'ResumePage',
          query: { ...this.answers, estudianteId: this.estudianteId },
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Por favor, complete todos los campos obligatorios.',
          confirmButtonText: 'Continuar',
        });
      }
    },

    isFormComplete() {
      return this.questions.every((question) => {
        return this.answers[question.idPregunta] !== '' && this.answers[question.idPregunta] !== undefined;
      });
    },

    isNextDisabled() {
      return !this.isFormComplete();
    },
  },
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

/* General Reset and Font Settings */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

/* Header Styling */
header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: #263D42;
  padding: 15px 0px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

/* Survey Container */
.survey-container {
  padding: 120px 40px; /* Adjust for fixed header */
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Form Container */
.survey-form-container {
  background-color: #F0F5EF;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 55rem;
  width: 100%;
  transition: transform 0.3s;
}

.survey-form-container:hover {
  transform: translateY(-5px);
}

/* Title Styling */
.survey-title {
  font-size: 36px;
  font-weight: 700;
  color: #34495e;
  text-align: center;
  margin-bottom: 2rem;
}

/* Form Styling */
.survey-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Input Styling */
.form-group select,
.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #bdc3c7;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group select:focus,
.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus,
.form-group input[type="tel"]:focus {
  border-color: #6c5b7b;
  outline: none;
}

/* Warning Icon */
.warning-icon {
  color: #f39c12;
  cursor: pointer;
  font-size: 1.2em;
  transition: transform 0.3s;
}

.warning-icon:hover {
  transform: scale(1.1);
}

.input-warning-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Checkbox Styling */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group label {
  font-size: 0.9rem;
  color: #34495e;
}

/* Action Buttons */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.submit-button,
.volver-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.volver-button {
  background-color: #6c5b7b;
  color: white;
}

.volver-button:hover {
  background-color: #574e6d;
  transform: translateY(-2px);
}

.submit-button {
  background-color: #263D42;
  color: white;
}

.submit-button:enabled:hover {
  background-color: #1e2f34;
  transform: translateY(-2px);
}

.submit-button:disabled {
  background-color: #bdc3c7;
  color: #7f8c8d;
  cursor: not-allowed;
}
.clear-button {
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.clear-button:hover {
  background-color: #d35400;
  transform: translateY(-2px);
}
</style>