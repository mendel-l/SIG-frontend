import { lazy, Suspense, useEffect} from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';

/// Components
import Index from "./jsx";
import {  Route, Routes, useLocation , useNavigate , useParams, Navigate } from 'react-router-dom';
/// Style
import "./other/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./css/style.css";

const SignUp = lazy(() => import('./jsx/pages/Registration'));
const Login = lazy(() => {
    return new Promise(resolve => {
    setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
  });
});

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
	
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}



function App () {
    let routeblog = (         
      <Routes>   
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<Login />} />
        <Route path='/page-register' element={<SignUp />} />
        <Route path='/dashboard' element={<Index />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes> 
    );
    // Simplificado - siempre mostrar rutas de autenticación por ahora
    return (
        <div className="vh-100">
            <Suspense fallback={
                <div id="preloader">
                    <div className="sk-three-bounce">
                        <div className="sk-child sk-bounce1"></div>
                        <div className="sk-child sk-bounce2"></div>
                        <div className="sk-child sk-bounce3"></div>
                    </div>
                </div>
              }
            >
                {routeblog}
            </Suspense>
        </div>
    );
};


const AppWithRouter = withRouter(App);

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <AppWithRouter />
    </Provider>
  );
} 

