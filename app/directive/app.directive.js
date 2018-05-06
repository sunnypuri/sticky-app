

app.directive('contenteditable', function () {
      return {
          restrict: 'A', // only activate on element attribute
          require: '?ngModel', // get a hold of NgModelController
          link: function (scope, element, attrs, ngModel) {
              if (!ngModel) return; // do nothing if no ng-model

              // Specify how UI should be updated
              ngModel.$render = function () {
                  element.html(ngModel.$viewValue || '');
              };

              // Listen for change events to enable binding
              element.on('blur keyup change', function () {
                  scope.$apply(readViewText);
              });

              // No need to initialize, AngularJS will initialize the text based on ng-model attribute

              // Write data to the model
              function readViewText() {
                  var html = element.html();
                  // When we clear the content editable the browser leaves a <br> behind
                  // If strip-br attribute is provided then we strip this out
                  if (attrs.stripBr && html == '<br>') {
                      html = '';
                  }
                  ngModel.$setViewValue(html);
              }
          }
      };
  });


app.directive("outsideClick", ['$document', '$parse', function($document, $parse) {
  return {
    link: function($scope, $element, $attributes) {
     
      var scopeExpression = $attributes.outsideClick,
        onDocumentClick = function(event) {
          
          // check for flag
          if(!$scope.closeFlag) {
            $scope.closeFlag = true;
            return;
          }
          
          
          var parent = event.target;

          while (parent && parent !== $element[0]) {
            parent = parent.parentNode;
          }

          if (!parent) {
            $scope.$apply(scopeExpression);
          }
        }

      $document.on("click", onDocumentClick);

      $element.on('$destroy', function() {
        $document.off("click", onDocumentClick);
      });
    }
  }
}]);