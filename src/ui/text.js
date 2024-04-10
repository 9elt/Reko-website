import { M } from ".";

export const TextSection = (props, ...children) => M.div({
    className: 'text-section',
    ...props,
},
    M.div({
        className: 'text',
        children,
    }),
);

export const Block = (id, ...children) => M.div({
    id,
    className: 'block',
    children,
});

export const Light = (...children) => M.span({
    className: 'lighter',
    children,
});

export const SubTitle = (...children) => M.h5({
    className: 'sub-title',
    children,
});

export const ResCode = (code, msg) => M.b({
    className: 'res-code',
},
    M.span({
        className: code < 300 ? 'green' : 'red',
    },
        code
    ),
    ...(typeof msg === 'string' ? [msg] : msg).map(message =>
        M.span({
            className: 'inline-pre',
        },
            message
        )
    )
);

export const ReqMethod = (method) => M.span({
    className: method === 'GET' ? 'method green' : 'method blue',
},
    method
);

export const Param = (name, type, details, optional, more) => M.div({},
    M.li({},
        M.b({}, name, ' '),
        M.i({},
            type,
            ' ',
            M.small({}, optional ? '(optional)' : '(required)')
        ),
        '  |  ',
        details,
    ),
    more && M.small({}, more),
);
