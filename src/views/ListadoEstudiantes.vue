<template>
  <div>
    <header>
      <NavBar :userRole="userRole" :userName="userName" />
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

      <!-- Botón para guardar cambios o cancelar -->
      <div v-if="editingIndex !== null" class="save-button-container">
        <button @click="saveChanges" class="save-button">Guardar Cambios</button>
        <button @click="cancelChanges" class="cancel-button">Cancelar</button>
      </div>

      <!-- Tabla de estudiantes cargados -->
      <div class="user-table-container">
        <h2>Lista de estudiantes cargados</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CI</th>
              <th>Carrera</th>
              <th>Asignatura</th>
              <th>Teléfono</th>
              <th>Correo institucional</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(estudiante, index) in estudiantesPaginados" :key="estudiante.idEstudiante">
              <td>
                <input v-if="editingIndex === index" v-model="editedEstudiante.nombre" />
                <span v-else>{{ estudiante.nombre }}</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model="editedEstudiante.ci" />
                <span v-else>{{ estudiante.ci }}</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model="editedEstudiante.carrera" />
                <span v-else>{{ estudiante.carrera }}</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model="editedEstudiante.asignatura" />
                <span v-else>{{ estudiante.asignatura }}</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model="editedEstudiante.telefono" />
                <span v-else>{{ estudiante.telefono }}</span>
              </td>
              <td>
                <input v-if="editingIndex === index" v-model="editedEstudiante.correoInsitucional" />
                <span v-else>{{ estudiante.correoInsitucional }}</span>
              </td>
              <td>
                <button v-if="editingIndex !== index" @click="editEstudiante(index)" class="action-btn edit-btn">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button v-if="editingIndex !== index" @click="deleteEstudiante(estudiante.idEstudiante)" class="action-btn delete-btn">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <PaginationComponent :page-count="totalPages" @page-changed="handlePageClick" />
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import Swal from 'sweetalert2';
import PaginationComponent from '@/components/PaginationComponent.vue';

export default {
  name: 'ListadoEstudiantes',
  components: {
    NavBar,
    FooterComponent,
    PaginationComponent,
  },
  data() {
    return {
      userRole: '',
      userName: '',
      estudiantes: [],
      file: null,
      editingIndex: null,
      editedEstudiante: {},
      perPage: 10,
      currentPage: 1,
    };
  },
  computed: {
    estudiantesPaginados() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.estudiantes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.estudiantes.length / this.perPage);
    },
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async processCSV() {
      if (this.file) {
        const formData = new FormData();
        formData.append('file', this.file);

        try {
          const response = await axios.post('http://localhost:8082/estudiante/upload-csv', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          this.estudiantes = response.data.map(estudiante => ({
            idEstudiante: estudiante.idEstudiante,
            nombre: estudiante.nombre,
            ci: estudiante.ci,
            carrera: estudiante.carrera,
            asignatura: estudiante.asignatura,
            telefono: estudiante.telefono,
            correoInsitucional: estudiante.correoInsitucional,
          }));

          Swal.fire('Éxito', 'Estudiantes cargados correctamente', 'success');
        } catch (error) {
          Swal.fire('Error', 'No se pudo cargar el archivo CSV', 'error');
        }
      }
    },
    editEstudiante(index) {
      this.editingIndex = index;
      this.editedEstudiante = { ...this.estudiantes[index] };
    },
    saveChanges() {
      if (this.editingIndex !== null) {
        if (!this.editedEstudiante.nombre || this.editedEstudiante.nombre.trim() === '') {
          Swal.fire('Error', 'El campo nombre no puede estar vacío', 'error');
          return;
        }
        if (!this.editedEstudiante.ci || String(this.editedEstudiante.ci).trim() === '') {
          Swal.fire('Error', 'El campo CI no puede estar vacío', 'error');
          return;
        }
        if (!this.editedEstudiante.correoInsitucional || this.editedEstudiante.correoInsitucional.trim() === '') {
          Swal.fire('Error', 'El campo correo institucional no puede estar vacío', 'error');
          return;
        }
        if (!this.editedEstudiante.telefono || String(this.editedEstudiante.telefono).trim() === '') {
          Swal.fire('Error', 'El campo teléfono no puede estar vacío', 'error');
          return;
        }

        const estudianteActualizado = {
          idEstudiante: this.editedEstudiante.idEstudiante, 
          nombre: this.editedEstudiante.nombre,
          ci: this.editedEstudiante.ci,
          carrera: this.editedEstudiante.carrera,
          asignatura: this.editedEstudiante.asignatura,
          telefono: this.editedEstudiante.telefono,
          correoInsitucional: this.editedEstudiante.correoInsitucional,
        };

        axios.put(`http://localhost:8082/estudiante/${this.editedEstudiante.idEstudiante}`, estudianteActualizado, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          this.estudiantes[this.editingIndex] = response.data;
          this.editingIndex = null;
          Swal.fire('Guardado', 'Cambios realizados con éxito', 'success');
        })
        .catch(error => {
          console.error('Error en la solicitud PUT:', error.response ? error.response.data : error.message);
          Swal.fire('Error', error.response ? error.response.data : 'No se pudieron guardar los cambios', 'error');
        });
      }
    },
    cancelChanges() {
      this.editingIndex = null;
    },
    deleteEstudiante(idEstudiante) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#80CED7', 
    cancelButtonColor: '#8E6C88',  
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, procede con la eliminación
      axios.delete(`http://localhost:8082/estudiante/${idEstudiante}`)
        .then(() => {
          this.estudiantes = this.estudiantes.filter(e => e.idEstudiante !== idEstudiante);
          Swal.fire(
            'Eliminado',
            'El estudiante ha sido eliminado correctamente',
            'success'
          );
        })
        .catch(error => {
          Swal.fire('Error', 'No se pudo eliminar al estudiante', 'error');
        });
    }
  });
},

    handlePageClick(pageNumber) {
      this.currentPage = pageNumber;
    },
    fetchUserData() {
      this.userName = 'Rosario Calisaya';
      this.userRole = 'Administrador';
    },
  },
  created() {
    this.fetchUserData();
  },
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
    padding-top: 100px; 
    min-height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px auto; 
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
    margin-bottom: 2rem; 
  }
  
  /* Sección de carga CSV */
  .upload-section {
    display: flex;
    justify-content: center;
    margin-bottom: 40px; 
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
  max-width: 75rem; 
  margin-bottom: 2rem;
  overflow-x: auto; 
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
    padding: 0.8rem 1rem; 
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
    font-size: 24px; 
  }
  
  .delete-btn i {
    color: #8E6C88;
    font-size: 24px; 
  }
  
  .action-btn:hover {
    background-color: #ececec;
    border-radius: 5px; 
  }
  
  .action-btn {
    padding: 10px; 
    margin-right: 15px; 
    border: 1px solid #263D42;
    border-radius: 10px;
  }


.user-table-container td input {
  width: 100%; 
  box-sizing: border-box; 
  padding: 5px; 
  font-size: 14px; 
}

.user-table-container td {
  max-width: 200px; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap; 
}

.user-table-container {
  overflow-x: auto; 
}

.cancel-button {
  background-color: #8E6C88;
  color: white;
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #263D42;
}

 /* Boton de guardar cambios una vez presionado el de editar*/
 .save-button-container {
  text-align: center;
  margin-bottom: 20px;
}

.save-button {
  background-color: #80CED7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #263D42;
}

/*Estilos de la paginacion*/
/* Contenedor de la paginación */
.pagination-container {
  margin-top: 20px; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0; 
}
</style>
  