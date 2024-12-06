<template>
    <div class="popup-overlay" @click.self="$emit('close')">
      <div class="popup-content">
        <button class="close-btn" @click="$emit('close')">&times;</button>
        <h2>Cambio de Contraseña</h2>

        <!-- Botones de alternancia para seleccionar entre Estudiante y Director -->
        <div class="toggle-buttons">
            <button 
            :class="{'active': selectedRole === 'Estudiante'}" 
            @click="selectedRole = 'Estudiante'">
            Estudiante
            </button>
            <button 
            :class="{'active': selectedRole === 'Director'}" 
            @click="selectedRole = 'Director'">
            Director
            </button>
        </div>
        
        <!-- Formulario para enviar el correo y recibir el código -->
        <form @submit.prevent="handleSendCode">
          <div class="form-group">
            <label for="email">Ingrese su correo electrónico</label>
            <input type="email" id="email" v-model="email" required placeholder="ejemplo@ucb.edu.bo">
          </div>
          <button type="submit" class="role-btn">Enviar código</button>
        </form>
  
        <!-- Formulario para verificar el código -->
        <form @submit.prevent="handleChangePassword">
          <div class="form-group">
            <label for="verificationCode">Ingrese el código de seguridad</label>
            <input type="text" id="verificationCode" v-model="verificationCode" required placeholder="Código de verificación">
          </div>
          <!-- Mensaje de error si las contraseñas no coinciden -->
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
          <button type="submit" class="submit-btn">Cambiar contraseña</button>
        </form>
        
        <!-- Botón para regresar al login -->
        <button class="role-btn" @click="$emit('switch-to-student-login')">Volver a Login</button>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';  // Utiliza SweetAlert para mensajes
  import { BASE_URL } from '@/config/globals';
  
  export default {
    name: 'ChangePasswordPopup',
    data() {
      return {
        selectedRole: '', // Opción por defecto
        email: '',                  // Correo electrónico
        verificationCode: '',        // Código de verificación ingresado por el usuario
        sentCode: '',                // Código enviado desde el servidor
        errorMessage: '',            // Mensaje de error
      };
    },
    methods: {
      async handleSendCode() {
        if (this.selectedRole === 'Estudiante') {
          await this.handleSendCodeStudent();
        } else if (this.selectedRole === 'Director') {
          await this.handleSendCodeDirector();
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Selecciona un rol',
            text: 'Por favor selecciona Estudiante o Director antes de enviar el código.',
            confirmButtonText: 'Aceptar',
          });
        }
      },
      async handleSendCodeStudent() {
        // Mostrar mensaje de carga
        Swal.fire({
          title: 'Enviando código...',
          text: 'Por favor espera un momento.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      try {
        // Consumir la API para enviar el código de verificación
        const response = await this.$publicAxios.post(`${BASE_URL}/estudiante/codigoVerificacion/${this.email}`);
        
        // Cerrar el mensaje de carga
        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Código enviado',
          text: 'Se ha enviado un código de verificación a su correo.',
          confirmButtonText: 'Aceptar',
        });
        
        // Guardar el código enviado que llega en la respuesta del backend
        this.sentCode = response.data.codigoVerificacion;

        // Guardar idEstudiante en localStorage
        localStorage.setItem('idEstudianteCorreo', response.data.idEstudiante);
    
      } catch (error) {
        // Cerrar el mensaje de carga si hay error
          Swal.close();

      // Mostrar mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el código de verificación. Intente nuevamente.',
          confirmButtonText: 'Aceptar',
        });
      }
    },
    async handleSendCodeDirector() {
        // Mostrar mensaje de carga
        Swal.fire({
          title: 'Enviando código...',
          text: 'Por favor espera un momento.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      try {
        // Consumir la API para enviar el código de verificación
        const response = await this.$publicAxios.post(`${BASE_URL}/usuario/codigoVerificacion/${this.email}`);
        
        // Cerrar el mensaje de carga
        Swal.close();

        Swal.fire({
          icon: 'success',
          title: 'Código enviado',
          text: 'Se ha enviado un código de verificación a su correo.',
          confirmButtonText: 'Aceptar',
        });
        
        // Guardar el código enviado que llega en la respuesta del backend
        this.sentCode = response.data.codigoVerificacion;

        // Guardar idEstudiante en localStorage
        localStorage.setItem('idDirectorCorreo', response.data.idDirector);
    
      } catch (error) {
        // Cerrar el mensaje de carga si hay error
          Swal.close();

      // Mostrar mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el código de verificación. Intente nuevamente.',
          confirmButtonText: 'Aceptar',
        });
      }
    },
    async handleChangePassword() {
      // Verificar si el código ingresado es correcto
      if (this.verificationCode !== this.sentCode) {
        this.errorMessage = 'El código ingresado es incorrecto.';
        return;
      }
      
      // Llamar a la función para cambiar la contraseña solo si el código es válido
      try {
        Swal.fire({
          icon: 'success',
          title: 'Verificación Exitosa',
          text: 'Código verificado correctamente. Procede a cambiar tu contraseña.',
          confirmButtonText: 'Aceptar',
        });
        // Emitir el evento para cambiar a la pantalla de cambiar contraseña
        this.$emit('switch-to-change-password');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo verificar el código. Intente nuevamente.',
          confirmButtonText: 'Aceptar',
        });
      }
    },
  },
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
    border: 1px solid #ddd;
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
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:hover {
    background-color: #8e6c88;
  }
  
  .error-message {
    color: red;
    font-size: 14px;
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

  /* Estilos para los botones de alternancia */
  .toggle-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .toggle-buttons button {
    flex: 1;
    padding: 10px;
    background-color: #ddd;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .toggle-buttons button:not(:last-child) {
    margin-right: 10px;
  }

  .toggle-buttons .active {
    background-color: #63c7b2;
    color: white;
  }

  .toggle-buttons button:hover:not(.active) {
    background-color: #c4c4c4;
  }
</style>
