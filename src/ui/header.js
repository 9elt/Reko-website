import { State } from '@9elt/miniframe';
import { version } from '../global';
import { join } from '../util';
import { Button } from './common';
import { session } from '../global';

export const Header = (logo) => {
    const openSaved = State.from(false);

    return {
        tagName: 'header',
        className: 'header',
        children: [
            session.as(u => u && SavedBar(openSaved)),
            session.as(u => u && {
                tagName: 'div',
                className: 'close',
                onclick: () => openSaved.value = false
            }),
            session.as(u => u && {
                tagName: 'div',
                children: [
                    Button(() => openSaved.set(c => !c), {
                        tagName: 'small',
                        children: ['saved'],
                    }),
                    {
                        tagName: 'b',
                        className: 'count-dot',
                        children: [
                            session.saved.as(s => '' + s.length)
                        ],
                    }
                ],
            }),
            logo,
            session.as(u => u && {
                tagName: 'div',
                className: 'user-info',
                children: [
                    {
                        tagName: 'p',
                        children: [u.username],
                    },
                    Button(session.logout, {
                        tagName: 'small',
                        children: ['log out'],
                    }),
                ],
            }),
            version.as(version => version === 0 && ({
                tagName: 'div',
                className: 'offline',
                children: [{
                    tagName: 'h4',
                    children: [
                        'Reko API is temporarily offline. Please try again later.',
                    ]
                }]
            })),
        ]
    }
};

const SavedBar = (active) => ({
    tagName: 'div',
    className: active.as(active => join('savedbar', active && 'active')),
    children: [{
        tagName: 'div',
        children: [
            {
                tagName: 'div',
                children: session.saved.as(s => s.length
                    ? [{
                        tagName: 'h3',
                        children: ['saved ', s.length]
                    }]
                    : [
                        {
                            tagName: 'h3',
                            children: ['You don\'t have saved recommendations']
                        },
                        {
                            tagName: 'p',
                            children: ['Click on the triangular button to save them'],
                        }
                    ]
                )
            },
            {
                tagName: 'div',
                children: session.saved.as(s => s.map(entry => ({
                    tagName: 'div',
                    className: 'card',
                    children: [entry.title]
                }))),
            }
        ]
    }]
});
