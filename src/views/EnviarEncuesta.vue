<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>
    <main class="student-list-container">
      <h1 class="student-list-title">Estudiantes que Completaron la Encuesta</h1>
       <!-- Campos de búsqueda y filtrado -->
       <div class="filters-container">
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
      </div>
      
      <div class="student-table-container">
        <h2>Lista de Estudiantes</h2>
        <table>
          <thead>
            <tr>
              <th @click="toggleSort('nombre')" class="sortable">
                Nombre del Estudiante
                <i :class="sortOrder === 'asc' ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'"></i>
              </th>
              <th>Estado</th> <!-- Columna para el estado del certificado -->
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody v-if="filteredEstudiantes.length > 0">
            <tr v-for="estudiante in filteredEstudiantes" :key="estudiante.idEstudiante">
              <td>{{ estudiante.estudianteIdEstudiante.nombre }} {{ estudiante.estudianteIdEstudiante.apellido }}</td>
              <td>{{ estudiante.estado }}</td>
              <td>
            <button @click="enviarCertificado(estudiante.idEstudiante)" class="send-button">Enviar Certificado</button>
          </td>
    </tr>
</tbody>
          <tbody v-else>
            <tr>
              <td colspan="3">No se encontraron estudiantes que coincidan con los criterios de búsqueda.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>
<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'EnviarEncuesta',
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      estudiantes: [], // Lista de estudiantes con estado de certificado
      searchQuery: '', // Almacena la búsqueda por nombre
      selectedEstado: '', // Almacena el estado seleccionado para el filtro
      sortOrder: 'asc', //orden de los nombres
    };
  },
  mounted() {
    this.fetchEstudiantes(); // Cargar la lista de estudiantes al montar el componente
  },
  computed: {
    filteredEstudiantes() {
      // Filtrar la lista de estudiantes según el nombre y el estado
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
        const response = await axios.get('http://localhost:8082/estado_certificado');
        if (response.data && Array.isArray(response.data)) {
            this.estudiantes = response.data;
        } else {
            console.error('Respuesta inesperada:', response.data);
        }
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
    }
    },
    // Método para alternar la dirección de ordenación
    toggleSort() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    enviarCertificado(idEstudiante) {
      // Lógica para enviar el certificado
      console.log(`Enviando certificado para el estudiante con ID: ${idEstudiante}`);
    }

  }
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
  gap: 20px; /* Añadido para separar los campos */
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
.send-button:hover {
  background-color: #1F2E34;
}
</style>