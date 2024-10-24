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
            <input type="file" @change="handleFileUpload" ref="fileInput" accept="application/pdf" class="pdf-upload" />
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
                  <button class="sort-button" @click="sort('id')">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Archivo 
                  <button class="sort-button" @click="sort('formato')">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Version 
                  <button class="sort-button" @click="sort('version')">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Estado 
                  <button class="sort-button" @click="sort('estado')">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Fecha 
                  <button class="sort-button" @click="sort(fecha)">
                    <i class="fas fa-sort"></i>
                  </button>
                </th>
                <th>Acciones 
                </th>
              </tr>
            </thead>
            <tbody>
                <tr v-for="certificado in certificados" :key="certificado.idCertificado">
                <td>{{ certificado.idCertificado }}</td>
                <td>{{ extractFileName(certificado.formato) }}</td>
                <td>{{ certificado.version }}</td>
                <td>{{ certificado.estado }}</td>
                <td>{{ new Date(certificado.fechaModificacion).toLocaleDateString() }}</td>
                <td class="icon-actions">
                        <!-- Mostrar iconos según el estado -->
                    <div v-if="certificado.estado === 'En uso'">
                        <i class="fas fa-archive  icon-archived" @click="archivarCertificado(certificado.idCertificado)" title="Archivar"></i>
                        <i class="fas fa-ban icon-suspended" @click="suspenderCertificado(certificado.idCertificado)" title="Suspender"></i>
                    </div>
                    <div v-if="certificado.estado === 'Suspendido'">
                        <i class="fas fa-play icon-in-use" @click="activarCertificado(certificado.idCertificado)" title="En uso"></i>
                        <i class="fas fa-archive icon-archived" @click="archivarCertificado(certificado.idCertificado)" title="Archivar"></i>
                    </div>
                    <div v-if="certificado.estado === 'Archivado'">
                        <i class="fas fa-pla icon-in-use" @click="activarCertificado(certificado.idCertificado)" title="En uso"></i>
                        <i class="fas fa-ban icon-suspended" @click="suspenderCertificado(certificado.idCertificado)" title="Suspender"></i>
                    </div>
                </td>
                </tr>
            </tbody>
          </table>
        </div>
         <!-- Mostrar mensaje si no hay registros -->
      <div v-if="certificados.length === 0">
        <p>No se encontraron certificados registrados.</p>
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
  
  <script >
  import axios from 'axios';
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  import PaginationComponent from '@/components/PaginationComponent.vue';
  export default {
    name: 'subirCertificado',
    components: {
      NavBar,
      FooterComponent,
      PaginationComponent,
  
    },
    data() {
      return {
      selectedFile: null,  // Almacenar el archivo seleccionado
      certificados: [],     // Almacenar los registros de certificados
      totalPages: 1,
      currentPage: 1,
      usuarioId: null,
       
      };
    },
    computed: {
     
    },
    mounted() {
        this.fetchCertificados(); 
        
        this.loadUsuarioId(); 

    },
    methods: {
    loadUsuarioId() {
      const storedUsuarioId = localStorage.getItem('id_usuario');
      if (storedUsuarioId) {
        this.usuarioId = storedUsuarioId;
        console.log('ID de usuario cargado desde localStorage:', this.usuarioId); 
      } else {
        alert('No se encontró el ID del usuario en localStorage.'); 
        console.error('No se encontró el ID del usuario en localStorage.');
      }
    },
      
      handlePageClick(pageNumber) {
      this.currentPage = pageNumber; 
      this.fetchRespuestas();        
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.selectedFile = file;
        alert('Archivo PDF válido seleccionado'); 
        console.log('Archivo PDF válido seleccionado:', file); 
      } else {
        alert('Formato de archivo no válido. Solo se permiten archivos PDF.'); 
        console.error('Formato de archivo no válido. Solo se permiten archivos PDF.');
        this.selectedFile = null;
      }
    },

    async uploadFile() {
      if (this.selectedFile) {
        if (!this.usuarioId) {
          alert('No se encontró el ID del usuario en localStorage'); // <-- Alerta de error
          console.error('No se encontró el ID del usuario en localStorage.');
          return;
        }

        alert('Subiendo archivo PDF...'); 
        console.log('Subiendo archivo PDF:', this.selectedFile); 

        const formData = new FormData();
        formData.append('formato', this.selectedFile);
        formData.append('UsuarioIdUsuario', this.usuarioId);

        try {
          const response = await axios.post('http://localhost:8082/certificado', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          alert('Archivo subido exitosamente'); 
          console.log('Respuesta del servidor:', response.data); 
          this.fetchCertificados(); // Actualizar la lista de certificados
          this.selectedFile = null;
          this.$refs.fileInput.value = ''; 

        } catch (error) {
          alert('Error al subir el archivo'); 
          console.error('Error al subir el archivo:', error);
        }
      } else {
        alert('No se ha seleccionado ningún archivo o el formato es incorrecto'); 
        console.error('No se ha seleccionado ningún archivo o el formato es incorrecto.');
      }
    },



    async fetchCertificados() {
      try {
        const response = await axios.get('http://localhost:8082/certificado');
        this.certificados = response.data;
        console.log('Certificados obtenidos:', this.certificados); 
      } catch (error) {
        alert('Error al obtener los certificados');
        console.error('Error al obtener los certificados:', error);
      }
    },
    extractFileName(filePath) {
      return filePath.split(/(\\|\/)/g).pop(); 
    },

     async archivarCertificado(idCertificado) {
      try {
        await axios.put(`http://localhost:8082/certificado/${idCertificado}`, {
          estado: 'Archivado'
        });
        alert('Certificado archivado exitosamente');
        this.fetchCertificados();
      } catch (error) {
        alert('Error al archivar el certificado');
        console.error('Error al archivar el certificado:', error);
      }
    },

    async suspenderCertificado(idCertificado) {
      try {
        await axios.put(`http://localhost:8082/certificado/${idCertificado}`, {
          estado: 'Suspendido'
        });
        alert('Certificado suspendido exitosamente');
        this.fetchCertificados();
      } catch (error) {
        alert('Error al suspender el certificado');
        console.error('Error al suspender el certificado:', error);
      }
    },

    async activarCertificado(idCertificado) {
      try {
        await axios.put(`http://localhost:8082/certificado/${idCertificado}`, {
          estado: 'En uso'
        });
        alert('Certificado activado exitosamente');
        this.fetchCertificados();
      } catch (error) {
        alert('Error al activar el certificado');
        console.error('Error al activar el certificado:', error);
      }
    }
  }
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

  .icon-actions i {

  font-size: 1.3rem;
  margin: 0 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.icon-actions i:hover {
  transform: scale(1.2);
}

.icon-archived {
  color: #d89e41; 
}

.icon-in-use {
  color: #5a8d8d; 
}

.icon-suspended {
  color: #a850b4; 
}

.icon-actions i[title="Archivar"]:hover::after,
.icon-actions i[title="En uso"]:hover::after,
.icon-actions i[title="Suspender"]:hover::after {
  content: attr(title);
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px;
  border-radius: 9px;
  font-size: 0.7rem;
  white-space: nowrap;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Arial', sans-serif; 
}

.icon-actions {
  position: relative;
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