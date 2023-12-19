import { Card } from './card';
import { wfb, join, isSmallScreen } from '../util';
import { ArrowLeftIcon, ArrowRightIcon, LinkIcon } from './icons';
import { M } from '.';

export const Toggler = (open) => M.div({
    className: 'toggle',
    onclick: () => open.set(c => !c),
},
    M.span({}, open.as(open => open
        ? ArrowLeftIcon({ width: 20, className: 'white' })
        : ArrowRightIcon({ width: 20, className: 'white' })
    ))
);

export const Sidebar = (open, currentUser, sidebarData, contentData, pagination) => M.div({
    className: open.as(open => join('sidebar', open && 'active')),
},
    Decscription(
        ['Users'],
        ['Similar users'],
        pagination
    ),
    M.div({
        className: 'data',
        children: sidebarData.as(data => [
            SidebarItem({ username: 'all' }, currentUser.as(u => u.all), () => {
                if (!currentUser.value.all) {
                    contentData.value = null;
                    currentUser.value = { all: true };
                    if (isSmallScreen())
                        open.value = false;
                }
            })
        ].concat(wfb(data, USERPH, 32).map(user =>
            SidebarItem(user, currentUser.as(u => u.username === user.username), () => {
                if (currentUser.value.username !== user.username) {
                    contentData.value = null;
                    currentUser.value = user;
                    if (isSmallScreen())
                        open.value = false;
                }
            }, !data)
        )))
    }),
    pagination,
);

export const Content = (currentUser, contentData, pagination) => {
    const children = contentData.as(data => {
        const d = wfb(data, ENTRY_PH, 16)
        return d.length === 0
            ? NoRecommendations(currentUser.value)
            : d.map(reko => Card(currentUser.value, reko, !data))
    });

    return M.div({ className: 'wrapper' },
        Decscription(
            currentUser.as(user => user.all
                ? ['Recommendations']
                : [
                    M.span({}, user.username),
                    ' ',
                    TitleSimilarity(user.similarity),
                ]
            ),
            currentUser.as(user => user.all
                ? ['Anime you haven\'t watched from similar users lists']
                : ['Anime you haven\'t watched from ', ListLink(user.username)]
            ),
            pagination,
        ),
        M.div({
            className: 'data',
            children,
        }),
        pagination,
    )
};

export const SidebarItem = (user, active, onclick, loading) => M.div({
    className: active.as(active => join(
        active && 'active',
        !user.similarity && 'all-users',
        loading && 'loading'
    )),
    onclick,
},
    user.username,
    ' ',
    user.similarity && Similarity(user.similarity),
);

export const Pagination = (pagination, curr) => M.div({
    className: 'pagination',
},
    M.p({
        className: pagination.as(p => join('previous', !p.previous && 'disabled')),
        onclick: pagination.as(p => p.previous ? () => curr.value-- : undefined),
    },
        ArrowLeftIcon({ width: 20, className: 'white' })
    ),
    M.p({}, pagination.as(p => p.current)),
    M.p({
        className: pagination.as(p => join('next', !p.next && 'disabled')),
        onclick: pagination.as(p => p.next ? () => curr.value++ : undefined),
    },
        ArrowRightIcon({ width: 20, className: 'white' })
    ),
);

export const Decscription = (title, subtitle, pagination) => M.div({
    className: 'description',
},
    M.div({
        className: 'title',
    },
        M.h3({ textTransform: 'capitalize', children: title }),
        M.p({ children: subtitle }),
    ),
    pagination,
);

export const Similarity = (similarity) => M.span({},
    M.small({}, 'sim. '),
    similarity,
    M.small({}, '%'),
);

export const TitleSimilarity = (similarity) => M.span({
    className: 'lighter',
    style: { textTransform: 'none' },
},
    ' (',
    similarity,
    M.small({}, '% similarity'),
    ')',
);

export const ListLink = (user) => M.a({
    href: 'https://myanimelist.net/profile/' + user,
    target: '_blank',
    children: [user, ' list ', LinkIcon],
});

export const NoRecommendations = (user) => [
    M.div({
        style: {
            width: '100vw',
            height: '400px',
            textAlign: 'center'
        }
    },
        M.p({
            style: {
                marginTop: '64px'
            }
        }, user.all
            ? 'No recommendations found'
            : user.username + ' has no recommendations'
        )
    )
];

export const USERPH = {
    username: '-',
    affinity: 0,
};

export const ENTRY_PH = {
    id: '-',
    score: 0,
    details: {
        title: '-',
        mean: 0,
        airing_date: '-',
        length: '-',
        rating: '-',
        picture: '',
        genres: ['-'],
    },
};
