import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Registration from './Registration'

function Login () {
	const navigate = useNavigate();
    const [email, setEmail] = useState('');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('login');

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
		// Simplificado - solo navegar al dashboard por ahora
		navigate('/dashboard');
    }
  	return (        
		<div className="page-wraper">
			<div className="browse-job login-style3">
				{/* Fondo con imagen de paisaje */}
				<div className="bg-img-fix overflow-hidden" style={{ 
					background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', 
					height: '100vh',
					position: 'relative'
				}}>
					{/* Overlay con gradiente sutil */}
					<div style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.6) 50%, rgba(15, 52, 96, 0.8) 100%)'
					}}></div>
					
					<div className="row gx-0 h-100">
						{/* Sección izquierda - Arte visual */}
						<div className="col-xl-7 col-lg-6 d-none d-lg-flex align-items-center justify-content-center position-relative">
							<div className="text-center text-white px-5">

								{/* Contenido central */}
								<div className="mt-5">
									<div className="mb-4">
										<div className="d-inline-block p-4 rounded-circle" style={{
											background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
											width: '120px',
											height: '120px'
										}}>
											<i className="fas fa-mountain text-white" style={{fontSize: '3rem'}}></i>
										</div>
									</div>
									<h1 className="display-4 fw-bold mb-4 text-white">
										Bienvenido al Futuro
									</h1>
									<p className="lead mb-5 text-white-75">
										Explora nuevas posibilidades con nuestro sistema de gestión avanzado
									</p>
								</div>

								{/* Sistema SIG en la esquina inferior izquierda */}
								<div className="position-absolute bottom-0 start-0 p-4">
									<div className="d-flex align-items-center">
										<div className="me-3">
											<div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
												 style={{width: '50px', height: '50px'}}>
												<i className="fas fa-user text-white"></i>
											</div>
										</div>
										<div>
											<h6 className="text-white mb-0">Sistema SIG</h6>
											<small className="text-white-50">Gestión & Tecnología</small>
										</div>
									</div>
								</div>

							</div>
						</div>

						{/* Sección derecha - Formulario con recuadro degradado */}
						<div className="col-xl-5 col-lg-6 col-md-12 vh-100 d-flex align-items-center justify-content-center">
							<div className="w-100 px-4 px-lg-5">
								{/* Recuadro con gradiente */}
								<div className="rounded-4 p-5 shadow-lg" style={{
									background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
									border: '1px solid rgba(255, 255, 255, 0.2)',
									backdropFilter: 'blur(10px)'
								}}>
									{/* Header del formulario */}
									<div className="mb-4">
										<h3 className="fw-bold text-dark mb-0"></h3>
									</div>

									<div className="mb-4">
									
										<p className="text-muted mb-0">
											{activeTab === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
										</p>
									</div>

									{/* Tabs */}
									<div className="d-flex mb-4" style={{borderRadius: '12px', background: '#f1f3f4', padding: '6px'}}>
										<button 
											className={`btn flex-fill py-3 ${activeTab === 'login' ? 'btn-primary' : 'btn-link'}`}
											onClick={() => setActiveTab('login')}
											style={{
												borderRadius: '8px',
												border: 'none',
												fontWeight: '600',
												color: activeTab === 'login' ? 'white' : '#6c757d',
												fontSize: '14px'
											}}
										>
											Iniciar Sesión
										</button>
										<button 
											className={`btn flex-fill py-3 ${activeTab === 'register' ? 'btn-primary' : 'btn-link'}`}
											onClick={() => setActiveTab('register')}
											style={{
												borderRadius: '8px',
												border: 'none',
												fontWeight: '600',
												color: activeTab === 'register' ? 'white' : '#6c757d',
												fontSize: '14px'
											}}
										>
											Registrarse
										</button>
									</div>

									{/* Contenido de tabs */}
									{activeTab === 'login' ? (
										<form onSubmit={onLogin}>
											<div className="mb-4">
												<input 
													type="email" 
													className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
													placeholder="Email"
													value={email} 
													onChange={(e) => setEmail(e.target.value)}
													style={{borderRadius: '12px', border: '1px solid #e9ecef', padding: '16px 20px'}}
												/>
												{errors.email && <div className="text-danger small mt-2">{errors.email}</div>}
											</div>

											<div className="mb-4">
												<div className="position-relative">
													<input 
														type="password" 
														className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
														placeholder="Password"
														value={password} 
														onChange={(e) => setPassword(e.target.value)}
														style={{borderRadius: '12px', border: '1px solid #e9ecef', padding: '16px 20px', paddingRight: '60px'}}
													/>
													<button 
														type="button" 
														className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-4"
														style={{border: 'none', background: 'none', color: '#6c757d'}}
													>
														<i className="far fa-eye"></i>
													</button>
												</div>
												{errors.password && <div className="text-danger small mt-2">{errors.password}</div>}
											</div>

											<div className="d-flex justify-content-end mb-4">
												<Link to="#" className="text-decoration-none" style={{color: '#dc3545', fontSize: '14px'}}>
													¿Olvidaste tu contraseña?
												</Link>
											</div>

											<button 
												type="submit" 
												className="btn btn-primary w-100 py-3 fw-semibold mb-4"
												style={{
													borderRadius: '12px',
													fontSize: '16px'
												}}
											>
												Iniciar Sesión
											</button>
										</form>
									) : (
										<Registration onTabChange={setActiveTab} />
									)}

									{/* Enlace de cambio */}
									<div className="text-center">
										<span className="text-muted">
											{activeTab === 'login' ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
										</span>
										<button 
											type="button" 
											className="btn btn-link text-decoration-none fw-semibold p-0" 
											style={{color: '#0d6efd'}}
											onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
										>
											{activeTab === 'login' ? 'Regístrate' : 'Inicia sesión'}
										</button>
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


export default Login;