/**
 * 
 */

angular.module('pwc', [ 'ui.router' ]).config(
		function($stateProvider, $urlRouterProvider) {
			$stateProvider.state('welcome', {
				url : '/welcome',
				templateUrl : 'app/views/landingpage.html',
				controller : 'LandingPageController'
			}).state('otherwise', {
				url : '/',
				templateUrl : 'app/views/landingpage.html'
			});
			$urlRouterProvider.otherwise('/welcome');
		}).run(function($state, $rootScope) {
	console.log('Inside the RUN method Start First')
}).controller('LandingPageController', function($state) {
	console.log('Landing controller');
});