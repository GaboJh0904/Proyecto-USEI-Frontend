<template>
  <div>
    <header>
      <NavBar :userRole="userRole" :userName="userName" />
    </header>
    <main class="user-management-container">
      <h1 class="user-management-title">Crear Nuevo Reporte</h1>
      
      <form @submit.prevent="crearReporte">
        <label class="block mb-2">
          <span class="form-label">Título</span>
          <input type="text" v-model="titulo" class="form-input" required />
        </label>
        
        <label class="block mb-2">
          <span class="form-label">Descripción</span>
          <textarea v-model="descripcion" class="form-input" rows="3"></textarea>
        </label>
        
        <label class="block mb-2">
          <span class="form-label">Formato</span>
          <select v-model="formato" class="form-input">
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
          </select>
        </label>
        
        <button type="submit" class="submit-btn">Crear Reporte</button>
      </form>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'CrearReporteDirector',
  components: {
    NavBar,
    FooterComponent,
  },
  data() {
    return {
      titulo: "",
      descripcion: "",
      formato: "PDF",
    };
  },
  methods: {
    crearReporte() {
      console.log("Crear reporte con título:", this.titulo);
    },
  },
};
</script>

<style scoped>
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

.form-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-bottom: 1rem;
}

.submit-btn {
  background-color: #263D42;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 600px;
}

.submit-btn:hover {
  background-color: #63C7B2;
}
</style>
