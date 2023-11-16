/** @typedef {import('@9elt/miniframe').MiniframeElement} Melement */

import { Button } from './common';

/** @returns {Melement} */
export const Header = (logo, user) => ({
    tagName: 'header',
    className: 'header',
    children: [
        user.as(user => user && {
            tagName: 'div',
            children: [
                // {
                //     tagName: 'svg',
                //     children: [],
                // },
                {
                    tagName: 'b',
                    className: 'count-dot',
                    children: [user.saved.length],
                }
            ],
        }),
        logo,
        user.as(u => u && {
            tagName: 'div',
            className: 'user-info',
            children: [
                {
                    tagName: 'p',
                    children: [u.username],
                },
                Button(user.logout, {
                    tagName: 'small',
                    children: ['log out'],
                }),
            ],
        }),
    ]
});
