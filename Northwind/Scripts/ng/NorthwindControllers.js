'use strict';

(function () {
    /* App Module */
    var ticketApp = angular.module('NorthwindApp', [
      'NorthwindControllers',
      'NorthwindServices',
      'NorthwindFilters',
      'NorthwindDirectives',
      'NorthwindServices'
    ]);



    var NorthwindControllers = angular.module('NorthwindControllers', []);

    NorthwindControllers.controller('NorthwindCtrl', ['$scope', 'Suppliers', 'Products',
        function ($scope, Suppliers, Products) {
            $scope.data = {};
            var supplierHash = {};
            $scope.supplierForm = {};
            $scope.productForm = {};


            $scope.showAddSupplierModal = false;
            $scope.showDeleteSupplierModal = false;

            $scope.deleteSupplier = {};

            // copy default Model data values for resets
            $scope.orig = angular.copy($scope.data);

            $scope.reset = function () {
                // note, this does not modify the view data.
                $scope.data = angular.copy($scope.orig);
            };

            // sets the table order by property to orderField
            $scope.SetOrder = function (orderField) {
                if ($scope.orderProp == orderField) {
                    orderField = "-" + orderField;
                }
                $scope.orderProp = orderField;
            }

            $scope.ShowSupplierProducts = function (supplier) {
                return supplier.Products && supplier.ProductsToggleOn && !supplier.IsDeleted;
            }

            $scope.TriggerAddSupplierModal = function () {
                $scope.messageText = "";
                $scope.supplierForm = {};
                $scope.showAddSupplierModal = true;
            }

            $scope.TriggerAddProductModal = function (supplier) {
                $scope.messageText = "";
                $scope.productForm = {};
                $scope.productForm.Supplier = supplier;
                $scope.addProductTitle = "Add new product for " + supplier.CompanyName;
                $scope.showAddProductModal = true;
            }

            $scope.DeleteSupplierPrompt = function (supplier) {
                $scope.deleteSupplier = supplier;
                $scope.deleteSupplierTitle = 'Are you sure you want to delete ' + supplier.CompanyName + '?';
                $scope.messageText = "";
                $scope.showDeleteSupplierModal = true;
            }


            var GetAllSuppliers = function () {
                Suppliers.query(function (pSuppliers) {
                    $scope.data.suppliers = pSuppliers;

                    // create a hash table for quick lookup of suppliers (important if I create a "load all products" option and link each product to it's supplier) 
                    $scope.data.suppliers.forEach(function (d) {
                        supplierHash[d.SupplierID] = d;
                    });
                });


            }
            GetAllSuppliers();

            // gets the supplier products
            $scope.DeleteSupplier = function (pSupplier) {
                Suppliers.DeleteSupplier({ id: pSupplier.SupplierID }, function (resp) {
                    var test = "hi";

                    $scope.messageText = "Successfully deleted " + pSupplier.CompanyName + ".";
                    $scope.messageClass = "alert alert-success";

                    pSupplier.IsDeleted = true;
                })
                .$promise.catch(function (err) {
                    $scope.messageText = "Could not delete supplier! " + err.data.ExceptionMessage;
                    $scope.messageClass = "alert alert-danger";
                });

                // close the pop-up
                $scope.showDeleteSupplierModal = false;
                $scope.deleteSupplier = {};

            }

            $scope.AddSupplier = function () {
                var newSupplier = new Suppliers();
                newSupplier.CompanyName = $scope.supplierForm.CompanyName;


                newSupplier.$save(function(d) {
                    $scope.messageText = "Successfully added " + newSupplier.CompanyName + ".";
                    $scope.messageClass = "alert alert-success";

                    // add the new supplier to the list
                    $scope.data.suppliers.push(d);

                    $scope.showAddSupplierModal = false;
                })
                .catch(function (err) {
                    // show error message
                    $scope.messageText = "Could not add supplier! " + err.data.ExceptionMessage;
                    $scope.messageClass = "alert alert-danger";
                });
            }

            $scope.CloseDeleteModal = function () {
                $scope.showDeleteSupplierModal = false;
                $scope.deleteSupplier = {};
            }


            // gets the supplier products
            $scope.GetSupplierProducts = function (pSupplier) {
                if (!pSupplier.Products) {
                    Suppliers.GetSupplierProducts({ id: pSupplier.SupplierID }, function (pProducts) {
                        pSupplier.Products = pProducts;
                        pSupplier.ProductsToggleOn = true;
                    });
                }
                else {
                    pSupplier.ProductsToggleOn = !pSupplier.ProductsToggleOn;
                }
            }

        }
     ]);   
})();