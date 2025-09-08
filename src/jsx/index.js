import React, { useContext  } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Routes, Route, Outlet } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrollToTop";


/// Dashboard
import Home from "./components/Dashboard/Home";
import DashboardDark from "./components/Dashboard/DashboardDark";
import Performance from "./components/Dashboard/Performance";
import Projects from "./components/Dashboard/Projects";
import TaskSummary from "./components/Dashboard/TaskSummary";
import Blog from "./components/Dashboard/Blog";
import ManageClient from "./components/Dashboard/ManageClient";

import Finance from "./components/Dashboard/Finance";
import Employees from "./components/Dashboard/Employees";
import Task from "./components/Dashboard/Task";
import CoreHr from "./components/Dashboard/CoreHr";

//proveedor
import CompProveedorShow from "./components/Dashboard/proveedores/Proveedorshow";
import CompEditarProveedor from "./components/Dashboard/proveedores/ProveedorEdit";
//Medicamentos
import CompMedicamentoShow from "./components/Dashboard/medicamentos/Medicamentoshow";
import CompEditarMedicamento from "./components/Dashboard/medicamentos/MedicamentoEdit";
//Inventarios
import InventarioShow from "./components/Dashboard/inventarios/Inventarioshow";
import InventarioEdit from "./components/Dashboard/inventarios/InventarioEdit";
//clientes
import CompClienteShow from "./components/Dashboard/Clientes/ClienteShow";
import CompEditarCliente from "./components/Dashboard/Clientes/ClienteEdit";
//roles
import CompRolShow from "./components/Dashboard/Rol/RolShow";
import CompEditarRol from "./components/Dashboard/Rol/RolEdit";
//lotes
import LoteShow from "./components/Dashboard/Lotes/Loteshow";
import LoteEdit from "./components/Dashboard/Lotes/LoteEdit";
//usuarios
import CompUsuarioShow from "./components/Dashboard/Usuario/UsuarioShow";
//Venta
import CompVentaShow from "./components/Dashboard/Venta/VentaShow";
import CompVentaEdit from "./components/Dashboard/Venta/VentaEdit";
//persona
import PersonaShow from "./components/Dashboard/Personas/Personashow";
import PersonaEdit from "./components/Dashboard/Personas/PersonasEdit";

//vista para el usuario
import VistaUsuarioShow from "./components/Dashboard/VistaUsuarios/VistaUsuarioShow";

//Reporte Medicamentos Vencidos
import Report from "./components/Dashboard/Report";
//Reporte Ventas Realizadas
import ReportVentas from "./components/Dashboard/ReportVentas";
//Reporte Cliente Frecuente
import ReportClienteMasCompra from "./components/Dashboard/ReportClienteMasCompra";
//Reporte Auditoria
import ReportAuditoria from "./components/Dashboard/ReportAuditoria";
//Reporte Control Entradas y Salidas
import ReportES from "./components/Dashboard/ReportES";
//Reporte de venta por dia
import ReportVentasDia from "./components/Dashboard/ReportVentasxDia";
//Reporte de Ventas por semana
import ReportVentasSemana from "./components/Dashboard/ReportVentasxSemana";
//Reporte de Ventas por Mes
import ReportVentasMes from "./components/Dashboard/ReportVentasxMes";

//Apps
import Contacts from './components/AppsMenu/Contacts';
import User from './components/AppsMenu/AppProfile/User';
import UserRoles from './components/AppsMenu/AppProfile/UserRoles';
import AddRole from './components/AppsMenu/AppProfile/AddRole';
import AppProfile from "./components/AppsMenu/AppProfile/AppProfile";
import AppProfile2 from "./components/AppsMenu/AppProfile/AppProfile2";
import EditProfile from "./components/AppsMenu/AppProfile/EditProfile";
import PostDetails from "./components/AppsMenu/AppProfile/PostDetails";
import CustomerProfile from "./components/AppsMenu/AppProfile/CustomerProfile";
import AppCustomer from "./components/AppsMenu/AppProfile/AppCustomer";
import Compose from "./components/AppsMenu/Email/Compose/Compose";
import Inbox from "./components/AppsMenu/Email/Inbox/Inbox";
import Read from "./components/AppsMenu/Email/Read/Read";
import Calendar from "./components/AppsMenu/Calendar/Calendar";

/// Product List
import ProductGrid from "./components/AppsMenu/Shop/ProductGrid/ProductGrid";
import ProductList from "./components/AppsMenu/Shop/ProductList/ProductList";
import ProductDetail from "./components/AppsMenu/Shop/ProductGrid/ProductDetail";
import ProductOrder from "./components/AppsMenu/Shop/ProductOrder";
import Checkout from "./components/AppsMenu/Shop/Checkout/Checkout";
import Invoice from "./components/AppsMenu/Shop/Invoice/Invoice";
import Customers from "./components/AppsMenu/Shop/Customers/Customers";

/// Charts
import SparklineChart from "./components/charts/Sparkline";
import ChartJs from "./components/charts/Chartjs";
import RechartJs from "./components/charts/rechart";
import ApexChart from "./components/charts/apexcharts";

