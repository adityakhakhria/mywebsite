function initPlugins() {
    window.$parallax = $(".parallax").parallax(), $("[data-typer-targets]").typer(), $(".nav--dots").midnight()
}
function clock() {
    var a = moment(),
        b = 6 * a.seconds(),
        c = 6 * a.minutes() + b / 60,
        d = a.hours() % 12 / 12 * 360 + c / 12;
    $(".clock__hour").css("transform", "rotate(" + d + "deg)"), $(".clock__minute").css("transform", "rotate(" + c + "deg)"), $(".clock__second").css("transform", "rotate(" + b + "deg)")
}
function refreshClock() {
    clock(), setTimeout(refreshClock, 1e3)
}
function initLayout() {
    fixedScrollLayout.init({
        $sections: $("#main > section"),
        $navlinks: $("#main .default a"),
        $navlinksBlack: $("#main .nav--black a"),
        currentLink: 0,
        $body: $("html, body"),
        animspeed: 650,
        animeasing: "easeInOutExpo"
    })
}
function preloadImages() {
    var a = $("img, .parallax__content, section, .about__background, .footer__background");
    $.each(a, function() {
        var b = $(this),
            c = b.css("background-image").replace(/"/g, "").replace(/url\(|\)$/gi, "");
        c && "" !== c && "none" !== c && (a = a.add($("<img>").attr("src", c))), b.is("img") && (a = a.add(b))
    }), a.imagesLoaded(function() {
        $("body").removeClass("loading")
    })
}
function initNaturalLanguageForm() {
    window.form = $("#nl-form").clone();
    var a = localStorage.getItem("jf_form-visits");
    null === a && (a = 0), $('[data-type="modal-trigger-alt"]').on("click", function() {
        $('[data-type="modal-trigger"]').click()
    }), $('[data-type="modal-trigger"]').on("click", function() {
        0 == localStorage.getItem("jf_form-visits") && (a = 0), a++, localStorage.setItem("jf_form-visits", a), a > 4 && ($("#counter").html(a), $("#sherlockHolmes").show());
        var b = chance.name(),
            c = b.toLowerCase().split(" "),
            d = c[0] + "@" + c[1] + ".com";
        $("#formFullName").attr("placeholder", b), $("#formEmail").attr("placeholder", d);
        new NLForm(document.getElementById("nl-form"));
        handleFormUsingTabs(), $(".nl-field-toggle").on("click", updateTab);
        var e = $(this),
            f = $("body");
        f.stop().animate({
            scrollTop: 0
        }, "300", "swing", function() {
            var a = retrieveScale(e.next(".modal__bg"));
            e.addClass("to-circle"), e.next(".modal__bg").addClass("modal__bg--visible").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
                animateLayer(e.next(".modal__bg"), a, !0), setTimeout(function() {
                    $parallax.parallax("disable"), $(".parallax__layer--main").css("transform", "")
                }, 300)
            }), e.parents(".no-csstransitions").length > 0 && animateLayer(e.next(".modal__bg"), a, !0)
        })
    }), $(".modal__close").on("click", function() {
        closeModal()
    }), $(window).on("resize", function() {
        $(".modal--visible").length > 0 && window.requestAnimationFrame(updateLayer)
    })
}
function updateTab() {
    var a = $(".nl-field");
    currentTab = findIndexWithClass(a, "nl-field-open")
}
function findIndexWithClass(a, b) {
    for (var c = 0; c < a.length; c++) {
        var d = $(a[c]);
        if (d.hasClass(b))
            return c
    }
    return -1
}
function handleFormUsingTabs() {
    var a = $(".nl-field");
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && $("input").on("blur", function() {
        $("body").scrollTop(0)
    }), updateTab(), $("body").on("keydown.tabs", function(b) {
        if (9 == b.keyCode)
            if (b.preventDefault(), b.shiftKey ? (currentTab--, currentTab < 0 && (currentTab = a.length + 1)) : (currentTab++, currentTab > a.length + 1 && (currentTab = 0)), $(".nl-overlay")[0].click(), currentTab >= a.length)
                4 == currentTab && $("#progress-button > button")[0].focus(), 5 == currentTab && $(".modal__close")[0].focus();
            else {
                var c = $(a[currentTab]),
                    d = c.find(".nl-field-toggle");
                d[0].click();
                var e = c.hasClass("nl-dd");
                e ? handleFormUsingArrows(c) : $("body").off(".arrows")
            }
        27 == b.keyCode && $(".nl-overlay")[0].click()
    })
}
function handleFormUsingArrows(a) {
    $("body").off(".arrows");
    var b = $(a).find("ul > li"),
        c = findIndexWithClass(b, "nl-dd-checked");
    $("body").on("keydown.arrows", function(a) {
        40 == a.keyCode && (c++, c > b.length - 1 && (c = 0), b.removeClass("nl-dd-focus"), $(b[c]).addClass("nl-dd-focus")), 38 == a.keyCode && (c--, c < 0 && (c = b.length - 1), b.removeClass("nl-dd-focus"), $(b[c]).addClass("nl-dd-focus")), 13 == a.keyCode && $(b[c])[0].click(), 27 != a.keyCode && 9 != a.keyCode || b.removeClass("nl-dd-focus")
    })
}
function retrieveScale(a) {
    var b = a.width() / 2,
        c = $(window).width() / 2,
        d = a.offset().top + b - $(window).scrollTop(),
        e = scaleValue(d, c, b, $(window).height(), $(window).width());
    return a.css("position", "fixed").velocity({
        top: d - b,
        left: c - b,
        translateX: 0
    }, 0), e
}
function scaleValue(a, b, c, d, e) {
    var f = b > d / 2 ? b : d - b,
        g = a > e / 2 ? a : e - a;
    return Math.ceil(Math.sqrt(Math.pow(f, 2) + Math.pow(g, 2)) / c)
}
function animateLayer(a, b, c) {
    a.velocity({
        scale: b
    }, 400, function() {
        $("body").toggleClass("body--frozen", c), c ? a.parents(".modal").addClass("modal--visible").end().off("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend") : a.removeClass("modal__bg--visible").removeAttr("style").siblings('[data-type="modal-trigger"]').removeClass("to-circle")
    })
}
function updateLayer() {
    var a = $(".modal.modal--visible").find(".modal__bg"),
        b = a.width() / 2,
        c = a.siblings(".btn").offset().top + b - $(window).scrollTop(),
        d = a.siblings(".btn").offset().left + b,
        e = scaleValue(c, d, b, $(window).height(), $(window).width());
    a.velocity({
        top: c - b,
        left: d - b,
        scale: e
    }, 0)
}
function closeModal() {
    var a = $(".modal.modal--visible");
    $("body").off(".tabs"), a.removeClass("modal--visible").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
        $parallax.parallax("enable"), $parallax.parallax("updateLayers"), animateLayer(a.find(".modal__bg"), 1, !1), setTimeout(function() {
            $("#nl-form").replaceWith(window.form.clone()), initFormSubmission()
        }, 400)
    }), a.parents(".no-csstransitions").length > 0 && animateLayer(a.find(".modal__bg"), 1, !1)
}
function toggleFlag() {
    $("#flag").change(function(a) {
        var b = $(this).is(":checked") ? "en" : "es";
        window.location.search = "?lang=" + b, console.log(window.location.search)
    })
}
function validateForm(a) {
    for (var b = 0; b < a.length; b++)
        if ("" === a[b].value)
            return !1;
    return !0
}
function initFormSubmission() {
    var a = $("#nl-form");
    a.submit(function(a) {
        return a.preventDefault(), !1
    }), [].slice.call(document.querySelectorAll(".progress-button")).forEach(function(b, c) {
        new UIProgressButton(b, {
            callback: function(b) {
                var c = a.serializeArray(),
                    d = $(".formMessage"),
                    e = $("#errorValues"),
                    f = $("#errorServer"),
                    g = $("#success"),
                    h = $("#sherlockHolmes");
                d.slideUp("fast"), isValid = validateForm(c), isValid ? $.ajax({
                    beforeSend: function() {
                        var a = 0,
                            c = setInterval(function() {
                                a = Math.min(a + .1 * Math.random(), 1), b.setProgress(a), 1 === a && clearInterval(c)
                            }, 100)
                    },
                    xhr: function() {
                        var a = new window.XMLHttpRequest;
                        return a.addEventListener("progress", function(a) {
                            if (a.lengthComputable) {
                                var c = a.loaded / a.total;
                                b.setProgress(c)
                            }
                        }, !1), a
                    },
                    url: "/",
                    data: c,
                    type: "POST"
                }).error(function(a, c) {
                    f.slideDown("slow"), b.stop(-1)
                }).success(function(a) {
                    g.slideDown("slow"), h.fadeOut("slow"), localStorage.setItem("jf_form-visits", 0), b.stop(1)
                }) : (e.slideDown("slow"), b.stop(-1))
            }
        })
    })
}
function hoverReveal() {
    $("#roll").hover(function(a) {
        $("#footerBackground").toggleClass("footer__background--active")
    }), $("#working").hover(function(a) {
        $("#errorBackground").toggleClass("error__background--active")
    })
}
function printMessage() {
    var a = "";
    console.log(a)
}
function heightFix() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var a = $("html, body, #landing");
        a.each(function() {
            var a = $(this).height();
            $(this).height(a)
        })
    }
}
function footerFix() {
    window.addEventListener("touchstart", function a() {
        $("main").addClass("main--relative"), $("#footer").addClass("footer--relative"), window.removeEventListener("touchstart", a)
    }, !1)
}
window.Modernizr = function(a, b, c) {
    function d(a) {
        o.cssText = a
    }
    function e(a, b) {
        return typeof a === b
    }
    var f,
        g,
        h,
        i = "2.6.2",
        j = {},
        k = !0,
        l = b.documentElement,
        m = "modernizr",
        n = b.createElement(m),
        o = n.style,
        p = ({}.toString, " -webkit- -moz- -o- -ms- ".split(" ")),
        q = {},
        r = [],
        s = r.slice,
        t = function(a, c, d, e) {
            var f,
                g,
                h,
                i,
                j = b.createElement("div"),
                k = b.body,
                n = k || b.createElement("body");
            if (parseInt(d, 10))
                for (; d--;)
                    h = b.createElement("div"), h.id = e ? e[d] : m + (d + 1), j.appendChild(h);
            return f = ["&#173;", '<style id="s', m, '">', a, "</style>"].join(""), j.id = m, (k ? j : n).innerHTML += f, n.appendChild(j), k || (n.style.background = "", n.style.overflow = "hidden", i = l.style.overflow, l.style.overflow = "hidden", l.appendChild(n)), g = c(j, a), k ? j.parentNode.removeChild(j) : (n.parentNode.removeChild(n), l.style.overflow = i), !!g
        },
        u = {}.hasOwnProperty;
    h = e(u, "undefined") || e(u.call, "undefined") ? function(a, b) {
        return b in a && e(a.constructor.prototype[b], "undefined")
    } : function(a, b) {
        return u.call(a, b)
    }, Function.prototype.bind || (Function.prototype.bind = function(a) {
        var b = this;
        if ("function" != typeof b)
            throw new TypeError;
        var c = s.call(arguments, 1),
            d = function() {
                if (this instanceof d) {
                    var e = function() {};
                    e.prototype = b.prototype;
                    var f = new e,
                        g = b.apply(f, c.concat(s.call(arguments)));
                    return Object(g) === g ? g : f
                }
                return b.apply(a, c.concat(s.call(arguments)))
            };
        return d
    }), q.touch = function() {
        var c;
        return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : t(["@media (", p.join("touch-enabled),("), m, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(a) {
            c = 9 === a.offsetTop
        }), c
    };
    for (var v in q)
        h(q, v) && (g = v.toLowerCase(), j[g] = q[v](), r.push((j[g] ? "" : "no-") + g));
    return j.addTest = function(a, b) {
        if ("object" == typeof a)
            for (var d in a)
                h(a, d) && j.addTest(d, a[d]);
        else {
            if (a = a.toLowerCase(), j[a] !== c)
                return j;
            b = "function" == typeof b ? b() : b, "undefined" != typeof k && k && (l.className += " " + (b ? "" : "no-") + a), j[a] = b
        }
        return j
    }, d(""), n = f = null, function(a, b) {
        function c(a, b) {
            var c = a.createElement("p"),
                d = a.getElementsByTagName("head")[0] || a.documentElement;
            return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
        }
        function d() {
            var a = r.elements;
            return "string" == typeof a ? a.split(" ") : a
        }
        function e(a) {
            var b = q[a[o]];
            return b || (b = {}, p++, a[o] = p, q[p] = b), b
        }
        function f(a, c, d) {
            if (c || (c = b), k)
                return c.createElement(a);
            d || (d = e(c));
            var f;
            return f = d.cache[a] ? d.cache[a].cloneNode() : n.test(a) ? (d.cache[a] = d.createElem(a)).cloneNode() : d.createElem(a), f.canHaveChildren && !m.test(a) ? d.frag.appendChild(f) : f
        }
        function g(a, c) {
            if (a || (a = b), k)
                return a.createDocumentFragment();
            c = c || e(a);
            for (var f = c.frag.cloneNode(), g = 0, h = d(), i = h.length; g < i; g++)
                f.createElement(h[g]);
            return f
        }
        function h(a, b) {
            b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function(c) {
                return r.shivMethods ? f(c, a, b) : b.createElem(c)
            }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + d().join().replace(/\w+/g, function(a) {
                return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
            }) + ");return n}")(r, b.frag)
        }
        function i(a) {
            a || (a = b);
            var d = e(a);
            return r.shivCSS && !j && !d.hasCSS && (d.hasCSS = !!c(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), k || h(a, d), a
        }
        var j,
            k,
            l = a.html5 || {},
            m = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
            n = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
            o = "_html5shiv",
            p = 0,
            q = {};
        !function() {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>", j = "hidden" in a, k = 1 == a.childNodes.length || function() {
                    b.createElement("a");
                    var a = b.createDocumentFragment();
                    return "undefined" == typeof a.cloneNode || "undefined" == typeof a.createDocumentFragment || "undefined" == typeof a.createElement
                }()
            } catch (a) {
                j = !0, k = !0
            }
        }();
        var r = {
            elements: l.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
            shivCSS: l.shivCSS !== !1,
            supportsUnknownElements: k,
            shivMethods: l.shivMethods !== !1,
            type: "default",
            shivDocument: i,
            createElement: f,
            createDocumentFragment: g
        };
        a.html5 = r, i(b)
    }(this, b), j._version = i, j._prefixes = p, j.testStyles = t, l.className = l.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (k ? " js " + r.join(" ") : ""), j
}(this, this.document), function(a, b, c) {
    function d(a) {
        return "[object Function]" == q.call(a)
    }
    function e(a) {
        return "string" == typeof a
    }
    function f() {}
    function g(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a
    }
    function h() {
        var a = r.shift();
        s = 1, a ? a.t ? o(function() {
            ("c" == a.t ? m.injectCss : m.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
        }, 0) : (a(), h()) : s = 0
    }
    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!n && g(l.readyState) && (t.r = n = 1, !s && h(), l.onload = l.onreadystatechange = null, b)) {
                "img" != a && o(function() {
                    v.removeChild(l)
                }, 50);
                for (var d in A[c])
                    A[c].hasOwnProperty(d) && A[c][d].onload()
            }
        }
        var j = j || m.errorTimeout,
            l = b.createElement(a),
            n = 0,
            q = 0,
            t = {
                t: d,
                s: c,
                e: f,
                a: i,
                x: j
            };
        1 === A[c] && (q = 1, A[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
            k.call(this, q)
        }, r.splice(e, 0, t), "img" != a && (q || 2 === A[c] ? (v.insertBefore(l, u ? null : p), o(k, j)) : A[c].push(l))
    }
    function j(a, b, c, d, f) {
        return s = 0, b = b || "j", e(a) ? i("c" == b ? x : w, a, b, this.i++, c, d, f) : (r.splice(this.i++, 0, a), 1 == r.length && h()), this
    }
    function k() {
        var a = m;
        return a.loader = {
            load: j,
            i: 0
        }, a
    }
    var l,
        m,
        n = b.documentElement,
        o = a.setTimeout,
        p = b.getElementsByTagName("script")[0],
        q = {}.toString,
        r = [],
        s = 0,
        t = "MozAppearance" in n.style,
        u = t && !!b.createRange().compareNode,
        v = u ? n : p.parentNode,
        n = a.opera && "[object Opera]" == q.call(a.opera),
        n = !!b.attachEvent && !n,
        w = t ? "object" : n ? "script" : "img",
        x = n ? "script" : w,
        y = Array.isArray || function(a) {
            return "[object Array]" == q.call(a)
        },
        z = [],
        A = {},
        B = {
            timeout: function(a, b) {
                return b.length && (a.timeout = b[0]), a
            }
        };
    m = function(a) {
        function b(a) {
            var b,
                c,
                d,
                a = a.split("!"),
                e = z.length,
                f = a.pop(),
                g = a.length,
                f = {
                    url: f,
                    origUrl: f,
                    prefixes: a
                };
            for (c = 0; c < g; c++)
                d = a[c].split("="), (b = B[d.shift()]) && (f = b(f, d));
            for (c = 0; c < e; c++)
                f = z[c](f);
            return f
        }
        function g(a, e, f, g, h) {
            var i = b(a),
                j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (A[i.url] ? i.noexec = !0 : A[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
                k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), A[i.url] = 2
            })))
        }
        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a))
                        c || (l = function() {
                            var a = [].slice.call(arguments);
                            m.apply(this, a), n()
                        }), g(a, l, b, 0, j);
                    else if (Object(a) === a)
                        for (i in h = function() {
                            var b,
                                c = 0;
                            for (b in a)
                                a.hasOwnProperty(b) && c++;
                            return c
                        }(), a)
                            a.hasOwnProperty(i) && (!c && !--h && (d(l) ? l = function() {
                                var a = [].slice.call(arguments);
                                m.apply(this, a), n()
                            } : l[i] = function(a) {
                                return function() {
                                    var b = [].slice.call(arguments);
                                    a && a.apply(this, b), n()
                                }
                            }(m[i])), g(a[i], l, b, i, j))
                } else
                    !c && n()
            }
            var h,
                i,
                j = !!a.test,
                k = a.load || a.both,
                l = a.callback || f,
                m = l,
                n = a.complete || f;
            c(j ? a.yep : a.nope, !!k), k && c(k)
        }
        var i,
            j,
            l = this.yepnope.loader;
        if (e(a))
            g(a, 0, l, 0);
        else if (y(a))
            for (i = 0; i < a.length; i++)
                j = a[i], e(j) ? g(j, 0, l, 0) : y(j) ? m(j) : Object(j) === j && h(j, l);
        else
            Object(a) === a && h(a, l)
    }, m.addPrefix = function(a, b) {
        B[a] = b
    }, m.addFilter = function(a) {
        z.push(a)
    }, m.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", l = function() {
        b.removeEventListener("DOMContentLoaded", l, 0), b.readyState = "complete"
    }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
        var k,
            l,
            n = b.createElement("script"),
            e = e || m.errorTimeout;
        n.src = a;
        for (l in d)
            n.setAttribute(l, d[l]);
        c = j ? h : c || f, n.onreadystatechange = n.onload = function() {
            !k && g(n.readyState) && (k = 1, c(), n.onload = n.onreadystatechange = null)
        }, o(function() {
            k || (k = 1, c(1))
        }, e), i ? n.onload() : p.parentNode.insertBefore(n, p)
    }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
        var j,
            e = b.createElement("link"),
            c = i ? h : c || f;
        e.href = a, e.rel = "stylesheet", e.type = "text/css";
        for (j in d)
            e.setAttribute(j, d[j]);
        g || (p.parentNode.insertBefore(e, p), o(c, 0))
    }
}(this, document), Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0))
}, !function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document)
            throw new Error("jQuery requires a window with a document");
        return b(a)
    } : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
    function c(a) {
        var b = "length" in a && a.length,
            c = ea.type(a);
        return "function" !== c && !ea.isWindow(a) && (!(1 !== a.nodeType || !b) || ("array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a))
    }
    function d(a, b, c) {
        if (ea.isFunction(b))
            return ea.grep(a, function(a, d) {
                return !!b.call(a, d, a) !== c
            });
        if (b.nodeType)
            return ea.grep(a, function(a) {
                return a === b !== c
            });
        if ("string" == typeof b) {
            if (ma.test(b))
                return ea.filter(b, a, c);
            b = ea.filter(b, a)
        }
        return ea.grep(a, function(a) {
            return ea.inArray(a, b) >= 0 !== c
        })
    }
    function e(a, b) {
        do a = a[b];
        while (a && 1 !== a.nodeType);
        return a
    }
    function f(a) {
        var b = ua[a] = {};
        return ea.each(a.match(ta) || [], function(a, c) {
            b[c] = !0
        }), b
    }
    function g() {
        oa.addEventListener ? (oa.removeEventListener("DOMContentLoaded", h, !1), a.removeEventListener("load", h, !1)) : (oa.detachEvent("onreadystatechange", h), a.detachEvent("onload", h))
    }
    function h() {
        (oa.addEventListener || "load" === event.type || "complete" === oa.readyState) && (g(), ea.ready())
    }
    function i(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(za, "-$1").toLowerCase();
            if (c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c || "false" !== c && ("null" === c ? null : +c + "" === c ? +c : ya.test(c) ? ea.parseJSON(c) : c)
                } catch (a) {}
                ea.data(a, b, c)
            } else
                c = void 0
        }
        return c
    }
    function j(a) {
        var b;
        for (b in a)
            if (("data" !== b || !ea.isEmptyObject(a[b])) && "toJSON" !== b)
                return !1;
        return !0
    }
    function k(a, b, c, d) {
        if (ea.acceptData(a)) {
            var e,
                f,
                g = ea.expando,
                h = a.nodeType,
                i = h ? ea.cache : a,
                j = h ? a[g] : a[g] && g;
            if (j && i[j] && (d || i[j].data) || void 0 !== c || "string" != typeof b)
                return j || (j = h ? a[g] = W.pop() || ea.guid++ : g), i[j] || (i[j] = h ? {} : {
                    toJSON: ea.noop
                }), ("object" == typeof b || "function" == typeof b) && (d ? i[j] = ea.extend(i[j], b) : i[j].data = ea.extend(i[j].data, b)), f = i[j], d || (f.data || (f.data = {}), f = f.data), void 0 !== c && (f[ea.camelCase(b)] = c), "string" == typeof b ? (e = f[b], null == e && (e = f[ea.camelCase(b)])) : e = f, e
        }
    }
    function l(a, b, c) {
        if (ea.acceptData(a)) {
            var d,
                e,
                f = a.nodeType,
                g = f ? ea.cache : a,
                h = f ? a[ea.expando] : ea.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    ea.isArray(b) ? b = b.concat(ea.map(b, ea.camelCase)) : b in d ? b = [b] : (b = ea.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                    for (; e--;)
                        delete d[b[e]];
                    if (c ? !j(d) : !ea.isEmptyObject(d))
                        return
                }
                (c || (delete g[h].data, j(g[h]))) && (f ? ea.cleanData([a], !0) : ca.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
            }
        }
    }
    function m() {
        return !0
    }
    function n() {
        return !1
    }
    function o() {
        try {
            return oa.activeElement
        } catch (a) {}
    }
    function p(a) {
        var b = Ka.split("|"),
            c = a.createDocumentFragment();
        if (c.createElement)
            for (; b.length;)
                c.createElement(b.pop());
        return c
    }
    function q(a, b) {
        var c,
            d,
            e = 0,
            f = typeof a.getElementsByTagName !== xa ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== xa ? a.querySelectorAll(b || "*") : void 0;
        if (!f)
            for (f = [], c = a.childNodes || a; null != (d = c[e]); e++)
                !b || ea.nodeName(d, b) ? f.push(d) : ea.merge(f, q(d, b));
        return void 0 === b || b && ea.nodeName(a, b) ? ea.merge([a], f) : f
    }
    function r(a) {
        Ea.test(a.type) && (a.defaultChecked = a.checked)
    }
    function s(a, b) {
        return ea.nodeName(a, "table") && ea.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }
    function t(a) {
        return a.type = (null !== ea.find.attr(a, "type")) + "/" + a.type, a
    }
    function u(a) {
        var b = Va.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a
    }
    function v(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++)
            ea._data(c, "globalEval", !b || ea._data(b[d], "globalEval"))
    }
    function w(a, b) {
        if (1 === b.nodeType && ea.hasData(a)) {
            var c,
                d,
                e,
                f = ea._data(a),
                g = ea._data(b, f),
                h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h)
                    for (d = 0, e = h[c].length; e > d; d++)
                        ea.event.add(b, c, h[c][d])
            }
            g.data && (g.data = ea.extend({}, g.data))
        }
    }
    function x(a, b) {
        var c,
            d,
            e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(), !ca.noCloneEvent && b[ea.expando]) {
                e = ea._data(b);
                for (d in e.events)
                    ea.removeEvent(b, d, e.handle);
                b.removeAttribute(ea.expando)
            }
            "script" === c && b.text !== a.text ? (t(b).text = a.text, u(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), ca.html5Clone && a.innerHTML && !ea.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Ea.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
        }
    }
    function y(b, c) {
        var d,
            e = ea(c.createElement(b)).appendTo(c.body),
            f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : ea.css(e[0], "display");
        return e.detach(), f
    }
    function z(a) {
        var b = oa,
            c = _a[a];
        return c || (c = y(a, b), "none" !== c && c || ($a = ($a || ea("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = ($a[0].contentWindow || $a[0].contentDocument).document, b.write(), b.close(), c = y(a, b), $a.detach()), _a[a] = c), c
    }
    function A(a, b) {
        return {
            get: function() {
                var c = a();
                if (null != c)
                    return c ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }
    function B(a, b) {
        if (b in a)
            return b;
        for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = mb.length; e--;)
            if (b = mb[e] + c, b in a)
                return b;
        return d
    }
    function C(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
            d = a[g], d.style && (f[g] = ea._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && Ca(d) && (f[g] = ea._data(d, "olddisplay", z(d.nodeName)))) : (e = Ca(d), (c && "none" !== c || !e) && ea._data(d, "olddisplay", e ? c : ea.css(d, "display"))));
        for (g = 0; h > g; g++)
            d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }
    function D(a, b, c) {
        var d = ib.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }
    function E(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
            "margin" === c && (g += ea.css(a, c + Ba[f], !0, e)), d ? ("content" === c && (g -= ea.css(a, "padding" + Ba[f], !0, e)), "margin" !== c && (g -= ea.css(a, "border" + Ba[f] + "Width", !0, e))) : (g += ea.css(a, "padding" + Ba[f], !0, e), "padding" !== c && (g += ea.css(a, "border" + Ba[f] + "Width", !0, e)));
        return g
    }
    function F(a, b, c) {
        var d = !0,
            e = "width" === b ? a.offsetWidth : a.offsetHeight,
            f = ab(a),
            g = ca.boxSizing && "border-box" === ea.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = bb(a, b, f), (0 > e || null == e) && (e = a.style[b]), db.test(e))
                return e;
            d = g && (ca.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
        }
        return e + E(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }
    function G(a, b, c, d, e) {
        return new G.prototype.init(a, b, c, d, e)
    }
    function H() {
        return setTimeout(function() {
            nb = void 0
        }), nb = ea.now()
    }
    function I(a, b) {
        var c,
            d = {
                height: a
            },
            e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b)
            c = Ba[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d
    }
    function J(a, b, c) {
        for (var d, e = (tb[b] || []).concat(tb["*"]), f = 0, g = e.length; g > f; f++)
            if (d = e[f].call(c, b, a))
                return d
    }
    function K(a, b, c) {
        var d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l = this,
            m = {},
            n = a.style,
            o = a.nodeType && Ca(a),
            p = ea._data(a, "fxshow");
        c.queue || (h = ea._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
            h.unqueued || i()
        }), h.unqueued++, l.always(function() {
            l.always(function() {
                h.unqueued--, ea.queue(a, "fx").length || h.empty.fire()
            })
        })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY], j = ea.css(a, "display"), k = "none" === j ? ea._data(a, "olddisplay") || z(a.nodeName) : j, "inline" === k && "none" === ea.css(a, "float") && (ca.inlineBlockNeedsLayout && "inline" !== z(a.nodeName) ? n.zoom = 1 : n.display = "inline-block")), c.overflow && (n.overflow = "hidden", ca.shrinkWrapBlocks() || l.always(function() {
            n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2]
        }));
        for (d in b)
            if (e = b[d], pb.exec(e)) {
                if (delete b[d], f = f || "toggle" === e, e === (o ? "hide" : "show")) {
                    if ("show" !== e || !p || void 0 === p[d])
                        continue;
                    o = !0
                }
                m[d] = p && p[d] || ea.style(a, d)
            } else
                j = void 0;
        if (ea.isEmptyObject(m))
            "inline" === ("none" === j ? z(a.nodeName) : j) && (n.display = j);
        else {
            p ? "hidden" in p && (o = p.hidden) : p = ea._data(a, "fxshow", {}), f && (p.hidden = !o), o ? ea(a).show() : l.done(function() {
                ea(a).hide()
            }), l.done(function() {
                var b;
                ea._removeData(a, "fxshow");
                for (b in m)
                    ea.style(a, b, m[b])
            });
            for (d in m)
                g = J(o ? p[d] : 0, d, l), d in p || (p[d] = g.start, o && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }
    function L(a, b) {
        var c,
            d,
            e,
            f,
            g;
        for (c in a)
            if (d = ea.camelCase(c), e = b[d], f = a[c], ea.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = ea.cssHooks[d], g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f)
                    c in a || (a[c] = f[c], b[c] = e)
            } else
                b[d] = e
    }
    function M(a, b, c) {
        var d,
            e,
            f = 0,
            g = sb.length,
            h = ea.Deferred().always(function() {
                delete i.elem
            }),
            i = function() {
                if (e)
                    return !1;
                for (var b = nb || H(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)
                    j.tweens[g].run(f);
                return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
            },
            j = h.promise({
                elem: a,
                props: ea.extend({}, b),
                opts: ea.extend(!0, {
                    specialEasing: {}
                }, c),
                originalProperties: b,
                originalOptions: c,
                startTime: nb || H(),
                duration: c.duration,
                tweens: [],
                createTween: function(b, c) {
                    var d = ea.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                    return j.tweens.push(d), d
                },
                stop: function(b) {
                    var c = 0,
                        d = b ? j.tweens.length : 0;
                    if (e)
                        return this;
                    for (e = !0; d > c; c++)
                        j.tweens[c].run(1);
                    return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
                }
            }),
            k = j.props;
        for (L(k, j.opts.specialEasing); g > f; f++)
            if (d = sb[f].call(j, a, k, j.opts))
                return d;
        return ea.map(k, J, j), ea.isFunction(j.opts.start) && j.opts.start.call(a, j), ea.fx.timer(ea.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    function N(a) {
        return function(b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d,
                e = 0,
                f = b.toLowerCase().match(ta) || [];
            if (ea.isFunction(c))
                for (; d = f[e++];)
                    "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }
    function O(a, b, c, d) {
        function e(h) {
            var i;
            return f[h] = !0, ea.each(a[h] || [], function(a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), e(j), !1)
            }), i
        }
        var f = {},
            g = a === Rb;
        return e(b.dataTypes[0]) || !f["*"] && e("*")
    }
    function P(a, b) {
        var c,
            d,
            e = ea.ajaxSettings.flatOptions || {};
        for (d in b)
            void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && ea.extend(!0, a, c), a
    }
    function Q(a, b, c) {
        for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0];)
            i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e)
            for (g in h)
                if (h[g] && h[g].test(e)) {
                    i.unshift(g);
                    break
                }
        if (i[0] in c)
            f = i[0];
        else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break
                }
                d || (d = g)
            }
            f = f || d
        }
        return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
    }
    function R(a, b, c, d) {
        var e,
            f,
            g,
            h,
            i,
            j = {},
            k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters)
                j[g.toLowerCase()] = a.converters[g];
        for (f = k.shift(); f;)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                if ("*" === f)
                    f = i;
                else if ("*" !== i && i !== f) {
                    if (g = j[i + " " + f] || j["* " + f], !g)
                        for (e in j)
                            if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                                break
                            }
                    if (g !== !0)
                        if (g && a.throws)
                            b = g(b);
                        else
                            try {
                                b = g(b)
                            } catch (a) {
                                return {
                                    state: "parsererror",
                                    error: g ? a : "No conversion from " + i + " to " + f
                                }
                            }
                }
        return {
            state: "success",
            data: b
        }
    }
    function S(a, b, c, d) {
        var e;
        if (ea.isArray(b))
            ea.each(b, function(b, e) {
                c || Ub.test(a) ? d(a, e) : S(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
            });
        else if (c || "object" !== ea.type(b))
            d(a, b);
        else
            for (e in b)
                S(a + "[" + e + "]", b[e], c, d)
    }
    function T() {
        try {
            return new a.XMLHttpRequest
        } catch (a) {}
    }
    function U() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (a) {}
    }
    function V(a) {
        return ea.isWindow(a) ? a : 9 === a.nodeType && (a.defaultView || a.parentWindow)
    }
    var W = [],
        X = W.slice,
        Y = W.concat,
        Z = W.push,
        $ = W.indexOf,
        _ = {},
        aa = _.toString,
        ba = _.hasOwnProperty,
        ca = {},
        da = "1.11.3",
        ea = function(a, b) {
            return new ea.fn.init(a, b)
        },
        fa = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        ga = /^-ms-/,
        ha = /-([\da-z])/gi,
        ia = function(a, b) {
            return b.toUpperCase()
        };
    ea.fn = ea.prototype = {
        jquery: da,
        constructor: ea,
        selector: "",
        length: 0,
        toArray: function() {
            return X.call(this)
        },
        get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : X.call(this)
        },
        pushStack: function(a) {
            var b = ea.merge(this.constructor(), a);
            return b.prevObject = this, b.context = this.context, b
        },
        each: function(a, b) {
            return ea.each(this, a, b)
        },
        map: function(a) {
            return this.pushStack(ea.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(X.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length,
                c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: Z,
        sort: W.sort,
        splice: W.splice
    }, ea.extend = ea.fn.extend = function() {
        var a,
            b,
            c,
            d,
            e,
            f,
            g = arguments[0] || {},
            h = 1,
            i = arguments.length,
            j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || ea.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
            if (null != (e = arguments[h]))
                for (d in e)
                    a = g[d], c = e[d], g !== c && (j && c && (ea.isPlainObject(c) || (b = ea.isArray(c))) ? (b ? (b = !1, f = a && ea.isArray(a) ? a : []) : f = a && ea.isPlainObject(a) ? a : {}, g[d] = ea.extend(j, f, c)) : void 0 !== c && (g[d] = c));
        return g
    }, ea.extend({
        expando: "jQuery" + (da + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw new Error(a)
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === ea.type(a)
        },
        isArray: Array.isArray || function(a) {
            return "array" === ea.type(a)
        },
        isWindow: function(a) {
            return null != a && a == a.window
        },
        isNumeric: function(a) {
            return !ea.isArray(a) && a - parseFloat(a) + 1 >= 0
        },
        isEmptyObject: function(a) {
            var b;
            for (b in a)
                return !1;
            return !0
        },
        isPlainObject: function(a) {
            var b;
            if (!a || "object" !== ea.type(a) || a.nodeType || ea.isWindow(a))
                return !1;
            try {
                if (a.constructor && !ba.call(a, "constructor") && !ba.call(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (a) {
                return !1
            }
            if (ca.ownLast)
                for (b in a)
                    return ba.call(a, b);
            for (b in a)
                ;
            return void 0 === b || ba.call(a, b)
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? _[aa.call(a)] || "object" : typeof a
        },
        globalEval: function(b) {
            b && ea.trim(b) && (a.execScript || function(b) {
                a.eval.call(a, b)
            })(b)
        },
        camelCase: function(a) {
            return a.replace(ga, "ms-").replace(ha, ia)
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function(a, b, d) {
            var e,
                f = 0,
                g = a.length,
                h = c(a);
            if (d) {
                if (h)
                    for (; g > f && (e = b.apply(a[f], d), e !== !1); f++)
                        ;
                else
                    for (f in a)
                        if (e = b.apply(a[f], d), e === !1)
                            break
            } else if (h)
                for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++)
                    ;
            else
                for (f in a)
                    if (e = b.call(a[f], f, a[f]), e === !1)
                        break;
            return a
        },
        trim: function(a) {
            return null == a ? "" : (a + "").replace(fa, "")
        },
        makeArray: function(a, b) {
            var d = b || [];
            return null != a && (c(Object(a)) ? ea.merge(d, "string" == typeof a ? [a] : a) : Z.call(d, a)), d
        },
        inArray: function(a, b, c) {
            var d;
            if (b) {
                if ($)
                    return $.call(b, a, c);
                for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                    if (c in b && b[c] === a)
                        return c
            }
            return -1
        },
        merge: function(a, b) {
            for (var c = +b.length, d = 0, e = a.length; c > d;)
                a[e++] = b[d++];
            if (c !== c)
                for (; void 0 !== b[d];)
                    a[e++] = b[d++];
            return a.length = e, a
        },
        grep: function(a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)
                d = !b(a[f], f), d !== h && e.push(a[f]);
            return e
        },
        map: function(a, b, d) {
            var e,
                f = 0,
                g = a.length,
                h = c(a),
                i = [];
            if (h)
                for (; g > f; f++)
                    e = b(a[f], f, d), null != e && i.push(e);
            else
                for (f in a)
                    e = b(a[f], f, d), null != e && i.push(e);
            return Y.apply([], i)
        },
        guid: 1,
        proxy: function(a, b) {
            var c,
                d,
                e;
            return "string" == typeof b && (e = a[b], b = a, a = e), ea.isFunction(a) ? (c = X.call(arguments, 2), d = function() {
                return a.apply(b || this, c.concat(X.call(arguments)))
            }, d.guid = a.guid = a.guid || ea.guid++, d) : void 0
        },
        now: function() {
            return +new Date
        },
        support: ca
    }), ea.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
        _["[object " + b + "]"] = b.toLowerCase()
    });
    var ja = function(a) {
        function b(a, b, c, d) {
            var e,
                f,
                g,
                h,
                i,
                j,
                l,
                n,
                o,
                p;
            if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], h = b.nodeType, "string" != typeof a || !a || 1 !== h && 9 !== h && 11 !== h)
                return c;
            if (!d && I) {
                if (11 !== h && (e = sa.exec(a)))
                    if (g = e[1]) {
                        if (9 === h) {
                            if (f = b.getElementById(g), !f || !f.parentNode)
                                return c;
                            if (f.id === g)
                                return c.push(f), c
                        } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g)
                            return c.push(f), c
                    } else {
                        if (e[2])
                            return $.apply(c, b.getElementsByTagName(a)), c;
                        if ((g = e[3]) && v.getElementsByClassName)
                            return $.apply(c, b.getElementsByClassName(g)), c
                    }
                if (v.qsa && (!J || !J.test(a))) {
                    if (n = l = N, o = b, p = 1 !== h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                        for (j = z(a), (l = b.getAttribute("id")) ? n = l.replace(ua, "\\$&") : b.setAttribute("id", n), n = "[id='" + n + "'] ", i = j.length; i--;)
                            j[i] = n + m(j[i]);
                        o = ta.test(a) && k(b.parentNode) || b, p = j.join(",");
                    }
                    if (p)
                        try {
                            return $.apply(c, o.querySelectorAll(p)), c
                        } catch (a) {} finally {
                            l || b.removeAttribute("id")
                        }
                }
            }
            return B(a.replace(ia, "$1"), b, c, d)
        }
        function c() {
            function a(c, d) {
                return b.push(c + " ") > w.cacheLength && delete a[b.shift()], a[c + " "] = d
            }
            var b = [];
            return a
        }
        function d(a) {
            return a[N] = !0, a
        }
        function e(a) {
            var b = G.createElement("div");
            try {
                return !!a(b)
            } catch (a) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null
            }
        }
        function f(a, b) {
            for (var c = a.split("|"), d = a.length; d--;)
                w.attrHandle[c[d]] = b
        }
        function g(a, b) {
            var c = b && a,
                d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || V) - (~a.sourceIndex || V);
            if (d)
                return d;
            if (c)
                for (; c = c.nextSibling;)
                    if (c === b)
                        return -1;
            return a ? 1 : -1
        }
        function h(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }
        function i(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }
        function j(a) {
            return d(function(b) {
                return b = +b, d(function(c, d) {
                    for (var e, f = a([], c.length, b), g = f.length; g--;)
                        c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }
        function k(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }
        function l() {}
        function m(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++)
                d += a[b].value;
            return d
        }
        function n(a, b, c) {
            var d = b.dir,
                e = c && "parentNode" === d,
                f = Q++;
            return b.first ? function(b, c, f) {
                for (; b = b[d];)
                    if (1 === b.nodeType || e)
                        return a(b, c, f)
            } : function(b, c, g) {
                var h,
                    i,
                    j = [P, f];
                if (g) {
                    for (; b = b[d];)
                        if ((1 === b.nodeType || e) && a(b, c, g))
                            return !0
                } else
                    for (; b = b[d];)
                        if (1 === b.nodeType || e) {
                            if (i = b[N] || (b[N] = {}), (h = i[d]) && h[0] === P && h[1] === f)
                                return j[2] = h[2];
                            if (i[d] = j, j[2] = a(b, c, g))
                                return !0
                        }
            }
        }
        function o(a) {
            return a.length > 1 ? function(b, c, d) {
                for (var e = a.length; e--;)
                    if (!a[e](b, c, d))
                        return !1;
                return !0
            } : a[0]
        }
        function p(a, c, d) {
            for (var e = 0, f = c.length; f > e; e++)
                b(a, c[e], d);
            return d
        }
        function q(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
                (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
            return g
        }
        function r(a, b, c, e, f, g) {
            return e && !e[N] && (e = r(e)), f && !f[N] && (f = r(f, g)), d(function(d, g, h, i) {
                var j,
                    k,
                    l,
                    m = [],
                    n = [],
                    o = g.length,
                    r = d || p(b || "*", h.nodeType ? [h] : h, []),
                    s = !a || !d && b ? r : q(r, m, a, h, i),
                    t = c ? f || (d ? a : o || e) ? [] : g : s;
                if (c && c(s, t, h, i), e)
                    for (j = q(t, n), e(j, [], h, i), k = j.length; k--;)
                        (l = j[k]) && (t[n[k]] = !(s[n[k]] = l));
                if (d) {
                    if (f || a) {
                        if (f) {
                            for (j = [], k = t.length; k--;)
                                (l = t[k]) && j.push(s[k] = l);
                            f(null, t = [], j, i)
                        }
                        for (k = t.length; k--;)
                            (l = t[k]) && (j = f ? aa(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                    }
                } else
                    t = q(t === g ? t.splice(o, t.length) : t), f ? f(null, g, t, i) : $.apply(g, t)
            })
        }
        function s(a) {
            for (var b, c, d, e = a.length, f = w.relative[a[0].type], g = f || w.relative[" "], h = f ? 1 : 0, i = n(function(a) {
                    return a === b
                }, g, !0), j = n(function(a) {
                    return aa(b, a) > -1
                }, g, !0), k = [function(a, c, d) {
                    var e = !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d));
                    return b = null, e
                }]; e > h; h++)
                if (c = w.relative[a[h].type])
                    k = [n(o(k), c)];
                else {
                    if (c = w.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                        for (d = ++h; e > d && !w.relative[a[d].type]; d++)
                            ;
                        return r(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                            value: " " === a[h - 2].type ? "*" : ""
                        })).replace(ia, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && m(a))
                    }
                    k.push(c)
                }
            return o(k)
        }
        function t(a, c) {
            var e = c.length > 0,
                f = a.length > 0,
                g = function(d, g, h, i, j) {
                    var k,
                        l,
                        m,
                        n = 0,
                        o = "0",
                        p = d && [],
                        r = [],
                        s = C,
                        t = d || f && w.find.TAG("*", j),
                        u = P += null == s ? 1 : Math.random() || .1,
                        v = t.length;
                    for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
                        if (f && k) {
                            for (l = 0; m = a[l++];)
                                if (m(k, g, h)) {
                                    i.push(k);
                                    break
                                }
                            j && (P = u)
                        }
                        e && ((k = !m && k) && n--, d && p.push(k))
                    }
                    if (n += o, e && o !== n) {
                        for (l = 0; m = c[l++];)
                            m(p, r, g, h);
                        if (d) {
                            if (n > 0)
                                for (; o--;)
                                    p[o] || r[o] || (r[o] = Y.call(i));
                            r = q(r)
                        }
                        $.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
                    }
                    return j && (P = u, C = s), p
                };
            return e ? d(g) : g
        }
        var u,
            v,
            w,
            x,
            y,
            z,
            A,
            B,
            C,
            D,
            E,
            F,
            G,
            H,
            I,
            J,
            K,
            L,
            M,
            N = "sizzle" + 1 * new Date,
            O = a.document,
            P = 0,
            Q = 0,
            R = c(),
            S = c(),
            T = c(),
            U = function(a, b) {
                return a === b && (E = !0), 0
            },
            V = 1 << 31,
            W = {}.hasOwnProperty,
            X = [],
            Y = X.pop,
            Z = X.push,
            $ = X.push,
            _ = X.slice,
            aa = function(a, b) {
                for (var c = 0, d = a.length; d > c; c++)
                    if (a[c] === b)
                        return c;
                return -1
            },
            ba = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            ca = "[\\x20\\t\\r\\n\\f]",
            da = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            ea = da.replace("w", "w#"),
            fa = "\\[" + ca + "*(" + da + ")(?:" + ca + "*([*^$|!~]?=)" + ca + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ea + "))|)" + ca + "*\\]",
            ga = ":(" + da + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + fa + ")*)|.*)\\)|)",
            ha = new RegExp(ca + "+", "g"),
            ia = new RegExp("^" + ca + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ca + "+$", "g"),
            ja = new RegExp("^" + ca + "*," + ca + "*"),
            ka = new RegExp("^" + ca + "*([>+~]|" + ca + ")" + ca + "*"),
            la = new RegExp("=" + ca + "*([^\\]'\"]*?)" + ca + "*\\]", "g"),
            ma = new RegExp(ga),
            na = new RegExp("^" + ea + "$"),
            oa = {
                ID: new RegExp("^#(" + da + ")"),
                CLASS: new RegExp("^\\.(" + da + ")"),
                TAG: new RegExp("^(" + da.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + fa),
                PSEUDO: new RegExp("^" + ga),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ca + "*(even|odd|(([+-]|)(\\d*)n|)" + ca + "*(?:([+-]|)" + ca + "*(\\d+)|))" + ca + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + ba + ")$", "i"),
                needsContext: new RegExp("^" + ca + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ca + "*((?:-\\d)?\\d*)" + ca + "*\\)|)(?=[^-]|$)", "i")
            },
            pa = /^(?:input|select|textarea|button)$/i,
            qa = /^h\d$/i,
            ra = /^[^{]+\{\s*\[native \w/,
            sa = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ta = /[+~]/,
            ua = /'|\\/g,
            va = new RegExp("\\\\([\\da-f]{1,6}" + ca + "?|(" + ca + ")|.)", "ig"),
            wa = function(a, b, c) {
                var d = "0x" + b - 65536;
                return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
            },
            xa = function() {
                F()
            };
        try {
            $.apply(X = _.call(O.childNodes), O.childNodes), X[O.childNodes.length].nodeType
        } catch (a) {
            $ = {
                apply: X.length ? function(a, b) {
                    Z.apply(a, _.call(b))
                } : function(a, b) {
                    for (var c = a.length, d = 0; a[c++] = b[d++];)
                        ;
                    a.length = c - 1
                }
            }
        }
        v = b.support = {}, y = b.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return !!b && "HTML" !== b.nodeName
        }, F = b.setDocument = function(a) {
            var b,
                c,
                d = a ? a.ownerDocument || a : O;
            return d !== G && 9 === d.nodeType && d.documentElement ? (G = d, H = d.documentElement, c = d.defaultView, c && c !== c.top && (c.addEventListener ? c.addEventListener("unload", xa, !1) : c.attachEvent && c.attachEvent("onunload", xa)), I = !y(d), v.attributes = e(function(a) {
                return a.className = "i", !a.getAttribute("className")
            }), v.getElementsByTagName = e(function(a) {
                return a.appendChild(d.createComment("")), !a.getElementsByTagName("*").length
            }), v.getElementsByClassName = ra.test(d.getElementsByClassName), v.getById = e(function(a) {
                return H.appendChild(a).id = N, !d.getElementsByName || !d.getElementsByName(N).length
            }), v.getById ? (w.find.ID = function(a, b) {
                if ("undefined" != typeof b.getElementById && I) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [c] : []
                }
            }, w.filter.ID = function(a) {
                var b = a.replace(va, wa);
                return function(a) {
                    return a.getAttribute("id") === b
                }
            }) : (delete w.find.ID, w.filter.ID = function(a) {
                var b = a.replace(va, wa);
                return function(a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }), w.find.TAG = v.getElementsByTagName ? function(a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : v.qsa ? b.querySelectorAll(a) : void 0
            } : function(a, b) {
                var c,
                    d = [],
                    e = 0,
                    f = b.getElementsByTagName(a);
                if ("*" === a) {
                    for (; c = f[e++];)
                        1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }, w.find.CLASS = v.getElementsByClassName && function(a, b) {
                return I ? b.getElementsByClassName(a) : void 0
            }, K = [], J = [], (v.qsa = ra.test(d.querySelectorAll)) && (e(function(a) {
                H.appendChild(a).innerHTML = "<a id='" + N + "'></a><select id='" + N + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && J.push("[*^$]=" + ca + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || J.push("\\[" + ca + "*(?:value|" + ba + ")"), a.querySelectorAll("[id~=" + N + "-]").length || J.push("~="), a.querySelectorAll(":checked").length || J.push(":checked"), a.querySelectorAll("a#" + N + "+*").length || J.push(".#.+[+~]")
            }), e(function(a) {
                var b = d.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name" + ca + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
            })), (v.matchesSelector = ra.test(L = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function(a) {
                v.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", ga)
            }), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), b = ra.test(H.compareDocumentPosition), M = b || ra.test(H.contains) ? function(a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a,
                    d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            } : function(a, b) {
                if (b)
                    for (; b = b.parentNode;)
                        if (b === a)
                            return !0;
                return !1
            }, U = b ? function(a, b) {
                if (a === b)
                    return E = !0, 0;
                var c = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return c ? c : (c = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & c || !v.sortDetached && b.compareDocumentPosition(a) === c ? a === d || a.ownerDocument === O && M(O, a) ? -1 : b === d || b.ownerDocument === O && M(O, b) ? 1 : D ? aa(D, a) - aa(D, b) : 0 : 4 & c ? -1 : 1)
            } : function(a, b) {
                if (a === b)
                    return E = !0, 0;
                var c,
                    e = 0,
                    f = a.parentNode,
                    h = b.parentNode,
                    i = [a],
                    j = [b];
                if (!f || !h)
                    return a === d ? -1 : b === d ? 1 : f ? -1 : h ? 1 : D ? aa(D, a) - aa(D, b) : 0;
                if (f === h)
                    return g(a, b);
                for (c = a; c = c.parentNode;)
                    i.unshift(c);
                for (c = b; c = c.parentNode;)
                    j.unshift(c);
                for (; i[e] === j[e];)
                    e++;
                return e ? g(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
            }, d) : G
        }, b.matches = function(a, c) {
            return b(a, null, null, c)
        }, b.matchesSelector = function(a, c) {
            if ((a.ownerDocument || a) !== G && F(a), c = c.replace(la, "='$1']"), !(!v.matchesSelector || !I || K && K.test(c) || J && J.test(c)))
                try {
                    var d = L.call(a, c);
                    if (d || v.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                        return d
                } catch (a) {}
            return b(c, G, null, [a]).length > 0
        }, b.contains = function(a, b) {
            return (a.ownerDocument || a) !== G && F(a), M(a, b)
        }, b.attr = function(a, b) {
            (a.ownerDocument || a) !== G && F(a);
            var c = w.attrHandle[b.toLowerCase()],
                d = c && W.call(w.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
            return void 0 !== d ? d : v.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }, b.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, b.uniqueSort = function(a) {
            var b,
                c = [],
                d = 0,
                e = 0;
            if (E = !v.detectDuplicates, D = !v.sortStable && a.slice(0), a.sort(U), E) {
                for (; b = a[e++];)
                    b === a[e] && (d = c.push(e));
                for (; d--;)
                    a.splice(c[d], 1)
            }
            return D = null, a
        }, x = b.getText = function(a) {
            var b,
                c = "",
                d = 0,
                e = a.nodeType;
            if (e) {
                if (1 === e || 9 === e || 11 === e) {
                    if ("string" == typeof a.textContent)
                        return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)
                        c += x(a)
                } else if (3 === e || 4 === e)
                    return a.nodeValue
            } else
                for (; b = a[d++];)
                    c += x(b);
            return c
        }, w = b.selectors = {
            cacheLength: 50,
            createPseudo: d,
            match: oa,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(va, wa), a[3] = (a[3] || a[4] || a[5] || "").replace(va, wa), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
                },
                PSEUDO: function(a) {
                    var b,
                        c = !a[6] && a[2];
                    return oa.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && ma.test(c) && (b = z(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(va, wa).toLowerCase();
                    return "*" === a ? function() {
                        return !0
                    } : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function(a) {
                    var b = R[a + " "];
                    return b || (b = new RegExp("(^|" + ca + ")" + a + "(" + ca + "|$)")) && R(a, function(a) {
                            return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                        })
                },
                ATTR: function(a, c, d) {
                    return function(e) {
                        var f = b.attr(e, a);
                        return null == f ? "!=" === c : !c || (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f.replace(ha, " ") + " ").indexOf(d) > -1 : "|=" === c && (f === d || f.slice(0, d.length + 1) === d + "-"))
                    }
                },
                CHILD: function(a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3),
                        g = "last" !== a.slice(-4),
                        h = "of-type" === b;
                    return 1 === d && 0 === e ? function(a) {
                        return !!a.parentNode
                    } : function(b, c, i) {
                        var j,
                            k,
                            l,
                            m,
                            n,
                            o,
                            p = f !== g ? "nextSibling" : "previousSibling",
                            q = b.parentNode,
                            r = h && b.nodeName.toLowerCase(),
                            s = !i && !h;
                        if (q) {
                            if (f) {
                                for (; p;) {
                                    for (l = b; l = l[p];)
                                        if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)
                                            return !1;
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop();)
                                    if (1 === l.nodeType && ++m && l === b) {
                                        k[a] = [P, n, m];
                                        break
                                    }
                            } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P)
                                m = j[1];
                            else
                                for (; (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b));)
                                    ;
                            return m -= e, m === d || m % d === 0 && m / d >= 0
                        }
                    }
                },
                PSEUDO: function(a, c) {
                    var e,
                        f = w.pseudos[a] || w.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                    return f[N] ? f(c) : f.length > 1 ? (e = [a, a, "", c], w.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                        for (var d, e = f(a, c), g = e.length; g--;)
                            d = aa(a, e[g]), a[d] = !(b[d] = e[g])
                    }) : function(a) {
                        return f(a, 0, e)
                    }) : f
                }
            },
            pseudos: {
                not: d(function(a) {
                    var b = [],
                        c = [],
                        e = A(a.replace(ia, "$1"));
                    return e[N] ? d(function(a, b, c, d) {
                        for (var f, g = e(a, null, d, []), h = a.length; h--;)
                            (f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function(a, d, f) {
                        return b[0] = a, e(b, null, f, c), b[0] = null, !c.pop()
                    }
                }),
                has: d(function(a) {
                    return function(c) {
                        return b(a, c).length > 0
                    }
                }),
                contains: d(function(a) {
                    return a = a.replace(va, wa), function(b) {
                        return (b.textContent || b.innerText || x(b)).indexOf(a) > -1
                    }
                }),
                lang: d(function(a) {
                    return na.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(va, wa).toLowerCase(), function(b) {
                        var c;
                        do if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                            return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
                        while ((b = b.parentNode) && 1 === b.nodeType);
                        return !1
                    }
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function(a) {
                    return a === H
                },
                focus: function(a) {
                    return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: function(a) {
                    return a.disabled === !1
                },
                disabled: function(a) {
                    return a.disabled === !0
                },
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (a.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(a) {
                    return !w.pseudos.empty(a)
                },
                header: function(a) {
                    return qa.test(a.nodeName)
                },
                input: function(a) {
                    return pa.test(a.nodeName)
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: j(function() {
                    return [0]
                }),
                last: j(function(a, b) {
                    return [b - 1]
                }),
                eq: j(function(a, b, c) {
                    return [0 > c ? c + b : c]
                }),
                even: j(function(a, b) {
                    for (var c = 0; b > c; c += 2)
                        a.push(c);
                    return a
                }),
                odd: j(function(a, b) {
                    for (var c = 1; b > c; c += 2)
                        a.push(c);
                    return a
                }),
                lt: j(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; --d >= 0;)
                        a.push(d);
                    return a
                }),
                gt: j(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; ++d < b;)
                        a.push(d);
                    return a
                })
            }
        }, w.pseudos.nth = w.pseudos.eq;
        for (u in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            w.pseudos[u] = h(u);
        for (u in {
            submit: !0,
            reset: !0
        })
            w.pseudos[u] = i(u);
        return l.prototype = w.filters = w.pseudos, w.setFilters = new l, z = b.tokenize = function(a, c) {
            var d,
                e,
                f,
                g,
                h,
                i,
                j,
                k = S[a + " "];
            if (k)
                return c ? 0 : k.slice(0);
            for (h = a, i = [], j = w.preFilter; h;) {
                (!d || (e = ja.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = ka.exec(h)) && (d = e.shift(), f.push({
                    value: d,
                    type: e[0].replace(ia, " ")
                }), h = h.slice(d.length));
                for (g in w.filter)
                    !(e = oa[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
                        value: d,
                        type: g,
                        matches: e
                    }), h = h.slice(d.length));
                if (!d)
                    break
            }
            return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
        }, A = b.compile = function(a, b) {
            var c,
                d = [],
                e = [],
                f = T[a + " "];
            if (!f) {
                for (b || (b = z(a)), c = b.length; c--;)
                    f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                f = T(a, t(e, d)), f.selector = a
            }
            return f
        }, B = b.select = function(a, b, c, d) {
            var e,
                f,
                g,
                h,
                i,
                j = "function" == typeof a && a,
                l = !d && z(a = j.selector || a);
            if (c = c || [], 1 === l.length) {
                if (f = l[0] = l[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && v.getById && 9 === b.nodeType && I && w.relative[f[1].type]) {
                    if (b = (w.find.ID(g.matches[0].replace(va, wa), b) || [])[0], !b)
                        return c;
                    j && (b = b.parentNode), a = a.slice(f.shift().value.length)
                }
                for (e = oa.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !w.relative[h = g.type]);)
                    if ((i = w.find[h]) && (d = i(g.matches[0].replace(va, wa), ta.test(f[0].type) && k(b.parentNode) || b))) {
                        if (f.splice(e, 1), a = d.length && m(f), !a)
                            return $.apply(c, d), c;
                        break
                    }
            }
            return (j || A(a, l))(d, b, !I, c, ta.test(a) && k(b.parentNode) || b), c
        }, v.sortStable = N.split("").sort(U).join("") === N, v.detectDuplicates = !!E, F(), v.sortDetached = e(function(a) {
            return 1 & a.compareDocumentPosition(G.createElement("div"))
        }), e(function(a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
        }) || f("type|href|height|width", function(a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }), v.attributes && e(function(a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
        }) || f("value", function(a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
        }), e(function(a) {
            return null == a.getAttribute("disabled")
        }) || f(ba, function(a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }), b
    }(a);
    ea.find = ja, ea.expr = ja.selectors, ea.expr[":"] = ea.expr.pseudos, ea.unique = ja.uniqueSort, ea.text = ja.getText, ea.isXMLDoc = ja.isXML, ea.contains = ja.contains;
    var ka = ea.expr.match.needsContext,
        la = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        ma = /^.[^:#\[\.,]*$/;
    ea.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? ea.find.matchesSelector(d, a) ? [d] : [] : ea.find.matches(a, ea.grep(b, function(a) {
            return 1 === a.nodeType
        }))
    }, ea.fn.extend({
        find: function(a) {
            var b,
                c = [],
                d = this,
                e = d.length;
            if ("string" != typeof a)
                return this.pushStack(ea(a).filter(function() {
                    for (b = 0; e > b; b++)
                        if (ea.contains(d[b], this))
                            return !0
                }));
            for (b = 0; e > b; b++)
                ea.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? ea.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
        },
        filter: function(a) {
            return this.pushStack(d(this, a || [], !1))
        },
        not: function(a) {
            return this.pushStack(d(this, a || [], !0))
        },
        is: function(a) {
            return !!d(this, "string" == typeof a && ka.test(a) ? ea(a) : a || [], !1).length
        }
    });
    var na,
        oa = a.document,
        pa = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        qa = ea.fn.init = function(a, b) {
            var c,
                d;
            if (!a)
                return this;
            if ("string" == typeof a) {
                if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : pa.exec(a), !c || !c[1] && b)
                    return !b || b.jquery ? (b || na).find(a) : this.constructor(b).find(a);
                if (c[1]) {
                    if (b = b instanceof ea ? b[0] : b, ea.merge(this, ea.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : oa, !0)), la.test(c[1]) && ea.isPlainObject(b))
                        for (c in b)
                            ea.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                    return this
                }
                if (d = oa.getElementById(c[2]), d && d.parentNode) {
                    if (d.id !== c[2])
                        return na.find(a);
                    this.length = 1, this[0] = d
                }
                return this.context = oa, this.selector = a, this
            }
            return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : ea.isFunction(a) ? "undefined" != typeof na.ready ? na.ready(a) : a(ea) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), ea.makeArray(a, this))
        };
    qa.prototype = ea.fn, na = ea(oa);
    var ra = /^(?:parents|prev(?:Until|All))/,
        sa = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    ea.extend({
        dir: function(a, b, c) {
            for (var d = [], e = a[b]; e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !ea(e).is(c));)
                1 === e.nodeType && d.push(e), e = e[b];
            return d
        },
        sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling)
                1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    }), ea.fn.extend({
        has: function(a) {
            var b,
                c = ea(a, this),
                d = c.length;
            return this.filter(function() {
                for (b = 0; d > b; b++)
                    if (ea.contains(this, c[b]))
                        return !0
            })
        },
        closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = ka.test(a) || "string" != typeof a ? ea(a, b || this.context) : 0; e > d; d++)
                for (c = this[d]; c && c !== b; c = c.parentNode)
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && ea.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
            return this.pushStack(f.length > 1 ? ea.unique(f) : f)
        },
        index: function(a) {
            return a ? "string" == typeof a ? ea.inArray(this[0], ea(a)) : ea.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, b) {
            return this.pushStack(ea.unique(ea.merge(this.get(), ea(a, b))))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    }), ea.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return ea.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return ea.dir(a, "parentNode", c)
        },
        next: function(a) {
            return e(a, "nextSibling")
        },
        prev: function(a) {
            return e(a, "previousSibling")
        },
        nextAll: function(a) {
            return ea.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return ea.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return ea.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return ea.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return ea.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return ea.sibling(a.firstChild)
        },
        contents: function(a) {
            return ea.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : ea.merge([], a.childNodes)
        }
    }, function(a, b) {
        ea.fn[a] = function(c, d) {
            var e = ea.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = ea.filter(d, e)), this.length > 1 && (sa[a] || (e = ea.unique(e)), ra.test(a) && (e = e.reverse())), this.pushStack(e)
        }
    });
    var ta = /\S+/g,
        ua = {};
    ea.Callbacks = function(a) {
        a = "string" == typeof a ? ua[a] || f(a) : ea.extend({}, a);
        var b,
            c,
            d,
            e,
            g,
            h,
            i = [],
            j = !a.once && [],
            k = function(f) {
                for (c = a.memory && f, d = !0, g = h || 0, h = 0, e = i.length, b = !0; i && e > g; g++)
                    if (i[g].apply(f[0], f[1]) === !1 && a.stopOnFalse) {
                        c = !1;
                        break
                    }
                b = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable())
            },
            l = {
                add: function() {
                    if (i) {
                        var d = i.length;
                        !function b(c) {
                            ea.each(c, function(c, d) {
                                var e = ea.type(d);
                                "function" === e ? a.unique && l.has(d) || i.push(d) : d && d.length && "string" !== e && b(d)
                            })
                        }(arguments), b ? e = i.length : c && (h = d, k(c))
                    }
                    return this
                },
                remove: function() {
                    return i && ea.each(arguments, function(a, c) {
                        for (var d; (d = ea.inArray(c, i, d)) > -1;)
                            i.splice(d, 1), b && (e >= d && e--, g >= d && g--)
                    }), this
                },
                has: function(a) {
                    return a ? ea.inArray(a, i) > -1 : !(!i || !i.length)
                },
                empty: function() {
                    return i = [], e = 0, this
                },
                disable: function() {
                    return i = j = c = void 0, this
                },
                disabled: function() {
                    return !i
                },
                lock: function() {
                    return j = void 0, c || l.disable(), this
                },
                locked: function() {
                    return !j
                },
                fireWith: function(a, c) {
                    return !i || d && !j || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? j.push(c) : k(c)), this
                },
                fire: function() {
                    return l.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!d
                }
            };
        return l
    }, ea.extend({
        Deferred: function(a) {
            var b = [["resolve", "done", ea.Callbacks("once memory"), "resolved"], ["reject", "fail", ea.Callbacks("once memory"), "rejected"], ["notify", "progress", ea.Callbacks("memory")]],
                c = "pending",
                d = {
                    state: function() {
                        return c
                    },
                    always: function() {
                        return e.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var a = arguments;
                        return ea.Deferred(function(c) {
                            ea.each(b, function(b, f) {
                                var g = ea.isFunction(a[b]) && a[b];
                                e[f[1]](function() {
                                    var a = g && g.apply(this, arguments);
                                    a && ea.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                })
                            }), a = null
                        }).promise()
                    },
                    promise: function(a) {
                        return null != a ? ea.extend(a, d) : d
                    }
                },
                e = {};
            return d.pipe = d.then, ea.each(b, function(a, f) {
                var g = f[2],
                    h = f[3];
                d[f[1]] = g.add, h && g.add(function() {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this
                }, e[f[0] + "With"] = g.fireWith
            }), d.promise(e), a && a.call(e, e), e
        },
        when: function(a) {
            var b,
                c,
                d,
                e = 0,
                f = X.call(arguments),
                g = f.length,
                h = 1 !== g || a && ea.isFunction(a.promise) ? g : 0,
                i = 1 === h ? a : ea.Deferred(),
                j = function(a, c, d) {
                    return function(e) {
                        c[a] = this, d[a] = arguments.length > 1 ? X.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                    }
                };
            if (g > 1)
                for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++)
                    f[e] && ea.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
            return h || i.resolveWith(d, f), i.promise()
        }
    });
    var va;
    ea.fn.ready = function(a) {
        return ea.ready.promise().done(a), this
    }, ea.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? ea.readyWait++ : ea.ready(!0)
        },
        ready: function(a) {
            if (a === !0 ? !--ea.readyWait : !ea.isReady) {
                if (!oa.body)
                    return setTimeout(ea.ready);
                ea.isReady = !0, a !== !0 && --ea.readyWait > 0 || (va.resolveWith(oa, [ea]), ea.fn.triggerHandler && (ea(oa).triggerHandler("ready"), ea(oa).off("ready")))
            }
        }
    }), ea.ready.promise = function(b) {
        if (!va)
            if (va = ea.Deferred(), "complete" === oa.readyState)
                setTimeout(ea.ready);
            else if (oa.addEventListener)
                oa.addEventListener("DOMContentLoaded", h, !1), a.addEventListener("load", h, !1);
            else {
                oa.attachEvent("onreadystatechange", h), a.attachEvent("onload", h);
                var c = !1;
                try {
                    c = null == a.frameElement && oa.documentElement
                } catch (a) {}
                c && c.doScroll && !function a() {
                    if (!ea.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (b) {
                            return setTimeout(a, 50)
                        }
                        g(), ea.ready()
                    }
                }()
            }
        return va.promise(b)
    };
    var wa,
        xa = "undefined";
    for (wa in ea(ca))
        break;
    ca.ownLast = "0" !== wa, ca.inlineBlockNeedsLayout = !1, ea(function() {
        var a,
            b,
            c,
            d;
        c = oa.getElementsByTagName("body")[0], c && c.style && (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== xa && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", ca.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d))
    }), function() {
        var a = oa.createElement("div");
        if (null == ca.deleteExpando) {
            ca.deleteExpando = !0;
            try {
                delete a.test
            } catch (a) {
                ca.deleteExpando = !1
            }
        }
        a = null
    }(), ea.acceptData = function(a) {
        var b = ea.noData[(a.nodeName + " ").toLowerCase()],
            c = +a.nodeType || 1;
        return (1 === c || 9 === c) && (!b || b !== !0 && a.getAttribute("classid") === b)
    };
    var ya = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        za = /([A-Z])/g;
    ea.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? ea.cache[a[ea.expando]] : a[ea.expando], !!a && !j(a)
        },
        data: function(a, b, c) {
            return k(a, b, c)
        },
        removeData: function(a, b) {
            return l(a, b)
        },
        _data: function(a, b, c) {
            return k(a, b, c, !0)
        },
        _removeData: function(a, b) {
            return l(a, b, !0)
        }
    }), ea.fn.extend({
        data: function(a, b) {
            var c,
                d,
                e,
                f = this[0],
                g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = ea.data(f), 1 === f.nodeType && !ea._data(f, "parsedAttrs"))) {
                    for (c = g.length; c--;)
                        g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = ea.camelCase(d.slice(5)), i(f, d, e[d])));
                    ea._data(f, "parsedAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function() {
                ea.data(this, a)
            }) : arguments.length > 1 ? this.each(function() {
                ea.data(this, a, b)
            }) : f ? i(f, a, ea.data(f, a)) : void 0
        },
        removeData: function(a) {
            return this.each(function() {
                ea.removeData(this, a)
            })
        }
    }), ea.extend({
        queue: function(a, b, c) {
            var d;
            return a ? (b = (b || "fx") + "queue", d = ea._data(a, b), c && (!d || ea.isArray(c) ? d = ea._data(a, b, ea.makeArray(c)) : d.push(c)), d || []) : void 0
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = ea.queue(a, b),
                d = c.length,
                e = c.shift(),
                f = ea._queueHooks(a, b),
                g = function() {
                    ea.dequeue(a, b)
                };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return ea._data(a, c) || ea._data(a, c, {
                    empty: ea.Callbacks("once memory").add(function() {
                        ea._removeData(a, b + "queue"), ea._removeData(a, c)
                    })
                })
        }
    }), ea.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? ea.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = ea.queue(this, a, b);
                ea._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && ea.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                ea.dequeue(this, a)
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, b) {
            var c,
                d = 1,
                e = ea.Deferred(),
                f = this,
                g = this.length,
                h = function() {
                    --d || e.resolveWith(f, [f])
                };
            for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--;)
                c = ea._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
            return h(), e.promise(b)
        }
    });
    var Aa = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Ba = ["Top", "Right", "Bottom", "Left"],
        Ca = function(a, b) {
            return a = b || a, "none" === ea.css(a, "display") || !ea.contains(a.ownerDocument, a)
        },
        Da = ea.access = function(a, b, c, d, e, f, g) {
            var h = 0,
                i = a.length,
                j = null == c;
            if ("object" === ea.type(c)) {
                e = !0;
                for (h in c)
                    ea.access(a, b, h, c[h], !0, f, g)
            } else if (void 0 !== d && (e = !0, ea.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function(a, b, c) {
                return j.call(ea(a), c)
            })), b))
                for (; i > h; h++)
                    b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
            return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
        },
        Ea = /^(?:checkbox|radio)$/i;
    !function() {
        var a = oa.createElement("input"),
            b = oa.createElement("div"),
            c = oa.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", ca.leadingWhitespace = 3 === b.firstChild.nodeType, ca.tbody = !b.getElementsByTagName("tbody").length, ca.htmlSerialize = !!b.getElementsByTagName("link").length, ca.html5Clone = "<:nav></:nav>" !== oa.createElement("nav").cloneNode(!0).outerHTML, a.type = "checkbox", a.checked = !0, c.appendChild(a), ca.appendChecked = a.checked, b.innerHTML = "<textarea>x</textarea>", ca.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", ca.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, ca.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function() {
            ca.noCloneEvent = !1
        }), b.cloneNode(!0).click()), null == ca.deleteExpando) {
            ca.deleteExpando = !0;
            try {
                delete b.test
            } catch (a) {
                ca.deleteExpando = !1
            }
        }
    }(), function() {
        var b,
            c,
            d = oa.createElement("div");
        for (b in {
            submit: !0,
            change: !0,
            focusin: !0
        })
            c = "on" + b, (ca[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), ca[b + "Bubbles"] = d.attributes[c].expando === !1);
        d = null
    }();
    var Fa = /^(?:input|select|textarea)$/i,
        Ga = /^key/,
        Ha = /^(?:mouse|pointer|contextmenu)|click/,
        Ia = /^(?:focusinfocus|focusoutblur)$/,
        Ja = /^([^.]*)(?:\.(.+)|)$/;
    ea.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f,
                g,
                h,
                i,
                j,
                k,
                l,
                m,
                n,
                o,
                p,
                q = ea._data(a);
            if (q) {
                for (c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = ea.guid++), (g = q.events) || (g = q.events = {}), (k = q.handle) || (k = q.handle = function(a) {
                    return typeof ea === xa || a && ea.event.triggered === a.type ? void 0 : ea.event.dispatch.apply(k.elem, arguments)
                }, k.elem = a), b = (b || "").match(ta) || [""], h = b.length; h--;)
                    f = Ja.exec(b[h]) || [], n = p = f[1], o = (f[2] || "").split(".").sort(), n && (j = ea.event.special[n] || {}, n = (e ? j.delegateType : j.bindType) || n, j = ea.event.special[n] || {}, l = ea.extend({
                        type: n,
                        origType: p,
                        data: d,
                        handler: c,
                        guid: c.guid,
                        selector: e,
                        needsContext: e && ea.expr.match.needsContext.test(e),
                        namespace: o.join(".")
                    }, i), (m = g[n]) || (m = g[n] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, o, k) !== !1 || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), ea.event.global[n] = !0);
                a = null
            }
        },
        remove: function(a, b, c, d, e) {
            var f,
                g,
                h,
                i,
                j,
                k,
                l,
                m,
                n,
                o,
                p,
                q = ea.hasData(a) && ea._data(a);
            if (q && (k = q.events)) {
                for (b = (b || "").match(ta) || [""], j = b.length; j--;)
                    if (h = Ja.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                        for (l = ea.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = k[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length; f--;)
                            g = m[f], !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                        i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || ea.removeEvent(a, n, q.handle), delete k[n])
                    } else
                        for (n in k)
                            ea.event.remove(a, n + b[j], c, d, !0);
                ea.isEmptyObject(k) && (delete q.handle, ea._removeData(a, "events"))
            }
        },
        trigger: function(b, c, d, e) {
            var f,
                g,
                h,
                i,
                j,
                k,
                l,
                m = [d || oa],
                n = ba.call(b, "type") ? b.type : b,
                o = ba.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = k = d = d || oa, 3 !== d.nodeType && 8 !== d.nodeType && !Ia.test(n + ea.event.triggered) && (n.indexOf(".") >= 0 && (o = n.split("."), n = o.shift(), o.sort()), g = n.indexOf(":") < 0 && "on" + n, b = b[ea.expando] ? b : new ea.Event(n, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = o.join("."),
            b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : ea.makeArray(c, [b]), j = ea.event.special[n] || {}, e || !j.trigger || j.trigger.apply(d, c) !== !1)) {
                if (!e && !j.noBubble && !ea.isWindow(d)) {
                    for (i = j.delegateType || n, Ia.test(i + n) || (h = h.parentNode); h; h = h.parentNode)
                        m.push(h), k = h;
                    k === (d.ownerDocument || oa) && m.push(k.defaultView || k.parentWindow || a)
                }
                for (l = 0; (h = m[l++]) && !b.isPropagationStopped();)
                    b.type = l > 1 ? i : j.bindType || n, f = (ea._data(h, "events") || {})[b.type] && ea._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && ea.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                if (b.type = n, !e && !b.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && ea.acceptData(d) && g && d[n] && !ea.isWindow(d)) {
                    k = d[g], k && (d[g] = null), ea.event.triggered = n;
                    try {
                        d[n]()
                    } catch (a) {}
                    ea.event.triggered = void 0, k && (d[g] = k)
                }
                return b.result
            }
        },
        dispatch: function(a) {
            a = ea.event.fix(a);
            var b,
                c,
                d,
                e,
                f,
                g = [],
                h = X.call(arguments),
                i = (ea._data(this, "events") || {})[a.type] || [],
                j = ea.event.special[a.type] || {};
            if (h[0] = a, a.delegateTarget = this, !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                for (g = ea.event.handlers.call(this, a, i), b = 0; (e = g[b++]) && !a.isPropagationStopped();)
                    for (a.currentTarget = e.elem, f = 0; (d = e.handlers[f++]) && !a.isImmediatePropagationStopped();)
                        (!a.namespace_re || a.namespace_re.test(d.namespace)) && (a.handleObj = d, a.data = d.data, c = ((ea.event.special[d.origType] || {}).handle || d.handler).apply(e.elem, h), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()));
                return j.postDispatch && j.postDispatch.call(this, a), a.result
            }
        },
        handlers: function(a, b) {
            var c,
                d,
                e,
                f,
                g = [],
                h = b.delegateCount,
                i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type))
                for (; i != this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (e = [], f = 0; h > f; f++)
                            d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? ea(c, this).index(i) >= 0 : ea.find(c, this, null, [i]).length), e[c] && e.push(d);
                        e.length && g.push({
                            elem: i,
                            handlers: e
                        })
                    }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }), g
        },
        fix: function(a) {
            if (a[ea.expando])
                return a;
            var b,
                c,
                d,
                e = a.type,
                f = a,
                g = this.fixHooks[e];
            for (g || (this.fixHooks[e] = g = Ha.test(e) ? this.mouseHooks : Ga.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new ea.Event(f), b = d.length; b--;)
                c = d[b], a[c] = f[c];
            return a.target || (a.target = f.srcElement || oa), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c,
                    d,
                    e,
                    f = b.button,
                    g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || oa, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== o() && this.focus)
                        try {
                            return this.focus(), !1
                        } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === o() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return ea.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(a) {
                    return ea.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = ea.extend(new ea.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? ea.event.trigger(e, null, b) : ea.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }
    }, ea.removeEvent = oa.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function(a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] === xa && (a[d] = null), a.detachEvent(d, c))
    }, ea.Event = function(a, b) {
        return this instanceof ea.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? m : n) : this.type = a, b && ea.extend(this, b), this.timeStamp = a && a.timeStamp || ea.now(), void (this[ea.expando] = !0)) : new ea.Event(a, b)
    }, ea.Event.prototype = {
        isDefaultPrevented: n,
        isPropagationStopped: n,
        isImmediatePropagationStopped: n,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = m, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = m, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = m, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
        }
    }, ea.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(a, b) {
        ea.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c,
                    d = this,
                    e = a.relatedTarget,
                    f = a.handleObj;
                return (!e || e !== d && !ea.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
            }
        }
    }), ca.submitBubbles || (ea.event.special.submit = {
        setup: function() {
            return !ea.nodeName(this, "form") && void ea.event.add(this, "click._submit keypress._submit", function(a) {
                    var b = a.target,
                        c = ea.nodeName(b, "input") || ea.nodeName(b, "button") ? b.form : void 0;
                    c && !ea._data(c, "submitBubbles") && (ea.event.add(c, "submit._submit", function(a) {
                        a._submit_bubble = !0
                    }), ea._data(c, "submitBubbles", !0))
                })
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && ea.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function() {
            return !ea.nodeName(this, "form") && void ea.event.remove(this, "._submit")
        }
    }), ca.changeBubbles || (ea.event.special.change = {
        setup: function() {
            return Fa.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ea.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }), ea.event.add(this, "click._change", function(a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1), ea.event.simulate("change", this, a, !0)
            })), !1) : void ea.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                Fa.test(b.nodeName) && !ea._data(b, "changeBubbles") && (ea.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || ea.event.simulate("change", this.parentNode, a, !0)
                }), ea._data(b, "changeBubbles", !0))
            })
        },
        handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return ea.event.remove(this, "._change"), !Fa.test(this.nodeName)
        }
    }), ca.focusinBubbles || ea.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            ea.event.simulate(b, a.target, ea.event.fix(a), !0)
        };
        ea.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this,
                    e = ea._data(d, b);
                e || d.addEventListener(a, c, !0), ea._data(d, b, (e || 0) + 1)
            },
            teardown: function() {
                var d = this.ownerDocument || this,
                    e = ea._data(d, b) - 1;
                e ? ea._data(d, b, e) : (d.removeEventListener(a, c, !0), ea._removeData(d, b))
            }
        }
    }), ea.fn.extend({
        on: function(a, b, c, d, e) {
            var f,
                g;
            if ("object" == typeof a) {
                "string" != typeof b && (c = c || b, b = void 0);
                for (f in a)
                    this.on(f, b, c, a[f], e);
                return this
            }
            if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1)
                d = n;
            else if (!d)
                return this;
            return 1 === e && (g = d, d = function(a) {
                return ea().off(a), g.apply(this, arguments)
            }, d.guid = g.guid || (g.guid = ea.guid++)), this.each(function() {
                ea.event.add(this, a, d, c, b)
            })
        },
        one: function(a, b, c, d) {
            return this.on(a, b, c, d, 1)
        },
        off: function(a, b, c) {
            var d,
                e;
            if (a && a.preventDefault && a.handleObj)
                return d = a.handleObj, ea(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
            if ("object" == typeof a) {
                for (e in a)
                    this.off(e, b, a[e]);
                return this
            }
            return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = n), this.each(function() {
                ea.event.remove(this, a, c, b)
            })
        },
        trigger: function(a, b) {
            return this.each(function() {
                ea.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            return c ? ea.event.trigger(a, b, c, !0) : void 0
        }
    });
    var Ka = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        La = / jQuery\d+="(?:null|\d+)"/g,
        Ma = new RegExp("<(?:" + Ka + ")[\\s/>]", "i"),
        Na = /^\s+/,
        Oa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Pa = /<([\w:]+)/,
        Qa = /<tbody/i,
        Ra = /<|&#?\w+;/,
        Sa = /<(?:script|style|link)/i,
        Ta = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Ua = /^$|\/(?:java|ecma)script/i,
        Va = /^true\/(.*)/,
        Wa = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Xa = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: ca.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        Ya = p(oa),
        Za = Ya.appendChild(oa.createElement("div"));
    Xa.optgroup = Xa.option, Xa.tbody = Xa.tfoot = Xa.colgroup = Xa.caption = Xa.thead, Xa.th = Xa.td, ea.extend({
        clone: function(a, b, c) {
            var d,
                e,
                f,
                g,
                h,
                i = ea.contains(a.ownerDocument, a);
            if (ca.html5Clone || ea.isXMLDoc(a) || !Ma.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (Za.innerHTML = a.outerHTML, Za.removeChild(f = Za.firstChild)), !(ca.noCloneEvent && ca.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || ea.isXMLDoc(a)))
                for (d = q(f), h = q(a), g = 0; null != (e = h[g]); ++g)
                    d[g] && x(e, d[g]);
            if (b)
                if (c)
                    for (h = h || q(a), d = d || q(f), g = 0; null != (e = h[g]); g++)
                        w(e, d[g]);
                else
                    w(a, f);
            return d = q(f, "script"), d.length > 0 && v(d, !i && q(a, "script")), d = h = e = null, f
        },
        buildFragment: function(a, b, c, d) {
            for (var e, f, g, h, i, j, k, l = a.length, m = p(b), n = [], o = 0; l > o; o++)
                if (f = a[o], f || 0 === f)
                    if ("object" === ea.type(f))
                        ea.merge(n, f.nodeType ? [f] : f);
                    else if (Ra.test(f)) {
                        for (h = h || m.appendChild(b.createElement("div")), i = (Pa.exec(f) || ["", ""])[1].toLowerCase(), k = Xa[i] || Xa._default, h.innerHTML = k[1] + f.replace(Oa, "<$1></$2>") + k[2], e = k[0]; e--;)
                            h = h.lastChild;
                        if (!ca.leadingWhitespace && Na.test(f) && n.push(b.createTextNode(Na.exec(f)[0])), !ca.tbody)
                            for (f = "table" !== i || Qa.test(f) ? "<table>" !== k[1] || Qa.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length; e--;)
                                ea.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                        for (ea.merge(n, h.childNodes), h.textContent = ""; h.firstChild;)
                            h.removeChild(h.firstChild);
                        h = m.lastChild
                    } else
                        n.push(b.createTextNode(f));
            for (h && m.removeChild(h), ca.appendChecked || ea.grep(q(n, "input"), r), o = 0; f = n[o++];)
                if ((!d || -1 === ea.inArray(f, d)) && (g = ea.contains(f.ownerDocument, f), h = q(m.appendChild(f), "script"), g && v(h), c))
                    for (e = 0; f = h[e++];)
                        Ua.test(f.type || "") && c.push(f);
            return h = null, m
        },
        cleanData: function(a, b) {
            for (var c, d, e, f, g = 0, h = ea.expando, i = ea.cache, j = ca.deleteExpando, k = ea.event.special; null != (c = a[g]); g++)
                if ((b || ea.acceptData(c)) && (e = c[h], f = e && i[e])) {
                    if (f.events)
                        for (d in f.events)
                            k[d] ? ea.event.remove(c, d) : ea.removeEvent(c, d, f.handle);
                    i[e] && (delete i[e], j ? delete c[h] : typeof c.removeAttribute !== xa ? c.removeAttribute(h) : c[h] = null, W.push(e))
                }
        }
    }), ea.fn.extend({
        text: function(a) {
            return Da(this, function(a) {
                return void 0 === a ? ea.text(this) : this.empty().append((this[0] && this[0].ownerDocument || oa).createTextNode(a))
            }, null, a, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = s(this, a);
                    b.appendChild(a)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = s(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        remove: function(a, b) {
            for (var c, d = a ? ea.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
                b || 1 !== c.nodeType || ea.cleanData(q(c)), c.parentNode && (b && ea.contains(c.ownerDocument, c) && v(q(c, "script")), c.parentNode.removeChild(c));
            return this
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) {
                for (1 === a.nodeType && ea.cleanData(q(a, !1)); a.firstChild;)
                    a.removeChild(a.firstChild);
                a.options && ea.nodeName(a, "select") && (a.options.length = 0)
            }
            return this
        },
        clone: function(a, b) {
            return a = null != a && a, b = null == b ? a : b, this.map(function() {
                return ea.clone(this, a, b)
            })
        },
        html: function(a) {
            return Da(this, function(a) {
                var b = this[0] || {},
                    c = 0,
                    d = this.length;
                if (void 0 === a)
                    return 1 === b.nodeType ? b.innerHTML.replace(La, "") : void 0;
                if (!("string" != typeof a || Sa.test(a) || !ca.htmlSerialize && Ma.test(a) || !ca.leadingWhitespace && Na.test(a) || Xa[(Pa.exec(a) || ["", ""])[1].toLowerCase()])) {
                    a = a.replace(Oa, "<$1></$2>");
                    try {
                        for (; d > c; c++)
                            b = this[c] || {}, 1 === b.nodeType && (ea.cleanData(q(b, !1)), b.innerHTML = a);
                        b = 0
                    } catch (a) {}
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a = arguments[0];
            return this.domManip(arguments, function(b) {
                a = this.parentNode, ea.cleanData(q(this)), a && a.replaceChild(b, this)
            }), a && (a.length || a.nodeType) ? this : this.remove()
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, b) {
            a = Y.apply([], a);
            var c,
                d,
                e,
                f,
                g,
                h,
                i = 0,
                j = this.length,
                k = this,
                l = j - 1,
                m = a[0],
                n = ea.isFunction(m);
            if (n || j > 1 && "string" == typeof m && !ca.checkClone && Ta.test(m))
                return this.each(function(c) {
                    var d = k.eq(c);
                    n && (a[0] = m.call(this, c, d.html())), d.domManip(a, b)
                });
            if (j && (h = ea.buildFragment(a, this[0].ownerDocument, !1, this), c = h.firstChild, 1 === h.childNodes.length && (h = c), c)) {
                for (f = ea.map(q(h, "script"), t), e = f.length; j > i; i++)
                    d = h, i !== l && (d = ea.clone(d, !0, !0), e && ea.merge(f, q(d, "script"))), b.call(this[i], d, i);
                if (e)
                    for (g = f[f.length - 1].ownerDocument, ea.map(f, u), i = 0; e > i; i++)
                        d = f[i], Ua.test(d.type || "") && !ea._data(d, "globalEval") && ea.contains(g, d) && (d.src ? ea._evalUrl && ea._evalUrl(d.src) : ea.globalEval((d.text || d.textContent || d.innerHTML || "").replace(Wa, "")));
                h = c = null
            }
            return this
        }
    }), ea.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        ea.fn[a] = function(a) {
            for (var c, d = 0, e = [], f = ea(a), g = f.length - 1; g >= d; d++)
                c = d === g ? this : this.clone(!0), ea(f[d])[b](c), Z.apply(e, c.get());
            return this.pushStack(e)
        }
    });
    var $a,
        _a = {};
    !function() {
        var a;
        ca.shrinkWrapBlocks = function() {
            if (null != a)
                return a;
            a = !1;
            var b,
                c,
                d;
            return c = oa.getElementsByTagName("body")[0], c && c.style ? (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== xa && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", b.appendChild(oa.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(d), a) : void 0
        }
    }();
    var ab,
        bb,
        cb = /^margin/,
        db = new RegExp("^(" + Aa + ")(?!px)[a-z%]+$", "i"),
        eb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (ab = function(b) {
        return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
    }, bb = function(a, b, c) {
        var d,
            e,
            f,
            g,
            h = a.style;
        return c = c || ab(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || ea.contains(a.ownerDocument, a) || (g = ea.style(a, b)), db.test(g) && cb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
    }) : oa.documentElement.currentStyle && (ab = function(a) {
        return a.currentStyle
    }, bb = function(a, b, c) {
        var d,
            e,
            f,
            g,
            h = a.style;
        return c = c || ab(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), db.test(g) && !eb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
    }), !function() {
        function b() {
            var b,
                c,
                d,
                e;
            c = oa.getElementsByTagName("body")[0], c && c.style && (b = oa.createElement("div"), d = oa.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", f = g = !1, i = !0, a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(b, null) || {}).top, g = "4px" === (a.getComputedStyle(b, null) || {
                width: "4px"
            }).width, e = b.appendChild(oa.createElement("div")), e.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", e.style.marginRight = e.style.width = "0", b.style.width = "1px", i = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight), b.removeChild(e)), b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", e = b.getElementsByTagName("td"), e[0].style.cssText = "margin:0;border:0;padding:0;display:none", h = 0 === e[0].offsetHeight, h && (e[0].style.display = "", e[1].style.display = "none", h = 0 === e[0].offsetHeight), c.removeChild(d))
        }
        var c,
            d,
            e,
            f,
            g,
            h,
            i;
        c = oa.createElement("div"), c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = c.getElementsByTagName("a")[0], (d = e && e.style) && (d.cssText = "float:left;opacity:.5", ca.opacity = "0.5" === d.opacity, ca.cssFloat = !!d.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", ca.clearCloneStyle = "content-box" === c.style.backgroundClip, ca.boxSizing = "" === d.boxSizing || "" === d.MozBoxSizing || "" === d.WebkitBoxSizing, ea.extend(ca, {
            reliableHiddenOffsets: function() {
                return null == h && b(), h
            },
            boxSizingReliable: function() {
                return null == g && b(), g
            },
            pixelPosition: function() {
                return null == f && b(), f
            },
            reliableMarginRight: function() {
                return null == i && b(), i
            }
        }))
    }(), ea.swap = function(a, b, c, d) {
        var e,
            f,
            g = {};
        for (f in b)
            g[f] = a.style[f], a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b)
            a.style[f] = g[f];
        return e
    };
    var fb = /alpha\([^)]*\)/i,
        gb = /opacity\s*=\s*([^)]*)/,
        hb = /^(none|table(?!-c[ea]).+)/,
        ib = new RegExp("^(" + Aa + ")(.*)$", "i"),
        jb = new RegExp("^([+-])=(" + Aa + ")", "i"),
        kb = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        lb = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        mb = ["Webkit", "O", "Moz", "ms"];
    ea.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = bb(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: ca.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e,
                    f,
                    g,
                    h = ea.camelCase(b),
                    i = a.style;
                if (b = ea.cssProps[h] || (ea.cssProps[h] = B(i, h)), g = ea.cssHooks[b] || ea.cssHooks[h], void 0 === c)
                    return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c, "string" === f && (e = jb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(ea.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || ea.cssNumber[h] || (c += "px"), ca.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d)))))
                    try {
                        i[b] = c
                    } catch (a) {}
            }
        },
        css: function(a, b, c, d) {
            var e,
                f,
                g,
                h = ea.camelCase(b);
            return b = ea.cssProps[h] || (ea.cssProps[h] = B(a.style, h)), g = ea.cssHooks[b] || ea.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = bb(a, b, d)), "normal" === f && b in lb && (f = lb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || ea.isNumeric(e) ? e || 0 : f) : f
        }
    }), ea.each(["height", "width"], function(a, b) {
        ea.cssHooks[b] = {
            get: function(a, c, d) {
                return c ? hb.test(ea.css(a, "display")) && 0 === a.offsetWidth ? ea.swap(a, kb, function() {
                    return F(a, b, d)
                }) : F(a, b, d) : void 0
            },
            set: function(a, c, d) {
                var e = d && ab(a);
                return D(a, c, d ? E(a, b, d, ca.boxSizing && "border-box" === ea.css(a, "boxSizing", !1, e), e) : 0)
            }
        }
    }), ca.opacity || (ea.cssHooks.opacity = {
        get: function(a, b) {
            return gb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style,
                d = a.currentStyle,
                e = ea.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                f = d && d.filter || c.filter || "";
            c.zoom = 1, (b >= 1 || "" === b) && "" === ea.trim(f.replace(fb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = fb.test(f) ? f.replace(fb, e) : f + " " + e)
        }
    }), ea.cssHooks.marginRight = A(ca.reliableMarginRight, function(a, b) {
        return b ? ea.swap(a, {
            display: "inline-block"
        }, bb, [a, "marginRight"]) : void 0
    }), ea.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        ea.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)
                    e[a + Ba[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        }, cb.test(a) || (ea.cssHooks[a + b].set = D)
    }), ea.fn.extend({
        css: function(a, b) {
            return Da(this, function(a, b, c) {
                var d,
                    e,
                    f = {},
                    g = 0;
                if (ea.isArray(b)) {
                    for (d = ab(a), e = b.length; e > g; g++)
                        f[b[g]] = ea.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? ea.style(a, b, c) : ea.css(a, b)
            }, a, b, arguments.length > 1)
        },
        show: function() {
            return C(this, !0)
        },
        hide: function() {
            return C(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                Ca(this) ? ea(this).show() : ea(this).hide()
            })
        }
    }), ea.Tween = G, G.prototype = {
        constructor: G,
        init: function(a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (ea.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var a = G.propHooks[this.prop];
            return a && a.get ? a.get(this) : G.propHooks._default.get(this)
        },
        run: function(a) {
            var b,
                c = G.propHooks[this.prop];
            return this.options.duration ? this.pos = b = ea.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : G.propHooks._default.set(this), this
        }
    }, G.prototype.init.prototype = G.prototype, G.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = ea.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
            },
            set: function(a) {
                ea.fx.step[a.prop] ? ea.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[ea.cssProps[a.prop]] || ea.cssHooks[a.prop]) ? ea.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    }, G.propHooks.scrollTop = G.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    }, ea.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    }, ea.fx = G.prototype.init, ea.fx.step = {};
    var nb,
        ob,
        pb = /^(?:toggle|show|hide)$/,
        qb = new RegExp("^(?:([+-])=|)(" + Aa + ")([a-z%]*)$", "i"),
        rb = /queueHooks$/,
        sb = [K],
        tb = {
            "*": [function(a, b) {
                var c = this.createTween(a, b),
                    d = c.cur(),
                    e = qb.exec(b),
                    f = e && e[3] || (ea.cssNumber[a] ? "" : "px"),
                    g = (ea.cssNumber[a] || "px" !== f && +d) && qb.exec(ea.css(c.elem, a)),
                    h = 1,
                    i = 20;
                if (g && g[3] !== f) {
                    f = f || g[3], e = e || [], g = +d || 1;
                    do h = h || ".5", g /= h, ea.style(c.elem, a, g + f);
                    while (h !== (h = c.cur() / d) && 1 !== h && --i)
                }
                return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
            }]
        };
    ea.Animation = ea.extend(M, {
        tweener: function(a, b) {
            ea.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++)
                c = a[d], tb[c] = tb[c] || [], tb[c].unshift(b)
        },
        prefilter: function(a, b) {
            b ? sb.unshift(a) : sb.push(a)
        }
    }), ea.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? ea.extend({}, a) : {
            complete: c || !c && b || ea.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !ea.isFunction(b) && b
        };
        return d.duration = ea.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in ea.fx.speeds ? ea.fx.speeds[d.duration] : ea.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
            ea.isFunction(d.old) && d.old.call(this), d.queue && ea.dequeue(this, d.queue)
        }, d
    }, ea.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(Ca).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            var e = ea.isEmptyObject(a),
                f = ea.speed(b, c, d),
                g = function() {
                    var b = M(this, ea.extend({}, a), f);
                    (e || ea._data(this, "finish")) && b.stop(!0)
                };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop, b(c)
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                var b = !0,
                    e = null != a && a + "queueHooks",
                    f = ea.timers,
                    g = ea._data(this);
                if (e)
                    g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g)
                        g[e] && g[e].stop && rb.test(e) && d(g[e]);
                for (e = f.length; e--;)
                    f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                (b || !c) && ea.dequeue(this, a)
            })
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"), this.each(function() {
                var b,
                    c = ea._data(this),
                    d = c[a + "queue"],
                    e = c[a + "queueHooks"],
                    f = ea.timers,
                    g = d ? d.length : 0;
                for (c.finish = !0, ea.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;)
                    f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                for (b = 0; g > b; b++)
                    d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }), ea.each(["toggle", "show", "hide"], function(a, b) {
        var c = ea.fn[b];
        ea.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(I(b, !0), a, d, e)
        }
    }), ea.each({
        slideDown: I("show"),
        slideUp: I("hide"),
        slideToggle: I("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        ea.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), ea.timers = [], ea.fx.tick = function() {
        var a,
            b = ea.timers,
            c = 0;
        for (nb = ea.now(); c < b.length; c++)
            a = b[c], a() || b[c] !== a || b.splice(c--, 1);
        b.length || ea.fx.stop(), nb = void 0
    }, ea.fx.timer = function(a) {
        ea.timers.push(a), a() ? ea.fx.start() : ea.timers.pop()
    }, ea.fx.interval = 13, ea.fx.start = function() {
        ob || (ob = setInterval(ea.fx.tick, ea.fx.interval))
    }, ea.fx.stop = function() {
        clearInterval(ob), ob = null
    }, ea.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, ea.fn.delay = function(a, b) {
        return a = ea.fx ? ea.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
            var d = setTimeout(b, a);
            c.stop = function() {
                clearTimeout(d)
            }
        })
    }, function() {
        var a,
            b,
            c,
            d,
            e;
        b = oa.createElement("div"), b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = oa.createElement("select"), e = c.appendChild(oa.createElement("option")), a = b.getElementsByTagName("input")[0], d.style.cssText = "top:1px", ca.getSetAttribute = "t" !== b.className, ca.style = /top/.test(d.getAttribute("style")), ca.hrefNormalized = "/a" === d.getAttribute("href"), ca.checkOn = !!a.value, ca.optSelected = e.selected, ca.enctype = !!oa.createElement("form").enctype, c.disabled = !0, ca.optDisabled = !e.disabled, a = oa.createElement("input"), a.setAttribute("value", ""), ca.input = "" === a.getAttribute("value"), a.value = "t", a.setAttribute("type", "radio"), ca.radioValue = "t" === a.value
    }();
    var ub = /\r/g;
    ea.fn.extend({
        val: function(a) {
            var b,
                c,
                d,
                e = this[0];
            return arguments.length ? (d = ea.isFunction(a), this.each(function(c) {
                var e;
                1 === this.nodeType && (e = d ? a.call(this, c, ea(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : ea.isArray(e) && (e = ea.map(e, function(a) {
                    return null == a ? "" : a + ""
                })), b = ea.valHooks[this.type] || ea.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
            })) : e ? (b = ea.valHooks[e.type] || ea.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(ub, "") : null == c ? "" : c)) : void 0
        }
    }), ea.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = ea.find.attr(a, "value");
                    return null != b ? b : ea.trim(ea.text(a))
                }
            },
            select: {
                get: function(a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                        if (c = d[i], !(!c.selected && i !== e || (ca.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && ea.nodeName(c.parentNode, "optgroup"))) {
                            if (b = ea(c).val(), f)
                                return b;
                            g.push(b)
                        }
                    return g
                },
                set: function(a, b) {
                    for (var c, d, e = a.options, f = ea.makeArray(b), g = e.length; g--;)
                        if (d = e[g], ea.inArray(ea.valHooks.option.get(d), f) >= 0)
                            try {
                                d.selected = c = !0
                            } catch (a) {
                                d.scrollHeight
                            }
                        else
                            d.selected = !1;
                    return c || (a.selectedIndex = -1), e
                }
            }
        }
    }), ea.each(["radio", "checkbox"], function() {
        ea.valHooks[this] = {
            set: function(a, b) {
                return ea.isArray(b) ? a.checked = ea.inArray(ea(a).val(), b) >= 0 : void 0
            }
        }, ca.checkOn || (ea.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        })
    });
    var vb,
        wb,
        xb = ea.expr.attrHandle,
        yb = /^(?:checked|selected)$/i,
        zb = ca.getSetAttribute,
        Ab = ca.input;
    ea.fn.extend({
        attr: function(a, b) {
            return Da(this, ea.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                ea.removeAttr(this, a)
            })
        }
    }), ea.extend({
        attr: function(a, b, c) {
            var d,
                e,
                f = a.nodeType;
            if (a && 3 !== f && 8 !== f && 2 !== f)
                return typeof a.getAttribute === xa ? ea.prop(a, b, c) : (1 === f && ea.isXMLDoc(a) || (b = b.toLowerCase(), d = ea.attrHooks[b] || (ea.expr.match.bool.test(b) ? wb : vb)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = ea.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void ea.removeAttr(a, b))
        },
        removeAttr: function(a, b) {
            var c,
                d,
                e = 0,
                f = b && b.match(ta);
            if (f && 1 === a.nodeType)
                for (; c = f[e++];)
                    d = ea.propFix[c] || c, ea.expr.match.bool.test(c) ? Ab && zb || !yb.test(c) ? a[d] = !1 : a[ea.camelCase("default-" + c)] = a[d] = !1 : ea.attr(a, c, ""), a.removeAttribute(zb ? c : d)
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!ca.radioValue && "radio" === b && ea.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            }
        }
    }), wb = {
        set: function(a, b, c) {
            return b === !1 ? ea.removeAttr(a, c) : Ab && zb || !yb.test(c) ? a.setAttribute(!zb && ea.propFix[c] || c, c) : a[ea.camelCase("default-" + c)] = a[c] = !0, c
        }
    }, ea.each(ea.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = xb[b] || ea.find.attr;
        xb[b] = Ab && zb || !yb.test(b) ? function(a, b, d) {
            var e,
                f;
            return d || (f = xb[b], xb[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, xb[b] = f), e
        } : function(a, b, c) {
            return c ? void 0 : a[ea.camelCase("default-" + b)] ? b.toLowerCase() : null
        }
    }), Ab && zb || (ea.attrHooks.value = {
        set: function(a, b, c) {
            return ea.nodeName(a, "input") ? void (a.defaultValue = b) : vb && vb.set(a, b, c)
        }
    }), zb || (vb = {
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
        }
    }, xb.id = xb.name = xb.coords = function(a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
    }, ea.valHooks.button = {
        get: function(a, b) {
            var c = a.getAttributeNode(b);
            return c && c.specified ? c.value : void 0
        },
        set: vb.set
    }, ea.attrHooks.contenteditable = {
        set: function(a, b, c) {
            vb.set(a, "" !== b && b, c)
        }
    }, ea.each(["width", "height"], function(a, b) {
        ea.attrHooks[b] = {
            set: function(a, c) {
                return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
            }
        }
    })), ca.style || (ea.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0
        },
        set: function(a, b) {
            return a.style.cssText = b + ""
        }
    });
    var Bb = /^(?:input|select|textarea|button|object)$/i,
        Cb = /^(?:a|area)$/i;
    ea.fn.extend({
        prop: function(a, b) {
            return Da(this, ea.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return a = ea.propFix[a] || a, this.each(function() {
                try {
                    this[a] = void 0, delete this[a]
                } catch (a) {}
            })
        }
    }), ea.extend({
        propFix: {
            for: "htmlFor",
            class: "className"
        },
        prop: function(a, b, c) {
            var d,
                e,
                f,
                g = a.nodeType;
            if (a && 3 !== g && 8 !== g && 2 !== g)
                return f = 1 !== g || !ea.isXMLDoc(a), f && (b = ea.propFix[b] || b, e = ea.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = ea.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : Bb.test(a.nodeName) || Cb.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        }
    }), ca.hrefNormalized || ea.each(["href", "src"], function(a, b) {
        ea.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4)
            }
        }
    }), ca.optSelected || (ea.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
        }
    }), ea.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        ea.propFix[this.toLowerCase()] = this
    }), ca.enctype || (ea.propFix.enctype = "encoding");
    var Db = /[\t\r\n\f]/g;
    ea.fn.extend({
        addClass: function(a) {
            var b,
                c,
                d,
                e,
                f,
                g,
                h = 0,
                i = this.length,
                j = "string" == typeof a && a;
            if (ea.isFunction(a))
                return this.each(function(b) {
                    ea(this).addClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(ta) || []; i > h; h++)
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Db, " ") : " ")) {
                        for (f = 0; e = b[f++];)
                            d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                        g = ea.trim(d), c.className !== g && (c.className = g)
                    }
            return this
        },
        removeClass: function(a) {
            var b,
                c,
                d,
                e,
                f,
                g,
                h = 0,
                i = this.length,
                j = 0 === arguments.length || "string" == typeof a && a;
            if (ea.isFunction(a))
                return this.each(function(b) {
                    ea(this).removeClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(ta) || []; i > h; h++)
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Db, " ") : "")) {
                        for (f = 0; e = b[f++];)
                            for (; d.indexOf(" " + e + " ") >= 0;)
                                d = d.replace(" " + e + " ", " ");
                        g = a ? ea.trim(d) : "", c.className !== g && (c.className = g)
                    }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(ea.isFunction(a) ? function(c) {
                ea(this).toggleClass(a.call(this, c, this.className, b), b)
            } : function() {
                if ("string" === c)
                    for (var b, d = 0, e = ea(this), f = a.match(ta) || []; b = f[d++];)
                        e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                else
                    (c === xa || "boolean" === c) && (this.className && ea._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : ea._data(this, "__className__") || "")
            })
        },
        hasClass: function(a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(Db, " ").indexOf(b) >= 0)
                    return !0;
            return !1
        }
    }), ea.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        ea.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }), ea.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        },
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    });
    var Eb = ea.now(),
        Fb = /\?/,
        Gb = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    ea.parseJSON = function(b) {
        if (a.JSON && a.JSON.parse)
            return a.JSON.parse(b + "");
        var c,
            d = null,
            e = ea.trim(b + "");
        return e && !ea.trim(e.replace(Gb, function(a, b, e, f) {
            return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
        })) ? Function("return " + e)() : ea.error("Invalid JSON: " + b)
    }, ea.parseXML = function(b) {
        var c,
            d;
        if (!b || "string" != typeof b)
            return null;
        try {
            a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
        } catch (a) {
            c = void 0
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || ea.error("Invalid XML: " + b), c
    };
    var Hb,
        Ib,
        Jb = /#.*$/,
        Kb = /([?&])_=[^&]*/,
        Lb = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Mb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Nb = /^(?:GET|HEAD)$/,
        Ob = /^\/\//,
        Pb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Qb = {},
        Rb = {},
        Sb = "*/".concat("*");
    try {
        Ib = location.href
    } catch (a) {
        Ib = oa.createElement("a"), Ib.href = "", Ib = Ib.href
    }
    Hb = Pb.exec(Ib.toLowerCase()) || [], ea.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Ib,
            type: "GET",
            isLocal: Mb.test(Hb[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Sb,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": ea.parseJSON,
                "text xml": ea.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? P(P(a, ea.ajaxSettings), b) : P(ea.ajaxSettings, a)
        },
        ajaxPrefilter: N(Qb),
        ajaxTransport: N(Rb),
        ajax: function(a, b) {
            function c(a, b, c, d) {
                var e,
                    k,
                    r,
                    s,
                    u,
                    w = b;
                2 !== t && (t = 2, h && clearTimeout(h), j = void 0, g = d || "", v.readyState = a > 0 ? 4 : 0, e = a >= 200 && 300 > a || 304 === a, c && (s = Q(l, v, c)), s = R(l, s, v, e), e ? (l.ifModified && (u = v.getResponseHeader("Last-Modified"), u && (ea.lastModified[f] = u), u = v.getResponseHeader("etag"), u && (ea.etag[f] = u)), 204 === a || "HEAD" === l.type ? w = "nocontent" : 304 === a ? w = "notmodified" : (w = s.state, k = s.data, r = s.error, e = !r)) : (r = w, (a || !w) && (w = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || w) + "", e ? o.resolveWith(m, [k, w, v]) : o.rejectWith(m, [v, w, r]), v.statusCode(q), q = void 0, i && n.trigger(e ? "ajaxSuccess" : "ajaxError", [v, l, e ? k : r]), p.fireWith(m, [v, w]), i && (n.trigger("ajaxComplete", [v, l]), --ea.active || ea.event.trigger("ajaxStop")))
            }
            "object" == typeof a && (b = a, a = void 0), b = b || {};
            var d,
                e,
                f,
                g,
                h,
                i,
                j,
                k,
                l = ea.ajaxSetup({}, b),
                m = l.context || l,
                n = l.context && (m.nodeType || m.jquery) ? ea(m) : ea.event,
                o = ea.Deferred(),
                p = ea.Callbacks("once memory"),
                q = l.statusCode || {},
                r = {},
                s = {},
                t = 0,
                u = "canceled",
                v = {
                    readyState: 0,
                    getResponseHeader: function(a) {
                        var b;
                        if (2 === t) {
                            if (!k)
                                for (k = {}; b = Lb.exec(g);)
                                    k[b[1].toLowerCase()] = b[2];
                            b = k[a.toLowerCase()]
                        }
                        return null == b ? null : b
                    },
                    getAllResponseHeaders: function() {
                        return 2 === t ? g : null
                    },
                    setRequestHeader: function(a, b) {
                        var c = a.toLowerCase();
                        return t || (a = s[c] = s[c] || a, r[a] = b), this
                    },
                    overrideMimeType: function(a) {
                        return t || (l.mimeType = a), this
                    },
                    statusCode: function(a) {
                        var b;
                        if (a)
                            if (2 > t)
                                for (b in a)
                                    q[b] = [q[b], a[b]];
                            else
                                v.always(a[v.status]);
                        return this
                    },
                    abort: function(a) {
                        var b = a || u;
                        return j && j.abort(b), c(0, b), this
                    }
                };
            if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, l.url = ((a || l.url || Ib) + "").replace(Jb, "").replace(Ob, Hb[1] + "//"), l.type = b.method || b.type || l.method || l.type, l.dataTypes = ea.trim(l.dataType || "*").toLowerCase().match(ta) || [""], null == l.crossDomain && (d = Pb.exec(l.url.toLowerCase()), l.crossDomain = !(!d || d[1] === Hb[1] && d[2] === Hb[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (Hb[3] || ("http:" === Hb[1] ? "80" : "443")))), l.data && l.processData && "string" != typeof l.data && (l.data = ea.param(l.data, l.traditional)), O(Qb, l, b, v), 2 === t)
                return v;
            i = ea.event && l.global, i && 0 === ea.active++ && ea.event.trigger("ajaxStart"), l.type = l.type.toUpperCase(), l.hasContent = !Nb.test(l.type), f = l.url, l.hasContent || (l.data && (f = l.url += (Fb.test(f) ? "&" : "?") + l.data, delete l.data), l.cache === !1 && (l.url = Kb.test(f) ? f.replace(Kb, "$1_=" + Eb++) : f + (Fb.test(f) ? "&" : "?") + "_=" + Eb++)), l.ifModified && (ea.lastModified[f] && v.setRequestHeader("If-Modified-Since", ea.lastModified[f]), ea.etag[f] && v.setRequestHeader("If-None-Match", ea.etag[f])), (l.data && l.hasContent && l.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", l.contentType), v.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + ("*" !== l.dataTypes[0] ? ", " + Sb + "; q=0.01" : "") : l.accepts["*"]);
            for (e in l.headers)
                v.setRequestHeader(e, l.headers[e]);
            if (l.beforeSend && (l.beforeSend.call(m, v, l) === !1 || 2 === t))
                return v.abort();
            u = "abort";
            for (e in {
                success: 1,
                error: 1,
                complete: 1
            })
                v[e](l[e]);
            if (j = O(Rb, l, b, v)) {
                v.readyState = 1, i && n.trigger("ajaxSend", [v, l]), l.async && l.timeout > 0 && (h = setTimeout(function() {
                    v.abort("timeout")
                }, l.timeout));
                try {
                    t = 1, j.send(r, c)
                } catch (a) {
                    if (!(2 > t))
                        throw a;
                    c(-1, a)
                }
            } else
                c(-1, "No Transport");
            return v
        },
        getJSON: function(a, b, c) {
            return ea.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return ea.get(a, void 0, b, "script")
        }
    }), ea.each(["get", "post"], function(a, b) {
        ea[b] = function(a, c, d, e) {
            return ea.isFunction(c) && (e = e || d, d = c, c = void 0), ea.ajax({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            })
        }
    }), ea._evalUrl = function(a) {
        return ea.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            throws: !0
        })
    }, ea.fn.extend({
        wrapAll: function(a) {
            if (ea.isFunction(a))
                return this.each(function(b) {
                    ea(this).wrapAll(a.call(this, b))
                });
            if (this[0]) {
                var b = ea(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType;)
                        a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            return this.each(ea.isFunction(a) ? function(b) {
                ea(this).wrapInner(a.call(this, b))
            } : function() {
                var b = ea(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = ea.isFunction(a);
            return this.each(function(c) {
                ea(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                ea.nodeName(this, "body") || ea(this).replaceWith(this.childNodes)
            }).end()
        }
    }), ea.expr.filters.hidden = function(a) {
        return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !ca.reliableHiddenOffsets() && "none" === (a.style && a.style.display || ea.css(a, "display"))
    }, ea.expr.filters.visible = function(a) {
        return !ea.expr.filters.hidden(a)
    };
    var Tb = /%20/g,
        Ub = /\[\]$/,
        Vb = /\r?\n/g,
        Wb = /^(?:submit|button|image|reset|file)$/i,
        Xb = /^(?:input|select|textarea|keygen)/i;
    ea.param = function(a, b) {
        var c,
            d = [],
            e = function(a, b) {
                b = ea.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            };
        if (void 0 === b && (b = ea.ajaxSettings && ea.ajaxSettings.traditional), ea.isArray(a) || a.jquery && !ea.isPlainObject(a))
            ea.each(a, function() {
                e(this.name, this.value)
            });
        else
            for (c in a)
                S(c, a[c], b, e);
        return d.join("&").replace(Tb, "+")
    }, ea.fn.extend({
        serialize: function() {
            return ea.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = ea.prop(this, "elements");
                return a ? ea.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !ea(this).is(":disabled") && Xb.test(this.nodeName) && !Wb.test(a) && (this.checked || !Ea.test(a))
            }).map(function(a, b) {
                var c = ea(this).val();
                return null == c ? null : ea.isArray(c) ? ea.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(Vb, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(Vb, "\r\n")
                }
            }).get()
        }
    }), ea.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && T() || U()
    } : T;
    var Yb = 0,
        Zb = {},
        $b = ea.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function() {
        for (var a in Zb)
            Zb[a](void 0, !0)
    }), ca.cors = !!$b && "withCredentials" in $b, $b = ca.ajax = !!$b, $b && ea.ajaxTransport(function(a) {
        if (!a.crossDomain || ca.cors) {
            var b;
            return {
                send: function(c, d) {
                    var e,
                        f = a.xhr(),
                        g = ++Yb;
                    if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                        for (e in a.xhrFields)
                            f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c)
                        void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    f.send(a.hasContent && a.data || null), b = function(c, e) {
                        var h,
                            i,
                            j;
                        if (b && (e || 4 === f.readyState))
                            if (delete Zb[g], b = void 0, f.onreadystatechange = ea.noop, e)
                                4 !== f.readyState && f.abort();
                            else {
                                j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                                try {
                                    i = f.statusText
                                } catch (a) {
                                    i = ""
                                }
                                h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                            }
                        j && d(h, i, j, f.getAllResponseHeaders())
                    }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Zb[g] = b : b()
                },
                abort: function() {
                    b && b(void 0, !0)
                }
            }
        }
    }), ea.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return ea.globalEval(a), a
            }
        }
    }), ea.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), ea.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b,
                c = oa.head || ea("head")[0] || oa.documentElement;
            return {
                send: function(d, e) {
                    b = oa.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                    }, c.insertBefore(b, c.firstChild)
                },
                abort: function() {
                    b && b.onload(void 0, !0)
                }
            }
        }
    });
    var _b = [],
        ac = /(=)\?(?=&|$)|\?\?/;
    ea.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = _b.pop() || ea.expando + "_" + Eb++;
            return this[a] = !0, a
        }
    }), ea.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e,
            f,
            g,
            h = b.jsonp !== !1 && (ac.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && ac.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = ea.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(ac, "$1" + e) : b.jsonp !== !1 && (b.url += (Fb.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function() {
            return g || ea.error(e + " was not called"), g[0]
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
            g = arguments
        }, d.always(function() {
            a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, _b.push(e)), g && ea.isFunction(f) && f(g[0]), g = f = void 0
        }), "script") : void 0
    }), ea.parseHTML = function(a, b, c) {
        if (!a || "string" != typeof a)
            return null;
        "boolean" == typeof b && (c = b, b = !1), b = b || oa;
        var d = la.exec(a),
            e = !c && [];
        return d ? [b.createElement(d[1])] : (d = ea.buildFragment([a], b, e), e && e.length && ea(e).remove(), ea.merge([], d.childNodes))
    };
    var bc = ea.fn.load;
    ea.fn.load = function(a, b, c) {
        if ("string" != typeof a && bc)
            return bc.apply(this, arguments);
        var d,
            e,
            f,
            g = this,
            h = a.indexOf(" ");
        return h >= 0 && (d = ea.trim(a.slice(h, a.length)), a = a.slice(0, h)), ea.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && ea.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function(a) {
            e = arguments, g.html(d ? ea("<div>").append(ea.parseHTML(a)).find(d) : a)
        }).complete(c && function(a, b) {
            g.each(c, e || [a.responseText, b, a])
        }), this
    }, ea.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
        ea.fn[b] = function(a) {
            return this.on(b, a)
        }
    }), ea.expr.filters.animated = function(a) {
        return ea.grep(ea.timers, function(b) {
            return a === b.elem
        }).length
    };
    var cc = a.document.documentElement;
    ea.offset = {
        setOffset: function(a, b, c) {
            var d,
                e,
                f,
                g,
                h,
                i,
                j,
                k = ea.css(a, "position"),
                l = ea(a),
                m = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = ea.css(a, "top"), i = ea.css(a, "left"), j = ("absolute" === k || "fixed" === k) && ea.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), ea.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
        }
    }, ea.fn.extend({
        offset: function(a) {
            if (arguments.length)
                return void 0 === a ? this : this.each(function(b) {
                    ea.offset.setOffset(this, a, b)
                });
            var b,
                c,
                d = {
                    top: 0,
                    left: 0
                },
                e = this[0],
                f = e && e.ownerDocument;
            return f ? (b = f.documentElement, ea.contains(b, e) ? (typeof e.getBoundingClientRect !== xa && (d = e.getBoundingClientRect()), c = V(f), {
                top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
            }) : d) : void 0
        },
        position: function() {
            if (this[0]) {
                var a,
                    b,
                    c = {
                        top: 0,
                        left: 0
                    },
                    d = this[0];
                return "fixed" === ea.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), ea.nodeName(a[0], "html") || (c = a.offset()), c.top += ea.css(a[0], "borderTopWidth", !0), c.left += ea.css(a[0], "borderLeftWidth", !0)), {
                    top: b.top - c.top - ea.css(d, "marginTop", !0),
                    left: b.left - c.left - ea.css(d, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || cc; a && !ea.nodeName(a, "html") && "static" === ea.css(a, "position");)
                    a = a.offsetParent;
                return a || cc
            })
        }
    }), ea.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = /Y/.test(b);
        ea.fn[a] = function(d) {
            return Da(this, function(a, d, e) {
                var f = V(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? ea(f).scrollLeft() : e, c ? e : ea(f).scrollTop()) : a[d] = e)
            }, a, d, arguments.length, null)
        }
    }), ea.each(["top", "left"], function(a, b) {
        ea.cssHooks[b] = A(ca.pixelPosition, function(a, c) {
            return c ? (c = bb(a, b), db.test(c) ? ea(a).position()[b] + "px" : c) : void 0
        })
    }), ea.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        ea.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, d) {
            ea.fn[d] = function(d, e) {
                var f = arguments.length && (c || "boolean" != typeof d),
                    g = c || (d === !0 || e === !0 ? "margin" : "border");
                return Da(this, function(b, c, d) {
                    var e;
                    return ea.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? ea.css(b, c, g) : ea.style(b, c, d, g)
                }, b, f ? d : void 0, f, null)
            }
        })
    }), ea.fn.size = function() {
        return this.length
    }, ea.fn.andSelf = ea.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return ea
    });
    var dc = a.jQuery,
        ec = a.$;
    return ea.noConflict = function(b) {
        return a.$ === ea && (a.$ = ec), b && a.jQuery === ea && (a.jQuery = dc), ea
    }, typeof b === xa && (a.jQuery = a.$ = ea), ea
}), jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(a, b, c, d, e) {
        return jQuery.easing[jQuery.easing.def](a, b, c, d, e)
    },
    easeInQuad: function(a, b, c, d, e) {
        return d * (b /= e) * b + c
    },
    easeOutQuad: function(a, b, c, d, e) {
        return -d * (b /= e) * (b - 2) + c
    },
    easeInOutQuad: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
    },
    easeInCubic: function(a, b, c, d, e) {
        return d * (b /= e) * b * b + c
    },
    easeOutCubic: function(a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b + 1) + c
    },
    easeInOutCubic: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c
    },
    easeInQuart: function(a, b, c, d, e) {
        return d * (b /= e) * b * b * b + c
    },
    easeOutQuart: function(a, b, c, d, e) {
        return -d * ((b = b / e - 1) * b * b * b - 1) + c
    },
    easeInOutQuart: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c
    },
    easeInQuint: function(a, b, c, d, e) {
        return d * (b /= e) * b * b * b * b + c
    },
    easeOutQuint: function(a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b * b * b + 1) + c
    },
    easeInOutQuint: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c
    },
    easeInSine: function(a, b, c, d, e) {
        return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
    },
    easeOutSine: function(a, b, c, d, e) {
        return d * Math.sin(b / e * (Math.PI / 2)) + c
    },
    easeInOutSine: function(a, b, c, d, e) {
        return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
    },
    easeInExpo: function(a, b, c, d, e) {
        return 0 == b ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
    },
    easeOutExpo: function(a, b, c, d, e) {
        return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
    },
    easeInOutExpo: function(a, b, c, d, e) {
        return 0 == b ? c : b == e ? c + d : (b /= e / 2) < 1 ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
    },
    easeInCirc: function(a, b, c, d, e) {
        return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
    },
    easeOutCirc: function(a, b, c, d, e) {
        return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
    },
    easeInOutCirc: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
    },
    easeInElastic: function(a, b, c, d, e) {
        var f = 1.70158,
            g = 0,
            h = d;
        if (0 == b)
            return c;
        if (1 == (b /= e))
            return c + d;
        if (g || (g = .3 * e), h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g)) + c
    },
    easeOutElastic: function(a, b, c, d, e) {
        var f = 1.70158,
            g = 0,
            h = d;
        if (0 == b)
            return c;
        if (1 == (b /= e))
            return c + d;
        if (g || (g = .3 * e), h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * (2 * Math.PI) / g) + d + c
    },
    easeInOutElastic: function(a, b, c, d, e) {
        var f = 1.70158,
            g = 0,
            h = d;
        if (0 == b)
            return c;
        if (2 == (b /= e / 2))
            return c + d;
        if (g || (g = e * (.3 * 1.5)), h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return b < 1 ? -.5 * (h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g)) + c : h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g) * .5 + d + c
    },
    easeInBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158), d * (b /= e) * b * ((f + 1) * b - f) + c
    },
    easeOutBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158), d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
    },
    easeInOutBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158), (b /= e / 2) < 1 ? d / 2 * (b * b * (((f *= 1.525) + 1) * b - f)) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
    },
    easeInBounce: function(a, b, c, d, e) {
        return d - jQuery.easing.easeOutBounce(a, e - b, 0, d, e) + c
    },
    easeOutBounce: function(a, b, c, d, e) {
        return (b /= e) < 1 / 2.75 ? d * (7.5625 * b * b) + c : b < 2 / 2.75 ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : b < 2.5 / 2.75 ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
    },
    easeInOutBounce: function(a, b, c, d, e) {
        return b < e / 2 ? .5 * jQuery.easing.easeInBounce(a, 2 * b, 0, d, e) + c : .5 * jQuery.easing.easeOutBounce(a, 2 * b - e, 0, d, e) + .5 * d + c
    }
}), !function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function(a) {
    var b = 0,
        c = Array.prototype.slice;
    a.cleanData = function(b) {
        return function(c) {
            var d,
                e,
                f;
            for (f = 0; null != (e = c[f]); f++)
                try {
                    d = a._data(e, "events"), d && d.remove && a(e).triggerHandler("remove")
                } catch (a) {}
            b(c)
        }
    }(a.cleanData), a.widget = function(b, c, d) {
        var e,
            f,
            g,
            h,
            i = {},
            j = b.split(".")[0];
        return b = b.split(".")[1], e = j + "-" + b, d || (d = c, c = a.Widget), a.expr[":"][e.toLowerCase()] = function(b) {
            return !!a.data(b, e)
        }, a[j] = a[j] || {}, f = a[j][b], g = a[j][b] = function(a, b) {
            return this._createWidget ? void (arguments.length && this._createWidget(a, b)) : new g(a, b)
        }, a.extend(g, f, {
            version: d.version,
            _proto: a.extend({}, d),
            _childConstructors: []
        }), h = new c, h.options = a.widget.extend({}, h.options), a.each(d, function(b, d) {
            return a.isFunction(d) ? void (i[b] = function() {
                var a = function() {
                        return c.prototype[b].apply(this, arguments)
                    },
                    e = function(a) {
                        return c.prototype[b].apply(this, a)
                    };
                return function() {
                    var b,
                        c = this._super,
                        f = this._superApply;
                    return this._super = a, this._superApply = e, b = d.apply(this, arguments), this._super = c, this._superApply = f, b
                }
            }()) : void (i[b] = d)
        }), g.prototype = a.widget.extend(h, {
            widgetEventPrefix: f ? h.widgetEventPrefix || b : b
        }, i, {
            constructor: g,
            namespace: j,
            widgetName: b,
            widgetFullName: e
        }), f ? (a.each(f._childConstructors, function(b, c) {
            var d = c.prototype;
            a.widget(d.namespace + "." + d.widgetName, g, c._proto)
        }), delete f._childConstructors) : c._childConstructors.push(g), a.widget.bridge(b, g), g
    }, a.widget.extend = function(b) {
        for (var d, e, f = c.call(arguments, 1), g = 0, h = f.length; h > g; g++)
            for (d in f[g])
                e = f[g][d], f[g].hasOwnProperty(d) && void 0 !== e && (b[d] = a.isPlainObject(e) ? a.isPlainObject(b[d]) ? a.widget.extend({}, b[d], e) : a.widget.extend({}, e) : e);
        return b
    }, a.widget.bridge = function(b, d) {
        var e = d.prototype.widgetFullName || b;
        a.fn[b] = function(f) {
            var g = "string" == typeof f,
                h = c.call(arguments, 1),
                i = this;
            return f = !g && h.length ? a.widget.extend.apply(null, [f].concat(h)) : f, this.each(g ? function() {
                var c,
                    d = a.data(this, e);
                return "instance" === f ? (i = d, !1) : d ? a.isFunction(d[f]) && "_" !== f.charAt(0) ? (c = d[f].apply(d, h), c !== d && void 0 !== c ? (i = c && c.jquery ? i.pushStack(c.get()) : c, !1) : void 0) : a.error("no such method '" + f + "' for " + b + " widget instance") : a.error("cannot call methods on " + b + " prior to initialization; attempted to call method '" + f + "'")
            } : function() {
                var b = a.data(this, e);
                b ? (b.option(f || {}), b._init && b._init()) : a.data(this, e, new d(f, this))
            }), i
        }
    }, a.Widget = function() {}, a.Widget._childConstructors = [], a.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: !1,
            create: null
        },
        _createWidget: function(c, d) {
            d = a(d || this.defaultElement || this)[0], this.element = a(d), this.uuid = b++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = a(), this.hoverable = a(), this.focusable = a(), d !== this && (a.data(d, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function(a) {
                    a.target === d && this.destroy()
                }
            }), this.document = a(d.style ? d.ownerDocument : d.document || d), this.window = a(this.document[0].defaultView || this.document[0].parentWindow)), this.options = a.widget.extend({}, this.options, this._getCreateOptions(), c), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
        },
        _getCreateOptions: a.noop,
        _getCreateEventData: a.noop,
        _create: a.noop,
        _init: a.noop,
        destroy: function() {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(a.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
        },
        _destroy: a.noop,
        widget: function() {
            return this.element
        },
        option: function(b, c) {
            var d,
                e,
                f,
                g = b;
            if (0 === arguments.length)
                return a.widget.extend({}, this.options);
            if ("string" == typeof b)
                if (g = {}, d = b.split("."), b = d.shift(), d.length) {
                    for (e = g[b] = a.widget.extend({}, this.options[b]), f = 0; d.length - 1 > f; f++)
                        e[d[f]] = e[d[f]] || {}, e = e[d[f]];
                    if (b = d.pop(), 1 === arguments.length)
                        return void 0 === e[b] ? null : e[b];
                    e[b] = c
                } else {
                    if (1 === arguments.length)
                        return void 0 === this.options[b] ? null : this.options[b];
                    g[b] = c
                }
            return this._setOptions(g), this
        },
        _setOptions: function(a) {
            var b;
            for (b in a)
                this._setOption(b, a[b]);
            return this
        },
        _setOption: function(a, b) {
            return this.options[a] = b, "disabled" === a && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!b), b && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
        },
        enable: function() {
            return this._setOptions({
                disabled: !1
            })
        },
        disable: function() {
            return this._setOptions({
                disabled: !0
            })
        },
        _on: function(b, c, d) {
            var e,
                f = this;
            "boolean" != typeof b && (d = c, c = b, b = !1), d ? (c = e = a(c), this.bindings = this.bindings.add(c)) : (d = c, c = this.element, e = this.widget()), a.each(d, function(d, g) {
                function h() {
                    return b || f.options.disabled !== !0 && !a(this).hasClass("ui-state-disabled") ? ("string" == typeof g ? f[g] : g).apply(f, arguments) : void 0
                }
                "string" != typeof g && (h.guid = g.guid = g.guid || h.guid || a.guid++);
                var i = d.match(/^([\w:-]*)\s*(.*)$/),
                    j = i[1] + f.eventNamespace,
                    k = i[2];
                k ? e.delegate(k, j, h) : c.bind(j, h)
            })
        },
        _off: function(b, c) {
            c = (c || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, b.unbind(c).undelegate(c), this.bindings = a(this.bindings.not(b).get()), this.focusable = a(this.focusable.not(b).get()), this.hoverable = a(this.hoverable.not(b).get())
        },
        _delay: function(a, b) {
            function c() {
                return ("string" == typeof a ? d[a] : a).apply(d, arguments)
            }
            var d = this;
            return setTimeout(c, b || 0)
        },
        _hoverable: function(b) {
            this.hoverable = this.hoverable.add(b), this._on(b, {
                mouseenter: function(b) {
                    a(b.currentTarget).addClass("ui-state-hover")
                },
                mouseleave: function(b) {
                    a(b.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function(b) {
            this.focusable = this.focusable.add(b), this._on(b, {
                focusin: function(b) {
                    a(b.currentTarget).addClass("ui-state-focus")
                },
                focusout: function(b) {
                    a(b.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function(b, c, d) {
            var e,
                f,
                g = this.options[b];
            if (d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent)
                for (e in f)
                    e in c || (c[e] = f[e]);
            return this.element.trigger(c, d), !(a.isFunction(g) && g.apply(this.element[0], [c].concat(d)) === !1 || c.isDefaultPrevented())
        }
    }, a.each({
        show: "fadeIn",
        hide: "fadeOut"
    }, function(b, c) {
        a.Widget.prototype["_" + b] = function(d, e, f) {
            "string" == typeof e && (e = {
                effect: e
            });
            var g,
                h = e ? e === !0 || "number" == typeof e ? c : e.effect || c : b;
            e = e || {}, "number" == typeof e && (e = {
                duration: e
            }), g = !a.isEmptyObject(e), e.complete = f, e.delay && d.delay(e.delay), g && a.effects && a.effects.effect[h] ? d[b](e) : h !== b && d[h] ? d[h](e.duration, e.easing, f) : d.queue(function(c) {
                a(this)[b](), f && f.call(d[0]), c()
            })
        }
    }), a.widget
}), function(a) {
    "use strict";
    a.widget("aerolab.midnight", {
        options: {
            headerClass: "midnightHeader",
            innerClass: "midnightInner",
            defaultClass: "default",
            classPrefix: ""
        },
        _headers: {},
        _headerInfo: {
            top: 0,
            height: 0
        },
        _$sections: [],
        _sections: [],
        _scrollTop: 0,
        _documentHeight: 0,
        _transformMode: !1,
        refresh: function() {
            this._headerInfo = {
                top: 0,
                height: this.element.outerHeight()
            }, this._$sections = a("[data-midnight]"), this._sections = [], this._setupHeaders(), this.recalculate()
        },
        _create: function() {
            var b = this;
            this._scrollTop = window.pageYOffset || document.documentElement.scrollTop, this._documentHeight = a(document).height(), this._headers = {}, this._transformMode = this._getSupportedTransform(), this.refresh(), setInterval(function() {
                b._recalculateSections()
            }, 1e3), a(window).resize(function() {
                b.recalculate()
            }).trigger("resize"), this._updateHeadersLoop()
        },
        recalculate: function() {
            this._recalculateSections(), this._updateHeaderHeight(), this._recalculateHeaders(), this._updateHeaders()
        },
        _getSupportedTransform: function() {
            for (var a = ["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"], b = 0; b < a.length; b++)
                if (void 0 !== document.createElement("div").style[a[b]])
                    return a[b];
            return !1
        },
        _getContainerHeight: function() {
            var b = this.element.find("> ." + this.options.headerClass),
                c = 0,
                d = 0,
                e = this;
            return b.length ? b.each(function() {
                var b = a(this),
                    f = b.find("> ." + e.options.innerClass);
                f.length ? (f.css("bottom", "auto").css("overflow", "auto"), d = f.outerHeight(), f.css("bottom", "0")) : (b.css("bottom", "auto"), d = b.outerHeight(), b.css("bottom", "0")), c = d > c ? d : c
            }) : c = d = this.element.outerHeight(), c
        },
        _setupHeaders: function() {
            var b = this;
            this._headers[this.options.defaultClass] = {}, this._$sections.each(function() {
                var c = a(this),
                    d = c.data("midnight");
                "string" == typeof d && (d = d.trim(), "" !== d && (b._headers[d] = {}))
            }), {
                top: this.element.css("padding-top"),
                right: this.element.css("padding-right"),
                bottom: this.element.css("padding-bottom"),
                left: this.element.css("padding-left")
            }, this.element.css({
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                overflow: "hidden"
            }), this._updateHeaderHeight();
            var c = this.element.find("> ." + this.options.headerClass);
            c.length ? c.filter("." + this.options.defaultClass).length || c.filter("." + this.options.headerClass + ":first").clone(!0, !0).attr("class", this.options.headerClass + " " + this.options.defaultClass) : this.element.wrapInner('<div class="' + this.options.headerClass + " " + this.options.defaultClass + '"></div>');
            var c = this.element.find("> ." + this.options.headerClass),
                d = c.filter("." + this.options.defaultClass).clone(!0, !0);
            for (var e in this._headers)
                if (this._headers.hasOwnProperty(e) && "undefined" == typeof this._headers[e].element) {
                    var f = c.filter("." + e);
                    this._headers[e].element = f.length ? f : d.clone(!0, !0).removeClass(this.options.defaultClass).addClass(e).appendTo(this.element);
                    var g = {
                        position: "absolute",
                        overflow: "hidden",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    };
                    this._headers[e].element.css(g), this._transformMode !== !1 && this._headers[e].element.css(this._transformMode, "translateZ(0)"), this._headers[e].element.find("> ." + this.options.innerClass).length || this._headers[e].element.wrapInner('<div class="' + this.options.innerClass + '"></div>'), this._headers[e].inner = this._headers[e].element.find("> ." + this.options.innerClass), this._headers[e].inner.css(g), this._transformMode !== !1 && this._headers[e].inner.css(this._transformMode, "translateZ(0)"), this._headers[e].from = "", this._headers[e].progress = 0
                }
            c.each(function() {
                var c = a(this),
                    d = !1;
                for (var e in b._headers)
                    b._headers.hasOwnProperty(e) && c.hasClass(e) && (d = !0);
                c.find("> ." + b.options.innerClass).length || c.wrapInner('<div class="' + b.options.innerClass + '"></div>'), d ? c.show() : c.hide()
            })
        },
        _recalculateHeaders: function() {
            this._scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop, this._scrollTop = Math.max(this._scrollTop, 0), this._scrollTop = Math.min(this._scrollTop, this._documentHeight);
            var a = this._headerInfo.height,
                b = this._scrollTop + this._headerInfo.top,
                c = b + a;
            if ("function" == typeof window.getComputedStyle) {
                var d = window.getComputedStyle(this.element[0], null),
                    e = 0,
                    f = 0;
                if (this._transformMode !== !1 && "string" == typeof d.transform) {
                    var g = d.transform.match(/(-?[0-9\.]+)/g);
                    null !== g && g.length >= 6 && !isNaN(parseFloat(g[5])) && (f = parseFloat(g[5]))
                }
                d.top.indexOf("px") >= 0 && !isNaN(parseFloat(d.top)) && (e = parseFloat(d.top)), b += e + f, c += e + f
            }
            for (var h in this._headers)
                this._headers.hasOwnProperty(h) && (this._headers[h].from = "", this._headers[h].progress = 0);
            for (var i = 0; i < this._sections.length; i++)
                c >= this._sections[i].start && b <= this._sections[i].end && (this._headers[this._sections[i].className].visible = !0, b >= this._sections[i].start && c <= this._sections[i].end ? (this._headers[this._sections[i].className].from = "top", this._headers[this._sections[i].className].progress += 1) : c > this._sections[i].end && b < this._sections[i].end ? (this._headers[this._sections[i].className].from = "top", this._headers[this._sections[i].className].progress = 1 - (c - this._sections[i].end) / a) : c > this._sections[i].start && b < this._sections[i].start && ("top" === this._headers[this._sections[i].className].from ? this._headers[this._sections[i].className].progress += (c - this._sections[i].start) / a : (this._headers[this._sections[i].className].from = "bottom", this._headers[this._sections[i].className].progress = (c - this._sections[i].start) / a)))
        },
        _updateHeaders: function() {
            if ("undefined" != typeof this._headers[this.options.defaultClass]) {
                var a = 0,
                    b = "";
                for (var c in this._headers)
                    this._headers.hasOwnProperty(c) && "" !== !this._headers[c].from && (a += this._headers[c].progress, b = c);
                1 > a && ("" === this._headers[this.options.defaultClass].from ? (this._headers[this.options.defaultClass].from = "top" === this._headers[b].from ? "bottom" : "top", this._headers[this.options.defaultClass].progress = 1 - a) : this._headers[this.options.defaultClass].progress += 1 - a);
                for (var d in this._headers)
                    if (this._headers.hasOwnProperty(d) && "" !== !this._headers[d].from) {
                        var e = 100 * (1 - this._headers[d].progress);
                        e >= 100 && (e = 110), -100 >= e && (e = -110), "top" === this._headers[d].from ? this._transformMode !== !1 ? (this._headers[d].element[0].style[this._transformMode] = "translateY(-" + e + "%) translateZ(0)", this._headers[d].inner[0].style[this._transformMode] = "translateY(+" + e + "%) translateZ(0)") : (this._headers[d].element[0].style.top = "-" + e + "%", this._headers[d].inner[0].style.top = "+" + e + "%") : this._transformMode !== !1 ? (this._headers[d].element[0].style[this._transformMode] = "translateY(+" + e + "%) translateZ(0)", this._headers[d].inner[0].style[this._transformMode] = "translateY(-" + e + "%) translateZ(0)") : (this._headers[d].element[0].style.top = "+" + e + "%", this._headers[d].inner[0].style.top = "-" + e + "%")
                    }
            }
        },
        _recalculateSections: function() {
            this._documentHeight = a(document).height(), this._sections = [];
            for (var b = 0; b < this._$sections.length; b++) {
                var c = a(this._$sections[b]);
                this._sections.push({
                    element: c,
                    className: c.data("midnight"),
                    start: c.offset().top,
                    end: c.offset().top + c.outerHeight()
                })
            }
        },
        _updateHeaderHeight: function() {
            this._headerInfo.height = this._getContainerHeight(), this.element.css("height", this._headerInfo.height + "px")
        },
        _updateHeadersLoop: function() {
            var a = this;
            this._requestAnimationFrame(function() {
                a._updateHeadersLoop()
            }), this._recalculateHeaders(), this._updateHeaders()
        },
        _requestAnimationFrame: function(a) {
            var b = b || function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(a) {
                        window.setTimeout(a, 1e3 / 60)
                    }
            }();
            b(a)
        }
    })
}(jQuery), !function(a) {
    var b = {
        sectionContainer: "section",
        easing: "ease",
        animationTime: 1e3,
        pagination: !0,
        updateURL: !1,
        keyboard: !0,
        beforeMove: null,
        afterMove: null,
        loop: !0,
        responsiveFallback: !1,
        direction: "vertical"
    };
    a.fn.swipeEvents = function() {
        return this.each(function() {
            function b(a) {
                var b = a.originalEvent.touches;
                b && b.length && (d = b[0].pageX, e = b[0].pageY, f.bind("touchmove", c))
            }
            function c(a) {
                var b = a.originalEvent.touches;
                if (b && b.length) {
                    var g = d - b[0].pageX,
                        h = e - b[0].pageY;
                    g >= 50 && f.trigger("swipeLeft"), g <= -50 && f.trigger("swipeRight"), h >= 50 && f.trigger("swipeUp"), h <= -50 && f.trigger("swipeDown"), (Math.abs(g) >= 50 || Math.abs(h) >= 50) && f.unbind("touchmove", c)
                }
            }
            var d,
                e,
                f = a(this);
            f.bind("touchstart", b)
        })
    }, a.fn.onepage_scroll = function(c) {
        function d() {
            var b = !1,
                c = typeof f.responsiveFallback;
            "number" == c && (b = a(window).width() < f.responsiveFallback), "boolean" == c && (b = f.responsiveFallback), "function" == c && (valFunction = f.responsiveFallback(), b = valFunction, typeOFv = typeof b, "number" == typeOFv && (b = a(window).width() < valFunction)), b ? (a("body").addClass("disabled-onepage-scroll"), a(document).unbind("mousewheel DOMMouseScroll MozMousePixelScroll"), g.swipeEvents().unbind("swipeDown swipeUp")) : (a("body").hasClass("disabled-onepage-scroll") && (a("body").removeClass("disabled-onepage-scroll"), a("html, body, .wrapper").animate({
                scrollTop: 0
            }, "fast")), g.swipeEvents().bind("swipeDown", function(b) {
                a("body").hasClass("disabled-onepage-scroll") || b.preventDefault(), g.moveUp()
            }).bind("swipeUp", function(b) {
                a("body").hasClass("disabled-onepage-scroll") || b.preventDefault(), g.moveDown()
            }), a(document).bind("mousewheel DOMMouseScroll MozMousePixelScroll", function(a) {
                a.preventDefault();
                var b = a.originalEvent.wheelDelta || -a.originalEvent.detail;
                e(a, b)
            }))
        }
        function e(a, b) {
            deltaOfInterest = b;
            var c = (new Date).getTime();
            return c - lastAnimation < quietPeriod + f.animationTime ? void a.preventDefault() : (deltaOfInterest < 0 ? g.moveDown() : g.moveUp(), void (lastAnimation = c))
        }
        var f = a.extend({}, b, c),
            g = a(this),
            h = a(f.sectionContainer);
        if (total = h.length, status = "off", topPos = 0, leftPos = 0, lastAnimation = 0, quietPeriod = 500, paginationList = "", a.fn.transformPage = function(b, c, d) {
            if ("function" == typeof b.beforeMove && b.beforeMove(d), a("html").hasClass("ie8"))
                if ("horizontal" == b.direction) {
                    var e = g.width() / 100 * c;
                    a(this).animate({
                        left: e + "px"
                    }, b.animationTime)
                } else {
                    var e = g.height() / 100 * c;
                    a(this).animate({
                        top: e + "px"
                    }, b.animationTime)
                }
            else
                a(this).css({
                    "-webkit-transform": "horizontal" == b.direction ? "translate3d(" + c + "%, 0, 0)" : "translate3d(0, " + c + "%, 0)",
                    "-webkit-transition": "all " + b.animationTime + "ms " + b.easing,
                    "-moz-transform": "horizontal" == b.direction ? "translate3d(" + c + "%, 0, 0)" : "translate3d(0, " + c + "%, 0)",
                    "-moz-transition": "all " + b.animationTime + "ms " + b.easing,
                    "-ms-transform": "horizontal" == b.direction ? "translate3d(" + c + "%, 0, 0)" : "translate3d(0, " + c + "%, 0)",
                    "-ms-transition": "all " + b.animationTime + "ms " + b.easing,
                    transform: "horizontal" == b.direction ? "translate3d(" + c + "%, 0, 0)" : "translate3d(0, " + c + "%, 0)",
                    transition: "all " + b.animationTime + "ms " + b.easing
                });
            a(this).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(a) {
                "function" == typeof b.afterMove && b.afterMove(d)
            })
        }, a.fn.moveDown = function() {
            var b = a(this);
            if (index = a(f.sectionContainer + ".active").data("index"), current = a(f.sectionContainer + "[data-index='" + index + "']"), next = a(f.sectionContainer + "[data-index='" + (index + 1) + "']"), next.length < 1) {
                if (1 != f.loop)
                    return;
                pos = 0, next = a(f.sectionContainer + "[data-index='1']")
            } else
                pos = 100 * index * -1;
            if ("function" == typeof f.beforeMove && f.beforeMove(next.data("index")), current.removeClass("active"), next.addClass("active"), 1 == f.pagination && (a(".onepage-pagination li a[data-index='" + index + "']").removeClass("active"), a(".onepage-pagination li a[data-index='" + next.data("index") + "']").addClass("active")), a("body")[0].className = a("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, ""), a("body").addClass("viewing-page-" + next.data("index")), history.replaceState && 1 == f.updateURL) {
                var c = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + (index + 1);
                history.pushState({}, document.title, c)
            }
            b.transformPage(f, pos, next.data("index"))
        }, a.fn.moveUp = function() {
            var b = a(this);
            if (index = a(f.sectionContainer + ".active").data("index"), current = a(f.sectionContainer + "[data-index='" + index + "']"), next = a(f.sectionContainer + "[data-index='" + (index - 1) + "']"), next.length < 1) {
                if (1 != f.loop)
                    return;
                pos = 100 * (total - 1) * -1, next = a(f.sectionContainer + "[data-index='" + total + "']")
            } else
                pos = 100 * (next.data("index") - 1) * -1;
            if ("function" == typeof f.beforeMove && f.beforeMove(next.data("index")), current.removeClass("active"), next.addClass("active"), 1 == f.pagination && (a(".onepage-pagination li a[data-index='" + index + "']").removeClass("active"), a(".onepage-pagination li a[data-index='" + next.data("index") + "']").addClass("active")), a("body")[0].className = a("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, ""), a("body").addClass("viewing-page-" + next.data("index")), history.replaceState && 1 == f.updateURL) {
                var c = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + (index - 1);
                history.pushState({}, document.title, c)
            }
            b.transformPage(f, pos, next.data("index"))
        }, a.fn.moveTo = function(b) {
            if (current = a(f.sectionContainer + ".active"), next = a(f.sectionContainer + "[data-index='" + b + "']"), next.length > 0) {
                if ("function" == typeof f.beforeMove && f.beforeMove(next.data("index")), current.removeClass("active"), next.addClass("active"), a(".onepage-pagination li a.active").removeClass("active"), a(".onepage-pagination li a[data-index='" + b + "']").addClass("active"), a("body")[0].className = a("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, ""), a("body").addClass("viewing-page-" + next.data("index")), pos = 100 * (b - 1) * -1, history.replaceState && 1 == f.updateURL) {
                    var c = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + (b - 1);
                    history.pushState({}, document.title, c)
                }
                g.transformPage(f, pos, b)
            }
        }, g.addClass("onepage-wrapper").css("position", "relative"), a.each(h, function(b) {
            a(this).css({
                position: "absolute",
                top: topPos + "%"
            }).addClass("section").attr("data-index", b + 1), a(this).css({
                position: "absolute",
                left: "horizontal" == f.direction ? leftPos + "%" : 0,
                top: "vertical" == f.direction || "horizontal" != f.direction ? topPos + "%" : 0
            }), "horizontal" == f.direction ? leftPos += 100 : topPos += 100, 1 == f.pagination && (paginationList += "<li><a data-index='" + (b + 1) + "' href='#" + (b + 1) + "'></a></li>")
        }), g.swipeEvents().bind("swipeDown", function(b) {
            a("body").hasClass("disabled-onepage-scroll") || b.preventDefault(), g.moveUp()
        }).bind("swipeUp", function(b) {
            a("body").hasClass("disabled-onepage-scroll") || b.preventDefault(), g.moveDown()
        }), 1 == f.pagination && (a("ul.onepage-pagination").length < 1 && a("<ul class='onepage-pagination'></ul>").prependTo("body"), "horizontal" == f.direction ? (posLeft = g.find(".onepage-pagination").width() / 2 * -1, g.find(".onepage-pagination").css("margin-left", posLeft)) : (posTop = g.find(".onepage-pagination").height() / 2 * -1, g.find(".onepage-pagination").css("margin-top", posTop)), a("ul.onepage-pagination").html(paginationList)), "" != window.location.hash && "#1" != window.location.hash)
            if (init_index = window.location.hash.replace("#", ""), parseInt(init_index) <= total && parseInt(init_index) > 0) {
                if (a(f.sectionContainer + "[data-index='" + init_index + "']").addClass("active"), a("body").addClass("viewing-page-" + init_index), 1 == f.pagination && a(".onepage-pagination li a[data-index='" + init_index + "']").addClass("active"), next = a(f.sectionContainer + "[data-index='" + init_index + "']"), next && (next.addClass("active"), 1 == f.pagination && a(".onepage-pagination li a[data-index='" + init_index + "']").addClass("active"), a("body")[0].className = a("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, ""), a("body").addClass("viewing-page-" + next.data("index")), history.replaceState && 1 == f.updateURL)) {
                    var i = window.location.href.substr(0, window.location.href.indexOf("#")) + "#" + init_index;
                    history.pushState({}, document.title, i)
                }
                pos = 100 * (init_index - 1) * -1, g.transformPage(f, pos, init_index)
            } else
                a(f.sectionContainer + "[data-index='1']").addClass("active"), a("body").addClass("viewing-page-1"), 1 == f.pagination && a(".onepage-pagination li a[data-index='1']").addClass("active");
        else
            a(f.sectionContainer + "[data-index='1']").addClass("active"), a("body").addClass("viewing-page-1"), 1 == f.pagination && a(".onepage-pagination li a[data-index='1']").addClass("active");
        return 1 == f.pagination && a(".onepage-pagination li a").click(function() {
            var b = a(this).data("index");
            g.moveTo(b)
        }), a(document).bind("mousewheel DOMMouseScroll MozMousePixelScroll", function(b) {
            b.preventDefault();
            var c = b.originalEvent.wheelDelta || -b.originalEvent.detail;
            a("body").hasClass("disabled-onepage-scroll") || e(b, c)
        }), 0 != f.responsiveFallback && (a(window).resize(function() {
            d()
        }), d()), 1 == f.keyboard && a(document).keydown(function(b) {
            var c = b.target.tagName.toLowerCase();
            if (!a("body").hasClass("disabled-onepage-scroll"))
                switch (b.which) {
                case 38:
                    "input" != c && "textarea" != c && g.moveUp();
                    break;
                case 40:
                    "input" != c && "textarea" != c && g.moveDown();
                    break;
                case 32:
                    "input" != c && "textarea" != c && g.moveDown();
                    break;
                case 33:
                    "input" != c && "textarea" != c && g.moveUp();
                    break;
                case 34:
                    "input" != c && "textarea" != c && g.moveDown();
                    break;
                case 36:
                    g.moveTo(1);
                    break;
                case 35:
                    g.moveTo(total);
                    break;
                default:
                    return
                }
        }), !1
    }
}(window.jQuery), function(a, b, c, d) {
    "use strict";
    function e(b, c) {
        this.element = b, this.$context = a(b).data("api", this), this.$layers = this.$context.find(".parallax__layer");
        var d = {
            calibrateX: this.$context.data("calibrate-x") || null,
            calibrateY: this.$context.data("calibrate-y") || null,
            invertX: this.$context.data("invert-x") || null,
            invertY: this.$context.data("invert-y") || null,
            limitX: parseFloat(this.$context.data("limit-x")) || null,
            limitY: parseFloat(this.$context.data("limit-y")) || null,
            scalarX: parseFloat(this.$context.data("scalar-x")) || null,
            scalarY: parseFloat(this.$context.data("scalar-y")) || null,
            frictionX: parseFloat(this.$context.data("friction-x")) || null,
            frictionY: parseFloat(this.$context.data("friction-y")) || null,
            originX: parseFloat(this.$context.data("origin-x")) || null,
            originY: parseFloat(this.$context.data("origin-y")) || null
        };
        for (var e in d)
            null === d[e] && delete d[e];
        a.extend(this, h, c, d), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depths = [], this.raf = null, this.bounds = null, this.ex = 0, this.ey = 0, this.ew = 0, this.eh = 0, this.ecx = 0, this.ecy = 0, this.erx = 0, this.ery = 0, this.cx = 0, this.cy = 0, this.ix = 0, this.iy = 0, this.mx = 0, this.my = 0, this.vx = 0, this.vy = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.initialise()
    }
    var f = "parallax",
        g = 30,
        h = {
            relativeInput: !1,
            clipRelativeInput: !1,
            calibrationThreshold: 100,
            calibrationDelay: 500,
            supportDelay: 500,
            calibrateX: !1,
            calibrateY: !0,
            invertX: !0,
            invertY: !0,
            limitX: !1,
            limitY: !1,
            scalarX: 10,
            scalarY: 10,
            frictionX: .1,
            frictionY: .1,
            originX: .5,
            originY: .5
        };
    e.prototype.transformSupport = function(a) {
        for (var e = c.createElement("div"), f = !1, g = null, h = !1, i = null, j = null, k = 0, l = this.vendors.length; k < l; k++)
            if (null !== this.vendors[k] ? (i = this.vendors[k][0] + "transform", j = this.vendors[k][1] + "Transform") : (i = "transform", j = "transform"), e.style[j] !== d) {
                f = !0;
                break
            }
        switch (a) {
        case "2D":
            h = f;
            break;
        case "3D":
            if (f) {
                var m = c.body || c.createElement("body"),
                    n = c.documentElement,
                    o = n.style.overflow;
                c.body || (n.style.overflow = "hidden", n.appendChild(m), m.style.overflow = "hidden", m.style.background = ""), m.appendChild(e), e.style[j] = "translate3d(1px,1px,1px)", g = b.getComputedStyle(e).getPropertyValue(i), h = g !== d && g.length > 0 && "none" !== g, n.style.overflow = o, m.removeChild(e)
            }
        }
        return h
    }, e.prototype.ww = null, e.prototype.wh = null, e.prototype.wcx = null, e.prototype.wcy = null, e.prototype.wrx = null, e.prototype.wry = null, e.prototype.portrait = null, e.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), e.prototype.vendors = [null, ["-webkit-", "webkit"], ["-moz-", "Moz"], ["-o-", "O"], ["-ms-", "ms"]], e.prototype.motionSupport = !!b.DeviceMotionEvent, e.prototype.orientationSupport = !!b.DeviceOrientationEvent, e.prototype.orientationStatus = 0, e.prototype.transform2DSupport = e.prototype.transformSupport("2D"), e.prototype.transform3DSupport = e.prototype.transformSupport("3D"), e.prototype.propertyCache = {}, e.prototype.initialise = function() {
        "static" === this.$context.css("position") && this.$context.css({
            position: "relative"
        }), this.accelerate(this.$context), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay)
    }, e.prototype.updateLayers = function() {
        this.$layers = this.$context.find(".parallax__layer"), this.depths = [], this.$layers.css({
            position: "absolute",
            display: "block",
            left: 0,
            top: 0
        }), this.$layers.first().css({
            position: "relative"
        }), this.accelerate(this.$layers), this.$layers.each(a.proxy(function(b, c) {
            this.depths.push(a(c).data("depth") || 0)
        }, this))
    }, e.prototype.updateDimensions = function() {
        this.ww = b.innerWidth, this.wh = b.innerHeight, this.wcx = this.ww * this.originX, this.wcy = this.wh * this.originY, this.wrx = Math.max(this.wcx, this.ww - this.wcx), this.wry = Math.max(this.wcy, this.wh - this.wcy)
    }, e.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect(), this.ex = this.bounds.left, this.ey = this.bounds.top, this.ew = this.bounds.width, this.eh = this.bounds.height, this.ecx = this.ew * this.originX, this.ecy = this.eh * this.originY, this.erx = Math.max(this.ecx, this.ew - this.ecx), this.ery = Math.max(this.ecy, this.eh - this.ecy)
    }, e.prototype.queueCalibration = function(a) {
        clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, a)
    }, e.prototype.enable = function() {
        this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, b.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, b.addEventListener("mousemove", this.onMouseMove)), b.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
    }, e.prototype.disable = function() {
        this.enabled && (this.enabled = !1, this.orientationSupport ? b.removeEventListener("deviceorientation", this.onDeviceOrientation) : b.removeEventListener("mousemove", this.onMouseMove), b.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
    }, e.prototype.calibrate = function(a, b) {
        this.calibrateX = a === d ? this.calibrateX : a, this.calibrateY = b === d ? this.calibrateY : b
    }, e.prototype.invert = function(a, b) {
        this.invertX = a === d ? this.invertX : a, this.invertY = b === d ? this.invertY : b
    }, e.prototype.friction = function(a, b) {
        this.frictionX = a === d ? this.frictionX : a, this.frictionY = b === d ? this.frictionY : b
    }, e.prototype.scalar = function(a, b) {
        this.scalarX = a === d ? this.scalarX : a, this.scalarY = b === d ? this.scalarY : b
    }, e.prototype.limit = function(a, b) {
        this.limitX = a === d ? this.limitX : a, this.limitY = b === d ? this.limitY : b
    }, e.prototype.origin = function(a, b) {
        this.originX = a === d ? this.originX : a, this.originY = b === d ? this.originY : b
    }, e.prototype.clamp = function(a, b, c) {
        return a = Math.max(a, b), a = Math.min(a, c)
    }, e.prototype.css = function(b, c, e) {
        var f = this.propertyCache[c];
        if (!f)
            for (var g = 0, h = this.vendors.length; g < h; g++)
                if (f = null !== this.vendors[g] ? a.camelCase(this.vendors[g][1] + "-" + c) : c, b.style[f] !== d) {
                    this.propertyCache[c] = f;
                    break
                }
        b.style[f] = e
    }, e.prototype.accelerate = function(a) {
        for (var b = 0, c = a.length; b < c; b++) {
            var d = a[b];
            this.css(d, "transform", "translate3d(0,0,0)"), this.css(d, "transform-style", "preserve-3d"), this.css(d, "backface-visibility", "hidden")
        }
    }, e.prototype.setPosition = function(a, b, c) {
        b += "px", c += "px", this.transform3DSupport ? this.css(a, "transform", "translate3d(" + b + "," + c + ",0)") : this.transform2DSupport ? this.css(a, "transform", "translate(" + b + "," + c + ")") : (a.style.left = b, a.style.top = c)
    }, e.prototype.onOrientationTimer = function(a) {
        this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
    }, e.prototype.onCalibrationTimer = function(a) {
        this.calibrationFlag = !0
    }, e.prototype.onWindowResize = function(a) {
        this.updateDimensions()
    }, e.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var a = this.ix - this.cx,
            b = this.iy - this.cy;
        (Math.abs(a) > this.calibrationThreshold || Math.abs(b) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.mx = this.calibrateX ? b : this.iy, this.my = this.calibrateY ? a : this.ix) : (this.mx = this.calibrateX ? a : this.ix, this.my = this.calibrateY ? b : this.iy), this.mx *= this.ew * (this.scalarX / 100), this.my *= this.eh * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)), this.vx += (this.mx - this.vx) * this.frictionX, this.vy += (this.my - this.vy) * this.frictionY;
        for (var c = 0, d = this.$layers.length; c < d; c++) {
            var e = this.depths[c],
                f = this.$layers[c],
                g = this.vx * e * (this.invertX ? -1 : 1),
                h = this.vy * e * (this.invertY ? -1 : 1);
            this.setPosition(f, g, h)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }, e.prototype.onDeviceOrientation = function(a) {
        if (!this.desktop && null !== a.beta && null !== a.gamma) {
            this.orientationStatus = 1;
            var c = (a.beta || 0) / g,
                d = (a.gamma || 0) / g,
                e = b.innerHeight > b.innerWidth;
            this.portrait !== e && (this.portrait = e, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.cx = c, this.cy = d), this.ix = c, this.iy = d
        }
    }, e.prototype.onMouseMove = function(a) {
        var b = a.clientX,
            c = a.clientY;
        !this.orientationSupport && this.relativeInput ? (this.clipRelativeInput && (b = Math.max(b, this.ex), b = Math.min(b, this.ex + this.ew), c = Math.max(c, this.ey), c = Math.min(c, this.ey + this.eh)), this.ix = (b - this.ex - this.ecx) / this.erx, this.iy = (c - this.ey - this.ecy) / this.ery) : (this.ix = (b - this.wcx) / this.wrx, this.iy = (c - this.wcy) / this.wry)
    };
    var i = {
        enable: e.prototype.enable,
        disable: e.prototype.disable,
        updateLayers: e.prototype.updateLayers,
        calibrate: e.prototype.calibrate,
        friction: e.prototype.friction,
        invert: e.prototype.invert,
        scalar: e.prototype.scalar,
        limit: e.prototype.limit,
        origin: e.prototype.origin
    };
    a.fn[f] = function(b) {
        var c = arguments;
        return this.each(function() {
            var d = a(this),
                g = d.data(f);
            g || (g = new e(this, b), d.data(f, g)), i[b] && g[b].apply(g, Array.prototype.slice.call(c, 1))
        })
    }
}(window.jQuery || window.Zepto, window, document), function(a) {
    var b,
        c,
        d,
        e = !1,
        f = 0,
        g = 0,
        h = 0,
        i = 0,
        j = null,
        k = .97,
        l = 0,
        m = 1,
        n = .1,
        o = function(a) {
            g += a, l += (g - h) * m, h = g
        },
        p = function() {
            (l < -n || l > n) && (f += l, f > i ? f = l = 0 : f < c && (l = 0, f = c), b.scrollTop(-f), l *= k, j && j())
        },
        q = function() {
            e && (requestAnimFrame(q), p())
        },
        r = function(a) {
            a.preventDefault();
            var c = a.originalEvent,
                e = c.detail ? c.detail * -1 : c.wheelDelta / 40,
                g = e < 0 ? -1 : 1;
            g != d && (l = 0, d = g), f = -b.scrollTop(), o(e)
        };
    window.requestAnimFrame = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
                window.setTimeout(a, 1e3 / 60)
            }
    }();
    (function() {
        var a = [],
            b = null,
            c = 30;
        return function(d) {
            if (0 == d)
                return d;
            if (null != b)
                return d * b;
            var e = Math.abs(d);
            a:
            do {
                for (var f = 0; f < a.length; ++f)
                    if (e <= a[f]) {
                        a.splice(f, 0, e);
                        break a
                    }
                a.push(e)
            } while (!1);
            var g = c / a[Math.floor(a.length / 3)];
            return 500 == a.length && (b = g), d * g
        }
    })();
    a.fn.smoothWheel = function() {
        var d = jQuery.extend({}, arguments[0]);
        return this.each(function(i, k) {
            "ontouchstart" in window || (b = a(this), b.bind("mousewheel", r), b.bind("DOMMouseScroll", r), g = h = b.get(0).scrollTop, f = -g, c = b.get(0).clientHeight - b.get(0).scrollHeight, d.onRender && (j = d.onRender), d.remove ? (log("122", "smoothWheel", "remove", ""), e = !1, b.unbind("mousewheel", r), b.unbind("DOMMouseScroll", r)) : e || (e = !0, q()))
        })
    }
}(jQuery), String.prototype.rightChars = function(a) {
    return a <= 0 ? "" : a > this.length ? this : this.substring(this.length, this.length - a)
}, function(a) {
    var b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n = {
            highlightSpeed: 60,
            typeSpeed: 100,
            clearDelay: 500,
            typeDelay: 200,
            clearOnHighlight: !0,
            typerDataAttr: "data-typer-targets",
            typerInterval: 1200,
            highlightColor: "rgba(255, 255, 255, 0.99)",
            textColor: "#1f142f",
            initialDelay: 600
        };
    e = function(b, c) {
        "rgba(255, 255, 255, 0)" === b && (b = "rgb(0, 0, 0)");
        var d = a("h3#typer");
        return d.addClass("hero__subtitle--span"), a("<span></span>").css("color", b).css("background-color", c)
    }, i = function(a) {
        return !isNaN(parseFloat(a)) && isFinite(a)
    }, h = function(a) {
        a.removeData(["typePosition", "highlightPosition", "leftStop", "rightStop", "primaryColor", "backgroundColor", "text", "typing"])
    }, d = function(a) {
        var b = a.data("text"),
            c = a.data("oldLeft"),
            e = a.data("oldRight");
        return b && 0 !== b.length ? (a.text(c + b.charAt(0) + e).data({
            oldLeft: c + b.charAt(0),
            text: b.substring(1)
        }), void setTimeout(function() {
            d(a)
        }, l())) : void h(a)
    }, c = function(a) {
        a.find("span").remove(), a.removeClass("hero__subtitle--span"), setTimeout(function() {
            d(a)
        }, g())
    }, b = function(a) {
        var d,
            g,
            h,
            j = a.data("highlightPosition");
        return i(j) || (j = a.data("rightStop") + 1), j <= a.data("leftStop") ? void setTimeout(function() {
            c(a)
        }, f()) : (d = a.text().substring(0, j - 1), g = a.text().substring(j - 1, a.data("rightStop") + 1), h = a.text().substring(a.data("rightStop") + 1), a.html(d).append(e(a.data("backgroundColor"), a.data("primaryColor")).append(g)).append(h), a.data("highlightPosition", j - 1), void setTimeout(function() {
            return b(a)
        }, k()))
    }, j = function(b) {
        var c;
        if (!b.data("typing")) {
            try {
                c = JSON.parse(b.attr(a.typer.options.typerDataAttr)).targets
            } catch (a) {}
            "undefined" == typeof c && (c = a.map(b.attr(a.typer.options.typerDataAttr).split(","), function(b) {
                return a.trim(b)
            })), b.typeTo(c[Math.floor(Math.random() * c.length)])
        }
    }, a.typer = function() {
        return {
            options: n
        }
    }(), a.extend(a.typer, {
        options: n
    }), a.fn.typer = function() {
        var b = a(this);
        return b.each(function() {
            var b = a(this);
            "undefined" != typeof b.attr(a.typer.options.typerDataAttr) && (j(b), setInterval(function() {
                j(b)
            }, m()))
        })
    }, a.fn.typeTo = function(c) {
        var d = a(this),
            e = d.text(),
            f = 0,
            g = 0;
        if (e === c)
            return d;
        if (e !== d.html())
            return d;
        for (d.data("typing", !0); e.charAt(f) === c.charAt(f);)
            f++;
        for (; e.rightChars(g) === c.rightChars(g);)
            g++;
        c = c.substring(f, c.length - g + 1), d.data({
            oldLeft: e.substring(0, f),
            oldRight: e.rightChars(g - 1),
            leftStop: f,
            rightStop: e.length - g,
            primaryColor: a.typer.options.highlightColor || d.css("color"),
            backgroundColor: a.typer.options.textColor || d.css("background-color"),
            text: c
        });
        var h = function() {
            return b(d), d
        };
        window.setTimeout(h, a.typer.options.initialDelay)
    }, k = function() {
        return a.typer.options.highlightSpeed
    }, l = function() {
        return a.typer.options.typeSpeed
    }, f = function() {
        return a.typer.options.clearDelay
    }, g = function() {
        return a.typer.options.typeDelay
    }, m = function() {
        return a.typer.options.typerInterval
    }
}(jQuery), function() {
    "use strict";
    function a(d) {
        if (!d)
            throw new Error("No options passed to Waypoint constructor");
        if (!d.element)
            throw new Error("No element option passed to Waypoint constructor");
        if (!d.handler)
            throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + b, this.options = a.Adapter.extend({}, a.defaults, d), this.element = this.options.element, this.adapter = new a.Adapter(this.element), this.callback = d.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = a.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = a.Context.findOrCreateByElement(this.options.context), a.offsetAliases[this.options.offset] && (this.options.offset = a.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), c[this.key] = this, b += 1
    }
    var b = 0,
        c = {};
    a.prototype.queueTrigger = function(a) {
        this.group.queueTrigger(this, a)
    }, a.prototype.trigger = function(a) {
        this.enabled && this.callback && this.callback.apply(this, a)
    }, a.prototype.destroy = function() {
        this.context.remove(this), this.group.remove(this), delete c[this.key]
    }, a.prototype.disable = function() {
        return this.enabled = !1, this
    }, a.prototype.enable = function() {
        return this.context.refresh(), this.enabled = !0, this
    }, a.prototype.next = function() {
        return this.group.next(this)
    }, a.prototype.previous = function() {
        return this.group.previous(this)
    }, a.invokeAll = function(a) {
        var b = [];
        for (var d in c)
            b.push(c[d]);
        for (var e = 0, f = b.length; e < f; e++)
            b[e][a]()
    }, a.destroyAll = function() {
        a.invokeAll("destroy")
    }, a.disableAll = function() {
        a.invokeAll("disable")
    }, a.enableAll = function() {
        a.invokeAll("enable")
    }, a.refreshAll = function() {
        a.Context.refreshAll()
    }, a.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    }, a.viewportWidth = function() {
        return document.documentElement.clientWidth
    }, a.adapters = [], a.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, a.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }, window.Waypoint = a
}(), function() {
    "use strict";
    function a(a) {
        window.setTimeout(a, 1e3 / 60)
    }
    function b(a) {
        this.element = a, this.Adapter = e.Adapter, this.adapter = new this.Adapter(a), this.key = "waypoint-context-" + c, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, a.waypointContextKey = this.key, d[a.waypointContextKey] = this, c += 1, this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
    }
    var c = 0,
        d = {},
        e = window.Waypoint,
        f = window.onload;
    b.prototype.add = function(a) {
        var b = a.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[b][a.key] = a, this.refresh()
    }, b.prototype.checkEmpty = function() {
        var a = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            b = this.Adapter.isEmptyObject(this.waypoints.vertical);
        a && b && (this.adapter.off(".waypoints"), delete d[this.key])
    }, b.prototype.createThrottledResizeHandler = function() {
        function a() {
            b.handleResize(), b.didResize = !1
        }
        var b = this;
        this.adapter.on("resize.waypoints", function() {
            b.didResize || (b.didResize = !0, e.requestAnimationFrame(a))
        })
    }, b.prototype.createThrottledScrollHandler = function() {
        function a() {
            b.handleScroll(), b.didScroll = !1
        }
        var b = this;
        this.adapter.on("scroll.waypoints", function() {
            b.didScroll && !e.isTouch || (b.didScroll = !0, e.requestAnimationFrame(a))
        })
    }, b.prototype.handleResize = function() {
        e.Context.refreshAll()
    }, b.prototype.handleScroll = function() {
        var a = {},
            b = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left"
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up"
                }
            };
        for (var c in b) {
            var d = b[c],
                e = d.newScroll > d.oldScroll,
                f = e ? d.forward : d.backward;
            for (var g in this.waypoints[c]) {
                var h = this.waypoints[c][g],
                    i = d.oldScroll < h.triggerPoint,
                    j = d.newScroll >= h.triggerPoint,
                    k = i && j,
                    l = !i && !j;
                (k || l) && (h.queueTrigger(f), a[h.group.id] = h.group)
            }
        }
        for (var m in a)
            a[m].flushTriggers();
        this.oldScroll = {
            x: b.horizontal.newScroll,
            y: b.vertical.newScroll
        }
    }, b.prototype.innerHeight = function() {
        return this.element == this.element.window ? e.viewportHeight() : this.adapter.innerHeight()
    }, b.prototype.remove = function(a) {
        delete this.waypoints[a.axis][a.key], this.checkEmpty()
    }, b.prototype.innerWidth = function() {
        return this.element == this.element.window ? e.viewportWidth() : this.adapter.innerWidth()
    }, b.prototype.destroy = function() {
        var a = [];
        for (var b in this.waypoints)
            for (var c in this.waypoints[b])
                a.push(this.waypoints[b][c]);
        for (var d = 0, e = a.length; d < e; d++)
            a[d].destroy()
    }, b.prototype.refresh = function() {
        var a,
            b = this.element == this.element.window,
            c = b ? void 0 : this.adapter.offset(),
            d = {};
        this.handleScroll(), a = {
            horizontal: {
                contextOffset: b ? 0 : c.left,
                contextScroll: b ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: b ? 0 : c.top,
                contextScroll: b ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        };
        for (var f in a) {
            var g = a[f];
            for (var h in this.waypoints[f]) {
                var i,
                    j,
                    k,
                    l,
                    m,
                    n = this.waypoints[f][h],
                    o = n.options.offset,
                    p = n.triggerPoint,
                    q = 0,
                    r = null == p;
                n.element !== n.element.window && (q = n.adapter.offset()[g.offsetProp]), "function" == typeof o ? o = o.apply(n) : "string" == typeof o && (o = parseFloat(o), n.options.offset.indexOf("%") > -1 && (o = Math.ceil(g.contextDimension * o / 100))), i = g.contextScroll - g.contextOffset, n.triggerPoint = q + i - o, j = p < g.oldScroll, k = n.triggerPoint >= g.oldScroll, l = j && k, m = !j && !k, !r && l ? (n.queueTrigger(g.backward), d[n.group.id] = n.group) : !r && m ? (n.queueTrigger(g.forward), d[n.group.id] = n.group) : r && g.oldScroll >= n.triggerPoint && (n.queueTrigger(g.forward), d[n.group.id] = n.group)
            }
        }
        return e.requestAnimationFrame(function() {
            for (var a in d)
                d[a].flushTriggers()
        }), this
    }, b.findOrCreateByElement = function(a) {
        return b.findByElement(a) || new b(a)
    }, b.refreshAll = function() {
        for (var a in d)
            d[a].refresh()
    }, b.findByElement = function(a) {
        return d[a.waypointContextKey]
    }, window.onload = function() {
        f && f(), b.refreshAll()
    }, e.requestAnimationFrame = function(b) {
        var c = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || a;
        c.call(window, b)
    }, e.Context = b
}(), function() {
    "use strict";
    function a(a, b) {
        return a.triggerPoint - b.triggerPoint
    }
    function b(a, b) {
        return b.triggerPoint - a.triggerPoint
    }
    function c(a) {
        this.name = a.name, this.axis = a.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), d[this.axis][this.name] = this
    }
    var d = {
            vertical: {},
            horizontal: {}
        },
        e = window.Waypoint;
    c.prototype.add = function(a) {
        this.waypoints.push(a)
    }, c.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }, c.prototype.flushTriggers = function() {
        for (var c in this.triggerQueues) {
            var d = this.triggerQueues[c],
                e = "up" === c || "left" === c;
            d.sort(e ? b : a);
            for (var f = 0, g = d.length; f < g; f += 1) {
                var h = d[f];
                (h.options.continuous || f === d.length - 1) && h.trigger([c])
            }
        }
        this.clearTriggerQueues()
    }, c.prototype.next = function(b) {
        this.waypoints.sort(a);
        var c = e.Adapter.inArray(b, this.waypoints),
            d = c === this.waypoints.length - 1;
        return d ? null : this.waypoints[c + 1]
    }, c.prototype.previous = function(b) {
        this.waypoints.sort(a);
        var c = e.Adapter.inArray(b, this.waypoints);
        return c ? this.waypoints[c - 1] : null
    }, c.prototype.queueTrigger = function(a, b) {
        this.triggerQueues[b].push(a)
    }, c.prototype.remove = function(a) {
        var b = e.Adapter.inArray(a, this.waypoints);
        b > -1 && this.waypoints.splice(b, 1)
    }, c.prototype.first = function() {
        return this.waypoints[0]
    }, c.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1]
    }, c.findOrCreate = function(a) {
        return d[a.axis][a.name] || new c(a)
    }, e.Group = c
}(), function() {
    "use strict";
    function a(a) {
        this.$element = b(a)
    }
    var b = window.jQuery,
        c = window.Waypoint;
    b.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function(b, c) {
        a.prototype[c] = function() {
            var a = Array.prototype.slice.call(arguments);
            return this.$element[c].apply(this.$element, a)
        }
    }), b.each(["extend", "inArray", "isEmptyObject"], function(c, d) {
        a[d] = b[d]
    }), c.adapters.push({
        name: "jquery",
        Adapter: a
    }), c.Adapter = a
}(), function() {
    "use strict";
    function a(a) {
        return function() {
            var c = [],
                d = arguments[0];
            return a.isFunction(arguments[0]) && (d = a.extend({}, arguments[1]), d.handler = arguments[0]), this.each(function() {
                var e = a.extend({}, d, {
                    element: this
                });
                "string" == typeof e.context && (e.context = a(this).closest(e.context)[0]), c.push(new b(e))
            }), c
        }
    }
    var b = window.Waypoint;
    window.jQuery && (window.jQuery.fn.waypoint = a(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = a(window.Zepto))
}(), function() {
    "use strict";
    function a() {}
    function b(a) {
        this.options = c.Adapter.extend({}, b.defaults, a), this.axis = this.options.horizontal ? "horizontal" : "vertical", this.waypoints = [], this.element = this.options.element, this.createWaypoints()
    }
    var c = window.Waypoint;
    b.prototype.createWaypoints = function() {
        for (var a = {
                vertical: [{
                    down: "enter",
                    up: "exited",
                    offset: "30%"
                }, {
                    down: "entered",
                    up: "exit",
                    offset: "bottom-in-view"
                }, {
                    down: "exit",
                    up: "entered",
                    offset: 0
                }, {
                    down: "exited",
                    up: "enter",
                    offset: "-30%"
                }],
                horizontal: [{
                    right: "enter",
                    left: "exited",
                    offset: "100%"
                }, {
                    right: "entered",
                    left: "exit",
                    offset: "right-in-view"
                }, {
                    right: "exit",
                    left: "entered",
                    offset: 0
                }, {
                    right: "exited",
                    left: "enter",
                    offset: function() {
                        return -this.adapter.outerWidth()
                    }
                }]
            }, b = 0, c = a[this.axis].length; b < c; b++) {
            var d = a[this.axis][b];
            this.createWaypoint(d)
        }
    }, b.prototype.createWaypoint = function(a) {
        var b = this;
        this.waypoints.push(new c({
            context: this.options.context,
            element: this.options.element,
            enabled: this.options.enabled,
            handler: function(a) {
                return function(c) {
                    b.options[a[c]].call(b, c)
                }
            }(a),
            offset: a.offset,
            horizontal: !1
        }))
    }, b.prototype.destroy = function() {
        for (var a = 0, b = this.waypoints.length; a < b; a++)
            this.waypoints[a].destroy();
        this.waypoints = []
    }, b.prototype.disable = function() {
        for (var a = 0, b = this.waypoints.length; a < b; a++)
            this.waypoints[a].disable()
    }, b.prototype.enable = function() {
        for (var a = 0, b = this.waypoints.length; a < b; a++)
            this.waypoints[a].enable()
    }, b.defaults = {
        context: window,
        enabled: !0,
        enter: a,
        entered: a,
        exit: a,
        exited: a
    }, c.Inview = b
}();
var fixedScrollLayout = function() {
    function a(a) {
        a.$navlinks.on("click", function() {
            return c(a.$sections.eq($(this).index()).offset().top, a), !1
        }), a.$navlinksBlack.on("click", function() {
            return c(a.$sections.eq($(this).index()).offset().top, a), !1
        }), a.$sections.each(function() {
            var c = $(this);
            new Waypoint.Inview({
                element: c,
                enter: function(d) {
                    b(c, a)
                }
            })
        })
    }
    function b(a, b) {
        b.$navlinks.eq(b.currentLink).removeClass("nav__element--current"), b.$navlinksBlack.eq(b.currentLink).removeClass("nav__element--current"), b.currentLink = a.index("section"), b.$navlinks.eq(b.currentLink).addClass("nav__element--current"), b.$navlinksBlack.eq(b.currentLink).addClass("nav__element--current")
    }
    function c(a, b) {
        b.$body.stop().animate({
            scrollTop: a
        }, b.animspeed, b.animeasing)
    }
    return {
        init: a
    }
}();
!function() {
    function a(b) {
        if (!(this instanceof a))
            return null == b ? new a : new a(b);
        if ("function" == typeof b)
            return this.random = b, this;
        var c;
        arguments.length && (this.seed = 0);
        for (var d = 0; d < arguments.length; d++) {
            if (c = 0, "string" == typeof arguments[d])
                for (var e = 0; e < arguments[d].length; e++)
                    c += (arguments[d].length - e) * arguments[d].charCodeAt(e);
            else
                c = arguments[d];
            this.seed += (arguments.length - d) * c
        }
        return this.mt = this.mersenne_twister(this.seed), this.bimd5 = this.blueimp_md5(), this.random = function() {
            return this.mt.random(this.seed)
        }, this
    }
    function b(a, b) {
        if (a || (a = {}), b)
            for (var c in b)
                "undefined" == typeof a[c] && (a[c] = b[c]);
        return a
    }
    function c(a, b) {
        if (a)
            throw new RangeError(b)
    }
    function d(a) {
        return function() {
            return this.natural(a)
        }
    }
    function e(a, b) {
        for (var c, d = r(a), e = 0, f = d.length; f > e; e++)
            c = d[e], b[c] = a[c] || b[c]
    }
    function f(a, b) {
        for (var c = 0, d = a.length; d > c; c++)
            b[c] = a[c]
    }
    function g(a, b) {
        var c = Array.isArray(a),
            d = b || (c ? new Array(a.length) : {});
        return c ? f(a, d) : e(a, d), d
    }
    var h = 9007199254740992,
        i = -h,
        j = "0123456789",
        k = "abcdefghijklmnopqrstuvwxyz",
        l = k.toUpperCase(),
        m = j + "abcdef",
        n = Array.prototype.slice;
    a.prototype.VERSION = "0.7.6";
    var o = function() {
        throw new Error("No Base64 encoder available.")
    };
    !function() {
        "function" == typeof btoa ? o = btoa : "function" == typeof Buffer && (o = function(a) {
            return new Buffer(a).toString("base64")
        })
    }(), a.prototype.bool = function(a) {
        return a = b(a, {
            likelihood: 50
        }), c(a.likelihood < 0 || a.likelihood > 100, "Chance: Likelihood accepts values from 0 to 100."), 100 * this.random() < a.likelihood
    }, a.prototype.character = function(a) {
        a = b(a), c(a.alpha && a.symbols, "Chance: Cannot specify both alpha and symbols.");
        var d,
            e,
            f = "!@#$%^&*()[]";
        return d = "lower" === a.casing ? k : "upper" === a.casing ? l : k + l, e = a.pool ? a.pool : a.alpha ? d : a.symbols ? f : d + j + f, e.charAt(this.natural({
            max: e.length - 1
        }))
    }, a.prototype.floating = function(a) {
        a = b(a, {
            fixed: 4
        }), c(a.fixed && a.precision, "Chance: Cannot specify both fixed and precision.");
        var d,
            e = Math.pow(10, a.fixed),
            f = h / e,
            g = -f;
        c(a.min && a.fixed && a.min < g, "Chance: Min specified is out of range with fixed. Min should be, at least, " + g), c(a.max && a.fixed && a.max > f, "Chance: Max specified is out of range with fixed. Max should be, at most, " + f), a = b(a, {
            min: g,
            max: f
        }), d = this.integer({
            min: a.min * e,
            max: a.max * e
        });
        var i = (d / e).toFixed(a.fixed);
        return parseFloat(i)
    }, a.prototype.integer = function(a) {
        return a = b(a, {
            min: i,
            max: h
        }), c(a.min > a.max, "Chance: Min cannot be greater than Max."), Math.floor(this.random() * (a.max - a.min + 1) + a.min)
    }, a.prototype.natural = function(a) {
        return a = b(a, {
            min: 0,
            max: h
        }), c(a.min < 0, "Chance: Min cannot be less than zero."), this.integer(a)
    }, a.prototype.string = function(a) {
        a = b(a, {
            length: this.natural({
                min: 5,
                max: 20
            })
        }), c(a.length < 0, "Chance: Length cannot be less than zero.");
        var d = a.length,
            e = this.n(this.character, d, a);
        return e.join("")
    }, a.prototype.capitalize = function(a) {
        return a.charAt(0).toUpperCase() + a.substr(1)
    }, a.prototype.mixin = function(b) {
        for (var c in b)
            a.prototype[c] = b[c];
        return this
    }, a.prototype.unique = function(a, d, e) {
        c("function" != typeof a, "Chance: The first argument must be a function."), e = b(e, {
            comparator: function(a, b) {
                return -1 !== a.indexOf(b)
            }
        });
        for (var f, g = [], h = 0, i = 50 * d, j = n.call(arguments, 2); g.length < d;)
            if (f = a.apply(this, j), e.comparator(g, f) || (g.push(f), h = 0), ++h > i)
                throw new RangeError("Chance: num is likely too large for sample set");
        return g
    }, a.prototype.n = function(a, b) {
        c("function" != typeof a, "Chance: The first argument must be a function."), "undefined" == typeof b && (b = 1);
        var d = b,
            e = [],
            f = n.call(arguments, 2);
        for (d = Math.max(0, d), null; d--; null)
            e.push(a.apply(this, f));
        return e
    }, a.prototype.pad = function(a, b, c) {
        return c = c || "0", a += "", a.length >= b ? a : new Array(b - a.length + 1).join(c) + a
    }, a.prototype.pick = function(a, b) {
        if (0 === a.length)
            throw new RangeError("Chance: Cannot pick() from an empty array");
        return b && 1 !== b ? this.shuffle(a).slice(0, b) : a[this.natural({
            max: a.length - 1
        })]
    }, a.prototype.shuffle = function(a) {
        for (var b = a.slice(0), c = [], d = 0, e = Number(b.length), f = 0; e > f; f++)
            d = this.natural({
                max: b.length - 1
            }), c[f] = b[d], b.splice(d, 1);
        return c
    }, a.prototype.weighted = function(a, b) {
        if (a.length !== b.length)
            throw new RangeError("Chance: length of array and weights must match");
        for (var c = b.length - 1; c >= 0; --c)
            b[c] <= 0 && (a.splice(c, 1), b.splice(c, 1));
        if (b.some(function(a) {
            return 1 > a
        })) {
            var d = b.reduce(function(a, b) {
                    return a > b ? b : a
                }, b[0]),
                e = 1 / d;
            b = b.map(function(a) {
                return a * e
            })
        }
        var f,
            g = b.reduce(function(a, b) {
                return a + b
            }, 0),
            h = this.natural({
                min: 1,
                max: g
            }),
            i = 0;
        return b.some(function(b, c) {
            return i + b >= h ? (f = a[c], !0) : (i += b, !1)
        }), f
    }, a.prototype.paragraph = function(a) {
        a = b(a);
        var c = a.sentences || this.natural({
                min: 3,
                max: 7
            }),
            d = this.n(this.sentence, c);
        return d.join(" ")
    }, a.prototype.sentence = function(a) {
        a = b(a);
        var c,
            d = a.words || this.natural({
                min: 12,
                max: 18
            }),
            e = this.n(this.word, d);
        return c = e.join(" "), c = this.capitalize(c) + "."
    }, a.prototype.syllable = function(a) {
        a = b(a);
        for (var c, d = a.length || this.natural({
                min: 2,
                max: 3
            }), e = "bcdfghjklmnprstvwz", f = "aeiou", g = e + f, h = "", i = 0; d > i; i++)
            c = this.character(0 === i ? {
                pool: g
            } : -1 === e.indexOf(c) ? {
                pool: e
            } : {
                pool: f
            }), h += c;
        return h
    }, a.prototype.word = function(a) {
        a = b(a), c(a.syllables && a.length, "Chance: Cannot specify both syllables AND length.");
        var d = a.syllables || this.natural({
                min: 1,
                max: 3
            }),
            e = "";
        if (a.length) {
            do e += this.syllable();
            while (e.length < a.length);
            e = e.substring(0, a.length)
        } else
            for (var f = 0; d > f; f++)
                e += this.syllable();
        return e
    }, a.prototype.age = function(a) {
        a = b(a);
        var c;
        switch (a.type) {
        case "child":
            c = {
                min: 1,
                max: 12
            };
            break;
        case "teen":
            c = {
                min: 13,
                max: 19
            };
            break;
        case "adult":
            c = {
                min: 18,
                max: 65
            };
            break;
        case "senior":
            c = {
                min: 65,
                max: 100
            };
            break;
        case "all":
            c = {
                min: 1,
                max: 100
            };
            break;
        default:
            c = {
                min: 18,
                max: 65
            }
        }
        return this.natural(c)
    }, a.prototype.birthday = function(a) {
        return a = b(a, {
            year: (new Date).getFullYear() - this.age(a)
        }), this.date(a)
    }, a.prototype.cpf = function() {
        var a = this.n(this.natural, 9, {
                max: 9
            }),
            b = 2 * a[8] + 3 * a[7] + 4 * a[6] + 5 * a[5] + 6 * a[4] + 7 * a[3] + 8 * a[2] + 9 * a[1] + 10 * a[0];
        b = 11 - b % 11, b >= 10 && (b = 0);
        var c = 2 * b + 3 * a[8] + 4 * a[7] + 5 * a[6] + 6 * a[5] + 7 * a[4] + 8 * a[3] + 9 * a[2] + 10 * a[1] + 11 * a[0];
        return c = 11 - c % 11, c >= 10 && (c = 0), "" + a[0] + a[1] + a[2] + "." + a[3] + a[4] + a[5] + "." + a[6] + a[7] + a[8] + "-" + b + c
    }, a.prototype.first = function(a) {
        return a = b(a, {
            gender: this.gender()
        }), this.pick(this.get("firstNames")[a.gender.toLowerCase()])
    }, a.prototype.gender = function() {
        return this.pick(["Male", "Female"])
    }, a.prototype.last = function() {
        return this.pick(this.get("lastNames"))
    }, a.prototype.mrz = function(a) {
        var c = function(a) {
                var b = "<ABCDEFGHIJKLMNOPQRSTUVWXYXZ".split(""),
                    c = [7, 3, 1],
                    d = 0;
                return "string" != typeof a && (a = a.toString()), a.split("").forEach(function(a, e) {
                    var f = b.indexOf(a);
                    a = -1 !== f ? 0 === f ? 0 : f + 9 : parseInt(a, 10), a *= c[e % c.length], d += a
                }), d % 10
            },
            d = function(a) {
                var b = function(a) {
                        return new Array(a + 1).join("<")
                    },
                    d = ["P<", a.issuer, a.last.toUpperCase(), "<<", a.first.toUpperCase(), b(39 - (a.last.length + a.first.length + 2)), a.passportNumber, c(a.passportNumber), a.nationality, a.dob, c(a.dob), a.gender, a.expiry, c(a.expiry), b(14), c(b(14))].join("");
                return d + c(d.substr(44, 10) + d.substr(57, 7) + d.substr(65, 7))
            },
            e = this;
        return a = b(a, {
            first: this.first(),
            last: this.last(),
            passportNumber: this.integer({
                min: 1e8,
                max: 999999999
            }),
            dob: function() {
                var a = e.birthday({
                    type: "adult"
                });
                return [a.getFullYear().toString().substr(2), e.pad(a.getMonth() + 1, 2), e.pad(a.getDate(), 2)].join("")
            }(),
            expiry: function() {
                var a = new Date;
                return [(a.getFullYear() + 5).toString().substr(2), e.pad(a.getMonth() + 1, 2), e.pad(a.getDate(), 2)].join("")
            }(),
            gender: "Female" === this.gender() ? "F" : "M",
            issuer: "GBR",
            nationality: "GBR"
        }), d(a)
    }, a.prototype.name = function(a) {
        a = b(a);
        var c,
            d = this.first(a),
            e = this.last();
        return c = a.middle ? d + " " + this.first(a) + " " + e : a.middle_initial ? d + " " + this.character({
            alpha: !0,
            casing: "upper"
        }) + ". " + e : d + " " + e, a.prefix && (c = this.prefix(a) + " " + c), a.suffix && (c = c + " " + this.suffix(a)), c
    }, a.prototype.name_prefixes = function(a) {
        a = a || "all", a = a.toLowerCase();
        var b = [{
            name: "Doctor",
            abbreviation: "Dr."
        }];
        return ("male" === a || "all" === a) && b.push({
            name: "Mister",
            abbreviation: "Mr."
        }), ("female" === a || "all" === a) && (b.push({
            name: "Miss",
            abbreviation: "Miss"
        }), b.push({
            name: "Misses",
            abbreviation: "Mrs."
        })), b
    }, a.prototype.prefix = function(a) {
        return this.name_prefix(a)
    }, a.prototype.name_prefix = function(a) {
        return a = b(a, {
            gender: "all"
        }), a.full ? this.pick(this.name_prefixes(a.gender)).name : this.pick(this.name_prefixes(a.gender)).abbreviation
    }, a.prototype.ssn = function(a) {
        a = b(a, {
            ssnFour: !1,
            dashes: !0
        });
        var c,
            d = "1234567890",
            e = a.dashes ? "-" : "";
        return c = a.ssnFour ? this.string({
            pool: d,
            length: 4
        }) : this.string({
            pool: d,
            length: 3
        }) + e + this.string({
            pool: d,
            length: 2
        }) + e + this.string({
            pool: d,
            length: 4
        })
    }, a.prototype.name_suffixes = function() {
        var a = [{
            name: "Doctor of Osteopathic Medicine",
            abbreviation: "D.O."
        }, {
            name: "Doctor of Philosophy",
            abbreviation: "Ph.D."
        }, {
            name: "Esquire",
            abbreviation: "Esq."
        }, {
            name: "Junior",
            abbreviation: "Jr."
        }, {
            name: "Juris Doctor",
            abbreviation: "J.D."
        }, {
            name: "Master of Arts",
            abbreviation: "M.A."
        }, {
            name: "Master of Business Administration",
            abbreviation: "M.B.A."
        }, {
            name: "Master of Science",
            abbreviation: "M.S."
        }, {
            name: "Medical Doctor",
            abbreviation: "M.D."
        }, {
            name: "Senior",
            abbreviation: "Sr."
        }, {
            name: "The Third",
            abbreviation: "III"
        }, {
            name: "The Fourth",
            abbreviation: "IV"
        }, {
            name: "Bachelor of Engineering",
            abbreviation: "B.E"
        }, {
            name: "Bachelor of Technology",
            abbreviation: "B.TECH"
        }];
        return a
    }, a.prototype.suffix = function(a) {
        return this.name_suffix(a)
    }, a.prototype.name_suffix = function(a) {
        return a = b(a), a.full ? this.pick(this.name_suffixes()).name : this.pick(this.name_suffixes()).abbreviation
    }, a.prototype.android_id = function() {
        return "APA91" + this.string({
            pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_",
            length: 178
        })
    }, a.prototype.apple_token = function() {
        return this.string({
            pool: "abcdef1234567890",
            length: 64
        })
    }, a.prototype.wp8_anid2 = function() {
        return o(this.hash({
            length: 32
        }))
    }, a.prototype.wp7_anid = function() {
        return "A=" + this.guid().replace(/-/g, "").toUpperCase() + "&E=" + this.hash({
            length: 3
        }) + "&W=" + this.integer({
            min: 0,
            max: 9
        })
    }, a.prototype.bb_pin = function() {
        return this.hash({
            length: 8
        })
    }, a.prototype.avatar = function(a) {
        var c = null,
            d = "//www.gravatar.com/avatar/",
            e = {
                http: "http",
                https: "https"
            },
            f = {
                bmp: "bmp",
                gif: "gif",
                jpg: "jpg",
                png: "png"
            },
            g = {
                404: "404",
                mm: "mm",
                identicon: "identicon",
                monsterid: "monsterid",
                wavatar: "wavatar",
                retro: "retro",
                blank: "blank"
            },
            h = {
                g: "g",
                pg: "pg",
                r: "r",
                x: "x"
            },
            i = {
                protocol: null,
                email: null,
                fileExtension: null,
                size: null,
                fallback: null,
                rating: null
            };
        if (a)
            if ("string" == typeof a)
                i.email = a, a = {};
            else {
                if ("object" != typeof a)
                    return null;
                if ("Array" === a.constructor)
                    return null
            }
        else
            i.email = this.email(), a = {};
        return i = b(a, i), i.email || (i.email = this.email()), i.protocol = e[i.protocol] ? i.protocol + ":" : "", i.size = parseInt(i.size, 0) ? i.size : "", i.rating = h[i.rating] ? i.rating : "", i.fallback = g[i.fallback] ? i.fallback : "", i.fileExtension = f[i.fileExtension] ? i.fileExtension : "", c = i.protocol + d + this.bimd5.md5(i.email) + (i.fileExtension ? "." + i.fileExtension : "") + (i.size || i.rating || i.fallback ? "?" : "") + (i.size ? "&s=" + i.size.toString() : "") + (i.rating ? "&r=" + i.rating : "") + (i.fallback ? "&d=" + i.fallback : "")
    }, a.prototype.color = function(a) {
        function c(a, b) {
            return [a, a, a].join(b || "")
        }
        a = b(a, {
            format: this.pick(["hex", "shorthex", "rgb", "rgba", "0x"]),
            grayscale: !1,
            casing: "lower"
        });
        var d,
            e = a.grayscale;
        if ("hex" === a.format)
            d = "#" + (e ? c(this.hash({
                length: 2
            })) : this.hash({
                length: 6
            }));
        else if ("shorthex" === a.format)
            d = "#" + (e ? c(this.hash({
                length: 1
            })) : this.hash({
                length: 3
            }));
        else if ("rgb" === a.format)
            d = e ? "rgb(" + c(this.natural({
                max: 255
            }), ",") + ")" : "rgb(" + this.natural({
                max: 255
            }) + "," + this.natural({
                max: 255
            }) + "," + this.natural({
                max: 255
            }) + ")";
        else if ("rgba" === a.format)
            d = e ? "rgba(" + c(this.natural({
                max: 255
            }), ",") + "," + this.floating({
                min: 0,
                max: 1
            }) + ")" : "rgba(" + this.natural({
                max: 255
            }) + "," + this.natural({
                max: 255
            }) + "," + this.natural({
                max: 255
            }) + "," + this.floating({
                min: 0,
                max: 1
            }) + ")";
        else {
            if ("0x" !== a.format)
                throw new RangeError('Invalid format provided. Please provide one of "hex", "shorthex", "rgb", "rgba", or "0x".');
            d = "0x" + (e ? c(this.hash({
                length: 2
            })) : this.hash({
                length: 6
            }))
        }
        return "upper" === a.casing && (d = d.toUpperCase()), d
    }, a.prototype.domain = function(a) {
        return a = b(a), this.word() + "." + (a.tld || this.tld())
    }, a.prototype.email = function(a) {
        return a = b(a), this.word({
            length: a.length
        }) + "@" + (a.domain || this.domain())
    }, a.prototype.fbid = function() {
        return parseInt("10000" + this.natural({
            max: 1e11
        }), 10)
    }, a.prototype.google_analytics = function() {
        var a = this.pad(this.natural({
                max: 999999
            }), 6),
            b = this.pad(this.natural({
                max: 99
            }), 2);
        return "UA-" + a + "-" + b
    }, a.prototype.hashtag = function() {
        return "#" + this.word()
    }, a.prototype.ip = function() {
        return this.natural({
            max: 255
        }) + "." + this.natural({
            max: 255
        }) + "." + this.natural({
            max: 255
        }) + "." + this.natural({
            max: 255
        })
    }, a.prototype.ipv6 = function() {
        var a = this.n(this.hash, 8, {
            length: 4
        });
        return a.join(":")
    }, a.prototype.klout = function() {
        return this.natural({
            min: 1,
            max: 99
        })
    }, a.prototype.tlds = function() {
        return ["com", "org", "edu", "gov", "co.uk", "net", "io"]
    }, a.prototype.tld = function() {
        return this.pick(this.tlds())
    }, a.prototype.twitter = function() {
        return "@" + this.word()
    }, a.prototype.url = function(a) {
        a = b(a, {
            protocol: "http",
            domain: this.domain(a),
            domain_prefix: "",
            path: this.word(),
            extensions: []
        });
        var c = a.extensions.length > 0 ? "." + this.pick(a.extensions) : "",
            d = a.domain_prefix ? a.domain_prefix + "." + a.domain : a.domain;
        return a.protocol + "://" + d + "/" + a.path + c
    }, a.prototype.address = function(a) {
        return a = b(a), this.natural({
            min: 5,
            max: 2e3
        }) + " " + this.street(a)
    }, a.prototype.altitude = function(a) {
        return a = b(a, {
            fixed: 5,
            min: 0,
            max: 8848
        }), this.floating({
            min: a.min,
            max: a.max,
            fixed: a.fixed
        })
    }, a.prototype.areacode = function(a) {
        a = b(a, {
            parens: !0
        });
        var c = this.natural({
            min: 2,
            max: 9
        }).toString() + this.natural({
            min: 0,
            max: 8
        }).toString() + this.natural({
            min: 0,
            max: 9
        }).toString();
        return a.parens ? "(" + c + ")" : c
    }, a.prototype.city = function() {
        return this.capitalize(this.word({
            syllables: 3
        }))
    }, a.prototype.coordinates = function(a) {
        return this.latitude(a) + ", " + this.longitude(a)
    }, a.prototype.countries = function() {
        return this.get("countries")
    }, a.prototype.country = function(a) {
        a = b(a);
        var c = this.pick(this.countries());
        return a.full ? c.name : c.abbreviation
    }, a.prototype.depth = function(a) {
        return a = b(a, {
            fixed: 5,
            min: -2550,
            max: 0
        }), this.floating({
            min: a.min,
            max: a.max,
            fixed: a.fixed
        })
    }, a.prototype.geohash = function(a) {
        return a = b(a, {
            length: 7
        }), this.string({
            length: a.length,
            pool: "0123456789bcdefghjkmnpqrstuvwxyz"
        })
    }, a.prototype.geojson = function(a) {
        return this.latitude(a) + ", " + this.longitude(a) + ", " + this.altitude(a)
    }, a.prototype.latitude = function(a) {
        return a = b(a, {
            fixed: 5,
            min: -90,
            max: 90
        }), this.floating({
            min: a.min,
            max: a.max,
            fixed: a.fixed
        })
    }, a.prototype.longitude = function(a) {
        return a = b(a, {
            fixed: 5,
            min: -180,
            max: 180
        }), this.floating({
            min: a.min,
            max: a.max,
            fixed: a.fixed
        })
    }, a.prototype.phone = function(a) {
        var c,
            d = this,
            e = function(a) {
                var b = [];
                return a.sections.forEach(function(a) {
                    b.push(d.string({
                        pool: "0123456789",
                        length: a
                    }))
                }), a.area + b.join(" ")
            };
        a = b(a, {
            formatted: !0,
            country: "us",
            mobile: !1
        }), a.formatted || (a.parens = !1);
        var f;
        switch (a.country) {
        case "fr":
            a.mobile ? (c = this.pick(["06", "07"]) + d.string({
                pool: "0123456789",
                length: 8
            }), f = a.formatted ? c.match(/../g).join(" ") : c) : (c = this.pick(["01" + this.pick(["30", "34", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "53", "55", "56", "58", "60", "64", "69", "70", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83"]) + d.string({
                pool: "0123456789",
                length: 6
            }), "02" + this.pick(["14", "18", "22", "23", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "40", "41", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "56", "57", "61", "62", "69", "72", "76", "77", "78", "85", "90", "96", "97", "98", "99"]) + d.string({
                pool: "0123456789",
                length: 6
            }), "03" + this.pick(["10", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "39", "44", "45", "51", "52", "54", "55", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90"]) + d.string({
                pool: "0123456789",
                length: 6
            }), "04" + this.pick(["11", "13", "15", "20", "22", "26", "27", "30", "32", "34", "37", "42", "43", "44", "50", "56", "57", "63", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "88", "89", "90", "91", "92", "93", "94", "95", "97", "98"]) + d.string({
                pool: "0123456789",
                length: 6
            }), "05" + this.pick(["08", "16", "17", "19", "24", "31", "32", "33", "34", "35", "40", "45", "46", "47", "49", "53", "55", "56", "57", "58", "59", "61", "62", "63", "64", "65", "67", "79", "81", "82", "86", "87", "90", "94"]) + d.string({
                pool: "0123456789",
                length: 6
            }), "09" + d.string({
                pool: "0123456789",
                length: 8
            })]), f = a.formatted ? c.match(/../g).join(" ") : c);
            break;
        case "uk":
            a.mobile ? (c = this.pick([{
                area: "07" + this.pick(["4", "5", "7", "8", "9"]),
                sections: [2, 6]
            }, {
                area: "07624 ",
                sections: [6]
            }]), f = a.formatted ? e(c) : e(c).replace(" ", "")) : (c = this.pick([{
                area: "01" + this.character({
                    pool: "234569"
                }) + "1 ",
                sections: [3, 4]
            }, {
                area: "020 " + this.character({
                    pool: "378"
                }),
                sections: [3, 4]
            }, {
                area: "023 " + this.character({
                    pool: "89"
                }),
                sections: [3, 4]
            }, {
                area: "024 7",
                sections: [3, 4]
            }, {
                area: "028 " + this.pick(["25", "28", "37", "71", "82", "90", "92", "95"]),
                sections: [2, 4]
            }, {
                area: "012" + this.pick(["04", "08", "54", "76", "97", "98"]) + " ",
                sections: [5]
            }, {
                area: "013" + this.pick(["63", "64", "84", "86"]) + " ",
                sections: [5]
            }, {
                area: "014" + this.pick(["04", "20", "60", "61", "80", "88"]) + " ",
                sections: [5]
            }, {
                area: "015" + this.pick(["24", "27", "62", "66"]) + " ",
                sections: [5]
            }, {
                area: "016" + this.pick(["06", "29", "35", "47", "59", "95"]) + " ",
                sections: [5]
            }, {
                area: "017" + this.pick(["26", "44", "50", "68"]) + " ",
                sections: [5]
            }, {
                area: "018" + this.pick(["27", "37", "84", "97"]) + " ",
                sections: [5]
            }, {
                area: "019" + this.pick(["00", "05", "35", "46", "49", "63", "95"]) + " ",
                sections: [5]
            }]), f = a.formatted ? e(c) : e(c).replace(" ", "", "g"));
            break;
        case "us":
            var g = this.areacode(a).toString(),
                h = this.natural({
                    min: 2,
                    max: 9
                }).toString() + this.natural({
                    min: 0,
                    max: 9
                }).toString() + this.natural({
                    min: 0,
                    max: 9
                }).toString(),
                i = this.natural({
                    min: 1e3,
                    max: 9999
                }).toString();
            f = a.formatted ? g + " " + h + "-" + i : g + h + i
        }
        return f
    }, a.prototype.postal = function() {
        var a = this.character({
                pool: "XVTSRPNKLMHJGECBA"
            }),
            b = a + this.natural({
                max: 9
            }) + this.character({
                alpha: !0,
                casing: "upper"
            }),
            c = this.natural({
                max: 9
            }) + this.character({
                alpha: !0,
                casing: "upper"
            }) + this.natural({
                max: 9
            });
        return b + " " + c
    }, a.prototype.provinces = function() {
        return this.get("provinces")
    }, a.prototype.province = function(a) {
        return a && a.full ? this.pick(this.provinces()).name : this.pick(this.provinces()).abbreviation
    }, a.prototype.state = function(a) {
        return a && a.full ? this.pick(this.states(a)).name : this.pick(this.states(a)).abbreviation
    }, a.prototype.states = function(a) {
        a = b(a);
        var c,
            d = this.get("us_states_and_dc"),
            e = this.get("territories"),
            f = this.get("armed_forces");
        return c = d, a.territories && (c = c.concat(e)), a.armed_forces && (c = c.concat(f)), c
    }, a.prototype.street = function(a) {
        a = b(a);
        var c = this.word({
            syllables: 2
        });
        return c = this.capitalize(c), c += " ", c += a.short_suffix ? this.street_suffix().abbreviation : this.street_suffix().name
    }, a.prototype.street_suffix = function() {
        return this.pick(this.street_suffixes())
    }, a.prototype.street_suffixes = function() {
        return this.get("street_suffixes")
    }, a.prototype.zip = function(a) {
        var b = this.n(this.natural, 5, {
            max: 9
        });
        return a && a.plusfour === !0 && (b.push("-"), b = b.concat(this.n(this.natural, 4, {
            max: 9
        }))), b.join("")
    }, a.prototype.ampm = function() {
        return this.bool() ? "am" : "pm"
    }, a.prototype.date = function(a) {
        var c,
            d;
        if (a && (a.min || a.max)) {
            a = b(a, {
                american: !0,
                string: !1
            });
            var e = "undefined" != typeof a.min ? a.min.getTime() : 1,
                f = "undefined" != typeof a.max ? a.max.getTime() : 864e13;
            d = new Date(this.natural({
                min: e,
                max: f
            }))
        } else {
            var g = this.month({
                    raw: !0
                }),
                h = g.days;
            a && a.month && (h = this.get("months")[(a.month % 12 + 12) % 12].days), a = b(a, {
                year: parseInt(this.year(), 10),
                month: g.numeric - 1,
                day: this.natural({
                    min: 1,
                    max: h
                }),
                hour: this.hour(),
                minute: this.minute(),
                second: this.second(),
                millisecond: this.millisecond(),
                american: !0,
                string: !1
            }), d = new Date(a.year, a.month, a.day, a.hour, a.minute, a.second, a.millisecond)
        }
        return c = a.american ? d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear() : d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(), a.string ? c : d
    }, a.prototype.hammertime = function(a) {
        return this.date(a).getTime()
    }, a.prototype.hour = function(a) {
        return a = b(a, {
            min: 1,
            max: a && a.twentyfour ? 24 : 12
        }), c(a.min < 1, "Chance: Min cannot be less than 1."), c(a.twentyfour && a.max > 24, "Chance: Max cannot be greater than 24 for twentyfour option."), c(!a.twentyfour && a.max > 12, "Chance: Max cannot be greater than 12."), c(a.min > a.max, "Chance: Min cannot be greater than Max."), this.natural({
            min: a.min,
            max: a.max
        })
    }, a.prototype.millisecond = function() {
        return this.natural({
            max: 999
        })
    }, a.prototype.minute = a.prototype.second = function(a) {
        return a = b(a, {
            min: 0,
            max: 59
        }), c(a.min < 0, "Chance: Min cannot be less than 0."), c(a.max > 59, "Chance: Max cannot be greater than 59."), c(a.min > a.max, "Chance: Min cannot be greater than Max."), this.natural({
            min: a.min,
            max: a.max
        })
    }, a.prototype.month = function(a) {
        a = b(a, {
            min: 1,
            max: 12
        }), c(a.min < 1, "Chance: Min cannot be less than 1."), c(a.max > 12, "Chance: Max cannot be greater than 12."), c(a.min > a.max, "Chance: Min cannot be greater than Max.");
        var d = this.pick(this.months().slice(a.min - 1, a.max));
        return a.raw ? d : d.name
    }, a.prototype.months = function() {
        return this.get("months")
    }, a.prototype.second = function() {
        return this.natural({
            max: 59
        })
    }, a.prototype.timestamp = function() {
        return this.natural({
            min: 1,
            max: parseInt((new Date).getTime() / 1e3, 10)
        })
    }, a.prototype.year = function(a) {
        return a = b(a, {
            min: (new Date).getFullYear()
        }), a.max = "undefined" != typeof a.max ? a.max : a.min + 100, this.natural(a).toString()
    }, a.prototype.cc = function(a) {
        a = b(a);
        var c,
            d,
            e;
        return c = this.cc_type(a.type ? {
            name: a.type,
            raw: !0
        } : {
            raw: !0
        }), d = c.prefix.split(""), e = c.length - c.prefix.length - 1, d = d.concat(this.n(this.integer, e, {
            min: 0,
            max: 9
        })), d.push(this.luhn_calculate(d.join(""))), d.join("")
    }, a.prototype.cc_types = function() {
        return this.get("cc_types")
    }, a.prototype.cc_type = function(a) {
        a = b(a);
        var c = this.cc_types(),
            d = null;
        if (a.name) {
            for (var e = 0; e < c.length; e++)
                if (c[e].name === a.name || c[e].short_name === a.name) {
                    d = c[e];
                    break
                }
            if (null === d)
                throw new RangeError("Credit card type '" + a.name + "'' is not supported")
        } else
            d = this.pick(c);
        return a.raw ? d : d.name
    }, a.prototype.currency_types = function() {
        return this.get("currency_types")
    }, a.prototype.currency = function() {
        return this.pick(this.currency_types())
    }, a.prototype.currency_pair = function(a) {
        var b = this.unique(this.currency, 2, {
            comparator: function(a, b) {
                return a.reduce(function(a, c) {
                    return a || c.code === b.code
                }, !1)
            }
        });
        return a ? b[0].code + "/" + b[1].code : b
    }, a.prototype.dollar = function(a) {
        a = b(a, {
            max: 1e4,
            min: 0
        });
        var c = this.floating({
                min: a.min,
                max: a.max,
                fixed: 2
            }).toString(),
            d = c.split(".")[1];
        return void 0 === d ? c += ".00" : d.length < 2 && (c += "0"), 0 > c ? "-$" + c.replace("-", "") : "$" + c
    }, a.prototype.exp = function(a) {
        a = b(a);
        var c = {};
        return c.year = this.exp_year(), c.year === (new Date).getFullYear().toString() ? c.month = this.exp_month({
            future: !0
        }) : c.month = this.exp_month(), a.raw ? c : c.month + "/" + c.year
    }, a.prototype.exp_month = function(a) {
        a = b(a);
        var c,
            d,
            e = (new Date).getMonth() + 1;
        if (a.future) {
            do c = this.month({
                raw: !0
            }).numeric, d = parseInt(c, 10);
            while (e >= d)
        } else
            c = this.month({
                raw: !0
            }).numeric;
        return c
    }, a.prototype.exp_year = function() {
        return this.year({
            max: (new Date).getFullYear() + 10
        })
    }, a.prototype.d4 = d({
        min: 1,
        max: 4
    }), a.prototype.d6 = d({
        min: 1,
        max: 6
    }), a.prototype.d8 = d({
        min: 1,
        max: 8
    }), a.prototype.d10 = d({
        min: 1,
        max: 10
    }), a.prototype.d12 = d({
        min: 1,
        max: 12
    }), a.prototype.d20 = d({
        min: 1,
        max: 20
    }), a.prototype.d30 = d({
        min: 1,
        max: 30
    }), a.prototype.d100 = d({
        min: 1,
        max: 100
    }), a.prototype.rpg = function(a, c) {
        if (c = b(c), a) {
            var d = a.toLowerCase().split("d"),
                e = [];
            if (2 !== d.length || !parseInt(d[0], 10) || !parseInt(d[1], 10))
                throw new Error("Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");
            for (var f = d[0]; f > 0; f--)
                e[f - 1] = this.natural({
                    min: 1,
                    max: d[1]
                });
            return "undefined" != typeof c.sum && c.sum ? e.reduce(function(a, b) {
                return a + b
            }) : e
        }
        throw new RangeError("A type of die roll must be included")
    }, a.prototype.guid = function(a) {
        a = b(a, {
            version: 5
        });
        var c = "abcdef1234567890",
            d = "ab89",
            e = this.string({
                pool: c,
                length: 8
            }) + "-" + this.string({
                pool: c,
                length: 4
            }) + "-" + a.version + this.string({
                pool: c,
                length: 3
            }) + "-" + this.string({
                pool: d,
                length: 1
            }) + this.string({
                pool: c,
                length: 3
            }) + "-" + this.string({
                pool: c,
                length: 12
            });
        return e
    }, a.prototype.hash = function(a) {
        a = b(a, {
            length: 40,
            casing: "lower"
        });
        var c = "upper" === a.casing ? m.toUpperCase() : m;
        return this.string({
            pool: c,
            length: a.length
        })
    }, a.prototype.luhn_check = function(a) {
        var b = a.toString(),
            c = +b.substring(b.length - 1);
        return c === this.luhn_calculate(+b.substring(0, b.length - 1))
    }, a.prototype.luhn_calculate = function(a) {
        for (var b, c = a.toString().split("").reverse(), d = 0, e = 0, f = c.length; f > e; ++e)
            b = +c[e], e % 2 === 0 && (b *= 2, b > 9 && (b -= 9)), d += b;
        return 9 * d % 10
    }, a.prototype.md5 = function(a) {
        var c = {
            str: "",
            key: null,
            raw: !1
        };
        if (a)
            if ("string" == typeof a)
                c.str = a, a = {};
            else {
                if ("object" != typeof a)
                    return null;
                if ("Array" === a.constructor)
                    return null
            }
        else
            c.str = this.string(), a = {};
        if (c = b(a, c), !c.str)
            throw new Error("A parameter is required to return an md5 hash.");
        return this.bimd5.md5(c.str, c.key, c.raw)
    };
    var p = {
            firstNames: {
                male: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", "George", "Donald", "Anthony", "Paul", "Mark", "Edward", "Steven", "Kenneth", "Andrew", "Brian", "Joshua", "Kevin", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Jonathan", "Scott", "Raymond", "Justin", "Brandon", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Jerry", "Alexander", "Peter", "Tyler", "Douglas", "Harold", "Aaron", "Jose", "Adam", "Arthur", "Zachary", "Carl", "Nathan", "Albert", "Kyle", "Lawrence", "Joe", "Willie", "Gerald", "Roger", "Keith", "Jeremy", "Terry", "Harry", "Ralph", "Sean", "Jesse", "Roy", "Louis", "Billy", "Austin", "Bruce", "Eugene", "Christian", "Bryan", "Wayne", "Russell", "Howard", "Fred", "Ethan", "Jordan", "Philip", "Alan", "aditya", "Randy", "Vincent", "Bobby", "Dylan", "Johnny", "Phillip", "Victor", "Clarence", "Ernest", "Martin", "Craig", "Stanley", "Shawn", "Travis", "Bradley", "Leonard", "Earl", "Gabriel", "Jimmy", "Francis", "Todd", "Noah", "Danny", "Dale", "Cody", "Carlos", "Allen", "Frederick", "Logan", "Curtis", "Alex", "Joel", "Luis", "Norman", "Marvin", "Glenn", "Tony", "Nathaniel", "Rodney", "Melvin", "Alfred", "Steve", "Cameron", "Chad", "Edwin", "Caleb", "Evan", "Antonio", "Lee", "Herbert", "Jeffery", "Isaac", "Derek", "Ricky", "Marcus", "Theodore", "Elijah", "Luke", "Jesus", "Eddie", "Troy", "Mike", "Dustin", "Ray", "Adrian", "Bernard", "Leroy", "Angel", "Randall", "Wesley", "Ian", "Jared", "Mason", "Hunter", "Calvin", "Oscar", "Clifford", "Jay", "Shane", "Ronnie", "Barry", "Lucas", "Corey", "Manuel", "Leo", "Tommy", "Warren", "Jackson", "Isaiah", "Connor", "Don", "Dean", "Jon", "Julian", "Miguel", "Bill", "Lloyd", "Charlie", "Mitchell", "Leon", "Jerome", "Darrell", "Jeremiah", "Alvin", "Brett", "Seth", "Floyd", "Jim", "Blake", "Micheal", "Gordon", "Trevor", "Lewis", "Erik", "Edgar", "Vernon", "Devin", "Gavin", "Jayden", "Chris", "Clyde", "Tom", "Derrick", "Mario", "Brent", "Marc", "Herman", "Chase", "Dominic", "Ricardo", "Franklin", "Maurice", "Max", "Aiden", "Owen", "Lester", "Gilbert", "Elmer", "Gene", "Francisco", "Glen", "Cory", "Garrett", "Clayton", "Sam", "Jorge", "Chester", "Alejandro", "Jeff", "Harvey", "Milton", "Cole", "Ivan", "Andre", "Duane", "Landon"],
                female: ["Mary", "Emma", "Elizabeth", "Minnie", "Margaret", "Ida", "Alice", "Bertha", "Sarah", "Annie", "Clara", "Ella", "Florence", "Cora", "Martha", "Laura", "Nellie", "Grace", "Carrie", "Maude", "Mabel", "Bessie", "Jennie", "Gertrude", "Julia", "Hattie", "Edith", "Mattie", "Rose", "Catherine", "Lillian", "Ada", "Lillie", "Helen", "Jessie", "Louise", "Ethel", "Lula", "Myrtle", "Eva", "Frances", "Lena", "Lucy", "Edna", "Maggie", "Pearl", "Daisy", "Fannie", "Josephine", "Dora", "Rosa", "Katherine", "Agnes", "Marie", "Nora", "May", "Mamie", "Blanche", "Stella", "Ellen", "Nancy", "Effie", "Sallie", "Nettie", "Della", "Lizzie", "Flora", "Susie", "Maud", "Mae", "Etta", "Harriet", "Sadie", "Caroline", "Katie", "Lydia", "Elsie", "Kate", "Susan", "Mollie", "Alma", "Addie", "Georgia", "Eliza", "Lulu", "Nannie", "Lottie", "Amanda", "Belle", "Charlotte", "Rebecca", "Ruth", "Viola", "Olive", "Amelia", "Hannah", "Jane", "Virginia", "Emily", "Matilda", "Irene", "Kathryn", "Esther", "Willie", "Henrietta", "Ollie", "Amy", "Rachel", "Sara", "Estella", "Theresa", "Augusta", "Ora", "Pauline", "Josie", "Lola", "Sophia", "Leona", "Anne", "Mildred", "Ann", "Beulah", "Callie", "Lou", "Delia", "Eleanor", "Barbara", "Iva", "Louisa", "Maria", "Mayme", "Evelyn", "Estelle", "Nina", "Betty", "Marion", "Bettie", "Dorothy", "Luella", "Inez", "Lela", "Rosie", "Allie", "Millie", "Janie", "Cornelia", "Victoria", "Ruby", "Winifred", "Alta", "Celia", "Christine", "Beatrice", "Birdie", "Harriett", "Mable", "Myra", "Sophie", "Tillie", "Isabel", "Sylvia", "Carolyn", "Isabelle", "Leila", "Sally", "Ina", "Essie", "Bertie", "Nell", "Alberta", "Katharine", "Lora", "Rena", "Mina", "Rhoda", "Mathilda", "Abbie", "Eula", "Dollie", "Hettie", "Eunice", "Fanny", "Ola", "Lenora", "Adelaide", "Christina", "Lelia", "Nelle", "Sue", "Johanna", "Lilly", "Lucinda", "Minerva", "Lettie", "Roxie", "Cynthia", "Helena", "Hilda", "Hulda", "Bernice", "Genevieve", "Jean", "Cordelia", "Marian", "Francis", "Jeanette", "Adeline", "Gussie", "Leah", "Lois", "Lura", "Mittie", "Hallie", "Isabella", "Olga", "Phoebe", "Teresa", "Hester", "Lida", "Lina", "Winnie", "Claudia", "Marguerite", "Vera", "Cecelia", "Bess", "Emilie", "John", "Rosetta", "Verna", "Myrtie", "Cecilia", "Elva", "Olivia", "Ophelia", "Georgie", "Elnora", "Violet", "Adele", "Lily", "Linnie", "Loretta", "Madge", "Polly", "Virgie", "Eugenia", "Lucile", "Lucille", "Mabelle", "Rosalie"]
            },
            lastNames: ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes", "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "McDonald", "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker", "Porter", "Hunter", "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon", "Ramos", "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer", "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn", "Perkins", "Hudson", "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", "Arnold", "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart", "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence", "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson", "Fields", "Gutierrez", "Ryan", "Schmidt", "Carr", "Vasquez", "Castillo", "Wheeler", "Chapman", "Oliver", "Montgomery", "Richards", "Williamson", "Johnston", "Banks", "Meyer", "Bishop", "McCoy", "Howell", "Alvarez", "Morrison", "Hansen", "Fernandez", "Garza", "Harvey", "Little", "Burton", "Stanley", "Nguyen", "George", "Jacobs", "Reid", "Kim", "Fuller", "Lynch", "Dean", "Gilbert", "Garrett", "Romero", "Welch", "Larson", "Frazier", "Burke", "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", "Fowler", "Brewer", "Hoffman", "Carlson", "Silva", "Pearson", "Holland", "Douglas", "Fleming", "Jensen", "Vargas", "Byrd", "Davidson", "Hopkins", "May", "Terry", "Herrera", "Wade", "Soto", "Walters", "Curtis", "Neal", "Caldwell", "Lowe", "Jennings", "Barnett", "Graves", "Jimenez", "Horton", "Shelton", "Barrett", "Obrien", "Castro", "Sutton", "Gregory", "McKinney", "Lucas", "Miles", "Craig", "Rodriquez", "Chambers", "Holt", "Lambert", "Fletcher", "Watts", "Bates", "Hale", "Rhodes", "Pena", "Beck", "Newman", "Haynes", "McDaniel", "Mendez", "Bush", "Vaughn", "Parks", "Dawson", "Santiago", "Norris", "Hardy", "Love", "Steele", "Curry", "Powers", "Schultz", "Barker", "Guzman", "Page", "Munoz", "Ball", "Keller", "Chandler", "Weber", "Leonard", "Walsh", "Lyons", "Ramsey", "Wolfe", "Schneider", "Mullins", "Benson", "Sharp", "Bowen", "Daniel", "Barber", "Cummings", "Hines", "Baldwin", "Griffith", "Valdez", "Hubbard", "Salazar", "Reeves", "Warner", "Stevenson", "Burgess", "Santos", "Tate", "Cross", "Garner", "Mann", "Mack", "Moss", "Thornton", "Dennis", "McGee", "Farmer", "Delgado", "Aguilar", "Vega", "Glover", "Manning", "Cohen", "Harmon", "Rodgers", "Robbins", "Newton", "Todd", "Blair", "Higgins", "Ingram", "Reese", "Cannon", "Strickland", "Townsend", "Potter", "Goodwin", "Walton", "Rowe", "Hampton", "Ortega", "Patton", "Swanson", "Joseph", "Francis", "Goodman", "Maldonado", "Yates", "Becker", "Erickson", "Hodges", "Rios", "Conner", "Adkins", "Webster", "Norman", "Malone", "Hammond", "Flowers", "Cobb", "Moody", "Quinn", "Blake", "Maxwell", "Pope", "Floyd", "Osborne", "Paul", "McCarthy", "Guerrero", "Lindsey", "Estrada", "Sandoval", "Gibbs", "Tyler", "Gross", "Fitzgerald", "Stokes", "Doyle", "Sherman", "Saunders", "Wise", "Colon", "Gill", "Alvarado", "Greer", "Padilla", "Simon", "Waters", "Nunez", "Ballard", "Schwartz", "McBride", "Houston", "Christensen", "Klein", "Pratt", "Briggs", "Parsons", "McLaughlin", "Zimmerman", "French", "Buchanan", "Moran", "Copeland", "Roy", "Pittman", "Brady", "McCormick", "Holloway", "Brock", "Poole", "Frank", "Logan", "Owen", "Bass", "Marsh", "Drake", "Wong", "Jefferson", "Park", "Morton", "Abbott", "Sparks", "Patrick", "Norton", "Huff", "Clayton", "Massey", "Lloyd", "Figueroa", "Carson", "Bowers", "Roberson", "Barton", "Tran", "Lamb", "Harrington", "Casey", "Boone", "Cortez", "Clarke", "Mathis", "Singleton", "Wilkins", "Cain", "Bryan", "Underwood", "Hogan", "McKenzie", "Collier", "Luna", "Phelps", "McGuire", "Allison", "Bridges", "Wilkerson", "Nash", "Summers", "Atkins"],
            countries: [{
                name: "Afghanistan",
                abbreviation: "AF"
            }, {
                name: "Albania",
                abbreviation: "AL"
            }, {
                name: "Algeria",
                abbreviation: "DZ"
            }, {
                name: "American Samoa",
                abbreviation: "AS"
            }, {
                name: "Andorra",
                abbreviation: "AD"
            }, {
                name: "Angola",
                abbreviation: "AO"
            }, {
                name: "Anguilla",
                abbreviation: "AI"
            }, {
                name: "Antarctica",
                abbreviation: "AQ"
            }, {
                name: "Antigua and Barbuda",
                abbreviation: "AG"
            }, {
                name: "Argentina",
                abbreviation: "AR"
            }, {
                name: "Armenia",
                abbreviation: "AM"
            }, {
                name: "Aruba",
                abbreviation: "AW"
            }, {
                name: "Australia",
                abbreviation: "AU"
            }, {
                name: "Austria",
                abbreviation: "AT"
            }, {
                name: "Azerbaijan",
                abbreviation: "AZ"
            }, {
                name: "Bahamas",
                abbreviation: "BS"
            }, {
                name: "Bahrain",
                abbreviation: "BH"
            }, {
                name: "Bangladesh",
                abbreviation: "BD"
            }, {
                name: "Barbados",
                abbreviation: "BB"
            }, {
                name: "Belarus",
                abbreviation: "BY"
            }, {
                name: "Belgium",
                abbreviation: "BE"
            }, {
                name: "Belize",
                abbreviation: "BZ"
            }, {
                name: "Benin",
                abbreviation: "BJ"
            }, {
                name: "Bermuda",
                abbreviation: "BM"
            }, {
                name: "Bhutan",
                abbreviation: "BT"
            }, {
                name: "Bolivia",
                abbreviation: "BO"
            }, {
                name: "Bosnia and Herzegovina",
                abbreviation: "BA"
            }, {
                name: "Botswana",
                abbreviation: "BW"
            }, {
                name: "Bouvet Island",
                abbreviation: "BV"
            }, {
                name: "Brazil",
                abbreviation: "BR"
            }, {
                name: "British Antarctic Territory",
                abbreviation: "BQ"
            }, {
                name: "British Indian Ocean Territory",
                abbreviation: "IO"
            }, {
                name: "British Virgin Islands",
                abbreviation: "VG"
            }, {
                name: "Brunei",
                abbreviation: "BN"
            }, {
                name: "Bulgaria",
                abbreviation: "BG"
            }, {
                name: "Burkina Faso",
                abbreviation: "BF"
            }, {
                name: "Burundi",
                abbreviation: "BI"
            }, {
                name: "Cambodia",
                abbreviation: "KH"
            }, {
                name: "Cameroon",
                abbreviation: "CM"
            }, {
                name: "Canada",
                abbreviation: "CA"
            }, {
                name: "Canton and Enderbury Islands",
                abbreviation: "CT"
            }, {
                name: "Cape Verde",
                abbreviation: "CV"
            }, {
                name: "Cayman Islands",
                abbreviation: "KY"
            }, {
                name: "Central African Republic",
                abbreviation: "CF"
            }, {
                name: "Chad",
                abbreviation: "TD"
            }, {
                name: "Chile",
                abbreviation: "CL"
            }, {
                name: "China",
                abbreviation: "CN"
            }, {
                name: "Christmas Island",
                abbreviation: "CX"
            }, {
                name: "Cocos [Keeling] Islands",
                abbreviation: "CC"
            }, {
                name: "Colombia",
                abbreviation: "CO"
            }, {
                name: "Comoros",
                abbreviation: "KM"
            }, {
                name: "Congo - Brazzaville",
                abbreviation: "CG"
            }, {
                name: "Congo - Kinshasa",
                abbreviation: "CD"
            }, {
                name: "Cook Islands",
                abbreviation: "CK"
            }, {
                name: "Costa Rica",
                abbreviation: "CR"
            }, {
                name: "Croatia",
                abbreviation: "HR"
            }, {
                name: "Cuba",
                abbreviation: "CU"
            }, {
                name: "Cyprus",
                abbreviation: "CY"
            }, {
                name: "Czech Republic",
                abbreviation: "CZ"
            }, {
                name: "Côte d’Ivoire",
                abbreviation: "CI"
            }, {
                name: "Denmark",
                abbreviation: "DK"
            }, {
                name: "Djibouti",
                abbreviation: "DJ"
            }, {
                name: "Dominica",
                abbreviation: "DM"
            }, {
                name: "Dominican Republic",
                abbreviation: "DO"
            }, {
                name: "Dronning Maud Land",
                abbreviation: "NQ"
            }, {
                name: "East Germany",
                abbreviation: "DD"
            }, {
                name: "Ecuador",
                abbreviation: "EC"
            }, {
                name: "Egypt",
                abbreviation: "EG"
            }, {
                name: "El Salvador",
                abbreviation: "SV"
            }, {
                name: "Equatorial Guinea",
                abbreviation: "GQ"
            }, {
                name: "Eritrea",
                abbreviation: "ER"
            }, {
                name: "Estonia",
                abbreviation: "EE"
            }, {
                name: "Ethiopia",
                abbreviation: "ET"
            }, {
                name: "Falkland Islands",
                abbreviation: "FK"
            }, {
                name: "Faroe Islands",
                abbreviation: "FO"
            }, {
                name: "Fiji",
                abbreviation: "FJ"
            }, {
                name: "Finland",
                abbreviation: "FI"
            }, {
                name: "France",
                abbreviation: "FR"
            }, {
                name: "French Guiana",
                abbreviation: "GF"
            }, {
                name: "French Polynesia",
                abbreviation: "PF"
            }, {
                name: "French Southern Territories",
                abbreviation: "TF"
            }, {
                name: "French Southern and Antarctic Territories",
                abbreviation: "FQ"
            }, {
                name: "Gabon",
                abbreviation: "GA"
            }, {
                name: "Gambia",
                abbreviation: "GM"
            }, {
                name: "Georgia",
                abbreviation: "GE"
            }, {
                name: "Germany",
                abbreviation: "DE"
            }, {
                name: "Ghana",
                abbreviation: "GH"
            }, {
                name: "Gibraltar",
                abbreviation: "GI"
            }, {
                name: "Greece",
                abbreviation: "GR"
            }, {
                name: "Greenland",
                abbreviation: "GL"
            }, {
                name: "Grenada",
                abbreviation: "GD"
            }, {
                name: "Guadeloupe",
                abbreviation: "GP"
            }, {
                name: "Guam",
                abbreviation: "GU"
            }, {
                name: "Guatemala",
                abbreviation: "GT"
            }, {
                name: "Guernsey",
                abbreviation: "GG"
            }, {
                name: "Guinea",
                abbreviation: "GN"
            }, {
                name: "Guinea-Bissau",
                abbreviation: "GW"
            }, {
                name: "Guyana",
                abbreviation: "GY"
            }, {
                name: "Haiti",
                abbreviation: "HT"
            }, {
                name: "Heard Island and McDonald Islands",
                abbreviation: "HM"
            }, {
                name: "Honduras",
                abbreviation: "HN"
            }, {
                name: "Hong Kong SAR China",
                abbreviation: "HK"
            }, {
                name: "Hungary",
                abbreviation: "HU"
            }, {
                name: "Iceland",
                abbreviation: "IS"
            }, {
                name: "India",
                abbreviation: "IN"
            }, {
                name: "Indonesia",
                abbreviation: "ID"
            }, {
                name: "Iran",
                abbreviation: "IR"
            }, {
                name: "Iraq",
                abbreviation: "IQ"
            }, {
                name: "Ireland",
                abbreviation: "IE"
            }, {
                name: "Isle of Man",
                abbreviation: "IM"
            }, {
                name: "Israel",
                abbreviation: "IL"
            }, {
                name: "Italy",
                abbreviation: "IT"
            }, {
                name: "Jamaica",
                abbreviation: "JM"
            }, {
                name: "Japan",
                abbreviation: "JP"
            }, {
                name: "Jersey",
                abbreviation: "JE"
            }, {
                name: "Johnston Island",
                abbreviation: "JT"
            }, {
                name: "Jordan",
                abbreviation: "JO"
            }, {
                name: "Kazakhstan",
                abbreviation: "KZ"
            }, {
                name: "Kenya",
                abbreviation: "KE"
            }, {
                name: "Kiribati",
                abbreviation: "KI"
            }, {
                name: "Kuwait",
                abbreviation: "KW"
            }, {
                name: "Kyrgyzstan",
                abbreviation: "KG"
            }, {
                name: "Laos",
                abbreviation: "LA"
            }, {
                name: "Latvia",
                abbreviation: "LV"
            }, {
                name: "Lebanon",
                abbreviation: "LB"
            }, {
                name: "Lesotho",
                abbreviation: "LS"
            }, {
                name: "Liberia",
                abbreviation: "LR"
            }, {
                name: "Libya",
                abbreviation: "LY"
            }, {
                name: "Liechtenstein",
                abbreviation: "LI"
            }, {
                name: "Lithuania",
                abbreviation: "LT"
            }, {
                name: "Luxembourg",
                abbreviation: "LU"
            }, {
                name: "Macau SAR China",
                abbreviation: "MO"
            }, {
                name: "Macedonia",
                abbreviation: "MK"
            }, {
                name: "Madagascar",
                abbreviation: "MG"
            }, {
                name: "Malawi",
                abbreviation: "MW"
            }, {
                name: "Malaysia",
                abbreviation: "MY"
            }, {
                name: "Maldives",
                abbreviation: "MV"
            }, {
                name: "Mali",
                abbreviation: "ML"
            }, {
                name: "Malta",
                abbreviation: "MT"
            }, {
                name: "Marshall Islands",
                abbreviation: "MH"
            }, {
                name: "Martinique",
                abbreviation: "MQ"
            }, {
                name: "Mauritania",
                abbreviation: "MR"
            }, {
                name: "Mauritius",
                abbreviation: "MU"
            }, {
                name: "Mayotte",
                abbreviation: "YT"
            }, {
                name: "Metropolitan France",
                abbreviation: "FX"
            }, {
                name: "Mexico",
                abbreviation: "MX"
            }, {
                name: "Micronesia",
                abbreviation: "FM"
            }, {
                name: "Midway Islands",
                abbreviation: "MI"
            }, {
                name: "Moldova",
                abbreviation: "MD"
            }, {
                name: "Monaco",
                abbreviation: "MC"
            }, {
                name: "Mongolia",
                abbreviation: "MN"
            }, {
                name: "Montenegro",
                abbreviation: "ME"
            }, {
                name: "Montserrat",
                abbreviation: "MS"
            }, {
                name: "Morocco",
                abbreviation: "MA"
            }, {
                name: "Mozambique",
                abbreviation: "MZ"
            }, {
                name: "Myanmar [Burma]",
                abbreviation: "MM"
            }, {
                name: "Namibia",
                abbreviation: "NA"
            }, {
                name: "Nauru",
                abbreviation: "NR"
            }, {
                name: "Nepal",
                abbreviation: "NP"
            }, {
                name: "Netherlands",
                abbreviation: "NL"
            }, {
                name: "Netherlands Antilles",
                abbreviation: "AN"
            }, {
                name: "Neutral Zone",
                abbreviation: "NT"
            }, {
                name: "New Caledonia",
                abbreviation: "NC"
            }, {
                name: "New Zealand",
                abbreviation: "NZ"
            }, {
                name: "Nicaragua",
                abbreviation: "NI"
            }, {
                name: "Niger",
                abbreviation: "NE"
            }, {
                name: "Nigeria",
                abbreviation: "NG"
            }, {
                name: "Niue",
                abbreviation: "NU"
            }, {
                name: "Norfolk Island",
                abbreviation: "NF"
            }, {
                name: "North Korea",
                abbreviation: "KP"
            }, {
                name: "North Vietnam",
                abbreviation: "VD"
            }, {
                name: "Northern Mariana Islands",
                abbreviation: "MP"
            }, {
                name: "Norway",
                abbreviation: "NO"
            }, {
                name: "Oman",
                abbreviation: "OM"
            }, {
                name: "Pacific Islands Trust Territory",
                abbreviation: "PC"
            }, {
                name: "Pakistan",
                abbreviation: "PK"
            }, {
                name: "Palau",
                abbreviation: "PW"
            }, {
                name: "Palestinian Territories",
                abbreviation: "PS"
            }, {
                name: "Panama",
                abbreviation: "PA"
            }, {
                name: "Panama Canal Zone",
                abbreviation: "PZ"
            }, {
                name: "Papua New Guinea",
                abbreviation: "PG"
            }, {
                name: "Paraguay",
                abbreviation: "PY"
            }, {
                name: "People's Democratic Republic of Yemen",
                abbreviation: "YD"
            }, {
                name: "Peru",
                abbreviation: "PE"
            }, {
                name: "Philippines",
                abbreviation: "PH"
            }, {
                name: "Pitcairn Islands",
                abbreviation: "PN"
            }, {
                name: "Poland",
                abbreviation: "PL"
            }, {
                name: "Portugal",
                abbreviation: "PT"
            }, {
                name: "Puerto Rico",
                abbreviation: "PR"
            }, {
                name: "Qatar",
                abbreviation: "QA"
            }, {
                name: "Romania",
                abbreviation: "RO"
            }, {
                name: "Russia",
                abbreviation: "RU"
            }, {
                name: "Rwanda",
                abbreviation: "RW"
            }, {
                name: "Réunion",
                abbreviation: "RE"
            }, {
                name: "Saint Barthélemy",
                abbreviation: "BL"
            }, {
                name: "Saint Helena",
                abbreviation: "SH"
            }, {
                name: "Saint Kitts and Nevis",
                abbreviation: "KN"
            }, {
                name: "Saint Lucia",
                abbreviation: "LC"
            }, {
                name: "Saint Martin",
                abbreviation: "MF"
            }, {
                name: "Saint Pierre and Miquelon",
                abbreviation: "PM"
            }, {
                name: "Saint Vincent and the Grenadines",
                abbreviation: "VC"
            }, {
                name: "Samoa",
                abbreviation: "WS"
            }, {
                name: "San Marino",
                abbreviation: "SM"
            }, {
                name: "Saudi Arabia",
                abbreviation: "SA"
            }, {
                name: "Senegal",
                abbreviation: "SN"
            }, {
                name: "Serbia",
                abbreviation: "RS"
            }, {
                name: "Serbia and Montenegro",
                abbreviation: "CS"
            }, {
                name: "Seychelles",
                abbreviation: "SC"
            }, {
                name: "Sierra Leone",
                abbreviation: "SL"
            }, {
                name: "Singapore",
                abbreviation: "SG"
            }, {
                name: "Slovakia",
                abbreviation: "SK"
            }, {
                name: "Slovenia",
                abbreviation: "SI"
            }, {
                name: "Solomon Islands",
                abbreviation: "SB"
            }, {
                name: "Somalia",
                abbreviation: "SO"
            }, {
                name: "South Africa",
                abbreviation: "ZA"
            }, {
                name: "South Georgia and the South Sandwich Islands",
                abbreviation: "GS"
            }, {
                name: "South Korea",
                abbreviation: "KR"
            }, {
                name: "Spain",
                abbreviation: "ES"
            }, {
                name: "Sri Lanka",
                abbreviation: "LK"
            }, {
                name: "Sudan",
                abbreviation: "SD"
            }, {
                name: "Suriname",
                abbreviation: "SR"
            }, {
                name: "Svalbard and Jan Mayen",
                abbreviation: "SJ"
            }, {
                name: "Swaziland",
                abbreviation: "SZ"
            }, {
                name: "Sweden",
                abbreviation: "SE"
            }, {
                name: "Switzerland",
                abbreviation: "CH"
            }, {
                name: "Syria",
                abbreviation: "SY"
            }, {
                name: "São Tomé and Príncipe",
                abbreviation: "ST"
            }, {
                name: "Taiwan",
                abbreviation: "TW"
            }, {
                name: "Tajikistan",
                abbreviation: "TJ"
            }, {
                name: "Tanzania",
                abbreviation: "TZ"
            }, {
                name: "Thailand",
                abbreviation: "TH"
            }, {
                name: "Timor-Leste",
                abbreviation: "TL"
            }, {
                name: "Togo",
                abbreviation: "TG"
            }, {
                name: "Tokelau",
                abbreviation: "TK"
            }, {
                name: "Tonga",
                abbreviation: "TO"
            }, {
                name: "Trinidad and Tobago",
                abbreviation: "TT"
            }, {
                name: "Tunisia",
                abbreviation: "TN"
            }, {
                name: "Turkey",
                abbreviation: "TR"
            }, {
                name: "Turkmenistan",
                abbreviation: "TM"
            }, {
                name: "Turks and Caicos Islands",
                abbreviation: "TC"
            }, {
                name: "Tuvalu",
                abbreviation: "TV"
            }, {
                name: "U.S. Minor Outlying Islands",
                abbreviation: "UM"
            }, {
                name: "U.S. Miscellaneous Pacific Islands",
                abbreviation: "PU"
            }, {
                name: "U.S. Virgin Islands",
                abbreviation: "VI"
            }, {
                name: "Uganda",
                abbreviation: "UG"
            }, {
                name: "Ukraine",
                abbreviation: "UA"
            }, {
                name: "Union of Soviet Socialist Republics",
                abbreviation: "SU"
            }, {
                name: "United Arab Emirates",
                abbreviation: "AE"
            }, {
                name: "United Kingdom",
                abbreviation: "GB"
            }, {
                name: "United States",
                abbreviation: "US"
            }, {
                name: "Unknown or Invalid Region",
                abbreviation: "ZZ"
            }, {
                name: "Uruguay",
                abbreviation: "UY"
            }, {
                name: "Uzbekistan",
                abbreviation: "UZ"
            }, {
                name: "Vanuatu",
                abbreviation: "VU"
            }, {
                name: "Vatican City",
                abbreviation: "VA"
            }, {
                name: "Venezuela",
                abbreviation: "VE"
            }, {
                name: "Vietnam",
                abbreviation: "VN"
            }, {
                name: "Wake Island",
                abbreviation: "WK"
            }, {
                name: "Wallis and Futuna",
                abbreviation: "WF"
            }, {
                name: "Western Sahara",
                abbreviation: "EH"
            }, {
                name: "Yemen",
                abbreviation: "YE"
            }, {
                name: "Zambia",
                abbreviation: "ZM"
            }, {
                name: "Zimbabwe",
                abbreviation: "ZW"
            }, {
                name: "Åland Islands",
                abbreviation: "AX"
            }],
            provinces: [{
                name: "Alberta",
                abbreviation: "AB"
            }, {
                name: "British Columbia",
                abbreviation: "BC"
            }, {
                name: "Manitoba",
                abbreviation: "MB"
            }, {
                name: "New Brunswick",
                abbreviation: "NB"
            }, {
                name: "Newfoundland and Labrador",
                abbreviation: "NL"
            }, {
                name: "Nova Scotia",
                abbreviation: "NS"
            }, {
                name: "Ontario",
                abbreviation: "ON"
            }, {
                name: "Prince Edward Island",
                abbreviation: "PE"
            }, {
                name: "Quebec",
                abbreviation: "QC"
            }, {
                name: "Saskatchewan",
                abbreviation: "SK"
            }, {
                name: "Northwest Territories",
                abbreviation: "NT"
            }, {
                name: "Nunavut",
                abbreviation: "NU"
            }, {
                name: "Yukon",
                abbreviation: "YT"
            }],
            us_states_and_dc: [{
                name: "Alabama",
                abbreviation: "AL"
            }, {
                name: "Alaska",
                abbreviation: "AK"
            }, {
                name: "Arizona",
                abbreviation: "AZ"
            }, {
                name: "Arkansas",
                abbreviation: "AR"
            }, {
                name: "California",
                abbreviation: "CA"
            }, {
                name: "Colorado",
                abbreviation: "CO"
            }, {
                name: "Connecticut",
                abbreviation: "CT"
            }, {
                name: "Delaware",
                abbreviation: "DE"
            }, {
                name: "District of Columbia",
                abbreviation: "DC"
            }, {
                name: "Florida",
                abbreviation: "FL"
            }, {
                name: "Georgia",
                abbreviation: "GA"
            }, {
                name: "Hawaii",
                abbreviation: "HI"
            }, {
                name: "Idaho",
                abbreviation: "ID"
            }, {
                name: "Illinois",
                abbreviation: "IL"
            }, {
                name: "Indiana",
                abbreviation: "IN"
            }, {
                name: "Iowa",
                abbreviation: "IA"
            }, {
                name: "Kansas",
                abbreviation: "KS"
            }, {
                name: "Kentucky",
                abbreviation: "KY"
            }, {
                name: "Louisiana",
                abbreviation: "LA"
            }, {
                name: "Maine",
                abbreviation: "ME"
            }, {
                name: "Maryland",
                abbreviation: "MD"
            }, {
                name: "Massachusetts",
                abbreviation: "MA"
            }, {
                name: "Michigan",
                abbreviation: "MI"
            }, {
                name: "Minnesota",
                abbreviation: "MN"
            }, {
                name: "Mississippi",
                abbreviation: "MS"
            }, {
                name: "Missouri",
                abbreviation: "MO"
            }, {
                name: "Montana",
                abbreviation: "MT"
            }, {
                name: "Nebraska",
                abbreviation: "NE"
            }, {
                name: "Nevada",
                abbreviation: "NV"
            }, {
                name: "New Hampshire",
                abbreviation: "NH"
            }, {
                name: "New Jersey",
                abbreviation: "NJ"
            }, {
                name: "New Mexico",
                abbreviation: "NM"
            }, {
                name: "New York",
                abbreviation: "NY"
            }, {
                name: "North Carolina",
                abbreviation: "NC"
            }, {
                name: "North Dakota",
                abbreviation: "ND"
            }, {
                name: "Ohio",
                abbreviation: "OH"
            }, {
                name: "Oklahoma",
                abbreviation: "OK"
            }, {
                name: "Oregon",
                abbreviation: "OR"
            }, {
                name: "Pennsylvania",
                abbreviation: "PA"
            }, {
                name: "Rhode Island",
                abbreviation: "RI"
            }, {
                name: "South Carolina",
                abbreviation: "SC"
            }, {
                name: "South Dakota",
                abbreviation: "SD"
            }, {
                name: "Tennessee",
                abbreviation: "TN"
            }, {
                name: "Texas",
                abbreviation: "TX"
            }, {
                name: "Utah",
                abbreviation: "UT"
            }, {
                name: "Vermont",
                abbreviation: "VT"
            }, {
                name: "Virginia",
                abbreviation: "VA"
            }, {
                name: "Washington",
                abbreviation: "WA"
            }, {
                name: "West Virginia",
                abbreviation: "WV"
            }, {
                name: "Wisconsin",
                abbreviation: "WI"
            }, {
                name: "Wyoming",
                abbreviation: "WY"
            }],
            territories: [{
                name: "American Samoa",
                abbreviation: "AS"
            }, {
                name: "Federated States of Micronesia",
                abbreviation: "FM"
            }, {
                name: "Guam",
                abbreviation: "GU"
            }, {
                name: "Marshall Islands",
                abbreviation: "MH"
            }, {
                name: "Northern Mariana Islands",
                abbreviation: "MP"
            }, {
                name: "Puerto Rico",
                abbreviation: "PR"
            }, {
                name: "Virgin Islands, U.S.",
                abbreviation: "VI"
            }],
            armed_forces: [{
                name: "Armed Forces Europe",
                abbreviation: "AE"
            }, {
                name: "Armed Forces Pacific",
                abbreviation: "AP"
            }, {
                name: "Armed Forces the Americas",
                abbreviation: "AA"
            }],
            street_suffixes: [{
                name: "Avenue",
                abbreviation: "Ave"
            }, {
                name: "Boulevard",
                abbreviation: "Blvd"
            }, {
                name: "Center",
                abbreviation: "Ctr"
            }, {
                name: "Circle",
                abbreviation: "Cir"
            }, {
                name: "Court",
                abbreviation: "Ct"
            }, {
                name: "Drive",
                abbreviation: "Dr"
            }, {
                name: "Extension",
                abbreviation: "Ext"
            }, {
                name: "Glen",
                abbreviation: "Gln"
            }, {
                name: "Grove",
                abbreviation: "Grv"
            }, {
                name: "Heights",
                abbreviation: "Hts"
            }, {
                name: "Highway",
                abbreviation: "Hwy"
            }, {
                name: "Junction",
                abbreviation: "Jct"
            }, {
                name: "Key",
                abbreviation: "Key"
            }, {
                name: "Lane",
                abbreviation: "Ln"
            }, {
                name: "Loop",
                abbreviation: "Loop"
            }, {
                name: "Manor",
                abbreviation: "Mnr"
            }, {
                name: "Mill",
                abbreviation: "Mill"
            }, {
                name: "Park",
                abbreviation: "Park"
            }, {
                name: "Parkway",
                abbreviation: "Pkwy"
            }, {
                name: "Pass",
                abbreviation: "Pass"
            }, {
                name: "Path",
                abbreviation: "Path"
            }, {
                name: "Pike",
                abbreviation: "Pike"
            }, {
                name: "Place",
                abbreviation: "Pl"
            }, {
                name: "Plaza",
                abbreviation: "Plz"
            }, {
                name: "Point",
                abbreviation: "Pt"
            }, {
                name: "Ridge",
                abbreviation: "Rdg"
            }, {
                name: "River",
                abbreviation: "Riv"
            }, {
                name: "Road",
                abbreviation: "Rd"
            }, {
                name: "Square",
                abbreviation: "Sq"
            }, {
                name: "Street",
                abbreviation: "St"
            }, {
                name: "Terrace",
                abbreviation: "Ter"
            }, {
                name: "Trail",
                abbreviation: "Trl"
            }, {
                name: "Turnpike",
                abbreviation: "Tpke"
            }, {
                name: "View",
                abbreviation: "Vw"
            }, {
                name: "Way",
                abbreviation: "Way"
            }],
            months: [{
                name: "January",
                short_name: "Jan",
                numeric: "01",
                days: 31
            }, {
                name: "February",
                short_name: "Feb",
                numeric: "02",
                days: 28
            }, {
                name: "March",
                short_name: "Mar",
                numeric: "03",
                days: 31
            }, {
                name: "April",
                short_name: "Apr",
                numeric: "04",
                days: 30
            }, {
                name: "May",
                short_name: "May",
                numeric: "05",
                days: 31
            }, {
                name: "June",
                short_name: "Jun",
                numeric: "06",
                days: 30
            }, {
                name: "July",
                short_name: "Jul",
                numeric: "07",
                days: 31
            }, {
                name: "August",
                short_name: "Aug",
                numeric: "08",
                days: 31
            }, {
                name: "September",
                short_name: "Sep",
                numeric: "09",
                days: 30
            }, {
                name: "October",
                short_name: "Oct",
                numeric: "10",
                days: 31
            }, {
                name: "November",
                short_name: "Nov",
                numeric: "11",
                days: 30
            }, {
                name: "December",
                short_name: "Dec",
                numeric: "12",
                days: 31
            }],
            cc_types: [{
                name: "American Express",
                short_name: "amex",
                prefix: "34",
                length: 15
            }, {
                name: "Bankcard",
                short_name: "bankcard",
                prefix: "5610",
                length: 16
            }, {
                name: "China UnionPay",
                short_name: "chinaunion",
                prefix: "62",
                length: 16
            }, {
                name: "Diners Club Carte Blanche",
                short_name: "dccarte",
                prefix: "300",
                length: 14
            }, {
                name: "Diners Club enRoute",
                short_name: "dcenroute",
                prefix: "2014",
                length: 15
            }, {
                name: "Diners Club International",
                short_name: "dcintl",
                prefix: "36",
                length: 14
            }, {
                name: "Diners Club United States & Canada",
                short_name: "dcusc",
                prefix: "54",
                length: 16
            }, {
                name: "Discover Card",
                short_name: "discover",
                prefix: "6011",
                length: 16
            }, {
                name: "InstaPayment",
                short_name: "instapay",
                prefix: "637",
                length: 16
            }, {
                name: "JCB",
                short_name: "jcb",
                prefix: "3528",
                length: 16
            }, {
                name: "Laser",
                short_name: "laser",
                prefix: "6304",
                length: 16
            }, {
                name: "Maestro",
                short_name: "maestro",
                prefix: "5018",
                length: 16
            }, {
                name: "Mastercard",
                short_name: "mc",
                prefix: "51",
                length: 16
            }, {
                name: "Solo",
                short_name: "solo",
                prefix: "6334",
                length: 16
            }, {
                name: "Switch",
                short_name: "switch",
                prefix: "4903",
                length: 16
            }, {
                name: "Visa",
                short_name: "visa",
                prefix: "4",
                length: 16
            }, {
                name: "Visa Electron",
                short_name: "electron",
                prefix: "4026",
                length: 16
            }],
            currency_types: [{
                code: "AED",
                name: "United Arab Emirates Dirham"
            }, {
                code: "AFN",
                name: "Afghanistan Afghani"
            }, {
                code: "ALL",
                name: "Albania Lek"
            }, {
                code: "AMD",
                name: "Armenia Dram"
            }, {
                code: "ANG",
                name: "Netherlands Antilles Guilder"
            }, {
                code: "AOA",
                name: "Angola Kwanza"
            }, {
                code: "ARS",
                name: "Argentina Peso"
            }, {
                code: "AUD",
                name: "Australia Dollar"
            }, {
                code: "AWG",
                name: "Aruba Guilder"
            }, {
                code: "AZN",
                name: "Azerbaijan New Manat"
            }, {
                code: "BAM",
                name: "Bosnia and Herzegovina Convertible Marka"
            }, {
                code: "BBD",
                name: "Barbados Dollar"
            }, {
                code: "BDT",
                name: "Bangladesh Taka"
            }, {
                code: "BGN",
                name: "Bulgaria Lev"
            }, {
                code: "BHD",
                name: "Bahrain Dinar"
            }, {
                code: "BIF",
                name: "Burundi Franc"
            }, {
                code: "BMD",
                name: "Bermuda Dollar"
            }, {
                code: "BND",
                name: "Brunei Darussalam Dollar"
            }, {
                code: "BOB",
                name: "Bolivia Boliviano"
            }, {
                code: "BRL",
                name: "Brazil Real"
            }, {
                code: "BSD",
                name: "Bahamas Dollar"
            }, {
                code: "BTN",
                name: "Bhutan Ngultrum"
            }, {
                code: "BWP",
                name: "Botswana Pula"
            }, {
                code: "BYR",
                name: "Belarus Ruble"
            }, {
                code: "BZD",
                name: "Belize Dollar"
            }, {
                code: "CAD",
                name: "Canada Dollar"
            }, {
                code: "CDF",
                name: "Congo/Kinshasa Franc"
            }, {
                code: "CHF",
                name: "Switzerland Franc"
            }, {
                code: "CLP",
                name: "Chile Peso"
            }, {
                code: "CNY",
                name: "China Yuan Renminbi"
            }, {
                code: "COP",
                name: "Colombia Peso"
            }, {
                code: "CRC",
                name: "Costa Rica Colon"
            }, {
                code: "CUC",
                name: "Cuba Convertible Peso"
            }, {
                code: "CUP",
                name: "Cuba Peso"
            }, {
                code: "CVE",
                name: "Cape Verde Escudo"
            }, {
                code: "CZK",
                name: "Czech Republic Koruna"
            }, {
                code: "DJF",
                name: "Djibouti Franc"
            }, {
                code: "DKK",
                name: "Denmark Krone"
            }, {
                code: "DOP",
                name: "Dominican Republic Peso"
            }, {
                code: "DZD",
                name: "Algeria Dinar"
            }, {
                code: "EGP",
                name: "Egypt Pound"
            }, {
                code: "ERN",
                name: "Eritrea Nakfa"
            }, {
                code: "ETB",
                name: "Ethiopia Birr"
            }, {
                code: "EUR",
                name: "Euro Member Countries"
            }, {
                code: "FJD",
                name: "Fiji Dollar"
            }, {
                code: "FKP",
                name: "Falkland Islands (Malvinas) Pound"
            }, {
                code: "GBP",
                name: "United Kingdom Pound"
            }, {
                code: "GEL",
                name: "Georgia Lari"
            }, {
                code: "GGP",
                name: "Guernsey Pound"
            }, {
                code: "GHS",
                name: "Ghana Cedi"
            }, {
                code: "GIP",
                name: "Gibraltar Pound"
            }, {
                code: "GMD",
                name: "Gambia Dalasi"
            }, {
                code: "GNF",
                name: "Guinea Franc"
            }, {
                code: "GTQ",
                name: "Guatemala Quetzal"
            }, {
                code: "GYD",
                name: "Guyana Dollar"
            }, {
                code: "HKD",
                name: "Hong Kong Dollar"
            }, {
                code: "HNL",
                name: "Honduras Lempira"
            }, {
                code: "HRK",
                name: "Croatia Kuna"
            }, {
                code: "HTG",
                name: "Haiti Gourde"
            }, {
                code: "HUF",
                name: "Hungary Forint"
            }, {
                code: "IDR",
                name: "Indonesia Rupiah"
            }, {
                code: "ILS",
                name: "Israel Shekel"
            }, {
                code: "IMP",
                name: "Isle of Man Pound"
            }, {
                code: "INR",
                name: "India Rupee"
            }, {
                code: "IQD",
                name: "Iraq Dinar"
            }, {
                code: "IRR",
                name: "Iran Rial"
            }, {
                code: "ISK",
                name: "Iceland Krona"
            }, {
                code: "JEP",
                name: "Jersey Pound"
            }, {
                code: "JMD",
                name: "Jamaica Dollar"
            }, {
                code: "JOD",
                name: "Jordan Dinar"
            }, {
                code: "JPY",
                name: "Japan Yen"
            }, {
                code: "KES",
                name: "Kenya Shilling"
            }, {
                code: "KGS",
                name: "Kyrgyzstan Som"
            }, {
                code: "KHR",
                name: "Cambodia Riel"
            }, {
                code: "KMF",
                name: "Comoros Franc"
            }, {
                code: "KPW",
                name: "Korea (North) Won"
            }, {
                code: "KRW",
                name: "Korea (South) Won"
            }, {
                code: "KWD",
                name: "Kuwait Dinar"
            }, {
                code: "KYD",
                name: "Cayman Islands Dollar"
            }, {
                code: "KZT",
                name: "Kazakhstan Tenge"
            }, {
                code: "LAK",
                name: "Laos Kip"
            }, {
                code: "LBP",
                name: "Lebanon Pound"
            }, {
                code: "LKR",
                name: "Sri Lanka Rupee"
            }, {
                code: "LRD",
                name: "Liberia Dollar"
            }, {
                code: "LSL",
                name: "Lesotho Loti"
            }, {
                code: "LTL",
                name: "Lithuania Litas"
            }, {
                code: "LYD",
                name: "Libya Dinar"
            }, {
                code: "MAD",
                name: "Morocco Dirham"
            }, {
                code: "MDL",
                name: "Moldova Leu"
            }, {
                code: "MGA",
                name: "Madagascar Ariary"
            }, {
                code: "MKD",
                name: "Macedonia Denar"
            }, {
                code: "MMK",
                name: "Myanmar (Burma) Kyat"
            }, {
                code: "MNT",
                name: "Mongolia Tughrik"
            }, {
                code: "MOP",
                name: "Macau Pataca"
            }, {
                code: "MRO",
                name: "Mauritania Ouguiya"
            }, {
                code: "MUR",
                name: "Mauritius Rupee"
            }, {
                code: "MVR",
                name: "Maldives (Maldive Islands) Rufiyaa"
            }, {
                code: "MWK",
                name: "Malawi Kwacha"
            }, {
                code: "MXN",
                name: "Mexico Peso"
            }, {
                code: "MYR",
                name: "Malaysia Ringgit"
            }, {
                code: "MZN",
                name: "Mozambique Metical"
            }, {
                code: "NAD",
                name: "Namibia Dollar"
            }, {
                code: "NGN",
                name: "Nigeria Naira"
            }, {
                code: "NIO",
                name: "Nicaragua Cordoba"
            }, {
                code: "NOK",
                name: "Norway Krone"
            }, {
                code: "NPR",
                name: "Nepal Rupee"
            }, {
                code: "NZD",
                name: "New Zealand Dollar"
            }, {
                code: "OMR",
                name: "Oman Rial"
            }, {
                code: "PAB",
                name: "Panama Balboa"
            }, {
                code: "PEN",
                name: "Peru Nuevo Sol"
            }, {
                code: "PGK",
                name: "Papua New Guinea Kina"
            }, {
                code: "PHP",
                name: "Philippines Peso"
            }, {
                code: "PKR",
                name: "Pakistan Rupee"
            }, {
                code: "PLN",
                name: "Poland Zloty"
            }, {
                code: "PYG",
                name: "Paraguay Guarani"
            }, {
                code: "QAR",
                name: "Qatar Riyal"
            }, {
                code: "RON",
                name: "Romania New Leu"
            }, {
                code: "RSD",
                name: "Serbia Dinar"
            }, {
                code: "RUB",
                name: "Russia Ruble"
            }, {
                code: "RWF",
                name: "Rwanda Franc"
            }, {
                code: "SAR",
                name: "Saudi Arabia Riyal"
            }, {
                code: "SBD",
                name: "Solomon Islands Dollar"
            }, {
                code: "SCR",
                name: "Seychelles Rupee"
            }, {
                code: "SDG",
                name: "Sudan Pound"
            }, {
                code: "SEK",
                name: "Sweden Krona"
            }, {
                code: "SGD",
                name: "Singapore Dollar"
            }, {
                code: "SHP",
                name: "Saint Helena Pound"
            }, {
                code: "SLL",
                name: "Sierra Leone Leone"
            }, {
                code: "SOS",
                name: "Somalia Shilling"
            }, {
                code: "SPL",
                name: "Seborga Luigino"
            }, {
                code: "SRD",
                name: "Suriname Dollar"
            }, {
                code: "STD",
                name: "São Tomé and Príncipe Dobra"
            }, {
                code: "SVC",
                name: "El Salvador Colon"
            }, {
                code: "SYP",
                name: "Syria Pound"
            }, {
                code: "SZL",
                name: "Swaziland Lilangeni"
            }, {
                code: "THB",
                name: "Thailand Baht"
            }, {
                code: "TJS",
                name: "Tajikistan Somoni"
            }, {
                code: "TMT",
                name: "Turkmenistan Manat"
            }, {
                code: "TND",
                name: "Tunisia Dinar"
            }, {
                code: "TOP",
                name: "Tonga Pa'anga"
            }, {
                code: "TRY",
                name: "Turkey Lira"
            }, {
                code: "TTD",
                name: "Trinidad and Tobago Dollar"
            }, {
                code: "TVD",
                name: "Tuvalu Dollar"
            }, {
                code: "TWD",
                name: "Taiwan New Dollar"
            }, {
                code: "TZS",
                name: "Tanzania Shilling"
            }, {
                code: "UAH",
                name: "Ukraine Hryvnia"
            }, {
                code: "UGX",
                name: "Uganda Shilling"
            }, {
                code: "USD",
                name: "United States Dollar"
            }, {
                code: "UYU",
                name: "Uruguay Peso"
            }, {
                code: "UZS",
                name: "Uzbekistan Som"
            }, {
                code: "VEF",
                name: "Venezuela Bolivar"
            }, {
                code: "VND",
                name: "Viet Nam Dong"
            }, {
                code: "VUV",
                name: "Vanuatu Vatu"
            }, {
                code: "WST",
                name: "Samoa Tala"
            }, {
                code: "XAF",
                name: "Communauté Financière Africaine (BEAC) CFA Franc BEAC"
            }, {
                code: "XCD",
                name: "East Caribbean Dollar"
            }, {
                code: "XDR",
                name: "International Monetary Fund (IMF) Special Drawing Rights"
            }, {
                code: "XOF",
                name: "Communauté Financière Africaine (BCEAO) Franc"
            }, {
                code: "XPF",
                name: "Comptoirs Français du Pacifique (CFP) Franc"
            }, {
                code: "YER",
                name: "Yemen Rial"
            }, {
                code: "ZAR",
                name: "South Africa Rand"
            }, {
                code: "ZMW",
                name: "Zambia Kwacha"
            }, {
                code: "ZWD",
                name: "Zimbabwe Dollar"
            }]
        },
        q = Object.prototype.hasOwnProperty,
        r = Object.keys || function(a) {
            var b = [];
            for (var c in a)
                q.call(a, c) && b.push(c);
            return b
        };
    a.prototype.get = function(a) {
        return g(p[a])
    }, a.prototype.mac_address = function(a) {
        a = b(a), a.separator || (a.separator = a.networkVersion ? "." : ":");
        var c = "ABCDEF1234567890",
            d = "";
        return d = a.networkVersion ? this.n(this.string, 3, {
            pool: c,
            length: 4
        }).join(a.separator) : this.n(this.string, 6, {
            pool: c,
            length: 2
        }).join(a.separator)
    }, a.prototype.normal = function(a) {
        a = b(a, {
            mean: 0,
            dev: 1
        });
        var c,
            d,
            e,
            f,
            g = a.mean,
            h = a.dev;
        do d = 2 * this.random() - 1, e = 2 * this.random() - 1, c = d * d + e * e;
        while (c >= 1);
        return f = d * Math.sqrt(-2 * Math.log(c) / c), h * f + g
    }, a.prototype.radio = function(a) {
        a = b(a, {
            side: "?"
        });
        var c = "";
        switch (a.side.toLowerCase()) {
        case "east":
        case "e":
            c = "W";
            break;
        case "west":
        case "w":
            c = "K";
            break;
        default:
            c = this.character({
                pool: "KW"
            })
        }
        return c + this.character({
            alpha: !0,
            casing: "upper"
        }) + this.character({
            alpha: !0,
            casing: "upper"
        }) + this.character({
            alpha: !0,
            casing: "upper"
        })
    }, a.prototype.set = function(a, b) {
        "string" == typeof a ? p[a] = b : p = g(a, p)
    }, a.prototype.tv = function(a) {
        return this.radio(a)
    }, a.prototype.cnpj = function() {
        var a = this.n(this.natural, 8, {
                max: 9
            }),
            b = 2 + 6 * a[7] + 7 * a[6] + 8 * a[5] + 9 * a[4] + 2 * a[3] + 3 * a[2] + 4 * a[1] + 5 * a[0];
        b = 11 - b % 11, b >= 10 && (b = 0);
        var c = 2 * b + 3 + 7 * a[7] + 8 * a[6] + 9 * a[5] + 2 * a[4] + 3 * a[3] + 4 * a[2] + 5 * a[1] + 6 * a[0];
        return c = 11 - c % 11, c >= 10 && (c = 0), "" + a[0] + a[1] + "." + a[2] + a[3] + a[4] + "." + a[5] + a[6] + a[7] + "/0001-" + b + c
    }, a.prototype.mersenne_twister = function(a) {
        return new s(a)
    }, a.prototype.blueimp_md5 = function() {
        return new t
    };
    var s = function(a) {
        void 0 === a && (a = Math.floor(Math.random() * Math.pow(10, 13))), this.N = 624, this.M = 397, this.MATRIX_A = 2567483615, this.UPPER_MASK = 2147483648, this.LOWER_MASK = 2147483647, this.mt = new Array(this.N), this.mti = this.N + 1, this.init_genrand(a)
    };
    s.prototype.init_genrand = function(a) {
        for (this.mt[0] = a >>> 0, this.mti = 1; this.mti < this.N; this.mti++)
            a = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30, this.mt[this.mti] = (1812433253 * ((4294901760 & a) >>> 16) << 16) + 1812433253 * (65535 & a) + this.mti, this.mt[this.mti] >>>= 0
    }, s.prototype.init_by_array = function(a, b) {
        var c,
            d,
            e = 1,
            f = 0;
        for (this.init_genrand(19650218), c = this.N > b ? this.N : b; c; c--)
            d = this.mt[e - 1] ^ this.mt[e - 1] >>> 30, this.mt[e] = (this.mt[e] ^ (1664525 * ((4294901760 & d) >>> 16) << 16) + 1664525 * (65535 & d)) + a[f] + f, this.mt[e] >>>= 0, e++, f++, e >= this.N && (this.mt[0] = this.mt[this.N - 1], e = 1), f >= b && (f = 0);
        for (c = this.N - 1; c; c--)
            d = this.mt[e - 1] ^ this.mt[e - 1] >>> 30, this.mt[e] = (this.mt[e] ^ (1566083941 * ((4294901760 & d) >>> 16) << 16) + 1566083941 * (65535 & d)) - e, this.mt[e] >>>= 0, e++, e >= this.N && (this.mt[0] = this.mt[this.N - 1], e = 1);
        this.mt[0] = 2147483648
    }, s.prototype.genrand_int32 = function() {
        var a,
            b = new Array(0, this.MATRIX_A);
        if (this.mti >= this.N) {
            var c;
            for (this.mti === this.N + 1 && this.init_genrand(5489), c = 0; c < this.N - this.M; c++)
                a = this.mt[c] & this.UPPER_MASK | this.mt[c + 1] & this.LOWER_MASK, this.mt[c] = this.mt[c + this.M] ^ a >>> 1 ^ b[1 & a];
            for (; c < this.N - 1; c++)
                a = this.mt[c] & this.UPPER_MASK | this.mt[c + 1] & this.LOWER_MASK, this.mt[c] = this.mt[c + (this.M - this.N)] ^ a >>> 1 ^ b[1 & a];
            a = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK, this.mt[this.N - 1] = this.mt[this.M - 1] ^ a >>> 1 ^ b[1 & a], this.mti = 0
        }
        return a = this.mt[this.mti++], a ^= a >>> 11, a ^= a << 7 & 2636928640, a ^= a << 15 & 4022730752, a ^= a >>> 18, a >>> 0
    }, s.prototype.genrand_int31 = function() {
        return this.genrand_int32() >>> 1
    }, s.prototype.genrand_real1 = function() {
        return this.genrand_int32() * (1 / 4294967295)
    }, s.prototype.random = function() {
        return this.genrand_int32() * (1 / 4294967296)
    }, s.prototype.genrand_real3 = function() {
        return (this.genrand_int32() + .5) * (1 / 4294967296)
    }, s.prototype.genrand_res53 = function() {
        var a = this.genrand_int32() >>> 5,
            b = this.genrand_int32() >>> 6;
        return (67108864 * a + b) * (1 / 9007199254740992)
    };
    var t = function() {};
    t.prototype.VERSION = "1.0.1", t.prototype.safe_add = function(a, b) {
        var c = (65535 & a) + (65535 & b),
            d = (a >> 16) + (b >> 16) + (c >> 16);
        return d << 16 | 65535 & c
    }, t.prototype.bit_roll = function(a, b) {
        return a << b | a >>> 32 - b
    }, t.prototype.md5_cmn = function(a, b, c, d, e, f) {
        return this.safe_add(this.bit_roll(this.safe_add(this.safe_add(b, a), this.safe_add(d, f)), e), c)
    }, t.prototype.md5_ff = function(a, b, c, d, e, f, g) {
        return this.md5_cmn(b & c | ~b & d, a, b, e, f, g)
    }, t.prototype.md5_gg = function(a, b, c, d, e, f, g) {
        return this.md5_cmn(b & d | c & ~d, a, b, e, f, g)
    }, t.prototype.md5_hh = function(a, b, c, d, e, f, g) {
        return this.md5_cmn(b ^ c ^ d, a, b, e, f, g)
    }, t.prototype.md5_ii = function(a, b, c, d, e, f, g) {
        return this.md5_cmn(c ^ (b | ~d), a, b, e, f, g)
    }, t.prototype.binl_md5 = function(a, b) {
        a[b >> 5] |= 128 << b % 32, a[(b + 64 >>> 9 << 4) + 14] = b;
        var c,
            d,
            e,
            f,
            g,
            h = 1732584193,
            i = -271733879,
            j = -1732584194,
            k = 271733878;
        for (c = 0; c < a.length; c += 16)
            d = h, e = i, f = j, g = k, h = this.md5_ff(h, i, j, k, a[c], 7, -680876936), k = this.md5_ff(k, h, i, j, a[c + 1], 12, -389564586), j = this.md5_ff(j, k, h, i, a[c + 2], 17, 606105819), i = this.md5_ff(i, j, k, h, a[c + 3], 22, -1044525330), h = this.md5_ff(h, i, j, k, a[c + 4], 7, -176418897), k = this.md5_ff(k, h, i, j, a[c + 5], 12, 1200080426), j = this.md5_ff(j, k, h, i, a[c + 6], 17, -1473231341), i = this.md5_ff(i, j, k, h, a[c + 7], 22, -45705983), h = this.md5_ff(h, i, j, k, a[c + 8], 7, 1770035416), k = this.md5_ff(k, h, i, j, a[c + 9], 12, -1958414417), j = this.md5_ff(j, k, h, i, a[c + 10], 17, -42063), i = this.md5_ff(i, j, k, h, a[c + 11], 22, -1990404162), h = this.md5_ff(h, i, j, k, a[c + 12], 7, 1804603682), k = this.md5_ff(k, h, i, j, a[c + 13], 12, -40341101), j = this.md5_ff(j, k, h, i, a[c + 14], 17, -1502002290), i = this.md5_ff(i, j, k, h, a[c + 15], 22, 1236535329), h = this.md5_gg(h, i, j, k, a[c + 1], 5, -165796510), k = this.md5_gg(k, h, i, j, a[c + 6], 9, -1069501632), j = this.md5_gg(j, k, h, i, a[c + 11], 14, 643717713), i = this.md5_gg(i, j, k, h, a[c], 20, -373897302), h = this.md5_gg(h, i, j, k, a[c + 5], 5, -701558691), k = this.md5_gg(k, h, i, j, a[c + 10], 9, 38016083), j = this.md5_gg(j, k, h, i, a[c + 15], 14, -660478335), i = this.md5_gg(i, j, k, h, a[c + 4], 20, -405537848), h = this.md5_gg(h, i, j, k, a[c + 9], 5, 568446438), k = this.md5_gg(k, h, i, j, a[c + 14], 9, -1019803690), j = this.md5_gg(j, k, h, i, a[c + 3], 14, -187363961), i = this.md5_gg(i, j, k, h, a[c + 8], 20, 1163531501), h = this.md5_gg(h, i, j, k, a[c + 13], 5, -1444681467), k = this.md5_gg(k, h, i, j, a[c + 2], 9, -51403784), j = this.md5_gg(j, k, h, i, a[c + 7], 14, 1735328473), i = this.md5_gg(i, j, k, h, a[c + 12], 20, -1926607734), h = this.md5_hh(h, i, j, k, a[c + 5], 4, -378558), k = this.md5_hh(k, h, i, j, a[c + 8], 11, -2022574463), j = this.md5_hh(j, k, h, i, a[c + 11], 16, 1839030562), i = this.md5_hh(i, j, k, h, a[c + 14], 23, -35309556), h = this.md5_hh(h, i, j, k, a[c + 1], 4, -1530992060), k = this.md5_hh(k, h, i, j, a[c + 4], 11, 1272893353), j = this.md5_hh(j, k, h, i, a[c + 7], 16, -155497632), i = this.md5_hh(i, j, k, h, a[c + 10], 23, -1094730640), h = this.md5_hh(h, i, j, k, a[c + 13], 4, 681279174), k = this.md5_hh(k, h, i, j, a[c], 11, -358537222), j = this.md5_hh(j, k, h, i, a[c + 3], 16, -722521979), i = this.md5_hh(i, j, k, h, a[c + 6], 23, 76029189), h = this.md5_hh(h, i, j, k, a[c + 9], 4, -640364487), k = this.md5_hh(k, h, i, j, a[c + 12], 11, -421815835), j = this.md5_hh(j, k, h, i, a[c + 15], 16, 530742520), i = this.md5_hh(i, j, k, h, a[c + 2], 23, -995338651), h = this.md5_ii(h, i, j, k, a[c], 6, -198630844), k = this.md5_ii(k, h, i, j, a[c + 7], 10, 1126891415), j = this.md5_ii(j, k, h, i, a[c + 14], 15, -1416354905), i = this.md5_ii(i, j, k, h, a[c + 5], 21, -57434055), h = this.md5_ii(h, i, j, k, a[c + 12], 6, 1700485571), k = this.md5_ii(k, h, i, j, a[c + 3], 10, -1894986606), j = this.md5_ii(j, k, h, i, a[c + 10], 15, -1051523), i = this.md5_ii(i, j, k, h, a[c + 1], 21, -2054922799), h = this.md5_ii(h, i, j, k, a[c + 8], 6, 1873313359), k = this.md5_ii(k, h, i, j, a[c + 15], 10, -30611744), j = this.md5_ii(j, k, h, i, a[c + 6], 15, -1560198380), i = this.md5_ii(i, j, k, h, a[c + 13], 21, 1309151649), h = this.md5_ii(h, i, j, k, a[c + 4], 6, -145523070), k = this.md5_ii(k, h, i, j, a[c + 11], 10, -1120210379), j = this.md5_ii(j, k, h, i, a[c + 2], 15, 718787259), i = this.md5_ii(i, j, k, h, a[c + 9], 21, -343485551), h = this.safe_add(h, d), i = this.safe_add(i, e), j = this.safe_add(j, f), k = this.safe_add(k, g);
        return [h, i, j, k]
    }, t.prototype.binl2rstr = function(a) {
        var b,
            c = "";
        for (b = 0; b < 32 * a.length; b += 8)
            c += String.fromCharCode(a[b >> 5] >>> b % 32 & 255);
        return c
    }, t.prototype.rstr2binl = function(a) {
        var b,
            c = [];
        for (c[(a.length >> 2) - 1] = void 0, b = 0; b < c.length; b += 1)
            c[b] = 0;
        for (b = 0; b < 8 * a.length; b += 8)
            c[b >> 5] |= (255 & a.charCodeAt(b / 8)) << b % 32;
        return c
    }, t.prototype.rstr_md5 = function(a) {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(a), 8 * a.length))
    }, t.prototype.rstr_hmac_md5 = function(a, b) {
        var c,
            d,
            e = this.rstr2binl(a),
            f = [],
            g = [];
        for (f[15] = g[15] = void 0, e.length > 16 && (e = this.binl_md5(e, 8 * a.length)), c = 0; 16 > c; c += 1)
            f[c] = 909522486 ^ e[c], g[c] = 1549556828 ^ e[c];
        return d = this.binl_md5(f.concat(this.rstr2binl(b)), 512 + 8 * b.length), this.binl2rstr(this.binl_md5(g.concat(d), 640))
    }, t.prototype.rstr2hex = function(a) {
        var b,
            c,
            d = "0123456789abcdef",
            e = "";
        for (c = 0; c < a.length; c += 1)
            b = a.charCodeAt(c), e += d.charAt(b >>> 4 & 15) + d.charAt(15 & b);
        return e
    }, t.prototype.str2rstr_utf8 = function(a) {
        return unescape(encodeURIComponent(a))
    }, t.prototype.raw_md5 = function(a) {
        return this.rstr_md5(this.str2rstr_utf8(a))
    }, t.prototype.hex_md5 = function(a) {
        return this.rstr2hex(this.raw_md5(a))
    }, t.prototype.raw_hmac_md5 = function(a, b) {
        return this.rstr_hmac_md5(this.str2rstr_utf8(a), this.str2rstr_utf8(b))
    }, t.prototype.hex_hmac_md5 = function(a, b) {
        return this.rstr2hex(this.raw_hmac_md5(a, b))
    }, t.prototype.md5 = function(a, b, c) {
        return b ? c ? this.raw_hmac_md5(b, a) : this.hex_hmac_md5(b, a) : c ? this.raw_md5(a) : this.hex_md5(a)
    }, "undefined" != typeof exports && ("undefined" != typeof module && module.exports && (exports = module.exports = a), exports.Chance = a), "function" == typeof define && define.amd && define([], function() {
        return a
    }), "undefined" != typeof importScripts && (chance = new a), "object" == typeof window && "object" == typeof window.document && (window.Chance = a, window.chance = new a)
}(), function(a) {
    "use strict";
    function b(a) {
        return new RegExp("(^|\\s+)" + a + "(\\s+|$)")
    }
    function c(a, b) {
        var c = d(a, b) ? f : e;
        c(a, b)
    }
    var d,
        e,
        f;
    "classList" in document.documentElement ? (d = function(a, b) {
        return a.classList.contains(b)
    }, e = function(a, b) {
        a.classList.add(b)
    }, f = function(a, b) {
        a.classList.remove(b)
    }) : (d = function(a, c) {
        return b(c).test(a.className)
    }, e = function(a, b) {
        d(a, b) || (a.className = a.className + " " + b)
    }, f = function(a, c) {
        a.className = a.className.replace(b(c), " ")
    });
    var g = {
        hasClass: d,
        addClass: e,
        removeClass: f,
        toggleClass: c,
        has: d,
        add: e,
        remove: f,
        toggle: c
    };
    "function" == typeof define && define.amd ? define(g) : a.classie = g
}(window), function() {
    function a() {}
    function b(a, b) {
        for (var c = a.length; c--;)
            if (a[c].listener === b)
                return c;
        return -1
    }
    function c(a) {
        return function() {
            return this[a].apply(this, arguments)
        }
    }
    var d = a.prototype,
        e = this,
        f = e.EventEmitter;
    d.getListeners = function(a) {
        var b,
            c,
            d = this._getEvents();
        if ("object" == typeof a) {
            b = {};
            for (c in d)
                d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c])
        } else
            b = d[a] || (d[a] = []);
        return b
    }, d.flattenListeners = function(a) {
        var b,
            c = [];
        for (b = 0; b < a.length; b += 1)
            c.push(a[b].listener);
        return c
    }, d.getListenersAsObject = function(a) {
        var b,
            c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c
    }, d.addListener = function(a, c) {
        var d,
            e = this.getListenersAsObject(a),
            f = "object" == typeof c;
        for (d in e)
            e.hasOwnProperty(d) && b(e[d], c) === -1 && e[d].push(f ? c : {
                listener: c,
                once: !1
            });
        return this
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        })
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this
    }, d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1)
            this.defineEvent(a[b]);
        return this
    }, d.removeListener = function(a, c) {
        var d,
            e,
            f = this.getListenersAsObject(a);
        for (e in f)
            f.hasOwnProperty(e) && (d = b(f[e], c), d !== -1 && f[e].splice(d, 1));
        return this
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b)
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b)
    }, d.manipulateListeners = function(a, b, c) {
        var d,
            e,
            f = a ? this.removeListener : this.addListener,
            g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp)
            for (d = c.length; d--;)
                f.call(this, b, c[d]);
        else
            for (d in b)
                b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this
    }, d.removeEvent = function(a) {
        var b,
            c = typeof a,
            d = this._getEvents();
        if ("string" === c)
            delete d[a];
        else if ("object" === c)
            for (b in d)
                d.hasOwnProperty(b) && a.test(b) && delete d[b];
        else
            delete this._events;
        return this
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c,
            d,
            e,
            f,
            g = this.getListenersAsObject(a);
        for (e in g)
            if (g.hasOwnProperty(e))
                for (d = g[e].length; d--;)
                    c = g[e][d], c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b)
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this
    }, d._getOnceReturnValue = function() {
        return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue
    }, d._getEvents = function() {
        return this._events || (this._events = {})
    }, a.noConflict = function() {
        return e.EventEmitter = f, a
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a
    }) : "object" == typeof module && module.exports ? module.exports = a : this.EventEmitter = a
}.call(this), function(a) {
    function b(b) {
        var c = a.event;
        return c.target = c.target || c.srcElement || b, c
    }
    var c = document.documentElement,
        d = function() {};
    c.addEventListener ? d = function(a, b, c) {
        a.addEventListener(b, c, !1)
    } : c.attachEvent && (d = function(a, c, d) {
        a[c + d] = d.handleEvent ? function() {
            var c = b(a);
            d.handleEvent.call(d, c)
        } : function() {
            var c = b(a);
            d.call(a, c)
        }, a.attachEvent("on" + c, a[c + d])
    });
    var e = function() {};
    c.removeEventListener ? e = function(a, b, c) {
        a.removeEventListener(b, c, !1)
    } : c.detachEvent && (e = function(a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
            delete a[b + c]
        } catch (d) {
            a[b + c] = void 0
        }
    });
    var f = {
        bind: d,
        unbind: e
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", f) : a.eventie = f
}(this), function(a, b) {
    "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(c, d) {
        return b(a, c, d)
    }) : "object" == typeof exports ? module.exports = b(a, require("wolfy87-eventemitter"), require("eventie")) : a.imagesLoaded = b(a, a.EventEmitter, a.eventie)
}(window, function(a, b, c) {
    function d(a, b) {
        for (var c in b)
            a[c] = b[c];
        return a
    }
    function e(a) {
        return "[object Array]" === m.call(a)
    }
    function f(a) {
        var b = [];
        if (e(a))
            b = a;
        else if ("number" == typeof a.length)
            for (var c = 0, d = a.length; c < d; c++)
                b.push(a[c]);
        else
            b.push(a);
        return b
    }
    function g(a, b, c) {
        if (!(this instanceof g))
            return new g(a, b);
        "string" == typeof a && (a = document.querySelectorAll(a)), this.elements = f(a), this.options = d({}, this.options), "function" == typeof b ? c = b : d(this.options, b), c && this.on("always", c), this.getImages(), j && (this.jqDeferred = new j.Deferred);
        var e = this;
        setTimeout(function() {
            e.check()
        })
    }
    function h(a) {
        this.img = a
    }
    function i(a) {
        this.src = a, n[a] = this
    }
    var j = a.jQuery,
        k = a.console,
        l = "undefined" != typeof k,
        m = Object.prototype.toString;
    g.prototype = new b, g.prototype.options = {}, g.prototype.getImages = function() {
        this.images = [];
        for (var a = 0, b = this.elements.length; a < b; a++) {
            var c = this.elements[a];
            "IMG" === c.nodeName && this.addImage(c);
            var d = c.nodeType;
            if (d && (1 === d || 9 === d || 11 === d))
                for (var e = c.querySelectorAll("img"), f = 0, g = e.length; f < g; f++) {
                    var h = e[f];
                    this.addImage(h)
                }
        }
    }, g.prototype.addImage = function(a) {
        var b = new h(a);
        this.images.push(b)
    }, g.prototype.check = function() {
        function a(a, e) {
            return b.options.debug && l && k.log("confirm", a, e), b.progress(a), c++, c === d && b.complete(), !0
        }
        var b = this,
            c = 0,
            d = this.images.length;
        if (this.hasAnyBroken = !1, !d)
            return void this.complete();
        for (var e = 0; e < d; e++) {
            var f = this.images[e];
            f.on("confirm", a), f.check()
        }
    }, g.prototype.progress = function(a) {
        this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded;
        var b = this;
        setTimeout(function() {
            b.emit("progress", b, a), b.jqDeferred && b.jqDeferred.notify && b.jqDeferred.notify(b, a)
        })
    }, g.prototype.complete = function() {
        var a = this.hasAnyBroken ? "fail" : "done";
        this.isComplete = !0;
        var b = this;
        setTimeout(function() {
            if (b.emit(a, b), b.emit("always", b), b.jqDeferred) {
                var c = b.hasAnyBroken ? "reject" : "resolve";
                b.jqDeferred[c](b)
            }
        })
    }, j && (j.fn.imagesLoaded = function(a, b) {
        var c = new g(this, a, b);
        return c.jqDeferred.promise(j(this))
    }), h.prototype = new b, h.prototype.check = function() {
        var a = n[this.img.src] || new i(this.img.src);
        if (a.isConfirmed)
            return void this.confirm(a.isLoaded, "cached was confirmed");
        if (this.img.complete && void 0 !== this.img.naturalWidth)
            return void this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
        var b = this;
        a.on("confirm", function(a, c) {
            return b.confirm(a.isLoaded, c), !0
        }), a.check()
    }, h.prototype.confirm = function(a, b) {
        this.isLoaded = a, this.emit("confirm", this, b)
    };
    var n = {};
    return i.prototype = new b, i.prototype.check = function() {
        if (!this.isChecked) {
            var a = new Image;
            c.bind(a, "load", this), c.bind(a, "error", this), a.src = this.src, this.isChecked = !0
        }
    }, i.prototype.handleEvent = function(a) {
        var b = "on" + a.type;
        this[b] && this[b](a)
    }, i.prototype.onload = function(a) {
        this.confirm(!0, "onload"), this.unbindProxyEvents(a)
    }, i.prototype.onerror = function(a) {
        this.confirm(!1, "onerror"), this.unbindProxyEvents(a)
    }, i.prototype.confirm = function(a, b) {
        this.isConfirmed = !0, this.isLoaded = a, this.emit("confirm", this, b)
    }, i.prototype.unbindProxyEvents = function(a) {
        c.unbind(a.target, "load", this), c.unbind(a.target, "error", this)
    }, g
}), function(a) {
    function b(a, b) {
        return function(c) {
            return i(a.call(this, c), b)
        }
    }
    function c(a) {
        return function(b) {
            return this.lang().ordinal(a.call(this, b))
        }
    }
    function d() {}
    function e(a) {
        g(this, a)
    }
    function f(a) {
        var b = this._data = {},
            c = a.years || a.year || a.y || 0,
            d = a.months || a.month || a.M || 0,
            e = a.weeks || a.week || a.w || 0,
            f = a.days || a.day || a.d || 0,
            g = a.hours || a.hour || a.h || 0,
            i = a.minutes || a.minute || a.m || 0,
            j = a.seconds || a.second || a.s || 0,
            k = a.milliseconds || a.millisecond || a.ms || 0;
        this._milliseconds = k + 1e3 * j + 6e4 * i + 36e5 * g, this._days = f + 7 * e, this._months = d + 12 * c, b.milliseconds = k % 1e3, j += h(k / 1e3), b.seconds = j % 60, i += h(j / 60), b.minutes = i % 60, g += h(i / 60), b.hours = g % 24, f += h(g / 24), f += 7 * e, b.days = f % 30, d += h(f / 30), b.months = d % 12, c += h(d / 12), b.years = c
    }
    function g(a, b) {
        for (var c in b)
            b.hasOwnProperty(c) && (a[c] = b[c]);
        return a
    }
    function h(a) {
        return a < 0 ? Math.ceil(a) : Math.floor(a)
    }
    function i(a, b) {
        for (var c = a + ""; c.length < b;)
            c = "0" + c;
        return c
    }
    function j(a, b, c) {
        var d,
            e = b._milliseconds,
            f = b._days,
            g = b._months;
        e && a._d.setTime(+a + e * c), f && a.date(a.date() + f * c), g && (d = a.date(), a.date(1).month(a.month() + g * c).date(Math.min(d, a.daysInMonth())))
    }
    function k(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }
    function l(a, b) {
        var c,
            d = Math.min(a.length, b.length),
            e = Math.abs(a.length - b.length),
            f = 0;
        for (c = 0; c < d; c++)
            ~~a[c] !== ~~b[c] && f++;
        return f + e
    }
    function m(a, b) {
        return b.abbr = a, J[a] || (J[a] = new d), J[a].set(b), J[a]
    }
    function n(a) {
        return a ? (!J[a] && K && require("./lang/" + a), J[a]) : F.fn._lang
    }
    function o(a) {
        return a.match(/\[.*\]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }
    function p(a) {
        var b,
            c,
            d = a.match(M);
        for (b = 0, c = d.length; b < c; b++)
            ea[d[b]] ? d[b] = ea[d[b]] : d[b] = o(d[b]);
        return function(e) {
            var f = "";
            for (b = 0; b < c; b++)
                f += "function" == typeof d[b].call ? d[b].call(e, a) : d[b];
            return f
        }
    }
    function q(a, b) {
        function c(b) {
            return a.lang().longDateFormat(b) || b
        }
        for (var d = 5; d-- && N.test(b);)
            b = b.replace(N, c);
        return ba[b] || (ba[b] = p(b)), ba[b](a)
    }
    function r(a) {
        switch (a) {
        case "DDDD":
            return Q;
        case "YYYY":
            return R;
        case "YYYYY":
            return S;
        case "S":
        case "SS":
        case "SSS":
        case "DDD":
            return P;
        case "MMM":
        case "MMMM":
        case "dd":
        case "ddd":
        case "dddd":
        case "a":
        case "A":
            return T;
        case "X":
            return W;
        case "Z":
        case "ZZ":
            return U;
        case "T":
            return V;
        case "MM":
        case "DD":
        case "YY":
        case "HH":
        case "hh":
        case "mm":
        case "ss":
        case "M":
        case "D":
        case "d":
        case "H":
        case "h":
        case "m":
        case "s":
            return O;
        default:
            return new RegExp(a.replace("\\", ""))
        }
    }
    function s(a, b, c) {
        var d,
            e = c._a;
        switch (a) {
        case "M":
        case "MM":
            e[1] = null == b ? 0 : ~~b - 1;
            break;
        case "MMM":
        case "MMMM":
            d = n(c._l).monthsParse(b), null != d ? e[1] = d : c._isValid = !1;
            break;
        case "D":
        case "DD":
        case "DDD":
        case "DDDD":
            null != b && (e[2] = ~~b);
            break;
        case "YY":
            e[0] = ~~b + (~~b > 68 ? 1900 : 2e3);
            break;
        case "YYYY":
        case "YYYYY":
            e[0] = ~~b;
            break;
        case "a":
        case "A":
            c._isPm = "pm" === (b + "").toLowerCase();
            break;
        case "H":
        case "HH":
        case "h":
        case "hh":
            e[3] = ~~b;
            break;
        case "m":
        case "mm":
            e[4] = ~~b;
            break;
        case "s":
        case "ss":
            e[5] = ~~b;
            break;
        case "S":
        case "SS":
        case "SSS":
            e[6] = ~~(1e3 * ("0." + b));
            break;
        case "X":
            c._d = new Date(1e3 * parseFloat(b));
            break;
        case "Z":
        case "ZZ":
            c._useUTC = !0, d = (b + "").match($), d && d[1] && (c._tzh = ~~d[1]), d && d[2] && (c._tzm = ~~d[2]), d && "+" === d[0] && (c._tzh = -c._tzh, c._tzm = -c._tzm)
        }
        null == b && (c._isValid = !1)
    }
    function t(a) {
        var b,
            c,
            d = [];
        if (!a._d) {
            for (b = 0; b < 7; b++)
                a._a[b] = d[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b];
            d[3] += a._tzh || 0, d[4] += a._tzm || 0, c = new Date(0), a._useUTC ? (c.setUTCFullYear(d[0], d[1], d[2]), c.setUTCHours(d[3], d[4], d[5], d[6])) : (c.setFullYear(d[0], d[1], d[2]), c.setHours(d[3], d[4], d[5], d[6])), a._d = c
        }
    }
    function u(a) {
        var b,
            c,
            d = a._f.match(M),
            e = a._i;
        for (a._a = [], b = 0; b < d.length; b++)
            c = (r(d[b]).exec(e) || [])[0], c && (e = e.slice(e.indexOf(c) + c.length)), ea[d[b]] && s(d[b], c, a);
        a._isPm && a._a[3] < 12 && (a._a[3] += 12), a._isPm === !1 && 12 === a._a[3] && (a._a[3] = 0), t(a)
    }
    function v(a) {
        for (var b, c, d, f, h = 99; a._f.length;) {
            if (b = g({}, a), b._f = a._f.pop(), u(b), c = new e(b), c.isValid()) {
                d = c;
                break
            }
            f = l(b._a, c.toArray()), f < h && (h = f, d = c)
        }
        g(a, d)
    }
    function w(a) {
        var b,
            c = a._i;
        if (X.exec(c)) {
            for (a._f = "YYYY-MM-DDT", b = 0; b < 4; b++)
                if (Z[b][1].exec(c)) {
                    a._f += Z[b][0];
                    break
                }
            U.exec(c) && (a._f += " Z"), u(a)
        } else
            a._d = new Date(c)
    }
    function x(b) {
        var c = b._i,
            d = L.exec(c);
        c === a ? b._d = new Date : d ? b._d = new Date((+d[1])) : "string" == typeof c ? w(b) : k(c) ? (b._a = c.slice(0), t(b)) : b._d = c instanceof Date ? new Date((+c)) : new Date(c)
    }
    function y(a, b, c, d, e) {
        return e.relativeTime(b || 1, !!c, a, d)
    }
    function z(a, b, c) {
        var d = I(Math.abs(a) / 1e3),
            e = I(d / 60),
            f = I(e / 60),
            g = I(f / 24),
            h = I(g / 365),
            i = d < 45 && ["s", d] || 1 === e && ["m"] || e < 45 && ["mm", e] || 1 === f && ["h"] || f < 22 && ["hh", f] || 1 === g && ["d"] || g <= 25 && ["dd", g] || g <= 45 && ["M"] || g < 345 && ["MM", I(g / 30)] || 1 === h && ["y"] || ["yy", h];
        return i[2] = b, i[3] = a > 0, i[4] = c, y.apply({}, i)
    }
    function A(a, b, c) {
        var d = c - b,
            e = c - a.day();
        return e > d && (e -= 7), e < d - 7 && (e += 7), Math.ceil(F(a).add("d", e).dayOfYear() / 7)
    }
    function B(a) {
        var b = a._i,
            c = a._f;
        return null === b || "" === b ? null : ("string" == typeof b && (a._i = b = n().preparse(b)), F.isMoment(b) ? (a = g({}, b), a._d = new Date((+b._d))) : c ? k(c) ? v(a) : u(a) : x(a), new e(a))
    }
    function C(a, b) {
        F.fn[a] = F.fn[a + "s"] = function(a) {
            var c = this._isUTC ? "UTC" : "";
            return null != a ? (this._d["set" + c + b](a), this) : this._d["get" + c + b]()
        }
    }
    function D(a) {
        F.duration.fn[a] = function() {
            return this._data[a]
        }
    }
    function E(a, b) {
        F.duration.fn["as" + a] = function() {
            return +this / b
        }
    }
    for (var F, G, H = "2.0.0", I = Math.round, J = {}, K = "undefined" != typeof module && module.exports, L = /^\/?Date\((\-?\d+)/i, M = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, N = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, O = /\d\d?/, P = /\d{1,3}/, Q = /\d{3}/, R = /\d{1,4}/, S = /[+\-]?\d{1,6}/, T = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, U = /Z|[\+\-]\d\d:?\d\d/i, V = /T/i, W = /[\+\-]?\d+(\.\d{1,3})?/, X = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, Y = "YYYY-MM-DDTHH:mm:ssZ", Z = [["HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], $ = /([\+\-]|\d\d)/gi, _ = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"), aa = {
            Milliseconds: 1,
            Seconds: 1e3,
            Minutes: 6e4,
            Hours: 36e5,
            Days: 864e5,
            Months: 2592e6,
            Years: 31536e6
        }, ba = {}, ca = "DDD w W M D d".split(" "), da = "M D H h m s w W".split(" "), ea = {
            M: function() {
                return this.month() + 1
            },
            MMM: function(a) {
                return this.lang().monthsShort(this, a)
            },
            MMMM: function(a) {
                return this.lang().months(this, a)
            },
            D: function() {
                return this.date()
            },
            DDD: function() {
                return this.dayOfYear()
            },
            d: function() {
                return this.day()
            },
            dd: function(a) {
                return this.lang().weekdaysMin(this, a)
            },
            ddd: function(a) {
                return this.lang().weekdaysShort(this, a)
            },
            dddd: function(a) {
                return this.lang().weekdays(this, a)
            },
            w: function() {
                return this.week()
            },
            W: function() {
                return this.isoWeek()
            },
            YY: function() {
                return i(this.year() % 100, 2)
            },
            YYYY: function() {
                return i(this.year(), 4)
            },
            YYYYY: function() {
                return i(this.year(), 5)
            },
            a: function() {
                return this.lang().meridiem(this.hours(), this.minutes(), !0)
            },
            A: function() {
                return this.lang().meridiem(this.hours(), this.minutes(), !1)
            },
            H: function() {
                return this.hours()
            },
            h: function() {
                return this.hours() % 12 || 12
            },
            m: function() {
                return this.minutes()
            },
            s: function() {
                return this.seconds()
            },
            S: function() {
                return ~~(this.milliseconds() / 100)
            },
            SS: function() {
                return i(~~(this.milliseconds() / 10), 2)
            },
            SSS: function() {
                return i(this.milliseconds(), 3)
            },
            Z: function() {
                var a = -this.zone(),
                    b = "+";
                return a < 0 && (a = -a, b = "-"), b + i(~~(a / 60), 2) + ":" + i(~~a % 60, 2)
            },
            ZZ: function() {
                var a = -this.zone(),
                    b = "+";
                return a < 0 && (a = -a, b = "-"), b + i(~~(10 * a / 6), 4)
            },
            X: function() {
                return this.unix()
            }
        }; ca.length;)
        G = ca.pop(), ea[G + "o"] = c(ea[G]);
    for (; da.length;)
        G = da.pop(), ea[G + G] = b(ea[G], 2);
    for (ea.DDDD = b(ea.DDD, 3), d.prototype = {
        set: function(a) {
            var b,
                c;
            for (c in a)
                b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function(a) {
            return this._months[a.month()]
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function(a) {
            return this._monthsShort[a.month()]
        },
        monthsParse: function(a) {
            var b,
                c,
                d;
            for (this._monthsParse || (this._monthsParse = []), b = 0; b < 12; b++)
                if (this._monthsParse[b] || (c = F([2e3, b]), d = "^" + this.months(c, "") + "|^" + this.monthsShort(c, ""), this._monthsParse[b] = new RegExp(d.replace(".", ""), "i")), this._monthsParse[b].test(a))
                    return b
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function(a) {
            return this._weekdays[a.day()]
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function(a) {
            return this._weekdaysShort[a.day()]
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function(a) {
            return this._weekdaysMin[a.day()]
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        longDateFormat: function(a) {
            var b = this._longDateFormat[a];
            return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(a) {
                return a.slice(1)
            }), this._longDateFormat[a] = b), b
        },
        meridiem: function(a, b, c) {
            return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(a, b) {
            var c = this._calendar[a];
            return "function" == typeof c ? c.apply(b) : c
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(a, b, c, d) {
            var e = this._relativeTime[c];
            return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
        },
        pastFuture: function(a, b) {
            var c = this._relativeTime[a > 0 ? "future" : "past"];
            return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
        },
        ordinal: function(a) {
            return this._ordinal.replace("%d", a)
        },
        _ordinal: "%d",
        preparse: function(a) {
            return a
        },
        postformat: function(a) {
            return a
        },
        week: function(a) {
            return A(a, this._week.dow, this._week.doy)
        },
        _week: {
            dow: 0,
            doy: 6
        }
    }, F = function(a, b, c) {
        return B({
            _i: a,
            _f: b,
            _l: c,
            _isUTC: !1
        })
    }, F.utc = function(a, b, c) {
        return B({
            _useUTC: !0,
            _isUTC: !0,
            _l: c,
            _i: a,
            _f: b
        })
    }, F.unix = function(a) {
        return F(1e3 * a)
    }, F.duration = function(a, b) {
        var c,
            d = F.isDuration(a),
            e = "number" == typeof a,
            g = d ? a._data : e ? {} : a;
        return e && (b ? g[b] = a : g.milliseconds = a), c = new f(g), d && a.hasOwnProperty("_lang") && (c._lang = a._lang), c
    }, F.version = H, F.defaultFormat = Y, F.lang = function(a, b) {
        return a ? (b ? m(a, b) : J[a] || n(a), void (F.duration.fn._lang = F.fn._lang = n(a))) : F.fn._lang._abbr
    }, F.langData = function(a) {
        return a && a._lang && a._lang._abbr && (a = a._lang._abbr), n(a)
    }, F.isMoment = function(a) {
        return a instanceof e
    }, F.isDuration = function(a) {
        return a instanceof f
    }, F.fn = e.prototype = {
        clone: function() {
            return F(this)
        },
        valueOf: function() {
            return +this._d
        },
        unix: function() {
            return Math.floor(+this._d / 1e3)
        },
        toString: function() {
            return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        },
        toDate: function() {
            return this._d
        },
        toJSON: function() {
            return F.utc(this).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        },
        toArray: function() {
            var a = this;
            return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
        },
        isValid: function() {
            return null == this._isValid && (this._a ? this._isValid = !l(this._a, (this._isUTC ? F.utc(this._a) : F(this._a)).toArray()) : this._isValid = !isNaN(this._d.getTime())), !!this._isValid
        },
        utc: function() {
            return this._isUTC = !0, this
        },
        local: function() {
            return this._isUTC = !1, this
        },
        format: function(a) {
            var b = q(this, a || F.defaultFormat);
            return this.lang().postformat(b)
        },
        add: function(a, b) {
            var c;
            return c = "string" == typeof a ? F.duration(+b, a) : F.duration(a, b), j(this, c, 1), this
        },
        subtract: function(a, b) {
            var c;
            return c = "string" == typeof a ? F.duration(+b, a) : F.duration(a, b), j(this, c, -1), this
        },
        diff: function(a, b, c) {
            var d,
                e,
                f = this._isUTC ? F(a).utc() : F(a).local(),
                g = 6e4 * (this.zone() - f.zone());
            return b && (b = b.replace(/s$/, "")), "year" === b || "month" === b ? (d = 432e5 * (this.daysInMonth() + f.daysInMonth()), e = 12 * (this.year() - f.year()) + (this.month() - f.month()), e += (this - F(this).startOf("month") - (f - F(f).startOf("month"))) / d, "year" === b && (e /= 12)) : (d = this - f - g, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? d / 864e5 : "week" === b ? d / 6048e5 : d), c ? e : h(e)
        },
        from: function(a, b) {
            return F.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)
        },
        fromNow: function(a) {
            return this.from(F(), a)
        },
        calendar: function() {
            var a = this.diff(F().startOf("day"), "days", !0),
                b = a < -6 ? "sameElse" : a < -1 ? "lastWeek" : a < 0 ? "lastDay" : a < 1 ? "sameDay" : a < 2 ? "nextDay" : a < 7 ? "nextWeek" : "sameElse";
            return this.format(this.lang().calendar(b, this))
        },
        isLeapYear: function() {
            var a = this.year();
            return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
        },
        isDST: function() {
            return this.zone() < F([this.year()]).zone() || this.zone() < F([this.year(), 5]).zone()
        },
        day: function(a) {
            var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null == a ? b : this.add({
                d: a - b
            })
        },
        startOf: function(a) {
            switch (a = a.replace(/s$/, "")) {
            case "year":
                this.month(0);
            case "month":
                this.date(1);
            case "week":
            case "day":
                this.hours(0);
            case "hour":
                this.minutes(0);
            case "minute":
                this.seconds(0);
            case "second":
                this.milliseconds(0)
            }
            return "week" === a && this.day(0), this
        },
        endOf: function(a) {
            return this.startOf(a).add(a.replace(/s?$/, "s"), 1).subtract("ms", 1)
        },
        isAfter: function(a, b) {
            return b = "undefined" != typeof b ? b : "millisecond", +this.clone().startOf(b) > +F(a).startOf(b)
        },
        isBefore: function(a, b) {
            return b = "undefined" != typeof b ? b : "millisecond", +this.clone().startOf(b) < +F(a).startOf(b)
        },
        isSame: function(a, b) {
            return b = "undefined" != typeof b ? b : "millisecond", +this.clone().startOf(b) === +F(a).startOf(b)
        },
        zone: function() {
            return this._isUTC ? 0 : this._d.getTimezoneOffset()
        },
        daysInMonth: function() {
            return F.utc([this.year(), this.month() + 1, 0]).date()
        },
        dayOfYear: function(a) {
            var b = I((F(this).startOf("day") - F(this).startOf("year")) / 864e5) + 1;
            return null == a ? b : this.add("d", a - b)
        },
        isoWeek: function(a) {
            var b = A(this, 1, 4);
            return null == a ? b : this.add("d", 7 * (a - b))
        },
        week: function(a) {
            var b = this.lang().week(this);
            return null == a ? b : this.add("d", 7 * (a - b))
        },
        lang: function(b) {
            return b === a ? this._lang : (this._lang = n(b), this)
        }
    }, G = 0; G < _.length; G++)
        C(_[G].toLowerCase().replace(/s$/, ""), _[G]);
    C("year", "FullYear"), F.fn.days = F.fn.day, F.fn.weeks = F.fn.week, F.fn.isoWeeks = F.fn.isoWeek, F.duration.fn = f.prototype = {
        weeks: function() {
            return h(this.days() / 7)
        },
        valueOf: function() {
            return this._milliseconds + 864e5 * this._days + 2592e6 * this._months
        },
        humanize: function(a) {
            var b = +this,
                c = z(b, !a, this.lang());
            return a && (c = this.lang().pastFuture(b, c)), this.lang().postformat(c)
        },
        lang: F.fn.lang
    };
    for (G in aa)
        aa.hasOwnProperty(G) && (E(G, aa[G]), D(G.toLowerCase()));
    E("Weeks", 6048e5), F.lang("en", {
        ordinal: function(a) {
            var b = a % 10,
                c = 1 === ~~(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }), K && (module.exports = F), "undefined" == typeof ender && (this.moment = F), "function" == typeof define && define.amd && define("moment", [], function() {
        return F
    })
}.call(this), function(a) {
    "use strict";
    function b(a) {
        this.el = a, this.overlay = this.el.querySelector(".nl-overlay"), this.fields = [], this.fldOpen = -1, this._init()
    }
    function c(a, b, c, d) {
        this.form = a, this.elOriginal = b, this.pos = d, this.type = c, this._create(), this._initEvents()
    }
    var d = a.document;
    String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    }), b.prototype = {
        _init: function() {
            var a = this;
            Array.prototype.slice.call(this.el.querySelectorAll("select")).forEach(function(b, d) {
                a.fldOpen++, a.fields.push(new c(a, b, "dropdown", a.fldOpen))
            }), Array.prototype.slice.call(this.el.querySelectorAll("input")).forEach(function(b, d) {
                a.fldOpen++, a.fields.push(new c(a, b, "input", a.fldOpen))
            }), this.overlay.addEventListener("click", function(b) {
                a._closeFlds()
            }), this.overlay.addEventListener("touchstart", function(b) {
                a._closeFlds()
            })
        },
        _closeFlds: function() {
            this.fldOpen !== -1 && this.fields[this.fldOpen].close()
        }
    }, c.prototype = {
        _create: function() {
            "dropdown" === this.type ? this._createDropDown() : "input" === this.type && this._createInput()
        },
        _createDropDown: function() {
            var a = this;
            this.fld = d.createElement("div"), this.fld.className = "nl-field nl-dd", this.toggle = d.createElement("a"), this.toggle.innerHTML = this.elOriginal.options[this.elOriginal.selectedIndex].innerHTML, this.toggle.className = "nl-field-toggle", this.optionsList = d.createElement("ul");
            var b = "";
            Array.prototype.slice.call(this.elOriginal.querySelectorAll("option")).forEach(function(c, d) {
                b += a.elOriginal.selectedIndex === d ? '<li class="nl-dd-checked">' + c.innerHTML + "</li>" : "<li>" + c.innerHTML + "</li>", a.elOriginal.selectedIndex === d && (a.selectedIdx = d)
            }), this.optionsList.innerHTML = b, this.fld.appendChild(this.toggle), this.fld.appendChild(this.optionsList), this.elOriginal.parentNode.insertBefore(this.fld, this.elOriginal), this.elOriginal.style.display = "none"
        },
        _createInput: function() {
            this.fld = d.createElement("div"), this.fld.className = "nl-field nl-ti-text", this.toggle = d.createElement("a"), this.toggle.innerHTML = this.elOriginal.getAttribute("placeholder"), this.toggle.className = "nl-field-toggle", this.optionsList = d.createElement("ul"), this.getinput = d.createElement("input"), this.getinput.setAttribute("type", "text"), this.getinput.setAttribute("placeholder", this.elOriginal.getAttribute("placeholder")), this.getinputWrapper = d.createElement("li"), this.getinputWrapper.className = "nl-ti-input", this.inputsubmit = d.createElement("button"), this.inputsubmit.className = "nl-field-go", this.inputsubmit.innerHTML = "Go", this.getinputWrapper.appendChild(this.getinput), this.getinputWrapper.appendChild(this.inputsubmit), this.example = d.createElement("li"), this.example.className = "nl-ti-example", this.example.innerHTML = this.elOriginal.getAttribute("data-subline"), this.optionsList.appendChild(this.getinputWrapper), this.optionsList.appendChild(this.example), this.fld.appendChild(this.toggle), this.fld.appendChild(this.optionsList), this.elOriginal.parentNode.insertBefore(this.fld, this.elOriginal), this.elOriginal.style.display = "none"
        },
        _initEvents: function() {
            var a = this;
            if (this.toggle.addEventListener("click", function(b) {
                b.preventDefault(), b.stopPropagation(), a._open()
            }), this.toggle.addEventListener("touchstart", function(b) {
                b.preventDefault(), b.stopPropagation(), a._open()
            }), "dropdown" === this.type) {
                var b = Array.prototype.slice.call(this.optionsList.querySelectorAll("li"));
                b.forEach(function(c, d) {
                    c.addEventListener("click", function(d) {
                        d.preventDefault(), a.close(c, b.indexOf(c))
                    }), c.addEventListener("touchstart", function(d) {
                        d.preventDefault(), a.close(c, b.indexOf(c))
                    })
                })
            } else
                "input" === this.type && (this.getinput.addEventListener("keydown", function(b) {
                    13 == b.keyCode && a.close()
                }), this.inputsubmit.addEventListener("click", function(b) {
                    b.preventDefault(), a.close()
                }), this.inputsubmit.addEventListener("touchstart", function(b) {
                    b.preventDefault(), a.close()
                }))
        },
        _open: function() {
            if (this.open)
                return !1;
            this.open = !0, this.form.fldOpen = this.pos;
            var a = this;
            this.fld.className += " nl-field-open", this.toggle.parentElement.parentElement.className += " nl-field-open", "undefined" != typeof a.getinput && setTimeout(function() {
                a.getinput.focus()
            }, 100)
        },
        close: function(a, b) {
            if (!this.open)
                return !1;
            if (this.open = !1, this.form.fldOpen = -1, this.fld.className = this.fld.className.replace(/\b nl-field-open\b/, ""), this.toggle.parentElement.parentElement.className = this.toggle.parentElement.parentElement.className.replace(/\b nl-field-open\b/, ""), "dropdown" === this.type) {
                if (a) {
                    var c = this.optionsList.children[this.selectedIdx];
                    c.className = "", a.className = "nl-dd-checked", this.toggle.innerHTML = a.innerHTML, this.selectedIdx = b, this.elOriginal.value = this.elOriginal.children[this.selectedIdx].value
                }
            } else
                "input" === this.type && (this.getinput.blur(), this.toggle.innerHTML = "" !== this.getinput.value.trim() ? this.getinput.value : this.getinput.getAttribute("placeholder"), this.elOriginal.value = this.getinput.value)
        }
    }, a.NLForm = b
}(window), function(a, b, c) {
    "use strict";
    function d(a, b) {
        this.element = a, this.layers = a.getElementsByClassName("parallax__layer"), console.log(this.layers, a.getElementsByClassName("layer"));
        var c = {
            calibrateX: this.data(this.element, "calibrate-x"),
            calibrateY: this.data(this.element, "calibrate-y"),
            invertX: this.data(this.element, "invert-x"),
            invertY: this.data(this.element, "invert-y"),
            limitX: this.data(this.element, "limit-x"),
            limitY: this.data(this.element, "limit-y"),
            scalarX: this.data(this.element, "scalar-x"),
            scalarY: this.data(this.element, "scalar-y"),
            frictionX: this.data(this.element, "friction-x"),
            frictionY: this.data(this.element, "friction-y"),
            originX: this.data(this.element, "origin-x"),
            originY: this.data(this.element, "origin-y")
        };
        for (var d in c)
            null === c[d] && delete c[d];
        this.extend(this, g, b, c), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depths = [], this.raf = null, this.bounds = null, this.ex = 0, this.ey = 0, this.ew = 0, this.eh = 0, this.ecx = 0, this.ecy = 0, this.erx = 0, this.ery = 0, this.cx = 0, this.cy = 0, this.ix = 0, this.iy = 0, this.mx = 0, this.my = 0, this.vx = 0, this.vy = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.initialise()
    }
    var e = "Parallax",
        f = 30,
        g = {
            relativeInput: !1,
            clipRelativeInput: !1,
            calibrationThreshold: 100,
            calibrationDelay: 500,
            supportDelay: 500,
            calibrateX: !1,
            calibrateY: !0,
            invertX: !0,
            invertY: !0,
            limitX: !1,
            limitY: !1,
            scalarX: 10,
            scalarY: 10,
            frictionX: .1,
            frictionY: .1,
            originX: .5,
            originY: .5
        };
    d.prototype.extend = function() {
        if (arguments.length > 1)
            for (var a = arguments[0], b = 1, c = arguments.length; b < c; b++) {
                var d = arguments[b];
                for (var e in d)
                    a[e] = d[e]
            }
    }, d.prototype.data = function(a, b) {
        return this.deserialize(a.getAttribute("data-" + b))
    }, d.prototype.deserialize = function(a) {
        return "true" === a || "false" !== a && ("null" === a ? null : !isNaN(parseFloat(a)) && isFinite(a) ? parseFloat(a) : a)
    }, d.prototype.camelCase = function(a) {
        return a.replace(/-+(.)?/g, function(a, b) {
            return b ? b.toUpperCase() : ""
        })
    }, d.prototype.transformSupport = function(d) {
        for (var e = b.createElement("div"), f = !1, g = null, h = !1, i = null, j = null, k = 0, l = this.vendors.length; k < l; k++)
            if (null !== this.vendors[k] ? (i = this.vendors[k][0] + "transform", j = this.vendors[k][1] + "Transform") : (i = "transform", j = "transform"), e.style[j] !== c) {
                f = !0;
                break
            }
        switch (d) {
        case "2D":
            h = f;
            break;
        case "3D":
            if (f) {
                var m = b.body || b.createElement("body"),
                    n = b.documentElement,
                    o = n.style.overflow;
                b.body || (n.style.overflow = "hidden", n.appendChild(m), m.style.overflow = "hidden", m.style.background = ""), m.appendChild(e), e.style[j] = "translate3d(1px,1px,1px)", g = a.getComputedStyle(e).getPropertyValue(i), h = g !== c && g.length > 0 && "none" !== g, n.style.overflow = o, m.removeChild(e)
            }
        }
        return h
    }, d.prototype.ww = null, d.prototype.wh = null, d.prototype.wcx = null, d.prototype.wcy = null, d.prototype.wrx = null, d.prototype.wry = null, d.prototype.portrait = null, d.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), d.prototype.vendors = [null, ["-webkit-", "webkit"], ["-moz-", "Moz"], ["-o-", "O"], ["-ms-", "ms"]], d.prototype.motionSupport = !!a.DeviceMotionEvent, d.prototype.orientationSupport = !!a.DeviceOrientationEvent, d.prototype.orientationStatus = 0, d.prototype.transform2DSupport = d.prototype.transformSupport("2D"), d.prototype.transform3DSupport = d.prototype.transformSupport("3D"), d.prototype.propertyCache = {}, d.prototype.initialise = function() {
        this.transform3DSupport && this.accelerate(this.element);
        var b = a.getComputedStyle(this.element);
        "static" === b.getPropertyValue("position") && (this.element.style.position = "relative"), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay)
    }, d.prototype.updateLayers = function() {
        this.layers = this.element.getElementsByClassName("parallax__layer"), console.log(this.layers, this.element.getElementsByClassName("layer")), this.depths = [];
        for (var a = 0, b = this.layers.length; a < b; a++) {
            var c = this.layers[a];
            this.transform3DSupport && this.accelerate(c), c.style.position = a ? "absolute" : "relative", c.style.display = "block", c.style.left = 0, c.style.top = 0, this.depths.push(this.data(c, "depth") || 0)
        }
    }, d.prototype.updateDimensions = function() {
        this.ww = a.innerWidth, this.wh = a.innerHeight, this.wcx = this.ww * this.originX, this.wcy = this.wh * this.originY, this.wrx = Math.max(this.wcx, this.ww - this.wcx), this.wry = Math.max(this.wcy, this.wh - this.wcy)
    }, d.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect(), this.ex = this.bounds.left, this.ey = this.bounds.top, this.ew = this.bounds.width, this.eh = this.bounds.height, this.ecx = this.ew * this.originX, this.ecy = this.eh * this.originY, this.erx = Math.max(this.ecx, this.ew - this.ecx), this.ery = Math.max(this.ecy, this.eh - this.ecy)
    }, d.prototype.queueCalibration = function(a) {
        clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, a)
    }, d.prototype.enable = function() {
        this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, a.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, a.addEventListener("mousemove", this.onMouseMove)), a.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
    }, d.prototype.disable = function() {
        this.enabled && (this.enabled = !1, this.orientationSupport ? a.removeEventListener("deviceorientation", this.onDeviceOrientation) : a.removeEventListener("mousemove", this.onMouseMove), a.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
    }, d.prototype.calibrate = function(a, b) {
        this.calibrateX = a === c ? this.calibrateX : a, this.calibrateY = b === c ? this.calibrateY : b
    }, d.prototype.invert = function(a, b) {
        this.invertX = a === c ? this.invertX : a,
        this.invertY = b === c ? this.invertY : b
    }, d.prototype.friction = function(a, b) {
        this.frictionX = a === c ? this.frictionX : a, this.frictionY = b === c ? this.frictionY : b
    }, d.prototype.scalar = function(a, b) {
        this.scalarX = a === c ? this.scalarX : a, this.scalarY = b === c ? this.scalarY : b
    }, d.prototype.limit = function(a, b) {
        this.limitX = a === c ? this.limitX : a, this.limitY = b === c ? this.limitY : b
    }, d.prototype.origin = function(a, b) {
        this.originX = a === c ? this.originX : a, this.originY = b === c ? this.originY : b
    }, d.prototype.clamp = function(a, b, c) {
        return a = Math.max(a, b), a = Math.min(a, c)
    }, d.prototype.css = function(a, b, d) {
        var e = this.propertyCache[b];
        if (!e)
            for (var f = 0, g = this.vendors.length; f < g; f++)
                if (e = null !== this.vendors[f] ? this.camelCase(this.vendors[f][1] + "-" + b) : b, a.style[e] !== c) {
                    this.propertyCache[b] = e;
                    break
                }
        a.style[e] = d
    }, d.prototype.accelerate = function(a) {
        this.css(a, "transform", "translate3d(0,0,0)"), this.css(a, "transform-style", "preserve-3d"), this.css(a, "backface-visibility", "hidden")
    }, d.prototype.setPosition = function(a, b, c) {
        b += "px", c += "px", this.transform3DSupport ? this.css(a, "transform", "translate3d(" + b + "," + c + ",0)") : this.transform2DSupport ? this.css(a, "transform", "translate(" + b + "," + c + ")") : (a.style.left = b, a.style.top = c)
    }, d.prototype.onOrientationTimer = function(a) {
        this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
    }, d.prototype.onCalibrationTimer = function(a) {
        this.calibrationFlag = !0
    }, d.prototype.onWindowResize = function(a) {
        this.updateDimensions()
    }, d.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var a = this.ix - this.cx,
            b = this.iy - this.cy;
        (Math.abs(a) > this.calibrationThreshold || Math.abs(b) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.mx = this.calibrateX ? b : this.iy, this.my = this.calibrateY ? a : this.ix) : (this.mx = this.calibrateX ? a : this.ix, this.my = this.calibrateY ? b : this.iy), this.mx *= this.ew * (this.scalarX / 100), this.my *= this.eh * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)), this.vx += (this.mx - this.vx) * this.frictionX, this.vy += (this.my - this.vy) * this.frictionY;
        for (var c = 0, d = this.layers.length; c < d; c++) {
            var e = this.layers[c],
                f = this.depths[c],
                g = this.vx * f * (this.invertX ? -1 : 1),
                h = this.vy * f * (this.invertY ? -1 : 1);
            this.setPosition(e, g, h)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }, d.prototype.onDeviceOrientation = function(a) {
        if (!this.desktop && null !== a.beta && null !== a.gamma) {
            this.orientationStatus = 1;
            var b = (a.beta || 0) / f,
                c = (a.gamma || 0) / f,
                d = this.wh > this.ww;
            this.portrait !== d && (this.portrait = d, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.cx = b, this.cy = c), this.ix = b, this.iy = c
        }
    }, d.prototype.onMouseMove = function(a) {
        var b = a.clientX,
            c = a.clientY;
        !this.orientationSupport && this.relativeInput ? (this.clipRelativeInput && (b = Math.max(b, this.ex), b = Math.min(b, this.ex + this.ew), c = Math.max(c, this.ey), c = Math.min(c, this.ey + this.eh)), this.ix = (b - this.ex - this.ecx) / this.erx, this.iy = (c - this.ey - this.ecy) / this.ery) : (this.ix = (b - this.wcx) / this.wrx, this.iy = (c - this.wcy) / this.wry)
    }, a[e] = d
}(window, document), function() {
    for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c)
        window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(b, c) {
        var d = (new Date).getTime(),
            e = Math.max(0, 16 - (d - a)),
            f = window.setTimeout(function() {
                b(d + e)
            }, e);
        return a = d + e, f
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
        clearTimeout(a)
    })
}(), function(a) {
    "use strict";
    function b(a, b) {
        for (var c in b)
            b.hasOwnProperty(c) && (a[c] = b[c]);
        return a
    }
    function c(a) {
        this.el = a, this.paths = [].slice.call(this.el.querySelectorAll("path")), this.pathsArr = new Array, this.lengthsArr = new Array, this._init()
    }
    function d(a, c) {
        this.el = a, this.options = b({}, this.options), b(this.options, c), this._init()
    }
    var e = {
        transitions: Modernizr.csstransitions
    };
    c.prototype._init = function() {
        var a = this;
        this.paths.forEach(function(b, c) {
            a.pathsArr[c] = b, b.style.strokeDasharray = a.lengthsArr[c] = b.getTotalLength()
        }), this.draw(0)
    }, c.prototype.draw = function(a) {
        for (var b = 0, c = this.pathsArr.length; b < c; ++b)
            this.pathsArr[b].style.strokeDashoffset = this.lengthsArr[b] * (1 - a)
    }, d.prototype.options = {
        statusTime: 1500
    }, d.prototype._init = function() {
        this.button = this.el.querySelector("button"), this.progressEl = new c(this.el.querySelector("svg.progress-circle")), this.successEl = new c(this.el.querySelector("svg.checkmark")), this.errorEl = new c(this.el.querySelector("svg.cross")), this._initEvents(), this._enable()
    }, d.prototype._initEvents = function() {
        var a = this;
        this.button.addEventListener("click", function() {
            a._submit()
        })
    }, d.prototype._submit = function() {
        classie.addClass(this.el, "loading");
        var a = this,
            b = function(c) {
                if (e.transitions) {
                    if ("width" !== c.propertyName)
                        return !1;
                    this.removeEventListener(transEndEventName, b)
                }
                a.button.setAttribute("disabled", ""), "function" == typeof a.options.callback ? a.options.callback(a) : (a.setProgress(1), a.stop())
            };
        e.transitions ? this.button.addEventListener(transEndEventName, b) : b()
    }, d.prototype.stop = function(a) {
        var b = this,
            c = function() {
                if (b.progressEl.draw(0), "number" == typeof a) {
                    var c = a >= 0 ? "success" : "error",
                        d = a >= 0 ? b.successEl : b.errorEl;
                    d.draw(1), classie.addClass(b.el, c), setTimeout(function() {
                        classie.remove(b.el, c), d.draw(0), b._enable()
                    }, b.options.statusTime)
                } else
                    b._enable();
                classie.removeClass(b.el, "loading")
            };
        setTimeout(c, 300)
    }, d.prototype.setProgress = function(a) {
        this.progressEl.draw(a)
    }, d.prototype._enable = function() {
        this.button.removeAttribute("disabled")
    }, a.UIProgressButton = d
}(window), !function(a) {
    function b(a) {
        var b = a.length,
            d = c.type(a);
        return "function" !== d && !c.isWindow(a) && (!(1 !== a.nodeType || !b) || ("array" === d || 0 === b || "number" == typeof b && b > 0 && b - 1 in a))
    }
    if (!a.jQuery) {
        var c = function(a, b) {
            return new c.fn.init(a, b)
        };
        c.isWindow = function(a) {
            return null != a && a == a.window
        }, c.type = function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? e[g.call(a)] || "object" : typeof a
        }, c.isArray = Array.isArray || function(a) {
            return "array" === c.type(a)
        }, c.isPlainObject = function(a) {
            var b;
            if (!a || "object" !== c.type(a) || a.nodeType || c.isWindow(a))
                return !1;
            try {
                if (a.constructor && !f.call(a, "constructor") && !f.call(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (a) {
                return !1
            }
            for (b in a)
                ;
            return void 0 === b || f.call(a, b)
        }, c.each = function(a, c, d) {
            var e,
                f = 0,
                g = a.length,
                h = b(a);
            if (d) {
                if (h)
                    for (; g > f && (e = c.apply(a[f], d), e !== !1); f++)
                        ;
                else
                    for (f in a)
                        if (e = c.apply(a[f], d), e === !1)
                            break
            } else if (h)
                for (; g > f && (e = c.call(a[f], f, a[f]), e !== !1); f++)
                    ;
            else
                for (f in a)
                    if (e = c.call(a[f], f, a[f]), e === !1)
                        break;
            return a
        }, c.data = function(a, b, e) {
            if (void 0 === e) {
                var f = a[c.expando],
                    g = f && d[f];
                if (void 0 === b)
                    return g;
                if (g && b in g)
                    return g[b]
            } else if (void 0 !== b) {
                var f = a[c.expando] || (a[c.expando] = ++c.uuid);
                return d[f] = d[f] || {}, d[f][b] = e, e
            }
        }, c.removeData = function(a, b) {
            var e = a[c.expando],
                f = e && d[e];
            f && c.each(b, function(a, b) {
                delete f[b]
            })
        }, c.extend = function() {
            var a,
                b,
                d,
                e,
                f,
                g,
                h = arguments[0] || {},
                i = 1,
                j = arguments.length,
                k = !1;
            for ("boolean" == typeof h && (k = h, h = arguments[i] || {}, i++), "object" != typeof h && "function" !== c.type(h) && (h = {}), i === j && (h = this, i--); j > i; i++)
                if (null != (f = arguments[i]))
                    for (e in f)
                        a = h[e], d = f[e], h !== d && (k && d && (c.isPlainObject(d) || (b = c.isArray(d))) ? (b ? (b = !1, g = a && c.isArray(a) ? a : []) : g = a && c.isPlainObject(a) ? a : {}, h[e] = c.extend(k, g, d)) : void 0 !== d && (h[e] = d));
            return h
        }, c.queue = function(a, d, e) {
            function f(a, c) {
                var d = c || [];
                return null != a && (b(Object(a)) ? !function(a, b) {
                    for (var c = +b.length, d = 0, e = a.length; c > d;)
                        a[e++] = b[d++];
                    if (c !== c)
                        for (; void 0 !== b[d];)
                            a[e++] = b[d++];
                    return a.length = e, a
                }(d, "string" == typeof a ? [a] : a) : [].push.call(d, a)), d
            }
            if (a) {
                d = (d || "fx") + "queue";
                var g = c.data(a, d);
                return e ? (!g || c.isArray(e) ? g = c.data(a, d, f(e)) : g.push(e), g) : g || []
            }
        }, c.dequeue = function(a, b) {
            c.each(a.nodeType ? [a] : a, function(a, d) {
                b = b || "fx";
                var e = c.queue(d, b),
                    f = e.shift();
                "inprogress" === f && (f = e.shift()), f && ("fx" === b && e.unshift("inprogress"), f.call(d, function() {
                    c.dequeue(d, b)
                }))
            })
        }, c.fn = c.prototype = {
            init: function(a) {
                if (a.nodeType)
                    return this[0] = a, this;
                throw new Error("Not a DOM node.")
            },
            offset: function() {
                var b = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                    top: 0,
                    left: 0
                };
                return {
                    top: b.top + (a.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                    left: b.left + (a.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                }
            },
            position: function() {
                function a() {
                    for (var a = this.offsetParent || document; a && "html" === !a.nodeType.toLowerCase && "static" === a.style.position;)
                        a = a.offsetParent;
                    return a || document
                }
                var b = this[0],
                    a = a.apply(b),
                    d = this.offset(),
                    e = /^(?:body|html)$/i.test(a.nodeName) ? {
                        top: 0,
                        left: 0
                    } : c(a).offset();
                return d.top -= parseFloat(b.style.marginTop) || 0, d.left -= parseFloat(b.style.marginLeft) || 0, a.style && (e.top += parseFloat(a.style.borderTopWidth) || 0, e.left += parseFloat(a.style.borderLeftWidth) || 0), {
                    top: d.top - e.top,
                    left: d.left - e.left
                }
            }
        };
        var d = {};
        c.expando = "velocity" + (new Date).getTime(), c.uuid = 0;
        for (var e = {}, f = e.hasOwnProperty, g = e.toString, h = "Boolean Number String Function Array Date RegExp Object Error".split(" "), i = 0; i < h.length; i++)
            e["[object " + h[i] + "]"] = h[i].toLowerCase();
        c.fn.init.prototype = c.fn, a.Velocity = {
            Utilities: c
        }
    }
}(window), function(a) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a() : "function" == typeof define && define.amd ? define(a) : a()
}(function() {
    return function(a, b, c, d) {
        function e(a) {
            for (var b = -1, c = a ? a.length : 0, d = []; ++b < c;) {
                var e = a[b];
                e && d.push(e)
            }
            return d
        }
        function f(a) {
            return p.isWrapped(a) ? a = [].slice.call(a) : p.isNode(a) && (a = [a]), a
        }
        function g(a) {
            var b = m.data(a, "velocity");
            return null === b ? d : b
        }
        function h(a) {
            return function(b) {
                return Math.round(b * a) * (1 / a)
            }
        }
        function i(a, c, d, e) {
            function f(a, b) {
                return 1 - 3 * b + 3 * a
            }
            function g(a, b) {
                return 3 * b - 6 * a
            }
            function h(a) {
                return 3 * a
            }
            function i(a, b, c) {
                return ((f(b, c) * a + g(b, c)) * a + h(b)) * a
            }
            function j(a, b, c) {
                return 3 * f(b, c) * a * a + 2 * g(b, c) * a + h(b)
            }
            function k(b, c) {
                for (var e = 0; p > e; ++e) {
                    var f = j(c, a, d);
                    if (0 === f)
                        return c;
                    var g = i(c, a, d) - b;
                    c -= g / f
                }
                return c
            }
            function l() {
                for (var b = 0; t > b; ++b)
                    x[b] = i(b * u, a, d)
            }
            function m(b, c, e) {
                var f,
                    g,
                    h = 0;
                do g = c + (e - c) / 2, f = i(g, a, d) - b, f > 0 ? e = g : c = g;
                while (Math.abs(f) > r && ++h < s);
                return g
            }
            function n(b) {
                for (var c = 0, e = 1, f = t - 1; e != f && x[e] <= b; ++e)
                    c += u;
                --e;
                var g = (b - x[e]) / (x[e + 1] - x[e]),
                    h = c + g * u,
                    i = j(h, a, d);
                return i >= q ? k(b, h) : 0 == i ? h : m(b, c, c + u)
            }
            function o() {
                y = !0, (a != c || d != e) && l()
            }
            var p = 4,
                q = .001,
                r = 1e-7,
                s = 10,
                t = 11,
                u = 1 / (t - 1),
                v = "Float32Array" in b;
            if (4 !== arguments.length)
                return !1;
            for (var w = 0; 4 > w; ++w)
                if ("number" != typeof arguments[w] || isNaN(arguments[w]) || !isFinite(arguments[w]))
                    return !1;
            a = Math.min(a, 1), d = Math.min(d, 1), a = Math.max(a, 0), d = Math.max(d, 0);
            var x = v ? new Float32Array(t) : new Array(t),
                y = !1,
                z = function(b) {
                    return y || o(), a === c && d === e ? b : 0 === b ? 0 : 1 === b ? 1 : i(n(b), c, e)
                };
            z.getControlPoints = function() {
                return [{
                    x: a,
                    y: c
                }, {
                    x: d,
                    y: e
                }]
            };
            var A = "generateBezier(" + [a, c, d, e] + ")";
            return z.toString = function() {
                return A
            }, z
        }
        function j(a, b) {
            var c = a;
            return p.isString(a) ? t.Easings[a] || (c = !1) : c = p.isArray(a) && 1 === a.length ? h.apply(null, a) : p.isArray(a) && 2 === a.length ? u.apply(null, a.concat([b])) : !(!p.isArray(a) || 4 !== a.length) && i.apply(null, a), c === !1 && (c = t.Easings[t.defaults.easing] ? t.defaults.easing : s), c
        }
        function k(a) {
            if (a) {
                var b = (new Date).getTime(),
                    c = t.State.calls.length;
                c > 1e4 && (t.State.calls = e(t.State.calls));
                for (var f = 0; c > f; f++)
                    if (t.State.calls[f]) {
                        var h = t.State.calls[f],
                            i = h[0],
                            j = h[2],
                            n = h[3],
                            o = !!n,
                            q = null;
                        n || (n = t.State.calls[f][3] = b - 16);
                        for (var r = Math.min((b - n) / j.duration, 1), s = 0, u = i.length; u > s; s++) {
                            var w = i[s],
                                y = w.element;
                            if (g(y)) {
                                var z = !1;
                                if (j.display !== d && null !== j.display && "none" !== j.display) {
                                    if ("flex" === j.display) {
                                        var A = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                                        m.each(A, function(a, b) {
                                            v.setPropertyValue(y, "display", b)
                                        })
                                    }
                                    v.setPropertyValue(y, "display", j.display)
                                }
                                j.visibility !== d && "hidden" !== j.visibility && v.setPropertyValue(y, "visibility", j.visibility);
                                for (var B in w)
                                    if ("element" !== B) {
                                        var C,
                                            D = w[B],
                                            E = p.isString(D.easing) ? t.Easings[D.easing] : D.easing;
                                        if (1 === r)
                                            C = D.endValue;
                                        else {
                                            var F = D.endValue - D.startValue;
                                            if (C = D.startValue + F * E(r, j, F), !o && C === D.currentValue)
                                                continue
                                        }
                                        if (D.currentValue = C, "tween" === B)
                                            q = C;
                                        else {
                                            if (v.Hooks.registered[B]) {
                                                var G = v.Hooks.getRoot(B),
                                                    H = g(y).rootPropertyValueCache[G];
                                                H && (D.rootPropertyValue = H)
                                            }
                                            var I = v.setPropertyValue(y, B, D.currentValue + (0 === parseFloat(C) ? "" : D.unitType), D.rootPropertyValue, D.scrollData);
                                            v.Hooks.registered[B] && (g(y).rootPropertyValueCache[G] = v.Normalizations.registered[G] ? v.Normalizations.registered[G]("extract", null, I[1]) : I[1]), "transform" === I[0] && (z = !0)
                                        }
                                    }
                                j.mobileHA && g(y).transformCache.translate3d === d && (g(y).transformCache.translate3d = "(0px, 0px, 0px)", z = !0), z && v.flushTransformCache(y)
                            }
                        }
                        j.display !== d && "none" !== j.display && (t.State.calls[f][2].display = !1), j.visibility !== d && "hidden" !== j.visibility && (t.State.calls[f][2].visibility = !1), j.progress && j.progress.call(h[1], h[1], r, Math.max(0, n + j.duration - b), n, q), 1 === r && l(f)
                    }
            }
            t.State.isTicking && x(k)
        }
        function l(a, b) {
            if (!t.State.calls[a])
                return !1;
            for (var c = t.State.calls[a][0], e = t.State.calls[a][1], f = t.State.calls[a][2], h = t.State.calls[a][4], i = !1, j = 0, k = c.length; k > j; j++) {
                var l = c[j].element;
                if (b || f.loop || ("none" === f.display && v.setPropertyValue(l, "display", f.display), "hidden" === f.visibility && v.setPropertyValue(l, "visibility", f.visibility)), f.loop !== !0 && (m.queue(l)[1] === d || !/\.velocityQueueEntryFlag/i.test(m.queue(l)[1])) && g(l)) {
                    g(l).isAnimating = !1, g(l).rootPropertyValueCache = {};
                    var n = !1;
                    m.each(v.Lists.transforms3D, function(a, b) {
                        var c = /^scale/.test(b) ? 1 : 0,
                            e = g(l).transformCache[b];
                        g(l).transformCache[b] !== d && new RegExp("^\\(" + c + "[^.]").test(e) && (n = !0, delete g(l).transformCache[b])
                    }), f.mobileHA && (n = !0, delete g(l).transformCache.translate3d), n && v.flushTransformCache(l), v.Values.removeClass(l, "velocity-animating")
                }
                if (!b && f.complete && !f.loop && j === k - 1)
                    try {
                        f.complete.call(e, e)
                    } catch (a) {
                        setTimeout(function() {
                            throw a
                        }, 1)
                    }
                h && f.loop !== !0 && h(e), g(l) && f.loop === !0 && !b && (m.each(g(l).tweensContainer, function(a, b) {
                    /^rotate/.test(a) && 360 === parseFloat(b.endValue) && (b.endValue = 0, b.startValue = 360), /^backgroundPosition/.test(a) && 100 === parseFloat(b.endValue) && "%" === b.unitType && (b.endValue = 0, b.startValue = 100)
                }), t(l, "reverse", {
                    loop: !0,
                    delay: f.delay
                })), f.queue !== !1 && m.dequeue(l, f.queue)
            }
            t.State.calls[a] = !1;
            for (var o = 0, p = t.State.calls.length; p > o; o++)
                if (t.State.calls[o] !== !1) {
                    i = !0;
                    break
                }
            i === !1 && (t.State.isTicking = !1, delete t.State.calls, t.State.calls = [])
        }
        var m,
            n = function() {
                if (c.documentMode)
                    return c.documentMode;
                for (var a = 7; a > 4; a--) {
                    var b = c.createElement("div");
                    if (b.innerHTML = "<!--[if IE " + a + "]><span></span><![endif]-->", b.getElementsByTagName("span").length)
                        return b = null, a
                }
                return d
            }(),
            o = function() {
                var a = 0;
                return b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame || function(b) {
                        var c,
                            d = (new Date).getTime();
                        return c = Math.max(0, 16 - (d - a)), a = d + c, setTimeout(function() {
                            b(d + c)
                        }, c)
                    }
            }(),
            p = {
                isString: function(a) {
                    return "string" == typeof a
                },
                isArray: Array.isArray || function(a) {
                    return "[object Array]" === Object.prototype.toString.call(a)
                },
                isFunction: function(a) {
                    return "[object Function]" === Object.prototype.toString.call(a)
                },
                isNode: function(a) {
                    return a && a.nodeType
                },
                isNodeList: function(a) {
                    return "object" == typeof a && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(a)) && a.length !== d && (0 === a.length || "object" == typeof a[0] && a[0].nodeType > 0)
                },
                isWrapped: function(a) {
                    return a && (a.jquery || b.Zepto && b.Zepto.zepto.isZ(a))
                },
                isSVG: function(a) {
                    return b.SVGElement && a instanceof b.SVGElement
                },
                isEmptyObject: function(a) {
                    for (var b in a)
                        return !1;
                    return !0
                }
            },
            q = !1;
        if (a.fn && a.fn.jquery ? (m = a, q = !0) : m = b.Velocity.Utilities, 8 >= n && !q)
            throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
        if (7 >= n)
            return void (jQuery.fn.velocity = jQuery.fn.animate);
        var r = 400,
            s = "swing",
            t = {
                State: {
                    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                    isAndroid: /Android/i.test(navigator.userAgent),
                    isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                    isChrome: b.chrome,
                    isFirefox: /Firefox/i.test(navigator.userAgent),
                    prefixElement: c.createElement("div"),
                    prefixMatches: {},
                    scrollAnchor: null,
                    scrollPropertyLeft: null,
                    scrollPropertyTop: null,
                    isTicking: !1,
                    calls: []
                },
                CSS: {},
                Utilities: m,
                Redirects: {},
                Easings: {},
                Promise: b.Promise,
                defaults: {
                    queue: "",
                    duration: r,
                    easing: s,
                    begin: d,
                    complete: d,
                    progress: d,
                    display: d,
                    visibility: d,
                    loop: !1,
                    delay: !1,
                    mobileHA: !0,
                    _cacheValues: !0
                },
                init: function(a) {
                    m.data(a, "velocity", {
                        isSVG: p.isSVG(a),
                        isAnimating: !1,
                        computedStyle: null,
                        tweensContainer: null,
                        rootPropertyValueCache: {},
                        transformCache: {}
                    })
                },
                hook: null,
                mock: !1,
                version: {
                    major: 1,
                    minor: 2,
                    patch: 2
                },
                debug: !1
            };
        b.pageYOffset !== d ? (t.State.scrollAnchor = b, t.State.scrollPropertyLeft = "pageXOffset", t.State.scrollPropertyTop = "pageYOffset") : (t.State.scrollAnchor = c.documentElement || c.body.parentNode || c.body, t.State.scrollPropertyLeft = "scrollLeft", t.State.scrollPropertyTop = "scrollTop");
        var u = function() {
            function a(a) {
                return -a.tension * a.x - a.friction * a.v
            }
            function b(b, c, d) {
                var e = {
                    x: b.x + d.dx * c,
                    v: b.v + d.dv * c,
                    tension: b.tension,
                    friction: b.friction
                };
                return {
                    dx: e.v,
                    dv: a(e)
                }
            }
            function c(c, d) {
                var e = {
                        dx: c.v,
                        dv: a(c)
                    },
                    f = b(c, .5 * d, e),
                    g = b(c, .5 * d, f),
                    h = b(c, d, g),
                    i = 1 / 6 * (e.dx + 2 * (f.dx + g.dx) + h.dx),
                    j = 1 / 6 * (e.dv + 2 * (f.dv + g.dv) + h.dv);
                return c.x = c.x + i * d, c.v = c.v + j * d, c
            }
            return function a(b, d, e) {
                var f,
                    g,
                    h,
                    i = {
                        x: -1,
                        v: 0,
                        tension: null,
                        friction: null
                    },
                    j = [0],
                    k = 0,
                    l = 1e-4,
                    m = .016;
                for (b = parseFloat(b) || 500, d = parseFloat(d) || 20, e = e || null, i.tension = b, i.friction = d, f = null !== e, f ? (k = a(b, d), g = k / e * m) : g = m; h = c(h || i, g), j.push(1 + h.x), k += 16, Math.abs(h.x) > l && Math.abs(h.v) > l;)
                    ;
                return f ? function(a) {
                    return j[a * (j.length - 1) | 0]
                } : k
            }
        }();
        t.Easings = {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return .5 - Math.cos(a * Math.PI) / 2
            },
            spring: function(a) {
                return 1 - Math.cos(4.5 * a * Math.PI) * Math.exp(6 * -a)
            }
        }, m.each([["ease", [.25, .1, .25, 1]], ["ease-in", [.42, 0, 1, 1]], ["ease-out", [0, 0, .58, 1]], ["ease-in-out", [.42, 0, .58, 1]], ["easeInSine", [.47, 0, .745, .715]], ["easeOutSine", [.39, .575, .565, 1]], ["easeInOutSine", [.445, .05, .55, .95]], ["easeInQuad", [.55, .085, .68, .53]], ["easeOutQuad", [.25, .46, .45, .94]], ["easeInOutQuad", [.455, .03, .515, .955]], ["easeInCubic", [.55, .055, .675, .19]], ["easeOutCubic", [.215, .61, .355, 1]], ["easeInOutCubic", [.645, .045, .355, 1]], ["easeInQuart", [.895, .03, .685, .22]], ["easeOutQuart", [.165, .84, .44, 1]], ["easeInOutQuart", [.77, 0, .175, 1]], ["easeInQuint", [.755, .05, .855, .06]], ["easeOutQuint", [.23, 1, .32, 1]], ["easeInOutQuint", [.86, 0, .07, 1]], ["easeInExpo", [.95, .05, .795, .035]], ["easeOutExpo", [.19, 1, .22, 1]], ["easeInOutExpo", [1, 0, 0, 1]], ["easeInCirc", [.6, .04, .98, .335]], ["easeOutCirc", [.075, .82, .165, 1]], ["easeInOutCirc", [.785, .135, .15, .86]]], function(a, b) {
            t.Easings[b[0]] = i.apply(null, b[1])
        });
        var v = t.CSS = {
            RegEx: {
                isHex: /^#([A-f\d]{3}){1,2}$/i,
                valueUnwrap: /^[A-z]+\((.*)\)$/i,
                wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
            },
            Lists: {
                colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
            },
            Hooks: {
                templates: {
                    textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                    boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                    clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                    backgroundPosition: ["X Y", "0% 0%"],
                    transformOrigin: ["X Y Z", "50% 50% 0px"],
                    perspectiveOrigin: ["X Y", "50% 50%"]
                },
                registered: {},
                register: function() {
                    for (var a = 0; a < v.Lists.colors.length; a++) {
                        var b = "color" === v.Lists.colors[a] ? "0 0 0 1" : "255 255 255 1";
                        v.Hooks.templates[v.Lists.colors[a]] = ["Red Green Blue Alpha", b]
                    }
                    var c,
                        d,
                        e;
                    if (n)
                        for (c in v.Hooks.templates) {
                            d = v.Hooks.templates[c], e = d[0].split(" ");
                            var f = d[1].match(v.RegEx.valueSplit);
                            "Color" === e[0] && (e.push(e.shift()), f.push(f.shift()), v.Hooks.templates[c] = [e.join(" "), f.join(" ")])
                        }
                    for (c in v.Hooks.templates) {
                        d = v.Hooks.templates[c], e = d[0].split(" ");
                        for (var a in e) {
                            var g = c + e[a],
                                h = a;
                            v.Hooks.registered[g] = [c, h]
                        }
                    }
                },
                getRoot: function(a) {
                    var b = v.Hooks.registered[a];
                    return b ? b[0] : a
                },
                cleanRootPropertyValue: function(a, b) {
                    return v.RegEx.valueUnwrap.test(b) && (b = b.match(v.RegEx.valueUnwrap)[1]), v.Values.isCSSNullValue(b) && (b = v.Hooks.templates[a][1]), b
                },
                extractValue: function(a, b) {
                    var c = v.Hooks.registered[a];
                    if (c) {
                        var d = c[0],
                            e = c[1];
                        return b = v.Hooks.cleanRootPropertyValue(d, b), b.toString().match(v.RegEx.valueSplit)[e]
                    }
                    return b
                },
                injectValue: function(a, b, c) {
                    var d = v.Hooks.registered[a];
                    if (d) {
                        var e,
                            f,
                            g = d[0],
                            h = d[1];
                        return c = v.Hooks.cleanRootPropertyValue(g, c), e = c.toString().match(v.RegEx.valueSplit), e[h] = b, f = e.join(" ")
                    }
                    return c
                }
            },
            Normalizations: {
                registered: {
                    clip: function(a, b, c) {
                        switch (a) {
                        case "name":
                            return "clip";
                        case "extract":
                            var d;
                            return v.RegEx.wrappedValueAlreadyExtracted.test(c) ? d = c : (d = c.toString().match(v.RegEx.valueUnwrap), d = d ? d[1].replace(/,(\s+)?/g, " ") : c), d;
                        case "inject":
                            return "rect(" + c + ")"
                        }
                    },
                    blur: function(a, b, c) {
                        switch (a) {
                        case "name":
                            return t.State.isFirefox ? "filter" : "-webkit-filter";
                        case "extract":
                            var d = parseFloat(c);
                            if (!d && 0 !== d) {
                                var e = c.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                d = e ? e[1] : 0
                            }
                            return d;
                        case "inject":
                            return parseFloat(c) ? "blur(" + c + ")" : "none"
                        }
                    },
                    opacity: function(a, b, c) {
                        if (8 >= n)
                            switch (a) {
                            case "name":
                                return "filter";
                            case "extract":
                                var d = c.toString().match(/alpha\(opacity=(.*)\)/i);
                                return c = d ? d[1] / 100 : 1;
                            case "inject":
                                return b.style.zoom = 1, parseFloat(c) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(c), 10) + ")"
                            }
                        else
                            switch (a) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return c;
                            case "inject":
                                return c
                            }
                    }
                },
                register: function() {
                    9 >= n || t.State.isGingerbread || (v.Lists.transformsBase = v.Lists.transformsBase.concat(v.Lists.transforms3D));
                    for (var a = 0; a < v.Lists.transformsBase.length; a++)
                        !function() {
                            var b = v.Lists.transformsBase[a];
                            v.Normalizations.registered[b] = function(a, c, e) {
                                switch (a) {
                                case "name":
                                    return "transform";
                                case "extract":
                                    return g(c) === d || g(c).transformCache[b] === d ? /^scale/i.test(b) ? 1 : 0 : g(c).transformCache[b].replace(/[()]/g, "");
                                case "inject":
                                    var f = !1;
                                    switch (b.substr(0, b.length - 1)) {
                                    case "translate":
                                        f = !/(%|px|em|rem|vw|vh|\d)$/i.test(e);
                                        break;
                                    case "scal":
                                    case "scale":
                                        t.State.isAndroid && g(c).transformCache[b] === d && 1 > e && (e = 1), f = !/(\d)$/i.test(e);
                                        break;
                                    case "skew":
                                        f = !/(deg|\d)$/i.test(e);
                                        break;
                                    case "rotate":
                                        f = !/(deg|\d)$/i.test(e)
                                    }
                                    return f || (g(c).transformCache[b] = "(" + e + ")"), g(c).transformCache[b]
                                }
                            }
                        }();
                    for (var a = 0; a < v.Lists.colors.length; a++)
                        !function() {
                            var b = v.Lists.colors[a];
                            v.Normalizations.registered[b] = function(a, c, e) {
                                switch (a) {
                                case "name":
                                    return b;
                                case "extract":
                                    var f;
                                    if (v.RegEx.wrappedValueAlreadyExtracted.test(e))
                                        f = e;
                                    else {
                                        var g,
                                            h = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };
                                        /^[A-z]+$/i.test(e) ? g = h[e] !== d ? h[e] : h.black : v.RegEx.isHex.test(e) ? g = "rgb(" + v.Values.hexToRgb(e).join(" ") + ")" : /^rgba?\(/i.test(e) || (g = h.black), f = (g || e).toString().match(v.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                    }
                                    return 8 >= n || 3 !== f.split(" ").length || (f += " 1"), f;
                                case "inject":
                                    return 8 >= n ? 4 === e.split(" ").length && (e = e.split(/\s+/).slice(0, 3).join(" ")) : 3 === e.split(" ").length && (e += " 1"), (8 >= n ? "rgb" : "rgba") + "(" + e.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")"
                                }
                            }
                        }()
                }
            },
            Names: {
                camelCase: function(a) {
                    return a.replace(/-(\w)/g, function(a, b) {
                        return b.toUpperCase()
                    })
                },
                SVGAttribute: function(a) {
                    var b = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                    return (n || t.State.isAndroid && !t.State.isChrome) && (b += "|transform"), new RegExp("^(" + b + ")$", "i").test(a)
                },
                prefixCheck: function(a) {
                    if (t.State.prefixMatches[a])
                        return [t.State.prefixMatches[a], !0];
                    for (var b = ["", "Webkit", "Moz", "ms", "O"], c = 0, d = b.length; d > c; c++) {
                        var e;
                        if (e = 0 === c ? a : b[c] + a.replace(/^\w/, function(a) {
                            return a.toUpperCase()
                        }), p.isString(t.State.prefixElement.style[e]))
                            return t.State.prefixMatches[a] = e, [e, !0]
                    }
                    return [a, !1]
                }
            },
            Values: {
                hexToRgb: function(a) {
                    var b,
                        c = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                        d = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
                    return a = a.replace(c, function(a, b, c, d) {
                        return b + b + c + c + d + d
                    }), b = d.exec(a), b ? [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16)] : [0, 0, 0]
                },
                isCSSNullValue: function(a) {
                    return 0 == a || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(a)
                },
                getUnitType: function(a) {
                    return /^(rotate|skew)/i.test(a) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(a) ? "" : "px"
                },
                getDisplayType: function(a) {
                    var b = a && a.tagName.toString().toLowerCase();
                    return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(b) ? "inline" : /^(li)$/i.test(b) ? "list-item" : /^(tr)$/i.test(b) ? "table-row" : /^(table)$/i.test(b) ? "table" : /^(tbody)$/i.test(b) ? "table-row-group" : "block"
                },
                addClass: function(a, b) {
                    a.classList ? a.classList.add(b) : a.className += (a.className.length ? " " : "") + b
                },
                removeClass: function(a, b) {
                    a.classList ? a.classList.remove(b) : a.className = a.className.toString().replace(new RegExp("(^|\\s)" + b.split(" ").join("|") + "(\\s|$)", "gi"), " ")
                }
            },
            getPropertyValue: function(a, c, e, f) {
                function h(a, c) {
                    function e() {
                        j && v.setPropertyValue(a, "display", "none")
                    }
                    var i = 0;
                    if (8 >= n)
                        i = m.css(a, c);
                    else {
                        var j = !1;
                        if (/^(width|height)$/.test(c) && 0 === v.getPropertyValue(a, "display") && (j = !0, v.setPropertyValue(a, "display", v.Values.getDisplayType(a))), !f) {
                            if ("height" === c && "border-box" !== v.getPropertyValue(a, "boxSizing").toString().toLowerCase()) {
                                var k = a.offsetHeight - (parseFloat(v.getPropertyValue(a, "borderTopWidth")) || 0) - (parseFloat(v.getPropertyValue(a, "borderBottomWidth")) || 0) - (parseFloat(v.getPropertyValue(a, "paddingTop")) || 0) - (parseFloat(v.getPropertyValue(a, "paddingBottom")) || 0);
                                return e(), k
                            }
                            if ("width" === c && "border-box" !== v.getPropertyValue(a, "boxSizing").toString().toLowerCase()) {
                                var l = a.offsetWidth - (parseFloat(v.getPropertyValue(a, "borderLeftWidth")) || 0) - (parseFloat(v.getPropertyValue(a, "borderRightWidth")) || 0) - (parseFloat(v.getPropertyValue(a, "paddingLeft")) || 0) - (parseFloat(v.getPropertyValue(a, "paddingRight")) || 0);
                                return e(), l
                            }
                        }
                        var o;
                        o = g(a) === d ? b.getComputedStyle(a, null) : g(a).computedStyle ? g(a).computedStyle : g(a).computedStyle = b.getComputedStyle(a, null), "borderColor" === c && (c = "borderTopColor"), i = 9 === n && "filter" === c ? o.getPropertyValue(c) : o[c], ("" === i || null === i) && (i = a.style[c]), e()
                    }
                    if ("auto" === i && /^(top|right|bottom|left)$/i.test(c)) {
                        var p = h(a, "position");
                        ("fixed" === p || "absolute" === p && /top|left/i.test(c)) && (i = m(a).position()[c] + "px")
                    }
                    return i
                }
                var i;
                if (v.Hooks.registered[c]) {
                    var j = c,
                        k = v.Hooks.getRoot(j);
                    e === d && (e = v.getPropertyValue(a, v.Names.prefixCheck(k)[0])), v.Normalizations.registered[k] && (e = v.Normalizations.registered[k]("extract", a, e)), i = v.Hooks.extractValue(j, e)
                } else if (v.Normalizations.registered[c]) {
                    var l,
                        o;
                    l = v.Normalizations.registered[c]("name", a), "transform" !== l && (o = h(a, v.Names.prefixCheck(l)[0]), v.Values.isCSSNullValue(o) && v.Hooks.templates[c] && (o = v.Hooks.templates[c][1])), i = v.Normalizations.registered[c]("extract", a, o)
                }
                if (!/^[\d-]/.test(i))
                    if (g(a) && g(a).isSVG && v.Names.SVGAttribute(c))
                        if (/^(height|width)$/i.test(c))
                            try {
                                i = a.getBBox()[c]
                            } catch (a) {
                                i = 0
                            }
                        else
                            i = a.getAttribute(c);
                    else
                        i = h(a, v.Names.prefixCheck(c)[0]);
                return v.Values.isCSSNullValue(i) && (i = 0), t.debug >= 2 && console.log("Get " + c + ": " + i), i
            },
            setPropertyValue: function(a, c, d, e, f) {
                var h = c;
                if ("scroll" === c)
                    f.container ? f.container["scroll" + f.direction] = d : "Left" === f.direction ? b.scrollTo(d, f.alternateValue) : b.scrollTo(f.alternateValue, d);
                else if (v.Normalizations.registered[c] && "transform" === v.Normalizations.registered[c]("name", a))
                    v.Normalizations.registered[c]("inject", a, d), h = "transform", d = g(a).transformCache[c];
                else {
                    if (v.Hooks.registered[c]) {
                        var i = c,
                            j = v.Hooks.getRoot(c);
                        e = e || v.getPropertyValue(a, j), d = v.Hooks.injectValue(i, d, e), c = j
                    }
                    if (v.Normalizations.registered[c] && (d = v.Normalizations.registered[c]("inject", a, d), c = v.Normalizations.registered[c]("name", a)), h = v.Names.prefixCheck(c)[0], 8 >= n)
                        try {
                            a.style[h] = d
                        } catch (a) {
                            t.debug && console.log("Browser does not support [" + d + "] for [" + h + "]")
                        }
                    else
                        g(a) && g(a).isSVG && v.Names.SVGAttribute(c) ? a.setAttribute(c, d) : a.style[h] = d;
                    t.debug >= 2 && console.log("Set " + c + " (" + h + "): " + d)
                }
                return [h, d]
            },
            flushTransformCache: function(a) {
                function b(b) {
                    return parseFloat(v.getPropertyValue(a, b))
                }
                var c = "";
                if ((n || t.State.isAndroid && !t.State.isChrome) && g(a).isSVG) {
                    var d = {
                        translate: [b("translateX"), b("translateY")],
                        skewX: [b("skewX")],
                        skewY: [b("skewY")],
                        scale: 1 !== b("scale") ? [b("scale"), b("scale")] : [b("scaleX"), b("scaleY")],
                        rotate: [b("rotateZ"), 0, 0]
                    };
                    m.each(g(a).transformCache, function(a) {
                        /^translate/i.test(a) ? a = "translate" : /^scale/i.test(a) ? a = "scale" : /^rotate/i.test(a) && (a = "rotate"), d[a] && (c += a + "(" + d[a].join(" ") + ") ", delete d[a])
                    })
                } else {
                    var e,
                        f;
                    m.each(g(a).transformCache, function(b) {
                        return e = g(a).transformCache[b], "transformPerspective" === b ? (f = e, !0) : (9 === n && "rotateZ" === b && (b = "rotate"), void (c += b + e + " "))
                    }), f && (c = "perspective" + f + " " + c)
                }
                v.setPropertyValue(a, "transform", c)
            }
        };
        v.Hooks.register(), v.Normalizations.register(), t.hook = function(a, b, c) {
            var e = d;
            return a = f(a), m.each(a, function(a, f) {
                if (g(f) === d && t.init(f), c === d)
                    e === d && (e = t.CSS.getPropertyValue(f, b));
                else {
                    var h = t.CSS.setPropertyValue(f, b, c);
                    "transform" === h[0] && t.CSS.flushTransformCache(f), e = h
                }
            }), e
        };
        var w = function() {
            function a() {
                return h ? B.promise || null : i
            }
            function e() {
                function a(a) {
                    function l(a, b) {
                        var c = d,
                            e = d,
                            g = d;
                        return p.isArray(a) ? (c = a[0], !p.isArray(a[1]) && /^[\d-]/.test(a[1]) || p.isFunction(a[1]) || v.RegEx.isHex.test(a[1]) ? g = a[1] : (p.isString(a[1]) && !v.RegEx.isHex.test(a[1]) || p.isArray(a[1])) && (e = b ? a[1] : j(a[1], h.duration), a[2] !== d && (g = a[2]))) : c = a, b || (e = e || h.easing), p.isFunction(c) && (c = c.call(f, y, x)), p.isFunction(g) && (g = g.call(f, y, x)), [c || 0, e, g]
                    }
                    function n(a, b) {
                        var c,
                            d;
                        return d = (b || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(a) {
                            return c = a, ""
                        }), c || (c = v.Values.getUnitType(a)), [d, c]
                    }
                    function r() {
                        var a = {
                                myParent: f.parentNode || c.body,
                                position: v.getPropertyValue(f, "position"),
                                fontSize: v.getPropertyValue(f, "fontSize")
                            },
                            d = a.position === I.lastPosition && a.myParent === I.lastParent,
                            e = a.fontSize === I.lastFontSize;
                        I.lastParent = a.myParent, I.lastPosition = a.position, I.lastFontSize = a.fontSize;
                        var h = 100,
                            i = {};
                        if (e && d)
                            i.emToPx = I.lastEmToPx, i.percentToPxWidth = I.lastPercentToPxWidth, i.percentToPxHeight = I.lastPercentToPxHeight;
                        else {
                            var j = g(f).isSVG ? c.createElementNS("http://www.w3.org/2000/svg", "rect") : c.createElement("div");
                            t.init(j), a.myParent.appendChild(j), m.each(["overflow", "overflowX", "overflowY"], function(a, b) {
                                t.CSS.setPropertyValue(j, b, "hidden")
                            }), t.CSS.setPropertyValue(j, "position", a.position), t.CSS.setPropertyValue(j, "fontSize", a.fontSize), t.CSS.setPropertyValue(j, "boxSizing", "content-box"), m.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(a, b) {
                                t.CSS.setPropertyValue(j, b, h + "%")
                            }), t.CSS.setPropertyValue(j, "paddingLeft", h + "em"), i.percentToPxWidth = I.lastPercentToPxWidth = (parseFloat(v.getPropertyValue(j, "width", null, !0)) || 1) / h, i.percentToPxHeight = I.lastPercentToPxHeight = (parseFloat(v.getPropertyValue(j, "height", null, !0)) || 1) / h, i.emToPx = I.lastEmToPx = (parseFloat(v.getPropertyValue(j, "paddingLeft")) || 1) / h, a.myParent.removeChild(j)
                        }
                        return null === I.remToPx && (I.remToPx = parseFloat(v.getPropertyValue(c.body, "fontSize")) || 16), null === I.vwToPx && (I.vwToPx = parseFloat(b.innerWidth) / 100, I.vhToPx = parseFloat(b.innerHeight) / 100), i.remToPx = I.remToPx, i.vwToPx = I.vwToPx, i.vhToPx = I.vhToPx, t.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(i), f), i
                    }
                    if (h.begin && 0 === y)
                        try {
                            h.begin.call(o, o)
                        } catch (a) {
                            setTimeout(function() {
                                throw a
                            }, 1)
                        }
                    if ("scroll" === C) {
                        var u,
                            w,
                            z,
                            A = /^x$/i.test(h.axis) ? "Left" : "Top",
                            D = parseFloat(h.offset) || 0;
                        h.container ? p.isWrapped(h.container) || p.isNode(h.container) ? (h.container = h.container[0] || h.container, u = h.container["scroll" + A], z = u + m(f).position()[A.toLowerCase()] + D) : h.container = null : (u = t.State.scrollAnchor[t.State["scrollProperty" + A]], w = t.State.scrollAnchor[t.State["scrollProperty" + ("Left" === A ? "Top" : "Left")]], z = m(f).offset()[A.toLowerCase()] + D), i = {
                            scroll: {
                                rootPropertyValue: !1,
                                startValue: u,
                                currentValue: u,
                                endValue: z,
                                unitType: "",
                                easing: h.easing,
                                scrollData: {
                                    container: h.container,
                                    direction: A,
                                    alternateValue: w
                                }
                            },
                            element: f
                        }, t.debug && console.log("tweensContainer (scroll): ", i.scroll, f)
                    } else if ("reverse" === C) {
                        if (!g(f).tweensContainer)
                            return void m.dequeue(f, h.queue);
                        "none" === g(f).opts.display && (g(f).opts.display = "auto"), "hidden" === g(f).opts.visibility && (g(f).opts.visibility = "visible"), g(f).opts.loop = !1, g(f).opts.begin = null, g(f).opts.complete = null, s.easing || delete h.easing, s.duration || delete h.duration, h = m.extend({}, g(f).opts, h);
                        var E = m.extend(!0, {}, g(f).tweensContainer);
                        for (var F in E)
                            if ("element" !== F) {
                                var G = E[F].startValue;
                                E[F].startValue = E[F].currentValue = E[F].endValue, E[F].endValue = G, p.isEmptyObject(s) || (E[F].easing = h.easing), t.debug && console.log("reverse tweensContainer (" + F + "): " + JSON.stringify(E[F]), f)
                            }
                        i = E
                    } else if ("start" === C) {
                        var E;
                        g(f).tweensContainer && g(f).isAnimating === !0 && (E = g(f).tweensContainer), m.each(q, function(a, b) {
                            if (RegExp("^" + v.Lists.colors.join("$|^") + "$").test(a)) {
                                var c = l(b, !0),
                                    e = c[0],
                                    f = c[1],
                                    g = c[2];
                                if (v.RegEx.isHex.test(e)) {
                                    for (var h = ["Red", "Green", "Blue"], i = v.Values.hexToRgb(e), j = g ? v.Values.hexToRgb(g) : d, k = 0; k < h.length; k++) {
                                        var m = [i[k]];
                                        f && m.push(f), j !== d && m.push(j[k]), q[a + h[k]] = m
                                    }
                                    delete q[a]
                                }
                            }
                        });
                        for (var H in q) {
                            var K = l(q[H]),
                                L = K[0],
                                M = K[1],
                                N = K[2];
                            H = v.Names.camelCase(H);
                            var O = v.Hooks.getRoot(H),
                                P = !1;
                            if (g(f).isSVG || "tween" === O || v.Names.prefixCheck(O)[1] !== !1 || v.Normalizations.registered[O] !== d) {
                                (h.display !== d && null !== h.display && "none" !== h.display || h.visibility !== d && "hidden" !== h.visibility) && /opacity|filter/.test(H) && !N && 0 !== L && (N = 0), h._cacheValues && E && E[H] ? (N === d && (N = E[H].endValue + E[H].unitType), P = g(f).rootPropertyValueCache[O]) : v.Hooks.registered[H] ? N === d ? (P = v.getPropertyValue(f, O), N = v.getPropertyValue(f, H, P)) : P = v.Hooks.templates[O][1] : N === d && (N = v.getPropertyValue(f, H));
                                var Q,
                                    R,
                                    S,
                                    T = !1;
                                if (Q = n(H, N), N = Q[0], S = Q[1], Q = n(H, L), L = Q[0].replace(/^([+-\/*])=/, function(a, b) {
                                    return T = b, ""
                                }), R = Q[1], N = parseFloat(N) || 0, L = parseFloat(L) || 0, "%" === R && (/^(fontSize|lineHeight)$/.test(H) ? (L /= 100, R = "em") : /^scale/.test(H) ? (L /= 100, R = "") : /(Red|Green|Blue)$/i.test(H) && (L = L / 100 * 255, R = "")), /[\/*]/.test(T))
                                    R = S;
                                else if (S !== R && 0 !== N)
                                    if (0 === L)
                                        R = S;
                                    else {
                                        e = e || r();
                                        var U = /margin|padding|left|right|width|text|word|letter/i.test(H) || /X$/.test(H) || "x" === H ? "x" : "y";
                                        switch (S) {
                                        case "%":
                                            N *= "x" === U ? e.percentToPxWidth : e.percentToPxHeight;
                                            break;
                                        case "px":
                                            break;
                                        default:
                                            N *= e[S + "ToPx"]
                                        }
                                        switch (R) {
                                        case "%":
                                            N *= 1 / ("x" === U ? e.percentToPxWidth : e.percentToPxHeight);
                                            break;
                                        case "px":
                                            break;
                                        default:
                                            N *= 1 / e[R + "ToPx"]
                                        }
                                    }
                                switch (T) {
                                case "+":
                                    L = N + L;
                                    break;
                                case "-":
                                    L = N - L;
                                    break;
                                case "*":
                                    L = N * L;
                                    break;
                                case "/":
                                    L = N / L
                                }
                                i[H] = {
                                    rootPropertyValue: P,
                                    startValue: N,
                                    currentValue: N,
                                    endValue: L,
                                    unitType: R,
                                    easing: M
                                }, t.debug && console.log("tweensContainer (" + H + "): " + JSON.stringify(i[H]), f)
                            } else
                                t.debug && console.log("Skipping [" + O + "] due to a lack of browser support.")
                        }
                        i.element = f
                    }
                    i.element && (v.Values.addClass(f, "velocity-animating"), J.push(i), "" === h.queue && (g(f).tweensContainer = i, g(f).opts = h), g(f).isAnimating = !0, y === x - 1 ? (t.State.calls.push([J, o, h, null, B.resolver]), t.State.isTicking === !1 && (t.State.isTicking = !0, k())) : y++)
                }
                var e,
                    f = this,
                    h = m.extend({}, t.defaults, s),
                    i = {};
                switch (g(f) === d && t.init(f), parseFloat(h.delay) && h.queue !== !1 && m.queue(f, h.queue, function(a) {
                    t.velocityQueueEntryFlag = !0, g(f).delayTimer = {
                        setTimeout: setTimeout(a, parseFloat(h.delay)),
                        next: a
                    }
                }), h.duration.toString().toLowerCase()) {
                case "fast":
                    h.duration = 200;
                    break;
                case "normal":
                    h.duration = r;
                    break;
                case "slow":
                    h.duration = 600;
                    break;
                default:
                    h.duration = parseFloat(h.duration) || 1
                }
                t.mock !== !1 && (t.mock === !0 ? h.duration = h.delay = 1 : (h.duration *= parseFloat(t.mock) || 1, h.delay *= parseFloat(t.mock) || 1)), h.easing = j(h.easing, h.duration), h.begin && !p.isFunction(h.begin) && (h.begin = null), h.progress && !p.isFunction(h.progress) && (h.progress = null), h.complete && !p.isFunction(h.complete) && (h.complete = null), h.display !== d && null !== h.display && (h.display = h.display.toString().toLowerCase(), "auto" === h.display && (h.display = t.CSS.Values.getDisplayType(f))), h.visibility !== d && null !== h.visibility && (h.visibility = h.visibility.toString().toLowerCase()), h.mobileHA = h.mobileHA && t.State.isMobile && !t.State.isGingerbread, h.queue === !1 ? h.delay ? setTimeout(a, h.delay) : a() : m.queue(f, h.queue, function(b, c) {
                    return c === !0 ? (B.promise && B.resolver(o), !0) : (t.velocityQueueEntryFlag = !0, void a(b))
                }), "" !== h.queue && "fx" !== h.queue || "inprogress" === m.queue(f)[0] || m.dequeue(f)
            }
            var h,
                i,
                n,
                o,
                q,
                s,
                u = arguments[0] && (arguments[0].p || m.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || p.isString(arguments[0].properties));
            if (p.isWrapped(this) ? (h = !1, n = 0, o = this, i = this) : (h = !0, n = 1, o = u ? arguments[0].elements || arguments[0].e : arguments[0]), o = f(o)) {
                u ? (q = arguments[0].properties || arguments[0].p, s = arguments[0].options || arguments[0].o) : (q = arguments[n], s = arguments[n + 1]);
                var x = o.length,
                    y = 0;
                if (!/^(stop|finish)$/i.test(q) && !m.isPlainObject(s)) {
                    var z = n + 1;
                    s = {};
                    for (var A = z; A < arguments.length; A++)
                        p.isArray(arguments[A]) || !/^(fast|normal|slow)$/i.test(arguments[A]) && !/^\d/.test(arguments[A]) ? p.isString(arguments[A]) || p.isArray(arguments[A]) ? s.easing = arguments[A] : p.isFunction(arguments[A]) && (s.complete = arguments[A]) : s.duration = arguments[A]
                }
                var B = {
                    promise: null,
                    resolver: null,
                    rejecter: null
                };
                h && t.Promise && (B.promise = new t.Promise(function(a, b) {
                    B.resolver = a, B.rejecter = b
                }));
                var C;
                switch (q) {
                case "scroll":
                    C = "scroll";
                    break;
                case "reverse":
                    C = "reverse";
                    break;
                case "finish":
                case "stop":
                    m.each(o, function(a, b) {
                        g(b) && g(b).delayTimer && (clearTimeout(g(b).delayTimer.setTimeout), g(b).delayTimer.next && g(b).delayTimer.next(), delete g(b).delayTimer)
                    });
                    var D = [];
                    return m.each(t.State.calls, function(a, b) {
                        b && m.each(b[1], function(c, e) {
                            var f = s === d ? "" : s;
                            return f !== !0 && b[2].queue !== f && (s !== d || b[2].queue !== !1) || void m.each(o, function(c, d) {
                                    d === e && ((s === !0 || p.isString(s)) && (m.each(m.queue(d, p.isString(s) ? s : ""), function(a, b) {
                                        p.isFunction(b) && b(null, !0)
                                    }), m.queue(d, p.isString(s) ? s : "", [])), "stop" === q ? (g(d) && g(d).tweensContainer && f !== !1 && m.each(g(d).tweensContainer, function(a, b) {
                                        b.endValue = b.currentValue
                                    }), D.push(a)) : "finish" === q && (b[2].duration = 1))
                                })
                        })
                    }), "stop" === q && (m.each(D, function(a, b) {
                        l(b, !0)
                    }), B.promise && B.resolver(o)), a();
                default:
                    if (!m.isPlainObject(q) || p.isEmptyObject(q)) {
                        if (p.isString(q) && t.Redirects[q]) {
                            var E = m.extend({}, s),
                                F = E.duration,
                                G = E.delay || 0;
                            return E.backwards === !0 && (o = m.extend(!0, [], o).reverse()), m.each(o, function(a, b) {
                                parseFloat(E.stagger) ? E.delay = G + parseFloat(E.stagger) * a : p.isFunction(E.stagger) && (E.delay = G + E.stagger.call(b, a, x)), E.drag && (E.duration = parseFloat(F) || (/^(callout|transition)/.test(q) ? 1e3 : r), E.duration = Math.max(E.duration * (E.backwards ? 1 - a / x : (a + 1) / x), .75 * E.duration, 200)), t.Redirects[q].call(b, b, E || {}, a, x, o, B.promise ? B : d)
                            }), a()
                        }
                        var H = "Velocity: First argument (" + q + ") was not a property map, a known action, or a registered redirect. Aborting.";
                        return B.promise ? B.rejecter(new Error(H)) : console.log(H), a()
                    }
                    C = "start"
                }
                var I = {
                        lastParent: null,
                        lastPosition: null,
                        lastFontSize: null,
                        lastPercentToPxWidth: null,
                        lastPercentToPxHeight: null,
                        lastEmToPx: null,
                        remToPx: null,
                        vwToPx: null,
                        vhToPx: null
                    },
                    J = [];
                m.each(o, function(a, b) {
                    p.isNode(b) && e.call(b)
                });
                var K,
                    E = m.extend({}, t.defaults, s);
                if (E.loop = parseInt(E.loop), K = 2 * E.loop - 1, E.loop)
                    for (var L = 0; K > L; L++) {
                        var M = {
                            delay: E.delay,
                            progress: E.progress
                        };
                        L === K - 1 && (M.display = E.display, M.visibility = E.visibility, M.complete = E.complete), w(o, "reverse", M)
                    }
                return a()
            }
        };
        t = m.extend(w, t), t.animate = w;
        var x = b.requestAnimationFrame || o;
        return t.State.isMobile || c.hidden === d || c.addEventListener("visibilitychange", function() {
            c.hidden ? (x = function(a) {
                return setTimeout(function() {
                    a(!0)
                }, 16)
            }, k()) : x = b.requestAnimationFrame || o
        }), a.Velocity = t, a !== b && (a.fn.velocity = w, a.fn.velocity.defaults = t.defaults), m.each(["Down", "Up"], function(a, b) {
            t.Redirects["slide" + b] = function(a, c, e, f, g, h) {
                var i = m.extend({}, c),
                    j = i.begin,
                    k = i.complete,
                    l = {
                        height: "",
                        marginTop: "",
                        marginBottom: "",
                        paddingTop: "",
                        paddingBottom: ""
                    },
                    n = {};
                i.display === d && (i.display = "Down" === b ? "inline" === t.CSS.Values.getDisplayType(a) ? "inline-block" : "block" : "none"), i.begin = function() {
                    j && j.call(g, g);
                    for (var c in l) {
                        n[c] = a.style[c];
                        var d = t.CSS.getPropertyValue(a, c);
                        l[c] = "Down" === b ? [d, 0] : [0, d]
                    }
                    n.overflow = a.style.overflow, a.style.overflow = "hidden"
                }, i.complete = function() {
                    for (var b in n)
                        a.style[b] = n[b];
                    k && k.call(g, g), h && h.resolver(g)
                }, t(a, l, i)
            }
        }), m.each(["In", "Out"], function(a, b) {
            t.Redirects["fade" + b] = function(a, c, e, f, g, h) {
                var i = m.extend({}, c),
                    j = {
                        opacity: "In" === b ? 1 : 0
                    },
                    k = i.complete;
                i.complete = e !== f - 1 ? i.begin = null : function() {
                    k && k.call(g, g), h && h.resolver(g)
                }, i.display === d && (i.display = "In" === b ? "auto" : "none"), t(this, j, i)
            }
        }), t
    }(window.jQuery || window.Zepto || window, window, document)
}), window.currentTab = -1, $("document").ready(function() {
    heightFix(), footerFix(), initPlugins(), refreshClock(), initLayout(), preloadImages(), initNaturalLanguageForm(), initFormSubmission(), toggleFlag(), hoverReveal(), printMessage()
});

