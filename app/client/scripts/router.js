(function(window) {    
    addressBook.config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/table");
        $stateProvider
            .state("tableForm", {
                url: "/table",
                templateUrl: "/views/tableForm.html",
                controller: "mainCtrl"
            })
                .state("tableForm.addForm", {
                    url: "/add",
                    templateUrl: "/views/addForm.html",
                    controller: "formCtrl"
                })
    });
})(window);