import { Link } from "../ui";

export default function Index() {
    return [{
        tagName: 'div',
        className: 'content',
        children: [
            Link('/recommendations', 'Recommendations')
        ],
    }];
}
