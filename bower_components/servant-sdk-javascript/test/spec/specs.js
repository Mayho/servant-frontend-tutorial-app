/**
 * saveImageArchetype
 */


function imageSuccessCallback(response) {
    console.log(response);
};

function imageFailedCallback(error) {
    console.log(error);
};

function imageProgressCallback(progress, loaded, total) {
    console.log("Image Upload Progress: ", progress, loaded, total);
};

function imageQueueCallback(queue_number) {
    console.log("Image Queue: ", queue_number);
};

/**
 * Tests
 */


var testData = {};


describe("Test Servant Javascript SDK --- ", function() {

    describe("Initializing Archetypes", function() {
        beforeEach(function(done) {
            Servant.initialize({
                application_client_id: 'O4x9SPs5bcp6h3pO',
                image_file_input_class: 'image-input',
                image_dropzone_class: 'image-dropzone',
                image_preview_id: 'image-preview-container',
                image_success_callback: imageSuccessCallback,
                image_failed_callback: imageFailedCallback,
                image_progress_callback: imageProgressCallback,
                image_queue_callback: imageQueueCallback
            }, function(status) {
                // Remove Connect Notice
                if (status === 'has_token') {
                    setTimeout(function() {
                        document.body.removeChild(document.getElementById('connect-notice'));
                        document.getElementById('imagearchetype-test').style.display = 'block';
                    });
                    done();
                }
            });
        });

        it("Initializate", function() {
            console.log('Initialization', Servant.status);
            expect(Servant.status).toEqual('has_token');
        });
    });


    /**
     * Get User And Servants
     */

    describe("Get User And Servants", function() {

        beforeEach(function(done) {
            Servant.getUserAndServants(function(response) {
                if (!Servant.servants.length) alert("Hi, you must have at least one Servant in your account to run the tests accurately.")
                done();
            }, function(error) {
                testData.error = error;
                done();
            });
        });

        it("Get User And Servants", function() {
            expect(Servant.user).toBeDefined();
            expect(Servant.servants).toBeDefined();
            console.log('Get User And Servants', Servant.user, Servant.servants);
        });

    });

    /**
     * Get Servant
     */

    describe("Show Servant", function() {

        beforeEach(function(done) {
            Servant.showServant(Servant.servants[0]._id, function(response) {
                done();
            }, function(error) {
                testData.error = error;
                done();
            });
        });

        it("Show Servant", function() {
            expect(Servant.servant).toBeDefined();
            console.log('Show Servant', Servant.servant);
        });

    });

    /**
     * Instantiation
     */

    describe("Instantiating Archetypes", function() {

        beforeEach(function(done) {
            Servant.instantiate('product', function(product) {
                testData.product = product;
                Servant.instantiate('tinytext', function(tinytext) {
                    testData.tinytext = tinytext;
                    Servant.instantiate('person', function(person) {
                        testData.person = person;
                        done();
                    });
                });
            });
        });

        it("Instantiate", function() {
            expect(testData.tinytext.body).toBeDefined();
            expect(testData.product.name).toBeDefined();
            expect(testData.person.full_name).toBeDefined();
            console.log('Instantiation', testData.person, testData.product, testData.tinytext);
        });
    });


    /**
     * Validation
     */

    describe("Validating Archetypes", function() {

        beforeEach(function(done) {
            // Missing Required
            testData.product.name = undefined;
            // Maximum
            testData.product.price = 289924328992432899243289924328992432899243324124124214;
            // Wrong Type
            testData.product.seller = ['Sneaky Array!'];
            // Invalid / Not Allowed Property
            testData.product.blah = 'aha!';
            // Invalid Nested Archetype
            testData.product.images = [{
                name: 'an Image!'
            }];
            // Exceed Allowed Length
            testData.product.category = 'lajsfsaufoasufoasjfasjfasoifjsaifsa9f8as9fjas jasf as-f -asfj -saf -asf j-asjf -safj as-f jas-fj -sajf -saf 8-asjf ';
            // Exceed Allowed Items
            testData.product.tags = ['asfasf', 'asfasfasf', 'asasff', 'asfasfas', 'fa89as8f', 'asfa80asf', 'afa8s90fas'];
            // Duplicates in UniqueItems
            testData.product.audience = ['asfasf', 'asfasf'];
            // Enum
            testData.product.condition = 'so damn chill';
            // Validate
            Servant.validate('product', testData.product, function(product) {

            }, function(error) {
                testData.error = error;
                done();
            });
        });

        it("Trigger Validation Errors", function() {
            expect(testData.error.errors.name).toBeDefined();
            expect(testData.error.errors.price).toBeDefined();
            expect(testData.error.errors.seller).toBeDefined();
            expect(testData.error.errors.blah).toBeDefined();
            expect(testData.error.errors.images).toBeDefined();
            expect(testData.error.errors.category).toBeDefined();
            expect(testData.error.errors.tags).toBeDefined();
            expect(testData.error.errors.audience).toBeDefined();
            expect(testData.error.errors.condition).toBeDefined();
            console.log('Trigger Validation Errors', testData.error);
        });

        it("Validate Successfully", function() {
            Servant.instantiate('product', function(product) {
                product.name = 'Product 1';
                product.price = 9999;
                product.seller = 'The Store';
                Servant.validate('product', product, function(product) {
                    expect(product).toBeDefined();
                    console.log('Validate Successfully', product);
                }, function(error) {

                });
            });
        });
    });


    /**
     * Saving
     */

    describe("Saving New Archetypes", function() {

        beforeEach(function(done) {

            delete testData.product;
            testData.error = null;

            Servant.instantiate('product', function(product) {
                testData.product = product;
                testData.product.name = 'Product 1';
                testData.product.price = 9999;
                testData.product.seller = 'The Store';
                Servant.saveArchetype('product', testData.product, function(product) {
                    testData.product = product;
                    done();
                }, function(error) {
                    testData.error = error;
                    done();
                });
            });
        });

        it("Saving New Archetypes", function() {
            expect(testData.product).toBeDefined();
            expect(testData.error).toEqual(null);
            console.log('Creating Archetypes', testData.error, testData.product);
        });

    });


    /**
     * Updating
     */

    describe("Updating Existing Archetypes", function() {

        beforeEach(function(done) {

            testData.error = null;
            testData.product.name = 'Test Product Has Been Updated';

            Servant.saveArchetype('product', testData.product, function(product) {
                testData.product = product;
                done();
            }, function(error) {
                testData.error = error;
                done();
            });
        });

        it("Updating Existing Archetypes", function() {
            expect(testData.product).toBeDefined();
            expect(testData.product.name).toEqual('Test Product Has Been Updated');
            expect(testData.error).toEqual(null);
            console.log('Updating Existing Archetypes', testData.error, testData.product);
        });

    });

    /**
     * Querying
     */

    describe("Querying Archetype Records", function() {

        beforeEach(function(done) {

            testData.error = null;
            var criteria = {
                query: {
                    name: 'Test Product Has Been Updated'
                },
                project: {},
                page: 0
            };

            Servant.queryArchetypes('product', criteria, function(products) {
                testData.products = products;
                done();
            }, function(error) {
                testData.error = error;
                done();
            });
        });

        it("Querying Archetype Records", function() {
            expect(testData.products).toBeDefined();
            expect(testData.products.records[0].name).toEqual('Test Product Has Been Updated');
            expect(testData.error).toEqual(null);
            console.log('Querying Archetype Records', testData.error, testData.products);
        });

    });

    describe("Querying Archetype Records Without Criteria", function() {

        beforeEach(function(done) {

            Servant.queryArchetypes('product', function(products) {
                testData.products = products;
                done();
            }, function(error) {
                testData.error = error;
                done();
            });
        });

        it("Querying Archetype Records", function() {
            expect(testData.products).toBeDefined();
            expect(testData.products.records[0].name).toEqual('Test Product Has Been Updated');
            expect(testData.error).toEqual(null);
            console.log('Querying Archetype Records Without Criteria', testData.error, testData.products);
        });

    });


    /**
     * Showing
     */

    describe("Showing Archetype Records", function() {

        beforeEach(function(done) {

            testData.error = null;

            Servant.showArchetype('product', testData.products.records[0]._id, function(product) {
                testData.product = product;
                done();
            }, function(error) {
                testData.error = error;
                done();
            });
        });

        it("Showing Archetype", function() {
            expect(testData.product).toBeDefined();
            expect(testData.product.name).toBeDefined();
            expect(testData.error).toEqual(null);
            console.log('Showing Archetypes', testData.error, testData.product);
        });

    });


    /**
     * Deleting Archetypes
     */

    describe("Deleting Archetype Records", function() {

        beforeEach(function(done) {

            testData.error = null;

            Servant.deleteArchetype('product', testData.products.records[0]._id, function(product) {
                testData.product = product;
                done();
            }, function(error) {
                testData.error = error;
                done();
            });
        });

        it("Deleting An Archetype Record", function() {
            expect(testData.product).toBeDefined();
            expect(testData.product.name).toEqual(undefined)
            expect(testData.error).toEqual(null);
            console.log('Deleting An Archetype Record', testData.error, testData.product);
        });

    });





    // Old tests below.  Some tests stress the validate method well and should be refactored.



    // it("Validate New Product Instance", function() {
    //     var product2 = servant.new('product');
    //     servant.validate('product', product2, function(errors, product2) {
    //         console.log("Validate New Product Instance:", errors);
    //         expect(product2).toEqual(null);
    //         expect(typeof errors.title).not.toBe('undefined');
    //         expect(typeof errors.seller).not.toBe('undefined');
    //     });
    // });

    // it("Validate Incorrect Instance Type", function() {
    //  servant.validate('product', ['product2', 'yasfysaf'], function(errors, product) {
    //      console.log("Validate Incorrect Instance Type:", errors);
    //      expect(product).toEqual(null);
    //      expect(typeof errors.schema).not.toBe('undefined');
    //  });
    // });

    // it("Validate Missing Requireds", function() {
    //  var product4 = {
    //      category: 'alksfjasfljasf'
    //  };

    //  servant.validate('product', product4, function(errors, product4) {
    //      console.log("Validate Missing Requireds:", errors);
    //      expect(product4).toEqual(null);
    //      expect(typeof errors.title).not.toBe('undefined');
    //      expect(typeof errors.price).not.toBe('undefined');
    //      expect(typeof errors.seller).not.toBe('undefined');
    //  });
    // });

    // it("Validate Invalid Types", function() {
    //  var product3 = {
    //      title: 90817234124,
    //      price: 'asflj',
    //      seller: ['Store1']
    //  };

    //  servant.validate('product', product3, function(errors, product3) {
    //      console.log("Validate Invalid Types:", errors);
    //      expect(product3).toEqual(null);
    //      expect(typeof errors.title).not.toBe('undefined');
    //      expect(typeof errors.price).not.toBe('undefined');
    //      expect(typeof errors.seller).not.toBe('undefined');
    //  });
    // });

    // it("Validate Missing Required, Exceeded Maximum, Exceeded MaxLength", function() {
    //  var product5 = {
    //      price: 98729412049899999999999999999,
    //      seller: 'aslk;fjls;afj;osajfsa kls ljsa;lf jsa;lfj ;lasjf ;lasjf ;lasf ;lahsf;l asl;f jsalf; jaslk; fjas;lf jsal;f jasfl ;jsaf lkasjf ;alsjlasfjasl;fjasl;fjas;foasiufas;lfjasl;fjkasl;fjas;flkajsf ;safu sajf;l ajsf;l jasfs'
    //  };

    //  servant.validate('product', product5, function(errors, product5) {
    //      console.log("Validate Missing Required, Exceeded Maximum, Exceeded MaxLength:", errors);
    //      expect(product5).toEqual(null);
    //      expect(typeof errors.title).not.toBe('undefined');
    //      expect(typeof errors.price).not.toBe('undefined');
    //      expect(typeof errors.seller).not.toBe('undefined');
    //  });
    // });

    // it("Validate Minimum", function() {
    //  var product6 = {
    //      title: 'Product1',
    //      price: -2,
    //      seller: 'Store1'
    //  };

    //  servant.validate('product', product6, function(errors, product6) {
    //      console.log("Validate Minimum:", errors);
    //      expect(product6).toEqual(null);
    //      expect(typeof errors.price).not.toBe('undefined');
    //  });
    // });

    // it("Validate ENUM", function() {
    //  var product7 = servant.new('product');
    //  product7.title = 'asfja;slf';
    //  product7.price = 1234;
    //  product7.seller = 'asflkjasf';
    //  product7.condition = 'really old';
    //  product7.currency = 'Pesos';
    //  product7.payment_interval = 'minute';

    //  servant.validate('product', product7, function(errors, product7) {
    //      console.log("Validate ENUM:", errors);
    //      expect(product7).toEqual(null);
    //      expect(typeof errors.condition).not.toBe('undefined');
    //      expect(typeof errors.currency).not.toBe('undefined');
    //      expect(typeof errors.payment_interval).not.toBe('undefined');
    //  });
    // });

    // it("Validate Arrays Of Non-Unique Strings & Non-Unique Objects", function() {
    //  var product8 = servant.new('product');
    //  product8.title = 'Product1';
    //  product8.price = 1099;
    //  product8.seller = 'Store1';
    //  product8.tags = ['one', 'two', 'one', 'two', 'two', 'one'];
    //  product8.audience = ['one', 'one', 'two', 'two'];
    //  product8.shipping_prices = [{
    //      shipping_price: 1099,
    //      shipping_place: 'canada'
    //  }, {
    //      shipping_price: 1099,
    //      shipping_place: 'canada'
    //  }];
    //  product8.variations = [{
    //      variation_title: 'variation1',
    //      variation_in_stock: true
    //  }, {
    //      variation_title: 'variation1',
    //      variation_in_stock: true
    //  }]

    //  servant.validate('product', product8, function(errors, product8) {
    //      console.log("Validate Arrays Of Non-Unique Strings & Non-Unique Objects:", errors);
    //      expect(product8).toEqual(null);
    //      expect(typeof errors.variations).not.toBe('undefined');
    //      expect(typeof errors.shipping_prices).not.toBe('undefined');
    //      expect(typeof errors.tags).not.toBe('undefined');
    //  });
    // });

    // it("Validate Arrays With Exceeded MaxItems", function() {
    //  var product9 = servant.new('product');
    //  product9.title = 'Product1';
    //  product9.price = 1099;
    //  product9.seller = 'Store1';
    //  product9.tags = ['one', 'two', 'one', 'two', 'two', 'one', 'one', 'two', 'two', 'one'];
    //  product9.audience = ['one', 'one', 'two', 'two', 'one', 'two', 'one', 'two', 'two', 'one', 'one', 'two', 'two', 'one'];

    //  // Add 100 objects to arrays
    //  var i = 100;
    //  while (i--) {
    //      product9.variations.push({
    //          variation_title: 'variation' + i,
    //          variation_in_stock: true
    //      });
    //      product9.shipping_prices.push({
    //          shipping_price: 10 + i,
    //          shipping_place: 'canada'
    //      });
    //  };

    //  servant.validate('product', product9, function(errors, product9) {
    //      console.log("Validate Arrays With Exceeded MaxItems:", errors);
    //      expect(product9).toEqual(null);
    //      expect(typeof errors.variations).not.toBe('undefined');
    //      expect(typeof errors.shipping_prices).not.toBe('undefined');
    //      expect(typeof errors.tags).not.toBe('undefined');
    //      expect(typeof errors.audience).not.toBe('undefined');
    //  });
    // });

    // it("Validate Array Of Strings With Exceeded MaxLengths", function() {
    //  var product10 = servant.new('product');
    //  product10.title = 'Product1';
    //  product10.price = 1099;
    //  product10.seller = 'Store1';
    //  product10.tags = ['one', 'two', 'one', 'twasfsaljf lsajf l;sjf;l jsaf;lajsf; ljasf ;lasjf aslf; kjasf o'];

    //  servant.validate('product', product10, function(errors, product10) {
    //      console.log("Validate Array Of Strings With Exceeded MaxLengths:", errors);
    //      expect(product10).toEqual(null);
    //      expect(typeof errors.tags).not.toBe('undefined');
    //  });
    // });

    // it("Validate Array Of Strings With Invalid Types", function() {
    //  var product11 = servant.new('product');
    //  product11.title = 'Product1';
    //  product11.price = 1099;
    //  product11.seller = 'Store1';
    //  product11.tags = ['one', 'two', 8079087];
    //  product11.audience = ['one', 'two', 8079087];

    //  servant.validate('product', product11, function(errors, product11) {
    //      console.log("Validate Array Of Strings With Invalid Types:", errors);
    //      expect(product11).toEqual(null);
    //      expect(typeof errors.audience_array).not.toBe('undefined');
    //      expect(typeof errors.tags_array).not.toBe('undefined');
    //  });
    // });

    // it("Validate Array Of Objects With Not Allowed Properties", function() {
    //  var product12 = servant.new('product');
    //  product12.title = 'Product1';
    //  product12.price = 1099;
    //  product12.seller = 'Store1';
    //  product12.shipping_prices = [{
    //      shipping_price: 2000,
    //      shipping_country: 'canada',
    //      yada: 'yada'
    //  }];
    //  product12.variations = [{
    //      variation_title: ';alkjf ;lasf j',
    //      variation_in_stock: true,
    //      yada: ' yada'
    //  }];

    //  servant.validate('product', product12, function(errors, product12) {
    //      console.log("Validate Array Of Objects With Not Allowed Properties:", errors);
    //      expect(product12).toEqual(null);
    //      expect(typeof errors.shipping_prices_array['0'].yada).not.toBe('undefined');
    //      expect(typeof errors.variations_array).not.toBe('undefined');
    //  });
    // });

    // it("Validate Array Of Objects With Invalid Types", function() {
    //  var product13 = servant.new('product');
    //  product13.title = 'Product1';
    //  product13.price = 1099;
    //  product13.seller = 'Store1';
    //  product13.shipping_prices = ['asfasf']
    //  product13.variations = [08234098]

    //  servant.validate('product', product13, function(errors, product13) {
    //      console.log("Validate Array Of Objects With Invalid Types:", errors);
    //      expect(product13).toEqual(null);
    //      expect(typeof errors.shipping_prices_array['0']).not.toBe('undefined');
    //      expect(typeof errors.variations_array['0']).not.toBe('undefined');
    //  });
    // });

    // it("Validate Array Of Objects With Missing Properties", function() {
    //  var product14 = servant.new('product');
    //  product14.title = 'Product1';
    //  product14.price = 1099;
    //  product14.seller = 'Store1';
    //  product14.shipping_prices = [{
    //      shipping_price: 2000,
    //      shipping_country: 'canada'
    //  }, {
    //      shipping_price: 2000
    //  }]
    //  product14.variations = ['asfasfd']

    //  servant.validate('product', product14, function(errors, product14) {
    //      console.log("Validate Array Of Objects With Missing Properties:", errors);
    //      expect(product14).toEqual(null);
    //      expect(typeof errors.shipping_prices_array['1'].shipping_country).not.toBe('undefined');
    //  });
    // });

    // it("Validate Array Of Objects With MaxLength Exceeded", function() {
    //  var product16 = servant.new('product');
    //  product16.title = 'Product1';
    //  product16.price = 1099;
    //  product16.seller = 'Store1';
    //  product16.variations = ['hi', ';alkjf ;;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf ;lasf j;alkjf', 'yo'];
    //  product16.shipping_prices = [{
    //      shipping_price: 2000,
    //      shipping_country: 'cda'
    //  }, {
    //      shipping_price: 2000
    //  }]

    //  servant.validate('product', product16, function(errors, product16) {
    //      console.log("Validate Array Of Objects With MaxLength Exceeded:", errors);
    //      expect(product16).toEqual(null);
    //      expect(typeof errors.shipping_prices_array['0'].shipping_country).not.toBe('undefined');
    //      expect(typeof errors.shipping_prices_array['1'].shipping_country).not.toBe('undefined');
    //      expect(typeof errors.variations_array['1']).not.toBe('undefined');
    //  });
    // });

    // it("Validate Array Of Objects With Invalid Types For Properties", function() {
    //  var product17 = servant.new('product');
    //  product17.title = 'Product1';
    //  product17.price = 1099;
    //  product17.seller = 'Store1';
    //  product17.variations = [{
    //      variation_title: 2345,
    //      variation_in_stock: 23498
    //  }]
    //  product17.shipping_prices = [{
    //      shipping_price: '2000',
    //      shipping_country: 'canada'
    //  }]

    //  servant.validate('product', product17, function(errors, product17) {
    //      console.log("Validate Array Of Objects With Invalid Types For Properties:", errors);
    //      expect(product17).toEqual(null);
    //      expect(typeof errors.shipping_prices_array['0'].shipping_price).not.toBe('undefined');
    //      expect(typeof errors.variations_array['0']).not.toBe('undefined');
    //  });
    // });

    // it("Instantiate Task", function() {
    //  var task = servant.new('task');
    //  console.log("Instantiate Task: ", task);
    //  expect(typeof task.task).not.toBe('undefined');
    // });

    // it("Validate Format Datetime", function() {
    //  var task2 = servant.new('task');
    //  task2.task = 'Clean Office';
    //  task2.due_date = '12-12-2012 11:01';

    //  servant.validate('task', task2, function(errors, task2) {
    //      console.log("Validate Format DateTime:", errors);
    //      expect(task2).toEqual(null);
    //  });
    // });

    // it("Validate Correct Date-Time Format", function() {
    //  var task3 = servant.new('task');
    //  task3.task = 'Clean Office';
    //  task3.due_date = '1997-07-16T19:20:30+01:00';

    //  servant.validate('task', task3, function(errors, task3) {
    //      console.log("Validate Correct Date-Time Format:", task3);
    //      expect(errors).toEqual(null);
    //  });
    // });

    // it("Validate Exceeding MinItems Array", function() {
    //  var receipt = servant.new('receipt');
    //  receipt.transaction_date = 'Clean Office';
    //  receipt.price_total = '1997-07-asfasf00';

    //  servant.validate('receipt', receipt, function(errors, receipt) {
    //      console.log("Validate Exceeding MinItems Array:", errors);
    //      expect(receipt).toEqual(null);
    //      expect(typeof errors.products).not.toBe('undefined');
    //  });
    // });

    // it("Validate Format Email", function() {
    //  var receipt = servant.new('receipt');
    //  receipt.shipping_email = 'blah';
    //  receipt.customer_email = 'john@gmail.com';

    //  servant.validate('receipt', receipt, function(errors, receipt) {
    //      console.log("Validate Format Email:", errors);
    //      expect(receipt).toEqual(null);
    //      expect(typeof errors.shipping_email).not.toBe('undefined');
    //      expect(typeof errors.customer_email).toBe('undefined');
    //  });
    // });

    // it("Validate Nested Archetypes", function() {
    //  var product = servant.new('product');
    //  // Add Invalid Nested Archetypes
    //  product.primary_image_archetype = {
    //      title: 'a great image',
    //      large_resolution: 'http://largeimage.com'
    //  };
    //  // Add Invalid & Duplicate Nested Archetypes
    //  product.image_archetypes = [{
    //      title: 'a great image',
    //      large_resolution: 'http://largeimage.com'
    //  }, {
    //      title: 'a great image',
    //      large_resolution: 'http://largeimage.com'
    //  }];

    //  servant.validate('product', product, function(errors, product) {
    //      console.log("Validate Nested Archetypes:", errors);
    //      expect(typeof errors.image_archetypes).not.toBe('undefined');
    //      expect(typeof errors.image_archetypes_array['0']).not.toBe('undefined');
    //      expect(typeof errors.image_archetypes_array['1']).not.toBe('undefined');
    //      expect(typeof errors.primary_image_archetype).not.toBe('undefined');
    //  });
    // });



}); // describe









// End