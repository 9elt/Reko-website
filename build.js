import { readdir } from 'node:fs/promises';
import { createNode } from '@9elt/miniframe';
import { JSDOM } from 'jsdom';

const PAGES_DIR = './src/pages';
const OUTPUT_DIR = './dist';

const BASE_HTML = await Bun.file('./src/template.html').text();

const result = await Bun.build({
    entrypoints: ['./src/index.js'],
    outdir: OUTPUT_DIR,
    minify: false,
});

if (!result) {
    console.log('build failed', result);
    process.exit(1);
}

for (const name of await readdir(PAGES_DIR))
    try {
        await SSR(name);
    }
    catch (error) {
        console.log('ssr error', name, error);
    }

async function SSR(name) {
    global.window = new JSDOM(BASE_HTML).window;
    global.document = window.document;

    const { default: page } = await import(PAGES_DIR + '/' + name);

    document.querySelector('.main').replaceWith(
        createNode({
            tagName: 'div',
            className: 'main',
            id: 'root',
            children: await page(),
        })
    );

    Bun.write(
        OUTPUT_DIR + '/' + name.replace('js', 'html'),
        document.documentElement.innerHTML
    );
}
