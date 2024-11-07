<template>
  <div class="gallery js-flickity" ref="carousel">
    <!-- Para cada noticia, muestra la imagen, título y descripción -->
    <div class="gallery-cell" v-for="(noticia, index) in noticias" :key="index">
      <img :src="getImageUrl(noticia.img)" alt="Imagen de Noticia" @error="imagenNoCargada(noticia.img)" />
      <div class="noticia-info">
        <h2>{{ noticia.titulo }}</h2>
        <p>{{ noticia.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'flickity/css/flickity.css';
import Flickity from 'flickity';
import imagesLoaded from 'imagesloaded';
import { BASE_URL } from '@/config/globals';

export default {
  name: "FlickityCarousel",
  data() {
    return {
      noticias: []
    };
  },
  methods: {
    getImageUrl(imageFileName) {
      const imageUrl = `${BASE_URL}/imagenes/${imageFileName}`;
      console.log(`Cargando imagen desde: ${imageUrl}`); 
      return imageUrl;
    },
    
    imagenNoCargada(imageFileName) {
      console.error(`Error al cargar la imagen: http://localhost:8082/imagenes/${imageFileName}`);
    },

    initFlickity() {
  if (this.flickity) {
    this.flickity.destroy();
  }

  imagesLoaded(this.$refs.carousel, () => {
    this.flickity = new Flickity(this.$refs.carousel, {
      wrapAround: true,
      prevNextButtons: true,
      pageDots: true,
      cellAlign: 'center',
      contain: true,
      lazyLoad: 2,
    });

    this.flickity.reloadCells();
    this.flickity.resize();
  });
}
  },
  async mounted() {
  try {
    const response = await axios.get(`${BASE_URL}/noticia/carrusel`);
    this.noticias = response.data;
    console.log(this.noticias);
    this.$nextTick(() => {
      this.initFlickity();
    });
  } catch (error) {
    console.error("Error al cargar las noticias del carrusel:", error);
  }
},




};
</script>

<style scoped>

* {
  box-sizing: border-box;
}

.gallery {
  display: block; 
    height: 500px;
    position: relative;
  background: #EEE;
  width: 100%;
  overflow: hidden;
}

.gallery-cell {
  width: 100%;
  height: 500px;
  margin-right: 10px;
  background: #8C8;
}

.gallery-cell img {
  width: 100%;
  height: auto;
}

/* Estilos para el contenedor de la información de la noticia */
.noticia-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(142, 108, 136, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.noticia-info h2 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.noticia-info p {
  margin: 5px 0 0;
  font-size: 16px;
}

/* Estilos para botones de navegación */
.flickity-prev-next-button {
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
}

.flickity-prev-next-button:disabled {
  opacity: 0.3;
}

.flickity-prev-next-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.flickity-page-dots {
  bottom: 10px;
}

.flickity-page-dots .dot {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
