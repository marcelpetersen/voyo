angular.module('Voyo').directive('loginForm', function($ionicContentBanner, Auth) {
  return {
    scope: true,
    templateUrl: 'components/login-form/template.html',
    controller: ['$scope', function($scope) {
      let loginComplete = function () {
        $scope.$emit('Login:Success');
      }

      $scope.signIn = function () {
        Auth.login($scope.user)
          .then(loginComplete)
          .catch($scope.errMessage)
      };

      $scope.socialLogin = function (provider) {
        Auth.socialLogin(provider).then(loginComplete);
      };

      $scope.createUser = function () {
        Auth.register($scope.user)
          .then(loginComplete)
          .catch($scope.errMessage);
      };

      $scope.errMessage = function (err) {
        if (err && err.code) {
          let message;
          switch (err.code) {
            case 'EMAIL_TAKEN':
              message = 'This Email has been taken.';
              break;
            case 'INVALID_EMAIL':
              message = 'Invalid Email.';
              break;
            case 'NETWORK_ERROR':
              message = 'Network Error.';
              break;
            case 'INVALID_PASSWORD':
              message = 'Invalid Password.';
              break;
            case 'INVALID_USER':
              message = 'Invalid User.';
              break;
            default:
              message = 'Unknown Error...'
          }
          $ionicContentBanner.show({
            text: [message],
            type: 'error',
            autoClose: 5000
          });
        }
      }
    }],
    link: function(scope, element, attrs, controllers) {
      scope.user = {
        email: '',
        password: ''
      };
    }
  }
});
