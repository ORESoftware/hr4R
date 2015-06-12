/**
 * Created by amills001c on 6/9/15.
 */


/*global define */
define(['underscore', 'backbone', 'app/js/models'], function (_, Backbone, models) {
    'use strict';

    var TodosCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: models.Todo,

        //// Save all of thetodo items under the `"todos"` namespace.
        //localStorage: new Store('todos-backbone'),

        // Filter down the list of alltodo items that are finished.
        completed: function () {
            return this.where({completed: true});
        },

        // Filter down the list to onlytodo items that are still not finished.
        remaining: function () {
            return this.where({completed: false});
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function () {
            return this.length ? this.last().get('order') + 1 : 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: 'order'
    });

    var UsersCollection = Backbone.Collection.extend({
        // Reference to this collection's model.
        model: models.Todo,

        //// Save all of thetodo items under the `"todos"` namespace.
        //localStorage: new Store('todos-backbone'),

        // Filter down the list of alltodo items that are finished.
        completed: function () {
            return this.where({completed: true});
        },

        // Filter down the list to onlytodo items that are still not finished.
        remaining: function () {
            return this.where({completed: false});
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function () {
            return this.length ? this.last().get('order') + 1 : 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: 'order'
    });

    return {
        todos: new TodosCollection(),
        users: new UsersCollection()
    };
});