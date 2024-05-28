import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import Swal from "sweetalert2"; // Importa sweetalert2

export function SignIn() {
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [checkAceptado, setCheckAceptado] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicializa useNavigate

  async function handleSubmit(event) {
    event.preventDefault();
    if (!checkAceptado) {
      Swal.fire({
        icon: 'warning',
        title: 'Términos y Condiciones',
        text: 'Debes aceptar los términos y condiciones para continuar.',
      });
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, pass }),
      });
    
      // Depurar la respuesta del servidor
      const responseText = await response.text();
      console.log('Respuesta del servidor:', responseText);
    
      // Verificar si la respuesta es JSON
      try {
        const data = JSON.parse(responseText);
        if (!response.ok) {
          setError(data.error || 'Error de inicio de sesión');
          return;
        }
        localStorage.setItem('token', data.token);
        navigate('/dashboard/usuarios'); // Redirige a la vista de usuarios en el dashboard
      } catch (jsonError) {
        console.error('La respuesta no es JSON:', jsonError);
        setError('Error de inicio de sesión');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError('Error de inicio de sesión');
    }
    
  }

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24 bg-gray-200 rounded-3xl">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">VM STORE XXI</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Correo
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Contraseña
            </Typography>
            <Input
              type="password"
              size="lg"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            checked={checkAceptado}
            onChange={(e) => setCheckAceptado(e.target.checked)}
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                Acepto los&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Términos y condiciones
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          {error && <Typography variant="paragraph" className="text-red-500 text-sm mt-2">{error}</Typography>}
          <Button className="mt-6" fullWidth type="submit">
            Ingresar
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Olvidaste tu contraseña?</a>
            </Typography>
          </div>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            ¿No tienes una cuenta?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Registrarse</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/circulo-logo.png"
          className="h-full w-full object-cover rounded-3xl lg:w"
        />
      </div>
    </section>
  );
}

export default SignIn;
