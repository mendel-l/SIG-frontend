import React,{useState, useEffect} from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

import LogoutPage from './Logout';

import { IMAGES, SVGICON } from "../../constant/theme";
import Logoutbtn from "./Logoutbtn";

const NotificationBlog =({classChange}) =>{
	return(
		<>
			<li>
				<div className="timeline-panel">
					<div className="media me-2">
						<img alt="images" width={50} src={IMAGES.Avatar} />
					</div>
					<div className="media-body">
						<h6 className="mb-1">Dr sultads Send you Photo</h6>
						<small className="d-block">29 July 2022 - 02:26 PM</small>
					</div>
				</div>
			</li>
			<li>
				<div className="timeline-panel">
					<div className={`media me-2 ${classChange}`}>KG</div>
					<div className="media-body">
						<h6 className="mb-1">Resport created successfully</h6>
						<small className="d-block">29 July 2022 - 02:26 PM</small>
					</div>
				</div>
			</li>
			<li>
				<div className="timeline-panel">
					<div className={`media me-2 ${classChange}`}><i className="fa fa-home" /></div>
					<div className="media-body">
						<h6 className="mb-1">Reminder : Treatment Time!</h6>
						<small className="d-block">29 July 2022 - 02:26 PM</small>
					</div>
				</div>
			</li>
		</>
	)
}



const Header = ({ onNote }) => {
  const [headerFix, setheaderFix] = useState(false);

  useEffect(() => {
    // Este efecto se ejecuta después de que el componente se haya montado en el DOM.
    // Aquí puedes acceder al elemento con id "nombreUsuario" y establecer su contenido.
    const tokenData = localStorage.getItem('userDetails');
    const tokenParse = JSON.parse(tokenData);
    const labelElement = document.getElementById("nombreUsuario");

    if (labelElement && tokenParse) {
      labelElement.textContent = tokenParse.displayName;
    }

    // También puedes configurar un evento de desplazamiento en este efecto si es necesario.
    window.addEventListener("scroll", () => {
      setheaderFix(window.scrollY > 50);
    });

    // Asegúrate de limpiar el evento cuando el componente se desmonta.
    return () => {
      window.removeEventListener("scroll", () => {
        setheaderFix(false);
      });
    };
  }, []);

  return (
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div className="input-group search-area">

              
              </div>
            </div>
            <ul className="navbar-nav header-right">
              <Dropdown as="li" className="nav-item dropdown notification_dropdown">
                {/* Resto del código del primer Dropdown */}
              </Dropdown>
              <Dropdown as="li" className="nav-item dropdown notification_dropdown">
                {/* Resto del código del segundo Dropdown */}
              </Dropdown>
              <Dropdown as="li" className="nav-item dropdown notification_dropdown ">
                <Dropdown.Toggle
                  variant=""
                  as="a"
                  className="nav-link  i-false c-pointer"
                  onClick={() => onNote()}
                >
                  <svg
                    width="20"
                    height="22"
                    viewBox="0 0 22 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.9026 6.85114L12.4593 10.4642C11.6198 11.1302 10.4387 11.1302 9.59922 10.4642L5.11844 6.85114"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.9089 19C18.9502 19.0084 21 16.5095 21 13.4384V6.57001C21 3.49883 18.9502 1 15.9089 1H6.09114C3.04979 1 1 3.49883 1 6.57001V13.4384C1 16.5095 3.04979 19.0084 6.09114 19H15.9089Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Dropdown.Toggle>
              </Dropdown>
              <li className="nav-item align-items-center header-border">
                <Logoutbtn />
              </li>
              <li className="nav-item ps-3">
                <Dropdown className="header-profile2">
				<div className="header-info">
					<br></br>
					<h6 id="nombreUsuario"></h6>
				</div>
                </Dropdown>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;

