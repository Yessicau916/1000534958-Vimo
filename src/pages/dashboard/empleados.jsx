import React, { Fragment, useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody, Input, Button } from "@material-tailwind/react";
import Axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
//iconos
import {
  PencilSquareIcon, TrashIcon, EyeIcon, UserPlusIcon,
} from "@heroicons/react/24/solid";
import { EyeSlashIcon } from "@heroicons/react/24/outline";

export function Empleados() {
  //funcion para las alertas
  function showAlert(icon = "success", title) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: icon,
      title: title
    });
  }
  //se crea la lista en las que se van a guardar los datos
  const [usuariosList, setUsuariosList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [ciudadesList, setCiudadesList] = useState([]);
  const [open, setOpen] = useState(false);

  // Estado para controlar el modal de visualización
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [visualizarUsuario, setVisualizarUsuario] = useState(null); // Estado para almacenar la información del usuario a visualizar

  //se crean variables en las que se guardan los datos de los input
  const [rol, setRol] = useState("");
  const [cedula, setCedula] = useState("");
  const [usuario, setUsuario] = useState("");
  const [estado, setEstado] = useState(true);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [celular, setCelular] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [veriPass, setVeriPass] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  //funcion volver
  const volver = () => {
    empty();
    setEdit(false);
  }
  //Variables para el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //apis
  const URLUsuarios = "http://localhost:8080/api/usuarios";
  const URLRoles = "http://localhost:8080/api/roles";
  const URLCiudades = "http://localhost:8080/api/ciudades";

  //metodos o endpoints get
  const getUsuarios = async () => {
    try {
      const resp = await Axios.get(URLUsuarios);
      setUsuariosList(resp.data.usuarios);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const getRoles = async () => {
    try {
      const resp = await Axios.get(URLRoles);
      setRolesList(resp.data.roles);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const getCiudades = async () => {
    try {
      const resp = await Axios.get(URLCiudades);
      setCiudadesList(resp.data.ciudades);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const empty = () => {
    setVer(true)
    setRol(0)
    setCedula("")
    setEstado(true)
    setNombre("")
    setApellido("")
    setCelular("")
    setDireccion("")
    setCiudad(0)
    setCorreo("")
    setPass("")
    setVeriPass("")
    setEdit(false);
  }

  useEffect(() => {
    getUsuarios();
    getRoles();
    getCiudades();
  }, []);

  const [errorRol, setErrorRol] = useState(true);
  const [errorCedula, setErrorCedula] = useState(true);
  const [errorUsuario, setErrorUsuario] = useState(true);
  const [errorNombre, setErrorNombre] = useState(true);
  const [errorApellido, setErrorApellido] = useState(true);
  const [errorCelular, setErrorCelular] = useState(true);
  const [errorDireccion, setErrorDireccion] = useState(true);
  const [errorCiudad, setErrorCiudad] = useState(true);
  const [errorCorreo, setErrorCorreo] = useState(true);
  const [errorPass, setErrorPass] = useState(true);
  const [errorConfirmPass, setErrorConfirmPass] = useState(true);

  //post
  const postUsuario = () => {
    const valUsu = /^(?=.*[A-Z])[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{3,20}$/;
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valCed = /^(?=.*\d)[0-9]{6,20}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;
    const valPa = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{8,30}$/;

    // Se establecen los errores como verdaderos inicialmente
    setErrorRol(true);
    setErrorCedula(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorDireccion(true);
    setErrorCiudad(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    // Validación de los campos
    if (!cedula) {
      showAlert("error", "Ingrese una cédula!");
      setErrorCedula(false);
    } else if (!valCed.test(cedula)) {
      showAlert("error", "Ingrese una cédula válida!");
      setErrorCedula(false);
    } else if (usuariosList.map((user) => user.Cedula).includes(parseInt(cedula))) {
      showAlert("error", "Ya hay un usuario registrado con esa cédula...");
      setErrorCedula(false);
    } else if (!usuario) {
      showAlert("error", "Ingrese un nombre de usuario!");
      setErrorUsuario(false);
    } else if (!valUsu.test(usuario)) {
      showAlert("error", "El nombre de usuario debe tener como minimo una minúscula y una mayúscula!");
      setErrorUsuario(false);
    } else if (usuariosList.map((user) => user.Usuario).includes(usuario)) {
      showAlert("error", "Ese nombre de usuario ya está registrado...");
      setErrorUsuario(false);
    } else if (!nombre) {
      showAlert("error", "Ingrese su nombre!");
      setErrorNombre(false);
    } else if (!valNomApe.test(nombre)) {
      showAlert("error", "El nombre debe tener como minimo una minúscula y una mayúscula!");
      setErrorNombre(false);
    } else if (!apellido) {
      showAlert("error", "Ingrese sus apellidos!");
      setErrorApellido(false);
    } else if (!valNomApe.test(apellido)) {
      showAlert("error", "El apellido debe tener como minimo una minúscula y una mayúscula!");
      setErrorApellido(false);
    } else if (!celular) {
      showAlert("error", "Ingrese su número de celular!");
      setErrorCelular(false);
    } else if (!valCel.test(celular)) {
      showAlert("error", "El celular debe tener 10 digitos ");
      setErrorCelular(false);
    } else if (usuariosList.map((user) => user.Celular).includes(celular)) {
      showAlert("error", "Ese número de celular ya está registrado...");
      setErrorCelular(false);
    } else if (!direccion) {
      showAlert("error", "Ingrese una dirección!");
      setErrorDireccion(false);
    } else if (ciudad == 0) {
      showAlert("error", "Seleccione el nombre de la Ciudad!");
      setErrorCiudad(false);
    } else if (!correo) {
      showAlert("error", "Ingrese un correo!");
      setErrorCorreo(false);
    } else if (!valEm.test(correo)) {
      showAlert("error", "Ingrese un correo válido!");
      setErrorCorreo(false);
    } else if (usuariosList.map((user) => user.Correo).includes(correo)) {
      showAlert("error", "Ese correo ya está registrado...");
      setErrorCorreo(false);
    } else if (!pass) {
      showAlert("error", "Ingrese una contraseña!");
      setErrorPass(false);
    } else if (!valPa.test(pass)) {
      showAlert("error", "La contraseña debe ser como minímo de ocho caracteres y debe tener una letra mayúscula, una minúscula y un número!");
      setErrorPass(false);
    } else if (veriPass !== pass) {
      showAlert("error", "Las contraseñas deben ser iguales!");
      setErrorConfirmPass(false);
    } else if (!estado) {
      setEstado(true);
    } else {
      showAlert("success", "Usuario registrado con éxito!");
      Axios.post(URLUsuarios, {
        IdRol: 2,
        Cedula: parseInt(cedula),
        Estado: estado,
        Usuario: usuario,
        Nombre: nombre,
        Apellidos: apellido,
        Celular: celular,
        Direccion: direccion,
        IdCiudad: ciudad,
        Correo: correo,
        Contrasenha: pass,
        TerminosCondiciones: true,
        PoliticasPrivacidad: true
      }).then(() => {
        getUsuarios();
        setEdit(false)
        empty();
      }).catch((error) => {
        console.log(error)
      })
    }
  };


  //put//llamar las variables 
  const editar = (val) => {
    setOpen(true);
    setVer(true);
    setEdit(true);
    setErrorRol(true);
    setErrorCedula(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorCiudad(true);
    setErrorDireccion(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    handleShow();
    setId(val.IdUsuario)
    setRol(val.IdRol)
    setCedula(val.Cedula)
    setUsuario(val.Usuario)
    setNombre(val.Nombre)
    setApellido(val.Apellidos)
    setCelular(val.Celular)
    setDireccion(val.Direccion)
    setCiudad(val.IdCiudad)
    setCorreo(val.Correo)
    setPass(val.Contrasenha)
  }

  const putUsuario = () => {
    const valUsu = /^(?=.*[A-Z])[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{3,20}$/;
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valCed = /^(?=.*\d)[0-9]{7,15}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;
    const valPa = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{8,30}$/;

    // Se establecen los errores como verdaderos inicialmente
    setErrorRol(true);
    setErrorCedula(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorDireccion(true);
    setErrorCiudad(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);

    // Validación de los campos
   if (!cedula) {
      showAlert("error", "Ingrese una cédula!");
      setErrorCedula(false);
    } else if (!valCed.test(cedula)) {
      showAlert("error", "Ingrese una cédula válida, La cedula tiene que tener 10 digitos!");
      setErrorCedula(false);
    } else if (!usuario) {
      showAlert("error", "Ingrese un nombre de usuario!");
      setErrorUsuario(false);
    } else if (!valUsu.test(usuario)) {
      showAlert("error", "Ingrese un nombre de usuario válido, El nombre de ususario tene que tener como minimo una mauscula y un número!");
      setErrorUsuario(false);
    } else if (usuariosList.map((user) => user.Usuario).includes(usuario) && usuario !== usuariosList.filter(user => user.IdUsuario == id).map(user => user.Usuario).toString()) {
      showAlert("error", "Ese nombre de usuario ya está registrado...");
      setErrorUsuario(false);
    } else if (!nombre) {
      showAlert("error", "Ingrese su nombre!");
      setErrorNombre(false);
    } else if (!valNomApe.test(nombre)) {
      showAlert("error", "Ingrese un nombre válido, el nombre debe comenzar en mayuscula!");
      setErrorNombre(false);
    } else if (!apellido) {
      showAlert("error", "Ingrese sus apellidos!");
      setErrorApellido(false);
    } else if (!valNomApe.test(apellido)) {
      showAlert("error", "Ingrese apellidos válido, el apellido debe comenzar en mayuscula!");
      setErrorApellido(false);
    } else if (!celular) {
      showAlert("error", "Ingrese su número de celular!");
      setErrorCelular(false);
    } else if (!valCel.test(celular)) {
      showAlert("error", "Ingrese un número de celular válido, el número de celular debe tener 10 digitos!");
      setErrorCelular(false);
    } else if (usuariosList.map((user) => user.Celular).includes(celular) && celular !== usuariosList.filter(user => user.IdUsuario == id).map(user => user.Celular).toString()) {
      showAlert("error", "Ese número de celular ya está registrado...");
      setErrorCelular(false);
    } else if (!direccion) {
      showAlert("error", "Ingrese una dirección!");
      setErrorDireccion(false);
    } else if (ciudad == 0) {
      showAlert("error", "Seleccione el nombre de la Ciudad!");
      setErrorCiudad(false);
    } else if (!correo) {
      showAlert("error", "Ingrese un correo!");
      setErrorCorreo(false);
    } else if (!valEm.test(correo)) {
      showAlert("error", "Ingrese un correo válido, el correo debe tener un @ y el '.com'!");
      setErrorCorreo(false);
    } else if (usuariosList.map((user) => user.Correo).includes(correo) && correo !== usuariosList.filter(user => user.IdUsuario == id).map(user => user.Correo).toString()) {
      showAlert("error", "Ese correo ya está registrado...");
      setErrorCorreo(false);
    } else if (!pass) {
      showAlert("error", "Ingrese una contraseña!");
      setErrorPass(false);
    } else if (!valPa.test(pass)) {
      showAlert("error", "Ingrese una contraseña válida, la contraseña debe ser como minimo de 8 digitos, uno de ellos debe ser mayuscula, otro minuscula y debe tener al menos un número!");
      setErrorPass(false);
    } else if (veriPass !== pass) {
      showAlert("error", "Las contraseñas deben ser iguales!");
      setErrorConfirmPass(false);
    } else if (!estado) {
      setEstado(true);
    } else {
      showAlert("success", "Usuario registrado con éxito!");
      Axios.put(URLUsuarios, {
        IdUsuario: id,
        Estado: estado,
        IdRol: 2,
        Cedula: cedula,
        Usuario: usuario,
        Nombre: nombre,
        Apellidos: apellido,
        Celular: celular,
        Direccion: direccion,
        IdCiudad: ciudad,
        Correo: correo,
        Contrasenha: pass,
        TerminosCondiciones: true,
        PoliticasPrivacidad: true
      }).then(() => {
        getUsuarios();
        setOpen(false);
        setEdit(false);
        empty();
      }).catch((error) => {
        console.log(error)
      })
    }
  };

  //delete
  const deleteUsuario = (idUsuario) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idUsuario)
        Axios.delete(URLUsuarios + `/${idUsuario}`)
          .then(() => {
            getUsuarios();
            Swal.fire(
              'Eliminado!',
              'El usuario ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar usuario");
          });
      }
    });
  };
  //alerta de confirmar estado

  const confirmarEstado = (id) => {
    Swal.fire({
      title: 'Cambiar Estado',
      text: '¿Estás seguro de cambiar el estado de este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar estado!'
    }).then((result) => {
      if (result.isConfirmed) {
        switchEstado(id);
      }
    });
  };

  const switchEstado = (id) => {
    if (usuariosList.some((user) => (user.IdUsuario === id && user.IdUsuario === 1))) {
      showAlert("error", "Este rol no se puede desactivar!");
      return;
    }
    let est = usuariosList.some((user) => (user.IdUsuario === id && user.Estado))
    if (est) {
      est = false;
    } else {
      est = true;
    }
    const user = usuariosList.find((user) => (user.IdUsuario === id))
    Axios.put(URLUsuarios, {
      IdUsuario: id,
      Estado: est,
      IdRol: user.IdRol,
      Cedula: user.Cedula,
      Usuario: user.Usuario,
      Nombre: user.Nombre,
      Apellidos: user.Apellidos,
      Celular: user.Celular,
      Direccion: user.Direccion,
      IdCiudad: user.IdCiudad,
      Correo: user.Correo,
      Contrasenha: user.Contrasenha,
      TerminosCondiciones: true,
      PoliticasPrivacidad: true
    }).then(() => {
      showAlert("success", "Estado modificado.");
      getUsuarios();setOpen(false);

    }).catch((error) => {
      console.log(error);
      showAlert("error", "Error al modificar el estado.");
    });
  }
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar usuarios según el término de búsqueda
  const filteredUsuarios = usuariosList.filter((user) => {
  return user.IdRol === 2 && Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [ver, setVer] = useState(true);
  const toggleVer = () => {
    setVer(!ver)
  }

  const visualizar = (vis) => {
    setVisualizarUsuario(vis);
    setOpenVisualizar(true);
    setOpenVisualizar(true);
    setVer(true);
    setEdit(true);
    setErrorRol(true);
    setErrorCedula(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorCiudad(true);
    setErrorDireccion(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    handleShow();
    setId(vis.IdUsuario)
    setRol(vis.IdRol)
    setCedula(vis.Cedula)
    setUsuario(vis.Usuario)
    setNombre(vis.Nombre)
    setApellido(vis.Apellidos)
    setCelular(vis.Celular)
    setDireccion(vis.Direccion)
    setCiudad(vis.IdCiudad)
    setCorreo(vis.Correo)
    setPass(vis.Contrasenha)
    console.log(user)
  };

  // Estados para el paginado
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPerPage] = useState(3); // Número de categorías por página

  // Función para manejar el cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calcula las categorías para la página actual
  const indexOfLastUsuario = currentPage * usuariosPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Card className="">
                    <CardHeader variant="gradient" className="mb-4 p-6 gradiente-lila-rosado">
                      <Typography variant="h6" color="white">
                        {edit ? ("Editar empleado") : ("Crear empleado")}
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-2 pt-0 pb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <Input
                            label="Cédula"
                            value={cedula}
                            type="number"
                            onChange={
                              (event) => setCedula(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Usuario"
                            value={usuario}
                            onChange={(event) => setUsuario(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Nombre"
                            value={nombre}
                            onChange={(event) => setNombre(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Apellido"
                            value={apellido}
                            onChange={(event) => setApellido(event.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Celular"
                            value={celular}
                            onChange={(event) => setCelular(event.target.value)}
                            type="number" />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Dirección"
                            value={direccion}
                            onChange={(event) => setDireccion(event.target.value)} />
                        </div>
                        <div className="col-span-">
                          <select
                            label="Rol"
                            value={ciudad}
                            onChange={(event) => setCiudad(event.target.value)}
                            className="block w-full h-10 border border-gray-400 text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
                            <option value={0}>Seleccione una ciudad</option>
                            {ciudadesList.map((ciudad) => (
                              <option key={ciudad.IdCiudad} value={ciudad.IdCiudad}>
                                {ciudad.NombreCiudad}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Correo"
                            value={correo}
                            onChange={(event) => setCorreo(event.target.value)}
                            type="email" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="col-span-1 flex items-center relative left-4">
                          <Input
                            label="Contraseña"
                            value={pass}
                            onChange={(event) => setPass(event.target.value)}
                            type={ver ? "password" : "text"} />
                          <button className="ml-2 text-black relative right-10" onClick={toggleVer}>{ver ? <EyeIcon className="h-5" /> : <EyeSlashIcon className="h-5" />}</button>
                        </div>

                        <div className="col-span-1">
                          <Input
                            label="Confirmar contraseña"
                            value={veriPass}
                            onChange={(event) => setVeriPass(event.target.value)}
                            type={ver ? "password" : "text"} />
                        </div>
                      </div>
                      <div className="flex justify-end items-center mt-2">
                        {edit ? (
                          <div>
                            {/* <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                              Volver
                            </button> */}
                            <button onClick={putUsuario} className="btnAgg text-white font-bold py-1 px-3 rounded">
                              Editar empleado
                            </button>
                          </div>
                        ) : (
                          <button onClick={postUsuario} className="btnAgg text-white font-bold py-1 px-3 rounded ">
                            Crear empleado
                          </button>
                        )}
                        <button onClick={(e) => {
                          setOpen(false);
                          empty();
                        }} className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded ms-1">
                          Cancelar
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* //visualizaicion */}
      <Transition.Root show={openVisualizar} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Card className="">
                    <CardHeader variant="gradient" className=" p-6 gradiente-lila-rosado">
                      <Typography variant="h6" color="white">
                        Visualizar
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-4 pt-0 pb-2">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  value={rol}
                  disabled
                  className="bg-gray-300 pt-3 form-select mt-1 block w-full border-gray-700 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-400 focus:ring-opacity-50"
                >
                  <option value={0}>Seleccione un rol</option>
                  {rolesList.map((rol) => (
                    <option key={rol.IdRol} value={rol.IdRol}>
                      {rol.NombreDelRol}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                <select
                  value={ciudad}
                  disabled
                  className="bg-gray-300 pt-3 form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-gray-400 focus:ring focus:ring-gray-400 focus:ring-opacity-50"
                >
                  <option value={0}>Seleccione una ciudad</option>
                  {ciudadesList.map((ciudad) => (
                    <option key={ciudad.IdCiudad} value={ciudad.IdCiudad}>
                      {ciudad.NombreCiudad}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input label="Cédula" value={cedula} readOnly />
              <Input label="Usuario" value={usuario} readOnly />
              <Input label="Nombre" value={nombre} readOnly />
              <Input label="Apellido" value={apellido} readOnly />
              <Input label="Celular" value={celular} readOnly />
              <Input label="Dirección" value={direccion} readOnly />
              
              <Input label="Correo" value={correo} readOnly />
              <Input label="Contraseña" value={pass} readOnly />
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={(e) => {
                setOpenVisualizar(false);
                empty();
              }}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="md:flex-row md:items-center md:justify-between grid grid-cols-5 ml-auto ">
        <div className="md:flex md:items-center col-span-4">
          <Input
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className=" md:mt-0 md:ml-4 col-span-1 mr-auto">
          <Button className=" btnAgg px-3 py-2 flex items-center border" onClick={() => { setOpen(true), setEdit(false); }}>
            <UserPlusIcon className="h-6 w-6 me-2" />Crear Empleado
          </Button>
        </div>
      </div>

      <Card>

        <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Empleados
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-5">
          <table className="w-full min-w-[620px] table-auto">
            <thead>
              <tr>
                {["Rol", "Cedula", "Nombre", "Apellido", , "Correo", "Estado", "Funciones"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-indigo-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((user) => (
                <tr key={user.IdUsuario}><td className="border-b border-blue-gray-50 py-3 px-5">{rolesList.map((rol) => (rol.IdRol == user.IdRol && rol.NombreDelRol))}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Cedula}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Nombre}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Apellidos}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Correo}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {user.Estado ? (
                      <button onClick={() => { confirmarEstado(user.IdUsuario) }} className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full">Activo</button>
                    ) : (
                      <button onClick={() => { confirmarEstado(user.IdUsuario) }} className="bg-pink-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full">Inactivo</button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-0 px-1">
                    <button onClick={() => { editar(user) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500" onClick={() => deleteUsuario(user.IdUsuario)}><TrashIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500" onClick={() => { visualizar(user) }} ><EyeIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         {/* Paginación */}
       <ul className="flex justify-center mt-4">
            {currentPage > 1 ? <button onClick={() =>
              currentPage > 1 ? paginate(currentPage - 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronLeftIcon className="w-6 h-6" />
            </button> : null}
            {[...Array(Math.ceil(filteredUsuarios.length / usuariosPerPage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                </button>
              </li>
            ))}
            {currentPage < filteredUsuarios.length / usuariosPerPage ? <button onClick={() =>
              currentPage < filteredUsuarios.length / usuariosPerPage ? paginate(currentPage + 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronRightIcon className="w-6 h-6" />
            </button> : null}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
export default Empleados;