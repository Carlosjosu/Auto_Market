import type GrantedAuthority_1 from "./GrantedAuthority.js";
interface Authentication {
    credentials: unknown;
    principal: unknown;
    authorities?: Array<GrantedAuthority_1 | undefined>;
    authenticated: boolean;
    details: unknown;
}
export default Authentication;
