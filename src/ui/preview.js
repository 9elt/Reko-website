import { State } from "@9elt/miniframe";
import { Link, M } from ".";
import { session } from "../global";
import { reko } from "../reko";
import { clamp, wfb } from "../util";
import { Card } from "./card";
import { ENTRY_PH } from "./recommendations";

const getncards = () => clamp(Math.floor(window.innerWidth / 250), 4);

const ncards = new State(getncards());
window.onresize = () => {
    let n = getncards();
    if (n !== ncards.value)
        ncards.value = n;
};

export const Preview = () => {
    const data = new State(null);

    if (session.value.username)
        reko(`/${session.value.username}/recommendations?page=1&batch=1`)
            .then(res => data.value = res.data)
            .catch(() => data.value = null);

    return M.div({
        className: 'preview'
    },
        M.h2({},
            'Hello ',
            session.value.username,
            ', welcome back!'
        ),
        M.div({
            className: 'imgs center-center',
            children: State.use({ data, size: ncards }).as(({ data, size }) =>
                wfb(data, ENTRY_PH, 8)
                    .slice(0, size)
                    .map(entry => Card({ all: true }, entry))
            )
        }),
        M.p({},
            Link('/recommendations', 'Go to your recommendations >')
        ),
    );
}
