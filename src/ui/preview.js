import { State } from "@9elt/miniframe";
import { session } from "../global"
import { reko } from "../reko"
import { wfb } from "../util";
import { Link } from ".";
import { SmallCard } from "./card";
import { ENTRY_PH } from "./recommendations";
import { M } from ".";

export const Preview = () => {
    const data = State.from(null);

    if (session.value.username)
        reko(`/${session.value.username}/recommendations?page=1&batch=1`)
            .then(res => data.value = res.data)
            .catch(() => data.vale = null);

    return M.div({
        className: 'max-75 preview'
    },
        M.h2({},
            'Hello ',
            session.value.username,
            ', welcome back!'
        ),
        M.div({
            className: 'imgs',
            children: data.as(data => wfb(data, ENTRY_PH, 8)
                .slice(0, 6).map(entry => SmallCard(entry)))
        }),
        M.p({},
            Link('/recommendations', 'Go to your recommendations >')
        ),
    );
}
