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
  UsersIcon,
  
} from "@heroicons/react/24/solid";
import { Home,Ventas,Abonos,DetalleVenta ,Departamentos,Cliente,Compras, Tallas,Categorias,Proveedores,Usuarios,Pedidos,Productos,Roles,Ciudades, DetalleCompra, Empleados} from "@/pages/dashboard";
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
      {
        icon: <UsersIcon {...icon} />,
        name: "Empleados",
        path: "/empleados",
        element: <Empleados />,
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
        path: "/talla",
        element: <Tallas/>,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Proveedores",
        path: "/proveedores",
        element: <Proveedores />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Clientes",
        path: "/clientes",
        element: <Cliente/>,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "Compras",
        path: "/compras",
        element: <Compras />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "DetalleCompra",
        path: "/detalleCompra",
        element: <DetalleCompra />,
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
        path: "/ventas",
        element: <Ventas />,
      },
      {
        icon: <CurrencyDollarIcon {...icon} />,
        name: " detallle Ventas",
        path: "/detalleVenta",
        element: <DetalleVenta />,
      },
      {
        icon: <BanknotesIcon  {...icon} />,
        name: "Abonos",
        path: "/abonos",
        element: <Abonos />,
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

  {
    title: "home",
    layout: "Tienda",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Home",
        path: "/home",
        element: <Home />,
      },
    ],
  },
  
];

export default routes;
