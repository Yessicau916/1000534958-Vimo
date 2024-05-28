import React, { Fragment, useRef, useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, IconButton,
  Menu, MenuHandler, MenuList, MenuItem, Avatar,
  Tooltip, Progress, Input, Button
} from "@material-tailwind/react";
import { Dialog, Transition } from '@headlessui/react'
import Axios from "axios";
import Swal from 'sweetalert2';
import {
  PencilSquareIcon, UserPlusIcon, TrashIcon
} from "@heroicons/react/24/solid";
import {
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export function Roles() {

  function showAlert(icon = "success", title, timer = 1500) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: icon,
      title: title,
    });
  }

  const [rolesList, setRolesL] = useState([]);
  const [permisosList, setPermisosL] = useState([]);
  const [rolesxPermisosList, setRolesxPermisosL] = useState([]);

  const [nombreRol, setNombreRol] = useState("");
  const [estado, setEstado] = useState(true);
  const [userPerms, setUserPerms] = useState([]);

  const [editPerms, setEditPerms] = useState([]);

  const [id, setId] = useState(0);
  const [edit, setEdit] = useState(false);

  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");


  const empty = () => {
    setId("");
    setNombreRol("");
    setEstado(true);
    setEditPerms([]);
  };

  const URLRols = "http://localhost:8080/api/roles";
  const URLPerms = "http://localhost:8080/api/permisos";
  const URLRolsxPerms = "http://localhost:8080/api/rolesxpermisos";

  const getRoles = async () => {
    try {
      const resp = await Axios.get(URLRols);
      console.log("Respuesta de la petición")
      console.log(resp)
      setRolesL(resp.data.roles);
    } catch (error) {
      console.error("Error al obtener datos de los roles: ", error);
    }
  };

  const getPerms = async () => {
    try {
      const resp = await Axios.get(URLPerms);
      setPermisosL(resp.data.permisos);
    } catch (error) {
      console.error("Error al obtener datos de los permisos: ", error);
    }
  };

  const getRolsxPerms = async () => {
    try {
      const resp = await Axios.get(URLRolsxPerms);
      setRolesxPermisosL(resp.data.rolesxpermisos);
    } catch (error) {
      console.error("Error al obtener datos de los roles x permisos: ", error);
    }
  };

  useEffect(() => {
    getRoles();
    getPerms();
    getRolsxPerms();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getRoles();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const postRoles = async () => {
    if (!nombreRol) {
      return showAlert("error", "Ingrese un nombre para el rol");
    } else if (!editPerms || editPerms.length === 0) {
      return showAlert("error", "Seleccione al menos un permiso para el rol");
    }
    showAlert("success", "Rol registrado con éxito!");
    getRoles();
    empty();
    await Axios.post(URLRols, {
      NombreDelRol: nombreRol,
      Estado: true
    }).then(() => {
      setOpen(false);
      getRolByName();
    }).catch((error) => {
      showAlert("error", "Error al registrar el rol");
      console.error("Error al registrar el rol:", error);
    });
  };

  const getRolByName = async () => {
    await Axios.get(URLRols + `/${nombreRol}`).then((response) => {
      const nuevoRolId = response.data.rol.IdRol;
      editPerms.map(perms =>
        Axios.post(URLRolsxPerms, {
          IdRol: nuevoRolId,
          IdPermiso: perms,
        }).then(() => {
          getRoles();
          getPerms();
          getRolsxPerms();
        }).catch((error) => {
          showAlert("error", "Error al enviar el rol");
          console.error("Error al enviar el rol:", error);
        })
      )
    }).catch((error) => {
      showAlert("error", "Error al obtener el ID del rol recién creado");
      console.error("Error al obtener el ID del rol:", error);
    });
  };

  const Edit = (val) => {
    if (val.IdRol === 1) {
      showAlert("error", "El rol Admin no se puede modificar!");
      return setOpen(false);
    } else {
      setOpen(true)
      setEdit(true);
      setId(val.IdRol);
      setNombreRol(val.NombreDelRol);
      setEstado(val.Estado);
      const idsRolsxPerms = rolesxPermisosList.filter((rxp) => rxp.IdRol === val.IdRol).map((r) => r.IdPermiso);
      setEditPerms(idsRolsxPerms);
    }
  };

  const putRoles = () => {
    if (!nombreRol) {
      showAlert("error", "Ingrese un nombre para el rol");
      return;
    } else if (!editPerms || editPerms.length === 0) {
      return showAlert("error", "Seleccione al menos un permiso para el rol");
    }
    showAlert("success", "Actualizando rol...");
    setOpen(false);
    empty();
    Axios.put(URLRols, {
      IdRol: id,
      NombreDelRol: nombreRol,
      Estado: true,
    }).then(() => {
      const idRolsPerms = rolesxPermisosList.filter(rxp => rxp.IdRol === id);

      const rolesxPermsToDelete = idRolsPerms.filter(idrxp => !editPerms.includes(idrxp.IdPermiso));
      const deletePromises = rolesxPermsToDelete.map(rolePerm => Axios.delete(`${URLRolsxPerms}/${rolePerm.IdRolesxpermisos}`));

      const newPermsToAdd = editPerms.filter(perm => !idRolsPerms.find(idrxp => idrxp.IdPermiso === perm));
      const addPromises = newPermsToAdd.map(perm => Axios.post(URLRolsxPerms, { IdRol: id, IdPermiso: perm }));

      Promise.all([...deletePromises, ...addPromises]).then(() => {
        showAlert("success", "Rol actualizado con éxito!");
        getRoles();
        getPerms();
        getRolsxPerms();
      }).catch((error) => {
        showAlert("error", "Error al actualizar el rol");
        console.error("Error al actualizar el rol:", error);
      });
    }).catch((error) => {
      showAlert("error", "Error al actualizar el rol");
      console.error("Error al actualizar el rol:", error);
    });
  };

  const switchEstado = (id, nom) => {
    try {
      if (rolesList.some((rol) => (rol.IdRol === id && rol.IdRol === 1))) {
        showAlert("error", "Este rol no se puede desactivar!");
        return;
      }
      //     let est = rolesList.some((rol) => (rol.IdRol === id && rol.Estado))
      //     if (est) {
      //       est = false;
      //     } else {
      //       est = true;
      //     }
      //     Axios.put(URLRols, {
      //       IdRol: id,
      //       NombreDelRol: nom,
      //       Estado: est,
      //     }).then(() => {
      //       showAlert("success", "Cambiando estado...");
      //       setTimeout(() => {
      //         showAlert("success", "Estado modificado.");
      //         getRoles();
      //       }, 500);
      //     })
      //   } catch (error) {
      //     showAlert("error", "Error al modificar el estado.");
      //     console.log("Error al modificar el estado: ", error);
      //   }
      // };
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Estás a punto de cambiar el estado de este rol!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, cambia el estado del rol
          let est = rolesList.some((rol) => rol.IdRol === id && rol.Estado);
          est ? (est = false) : (est = true);
          Axios.put(URLRols, {
            IdRol: id,
            NombreDelRol: nom,
            Estado: est,
          }).then(() => {
            showAlert("success", "Cambiando estado...");
            setTimeout(() => {
              showAlert("success", "Estado modificado.");
              getRoles();
            }, 500);
          });
        }
      });
    } catch (error) {
      showAlert("error", "Error al modificar el estado.");
      console.log("Error al modificar el estado: ", error);
    }
  };
  //buscador

  // Agrega un nuevo estado para almacenar los roles filtrados
  const [filteredRoles, setFilteredRoles] = useState([]);

  // Crea la función para filtrar los roles
  const filterRoles = (searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = rolesList.filter((rol) =>
      Object.values(rol).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    console.log("Carga inicial de roles")
    console.log(filtered)
    setFilteredRoles(filtered);
  };
  // Dentro del useEffect que se ejecuta cuando cambia searchTerm, llama a filterRoles
  useEffect(() => {
    filterRoles(searchTerm);
  }, [searchTerm]);

  //delete
  const deleteRoles = (idRol) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar este rol?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(idRol)
        Axios.delete(URLRols + `/${idRol}`)
          .then(() => {
            getRoles();
            Swal.fire(
              'Eliminado!',
              'El rol ha sido eliminado.',
              'success'
            );
          })
          .catch((error) => {
            console.log(error);
            console.log("Error al eliminar rol");
          });
      }
    });
  };

   // Estados para el paginado
   const [currentPage, setCurrentPage] = useState(1);
   const [rolesPerPage] = useState(3); // Número de categorías por página

   // Función para manejar el cambio de página
