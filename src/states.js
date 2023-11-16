import { State } from "@9elt/miniframe";

export const api = State.from({ isOk: true, version: '0.0.0' });

export const router = State.from(null);

export const root = State.from(document.querySelector('#root').childNodes);

/** 
 * @type {State<{
 *     username: string;
 *     saved: { id: number; }[]; 
 * } | null | -1> 
 * & {
 *     login: (username: string) => Promise<void>;
 *     logout: () => void;
 *     save: (data: any) => void;
 *     unsave: (id) => void;
 * }}
 * 
 * -1    = session loading
 * null  = no session
 * {...} = valid session
 * 
 */
export const user = State.from(-1);
