import React, { useState, Fragment, useEffect } from "react";
import {
    Typography, Card, CardHeader, CardBody, Input, Checkbox
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from "@heroicons/react/24/solid";

export function DetalleVenta() {
    const navigate = useNavigate();

    // Estado
    const [numeroVentaPedido, setNumeroVentaPedido] = useState("");
    const [fecha, setFecha] = useState("");
    const [total, setTotal] = useState(0);
    const [usuario, setUsuario] = useState(0);
    const [producto, setProducto] = useState("");
    const [valorUnidad, setValorUnidad] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [montoAdeudado, setMontoAdeudado] = useState(0);
    const [totalAbonos, setTotalAbonos] = useState(0);
    const [detalleVentasTabla, setDetalleVentasTabla] = useState([]);
    const [productosList, setProductosList] = useState([]);
    const [ventasList, setVentasList] = useState([]);
    const [ventasList2, setVentasList2] = useState([]);
    const [usuariosList, setUsuariosList] = useState([]);
    const [isLocked, setIsLocked] = useState(false);
    const [reciboFile, setReciboFile] = useState(null);
    const [showAbonoModal, setShowAbonoModal] = useState(false); // Estado para mostrar/ocultar el modal


    // URL de las APIs
    const URLVentas = "http://localhost:8080/api/ventapedido";
    const URLDetalleVentas = "http://localhost:8080/api/detalleventapedido";
    const URLProductos = "http://localhost:8080/api/productos";
    const URLUsuarios = "http://localhost:8080/api/usuarios";
    const URLAbonos = "http://localhost:8080/api/abonos";

    // Efectos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ventasResponse, productosResponse, usuariosResponse] = await Promise.all([
                    Axios.get(URLVentas),
                    Axios.get(URLProductos),
                    Axios.get(URLUsuarios)
                ]);
                setVentasList(ventasResponse.data.ventas);
                setProductosList(productosResponse.data.productos);
                setUsuariosList(usuariosResponse.data.usuarios);
            } catch (error) {
                showAlert("error", "Error al cargar los datos");
                console.error("Error al cargar los datos:", error);
            }
        };
        fetchData();
        const getVentas = async () => {
            try {
                const resp = await Axios.get(URLVentas);
                setVentasList2(resp.data.ventapedido);
            } catch (error) {
                console.log("Error al obtener los datos: ", error);
            }
        }
        getVentas()
    }, []);

    //bloquear campos despues del primer producto
    const handleAgregarVenta = () => {
        if (!isLocked) {
            setIsLocked(true);  // Bloquear campos después de agregar el primer producto
        }
        if (!usuario || !producto || !valorUnidad || !cantidad || !fecha) {
            showAlert("error", "Por favor complete todos los campos");
            return;
        }
        const nuevoTotal = parseInt(valorUnidad) * parseInt(cantidad);
        const nuevaVenta = {
            producto: producto,
            cantidad: cantidad,
            valorxunidad: valorUnidad,
            valortotal: nuevoTotal,
        };
        setDetalleVentasTabla([...detalleVentasTabla, nuevaVenta]);
        showAlert("success", "Producto agregado a la tabla.");
        setTotal(prevTotal => prevTotal + nuevoTotal);
        setProducto(0);
        setValorUnidad(0);
        setCantidad(0);
    };

    // Función para mostrar/ocultar el modal de abonos
    const toggleAbonoModal = () => {
        setShowAbonoModal(!showAbonoModal);
    };

    const crearAbono = () => {
        if (totalAbonos <= 0) {
            return showAlert("error", "El abono no puede estar vacío ni negativo.");
        }
        toggleAbonoModal();
    }

    // Función para calcular el monto adeudado
    const calcularMontoAdeudado = () => {
        const montoAdeudado = total - (totalAbonos || 0); // Si no hay abonos, se considera cero
        setMontoAdeudado(montoAdeudado);
    };


    // Efecto para calcular el monto adeudado cada vez que cambia el total o los abonos
    useEffect(() => {
        calcularMontoAdeudado();
    }, [total, totalAbonos]);


    const handleEliminarProducto = (idProducto) => {
        const productoAEliminar = detalleVentasTabla.find(venta => venta.producto === idProducto);
        const subtotalAEliminar = productoAEliminar.valortotal;
        delServ(idProducto);
        setTotal(prevTotal => prevTotal - subtotalAEliminar);
    };

    // Funciones de utilidad
    const showAlert = (icon = "success", title, timer = 1500) => {
        Swal.fire({
            icon: icon,
            title: title,
            showConfirmButton: false,
            timer: timer,
        });
    };

    const delServ = (producto) => {
        setDetalleVentasTabla(detalleVentasTabla.filter((venta) => venta.producto !== producto));
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(number);
    };

    const postVenta = () => {
        if (detalleVentasTabla == "") {
            showAlert("error", "La tabla esta vacía");
            return;
        }
        showAlert("success", "Registrando venta.");
        Axios.post(URLVentas, {
            NumeroVentaPedido: numeroVentaPedido,
            Fecha: fecha,
            Estado: true,
            EstadoPago: montoAdeudado != 0 ? "Abonado" : "Cancelado",
            IdUsuario: usuario,
            MontoAdeudado: montoAdeudado,
            Total: total
        }).then(() => {
            showAlert("success", "Venta registrada.");
            if (totalAbonos < total) {
                const id = ventasList2.filter(vl => vl).map(vl => vl.IdVentaPedido).reverse()[0]
                setTimeout(() => {
                    Axios.post(URLAbonos, {
                        ValorAbonado: totalAbonos,
                        Fecha: fecha,
                        IdVentaPedido: id,
                        IdUsuario: usuario,
                        Recibo: ""
                    })
                }, 500);
                console.log("Abono registrado.")
            }
            setNumeroVentaPedido(0);
            setFecha("");
            setUsuario(0);
            setMontoAdeudado(0);
            setTotal(0);
            setTotalAbonos(0);
            setDetalleVentasTabla([]);
            setTimeout(() => {
                postDetalleVenta(numeroVentaPedido);
                setTimeout(() => {
                    navigate("/dashboard/ventas");
                }, 500);

            }, 500);

        })
    }

    const postDetalleVenta = (num) => {
        Axios.get(`${URLVentas}/${num}`).then((response) => {
            const numVent = response.data.ventapedido;
            const id = numVent.find(cvn => cvn)?.IdVentaPedido;
            showAlert("success", "Detalle de la compra registrado");
            detalleVentasTabla.map(dvt => (
                Axios.post(URLDetalleVentas, {
                    IdVentaPedido: id,
                    IdProducto: dvt.producto,
                    Cantidad: dvt.cantidad,
                    ValorVenta: valorUnidad,
                    ValorTotal: total,
                }).catch((error) => {
                    showAlert("error", "error al enviar el detalle");
                    console.error("Error al enviar el detalle:", error)
                })
            ))
        })
    }

    // Obtener la fecha actual en formato yyyy-mm-dd
    const today = new Date().toISOString().split('T')[0];

    // Función para manejar el cambio de fecha
    const handleDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        const today = new Date();

        if (selectedDate > today) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'No puedes seleccionar una fecha posterior al día actual.',
            });
        } else {
            setFecha(event.target.value);
        }
    };
    useEffect(() => {
        setNumeroVentaPedido(generarNumeroVenta());
    }, []);


    const generarNumeroVenta = () => {
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
        const numeroVentaExistente = ventasList.find(venta => venta.NumeroVentaPedido === numeroAleatorio);

        if (numeroVentaExistente) {
            return generarNumeroVenta();
        } else {
            return numeroAleatorio.toString();
        }
    };


    return (
        <Card className="py-5 px-6 mt-4">
            <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
                <Typography variant="h6" color="white" className="flex justify-between items-center">
                    Crear Venta
                </Typography>
            </CardHeader>
            <div className="mt-6 mb-2 gap-2 grid grid-cols-4">
                <Card className="col-span-1 gap-3">
                    <CardBody className="px-0 pt-0 pl-2 pr-1 pb-1">
                        <div className="gap-3">
                            <h1 className="font-bold text-lg">Información</h1>
                            <div className="mt-2">
                                <Input
                                    label="Número de Venta Pedido"
                                    value={numeroVentaPedido}
                                    onChange={(event) => setNumeroVentaPedido(event.target.value)}
                                    readOnly
                                />
                            </div>
                            <div className="mt-2">
                                <Input
                                    label="Fecha"
                                    type="date"
                                    value={fecha}
                                    onChange={handleDateChange}
                                    inputProps={{ max: today }}
                                    disabled={isLocked}
                                />
                            </div>
                        </div>
                        <div className="col-span grid-cols-2 gap-3 mt-2">
                            <select
                                value={usuario}
                                onChange={(event) => setUsuario(event.target.value)}
                                className="block w-full h-10 border border-indigo-400 text-indigo-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 text-sm"
                                disabled={isLocked}
                            >
                                <option value={0}>Seleccione un usuario</option>
                                {usuariosList.map((usuario) => (
                                    <option key={usuario.IdUsuario} value={usuario.IdUsuario}>
                                        {usuario.Nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h1 className="font-bold text-lg mt-3">Productos</h1>
                        <div className="col-span grid-cols-2 gap-3 mt-1">
                            <select
                                value={producto}
                                onChange={(event) => setProducto(event.target.value)}
                                className="block w-full h-10 border border-indigo-400 text-indigo-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 text-sm"
                            >
                                <option value={0}>Seleccione un producto</option>
                                {productosList.map((producto) => (
                                    <option key={producto.IdProducto} value={producto.IdProducto}>
                                        {producto.NombreProducto}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="gap-3 mt-2">
                            <div className="mt-1">
                                <Input
                                    label="Valor por Unidad"
                                    value={valorUnidad}
                                    onChange={(event) => setValorUnidad(event.target.value)}
                                />
                            </div>
                            <div className="mt-2">
                                <Input
                                    label="Cantidad"
                                    value={cantidad}
                                    onChange={(event) => setCantidad(event.target.value)}
                                />
                            </div>
                            <div className="mt-2">
                                <Input
                                    label="Monto Adeudado"
                                    value={montoAdeudado}
                                />
                            </div>
                        </div>
                        {/* Checkbox para abonar */}
                        <div className="flex items-center mt-2 col-span-4">
                            <Checkbox
                                onChange={toggleAbonoModal}
                                color="primary"
                                size="small"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700">Hacer un abono</label>
                        </div>
                        <div className="items-center mt-3 flex justify-end items">
                            <button onClick={handleAgregarVenta} className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                                Agregar
                            </button>
                        </div>
                    </CardBody>
                </Card>
                <Card className="col-span-3 gap-3">
                    <CardBody className="overflow-x-auto pt-0 pb-1">
                        <h1 className="font-bold text-lg">Lista de Productos</h1>
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    <th className="border-b border-blue-gray-50 py-1 px-2 text-left">
                                        <Typography variant="small" className="text-[13px] font-bold uppercase text-blue-gray-400">Producto</Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-1 text-left">
                                        <Typography variant="small" className="text-[13px] font-bold uppercase text-blue-gray-400">Cantidad</Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-1 text-left">
                                        <Typography variant="small" className="text-[13px] font-bold uppercase text-blue-gray-400">V. Unitario</Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
                                        <Typography variant="small" className="text-[13px] font-bold uppercase text-blue-gray-400">Subtotal</Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-1 text-left">
                                        <Typography variant="small" className="text-[13px] font-bold uppercase text-blue-gray-400">Acción</Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalleVentasTabla.map((venta, index) => (
                                    <tr key={index}>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {productosList.filter(p => p.IdProducto == venta.producto).map(p => p.NombreProducto)}
                                            </div>
                                        </td>
                                        <td className="px-7 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{venta.cantidad}</div>
                                        </td>
                                        <td className="px-1 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${formatNumber(venta.valorxunidad)}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">${formatNumber(venta.valortotal)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                            <button onClick={() => handleEliminarProducto(venta.producto)} className="text-red-600 hover:text-red-900 mr-2">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4" className="border-t border-blue-gray-50 py-6 px-1 text-right font-bold uppercase text-blue-gray-400">
                                        Total
                                    </td>
                                    <td className="border-t border-blue-gray-50 py-3 px-5 text-left font-bold uppercase text-blue-gray-400">
                                        ${formatNumber(detalleVentasTabla.reduce((total, venta) => total + venta.valortotal, 0))}
                                    </td>
                                    <td className="border-t border-blue-gray-50 py-3 px-5 text-left"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </CardBody>
                </Card>
            </div>
            <div className="flex justify-end items-center mt-3 col-span-4">
                <button onClick={postVenta} className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                    Crear Venta
                </button>
            </div>
            {/* Modal de abonos */}
            {showAbonoModal && (
                <Transition.Root show={showAbonoModal} as={Fragment}>
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
                                            {/* <div>
                                                <Input
                                                    label="Número de la venta"
                                                    value={numeroVentaPedido}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    label="Usuario"
                                                    value={usuario}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    label="Fecha"
                                                    type="date"
                                                    value={fecha}
                                                    readOnly
                                                />
                                            </div> */}
                                            <div className="col-span-2">
                                                <Input
                                                    label="Valor Abonado"
                                                    type="number"
                                                    value={totalAbonos}
                                                    onChange={(e) => setTotalAbonos(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    label="Recibo"
                                                    type="file"
                                                    onChange={(e) => setReciboFile(e.target.files[0])}
                                                />

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
        </Card>
    );
}

export default DetalleVenta;
