import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '../views/PaginaInicio.vue'
import MenuEstudiante from '../views/MenuEstudiante.vue' // Importa la nueva vista
import MenuAdministrador from '../views/MenuAdministrador.vue' // Importa la nueva vista
import MenuDirector from '../views/MenuDirector.vue' // Importa la nueva vista
import EncuestaEstudiante from '../views/EncuestaEstudiante.vue'
import ResumePage from '../views/ResumePage.vue' // Importa la nueva vista
import GestionDirectores from '../views/GestionDirectores.vue'
import EnviarEncuesta from '../views/EnviarEncuesta.vue'
import EnProgreso from '@/views/EnProgreso.vue'
import EditarEncuesta from '../views/EditarEncuesta.vue'
import ListadoEstudiantes from '../views/ListadoEstudiantes.vue'
import GestionOpcionesPregunta from '../views/GestionOpcionesPregunta.vue'
import NoticiaForm from '@/views/NoticiaForm.vue'
import GestionEncuestas from '@/views/GestionEncuestas.vue'
import ContactoAdmin from '../views/ContactoAdmin.vue'
import FormularioSoporte from '@/views/FormularioSoporte.vue'
import RespuestasEstudiante from '@/views/RespuestasEstudiante.vue'
import VerRespuestas from '../views/VerRespuestas.vue'
import subirCertificado from '@/views/subirCertificado.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // Ruta principal
      name: 'inicio',
      component: PaginaInicio
    },
    {
      path: '/menu-estudiante', // Ruta MenuEstudiante
      name: 'menuEstudiante',
      component: MenuEstudiante
    },
    {
      path: '/menu-administrador', // Ruta MenuAdministrador
      name: 'menuAdministrador',
      component: MenuAdministrador
    },
    {
      path: '/menu-director', // Ruta MenuDirector
      name: 'menuDirector',
      component: MenuDirector
    },
    {
      path:'/encuesta-estudiante',
      name: 'encuestaEstudiante',
      component: EncuestaEstudiante
    },
    {
      path: '/resume', // Ruta ResumePage
      name: 'ResumePage',
      component: ResumePage
    },
    {
      path: '/gestion-directores', // Ruta ResumePage
      name: 'GestionDirectores',
      component: GestionDirectores
    },
    {
      path: '/enviar-encuesta', // Ruta ResumePage
      name: 'EnviarEncuesta',
      component: EnviarEncuesta
    },
    {
      path: '/en-progreso', // Nueva ruta
      name: 'EnProgreso',
      component: EnProgreso
    },
    {
      path: '/editar-encuesta/:idEncuesta/preguntas', // Nueva ruta
      name: 'EditarEncuesta',
      component: EditarEncuesta
    },
    {
      path: '/listado-estudiantes', // Nueva ruta
      name: 'ListadoEstudiantes',
      component: ListadoEstudiantes
    },
    {
      path: '/preguntas/:idPregunta/opciones',
      name: 'GestionOpcionesPregunta',
      component: GestionOpcionesPregunta
    },
    {
      path: '/noticia-form',
      name: 'NoticiaForm',
      component: NoticiaForm
    },
    {
      path: '/gestion-encuestas/:idUsuario',
      name: 'GestionEncuestas',
      component: GestionEncuestas
    },
    {
      path: '/contacto-admin',
      name: 'ContactoAdmin',
      component: ContactoAdmin
    },
    {
      path: '/formulario-soporte',
      name: 'FormularioSoporte',
      component: FormularioSoporte
    },
    {
      path: '/respuestas-estudiante/:idEstudiante',
      name: 'RespuestasEstudiante',
      component: RespuestasEstudiante
    },
    {
      path: '/vista-respuestas/:idEstudiante', // Ruta con el parámetro dinámico
      name: 'VerRespuestas',
      component: VerRespuestas, // Componente que muestra las respuestas
    },
    {
      path: '/subir-certificado',
      name: 'subir-certificado',
      component: subirCertificado,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
})

export default router
