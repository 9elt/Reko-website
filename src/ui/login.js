import { State } from "@9elt/miniframe"
import { router, session } from "../global";
import { join } from "../util";
import { M } from ".";

export const LoginForm = () => {
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
            M.p({}, 'Enter your MyAnimeList username, to find similar similar users and get recommendations'),
            M.br,
            M.label({
                forHtml: 'mal-username',
            },
                error.as(err =>
                    err || 'MyAnimeList username'
                )
            ),
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
        ),
    );
}
