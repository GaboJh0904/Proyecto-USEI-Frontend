<template>
  <div>
    <header>
      <NavBar :userRole="userRole" />
    </header>

    <main class="user-management-container">
      <h1 class="user-management-title">Gestión de Directores</h1>

      <!-- Formulario para añadir/editar usuarios -->
      <div class="user-form-container">
        <h2>{{ isEditing ? "Editar Usuario" : "Añadir Director" }}</h2>
        <form @submit.prevent="isEditing ? updateUser() : addUser()">
          <!-- Nombre -->
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              v-model="currentUser.nombre"
              required
              placeholder="Ingrese el nombre completo"
            />
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              v-model="currentUser.telefono"
              required
              placeholder="Ingrese el teléfono"
            />
          </div>

          <!-- Correo -->
          <div class="form-group">
            <label for="correo">Correo</label>
            <input
              type="email"
              id="correo"
              v-model="currentUser.correo"
              required
              placeholder="Ingrese el correo electrónico"
            />
          </div>

          <!-- Carrera -->
          <div class="form-group">
            <label for="carrera">Carrera</label>
            <select id="carrera" v-model="currentUser.carrera">
              <option disabled value="">Seleccione una carrera</option>
              <option value="Administración de Empresas">Administración de Empresas</option>
              <option value="Administración Turística">Administración Turística</option>
              <option value="Contaduría Pública">Contaduría Pública</option>
              <option value="Economía">Economía</option>
              <option value="Economía e Inteligencia de Negocios">Economía e Inteligencia de Negocios</option>
              <option value="Ingeniería Comercial">Ingeniería Comercial</option>
              <option value="Ingeniería en Innovación Empresarial">Ingeniería en Innovación Empresarial</option>
              <option value="Marketing y Medio Digitales">Marketing y Medio Digitales</option>
              <option value="Ingeniería Ambiental">Ingeniería Ambiental</option>
              <option value="Ingeniería Biomédica">Ingeniería Biomédica</option>
              <option value="Ingeniería Bioquímica y de Bioprocesos">Ingeniería Bioquímica y de Bioprocesos</option>
              <option value="Ingeniería Civil">Ingeniería Civil</option>
              <option value="Ingeniería en Energía">Ingeniería en Energía</option>
              <option value="Ingeniería en Multimedia e Interactividad Digital">Ingeniería en Multimedia e Interactividad Digital</option>
              <option value="Ingenieriá en Logística y Analítica de la Cadena de Suministro">Ingenieriá en Logística y Analítica de la Cadena de Suministro</option>
              <option value="Ingeniería Industrial">Ingeniería Industrial</option>
              <option value="Ingeniería Mecatrónica">Ingeniería Mecatrónica</option>
              <option value="Ingeniería Química">Ingeniería Química</option>
              <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
              <option value="Ingeniería en Telecomunicaciones">Ingeniería en Telecomunicaciones</option>
            </select>
          </div>

          <!-- Usuario -->
          <div class="form-group">
            <label for="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              v-model="currentUser.usuario"
              required
              placeholder="Ingrese el nombre de usuario"
            />
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="contrasenia">Contraseña</label>
            <input
              type="password"
              id="contrasenia"
              v-model="currentUser.contrasenia"
              required
              placeholder="Ingrese la contraseña"
            />
          </div>

          <!-- Botón para añadir/editar -->
          <div class="form-actions">
            <button class="volver-button" type="button" @click="goBack">
              Volver
            </button>
            <button type="submit" class="submit-button">
              {{ isEditing ? "Actualizar" : "Añadir" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Tabla de usuarios -->
      <div class="user-table-container">
        <h2>Usuarios Registrados</h2>
        <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Carrera</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id_usuario">
              <td>{{ user.nombre }}</td>
              <td>{{ user.telefono }}</td>
              <td>{{ user.correo }}</td>
              <td>{{ user.carrera }}</td>
              <td>{{ user.usuario }}</td>
              <td>
                <button class="edit-button" @click="editUser(user)">
                  Editar
                </button>
                <button class="delete-button" @click="deleteUser(user)">
                  Eliminar
                </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import Swal from "sweetalert2";
import { BASE_URL } from "@/config/globals";

export default {
  name: "GestionDir",
  components: {
    NavBar,
    FooterComponent,
  },
  data() {
    return {
      userRole: "", // Rol del usuario
      users: [], // Lista de usuarios
      currentUser: {
        nombre: "",
        telefono: "",
        correo: "",
        carrera: "",
        usuario: "",
        contrasenia: "",
        rol: "Director", // Fijamos el rol como "Director"
      },
      isEditing: false, // Si estamos editando o no
      editUserId: null, // Almacenar el ID del usuario que se está editando
    };
  },
  computed: {
    availableCareers() {
      // Lista de carreras disponibles (no asignadas a otro director)
      const assignedCareers = this.users
        .filter((user) => user.rol === "Director" && user.carrera)
        .map((user) => user.carrera);
      return [
        "Administración de Empresas",
        "Administración Turística",
        "Contaduría Pública",
        "Economía",
        "Economía e Inteligencia de Negocios",
        "Ingeniería Comercial",
        "Ingeniería en Innovación Empresarial",
        "Marketing y Medio Digitales",
        "Ingeniería Ambiental",
        "Ingeniería Biomédica",
        "Ingeniería Bioquímica y de Bioprocesos",
        "Ingeniería Civil",
        "Ingeniería en Energía",
        "Ingeniería en Multimedia e Interactividad Digital",
        "Ingenieriá en Logística y Analítica de la Cadena de Suministro",
        "Ingeniería Industrial",
        "Ingeniería Mecatrónica",
        "Ingeniería Química",
        "Ingeniería en Sistemas",
        "Ingeniería en Telecomunicaciones",
      ].filter((career) => !assignedCareers.includes(career));
    },
  },
  mounted() {
    this.userRole = localStorage.getItem("rol") || "";
    this.fetchUsers(); // Cargar usuarios al montar el componente
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await this.$protectedAxios.get(`${BASE_URL}/usuario`);
        this.users = response.data;
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
        Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
      }
    },

    validateEmail(email) {
      const emailRegex = /^[^@]+@ucb\.edu\.bo$/; // Validar que el correo termine en @ucb.edu.bo
      return emailRegex.test(email);
    },

    async addUser() {
      if (!this.validateEmail(this.currentUser.correo)) {
        Swal.fire("Error", "El correo debe terminar con @ucb.edu.bo", "error");
        return;
      }
      if (!this.currentUser.carrera && this.currentUser.rol === "Director") {
        Swal.fire("Error", "Debe seleccionar una carrera para el Director.", "error");
        return;
      }

      // Verificar que la carrera seleccionada no esté ya asignada
      const isCareerTaken = this.users.some(
        (user) =>
          user.rol === "Director" &&
          user.carrera === this.currentUser.carrera &&
          user.idUsuario !== this.editUserId
      );
      if (isCareerTaken) {
        Swal.fire("Error", "La carrera ya está asignada a otro Director.", "error");
        return;
      }

      try {
        const response = await this.$protectedAxios.post(
          `${BASE_URL}/usuario`,
          this.currentUser
        );
        this.users.push(response.data);
        this.resetForm();
        Swal.fire("Éxito", "Usuario añadido correctamente.", "success");
      } catch (error) {
        console.error("Error al añadir el usuario:", error);
        Swal.fire("Error", "No se pudo añadir el usuario.", "error");
      }
    },

    editUser(user) {
      if (!user || !user.idUsuario) {
        Swal.fire("Error", "El usuario seleccionado no tiene un ID válido.", "error");
        return;
      }

      this.isEditing = true;
      this.editUserId = user.idUsuario;

      // Asignar los datos del usuario al formulario
      this.currentUser = { ...user };

      // No exigir carrera si es administrador
      if (this.currentUser.rol === "Administrador") {
        this.currentUser.carrera = "";
      }
    },

    async updateUser() {
      if (!this.editUserId) {
        Swal.fire("Error", "No se puede actualizar el usuario porque no tiene un ID válido.", "error");
        return;
      }
      if (!this.validateEmail(this.currentUser.correo)) {
        Swal.fire("Error", "El correo debe terminar con @ucb.edu.bo", "error");
        return;
      }

      // Carrera no requerida si el usuario es Administrador
      if (!this.currentUser.carrera && this.currentUser.rol === "Director") {
        Swal.fire("Error", "Debe seleccionar una carrera para el Director.", "error");
        return;
      }

      // Verificar que la carrera seleccionada no esté ya asignada
      const isCareerTaken = this.users.some(
        (user) =>
          user.rol === "Director" &&
          user.carrera === this.currentUser.carrera &&
          user.idUsuario !== this.editUserId
      );
      if (isCareerTaken) {
        Swal.fire("Error", "La carrera ya está asignada a otro Director.", "error");
        return;
      }

      try {
        const response = await this.$protectedAxios.put(
          `${BASE_URL}/usuario/${this.editUserId}`,
          this.currentUser
        );

        const index = this.users.findIndex(
          (user) => user.idUsuario === this.editUserId
        );

        if (index !== -1) {
          this.users.splice(index, 1, response.data);
        }

        this.resetForm();
        this.isEditing = false;

        Swal.fire("Éxito", "Usuario actualizado correctamente.", "success");
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
      }
    },

    async deleteUser(user) {
      if (!user || !user.idUsuario) {
        Swal.fire("Error", "El usuario seleccionado no tiene un ID válido.", "error");
        return;
      }

      if (user.rol === "Administrador") {
        Swal.fire("Error", "No se puede eliminar un Administrador.", "error");
        return;
      }

      try {
        const confirmation = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Esta acción eliminará al usuario de forma permanente.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (!confirmation.isConfirmed) {
          return;
        }

        await this.$protectedAxios.delete(`${BASE_URL}/usuario/${user.idUsuario}`);
        this.users = this.users.filter((u) => u.idUsuario !== user.idUsuario);

        Swal.fire("Éxito", "Usuario eliminado correctamente.", "success");
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        if (error.response && error.response.status === 404) {
          Swal.fire("Error", "El usuario no fue encontrado.", "error");
        } else {
          Swal.fire("Error", "No se pudo eliminar el usuario. Inténtelo de nuevo.", "error");
        }
      }
    },

    resetForm() {
      this.currentUser = {
        nombre: "",
        telefono: "",
        correo: "",
        carrera: "",
        usuario: "",
        contrasenia: "",
        rol: "Director",
      };
      this.isEditing = false;
    },

    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.user-management-container {
  padding: 2rem;
  background-color: #ccdbdc;
  min-height: 100vh;
}

/* Contenedor de formularios y tablas */
.user-form-container,
.user-table-container {
  background-color: #ffffff;
  border-radius: 12px; /* Más redondeado */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Sombra más suave */
  margin: 2rem 0; /* Más separación */
  padding: 2rem; /* Espaciado interno */
}

/* Títulos del formulario y tabla */
.user-form-container h2,
.user-table-container h2 {
  color: #263d42;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* Estilo de grupos de formulario */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #263d42;
}

/* Estilo de inputs y selects */
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem; /* Más relleno */
  border: 1px solid #80ced7;
  border-radius: 16px; /* Más redondeado */
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #63c7b2; /* Color de foco */
  outline: none;
}

/* Botones */
button {
  font-size: 1rem;
  font-weight: bold;
  border-radius: 20px; /* Redondeado */
  padding: 0.75rem 1.5rem; /* Más espaciado interno */
  margin-right: 1rem; /* Espaciado entre botones */
  transition: background-color 0.3s, transform 0.2s;
  cursor: pointer;
}

/* Botón "Volver" */
.volver-button {
  background-color: #8e6c88;
  color: white;
  border: none;
}

.volver-button:hover {
  background-color: #734f6a;
  transform: translateY(-2px);
}

/* Botón "Añadir" o "Actualizar" */
.submit-button {
  background-color: #63c7b2;
  color: white;
  border: none;
}

.submit-button:hover {
  background-color: #4aa894;
  transform: translateY(-2px);
}

/* Botón en la tabla */
td button {
  background-color: #80ced7;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
}

td button:hover {
  background-color: #63c7b2;
  transform: scale(1.05);
}

/* Tabla */
/* Contenedor para tablas responsive */
.table-responsive {
  width: 100%;
  overflow-x: auto; /* Desplazamiento horizontal en dispositivos pequeños */
  -webkit-overflow-scrolling: touch; /* Suaviza el scroll en dispositivos táctiles */
  margin-top: 1rem; /* Espaciado superior */
}

/* Tabla */
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* Anchura mínima para evitar deformaciones */
}

/* Celdas y encabezados */
th, td {
  border: 1px solid #80ced7;
  padding: 0.75rem;
  text-align: left;
  white-space: nowrap; /* Evita que el contenido se corte */
}

/* Encabezados de tabla */
th {
  background-color: #63c7b2;
  color: #ffffff;
}

/* Botones dentro de la tabla */
td button {
  background-color: #80ced7;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  margin: 0.25rem 0; /* Margen entre botones */
  font-size: 0.9rem;
  cursor: pointer;
}

td button:hover {
  background-color: #63c7b2;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 768px) {
  table {
    min-width: unset; /* Elimina la anchura mínima */
  }

  th, td {
    font-size: 0.85rem; /* Reduce el tamaño de la fuente */
    padding: 0.5rem; /* Reduce el relleno */
  }

  td button {
    font-size: 0.8rem; /* Reduce el tamaño de los botones */
  }
}
</style>
