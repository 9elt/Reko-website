import { State } from '@9elt/miniframe';
import { wfb, join, isSmallScreen } from '../util';
import { LinkIcon } from './icons';

export * from './common';

export const Toggler = (open) => ({
    tagName: 'div',
    className: 'toggle',
    onclick: () => open.set(c => !c),
    children: [{
        tagName: 'span',
        children: [open.as(open => open ? '◀' : '▶')],
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

export const Content = (currentUser, contentData, pagination) => ({
    tagName: 'div',
    className: 'wrapper',
    children: [
        Decscription(
            currentUser.as(user => user.all
                ? ['Recommendations']
                : [
                    { tagName: 'span', children: [user.username] },
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
            children: contentData.as(data => wfb(data, REKOPH, 16).map(reko =>
                ContentCard(currentUser.value, reko, !data)
            )),
        },
        pagination,
    ]
});

export const ContentCard = (user, reko, preventLoading) => {
    const loading = State.from(true);
    const load = () => loading.value = preventLoading;

    return {
        tagName: 'div',
        className: loading.as(l => join('card', l && 'loading')),
        children: [
            {
                tagName: 'div',
                className: loading.as(l => join('img_wrapper', l && 'loading')),
                children: [
                    reko.details.picture && {
                        tagName: 'img',
                        src: reko.details.picture,
                        alt: reko.details.title,
                        onload: load,
                        onerror: load,
                    },
                ]
            },
            {
                tagName: 'div',
                className: 'data_wrapper',
                children: [
                    {
                        tagName: 'h3',
                        children: [
                            reko.details.title,
                            reko.details.airing_date && Year(reko.details.airing_date),
                        ],
                    },
                    {
                        tagName: 'p',
                        children: [
                            reko.details.length && reko.details.length + ' Episode'
                            + (reko.details.length > 1 ? 's ' : ' '),
                            reko.details.length && {
                                tagName: 'span',
                                children: [' - '],
                            },
                            reko.details.mean.toFixed(2) + ' on ',
                            {
                                tagName: 'a',
                                href: 'https://myanimelist.net/anime/' + reko.id,
                                target: '_blank',
                                children: ['MyAnimeList ', LinkIcon],
                            }
                        ]
                    },
                    {
                        tagName: 'p',
                        className: 'genres',
                        children: reko.details.genres.map(genre => ({
                            tagName: 'small',
                            children: [genre],
                        })),
                    },
                    user.all && reko.users ? {
                        tagName: 'p',
                        children: ['average ', {
                            tagName: 'span',
                            dataset: { score: reko.score },
                            children: ['score ' + reko.score]
                        }, ' (', reko.users.length, ' users)',
                        ]
                    } : {
                        tagName: 'p',
                        children: [user.username + ' ', {
                            tagName: 'span',
                            dataset: { score: reko.score },
                            children: ['scored ' + reko.score]
                        }],
                    },
                    reko.users && {
                        tagName: 'div',
                        className: 'scores',
                        children: [
                            {
                                tagName: 'p',
                                className: 'userscore',
                                children: [
                                    { tagName: 'span', children: ['sim.'] },
                                    ' ',
                                    { tagName: 'span', children: ['score'] },
                                    ' ',
                                    { tagName: 'span', children: ['user'] },
                                ]
                            },
                            {
                                tagName: 'div',
                                children: reko.users.map(user => ({
                                    tagName: 'p',
                                    className: 'userscore',
                                    children: [
                                        {
                                            tagName: 'span',
                                            children: [user.similarity, { tagName: 'small', children: ['%'] }]
                                        },
                                        ' ',
                                        {
                                            tagName: 'span',
                                            dataset: { score: user.score },
                                            children: [user.score]
                                        },
                                        ' ',
                                        { tagName: 'span', children: [user.username] },
                                    ]
                                }))
                            }
                        ]
                    }
                ]
            }
        ],
    }
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
            children: ['⮜']
        },
        {
            tagName: 'p',
            children: [pagination.as(p => p.current)]
        },
        {
            tagName: 'p',
            className: pagination.as(p => join('next', !p.next && 'disabled')),
            onclick: pagination.as(p => p.next ? () => curr.value++ : undefined),
            children: ['⮞']
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

export const Year = (date) => ({
    tagName: 'span',
    style: { fontSize: '14px' },
    className: 'lighter',
    children: [' (', new Date(date).getFullYear(), ')']
});

export const ListLink = (user) => ({
    tagName: 'a',
    href: 'https://myanimelist.net/profile/' + user,
    target: '_blank',
    children: [user, ' list ', LinkIcon],
});

const USERPH = {
    username: '-',
    affinity: 0,
};

const REKOPH = {
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
