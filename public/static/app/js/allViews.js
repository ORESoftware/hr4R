/**
 * Created by amills001c on 6/16/15.
 */


console.log('loading allViews');

//var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];


define('app/js/allViews',

    [
        'app/js/views/headerView',
        'app/js/views/footerView',
        'app/js/views/registeredUsersView',
        'app/js/views/indexView',
        'app/js/views/loginView',
        'app/js/views/homeView',
        'app/js/views/portalView',
        'app/js/views/userProfileView',
        'exports'
    ],

    function (HeaderView, FooterView, RegisteredUsersView, IndexView, LoginView, HomeView,PortalView, UserProfileView, exports) {


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
            Header: HeaderView,
            Footer: FooterView,
            Index: IndexView,
            Login: LoginView,
            Home: HomeView,
            Portal:PortalView,
            UserProfile: UserProfileView,
            RegisteredUsers: RegisteredUsersView
        };
    });