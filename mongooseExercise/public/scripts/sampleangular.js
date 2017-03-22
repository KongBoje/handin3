var myApp = angular.module("DemoApp", []);

myApp.controller("sampleController", ["$scope", "$http", function ($scope, $http) {
    var self = this;
    self.allJokes = [];

    self.update = function () {
        $http({
            method: "GET",
            url: "/api/jokes"
        }).then(function successCallback(response) {
            self.allJokes = response.data;
            self.allJokes.forEach((entry)=>{
                delete entry.__v;
            })
        })
    }

    self.delete = function (id) {
        $http({
            method: "DELETE",
            url: `/api/jokes/${id}`
        }).then(function successCallback(response) {
            self.update();
        })
    }

    self.editClick = function (obj) {
        tmp = JSON.stringify(obj);
        document.getElementById("objText").value = tmp;
    }

    self.doPut = function () {
        tmp = JSON.parse(document.getElementById("objText").value);

        //alert(`Object with ID ${tmp._id}`);

        $http({
            method: "PUT",
            url: `/api/jokes/${tmp._id}`,
            data: JSON.stringify(tmp)
        }).then(function successCallback(response) {
            self.update();
        })
    }

    self.postJoke = function() {
        var tmp = new Object();
        
        tmp.joke = document.getElementById("jokeText").value;
        tmp.category = document.getElementById("jokeCategories").value.split(",");
        tmp.reference = {
            "author":document.getElementById("jokeAuthor").value,
            "link":document.getElementById("jokeLink").value
        };

        $http({
            method: "POST",
            url: "/api/jokes",
            data: tmp
        }).then(function successCallback(response) {
            self.update();
        })
    }

    self.update();
}])