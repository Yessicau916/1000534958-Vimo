import React, { useState, useEffect, Fragment } from "react";
import {
  Typography, Card, CardHeader, CardBody, Input,
} from "@material-tailwind/react";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import Axios from "axios";
import Swal from 'sweetalert2';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

//iconos
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/solid";

export function Productos() {

  const people = [
    {
      id: 1,
      name: 'Wade Cooper',
      avatar:
        'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 2,
      name: 'Arlene Mccoy',
      avatar:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: 3,
      name: 'Devon Webb',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


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

  const [productosList, setProductosList] = useState([]);
  const [categoriasList, setCategoriasList] = useState([]);

  //se crean variables en las que se guardan los datos de los input
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valorPorUnidad, setValorPorUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [imagen, setImagen] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  const [selected, setSelected] = useState([])

  //funcion volver
  const volver = () => {
    empty();
    setEdit(false);
  }

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
    setNombreProducto("")
    setDescripcion("")
    setCategoria("")
    setValorPorUnidad("")
    setCantidad("")
    setImagen("")
  }

  useEffect(() => {
    getProductos();
    getCategorias();
  }, []);

  const [errorNombreProducto, setErrorNombreProductos] = useState(true);
  const [errorDespcripcion, setErrorDespcripcion] = useState(true);
  const [errorCategoria, setErrorCategoria] = useState(true);
  const [errorValorPorUnidad, setErrorValorPorUnidad] = useState(true);
  const [errorImagen, setErrorImagen] = useState(true);

  //post
  const postProductos = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorNombreProductos(true);
    setErrorDespcripcion(true);
    setErrorCategoria(true);
    setErrorValorPorUnidad(true);
    setErrorImagen(true);

    // Validación de los campos
    if (!nombreProducto) {
      showAlert("error", "Ingrese un nombre de producto!");
      setErrorNombreProductos(false);
    } else if (!descripcion) {
      showAlert("error", "Ingrese una descripcion!");
      setErrorDespcripcion(false);
    } else if (categoria === 0) {
      showAlert("error", "Seleccione una categoria!");
      setErrorCategoria(false);
    } else if (!valorPorUnidad) {
      showAlert("error", "Ingrese el valor por unidad del producto!");
      setErrorValorPorUnidad(false);
    } else {
      showAlert("success", "Producto registrado con éxito!");

      Axios.post(URLProductos, {
        NombreProducto: nombreProducto,
        Descripcion: descripcion,
        IdCategoria: categoria,
        ValorPorUnidad: valorPorUnidad,
        Cantidad: cantidad,
        Imagen: imagen
      }).then(() => {
        setEdit(false);
        getProductos();
        empty();
      }).catch((error) => {
        console.log(error);
      });
    }
  };
  //put

  const putProducto = () => {
    // Se establecen los errores como verdaderos inicialmente
    setErrorNombreProductos(true);
    setErrorDespcripcion(true);
    setErrorCategoria(true);
    setErrorValorPorUnidad(true);
    setErrorImagen(true);

    // Validación de los campos
    if (!nombreProducto) {
      showAlert("error", "Ingrese un nombre de producto!");
      setErrorNombreProductos(false);
    } else if (!descripcion) {
      showAlert("error", "Ingrese una descripcion!");
      setErrorDespcripcion(false);
    } else if (categoria === 0) {
      showAlert("error", "Seleccione una categoria!");
      setErrorCategoria(false);
    } else if (!valorPorUnidad) {
      showAlert("error", "Ingrese el valor por unidad del producto!");
      setErrorValorPorUnidad(false);
    } else {
      showAlert("success", "Producto registrado con éxito!");
      Axios.put(URLProductos, {
        IdProducto: id,
        NombreProducto: nombreProducto,
        Descripcion: descripcion,
        IdCategoria: categoria,
        ValorPorUnidad: valorPorUnidad,
        Cantidad: cantidad,
        Imagen: imagen
      }).then(() => {
        setEdit(false);
        getProductos();
        empty();
      }).catch((error) => {
        console.log(error);
      });
    }
  };
  //llamar las variables 
  const editar = (val) => {
    setEdit(true)
    setId(val.IdProducto)
    setNombreProducto(val.NombreProducto)
    setDescripcion(val.Descripcion)
    setCategoria(val.IdCategoria)
    setValorPorUnidad(val.ValorPorUnidad)
    setCantidad(val.Cantidad)
    setImagen(val.Imagen)
  }

  //delete
  const deleteProducto = (idProducto) => {
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
        console.log(idProducto)
        Axios.delete(URLProductos + `/${idProducto}`)
          .then(() => {
            getProductos();
            empty();
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
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? ("Editar Producto") : ("Crear producto")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <Input
                label="Nombre del producto"
                value={nombreProducto}
                onChange={
                  (event) => setNombreProducto(event.target.value)} />
            </div>
            <div className="col-span-">
              <select
                label="Categoria"
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                className="block w-full h-10 border border-gray-400 text-gray-600 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm">
                <option value={0}>Seleccione una categoria</option>
                {categoriasList.map((categoiria) => (
                  <option value={categoiria.IdCategoria}>
                    {categoiria.NombreCategoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <Input
                label="Valor Por Unidad"
                value={valorPorUnidad}
                onChange={(event) => setValorPorUnidad(event.target.value)}
                type="number" />
            </div>
            <div className="col-span-1">
              <Input
                label="Cantidad"
                value={cantidad}
                onChange={(event) => setCantidad(event.target.value)}
                type="number" />
            </div>
            <div className="col-span-1">
              <Input
                as="textarea"
                rows={4}
                label="Descripcion"
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)} />
            </div>

            {/*<Listbox value={selected} onChange={setSelected}>
              {({ open }) => (
                <>
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                      <span className="flex items-center">
                        <img src={selected.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                        <span className="ml-3 block truncate">{selected.name}</span>
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {people.map((person) => (
                          <Listbox.Option
                            key={person.id}
                            className={({ active }) =>
                              classNames(
                                active ? 'bg-teal-600 text-white' : 'text-gray-900',
                                'relative cursor-default select-none py-2 pl-3 pr-9'
                              )
                            }
                            value={person}
                          >
                            {({ selected, active }) => (
                              <>
                                <div className="flex items-center">
                                  <img src={person.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                  <span
                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                  >
                                    {person.name}
                                  </span>
                                </div>
                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? 'text-white' : 'text-indigo-600',
                                      'absolute inset-y-0 right-0 flex items-center pr-4'
                                    )}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>*/}

            <div className="col-span-1 ">
              <label htmlFor="imagenInput">Imagen</label>
              <input
                id="imagenInput"
                type="file"
                accept="image/*"
                onChange={(event) => setImagen(event.target.files[0])}
              />
            </div>

          </div>
          <div className="flex justify-end items-center mt-2">
            {edit ? (
              <div>
                <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                  Volver
                </button>
                <button onClick={putProducto} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                  Editar producto
                </button>
              </div>
            ) : (
              <button onClick={postProductos} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                Crear producto
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Productos
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["NombreProducto", "Categoria", "Valor por unidad", "Cantidad", "Imagen", "Funciones"].map((el) => (
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
              {productosList.map((user) => (
                <tr key={user.idProducto}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreProducto}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{categoriasList.map((categoiria) => (categoiria.IdCategoria == user.IdCategoria && categoiria.NombreCategoria))}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.ValorPorUnidad}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Cantidad}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Imagen}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button onClick={() => { editar(user) }} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500" onClick={() => deleteProducto(user.IdProducto)}><TrashIcon /></button>

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
export default Productos;