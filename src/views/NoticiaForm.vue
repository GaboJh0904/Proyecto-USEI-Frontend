<template>
  <div>
    <header>
      <NavBar :userRole="userRole" />
    </header>

    <main class="user-management-container">
      <h1 class="user-management-title">{{ isEditing ? "EDITAR NOTICIA" : "AGREGAR NUEVA NOTICIA" }}</h1>
      <button @click="showArchivedNoticias" class="show-archived-button">Ver Noticias Archivadas</button>
      <div class="user-form-and-table">
        <div class="user-form-container">
          <form @submit.prevent="isEditing ? updateNoticia() : addNoticia()">
            <div class="form-group">
              <label for="titulo">Título</label>
              <input type="text" id="titulo" v-model="currentNoticia.titulo" required />
              <span v-if="!currentNoticia.titulo && showErrors" class="error-message">El título es obligatorio.</span>
            </div>
            <div class="form-group">
              <label for="descripcion">Descripción</label>
              <textarea id="descripcion" v-model="currentNoticia.descripcion" required></textarea>
            </div>

            <div class="form-group">
              <label for="img">Imagen</label>
              <input type="file" id="img" @change="handleFileUpload" accept="image/*" ref="fileInput" />
              <span v-if="!currentNoticia.img && showErrors && !isEditing" class="error-message">La imagen es obligatoria.</span>
              <div v-if="currentNoticia.img && !currentNoticia.img.name">
                Imagen actual: {{ currentNoticia.img }}
              </div>
            </div>
            <div class="form-group">
              <label for="estado">Estado</label>
              <select v-model="currentNoticia.estado" id="estado" required>
                <option value="publicado">Publicado</option>
                <option value="En revision">En Revisión</option>
              </select>
            </div>

            <div class="form-group">
              <label for="fechaModificado">Fecha</label>
              <input
                type="text"
                id="fechaModificado"
                :value="formatDate(currentNoticia.fechaModificado, true)"
                readonly
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-button">{{ isEditing ? "Actualizar" : "Añadir" }}</button>
              <button v-if="isEditing" type="button" class="cancel-button" @click="resetForm">Cancelar</button>
            </div>
          </form>
        </div>

        <div class="user-table-container">
          <h2>Noticias Existentes</h2>

          <div class="filter-sort-container">
            <!-- Filtro por título o descripción -->
            <input type="text" v-model="filterTerm" placeholder="Buscar por título o descripción..." @input="fetchNoticias(1)" />
            
            <!-- Filtro por estado -->
            <select v-model="selectedStatus" @change="fetchNoticias(1)">
              <option value="">Todos los estados</option>
              <option value="publicado">Publicado</option>
              <option value="En revision">En Revisión</option>
            </select>

            <!-- Selección de cantidad de elementos por página -->
            <select v-model="perPage" @change="fetchNoticias(1)">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            
            <!-- Botón para seleccionar orden ascendente/descendente -->
            <button class="sort-button" @click="toggleSortDirection">
              <i :class="sortDirection === 'asc' ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
            </button>

            <div class="columns-menu">
              <button @click="toggleColumnsMenu">Columnas</button>
              <div v-if="showColumnsMenu" class="columns-dropdown">
                <div v-for="(visible, key) in visibleColumns" :key="key" @click="toggleColumn(key)" class="column-option">
                  <span>{{ getColumnLabel(key) }}</span>
                  <i v-if="visible" class="fas fa-check"></i> 
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla con scroll bar -->
          <div class="scrollable-table">
            <table class="noticias-table">
              <thead>
                <tr>
                  <th v-if="visibleColumns.title">Título</th>
                  <th v-if="visibleColumns.description">Descripción</th>
                  <th v-if="visibleColumns.estado">Estado</th>
                  <th v-if="visibleColumns.fechaModificado">Última Modificación</th>
                  <th v-if="visibleColumns.acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="noticia in noticias" :key="noticia.idNoticia">
                  <td v-if="visibleColumns.title">{{ noticia.titulo }}</td>
                  <td v-if="visibleColumns.description">{{ noticia.descripcion }}</td>
                  <td v-if="visibleColumns.estado">{{ noticia.estado }}</td>
                  <td v-if="visibleColumns.fechaModificado">
                    {{ formatDate(noticia.fechaModificado, true) }}
                  </td>
                  <td v-if="visibleColumns.acciones" class="action-buttons">
                    <button class="edit-button" @click="editNoticia(noticia)">
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="delete-button" @click="confirmDeleteNoticia(noticia.idNoticia)">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <button v-if="noticia.estado !== 'archivado'" class="edit-button" @click="archiveNoticia(noticia.idNoticia)">
                      <i class="fas fa-archive"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <PaginationComponent
          :page-count="totalPages"
          :current-page="currentPage"
          :force-page="currentPage - 1"
          @page-changed="fetchNoticias"
        />


        </div>

        <!-- Modal para Noticias Archivadas -->
        <div v-if="showArchivedModal" class="modal">
          <div class="modal-content">
            <span class="close" @click="showArchivedModal = false">&times;</span>
            <h2>Noticias Archivadas</h2>
            <table class="noticias-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Última Modificación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="noticia in noticiasArchivadas" :key="noticia.idNoticia">
                  <td>{{ noticia.titulo }}</td>
                  <td>{{ noticia.descripcion }}</td>
                  <td>{{ noticia.estado }}</td>
                  <td>{{ formatDate(noticia.fechaModificado) }}</td>
                  <td class="action-buttons">
                    <button class="delete-button" @click="unarchiveNoticia(noticia.idNoticia)">
                      <i class="fas fa-box-open"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <PaginationComponent
              :page-count="totalPages"
              :current-page="currentPage"
              :force-page="currentPage - 1"
              @page-changed="fetchNoticias"
            />
          </div>
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
import PaginationComponent from '@/components/PaginationComponent.vue';
import { BASE_URL } from '@/config/globals';

