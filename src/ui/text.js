export const TextSection = (props, ...children) => ({
    tagName: 'div',
    className: 'text-section',
    children: [{
        tagName: 'div',
        className: 'text',
        children,
    }],
    ...props,
});

export const Block = (id, ...children) => ({
    tagName: 'div',
    className: 'block',
    id,
    children,
});

export const Light = (...children) => ({
    tagName: 'span',
    className: 'lighter',
    children,
});

export const ResCode = (code, msg) => ({
    tagName: 'b',
    children: [
        {
            tagName: 'span',
            className: code < 300 ? 'green' : 'red',
            children: [code],
        },
        ...(typeof msg === 'string' ? [msg] : msg).map(message => ({
            tagName: 'pre',
            className: 'inline',
            children: [message],
        }))
    ]
});

export const ReqMethod = (method) => ({
    tagName: 'span',
    className: method === 'GET' ? 'method green' : 'method blue',
    children: [method]
});

export const Param = (name, type, details, optional, more) => ({
    tagName: 'div',
    children: [
        {
            tagName: 'li',
            children: [
                { tagName: 'b', children: [name, ' '] },
                {
                    tagName: 'i',
                    children: [
                        type + ' ',
                        {
                            tagName: 'small',
                            children: [optional
                                ? '(optional)'
                                : '(required)'
                            ]
                        },
                    ]
                },
                '  |  ',
                details,
            ]
        },
        more && {
            tagName: 'small',
            children: [more]
        }
    ]
});

export const br = { tagName: 'br' };

export const hr = { tagName: 'hr' };
