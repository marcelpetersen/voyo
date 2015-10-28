angular.module('Voyo').factory("Story", ["$firebaseObject", 'FIREBASE_URL', 'BaseModel', 'Timestampable',
  function($firebaseObject, FIREBASE_URL, BaseModel, Timestampable) {
    // create a new service based on $firebaseObject
    let defaultProperties = function () {
      return {
        title: '',
        caption: '',
        media: '',
        createdAt: new Date().getTime()
      }
    };
    let Story = BaseModel('stories', defaultProperties(), Timestampable);
    Story.create = function(properties) {
      var arr = new Firebase(`${FIREBASE_URL}stories/`),
        ref = arr.push(angular.extend(defaultProperties(), properties));

      return new Story(ref.key()).$loaded().then( (story) => {
        return story;
      })
    }
    Story.new = function(properties) {
      return new Promise( (resolve, reject) => {
        resolve(angular.extend(defaultProperties(), properties));

      })
    }
    Story.get = function() {
      return new Promise((resolve, reject) => {
        var ref = new Firebase(`${FIREBASE_URL}stories/`);
        ref.orderByChild("createdAt").once("value", function(snapshot) {
          let stories;
          if (snapshot.numChildren() > 0) {
            stories = Object.keys(snapshot.val()).map(function(key) {
              return new Story(key);
            })
          } else {
            stories = [];
          }
          resolve(stories);
        });
      });
    }

    return Story;
  }
]);
