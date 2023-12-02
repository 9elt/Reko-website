import { createNode } from "@9elt/miniframe";
import { session } from "../global";
import { Link, div, em, h1, h2, h3, h4, p, strong } from "../ui";
import { LoginForm } from "../ui/login";
import { Preview } from "../ui/preview";
import { Light, ReqMethod, TextSection, br, hr } from "../ui/text";

export default function Index() {
    return [{
        tagName: 'div',
        className: 'content home',
        children: [
            TextSection({},
                h1({}, Light('Reko API')),
                br,
                p({},
                    'Reko API is an Open Web API to ',
                    strong({}, 'match similar MyAnimeList users'),
                    ' and get ',
                    strong({}, 'anime recommendations'),
                    ' from their lists.',
                ),
                p({},
                    'You can check out its ',
                    Link('https://github.com/9elt/Reko', 'source code on GitHub'),
                    '. ',
                ),
                p({},
                    'If you are willing to implement',
                    ' Reko API on your website or app',
                    ', please read the ',
                    Link('/docs', 'API Documentation'),
                    '.'
                ),
            ),
            Main(),
            TextSection({},
                h2({}, 'Patch notes'),
                hr,
                br,
                h3({}, 'v0.3.1'),
                p({}, 'Empty responses no longer throw errors'),
                br,
                h3({}, 'v0.3.0'),
                p({},
                    'Added ',
                    Link(
                        '/docs#specific-user-recommendations',
                        ReqMethod('GET'), ' Specific User Recommendations'
                    )
                ),
                p({},
                    'Added similar users pagination (batch) in ',
                    Link(
                        '/docs#user-recommendations',
                        ReqMethod('GET'), ' User Recommendations'
                    )
                ),
                br,
                h3({}, 'v0.2.0'),
                p({}, 'Introduced hash based algorithm'),
                p({}, 'API simplified overall'),
                p({}, 'Added ',
                    Link(
                        '/docs#compare-users',
                        ReqMethod('GET'), ' Compare Users'
                    )
                )
            ),
        ],
    }];
}

function Main() {
    return div({ id: 'usr-action' },
        session.as(session => session
            ? Preview()
            : session === 0
                ? LoginForm()
                : div({ className: 'max-65 loading usr-ph' })
        )
    );
}

Index.metadata = {
    title: 'Reko API, Match similar MyAnimeList users',
    description: 'Find users with an high affinity and get anime recommendations',
};

Index.hydrate = () => {
    document
        .querySelector('#usr-action')
        .replaceWith(
            createNode(Main())
        );
};
