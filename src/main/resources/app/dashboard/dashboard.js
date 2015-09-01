'use strict';

angular.module('myApp.dashboard', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCrtl',
            resolve: {
                load: function (ExecutionReport) {
                    return ExecutionReport.load();
                }
            }

        }).when('/scenarios', {
            templateUrl: 'dashboard/featureList.html',
            controller: 'ScenarioListCrtl',
            resolve: {
                load: function (ExecutionReport) {
                    return ExecutionReport.load();
                }
            }
        });
    }])
    .service('ExecutionReport', function ($http, $q) {
        var allScenarios = {result: {passed: 0, failed: 0}, data: []};
        var executionReport = null;
        var getReport = function () {
            var defer = $q.defer();
            $http.get('executionReport.json').success(function (data) {
                if (executionReport != null) {
                    return defer.resolve();
                }
                data.forEach(function (feature) {
                    feature.result = {scenarios: 0, passed: 0, failed: 0, status: "Passed", isCollapsed: true};
                    feature.elements.forEach(function (scenario) {
                        feature.result.scenarios++;
                        allScenarios.data.push(scenario);
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
                            } else if (step.result.status == 'skipped') {
                                scenario.result.skipped++;
                            }
                        });

                        if (scenario.result.failed > 0) {
                            scenario.result.status = "Failed";
                            feature.result.failed++;
                            allScenarios.result.failed++;
                        } else {
                            feature.result.passed++;
                            allScenarios.result.passed++;
                        }

                    });

                    if (feature.result.failed > 0) {
                        feature.result.status = "Failed";
                    }
                });

                executionReport = data;
                defer.resolve();
            });

            return defer.promise;
        };

        return {
            getExecutionReport: function () {
                return executionReport
            },
            getAllScenarios: function () {
                return allScenarios;
            },
            load: getReport
        };
    })
    .controller('DashboardCrtl', function ($scope, ExecutionReport) {
        $scope.executionReport = ExecutionReport.getExecutionReport();
    })
    .controller('ScenarioListCrtl', function ($scope, ExecutionReport) {
        $scope.allScenarios = ExecutionReport.getAllScenarios();
        $scope.failingStep = 'hide';
        $scope.$watch('failingStep', function () {
            $scope.allScenarios.data.forEach(function (scenario) {
                scenario.result.isCollapsed = $scope.failingStep != 'show';

            });
        }, true);

    });