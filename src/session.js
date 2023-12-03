import { reko, API_CACHE } from "./reko";
import { ROUTER_CACHE } from "./router";
import { router, session } from "./global";
import { State } from "@9elt/miniframe";

const storage_get = () => {
    const data = localStorage.getItem('session') || 0;
    return data && JSON.parse(data);
};

const storage_set = (data) => {
    localStorage.setItem('session', JSON.stringify(data));
};

session.value = (() => {
    const user = storage_get();
    return user && user.username ? user : 0;
})();

session.login = async (username) => {
    await reko(`/${username}/recommendations?page=1&batch=1`);
    session.value = { saved: [], username };
    ROUTER_CACHE.clear();
    router.reload();
    storage_set(session.value);
}

session.logout = () => {
    session.value = 0;
    API_CACHE.clear();
    ROUTER_CACHE.clear();
    router.reload();
    storage_set(session.value);
}

session.saved = State.from(session.value.saved || []);

session.saved.sub(c => session.value.saved = c);

session.cansave = session.saved.as(s => s.length < 32);

session.save = (data) => {
    session.saved.set(c => [...c, {
        id: data.id,
        score: data.score,
        details: {
            title: data.details.title,
            mean: data.details.mean,
            airing_date: data.details.airing_date,
            length: data.details.length,
            rating: data.details.rating,
            picture: data.details.picture,
            genres: data.details.genres,
        }
    }]);
}

session.unsave = (id) => {
    session.saved.set(c => c.filter(e => e.id !== id));
}

window.addEventListener('beforeunload',
    () => storage_set(session.value)
);

export { };
