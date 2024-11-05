<template>
  <div>
    <header>
      <NavBar :userRole="userRole" />
    </header>

    <main class="user-management-container">
      <h1 class="user-management-title">Estudiantes Registrados</h1>

      <!-- Botones de Guardar y Cancelar -->
      <div v-if="editingIndex !== null" class="save-button-container">
        <button @click="saveChanges" class="save-button">Guardar Cambios</button>
        <button @click="cancelChanges" class="cancel-button">Cancelar</button>
      </div>

      <!-- Filtro, selección de columnas y número de registros -->
      <div class="filter-sort-container">
        <!-- Barra de búsqueda -->
        <input v-model="searchTerm" placeholder="Buscar por CI o correo" @input="fetchEstudiantes(1)" />

        <!-- Selección de cantidad de registros por página -->
        <select v-model="perPage" @change="fetchEstudiantes(1)">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        <!-- Botón de orden ascendente/descendente -->
        <button class="sort-button" @click="toggleSortDirection">
          <i :class="sortDirection === 'asc' ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
        </button>

        <!-- Mostrar/ocultar columnas -->
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

      <!-- Tabla de estudiantes -->
      <div class="user-table-container">
        <table>
          <thead>
            <tr>
              <th v-if="visibleColumns.ci" @click="sort('ci')">CI</th>
              <th v-if="visibleColumns.correoInstitucional" @click="sort('correoInstitucional')">Correo Institucional</th>
              <th v-if="visibleColumns.acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(estudiante, index) in estudiantes" :key="estudiante.id">
              <td v-if="visibleColumns.ci">
                <input v-if="editingIndex === index" v-model="editedEstudiante.ci" />
                <span v-else>{{ estudiante.ci }}</span>
              </td>
              <td v-if="visibleColumns.correoInstitucional">
                <input v-if="editingIndex === index" v-model="editedEstudiante.correoInstitucional" />
                <span v-if="emailError" class="error-message">{{ emailError }}</span>
                <span v-else>{{ estudiante.correoInstitucional }}</span>
              </td>
              <td v-if="visibleColumns.acciones">
                <button v-if="editingIndex !== index" @click="editEstudiante(index)" class="action-btn edit-btn">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button v-if="editingIndex !== index" @click="deleteEstudiante(estudiante.id)" class="action-btn delete-btn">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationComponent :page-count="totalPages" @page-changed="handlePageClick" />
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BASE_URL } from '@/config/globals';

export default {
  name: 'EstudiantesRegistrados',
  components: {
    NavBar,
    FooterComponent,
    PaginationComponent
  },
  data() {
    return {
      userRole: '', // Inicializa userRole aquí
      userName: '',
      estudiantes: [],
      editingIndex: null,
      editedEstudiante: {},
      searchTerm: '',
      perPage: 10,
      currentPage: 1,
      sortBy: 'ci',
      sortDirection: 'asc',
      totalPages: 1,
      showColumnsMenu: false,
      visibleColumns: {
        ci: true,
        correoInstitucional: true,
        acciones: true
      },
      emailError: ''
    };
  },
  methods: {
    async fetchEstudiantes(page = 1) {
      try {
        const response = await axios.get(`${BASE_URL}/estudiante`, {
          params: {
            page: page - 1,
            size: this.perPage,
            filter: this.searchTerm,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection
          }
        });
        const { content, totalPages } = response.data;
        this.estudiantes = content;
        this.totalPages = totalPages;
      } catch (error) {
        Swal.fire('Error', 'No se pudo cargar la lista de estudiantes', 'error');
      }
    },
    editEstudiante(index) {
      this.editingIndex = index;
      this.editedEstudiante = { ...this.estudiantes[index] };
    },
    saveChanges() {
      if (this.editingIndex !== null) {
        if (!this.editedEstudiante.ci || !this.editedEstudiante.correoInstitucional) {
          Swal.fire('Error', 'Todos los campos deben estar completos', 'error');
          return;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.editedEstudiante.correoInstitucional)) {
          Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un correo electrónico válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          return;
        }

        this.estudiantes[this.editingIndex] = { ...this.editedEstudiante };
        this.editingIndex = null;
        Swal.fire('Guardado', 'Cambios guardados exitosamente', 'success');
      }
    },
    cancelChanges() {
      this.editingIndex = null;
    },
    deleteEstudiante(id) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#80CED7',
        cancelButtonColor: '#8E6C88',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.estudiantes = this.estudiantes.filter(estudiante => estudiante.id !== id);
          Swal.fire('Eliminado', 'Estudiante eliminado correctamente', 'success');
        }
      });
    },
    handlePageClick(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchEstudiantes(pageNumber);
    },
    sort(field) {
      if (this.sortBy === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortDirection = 'asc';
      }
      this.fetchEstudiantes();
    },
    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.fetchEstudiantes();
    },
    toggleColumnsMenu() {
      this.showColumnsMenu = !this.showColumnsMenu;
    },
    toggleColumn(columnKey) {
      this.visibleColumns[columnKey] = !this.visibleColumns[columnKey];
    },
    getColumnLabel(key) {
      const labels = {
        ci: 'CI',
        correoInstitucional: 'Correo Institucional',
        acciones: 'Acciones'
      };
      return labels[key];
    }
  },
  mounted() {
    this.userRole = localStorage.getItem('rol') || ''; // Asegúrate de asignar userRole aquí
    this.fetchEstudiantes();
  }
};
</script>

<style scoped>
.user-management-container {
  padding-top: 100px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px auto;
}

.user-management-title {
  font-size: 35px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 1rem;
}

.save-button-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.save-button {
  background-color: #63C7B2;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #52b19e;
}

.cancel-button {
  background-color: #8E6C88;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #7a5a73;
}

.filter-sort-container {
  display: flex;
  gap: 20px;
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

.user-table-container {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  overflow-x: auto;
}

.user-table-container table {
  width: 100%;
  border-collapse: collapse;
}

.user-table-container th, .user-table-container td {
  border: 1px solid #263D42;
  padding: 12px;
  text-align: left;
}

.user-table-container th {
  background-color: #263D42;
  color: white;
}

.action-btn {
  padding: 10px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
}

.edit-btn {
  background-color: #80CED7;
}

.delete-btn {
  background-color: #8E6C88;
}

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

.columns-menu button {
  background-color: #263D42;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.columns-dropdown {
  position: absolute;
  background-color: #1c1c1e;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  padding: 10px;
  border-radius: 8px;
  color: white;
}

.column-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.column-option span {
  margin-right: 10px; 
}
</style>
