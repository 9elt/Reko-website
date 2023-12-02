import { reko } from "./reko";
import { version } from "./global";

reko('/version').then(v => {
    version.value = v;
}).catch(() => {
    version.value = 0;
});

export { };
