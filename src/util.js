export function wfb(data, fallback, repeat) {
    return data || new Array(repeat).fill(fallback);
}

export function join(...classNames) {
    let res = classNames.pop();
    while (!res && classNames.length)
        res = classNames.pop();
    for (let i = 0; i < classNames.length; i++)
        classNames[i] && (res += ' ' + classNames[i]);
    return res;
}

export function limit(str, limit = 32) {
    return str.length > limit ? str.substring(0, limit - 3) + '...' : str;
}

export function scrollup(selector) {
    const el = selector
        ? document.querySelector(selector)
        : document.body;
    el && el.scrollTo({ top: 0, behavior: 'smooth' });
}

export function scrollto(selector) {
    const el = document.querySelector(selector);
    el && window.scrollTo({
        top: el.offsetTop - 64,
        behavior: 'smooth'
    });
}

export function isBigScreen() {
    return typeof matchMedia !== 'undefined'
        && matchMedia('(min-width: 900px)').matches;
}

export function isSmallScreen() {
    return typeof matchMedia !== 'undefined'
        && matchMedia('(max-width: 600px)').matches;
}

export function last(path) {
    let res = '';
    for (let i = 0; i < path.length; i++) {
        res = path.charAt(i) + res;
        if (char === '/')
            return res;
    }
    return res;
}

export class Cache {
    _i;
    constructor() {
        this._i = {};
    }
    has(id) {
        return id in this._i;
    }
    get(id) {
        return this._i[id];
    }
    set(id, data) {
        return this._i[id] = data;
    }
    clear() {
        this._i = {};
    }
}

export class Color {
    bytes;
    constructor(...bytes) {
        this.bytes = bytes;
    }
    clone() {
        return new Color(...this.bytes);
    }
    toString() {
        return 'rgba('
            + this.bytes[0] + ','
            + this.bytes[1] + ','
            + this.bytes[2] + ','
            + (this.bytes[3] || 1)
            + ')';
    }
    mix(other, stren = 0.5) {
        const rev = 1 - stren;
        for (let i = 0; i < 4; i++)
            this.bytes[i] = this.bytes[i] * rev + other.bytes[i] * stren;
        return this;
    }
    opacity(v) {
        this.bytes[3] = v;
        return this;
    }
}

export const isGPU = (() => {
    try {
        const c = document.createElement('canvas');
        return c.getContext('webgl') || c.getContext('experimental-webgl') && true;
    }
    catch {
        return null;
    }
})();

const canvas = (() => {
    try {
        return document.createElement('canvas').getContext('2d');
    }
    catch {
        return null;
    }
})();

const COLORS_CACHE = new Cache();

export function getImageColor(img) {
    if (COLORS_CACHE.has(img.src))
        return COLORS_CACHE.get(img.src);

    try {
        canvas.drawImage(img, 0, 0);
        const bytes = canvas.getImageData(0, 0, img.width, img.height).data;
        const colors = bysix(bytes, 4, 4).sort((a, b) => b.area - a.area);
        return COLORS_CACHE.set(
            img.src,
            new Color(...colors[0].bytes, 1)
        );
    }
    catch {
        return null;
    }
}

function bysix(bytes, pxsize = 4, aprox = 1) {
    const inc = pxsize * aprox;
    const len = bytes.length / inc;
    const tot = len / inc;
    const map = new Uint32Array(256).fill(0);
    for (let i = 0; i < len; i += inc) {
        const r = bytes[i];
        const g = bytes[i + 1];
        const b = bytes[i + 2];
        const c = ((b >> 6) + ((g >> 6) << 2) + ((r >> 6) << 4)) << 2;
        map[c]++;
        map[c + 1] += r;
        map[c + 2] += g;
        map[c + 3] += b;
    }
    const result = [];
    for (let c = 0; c < 256; c += 4)
        if (map[c]) {
            const bytes = new Uint8Array(3);
            bytes[0] = map[c + 1] / map[c];
            bytes[1] = map[c + 2] / map[c];
            bytes[2] = map[c + 3] / map[c];
            result.push({ code: c >> 2, bytes, area: map[c] / tot });
        };
    return result;
}
