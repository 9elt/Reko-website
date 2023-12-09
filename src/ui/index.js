import { router } from '../global';
import { scrollto } from '../util';

/**
 * @type {{ 
 * [T in keyof HTMLElementTagNameMap]: 
 * (
 *    props: import('@9elt/miniframe').MiniframeElement<"http://www.w3.org/1999/xhtml", T>, 
 *    ...children: import('@9elt/miniframe').MiniframeElement
 * ) => import('@9elt/miniframe').MiniframeElement<"http://www.w3.org/1999/xhtml", T> 
 * } 
 * & { [T in 'br' | 'hr']: { tagName: T } } 
 * & { svg: { 
 * [T in keyof SVGElementTagNameMap]: 
 * (
 *    props: import('@9elt/miniframe').MiniframeElement<"http://www.w3.org/2000/svg", T>, 
 *    ...children: import('@9elt/miniframe').MiniframeElement
 * ) => import('@9elt/miniframe').MiniframeElement<"http://www.w3.org/2000/svg", T> 
 * }}}
 */
export const M = [
    'div', 'p', 'a', 'header',
    'b', 'i', 'span', 'small', 'em', 'strong',
    'form', 'label', 'input', 'button',
    'pre', 'img',
    'h1', 'h2', 'h3', 'h4', 'h5',
    'ul', 'li'
].reduce((M, tagName) => (M[tagName] = (props, ...children) => ({
    tagName,
    children,
    ...props,
})) && M, {
    svg: [
        'svg', 'path', 'rect'
    ].reduce((M, tagName) => (M[tagName] = (props, ...children) => ({
        tagName,
        children,
        namespaceURI: 'http://www.w3.org/2000/svg',
        ...props,
    })) && M, {}),
    br: { tagName: 'br' },
    hr: { tagName: 'hr' },
});

export const Link = (href, ...children) => M.a(/^\//.test(href) ? {
    href,
    onclick: (e) => {
        e.preventDefault();
        router.set(href);
    },
    children
} : /^#/.test(href) ? {
    href,
    onclick: (e) => {
        e.preventDefault();
        history.pushState(null, null, href);
        scrollto(href);
    },
    children
} : {
    href,
    target: '_blank',
    children
});
