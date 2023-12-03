import { State } from "@9elt/miniframe";
import { Button, DisabledButton, Link, div, h3, img, p, small, span } from ".";
import { LinkIcon, SaveIcon, TrashIcon } from "./icons";
import { join, limit } from "../util";
import { session } from "../global";

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

    return div({ className: loading.as(l => join('small card', l && 'loading')) },
        Save(entry),
        div({ className: loading.as(l => join('img-wrapper', l && 'loading')) },
            entry.details.picture && img({
                src: entry.details.picture,
                alt: entry.details.title,
                onload: load,
                onerror: load,
            }),
        ),
        div({ className: 'data-wrapper' },
            h3({},
                limit(entry.details.title),
                entry.details.airing_date && Year(entry.details.airing_date),
            ),
            p({},
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

    return div({ className: loading.as(l => join('full card', l && 'loading')) },
        Save(entry),
        div({ className: loading.as(l => join('img-wrapper', l && 'loading')) },
            entry.details.picture && img({
                src: entry.details.picture,
                alt: entry.details.title,
                onload: load,
                onerror: load,
            }),
        ),
        div({ className: 'data-wrapper' },
            user.all && entry.users
                ? p({ className: 'entry-score' },
                    span({ dataset: { score: entry.score } },
                        'average score ' + entry.score
                    ),
                    ' by ', entry.users.length, ' users'
                )
                : p({ className: 'entry-score' },
                    span({ dataset: { score: entry.score } },
                        'scored ' + entry.score
                    ),
                    ' by ' + user.username + ' ',
                ),
            h3({},
                entry.details.title,
                entry.details.airing_date && Year(entry.details.airing_date),
            ),
            p({ className: 'genres' },
                ...entry.details.genres
                    .map(genre => small({}, genre))
            ),
            p({},
                entry.details.length && entry.details.length + ' Episode' + (entry.details.length > 1 ? 's ' : ' '),
                entry.details.length && span({}, ' - '),
                entry.details.mean.toFixed(2) + ' on ',
                Link(
                    'https://myanimelist.net/anime/' + entry.id,
                    'MyAnimeList ', LinkIcon
                ),
            ),

            entry.users &&
            div({ className: 'scores' },
                p({ className: 'user-reco' },
                    span({}, 'sim.'),
                    ' ',
                    span({}, 'score'),
                    ' ',
                    span({}, 'user'),
                ),
                div({}, ...entry.users.map(user =>
                    p({ className: 'user-reco' },
                        span({}, user.similarity, small({}, '%')),
                        ' ',
                        span({ dataset: { score: user.score } },
                            user.score
                        ),
                        ' ',
                        span({}, UserList(user.username))
                    )
                )),
            ),
        ),
    );
};

const Save = (entry) => ({
    tagName: 'div',
    className: 'toggle-save',
    children: [session.saved.as(s =>
        s.some(e => e.id === entry.id)
            ? Button(() => session.unsave(entry.id),
                TrashIcon({ width: 32, className: 'light' })
            )
            : s.length < 32
                ? Button(() => session.save(entry),
                    SaveIcon({ width: 32, className: 'transparent white' })
                )
                : DisabledButton(
                    SaveIcon({ width: 32, className: 'black' })
                )
    )]
});

const UserList = (user) => ({
    tagName: 'a',
    href: 'https://myanimelist.net/profile/' + user,
    target: '_blank',
    style: { textDecoration: 'none' },
    children: [user],
});

const Year = (date) => ({
    tagName: 'span',
    style: { fontSize: '14px' },
    className: 'lighter',
    children: [' (', new Date(date).getFullYear(), ')']
});
