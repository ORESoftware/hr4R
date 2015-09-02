/**
 * Created by amills001c on 6/16/15.
 */


console.log('loading #allStandardViews');


define(

    [
        'jsx!app/js/jsx/standardViews/dashboardView',
        'jsx!app/js/jsx/standardViews/headerView',
        'jsx!app/js/jsx/standardViews/footerView',
        'jsx!app/js/jsx/standardViews/registeredUsersView',
        'jsx!app/js/jsx/standardViews/indexView',
        'jsx!app/js/jsx/standardViews/loginView',
        'jsx!app/js/jsx/standardViews/homeView',
        'jsx!app/js/jsx/standardViews/pictureView',
        'jsx!app/js/jsx/standardViews/portalView',
        'jsx!app/js/jsx/standardViews/userProfileView',
        'jsx!app/js/jsx/standardViews/overviewView'

    ],

    function (DashboardView, HeaderView, FooterView, RegisteredUsersView,
              IndexView, LoginView, HomeView, PictureView, PortalView,
              UserProfileView, OverviewView, exports) {


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