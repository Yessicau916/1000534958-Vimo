import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, IconButton,
  Menu, MenuHandler, MenuList, MenuItem, Avatar,
  Tooltip, Progress, Input, 
} from "@material-tailwind/react";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import Axios from "axios";
import Swal from 'sweetalert2';


//iconos
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/solid";

export function Pedidos() {
  //funcion para las alertas
   function showAlert(icon = "success", title) {
      const Toast = Swal.mixin({
         toast: true,
         position: "top-end",
         showConfirmButton: false,
         timer: 1500,
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

  const [comprasList, setComprasList] = useState([]);
  const [proveedoresList, setProveedoresList] = useState([]);

   //se crean variables en las que se guardan los datos de los input
  const [proveedor, setProveedor] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [fecha, setFecha] = useState("");
  const [valorTotal, setValorTotal] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  //apis
  const URLCompras = "http://localhost:8080/api/compras";
  const URLProveedores = "http://localhost:8080/api/proveedores";

  //metodos o endpoints get

  const getCompras = async () => {
    try {
      const resp = await Axios.get(URLCompras);
      setComprasList(resp.data.compras);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const getProveedores = async () => {
    try {
      const resp = await Axios.get(URLProveedores);
      setProveedoresList(resp.data.proveedores);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const empty =() =>{
    setProveedor(0)
    setNumeroFactura("")
    setFecha("")
    setValorTotal("")
  }

  useEffect(() => {
    getCompras();
    getProveedores();
  }, []);

  const [errorProveedor, setErrorProveedor] = useState(true);
  const [errorNumeroFactura, setErrorNumeroFactura] = useState(true);
   const [errorFecha, setErrorFecha] = useState(true);
   const [errorValorTotal, setErrorValorTotal] = useState(true);

   //post
   const postCompras = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorProveedor(true);
    setErrorNumeroFactura(true);
    setErrorFecha(true);
    setErrorValorTotal(true);
    
    // Validación de los campos
    if (proveedor == 0) {
      showAlert("error", "Seleccione un proveedor primero!");
      setErrorProveedor(false);
    } else if (!numeroFactura) {
      showAlert("error", "Ingrese un Numero de la factura!");
      setErrorNumeroFactura(false);
    } else if (!fecha) {
      showAlert("error", "Ingrese una fecha!");
      setErrorFecha(false);
    }  else if (!valorTotal) {
      showAlert("error", "Ingrese su nombreel valor total")
    
    } else {
      showAlert("success", "Compra registrado con éxito!");
      
      Axios.post(URLCompras, {
        IdProveedor: proveedor,
        numeroFactura: numeroFactura,
        Fecha: fecha,
        valorTotal: valorTotal,

      }).then(()=>{
        getCompras();
        empty();
      }).catch((error) => {
        console.log(error)
      })
    }
  };
//put

const putCompras = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorProveedor(true);
    setErrorNumeroFactura(true);
    setErrorFecha(true);
    setErrorValorTotal(true);
    
    // Validación de los campos
    if (proveedor == 0) {
      showAlert("error", "Seleccione un proveedor primero!");
      setErrorProveedor(false);
    } else if (!numeroFactura) {
      showAlert("error", "Ingrese un Numero de la factura!");
      setErrorNumeroFactura(false);
    } else if (!fecha) {
      showAlert("error", "Ingrese una fecha!");
      setErrorFecha(false);
    }  else if (!valorTotal) {
      showAlert("error", "Ingrese su nombreel valor total")
    
    } else {
      showAlert("success", "Compra registrado con éxito!");
      
      Axios.put(URLCompras, {
        IdProveedor: proveedor,
        numeroFactura: numeroFactura,
        Fecha: fecha,
        valorTotal: valorTotal,

      }).then(()=>{
        getCompras();
        empty();
      }).catch((error) => {
        console.log(error)
      })
    }
  };
  


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
                Crear una compra
            </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
            <div className="grid grid-cols-4 gap-3">
                <div className="col-span-">
                    <select 
                        label="Proveedor" 
                        value={proveedor}
                        onChange={(event) => setProveedor(event.target.value)}
                        className="block w-full h-10 border border-gray-400 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            <option value={0}>Seleccione un proveedor</option>
                            {proveedoresList.map((proveedor) => (
                            <option value={proveedor.IdProveedor}>
                                {proveedor.Nombre}
                            </option>
                            ))}
                    </select>
                </div>
                <div className="col-span-1">
                    <Input 
                    label="Numero Factura" 
                    value={numeroFactura} 
                    type="number"
                    onChange={
                        (event) => setNumeroFactura(event.target.value) 
                    }  />
                </div>
                <div className="col-span-1">
                    <Input 
                    label="Fecha" 
                    value={fecha}
                    type="date"
                    onChange={(event) => setFecha(event.target.value)} />
                </div>
                
                <div className="col-span-1">
                    <Input 
                    label="Valor Total" 
                    value={valorTotal}
                    onChange={(event) => setValorTotal(event.target.value)} />
                </div>
            </div>
        
            <div className="flex justify-center items-center mt-3">
                <button onClick={postCompras}className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                    Crear compra
                </button>
            </div>
        </CardBody>
        </Card>
        <Card>
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                <Typography variant="h6" color="white">
                    Compras
                </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
                <thead>
                    <tr>
                        {["Proveedor", "Numero Factura", "Fecha", "Valor total",  "Funciones"].map((el) => (
                        <th
                            key={el}
                            className="border-b border-blue-gray-50 py-3 px-5 text-left"
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
                    {comprasList.map((user) => (
                        <tr key={user.IdCompra}>
                        <td className="border-b border-blue-gray-50 py-3 px-5">{proveedoresList.map((proveedor) => (proveedor.IdProveedor == user.IdProveedor && proveedor.Nombre))}</td>
                        <td className="border-b border-blue-gray-50 py-3 px-5">{user.NumeroFactura}</td>
                        <td className="border-b border-blue-gray-50 py-3 px-5">{user.Fecha}</td>
                        <td className="border-b border-blue-gray-50 py-3 px-5">{user.ValorTotal}</td>
                        <td className="border-b border-blue-gray-50 py-3 px-5">
                            <button onClick={putCompras}  className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
                            <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><TrashIcon /></button>
                            <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><EyeIcon /></button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            </CardBody>
        </Card>
      
    </div>
  );
}
export default Pedidos;