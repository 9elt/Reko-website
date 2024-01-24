import { State } from "@9elt/miniframe";

/**
 * @type {State<null | 0 | string>}
 * 
 * null    = loading api status
 * 0       = api is offline
 * string  = api version
 */
export const version = new State(null);

/**
 * @type {State<string> & {
*     reload: () => void;
*     set: (route: string) => void;
*     hydrate: () => void;
* }}
*/
export const router = new State(window.location.pathname + window.location.hash);

/**
 * @type {State<HTMLElement[]>}
 */
export const root = new State(document.querySelector('#root').childNodes);

/**
 * @type {State<null | -1 | {
*    username: string;
*    saved: { id: number; }[];
* }> & {
*    login: (username: string) => Promise<void>;
*    logout: () => void;
*    saved: State<{ id: number; }[]>;
*    save: (data: any) => void;
*    unsave: (id: any) => void;
* }}
* 
* null  = loading session
* 0     = no session
* {...} = valid session
*/
export const session = new State(null);
