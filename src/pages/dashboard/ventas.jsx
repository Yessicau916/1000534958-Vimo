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

export function Ventas() {
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

  const [usuariosList, setUsuariosList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [ciudadesList, setCiudadesList] = useState([]);

   //se crean variables en las que se guardan los datos de los input
  const [rol, setRol] = useState("");
  const [cedula, setCedula] = useState("");
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [celular, setCelular] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [veriPass, setVeriPass] = useState("");

  const [id, setId] = useState("");
  const [edit, setEdit] = useState(false);

  //apis
  const URLUsuarios = "http://localhost:8080/api/usuarios";
  const URLRoles = "http://localhost:8080/api/roles";
  const URLCiudades = "http://localhost:8080/api/ciudades";

  //metodos o endpoints get

  const getUsuarios = async () => {
    try {
      const resp = await Axios.get(URLUsuarios);
      setUsuariosList(resp.data.usuarios);
    } catch (error) {
      console.log("Error al obtener los datos: ", error);
    }
  }

  const getRoles = async () => {
    try {
      const resp = await Axios.get(URLRoles);
      setRolesList(resp.data.roles);
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
    setRol(0)
    setCedula("")
    setUsuario("")
    setNombre("")
    setApellido("")
    setCelular("")
    setDireccion("")
    setCiudad(0)
    setCorreo("")
    setPass("")
    setVeriPass("")
  }

  useEffect(() => {
    getUsuarios();
    getRoles();
    getCiudades();
  }, []);

  const [errorRol, setErrorRol] = useState(true);
  const [errorCedula, setErrorCedula] = useState(true);
   const [errorUsuario, setErrorUsuario] = useState(true);
   const [errorNombre, setErrorNombre] = useState(true);
   const [errorApellido, setErrorApellido] = useState(true);
   const [errorCelular, setErrorCelular] = useState(true);
   const [errorDireccion, setErrorDireccion] = useState(true);
   const [errorCiudad, setErrorCiudad] = useState(true);
   const [errorCorreo, setErrorCorreo] = useState(true);
   const [errorPass, setErrorPass] = useState(true);
   const [errorConfirmPass, setErrorConfirmPass] = useState(true);

   //post
   const postUsuario = () => {
    const valUsu = /^(?=.*[A-Z])[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{3,20}$/;
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valCed = /^(?=.*\d)[0-9]{7,15}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;
    const valPa = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{8,30}$/;

    // Se establecen los errores como verdaderos inicialmente
    setErrorRol(true);
    setErrorCedula(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorDireccion(true);
    setErrorCiudad(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    
    // Validación de los campos
    if (rol == 0) {
      showAlert("error", "Seleccione un rol primero!");
      setErrorRol(false);
    } else if (!cedula) {
      showAlert("error", "Ingrese una cédula!");
      setErrorCedula(false);
    } else if (!valCed.test(cedula)) {
      showAlert("error", "Ingrese una cédula válida!");
      setErrorCedula(false);
    } else if (!usuario) {
      showAlert("error", "Ingrese un nombre de usuario!");
      setErrorUsuario(false);
    } else if (!valUsu.test(usuario)) {
      showAlert("error", "Ingrese un nombre de usuario válido!");
      setErrorUsuario(false);
    } else if (usuariosList.map((user) => user.Usuario).includes(usuario)) {
      showAlert("error", "Ese nombre de usuario ya está registrado...");
      setErrorUsuario(false);
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
    } else if (!celular) {
      showAlert("error", "Ingrese su número de celular!");
      setErrorCelular(false);
    } else if (!valCel.test(celular)) {
      showAlert("error", "Ingrese un número de celular válido!");
      setErrorCelular(false);
    } else if (usuariosList.map((user) => user.Celular).includes(celular)) {
      showAlert("error", "Ese número de celular ya está registrado...");
      setErrorCelular(false);
    } else if (!direccion) {
      showAlert("error", "Ingrese una dirección!");
      setErrorDireccion(false);
    } else if (ciudad == 0) {
      showAlert("error","Seleccione el nombre de la Ciudad!");
      setErrorCiudad(false);
    } else if (!correo) {
      showAlert("error", "Ingrese un correo!");
      setErrorCorreo(false);
    } else if (!valEm.test(correo)) {
      showAlert("error", "Ingrese un correo válido!");
      setErrorCorreo(false);
    } else if (usuariosList.map((user) => user.Correo).includes(correo)) {
      showAlert("error", "Ese correo ya está registrado...");
      setErrorCorreo(false);
    } else if (!pass) {
      showAlert("error", "Ingrese una contraseña!");
      setErrorPass(false);
    } else if (!valPa.test(pass)) {
      showAlert("error", "Ingrese una contraseña válida!");
      setErrorPass(false);
    } else if (veriPass !== pass) {
      showAlert("error", "Las contraseñas deben ser iguales!");
      setErrorConfirmPass(false);
    } else {
      showAlert("success", "Usuario registrado con éxito!");
      
      Axios.post(URLUsuarios, {
        IdRol: rol,
        Cedula: cedula,
        Usuario: usuario,
        Nombre: nombre,
        Apellidos: apellido,
        Celular: celular,
        Direccion: direccion,
        IdCiudad: ciudad,
        Correo: correo,
        Contrasenha: pass, 
      }).then(()=>{
        getUsuarios();
        empty();
      }).catch((error) => {
        console.log(error)
      })
    }
  };
//put

  const putUsuario = () => {
    const valUsu = /^(?=.*[A-Z])[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{3,20}$/;
    const valNomApe = /^[a-zA-ZáéíóúÁÉÍÓÚ ]{3,20}$/;
    const valCel = /^(?=.*\d)[0-9]{10}$/;
    const valCed = /^(?=.*\d)[0-9]{7,15}$/;
    const valEm = /^[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]+@[a-zA-Z]{4,8}\.[a-zA-Z]{2,4}$/;
    const valPa = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9áéíóúÁÉÍÓÚ.,/*-_=+]{8,30}$/;

    // Se establecen los errores como verdaderos inicialmente
    setErrorRol(true);
    setErrorCedula(true);
    setErrorUsuario(true);
    setErrorNombre(true);
    setErrorApellido(true);
    setErrorCelular(true);
    setErrorDireccion(true);
    setErrorCiudad(true);
    setErrorCorreo(true);
    setErrorPass(true);
    setErrorConfirmPass(true);
    
    // Validación de los campos
    if (rol == 0) {
      showAlert("error", "Seleccione un rol primero!");
      setErrorRol(false);
    } else if (!cedula) {
      showAlert("error", "Ingrese una cédula!");
      setErrorCedula(false);
    } else if (!valCed.test(cedula)) {
      showAlert("error", "Ingrese una cédula válida!");
      setErrorCedula(false);
    } else if (!usuario) {
      showAlert("error", "Ingrese un nombre de usuario!");
      setErrorUsuario(false);
    } else if (!valUsu.test(usuario)) {
      showAlert("error", "Ingrese un nombre de usuario válido!");
      setErrorUsuario(false);
    } else if (usuariosList.map((user) => user.Usuario).includes(usuario)) {
      showAlert("error", "Ese nombre de usuario ya está registrado...");
      setErrorUsuario(false);
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
    } else if (!celular) {
      showAlert("error", "Ingrese su número de celular!");
      setErrorCelular(false);
    } else if (!valCel.test(celular)) {
      showAlert("error", "Ingrese un número de celular válido!");
      setErrorCelular(false);
    } else if (usuariosList.map((user) => user.Celular).includes(celular)) {
      showAlert("error", "Ese número de celular ya está registrado...");
      setErrorCelular(false);
    } else if (!direccion) {
      showAlert("error", "Ingrese una dirección!");
      setErrorDireccion(false);
    } else if (ciudad == 0) {
      showAlert("error","Seleccione el nombre de la Ciudad!");
      setErrorCiudad(false);
    } else if (!correo) {
      showAlert("error", "Ingrese un correo!");
      setErrorCorreo(false);
    } else if (!valEm.test(correo)) {
      showAlert("error", "Ingrese un correo válido!");
      setErrorCorreo(false);
    } else if (usuariosList.map((user) => user.Correo).includes(correo)) {
      showAlert("error", "Ese correo ya está registrado...");
      setErrorCorreo(false);
    } else if (!pass) {
      showAlert("error", "Ingrese una contraseña!");
      setErrorPass(false);
    } else if (!valPa.test(pass)) {
      showAlert("error", "Ingrese una contraseña válida!");
      setErrorPass(false);
    } else if (veriPass !== pass) {
      showAlert("error", "Las contraseñas deben ser iguales!");
      setErrorConfirmPass(false);
    } else {
      showAlert("success", "Usuario registrado con éxito!");
      
      Axios.put(URLUsuarios, {
        IdUsuario: id,
        IdRol: rol,
        Cedula: cedula,
        Usuario: usuario,
        Nombre: nombre,
        Apellidos: apellido,
        Celular: celular,
        Direccion: direccion,
        IdCiudad: ciudad,
        Correo: correo,
        Contrasenha: pass, 
      }).then(()=>{
        getUsuarios();
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
            Crear usuario
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-">
              <select 
              label="Rol" 
              value={rol}
              onChange={(event) => setRol(event.target.value)}
              className="block w-full h-10 border border-gray-400 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value={0}>Seleccione un rol</option>
                {rolesList.map((rol) => (
                  <option value={rol.IdRol}>
                    {rol.NombreDelRol}
                  </option>
                ))}
              </select>
            </div>
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
              label="Usuario" 
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)} />
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
              label="Celular" 
              value={celular}
              onChange={(event) => setCelular(event.target.value)}
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
              className="block w-full h-10 border border-gray-400 text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value={0}>Seleccione una ciudad</option>
                {ciudadesList.map((ciudad) => (
                  <option value={ciudad.IdCiudad}>
                    {ciudad.NombreCiudad}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="col-span-1">
              <Input 
              label="Correo" 
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              type="email" />
            </div>
            <div className="col-span-1">
              <Input 
              label="Contraseña" 
              value={pass} 
              onChange={(event) => setPass(event.target.value)}
              type="password" />
            </div>
            <div className="col-span-1">
              <Input 
              label="Confirmar contraseña" 
              value={veriPass} 
              onChange={(event) => setVeriPass(event.target.value)}
              type="password" />
            </div>
          </div>
          <div className="flex justify-center items-center mt-3">
            <button onClick={postUsuario}className="bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
              Crear usuario
            </button>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Usuarios
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Rol", "Cedula", "Usuario", "Nombre", "Apellido", "Celular", "Direccion", "Ciudad", "Correo", "Funciones"].map((el) => (
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
              {usuariosList.map((user) => (
                <tr key={user.IdUsuario}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{rolesList.map((rol) => (rol.IdRol == user.IdRol && rol.NombreDelRol))}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Cedula}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Usuario}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Nombre}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Apellidos}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Celular}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Direccion}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{ciudadesList.map((ciudad) => (ciudad.IdCiudad == user.IdCiudad && ciudad.NombreCiudad))}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{user.Correo}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button onClick={putUsuario}  className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
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
export default Ventas;