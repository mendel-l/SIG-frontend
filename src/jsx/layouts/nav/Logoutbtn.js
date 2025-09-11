import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';

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

function LogoutPage(props) {
  const navigate = useNavigate();

  function onLogout() {
    // Eliminar el token del localStorage
    localStorage.removeItem('userDetails');
    // Navegar al login
    navigate('/login');
  }

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </>
  );
}

export default withRouter(LogoutPage);
