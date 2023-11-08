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
    const el = document.querySelector(selector);
    if (el)
        el.scrollTo({ top: 0, behavior: 'smooth' });
}

export function isBigScreen() {
    return typeof matchMedia !== 'undefined'
        && matchMedia('(min-width: 900px)').matches;
}

export function last(path) {
    return '/' + (path.split('/').pop() || '');
}
