/**
 * Created by amills001c on 6/16/15.
 */



define(
    ['app/js/views/headerView',
        'app/js/views/footerView',
        'app/js/views/registeredUsersView',
        'app/js/views/indexView',
        'app/js/views/loginView',
        'app/js/views/homeView'],

    function (HeaderView, FooterView, RegisteredUsersView, IndexView, LoginView, HomeView) {

        return {
            Header: HeaderView,
            Footer: FooterView,
            Index: IndexView,
            Login: LoginView,
            Home: HomeView,
            RegisteredUsers: RegisteredUsersView
        };
    });