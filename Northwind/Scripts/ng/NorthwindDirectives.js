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

    NorthwindDirectives.directive('jjTimeseriesGraph', ['d3Service','$window', function (d3Service,$window) {
        return {
            restrict: 'EA',
            scope: {
                data: "=",
                jjClick: '&',  
                update:"=",
                jjXFunc: "&",
                jjYFunc: "&",
                jjMaxX: "&",
                jjMaxY: "&",
                jjHeight: "=",
                jjWidth: "=",
                jjMargin: "=",
                jjCircleR: "&",
                jjCircleFill: "&",
                jjLineField: "&",
                jjFilter: "&"
            },
            link: function (scope, ele, attrs) {
                d3Service.d3().then(function (d3) {
                    var margin = parseInt(attrs.jjMargin) || 60,
                        height = parseInt(attrs.jjHeight) || 500,
                        width = parseInt(attrs.jjWidth) || 500,
                        xField = attrs.jjXField || undefined,
                        yField = attrs.jjYField || undefined,
                        maxX = attrs.jjMaxX || undefined,
                        maxY = attrs.jjMaxY || undefined,
                        lineField = attrs.jjLineField || undefined;

                    width = width - margin;
                    height = height - (margin * 2);

                    var svg = d3.select(ele[0]).append("svg")
                         .attr("width", width + margin)
                         .attr("height", height + (margin*2))
                      .append("g")
                         .attr("transform", "translate(" + margin + "," + margin + ")");

 
                    var drawCircles = undefined; 
                    // Watch for resize event

                    // watch for data changes and re-render
                    scope.$watch('update', function (newVals, oldVals) {
                        return scope.render(scope.data);
                    }, true);

                    // watch for data changes and re-render
                    scope.$watch('data', function (newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    scope.render = function (data) {
                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;

                        // setup variables

                        var xFunc = function(d) {
                            if(!scope.jjXFunc) return undefined;
                            return scope.jjXFunc({ item: d});
                        }
                        var yFunc = function(d) {
                            if(!scope.jjYFunc) return undefined;
                            return scope.jjYFunc({ item: d});
                        }

                        var x = d3.time.scale()
        .domain([new Date(dataset[0][0].time),d3.time.day.offset(new Date(dataset[0][dataset[0].length-1].time),8)])
        .rangeRound([0, width]);

                        var y = d3.scale.linear()
                             .range([height, 0]);

                        var y2 = d3.scale.linear()
                             .range([height, 0]);


                        var color = d3.scale.category10();

                        var xAxis = d3.svg.axis()
                         .scale(xScale)
                         .orient("bottom")
                         .ticks(d3.time.days,1);

                        var yAxisLeft = d3.svg.axis()
                             .scale(y)
                             .orient("left");

                        var yAxisRight = d3.svg.axis()
                             .scale(y2)
                             .orient("right");

                        var maxVal = 0;
                        x.domain(d3.extent(data, function (d) {
                            var xVal = xFunc(d);
                            if (xVal && !isNaN(xVal) && (!maxX || +xVal < (+maxX))) {
                                maxVal = +xVal > maxVal ? +xVal : maxVal;
                                return xVal;
                            }
                        })
                              ).nice();
                        y.domain(d3.extent(data, function (d) {
                            var yVal = yFunc(d);
                            if (yVal && !isNaN(yVal) && (!maxY || +yVal < (+maxY))) {
                                return yVal;
                            }
                        })).nice();


                        svg.append("g")
                              .attr("class", "x axis")
                              .attr("transform", "translate(0," + height + ")")
                              .call(xAxis)
                           .append("text")
                              .attr("class", "label")
                              .style("font-size", function (d) {
                                  return "14px";
                              })
                              .attr("x", width)
                              .attr("y", -6)
                              .style("text-anchor", "end")
                              .text(xField);

                        svg.append("g")
                              .attr("class", "y axis")
                              .call(yAxis)
                           .append("text")
                              .attr("class", "label")
                              .attr("transform", "rotate(-90)")
                              .attr("y", 6)
                              .attr("dy", ".71em")
                              .style("font-size", function (d) {
                                  return "14px";
                              })
                              .style("text-anchor", "end")
                              .text(yField);


                        drawCircles = function() {
                          svg.selectAll(".dot")
                              .data(data)
                           .enter().append("circle")
                            .filter(function (d) { 
                                var xVal = xFunc(d);
                                var yVal = yFunc(d);
                                var userFilt = !scope.jjFilter? true : scope.jjFilter({item: d});
                              
                                return (!maxX || +xVal < (+maxX)) && (!maxY || +yVal < (+maxY)) && userFilt; 
                              })
                              .attr("class", "dot")
                            .on("mouseover", function (d) {
                                d3.select(this).style("fill", "purple");
                                //d3.selectAll("[chv^='chv_"+d.region.substring(4,6)+"_']").attr("class",getCountyColor);
                            })
                            .on("mouseout", function (d) {
                                d3.select(this).style("fill", scope.jjCircleFill({ item: d, xField: xField, yField: yField }));
                                //d3.selectAll("[chv^='chv_"+d.region.substring(4,6)+"_']").attr("class",getCountyColor);
                            })
                            .on("click", function (d) {
                                return scope.jjClick({ item: d, xField: xField, yField: yField });
                                //d3.selectAll("[chv^='chv_"+d.region.substring(4,6)+"_']").attr("class",getCountyColor);
                            })
                              .attr("r", function (d) {
                                  return scope.jjCircleR({ item: d, xField: xField, yField: yField });
                              })
                              .attr("cx", function (d) { 
                                  return x(xFunc(d));
                              })
                              .attr("cy", function (d) {
                                  return y(yFunc(d));
                              })
                              .style("fill", function (d) {
                                  return scope.jjCircleFill({ item: d, xField: xField, yField: yField });
                                  //d3.selectAll("[chv^='chv_"+d.region.substring(4,6)+"_']").attr("class",getCountyColor);
                              })
                          }
                          drawCircles();

                        function circleFill(d) {
                            if((d[xField] ) > (d["TMV"]*0.7)) {
                                return "green";
                            }
                            return "red";
                        }
                    }
                });
            }
        };
    }]);

    NorthwindDirectives.directive('jjScatterPlot', ['d3Service','$window', function (d3Service,$window) {
        return {
            restrict: 'EA',
            scope: {
                data: "=",
                jjClick: '&',  
                update:"=",
                jjXFunc: "&",
                jjYFunc: "&",
                jjMaxX: "&",
                jjMaxY: "&",
                jjHeight: "=",
                jjWidth: "=",
                jjMargin: "=",
                jjCircleMouseOver: "&",
                jjCircleMouseOut: "&",                
                jjCircleR: "&",                
                jjCircleFill: "&",
                jjLineField: "&",
                jjFilter: "&"
            },
            link: function (scope, ele, attrs) {
                d3Service.d3().then(function (d3) {
                    var margin = parseInt(attrs.jjMargin) || 60,
                        height = parseInt(attrs.jjHeight) || 500,
                        width = parseInt(attrs.jjWidth) || 500,
                        xField = attrs.jjXField || undefined,
                        yField = attrs.jjYField || undefined,
                        maxX = attrs.jjMaxX || undefined,
                        maxY = attrs.jjMaxY || undefined,
                        lineField = attrs.jjLineField || undefined;

                    width = width - margin;
                    height = height - (margin * 2);

                    var svg = d3.select(ele[0]).append("svg")
                         .attr("width", width + margin)
                         .attr("height", height + (margin*2))
                      .append("g")
                         .attr("transform", "translate(" + margin + "," + margin + ")");

 
                    var drawCircles = undefined; 
                    // Watch for resize event

                    // watch for data changes and re-render
                    scope.$watch('update', function (newVals, oldVals) {
                        return scope.render(scope.data);
                    }, true);

                    // watch for data changes and re-render
                    scope.$watch('data', function (newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    scope.render = function (data) {
                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;

                        // setup variables

                        var xFunc = function(d) {
                            if(!scope.jjXFunc) return undefined;
                            return scope.jjXFunc({ item: d});
                        }
                        var yFunc = function(d) {
                            if(!scope.jjYFunc) return undefined;
                            return scope.jjYFunc({ item: d});
                        }

                        var x = d3.scale.linear()
                              .range([0, width]);

                        var y = d3.scale.linear()
                             .range([height, 0]);

                        var color = d3.scale.category10();

                        var xAxis = d3.svg.axis()
                             .scale(x)
                             .orient("bottom");

                        var yAxis = d3.svg.axis()
                             .scale(y)
                             .orient("left");
                        var maxVal = 0;
                        x.domain(d3.extent(data, function (d) {
                            var xVal = xFunc(d);
                            if (xVal && !isNaN(xVal) && (!maxX || +xVal < (+maxX))) {
                                maxVal = +xVal > maxVal ? +xVal : maxVal;
                                return xVal;
                            }
                        })
                              ).nice();
                        y.domain(d3.extent(data, function (d) {
                            var yVal = yFunc(d);
                            if (yVal && !isNaN(yVal) && (!maxY || +yVal < (+maxY))) {
                                return yVal;
                            }
                        })).nice();


                        svg.append("g")
                              .attr("class", "x axis")
                              .attr("transform", "translate(0," + height + ")")
                              .call(xAxis)
                           .append("text")
                              .attr("class", "label")
                              .style("font-size", function (d) {
                                  return "14px";
                              })
                              .attr("x", width)
                              .attr("y", -6)
                              .style("text-anchor", "end")
                              .text(xField);

                        svg.append("g")
                              .attr("class", "y axis")
                              .call(yAxis)
                           .append("text")
                              .attr("class", "label")
                              .attr("transform", "rotate(-90)")
                              .attr("y", 6)
                              .attr("dy", ".71em")
                              .style("font-size", function (d) {
                                  return "14px";
                              })
                              .style("text-anchor", "end")
                              .text(yField);


                        drawCircles = function() {
                          svg.selectAll(".dot")
                              .data(data)
                           .enter().append("circle")
                            .filter(function (d) { 
                                var xVal = xFunc(d);
                                var yVal = yFunc(d);
                                var userFilt = !scope.jjFilter? true : scope.jjFilter({item: d});
                              
                                return (!maxX || +xVal < (+maxX)) && (!maxY || +yVal < (+maxY)) && userFilt; 
                              })
                              .attr("class", "dot")
                            .on("mouseover", function (d) {
                               return scope.jjCircleMouseOver({ item: d, d3: d3, circle: this });

                               // d3.select(this).style("fill", "purple");
                                //d3.selectAll("[chv^='chv_"+d.region.substring(4,6)+"_']").attr("class",getCountyColor);
                            })
                            .on("mouseout", function (d) {
                               return scope.jjCircleMouseOut({ item: d, d3: d3, circle: this });

                                //d3.select(this).style("fill", scope.jjCircleFill({ item: d, xField: xField, yField: yField }));
                                //d3.selectAll("[chv^='chv_"+d.region.substring(4,6)+"_']").attr("class",getCountyColor);
                            })
                            .on("click", function (d) {
                                return scope.jjClick({ item: d, xField: xField, yField: yField });
                                //d3.selectAll("[chv^='chv_"+d.region.substring(4,6)+"_']").attr("class",getCountyColor);
                            })
                              .attr("r", function (d) {
                                  return scope.jjCircleR({ item: d, xField: xField, yField: yField });
                              })
                              .attr("cx", function (d) { 
                                  return x(xFunc(d));
                              })
                              .attr("cy", function (d) {
                                  return y(yFunc(d));
                              })
                              .style("fill", function (d) {
                                  return scope.jjCircleFill({ item: d, xField: xField, yField: yField });
                                  //d3.selectAll("[chv^='chv_"+d.region.substring(4,6)+"_']").attr("class",getCountyColor);
                              })
                          }
                          drawCircles();

                        function circleFill(d) {
                            if((d[xField] ) > (d["TMV"]*0.7)) {
                                return "green";
                            }
                            return "red";
                        }
                    }
                });
            }
        };
    }]);

    NorthwindDirectives.directive('jjStackChart', ['d3Service', '$window', '$filter',function (d3Service, $window,$filter) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                jjData: "=",
                jjClick: '&',  // parent execution bijjng
                jjMaxX: "&",
                jjMaxY: "&",
                jjHeight: "=",
                jjWidth: "=",
                jjMargin: "=",
                jjCircleFill: "&",
                jjLineField: "&",
                jjDateField: "&",
                jjYFunc: "&",
                jjXFunc: "&"
            },
            //  templateURL: '<h3>Hello World!!</h3>',
            link: function (scope, ele, attrs) {
                d3Service.d3().then(function (d3) {
                    var margin = parseInt(attrs.jjMargin) || 60,
                        height = parseInt(attrs.jjHeight) - (margin*2) || 500,
                        width = parseInt(attrs.jjWidth)- (margin*2)  || 500,
                        maxX = attrs.jjMaxX || undefined,
                        maxY = attrs.jjMaxY || undefined,
                        lineField = attrs.jjLineField || undefined,
                        yFunc = scope.jjYFunc() || undefined,
                    xFunc = scope.jjXFunc() || undefined;


                     

                    /* ########################## */
                    var parse = d3.time.format("%m/%Y").parse,
                        format = d3.time.format("%b");

                    var svg = d3.select(ele[0]).append("svg")
                        .attr("width", width + (margin * 2))
                        .attr("height", height + (margin * 2))
                      .append("g")
                        .attr("transform", "translate(" + margin + "," + margin + ")");

                    /* ########################## */


                    // watch for data changes and re-render
                    scope.$watch('jjData', function (newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    scope.render = function (data) {
                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data  ) return;

                        // setup variables
                        var x = d3.scale.ordinal()
                                    .rangeRoundBands([0, width], .05)
                                    .domain(data.map(function (d) { return xFunc(d); }));

                        var y = d3.scale.linear().range([height, 0]);

                        y.domain([0, d3.max(data.map(function (d) { return yFunc(d); }))]);

                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient("left")
                            .ticks(5)
                            .tickFormat($filter('currencynodigits'));

                        // y axis
                        svg.append("g")
                            .attr("class", "axis")
                            .call(yAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".5em")
                            .style("text-anchor", "end")
                            .text("Time in Minutes");

                        svg.selectAll(".bar")
                            .data(data)
                            .enter().append("rect")
                            .attr("x", function (d) { return x(xFunc(d)); })
                            .attr("width", x.rangeBand())
                            .attr("y", function (d) { return y(yFunc(d)); })
                            .attr("class", "hist-bar")
                            .on("mouseover", function (d, i) {
                               // var myBar = d3.select(this);
                              //  d.defaultFill = myBar.style("fill");
                              //  myBar.style("fill", "#800080");

                               // d3.select("body").style("cursor", "pointer");
                               // histSelDiv.style("visibility", "visible");
                                // .html(getTaskTable([d]));

                              //  histSelDiv.selectAll("table").remove();
                              //  getTaskTable([d], histSelDiv);
                            })
                            .on("mouseout", function (d, i) {
                                //var myBar = d3.select(this);
                                //var curFill = myBar.style("fill");
                                //myBar.style("fill", curFill == "#800080" ? d.defaultFill : curFill);
                                //d3.select("body").style("cursor", "auto");
                                //histSelDiv.style("visibility", "hidden");
                            })
                            .attr("height", function (d) { return height- y(yFunc(d)); });

                        // TO-DO: X-axis label
                        //var label = svg.selectAll("text")
                        //    .data(x.domain())
                        //  .enter().append("svg:text")
                        //    .attr("x", function (d) { return x(d) + x.rangeBand() / 2; })
                        //    .attr("y", 6)
                        //    .attr("text-anchor", "middle")
                        //    .attr("dy", ".71em")
                        //    .text(format);

                        // Add y-axis rules.
                        var rule = svg.selectAll("g.rule")
                            .data(y.ticks(5))
                          .enter().append("g")
                            .attr("class", "rule")
                            .attr("transform", function (d) { return "translate(0," + -y(d) + ")"; });

                        rule.append("line")
                            .attr("x2", width - (margin*2))
                            .style("stroke", function (d) { return d ? "#fff" : "#000"; })
                            .style("stroke-opacity", function (d) { return d ? .7 : null; });

                        rule.append("text")
                            .attr("x", width - (margin * 2) + 6)
                            .attr("dy", ".35em")
                            .text(d3.format(",d"));
                    }
                });
            }
        };
    }]);

})();