angular.module('Voyo.controllers').controller('StoryNewDetailsController', function ($scope, $state, LocationService, story) {
  $scope.story = story;

  LocationService.getNearestPlace().then((place) => {
    $scope.story.location = place;
  })


  $scope.complete = function () {
    return story.save().then(() => {
      $state.go('app.tabs.dash');
    });
  }
});
