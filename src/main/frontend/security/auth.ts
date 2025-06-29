import { configureAuth } from '@vaadin/hilla-react-auth';
import { CuentaService } from 'Frontend/generated/endpoints';

const auth = configureAuth(CuentaService.getAuthentication, {
    getRoles: (user): readonly string[] => {
        // Asegurar que siempre retorne un array de strings
        if (!user?.authorities) return [];
        
        return user.authorities
            .map((v) => {
                // Manejar tanto objetos GrantedAuthority como strings
                if (typeof v === 'string') return v;
                if (v && typeof v === 'object' && 'authority' in v) {
                    return v.authority || '';
                }
                return '';
            })
            .filter((role): role is string => Boolean(role));
    },
});

export const useAuth = auth.useAuth;
export const isLogin = CuentaService.isLogin;
export const role = CuentaService.view_rol;
export const AuthProvider = auth.AuthProvider;