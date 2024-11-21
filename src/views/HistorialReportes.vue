<template>
  <div>
    <header>
      <NavBar :userRole="userRole" />
    </header>
    <main class="user-management-container">
      <h1 class="user-management-title">Historial de Reportes</h1>

      <!-- Filtro y Ordenamiento -->
      <div class="filter-sort-container">
        <div class="search-container">
          <input
            type="text"
            placeholder="Buscar por título..."
            v-model="filterText"
            @input="fetchReportes(this.currentPage)"
            class="filter-input"
          />
          <button class="search-button" @click="fetchReportes">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <button @click="toggleSortOrder" class="sort-button">
          <i class="fas fa-sort"></i>
          {{ sortOrder === 'asc' ? 'Ascendente' : 'Descendente' }}
        </button>
      </div>

      <!-- Lista de Reportes -->
      <div v-if="reportes.length === 0" class="no-reports">
        No se encontraron reportes con el término buscado.
      </div>
      <div v-else>
        <div v-for="reporte in reportes" :key="reporte.idReporte" class="report-item">
          <div>
            <p class="report-title">{{ reporte.titulo }}</p>
            <p class="report-date">{{ formatDate(reporte.fecha) }}</p>
          </div>
          <div class="report-actions">
            <button
              @click="descargarReporte(reporte.idReporte)"
              class="action-btn download-btn"
            >
              <i class="fas fa-download"></i> Descargar
            </button>
            <button
              @click="confirmEliminarReporte(reporte.idReporte)"
              class="action-btn delete-btn"
            >
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
      <!-- Paginación -->
      <div class="pagination-container">
        <button @click="previousPage" :disabled="currentPage === 1" class="page-btn">
          Anterior
        </button>
        <span>Página {{ currentPage }}</span>
        <button @click="nextPage" :disabled="reportes.length < perPage" class="page-btn">
          Siguiente
        </button>
      </div>

      <!-- Botón para Crear Nuevo Reporte -->
      <button @click="crearNuevoReporte" class="create-report-btn">
        <i class="fas fa-plus"></i> Crear Nuevo Reporte
      </button>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';
import { BASE_URL } from '@/config/globals';

export default {
  name: 'HistorialReportes',
  components: {
    NavBar,
    FooterComponent,
  },
  data() {
    return {
      filterText: "",
      sortOrder: "asc",
      reportes: [],
      perPage: 5,
      currentPage: 1,
      userRole: localStorage.getItem('rol') || '', // Carga el rol del usuario
      usuarioId: localStorage.getItem('id_usuario'), // Cambiar según el usuario actual
    };
  },
  mounted(){
    this.fetchReportes();
  },
  methods: {
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      this.fetchReportes();
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchReportes(this.currentPage); // Llama a fetchReportes con la página actualizada
      }
    },
    nextPage() {
      this.currentPage++;
      this.fetchReportes(this.currentPage); // Llama a fetchReportes con la página actualizada
    },
    async fetchReportes(page = this.currentPage) {
      try {
        if (isNaN(this.currentPage) || this.currentPage < 1) {
          page = 1; // Reinicia a la primera página si hay un valor inválido
        }
        const response = await this.$publicAxios.get(`${BASE_URL}/reporte/historial/${this.usuarioId}`, {
          params: {
            page: page - 1, // El backend espera índices basados en 0
            size: this.perPage,
            sortBy: 'titulo',
            sortDirection: this.sortOrder,
            filter: this.filterText || '', // Envía un string vacío si el filtro está vacío
          },
        });
        this.reportes = response.data.content;
        if (this.reportes.length === 0 && this.currentPage > 1) {
          this.currentPage--; // Retrocede si no hay más resultados
        }
      } catch (error) {
        console.error('Error al cargar los reportes:', error);
      }
    },
    async descargarReporte(id) {
      try {
        // Realizar una petición GET al endpoint de descarga
        const response = await this.$publicAxios.get(`${BASE_URL}/reporte/download/${id}`, {
          responseType: 'blob', // Importante para manejar archivos binarios
        });

        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Nombre sugerido del archivo (esto también puede venir desde el backend)
        link.setAttribute('download', `Reporte-${id}.pdf`);
        document.body.appendChild(link);
        link.click();

        // Limpiar el DOM
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        Swal.fire("Descarga completa", "El reporte se descargó correctamente", "success");
      } catch (error) {
        console.error('Error al descargar el reporte:', error);
        Swal.fire("Error", "No se pudo descargar el reporte", "error");
      }
    },
    async eliminarReporte(id) {
      try {
        await this.$protectedAxios.delete(`${BASE_URL}/reporte/${id}`);
        Swal.fire("Eliminado", "El reporte ha sido eliminado correctamente", "success");
        this.fetchReportes();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el reporte", "error");
      }
    },
    crearNuevoReporte() {
      this.$router.push("/crear-reporte-director");
    },
    formatDate(timestamp) {
      if (!timestamp) return "Fecha no disponible";
      const date = new Date(timestamp); // Convierte el número a un objeto Date
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }); // Ajusta el formato según tus necesidades
    },
  },
};
</script>
  
<style scoped>
/* Añadiendo mejores estilos */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

.user-management-container {
  padding: 100px 20px 20px; /* Agregamos un padding-top para evitar que el título quede cubierto */
  min-height: 100vh;
  background-color: #f9f9f9;
  font-family: 'Poppins', sans-serif;
}
  
.user-management-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
  
.filter-sort-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;
}

.search-container {
  display: flex;
  gap: 5px;
}
  
.filter-input {
  width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
  
.search-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.sort-button {
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
  
.report-item {
  background: white;
  padding: 15px;
  width: 60%;
  margin: 0 auto;
  justify-content: space-between;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
  
.report-title {
  font-size: 1.2rem;
  font-weight: 500;
}
  
.report-actions .action-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
}
  
.download-btn {
  background-color: #007bff;
  color: white;
  margin-right: 10px;
}
  
.delete-btn {
  background-color: #dc3545;
  color: white;
}
  
.create-report-btn {
  background-color: #17a2b8;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  margin-left: 50%;
  transform: translateX(-50%);
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-btn {
  background-color: #343a40;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 5px;
}

.page-btn:hover {
  background-color: #6c757d;
}
  
.create-report-btn:hover {
  background-color: #63C7B2;
}

.no-reports {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
  color: #888;
}

  </style>
  