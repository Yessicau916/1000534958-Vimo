import React, { useState, useEffect } from "react";
import {
  Typography, Card, CardHeader, CardBody, Input, 
} from "@material-tailwind/react";
import Axios from "axios";
import Swal from 'sweetalert2';

// Iconos
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export function Ciudades() {
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

  // Estado para guardar la lista de ciudades
  const [ciudadesList, setCiudadesList] = useState([]);
  const [departamentosList, setDepartamentosList] = useState([]);

  // Estados para los datos del formulario
  const [nombreCiudad, setNombreCiudad] = useState("");
  const [idDepartamento, setIdDepartamento] = useState("");
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  // Función para volver al modo de edición
  const volver = () => {
    empty();
    setEdit(false);
  }

  // URL de la API para ciudades y departamentos
  const URLCiudades = "http://localhost:8080/api/ciudades";
  const URLDepartamentos = "http://localhost:8080/api/departamentos";

  // Método para obtener las ciudades desde la API
  const getCiudades = async () => {
    try {
      const resp = await Axios.get(URLCiudades);
      setCiudadesList(resp.data.ciudades);
    } catch (error) {
      console.log("Error al obtener los datos de las ciudades: ", error);
    }
  }

  // Método para obtener los departamentos desde la API
  const getDepartamentos = async () => {
    try {
      const resp = await Axios.get(URLDepartamentos);
      setDepartamentosList(resp.data.departamentos);
    } catch (error) {
      console.log("Error al obtener los datos de los departamentos: ", error);
    }
  }

  // Método para limpiar el estado del formulario
  const empty = () => {
    setNombreCiudad("");
    setIdDepartamento("");
  }

  useEffect(() => {
    getCiudades();
    getDepartamentos();
  }, []);

  // Método para guardar o actualizar una ciudad
  const saveCiudad = () => {
    // Validación del nombre de la ciudad
    if (!nombreCiudad || !idDepartamento) {
      showAlert("error", "Ingrese un nombre para la ciudad y seleccione un departamento.");
      return;
    }

    // Determinar si es una operación de creación o actualización
    const method = edit ? Axios.put : Axios.post;
    const url = edit ? `${URLCiudades}/${id}` : URLCiudades;

    // Realizar la solicitud a la API
    method(url, { NombreCiudad: nombreCiudad, IdDepartamento: idDepartamento })
      .then(() => {
        showAlert("success", `Ciudad ${edit ? 'actualizada' : 'registrada'} con éxito.`);
        getCiudades();
        empty();
        setEdit(false);
      })
      .catch((error) => {
        console.log("Error al guardar la ciudad: ", error);
      });
  };

  // Método para eliminar una ciudad
  const deleteCiudad = (idCiudad) => {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Estás seguro de eliminar esta ciudad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`${URLCiudades}/${idCiudad}`)
          .then(() => {
            getCiudades();
            showAlert("success", "Ciudad eliminada con éxito.");
          })
          .catch((error) => {
            console.log("Error al eliminar la ciudad: ", error);
          });
      }
    });
  };

  // Método para editar una ciudad
  const editar = (ciudad) => {
    setEdit(true);
    setId(ciudad.IdCiudad);
    setNombreCiudad(ciudad.NombreCiudad);
    setIdDepartamento(ciudad.IdDepartamento);
  };

  // Obtener el nombre del departamento por su ID
  const getNombreDepartamento = (idDepartamento) => {
    const departamento = departamentosList.find(dep => dep.IdDepartamento === idDepartamento);
    return departamento ? departamento.NombreDepartamento : '';
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {edit ? ("Editar Ciudad") : ("Crear Ciudad")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 pl-2 pr-2 pb-2">
          <div className="grid gap-3  ">
            <div className="col-span-3 grid grid-cols-1">
              <Input 
                label="Nombre Ciudad" 
                value={nombreCiudad}
                onChange={(event) => setNombreCiudad(event.target.value)}
              />
            </div>
            <div className="col-span-1 grid grid-cols-1">
             
              <select 
                id="departamento"
                value={idDepartamento}
                onChange={(event) => setIdDepartamento(event.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-blue-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Seleccionar departamento...</option>
                {departamentosList.map(departamento => (
                  <option key={departamento.IdDepartamento} value={departamento.IdDepartamento}>
                    {departamento.NombreDepartamento}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center items-center mt-3">
            {edit ? (
              <div>
                <button onClick={volver} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 me-9 rounded">
                  Volver
                </button>
                <button onClick={saveCiudad} className="bg-orange-500 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded">
                  Editar Ciudad
                </button>
              </div>
            ) : ( 
              <button onClick={saveCiudad} className="bg-teal-400 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
                Crear Ciudad
              </button>
            )}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Ciudades
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Id", "Nombre Ciudad", "Departamento", "Funciones"].map((el) => (
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
              {ciudadesList.map((ciudad) => (
                <tr key={ciudad.IdCiudad}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{ciudad.IdCiudad}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{ciudad.NombreCiudad}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{getNombreDepartamento(ciudad.IdDepartamento)}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <button onClick={() => editar(ciudad)} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><PencilSquareIcon /></button>
                    <button onClick={() => deleteCiudad(ciudad.IdCiudad)} className="text-xs font-semibold text-blue-gray-600 btnFunciones h-6 w-6 text-gray-500"><TrashIcon /></button>
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

export default Ciudades;
