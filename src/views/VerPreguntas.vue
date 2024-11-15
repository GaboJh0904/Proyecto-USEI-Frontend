<template>
    <div class="ver-preguntas-container">
      <header>
        <NavBar :userRole="userRole" />
    </header>
      <main>
        <h1 class="title">Preguntas de la Encuesta</h1>
        <div class="preguntas-list">
          <div class="pregunta-card" v-for="pregunta in preguntas" :key="pregunta.idPregunta">
            <h2 class="pregunta-titulo">Pregunta {{ pregunta.numero }}</h2>
            <p class="pregunta-texto">{{ pregunta.texto }}</p>
          </div>
        </div>
      </main>
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  import axios from 'axios';
  import { BASE_URL } from '@/config/globals';
  
  export default {
    name: 'VerPreguntas',
    components: {
      NavBar,
      FooterComponent
    },
    data() {
      return {
        preguntas: []  // Lista de preguntas a mostrar
      };
    },
    async mounted() {
      await this.fetchPreguntas();
    },
    methods: {
      async fetchPreguntas() {
        try {
          const response = await axios.get(`${BASE_URL}/preguntas`);
          this.preguntas = response.data;
        } catch (error) {
          console.error('Error al obtener las preguntas:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  
  .ver-preguntas-container {
    background-color: #ccdbdc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 80px;
  }
  
  .title {
    font-size: 2rem;
    color: #263d42;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
    text-transform: uppercase;
  }
  
  .preguntas-list {
    width: 100%;
    max-width: 800px;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .pregunta-card {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-left: 5px solid #63c7b2;
  }
  
  .pregunta-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .pregunta-titulo {
    font-size: 1.5rem;
    color: #80ced7;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .pregunta-texto {
    font-size: 1.1rem;
    color: #263d42;
    line-height: 1.6;
  }
  </style>
  