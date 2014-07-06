angular.module('livewireApp')
    .factory('AuthService', function ($http) {
        'use strict';

        return {
            login: function (credentials, response) {
                var data = {
                    "grant_type": "password",
                    "client_id": "ae862467952b9fa06e25cb8b801bbb54b4f38e140f90a41f48386923cb043729",
                    "client_secret": "d2162e76a111e6df0dc37ded950280d7eba36092c6748a704c33b93b1590d261",
                    "email": credentials.email,
                    "password": credentials.password
                };

                return $http
                    .post('http://www.lvh.me:3000/oauth/token', data)
                    .success(function (data) {
                        response.data = data;
                    }).error(function (data, status) {
                        response.data = data;
                        response.status = status;
                    });
            },

            register: function (credentials, response) {
                var data = {
                    "oauth_secret": "d2162e76a111e6df0dc37ded950280d7eba36092c6748a704c33b93b1590d261",
                    "customer": {
                        "email": credentials.email,
                        "password": credentials.password,
                        "first_name": credentials.first_name,
                        "last_name": credentials.last_name
                    }
                };

                return $http
                    .post('https://www.livewiremobiletest.tk/api/customer/registrations.json', data, {'headers': {
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