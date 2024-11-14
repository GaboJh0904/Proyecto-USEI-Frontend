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
            class="filter-input"
          />
          <button @click="toggleSortOrder" class="sort-button">
            Ordenar {{ sortOrder === 'asc' ? 'Ascendente' : 'Descendente' }}
          </button>
        </div>
        
        <!-- Lista de Reportes -->
        <div v-for="reporte in filteredAndSortedReports" :key="reporte.id" class="report-item">
          <div>
            <p class="report-title">{{ reporte.titulo }}</p>
            <p class="report-date">{{ reporte.fecha }}</p>
          </div>
          <div class="report-actions">
            <button @click="descargarReporte(reporte.id)" class="action-btn download-btn">Descargar</button>
            <button @click="eliminarReporte(reporte.id)" class="action-btn delete-btn">Eliminar</button>
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
        reportes: [
          { id: 1, titulo: "Reporte 1", fecha: "2024-11-01" },
          { id: 2, titulo: "Reporte 2", fecha: "2024-11-02" },
        ],
      };
    },
    computed: {
      filteredAndSortedReports() {
        return this.reportes
          .filter((reporte) => reporte.titulo.toLowerCase().includes(this.filterText.toLowerCase()))
          .sort((a, b) => this.sortOrder === "asc" ? a.fecha.localeCompare(b.fecha) : b.fecha.localeCompare(a.fecha));
      },
    },
    methods: {
      toggleSortOrder() {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      },
      descargarReporte(id) {
        console.log("Descargar reporte:", id);
      },
      eliminarReporte(id) {
        console.log("Eliminar reporte:", id);
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
  