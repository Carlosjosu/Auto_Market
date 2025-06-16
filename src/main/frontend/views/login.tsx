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
  const { state, login } = useAuth();
  const [searchParams] = useSearchParams();
  const hasError = useSignal(false);
  const error = searchParams.has('error');

  useEffect(() => {
    if (state.user) {
      navigate('/');
    }
  }, [state.user, navigate]);

  const i18n = {
    header: {
      title: 'AutoMarket UNL',
      description: 'Autos para todos los gustos y presupuestos',
    },
    form: {
      title: 'Inicio de sesion',
      username: 'Correo electronico',
      password: 'Clave',
      submit: 'Ingresar',
      forgotPassword: 'Olvidas tu clave?',
    },
    errorMessage: {
      title: 'Error',
      message: 'Usuario o clave incorrecta.',
      username: 'Usuario incorrecto',
      password: 'clave incorrecta',
    },
    additionalInformation: 'El lugar donde puedes comprar y vender autos a la vez.',
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

        console.log('Login attempt with:', username, password);
        const data = await CuentaService.login(username, password);
        console.log('Login response:', data);

        if (data?.estado === 'false') {
          Notification.show(data?.message, { duration: 5000, position: 'top-center', theme: 'error' });
          console.error('Login failed:', data);
          hasError.value = true;
          return;
        }

        await new Promise(res => setTimeout(res, 100));
        
        const { error: loginError } = await login(username, password);
        console.log('Login result:', loginError);

        if (loginError) {
          Notification.show("Error de autenticación en frontend", { duration: 5000, position: 'top-center', theme: 'error' });
          hasError.value = true;
          return;
        }

        const isLogged = await isLogin();
        console.log('isLogin result:', isLogged);
        if (isLogged) {
          Notification.show("Ingreso exitoso", { duration: 5000, position: 'top-center', theme: 'success' });
          hasError.value = false;
          navigate('/');
        } else {
          Notification.show("No se pudo verificar la sesión", { duration: 5000, position: 'top-center', theme: 'error' });
          hasError.value = true;
        }
      }}
    />
  );
}