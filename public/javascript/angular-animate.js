/*
 AngularJS v1.2.0
 (c) 2010-2012 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(A, s, B) {
    'use strict';
    s.module("ngAnimate", ["ng"]).config(["$provide", "$animateProvider", function(N, D) {
        var z = s.noop,
            k = s.forEach,
            X = D.$$selectors,
            T = 1,
            f = "$$ngAnimateState",
            E = "ng-animate",
            g = { running: !0 };
        N.decorator("$animate", ["$delegate", "$injector", "$sniffer", "$rootElement", "$timeout", "$rootScope", "$document", function(t, A, F, m, G, p, H) {
            function B(a) {
                if (a) {
                    var d = [],
                        b = {};
                    a = a.substr(1).split(".");
                    (F.transitions || F.animations) && a.push("");
                    for (var c = 0; c < a.length; c++) {
                        var h = a[c],
                            f = X[h];
                        f && !b[h] && (d.push(A.get(f)),
                            b[h] = !0)
                    }
                    return d
                }
            }

            function n(a, d, b, c, h, g, m) {
                function p(a) { g(); if (!0 === a) u();
                    else { if (a = b.data(f)) a.done = u, b.data(f, a);
                        s(v, "after", u) } }

                function s(c, h, g) { var f = h + "End";
                    k(c, function(k, t) { var e = function() { a: { var e = h + "Complete",
                                    a = c[t];a[e] = !0;
                                (a[f] || z)(); for (a = 0; a < c.length; a++)
                                    if (!c[a][e]) break a;g() } }; "before" != h || "enter" != a && "move" != a ? k[h] ? k[f] = n ? k[h](b, d, e) : k[h](b, e) : e() : e() }) }

                function t() { m && G(m, 0, !1) }

                function u() {
                    if (!u.hasBeenRun) {
                        u.hasBeenRun = !0;
                        var a = b.data(f);
                        a && (n ? q(b) : (a.closeAnimationTimeout =
                            G(function() { q(b) }, 0, !1), b.data(f, a)));
                        t()
                    }
                }
                var r = (" " + ((b.attr("class") || "") + " " + d)).replace(/\s+/g, ".");
                c || (c = h ? h.parent() : b.parent());
                h = B(r);
                var n = "addClass" == a || "removeClass" == a,
                    r = b.data(f) || {};
                if (J(b, c) || 0 === h.length) g(), u();
                else {
                    var v = [];
                    r.running && n && r.structural || k(h, function(c) { if (!c.allowCancel || c.allowCancel(b, a, d)) { var h = c[a]; "leave" == a ? (c = h, h = null) : c = c["before" + a.charAt(0).toUpperCase() + a.substr(1)];
                            v.push({ before: c, after: h }) } });
                    0 === v.length ? (g(), t()) : (r.running && (G.cancel(r.closeAnimationTimeout),
                        q(b), K(r.animations), (r.done || z)(!0)), "addClass" == a && b.hasClass(d) || "removeClass" == a && !b.hasClass(d) ? (g(), t()) : (b.addClass(E), b.data(f, { running: !0, structural: !n, animations: v, done: p }), s(v, "before", p)))
                }
            }

            function L(a) { a = a[0];
                a.nodeType == T && k(a.querySelectorAll("." + E), function(a) { a = s.element(a); var b = a.data(f);
                    b && (K(b.animations), q(a)) }) }

            function K(a) { k(a, function(d) { a.beforeComplete || (d.beforeEnd || z)(!0);
                    a.afterComplete || (d.afterEnd || z)(!0) }) }

            function q(a) {
                a[0] == m[0] ? g.disabled || (g.running = !1, g.structural = !1) : (a.removeClass(E), a.removeData(f))
            }

            function J(a, d) { if (g.disabled) return !0; if (a[0] == m[0]) return g.disabled || g.running;
                do { if (0 === d.length) break; var b = d[0] == m[0],
                        c = b ? g : d.data(f),
                        c = c && (!!c.disabled || !!c.running); if (b || c) return c; if (b) break } while (d = d.parent()); return !0 }
            m.data(f, g);
            p.$$postDigest(function() { g.running = !1 });
            return {
                enter: function(a, d, b, c) { this.enabled(!1, a);
                    t.enter(a, d, b);
                    p.$$postDigest(function() { n("enter", "ng-enter", a, d, b, z, c) }) },
                leave: function(a, d) {
                    L(a);
                    this.enabled(!1, a);
                    p.$$postDigest(function() {
                        n("leave",
                            "ng-leave", a, null, null,
                            function() { t.leave(a) }, d)
                    })
                },
                move: function(a, d, b, c) { L(a);
                    this.enabled(!1, a);
                    t.move(a, d, b);
                    p.$$postDigest(function() { n("move", "ng-move", a, d, b, z, c) }) },
                addClass: function(a, d, b) { n("addClass", d, a, null, null, function() { t.addClass(a, d) }, b) },
                removeClass: function(a, d, b) { n("removeClass", d, a, null, null, function() { t.removeClass(a, d) }, b) },
                enabled: function(a, d) {
                    switch (arguments.length) {
                        case 2:
                            if (a) q(d);
                            else { var b = d.data(f) || {};
                                b.disabled = !0;
                                d.data(f, b) }
                            break;
                        case 1:
                            g.disabled = !a;
                            break;
                        default:
                            a = !g.disabled
                    }
                    return !!a
                }
            }
        }]);
        D.register("", ["$window", "$sniffer", "$timeout", function(f, g, F) {
            function m(e) { Q.push(e);
                F.cancel(R);
                R = F(function() { k(Q, function(e) { e() });
                    Q = [];
                    R = null;
                    C = {} }, 10, !1) }

            function G(e, a) { var w = e.getAttribute("style") || "";
                e.setAttribute("style", (0 < w.length ? "; " : "") + a); return w }

            function p(e, a) {
                var w = a ? C[a] : null;
                if (!w) {
                    var b = 0,
                        d = 0,
                        c = 0,
                        l = 0,
                        g, n, m, p;
                    k(e, function(e) {
                        if (e.nodeType == T) {
                            e = f.getComputedStyle(e) || {};
                            m = e[h + D];
                            b = Math.max(H(m), b);
                            p = e[h + S];
                            g = e[h + u];
                            d = Math.max(H(g), d);
                            n = e[I + u];
                            l =
                                Math.max(H(n), l);
                            var a = H(e[I + D]);
                            0 < a && (a *= parseInt(e[I + r], 10) || 1);
                            c = Math.max(a, c)
                        }
                    });
                    w = { total: 0, transitionPropertyStyle: p, transitionDurationStyle: m, transitionDelayStyle: g, transitionDelay: d, transitionDuration: b, animationDelayStyle: n, animationDelay: l, animationDuration: c };
                    a && (C[a] = w)
                }
                return w
            }

            function H(e) { var a = 0;
                e = s.isString(e) ? e.split(/\s*,\s*/) : [];
                k(e, function(e) { a = Math.max(parseFloat(e) || 0, a) }); return a }

            function E(e) { var a = e.parent(),
                    b = a.data(W);
                b || (a.data(W, ++V), b = V); return b + "-" + e[0].className }

            function n(e, a) {
                var b = E(e),
                    d = b + " " + a,
                    c = {},
                    g = C[d] ? ++C[d].total : 0;
                if (0 < g) { var l = a + "-stagger",
                        c = b + " " + l;
                    (b = !C[c]) && e.addClass(l);
                    c = p(e, c);
                    b && e.removeClass(l) }
                e.addClass(a);
                d = p(e, d);
                l = Math.max(d.transitionDuration, d.animationDuration);
                if (0 === l) return e.removeClass(a), !1;
                var b = e[0],
                    f = "";
                0 < d.transitionDuration && (e.addClass(U), f += N + " ", b.style[h + S] = "none");
                k(a.split(" "), function(a, e) { f += (0 < e ? " " : "") + a + "-active" });
                e.data(v, {
                    className: a,
                    activeClassName: f,
                    maxDuration: l,
                    classes: a + " " + f,
                    timings: d,
                    stagger: c,
                    ii: g
                });
                return !0
            }

            function L(a, b, w) {
                function f(a) { a.stopPropagation();
                    a = a.originalEvent || a; var e = a.$manualTimeStamp || a.timeStamp || Date.now();
                    Math.max(e - t, 0) >= p && a.elapsedTime >= n && w() }
                var x = a.data(v);
                if (a.hasClass(b) && x) {
                    var M = a[0],
                        l = x.timings,
                        k = x.stagger,
                        n = x.maxDuration,
                        m = x.activeClassName,
                        p = 1E3 * Math.max(l.transitionDelay, l.animationDelay),
                        t = Date.now(),
                        s = P + " " + O,
                        r, x = x.ii,
                        u, y = "";
                    if (0 < l.transitionDuration) {
                        M.style[h + S] = "";
                        var q = l.transitionPropertyStyle; - 1 == q.indexOf("all") && (u = !0, y += c + "transition-property: " +
                            q + ", " + (g.msie ? "-ms-zoom" : "clip") + "; ", y += c + "transition-duration: " + l.transitionDurationStyle + ", " + l.transitionDuration + "s; ")
                    }
                    0 < x && (0 < k.transitionDelay && 0 === k.transitionDuration && (q = l.transitionDelayStyle, u && (q += ", " + l.transitionDelay + "s"), y += c + "transition-delay: " + K(q, k.transitionDelay, x) + "; "), 0 < k.animationDelay && 0 === k.animationDuration && (y += c + "animation-delay: " + K(l.animationDelayStyle, k.animationDelay, x) + "; "));
                    0 < y.length && (r = G(M, y));
                    a.on(s, f);
                    a.addClass(m);
                    return function(c) {
                        a.off(s, f);
                        a.removeClass(m);
                        d(a, b);
                        null != r && (0 < r.length ? M.setAttribute("style", r) : M.removeAttribute("style"))
                    }
                }
                w()
            }

            function K(a, b, d) { var c = "";
                k(a.split(","), function(a, e) { c += (0 < e ? "," : "") + (d * b + parseInt(a, 10)) + "s" }); return c }

            function q(a, b) { if (n(a, b)) return function(c) { c && d(a, b) } }

            function J(a, b, c) { if (a.data(v)) return L(a, b, c);
                d(a, b);
                c() }

            function a(a, b, c) { var d = q(a, b); if (d) { var f = d;
                    m(function() { f = J(a, b, c) }); return function(a) {
                        (f || z)(a) } }
                c() }

            function d(a, b) { a.removeClass(b);
                a.removeClass(U);
                a.removeData(v) }

            function b(a, b) {
                var c =
                    "";
                a = s.isArray(a) ? a : a.split(/\s+/);
                k(a, function(a, e) { a && 0 < a.length && (c += (0 < e ? " " : "") + a + b) });
                return c
            }
            var c = "",
                h, O, I, P;
            A.ontransitionend === B && A.onwebkittransitionend !== B ? (c = "-webkit-", h = "WebkitTransition", O = "webkitTransitionEnd transitionend") : (h = "transition", O = "transitionend");
            A.onanimationend === B && A.onwebkitanimationend !== B ? (c = "-webkit-", I = "WebkitAnimation", P = "webkitAnimationEnd animationend") : (I = "animation", P = "animationend");
            var D = "Duration",
                S = "Property",
                u = "Delay",
                r = "IterationCount",
                W = "$$ngAnimateKey",
                v = "$$ngAnimateCSS3Data",
                U = "ng-animate-start",
                N = "ng-animate-active",
                C = {},
                V = 0,
                Q = [],
                R;
            return {
                allowCancel: function(a, c, d) {
                    var f = (a.data(v) || {}).classes;
                    if (!f || 0 <= ["enter", "leave", "move"].indexOf(c)) return !0;
                    var h = a.parent(),
                        g = s.element(a[0].cloneNode());
                    g.attr("style", "position:absolute; top:-9999px; left:-9999px");
                    g.removeAttr("id");
                    g.html("");
                    k(f.split(" "), function(a) { g.removeClass(a) });
                    g.addClass(b(d, "addClass" == c ? "-add" : "-remove"));
                    h.append(g);
                    a = p(g);
                    g.remove();
                    return 0 < Math.max(a.transitionDuration,
                        a.animationDuration)
                },
                enter: function(b, c) { return a(b, "ng-enter", c) },
                leave: function(b, c) { return a(b, "ng-leave", c) },
                move: function(b, c) { return a(b, "ng-move", c) },
                beforeAddClass: function(a, c, d) { if (a = q(a, b(c, "-add"))) return m(d), a;
                    d() },
                addClass: function(a, c, d) { return J(a, b(c, "-add"), d) },
                beforeRemoveClass: function(a, c, d) { if (a = q(a, b(c, "-remove"))) return m(d), a;
                    d() },
                removeClass: function(a, c, d) { return J(a, b(c, "-remove"), d) }
            }
        }])
    }])
})(window, window.angular);
//# sourceMappingURL=angular-animate.min.js.map