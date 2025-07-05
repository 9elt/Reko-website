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

export function clamp(v, max, min = 0) {
    return v > max ? max : v < min ? min : v;
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

export class Color extends Uint8ClampedArray {
    constructor(r = 255, g = 255, b = 255, a = 255) {
        super(4);
        this[0] = r;
        this[1] = g;
        this[2] = b;
        this[3] = a;
    }
    toString() {
        return 'rgba('
            + this[0] + ','
            + this[1] + ','
            + this[2] + ','
            + (this[3] / 255).toFixed(2) + ')';
    }
    mix(other, stren = 0.5) {
        const otherstren = 1 - stren;
        return new Color(
            this[0] * otherstren + other[0] * stren,
            this[1] * otherstren + other[1] * stren,
            this[2] * otherstren + other[2] * stren,
            this[3] * otherstren + other[3] * stren,
        );
    }
    opacity(stren = 1) {
        return new Color(
            this[0],
            this[1],
            this[2],
            stren * 255,
        );
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
        const colors = by4(bytes, 4, 4)
            .sort((a, b) => b.area - a.area);
        const color = colors.find((color) =>
            color.code !== 0 && color.code !== 7 && color.area >= 0.01
        ) || colors.find((color) =>
            color.code !== 0
        ) || colors[0];
        return COLORS_CACHE.set(img.src, color.bytes);
    }
    catch {
        return null;
    }
}

function by4(
    bytes,
    pxsize = 4,
    aprox = Math.ceil(bytes.length / 4147200)
) {
    const pxincr = pxsize * aprox;
    const samples = bytes.length / pxincr;

    // NOTE: 16 * (count, red, green, blue)
    const map = new Uint32Array(64).fill(0);

    for (let i = 0; i < bytes.length; i += pxincr) {
        const r = bytes[i];
        const g = bytes[i + 1];
        const b = bytes[i + 2];

        // NOTE: second most relevant bits of each channel
        const n2relev = (b + (g << 8) + (r << 16)) & 4210752;

        const map_i =
            // NOTE: the 4-bit color id is composed by
            // 1-bit "plus" flag + 3-bit color representation
            (
                // NOTE: the "plus" flag is 1 when at least two
                // of the second most relevant bits are 1
                (n2relev & (n2relev - 1) ? 8 : 0)
                // NOTE: the 3-bit color representation
                + (b >> 7) + ((g >> 7) << 1) + ((r >> 7) << 2)
            )
            // NOTE: the map index is the 4-bit color id * 4
            * 4;

        map[map_i]++;
        map[map_i + 1] += r;
        map[map_i + 2] += g;
        map[map_i + 3] += b;
    }

    const result = [];

    for (let map_i = 0; map_i < 64; map_i += 4) {
        const count = map[map_i];

        if (count > 0) {
            const bytes = new Color();

            bytes[0] = map[map_i + 1] / count;
            bytes[1] = map[map_i + 2] / count;
            bytes[2] = map[map_i + 3] / count;

            const id = map_i >> 2;

            result.push({
                id,
                code: id & 7,
                area: count / samples,
                bytes,
            });
        }
    }

    return result;
}
