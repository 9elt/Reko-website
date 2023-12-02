import { router } from '../global';
import { scrollto } from '../util';

const el = (tagName, props, children) => ({
    tagName, children, ...props,
});

export const div = (p, ...c) => el('div', p, c);
export const p = (p, ...c) => el('p', p, c);
export const b = (p, ...c) => el('b', p, c);
export const strong = (p, ...c) => el('strong', p, c);
export const i = (p, ...c) => el('i', p, c);
export const em = (p, ...c) => el('em', p, c);
export const small = (p, ...c) => el('small', p, c);
export const span = (p, ...c) => el('span', p, c);
export const ul = (p, ...c) => el('ul', p, c);
export const li = (p, ...c) => el('li', p, c);
export const h1 = (p, ...c) => el('h1', p, c);
export const h2 = (p, ...c) => el('h2', p, c);
export const h3 = (p, ...c) => el('h3', p, c);
export const h4 = (p, ...c) => el('h4', p, c);
export const h5 = (p, ...c) => el('h5', p, c);
export const h6 = (p, ...c) => el('h6', p, c);

export const InlinePre = (...children) => ({
    tagName: 'pre',
    className: 'inline',
    children,
});

export const FullPre = (...children) => ({
    tagName: 'pre',
    children,
});

export const Button = (onclick, ...children) => ({
    tagName: 'button',
    onclick,
    children,
});

export const Link = (href, ...children) => /^\//.test(href) ? {
    tagName: 'a',
    href,
    onclick: (e) => {
        e.preventDefault();
        router.set(href);
    },
    children
} : /^#/.test(href) ? {
    tagName: 'a',
    href,
    onclick: (e) => {
        e.preventDefault();
        history.pushState(null, null, href);
        scrollto(href);
    },
    children
} : {
    tagName: 'a',
    href,
    target: '_blank',
    children
};
