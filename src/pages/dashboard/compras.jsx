import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, Input, Button
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';


import { useNavigate, } from 'react-router-dom';

import { PencilSquareIcon, EyeIcon, ShoppingBagIcon, ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";


export function Compras() {
  const navigate = useNavigate();
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

  const [estado, setEstado] = useState(true);

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);


  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar compras según el término de búsqueda
  const filteredCompras = comprasList.filter((user) => {
    return Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Estados para el paginado
  const [currentPage, setCurrentPage] = useState(1);
  const [comprasPrePage] = useState(3); // Número de categorías por página

  // Función para manejar el cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calcula las categorías para la página actual
  const indexOfFirstCom = currentPage * comprasPrePage;
  const indexOfFirstUsu = indexOfFirstCom - comprasPrePage;
  const currentCompras = comprasList.slice(
    indexOfFirstUsu,
    indexOfFirstCom);

  //funcion volver
  const volver = () => {
    empty();
    setEdit(false);
  }

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

  const empty = () => {
    setProveedor(0)
    setNumeroFactura("")
    setFecha("")
    setValorTotal("")
  }

  useEffect(() => {
    getCompras();
    getProveedores();
  }, []);

  const putCompra = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorNombre(true);
    if (!estado) {
      setEstado(true);
    } else {
      console.log("Datos a enviar:", { Estado: estado }); // Verifica los datos que se enviarán
      Axios.put(URLCategorias, {
        Estado: estado
      }).then((response) => {
        console.log("Respuesta de la API:", response.data); // Verifica la respuesta de la API
        getCompras();
        empty();
      }).catch((error) => {
        console.log(error);
        showAlert("error", "Hubo un error al editar la el estado, inténtalo de nuevo");
      });
    }
  };

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

  const switchEstado = (id) => {

    let est = comprasList.some((user) => (user.IdCompra === id && user.Estado))
    if (est) {
      est = false;
    } else {
      est = true;
    }
    const user = comprasList.find((user) => (user.IdCompra === id))
    Axios.put(URLCompras, {
      IdCompra: id,
      Estado: est,
      IdProveedor: user.IdProveedor,
      NumeroFactura: user.NumeroFactura,
      Fecha: user.Fecha,
      ValorTotal: user.ValorTotal
    }).then(() => {
      showAlert("success", "Estado modificado.");
      getCompras();
    }).catch((error) => {
      console.log(error);
      showAlert("error", "Error al modificar el estado.");
    });
  }

  return (

    <div className="mt-12 mb-8 flex flex-col gap-12">
      <div className="md:flex-row md:items-center md:justify-between grid grid-cols-5 ml-auto ">
        <div className="md:flex md:items-center col-span-4">
          <Input
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className=" md:mt-0 md:ml-4 col-span-1 mr-auto">
          <Button className="btnAgg px-3 py-2 flex items-center border" onClick={() => navigate('../detalleCompra')}><ShoppingBagIcon className="h-7 w-7 me-2" />Crear Compra</Button>
        </div>
      </div>


      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Compras
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Proveedor", "Numero Factura", "Fecha", "Estado", "Valor total", "Funciones"].map((el) => (
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
              {currentCompras.map((user) => (
                <tr key={user.IdCompra}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{proveedoresList.map((proveedor) => (proveedor.IdProveedor == user.IdProveedor && proveedor.Nombre))}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NumeroFactura}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Fecha}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {user.Estado ? (
                      <button onClick={() => { confirmarEstado(user.IdCompra) }} className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full">Activo</button>
                    ) : (
                      <button onClick={() => { confirmarEstado(user.IdCompra) }} className="bg-pink-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full">Inactivo</button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.ValorTotal}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button className="text-xs font-semibold btnFunciones h-6 w-6 text-gray-500"><EyeIcon /></button>
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
            {[...Array(Math.ceil(filteredCompras.length / comprasPrePage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                </button>
              </li>
            ))}
            {currentPage < filteredCompras.length / comprasPrePage ? <button onClick={() =>
              currentPage < filteredCompras.length / comprasPrePage ? paginate(currentPage + 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronRightIcon className="w-6 h-6" />
            </button> : null}
          </ul>

        </CardBody>
      </Card>

    </div>
  );
}
export default Compras;