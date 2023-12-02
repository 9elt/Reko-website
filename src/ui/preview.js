import { State } from "@9elt/miniframe";
import { session } from "../global"
import { reko } from "../reko"
import { wfb } from "../util";
import { Link, div, h2, p } from "./common";

export function Preview() {
    const data = State.from(null);

    reko(`/${session.value.username}/recommendations?page=1&batch=1`)
        .then(res => data.value = res.data)
        .catch(err => data.vale = null);

    return div({ className: 'max-65 preview' },
        h2({},
            'Hello ',
            session.value.username,
            ', welcome back!'
        ),
        {
            tagName: 'div',
            className: 'imgs',
            children: data.as(data => wfb(data, {
                details: { picture: '' }
            }, 8).slice(0, 6).map(entry => ({
                tagName: 'div',
                className: 'imgwrap',
                children: [{
                    tagName: 'img',
                    src: entry.details.picture
                }]
            })))

        },
        p({},
            Link('/recommendations', 'Go to your recommendations >')
        ),
    );
}
