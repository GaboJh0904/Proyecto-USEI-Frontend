<template>
  <div>
    <header>
      <NavBar :userRole="userRole" :userName="userName" />
    </header>
    <main class="user-management-container">
      <h1 class="user-management-title">Historial de Reportes</h1>
      
      <!-- Filtro y Ordenamiento -->
      <div class="filter-sort-container">
        <input
          type="text"
          placeholder="Filtrar por título..."
          v-model="filterText"
          @input="fetchReportes"
          class="filter-input"
        />
        <button @click="toggleSortOrder" class="sort-button">
          Ordenar {{ sortOrder === 'asc' ? 'Ascendente' : 'Descendente' }}
        </button>
      </div>
      
      <!-- Lista de Reportes -->
      <div v-for="reporte in reportes" :key="reporte.idReporte" class="report-item">
        <div>
          <p class="report-title">{{ reporte.titulo }}</p>
          <p class="report-date">{{ reporte.fecha }}</p>
        </div>
        <div class="report-actions">
          <button @click="descargarReporte(reporte.idReporte)" class="action-btn download-btn">Descargar</button>
          <button @click="eliminarReporte(reporte.idReporte)" class="action-btn delete-btn">Eliminar</button>
        </div>
      </div>
      
      <!-- Botón para Crear Nuevo Reporte -->
      <button @click="crearNuevoReporte" class="create-report-btn">Crear Nuevo Reporte</button>
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
    async fetchReportes(page = 1) {
      try {
        const response = await this.$publicAxios.get(`${BASE_URL}/reporte`, {
          params: {
            page: page - 1,
            size: this.perPage,
            sortBy: 'titulo',
            sortDirection: this.sortOrder,
            filter: this.filterText,
          },
        });
        this.reportes = response.data.content;
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
  },
};
</script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  
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
    margin-bottom: 2rem;
  }
  
  .filter-sort-container {
    display: flex;
    gap: 22px;
    margin-bottom: 20px;
  }
  
  .filter-input {
    width: 40%;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  
  .sort-button {
    background-color: #263D42;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .sort-button:hover {
    background-color: #63C7B2;
  }
  
  .report-item {
    display: flex;
    justify-between: space-between;
    align-items: center;
    border: 1px solid #CBDADB;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 10px;
    width: 100%;
    max-width: 600px;
  }
  
  .report-title {
    font-weight: 500;
    font-size: 18px;
  }
  
  .report-date {
    color: #8A8A8A;
    font-size: 14px;
  }
  
  .report-actions {
    display: flex;
    gap: 10px;
  }
  
  .action-btn {
    padding: 10px;
    font-weight: bold;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
  
  .download-btn {
    background-color: #80CED7;
    color: white;
  }
  
  .delete-btn {
    background-color: #8E6C88;
    color: white;
  }
  
  .create-report-btn {
    background-color: #263D42;
    color: white;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    margin-top: 20px;
    cursor: pointer;
    width: 100%;
    max-width: 600px;
  }
  
  .create-report-btn:hover {
    background-color: #63C7B2;
  }
  </style>
  