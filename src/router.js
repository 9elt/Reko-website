import { root, router } from './global';
import Index from './pages';
import Recommendations from './pages/recommendations';
import Docs from './pages/docs';
import { Cache, scrollto, scrollup } from './util';
import { metadata } from './metadata';

const ROUTER = {
    "/": Index,
    "/recommendations": Recommendations,
    "/docs": Docs,
};

export const ROUTER_CACHE = new Cache();

router.sub(async (route, prev) => {
    if (!route)
        return;

    console.log('router', route);

    if (route === prev)
        console.log('router RELOAD');

    if (route !== window.location.pathname)
        window.history.pushState(route, '', route);

    try {
        const [r, hash] = route.split('#');
        root.value = ROUTER_CACHE.get(r)
            || ROUTER_CACHE.set(r, await ROUTER[r]());
        metadata(ROUTER[r].metadata);
        hash
            ? scrollto('#' + hash)
            : scrollup();
        console.log('router OK');
    }
    catch (error) {
        window.history.back();
        console.log('router CANCELED', error);
    }
});

router.reload = () => router.value = router.value;

router.set = (route) => router.value = route;

router.hydrate = () => ROUTER[router.value.split('#')[0]].hydrate();

window.onpopstate = () => {
    router.set(window.location.pathname);
};
