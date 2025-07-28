import type GrantedAuthority_1 from "./GrantedAuthority.js";
interface Authentication {
    principal: unknown;
    credentials: unknown;
    details: unknown;
    authenticated: boolean;
    authorities?: Array<GrantedAuthority_1 | undefined>;
<<<<<<< HEAD
=======
    credentials: unknown;
<<<<<<< HEAD
    authorities?: Array<GrantedAuthority_1 | undefined>;
    details: unknown;
    authenticated: boolean;
=======
>>>>>>> origin/develop
    principal: unknown;
>>>>>>> origin/develop
}
export default Authentication;
