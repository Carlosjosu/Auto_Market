import type GrantedAuthority_1 from "./GrantedAuthority.js";
interface Authentication {
    details: unknown;
    authenticated: boolean;
    authorities?: Array<GrantedAuthority_1 | undefined>;
    credentials: unknown;
    principal: unknown;
}
export default Authentication;
