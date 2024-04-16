import {
  Squares2X2Icon,
  UserCircleIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  CubeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BanknotesIcon ,
  ChartBarIcon,
  MapPinIcon ,
  GlobeAsiaAustraliaIcon ,
  QueueListIcon  ,
  
} from "@heroicons/react/24/solid";
import { Home, Departamentos, Categorias,Proveedores,Usuarios,Compras,Pedidos,Productos,Roles,Ciudades} from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [

  {
    title: "Configuracion",
    layout: "dashboard",
    pages: [
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Roles",
        path: "/roles",
        element: <Roles/>,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Usuarios",
        path: "/usuarios",
        element: <Usuarios />,
      },
      
    ],
  },
  {
    title: "Ubicación",
    layout: "dashboard",
    pages: [
      {
        icon: <GlobeAsiaAustraliaIcon   {...icon} />,
        name: "Ciudades",
        path: "/ciudades",
        element: <Ciudades/>,
      },
      {
        icon: <MapPinIcon  {...icon} />,
        name: "Departamentos",
        path: "/departamentos",
        element: <Departamentos />,
      },
      
    ],
  },
  {
    title:"Compras",
    layout: "dashboard",
    pages: [
      {
        icon: <Squares2X2Icon {...icon} />,
        name: "Categorias",
        path: "/categorias",
        element: <Categorias/>,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "Productos",
        path: "/productos",
        element: <Productos/>,
      },
      {
        icon: <QueueListIcon   {...icon} />,
        name: "Tallas",
        path: "/home",
        element: <Home/>,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Proveedores",
        path: "/proveedores",
        element: <Proveedores />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "Compras",
        path: "/compras",
        element: <Compras />,
      },
    ],
  },
  {
    title: "Ventas",
    layout: "dashboard",
    pages: [
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "Pedidos",
        path: "/pedidos",
        element: <Pedidos />,
      },
      {
        icon: <CurrencyDollarIcon {...icon} />,
        name: "Ventas",
        path: "/usuarios",
        element: <Usuarios />,
      },
      {
        icon: <BanknotesIcon  {...icon} />,
        name: "Abonos",
        path: "/usuarios",
        element: <Usuarios />,
      },
    ],
  },

  {
    title: "Desempeño",
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
    ],
  },

  {
    title: "login",
    layout: "auth",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Salir",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
  
];

export default routes;
