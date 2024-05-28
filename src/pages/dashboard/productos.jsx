import React, { Fragment, useState, useEffect } from "react";
import { Typography, Card, CardHeader, CardBody, Input, Button } from "@material-tailwind/react";
import Axios from "axios";
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
//iconos
import { PencilSquareIcon, TrashIcon, EyeIcon, UserPlusIcon,PhotoIcon,CubeIcon  } from "@heroicons/react/24/solid";
import { EyeSlashIcon ,ChevronRightIcon,ChevronLeftIcon} from "@heroicons/react/24/outline";


export function Productos() {
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
  const [productosList, setProductosList] = useState([]);
  const [categoriasList, setCategoriasList] = useState([]);
  const [open, setOpen] = useState(false);

  // Estado para controlar el modal de visualización
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [visualizarProducto, setVisualizarProducto] = useState(null);

  //se crean variables en las que se guardan los datos de los input
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valorxUnidad, setValorxUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [img, setImg] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  
  //Variables para el modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //apis
  const URLProductos = "http://localhost:8080/api/productos";
  const URLCategorias = "http://localhost:8080/api/categorias";

  //metodos o endpoints get
  const getProductos = async () => {
    try {
      const resp = await Axios.get(URLProductos);
      setProductosList(resp.data.productos);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }
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
    setDescripcion("")
    setCategoria(0)
    setValorxUnidad("")
    setCantidad("")
    setImg("")
    setEdit(false);
  }

  useEffect(() => {
    getProductos();
    getCategorias();
  }, []);

  const [errorNombre, setErrorNombre] = useState(true);
  const [errorDescripcion, setErrorDescripcion] = useState(true);
  const [errorCategoria, setErrorCategorias] = useState(true);
  const [errorValorxUnidad, setErrorValorxUnidad] = useState(true);
  const [errorCantidad, setErrorCantidad] = useState(true);
  const [errorImg, setErrorImg] = useState(true);

  //post
  const postProducto = () => {
    setErrorNombre(true);
    setErrorDescripcion(true); 
    setErrorCategorias(true);
    setErrorValorxUnidad(true);
    setErrorCantidad(true);
    setErrorImg(true);

    // Validación de los campos
    if (!nombre) {
      showAlert("error", "Ingrese un nombre");
      setErrorNombre(true);
    } else if (nombre.length < 3) {
      showAlert("error", "El nombre debe tener al menos 3 caracteres");
      setErrorNombre(true);
    } else if (nombre.length > 50) {
      showAlert("error", "El nombre no debe exceder los 50 caracteres");
      setErrorNombre(true);
    } else if (!descripcion) {
      showAlert("error", "Ingrese una descripción");
      setErrorDescripcion(true);
    } else if (descripcion.length < 10) {
      showAlert("error", "La descripción debe tener al menos 10 caracteres");
      setErrorDescripcion(true);
    } else if (descripcion.length > 200) {
      showAlert("error", "La descripción no debe exceder los 200 caracteres");
      setErrorDescripcion(true);
    } else if (!categoria) {
      showAlert("error", "Seleccione una categoría");
      setErrorCategoria(true);
    } else if (!valorxUnidad || isNaN(valorxUnidad) || valorxUnidad <= 0) {
      showAlert("error", "Ingrese un valor por unidad válido");
      setErrorValorxUnidad(true);
    } else if (!cantidad || isNaN(cantidad) || cantidad <= 0 ) {
      showAlert("error", "Ingrese una cantidad válida");
      setErrorCantidad(true);
   
    } else {
      showAlert("success", "Producto registrado con éxito!");
      Axios.post(URLProductos, {
        NombreProducto: nombre,
        Descripcion: descripcion,
        IdCategoria: categoria,
        ValorPorUnidad: valorxUnidad,
        Cantidad: cantidad,
        Imagen: img,
      }).then(() => {
        getProductos();
        setEdit(false)
        setOpen(false);
        empty();
      }).catch((error) => {
        console.log(error)
      });
    }
  };
  //put//llamar las variables 
  const editar = (val) => {
    setOpen(true);
    setVer(true);
    setEdit(true);
    setErrorNombre(true);
    setErrorDescripcion(true); 
    setErrorCategorias(true);
    setErrorValorxUnidad(true);
    setErrorCantidad(true);
    setErrorImg(true);
    handleShow();
    setId(val.IdProducto)
    setNombre(val.NombreProducto)
    setDescripcion(val.Descripcion)
    setCategoria(val.IdCategoria)
    setValorxUnidad(val.ValorPorUnidad)
    setCantidad(val.Cantidad)
    setImg(val.Imagen)
  }

  const putProducto = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorNombre(true);
    setErrorDescripcion(true); 
    setErrorCategorias(true);
    setErrorValorxUnidad(true);
    setErrorCantidad(true);
    setErrorImg(true);

    // Validación de los campos
    if (!nombre) {
      showAlert("error", "Ingrese un nombre");
      setErrorNombre(true);
    } else if (nombre.length < 3) {
      showAlert("error", "El nombre debe tener al menos 3 caracteres");
      setErrorNombre(true);
    } else if (nombre.length > 50) {
      showAlert("error", "El nombre no debe exceder los 50 caracteres");
      setErrorNombre(true);
    } else if (!descripcion) {
      showAlert("error", "Ingrese una descripción");
      setErrorDescripcion(true);
    } else if (descripcion.length < 10) {
      showAlert("error", "La descripción debe tener al menos 10 caracteres");
      setErrorDescripcion(true);
    } else if (descripcion.length > 200) {
      showAlert("error", "La descripción no debe exceder los 200 caracteres");
      setErrorDescripcion(true);
    } else if (!categoria) {
      showAlert("error", "Seleccione una categoría");
      setErrorCategoria(true);
    } else if (!valorxUnidad || isNaN(valorxUnidad) || valorxUnidad <= 0) {
      showAlert("error", "Ingrese un valor por unidad válido");
      setErrorValorxUnidad(true);
    } else if (!cantidad || isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
      showAlert("error", "Ingrese una cantidad válida");
      setErrorCantidad(true);
    } else {
      showAlert("success", "producto registrado con éxito!");
      Axios.put(URLProductos, {
        NombreProducto: nombre,
        Descripcion: descripcion,
        IdCategoria: categoria,
        ValorPorUnidad: valorxUnidad,
        Cantidad: cantidad,
        Imagen: img,
      }).then(() => {
        getProductos();
        setOpen(false);
        setEdit(false);
        empty();
      }).catch((error) => {
        console.log(error)
      })
    }
  };
  //delete
  const deleteProducto = async (idProducto) => {
  // Verificar si el producto está asociado a alguna categoría
  // try {
  //   const response = await Axios.get(URLProductos + `/${idProducto}`);
  //   const producto = response.data.producto;

  //   if (producto && producto.IdCategoria) {
  //     showAlert("error", "El producto está asociado a una categoría y no se puede eliminar");
  //     return;
  //   }

    // Si el producto no está asociado a ninguna categoría, mostrar el diálogo de confirmación
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idProducto);
        Axios.delete(URLProductos + `/${idProducto}`)
          .then(() => {
            getProductos();
            Swal.fire(
              'Eliminado!',
              'El producto ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar el producto");
          });
      }
    });
  // } catch (error) {
  //   console.log(error);
  //   console.log("Error al obtener el producto");
  // }
};

  //alerta de confirmar estado

  // const confirmarEstado = (id) => {
  //   Swal.fire({
  //     title: 'Cambiar Estado',
  //     text: '¿Estás seguro de cambiar el estado de este categoría?',
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

  // En la función switchEstado
