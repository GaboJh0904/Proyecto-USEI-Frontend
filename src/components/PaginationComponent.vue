<template>
    <div class="pagination-container">
      <paginate
        :page-count="pageCount"
        :click-handler="onPageClick"
        :prev-text="'«'"
        :next-text="'»'"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-item'"
        :next-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
        :active-class="'active'"
      />
    </div>
  </template>
  
  <script>
  import Paginate from 'vuejs-paginate-next';
  
  export default {
    name: 'PaginationComponent',
    components: {
      Paginate,
    },
    props: {
      pageCount: {
        type: Number,
        required: true,
      },
    },
    methods: {
      onPageClick(pageNumber) {
        this.$emit('page-changed', pageNumber); // Emite el número de la página seleccionada al componente padre
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos del componente de paginación */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.pagination {
  display: flex;
  list-style: none;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  padding: 8px 12px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #80CED7;
  cursor: pointer;
  text-align: center;
}

.active .page-link {
  background-color: #8E6C88 !important; /* Cambiar el color activo a morado */
  color: white !important;
  border: 1px solid #8E6C88 !important; /* Mantener el borde morado */
}

.page-link:hover {
  background-color: #8E6C88 !important; /* Cambiar color de fondo al hacer hover */
  color: white !important; /* Cambiar color de texto a blanco al hacer hover */
}

.page-prev,
.page-next {
  display: inline-block;
  padding: 8px 12px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #80CED7;
  cursor: pointer;
  text-align: center;
}

.page-prev:hover,
.page-next:hover {
  background-color: #8E6C88 !important; /* Cambiar color de fondo al hacer hover en anterior/siguiente */
  color: white !important; /* Cambiar color de texto al hacer hover en anterior/siguiente */
}
  </style>
  