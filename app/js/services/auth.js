angular.module('livewireApp')
    .factory('AuthService', function ($http) {
        'use strict';

        var config = require('../config.json'),
            persist = function (key, value) {
                // Store in localStorage
                var auth = angular.fromJson(window.localStorage.getItem("auth")) || {};
                auth[key] = value;
                window.localStorage.setItem("auth", angular.toJson(auth));
            };

        return {
            retrieveAccessToken: function () {
                var auth = angular.fromJson(window.localStorage.getItem("auth"));
                return (auth ? auth.access_token : null);
            },

            invalidateToken: function () {
                var auth = angular.fromJson(window.localStorage.getItem("auth"));
                delete auth.access_token;
                window.localStorage.setItem("auth", angular.toJson(auth));
            },

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
                        persist("access_token", data.access_token);

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
                        persist("access_token", data.customer.oauth.token);

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