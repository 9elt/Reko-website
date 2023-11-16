import { root, router } from './states';

import Index from './pages';
import Recommendations from './pages/recommendations';
import Docs from './pages/docs';
import { Cache } from './util';

const ROUTER = {
    "/": Index,
    "/recommendations": Recommendations,
    "/docs": Docs,
};

export const ROUTER_CACHE = new Cache();

router.sub(async (route, prev) => {
    console.log('router', route);

    if (route === prev)
        console.log('router RELOAD');

    if (route !== window.location.pathname)
        window.history.pushState(route, '', route);

    try {
        console.log(root.value);
        root.value = ROUTER_CACHE.get(route)
            || ROUTER_CACHE.set(route, await ROUTER[route]());
        console.log(root.value);
        console.log('router OK');
    }
    catch (error) {
        window.history.back();
        console.log('router CANCELED', error);
    }
});

window.onpopstate = () => {
    router.value = window.location.pathname;
};
