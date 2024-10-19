<template>
    <div class="popup-overlay" @click.self="$emit('close')">
      <div class="popup-content">
        <button class="close-btn" @click="$emit('close')">&times;</button>
        <h2>Cambiar Contraseña</h2>
        <form @submit.prevent="handleChangePassword">
          <div class="form-group">
            <label for="newPassword">Nueva Contraseña</label>
            <input type="password" id="newPassword" v-model="newPassword" required>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirmar Nueva Contraseña</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" required>
          </div>
  
          <!-- Mostrar mensaje de error si las contraseñas no coinciden -->
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
          <button type="submit" class="submit-btn" >Cambiar Contraseña</button>
          <h2></h2>
        </form>
        <button class="role-btn" @click="$emit('switch-to-student-login')">Cancelar</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';  // Utiliza SweetAlert para mensajes
  
  export default {
    name: 'ChangePasswordPopup',
    data() {
      return {
        newPassword: '',      // Nueva contraseña
        confirmPassword: '',  // Confirmar nueva contraseña
        errorMessage: ''      // Mensaje de error
      };
    },
    methods: {
      async handleChangePassword() {
        // Verificar que las contraseñas coincidan
        if (this.newPassword !== this.confirmPassword) {
          this.errorMessage = 'Las contraseñas no coinciden.';
          return;
        }
  
        // Resetear mensaje de error
        this.errorMessage = '';
  
        try {
          // Obtener el idEstudiante desde localStorage
          const idEstudiante = localStorage.getItem('idEstudianteCorreo');
          // Llamada al backend para cambiar la contraseña
          await axios.put(`http://localhost:8082/estudiante/change-password?idEstudiante=${idEstudiante}`, {
            newPassword: this.newPassword
          });
  
          // Manejar respuesta exitosa
          Swal.fire({
            icon: 'success',
            title: 'Contraseña cambiada',
            text: 'Tu contraseña ha sido cambiada correctamente.',
            confirmButtonText: 'Aceptar',
          });
  
          // Cerrar el popup
          this.$emit('close');
        } catch (error) {
          // Manejar errores
          Swal.fire({
            icon: 'error',
            title: 'Error al cambiar la contraseña',
            text: 'Ha ocurrido un error, por favor intenta nuevamente.',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 15px;
    width: 350px;
    z-index: 1001;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #63c7b2;
    border: none;
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .submit-btn:hover {
    background-color: #8e6c88;
  }
  
  .error-message {
    color: red;
  }

  .role-btn {
  width: 100%;
  padding: 10px;
  background-color: #8E6C88;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 17px;
}

.role-btn:hover {
  background-color: #63C7B2;
  color: white;
}
  </style>
  