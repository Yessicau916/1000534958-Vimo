import React, { Fragment, useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody, Input, Button } from "@material-tailwind/react";
import Axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
//iconos
import { PencilSquareIcon, TrashIcon, EyeIcon, ShoppingCartIcon, SquaresPlusIcon, CurrencyDollarIcon, } from "@heroicons/react/24/solid";
import { EyeSlashIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate, } from 'react-router-dom';
export function Pedidos() {

  const navigate = useNavigate();
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
  const [ventasList, setVentasList] = useState([]);
  const [usuariosList, setUsuariosList] = useState([]);
  const [productosList, setProductosList] = useState([]);
  const [open, setOpen] = useState(false);

  // Estado para controlar el modal de visualización
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [visualizarCategoria, setVisualizarCategoria] = useState(null);

  //se crean variables en las que se guardan los datos de los input
  const [selectedEstadoPago, setSelectedEstadoPago] = useState("");
  const [nuevoEstadoPago, setNuevoEstadoPago] = useState("");


  const [numeroVenta, setNumeroVenta] = useState("");
  const [fecha, setFecha] = useState("");
  const [estadoPago, setEstadoPago] = useState("");
  const [usuario, setUsuario] = useState("");
  const [montoAdeudado, setMontoAdeudado] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [valorVenta, setValorVenta] = useState("");
  const [valorTotal, setValorTotal] = useState("");

  const [totalAbonos, setTotalAbonos] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  const [showEstadoModal, setShowEstadoModal] = useState(false)

  //Variables para el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //apis
  const URLPedidos = "http://localhost:8080/api/ventapedido";
  const URLUsuario = "http://localhost:8080/api/usuarios";
  const URLProducto = "http://localhost:8080/api/productos";
  const URLAbonos = "http://localhost:8080/api/abonos";

  //metodos o endpoints get
  const getPedidos = async () => {
    try {
      const resp = await Axios.get(URLPedidos);
      setVentasList(resp.data.ventapedido);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  };

  const getUsuarios = async () => {
    try {
      const resp = await Axios.get(URLUsuario);
      setUsuariosList(resp.data.usuarios);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }

  }
  const getProductos = async () => {
    try {
      const resp = await Axios.get(URLProducto);
      setProductosList(resp.data.productos);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const empty = () => {
    setVer(true)
    setNumeroVenta("")
    setFecha("")
    setEstado("")
    setEstadoPago("")
    setMontoAdeudado("")
    setCantidad("")
    setValorVenta("")
    setValorTotal("")
    setEdit(false);
  }

  useEffect(() => {
    getPedidos();
    getProductos();
    getUsuarios();

  }, []);

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
        switchEstado(id, selectedEstadoPago);
      }
    });
  };

  // En la función switchEstado
  const switchEstado = (id) => {
    // Buscar la pedido con el ID proporcionado
    const user = ventasList.find((user) => user.IdVentaPedido === id);

    // Verificar si se encontró la pedido
    if (user) {
      // Cambiar el estado
      let est = user.Estado ? false : true;

      // Realizar la actualización del estado en el backend
      Axios.put(URLPedidos, {
        IdVentaPedido: id,
        Estado: est,
      })
        .then(() => {
          showAlert("success", "Estado modificado.");
          getPedidos();
          setOpen(false);
        })
        .catch((error) => {
          console.log(error);
          showAlert("error", "Error al modificar el estado.");
        });
    } else {
      // Si no se encontró la pedido, mostrar un mensaje de error
      showAlert("error", "Pedido no encontrada.");
    }
  };

  const [estadoPagado, setEstadoPagado] = useState(false);

  // Función para confirmar el cambio de estado de pago
  const confirmarCambioEstadoPago = (id, nuevoEstadoPago) => {
    Swal.fire({
      title: 'Cambiar Estado de Pago',
      text: `¿Está seguro de cambiar el estado de pago de este pedido a "${nuevoEstadoPago}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar estado de pago'
    }).then((result) => {
      if (result.isConfirmed) {
        setId(id);
        if (nuevoEstadoPago === "Pagado") {
          setEstadoPagado(true);
          const pedido = ventasList.find(vl => vl.IdVentaPedido === id)?.MontoAdeudado;
          setTotalAbonos(pedido);
        }
        setNuevoEstadoPago(nuevoEstadoPago);
        // Realizar el cambio de estado de pago
        setShowEstadoModal(true);
      }
    });
  };
  function crearAbono() {
    const pedido = ventasList.find(vl => vl.IdVentaPedido === id);
    if (totalAbonos <= 0) { return showAlert("error", "Valor no válido."); }
    if (totalAbonos <= pedido.MontoAdeudado && nuevoEstadoPago === "Pagado") {
      cambiarEstadoPago(id, nuevoEstadoPago);
      Axios.post(URLAbonos, {
        IdVentaPedido: pedido.IdVentaPedido,
        ValorAbonado: totalAbonos,
        Fecha: pedido.Fecha,
        IdUsuario: pedido.IdUsuario,
        recibo: "reciboFile"
      }).then(() => {
        Swal.fire({
          icon: "success",
          title: "Estado de pago cambiado exitosamente",
          text: `El abono de $${totalAbonos} se registró exitosamente`,
          showConfirmButton: false,
          timer: 6000
        });
        setTimeout(() => {
          getPedidos();
        }, 500);
      })
    } else if (totalAbonos < pedido.MontoAdeudado && nuevoEstadoPago === "Abonado") {
      cambiarEstadoPago(id, nuevoEstadoPago);
      Axios.post(URLAbonos, {
        IdVentaPedido: pedido.IdVentaPedido,
        ValorAbonado: totalAbonos,
        Fecha: pedido.Fecha,
        IdUsuario: pedido.IdUsuario,
        recibo: "reciboFile"
      }).then(() => {
        Swal.fire({
          icon: "success",
          title: "Estado de pago cambiado exitosamente",
          text: `El abono de $${totalAbonos} se registró exitosamente`,
          showConfirmButton: false,
          timer: 6000
        });
        setTimeout(() => {
          getPedidos();
        }, 500);
      })
    } else if (totalAbonos >= pedido.MontoAdeudado && nuevoEstadoPago === "Abonado") {
      showAlert("error", "El abono debe ser menor a la deuda.");
    } else {
      showAlert("error", "El abono no puede ser mayor a la deuda.");
    }
    setEstadoPagado(false);
    setShowEstadoModal(!showEstadoModal);
  }

  // Función para cambiar el estado de pago
  const cambiarEstadoPago = (id, nuevoEstadoPago) => {
    const pedido = ventasList.find((pedido) => pedido.IdVentaPedido === id);
    if (pedido) {
      Axios.put(`${URLPedidos}/${pedido.IdVentaPedido}`, {
        IdVentaPedido: id,
        EstadoPago: nuevoEstadoPago
      })
        .then(() => {
          showAlert("success", "Estado de pago modificado exitosamente.");
          setTimeout(() => {
            getPedidos();
          }, 500);
        })
        .catch((error) => {
          console.log(error);
          showAlert("error", "Error al modificar el estado de pago.");
        });
    } else {
      return showAlert("error", "Pedido no encontrado.");
    }
  };

  // Función para mostrar/ocultar el modal de abonos
  const toggleAbonoModal = () => {
    setEstadoPagado(false);
    setTotalAbonos("")
    setShowEstadoModal(!showEstadoModal);
  };

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVentas = ventasList.filter((venta) => {
    return venta.EstadoPago === "Pendiente"
  }).filter((venta) => {
    const searchTermLowerCase = searchTerm.toLowerCase();

    return Object.values(venta).some((value) => {
      const textValue = typeof value === 'boolean' ? (value ? 'activo' : 'inactivo') : value.toString().toLowerCase();
      return textValue.includes(searchTermLowerCase);
    });
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
    handleShow();
    setId(vis.IdVentaPedido);
    setNumeroVenta(vis.NumeroVentaPedido);
    setFecha(vis.Fecha);
    setEstadoPago(vis.EstadoPago);
    setUsuario(vis.IdUsuario);
    setMontoAdeudado(vis.MontoAdeudado);
    setProducto(vis.IdProducto);
    setCantidad(vis.Cantidad);
    setValorVenta(vis.ValorVenta);
    setValorTotal(vis.ValorTotal);
  };

  // Estados para el paginado
  const [currentPage, setCurrentPage] = useState(1);
  const [ventasPerPage] = useState(3); // Número de categorías por página

  // Función para manejar el cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calcula las categorías para la página actual
  const indexOfLastVentas = currentPage * ventasPerPage;
  const indexOfFirstVentas = indexOfLastVentas - ventasPerPage;
  const currentVentas = filteredVentas.slice(indexOfFirstVentas, indexOfLastVentas);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
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
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles de la Pedido</p>
                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="grid grid-cols-2 gap-4">
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Input label="Id" value={id} readOnly />
                      <Input label="Número de Pedido" value={numeroVenta} readOnly />
                      <Input label="Estad de Pago" value={estadoPago} readOnly />
                      <Input label="Cliente" value={usuario} readOnly />
                      <Input label="Monto Adeudado" value={montoAdeudado} readOnly />
                      <Input label="Producto" value={producto} readOnly />
                      <Input label="Cantidad" value={cantidad} readOnly />
                      <Input label="Valor de la pedido" value={valorVenta} readOnly />
                      <Input label="Valor Total" value={valorTotal} readOnly />
                    </div>
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

      {/* Modal de abonos */}
      {showEstadoModal && (
        <Transition.Root show={showEstadoModal} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={toggleAbonoModal}>
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
                <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-800 bg-opacity-50" />
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
                    <h3 className="text-lg font-medium leading-6 text-indigo-900">Crear Abono</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Complete los detalles del abono</p>
                  </div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Input
                          label="Valor Abonado"
                          type="number"
                          readOnly={estadoPagado}
                          value={totalAbonos}
                          onChange={(e) => setTotalAbonos(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          label="Recibo"
                          type="file"
                          onChange={(e) => setReciboFile(e.target.files[0])} />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      onClick={() => crearAbono()}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Crear Abono
                    </button>
                    <button
                      onClick={() => toggleAbonoModal()}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}

      <div className="md:flex-row md:items-center md:justify-between grid grid-cols-5 ml-auto ">
        <div className="md:flex md:items-center col-span-4">
          <Input
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className=" md:mt-0 md:ml-4 col-span-1 mr-auto">
          <Button className=" btnAgg px-3 py-2 flex items-center border" onClick={() => navigate('../detallePedido')}>
            <ShoppingCartIcon className="h-6 w-6 me-2" /> Crear pedido
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Pedido
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-5">
          <table className="w-full min-w-[620px] table-auto">
            <thead>
              <tr>
                {["Numero Pedido", "Cliente", "Estado de Pago", "Estado", "Monto Adeudado", "Valor Total", "Funciones"].map((el) => (
                  <th key={el} className="border-b border-blue-indigo-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentVentas.map((user) => (
                user.EstadoPago === "Pendiente" && (
                  <tr key={user.IdVentaPedido}>
                    <td className="border-b border-blue-gray-50 py-3 px-5">{user.NumeroVentaPedido}</td>
                    <td className="border-b border-blue-gray-50 py-3 px-5">{user.IdUsuario}</td>
                    <td className="border-b border-blue-gray-50 py-3 px-5">
                      <select
                        className={`bg-transparent border rounded-full px-4 py-2 text-white ${user.EstadoPago === "Pendiente" ? "bg-[rgb(207,27,27)] hover:bg-red-700" :
                          user.EstadoPago === "Pagado" ? "bg-green-700 hover:bg-green-800" :
                            user.EstadoPago === "Abonado" ? "bg-orange-700 hover:bg-orange-800" : ""
                          }`}
                        value={user.EstadoPago}
                        onChange={(e) => {
                          confirmarCambioEstadoPago(user.IdVentaPedido, e.target.value);
                        }} >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagado">Pagado</option>
                        <option value="Abonado">Abonado</option>
                      </select>
                    </td>
                    <td className="border-b border-blue-gray-50 py-3 px-5">
                      {user.Estado ? (
                        <button onClick={() => { confirmarEstado(user.IdVentaPedido) }} className="bg-green-600/80 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full">Activo</button>
                      ) : (
                        <button onClick={() => { confirmarEstado(user.IdVentaPedido) }} className="bg-red-400/90 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full">Inactivo</button>
                      )}
                    </td>
                    <td className="border-b border-blue-gray-50 py-3 px-5">{user.MontoAdeudado}</td>
                    <td className="border-b border-blue-gray-50 py-3 px-5">{user.Total}</td>
                    <td className="border-b border-blue-gray-50 py-0 px-1">
                      <button className="text-xs font-semibold btnFunciones h-4 w-5 text-gray-500" onClick={() => { visualizar(user) }}>
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                )
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
            {[...Array(Math.ceil(filteredVentas.length / ventasPerPage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                </button>
              </li>
            ))}
            {currentPage < filteredVentas.length / ventasPerPage ? <button onClick={() =>
              currentPage < filteredVentas.length / ventasPerPage ? paginate(currentPage + 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronRightIcon className="w-6 h-6" />
            </button> : null}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
export default Pedidos;
