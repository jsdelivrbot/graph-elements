define([ "exports", "module", "../../node_modules/various/build/LayerJS/mixin", "../../node_modules/various/build/requestAnimationFunction" ], function(exports, module, _node_modulesVariousBuildLayerJSMixin, _node_modulesVariousBuildRequestAnimationFunction) {
    "use strict";
    var _interopRequire = function(obj) {
        return obj && obj.__esModule ? obj["default"] :obj;
    };
    module.exports = layer;
    var mixin = _interopRequire(_node_modulesVariousBuildLayerJSMixin);
    var requestAnimationFunction = _interopRequire(_node_modulesVariousBuildRequestAnimationFunction);
    var default_duration = 1e3;
    function layer(storage, modifier, global_change_callback) {
        if (typeof storage != "object") throw Error("{storage} is not an object");
        if (!modifier || typeof modifier != "object") modifier = {};
        if (typeof global_change_callback != "function") global_change_callback = undefined;
        var layer_object = {};
        for (var property in storage) {
            var _mixin;
            (function(property) {
                var modify = modifier[property];
                if (typeof storage[property] == "object") {
                    (function() {
                        var object = layer(storage[property], modify, global_change_callback);
                        Object.defineProperty(layer_object, property, {
                            get:function get() {
                                return object;
                            },
                            set:function set(value) {
                                mixin(object, value, mixin.OVERRIDE);
                            },
                            enumerable:true
                        });
                    })();
                } else {
                    (function() {
                        var store = global_change_callback ? function(value) {
                            storage[property] = value;
                            global_change_callback();
                        } :function(value) {
                            storage[property] = value;
                        };
                        var set_callback = undefined;
                        _mixin = mixin({}, modify);
                        var get = _mixin.get;
                        var set = _mixin.set;
                        var translate = _mixin.translate;
                        var duration = _mixin.duration;
                        if (duration === undefined) duration = default_duration; else if (duration <= 0 || duration == Infinity) duration = undefined;
                        var hasTransition = duration && typeof translate == "function";
                        var getter = typeof get == "function" ? function() {
                            return get(storage[property]);
                        } :function() {
                            return storage[property];
                        };
                        var setter = undefined;
                        var hasSet = typeof set == "function";
                        if (hasTransition) {
                            (function() {
                                var set_callback = function(target_value) {
                                    update(performance.now(), target_value, target_value - getter());
                                };
                                setter = hasSet ? function(value) {
                                    set(value, set_callback);
                                } :set_callback;
                                var update = requestAnimationFunction(function(begin, target_value, value_diff) {
                                    var relativ_time_diff = (performance.now() - begin) / duration - 1;
                                    if (relativ_time_diff >= 0) {
                                        store(target_value);
                                        translate(target_value);
                                    } else {
                                        var new_value = target_value + value_diff * relativ_time_diff;
                                        store(new_value);
                                        translate(new_value);
                                        update();
                                    }
                                });
                            })();
                        } else setter = hasSet ? function(value) {
                            set(value, store);
                        } :store;
                        Object.defineProperty(layer_object, property, {
                            get:getter,
                            set:setter,
                            enumerable:true
                        });
                    })();
                }
            })(property);
        }
        return layer_object;
    }
});