<template>
  <nav>
    <div class="logo">
      <img src="@/components/images/USEI.png" alt="Logo" />
    </div>
    <div class="nav-links">
      <!-- Mostrar opciones de usuario y notificaciones cuando está logueado -->
      <template v-if="isMenuAdministador || isMenuDirector || isMenuEstudiante || isMenuPrincipal ">
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

      <!-- Si el usuario está en EncuestaEstudiante o GestionDirectores, solo mostrar "Volver" y "Soporte" -->
      <template v-else>
        <!-- Botón "Volver" con icono -->
        <button @click="goToPreviousPage" class="icon-button volver-icon" title="Volver">
          <i class="fas fa-arrow-left"></i> <!-- Icono de flecha -->
        </button>
        <button @click="openSupport" class="icon-button support-icon" title="Soporte">
          <i class="fas fa-headset"></i>
        </button>
      </template>

      <!-- Mostrar notificaciones y perfil si el usuario está logueado -->
      <template v-if="isStudent">
        <button @click="toggleNotifications" class="icon-button notification-icon" :class="{ 'has-unread': hasUnreadNotifications }">
          <i class="fas fa-bell"></i>
        </button>
        <div v-if="showNotifications" class="notification-menu">
          <h3>Notificaciones</h3>
          <div class="scrollable">
            <template v-if="notifications.length > 0">
              <div class="notification-item" v-for="(notification, index) in notifications" :key="index" @click="markAsRead(notification, index)">
                <i class="fas" :class="notification.read ? 'fa-envelope-open' : 'fa-envelope'"></i>
                <div class="notification-content">
                  <p><strong>{{ notification.title }}</strong></p>
                  <p>{{ notification.description }}</p>
                  <p>{{ notification.time }}</p>
                </div>
              </div>
              
              <!-- Botón para retroceder a la página anterior -->
              <div class="pagination-buttons">
                <button v-if="currentPage > 0" @click="loadNotifications(currentPage - 1)" class="load-more-button prev-button">
                  ← Volver a Notificaciones Anteriores
                </button>

                <!-- Mostrar el botón de "Cargar más" solo si hay más páginas -->
                <button v-if="currentPage < totalPages - 1" @click="loadNotifications(currentPage + 1)" class="load-more-button">
                  Cargar más
                </button>
              </div>
            </template>
          </div>
        </div>
      </template>

      <template v-if="userRole">
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
      @switch-to-change-password="switchToChangePassword"
      @switch-to-code-verification="switchToCodeVerification"
    />
    <RegisterPopup v-if="showRegisterPopup" @close="showRegisterPopup = false" />
    <AdminLoginPopup 
      v-if="showAdminLoginPopup" 
      @close="showAdminLoginPopup = false" 
      @switch-to-student-login="switchToStudentLogin" 
      @switch-to-change-password="switchToChangePassword"
      @switch-to-code-verification="switchToCodeVerification"
    />
    <ChangePasswordPopup 
      v-if="showChangePasswordPopup" 
      @close=" showChangePasswordPopup= false"
      @switch-to-change-password="switchToChangePassword"
      @switch-to-student-login="switchToStudentLogin" 
    />
    <CodeVerificationPopup 
      v-if="showCodeVerificationPopup" 
      @close="showCodeVerificationPopup = false"
      @switch-to-student-login="switchToStudentLogin"
      @switch-to-change-password="switchToChangePassword"
    />
  </nav>
</template>


<script>
import LoginPopup from '@/components/LoginPopup.vue';
import RegisterPopup from '@/components/RegisterPopup.vue';
import UserProfilePopup from '@/components/UserProfilePopup.vue';
import AdminLoginPopup from '@/components/AdminLoginPopup.vue';
import ChangePasswordPopup from '@/components/ChangePasswordPopup.vue';
import CodeVerificationPopup from './CodeVerificationPopup.vue';
import { BASE_URL } from '@/config/globals';