const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Calcula las categorías para la página actual
const indexOfLastRol = currentPage * rolesPerPage;
const indexOfFirstRol = indexOfLastRol - rolesPerPage;
const currentRols = rolesList.slice(
  indexOfFirstRol,
  indexOfLastRol
);
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

                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-">
                  <Card className="formRegUsu">
                    <CardHeader variant="gradient" className="mb-5 p-5 " color="indigo">
                      <Typography variant="h6" color="withe" className="text-left">
                        {edit ? "Editar rol" : "Crear rol"}
                      </Typography>
                    </CardHeader>
                    <CardBody className="px-2 pt-0 pb-2">
                      <div className="flex justify-center grid-cols-2 gap-3">
                        <div className="col-span-1 mb-3">
                          <Input
                            label="Nombre para el rol"
                            value={nombreRol}
                            onChange={(event) => setNombreRol(event.target.value)} />
                        </div>
                      </div>
                      <div className="gap-3 mt-3 mx-5 grid grid-cols-3 justify-items-start">
                        {permisosList.map((p) => (
                          <label key={p.IdPermiso} className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-5 w-5"
                              id={p.IdPermiso}
                              value={p.IdPermiso}
                              label={p.NombrePermiso}
                              checked={editPerms.includes(p.IdPermiso)} // Comprobamos si el permiso está en editPerms
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const permisoId = p.IdPermiso;
                                setEditPerms((prevPerms) => {
                                  if (isChecked) {
                                    return [...prevPerms, permisoId]; // Agregamos el permiso a la lista si está marcado
                                  } else {
                                    return prevPerms.filter((perm) => perm !== permisoId); // Eliminamos el permiso si está desmarcado
                                  }
                                });
                              }}
                            />
                            <span className="ml-2 text-gray-700">{p.NombrePermiso}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex justify-center items-center mt-3">
                        <div>
                          {edit ?
                            <Button onClick={(e) => {
                              putRoles();
                            }} className="bg-teal-400  hover:bg-teal-800 text-white font-bold py-2 px-4 rounded me-5">
                              Editar rol
                            </Button>
                            :
                            <Button onClick={(e) => {
                              postRoles();
                            }} className="bg-teal-400  hover:bg-teal-800 text-white font-bold py-2 px-4 rounded me-5">
                              Crear rol
                            </Button>
                          }
                          <Button onClick={(e) => {
                            setOpen(false);
                            empty();
                          }} className="bg-red-400 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="md:flex md:items-center">
          <Input
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <Button className="bg-teal-300 hover:bg-teal-600 px-3 py-2 flex items-center border" onClick={() => { setOpen(true), setEdit(false); }}>
            <UserPlusIcon className="h-6 w-6 me-2" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader variant="gradient" color="indigo" className="mb-8 p-6 cardHeadCol">
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Roles
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-0 pb-5">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre del rol", "Estado", "Editar"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[13px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="IdBodyTable">
              {currentRols.map((rol) => (
                <tr key={rol.IdRol} id={`User${rol.IdRol}`}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{rol.NombreDelRol}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {rol.Estado ? (
                      <Button onClick={() => {
                        switchEstado(rol.IdRol, rol.NombreDelRol)
                      }} className="bg-green-300 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">
                        Activo
                      </Button>
                    ) : (
                      <Button onClick={() => {
                        switchEstado(rol.IdRol, rol.NombreDelRol)
                      }} className="bg-red-300 hover:bg-red-green-600 text-white font-bold py-2 px-4 rounded-full">
                        Inactivo
                      </Button>
                    )}
                  </td>
                  <td className=" border-blue-gray-50 py-3 px-5">
                    <button
                      onClick={() => {
                        if (rol.IdRol === 1) {
                          showAlert("error", "El rol Admin no se puede modificar!");
                          return setOpen(false);
                        } else { Edit(rol), setOpen(true) }
                      }}
                      className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
                    <button className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500" onClick={() => deleteRoles(user.IdRol)}><TrashIcon /></button>

                  </td>
                </tr>
              ))}
            </tbody>
            {filteredRoles.map((rol) => (
  <tr key={rol.IdRol} id={`User${rol.IdRol}`}>
    {/* Renderizado de las filas de la tabla */}
  </tr>
))}
{currentRols.map((rol) => (
  <tr key={rol.IdRol} id={`User${rol.IdRol}`}>
    {/* Renderizado de las filas de la tabla */}
  </tr>
))}

            
          </table>
           {/* Paginación */}
          <ul className="flex justify-center mt-4">
            {[...Array(Math.ceil(rolesList.length / rolesPerPage)).keys()].map((number) => (
              <li key={number} className="cursor-pointer mx-1">
                <button onClick={() => paginate(number + 1)} className="px-3 py-1 bg-indigo-400 text-white rounded">
                  {number + 1}
                </button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
      
    </div>
  );
}

export default Roles;