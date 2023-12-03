import { State } from "@9elt/miniframe"
import { router, session } from "../global";
import { join } from "../util";
import { h2, p } from ".";
import { br } from "./text";

export const LoginForm = () => {
    const loading = State.from(false);
    const username = State.from('');
    const error = State.from('');

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

    return {
        tagName: 'div',
        className: 'max-65 login-container',
        children: [
            h2({},
                'Connect to find similar users!'
            ),
            {
                tagName: 'form',
                className: State
                    .use({ e: error, l: loading })
                    .as(({ e, l }) =>
                        join('login', e ? 'error' : '', l ? 'wloading' : '')
                    ),
                onsubmit,
                children: [
                    p({}, 'Enter your MyAnimeList username, to find similar similar users and get recommendations'),
                    br,
                    {
                        tagName: 'label',
                        forHtml: 'mal-username',
                        children: [error.as(err =>
                            err || 'MyAnimeList username'
                        )]
                    },
                    {
                        tagName: 'div',
                        className: 'winput',
                        children: [
                            {
                                tagName: 'input',
                                id: 'mal-username',
                                name: 'mal-username',
                                type: 'text',
                                value: username,
                                oninput,
                            },]
                    },
                ]
            }]
    }
}
