/**
 * Created by zhy on 14-10-20.
 */
var app = angular.module('github', ['ngRoute', 'github.directives', 'github.services']);

app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/', {
            controller: 'ListController',
            resolve: {
                recipes: ['MultiRecipeLoader', function (MultiRecipeLoader) {
                    return MultiRecipeLoader();
                }]
            },
            templateUrl: '/views/list.html'
        })
        .when('/edit/:recipeId', {
            controller: 'EditController',
            resolve: {
                recipe: ['RecipeLoader', function (RecipeLoader) {
                    return RecipeLoader();
                }]
            },
            templateUrl: '/views/recipeForm.html'
        })
        .when('/view/:recipeId', {
            controller: 'ViewController',
            resolve: {
                recipe: ['RecipeLoader', function (RecipeLoader) {
                    return RecipeLoader();
                }]
            },
            templateUrl: '/views/viewRecipe.html'
        })
        .when('/new', {
            controller: 'NewController',
            templateUrl:'/views/recipeForm.html'
        })
        .otherwise({redirectTo:'/'});
}]);

app.controller('ListController', ['$scope', 'recipes', function($scope, recipes){
    $scope.recipes = recipes;
}]);

app.controller('ViewController', ['$scope', '$location', 'recipe', function ($scope, $location, recipe) {
    $scope.recipe = recipe;

    $scope.edit = function(){
        $location.path('/edit/' + recipe.id);
    };
}]);

app.controller('EditController', ['$scope', '$location', 'recipe', function ($scope, $location, recipe) {
    $scope.recipe = recipe;

    $scope.save = function(){
        $scope.recipe.$save(function (recipe) {
            $location.path('/view/' + recipe.id);
        });
    };

    $scope.remove = function(){
        delete $scope.recipe;
        $location.path('/');
    };
}]);

app.controller('NewController', ['$scope', '$location', 'Recipe', function ($scope, $location, Recipe) {
    console.log("/new");

    $scope.recipe = new Recipe({
        ingredients: [{}]
    });

    $scope.save = function () {
        $scope.recipe.$save(function (recipe) {
            $location.path('/view/' + recipe.id);
        });
    }
}]);

app.controller('IngredientsController', ['$scope', function($scope){
    $scope.addIngredient = function(){
        var ingredients = $scope.recipe.ingredients;
        ingredients[ingredients.length] = {};
    };

    $scope.removeIngredient = function(index){
        $scope.recipe.ingredients.splice(index,1);
    };
}]);