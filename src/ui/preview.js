import { State } from "@9elt/miniframe";
import { session } from "../global"
import { reko } from "../reko"
import { wfb } from "../util";
import { Link, div, h2, p } from ".";
import { SmallCard } from "./card";
import { ENTRY_PH } from "./recommendations";

export const Preview = () => {
    const data = State.from(null);

    reko(`/${session.value.username}/recommendations?page=1&batch=1`)
        .then(res => data.value = res.data)
        .catch(() => data.vale = null);

    return div({ className: 'max-75 preview' },
        h2({},
            'Hello ',
            session.value.username,
            ', welcome back!'
        ),
        {
            tagName: 'div',
            className: 'imgs',
            children: data.as(data => wfb(data, ENTRY_PH, 8)
                .slice(0, 6).map(entry => SmallCard(entry))
            )
        },
        p({},
            Link('/recommendations', 'Go to your recommendations >')
        ),
    );
}
