<template>
  <div>
    <header>
      <NavBar userRole="Student" />
    </header>

    <main class="contact-admin-container">
      <div class="contact-content">
        <div class="status-timeline">
            <!-- Estado de la Encuesta -->
          <div :class="['timeline-item', hasFilled ? 'completed' : 'incomplete animated']">
            <div class="icon-wrapper check-icon">
              <span v-if="hasFilled">✔️</span>
              <span v-else>❗</span>
            </div>
            <div class="status-text">{{ hasFilled ? 'Encuesta completada' : 'No llenaste la encuesta' }}</div>
            <div class="line"></div>
          </div>
          <!-- Estado del Certificado -->
          <div :class="['timeline-item', hasFilled && estadoCertificado === 'pendiente' ? 'pending animated' : (estadoCertificado === 'enviado' ? 'completed' : 'disabled')]">
            <div class="icon-wrapper pending-icon">
              <span v-if="estadoCertificado === 'enviado'">✔️</span>
              <span v-else>📄</span>
            </div>
            <div class="status-text">Certificado: {{ estadoCertificado }}</div>
            <div class="line" v-if="hasFilled"></div>
          </div>

        <!-- Certificado Listo -->
          <div :class="['timeline-item', estadoCertificado === 'enviado' ? 'completed animated' : 'disabled']">
            <div class="icon-wrapper disabled-icon">📄</div>
            <div class="status-text">Certificado listo</div>
          </div>

           <transition name="fade-slide">
            <div v-if="showCertificado && archivoUrl" class="certificado-container">
              <h3>Certificado del Estudiante</h3>
              <embed :src="archivoUrl" type="application/pdf" width="100%" height="500px" />
            </div>
          </transition>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { BASE_URL } from '@/config/globals';
import axios from 'axios'; 
import Swal from 'sweetalert2';


export default {
  name: "CertificadoEstudiante",
  components: {
    NavBar,
    FooterComponent
  },
  data() {
    return {
      hasFilled: false, 
      estadoCertificado: '',
      showCertificado: false,
      archivoUrl: ''
    };
  },
  async mounted() {
    // Obtener el ID del estudiante de localStorage
    const estudianteId = localStorage.getItem('id_estudiante');
    if (!estudianteId) {
      console.error('ID del estudiante no encontrado en localStorage');
      return;
    }

    try {
        const encuestaResponse = await axios.get(`${BASE_URL}/respuesta/llenado/${estudianteId}`);
        this.hasFilled = encuestaResponse.data.filled;

        // verificar el estado del certificado
        if (this.hasFilled) {
            const certificadoResponse = await axios.get(`${BASE_URL}/estado_certificado/estado/${estudianteId}`);
            if (certificadoResponse.status === 200) {
                this.estadoCertificado = certificadoResponse.data; 
                  if (this.estadoCertificado === 'enviado') {
                    const archivoResponse = await axios.get(`${BASE_URL}/estado_certificado/archivo/directo/${estudianteId}`, {
                      responseType: 'blob'  
                  });
                  const url = URL.createObjectURL(archivoResponse.data);
                  this.archivoUrl = url;


                    setTimeout(() => {
                      this.showCertificado = true;
                    }, 2000);
                    Swal.fire({
                    icon: 'success',
                    title: '¡Certificado listo!',
                    text: 'El certificado ha sido enviado a su correo electrónico y está listo para visualizar.'
                  });
                } else {
                  Swal.fire({
                    icon: 'info',
                    title: 'Certificado no enviado',
                    text: 'El certificado aún no ha sido enviado.'
                  });
                }
              } else {
                this.estadoCertificado = 'No enviado';
                Swal.fire({
                  icon: 'info',
                  title: 'Certificado no enviado',
                  text: 'El certificado aún no ha sido enviado.'
                });
              }
            } else {
              this.estadoCertificado = 'No enviado';
              Swal.fire({
                icon: 'warning',
                title: 'Encuesta no completada',
                text: 'Para recibir tu certificado debes llenar la encuesta.'
              });
            }
          } catch (error) {
            console.error('Error al verificar el estado de la encuesta o del certificado:', error);
            this.estadoCertificado = 'No enviado'; 
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al verificar el estado del certificado o la encuesta.'
            });
          }
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}
.animated .icon-wrapper {
  animation: pulse 1.5s ease-in-out infinite;
}
.timeline-item.pending .icon-wrapper {
  border-color: #ff6b6b;
  animation: pulse 1.5s ease-in-out infinite;
}

.timeline-item.disabled .icon-wrapper {
  border-color: #cccccc;
  color: #cccccc;
}

header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.contact-admin-container {
  padding-top: 100px;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.contact-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
}

.status-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 200%;
  padding: 50px;
  background-color: rgba(140, 115, 162, 0.1); 
  border-radius: 15px; 
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 10px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  background-color: #ffffff;
  border: 4px solid #263d42;
  transition: transform 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.timeline-item.completed .icon-wrapper {
  border-color: #6c5b7b;
  animation: bounce-color 0.8s ease-out forwards;
}

.status-text {
  margin-top: 10px;
  font-size: 18px;
  color: #4f4f4f;
  text-align: center;
}

.timeline-item .line {
  position: absolute;
  top: 50px;
  left: 25px;
  height: 40px;
  width: 3px;
  background-color: #ac5462;
  animation: grow-line 0.5s ease forwards;
}

.timeline-item.completed .line {
  background-color: #6c5b7b;
}

.timeline-item.pending .icon-wrapper {
  border-color: #ff6b6b;
  animation: pulse 1.5s ease-in-out infinite;
}

.timeline-item.disabled .icon-wrapper {
  border-color: #cccccc;
  color: #cccccc;
}

.timeline-item.disabled .status-text {
  color: #cccccc;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes grow-line {
  from {
    height: 0;
  }
  to {
    height: 40px;
  }
}

@keyframes bounce-color {
  0% {
    transform: scale(1);
    color: #7babae;
    border-color: #548591;
  }
  30% {
    transform: scale(1.2);
    color: #6d9176;
    border-color: #5b7b5f;
  }
  100% {
    transform: scale(1);
    color: #5b7b73;
    border-color: #85b09a;
  }
}

.timeline-item.completed:hover .icon-wrapper {
  color: #ffffff;
  background-color: #628d78;
  border-color: #607c6f;
  transform: scale(1.2);
  transition: all 0.3s ease;
}

.timeline-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.7s ease forwards;
}

.timeline-item:nth-child(1) {
  animation-delay: 0.3s;
}

.timeline-item:nth-child(2) {
  animation-delay: 0.6s;
}

.timeline-item:nth-child(3) {
  animation-delay: 0.9s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }

}

.certificado-container {
  margin-top: 20px;
  padding: 15px;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #ddd;
  text-align: center;
  animation: fadeInSlideUp 4s ease forwards;
}

@keyframes fadeInSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-slide-enter-active {
  transition: all 0.5s ease-in;
}
.fade-slide-leave-active {
  transition: all 0.5s ease-out;
}
.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}



@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
