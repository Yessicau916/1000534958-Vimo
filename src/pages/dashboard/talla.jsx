import React, { Fragment, useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody, Input, Button, Switch } from "@material-tailwind/react";
import Axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { PencilSquareIcon, TrashIcon, EyeIcon, QueueListIcon,UserPlusIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export function Tallas() {
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

  const [tallasList, setTallasList] = useState([]);
  const [open, setOpen] = useState(false);
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [visualizarTalla, setVisualizarTalla] = useState(null);
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(true);
  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);
  const [errorNombre, setErrorNombre] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ver, setVer] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tallasPerPage] = useState(3);

  const URLTallas = "http://localhost:8080/api/tallas";

  const getTallas = async () => {
    try {
      const resp = await Axios.get(URLTallas);
      setTallasList(resp.data.tallas);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const empty = () => {
    setVer(true);
    setNombre("");
    setEstado(true);
    setEdit(false);
  }

  useEffect(() => {
    getTallas();
  }, []);

  const postTalla = () => {
    setErrorNombre(true);

    // Validación de campo vacío
    if (!nombre) {
      showAlert("error", "Ingrese un nombre");
      setErrorNombre(false);
      return;
    }
  
    // Validación de caracteres especiales
    if (!/^[a-zA-Z0-9]+$/.test(nombre)) {
      showAlert("error", "El nombre solo puede contener letras y números, sin caracteres especiales");
      setErrorNombre(false);
      return;
    }
  
    // Validación de nombre duplicado
    const existingNombre = tallasList.some((talla) => talla.NombreTalla === nombre);
  
    if (existingNombre) {
      showAlert("error", "Ya existe una talla con ese nombre, intenta con otro");
      setErrorNombre(false);
      return;
    }
   else {
      showAlert("success", "Talla registrada con éxito!");
      Axios.post(URLTallas, {
        NombreTalla: nombre,
        Estado: estado
      }).then(() => {
        getTallas();
        setOpen(false);
        empty();
      }).catch((error) => {
        console.log(error);
        console.log(getTallas);
      });
    }
  };

  const editar = (val) => {
    setOpen(true);
    setVer(true);
    setEdit(true);
    setErrorNombre(true);
    setId(val.IdTalla);
    setNombre(val.NombreTalla);
    setEstado(val.Estado);
  }

  const putTalla = () => {
    setErrorNombre(true);
  
  // Validación de campo vacío
  if (!nombre) {
    showAlert("error", "Ingrese un nombre para la talla");
    setErrorNombre(false);
    return;
  }

  // Validación de caracteres especiales
  if (!/^[a-zA-Z0-9]+$/.test(nombre)) {
    showAlert("error", "El nombre solo puede contener letras y números, sin caracteres especiales");
    setErrorNombre(false);
    return;
  }

  // Validación de nombre duplicado
  const existingNombre = tallasList.some((talla) => talla.NombreTalla === nombre && talla.IdTalla !== id);

  if (existingNombre) {
    showAlert("error", "Ya existe una talla con ese nombre, intenta con otro");
    setErrorNombre(false);
    return;
  }
  
    Axios.put(URLTallas, {
      IdTalla: id,
      NombreTalla: nombre,
      Estado: estado
    })
      .then(() => {
        showAlert("success", "Talla editada con éxito!");
        getTallas();
        setOpen(false);
        setEdit(false);
        empty();
      })
      .catch((error) => {
        console.log(error);
        showAlert("error", "Hubo un error al editar la talla, inténtalo de nuevo");
      });
  };
  

  const deleteTalla = (idTalla) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar esta talla?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla!'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(URLTallas + `/${idTalla}`)
          .then(() => {
            getTallas();
            Swal.fire(
              'Eliminada!',
              'La talla ha sido eliminada.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar la talla");
          });
      }
    });
  };

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
    
    let est = tallasList.some((user) => (user.IdTalla === id && user.Estado))
    if (est) {
      est = false;
    } else {
      est = true;
    }
    const user = tallasList.find((user) => (user.IdTalla === id))
    Axios.put(URLTallas, {
      IdTalla: id,
      Estado: est,
      Nombre: user.NombreTalla,
    }).then(() => {
    showAlert("success", "Estado modificado.");
    getTallas();
    setOpen(false);
  }).catch((error) => {
    console.log(error);
    showAlert("error", "Error al modificar el estado.");
  });
}

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTallas = tallasList.filter((talla) => {
    return Object.values(talla).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const visualizar = (talla) => {
    setVisualizarTalla(talla);
    setOpenVisualizar(true);
    setVer(true);
    setEdit(true);
    setId(talla.IdTalla);
    setNombre(talla.NombreTalla);
    setEstado(talla.Estado);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastTalla = currentPage * tallasPerPage;
  const indexOfFirstTalla = indexOfLastTalla - tallasPerPage;
  const currentTallas = filteredTallas.slice(indexOfFirstTalla, indexOfLastTalla);

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
                        {edit ? ("Editar Talla") : ("Crear Talla")}
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-7 pt-0 pb-8">
                      <div className="grid grid-cols-1">
                        
                        <div className="col-span-1">
                          <Input
                            label="Nombre"
                            value={nombre}
                            onChange={
                              (event) => setNombre(event.target.value)} />
                        </div>
                        
                        </div>
                        <div className="flex justify-end items-center mt-3">
                        {edit ? (
                          <div>
                            {/* <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                              Volver
                            </button> */}
                            <button onClick={putTalla} className="btnAgg text-white font-bold py-2 px-3 rounded">
                              Editar Talla
                            </button>
                          </div>
                        ) : (
                          <button onClick={postTalla} className="btnAgg text-white font-bold py-1 px-3 rounded ">
                            Crear Talla
                          </button>
                        )}
                        <button onClick={(e) => {setOpen(false);
                            empty();}} className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded ms-2">
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
                <div className="px-3 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Card className="">
                    <CardHeader variant="gradient" className=" p-6 gradiente-lila-rosado">
                      <Typography variant="h6" color="white">
                        Visualizar
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-2 pt-0 pb-1">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            
            
            <div className="grid grid-cols-1 gap- mt-0">
              <Input label="Nombre" value={nombre} readOnly />
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
            <QueueListIcon className="h-6 w-6 me-2" />Crear Talla
          </Button>
        </div>
      </div>

      <Card>
        
        <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Tallas 
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-5">
        <table className="w-full min-w-[620px] table-auto">
            <thead>
              <tr>
                {[ "Nombre", "Estado", "Funciones"].map((el) => (
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
              {currentTallas.map((user) => (
                <tr key={user.IdTalla}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreTalla}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {user.Estado ? (
                      <button onClick={() => {confirmarEstado(user.IdTalla)}} className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full">Activo</button>
                    ) : (
                      <button onClick={() => {confirmarEstado(user.IdTalla)}} className="bg-pink-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full">Inactivo</button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-0 px-1">
                    <button onClick={() => { editar(user) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500" onClick={() => deleteTalla(user.IdTalla)}><TrashIcon /></button>
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
            {[...Array(Math.ceil(filteredTallas.length / tallasPerPage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                </button>
              </li>
            ))}
            {currentPage < filteredTallas.length / tallasPerPage ? <button onClick={() =>
              currentPage < filteredTallas.length / tallasPerPage ? paginate(currentPage + 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronRightIcon className="w-6 h-6" />
            </button> : null}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
