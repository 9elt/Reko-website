import { State } from "@9elt/miniframe";

export const api = State.from({ isOk: true, version: '0.0.0' });

export const router = State.from(null);

export const root = State.from(document.querySelector('#root').childNodes);

export const user = State.from('_nelt');
