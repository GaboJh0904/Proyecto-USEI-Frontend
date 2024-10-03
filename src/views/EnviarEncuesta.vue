<template>
  <div>
    <header>
      <NavBar userRole="Admin" />
    </header>
    <main class="student-list-container">
      <h1 class="student-list-title">Estudiantes que Completaron la Encuesta</h1>
      <div class="student-table-container">
        <h2>Lista de Estudiantes</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre del Estudiante</th>
              <th>Estado</th> <!-- Columna para el estado del certificado -->
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody v-if="estudiantes.length > 0">
    <tr v-for="estudiante in estudiantes" :key="estudiante.idEstudiante">
        <td>{{ estudiante.estudianteIdEstudiante.nombre }} {{ estudiante.estudianteIdEstudiante.apellido }}</td>
        <td>{{ estudiante.estado }}</td>
        <td>
            <button @click="enviarCertificado(estudiante.idEstudiante)" class="send-button">Enviar Certificado</button>
        </td>
    </tr>
</tbody>
          <tbody v-else>
            <tr>
              <td colspan="3">No hay estudiantes que hayan completado la encuesta.</td>
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
      estudiantes: [] // Lista de estudiantes con estado de certificado
    };
  },
  mounted() {
    this.fetchEstudiantes(); // Cargar la lista de estudiantes al montar el componente
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