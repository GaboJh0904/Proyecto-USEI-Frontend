<template>
    <div>
      <header>
        <NavBar :userRole="userRole" />
      </header>
  
      <main class="user-management-container">
        <h1 class="user-management-title">Listado de Estudiantes</h1>
  
        <!-- Botón para cargar archivo CSV -->
        <div class="upload-section">
          <div class="csv-buttons">
            <a href="#" class="liquid-button">
              <label for="csvInput">
                <span>Seleccionar archivo .csv</span>
                <div class="liquid"></div>
              </label>
              <input type="file" id="csvInput" @change="handleFileUpload" accept=".csv" style="display: none;" />
            </a>
  
            <a href="#" class="liquid-button" @click="processCSV">
              <span>Cargar CSV</span>
              <div class="liquid"></div>
            </a>
          </div>
        </div>
  
        <!-- Tabla de estudiantes cargados -->
        <div class="user-table-container">
          <h2>Lista de estudiantes cargados</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Carnet</th>
                <th>Carrera</th>
                <th>Asignatura</th>
                <th>Celular</th>
                <th>Correo electrónico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(estudiante, index) in estudiantes" :key="index">
                <td>{{ estudiante.nombre }}</td>
                <td>{{ estudiante.carnet }}</td>
                <td>{{ estudiante.carrera }}</td>
                <td>{{ estudiante.asignatura }}</td>
                <td>{{ estudiante.celular }}</td>
                <td>{{ estudiante.correo_electronico }}</td>
                <td id="button-container-table">
                  <button @click="editEstudiante(index)" class="action-btn edit-btn">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button @click="deleteEstudiante(index)" class="action-btn delete-btn">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
  
      <FooterComponent />
    </div>
  </template>
  
  <script>
import Papa from 'papaparse'; // Para procesar CSV
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';

export default {
  name: 'ListadoEstudiantes',
  components: {
    NavBar,
    FooterComponent,
  },
  data() {
    return {
      userRole: '', // Añadir userRole para gestionar el rol del usuario
      estudiantes: [
        {
          nombre: "Rosario Calisaya",
          carnet: "9172358",
          carrera: "Ingeniría de sistemas",
          asignatura: "Taller de grado I",
          celular: "67304790",
          correo_electronico: "rosario.calisaya@ucb.edu.bo"
        },
        {
          nombre: "Laura Mallea",
          carnet: "1234567",
          carrera: "Ingeniría de sistemas",
          asignatura: "Taller de grado I",
          celular: "7654321",
          correo_electronico: "laura.mallea@ucb.edu.bo"
        }
      ], // Datos estáticos para la tabla
      file: null, // Archivo CSV cargado
    };
  },
  mounted() {
    // Obtener el rol del usuario desde el localStorage
    this.userRole = localStorage.getItem('rol') || '';
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    processCSV() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvData = e.target.result;
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              this.estudiantes = result.data; // Almacenar los datos del CSV en estudiantes
              Swal.fire({
                icon: 'success',
                title: 'Archivo CSV cargado exitosamente',
                showConfirmButton: false,
                timer: 1500
              });
            },
          });
        };
        reader.readAsText(this.file);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, selecciona un archivo CSV primero',
        });
      }
    },
    editEstudiante(index) {
      console.log('Editar estudiante', this.estudiantes[index]);
      // Lógica para editar el estudiante
    },
    deleteEstudiante(index) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
      }).then((result) => {
        if (result.isConfirmed) {
          this.estudiantes.splice(index, 1);
          Swal.fire(
            'Eliminado',
            'El estudiante ha sido eliminado.',
            'success'
          );
        }
      });
    }
  }
};
</script>

  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
  
  /* Estilos generales */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
  
  /* Header con el NavBar */
  header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
  
  /* Contenedor principal */
  .user-management-container {
    padding-top: 100px; /* Añadido más espacio para que no se sobreponga con el header */
    min-height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px auto; /* Ajuste para dar espacio en los lados */
  }

  #button-container-table{
    display: flex;
    flex-direction: row;
    margin: 0;
    
  }
  
  /* Título de la gestión de estudiantes */
  .user-management-title {
    font-size: 35px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 2rem; /* Más espacio debajo del título */
  }
  
  /* Sección de carga CSV */
  .upload-section {
    display: flex;
    justify-content: center;
    margin-bottom: 40px; /* Mayor separación entre botones y tabla */
    width: 100%;
    max-width: 600px;
  }
  
  .csv-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  /* Botones de estilo líquido */
  .liquid-button {
    position: relative;
    display: inline-block;
    font: 700 20px consolas;
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    padding: 10px 30px;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.2s;
  }
  
  .liquid-button span {
    position: relative;
    z-index: 1;
    color: #fff;
  }
  
  .liquid-button .liquid {
    position: absolute;
    top: -60px;
    left: 0;
    width: 100%;
    height: 200px;
    background: #80CED7;
    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.7);
    z-index: 0;
    transition: 0.6s;
  }
  
  .liquid-button .liquid::after,
  .liquid-button .liquid::before {
    position: absolute;
    content: "";
    width: 200%;
    height: 200%;
    top: 0;
    left: 0;
    transform: translate(-25%, -75%);
  }
  
  .liquid-button .liquid::after {
    border-radius: 45%;
    background: #263D42;
    box-shadow: 0 0 10px 5px #8E6C88, inset 0 0 5px #8E6C88;
    animation: animate 5s linear infinite;
    opacity: 0.8;
  }
  
  .liquid-button .liquid::before {
    border-radius: 40%;
    background: #63c7b280;
    box-shadow: 0 0 10px rgba(242, 240, 240, 0.5), inset 0 0 5px rgba(248, 246, 246, 0.5);
    animation: animate 7s linear infinite;
  }
  
  @keyframes animate {
    0% {
      transform: translate(-25%, -75%) rotate(0);
    }
    100% {
      transform: translate(-25%, -75%) rotate(360deg);
    }
  }
  
  .liquid-button:hover .liquid {
    top: -120px;
  }
  
  /* Tabla de lista de estudiantes*/
  .user-table-container {
    background-color: #CBDADB;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 60rem; /* Se ajusta el ancho máximo */
    margin-bottom: 2rem;
  }
  
  .user-table-container table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .user-table-container th,
  .user-table-container td {
    border: 1px solid #263D42;
    padding: 12px;
    text-align: left;
  }
  
  .user-table-container th {
    background-color: #263D42;
    color: white;
  }
  
  .user-table-container td img {
    max-width: 50px;
    height: auto;
  }
  
  .user-table-container td button {
    background-color: #263D42;
    color: white;
    padding: 0.8rem 1rem; /* Aumentamos el tamaño de los botones */
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }
  
  .user-table-container td button:hover {
    background-color: #1F2E34;
  }
  
  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .edit-btn i {
    color: #80CED7;
    font-size: 24px; /* Aumentamos aún más el tamaño de los íconos */
  }
  
  .delete-btn i {
    color: #8E6C88;
    font-size: 24px; /* Aumentamos aún más el tamaño de los íconos */
  }
  
  .action-btn:hover {
    background-color: #ececec;
    border-radius: 5px; /* Borde redondeado */
  }
  
  .action-btn {
    padding: 10px; /* Más espacio alrededor de los botones */
    margin-right: 15px; /* Más separación entre los botones */
    border: 1px solid #263D42;
    border-radius: 10px;
  }
  </style>
  