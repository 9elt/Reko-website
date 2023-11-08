import { root, router } from './states';

import Index from './pages';
import Recommendations from './pages/recommendations';
import Docs from './pages/docs';

const ROUTER = {
    "/": Index,
    "/recommendations": Recommendations,
    "/docs": Docs,
};

export let CACHE = {};
CACHE.clear = () => CACHE = {};

router.sub(async (route, prev) => {
    console.log('router', route);

    if (route === prev)
        return console.log('router STAY');

    if (route !== window.location.pathname)
        window.history.pushState(route, '', route);

    try {
        root.value = CACHE[route] || (CACHE[route] = await ROUTER[route]());
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
