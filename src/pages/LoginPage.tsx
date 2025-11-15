import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, MapPin, Mail, Lock, ArrowRight, Shield, Sparkles, Building2 } from 'lucide-react';
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
    <div className="login-page relative min-h-screen text-white">
      <div className="login-background absolute inset-0">
        <img
          src={heroImage}
          alt="Municipalidad Palestina de los Altos"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="login-overlay absolute inset-0 bg-gradient-to-br from-night-900/85 via-night-900/75 to-night-900/90" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-14 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-28 lg:px-20">
        <div className="w-full max-w-2xl">
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

        <div className="w-full max-w-md">
          <div className="relative mb-10 overflow-hidden rounded-3xl shadow-2xl lg:hidden">
            <img
              src={heroImage}
              alt="Municipalidad Palestina de los Altos"
              className="h-56 w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-night-900/20 via-night-900/60 to-night-900/90" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
              <span className="hero-badge border-white/40 bg-white/10 backdrop-blur">
                <Building2 className="h-4 w-4" />
                Municipalidad Palestina de los Altos
              </span>
              <div>
                <h2 className="text-2xl font-semibold">SIG Municipal</h2>
                <p className="text-sm text-white/80">Protección, planificación y servicio ciudadano.</p>
              </div>
            </div>
          </div>

          <div className="login-form-card glass-card rounded-3xl border border-white/60 p-8 shadow-2xl dark:border-white/10">
            <div className="mb-8 space-y-2">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-brand-500" />
                <p className="section-label text-sm font-semibold uppercase tracking-[0.3em]">
                  Acceso seguro
                </p>
              </div>
              <h3 className="text-3xl font-bold text-[var(--color-text-primary)] dark:text-white">
                Iniciar Sesión
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="block w-full rounded-2xl border border-white/40 bg-white/70 pl-10 pr-3 py-3 text-gray-900 placeholder-gray-500 shadow-inner transition-all duration-300 focus:border-brand-400 focus:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder-gray-400"
                    placeholder="tu@email.com"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full rounded-2xl border border-white/40 bg-white/70 pl-10 pr-12 py-3 text-gray-900 placeholder-gray-500 shadow-inner transition-all duration-300 focus:border-brand-400 focus:bg-white dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder-gray-400"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full transform rounded-2xl bg-gradient-to-r from-brand-500 via-night-500 to-cream-500 py-3 px-4 text-base font-medium text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                loading={isLoading}
                disabled={isLoading}
              >
                {!isLoading && <ArrowRight className="h-5 w-5" />}
                <span>{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
