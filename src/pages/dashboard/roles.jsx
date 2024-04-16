import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, Input,
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export function Roles() {
  // Función para las alertas
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

  // Se crea la lista en las que se van a guardar los datos
  const [rolesList, setRolesList] = useState([]);
  const [permisosList, setPermisosList] = useState([]);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

  // Se crean variables en las que se guardan los datos de los input
  const [nombreRol, setNombreRol] = useState("");
  const [estadoRol, setEstadoRol] = useState(true);

  const [idRol, setIdRol] = useState("");
  const [edit, setEdit] = useState(false);

  const URLRoles = "http://localhost:8080/api/roles";
  const URLPermisos = "http://localhost:8080/api/permisos";

  const getRoles = async () => {
    try {
      const resp = await Axios.get(URLRoles);
      setRolesList(resp.data.roles);
    } catch (error) {
      console.log("Error al obtener los roles: ", error);
    }
  }

  const getPermisos = async () => {
    try {
      const resp = await Axios.get(URLPermisos);
      setPermisosList(resp.data.permisos);
    } catch (error) {
      console.log("Error al obtener los permisos: ", error);
    }
  }

  useEffect(() => {
    getRoles();
    getPermisos();
  }, []);

  const [errorNombreRol, setErrorNombreRol] = useState(true);
  const [errorPermisos, setErrorPermisos] = useState(true);

  const editRol = (id) => {
    const rol = rolesList.find((r) => r.IdRol === id);
    setIdRol(rol.IdRol);
    setNombreRol(rol.NombreDelRol);
    setEstadoRol(rol.Estado);
    setPermisosSeleccionados(rol.Permisos.map(permiso => permiso.IdPermiso));
    setEdit(true);
  }

  const deleteRol = (idRol) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`${URLRoles}/${idRol}`)
          .then(() => {
            getRoles();
            Swal.fire(
              '¡Eliminado!',
              'El rol ha sido eliminado.',
              'success'
            )
          })
          .catch((error) => {
            console.log(error);
            Swal.fire(
              '¡Error!',
              'Hubo un problema al intentar eliminar el rol.',
              'error'
            )
          });
      }
    })
  }

  const postRol = () => {
    setErrorNombreRol(true);
    setErrorPermisos(true);

    if (nombreRol.trim() === "") {
      showAlert("error", "Ingrese un nombre para el rol.");
      setErrorNombreRol(false);
      return;
    }

    if (permisosSeleccionados.length === 0) {
      showAlert("error", "Seleccione al menos un permiso para el rol.");
      setErrorPermisos(false);
      return;
    }

    Axios.post(URLRoles, {
      NombreDelRol: nombreRol,
      Estado: estadoRol,
      Permisos: permisosSeleccionados
    })
    .then(() => {
      getRoles();
      setEdit(false);
      setNombreRol("");
      setEstadoRol(true);
      setPermisosSeleccionados([]);
      Swal.fire(
        '¡Creado!',
        'El rol ha sido creado exitosamente.',
        'success'
      )
    })
    .catch((error) => {
      console.log(error);
      Swal.fire(
        '¡Error!',
        'Hubo un problema al intentar crear el rol.',
        'error'
      )
    });
  }

  const putRol = () => {
    Axios.put(`${URLRoles}/${idRol}`, {
      NombreDelRol: nombreRol,
      Estado: estadoRol,
      Permisos: permisosSeleccionados
    })
    .then(() => {
      getRoles();
      setEdit(false);
      setIdRol("");
      setNombreRol("");
      setEstadoRol(true);
      setPermisosSeleccionados([]);
      Swal.fire(
        '¡Actualizado!',
        'El rol ha sido actualizado exitosamente.',
        'success'
      )
    })
    .catch((error) => {
      console.log(error);
      Swal.fire(
        '¡Error!',
        'Hubo un problema al intentar actualizar el rol.',
        'error'
      )
    });
  }

  const handlePermisoChange = (event) => {
    const idPermiso = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      setPermisosSeleccionados([...permisosSeleccionados, idPermiso]);
    } else {
      setPermisosSeleccionados(permisosSeleccionados.filter(permiso => permiso !== idPermiso));
    }
  }

  const switchEstado = (id) => {
    Axios.put(`${URLRoles}/estado/${id}`)
      .then(() => {
        getRoles();
        showAlert("success", "Estado modificado.");
      })
      .catch((error) => {
        console.log(error);
        showAlert("error", "Hubo un problema al intentar modificar el estado.");
      });
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? "Editar Rol" : "Crear Rol"}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid grid-cols-1 gap-3">
            <div className="col-span-">
              <Input 
                label="Nombre del Rol" 
                value={nombreRol}
                onChange={(event) => setNombreRol(event.target.value)}
              />
            </div>
            
            
            <div className="grid grid-cols-5 gap-3">
                <div className="grid grid-cols-1 gap-3">
                    <Typography variant="h6" className="mb-2">Configuración</Typography>
                    {permisosList.map((permiso) => {
                        if (permiso.NombrePermiso === "Roles" || permiso.NombrePermiso === "Usuarios") {
                        return (
                            <div key={permiso.IdPermiso} className="flex items-center">
                            <input 
                                type="checkbox" 
                                id={`permiso-${permiso.IdPermiso}`} 
                                value={permiso.IdPermiso} 
                                checked={permisosSeleccionados.includes(permiso.IdPermiso)}
                                onChange={handlePermisoChange} 
                                className="mr-2"
                            />
                            <label htmlFor={`permiso-${permiso.IdPermiso}`}>{permiso.NombrePermiso}</label>
                            </div>
                        );
                        }
                        return null;
                    })}
                </div>

                <div>
                    <Typography variant="h6" className="mb-2">Ubicación</Typography>
                    {permisosList.map((permiso) => {
                        if (permiso.NombrePermiso === "Ciudad" || permiso.NombrePermiso === "Departamentos") {
                        return (
                            <div key={permiso.IdPermiso} className="flex items-center">
                            <input 
                                type="checkbox" 
                                id={`permiso-${permiso.IdPermiso}`} 
                                value={permiso.IdPermiso} 
                                checked={permisosSeleccionados.includes(permiso.IdPermiso)}
                                onChange={handlePermisoChange} 
                                className="mr-2"
                            />
                            <label htmlFor={`permiso-${permiso.IdPermiso}`}>{permiso.NombrePermiso}</label>
                            </div>
                        );
                        }
                        return null;
                    })}
                </div>

                <div>
                    <Typography variant="h6" className="mb-2">Compras</Typography>
                    {permisosList.map((permiso) => {
                        if (permiso.NombrePermiso === "Compras" || permiso.NombrePermiso === "Productos" || permiso.NombrePermiso === "Tallas" || permiso.NombrePermiso === "Categorías" || permiso.NombrePermiso === "Proveedores") {
                        return (
                            <div key={permiso.IdPermiso} className="flex items-center">
                            <input 
                                type="checkbox" 
                                id={`permiso-${permiso.IdPermiso}`} 
                                value={permiso.IdPermiso} 
                                checked={permisosSeleccionados.includes(permiso.IdPermiso)}
                                onChange={handlePermisoChange} 
                                className="mr-2"
                            />
                            <label htmlFor={`permiso-${permiso.IdPermiso}`}>{permiso.NombrePermiso}</label>
                            </div>
                        );
                        }
                        return null;
                    })}
                </div>

                <div>
                    <Typography variant="h6" className="mb-2">Ventas</Typography>
                    {permisosList.map((permiso) => {
                        if (permiso.NombrePermiso === "Ventas" || permiso.NombrePermiso === "Pedidos" || permiso.NombrePermiso === "Abonos" || permiso.NombrePermiso === "Clientes") {
                        return (
                            <div key={permiso.IdPermiso} className="flex items-center">
                            <input 
                                type="checkbox" 
                                id={`permiso-${permiso.IdPermiso}`} 
                                value={permiso.IdPermiso} 
                                checked={permisosSeleccionados.includes(permiso.IdPermiso)}
                                onChange={handlePermisoChange} 
                                className="mr-2"
                            />
                            <label htmlFor={`permiso-${permiso.IdPermiso}`}>{permiso.NombrePermiso}</label>
                            </div>
                        );
                        }
                        return null;
                    })}
                </div>

                <div>
                    <Typography variant="h6" className="mb-2">Desempeño</Typography>
                    {permisosList.map((permiso) => {
                        if (permiso.NombrePermiso === "Gestión") {
                        return (
                            <div key={permiso.IdPermiso} className="flex items-center">
                            <input 
                                type="checkbox" 
                                id={`permiso-${permiso.IdPermiso}`} 
                                value={permiso.IdPermiso} 
                                checked={permisosSeleccionados.includes(permiso.IdPermiso)}
                                onChange={handlePermisoChange} 
                                className="mr-2"
                            />
                            <label htmlFor={`permiso-${permiso.IdPermiso}`}>{permiso.NombrePermiso}</label>
                            </div>
                        );
                        }
                        return null;
                    })}
                </div>
            </div>
          </div>
          <div className="flex justify-end items-center mt-2 grid-cols-1">
              {edit ? (
                <div>
                  <button onClick={() => setEdit(false)} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 me-1 rounded">
                    Cancelar
                  </button>
                  <button onClick={putRol} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                    Guardar Cambios
                  </button>
                </div>
              ) : (
                <button onClick={postRol} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                  Crear Rol
                </button>
              )}
            </div>
        </CardBody>
      </Card>
  
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Roles
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Nombre del Rol
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Permisos
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Estado
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Acciones
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {rolesList.map((rol) => (
                <tr key={rol.IdRol}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{rol.NombreDelRol}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {rol.Permisos ? (
                      rol.Permisos.map((permiso) => (
                        <span key={permiso.IdPermiso} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                          {permiso.NombrePermiso}
                        </span>
                      ))
                    ) : (
                      <span>No hay permisos</span>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {rol.Estado ? (
                      <button onClick={() => switchEstado(rol.IdRol)} className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full">
                        Activo
                      </button>
                    ) : (
                      <button onClick={() => switchEstado(rol.IdRol)} className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-full">
                        Inactivo
                      </button>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button onClick={() => editRol(rol.IdRol)} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
                    <button onClick={() => deleteRol(rol.IdRol)} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><TrashIcon /></button>
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

export default Roles;