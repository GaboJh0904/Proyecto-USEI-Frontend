<template>
  <nav>
    <div class="logo">
      <img src="@/components/images/USEI.png" alt="Logo" />
    </div>
    <div class="nav-links">
      <!-- Si el usuario está en EncuestaEstudiante o GestionDirectores, solo mostrar "Volver" y "Soporte" -->
      <template v-if="isEncuestaEstudiante || isGestionDirectores || isEnviarEncuesta || isListadoEstudiantes || isResumePage || isNoticiaForm || isFormularioSoporte">
        <!-- Botón "Volver" con icono -->
        <button @click="goToPreviousPage" class="icon-button volver-icon" title="Volver">
          <i class="fas fa-arrow-left"></i> <!-- Icono de flecha -->
        </button>
        <button @click="openSupport" class="icon-button support-icon" title="Soporte">
          <i class="fas fa-headset"></i>
        </button>
      </template>

      <!-- Mostrar opciones de usuario y notificaciones cuando está logueado -->
      <template v-else>
        <!-- Regular navigation options -->
        <a v-if="!userRole" href="#carrusel" class="navigation-link">Noticias</a>
        <a v-if="!userRole" href="#about" class="navigation-link">Sobre Nosotros</a>
        <a v-if="!userRole" href="#footer" class="navigation-link">Contacto y Redes Sociales</a>

        <!-- Opciones si el usuario está logueado -->
        <a v-if="userRole" href="#noticias" class="navigation-link">Noticias</a>
        <a v-if="userRole" href="#about" class="navigation-link">Sobre Nosotros</a>
        <a v-if="userRole" href="#panel" class="navigation-link">Panel</a>
        <a v-if="userRole" href="#footer" class="navigation-link">Contacto y Redes Sociales</a>
        <button v-if="userRole" @click="openSupport" class="icon-button support-icon" title="Soporte">
          <i class="fas fa-headset"></i>
        </button>
      </template>

      <!-- Mostrar notificaciones y perfil si el usuario está logueado -->
      <template v-if="userRole">
        <button @click="toggleNotifications" class="icon-button notification-icon">
          <i class="fas fa-bell"></i>
        </button>
        <div v-if="showNotifications" class="notification-menu">
          <h3>Notificaciones</h3>
          <div class="notification-item" v-for="(notification, index) in notifications" :key="index">
            <i class="fas fa-envelope notification-icon"></i>
            <div class="notification-content">
              <p><strong>{{ notification.title }}</strong></p>
              <p>{{ notification.description }}</p>
              <p>{{ notification.time }}</p>
            </div>
          </div>
        </div>

        <div class="user-wrapper">
          <button @click="openUserProfile" class="icon-button user-icon">
            <i class="fas fa-user-circle"></i>
          </button>
          <div class="user-info">
            <span class="username-label">{{ username }}</span>
            <span class="role-label">{{ role }}</span>
          </div>
        </div>
      </template>

      <!-- Mostrar el botón de iniciar sesión si no está logueado -->
      <template v-if="!userRole">
        <a href="#" class="login-btn" @click="showLoginPopup = true">Iniciar Sesión</a>
      </template>
    </div>

    <!-- Popups para login, perfil, etc. -->
    <UserProfilePopup v-if="showUserProfile" @close="closeUserProfile" />
    <LoginPopup 
      v-if="showLoginPopup" 
      @close="showLoginPopup = false" 
      @switch-to-register="switchToRegister" 
      @switch-to-admin-login="switchToAdminLogin" 
    />
    <RegisterPopup v-if="showRegisterPopup" @close="showRegisterPopup = false" />
    <AdminLoginPopup 
      v-if="showAdminLoginPopup" 
      @close="showAdminLoginPopup = false" 
      @switch-to-student-login="switchToStudentLogin" 
    />
  </nav>
</template>


<script>
import LoginPopup from '@/components/LoginPopup.vue';
import RegisterPopup from '@/components/RegisterPopup.vue';
import UserProfilePopup from '@/components/UserProfilePopup.vue';
import AdminLoginPopup from '@/components/AdminLoginPopup.vue';

