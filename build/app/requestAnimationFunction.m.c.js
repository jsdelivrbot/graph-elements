System.register([], function(a) {
    function b(a) {
        var b = void 0 === arguments[1] ? !1 : arguments[1], d = !0, e = void 0;
        return function() {
            void 0 === e && (e = arguments), d ? (requestAnimationFrame(function() {
                d = !0, a.apply(void 0, c(e));
            }), d = !1) : b && (e = arguments);
        };
    }
    var c;
    return a("requestAnimationFunction", b), {
        setters: [],
        execute: function() {
            "use strict";
            c = function(a) {
                if (Array.isArray(a)) {
                    for (var b = 0, c = Array(a.length); b < a.length; b++) c[b] = a[b];
                    return c;
                }
                return Array.from(a);
            };
        }
    };
});