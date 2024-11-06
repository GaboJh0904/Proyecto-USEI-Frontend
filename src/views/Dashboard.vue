<template>
    <div>
      <header>
        <NavBar userRole="Admin" />
      </header>
      <main class="student-survey-container">
          <h1>"  "</h1>
          <div class="student-info">
              <center><h2>Dashboard</h2></center>
          </div>
  
         <!-- Contenedor de subida de archivos PDF -->
         <div class="upload-container">
        </div>
      </main>
      <FooterComponent />
    </div>
  </template>
  
  <script >
  import axios from 'axios';
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  import Swal from 'sweetalert2';
  import { BASE_URL } from '@/config/globals';

  export default {
    name: 'Dashboard',
    components: {
      NavBar,
      FooterComponent,
  
    },
    data() {
      return {
      usuarioId: null,
       
      };
    },
    computed: {
    },
    mounted() {
    },
    methods: {
  },
};
  </script>
  
  <style scoped>
  .student-survey-container {
    padding: 20px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .student-info h2 {
    margin-bottom: 10px;
    line-height: 1.6;
  }
  .student-info p {
    line-height: 1.6;
  }
  
  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    padding: 15px;
    border: 2px solid #4a787b;
    border-radius: 10px;
    width: 60%;
    margin: 20px auto;
    text-align: center;
  }
   
  </style>
  
  
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
    
   
    </style>