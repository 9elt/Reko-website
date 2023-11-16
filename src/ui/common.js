/** @typedef {import('@9elt/miniframe').MiniframeElement} Melement */

import { router } from '../states';

/** @returns {Melement} */
export const Button = (onclick, ...children) => ({
    tagName: 'button',
    onclick,
    children,    
});

/** @returns {Melement} */
export const Link = (href, ...children) => /^\//.test(href) ? {
    tagName: 'a',
    href,
    onclick: (e) => {
        e.preventDefault();
        router.value = href;
    },
    children
} : {
    tagName: 'a',
    href,
    target: '_blank',
    children
};
