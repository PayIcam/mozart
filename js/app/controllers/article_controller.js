mozartApp.controller('ArticleCtrl',function($scope, $http, mrequest, localStorageService, DataService, PrintFormatter){
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    $scope.server = server_url;
    $scope.formatPrix = function(price) { return PrintFormatter.formatPrix(price/100); }

    // Just in case, clearing the cart
    $scope.cart.clearItems();
    $scope.$on("GET_ARTICLES",function(event,message){
        $scope.store.fun_id = message;
        mrequest.do('POSS3','getCategories', {fun_id : message}).success(function(data){
            for(var i=0; i<data.length; i++) {
                $scope.store.addCategory(data[i]);
            }
            $scope.categoryCount = Object.keys($scope.store.first_cat).length;

            // Get articles
            mrequest.do('POSS3','getArticles', {fun_id : message}).success(function(data){
                if(data == null) {
                    $scope.$emit("ERROR_GET_ARTICLES", "Aucun article à vendre!");
                 }
                 else{
                    // Add all items to the store
                    for (var i = data.length - 1; i >= 0; i--) {
                        console.log(data[i]);
                        $scope.store.addProduct(data[i]['id'], data[i]['name'], data[i]['categorie_id'], data[i]['fundation_id'], data[i]['price'], data[i]['stock'], data[i]['alcool'], data[i]['image'], data[i]['image_path']);
                    };
                 }
            });

            // Select the first category
            for(idc in $scope.store.categories) {
              $scope.store.catClick($scope.store.categories[idc].id);
              break;
            }
        });
    });


    $scope.artClick = function(artId){
        // Get product from store
        product = $scope.store.getProduct(artId)
        // Add product to cart
        $scope.cart.addItem(product['id'], product['name'], product['price'], 1)
    }

    $scope.resetCart = function(){
        $scope.cart.clearItems();
    }

    $scope.cancelLastOperation = function(){
        $scope.cart.cancelLastItem();
    }
});