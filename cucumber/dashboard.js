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

    .controller('FeatureListCrtl', function ($scope, $http) {
        $scope.allScenarios = [];
        $http.get('executionSummary_passed.json').success(function (data) {
            // $http.get('executionReport.json').success(function (data) {
            data.forEach(function (feature) {
                feature.result = {passed: 0, failed: 0, skipped: 0, status: "Passed", isCollapsed: false};
                feature.elements.forEach(function (scenario) {
                    $scope.allScenarios.push(scenario);
                    scenario.result = {passed: 0, failed: 0, skipped: 0, status: "Passed", isCollapsed: false};
                    scenario.featureFileName = feature.uri;

                    scenario.steps.forEach(function (step) {
                        if (step.result.status == 'passed') {
                            scenario.result.passed++;
                            feature.result.passed++;
                        } else if (step.result.status == 'failed') {
                            scenario.result.failed++;
                            feature.result.failed++;
                            scenario.result.failedStep = step;
                            feature.result.failedStep = step;
                        } else if (step.result.status == 'skipped') {
                            scenario.result.skipped++;
                            feature.result.skipped++;
                        }
                    });
                    if (scenario.result.failed > 0) {
                        scenario.result.status = "Failed";
                    }

                });

                if (feature.result.failed > 0) {
                    feature.result.status = "Failed";
                }
            });

            $scope.executionReport = data;
        });


    });


