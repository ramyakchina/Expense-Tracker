// Create a new module
angular.module('myApp', ['ngRoute']);

angular.module('myApp').config(function ($routeProvider) {
    // configure the routes
    $routeProvider
            .when('/', {
                // route for the home page
                templateUrl: 'pages/home.html',
                controller: 'homeController'
            })
            .when('/add_expense', {
                // route for the order page
                templateUrl: 'pages/add_expense.html',
                controller: 'addExpenseController'
            })
            .when('/view_summary', {
                // route for the summary page
                templateUrl: 'pages/view_summary.html',
                controller: 'viewSummaryController'
            })
            .otherwise({
                // when all else fails
                templateUrl: 'pages/routeNotFound.html',
                controller: 'notFoundController'
            });
});
// define a iist of categories
angular.module('myApp').value('categoryList', ["Food", "Fuel", "Grocery",
    "Entertainment"]);
// define services
angular.module('myApp').factory('expService',
        function () {
            var prefix = 'exp-tracker';
            return {
                saveExpense:
                        function (data) {
                            var timeStamp = Math.round(new Date().getTime());
                            var key = prefix + timeStamp;
                            data.key = key;
                            data = JSON.stringify(data);
                            localStorage[key] = data;
                        },
                removeExpense:
                        function (remove) {
                            localStorage.removeItem(remove);
                        },
                getExpense:
                        function () {
                            var expenses = [];
                            var prefixLength = prefix.length;
                            Object.keys(localStorage).forEach(
                                    function (key) {
                                        if (key.substring(0, prefixLength) == prefix) {
                                            var item = window.localStorage[key];
                                            item = JSON.parse(item);
                                            item.key = key;
                                            expenses.push(item);
                                        }
                                    }
                            );
                            return expenses;
                        },
                getCategoryTotal:
                        function (category) {
                            var categoryTotal = 0;
                            var prefixLength = prefix.length;
                            Object.keys(localStorage).forEach(
                                    function (key) {
                                        if (key.substring(0, prefixLength) == prefix) {
                                            var item = localStorage[key];
                                            item = JSON.parse(item);
                                            if (item.category == category) {
                                                categoryTotal += parseFloat(item.amount);
                                            }
                                        }
                                    }
                            );
                            return categoryTotal;
                        }
            };
        }
);
angular.module('myApp').controller('homeController', function ($scope) {
    $scope.message = 'Welcome to my home page!';
});
angular.module('myApp').controller('notFoundController', function ($scope) {
    $scope.message = 'There seems to be a problem finding the page you wanted';
});
angular.module('myApp').controller('addExpenseController',
        function ($scope, categoryList, expService) {
            $scope.categories = categoryList;
            $scope.submit = function () {
                expService.saveExpense($scope.expense);
                alert('submitted');
            };
        }
);

angular.module('myApp').controller('viewSummaryController',
        function ($scope, expService, categoryList, $window) {
            $scope.expenses = expService.getExpense();
            $scope.summaryData = [];
            var categories = categoryList;
            categories.forEach(
                    function (item) {
                        var catTotal = expService.getCategoryTotal(item);
                        $scope.summaryData.push({
                            category: item,
                            amount: catTotal
                        });
                    }
            );

            $scope.remove = function (remove) {
                expService.removeExpense(remove);
            };



            $scope.reloadPage = function () {
                $window.location.reload();
            };
        }
);