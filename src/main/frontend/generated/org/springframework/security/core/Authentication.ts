import type GrantedAuthority_1 from "./GrantedAuthority.js";
interface Authentication {
    credentials: unknown;
    details: unknown;
    authenticated: boolean;
    authorities?: Array<GrantedAuthority_1 | undefined>;
    principal: unknown;
}
export default Authentication;
