(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.earlyElement = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class EarlyElement extends HTMLElement {
        adoptProperties() {
            for (const key in this) {
                const descriptor = Object.getOwnPropertyDescriptor(this, key);
                if (descriptor && descriptor.configurable) {
                    // copy value
                    const value = this[key];
                    // delete own property to use prototype property
                    delete this[key];
                    // assign to prototype property
                    this[key] = value;
                }
            }
        }
    }
    exports.default = EarlyElement;
});