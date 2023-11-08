import { root, router } from "./states";
import { createNode } from "@9elt/miniframe";
import { last } from "./util";
import "./router";

document
    .querySelector('.main')
    .replaceWith(createNode({
        tagName: 'div',
        className: 'main',
        id: 'root',
        children: root,
    }));

document
    .querySelectorAll('a[href^="/"]')
    .forEach(a => a.onclick = event => {
        event.preventDefault();
        router.value = last(a.href);
    });
