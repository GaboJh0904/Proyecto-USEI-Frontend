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
      :force-page="currentPage - 1"
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
    currentPage: {
      type: Number,
      default: 1, 
    },
  },
  methods: {
    onPageClick(pageNumber) {
      this.$emit('page-changed', pageNumber + 1); 
    },
  },
};
</script>

<style scoped>
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

::v-deep .page-link {
  padding: 8px 12px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #263d42;
  cursor: pointer;
  text-align: center;
}

::v-deep .active .page-link,
::v-deep .page-link.active {
  background-color: #8E6C88 !important; 
  color: white !important;
  border: 1px solid #8E6C88 !important; 
}

::v-deep .page-link:hover {
  background-color: #8E6C88 !important; 
  color: white !important; 
}

::v-deep .page-prev,
::v-deep .page-next {
  display: inline-block;
  padding: 8px 12px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: #80CED7;
  cursor: pointer;
  text-align: center;
}

::v-deep .page-prev:hover,
::v-deep .page-next:hover {
  background-color: #8E6C88 !important; 
  color: #263d42 !important; 
}
</style>
