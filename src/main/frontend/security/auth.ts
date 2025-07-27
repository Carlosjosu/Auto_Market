import { configureAuth } from '@vaadin/hilla-react-auth';
import { CuentaService } from 'Frontend/generated/endpoints';

const auth = configureAuth(CuentaService.getAuthentication, {
<<<<<<< HEAD
    getRoles: (user) => user.authorities?.map((v) => v ?? ''),
=======
    getRoles: (user) => user.authorities?.map((v) => v ?? '')
>>>>>>> origin/develop
});

export const useAuth = auth.useAuth;
export const isLogin = CuentaService.isLogin;
export const role = CuentaService.view_rol;
<<<<<<< HEAD
export const AuthProvider = auth.AuthProvider;
=======
export const AuthProvider = auth.AuthProvider;
>>>>>>> origin/develop
