"use strict";

var _interopRequire = function(obj) {
    return obj && obj.__esModule ? obj["default"] :obj;
};

var layer = _interopRequire(require("../../external/layer"));

var mixin = _interopRequire(require("../../external/mixin"));

describe("layer", function() {
    var storage = undefined;
    beforeEach(function() {
        storage = {
            value:0,
            sub_object:{
                sub_value:0,
                sub_value2:0
            }
        };
    });
    var value = {
        value:1,
        sub_object:{
            sub_value:1,
            sub_value2:1
        },
        other_object:{
            other_value:1
        }
    };
    it("Basic", function() {
        var layer_object = layer(storage);
        mixin(layer_object, value, false, true);
        expect(layer_object.value).toBe(storage.value);
        expect(layer_object.sub_object.sub_value).toBe(storage.sub_object.sub_value);
        expect(layer_object.sub_object.sub_value2).toBe(storage.sub_object.sub_value2);
    });
    it("Modifier", function() {
        var modifier = {
            value:function(_value) {
                var _valueWrapper = function value(_x, _x2) {
                    return _value.apply(this, arguments);
                };
                _valueWrapper.toString = function() {
                    return _value.toString();
                };
                return _valueWrapper;
            }(function(value, set) {
                set(value * 2);
            }),
            sub_object:{
                sub_value:function sub_value(value, set) {
                    set(value * 2);
                }
            }
        };
        var layer_object = layer(storage, modifier);
        mixin(layer_object, value, false, true);
        expect(layer_object.value).toBe(value.value * 2);
        expect(layer_object.sub_object.sub_value).toBe(value.sub_object.sub_value * 2);
        expect(layer_object.sub_object.sub_value2).toBe(value.sub_object.sub_value2);
    });
});