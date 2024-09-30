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
              <button class="cancel-button" type="button" @click="cancel">Cancelar</button>
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
                <td class="action-column">
                  <button @click="editOption(option)" class="edit-button">Editar</button>
                 <!--<button @click="deleteOption(option.idOpciones)" class="delete-button">Eliminar</button>-->
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
  import Swal from 'sweetalert2'; // Importamos SweetAlert para las alertas
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
          console.error('Esta pregunta no tiene opciones:', error);
          Swal.fire('Error', 'Esta pregunta no tiene opciones.', 'error');
        }
      },

      // Método para crear o actualizar una opción
      async submitOption() {
        // Validación de campo vacío
        if (!this.option.opcion) {
          Swal.fire('Advertencia', 'El campo de opción no puede estar vacío.', 'warning');
          return;
        }

        try {
          if (this.isUpdating) {
            // Actualizar opción existente
            await axios.put(`http://localhost:8082/opciones_pregunta/${this.option.idOpciones}`, this.option);
            Swal.fire('Actualizado', 'La opción ha sido actualizada exitosamente.', 'success');
          } else {
            // Crear nueva opción
            await axios.post('http://localhost:8082/opciones_pregunta', this.option);
            Swal.fire('Agregado', 'La nueva opción ha sido agregada exitosamente.', 'success');
          }
          this.resetForm(); // Limpiar el formulario después de enviar
          this.fetchOptions(); // Refrescar la lista de opciones
        } catch (error) {
          console.error('Error al enviar la opción:', error);
          Swal.fire('Error', 'Ocurrió un problema al registrar la opción.', 'error');
        }
      },

      /* Método para eliminar una opción por su ID
      async deleteOption(optionId) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esta acción!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await axios.delete(`http://localhost:8082/opciones_pregunta/${optionId}`);
              this.fetchOptions(); // Refrescar la lista de opciones
              Swal.fire('Eliminado', 'La opción ha sido eliminada exitosamente.', 'success');
            } catch (error) {
              console.error('Error al eliminar la opción:', error);
              Swal.fire('Error', 'No se pudo eliminar la opción.', 'error');
            }
          }
        });
      },*/

      // Método para preparar la edición de una opción
      editOption(option) {
        this.option = { ...option };
        this.isUpdating = true;
      },

      // Método para resetear el formulario de opciones
      resetForm() {
        // Restablecer el formulario a su estado inicial
        this.option = {
          opcion: '',
          preguntaIdPregunta: { idPregunta: this.$route.params.idPregunta }
        };
        this.isUpdating = false;
      },
      cancel() {
        // Redirigir a la vista de "Editar Encuesta"
        this.$router.push({ name: 'EditarEncuesta' });
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
    border-radius: 15px;
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
    border-bottom: 1px solid #263D42; /* Ajuste en el grosor del borde */
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
  .cancel-button {
  background-color: #263D42;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}
.cancel-button:hover {
  background-color: #1F2E34;
}

  </style>
  