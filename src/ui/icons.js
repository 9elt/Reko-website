export const LogOutIcon = ({ width, className }) => ({
    tagName: 'svg',
    className,
    viewBox: '0 0 300 300',
    style: { width, height: width },
    children: [
        { tagName: 'path', d: 'M154.5,227.4H80.6V68.3h73.9c3.1,0,5.7-2.5,5.7-5.7s-2.5-5.7-5.7-5.7 H74.9c-3.1,0-5.7,2.5-5.7,5.7v170.4c0,3.1,2.5,5.7,5.7,5.7h79.5c3.1,0,5.7-2.5,5.7-5.7 C160.1,230,157.6,227.4,154.5,227.4z' },
        { tagName: 'path', d: 'M249.4,143.9l-39.2-39.8c-2.2-2.2-5.8-2.2-8,0c-2.2,2.2-2.2,5.9,0,8.1 l29.5,30h-117c-3.1,0-5.7,2.6-5.7,5.7c0,3.2,2.5,5.7,5.7,5.7h117l-29.5,30 c-2.2,2.2-2.2,5.9,0,8.1c2.2,2.2,5.8,2.2,8,0l39.2-39.8 C251.6,149.8,251.6,146.1,249.4,143.9z' },
    ]
});

export const SaveIcon = ({ width, className }) => ({
    tagName: 'svg',
    className,
    viewBox: '0 0 300 300',
    style: { width, height: width },
    children: [
        { tagName: 'path', d: 'M205.9,62.9h-16.1v47.6c0,4.6-3.7,8.3-8.3,8.3h-70.5c-4.6,0-8.3-3.7-8.3-8.3V62.9 H79.5c-9.2,0-16.7,7.5-16.7,16.7v140.7c0,9.2,7.5,16.7,16.7,16.7h140.7 c9.2,0,16.7-7.5,16.7-16.7l0.9-125.2L205.9,62.9z M205.5,221.1H93.6v-48.8 c0-8.2,6.7-14.9,14.9-14.9h82.1c8.2,0,14.9,6.7,14.9,14.9V221.1z' },
        { tagName: 'rect', x: "158.6", y: "62.9", width: "17.8", height: "40" },
    ]
});

export const TrashIcon = ({ width, className }) => ({
    tagName: 'svg',
    className,
    viewBox: '0 0 300 300',
    style: { width, height: width },
    children: [
        { tagName: 'path', d: 'M206.9,104.4H93.7c-3.1,0-5.6,2.5-5.6,5.6v125.7c0,3.1,2.5,5.6,5.6,5.6 h113.2c3.1,0,5.6-2.5,5.6-5.6V110C212.5,106.9,210,104.4,206.9,104.4z M127.8,225.2 c0,2.1-1.7,3.9-3.9,3.9h-8c-2.1,0-3.9-1.7-3.9-3.9V120.4c0-2.1,1.7-3.9,3.9-3.9 h8c2.1,0,3.9,1.7,3.9,3.9V225.2z M158,225c0,2.1-1.7,3.9-3.9,3.9h-8c-2.1,0-3.9-1.7-3.9-3.9 V120.2c0-2.1,1.7-3.9,3.9-3.9h8c2.1,0,3.9,1.7,3.9,3.9V225z M188.4,225c0,2.1-1.7,3.9-3.9,3.9 h-8c-2.1,0-3.9-1.7-3.9-3.9V120.2c0-2.1,1.7-3.9,3.9-3.9h8c2.1,0,3.9,1.7,3.9,3.9V225z' },
        { tagName: 'path', d: 'M215,64.7h-39.5v-1.6c0-2.4-2-4.4-4.4-4.4H130c-2.4,0-4.4,2-4.4,4.4v1.6 H85c-2.4,0-4.4,2-4.4,4.4v20.8c0,2.4,2,4.4,4.4,4.4h130c2.4,0,4.4-2,4.4-4.4 V69.1C219.4,66.7,217.4,64.7,215,64.7z' },
    ]
});

export const ArrowLeftIcon = ({ width, className }) => ({
    tagName: 'svg',
    className,
    viewBox: '0 0 24 24',
    style: { width, height: width },
    children: [
        { tagName: 'path', d: 'M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z' },
    ]
});

export const ArrowRightIcon = ({ width, className }) => ({
    tagName: 'svg',
    className,
    viewBox: '0 0 24 24',
    style: { width, height: width },
    children: [
        { tagName: 'path', d: 'M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' },
    ]
});

export const ArrowNorthIcon = ({ width, className }) => ({
    tagName: 'svg',
    className,
    viewBox: '0 0 24 24',
    style: { width, height: width },
    children: [
        { tagName: 'path', d: 'M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z' },
    ]
});

export const LinkIcon = {
    className: 'transparent',
    tagName: 'small',
    children: [ArrowNorthIcon({ width: 12, className: 'white' })]
};
