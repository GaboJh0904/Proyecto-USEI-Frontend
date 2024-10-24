<template>
    <div>
      <header>
        <NavBar userRole="Admin" />
      </header>
      <main class="student-survey-container">
          <h1>"  "</h1>
          <div class="student-info">
              <center><h2>Certificado</h2></center>
          </div>
  
         <!-- Contenedor de subida de archivos PDF -->
         <div class="upload-container">
          <p><strong>Subir nueva versión de certificado:</strong></p>
          <div class="upload-inputs">
            <input type="file" @change="handleFileUpload" accept="application/pdf" class="pdf-upload" />
            <button @click="uploadFile" class="upload-button">Subir</button>
          </div>
          <p class="file-instruction">Solo se permiten archivos en formato PDF.</p>
        </div>
  
           <!-- Contenedor de filtros, busqueda y ordenacion -->
        <div class="filter-search-container">
          <input type="text"  placeholder="Buscar..." class="search-input" />
          
          <select  class="filter-select" >
            <option value="">Filtrar por </option>
            <option value="">Todos</option>
  
            <option></option> 
          </select>
        </div>
  
        <!-- Tabla de preguntas y respuestas -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>id
                  <button class="sort-button" @click="sort()">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Formato 
                  <button class="sort-button" @click="sort()">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Version 
                  <button class="sort-button" @click="sort()">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Estado 
                  <button class="sort-button" @click="sort()">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Fecha 
                  <button class="sort-button" @click="sort()">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Acciones 
                </th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
     <!-- Mostrar mensaje si no hay coincidencias -->
     <div>
          <p>No hay coincidencias para la búsqueda realizada.</p>
        </div>
        <PaginationComponent
          :page-count="totalPages"
          :current-page="currentPage"
          @page-changed="handlePageClick"
        />
      </main>
      <FooterComponent />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  import PaginationComponent from '@/components/PaginationComponent.vue';
  export default {
    name: 'RespuestasEstudiante',
    components: {
      NavBar,
      FooterComponent,
      PaginationComponent,
  
    },
    data() {
      return {
          selectedFile: null, // Almacenar el archivo seleccionado
  
       
      };
    },
    computed: {
     
    },
    mounted() {
      
    },
    methods: {
      
      handlePageClick(pageNumber) {
      this.currentPage = pageNumber; 
      this.fetchRespuestas();        
    },
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          if (file.type === 'application/pdf') {
            this.selectedFile = file;
            console.log('Archivo PDF válido:', file);
          } else {
            console.error('Formato de archivo no válido. Solo se permiten archivos PDF.');
            this.selectedFile = null;
          }
        }
      },
      uploadFile() {
        if (this.selectedFile) {
          console.log('Subiendo archivo:', this.selectedFile);
          // Aquí puedes implementar la lógica para subir el archivo al servidor
          // Utiliza axios o fetch para enviar el archivo.
        } else {
          console.error('No se ha seleccionado ningún archivo o el formato es incorrecto.');
        }
      },
    }
  }
   
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
  .upload-inputs {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }
  
  .pdf-upload {
      padding: 8px;
    border-radius: 5px;
    border: 1px solid #929292;
    font-size: 14px;
  }
  .file-instruction {
      color: #666;
    font-size: 14px;
    margin-top: 5px;
  }
  
  .upload-button {
    padding: 8px 15px;
    background-color: #4a787b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .upload-button:hover {
    background-color: #916d9f;
  }
  
  .upload-button:active {
    background-color: #916d9f;
  }
  
  
  
  .filter-search-container {
    margin: 20px 0;
    display: flex;
    gap: 20px;
  }
  
  .search-input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #929292;
    border-radius: 10px;
    width: 60%;
  }
  
  .filter-select {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #929292;
    border-radius: 10px;
    width: 30%;
  }
  .questions-container {
    background-color: #c6d7d7;
    padding: 20px;
    border-radius: 15px;
    margin-top: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  .table-container {
    margin-top: 20px;
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 15px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #263d42;
    color: white;
    position: relative;
  
  }
  
  td input.response-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #e9e9e9;
  }
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
  }
  .wide-column {
    width: 50%;
  }
  
  .sort-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0 5px;
    margin-left: 5px;
    transition: color 0.3s ease;
  }
  
  .sort-button:hover {
    color: #4a787b; 
  }
  .sort-button:active {
    color: #916d9f; 
  }
  
  .sort-button i {
    font-size: 12px;
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