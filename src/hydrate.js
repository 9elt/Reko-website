import { root, router, version } from "./global";
import { Header } from "./ui/header";
import { createNode } from "@9elt/miniframe";
import { span } from "./ui";

document
    .querySelector('header')
    .replaceWith(createNode(
        Header(document.querySelector('header>a'))
    ));

document
    .querySelector('#root')
    .replaceWith(
        createNode({
            tagName: 'div',
            className: 'main',
            id: 'root',
            children: root,
        })
    );

document
    .querySelector('#version')
    .replaceWith(createNode(
        span({ id: '#version' }, version.as(v =>
            v ? v : v === 0 ? 'offline' : '0.0.0'
        ))
    ));

document
    .querySelectorAll('a[href^="/"]')
    .forEach(a => a.onclick = event => {
        event.preventDefault();
        router.set(a.href.replace(window.location.origin, ''));
    });

router.hydrate();

export { };
