<template>
  <div>
    <!-- Header Section -->
    <section class="header-master">
      <header>
          <NavBar userRole="Student" />
      </header>

      <div class="content-header" id="carrusel">
        <div class="container">
          <ImageCarousel />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="container" id="about">
        <div class="about-container">
          <img src="@/components/images/graduados.jpg" alt="" />
        </div>
        <div class="about-container">
          <h2>USEI</h2>
          <h2>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto possimus consectetur nostrum laborum, rerum unde autem aut consequatur quibusdam pariatur assumenda mollitia libero omnis quae?<b>Universidad Catolica Boliviana</b></h2>
        </div>
        <div class="clear"></div>
      </div>
    </section>

    <!-- New Section (Icon Cards) -->
    <section class="icon-cards">
      <div class="container-cards" id="panel">
        <!-- Card 1 -->
        <div class="card-wrapper">
          <div class="card">
            <img src="@/components/images/certificado_icon.png" alt="Certificados" class="card-icon" />
          </div>
          <h3>CERTIFICADOS</h3>
          <div class="card-button-container">
            <button class="btn-ingresar" @click="goToEnProgreso">Ingresar</button>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="card-wrapper">
          <div class="card">
            <img src="@/components/images/formulario_icon.png" alt="Encuesta de Graduación" class="card-icon" />
          </div>
          <h3>ENCUESTA DE GRADUACIÓN</h3>
          <div class="card-button-container">
            <button class="btn-ingresar" @click="goToEncuesta">Ingresar</button>            
          </div>
        </div>
        <!-- Card 3 -->
        <div class="card-wrapper">
          <div class="card">
            <img src="@/components/images/soporte_icon.png" alt="Soporte/Ayuda" class="card-icon" />
          </div>
          <h3>SOPORTE/AYUDA</h3>
          <div class="card-button-container">
            <button class="btn-ingresar" @click="goToEnProgreso">Ingresar</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import ImageCarousel from '@/components/imageCarousel.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import axios from 'axios';
import Swal from 'sweetalert2';  

export default {
  name: "MenuEstudiante",
  components: {
    NavBar,
    ImageCarousel,
    FooterComponent  
  },
  data() {
    return {
      username: '', // Para almacenar el nombre del estudiante
      estudianteId: null // Para almacenar el ID del estudiante

    };
  },
  mounted() {
    // Obtener el nombre del estudiante desde el localStorage directamente
    const storedUsername = localStorage.getItem('username'); 
    const storedEstudianteId = localStorage.getItem('id_estudiante');

    
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      console.error('No se encontró el nombre en el localStorage.');
    }
    if (storedEstudianteId) {
    this.estudianteId = storedEstudianteId;
  } else {
    console.error('No se encontró el ID del estudiante en el localStorage.');
  }

  },
  methods: {
async goToEncuesta() {
  const estudianteId = localStorage.getItem('id_estudiante'); // Obtener el ID del estudiante del localStorage

  if (!estudianteId) {
    alert('No se encontró el ID del estudiante. Por favor, inicie sesión nuevamente.');
    this.$router.push('/login'); // Redirigir al login si no hay ID del estudiante
    return;
  }

  const url = `http://localhost:8082/respuesta/filled/${estudianteId}`;
  console.log('Verificando encuesta con la URL:', url); // Para depurar

  try {
    const response = await axios.get(url);
    const hasFilled = response.data.filled;

    if (hasFilled) {
      Swal.fire({
        icon: 'success',
        title: 'Ya has llenado la encuesta',
        confirmButtonText: 'Continuar',
      });
      return; 
    } else {
      this.$router.push('/encuesta-estudiante'); // Redirigir a la encuesta si no ha sido llenada
    }
  } catch (error) {
    console.error('Error al verificar el estado de la encuesta:', error);
  }
},
goToEnProgreso(){
    this.$router.push('/en-progreso');
}
}
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto';
}

.clear{
    clear: both;
}

.container{
    max-width: 1280px;
    padding: 0 2%;
    margin: 50px auto;
}

.container-cards {
  display: flex;
  justify-content: space-around;
  margin: 50px auto;
  padding: 20px;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  width: 250px;
  height: 250px; 
  padding: 20px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 10px;
  background-color: rgba(128, 206, 215, 0.5); 
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}


.card-icon {
  width: 200px; /* Icono más grande */
  height: 200px;
}

h3 {
  margin-top: 20px; /* Separación del icono */
  margin-bottom: 10px;
  font-size: 18px;
  color: #263d42;
  text-align: center;
}

.card-button-container {
  margin-top: 10px;
}

.btn-ingresar {
  background-color: #6c5b7b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  width: 100px;
  transition: background-color 0.3s ease; /* Transición suave */
}

.btn-ingresar:hover {
  background-color: #80CED7; /* Color al hacer hover */
}

.icon-cards {
  background-color: #d9e4e6;
  padding: 50px 0;
}

/*Section Header-Master*/
section.header-master{
    width: 100%;
    padding: 30px 0;
    min-height: 700px;
    background-image: url('https://i.postimg.cc/28zkdsTq/bg-01.png');
    background-size: cover;
}

section.header-master header{
    border-bottom: 3px solid rgba(71, 83, 88, .14);
    padding-bottom: 20px;
}

.logo{
    float: left;
    width: 191px;
    height: 64px;
    background-image: url('@/components/images/USEI.png');
    background-size: 100% 100%;
}

.content-header{
    padding: 60px 0;
}

/*SECTION About*/

.about-container{
    float: left;
    width: 50%;
    position: relative;
    z-index: 2;
}

.about-container img{
    max-width: 100%;
}

.about-container h2{
    font-size: 33px;
    margin: 20px 0;
    color: #a9c4b8;
    font-weight: normal;
    padding: 5px 40px;
    text-align: center;
}

.about-container h2 b{
    color: #03ca9f;
}

footer{
    padding: 20px 0;
    background: #6cc5b2;
    text-align: center;
}

@media screen and (max-width: 916px){
    section.header-master{
        min-height: 400px;
    }
}
</style>
