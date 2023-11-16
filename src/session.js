import rekoAPI, { API_CACHE } from "./api";
import { ROUTER_CACHE } from "./router";
import { router, user } from "./states";

const STORAGE = {
    get() {
        const data = localStorage.getItem('session') || null;
        return data && JSON.parse(data);
    },
    set(data) {
        localStorage.setItem('session', JSON.stringify(data));
    }
}

const _user_legacy_init_ = () => {
    const user = STORAGE.get();
    return user && user.username ? user : null;
}

user.value = _user_legacy_init_();

user.login = async (username) => {
    await rekoAPI(`/${username}/recommendations?page=1&batch=1`);
    user.value = { saved: [], username };
    ROUTER_CACHE.clear();
    router.value = router.value;
    STORAGE.set(user.value);
}

user.logout = () => {
    user.value = null;
    API_CACHE.clear();
    ROUTER_CACHE.clear();
    router.value = router.value;
    STORAGE.set(user.value);
}

user.save = (data) => {
    user.value.saved.length < 32 &&
        user.value.saved.push(data);
}

user.unsave = (id) => {
    user.value.saved =
        user.value.saved.filter(e => e.id !== id);
}

window.onbeforeunload = () => {
    STORAGE.set(user.value);
}
