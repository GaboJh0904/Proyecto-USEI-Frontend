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

            <!-- Tipos de Pregunta -->
            <template v-if="question.tipoPregunta === 'Seleccion'">
              <select :id="'question-' + index" v-model="answers[question.idPregunta]" :disabled="false">
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
                :disabled="false"
              />
            </template>

            <template v-else-if="question.tipoPregunta === 'Multiple'">
              <div v-for="option in question.opciones" :key="option.idOpciones" class="checkbox-group">
                <input
                  type="checkbox"
                  :id="'option-' + option.idOpciones"
                  :value="option.opcion"
                  v-model="answers[question.idPregunta]"
                />
                <label :for="'option-' + option.idOpciones">{{ option.opcion }}</label>
              </div>
            </template>
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
    async fetchQuestions() {
      try {
        const response = await axios.get('http://localhost:8082/pregunta');
        const questions = response.data;

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

.warning-icon {
  color: orange;
  cursor: pointer;
  margin-left: 10px;
  font-size: 1.2em;
}

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

.survey-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  margin: 15px;
  justify-content: center;
  align-items: center;
}

.survey-form-container {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 48rem;
  /* Ancho ajustado */
  width: 100%;
}

.survey-title {
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #000000;
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
  color: #000000
}

.form-group select,
.form-group input[type="text"]{
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #929292;
  border-radius: 15px;
  font-size: 1rem;
}
.form-group input[type="number"]{
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #929292;
  border-radius: 15px;
  font-size: 1rem;
}
.form-group input[type="tel"]{
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #929292;
  border-radius: 15px;
  font-size: 1rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.submit-button {
  background-color: #263D42;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}


.submit-button:hover {
  background-color: #263D42;
}

.volver-button {
  background-color: #6c5b7b;
  color: white;
  padding: 0.5rem 1rem;
  margin-right: 50px;
  border: none;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.volver-button:hover {
  background-color: #6c5b7b;
}
.submit-button:disabled {
  background-color: #bfbdbd; 
  color: #645e5e; 
  cursor: not-allowed; 
}

.submit-button:enabled {
  background-color: #263D42;
  color: white;
}

</style>