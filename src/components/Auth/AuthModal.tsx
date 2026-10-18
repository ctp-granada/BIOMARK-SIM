import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User as UserIcon, LogIn, UserPlus, AlertCircle, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    
    // Validate institutional UGR domain (@correo.ugr.es, @go.ugr.es, @ugr.es)
    const isUgrDomain = normalizedEmail.endsWith('@correo.ugr.es') || 
                        normalizedEmail.endsWith('@go.ugr.es') || 
                        normalizedEmail.endsWith('@ugr.es');

    if (!isUgrDomain) {
      setErrorMessage('Acceso restringido: Debes utilizar una cuenta de correo institucional de la Universidad de Granada (@correo.ugr.es, @go.ugr.es o @ugr.es).');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });

        if (error) throw error;
        if (data.user) {
          setSuccessMessage('¡Sesión iniciada con éxito! Sincronizando progreso...');
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1200);
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0]
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          if (data.session) {
            setSuccessMessage('¡Cuenta de alumno creada y conectada con éxito!');
            setTimeout(() => {
              onSuccess?.();
              onClose();
            }, 1200);
          } else {
            setSuccessMessage('¡Registro completado! Si se requiere confirmación por email, revisa tu bandeja.');
            setTimeout(() => {
              onClose();
            }, 2500);
          }
        }
      }
    } catch (err: any) {
      console.error('Supabase auth error:', err);
      let message = err.message || 'Ha ocurrido un error al conectar con Supabase';
      if (message.includes('Invalid login credentials')) {
        message = 'Correo electrónico o contraseña incorrectos.';
      } else if (message.includes('User already registered')) {
        message = 'Este correo ya tiene una cuenta registrada. Prueba a iniciar sesión.';
      } else if (message.includes('Password should be at least')) {
        message = 'La contraseña debe tener al menos 6 caracteres.';
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-cyan-200" />
          </div>
          <h2 className="text-xl font-bold">
            {isLogin ? 'Acceso Alumnos y Residentes' : 'Registro de Alumno'}
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xs mx-auto">
            Sincroniza tus casos resueltos, medallas de laboratorio, racha y estadísticas en la nube con Supabase.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo / Alumno
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Carlos García (UGR)"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Correo Electrónico Institucional UGR
                </label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  @correo.ugr.es / @go.ugr.es
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@correo.ugr.es"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Solo se permite el acceso a alumnos y personal con cuenta oficial de la UGR.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Cuenta de Alumno</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/SignUp */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isLogin
                ? '¿Eres nuevo? Regístrate para guardar tu progreso'
                : '¿Ya tienes cuenta? Inicia sesión aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
