import type GrantedAuthority_1 from "./GrantedAuthority.js";
interface Authentication {
    credentials: unknown;
    authorities?: Array<GrantedAuthority_1 | undefined>;
    details: unknown;
    authenticated: boolean;
    principal: unknown;
}
export default Authentication;
