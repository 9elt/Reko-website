import { createNode } from "@9elt/miniframe";
import { session } from "../global";
import { Link } from "../ui";
import { LoginForm } from "../ui/login";
import { Preview } from "../ui/preview";
import { Light, ReqMethod, TextSection } from "../ui/text";
import { M } from "../ui";

export default function Index() {
    return [M.div({
        className: 'content home',
    },
        TextSection({},
            M.h1({}, Light('Reko API')),
            M.br,
            M.p({},
                'Reko API is an Open Web API to ',
                M.strong({}, 'match similar MyAnimeList users'),
                ' and get ',
                M.strong({}, 'anime recommendations'),
                ' from their lists.',
            ),
            M.p({},
                'You can check out its ',
                Link('https://github.com/9elt/Reko', 'source code on GitHub'),
                '. ',
            ),
            M.p({},
                'If you are willing to implement',
                ' Reko API on your website or app',
                ', please read the ',
                Link('/docs', 'API Documentation'),
                '.'
            ),
        ),
        Main(),
        TextSection({},
            M.h2({}, 'Patch notes'),
            M.hr,
            M.br,
            M.h3({}, 'v0.4.1'),
            M.p({}, 'Recommendations ordering tweaks'),
            M.br,
            M.h3({}, 'v0.4.0'),
            M.p({}, 'New recommendations ordering'),
            M.br,
            M.h3({}, 'v0.3.2'),
            M.p({}, 'Already watched recommendations bug fixed'),
            M.br,
            M.h3({}, 'v0.3.1'),
            M.p({}, 'Empty responses no longer throw errors'),
            M.br,
            M.h3({}, 'v0.3.0'),
            M.p({},
                'Added ',
                Link(
                    '/docs#specific-user-recommendations',
                    ReqMethod('GET'), ' Specific User Recommendations'
                )
            ),
            M.p({},
                'Added similar users pagination (batch) in ',
                Link(
                    '/docs#user-recommendations',
                    ReqMethod('GET'), ' User Recommendations'
                )
            ),
            M.br,
            M.h3({}, 'v0.2.0'),
            M.p({}, 'Introduced hash based algorithm'),
            M.p({}, 'API simplified overall'),
            M.p({}, 'Added ',
                Link(
                    '/docs#compare-users',
                    ReqMethod('GET'), ' Compare Users'
                )
            )
        ),
    )];
}

function Main() {
    return M.div({ id: 'usr-action' },
        session.as(session => session
            ? Preview()
            : session === 0
                ? LoginForm()
                : M.div({ className: 'max-65 loading usr-ph' })
        )
    );
}

Index.metadata = {
    title: 'Reko API, Match Similar MyAnimeList Users',
    description: 'Find users with an high affinity and get anime recommendations',
};

Index.hydrate = () => {
    document
        .querySelector('#usr-action')
        .replaceWith(
            createNode(Main())
        );
};
