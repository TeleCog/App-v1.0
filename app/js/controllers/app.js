angular.module('livewireApp')

.controller('AppCtrl', function () {
    'use strict';

    console.log("AppCtrl");
});

// Require sub controllers
require('./signin');
require('./register');
require('./providers');
require('./video');
