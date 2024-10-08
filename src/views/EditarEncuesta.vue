<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>

    <main class="question-container">
      <h1 class="question-title">Gestión de Preguntas</h1>

      <!-- Botón para agregar una nueva pregunta -->
      <button class="add-button" @click="showAddQuestionForm">Agregar Nueva Pregunta</button>

      <!-- Formulario para agregar o actualizar preguntas -->
      <div v-if="showForm" class="question-form">
        <h2>{{ isUpdating ? 'Actualizar Pregunta' : 'Agregar Nueva Pregunta' }}</h2>

        <form @submit.prevent="submitQuestion">
          <div class="form-group">
            <label for="numPregunta">Número de Pregunta:</label>
            <input v-model="question.numPregunta" type="number" id="numPregunta" required />
          </div>

          <div class="form-group">
            <label for="pregunta">Pregunta:</label>
            <input v-model="question.pregunta" type="text" id="pregunta" required />
          </div>

          <div class="form-group">
            <label for="tipoPregunta">Tipo de Pregunta:</label>
            <select v-model="question.tipoPregunta" id="tipoPregunta" required>
              <option value="" disabled>Selecciona el tipo de pregunta</option>
              <option value="Texto">Texto</option>
              <option value="Seleccion">Selección</option>
              <option value="Multiple">Opción Múltiple</option>
            </select>
          </div>

          <div class="form-group">
            <label for="estado">Estado:</label>
            <select v-model="question.estado" id="estado" required>
              <option value="" disabled>Selecciona el estado</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>

          <div class="form-actions">
            <button class="submit-button" type="submit">{{ isUpdating ? 'Actualizar' : 'Agregar' }} Pregunta</button>
            <button class="reset-button" @click="resetForm" type="button">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Lista de preguntas con opciones para editar -->
      <div v-if="!showForm" class="question-list">
        <h2>Lista de Preguntas</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Pregunta</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in questions" :key="question.idPregunta">
              <td>{{ question.numPregunta }}</td>
              <td>{{ question.pregunta }}</td>
              <td>{{ question.tipoPregunta }}</td>
              <td>{{ question.estado }}</td>
              <td>
                <button @click="editQuestion(question)" class="edit-button">Editar</button>
                <!-- Botón para gestionar opciones -->
                <button @click="goToGestionOpciones(question.idPregunta)" class="options-button">Gestionar Opciones</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios'; // Importamos axios para realizar solicitudes HTTP
import Swal from 'sweetalert2'; // Importamos SweetAlert
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'EditarEncuesta',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      questions: [], // Lista de preguntas, se cargará desde la API
      question: {
        numPregunta: '',
        pregunta: '',
        tipoPregunta: '',
        estado: 'ACTIVO'
      },
      isUpdating: false,
      showForm: false,
      apiBaseUrl: 'http://localhost:8082' // Puedes cambiar la URL base según tu configuración
    };
  },
  mounted() {
    // Cargar todas las preguntas al montar el componente
    this.fetchQuestions();
  },
  methods: {
    async fetchQuestions() {
      try {
        const response = await axios.get(`${this.apiBaseUrl}/pregunta`);
        this.questions = response.data;
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        Swal.fire('Error', 'No se pudieron cargar las preguntas.', 'error');
      }
    },
    async submitQuestion() {
      // Verifica si todos los campos están completos
      if (!this.question.numPregunta || !this.question.pregunta || !this.question.tipoPregunta || !this.question.estado) {
        Swal.fire('Advertencia', 'Todos los campos son obligatorios.', 'warning');
        return;
      }

      try {
        if (this.isUpdating) {
          // Actualizar pregunta existente
          await axios.put(`${this.apiBaseUrl}/pregunta/${this.question.idPregunta}`, {
            numPregunta: this.question.numPregunta,
            pregunta: this.question.pregunta,
            tipoPregunta: this.question.tipoPregunta,
            estado: this.question.estado
          });
          Swal.fire('Actualizado', 'La pregunta ha sido actualizada exitosamente.', 'success');
        } else {
          // Crear nueva pregunta
          const response = await axios.post(`${this.apiBaseUrl}/pregunta`, {
            numPregunta: this.question.numPregunta,
            pregunta: this.question.pregunta,
            tipoPregunta: this.question.tipoPregunta,
            estado: this.question.estado
          });
          Swal.fire('Agregado', 'La nueva pregunta ha sido registrada exitosamente.', 'success');
          this.questions.push(response.data); // Añadir la nueva pregunta a la lista
        }
        this.resetForm(); // Limpiar el formulario después de enviar
        this.fetchQuestions(); // Refrescar la lista de preguntas
      } catch (error) {
        console.error('Error al enviar la pregunta:', error);
        Swal.fire('Error', 'Ocurrió un problema al registrar la pregunta.', 'error');
      }
    },
    resetForm() {
      // Restablecer el formulario a su estado inicial
      this.question = {
        numPregunta: '',
        pregunta: '',
        tipoPregunta: '',
        estado: 'ACTIVO'
      };
      this.isUpdating = false;
      this.showForm = false; // Ocultar el formulario
    },
    editQuestion(question) {
      // Cargar datos de una pregunta existente para su actualización
      this.question = { ...question };
      this.isUpdating = true;
      this.showForm = true; // Mostrar el formulario para editar
    },
    showAddQuestionForm() {
      this.resetForm();
      this.showForm = true; // Mostrar el formulario para agregar una nueva pregunta
    },
    goToGestionOpciones(idPregunta) {
      // Redirigir a la vista de gestión de opciones para la pregunta
      this.$router.push({ name: 'GestionOpcionesPregunta', params: { idPregunta } });
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
div.question-list {
  width: 100%;
  max-width: 48rem;
  background-color: #CBDADB ;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.question-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 15px;
}

.question-title {
  font-size: 25px;
  font-weight: bold;
  color: #000000;
  text-align: left;
  margin-bottom: 1.5rem;
}

.add-button {
  background-color: #263D42;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.add-button:hover {
  background-color: #1F2E34;
}

.question-form {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
  margin-bottom: 1.5rem;
}

.question-form h2 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #263D42;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #263D42;
  border-radius: 15px;
}

.option-input {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.option-input input {
  flex-grow: 1;
}

.options-button {
  background-color: #63C7B2;
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-left: 10px;
}

.options-button:hover {
  background-color: #50a08f;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.submit-button, .reset-button {
  background-color: #263D42;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}

.submit-button:hover, .reset-button:hover {
  background-color: #1F2E34;
}

.question-list {
  width: 100%;
  max-width: 48rem;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.question-list h2 {
  margin-bottom: 1rem;
}

.question-list table {
  width: 100%;
  border-collapse: collapse;
}

.question-list th, .question-list td {
  border: 1px solid #263D42;
  padding: 0.75rem;
  text-align: left;
}

.question-list th {
  background-color: #263D42;
  color: white;
}

.edit-button{
    background-color: #8E6C88;
    color: white;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 15px;
    cursor: pointer;
  }
  .edit-button:hover {
    background-color: #765a70;
  }
</style>