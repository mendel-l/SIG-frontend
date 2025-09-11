import React,{useState} from "react";
import { NavLink ,Link, useNavigate } from "react-router-dom";

function Register({ onTabChange }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    let errorsObj = { email: '', password: '', fullName: '', userName: '', confirmPassword: '' };
    const [errors, setErrors] = useState(errorsObj);

	const navigate = useNavigate();

    function onSignUp(e) {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        
        if (fullName === '') {
            errorObj.fullName = 'El nombre completo es requerido';
            error = true;
        }
        if (userName === '') {
            errorObj.userName = 'El nombre de usuario es requerido';
            error = true;
        }
        if (email === '') {
            errorObj.email = 'El correo electrónico es requerido';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'La contraseña es requerida';
            error = true;
        }
        if (confirmPassword === '') {
            errorObj.confirmPassword = 'Confirma tu contraseña';
            error = true;
        }
        if (password !== confirmPassword) {
            errorObj.confirmPassword = 'Las contraseñas no coinciden';
            error = true;
        }
        
        setErrors(errorObj);
        if (error) return;
        // Simplificado - solo navegar al dashboard después del registro
        navigate('/dashboard');
    }
	
	return (
		<form onSubmit={onSignUp}>
			<div className="row g-3 mb-3">
				<div className="col-12">
					<label className="form-label fw-semibold text-dark">Nombre completo</label>
					<input 
						type="text" 
						className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
						placeholder="Tu nombre completo"
						value={fullName} 
						onChange={(e) => setFullName(e.target.value)}
						style={{borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px 16px'}}
					/>
					{errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
				</div>
			</div>

			<div className="row g-3 mb-3">
				<div className="col-12">
					<label className="form-label fw-semibold text-dark">Nombre de usuario</label>
					<input 
						type="text" 
						className={`form-control ${errors.userName ? 'is-invalid' : ''}`}
						placeholder="tu_usuario"
						value={userName} 
						onChange={(e) => setUserName(e.target.value)}
						style={{borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px 16px'}}
					/>
					{errors.userName && <div className="text-danger small mt-1">{errors.userName}</div>}
				</div>
			</div>

			<div className="row g-3 mb-3">
				<div className="col-12">
					<label className="form-label fw-semibold text-dark">Correo electrónico</label>
					<input 
						type="email" 
						className={`form-control ${errors.email ? 'is-invalid' : ''}`}
						placeholder="tu@email.com"
						value={email} 
						onChange={(e) => setEmail(e.target.value)}
						style={{borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px 16px'}}
					/>
					{errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
				</div>
			</div>

			<div className="row g-3 mb-3">
				<div className="col-6">
					<label className="form-label fw-semibold text-dark">Contraseña</label>
					<div className="position-relative">
						<input 
							type="password" 
							className={`form-control ${errors.password ? 'is-invalid' : ''}`}
							placeholder="••••••••"
							value={password} 
							onChange={(e) => setPassword(e.target.value)}
							style={{borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px 16px', paddingRight: '50px'}}
						/>
						<button 
							type="button" 
							className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
							style={{border: 'none', background: 'none', color: '#6c757d'}}
						>
							<i className="far fa-eye"></i>
						</button>
					</div>
					{errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
				</div>
				<div className="col-6">
					<label className="form-label fw-semibold text-dark">Confirmar contraseña</label>
					<div className="position-relative">
						<input 
							type="password" 
							className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
							placeholder="••••••••"
							value={confirmPassword} 
							onChange={(e) => setConfirmPassword(e.target.value)}
							style={{borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px 16px', paddingRight: '50px'}}
						/>
						<button 
							type="button" 
							className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
							style={{border: 'none', background: 'none', color: '#6c757d'}}
						>
							<i className="far fa-eye"></i>
						</button>
					</div>
					{errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword}</div>}
				</div>
			</div>

			<div className="mb-4">
				<div className="form-check">
					<input type="checkbox" className="form-check-input" id="terms" required />
					<label className="form-check-label text-muted" htmlFor="terms">
						Acepto los <Link to="#" className="text-decoration-none" style={{color: '#667eea'}}>Términos de Servicio</Link> y la <Link to="#" className="text-decoration-none" style={{color: '#667eea'}}>Política de Privacidad</Link>
					</label>
				</div>
			</div>

			<div className="d-flex gap-3 mb-4">
				<button 
					type="button" 
					className="btn btn-outline-secondary flex-fill py-3" 
					style={{borderRadius: '8px'}}
					onClick={() => onTabChange('login')}
				>
					Volver
				</button>
				<button 
					type="submit" 
					className="btn btn-primary flex-fill py-3 fw-semibold"
					style={{
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						border: 'none',
						borderRadius: '8px',
						fontSize: '16px'
					}}
				>
					Registrarse
				</button>
			</div>

			{/* Enlace de login */}
			<div className="text-center">
				<span className="text-muted">¿Ya tienes una cuenta? </span>
				<button 
					type="button" 
					className="btn btn-link text-decoration-none fw-semibold p-0" 
					style={{color: '#667eea'}}
					onClick={() => onTabChange('login')}
				>
					Inicia sesión
				</button>
			</div>
		</form>
	);
};


export default Register;

