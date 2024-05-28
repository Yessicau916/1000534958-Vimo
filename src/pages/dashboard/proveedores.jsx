import React, { Fragment, useState, useEffect } from "react";
import {Typography, Card, CardHeader, CardBody, Input,Button} from "@material-tailwind/react";
import Axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
//iconos
import {
  PencilSquareIcon,TrashIcon,EyeIcon,UserPlusIcon,} from "@heroicons/react/24/solid";
import { EyeSlashIcon,ChevronRightIcon,ChevronLeftIcon} from "@heroicons/react/24/outline";

export function Proveedores() {
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
  const [proveedoresList, setProveedoresList] = useState([]);
  const [ciudadesList, setCiudadesList] = useState([]);
  const [open, setOpen] = useState(false);

   // Estado para controlar el modal de visualización
   const [openVisualizar, setOpenVisualizar] = useState(false);
   const [visualizarProveedor, setVisualizarProveedor] = useState(null); // Estado para almacenar la información del proveedor a visualizar

  //se crean variables en las que se guardan los datos de los input
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [celular, setCelular] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [correo, setCorreo] = useState("");
  const [comentario, setComentario] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

   //Variables para el modal
   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

  //apis
  const URLProveedor = "http://localhost:8080/api/proveedores";
  const URLCiudades = "http://localhost:8080/api/ciudades";

  //metodos o endpoints get
  const getProveedores = async () => {
    try {
      const resp = await Axios.get(URLProveedor);
      setProveedoresList(resp.data.proveedores);
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
    setCedula("")
    setNombre("")
    setApellido("")
    setCelular("")
    setDireccion("")
    setCiudad(0)
    setCorreo("")
    setComentario("")
    setEdit(false);
  }

  useEffect(() => {
    getProveedores();
    getCiudades();
  }, []);

  const [errorCedula, setErrorCedula] = useState(true);
  const [errorNombre, setErrorNombre] = useState(true);
  const [errorApellido, setErrorApellido] = useState(true);
  const [errorCelular, setErrorCelular] = useState(true);
  const [errorDireccion, setErrorDireccion] = useState(true);
  const [errorCiudad, setErrorCiudad] = useState(true);
  const [errorCorreo, setErrorCorreo] = useState(true);
  const [errorComentario, setErrorComentario] = useState(true);

  //post
  const postProveedor = () => {
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valCed = /^(?=.*\d)[0-9]{6,20}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;

    // Se establecen los errores como verdaderos inicialmente
    setErrorCedula(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorDireccion(true);
    setErrorCiudad(true);
    setErrorCorreo(true);
    setErrorComentario(true);
    // Validación de los campos
    if (!cedula) {
      showAlert("error", "Ingrese una cédula!");
      setErrorCedula(false);
    } else if (!valCed.test(cedula)) {
      showAlert("error", "Ingrese una cédula válida!");
      setErrorCedula(false);
    } else if (!nombre) {
      showAlert("error", "Ingrese su nombre!");
      setErrorNombre(false);
    } else if (!valNomApe.test(nombre)) {
      showAlert("error", "El nombre debe tener como mínimo una minúscula y una mayúscula!");
      setErrorNombre(false);
    } else if (!apellido) {
      showAlert("error", "Ingrese sus apellidos!");
      setErrorApellido(false);
    } else if (!valNomApe.test(apellido)) {
      showAlert("error", "El apellido debe tener como mínimo una minúscula y una mayúscula!");
      setErrorApellido(false);
    } else if (!celular) {
      showAlert("error", "Ingrese su número de celular!");
      setErrorCelular(false);
    } else if (!valCel.test(celular)) {
      showAlert("error", "El celular debe tener 10 dígitos ");
      setErrorCelular(false);
    } else if (proveedoresList.map((user) => user.Telefono).includes(celular)) {
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
    } else if (proveedoresList.map((user) => user.Correo).includes(correo)) {
      showAlert("error", "Ese correo ya está registrado...");
      setErrorCorreo(false);
    } else if (!comentario) {
      showAlert("error", "Ingrese un comentario!");
      setComentario(false);
    } else {
      showAlert("success", "proveedor registrado con éxito!");
      Axios.post(URLProveedor, {
        Cedula: parseInt(cedula),
        Nombre: nombre,
        Apellido: apellido,
        Telefono: celular,
        Direccion: direccion,
        IdCiudad: ciudad,
        Correo: correo,
        Comentario: comentario,
      }).then(() => {
        getProveedores();
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
    setErrorCedula(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorCiudad(true);
    setErrorDireccion(true);
    setErrorCorreo(true);
    setErrorComentario(true);
    handleShow();
    setId(val.IdProveedor)
    setCedula(val.Cedula)
    setNombre(val.Nombre)
    setApellido(val.Apellido)
    setCelular(val.Telefono)
    setDireccion(val.Direccion)
    setCiudad(val.IdCiudad)
    setCorreo(val.Correo)
    setComentario(val.Comentario)
  }

  const putProveedor = () => {
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valCed = /^(?=.*\d)[0-9]{7,15}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;

    // Se establecen los errores como verdaderos inicialmente
    setErrorCedula(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorDireccion(true);
    setErrorCiudad(true);
    setErrorCorreo(true);
    setErrorComentario(true);

    // Validación de los campos
    if (!cedula) {
      showAlert("error", "Ingrese una cédula!");
      setErrorCedula(false);
    } else if (!valCed.test(cedula)) {
      showAlert("error", "Ingrese una cédula válida!");
      setErrorCedula(false);
    } else if (!nombre) {
      showAlert("error", "Ingrese su nombre!");
      setErrorNombre(false);
    } else if (!valNomApe.test(nombre)) {
      showAlert("error", "El nombre debe tener como mínimo una minúscula y una mayúscula!");
      setErrorNombre(false);
    } else if (!apellido) {
      showAlert("error", "Ingrese sus apellidos!");
      setErrorApellido(false);
    } else if (!valNomApe.test(apellido)) {
      showAlert("error", "El apellido debe tener como mínimo una minúscula y una mayúscula!");
      setErrorApellido(false);
    } else if (!celular) {
      showAlert("error", "Ingrese su número de celular!");
      setErrorCelular(false);
    } else if (!valCel.test(celular)) {
      showAlert("error", "El celular debe tener 10 dígitos ");
      setErrorCelular(false);
    } else if (proveedoresList.map((user) => user.Telefono).includes(celular)) {
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
    } else if (proveedoresList.map((user) => user.Correo).includes(correo)) {
      showAlert("error", "Ese correo ya está registrado...");
      setErrorCorreo(false);
    } else if (!comentario) {
      showAlert("error", "Ingrese un comentario!");
      setComentario(false);
    } else {
      showAlert("success", "Proveedor registrado con éxito!");
      Axios.put(URLProveedor, {
        IdProvedor: id,
        Cedula: cedula,
        Nombre: nombre,
        Apellido: apellido,
        Correo: correo,
        Telefono: celular,
        Direccion: direccion,
        IdCiudad: ciudad,
        Comentario: comentario,
      }).then(() => {
        getProveedores();
        setEdit(false);
        empty();
      }).catch((error) => {
        console.log(error)
      })
    }
  };

  //delete
  const deleteProveedor = (idProveedor) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar este proveedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idProveedor)
        Axios.delete(URLProveedor + `/${idProveedor}`)
          .then(() => {
            getProveedores();
            Swal.fire(
              'Eliminado!',
              'El proveedor ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar el proveedor");
          });
      }
    });
  };
  //alerta de confirmar estado

  // const confirmarEstado = (id) => {
  //   Swal.fire({
  //     title: 'Cambiar Estado',
  //     text: '¿Estás seguro de cambiar el estado de este proveedor?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí, cambiar estado!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       switchEstado(id);
  //     }
  //   });
  // };

//   const switchEstado = (id) => {
//     if (proveedoresList.some((user) => (user.IdProveedor === id && user.IdProveedor === 1))) {
//       showAlert("error", "Este rol no se puede desactivar!");
//       return;
//     }
//     let est = proveedoresList.some((user) => (user.IdProveedor === id && user.Estado))
//     if (est) {
//       est = false;
//     } else {
//       est = true;
//     }
//     const user = proveedoresList.find((user) => (user.IdProveedor === id))
//     Axios.put(URLProveedor, {
//       IdProveedor: id,
//       Estado: est,
//       IdRol: user.IdRol,
//       Cedula: user.Cedula,
//       Proveedor: user.Proveedor,
//       Nombre: user.Nombre,
//       Apellido: user.Apellido,
//       Telefono: user.Telefono,
//       Direccion: user.Direccion,
//       IdCiudad: user.IdCiudad,
//       Correo: user.Correo,
//       Contrasenha: user.Contrasenha,
//       TerminosCondiciones: true,
//       PoliticasPrivacidad: true
//     }).then(() => {
//     showAlert("success", "Estado modificado.");
//     getProveedores();
//   }).catch((error) => {
//     console.log(error);
//     showAlert("error", "Error al modificar el estado.");
//   });
// }

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar categorias según el término de búsqueda
  const filteredProveedores = proveedoresList.filter((user) => {
    return Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [ver, setVer] = useState(true);
  const toggleVer = () => {
    setVer(!ver)
  }

  const visualizar = (vis) => {
    setVisualizarProveedor(vis);
    setOpenVisualizar(true);
    setOpenVisualizar(true);
    setVer(true);
    setEdit(true);
    setErrorCedula(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorCiudad(true);
    setErrorDireccion(true);
    setErrorCorreo(true);
    setErrorComentario(true);
    handleShow();
    setId(vis.IdProveedor)
    setCedula(vis.Cedula)
    setNombre(vis.Nombre)
    setApellido(vis.Apellido)
    setCelular(vis.Telefono)
    setDireccion(vis.Direccion)
    setCiudad(vis.IdCiudad)
    setCorreo(vis.Correo)
    setComentario(vis.Comentario)
  };
 
  // El estado para controlar la visibilidad de los Card
  const [mostrarCrearCard, setMostrarCrearCard] = useState(true);

  // Estados para el paginado
  const [currentPage, setCurrentPage] = useState(1);
  const [proveedoresPerPage] = useState(3); // Número de categorías por página

  // Función para manejar el cambio de página
const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Calcula las categorías para la página actual
const indexOfLastUsu = currentPage * proveedoresPerPage;
const indexOfFirstUsu = indexOfLastUsu - proveedoresPerPage;
const currentProveedores = proveedoresList.slice(
 indexOfFirstUsu,
 indexOfLastUsu);

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
                        {edit ? ("Editar Proveedor") : ("Crear proveedor")}
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
                            label="Telefono"
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
                            label="Ciudad"
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
                      </div>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="col-span-1">
                          <Input
                            label="Correo"
                            value={correo}
                            onChange={(event) => setCorreo(event.target.value)}
                            type="email" />
                        </div>
                        <div className="col-span-1">
                          <Input
                            label="Comentario"
                            value={comentario}
                            onChange={(event) => setComentario(event.target.value)} />
                        </div>

                        </div>
                        <div className="flex justify-end items-center mt-2">
                        {edit ? (
                          <div>
                            {/* <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                              Volver
                            </button> */}
                            <button onClick={putProveedor} className="btnAgg text-white font-bold py-1 px-3 rounded">
                              Editar proveedor
                            </button>
                          </div>
                        ) : (
                          <button onClick={postProveedor} className="btnAgg text-white font-bold py-1 px-3 rounded ">
                            Crear proveedor
                          </button>
                        )}
                        <button onClick={(e) => {setOpen(false);
                            empty();}} className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded ms-1">
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
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={setOpenVisualizar}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 transition-opacity bg-indigo-500 bg-opacity-70" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-indigo-900">Visualizar Información</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles del proveedor</p>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-2 gap-4">
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input label className="Cédula" value={cedula} disabled />
                    <Input label="Nombre" value={nombre} disabled />
                    <Input label="Apellido" value={apellido} disabled />
                    <Input label="Telefono" value={celular} disabled />
                    <Input label="Dirección" value={direccion} disabled />
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
                    <Input label="Correo" value={correo} disabled />
                    <Input label="Comentario" value={comentario} disabled />
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={(e) => {
                      setOpenVisualizar(false);
                      empty();
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </Transition.Child>
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
            <UserPlusIcon className="h-6 w-6 me-2" />Crear Proveedor
          </Button>
        </div>
      </div>

      <Card>
        
        <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Proveedores 
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-5">
        <table className="w-full min-w-[620px] table-auto">
            <thead>
              <tr>
                {[ "Cedula", "Nombre", "Apellido",, "Correo", "Funciones"].map((el) => (
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
              {currentProveedores.map((prove) => (
                <tr key={prove.IdProveedor}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{prove.Cedula}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{prove.Nombre}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{prove.Apellido}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{prove.Correo}</td>
                 
                  <td className="border-b border-blue-gray-50 py-0 px-1">
                    <button onClick={() => { editar(prove) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5" onClick={() => deleteProveedor(prove.IdProveedor)}><TrashIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5" onClick={() => { visualizar(prove) }} ><EyeIcon /></button>
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
            {[...Array(Math.ceil(filteredProveedores.length / proveedoresPerPage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                </button>
              </li>
            ))}
            {currentPage < filteredProveedores.length / proveedoresPerPage ? <button onClick={() =>
              currentPage < filteredProveedores.length / proveedoresPerPage ? paginate(currentPage + 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronRightIcon className="w-6 h-6" />
            </button> : null}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
export default Proveedores;