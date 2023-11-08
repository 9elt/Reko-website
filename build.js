import { readdir } from 'node:fs/promises';
import { createNode } from '@9elt/miniframe';
import { JSDOM } from 'jsdom';

const BASE_HTML = await Bun.file('./src/template.html').text();

const result = await Bun.build({
    entrypoints: ['./src/index.js'],
    outdir: './dist',
    minify: false,
});

if (!result) {
    console.log('Build failed', result);
    process.exit(1);
}

for (const name of await readdir('./src/pages'))
    try {
        await SSR('./src/pages/' + name);
    }
    catch (error) {
        console.log('ssr error', name, error);
    }

async function SSR(path, outdir = './dist') {
    global.window = new JSDOM(BASE_HTML).window;
    global.document = window.document;

    const { default: page } = await import(path);

    document.querySelector('.main').replaceWith(
        createNode({
            tagName: 'div',
            className: 'main',
            id: 'root',
            children: await page(),
        })
    );

    const filename = path.split('/').pop().replace('js', 'html');

    Bun.write(
        outdir + '/' + filename,
        document.documentElement.innerHTML
    );
}
