import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, MapPin, Mail, Lock, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const heroImage = '/login/muni.jpeg';
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
      navigate(from, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Por favor, verifica tus credenciales';
      showError('Error al iniciar sesión', errorMessage);
    }
  };

  return (
    <div className="login-page relative h-screen w-screen text-white overflow-hidden">
      <div className="login-background absolute inset-0">
        <img
          src={heroImage}
          alt="Municipalidad Palestina de los Altos"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="login-overlay absolute inset-0 bg-gradient-to-br from-night-900/85 via-night-900/75 to-night-900/90" />
      </div>

      <div className="relative z-10 h-full w-full lg:max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-28 px-4 lg:px-20 py-4 lg:py-12 overflow-y-auto lg:overflow-hidden">
        {/* Hero card - solo en desktop */}
        <div className="hidden lg:block w-full max-w-2xl">
          <div className="login-hero-card w-full rounded-[2.5rem] border border-white/15 bg-white/10 p-10 text-white shadow-2xl backdrop-blur-2xl">
            <div className="space-y-6">
              <span className="hero-pill hero-badge inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em]">
                <Shield className="h-4 w-4" />
                SIG Municipal
              </span>
              <div className="flex items-center gap-4">
                <div className="hero-icon flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/25 backdrop-blur">
                  <MapPin className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold leading-tight">MUNICIPALIDAD PALESTINA DE LOS ALTOS</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario - responsive para mobile y desktop */}
        <div className="w-full max-w-sm lg:max-w-md shrink-0">
          <div className="login-form-card glass-card rounded-3xl border border-white/60 p-5 lg:p-8 shadow-2xl dark:border-white/10">
            <div className="mb-5 lg:mb-8 space-y-1.5 lg:space-y-2">
              <div className="flex items-center gap-2 lg:gap-3">
                <Sparkles className="h-4 lg:h-5 w-4 lg:w-5 text-brand-500" />
                <p className="section-label text-xs lg:text-sm font-semibold uppercase tracking-[0.3em]">
                  Acceso seguro
                </p>
              </div>
              <h3 className="text-xl lg:text-3xl font-bold text-[var(--color-text-primary)] dark:text-white">
                Iniciar Sesión
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 lg:space-y-6">
              <div>
                <label htmlFor="email" className="mb-1.5 lg:mb-2 block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 lg:h-5 w-4 lg:w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="block w-full rounded-2xl border border-white/40 bg-white/70 pl-9 lg:pl-10 pr-3 py-2 lg:py-3 text-sm lg:text-base text-gray-900 placeholder-gray-500 shadow-inner transition-all duration-300 focus:border-brand-400 focus:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder-gray-400"
                    placeholder="tu@email.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 lg:mt-2 text-xs lg:text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 lg:mb-2 block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 lg:h-5 w-4 lg:w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full rounded-2xl border border-white/40 bg-white/70 pl-9 lg:pl-10 pr-10 lg:pr-12 py-2 lg:py-3 text-sm lg:text-base text-gray-900 placeholder-gray-500 shadow-inner transition-all duration-300 focus:border-brand-400 focus:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder-gray-400"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 lg:h-5 w-4 lg:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-4 lg:h-5 w-4 lg:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 lg:mt-2 text-xs lg:text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 lg:p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-xs lg:text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full transform rounded-2xl bg-gradient-to-r from-brand-500 via-night-500 to-cream-500 py-2.5 lg:py-3 px-4 text-sm lg:text-base font-medium text-white shadow-xl transition-all duration-300 lg:hover:-translate-y-0.5 lg:hover:shadow-2xl active:scale-[0.98]"
                loading={isLoading}
                disabled={isLoading}
              >
                {!isLoading && <ArrowRight className="h-4 lg:h-5 w-4 lg:w-5" />}
                <span>{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
              </Button>
            </form>

            <div className="mt-4 lg:mt-6 text-center">
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                ¿No tienes una cuenta?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
