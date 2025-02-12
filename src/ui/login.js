import { State } from "@9elt/miniframe";
import { M } from ".";
import { router, session } from "../global";
import { join } from "../util";
import { LogOutIcon } from "./icons";
import { RekoLogo } from "./logo";

export const LoginForm = (props) => {
    const loading = new State(false);
    const username = new State('');
    const error = new State('');
    const status = State.use({ error, loading });

    const oninput = (e) => {
        if (error.value)
            error.value = '';
        username.value = e.target.value;
    }

    const onsubmit = async (e) => {
        e.preventDefault();
        loading.value = true;
        try {
            const user = username.value.trim();
            if (!user || error.value)
                return loading.value = false;
            await session.login(user);
            router.set('/recommendations');
        }
        catch (err) {
            error.value = err.message || 'An error occurred';
        }
        loading.value = false;
    }

    return M.div({
        className: 'max-65 login-container',
        ...props,
    },
        M.h2({},
            'Connect to find similar users!'
        ),
        M.form({
            onsubmit,
            className: status.as(({ error: e, loading: l }) => join(
                'login',
                e && 'error',
                l && 'wloading',
            )),
        },
            RekoLogo({
                className: 'login-background',
            }),
            M.p({},
                'Enter your MyAnimeList username, to find similar users and get recommendations'
            ),
            M.br,
            M.label({
                forHtml: 'mal-username',
            },
                error.as(err =>
                    err || 'MyAnimeList username'
                )
            ),
            M.div({
                className: 'winput-wrapper',
            },
                M.div({
                    className: 'winput',
                },
                    M.input({
                        id: 'mal-username',
                        name: 'mal-username',
                        type: 'text',
                        value: username,
                        oninput,
                    })
                ),
                M.button({
                    type: 'submit',
                    disabled: status.as(({ error: e, loading: l }) => e || l),
                },
                    LogOutIcon({
                        width: 32,
                        className: error.as(err =>
                            err ? 'red' : 'blue'
                        ),
                    }),
                ),
            ),
        ),
    );
}
