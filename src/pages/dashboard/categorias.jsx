import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, Input, 
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';


//iconos
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/solid";

export function Categorias() {
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

  const [categoriasList, setCategoriasList] = useState([]);

   //se crean variables en las que se guardan los datos de los input
  const [nombreCategoria, setNombreCategoria] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

    //funcion volver
    const volver = ()=> {
      empty();
      setEdit(false);
    }
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

  const empty =() =>{
    setNombreCategoria("")
  }

  useEffect(() => {
    getCategorias();
  }, []);

  const [errorNombreCategoria, setErrorNombreCategoria] = useState(true);

   //post
   const postCategorias = () => {

    // Se establecen los errores como verdaderos inicialmente
    setErrorNombreCategoria(true);
    
    // Validación de los campos
    if (!nombreCategoria) {
      showAlert("error", "Ingrese un nombre para la categoría!");
      setErrorNombreCategoria(false);
    
    } else {
      showAlert("success", "Categoria registrado con éxito!");
      
      Axios.post(URLCategorias, {
        NombreCategoria: nombreCategoria, 
      }).then(()=>{
        getCategorias();
        empty();
      }).catch((error) => {
        console.log(error)
      })
    }
  };
//put

//llamar las variables 
const editar = (val) =>{
  setEdit(true)
  setId(val.IdCategoria)
  setNombreCategoria(val.NombreCategoria)
}

  const putCategorias = () => {

    // Se establecen los errores como verdaderos inicialmente
    setErrorNombreCategoria(true);
    
    // Validación de los campos
    if (!nombreCategoria) {
        showAlert("error", "Ingrese un nombre para la categoría!");
        setErrorNombreCategoria(false);
      
      } else {
        showAlert("success", "Categoria registrado con éxito!");

      Axios.put(URLCategorias, {
        IdCategoria: id,
        NombreCategoria: nombreCategoria,
        
      }).then(()=>{
        getCategorias();
        empty();
        setEdit(false)
      }).catch((error) => {
        console.log(error)
      })
    }
  };

  //delete
  const deleteCategorias = (idCategorias) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar esta categoria?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idCategorias)
        Axios.delete(URLCategorias + `/${idCategorias}`)
          .then(() => {
            getCategorias();
            Swal.fire(
              'Eliminado!',
              'La categoiria ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar la categoria");
          });
      }
    });
  };
  


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>

      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? ("Editar Categoria"): ("Crear categoria")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid gap-3">
                <div className="col-span-1">
                    <Input 
                    label="Nombre Categoria" 
                    value={nombreCategoria}
                    onChange={(event) => setNombreCategoria(event.target.value)}
                    />
                </div>
            </div>
    
            <div className="flex justify-end items-center mt-2">
            {edit ? (
              <div>
                <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                  Volver
                </button>
                <button onClick={putCategorias} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                  Editar categoiría
                </button>
              </div>
            ) : (
              <button onClick={postCategorias} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                Crear categoría
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Categorias
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Id Categoria", "Nombre Categoría","Funciones"].map((el) => (
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
              {categoriasList.map((user) => (
                <tr key={user.IdCategoria}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.IdCategoria}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreCategoria}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                  <button onClick={()=> {editar(user)}}  className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500" onClick={() => deleteCategorias(user.IdCategoria)}><TrashIcon /></button>
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
export default Categorias;