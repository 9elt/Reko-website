/**
 * 
 * @param {{ title: string; description: string; keywords: string; }} data 
 */
export function metadata(data) {
    document.title = data.title;

    const head = document.querySelector('head');
    const description = document.createElement('meta');
    description.name = 'description';
    description.content = data.description;

    const _d = document.querySelector('head>meta[name="description"]');
    _d && _d.remove();

    head.append(description);
}
