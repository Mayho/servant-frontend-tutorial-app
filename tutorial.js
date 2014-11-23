// App Data
var app_data = {};

// Wait until DOM is loaded
document.onreadystatechange = function() {
    var state = document.readyState;
    if (state === 'complete') {

        Servant.initialize({
            image_dropzone_class: 'dropzone',
            image_success_callback: imageSuccessCallback,
            application_client_id: 'ZBuaEogNH3PXcoyr'
        }, function(status) {

            if (status !== 'has_token') return;

            // Change View
            document.getElementById('connect-view').style.display = 'none';
            document.getElementById('content-view').style.display = 'block';

            // Start Content Area
            return contentView();

        });
    }
}

function contentView() {

    // Get User And Servants
    Servant.getUserAndServants(function(response) {
        // Show User and Servants Information
        document.getElementById('welcome-user').innerHTML = 'Hello ' + response.user.nick_name;
        document.getElementById('servants-info').innerHTML = 'You have ' + response.servants.length + ' Servants';

        // Create Options for each Servant in the select menu
        for (i = 0; i < response.servants.length; i++) {
            var option = document.createElement("option");
            option.value = i;
            option.innerHTML = response.servants[i].master;
            // Append it to the select element
            document.getElementById('servant-select').appendChild(option);
        }

        // Add Listener To Select Menu Change
        document.getElementById('servant-select').addEventListener("change", changeServant);

        // Set Servant
        Servant.setServant(Servant.servants[0]);

        // Get Products
        getProducts();

        // Instantiate New Product
        Servant.instantiate('product', function(product) {
            app_data.product = product;
        });

    }, function(error) {
        console.log("Error: ", error.message);
    });

};

function changeServant(event) {

    // Set Servant
    Servant.setServant(Servant.servants[event.target.value]);

    // Get Products
    getProducts();

};

function getProducts() {
    Servant.queryArchetypes('product', function(response) {
        console.log(response);
        // Add Product Info To HTML
        document.getElementById('product-info').innerHTML = "This Servant is holding " + response.meta.count + " products";

        // Add Most Recent Product To HTML
        if (response.records.length) {
            document.getElementById('product-recent-name').innerHTML = response.records[0].name;
            document.getElementById('product-recent-price').innerHTML = '$' + response.records[0].price;
            document.getElementById('product-recent-seller').innerHTML = response.records[0].seller;
            document.getElementById('product-recent-image').src = response.records[0].images[0].resolution_medium;
        }

    }, function(error) {

    });
};

function createProduct() {

    // Set Form Values to Default Product Instance
    app_data.product.name = document.getElementById('product-name').value;
    app_data.product.price = parseInt(document.getElementById('product-price').value);
    app_data.product.seller = document.getElementById('product-seller').value;

    // Validate Product
    Servant.validate('product', app_data.product, function(product) {

        // Save Archetype
        Servant.saveArchetype('product', product, function(response) {
            // Add Preview To HTML
            document.getElementById('product-recent-name').innerHTML = response.name;
            document.getElementById('product-recent-price').innerHTML = '$' + response.price;
            document.getElementById('product-recent-seller').innerHTML = response.seller;
            document.getElementById('product-recent-image').src = response.images[0].resolution_medium;
            // Instantiate New Product
            Servant.instantiate('product', function(product) {
                app_data.product = product;
            });

        }, function(error) {
            alert(error.message);
        });
    }, function(error) {
        alert(error.errors);
    });
    return false;
};

function imageSuccessCallback(response) {
    document.getElementById('product-form-image').src = response.resolution_medium;
    app_data.product.images.push(response);
    console.log(app_data);
};



// End