<template>
  <header>
    <NavBar :userRole="userRole" />
  </header>

  <div class="support-container">
    <!-- Animación de carga -->
    <div v-if="loading" class="loading-overlay">
      <div class="container">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    </div>

    <!-- Formulario de soporte -->
    <div v-else class="support-form">
      <div class="header">
        <img src="@/components/images/soporte.png" alt="Support icon" class="support-icon" />
        <h2>Formulario de soporte</h2>
      </div>
      <form @submit.prevent="submitSupport">
        <div class="input-group">
          <label for="tipoProblema">Tipo de Problema:</label>
          <select v-model="formData.tipoProblema.idProblema" id="tipoProblema">
            <option v-for="problema in problemas" :key="problema.id" :value="problema.id">{{ problema.problema }}</option>
          </select>
        </div>

        <div class="input-group">
          <label for="mensaje">Mensaje:</label>
          <textarea id="mensaje" v-model="formData.mensaje" placeholder="Describe el problema..." rows="5"></textarea>
        </div>

        <!-- Campo de fecha (automático) -->
        <div class="input-group">
          <label for="fecha">Fecha:</label>
          <input type="text" id="fecha" v-model="formData.fecha" disabled />
        </div>

        <button type="submit">Enviar 📧</button>
      </form>
    </div>

    <!-- Tabla de historial de reportes -->
    <div class="support-history">
      <h2>Historial de Reportes</h2>
      <table>
        <thead>
          <tr>
            <th>Tipo de Problema</th>
            <th>Mensaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reporte in reportes" :key="reporte.id_soporte">
            <td>{{ reporte.tipoProblema }}</td>
            <td>{{ reporte.mensaje }}</td>
            <td>{{ reporte.fecha }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <FooterComponent />
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'FormularioSoporte',
  components: {
    NavBar,
    FooterComponent,
  },
  data() {
    return {
      userRole: '',
      problemas: [], 
      formData: {
        tipoProblema: { idProblema: null },  // Relacionar tipo de problema con el objeto correcto
        mensaje: '',
        fecha: new Date().toISOString(),
        usuario: { idUsuario: null }, // Relación con el usuario
      },
      reportes: [
        { id_soporte: 1, tipoProblema: 'Problemas de acceso', mensaje: 'No puedo iniciar sesión', fecha: '2024-10-14', enviado: true },
        { id_soporte: 2, tipoProblema: 'Problemas con la encuesta', mensaje: 'Error al completar', fecha: '2024-10-12', enviado: false },
      ],
      loading: false // Estado de carga
    };
  },
  methods: {
    async fetchProblemas() {
      this.problemas = [
        { id: 1, problema: 'Problemas de acceso' },
        { id: 2, problema: 'Problemas con la encuesta' },
        { id: 3, problema: 'Problemas con la emisión de certificados' },
        { id: 4, problema: 'Problemas con el reporte de datos' },
        { id: 5, problema: 'Problemas técnicos generales' }
      ];
    },
    async submitSupport() {
      try {
        // Mostrar la animación de carga
        this.loading = true;

        // Obtener el id_usuario desde localStorage
        const userId = localStorage.getItem('id_usuario');
        console.log("Información de usuario desde localStorage:", userId);

        if (!userId) {
          this.loading = false; // Ocultar la animación de carga
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró información del usuario. Por favor, inicia sesión.',
            confirmButtonColor: '#6b45b1', // Color morado
            confirmButtonText: 'Aceptar'
          });
          return;
        }

        // Asignar el id_usuario correctamente a formData
        this.formData.usuario.idUsuario = userId;

        console.log("Datos enviados al backend:", this.formData);

        // Enviar los datos del soporte
        const response = await axios.post('http://localhost:8082/soporte', this.formData);

        // Ocultar la animación de carga antes de mostrar el mensaje
        this.loading = false; // Desaparece antes de mostrar el alert
        
        // Mostrar el mensaje de éxito con SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Reporte enviado correctamente.',
          confirmButtonColor: '#49caa1', // Color celeste
          confirmButtonText: 'Aceptar'
        });
        console.log("Soporte enviado:", response.data);

      } catch (error) {
        console.error("Error al enviar soporte:", error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al enviar el soporte.',
          confirmButtonColor: '#6b45b1', // Color morado
          confirmButtonText: 'Aceptar'
        });
      }
    },
  },
  mounted() {
    this.userRole = localStorage.getItem('rol') || '';
    this.fetchProblemas();
  },
};
</script>

<style scoped>
/* Overlay para la animación de carga, ocupa toda la pantalla */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Asegura que esté encima de todo */
}

.container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.ball {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  animation: wave 1.5s ease-in-out infinite;
  background-color: #37bf57;
}

.ball:nth-child(2) {
  animation-delay: -0.2s;
  background-color: #49caa1;
}

.ball:nth-child(3) {
  animation-delay: -0.4s;
  background-color: #12aab4;
}

.ball:nth-child(4) {
  animation-delay: -0.6s;
  background-color: #2c88c1;
}

.ball:nth-child(5) {
  animation-delay: -0.8s;
  background-color: #6b45b1;
}

@keyframes wave {
  0%, 100% {
    transform: translateY(30px);
  }
  50% {
    transform: translateY(-30px);
  }
}

.support-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 0 50px;
}

.support-form {
  background-color: #ccdbdc;
  color: #100f0f;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  flex: 1;
  margin-top: 110px;
  margin-bottom: 50px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.support-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

h2 {
  font-size: 24px;
  margin: 0;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

textarea, select, input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  background-color: #8dced7;
  color: #000;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  display: block;
  margin: 20px auto;
}

button:hover {
  background-color: #8E6C88;
  color: #fff;
}

.support-history {
  flex: 1;
  background-color: #ccdbdc;
  padding: 20px;
  border-radius: 8px;
  margin-top: 110px;
  width: 300px;
  height: 400px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #070707;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #263d42;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  padding: 10px;
}

.support-history h2 {
  margin-bottom: 20px;
  text-align: center;
}
</style>