// const switchEstado = (id) => {
//   let est = categoriasList.some((user) => user.IdCategoria === id && user.Estado);
//   if (est) {
//     est = false;
//   } else {
//     est = true;
//   }
//   Axios.put(URLCategorias, {
//     IdCategoria: id,
//     // Estado: est,
//     NombreCategoria: nombre, // Aquí deberías usar nombre en lugar de user.nombre
//   }).then(() => {
//     showAlert("success", "Estado modificado.");
//     getCategorias();
//   }).catch((error) => {
//     console.log(error);
//     showAlert("error", "Error al modificar el estado.");
//   });
// };

// Estado para el término de búsqueda
const [searchTerm, setSearchTerm] = useState("");

// Función para manejar la búsqueda
const handleSearch = (event) => {
  setSearchTerm(event.target.value);
};

const filteredProductos = productosList.filter((user) => {
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
  setVisualizarProducto(vis);
  setOpenVisualizar(true);
  setVer(true);
  setEdit(true);
  setErrorNombre(true);
  setErrorDescripcion(true); 
  setErrorCategorias(true);
  setErrorValorxUnidad(true);
  setErrorCantidad(true);
  setErrorImg(true);
  handleShow();
  setId(vis.IdProducto);
  setNombre(vis.NombreProducto); 
  setDescripcion(vis.Descripcion); 
  setCategoria(vis.IdCategoria); 
  setValorxUnidad(vis.ValorPorUnidad); 
  setCantidad(vis.Cantudad); 
  setImg(vis.Imagen); 

};

// Estados para el paginado
const [currentPage, setCurrentPage] = useState(1);
const [productosPerPage] = useState(3); // Número de categorías por página

// Función para manejar el cambio de página
const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Calcula las categorías para la página actual
const indexOfLastProducto = currentPage * productosPerPage;
const indexOfFirstProducto = indexOfLastProducto - productosPerPage;
const currentProductos = filteredProductos.slice(indexOfFirstProducto, indexOfLastProducto);


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
        {edit ? "Editar Producto" : "Crear Producto"}
      </Typography>
    </CardHeader>
    <CardBody className="px-2 pt-0 pb-2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre del producto"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)} />
        
        <div className="col-span-1">
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="block w-full pt-4  border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ">
            <option value={0}>Seleccione una categoría</option>
            {categoriasList.map((categoria) => (
              <option key={categoria.IdCategoria} value={categoria.IdCategoria}>
                {categoria.NombreCategoria}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Valor Unitario"
          value={valorxUnidad}
          type="number"
          onChange={(event) => setValorxUnidad(event.target.value)} />
        <Input
          label="Cantidad"
          value={cantidad}
          onChange={(event) => setCantidad(event.target.value)}
          type="number" />
          <div className="col-span-1">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 ">
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows="4"
            className="block w-full mt-1 h-30  pt-10 border border-gray-300 border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}></textarea>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center">
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
            Imagen
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
          <button onClick={putProducto} className="btnAgg text-white font-bold py-1 px-3 rounded">
            Editar Producto
          </button>
        ) : (
          <button onClick={postProducto} className="btnAgg text-white font-bold py-1 px-3 rounded">
            Crear Producto
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
                    <Input label="Nombre" value={nombre} readOnly />
                    <Input label="Descripción" value={descripcion} readOnly />
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoría</label>
                      <select
                        value={categoria}
                        disabled
                        className="bg-gray-300 pt-3 form-select mt-1 block w-full border-gray-700 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-400 focus:ring-opacity-50"
                      >
                        <option value={0}>Seleccione una categoria</option>
                        {categoriasList.map((categoria) => (
                          <option key={categoria.IdCategoria} value={categoria.IdCategoria}>
                            {categoria.NombreCategoria}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                    <Input label="Valor Unitario" value={valorxUnidad} readOnly />
                    <Input label="Cantidad" value={cantidad} readOnly />
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
          <CubeIcon className="h-6 w-6 me-2"/>Crear Producto
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader variant="gradient" className="mb-8 p-6 gradiente-lila-rosado">
        <Typography variant="h6" color="white" className="flex justify-between items-center">
          Producto
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-auto pt-0 pb-5">
        <table className="w-full min-w-[620px] table-auto">
          <thead>
            <tr>
              {[ "Imagen","Nombre","Categoría","Cantidad","V.Unitario", "Funciones"].map((el) => (
                <th key={el} className="border-b border-blue-indigo-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentProductos.map((user) => (
              <tr key={user.IdProductos}>
                <td className="border-b border-blue-gray-50 py-3 px-5">{user.Imagen}</td>
                <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreProducto}</td>
                <td className="border-b border-blue-gray-50 py-3 px-5">{categoriasList.map((categoria) => (categoria.IdCategoria == user.IdCategoria && categoria.NombreCategoria))}</td>
                <td className="border-b border-blue-gray-50 py-3 px-5">{user.Cantidad}</td>
                <td className="border-b border-blue-gray-50 py-3 px-5">{user.ValorPorUnidad}</td>
                <td className="border-b border-blue-gray-50 py-0 px-1">
                  <button onClick={() => { editar(user) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500">
                    <PencilSquareIcon />
                  </button>
                  <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-4 w-5 text-gray-500" onClick={() => deleteProducto(user.IdProducto)}>
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
            {[...Array(Math.ceil(filteredProductos.length / productosPerPage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className={`rounded-3xl ${currentPage === number + 1 ? 'bg-indigo-300 text-white pagIconActive' : 'bg-gray-400 text-gray-800 pagIcon'}`}>
                </button>
              </li>
            ))}
            {currentPage < filteredProductos.length / productosPerPage ? <button onClick={() =>
              currentPage < filteredProductos.length / productosPerPage ? paginate(currentPage + 1) : paginate(currentPage)
            } className='text-gray-400 py-1 '>
              <ChevronRightIcon className="w-6 h-6" />
            </button> : null}
          </ul>
      </CardBody>
    </Card>
  </div>
);
}
export default Productos;
