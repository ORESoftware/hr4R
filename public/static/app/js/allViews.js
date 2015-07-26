/**
 * Created by amills001c on 6/16/15.
 */


console.log('loading allViews');

//var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];


define('app/js/allViews',

    [
        'jsx!app/js/views/dashboardView',
        'app/js/views/headerView',
        'app/js/views/footerView',
        'app/js/views/registeredUsersView',
        'app/js/views/indexView',
        'app/js/views/loginView',
        'jsx!app/js/views/homeView',
        'jsx!app/js/views/pictureView',
        'app/js/views/portalView',
        'app/js/views/userProfileView',
        'jsx!app/js/views/overviewView',
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