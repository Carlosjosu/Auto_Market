import type GrantedAuthority_1 from "./GrantedAuthority.js";
interface Authentication {
    principal: unknown;
    credentials: unknown;
    details: unknown;
    authenticated: boolean;
    authorities?: Array<GrantedAuthority_1 | undefined>;
}
export default Authentication;
