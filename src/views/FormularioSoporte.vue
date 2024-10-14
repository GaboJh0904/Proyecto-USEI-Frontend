<template>
  <header>
      <NavBar :userRole="userRole" />
  </header>
  <div class="support-form">
    <div class="header">
      <img src="@/components/images/soporte.png" alt="Support icon" class="support-icon" />
      <h2>Formulario de soporte</h2>
    </div>
    <form @submit.prevent="submitSupport">
      <div class="input-group">
        <label for="tipoProblema">Tipo de Problema:</label>
        <select v-model="formData.Tipo_Problema_id_problema" id="tipoProblema">
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

      <button type="submit">Registrar</button>
    </form>
  </div>
  <FooterComponent />
</template>

<script>
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
      problemas: [], 
      formData: {
        Tipo_Problema_id_problema: null,
        mensaje: '',
        fecha: new Date().toISOString(), 
        Usuario_id_usuario: null
      }
    };
  },
  methods: {
    async fetchProblemas() {
      this.problemas = [
        { id: 1, problema: 'Problemas de acceso' },
        { id: 2, problema: 'Problemas con la encuesta' },
        { id: 3, problema: 'Problemas con la emision de certificados' },
        { id: 4, problema: 'Problemas con el reporte de datos' },
        { id: 5, problema: 'Problemas técnicos generales' }
      ];
    },
    submitSupport() {
      console.log('Enviando soporte:', this.formData);
    }
  },
  mounted() {
    this.fetchProblemas(); 
  }
};
</script>

<style scoped>
.support-form {
  background-color: #ccdbdc;
  color: #100f0f;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
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
</style>
