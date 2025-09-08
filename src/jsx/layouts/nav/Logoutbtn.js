import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Logout } from '../../../store/actions/AuthActions';
import { isAuthenticated } from '../../../store/selectors/AuthSelectors';
import { SVGICON } from '../../constant/theme';
import axios from 'axios';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onLogout() {
    //Registrar Salida en bd
    callAPIlogout();
    // Eliminar el token del localStorage
    localStorage.removeItem('userDetails');

    // Luego, realizar la acción de cierre de sesión
    dispatch(Logout(navigate));
  }

  function callAPIlogout() {
    const tokenData = JSON.parse(localStorage.getItem('userDetails'));
    const requestData = { localId: tokenData.localId };
    //console.log(tokenData.localId);
    return axios.post(
        `http://127.0.0.1:3001/api/Usrv/logout`,
        requestData,
    );
}

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={onLogout}>
        Cerrar Sesión
      </button>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: isAuthenticated(state),
  };
};

export default withRouter(connect(mapStateToProps)(LogoutPage));
