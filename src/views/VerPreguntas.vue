<template>
    <header>
      <NavBar :userRole="userRole" />
    </header>
    <div class="ver-preguntas-container">
      <h1 class="title">Preguntas de la Encuesta</h1>

      <!-- Lista de preguntas -->
      <div v-if="preguntas.length" class="preguntas-list">
        <div class="pregunta-card" v-for="pregunta in preguntas" :key="pregunta.idPregunta">
          <h2 class="pregunta-titulo">Pregunta {{ pregunta.numPregunta }}</h2>
          <p class="pregunta-texto">{{ pregunta.pregunta }}</p>

          <!-- Opciones asociadas a la pregunta -->
          <ul v-if="pregunta.opciones && pregunta.opciones.length > 0" class="opciones-list">
            <li v-for="opcion in pregunta.opciones" :key="opcion.idOpcionesPregunta" class="opcion-item">
              {{ opcion.opcion }}
            </li>
          </ul>
        </div>
      </div>
    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { BASE_URL } from '@/config/globals';

export default {
  name: 'VerPreguntas',
  components: {
    NavBar,
    FooterComponent,
  },
  data() {
    return {
      userRole: localStorage.getItem('rol') || '', // Carga el rol del usuario
      preguntas: [], // Lista de preguntas con sus opciones
    };
  },
  async mounted() {
    await this.fetchPreguntas();
  },
  methods: {
    // Método para obtener preguntas y sus opciones
    async fetchPreguntas() {
      Swal.fire({
        title: 'Cargando preguntas...',
        text: 'Por favor espera mientras cargamos las preguntas.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading(); // Mostrar el indicador de carga
        },
      });

      try {
        // Obtener todas las preguntas
        const preguntasResponse = await axios.get(`${BASE_URL}/pregunta`);
        const preguntas = preguntasResponse.data;

        if (!preguntas.length) {
          Swal.fire({
            title: 'Sin preguntas',
            text: 'No hay preguntas disponibles para mostrar.',
            icon: 'warning',
            confirmButtonColor: '#63c7b2',
          });
          return;
        }

        // Obtener las opciones para cada pregunta
        for (let pregunta of preguntas) {
          try {
            const opcionesResponse = await axios.get(`${BASE_URL}/opciones_pregunta/pregunta/${pregunta.idPregunta}`);
            pregunta.opciones = opcionesResponse.data; // Asociar opciones a la pregunta
          } catch (opcionesError) {
            console.error(`Error al obtener opciones para la pregunta ${pregunta.idPregunta}:`, opcionesError);
            pregunta.opciones = []; // En caso de error, asignar un array vacío
          }
        }

        this.preguntas = preguntas;

        Swal.fire({
          title: 'Preguntas cargadas',
          text: 'Las preguntas se han cargado correctamente.',
          icon: 'success',
          confirmButtonColor: '#63c7b2',
        });
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        Swal.fire({
          title: 'Error al cargar preguntas',
          text: 'Hubo un problema al intentar cargar las preguntas. Por favor, inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonColor: '#8e6c88',
        });
      }
    },
  },
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
  padding-top: 100px;
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
  color: #263d42;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.pregunta-texto {
  font-size: 1.1rem;
  color: #263d42;
  line-height: 1.6;
}

.opciones-list {
  margin-top: 1rem;
  list-style: none;
  padding-left: 0;
}

.opcion-item {
  background-color: #f9f9f9;
  border: 1px solid #80ced7;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  color: #263d42;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.opcion-item:hover {
  background-color: #63c7b2;
  color: white;
}
</style>
