<template>
  <header>
    <NavBar :userRole="userRole" />
  </header>

  <div class="support-container">
    <!-- Loading Animation -->
    <div v-if="loading" class="loading-overlay">
      <div class="container">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    </div>

    <!-- Plazos Form -->
    <div v-else class="support-form">
      <div class="header">
        <img src="@/components/images/plazos.png" alt="Support icon" class="support-icon" />
        <h2>Formulario de Plazos</h2>
      </div>
      <form @submit.prevent="submitPlazo">
        <div class="input-group">
          <label for="estado">Estado:</label>
          <select v-model="formData.estado" id="estado" required>
            <option value="" disabled>Seleccione un estado</option>
            <option value="activo">Activo</option>
            <option value="pendiente">Pendiente</option>
          </select>
          <span v-if="!formData.estado && showErrors" class="error-message">Este campo es obligatorio.</span>
        </div>

        <div class="input-group">
          <label for="fechaFinalizacion">Fecha de Finalización:</label>
          <input type="date" v-model="formData.fechaFinalizacion" :min="formData.fechaModificacion" id="fechaFinalizacion" required />
          <span v-if="!formData.fechaFinalizacion && showErrors" class="error-message">Este campo es obligatorio.</span>
        </div>

        <!-- Fecha de Modificación (auto) -->
        <div class="input-group">
          <label for="fechaModificacion">Fecha de Modificación:</label>
          <input type="text" id="fechaModificacion" v-model="formattedFecha" disabled />
        </div>

        <button type="submit">Enviar</button>
        <button type="button" @click.prevent="enviarRecordatorio">Enviar Recordatorio</button>
      </form>
    </div>

    <!-- Plazos History Table with Pagination and Sorting -->
    <div class="support-history">
      <h2>Historial de Plazos</h2>

      <div class="filter-sort-container">
        <input class="search-input" type="text" v-model="filterTerm" placeholder="Buscar por usuario..." @input="fetchPlazos(1)" />
        <select class="dropdown-page-size" v-model="perPage" @change="fetchPlazos(1)">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <button class="sort-button" @click="toggleSortDirection">
          <i :class="sortDirection === 'asc' ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
        </button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha de Finalización</th>
              <th>Estado</th>
              <th>Fecha de Modificación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plazo in plazos" :key="plazo.id_plazo">
              <td>{{ plazo.usuarioNombre }}</td>
              <td>{{ plazo.fechaFinalizacion }}</td>
              <td>{{ plazo.estado }}</td>
              <td>{{ plazo.fechaModificacion }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationComponent :page-count="totalPages" :current-page="currentPage" @page-changed="handlePageClick" />
    </div>
  </div>

  <FooterComponent />
</template>

<script>
import Swal from 'sweetalert2';
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import { BASE_URL } from '@/config/globals';

export default {
  name: 'FormularioPlazos',
  components: {
    NavBar,
    FooterComponent,
    PaginationComponent,
  },
  data() {
    return {
      userRole: '',
      formData: {
        estado: '',
        fechaFinalizacion: '',
        fechaModificacion: new Date().toISOString().split('T')[0],
        usuario: { idUsuario: null },
      },
      formattedFecha: '',
      plazos: [],
      loading: false,
      showErrors: false,
      currentPage: 1,
      totalPages: 1,
      perPage: 5,
      filterTerm: '',
      sortBy: 'fechaModificacion',
      sortDirection: 'asc',
    };
  },
  methods: {
    async fetchPlazos(page = 1) {
      try {
        const userId = localStorage.getItem('id_usuario');
        if (!userId) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró información del usuario. Por favor, inicia sesión.',
            confirmButtonColor: '#6b45b1',
            confirmButtonText: 'Aceptar',
          });
          return;
        }

        const response = await this.$protectedAxios.get(`${BASE_URL}/plazo/all`, {
          params: {
            page: page - 1,
            size: this.perPage,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            filter: this.filterTerm,
            idUsuario: userId,
          },
        });

        this.plazos = response.data.content.map(plazo => {
          return {
            ...plazo,
            fechaFinalizacion: new Date(plazo.fechaFinalizacion).toLocaleDateString(),
            fechaModificacion: new Date(plazo.fechaModificacion).toLocaleDateString(),
            usuarioNombre: plazo.usuarioIdUsuario ? plazo.usuarioIdUsuario.nombre : 'Usuario desconocido',
          };
        });
        this.totalPages = response.data.totalPages;
        this.currentPage = page;
      } catch (error) {
        console.error('Error al obtener los plazos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al obtener los plazos.',
          confirmButtonColor: '#6b45b1',
          confirmButtonText: 'Aceptar',
        });
      }
    },
    
    async enviarRecordatorio() {
  try {
    this.loading = true;
    await axios.post(`${BASE_URL}/plazo/recordatorio`);

    this.loading = false;
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Recordatorio enviado a los estudiantes que no han completado la encuesta.',
      confirmButtonColor: '#49caa1',
      confirmButtonText: 'Aceptar',
    });
  } catch (error) {
    console.error('Error al enviar el recordatorio:', error);
    this.loading = false;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al enviar el recordatorio.',
      confirmButtonColor: '#6b45b1',
      confirmButtonText: 'Aceptar',
    });
  }
},

    async submitPlazo() {
      this.showErrors = true;

      if (!this.formData.estado || !this.formData.fechaFinalizacion) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor complete todos los campos obligatorios.',
          confirmButtonColor: '#6b45b1',
          confirmButtonText: 'Aceptar',
        });
        return;
      }

      try {
        this.loading = true;
        const userId = localStorage.getItem('id_usuario');
        if (!userId) {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró información del usuario. Por favor, inicia sesión.',
            confirmButtonColor: '#6b45b1',
            confirmButtonText: 'Aceptar',
          });
          return;
        }
        
        const data = {
          estado: this.formData.estado,
          fechaFinalizacion: new Date(this.formData.fechaFinalizacion).toISOString().split('T')[0],
          fechaModificacion: new Date(this.formData.fechaModificacion).toISOString().split('T')[0],
          usuarioIdUsuario: { idUsuario: userId },
        };
        await this.$protectedAxios.post(`${BASE_URL}/plazo`, data);

        this.loading = false;
        this.showErrors = false;

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Plazo registrado correctamente.',
          confirmButtonColor: '#49caa1',
          confirmButtonText: 'Aceptar',
        });

        this.fetchPlazos();
      } catch (error) {
        console.error('Error al enviar el plazo:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al enviar el plazo.',
          confirmButtonColor: '#6b45b1',
          confirmButtonText: 'Aceptar',
        });
      }
    },

    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.fetchPlazos(1);
    },

    handlePageClick(pageNumber) {
      this.fetchPlazos(pageNumber);
    },
  },
  mounted() {
    this.userRole = localStorage.getItem('rol') || '';
    this.fetchPlazos();
    this.formattedFecha = this.formData.fechaModificacion;
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.ball {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  animation: wave 1.5s ease-in-out infinite;
  background-color: #37bf57;
}

.ball:nth-child(2) {
  animation-delay: -0.2s;
  background-color: #49caa1;
}

.ball:nth-child(3) {
  animation-delay: -0.4s;
  background-color: #12aab4;
}

.ball:nth-child(4) {
  animation-delay: -0.6s;
  background-color: #2c88c1;
}

.ball:nth-child(5) {
  animation-delay: -0.8s;
  background-color: #6b45b1;
}

@keyframes wave {
  0%, 100% {
    transform: translateY(30px);
  }
  50% {
    transform: translateY(-30px);
  }
}

.support-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 0 50px;
}

.support-form {
  background-color: #ccdbdc;
  color: #100f0f;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  flex: 1;
  margin-top: 110px;
  margin-bottom: 50px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.support-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

h2 {
  font-size: 24px;
  margin: 0;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

textarea, select, input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.dropdown-page-size {
  width: auto; 
  max-width: 80px; 
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 5px;
}

button {
  background-color: #8dced7;
  color: #000;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  display: block;
  margin: 20px auto;
}

button:hover {
  background-color: #8E6C88;
  color: #fff;
}

.support-history {
  flex: 1;
  background-color: #ccdbdc;
  padding: 20px;
  border-radius: 8px;
  margin-top: 110px;
  width: 300px;
  height: 430px;
  overflow-y: auto;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
}

.filter-sort-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #070707;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #263d42;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  padding: 10px;
}

.support-history h2 {
  margin-bottom: 20px;
  text-align: center;
}
</style>
