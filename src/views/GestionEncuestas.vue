<template>
    <div>
      <header>
        <NavBar userRole="Admin" />
      </header>
  
      <main class="encuestas-container">
        <h1 class="encuestas-title">Gestión de Encuestas</h1>
  
        <!-- Cards para cada encuesta -->
        <div class="cards-container">
          <!-- Card para crear una nueva encuesta -->
          <div class="card add-encuesta-card" @click="showCreateEncuestaForm">
            <div class="add-icon">+</div>
            <p>Crear Nueva Encuesta</p>
          </div>
  
          <!-- Listado de encuestas existentes -->
          <div v-for="encuesta in encuestas" :key="encuesta.idEncuesta" class="card encuesta-card">
            <h3>{{ encuesta.titulo }}</h3>
            <p>{{ encuesta.descripcion }}</p>
            <button class="edit-button" @click="goToGestionPreguntas(encuesta.idEncuesta)">Editar Preguntas</button>
          </div>
        </div>
  
        <!-- Formulario para crear una nueva encuesta -->
        <div v-if="showForm" class="encuesta-form">
          <h2>Crear Nueva Encuesta</h2>
          <form @submit.prevent="submitEncuesta">
            <div class="form-group">
              <label for="titulo">Título de la Encuesta:</label>
              <input v-model="encuestaForm.titulo" type="text" id="titulo" required />
            </div>
  
            <div class="form-group">
              <label for="descripcion">Descripción:</label>
              <textarea v-model="encuestaForm.descripcion" id="descripcion" required></textarea>
            </div>
  
            <div class="form-actions">
              <button class="submit-button" type="submit">Crear Encuesta</button>
              <button class="reset-button" @click="resetForm" type="button">Cancelar</button>
            </div>
          </form>
        </div>
      </main>
  
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  
  export default {
    name: 'GestionEncuestas',
    components: {
      NavBar,
      FooterComponent
    },
    data() {
      return {
        encuestas: [], // Lista de encuestas obtenida desde la API
        showForm: false, // Controla la visibilidad del formulario de crear encuesta
        encuestaForm: {
          titulo: '',
          descripcion: ''
        }
      };
    },
    mounted() {
      // Cargar todas las encuestas al montar el componente
      this.fetchEncuestas();
    },
    methods: {
      async fetchEncuestas() {
        try {
          const response = await axios.get('http://localhost:8082/encuesta');
          this.encuestas = response.data;
        } catch (error) {
          console.error('Error al obtener las encuestas:', error);
          Swal.fire('Error', 'No se pudieron cargar las encuestas.', 'error');
        }
      },
  
      showCreateEncuestaForm() {
        this.showForm = true; // Mostrar el formulario para crear una nueva encuesta
      },
  
      async submitEncuesta() {
        if (!this.encuestaForm.titulo || !this.encuestaForm.descripcion) {
          Swal.fire('Advertencia', 'Todos los campos son obligatorios.', 'warning');
          return;
        }
  
        try {
          // Crear nueva encuesta
          const response = await axios.post('http://localhost:8082/encuesta', {
            titulo: this.encuestaForm.titulo,
            descripcion: this.encuestaForm.descripcion,
            fechaModificado: new Date().toISOString().split('T')[0], // Fecha de modificación actual
            usuarioIdUsuario: 1 // ID de usuario estático
          });
  
          const nuevaEncuesta = response.data;
          await this.asociarEncuestaPreguntas(nuevaEncuesta.idEncuesta); // Asociar preguntas tras crear la encuesta
  
          Swal.fire('Agregado', 'La nueva encuesta ha sido registrada exitosamente.', 'success');
          this.resetForm(); // Limpiar el formulario después de enviar
          this.fetchEncuestas(); // Refrescar la lista de encuestas
        } catch (error) {
          console.error('Error al enviar la encuesta:', error);
          Swal.fire('Error', 'Ocurrió un problema al registrar la encuesta.', 'error');
        }
      },

      resetForm() {
        // Restablecer el formulario a su estado inicial
        this.encuestaForm = {
          titulo: '',
          descripcion: ''
        };
        this.showForm = false; // Ocultar el formulario
      },
  
      goToGestionPreguntas(idEncuesta) {
        // Redirigir a la vista de gestión de preguntas para la encuesta seleccionada
        this.$router.push({ name: 'EditarEncuesta', params: { idEncuesta } });
      }
    }
  };
  </script>
  
  <style scoped>
  .encuestas-container {
    padding: 2rem;
  }
  
  .cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .card {
    background-color: #CBDADB;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    flex: 1;
    max-width: 300px;
    text-align: center;
    cursor: pointer;
  }
  
  .add-encuesta-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: #63C7B2;
  }
  
  .add-icon {
    font-size: 3rem;
  }
  
  .encuesta-card h3 {
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: block;
    align-items: center; 
  }
  .encuesta-form {
    background-color: #CBDADB;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 48rem;
    margin-top: 35px;
  }

  .form-group label {
    font-weight: 500;
    color: #263D42;
    padding-right: 10px;
  }
  .form-group input, .form-group textarea {
    width: 100%;
    padding: 0.5em;
    justify-self: center;
    border: 1px solid #263D42;
    border-radius: 15px;

  }

  .form-actions {
    display: flex;
    justify-content: space-between;
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
    background-color: #1D2D30;
  }
  </style>
  