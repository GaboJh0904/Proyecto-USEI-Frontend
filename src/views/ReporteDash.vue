<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>
    <main class="student-survey-container">
      <div class="student-info">
        <center><h2>Dashboard</h2></center>
      </div>

      <div class="upload-container">
        <!-- Campos de filtrado -->
        <div class="filter-container">
          <label for="filter1">Filtrar por año de encuesta:</label>
          <select v-model="selectedFilter1" @change="updateCharts">
            <option value="">Seleccione una opción</option>
            <option v-for="option in filterOptions1" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <!-- Tabla dinámica -->
        <div class="charts-container">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Género</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in generoData" :key="index">
                  <td>{{ item[0] }}</td> <!-- Género -->
                  <td>{{ item[1] }}</td> <!-- Cantidad -->
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Gráfico de Torta -->
          <apexchart
            type="pie"
            :options="pieChartOptions"
            :series="pieChartData"
            class="chart-pie"
          />
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import ApexCharts from "vue3-apexcharts";
import { BASE_URL } from "@/config/globals";

export default {
  name: "Dashboard",
  components: {
    NavBar,
    FooterComponent,
    ApexCharts,
  },
  data() {
    return {
      selectedFilter1: "",
      filterOptions1: [],
      generoData: [], // Datos de género dinámicos
      pieChartData: [],
      pieChartOptions: {
        chart: {
          animations: { enabled: true, easing: "easeinout", speed: 1200 },
          toolbar: { show: false },
          background: "rgba(107, 184, 188, 0.2)",
        },
        labels: ["Completado", "No Completado"],
        title: {
          text: "Encuesta de Estudiantes Completada",
          align: "center",
        },
        colors: ["#4a787b", "#77a6a6"],
        dataLabels: { enabled: true },
      },
    };
  },
  mounted() {
    this.updateCharts();
    this.fetchFilterOptions();
  },
  methods: {
    async updateCharts() {
      try {
        // Obtener datos para la tabla de género con el filtro de año
        const generoResponse = await axios.get(`${BASE_URL}/estudiante/countByGeneroAndAnio`, {
          params: {
            anio: this.selectedFilter1 || null, // Usar el filtro de año si está seleccionado
          },
        });
        this.generoData = generoResponse.data;

        const completadosResponse = await axios.get(`${BASE_URL}/estado_encuesta/completadas`);
          
        const completados = completadosResponse.data;

        const noCompletadosResponse = await axios.get(`${BASE_URL}/estudiante/no_completaron_encuesta`);
          
        const noCompletados = noCompletadosResponse.data;

        // Actualizar datos del gráfico de torta
        this.pieChartData = [completados.length, noCompletados.length];
      } catch (error) {
        console.error("Error al actualizar los gráficos: ", error);
      }
    },
    async fetchFilterOptions() {
      try {
        const response = await axios.get(`${BASE_URL}/estudiante/opciones_filtro`);
        this.filterOptions1 = response.data.anios;
      } catch (error) {
        console.error("Error al obtener las opciones de filtro: ", error);
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


  .table-container {
  width: 45%;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  padding: 12px;
  border: 1px solid #ddd;
}

th {
  background-color: #4a787b;
  color: #ffffff;
}

td {
  background-color: rgba(240, 240, 240, 0.8);
}

  </style>
  