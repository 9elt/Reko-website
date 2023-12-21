import { createNode } from "@9elt/miniframe";
import { root, router, version } from "./global";
import { M } from "./ui";
import { Header } from "./ui/header";

document
    .querySelector('.header')
    .replaceWith(createNode(
        Header(document.querySelector('.header>a'))
    ));

document
    .querySelector('#root')
    .replaceWith(
        createNode(M.div({
            className: 'main',
            id: 'root',
            children: root,
        }))
    );

document
    .querySelector('#version')
    .replaceWith(createNode(
        M.span({ id: '#version' }, version.as(v =>
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
