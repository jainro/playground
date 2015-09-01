'use strict';

angular.module('myApp.dashboard', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCrtl'
        }).when('/list', {
            templateUrl: 'dashboard/featureList.html',
            controller: 'FeatureListCrtl'
        }).when('/scenarioList', {
            templateUrl: 'dashboard/featureList.html',
            controller: 'FeatureListCrtl'
        });
    }])

    .controller('DashboardCrtl', function ($scope, $http) {
        $http.get('executionReport.json').success(function (data) {
            $scope.executionReport = data;
        });
    })

    .service('FeatureListCrtl', function ($scope, $http) {
        if (!$scope.allScenarios) {
            $rootScope.allScenarios = {result: {passed: 0, failed: 0}, data: []};
            $http.get('executionReport.json').success(function (data) {
                data.forEach(function (feature) {
                    feature.result = {scenarios: 0, passed: 0, failed: 0, status: "Passed", isCollapsed: true};

                    feature.elements.forEach(function (scenario) {
                        feature.result.scenarios++;
                        $scope.allScenarios.data.push(scenario);
                        scenario.result = {
                            passed: 0,
                            failed: 0,
                            skipped: 0,
                            status: "Passed",
                            isCollapsed: true,
                            failedStep: {name: ''}
                        };
                        scenario.featureFileName = feature.uri;

                        scenario.steps.forEach(function (step) {
                            if (step.result.status == 'passed') {
                                scenario.result.passed++;
                            } else if (step.result.status == 'failed') {
                                scenario.result.failed++;
                                scenario.result.failedStep = step;
                                //feature.result.failedStep = step;
                            } else if (step.result.status == 'skipped') {
                                scenario.result.skipped++;
                            }
                        });

                        if (scenario.result.failed > 0) {
                            scenario.result.status = "Failed";
                            feature.result.failed++;
                            $scope.allScenarios.result.failed++;
                        } else {
                            feature.result.passed++;
                            $scope.allScenarios.result.passed++;
                        }

                    });

                    if (feature.result.failed > 0) {
                        feature.result.status = "Failed";
                    }
                });

                $rootScope.executionReport = data;
            });
        }

        $scope.$watch('failingStep', function () {
            $rootScope.allScenarios.data.forEach(function (scenario) {
                scenario.result.isCollapsed = $scope.failingStep != 'show';

            });
        }, true);


    })

    .controller('FeatureListCrtl', function ($rootScope, $scope, $http) {
        $scope.failingStep = 'hide';
        if (!$rootScope.allScenarios) {
            $rootScope.allScenarios = {result: {passed: 0, failed: 0}, data: []};
            $http.get('executionReport.json').success(function (data) {
                data.forEach(function (feature) {
                    feature.result = {scenarios: 0, passed: 0, failed: 0, status: "Passed", isCollapsed: true};

                    feature.elements.forEach(function (scenario) {
                        feature.result.scenarios++;
                        $scope.allScenarios.data.push(scenario);
                        scenario.result = {
                            passed: 0,
                            failed: 0,
                            skipped: 0,
                            status: "Passed",
                            isCollapsed: true,
                            failedStep: {name: ''}
                        };
                        scenario.featureFileName = feature.uri;

                        scenario.steps.forEach(function (step) {
                            if (step.result.status == 'passed') {
                                scenario.result.passed++;
                            } else if (step.result.status == 'failed') {
                                scenario.result.failed++;
                                scenario.result.failedStep = step;
                                //feature.result.failedStep = step;
                            } else if (step.result.status == 'skipped') {
                                scenario.result.skipped++;
                            }
                        });

                        if (scenario.result.failed > 0) {
                            scenario.result.status = "Failed";
                            feature.result.failed++;
                            $scope.allScenarios.result.failed++;
                        } else {
                            feature.result.passed++;
                            $scope.allScenarios.result.passed++;
                        }

                    });

                    if (feature.result.failed > 0) {
                        feature.result.status = "Failed";
                    }
                });

                $rootScope.executionReport = data;
            });
        }

        $scope.$watch('failingStep', function () {
            $rootScope.allScenarios.data.forEach(function (scenario) {
                scenario.result.isCollapsed = $scope.failingStep != 'show';

            });
        }, true);


    });