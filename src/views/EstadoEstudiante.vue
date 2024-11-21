<template>
  <div>
    <header>
      <NavBar userRole="Director" />
    </header>
    <main class="student-list-container">
      <h1 class="student-list-title">Estudiantes que Completaron la Encuesta</h1>

      <div class="student-table-container">
        <!-- Filtros y Controles -->
        <div class="filter-sort-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar por nombre..."
            @input="fetchEstudiantes"
           />

          <select v-model="selectedEstadoCertificado" @change="fetchEstudiantes">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="enviado">Enviado</option>
        </select>
        <select v-model="selectedEstadoEncuesta" @change="fetchEstudiantes">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
        </select>
        </div>

        <!-- Tabla de Estudiantes -->
        <h2 class="table-subtitle">Lista de Estudiantes</h2>
        <table>
  <thead>
    <tr>
        <th>Nombre del Estudiante</th>
      <th>Carrera</th>
      <th>Estado Encuesta</th>
      <th>Estado Certificado</th>
    </tr>
  </thead>
  <tbody>
    <tr v-if="!estudiantes.length">
      <td colspan="4" class="no-results">
        No se encontraron estudiantes que coincidan con los criterios de búsqueda.
      </td>
    </tr>
    <tr v-for="estudiante in estudiantes" :key="estudiante.idEstudiante">
      <td>{{ estudiante.nombre }} {{ estudiante.apellido }}</td>
      <td>{{ estudiante.carrera }}</td>
      <td>{{ estudiante.estadoEncuesta || 'Sin información' }}</td>
      <td>{{ estudiante.estadoCertificado || 'Sin información' }}</td>
    </tr>
  </tbody>
</table>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import Swal from "sweetalert2";
import { BASE_URL } from "@/config/globals";

export default {
  name: "EnviarEncuesta",
  components: {
    NavBar,
    FooterComponent,
    PaginationComponent,
  },
  data() {
    return {
      estudiantes: [],
      searchQuery: "",
      selectedEstadoCertificado: "",
      selectedEstadoEncuesta: "",
      sortOrder: "asc",
    };
  },
  mounted() {
    const carreraUsuario = localStorage.getItem("carrera");
    if (!carreraUsuario) {
      Swal.fire({
        icon: "warning",
        title: "Carrera no configurada",
        text: "No se puede mostrar la lista de estudiantes porque la carrera no está configurada. Por favor, inicia sesión nuevamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        this.$router.push({ name: "login" }); // Redirigir al login
      });
      return;
    }
    this.fetchEstudiantes(); // Solo llamar si la carrera está configurada
  },
  methods: {
    async fetchEstudiantes() {
      try {
        const carreraUsuario = localStorage.getItem("carrera");
        if (!carreraUsuario) {
          console.error("Carrera no encontrada en localStorage");
          this.estudiantes = [];
          return;
        }
        const params = {
                carrera: carreraUsuario,
                estadoCertificado: this.selectedEstadoCertificado || null,
                
            };

            const response = await this.$protectedAxios.get(`${BASE_URL}/estudiante/por-carrera`, { params });
            if (response.status === 200 && Array.isArray(response.data)) {
                this.estudiantes = response.data;
          // Iterar sobre cada estudiante para obtener el estado de la encuesta y del certificado
          for (let estudiante of this.estudiantes) {
            await this.fetchEstadoEncuesta(estudiante);
            await this.fetchEstadoCertificado(estudiante);
          }
        } else {
          console.warn("No se encontraron estudiantes para la carrera:", carreraUsuario);
          this.estudiantes = [];
        }
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        this.estudiantes = [];
      }
    },
    async fetchEstadoEncuesta(estudiante) {
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/estado_encuesta/estudiante/${estudiante.idEstudiante}`);
        if (response.status === 200) {
          estudiante.estadoEncuesta = response.data.estado; // Asignar el estado de la encuesta al estudiante
        } else {
          estudiante.estadoEncuesta = "Sin información";
        }
      } catch (error) {
        console.error(`Error al obtener el estado de la encuesta para el estudiante ${estudiante.idEstudiante}:`, error);
        estudiante.estadoEncuesta = "Sin información";
      }
    },
   
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.student-list-container {
  padding-top: 100px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.student-list-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #263d42;
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.student-table-container {
  background-color: #ccdbdc; /* Verde claro */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  animation: fadeIn 0.5s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.table-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #263d42;
  text-align: center;
  margin-bottom: 1.5rem;
}

.student-table-container table {
  width: 100%;
  border-collapse: collapse;
}

.student-table-container th,
.student-table-container td {
  border: 1px solid #263d42;
  padding: 14px;
  text-align: left;
  white-space: nowrap;
  word-wrap: break-word;
}

.student-table-container th {
  background-color: #263d42;
  color: #ccdbdc;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.student-table-container th.sortable:hover {
  background-color: #1F2E34;
}

.student-table-container td {
  color: #333;
  background-color: #f9f9f9;
}

.student-table-container .no-results {
  text-align: center;
  font-size: 1rem;
  color: #8e6c88;
  padding: 1rem;
}

.sortable {
  display: flex;
  align-items: center;
}

.sortable i {
  margin-left: 5px;
  font-size: 0.9em;
}

.filter-sort-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: rgba(130, 206, 217, 0.4);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;
}

.filter-sort-container input,
.filter-sort-container select,
.filter-sort-container button {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  flex: 1;
  max-width: 200px;
}

.filter-sort-container input {
  max-width: 250px;
}

.filter-sort-container button {
  background-color: #8e6c88;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.filter-sort-container button:hover {
  background-color: #63c7b2;
}

.view-survey-button,
.send-button {
  background-color: #80ced7;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
}

.view-survey-button:hover,
.send-button:hover:enabled {
  background-color: #63c7b2;
  transform: scale(1.05);
}

.send-button:disabled {
  background-color: #bab7b7;
  cursor: not-allowed;
}

.sort-button {
  background-color: #80ced7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sort-button:hover {
  background-color: #63c7b2;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.pagination-container button {
  background-color: #80ced7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.pagination-container button:hover {
  background-color: #63c7b2;
}

.pagination-container button:disabled {
  background-color: #bab7b7;
  cursor: not-allowed;
}

.pagination-container span {
  font-size: 1rem;
  color: #263d42;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

</style>
