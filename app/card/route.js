angular.module('Voyo')
  .config( function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app.voyo.card', {
      url: '/card/:cardId',
      views: {
        'app-voyo-container': {
          templateUrl: 'card/template.html',
          controller: 'CardController',
        }
      },
      resolve: {
        voyo: ['$stateParams', 'voyo', function ($stateParams, voyo) {
          return voyo;
        }],
        card: [ '$stateParams', 'Card', function ($stateParams, Card) {
          return Card.find($stateParams.cardId);
        }]
      }

    });
  });
