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
              <select v-model="question.tipoPregunta" id="tipoPregunta" required @change="handleQuestionTypeChange">
                <option value="" disabled>Selecciona el tipo de pregunta</option>
                <option value="Texto">Texto</option>
                <option value="Seleccion">Selección</option>
                <option value="Multiple">Opción Múltiple</option>
              </select>
            </div>
  
            <!-- Campo adicional para opciones de respuesta -->
            <div v-if="showOptionsField" class="form-group">
              <label>Opciones de Respuesta:</label>
              <div v-for="(option, index) in question.options" :key="index" class="option-input">
                <input 
                  v-model="question.options[index]" 
                  type="text" 
                  placeholder="Ingresa una opción de respuesta" 
                  required 
                />
                <button @click="removeOption(index)" type="button" class="remove-option-button">Eliminar</button>
              </div>
              <button @click="addOption" type="button" class="add-option-button">Añadir Opción</button>
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
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  // import axios from 'axios'; // Descomentar cuando se integre con la API
  
  export default {
    name: 'ActualizarEncuesta',
    components: {
      NavBar,
      FooterComponent
    },
    data() {
      return {
        questions: [
          // Ejemplo de preguntas iniciales, eliminar cuando se use la API
          { idPregunta: 1, numPregunta: 1, pregunta: "¿Cuál es tu color favorito?", tipoPregunta: "Texto", estado: "ACTIVO", options: [] },
          { idPregunta: 2, numPregunta: 2, pregunta: "¿Cuál es tu comida favorita?", tipoPregunta: "Texto", estado: "ACTIVO", options: [] }
        ],
        question: {
          numPregunta: '',
          pregunta: '',
          tipoPregunta: '',
          estado: 'ACTIVO',
          options: [] // Array para almacenar las opciones de respuesta
        },
        isUpdating: false,
        showForm: false,
        showOptionsField: false // Controla si se muestran los campos de opciones
      };
    },
    methods: {
      submitQuestion() {
        if (this.isUpdating) {
          console.log('Actualizar pregunta:', this.question);
          // Aquí debes hacer la solicitud PUT para actualizar la pregunta
        } else {
          console.log('Agregar nueva pregunta:', this.question);
          // Aquí debes hacer la solicitud POST para crear una nueva pregunta
        }
        this.resetForm();
      },
      resetForm() {
        // Restablecer el formulario a su estado inicial
        this.question = {
          numPregunta: '',
          pregunta: '',
          tipoPregunta: '',
          estado: 'ACTIVO',
          options: []
        };
        this.isUpdating = false;
        this.showForm = false; // Ocultar el formulario
        this.showOptionsField = false; // Ocultar campo de opciones
      },
      editQuestion(question) {
        // Cargar datos de una pregunta existente para su actualización
        this.question = { ...question };
        this.isUpdating = true;
        this.showForm = true; // Mostrar el formulario para editar
        this.showOptionsField = ['Seleccion', 'Multiple'].includes(this.question.tipoPregunta); // Mostrar campo de opciones si es necesario
      },
      showAddQuestionForm() {
        this.resetForm();
        this.showForm = true; // Mostrar el formulario para agregar una nueva pregunta
      },
      handleQuestionTypeChange() {
        // Mostrar el campo de opciones de respuesta solo si el tipo de pregunta es "Seleccion" o "Multiple"
        this.showOptionsField = ['Seleccion', 'Multiple'].includes(this.question.tipoPregunta);
        if (!this.showOptionsField) {
          this.question.options = []; // Limpiar las opciones si se cambia a un tipo sin opciones
        }
      },
      addOption() {
        // Añadir una nueva opción de respuesta
        this.question.options.push('');
      },
      removeOption(index) {
        // Eliminar una opción de respuesta
        this.question.options.splice(index, 1);
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
    border-radius: 5px;
  }
  
  .option-input {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .option-input input {
    flex-grow: 1;
  }
  
  .remove-option-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
    cursor: pointer;
    margin-left: 0.5rem;
  }
  
  .remove-option-button:hover {
    background-color: #c0392b;
  }
  
  .add-option-button {
    background-color: #2ecc71;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 0.5rem;
  }
  
  .add-option-button:hover {
    background-color: #27ae60;
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
  
  .edit-button {
    background-color: #4CAF50;
    color: white;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .edit-button:hover {
    background-color: #45A049;
  }
  </style>
  