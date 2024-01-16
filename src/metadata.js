/**
 * @param {{ title: string; description: string; keywords: string; }} data 
 */
export function metadata(data) {
    document.title = data.title;

    const description = document.createElement('meta');
    description.name = 'description';
    description.content = data.description;

    const prev = document.querySelector('head>meta[name="description"]');

    prev
        ? prev.replaceWith(description)
        : document.head.append(description);
}
