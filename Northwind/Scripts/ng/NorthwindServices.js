

(function () {
    angular.module('NorthwindServices', ['ngResource'])
       .factory('Suppliers', ['$resource',
              function ($resource) {
                  return $resource('/api/supplier/:id', {}, {
                      GetSupplierProducts: { method: 'GET', params: {}, url: '/api/supplier/:id/products', isArray: true },
                      Update: { method: 'PUT' },
                      DeleteSupplier: { method: 'DELETE', params: { id: 'id' } },
                      MonthlySales: { method: 'GET', params: {}, url: '/api/supplier/sales', isArray: true }
                  });
              }])
        .factory('Products', ['$resource',
              function ($resource) {
                  return $resource('/api/product/:id', {}, {
                      //  query: { method: 'GET', params: {}, isArray: true }
                  });
              }]);

    angular.module('d3', [])
      .factory('d3Service', ['$document', '$q', '$rootScope',
        function ($document, $q, $rootScope) {
            var d = $q.defer();
            function onScriptLoad() {
                // Load client in the browser
                $rootScope.$apply(function () { d.resolve(window.d3); });
            }
            // Create a script tag with d3 as the source
            // and call our onScriptLoad callback when it
            // has been loaded
            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = '/Scripts/d3.js';
            scriptTag.onreadystatechange = function () {
                if (this.readyState == 'complete') onScriptLoad();
            }
            scriptTag.onload = onScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);

            return {
                d3: function () { return d.promise; }
            };
        }]);

})();