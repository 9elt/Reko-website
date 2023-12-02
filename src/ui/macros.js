import hljs from "highlight.js";

/**
 * @param {string} code 
 * @param {'typescript' | 'javascript'} language 
 * @returns 
 */
export function Code(code, language) {
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
