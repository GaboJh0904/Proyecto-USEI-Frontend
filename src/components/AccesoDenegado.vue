<template>
    <div class="acceso-denegado-container">
      <div class="acceso-denegado-card">
        <h1 class="titulo">Acceso Denegado</h1>
        <p class="mensaje">
          No tienes permiso para acceder a esta página. Por favor, verifica con el administrador o intenta iniciar sesión con una cuenta que tenga acceso.
        </p>
        <button class="volver-btn" @click="volverInicio">Volver al inicio</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AccesoDenegado',
    methods: {
      volverInicio() {
        // Obtener el rol del usuario almacenado en localStorage
        const userRole = localStorage.getItem('rol');
        
        // Redirigir a la página correspondiente según el rol del usuario
        if (userRole === 'estudiante') {
          this.$router.push('/menu-estudiante');
        } else if (userRole === 'Administrador') {
          this.$router.push('/menu-administrador');
        } else if (userRole === 'Director') {
          this.$router.push('/menu-director');
        } else {
          // Si no hay un rol válido, redirige a la página principal de inicio de sesión o inicio
          this.$router.push('/');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Fondo de la vista con efecto de transición */
  .acceso-denegado-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #ccdbdc, #80ced7);
    animation: fadeIn 1s ease-in-out;
  }
  
  /* Card de acceso denegado */
  .acceso-denegado-card {
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    max-width: 500px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .acceso-denegado-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
  
  /* Título */
  .titulo {
    font-size: 2.5rem;
    color: #8e6c88;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  /* Mensaje */
  .mensaje {
    font-size: 1.1rem;
    color: #263d42;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  /* Botón de volver al inicio */
  .volver-btn {
    background-color: #63c7b2;
    color: #ffffff;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s;
  }
  
  .volver-btn:hover {
    background-color: #8e6c88;
    transform: scale(1.05);
  }
  
  /* Animación de entrada */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  