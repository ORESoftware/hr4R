/**
 * Created by amills001c on 6/16/15.
 */


console.log('loading #allStandardViews');


define(

    [
        'app/js/jsx/standardViews/dashboardView',
        'app/js/jsx/standardViews/headerView',
        'app/js/jsx/standardViews/footerView',
        'app/js/jsx/standardViews/registeredUsersView',
        'app/js/jsx/standardViews/indexView',
        'app/js/jsx/standardViews/loginView',
        'app/js/jsx/standardViews/homeView',
        'app/js/jsx/standardViews/pictureView',
        'app/js/jsx/standardViews/portalView',
        'app/js/jsx/standardViews/userProfileView',
        'app/js/jsx/standardViews/overviewView'

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