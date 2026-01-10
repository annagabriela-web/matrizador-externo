/**
 * Login Page for FIDES Management Suite - Matrizador External
 *
 * Clean, accessible login form following FIDES branding guidelines.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Basic validation
    if (!email.trim()) {
      setLocalError('Ingrese su correo electrónico');
      return;
    }
    if (!password) {
      setLocalError('Ingrese su contraseña');
      return;
    }

    try {
      await login({ email, password });
      navigate('/');
    } catch {
      // Error is handled by AuthContext
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-fides-lavender-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-fides-navy-800 mb-4">
            <span className="text-3xl font-bold text-white font-serif">F</span>
          </div>
          <h1 className="text-2xl font-bold text-fides-navy-800">
            FIDES Management Suite
          </h1>
          <p className="text-mat-text-secondary mt-1">Portal Matrizador</p>
        </div>

        {/* Login Card */}
        <div className="fides-card">
          <h2 className="fides-subtitle text-center mb-6">Bienvenido de vuelta</h2>

          {/* Error Alert */}
          {displayError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-base">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="fides-label block mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@notaria.com"
                autoComplete="email"
                className="fides-input"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="fides-label block mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="fides-input pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-mat-text-muted hover:text-mat-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="fides-btn-primary w-full py-4 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn size={22} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-6">
            <button
              type="button"
              className="text-fides-accent hover:underline text-base font-medium"
              onClick={() => alert('Contacte al administrador para restablecer su contraseña.')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-mat-text-muted text-sm mt-8">
          &copy; {new Date().getFullYear()} FIDES Management Suite
        </p>
      </div>
    </div>
  );
};

export default Login;
