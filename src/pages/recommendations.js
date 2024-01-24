import { root, session } from '../global';
import { State } from '@9elt/miniframe';
import { reko } from '../reko';
import { isBigScreen, scrollup } from '../util';
import { Pagination, Toggler, Sidebar, Content } from '../ui/recommendations';
import { LoginForm } from '../ui/login';
import { M } from '../ui';

export default function Recommendations() {
    if (!session.value)
        return session.value === null
            ? [M.div({ className: 'max-65 loading usr-ph', style: { marginTop: '64px' } })]
            : [LoginForm()];

    const USER = session.value.username;

    const batchHandle = new State(1);
    const batchResponse = new State({ current: 1, next: 2, previous: null });

    const pageHandle = new State(1);
    const recoResponse = new State({ current: 1, next: 2, previous: null });

    const isSidebarOpen = new State(isBigScreen());

    const recoUser = new State({ null: true });

    const usersData = new State(null);
    const recommendationsData = new State(null);

    batchHandle.sub(async (batch) => {
        await updateUsers(batch);
        recoUser.value = { all: true };
    });

    let debounce = 0;

    pageHandle.sub(async (page) => {
        !debounce &&
            await updateRecommendations(recoUser.value, page, batchHandle.value);
    });

    recoUser.sub(async (user) => {
        debounce++;
        pageHandle.value = 1;
        debounce--;
        await updateRecommendations(user, pageHandle.value, batchHandle.value);
    });

    batchHandle.value = 1;

    async function updateUsers(batch) {
        try {
            const { data, pagination } = await reko(`/${USER}/similar?page=${batch}`);
            batchResponse.value = pagination;
            usersData.value = data;
            scrollup('.sidebar');
        }
        catch (err) {
            console.log(err);
        }
    }

    async function updateRecommendations(user, page, batch) {
        if (user.null)
            return (recommendationsData.value = null);
        try {
            const { data, pagination } = await reko(user.all
                ? `/${USER}/recommendations?page=${page}&batch=${batch}`
                : `/${USER}/recommendations/${user.username}?page=${page}`
            );
            recoResponse.value = pagination;
            recommendationsData.value = data;
            scrollup();
        } catch {
            recommendationsData.value = [];
        }
    }

    return [{
        tagName: 'div',
        className: 'content recommendations',
        children: [
            Toggler(isSidebarOpen),
            Sidebar(
                isSidebarOpen,
                recoUser,
                usersData,
                recommendationsData,
                Pagination(batchResponse, batchHandle)
            ),
            Content(
                recoUser,
                recommendationsData,
                Pagination(recoResponse, pageHandle)
            ),
        ]
    }];
}

Recommendations.metadata = {
    title: 'Recommendations',
    description: 'Anime recommendations form similar users lists',
};

Recommendations.hydrate = () => {
    root.value = Recommendations();
};
