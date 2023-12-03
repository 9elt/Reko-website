import { FullCard } from './card';
import { wfb, join, isSmallScreen } from '../util';
import { ArrowLeftIcon, ArrowRightIcon, LinkIcon } from './icons';
import { div, p, span } from '.';

export const Toggler = (open) => ({
    tagName: 'div',
    className: 'toggle',
    onclick: () => open.set(c => !c),
    children: [{
        tagName: 'span',
        children: [open.as(open => open
            ? ArrowLeftIcon({ width: 20, className: 'white' })
            : ArrowRightIcon({ width: 20, className: 'white' })
        )],
    }]
});

export const Sidebar = (open, currentUser, sidebarData, contentData, pagination) => ({
    tagName: 'div',
    className: open.as(open => join('sidebar', open && 'active')),
    children: [
        Decscription(
            ['Users'],
            ['Similar users'],
            pagination
        ),
        {
            tagName: 'div',
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
        },
        pagination,
    ]
});

export const Content = (currentUser, contentData, pagination) => {
    const children = contentData.as(data => {
        const d = wfb(data, ENTRY_PH, 16)
        return d.length === 0
            ? NoRecommendations(currentUser.value)
            : d.map(reko => FullCard(currentUser.value, reko, !data))
    });

    return div({ className: 'wrapper' },
        Decscription(
            currentUser.as(user => user.all
                ? ['Recommendations']
                : [
                    span({}, user.username),
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
        {
            tagName: 'div',
            className: 'data',
            children,
        },
        pagination,
    )
};

export const SidebarItem = (user, active, onclick, loading) => ({
    tagName: 'div',
    className: active.as(active => join(
        active && 'active',
        !user.similarity && 'all-users',
        loading && 'loading'
    )),
    onclick,
    children: [
        user.username + ' ',
        user.similarity && Similarity(user.similarity),
    ],
});

export const Pagination = (pagination, curr) => ({
    tagName: 'div',
    className: 'pagination',
    children: [
        {
            tagName: 'p',
            className: pagination.as(p => join('previous', !p.previous && 'disabled')),
            onclick: pagination.as(p => p.previous ? () => curr.value-- : undefined),
            children: [ArrowLeftIcon({ width: 20, className: 'white' })]
        },
        {
            tagName: 'p',
            children: [pagination.as(p => p.current)]
        },
        {
            tagName: 'p',
            className: pagination.as(p => join('next', !p.next && 'disabled')),
            onclick: pagination.as(p => p.next ? () => curr.value++ : undefined),
            children: [ArrowRightIcon({ width: 20, className: 'white' })]
        },
    ],
});

export const Decscription = (title, subtitle, pagination) => ({
    tagName: 'div',
    className: 'description',
    children: [
        {
            tagName: 'div',
            className: 'title',
            children: [
                {
                    tagName: 'h3',
                    style: { textTransform: 'capitalize' },
                    children: title
                },
                {
                    tagName: 'p',
                    children: subtitle
                }
            ]
        },
        pagination,
    ]
});

export const Similarity = (similarity) => ({
    tagName: 'span',
    children: [
        { tagName: 'small', children: ['sim. '] },
        similarity,
        { tagName: 'small', children: ['%'] }
    ],
});

export const TitleSimilarity = (similarity) => ({
    tagName: 'span',
    className: 'lighter',
    style: { textTransform: 'none' },
    children: [
        ' (',
        similarity,
        { tagName: 'small', children: ['%'] },
        { tagName: 'small', children: [' similarity)'] },
    ],
});

export const ListLink = (user) => ({
    tagName: 'a',
    href: 'https://myanimelist.net/profile/' + user,
    target: '_blank',
    children: [user, ' list ', LinkIcon],
});

export const NoRecommendations = (user) => [
    div({ style: { width: '100vw', height: '400px', textAlign: 'center' } },
        p({ style: { marginTop: '64px' } }, user.all
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
