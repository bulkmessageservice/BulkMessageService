firstApp.directive("validSubmit", ["$parse", function($parse) {
    return {
        require: 'form',
        link: function(scope, element, iAttrs, form) {
            form.$submitted = false;
            var fn = $parse(iAttrs.validSubmit);
            element.on("submit", function(event) {
                scope.$apply(function() {
                    form.$submitted = true;
                    if (form.$valid) {
                        fn(scope, { $event: event });
                        form.$submitted = false;
                    }
                });
            });
        }
    };
}]);