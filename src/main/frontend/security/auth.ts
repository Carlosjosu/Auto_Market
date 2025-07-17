import { configureAuth } from '@vaadin/hilla-react-auth';
import { CuentaService } from 'Frontend/generated/endpoints';

const auth = configureAuth(CuentaService.getAuthentication, {
    getRoles: (user) => user.authorities?.map((v) => v ?? '')
});

export const useAuth = auth.useAuth;
export const isLogin = CuentaService.isLogin;
export const role = CuentaService.view_rol;
export const AuthProvider = auth.AuthProvider;
