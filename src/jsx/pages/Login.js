import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { loadingToggleAction,loginAction,
} from '../../store/actions/AuthActions';

/*Aqui se hacen las importaciones de las imagenes*/
import logo from '../../images/logo/logofullfarmacia-login.png';
import LogoWhite from '../../images/logo/logofullfarmacia-login.png';
import bg6 from '../../images/background/bg6.jpg';
import lapredilecta from '../../images/background/lapredilecta.jpg';

function Login (props) {
	const [heartActive, setHeartActive] = useState(true);	
	const navigate = useNavigate();
    const [email, setEmail] = useState('user@s');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('12345');
    const dispatch = useDispatch();

    function onLogin(e) {
		
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Se requiere un correo.';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Se requiere una contraseña';
            error = true;
        }
        setErrors(errorObj);
        if (error) {
			return ;
		}		
		dispatch(loadingToggleAction(true));
		dispatch(loginAction(email, password, navigate));
    }
  	return (        
		<div className="page-wraper">
			<div className="browse-job login-style3">
				{/* imagen del login */}
				<div className="bg-img-fix overflow-hidden" style={{ background: `url(${lapredilecta})`, backgroundSize: 'cover', height: '100vh' }}>
				{/* termina imagen del login */}	
					<div className="row gx-0">
						<div className="col-xl-4 col-lg-5 col-md-6 col-sm-12 vh-100 bg-white ">
							<div id="mCSB_1" className="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" style={{maxHeight: "653px"}}>
								<div id="mCSB_1_container" className="mCSB_container" style={{position:"relative", top:"0", left:"0", dir:"ltr"}}>
									<div className="login-form style-2">
										<div className="card-body">
											{/* Logos del login */}
											{/* codigo para que el logo se adapte al tamaño de la pantalla */}
											<div className="logo-header text-center">
												<Link to={"#"} className="logo">
													<img src={logo} alt="" className="img-fluid width-230 light-logo mx-auto" />
												</Link>
												<Link to={"#"} className="logo">
													<img src={LogoWhite} alt="" className="img-fluid width-230 dark-logo mx-auto" />
												</Link>
											</div>
											{/* Aqui termina el codigo del logo*/}										
											<div className="nav nav-tabs border-bottom-0" >														
												<div className="tab-content w-100" id="nav-tabContent">
													<div className="tab-pane fade active show" id="nav-personal">
														{props.errorMessage && (
															<div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
																{props.errorMessage}
															</div>
														)}
														{props.successMessage && (
															<div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
																{props.successMessage}
															</div>
														)}
														<form className=" dz-form pb-3" onSubmit={onLogin}>
															<h3 className="form-title m-t0">Informacion personal.</h3>
															<div className="dz-separator-outer m-b5">
																<div className="dz-separator bg-primary style-liner"></div>
															</div>
															<p>Ingrese su correo electronico y su contraseña. </p>
															<div className="form-group mb-3">
															
																<input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
																{errors.email && <div className="text-danger fs-12">{errors.email}</div>}
															</div>
															<div className="form-group mb-3">
															
																<input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />	
																{errors.password && <div className="text-danger fs-12">{errors.password}</div>}
															</div>
															<div className="form-group text-left mb-5">
																<button type="submit" className="btn btn-primary dz-xs-flex m-r5">Ingresar</button>
																<span className="form-check d-inline-block ms-2">
																	<input type="checkbox" className="form-check-input" id="check1" name="example1" />
																	<label className="form-check-label" htmlFor="check1">Recordar siempre</label>
																</span>																
															</div>
																<div className="dz-social">
																<h5 className="form-title fs-20">Puedes contactarnos en:</h5>
																<ul className="dz-social-icon dz-border dz-social-icon-lg text-white">
																	<li><a target="_blank" href="https://www.facebook.com/" className="fab fa-facebook-f btn-facebook"></a></li>
																	<li><a target="_blank" href="https://www.instagram.com/" className="fab fa-instagram btn-instagram"></a></li>
																	<li><a target="_blank" href="https://www.twitter.com/" className="fab fa-twitter btn-twitter"></a></li>
																</ul>
																</div>
														</form>
													</div>
																										
												</div>												
											</div>
										</div>
										<div className="card-footer">
											<div className=" bottom-footer clearfix m-t10 m-b20 row text-center">
												<div className="col-lg-12 text-center">
													<span> © Copyright by Francisco, Mendel, Bladimir, Ajpop <span 
														className={`heart ${heartActive ? "" : "heart-blast"}`}														
														onClick={()=>setHeartActive(!heartActive)}
													></span>
													<a href="https://www.dexignzone.com/" target="_blank"> MESO XELA </a> All rights reserved.</span> 
												</div>
											</div>
										</div>													
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>            
    )
}


const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};
export default connect(mapStateToProps)(Login);