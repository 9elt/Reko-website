import { Cache } from "./util";

// const REKO = 'http://127.0.0.1:3000';
const REKO = 'https://api.reko.moe';

export const API_CACHE = new Cache();

export async function reko(url) {
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
