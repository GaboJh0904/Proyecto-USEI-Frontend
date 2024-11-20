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

      <!-- Formulario para crear una nueva encuesta (en estilo modal) -->
      <div v-if="showForm" class="modal-overlay">
        <div class="encuesta-form">
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
      </div>
    </main>
  
    <FooterComponent />
  </div>
</template>
  
  <script>
  import Swal from 'sweetalert2';
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  import { BASE_URL } from '@/config/globals';
  
  export default {
  name: 'GestionEncuestas',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      encuestas: [],
      showForm: false,
      encuestaForm: {
        titulo: '',
        descripcion: ''
      },
      usuarioId: null, // Para almacenar el ID del usuario recibido de la ruta
    };
  },
  mounted() {
    // Obtener el idUsuario de los parámetros de la ruta (query params)
    this.usuarioId = this.$route.params.idUsuario;

    // Cargar todas las encuestas al montar el componente
    this.fetchEncuestas();
  },
  methods: {
    async fetchEncuestas() {
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/encuesta`);
        this.encuestas = response.data;
      } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        Swal.fire('Error', 'No se pudieron cargar las encuestas.', 'error');
      }
    },

  showCreateEncuestaForm() {
    this.showForm = true; // Mostrar el formulario para crear una nueva encuesta
  },

  async getPlazoActivo() {
    try {
      const response = await this.$protectedAxios.get(`${BASE_URL}/plazo/activo`);
      return response.data.idPlazo; // Retorna el ID del plazo activo
    } catch (error) {
      console.error('Error al obtener el plazo activo:', error);
      Swal.fire('Error', 'No se pudo obtener el plazo activo.', 'error');
      return null;
    }
  },

  async submitEncuesta() {
    if (!this.encuestaForm.titulo || !this.encuestaForm.descripcion) {
      Swal.fire('Advertencia', 'Todos los campos son obligatorios.', 'warning');
      return;
    }

    try {
      // Obtener el ID del plazo activo antes de crear la encuesta
      const idPlazo = await this.getPlazoActivo();
      if (!idPlazo) {
        Swal.fire('Error', 'No hay un plazo activo para asignar a la encuesta.', 'error');
        return;
      }

      // Crear nueva encuesta
      await this.$protectedAxios.post(`${BASE_URL}/encuesta`, {
        titulo: this.encuestaForm.titulo,
        descripcion: this.encuestaForm.descripcion,
        fechaModificado: new Date().toISOString().split('T')[0],
        usuarioIdUsuario: { idUsuario: this.usuarioId },
        plazoIdPlazo: {idPlazo}, // Añade el plazo activo
      });

      Swal.fire('Agregado', 'La nueva encuesta ha sido registrada exitosamente.', 'success');
      this.resetForm(); // Limpiar el formulario después de enviar
      this.fetchEncuestas(); // Refrescar la lista de encuestas
    } catch (error) {
      console.error('Error al enviar la encuesta:', error);
      Swal.fire('Error', 'Ocurrió un problema al registrar la encuesta.', 'error');
    }
  },

  resetForm() {
    this.encuestaForm = {
      titulo: '',
      descripcion: ''
    };
    this.showForm = false;
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
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.encuestas-title {
  color: #263D42;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 700;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.card {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
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
  margin-bottom: 0.5rem;
}

.encuesta-card h3 {
  color: #263D42;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.encuesta-card p {
  color: #546E7A;
  margin-bottom: 1.5rem;
}

.edit-button {
  background-color: #8dced7;
  color: #000;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #63C7B2;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.encuesta-form {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #263D42;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  padding: 0.8rem;
  border: 1px solid #263D42;
  border-radius: 8px;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.submit-button,
.reset-button {
  background-color: #8dced7;
  color: #000;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #63C7B2;
}

.reset-button {
  background-color: #CBDADB;
  color: #263D42;
}

.reset-button:hover {
  background-color: #A2C3C4;
}
</style>
