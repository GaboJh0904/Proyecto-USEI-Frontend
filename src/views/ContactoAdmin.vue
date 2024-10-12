<template>
    <div>
      <header>
        <NavBar userRole="Student" />
      </header>
  
      <main class="contact-admin-container">
        <h1 class="contact-admin-title">Contacto con el Administrador</h1>
        <p class="contact-description">Si tienes algún problema técnico, puedes contactarte con el administrador a través de WhatsApp haciendo clic en el botón a continuación.</p>
        
        <!-- Botón de contacto para WhatsApp -->
        <button @click="contactAdmin" class="contact-button">
          Contactar por WhatsApp
        </button>
      </main>
  
      <FooterComponent />
    </div>
  </template>
  
  <script>
  export default {
    name: "ContactoAdmin",
    data() {
      return {
        userRole: "",
      };
    },
    methods: {
      contactAdmin() {
        const adminPhoneNumber = "+59173722025"; // Cambia este número al del administrador real
        const message = encodeURIComponent(
          "Hola, soy un estudiante en proceso de titulación y tengo un problema técnico. ¿Podrían ayudarme por favor?"
        );
        window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, "_blank");
      },
    },
  };
  </script>
  
  <style scoped>
  .contact-admin-container {
    padding-top: 80px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
  }
  
  .contact-admin-title {
    font-size: 25px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 20px;
  }
  
  .contact-description {
    font-size: 16px;
    margin-bottom: 30px;
    text-align: center;
    width: 80%;
  }
  
  .contact-button {
    background-color: #25d366;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 15px;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
  }
  
  .contact-button:hover {
    background-color: #20b357;
  }
  </style>
  