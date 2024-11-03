<template>
  <header>
    <NavBar :userRole="userRole" />
  </header>

  <div class="support-container">
    <!-- Animación de carga -->
    <div v-if="loading" class="loading-overlay">
      <div class="container">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    </div>

    <!-- Formulario de soporte -->
    <div v-else class="support-form">
      <div class="header">
        <img src="@/components/images/soporte.png" alt="Support icon" class="support-icon" />
        <h2>Formulario de soporte</h2>
      </div>
      <form @submit.prevent="submitSupport">
        <div class="input-group">
          <label for="tipoProblema">Tipo de Problema:</label>
          <select v-model="formData.tipoProblema.idProblema" id="tipoProblema" required>
            <option value="" disabled>Seleccione un tipo de problema</option>
            <option v-for="problema in problemas" :key="problema.id" :value="problema.id">{{ problema.problema }}</option>
          </select>
          <span v-if="!formData.tipoProblema.idProblema && showErrors" class="error-message">Este campo es obligatorio.</span>
        </div>

        <div class="input-group">
          <label for="mensaje">Mensaje:</label>
          <textarea id="mensaje" v-model="formData.mensaje" placeholder="Describe el problema..." rows="5" required></textarea>
          <span v-if="!formData.mensaje && showErrors" class="error-message">Este campo es obligatorio.</span>
        </div>

        <!-- Campo de fecha (automático) -->
        <div class="input-group">
          <label for="fecha">Fecha:</label>
          <input type="text" id="fecha" v-model="formattedFecha" disabled />
        </div>

        <button type="submit">Enviar 📧</button>
      </form>
    </div>

    <!-- Tabla de historial de reportes con paginación, filtrado y ordenación -->
    <div class="support-history">
      <h2>Historial de Reportes</h2>

      <!-- Controles para filtro y ordenación -->
      <div class="filter-sort-container">
        <!-- Filtro por mensaje del reporte -->
        <input class="search-input" type="text" v-model="filterTerm" placeholder="Buscar por mensaje..." @input="fetchReportes(1)" />

        <!-- Selección de cantidad de elementos por página -->
        <select class="dropdown-page-size" v-model="perPage" @change="fetchReportes(1)">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        <!-- Botón para seleccionar orden ascendente/descendente -->
        <button class="sort-button" @click="toggleSortDirection">
          <i :class="sortDirection === 'asc' ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Tipo de Problema</th>
            <th>Mensaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reporte in reportes" :key="reporte.id_soporte">
            <td>{{ reporte.tipoProblema.problema }}</td>
            <td>{{ reporte.mensaje }}</td>
            <td>{{ formatDate(reporte.fecha) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Componente de paginación -->
      <PaginationComponent :page-count="totalPages" :current-page="currentPage" @page-changed="handlePageClick" />
    </div>
  </div>

  <FooterComponent />
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue'; // Importa el componente de paginación
import { BASE_URL } from '@/config/globals';

export default {
  name: 'FormularioSoporte',
  components: {
    NavBar,
    FooterComponent,
    PaginationComponent,
  },
  data() {
    return {
      userRole: '',
      problemas: [],
      formData: {
        tipoProblema: { idProblema: null },
        mensaje: '',
        fecha: new Date().toISOString(),
        usuario: { idUsuario: null },
      },
      formattedFecha: '',
      reportes: [],
      loading: false,
      showErrors: false,  // Nueva variable para mostrar errores de validación
      // Parámetros para paginación, ordenación y filtro
      currentPage: 1,
      totalPages: 1,
      perPage: 5,
      filterTerm: '',
      sortBy: 'fecha',
      sortDirection: 'asc',
    };
  },
  methods: {
    async fetchProblemas() {
      this.problemas = [
        { id: 1, problema: 'Problemas de acceso' },
        { id: 2, problema: 'Problemas con la encuesta' },
        { id: 3, problema: 'Problemas con la emisión de certificados' },
        { id: 4, problema: 'Problemas con el reporte de datos' },
        { id: 5, problema: 'Problemas técnicos generales' },
      ];
    },

    async fetchReportes(page = 1) {
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

        // Solicitud al backend con paginación, filtrado y ordenación
        const response = await axios.get(`${BASE_URL}/soporte/paginado`, {
          params: {
            page: page - 1,
            size: this.perPage,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            filter: this.filterTerm,
            idUsuario: userId,
          },
        });

        this.reportes = response.data.content;
        this.totalPages = response.data.totalPages;
        this.currentPage = page;
      } catch (error) {
        console.error('Error al obtener los reportes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al obtener los reportes.',
          confirmButtonColor: '#6b45b1',
          confirmButtonText: 'Aceptar',
        });
      }
    },

    async submitSupport() {
      this.showErrors = true;

      // Verificar si los campos requeridos están llenos
      if (!this.formData.tipoProblema.idProblema || !this.formData.mensaje) {
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

        this.formData.usuario.idUsuario = userId;
        this.formData.fecha = new Date().toISOString().split('.')[0];

        const response = await axios.post(`${BASE_URL}/soporte`, this.formData);

        this.loading = false;
        this.showErrors = false; // Resetea los errores si el envío es exitoso

        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Reporte enviado correctamente.',
          confirmButtonColor: '#49caa1',
          confirmButtonText: 'Aceptar',
        });

        this.fetchReportes();
      } catch (error) {
        console.error('Error al enviar soporte:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al enviar el soporte.',
          confirmButtonColor: '#6b45b1',
          confirmButtonText: 'Aceptar',
        });
      }
    },

    formatDate(dateString) {
      const parsedDate = Date.parse(dateString);
      if (isNaN(parsedDate)) {
        return 'Fecha inválida';
      }
      const date = new Date(parsedDate);
      return date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    },

    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.fetchReportes(1);
    },

    handlePageClick(pageNumber) {
      this.fetchReportes(pageNumber);
    },
  },
  mounted() {
    this.userRole = localStorage.getItem('rol') || '';
    this.fetchProblemas();
    this.fetchReportes();

    this.formattedFecha = this.formatDate(this.formData.fecha);
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
  height: 528px;
  overflow-y: auto;
}

.filter-sort-container {
  display: flex;
  justify-content: space-between; /* Alinea los elementos en una sola línea */
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
