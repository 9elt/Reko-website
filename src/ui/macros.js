import hljs from "highlight.js";

/**
 * @param {string} code 
 * @param {"javascript" | "typescript"} language 
 * @returns {{ tagName: "pre"; className: "snippet"; innerHTML: string; }}
 */
function Code(code, language) {
    return {
        tagName: 'pre',
        className: 'snippet',
        innerHTML: hljs.highlight(
            code.split('\n').map(line =>
                line.replace(/^([ ]*\|\s?)/g, '')
            ).join('\n'),
            { language }
        ).value,
    };
}

/**
 * @param {string} code 
 */
export function JavaScript(code) {
    return Code(code, 'javascript');
}

/**
 * @param {string} code 
 */
export function TypescriptScript(code) {
    return Code(code, 'typescript');
}
