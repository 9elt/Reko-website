import "./version";
import "./session";
import "./router";
import "./hydrate";

function debug(state) {
    document.body.classList[
        (typeof state === 'boolean' ? !state
            : document.body.classList.contains('debug'))
            ? 'remove' : 'add'
    ]('debug');
}

debug(false);
