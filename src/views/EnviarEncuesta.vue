<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>
    <main class="student-list-container">
      <h1 class="student-list-title">Estudiantes que Completaron la Encuesta</h1>
       <!--<div class="filters-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar por nombre"
          class="search-input"
        />
        <select v-model="selectedEstado" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Enviado">Enviado</option>
        </select>
      </div>-->
      
      <div class="student-table-container">
        <h2>Lista de Estudiantes</h2>
        <table>
          <thead>
            <tr>
              <th @click="toggleSort('nombre')" class="sortable">
                Nombre del Estudiante
                <i :class="sortOrder === 'asc' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'"></i>
              </th>
              <th>Estado</th>
              <th>Encuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody v-if="sortedEstudiantes.length > 0">
            <tr v-for="estudiante in sortedEstudiantes" :key="estudiante.idEstudiante">
              <td>{{ estudiante.estudianteIdEstudiante.nombre }} {{ estudiante.estudianteIdEstudiante.apellido }}</td>
              <td>{{ estudiante.estado }}</td>
              <td>
                <button @click="verEncuesta(estudiante.estudianteIdEstudiante.idEstudiante)" class="view-survey-button">
                  Ver Encuesta
                </button>
              </td>
              <td>
                <button @click="enviarCertificado(estudiante.estudianteIdEstudiante.idEstudiante)" 

                class="send-button"
                :disabled="estudiante.estado.trim().toLowerCase() === 'enviado'"
                >
                Enviar Certificado
              </button>
              </td>
    </tr>
</tbody>
          <tbody v-else>
            <tr>
              <td colspan="4">No se encontraron estudiantes que coincidan con los criterios de búsqueda.</td>
            </tr>
          </tbody>
        </table>
      </div>
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
  name: 'EnviarEncuesta',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      estudiantes: [], // Lista de estudiantes con estado de certificado
      searchQuery: '', // busqueda por nombre
      selectedEstado: '', // estado seleccionado para el filtro
      sortOrder: 'asc', //orden de los nombres
    };
  },
  mounted() {
    this.fetchEstudiantes(); 
  },
  computed: {
    filteredEstudiantes() {

      return this.estudiantes.filter(estudiante => {
        const fullName = `${estudiante.estudianteIdEstudiante.nombre} ${estudiante.estudianteIdEstudiante.apellido}`.toLowerCase();
        const matchesName = fullName.includes(this.searchQuery.toLowerCase());

        const matchesEstado = this.selectedEstado 
          ? estudiante.estado.trim().toLowerCase() === this.selectedEstado.trim().toLowerCase() 
          : true;

        return matchesName && matchesEstado;
      });
    },
     // Estudiantes ordenados
     sortedEstudiantes() {
      return this.filteredEstudiantes.sort((a, b) => {
        const fullNameA = `${a.estudianteIdEstudiante.nombre} ${a.estudianteIdEstudiante.apellido}`.toLowerCase();
        const fullNameB = `${b.estudianteIdEstudiante.nombre} ${b.estudianteIdEstudiante.apellido}`.toLowerCase();

        if (this.sortOrder === 'asc') {
          return fullNameA.localeCompare(fullNameB);
        } else {
          return fullNameB.localeCompare(fullNameA);
        }
      });
    }
  },
  methods: {
    async fetchEstudiantes() {
    try {
      const response = await this.$protectedAxios.get(`${BASE_URL}/estado_certificado`);
      if (response.data && Array.isArray(response.data)) {
            this.estudiantes = response.data;
        } else {
            console.error('Respuesta inesperada:', response.data);
        }
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
    }
    },

    toggleSort() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    async enviarCertificado(idEstudiante) {
    if (!idEstudiante) {
      Swal.fire('Error', 'ID del estudiante no encontrado', 'error');
      return;
    }

    try {
      // Enviar certificado
      await this.$protectedAxios.post(`${BASE_URL}/certificado/remision`, null, {
        params: {
          idEstudiante: idEstudiante
        }
      });

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: 'Certificado enviado correctamente',
        confirmButtonText: 'Continuar'
      });

      // Refrescar la lista de estudiantes
      this.fetchEstudiantes();
      
    } catch (error) {
      Swal.fire('Error', 'No se pudo enviar el certificado o registrar la notificación', 'error');
      console.error('Error al enviar el certificado o registrar la notificación:', error);
    }
  },
  verEncuesta(idEstudiante) {
      this.$router.push({
        name: 'RespuestasEstudiante',
        params: { idEstudiante }
      });
    }
  }
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.sortable {
  cursor: pointer;
}

.sortable i {
  margin-left: 5px;
  font-size: 0.9em;
}


.filters-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
  max-width: 48rem;
  gap: 20px; 
}


.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #929292;
  border-radius: 15px;
  width: 60%;
}

.filter-select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #929292;
  border-radius: 15px;
  width: 35%;
}



header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}
.student-list-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
}
.student-list-title {
  font-size: 25px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 1.5rem;
}
.student-table-container {
  background-color: #CBDADB;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 48rem;
}
.student-table-container table {
  width: 100%;
  border-collapse: collapse;
}
.student-table-container th,
.student-table-container td {
  border: 1px solid #263D42;
  padding: 12px;
  text-align: left;
}
.student-table-container th {
  background-color: #263D42;
  color: white;
}
.send-button {
  background-color: #263D42;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 15px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}
/* .send-button:hover {
  background-color: #1F2E34;
} */

.send-button:disabled {
  background-color: #bab7b7;
  cursor: not-allowed;
}

.send-button:hover:enabled {
  background-color: #1F2E34;
}
</style>