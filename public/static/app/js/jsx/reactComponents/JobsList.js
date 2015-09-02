/**
 * Created by amills001c on 7/31/15.
 */


/**
 * Created by denman on 7/25/2015.
 */




define(
    [
        'react',
        'jsx!app/js/views/reactComponents/Job'
    ],

    function (React, Job) {

        var JobList = React.createClass({displayName: "JobList",

            getInitialState: function () {

                return {jobs: [{job: 'job1', id:1, favorite:false}, {'job': 'job2', id:2, favorite:false}], favorites: []};
            },

            componentDidMount: function () {

                this.setState({jobs: [{job: 'job1', id:1, title:'manager',favorite:false}, {'job': 'job2', id:2, title:'developer',favorite:false}]});
            },

            jobClick: function (id) {

                // id holds the ID of the picture that was clicked.
                // Find it in the pictures array, and add it to the favorites

                console.log('JOB CLICK!!');

                var favorites = this.state.favorites;
                var jobs = this.state.jobs;

                for (var i = 0; i < jobs.length; i++) {

                    // Find the id in the pictures array

                    if (jobs[i].id == id) {
                        if (jobs[i].favorite) {
                            return this.favoriteClick(id);
                        }

                        favorites.push(jobs[i]);
                        jobs[i].favorite = true;
                    }

                }

                // Update the state and trigger a render
                this.setState({jobs: jobs, favorites: favorites});
            },

            favoriteClick: function (id) {

                // Find the picture in the favorites array and remove it. After this,
                // find the picture in the pictures array and mark it as a non-favorite.

                var favorites = this.state.favorites;
                var jobs = this.state.jobs;


                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == id) break;
                }

                // Remove the picture from favorites array
                favorites.splice(i, 1);


                for (i = 0; i < jobs.length; i++) {
                    if (jobs[i].id == id) {
                        jobs[i].favorite = false;
                        break;
                    }
                }

                // Update the state and trigger a render
                this.setState({jobs: jobs, favorites: favorites});

            },

            render: function () {

                var self = this;

                var jobs = this.state.jobs.map(function (job) {
                    return React.createElement(Job, {ref: job.id, src: job.src, title: job.title, favorite: job.favorite, 
                                    onClick: self.jobClick})
                });

                if (!jobs.length) {
                    jobs = React.createElement("p", null, "Loading jobs..");
                }

                var favorites = this.state.favorites.map(function (job) {
                    return React.createElement(Job, {ref: job.id, src: job.src, title: job.title, favorite: true, 
                                    onClick: self.favoriteClick})
                });

                if (!favorites.length) {
                    favorites = React.createElement("p", null, "Click an image to mark it as a favorite.");
                }

                return (

                    React.createElement("div", null, 
                        React.createElement("h1", null, "Popular Instagram pics"), 

                        React.createElement("div", {className: "jobs"}, " ", jobs, " "), 

                        React.createElement("h1", null, "Your favorites"), 

                        React.createElement("div", {className: "favorites"}, " ", favorites, " ")
                    )

                );
            }
        });

        return JobList;

    });