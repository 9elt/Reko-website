import { root, router, user } from "./states";
import { createNode } from "@9elt/miniframe";
import { last } from "./util";
import "./session";
import "./router";
import { Header } from "./ui/header";

document
    .querySelector('header')
    .replaceWith(
        createNode(Header(
            document.querySelector('header').querySelector('a'),
            user
        ))
    );

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

router.value = router.value;
