import { api } from "./states";
import { Cache } from "./util";

const REKO = 'http://127.0.0.1:3000';

export const API_CACHE = new Cache();

export default async function rekoAPI(url) {
    try {
        if (API_CACHE.has(url))
            return API_CACHE.get(url);
        const res = await fetch(REKO + url);
        const data = res.headers.get('content-type') === 'application/json'
            ? await res.json() : await res.text();
        if (!res.ok)
            throw data;
        return API_CACHE.set(url, data);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

rekoAPI('/version').then(version => {
    document.querySelector('#version').textContent = version;
    api.value = { isOk: true, version };
}).catch(() => {
    api.value = { isOk: false, version: '0.0.0' };
});
