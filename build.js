/*

config

*/

const MINIFY = true;
const ENTRYPOINT = './src/index.js';
const PAGES_DIR = './src/pages';
const STYLES_DIR = './src/styles';
const OUTPUT_DIR = './dist';
const HTML_TEMPLATE = './template.html';

/*

build

*/
import { createNode } from '@9elt/miniframe';
import { readdir } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import CleanCSS from 'clean-css';
import { metadata } from './src/metadata';

const build = await Bun.build({
    entrypoints: [ENTRYPOINT],
    outdir: OUTPUT_DIR,
    minify: MINIFY,
});

if (!build.success) {
    console.log('build failed', build);
    process.exit(1);
}

let html;
try {
    html = await Bun.file(HTML_TEMPLATE).text();
}
catch (error) {
    console.log('html template not found', error);
}

for (const name of await readdir(PAGES_DIR))
    try {
        global.window = new JSDOM(html).window;
        global.document = window.document;

        const { default: page } = await import(PAGES_DIR + '/' + name);

        document.querySelector('#root').replaceWith(
            createNode({
                tagName: 'div',
                className: 'main',
                id: 'root',
                children: await page(),
            })
        );

        metadata(page.metadata);

        Bun.write(
            OUTPUT_DIR + '/' + name.replace('js', 'html'),
            document.documentElement.innerHTML
        );
    }
    catch (error) {
        console.log('SSR error', name, error);
    }

let css = '';
for (const name of await readdir(STYLES_DIR))
    try {
        css += await Bun.file(STYLES_DIR + '/' + name).text();
    }
    catch (error) {
        console.log('CSS error', name, error);
    }

if (MINIFY)
    css = new CleanCSS().minify(css).styles;

Bun.write(
    OUTPUT_DIR + '/index.css',
    css
);