export default {
  name: 'NavBar',
  components: {
    LoginPopup,
    RegisterPopup,
    UserProfilePopup,
    AdminLoginPopup,
    ChangePasswordPopup,
    CodeVerificationPopup,
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
      showChangePasswordPopup: false,
      showCodeVerificationPopup: false,
      username: '',
      role: '',
      notifications: [],
      estudianteId: null, // Para almacenar el ID del estudiante
      currentPage: 0,     // Página actual para la paginación
      pageSize: 10,       // Tamaño de página (cantidad de notificaciones por página)
      totalPages: 0       // Total de páginas disponibles (a ser determinado por el backend)
    };
  },
  computed: {
    isMenuPrincipal() {
      return this.$route.path === '/';
    },
    isMenuEstudiante() {
      return this.$route.path === '/menu-estudiante';
    },
    isMenuAdministador() {
      return this.$route.path === '/menu-administrador';
    },
    isMenuDirector() {
      return this.$route.path === '/menu-director';
    },
    // Detecta si hay notificaciones sin leer
    hasUnreadNotifications() {
      return this.notifications.some(notification => !notification.read);
    },
    isStudent() {
      return localStorage.getItem('rol') === 'estudiante';
    },
  },
  watch: {
    estudianteId(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        // Si el ID del estudiante cambia y no es nulo, cargar las notificaciones
        this.loadNotifications();
      }
    }
  },
  mounted() {
    // Set username and role from localStorage (or defaults)
    this.username = localStorage.getItem('nombre') || 'USERNAME';
    this.role = localStorage.getItem('rol') || 'ROL';

    // Comprobar si ya hay un id de estudiante en localStorage al montar el componente
    const storedEstudianteId = localStorage.getItem('id_estudiante');
    if (storedEstudianteId) {
      this.estudianteId = storedEstudianteId;
    }

    // Si ya hay un ID de estudiante, cargar las notificaciones inmediatamente
    /*if (this.estudianteId) {
      this.loadNotifications();
    }*/
    this.loadNotifications();
  },
  methods: {
    switchToStudentLogin() {
    this.showAdminLoginPopup = false;
    this.showLoginPopup = true;
    this.showChangePasswordPopup = false; // Asegúrate de cerrar el popup de cambiar contraseña
    this.showCodeVerificationPopup = false;
  },
  switchToRegister() {
    this.showLoginPopup = false;
    this.showAdminLoginPopup = false;
    this.showRegisterPopup = true;
    this.showChangePasswordPopup = false; // Asegúrate de cerrar el popup de cambiar contraseña
    this.showCodeVerificationPopup = false;
  },
  switchToAdminLogin() {
    this.showLoginPopup = false;
    this.showRegisterPopup = false;
    this.showAdminLoginPopup = true;
    this.showChangePasswordPopup = false; // Asegúrate de cerrar el popup de cambiar contraseña
    this.showCodeVerificationPopup = false;
  },
  switchToChangePassword() {
    this.showChangePasswordPopup = true;
    this.showLoginPopup = false;
    this.showAdminLoginPopup = false;
    this.showRegisterPopup = false;
    this.showCodeVerificationPopup = false;
  },
  switchToCodeVerification() {
    this.showCodeVerificationPopup = true;
    this.showLoginPopup = false;
    this.showAdminLoginPopup = false;
    this.showRegisterPopup = false;
    this.showChangePasswordPopup = false;
  },
  // Método que podrías llamar después de iniciar sesión
    onLoginSuccess(idEstudiante) {
      // Actualizar el id en localStorage y en el componente
      localStorage.setItem('id_estudiante', idEstudiante);
      this.estudianteId = idEstudiante;
    },
    async loadNotifications(page = this.currentPage) {
      const estudianteId = this.estudianteId; // Usar la variable estudianteId ya asignada
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/notificacion/estudiante/${estudianteId}`, {
          params: {
            page: page,
            size: this.pageSize
          }
        }); // Ajustar la URL según el backend
        // Ordenar las notificaciones por idNotificacion de mayor a menor
        const notificationData = response.data.content; // 'content' es la parte que contiene los datos paginados
        this.notifications = notificationData
          .map(notificacion => ({
            id: notificacion.idNotificacion, // Agregar id de la notificación
            title: notificacion.titulo,
            description: notificacion.contenido,
            time: new Date(notificacion.fecha).toLocaleString(), // Convierte la fecha al formato local
            read: notificacion.estadoNotificacion, // Verifica si está leída o no
          }))
          .sort((a, b) => b.id - a.id); // Ordenar por id de mayor a menor

        // Asignar la paginación
        this.currentPage = page;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('Error al cargar las notificaciones:', error);
      }
    },
    async markAsRead(notification, index) {
      if (!notification.read) { // Solo marcar como leída si no lo está
        try {
          await this.$protectedAxios.put(`${BASE_URL}/notificacion/${notification.id}/lectura`);
          
          // Actualizar el estado de la notificación localmente
          this.notifications[index].read = true;
        } catch (error) {
          console.error('Error al marcar la notificación como leída:', error);
        }
      }
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
      // Verificar si el usuario es estudiante o administrador
      if (this.userRole === 'estudiante') {
        this.$router.push('/contacto-admin');  // Para estudiantes redirigir a contactoAdmin
      } else if (this.userRole === 'Administrador') {
        this.$router.push('/formulario-soporte'); // Para administradores redirigir a formularioSoporte
      }
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
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
  cursor: pointer; /* Cursor de pointer */
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background-color: #f0f0f0; /* Cambio de fondo al hacer hover */
}

/* Estilo de los íconos de notificación */
.notification-item .fa-envelope {
  color: #dc3545; /* Color rojo para notificaciones no leídas */
}

.notification-item .fa-envelope-open {
  color: #28a745; /* Color verde para notificaciones leídas */
}

/* Estilos para notificaciones leídas */
.notification-item .notification-icon.read {
  color: #8e6c88; /* Cambiar color si está leída */
}

.notification-icon {
  font-size: 25px;
  margin-right: 10px;
}

/* Estilos para el botón de notificaciones con animación */
.has-unread {
  animation: glow 1.5s infinite, bounce 2s infinite;
  color: rgb(45, 59, 255);
}

.notification-content p {
  margin: 0;
  color: #333;
}

.notification-item:last-child {
  border-bottom: none;
}

/* Estilo para el contenedor que tendrá el scroll */
.scrollable {
  max-height: 250px; /* Altura máxima antes de activar el scroll */
  overflow-y: auto; /* Habilitar scroll vertical */
  padding-right: 10px; /* Asegura que el contenido no quede oculto por la barra de desplazamiento */
}

/* Estilo para el hover y clic */
.clickable {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clickable:hover {
  background-color: #f0f0f0;
}

/* Añadir un estilo para el scroll personalizado (opcional) */
.scrollable::-webkit-scrollbar {
  width: 6px; /* Anchura del scrollbar */
}

.scrollable::-webkit-scrollbar-thumb {
  background-color: #8e6c88; /* Color de la barra */
  border-radius: 10px;
}

.scrollable::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* Color de fondo del track */
}

.load-more-button {
  background-color: #4CAF50; /* Verde atractivo */
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.load-more-button:hover {
  background-color: #388E3C; /* Oscurecer el color al hacer hover */
  transform: scale(1.05); /* Animación al hacer hover */
}

.pagination-buttons {
  display: flex;
  justify-content: space-between; /* Coloca los botones en extremos opuestos */
  margin-top: 20px;
}

/* Botón para volver a la página anterior */
.prev-button {
  background-color: #FF9800; /* Color naranja atractivo */
}

.prev-button:hover {
  background-color: #FB8C00; /* Oscurecer el color al hacer hover */
}

</style>