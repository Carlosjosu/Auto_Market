<<<<<<< HEAD
import { useEffect, React } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';
import { LoginOverlay } from '@vaadin/react-components/LoginOverlay.js';
import { isLogin, useAuth } from 'Frontend/security/auth';
import { CuentaService } from 'Frontend/generated/endpoints';
import { Notification } from '@vaadin/react-components/Notification';
import { useNavigate } from 'react-router-dom';

export const config: ViewConfig = {
  skipLayouts: true,
  menu: { exclude: true },
};

export default function LoginView() {

  console.log('LOGIN');
  const navigate = useNavigate();
  const { state } = useAuth();
  const [searchParams] = useSearchParams();
  const hasError = useSignal(false);
  const error = searchParams.has('error');

  useEffect(() => {
    if (state.user) {
      console.log('REDIRIGI POR ESTAR AUTENTICADO:');
      navigate('/');
    }
  }, [state.user]);

  const i18n = {
    header: {
      title: 'AutoMarket UNL',
      description: 'Tu espacio confiable para comprar y vender autos.',
    },
    form: {
      title: 'Iniciar sesion',
      username: 'Correo electronico',
      password: 'Clave',
      submit: 'Ingresar',
    },
    errorMessage: {
      title: 'Error',
      message: 'Correo o clave incorrectos.',
      username: 'Correo no válido',
      password: 'Clave incorrecta',
    },
    additionalInformation: 'AutoMarket UNL es tu aliado para encontrar el auto ideal o vender el tuyo facilmente.',
  };

  useEffect(() => {
    CuentaService.createRoles()
      .then(() => CuentaService.createUsuarios())
      .then(() => { hasError.value = false; })
  }, []);


  return (
    <LoginOverlay
      i18n={i18n} error={error} noForgotPassword opened no-autofocus
      onErrorChanged={(event) => {
        console.log(event);
        hasError.value = event.detail.value;
      }}
      onLogin={async ({ detail: { username, password } }) => {

        console.log('Login intentado con:', username, password);
        const data = await CuentaService.login(username, password);
        console.log('Login indica:', data);
        const isLogged = await isLogin();
        console.log('isLogin indica:', isLogged);
        if (data?.estado === 'false') {
          Notification.show(data?.message, { duration: 5000, position: 'top-center', theme: 'error' });
          console.error('Login fallo:', data);
          hasError.value = true;
          navigate('/login?error=true');
        } else {
          Notification.show("Ingreso exitoso", { duration: 5000, position: 'top-center', theme: 'success' });
          hasError.value = false;
          await new Promise(res => setTimeout(res, 1000));
          window.location.href = '/';
        }
      }}
    />
=======
import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí va la lógica de autenticación
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/ruta/a/tu/imagen.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          padding: '2rem 2.5rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          minWidth: '320px',
          maxWidth: '90vw',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                marginTop: '0.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#1976d2',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
>>>>>>> origin/develop
  );
}