//----------------------------------------------------------------
// product class
function product(sku, name, description, price) {
    this.sku = sku; // product code (SKU = stock keeping unit)
    this.name = name;
    this.description = description;
    this.price = price;
}

function store() {
    this.products = [
        new product("RC0", "Dinner", "Friday dinner", 10),
        new product("RC1", "Party+Bus", "Party sauna + Party Bus", 15),
        new product("RC2", "Party", "Only Party with sauna", 12),
        new product("RC3", "Party Bus", "Only Party Bus", 5),
        new product("RC4", "Accomodation", "Accomodation at party place.", 5)
    ];
}
store.prototype.getProduct = function (sku) {
    for (var i = 0; i < this.products.length; i++) {
        if (this.products[i].sku == sku)
            return this.products[i];
    }
    return null;
}

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
angular.module('datastore', []).factory('DataService', ['PAYPAL_ACCOUNT', function (PAYPAL_ACCOUNT) {

    // create store
    var myStore = new store();

    // create shopping cart
    var myCart = new shoppingCart("AngularStore");

    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the
    // shopping cart with PayPal, you have to create a merchant account with
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    myCart.addCheckoutParameters("PayPal", PAYPAL_ACCOUNT);

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the
    // shopping cart with Google Wallet, you have to create a merchant account with
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "xxxxxxx",
        {
            ship_method_name_1: "UPS Next Day Air",
            ship_method_price_1: "20.00",
            ship_method_currency_1: "USD",
            ship_method_name_2: "UPS Ground",
            ship_method_price_2: "15.00",
            ship_method_currency_2: "USD"
        }
    );

    // enable Stripe checkout
    // note: the second parameter identifies your publishable key; in order to use the
    // shopping cart with Stripe, you have to create a merchant account with
    // Stripe. You can do that here:
    // https://manage.stripe.com/register
    myCart.addCheckoutParameters("Stripe", "pk_test_xxxx",
        {
            chargeurl: "https://localhost:1234/processStripe.aspx"
        }
    );

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
}])
// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
.controller('storeController',['$scope', '$routeParams', 'DataService', function($scope, $routeParams, DataService) {

    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;

}
]);