/// Bootstrap
import UiAccordion from "./components/bootstrap/Accordion";
import UiAlert from "./components/bootstrap/Alert";
import UiBadge from "./components/bootstrap/Badge";
import UiButton from "./components/bootstrap/Button";
import UiModal from "./components/bootstrap/Modal";
import UiButtonGroup from "./components/bootstrap/ButtonGroup";
import UiListGroup from "./components/bootstrap/ListGroup";
import UiCards from "./components/bootstrap/Cards";
import UiCarousel from "./components/bootstrap/Carousel";
import UiDropDown from "./components/bootstrap/DropDown";
import UiPopOver from "./components/bootstrap/PopOver";
import UiProgressBar from "./components/bootstrap/ProgressBar";
import UiTab from "./components/bootstrap/Tab";
import UiPagination from "./components/bootstrap/Pagination";
import UiGrid from "./components/bootstrap/Grid";
import UiTypography from "./components/bootstrap/Typography";

/// Plugins
import Select2 from "./components/PluginsMenu/Select2/Select2";
import MainSweetAlert from "./components/PluginsMenu/SweetAlert/SweetAlert";
import Toastr from "./components/PluginsMenu/Toastr/Toastr";
import JqvMap from "./components/PluginsMenu/JqvMap/JqvMap";
import Lightgallery from "./components/PluginsMenu/Lightgallery/Lightgallery";
// Widget
import Widget from "./pages/Widget";
/// Table
import SortingTable from "./components/table/SortingTable/SortingTable";
import FilteringTable from "./components/table/FilteringTable/FilteringTable";
import BootstrapTable from "./components/table/BootstrapTable";
/// Form
import Element from "./components/Forms/Element/Element";
import Wizard from "./components/Forms/Wizard/Wizard";
import CkEditor from "./components/Forms/CkEditor/CkEditor";
import Pickers from "./components/Forms/Pickers/Pickers";
import FormValidation from "./components/Forms/FormValidation/FormValidation";
/// Pages
import LockScreen from "./pages/LockScreen";
import Error400 from "./pages/Error400";
import Error403 from "./pages/Error403";
import Error404 from "./pages/Error404";
import Error500 from "./pages/Error500";
import Error503 from "./pages/Error503";

