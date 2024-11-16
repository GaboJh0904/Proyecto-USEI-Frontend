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

        <button type="submit" class="submit-btn">Crear Reporte</button>
      </form>
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
  name: 'CrearReporteDirector',
  components: {
    NavBar,
    FooterComponent,
  },
  data() {
    return {
      titulo: "",
      descripcion: "",
      fecha: new Date().toISOString().split('T')[0], // Fecha actual
      usuarioId: 1, // Cambiar según el usuario actual
    };
  },
  methods: {
    async crearReporte() {
      const formData = new FormData();
      formData.append("titulo", this.titulo);
      formData.append("descripcion", this.descripcion);
      formData.append("fecha", this.fecha); // Formato: "yyyy-MM-dd"
      formData.append("UsuarioIdUsuario", this.usuarioId);

      try {
        await this.$publicAxios.post(`${BASE_URL}/reporte/generate-dashboard`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire("Éxito", "Reporte creado exitosamente", "success");
        this.$router.push("/historial-reportes");
      } catch (error) {
        Swal.fire("Error", "No se pudo crear el reporte", "error");
      }
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
