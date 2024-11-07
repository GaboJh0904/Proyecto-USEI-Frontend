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
        <!-- <div class="filter-search-container">
          <input type="text"  placeholder="Buscar..." class="search-input" />
          
          <select  class="filter-select" >
            <option value="">Filtrar por </option>
            <option value="">Todos</option>
  
            <option></option> 
          </select>
        </div> -->
  
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
                        <i class="fas fa-archive icon-archived" @click="archivarCertificado(certificado)" title="Archivar"></i>
                        <i class="fas fa-ban icon-suspended" @click="suspenderCertificado(certificado)" title="Suspender"></i>
                        </div>
                        <div v-if="certificado.estado === 'Suspendido'">
                        <i class="fas fa-play icon-in-use" @click="verificarCambioAEnUso(certificado)" title="En uso"></i>
                        <i class="fas fa-archive icon-archived" @click="archivarCertificado(certificado)" title="Archivar"></i>
                        </div>
                        <div v-if="certificado.estado === 'Archivado'">
                        <i class="fas fa-play icon-in-use" @click="verificarCambioAEnUso(certificado)" title="En uso"></i>
                        <i class="fas fa-ban icon-suspended" @click="suspenderCertificado(certificado)" title="Suspender"></i>
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

        <!-- <PaginationComponent
          :page-count="totalPages"
          :current-page="currentPage"
          @page-changed="handlePageClick"
        /> -->
      </main>
      <FooterComponent />
    </div>
  </template>
  
  <script >
  import NavBar from '@/components/NavBar.vue';
  import FooterComponent from '@/components/FooterComponent.vue';
  import Swal from 'sweetalert2';
  import { BASE_URL } from '@/config/globals';

  export default {
    name: 'subirCertificado',
    components: {
      NavBar,
      FooterComponent,  
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
        // alert('Archivo PDF válido seleccionado'); 
         Swal.fire({
            icon: 'success',
            title: 'Archivo PDF válido seleccionado',
            confirmButtonText: 'Aceptar'
            });    
        console.log('Archivo PDF válido seleccionado:', file); 
        
      } else {
        Swal.fire({
            icon: 'error',
            title: 'Formato de archivo no válido. Solo se permiten archivos PDF.',
            confirmButtonText: 'Aceptar'
            });         
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

        // alert('Subiendo archivo PDF...'); 
        // await Swal.fire({
        //     icon: 'process',
        //     title: 'Archivo subido exitosamente',
        //     confirmButtonText: 'Aceptar'
        //     }); 
        console.log('Subiendo archivo PDF:', this.selectedFile); 

        const formData = new FormData();
        formData.append('formato', this.selectedFile);
        formData.append('UsuarioIdUsuario', this.usuarioId);

        try {
          const response = await this.$protectedAxios.post(`${BASE_URL}/certificado`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        //   alert('Archivo subido exitosamente'); 
        await Swal.fire({
            icon: 'success',
            title: 'Archivo Cargado exitosamente',
            confirmButtonText: 'Aceptar'
            });    
          console.log('Respuesta del servidor:', response.data); 
          this.fetchCertificados(); // Actualizar la lista de certificados
          this.selectedFile = null;
          this.$refs.fileInput.value = ''; 

        } catch (error) {
            await Swal.fire({
            icon: 'error',
            title: 'Error al cargar el archivo',
            confirmButtonText: 'Aceptar'
            });               
            console.error('Error al subir el archivo:', error);
        }
      } else {
        //alert('No se ha seleccionado ningún archivo o el formato es incorrecto'); 
        await Swal.fire({
            icon: 'warning',
            title: 'No se ha seleccionado ningún archivo',
            confirmButtonText: 'Aceptar'
            });    
        console.error('No se ha seleccionado ningún archivo o el formato es incorrecto.');
      }
    },



    async fetchCertificados() {
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/certificado`);
        this.certificados = response.data;
        console.log('Certificados obtenidos:', this.certificados); 
      } catch (error) {
       // alert('Error al obtener los certificados');
        await Swal.fire({
            icon: 'error',
            title: 'Error al obtener los certificados',
            confirmButtonText: 'Aceptar'
            });      
        console.error('Error al obtener los certificados:', error);
      }
    },
    extractFileName(filePath) {
      return filePath.split(/(\\|\/)/g).pop(); 
    },

     // Métodos para cambiar el estado del certificado
     async archivarCertificado(certificado) {
      try {
        await this.$protectedAxios.put(`${BASE_URL}/certificado/${certificado.idCertificado}/estado`, {
          estado: 'Archivado',
        });
        // alert('Certificado archivado exitosamente');
        await Swal.fire({
            icon: 'success',
            title: 'Estado actualizado exitosamente',
            confirmButtonText: 'Aceptar'
            });      
        this.fetchCertificados();
      } catch (error) {
        await Swal.fire({
            icon: 'error',
            title: 'Error al cambiar el estado de los certificados',
            confirmButtonText: 'Aceptar'
            });
        }
    },

    async suspenderCertificado(certificado) {
      try {
        await this.$protectedAxios.put(`${BASE_URL}/certificado/${certificado.idCertificado}/estado`, {
          estado: 'Suspendido',
        });
        await Swal.fire({
            icon: 'success',
            title: 'Estado actualizado exitosamente',
            confirmButtonText: 'Aceptar'
            });        
            this.fetchCertificados();
      } catch (error) {
        // alert('Error al suspender el certificado');
        await Swal.fire({
            icon: 'error',
            title: 'Error al cambiar el estado de los certificados',
            confirmButtonText: 'Aceptar'
            });
      }
    },
    async verificarCambioAEnUso(certificado) {
      const certificadoEnUso = this.certificados.find(cert => cert.estado === 'En uso');

      if (certificadoEnUso && certificadoEnUso.idCertificado !== certificado.idCertificado) {
        Swal.fire({
          title: '¿Desea poner en uso este archivo?',
          text: 'El archivo que está en uso actualmente será suspendido.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.$protectedAxios.put(`${BASE_URL}/certificado/${certificadoEnUso.idCertificado}/estado`, {
                estado: 'Suspendido',
              });
              await this.$protectedAxios.put(`${BASE_URL}/certificado/${certificado.idCertificado}/estado`, {
                estado: 'En uso',
              });
            //   alert('El archivo se ha actualizo en uso correctamente y el anterior archivo fue suspendido.');
            await Swal.fire({
            icon: 'success',
            title: 'El archivo se ha actualizo en uso correctamente y el anterior archivo fue suspendido.',
            confirmButtonText: 'Aceptar'
            });

              this.fetchCertificados();
            } catch (error) {
            //   alert('Error al cambiar el estado de los certificados');
            await Swal.fire({
            icon: 'error',
            title: 'Error al cambiar el estado de los certificados',
            confirmButtonText: 'Aceptar'
            });
            }
          }
        });
      } else {
        this.activarCertificado(certificado);
      }
    },
    async activarCertificado(certificado) {
      try {
        await this.$protectedAxios.put(`${BASE_URL}/certificado/${certificado.idCertificado}/estado`, {
          estado: 'En uso',
        });
        // alert('Certificado activado exitosamente');
        await Swal.fire({
            icon: 'success',
            title: 'Estado actualizado exitosamente',
            confirmButtonText: 'Aceptar'
            });
        this.fetchCertificados();
      } catch (error) {
        // alert('Error al activar el certificado');
        await Swal.fire({
            icon: 'error',
            title: 'error al actualizar el estado ',
            confirmButtonText: 'Aceptar'
            });
      }
    },
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