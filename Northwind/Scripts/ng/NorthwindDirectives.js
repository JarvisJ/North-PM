(function () {
    var modalID = 0; // id to prevent conflicts among modal objects
    var NorthwindDirectives = angular.module('NorthwindDirectives', ['ngResource', 'd3']);

    // 
    NorthwindDirectives.directive('jjModal', function () {
        return {
            restrict: 'EA',
            scope: {
                showModal: '=',
                jjModalTitle: '=jjTitle'
            }, 
            transclude: true,
            templateUrl: '/Content/ng-partials/Modal.html',
            replace: true,
            link: function (scope, element, attrs) {
                var modalClassID = "jj-modal-id-" + modalID++;
                var baseRootClass = "modal fade " + modalClassID;
                scope.modalRootClass = baseRootClass;


                scope.hideModal = function () {
                    scope.showModal = false;
                };


                // Watch for show modal triggered
                scope.$watch(function () {
                    return scope.showModal;
                }, function () {
                    if (scope.showModal) {
                        //modalRootClass = baseRootClass;
                        $('.' + modalClassID).modal({
                            backdrop: true
                        });
                    }
                    else {
                        $('.' + modalClassID).modal('hide');
                    }
                });
            }
        };
    });

    // directive for a d3 bar chart
    NorthwindDirectives.directive('jjBarChart', ['d3Service', '$window', '$filter',function (d3Service, $window,$filter) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                jjData: "=",
                jjBarClick: '&',  // callback bar click func 
                jjBarMouseover: '&', // callback bar mouseover func
                jjBarMouseout: '&', // callback bar mouseout func
                jjHeight: "=",    // height of the svg element
                jjWidth: "=",     // width of the svg element
                jjMargin: "=",    // margin between the edge of the viz and the edge of the svg element
                jjLineField: "&", // field for ploting lines through bar (say if you want to show last year's sales vs this year by using the line through the bar for ly)
                jjYFunc: "&",     // func for the Y values
                jjXFunc: "&",     // func for the X values
                jjYAxisText: "&", // text along the Y axis
                jjTitle: "=",      // title at the top of the viz
                jjSortBy: "="      // sort by field
            },
            link: function (scope, ele, attrs) {
                d3Service.d3().then(function (d3) {
                    var topMargin = parseInt(attrs.jjMargin) || 20,
                        bottomMargin = parseInt(attrs.jjMargin) || 300,
                        margin = parseInt(attrs.jjMargin) || 60,
                        height = parseInt(attrs.jjHeight) - (margin*2) || 500,
                        width = parseInt(attrs.jjWidth)- (margin*2)  || 500,
                        lineField = attrs.jjLineField || undefined,
                        yFunc = scope.jjYFunc() || undefined,
                        xFunc = scope.jjXFunc() || undefined,
                        yAxisText = scope.jjYAxisText() || undefined,
                        barMouseover = scope.jjBarMouseover() || undefined,
                        barMouseout = scope.jjBarMouseout() || undefined;

                    var svg = d3.select(ele[0]).append("svg")
                        .attr("width", width + (margin * 2))
                        .attr("height", height + topMargin + bottomMargin)
                      .append("g")
                        .attr("transform", "translate(" + margin + "," + topMargin + ")");

                    // watch for data changes and re-render
                    scope.$watch('jjData', function (newVals, oldVals) {
                        if (!scope.blockRender) return scope.render(newVals);
                        else scope.blockRender = false;
                    }, true);

                    scope.$watch('jjSortBy', function (newVal, oldVal) {
                        if (newVal && newVal != oldVal) {
                            scope.changeSort(newVal);
                        }
                    }, true);

                    scope.render = function (data) {
                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return
                        if (!data  ) return;

                        // setup variables
                        var x = d3.scale.ordinal()
                                    .rangeRoundBands([0, width], .2)
                                    .domain(data.map(function (d) { return xFunc(d); }));

                        var y = d3.scale.linear().range([height, 0]);

                        y.domain([0, d3.max(data.map(function (d) { return yFunc(d); }))]);

                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient("right")
                            .ticks(5)
                            .tickFormat($filter('currencynodigits'));

                        // y axis
                        svg.append("g")
                            .attr("class", "axis")
                            .attr("transform", "translate(" + width + " ,0)")
                            .call(yAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", "-.6em")
                            .style("text-anchor", "end")
                            .text(yAxisText);

                        svg.selectAll(".hist-bar")
                            .data(data)
                            .enter().append("rect")
                            .attr("x", function (d) { return x(xFunc(d)); })
                            .attr("width", x.rangeBand())
                            .attr("y", function (d) { return y(yFunc(d)); })
                            .attr("class", "hist-bar")
                            .on("mouseover", barMouseover)
                            .on("mouseout", barMouseout)
                            .attr("height", function (d) { return height- y(yFunc(d)); });

                        // draw x-axis

                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom");

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis)
                            .selectAll("text")
                                .style("text-anchor", "end")
                                .attr("dx", "-.8em")
                                .attr("dy", ".15em")
                                .attr("transform", function (d) {
                                    return "rotate(-65)"
                                });

                        // add the title
                        svg.append("g")
                            .attr("transform", "translate(" + (width / 2) + "," + -10 + ")")
                          .append("text")
                            .style("text-anchor", "middle")
                            .style("text-decoration", "underline")
                            .style("font-size", "1.1em")
                            .text(scope.jjTitle);

                        scope.changeSort = function(sortByField) {


                            var x0 = x.domain(data.sort(function (a, b) {
                                if (!isNaN(a[sortByField]) && !isNaN(b[sortByField])) return b[sortByField] - a[sortByField];

                                // cannot guarentee numeric
                                return d3.ascending(a[sortByField], b[sortByField]);
                            })
                                .map(function (d) { return xFunc(d); }))
                                .copy();

                            svg.selectAll(".hist-bar")
                                .sort(function (a, b) { return x0(xFunc(a)) - x0(xFunc(b)); });
                            scope.blockRender = true; // block next render. Prevents data watch from calling render func.

                            var transition = svg.transition().duration(800),
                                delay = function (d, i) { return i * 60; };

                            transition.selectAll(".hist-bar")
                                .delay(delay)
                                .attr("x", function (d) { return x0(xFunc(d)); });

                            transition.select(".x.axis")
                                .call(xAxis)
                              .selectAll("g")
                                .delay(delay)
                              .selectAll("text")
                                .style("text-anchor", "end")
                                .attr("dx", "-.8em")
                                .attr("dy", ".15em")
                                .attr("transform", function (d) {
                                    return "rotate(-65)"
                                });;
                        }
                    }
                });
            }
        };
    }]);

})();