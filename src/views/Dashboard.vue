<template>
    <div>
      <header>
        <NavBar userRole="Admin" />
      </header>
      <main class="student-survey-container">
        <div class="student-info">
          <center><h2>Dashboard</h2></center>
        </div>
  
        <!-- Contenedor de subida de archivos PDF -->
        <div class="upload-container">
          <!-- Campos de filtrado -->
          <div class="filter-container">
            <label for="filter1">Año:</label>
            <select v-model="selectedFilter1" @change="updateCharts">
              <option value="">Seleccione una opción</option>
              <option v-for="option in filterOptions1" :key="option" :value="option">{{ option }}</option>
            </select>
  
            <label for="filter2">Periodo:</label>
            <select v-model="selectedFilter2" @change="updateCharts">
              <option value="">Seleccione una opción</option>
              <option v-for="option in filterOptions2" :key="option" :value="option">{{ option }}</option>
            </select>
          </div>
  
          <!-- Gráficos -->
          <div class="charts-container">
            <!-- Gráfico de Barras -->
            <apexchart type="bar" :options="barChartOptions" :series="barChartData" class="chart-bar" />
  
            <!-- Gráfico de Torta -->
            <apexchart type="pie" :options="pieChartOptions" :series="pieChartData" class="chart-pie" />
          </div>
        </div>
      </main>
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  import ApexCharts from "vue3-apexcharts";
  
  export default {
    name: 'Dashboard',
    components: {
      NavBar,
      FooterComponent,
      ApexCharts,
    },
    data() {
      return {
        usuarioId: null,
        selectedFilter1: "",
        selectedFilter2: "",
        filterOptions1: ["2022", "2023", "2024"],
        filterOptions2: ["Primer Periodo", "Segundo Periodo", "Tercer Periodo"],
        barChartData: [{ name: "Certificados Emitidos", data: [20, 15, 10, 25] }],
        pieChartData: [70, 30], // 70% completado, 30% no completado
        barChartOptions: {
          chart: {
            animations: { enabled: true, speed: 800 },
            toolbar: { show: false },
            background: 'rgba(74, 120, 123, 0.2)',
          },
          xaxis: {
            categories: ["Ingeniería", "Medicina", "Derecho", "Administración"],
            title: { text: "Carreras" }
          },
          title: { text: "Certificados Emitidos por Carrera", align: 'center' },
          colors: ['#66DA26'],
          dataLabels: { enabled: true },
        },
        pieChartOptions: {
          chart: {
            animations: { enabled: true, easing: 'easeinout', speed: 1200 },
            toolbar: { show: false },
            background: 'rgba(107, 184, 188, 0.2)',
          },
          labels: ["Completado", "No Completado"],
          title: { text: "Encuesta de Estudiantes Completada", align: 'center' },
          colors: ['#4a787b', '#77a6a6'],
          dataLabels: { enabled: true },
        },
      };
    },
    methods: {
      updateCharts() {
        // Actualizar datos de gráficos basados en filtros seleccionados
        this.barChartData = [{ name: "Datos Filtrados", data: [15, 10, 18, 20] }];
        this.pieChartData = [65, 35];
      },
    },
  };
  </script>
  
  <style scoped>
  .student-survey-container {
    padding: 20px;
  }
  
  .upload-container {
    display: flex;
    flex-direction: column;
    background-color: rgba(240, 240, 240, 0.8);
    padding: 20px;
    border: 2px solid #4a787b;
    border-radius: 10px;
    width: 90%;
    margin: 20px auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
  }
  
  .upload-container:hover {
    transform: scale(1.02);
  }
  
  .filter-container {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 10px;
    background-color: rgba(107, 184, 188, 0.1);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #77a6a6;
    background-color: #f0f0f0;
    transition: background-color 0.3s;
  }
  
  select:hover {
    background-color: #e0f0f0;
  }
  
  .charts-container {
    display: flex;
    justify-content: space-around;
  }
  
  .chart-bar, .chart-pie {
    width: 45%;
    background-color: rgba(74, 120, 123, 0.1);
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .chart-bar:hover, .chart-pie:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  </style>
  
  <style scoped>
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
  </style>
  