import React, { Fragment, useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody, Input, Button } from "@material-tailwind/react";
import Axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
//iconos
import { PencilSquareIcon, TrashIcon, EyeIcon, BanknotesIcon,PhotoIcon,CubeIcon  } from "@heroicons/react/24/solid";
import { EyeSlashIcon ,ChevronRightIcon,ChevronLeftIcon} from "@heroicons/react/24/outline";

export function Abonos() {
  //funcion para las alertas
  function showAlert(icon = "success", title) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
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

  const [abonosList, setAbonosList] = useState([]);
  const [ventaPedidoList, setVentaPedidoList] = useState([]);
  const [usuarioList, setUsuarioList] = useState([]);
  const [open, setOpen] = useState(false);
  
  // Estado para controlar el modal de visualización
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [visualizarProducto, setVisualizarAbono] = useState(null);

  //se crean variables en las que se guardan los datos de los input
  
  const [valorAbonado, setValorAbonado] = useState("");
  const [fecha, setFecha] = useState("");
  const [ventaPedido, setVentaPedido] = useState("");
  const [usuario, setUsuario] = useState("");
  const [recibo, setRecibo] = useState("");

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
  const URLAbonos = "http://localhost:8080/api/abonos";
  const URLVentaPedido = "http://localhost:8080/api/ventapedido";
  const URLUsuario = "http://localhost:8080/api/usuarios";

  //metodos o endpoints get

  const getAbonos = async () => {
    try {
      const resp = await Axios.get(URLAbonos);
      setAbonosList(resp.data.abonos);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const getVentaPedido = async () => {
    try {
      const resp = await Axios.get(URLVentaPedido);
      setVentaPedidoList(resp.data.ventapedido);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const getUsuarios = async () => {
    try {
      const resp = await Axios.get(URLUsuario, {
        params: {
          rol: 3
        }
      });
      setUsuarioList(resp.data.usuarios);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }
  console.log(getUsuarios)
  
  

  const empty = () => {
    setVer(true)
    setValorAbonado("")
    setFecha("")
    setRecibo("")
    setUsuario(0)
    setVentaPedido(0)
    setEdit(false);
  }

  useEffect(() => {
    getAbonos();
    getVentaPedido();
    getUsuarios();
  }, []);

  const [errorValorAbonado, setErrorValorAbonado] = useState(true);
  const [errorFecha, setErrorFecha] = useState(true);
  const [errorventaPedido, setErrorVentaPedido] = useState(true);
  const [errorRecibo, setErrorRecibo] = useState(true);
  const [errorUsuario, setErrorUsuario] = useState(true);

  //post
  const postAbonos = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorValorAbonado(true);
    setErrorFecha(true);
    setErrorVentaPedido(true);
    setErrorUsuario(true);
    setErrorRecibo(true);
  
    // Validación de los campos
    if (!valorAbonado || isNaN(valorAbonado) || Number(valorAbonado) <= 0) {
      showAlert("error", "Ingrese un valor de abono válido y positivo.");
      setErrorValorAbonado(false);
    } else if (!fecha) {
      showAlert("error", "Ingrese una fecha.");
      setErrorFecha(false);
    } else if (ventaPedido === 0) {
      showAlert("error", "Seleccione primero una venta.");
      setErrorVentaPedido(false);
    } else if (usuario === 0) {
      showAlert("error", "Seleccione primero un cliente.");
      setErrorUsuario(false);
    } else {
      showAlert("success", "Abono registrado con éxito.");
      Axios.post(URLAbonos, {
        ValorAbonado: valorAbonado,
        Fecha: fecha,
        IdVentaPedido: ventaPedido,
        IdUsuario: usuario,
        Recibo: recibo,
      })
        .then(() => {
          getAbonos();
          setEdit(false);
          empty();
          setOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  
  //put

  //llamar las variables 
 // Función para editar un abono
const editar = (val) => {
  setOpen(true);
  setEdit(true);
  setId(val.IdAbono);
  setValorAbonado(val.ValorAbonado);
  setFecha(val.Fecha);
  setVentaPedido(val.IdVentaPedido);
  setUsuario(val.IdUsuario);
  setRecibo(val.Recibo);
};


  const putAbonos = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorValorAbonado(true);
    setErrorFecha(true);
    setErrorVentaPedido(true);
    setErrorUsuario(true);
    setErrorRecibo(true);
  
    // Validación de los campos
    if (!valorAbonado || isNaN(valorAbonado) || Number(valorAbonado) <= 0) {
      showAlert("error", "Ingrese un valor de abono válido y positivo.");
      setErrorValorAbonado(false);
    } else if (!fecha) {
      showAlert("error", "Ingrese una fecha.");
      setErrorFecha(false);
    } else if (ventaPedido === 0) {
      showAlert("error", "Seleccione primero una venta.");
      setErrorVentaPedido(false);
    } else if (usuario === 0) {
      showAlert("error", "Seleccione primero un cliente.");
      setErrorUsuario(false);
    } else {
      showAlert("success", "Abono actualizado con éxito.");
      Axios.put(URLAbonos, {
        ValorAbonado: valorAbonado,
        Fecha: fecha,
        IdVentaPedido: ventaPedido,
        IdUsuario: usuario,
        Recibo: recibo,
      })
        .then(() => {
          getAbonos();
          setEdit(false);
          empty();
          setOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  
// Estado para el término de búsqueda
const [searchTerm, setSearchTerm] = useState("");

// Función para manejar la búsqueda
const handleSearch = (event) => {
  setSearchTerm(event.target.value);
};

const filteredAbonos = abonosList.filter((user) => {
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
  setVisualizarAbono(vis);
  setOpenVisualizar(true);
  setVer(true);
  setEdit(true);
  setErrorValorAbonado(true);
  setErrorFecha(true);
  setErrorVentaPedido(true);
  setErrorUsuario(true);
  setErrorRecibo(true);
  handleShow();
  setId(vis.IdAbono)
  setValorAbonado(vis.ValorAbonado)
  setFecha(vis.Fecha)
  setVentaPedido(vis.IdVentaPedido)
  setUsuario(vis.IdUsuario)
  setRecibo(vis.Recibo) 

};

// Estados para el paginado
const [currentPage, setCurrentPage] = useState(1);
const [abonosPerPage] = useState(3); // Número de categorías por página

// Función para manejar el cambio de página
const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Calcula las categorías para la página actual
const indexOfLastAbonos = currentPage * abonosPerPage;
const indexOfFirstAbonos = indexOfLastAbonos - abonosPerPage;
const currentAbonos = filteredAbonos.slice(indexOfFirstAbonos, indexOfLastAbonos);





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
      <CardHeader variant="gradient" className="mb-4 p-5 gradiente-lila-rosado">
        <Typography variant="h6" color="white">
          {edit ? "Editar Abono" : "Crear Abono"}
        </Typography>
      </CardHeader>
      <CardBody className="px-2 pt-0 pb-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Valor del abono"
            value={valorAbonado}
            type="float"
            onChange={(event) => setValorAbonado(event.target.value)} />
          
          <div className="col-span-1">
  <label htmlFor="venta" className="block text-sm font-medium text-gray-700">
  </label>
  <select
    id="venta"
    value={ventaPedido}
    onChange={(event) => setVentaPedido(event.target.value)}
    className="block w-full pt-4  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ">
    <option value={0}>Seleccione una Venta</option>
    {ventaPedidoList.map((venta) => (
      <option key={venta.IdVentaPedido} value={venta.IdVentaPedido}>
        {venta.NumeroVentaPedido}
      </option>
    ))}
  </select>
</div>
          <Input
            label="Fecha"
            value={fecha}
            type="date"
            onChange={(event) => setFecha(event.target.value)} />
        <select
  id="usuario"
  value={usuario}
  onChange={(event) => setUsuario(event.target.value)}
  className="block w-full pt-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
>
  <option value={0}>Seleccione un cliente</option>
  {usuarioList
    .filter((usuario) => usuario.IdRol === 3) // Filtrar usuarios con rol 3
    .map((usuario) => (
      <option key={usuario.IdUsuario} value={usuario.IdUsuario}>
        {usuario.Nombre}
      </option>
    ))}
</select>

          <div className="col-span-1 flex flex-col items-center justify-center">
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
              Recibo
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="h-6 w-6 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Subir Imagen</span></p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">o arrastrar y soltar <br /> (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center mt-3">
          {edit ? (
            <button onClick={putAbonos} className="btnAgg text-white font-bold py-1 px-3 rounded">
              Editar Abono
            </button>
          ) : (
            <button onClick={postAbonos} className="btnAgg text-white font-bold py-1 px-3 rounded">
              Crear abono
            </button>
          )}
          <button onClick={(e) => {setOpen(false); empty();}} className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-3 rounded ms-1">
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
                      <div className="grid grid-cols-2 gap-4 mt-4">
                      <Input label ="Id" value={id} readOnly />
                      <Input label="Valor Abonado" value={valorAbonado} readOnly />
                      <Input label="Fecha" value={fecha} readOnly />
                      <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                      <label htmlFor="venta" className="block text-sm font-medium text-gray-700">
                      </label>
                      <select
                        id="venta"
                        value={ventaPedido}
                        disabled
                        onChange={(event) => setVentaPedido(event.target.value)}
                        className="block w-full pt-4  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ">
                        <option value={0}>Seleccione una Venta</option>
                        {ventaPedidoList.map((venta) => (
                          <option key={venta.IdVentaPedido} value={venta.IdVentaPedido}>
                            {venta.NumeroVentaPedido}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="venta" className="block text-sm font-medium text-gray-700">
                      </label>
                      <select
                        id="venta"
                        value={ventaPedido}
                        disabled
                        onChange={(event) => setVentaPedido(event.target.value)}
                        className="block w-full pt-4  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ">
                        <option value={0}>Seleccione una Venta</option>
                        {ventaPedidoList.map((venta) => (
                          <option key={venta.IdVentaPedido} value={venta.IdVentaPedido}>
                            {venta.NumeroVentaPedido}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
                      </label>
                      <select
                        id="usuario"
                        value={usuario}
                        disabled
                        onChange={(event) => setUsuario(event.target.value)}
                        className="block w-full pt-4  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ">
                        <option value={0}>Seleccione un cliente</option>
                        {usuarioList.map((usuario) => (
                          <option key={usuario.IdUsuario} value={usuario.IdUsuario}>
                            {usuario.Nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    </div>
                      <Input label="Recibo" value={recibo} readOnly />
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
                      </CardBody>
                    </Card>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
  
      <div className="md:flex-row md:items-center md:justify-between grid grid-cols-4 ml-auto ">
        <div className="md:flex md:items-center col-span-3">
          <Input
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className=" md:mt-0 md:ml-4 col-span-1 mr-auto">
          <Button className=" btnAgg px-3 py-2 flex items-center border" onClick={() => { setOpen(true), setEdit(false); }}>
            <BanknotesIcon className="h-6 w-6 me-2"/>Crear Abono
          </Button>
        </div>
      </div>
  
      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Abonos
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-5">
          <table className="w-full min-w-[620px] table-auto">
            <thead>
              <tr>
                {[ "Valor Abonado","Fecha","Venta","Cliente","Recibo", "Funciones"].map((el) => (
                  <th key={el} className="border-b border-blue-indigo-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentAbonos.map((user) => (
                <tr key={user.IdAbono}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.ValorAbonado}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Fecha}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {ventaPedidoList && ventaPedidoList.map((ventaPedido) => (
                      ventaPedido.IdVentaPedido == user.IdVentaPedido && ventaPedido.NumeroVentaPedido
                    ))}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {usuarioList && usuarioList.map((usuario) => (
                      usuario.IdUsuario == user.IdUsuario && usuario.Cedula // Aquí accedemos correctamente al nombre del usuario
                    ))}
                  </td>


                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Recibo}</td>
                  <td className="border-b border-blue-gray-50 py-0 px-1">
                    <button onClick={() => { editar(user) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500">
                      <PencilSquareIcon />
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
              {[...Array(Math.ceil(filteredAbonos.length / abonosPerPage)).keys()].map((number) => (
                <li key={number} className="cursor-pointer mx-1">
                  <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                  </button>
                </li>
              ))}
              {currentPage < filteredAbonos.length / abonosPerPage ? <button onClick={() =>
                currentPage < filteredAbonos.length / abonosPerPage ? paginate(currentPage + 1) : paginate(currentPage)
              } className='text-gray-400 py-1 '>
                <ChevronRightIcon className="w-6 h-6" />
              </button> : null}
            </ul>
        </CardBody>
      </Card>
    </div>
  );
}
export default Abonos;