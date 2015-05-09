define([ "exports", "../graph", "../extensions/IO", "../external/mixin", "../external/storage", "../external/requestAnimationFunction" ], function(exports, _graph, _extensionsIO, _externalMixin, _externalStorage, _externalRequestAnimationFunction) {
    "use strict";
    var _interopRequire = function(obj) {
        return obj && obj.__esModule ? obj["default"] :obj;
    };
    var Graph = _graph.Graph;
    var AcyclicGraph = _graph.AcyclicGraph;
    var Tree = _graph.Tree;
    var IO = _interopRequire(_extensionsIO);
    var mixin = _interopRequire(_externalMixin);
    var storage = _interopRequire(_externalStorage);
    var requestAnimationFunction = _interopRequire(_externalRequestAnimationFunction);
    window.Graph = Graph;
    window.AcyclicGraph = AcyclicGraph;
    window.Tree = Tree;
    window.IO = IO;
    var tezcatlipoca = document.querySelector("graphjs-tezcatlipoca");
    var config = storage("config", {
        d3:{
            force:{
                enabled:true
            }
        },
        state:{
            selected:undefined,
            mode:"default"
        },
        graph:undefined
    });
    tezcatlipoca.proxyHandler = {
        d3:{
            force:{
                enabled:function(_enabled) {
                    var _enabledWrapper = function enabled(_x) {
                        return _enabled.apply(this, arguments);
                    };
                    _enabledWrapper.toString = function() {
                        return _enabled.toString();
                    };
                    return _enabledWrapper;
                }(function(enabled) {
                    force.checked = config.d3.force.enabled = enabled;
                })
            }
        },
        state:{
            selected:function(_selected) {
                var _selectedWrapper = function selected(_x) {
                    return _selected.apply(this, arguments);
                };
                _selectedWrapper.toString = function() {
                    return _selected.toString();
                };
                return _selectedWrapper;
            }(function(selected) {
                node_id.value = isNaN(selected) ? "" :selected;
                config.state.selected = selected;
            }),
            mode:function(_mode) {
                var _modeWrapper = function mode(_x) {
                    return _mode.apply(this, arguments);
                };
                _modeWrapper.toString = function() {
                    return _mode.toString();
                };
                return _modeWrapper;
            }(function(mode) {
                config.state.mode = mode;
            })
        }
    };
    {
        (function() {
            var reset = true;
            var saveGraph = requestAnimationFunction(function() {
                if (reset) {
                    console.log("save graph");
                    config.graph = IO.serialize(tezcatlipoca.graph);
                    setTimeout(function() {
                        reset = true;
                        saveGraph();
                    }, 1e3);
                    reset = false;
                }
            });
            tezcatlipoca.addEventListener("graphchange", saveGraph);
        })();
    }
    var node_id = document.querySelector("#node-id");
    var graph_saved = document.querySelector("paper-toast#graph-saved");
    var force = document.querySelector("#force-layout>paper-checkbox");
    force.addEventListener("change", function() {
        tezcatlipoca.config.d3.force.enabled = force.checked;
    });
    var graph = undefined;
    try {
        graph = IO.deserialize(config.graph);
        document.querySelector("paper-toast#graph-loaded").show();
    } catch (e) {
        console.error(e);
    }
    tezcatlipoca.graph = graph;
    mixin(tezcatlipoca.config, config, mixin.OVERRIDE);
    window.tezcatlipoca = tezcatlipoca;
    window.graph = graph;
});