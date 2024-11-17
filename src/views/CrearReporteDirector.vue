<template>
  <div>
    <header>
      <NavBar :userRole="userRole" :userName="userName" />
    </header>
    <main class="user-management-container">
      <h1 class="user-management-title">Crear Nuevo Reporte</h1>
      
      <form @submit.prevent="crearReporte" class="form-container">
        <label class="form-group">
          <span class="form-label">Título</span>
          <input type="text" v-model="titulo" class="form-input" placeholder="Ingrese el título" required />
        </label>
        
        <label class="form-group">
          <span class="form-label">Descripción</span>
          <textarea
            v-model="descripcion"
            class="form-input"
            rows="4"
            placeholder="Ingrese una descripción detallada"
          ></textarea>
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
      fecha: new Date().toISOString(), // Fecha actual
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

.user-management-container {
  padding: 100px 20px 20px; /* Agregamos un padding-top para evitar que el título quede cubierto */
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}

.user-management-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

.form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 30px 40px;
  width: 100%;
  max-width: 600px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 5px;
  display: inline-block;
}

.form-input {
  width: 170%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  border: 1px solid #63C7B2;
  box-shadow: 0 0 5px rgba(99, 199, 178, 0.5);
  outline: none;
}

.submit-btn {
  background: #263d42;
  color: white;
  padding: 12px 20px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  width: 100%;
  text-align: center;
  transition: background 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background: #63c7b2;
  transform: scale(1.02);
}

.submit-btn:active {
  transform: scale(0.98);
}
</style>