import { ThemeContext } from "../context/ThemeContext";
const allroutes = [
  // Dashboard
    { url: "", component: <Home /> },
    { url: "dashboard", component: <Home /> },
    { url: "dashboard-dark", component: <DashboardDark/> },
    { url: "core-hr", component: <CoreHr /> },
    { url: "performance", component: <Performance /> },
    { url: "project", component: <Projects /> },
    { url: "task-summary", component: <TaskSummary /> },
    { url: "blog", component: <Blog /> },
    { url: "manage-client", component: <ManageClient /> },
    
    { url: "finance", component: <Finance /> },
    { url: "employee", component: <Employees /> },
    { url: "task", component: <Task /> },

    //proveedor
    { url: 'proveedor', component: <CompProveedorShow /> },
    { url: 'edit-proveedor/:IDProveedor', component: <CompEditarProveedor /> },
    // Medicamento
    { url: 'medicamento', component: <CompMedicamentoShow /> },
    { url: 'edit-medicamento/:idMedicamento', component: <CompEditarMedicamento /> },
    //Inventario
    { url: 'inventario', component: <InventarioShow /> },
    { url: 'edit-inventario/:IdInventario', component: <InventarioEdit /> }, //importante ver las rutas y el ID
    //Cliente
    { url: 'cliente', component: <CompClienteShow /> },
    { url: 'edit-cliente/:idCliente', component: <CompEditarCliente /> },
    //Rol
    { url: 'rol', component: <CompRolShow /> },
    { url: 'edit-rol/:idRol', component: <CompEditarRol /> },
    // Lote
    { url: 'lote', component: <LoteShow />},
    { url: '/edit-lote/:IdLote', component: <LoteEdit/>},
    // Usuario
    { url: 'usuario', component: <CompUsuarioShow />},
    // venta
    { url: 'venta', component: <CompVentaShow />},
    { url: '/edit-venta/:Idventa', component: <CompVentaEdit/>},
    // persona
    { url: 'persona', component: <PersonaShow />},
    { url: '/edit-persona/:CUI', component: <PersonaEdit/>},
    //vista para usuarios
    { url: '/bienvenida', component: <VistaUsuarioShow /> },
    //Reportes Medicamentos Vencidos
    { url: "reports", component: <Report /> },
    //Reporte Ventas
    { url: "reportsventa", component: <ReportVentas /> },
    //Reporte Cliente Frecuente
    { url: "reportCfrecuente", component: <ReportClienteMasCompra /> },
    //Reporte Auditoria
    { url: "reportauditoria", component: <ReportAuditoria /> },
    //Reporte Control de Entradas y Salidas
    { url: "reportes", component: <ReportES /> },
    //Reporte Ventas Dia
    { url: "reportDia", component: <ReportVentasDia /> },
    //Reporte ventas Semana
    { url: "reportSemana", component: <ReportVentasSemana /> },
    //Reporte ventas Mes
    { url: "reportMes", component: <ReportVentasMes /> },



    

  //Apps
    { url: "contacts", component: <Contacts /> },
    { url: "user", component: <User /> },
    { url: "user-roles", component: <UserRoles /> },
    { url: "add-role", component: <AddRole /> },
    { url: "app-profile", component: <AppProfile /> },
    { url: "app-profile-2", component: <AppProfile2 /> },
    { url: "edit-profile", component: <EditProfile /> },
    { url: "post-details", component: <PostDetails /> },
    { url: "customer", component: <AppCustomer /> },
    { url: "customer-profile", component: <CustomerProfile /> },    
  // Apps  
    { url: "email-compose", component: <Compose /> },
    { url: "email-inbox", component: <Inbox /> },
    { url: "email-read", component: <Read /> },
    { url: "app-calender", component: <Calendar /> },

  // Shop
    { url: "ecom-product-grid", component: <ProductGrid /> },
    { url: "ecom-product-list", component: <ProductList /> },
    { url: "ecom-product-detail", component: <ProductDetail /> },
    { url: "ecom-product-order", component: <ProductOrder /> },
    { url: "ecom-checkout", component: <Checkout /> },
    { url: "ecom-invoice", component: <Invoice /> },
    { url: "ecom-customers", component: <Customers /> },
  // Chart
    { url: "chart-sparkline", component: <SparklineChart /> },
    { url: "chart-chartjs", component: <ChartJs /> },    
    { url: "chart-apexchart", component: <ApexChart /> },
    { url: "chart-rechart", component: <RechartJs /> },
  // Bootstrap
    { url: "ui-accordion", component: <UiAccordion /> },
    { url: "ui-alert", component: <UiAlert /> },
    { url: "ui-badge", component: <UiBadge /> },
    { url: "ui-button", component: <UiButton /> },
    { url: "ui-modal", component: <UiModal /> },
    { url: "ui-button-group", component: <UiButtonGroup /> },
    { url: "ui-list-group", component: <UiListGroup /> },
    { url: "ui-card", component: <UiCards />},
    { url: "ui-carousel", component: <UiCarousel /> },
    { url: "ui-dropdown", component: <UiDropDown /> },
    { url: "ui-popover", component: <UiPopOver /> },
    { url: "ui-progressbar", component: <UiProgressBar /> },
    { url: "ui-tab", component: <UiTab /> },
    { url: "ui-pagination", component: <UiPagination /> },
    { url: "ui-typography", component: <UiTypography /> },
    { url: "ui-grid", component: <UiGrid /> },  
  // Plugin
    { url: "uc-select2", component: <Select2 /> },
    { url: "uc-sweetalert", component: <MainSweetAlert /> },
    { url: "uc-toastr", component: <Toastr /> },
    { url: "map-jqvmap", component: <JqvMap /> },
    { url: "uc-lightgallery", component: <Lightgallery /> },
  // Widget
    { url: "widget-basic", component: <Widget /> },
  // Form
    { url: "form-element", component: <Element /> },
    { url: "form-wizard", component: <Wizard /> },
    { url: "form-ckeditor", component: <CkEditor /> },
    { url: "form-pickers", component: <Pickers /> },
    { url: "form-validation", component: <FormValidation /> },

  // table
    { url: 'table-filtering', component: <FilteringTable /> },
    { url: 'table-sorting', component: <SortingTable /> },
    { url: "table-bootstrap-basic", component: <BootstrapTable /> },
    // { url: "*", component: <Home/> },
];

const Markup = () => {   
  
  function NotFound(){    
    const url = allroutes.map((route) => route.url);
    let path = window.location.pathname
    path = path.split('/')
    path = path[path.length - 1]    
      
    if(url.indexOf(path) <= 0){     
      return <Error404 />
    }
  }
   
    return (
      <>
          <Routes>              
              <Route path='/page-lock-screen' element= {<LockScreen />} />
              <Route path='/page-error-400' element={<Error400/>} />            
              <Route path='/page-error-403' element={<Error403/>} />
              <Route path='/page-error-404' element={<Error404/>} />
              <Route path='/page-error-500' element={<Error500/>} />
              <Route path='/page-error-503' element={<Error503/>} />     
              <Route  element={<MainLayout />} > 
                  {allroutes.map((data, i) => (
                    <Route
                      key={i}
                      exact
                      path={`${data.url}`}
                      element={data.component}
                    />
                    ))}
              </Route>                
              <Route path='*' element={<NotFound/>} />     
          </Routes>     
          <ScrollToTop />          
      </>
    );       
};


  function MainLayout(){      
    const sideMenu = useSelector(state => state.sideMenu);
    return (
      <div id="main-wrapper" className={`show ${ sideMenu ? "menu-toggle" : ""}`}>  
          <Nav />
          <div className="content-body" style={{ minHeight: window.screen.height - 45 }}>          
            <Outlet />   
          </div>
        <Footer />
      </div>
    )
  };



export default Markup;
