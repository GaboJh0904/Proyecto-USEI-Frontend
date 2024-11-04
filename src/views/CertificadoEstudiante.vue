<template>
  <div>
    <header>
      <NavBar userRole="Student" />
    </header>

    <main class="contact-admin-container">
      <div class="contact-content">
        <!-- Timeline de Estado -->
        <div class="status-timeline">
          <!-- Primera entrada del timeline: Encuesta completada -->
          <div class="timeline-item completed">
            <div class="icon-wrapper check-icon">✔️</div>
            <div class="status-text">Encuesta completada</div>
            <div class="line"></div>
          </div>

          <!-- Segunda entrada del timeline: Certificado pendiente -->
          <div class="timeline-item pending animated">
            <div class="icon-wrapper pending-icon">📄</div>
            <div class="status-text">Certificado no enviado</div>
            <div class="line"></div>
          </div>

          <!-- Tercera entrada del timeline: Certificado listo (deshabilitado) -->
          <div class="timeline-item disabled">
            <div class="icon-wrapper disabled-icon">📄</div>
            <div class="status-text">Certificado listo</div>
          </div>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: "CertificadoEstudiante",
  components: {
    NavBar,
    FooterComponent
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
  background-color: rgba(140, 115, 162, 0.1); /* Fondo con color y transparencia */
  border-radius: 15px; /* Bordes redondeados */
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

/* Animación de rebote y cambio de color en la primera entrada */
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

/* Animación al pasar el cursor por encima de la primera entrada */
.timeline-item.completed:hover .icon-wrapper {
  color: #ffffff;
  background-color: #628d78;
  border-color: #607c6f;
  transform: scale(1.2);
  transition: all 0.3s ease;
}

/* Animación de desvanecimiento en la entrada */
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

/* Estilos responsivos para pantallas más pequeñas */
@media (max-width: 768px) {
  .contact-content {
    flex-direction: column;
  }
}
</style>
