import React, { Fragment, useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody, Input, Button } from "@material-tailwind/react";
import Axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
//iconos
import { PencilSquareIcon, TrashIcon, EyeIcon, UserPlusIcon, SquaresPlusIcon,  } from "@heroicons/react/24/solid";
import { EyeSlashIcon, ChevronLeftIcon,ChevronRightIcon } from "@heroicons/react/24/outline";

export function Categorias() {
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
  const [categoriasList, setCategoriasList] = useState([]);
  const [open, setOpen] = useState(false);

  // Estado para controlar el modal de visualización
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [visualizarCategoria, setVisualizarCategoria] = useState(null);

  //se crean variables en las que se guardan los datos de los input
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(true);
  

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
  const URLCategorias = "http://localhost:8080/api/categorias";

  //metodos o endpoints get
  const getCategorias = async () => {
    try {
      const resp = await Axios.get(URLCategorias);
      setCategoriasList(resp.data.categorias);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const empty = () => {
    setVer(true)
    setNombre("")
    setEdit(false);
  }

  useEffect(() => {
    getCategorias();
  }, []);

  const [errorNombre, setErrorNombre] = useState(true);

  //post
  const postCategorias = () => {
    setErrorNombre(true);
  
    // Validación de los campos
    if (!nombre) {
      showAlert("error", "Ingrese un nombre para la categoría");
      setErrorNombre(false);
    } else if (!/^[a-zA-Z\s]+$/.test(nombre)) {
      showAlert("error", "El nombre de la categoría solo puede contener letras y espacios");
      setErrorNombre(false);
    } else if (
      categoriasList
        .map(user => user.NombreCategoria.toLowerCase())
        .includes(nombre.toLowerCase())
    ) {
      showAlert("error", "Ya existe una categoría con ese nombre, intenta con otro");
      setErrorNombre(false);
    } else if (!estado) {
      setEstado(true);
    } else {
      showAlert("success", "Categoría registrada con éxito!");
      Axios.post(URLCategorias, {
        NombreCategoria: nombre,
        Estado: estado
      }).then(() => {
        getCategorias();
        setOpen(false);
        empty();
      }).catch((error) => {
        console.log(error);
      });
    }
  };
  
  //put//llamar las variables 
  const editar = (val) => {
    setOpen(true);
    setVer(true);
    setEdit(true);
    setErrorNombre(true);
    handleShow();
    setId(val.IdCategoria)
    setNombre(val.NombreCategoria)
  }

  const putCategoria = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorNombre(true);
    
    // Validación de los campos
    if (!nombre) {
      showAlert("error", "Ingrese un nombre para la categoría");
      setErrorNombre(false);
    } else if (!/^[a-zA-Z\s]+$/.test(nombre)) {
      showAlert("error", "El nombre de la categoría solo puede contener letras y espacios");
      setErrorNombre(false);
    } else if (
      categoriasList
        .filter(user => user.IdCategoria !== id)
        .map(user => user.NombreCategoria.toLowerCase())
        .includes(nombre.toLowerCase())
    ) {
      showAlert("error", "Ya existe una categoría con ese nombre, intenta con otro");
      setErrorNombre(false);
    } else if (!estado) {
      setEstado(true);
    }else {
      console.log("Datos a enviar:", { IdCategoria: id, NombreCategoria: nombre, Estado: estado }); // Verifica los datos que se enviarán
      Axios.put(URLCategorias, {
        IdCategoria: id,
        NombreCategoria: nombre,
        Estado: estado
      }).then((response) => {
        console.log("Respuesta de la API:", response.data); // Verifica la respuesta de la API
        getCategorias();
        setOpen(false);
        setEdit(false);
        empty();
      }).catch((error) => {
        console.log(error);
        showAlert("error", "Hubo un error al editar la categoría, inténtalo de nuevo");
      });
    }
  };
  
  
  
  //delete
  const deleteCategoria = (idCategoria) => {
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
        console.log(idCategoria)
        Axios.delete(URLCategorias + `/${idCategoria}`)
          .then(() => {
            getCategorias();
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
  
    let est = categoriasList.some((user) => (user.IdCategoria === id && user.Estado))
    if (est) {
      est = false;
    } else {
      est = true;
    }
    const user = categoriasList.find((user) => (user.IdCategoria === id))
    Axios.put(URLCategorias, {
      IdCategoria: id,
      Estado: est,
      NombreCategoria: user.NombreCategoria,
    }).then(() => {
    showAlert("success", "Estado modificado.");
    getCategorias();
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

  // Filtrar categorias según el término de búsqueda
  const filteredCategorias = categoriasList.filter((user) => {
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
    setVisualizarCategoria(vis);
    setOpenVisualizar(true);
    setVer(true);
    setEdit(true);
    setErrorNombre(true);
    handleShow();
    setId(vis.IdCategoria);
    setNombre(vis.NombreCategoria);
  };

  // Estados para el paginado
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriasPerPage] = useState(3); // Número de categorías por página

  // Función para manejar el cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calcula las categorías para la página actual
  const indexOfLastCategoria = currentPage * categoriasPerPage;
  const indexOfFirstCategoria = indexOfLastCategoria - categoriasPerPage;
  const currentCategorias = filteredCategorias.slice(indexOfFirstCategoria, indexOfLastCategoria);


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
                        {edit ? ("Editar Categoría") : ("Crear Categoría")}
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-2 pt-0 pb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 py-2 px-5">
                          <Input
                            label="Nombre de la categoría"
                            value={nombre}
                            onChange={
                              (event) => setNombre(event.target.value)} />
                        </div>
                      </div>

                      <div className="flex justify-end items-center mt-2">
                        {edit ? (
                          <div>
                            {/* <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                          Volver
                        </button> */}
                            <button onClick={putCategoria} className="btnAgg text-white font-bold py-1 px-3 rounded">
                              Editar Categoría
                            </button>
                          </div>
                        ) : (
                          <button onClick={postCategorias} className="btnAgg text-white font-bold py-1 px-3 rounded ">
                            Crear Categoría
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
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles de la Categoría</p>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-2 gap-4">
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input label="ID" className="Id" value={id} readOnly />
                    <Input label="Nombre" value={nombre} readOnly />
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
            <SquaresPlusIcon className="h-6 w-6 me-2" /> Crear Categoria
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Categoría
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-5">
          <table className="w-full min-w-[620px] table-auto">
            <thead>
              <tr>
                {["Id", "Nombre de la Categoría", "Estado","Funciones"].map((el) => (
                  <th key={el} className="border-b border-blue-indigo-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentCategorias.map((user) => (
                <tr key={user.IdCategoria}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.IdCategoria}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreCategoria}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {user.Estado ? (
                      <button onClick={() => {confirmarEstado(user.IdCategoria)}} className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full">Activo</button>
                    ) : (
                      <button onClick={() => {confirmarEstado(user.IdCategoria)}} className="bg-pink-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full">Inactivo</button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-0 px-1">
                    <button onClick={() => { editar(user) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500">
                      <PencilSquareIcon />
                    </button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500" onClick={() => deleteCategoria(user.IdCategoria)}>
                      <TrashIcon />
                    </button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500" onClick={() => { visualizar(user) }}>
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
            {[...Array(Math.ceil(filteredCategorias.length / categoriasPerPage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                </button>
              </li>
            ))}
            {currentPage < filteredCategorias.length / categoriasPerPage ? <button onClick={() =>
              currentPage < filteredCategorias.length / categoriasPerPage ? paginate(currentPage + 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronRightIcon className="w-6 h-6" />
            </button> : null}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
export default Categorias;
