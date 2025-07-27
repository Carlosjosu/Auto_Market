import type GrantedAuthority_1 from "./GrantedAuthority.js";
interface Authentication {
    details: unknown;
    authenticated: boolean;
    authorities?: Array<GrantedAuthority_1 | undefined>;
    credentials: unknown;
<<<<<<< HEAD
    authorities?: Array<GrantedAuthority_1 | undefined>;
    details: unknown;
    authenticated: boolean;
=======
>>>>>>> origin/develop
    principal: unknown;
}
export default Authentication;
