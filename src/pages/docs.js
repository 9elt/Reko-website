import { Link } from '../ui';
import { TypeScript, JavaScript } from '../ui/macros' assert { type: 'macro' };
import { Block, Light, Param, ReqMethod, ResCode, TextSection, SubTitle } from '../ui/text';
import { M } from '../ui';

export default function Docs() {
    return [M.div({
        className: 'content',
    },
        TextSection({},
            M.h1({},
                Light('Reko API | '),
                ' Documentation',
            ),
            Block('',
                M.p({},
                    'To learn more about the Reko API inner workings, please check out the ',
                    Link(
                        'https://github.com/9elt/Reko#algorithm',
                        'readme'
                    ),
                    ' on GitHub',
                ),
                M.p({},
                    'Reko API is online at ',
                    M.span({ className: 'inline-pre' }, 'https://api.reko.moe'),
                    ', you can check the server status and api version at ',
                    Link(
                        'https://api.reko.moe/version',
                        M.span({ className: 'inline-pre' }, '/version'),
                    ),
                    '.'
                ),
                M.p({},
                    'For any doubts or issues you can ',
                    Link(
                        'https://myanimelist.net/profile/_nelt',
                        'contact the developer,'
                    ),
                    ' or refer to ',
                    Link(
                        'https://myanimelist.net/forum/?topicid=2075707',
                        'this MyAnimeList post.'
                    )
                )
            ),
            M.hr,
            M.h4({}, 'index'),
            M.ul({ className: 'small' },
                M.li({}, Link('#generic-responses', ' Generic Responses')),
                M.li({}, Link('#generic-errors', ' Generic Errors')),
                M.li({}, Link('#user-recommendations', ReqMethod('GET'), ' User Recommendations')),
                M.li({}, Link('#specific-user-recommendations', ReqMethod('GET'), ' Specific User Recommendations')),
                M.li({}, Link('#similar-users', ReqMethod('GET'), ' Similar Users')),
                M.li({}, Link('#compare-users', ReqMethod('GET'), ' Compare Users')),
            ),
            M.hr,
            Block('generic-responses',
                M.h3({}, 'Responses'),
                M.p({}, 'Response data is wrapped in an object containing the requesting user data, and, for paginated responses, pagination details.'),
                TypeScript(`\
                | {
                |   requester: {
                |       username: string;
                |       hash: string;
                |   };
                |   pagination: {
                |       current: number;
                |       previous: number | null;
                |       next: number | null;
                |   };
                |   data: Data;
                | }`, 'typescript')
            ),
            Block('generic-errors',
                M.h3({}, 'Errors'),
                M.p({}, 'Common errors ', M.span({ className: 'inline-pre' }, 'text/plain')),
                M.p({}, ResCode(404, 'Resource does not exist')),
                M.p({}, ResCode(405, 'Invalid request method')),
                M.p({}, ResCode(503, 'Rate limited')),
                M.p({},
                    'All the errors that the server can handle, are sent as json. They include the response http satus code, a displayable message and their ',
                    M.b({}, 'unique id'),
                    '.'
                ),
                TypeScript(`\
                | {
                |     code: number;
                |     id: string;
                |     message: string;
                | }`, 'typescript'),
                M.p({},
                    'Common handled errors ',
                    M.span({ className: 'inline-pre' }, 'application/json'),
                    M.small({}, M.i({}, '(status | ids)')),
                    M.p({}, ResCode(403, 'PrivateUserList')),
                    M.p({}, ResCode(404, 'UserNotFound')),
                    M.p({}, ResCode(422, ['EmptyUserList', 'InvalidUserList'])),
                    M.p({}, ResCode(500, ['HashFailed', 'FailedSave'])),
                ),
            ),
            M.hr,
            Block('',
                M.h2({}, 'Requests')
            ),
            M.hr,
            Block('user-recommendations',
                M.h3({}, ReqMethod('GET'), ' User Recommendations'),
                M.p({}, 'Get anime recommendations from the lists of the most similar users.'),
                M.pre({}, '/{username}/recommendations?page={1-20}&batch={1-40}'),
                M.br,
                M.small({}, 'query parameters'),
                M.ul({},
                    Param(
                        'page',
                        'number',
                        'decides the recommendations page',
                        true,
                        'The page number is clamped between 1 and 20, pages MAY NOT return data.',
                    ),
                    Param(
                        'batch',
                        'number',
                        'decides the similar users batch',
                        true,
                        'The page number is clamped between 1 and 40, all pages return data.',
                    ),
                ),
                M.br,
                SubTitle(
                    'request example ',
                    M.small({}, M.i({}, '(javascript)')),
                ),
                JavaScript(`\
                | async function recommendations(username, page = 1, batch = 1) {
                |     const res = await fetch(
                |         \`https://api.reko.moe/\${username}/recommendations?page=\${page}&batch=\${batch}\`
                |     );
                |     return await res.json();
                | }`, 'javascript'),
                M.br,
                SubTitle('responses'),
                ResCode(200, 'Success'),
                TypeScript(`\
                | {
                |     requester: { ... };
                |     pagination: { ... };
                |     data: Array<{
                |         id: number;
                |         score: number;
                |         details: {
                |             title: string;
                |             mean: number;
                |             airing_date: string | null;
                |             length: number | null;
                |             rating: string | null;
                |             picture: string | null;
                |             genres: Array<string>;
                |         };
                |         users: Array<{
                |             score: number;
                |             username: string;
                |             hash: string;
                |             similarity: number;
                |         }>;
                |     }>;
                | }`, 'typescript'),
            ),
            M.hr,
            Block('specific-user-recommendations',
                M.h3({}, ReqMethod('GET'), ' Specific User Recommendations'),
                M.p({}, 'Get anime recommendations from the list of a specific user.'),
                M.pre({}, '/{username}/recommendations/{other}?page={1-20}'),
                M.br,
                M.small({}, 'query parameters'),
                M.ul({}, Param(
                    'page',
                    'number',
                    'decides the current pagination',
                    true,
                    'The page number is clamped between 1 and 20, pages MAY NOT return data.',
                )),
                M.br,
                SubTitle(
                    'request example ',
                    M.small({}, M.i({}, '(javascript)')),
                ),
                JavaScript(`\
                | async function recommendationsFrom(username, other, page = 1) {
                |     const res = await fetch(
                |         \`https://api.reko.moe/\${username}/recommendations/\${other}?page=\${page}\`
                |     );
                |     return await res.json();
                | }`, 'javascript'),
                M.br,
                SubTitle('responses'),
                ResCode(200, 'Success'),
                TypeScript(`\
                | {
                |     requester: { ... };
                |     pagination: { ... };
                |     data: Array<{
                |         id: number;
                |         score: number;
                |         details: {
                |             title: string;
                |             mean: number;
                |             airing_date: string | null;
                |             length: number | null;
                |             rating: string | null;
                |             picture: string | null;
                |             genres: Array<string>;
                |         };
                |     }>;
                | }`, 'typescript'),
            ),
            M.hr,
            Block('similar-users',
                M.h3({}, ReqMethod('GET'), ' Similar Users'),
                M.p({}, 'Get the most similar users.'),
                M.pre({}, '/{username}/similar?page={1-40}'),
                M.br,
                M.small({}, 'query parameters'),
                M.ul({}, Param(
                    'page',
                    'number',
                    'decides the current pagination',
                    true,
                    'The page number is clamped between 1 and 40, all pages return data.',
                )),
                M.br,
                SubTitle(
                    'request example ',
                    M.small({}, M.i({}, '(javascript)')),
                ),
                JavaScript(`\
                | async function similarUsers(username, page = 1) {
                |     const res = await fetch(
                |         \`https://api.reko.moe/\${username}/similar?page=\${page}\`
                |     );
                |     return await res.json();
                | }`, 'javascript'),
                M.br,
                SubTitle('responses'),
                ResCode(200, 'Success'),
                TypeScript(`\
                | {
                |     requester: { ... };
                |     pagination: { ... };
                |     data: Array<{
                |         username: string;
                |         hash: string;
                |         similarity: number;
                |     }>;
                | }`, 'typescript'),
            ),
            M.hr,
            Block('compare-users',
                M.h3({}, ReqMethod('GET'), ' Compare Users'),
                M.p({}, 'Compare two users.'),
                M.br,
                M.pre({}, '/{username}/compare/{other}'),
                M.br,
                SubTitle(
                    'request example ',
                    M.small({}, M.i({}, '(javascript)')),
                ),
                JavaScript(`\
                | async function compareUsers(username, other) {
                |     const res = await fetch(
                |         \`https://api.reko.moe/\${username}/compare/\${other}\`
                |     );
                |     return await res.json();
                | }`, 'javascript'),
                M.br,
                SubTitle('responses'),
                ResCode(200, 'Success'),
                TypeScript(`\
                | {
                |     requester: { ... };
                |     data: {
                |         username: string;
                |         hash: string;
                |         similarity: number;
                |     };
                | }`, 'typescript'),
            ),
        ),
    )];
}

Docs.metadata = {
    title: 'Documentation',
    description: 'Implement Reko API in your app',
};

Docs.hydrate = () => { };
