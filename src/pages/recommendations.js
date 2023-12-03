import { root, session } from '../global';
import { State } from '@9elt/miniframe';
import { reko } from '../reko';
import { isBigScreen, scrollup } from '../util';
import { div } from '../ui';
import { Pagination, Toggler, Sidebar, Content } from '../ui/recommendations';
import { LoginForm } from '../ui/login';

export default function Recommendations() {
    if (!session.value)
        return session.value === null
            ? [div({ className: 'max-65 loading usr-ph', style: { marginTop: '64px' } })]
            : [LoginForm()];

    const USER = session.value.username;

    const usersPage = State.from(1);
    const usersPagination = State.from({ current: 1, next: 2, previous: null });

    const recoPage = State.from(1);
    const recoPagination = State.from({ current: 1, next: 2, previous: null });

    const isSidebarOpen = State.from(isBigScreen());

    const recoUser = State.from({ null: true });

    const usersData = State.from(null);
    const recommendationsData = State.from(null);

    usersPage.sub(async (batch) => {
        await updateUsers(batch);
        recoUser.value = { all: true };
    });

    let debounce = 0;

    recoPage.sub(async (page) => {
        !debounce &&
            await updateRecommendations(recoUser.value, page, usersPage.value);
    });

    recoUser.sub(async (user) => {
        debounce++;
        recoPage.value = 1;
        debounce--;
        await updateRecommendations(user, recoPage.value, usersPage.value);
    });

    usersPage.value = 1;

    async function updateUsers(batch) {
        try {
            const { data, pagination } = await reko(`/${USER}/similar?page=${batch}`);
            usersPagination.value = pagination;
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
            recoPagination.value = pagination;
            recommendationsData.value = data;
            scrollup('.wrapper');
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
                Pagination(usersPagination, usersPage)
            ),
            Content(
                recoUser,
                recommendationsData,
                Pagination(recoPagination, recoPage)
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
