import { reko, API_CACHE } from "./reko";
import { ROUTER_CACHE } from "./router";
import { router, session } from "./global";
import { State } from "@9elt/miniframe";

const STORAGE = {
    get() {
        const data = localStorage.getItem('session') || 0;
        return data && JSON.parse(data);
    },
    set(data) {
        localStorage.setItem('session', JSON.stringify(data));
    }
}

session.value = (_user_legacy_init_ = () => {
    const user = STORAGE.get();
    return user && user.username ? user : 0;
})();

session.login = async (username) => {
    await reko(`/${username}/recommendations?page=1&batch=1`);
    session.value = { saved: [], username };
    ROUTER_CACHE.clear();
    router.reload();
    STORAGE.set(session.value);
}

session.logout = () => {
    session.value = 0;
    API_CACHE.clear();
    ROUTER_CACHE.clear();
    router.reload();
    STORAGE.set(session.value);
}

session.saved = State.from(session.value.saved || []);

session.saved.sub(c => session.value.saved = c);

session.cansave = session.saved.as(s => s.length < 32);

session.save = (data) => {
    session.saved.set(c => [...c, data]);
}

session.unsave = (id) => {
    session.saved.set(c => c.filter(e => e.id !== id));
}

session.has = (id) => {
    return session.saved.value.some(e => e.id == id);
}

window.onbeforeunload = () => {
    STORAGE.set(session.value);
}

export { };
