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
  import { BASE_URL } from '@/config/globals';

  
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
        //-----------valores predefinidos para grafico de barras
        selectedFilter1: "",
        selectedFilter2: "",
        filterOptions1: [],
        filterOptions2: [],


        barChartData: [{ name: "Certificados Emitidos", data: [] }],
        pieChartData: [], 
        barChartOptions: {
                ...this.barChartOptions,

          chart: {
            animations: { enabled: true, speed: 800 },
            toolbar: { show: false },
            background: 'rgba(74, 120, 123, 0.2)',
          },
          xaxis: {
            categories: [],
            title: { text: "Carreras" }
          },
          title: { text: "Certificados Emitidos por Carrera", align: 'center' },
          colors: ['#6c5b7b'],
          dataLabels: { enabled: true },
        },
        //-------------------------------------------------

        //----------grafico de torta
        pieChartData: [],
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

    mounted() {
  this.updateCharts();
  this.fetchFilterOptions();

},

    methods: {
    //----------------grafico de torta
    async fetchFilterOptions() {
    try {
      // Obtener estudiantes que completaron la encuesta
      const completadosResponse = await axios.get(`${BASE_URL}/estado_encuesta/completadas`);
      const completados = completadosResponse.data;

      // Obtener estudiantes que no completaron la encuesta
      const noCompletadosResponse = await axios.get(`${BASE_URL}/estudiante/no_completaron_encuesta`);
      const noCompletados = noCompletadosResponse.data;

      // Actualizar los datos del gráfico de torta 
      this.pieChartData = [completados.length, noCompletados.length];

      // Obtener datos para el gráfico de barras (Certificados emitidos por carrera)
        const certificadosResponse = await axios.get(`${BASE_URL}/estado_certificado/certificados-emitidos`, {
            params: {
                year: this.selectedFilter1 || null,
            }
        });

        const certificadosData = certificadosResponse.data;

        // Mapear los datos para obtener las carreras y los conteos
        const carreras = certificadosData.map(item => item.carrera); // Extraer nombres de carrera
        const cantidades = certificadosData.map(item => item.cantidad ?? 0); // Asegurar que no hay valores undefined en cantidades

        // Imprimir en consola para verificar
        console.log("Carreras:", carreras); // Esto debería mostrar ['Psicología'] o cualquier carrera que obtengas
        console.log("Cantidades:", cantidades); // Esto debería mostrar [1] o los valores correspondientes

        // Actualizar datos del gráfico de barras
        this.barChartData = [
            {
                name: "Certificados Emitidos",
                data: cantidades,
            }
        ];
        
        // Actualizar el eje X del gráfico de barras
        this.barChartOptions = {
            ...this.barChartOptions, // Copiamos las opciones anteriores
            xaxis: {
                ...this.barChartOptions.xaxis, // Copiamos las opciones de xaxis anteriores
                categories: carreras // Actualizar el eje X con los nombres de las carreras
            }
        };
      const response = await axios.get(`${BASE_URL}/estudiante/opciones_filtro`);
      this.filterOptions1 = response.data.anios; // Rellenar opciones de año
      this.filterOptions2 = response.data.periodos; // Rellenar opciones de semestre
    } catch (error) {
      console.error("Error al obtener las opciones de filtro: ", error);
    }
  },
  async updateCharts() {
  try {
    // Obtener estudiantes que completaron la encuesta con filtros de año y periodo
    const completadosResponse = await axios.get(`${BASE_URL}/estado_encuesta/completadas`, {
      params: {
        anio: this.selectedFilter1,
        semestre: this.selectedFilter2,
      },
    });
    const completados = completadosResponse.data;

    // Obtener estudiantes que no completaron la encuesta con filtros de año y periodo
    const noCompletadosResponse = await axios.get(`${BASE_URL}/estudiante/no_completaron_encuesta`, {
      params: {
        anio: this.selectedFilter1,
        semestre: this.selectedFilter2,
      },
    });
    const noCompletados = noCompletadosResponse.data;

    // Actualizar los datos del gráfico de torta
    this.pieChartData = [completados.length, noCompletados.length];

 // Obtener datos para el gráfico de barras (Certificados Emitidos por Carrera)
 const certificadosResponse = await axios.get(`${BASE_URL}/estado_certificado/certificados-emitidos`, {
      params: {
        year: this.selectedFilter1 || null,
        semestre: this.selectedFilter2 || null,
      },
    });

    const certificadosData = certificadosResponse.data;
 // Mapear los datos para el gráfico de barras
 const carreras = certificadosData.map(item => item.carrera);
    const cantidades = certificadosData.map(item => item.cantidad ?? 0);

    this.barChartData = [
      {
        name: "Certificados Emitidos",
        data: cantidades,
      },
    ];
    // Actualizar el eje X del gráfico de barras
    this.barChartOptions = {
      ...this.barChartOptions,
      xaxis: {
        ...this.barChartOptions.xaxis,
        categories: carreras,
      },
    };

  } catch (error) {
    console.error("Error al actualizar los gráficos: ", error);
  }
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
  