export default {
  name: 'NavBar',
  components: {
    LoginPopup,
    RegisterPopup,
    UserProfilePopup,
    AdminLoginPopup,
  },
  props: {
    userRole: {
      type: String,
      default: '', // Vacío si no hay usuario logueado
    },
  },
  data() {
    return {
      showLoginPopup: false,
      showRegisterPopup: false,
      showUserProfile: false,
      showAdminLoginPopup: false,
      showNotifications: false,
      username: '',
      role: '',
      notifications: [
        { title: 'Nueva notificación', description: 'Revisión de encuesta', time: 'Hace 6 horas' },
      ],
    };
  },
  computed: {
    isEncuestaEstudiante() {
      return this.$route.path === '/encuesta-estudiante';
    },
    isGestionDirectores() {
      return this.$route.path === '/gestion-directores';
    },
    isEnviarEncuesta() {
      return this.$route.path === '/enviar-encuesta';
    },
    isListadoEstudiantes() {
      return this.$route.path === '/listado-estudiantes';
    },
    isResumePage() {
      return this.$route.path === '/resume';
    },
    isNoticiaForm(){
      return this.$route.path === '/noticia-form'
    },
    isFormularioSoporte(){
      return this.$route.path === '/formulario-soporte'
    },


  },
  mounted() {
    // Set username and role from localStorage (or defaults)
    this.username = localStorage.getItem('nombre') || 'USERNAME';
    this.role = localStorage.getItem('rol') || 'ROL';
  },
  methods: {
    switchToRegister() {
      this.showLoginPopup = false;
      this.showAdminLoginPopup = false;
      this.showRegisterPopup = true;
    },
    switchToAdminLogin() {
      this.showLoginPopup = false;
      this.showRegisterPopup = false;
      this.showAdminLoginPopup = true;
    },
    switchToStudentLogin() {
      this.showAdminLoginPopup = false;
      this.showLoginPopup = true;
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    openUserProfile() {
      this.showUserProfile = true;
    },
    closeUserProfile() {
      this.showUserProfile = false;
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    openSupport() {
      this.$router.push('/support');
    }
  },
};
</script>

<style scoped>
/* Estilos para el NavBar y botones */
nav {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  z-index: 999;
  background: #63c7b2;
  height: 70px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
}

.logo img {
  height: 50px; 
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-links a {
  font-size: 15px;
  text-transform: uppercase;
  color: white;
  text-decoration: none;
  padding: 0 20px;
}

.nav-links a:hover {
  color: #263d42;
}

.login-btn {
  background: #8e6c88;
  padding: 10px 25px;
  border-radius: 40px; 
  color: white;
  text-transform: uppercase;
  font-size: 14px; 
  transition: background 0.3s ease;
  height: 30px; 
  display: flex;
  align-items: center; 
  justify-content: center; 
}

.login-btn:hover {
  background: #80ced7;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  color: white;
  font-size: 28px; 
}

.icon-button:hover {
  color: #263d42; 
}

/* Estilos específicos para el botón "Volver" */
.volver-icon {
  font-size: 20px;
  color: white;
  background-color: #8e6c88;
  padding: 7px;
  border-radius: 20%;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

.volver-icon:hover {
  background-color: #263d42;
  color: white;
}

.user-wrapper {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}

.username-label {
  font-size: 16px;
  color: white;
  text-transform: uppercase; 
}

.role-label {
  font-size: 12px;
  color: #8e6c88; 
  text-transform: uppercase; 
}


/* Estilos para el menú de notificaciones */
.notification-menu {
  position: absolute;
  top: 70px;
  right: 50px;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
}

.notification-menu h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #263d42;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.notification-icon {
  font-size: 25px;
  color: #8e6c88;
  margin-right: 10px;
}

.notification-content p {
  margin: 0;
  color: #333;
}

.notification-item:last-child {
  border-bottom: none;
}
</style>
