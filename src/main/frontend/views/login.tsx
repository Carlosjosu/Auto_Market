import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';
import { LoginOverlay } from '@vaadin/react-components/LoginOverlay.js';
import { isLogin, useAuth } from 'Frontend/security/auth';
import { CuentaService } from 'Frontend/generated/endpoints';
import { Notification } from '@vaadin/react-components/Notification';
import { useNavigate } from 'react-router-dom';
import { Button } from '@vaadin/react-components';

export const config: ViewConfig = {
  skipLayouts: true,
  menu: { exclude: true },
  loginRequired: false
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
      navigate('/', { replace: true });
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
    <>
      <LoginOverlay
        i18n={i18n}
        error={error}
        noForgotPassword
        opened
        no-autofocus
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
            navigate('/login?error=true', { replace: true });
          } else {
            Notification.show("Ingreso exitoso", { duration: 5000, position: 'top-center', theme: 'success' });
            hasError.value = false;
            await new Promise(res => setTimeout(res, 1000));
            window.location.href = '/Auto';
          }
        }}
      />
      <div style={{ marginTop: '25rem', textAlign: 'center' }}>
        <Button theme="tertiary" onClick={() => navigate('/register')}>
          ¿No tienes cuenta? Registrarse
        </Button>
      </div>
    </>
  );
}