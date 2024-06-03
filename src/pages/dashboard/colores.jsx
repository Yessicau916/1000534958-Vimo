import React, { Fragment, useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody, Input, Button } from "@material-tailwind/react";
import Axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
//iconos
import { PencilSquareIcon, TrashIcon, EyeIcon, UserPlusIcon, SquaresPlusIcon, } from "@heroicons/react/24/solid";
import { EyeSlashIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export function Colores() {
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
  const [coloresList, setcoloresList] = useState([]);
  const [open, setOpen] = useState(false);

  // Estado para controlar el modal de visualización
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [visualizarColor, setVisualizarColor] = useState(null);

  //se crean variables en las que se guardan los datos de los input
  const [nombre, setNombre] = useState("");
  const [hexadecimal, setHexadecimal] = useState('#FFFFFF');
  const [img, setImg] = useState("");
  const [estado, setEstado] = useState(true);
  const [color, setColor] = useState("")


  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  //Variables para el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //apis
  const URLColores = "http://localhost:8080/api/colores";

  //metodos o endpoints get
  const getColores = async () => {
    try {
      const resp = await Axios.get(URLColores);
      setcoloresList(resp.data.colores);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const empty = () => {
    setVer(true)
    setNombre("")
    setHexadecimal("")
    setImg("")
    setEdit(false);
  }

  useEffect(() => {
    getColores();
  }, []);

  const [errorNombre, setErrorNombre] = useState(true);
  const [errorHexadecimal, setErrorHexadecimal] = useState(true);

  //post
  const postColores = () => {
    setErrorNombre(true);
    setErrorHexadecimal(true);
    setErrorImg(true);

    // Validación de los campos
    if (!nombre) {
      showAlert("error", "Ingrese un nombre para el color");
      setErrorNombre(false);
    } else if (!/^[a-zA-Z\s]+$/.test(nombre)) {
      showAlert("error", "El nombre del color solo puede contener letras y espacios");
      setErrorNombre(false);
    } else if (
      coloresList
        .map(user => user.NombreColor.toLowerCase())
        .includes(nombre.toLowerCase())
    ) {
      showAlert("error", "Ya existe un color con ese nombre, intenta con otro");
      setErrorNombre(false);
    } else if (!estado) {
      setEstado(true);
    } else if (!hexadecimal) {
      showAlert("error", "Ingrese un hexadecimal");
      setErrorHexadecimal(false);
    } else {
      showAlert("success", "color registrado con éxito!");
      Axios.post(URLColores, {
        NombreColor: nombre,
        hexadecimal: hexadecimal,
        Imagen: img,
        Estado: estado
      }).then(() => {
        getColores();
        setOpen(false);
        empty();
      }).catch((error) => {
        console.log(error);
      });
    }
  };

  //put//llamar las variables 
  //   const editar = (val) => {
  //     setOpen(true);
  //     setVer(true);
  //     setEdit(true);
  //     setErrorNombre(true);
  //     setErrorImg(true);
  //     setErrorHexadecimal(true);
  //     handleShow();
  //     setId(val.IdColor)
  //     setNombre(val.NombreColor)
  //     setHexadecimal(val.Hexadecimal)
  //     setImg(val.Imagen)
  //   }
  const editar = (val) => {
    setOpen(true);
    setEdit(true);
    setId(val.IdColor);
    setNombre(val.NombreColor);
    setHexadecimal(val.Hexadecimal);
    setImg(val.Imagen);
  };


  const putColor = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorNombre(true);
    setErrorHexadecimal(true);
    setErrorImg(true);

    // Validación de los campos
    if (!nombre) {
      showAlert("error", "Ingrese un nombre para el color");
      setErrorNombre(false);
    } else if (!/^[a-zA-Z\s]+$/.test(nombre)) {
      showAlert("error", "El nombre del color solo puede contener letras y espacios");
      setErrorNombre(false);
    } else if (
      coloresList
        .map(user => user.NombreColor.toLowerCase())
        .includes(nombre.toLowerCase())
    ) {
      showAlert("error", "Ya existe un color con ese nombre, intenta con otro");
      setErrorNombre(false);
    } else if (!estado) {
      setEstado(true);
    } else if (!hexadecimal) {
      showAlert("error", "Ingrese un hexadecimal");
      setErrorHexadecimal(false);
    } else {
      console.log("Datos a enviar:", { IdColor: id, NombreColor: nombre, Hexadecimal: hexadecimal, Imagen: img, Estado: estado }); // Verifica los datos que se enviarán
      Axios.put(URLColores, {
        IdColor: id,
        NombreColor: nombre,
        Hexadecimal: hexadecimal,
        Imagen: img,
        Estado: estado
      }).then((response) => {
        console.log("Respuesta de la API:", response.data); // Verifica la respuesta de la API
        getColores();
        setOpen(false);
        setEdit(false);
        empty();
      }).catch((error) => {
        console.log(error);
        showAlert("error", "Hubo un error al editar la categoría, inténtalo de nuevo");
      });
    }
  };


  //deletey
  const deleteColor = (idColor) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar esta categoría?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idColor)
        Axios.delete(URLColores + `/${idColor}`)
          .then(() => {
            getColores();
            Swal.fire(
              'Eliminado!',
              'La categoría ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar la categoría");
          });
      }
    });
  };
  //alerta de confirmar estado

  const confirmarEstado = (id) => {
    Swal.fire({
      title: 'Cambiar Estado',
      text: '¿Estás seguro de cambiar el estado de este categoría?',
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

  // En la función switchEstado
  const switchEstado = (id) => {

    let est = coloresList.some((user) => (user.IdColor === id && user.Estado))
    if (est) {
      est = false;
    } else {
      est = true;
    }
    const user = coloresList.find((user) => (user.IdColor === id))
    Axios.put(URLColores, {
      IdColor: id,
      Estado: est,
      NombreColor: user.NombreColor,
      Hexadecimal: user.Hexadecimal,
      Imagen: user.Imagen
    }).then(() => {
      showAlert("success", "Estado modificado.");
      getColores();
      setOpen(false);
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

  // Filtrar colores según el término de búsqueda
  const filteredColores = coloresList.filter((user) => {
    return Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [ver, setVer] = useState(true);
  const toggleVer = () => {
    setVer(!ver)
  };

  // En la función visualizar
  const visualizar = (vis) => {
    setVisualizarColor(vis);
    setOpenVisualizar(true);
    setVer(true);
    setEdit(true);
    setErrorNombre(true);
    handleShow();
    setId(vis.IdColor);
    setNombre(vis.NombreColor);
    setHexadecimal(vis.Hexadecimal);
    setImg(vis.Imagen);
  };

  // Estados para el paginado
  const [currentPage, setCurrentPage] = useState(1);
  const [coloresPerPage] = useState(3); // Número de categorías por página

  // Función para manejar el cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calcula las categorías para la página actual
  const indexOfLastColor = currentPage * coloresPerPage;
  const indexOfFirstColor = indexOfLastColor - coloresPerPage;
  const currentColores = filteredColores.slice(indexOfFirstColor, indexOfLastColor);

  const handleHexChange = (e) => {
    const value = e.target.value;
    setHexadecimal(value);

    // Validar el valor hexadecimal antes de actualizar el color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      setColor(value);
    } else {
      // Si el valor no es válido, puedes manejarlo de alguna manera, como mostrar un mensaje de error
      setColor(""); // O dejar el color en blanco si se proporciona un valor hexadecimal no válido
    }
  };

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
            <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
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
                <div className="px-3 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Card className="">
                    <CardHeader variant="gradient" className="mb-3 p-5 gradiente-lila-rosado">
                      <Typography variant="h6" color="white">
                        {edit ? ("Editar Color") : ("Crear Color")}
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-2 pt-0 pb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 px-6">
                          <span className="text-xs ps-1 flex text-left">Nombre del Color</span>
                          <Input
                            value={nombre}
                            onChange={(event) => setNombre(event.target.value)}
                          />
                        </div>
                        <div className="col-span-2 px-6">
                          <span className="text-xs ps-1 flex text-left">Seleccione el color</span>
                          <Input
                            type="color"
                            value={hexadecimal}
                            onInput={handleHexChange}
                            className="w-full padColor"
                          />
                        </div>
                        <div className="col-span-2 pb-3 px-6">
                          <span className="text-xs ps-1 flex text-left">Imagen</span>
                          <Input
                            value={img}
                            onChange={(event) => setImg(event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end items-center mt-2">
                        {edit ? (
                          <div>
                            {/* <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                          Volver
                        </button> */}
                            <button onClick={putColor} className="btnAgg text-white font-bold py-1 px-3 rounded">
                              Editar Color
                            </button>
                          </div>
                        ) : (
                          <button onClick={postColores} className="btnAgg text-white font-bold py-1 px-3 rounded ">
                            Crear Color
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
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles de la Color</p>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-2 gap-4">
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input label="ID" className="Id" value={id} readOnly />
                    <Input label="Nombre" value={nombre} readOnly />
                    <Input label="Hexadecimal" value={hexadecimal} readOnly />
                    <Input label="Imagen" value={img} readOnly />
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
            <SquaresPlusIcon className="h-6 w-6 me-2" /> Crear Color
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Color
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-5">
          <table className="w-full min-w-[620px] table-auto">
            <thead>
              <tr>
                {["Color", "Nombre de la Color", "Hexadecimal", "Imagen", "Estado", "Funciones"].map((el) => (
                  <th key={el} className="border-b border-blue-indigo-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentColores.map((user) => (
                <tr key={user.IdColor}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <div 
                    style={{ backgroundColor: user.Hexadecimal, width: '30px', height: '30px', }}
                    className="rounded-full"
                    ></div>
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreColor}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Hexadecimal}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreColor}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {user.Estado ? (
                      <button onClick={() => { confirmarEstado(user.IdColor) }} className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full">Activo</button>
                    ) : (
                      <button onClick={() => { confirmarEstado(user.IdColor) }} className="bg-pink-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full">Inactivo</button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-0 px-1">
                    <button onClick={() => { editar(user) }} className="text-xs font-semibold0 btnFunciones h-4 w-5 text-gray-500">
                      <PencilSquareIcon />
                    </button>
                    <button className="text-xs font-semibold btnFunciones h-4 w-5 text-gray-500" onClick={() => deleteColor(user.IdColor)}>
                      <TrashIcon />
                    </button>
                    <button className="text-xs font-semibold btnFunciones h-4 w-5 text-gray-500" onClick={() => { visualizar(user) }}>
                      <EyeIcon />
                    </button>
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
            {[...Array(Math.ceil(filteredColores.length / coloresPerPage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                </button>
              </li>
            ))}
            {currentPage < filteredColores.length / coloresPerPage ? <button onClick={() =>
              currentPage < filteredColores.length / coloresPerPage ? paginate(currentPage + 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronRightIcon className="w-6 h-6" />
            </button> : null}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}

export default Colores;
