/**
 * Created by amills001c on 6/16/15.
 */


console.log('loading #standardViews');


define(

    [
        'jsx!app/js/views/standardViews/dashboardView',
        'app/js/views/standardViews/headerView',
        'app/js/views/standardViews/footerView',
        'app/js/views/standardViews/registeredUsersView',
        'app/js/views/standardViews/indexView',
        'app/js/views/standardViews/loginView',
        'jsx!app/js/views/standardViews/homeView',
        'jsx!app/js/views/standardViews/pictureView',
        'app/js/views/standardViews/portalView',
        'app/js/views/standardViews/userProfileView',
        'jsx!app/js/views/standardViews/overviewView',
        'exports'
    ],

    function (DashboardView, HeaderView, FooterView, RegisteredUsersView, IndexView, LoginView, HomeView, PictureView, PortalView, UserProfileView, OverviewView, exports) {


        //exports.allViews = {
        //
        //        Header: HeaderView,
        //        Footer: FooterView,
        //        Index: IndexView,
        //        Login: LoginView,
        //        Home: HomeView,
        //        RegisteredUsers: RegisteredUsersView
        //};


        return {
            Dashboard: DashboardView,
            Header: HeaderView,
            Footer: FooterView,
            Index: IndexView,
            Login: LoginView,
            Picture: PictureView,
            Home: HomeView,
            Portal: PortalView,
            Overview: OverviewView,
            UserProfile: UserProfileView,
            RegisteredUsers: RegisteredUsersView
        };
    });