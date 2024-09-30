<template>
  <div>
    <header>
      <NavBar :userRole="userRole" />
    </header>

    <main class="user-management-container">
      <h1 class="user-management-title">{{ isEditing ? "Editar Noticia" : "Agregar Nueva Noticia" }}</h1>

      <!-- Formulario para añadir/editar noticias -->
      <div class="user-form-container">
        <form @submit.prevent="isEditing ? updateNoticia() : addNoticia()">
          <!-- Título -->
          <div class="form-group">
            <label for="titulo">Título</label>
            <input type="text" id="titulo" v-model="currentNoticia.titulo" required />
          </div>

          <!-- Descripción -->
          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="currentNoticia.descripcion" required></textarea>
          </div>

          <!-- Imagen -->
          <div class="form-group">
            <label for="img">Imagen</label>
            <input type="file" id="img" @change="handleFileUpload" accept="image/*" required />
          </div>

          <!-- Estado -->
          <div class="form-group">
            <label for="estado">Estado</label>
            <select v-model="currentNoticia.estado" id="estado" required>
              <option value="publicado">Publicado</option>
              <option value="revision">En Revisión</option>
            </select>
          </div>

          <!-- Botones de acción -->
          <div class="form-actions">
            <button class="volver-button" @click="goBack">Volver</button>
            <button type="submit" class="submit-button">{{ isEditing ? "Actualizar" : "Añadir" }}</button>
          </div>
        </form>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'NoticiaForm',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      userRole: '', 
      currentNoticia: {
        titulo: '',
        descripcion: '',
        img: null, 
        estado: 'publicado', 
        fechaModificado: new Date().toISOString().split('T')[0], 
      },
      isEditing: false, 
      editNoticiaId: null 
    };
  },
  mounted() {
    this.userRole = localStorage.getItem('rol') || '';
  },
  methods: {
    handleFileUpload(event) {
      this.currentNoticia.img = event.target.files[0]; 
    },

    // Añadir noticia
    async addNoticia() {
      try {
        const formData = new FormData();
        formData.append('titulo', this.currentNoticia.titulo);
        formData.append('descripcion', this.currentNoticia.descripcion);
        formData.append('img', this.currentNoticia.img);
        formData.append('estado', this.currentNoticia.estado);
        formData.append('fechaModificado', this.currentNoticia.fechaModificado);
        formData.append('UsuarioIdUsuario', 1);

        await axios.post('http://localhost:8082/noticia', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.resetForm();

        // Mostrar SweetAlert2 de éxito
        Swal.fire({
          title: 'Noticia Agregada',
          text: 'La noticia se agregó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } catch (error) {
        console.error('Error al agregar noticia:', error);
      }
    },

    // Editar noticia
    async updateNoticia() {
      try {
        const formData = new FormData();
        formData.append('titulo', this.currentNoticia.titulo);
        formData.append('descripcion', this.currentNoticia.descripcion);
        formData.append('img', this.currentNoticia.img);
        formData.append('estado', this.currentNoticia.estado);
        formData.append('fechaModificado', this.currentNoticia.fechaModificado); 
        formData.append('UsuarioIdUsuario', 1); 

        await axios.put(`http://localhost:8082/noticia/${this.editNoticiaId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.resetForm();
        this.isEditing = false;

        // Mostrar SweetAlert2 de éxito
        Swal.fire({
          title: 'Noticia Actualizada',
          text: 'La noticia se actualizó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      } catch (error) {
        console.error('Error al actualizar la noticia:', error);
      }
    },

    // Resetear formulario
    resetForm() {
      this.currentNoticia = {
        titulo: '',
        descripcion: '',
        img: null,
        estado: 'publicado',
        fechaModificado: new Date().toISOString().split('T')[0],
      };
      this.isEditing = false;
    },

    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
/* Estilos del formulario */
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

.user-management-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
}

.user-management-title {
  font-size: 25px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 1.5rem;
}

.user-form-container {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
}

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #929292;
  border-radius: 15px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
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
  background-color: #1F2E34;
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
  background-color: #5A4766;
}
</style>
