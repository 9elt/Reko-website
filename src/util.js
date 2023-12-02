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
