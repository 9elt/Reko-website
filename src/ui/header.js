import { State } from '@9elt/miniframe';
import { M } from '.';
import { session, version } from '../global';
import { join } from '../util';
import { Card } from './card';
import { LogOutIcon, SaveIcon } from './icons';
import { Light } from './text';

export const Header = (logo) => {
    const openSaved = new State(false);
    return M.div({
        className: 'header',
    },
        session.as(u => !!u && SavedBar(openSaved)),
        session.as(u => !!u && M.div({
            className: 'close',
            onclick: () => openSaved.value = false,
        })),
        session.as(u => !!u && M.div({},
            M.button({
                onclick: () => openSaved.set(c => !c),
            },
                SaveIcon({ width: 32, className: 'white' }),
            ),
            session.saved.as(s => s.length > 0 && M.b({
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
        session.as(u => !!u && M.div({ className: 'center-center' },
            M.p({}, u.username),
            M.button({
                onclick: session.logout,
            },
                M.small({}, LogOutIcon({ width: 32, className: 'red' }))
            ),
        )),
        version.as(version => version === 0 &&
            M.div({ className: 'offline', },
                M.h4({}, 'Reko API is temporarily offline. Please try again later.'),
            ),
        )
    );
};

const SavedBar = (active) => {
    return M.div({
        className: active.as(active => join('savedbar', active && 'active'))
    },
        M.div({},
            session.saved.as(s => s.length
                ? SavedRecoHeading(s)
                : NoSavedReco()
            ),
            M.div({
                className: 'entries',
                children: session.saved.as(s => s.map(entry =>
                    Card({ preview: true }, entry)
                )),
            })
        )
    );
};

const SavedRecoHeading = (saved) => M.div({
    className: 'heading',
},
    M.h3({}, saved.length, ' saved ', Light(' of 32')),
);

const NoSavedReco = () => M.div({
    className: 'heading',
},
    M.h3({}, 'You don\'t have saved recommendations'),
    M.p({}, 'Click on the save icon to save them')
);
