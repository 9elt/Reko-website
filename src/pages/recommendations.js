import { user } from '../states';
import { State } from '@9elt/miniframe';
import rekoAPI from '../api';
import { isBigScreen, scrollup } from '../util';
import { Pagination, Toggler, Sidebar, Content } from '../ui';

export default async function Recommendations() {
    if (user.value === null) {
        throw 'user not logged';
    }

    const USER = user.value;

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

    recoPage.sub(async (page) => {
        await updateRecommendations(recoUser.value, page, usersPage.value);
    });

    recoUser.sub(async user => {
        recoPage.value = 1;
        await updateRecommendations(user, recoPage.value, usersPage.value);
    });

    usersPage.value = 1;

    async function updateUsers(batch) {
        try {
            const { data, pagination } = await rekoAPI(`/${USER}/similar?page=${batch}`);
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
            const { data, pagination } = await rekoAPI(user.all
                ? `/${USER}/recommendations?page=${page}&batch=${batch}`
                : `/${USER}/recommendations/${user.username}?page=${page}`
            );
            recoPagination.value = pagination;
            recommendationsData.value = data;
            scrollup('.content');
        } catch {
            recommendationsData.value = [];
        }
    }

    return [
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
    ];
}
