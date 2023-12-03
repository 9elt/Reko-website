import { State } from '@9elt/miniframe';
import { version } from '../global';
import { join } from '../util';
import { Button, b, div, h3, h4, p, small } from '.';
import { session } from '../global';
import { LogOutIcon, SaveIcon } from './icons';
import { SmallCard } from './card';
import { Light, br } from './text';

export const Header = (logo) => {
    const openSaved = State.from(false);
    return {
        tagName: 'header',
        className: 'header',
        children: [
            session.as(u => u && SavedBar(openSaved)),
            session.as(u => u && div({
                className: 'close',
                onclick: () => openSaved.value = false,
            })),
            session.as(u => u && div({},
                Button(() => openSaved.set(c => !c),
                    SaveIcon({ width: 32, className: 'white' }),
                ),
                session.saved.as(s => s.length > 0 && b({
                    className: 'dot yellow',
                    style: { 
                        marginLeft: '-12px', 
                        marginRight: '-4px', 
                    },
                },
                    '' + s.length
                )),
            )),
            logo,
            session.as(u => u && div({ className: 'center-center' },
                p({}, u.username),
                Button(session.logout, small({}, LogOutIcon({ width: 32, className: 'red' }))),
            )),
            version.as(version => version === 0 &&
                div({ className: 'offline', },
                    h4({}, 'Reko API is temporarily offline. Please try again later.'),
                ),
            )
        ]
    }
};

const SavedBar = (active) => div({
    className: active.as(active => join('savedbar', active && 'active'))
},
    div({},
        div({
            style: { textAlign: 'center' },
            children: session.saved.as(s => s.length
                ? [
                    h3({},
                        s.length, ' saved ', Light(' of 32')
                    ),
                    br,
                ]
                : [
                    h3({}, 'You don\'t have saved recommendations'),
                    p({}, 'Click on the save icon to save them')
                ]
            )
        }),
        div({
            children: session.saved.as(s => s.map(entry =>
                SmallCard(entry)
            )),
        })
    )
);
