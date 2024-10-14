<template>
  <div>
    <header>
      <NavBar userRole="Student" />
    </header>

    <main class="contact-admin-container">
      <div class="contact-content">
        <!-- Imagen al lado izquierdo -->
        <div class="contact-image-container">
          <img :src="contactImage" alt="Soporte Técnico" class="contact-image" />
        </div>

        <!-- Texto y botón al lado derecho -->
        <div class="contact-text-container">
          <h1 class="contact-admin-title">Contacto con el Administrador</h1>
          <p class="contact-description">
            Si tienes algún problema técnico, puedes contactarte con el administrador a través de WhatsApp haciendo clic en el botón a continuación.
          </p>

          <!-- Botón de contacto para WhatsApp -->
          <button @click="contactAdmin" class="contact-button">
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';  
import contactImage from '@/components/images/administrador-de-contratos-ilustracion.webp';

export default {
  name: "ContactoAdmin",
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      contactImage, // Referencia a la imagen importada
    };
  },
  methods: {
    async checkInternetConnection() {
      // Intentamos hacer una solicitud a un archivo pequeño o una URL confiable
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
          method: "GET",
          cache: "no-cache",
        });
        if (response.ok) {
          return true; // Conexión exitosa
        } else {
          return false; // Respuesta no exitosa
        }
      } catch (error) {
        return false; // Error en la solicitud significa que no hay conexión
      }
    },
    async contactAdmin() {
      const hasInternet = await this.checkInternetConnection();
      
      if (hasInternet) {
        // Mostrar el mensaje de redirección antes de abrir WhatsApp
        Swal.fire({
          icon: 'info',
          title: 'Redirigiendo...',
          text: 'Te estamos redirigiendo a WhatsApp para que contactes con el administrador.',
          timer: 3000, // 3 segundos de espera antes de redirigir
          timerProgressBar: true,
          showConfirmButton: false,
          willClose: () => {
            const adminPhoneNumber = "+59173722025"; // Número del administrador real
            const message = encodeURIComponent(
              "Hola, soy un estudiante en proceso de titulación y tengo un problema técnico. ¿Podrían ayudarme por favor?"
            );
            window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, "_blank");
          },
        });
      } else {
        // Si no hay conexión, muestra un mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Sin conexión a internet',
          text: 'Por favor, verifica tu conexión a internet antes de contactar al administrador.',
          confirmButtonText: 'Aceptar',
        });
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.contact-admin-container {
  padding-top: 100px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.contact-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
}

.contact-image-container {
  flex: 1;
  text-align: center;
}

.contact-image {
  width: 100%;
  max-width: 500px;
}

.contact-text-container {
  flex: 1;
  padding: 0 20px;
}

.contact-admin-title {
  font-size: 36px;
  font-weight: 700;
  color: #263d42;
  margin-bottom: 20px;
}

.contact-description {
  font-size: 18px;
  color: #4f4f4f;
  margin-bottom: 30px;
  line-height: 1.5;
}

.contact-button {
  background-color: #263d42;
  color: white;
  padding: 12px 30px;
  font-size: 18px;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-button:hover {
  background-color: #6c5b7b;
}


/* Estilos responsivos para pantallas más pequeñas */
@media (max-width: 768px) {
  .contact-content {
    flex-direction: column;
  }

  .contact-image-container,
  .contact-text-container {
    padding: 0;
  }

  .contact-admin-title {
    font-size: 28px;
  }

  .contact-description {
    font-size: 16px;
  }

  .contact-button {
    font-size: 16px;
    padding: 10px 25px;
  }
}
</style>
