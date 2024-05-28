import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, Input,
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from "@heroicons/react/24/solid";
import card from "@material-tailwind/react/theme/components/card";

export function DetalleCompra() {
  const navigate = useNavigate();

  // Estado
  const [numeroFactura, setNumeroFactura] = useState("");
  const [fecha, setFecha] = useState("");
  const [valorTotal, setValorTotal] = useState(0);
  const [proveedor, setProveedor] = useState("");
  const [producto, setProducto] = useState("");
  const [valorProductoUnitario, setValorProductoUnitario] = useState("");
  const [CantidadComprada, setCantidadComprada] = useState("");
  const [valorVenta, setValorVenta] = useState("");
  const [comprasTabla, setComprasTabla] = useState([]);
  const [productosList, setProductosList] = useState([]);
  const [comprasList, setComprasList] = useState([]);
  const [proveedoresList, setProveedoresList] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  // URL de las APIs
  const URLCompras = "http://localhost:8080/api/compras";
  const URLDetalleCompras = "http://localhost:8080/api/detallecompras";
  const URLProductos = "http://localhost:8080/api/productos";
  const URLProveedores = "http://localhost:8080/api/proveedores";


  const handleAgregarVenta = () => {
    if (!isLocked) {
      setIsLocked(true);
    }
    if (!proveedor || !producto || !valorProductoUnitario || !CantidadComprada || !valorVenta) {
      showAlert("error", "Por favor complete todos los campos");
      return;
    }
    const nuevoSubtotal = parseFloat(valorProductoUnitario) * parseFloat(CantidadComprada);
    setValorTotal(prevTotal => prevTotal + nuevoSubtotal);
    const nuevaCompra = {
      producto: producto,
      cantidad: CantidadComprada,
      valorxunidad: valorProductoUnitario,
      valortotal: nuevoSubtotal,
      valorVenta: valorVenta,
    };
    setComprasTabla([...comprasTabla, nuevaCompra]);
    showAlert("success", "Compra agregada a la tabla.");
    setValorTotal(valorTotal + nuevoSubtotal);
    console.log(comprasTabla)
  };

  const handleEliminarProducto = (idProducto , i) => {
    const productoAEliminar = comprasTabla.find((compra, index) => compra.producto === idProducto && index === i);
    const subtotalAEliminar = productoAEliminar.valortotal;
    delServ(idProducto);
    setValorTotal(prevTotal => prevTotal - subtotalAEliminar);
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
    setComprasTabla(comprasTabla.filter((comp) => comp.producto !== producto));
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(number);
  };


  const postCompra = () => {
    if (comprasTabla == "") {
      showAlert("error", "La tabla esta vacía");
      return;
    }
    showAlert("sucess", "Registro Compra");
    Axios.post(URLCompras, {
      IdProveedor: proveedor,
      NumeroFactura: numeroFactura,
      Fecha: fecha,
      Estado: true,
      ValorCompra: valorProductoUnitario,
      ValorVenta: valorVenta,
      ValorTotal: valorTotal,

    }).then(() => {
      showAlert("sucess", "Ventas registrada ");
      setProducto("")
      setNumeroFactura("")
      setFecha()
      setValorProductoUnitario()
      setValorVenta();
      setValorTotal(0)
      setComprasTabla([]);
      setTimeout(() => {
        postDetalleCompra(numeroFactura);
        setTimeout(() => {
          navigate("/dashboard/compras");
        }, 500);

      }, 500);

    })
  }

  const postDetalleCompra = (cod) => {
    Axios.get(`${URLCompras}/${cod}`).then((response) => {
      console.log(response.data)
      const numCompraNueva = response.data.numeroFactura;
      const id = numCompraNueva.find(cvn => cvn)?.IdCompra;
      showAlert("sucess", "Detalle de la compra registrado");
      comprasTabla.map(vt => (
        Axios.post(URLDetalleCompras, {
          IdCompra: id,
          IdProducto: vt.producto,
          ValorCompra: vt.ValorCompra,
          ValorVenta: vt.valorVenta,
          CantidadComprada: vt.cantidad
        }).catch((error) => {
          showAlert("error", "error al enviar el detalle");
          console.error("Error al enviar el detalle:", error)
        })
      ))
    })
  }
  // Efectos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comprasResponse, productosResponse, proveedoresResponse] = await Promise.all([
          Axios.get(URLCompras),
          Axios.get(URLProductos),
          Axios.get(URLProveedores)
        ]);
        setComprasList(comprasResponse.data.compras);
        setProductosList(productosResponse.data.productos);
        setProveedoresList(proveedoresResponse.data.proveedores);
      } catch (error) {
        showAlert("error", "Error al cargar los datos");
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

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

  return (
    <Card className="py-5 px-6 mt-4">
      <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
        <Typography variant="h6" color="white" className="flex justify-between items-center">
          Crear Compras
        </Typography>
      </CardHeader>
      <div className="mt-6 mb-2 gap-2 grid grid-cols-4">
        <Card className="col-span-1 gap-3 ">
          <CardBody className="px-0 pt-0 pl-2 pr-1 pb-1">
            <div className="gap-3 ">
              <h1 className="font-bold text-lg ">Información</h1>
              <div className="mt-2">
                <Input
                  label="Número de Factura"
                  value={numeroFactura}
                  onChange={(event) => setNumeroFactura(event.target.value)}
                  disabled={isLocked}
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Fecha"
                  type="date"
                  value={fecha}
                  onChange={handleDateChange}
                  inputProps={{ max: today }}
                />
              </div>
            </div>
            <div className="col-span grid-cols-2 gap-3 mt-2">
              <select
                value={proveedor}
                onChange={(event) => setProveedor(event.target.value)}
                className="block w-full h-10 border border-indigo-400 text-indigo-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 text-sm"
                disabled={isLocked}
              >
                <option value={0}>Seleccione un proveedor</option>
                {proveedoresList.map((proveedor) => (
                  <option key={proveedor.IdProveedor} value={proveedor.IdProveedor}>
                    {proveedor.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <h1 className="font-bold text-lg mt-3 ">Productos</h1>
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
                  value={valorProductoUnitario}
                  onChange={(event) => setValorProductoUnitario(event.target.value)}
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Cantidad Comprada"
                  value={CantidadComprada}
                  onChange={(event) => setCantidadComprada(event.target.value)}
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Valor Venta"
                  value={valorVenta}
                  onChange={(event) => setValorVenta(event.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center items-center mt-3">
              <button onClick={handleAgregarVenta} className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                Agregar
              </button>
            </div>
          </CardBody>
        </Card>
        <Card className="col-span-3 gap-3 ">
          <CardBody className="overflow-x-auto pt-0 pb-1">
            <h1 className="font-bold text-lg ">Lista de Productos</h1>
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
                    <Typography variant="small" className="text-[13px] font-bold uppercase text-blue-gray-400">V.Venta</Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[13px] font-bold uppercase text-blue-gray-400">V.Unitario</Typography>
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
                {comprasTabla.map((compra, index) => (
                  <tr key={index}>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {productosList.filter(p => p.IdProducto == compra.producto).map(p => p.NombreProducto)}
                      </div>
                    </td>
                    <td className="px-7 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{compra.cantidad}</div>
                    </td>
                    <td className="px-1 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${formatNumber(compra.valorVenta)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${formatNumber(compra.valorxunidad)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${formatNumber(compra.valortotal)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button onClick={() => handleEliminarProducto(compra.producto ,index)} className="text-red-600 hover:text-red-900 mr-2">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="border-t border-blue-gray-50 py-6 px-1 text-right font-bold uppercase text-blue-gray-400">
                    Total
                  </td>
                  <td className="border-t border-blue-gray-50 py-3 px-5 text-left font-bold uppercase text-blue-gray-400">
                    ${formatNumber(valorTotal)}
                  </td>
                  <td className="border-t border-blue-gray-50 py-3 px-5 text-left"></td>
                </tr>
              </tfoot>
            </table>
          </CardBody>
        </Card>
        <div className="flex justify-center items-center mt-3 col-span-4">
          <button onClick={postCompra} className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
            Crear Compra
          </button>
        </div>
      </div>
    </Card>
  );
};


export default DetalleCompra;
