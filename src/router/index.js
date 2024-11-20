import { createRouter, createWebHistory } from 'vue-router'
import PaginaInicio from '../views/PaginaInicio.vue'
import MenuEstudiante from '../views/MenuEstudiante.vue' 
import MenuAdministrador from '../views/MenuAdministrador.vue' 
import MenuDirector from '../views/MenuDirector.vue' 
import EncuestaEstudiante from '../views/EncuestaEstudiante.vue'
import ResumePage from '../views/ResumePage.vue' 
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
import subirCertificado from '@/views/SubirCertificado.vue'
import EstudiantesRegistrados from '@/views/EstudiantesRegistrados.vue'
import FormularioPlazos from '@/views/FormularioPlazos.vue'
import PorcentajeIncompleto from '@/views/PorcentajeIncompleto.vue'
import CertificadoEstudiante from '@/views/CertificadoEstudiante.vue'
import Dashboard from '@/views/Dashboard.vue'
import AccesoDenegado from '@/components/AccesoDenegado.vue'
import ReporteDash from '@/views/ReporteDash.vue' // Importa la nueva vista
import SoporteDirector from '@/views/SoporteDirector.vue'
import VerPreguntas from '@/views/VerPreguntas.vue'
import HistorialReportes from '@/views/HistorialReportes.vue'
import CrearReporteDirector from '@/views/CrearReporteDirector.vue'

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
      path: '/menu-estudiante',
      name: 'menuEstudiante',
      component: MenuEstudiante,
      meta: { requiresAuth: true, roles: ['estudiante'] } // Rutas protegidas
    },
    {
      path: '/menu-administrador', // Ruta MenuAdministrador
      name: 'menuAdministrador',
      component: MenuAdministrador,
      meta: { requiresAuth: true, roles: ['Administrador'] } // Rutas protegidas
    },
    {
      path: '/menu-director', // Ruta MenuDirector
      name: 'menuDirector',
      component: MenuDirector,
      meta: { requiresAuth: true, roles: ['Director']  } // Rutas protegidas
    },
    {
      path:'/encuesta-estudiante',
      name: 'encuestaEstudiante',
      component: EncuestaEstudiante,
      meta: { requiresAuth: true, roles: ['estudiante']  } // Rutas protegidas
    },
    {
      path: '/resumen', 
      name: 'ResumePage',
      component: ResumePage,
      meta: { requiresAuth: true, roles: ['estudiante']  } // Rutas protegidas
    },
    {
      path: '/gestion-directores', 
      name: 'GestionDirectores',
      component: GestionDirectores,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/enviar-encuesta', 
      name: 'EnviarEncuesta',
      component: EnviarEncuesta,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/en-progreso', // Nueva ruta
      name: 'EnProgreso',
      component: EnProgreso,
      meta: { requiresAuth: true } // Rutas protegidas
    },
    {
      path: '/editar-encuesta/:idEncuesta/preguntas', // Nueva ruta
      name: 'EditarEncuesta',
      component: EditarEncuesta,
      meta: { requiresAuth: true, roles: ['Administrador'] } // Rutas protegidas
    },
    {
      path: '/listado-estudiantes', // Nueva ruta
      name: 'ListadoEstudiantes',
      component: ListadoEstudiantes,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/preguntas/:idPregunta/opciones',
      name: 'GestionOpcionesPregunta',
      component: GestionOpcionesPregunta,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/noticia-form',
      name: 'NoticiaForm',
      component: NoticiaForm,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/gestion-encuestas/:idUsuario',
      name: 'GestionEncuestas',
      component: GestionEncuestas,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/contacto-admin',
      name: 'ContactoAdmin',
      component: ContactoAdmin,
      meta: { requiresAuth: true, roles: ['estudiante']  } // Rutas protegidas
    },
    {
      path: '/formulario-soporte',
      name: 'FormularioSoporte',
      component: FormularioSoporte,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/formulario-plazos', 
      name: 'FormularioPlazos',
      component: FormularioPlazos, // Usa el nuevo componente
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/respuestas-estudiante/:idEstudiante',
      name: 'RespuestasEstudiante',
      component: RespuestasEstudiante,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/vista-respuestas/:idEstudiante', 
      name: 'VerRespuestas',
      component: VerRespuestas, // Componente que muestra las respuestas
      meta: { requiresAuth: true, roles: ['estudiante']  } // Rutas protegidas
    },
    {
      path: '/subir-certificado',
      name: 'subir-certificado',
      component: subirCertificado,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/estudiantes-registrados',
      name: 'EstudiantesRegistrados',
      component: EstudiantesRegistrados,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    
    {
      path: '/porcentaje-incompleto',
      name: 'PorcentajeIncompleto',
      component: PorcentajeIncompleto,
      meta: { requiresAuth: true, roles: ['Administrador']  } // Rutas protegidas
    },
    {
      path: '/certificado-estudiante',
      name: 'certificado-estudiante',
      component: CertificadoEstudiante,
      meta: { requiresAuth: true, roles: ['estudiante']  } // Rutas protegidas
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, roles: ['Administrador'] } // Rutas protegidas
    },
    {
      path: '/reporte-dash', // Nueva ruta para ReporteDash
      name: 'ReporteDash',
      component: ReporteDash,
      meta: { requiresAuth: true, roles: ['Administrador'] } // Rutas protegidas
    },
    {
      path: '/acceso-denegado',
      name: 'AccesoDenegado',
      component: AccesoDenegado // Componente que muestra un mensaje de acceso denegado
    },  
    {
      path: '/soporte-director',
      name: 'SoporteDirector',
      component: SoporteDirector,
      meta: { requiresAuth: true, roles: ['Director'] }
    },
    {
      path: '/lista-preguntas',
      name: 'ListaPreguntas',
      component: VerPreguntas,
      meta: { requiresAuth: true, roles: ['Administrador', 'Director']  } // Rutas protegidas
    }, 

    {
      path: '/historial-reportes',
      name: 'HistorialReportes',
      component: HistorialReportes,
      meta: { requiresAuth: true, roles: ['Administrador', 'Director']  } // Rutas protegidas
    },
    {
      path: '/crear-reporte-director',
      name: 'CrearReporteDirector',
      component: CrearReporteDirector,
      meta: { requiresAuth: true, roles: ['Administrador', 'Director']  } // Rutas protegidas
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
})

// Verifica la autenticación antes de cada navegación
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('rol'); // Obtén el rol del usuario desde el almacenamiento

  // Si la ruta requiere autenticación y no hay token, redirige al inicio
  if (requiresAuth && !token) {
    return next({ path: '/' });
  }

  // Verificar si la ruta tiene roles definidos en `meta` y si el rol del usuario tiene acceso
  const allowedRoles = to.meta.roles;
  if (requiresAuth && allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirigir a una página de acceso denegado si el usuario no tiene permiso
    return next({ name: 'AccesoDenegado' }); // Asume que tienes una ruta `AccesoDenegado`
  }

  // Si todo está bien, permitir el acceso a la ruta
  next();
});


export default router
