<template>
  <div>
    <header>
      <NavBar :userRole="userRole" />
    </header>

    <main class="user-management-container">
      <h1 class="user-management-title">{{ isEditing ? "EDITAR NOTICIA" : "AGREGAR NUEVA NOTICIA" }}</h1>

      <!-- Contenedor para el formulario y la tabla de noticias -->
      <div class="user-form-and-table">
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
            <!-- Imagen -->
<div class="form-group">
  <label for="img">Imagen</label>
  <input type="file" id="img" @change="handleFileUpload" accept="image/*" />
  
  <!-- Mostrar el nombre de la imagen actual si ya existe una -->
  <div v-if="currentNoticia.img && !currentNoticia.img.name">
    Imagen actual: {{ currentNoticia.img }}
  </div>
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
              <button type="submit" class="submit-button">{{ isEditing ? "Actualizar" : "Añadir" }}</button>
              <!-- Botón de cancelar visible solo en modo de edición -->
              <button v-if="isEditing" type="button" class="cancel-button" @click="resetForm">Cancelar</button>
            </div>
          </form>
        </div>

        <!-- Tabla de noticias existentes -->
        <div class="user-table-container">
          <h2>Noticias Existentes</h2>
          <table class="noticias-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="noticia in noticias" :key="noticia.idNoticia">
  <td>{{ noticia.titulo }}</td>
  <td>{{ noticia.descripcion }}</td>
  <td>{{ noticia.estado }}</td>
  <td class="action-buttons">
    <button class="edit-button" @click="editNoticia(noticia)">
      <i class="fas fa-pencil-alt"></i>
    </button>
    <button class="delete-button" @click="deleteNoticia(noticia.idNoticia)">
      <i class="fas fa-trash-alt"></i>
    </button>
  </td>
</tr>



            </tbody>
          </table>
        </div>
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
  name: 'NoticiaForm',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      userRole: '', 
      noticias: [], // Lista de noticias existentes
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
    this.fetchNoticias(); // Cargar noticias existentes cuando se monta el componente
  },
  methods: {
    // Cargar noticias existentes
    async fetchNoticias() {
      try {
        const response = await axios.get('http://localhost:8082/noticia');
        this.noticias = response.data;
      } catch (error) {
        console.error("Error al cargar las noticias:", error);
      }
    },

    // Manejar la subida de archivos (imagen)
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
        this.fetchNoticias(); // Recargar la lista de noticias

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

    async updateNoticia() {
  try {
    const formData = new FormData();
    formData.append('titulo', this.currentNoticia.titulo);
    formData.append('descripcion', this.currentNoticia.descripcion);

    // Solo agrega la imagen si se ha seleccionado una nueva
    if (this.currentNoticia.img) {
      formData.append('img', this.currentNoticia.img);
    }

    // Formatear la fecha correctamente
    const formattedDate = new Date(this.currentNoticia.fechaModificado).toISOString().split('T')[0];
    formData.append('fechaModificado', formattedDate);

    formData.append('estado', this.currentNoticia.estado);
    formData.append('UsuarioIdUsuario', 1); // ID del usuario, ajustar si es necesario

    // Verifica que el ID de la noticia esté definido
    if (!this.editNoticiaId) {
      console.error("El ID de la noticia no está definido");
      return;
    }

    // Realiza la llamada PUT
    await axios.put(`http://localhost:8082/noticia/${this.editNoticiaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Resetear formulario y actualizar la lista de noticias
    this.resetForm();
    this.isEditing = false;
    this.fetchNoticias();

    // Mostrar notificación de éxito
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

async deleteNoticia(idNoticia) {
  if (!idNoticia) {
    console.error('El ID de la noticia no está definido.');
    return;
  }
  try {
    console.log("ID de la noticia a eliminar:", idNoticia);
    await axios.delete(`http://localhost:8082/noticia/${idNoticia}`);
    this.fetchNoticias();
    Swal.fire({
      title: 'Noticia Eliminada',
      text: 'La noticia ha sido eliminada correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  } catch (error) {
    console.error('Error al eliminar la noticia:', error);
  }
},






    // Editar noticia: llenar el formulario con los datos de la noticia seleccionada
editNoticia(noticia) {
  console.log(noticia); // Verifica que el ID esté presente
  this.currentNoticia = { 
    ...noticia, 
    img: noticia.img ? noticia.img : null // Asegurar que el nombre de la imagen se cargue si ya existe
  };
  this.isEditing = true;
  this.editNoticiaId = noticia.idNoticia;
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
  },
};
</script>

<style scoped>
/* Estilos para el contenedor del formulario y la tabla */
.user-form-and-table {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
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
  background-color: #63C7B2;
}


/* Botón de cancelar (visible en modo de edición) */
.cancel-button {
  background-color: #8E6C88;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 10px;
}

.cancel-button:hover {
  background-color: #80CED7;
}

/* Estilos de la tabla de noticias */
.user-table-container {
  background-color: #CCDBDC;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 40rem;
}

.noticias-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.noticias-table th, .noticias-table td {
  border: 1px solid #263D42;
  padding: 14px;
  text-align: left;
  color: #000000;
}

.noticias-table th {
  background-color: #263D42;
  font-weight: bold;
  color: #fff;
}

.noticias-table td {
  background-color: #CCDBDC;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  height: 80px;
}

.edit-button, .delete-button {
  background-color: #263D42;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-button i {
  color: #63c7b2;
}

.delete-button i {
  color: #8E6C88;
}

.edit-button:hover {
  background-color: #1f3134;
}

.delete-button:hover {
  background-color: #5a4766;
}
</style>
