import { api } from "./states";

const REKO = 'http://127.0.0.1:3000';

export let CACHE = {};
CACHE.clear = () => CACHE = {};

export default async function rekoAPI(url) {
    try {
        if (CACHE[url])
            return CACHE[url];
        const res = await fetch(REKO + url);
        const data = res.headers.get('content-type') === 'application/json'
            ? await res.json() : await res.text();
        if (!res.ok)
            throw data;
        return (CACHE[url] = data);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

async function testApiServer() {
    try {
        const version = await rekoAPI('/version');
        document.querySelector('#version').textContent = version;
        api.value = { isOk: true, version };
    }
    catch {
        api.value = { isOk: false, version: '0.0.0' };
    }
}

testApiServer();
