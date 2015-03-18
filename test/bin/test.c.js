System.register([], function (_export) {
    var length, nodes, edge_array, densities, i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, density, edges, i, static_edges;

    function applyModel(graph, edges, name, densitiy) {
        console.log("\n" + name + " | " + graph.directed + " | " + densitiy);
        console.time("init");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var node = _step.value;
                graph.addNode(node);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = edges[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var edge = _step2.value;
                graph.addEdge(edge[0], edge[1]);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                    _iterator2["return"]();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        console.timeEnd("init");
        console.time("Cycle check");
        console.log("Cycle: " + graph.hasCycle());
        console.timeEnd("Cycle check");
        console.time("Edges check");
        console.log("Edges: " + graph.edges.length);
        console.timeEnd("Edges check");
    }
    return {
        setters: [],
        execute: function () {
            "use strict";

            System["import"]("bin/graph.c").then(function (graphjs) {
                window.graphjs = graphjs;
                console.log("graphjs loaded");
                console.log("length: " + length);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = ["Graph", "AcyclicGraph", "Tree"][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _name = _step.value;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = edge_array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var edges = _step2.value;

                                var graph = new graphjs[_name]();
                                var dgraph = new graphjs[_name](true);
                                applyModel(graph, edges, _name, edges.density);
                                applyModel(dgraph, edges, _name, edges.density);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                                    _iterator2["return"]();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            })["catch"](function (e) {
                console.error(e);
            });console.time("preparation");
            length = 20;
            nodes = [];
            edge_array = [];
            densities = [0, 0.01, 0.5, 1, 10];

            for (i = 0; i < length; ++i) {
                nodes.push(i);
            }_iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;

            try {
                for (_iterator = densities[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    density = _step.value;
                    edges = [];

                    for (i = 0; i < Math.pow(length, 2) * density; ++i) {
                        edges.push([Math.floor(Math.random() * length), Math.floor(Math.random() * length)]);
                    }edges.density = density;
                    edge_array.push(edges);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            static_edges = (function () {
                var _static_edges = [];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var node = _step2.value;

                        _static_edges.push([Math.floor(Math.abs(Math.sin(node)) * (length - 1)), Math.floor(Math.abs(Math.cos(node)) * (length - 1))]);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                            _iterator2["return"]();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return _static_edges;
            })();

            static_edges.density = 1;
            edge_array.push(static_edges);
            console.timeEnd("preparation");
        }
    };
});