export default {
  name: 'NoticiaForm',
  components: {
    NavBar,
    FooterComponent,
    PaginationComponent,
  },
  data() {
    return {
      userRole: '',
      noticias: [],
      noticiasArchivadas: [],
      currentNoticia: {
        titulo: '',
        descripcion: '',
        img: null,
        estado: 'publicado',
        fechaModificado: new Date().toISOString(), 
      },
      isEditing: false,
      editNoticiaId: null,
      showArchivedModal: false,
      showErrors: false,

      // Parámetros para paginación, ordenación y filtro
      currentPage: 1,
      totalPages: 1,
      perPage: 5, 
      filterTerm: '',
      sortBy: 'titulo', 
      sortDirection: 'asc',
      currentArchivedPage: 1,
      totalArchivedPages: 1,
      selectedStatus: '',
      // Estado de visibilidad de las columnas
      visibleColumns: {
        title: true,
        description: true,
        estado: true,
        fechaModificado: true,
        acciones: true,
      },
      showColumnsMenu: false,
    };
  },

  mounted() {
    this.userRole = localStorage.getItem('rol') || '';
    this.fetchNoticias(1);
    this.fetchNoticiasArchivadas(1);
  },

  methods: {
    toggleColumnsMenu() {
      this.showColumnsMenu = !this.showColumnsMenu;
    },
    toggleColumn(columnKey) {
      this.visibleColumns[columnKey] = !this.visibleColumns[columnKey];
    },
    getColumnLabel(key) {
      const labels = {
        title: 'Título',
        description: 'Descripción',
        estado: 'Estado',
        fechaModificado: 'Fecha Modificado',
        acciones: 'Acciones',
      };
      return labels[key];
    },
    // Método para obtener noticias con paginación, filtro y ordenación
    async fetchNoticias(page = 1) {
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/noticia`, {
          params: {
            page: page - 1, // Convertir de base 1 a base 0 para el backend
            size: this.perPage,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            filter: this.filterTerm,
            estado: this.selectedStatus,
          },
        });
        this.noticias = response.data.content;
        this.totalPages = response.data.totalPages;
        this.currentPage = page; // Actualizar la página actual (base 1)
      } catch (error) {
        console.error('Error al cargar las noticias:', error);
      }
    },

    toggleSortDirection() {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      this.fetchNoticias(1); // Refrescar la tabla con el nuevo orden
    },

    // Método para obtener noticias archivadas
    async fetchNoticiasArchivadas(page = 1) {
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/noticia/archivadas/paginadas`, {
          params: {
            page: page - 1,
            size: this.perPage, 
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            filter: this.filterTerm,
          },
        });
        this.noticiasArchivadas = response.data.content;
        this.totalArchivedPages = response.data.totalPages;
        this.currentArchivedPage = page;
      } catch (error) {
        console.error('Error al cargar las noticias archivadas:', error);
      }
    },

    // Formatear fecha
    formatDate(fechaModificado, onlyDate = false) {
      if (!fechaModificado) return 'Fecha no disponible';

      const date = new Date(fechaModificado);

      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      if (onlyDate) {
        return `${day}-${month}-${year}`; 
      }

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}`; 
    },

    handlePageClick(pageNumber) {
      this.fetchNoticias(pageNumber);
    },
    handleArchivedPageClick(pageNumber) {
      this.fetchNoticiasArchivadas(pageNumber);
    },
    handleFileUpload(event) {
      this.currentNoticia.img = event.target.files[0];
    },

    // Añadir nueva noticia
    async addNoticia() {
      if (!this.currentNoticia.titulo || !this.currentNoticia.img) {
        Swal.fire({
          title: 'Error',
          text: 'El título y la imagen son obligatorios.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append('titulo', this.currentNoticia.titulo);
        formData.append('descripcion', this.currentNoticia.descripcion);
        formData.append('img', this.currentNoticia.img);
        formData.append('estado', this.currentNoticia.estado);

        const formattedDate = this.formatDate(new Date());
        formData.append('fechaModificado', formattedDate);
        formData.append('UsuarioIdUsuario', 1);

        await this.$protectedAxios.post(`${BASE_URL}/noticia`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.resetForm();
        this.fetchNoticias();

        Swal.fire({
          title: 'Noticia Agregada',
          text: 'La noticia se agregó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `Error al agregar noticia: ${error.response?.data?.message || error.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    },

    // Actualizar una noticia existente
    async updateNoticia() {
      if (!this.currentNoticia.titulo) {
        Swal.fire({
          title: 'Error',
          text: 'El título es obligatorio.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      try {
        const formData = new FormData();
        formData.append('titulo', this.currentNoticia.titulo);
        formData.append('descripcion', this.currentNoticia.descripcion);

        if (this.currentNoticia.img) {
          formData.append('img', this.currentNoticia.img);
        }

        const formattedDate = this.formatDate(new Date());
        formData.append('fechaModificado', formattedDate);
        formData.append('estado', this.currentNoticia.estado);
        formData.append('UsuarioIdUsuario', 1);

        if (!this.editNoticiaId) {
          console.error('El ID de la noticia no está definido');
          return;
        }

        await this.$protectedAxios.put(`${BASE_URL}/noticia/${this.editNoticiaId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.resetForm();
        this.isEditing = false;
        this.fetchNoticias();

        Swal.fire({
          title: 'Noticia Actualizada',
          text: 'La noticia se actualizó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `Error al actualizar noticia: ${error.response?.data?.message || error.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    },

    // Eliminar una noticia con confirmación
    confirmDeleteNoticia(idNoticia) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteNoticia(idNoticia);
        }
      });
    },

    // Eliminar una noticia
    async deleteNoticia(idNoticia) {
      if (!idNoticia) {
        console.error('El ID de la noticia no está definido.');
        return;
      }
      try {
        await this.$protectedAxios.delete(`${BASE_URL}/noticia/${idNoticia}`);
        this.fetchNoticias();
        Swal.fire({
          title: 'Noticia Eliminada',
          text: 'La noticia ha sido eliminada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `Error al eliminar noticia: ${error.response?.data?.message || error.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    },

    // Archivar una noticia
    async archiveNoticia(idNoticia) {
      if (!idNoticia) {
        console.error('El ID de la noticia no está definido.');
        return;
      }
      try {
        await this.$protectedAxios.put(`${BASE_URL}/noticia/archivado/${idNoticia}`);
        this.fetchNoticias();
        this.fetchNoticiasArchivadas();

        Swal.fire({
          title: 'Noticia Archivada',
          text: 'La noticia ha sido archivada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `Error al archivar noticia: ${error.response?.data?.message || error.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    },

    // Desarchivar una noticia
    async unarchiveNoticia(idNoticia) {
      if (!idNoticia) {
        console.error('El ID de la noticia no está definido.');
        return;
      }
      try {
        await this.$protectedAxios.put(`${BASE_URL}/noticia/desarchivado/${idNoticia}`);
        this.fetchNoticias();
        this.fetchNoticiasArchivadas();

        Swal.fire({
          title: 'Noticia Desarchivada',
          text: 'La noticia ha sido desarchivada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `Error al desarchivar noticia: ${error.response?.data?.message || error.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    },

    // Mostrar el modal de noticias archivadas
    showArchivedNoticias() {
      this.showArchivedModal = true;
      this.fetchNoticiasArchivadas();
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

      // Limpiar el campo de archivo (imagen)
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = null;
      }
    },

    // Editar noticia
  editNoticia(noticia) {
    this.currentNoticia = {
      ...noticia,
      img: noticia.img ? noticia.img : null,
      fechaModificado: noticia.fechaModificado || new Date().toISOString(), 
    };
    this.isEditing = true;
    this.editNoticiaId = noticia.idNoticia;
  },

  },
};
</script>

<style scoped>
.user-form-and-table {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.user-management-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
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
  max-width: 450px;
  margin-bottom: 50px;
  margin-left: 15px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
}

.form-group input,
.form-group textarea,
.form-group select {
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

.user-table-container {
  background-color: #CCDBDC;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 50px;
}

/* Agregar scroll bar a la tabla */
.scrollable-table {
  max-height: 400px; 
  overflow-y: auto;  
}

.noticias-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.noticias-table th,
.noticias-table td {
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

.edit-button,
.delete-button {
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
  color: #63C7B2;
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

/* Paginación */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 50px; 
}

/* Modal de noticias archivadas */
.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  width: 100%;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}

.close:hover {
  color: #ff0000;
}

/* Botón para abrir modal */
.show-archived-button {
  background-color: #63C7B2;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  right: 20px;
}

.show-archived-button:hover {
  background-color: #263D42;
}

.filter-sort-container {
  display: flex;
  gap: 22px;
  margin-bottom: 20px;
}

.filter-sort-container input {
  width: 40%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.filter-sort-container select {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.columns-dropdown {
  display: block;
  position: absolute;
  background-color: #1c1c1e; 
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 10px;
  border-radius: 8px;
  color: #ffffff; 
  width: 150px;
}

.column-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.column-option:hover {
  background-color: #3a3a3c;
  border-radius: 4px;
}

.columns-menu button {
  background-color: #263d42; 
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.columns-menu button:hover {
  background-color: #3a3a3c; 
}

/* Estilo para el botón de flecha */
.sort-button {
  background-color: #263D42; 
  color: white;
  border: none;
  padding: 10px 15px; 
  border-radius: 8px; 
  cursor: pointer;
}

.sort-button i {
  color: white; 
}

.sort-button:hover {
  background-color: #63C7B2; 
}

/* Estilo para el botón de Columns */
.columns-button {
  background-color: #263D42; 
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
}

.columns-button:hover {
  background-color: #63C7B2; 
}

</style>