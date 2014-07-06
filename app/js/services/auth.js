angular.module('livewireApp')
    .factory('AuthService', function ($http) {
        'use strict';

        var config = require('../config.json');

        return {
            login: function (credentials, response) {
                var data = {
                    "grant_type": "password",
                    "client_id": config.oauth.client_id,
                    "client_secret": config.oauth.client_secret,
                    "email": credentials.email,
                    "password": credentials.password
                };

                return $http
                    .post(config.paths.prefix + config.paths.login, data)
                    .success(function (data) {
                        response.data = data;
                    }).error(function (data, status) {
                        response.data = data;
                        response.status = status;
                    });
            },

            register: function (credentials, response) {
                var data = {
                    "oauth_secret": config.oauth.client_secret,
                    "customer": {
                        "email": credentials.email,
                        "password": credentials.password,
                        "first_name": credentials.first_name,
                        "last_name": credentials.last_name
                    }
                };

                return $http
                    .post(config.paths.prefix + config.paths.register, data, {'headers': {
                        'Accept': 'application/vnd.livewire+json;version=1'
                    }}).success(function (data) {
                        response.data = data;
                    }).error(function (data, status) {
                        response.data = data;
                        response.status = status;
                    });
            }
//            isAuthenticated: function () {
//                return !!Session.userId;
//            },
//            isAuthorized: function (authorizedRoles) {
//                if (!angular.isArray(authorizedRoles)) {
//                    authorizedRoles = [authorizedRoles];
//                }
//                return (this.isAuthenticated() &&
//                    authorizedRoles.indexOf(Session.userRole) !== -1);
//            }
        };
    });