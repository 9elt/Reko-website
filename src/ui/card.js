import { State } from "@9elt/miniframe";
import { Link } from ".";
import { LinkIcon, SaveIcon, TrashIcon } from "./icons";
import { join, limit } from "../util";
import { session } from "../global";
import { M } from ".";

/**
 * @param {{        
 *  id: number;
 *  score: number;
 *  details: {
 *      title: string;
 *      mean: number;
 *      airing_date: string | null;
 *      length: number | null;
 *      rating: string | null;
 *      picture: string | null;
 *      genres: Array<string>;
 *  }}} entry 
 */
export const SmallCard = (entry, preventLoading) => {
    const loading = State.from(true);
    const load = () => loading.value = preventLoading;

    return M.div({
        className: loading.as(l => join('small card', l && 'loading'))
    },
        Save(entry),
        M.div({ className: loading.as(l => join('img-wrapper', l && 'loading')) },
            entry.details.picture && M.img({
                src: entry.details.picture,
                alt: entry.details.title,
                onload: load,
                onerror: load,
            }),
        ),
        M.div({ className: 'data-wrapper' },
            M.h3({},
                limit(entry.details.title),
                entry.details.airing_date && Year(entry.details.airing_date),
            ),
            M.p({},
                Link(
                    'https://myanimelist.net/anime/' + entry.id,
                    'MyAnimeList ', LinkIcon
                ),
            ),
        ),
    );
}

/**
 * @param {{
 *  all?: true 
 *  username: string;
 *  hash: string;
 *  similarity: number;
 * }} user
 * 
 * @param {{        
 *  id: number;
 *  score: number;
 *  details: {
 *      title: string;
 *      mean: number;
 *      airing_date: string | null;
 *      length: number | null;
 *      rating: string | null;
 *      picture: string | null;
 *      genres: Array<string>;
 *  };
 *  users?: {
 *      username: string;
 *      hash: string;
 *      score: number;
 *      similarity: number;
 *  }[]
 * }} entry
 * 
 * @param {boolean} preventLoading
 */
export const FullCard = (user, entry, preventLoading) => {
    const loading = State.from(true);
    const load = () => loading.value = preventLoading;

    return M.div({ className: loading.as(l => join('full card', l && 'loading')) },
        Save(entry),
        M.div({ className: loading.as(l => join('img-wrapper', l && 'loading')) },
            entry.details.picture && M.img({
                src: entry.details.picture,
                alt: entry.details.title,
                onload: load,
                onerror: load,
            }),
        ),
        M.div({ className: 'data-wrapper' },
            user.all && entry.users
                ? M.p({ className: 'entry-score' },
                    M.span({ dataset: { score: entry.score } },
                        'average score ' + entry.score
                    ),
                    ' by ', entry.users.length, ' users'
                )
                : M.p({ className: 'entry-score' },
                    M.span({ dataset: { score: entry.score } },
                        'scored ' + entry.score
                    ),
                    ' by ' + user.username + ' ',
                ),
            M.h3({},
                entry.details.title,
                entry.details.airing_date && Year(entry.details.airing_date),
            ),
            M.p({ className: 'genres' },
                ...entry.details.genres
                    .map(genre => M.small({}, genre))
            ),
            M.p({},
                entry.details.length && entry.details.length + ' Episode' + (entry.details.length > 1 ? 's ' : ' '),
                entry.details.length && M.span({}, ' - '),
                entry.details.mean.toFixed(2) + ' on ',
                Link(
                    'https://myanimelist.net/anime/' + entry.id,
                    'MyAnimeList ', LinkIcon
                ),
            ),
            entry.users &&
            M.div({ className: 'scores' },
                M.p({ className: 'user-reco' },
                    M.span({}, 'sim.'),
                    ' ',
                    M.span({}, 'score'),
                    ' ',
                    M.span({}, 'user'),
                ),
                M.div({}, ...entry.users.map(user =>
                    M.p({ className: 'user-reco' },
                        M.span({}, user.similarity, M.small({}, '%')),
                        ' ',
                        M.span({ dataset: { score: user.score } },
                            user.score
                        ),
                        ' ',
                        M.span({}, UserList(user.username))
                    )
                )),
            ),
        ),
    );
};

const Save = (entry) => M.div({
    className: 'toggle-save',
},
    session.saved.as(s =>
        s.some(e => e.id === entry.id)
            ? M.button({
                onclick: () => session.unsave(entry.id),
            },
                TrashIcon({ width: 32, className: 'light' })
            )
            : s.length < 32
                ? M.button({
                    onclick: () => session.save(entry),
                },
                    SaveIcon({ width: 32, className: 'transparent white' })
                )
                : M.button({
                    disabled: true
                },
                    SaveIcon({ width: 32, className: 'black' })
                )
    )
);

const UserList = (user) => M.a({
    href: 'https://myanimelist.net/profile/' + user,
    target: '_blank',
    style: { textDecoration: 'none' },
},
    user
);

const Year = (date) => M.span({
    style: { fontSize: '14px' },
    className: 'lighter',
},
    ' (', new Date(date).getFullYear(), ')'
);
