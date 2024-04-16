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

export function Departamentos() {
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

  const [departamentosList, setDepartamentosList] = useState([]);

   //se crean variables en las que se guardan los datos de los input
  const [nombreDepartamento, setNombreDepartamento] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

    //funcion volver
    const volver = ()=> {
      empty();
      setEdit(false);
    }
  //apis
  const URLDepartamentos = "http://localhost:8080/api/departamentos";

  //metodos o endpoints get

  const getDepartamentos = async () => {
    try {
      const resp = await Axios.get(URLDepartamentos);
      setDepartamentosList(resp.data.departamentos);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const empty =() =>{
    setNombreDepartamento("")
  }

  useEffect(() => {
    getDepartamentos();
  }, []);

  const [errorNombreDepartamento, setErrorNombreDepartamento] = useState(true);

   //post
   const postDepartamentos = () => {

    // Se establecen los errores como verdaderos inicialmente
    setErrorNombreDepartamento(true);
    
    // Validación de los campos
    if (!nombreDepartamento) {
      showAlert("error", "Ingrese un nombre del departamento!");
      setErrorNombreDepartamento(false);
    
    } else {
      showAlert("success", "departamento registrado con éxito!");
      
      Axios.post(URLDepartamentos, {
        NombreDepartamento: nombreDepartamento, 
      }).then(()=>{
        getDepartamentos();
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
  setId(val.IdDepartamento)
  setNombreDepartamento(val.NombreDepartamento)
}

  const putDepartamentos = () => {

    // Se establecen los errores como verdaderos inicialmente
    setErrorNombreDepartamento(true);
    
    // Validación de los campos
    if (!nombreDepartamento) {
        showAlert("error", "Ingrese un nombre el departamento!");
        setErrorNombreDepartamento(false);
      
      } else {
        showAlert("success", "Departamento registrado con éxito!");

      Axios.put(URLDepartamentos, {
        IdDepartamento: id,
        NombreDepartamento: nombreDepartamento,
        
      }).then(()=>{
        getDepartamentos();
        empty();
        setEdit(false)
      }).catch((error) => {
        console.log(error)
      })
    }
  };

  //delete
  const deleteDepartamentos = (idDepartamento) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar este departamento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idDepartamento)
        Axios.delete(URLDepartamentos + `/${idDepartamento}`)
          .then(() => {
            getDepartamentos();
            Swal.fire(
              'Eliminado!',
              'el departamento ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar el departamento");
          });
      }
    });
  };
  


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>

      <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? ("Editar Departamento"): ("Crear departamento")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid gap-3">
                <div className="col-span-1">
                    <Input 
                    label="Nombre del departamento" 
                    value={nombreDepartamento}
                    onChange={(event) => setNombreDepartamento(event.target.value)}
                    />
                </div>
            </div>
    
            <div className="flex justify-end items-center mt-2">
            {edit ? (
              <div>
                <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                  Volver
                </button>
                <button onClick={putDepartamentos} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                  Editar departamento
                </button>
              </div>
            ) : (
              <button onClick={postDepartamentos} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                Crear departamento
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Departamento
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Id ", "Nombre Departamento","Funciones"].map((el) => (
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
              {departamentosList.map((user) => (
                <tr key={user.IdDepartamento}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.IdDepartamento}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.NombreDepartamento}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                  <button onClick={()=> {editar(user)}}  className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500" onClick={() => deleteDepartamentos(user.IdDepartamento)}><TrashIcon /></button>
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
export default Departamentos;