import { FullPre, InlinePre, Link, b, h1, h2, h3, h4, h5, i, li, p, small, ul } from '../ui';
import { Code } from '../ui/macros' assert { type: 'macro' };
import { Block, hr, br, Light, Param, ReqMethod, ResCode, TextSection } from '../ui/text';

export default function Docs() {
    return [{
        tagName: 'div',
        className: 'content',
        children: [TextSection({},
            h1({},
                Light('Reko API | '),
                ' Documentation',
            ),
            Block('',
                p({},
                    'To learn more about the Reko API inner workings, please check out the ',
                    Link(
                        'https://github.com/9elt/Reko#algorithm',
                        'readme'
                    ),
                    ' on GitHub',
                ),
                p({},
                    'Reko API is online at ',
                    InlinePre('https://api.reko.moe'),
                    ', you can check the server status and api version at ',
                    InlinePre('/version'),
                    '.'
                ),
                p({},
                    'For any doubts or issues you can ',
                    Link(
                        'https://myanimelist.net/profile/_nelt',
                        'contact the developer.'
                    )
                )
            ),
            hr,
            h4({}, 'index'),
            ul({ className: 'small' },
                li({}, Link('#generic-responses', ' Generic Responses')),
                li({}, Link('#generic-errors', ' Generic Errors')),
                li({}, Link('#user-recommendations', ReqMethod('GET'), ' User Recommendations')),
                li({}, Link('#specific-user-recommendations', ReqMethod('GET'), ' Specific User Recommendations')),
                li({}, Link('#similar-users', ReqMethod('GET'), ' Similar Users')),
                li({}, Link('#compare-users', ReqMethod('GET'), ' Compare Users')),
            ),
            hr,
            Block('generic-responses',
                h3({}, 'Responses'),
                p({}, 'Response data is wrapped in an object containing the requesting user data, and, for paginated responses, pagination details.'),
                Code(`\
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
                h3({}, 'Errors'),
                p({}, 'Common errors ', InlinePre('text/plain')),
                p({}, ResCode(404, 'Resource does not exist')),
                p({}, ResCode(405, 'Invalid request method')),
                p({}, ResCode(503, 'Rate limited')),
                p({},
                    'All the errors that the server can handle, are sent as json. They include the response http satus code, a displayable message and their ',
                    b({}, 'unique id'),
                    '.'
                ),
                Code(`\
                | {
                |     code: number;
                |     id: string;
                |     message: string;
                | }`, 'typescript'),
                p({},
                    'Common handled errors ',
                    InlinePre('application/json'),
                    small({}, i({}, '(status | ids)')),
                    p({}, ResCode(403, 'PrivateUserList')),
                    p({}, ResCode(404, 'UserNotFound')),
                    p({}, ResCode(422, ['EmptyUserList', 'InvalidUserList'])),
                    p({}, ResCode(500, ['HashFailed', 'FailedSave'])),
                ),
            ),
            hr,
            Block('',
                h2({}, 'Requests')
            ),
            hr,
            Block('user-recommendations',
                h3({}, ReqMethod('GET'), ' User Recommendations'),
                p({}, 'Get anime recommendations from the lists of the most similar users.'),
                FullPre('/{username}/recommendations?page={1-20}&batch={1-40}'),
                br,
                small({}, 'query parameters'),
                ul({},
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
                br,
                h5({},
                    'request example ',
                    small({}, i({}, '(javascript)')),
                ),
                Code(`\
                | async function recommendations(username, page = 1, batch = 1) {
                |     const res = await fetch(
                |         \`https://api.reko.moe/\${username}/recommendations?page=\${page}&batch=\${batch}\`
                |     );
                |     return await res.json();
                | }`, 'javascript'),
                br,
                h5({}, 'responses'),
                ResCode(200, 'Success'),
                Code(`\
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
            hr,
            Block('specific-user-recommendations',
                h3({}, ReqMethod('GET'), ' Specific User Recommendations'),
                p({}, 'Get anime recommendations from the list of a specific user.'),
                FullPre('/{username}/recommendations/{other}?page={1-20}'),
                br,
                small({}, 'query parameters'),
                ul({}, Param(
                    'page',
                    'number',
                    'decides the current pagination',
                    true,
                    'The page number is clamped between 1 and 20, pages MAY NOT return data.',
                )),
                br,
                h5({},
                    'request example ',
                    small({}, i({}, '(javascript)')),
                ),
                Code(`\
                | async function recommendationsFrom(username, ohter, page = 1) {
                |     const res = await fetch(
                |         \`https://api.reko.moe/\${username}/recommendations/\${other}?page=\${page}\`
                |     );
                |     return await res.json();
                | }`, 'javascript'),
                br,
                h5({}, 'responses'),
                ResCode(200, 'Success'),
                Code(`\
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
            hr,
            Block('similar-users',
                h3({}, ReqMethod('GET'), ' Similar Users'),
                p({}, 'Get the most similar users.'),
                FullPre('/{username}/similar?page={1-40}'),
                br,
                small({}, 'query parameters'),
                ul({}, Param(
                    'page',
                    'number',
                    'decides the current pagination',
                    true,
                    'The page number is clamped between 1 and 40, all pages return data.',
                )),
                br,
                h5({},
                    'request example ',
                    small({}, i({}, '(javascript)')),
                ),
                Code(`\
                | async function similarUsers(username, page = 1) {
                |     const res = await fetch(
                |         \`https://api.reko.moe/\${username}/similar?page=\${page}\`
                |     );
                |     return await res.json();
                | }`, 'javascript'),
                br,
                h5({}, 'responses'),
                ResCode(200, 'Success'),
                Code(`\
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
            hr,
            Block('compare-users',
                h3({}, ReqMethod('GET'), ' Compare Users'),
                p({}, 'Compare two users.'),
                br,
                FullPre('/{username}/compare/{other}'),
                br,
                h5({},
                    'request example ',
                    small({}, i({}, '(javascript)')),
                ),
                Code(`\
                | async function compareUsers(username, other) {
                |     const res = await fetch(
                |         \`https://api.reko.moe/\${username}/compare/\${other}\`
                |     );
                |     return await res.json();
                | }`, 'javascript'),
                br,
                h5({}, 'responses'),
                ResCode(200, 'Success'),
                Code(`\
                | {
                |     requester: { ... };
                |     data: {
                |         username: string;
                |         hash: string;
                |         similarity: number;
                |     };
                | }`, 'typescript'),
            ),
        )],
    }];
}

Docs.metadata = {
    title: 'Documentation',
    description: 'Implement Reko API in your app',
};

Docs.hydrate = () => { };
