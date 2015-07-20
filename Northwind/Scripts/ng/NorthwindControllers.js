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
            $scope.salesData = undefined;

            $scope.showAddSupplierModal = false;
            $scope.showDeleteSupplierModal = false;

            $scope.sortOptions = ["By Name", "By Purchases"];

            $scope.deleteSupplier = {};

            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
                $scope.addUpdateText = "Add Supplier";

                // set function to add supplier
                $scope.AddUpdateSupplierFunc = $scope.AddSupplier;
            }


            $scope.TriggerUpdateSupplierModal = function (supplier) {
                $scope.messageText = "";
                $scope.supplierForm = {};
                $scope.showAddSupplierModal = true;
                $scope.supplierForm.Supplier = supplier;
                $scope.supplierForm.CompanyName = supplier.CompanyName;
                $scope.addUpdateText = "Update Supplier";
                // set function to update supplier
                $scope.AddUpdateSupplierFunc = $scope.UpdateSupplier;
            }


            $scope.TriggerAddProductModal = function (supplier) {
                $scope.messageText = "";
                $scope.productForm = {};
                $scope.productForm.Supplier = supplier;
                $scope.addProductTitle = "Add new product for " + supplier.CompanyName;
                $scope.showAddProductModal = true;
            }

            $scope.AddProduct = function () {
                var newProduct = new Products();

                newProduct.ProductName = $scope.productForm.ProductName;
                newProduct.SupplierID = $scope.productForm.Supplier.SupplierID;
                newProduct.Discontinued = false;

                newProduct.$save(function (d) {
                    $scope.messageText = "Successfully added " + newProduct.ProductName + ".";
                    $scope.messageClass = "alert alert-success";

                    // add the new supplier to the list
                    if (supplierHash[newProduct.SupplierID] && supplierHash[newProduct.SupplierID].Products) {
                        supplierHash[newProduct.SupplierID].Products.push(d);
                    }
                    else if (supplierHash[newProduct.SupplierID]) {
                        $scope.GetSupplierProducts(supplierHash[newProduct.SupplierID]);

                    }
                    $scope.showAddProductModal = false;
                    supplierHash[newProduct.SupplierID].ProductsToggleOn = true;
                })
                .catch(function (err) {
                    // show error message
                    $scope.messageText = "Could not add product! " + err.data.ExceptionMessage;
                    $scope.messageClass = "alert alert-danger";
                });
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

            $scope.UpdateSupplier = function () {
                var oldName = $scope.supplierForm.Supplier.CompanyName;
                $scope.supplierForm.Supplier.CompanyName = $scope.supplierForm.CompanyName;

                Suppliers.Update({ id: $scope.supplierForm.Supplier.SupplierID }, $scope.supplierForm.Supplier, function (d) {
                    $scope.messageText = "Successfully updated " + oldName + " to " + d.CompanyName + ".";
                    $scope.messageClass = "alert alert-success";

                    $scope.showAddSupplierModal = false;
                })
                .catch(function (err) {
                    // show error message
                    $scope.messageText = "Could not update supplier! " + err.data.ExceptionMessage;
                    $scope.messageClass = "alert alert-danger";
                });
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
                    })
                    .$promise.catch(function (err) {
                        // show error message
                        $scope.messageText = "Could not get supplier products! " + err.data.ExceptionMessage;
                        $scope.messageClass = "alert alert-danger";
                    });
                }
                else {
                    pSupplier.ProductsToggleOn = !pSupplier.ProductsToggleOn;
                }
            }

            $scope.GetMonthlySales = function () {
                Suppliers.MonthlySales(function (sales) {
                    $scope.salesData = sales;
                    $scope.chartData = $scope.salesData.filter(function (d) {
                        return d.OrderMonth == 5 && d.OrderYear == 1997;
                    });

                    $scope.salesMonths = getDistinctMonths($scope.salesData);

                    $scope.changeMonth("1997-5");

                }).$promise.catch(function (err) {
                    // show error message
                    $scope.messageText = "Could not get suppliers monthly sales! " + err.data.ExceptionMessage;
                    $scope.messageClass = "alert alert-danger";
                });
            }
            $scope.GetMonthlySales();

            $scope.changeMonth = function (mth) {
                var mthAry = mth.split("-");
                if (mthAry.length != 2) {
                    return; // error, did not get month, year
                }

                $scope.selectedSalesMth = mth;

                var sYear = +mthAry[0];
                var sMonth = +mthAry[1];


                $scope.barChartTitle = $scope.FullMonthYear(mth) + " Purchases by Supplier"

                $scope.chartData = $scope.salesData.filter(function (d) {
                    return d.OrderMonth == sMonth && d.OrderYear == sYear;
                });
            }

            $scope.changeSort = function (sortOpt) {
                if(sortOpt == "By Name") {
                    $scope.barChartSortField = "CompanyName";
                }
                else if (sortOpt == "By Purchases") {
                    $scope.barChartSortField = "MTDOrderDollars";
                }
                $scope.selectedSortOpt = sortOpt;
            }

            $scope.chartYFunc = function (d) {
                return d.MTDOrderDollars;
            }

            $scope.chartXFunc = function (d) {
                return d.CompanyName;
            }

            $scope.barChartMouseOver = function (d) {
                supplierHash[d.SupplierID].rowStyle = {'background-color': 'lightgrey'};
                $scope.$apply();
            }

            $scope.barChartMouseOut = function (d) {
                supplierHash[d.SupplierID].rowStyle = "";
            }

            $scope.yAxisText = function () {
                return "Purchases";
            }

            $scope.FullMonthYear = function(yyyyMM)  {
                if(!yyyyMM) return;
                var mthAry = yyyyMM.split("-");
                if (mthAry.length != 2) {
                    return; // error, did not get month, year
                }

                return getMonthName(mthAry[1]) + " " + mthAry[0];
            }

            function getMonthName(monthNum) {
                if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) return null;

                return monthNames[monthNum - 1];
            }

            // generates the data for the month pulldown
            function getDistinctMonths(allData) {
                var distinctMonths = {};
                allData.forEach(function(d) {
                    if(d.OrderYear > 0 && d.OrderMonth > 0)
                        distinctMonths[d.OrderYear + "-" + d.OrderMonth] = { OrderYear: d.OrderYear, OrderMonth: d.OrderMonth };
                })
  

                return Object.keys(distinctMonths).sort(function (x, y) {
                    var isGreater;
                    if (distinctMonths[x].OrderYear == distinctMonths[y].OrderYear) isGreater = distinctMonths[x].OrderMonth > distinctMonths[y].OrderMonth;
                    else isGreater = distinctMonths[x].OrderYear > distinctMonths[y].OrderYear;

                    return isGreater ? 1 : -1;
                });;
            }

        }
     ]);   
})();