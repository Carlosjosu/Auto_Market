import type GrantedAuthority_1 from "./GrantedAuthority.js";
interface Authentication {
    principal: unknown;
    details: unknown;
    authenticated: boolean;
    authorities?: Array<GrantedAuthority_1 | undefined>;
    credentials: unknown;
}
export default Authentication;
