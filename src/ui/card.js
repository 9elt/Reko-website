import { State } from "@9elt/miniframe";
import { Link, M } from ".";
import { session } from "../global";
import { Color, getImageColor, isGPU, join, limit } from "../util";
import { LinkIcon, SaveIcon, TrashIcon } from "./icons";

const ASPECT_RATIO = 319 / 225;
const MIN_ASPECT_RATIO = 319 / 260;
const BGCOLOR = new Color(9, 19, 29);

/**
 * @param {{
 *  all?: true;
 *  preview?: true;
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
export const Card = (user, entry, preventLoading) => {
    const loading = new State(true);
    const hover = new State(false);
    const active = new State(false);
    const status = State.use({ loading, active });

    const color = new State(BGCOLOR);
    const bgcolor = color.as(c => c.mix(BGCOLOR, 0.9));

    const load = () => loading.value = preventLoading;

    let img = null;

    if (entry.details.picture) {
        img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.style.opacity = 0;
        img.onload = () => {
            load();
            color.value = getImageColor(img);
            const ar = img.height / img.width;
            if (ar < ASPECT_RATIO && ar > MIN_ASPECT_RATIO) {
                img.style.width = Math.ceil(100 * ASPECT_RATIO / ar) + '%';
            }
            if (ar > ASPECT_RATIO) {
                img.style.width = Math.ceil(100 * ar / ASPECT_RATIO) + '%';
            }
            if (ar <= MIN_ASPECT_RATIO) {
                const fillerImg = document.createElement('img');
                fillerImg.crossOrigin = 'anonymous';
                fillerImg.className = "filler";
                fillerImg.style.width = Math.ceil(100 * ASPECT_RATIO / ar) + '%';
                fillerImg.src = img.src;
                img.parentElement.prepend(fillerImg);
            }
            img.style.opacity = 1;
        };
        img.onerror = load;
        img.alt = entry.details.title;
        img.src = entry.details.picture;
    }

    return M.div({
        className: status.as(({ loading, active }) => join(
            'card',
            loading && 'loading',
            active && 'active',
            user.all && entry.users && 'complete',
        )),
        style: {
            backgroundColor: bgcolor.as(c => c.opacity(0.7)),
        },
        onmouseenter: () => hover.value = true,
        onmouseleave: () => hover.value = false,
        onclick: (e) => {
            if (!e.target.onclick)
                active.value = !active.value
        },
    },
        Save(entry, bgcolor, color),
        M.div({
            className: loading.as(loading => join(
                'img',
                loading && 'loading',
            )),
            style: {
                boxShadow: isGPU && color.as(c => '0 16px 64px 8px ' + c.opacity(0.3))
            }
        },
            img,
        ),
        M.div({
            className: 'data'
        },
            M.h4({
                className: 'title',
            },
                active.as(a => a
                    ? limit(entry.details.title, 40)
                    : limit(entry.details.title, 24)
                ),
                entry.details.airing_date && Year(entry.details.airing_date),
            ),
            !user.preview
                ? M.div({
                    className: 'bar',
                    dataset: { score: entry.score },
                    style: {
                        display: active.as(a => a ? 'none' : 'block'),
                    }
                })
                : M.div({
                    className: 'bar',
                    style: {
                        backgroundColor: '#fff2',
                        display: active.as(a => a ? 'none' : 'block'),
                    }
                }),
            M.p({},
                entry.details.length && entry.details.length + ' Episode' + (entry.details.length > 1 ? 's ' : ' '),
                entry.details.length && M.span({}, ' - '),
                entry.details.mean.toFixed(2) + ' on ',
                Link(
                    'https://myanimelist.net/anime/' + entry.id,
                    'MyAnimeList ', LinkIcon
                ),
            ),
            M.p({ className: 'genres' },
                ...entry.details.genres
                    .map(genre => M.small({}, genre))
            ),
            !user.preview && (user.all && entry.users
                ? M.p({
                    className: 'entry-score',
                    dataset: { score: entry.score }
                },
                    'average score ',
                    M.b({}, entry.score),
                    ' by ',
                    entry.users.length,
                    ' users'
                )
                : M.p({
                    className: 'entry-score',
                    dataset: { score: entry.score }
                },
                    'scored ',
                    M.b({}, entry.score),
                    ' by ',
                    user.username,
                    ' ',
                )),
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
                        M.span({}, UserList(limit(user.username, 13)))
                    )
                )),
            ),
        ),
    );
};

const Save = (entry, bgcolor, shadow) => M.div({
    className: 'toggle-save',
    style: {
        backgroundColor: bgcolor,
        boxShadow: isGPU && shadow.as(c => 'inset 0 0 8px ' + c.opacity(0.3)),
    },
},
    session.saved.as(s => s.some(e => e.id === entry.id)
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
