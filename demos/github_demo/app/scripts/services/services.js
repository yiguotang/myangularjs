/**
 * Created by zhy on 14-10-20.
 */

var services = angular.module('github.services', ['ngResource']);

services.factory('Recipe', ['$resource', function($resource){
    return $resource('/recipes/:id', {id: '@id'});
}]);

services.factory('MultiRecipeLoader', ['Recipe', '$q', function (Recipe, $q) {
    return function(){
        var delay = $q.defer();

        Recipe.query(function(recipes){
            delay.resolve(recipes);
        }, function () {
            delay.resolve('Unable to fetch recipes');
        });

        return delay.promise;
    }
}]);

services.factory('RecipeLoader', ['Recipe', '$route', '$q', function (Recipe, $route, $q) {
    return function () {
        var delay = $q.defer();

        Recipe.get({id: $route.current.params.recipeId}, function(recipe){
           delay.resolve(recipe);
        }, function(){
            delay.resolve('Unable to fetch recipes' + $route.current.params.recipeId);
        });

        return delay.promise;
    }
}]);