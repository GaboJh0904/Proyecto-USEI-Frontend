<template>
    <div>
      <header>
        <NavBar userRole="Admin" />
      </header>
  
      <main class="option-container">
        <h1 class="option-title">Gestión de Opciones para la Pregunta</h1>
  
        <div class="option-form">
          <h2>Añadir Nueva Opción</h2>
          
          <form @submit.prevent="submitOption">
            <div class="form-group">
              <label for="opcion">Opción:</label>
              <input v-model="option.opcion" type="text" id="opcion" required />
            </div>
            
            <div class="form-actions">
              <button class="submit-button" type="submit">Agregar Opción</button>
            </div>
          </form>
        </div>
  
        <div class="option-list">
          <h2>Opciones Existentes</h2>
          <table>
            <thead>
              <tr>
                <th>Opción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="option in options" :key="option.idOpciones">
                <td>{{ option.opcion }}</td>
                <td>
                  <button @click="editOption(option)" class="edit-button">Editar</button>
                  <button @click="deleteOption(option.idOpciones)" class="delete-button">Eliminar</button>
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
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  
  export default {
    name: 'GestionOpcionesPregunta',
    components: {
      NavBar,
      FooterComponent
    },
    data() {
      return {
        options: [], // Lista de opciones para una pregunta específica
        option: {
          opcion: '',
          preguntaIdPregunta: { idPregunta: this.$route.params.idPregunta } // ID de la pregunta desde los parámetros de la ruta
        },
        isUpdating: false
      };
    },
    mounted() {
      // Cargar todas las opciones al montar el componente
      this.fetchOptions();
    },
    methods: {
      // Método para obtener todas las opciones de una pregunta por su ID
      async fetchOptions() {
        try {
          const response = await axios.get(`http://localhost:8082/opciones_pregunta/pregunta/${this.$route.params.idPregunta}`);
          console.log('Opciones recibidas:', response.data); 
          this.options = [...response.data]; // Reasigna el array para asegurar la reactividad
        } catch (error) {
          console.error('Error al obtener las opciones:', error);
        }
      },
      async submitOption() {
        try {
          if (this.isUpdating) {
            await axios.put(`http://localhost:8082/opciones_pregunta/${this.option.idOpciones}`, this.option);
          } else {
            await axios.post('http://localhost:8082/opciones_pregunta', this.option);
          }
          this.resetForm();
          this.fetchOptions();
        } catch (error) {
          console.error('Error al enviar la opción:', error);
        }
      },
      async deleteOption(optionId) {
        try {
          await axios.delete(`http://localhost:8082/opciones_pregunta/${optionId}`);
          this.fetchOptions();
        } catch (error) {
          console.error('Error al eliminar la opción:', error);
        }
      },
      editOption(option) {
        this.option = { ...option };
        this.isUpdating = true;
      },
      resetForm() {
        this.option = {
          opcion: '',
          preguntaIdPregunta: { idPregunta: this.$route.params.idPregunta }
        };
        this.isUpdating = false;
      }
    }
  };
  </script>
  
  
  <style scoped>
  /* Estilos del componente */
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
  
  .option-container {
    padding-top: 80px;
    min-height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 15px;
  }
  
  .option-title {
    font-size: 25px;
    font-weight: bold;
    color: #000000;
    text-align: left;
    margin-bottom: 1.5rem;
  }
  
  .option-form {
    background-color: #CBDADB;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 48rem;
    margin-bottom: 1.5rem;
  }
  
  .option-form h2 {
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
  
  .form-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #263D42;
    border-radius: 5px;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
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
  
  .option-list {
    width: 100%;
    max-width: 48rem;
    background-color: #ffffff;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .option-list h2 {
    margin-bottom: 1rem;
  }
  
  .option-list table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .option-list th, .option-list td {
    border: 1px solid #263D42;
    padding: 0.75rem;
    text-align: left;
  }
  
  .option-list th {
    background-color: #263D42;
    color: white;
  }
  
  .edit-button, .delete-button {
    background-color: #4CAF50;
    color: white;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .delete-button {
    background-color: #e74c3c;
  }
  
  .edit-button:hover {
    background-color: #45A049;
  }
  
  .delete-button:hover {
    background-color: #c0392b;
  }
  </style>
  