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
          <!-- Dinámicamente renderizar preguntas -->
          <div v-for="(question, index) in questions" :key="question.idPregunta" class="form-group">
            <label :for="'question-' + index">{{ question.pregunta }}</label>
            <div class="input-warning-container">
              <span v-if="!isAnswered(question.idPregunta)" class="warning-icon" @click="showWarning(question.pregunta)">
                <i class="fas fa-exclamation-circle"></i>
              </span>
            <!-- Tipos de Pregunta -->
            <template v-if="question.tipoPregunta === 'Seleccion'">
              <select :id="'question-' + index" 
              v-model="answers[question.idPregunta]" 
              :disabled="isFieldDisabled(index)"
              >
                <option v-for="option in question.opciones" :key="option.idOpciones" :value="option.opcion">
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
              <div v-for="option in question.opciones" :key="option.idOpciones" class="checkbox-group">
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
            <button class="submit-button" :disabled="isNextDisabled()"
              :class="{ 'disabled-button': isNextDisabled(), 'enabled-button': !isNextDisabled() }"
            >Siguiente</button>
          </div>
        </form>
      </div>
    </main>

    <!-- Footer Section -->
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';  
import axios from 'axios';

export default {
  name: 'EncuestaEstudiante',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      questions: [], // Preguntas obtenidas de la API
      answers: JSON.parse(localStorage.getItem('surveyAnswers')) || {}, // Cargar datos del LocalStorage
      estudianteId: null, // ID del estudiante que inicio sesión
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

    if (!this.$route.query.fromResume) {
      localStorage.removeItem('surveyAnswers');
    } else {
      this.answers = JSON.parse(localStorage.getItem('surveyAnswers')) || {};
    }
  },
  methods: {
    validateTextInput(event, field) {
      const value = event.target.value.replace(/[^a-zA-Z\s@.]/g, '');// Solo letras y espacios
      this.answers[field] = value;
    },

    validatePhoneInput(event, field) {
      const value = event.target.value.replace(/\D/g, ''); // Solo números
      this.answers[field] = value;
    },

    isFieldDisabled(index) {
      // La primera pregunta habilitada
      if (index === 0) {
        return false;
      }
      
      // Revisar si todas las preguntas anteriores han sido respondidas
      for (let i = 0; i < index; i++) {
        const questionId = this.questions[i].idPregunta;
        const answer = this.answers[questionId];

        // Si alguna pregunta anterior no es respondida, deshabilitar el campo
        if (answer === '' || answer === undefined) {
          return true;
        }
      }
      
      return false;
  },

    isAnswered(questionId) {
      const answer = this.answers[questionId];
      return answer !== '' && answer !== undefined;
    },

    showWarning(questionText) {
      // Mostrar mensaje de advertencia de icono
      Swal.fire({
        icon: 'warning',
        title: 'Campo incompleto',
        text: `Por favor, complete la pregunta: "${questionText}", para continuar con la siguiente pregunta`,
        confirmButtonText: 'Aceptar',
      });
    },

    async fetchQuestions() {
      try {
        const response = await axios.get('http://localhost:8082/pregunta');
        let questions = response.data;

        // Filtrar solo preguntas con estado ACTIVO
        questions = questions.filter(question => question.estado === 'ACTIVO');

        // Para cada pregunta, obtener sus opciones (si aplica)
        for (let question of questions) {
          if (question.tipoPregunta === 'Seleccion' || question.tipoPregunta === 'Multiple') {
            const optionsResponse = await axios.get(`http://localhost:8082/opciones_pregunta/pregunta/${question.idPregunta}`);
            question.opciones = optionsResponse.data;
          } else {
            question.opciones = []; // No hay opciones para preguntas de tipo 'Texto'
          }
        }

        this.questions = questions;

        // Si se vuelve desde el resumen, verificar que se mantengan las respuestas
        if (this.$route.query.fromResume) {
          this.syncAnswersWithQuestions();
        }
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        Swal.fire('Error', 'Ocurrió un problema al cargar las preguntas.', 'error');
      }
    },

    syncAnswersWithQuestions() {
      // Si volvemos del resumen, asegurarnos de que las respuestas ya guardadas se sincronicen con las preguntas actuales.
      this.questions.forEach((question) => {
        if (!(question.idPregunta in this.answers)) {
          // Inicializar la respuesta si no existe en el localStorage
          this.answers[question.idPregunta] = '';
        }
      });
    },

    goBack() {
      this.$router.go(-1);
    },
    
    goToResume() {
      // Validación para verificar si todos los campos requeridos están completos
      if (this.isFormComplete()) {
        // Guardar respuestas en el localStorage
        localStorage.setItem('surveyAnswers', JSON.stringify(this.answers));

        // Navegar al resumen
        this.$router.push({
          name: 'ResumePage',
          query: { ...this.answers, estudianteId: this.estudianteId }
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
      // Verificar que todas las preguntas tengan una respuesta
      return this.questions.every((question) => {
        return this.answers[question.idPregunta] !== '' && this.answers[question.idPregunta] !== undefined;
      });
    },

    isNextDisabled() {
      // Desactiva el botón "Siguiente" si no se han respondido todas las preguntas
      return !this.isFormComplete();
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

.survey-container {
  padding: 110px 40px ; /* Ajuste para el header fijo */
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.survey-form-container {
  background-color: #F0F5EF;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  max-width: 55rem;
  width: 100%;
}

.survey-title {
  font-size: 32px;
  font-weight: 700;
  color: #34495e;
  text-align: center;
  margin-bottom: 2rem;
}

.survey-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0px 10px;
}

.form-group label {
  font-size: 15px;
  font-weight: 500;
  color: #2c3e50;
}

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
  gap: 10px; /* Espacio entre el ícono y el campo de entrada */
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group label {
  font-size: 0.9rem;
  color: #34495e;
}

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
  font-size: 0.9rem;
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
</style>
