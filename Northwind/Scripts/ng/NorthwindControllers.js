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
                return supplier.Products && supplier.ProductsToggleOn;
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