import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody,  Input, 
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';


//iconos
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export function Proveedores() {
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

  const [proveedoresList, setProveedoresList] = useState([]);
  const [ciudadesList, setCiudadesList] = useState([]);

   //se crean variables en las que se guardan los datos de los input
  
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comentario, setComentario] = useState("");


  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

   //funcion volver
   const volver = ()=> {
    empty();
    setEdit(false);
  }

  //apis
  const URLProveedores= "http://localhost:8080/api/proveedores";
  const URLCiudades = "http://localhost:8080/api/ciudades";

  //metodos o endpoints get

  const getProveedores = async () => {
    try {
      const resp = await Axios.get(URLProveedores);
      setProveedoresList(resp.data.proveedores);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }


  const getCiudades = async () => {
    try {
      const resp = await Axios.get(URLCiudades);
      setCiudadesList(resp.data.ciudades);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const empty =() =>{
    setCedula("")
    setNombre("")
    setApellido("")
    setCorreo("")
    setTelefono("")
    setDireccion("")
    setCiudad(0)
    setComentario("")
  }

  useEffect(() => {
    getProveedores();
    getCiudades();
  }, []);

  const [errorCedula, setErrorCedula] = useState(true);
   const [errorNombre, setErrorNombre] = useState(true);
   const [errorApellido, setErrorApellido] = useState(true);
   const [errorCorreo, setErrorCorreo] = useState(true);
   const [errorTelefono, setErrorTelefono] = useState(true);
   const [errorDireccion, setErrorDireccion] = useState(true);
   const [errorCiudad, setErrorCiudad] = useState(true);
   const [errorComentario, setErrorComentario] = useState(true);

   //post
   const postProveedor= () => {
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valCed = /^(?=.*\d)[0-9]{7,15}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;

    // Se establecen los errores como verdaderos inicialmente
    setErrorCedula(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCorreo(true);
    setErrorTelefono(true);
    setErrorDireccion(true);
    setErrorCiudad(true);
    setErrorComentario(true);
    
    // Validación de los campos
     if (!cedula) {
      showAlert("error", "Ingrese una cédula!");
      setErrorCedula(false);
    } else if (!valCed.test(cedula)) {
      showAlert("error", "Ingrese una cédula válida!");
      setErrorCedula(false);
    } else if (!nombre) {
      showAlert("error", "Ingrese su nombre!");
      setErrorNombre(false);
    } else if (!valNomApe.test(nombre)) {
      showAlert("error", "Ingrese un nombre válido!");
      setErrorNombre(false);
    } else if (!apellido) {
      showAlert("error", "Ingrese sus apellidos!");
      setErrorApellido(false);
    } else if (!valNomApe.test(apellido)) {
      showAlert("error", "Ingrese apellidos válido!");
      setErrorApellido(false);
    } else if (!correo) {
        showAlert("error", "Ingrese un correo!");
        setErrorCorreo(false);
      } else if (!valEm.test(correo)) {
        showAlert("error", "Ingrese un correo válido!");
        setErrorCorreo(false);
      } else if (proveedoresList.map((user) => user.Correo).includes(correo)) {
        showAlert("error", "Ese correo ya está registrado...");
        setErrorCorreo(false);
    } else if (!telefono) {
      showAlert("error", "Ingrese su número de Telefono!");
      setErrorTelefono(false);
    } else if (!valCel.test(telefono)) {
      showAlert("error", "Ingrese un número de Telefono válido!");
      setErrorTelefono(false);
    } else if (proveedoresList.map((user) => user.Telefono).includes(telefono)) {
      showAlert("error", "Ese número de Telefono ya está registrado...");
      setErrorTelefono(false);
    } else if (!direccion) {
      showAlert("error", "Ingrese una dirección!");
      setErrorDireccion(false);
    } else if (ciudad == 0) {
      showAlert("error","Seleccione el nombre de la Ciudad!");
      setErrorCiudad(false);
    } else if (!comentario) {
      showAlert("error", "Ingrese un comentario!");
      setErrorComentario(false);
    } else {
      showAlert("success", "Proveedor registrado con éxito!");
      
      Axios.post(URLProveedores, {
        Cedula: cedula,
        Nombre: nombre,
        Apellido: apellido,
        Correo: correo,
        Telefono: telefono,
        Direccion: direccion,
        IdCiudad: ciudad,
        Comentario: comentario,

      }).then(()=>{
        getProveedores();
        setEdit(false)
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
  setId(val.IdProveedor)
  setCedula(val.Cedula)
  setNombre(val.Nombre)
  setApellido(val.Apellido)
  setCorreo(val.Correo)
  setTelefono(val.Telefono)
  setDireccion(val.Direccion)
  setCiudad(val.IdCiudad)
  setComentario(val.Comentario)
}

  const putProveedores = () => {
        const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
        const valCel = /^(?=.*\d)[0-9]{10}$/;
        const valCed = /^(?=.*\d)[0-9]{7,15}$/;
        const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;
    
        // Se establecen los errores como verdaderos inicialmente
        setErrorCedula(true);
        setErrorNombre(true);
        setErrorApellido(true);
        setErrorCorreo(true);
        setErrorTelefono(true);
        setErrorDireccion(true);
        setErrorCiudad(true);
        setErrorComentario(true);
        
        // Validación de los campos
         if (!cedula) {
          showAlert("error", "Ingrese una cédula!");
          setErrorCedula(false);
        } else if (!valCed.test(cedula)) {
          showAlert("error", "Ingrese una cédula válida!");
          setErrorCedula(false);
        } else if (!nombre) {
          showAlert("error", "Ingrese su nombre!");
          setErrorNombre(false);
        } else if (!valNomApe.test(nombre)) {
          showAlert("error", "Ingrese un nombre válido!");
          setErrorNombre(false);
        } else if (!apellido) {
          showAlert("error", "Ingrese sus apellidos!");
          setErrorApellido(false);
        } else if (!valNomApe.test(apellido)) {
          showAlert("error", "Ingrese apellidos válido!");
          setErrorApellido(false);
        } else if (!correo) {
            showAlert("error", "Ingrese un correo!");
            setErrorCorreo(false);
          } else if (!valEm.test(correo)) {
            showAlert("error", "Ingrese un correo válido!");
            setErrorCorreo(false);
          } else if (proveedoresList.map((user) => user.Correo).includes(correo)) {
            showAlert("error", "Ese correo ya está registrado...");
            setErrorCorreo(false);
        } else if (!telefono) {
          showAlert("error", "Ingrese su número de Telefono!");
          setErrorTelefono(false);
        } else if (!valCel.test(telefono)) {
          showAlert("error", "Ingrese un número de Telefono válido!");
          setErrorTelefono(false);
        } else if (proveedoresList.map((user) => user.Telefono).includes(telefono)) {
          showAlert("error", "Ese número de Telefono ya está registrado...");
          setErrorTelefono(false);
        } else if (!direccion) {
          showAlert("error", "Ingrese una dirección!");
          setErrorDireccion(false);
        } else if (ciudad == 0) {
          showAlert("error","Seleccione el nombre de la Ciudad!");
          setErrorCiudad(false);
        } else if (!comentario) {
          showAlert("error", "Ingrese un comentario!");
          setErrorComentario(false);
        } else {
          showAlert("success", "Proveedor registrado con éxito!");
          
          Axios.put(URLProveedores, {
            IdProveedor: id,
            Cedula: cedula,
            Nombre: nombre,
            Apellido: apellido,
            Correo: correo,
            Telefono: telefono,
            Direccion: direccion,
            IdCiudad: ciudad,
            Comentario: comentario,
          }).then(()=>{
            getProveedores();
            setEdit(false);
            empty();
          }).catch((error) => {
            console.log(error)
          })
        }
  };

  //delete
  const deleteProveedor = (idProveedor) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar este proveedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idProveedor)
        Axios.delete(URLProveedores + `/${idProveedor}`)
          .then(() => {
            getProveedores();
            Swal.fire(
              'Eliminado!',
              'El proveedor ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar proveedor");
          });
      }
    });
  };
  


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>

        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
        <Typography variant="h6" color="white">
            {edit ? ("Editar Proveedor"): ("Crear Proveedor")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid grid-cols-4 gap-3">
            
            <div className="col-span-1">
              <Input 
              label="Cédula" 
              value={cedula} 
              type="number"
              onChange={
                (event) => setCedula(event.target.value) }  />
            </div>
            
            <div className="col-span-1">
              <Input 
              label="Nombre" 
              value={nombre}
              onChange={(event) => setNombre(event.target.value)} />
            </div>
            <div className="col-span-1">
              <Input 
              label="Apellido" 
              value={apellido}
              onChange={(event) => setApellido(event.target.value)} />
            </div>
            <div className="col-span-1">
              <Input 
              label="Correo" 
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              type="email" />
            </div>
            <div className="col-span-1">
              <Input 
              label="Telefono" 
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              type="number" />
            </div>
            
            <div className="col-span-1">
              <Input 
              label="Dirección"  
              value={direccion}
              onChange={(event) => setDireccion(event.target.value)} />
            </div>
            <div className="col-span-">
              <select 
              label="Rol" 
              value={ciudad} 
              onChange={(event) => setCiudad(event.target.value)}
              className="text-sm block w-full h-10 border border-gray-400 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value={0}>Seleccione una ciudad</option>
                {ciudadesList.map((ciudad) => (
                  <option value={ciudad.IdCiudad}>
                    {ciudad.NombreCiudad}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <Input 
              label="Comentario" 
              value={comentario}
              onChange={(event) => setComentario(event.target.value)}
               />
            </div>
          </div>
          <div className="flex justify-end items-center mt-2">
            {edit ? (
              <div>
                <button onClick={volver} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                  Volver
                </button>
                <button onClick={putProveedores} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                  Editar proveedor
                </button>
              </div>
            ) : (
              <button onClick={postProveedor} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                Crear proveedor
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Proveedores
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {[ "Cedula",  "Nombre", "Apellido","Correo", "Telefono", "Direccion", "Ciudad","Comentario" , "Funciones"].map((el) => (
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
              {proveedoresList.map((user) => (
                <tr key={user.IdProveedor}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Cedula}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Nombre}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Apellido}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Correo}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Telefono}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Direccion}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{ciudadesList.map((ciudad) => (ciudad.IdCiudad == user.IdCiudad && ciudad.NombreCiudad))}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Comentario}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                  <button onClick={()=> {editar(user)}}  className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500" onClick={() => deleteProveedor(user.IdProveedor)}><TrashIcon /></button>
                 
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
export default Proveedores;