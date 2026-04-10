import { a as Fe, c as Yl, e as aM, A as oM, G as uM } from "./adp-widget-vendor.js";
var Nd = { exports: {} }, Te = {};
var Xx;
function lM() {
  if (Xx) return Te;
  Xx = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), u = Symbol.for("react.provider"), l = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), f = Symbol.for("react.suspense"), d = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), h = Symbol.iterator;
  function m(I) {
    return I === null || typeof I != "object" ? null : (I = h && I[h] || I["@@iterator"], typeof I == "function" ? I : null);
  }
  var x = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, S = Object.assign, w = {};
  function b(I, B, ue) {
    this.props = I, this.context = B, this.refs = w, this.updater = ue || x;
  }
  b.prototype.isReactComponent = {}, b.prototype.setState = function(I, B) {
    if (typeof I != "object" && typeof I != "function" && I != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, I, B, "setState");
  }, b.prototype.forceUpdate = function(I) {
    this.updater.enqueueForceUpdate(this, I, "forceUpdate");
  };
  function P() {
  }
  P.prototype = b.prototype;
  function C(I, B, ue) {
    this.props = I, this.context = B, this.refs = w, this.updater = ue || x;
  }
  var A = C.prototype = new P();
  A.constructor = C, S(A, b.prototype), A.isPureReactComponent = !0;
  var T = Array.isArray, _ = Object.prototype.hasOwnProperty, O = { current: null }, k = { key: !0, ref: !0, __self: !0, __source: !0 };
  function M(I, B, ue) {
    var pe, me = {}, Se = null, je = null;
    if (B != null) for (pe in B.ref !== void 0 && (je = B.ref), B.key !== void 0 && (Se = "" + B.key), B) _.call(B, pe) && !k.hasOwnProperty(pe) && (me[pe] = B[pe]);
    var Oe = arguments.length - 2;
    if (Oe === 1) me.children = ue;
    else if (1 < Oe) {
      for (var ae = Array(Oe), ye = 0; ye < Oe; ye++) ae[ye] = arguments[ye + 2];
      me.children = ae;
    }
    if (I && I.defaultProps) for (pe in Oe = I.defaultProps, Oe) me[pe] === void 0 && (me[pe] = Oe[pe]);
    return { $$typeof: e, type: I, key: Se, ref: je, props: me, _owner: O.current };
  }
  function N(I, B) {
    return { $$typeof: e, type: I.type, key: B, ref: I.ref, props: I.props, _owner: I._owner };
  }
  function W(I) {
    return typeof I == "object" && I !== null && I.$$typeof === e;
  }
  function R(I) {
    var B = { "=": "=0", ":": "=2" };
    return "$" + I.replace(/[=:]/g, function(ue) {
      return B[ue];
    });
  }
  var q = /\/+/g;
  function F(I, B) {
    return typeof I == "object" && I !== null && I.key != null ? R("" + I.key) : B.toString(36);
  }
  function X(I, B, ue, pe, me) {
    var Se = typeof I;
    (Se === "undefined" || Se === "boolean") && (I = null);
    var je = !1;
    if (I === null) je = !0;
    else switch (Se) {
      case "string":
      case "number":
        je = !0;
        break;
      case "object":
        switch (I.$$typeof) {
          case e:
          case t:
            je = !0;
        }
    }
    if (je) return je = I, me = me(je), I = pe === "" ? "." + F(je, 0) : pe, T(me) ? (ue = "", I != null && (ue = I.replace(q, "$&/") + "/"), X(me, B, ue, "", function(ye) {
      return ye;
    })) : me != null && (W(me) && (me = N(me, ue + (!me.key || je && je.key === me.key ? "" : ("" + me.key).replace(q, "$&/") + "/") + I)), B.push(me)), 1;
    if (je = 0, pe = pe === "" ? "." : pe + ":", T(I)) for (var Oe = 0; Oe < I.length; Oe++) {
      Se = I[Oe];
      var ae = pe + F(Se, Oe);
      je += X(Se, B, ue, ae, me);
    }
    else if (ae = m(I), typeof ae == "function") for (I = ae.call(I), Oe = 0; !(Se = I.next()).done; ) Se = Se.value, ae = pe + F(Se, Oe++), je += X(Se, B, ue, ae, me);
    else if (Se === "object") throw B = String(I), Error("Objects are not valid as a React child (found: " + (B === "[object Object]" ? "object with keys {" + Object.keys(I).join(", ") + "}" : B) + "). If you meant to render a collection of children, use an array instead.");
    return je;
  }
  function G(I, B, ue) {
    if (I == null) return I;
    var pe = [], me = 0;
    return X(I, pe, "", "", function(Se) {
      return B.call(ue, Se, me++);
    }), pe;
  }
  function Y(I) {
    if (I._status === -1) {
      var B = I._result;
      B = B(), B.then(function(ue) {
        (I._status === 0 || I._status === -1) && (I._status = 1, I._result = ue);
      }, function(ue) {
        (I._status === 0 || I._status === -1) && (I._status = 2, I._result = ue);
      }), I._status === -1 && (I._status = 0, I._result = B);
    }
    if (I._status === 1) return I._result.default;
    throw I._result;
  }
  var ee = { current: null }, H = { transition: null }, Q = { ReactCurrentDispatcher: ee, ReactCurrentBatchConfig: H, ReactCurrentOwner: O };
  function J() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return Te.Children = { map: G, forEach: function(I, B, ue) {
    G(I, function() {
      B.apply(this, arguments);
    }, ue);
  }, count: function(I) {
    var B = 0;
    return G(I, function() {
      B++;
    }), B;
  }, toArray: function(I) {
    return G(I, function(B) {
      return B;
    }) || [];
  }, only: function(I) {
    if (!W(I)) throw Error("React.Children.only expected to receive a single React element child.");
    return I;
  } }, Te.Component = b, Te.Fragment = r, Te.Profiler = a, Te.PureComponent = C, Te.StrictMode = n, Te.Suspense = f, Te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Q, Te.act = J, Te.cloneElement = function(I, B, ue) {
    if (I == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + I + ".");
    var pe = S({}, I.props), me = I.key, Se = I.ref, je = I._owner;
    if (B != null) {
      if (B.ref !== void 0 && (Se = B.ref, je = O.current), B.key !== void 0 && (me = "" + B.key), I.type && I.type.defaultProps) var Oe = I.type.defaultProps;
      for (ae in B) _.call(B, ae) && !k.hasOwnProperty(ae) && (pe[ae] = B[ae] === void 0 && Oe !== void 0 ? Oe[ae] : B[ae]);
    }
    var ae = arguments.length - 2;
    if (ae === 1) pe.children = ue;
    else if (1 < ae) {
      Oe = Array(ae);
      for (var ye = 0; ye < ae; ye++) Oe[ye] = arguments[ye + 2];
      pe.children = Oe;
    }
    return { $$typeof: e, type: I.type, key: me, ref: Se, props: pe, _owner: je };
  }, Te.createContext = function(I) {
    return I = { $$typeof: l, _currentValue: I, _currentValue2: I, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, I.Provider = { $$typeof: u, _context: I }, I.Consumer = I;
  }, Te.createElement = M, Te.createFactory = function(I) {
    var B = M.bind(null, I);
    return B.type = I, B;
  }, Te.createRef = function() {
    return { current: null };
  }, Te.forwardRef = function(I) {
    return { $$typeof: c, render: I };
  }, Te.isValidElement = W, Te.lazy = function(I) {
    return { $$typeof: v, _payload: { _status: -1, _result: I }, _init: Y };
  }, Te.memo = function(I, B) {
    return { $$typeof: d, type: I, compare: B === void 0 ? null : B };
  }, Te.startTransition = function(I) {
    var B = H.transition;
    H.transition = {};
    try {
      I();
    } finally {
      H.transition = B;
    }
  }, Te.unstable_act = J, Te.useCallback = function(I, B) {
    return ee.current.useCallback(I, B);
  }, Te.useContext = function(I) {
    return ee.current.useContext(I);
  }, Te.useDebugValue = function() {
  }, Te.useDeferredValue = function(I) {
    return ee.current.useDeferredValue(I);
  }, Te.useEffect = function(I, B) {
    return ee.current.useEffect(I, B);
  }, Te.useId = function() {
    return ee.current.useId();
  }, Te.useImperativeHandle = function(I, B, ue) {
    return ee.current.useImperativeHandle(I, B, ue);
  }, Te.useInsertionEffect = function(I, B) {
    return ee.current.useInsertionEffect(I, B);
  }, Te.useLayoutEffect = function(I, B) {
    return ee.current.useLayoutEffect(I, B);
  }, Te.useMemo = function(I, B) {
    return ee.current.useMemo(I, B);
  }, Te.useReducer = function(I, B, ue) {
    return ee.current.useReducer(I, B, ue);
  }, Te.useRef = function(I) {
    return ee.current.useRef(I);
  }, Te.useState = function(I) {
    return ee.current.useState(I);
  }, Te.useSyncExternalStore = function(I, B, ue) {
    return ee.current.useSyncExternalStore(I, B, ue);
  }, Te.useTransition = function() {
    return ee.current.useTransition();
  }, Te.version = "18.3.1", Te;
}
var Yx;
function HA() {
  return Yx || (Yx = 1, Nd.exports = lM()), Nd.exports;
}
var V = HA();
const $ = /* @__PURE__ */ Fe(V);
var Ql = {}, Rd = { exports: {} }, zt = {}, Dd = { exports: {} }, Ld = {};
var Qx;
function sM() {
  return Qx || (Qx = 1, (function(e) {
    function t(H, Q) {
      var J = H.length;
      H.push(Q);
      e: for (; 0 < J; ) {
        var I = J - 1 >>> 1, B = H[I];
        if (0 < a(B, Q)) H[I] = Q, H[J] = B, J = I;
        else break e;
      }
    }
    function r(H) {
      return H.length === 0 ? null : H[0];
    }
    function n(H) {
      if (H.length === 0) return null;
      var Q = H[0], J = H.pop();
      if (J !== Q) {
        H[0] = J;
        e: for (var I = 0, B = H.length, ue = B >>> 1; I < ue; ) {
          var pe = 2 * (I + 1) - 1, me = H[pe], Se = pe + 1, je = H[Se];
          if (0 > a(me, J)) Se < B && 0 > a(je, me) ? (H[I] = je, H[Se] = J, I = Se) : (H[I] = me, H[pe] = J, I = pe);
          else if (Se < B && 0 > a(je, J)) H[I] = je, H[Se] = J, I = Se;
          else break e;
        }
      }
      return Q;
    }
    function a(H, Q) {
      var J = H.sortIndex - Q.sortIndex;
      return J !== 0 ? J : H.id - Q.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var u = performance;
      e.unstable_now = function() {
        return u.now();
      };
    } else {
      var l = Date, c = l.now();
      e.unstable_now = function() {
        return l.now() - c;
      };
    }
    var f = [], d = [], v = 1, h = null, m = 3, x = !1, S = !1, w = !1, b = typeof setTimeout == "function" ? setTimeout : null, P = typeof clearTimeout == "function" ? clearTimeout : null, C = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function A(H) {
      for (var Q = r(d); Q !== null; ) {
        if (Q.callback === null) n(d);
        else if (Q.startTime <= H) n(d), Q.sortIndex = Q.expirationTime, t(f, Q);
        else break;
        Q = r(d);
      }
    }
    function T(H) {
      if (w = !1, A(H), !S) if (r(f) !== null) S = !0, Y(_);
      else {
        var Q = r(d);
        Q !== null && ee(T, Q.startTime - H);
      }
    }
    function _(H, Q) {
      S = !1, w && (w = !1, P(M), M = -1), x = !0;
      var J = m;
      try {
        for (A(Q), h = r(f); h !== null && (!(h.expirationTime > Q) || H && !R()); ) {
          var I = h.callback;
          if (typeof I == "function") {
            h.callback = null, m = h.priorityLevel;
            var B = I(h.expirationTime <= Q);
            Q = e.unstable_now(), typeof B == "function" ? h.callback = B : h === r(f) && n(f), A(Q);
          } else n(f);
          h = r(f);
        }
        if (h !== null) var ue = !0;
        else {
          var pe = r(d);
          pe !== null && ee(T, pe.startTime - Q), ue = !1;
        }
        return ue;
      } finally {
        h = null, m = J, x = !1;
      }
    }
    var O = !1, k = null, M = -1, N = 5, W = -1;
    function R() {
      return !(e.unstable_now() - W < N);
    }
    function q() {
      if (k !== null) {
        var H = e.unstable_now();
        W = H;
        var Q = !0;
        try {
          Q = k(!0, H);
        } finally {
          Q ? F() : (O = !1, k = null);
        }
      } else O = !1;
    }
    var F;
    if (typeof C == "function") F = function() {
      C(q);
    };
    else if (typeof MessageChannel < "u") {
      var X = new MessageChannel(), G = X.port2;
      X.port1.onmessage = q, F = function() {
        G.postMessage(null);
      };
    } else F = function() {
      b(q, 0);
    };
    function Y(H) {
      k = H, O || (O = !0, F());
    }
    function ee(H, Q) {
      M = b(function() {
        H(e.unstable_now());
      }, Q);
    }
    e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(H) {
      H.callback = null;
    }, e.unstable_continueExecution = function() {
      S || x || (S = !0, Y(_));
    }, e.unstable_forceFrameRate = function(H) {
      0 > H || 125 < H ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : N = 0 < H ? Math.floor(1e3 / H) : 5;
    }, e.unstable_getCurrentPriorityLevel = function() {
      return m;
    }, e.unstable_getFirstCallbackNode = function() {
      return r(f);
    }, e.unstable_next = function(H) {
      switch (m) {
        case 1:
        case 2:
        case 3:
          var Q = 3;
          break;
        default:
          Q = m;
      }
      var J = m;
      m = Q;
      try {
        return H();
      } finally {
        m = J;
      }
    }, e.unstable_pauseExecution = function() {
    }, e.unstable_requestPaint = function() {
    }, e.unstable_runWithPriority = function(H, Q) {
      switch (H) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          H = 3;
      }
      var J = m;
      m = H;
      try {
        return Q();
      } finally {
        m = J;
      }
    }, e.unstable_scheduleCallback = function(H, Q, J) {
      var I = e.unstable_now();
      switch (typeof J == "object" && J !== null ? (J = J.delay, J = typeof J == "number" && 0 < J ? I + J : I) : J = I, H) {
        case 1:
          var B = -1;
          break;
        case 2:
          B = 250;
          break;
        case 5:
          B = 1073741823;
          break;
        case 4:
          B = 1e4;
          break;
        default:
          B = 5e3;
      }
      return B = J + B, H = { id: v++, callback: Q, priorityLevel: H, startTime: J, expirationTime: B, sortIndex: -1 }, J > I ? (H.sortIndex = J, t(d, H), r(f) === null && H === r(d) && (w ? (P(M), M = -1) : w = !0, ee(T, J - I))) : (H.sortIndex = B, t(f, H), S || x || (S = !0, Y(_))), H;
    }, e.unstable_shouldYield = R, e.unstable_wrapCallback = function(H) {
      var Q = m;
      return function() {
        var J = m;
        m = Q;
        try {
          return H.apply(this, arguments);
        } finally {
          m = J;
        }
      };
    };
  })(Ld)), Ld;
}
var Zx;
function cM() {
  return Zx || (Zx = 1, Dd.exports = sM()), Dd.exports;
}
var Jx;
function fM() {
  if (Jx) return zt;
  Jx = 1;
  var e = HA(), t = cM();
  function r(i) {
    for (var o = "https://reactjs.org/docs/error-decoder.html?invariant=" + i, s = 1; s < arguments.length; s++) o += "&args[]=" + encodeURIComponent(arguments[s]);
    return "Minified React error #" + i + "; visit " + o + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var n = /* @__PURE__ */ new Set(), a = {};
  function u(i, o) {
    l(i, o), l(i + "Capture", o);
  }
  function l(i, o) {
    for (a[i] = o, i = 0; i < o.length; i++) n.add(o[i]);
  }
  var c = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), f = Object.prototype.hasOwnProperty, d = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, v = {}, h = {};
  function m(i) {
    return f.call(h, i) ? !0 : f.call(v, i) ? !1 : d.test(i) ? h[i] = !0 : (v[i] = !0, !1);
  }
  function x(i, o, s, p) {
    if (s !== null && s.type === 0) return !1;
    switch (typeof o) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return p ? !1 : s !== null ? !s.acceptsBooleans : (i = i.toLowerCase().slice(0, 5), i !== "data-" && i !== "aria-");
      default:
        return !1;
    }
  }
  function S(i, o, s, p) {
    if (o === null || typeof o > "u" || x(i, o, s, p)) return !0;
    if (p) return !1;
    if (s !== null) switch (s.type) {
      case 3:
        return !o;
      case 4:
        return o === !1;
      case 5:
        return isNaN(o);
      case 6:
        return isNaN(o) || 1 > o;
    }
    return !1;
  }
  function w(i, o, s, p, y, g, E) {
    this.acceptsBooleans = o === 2 || o === 3 || o === 4, this.attributeName = p, this.attributeNamespace = y, this.mustUseProperty = s, this.propertyName = i, this.type = o, this.sanitizeURL = g, this.removeEmptyString = E;
  }
  var b = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(i) {
    b[i] = new w(i, 0, !1, i, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(i) {
    var o = i[0];
    b[o] = new w(o, 1, !1, i[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(i) {
    b[i] = new w(i, 2, !1, i.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(i) {
    b[i] = new w(i, 2, !1, i, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(i) {
    b[i] = new w(i, 3, !1, i.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(i) {
    b[i] = new w(i, 3, !0, i, null, !1, !1);
  }), ["capture", "download"].forEach(function(i) {
    b[i] = new w(i, 4, !1, i, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(i) {
    b[i] = new w(i, 6, !1, i, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(i) {
    b[i] = new w(i, 5, !1, i.toLowerCase(), null, !1, !1);
  });
  var P = /[\-:]([a-z])/g;
  function C(i) {
    return i[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(i) {
    var o = i.replace(
      P,
      C
    );
    b[o] = new w(o, 1, !1, i, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(i) {
    var o = i.replace(P, C);
    b[o] = new w(o, 1, !1, i, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(i) {
    var o = i.replace(P, C);
    b[o] = new w(o, 1, !1, i, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(i) {
    b[i] = new w(i, 1, !1, i.toLowerCase(), null, !1, !1);
  }), b.xlinkHref = new w("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(i) {
    b[i] = new w(i, 1, !1, i.toLowerCase(), null, !0, !0);
  });
  function A(i, o, s, p) {
    var y = b.hasOwnProperty(o) ? b[o] : null;
    (y !== null ? y.type !== 0 : p || !(2 < o.length) || o[0] !== "o" && o[0] !== "O" || o[1] !== "n" && o[1] !== "N") && (S(o, s, y, p) && (s = null), p || y === null ? m(o) && (s === null ? i.removeAttribute(o) : i.setAttribute(o, "" + s)) : y.mustUseProperty ? i[y.propertyName] = s === null ? y.type === 3 ? !1 : "" : s : (o = y.attributeName, p = y.attributeNamespace, s === null ? i.removeAttribute(o) : (y = y.type, s = y === 3 || y === 4 && s === !0 ? "" : "" + s, p ? i.setAttributeNS(p, o, s) : i.setAttribute(o, s))));
  }
  var T = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, _ = Symbol.for("react.element"), O = Symbol.for("react.portal"), k = Symbol.for("react.fragment"), M = Symbol.for("react.strict_mode"), N = Symbol.for("react.profiler"), W = Symbol.for("react.provider"), R = Symbol.for("react.context"), q = Symbol.for("react.forward_ref"), F = Symbol.for("react.suspense"), X = Symbol.for("react.suspense_list"), G = Symbol.for("react.memo"), Y = Symbol.for("react.lazy"), ee = Symbol.for("react.offscreen"), H = Symbol.iterator;
  function Q(i) {
    return i === null || typeof i != "object" ? null : (i = H && i[H] || i["@@iterator"], typeof i == "function" ? i : null);
  }
  var J = Object.assign, I;
  function B(i) {
    if (I === void 0) try {
      throw Error();
    } catch (s) {
      var o = s.stack.trim().match(/\n( *(at )?)/);
      I = o && o[1] || "";
    }
    return `
` + I + i;
  }
  var ue = !1;
  function pe(i, o) {
    if (!i || ue) return "";
    ue = !0;
    var s = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (o) if (o = function() {
        throw Error();
      }, Object.defineProperty(o.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(o, []);
        } catch (K) {
          var p = K;
        }
        Reflect.construct(i, [], o);
      } else {
        try {
          o.call();
        } catch (K) {
          p = K;
        }
        i.call(o.prototype);
      }
      else {
        try {
          throw Error();
        } catch (K) {
          p = K;
        }
        i();
      }
    } catch (K) {
      if (K && p && typeof K.stack == "string") {
        for (var y = K.stack.split(`
`), g = p.stack.split(`
`), E = y.length - 1, j = g.length - 1; 1 <= E && 0 <= j && y[E] !== g[j]; ) j--;
        for (; 1 <= E && 0 <= j; E--, j--) if (y[E] !== g[j]) {
          if (E !== 1 || j !== 1)
            do
              if (E--, j--, 0 > j || y[E] !== g[j]) {
                var D = `
` + y[E].replace(" at new ", " at ");
                return i.displayName && D.includes("<anonymous>") && (D = D.replace("<anonymous>", i.displayName)), D;
              }
            while (1 <= E && 0 <= j);
          break;
        }
      }
    } finally {
      ue = !1, Error.prepareStackTrace = s;
    }
    return (i = i ? i.displayName || i.name : "") ? B(i) : "";
  }
  function me(i) {
    switch (i.tag) {
      case 5:
        return B(i.type);
      case 16:
        return B("Lazy");
      case 13:
        return B("Suspense");
      case 19:
        return B("SuspenseList");
      case 0:
      case 2:
      case 15:
        return i = pe(i.type, !1), i;
      case 11:
        return i = pe(i.type.render, !1), i;
      case 1:
        return i = pe(i.type, !0), i;
      default:
        return "";
    }
  }
  function Se(i) {
    if (i == null) return null;
    if (typeof i == "function") return i.displayName || i.name || null;
    if (typeof i == "string") return i;
    switch (i) {
      case k:
        return "Fragment";
      case O:
        return "Portal";
      case N:
        return "Profiler";
      case M:
        return "StrictMode";
      case F:
        return "Suspense";
      case X:
        return "SuspenseList";
    }
    if (typeof i == "object") switch (i.$$typeof) {
      case R:
        return (i.displayName || "Context") + ".Consumer";
      case W:
        return (i._context.displayName || "Context") + ".Provider";
      case q:
        var o = i.render;
        return i = i.displayName, i || (i = o.displayName || o.name || "", i = i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef"), i;
      case G:
        return o = i.displayName || null, o !== null ? o : Se(i.type) || "Memo";
      case Y:
        o = i._payload, i = i._init;
        try {
          return Se(i(o));
        } catch {
        }
    }
    return null;
  }
  function je(i) {
    var o = i.type;
    switch (i.tag) {
      case 24:
        return "Cache";
      case 9:
        return (o.displayName || "Context") + ".Consumer";
      case 10:
        return (o._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return i = o.render, i = i.displayName || i.name || "", o.displayName || (i !== "" ? "ForwardRef(" + i + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return o;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Se(o);
      case 8:
        return o === M ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof o == "function") return o.displayName || o.name || null;
        if (typeof o == "string") return o;
    }
    return null;
  }
  function Oe(i) {
    switch (typeof i) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return i;
      case "object":
        return i;
      default:
        return "";
    }
  }
  function ae(i) {
    var o = i.type;
    return (i = i.nodeName) && i.toLowerCase() === "input" && (o === "checkbox" || o === "radio");
  }
  function ye(i) {
    var o = ae(i) ? "checked" : "value", s = Object.getOwnPropertyDescriptor(i.constructor.prototype, o), p = "" + i[o];
    if (!i.hasOwnProperty(o) && typeof s < "u" && typeof s.get == "function" && typeof s.set == "function") {
      var y = s.get, g = s.set;
      return Object.defineProperty(i, o, { configurable: !0, get: function() {
        return y.call(this);
      }, set: function(E) {
        p = "" + E, g.call(this, E);
      } }), Object.defineProperty(i, o, { enumerable: s.enumerable }), { getValue: function() {
        return p;
      }, setValue: function(E) {
        p = "" + E;
      }, stopTracking: function() {
        i._valueTracker = null, delete i[o];
      } };
    }
  }
  function Pe(i) {
    i._valueTracker || (i._valueTracker = ye(i));
  }
  function ne(i) {
    if (!i) return !1;
    var o = i._valueTracker;
    if (!o) return !0;
    var s = o.getValue(), p = "";
    return i && (p = ae(i) ? i.checked ? "true" : "false" : i.value), i = p, i !== s ? (o.setValue(i), !0) : !1;
  }
  function Be(i) {
    if (i = i || (typeof document < "u" ? document : void 0), typeof i > "u") return null;
    try {
      return i.activeElement || i.body;
    } catch {
      return i.body;
    }
  }
  function Ce(i, o) {
    var s = o.checked;
    return J({}, o, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: s ?? i._wrapperState.initialChecked });
  }
  function Ze(i, o) {
    var s = o.defaultValue == null ? "" : o.defaultValue, p = o.checked != null ? o.checked : o.defaultChecked;
    s = Oe(o.value != null ? o.value : s), i._wrapperState = { initialChecked: p, initialValue: s, controlled: o.type === "checkbox" || o.type === "radio" ? o.checked != null : o.value != null };
  }
  function Je(i, o) {
    o = o.checked, o != null && A(i, "checked", o, !1);
  }
  function vt(i, o) {
    Je(i, o);
    var s = Oe(o.value), p = o.type;
    if (s != null) p === "number" ? (s === 0 && i.value === "" || i.value != s) && (i.value = "" + s) : i.value !== "" + s && (i.value = "" + s);
    else if (p === "submit" || p === "reset") {
      i.removeAttribute("value");
      return;
    }
    o.hasOwnProperty("value") ? kr(i, o.type, s) : o.hasOwnProperty("defaultValue") && kr(i, o.type, Oe(o.defaultValue)), o.checked == null && o.defaultChecked != null && (i.defaultChecked = !!o.defaultChecked);
  }
  function hr(i, o, s) {
    if (o.hasOwnProperty("value") || o.hasOwnProperty("defaultValue")) {
      var p = o.type;
      if (!(p !== "submit" && p !== "reset" || o.value !== void 0 && o.value !== null)) return;
      o = "" + i._wrapperState.initialValue, s || o === i.value || (i.value = o), i.defaultValue = o;
    }
    s = i.name, s !== "" && (i.name = ""), i.defaultChecked = !!i._wrapperState.initialChecked, s !== "" && (i.name = s);
  }
  function kr(i, o, s) {
    (o !== "number" || Be(i.ownerDocument) !== i) && (s == null ? i.defaultValue = "" + i._wrapperState.initialValue : i.defaultValue !== "" + s && (i.defaultValue = "" + s));
  }
  var jr = Array.isArray;
  function Nt(i, o, s, p) {
    if (i = i.options, o) {
      o = {};
      for (var y = 0; y < s.length; y++) o["$" + s[y]] = !0;
      for (s = 0; s < i.length; s++) y = o.hasOwnProperty("$" + i[s].value), i[s].selected !== y && (i[s].selected = y), y && p && (i[s].defaultSelected = !0);
    } else {
      for (s = "" + Oe(s), o = null, y = 0; y < i.length; y++) {
        if (i[y].value === s) {
          i[y].selected = !0, p && (i[y].defaultSelected = !0);
          return;
        }
        o !== null || i[y].disabled || (o = i[y]);
      }
      o !== null && (o.selected = !0);
    }
  }
  function vr(i, o) {
    if (o.dangerouslySetInnerHTML != null) throw Error(r(91));
    return J({}, o, { value: void 0, defaultValue: void 0, children: "" + i._wrapperState.initialValue });
  }
  function ji(i, o) {
    var s = o.value;
    if (s == null) {
      if (s = o.children, o = o.defaultValue, s != null) {
        if (o != null) throw Error(r(92));
        if (jr(s)) {
          if (1 < s.length) throw Error(r(93));
          s = s[0];
        }
        o = s;
      }
      o == null && (o = ""), s = o;
    }
    i._wrapperState = { initialValue: Oe(s) };
  }
  function Ga(i, o) {
    var s = Oe(o.value), p = Oe(o.defaultValue);
    s != null && (s = "" + s, s !== i.value && (i.value = s), o.defaultValue == null && i.defaultValue !== s && (i.defaultValue = s)), p != null && (i.defaultValue = "" + p);
  }
  function Va(i) {
    var o = i.textContent;
    o === i._wrapperState.initialValue && o !== "" && o !== null && (i.value = o);
  }
  function l0(i) {
    switch (i) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Hc(i, o) {
    return i == null || i === "http://www.w3.org/1999/xhtml" ? l0(o) : i === "http://www.w3.org/2000/svg" && o === "foreignObject" ? "http://www.w3.org/1999/xhtml" : i;
  }
  var Fu, s0 = (function(i) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(o, s, p, y) {
      MSApp.execUnsafeLocalFunction(function() {
        return i(o, s, p, y);
      });
    } : i;
  })(function(i, o) {
    if (i.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in i) i.innerHTML = o;
    else {
      for (Fu = Fu || document.createElement("div"), Fu.innerHTML = "<svg>" + o.valueOf().toString() + "</svg>", o = Fu.firstChild; i.firstChild; ) i.removeChild(i.firstChild);
      for (; o.firstChild; ) i.appendChild(o.firstChild);
    }
  });
  function Xa(i, o) {
    if (o) {
      var s = i.firstChild;
      if (s && s === i.lastChild && s.nodeType === 3) {
        s.nodeValue = o;
        return;
      }
    }
    i.textContent = o;
  }
  var Ya = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, sk = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Ya).forEach(function(i) {
    sk.forEach(function(o) {
      o = o + i.charAt(0).toUpperCase() + i.substring(1), Ya[o] = Ya[i];
    });
  });
  function c0(i, o, s) {
    return o == null || typeof o == "boolean" || o === "" ? "" : s || typeof o != "number" || o === 0 || Ya.hasOwnProperty(i) && Ya[i] ? ("" + o).trim() : o + "px";
  }
  function f0(i, o) {
    i = i.style;
    for (var s in o) if (o.hasOwnProperty(s)) {
      var p = s.indexOf("--") === 0, y = c0(s, o[s], p);
      s === "float" && (s = "cssFloat"), p ? i.setProperty(s, y) : i[s] = y;
    }
  }
  var ck = J({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Kc(i, o) {
    if (o) {
      if (ck[i] && (o.children != null || o.dangerouslySetInnerHTML != null)) throw Error(r(137, i));
      if (o.dangerouslySetInnerHTML != null) {
        if (o.children != null) throw Error(r(60));
        if (typeof o.dangerouslySetInnerHTML != "object" || !("__html" in o.dangerouslySetInnerHTML)) throw Error(r(61));
      }
      if (o.style != null && typeof o.style != "object") throw Error(r(62));
    }
  }
  function Gc(i, o) {
    if (i.indexOf("-") === -1) return typeof o.is == "string";
    switch (i) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Vc = null;
  function Xc(i) {
    return i = i.target || i.srcElement || window, i.correspondingUseElement && (i = i.correspondingUseElement), i.nodeType === 3 ? i.parentNode : i;
  }
  var Yc = null, Mi = null, Ii = null;
  function d0(i) {
    if (i = bo(i)) {
      if (typeof Yc != "function") throw Error(r(280));
      var o = i.stateNode;
      o && (o = fl(o), Yc(i.stateNode, i.type, o));
    }
  }
  function p0(i) {
    Mi ? Ii ? Ii.push(i) : Ii = [i] : Mi = i;
  }
  function h0() {
    if (Mi) {
      var i = Mi, o = Ii;
      if (Ii = Mi = null, d0(i), o) for (i = 0; i < o.length; i++) d0(o[i]);
    }
  }
  function v0(i, o) {
    return i(o);
  }
  function y0() {
  }
  var Qc = !1;
  function m0(i, o, s) {
    if (Qc) return i(o, s);
    Qc = !0;
    try {
      return v0(i, o, s);
    } finally {
      Qc = !1, (Mi !== null || Ii !== null) && (y0(), h0());
    }
  }
  function Qa(i, o) {
    var s = i.stateNode;
    if (s === null) return null;
    var p = fl(s);
    if (p === null) return null;
    s = p[o];
    e: switch (o) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (p = !p.disabled) || (i = i.type, p = !(i === "button" || i === "input" || i === "select" || i === "textarea")), i = !p;
        break e;
      default:
        i = !1;
    }
    if (i) return null;
    if (s && typeof s != "function") throw Error(r(231, o, typeof s));
    return s;
  }
  var Zc = !1;
  if (c) try {
    var Za = {};
    Object.defineProperty(Za, "passive", { get: function() {
      Zc = !0;
    } }), window.addEventListener("test", Za, Za), window.removeEventListener("test", Za, Za);
  } catch {
    Zc = !1;
  }
  function fk(i, o, s, p, y, g, E, j, D) {
    var K = Array.prototype.slice.call(arguments, 3);
    try {
      o.apply(s, K);
    } catch (re) {
      this.onError(re);
    }
  }
  var Ja = !1, Uu = null, Wu = !1, Jc = null, dk = { onError: function(i) {
    Ja = !0, Uu = i;
  } };
  function pk(i, o, s, p, y, g, E, j, D) {
    Ja = !1, Uu = null, fk.apply(dk, arguments);
  }
  function hk(i, o, s, p, y, g, E, j, D) {
    if (pk.apply(this, arguments), Ja) {
      if (Ja) {
        var K = Uu;
        Ja = !1, Uu = null;
      } else throw Error(r(198));
      Wu || (Wu = !0, Jc = K);
    }
  }
  function Xn(i) {
    var o = i, s = i;
    if (i.alternate) for (; o.return; ) o = o.return;
    else {
      i = o;
      do
        o = i, (o.flags & 4098) !== 0 && (s = o.return), i = o.return;
      while (i);
    }
    return o.tag === 3 ? s : null;
  }
  function g0(i) {
    if (i.tag === 13) {
      var o = i.memoizedState;
      if (o === null && (i = i.alternate, i !== null && (o = i.memoizedState)), o !== null) return o.dehydrated;
    }
    return null;
  }
  function b0(i) {
    if (Xn(i) !== i) throw Error(r(188));
  }
  function vk(i) {
    var o = i.alternate;
    if (!o) {
      if (o = Xn(i), o === null) throw Error(r(188));
      return o !== i ? null : i;
    }
    for (var s = i, p = o; ; ) {
      var y = s.return;
      if (y === null) break;
      var g = y.alternate;
      if (g === null) {
        if (p = y.return, p !== null) {
          s = p;
          continue;
        }
        break;
      }
      if (y.child === g.child) {
        for (g = y.child; g; ) {
          if (g === s) return b0(y), i;
          if (g === p) return b0(y), o;
          g = g.sibling;
        }
        throw Error(r(188));
      }
      if (s.return !== p.return) s = y, p = g;
      else {
        for (var E = !1, j = y.child; j; ) {
          if (j === s) {
            E = !0, s = y, p = g;
            break;
          }
          if (j === p) {
            E = !0, p = y, s = g;
            break;
          }
          j = j.sibling;
        }
        if (!E) {
          for (j = g.child; j; ) {
            if (j === s) {
              E = !0, s = g, p = y;
              break;
            }
            if (j === p) {
              E = !0, p = g, s = y;
              break;
            }
            j = j.sibling;
          }
          if (!E) throw Error(r(189));
        }
      }
      if (s.alternate !== p) throw Error(r(190));
    }
    if (s.tag !== 3) throw Error(r(188));
    return s.stateNode.current === s ? i : o;
  }
  function x0(i) {
    return i = vk(i), i !== null ? w0(i) : null;
  }
  function w0(i) {
    if (i.tag === 5 || i.tag === 6) return i;
    for (i = i.child; i !== null; ) {
      var o = w0(i);
      if (o !== null) return o;
      i = i.sibling;
    }
    return null;
  }
  var S0 = t.unstable_scheduleCallback, _0 = t.unstable_cancelCallback, yk = t.unstable_shouldYield, mk = t.unstable_requestPaint, rt = t.unstable_now, gk = t.unstable_getCurrentPriorityLevel, ef = t.unstable_ImmediatePriority, O0 = t.unstable_UserBlockingPriority, Hu = t.unstable_NormalPriority, bk = t.unstable_LowPriority, P0 = t.unstable_IdlePriority, Ku = null, Mr = null;
  function xk(i) {
    if (Mr && typeof Mr.onCommitFiberRoot == "function") try {
      Mr.onCommitFiberRoot(Ku, i, void 0, (i.current.flags & 128) === 128);
    } catch {
    }
  }
  var yr = Math.clz32 ? Math.clz32 : _k, wk = Math.log, Sk = Math.LN2;
  function _k(i) {
    return i >>>= 0, i === 0 ? 32 : 31 - (wk(i) / Sk | 0) | 0;
  }
  var Gu = 64, Vu = 4194304;
  function eo(i) {
    switch (i & -i) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return i & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return i & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return i;
    }
  }
  function Xu(i, o) {
    var s = i.pendingLanes;
    if (s === 0) return 0;
    var p = 0, y = i.suspendedLanes, g = i.pingedLanes, E = s & 268435455;
    if (E !== 0) {
      var j = E & ~y;
      j !== 0 ? p = eo(j) : (g &= E, g !== 0 && (p = eo(g)));
    } else E = s & ~y, E !== 0 ? p = eo(E) : g !== 0 && (p = eo(g));
    if (p === 0) return 0;
    if (o !== 0 && o !== p && (o & y) === 0 && (y = p & -p, g = o & -o, y >= g || y === 16 && (g & 4194240) !== 0)) return o;
    if ((p & 4) !== 0 && (p |= s & 16), o = i.entangledLanes, o !== 0) for (i = i.entanglements, o &= p; 0 < o; ) s = 31 - yr(o), y = 1 << s, p |= i[s], o &= ~y;
    return p;
  }
  function Ok(i, o) {
    switch (i) {
      case 1:
      case 2:
      case 4:
        return o + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return o + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Pk(i, o) {
    for (var s = i.suspendedLanes, p = i.pingedLanes, y = i.expirationTimes, g = i.pendingLanes; 0 < g; ) {
      var E = 31 - yr(g), j = 1 << E, D = y[E];
      D === -1 ? ((j & s) === 0 || (j & p) !== 0) && (y[E] = Ok(j, o)) : D <= o && (i.expiredLanes |= j), g &= ~j;
    }
  }
  function tf(i) {
    return i = i.pendingLanes & -1073741825, i !== 0 ? i : i & 1073741824 ? 1073741824 : 0;
  }
  function A0() {
    var i = Gu;
    return Gu <<= 1, (Gu & 4194240) === 0 && (Gu = 64), i;
  }
  function rf(i) {
    for (var o = [], s = 0; 31 > s; s++) o.push(i);
    return o;
  }
  function to(i, o, s) {
    i.pendingLanes |= o, o !== 536870912 && (i.suspendedLanes = 0, i.pingedLanes = 0), i = i.eventTimes, o = 31 - yr(o), i[o] = s;
  }
  function Ak(i, o) {
    var s = i.pendingLanes & ~o;
    i.pendingLanes = o, i.suspendedLanes = 0, i.pingedLanes = 0, i.expiredLanes &= o, i.mutableReadLanes &= o, i.entangledLanes &= o, o = i.entanglements;
    var p = i.eventTimes;
    for (i = i.expirationTimes; 0 < s; ) {
      var y = 31 - yr(s), g = 1 << y;
      o[y] = 0, p[y] = -1, i[y] = -1, s &= ~g;
    }
  }
  function nf(i, o) {
    var s = i.entangledLanes |= o;
    for (i = i.entanglements; s; ) {
      var p = 31 - yr(s), y = 1 << p;
      y & o | i[p] & o && (i[p] |= o), s &= ~y;
    }
  }
  var Le = 0;
  function E0(i) {
    return i &= -i, 1 < i ? 4 < i ? (i & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var T0, af, C0, k0, j0, of = !1, Yu = [], mn = null, gn = null, bn = null, ro = /* @__PURE__ */ new Map(), no = /* @__PURE__ */ new Map(), xn = [], Ek = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function M0(i, o) {
    switch (i) {
      case "focusin":
      case "focusout":
        mn = null;
        break;
      case "dragenter":
      case "dragleave":
        gn = null;
        break;
      case "mouseover":
      case "mouseout":
        bn = null;
        break;
      case "pointerover":
      case "pointerout":
        ro.delete(o.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        no.delete(o.pointerId);
    }
  }
  function io(i, o, s, p, y, g) {
    return i === null || i.nativeEvent !== g ? (i = { blockedOn: o, domEventName: s, eventSystemFlags: p, nativeEvent: g, targetContainers: [y] }, o !== null && (o = bo(o), o !== null && af(o)), i) : (i.eventSystemFlags |= p, o = i.targetContainers, y !== null && o.indexOf(y) === -1 && o.push(y), i);
  }
  function Tk(i, o, s, p, y) {
    switch (o) {
      case "focusin":
        return mn = io(mn, i, o, s, p, y), !0;
      case "dragenter":
        return gn = io(gn, i, o, s, p, y), !0;
      case "mouseover":
        return bn = io(bn, i, o, s, p, y), !0;
      case "pointerover":
        var g = y.pointerId;
        return ro.set(g, io(ro.get(g) || null, i, o, s, p, y)), !0;
      case "gotpointercapture":
        return g = y.pointerId, no.set(g, io(no.get(g) || null, i, o, s, p, y)), !0;
    }
    return !1;
  }
  function I0(i) {
    var o = Yn(i.target);
    if (o !== null) {
      var s = Xn(o);
      if (s !== null) {
        if (o = s.tag, o === 13) {
          if (o = g0(s), o !== null) {
            i.blockedOn = o, j0(i.priority, function() {
              C0(s);
            });
            return;
          }
        } else if (o === 3 && s.stateNode.current.memoizedState.isDehydrated) {
          i.blockedOn = s.tag === 3 ? s.stateNode.containerInfo : null;
          return;
        }
      }
    }
    i.blockedOn = null;
  }
  function Qu(i) {
    if (i.blockedOn !== null) return !1;
    for (var o = i.targetContainers; 0 < o.length; ) {
      var s = lf(i.domEventName, i.eventSystemFlags, o[0], i.nativeEvent);
      if (s === null) {
        s = i.nativeEvent;
        var p = new s.constructor(s.type, s);
        Vc = p, s.target.dispatchEvent(p), Vc = null;
      } else return o = bo(s), o !== null && af(o), i.blockedOn = s, !1;
      o.shift();
    }
    return !0;
  }
  function $0(i, o, s) {
    Qu(i) && s.delete(o);
  }
  function Ck() {
    of = !1, mn !== null && Qu(mn) && (mn = null), gn !== null && Qu(gn) && (gn = null), bn !== null && Qu(bn) && (bn = null), ro.forEach($0), no.forEach($0);
  }
  function ao(i, o) {
    i.blockedOn === o && (i.blockedOn = null, of || (of = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, Ck)));
  }
  function oo(i) {
    function o(y) {
      return ao(y, i);
    }
    if (0 < Yu.length) {
      ao(Yu[0], i);
      for (var s = 1; s < Yu.length; s++) {
        var p = Yu[s];
        p.blockedOn === i && (p.blockedOn = null);
      }
    }
    for (mn !== null && ao(mn, i), gn !== null && ao(gn, i), bn !== null && ao(bn, i), ro.forEach(o), no.forEach(o), s = 0; s < xn.length; s++) p = xn[s], p.blockedOn === i && (p.blockedOn = null);
    for (; 0 < xn.length && (s = xn[0], s.blockedOn === null); ) I0(s), s.blockedOn === null && xn.shift();
  }
  var $i = T.ReactCurrentBatchConfig, Zu = !0;
  function kk(i, o, s, p) {
    var y = Le, g = $i.transition;
    $i.transition = null;
    try {
      Le = 1, uf(i, o, s, p);
    } finally {
      Le = y, $i.transition = g;
    }
  }
  function jk(i, o, s, p) {
    var y = Le, g = $i.transition;
    $i.transition = null;
    try {
      Le = 4, uf(i, o, s, p);
    } finally {
      Le = y, $i.transition = g;
    }
  }
  function uf(i, o, s, p) {
    if (Zu) {
      var y = lf(i, o, s, p);
      if (y === null) Pf(i, o, p, Ju, s), M0(i, p);
      else if (Tk(y, i, o, s, p)) p.stopPropagation();
      else if (M0(i, p), o & 4 && -1 < Ek.indexOf(i)) {
        for (; y !== null; ) {
          var g = bo(y);
          if (g !== null && T0(g), g = lf(i, o, s, p), g === null && Pf(i, o, p, Ju, s), g === y) break;
          y = g;
        }
        y !== null && p.stopPropagation();
      } else Pf(i, o, p, null, s);
    }
  }
  var Ju = null;
  function lf(i, o, s, p) {
    if (Ju = null, i = Xc(p), i = Yn(i), i !== null) if (o = Xn(i), o === null) i = null;
    else if (s = o.tag, s === 13) {
      if (i = g0(o), i !== null) return i;
      i = null;
    } else if (s === 3) {
      if (o.stateNode.current.memoizedState.isDehydrated) return o.tag === 3 ? o.stateNode.containerInfo : null;
      i = null;
    } else o !== i && (i = null);
    return Ju = i, null;
  }
  function N0(i) {
    switch (i) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (gk()) {
          case ef:
            return 1;
          case O0:
            return 4;
          case Hu:
          case bk:
            return 16;
          case P0:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var wn = null, sf = null, el = null;
  function R0() {
    if (el) return el;
    var i, o = sf, s = o.length, p, y = "value" in wn ? wn.value : wn.textContent, g = y.length;
    for (i = 0; i < s && o[i] === y[i]; i++) ;
    var E = s - i;
    for (p = 1; p <= E && o[s - p] === y[g - p]; p++) ;
    return el = y.slice(i, 1 < p ? 1 - p : void 0);
  }
  function tl(i) {
    var o = i.keyCode;
    return "charCode" in i ? (i = i.charCode, i === 0 && o === 13 && (i = 13)) : i = o, i === 10 && (i = 13), 32 <= i || i === 13 ? i : 0;
  }
  function rl() {
    return !0;
  }
  function D0() {
    return !1;
  }
  function Ht(i) {
    function o(s, p, y, g, E) {
      this._reactName = s, this._targetInst = y, this.type = p, this.nativeEvent = g, this.target = E, this.currentTarget = null;
      for (var j in i) i.hasOwnProperty(j) && (s = i[j], this[j] = s ? s(g) : g[j]);
      return this.isDefaultPrevented = (g.defaultPrevented != null ? g.defaultPrevented : g.returnValue === !1) ? rl : D0, this.isPropagationStopped = D0, this;
    }
    return J(o.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var s = this.nativeEvent;
      s && (s.preventDefault ? s.preventDefault() : typeof s.returnValue != "unknown" && (s.returnValue = !1), this.isDefaultPrevented = rl);
    }, stopPropagation: function() {
      var s = this.nativeEvent;
      s && (s.stopPropagation ? s.stopPropagation() : typeof s.cancelBubble != "unknown" && (s.cancelBubble = !0), this.isPropagationStopped = rl);
    }, persist: function() {
    }, isPersistent: rl }), o;
  }
  var Ni = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(i) {
    return i.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, cf = Ht(Ni), uo = J({}, Ni, { view: 0, detail: 0 }), Mk = Ht(uo), ff, df, lo, nl = J({}, uo, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: hf, button: 0, buttons: 0, relatedTarget: function(i) {
    return i.relatedTarget === void 0 ? i.fromElement === i.srcElement ? i.toElement : i.fromElement : i.relatedTarget;
  }, movementX: function(i) {
    return "movementX" in i ? i.movementX : (i !== lo && (lo && i.type === "mousemove" ? (ff = i.screenX - lo.screenX, df = i.screenY - lo.screenY) : df = ff = 0, lo = i), ff);
  }, movementY: function(i) {
    return "movementY" in i ? i.movementY : df;
  } }), L0 = Ht(nl), Ik = J({}, nl, { dataTransfer: 0 }), $k = Ht(Ik), Nk = J({}, uo, { relatedTarget: 0 }), pf = Ht(Nk), Rk = J({}, Ni, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Dk = Ht(Rk), Lk = J({}, Ni, { clipboardData: function(i) {
    return "clipboardData" in i ? i.clipboardData : window.clipboardData;
  } }), qk = Ht(Lk), Bk = J({}, Ni, { data: 0 }), q0 = Ht(Bk), zk = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Fk = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Uk = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Wk(i) {
    var o = this.nativeEvent;
    return o.getModifierState ? o.getModifierState(i) : (i = Uk[i]) ? !!o[i] : !1;
  }
  function hf() {
    return Wk;
  }
  var Hk = J({}, uo, { key: function(i) {
    if (i.key) {
      var o = zk[i.key] || i.key;
      if (o !== "Unidentified") return o;
    }
    return i.type === "keypress" ? (i = tl(i), i === 13 ? "Enter" : String.fromCharCode(i)) : i.type === "keydown" || i.type === "keyup" ? Fk[i.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: hf, charCode: function(i) {
    return i.type === "keypress" ? tl(i) : 0;
  }, keyCode: function(i) {
    return i.type === "keydown" || i.type === "keyup" ? i.keyCode : 0;
  }, which: function(i) {
    return i.type === "keypress" ? tl(i) : i.type === "keydown" || i.type === "keyup" ? i.keyCode : 0;
  } }), Kk = Ht(Hk), Gk = J({}, nl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), B0 = Ht(Gk), Vk = J({}, uo, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: hf }), Xk = Ht(Vk), Yk = J({}, Ni, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Qk = Ht(Yk), Zk = J({}, nl, {
    deltaX: function(i) {
      return "deltaX" in i ? i.deltaX : "wheelDeltaX" in i ? -i.wheelDeltaX : 0;
    },
    deltaY: function(i) {
      return "deltaY" in i ? i.deltaY : "wheelDeltaY" in i ? -i.wheelDeltaY : "wheelDelta" in i ? -i.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Jk = Ht(Zk), ej = [9, 13, 27, 32], vf = c && "CompositionEvent" in window, so = null;
  c && "documentMode" in document && (so = document.documentMode);
  var tj = c && "TextEvent" in window && !so, z0 = c && (!vf || so && 8 < so && 11 >= so), F0 = " ", U0 = !1;
  function W0(i, o) {
    switch (i) {
      case "keyup":
        return ej.indexOf(o.keyCode) !== -1;
      case "keydown":
        return o.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function H0(i) {
    return i = i.detail, typeof i == "object" && "data" in i ? i.data : null;
  }
  var Ri = !1;
  function rj(i, o) {
    switch (i) {
      case "compositionend":
        return H0(o);
      case "keypress":
        return o.which !== 32 ? null : (U0 = !0, F0);
      case "textInput":
        return i = o.data, i === F0 && U0 ? null : i;
      default:
        return null;
    }
  }
  function nj(i, o) {
    if (Ri) return i === "compositionend" || !vf && W0(i, o) ? (i = R0(), el = sf = wn = null, Ri = !1, i) : null;
    switch (i) {
      case "paste":
        return null;
      case "keypress":
        if (!(o.ctrlKey || o.altKey || o.metaKey) || o.ctrlKey && o.altKey) {
          if (o.char && 1 < o.char.length) return o.char;
          if (o.which) return String.fromCharCode(o.which);
        }
        return null;
      case "compositionend":
        return z0 && o.locale !== "ko" ? null : o.data;
      default:
        return null;
    }
  }
  var ij = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function K0(i) {
    var o = i && i.nodeName && i.nodeName.toLowerCase();
    return o === "input" ? !!ij[i.type] : o === "textarea";
  }
  function G0(i, o, s, p) {
    p0(p), o = ll(o, "onChange"), 0 < o.length && (s = new cf("onChange", "change", null, s, p), i.push({ event: s, listeners: o }));
  }
  var co = null, fo = null;
  function aj(i) {
    fb(i, 0);
  }
  function il(i) {
    var o = zi(i);
    if (ne(o)) return i;
  }
  function oj(i, o) {
    if (i === "change") return o;
  }
  var V0 = !1;
  if (c) {
    var yf;
    if (c) {
      var mf = "oninput" in document;
      if (!mf) {
        var X0 = document.createElement("div");
        X0.setAttribute("oninput", "return;"), mf = typeof X0.oninput == "function";
      }
      yf = mf;
    } else yf = !1;
    V0 = yf && (!document.documentMode || 9 < document.documentMode);
  }
  function Y0() {
    co && (co.detachEvent("onpropertychange", Q0), fo = co = null);
  }
  function Q0(i) {
    if (i.propertyName === "value" && il(fo)) {
      var o = [];
      G0(o, fo, i, Xc(i)), m0(aj, o);
    }
  }
  function uj(i, o, s) {
    i === "focusin" ? (Y0(), co = o, fo = s, co.attachEvent("onpropertychange", Q0)) : i === "focusout" && Y0();
  }
  function lj(i) {
    if (i === "selectionchange" || i === "keyup" || i === "keydown") return il(fo);
  }
  function sj(i, o) {
    if (i === "click") return il(o);
  }
  function cj(i, o) {
    if (i === "input" || i === "change") return il(o);
  }
  function fj(i, o) {
    return i === o && (i !== 0 || 1 / i === 1 / o) || i !== i && o !== o;
  }
  var mr = typeof Object.is == "function" ? Object.is : fj;
  function po(i, o) {
    if (mr(i, o)) return !0;
    if (typeof i != "object" || i === null || typeof o != "object" || o === null) return !1;
    var s = Object.keys(i), p = Object.keys(o);
    if (s.length !== p.length) return !1;
    for (p = 0; p < s.length; p++) {
      var y = s[p];
      if (!f.call(o, y) || !mr(i[y], o[y])) return !1;
    }
    return !0;
  }
  function Z0(i) {
    for (; i && i.firstChild; ) i = i.firstChild;
    return i;
  }
  function J0(i, o) {
    var s = Z0(i);
    i = 0;
    for (var p; s; ) {
      if (s.nodeType === 3) {
        if (p = i + s.textContent.length, i <= o && p >= o) return { node: s, offset: o - i };
        i = p;
      }
      e: {
        for (; s; ) {
          if (s.nextSibling) {
            s = s.nextSibling;
            break e;
          }
          s = s.parentNode;
        }
        s = void 0;
      }
      s = Z0(s);
    }
  }
  function eb(i, o) {
    return i && o ? i === o ? !0 : i && i.nodeType === 3 ? !1 : o && o.nodeType === 3 ? eb(i, o.parentNode) : "contains" in i ? i.contains(o) : i.compareDocumentPosition ? !!(i.compareDocumentPosition(o) & 16) : !1 : !1;
  }
  function tb() {
    for (var i = window, o = Be(); o instanceof i.HTMLIFrameElement; ) {
      try {
        var s = typeof o.contentWindow.location.href == "string";
      } catch {
        s = !1;
      }
      if (s) i = o.contentWindow;
      else break;
      o = Be(i.document);
    }
    return o;
  }
  function gf(i) {
    var o = i && i.nodeName && i.nodeName.toLowerCase();
    return o && (o === "input" && (i.type === "text" || i.type === "search" || i.type === "tel" || i.type === "url" || i.type === "password") || o === "textarea" || i.contentEditable === "true");
  }
  function dj(i) {
    var o = tb(), s = i.focusedElem, p = i.selectionRange;
    if (o !== s && s && s.ownerDocument && eb(s.ownerDocument.documentElement, s)) {
      if (p !== null && gf(s)) {
        if (o = p.start, i = p.end, i === void 0 && (i = o), "selectionStart" in s) s.selectionStart = o, s.selectionEnd = Math.min(i, s.value.length);
        else if (i = (o = s.ownerDocument || document) && o.defaultView || window, i.getSelection) {
          i = i.getSelection();
          var y = s.textContent.length, g = Math.min(p.start, y);
          p = p.end === void 0 ? g : Math.min(p.end, y), !i.extend && g > p && (y = p, p = g, g = y), y = J0(s, g);
          var E = J0(
            s,
            p
          );
          y && E && (i.rangeCount !== 1 || i.anchorNode !== y.node || i.anchorOffset !== y.offset || i.focusNode !== E.node || i.focusOffset !== E.offset) && (o = o.createRange(), o.setStart(y.node, y.offset), i.removeAllRanges(), g > p ? (i.addRange(o), i.extend(E.node, E.offset)) : (o.setEnd(E.node, E.offset), i.addRange(o)));
        }
      }
      for (o = [], i = s; i = i.parentNode; ) i.nodeType === 1 && o.push({ element: i, left: i.scrollLeft, top: i.scrollTop });
      for (typeof s.focus == "function" && s.focus(), s = 0; s < o.length; s++) i = o[s], i.element.scrollLeft = i.left, i.element.scrollTop = i.top;
    }
  }
  var pj = c && "documentMode" in document && 11 >= document.documentMode, Di = null, bf = null, ho = null, xf = !1;
  function rb(i, o, s) {
    var p = s.window === s ? s.document : s.nodeType === 9 ? s : s.ownerDocument;
    xf || Di == null || Di !== Be(p) || (p = Di, "selectionStart" in p && gf(p) ? p = { start: p.selectionStart, end: p.selectionEnd } : (p = (p.ownerDocument && p.ownerDocument.defaultView || window).getSelection(), p = { anchorNode: p.anchorNode, anchorOffset: p.anchorOffset, focusNode: p.focusNode, focusOffset: p.focusOffset }), ho && po(ho, p) || (ho = p, p = ll(bf, "onSelect"), 0 < p.length && (o = new cf("onSelect", "select", null, o, s), i.push({ event: o, listeners: p }), o.target = Di)));
  }
  function al(i, o) {
    var s = {};
    return s[i.toLowerCase()] = o.toLowerCase(), s["Webkit" + i] = "webkit" + o, s["Moz" + i] = "moz" + o, s;
  }
  var Li = { animationend: al("Animation", "AnimationEnd"), animationiteration: al("Animation", "AnimationIteration"), animationstart: al("Animation", "AnimationStart"), transitionend: al("Transition", "TransitionEnd") }, wf = {}, nb = {};
  c && (nb = document.createElement("div").style, "AnimationEvent" in window || (delete Li.animationend.animation, delete Li.animationiteration.animation, delete Li.animationstart.animation), "TransitionEvent" in window || delete Li.transitionend.transition);
  function ol(i) {
    if (wf[i]) return wf[i];
    if (!Li[i]) return i;
    var o = Li[i], s;
    for (s in o) if (o.hasOwnProperty(s) && s in nb) return wf[i] = o[s];
    return i;
  }
  var ib = ol("animationend"), ab = ol("animationiteration"), ob = ol("animationstart"), ub = ol("transitionend"), lb = /* @__PURE__ */ new Map(), sb = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Sn(i, o) {
    lb.set(i, o), u(o, [i]);
  }
  for (var Sf = 0; Sf < sb.length; Sf++) {
    var _f = sb[Sf], hj = _f.toLowerCase(), vj = _f[0].toUpperCase() + _f.slice(1);
    Sn(hj, "on" + vj);
  }
  Sn(ib, "onAnimationEnd"), Sn(ab, "onAnimationIteration"), Sn(ob, "onAnimationStart"), Sn("dblclick", "onDoubleClick"), Sn("focusin", "onFocus"), Sn("focusout", "onBlur"), Sn(ub, "onTransitionEnd"), l("onMouseEnter", ["mouseout", "mouseover"]), l("onMouseLeave", ["mouseout", "mouseover"]), l("onPointerEnter", ["pointerout", "pointerover"]), l("onPointerLeave", ["pointerout", "pointerover"]), u("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), u("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), u("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), u("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), u("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), u("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var vo = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), yj = new Set("cancel close invalid load scroll toggle".split(" ").concat(vo));
  function cb(i, o, s) {
    var p = i.type || "unknown-event";
    i.currentTarget = s, hk(p, o, void 0, i), i.currentTarget = null;
  }
  function fb(i, o) {
    o = (o & 4) !== 0;
    for (var s = 0; s < i.length; s++) {
      var p = i[s], y = p.event;
      p = p.listeners;
      e: {
        var g = void 0;
        if (o) for (var E = p.length - 1; 0 <= E; E--) {
          var j = p[E], D = j.instance, K = j.currentTarget;
          if (j = j.listener, D !== g && y.isPropagationStopped()) break e;
          cb(y, j, K), g = D;
        }
        else for (E = 0; E < p.length; E++) {
          if (j = p[E], D = j.instance, K = j.currentTarget, j = j.listener, D !== g && y.isPropagationStopped()) break e;
          cb(y, j, K), g = D;
        }
      }
    }
    if (Wu) throw i = Jc, Wu = !1, Jc = null, i;
  }
  function He(i, o) {
    var s = o[jf];
    s === void 0 && (s = o[jf] = /* @__PURE__ */ new Set());
    var p = i + "__bubble";
    s.has(p) || (db(o, i, 2, !1), s.add(p));
  }
  function Of(i, o, s) {
    var p = 0;
    o && (p |= 4), db(s, i, p, o);
  }
  var ul = "_reactListening" + Math.random().toString(36).slice(2);
  function yo(i) {
    if (!i[ul]) {
      i[ul] = !0, n.forEach(function(s) {
        s !== "selectionchange" && (yj.has(s) || Of(s, !1, i), Of(s, !0, i));
      });
      var o = i.nodeType === 9 ? i : i.ownerDocument;
      o === null || o[ul] || (o[ul] = !0, Of("selectionchange", !1, o));
    }
  }
  function db(i, o, s, p) {
    switch (N0(o)) {
      case 1:
        var y = kk;
        break;
      case 4:
        y = jk;
        break;
      default:
        y = uf;
    }
    s = y.bind(null, o, s, i), y = void 0, !Zc || o !== "touchstart" && o !== "touchmove" && o !== "wheel" || (y = !0), p ? y !== void 0 ? i.addEventListener(o, s, { capture: !0, passive: y }) : i.addEventListener(o, s, !0) : y !== void 0 ? i.addEventListener(o, s, { passive: y }) : i.addEventListener(o, s, !1);
  }
  function Pf(i, o, s, p, y) {
    var g = p;
    if ((o & 1) === 0 && (o & 2) === 0 && p !== null) e: for (; ; ) {
      if (p === null) return;
      var E = p.tag;
      if (E === 3 || E === 4) {
        var j = p.stateNode.containerInfo;
        if (j === y || j.nodeType === 8 && j.parentNode === y) break;
        if (E === 4) for (E = p.return; E !== null; ) {
          var D = E.tag;
          if ((D === 3 || D === 4) && (D = E.stateNode.containerInfo, D === y || D.nodeType === 8 && D.parentNode === y)) return;
          E = E.return;
        }
        for (; j !== null; ) {
          if (E = Yn(j), E === null) return;
          if (D = E.tag, D === 5 || D === 6) {
            p = g = E;
            continue e;
          }
          j = j.parentNode;
        }
      }
      p = p.return;
    }
    m0(function() {
      var K = g, re = Xc(s), ie = [];
      e: {
        var te = lb.get(i);
        if (te !== void 0) {
          var se = cf, de = i;
          switch (i) {
            case "keypress":
              if (tl(s) === 0) break e;
            case "keydown":
            case "keyup":
              se = Kk;
              break;
            case "focusin":
              de = "focus", se = pf;
              break;
            case "focusout":
              de = "blur", se = pf;
              break;
            case "beforeblur":
            case "afterblur":
              se = pf;
              break;
            case "click":
              if (s.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              se = L0;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              se = $k;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              se = Xk;
              break;
            case ib:
            case ab:
            case ob:
              se = Dk;
              break;
            case ub:
              se = Qk;
              break;
            case "scroll":
              se = Mk;
              break;
            case "wheel":
              se = Jk;
              break;
            case "copy":
            case "cut":
            case "paste":
              se = qk;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              se = B0;
          }
          var he = (o & 4) !== 0, nt = !he && i === "scroll", z = he ? te !== null ? te + "Capture" : null : te;
          he = [];
          for (var L = K, U; L !== null; ) {
            U = L;
            var oe = U.stateNode;
            if (U.tag === 5 && oe !== null && (U = oe, z !== null && (oe = Qa(L, z), oe != null && he.push(mo(L, oe, U)))), nt) break;
            L = L.return;
          }
          0 < he.length && (te = new se(te, de, null, s, re), ie.push({ event: te, listeners: he }));
        }
      }
      if ((o & 7) === 0) {
        e: {
          if (te = i === "mouseover" || i === "pointerover", se = i === "mouseout" || i === "pointerout", te && s !== Vc && (de = s.relatedTarget || s.fromElement) && (Yn(de) || de[Vr])) break e;
          if ((se || te) && (te = re.window === re ? re : (te = re.ownerDocument) ? te.defaultView || te.parentWindow : window, se ? (de = s.relatedTarget || s.toElement, se = K, de = de ? Yn(de) : null, de !== null && (nt = Xn(de), de !== nt || de.tag !== 5 && de.tag !== 6) && (de = null)) : (se = null, de = K), se !== de)) {
            if (he = L0, oe = "onMouseLeave", z = "onMouseEnter", L = "mouse", (i === "pointerout" || i === "pointerover") && (he = B0, oe = "onPointerLeave", z = "onPointerEnter", L = "pointer"), nt = se == null ? te : zi(se), U = de == null ? te : zi(de), te = new he(oe, L + "leave", se, s, re), te.target = nt, te.relatedTarget = U, oe = null, Yn(re) === K && (he = new he(z, L + "enter", de, s, re), he.target = U, he.relatedTarget = nt, oe = he), nt = oe, se && de) t: {
              for (he = se, z = de, L = 0, U = he; U; U = qi(U)) L++;
              for (U = 0, oe = z; oe; oe = qi(oe)) U++;
              for (; 0 < L - U; ) he = qi(he), L--;
              for (; 0 < U - L; ) z = qi(z), U--;
              for (; L--; ) {
                if (he === z || z !== null && he === z.alternate) break t;
                he = qi(he), z = qi(z);
              }
              he = null;
            }
            else he = null;
            se !== null && pb(ie, te, se, he, !1), de !== null && nt !== null && pb(ie, nt, de, he, !0);
          }
        }
        e: {
          if (te = K ? zi(K) : window, se = te.nodeName && te.nodeName.toLowerCase(), se === "select" || se === "input" && te.type === "file") var ve = oj;
          else if (K0(te)) if (V0) ve = cj;
          else {
            ve = lj;
            var ge = uj;
          }
          else (se = te.nodeName) && se.toLowerCase() === "input" && (te.type === "checkbox" || te.type === "radio") && (ve = sj);
          if (ve && (ve = ve(i, K))) {
            G0(ie, ve, s, re);
            break e;
          }
          ge && ge(i, te, K), i === "focusout" && (ge = te._wrapperState) && ge.controlled && te.type === "number" && kr(te, "number", te.value);
        }
        switch (ge = K ? zi(K) : window, i) {
          case "focusin":
            (K0(ge) || ge.contentEditable === "true") && (Di = ge, bf = K, ho = null);
            break;
          case "focusout":
            ho = bf = Di = null;
            break;
          case "mousedown":
            xf = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            xf = !1, rb(ie, s, re);
            break;
          case "selectionchange":
            if (pj) break;
          case "keydown":
          case "keyup":
            rb(ie, s, re);
        }
        var be;
        if (vf) e: {
          switch (i) {
            case "compositionstart":
              var we = "onCompositionStart";
              break e;
            case "compositionend":
              we = "onCompositionEnd";
              break e;
            case "compositionupdate":
              we = "onCompositionUpdate";
              break e;
          }
          we = void 0;
        }
        else Ri ? W0(i, s) && (we = "onCompositionEnd") : i === "keydown" && s.keyCode === 229 && (we = "onCompositionStart");
        we && (z0 && s.locale !== "ko" && (Ri || we !== "onCompositionStart" ? we === "onCompositionEnd" && Ri && (be = R0()) : (wn = re, sf = "value" in wn ? wn.value : wn.textContent, Ri = !0)), ge = ll(K, we), 0 < ge.length && (we = new q0(we, i, null, s, re), ie.push({ event: we, listeners: ge }), be ? we.data = be : (be = H0(s), be !== null && (we.data = be)))), (be = tj ? rj(i, s) : nj(i, s)) && (K = ll(K, "onBeforeInput"), 0 < K.length && (re = new q0("onBeforeInput", "beforeinput", null, s, re), ie.push({ event: re, listeners: K }), re.data = be));
      }
      fb(ie, o);
    });
  }
  function mo(i, o, s) {
    return { instance: i, listener: o, currentTarget: s };
  }
  function ll(i, o) {
    for (var s = o + "Capture", p = []; i !== null; ) {
      var y = i, g = y.stateNode;
      y.tag === 5 && g !== null && (y = g, g = Qa(i, s), g != null && p.unshift(mo(i, g, y)), g = Qa(i, o), g != null && p.push(mo(i, g, y))), i = i.return;
    }
    return p;
  }
  function qi(i) {
    if (i === null) return null;
    do
      i = i.return;
    while (i && i.tag !== 5);
    return i || null;
  }
  function pb(i, o, s, p, y) {
    for (var g = o._reactName, E = []; s !== null && s !== p; ) {
      var j = s, D = j.alternate, K = j.stateNode;
      if (D !== null && D === p) break;
      j.tag === 5 && K !== null && (j = K, y ? (D = Qa(s, g), D != null && E.unshift(mo(s, D, j))) : y || (D = Qa(s, g), D != null && E.push(mo(s, D, j)))), s = s.return;
    }
    E.length !== 0 && i.push({ event: o, listeners: E });
  }
  var mj = /\r\n?/g, gj = /\u0000|\uFFFD/g;
  function hb(i) {
    return (typeof i == "string" ? i : "" + i).replace(mj, `
`).replace(gj, "");
  }
  function sl(i, o, s) {
    if (o = hb(o), hb(i) !== o && s) throw Error(r(425));
  }
  function cl() {
  }
  var Af = null, Ef = null;
  function Tf(i, o) {
    return i === "textarea" || i === "noscript" || typeof o.children == "string" || typeof o.children == "number" || typeof o.dangerouslySetInnerHTML == "object" && o.dangerouslySetInnerHTML !== null && o.dangerouslySetInnerHTML.__html != null;
  }
  var Cf = typeof setTimeout == "function" ? setTimeout : void 0, bj = typeof clearTimeout == "function" ? clearTimeout : void 0, vb = typeof Promise == "function" ? Promise : void 0, xj = typeof queueMicrotask == "function" ? queueMicrotask : typeof vb < "u" ? function(i) {
    return vb.resolve(null).then(i).catch(wj);
  } : Cf;
  function wj(i) {
    setTimeout(function() {
      throw i;
    });
  }
  function kf(i, o) {
    var s = o, p = 0;
    do {
      var y = s.nextSibling;
      if (i.removeChild(s), y && y.nodeType === 8) if (s = y.data, s === "/$") {
        if (p === 0) {
          i.removeChild(y), oo(o);
          return;
        }
        p--;
      } else s !== "$" && s !== "$?" && s !== "$!" || p++;
      s = y;
    } while (s);
    oo(o);
  }
  function _n(i) {
    for (; i != null; i = i.nextSibling) {
      var o = i.nodeType;
      if (o === 1 || o === 3) break;
      if (o === 8) {
        if (o = i.data, o === "$" || o === "$!" || o === "$?") break;
        if (o === "/$") return null;
      }
    }
    return i;
  }
  function yb(i) {
    i = i.previousSibling;
    for (var o = 0; i; ) {
      if (i.nodeType === 8) {
        var s = i.data;
        if (s === "$" || s === "$!" || s === "$?") {
          if (o === 0) return i;
          o--;
        } else s === "/$" && o++;
      }
      i = i.previousSibling;
    }
    return null;
  }
  var Bi = Math.random().toString(36).slice(2), Ir = "__reactFiber$" + Bi, go = "__reactProps$" + Bi, Vr = "__reactContainer$" + Bi, jf = "__reactEvents$" + Bi, Sj = "__reactListeners$" + Bi, _j = "__reactHandles$" + Bi;
  function Yn(i) {
    var o = i[Ir];
    if (o) return o;
    for (var s = i.parentNode; s; ) {
      if (o = s[Vr] || s[Ir]) {
        if (s = o.alternate, o.child !== null || s !== null && s.child !== null) for (i = yb(i); i !== null; ) {
          if (s = i[Ir]) return s;
          i = yb(i);
        }
        return o;
      }
      i = s, s = i.parentNode;
    }
    return null;
  }
  function bo(i) {
    return i = i[Ir] || i[Vr], !i || i.tag !== 5 && i.tag !== 6 && i.tag !== 13 && i.tag !== 3 ? null : i;
  }
  function zi(i) {
    if (i.tag === 5 || i.tag === 6) return i.stateNode;
    throw Error(r(33));
  }
  function fl(i) {
    return i[go] || null;
  }
  var Mf = [], Fi = -1;
  function On(i) {
    return { current: i };
  }
  function Ke(i) {
    0 > Fi || (i.current = Mf[Fi], Mf[Fi] = null, Fi--);
  }
  function Ue(i, o) {
    Fi++, Mf[Fi] = i.current, i.current = o;
  }
  var Pn = {}, Pt = On(Pn), Rt = On(!1), Qn = Pn;
  function Ui(i, o) {
    var s = i.type.contextTypes;
    if (!s) return Pn;
    var p = i.stateNode;
    if (p && p.__reactInternalMemoizedUnmaskedChildContext === o) return p.__reactInternalMemoizedMaskedChildContext;
    var y = {}, g;
    for (g in s) y[g] = o[g];
    return p && (i = i.stateNode, i.__reactInternalMemoizedUnmaskedChildContext = o, i.__reactInternalMemoizedMaskedChildContext = y), y;
  }
  function Dt(i) {
    return i = i.childContextTypes, i != null;
  }
  function dl() {
    Ke(Rt), Ke(Pt);
  }
  function mb(i, o, s) {
    if (Pt.current !== Pn) throw Error(r(168));
    Ue(Pt, o), Ue(Rt, s);
  }
  function gb(i, o, s) {
    var p = i.stateNode;
    if (o = o.childContextTypes, typeof p.getChildContext != "function") return s;
    p = p.getChildContext();
    for (var y in p) if (!(y in o)) throw Error(r(108, je(i) || "Unknown", y));
    return J({}, s, p);
  }
  function pl(i) {
    return i = (i = i.stateNode) && i.__reactInternalMemoizedMergedChildContext || Pn, Qn = Pt.current, Ue(Pt, i), Ue(Rt, Rt.current), !0;
  }
  function bb(i, o, s) {
    var p = i.stateNode;
    if (!p) throw Error(r(169));
    s ? (i = gb(i, o, Qn), p.__reactInternalMemoizedMergedChildContext = i, Ke(Rt), Ke(Pt), Ue(Pt, i)) : Ke(Rt), Ue(Rt, s);
  }
  var Xr = null, hl = !1, If = !1;
  function xb(i) {
    Xr === null ? Xr = [i] : Xr.push(i);
  }
  function Oj(i) {
    hl = !0, xb(i);
  }
  function An() {
    if (!If && Xr !== null) {
      If = !0;
      var i = 0, o = Le;
      try {
        var s = Xr;
        for (Le = 1; i < s.length; i++) {
          var p = s[i];
          do
            p = p(!0);
          while (p !== null);
        }
        Xr = null, hl = !1;
      } catch (y) {
        throw Xr !== null && (Xr = Xr.slice(i + 1)), S0(ef, An), y;
      } finally {
        Le = o, If = !1;
      }
    }
    return null;
  }
  var Wi = [], Hi = 0, vl = null, yl = 0, er = [], tr = 0, Zn = null, Yr = 1, Qr = "";
  function Jn(i, o) {
    Wi[Hi++] = yl, Wi[Hi++] = vl, vl = i, yl = o;
  }
  function wb(i, o, s) {
    er[tr++] = Yr, er[tr++] = Qr, er[tr++] = Zn, Zn = i;
    var p = Yr;
    i = Qr;
    var y = 32 - yr(p) - 1;
    p &= ~(1 << y), s += 1;
    var g = 32 - yr(o) + y;
    if (30 < g) {
      var E = y - y % 5;
      g = (p & (1 << E) - 1).toString(32), p >>= E, y -= E, Yr = 1 << 32 - yr(o) + y | s << y | p, Qr = g + i;
    } else Yr = 1 << g | s << y | p, Qr = i;
  }
  function $f(i) {
    i.return !== null && (Jn(i, 1), wb(i, 1, 0));
  }
  function Nf(i) {
    for (; i === vl; ) vl = Wi[--Hi], Wi[Hi] = null, yl = Wi[--Hi], Wi[Hi] = null;
    for (; i === Zn; ) Zn = er[--tr], er[tr] = null, Qr = er[--tr], er[tr] = null, Yr = er[--tr], er[tr] = null;
  }
  var Kt = null, Gt = null, Ve = !1, gr = null;
  function Sb(i, o) {
    var s = ar(5, null, null, 0);
    s.elementType = "DELETED", s.stateNode = o, s.return = i, o = i.deletions, o === null ? (i.deletions = [s], i.flags |= 16) : o.push(s);
  }
  function _b(i, o) {
    switch (i.tag) {
      case 5:
        var s = i.type;
        return o = o.nodeType !== 1 || s.toLowerCase() !== o.nodeName.toLowerCase() ? null : o, o !== null ? (i.stateNode = o, Kt = i, Gt = _n(o.firstChild), !0) : !1;
      case 6:
        return o = i.pendingProps === "" || o.nodeType !== 3 ? null : o, o !== null ? (i.stateNode = o, Kt = i, Gt = null, !0) : !1;
      case 13:
        return o = o.nodeType !== 8 ? null : o, o !== null ? (s = Zn !== null ? { id: Yr, overflow: Qr } : null, i.memoizedState = { dehydrated: o, treeContext: s, retryLane: 1073741824 }, s = ar(18, null, null, 0), s.stateNode = o, s.return = i, i.child = s, Kt = i, Gt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Rf(i) {
    return (i.mode & 1) !== 0 && (i.flags & 128) === 0;
  }
  function Df(i) {
    if (Ve) {
      var o = Gt;
      if (o) {
        var s = o;
        if (!_b(i, o)) {
          if (Rf(i)) throw Error(r(418));
          o = _n(s.nextSibling);
          var p = Kt;
          o && _b(i, o) ? Sb(p, s) : (i.flags = i.flags & -4097 | 2, Ve = !1, Kt = i);
        }
      } else {
        if (Rf(i)) throw Error(r(418));
        i.flags = i.flags & -4097 | 2, Ve = !1, Kt = i;
      }
    }
  }
  function Ob(i) {
    for (i = i.return; i !== null && i.tag !== 5 && i.tag !== 3 && i.tag !== 13; ) i = i.return;
    Kt = i;
  }
  function ml(i) {
    if (i !== Kt) return !1;
    if (!Ve) return Ob(i), Ve = !0, !1;
    var o;
    if ((o = i.tag !== 3) && !(o = i.tag !== 5) && (o = i.type, o = o !== "head" && o !== "body" && !Tf(i.type, i.memoizedProps)), o && (o = Gt)) {
      if (Rf(i)) throw Pb(), Error(r(418));
      for (; o; ) Sb(i, o), o = _n(o.nextSibling);
    }
    if (Ob(i), i.tag === 13) {
      if (i = i.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(r(317));
      e: {
        for (i = i.nextSibling, o = 0; i; ) {
          if (i.nodeType === 8) {
            var s = i.data;
            if (s === "/$") {
              if (o === 0) {
                Gt = _n(i.nextSibling);
                break e;
              }
              o--;
            } else s !== "$" && s !== "$!" && s !== "$?" || o++;
          }
          i = i.nextSibling;
        }
        Gt = null;
      }
    } else Gt = Kt ? _n(i.stateNode.nextSibling) : null;
    return !0;
  }
  function Pb() {
    for (var i = Gt; i; ) i = _n(i.nextSibling);
  }
  function Ki() {
    Gt = Kt = null, Ve = !1;
  }
  function Lf(i) {
    gr === null ? gr = [i] : gr.push(i);
  }
  var Pj = T.ReactCurrentBatchConfig;
  function xo(i, o, s) {
    if (i = s.ref, i !== null && typeof i != "function" && typeof i != "object") {
      if (s._owner) {
        if (s = s._owner, s) {
          if (s.tag !== 1) throw Error(r(309));
          var p = s.stateNode;
        }
        if (!p) throw Error(r(147, i));
        var y = p, g = "" + i;
        return o !== null && o.ref !== null && typeof o.ref == "function" && o.ref._stringRef === g ? o.ref : (o = function(E) {
          var j = y.refs;
          E === null ? delete j[g] : j[g] = E;
        }, o._stringRef = g, o);
      }
      if (typeof i != "string") throw Error(r(284));
      if (!s._owner) throw Error(r(290, i));
    }
    return i;
  }
  function gl(i, o) {
    throw i = Object.prototype.toString.call(o), Error(r(31, i === "[object Object]" ? "object with keys {" + Object.keys(o).join(", ") + "}" : i));
  }
  function Ab(i) {
    var o = i._init;
    return o(i._payload);
  }
  function Eb(i) {
    function o(z, L) {
      if (i) {
        var U = z.deletions;
        U === null ? (z.deletions = [L], z.flags |= 16) : U.push(L);
      }
    }
    function s(z, L) {
      if (!i) return null;
      for (; L !== null; ) o(z, L), L = L.sibling;
      return null;
    }
    function p(z, L) {
      for (z = /* @__PURE__ */ new Map(); L !== null; ) L.key !== null ? z.set(L.key, L) : z.set(L.index, L), L = L.sibling;
      return z;
    }
    function y(z, L) {
      return z = $n(z, L), z.index = 0, z.sibling = null, z;
    }
    function g(z, L, U) {
      return z.index = U, i ? (U = z.alternate, U !== null ? (U = U.index, U < L ? (z.flags |= 2, L) : U) : (z.flags |= 2, L)) : (z.flags |= 1048576, L);
    }
    function E(z) {
      return i && z.alternate === null && (z.flags |= 2), z;
    }
    function j(z, L, U, oe) {
      return L === null || L.tag !== 6 ? (L = Cd(U, z.mode, oe), L.return = z, L) : (L = y(L, U), L.return = z, L);
    }
    function D(z, L, U, oe) {
      var ve = U.type;
      return ve === k ? re(z, L, U.props.children, oe, U.key) : L !== null && (L.elementType === ve || typeof ve == "object" && ve !== null && ve.$$typeof === Y && Ab(ve) === L.type) ? (oe = y(L, U.props), oe.ref = xo(z, L, U), oe.return = z, oe) : (oe = Fl(U.type, U.key, U.props, null, z.mode, oe), oe.ref = xo(z, L, U), oe.return = z, oe);
    }
    function K(z, L, U, oe) {
      return L === null || L.tag !== 4 || L.stateNode.containerInfo !== U.containerInfo || L.stateNode.implementation !== U.implementation ? (L = kd(U, z.mode, oe), L.return = z, L) : (L = y(L, U.children || []), L.return = z, L);
    }
    function re(z, L, U, oe, ve) {
      return L === null || L.tag !== 7 ? (L = ui(U, z.mode, oe, ve), L.return = z, L) : (L = y(L, U), L.return = z, L);
    }
    function ie(z, L, U) {
      if (typeof L == "string" && L !== "" || typeof L == "number") return L = Cd("" + L, z.mode, U), L.return = z, L;
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case _:
            return U = Fl(L.type, L.key, L.props, null, z.mode, U), U.ref = xo(z, null, L), U.return = z, U;
          case O:
            return L = kd(L, z.mode, U), L.return = z, L;
          case Y:
            var oe = L._init;
            return ie(z, oe(L._payload), U);
        }
        if (jr(L) || Q(L)) return L = ui(L, z.mode, U, null), L.return = z, L;
        gl(z, L);
      }
      return null;
    }
    function te(z, L, U, oe) {
      var ve = L !== null ? L.key : null;
      if (typeof U == "string" && U !== "" || typeof U == "number") return ve !== null ? null : j(z, L, "" + U, oe);
      if (typeof U == "object" && U !== null) {
        switch (U.$$typeof) {
          case _:
            return U.key === ve ? D(z, L, U, oe) : null;
          case O:
            return U.key === ve ? K(z, L, U, oe) : null;
          case Y:
            return ve = U._init, te(
              z,
              L,
              ve(U._payload),
              oe
            );
        }
        if (jr(U) || Q(U)) return ve !== null ? null : re(z, L, U, oe, null);
        gl(z, U);
      }
      return null;
    }
    function se(z, L, U, oe, ve) {
      if (typeof oe == "string" && oe !== "" || typeof oe == "number") return z = z.get(U) || null, j(L, z, "" + oe, ve);
      if (typeof oe == "object" && oe !== null) {
        switch (oe.$$typeof) {
          case _:
            return z = z.get(oe.key === null ? U : oe.key) || null, D(L, z, oe, ve);
          case O:
            return z = z.get(oe.key === null ? U : oe.key) || null, K(L, z, oe, ve);
          case Y:
            var ge = oe._init;
            return se(z, L, U, ge(oe._payload), ve);
        }
        if (jr(oe) || Q(oe)) return z = z.get(U) || null, re(L, z, oe, ve, null);
        gl(L, oe);
      }
      return null;
    }
    function de(z, L, U, oe) {
      for (var ve = null, ge = null, be = L, we = L = 0, gt = null; be !== null && we < U.length; we++) {
        be.index > we ? (gt = be, be = null) : gt = be.sibling;
        var Ie = te(z, be, U[we], oe);
        if (Ie === null) {
          be === null && (be = gt);
          break;
        }
        i && be && Ie.alternate === null && o(z, be), L = g(Ie, L, we), ge === null ? ve = Ie : ge.sibling = Ie, ge = Ie, be = gt;
      }
      if (we === U.length) return s(z, be), Ve && Jn(z, we), ve;
      if (be === null) {
        for (; we < U.length; we++) be = ie(z, U[we], oe), be !== null && (L = g(be, L, we), ge === null ? ve = be : ge.sibling = be, ge = be);
        return Ve && Jn(z, we), ve;
      }
      for (be = p(z, be); we < U.length; we++) gt = se(be, z, we, U[we], oe), gt !== null && (i && gt.alternate !== null && be.delete(gt.key === null ? we : gt.key), L = g(gt, L, we), ge === null ? ve = gt : ge.sibling = gt, ge = gt);
      return i && be.forEach(function(Nn) {
        return o(z, Nn);
      }), Ve && Jn(z, we), ve;
    }
    function he(z, L, U, oe) {
      var ve = Q(U);
      if (typeof ve != "function") throw Error(r(150));
      if (U = ve.call(U), U == null) throw Error(r(151));
      for (var ge = ve = null, be = L, we = L = 0, gt = null, Ie = U.next(); be !== null && !Ie.done; we++, Ie = U.next()) {
        be.index > we ? (gt = be, be = null) : gt = be.sibling;
        var Nn = te(z, be, Ie.value, oe);
        if (Nn === null) {
          be === null && (be = gt);
          break;
        }
        i && be && Nn.alternate === null && o(z, be), L = g(Nn, L, we), ge === null ? ve = Nn : ge.sibling = Nn, ge = Nn, be = gt;
      }
      if (Ie.done) return s(
        z,
        be
      ), Ve && Jn(z, we), ve;
      if (be === null) {
        for (; !Ie.done; we++, Ie = U.next()) Ie = ie(z, Ie.value, oe), Ie !== null && (L = g(Ie, L, we), ge === null ? ve = Ie : ge.sibling = Ie, ge = Ie);
        return Ve && Jn(z, we), ve;
      }
      for (be = p(z, be); !Ie.done; we++, Ie = U.next()) Ie = se(be, z, we, Ie.value, oe), Ie !== null && (i && Ie.alternate !== null && be.delete(Ie.key === null ? we : Ie.key), L = g(Ie, L, we), ge === null ? ve = Ie : ge.sibling = Ie, ge = Ie);
      return i && be.forEach(function(iM) {
        return o(z, iM);
      }), Ve && Jn(z, we), ve;
    }
    function nt(z, L, U, oe) {
      if (typeof U == "object" && U !== null && U.type === k && U.key === null && (U = U.props.children), typeof U == "object" && U !== null) {
        switch (U.$$typeof) {
          case _:
            e: {
              for (var ve = U.key, ge = L; ge !== null; ) {
                if (ge.key === ve) {
                  if (ve = U.type, ve === k) {
                    if (ge.tag === 7) {
                      s(z, ge.sibling), L = y(ge, U.props.children), L.return = z, z = L;
                      break e;
                    }
                  } else if (ge.elementType === ve || typeof ve == "object" && ve !== null && ve.$$typeof === Y && Ab(ve) === ge.type) {
                    s(z, ge.sibling), L = y(ge, U.props), L.ref = xo(z, ge, U), L.return = z, z = L;
                    break e;
                  }
                  s(z, ge);
                  break;
                } else o(z, ge);
                ge = ge.sibling;
              }
              U.type === k ? (L = ui(U.props.children, z.mode, oe, U.key), L.return = z, z = L) : (oe = Fl(U.type, U.key, U.props, null, z.mode, oe), oe.ref = xo(z, L, U), oe.return = z, z = oe);
            }
            return E(z);
          case O:
            e: {
              for (ge = U.key; L !== null; ) {
                if (L.key === ge) if (L.tag === 4 && L.stateNode.containerInfo === U.containerInfo && L.stateNode.implementation === U.implementation) {
                  s(z, L.sibling), L = y(L, U.children || []), L.return = z, z = L;
                  break e;
                } else {
                  s(z, L);
                  break;
                }
                else o(z, L);
                L = L.sibling;
              }
              L = kd(U, z.mode, oe), L.return = z, z = L;
            }
            return E(z);
          case Y:
            return ge = U._init, nt(z, L, ge(U._payload), oe);
        }
        if (jr(U)) return de(z, L, U, oe);
        if (Q(U)) return he(z, L, U, oe);
        gl(z, U);
      }
      return typeof U == "string" && U !== "" || typeof U == "number" ? (U = "" + U, L !== null && L.tag === 6 ? (s(z, L.sibling), L = y(L, U), L.return = z, z = L) : (s(z, L), L = Cd(U, z.mode, oe), L.return = z, z = L), E(z)) : s(z, L);
    }
    return nt;
  }
  var Gi = Eb(!0), Tb = Eb(!1), bl = On(null), xl = null, Vi = null, qf = null;
  function Bf() {
    qf = Vi = xl = null;
  }
  function zf(i) {
    var o = bl.current;
    Ke(bl), i._currentValue = o;
  }
  function Ff(i, o, s) {
    for (; i !== null; ) {
      var p = i.alternate;
      if ((i.childLanes & o) !== o ? (i.childLanes |= o, p !== null && (p.childLanes |= o)) : p !== null && (p.childLanes & o) !== o && (p.childLanes |= o), i === s) break;
      i = i.return;
    }
  }
  function Xi(i, o) {
    xl = i, qf = Vi = null, i = i.dependencies, i !== null && i.firstContext !== null && ((i.lanes & o) !== 0 && (Lt = !0), i.firstContext = null);
  }
  function rr(i) {
    var o = i._currentValue;
    if (qf !== i) if (i = { context: i, memoizedValue: o, next: null }, Vi === null) {
      if (xl === null) throw Error(r(308));
      Vi = i, xl.dependencies = { lanes: 0, firstContext: i };
    } else Vi = Vi.next = i;
    return o;
  }
  var ei = null;
  function Uf(i) {
    ei === null ? ei = [i] : ei.push(i);
  }
  function Cb(i, o, s, p) {
    var y = o.interleaved;
    return y === null ? (s.next = s, Uf(o)) : (s.next = y.next, y.next = s), o.interleaved = s, Zr(i, p);
  }
  function Zr(i, o) {
    i.lanes |= o;
    var s = i.alternate;
    for (s !== null && (s.lanes |= o), s = i, i = i.return; i !== null; ) i.childLanes |= o, s = i.alternate, s !== null && (s.childLanes |= o), s = i, i = i.return;
    return s.tag === 3 ? s.stateNode : null;
  }
  var En = !1;
  function Wf(i) {
    i.updateQueue = { baseState: i.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function kb(i, o) {
    i = i.updateQueue, o.updateQueue === i && (o.updateQueue = { baseState: i.baseState, firstBaseUpdate: i.firstBaseUpdate, lastBaseUpdate: i.lastBaseUpdate, shared: i.shared, effects: i.effects });
  }
  function Jr(i, o) {
    return { eventTime: i, lane: o, tag: 0, payload: null, callback: null, next: null };
  }
  function Tn(i, o, s) {
    var p = i.updateQueue;
    if (p === null) return null;
    if (p = p.shared, (Me & 2) !== 0) {
      var y = p.pending;
      return y === null ? o.next = o : (o.next = y.next, y.next = o), p.pending = o, Zr(i, s);
    }
    return y = p.interleaved, y === null ? (o.next = o, Uf(p)) : (o.next = y.next, y.next = o), p.interleaved = o, Zr(i, s);
  }
  function wl(i, o, s) {
    if (o = o.updateQueue, o !== null && (o = o.shared, (s & 4194240) !== 0)) {
      var p = o.lanes;
      p &= i.pendingLanes, s |= p, o.lanes = s, nf(i, s);
    }
  }
  function jb(i, o) {
    var s = i.updateQueue, p = i.alternate;
    if (p !== null && (p = p.updateQueue, s === p)) {
      var y = null, g = null;
      if (s = s.firstBaseUpdate, s !== null) {
        do {
          var E = { eventTime: s.eventTime, lane: s.lane, tag: s.tag, payload: s.payload, callback: s.callback, next: null };
          g === null ? y = g = E : g = g.next = E, s = s.next;
        } while (s !== null);
        g === null ? y = g = o : g = g.next = o;
      } else y = g = o;
      s = { baseState: p.baseState, firstBaseUpdate: y, lastBaseUpdate: g, shared: p.shared, effects: p.effects }, i.updateQueue = s;
      return;
    }
    i = s.lastBaseUpdate, i === null ? s.firstBaseUpdate = o : i.next = o, s.lastBaseUpdate = o;
  }
  function Sl(i, o, s, p) {
    var y = i.updateQueue;
    En = !1;
    var g = y.firstBaseUpdate, E = y.lastBaseUpdate, j = y.shared.pending;
    if (j !== null) {
      y.shared.pending = null;
      var D = j, K = D.next;
      D.next = null, E === null ? g = K : E.next = K, E = D;
      var re = i.alternate;
      re !== null && (re = re.updateQueue, j = re.lastBaseUpdate, j !== E && (j === null ? re.firstBaseUpdate = K : j.next = K, re.lastBaseUpdate = D));
    }
    if (g !== null) {
      var ie = y.baseState;
      E = 0, re = K = D = null, j = g;
      do {
        var te = j.lane, se = j.eventTime;
        if ((p & te) === te) {
          re !== null && (re = re.next = {
            eventTime: se,
            lane: 0,
            tag: j.tag,
            payload: j.payload,
            callback: j.callback,
            next: null
          });
          e: {
            var de = i, he = j;
            switch (te = o, se = s, he.tag) {
              case 1:
                if (de = he.payload, typeof de == "function") {
                  ie = de.call(se, ie, te);
                  break e;
                }
                ie = de;
                break e;
              case 3:
                de.flags = de.flags & -65537 | 128;
              case 0:
                if (de = he.payload, te = typeof de == "function" ? de.call(se, ie, te) : de, te == null) break e;
                ie = J({}, ie, te);
                break e;
              case 2:
                En = !0;
            }
          }
          j.callback !== null && j.lane !== 0 && (i.flags |= 64, te = y.effects, te === null ? y.effects = [j] : te.push(j));
        } else se = { eventTime: se, lane: te, tag: j.tag, payload: j.payload, callback: j.callback, next: null }, re === null ? (K = re = se, D = ie) : re = re.next = se, E |= te;
        if (j = j.next, j === null) {
          if (j = y.shared.pending, j === null) break;
          te = j, j = te.next, te.next = null, y.lastBaseUpdate = te, y.shared.pending = null;
        }
      } while (!0);
      if (re === null && (D = ie), y.baseState = D, y.firstBaseUpdate = K, y.lastBaseUpdate = re, o = y.shared.interleaved, o !== null) {
        y = o;
        do
          E |= y.lane, y = y.next;
        while (y !== o);
      } else g === null && (y.shared.lanes = 0);
      ni |= E, i.lanes = E, i.memoizedState = ie;
    }
  }
  function Mb(i, o, s) {
    if (i = o.effects, o.effects = null, i !== null) for (o = 0; o < i.length; o++) {
      var p = i[o], y = p.callback;
      if (y !== null) {
        if (p.callback = null, p = s, typeof y != "function") throw Error(r(191, y));
        y.call(p);
      }
    }
  }
  var wo = {}, $r = On(wo), So = On(wo), _o = On(wo);
  function ti(i) {
    if (i === wo) throw Error(r(174));
    return i;
  }
  function Hf(i, o) {
    switch (Ue(_o, o), Ue(So, i), Ue($r, wo), i = o.nodeType, i) {
      case 9:
      case 11:
        o = (o = o.documentElement) ? o.namespaceURI : Hc(null, "");
        break;
      default:
        i = i === 8 ? o.parentNode : o, o = i.namespaceURI || null, i = i.tagName, o = Hc(o, i);
    }
    Ke($r), Ue($r, o);
  }
  function Yi() {
    Ke($r), Ke(So), Ke(_o);
  }
  function Ib(i) {
    ti(_o.current);
    var o = ti($r.current), s = Hc(o, i.type);
    o !== s && (Ue(So, i), Ue($r, s));
  }
  function Kf(i) {
    So.current === i && (Ke($r), Ke(So));
  }
  var Ye = On(0);
  function _l(i) {
    for (var o = i; o !== null; ) {
      if (o.tag === 13) {
        var s = o.memoizedState;
        if (s !== null && (s = s.dehydrated, s === null || s.data === "$?" || s.data === "$!")) return o;
      } else if (o.tag === 19 && o.memoizedProps.revealOrder !== void 0) {
        if ((o.flags & 128) !== 0) return o;
      } else if (o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
      if (o === i) break;
      for (; o.sibling === null; ) {
        if (o.return === null || o.return === i) return null;
        o = o.return;
      }
      o.sibling.return = o.return, o = o.sibling;
    }
    return null;
  }
  var Gf = [];
  function Vf() {
    for (var i = 0; i < Gf.length; i++) Gf[i]._workInProgressVersionPrimary = null;
    Gf.length = 0;
  }
  var Ol = T.ReactCurrentDispatcher, Xf = T.ReactCurrentBatchConfig, ri = 0, Qe = null, lt = null, yt = null, Pl = !1, Oo = !1, Po = 0, Aj = 0;
  function At() {
    throw Error(r(321));
  }
  function Yf(i, o) {
    if (o === null) return !1;
    for (var s = 0; s < o.length && s < i.length; s++) if (!mr(i[s], o[s])) return !1;
    return !0;
  }
  function Qf(i, o, s, p, y, g) {
    if (ri = g, Qe = o, o.memoizedState = null, o.updateQueue = null, o.lanes = 0, Ol.current = i === null || i.memoizedState === null ? kj : jj, i = s(p, y), Oo) {
      g = 0;
      do {
        if (Oo = !1, Po = 0, 25 <= g) throw Error(r(301));
        g += 1, yt = lt = null, o.updateQueue = null, Ol.current = Mj, i = s(p, y);
      } while (Oo);
    }
    if (Ol.current = Tl, o = lt !== null && lt.next !== null, ri = 0, yt = lt = Qe = null, Pl = !1, o) throw Error(r(300));
    return i;
  }
  function Zf() {
    var i = Po !== 0;
    return Po = 0, i;
  }
  function Nr() {
    var i = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return yt === null ? Qe.memoizedState = yt = i : yt = yt.next = i, yt;
  }
  function nr() {
    if (lt === null) {
      var i = Qe.alternate;
      i = i !== null ? i.memoizedState : null;
    } else i = lt.next;
    var o = yt === null ? Qe.memoizedState : yt.next;
    if (o !== null) yt = o, lt = i;
    else {
      if (i === null) throw Error(r(310));
      lt = i, i = { memoizedState: lt.memoizedState, baseState: lt.baseState, baseQueue: lt.baseQueue, queue: lt.queue, next: null }, yt === null ? Qe.memoizedState = yt = i : yt = yt.next = i;
    }
    return yt;
  }
  function Ao(i, o) {
    return typeof o == "function" ? o(i) : o;
  }
  function Jf(i) {
    var o = nr(), s = o.queue;
    if (s === null) throw Error(r(311));
    s.lastRenderedReducer = i;
    var p = lt, y = p.baseQueue, g = s.pending;
    if (g !== null) {
      if (y !== null) {
        var E = y.next;
        y.next = g.next, g.next = E;
      }
      p.baseQueue = y = g, s.pending = null;
    }
    if (y !== null) {
      g = y.next, p = p.baseState;
      var j = E = null, D = null, K = g;
      do {
        var re = K.lane;
        if ((ri & re) === re) D !== null && (D = D.next = { lane: 0, action: K.action, hasEagerState: K.hasEagerState, eagerState: K.eagerState, next: null }), p = K.hasEagerState ? K.eagerState : i(p, K.action);
        else {
          var ie = {
            lane: re,
            action: K.action,
            hasEagerState: K.hasEagerState,
            eagerState: K.eagerState,
            next: null
          };
          D === null ? (j = D = ie, E = p) : D = D.next = ie, Qe.lanes |= re, ni |= re;
        }
        K = K.next;
      } while (K !== null && K !== g);
      D === null ? E = p : D.next = j, mr(p, o.memoizedState) || (Lt = !0), o.memoizedState = p, o.baseState = E, o.baseQueue = D, s.lastRenderedState = p;
    }
    if (i = s.interleaved, i !== null) {
      y = i;
      do
        g = y.lane, Qe.lanes |= g, ni |= g, y = y.next;
      while (y !== i);
    } else y === null && (s.lanes = 0);
    return [o.memoizedState, s.dispatch];
  }
  function ed(i) {
    var o = nr(), s = o.queue;
    if (s === null) throw Error(r(311));
    s.lastRenderedReducer = i;
    var p = s.dispatch, y = s.pending, g = o.memoizedState;
    if (y !== null) {
      s.pending = null;
      var E = y = y.next;
      do
        g = i(g, E.action), E = E.next;
      while (E !== y);
      mr(g, o.memoizedState) || (Lt = !0), o.memoizedState = g, o.baseQueue === null && (o.baseState = g), s.lastRenderedState = g;
    }
    return [g, p];
  }
  function $b() {
  }
  function Nb(i, o) {
    var s = Qe, p = nr(), y = o(), g = !mr(p.memoizedState, y);
    if (g && (p.memoizedState = y, Lt = !0), p = p.queue, td(Lb.bind(null, s, p, i), [i]), p.getSnapshot !== o || g || yt !== null && yt.memoizedState.tag & 1) {
      if (s.flags |= 2048, Eo(9, Db.bind(null, s, p, y, o), void 0, null), mt === null) throw Error(r(349));
      (ri & 30) !== 0 || Rb(s, o, y);
    }
    return y;
  }
  function Rb(i, o, s) {
    i.flags |= 16384, i = { getSnapshot: o, value: s }, o = Qe.updateQueue, o === null ? (o = { lastEffect: null, stores: null }, Qe.updateQueue = o, o.stores = [i]) : (s = o.stores, s === null ? o.stores = [i] : s.push(i));
  }
  function Db(i, o, s, p) {
    o.value = s, o.getSnapshot = p, qb(o) && Bb(i);
  }
  function Lb(i, o, s) {
    return s(function() {
      qb(o) && Bb(i);
    });
  }
  function qb(i) {
    var o = i.getSnapshot;
    i = i.value;
    try {
      var s = o();
      return !mr(i, s);
    } catch {
      return !0;
    }
  }
  function Bb(i) {
    var o = Zr(i, 1);
    o !== null && Sr(o, i, 1, -1);
  }
  function zb(i) {
    var o = Nr();
    return typeof i == "function" && (i = i()), o.memoizedState = o.baseState = i, i = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Ao, lastRenderedState: i }, o.queue = i, i = i.dispatch = Cj.bind(null, Qe, i), [o.memoizedState, i];
  }
  function Eo(i, o, s, p) {
    return i = { tag: i, create: o, destroy: s, deps: p, next: null }, o = Qe.updateQueue, o === null ? (o = { lastEffect: null, stores: null }, Qe.updateQueue = o, o.lastEffect = i.next = i) : (s = o.lastEffect, s === null ? o.lastEffect = i.next = i : (p = s.next, s.next = i, i.next = p, o.lastEffect = i)), i;
  }
  function Fb() {
    return nr().memoizedState;
  }
  function Al(i, o, s, p) {
    var y = Nr();
    Qe.flags |= i, y.memoizedState = Eo(1 | o, s, void 0, p === void 0 ? null : p);
  }
  function El(i, o, s, p) {
    var y = nr();
    p = p === void 0 ? null : p;
    var g = void 0;
    if (lt !== null) {
      var E = lt.memoizedState;
      if (g = E.destroy, p !== null && Yf(p, E.deps)) {
        y.memoizedState = Eo(o, s, g, p);
        return;
      }
    }
    Qe.flags |= i, y.memoizedState = Eo(1 | o, s, g, p);
  }
  function Ub(i, o) {
    return Al(8390656, 8, i, o);
  }
  function td(i, o) {
    return El(2048, 8, i, o);
  }
  function Wb(i, o) {
    return El(4, 2, i, o);
  }
  function Hb(i, o) {
    return El(4, 4, i, o);
  }
  function Kb(i, o) {
    if (typeof o == "function") return i = i(), o(i), function() {
      o(null);
    };
    if (o != null) return i = i(), o.current = i, function() {
      o.current = null;
    };
  }
  function Gb(i, o, s) {
    return s = s != null ? s.concat([i]) : null, El(4, 4, Kb.bind(null, o, i), s);
  }
  function rd() {
  }
  function Vb(i, o) {
    var s = nr();
    o = o === void 0 ? null : o;
    var p = s.memoizedState;
    return p !== null && o !== null && Yf(o, p[1]) ? p[0] : (s.memoizedState = [i, o], i);
  }
  function Xb(i, o) {
    var s = nr();
    o = o === void 0 ? null : o;
    var p = s.memoizedState;
    return p !== null && o !== null && Yf(o, p[1]) ? p[0] : (i = i(), s.memoizedState = [i, o], i);
  }
  function Yb(i, o, s) {
    return (ri & 21) === 0 ? (i.baseState && (i.baseState = !1, Lt = !0), i.memoizedState = s) : (mr(s, o) || (s = A0(), Qe.lanes |= s, ni |= s, i.baseState = !0), o);
  }
  function Ej(i, o) {
    var s = Le;
    Le = s !== 0 && 4 > s ? s : 4, i(!0);
    var p = Xf.transition;
    Xf.transition = {};
    try {
      i(!1), o();
    } finally {
      Le = s, Xf.transition = p;
    }
  }
  function Qb() {
    return nr().memoizedState;
  }
  function Tj(i, o, s) {
    var p = Mn(i);
    if (s = { lane: p, action: s, hasEagerState: !1, eagerState: null, next: null }, Zb(i)) Jb(o, s);
    else if (s = Cb(i, o, s, p), s !== null) {
      var y = It();
      Sr(s, i, p, y), ex(s, o, p);
    }
  }
  function Cj(i, o, s) {
    var p = Mn(i), y = { lane: p, action: s, hasEagerState: !1, eagerState: null, next: null };
    if (Zb(i)) Jb(o, y);
    else {
      var g = i.alternate;
      if (i.lanes === 0 && (g === null || g.lanes === 0) && (g = o.lastRenderedReducer, g !== null)) try {
        var E = o.lastRenderedState, j = g(E, s);
        if (y.hasEagerState = !0, y.eagerState = j, mr(j, E)) {
          var D = o.interleaved;
          D === null ? (y.next = y, Uf(o)) : (y.next = D.next, D.next = y), o.interleaved = y;
          return;
        }
      } catch {
      } finally {
      }
      s = Cb(i, o, y, p), s !== null && (y = It(), Sr(s, i, p, y), ex(s, o, p));
    }
  }
  function Zb(i) {
    var o = i.alternate;
    return i === Qe || o !== null && o === Qe;
  }
  function Jb(i, o) {
    Oo = Pl = !0;
    var s = i.pending;
    s === null ? o.next = o : (o.next = s.next, s.next = o), i.pending = o;
  }
  function ex(i, o, s) {
    if ((s & 4194240) !== 0) {
      var p = o.lanes;
      p &= i.pendingLanes, s |= p, o.lanes = s, nf(i, s);
    }
  }
  var Tl = { readContext: rr, useCallback: At, useContext: At, useEffect: At, useImperativeHandle: At, useInsertionEffect: At, useLayoutEffect: At, useMemo: At, useReducer: At, useRef: At, useState: At, useDebugValue: At, useDeferredValue: At, useTransition: At, useMutableSource: At, useSyncExternalStore: At, useId: At, unstable_isNewReconciler: !1 }, kj = { readContext: rr, useCallback: function(i, o) {
    return Nr().memoizedState = [i, o === void 0 ? null : o], i;
  }, useContext: rr, useEffect: Ub, useImperativeHandle: function(i, o, s) {
    return s = s != null ? s.concat([i]) : null, Al(
      4194308,
      4,
      Kb.bind(null, o, i),
      s
    );
  }, useLayoutEffect: function(i, o) {
    return Al(4194308, 4, i, o);
  }, useInsertionEffect: function(i, o) {
    return Al(4, 2, i, o);
  }, useMemo: function(i, o) {
    var s = Nr();
    return o = o === void 0 ? null : o, i = i(), s.memoizedState = [i, o], i;
  }, useReducer: function(i, o, s) {
    var p = Nr();
    return o = s !== void 0 ? s(o) : o, p.memoizedState = p.baseState = o, i = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: i, lastRenderedState: o }, p.queue = i, i = i.dispatch = Tj.bind(null, Qe, i), [p.memoizedState, i];
  }, useRef: function(i) {
    var o = Nr();
    return i = { current: i }, o.memoizedState = i;
  }, useState: zb, useDebugValue: rd, useDeferredValue: function(i) {
    return Nr().memoizedState = i;
  }, useTransition: function() {
    var i = zb(!1), o = i[0];
    return i = Ej.bind(null, i[1]), Nr().memoizedState = i, [o, i];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(i, o, s) {
    var p = Qe, y = Nr();
    if (Ve) {
      if (s === void 0) throw Error(r(407));
      s = s();
    } else {
      if (s = o(), mt === null) throw Error(r(349));
      (ri & 30) !== 0 || Rb(p, o, s);
    }
    y.memoizedState = s;
    var g = { value: s, getSnapshot: o };
    return y.queue = g, Ub(Lb.bind(
      null,
      p,
      g,
      i
    ), [i]), p.flags |= 2048, Eo(9, Db.bind(null, p, g, s, o), void 0, null), s;
  }, useId: function() {
    var i = Nr(), o = mt.identifierPrefix;
    if (Ve) {
      var s = Qr, p = Yr;
      s = (p & ~(1 << 32 - yr(p) - 1)).toString(32) + s, o = ":" + o + "R" + s, s = Po++, 0 < s && (o += "H" + s.toString(32)), o += ":";
    } else s = Aj++, o = ":" + o + "r" + s.toString(32) + ":";
    return i.memoizedState = o;
  }, unstable_isNewReconciler: !1 }, jj = {
    readContext: rr,
    useCallback: Vb,
    useContext: rr,
    useEffect: td,
    useImperativeHandle: Gb,
    useInsertionEffect: Wb,
    useLayoutEffect: Hb,
    useMemo: Xb,
    useReducer: Jf,
    useRef: Fb,
    useState: function() {
      return Jf(Ao);
    },
    useDebugValue: rd,
    useDeferredValue: function(i) {
      var o = nr();
      return Yb(o, lt.memoizedState, i);
    },
    useTransition: function() {
      var i = Jf(Ao)[0], o = nr().memoizedState;
      return [i, o];
    },
    useMutableSource: $b,
    useSyncExternalStore: Nb,
    useId: Qb,
    unstable_isNewReconciler: !1
  }, Mj = { readContext: rr, useCallback: Vb, useContext: rr, useEffect: td, useImperativeHandle: Gb, useInsertionEffect: Wb, useLayoutEffect: Hb, useMemo: Xb, useReducer: ed, useRef: Fb, useState: function() {
    return ed(Ao);
  }, useDebugValue: rd, useDeferredValue: function(i) {
    var o = nr();
    return lt === null ? o.memoizedState = i : Yb(o, lt.memoizedState, i);
  }, useTransition: function() {
    var i = ed(Ao)[0], o = nr().memoizedState;
    return [i, o];
  }, useMutableSource: $b, useSyncExternalStore: Nb, useId: Qb, unstable_isNewReconciler: !1 };
  function br(i, o) {
    if (i && i.defaultProps) {
      o = J({}, o), i = i.defaultProps;
      for (var s in i) o[s] === void 0 && (o[s] = i[s]);
      return o;
    }
    return o;
  }
  function nd(i, o, s, p) {
    o = i.memoizedState, s = s(p, o), s = s == null ? o : J({}, o, s), i.memoizedState = s, i.lanes === 0 && (i.updateQueue.baseState = s);
  }
  var Cl = { isMounted: function(i) {
    return (i = i._reactInternals) ? Xn(i) === i : !1;
  }, enqueueSetState: function(i, o, s) {
    i = i._reactInternals;
    var p = It(), y = Mn(i), g = Jr(p, y);
    g.payload = o, s != null && (g.callback = s), o = Tn(i, g, y), o !== null && (Sr(o, i, y, p), wl(o, i, y));
  }, enqueueReplaceState: function(i, o, s) {
    i = i._reactInternals;
    var p = It(), y = Mn(i), g = Jr(p, y);
    g.tag = 1, g.payload = o, s != null && (g.callback = s), o = Tn(i, g, y), o !== null && (Sr(o, i, y, p), wl(o, i, y));
  }, enqueueForceUpdate: function(i, o) {
    i = i._reactInternals;
    var s = It(), p = Mn(i), y = Jr(s, p);
    y.tag = 2, o != null && (y.callback = o), o = Tn(i, y, p), o !== null && (Sr(o, i, p, s), wl(o, i, p));
  } };
  function tx(i, o, s, p, y, g, E) {
    return i = i.stateNode, typeof i.shouldComponentUpdate == "function" ? i.shouldComponentUpdate(p, g, E) : o.prototype && o.prototype.isPureReactComponent ? !po(s, p) || !po(y, g) : !0;
  }
  function rx(i, o, s) {
    var p = !1, y = Pn, g = o.contextType;
    return typeof g == "object" && g !== null ? g = rr(g) : (y = Dt(o) ? Qn : Pt.current, p = o.contextTypes, g = (p = p != null) ? Ui(i, y) : Pn), o = new o(s, g), i.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, o.updater = Cl, i.stateNode = o, o._reactInternals = i, p && (i = i.stateNode, i.__reactInternalMemoizedUnmaskedChildContext = y, i.__reactInternalMemoizedMaskedChildContext = g), o;
  }
  function nx(i, o, s, p) {
    i = o.state, typeof o.componentWillReceiveProps == "function" && o.componentWillReceiveProps(s, p), typeof o.UNSAFE_componentWillReceiveProps == "function" && o.UNSAFE_componentWillReceiveProps(s, p), o.state !== i && Cl.enqueueReplaceState(o, o.state, null);
  }
  function id(i, o, s, p) {
    var y = i.stateNode;
    y.props = s, y.state = i.memoizedState, y.refs = {}, Wf(i);
    var g = o.contextType;
    typeof g == "object" && g !== null ? y.context = rr(g) : (g = Dt(o) ? Qn : Pt.current, y.context = Ui(i, g)), y.state = i.memoizedState, g = o.getDerivedStateFromProps, typeof g == "function" && (nd(i, o, g, s), y.state = i.memoizedState), typeof o.getDerivedStateFromProps == "function" || typeof y.getSnapshotBeforeUpdate == "function" || typeof y.UNSAFE_componentWillMount != "function" && typeof y.componentWillMount != "function" || (o = y.state, typeof y.componentWillMount == "function" && y.componentWillMount(), typeof y.UNSAFE_componentWillMount == "function" && y.UNSAFE_componentWillMount(), o !== y.state && Cl.enqueueReplaceState(y, y.state, null), Sl(i, s, y, p), y.state = i.memoizedState), typeof y.componentDidMount == "function" && (i.flags |= 4194308);
  }
  function Qi(i, o) {
    try {
      var s = "", p = o;
      do
        s += me(p), p = p.return;
      while (p);
      var y = s;
    } catch (g) {
      y = `
Error generating stack: ` + g.message + `
` + g.stack;
    }
    return { value: i, source: o, stack: y, digest: null };
  }
  function ad(i, o, s) {
    return { value: i, source: null, stack: s ?? null, digest: o ?? null };
  }
  function od(i, o) {
    try {
      console.error(o.value);
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  var Ij = typeof WeakMap == "function" ? WeakMap : Map;
  function ix(i, o, s) {
    s = Jr(-1, s), s.tag = 3, s.payload = { element: null };
    var p = o.value;
    return s.callback = function() {
      Rl || (Rl = !0, wd = p), od(i, o);
    }, s;
  }
  function ax(i, o, s) {
    s = Jr(-1, s), s.tag = 3;
    var p = i.type.getDerivedStateFromError;
    if (typeof p == "function") {
      var y = o.value;
      s.payload = function() {
        return p(y);
      }, s.callback = function() {
        od(i, o);
      };
    }
    var g = i.stateNode;
    return g !== null && typeof g.componentDidCatch == "function" && (s.callback = function() {
      od(i, o), typeof p != "function" && (kn === null ? kn = /* @__PURE__ */ new Set([this]) : kn.add(this));
      var E = o.stack;
      this.componentDidCatch(o.value, { componentStack: E !== null ? E : "" });
    }), s;
  }
  function ox(i, o, s) {
    var p = i.pingCache;
    if (p === null) {
      p = i.pingCache = new Ij();
      var y = /* @__PURE__ */ new Set();
      p.set(o, y);
    } else y = p.get(o), y === void 0 && (y = /* @__PURE__ */ new Set(), p.set(o, y));
    y.has(s) || (y.add(s), i = Gj.bind(null, i, o, s), o.then(i, i));
  }
  function ux(i) {
    do {
      var o;
      if ((o = i.tag === 13) && (o = i.memoizedState, o = o !== null ? o.dehydrated !== null : !0), o) return i;
      i = i.return;
    } while (i !== null);
    return null;
  }
  function lx(i, o, s, p, y) {
    return (i.mode & 1) === 0 ? (i === o ? i.flags |= 65536 : (i.flags |= 128, s.flags |= 131072, s.flags &= -52805, s.tag === 1 && (s.alternate === null ? s.tag = 17 : (o = Jr(-1, 1), o.tag = 2, Tn(s, o, 1))), s.lanes |= 1), i) : (i.flags |= 65536, i.lanes = y, i);
  }
  var $j = T.ReactCurrentOwner, Lt = !1;
  function Mt(i, o, s, p) {
    o.child = i === null ? Tb(o, null, s, p) : Gi(o, i.child, s, p);
  }
  function sx(i, o, s, p, y) {
    s = s.render;
    var g = o.ref;
    return Xi(o, y), p = Qf(i, o, s, p, g, y), s = Zf(), i !== null && !Lt ? (o.updateQueue = i.updateQueue, o.flags &= -2053, i.lanes &= ~y, en(i, o, y)) : (Ve && s && $f(o), o.flags |= 1, Mt(i, o, p, y), o.child);
  }
  function cx(i, o, s, p, y) {
    if (i === null) {
      var g = s.type;
      return typeof g == "function" && !Td(g) && g.defaultProps === void 0 && s.compare === null && s.defaultProps === void 0 ? (o.tag = 15, o.type = g, fx(i, o, g, p, y)) : (i = Fl(s.type, null, p, o, o.mode, y), i.ref = o.ref, i.return = o, o.child = i);
    }
    if (g = i.child, (i.lanes & y) === 0) {
      var E = g.memoizedProps;
      if (s = s.compare, s = s !== null ? s : po, s(E, p) && i.ref === o.ref) return en(i, o, y);
    }
    return o.flags |= 1, i = $n(g, p), i.ref = o.ref, i.return = o, o.child = i;
  }
  function fx(i, o, s, p, y) {
    if (i !== null) {
      var g = i.memoizedProps;
      if (po(g, p) && i.ref === o.ref) if (Lt = !1, o.pendingProps = p = g, (i.lanes & y) !== 0) (i.flags & 131072) !== 0 && (Lt = !0);
      else return o.lanes = i.lanes, en(i, o, y);
    }
    return ud(i, o, s, p, y);
  }
  function dx(i, o, s) {
    var p = o.pendingProps, y = p.children, g = i !== null ? i.memoizedState : null;
    if (p.mode === "hidden") if ((o.mode & 1) === 0) o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ue(Ji, Vt), Vt |= s;
    else {
      if ((s & 1073741824) === 0) return i = g !== null ? g.baseLanes | s : s, o.lanes = o.childLanes = 1073741824, o.memoizedState = { baseLanes: i, cachePool: null, transitions: null }, o.updateQueue = null, Ue(Ji, Vt), Vt |= i, null;
      o.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, p = g !== null ? g.baseLanes : s, Ue(Ji, Vt), Vt |= p;
    }
    else g !== null ? (p = g.baseLanes | s, o.memoizedState = null) : p = s, Ue(Ji, Vt), Vt |= p;
    return Mt(i, o, y, s), o.child;
  }
  function px(i, o) {
    var s = o.ref;
    (i === null && s !== null || i !== null && i.ref !== s) && (o.flags |= 512, o.flags |= 2097152);
  }
  function ud(i, o, s, p, y) {
    var g = Dt(s) ? Qn : Pt.current;
    return g = Ui(o, g), Xi(o, y), s = Qf(i, o, s, p, g, y), p = Zf(), i !== null && !Lt ? (o.updateQueue = i.updateQueue, o.flags &= -2053, i.lanes &= ~y, en(i, o, y)) : (Ve && p && $f(o), o.flags |= 1, Mt(i, o, s, y), o.child);
  }
  function hx(i, o, s, p, y) {
    if (Dt(s)) {
      var g = !0;
      pl(o);
    } else g = !1;
    if (Xi(o, y), o.stateNode === null) jl(i, o), rx(o, s, p), id(o, s, p, y), p = !0;
    else if (i === null) {
      var E = o.stateNode, j = o.memoizedProps;
      E.props = j;
      var D = E.context, K = s.contextType;
      typeof K == "object" && K !== null ? K = rr(K) : (K = Dt(s) ? Qn : Pt.current, K = Ui(o, K));
      var re = s.getDerivedStateFromProps, ie = typeof re == "function" || typeof E.getSnapshotBeforeUpdate == "function";
      ie || typeof E.UNSAFE_componentWillReceiveProps != "function" && typeof E.componentWillReceiveProps != "function" || (j !== p || D !== K) && nx(o, E, p, K), En = !1;
      var te = o.memoizedState;
      E.state = te, Sl(o, p, E, y), D = o.memoizedState, j !== p || te !== D || Rt.current || En ? (typeof re == "function" && (nd(o, s, re, p), D = o.memoizedState), (j = En || tx(o, s, j, p, te, D, K)) ? (ie || typeof E.UNSAFE_componentWillMount != "function" && typeof E.componentWillMount != "function" || (typeof E.componentWillMount == "function" && E.componentWillMount(), typeof E.UNSAFE_componentWillMount == "function" && E.UNSAFE_componentWillMount()), typeof E.componentDidMount == "function" && (o.flags |= 4194308)) : (typeof E.componentDidMount == "function" && (o.flags |= 4194308), o.memoizedProps = p, o.memoizedState = D), E.props = p, E.state = D, E.context = K, p = j) : (typeof E.componentDidMount == "function" && (o.flags |= 4194308), p = !1);
    } else {
      E = o.stateNode, kb(i, o), j = o.memoizedProps, K = o.type === o.elementType ? j : br(o.type, j), E.props = K, ie = o.pendingProps, te = E.context, D = s.contextType, typeof D == "object" && D !== null ? D = rr(D) : (D = Dt(s) ? Qn : Pt.current, D = Ui(o, D));
      var se = s.getDerivedStateFromProps;
      (re = typeof se == "function" || typeof E.getSnapshotBeforeUpdate == "function") || typeof E.UNSAFE_componentWillReceiveProps != "function" && typeof E.componentWillReceiveProps != "function" || (j !== ie || te !== D) && nx(o, E, p, D), En = !1, te = o.memoizedState, E.state = te, Sl(o, p, E, y);
      var de = o.memoizedState;
      j !== ie || te !== de || Rt.current || En ? (typeof se == "function" && (nd(o, s, se, p), de = o.memoizedState), (K = En || tx(o, s, K, p, te, de, D) || !1) ? (re || typeof E.UNSAFE_componentWillUpdate != "function" && typeof E.componentWillUpdate != "function" || (typeof E.componentWillUpdate == "function" && E.componentWillUpdate(p, de, D), typeof E.UNSAFE_componentWillUpdate == "function" && E.UNSAFE_componentWillUpdate(p, de, D)), typeof E.componentDidUpdate == "function" && (o.flags |= 4), typeof E.getSnapshotBeforeUpdate == "function" && (o.flags |= 1024)) : (typeof E.componentDidUpdate != "function" || j === i.memoizedProps && te === i.memoizedState || (o.flags |= 4), typeof E.getSnapshotBeforeUpdate != "function" || j === i.memoizedProps && te === i.memoizedState || (o.flags |= 1024), o.memoizedProps = p, o.memoizedState = de), E.props = p, E.state = de, E.context = D, p = K) : (typeof E.componentDidUpdate != "function" || j === i.memoizedProps && te === i.memoizedState || (o.flags |= 4), typeof E.getSnapshotBeforeUpdate != "function" || j === i.memoizedProps && te === i.memoizedState || (o.flags |= 1024), p = !1);
    }
    return ld(i, o, s, p, g, y);
  }
  function ld(i, o, s, p, y, g) {
    px(i, o);
    var E = (o.flags & 128) !== 0;
    if (!p && !E) return y && bb(o, s, !1), en(i, o, g);
    p = o.stateNode, $j.current = o;
    var j = E && typeof s.getDerivedStateFromError != "function" ? null : p.render();
    return o.flags |= 1, i !== null && E ? (o.child = Gi(o, i.child, null, g), o.child = Gi(o, null, j, g)) : Mt(i, o, j, g), o.memoizedState = p.state, y && bb(o, s, !0), o.child;
  }
  function vx(i) {
    var o = i.stateNode;
    o.pendingContext ? mb(i, o.pendingContext, o.pendingContext !== o.context) : o.context && mb(i, o.context, !1), Hf(i, o.containerInfo);
  }
  function yx(i, o, s, p, y) {
    return Ki(), Lf(y), o.flags |= 256, Mt(i, o, s, p), o.child;
  }
  var sd = { dehydrated: null, treeContext: null, retryLane: 0 };
  function cd(i) {
    return { baseLanes: i, cachePool: null, transitions: null };
  }
  function mx(i, o, s) {
    var p = o.pendingProps, y = Ye.current, g = !1, E = (o.flags & 128) !== 0, j;
    if ((j = E) || (j = i !== null && i.memoizedState === null ? !1 : (y & 2) !== 0), j ? (g = !0, o.flags &= -129) : (i === null || i.memoizedState !== null) && (y |= 1), Ue(Ye, y & 1), i === null)
      return Df(o), i = o.memoizedState, i !== null && (i = i.dehydrated, i !== null) ? ((o.mode & 1) === 0 ? o.lanes = 1 : i.data === "$!" ? o.lanes = 8 : o.lanes = 1073741824, null) : (E = p.children, i = p.fallback, g ? (p = o.mode, g = o.child, E = { mode: "hidden", children: E }, (p & 1) === 0 && g !== null ? (g.childLanes = 0, g.pendingProps = E) : g = Ul(E, p, 0, null), i = ui(i, p, s, null), g.return = o, i.return = o, g.sibling = i, o.child = g, o.child.memoizedState = cd(s), o.memoizedState = sd, i) : fd(o, E));
    if (y = i.memoizedState, y !== null && (j = y.dehydrated, j !== null)) return Nj(i, o, E, p, j, y, s);
    if (g) {
      g = p.fallback, E = o.mode, y = i.child, j = y.sibling;
      var D = { mode: "hidden", children: p.children };
      return (E & 1) === 0 && o.child !== y ? (p = o.child, p.childLanes = 0, p.pendingProps = D, o.deletions = null) : (p = $n(y, D), p.subtreeFlags = y.subtreeFlags & 14680064), j !== null ? g = $n(j, g) : (g = ui(g, E, s, null), g.flags |= 2), g.return = o, p.return = o, p.sibling = g, o.child = p, p = g, g = o.child, E = i.child.memoizedState, E = E === null ? cd(s) : { baseLanes: E.baseLanes | s, cachePool: null, transitions: E.transitions }, g.memoizedState = E, g.childLanes = i.childLanes & ~s, o.memoizedState = sd, p;
    }
    return g = i.child, i = g.sibling, p = $n(g, { mode: "visible", children: p.children }), (o.mode & 1) === 0 && (p.lanes = s), p.return = o, p.sibling = null, i !== null && (s = o.deletions, s === null ? (o.deletions = [i], o.flags |= 16) : s.push(i)), o.child = p, o.memoizedState = null, p;
  }
  function fd(i, o) {
    return o = Ul({ mode: "visible", children: o }, i.mode, 0, null), o.return = i, i.child = o;
  }
  function kl(i, o, s, p) {
    return p !== null && Lf(p), Gi(o, i.child, null, s), i = fd(o, o.pendingProps.children), i.flags |= 2, o.memoizedState = null, i;
  }
  function Nj(i, o, s, p, y, g, E) {
    if (s)
      return o.flags & 256 ? (o.flags &= -257, p = ad(Error(r(422))), kl(i, o, E, p)) : o.memoizedState !== null ? (o.child = i.child, o.flags |= 128, null) : (g = p.fallback, y = o.mode, p = Ul({ mode: "visible", children: p.children }, y, 0, null), g = ui(g, y, E, null), g.flags |= 2, p.return = o, g.return = o, p.sibling = g, o.child = p, (o.mode & 1) !== 0 && Gi(o, i.child, null, E), o.child.memoizedState = cd(E), o.memoizedState = sd, g);
    if ((o.mode & 1) === 0) return kl(i, o, E, null);
    if (y.data === "$!") {
      if (p = y.nextSibling && y.nextSibling.dataset, p) var j = p.dgst;
      return p = j, g = Error(r(419)), p = ad(g, p, void 0), kl(i, o, E, p);
    }
    if (j = (E & i.childLanes) !== 0, Lt || j) {
      if (p = mt, p !== null) {
        switch (E & -E) {
          case 4:
            y = 2;
            break;
          case 16:
            y = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            y = 32;
            break;
          case 536870912:
            y = 268435456;
            break;
          default:
            y = 0;
        }
        y = (y & (p.suspendedLanes | E)) !== 0 ? 0 : y, y !== 0 && y !== g.retryLane && (g.retryLane = y, Zr(i, y), Sr(p, i, y, -1));
      }
      return Ed(), p = ad(Error(r(421))), kl(i, o, E, p);
    }
    return y.data === "$?" ? (o.flags |= 128, o.child = i.child, o = Vj.bind(null, i), y._reactRetry = o, null) : (i = g.treeContext, Gt = _n(y.nextSibling), Kt = o, Ve = !0, gr = null, i !== null && (er[tr++] = Yr, er[tr++] = Qr, er[tr++] = Zn, Yr = i.id, Qr = i.overflow, Zn = o), o = fd(o, p.children), o.flags |= 4096, o);
  }
  function gx(i, o, s) {
    i.lanes |= o;
    var p = i.alternate;
    p !== null && (p.lanes |= o), Ff(i.return, o, s);
  }
  function dd(i, o, s, p, y) {
    var g = i.memoizedState;
    g === null ? i.memoizedState = { isBackwards: o, rendering: null, renderingStartTime: 0, last: p, tail: s, tailMode: y } : (g.isBackwards = o, g.rendering = null, g.renderingStartTime = 0, g.last = p, g.tail = s, g.tailMode = y);
  }
  function bx(i, o, s) {
    var p = o.pendingProps, y = p.revealOrder, g = p.tail;
    if (Mt(i, o, p.children, s), p = Ye.current, (p & 2) !== 0) p = p & 1 | 2, o.flags |= 128;
    else {
      if (i !== null && (i.flags & 128) !== 0) e: for (i = o.child; i !== null; ) {
        if (i.tag === 13) i.memoizedState !== null && gx(i, s, o);
        else if (i.tag === 19) gx(i, s, o);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === o) break e;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === o) break e;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
      p &= 1;
    }
    if (Ue(Ye, p), (o.mode & 1) === 0) o.memoizedState = null;
    else switch (y) {
      case "forwards":
        for (s = o.child, y = null; s !== null; ) i = s.alternate, i !== null && _l(i) === null && (y = s), s = s.sibling;
        s = y, s === null ? (y = o.child, o.child = null) : (y = s.sibling, s.sibling = null), dd(o, !1, y, s, g);
        break;
      case "backwards":
        for (s = null, y = o.child, o.child = null; y !== null; ) {
          if (i = y.alternate, i !== null && _l(i) === null) {
            o.child = y;
            break;
          }
          i = y.sibling, y.sibling = s, s = y, y = i;
        }
        dd(o, !0, s, null, g);
        break;
      case "together":
        dd(o, !1, null, null, void 0);
        break;
      default:
        o.memoizedState = null;
    }
    return o.child;
  }
  function jl(i, o) {
    (o.mode & 1) === 0 && i !== null && (i.alternate = null, o.alternate = null, o.flags |= 2);
  }
  function en(i, o, s) {
    if (i !== null && (o.dependencies = i.dependencies), ni |= o.lanes, (s & o.childLanes) === 0) return null;
    if (i !== null && o.child !== i.child) throw Error(r(153));
    if (o.child !== null) {
      for (i = o.child, s = $n(i, i.pendingProps), o.child = s, s.return = o; i.sibling !== null; ) i = i.sibling, s = s.sibling = $n(i, i.pendingProps), s.return = o;
      s.sibling = null;
    }
    return o.child;
  }
  function Rj(i, o, s) {
    switch (o.tag) {
      case 3:
        vx(o), Ki();
        break;
      case 5:
        Ib(o);
        break;
      case 1:
        Dt(o.type) && pl(o);
        break;
      case 4:
        Hf(o, o.stateNode.containerInfo);
        break;
      case 10:
        var p = o.type._context, y = o.memoizedProps.value;
        Ue(bl, p._currentValue), p._currentValue = y;
        break;
      case 13:
        if (p = o.memoizedState, p !== null)
          return p.dehydrated !== null ? (Ue(Ye, Ye.current & 1), o.flags |= 128, null) : (s & o.child.childLanes) !== 0 ? mx(i, o, s) : (Ue(Ye, Ye.current & 1), i = en(i, o, s), i !== null ? i.sibling : null);
        Ue(Ye, Ye.current & 1);
        break;
      case 19:
        if (p = (s & o.childLanes) !== 0, (i.flags & 128) !== 0) {
          if (p) return bx(i, o, s);
          o.flags |= 128;
        }
        if (y = o.memoizedState, y !== null && (y.rendering = null, y.tail = null, y.lastEffect = null), Ue(Ye, Ye.current), p) break;
        return null;
      case 22:
      case 23:
        return o.lanes = 0, dx(i, o, s);
    }
    return en(i, o, s);
  }
  var xx, pd, wx, Sx;
  xx = function(i, o) {
    for (var s = o.child; s !== null; ) {
      if (s.tag === 5 || s.tag === 6) i.appendChild(s.stateNode);
      else if (s.tag !== 4 && s.child !== null) {
        s.child.return = s, s = s.child;
        continue;
      }
      if (s === o) break;
      for (; s.sibling === null; ) {
        if (s.return === null || s.return === o) return;
        s = s.return;
      }
      s.sibling.return = s.return, s = s.sibling;
    }
  }, pd = function() {
  }, wx = function(i, o, s, p) {
    var y = i.memoizedProps;
    if (y !== p) {
      i = o.stateNode, ti($r.current);
      var g = null;
      switch (s) {
        case "input":
          y = Ce(i, y), p = Ce(i, p), g = [];
          break;
        case "select":
          y = J({}, y, { value: void 0 }), p = J({}, p, { value: void 0 }), g = [];
          break;
        case "textarea":
          y = vr(i, y), p = vr(i, p), g = [];
          break;
        default:
          typeof y.onClick != "function" && typeof p.onClick == "function" && (i.onclick = cl);
      }
      Kc(s, p);
      var E;
      s = null;
      for (K in y) if (!p.hasOwnProperty(K) && y.hasOwnProperty(K) && y[K] != null) if (K === "style") {
        var j = y[K];
        for (E in j) j.hasOwnProperty(E) && (s || (s = {}), s[E] = "");
      } else K !== "dangerouslySetInnerHTML" && K !== "children" && K !== "suppressContentEditableWarning" && K !== "suppressHydrationWarning" && K !== "autoFocus" && (a.hasOwnProperty(K) ? g || (g = []) : (g = g || []).push(K, null));
      for (K in p) {
        var D = p[K];
        if (j = y?.[K], p.hasOwnProperty(K) && D !== j && (D != null || j != null)) if (K === "style") if (j) {
          for (E in j) !j.hasOwnProperty(E) || D && D.hasOwnProperty(E) || (s || (s = {}), s[E] = "");
          for (E in D) D.hasOwnProperty(E) && j[E] !== D[E] && (s || (s = {}), s[E] = D[E]);
        } else s || (g || (g = []), g.push(
          K,
          s
        )), s = D;
        else K === "dangerouslySetInnerHTML" ? (D = D ? D.__html : void 0, j = j ? j.__html : void 0, D != null && j !== D && (g = g || []).push(K, D)) : K === "children" ? typeof D != "string" && typeof D != "number" || (g = g || []).push(K, "" + D) : K !== "suppressContentEditableWarning" && K !== "suppressHydrationWarning" && (a.hasOwnProperty(K) ? (D != null && K === "onScroll" && He("scroll", i), g || j === D || (g = [])) : (g = g || []).push(K, D));
      }
      s && (g = g || []).push("style", s);
      var K = g;
      (o.updateQueue = K) && (o.flags |= 4);
    }
  }, Sx = function(i, o, s, p) {
    s !== p && (o.flags |= 4);
  };
  function To(i, o) {
    if (!Ve) switch (i.tailMode) {
      case "hidden":
        o = i.tail;
        for (var s = null; o !== null; ) o.alternate !== null && (s = o), o = o.sibling;
        s === null ? i.tail = null : s.sibling = null;
        break;
      case "collapsed":
        s = i.tail;
        for (var p = null; s !== null; ) s.alternate !== null && (p = s), s = s.sibling;
        p === null ? o || i.tail === null ? i.tail = null : i.tail.sibling = null : p.sibling = null;
    }
  }
  function Et(i) {
    var o = i.alternate !== null && i.alternate.child === i.child, s = 0, p = 0;
    if (o) for (var y = i.child; y !== null; ) s |= y.lanes | y.childLanes, p |= y.subtreeFlags & 14680064, p |= y.flags & 14680064, y.return = i, y = y.sibling;
    else for (y = i.child; y !== null; ) s |= y.lanes | y.childLanes, p |= y.subtreeFlags, p |= y.flags, y.return = i, y = y.sibling;
    return i.subtreeFlags |= p, i.childLanes = s, o;
  }
  function Dj(i, o, s) {
    var p = o.pendingProps;
    switch (Nf(o), o.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Et(o), null;
      case 1:
        return Dt(o.type) && dl(), Et(o), null;
      case 3:
        return p = o.stateNode, Yi(), Ke(Rt), Ke(Pt), Vf(), p.pendingContext && (p.context = p.pendingContext, p.pendingContext = null), (i === null || i.child === null) && (ml(o) ? o.flags |= 4 : i === null || i.memoizedState.isDehydrated && (o.flags & 256) === 0 || (o.flags |= 1024, gr !== null && (Od(gr), gr = null))), pd(i, o), Et(o), null;
      case 5:
        Kf(o);
        var y = ti(_o.current);
        if (s = o.type, i !== null && o.stateNode != null) wx(i, o, s, p, y), i.ref !== o.ref && (o.flags |= 512, o.flags |= 2097152);
        else {
          if (!p) {
            if (o.stateNode === null) throw Error(r(166));
            return Et(o), null;
          }
          if (i = ti($r.current), ml(o)) {
            p = o.stateNode, s = o.type;
            var g = o.memoizedProps;
            switch (p[Ir] = o, p[go] = g, i = (o.mode & 1) !== 0, s) {
              case "dialog":
                He("cancel", p), He("close", p);
                break;
              case "iframe":
              case "object":
              case "embed":
                He("load", p);
                break;
              case "video":
              case "audio":
                for (y = 0; y < vo.length; y++) He(vo[y], p);
                break;
              case "source":
                He("error", p);
                break;
              case "img":
              case "image":
              case "link":
                He(
                  "error",
                  p
                ), He("load", p);
                break;
              case "details":
                He("toggle", p);
                break;
              case "input":
                Ze(p, g), He("invalid", p);
                break;
              case "select":
                p._wrapperState = { wasMultiple: !!g.multiple }, He("invalid", p);
                break;
              case "textarea":
                ji(p, g), He("invalid", p);
            }
            Kc(s, g), y = null;
            for (var E in g) if (g.hasOwnProperty(E)) {
              var j = g[E];
              E === "children" ? typeof j == "string" ? p.textContent !== j && (g.suppressHydrationWarning !== !0 && sl(p.textContent, j, i), y = ["children", j]) : typeof j == "number" && p.textContent !== "" + j && (g.suppressHydrationWarning !== !0 && sl(
                p.textContent,
                j,
                i
              ), y = ["children", "" + j]) : a.hasOwnProperty(E) && j != null && E === "onScroll" && He("scroll", p);
            }
            switch (s) {
              case "input":
                Pe(p), hr(p, g, !0);
                break;
              case "textarea":
                Pe(p), Va(p);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof g.onClick == "function" && (p.onclick = cl);
            }
            p = y, o.updateQueue = p, p !== null && (o.flags |= 4);
          } else {
            E = y.nodeType === 9 ? y : y.ownerDocument, i === "http://www.w3.org/1999/xhtml" && (i = l0(s)), i === "http://www.w3.org/1999/xhtml" ? s === "script" ? (i = E.createElement("div"), i.innerHTML = "<script><\/script>", i = i.removeChild(i.firstChild)) : typeof p.is == "string" ? i = E.createElement(s, { is: p.is }) : (i = E.createElement(s), s === "select" && (E = i, p.multiple ? E.multiple = !0 : p.size && (E.size = p.size))) : i = E.createElementNS(i, s), i[Ir] = o, i[go] = p, xx(i, o, !1, !1), o.stateNode = i;
            e: {
              switch (E = Gc(s, p), s) {
                case "dialog":
                  He("cancel", i), He("close", i), y = p;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  He("load", i), y = p;
                  break;
                case "video":
                case "audio":
                  for (y = 0; y < vo.length; y++) He(vo[y], i);
                  y = p;
                  break;
                case "source":
                  He("error", i), y = p;
                  break;
                case "img":
                case "image":
                case "link":
                  He(
                    "error",
                    i
                  ), He("load", i), y = p;
                  break;
                case "details":
                  He("toggle", i), y = p;
                  break;
                case "input":
                  Ze(i, p), y = Ce(i, p), He("invalid", i);
                  break;
                case "option":
                  y = p;
                  break;
                case "select":
                  i._wrapperState = { wasMultiple: !!p.multiple }, y = J({}, p, { value: void 0 }), He("invalid", i);
                  break;
                case "textarea":
                  ji(i, p), y = vr(i, p), He("invalid", i);
                  break;
                default:
                  y = p;
              }
              Kc(s, y), j = y;
              for (g in j) if (j.hasOwnProperty(g)) {
                var D = j[g];
                g === "style" ? f0(i, D) : g === "dangerouslySetInnerHTML" ? (D = D ? D.__html : void 0, D != null && s0(i, D)) : g === "children" ? typeof D == "string" ? (s !== "textarea" || D !== "") && Xa(i, D) : typeof D == "number" && Xa(i, "" + D) : g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && g !== "autoFocus" && (a.hasOwnProperty(g) ? D != null && g === "onScroll" && He("scroll", i) : D != null && A(i, g, D, E));
              }
              switch (s) {
                case "input":
                  Pe(i), hr(i, p, !1);
                  break;
                case "textarea":
                  Pe(i), Va(i);
                  break;
                case "option":
                  p.value != null && i.setAttribute("value", "" + Oe(p.value));
                  break;
                case "select":
                  i.multiple = !!p.multiple, g = p.value, g != null ? Nt(i, !!p.multiple, g, !1) : p.defaultValue != null && Nt(
                    i,
                    !!p.multiple,
                    p.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof y.onClick == "function" && (i.onclick = cl);
              }
              switch (s) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  p = !!p.autoFocus;
                  break e;
                case "img":
                  p = !0;
                  break e;
                default:
                  p = !1;
              }
            }
            p && (o.flags |= 4);
          }
          o.ref !== null && (o.flags |= 512, o.flags |= 2097152);
        }
        return Et(o), null;
      case 6:
        if (i && o.stateNode != null) Sx(i, o, i.memoizedProps, p);
        else {
          if (typeof p != "string" && o.stateNode === null) throw Error(r(166));
          if (s = ti(_o.current), ti($r.current), ml(o)) {
            if (p = o.stateNode, s = o.memoizedProps, p[Ir] = o, (g = p.nodeValue !== s) && (i = Kt, i !== null)) switch (i.tag) {
              case 3:
                sl(p.nodeValue, s, (i.mode & 1) !== 0);
                break;
              case 5:
                i.memoizedProps.suppressHydrationWarning !== !0 && sl(p.nodeValue, s, (i.mode & 1) !== 0);
            }
            g && (o.flags |= 4);
          } else p = (s.nodeType === 9 ? s : s.ownerDocument).createTextNode(p), p[Ir] = o, o.stateNode = p;
        }
        return Et(o), null;
      case 13:
        if (Ke(Ye), p = o.memoizedState, i === null || i.memoizedState !== null && i.memoizedState.dehydrated !== null) {
          if (Ve && Gt !== null && (o.mode & 1) !== 0 && (o.flags & 128) === 0) Pb(), Ki(), o.flags |= 98560, g = !1;
          else if (g = ml(o), p !== null && p.dehydrated !== null) {
            if (i === null) {
              if (!g) throw Error(r(318));
              if (g = o.memoizedState, g = g !== null ? g.dehydrated : null, !g) throw Error(r(317));
              g[Ir] = o;
            } else Ki(), (o.flags & 128) === 0 && (o.memoizedState = null), o.flags |= 4;
            Et(o), g = !1;
          } else gr !== null && (Od(gr), gr = null), g = !0;
          if (!g) return o.flags & 65536 ? o : null;
        }
        return (o.flags & 128) !== 0 ? (o.lanes = s, o) : (p = p !== null, p !== (i !== null && i.memoizedState !== null) && p && (o.child.flags |= 8192, (o.mode & 1) !== 0 && (i === null || (Ye.current & 1) !== 0 ? st === 0 && (st = 3) : Ed())), o.updateQueue !== null && (o.flags |= 4), Et(o), null);
      case 4:
        return Yi(), pd(i, o), i === null && yo(o.stateNode.containerInfo), Et(o), null;
      case 10:
        return zf(o.type._context), Et(o), null;
      case 17:
        return Dt(o.type) && dl(), Et(o), null;
      case 19:
        if (Ke(Ye), g = o.memoizedState, g === null) return Et(o), null;
        if (p = (o.flags & 128) !== 0, E = g.rendering, E === null) if (p) To(g, !1);
        else {
          if (st !== 0 || i !== null && (i.flags & 128) !== 0) for (i = o.child; i !== null; ) {
            if (E = _l(i), E !== null) {
              for (o.flags |= 128, To(g, !1), p = E.updateQueue, p !== null && (o.updateQueue = p, o.flags |= 4), o.subtreeFlags = 0, p = s, s = o.child; s !== null; ) g = s, i = p, g.flags &= 14680066, E = g.alternate, E === null ? (g.childLanes = 0, g.lanes = i, g.child = null, g.subtreeFlags = 0, g.memoizedProps = null, g.memoizedState = null, g.updateQueue = null, g.dependencies = null, g.stateNode = null) : (g.childLanes = E.childLanes, g.lanes = E.lanes, g.child = E.child, g.subtreeFlags = 0, g.deletions = null, g.memoizedProps = E.memoizedProps, g.memoizedState = E.memoizedState, g.updateQueue = E.updateQueue, g.type = E.type, i = E.dependencies, g.dependencies = i === null ? null : { lanes: i.lanes, firstContext: i.firstContext }), s = s.sibling;
              return Ue(Ye, Ye.current & 1 | 2), o.child;
            }
            i = i.sibling;
          }
          g.tail !== null && rt() > ea && (o.flags |= 128, p = !0, To(g, !1), o.lanes = 4194304);
        }
        else {
          if (!p) if (i = _l(E), i !== null) {
            if (o.flags |= 128, p = !0, s = i.updateQueue, s !== null && (o.updateQueue = s, o.flags |= 4), To(g, !0), g.tail === null && g.tailMode === "hidden" && !E.alternate && !Ve) return Et(o), null;
          } else 2 * rt() - g.renderingStartTime > ea && s !== 1073741824 && (o.flags |= 128, p = !0, To(g, !1), o.lanes = 4194304);
          g.isBackwards ? (E.sibling = o.child, o.child = E) : (s = g.last, s !== null ? s.sibling = E : o.child = E, g.last = E);
        }
        return g.tail !== null ? (o = g.tail, g.rendering = o, g.tail = o.sibling, g.renderingStartTime = rt(), o.sibling = null, s = Ye.current, Ue(Ye, p ? s & 1 | 2 : s & 1), o) : (Et(o), null);
      case 22:
      case 23:
        return Ad(), p = o.memoizedState !== null, i !== null && i.memoizedState !== null !== p && (o.flags |= 8192), p && (o.mode & 1) !== 0 ? (Vt & 1073741824) !== 0 && (Et(o), o.subtreeFlags & 6 && (o.flags |= 8192)) : Et(o), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(r(156, o.tag));
  }
  function Lj(i, o) {
    switch (Nf(o), o.tag) {
      case 1:
        return Dt(o.type) && dl(), i = o.flags, i & 65536 ? (o.flags = i & -65537 | 128, o) : null;
      case 3:
        return Yi(), Ke(Rt), Ke(Pt), Vf(), i = o.flags, (i & 65536) !== 0 && (i & 128) === 0 ? (o.flags = i & -65537 | 128, o) : null;
      case 5:
        return Kf(o), null;
      case 13:
        if (Ke(Ye), i = o.memoizedState, i !== null && i.dehydrated !== null) {
          if (o.alternate === null) throw Error(r(340));
          Ki();
        }
        return i = o.flags, i & 65536 ? (o.flags = i & -65537 | 128, o) : null;
      case 19:
        return Ke(Ye), null;
      case 4:
        return Yi(), null;
      case 10:
        return zf(o.type._context), null;
      case 22:
      case 23:
        return Ad(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Ml = !1, Tt = !1, qj = typeof WeakSet == "function" ? WeakSet : Set, ce = null;
  function Zi(i, o) {
    var s = i.ref;
    if (s !== null) if (typeof s == "function") try {
      s(null);
    } catch (p) {
      et(i, o, p);
    }
    else s.current = null;
  }
  function hd(i, o, s) {
    try {
      s();
    } catch (p) {
      et(i, o, p);
    }
  }
  var _x = !1;
  function Bj(i, o) {
    if (Af = Zu, i = tb(), gf(i)) {
      if ("selectionStart" in i) var s = { start: i.selectionStart, end: i.selectionEnd };
      else e: {
        s = (s = i.ownerDocument) && s.defaultView || window;
        var p = s.getSelection && s.getSelection();
        if (p && p.rangeCount !== 0) {
          s = p.anchorNode;
          var y = p.anchorOffset, g = p.focusNode;
          p = p.focusOffset;
          try {
            s.nodeType, g.nodeType;
          } catch {
            s = null;
            break e;
          }
          var E = 0, j = -1, D = -1, K = 0, re = 0, ie = i, te = null;
          t: for (; ; ) {
            for (var se; ie !== s || y !== 0 && ie.nodeType !== 3 || (j = E + y), ie !== g || p !== 0 && ie.nodeType !== 3 || (D = E + p), ie.nodeType === 3 && (E += ie.nodeValue.length), (se = ie.firstChild) !== null; )
              te = ie, ie = se;
            for (; ; ) {
              if (ie === i) break t;
              if (te === s && ++K === y && (j = E), te === g && ++re === p && (D = E), (se = ie.nextSibling) !== null) break;
              ie = te, te = ie.parentNode;
            }
            ie = se;
          }
          s = j === -1 || D === -1 ? null : { start: j, end: D };
        } else s = null;
      }
      s = s || { start: 0, end: 0 };
    } else s = null;
    for (Ef = { focusedElem: i, selectionRange: s }, Zu = !1, ce = o; ce !== null; ) if (o = ce, i = o.child, (o.subtreeFlags & 1028) !== 0 && i !== null) i.return = o, ce = i;
    else for (; ce !== null; ) {
      o = ce;
      try {
        var de = o.alternate;
        if ((o.flags & 1024) !== 0) switch (o.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (de !== null) {
              var he = de.memoizedProps, nt = de.memoizedState, z = o.stateNode, L = z.getSnapshotBeforeUpdate(o.elementType === o.type ? he : br(o.type, he), nt);
              z.__reactInternalSnapshotBeforeUpdate = L;
            }
            break;
          case 3:
            var U = o.stateNode.containerInfo;
            U.nodeType === 1 ? U.textContent = "" : U.nodeType === 9 && U.documentElement && U.removeChild(U.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(r(163));
        }
      } catch (oe) {
        et(o, o.return, oe);
      }
      if (i = o.sibling, i !== null) {
        i.return = o.return, ce = i;
        break;
      }
      ce = o.return;
    }
    return de = _x, _x = !1, de;
  }
  function Co(i, o, s) {
    var p = o.updateQueue;
    if (p = p !== null ? p.lastEffect : null, p !== null) {
      var y = p = p.next;
      do {
        if ((y.tag & i) === i) {
          var g = y.destroy;
          y.destroy = void 0, g !== void 0 && hd(o, s, g);
        }
        y = y.next;
      } while (y !== p);
    }
  }
  function Il(i, o) {
    if (o = o.updateQueue, o = o !== null ? o.lastEffect : null, o !== null) {
      var s = o = o.next;
      do {
        if ((s.tag & i) === i) {
          var p = s.create;
          s.destroy = p();
        }
        s = s.next;
      } while (s !== o);
    }
  }
  function vd(i) {
    var o = i.ref;
    if (o !== null) {
      var s = i.stateNode;
      switch (i.tag) {
        case 5:
          i = s;
          break;
        default:
          i = s;
      }
      typeof o == "function" ? o(i) : o.current = i;
    }
  }
  function Ox(i) {
    var o = i.alternate;
    o !== null && (i.alternate = null, Ox(o)), i.child = null, i.deletions = null, i.sibling = null, i.tag === 5 && (o = i.stateNode, o !== null && (delete o[Ir], delete o[go], delete o[jf], delete o[Sj], delete o[_j])), i.stateNode = null, i.return = null, i.dependencies = null, i.memoizedProps = null, i.memoizedState = null, i.pendingProps = null, i.stateNode = null, i.updateQueue = null;
  }
  function Px(i) {
    return i.tag === 5 || i.tag === 3 || i.tag === 4;
  }
  function Ax(i) {
    e: for (; ; ) {
      for (; i.sibling === null; ) {
        if (i.return === null || Px(i.return)) return null;
        i = i.return;
      }
      for (i.sibling.return = i.return, i = i.sibling; i.tag !== 5 && i.tag !== 6 && i.tag !== 18; ) {
        if (i.flags & 2 || i.child === null || i.tag === 4) continue e;
        i.child.return = i, i = i.child;
      }
      if (!(i.flags & 2)) return i.stateNode;
    }
  }
  function yd(i, o, s) {
    var p = i.tag;
    if (p === 5 || p === 6) i = i.stateNode, o ? s.nodeType === 8 ? s.parentNode.insertBefore(i, o) : s.insertBefore(i, o) : (s.nodeType === 8 ? (o = s.parentNode, o.insertBefore(i, s)) : (o = s, o.appendChild(i)), s = s._reactRootContainer, s != null || o.onclick !== null || (o.onclick = cl));
    else if (p !== 4 && (i = i.child, i !== null)) for (yd(i, o, s), i = i.sibling; i !== null; ) yd(i, o, s), i = i.sibling;
  }
  function md(i, o, s) {
    var p = i.tag;
    if (p === 5 || p === 6) i = i.stateNode, o ? s.insertBefore(i, o) : s.appendChild(i);
    else if (p !== 4 && (i = i.child, i !== null)) for (md(i, o, s), i = i.sibling; i !== null; ) md(i, o, s), i = i.sibling;
  }
  var wt = null, xr = !1;
  function Cn(i, o, s) {
    for (s = s.child; s !== null; ) Ex(i, o, s), s = s.sibling;
  }
  function Ex(i, o, s) {
    if (Mr && typeof Mr.onCommitFiberUnmount == "function") try {
      Mr.onCommitFiberUnmount(Ku, s);
    } catch {
    }
    switch (s.tag) {
      case 5:
        Tt || Zi(s, o);
      case 6:
        var p = wt, y = xr;
        wt = null, Cn(i, o, s), wt = p, xr = y, wt !== null && (xr ? (i = wt, s = s.stateNode, i.nodeType === 8 ? i.parentNode.removeChild(s) : i.removeChild(s)) : wt.removeChild(s.stateNode));
        break;
      case 18:
        wt !== null && (xr ? (i = wt, s = s.stateNode, i.nodeType === 8 ? kf(i.parentNode, s) : i.nodeType === 1 && kf(i, s), oo(i)) : kf(wt, s.stateNode));
        break;
      case 4:
        p = wt, y = xr, wt = s.stateNode.containerInfo, xr = !0, Cn(i, o, s), wt = p, xr = y;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Tt && (p = s.updateQueue, p !== null && (p = p.lastEffect, p !== null))) {
          y = p = p.next;
          do {
            var g = y, E = g.destroy;
            g = g.tag, E !== void 0 && ((g & 2) !== 0 || (g & 4) !== 0) && hd(s, o, E), y = y.next;
          } while (y !== p);
        }
        Cn(i, o, s);
        break;
      case 1:
        if (!Tt && (Zi(s, o), p = s.stateNode, typeof p.componentWillUnmount == "function")) try {
          p.props = s.memoizedProps, p.state = s.memoizedState, p.componentWillUnmount();
        } catch (j) {
          et(s, o, j);
        }
        Cn(i, o, s);
        break;
      case 21:
        Cn(i, o, s);
        break;
      case 22:
        s.mode & 1 ? (Tt = (p = Tt) || s.memoizedState !== null, Cn(i, o, s), Tt = p) : Cn(i, o, s);
        break;
      default:
        Cn(i, o, s);
    }
  }
  function Tx(i) {
    var o = i.updateQueue;
    if (o !== null) {
      i.updateQueue = null;
      var s = i.stateNode;
      s === null && (s = i.stateNode = new qj()), o.forEach(function(p) {
        var y = Xj.bind(null, i, p);
        s.has(p) || (s.add(p), p.then(y, y));
      });
    }
  }
  function wr(i, o) {
    var s = o.deletions;
    if (s !== null) for (var p = 0; p < s.length; p++) {
      var y = s[p];
      try {
        var g = i, E = o, j = E;
        e: for (; j !== null; ) {
          switch (j.tag) {
            case 5:
              wt = j.stateNode, xr = !1;
              break e;
            case 3:
              wt = j.stateNode.containerInfo, xr = !0;
              break e;
            case 4:
              wt = j.stateNode.containerInfo, xr = !0;
              break e;
          }
          j = j.return;
        }
        if (wt === null) throw Error(r(160));
        Ex(g, E, y), wt = null, xr = !1;
        var D = y.alternate;
        D !== null && (D.return = null), y.return = null;
      } catch (K) {
        et(y, o, K);
      }
    }
    if (o.subtreeFlags & 12854) for (o = o.child; o !== null; ) Cx(o, i), o = o.sibling;
  }
  function Cx(i, o) {
    var s = i.alternate, p = i.flags;
    switch (i.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (wr(o, i), Rr(i), p & 4) {
          try {
            Co(3, i, i.return), Il(3, i);
          } catch (he) {
            et(i, i.return, he);
          }
          try {
            Co(5, i, i.return);
          } catch (he) {
            et(i, i.return, he);
          }
        }
        break;
      case 1:
        wr(o, i), Rr(i), p & 512 && s !== null && Zi(s, s.return);
        break;
      case 5:
        if (wr(o, i), Rr(i), p & 512 && s !== null && Zi(s, s.return), i.flags & 32) {
          var y = i.stateNode;
          try {
            Xa(y, "");
          } catch (he) {
            et(i, i.return, he);
          }
        }
        if (p & 4 && (y = i.stateNode, y != null)) {
          var g = i.memoizedProps, E = s !== null ? s.memoizedProps : g, j = i.type, D = i.updateQueue;
          if (i.updateQueue = null, D !== null) try {
            j === "input" && g.type === "radio" && g.name != null && Je(y, g), Gc(j, E);
            var K = Gc(j, g);
            for (E = 0; E < D.length; E += 2) {
              var re = D[E], ie = D[E + 1];
              re === "style" ? f0(y, ie) : re === "dangerouslySetInnerHTML" ? s0(y, ie) : re === "children" ? Xa(y, ie) : A(y, re, ie, K);
            }
            switch (j) {
              case "input":
                vt(y, g);
                break;
              case "textarea":
                Ga(y, g);
                break;
              case "select":
                var te = y._wrapperState.wasMultiple;
                y._wrapperState.wasMultiple = !!g.multiple;
                var se = g.value;
                se != null ? Nt(y, !!g.multiple, se, !1) : te !== !!g.multiple && (g.defaultValue != null ? Nt(
                  y,
                  !!g.multiple,
                  g.defaultValue,
                  !0
                ) : Nt(y, !!g.multiple, g.multiple ? [] : "", !1));
            }
            y[go] = g;
          } catch (he) {
            et(i, i.return, he);
          }
        }
        break;
      case 6:
        if (wr(o, i), Rr(i), p & 4) {
          if (i.stateNode === null) throw Error(r(162));
          y = i.stateNode, g = i.memoizedProps;
          try {
            y.nodeValue = g;
          } catch (he) {
            et(i, i.return, he);
          }
        }
        break;
      case 3:
        if (wr(o, i), Rr(i), p & 4 && s !== null && s.memoizedState.isDehydrated) try {
          oo(o.containerInfo);
        } catch (he) {
          et(i, i.return, he);
        }
        break;
      case 4:
        wr(o, i), Rr(i);
        break;
      case 13:
        wr(o, i), Rr(i), y = i.child, y.flags & 8192 && (g = y.memoizedState !== null, y.stateNode.isHidden = g, !g || y.alternate !== null && y.alternate.memoizedState !== null || (xd = rt())), p & 4 && Tx(i);
        break;
      case 22:
        if (re = s !== null && s.memoizedState !== null, i.mode & 1 ? (Tt = (K = Tt) || re, wr(o, i), Tt = K) : wr(o, i), Rr(i), p & 8192) {
          if (K = i.memoizedState !== null, (i.stateNode.isHidden = K) && !re && (i.mode & 1) !== 0) for (ce = i, re = i.child; re !== null; ) {
            for (ie = ce = re; ce !== null; ) {
              switch (te = ce, se = te.child, te.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Co(4, te, te.return);
                  break;
                case 1:
                  Zi(te, te.return);
                  var de = te.stateNode;
                  if (typeof de.componentWillUnmount == "function") {
                    p = te, s = te.return;
                    try {
                      o = p, de.props = o.memoizedProps, de.state = o.memoizedState, de.componentWillUnmount();
                    } catch (he) {
                      et(p, s, he);
                    }
                  }
                  break;
                case 5:
                  Zi(te, te.return);
                  break;
                case 22:
                  if (te.memoizedState !== null) {
                    Mx(ie);
                    continue;
                  }
              }
              se !== null ? (se.return = te, ce = se) : Mx(ie);
            }
            re = re.sibling;
          }
          e: for (re = null, ie = i; ; ) {
            if (ie.tag === 5) {
              if (re === null) {
                re = ie;
                try {
                  y = ie.stateNode, K ? (g = y.style, typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : g.display = "none") : (j = ie.stateNode, D = ie.memoizedProps.style, E = D != null && D.hasOwnProperty("display") ? D.display : null, j.style.display = c0("display", E));
                } catch (he) {
                  et(i, i.return, he);
                }
              }
            } else if (ie.tag === 6) {
              if (re === null) try {
                ie.stateNode.nodeValue = K ? "" : ie.memoizedProps;
              } catch (he) {
                et(i, i.return, he);
              }
            } else if ((ie.tag !== 22 && ie.tag !== 23 || ie.memoizedState === null || ie === i) && ie.child !== null) {
              ie.child.return = ie, ie = ie.child;
              continue;
            }
            if (ie === i) break e;
            for (; ie.sibling === null; ) {
              if (ie.return === null || ie.return === i) break e;
              re === ie && (re = null), ie = ie.return;
            }
            re === ie && (re = null), ie.sibling.return = ie.return, ie = ie.sibling;
          }
        }
        break;
      case 19:
        wr(o, i), Rr(i), p & 4 && Tx(i);
        break;
      case 21:
        break;
      default:
        wr(
          o,
          i
        ), Rr(i);
    }
  }
  function Rr(i) {
    var o = i.flags;
    if (o & 2) {
      try {
        e: {
          for (var s = i.return; s !== null; ) {
            if (Px(s)) {
              var p = s;
              break e;
            }
            s = s.return;
          }
          throw Error(r(160));
        }
        switch (p.tag) {
          case 5:
            var y = p.stateNode;
            p.flags & 32 && (Xa(y, ""), p.flags &= -33);
            var g = Ax(i);
            md(i, g, y);
            break;
          case 3:
          case 4:
            var E = p.stateNode.containerInfo, j = Ax(i);
            yd(i, j, E);
            break;
          default:
            throw Error(r(161));
        }
      } catch (D) {
        et(i, i.return, D);
      }
      i.flags &= -3;
    }
    o & 4096 && (i.flags &= -4097);
  }
  function zj(i, o, s) {
    ce = i, kx(i);
  }
  function kx(i, o, s) {
    for (var p = (i.mode & 1) !== 0; ce !== null; ) {
      var y = ce, g = y.child;
      if (y.tag === 22 && p) {
        var E = y.memoizedState !== null || Ml;
        if (!E) {
          var j = y.alternate, D = j !== null && j.memoizedState !== null || Tt;
          j = Ml;
          var K = Tt;
          if (Ml = E, (Tt = D) && !K) for (ce = y; ce !== null; ) E = ce, D = E.child, E.tag === 22 && E.memoizedState !== null ? Ix(y) : D !== null ? (D.return = E, ce = D) : Ix(y);
          for (; g !== null; ) ce = g, kx(g), g = g.sibling;
          ce = y, Ml = j, Tt = K;
        }
        jx(i);
      } else (y.subtreeFlags & 8772) !== 0 && g !== null ? (g.return = y, ce = g) : jx(i);
    }
  }
  function jx(i) {
    for (; ce !== null; ) {
      var o = ce;
      if ((o.flags & 8772) !== 0) {
        var s = o.alternate;
        try {
          if ((o.flags & 8772) !== 0) switch (o.tag) {
            case 0:
            case 11:
            case 15:
              Tt || Il(5, o);
              break;
            case 1:
              var p = o.stateNode;
              if (o.flags & 4 && !Tt) if (s === null) p.componentDidMount();
              else {
                var y = o.elementType === o.type ? s.memoizedProps : br(o.type, s.memoizedProps);
                p.componentDidUpdate(y, s.memoizedState, p.__reactInternalSnapshotBeforeUpdate);
              }
              var g = o.updateQueue;
              g !== null && Mb(o, g, p);
              break;
            case 3:
              var E = o.updateQueue;
              if (E !== null) {
                if (s = null, o.child !== null) switch (o.child.tag) {
                  case 5:
                    s = o.child.stateNode;
                    break;
                  case 1:
                    s = o.child.stateNode;
                }
                Mb(o, E, s);
              }
              break;
            case 5:
              var j = o.stateNode;
              if (s === null && o.flags & 4) {
                s = j;
                var D = o.memoizedProps;
                switch (o.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    D.autoFocus && s.focus();
                    break;
                  case "img":
                    D.src && (s.src = D.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (o.memoizedState === null) {
                var K = o.alternate;
                if (K !== null) {
                  var re = K.memoizedState;
                  if (re !== null) {
                    var ie = re.dehydrated;
                    ie !== null && oo(ie);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(r(163));
          }
          Tt || o.flags & 512 && vd(o);
        } catch (te) {
          et(o, o.return, te);
        }
      }
      if (o === i) {
        ce = null;
        break;
      }
      if (s = o.sibling, s !== null) {
        s.return = o.return, ce = s;
        break;
      }
      ce = o.return;
    }
  }
  function Mx(i) {
    for (; ce !== null; ) {
      var o = ce;
      if (o === i) {
        ce = null;
        break;
      }
      var s = o.sibling;
      if (s !== null) {
        s.return = o.return, ce = s;
        break;
      }
      ce = o.return;
    }
  }
  function Ix(i) {
    for (; ce !== null; ) {
      var o = ce;
      try {
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            var s = o.return;
            try {
              Il(4, o);
            } catch (D) {
              et(o, s, D);
            }
            break;
          case 1:
            var p = o.stateNode;
            if (typeof p.componentDidMount == "function") {
              var y = o.return;
              try {
                p.componentDidMount();
              } catch (D) {
                et(o, y, D);
              }
            }
            var g = o.return;
            try {
              vd(o);
            } catch (D) {
              et(o, g, D);
            }
            break;
          case 5:
            var E = o.return;
            try {
              vd(o);
            } catch (D) {
              et(o, E, D);
            }
        }
      } catch (D) {
        et(o, o.return, D);
      }
      if (o === i) {
        ce = null;
        break;
      }
      var j = o.sibling;
      if (j !== null) {
        j.return = o.return, ce = j;
        break;
      }
      ce = o.return;
    }
  }
  var Fj = Math.ceil, $l = T.ReactCurrentDispatcher, gd = T.ReactCurrentOwner, ir = T.ReactCurrentBatchConfig, Me = 0, mt = null, at = null, St = 0, Vt = 0, Ji = On(0), st = 0, ko = null, ni = 0, Nl = 0, bd = 0, jo = null, qt = null, xd = 0, ea = 1 / 0, tn = null, Rl = !1, wd = null, kn = null, Dl = !1, jn = null, Ll = 0, Mo = 0, Sd = null, ql = -1, Bl = 0;
  function It() {
    return (Me & 6) !== 0 ? rt() : ql !== -1 ? ql : ql = rt();
  }
  function Mn(i) {
    return (i.mode & 1) === 0 ? 1 : (Me & 2) !== 0 && St !== 0 ? St & -St : Pj.transition !== null ? (Bl === 0 && (Bl = A0()), Bl) : (i = Le, i !== 0 || (i = window.event, i = i === void 0 ? 16 : N0(i.type)), i);
  }
  function Sr(i, o, s, p) {
    if (50 < Mo) throw Mo = 0, Sd = null, Error(r(185));
    to(i, s, p), ((Me & 2) === 0 || i !== mt) && (i === mt && ((Me & 2) === 0 && (Nl |= s), st === 4 && In(i, St)), Bt(i, p), s === 1 && Me === 0 && (o.mode & 1) === 0 && (ea = rt() + 500, hl && An()));
  }
  function Bt(i, o) {
    var s = i.callbackNode;
    Pk(i, o);
    var p = Xu(i, i === mt ? St : 0);
    if (p === 0) s !== null && _0(s), i.callbackNode = null, i.callbackPriority = 0;
    else if (o = p & -p, i.callbackPriority !== o) {
      if (s != null && _0(s), o === 1) i.tag === 0 ? Oj(Nx.bind(null, i)) : xb(Nx.bind(null, i)), xj(function() {
        (Me & 6) === 0 && An();
      }), s = null;
      else {
        switch (E0(p)) {
          case 1:
            s = ef;
            break;
          case 4:
            s = O0;
            break;
          case 16:
            s = Hu;
            break;
          case 536870912:
            s = P0;
            break;
          default:
            s = Hu;
        }
        s = Ux(s, $x.bind(null, i));
      }
      i.callbackPriority = o, i.callbackNode = s;
    }
  }
  function $x(i, o) {
    if (ql = -1, Bl = 0, (Me & 6) !== 0) throw Error(r(327));
    var s = i.callbackNode;
    if (ta() && i.callbackNode !== s) return null;
    var p = Xu(i, i === mt ? St : 0);
    if (p === 0) return null;
    if ((p & 30) !== 0 || (p & i.expiredLanes) !== 0 || o) o = zl(i, p);
    else {
      o = p;
      var y = Me;
      Me |= 2;
      var g = Dx();
      (mt !== i || St !== o) && (tn = null, ea = rt() + 500, ai(i, o));
      do
        try {
          Hj();
          break;
        } catch (j) {
          Rx(i, j);
        }
      while (!0);
      Bf(), $l.current = g, Me = y, at !== null ? o = 0 : (mt = null, St = 0, o = st);
    }
    if (o !== 0) {
      if (o === 2 && (y = tf(i), y !== 0 && (p = y, o = _d(i, y))), o === 1) throw s = ko, ai(i, 0), In(i, p), Bt(i, rt()), s;
      if (o === 6) In(i, p);
      else {
        if (y = i.current.alternate, (p & 30) === 0 && !Uj(y) && (o = zl(i, p), o === 2 && (g = tf(i), g !== 0 && (p = g, o = _d(i, g))), o === 1)) throw s = ko, ai(i, 0), In(i, p), Bt(i, rt()), s;
        switch (i.finishedWork = y, i.finishedLanes = p, o) {
          case 0:
          case 1:
            throw Error(r(345));
          case 2:
            oi(i, qt, tn);
            break;
          case 3:
            if (In(i, p), (p & 130023424) === p && (o = xd + 500 - rt(), 10 < o)) {
              if (Xu(i, 0) !== 0) break;
              if (y = i.suspendedLanes, (y & p) !== p) {
                It(), i.pingedLanes |= i.suspendedLanes & y;
                break;
              }
              i.timeoutHandle = Cf(oi.bind(null, i, qt, tn), o);
              break;
            }
            oi(i, qt, tn);
            break;
          case 4:
            if (In(i, p), (p & 4194240) === p) break;
            for (o = i.eventTimes, y = -1; 0 < p; ) {
              var E = 31 - yr(p);
              g = 1 << E, E = o[E], E > y && (y = E), p &= ~g;
            }
            if (p = y, p = rt() - p, p = (120 > p ? 120 : 480 > p ? 480 : 1080 > p ? 1080 : 1920 > p ? 1920 : 3e3 > p ? 3e3 : 4320 > p ? 4320 : 1960 * Fj(p / 1960)) - p, 10 < p) {
              i.timeoutHandle = Cf(oi.bind(null, i, qt, tn), p);
              break;
            }
            oi(i, qt, tn);
            break;
          case 5:
            oi(i, qt, tn);
            break;
          default:
            throw Error(r(329));
        }
      }
    }
    return Bt(i, rt()), i.callbackNode === s ? $x.bind(null, i) : null;
  }
  function _d(i, o) {
    var s = jo;
    return i.current.memoizedState.isDehydrated && (ai(i, o).flags |= 256), i = zl(i, o), i !== 2 && (o = qt, qt = s, o !== null && Od(o)), i;
  }
  function Od(i) {
    qt === null ? qt = i : qt.push.apply(qt, i);
  }
  function Uj(i) {
    for (var o = i; ; ) {
      if (o.flags & 16384) {
        var s = o.updateQueue;
        if (s !== null && (s = s.stores, s !== null)) for (var p = 0; p < s.length; p++) {
          var y = s[p], g = y.getSnapshot;
          y = y.value;
          try {
            if (!mr(g(), y)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (s = o.child, o.subtreeFlags & 16384 && s !== null) s.return = o, o = s;
      else {
        if (o === i) break;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === i) return !0;
          o = o.return;
        }
        o.sibling.return = o.return, o = o.sibling;
      }
    }
    return !0;
  }
  function In(i, o) {
    for (o &= ~bd, o &= ~Nl, i.suspendedLanes |= o, i.pingedLanes &= ~o, i = i.expirationTimes; 0 < o; ) {
      var s = 31 - yr(o), p = 1 << s;
      i[s] = -1, o &= ~p;
    }
  }
  function Nx(i) {
    if ((Me & 6) !== 0) throw Error(r(327));
    ta();
    var o = Xu(i, 0);
    if ((o & 1) === 0) return Bt(i, rt()), null;
    var s = zl(i, o);
    if (i.tag !== 0 && s === 2) {
      var p = tf(i);
      p !== 0 && (o = p, s = _d(i, p));
    }
    if (s === 1) throw s = ko, ai(i, 0), In(i, o), Bt(i, rt()), s;
    if (s === 6) throw Error(r(345));
    return i.finishedWork = i.current.alternate, i.finishedLanes = o, oi(i, qt, tn), Bt(i, rt()), null;
  }
  function Pd(i, o) {
    var s = Me;
    Me |= 1;
    try {
      return i(o);
    } finally {
      Me = s, Me === 0 && (ea = rt() + 500, hl && An());
    }
  }
  function ii(i) {
    jn !== null && jn.tag === 0 && (Me & 6) === 0 && ta();
    var o = Me;
    Me |= 1;
    var s = ir.transition, p = Le;
    try {
      if (ir.transition = null, Le = 1, i) return i();
    } finally {
      Le = p, ir.transition = s, Me = o, (Me & 6) === 0 && An();
    }
  }
  function Ad() {
    Vt = Ji.current, Ke(Ji);
  }
  function ai(i, o) {
    i.finishedWork = null, i.finishedLanes = 0;
    var s = i.timeoutHandle;
    if (s !== -1 && (i.timeoutHandle = -1, bj(s)), at !== null) for (s = at.return; s !== null; ) {
      var p = s;
      switch (Nf(p), p.tag) {
        case 1:
          p = p.type.childContextTypes, p != null && dl();
          break;
        case 3:
          Yi(), Ke(Rt), Ke(Pt), Vf();
          break;
        case 5:
          Kf(p);
          break;
        case 4:
          Yi();
          break;
        case 13:
          Ke(Ye);
          break;
        case 19:
          Ke(Ye);
          break;
        case 10:
          zf(p.type._context);
          break;
        case 22:
        case 23:
          Ad();
      }
      s = s.return;
    }
    if (mt = i, at = i = $n(i.current, null), St = Vt = o, st = 0, ko = null, bd = Nl = ni = 0, qt = jo = null, ei !== null) {
      for (o = 0; o < ei.length; o++) if (s = ei[o], p = s.interleaved, p !== null) {
        s.interleaved = null;
        var y = p.next, g = s.pending;
        if (g !== null) {
          var E = g.next;
          g.next = y, p.next = E;
        }
        s.pending = p;
      }
      ei = null;
    }
    return i;
  }
  function Rx(i, o) {
    do {
      var s = at;
      try {
        if (Bf(), Ol.current = Tl, Pl) {
          for (var p = Qe.memoizedState; p !== null; ) {
            var y = p.queue;
            y !== null && (y.pending = null), p = p.next;
          }
          Pl = !1;
        }
        if (ri = 0, yt = lt = Qe = null, Oo = !1, Po = 0, gd.current = null, s === null || s.return === null) {
          st = 1, ko = o, at = null;
          break;
        }
        e: {
          var g = i, E = s.return, j = s, D = o;
          if (o = St, j.flags |= 32768, D !== null && typeof D == "object" && typeof D.then == "function") {
            var K = D, re = j, ie = re.tag;
            if ((re.mode & 1) === 0 && (ie === 0 || ie === 11 || ie === 15)) {
              var te = re.alternate;
              te ? (re.updateQueue = te.updateQueue, re.memoizedState = te.memoizedState, re.lanes = te.lanes) : (re.updateQueue = null, re.memoizedState = null);
            }
            var se = ux(E);
            if (se !== null) {
              se.flags &= -257, lx(se, E, j, g, o), se.mode & 1 && ox(g, K, o), o = se, D = K;
              var de = o.updateQueue;
              if (de === null) {
                var he = /* @__PURE__ */ new Set();
                he.add(D), o.updateQueue = he;
              } else de.add(D);
              break e;
            } else {
              if ((o & 1) === 0) {
                ox(g, K, o), Ed();
                break e;
              }
              D = Error(r(426));
            }
          } else if (Ve && j.mode & 1) {
            var nt = ux(E);
            if (nt !== null) {
              (nt.flags & 65536) === 0 && (nt.flags |= 256), lx(nt, E, j, g, o), Lf(Qi(D, j));
              break e;
            }
          }
          g = D = Qi(D, j), st !== 4 && (st = 2), jo === null ? jo = [g] : jo.push(g), g = E;
          do {
            switch (g.tag) {
              case 3:
                g.flags |= 65536, o &= -o, g.lanes |= o;
                var z = ix(g, D, o);
                jb(g, z);
                break e;
              case 1:
                j = D;
                var L = g.type, U = g.stateNode;
                if ((g.flags & 128) === 0 && (typeof L.getDerivedStateFromError == "function" || U !== null && typeof U.componentDidCatch == "function" && (kn === null || !kn.has(U)))) {
                  g.flags |= 65536, o &= -o, g.lanes |= o;
                  var oe = ax(g, j, o);
                  jb(g, oe);
                  break e;
                }
            }
            g = g.return;
          } while (g !== null);
        }
        qx(s);
      } catch (ve) {
        o = ve, at === s && s !== null && (at = s = s.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Dx() {
    var i = $l.current;
    return $l.current = Tl, i === null ? Tl : i;
  }
  function Ed() {
    (st === 0 || st === 3 || st === 2) && (st = 4), mt === null || (ni & 268435455) === 0 && (Nl & 268435455) === 0 || In(mt, St);
  }
  function zl(i, o) {
    var s = Me;
    Me |= 2;
    var p = Dx();
    (mt !== i || St !== o) && (tn = null, ai(i, o));
    do
      try {
        Wj();
        break;
      } catch (y) {
        Rx(i, y);
      }
    while (!0);
    if (Bf(), Me = s, $l.current = p, at !== null) throw Error(r(261));
    return mt = null, St = 0, st;
  }
  function Wj() {
    for (; at !== null; ) Lx(at);
  }
  function Hj() {
    for (; at !== null && !yk(); ) Lx(at);
  }
  function Lx(i) {
    var o = Fx(i.alternate, i, Vt);
    i.memoizedProps = i.pendingProps, o === null ? qx(i) : at = o, gd.current = null;
  }
  function qx(i) {
    var o = i;
    do {
      var s = o.alternate;
      if (i = o.return, (o.flags & 32768) === 0) {
        if (s = Dj(s, o, Vt), s !== null) {
          at = s;
          return;
        }
      } else {
        if (s = Lj(s, o), s !== null) {
          s.flags &= 32767, at = s;
          return;
        }
        if (i !== null) i.flags |= 32768, i.subtreeFlags = 0, i.deletions = null;
        else {
          st = 6, at = null;
          return;
        }
      }
      if (o = o.sibling, o !== null) {
        at = o;
        return;
      }
      at = o = i;
    } while (o !== null);
    st === 0 && (st = 5);
  }
  function oi(i, o, s) {
    var p = Le, y = ir.transition;
    try {
      ir.transition = null, Le = 1, Kj(i, o, s, p);
    } finally {
      ir.transition = y, Le = p;
    }
    return null;
  }
  function Kj(i, o, s, p) {
    do
      ta();
    while (jn !== null);
    if ((Me & 6) !== 0) throw Error(r(327));
    s = i.finishedWork;
    var y = i.finishedLanes;
    if (s === null) return null;
    if (i.finishedWork = null, i.finishedLanes = 0, s === i.current) throw Error(r(177));
    i.callbackNode = null, i.callbackPriority = 0;
    var g = s.lanes | s.childLanes;
    if (Ak(i, g), i === mt && (at = mt = null, St = 0), (s.subtreeFlags & 2064) === 0 && (s.flags & 2064) === 0 || Dl || (Dl = !0, Ux(Hu, function() {
      return ta(), null;
    })), g = (s.flags & 15990) !== 0, (s.subtreeFlags & 15990) !== 0 || g) {
      g = ir.transition, ir.transition = null;
      var E = Le;
      Le = 1;
      var j = Me;
      Me |= 4, gd.current = null, Bj(i, s), Cx(s, i), dj(Ef), Zu = !!Af, Ef = Af = null, i.current = s, zj(s), mk(), Me = j, Le = E, ir.transition = g;
    } else i.current = s;
    if (Dl && (Dl = !1, jn = i, Ll = y), g = i.pendingLanes, g === 0 && (kn = null), xk(s.stateNode), Bt(i, rt()), o !== null) for (p = i.onRecoverableError, s = 0; s < o.length; s++) y = o[s], p(y.value, { componentStack: y.stack, digest: y.digest });
    if (Rl) throw Rl = !1, i = wd, wd = null, i;
    return (Ll & 1) !== 0 && i.tag !== 0 && ta(), g = i.pendingLanes, (g & 1) !== 0 ? i === Sd ? Mo++ : (Mo = 0, Sd = i) : Mo = 0, An(), null;
  }
  function ta() {
    if (jn !== null) {
      var i = E0(Ll), o = ir.transition, s = Le;
      try {
        if (ir.transition = null, Le = 16 > i ? 16 : i, jn === null) var p = !1;
        else {
          if (i = jn, jn = null, Ll = 0, (Me & 6) !== 0) throw Error(r(331));
          var y = Me;
          for (Me |= 4, ce = i.current; ce !== null; ) {
            var g = ce, E = g.child;
            if ((ce.flags & 16) !== 0) {
              var j = g.deletions;
              if (j !== null) {
                for (var D = 0; D < j.length; D++) {
                  var K = j[D];
                  for (ce = K; ce !== null; ) {
                    var re = ce;
                    switch (re.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Co(8, re, g);
                    }
                    var ie = re.child;
                    if (ie !== null) ie.return = re, ce = ie;
                    else for (; ce !== null; ) {
                      re = ce;
                      var te = re.sibling, se = re.return;
                      if (Ox(re), re === K) {
                        ce = null;
                        break;
                      }
                      if (te !== null) {
                        te.return = se, ce = te;
                        break;
                      }
                      ce = se;
                    }
                  }
                }
                var de = g.alternate;
                if (de !== null) {
                  var he = de.child;
                  if (he !== null) {
                    de.child = null;
                    do {
                      var nt = he.sibling;
                      he.sibling = null, he = nt;
                    } while (he !== null);
                  }
                }
                ce = g;
              }
            }
            if ((g.subtreeFlags & 2064) !== 0 && E !== null) E.return = g, ce = E;
            else e: for (; ce !== null; ) {
              if (g = ce, (g.flags & 2048) !== 0) switch (g.tag) {
                case 0:
                case 11:
                case 15:
                  Co(9, g, g.return);
              }
              var z = g.sibling;
              if (z !== null) {
                z.return = g.return, ce = z;
                break e;
              }
              ce = g.return;
            }
          }
          var L = i.current;
          for (ce = L; ce !== null; ) {
            E = ce;
            var U = E.child;
            if ((E.subtreeFlags & 2064) !== 0 && U !== null) U.return = E, ce = U;
            else e: for (E = L; ce !== null; ) {
              if (j = ce, (j.flags & 2048) !== 0) try {
                switch (j.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Il(9, j);
                }
              } catch (ve) {
                et(j, j.return, ve);
              }
              if (j === E) {
                ce = null;
                break e;
              }
              var oe = j.sibling;
              if (oe !== null) {
                oe.return = j.return, ce = oe;
                break e;
              }
              ce = j.return;
            }
          }
          if (Me = y, An(), Mr && typeof Mr.onPostCommitFiberRoot == "function") try {
            Mr.onPostCommitFiberRoot(Ku, i);
          } catch {
          }
          p = !0;
        }
        return p;
      } finally {
        Le = s, ir.transition = o;
      }
    }
    return !1;
  }
  function Bx(i, o, s) {
    o = Qi(s, o), o = ix(i, o, 1), i = Tn(i, o, 1), o = It(), i !== null && (to(i, 1, o), Bt(i, o));
  }
  function et(i, o, s) {
    if (i.tag === 3) Bx(i, i, s);
    else for (; o !== null; ) {
      if (o.tag === 3) {
        Bx(o, i, s);
        break;
      } else if (o.tag === 1) {
        var p = o.stateNode;
        if (typeof o.type.getDerivedStateFromError == "function" || typeof p.componentDidCatch == "function" && (kn === null || !kn.has(p))) {
          i = Qi(s, i), i = ax(o, i, 1), o = Tn(o, i, 1), i = It(), o !== null && (to(o, 1, i), Bt(o, i));
          break;
        }
      }
      o = o.return;
    }
  }
  function Gj(i, o, s) {
    var p = i.pingCache;
    p !== null && p.delete(o), o = It(), i.pingedLanes |= i.suspendedLanes & s, mt === i && (St & s) === s && (st === 4 || st === 3 && (St & 130023424) === St && 500 > rt() - xd ? ai(i, 0) : bd |= s), Bt(i, o);
  }
  function zx(i, o) {
    o === 0 && ((i.mode & 1) === 0 ? o = 1 : (o = Vu, Vu <<= 1, (Vu & 130023424) === 0 && (Vu = 4194304)));
    var s = It();
    i = Zr(i, o), i !== null && (to(i, o, s), Bt(i, s));
  }
  function Vj(i) {
    var o = i.memoizedState, s = 0;
    o !== null && (s = o.retryLane), zx(i, s);
  }
  function Xj(i, o) {
    var s = 0;
    switch (i.tag) {
      case 13:
        var p = i.stateNode, y = i.memoizedState;
        y !== null && (s = y.retryLane);
        break;
      case 19:
        p = i.stateNode;
        break;
      default:
        throw Error(r(314));
    }
    p !== null && p.delete(o), zx(i, s);
  }
  var Fx;
  Fx = function(i, o, s) {
    if (i !== null) if (i.memoizedProps !== o.pendingProps || Rt.current) Lt = !0;
    else {
      if ((i.lanes & s) === 0 && (o.flags & 128) === 0) return Lt = !1, Rj(i, o, s);
      Lt = (i.flags & 131072) !== 0;
    }
    else Lt = !1, Ve && (o.flags & 1048576) !== 0 && wb(o, yl, o.index);
    switch (o.lanes = 0, o.tag) {
      case 2:
        var p = o.type;
        jl(i, o), i = o.pendingProps;
        var y = Ui(o, Pt.current);
        Xi(o, s), y = Qf(null, o, p, i, y, s);
        var g = Zf();
        return o.flags |= 1, typeof y == "object" && y !== null && typeof y.render == "function" && y.$$typeof === void 0 ? (o.tag = 1, o.memoizedState = null, o.updateQueue = null, Dt(p) ? (g = !0, pl(o)) : g = !1, o.memoizedState = y.state !== null && y.state !== void 0 ? y.state : null, Wf(o), y.updater = Cl, o.stateNode = y, y._reactInternals = o, id(o, p, i, s), o = ld(null, o, p, !0, g, s)) : (o.tag = 0, Ve && g && $f(o), Mt(null, o, y, s), o = o.child), o;
      case 16:
        p = o.elementType;
        e: {
          switch (jl(i, o), i = o.pendingProps, y = p._init, p = y(p._payload), o.type = p, y = o.tag = Qj(p), i = br(p, i), y) {
            case 0:
              o = ud(null, o, p, i, s);
              break e;
            case 1:
              o = hx(null, o, p, i, s);
              break e;
            case 11:
              o = sx(null, o, p, i, s);
              break e;
            case 14:
              o = cx(null, o, p, br(p.type, i), s);
              break e;
          }
          throw Error(r(
            306,
            p,
            ""
          ));
        }
        return o;
      case 0:
        return p = o.type, y = o.pendingProps, y = o.elementType === p ? y : br(p, y), ud(i, o, p, y, s);
      case 1:
        return p = o.type, y = o.pendingProps, y = o.elementType === p ? y : br(p, y), hx(i, o, p, y, s);
      case 3:
        e: {
          if (vx(o), i === null) throw Error(r(387));
          p = o.pendingProps, g = o.memoizedState, y = g.element, kb(i, o), Sl(o, p, null, s);
          var E = o.memoizedState;
          if (p = E.element, g.isDehydrated) if (g = { element: p, isDehydrated: !1, cache: E.cache, pendingSuspenseBoundaries: E.pendingSuspenseBoundaries, transitions: E.transitions }, o.updateQueue.baseState = g, o.memoizedState = g, o.flags & 256) {
            y = Qi(Error(r(423)), o), o = yx(i, o, p, s, y);
            break e;
          } else if (p !== y) {
            y = Qi(Error(r(424)), o), o = yx(i, o, p, s, y);
            break e;
          } else for (Gt = _n(o.stateNode.containerInfo.firstChild), Kt = o, Ve = !0, gr = null, s = Tb(o, null, p, s), o.child = s; s; ) s.flags = s.flags & -3 | 4096, s = s.sibling;
          else {
            if (Ki(), p === y) {
              o = en(i, o, s);
              break e;
            }
            Mt(i, o, p, s);
          }
          o = o.child;
        }
        return o;
      case 5:
        return Ib(o), i === null && Df(o), p = o.type, y = o.pendingProps, g = i !== null ? i.memoizedProps : null, E = y.children, Tf(p, y) ? E = null : g !== null && Tf(p, g) && (o.flags |= 32), px(i, o), Mt(i, o, E, s), o.child;
      case 6:
        return i === null && Df(o), null;
      case 13:
        return mx(i, o, s);
      case 4:
        return Hf(o, o.stateNode.containerInfo), p = o.pendingProps, i === null ? o.child = Gi(o, null, p, s) : Mt(i, o, p, s), o.child;
      case 11:
        return p = o.type, y = o.pendingProps, y = o.elementType === p ? y : br(p, y), sx(i, o, p, y, s);
      case 7:
        return Mt(i, o, o.pendingProps, s), o.child;
      case 8:
        return Mt(i, o, o.pendingProps.children, s), o.child;
      case 12:
        return Mt(i, o, o.pendingProps.children, s), o.child;
      case 10:
        e: {
          if (p = o.type._context, y = o.pendingProps, g = o.memoizedProps, E = y.value, Ue(bl, p._currentValue), p._currentValue = E, g !== null) if (mr(g.value, E)) {
            if (g.children === y.children && !Rt.current) {
              o = en(i, o, s);
              break e;
            }
          } else for (g = o.child, g !== null && (g.return = o); g !== null; ) {
            var j = g.dependencies;
            if (j !== null) {
              E = g.child;
              for (var D = j.firstContext; D !== null; ) {
                if (D.context === p) {
                  if (g.tag === 1) {
                    D = Jr(-1, s & -s), D.tag = 2;
                    var K = g.updateQueue;
                    if (K !== null) {
                      K = K.shared;
                      var re = K.pending;
                      re === null ? D.next = D : (D.next = re.next, re.next = D), K.pending = D;
                    }
                  }
                  g.lanes |= s, D = g.alternate, D !== null && (D.lanes |= s), Ff(
                    g.return,
                    s,
                    o
                  ), j.lanes |= s;
                  break;
                }
                D = D.next;
              }
            } else if (g.tag === 10) E = g.type === o.type ? null : g.child;
            else if (g.tag === 18) {
              if (E = g.return, E === null) throw Error(r(341));
              E.lanes |= s, j = E.alternate, j !== null && (j.lanes |= s), Ff(E, s, o), E = g.sibling;
            } else E = g.child;
            if (E !== null) E.return = g;
            else for (E = g; E !== null; ) {
              if (E === o) {
                E = null;
                break;
              }
              if (g = E.sibling, g !== null) {
                g.return = E.return, E = g;
                break;
              }
              E = E.return;
            }
            g = E;
          }
          Mt(i, o, y.children, s), o = o.child;
        }
        return o;
      case 9:
        return y = o.type, p = o.pendingProps.children, Xi(o, s), y = rr(y), p = p(y), o.flags |= 1, Mt(i, o, p, s), o.child;
      case 14:
        return p = o.type, y = br(p, o.pendingProps), y = br(p.type, y), cx(i, o, p, y, s);
      case 15:
        return fx(i, o, o.type, o.pendingProps, s);
      case 17:
        return p = o.type, y = o.pendingProps, y = o.elementType === p ? y : br(p, y), jl(i, o), o.tag = 1, Dt(p) ? (i = !0, pl(o)) : i = !1, Xi(o, s), rx(o, p, y), id(o, p, y, s), ld(null, o, p, !0, i, s);
      case 19:
        return bx(i, o, s);
      case 22:
        return dx(i, o, s);
    }
    throw Error(r(156, o.tag));
  };
  function Ux(i, o) {
    return S0(i, o);
  }
  function Yj(i, o, s, p) {
    this.tag = i, this.key = s, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = o, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = p, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ar(i, o, s, p) {
    return new Yj(i, o, s, p);
  }
  function Td(i) {
    return i = i.prototype, !(!i || !i.isReactComponent);
  }
  function Qj(i) {
    if (typeof i == "function") return Td(i) ? 1 : 0;
    if (i != null) {
      if (i = i.$$typeof, i === q) return 11;
      if (i === G) return 14;
    }
    return 2;
  }
  function $n(i, o) {
    var s = i.alternate;
    return s === null ? (s = ar(i.tag, o, i.key, i.mode), s.elementType = i.elementType, s.type = i.type, s.stateNode = i.stateNode, s.alternate = i, i.alternate = s) : (s.pendingProps = o, s.type = i.type, s.flags = 0, s.subtreeFlags = 0, s.deletions = null), s.flags = i.flags & 14680064, s.childLanes = i.childLanes, s.lanes = i.lanes, s.child = i.child, s.memoizedProps = i.memoizedProps, s.memoizedState = i.memoizedState, s.updateQueue = i.updateQueue, o = i.dependencies, s.dependencies = o === null ? null : { lanes: o.lanes, firstContext: o.firstContext }, s.sibling = i.sibling, s.index = i.index, s.ref = i.ref, s;
  }
  function Fl(i, o, s, p, y, g) {
    var E = 2;
    if (p = i, typeof i == "function") Td(i) && (E = 1);
    else if (typeof i == "string") E = 5;
    else e: switch (i) {
      case k:
        return ui(s.children, y, g, o);
      case M:
        E = 8, y |= 8;
        break;
      case N:
        return i = ar(12, s, o, y | 2), i.elementType = N, i.lanes = g, i;
      case F:
        return i = ar(13, s, o, y), i.elementType = F, i.lanes = g, i;
      case X:
        return i = ar(19, s, o, y), i.elementType = X, i.lanes = g, i;
      case ee:
        return Ul(s, y, g, o);
      default:
        if (typeof i == "object" && i !== null) switch (i.$$typeof) {
          case W:
            E = 10;
            break e;
          case R:
            E = 9;
            break e;
          case q:
            E = 11;
            break e;
          case G:
            E = 14;
            break e;
          case Y:
            E = 16, p = null;
            break e;
        }
        throw Error(r(130, i == null ? i : typeof i, ""));
    }
    return o = ar(E, s, o, y), o.elementType = i, o.type = p, o.lanes = g, o;
  }
  function ui(i, o, s, p) {
    return i = ar(7, i, p, o), i.lanes = s, i;
  }
  function Ul(i, o, s, p) {
    return i = ar(22, i, p, o), i.elementType = ee, i.lanes = s, i.stateNode = { isHidden: !1 }, i;
  }
  function Cd(i, o, s) {
    return i = ar(6, i, null, o), i.lanes = s, i;
  }
  function kd(i, o, s) {
    return o = ar(4, i.children !== null ? i.children : [], i.key, o), o.lanes = s, o.stateNode = { containerInfo: i.containerInfo, pendingChildren: null, implementation: i.implementation }, o;
  }
  function Zj(i, o, s, p, y) {
    this.tag = o, this.containerInfo = i, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = rf(0), this.expirationTimes = rf(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = rf(0), this.identifierPrefix = p, this.onRecoverableError = y, this.mutableSourceEagerHydrationData = null;
  }
  function jd(i, o, s, p, y, g, E, j, D) {
    return i = new Zj(i, o, s, j, D), o === 1 ? (o = 1, g === !0 && (o |= 8)) : o = 0, g = ar(3, null, null, o), i.current = g, g.stateNode = i, g.memoizedState = { element: p, isDehydrated: s, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Wf(g), i;
  }
  function Jj(i, o, s) {
    var p = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: O, key: p == null ? null : "" + p, children: i, containerInfo: o, implementation: s };
  }
  function Wx(i) {
    if (!i) return Pn;
    i = i._reactInternals;
    e: {
      if (Xn(i) !== i || i.tag !== 1) throw Error(r(170));
      var o = i;
      do {
        switch (o.tag) {
          case 3:
            o = o.stateNode.context;
            break e;
          case 1:
            if (Dt(o.type)) {
              o = o.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        o = o.return;
      } while (o !== null);
      throw Error(r(171));
    }
    if (i.tag === 1) {
      var s = i.type;
      if (Dt(s)) return gb(i, s, o);
    }
    return o;
  }
  function Hx(i, o, s, p, y, g, E, j, D) {
    return i = jd(s, p, !0, i, y, g, E, j, D), i.context = Wx(null), s = i.current, p = It(), y = Mn(s), g = Jr(p, y), g.callback = o ?? null, Tn(s, g, y), i.current.lanes = y, to(i, y, p), Bt(i, p), i;
  }
  function Wl(i, o, s, p) {
    var y = o.current, g = It(), E = Mn(y);
    return s = Wx(s), o.context === null ? o.context = s : o.pendingContext = s, o = Jr(g, E), o.payload = { element: i }, p = p === void 0 ? null : p, p !== null && (o.callback = p), i = Tn(y, o, E), i !== null && (Sr(i, y, E, g), wl(i, y, E)), E;
  }
  function Hl(i) {
    if (i = i.current, !i.child) return null;
    switch (i.child.tag) {
      case 5:
        return i.child.stateNode;
      default:
        return i.child.stateNode;
    }
  }
  function Kx(i, o) {
    if (i = i.memoizedState, i !== null && i.dehydrated !== null) {
      var s = i.retryLane;
      i.retryLane = s !== 0 && s < o ? s : o;
    }
  }
  function Md(i, o) {
    Kx(i, o), (i = i.alternate) && Kx(i, o);
  }
  function eM() {
    return null;
  }
  var Gx = typeof reportError == "function" ? reportError : function(i) {
    console.error(i);
  };
  function Id(i) {
    this._internalRoot = i;
  }
  Kl.prototype.render = Id.prototype.render = function(i) {
    var o = this._internalRoot;
    if (o === null) throw Error(r(409));
    Wl(i, o, null, null);
  }, Kl.prototype.unmount = Id.prototype.unmount = function() {
    var i = this._internalRoot;
    if (i !== null) {
      this._internalRoot = null;
      var o = i.containerInfo;
      ii(function() {
        Wl(null, i, null, null);
      }), o[Vr] = null;
    }
  };
  function Kl(i) {
    this._internalRoot = i;
  }
  Kl.prototype.unstable_scheduleHydration = function(i) {
    if (i) {
      var o = k0();
      i = { blockedOn: null, target: i, priority: o };
      for (var s = 0; s < xn.length && o !== 0 && o < xn[s].priority; s++) ;
      xn.splice(s, 0, i), s === 0 && I0(i);
    }
  };
  function $d(i) {
    return !(!i || i.nodeType !== 1 && i.nodeType !== 9 && i.nodeType !== 11);
  }
  function Gl(i) {
    return !(!i || i.nodeType !== 1 && i.nodeType !== 9 && i.nodeType !== 11 && (i.nodeType !== 8 || i.nodeValue !== " react-mount-point-unstable "));
  }
  function Vx() {
  }
  function tM(i, o, s, p, y) {
    if (y) {
      if (typeof p == "function") {
        var g = p;
        p = function() {
          var K = Hl(E);
          g.call(K);
        };
      }
      var E = Hx(o, p, i, 0, null, !1, !1, "", Vx);
      return i._reactRootContainer = E, i[Vr] = E.current, yo(i.nodeType === 8 ? i.parentNode : i), ii(), E;
    }
    for (; y = i.lastChild; ) i.removeChild(y);
    if (typeof p == "function") {
      var j = p;
      p = function() {
        var K = Hl(D);
        j.call(K);
      };
    }
    var D = jd(i, 0, !1, null, null, !1, !1, "", Vx);
    return i._reactRootContainer = D, i[Vr] = D.current, yo(i.nodeType === 8 ? i.parentNode : i), ii(function() {
      Wl(o, D, s, p);
    }), D;
  }
  function Vl(i, o, s, p, y) {
    var g = s._reactRootContainer;
    if (g) {
      var E = g;
      if (typeof y == "function") {
        var j = y;
        y = function() {
          var D = Hl(E);
          j.call(D);
        };
      }
      Wl(o, E, i, y);
    } else E = tM(s, o, i, y, p);
    return Hl(E);
  }
  T0 = function(i) {
    switch (i.tag) {
      case 3:
        var o = i.stateNode;
        if (o.current.memoizedState.isDehydrated) {
          var s = eo(o.pendingLanes);
          s !== 0 && (nf(o, s | 1), Bt(o, rt()), (Me & 6) === 0 && (ea = rt() + 500, An()));
        }
        break;
      case 13:
        ii(function() {
          var p = Zr(i, 1);
          if (p !== null) {
            var y = It();
            Sr(p, i, 1, y);
          }
        }), Md(i, 1);
    }
  }, af = function(i) {
    if (i.tag === 13) {
      var o = Zr(i, 134217728);
      if (o !== null) {
        var s = It();
        Sr(o, i, 134217728, s);
      }
      Md(i, 134217728);
    }
  }, C0 = function(i) {
    if (i.tag === 13) {
      var o = Mn(i), s = Zr(i, o);
      if (s !== null) {
        var p = It();
        Sr(s, i, o, p);
      }
      Md(i, o);
    }
  }, k0 = function() {
    return Le;
  }, j0 = function(i, o) {
    var s = Le;
    try {
      return Le = i, o();
    } finally {
      Le = s;
    }
  }, Yc = function(i, o, s) {
    switch (o) {
      case "input":
        if (vt(i, s), o = s.name, s.type === "radio" && o != null) {
          for (s = i; s.parentNode; ) s = s.parentNode;
          for (s = s.querySelectorAll("input[name=" + JSON.stringify("" + o) + '][type="radio"]'), o = 0; o < s.length; o++) {
            var p = s[o];
            if (p !== i && p.form === i.form) {
              var y = fl(p);
              if (!y) throw Error(r(90));
              ne(p), vt(p, y);
            }
          }
        }
        break;
      case "textarea":
        Ga(i, s);
        break;
      case "select":
        o = s.value, o != null && Nt(i, !!s.multiple, o, !1);
    }
  }, v0 = Pd, y0 = ii;
  var rM = { usingClientEntryPoint: !1, Events: [bo, zi, fl, p0, h0, Pd] }, Io = { findFiberByHostInstance: Yn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, nM = { bundleType: Io.bundleType, version: Io.version, rendererPackageName: Io.rendererPackageName, rendererConfig: Io.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: T.ReactCurrentDispatcher, findHostInstanceByFiber: function(i) {
    return i = x0(i), i === null ? null : i.stateNode;
  }, findFiberByHostInstance: Io.findFiberByHostInstance || eM, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Xl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Xl.isDisabled && Xl.supportsFiber) try {
      Ku = Xl.inject(nM), Mr = Xl;
    } catch {
    }
  }
  return zt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = rM, zt.createPortal = function(i, o) {
    var s = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!$d(o)) throw Error(r(200));
    return Jj(i, o, null, s);
  }, zt.createRoot = function(i, o) {
    if (!$d(i)) throw Error(r(299));
    var s = !1, p = "", y = Gx;
    return o != null && (o.unstable_strictMode === !0 && (s = !0), o.identifierPrefix !== void 0 && (p = o.identifierPrefix), o.onRecoverableError !== void 0 && (y = o.onRecoverableError)), o = jd(i, 1, !1, null, null, s, !1, p, y), i[Vr] = o.current, yo(i.nodeType === 8 ? i.parentNode : i), new Id(o);
  }, zt.findDOMNode = function(i) {
    if (i == null) return null;
    if (i.nodeType === 1) return i;
    var o = i._reactInternals;
    if (o === void 0)
      throw typeof i.render == "function" ? Error(r(188)) : (i = Object.keys(i).join(","), Error(r(268, i)));
    return i = x0(o), i = i === null ? null : i.stateNode, i;
  }, zt.flushSync = function(i) {
    return ii(i);
  }, zt.hydrate = function(i, o, s) {
    if (!Gl(o)) throw Error(r(200));
    return Vl(null, i, o, !0, s);
  }, zt.hydrateRoot = function(i, o, s) {
    if (!$d(i)) throw Error(r(405));
    var p = s != null && s.hydratedSources || null, y = !1, g = "", E = Gx;
    if (s != null && (s.unstable_strictMode === !0 && (y = !0), s.identifierPrefix !== void 0 && (g = s.identifierPrefix), s.onRecoverableError !== void 0 && (E = s.onRecoverableError)), o = Hx(o, null, i, 1, s ?? null, y, !1, g, E), i[Vr] = o.current, yo(i), p) for (i = 0; i < p.length; i++) s = p[i], y = s._getVersion, y = y(s._source), o.mutableSourceEagerHydrationData == null ? o.mutableSourceEagerHydrationData = [s, y] : o.mutableSourceEagerHydrationData.push(
      s,
      y
    );
    return new Kl(o);
  }, zt.render = function(i, o, s) {
    if (!Gl(o)) throw Error(r(200));
    return Vl(null, i, o, !1, s);
  }, zt.unmountComponentAtNode = function(i) {
    if (!Gl(i)) throw Error(r(40));
    return i._reactRootContainer ? (ii(function() {
      Vl(null, null, i, !1, function() {
        i._reactRootContainer = null, i[Vr] = null;
      });
    }), !0) : !1;
  }, zt.unstable_batchedUpdates = Pd, zt.unstable_renderSubtreeIntoContainer = function(i, o, s, p) {
    if (!Gl(s)) throw Error(r(200));
    if (i == null || i._reactInternals === void 0) throw Error(r(38));
    return Vl(i, o, s, !1, p);
  }, zt.version = "18.3.1-next-f1338f8080-20240426", zt;
}
var ew;
function dM() {
  if (ew) return Rd.exports;
  ew = 1;
  function e() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (t) {
        console.error(t);
      }
  }
  return e(), Rd.exports = fM(), Rd.exports;
}
var tw;
function pM() {
  if (tw) return Ql;
  tw = 1;
  var e = dM();
  return Ql.createRoot = e.createRoot, Ql.hydrateRoot = e.hydrateRoot, Ql;
}
var hM = pM();
function KA(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var a = e.length;
    for (t = 0; t < a; t++) e[t] && (r = KA(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function ke() {
  for (var e, t, r = 0, n = "", a = arguments.length; r < a; r++) (e = arguments[r]) && (t = KA(e)) && (n && (n += " "), n += t);
  return n;
}
var qd, rw;
function Wt() {
  if (rw) return qd;
  rw = 1;
  var e = Array.isArray;
  return qd = e, qd;
}
var Bd, nw;
function GA() {
  if (nw) return Bd;
  nw = 1;
  var e = typeof Yl == "object" && Yl && Yl.Object === Object && Yl;
  return Bd = e, Bd;
}
var zd, iw;
function Gr() {
  if (iw) return zd;
  iw = 1;
  var e = GA(), t = typeof self == "object" && self && self.Object === Object && self, r = e || t || Function("return this")();
  return zd = r, zd;
}
var Fd, aw;
function Ru() {
  if (aw) return Fd;
  aw = 1;
  var e = Gr(), t = e.Symbol;
  return Fd = t, Fd;
}
var Ud, ow;
function vM() {
  if (ow) return Ud;
  ow = 1;
  var e = Ru(), t = Object.prototype, r = t.hasOwnProperty, n = t.toString, a = e ? e.toStringTag : void 0;
  function u(l) {
    var c = r.call(l, a), f = l[a];
    try {
      l[a] = void 0;
      var d = !0;
    } catch {
    }
    var v = n.call(l);
    return d && (c ? l[a] = f : delete l[a]), v;
  }
  return Ud = u, Ud;
}
var Wd, uw;
function yM() {
  if (uw) return Wd;
  uw = 1;
  var e = Object.prototype, t = e.toString;
  function r(n) {
    return t.call(n);
  }
  return Wd = r, Wd;
}
var Hd, lw;
function hn() {
  if (lw) return Hd;
  lw = 1;
  var e = Ru(), t = vM(), r = yM(), n = "[object Null]", a = "[object Undefined]", u = e ? e.toStringTag : void 0;
  function l(c) {
    return c == null ? c === void 0 ? a : n : u && u in Object(c) ? t(c) : r(c);
  }
  return Hd = l, Hd;
}
var Kd, sw;
function vn() {
  if (sw) return Kd;
  sw = 1;
  function e(t) {
    return t != null && typeof t == "object";
  }
  return Kd = e, Kd;
}
var Gd, cw;
function La() {
  if (cw) return Gd;
  cw = 1;
  var e = hn(), t = vn(), r = "[object Symbol]";
  function n(a) {
    return typeof a == "symbol" || t(a) && e(a) == r;
  }
  return Gd = n, Gd;
}
var Vd, fw;
function ag() {
  if (fw) return Vd;
  fw = 1;
  var e = Wt(), t = La(), r = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, n = /^\w*$/;
  function a(u, l) {
    if (e(u))
      return !1;
    var c = typeof u;
    return c == "number" || c == "symbol" || c == "boolean" || u == null || t(u) ? !0 : n.test(u) || !r.test(u) || l != null && u in Object(l);
  }
  return Vd = a, Vd;
}
var Xd, dw;
function Un() {
  if (dw) return Xd;
  dw = 1;
  function e(t) {
    var r = typeof t;
    return t != null && (r == "object" || r == "function");
  }
  return Xd = e, Xd;
}
var Yd, pw;
function og() {
  if (pw) return Yd;
  pw = 1;
  var e = hn(), t = Un(), r = "[object AsyncFunction]", n = "[object Function]", a = "[object GeneratorFunction]", u = "[object Proxy]";
  function l(c) {
    if (!t(c))
      return !1;
    var f = e(c);
    return f == n || f == a || f == r || f == u;
  }
  return Yd = l, Yd;
}
var Qd, hw;
function mM() {
  if (hw) return Qd;
  hw = 1;
  var e = Gr(), t = e["__core-js_shared__"];
  return Qd = t, Qd;
}
var Zd, vw;
function gM() {
  if (vw) return Zd;
  vw = 1;
  var e = mM(), t = (function() {
    var n = /[^.]+$/.exec(e && e.keys && e.keys.IE_PROTO || "");
    return n ? "Symbol(src)_1." + n : "";
  })();
  function r(n) {
    return !!t && t in n;
  }
  return Zd = r, Zd;
}
var Jd, yw;
function VA() {
  if (yw) return Jd;
  yw = 1;
  var e = Function.prototype, t = e.toString;
  function r(n) {
    if (n != null) {
      try {
        return t.call(n);
      } catch {
      }
      try {
        return n + "";
      } catch {
      }
    }
    return "";
  }
  return Jd = r, Jd;
}
var ep, mw;
function bM() {
  if (mw) return ep;
  mw = 1;
  var e = og(), t = gM(), r = Un(), n = VA(), a = /[\\^$.*+?()[\]{}|]/g, u = /^\[object .+?Constructor\]$/, l = Function.prototype, c = Object.prototype, f = l.toString, d = c.hasOwnProperty, v = RegExp(
    "^" + f.call(d).replace(a, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  function h(m) {
    if (!r(m) || t(m))
      return !1;
    var x = e(m) ? v : u;
    return x.test(n(m));
  }
  return ep = h, ep;
}
var tp, gw;
function xM() {
  if (gw) return tp;
  gw = 1;
  function e(t, r) {
    return t?.[r];
  }
  return tp = e, tp;
}
var rp, bw;
function Ai() {
  if (bw) return rp;
  bw = 1;
  var e = bM(), t = xM();
  function r(n, a) {
    var u = t(n, a);
    return e(u) ? u : void 0;
  }
  return rp = r, rp;
}
var np, xw;
function cc() {
  if (xw) return np;
  xw = 1;
  var e = Ai(), t = e(Object, "create");
  return np = t, np;
}
var ip, ww;
function wM() {
  if (ww) return ip;
  ww = 1;
  var e = cc();
  function t() {
    this.__data__ = e ? e(null) : {}, this.size = 0;
  }
  return ip = t, ip;
}
var ap, Sw;
function SM() {
  if (Sw) return ap;
  Sw = 1;
  function e(t) {
    var r = this.has(t) && delete this.__data__[t];
    return this.size -= r ? 1 : 0, r;
  }
  return ap = e, ap;
}
var op, _w;
function _M() {
  if (_w) return op;
  _w = 1;
  var e = cc(), t = "__lodash_hash_undefined__", r = Object.prototype, n = r.hasOwnProperty;
  function a(u) {
    var l = this.__data__;
    if (e) {
      var c = l[u];
      return c === t ? void 0 : c;
    }
    return n.call(l, u) ? l[u] : void 0;
  }
  return op = a, op;
}
var up, Ow;
function OM() {
  if (Ow) return up;
  Ow = 1;
  var e = cc(), t = Object.prototype, r = t.hasOwnProperty;
  function n(a) {
    var u = this.__data__;
    return e ? u[a] !== void 0 : r.call(u, a);
  }
  return up = n, up;
}
var lp, Pw;
function PM() {
  if (Pw) return lp;
  Pw = 1;
  var e = cc(), t = "__lodash_hash_undefined__";
  function r(n, a) {
    var u = this.__data__;
    return this.size += this.has(n) ? 0 : 1, u[n] = e && a === void 0 ? t : a, this;
  }
  return lp = r, lp;
}
var sp, Aw;
function AM() {
  if (Aw) return sp;
  Aw = 1;
  var e = wM(), t = SM(), r = _M(), n = OM(), a = PM();
  function u(l) {
    var c = -1, f = l == null ? 0 : l.length;
    for (this.clear(); ++c < f; ) {
      var d = l[c];
      this.set(d[0], d[1]);
    }
  }
  return u.prototype.clear = e, u.prototype.delete = t, u.prototype.get = r, u.prototype.has = n, u.prototype.set = a, sp = u, sp;
}
var cp, Ew;
function EM() {
  if (Ew) return cp;
  Ew = 1;
  function e() {
    this.__data__ = [], this.size = 0;
  }
  return cp = e, cp;
}
var fp, Tw;
function ug() {
  if (Tw) return fp;
  Tw = 1;
  function e(t, r) {
    return t === r || t !== t && r !== r;
  }
  return fp = e, fp;
}
var dp, Cw;
function fc() {
  if (Cw) return dp;
  Cw = 1;
  var e = ug();
  function t(r, n) {
    for (var a = r.length; a--; )
      if (e(r[a][0], n))
        return a;
    return -1;
  }
  return dp = t, dp;
}
var pp, kw;
function TM() {
  if (kw) return pp;
  kw = 1;
  var e = fc(), t = Array.prototype, r = t.splice;
  function n(a) {
    var u = this.__data__, l = e(u, a);
    if (l < 0)
      return !1;
    var c = u.length - 1;
    return l == c ? u.pop() : r.call(u, l, 1), --this.size, !0;
  }
  return pp = n, pp;
}
var hp, jw;
function CM() {
  if (jw) return hp;
  jw = 1;
  var e = fc();
  function t(r) {
    var n = this.__data__, a = e(n, r);
    return a < 0 ? void 0 : n[a][1];
  }
  return hp = t, hp;
}
var vp, Mw;
function kM() {
  if (Mw) return vp;
  Mw = 1;
  var e = fc();
  function t(r) {
    return e(this.__data__, r) > -1;
  }
  return vp = t, vp;
}
var yp, Iw;
function jM() {
  if (Iw) return yp;
  Iw = 1;
  var e = fc();
  function t(r, n) {
    var a = this.__data__, u = e(a, r);
    return u < 0 ? (++this.size, a.push([r, n])) : a[u][1] = n, this;
  }
  return yp = t, yp;
}
var mp, $w;
function dc() {
  if ($w) return mp;
  $w = 1;
  var e = EM(), t = TM(), r = CM(), n = kM(), a = jM();
  function u(l) {
    var c = -1, f = l == null ? 0 : l.length;
    for (this.clear(); ++c < f; ) {
      var d = l[c];
      this.set(d[0], d[1]);
    }
  }
  return u.prototype.clear = e, u.prototype.delete = t, u.prototype.get = r, u.prototype.has = n, u.prototype.set = a, mp = u, mp;
}
var gp, Nw;
function lg() {
  if (Nw) return gp;
  Nw = 1;
  var e = Ai(), t = Gr(), r = e(t, "Map");
  return gp = r, gp;
}
var bp, Rw;
function MM() {
  if (Rw) return bp;
  Rw = 1;
  var e = AM(), t = dc(), r = lg();
  function n() {
    this.size = 0, this.__data__ = {
      hash: new e(),
      map: new (r || t)(),
      string: new e()
    };
  }
  return bp = n, bp;
}
var xp, Dw;
function IM() {
  if (Dw) return xp;
  Dw = 1;
  function e(t) {
    var r = typeof t;
    return r == "string" || r == "number" || r == "symbol" || r == "boolean" ? t !== "__proto__" : t === null;
  }
  return xp = e, xp;
}
var wp, Lw;
function pc() {
  if (Lw) return wp;
  Lw = 1;
  var e = IM();
  function t(r, n) {
    var a = r.__data__;
    return e(n) ? a[typeof n == "string" ? "string" : "hash"] : a.map;
  }
  return wp = t, wp;
}
var Sp, qw;
function $M() {
  if (qw) return Sp;
  qw = 1;
  var e = pc();
  function t(r) {
    var n = e(this, r).delete(r);
    return this.size -= n ? 1 : 0, n;
  }
  return Sp = t, Sp;
}
var _p, Bw;
function NM() {
  if (Bw) return _p;
  Bw = 1;
  var e = pc();
  function t(r) {
    return e(this, r).get(r);
  }
  return _p = t, _p;
}
var Op, zw;
function RM() {
  if (zw) return Op;
  zw = 1;
  var e = pc();
  function t(r) {
    return e(this, r).has(r);
  }
  return Op = t, Op;
}
var Pp, Fw;
function DM() {
  if (Fw) return Pp;
  Fw = 1;
  var e = pc();
  function t(r, n) {
    var a = e(this, r), u = a.size;
    return a.set(r, n), this.size += a.size == u ? 0 : 1, this;
  }
  return Pp = t, Pp;
}
var Ap, Uw;
function sg() {
  if (Uw) return Ap;
  Uw = 1;
  var e = MM(), t = $M(), r = NM(), n = RM(), a = DM();
  function u(l) {
    var c = -1, f = l == null ? 0 : l.length;
    for (this.clear(); ++c < f; ) {
      var d = l[c];
      this.set(d[0], d[1]);
    }
  }
  return u.prototype.clear = e, u.prototype.delete = t, u.prototype.get = r, u.prototype.has = n, u.prototype.set = a, Ap = u, Ap;
}
var Ep, Ww;
function XA() {
  if (Ww) return Ep;
  Ww = 1;
  var e = sg(), t = "Expected a function";
  function r(n, a) {
    if (typeof n != "function" || a != null && typeof a != "function")
      throw new TypeError(t);
    var u = function() {
      var l = arguments, c = a ? a.apply(this, l) : l[0], f = u.cache;
      if (f.has(c))
        return f.get(c);
      var d = n.apply(this, l);
      return u.cache = f.set(c, d) || f, d;
    };
    return u.cache = new (r.Cache || e)(), u;
  }
  return r.Cache = e, Ep = r, Ep;
}
var Tp, Hw;
function LM() {
  if (Hw) return Tp;
  Hw = 1;
  var e = XA(), t = 500;
  function r(n) {
    var a = e(n, function(l) {
      return u.size === t && u.clear(), l;
    }), u = a.cache;
    return a;
  }
  return Tp = r, Tp;
}
var Cp, Kw;
function qM() {
  if (Kw) return Cp;
  Kw = 1;
  var e = LM(), t = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, r = /\\(\\)?/g, n = e(function(a) {
    var u = [];
    return a.charCodeAt(0) === 46 && u.push(""), a.replace(t, function(l, c, f, d) {
      u.push(f ? d.replace(r, "$1") : c || l);
    }), u;
  });
  return Cp = n, Cp;
}
var kp, Gw;
function cg() {
  if (Gw) return kp;
  Gw = 1;
  function e(t, r) {
    for (var n = -1, a = t == null ? 0 : t.length, u = Array(a); ++n < a; )
      u[n] = r(t[n], n, t);
    return u;
  }
  return kp = e, kp;
}
var jp, Vw;
function BM() {
  if (Vw) return jp;
  Vw = 1;
  var e = Ru(), t = cg(), r = Wt(), n = La(), a = e ? e.prototype : void 0, u = a ? a.toString : void 0;
  function l(c) {
    if (typeof c == "string")
      return c;
    if (r(c))
      return t(c, l) + "";
    if (n(c))
      return u ? u.call(c) : "";
    var f = c + "";
    return f == "0" && 1 / c == -1 / 0 ? "-0" : f;
  }
  return jp = l, jp;
}
var Mp, Xw;
function YA() {
  if (Xw) return Mp;
  Xw = 1;
  var e = BM();
  function t(r) {
    return r == null ? "" : e(r);
  }
  return Mp = t, Mp;
}
var Ip, Yw;
function QA() {
  if (Yw) return Ip;
  Yw = 1;
  var e = Wt(), t = ag(), r = qM(), n = YA();
  function a(u, l) {
    return e(u) ? u : t(u, l) ? [u] : r(n(u));
  }
  return Ip = a, Ip;
}
var $p, Qw;
function hc() {
  if (Qw) return $p;
  Qw = 1;
  var e = La();
  function t(r) {
    if (typeof r == "string" || e(r))
      return r;
    var n = r + "";
    return n == "0" && 1 / r == -1 / 0 ? "-0" : n;
  }
  return $p = t, $p;
}
var Np, Zw;
function fg() {
  if (Zw) return Np;
  Zw = 1;
  var e = QA(), t = hc();
  function r(n, a) {
    a = e(a, n);
    for (var u = 0, l = a.length; n != null && u < l; )
      n = n[t(a[u++])];
    return u && u == l ? n : void 0;
  }
  return Np = r, Np;
}
var Rp, Jw;
function ZA() {
  if (Jw) return Rp;
  Jw = 1;
  var e = fg();
  function t(r, n, a) {
    var u = r == null ? void 0 : e(r, n);
    return u === void 0 ? a : u;
  }
  return Rp = t, Rp;
}
var zM = ZA();
const fr = /* @__PURE__ */ Fe(zM);
var Dp, e1;
function FM() {
  if (e1) return Dp;
  e1 = 1;
  function e(t) {
    return t == null;
  }
  return Dp = e, Dp;
}
var UM = FM();
const _e = /* @__PURE__ */ Fe(UM);
var Lp, t1;
function WM() {
  if (t1) return Lp;
  t1 = 1;
  var e = hn(), t = Wt(), r = vn(), n = "[object String]";
  function a(u) {
    return typeof u == "string" || !t(u) && r(u) && e(u) == n;
  }
  return Lp = a, Lp;
}
var HM = WM();
const bi = /* @__PURE__ */ Fe(HM);
var KM = og();
const Ee = /* @__PURE__ */ Fe(KM);
var GM = Un();
const qa = /* @__PURE__ */ Fe(GM);
var qp = { exports: {} }, Re = {};
var r1;
function VM() {
  if (r1) return Re;
  r1 = 1;
  var e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), n = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), u = Symbol.for("react.provider"), l = Symbol.for("react.context"), c = Symbol.for("react.server_context"), f = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), v = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), x = Symbol.for("react.offscreen"), S;
  S = Symbol.for("react.module.reference");
  function w(b) {
    if (typeof b == "object" && b !== null) {
      var P = b.$$typeof;
      switch (P) {
        case e:
          switch (b = b.type, b) {
            case r:
            case a:
            case n:
            case d:
            case v:
              return b;
            default:
              switch (b = b && b.$$typeof, b) {
                case c:
                case l:
                case f:
                case m:
                case h:
                case u:
                  return b;
                default:
                  return P;
              }
          }
        case t:
          return P;
      }
    }
  }
  return Re.ContextConsumer = l, Re.ContextProvider = u, Re.Element = e, Re.ForwardRef = f, Re.Fragment = r, Re.Lazy = m, Re.Memo = h, Re.Portal = t, Re.Profiler = a, Re.StrictMode = n, Re.Suspense = d, Re.SuspenseList = v, Re.isAsyncMode = function() {
    return !1;
  }, Re.isConcurrentMode = function() {
    return !1;
  }, Re.isContextConsumer = function(b) {
    return w(b) === l;
  }, Re.isContextProvider = function(b) {
    return w(b) === u;
  }, Re.isElement = function(b) {
    return typeof b == "object" && b !== null && b.$$typeof === e;
  }, Re.isForwardRef = function(b) {
    return w(b) === f;
  }, Re.isFragment = function(b) {
    return w(b) === r;
  }, Re.isLazy = function(b) {
    return w(b) === m;
  }, Re.isMemo = function(b) {
    return w(b) === h;
  }, Re.isPortal = function(b) {
    return w(b) === t;
  }, Re.isProfiler = function(b) {
    return w(b) === a;
  }, Re.isStrictMode = function(b) {
    return w(b) === n;
  }, Re.isSuspense = function(b) {
    return w(b) === d;
  }, Re.isSuspenseList = function(b) {
    return w(b) === v;
  }, Re.isValidElementType = function(b) {
    return typeof b == "string" || typeof b == "function" || b === r || b === a || b === n || b === d || b === v || b === x || typeof b == "object" && b !== null && (b.$$typeof === m || b.$$typeof === h || b.$$typeof === u || b.$$typeof === l || b.$$typeof === f || b.$$typeof === S || b.getModuleId !== void 0);
  }, Re.typeOf = w, Re;
}
var n1;
function XM() {
  return n1 || (n1 = 1, qp.exports = VM()), qp.exports;
}
var YM = XM(), Bp, i1;
function JA() {
  if (i1) return Bp;
  i1 = 1;
  var e = hn(), t = vn(), r = "[object Number]";
  function n(a) {
    return typeof a == "number" || t(a) && e(a) == r;
  }
  return Bp = n, Bp;
}
var zp, a1;
function QM() {
  if (a1) return zp;
  a1 = 1;
  var e = JA();
  function t(r) {
    return e(r) && r != +r;
  }
  return zp = t, zp;
}
var ZM = QM();
const Ba = /* @__PURE__ */ Fe(ZM);
var JM = JA();
const e2 = /* @__PURE__ */ Fe(JM);
var Er = function(t) {
  return t === 0 ? 0 : t > 0 ? 1 : -1;
}, fi = function(t) {
  return bi(t) && t.indexOf("%") === t.length - 1;
}, le = function(t) {
  return e2(t) && !Ba(t);
}, t2 = function(t) {
  return _e(t);
}, dt = function(t) {
  return le(t) || bi(t);
}, r2 = 0, Ei = function(t) {
  var r = ++r2;
  return "".concat(t || "").concat(r);
}, xi = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
  if (!le(t) && !bi(t))
    return n;
  var u;
  if (fi(t)) {
    var l = t.indexOf("%");
    u = r * parseFloat(t.slice(0, l)) / 100;
  } else
    u = +t;
  return Ba(u) && (u = n), a && u > r && (u = r), u;
}, Ln = function(t) {
  if (!t)
    return null;
  var r = Object.keys(t);
  return r && r.length ? t[r[0]] : null;
}, n2 = function(t) {
  if (!Array.isArray(t))
    return !1;
  for (var r = t.length, n = {}, a = 0; a < r; a++)
    if (!n[t[a]])
      n[t[a]] = !0;
    else
      return !0;
  return !1;
}, it = function(t, r) {
  return le(t) && le(r) ? function(n) {
    return t + n * (r - t);
  } : function() {
    return r;
  };
};
function fs(e, t, r) {
  return !e || !e.length ? null : e.find(function(n) {
    return n && (typeof t == "function" ? t(n) : fr(n, t)) === r;
  });
}
var i2 = function(t) {
  if (!t || !t.length)
    return null;
  for (var r = t.length, n = 0, a = 0, u = 0, l = 0, c = 1 / 0, f = -1 / 0, d = 0, v = 0, h = 0; h < r; h++)
    d = t[h].cx || 0, v = t[h].cy || 0, n += d, a += v, u += d * v, l += d * d, c = Math.min(c, d), f = Math.max(f, d);
  var m = r * l !== n * n ? (r * u - n * a) / (r * l - n * n) : 0;
  return {
    xmin: c,
    xmax: f,
    a: m,
    b: (a - m * n) / r
  };
}, a2 = function(t, r) {
  return le(t) && le(r) ? t - r : bi(t) && bi(r) ? t.localeCompare(r) : t instanceof Date && r instanceof Date ? t.getTime() - r.getTime() : String(t).localeCompare(String(r));
};
function sa(e, t) {
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r) && (!{}.hasOwnProperty.call(t, r) || e[r] !== t[r]))
      return !1;
  for (var n in t)
    if ({}.hasOwnProperty.call(t, n) && !{}.hasOwnProperty.call(e, n))
      return !1;
  return !0;
}
function Ly(e) {
  "@babel/helpers - typeof";
  return Ly = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ly(e);
}
var o2 = ["viewBox", "children"], u2 = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
  "className",
  "color",
  "height",
  "id",
  "lang",
  "max",
  "media",
  "method",
  "min",
  "name",
  "style",
  /*
   * removed 'type' SVGElementPropKey because we do not currently use any SVG elements
   * that can use it and it conflicts with the recharts prop 'type'
   * https://github.com/recharts/recharts/pull/3327
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type
   */
  // 'type',
  "target",
  "width",
  "role",
  "tabIndex",
  "accentHeight",
  "accumulate",
  "additive",
  "alignmentBaseline",
  "allowReorder",
  "alphabetic",
  "amplitude",
  "arabicForm",
  "ascent",
  "attributeName",
  "attributeType",
  "autoReverse",
  "azimuth",
  "baseFrequency",
  "baselineShift",
  "baseProfile",
  "bbox",
  "begin",
  "bias",
  "by",
  "calcMode",
  "capHeight",
  "clip",
  "clipPath",
  "clipPathUnits",
  "clipRule",
  "colorInterpolation",
  "colorInterpolationFilters",
  "colorProfile",
  "colorRendering",
  "contentScriptType",
  "contentStyleType",
  "cursor",
  "cx",
  "cy",
  "d",
  "decelerate",
  "descent",
  "diffuseConstant",
  "direction",
  "display",
  "divisor",
  "dominantBaseline",
  "dur",
  "dx",
  "dy",
  "edgeMode",
  "elevation",
  "enableBackground",
  "end",
  "exponent",
  "externalResourcesRequired",
  "fill",
  "fillOpacity",
  "fillRule",
  "filter",
  "filterRes",
  "filterUnits",
  "floodColor",
  "floodOpacity",
  "focusable",
  "fontFamily",
  "fontSize",
  "fontSizeAdjust",
  "fontStretch",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "format",
  "from",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyphName",
  "glyphOrientationHorizontal",
  "glyphOrientationVertical",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "hanging",
  "horizAdvX",
  "horizOriginX",
  "href",
  "ideographic",
  "imageRendering",
  "in2",
  "in",
  "intercept",
  "k1",
  "k2",
  "k3",
  "k4",
  "k",
  "kernelMatrix",
  "kernelUnitLength",
  "kerning",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "letterSpacing",
  "lightingColor",
  "limitingConeAngle",
  "local",
  "markerEnd",
  "markerHeight",
  "markerMid",
  "markerStart",
  "markerUnits",
  "markerWidth",
  "mask",
  "maskContentUnits",
  "maskUnits",
  "mathematical",
  "mode",
  "numOctaves",
  "offset",
  "opacity",
  "operator",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "overlinePosition",
  "overlineThickness",
  "paintOrder",
  "panose1",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointerEvents",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "r",
  "radius",
  "refX",
  "refY",
  "renderingIntent",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "restart",
  "result",
  "rotate",
  "rx",
  "ry",
  "seed",
  "shapeRendering",
  "slope",
  "spacing",
  "specularConstant",
  "specularExponent",
  "speed",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stemh",
  "stemv",
  "stitchTiles",
  "stopColor",
  "stopOpacity",
  "strikethroughPosition",
  "strikethroughThickness",
  "string",
  "stroke",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textAnchor",
  "textDecoration",
  "textLength",
  "textRendering",
  "to",
  "transform",
  "u1",
  "u2",
  "underlinePosition",
  "underlineThickness",
  "unicode",
  "unicodeBidi",
  "unicodeRange",
  "unitsPerEm",
  "vAlphabetic",
  "values",
  "vectorEffect",
  "version",
  "vertAdvY",
  "vertOriginX",
  "vertOriginY",
  "vHanging",
  "vIdeographic",
  "viewTarget",
  "visibility",
  "vMathematical",
  "widths",
  "wordSpacing",
  "writingMode",
  "x1",
  "x2",
  "x",
  "xChannelSelector",
  "xHeight",
  "xlinkActuate",
  "xlinkArcrole",
  "xlinkHref",
  "xlinkRole",
  "xlinkShow",
  "xlinkTitle",
  "xlinkType",
  "xmlBase",
  "xmlLang",
  "xmlns",
  "xmlnsXlink",
  "xmlSpace",
  "y1",
  "y2",
  "y",
  "yChannelSelector",
  "z",
  "zoomAndPan",
  "ref",
  "key",
  "angle"
], o1 = ["points", "pathLength"], Fp = {
  svg: o2,
  polygon: o1,
  polyline: o1
}, dg = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"], ds = function(t, r) {
  if (!t || typeof t == "function" || typeof t == "boolean")
    return null;
  var n = t;
  if (/* @__PURE__ */ V.isValidElement(t) && (n = t.props), !qa(n))
    return null;
  var a = {};
  return Object.keys(n).forEach(function(u) {
    dg.includes(u) && (a[u] = r || function(l) {
      return n[u](n, l);
    });
  }), a;
}, l2 = function(t, r, n) {
  return function(a) {
    return t(r, n, a), null;
  };
}, eu = function(t, r, n) {
  if (!qa(t) || Ly(t) !== "object")
    return null;
  var a = null;
  return Object.keys(t).forEach(function(u) {
    var l = t[u];
    dg.includes(u) && typeof l == "function" && (a || (a = {}), a[u] = l2(l, r, n));
  }), a;
}, s2 = ["children"], c2 = ["children"];
function u1(e, t) {
  if (e == null) return {};
  var r = f2(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function f2(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function qy(e) {
  "@babel/helpers - typeof";
  return qy = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, qy(e);
}
var l1 = {
  click: "onClick",
  mousedown: "onMouseDown",
  mouseup: "onMouseUp",
  mouseover: "onMouseOver",
  mousemove: "onMouseMove",
  mouseout: "onMouseOut",
  mouseenter: "onMouseEnter",
  mouseleave: "onMouseLeave",
  touchcancel: "onTouchCancel",
  touchend: "onTouchEnd",
  touchmove: "onTouchMove",
  touchstart: "onTouchStart",
  contextmenu: "onContextMenu",
  dblclick: "onDoubleClick"
}, un = function(t) {
  return typeof t == "string" ? t : t ? t.displayName || t.name || "Component" : "";
}, s1 = null, Up = null, pg = function e(t) {
  if (t === s1 && Array.isArray(Up))
    return Up;
  var r = [];
  return V.Children.forEach(t, function(n) {
    _e(n) || (YM.isFragment(n) ? r = r.concat(e(n.props.children)) : r.push(n));
  }), Up = r, s1 = t, r;
};
function Ut(e, t) {
  var r = [], n = [];
  return Array.isArray(t) ? n = t.map(function(a) {
    return un(a);
  }) : n = [un(t)], pg(e).forEach(function(a) {
    var u = fr(a, "type.displayName") || fr(a, "type.name");
    n.indexOf(u) !== -1 && r.push(a);
  }), r;
}
function Qt(e, t) {
  var r = Ut(e, t);
  return r && r[0];
}
var c1 = function(t) {
  if (!t || !t.props)
    return !1;
  var r = t.props, n = r.width, a = r.height;
  return !(!le(n) || n <= 0 || !le(a) || a <= 0);
}, d2 = ["a", "altGlyph", "altGlyphDef", "altGlyphItem", "animate", "animateColor", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "cursor", "defs", "desc", "ellipse", "feBlend", "feColormatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "font", "font-face", "font-face-format", "font-face-name", "font-face-url", "foreignObject", "g", "glyph", "glyphRef", "hkern", "image", "line", "lineGradient", "marker", "mask", "metadata", "missing-glyph", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "script", "set", "stop", "style", "svg", "switch", "symbol", "text", "textPath", "title", "tref", "tspan", "use", "view", "vkern"], p2 = function(t) {
  return t && t.type && bi(t.type) && d2.indexOf(t.type) >= 0;
}, eE = function(t) {
  return t && qy(t) === "object" && "clipDot" in t;
}, h2 = function(t, r, n, a) {
  var u, l = (u = Fp?.[a]) !== null && u !== void 0 ? u : [];
  return r.startsWith("data-") || !Ee(t) && (a && l.includes(r) || u2.includes(r)) || n && dg.includes(r);
}, Ae = function(t, r, n) {
  if (!t || typeof t == "function" || typeof t == "boolean")
    return null;
  var a = t;
  if (/* @__PURE__ */ V.isValidElement(t) && (a = t.props), !qa(a))
    return null;
  var u = {};
  return Object.keys(a).forEach(function(l) {
    var c;
    h2((c = a) === null || c === void 0 ? void 0 : c[l], l, r, n) && (u[l] = a[l]);
  }), u;
}, By = function e(t, r) {
  if (t === r)
    return !0;
  var n = V.Children.count(t);
  if (n !== V.Children.count(r))
    return !1;
  if (n === 0)
    return !0;
  if (n === 1)
    return f1(Array.isArray(t) ? t[0] : t, Array.isArray(r) ? r[0] : r);
  for (var a = 0; a < n; a++) {
    var u = t[a], l = r[a];
    if (Array.isArray(u) || Array.isArray(l)) {
      if (!e(u, l))
        return !1;
    } else if (!f1(u, l))
      return !1;
  }
  return !0;
}, f1 = function(t, r) {
  if (_e(t) && _e(r))
    return !0;
  if (!_e(t) && !_e(r)) {
    var n = t.props || {}, a = n.children, u = u1(n, s2), l = r.props || {}, c = l.children, f = u1(l, c2);
    return a && c ? sa(u, f) && By(a, c) : !a && !c ? sa(u, f) : !1;
  }
  return !1;
}, d1 = function(t, r) {
  var n = [], a = {};
  return pg(t).forEach(function(u, l) {
    if (p2(u))
      n.push(u);
    else if (u) {
      var c = un(u.type), f = r[c] || {}, d = f.handler, v = f.once;
      if (d && (!v || !a[c])) {
        var h = d(u, c, l);
        n.push(h), a[c] = !0;
      }
    }
  }), n;
}, v2 = function(t) {
  var r = t && t.type;
  return r && l1[r] ? l1[r] : null;
}, y2 = function(t, r) {
  return pg(r).indexOf(t);
}, m2 = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function zy() {
  return zy = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, zy.apply(this, arguments);
}
function g2(e, t) {
  if (e == null) return {};
  var r = b2(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function b2(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Fy(e) {
  var t = e.children, r = e.width, n = e.height, a = e.viewBox, u = e.className, l = e.style, c = e.title, f = e.desc, d = g2(e, m2), v = a || {
    width: r,
    height: n,
    x: 0,
    y: 0
  }, h = ke("recharts-surface", u);
  return /* @__PURE__ */ $.createElement("svg", zy({}, Ae(d, !0, "svg"), {
    className: h,
    width: r,
    height: n,
    style: l,
    viewBox: "".concat(v.x, " ").concat(v.y, " ").concat(v.width, " ").concat(v.height)
  }), /* @__PURE__ */ $.createElement("title", null, c), /* @__PURE__ */ $.createElement("desc", null, f), t);
}
var x2 = ["children", "className"];
function Uy() {
  return Uy = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Uy.apply(this, arguments);
}
function w2(e, t) {
  if (e == null) return {};
  var r = S2(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function S2(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var Ne = /* @__PURE__ */ $.forwardRef(function(e, t) {
  var r = e.children, n = e.className, a = w2(e, x2), u = ke("recharts-layer", n);
  return /* @__PURE__ */ $.createElement("g", Uy({
    className: u
  }, Ae(a, !0), {
    ref: t
  }), r);
}), ln = function(t, r) {
  for (var n = arguments.length, a = new Array(n > 2 ? n - 2 : 0), u = 2; u < n; u++)
    a[u - 2] = arguments[u];
}, Wp, p1;
function _2() {
  if (p1) return Wp;
  p1 = 1;
  function e(t, r, n) {
    var a = -1, u = t.length;
    r < 0 && (r = -r > u ? 0 : u + r), n = n > u ? u : n, n < 0 && (n += u), u = r > n ? 0 : n - r >>> 0, r >>>= 0;
    for (var l = Array(u); ++a < u; )
      l[a] = t[a + r];
    return l;
  }
  return Wp = e, Wp;
}
var Hp, h1;
function O2() {
  if (h1) return Hp;
  h1 = 1;
  var e = _2();
  function t(r, n, a) {
    var u = r.length;
    return a = a === void 0 ? u : a, !n && a >= u ? r : e(r, n, a);
  }
  return Hp = t, Hp;
}
var Kp, v1;
function tE() {
  if (v1) return Kp;
  v1 = 1;
  var e = "\\ud800-\\udfff", t = "\\u0300-\\u036f", r = "\\ufe20-\\ufe2f", n = "\\u20d0-\\u20ff", a = t + r + n, u = "\\ufe0e\\ufe0f", l = "\\u200d", c = RegExp("[" + l + e + a + u + "]");
  function f(d) {
    return c.test(d);
  }
  return Kp = f, Kp;
}
var Gp, y1;
function P2() {
  if (y1) return Gp;
  y1 = 1;
  function e(t) {
    return t.split("");
  }
  return Gp = e, Gp;
}
var Vp, m1;
function A2() {
  if (m1) return Vp;
  m1 = 1;
  var e = "\\ud800-\\udfff", t = "\\u0300-\\u036f", r = "\\ufe20-\\ufe2f", n = "\\u20d0-\\u20ff", a = t + r + n, u = "\\ufe0e\\ufe0f", l = "[" + e + "]", c = "[" + a + "]", f = "\\ud83c[\\udffb-\\udfff]", d = "(?:" + c + "|" + f + ")", v = "[^" + e + "]", h = "(?:\\ud83c[\\udde6-\\uddff]){2}", m = "[\\ud800-\\udbff][\\udc00-\\udfff]", x = "\\u200d", S = d + "?", w = "[" + u + "]?", b = "(?:" + x + "(?:" + [v, h, m].join("|") + ")" + w + S + ")*", P = w + S + b, C = "(?:" + [v + c + "?", c, h, m, l].join("|") + ")", A = RegExp(f + "(?=" + f + ")|" + C + P, "g");
  function T(_) {
    return _.match(A) || [];
  }
  return Vp = T, Vp;
}
var Xp, g1;
function E2() {
  if (g1) return Xp;
  g1 = 1;
  var e = P2(), t = tE(), r = A2();
  function n(a) {
    return t(a) ? r(a) : e(a);
  }
  return Xp = n, Xp;
}
var Yp, b1;
function T2() {
  if (b1) return Yp;
  b1 = 1;
  var e = O2(), t = tE(), r = E2(), n = YA();
  function a(u) {
    return function(l) {
      l = n(l);
      var c = t(l) ? r(l) : void 0, f = c ? c[0] : l.charAt(0), d = c ? e(c, 1).join("") : l.slice(1);
      return f[u]() + d;
    };
  }
  return Yp = a, Yp;
}
var Qp, x1;
function C2() {
  if (x1) return Qp;
  x1 = 1;
  var e = T2(), t = e("toUpperCase");
  return Qp = t, Qp;
}
var k2 = C2();
const vc = /* @__PURE__ */ Fe(k2);
function We(e) {
  return function() {
    return e;
  };
}
const rE = Math.cos, ps = Math.sin, Cr = Math.sqrt, hs = Math.PI, yc = 2 * hs, Wy = Math.PI, Hy = 2 * Wy, si = 1e-6, j2 = Hy - si;
function nE(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function M2(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return nE;
  const r = 10 ** t;
  return function(n) {
    this._ += n[0];
    for (let a = 1, u = n.length; a < u; ++a)
      this._ += Math.round(arguments[a] * r) / r + n[a];
  };
}
class I2 {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? nE : M2(t);
  }
  moveTo(t, r) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${this._x1 = +t},${this._y1 = +r}`;
  }
  quadraticCurveTo(t, r, n, a) {
    this._append`Q${+t},${+r},${this._x1 = +n},${this._y1 = +a}`;
  }
  bezierCurveTo(t, r, n, a, u, l) {
    this._append`C${+t},${+r},${+n},${+a},${this._x1 = +u},${this._y1 = +l}`;
  }
  arcTo(t, r, n, a, u) {
    if (t = +t, r = +r, n = +n, a = +a, u = +u, u < 0) throw new Error(`negative radius: ${u}`);
    let l = this._x1, c = this._y1, f = n - t, d = a - r, v = l - t, h = c - r, m = v * v + h * h;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (m > si) if (!(Math.abs(h * f - d * v) > si) || !u)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let x = n - l, S = a - c, w = f * f + d * d, b = x * x + S * S, P = Math.sqrt(w), C = Math.sqrt(m), A = u * Math.tan((Wy - Math.acos((w + m - b) / (2 * P * C))) / 2), T = A / C, _ = A / P;
      Math.abs(T - 1) > si && this._append`L${t + T * v},${r + T * h}`, this._append`A${u},${u},0,0,${+(h * x > v * S)},${this._x1 = t + _ * f},${this._y1 = r + _ * d}`;
    }
  }
  arc(t, r, n, a, u, l) {
    if (t = +t, r = +r, n = +n, l = !!l, n < 0) throw new Error(`negative radius: ${n}`);
    let c = n * Math.cos(a), f = n * Math.sin(a), d = t + c, v = r + f, h = 1 ^ l, m = l ? a - u : u - a;
    this._x1 === null ? this._append`M${d},${v}` : (Math.abs(this._x1 - d) > si || Math.abs(this._y1 - v) > si) && this._append`L${d},${v}`, n && (m < 0 && (m = m % Hy + Hy), m > j2 ? this._append`A${n},${n},0,1,${h},${t - c},${r - f}A${n},${n},0,1,${h},${this._x1 = d},${this._y1 = v}` : m > si && this._append`A${n},${n},0,${+(m >= Wy)},${h},${this._x1 = t + n * Math.cos(u)},${this._y1 = r + n * Math.sin(u)}`);
  }
  rect(t, r, n, a) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${n = +n}v${+a}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function hg(e) {
  let t = 3;
  return e.digits = function(r) {
    if (!arguments.length) return t;
    if (r == null)
      t = null;
    else {
      const n = Math.floor(r);
      if (!(n >= 0)) throw new RangeError(`invalid digits: ${r}`);
      t = n;
    }
    return e;
  }, () => new I2(t);
}
function vg(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function iE(e) {
  this._context = e;
}
iE.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function mc(e) {
  return new iE(e);
}
function aE(e) {
  return e[0];
}
function oE(e) {
  return e[1];
}
function uE(e, t) {
  var r = We(!0), n = null, a = mc, u = null, l = hg(c);
  e = typeof e == "function" ? e : e === void 0 ? aE : We(e), t = typeof t == "function" ? t : t === void 0 ? oE : We(t);
  function c(f) {
    var d, v = (f = vg(f)).length, h, m = !1, x;
    for (n == null && (u = a(x = l())), d = 0; d <= v; ++d)
      !(d < v && r(h = f[d], d, f)) === m && ((m = !m) ? u.lineStart() : u.lineEnd()), m && u.point(+e(h, d, f), +t(h, d, f));
    if (x) return u = null, x + "" || null;
  }
  return c.x = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : We(+f), c) : e;
  }, c.y = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : We(+f), c) : t;
  }, c.defined = function(f) {
    return arguments.length ? (r = typeof f == "function" ? f : We(!!f), c) : r;
  }, c.curve = function(f) {
    return arguments.length ? (a = f, n != null && (u = a(n)), c) : a;
  }, c.context = function(f) {
    return arguments.length ? (f == null ? n = u = null : u = a(n = f), c) : n;
  }, c;
}
function Zl(e, t, r) {
  var n = null, a = We(!0), u = null, l = mc, c = null, f = hg(d);
  e = typeof e == "function" ? e : e === void 0 ? aE : We(+e), t = typeof t == "function" ? t : We(t === void 0 ? 0 : +t), r = typeof r == "function" ? r : r === void 0 ? oE : We(+r);
  function d(h) {
    var m, x, S, w = (h = vg(h)).length, b, P = !1, C, A = new Array(w), T = new Array(w);
    for (u == null && (c = l(C = f())), m = 0; m <= w; ++m) {
      if (!(m < w && a(b = h[m], m, h)) === P)
        if (P = !P)
          x = m, c.areaStart(), c.lineStart();
        else {
          for (c.lineEnd(), c.lineStart(), S = m - 1; S >= x; --S)
            c.point(A[S], T[S]);
          c.lineEnd(), c.areaEnd();
        }
      P && (A[m] = +e(b, m, h), T[m] = +t(b, m, h), c.point(n ? +n(b, m, h) : A[m], r ? +r(b, m, h) : T[m]));
    }
    if (C) return c = null, C + "" || null;
  }
  function v() {
    return uE().defined(a).curve(l).context(u);
  }
  return d.x = function(h) {
    return arguments.length ? (e = typeof h == "function" ? h : We(+h), n = null, d) : e;
  }, d.x0 = function(h) {
    return arguments.length ? (e = typeof h == "function" ? h : We(+h), d) : e;
  }, d.x1 = function(h) {
    return arguments.length ? (n = h == null ? null : typeof h == "function" ? h : We(+h), d) : n;
  }, d.y = function(h) {
    return arguments.length ? (t = typeof h == "function" ? h : We(+h), r = null, d) : t;
  }, d.y0 = function(h) {
    return arguments.length ? (t = typeof h == "function" ? h : We(+h), d) : t;
  }, d.y1 = function(h) {
    return arguments.length ? (r = h == null ? null : typeof h == "function" ? h : We(+h), d) : r;
  }, d.lineX0 = d.lineY0 = function() {
    return v().x(e).y(t);
  }, d.lineY1 = function() {
    return v().x(e).y(r);
  }, d.lineX1 = function() {
    return v().x(n).y(t);
  }, d.defined = function(h) {
    return arguments.length ? (a = typeof h == "function" ? h : We(!!h), d) : a;
  }, d.curve = function(h) {
    return arguments.length ? (l = h, u != null && (c = l(u)), d) : l;
  }, d.context = function(h) {
    return arguments.length ? (h == null ? u = c = null : c = l(u = h), d) : u;
  }, d;
}
class lE {
  constructor(t, r) {
    this._context = t, this._x = r;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  }
  point(t, r) {
    switch (t = +t, r = +r, this._point) {
      case 0: {
        this._point = 1, this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r);
        break;
      }
      case 1:
        this._point = 2;
      // falls through
      default: {
        this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + t) / 2, this._y0, this._x0, r, t, r) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + r) / 2, t, this._y0, t, r);
        break;
      }
    }
    this._x0 = t, this._y0 = r;
  }
}
function $2(e) {
  return new lE(e, !0);
}
function N2(e) {
  return new lE(e, !1);
}
const yg = {
  draw(e, t) {
    const r = Cr(t / hs);
    e.moveTo(r, 0), e.arc(0, 0, r, 0, yc);
  }
}, R2 = {
  draw(e, t) {
    const r = Cr(t / 5) / 2;
    e.moveTo(-3 * r, -r), e.lineTo(-r, -r), e.lineTo(-r, -3 * r), e.lineTo(r, -3 * r), e.lineTo(r, -r), e.lineTo(3 * r, -r), e.lineTo(3 * r, r), e.lineTo(r, r), e.lineTo(r, 3 * r), e.lineTo(-r, 3 * r), e.lineTo(-r, r), e.lineTo(-3 * r, r), e.closePath();
  }
}, sE = Cr(1 / 3), D2 = sE * 2, L2 = {
  draw(e, t) {
    const r = Cr(t / D2), n = r * sE;
    e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath();
  }
}, q2 = {
  draw(e, t) {
    const r = Cr(t), n = -r / 2;
    e.rect(n, n, r, r);
  }
}, B2 = 0.8908130915292852, cE = ps(hs / 10) / ps(7 * hs / 10), z2 = ps(yc / 10) * cE, F2 = -rE(yc / 10) * cE, U2 = {
  draw(e, t) {
    const r = Cr(t * B2), n = z2 * r, a = F2 * r;
    e.moveTo(0, -r), e.lineTo(n, a);
    for (let u = 1; u < 5; ++u) {
      const l = yc * u / 5, c = rE(l), f = ps(l);
      e.lineTo(f * r, -c * r), e.lineTo(c * n - f * a, f * n + c * a);
    }
    e.closePath();
  }
}, Zp = Cr(3), W2 = {
  draw(e, t) {
    const r = -Cr(t / (Zp * 3));
    e.moveTo(0, r * 2), e.lineTo(-Zp * r, -r), e.lineTo(Zp * r, -r), e.closePath();
  }
}, or = -0.5, ur = Cr(3) / 2, Ky = 1 / Cr(12), H2 = (Ky / 2 + 1) * 3, K2 = {
  draw(e, t) {
    const r = Cr(t / H2), n = r / 2, a = r * Ky, u = n, l = r * Ky + r, c = -u, f = l;
    e.moveTo(n, a), e.lineTo(u, l), e.lineTo(c, f), e.lineTo(or * n - ur * a, ur * n + or * a), e.lineTo(or * u - ur * l, ur * u + or * l), e.lineTo(or * c - ur * f, ur * c + or * f), e.lineTo(or * n + ur * a, or * a - ur * n), e.lineTo(or * u + ur * l, or * l - ur * u), e.lineTo(or * c + ur * f, or * f - ur * c), e.closePath();
  }
};
function G2(e, t) {
  let r = null, n = hg(a);
  e = typeof e == "function" ? e : We(e || yg), t = typeof t == "function" ? t : We(t === void 0 ? 64 : +t);
  function a() {
    let u;
    if (r || (r = u = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), u) return r = null, u + "" || null;
  }
  return a.type = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : We(u), a) : e;
  }, a.size = function(u) {
    return arguments.length ? (t = typeof u == "function" ? u : We(+u), a) : t;
  }, a.context = function(u) {
    return arguments.length ? (r = u ?? null, a) : r;
  }, a;
}
function vs() {
}
function ys(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function fE(e) {
  this._context = e;
}
fE.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        ys(this, this._x1, this._y1);
      // falls through
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      // falls through
      default:
        ys(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function V2(e) {
  return new fE(e);
}
function dE(e) {
  this._context = e;
}
dE.prototype = {
  areaStart: vs,
  areaEnd: vs,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x2 = e, this._y2 = t;
        break;
      case 1:
        this._point = 2, this._x3 = e, this._y3 = t;
        break;
      case 2:
        this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
        break;
      default:
        ys(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function X2(e) {
  return new dE(e);
}
function pE(e) {
  this._context = e;
}
pE.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6, n = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        ys(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function Y2(e) {
  return new pE(e);
}
function hE(e) {
  this._context = e;
}
hE.prototype = {
  areaStart: vs,
  areaEnd: vs,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function Q2(e) {
  return new hE(e);
}
function w1(e) {
  return e < 0 ? -1 : 1;
}
function S1(e, t, r) {
  var n = e._x1 - e._x0, a = t - e._x1, u = (e._y1 - e._y0) / (n || a < 0 && -0), l = (r - e._y1) / (a || n < 0 && -0), c = (u * a + l * n) / (n + a);
  return (w1(u) + w1(l)) * Math.min(Math.abs(u), Math.abs(l), 0.5 * Math.abs(c)) || 0;
}
function _1(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function Jp(e, t, r) {
  var n = e._x0, a = e._y0, u = e._x1, l = e._y1, c = (u - n) / 3;
  e._context.bezierCurveTo(n + c, a + c * t, u - c, l - c * r, u, l);
}
function ms(e) {
  this._context = e;
}
ms.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Jp(this, this._t0, _1(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var r = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, Jp(this, _1(this, r = S1(this, e, t)), r);
          break;
        default:
          Jp(this, this._t0, r = S1(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function vE(e) {
  this._context = new yE(e);
}
(vE.prototype = Object.create(ms.prototype)).point = function(e, t) {
  ms.prototype.point.call(this, t, e);
};
function yE(e) {
  this._context = e;
}
yE.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, r, n, a, u) {
    this._context.bezierCurveTo(t, e, n, r, u, a);
  }
};
function Z2(e) {
  return new ms(e);
}
function J2(e) {
  return new vE(e);
}
function mE(e) {
  this._context = e;
}
mE.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [], this._y = [];
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length;
    if (r)
      if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2)
        this._context.lineTo(e[1], t[1]);
      else
        for (var n = O1(e), a = O1(t), u = 0, l = 1; l < r; ++u, ++l)
          this._context.bezierCurveTo(n[0][u], a[0][u], n[1][u], a[1][u], e[l], t[l]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function O1(e) {
  var t, r = e.length - 1, n, a = new Array(r), u = new Array(r), l = new Array(r);
  for (a[0] = 0, u[0] = 2, l[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) a[t] = 1, u[t] = 4, l[t] = 4 * e[t] + 2 * e[t + 1];
  for (a[r - 1] = 2, u[r - 1] = 7, l[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) n = a[t] / u[t - 1], u[t] -= n, l[t] -= n * l[t - 1];
  for (a[r - 1] = l[r - 1] / u[r - 1], t = r - 2; t >= 0; --t) a[t] = (l[t] - a[t + 1]) / u[t];
  for (u[r - 1] = (e[r] + a[r - 1]) / 2, t = 0; t < r - 1; ++t) u[t] = 2 * e[t + 1] - a[t + 1];
  return [a, u];
}
function eI(e) {
  return new mE(e);
}
function gc(e, t) {
  this._context = e, this._t = t;
}
gc.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN, this._point = 0;
  },
  lineEnd: function() {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default: {
        if (this._t <= 0)
          this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(r, this._y), this._context.lineTo(r, t);
        }
        break;
      }
    }
    this._x = e, this._y = t;
  }
};
function tI(e) {
  return new gc(e, 0.5);
}
function rI(e) {
  return new gc(e, 0);
}
function nI(e) {
  return new gc(e, 1);
}
function da(e, t) {
  if ((l = e.length) > 1)
    for (var r = 1, n, a, u = e[t[0]], l, c = u.length; r < l; ++r)
      for (a = u, u = e[t[r]], n = 0; n < c; ++n)
        u[n][1] += u[n][0] = isNaN(a[n][1]) ? a[n][0] : a[n][1];
}
function Gy(e) {
  for (var t = e.length, r = new Array(t); --t >= 0; ) r[t] = t;
  return r;
}
function iI(e, t) {
  return e[t];
}
function aI(e) {
  const t = [];
  return t.key = e, t;
}
function oI() {
  var e = We([]), t = Gy, r = da, n = iI;
  function a(u) {
    var l = Array.from(e.apply(this, arguments), aI), c, f = l.length, d = -1, v;
    for (const h of u)
      for (c = 0, ++d; c < f; ++c)
        (l[c][d] = [0, +n(h, l[c].key, d, u)]).data = h;
    for (c = 0, v = vg(t(l)); c < f; ++c)
      l[v[c]].index = c;
    return r(l, v), l;
  }
  return a.keys = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : We(Array.from(u)), a) : e;
  }, a.value = function(u) {
    return arguments.length ? (n = typeof u == "function" ? u : We(+u), a) : n;
  }, a.order = function(u) {
    return arguments.length ? (t = u == null ? Gy : typeof u == "function" ? u : We(Array.from(u)), a) : t;
  }, a.offset = function(u) {
    return arguments.length ? (r = u ?? da, a) : r;
  }, a;
}
function uI(e, t) {
  if ((n = e.length) > 0) {
    for (var r, n, a = 0, u = e[0].length, l; a < u; ++a) {
      for (l = r = 0; r < n; ++r) l += e[r][a][1] || 0;
      if (l) for (r = 0; r < n; ++r) e[r][a][1] /= l;
    }
    da(e, t);
  }
}
function lI(e, t) {
  if ((a = e.length) > 0) {
    for (var r = 0, n = e[t[0]], a, u = n.length; r < u; ++r) {
      for (var l = 0, c = 0; l < a; ++l) c += e[l][r][1] || 0;
      n[r][1] += n[r][0] = -c / 2;
    }
    da(e, t);
  }
}
function sI(e, t) {
  if (!(!((l = e.length) > 0) || !((u = (a = e[t[0]]).length) > 0))) {
    for (var r = 0, n = 1, a, u, l; n < u; ++n) {
      for (var c = 0, f = 0, d = 0; c < l; ++c) {
        for (var v = e[t[c]], h = v[n][1] || 0, m = v[n - 1][1] || 0, x = (h - m) / 2, S = 0; S < c; ++S) {
          var w = e[t[S]], b = w[n][1] || 0, P = w[n - 1][1] || 0;
          x += b - P;
        }
        f += h, d += x * h;
      }
      a[n - 1][1] += a[n - 1][0] = r, f && (r -= d / f);
    }
    a[n - 1][1] += a[n - 1][0] = r, da(e, t);
  }
}
function tu(e) {
  "@babel/helpers - typeof";
  return tu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, tu(e);
}
var cI = ["type", "size", "sizeType"];
function Vy() {
  return Vy = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Vy.apply(this, arguments);
}
function P1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function A1(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? P1(Object(r), !0).forEach(function(n) {
      fI(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : P1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function fI(e, t, r) {
  return t = dI(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function dI(e) {
  var t = pI(e, "string");
  return tu(t) == "symbol" ? t : t + "";
}
function pI(e, t) {
  if (tu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (tu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function hI(e, t) {
  if (e == null) return {};
  var r = vI(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function vI(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var gE = {
  symbolCircle: yg,
  symbolCross: R2,
  symbolDiamond: L2,
  symbolSquare: q2,
  symbolStar: U2,
  symbolTriangle: W2,
  symbolWye: K2
}, yI = Math.PI / 180, mI = function(t) {
  var r = "symbol".concat(vc(t));
  return gE[r] || yg;
}, gI = function(t, r, n) {
  if (r === "area")
    return t;
  switch (n) {
    case "cross":
      return 5 * t * t / 9;
    case "diamond":
      return 0.5 * t * t / Math.sqrt(3);
    case "square":
      return t * t;
    case "star": {
      var a = 18 * yI;
      return 1.25 * t * t * (Math.tan(a) - Math.tan(a * 2) * Math.pow(Math.tan(a), 2));
    }
    case "triangle":
      return Math.sqrt(3) * t * t / 4;
    case "wye":
      return (21 - 10 * Math.sqrt(3)) * t * t / 8;
    default:
      return Math.PI * t * t / 4;
  }
}, bI = function(t, r) {
  gE["symbol".concat(vc(t))] = r;
}, bc = function(t) {
  var r = t.type, n = r === void 0 ? "circle" : r, a = t.size, u = a === void 0 ? 64 : a, l = t.sizeType, c = l === void 0 ? "area" : l, f = hI(t, cI), d = A1(A1({}, f), {}, {
    type: n,
    size: u,
    sizeType: c
  }), v = function() {
    var b = mI(n), P = G2().type(b).size(gI(u, c, n));
    return P();
  }, h = d.className, m = d.cx, x = d.cy, S = Ae(d, !0);
  return m === +m && x === +x && u === +u ? /* @__PURE__ */ $.createElement("path", Vy({}, S, {
    className: ke("recharts-symbols", h),
    transform: "translate(".concat(m, ", ").concat(x, ")"),
    d: v()
  })) : null;
};
bc.registerSymbol = bI;
function pa(e) {
  "@babel/helpers - typeof";
  return pa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, pa(e);
}
function Xy() {
  return Xy = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Xy.apply(this, arguments);
}
function E1(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function xI(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? E1(Object(r), !0).forEach(function(n) {
      ru(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : E1(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function wI(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function SI(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, xE(n.key), n);
  }
}
function _I(e, t, r) {
  return t && SI(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function OI(e, t, r) {
  return t = gs(t), PI(e, bE() ? Reflect.construct(t, r || [], gs(e).constructor) : t.apply(e, r));
}
function PI(e, t) {
  if (t && (pa(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return AI(e);
}
function AI(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function bE() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (bE = function() {
    return !!e;
  })();
}
function gs(e) {
  return gs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, gs(e);
}
function EI(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Yy(e, t);
}
function Yy(e, t) {
  return Yy = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Yy(e, t);
}
function ru(e, t, r) {
  return t = xE(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function xE(e) {
  var t = TI(e, "string");
  return pa(t) == "symbol" ? t : t + "";
}
function TI(e, t) {
  if (pa(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (pa(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var lr = 32, mg = /* @__PURE__ */ (function(e) {
  function t() {
    return wI(this, t), OI(this, t, arguments);
  }
  return EI(t, e), _I(t, [{
    key: "renderIcon",
    value: (
      /**
       * Render the path of icon
       * @param {Object} data Data of each legend item
       * @return {String} Path element
       */
      function(n) {
        var a = this.props.inactiveColor, u = lr / 2, l = lr / 6, c = lr / 3, f = n.inactive ? a : n.color;
        if (n.type === "plainline")
          return /* @__PURE__ */ $.createElement("line", {
            strokeWidth: 4,
            fill: "none",
            stroke: f,
            strokeDasharray: n.payload.strokeDasharray,
            x1: 0,
            y1: u,
            x2: lr,
            y2: u,
            className: "recharts-legend-icon"
          });
        if (n.type === "line")
          return /* @__PURE__ */ $.createElement("path", {
            strokeWidth: 4,
            fill: "none",
            stroke: f,
            d: "M0,".concat(u, "h").concat(c, `
            A`).concat(l, ",").concat(l, ",0,1,1,").concat(2 * c, ",").concat(u, `
            H`).concat(lr, "M").concat(2 * c, ",").concat(u, `
            A`).concat(l, ",").concat(l, ",0,1,1,").concat(c, ",").concat(u),
            className: "recharts-legend-icon"
          });
        if (n.type === "rect")
          return /* @__PURE__ */ $.createElement("path", {
            stroke: "none",
            fill: f,
            d: "M0,".concat(lr / 8, "h").concat(lr, "v").concat(lr * 3 / 4, "h").concat(-lr, "z"),
            className: "recharts-legend-icon"
          });
        if (/* @__PURE__ */ $.isValidElement(n.legendIcon)) {
          var d = xI({}, n);
          return delete d.legendIcon, /* @__PURE__ */ $.cloneElement(n.legendIcon, d);
        }
        return /* @__PURE__ */ $.createElement(bc, {
          fill: f,
          cx: u,
          cy: u,
          size: lr,
          sizeType: "diameter",
          type: n.type
        });
      }
    )
    /**
     * Draw items of legend
     * @return {ReactElement} Items
     */
  }, {
    key: "renderItems",
    value: function() {
      var n = this, a = this.props, u = a.payload, l = a.iconSize, c = a.layout, f = a.formatter, d = a.inactiveColor, v = {
        x: 0,
        y: 0,
        width: lr,
        height: lr
      }, h = {
        display: c === "horizontal" ? "inline-block" : "block",
        marginRight: 10
      }, m = {
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: 4
      };
      return u.map(function(x, S) {
        var w = x.formatter || f, b = ke(ru(ru({
          "recharts-legend-item": !0
        }, "legend-item-".concat(S), !0), "inactive", x.inactive));
        if (x.type === "none")
          return null;
        var P = Ee(x.value) ? null : x.value;
        ln(
          !Ee(x.value),
          `The name property is also required when using a function for the dataKey of a chart's cartesian components. Ex: <Bar name="Name of my Data"/>`
          // eslint-disable-line max-len
        );
        var C = x.inactive ? d : x.color;
        return /* @__PURE__ */ $.createElement("li", Xy({
          className: b,
          style: h,
          key: "legend-item-".concat(S)
        }, eu(n.props, x, S)), /* @__PURE__ */ $.createElement(Fy, {
          width: l,
          height: l,
          viewBox: v,
          style: m
        }, n.renderIcon(x)), /* @__PURE__ */ $.createElement("span", {
          className: "recharts-legend-item-text",
          style: {
            color: C
          }
        }, w ? w(P, x, S) : P));
      });
    }
  }, {
    key: "render",
    value: function() {
      var n = this.props, a = n.payload, u = n.layout, l = n.align;
      if (!a || !a.length)
        return null;
      var c = {
        padding: 0,
        margin: 0,
        textAlign: u === "horizontal" ? l : "left"
      };
      return /* @__PURE__ */ $.createElement("ul", {
        className: "recharts-default-legend",
        style: c
      }, this.renderItems());
    }
  }]);
})(V.PureComponent);
ru(mg, "displayName", "Legend");
ru(mg, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "middle",
  inactiveColor: "#ccc"
});
var eh, T1;
function CI() {
  if (T1) return eh;
  T1 = 1;
  var e = dc();
  function t() {
    this.__data__ = new e(), this.size = 0;
  }
  return eh = t, eh;
}
var th, C1;
function kI() {
  if (C1) return th;
  C1 = 1;
  function e(t) {
    var r = this.__data__, n = r.delete(t);
    return this.size = r.size, n;
  }
  return th = e, th;
}
var rh, k1;
function jI() {
  if (k1) return rh;
  k1 = 1;
  function e(t) {
    return this.__data__.get(t);
  }
  return rh = e, rh;
}
var nh, j1;
function MI() {
  if (j1) return nh;
  j1 = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return nh = e, nh;
}
var ih, M1;
function II() {
  if (M1) return ih;
  M1 = 1;
  var e = dc(), t = lg(), r = sg(), n = 200;
  function a(u, l) {
    var c = this.__data__;
    if (c instanceof e) {
      var f = c.__data__;
      if (!t || f.length < n - 1)
        return f.push([u, l]), this.size = ++c.size, this;
      c = this.__data__ = new r(f);
    }
    return c.set(u, l), this.size = c.size, this;
  }
  return ih = a, ih;
}
var ah, I1;
function wE() {
  if (I1) return ah;
  I1 = 1;
  var e = dc(), t = CI(), r = kI(), n = jI(), a = MI(), u = II();
  function l(c) {
    var f = this.__data__ = new e(c);
    this.size = f.size;
  }
  return l.prototype.clear = t, l.prototype.delete = r, l.prototype.get = n, l.prototype.has = a, l.prototype.set = u, ah = l, ah;
}
var oh, $1;
function $I() {
  if ($1) return oh;
  $1 = 1;
  var e = "__lodash_hash_undefined__";
  function t(r) {
    return this.__data__.set(r, e), this;
  }
  return oh = t, oh;
}
var uh, N1;
function NI() {
  if (N1) return uh;
  N1 = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return uh = e, uh;
}
var lh, R1;
function SE() {
  if (R1) return lh;
  R1 = 1;
  var e = sg(), t = $I(), r = NI();
  function n(a) {
    var u = -1, l = a == null ? 0 : a.length;
    for (this.__data__ = new e(); ++u < l; )
      this.add(a[u]);
  }
  return n.prototype.add = n.prototype.push = t, n.prototype.has = r, lh = n, lh;
}
var sh, D1;
function _E() {
  if (D1) return sh;
  D1 = 1;
  function e(t, r) {
    for (var n = -1, a = t == null ? 0 : t.length; ++n < a; )
      if (r(t[n], n, t))
        return !0;
    return !1;
  }
  return sh = e, sh;
}
var ch, L1;
function OE() {
  if (L1) return ch;
  L1 = 1;
  function e(t, r) {
    return t.has(r);
  }
  return ch = e, ch;
}
var fh, q1;
function PE() {
  if (q1) return fh;
  q1 = 1;
  var e = SE(), t = _E(), r = OE(), n = 1, a = 2;
  function u(l, c, f, d, v, h) {
    var m = f & n, x = l.length, S = c.length;
    if (x != S && !(m && S > x))
      return !1;
    var w = h.get(l), b = h.get(c);
    if (w && b)
      return w == c && b == l;
    var P = -1, C = !0, A = f & a ? new e() : void 0;
    for (h.set(l, c), h.set(c, l); ++P < x; ) {
      var T = l[P], _ = c[P];
      if (d)
        var O = m ? d(_, T, P, c, l, h) : d(T, _, P, l, c, h);
      if (O !== void 0) {
        if (O)
          continue;
        C = !1;
        break;
      }
      if (A) {
        if (!t(c, function(k, M) {
          if (!r(A, M) && (T === k || v(T, k, f, d, h)))
            return A.push(M);
        })) {
          C = !1;
          break;
        }
      } else if (!(T === _ || v(T, _, f, d, h))) {
        C = !1;
        break;
      }
    }
    return h.delete(l), h.delete(c), C;
  }
  return fh = u, fh;
}
var dh, B1;
function RI() {
  if (B1) return dh;
  B1 = 1;
  var e = Gr(), t = e.Uint8Array;
  return dh = t, dh;
}
var ph, z1;
function DI() {
  if (z1) return ph;
  z1 = 1;
  function e(t) {
    var r = -1, n = Array(t.size);
    return t.forEach(function(a, u) {
      n[++r] = [u, a];
    }), n;
  }
  return ph = e, ph;
}
var hh, F1;
function gg() {
  if (F1) return hh;
  F1 = 1;
  function e(t) {
    var r = -1, n = Array(t.size);
    return t.forEach(function(a) {
      n[++r] = a;
    }), n;
  }
  return hh = e, hh;
}
var vh, U1;
function LI() {
  if (U1) return vh;
  U1 = 1;
  var e = Ru(), t = RI(), r = ug(), n = PE(), a = DI(), u = gg(), l = 1, c = 2, f = "[object Boolean]", d = "[object Date]", v = "[object Error]", h = "[object Map]", m = "[object Number]", x = "[object RegExp]", S = "[object Set]", w = "[object String]", b = "[object Symbol]", P = "[object ArrayBuffer]", C = "[object DataView]", A = e ? e.prototype : void 0, T = A ? A.valueOf : void 0;
  function _(O, k, M, N, W, R, q) {
    switch (M) {
      case C:
        if (O.byteLength != k.byteLength || O.byteOffset != k.byteOffset)
          return !1;
        O = O.buffer, k = k.buffer;
      case P:
        return !(O.byteLength != k.byteLength || !R(new t(O), new t(k)));
      case f:
      case d:
      case m:
        return r(+O, +k);
      case v:
        return O.name == k.name && O.message == k.message;
      case x:
      case w:
        return O == k + "";
      case h:
        var F = a;
      case S:
        var X = N & l;
        if (F || (F = u), O.size != k.size && !X)
          return !1;
        var G = q.get(O);
        if (G)
          return G == k;
        N |= c, q.set(O, k);
        var Y = n(F(O), F(k), N, W, R, q);
        return q.delete(O), Y;
      case b:
        if (T)
          return T.call(O) == T.call(k);
    }
    return !1;
  }
  return vh = _, vh;
}
var yh, W1;
function AE() {
  if (W1) return yh;
  W1 = 1;
  function e(t, r) {
    for (var n = -1, a = r.length, u = t.length; ++n < a; )
      t[u + n] = r[n];
    return t;
  }
  return yh = e, yh;
}
var mh, H1;
function qI() {
  if (H1) return mh;
  H1 = 1;
  var e = AE(), t = Wt();
  function r(n, a, u) {
    var l = a(n);
    return t(n) ? l : e(l, u(n));
  }
  return mh = r, mh;
}
var gh, K1;
function BI() {
  if (K1) return gh;
  K1 = 1;
  function e(t, r) {
    for (var n = -1, a = t == null ? 0 : t.length, u = 0, l = []; ++n < a; ) {
      var c = t[n];
      r(c, n, t) && (l[u++] = c);
    }
    return l;
  }
  return gh = e, gh;
}
var bh, G1;
function zI() {
  if (G1) return bh;
  G1 = 1;
  function e() {
    return [];
  }
  return bh = e, bh;
}
var xh, V1;
function FI() {
  if (V1) return xh;
  V1 = 1;
  var e = BI(), t = zI(), r = Object.prototype, n = r.propertyIsEnumerable, a = Object.getOwnPropertySymbols, u = a ? function(l) {
    return l == null ? [] : (l = Object(l), e(a(l), function(c) {
      return n.call(l, c);
    }));
  } : t;
  return xh = u, xh;
}
var wh, X1;
function UI() {
  if (X1) return wh;
  X1 = 1;
  function e(t, r) {
    for (var n = -1, a = Array(t); ++n < t; )
      a[n] = r(n);
    return a;
  }
  return wh = e, wh;
}
var Sh, Y1;
function WI() {
  if (Y1) return Sh;
  Y1 = 1;
  var e = hn(), t = vn(), r = "[object Arguments]";
  function n(a) {
    return t(a) && e(a) == r;
  }
  return Sh = n, Sh;
}
var _h, Q1;
function bg() {
  if (Q1) return _h;
  Q1 = 1;
  var e = WI(), t = vn(), r = Object.prototype, n = r.hasOwnProperty, a = r.propertyIsEnumerable, u = e(/* @__PURE__ */ (function() {
    return arguments;
  })()) ? e : function(l) {
    return t(l) && n.call(l, "callee") && !a.call(l, "callee");
  };
  return _h = u, _h;
}
var Uo = { exports: {} }, Oh, Z1;
function HI() {
  if (Z1) return Oh;
  Z1 = 1;
  function e() {
    return !1;
  }
  return Oh = e, Oh;
}
Uo.exports;
var J1;
function EE() {
  return J1 || (J1 = 1, (function(e, t) {
    var r = Gr(), n = HI(), a = t && !t.nodeType && t, u = a && !0 && e && !e.nodeType && e, l = u && u.exports === a, c = l ? r.Buffer : void 0, f = c ? c.isBuffer : void 0, d = f || n;
    e.exports = d;
  })(Uo, Uo.exports)), Uo.exports;
}
var Ph, eS;
function xg() {
  if (eS) return Ph;
  eS = 1;
  var e = 9007199254740991, t = /^(?:0|[1-9]\d*)$/;
  function r(n, a) {
    var u = typeof n;
    return a = a ?? e, !!a && (u == "number" || u != "symbol" && t.test(n)) && n > -1 && n % 1 == 0 && n < a;
  }
  return Ph = r, Ph;
}
var Ah, tS;
function wg() {
  if (tS) return Ah;
  tS = 1;
  var e = 9007199254740991;
  function t(r) {
    return typeof r == "number" && r > -1 && r % 1 == 0 && r <= e;
  }
  return Ah = t, Ah;
}
var Eh, rS;
function KI() {
  if (rS) return Eh;
  rS = 1;
  var e = hn(), t = wg(), r = vn(), n = "[object Arguments]", a = "[object Array]", u = "[object Boolean]", l = "[object Date]", c = "[object Error]", f = "[object Function]", d = "[object Map]", v = "[object Number]", h = "[object Object]", m = "[object RegExp]", x = "[object Set]", S = "[object String]", w = "[object WeakMap]", b = "[object ArrayBuffer]", P = "[object DataView]", C = "[object Float32Array]", A = "[object Float64Array]", T = "[object Int8Array]", _ = "[object Int16Array]", O = "[object Int32Array]", k = "[object Uint8Array]", M = "[object Uint8ClampedArray]", N = "[object Uint16Array]", W = "[object Uint32Array]", R = {};
  R[C] = R[A] = R[T] = R[_] = R[O] = R[k] = R[M] = R[N] = R[W] = !0, R[n] = R[a] = R[b] = R[u] = R[P] = R[l] = R[c] = R[f] = R[d] = R[v] = R[h] = R[m] = R[x] = R[S] = R[w] = !1;
  function q(F) {
    return r(F) && t(F.length) && !!R[e(F)];
  }
  return Eh = q, Eh;
}
var Th, nS;
function TE() {
  if (nS) return Th;
  nS = 1;
  function e(t) {
    return function(r) {
      return t(r);
    };
  }
  return Th = e, Th;
}
var Wo = { exports: {} };
Wo.exports;
var iS;
function GI() {
  return iS || (iS = 1, (function(e, t) {
    var r = GA(), n = t && !t.nodeType && t, a = n && !0 && e && !e.nodeType && e, u = a && a.exports === n, l = u && r.process, c = (function() {
      try {
        var f = a && a.require && a.require("util").types;
        return f || l && l.binding && l.binding("util");
      } catch {
      }
    })();
    e.exports = c;
  })(Wo, Wo.exports)), Wo.exports;
}
var Ch, aS;
function CE() {
  if (aS) return Ch;
  aS = 1;
  var e = KI(), t = TE(), r = GI(), n = r && r.isTypedArray, a = n ? t(n) : e;
  return Ch = a, Ch;
}
var kh, oS;
function VI() {
  if (oS) return kh;
  oS = 1;
  var e = UI(), t = bg(), r = Wt(), n = EE(), a = xg(), u = CE(), l = Object.prototype, c = l.hasOwnProperty;
  function f(d, v) {
    var h = r(d), m = !h && t(d), x = !h && !m && n(d), S = !h && !m && !x && u(d), w = h || m || x || S, b = w ? e(d.length, String) : [], P = b.length;
    for (var C in d)
      (v || c.call(d, C)) && !(w && // Safari 9 has enumerable `arguments.length` in strict mode.
      (C == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      x && (C == "offset" || C == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      S && (C == "buffer" || C == "byteLength" || C == "byteOffset") || // Skip index properties.
      a(C, P))) && b.push(C);
    return b;
  }
  return kh = f, kh;
}
var jh, uS;
function XI() {
  if (uS) return jh;
  uS = 1;
  var e = Object.prototype;
  function t(r) {
    var n = r && r.constructor, a = typeof n == "function" && n.prototype || e;
    return r === a;
  }
  return jh = t, jh;
}
var Mh, lS;
function kE() {
  if (lS) return Mh;
  lS = 1;
  function e(t, r) {
    return function(n) {
      return t(r(n));
    };
  }
  return Mh = e, Mh;
}
var Ih, sS;
function YI() {
  if (sS) return Ih;
  sS = 1;
  var e = kE(), t = e(Object.keys, Object);
  return Ih = t, Ih;
}
var $h, cS;
function QI() {
  if (cS) return $h;
  cS = 1;
  var e = XI(), t = YI(), r = Object.prototype, n = r.hasOwnProperty;
  function a(u) {
    if (!e(u))
      return t(u);
    var l = [];
    for (var c in Object(u))
      n.call(u, c) && c != "constructor" && l.push(c);
    return l;
  }
  return $h = a, $h;
}
var Nh, fS;
function Du() {
  if (fS) return Nh;
  fS = 1;
  var e = og(), t = wg();
  function r(n) {
    return n != null && t(n.length) && !e(n);
  }
  return Nh = r, Nh;
}
var Rh, dS;
function xc() {
  if (dS) return Rh;
  dS = 1;
  var e = VI(), t = QI(), r = Du();
  function n(a) {
    return r(a) ? e(a) : t(a);
  }
  return Rh = n, Rh;
}
var Dh, pS;
function ZI() {
  if (pS) return Dh;
  pS = 1;
  var e = qI(), t = FI(), r = xc();
  function n(a) {
    return e(a, r, t);
  }
  return Dh = n, Dh;
}
var Lh, hS;
function JI() {
  if (hS) return Lh;
  hS = 1;
  var e = ZI(), t = 1, r = Object.prototype, n = r.hasOwnProperty;
  function a(u, l, c, f, d, v) {
    var h = c & t, m = e(u), x = m.length, S = e(l), w = S.length;
    if (x != w && !h)
      return !1;
    for (var b = x; b--; ) {
      var P = m[b];
      if (!(h ? P in l : n.call(l, P)))
        return !1;
    }
    var C = v.get(u), A = v.get(l);
    if (C && A)
      return C == l && A == u;
    var T = !0;
    v.set(u, l), v.set(l, u);
    for (var _ = h; ++b < x; ) {
      P = m[b];
      var O = u[P], k = l[P];
      if (f)
        var M = h ? f(k, O, P, l, u, v) : f(O, k, P, u, l, v);
      if (!(M === void 0 ? O === k || d(O, k, c, f, v) : M)) {
        T = !1;
        break;
      }
      _ || (_ = P == "constructor");
    }
    if (T && !_) {
      var N = u.constructor, W = l.constructor;
      N != W && "constructor" in u && "constructor" in l && !(typeof N == "function" && N instanceof N && typeof W == "function" && W instanceof W) && (T = !1);
    }
    return v.delete(u), v.delete(l), T;
  }
  return Lh = a, Lh;
}
var qh, vS;
function e$() {
  if (vS) return qh;
  vS = 1;
  var e = Ai(), t = Gr(), r = e(t, "DataView");
  return qh = r, qh;
}
var Bh, yS;
function t$() {
  if (yS) return Bh;
  yS = 1;
  var e = Ai(), t = Gr(), r = e(t, "Promise");
  return Bh = r, Bh;
}
var zh, mS;
function jE() {
  if (mS) return zh;
  mS = 1;
  var e = Ai(), t = Gr(), r = e(t, "Set");
  return zh = r, zh;
}
var Fh, gS;
function r$() {
  if (gS) return Fh;
  gS = 1;
  var e = Ai(), t = Gr(), r = e(t, "WeakMap");
  return Fh = r, Fh;
}
var Uh, bS;
function n$() {
  if (bS) return Uh;
  bS = 1;
  var e = e$(), t = lg(), r = t$(), n = jE(), a = r$(), u = hn(), l = VA(), c = "[object Map]", f = "[object Object]", d = "[object Promise]", v = "[object Set]", h = "[object WeakMap]", m = "[object DataView]", x = l(e), S = l(t), w = l(r), b = l(n), P = l(a), C = u;
  return (e && C(new e(new ArrayBuffer(1))) != m || t && C(new t()) != c || r && C(r.resolve()) != d || n && C(new n()) != v || a && C(new a()) != h) && (C = function(A) {
    var T = u(A), _ = T == f ? A.constructor : void 0, O = _ ? l(_) : "";
    if (O)
      switch (O) {
        case x:
          return m;
        case S:
          return c;
        case w:
          return d;
        case b:
          return v;
        case P:
          return h;
      }
    return T;
  }), Uh = C, Uh;
}
var Wh, xS;
function i$() {
  if (xS) return Wh;
  xS = 1;
  var e = wE(), t = PE(), r = LI(), n = JI(), a = n$(), u = Wt(), l = EE(), c = CE(), f = 1, d = "[object Arguments]", v = "[object Array]", h = "[object Object]", m = Object.prototype, x = m.hasOwnProperty;
  function S(w, b, P, C, A, T) {
    var _ = u(w), O = u(b), k = _ ? v : a(w), M = O ? v : a(b);
    k = k == d ? h : k, M = M == d ? h : M;
    var N = k == h, W = M == h, R = k == M;
    if (R && l(w)) {
      if (!l(b))
        return !1;
      _ = !0, N = !1;
    }
    if (R && !N)
      return T || (T = new e()), _ || c(w) ? t(w, b, P, C, A, T) : r(w, b, k, P, C, A, T);
    if (!(P & f)) {
      var q = N && x.call(w, "__wrapped__"), F = W && x.call(b, "__wrapped__");
      if (q || F) {
        var X = q ? w.value() : w, G = F ? b.value() : b;
        return T || (T = new e()), A(X, G, P, C, T);
      }
    }
    return R ? (T || (T = new e()), n(w, b, P, C, A, T)) : !1;
  }
  return Wh = S, Wh;
}
var Hh, wS;
function Sg() {
  if (wS) return Hh;
  wS = 1;
  var e = i$(), t = vn();
  function r(n, a, u, l, c) {
    return n === a ? !0 : n == null || a == null || !t(n) && !t(a) ? n !== n && a !== a : e(n, a, u, l, r, c);
  }
  return Hh = r, Hh;
}
var Kh, SS;
function a$() {
  if (SS) return Kh;
  SS = 1;
  var e = wE(), t = Sg(), r = 1, n = 2;
  function a(u, l, c, f) {
    var d = c.length, v = d, h = !f;
    if (u == null)
      return !v;
    for (u = Object(u); d--; ) {
      var m = c[d];
      if (h && m[2] ? m[1] !== u[m[0]] : !(m[0] in u))
        return !1;
    }
    for (; ++d < v; ) {
      m = c[d];
      var x = m[0], S = u[x], w = m[1];
      if (h && m[2]) {
        if (S === void 0 && !(x in u))
          return !1;
      } else {
        var b = new e();
        if (f)
          var P = f(S, w, x, u, l, b);
        if (!(P === void 0 ? t(w, S, r | n, f, b) : P))
          return !1;
      }
    }
    return !0;
  }
  return Kh = a, Kh;
}
var Gh, _S;
function ME() {
  if (_S) return Gh;
  _S = 1;
  var e = Un();
  function t(r) {
    return r === r && !e(r);
  }
  return Gh = t, Gh;
}
var Vh, OS;
function o$() {
  if (OS) return Vh;
  OS = 1;
  var e = ME(), t = xc();
  function r(n) {
    for (var a = t(n), u = a.length; u--; ) {
      var l = a[u], c = n[l];
      a[u] = [l, c, e(c)];
    }
    return a;
  }
  return Vh = r, Vh;
}
var Xh, PS;
function IE() {
  if (PS) return Xh;
  PS = 1;
  function e(t, r) {
    return function(n) {
      return n == null ? !1 : n[t] === r && (r !== void 0 || t in Object(n));
    };
  }
  return Xh = e, Xh;
}
var Yh, AS;
function u$() {
  if (AS) return Yh;
  AS = 1;
  var e = a$(), t = o$(), r = IE();
  function n(a) {
    var u = t(a);
    return u.length == 1 && u[0][2] ? r(u[0][0], u[0][1]) : function(l) {
      return l === a || e(l, a, u);
    };
  }
  return Yh = n, Yh;
}
var Qh, ES;
function l$() {
  if (ES) return Qh;
  ES = 1;
  function e(t, r) {
    return t != null && r in Object(t);
  }
  return Qh = e, Qh;
}
var Zh, TS;
function s$() {
  if (TS) return Zh;
  TS = 1;
  var e = QA(), t = bg(), r = Wt(), n = xg(), a = wg(), u = hc();
  function l(c, f, d) {
    f = e(f, c);
    for (var v = -1, h = f.length, m = !1; ++v < h; ) {
      var x = u(f[v]);
      if (!(m = c != null && d(c, x)))
        break;
      c = c[x];
    }
    return m || ++v != h ? m : (h = c == null ? 0 : c.length, !!h && a(h) && n(x, h) && (r(c) || t(c)));
  }
  return Zh = l, Zh;
}
var Jh, CS;
function c$() {
  if (CS) return Jh;
  CS = 1;
  var e = l$(), t = s$();
  function r(n, a) {
    return n != null && t(n, a, e);
  }
  return Jh = r, Jh;
}
var ev, kS;
function f$() {
  if (kS) return ev;
  kS = 1;
  var e = Sg(), t = ZA(), r = c$(), n = ag(), a = ME(), u = IE(), l = hc(), c = 1, f = 2;
  function d(v, h) {
    return n(v) && a(h) ? u(l(v), h) : function(m) {
      var x = t(m, v);
      return x === void 0 && x === h ? r(m, v) : e(h, x, c | f);
    };
  }
  return ev = d, ev;
}
var tv, jS;
function za() {
  if (jS) return tv;
  jS = 1;
  function e(t) {
    return t;
  }
  return tv = e, tv;
}
var rv, MS;
function d$() {
  if (MS) return rv;
  MS = 1;
  function e(t) {
    return function(r) {
      return r?.[t];
    };
  }
  return rv = e, rv;
}
var nv, IS;
function p$() {
  if (IS) return nv;
  IS = 1;
  var e = fg();
  function t(r) {
    return function(n) {
      return e(n, r);
    };
  }
  return nv = t, nv;
}
var iv, $S;
function h$() {
  if ($S) return iv;
  $S = 1;
  var e = d$(), t = p$(), r = ag(), n = hc();
  function a(u) {
    return r(u) ? e(n(u)) : t(u);
  }
  return iv = a, iv;
}
var av, NS;
function Wn() {
  if (NS) return av;
  NS = 1;
  var e = u$(), t = f$(), r = za(), n = Wt(), a = h$();
  function u(l) {
    return typeof l == "function" ? l : l == null ? r : typeof l == "object" ? n(l) ? t(l[0], l[1]) : e(l) : a(l);
  }
  return av = u, av;
}
var ov, RS;
function $E() {
  if (RS) return ov;
  RS = 1;
  function e(t, r, n, a) {
    for (var u = t.length, l = n + (a ? 1 : -1); a ? l-- : ++l < u; )
      if (r(t[l], l, t))
        return l;
    return -1;
  }
  return ov = e, ov;
}
var uv, DS;
function v$() {
  if (DS) return uv;
  DS = 1;
  function e(t) {
    return t !== t;
  }
  return uv = e, uv;
}
var lv, LS;
function y$() {
  if (LS) return lv;
  LS = 1;
  function e(t, r, n) {
    for (var a = n - 1, u = t.length; ++a < u; )
      if (t[a] === r)
        return a;
    return -1;
  }
  return lv = e, lv;
}
var sv, qS;
function m$() {
  if (qS) return sv;
  qS = 1;
  var e = $E(), t = v$(), r = y$();
  function n(a, u, l) {
    return u === u ? r(a, u, l) : e(a, t, l);
  }
  return sv = n, sv;
}
var cv, BS;
function g$() {
  if (BS) return cv;
  BS = 1;
  var e = m$();
  function t(r, n) {
    var a = r == null ? 0 : r.length;
    return !!a && e(r, n, 0) > -1;
  }
  return cv = t, cv;
}
var fv, zS;
function b$() {
  if (zS) return fv;
  zS = 1;
  function e(t, r, n) {
    for (var a = -1, u = t == null ? 0 : t.length; ++a < u; )
      if (n(r, t[a]))
        return !0;
    return !1;
  }
  return fv = e, fv;
}
var dv, FS;
function x$() {
  if (FS) return dv;
  FS = 1;
  function e() {
  }
  return dv = e, dv;
}
var pv, US;
function w$() {
  if (US) return pv;
  US = 1;
  var e = jE(), t = x$(), r = gg(), n = 1 / 0, a = e && 1 / r(new e([, -0]))[1] == n ? function(u) {
    return new e(u);
  } : t;
  return pv = a, pv;
}
var hv, WS;
function S$() {
  if (WS) return hv;
  WS = 1;
  var e = SE(), t = g$(), r = b$(), n = OE(), a = w$(), u = gg(), l = 200;
  function c(f, d, v) {
    var h = -1, m = t, x = f.length, S = !0, w = [], b = w;
    if (v)
      S = !1, m = r;
    else if (x >= l) {
      var P = d ? null : a(f);
      if (P)
        return u(P);
      S = !1, m = n, b = new e();
    } else
      b = d ? [] : w;
    e:
      for (; ++h < x; ) {
        var C = f[h], A = d ? d(C) : C;
        if (C = v || C !== 0 ? C : 0, S && A === A) {
          for (var T = b.length; T--; )
            if (b[T] === A)
              continue e;
          d && b.push(A), w.push(C);
        } else m(b, A, v) || (b !== w && b.push(A), w.push(C));
      }
    return w;
  }
  return hv = c, hv;
}
var vv, HS;
function _$() {
  if (HS) return vv;
  HS = 1;
  var e = Wn(), t = S$();
  function r(n, a) {
    return n && n.length ? t(n, e(a, 2)) : [];
  }
  return vv = r, vv;
}
var O$ = _$();
const KS = /* @__PURE__ */ Fe(O$);
function NE(e, t, r) {
  return t === !0 ? KS(e, r) : Ee(t) ? KS(e, t) : e;
}
function ha(e) {
  "@babel/helpers - typeof";
  return ha = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ha(e);
}
var P$ = ["ref"];
function GS(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function rn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? GS(Object(r), !0).forEach(function(n) {
      wc(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : GS(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function A$(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function VS(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, DE(n.key), n);
  }
}
function E$(e, t, r) {
  return t && VS(e.prototype, t), r && VS(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function T$(e, t, r) {
  return t = bs(t), C$(e, RE() ? Reflect.construct(t, r || [], bs(e).constructor) : t.apply(e, r));
}
function C$(e, t) {
  if (t && (ha(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return k$(e);
}
function k$(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function RE() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (RE = function() {
    return !!e;
  })();
}
function bs(e) {
  return bs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, bs(e);
}
function j$(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Qy(e, t);
}
function Qy(e, t) {
  return Qy = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Qy(e, t);
}
function wc(e, t, r) {
  return t = DE(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function DE(e) {
  var t = M$(e, "string");
  return ha(t) == "symbol" ? t : t + "";
}
function M$(e, t) {
  if (ha(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ha(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function I$(e, t) {
  if (e == null) return {};
  var r = $$(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function $$(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function N$(e) {
  return e.value;
}
function R$(e, t) {
  if (/* @__PURE__ */ $.isValidElement(e))
    return /* @__PURE__ */ $.cloneElement(e, t);
  if (typeof e == "function")
    return /* @__PURE__ */ $.createElement(e, t);
  t.ref;
  var r = I$(t, P$);
  return /* @__PURE__ */ $.createElement(mg, r);
}
var XS = 1, Dr = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    A$(this, t);
    for (var n = arguments.length, a = new Array(n), u = 0; u < n; u++)
      a[u] = arguments[u];
    return r = T$(this, t, [].concat(a)), wc(r, "lastBoundingBox", {
      width: -1,
      height: -1
    }), r;
  }
  return j$(t, e), E$(t, [{
    key: "componentDidMount",
    value: function() {
      this.updateBBox();
    }
  }, {
    key: "componentDidUpdate",
    value: function() {
      this.updateBBox();
    }
  }, {
    key: "getBBox",
    value: function() {
      if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
        var n = this.wrapperNode.getBoundingClientRect();
        return n.height = this.wrapperNode.offsetHeight, n.width = this.wrapperNode.offsetWidth, n;
      }
      return null;
    }
  }, {
    key: "updateBBox",
    value: function() {
      var n = this.props.onBBoxUpdate, a = this.getBBox();
      a ? (Math.abs(a.width - this.lastBoundingBox.width) > XS || Math.abs(a.height - this.lastBoundingBox.height) > XS) && (this.lastBoundingBox.width = a.width, this.lastBoundingBox.height = a.height, n && n(a)) : (this.lastBoundingBox.width !== -1 || this.lastBoundingBox.height !== -1) && (this.lastBoundingBox.width = -1, this.lastBoundingBox.height = -1, n && n(null));
    }
  }, {
    key: "getBBoxSnapshot",
    value: function() {
      return this.lastBoundingBox.width >= 0 && this.lastBoundingBox.height >= 0 ? rn({}, this.lastBoundingBox) : {
        width: 0,
        height: 0
      };
    }
  }, {
    key: "getDefaultPosition",
    value: function(n) {
      var a = this.props, u = a.layout, l = a.align, c = a.verticalAlign, f = a.margin, d = a.chartWidth, v = a.chartHeight, h, m;
      if (!n || (n.left === void 0 || n.left === null) && (n.right === void 0 || n.right === null))
        if (l === "center" && u === "vertical") {
          var x = this.getBBoxSnapshot();
          h = {
            left: ((d || 0) - x.width) / 2
          };
        } else
          h = l === "right" ? {
            right: f && f.right || 0
          } : {
            left: f && f.left || 0
          };
      if (!n || (n.top === void 0 || n.top === null) && (n.bottom === void 0 || n.bottom === null))
        if (c === "middle") {
          var S = this.getBBoxSnapshot();
          m = {
            top: ((v || 0) - S.height) / 2
          };
        } else
          m = c === "bottom" ? {
            bottom: f && f.bottom || 0
          } : {
            top: f && f.top || 0
          };
      return rn(rn({}, h), m);
    }
  }, {
    key: "render",
    value: function() {
      var n = this, a = this.props, u = a.content, l = a.width, c = a.height, f = a.wrapperStyle, d = a.payloadUniqBy, v = a.payload, h = rn(rn({
        position: "absolute",
        width: l || "auto",
        height: c || "auto"
      }, this.getDefaultPosition(f)), f);
      return /* @__PURE__ */ $.createElement("div", {
        className: "recharts-legend-wrapper",
        style: h,
        ref: function(x) {
          n.wrapperNode = x;
        }
      }, R$(u, rn(rn({}, this.props), {}, {
        payload: NE(v, d, N$)
      })));
    }
  }], [{
    key: "getWithHeight",
    value: function(n, a) {
      var u = rn(rn({}, this.defaultProps), n.props), l = u.layout;
      return l === "vertical" && le(n.props.height) ? {
        height: n.props.height
      } : l === "horizontal" ? {
        width: n.props.width || a
      } : null;
    }
  }]);
})(V.PureComponent);
wc(Dr, "displayName", "Legend");
wc(Dr, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "bottom"
});
var yv, YS;
function D$() {
  if (YS) return yv;
  YS = 1;
  var e = Ru(), t = bg(), r = Wt(), n = e ? e.isConcatSpreadable : void 0;
  function a(u) {
    return r(u) || t(u) || !!(n && u && u[n]);
  }
  return yv = a, yv;
}
var mv, QS;
function LE() {
  if (QS) return mv;
  QS = 1;
  var e = AE(), t = D$();
  function r(n, a, u, l, c) {
    var f = -1, d = n.length;
    for (u || (u = t), c || (c = []); ++f < d; ) {
      var v = n[f];
      a > 0 && u(v) ? a > 1 ? r(v, a - 1, u, l, c) : e(c, v) : l || (c[c.length] = v);
    }
    return c;
  }
  return mv = r, mv;
}
var gv, ZS;
function L$() {
  if (ZS) return gv;
  ZS = 1;
  function e(t) {
    return function(r, n, a) {
      for (var u = -1, l = Object(r), c = a(r), f = c.length; f--; ) {
        var d = c[t ? f : ++u];
        if (n(l[d], d, l) === !1)
          break;
      }
      return r;
    };
  }
  return gv = e, gv;
}
var bv, JS;
function q$() {
  if (JS) return bv;
  JS = 1;
  var e = L$(), t = e();
  return bv = t, bv;
}
var xv, e_;
function qE() {
  if (e_) return xv;
  e_ = 1;
  var e = q$(), t = xc();
  function r(n, a) {
    return n && e(n, a, t);
  }
  return xv = r, xv;
}
var wv, t_;
function B$() {
  if (t_) return wv;
  t_ = 1;
  var e = Du();
  function t(r, n) {
    return function(a, u) {
      if (a == null)
        return a;
      if (!e(a))
        return r(a, u);
      for (var l = a.length, c = n ? l : -1, f = Object(a); (n ? c-- : ++c < l) && u(f[c], c, f) !== !1; )
        ;
      return a;
    };
  }
  return wv = t, wv;
}
var Sv, r_;
function _g() {
  if (r_) return Sv;
  r_ = 1;
  var e = qE(), t = B$(), r = t(e);
  return Sv = r, Sv;
}
var _v, n_;
function BE() {
  if (n_) return _v;
  n_ = 1;
  var e = _g(), t = Du();
  function r(n, a) {
    var u = -1, l = t(n) ? Array(n.length) : [];
    return e(n, function(c, f, d) {
      l[++u] = a(c, f, d);
    }), l;
  }
  return _v = r, _v;
}
var Ov, i_;
function z$() {
  if (i_) return Ov;
  i_ = 1;
  function e(t, r) {
    var n = t.length;
    for (t.sort(r); n--; )
      t[n] = t[n].value;
    return t;
  }
  return Ov = e, Ov;
}
var Pv, a_;
function F$() {
  if (a_) return Pv;
  a_ = 1;
  var e = La();
  function t(r, n) {
    if (r !== n) {
      var a = r !== void 0, u = r === null, l = r === r, c = e(r), f = n !== void 0, d = n === null, v = n === n, h = e(n);
      if (!d && !h && !c && r > n || c && f && v && !d && !h || u && f && v || !a && v || !l)
        return 1;
      if (!u && !c && !h && r < n || h && a && l && !u && !c || d && a && l || !f && l || !v)
        return -1;
    }
    return 0;
  }
  return Pv = t, Pv;
}
var Av, o_;
function U$() {
  if (o_) return Av;
  o_ = 1;
  var e = F$();
  function t(r, n, a) {
    for (var u = -1, l = r.criteria, c = n.criteria, f = l.length, d = a.length; ++u < f; ) {
      var v = e(l[u], c[u]);
      if (v) {
        if (u >= d)
          return v;
        var h = a[u];
        return v * (h == "desc" ? -1 : 1);
      }
    }
    return r.index - n.index;
  }
  return Av = t, Av;
}
var Ev, u_;
function W$() {
  if (u_) return Ev;
  u_ = 1;
  var e = cg(), t = fg(), r = Wn(), n = BE(), a = z$(), u = TE(), l = U$(), c = za(), f = Wt();
  function d(v, h, m) {
    h.length ? h = e(h, function(w) {
      return f(w) ? function(b) {
        return t(b, w.length === 1 ? w[0] : w);
      } : w;
    }) : h = [c];
    var x = -1;
    h = e(h, u(r));
    var S = n(v, function(w, b, P) {
      var C = e(h, function(A) {
        return A(w);
      });
      return { criteria: C, index: ++x, value: w };
    });
    return a(S, function(w, b) {
      return l(w, b, m);
    });
  }
  return Ev = d, Ev;
}
var Tv, l_;
function H$() {
  if (l_) return Tv;
  l_ = 1;
  function e(t, r, n) {
    switch (n.length) {
      case 0:
        return t.call(r);
      case 1:
        return t.call(r, n[0]);
      case 2:
        return t.call(r, n[0], n[1]);
      case 3:
        return t.call(r, n[0], n[1], n[2]);
    }
    return t.apply(r, n);
  }
  return Tv = e, Tv;
}
var Cv, s_;
function K$() {
  if (s_) return Cv;
  s_ = 1;
  var e = H$(), t = Math.max;
  function r(n, a, u) {
    return a = t(a === void 0 ? n.length - 1 : a, 0), function() {
      for (var l = arguments, c = -1, f = t(l.length - a, 0), d = Array(f); ++c < f; )
        d[c] = l[a + c];
      c = -1;
      for (var v = Array(a + 1); ++c < a; )
        v[c] = l[c];
      return v[a] = u(d), e(n, this, v);
    };
  }
  return Cv = r, Cv;
}
var kv, c_;
function G$() {
  if (c_) return kv;
  c_ = 1;
  function e(t) {
    return function() {
      return t;
    };
  }
  return kv = e, kv;
}
var jv, f_;
function zE() {
  if (f_) return jv;
  f_ = 1;
  var e = Ai(), t = (function() {
    try {
      var r = e(Object, "defineProperty");
      return r({}, "", {}), r;
    } catch {
    }
  })();
  return jv = t, jv;
}
var Mv, d_;
function V$() {
  if (d_) return Mv;
  d_ = 1;
  var e = G$(), t = zE(), r = za(), n = t ? function(a, u) {
    return t(a, "toString", {
      configurable: !0,
      enumerable: !1,
      value: e(u),
      writable: !0
    });
  } : r;
  return Mv = n, Mv;
}
var Iv, p_;
function X$() {
  if (p_) return Iv;
  p_ = 1;
  var e = 800, t = 16, r = Date.now;
  function n(a) {
    var u = 0, l = 0;
    return function() {
      var c = r(), f = t - (c - l);
      if (l = c, f > 0) {
        if (++u >= e)
          return arguments[0];
      } else
        u = 0;
      return a.apply(void 0, arguments);
    };
  }
  return Iv = n, Iv;
}
var $v, h_;
function Y$() {
  if (h_) return $v;
  h_ = 1;
  var e = V$(), t = X$(), r = t(e);
  return $v = r, $v;
}
var Nv, v_;
function Q$() {
  if (v_) return Nv;
  v_ = 1;
  var e = za(), t = K$(), r = Y$();
  function n(a, u) {
    return r(t(a, u, e), a + "");
  }
  return Nv = n, Nv;
}
var Rv, y_;
function Sc() {
  if (y_) return Rv;
  y_ = 1;
  var e = ug(), t = Du(), r = xg(), n = Un();
  function a(u, l, c) {
    if (!n(c))
      return !1;
    var f = typeof l;
    return (f == "number" ? t(c) && r(l, c.length) : f == "string" && l in c) ? e(c[l], u) : !1;
  }
  return Rv = a, Rv;
}
var Dv, m_;
function Z$() {
  if (m_) return Dv;
  m_ = 1;
  var e = LE(), t = W$(), r = Q$(), n = Sc(), a = r(function(u, l) {
    if (u == null)
      return [];
    var c = l.length;
    return c > 1 && n(u, l[0], l[1]) ? l = [] : c > 2 && n(l[0], l[1], l[2]) && (l = [l[0]]), t(u, e(l, 1), []);
  });
  return Dv = a, Dv;
}
var J$ = Z$();
const Og = /* @__PURE__ */ Fe(J$);
function nu(e) {
  "@babel/helpers - typeof";
  return nu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, nu(e);
}
function Zy() {
  return Zy = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Zy.apply(this, arguments);
}
function eN(e, t) {
  return iN(e) || nN(e, t) || rN(e, t) || tN();
}
function tN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function rN(e, t) {
  if (e) {
    if (typeof e == "string") return g_(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return g_(e, t);
  }
}
function g_(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function nN(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function iN(e) {
  if (Array.isArray(e)) return e;
}
function b_(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Lv(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? b_(Object(r), !0).forEach(function(n) {
      aN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : b_(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function aN(e, t, r) {
  return t = oN(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function oN(e) {
  var t = uN(e, "string");
  return nu(t) == "symbol" ? t : t + "";
}
function uN(e, t) {
  if (nu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (nu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function lN(e) {
  return Array.isArray(e) && dt(e[0]) && dt(e[1]) ? e.join(" ~ ") : e;
}
var sN = function(t) {
  var r = t.separator, n = r === void 0 ? " : " : r, a = t.contentStyle, u = a === void 0 ? {} : a, l = t.itemStyle, c = l === void 0 ? {} : l, f = t.labelStyle, d = f === void 0 ? {} : f, v = t.payload, h = t.formatter, m = t.itemSorter, x = t.wrapperClassName, S = t.labelClassName, w = t.label, b = t.labelFormatter, P = t.accessibilityLayer, C = P === void 0 ? !1 : P, A = function() {
    if (v && v.length) {
      var q = {
        padding: 0,
        margin: 0
      }, F = (m ? Og(v, m) : v).map(function(X, G) {
        if (X.type === "none")
          return null;
        var Y = Lv({
          display: "block",
          paddingTop: 4,
          paddingBottom: 4,
          color: X.color || "#000"
        }, c), ee = X.formatter || h || lN, H = X.value, Q = X.name, J = H, I = Q;
        if (ee && J != null && I != null) {
          var B = ee(H, Q, X, G, v);
          if (Array.isArray(B)) {
            var ue = eN(B, 2);
            J = ue[0], I = ue[1];
          } else
            J = B;
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          /* @__PURE__ */ $.createElement("li", {
            className: "recharts-tooltip-item",
            key: "tooltip-item-".concat(G),
            style: Y
          }, dt(I) ? /* @__PURE__ */ $.createElement("span", {
            className: "recharts-tooltip-item-name"
          }, I) : null, dt(I) ? /* @__PURE__ */ $.createElement("span", {
            className: "recharts-tooltip-item-separator"
          }, n) : null, /* @__PURE__ */ $.createElement("span", {
            className: "recharts-tooltip-item-value"
          }, J), /* @__PURE__ */ $.createElement("span", {
            className: "recharts-tooltip-item-unit"
          }, X.unit || ""))
        );
      });
      return /* @__PURE__ */ $.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: q
      }, F);
    }
    return null;
  }, T = Lv({
    margin: 0,
    padding: 10,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    whiteSpace: "nowrap"
  }, u), _ = Lv({
    margin: 0
  }, d), O = !_e(w), k = O ? w : "", M = ke("recharts-default-tooltip", x), N = ke("recharts-tooltip-label", S);
  O && b && v !== void 0 && v !== null && (k = b(w, v));
  var W = C ? {
    role: "status",
    "aria-live": "assertive"
  } : {};
  return /* @__PURE__ */ $.createElement("div", Zy({
    className: M,
    style: T
  }, W), /* @__PURE__ */ $.createElement("p", {
    className: N,
    style: _
  }, /* @__PURE__ */ $.isValidElement(k) ? k : "".concat(k)), A());
};
function iu(e) {
  "@babel/helpers - typeof";
  return iu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, iu(e);
}
function Jl(e, t, r) {
  return t = cN(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function cN(e) {
  var t = fN(e, "string");
  return iu(t) == "symbol" ? t : t + "";
}
function fN(e, t) {
  if (iu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (iu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var $o = "recharts-tooltip-wrapper", dN = {
  visibility: "hidden"
};
function pN(e) {
  var t = e.coordinate, r = e.translateX, n = e.translateY;
  return ke($o, Jl(Jl(Jl(Jl({}, "".concat($o, "-right"), le(r) && t && le(t.x) && r >= t.x), "".concat($o, "-left"), le(r) && t && le(t.x) && r < t.x), "".concat($o, "-bottom"), le(n) && t && le(t.y) && n >= t.y), "".concat($o, "-top"), le(n) && t && le(t.y) && n < t.y));
}
function x_(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.key, a = e.offsetTopLeft, u = e.position, l = e.reverseDirection, c = e.tooltipDimension, f = e.viewBox, d = e.viewBoxDimension;
  if (u && le(u[n]))
    return u[n];
  var v = r[n] - c - a, h = r[n] + a;
  if (t[n])
    return l[n] ? v : h;
  if (l[n]) {
    var m = v, x = f[n];
    return m < x ? Math.max(h, f[n]) : Math.max(v, f[n]);
  }
  var S = h + c, w = f[n] + d;
  return S > w ? Math.max(v, f[n]) : Math.max(h, f[n]);
}
function hN(e) {
  var t = e.translateX, r = e.translateY, n = e.useTranslate3d;
  return {
    transform: n ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)") : "translate(".concat(t, "px, ").concat(r, "px)")
  };
}
function vN(e) {
  var t = e.allowEscapeViewBox, r = e.coordinate, n = e.offsetTopLeft, a = e.position, u = e.reverseDirection, l = e.tooltipBox, c = e.useTranslate3d, f = e.viewBox, d, v, h;
  return l.height > 0 && l.width > 0 && r ? (v = x_({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "x",
    offsetTopLeft: n,
    position: a,
    reverseDirection: u,
    tooltipDimension: l.width,
    viewBox: f,
    viewBoxDimension: f.width
  }), h = x_({
    allowEscapeViewBox: t,
    coordinate: r,
    key: "y",
    offsetTopLeft: n,
    position: a,
    reverseDirection: u,
    tooltipDimension: l.height,
    viewBox: f,
    viewBoxDimension: f.height
  }), d = hN({
    translateX: v,
    translateY: h,
    useTranslate3d: c
  })) : d = dN, {
    cssProperties: d,
    cssClasses: pN({
      translateX: v,
      translateY: h,
      coordinate: r
    })
  };
}
function va(e) {
  "@babel/helpers - typeof";
  return va = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, va(e);
}
function w_(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function S_(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? w_(Object(r), !0).forEach(function(n) {
      em(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : w_(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function yN(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function mN(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, UE(n.key), n);
  }
}
function gN(e, t, r) {
  return t && mN(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function bN(e, t, r) {
  return t = xs(t), xN(e, FE() ? Reflect.construct(t, r || [], xs(e).constructor) : t.apply(e, r));
}
function xN(e, t) {
  if (t && (va(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return wN(e);
}
function wN(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function FE() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (FE = function() {
    return !!e;
  })();
}
function xs(e) {
  return xs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, xs(e);
}
function SN(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Jy(e, t);
}
function Jy(e, t) {
  return Jy = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Jy(e, t);
}
function em(e, t, r) {
  return t = UE(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function UE(e) {
  var t = _N(e, "string");
  return va(t) == "symbol" ? t : t + "";
}
function _N(e, t) {
  if (va(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (va(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var __ = 1, ON = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    yN(this, t);
    for (var n = arguments.length, a = new Array(n), u = 0; u < n; u++)
      a[u] = arguments[u];
    return r = bN(this, t, [].concat(a)), em(r, "state", {
      dismissed: !1,
      dismissedAtCoordinate: {
        x: 0,
        y: 0
      },
      lastBoundingBox: {
        width: -1,
        height: -1
      }
    }), em(r, "handleKeyDown", function(l) {
      if (l.key === "Escape") {
        var c, f, d, v;
        r.setState({
          dismissed: !0,
          dismissedAtCoordinate: {
            x: (c = (f = r.props.coordinate) === null || f === void 0 ? void 0 : f.x) !== null && c !== void 0 ? c : 0,
            y: (d = (v = r.props.coordinate) === null || v === void 0 ? void 0 : v.y) !== null && d !== void 0 ? d : 0
          }
        });
      }
    }), r;
  }
  return SN(t, e), gN(t, [{
    key: "updateBBox",
    value: function() {
      if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
        var n = this.wrapperNode.getBoundingClientRect();
        (Math.abs(n.width - this.state.lastBoundingBox.width) > __ || Math.abs(n.height - this.state.lastBoundingBox.height) > __) && this.setState({
          lastBoundingBox: {
            width: n.width,
            height: n.height
          }
        });
      } else (this.state.lastBoundingBox.width !== -1 || this.state.lastBoundingBox.height !== -1) && this.setState({
        lastBoundingBox: {
          width: -1,
          height: -1
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function() {
      document.addEventListener("keydown", this.handleKeyDown), this.updateBBox();
    }
  }, {
    key: "componentWillUnmount",
    value: function() {
      document.removeEventListener("keydown", this.handleKeyDown);
    }
  }, {
    key: "componentDidUpdate",
    value: function() {
      var n, a;
      this.props.active && this.updateBBox(), this.state.dismissed && (((n = this.props.coordinate) === null || n === void 0 ? void 0 : n.x) !== this.state.dismissedAtCoordinate.x || ((a = this.props.coordinate) === null || a === void 0 ? void 0 : a.y) !== this.state.dismissedAtCoordinate.y) && (this.state.dismissed = !1);
    }
  }, {
    key: "render",
    value: function() {
      var n = this, a = this.props, u = a.active, l = a.allowEscapeViewBox, c = a.animationDuration, f = a.animationEasing, d = a.children, v = a.coordinate, h = a.hasPayload, m = a.isAnimationActive, x = a.offset, S = a.position, w = a.reverseDirection, b = a.useTranslate3d, P = a.viewBox, C = a.wrapperStyle, A = vN({
        allowEscapeViewBox: l,
        coordinate: v,
        offsetTopLeft: x,
        position: S,
        reverseDirection: w,
        tooltipBox: this.state.lastBoundingBox,
        useTranslate3d: b,
        viewBox: P
      }), T = A.cssClasses, _ = A.cssProperties, O = S_(S_({
        transition: m && u ? "transform ".concat(c, "ms ").concat(f) : void 0
      }, _), {}, {
        pointerEvents: "none",
        visibility: !this.state.dismissed && u && h ? "visible" : "hidden",
        position: "absolute",
        top: 0,
        left: 0
      }, C);
      return (
        // This element allow listening to the `Escape` key.
        // See https://github.com/recharts/recharts/pull/2925
        /* @__PURE__ */ $.createElement("div", {
          tabIndex: -1,
          className: T,
          style: O,
          ref: function(M) {
            n.wrapperNode = M;
          }
        }, d)
      );
    }
  }]);
})(V.PureComponent), PN = function() {
  return !(typeof window < "u" && window.document && window.document.createElement && window.setTimeout);
}, Hn = {
  isSsr: PN()
};
function ya(e) {
  "@babel/helpers - typeof";
  return ya = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ya(e);
}
function O_(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function P_(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? O_(Object(r), !0).forEach(function(n) {
      Pg(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : O_(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function AN(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function EN(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, HE(n.key), n);
  }
}
function TN(e, t, r) {
  return t && EN(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function CN(e, t, r) {
  return t = ws(t), kN(e, WE() ? Reflect.construct(t, r || [], ws(e).constructor) : t.apply(e, r));
}
function kN(e, t) {
  if (t && (ya(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return jN(e);
}
function jN(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function WE() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (WE = function() {
    return !!e;
  })();
}
function ws(e) {
  return ws = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, ws(e);
}
function MN(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && tm(e, t);
}
function tm(e, t) {
  return tm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, tm(e, t);
}
function Pg(e, t, r) {
  return t = HE(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function HE(e) {
  var t = IN(e, "string");
  return ya(t) == "symbol" ? t : t + "";
}
function IN(e, t) {
  if (ya(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ya(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function $N(e) {
  return e.dataKey;
}
function NN(e, t) {
  return /* @__PURE__ */ $.isValidElement(e) ? /* @__PURE__ */ $.cloneElement(e, t) : typeof e == "function" ? /* @__PURE__ */ $.createElement(e, t) : /* @__PURE__ */ $.createElement(sN, t);
}
var Zt = /* @__PURE__ */ (function(e) {
  function t() {
    return AN(this, t), CN(this, t, arguments);
  }
  return MN(t, e), TN(t, [{
    key: "render",
    value: function() {
      var n = this, a = this.props, u = a.active, l = a.allowEscapeViewBox, c = a.animationDuration, f = a.animationEasing, d = a.content, v = a.coordinate, h = a.filterNull, m = a.isAnimationActive, x = a.offset, S = a.payload, w = a.payloadUniqBy, b = a.position, P = a.reverseDirection, C = a.useTranslate3d, A = a.viewBox, T = a.wrapperStyle, _ = S ?? [];
      h && _.length && (_ = NE(S.filter(function(k) {
        return k.value != null && (k.hide !== !0 || n.props.includeHidden);
      }), w, $N));
      var O = _.length > 0;
      return /* @__PURE__ */ $.createElement(ON, {
        allowEscapeViewBox: l,
        animationDuration: c,
        animationEasing: f,
        isAnimationActive: m,
        active: u,
        coordinate: v,
        hasPayload: O,
        offset: x,
        position: b,
        reverseDirection: P,
        useTranslate3d: C,
        viewBox: A,
        wrapperStyle: T
      }, NN(d, P_(P_({}, this.props), {}, {
        payload: _
      })));
    }
  }]);
})(V.PureComponent);
Pg(Zt, "displayName", "Tooltip");
Pg(Zt, "defaultProps", {
  accessibilityLayer: !1,
  allowEscapeViewBox: {
    x: !1,
    y: !1
  },
  animationDuration: 400,
  animationEasing: "ease",
  contentStyle: {},
  coordinate: {
    x: 0,
    y: 0
  },
  cursor: !0,
  cursorStyle: {},
  filterNull: !0,
  isAnimationActive: !Hn.isSsr,
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: !1,
    y: !1
  },
  separator: " : ",
  trigger: "hover",
  useTranslate3d: !1,
  viewBox: {
    x: 0,
    y: 0,
    height: 0,
    width: 0
  },
  wrapperStyle: {}
});
var qv, A_;
function RN() {
  if (A_) return qv;
  A_ = 1;
  var e = Gr(), t = function() {
    return e.Date.now();
  };
  return qv = t, qv;
}
var Bv, E_;
function DN() {
  if (E_) return Bv;
  E_ = 1;
  var e = /\s/;
  function t(r) {
    for (var n = r.length; n-- && e.test(r.charAt(n)); )
      ;
    return n;
  }
  return Bv = t, Bv;
}
var zv, T_;
function LN() {
  if (T_) return zv;
  T_ = 1;
  var e = DN(), t = /^\s+/;
  function r(n) {
    return n && n.slice(0, e(n) + 1).replace(t, "");
  }
  return zv = r, zv;
}
var Fv, C_;
function KE() {
  if (C_) return Fv;
  C_ = 1;
  var e = LN(), t = Un(), r = La(), n = NaN, a = /^[-+]0x[0-9a-f]+$/i, u = /^0b[01]+$/i, l = /^0o[0-7]+$/i, c = parseInt;
  function f(d) {
    if (typeof d == "number")
      return d;
    if (r(d))
      return n;
    if (t(d)) {
      var v = typeof d.valueOf == "function" ? d.valueOf() : d;
      d = t(v) ? v + "" : v;
    }
    if (typeof d != "string")
      return d === 0 ? d : +d;
    d = e(d);
    var h = u.test(d);
    return h || l.test(d) ? c(d.slice(2), h ? 2 : 8) : a.test(d) ? n : +d;
  }
  return Fv = f, Fv;
}
var Uv, k_;
function qN() {
  if (k_) return Uv;
  k_ = 1;
  var e = Un(), t = RN(), r = KE(), n = "Expected a function", a = Math.max, u = Math.min;
  function l(c, f, d) {
    var v, h, m, x, S, w, b = 0, P = !1, C = !1, A = !0;
    if (typeof c != "function")
      throw new TypeError(n);
    f = r(f) || 0, e(d) && (P = !!d.leading, C = "maxWait" in d, m = C ? a(r(d.maxWait) || 0, f) : m, A = "trailing" in d ? !!d.trailing : A);
    function T(F) {
      var X = v, G = h;
      return v = h = void 0, b = F, x = c.apply(G, X), x;
    }
    function _(F) {
      return b = F, S = setTimeout(M, f), P ? T(F) : x;
    }
    function O(F) {
      var X = F - w, G = F - b, Y = f - X;
      return C ? u(Y, m - G) : Y;
    }
    function k(F) {
      var X = F - w, G = F - b;
      return w === void 0 || X >= f || X < 0 || C && G >= m;
    }
    function M() {
      var F = t();
      if (k(F))
        return N(F);
      S = setTimeout(M, O(F));
    }
    function N(F) {
      return S = void 0, A && v ? T(F) : (v = h = void 0, x);
    }
    function W() {
      S !== void 0 && clearTimeout(S), b = 0, v = w = h = S = void 0;
    }
    function R() {
      return S === void 0 ? x : N(t());
    }
    function q() {
      var F = t(), X = k(F);
      if (v = arguments, h = this, w = F, X) {
        if (S === void 0)
          return _(w);
        if (C)
          return clearTimeout(S), S = setTimeout(M, f), T(w);
      }
      return S === void 0 && (S = setTimeout(M, f)), x;
    }
    return q.cancel = W, q.flush = R, q;
  }
  return Uv = l, Uv;
}
var Wv, j_;
function BN() {
  if (j_) return Wv;
  j_ = 1;
  var e = qN(), t = Un(), r = "Expected a function";
  function n(a, u, l) {
    var c = !0, f = !0;
    if (typeof a != "function")
      throw new TypeError(r);
    return t(l) && (c = "leading" in l ? !!l.leading : c, f = "trailing" in l ? !!l.trailing : f), e(a, u, {
      leading: c,
      maxWait: u,
      trailing: f
    });
  }
  return Wv = n, Wv;
}
var zN = BN();
const GE = /* @__PURE__ */ Fe(zN);
function au(e) {
  "@babel/helpers - typeof";
  return au = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, au(e);
}
function M_(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function es(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? M_(Object(r), !0).forEach(function(n) {
      FN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : M_(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function FN(e, t, r) {
  return t = UN(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function UN(e) {
  var t = WN(e, "string");
  return au(t) == "symbol" ? t : t + "";
}
function WN(e, t) {
  if (au(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (au(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function HN(e, t) {
  return XN(e) || VN(e, t) || GN(e, t) || KN();
}
function KN() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function GN(e, t) {
  if (e) {
    if (typeof e == "string") return I_(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return I_(e, t);
  }
}
function I_(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function VN(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function XN(e) {
  if (Array.isArray(e)) return e;
}
var YN = /* @__PURE__ */ V.forwardRef(function(e, t) {
  var r = e.aspect, n = e.initialDimension, a = n === void 0 ? {
    width: -1,
    height: -1
  } : n, u = e.width, l = u === void 0 ? "100%" : u, c = e.height, f = c === void 0 ? "100%" : c, d = e.minWidth, v = d === void 0 ? 0 : d, h = e.minHeight, m = e.maxHeight, x = e.children, S = e.debounce, w = S === void 0 ? 0 : S, b = e.id, P = e.className, C = e.onResize, A = e.style, T = A === void 0 ? {} : A, _ = V.useRef(null), O = V.useRef();
  O.current = C, V.useImperativeHandle(t, function() {
    return Object.defineProperty(_.current, "current", {
      get: function() {
        return console.warn("The usage of ref.current.current is deprecated and will no longer be supported."), _.current;
      },
      configurable: !0
    });
  });
  var k = V.useState({
    containerWidth: a.width,
    containerHeight: a.height
  }), M = HN(k, 2), N = M[0], W = M[1], R = V.useCallback(function(F, X) {
    W(function(G) {
      var Y = Math.round(F), ee = Math.round(X);
      return G.containerWidth === Y && G.containerHeight === ee ? G : {
        containerWidth: Y,
        containerHeight: ee
      };
    });
  }, []);
  V.useEffect(function() {
    var F = function(Q) {
      var J, I = Q[0].contentRect, B = I.width, ue = I.height;
      R(B, ue), (J = O.current) === null || J === void 0 || J.call(O, B, ue);
    };
    w > 0 && (F = GE(F, w, {
      trailing: !0,
      leading: !1
    }));
    var X = new ResizeObserver(F), G = _.current.getBoundingClientRect(), Y = G.width, ee = G.height;
    return R(Y, ee), X.observe(_.current), function() {
      X.disconnect();
    };
  }, [R, w]);
  var q = V.useMemo(function() {
    var F = N.containerWidth, X = N.containerHeight;
    if (F < 0 || X < 0)
      return null;
    ln(fi(l) || fi(f), `The width(%s) and height(%s) are both fixed numbers,
       maybe you don't need to use a ResponsiveContainer.`, l, f), ln(!r || r > 0, "The aspect(%s) must be greater than zero.", r);
    var G = fi(l) ? F : l, Y = fi(f) ? X : f;
    r && r > 0 && (G ? Y = G / r : Y && (G = Y * r), m && Y > m && (Y = m)), ln(G > 0 || Y > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, G, Y, l, f, v, h, r);
    var ee = !Array.isArray(x) && un(x.type).endsWith("Chart");
    return $.Children.map(x, function(H) {
      return /* @__PURE__ */ $.isValidElement(H) ? /* @__PURE__ */ V.cloneElement(H, es({
        width: G,
        height: Y
      }, ee ? {
        style: es({
          height: "100%",
          width: "100%",
          maxHeight: Y,
          maxWidth: G
        }, H.props.style)
      } : {})) : H;
    });
  }, [r, x, f, m, h, v, N, l]);
  return /* @__PURE__ */ $.createElement("div", {
    id: b ? "".concat(b) : void 0,
    className: ke("recharts-responsive-container", P),
    style: es(es({}, T), {}, {
      width: l,
      height: f,
      minWidth: v,
      minHeight: h,
      maxHeight: m
    }),
    ref: _
  }, q);
}), Ag = function(t) {
  return null;
};
Ag.displayName = "Cell";
function ou(e) {
  "@babel/helpers - typeof";
  return ou = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ou(e);
}
function $_(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function rm(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $_(Object(r), !0).forEach(function(n) {
      QN(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : $_(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function QN(e, t, r) {
  return t = ZN(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ZN(e) {
  var t = JN(e, "string");
  return ou(t) == "symbol" ? t : t + "";
}
function JN(e, t) {
  if (ou(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ou(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ra = {
  widthCache: {},
  cacheCount: 0
}, eR = 2e3, tR = {
  position: "absolute",
  top: "-20000px",
  left: 0,
  padding: 0,
  margin: 0,
  border: "none",
  whiteSpace: "pre"
}, N_ = "recharts_measurement_span";
function rR(e) {
  var t = rm({}, e);
  return Object.keys(t).forEach(function(r) {
    t[r] || delete t[r];
  }), t;
}
var Go = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (t == null || Hn.isSsr)
    return {
      width: 0,
      height: 0
    };
  var n = rR(r), a = JSON.stringify({
    text: t,
    copyStyle: n
  });
  if (ra.widthCache[a])
    return ra.widthCache[a];
  try {
    var u = document.getElementById(N_);
    u || (u = document.createElement("span"), u.setAttribute("id", N_), u.setAttribute("aria-hidden", "true"), document.body.appendChild(u));
    var l = rm(rm({}, tR), n);
    Object.assign(u.style, l), u.textContent = "".concat(t);
    var c = u.getBoundingClientRect(), f = {
      width: c.width,
      height: c.height
    };
    return ra.widthCache[a] = f, ++ra.cacheCount > eR && (ra.cacheCount = 0, ra.widthCache = {}), f;
  } catch {
    return {
      width: 0,
      height: 0
    };
  }
}, nR = function(t) {
  return {
    top: t.top + window.scrollY - document.documentElement.clientTop,
    left: t.left + window.scrollX - document.documentElement.clientLeft
  };
};
function uu(e) {
  "@babel/helpers - typeof";
  return uu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, uu(e);
}
function Ss(e, t) {
  return uR(e) || oR(e, t) || aR(e, t) || iR();
}
function iR() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function aR(e, t) {
  if (e) {
    if (typeof e == "string") return R_(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return R_(e, t);
  }
}
function R_(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function oR(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        f = !1;
      } else for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function uR(e) {
  if (Array.isArray(e)) return e;
}
function lR(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function D_(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, cR(n.key), n);
  }
}
function sR(e, t, r) {
  return t && D_(e.prototype, t), r && D_(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function cR(e) {
  var t = fR(e, "string");
  return uu(t) == "symbol" ? t : t + "";
}
function fR(e, t) {
  if (uu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (uu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var L_ = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, q_ = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/, dR = /^px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q$/, pR = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/, VE = {
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 96 / 6,
  in: 96,
  Q: 96 / (2.54 * 40),
  px: 1
}, hR = Object.keys(VE), oa = "NaN";
function vR(e, t) {
  return e * VE[t];
}
var ts = /* @__PURE__ */ (function() {
  function e(t, r) {
    lR(this, e), this.num = t, this.unit = r, this.num = t, this.unit = r, Number.isNaN(t) && (this.unit = ""), r !== "" && !dR.test(r) && (this.num = NaN, this.unit = ""), hR.includes(r) && (this.num = vR(t, r), this.unit = "px");
  }
  return sR(e, [{
    key: "add",
    value: function(r) {
      return this.unit !== r.unit ? new e(NaN, "") : new e(this.num + r.num, this.unit);
    }
  }, {
    key: "subtract",
    value: function(r) {
      return this.unit !== r.unit ? new e(NaN, "") : new e(this.num - r.num, this.unit);
    }
  }, {
    key: "multiply",
    value: function(r) {
      return this.unit !== "" && r.unit !== "" && this.unit !== r.unit ? new e(NaN, "") : new e(this.num * r.num, this.unit || r.unit);
    }
  }, {
    key: "divide",
    value: function(r) {
      return this.unit !== "" && r.unit !== "" && this.unit !== r.unit ? new e(NaN, "") : new e(this.num / r.num, this.unit || r.unit);
    }
  }, {
    key: "toString",
    value: function() {
      return "".concat(this.num).concat(this.unit);
    }
  }, {
    key: "isNaN",
    value: function() {
      return Number.isNaN(this.num);
    }
  }], [{
    key: "parse",
    value: function(r) {
      var n, a = (n = pR.exec(r)) !== null && n !== void 0 ? n : [], u = Ss(a, 3), l = u[1], c = u[2];
      return new e(parseFloat(l), c ?? "");
    }
  }]);
})();
function XE(e) {
  if (e.includes(oa))
    return oa;
  for (var t = e; t.includes("*") || t.includes("/"); ) {
    var r, n = (r = L_.exec(t)) !== null && r !== void 0 ? r : [], a = Ss(n, 4), u = a[1], l = a[2], c = a[3], f = ts.parse(u ?? ""), d = ts.parse(c ?? ""), v = l === "*" ? f.multiply(d) : f.divide(d);
    if (v.isNaN())
      return oa;
    t = t.replace(L_, v.toString());
  }
  for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t); ) {
    var h, m = (h = q_.exec(t)) !== null && h !== void 0 ? h : [], x = Ss(m, 4), S = x[1], w = x[2], b = x[3], P = ts.parse(S ?? ""), C = ts.parse(b ?? ""), A = w === "+" ? P.add(C) : P.subtract(C);
    if (A.isNaN())
      return oa;
    t = t.replace(q_, A.toString());
  }
  return t;
}
var B_ = /\(([^()]*)\)/;
function yR(e) {
  for (var t = e; t.includes("("); ) {
    var r = B_.exec(t), n = Ss(r, 2), a = n[1];
    t = t.replace(B_, XE(a));
  }
  return t;
}
function mR(e) {
  var t = e.replace(/\s+/g, "");
  return t = yR(t), t = XE(t), t;
}
function gR(e) {
  try {
    return mR(e);
  } catch {
    return oa;
  }
}
function Hv(e) {
  var t = gR(e.slice(5, -1));
  return t === oa ? "" : t;
}
var bR = ["x", "y", "lineHeight", "capHeight", "scaleToFit", "textAnchor", "verticalAnchor", "fill"], xR = ["dx", "dy", "angle", "className", "breakAll"];
function nm() {
  return nm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, nm.apply(this, arguments);
}
function z_(e, t) {
  if (e == null) return {};
  var r = wR(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function wR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function F_(e, t) {
  return PR(e) || OR(e, t) || _R(e, t) || SR();
}
function SR() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function _R(e, t) {
  if (e) {
    if (typeof e == "string") return U_(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return U_(e, t);
  }
}
function U_(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function OR(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t === 0) {
        if (Object(r) !== r) return;
        f = !1;
      } else for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function PR(e) {
  if (Array.isArray(e)) return e;
}
var YE = /[ \f\n\r\t\v\u2028\u2029]+/, QE = function(t) {
  var r = t.children, n = t.breakAll, a = t.style;
  try {
    var u = [];
    _e(r) || (n ? u = r.toString().split("") : u = r.toString().split(YE));
    var l = u.map(function(f) {
      return {
        word: f,
        width: Go(f, a).width
      };
    }), c = n ? 0 : Go(" ", a).width;
    return {
      wordsWithComputedWidth: l,
      spaceWidth: c
    };
  } catch {
    return null;
  }
}, AR = function(t, r, n, a, u) {
  var l = t.maxLines, c = t.children, f = t.style, d = t.breakAll, v = le(l), h = c, m = function() {
    var G = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return G.reduce(function(Y, ee) {
      var H = ee.word, Q = ee.width, J = Y[Y.length - 1];
      if (J && (a == null || u || J.width + Q + n < Number(a)))
        J.words.push(H), J.width += Q + n;
      else {
        var I = {
          words: [H],
          width: Q
        };
        Y.push(I);
      }
      return Y;
    }, []);
  }, x = m(r), S = function(G) {
    return G.reduce(function(Y, ee) {
      return Y.width > ee.width ? Y : ee;
    });
  };
  if (!v)
    return x;
  for (var w = "…", b = function(G) {
    var Y = h.slice(0, G), ee = QE({
      breakAll: d,
      style: f,
      children: Y + w
    }).wordsWithComputedWidth, H = m(ee), Q = H.length > l || S(H).width > Number(a);
    return [Q, H];
  }, P = 0, C = h.length - 1, A = 0, T; P <= C && A <= h.length - 1; ) {
    var _ = Math.floor((P + C) / 2), O = _ - 1, k = b(O), M = F_(k, 2), N = M[0], W = M[1], R = b(_), q = F_(R, 1), F = q[0];
    if (!N && !F && (P = _ + 1), N && F && (C = _ - 1), !N && F) {
      T = W;
      break;
    }
    A++;
  }
  return T || x;
}, W_ = function(t) {
  var r = _e(t) ? [] : t.toString().split(YE);
  return [{
    words: r
  }];
}, ER = function(t) {
  var r = t.width, n = t.scaleToFit, a = t.children, u = t.style, l = t.breakAll, c = t.maxLines;
  if ((r || n) && !Hn.isSsr) {
    var f, d, v = QE({
      breakAll: l,
      children: a,
      style: u
    });
    if (v) {
      var h = v.wordsWithComputedWidth, m = v.spaceWidth;
      f = h, d = m;
    } else
      return W_(a);
    return AR({
      breakAll: l,
      children: a,
      maxLines: c,
      style: u
    }, f, d, r, n);
  }
  return W_(a);
}, H_ = "#808080", _s = function(t) {
  var r = t.x, n = r === void 0 ? 0 : r, a = t.y, u = a === void 0 ? 0 : a, l = t.lineHeight, c = l === void 0 ? "1em" : l, f = t.capHeight, d = f === void 0 ? "0.71em" : f, v = t.scaleToFit, h = v === void 0 ? !1 : v, m = t.textAnchor, x = m === void 0 ? "start" : m, S = t.verticalAnchor, w = S === void 0 ? "end" : S, b = t.fill, P = b === void 0 ? H_ : b, C = z_(t, bR), A = V.useMemo(function() {
    return ER({
      breakAll: C.breakAll,
      children: C.children,
      maxLines: C.maxLines,
      scaleToFit: h,
      style: C.style,
      width: C.width
    });
  }, [C.breakAll, C.children, C.maxLines, h, C.style, C.width]), T = C.dx, _ = C.dy, O = C.angle, k = C.className, M = C.breakAll, N = z_(C, xR);
  if (!dt(n) || !dt(u))
    return null;
  var W = n + (le(T) ? T : 0), R = u + (le(_) ? _ : 0), q;
  switch (w) {
    case "start":
      q = Hv("calc(".concat(d, ")"));
      break;
    case "middle":
      q = Hv("calc(".concat((A.length - 1) / 2, " * -").concat(c, " + (").concat(d, " / 2))"));
      break;
    default:
      q = Hv("calc(".concat(A.length - 1, " * -").concat(c, ")"));
      break;
  }
  var F = [];
  if (h) {
    var X = A[0].width, G = C.width;
    F.push("scale(".concat((le(G) ? G / X : 1) / X, ")"));
  }
  return O && F.push("rotate(".concat(O, ", ").concat(W, ", ").concat(R, ")")), F.length && (N.transform = F.join(" ")), /* @__PURE__ */ $.createElement("text", nm({}, Ae(N, !0), {
    x: W,
    y: R,
    className: ke("recharts-text", k),
    textAnchor: x,
    fill: P.includes("url") ? H_ : P
  }), A.map(function(Y, ee) {
    var H = Y.words.join(M ? "" : " ");
    return (
      // duplicate words will cause duplicate keys
      // eslint-disable-next-line react/no-array-index-key
      /* @__PURE__ */ $.createElement("tspan", {
        x: W,
        dy: ee === 0 ? q : c,
        key: "".concat(H, "-").concat(ee)
      }, H)
    );
  }));
};
function Fn(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function TR(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function Eg(e) {
  let t, r, n;
  e.length !== 2 ? (t = Fn, r = (c, f) => Fn(e(c), f), n = (c, f) => e(c) - f) : (t = e === Fn || e === TR ? e : CR, r = e, n = e);
  function a(c, f, d = 0, v = c.length) {
    if (d < v) {
      if (t(f, f) !== 0) return v;
      do {
        const h = d + v >>> 1;
        r(c[h], f) < 0 ? d = h + 1 : v = h;
      } while (d < v);
    }
    return d;
  }
  function u(c, f, d = 0, v = c.length) {
    if (d < v) {
      if (t(f, f) !== 0) return v;
      do {
        const h = d + v >>> 1;
        r(c[h], f) <= 0 ? d = h + 1 : v = h;
      } while (d < v);
    }
    return d;
  }
  function l(c, f, d = 0, v = c.length) {
    const h = a(c, f, d, v - 1);
    return h > d && n(c[h - 1], f) > -n(c[h], f) ? h - 1 : h;
  }
  return { left: a, center: l, right: u };
}
function CR() {
  return 0;
}
function ZE(e) {
  return e === null ? NaN : +e;
}
function* kR(e, t) {
  for (let r of e)
    r != null && (r = +r) >= r && (yield r);
}
const jR = Eg(Fn), Lu = jR.right;
Eg(ZE).center;
class K_ extends Map {
  constructor(t, r = $R) {
    if (super(), Object.defineProperties(this, { _intern: { value: /* @__PURE__ */ new Map() }, _key: { value: r } }), t != null) for (const [n, a] of t) this.set(n, a);
  }
  get(t) {
    return super.get(G_(this, t));
  }
  has(t) {
    return super.has(G_(this, t));
  }
  set(t, r) {
    return super.set(MR(this, t), r);
  }
  delete(t) {
    return super.delete(IR(this, t));
  }
}
function G_({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : r;
}
function MR({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : (e.set(n, r), r);
}
function IR({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) && (r = e.get(n), e.delete(n)), r;
}
function $R(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function NR(e = Fn) {
  if (e === Fn) return JE;
  if (typeof e != "function") throw new TypeError("compare is not a function");
  return (t, r) => {
    const n = e(t, r);
    return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0);
  };
}
function JE(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
const RR = Math.sqrt(50), DR = Math.sqrt(10), LR = Math.sqrt(2);
function Os(e, t, r) {
  const n = (t - e) / Math.max(0, r), a = Math.floor(Math.log10(n)), u = n / Math.pow(10, a), l = u >= RR ? 10 : u >= DR ? 5 : u >= LR ? 2 : 1;
  let c, f, d;
  return a < 0 ? (d = Math.pow(10, -a) / l, c = Math.round(e * d), f = Math.round(t * d), c / d < e && ++c, f / d > t && --f, d = -d) : (d = Math.pow(10, a) * l, c = Math.round(e / d), f = Math.round(t / d), c * d < e && ++c, f * d > t && --f), f < c && 0.5 <= r && r < 2 ? Os(e, t, r * 2) : [c, f, d];
}
function im(e, t, r) {
  if (t = +t, e = +e, r = +r, !(r > 0)) return [];
  if (e === t) return [e];
  const n = t < e, [a, u, l] = n ? Os(t, e, r) : Os(e, t, r);
  if (!(u >= a)) return [];
  const c = u - a + 1, f = new Array(c);
  if (n)
    if (l < 0) for (let d = 0; d < c; ++d) f[d] = (u - d) / -l;
    else for (let d = 0; d < c; ++d) f[d] = (u - d) * l;
  else if (l < 0) for (let d = 0; d < c; ++d) f[d] = (a + d) / -l;
  else for (let d = 0; d < c; ++d) f[d] = (a + d) * l;
  return f;
}
function am(e, t, r) {
  return t = +t, e = +e, r = +r, Os(e, t, r)[2];
}
function om(e, t, r) {
  t = +t, e = +e, r = +r;
  const n = t < e, a = n ? am(t, e, r) : am(e, t, r);
  return (n ? -1 : 1) * (a < 0 ? 1 / -a : a);
}
function V_(e, t) {
  let r;
  for (const n of e)
    n != null && (r < n || r === void 0 && n >= n) && (r = n);
  return r;
}
function X_(e, t) {
  let r;
  for (const n of e)
    n != null && (r > n || r === void 0 && n >= n) && (r = n);
  return r;
}
function eT(e, t, r = 0, n = 1 / 0, a) {
  if (t = Math.floor(t), r = Math.floor(Math.max(0, r)), n = Math.floor(Math.min(e.length - 1, n)), !(r <= t && t <= n)) return e;
  for (a = a === void 0 ? JE : NR(a); n > r; ) {
    if (n - r > 600) {
      const f = n - r + 1, d = t - r + 1, v = Math.log(f), h = 0.5 * Math.exp(2 * v / 3), m = 0.5 * Math.sqrt(v * h * (f - h) / f) * (d - f / 2 < 0 ? -1 : 1), x = Math.max(r, Math.floor(t - d * h / f + m)), S = Math.min(n, Math.floor(t + (f - d) * h / f + m));
      eT(e, t, x, S, a);
    }
    const u = e[t];
    let l = r, c = n;
    for (No(e, r, t), a(e[n], u) > 0 && No(e, r, n); l < c; ) {
      for (No(e, l, c), ++l, --c; a(e[l], u) < 0; ) ++l;
      for (; a(e[c], u) > 0; ) --c;
    }
    a(e[r], u) === 0 ? No(e, r, c) : (++c, No(e, c, n)), c <= t && (r = c + 1), t <= c && (n = c - 1);
  }
  return e;
}
function No(e, t, r) {
  const n = e[t];
  e[t] = e[r], e[r] = n;
}
function qR(e, t, r) {
  if (e = Float64Array.from(kR(e)), !(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return X_(e);
    if (t >= 1) return V_(e);
    var n, a = (n - 1) * t, u = Math.floor(a), l = V_(eT(e, u).subarray(0, u + 1)), c = X_(e.subarray(u + 1));
    return l + (c - l) * (a - u);
  }
}
function BR(e, t, r = ZE) {
  if (!(!(n = e.length) || isNaN(t = +t))) {
    if (t <= 0 || n < 2) return +r(e[0], 0, e);
    if (t >= 1) return +r(e[n - 1], n - 1, e);
    var n, a = (n - 1) * t, u = Math.floor(a), l = +r(e[u], u, e), c = +r(e[u + 1], u + 1, e);
    return l + (c - l) * (a - u);
  }
}
function zR(e, t, r) {
  e = +e, t = +t, r = (a = arguments.length) < 2 ? (t = e, e = 0, 1) : a < 3 ? 1 : +r;
  for (var n = -1, a = Math.max(0, Math.ceil((t - e) / r)) | 0, u = new Array(a); ++n < a; )
    u[n] = e + n * r;
  return u;
}
function pr(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function yn(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      typeof e == "function" ? this.interpolator(e) : this.range(e);
      break;
    }
    default: {
      this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t);
      break;
    }
  }
  return this;
}
const um = Symbol("implicit");
function Tg() {
  var e = new K_(), t = [], r = [], n = um;
  function a(u) {
    let l = e.get(u);
    if (l === void 0) {
      if (n !== um) return n;
      e.set(u, l = t.push(u) - 1);
    }
    return r[l % r.length];
  }
  return a.domain = function(u) {
    if (!arguments.length) return t.slice();
    t = [], e = new K_();
    for (const l of u)
      e.has(l) || e.set(l, t.push(l) - 1);
    return a;
  }, a.range = function(u) {
    return arguments.length ? (r = Array.from(u), a) : r.slice();
  }, a.unknown = function(u) {
    return arguments.length ? (n = u, a) : n;
  }, a.copy = function() {
    return Tg(t, r).unknown(n);
  }, pr.apply(a, arguments), a;
}
function lu() {
  var e = Tg().unknown(void 0), t = e.domain, r = e.range, n = 0, a = 1, u, l, c = !1, f = 0, d = 0, v = 0.5;
  delete e.unknown;
  function h() {
    var m = t().length, x = a < n, S = x ? a : n, w = x ? n : a;
    u = (w - S) / Math.max(1, m - f + d * 2), c && (u = Math.floor(u)), S += (w - S - u * (m - f)) * v, l = u * (1 - f), c && (S = Math.round(S), l = Math.round(l));
    var b = zR(m).map(function(P) {
      return S + u * P;
    });
    return r(x ? b.reverse() : b);
  }
  return e.domain = function(m) {
    return arguments.length ? (t(m), h()) : t();
  }, e.range = function(m) {
    return arguments.length ? ([n, a] = m, n = +n, a = +a, h()) : [n, a];
  }, e.rangeRound = function(m) {
    return [n, a] = m, n = +n, a = +a, c = !0, h();
  }, e.bandwidth = function() {
    return l;
  }, e.step = function() {
    return u;
  }, e.round = function(m) {
    return arguments.length ? (c = !!m, h()) : c;
  }, e.padding = function(m) {
    return arguments.length ? (f = Math.min(1, d = +m), h()) : f;
  }, e.paddingInner = function(m) {
    return arguments.length ? (f = Math.min(1, m), h()) : f;
  }, e.paddingOuter = function(m) {
    return arguments.length ? (d = +m, h()) : d;
  }, e.align = function(m) {
    return arguments.length ? (v = Math.max(0, Math.min(1, m)), h()) : v;
  }, e.copy = function() {
    return lu(t(), [n, a]).round(c).paddingInner(f).paddingOuter(d).align(v);
  }, pr.apply(h(), arguments);
}
function tT(e) {
  var t = e.copy;
  return e.padding = e.paddingOuter, delete e.paddingInner, delete e.paddingOuter, e.copy = function() {
    return tT(t());
  }, e;
}
function Vo() {
  return tT(lu.apply(null, arguments).paddingInner(1));
}
function Cg(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function rT(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function qu() {
}
var su = 0.7, Ps = 1 / su, ca = "\\s*([+-]?\\d+)\\s*", cu = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Fr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", FR = /^#([0-9a-f]{3,8})$/, UR = new RegExp(`^rgb\\(${ca},${ca},${ca}\\)$`), WR = new RegExp(`^rgb\\(${Fr},${Fr},${Fr}\\)$`), HR = new RegExp(`^rgba\\(${ca},${ca},${ca},${cu}\\)$`), KR = new RegExp(`^rgba\\(${Fr},${Fr},${Fr},${cu}\\)$`), GR = new RegExp(`^hsl\\(${cu},${Fr},${Fr}\\)$`), VR = new RegExp(`^hsla\\(${cu},${Fr},${Fr},${cu}\\)$`), Y_ = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Cg(qu, fu, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Q_,
  // Deprecated! Use color.formatHex.
  formatHex: Q_,
  formatHex8: XR,
  formatHsl: YR,
  formatRgb: Z_,
  toString: Z_
});
function Q_() {
  return this.rgb().formatHex();
}
function XR() {
  return this.rgb().formatHex8();
}
function YR() {
  return nT(this).formatHsl();
}
function Z_() {
  return this.rgb().formatRgb();
}
function fu(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = FR.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? J_(t) : r === 3 ? new Ft(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? rs(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? rs(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = UR.exec(e)) ? new Ft(t[1], t[2], t[3], 1) : (t = WR.exec(e)) ? new Ft(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = HR.exec(e)) ? rs(t[1], t[2], t[3], t[4]) : (t = KR.exec(e)) ? rs(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = GR.exec(e)) ? rO(t[1], t[2] / 100, t[3] / 100, 1) : (t = VR.exec(e)) ? rO(t[1], t[2] / 100, t[3] / 100, t[4]) : Y_.hasOwnProperty(e) ? J_(Y_[e]) : e === "transparent" ? new Ft(NaN, NaN, NaN, 0) : null;
}
function J_(e) {
  return new Ft(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function rs(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new Ft(e, t, r, n);
}
function QR(e) {
  return e instanceof qu || (e = fu(e)), e ? (e = e.rgb(), new Ft(e.r, e.g, e.b, e.opacity)) : new Ft();
}
function lm(e, t, r, n) {
  return arguments.length === 1 ? QR(e) : new Ft(e, t, r, n ?? 1);
}
function Ft(e, t, r, n) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +n;
}
Cg(Ft, lm, rT(qu, {
  brighter(e) {
    return e = e == null ? Ps : Math.pow(Ps, e), new Ft(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? su : Math.pow(su, e), new Ft(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ft(yi(this.r), yi(this.g), yi(this.b), As(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: eO,
  // Deprecated! Use color.formatHex.
  formatHex: eO,
  formatHex8: ZR,
  formatRgb: tO,
  toString: tO
}));
function eO() {
  return `#${di(this.r)}${di(this.g)}${di(this.b)}`;
}
function ZR() {
  return `#${di(this.r)}${di(this.g)}${di(this.b)}${di((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function tO() {
  const e = As(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${yi(this.r)}, ${yi(this.g)}, ${yi(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function As(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function yi(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function di(e) {
  return e = yi(e), (e < 16 ? "0" : "") + e.toString(16);
}
function rO(e, t, r, n) {
  return n <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Ar(e, t, r, n);
}
function nT(e) {
  if (e instanceof Ar) return new Ar(e.h, e.s, e.l, e.opacity);
  if (e instanceof qu || (e = fu(e)), !e) return new Ar();
  if (e instanceof Ar) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, n = e.b / 255, a = Math.min(t, r, n), u = Math.max(t, r, n), l = NaN, c = u - a, f = (u + a) / 2;
  return c ? (t === u ? l = (r - n) / c + (r < n) * 6 : r === u ? l = (n - t) / c + 2 : l = (t - r) / c + 4, c /= f < 0.5 ? u + a : 2 - u - a, l *= 60) : c = f > 0 && f < 1 ? 0 : l, new Ar(l, c, f, e.opacity);
}
function JR(e, t, r, n) {
  return arguments.length === 1 ? nT(e) : new Ar(e, t, r, n ?? 1);
}
function Ar(e, t, r, n) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +n;
}
Cg(Ar, JR, rT(qu, {
  brighter(e) {
    return e = e == null ? Ps : Math.pow(Ps, e), new Ar(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? su : Math.pow(su, e), new Ar(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, n = r + (r < 0.5 ? r : 1 - r) * t, a = 2 * r - n;
    return new Ft(
      Kv(e >= 240 ? e - 240 : e + 120, a, n),
      Kv(e, a, n),
      Kv(e < 120 ? e + 240 : e - 120, a, n),
      this.opacity
    );
  },
  clamp() {
    return new Ar(nO(this.h), ns(this.s), ns(this.l), As(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = As(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${nO(this.h)}, ${ns(this.s) * 100}%, ${ns(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function nO(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function ns(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Kv(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const kg = (e) => () => e;
function eD(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function tD(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(n) {
    return Math.pow(e + n * t, r);
  };
}
function rD(e) {
  return (e = +e) == 1 ? iT : function(t, r) {
    return r - t ? tD(t, r, e) : kg(isNaN(t) ? r : t);
  };
}
function iT(e, t) {
  var r = t - e;
  return r ? eD(e, r) : kg(isNaN(e) ? t : e);
}
const iO = (function e(t) {
  var r = rD(t);
  function n(a, u) {
    var l = r((a = lm(a)).r, (u = lm(u)).r), c = r(a.g, u.g), f = r(a.b, u.b), d = iT(a.opacity, u.opacity);
    return function(v) {
      return a.r = l(v), a.g = c(v), a.b = f(v), a.opacity = d(v), a + "";
    };
  }
  return n.gamma = e, n;
})(1);
function nD(e, t) {
  t || (t = []);
  var r = e ? Math.min(t.length, e.length) : 0, n = t.slice(), a;
  return function(u) {
    for (a = 0; a < r; ++a) n[a] = e[a] * (1 - u) + t[a] * u;
    return n;
  };
}
function iD(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function aD(e, t) {
  var r = t ? t.length : 0, n = e ? Math.min(r, e.length) : 0, a = new Array(n), u = new Array(r), l;
  for (l = 0; l < n; ++l) a[l] = Fa(e[l], t[l]);
  for (; l < r; ++l) u[l] = t[l];
  return function(c) {
    for (l = 0; l < n; ++l) u[l] = a[l](c);
    return u;
  };
}
function oD(e, t) {
  var r = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(n) {
    return r.setTime(e * (1 - n) + t * n), r;
  };
}
function Es(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
function uD(e, t) {
  var r = {}, n = {}, a;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (a in t)
    a in e ? r[a] = Fa(e[a], t[a]) : n[a] = t[a];
  return function(u) {
    for (a in r) n[a] = r[a](u);
    return n;
  };
}
var sm = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Gv = new RegExp(sm.source, "g");
function lD(e) {
  return function() {
    return e;
  };
}
function sD(e) {
  return function(t) {
    return e(t) + "";
  };
}
function cD(e, t) {
  var r = sm.lastIndex = Gv.lastIndex = 0, n, a, u, l = -1, c = [], f = [];
  for (e = e + "", t = t + ""; (n = sm.exec(e)) && (a = Gv.exec(t)); )
    (u = a.index) > r && (u = t.slice(r, u), c[l] ? c[l] += u : c[++l] = u), (n = n[0]) === (a = a[0]) ? c[l] ? c[l] += a : c[++l] = a : (c[++l] = null, f.push({ i: l, x: Es(n, a) })), r = Gv.lastIndex;
  return r < t.length && (u = t.slice(r), c[l] ? c[l] += u : c[++l] = u), c.length < 2 ? f[0] ? sD(f[0].x) : lD(t) : (t = f.length, function(d) {
    for (var v = 0, h; v < t; ++v) c[(h = f[v]).i] = h.x(d);
    return c.join("");
  });
}
function Fa(e, t) {
  var r = typeof t, n;
  return t == null || r === "boolean" ? kg(t) : (r === "number" ? Es : r === "string" ? (n = fu(t)) ? (t = n, iO) : cD : t instanceof fu ? iO : t instanceof Date ? oD : iD(t) ? nD : Array.isArray(t) ? aD : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? uD : Es)(e, t);
}
function jg(e, t) {
  return e = +e, t = +t, function(r) {
    return Math.round(e * (1 - r) + t * r);
  };
}
function fD(e, t) {
  t === void 0 && (t = e, e = Fa);
  for (var r = 0, n = t.length - 1, a = t[0], u = new Array(n < 0 ? 0 : n); r < n; ) u[r] = e(a, a = t[++r]);
  return function(l) {
    var c = Math.max(0, Math.min(n - 1, Math.floor(l *= n)));
    return u[c](l - c);
  };
}
function dD(e) {
  return function() {
    return e;
  };
}
function Ts(e) {
  return +e;
}
var aO = [0, 1];
function $t(e) {
  return e;
}
function cm(e, t) {
  return (t -= e = +e) ? function(r) {
    return (r - e) / t;
  } : dD(isNaN(t) ? NaN : 0.5);
}
function pD(e, t) {
  var r;
  return e > t && (r = e, e = t, t = r), function(n) {
    return Math.max(e, Math.min(t, n));
  };
}
function hD(e, t, r) {
  var n = e[0], a = e[1], u = t[0], l = t[1];
  return a < n ? (n = cm(a, n), u = r(l, u)) : (n = cm(n, a), u = r(u, l)), function(c) {
    return u(n(c));
  };
}
function vD(e, t, r) {
  var n = Math.min(e.length, t.length) - 1, a = new Array(n), u = new Array(n), l = -1;
  for (e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++l < n; )
    a[l] = cm(e[l], e[l + 1]), u[l] = r(t[l], t[l + 1]);
  return function(c) {
    var f = Lu(e, c, 1, n) - 1;
    return u[f](a[f](c));
  };
}
function Bu(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function _c() {
  var e = aO, t = aO, r = Fa, n, a, u, l = $t, c, f, d;
  function v() {
    var m = Math.min(e.length, t.length);
    return l !== $t && (l = pD(e[0], e[m - 1])), c = m > 2 ? vD : hD, f = d = null, h;
  }
  function h(m) {
    return m == null || isNaN(m = +m) ? u : (f || (f = c(e.map(n), t, r)))(n(l(m)));
  }
  return h.invert = function(m) {
    return l(a((d || (d = c(t, e.map(n), Es)))(m)));
  }, h.domain = function(m) {
    return arguments.length ? (e = Array.from(m, Ts), v()) : e.slice();
  }, h.range = function(m) {
    return arguments.length ? (t = Array.from(m), v()) : t.slice();
  }, h.rangeRound = function(m) {
    return t = Array.from(m), r = jg, v();
  }, h.clamp = function(m) {
    return arguments.length ? (l = m ? !0 : $t, v()) : l !== $t;
  }, h.interpolate = function(m) {
    return arguments.length ? (r = m, v()) : r;
  }, h.unknown = function(m) {
    return arguments.length ? (u = m, h) : u;
  }, function(m, x) {
    return n = m, a = x, v();
  };
}
function Mg() {
  return _c()($t, $t);
}
function yD(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function Cs(e, t) {
  if ((r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var r, n = e.slice(0, r);
  return [
    n.length > 1 ? n[0] + n.slice(2) : n,
    +e.slice(r + 1)
  ];
}
function ma(e) {
  return e = Cs(Math.abs(e)), e ? e[1] : NaN;
}
function mD(e, t) {
  return function(r, n) {
    for (var a = r.length, u = [], l = 0, c = e[0], f = 0; a > 0 && c > 0 && (f + c + 1 > n && (c = Math.max(1, n - f)), u.push(r.substring(a -= c, a + c)), !((f += c + 1) > n)); )
      c = e[l = (l + 1) % e.length];
    return u.reverse().join(t);
  };
}
function gD(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(r) {
      return e[+r];
    });
  };
}
var bD = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function du(e) {
  if (!(t = bD.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new Ig({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10]
  });
}
du.prototype = Ig.prototype;
function Ig(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Ig.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function xD(e) {
  e: for (var t = e.length, r = 1, n = -1, a; r < t; ++r)
    switch (e[r]) {
      case ".":
        n = a = r;
        break;
      case "0":
        n === 0 && (n = r), a = r;
        break;
      default:
        if (!+e[r]) break e;
        n > 0 && (n = 0);
        break;
    }
  return n > 0 ? e.slice(0, n) + e.slice(a + 1) : e;
}
var aT;
function wD(e, t) {
  var r = Cs(e, t);
  if (!r) return e + "";
  var n = r[0], a = r[1], u = a - (aT = Math.max(-8, Math.min(8, Math.floor(a / 3))) * 3) + 1, l = n.length;
  return u === l ? n : u > l ? n + new Array(u - l + 1).join("0") : u > 0 ? n.slice(0, u) + "." + n.slice(u) : "0." + new Array(1 - u).join("0") + Cs(e, Math.max(0, t + u - 1))[0];
}
function oO(e, t) {
  var r = Cs(e, t);
  if (!r) return e + "";
  var n = r[0], a = r[1];
  return a < 0 ? "0." + new Array(-a).join("0") + n : n.length > a + 1 ? n.slice(0, a + 1) + "." + n.slice(a + 1) : n + new Array(a - n.length + 2).join("0");
}
const uO = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: yD,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => oO(e * 100, t),
  r: oO,
  s: wD,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function lO(e) {
  return e;
}
var sO = Array.prototype.map, cO = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function SD(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? lO : mD(sO.call(e.grouping, Number), e.thousands + ""), r = e.currency === void 0 ? "" : e.currency[0] + "", n = e.currency === void 0 ? "" : e.currency[1] + "", a = e.decimal === void 0 ? "." : e.decimal + "", u = e.numerals === void 0 ? lO : gD(sO.call(e.numerals, String)), l = e.percent === void 0 ? "%" : e.percent + "", c = e.minus === void 0 ? "−" : e.minus + "", f = e.nan === void 0 ? "NaN" : e.nan + "";
  function d(h) {
    h = du(h);
    var m = h.fill, x = h.align, S = h.sign, w = h.symbol, b = h.zero, P = h.width, C = h.comma, A = h.precision, T = h.trim, _ = h.type;
    _ === "n" ? (C = !0, _ = "g") : uO[_] || (A === void 0 && (A = 12), T = !0, _ = "g"), (b || m === "0" && x === "=") && (b = !0, m = "0", x = "=");
    var O = w === "$" ? r : w === "#" && /[boxX]/.test(_) ? "0" + _.toLowerCase() : "", k = w === "$" ? n : /[%p]/.test(_) ? l : "", M = uO[_], N = /[defgprs%]/.test(_);
    A = A === void 0 ? 6 : /[gprs]/.test(_) ? Math.max(1, Math.min(21, A)) : Math.max(0, Math.min(20, A));
    function W(R) {
      var q = O, F = k, X, G, Y;
      if (_ === "c")
        F = M(R) + F, R = "";
      else {
        R = +R;
        var ee = R < 0 || 1 / R < 0;
        if (R = isNaN(R) ? f : M(Math.abs(R), A), T && (R = xD(R)), ee && +R == 0 && S !== "+" && (ee = !1), q = (ee ? S === "(" ? S : c : S === "-" || S === "(" ? "" : S) + q, F = (_ === "s" ? cO[8 + aT / 3] : "") + F + (ee && S === "(" ? ")" : ""), N) {
          for (X = -1, G = R.length; ++X < G; )
            if (Y = R.charCodeAt(X), 48 > Y || Y > 57) {
              F = (Y === 46 ? a + R.slice(X + 1) : R.slice(X)) + F, R = R.slice(0, X);
              break;
            }
        }
      }
      C && !b && (R = t(R, 1 / 0));
      var H = q.length + R.length + F.length, Q = H < P ? new Array(P - H + 1).join(m) : "";
      switch (C && b && (R = t(Q + R, Q.length ? P - F.length : 1 / 0), Q = ""), x) {
        case "<":
          R = q + R + F + Q;
          break;
        case "=":
          R = q + Q + R + F;
          break;
        case "^":
          R = Q.slice(0, H = Q.length >> 1) + q + R + F + Q.slice(H);
          break;
        default:
          R = Q + q + R + F;
          break;
      }
      return u(R);
    }
    return W.toString = function() {
      return h + "";
    }, W;
  }
  function v(h, m) {
    var x = d((h = du(h), h.type = "f", h)), S = Math.max(-8, Math.min(8, Math.floor(ma(m) / 3))) * 3, w = Math.pow(10, -S), b = cO[8 + S / 3];
    return function(P) {
      return x(w * P) + b;
    };
  }
  return {
    format: d,
    formatPrefix: v
  };
}
var is, $g, oT;
_D({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function _D(e) {
  return is = SD(e), $g = is.format, oT = is.formatPrefix, is;
}
function OD(e) {
  return Math.max(0, -ma(Math.abs(e)));
}
function PD(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(ma(t) / 3))) * 3 - ma(Math.abs(e)));
}
function AD(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, ma(t) - ma(e)) + 1;
}
function uT(e, t, r, n) {
  var a = om(e, t, r), u;
  switch (n = du(n ?? ",f"), n.type) {
    case "s": {
      var l = Math.max(Math.abs(e), Math.abs(t));
      return n.precision == null && !isNaN(u = PD(a, l)) && (n.precision = u), oT(n, l);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null && !isNaN(u = AD(a, Math.max(Math.abs(e), Math.abs(t)))) && (n.precision = u - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN(u = OD(a)) && (n.precision = u - (n.type === "%") * 2);
      break;
    }
  }
  return $g(n);
}
function Kn(e) {
  var t = e.domain;
  return e.ticks = function(r) {
    var n = t();
    return im(n[0], n[n.length - 1], r ?? 10);
  }, e.tickFormat = function(r, n) {
    var a = t();
    return uT(a[0], a[a.length - 1], r ?? 10, n);
  }, e.nice = function(r) {
    r == null && (r = 10);
    var n = t(), a = 0, u = n.length - 1, l = n[a], c = n[u], f, d, v = 10;
    for (c < l && (d = l, l = c, c = d, d = a, a = u, u = d); v-- > 0; ) {
      if (d = am(l, c, r), d === f)
        return n[a] = l, n[u] = c, t(n);
      if (d > 0)
        l = Math.floor(l / d) * d, c = Math.ceil(c / d) * d;
      else if (d < 0)
        l = Math.ceil(l * d) / d, c = Math.floor(c * d) / d;
      else
        break;
      f = d;
    }
    return e;
  }, e;
}
function ks() {
  var e = Mg();
  return e.copy = function() {
    return Bu(e, ks());
  }, pr.apply(e, arguments), Kn(e);
}
function lT(e) {
  var t;
  function r(n) {
    return n == null || isNaN(n = +n) ? t : n;
  }
  return r.invert = r, r.domain = r.range = function(n) {
    return arguments.length ? (e = Array.from(n, Ts), r) : e.slice();
  }, r.unknown = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.copy = function() {
    return lT(e).unknown(t);
  }, e = arguments.length ? Array.from(e, Ts) : [0, 1], Kn(r);
}
function sT(e, t) {
  e = e.slice();
  var r = 0, n = e.length - 1, a = e[r], u = e[n], l;
  return u < a && (l = r, r = n, n = l, l = a, a = u, u = l), e[r] = t.floor(a), e[n] = t.ceil(u), e;
}
function fO(e) {
  return Math.log(e);
}
function dO(e) {
  return Math.exp(e);
}
function ED(e) {
  return -Math.log(-e);
}
function TD(e) {
  return -Math.exp(-e);
}
function CD(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function kD(e) {
  return e === 10 ? CD : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function jD(e) {
  return e === Math.E ? Math.log : e === 10 && Math.log10 || e === 2 && Math.log2 || (e = Math.log(e), (t) => Math.log(t) / e);
}
function pO(e) {
  return (t, r) => -e(-t, r);
}
function Ng(e) {
  const t = e(fO, dO), r = t.domain;
  let n = 10, a, u;
  function l() {
    return a = jD(n), u = kD(n), r()[0] < 0 ? (a = pO(a), u = pO(u), e(ED, TD)) : e(fO, dO), t;
  }
  return t.base = function(c) {
    return arguments.length ? (n = +c, l()) : n;
  }, t.domain = function(c) {
    return arguments.length ? (r(c), l()) : r();
  }, t.ticks = (c) => {
    const f = r();
    let d = f[0], v = f[f.length - 1];
    const h = v < d;
    h && ([d, v] = [v, d]);
    let m = a(d), x = a(v), S, w;
    const b = c == null ? 10 : +c;
    let P = [];
    if (!(n % 1) && x - m < b) {
      if (m = Math.floor(m), x = Math.ceil(x), d > 0) {
        for (; m <= x; ++m)
          for (S = 1; S < n; ++S)
            if (w = m < 0 ? S / u(-m) : S * u(m), !(w < d)) {
              if (w > v) break;
              P.push(w);
            }
      } else for (; m <= x; ++m)
        for (S = n - 1; S >= 1; --S)
          if (w = m > 0 ? S / u(-m) : S * u(m), !(w < d)) {
            if (w > v) break;
            P.push(w);
          }
      P.length * 2 < b && (P = im(d, v, b));
    } else
      P = im(m, x, Math.min(x - m, b)).map(u);
    return h ? P.reverse() : P;
  }, t.tickFormat = (c, f) => {
    if (c == null && (c = 10), f == null && (f = n === 10 ? "s" : ","), typeof f != "function" && (!(n % 1) && (f = du(f)).precision == null && (f.trim = !0), f = $g(f)), c === 1 / 0) return f;
    const d = Math.max(1, n * c / t.ticks().length);
    return (v) => {
      let h = v / u(Math.round(a(v)));
      return h * n < n - 0.5 && (h *= n), h <= d ? f(v) : "";
    };
  }, t.nice = () => r(sT(r(), {
    floor: (c) => u(Math.floor(a(c))),
    ceil: (c) => u(Math.ceil(a(c)))
  })), t;
}
function cT() {
  const e = Ng(_c()).domain([1, 10]);
  return e.copy = () => Bu(e, cT()).base(e.base()), pr.apply(e, arguments), e;
}
function hO(e) {
  return function(t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function vO(e) {
  return function(t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function Rg(e) {
  var t = 1, r = e(hO(t), vO(t));
  return r.constant = function(n) {
    return arguments.length ? e(hO(t = +n), vO(t)) : t;
  }, Kn(r);
}
function fT() {
  var e = Rg(_c());
  return e.copy = function() {
    return Bu(e, fT()).constant(e.constant());
  }, pr.apply(e, arguments);
}
function yO(e) {
  return function(t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function MD(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function ID(e) {
  return e < 0 ? -e * e : e * e;
}
function Dg(e) {
  var t = e($t, $t), r = 1;
  function n() {
    return r === 1 ? e($t, $t) : r === 0.5 ? e(MD, ID) : e(yO(r), yO(1 / r));
  }
  return t.exponent = function(a) {
    return arguments.length ? (r = +a, n()) : r;
  }, Kn(t);
}
function Lg() {
  var e = Dg(_c());
  return e.copy = function() {
    return Bu(e, Lg()).exponent(e.exponent());
  }, pr.apply(e, arguments), e;
}
function $D() {
  return Lg.apply(null, arguments).exponent(0.5);
}
function mO(e) {
  return Math.sign(e) * e * e;
}
function ND(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function dT() {
  var e = Mg(), t = [0, 1], r = !1, n;
  function a(u) {
    var l = ND(e(u));
    return isNaN(l) ? n : r ? Math.round(l) : l;
  }
  return a.invert = function(u) {
    return e.invert(mO(u));
  }, a.domain = function(u) {
    return arguments.length ? (e.domain(u), a) : e.domain();
  }, a.range = function(u) {
    return arguments.length ? (e.range((t = Array.from(u, Ts)).map(mO)), a) : t.slice();
  }, a.rangeRound = function(u) {
    return a.range(u).round(!0);
  }, a.round = function(u) {
    return arguments.length ? (r = !!u, a) : r;
  }, a.clamp = function(u) {
    return arguments.length ? (e.clamp(u), a) : e.clamp();
  }, a.unknown = function(u) {
    return arguments.length ? (n = u, a) : n;
  }, a.copy = function() {
    return dT(e.domain(), t).round(r).clamp(e.clamp()).unknown(n);
  }, pr.apply(a, arguments), Kn(a);
}
function pT() {
  var e = [], t = [], r = [], n;
  function a() {
    var l = 0, c = Math.max(1, t.length);
    for (r = new Array(c - 1); ++l < c; ) r[l - 1] = BR(e, l / c);
    return u;
  }
  function u(l) {
    return l == null || isNaN(l = +l) ? n : t[Lu(r, l)];
  }
  return u.invertExtent = function(l) {
    var c = t.indexOf(l);
    return c < 0 ? [NaN, NaN] : [
      c > 0 ? r[c - 1] : e[0],
      c < r.length ? r[c] : e[e.length - 1]
    ];
  }, u.domain = function(l) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let c of l) c != null && !isNaN(c = +c) && e.push(c);
    return e.sort(Fn), a();
  }, u.range = function(l) {
    return arguments.length ? (t = Array.from(l), a()) : t.slice();
  }, u.unknown = function(l) {
    return arguments.length ? (n = l, u) : n;
  }, u.quantiles = function() {
    return r.slice();
  }, u.copy = function() {
    return pT().domain(e).range(t).unknown(n);
  }, pr.apply(u, arguments);
}
function hT() {
  var e = 0, t = 1, r = 1, n = [0.5], a = [0, 1], u;
  function l(f) {
    return f != null && f <= f ? a[Lu(n, f, 0, r)] : u;
  }
  function c() {
    var f = -1;
    for (n = new Array(r); ++f < r; ) n[f] = ((f + 1) * t - (f - r) * e) / (r + 1);
    return l;
  }
  return l.domain = function(f) {
    return arguments.length ? ([e, t] = f, e = +e, t = +t, c()) : [e, t];
  }, l.range = function(f) {
    return arguments.length ? (r = (a = Array.from(f)).length - 1, c()) : a.slice();
  }, l.invertExtent = function(f) {
    var d = a.indexOf(f);
    return d < 0 ? [NaN, NaN] : d < 1 ? [e, n[0]] : d >= r ? [n[r - 1], t] : [n[d - 1], n[d]];
  }, l.unknown = function(f) {
    return arguments.length && (u = f), l;
  }, l.thresholds = function() {
    return n.slice();
  }, l.copy = function() {
    return hT().domain([e, t]).range(a).unknown(u);
  }, pr.apply(Kn(l), arguments);
}
function vT() {
  var e = [0.5], t = [0, 1], r, n = 1;
  function a(u) {
    return u != null && u <= u ? t[Lu(e, u, 0, n)] : r;
  }
  return a.domain = function(u) {
    return arguments.length ? (e = Array.from(u), n = Math.min(e.length, t.length - 1), a) : e.slice();
  }, a.range = function(u) {
    return arguments.length ? (t = Array.from(u), n = Math.min(e.length, t.length - 1), a) : t.slice();
  }, a.invertExtent = function(u) {
    var l = t.indexOf(u);
    return [e[l - 1], e[l]];
  }, a.unknown = function(u) {
    return arguments.length ? (r = u, a) : r;
  }, a.copy = function() {
    return vT().domain(e).range(t).unknown(r);
  }, pr.apply(a, arguments);
}
const Vv = /* @__PURE__ */ new Date(), Xv = /* @__PURE__ */ new Date();
function ht(e, t, r, n) {
  function a(u) {
    return e(u = arguments.length === 0 ? /* @__PURE__ */ new Date() : /* @__PURE__ */ new Date(+u)), u;
  }
  return a.floor = (u) => (e(u = /* @__PURE__ */ new Date(+u)), u), a.ceil = (u) => (e(u = new Date(u - 1)), t(u, 1), e(u), u), a.round = (u) => {
    const l = a(u), c = a.ceil(u);
    return u - l < c - u ? l : c;
  }, a.offset = (u, l) => (t(u = /* @__PURE__ */ new Date(+u), l == null ? 1 : Math.floor(l)), u), a.range = (u, l, c) => {
    const f = [];
    if (u = a.ceil(u), c = c == null ? 1 : Math.floor(c), !(u < l) || !(c > 0)) return f;
    let d;
    do
      f.push(d = /* @__PURE__ */ new Date(+u)), t(u, c), e(u);
    while (d < u && u < l);
    return f;
  }, a.filter = (u) => ht((l) => {
    if (l >= l) for (; e(l), !u(l); ) l.setTime(l - 1);
  }, (l, c) => {
    if (l >= l)
      if (c < 0) for (; ++c <= 0; )
        for (; t(l, -1), !u(l); )
          ;
      else for (; --c >= 0; )
        for (; t(l, 1), !u(l); )
          ;
  }), r && (a.count = (u, l) => (Vv.setTime(+u), Xv.setTime(+l), e(Vv), e(Xv), Math.floor(r(Vv, Xv))), a.every = (u) => (u = Math.floor(u), !isFinite(u) || !(u > 0) ? null : u > 1 ? a.filter(n ? (l) => n(l) % u === 0 : (l) => a.count(0, l) % u === 0) : a)), a;
}
const js = ht(() => {
}, (e, t) => {
  e.setTime(+e + t);
}, (e, t) => t - e);
js.every = (e) => (e = Math.floor(e), !isFinite(e) || !(e > 0) ? null : e > 1 ? ht((t) => {
  t.setTime(Math.floor(t / e) * e);
}, (t, r) => {
  t.setTime(+t + r * e);
}, (t, r) => (r - t) / e) : js);
js.range;
const nn = 1e3, cr = nn * 60, an = cr * 60, cn = an * 24, qg = cn * 7, gO = cn * 30, Yv = cn * 365, pi = ht((e) => {
  e.setTime(e - e.getMilliseconds());
}, (e, t) => {
  e.setTime(+e + t * nn);
}, (e, t) => (t - e) / nn, (e) => e.getUTCSeconds());
pi.range;
const Bg = ht((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * nn);
}, (e, t) => {
  e.setTime(+e + t * cr);
}, (e, t) => (t - e) / cr, (e) => e.getMinutes());
Bg.range;
const zg = ht((e) => {
  e.setUTCSeconds(0, 0);
}, (e, t) => {
  e.setTime(+e + t * cr);
}, (e, t) => (t - e) / cr, (e) => e.getUTCMinutes());
zg.range;
const Fg = ht((e) => {
  e.setTime(e - e.getMilliseconds() - e.getSeconds() * nn - e.getMinutes() * cr);
}, (e, t) => {
  e.setTime(+e + t * an);
}, (e, t) => (t - e) / an, (e) => e.getHours());
Fg.range;
const Ug = ht((e) => {
  e.setUTCMinutes(0, 0, 0);
}, (e, t) => {
  e.setTime(+e + t * an);
}, (e, t) => (t - e) / an, (e) => e.getUTCHours());
Ug.range;
const zu = ht(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * cr) / cn,
  (e) => e.getDate() - 1
);
zu.range;
const Oc = ht((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / cn, (e) => e.getUTCDate() - 1);
Oc.range;
const yT = ht((e) => {
  e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCDate(e.getUTCDate() + t);
}, (e, t) => (t - e) / cn, (e) => Math.floor(e / cn));
yT.range;
function Ti(e) {
  return ht((t) => {
    t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setDate(t.getDate() + r * 7);
  }, (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * cr) / qg);
}
const Pc = Ti(0), Ms = Ti(1), RD = Ti(2), DD = Ti(3), ga = Ti(4), LD = Ti(5), qD = Ti(6);
Pc.range;
Ms.range;
RD.range;
DD.range;
ga.range;
LD.range;
qD.range;
function Ci(e) {
  return ht((t) => {
    t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0);
  }, (t, r) => {
    t.setUTCDate(t.getUTCDate() + r * 7);
  }, (t, r) => (r - t) / qg);
}
const Ac = Ci(0), Is = Ci(1), BD = Ci(2), zD = Ci(3), ba = Ci(4), FD = Ci(5), UD = Ci(6);
Ac.range;
Is.range;
BD.range;
zD.range;
ba.range;
FD.range;
UD.range;
const Wg = ht((e) => {
  e.setDate(1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setMonth(e.getMonth() + t);
}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, (e) => e.getMonth());
Wg.range;
const Hg = ht((e) => {
  e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCMonth(e.getUTCMonth() + t);
}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, (e) => e.getUTCMonth());
Hg.range;
const fn = ht((e) => {
  e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
}, (e, t) => {
  e.setFullYear(e.getFullYear() + t);
}, (e, t) => t.getFullYear() - e.getFullYear(), (e) => e.getFullYear());
fn.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : ht((t) => {
  t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0);
}, (t, r) => {
  t.setFullYear(t.getFullYear() + r * e);
});
fn.range;
const dn = ht((e) => {
  e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
}, (e, t) => {
  e.setUTCFullYear(e.getUTCFullYear() + t);
}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), (e) => e.getUTCFullYear());
dn.every = (e) => !isFinite(e = Math.floor(e)) || !(e > 0) ? null : ht((t) => {
  t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
}, (t, r) => {
  t.setUTCFullYear(t.getUTCFullYear() + r * e);
});
dn.range;
function mT(e, t, r, n, a, u) {
  const l = [
    [pi, 1, nn],
    [pi, 5, 5 * nn],
    [pi, 15, 15 * nn],
    [pi, 30, 30 * nn],
    [u, 1, cr],
    [u, 5, 5 * cr],
    [u, 15, 15 * cr],
    [u, 30, 30 * cr],
    [a, 1, an],
    [a, 3, 3 * an],
    [a, 6, 6 * an],
    [a, 12, 12 * an],
    [n, 1, cn],
    [n, 2, 2 * cn],
    [r, 1, qg],
    [t, 1, gO],
    [t, 3, 3 * gO],
    [e, 1, Yv]
  ];
  function c(d, v, h) {
    const m = v < d;
    m && ([d, v] = [v, d]);
    const x = h && typeof h.range == "function" ? h : f(d, v, h), S = x ? x.range(d, +v + 1) : [];
    return m ? S.reverse() : S;
  }
  function f(d, v, h) {
    const m = Math.abs(v - d) / h, x = Eg(([, , b]) => b).right(l, m);
    if (x === l.length) return e.every(om(d / Yv, v / Yv, h));
    if (x === 0) return js.every(Math.max(om(d, v, h), 1));
    const [S, w] = l[m / l[x - 1][2] < l[x][2] / m ? x - 1 : x];
    return S.every(w);
  }
  return [c, f];
}
const [WD, HD] = mT(dn, Hg, Ac, yT, Ug, zg), [KD, GD] = mT(fn, Wg, Pc, zu, Fg, Bg);
function Qv(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Zv(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function Ro(e, t, r) {
  return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
}
function VD(e) {
  var t = e.dateTime, r = e.date, n = e.time, a = e.periods, u = e.days, l = e.shortDays, c = e.months, f = e.shortMonths, d = Do(a), v = Lo(a), h = Do(u), m = Lo(u), x = Do(l), S = Lo(l), w = Do(c), b = Lo(c), P = Do(f), C = Lo(f), A = {
    a: ee,
    A: H,
    b: Q,
    B: J,
    c: null,
    d: OO,
    e: OO,
    f: mL,
    g: EL,
    G: CL,
    H: hL,
    I: vL,
    j: yL,
    L: gT,
    m: gL,
    M: bL,
    p: I,
    q: B,
    Q: EO,
    s: TO,
    S: xL,
    u: wL,
    U: SL,
    V: _L,
    w: OL,
    W: PL,
    x: null,
    X: null,
    y: AL,
    Y: TL,
    Z: kL,
    "%": AO
  }, T = {
    a: ue,
    A: pe,
    b: me,
    B: Se,
    c: null,
    d: PO,
    e: PO,
    f: $L,
    g: WL,
    G: KL,
    H: jL,
    I: ML,
    j: IL,
    L: xT,
    m: NL,
    M: RL,
    p: je,
    q: Oe,
    Q: EO,
    s: TO,
    S: DL,
    u: LL,
    U: qL,
    V: BL,
    w: zL,
    W: FL,
    x: null,
    X: null,
    y: UL,
    Y: HL,
    Z: GL,
    "%": AO
  }, _ = {
    a: W,
    A: R,
    b: q,
    B: F,
    c: X,
    d: SO,
    e: SO,
    f: cL,
    g: wO,
    G: xO,
    H: _O,
    I: _O,
    j: oL,
    L: sL,
    m: aL,
    M: uL,
    p: N,
    q: iL,
    Q: dL,
    s: pL,
    S: lL,
    u: JD,
    U: eL,
    V: tL,
    w: ZD,
    W: rL,
    x: G,
    X: Y,
    y: wO,
    Y: xO,
    Z: nL,
    "%": fL
  };
  A.x = O(r, A), A.X = O(n, A), A.c = O(t, A), T.x = O(r, T), T.X = O(n, T), T.c = O(t, T);
  function O(ae, ye) {
    return function(Pe) {
      var ne = [], Be = -1, Ce = 0, Ze = ae.length, Je, vt, hr;
      for (Pe instanceof Date || (Pe = /* @__PURE__ */ new Date(+Pe)); ++Be < Ze; )
        ae.charCodeAt(Be) === 37 && (ne.push(ae.slice(Ce, Be)), (vt = bO[Je = ae.charAt(++Be)]) != null ? Je = ae.charAt(++Be) : vt = Je === "e" ? " " : "0", (hr = ye[Je]) && (Je = hr(Pe, vt)), ne.push(Je), Ce = Be + 1);
      return ne.push(ae.slice(Ce, Be)), ne.join("");
    };
  }
  function k(ae, ye) {
    return function(Pe) {
      var ne = Ro(1900, void 0, 1), Be = M(ne, ae, Pe += "", 0), Ce, Ze;
      if (Be != Pe.length) return null;
      if ("Q" in ne) return new Date(ne.Q);
      if ("s" in ne) return new Date(ne.s * 1e3 + ("L" in ne ? ne.L : 0));
      if (ye && !("Z" in ne) && (ne.Z = 0), "p" in ne && (ne.H = ne.H % 12 + ne.p * 12), ne.m === void 0 && (ne.m = "q" in ne ? ne.q : 0), "V" in ne) {
        if (ne.V < 1 || ne.V > 53) return null;
        "w" in ne || (ne.w = 1), "Z" in ne ? (Ce = Zv(Ro(ne.y, 0, 1)), Ze = Ce.getUTCDay(), Ce = Ze > 4 || Ze === 0 ? Is.ceil(Ce) : Is(Ce), Ce = Oc.offset(Ce, (ne.V - 1) * 7), ne.y = Ce.getUTCFullYear(), ne.m = Ce.getUTCMonth(), ne.d = Ce.getUTCDate() + (ne.w + 6) % 7) : (Ce = Qv(Ro(ne.y, 0, 1)), Ze = Ce.getDay(), Ce = Ze > 4 || Ze === 0 ? Ms.ceil(Ce) : Ms(Ce), Ce = zu.offset(Ce, (ne.V - 1) * 7), ne.y = Ce.getFullYear(), ne.m = Ce.getMonth(), ne.d = Ce.getDate() + (ne.w + 6) % 7);
      } else ("W" in ne || "U" in ne) && ("w" in ne || (ne.w = "u" in ne ? ne.u % 7 : "W" in ne ? 1 : 0), Ze = "Z" in ne ? Zv(Ro(ne.y, 0, 1)).getUTCDay() : Qv(Ro(ne.y, 0, 1)).getDay(), ne.m = 0, ne.d = "W" in ne ? (ne.w + 6) % 7 + ne.W * 7 - (Ze + 5) % 7 : ne.w + ne.U * 7 - (Ze + 6) % 7);
      return "Z" in ne ? (ne.H += ne.Z / 100 | 0, ne.M += ne.Z % 100, Zv(ne)) : Qv(ne);
    };
  }
  function M(ae, ye, Pe, ne) {
    for (var Be = 0, Ce = ye.length, Ze = Pe.length, Je, vt; Be < Ce; ) {
      if (ne >= Ze) return -1;
      if (Je = ye.charCodeAt(Be++), Je === 37) {
        if (Je = ye.charAt(Be++), vt = _[Je in bO ? ye.charAt(Be++) : Je], !vt || (ne = vt(ae, Pe, ne)) < 0) return -1;
      } else if (Je != Pe.charCodeAt(ne++))
        return -1;
    }
    return ne;
  }
  function N(ae, ye, Pe) {
    var ne = d.exec(ye.slice(Pe));
    return ne ? (ae.p = v.get(ne[0].toLowerCase()), Pe + ne[0].length) : -1;
  }
  function W(ae, ye, Pe) {
    var ne = x.exec(ye.slice(Pe));
    return ne ? (ae.w = S.get(ne[0].toLowerCase()), Pe + ne[0].length) : -1;
  }
  function R(ae, ye, Pe) {
    var ne = h.exec(ye.slice(Pe));
    return ne ? (ae.w = m.get(ne[0].toLowerCase()), Pe + ne[0].length) : -1;
  }
  function q(ae, ye, Pe) {
    var ne = P.exec(ye.slice(Pe));
    return ne ? (ae.m = C.get(ne[0].toLowerCase()), Pe + ne[0].length) : -1;
  }
  function F(ae, ye, Pe) {
    var ne = w.exec(ye.slice(Pe));
    return ne ? (ae.m = b.get(ne[0].toLowerCase()), Pe + ne[0].length) : -1;
  }
  function X(ae, ye, Pe) {
    return M(ae, t, ye, Pe);
  }
  function G(ae, ye, Pe) {
    return M(ae, r, ye, Pe);
  }
  function Y(ae, ye, Pe) {
    return M(ae, n, ye, Pe);
  }
  function ee(ae) {
    return l[ae.getDay()];
  }
  function H(ae) {
    return u[ae.getDay()];
  }
  function Q(ae) {
    return f[ae.getMonth()];
  }
  function J(ae) {
    return c[ae.getMonth()];
  }
  function I(ae) {
    return a[+(ae.getHours() >= 12)];
  }
  function B(ae) {
    return 1 + ~~(ae.getMonth() / 3);
  }
  function ue(ae) {
    return l[ae.getUTCDay()];
  }
  function pe(ae) {
    return u[ae.getUTCDay()];
  }
  function me(ae) {
    return f[ae.getUTCMonth()];
  }
  function Se(ae) {
    return c[ae.getUTCMonth()];
  }
  function je(ae) {
    return a[+(ae.getUTCHours() >= 12)];
  }
  function Oe(ae) {
    return 1 + ~~(ae.getUTCMonth() / 3);
  }
  return {
    format: function(ae) {
      var ye = O(ae += "", A);
      return ye.toString = function() {
        return ae;
      }, ye;
    },
    parse: function(ae) {
      var ye = k(ae += "", !1);
      return ye.toString = function() {
        return ae;
      }, ye;
    },
    utcFormat: function(ae) {
      var ye = O(ae += "", T);
      return ye.toString = function() {
        return ae;
      }, ye;
    },
    utcParse: function(ae) {
      var ye = k(ae += "", !0);
      return ye.toString = function() {
        return ae;
      }, ye;
    }
  };
}
var bO = { "-": "", _: " ", 0: "0" }, xt = /^\s*\d+/, XD = /^%/, YD = /[\\^$*+?|[\]().{}]/g;
function $e(e, t, r) {
  var n = e < 0 ? "-" : "", a = (n ? -e : e) + "", u = a.length;
  return n + (u < r ? new Array(r - u + 1).join(t) + a : a);
}
function QD(e) {
  return e.replace(YD, "\\$&");
}
function Do(e) {
  return new RegExp("^(?:" + e.map(QD).join("|") + ")", "i");
}
function Lo(e) {
  return new Map(e.map((t, r) => [t.toLowerCase(), r]));
}
function ZD(e, t, r) {
  var n = xt.exec(t.slice(r, r + 1));
  return n ? (e.w = +n[0], r + n[0].length) : -1;
}
function JD(e, t, r) {
  var n = xt.exec(t.slice(r, r + 1));
  return n ? (e.u = +n[0], r + n[0].length) : -1;
}
function eL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.U = +n[0], r + n[0].length) : -1;
}
function tL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.V = +n[0], r + n[0].length) : -1;
}
function rL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.W = +n[0], r + n[0].length) : -1;
}
function xO(e, t, r) {
  var n = xt.exec(t.slice(r, r + 4));
  return n ? (e.y = +n[0], r + n[0].length) : -1;
}
function wO(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), r + n[0].length) : -1;
}
function nL(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), r + n[0].length) : -1;
}
function iL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 1));
  return n ? (e.q = n[0] * 3 - 3, r + n[0].length) : -1;
}
function aL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.m = n[0] - 1, r + n[0].length) : -1;
}
function SO(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.d = +n[0], r + n[0].length) : -1;
}
function oL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 3));
  return n ? (e.m = 0, e.d = +n[0], r + n[0].length) : -1;
}
function _O(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.H = +n[0], r + n[0].length) : -1;
}
function uL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.M = +n[0], r + n[0].length) : -1;
}
function lL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 2));
  return n ? (e.S = +n[0], r + n[0].length) : -1;
}
function sL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 3));
  return n ? (e.L = +n[0], r + n[0].length) : -1;
}
function cL(e, t, r) {
  var n = xt.exec(t.slice(r, r + 6));
  return n ? (e.L = Math.floor(n[0] / 1e3), r + n[0].length) : -1;
}
function fL(e, t, r) {
  var n = XD.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function dL(e, t, r) {
  var n = xt.exec(t.slice(r));
  return n ? (e.Q = +n[0], r + n[0].length) : -1;
}
function pL(e, t, r) {
  var n = xt.exec(t.slice(r));
  return n ? (e.s = +n[0], r + n[0].length) : -1;
}
function OO(e, t) {
  return $e(e.getDate(), t, 2);
}
function hL(e, t) {
  return $e(e.getHours(), t, 2);
}
function vL(e, t) {
  return $e(e.getHours() % 12 || 12, t, 2);
}
function yL(e, t) {
  return $e(1 + zu.count(fn(e), e), t, 3);
}
function gT(e, t) {
  return $e(e.getMilliseconds(), t, 3);
}
function mL(e, t) {
  return gT(e, t) + "000";
}
function gL(e, t) {
  return $e(e.getMonth() + 1, t, 2);
}
function bL(e, t) {
  return $e(e.getMinutes(), t, 2);
}
function xL(e, t) {
  return $e(e.getSeconds(), t, 2);
}
function wL(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function SL(e, t) {
  return $e(Pc.count(fn(e) - 1, e), t, 2);
}
function bT(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? ga(e) : ga.ceil(e);
}
function _L(e, t) {
  return e = bT(e), $e(ga.count(fn(e), e) + (fn(e).getDay() === 4), t, 2);
}
function OL(e) {
  return e.getDay();
}
function PL(e, t) {
  return $e(Ms.count(fn(e) - 1, e), t, 2);
}
function AL(e, t) {
  return $e(e.getFullYear() % 100, t, 2);
}
function EL(e, t) {
  return e = bT(e), $e(e.getFullYear() % 100, t, 2);
}
function TL(e, t) {
  return $e(e.getFullYear() % 1e4, t, 4);
}
function CL(e, t) {
  var r = e.getDay();
  return e = r >= 4 || r === 0 ? ga(e) : ga.ceil(e), $e(e.getFullYear() % 1e4, t, 4);
}
function kL(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : (t *= -1, "+")) + $e(t / 60 | 0, "0", 2) + $e(t % 60, "0", 2);
}
function PO(e, t) {
  return $e(e.getUTCDate(), t, 2);
}
function jL(e, t) {
  return $e(e.getUTCHours(), t, 2);
}
function ML(e, t) {
  return $e(e.getUTCHours() % 12 || 12, t, 2);
}
function IL(e, t) {
  return $e(1 + Oc.count(dn(e), e), t, 3);
}
function xT(e, t) {
  return $e(e.getUTCMilliseconds(), t, 3);
}
function $L(e, t) {
  return xT(e, t) + "000";
}
function NL(e, t) {
  return $e(e.getUTCMonth() + 1, t, 2);
}
function RL(e, t) {
  return $e(e.getUTCMinutes(), t, 2);
}
function DL(e, t) {
  return $e(e.getUTCSeconds(), t, 2);
}
function LL(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function qL(e, t) {
  return $e(Ac.count(dn(e) - 1, e), t, 2);
}
function wT(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? ba(e) : ba.ceil(e);
}
function BL(e, t) {
  return e = wT(e), $e(ba.count(dn(e), e) + (dn(e).getUTCDay() === 4), t, 2);
}
function zL(e) {
  return e.getUTCDay();
}
function FL(e, t) {
  return $e(Is.count(dn(e) - 1, e), t, 2);
}
function UL(e, t) {
  return $e(e.getUTCFullYear() % 100, t, 2);
}
function WL(e, t) {
  return e = wT(e), $e(e.getUTCFullYear() % 100, t, 2);
}
function HL(e, t) {
  return $e(e.getUTCFullYear() % 1e4, t, 4);
}
function KL(e, t) {
  var r = e.getUTCDay();
  return e = r >= 4 || r === 0 ? ba(e) : ba.ceil(e), $e(e.getUTCFullYear() % 1e4, t, 4);
}
function GL() {
  return "+0000";
}
function AO() {
  return "%";
}
function EO(e) {
  return +e;
}
function TO(e) {
  return Math.floor(+e / 1e3);
}
var na, ST, _T;
VL({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});
function VL(e) {
  return na = VD(e), ST = na.format, na.parse, _T = na.utcFormat, na.utcParse, na;
}
function XL(e) {
  return new Date(e);
}
function YL(e) {
  return e instanceof Date ? +e : +/* @__PURE__ */ new Date(+e);
}
function Kg(e, t, r, n, a, u, l, c, f, d) {
  var v = Mg(), h = v.invert, m = v.domain, x = d(".%L"), S = d(":%S"), w = d("%I:%M"), b = d("%I %p"), P = d("%a %d"), C = d("%b %d"), A = d("%B"), T = d("%Y");
  function _(O) {
    return (f(O) < O ? x : c(O) < O ? S : l(O) < O ? w : u(O) < O ? b : n(O) < O ? a(O) < O ? P : C : r(O) < O ? A : T)(O);
  }
  return v.invert = function(O) {
    return new Date(h(O));
  }, v.domain = function(O) {
    return arguments.length ? m(Array.from(O, YL)) : m().map(XL);
  }, v.ticks = function(O) {
    var k = m();
    return e(k[0], k[k.length - 1], O ?? 10);
  }, v.tickFormat = function(O, k) {
    return k == null ? _ : d(k);
  }, v.nice = function(O) {
    var k = m();
    return (!O || typeof O.range != "function") && (O = t(k[0], k[k.length - 1], O ?? 10)), O ? m(sT(k, O)) : v;
  }, v.copy = function() {
    return Bu(v, Kg(e, t, r, n, a, u, l, c, f, d));
  }, v;
}
function QL() {
  return pr.apply(Kg(KD, GD, fn, Wg, Pc, zu, Fg, Bg, pi, ST).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments);
}
function ZL() {
  return pr.apply(Kg(WD, HD, dn, Hg, Ac, Oc, Ug, zg, pi, _T).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments);
}
function Ec() {
  var e = 0, t = 1, r, n, a, u, l = $t, c = !1, f;
  function d(h) {
    return h == null || isNaN(h = +h) ? f : l(a === 0 ? 0.5 : (h = (u(h) - r) * a, c ? Math.max(0, Math.min(1, h)) : h));
  }
  d.domain = function(h) {
    return arguments.length ? ([e, t] = h, r = u(e = +e), n = u(t = +t), a = r === n ? 0 : 1 / (n - r), d) : [e, t];
  }, d.clamp = function(h) {
    return arguments.length ? (c = !!h, d) : c;
  }, d.interpolator = function(h) {
    return arguments.length ? (l = h, d) : l;
  };
  function v(h) {
    return function(m) {
      var x, S;
      return arguments.length ? ([x, S] = m, l = h(x, S), d) : [l(0), l(1)];
    };
  }
  return d.range = v(Fa), d.rangeRound = v(jg), d.unknown = function(h) {
    return arguments.length ? (f = h, d) : f;
  }, function(h) {
    return u = h, r = h(e), n = h(t), a = r === n ? 0 : 1 / (n - r), d;
  };
}
function Gn(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function OT() {
  var e = Kn(Ec()($t));
  return e.copy = function() {
    return Gn(e, OT());
  }, yn.apply(e, arguments);
}
function PT() {
  var e = Ng(Ec()).domain([1, 10]);
  return e.copy = function() {
    return Gn(e, PT()).base(e.base());
  }, yn.apply(e, arguments);
}
function AT() {
  var e = Rg(Ec());
  return e.copy = function() {
    return Gn(e, AT()).constant(e.constant());
  }, yn.apply(e, arguments);
}
function Gg() {
  var e = Dg(Ec());
  return e.copy = function() {
    return Gn(e, Gg()).exponent(e.exponent());
  }, yn.apply(e, arguments);
}
function JL() {
  return Gg.apply(null, arguments).exponent(0.5);
}
function ET() {
  var e = [], t = $t;
  function r(n) {
    if (n != null && !isNaN(n = +n)) return t((Lu(e, n, 1) - 1) / (e.length - 1));
  }
  return r.domain = function(n) {
    if (!arguments.length) return e.slice();
    e = [];
    for (let a of n) a != null && !isNaN(a = +a) && e.push(a);
    return e.sort(Fn), r;
  }, r.interpolator = function(n) {
    return arguments.length ? (t = n, r) : t;
  }, r.range = function() {
    return e.map((n, a) => t(a / (e.length - 1)));
  }, r.quantiles = function(n) {
    return Array.from({ length: n + 1 }, (a, u) => qR(e, u / n));
  }, r.copy = function() {
    return ET(t).domain(e);
  }, yn.apply(r, arguments);
}
function Tc() {
  var e = 0, t = 0.5, r = 1, n = 1, a, u, l, c, f, d = $t, v, h = !1, m;
  function x(w) {
    return isNaN(w = +w) ? m : (w = 0.5 + ((w = +v(w)) - u) * (n * w < n * u ? c : f), d(h ? Math.max(0, Math.min(1, w)) : w));
  }
  x.domain = function(w) {
    return arguments.length ? ([e, t, r] = w, a = v(e = +e), u = v(t = +t), l = v(r = +r), c = a === u ? 0 : 0.5 / (u - a), f = u === l ? 0 : 0.5 / (l - u), n = u < a ? -1 : 1, x) : [e, t, r];
  }, x.clamp = function(w) {
    return arguments.length ? (h = !!w, x) : h;
  }, x.interpolator = function(w) {
    return arguments.length ? (d = w, x) : d;
  };
  function S(w) {
    return function(b) {
      var P, C, A;
      return arguments.length ? ([P, C, A] = b, d = fD(w, [P, C, A]), x) : [d(0), d(0.5), d(1)];
    };
  }
  return x.range = S(Fa), x.rangeRound = S(jg), x.unknown = function(w) {
    return arguments.length ? (m = w, x) : m;
  }, function(w) {
    return v = w, a = w(e), u = w(t), l = w(r), c = a === u ? 0 : 0.5 / (u - a), f = u === l ? 0 : 0.5 / (l - u), n = u < a ? -1 : 1, x;
  };
}
function TT() {
  var e = Kn(Tc()($t));
  return e.copy = function() {
    return Gn(e, TT());
  }, yn.apply(e, arguments);
}
function CT() {
  var e = Ng(Tc()).domain([0.1, 1, 10]);
  return e.copy = function() {
    return Gn(e, CT()).base(e.base());
  }, yn.apply(e, arguments);
}
function kT() {
  var e = Rg(Tc());
  return e.copy = function() {
    return Gn(e, kT()).constant(e.constant());
  }, yn.apply(e, arguments);
}
function Vg() {
  var e = Dg(Tc());
  return e.copy = function() {
    return Gn(e, Vg()).exponent(e.exponent());
  }, yn.apply(e, arguments);
}
function eq() {
  return Vg.apply(null, arguments).exponent(0.5);
}
const CO = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  scaleBand: lu,
  scaleDiverging: TT,
  scaleDivergingLog: CT,
  scaleDivergingPow: Vg,
  scaleDivergingSqrt: eq,
  scaleDivergingSymlog: kT,
  scaleIdentity: lT,
  scaleImplicit: um,
  scaleLinear: ks,
  scaleLog: cT,
  scaleOrdinal: Tg,
  scalePoint: Vo,
  scalePow: Lg,
  scaleQuantile: pT,
  scaleQuantize: hT,
  scaleRadial: dT,
  scaleSequential: OT,
  scaleSequentialLog: PT,
  scaleSequentialPow: Gg,
  scaleSequentialQuantile: ET,
  scaleSequentialSqrt: JL,
  scaleSequentialSymlog: AT,
  scaleSqrt: $D,
  scaleSymlog: fT,
  scaleThreshold: vT,
  scaleTime: QL,
  scaleUtc: ZL,
  tickFormat: uT
}, Symbol.toStringTag, { value: "Module" }));
var Jv, kO;
function jT() {
  if (kO) return Jv;
  kO = 1;
  var e = La();
  function t(r, n, a) {
    for (var u = -1, l = r.length; ++u < l; ) {
      var c = r[u], f = n(c);
      if (f != null && (d === void 0 ? f === f && !e(f) : a(f, d)))
        var d = f, v = c;
    }
    return v;
  }
  return Jv = t, Jv;
}
var ey, jO;
function tq() {
  if (jO) return ey;
  jO = 1;
  function e(t, r) {
    return t > r;
  }
  return ey = e, ey;
}
var ty, MO;
function rq() {
  if (MO) return ty;
  MO = 1;
  var e = jT(), t = tq(), r = za();
  function n(a) {
    return a && a.length ? e(a, r, t) : void 0;
  }
  return ty = n, ty;
}
var nq = rq();
const qn = /* @__PURE__ */ Fe(nq);
var ry, IO;
function iq() {
  if (IO) return ry;
  IO = 1;
  function e(t, r) {
    return t < r;
  }
  return ry = e, ry;
}
var ny, $O;
function aq() {
  if ($O) return ny;
  $O = 1;
  var e = jT(), t = iq(), r = za();
  function n(a) {
    return a && a.length ? e(a, r, t) : void 0;
  }
  return ny = n, ny;
}
var oq = aq();
const Cc = /* @__PURE__ */ Fe(oq);
var iy, NO;
function uq() {
  if (NO) return iy;
  NO = 1;
  var e = cg(), t = Wn(), r = BE(), n = Wt();
  function a(u, l) {
    var c = n(u) ? e : r;
    return c(u, t(l, 3));
  }
  return iy = a, iy;
}
var ay, RO;
function lq() {
  if (RO) return ay;
  RO = 1;
  var e = LE(), t = uq();
  function r(n, a) {
    return e(t(n, a), 1);
  }
  return ay = r, ay;
}
var sq = lq();
const cq = /* @__PURE__ */ Fe(sq);
var oy, DO;
function fq() {
  if (DO) return oy;
  DO = 1;
  var e = Sg();
  function t(r, n) {
    return e(r, n);
  }
  return oy = t, oy;
}
var dq = fq();
const wi = /* @__PURE__ */ Fe(dq);
var Ua = 1e9, pq = {
  // These values must be integers within the stated ranges (inclusive).
  // Most of these values can be changed during run-time using `Decimal.config`.
  // The maximum number of significant digits of the result of a calculation or base conversion.
  // E.g. `Decimal.config({ precision: 20 });`
  precision: 20,
  // 1 to MAX_DIGITS
  // The rounding mode used by default by `toInteger`, `toDecimalPlaces`, `toExponential`,
  // `toFixed`, `toPrecision` and `toSignificantDigits`.
  //
  // ROUND_UP         0 Away from zero.
  // ROUND_DOWN       1 Towards zero.
  // ROUND_CEIL       2 Towards +Infinity.
  // ROUND_FLOOR      3 Towards -Infinity.
  // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
  // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
  // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
  // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
  // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
  //
  // E.g.
  // `Decimal.rounding = 4;`
  // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
  rounding: 4,
  // 0 to 8
  // The exponent value at and beneath which `toString` returns exponential notation.
  // JavaScript numbers: -7
  toExpNeg: -7,
  // 0 to -MAX_E
  // The exponent value at and above which `toString` returns exponential notation.
  // JavaScript numbers: 21
  toExpPos: 21,
  // 0 to MAX_E
  // The natural logarithm of 10.
  // 115 digits
  LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
}, Yg, Xe = !0, dr = "[DecimalError] ", mi = dr + "Invalid argument: ", Xg = dr + "Exponent out of range: ", Wa = Math.floor, ci = Math.pow, hq = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Jt, bt = 1e7, Ge = 7, MT = 9007199254740991, $s = Wa(MT / Ge), fe = {};
fe.absoluteValue = fe.abs = function() {
  var e = new this.constructor(this);
  return e.s && (e.s = 1), e;
};
fe.comparedTo = fe.cmp = function(e) {
  var t, r, n, a, u = this;
  if (e = new u.constructor(e), u.s !== e.s) return u.s || -e.s;
  if (u.e !== e.e) return u.e > e.e ^ u.s < 0 ? 1 : -1;
  for (n = u.d.length, a = e.d.length, t = 0, r = n < a ? n : a; t < r; ++t)
    if (u.d[t] !== e.d[t]) return u.d[t] > e.d[t] ^ u.s < 0 ? 1 : -1;
  return n === a ? 0 : n > a ^ u.s < 0 ? 1 : -1;
};
fe.decimalPlaces = fe.dp = function() {
  var e = this, t = e.d.length - 1, r = (t - e.e) * Ge;
  if (t = e.d[t], t) for (; t % 10 == 0; t /= 10) r--;
  return r < 0 ? 0 : r;
};
fe.dividedBy = fe.div = function(e) {
  return sn(this, new this.constructor(e));
};
fe.dividedToIntegerBy = fe.idiv = function(e) {
  var t = this, r = t.constructor;
  return ze(sn(t, new r(e), 0, 1), r.precision);
};
fe.equals = fe.eq = function(e) {
  return !this.cmp(e);
};
fe.exponent = function() {
  return ut(this);
};
fe.greaterThan = fe.gt = function(e) {
  return this.cmp(e) > 0;
};
fe.greaterThanOrEqualTo = fe.gte = function(e) {
  return this.cmp(e) >= 0;
};
fe.isInteger = fe.isint = function() {
  return this.e > this.d.length - 2;
};
fe.isNegative = fe.isneg = function() {
  return this.s < 0;
};
fe.isPositive = fe.ispos = function() {
  return this.s > 0;
};
fe.isZero = function() {
  return this.s === 0;
};
fe.lessThan = fe.lt = function(e) {
  return this.cmp(e) < 0;
};
fe.lessThanOrEqualTo = fe.lte = function(e) {
  return this.cmp(e) < 1;
};
fe.logarithm = fe.log = function(e) {
  var t, r = this, n = r.constructor, a = n.precision, u = a + 5;
  if (e === void 0)
    e = new n(10);
  else if (e = new n(e), e.s < 1 || e.eq(Jt)) throw Error(dr + "NaN");
  if (r.s < 1) throw Error(dr + (r.s ? "NaN" : "-Infinity"));
  return r.eq(Jt) ? new n(0) : (Xe = !1, t = sn(pu(r, u), pu(e, u), u), Xe = !0, ze(t, a));
};
fe.minus = fe.sub = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? NT(t, e) : IT(t, (e.s = -e.s, e));
};
fe.modulo = fe.mod = function(e) {
  var t, r = this, n = r.constructor, a = n.precision;
  if (e = new n(e), !e.s) throw Error(dr + "NaN");
  return r.s ? (Xe = !1, t = sn(r, e, 0, 1).times(e), Xe = !0, r.minus(t)) : ze(new n(r), a);
};
fe.naturalExponential = fe.exp = function() {
  return $T(this);
};
fe.naturalLogarithm = fe.ln = function() {
  return pu(this);
};
fe.negated = fe.neg = function() {
  var e = new this.constructor(this);
  return e.s = -e.s || 0, e;
};
fe.plus = fe.add = function(e) {
  var t = this;
  return e = new t.constructor(e), t.s == e.s ? IT(t, e) : NT(t, (e.s = -e.s, e));
};
fe.precision = fe.sd = function(e) {
  var t, r, n, a = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(mi + e);
  if (t = ut(a) + 1, n = a.d.length - 1, r = n * Ge + 1, n = a.d[n], n) {
    for (; n % 10 == 0; n /= 10) r--;
    for (n = a.d[0]; n >= 10; n /= 10) r++;
  }
  return e && t > r ? t : r;
};
fe.squareRoot = fe.sqrt = function() {
  var e, t, r, n, a, u, l, c = this, f = c.constructor;
  if (c.s < 1) {
    if (!c.s) return new f(0);
    throw Error(dr + "NaN");
  }
  for (e = ut(c), Xe = !1, a = Math.sqrt(+c), a == 0 || a == 1 / 0 ? (t = Lr(c.d), (t.length + e) % 2 == 0 && (t += "0"), a = Math.sqrt(t), e = Wa((e + 1) / 2) - (e < 0 || e % 2), a == 1 / 0 ? t = "5e" + e : (t = a.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + e), n = new f(t)) : n = new f(a.toString()), r = f.precision, a = l = r + 3; ; )
    if (u = n, n = u.plus(sn(c, u, l + 2)).times(0.5), Lr(u.d).slice(0, l) === (t = Lr(n.d)).slice(0, l)) {
      if (t = t.slice(l - 3, l + 1), a == l && t == "4999") {
        if (ze(u, r + 1, 0), u.times(u).eq(c)) {
          n = u;
          break;
        }
      } else if (t != "9999")
        break;
      l += 4;
    }
  return Xe = !0, ze(n, r);
};
fe.times = fe.mul = function(e) {
  var t, r, n, a, u, l, c, f, d, v = this, h = v.constructor, m = v.d, x = (e = new h(e)).d;
  if (!v.s || !e.s) return new h(0);
  for (e.s *= v.s, r = v.e + e.e, f = m.length, d = x.length, f < d && (u = m, m = x, x = u, l = f, f = d, d = l), u = [], l = f + d, n = l; n--; ) u.push(0);
  for (n = d; --n >= 0; ) {
    for (t = 0, a = f + n; a > n; )
      c = u[a] + x[n] * m[a - n - 1] + t, u[a--] = c % bt | 0, t = c / bt | 0;
    u[a] = (u[a] + t) % bt | 0;
  }
  for (; !u[--l]; ) u.pop();
  return t ? ++r : u.shift(), e.d = u, e.e = r, Xe ? ze(e, h.precision) : e;
};
fe.toDecimalPlaces = fe.todp = function(e, t) {
  var r = this, n = r.constructor;
  return r = new n(r), e === void 0 ? r : (Hr(e, 0, Ua), t === void 0 ? t = n.rounding : Hr(t, 0, 8), ze(r, e + ut(r) + 1, t));
};
fe.toExponential = function(e, t) {
  var r, n = this, a = n.constructor;
  return e === void 0 ? r = Si(n, !0) : (Hr(e, 0, Ua), t === void 0 ? t = a.rounding : Hr(t, 0, 8), n = ze(new a(n), e + 1, t), r = Si(n, !0, e + 1)), r;
};
fe.toFixed = function(e, t) {
  var r, n, a = this, u = a.constructor;
  return e === void 0 ? Si(a) : (Hr(e, 0, Ua), t === void 0 ? t = u.rounding : Hr(t, 0, 8), n = ze(new u(a), e + ut(a) + 1, t), r = Si(n.abs(), !1, e + ut(n) + 1), a.isneg() && !a.isZero() ? "-" + r : r);
};
fe.toInteger = fe.toint = function() {
  var e = this, t = e.constructor;
  return ze(new t(e), ut(e) + 1, t.rounding);
};
fe.toNumber = function() {
  return +this;
};
fe.toPower = fe.pow = function(e) {
  var t, r, n, a, u, l, c = this, f = c.constructor, d = 12, v = +(e = new f(e));
  if (!e.s) return new f(Jt);
  if (c = new f(c), !c.s) {
    if (e.s < 1) throw Error(dr + "Infinity");
    return c;
  }
  if (c.eq(Jt)) return c;
  if (n = f.precision, e.eq(Jt)) return ze(c, n);
  if (t = e.e, r = e.d.length - 1, l = t >= r, u = c.s, l) {
    if ((r = v < 0 ? -v : v) <= MT) {
      for (a = new f(Jt), t = Math.ceil(n / Ge + 4), Xe = !1; r % 2 && (a = a.times(c), qO(a.d, t)), r = Wa(r / 2), r !== 0; )
        c = c.times(c), qO(c.d, t);
      return Xe = !0, e.s < 0 ? new f(Jt).div(a) : ze(a, n);
    }
  } else if (u < 0) throw Error(dr + "NaN");
  return u = u < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1, c.s = 1, Xe = !1, a = e.times(pu(c, n + d)), Xe = !0, a = $T(a), a.s = u, a;
};
fe.toPrecision = function(e, t) {
  var r, n, a = this, u = a.constructor;
  return e === void 0 ? (r = ut(a), n = Si(a, r <= u.toExpNeg || r >= u.toExpPos)) : (Hr(e, 1, Ua), t === void 0 ? t = u.rounding : Hr(t, 0, 8), a = ze(new u(a), e, t), r = ut(a), n = Si(a, e <= r || r <= u.toExpNeg, e)), n;
};
fe.toSignificantDigits = fe.tosd = function(e, t) {
  var r = this, n = r.constructor;
  return e === void 0 ? (e = n.precision, t = n.rounding) : (Hr(e, 1, Ua), t === void 0 ? t = n.rounding : Hr(t, 0, 8)), ze(new n(r), e, t);
};
fe.toString = fe.valueOf = fe.val = fe.toJSON = fe[Symbol.for("nodejs.util.inspect.custom")] = function() {
  var e = this, t = ut(e), r = e.constructor;
  return Si(e, t <= r.toExpNeg || t >= r.toExpPos);
};
function IT(e, t) {
  var r, n, a, u, l, c, f, d, v = e.constructor, h = v.precision;
  if (!e.s || !t.s)
    return t.s || (t = new v(e)), Xe ? ze(t, h) : t;
  if (f = e.d, d = t.d, l = e.e, a = t.e, f = f.slice(), u = l - a, u) {
    for (u < 0 ? (n = f, u = -u, c = d.length) : (n = d, a = l, c = f.length), l = Math.ceil(h / Ge), c = l > c ? l + 1 : c + 1, u > c && (u = c, n.length = 1), n.reverse(); u--; ) n.push(0);
    n.reverse();
  }
  for (c = f.length, u = d.length, c - u < 0 && (u = c, n = d, d = f, f = n), r = 0; u; )
    r = (f[--u] = f[u] + d[u] + r) / bt | 0, f[u] %= bt;
  for (r && (f.unshift(r), ++a), c = f.length; f[--c] == 0; ) f.pop();
  return t.d = f, t.e = a, Xe ? ze(t, h) : t;
}
function Hr(e, t, r) {
  if (e !== ~~e || e < t || e > r)
    throw Error(mi + e);
}
function Lr(e) {
  var t, r, n, a = e.length - 1, u = "", l = e[0];
  if (a > 0) {
    for (u += l, t = 1; t < a; t++)
      n = e[t] + "", r = Ge - n.length, r && (u += Dn(r)), u += n;
    l = e[t], n = l + "", r = Ge - n.length, r && (u += Dn(r));
  } else if (l === 0)
    return "0";
  for (; l % 10 === 0; ) l /= 10;
  return u + l;
}
var sn = /* @__PURE__ */ (function() {
  function e(n, a) {
    var u, l = 0, c = n.length;
    for (n = n.slice(); c--; )
      u = n[c] * a + l, n[c] = u % bt | 0, l = u / bt | 0;
    return l && n.unshift(l), n;
  }
  function t(n, a, u, l) {
    var c, f;
    if (u != l)
      f = u > l ? 1 : -1;
    else
      for (c = f = 0; c < u; c++)
        if (n[c] != a[c]) {
          f = n[c] > a[c] ? 1 : -1;
          break;
        }
    return f;
  }
  function r(n, a, u) {
    for (var l = 0; u--; )
      n[u] -= l, l = n[u] < a[u] ? 1 : 0, n[u] = l * bt + n[u] - a[u];
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function(n, a, u, l) {
    var c, f, d, v, h, m, x, S, w, b, P, C, A, T, _, O, k, M, N = n.constructor, W = n.s == a.s ? 1 : -1, R = n.d, q = a.d;
    if (!n.s) return new N(n);
    if (!a.s) throw Error(dr + "Division by zero");
    for (f = n.e - a.e, k = q.length, _ = R.length, x = new N(W), S = x.d = [], d = 0; q[d] == (R[d] || 0); ) ++d;
    if (q[d] > (R[d] || 0) && --f, u == null ? C = u = N.precision : l ? C = u + (ut(n) - ut(a)) + 1 : C = u, C < 0) return new N(0);
    if (C = C / Ge + 2 | 0, d = 0, k == 1)
      for (v = 0, q = q[0], C++; (d < _ || v) && C--; d++)
        A = v * bt + (R[d] || 0), S[d] = A / q | 0, v = A % q | 0;
    else {
      for (v = bt / (q[0] + 1) | 0, v > 1 && (q = e(q, v), R = e(R, v), k = q.length, _ = R.length), T = k, w = R.slice(0, k), b = w.length; b < k; ) w[b++] = 0;
      M = q.slice(), M.unshift(0), O = q[0], q[1] >= bt / 2 && ++O;
      do
        v = 0, c = t(q, w, k, b), c < 0 ? (P = w[0], k != b && (P = P * bt + (w[1] || 0)), v = P / O | 0, v > 1 ? (v >= bt && (v = bt - 1), h = e(q, v), m = h.length, b = w.length, c = t(h, w, m, b), c == 1 && (v--, r(h, k < m ? M : q, m))) : (v == 0 && (c = v = 1), h = q.slice()), m = h.length, m < b && h.unshift(0), r(w, h, b), c == -1 && (b = w.length, c = t(q, w, k, b), c < 1 && (v++, r(w, k < b ? M : q, b))), b = w.length) : c === 0 && (v++, w = [0]), S[d++] = v, c && w[0] ? w[b++] = R[T] || 0 : (w = [R[T]], b = 1);
      while ((T++ < _ || w[0] !== void 0) && C--);
    }
    return S[0] || S.shift(), x.e = f, ze(x, l ? u + ut(x) + 1 : u);
  };
})();
function $T(e, t) {
  var r, n, a, u, l, c, f = 0, d = 0, v = e.constructor, h = v.precision;
  if (ut(e) > 16) throw Error(Xg + ut(e));
  if (!e.s) return new v(Jt);
  for (Xe = !1, c = h, l = new v(0.03125); e.abs().gte(0.1); )
    e = e.times(l), d += 5;
  for (n = Math.log(ci(2, d)) / Math.LN10 * 2 + 5 | 0, c += n, r = a = u = new v(Jt), v.precision = c; ; ) {
    if (a = ze(a.times(e), c), r = r.times(++f), l = u.plus(sn(a, r, c)), Lr(l.d).slice(0, c) === Lr(u.d).slice(0, c)) {
      for (; d--; ) u = ze(u.times(u), c);
      return v.precision = h, t == null ? (Xe = !0, ze(u, h)) : u;
    }
    u = l;
  }
}
function ut(e) {
  for (var t = e.e * Ge, r = e.d[0]; r >= 10; r /= 10) t++;
  return t;
}
function uy(e, t, r) {
  if (t > e.LN10.sd())
    throw Xe = !0, r && (e.precision = r), Error(dr + "LN10 precision limit exceeded");
  return ze(new e(e.LN10), t);
}
function Dn(e) {
  for (var t = ""; e--; ) t += "0";
  return t;
}
function pu(e, t) {
  var r, n, a, u, l, c, f, d, v, h = 1, m = 10, x = e, S = x.d, w = x.constructor, b = w.precision;
  if (x.s < 1) throw Error(dr + (x.s ? "NaN" : "-Infinity"));
  if (x.eq(Jt)) return new w(0);
  if (t == null ? (Xe = !1, d = b) : d = t, x.eq(10))
    return t == null && (Xe = !0), uy(w, d);
  if (d += m, w.precision = d, r = Lr(S), n = r.charAt(0), u = ut(x), Math.abs(u) < 15e14) {
    for (; n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; )
      x = x.times(e), r = Lr(x.d), n = r.charAt(0), h++;
    u = ut(x), n > 1 ? (x = new w("0." + r), u++) : x = new w(n + "." + r.slice(1));
  } else
    return f = uy(w, d + 2, b).times(u + ""), x = pu(new w(n + "." + r.slice(1)), d - m).plus(f), w.precision = b, t == null ? (Xe = !0, ze(x, b)) : x;
  for (c = l = x = sn(x.minus(Jt), x.plus(Jt), d), v = ze(x.times(x), d), a = 3; ; ) {
    if (l = ze(l.times(v), d), f = c.plus(sn(l, new w(a), d)), Lr(f.d).slice(0, d) === Lr(c.d).slice(0, d))
      return c = c.times(2), u !== 0 && (c = c.plus(uy(w, d + 2, b).times(u + ""))), c = sn(c, new w(h), d), w.precision = b, t == null ? (Xe = !0, ze(c, b)) : c;
    c = f, a += 2;
  }
}
function LO(e, t) {
  var r, n, a;
  for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; t.charCodeAt(n) === 48; ) ++n;
  for (a = t.length; t.charCodeAt(a - 1) === 48; ) --a;
  if (t = t.slice(n, a), t) {
    if (a -= n, r = r - n - 1, e.e = Wa(r / Ge), e.d = [], n = (r + 1) % Ge, r < 0 && (n += Ge), n < a) {
      for (n && e.d.push(+t.slice(0, n)), a -= Ge; n < a; ) e.d.push(+t.slice(n, n += Ge));
      t = t.slice(n), n = Ge - t.length;
    } else
      n -= a;
    for (; n--; ) t += "0";
    if (e.d.push(+t), Xe && (e.e > $s || e.e < -$s)) throw Error(Xg + r);
  } else
    e.s = 0, e.e = 0, e.d = [0];
  return e;
}
function ze(e, t, r) {
  var n, a, u, l, c, f, d, v, h = e.d;
  for (l = 1, u = h[0]; u >= 10; u /= 10) l++;
  if (n = t - l, n < 0)
    n += Ge, a = t, d = h[v = 0];
  else {
    if (v = Math.ceil((n + 1) / Ge), u = h.length, v >= u) return e;
    for (d = u = h[v], l = 1; u >= 10; u /= 10) l++;
    n %= Ge, a = n - Ge + l;
  }
  if (r !== void 0 && (u = ci(10, l - a - 1), c = d / u % 10 | 0, f = t < 0 || h[v + 1] !== void 0 || d % u, f = r < 4 ? (c || f) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : c > 5 || c == 5 && (r == 4 || f || r == 6 && // Check whether the digit to the left of the rounding digit is odd.
  (n > 0 ? a > 0 ? d / ci(10, l - a) : 0 : h[v - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !h[0])
    return f ? (u = ut(e), h.length = 1, t = t - u - 1, h[0] = ci(10, (Ge - t % Ge) % Ge), e.e = Wa(-t / Ge) || 0) : (h.length = 1, h[0] = e.e = e.s = 0), e;
  if (n == 0 ? (h.length = v, u = 1, v--) : (h.length = v + 1, u = ci(10, Ge - n), h[v] = a > 0 ? (d / ci(10, l - a) % ci(10, a) | 0) * u : 0), f)
    for (; ; )
      if (v == 0) {
        (h[0] += u) == bt && (h[0] = 1, ++e.e);
        break;
      } else {
        if (h[v] += u, h[v] != bt) break;
        h[v--] = 0, u = 1;
      }
  for (n = h.length; h[--n] === 0; ) h.pop();
  if (Xe && (e.e > $s || e.e < -$s))
    throw Error(Xg + ut(e));
  return e;
}
function NT(e, t) {
  var r, n, a, u, l, c, f, d, v, h, m = e.constructor, x = m.precision;
  if (!e.s || !t.s)
    return t.s ? t.s = -t.s : t = new m(e), Xe ? ze(t, x) : t;
  if (f = e.d, h = t.d, n = t.e, d = e.e, f = f.slice(), l = d - n, l) {
    for (v = l < 0, v ? (r = f, l = -l, c = h.length) : (r = h, n = d, c = f.length), a = Math.max(Math.ceil(x / Ge), c) + 2, l > a && (l = a, r.length = 1), r.reverse(), a = l; a--; ) r.push(0);
    r.reverse();
  } else {
    for (a = f.length, c = h.length, v = a < c, v && (c = a), a = 0; a < c; a++)
      if (f[a] != h[a]) {
        v = f[a] < h[a];
        break;
      }
    l = 0;
  }
  for (v && (r = f, f = h, h = r, t.s = -t.s), c = f.length, a = h.length - c; a > 0; --a) f[c++] = 0;
  for (a = h.length; a > l; ) {
    if (f[--a] < h[a]) {
      for (u = a; u && f[--u] === 0; ) f[u] = bt - 1;
      --f[u], f[a] += bt;
    }
    f[a] -= h[a];
  }
  for (; f[--c] === 0; ) f.pop();
  for (; f[0] === 0; f.shift()) --n;
  return f[0] ? (t.d = f, t.e = n, Xe ? ze(t, x) : t) : new m(0);
}
function Si(e, t, r) {
  var n, a = ut(e), u = Lr(e.d), l = u.length;
  return t ? (r && (n = r - l) > 0 ? u = u.charAt(0) + "." + u.slice(1) + Dn(n) : l > 1 && (u = u.charAt(0) + "." + u.slice(1)), u = u + (a < 0 ? "e" : "e+") + a) : a < 0 ? (u = "0." + Dn(-a - 1) + u, r && (n = r - l) > 0 && (u += Dn(n))) : a >= l ? (u += Dn(a + 1 - l), r && (n = r - a - 1) > 0 && (u = u + "." + Dn(n))) : ((n = a + 1) < l && (u = u.slice(0, n) + "." + u.slice(n)), r && (n = r - l) > 0 && (a + 1 === l && (u += "."), u += Dn(n))), e.s < 0 ? "-" + u : u;
}
function qO(e, t) {
  if (e.length > t)
    return e.length = t, !0;
}
function RT(e) {
  var t, r, n;
  function a(u) {
    var l = this;
    if (!(l instanceof a)) return new a(u);
    if (l.constructor = a, u instanceof a) {
      l.s = u.s, l.e = u.e, l.d = (u = u.d) ? u.slice() : u;
      return;
    }
    if (typeof u == "number") {
      if (u * 0 !== 0)
        throw Error(mi + u);
      if (u > 0)
        l.s = 1;
      else if (u < 0)
        u = -u, l.s = -1;
      else {
        l.s = 0, l.e = 0, l.d = [0];
        return;
      }
      if (u === ~~u && u < 1e7) {
        l.e = 0, l.d = [u];
        return;
      }
      return LO(l, u.toString());
    } else if (typeof u != "string")
      throw Error(mi + u);
    if (u.charCodeAt(0) === 45 ? (u = u.slice(1), l.s = -1) : l.s = 1, hq.test(u)) LO(l, u);
    else throw Error(mi + u);
  }
  if (a.prototype = fe, a.ROUND_UP = 0, a.ROUND_DOWN = 1, a.ROUND_CEIL = 2, a.ROUND_FLOOR = 3, a.ROUND_HALF_UP = 4, a.ROUND_HALF_DOWN = 5, a.ROUND_HALF_EVEN = 6, a.ROUND_HALF_CEIL = 7, a.ROUND_HALF_FLOOR = 8, a.clone = RT, a.config = a.set = vq, e === void 0 && (e = {}), e)
    for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length; ) e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
  return a.config(e), a;
}
function vq(e) {
  if (!e || typeof e != "object")
    throw Error(dr + "Object expected");
  var t, r, n, a = [
    "precision",
    1,
    Ua,
    "rounding",
    0,
    8,
    "toExpNeg",
    -1 / 0,
    0,
    "toExpPos",
    0,
    1 / 0
  ];
  for (t = 0; t < a.length; t += 3)
    if ((n = e[r = a[t]]) !== void 0)
      if (Wa(n) === n && n >= a[t + 1] && n <= a[t + 2]) this[r] = n;
      else throw Error(mi + r + ": " + n);
  if ((n = e[r = "LN10"]) !== void 0)
    if (n == Math.LN10) this[r] = new this(n);
    else throw Error(mi + r + ": " + n);
  return this;
}
var Yg = RT(pq);
Jt = new Yg(1);
const qe = Yg;
function yq(e) {
  return xq(e) || bq(e) || gq(e) || mq();
}
function mq() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function gq(e, t) {
  if (e) {
    if (typeof e == "string") return fm(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return fm(e, t);
  }
}
function bq(e) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(e)) return Array.from(e);
}
function xq(e) {
  if (Array.isArray(e)) return fm(e);
}
function fm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++)
    n[r] = e[r];
  return n;
}
var wq = function(t) {
  return t;
}, DT = {}, LT = function(t) {
  return t === DT;
}, BO = function(t) {
  return function r() {
    return arguments.length === 0 || arguments.length === 1 && LT(arguments.length <= 0 ? void 0 : arguments[0]) ? r : t.apply(void 0, arguments);
  };
}, Sq = function e(t, r) {
  return t === 1 ? r : BO(function() {
    for (var n = arguments.length, a = new Array(n), u = 0; u < n; u++)
      a[u] = arguments[u];
    var l = a.filter(function(c) {
      return c !== DT;
    }).length;
    return l >= t ? r.apply(void 0, a) : e(t - l, BO(function() {
      for (var c = arguments.length, f = new Array(c), d = 0; d < c; d++)
        f[d] = arguments[d];
      var v = a.map(function(h) {
        return LT(h) ? f.shift() : h;
      });
      return r.apply(void 0, yq(v).concat(f));
    }));
  });
}, kc = function(t) {
  return Sq(t.length, t);
}, dm = function(t, r) {
  for (var n = [], a = t; a < r; ++a)
    n[a - t] = a;
  return n;
}, _q = kc(function(e, t) {
  return Array.isArray(t) ? t.map(e) : Object.keys(t).map(function(r) {
    return t[r];
  }).map(e);
}), Oq = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  if (!r.length)
    return wq;
  var a = r.reverse(), u = a[0], l = a.slice(1);
  return function() {
    return l.reduce(function(c, f) {
      return f(c);
    }, u.apply(void 0, arguments));
  };
}, pm = function(t) {
  return Array.isArray(t) ? t.reverse() : t.split("").reverse.join("");
}, qT = function(t) {
  var r = null, n = null;
  return function() {
    for (var a = arguments.length, u = new Array(a), l = 0; l < a; l++)
      u[l] = arguments[l];
    return r && u.every(function(c, f) {
      return c === r[f];
    }) || (r = u, n = t.apply(void 0, u)), n;
  };
};
function Pq(e) {
  var t;
  return e === 0 ? t = 1 : t = Math.floor(new qe(e).abs().log(10).toNumber()) + 1, t;
}
function Aq(e, t, r) {
  for (var n = new qe(e), a = 0, u = []; n.lt(t) && a < 1e5; )
    u.push(n.toNumber()), n = n.add(r), a++;
  return u;
}
var Eq = kc(function(e, t, r) {
  var n = +e, a = +t;
  return n + r * (a - n);
}), Tq = kc(function(e, t, r) {
  var n = t - +e;
  return n = n || 1 / 0, (r - e) / n;
}), Cq = kc(function(e, t, r) {
  var n = t - +e;
  return n = n || 1 / 0, Math.max(0, Math.min(1, (r - e) / n));
});
const jc = {
  rangeStep: Aq,
  getDigitCount: Pq,
  interpolateNumber: Eq,
  uninterpolateNumber: Tq,
  uninterpolateTruncation: Cq
};
function hm(e) {
  return Mq(e) || jq(e) || BT(e) || kq();
}
function kq() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function jq(e) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(e)) return Array.from(e);
}
function Mq(e) {
  if (Array.isArray(e)) return vm(e);
}
function hu(e, t) {
  return Nq(e) || $q(e, t) || BT(e, t) || Iq();
}
function Iq() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function BT(e, t) {
  if (e) {
    if (typeof e == "string") return vm(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return vm(e, t);
  }
}
function vm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++)
    n[r] = e[r];
  return n;
}
function $q(e, t) {
  if (!(typeof Symbol > "u" || !(Symbol.iterator in Object(e)))) {
    var r = [], n = !0, a = !1, u = void 0;
    try {
      for (var l = e[Symbol.iterator](), c; !(n = (c = l.next()).done) && (r.push(c.value), !(t && r.length === t)); n = !0)
        ;
    } catch (f) {
      a = !0, u = f;
    } finally {
      try {
        !n && l.return != null && l.return();
      } finally {
        if (a) throw u;
      }
    }
    return r;
  }
}
function Nq(e) {
  if (Array.isArray(e)) return e;
}
function zT(e) {
  var t = hu(e, 2), r = t[0], n = t[1], a = r, u = n;
  return r > n && (a = n, u = r), [a, u];
}
function FT(e, t, r) {
  if (e.lte(0))
    return new qe(0);
  var n = jc.getDigitCount(e.toNumber()), a = new qe(10).pow(n), u = e.div(a), l = n !== 1 ? 0.05 : 0.1, c = new qe(Math.ceil(u.div(l).toNumber())).add(r).mul(l), f = c.mul(a);
  return t ? f : new qe(Math.ceil(f));
}
function Rq(e, t, r) {
  var n = 1, a = new qe(e);
  if (!a.isint() && r) {
    var u = Math.abs(e);
    u < 1 ? (n = new qe(10).pow(jc.getDigitCount(e) - 1), a = new qe(Math.floor(a.div(n).toNumber())).mul(n)) : u > 1 && (a = new qe(Math.floor(e)));
  } else e === 0 ? a = new qe(Math.floor((t - 1) / 2)) : r || (a = new qe(Math.floor(e)));
  var l = Math.floor((t - 1) / 2), c = Oq(_q(function(f) {
    return a.add(new qe(f - l).mul(n)).toNumber();
  }), dm);
  return c(0, t);
}
function UT(e, t, r, n) {
  var a = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
  if (!Number.isFinite((t - e) / (r - 1)))
    return {
      step: new qe(0),
      tickMin: new qe(0),
      tickMax: new qe(0)
    };
  var u = FT(new qe(t).sub(e).div(r - 1), n, a), l;
  e <= 0 && t >= 0 ? l = new qe(0) : (l = new qe(e).add(t).div(2), l = l.sub(new qe(l).mod(u)));
  var c = Math.ceil(l.sub(e).div(u).toNumber()), f = Math.ceil(new qe(t).sub(l).div(u).toNumber()), d = c + f + 1;
  return d > r ? UT(e, t, r, n, a + 1) : (d < r && (f = t > 0 ? f + (r - d) : f, c = t > 0 ? c : c + (r - d)), {
    step: u,
    tickMin: l.sub(new qe(c).mul(u)),
    tickMax: l.add(new qe(f).mul(u))
  });
}
function Dq(e) {
  var t = hu(e, 2), r = t[0], n = t[1], a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, l = Math.max(a, 2), c = zT([r, n]), f = hu(c, 2), d = f[0], v = f[1];
  if (d === -1 / 0 || v === 1 / 0) {
    var h = v === 1 / 0 ? [d].concat(hm(dm(0, a - 1).map(function() {
      return 1 / 0;
    }))) : [].concat(hm(dm(0, a - 1).map(function() {
      return -1 / 0;
    })), [v]);
    return r > n ? pm(h) : h;
  }
  if (d === v)
    return Rq(d, a, u);
  var m = UT(d, v, l, u), x = m.step, S = m.tickMin, w = m.tickMax, b = jc.rangeStep(S, w.add(new qe(0.1).mul(x)), x);
  return r > n ? pm(b) : b;
}
function Lq(e, t) {
  var r = hu(e, 2), n = r[0], a = r[1], u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0, l = zT([n, a]), c = hu(l, 2), f = c[0], d = c[1];
  if (f === -1 / 0 || d === 1 / 0)
    return [n, a];
  if (f === d)
    return [f];
  var v = Math.max(t, 2), h = FT(new qe(d).sub(f).div(v - 1), u, 0), m = [].concat(hm(jc.rangeStep(new qe(f), new qe(d).sub(new qe(0.99).mul(h)), h)), [d]);
  return n > a ? pm(m) : m;
}
var qq = qT(Dq), Bq = qT(Lq), zq = "Invariant failed";
function _i(e, t) {
  throw new Error(zq);
}
var Fq = ["offset", "layout", "width", "dataKey", "data", "dataPointFormatter", "xAxis", "yAxis"];
function xa(e) {
  "@babel/helpers - typeof";
  return xa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, xa(e);
}
function Ns() {
  return Ns = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ns.apply(this, arguments);
}
function Uq(e, t) {
  return Gq(e) || Kq(e, t) || Hq(e, t) || Wq();
}
function Wq() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Hq(e, t) {
  if (e) {
    if (typeof e == "string") return zO(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return zO(e, t);
  }
}
function zO(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Kq(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function Gq(e) {
  if (Array.isArray(e)) return e;
}
function Vq(e, t) {
  if (e == null) return {};
  var r = Xq(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function Xq(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Yq(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Qq(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, KT(n.key), n);
  }
}
function Zq(e, t, r) {
  return t && Qq(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Jq(e, t, r) {
  return t = Rs(t), eB(e, WT() ? Reflect.construct(t, r || [], Rs(e).constructor) : t.apply(e, r));
}
function eB(e, t) {
  if (t && (xa(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return tB(e);
}
function tB(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function WT() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (WT = function() {
    return !!e;
  })();
}
function Rs(e) {
  return Rs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Rs(e);
}
function rB(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && ym(e, t);
}
function ym(e, t) {
  return ym = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, ym(e, t);
}
function HT(e, t, r) {
  return t = KT(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function KT(e) {
  var t = nB(e, "string");
  return xa(t) == "symbol" ? t : t + "";
}
function nB(e, t) {
  if (xa(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (xa(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Ha = /* @__PURE__ */ (function(e) {
  function t() {
    return Yq(this, t), Jq(this, t, arguments);
  }
  return rB(t, e), Zq(t, [{
    key: "render",
    value: function() {
      var n = this.props, a = n.offset, u = n.layout, l = n.width, c = n.dataKey, f = n.data, d = n.dataPointFormatter, v = n.xAxis, h = n.yAxis, m = Vq(n, Fq), x = Ae(m, !1);
      this.props.direction === "x" && v.type !== "number" && _i();
      var S = f.map(function(w) {
        var b = d(w, c), P = b.x, C = b.y, A = b.value, T = b.errorVal;
        if (!T)
          return null;
        var _ = [], O, k;
        if (Array.isArray(T)) {
          var M = Uq(T, 2);
          O = M[0], k = M[1];
        } else
          O = k = T;
        if (u === "vertical") {
          var N = v.scale, W = C + a, R = W + l, q = W - l, F = N(A - O), X = N(A + k);
          _.push({
            x1: X,
            y1: R,
            x2: X,
            y2: q
          }), _.push({
            x1: F,
            y1: W,
            x2: X,
            y2: W
          }), _.push({
            x1: F,
            y1: R,
            x2: F,
            y2: q
          });
        } else if (u === "horizontal") {
          var G = h.scale, Y = P + a, ee = Y - l, H = Y + l, Q = G(A - O), J = G(A + k);
          _.push({
            x1: ee,
            y1: J,
            x2: H,
            y2: J
          }), _.push({
            x1: Y,
            y1: Q,
            x2: Y,
            y2: J
          }), _.push({
            x1: ee,
            y1: Q,
            x2: H,
            y2: Q
          });
        }
        return /* @__PURE__ */ $.createElement(Ne, Ns({
          className: "recharts-errorBar",
          key: "bar-".concat(_.map(function(I) {
            return "".concat(I.x1, "-").concat(I.x2, "-").concat(I.y1, "-").concat(I.y2);
          }))
        }, x), _.map(function(I) {
          return /* @__PURE__ */ $.createElement("line", Ns({}, I, {
            key: "line-".concat(I.x1, "-").concat(I.x2, "-").concat(I.y1, "-").concat(I.y2)
          }));
        }));
      });
      return /* @__PURE__ */ $.createElement(Ne, {
        className: "recharts-errorBars"
      }, S);
    }
  }]);
})($.Component);
HT(Ha, "defaultProps", {
  stroke: "black",
  strokeWidth: 1.5,
  width: 5,
  offset: 0,
  layout: "horizontal"
});
HT(Ha, "displayName", "ErrorBar");
function vu(e) {
  "@babel/helpers - typeof";
  return vu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, vu(e);
}
function FO(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function li(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? FO(Object(r), !0).forEach(function(n) {
      iB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : FO(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function iB(e, t, r) {
  return t = aB(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function aB(e) {
  var t = oB(e, "string");
  return vu(t) == "symbol" ? t : t + "";
}
function oB(e, t) {
  if (vu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (vu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var GT = function(t) {
  var r = t.children, n = t.formattedGraphicalItems, a = t.legendWidth, u = t.legendContent, l = Qt(r, Dr);
  if (!l)
    return null;
  var c = Dr.defaultProps, f = c !== void 0 ? li(li({}, c), l.props) : {}, d;
  return l.props && l.props.payload ? d = l.props && l.props.payload : u === "children" ? d = (n || []).reduce(function(v, h) {
    var m = h.item, x = h.props, S = x.sectors || x.data || [];
    return v.concat(S.map(function(w) {
      return {
        type: l.props.iconType || m.props.legendType,
        value: w.name,
        color: w.fill,
        payload: w
      };
    }));
  }, []) : d = (n || []).map(function(v) {
    var h = v.item, m = h.type.defaultProps, x = m !== void 0 ? li(li({}, m), h.props) : {}, S = x.dataKey, w = x.name, b = x.legendType, P = x.hide;
    return {
      inactive: P,
      dataKey: S,
      type: f.iconType || b || "square",
      color: Qg(h),
      value: w || S,
      // @ts-expect-error property strokeDasharray is required in Payload but optional in props
      payload: x
    };
  }), li(li(li({}, f), Dr.getWithHeight(l, a)), {}, {
    payload: d,
    item: l
  });
};
function yu(e) {
  "@babel/helpers - typeof";
  return yu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, yu(e);
}
function UO(e) {
  return cB(e) || sB(e) || lB(e) || uB();
}
function uB() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lB(e, t) {
  if (e) {
    if (typeof e == "string") return mm(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return mm(e, t);
  }
}
function sB(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function cB(e) {
  if (Array.isArray(e)) return mm(e);
}
function mm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function WO(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function tt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? WO(Object(r), !0).forEach(function(n) {
      fa(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : WO(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function fa(e, t, r) {
  return t = fB(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function fB(e) {
  var t = dB(e, "string");
  return yu(t) == "symbol" ? t : t + "";
}
function dB(e, t) {
  if (yu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (yu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function pt(e, t, r) {
  return _e(e) || _e(t) ? r : dt(t) ? fr(e, t, r) : Ee(t) ? t(e) : r;
}
function Xo(e, t, r, n) {
  var a = cq(e, function(c) {
    return pt(c, t);
  });
  if (r === "number") {
    var u = a.filter(function(c) {
      return le(c) || parseFloat(c);
    });
    return u.length ? [Cc(u), qn(u)] : [1 / 0, -1 / 0];
  }
  var l = n ? a.filter(function(c) {
    return !_e(c);
  }) : a;
  return l.map(function(c) {
    return dt(c) || c instanceof Date ? c : "";
  });
}
var pB = function(t) {
  var r, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], a = arguments.length > 2 ? arguments[2] : void 0, u = arguments.length > 3 ? arguments[3] : void 0, l = -1, c = (r = n?.length) !== null && r !== void 0 ? r : 0;
  if (c <= 1)
    return 0;
  if (u && u.axisType === "angleAxis" && Math.abs(Math.abs(u.range[1] - u.range[0]) - 360) <= 1e-6)
    for (var f = u.range, d = 0; d < c; d++) {
      var v = d > 0 ? a[d - 1].coordinate : a[c - 1].coordinate, h = a[d].coordinate, m = d >= c - 1 ? a[0].coordinate : a[d + 1].coordinate, x = void 0;
      if (Er(h - v) !== Er(m - h)) {
        var S = [];
        if (Er(m - h) === Er(f[1] - f[0])) {
          x = m;
          var w = h + f[1] - f[0];
          S[0] = Math.min(w, (w + v) / 2), S[1] = Math.max(w, (w + v) / 2);
        } else {
          x = v;
          var b = m + f[1] - f[0];
          S[0] = Math.min(h, (b + h) / 2), S[1] = Math.max(h, (b + h) / 2);
        }
        var P = [Math.min(h, (x + h) / 2), Math.max(h, (x + h) / 2)];
        if (t > P[0] && t <= P[1] || t >= S[0] && t <= S[1]) {
          l = a[d].index;
          break;
        }
      } else {
        var C = Math.min(v, m), A = Math.max(v, m);
        if (t > (C + h) / 2 && t <= (A + h) / 2) {
          l = a[d].index;
          break;
        }
      }
    }
  else
    for (var T = 0; T < c; T++)
      if (T === 0 && t <= (n[T].coordinate + n[T + 1].coordinate) / 2 || T > 0 && T < c - 1 && t > (n[T].coordinate + n[T - 1].coordinate) / 2 && t <= (n[T].coordinate + n[T + 1].coordinate) / 2 || T === c - 1 && t > (n[T].coordinate + n[T - 1].coordinate) / 2) {
        l = n[T].index;
        break;
      }
  return l;
}, Qg = function(t) {
  var r, n = t, a = n.type.displayName, u = (r = t.type) !== null && r !== void 0 && r.defaultProps ? tt(tt({}, t.type.defaultProps), t.props) : t.props, l = u.stroke, c = u.fill, f;
  switch (a) {
    case "Line":
      f = l;
      break;
    case "Area":
    case "Radar":
      f = l && l !== "none" ? l : c;
      break;
    default:
      f = c;
      break;
  }
  return f;
}, hB = function(t) {
  var r = t.barSize, n = t.totalSize, a = t.stackGroups, u = a === void 0 ? {} : a;
  if (!u)
    return {};
  for (var l = {}, c = Object.keys(u), f = 0, d = c.length; f < d; f++)
    for (var v = u[c[f]].stackGroups, h = Object.keys(v), m = 0, x = h.length; m < x; m++) {
      var S = v[h[m]], w = S.items, b = S.cateAxisId, P = w.filter(function(k) {
        return un(k.type).indexOf("Bar") >= 0;
      });
      if (P && P.length) {
        var C = P[0].type.defaultProps, A = C !== void 0 ? tt(tt({}, C), P[0].props) : P[0].props, T = A.barSize, _ = A[b];
        l[_] || (l[_] = []);
        var O = _e(T) ? r : T;
        l[_].push({
          item: P[0],
          stackList: P.slice(1),
          barSize: _e(O) ? void 0 : xi(O, n, 0)
        });
      }
    }
  return l;
}, vB = function(t) {
  var r = t.barGap, n = t.barCategoryGap, a = t.bandSize, u = t.sizeList, l = u === void 0 ? [] : u, c = t.maxBarSize, f = l.length;
  if (f < 1) return null;
  var d = xi(r, a, 0, !0), v, h = [];
  if (l[0].barSize === +l[0].barSize) {
    var m = !1, x = a / f, S = l.reduce(function(T, _) {
      return T + _.barSize || 0;
    }, 0);
    S += (f - 1) * d, S >= a && (S -= (f - 1) * d, d = 0), S >= a && x > 0 && (m = !0, x *= 0.9, S = f * x);
    var w = (a - S) / 2 >> 0, b = {
      offset: w - d,
      size: 0
    };
    v = l.reduce(function(T, _) {
      var O = {
        item: _.item,
        position: {
          offset: b.offset + b.size + d,
          // @ts-expect-error the type check above does not check for type number explicitly
          size: m ? x : _.barSize
        }
      }, k = [].concat(UO(T), [O]);
      return b = k[k.length - 1].position, _.stackList && _.stackList.length && _.stackList.forEach(function(M) {
        k.push({
          item: M,
          position: b
        });
      }), k;
    }, h);
  } else {
    var P = xi(n, a, 0, !0);
    a - 2 * P - (f - 1) * d <= 0 && (d = 0);
    var C = (a - 2 * P - (f - 1) * d) / f;
    C > 1 && (C >>= 0);
    var A = c === +c ? Math.min(C, c) : C;
    v = l.reduce(function(T, _, O) {
      var k = [].concat(UO(T), [{
        item: _.item,
        position: {
          offset: P + (C + d) * O + (C - A) / 2,
          size: A
        }
      }]);
      return _.stackList && _.stackList.length && _.stackList.forEach(function(M) {
        k.push({
          item: M,
          position: k[k.length - 1].position
        });
      }), k;
    }, h);
  }
  return v;
}, yB = function(t, r, n, a) {
  var u = n.children, l = n.width, c = n.margin, f = l - (c.left || 0) - (c.right || 0), d = GT({
    children: u,
    legendWidth: f
  });
  if (d) {
    var v = a || {}, h = v.width, m = v.height, x = d.align, S = d.verticalAlign, w = d.layout;
    if ((w === "vertical" || w === "horizontal" && S === "middle") && x !== "center" && le(t[x]))
      return tt(tt({}, t), {}, fa({}, x, t[x] + (h || 0)));
    if ((w === "horizontal" || w === "vertical" && x === "center") && S !== "middle" && le(t[S]))
      return tt(tt({}, t), {}, fa({}, S, t[S] + (m || 0)));
  }
  return t;
}, mB = function(t, r, n) {
  return _e(r) ? !0 : t === "horizontal" ? r === "yAxis" : t === "vertical" || n === "x" ? r === "xAxis" : n === "y" ? r === "yAxis" : !0;
}, VT = function(t, r, n, a, u) {
  var l = r.props.children, c = Ut(l, Ha).filter(function(d) {
    return mB(a, u, d.props.direction);
  });
  if (c && c.length) {
    var f = c.map(function(d) {
      return d.props.dataKey;
    });
    return t.reduce(function(d, v) {
      var h = pt(v, n);
      if (_e(h)) return d;
      var m = Array.isArray(h) ? [Cc(h), qn(h)] : [h, h], x = f.reduce(function(S, w) {
        var b = pt(v, w, 0), P = m[0] - Math.abs(Array.isArray(b) ? b[0] : b), C = m[1] + Math.abs(Array.isArray(b) ? b[1] : b);
        return [Math.min(P, S[0]), Math.max(C, S[1])];
      }, [1 / 0, -1 / 0]);
      return [Math.min(x[0], d[0]), Math.max(x[1], d[1])];
    }, [1 / 0, -1 / 0]);
  }
  return null;
}, gB = function(t, r, n, a, u) {
  var l = r.map(function(c) {
    return VT(t, c, n, u, a);
  }).filter(function(c) {
    return !_e(c);
  });
  return l && l.length ? l.reduce(function(c, f) {
    return [Math.min(c[0], f[0]), Math.max(c[1], f[1])];
  }, [1 / 0, -1 / 0]) : null;
}, XT = function(t, r, n, a, u) {
  var l = r.map(function(f) {
    var d = f.props.dataKey;
    return n === "number" && d && VT(t, f, d, a) || Xo(t, d, n, u);
  });
  if (n === "number")
    return l.reduce(
      // @ts-expect-error if (type === number) means that the domain is numerical type
      // - but this link is missing in the type definition
      function(f, d) {
        return [Math.min(f[0], d[0]), Math.max(f[1], d[1])];
      },
      [1 / 0, -1 / 0]
    );
  var c = {};
  return l.reduce(function(f, d) {
    for (var v = 0, h = d.length; v < h; v++)
      c[d[v]] || (c[d[v]] = !0, f.push(d[v]));
    return f;
  }, []);
}, YT = function(t, r) {
  return t === "horizontal" && r === "xAxis" || t === "vertical" && r === "yAxis" || t === "centric" && r === "angleAxis" || t === "radial" && r === "radiusAxis";
}, QT = function(t, r, n, a) {
  if (a)
    return t.map(function(f) {
      return f.coordinate;
    });
  var u, l, c = t.map(function(f) {
    return f.coordinate === r && (u = !0), f.coordinate === n && (l = !0), f.coordinate;
  });
  return u || c.push(r), l || c.push(n), c;
}, on = function(t, r, n) {
  if (!t) return null;
  var a = t.scale, u = t.duplicateDomain, l = t.type, c = t.range, f = t.realScaleType === "scaleBand" ? a.bandwidth() / 2 : 2, d = (r || n) && l === "category" && a.bandwidth ? a.bandwidth() / f : 0;
  if (d = t.axisType === "angleAxis" && c?.length >= 2 ? Er(c[0] - c[1]) * 2 * d : d, r && (t.ticks || t.niceTicks)) {
    var v = (t.ticks || t.niceTicks).map(function(h) {
      var m = u ? u.indexOf(h) : h;
      return {
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: a(m) + d,
        value: h,
        offset: d
      };
    });
    return v.filter(function(h) {
      return !Ba(h.coordinate);
    });
  }
  return t.isCategorical && t.categoricalDomain ? t.categoricalDomain.map(function(h, m) {
    return {
      coordinate: a(h) + d,
      value: h,
      index: m,
      offset: d
    };
  }) : a.ticks && !n ? a.ticks(t.tickCount).map(function(h) {
    return {
      coordinate: a(h) + d,
      value: h,
      offset: d
    };
  }) : a.domain().map(function(h, m) {
    return {
      coordinate: a(h) + d,
      value: u ? u[h] : h,
      index: m,
      offset: d
    };
  });
}, ly = /* @__PURE__ */ new WeakMap(), as = function(t, r) {
  if (typeof r != "function")
    return t;
  ly.has(t) || ly.set(t, /* @__PURE__ */ new WeakMap());
  var n = ly.get(t);
  if (n.has(r))
    return n.get(r);
  var a = function() {
    t.apply(void 0, arguments), r.apply(void 0, arguments);
  };
  return n.set(r, a), a;
}, bB = function(t, r, n) {
  var a = t.scale, u = t.type, l = t.layout, c = t.axisType;
  if (a === "auto")
    return l === "radial" && c === "radiusAxis" ? {
      scale: lu(),
      realScaleType: "band"
    } : l === "radial" && c === "angleAxis" ? {
      scale: ks(),
      realScaleType: "linear"
    } : u === "category" && r && (r.indexOf("LineChart") >= 0 || r.indexOf("AreaChart") >= 0 || r.indexOf("ComposedChart") >= 0 && !n) ? {
      scale: Vo(),
      realScaleType: "point"
    } : u === "category" ? {
      scale: lu(),
      realScaleType: "band"
    } : {
      scale: ks(),
      realScaleType: "linear"
    };
  if (bi(a)) {
    var f = "scale".concat(vc(a));
    return {
      scale: (CO[f] || Vo)(),
      realScaleType: CO[f] ? f : "point"
    };
  }
  return Ee(a) ? {
    scale: a
  } : {
    scale: Vo(),
    realScaleType: "point"
  };
}, HO = 1e-4, xB = function(t) {
  var r = t.domain();
  if (!(!r || r.length <= 2)) {
    var n = r.length, a = t.range(), u = Math.min(a[0], a[1]) - HO, l = Math.max(a[0], a[1]) + HO, c = t(r[0]), f = t(r[n - 1]);
    (c < u || c > l || f < u || f > l) && t.domain([r[0], r[n - 1]]);
  }
}, wB = function(t, r) {
  if (!t)
    return null;
  for (var n = 0, a = t.length; n < a; n++)
    if (t[n].item === r)
      return t[n].position;
  return null;
}, SB = function(t, r) {
  if (!r || r.length !== 2 || !le(r[0]) || !le(r[1]))
    return t;
  var n = Math.min(r[0], r[1]), a = Math.max(r[0], r[1]), u = [t[0], t[1]];
  return (!le(t[0]) || t[0] < n) && (u[0] = n), (!le(t[1]) || t[1] > a) && (u[1] = a), u[0] > a && (u[0] = a), u[1] < n && (u[1] = n), u;
}, _B = function(t) {
  var r = t.length;
  if (!(r <= 0))
    for (var n = 0, a = t[0].length; n < a; ++n)
      for (var u = 0, l = 0, c = 0; c < r; ++c) {
        var f = Ba(t[c][n][1]) ? t[c][n][0] : t[c][n][1];
        f >= 0 ? (t[c][n][0] = u, t[c][n][1] = u + f, u = t[c][n][1]) : (t[c][n][0] = l, t[c][n][1] = l + f, l = t[c][n][1]);
      }
}, OB = function(t) {
  var r = t.length;
  if (!(r <= 0))
    for (var n = 0, a = t[0].length; n < a; ++n)
      for (var u = 0, l = 0; l < r; ++l) {
        var c = Ba(t[l][n][1]) ? t[l][n][0] : t[l][n][1];
        c >= 0 ? (t[l][n][0] = u, t[l][n][1] = u + c, u = t[l][n][1]) : (t[l][n][0] = 0, t[l][n][1] = 0);
      }
}, PB = {
  sign: _B,
  // @ts-expect-error definitelytyped types are incorrect
  expand: uI,
  // @ts-expect-error definitelytyped types are incorrect
  none: da,
  // @ts-expect-error definitelytyped types are incorrect
  silhouette: lI,
  // @ts-expect-error definitelytyped types are incorrect
  wiggle: sI,
  positive: OB
}, AB = function(t, r, n) {
  var a = r.map(function(c) {
    return c.props.dataKey;
  }), u = PB[n], l = oI().keys(a).value(function(c, f) {
    return +pt(c, f, 0);
  }).order(Gy).offset(u);
  return l(t);
}, EB = function(t, r, n, a, u, l) {
  if (!t)
    return null;
  var c = l ? r.reverse() : r, f = {}, d = c.reduce(function(h, m) {
    var x, S = (x = m.type) !== null && x !== void 0 && x.defaultProps ? tt(tt({}, m.type.defaultProps), m.props) : m.props, w = S.stackId, b = S.hide;
    if (b)
      return h;
    var P = S[n], C = h[P] || {
      hasStack: !1,
      stackGroups: {}
    };
    if (dt(w)) {
      var A = C.stackGroups[w] || {
        numericAxisId: n,
        cateAxisId: a,
        items: []
      };
      A.items.push(m), C.hasStack = !0, C.stackGroups[w] = A;
    } else
      C.stackGroups[Ei("_stackId_")] = {
        numericAxisId: n,
        cateAxisId: a,
        items: [m]
      };
    return tt(tt({}, h), {}, fa({}, P, C));
  }, f), v = {};
  return Object.keys(d).reduce(function(h, m) {
    var x = d[m];
    if (x.hasStack) {
      var S = {};
      x.stackGroups = Object.keys(x.stackGroups).reduce(function(w, b) {
        var P = x.stackGroups[b];
        return tt(tt({}, w), {}, fa({}, b, {
          numericAxisId: n,
          cateAxisId: a,
          items: P.items,
          stackedData: AB(t, P.items, u)
        }));
      }, S);
    }
    return tt(tt({}, h), {}, fa({}, m, x));
  }, v);
}, TB = function(t, r) {
  var n = r.realScaleType, a = r.type, u = r.tickCount, l = r.originalDomain, c = r.allowDecimals, f = n || r.scale;
  if (f !== "auto" && f !== "linear")
    return null;
  if (u && a === "number" && l && (l[0] === "auto" || l[1] === "auto")) {
    var d = t.domain();
    if (!d.length)
      return null;
    var v = qq(d, u, c);
    return t.domain([Cc(v), qn(v)]), {
      niceTicks: v
    };
  }
  if (u && a === "number") {
    var h = t.domain(), m = Bq(h, u, c);
    return {
      niceTicks: m
    };
  }
  return null;
};
function wa(e) {
  var t = e.axis, r = e.ticks, n = e.bandSize, a = e.entry, u = e.index, l = e.dataKey;
  if (t.type === "category") {
    if (!t.allowDuplicatedCategory && t.dataKey && !_e(a[t.dataKey])) {
      var c = fs(r, "value", a[t.dataKey]);
      if (c)
        return c.coordinate + n / 2;
    }
    return r[u] ? r[u].coordinate + n / 2 : null;
  }
  var f = pt(a, _e(l) ? t.dataKey : l);
  return _e(f) ? null : t.scale(f);
}
var KO = function(t) {
  var r = t.axis, n = t.ticks, a = t.offset, u = t.bandSize, l = t.entry, c = t.index;
  if (r.type === "category")
    return n[c] ? n[c].coordinate + a : null;
  var f = pt(l, r.dataKey, r.domain[c]);
  return _e(f) ? null : r.scale(f) - u / 2 + a;
}, CB = function(t) {
  var r = t.numericAxis, n = r.scale.domain();
  if (r.type === "number") {
    var a = Math.min(n[0], n[1]), u = Math.max(n[0], n[1]);
    return a <= 0 && u >= 0 ? 0 : u < 0 ? u : a;
  }
  return n[0];
}, kB = function(t, r) {
  var n, a = (n = t.type) !== null && n !== void 0 && n.defaultProps ? tt(tt({}, t.type.defaultProps), t.props) : t.props, u = a.stackId;
  if (dt(u)) {
    var l = r[u];
    if (l) {
      var c = l.items.indexOf(t);
      return c >= 0 ? l.stackedData[c] : null;
    }
  }
  return null;
}, jB = function(t) {
  return t.reduce(function(r, n) {
    return [Cc(n.concat([r[0]]).filter(le)), qn(n.concat([r[1]]).filter(le))];
  }, [1 / 0, -1 / 0]);
}, ZT = function(t, r, n) {
  return Object.keys(t).reduce(function(a, u) {
    var l = t[u], c = l.stackedData, f = c.reduce(function(d, v) {
      var h = jB(v.slice(r, n + 1));
      return [Math.min(d[0], h[0]), Math.max(d[1], h[1])];
    }, [1 / 0, -1 / 0]);
    return [Math.min(f[0], a[0]), Math.max(f[1], a[1])];
  }, [1 / 0, -1 / 0]).map(function(a) {
    return a === 1 / 0 || a === -1 / 0 ? 0 : a;
  });
}, GO = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, VO = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/, gm = function(t, r, n) {
  if (Ee(t))
    return t(r, n);
  if (!Array.isArray(t))
    return r;
  var a = [];
  if (le(t[0]))
    a[0] = n ? t[0] : Math.min(t[0], r[0]);
  else if (GO.test(t[0])) {
    var u = +GO.exec(t[0])[1];
    a[0] = r[0] - u;
  } else Ee(t[0]) ? a[0] = t[0](r[0]) : a[0] = r[0];
  if (le(t[1]))
    a[1] = n ? t[1] : Math.max(t[1], r[1]);
  else if (VO.test(t[1])) {
    var l = +VO.exec(t[1])[1];
    a[1] = r[1] + l;
  } else Ee(t[1]) ? a[1] = t[1](r[1]) : a[1] = r[1];
  return a;
}, Ds = function(t, r, n) {
  if (t && t.scale && t.scale.bandwidth) {
    var a = t.scale.bandwidth();
    if (!n || a > 0)
      return a;
  }
  if (t && r && r.length >= 2) {
    for (var u = Og(r, function(h) {
      return h.coordinate;
    }), l = 1 / 0, c = 1, f = u.length; c < f; c++) {
      var d = u[c], v = u[c - 1];
      l = Math.min((d.coordinate || 0) - (v.coordinate || 0), l);
    }
    return l === 1 / 0 ? 0 : l;
  }
  return n ? void 0 : 0;
}, XO = function(t, r, n) {
  return !t || !t.length || wi(t, fr(n, "type.defaultProps.domain")) ? r : t;
}, JT = function(t, r) {
  var n = t.type.defaultProps ? tt(tt({}, t.type.defaultProps), t.props) : t.props, a = n.dataKey, u = n.name, l = n.unit, c = n.formatter, f = n.tooltipType, d = n.chartType, v = n.hide;
  return tt(tt({}, Ae(t, !1)), {}, {
    dataKey: a,
    unit: l,
    formatter: c,
    name: u || a,
    color: Qg(t),
    value: pt(r, a),
    type: f,
    payload: r,
    chartType: d,
    hide: v
  });
};
function mu(e) {
  "@babel/helpers - typeof";
  return mu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, mu(e);
}
function YO(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function QO(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? YO(Object(r), !0).forEach(function(n) {
      MB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : YO(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function MB(e, t, r) {
  return t = IB(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function IB(e) {
  var t = $B(e, "string");
  return mu(t) == "symbol" ? t : t + "";
}
function $B(e, t) {
  if (mu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (mu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ls = Math.PI / 180, NB = function(t) {
  return t * 180 / Math.PI;
}, Ot = function(t, r, n, a) {
  return {
    x: t + Math.cos(-Ls * a) * n,
    y: r + Math.sin(-Ls * a) * n
  };
}, RB = function(t, r) {
  var n = t.x, a = t.y, u = r.x, l = r.y;
  return Math.sqrt(Math.pow(n - u, 2) + Math.pow(a - l, 2));
}, DB = function(t, r) {
  var n = t.x, a = t.y, u = r.cx, l = r.cy, c = RB({
    x: n,
    y: a
  }, {
    x: u,
    y: l
  });
  if (c <= 0)
    return {
      radius: c
    };
  var f = (n - u) / c, d = Math.acos(f);
  return a > l && (d = 2 * Math.PI - d), {
    radius: c,
    angle: NB(d),
    angleInRadian: d
  };
}, LB = function(t) {
  var r = t.startAngle, n = t.endAngle, a = Math.floor(r / 360), u = Math.floor(n / 360), l = Math.min(a, u);
  return {
    startAngle: r - l * 360,
    endAngle: n - l * 360
  };
}, qB = function(t, r) {
  var n = r.startAngle, a = r.endAngle, u = Math.floor(n / 360), l = Math.floor(a / 360), c = Math.min(u, l);
  return t + c * 360;
}, ZO = function(t, r) {
  var n = t.x, a = t.y, u = DB({
    x: n,
    y: a
  }, r), l = u.radius, c = u.angle, f = r.innerRadius, d = r.outerRadius;
  if (l < f || l > d)
    return !1;
  if (l === 0)
    return !0;
  var v = LB(r), h = v.startAngle, m = v.endAngle, x = c, S;
  if (h <= m) {
    for (; x > m; )
      x -= 360;
    for (; x < h; )
      x += 360;
    S = x >= h && x <= m;
  } else {
    for (; x > h; )
      x -= 360;
    for (; x < m; )
      x += 360;
    S = x >= m && x <= h;
  }
  return S ? QO(QO({}, r), {}, {
    radius: l,
    angle: qB(x, r)
  }) : null;
};
function gu(e) {
  "@babel/helpers - typeof";
  return gu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, gu(e);
}
var BB = ["offset"];
function zB(e) {
  return HB(e) || WB(e) || UB(e) || FB();
}
function FB() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function UB(e, t) {
  if (e) {
    if (typeof e == "string") return bm(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return bm(e, t);
  }
}
function WB(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function HB(e) {
  if (Array.isArray(e)) return bm(e);
}
function bm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function KB(e, t) {
  if (e == null) return {};
  var r = GB(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function GB(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function JO(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ft(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? JO(Object(r), !0).forEach(function(n) {
      VB(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : JO(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function VB(e, t, r) {
  return t = XB(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function XB(e) {
  var t = YB(e, "string");
  return gu(t) == "symbol" ? t : t + "";
}
function YB(e, t) {
  if (gu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (gu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function bu() {
  return bu = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, bu.apply(this, arguments);
}
var QB = function(t) {
  var r = t.value, n = t.formatter, a = _e(t.children) ? r : t.children;
  return Ee(n) ? n(a) : a;
}, ZB = function(t, r) {
  var n = Er(r - t), a = Math.min(Math.abs(r - t), 360);
  return n * a;
}, JB = function(t, r, n) {
  var a = t.position, u = t.viewBox, l = t.offset, c = t.className, f = u, d = f.cx, v = f.cy, h = f.innerRadius, m = f.outerRadius, x = f.startAngle, S = f.endAngle, w = f.clockWise, b = (h + m) / 2, P = ZB(x, S), C = P >= 0 ? 1 : -1, A, T;
  a === "insideStart" ? (A = x + C * l, T = w) : a === "insideEnd" ? (A = S - C * l, T = !w) : a === "end" && (A = S + C * l, T = w), T = P <= 0 ? T : !T;
  var _ = Ot(d, v, b, A), O = Ot(d, v, b, A + (T ? 1 : -1) * 359), k = "M".concat(_.x, ",").concat(_.y, `
    A`).concat(b, ",").concat(b, ",0,1,").concat(T ? 0 : 1, `,
    `).concat(O.x, ",").concat(O.y), M = _e(t.id) ? Ei("recharts-radial-line-") : t.id;
  return /* @__PURE__ */ $.createElement("text", bu({}, n, {
    dominantBaseline: "central",
    className: ke("recharts-radial-bar-label", c)
  }), /* @__PURE__ */ $.createElement("defs", null, /* @__PURE__ */ $.createElement("path", {
    id: M,
    d: k
  })), /* @__PURE__ */ $.createElement("textPath", {
    xlinkHref: "#".concat(M)
  }, r));
}, e3 = function(t) {
  var r = t.viewBox, n = t.offset, a = t.position, u = r, l = u.cx, c = u.cy, f = u.innerRadius, d = u.outerRadius, v = u.startAngle, h = u.endAngle, m = (v + h) / 2;
  if (a === "outside") {
    var x = Ot(l, c, d + n, m), S = x.x, w = x.y;
    return {
      x: S,
      y: w,
      textAnchor: S >= l ? "start" : "end",
      verticalAnchor: "middle"
    };
  }
  if (a === "center")
    return {
      x: l,
      y: c,
      textAnchor: "middle",
      verticalAnchor: "middle"
    };
  if (a === "centerTop")
    return {
      x: l,
      y: c,
      textAnchor: "middle",
      verticalAnchor: "start"
    };
  if (a === "centerBottom")
    return {
      x: l,
      y: c,
      textAnchor: "middle",
      verticalAnchor: "end"
    };
  var b = (f + d) / 2, P = Ot(l, c, b, m), C = P.x, A = P.y;
  return {
    x: C,
    y: A,
    textAnchor: "middle",
    verticalAnchor: "middle"
  };
}, t3 = function(t) {
  var r = t.viewBox, n = t.parentViewBox, a = t.offset, u = t.position, l = r, c = l.x, f = l.y, d = l.width, v = l.height, h = v >= 0 ? 1 : -1, m = h * a, x = h > 0 ? "end" : "start", S = h > 0 ? "start" : "end", w = d >= 0 ? 1 : -1, b = w * a, P = w > 0 ? "end" : "start", C = w > 0 ? "start" : "end";
  if (u === "top") {
    var A = {
      x: c + d / 2,
      y: f - h * a,
      textAnchor: "middle",
      verticalAnchor: x
    };
    return ft(ft({}, A), n ? {
      height: Math.max(f - n.y, 0),
      width: d
    } : {});
  }
  if (u === "bottom") {
    var T = {
      x: c + d / 2,
      y: f + v + m,
      textAnchor: "middle",
      verticalAnchor: S
    };
    return ft(ft({}, T), n ? {
      height: Math.max(n.y + n.height - (f + v), 0),
      width: d
    } : {});
  }
  if (u === "left") {
    var _ = {
      x: c - b,
      y: f + v / 2,
      textAnchor: P,
      verticalAnchor: "middle"
    };
    return ft(ft({}, _), n ? {
      width: Math.max(_.x - n.x, 0),
      height: v
    } : {});
  }
  if (u === "right") {
    var O = {
      x: c + d + b,
      y: f + v / 2,
      textAnchor: C,
      verticalAnchor: "middle"
    };
    return ft(ft({}, O), n ? {
      width: Math.max(n.x + n.width - O.x, 0),
      height: v
    } : {});
  }
  var k = n ? {
    width: d,
    height: v
  } : {};
  return u === "insideLeft" ? ft({
    x: c + b,
    y: f + v / 2,
    textAnchor: C,
    verticalAnchor: "middle"
  }, k) : u === "insideRight" ? ft({
    x: c + d - b,
    y: f + v / 2,
    textAnchor: P,
    verticalAnchor: "middle"
  }, k) : u === "insideTop" ? ft({
    x: c + d / 2,
    y: f + m,
    textAnchor: "middle",
    verticalAnchor: S
  }, k) : u === "insideBottom" ? ft({
    x: c + d / 2,
    y: f + v - m,
    textAnchor: "middle",
    verticalAnchor: x
  }, k) : u === "insideTopLeft" ? ft({
    x: c + b,
    y: f + m,
    textAnchor: C,
    verticalAnchor: S
  }, k) : u === "insideTopRight" ? ft({
    x: c + d - b,
    y: f + m,
    textAnchor: P,
    verticalAnchor: S
  }, k) : u === "insideBottomLeft" ? ft({
    x: c + b,
    y: f + v - m,
    textAnchor: C,
    verticalAnchor: x
  }, k) : u === "insideBottomRight" ? ft({
    x: c + d - b,
    y: f + v - m,
    textAnchor: P,
    verticalAnchor: x
  }, k) : qa(u) && (le(u.x) || fi(u.x)) && (le(u.y) || fi(u.y)) ? ft({
    x: c + xi(u.x, d),
    y: f + xi(u.y, v),
    textAnchor: "end",
    verticalAnchor: "end"
  }, k) : ft({
    x: c + d / 2,
    y: f + v / 2,
    textAnchor: "middle",
    verticalAnchor: "middle"
  }, k);
}, r3 = function(t) {
  return "cx" in t && le(t.cx);
};
function kt(e) {
  var t = e.offset, r = t === void 0 ? 5 : t, n = KB(e, BB), a = ft({
    offset: r
  }, n), u = a.viewBox, l = a.position, c = a.value, f = a.children, d = a.content, v = a.className, h = v === void 0 ? "" : v, m = a.textBreakAll;
  if (!u || _e(c) && _e(f) && !/* @__PURE__ */ V.isValidElement(d) && !Ee(d))
    return null;
  if (/* @__PURE__ */ V.isValidElement(d))
    return /* @__PURE__ */ V.cloneElement(d, a);
  var x;
  if (Ee(d)) {
    if (x = /* @__PURE__ */ V.createElement(d, a), /* @__PURE__ */ V.isValidElement(x))
      return x;
  } else
    x = QB(a);
  var S = r3(u), w = Ae(a, !0);
  if (S && (l === "insideStart" || l === "insideEnd" || l === "end"))
    return JB(a, x, w);
  var b = S ? e3(a) : t3(a);
  return /* @__PURE__ */ $.createElement(_s, bu({
    className: ke("recharts-label", h)
  }, w, b, {
    breakAll: m
  }), x);
}
kt.displayName = "Label";
var eC = function(t) {
  var r = t.cx, n = t.cy, a = t.angle, u = t.startAngle, l = t.endAngle, c = t.r, f = t.radius, d = t.innerRadius, v = t.outerRadius, h = t.x, m = t.y, x = t.top, S = t.left, w = t.width, b = t.height, P = t.clockWise, C = t.labelViewBox;
  if (C)
    return C;
  if (le(w) && le(b)) {
    if (le(h) && le(m))
      return {
        x: h,
        y: m,
        width: w,
        height: b
      };
    if (le(x) && le(S))
      return {
        x,
        y: S,
        width: w,
        height: b
      };
  }
  return le(h) && le(m) ? {
    x: h,
    y: m,
    width: 0,
    height: 0
  } : le(r) && le(n) ? {
    cx: r,
    cy: n,
    startAngle: u || a || 0,
    endAngle: l || a || 0,
    innerRadius: d || 0,
    outerRadius: v || f || c || 0,
    clockWise: P
  } : t.viewBox ? t.viewBox : {};
}, n3 = function(t, r) {
  return t ? t === !0 ? /* @__PURE__ */ $.createElement(kt, {
    key: "label-implicit",
    viewBox: r
  }) : dt(t) ? /* @__PURE__ */ $.createElement(kt, {
    key: "label-implicit",
    viewBox: r,
    value: t
  }) : /* @__PURE__ */ V.isValidElement(t) ? t.type === kt ? /* @__PURE__ */ V.cloneElement(t, {
    key: "label-implicit",
    viewBox: r
  }) : /* @__PURE__ */ $.createElement(kt, {
    key: "label-implicit",
    content: t,
    viewBox: r
  }) : Ee(t) ? /* @__PURE__ */ $.createElement(kt, {
    key: "label-implicit",
    content: t,
    viewBox: r
  }) : qa(t) ? /* @__PURE__ */ $.createElement(kt, bu({
    viewBox: r
  }, t, {
    key: "label-implicit"
  })) : null : null;
}, i3 = function(t, r) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  if (!t || !t.children && n && !t.label)
    return null;
  var a = t.children, u = eC(t), l = Ut(a, kt).map(function(f, d) {
    return /* @__PURE__ */ V.cloneElement(f, {
      viewBox: r || u,
      // eslint-disable-next-line react/no-array-index-key
      key: "label-".concat(d)
    });
  });
  if (!n)
    return l;
  var c = n3(t.label, r || u);
  return [c].concat(zB(l));
};
kt.parseViewBox = eC;
kt.renderCallByParent = i3;
var sy, eP;
function a3() {
  if (eP) return sy;
  eP = 1;
  function e(t) {
    var r = t == null ? 0 : t.length;
    return r ? t[r - 1] : void 0;
  }
  return sy = e, sy;
}
var o3 = a3();
const u3 = /* @__PURE__ */ Fe(o3);
function xu(e) {
  "@babel/helpers - typeof";
  return xu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, xu(e);
}
var l3 = ["valueAccessor"], s3 = ["data", "dataKey", "clockWise", "id", "textBreakAll"];
function c3(e) {
  return h3(e) || p3(e) || d3(e) || f3();
}
function f3() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function d3(e, t) {
  if (e) {
    if (typeof e == "string") return xm(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return xm(e, t);
  }
}
function p3(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function h3(e) {
  if (Array.isArray(e)) return xm(e);
}
function xm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function qs() {
  return qs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, qs.apply(this, arguments);
}
function tP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function rP(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? tP(Object(r), !0).forEach(function(n) {
      v3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : tP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function v3(e, t, r) {
  return t = y3(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function y3(e) {
  var t = m3(e, "string");
  return xu(t) == "symbol" ? t : t + "";
}
function m3(e, t) {
  if (xu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (xu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function nP(e, t) {
  if (e == null) return {};
  var r = g3(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function g3(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var b3 = function(t) {
  return Array.isArray(t.value) ? u3(t.value) : t.value;
};
function Ur(e) {
  var t = e.valueAccessor, r = t === void 0 ? b3 : t, n = nP(e, l3), a = n.data, u = n.dataKey, l = n.clockWise, c = n.id, f = n.textBreakAll, d = nP(n, s3);
  return !a || !a.length ? null : /* @__PURE__ */ $.createElement(Ne, {
    className: "recharts-label-list"
  }, a.map(function(v, h) {
    var m = _e(u) ? r(v, h) : pt(v && v.payload, u), x = _e(c) ? {} : {
      id: "".concat(c, "-").concat(h)
    };
    return /* @__PURE__ */ $.createElement(kt, qs({}, Ae(v, !0), d, x, {
      parentViewBox: v.parentViewBox,
      value: m,
      textBreakAll: f,
      viewBox: kt.parseViewBox(_e(l) ? v : rP(rP({}, v), {}, {
        clockWise: l
      })),
      key: "label-".concat(h),
      index: h
    }));
  }));
}
Ur.displayName = "LabelList";
function x3(e, t) {
  return e ? e === !0 ? /* @__PURE__ */ $.createElement(Ur, {
    key: "labelList-implicit",
    data: t
  }) : /* @__PURE__ */ $.isValidElement(e) || Ee(e) ? /* @__PURE__ */ $.createElement(Ur, {
    key: "labelList-implicit",
    data: t,
    content: e
  }) : qa(e) ? /* @__PURE__ */ $.createElement(Ur, qs({
    data: t
  }, e, {
    key: "labelList-implicit"
  })) : null : null;
}
function w3(e, t) {
  var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  if (!e || !e.children && r && !e.label)
    return null;
  var n = e.children, a = Ut(n, Ur).map(function(l, c) {
    return /* @__PURE__ */ V.cloneElement(l, {
      data: t,
      // eslint-disable-next-line react/no-array-index-key
      key: "labelList-".concat(c)
    });
  });
  if (!r)
    return a;
  var u = x3(e.label, t);
  return [u].concat(c3(a));
}
Ur.renderCallByParent = w3;
function wu(e) {
  "@babel/helpers - typeof";
  return wu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, wu(e);
}
function wm() {
  return wm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, wm.apply(this, arguments);
}
function iP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function aP(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? iP(Object(r), !0).forEach(function(n) {
      S3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : iP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function S3(e, t, r) {
  return t = _3(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function _3(e) {
  var t = O3(e, "string");
  return wu(t) == "symbol" ? t : t + "";
}
function O3(e, t) {
  if (wu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (wu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var P3 = function(t, r) {
  var n = Er(r - t), a = Math.min(Math.abs(r - t), 359.999);
  return n * a;
}, os = function(t) {
  var r = t.cx, n = t.cy, a = t.radius, u = t.angle, l = t.sign, c = t.isExternal, f = t.cornerRadius, d = t.cornerIsExternal, v = f * (c ? 1 : -1) + a, h = Math.asin(f / v) / Ls, m = d ? u : u + l * h, x = Ot(r, n, v, m), S = Ot(r, n, a, m), w = d ? u - l * h : u, b = Ot(r, n, v * Math.cos(h * Ls), w);
  return {
    center: x,
    circleTangency: S,
    lineTangency: b,
    theta: h
  };
}, tC = function(t) {
  var r = t.cx, n = t.cy, a = t.innerRadius, u = t.outerRadius, l = t.startAngle, c = t.endAngle, f = P3(l, c), d = l + f, v = Ot(r, n, u, l), h = Ot(r, n, u, d), m = "M ".concat(v.x, ",").concat(v.y, `
    A `).concat(u, ",").concat(u, `,0,
    `).concat(+(Math.abs(f) > 180), ",").concat(+(l > d), `,
    `).concat(h.x, ",").concat(h.y, `
  `);
  if (a > 0) {
    var x = Ot(r, n, a, l), S = Ot(r, n, a, d);
    m += "L ".concat(S.x, ",").concat(S.y, `
            A `).concat(a, ",").concat(a, `,0,
            `).concat(+(Math.abs(f) > 180), ",").concat(+(l <= d), `,
            `).concat(x.x, ",").concat(x.y, " Z");
  } else
    m += "L ".concat(r, ",").concat(n, " Z");
  return m;
}, A3 = function(t) {
  var r = t.cx, n = t.cy, a = t.innerRadius, u = t.outerRadius, l = t.cornerRadius, c = t.forceCornerRadius, f = t.cornerIsExternal, d = t.startAngle, v = t.endAngle, h = Er(v - d), m = os({
    cx: r,
    cy: n,
    radius: u,
    angle: d,
    sign: h,
    cornerRadius: l,
    cornerIsExternal: f
  }), x = m.circleTangency, S = m.lineTangency, w = m.theta, b = os({
    cx: r,
    cy: n,
    radius: u,
    angle: v,
    sign: -h,
    cornerRadius: l,
    cornerIsExternal: f
  }), P = b.circleTangency, C = b.lineTangency, A = b.theta, T = f ? Math.abs(d - v) : Math.abs(d - v) - w - A;
  if (T < 0)
    return c ? "M ".concat(S.x, ",").concat(S.y, `
        a`).concat(l, ",").concat(l, ",0,0,1,").concat(l * 2, `,0
        a`).concat(l, ",").concat(l, ",0,0,1,").concat(-l * 2, `,0
      `) : tC({
      cx: r,
      cy: n,
      innerRadius: a,
      outerRadius: u,
      startAngle: d,
      endAngle: v
    });
  var _ = "M ".concat(S.x, ",").concat(S.y, `
    A`).concat(l, ",").concat(l, ",0,0,").concat(+(h < 0), ",").concat(x.x, ",").concat(x.y, `
    A`).concat(u, ",").concat(u, ",0,").concat(+(T > 180), ",").concat(+(h < 0), ",").concat(P.x, ",").concat(P.y, `
    A`).concat(l, ",").concat(l, ",0,0,").concat(+(h < 0), ",").concat(C.x, ",").concat(C.y, `
  `);
  if (a > 0) {
    var O = os({
      cx: r,
      cy: n,
      radius: a,
      angle: d,
      sign: h,
      isExternal: !0,
      cornerRadius: l,
      cornerIsExternal: f
    }), k = O.circleTangency, M = O.lineTangency, N = O.theta, W = os({
      cx: r,
      cy: n,
      radius: a,
      angle: v,
      sign: -h,
      isExternal: !0,
      cornerRadius: l,
      cornerIsExternal: f
    }), R = W.circleTangency, q = W.lineTangency, F = W.theta, X = f ? Math.abs(d - v) : Math.abs(d - v) - N - F;
    if (X < 0 && l === 0)
      return "".concat(_, "L").concat(r, ",").concat(n, "Z");
    _ += "L".concat(q.x, ",").concat(q.y, `
      A`).concat(l, ",").concat(l, ",0,0,").concat(+(h < 0), ",").concat(R.x, ",").concat(R.y, `
      A`).concat(a, ",").concat(a, ",0,").concat(+(X > 180), ",").concat(+(h > 0), ",").concat(k.x, ",").concat(k.y, `
      A`).concat(l, ",").concat(l, ",0,0,").concat(+(h < 0), ",").concat(M.x, ",").concat(M.y, "Z");
  } else
    _ += "L".concat(r, ",").concat(n, "Z");
  return _;
}, E3 = {
  cx: 0,
  cy: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  cornerRadius: 0,
  forceCornerRadius: !1,
  cornerIsExternal: !1
}, rC = function(t) {
  var r = aP(aP({}, E3), t), n = r.cx, a = r.cy, u = r.innerRadius, l = r.outerRadius, c = r.cornerRadius, f = r.forceCornerRadius, d = r.cornerIsExternal, v = r.startAngle, h = r.endAngle, m = r.className;
  if (l < u || v === h)
    return null;
  var x = ke("recharts-sector", m), S = l - u, w = xi(c, S, 0, !0), b;
  return w > 0 && Math.abs(v - h) < 360 ? b = A3({
    cx: n,
    cy: a,
    innerRadius: u,
    outerRadius: l,
    cornerRadius: Math.min(w, S / 2),
    forceCornerRadius: f,
    cornerIsExternal: d,
    startAngle: v,
    endAngle: h
  }) : b = tC({
    cx: n,
    cy: a,
    innerRadius: u,
    outerRadius: l,
    startAngle: v,
    endAngle: h
  }), /* @__PURE__ */ $.createElement("path", wm({}, Ae(r, !0), {
    className: x,
    d: b,
    role: "img"
  }));
};
function Su(e) {
  "@babel/helpers - typeof";
  return Su = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Su(e);
}
function Sm() {
  return Sm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Sm.apply(this, arguments);
}
function oP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function uP(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? oP(Object(r), !0).forEach(function(n) {
      T3(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : oP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function T3(e, t, r) {
  return t = C3(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function C3(e) {
  var t = k3(e, "string");
  return Su(t) == "symbol" ? t : t + "";
}
function k3(e, t) {
  if (Su(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Su(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var lP = {
  curveBasisClosed: X2,
  curveBasisOpen: Y2,
  curveBasis: V2,
  curveBumpX: $2,
  curveBumpY: N2,
  curveLinearClosed: Q2,
  curveLinear: mc,
  curveMonotoneX: Z2,
  curveMonotoneY: J2,
  curveNatural: eI,
  curveStep: tI,
  curveStepAfter: nI,
  curveStepBefore: rI
}, us = function(t) {
  return t.x === +t.x && t.y === +t.y;
}, qo = function(t) {
  return t.x;
}, Bo = function(t) {
  return t.y;
}, j3 = function(t, r) {
  if (Ee(t))
    return t;
  var n = "curve".concat(vc(t));
  return (n === "curveMonotone" || n === "curveBump") && r ? lP["".concat(n).concat(r === "vertical" ? "Y" : "X")] : lP[n] || mc;
}, M3 = function(t) {
  var r = t.type, n = r === void 0 ? "linear" : r, a = t.points, u = a === void 0 ? [] : a, l = t.baseLine, c = t.layout, f = t.connectNulls, d = f === void 0 ? !1 : f, v = j3(n, c), h = d ? u.filter(function(w) {
    return us(w);
  }) : u, m;
  if (Array.isArray(l)) {
    var x = d ? l.filter(function(w) {
      return us(w);
    }) : l, S = h.map(function(w, b) {
      return uP(uP({}, w), {}, {
        base: x[b]
      });
    });
    return c === "vertical" ? m = Zl().y(Bo).x1(qo).x0(function(w) {
      return w.base.x;
    }) : m = Zl().x(qo).y1(Bo).y0(function(w) {
      return w.base.y;
    }), m.defined(us).curve(v), m(S);
  }
  return c === "vertical" && le(l) ? m = Zl().y(Bo).x1(qo).x0(l) : le(l) ? m = Zl().x(qo).y1(Bo).y0(l) : m = uE().x(qo).y(Bo), m.defined(us).curve(v), m(h);
}, gi = function(t) {
  var r = t.className, n = t.points, a = t.path, u = t.pathRef;
  if ((!n || !n.length) && !a)
    return null;
  var l = n && n.length ? M3(t) : a;
  return /* @__PURE__ */ V.createElement("path", Sm({}, Ae(t, !1), ds(t), {
    className: ke("recharts-curve", r),
    d: l,
    ref: u
  }));
}, cy = { exports: {} }, fy, sP;
function I3() {
  if (sP) return fy;
  sP = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return fy = e, fy;
}
var dy, cP;
function $3() {
  if (cP) return dy;
  cP = 1;
  var e = /* @__PURE__ */ I3();
  function t() {
  }
  function r() {
  }
  return r.resetWarningCache = t, dy = function() {
    function n(l, c, f, d, v, h) {
      if (h !== e) {
        var m = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw m.name = "Invariant Violation", m;
      }
    }
    n.isRequired = n;
    function a() {
      return n;
    }
    var u = {
      array: n,
      bigint: n,
      bool: n,
      func: n,
      number: n,
      object: n,
      string: n,
      symbol: n,
      any: n,
      arrayOf: a,
      element: n,
      elementType: n,
      instanceOf: a,
      node: n,
      objectOf: a,
      oneOf: a,
      oneOfType: a,
      shape: a,
      exact: a,
      checkPropTypes: r,
      resetWarningCache: t
    };
    return u.PropTypes = u, u;
  }, dy;
}
var fP;
function N3() {
  return fP || (fP = 1, cy.exports = /* @__PURE__ */ $3()()), cy.exports;
}
var R3 = /* @__PURE__ */ N3();
const De = /* @__PURE__ */ Fe(R3);
var D3 = Object.getOwnPropertyNames, L3 = Object.getOwnPropertySymbols, q3 = Object.prototype.hasOwnProperty;
function dP(e, t) {
  return function(n, a, u) {
    return e(n, a, u) && t(n, a, u);
  };
}
function ls(e) {
  return function(r, n, a) {
    if (!r || !n || typeof r != "object" || typeof n != "object")
      return e(r, n, a);
    var u = a.cache, l = u.get(r), c = u.get(n);
    if (l && c)
      return l === n && c === r;
    u.set(r, n), u.set(n, r);
    var f = e(r, n, a);
    return u.delete(r), u.delete(n), f;
  };
}
function B3(e) {
  return e?.[Symbol.toStringTag];
}
function pP(e) {
  return D3(e).concat(L3(e));
}
var z3 = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  Object.hasOwn || (function(e, t) {
    return q3.call(e, t);
  })
);
function ki(e, t) {
  return e === t || !e && !t && e !== e && t !== t;
}
var F3 = "__v", U3 = "__o", W3 = "_owner", hP = Object.getOwnPropertyDescriptor, vP = Object.keys;
function H3(e, t, r) {
  var n = e.length;
  if (t.length !== n)
    return !1;
  for (; n-- > 0; )
    if (!r.equals(e[n], t[n], n, n, e, t, r))
      return !1;
  return !0;
}
function K3(e, t) {
  return ki(e.getTime(), t.getTime());
}
function G3(e, t) {
  return e.name === t.name && e.message === t.message && e.cause === t.cause && e.stack === t.stack;
}
function V3(e, t) {
  return e === t;
}
function yP(e, t, r) {
  var n = e.size;
  if (n !== t.size)
    return !1;
  if (!n)
    return !0;
  for (var a = new Array(n), u = e.entries(), l, c, f = 0; (l = u.next()) && !l.done; ) {
    for (var d = t.entries(), v = !1, h = 0; (c = d.next()) && !c.done; ) {
      if (a[h]) {
        h++;
        continue;
      }
      var m = l.value, x = c.value;
      if (r.equals(m[0], x[0], f, h, e, t, r) && r.equals(m[1], x[1], m[0], x[0], e, t, r)) {
        v = a[h] = !0;
        break;
      }
      h++;
    }
    if (!v)
      return !1;
    f++;
  }
  return !0;
}
var X3 = ki;
function Y3(e, t, r) {
  var n = vP(e), a = n.length;
  if (vP(t).length !== a)
    return !1;
  for (; a-- > 0; )
    if (!nC(e, t, r, n[a]))
      return !1;
  return !0;
}
function zo(e, t, r) {
  var n = pP(e), a = n.length;
  if (pP(t).length !== a)
    return !1;
  for (var u, l, c; a-- > 0; )
    if (u = n[a], !nC(e, t, r, u) || (l = hP(e, u), c = hP(t, u), (l || c) && (!l || !c || l.configurable !== c.configurable || l.enumerable !== c.enumerable || l.writable !== c.writable)))
      return !1;
  return !0;
}
function Q3(e, t) {
  return ki(e.valueOf(), t.valueOf());
}
function Z3(e, t) {
  return e.source === t.source && e.flags === t.flags;
}
function mP(e, t, r) {
  var n = e.size;
  if (n !== t.size)
    return !1;
  if (!n)
    return !0;
  for (var a = new Array(n), u = e.values(), l, c; (l = u.next()) && !l.done; ) {
    for (var f = t.values(), d = !1, v = 0; (c = f.next()) && !c.done; ) {
      if (!a[v] && r.equals(l.value, c.value, l.value, c.value, e, t, r)) {
        d = a[v] = !0;
        break;
      }
      v++;
    }
    if (!d)
      return !1;
  }
  return !0;
}
function J3(e, t) {
  var r = e.length;
  if (t.length !== r)
    return !1;
  for (; r-- > 0; )
    if (e[r] !== t[r])
      return !1;
  return !0;
}
function ez(e, t) {
  return e.hostname === t.hostname && e.pathname === t.pathname && e.protocol === t.protocol && e.port === t.port && e.hash === t.hash && e.username === t.username && e.password === t.password;
}
function nC(e, t, r, n) {
  return (n === W3 || n === U3 || n === F3) && (e.$$typeof || t.$$typeof) ? !0 : z3(t, n) && r.equals(e[n], t[n], n, n, e, t, r);
}
var tz = "[object Arguments]", rz = "[object Boolean]", nz = "[object Date]", iz = "[object Error]", az = "[object Map]", oz = "[object Number]", uz = "[object Object]", lz = "[object RegExp]", sz = "[object Set]", cz = "[object String]", fz = "[object URL]", dz = Array.isArray, gP = typeof ArrayBuffer < "u" && typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView : null, bP = Object.assign, pz = Object.prototype.toString.call.bind(Object.prototype.toString);
function hz(e) {
  var t = e.areArraysEqual, r = e.areDatesEqual, n = e.areErrorsEqual, a = e.areFunctionsEqual, u = e.areMapsEqual, l = e.areNumbersEqual, c = e.areObjectsEqual, f = e.arePrimitiveWrappersEqual, d = e.areRegExpsEqual, v = e.areSetsEqual, h = e.areTypedArraysEqual, m = e.areUrlsEqual, x = e.unknownTagComparators;
  return function(w, b, P) {
    if (w === b)
      return !0;
    if (w == null || b == null)
      return !1;
    var C = typeof w;
    if (C !== typeof b)
      return !1;
    if (C !== "object")
      return C === "number" ? l(w, b, P) : C === "function" ? a(w, b, P) : !1;
    var A = w.constructor;
    if (A !== b.constructor)
      return !1;
    if (A === Object)
      return c(w, b, P);
    if (dz(w))
      return t(w, b, P);
    if (gP != null && gP(w))
      return h(w, b, P);
    if (A === Date)
      return r(w, b, P);
    if (A === RegExp)
      return d(w, b, P);
    if (A === Map)
      return u(w, b, P);
    if (A === Set)
      return v(w, b, P);
    var T = pz(w);
    if (T === nz)
      return r(w, b, P);
    if (T === lz)
      return d(w, b, P);
    if (T === az)
      return u(w, b, P);
    if (T === sz)
      return v(w, b, P);
    if (T === uz)
      return typeof w.then != "function" && typeof b.then != "function" && c(w, b, P);
    if (T === fz)
      return m(w, b, P);
    if (T === iz)
      return n(w, b, P);
    if (T === tz)
      return c(w, b, P);
    if (T === rz || T === oz || T === cz)
      return f(w, b, P);
    if (x) {
      var _ = x[T];
      if (!_) {
        var O = B3(w);
        O && (_ = x[O]);
      }
      if (_)
        return _(w, b, P);
    }
    return !1;
  };
}
function vz(e) {
  var t = e.circular, r = e.createCustomConfig, n = e.strict, a = {
    areArraysEqual: n ? zo : H3,
    areDatesEqual: K3,
    areErrorsEqual: G3,
    areFunctionsEqual: V3,
    areMapsEqual: n ? dP(yP, zo) : yP,
    areNumbersEqual: X3,
    areObjectsEqual: n ? zo : Y3,
    arePrimitiveWrappersEqual: Q3,
    areRegExpsEqual: Z3,
    areSetsEqual: n ? dP(mP, zo) : mP,
    areTypedArraysEqual: n ? zo : J3,
    areUrlsEqual: ez,
    unknownTagComparators: void 0
  };
  if (r && (a = bP({}, a, r(a))), t) {
    var u = ls(a.areArraysEqual), l = ls(a.areMapsEqual), c = ls(a.areObjectsEqual), f = ls(a.areSetsEqual);
    a = bP({}, a, {
      areArraysEqual: u,
      areMapsEqual: l,
      areObjectsEqual: c,
      areSetsEqual: f
    });
  }
  return a;
}
function yz(e) {
  return function(t, r, n, a, u, l, c) {
    return e(t, r, c);
  };
}
function mz(e) {
  var t = e.circular, r = e.comparator, n = e.createState, a = e.equals, u = e.strict;
  if (n)
    return function(f, d) {
      var v = n(), h = v.cache, m = h === void 0 ? t ? /* @__PURE__ */ new WeakMap() : void 0 : h, x = v.meta;
      return r(f, d, {
        cache: m,
        equals: a,
        meta: x,
        strict: u
      });
    };
  if (t)
    return function(f, d) {
      return r(f, d, {
        cache: /* @__PURE__ */ new WeakMap(),
        equals: a,
        meta: void 0,
        strict: u
      });
    };
  var l = {
    cache: void 0,
    equals: a,
    meta: void 0,
    strict: u
  };
  return function(f, d) {
    return r(f, d, l);
  };
}
var gz = Vn();
Vn({ strict: !0 });
Vn({ circular: !0 });
Vn({
  circular: !0,
  strict: !0
});
Vn({
  createInternalComparator: function() {
    return ki;
  }
});
Vn({
  strict: !0,
  createInternalComparator: function() {
    return ki;
  }
});
Vn({
  circular: !0,
  createInternalComparator: function() {
    return ki;
  }
});
Vn({
  circular: !0,
  createInternalComparator: function() {
    return ki;
  },
  strict: !0
});
function Vn(e) {
  e === void 0 && (e = {});
  var t = e.circular, r = t === void 0 ? !1 : t, n = e.createInternalComparator, a = e.createState, u = e.strict, l = u === void 0 ? !1 : u, c = vz(e), f = hz(c), d = n ? n(f) : yz(f);
  return mz({ circular: r, comparator: f, createState: a, equals: d, strict: l });
}
function bz(e) {
  typeof requestAnimationFrame < "u" && requestAnimationFrame(e);
}
function xP(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, r = -1, n = function a(u) {
    r < 0 && (r = u), u - r > t ? (e(u), r = -1) : bz(a);
  };
  requestAnimationFrame(n);
}
function _m(e) {
  "@babel/helpers - typeof";
  return _m = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _m(e);
}
function xz(e) {
  return Oz(e) || _z(e) || Sz(e) || wz();
}
function wz() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Sz(e, t) {
  if (e) {
    if (typeof e == "string") return wP(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return wP(e, t);
  }
}
function wP(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function _z(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Oz(e) {
  if (Array.isArray(e)) return e;
}
function Pz() {
  var e = {}, t = function() {
    return null;
  }, r = !1, n = function a(u) {
    if (!r) {
      if (Array.isArray(u)) {
        if (!u.length)
          return;
        var l = u, c = xz(l), f = c[0], d = c.slice(1);
        if (typeof f == "number") {
          xP(a.bind(null, d), f);
          return;
        }
        a(f), xP(a.bind(null, d));
        return;
      }
      _m(u) === "object" && (e = u, t(e)), typeof u == "function" && u();
    }
  };
  return {
    stop: function() {
      r = !0;
    },
    start: function(u) {
      r = !1, n(u);
    },
    subscribe: function(u) {
      return t = u, function() {
        t = function() {
          return null;
        };
      };
    }
  };
}
function _u(e) {
  "@babel/helpers - typeof";
  return _u = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _u(e);
}
function SP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function _P(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? SP(Object(r), !0).forEach(function(n) {
      iC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : SP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function iC(e, t, r) {
  return t = Az(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Az(e) {
  var t = Ez(e, "string");
  return _u(t) === "symbol" ? t : String(t);
}
function Ez(e, t) {
  if (_u(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (_u(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Tz = function(t, r) {
  return [Object.keys(t), Object.keys(r)].reduce(function(n, a) {
    return n.filter(function(u) {
      return a.includes(u);
    });
  });
}, Cz = function(t) {
  return t;
}, kz = function(t) {
  return t.replace(/([A-Z])/g, function(r) {
    return "-".concat(r.toLowerCase());
  });
}, Yo = function(t, r) {
  return Object.keys(r).reduce(function(n, a) {
    return _P(_P({}, n), {}, iC({}, a, t(a, r[a])));
  }, {});
}, OP = function(t, r, n) {
  return t.map(function(a) {
    return "".concat(kz(a), " ").concat(r, "ms ").concat(n);
  }).join(",");
};
function jz(e, t) {
  return $z(e) || Iz(e, t) || aC(e, t) || Mz();
}
function Mz() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Iz(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function $z(e) {
  if (Array.isArray(e)) return e;
}
function Nz(e) {
  return Lz(e) || Dz(e) || aC(e) || Rz();
}
function Rz() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function aC(e, t) {
  if (e) {
    if (typeof e == "string") return Om(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Om(e, t);
  }
}
function Dz(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Lz(e) {
  if (Array.isArray(e)) return Om(e);
}
function Om(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var Bs = 1e-4, oC = function(t, r) {
  return [0, 3 * t, 3 * r - 6 * t, 3 * t - 3 * r + 1];
}, uC = function(t, r) {
  return t.map(function(n, a) {
    return n * Math.pow(r, a);
  }).reduce(function(n, a) {
    return n + a;
  });
}, PP = function(t, r) {
  return function(n) {
    var a = oC(t, r);
    return uC(a, n);
  };
}, qz = function(t, r) {
  return function(n) {
    var a = oC(t, r), u = [].concat(Nz(a.map(function(l, c) {
      return l * c;
    }).slice(1)), [0]);
    return uC(u, n);
  };
}, AP = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  var a = r[0], u = r[1], l = r[2], c = r[3];
  if (r.length === 1)
    switch (r[0]) {
      case "linear":
        a = 0, u = 0, l = 1, c = 1;
        break;
      case "ease":
        a = 0.25, u = 0.1, l = 0.25, c = 1;
        break;
      case "ease-in":
        a = 0.42, u = 0, l = 1, c = 1;
        break;
      case "ease-out":
        a = 0.42, u = 0, l = 0.58, c = 1;
        break;
      case "ease-in-out":
        a = 0, u = 0, l = 0.58, c = 1;
        break;
      default: {
        var f = r[0].split("(");
        if (f[0] === "cubic-bezier" && f[1].split(")")[0].split(",").length === 4) {
          var d = f[1].split(")")[0].split(",").map(function(b) {
            return parseFloat(b);
          }), v = jz(d, 4);
          a = v[0], u = v[1], l = v[2], c = v[3];
        }
      }
    }
  var h = PP(a, l), m = PP(u, c), x = qz(a, l), S = function(P) {
    return P > 1 ? 1 : P < 0 ? 0 : P;
  }, w = function(P) {
    for (var C = P > 1 ? 1 : P, A = C, T = 0; T < 8; ++T) {
      var _ = h(A) - C, O = x(A);
      if (Math.abs(_ - C) < Bs || O < Bs)
        return m(A);
      A = S(A - _ / O);
    }
    return m(A);
  };
  return w.isStepper = !1, w;
}, Bz = function() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = t.stiff, n = r === void 0 ? 100 : r, a = t.damping, u = a === void 0 ? 8 : a, l = t.dt, c = l === void 0 ? 17 : l, f = function(v, h, m) {
    var x = -(v - h) * n, S = m * u, w = m + (x - S) * c / 1e3, b = m * c / 1e3 + v;
    return Math.abs(b - h) < Bs && Math.abs(w) < Bs ? [h, 0] : [b, w];
  };
  return f.isStepper = !0, f.dt = c, f;
}, zz = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  var a = r[0];
  if (typeof a == "string")
    switch (a) {
      case "ease":
      case "ease-in-out":
      case "ease-out":
      case "ease-in":
      case "linear":
        return AP(a);
      case "spring":
        return Bz();
      default:
        if (a.split("(")[0] === "cubic-bezier")
          return AP(a);
    }
  return typeof a == "function" ? a : null;
};
function Ou(e) {
  "@babel/helpers - typeof";
  return Ou = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ou(e);
}
function EP(e) {
  return Wz(e) || Uz(e) || lC(e) || Fz();
}
function Fz() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Uz(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Wz(e) {
  if (Array.isArray(e)) return Am(e);
}
function TP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function _t(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? TP(Object(r), !0).forEach(function(n) {
      Pm(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : TP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Pm(e, t, r) {
  return t = Hz(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function Hz(e) {
  var t = Kz(e, "string");
  return Ou(t) === "symbol" ? t : String(t);
}
function Kz(e, t) {
  if (Ou(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ou(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Gz(e, t) {
  return Yz(e) || Xz(e, t) || lC(e, t) || Vz();
}
function Vz() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lC(e, t) {
  if (e) {
    if (typeof e == "string") return Am(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Am(e, t);
  }
}
function Am(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Xz(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function Yz(e) {
  if (Array.isArray(e)) return e;
}
var zs = function(t, r, n) {
  return t + (r - t) * n;
}, Em = function(t) {
  var r = t.from, n = t.to;
  return r !== n;
}, Qz = function e(t, r, n) {
  var a = Yo(function(u, l) {
    if (Em(l)) {
      var c = t(l.from, l.to, l.velocity), f = Gz(c, 2), d = f[0], v = f[1];
      return _t(_t({}, l), {}, {
        from: d,
        velocity: v
      });
    }
    return l;
  }, r);
  return n < 1 ? Yo(function(u, l) {
    return Em(l) ? _t(_t({}, l), {}, {
      velocity: zs(l.velocity, a[u].velocity, n),
      from: zs(l.from, a[u].from, n)
    }) : l;
  }, r) : e(t, a, n - 1);
};
const Zz = (function(e, t, r, n, a) {
  var u = Tz(e, t), l = u.reduce(function(b, P) {
    return _t(_t({}, b), {}, Pm({}, P, [e[P], t[P]]));
  }, {}), c = u.reduce(function(b, P) {
    return _t(_t({}, b), {}, Pm({}, P, {
      from: e[P],
      velocity: 0,
      to: t[P]
    }));
  }, {}), f = -1, d, v, h = function() {
    return null;
  }, m = function() {
    return Yo(function(P, C) {
      return C.from;
    }, c);
  }, x = function() {
    return !Object.values(c).filter(Em).length;
  }, S = function(P) {
    d || (d = P);
    var C = P - d, A = C / r.dt;
    c = Qz(r, c, A), a(_t(_t(_t({}, e), t), m())), d = P, x() || (f = requestAnimationFrame(h));
  }, w = function(P) {
    v || (v = P);
    var C = (P - v) / n, A = Yo(function(_, O) {
      return zs.apply(void 0, EP(O).concat([r(C)]));
    }, l);
    if (a(_t(_t(_t({}, e), t), A)), C < 1)
      f = requestAnimationFrame(h);
    else {
      var T = Yo(function(_, O) {
        return zs.apply(void 0, EP(O).concat([r(1)]));
      }, l);
      a(_t(_t(_t({}, e), t), T));
    }
  };
  return h = r.isStepper ? S : w, function() {
    return requestAnimationFrame(h), function() {
      cancelAnimationFrame(f);
    };
  };
});
function Sa(e) {
  "@babel/helpers - typeof";
  return Sa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Sa(e);
}
var Jz = ["children", "begin", "duration", "attributeName", "easing", "isActive", "steps", "from", "to", "canBegin", "onAnimationEnd", "shouldReAnimate", "onAnimationReStart"];
function eF(e, t) {
  if (e == null) return {};
  var r = tF(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function tF(e, t) {
  if (e == null) return {};
  var r = {}, n = Object.keys(e), a, u;
  for (u = 0; u < n.length; u++)
    a = n[u], !(t.indexOf(a) >= 0) && (r[a] = e[a]);
  return r;
}
function py(e) {
  return aF(e) || iF(e) || nF(e) || rF();
}
function rF() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function nF(e, t) {
  if (e) {
    if (typeof e == "string") return Tm(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Tm(e, t);
  }
}
function iF(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function aF(e) {
  if (Array.isArray(e)) return Tm(e);
}
function Tm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function CP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function _r(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? CP(Object(r), !0).forEach(function(n) {
      Ho(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : CP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Ho(e, t, r) {
  return t = sC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function oF(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function uF(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, sC(n.key), n);
  }
}
function lF(e, t, r) {
  return t && uF(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function sC(e) {
  var t = sF(e, "string");
  return Sa(t) === "symbol" ? t : String(t);
}
function sF(e, t) {
  if (Sa(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Sa(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function cF(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Cm(e, t);
}
function Cm(e, t) {
  return Cm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Cm(e, t);
}
function fF(e) {
  var t = dF();
  return function() {
    var n = Fs(e), a;
    if (t) {
      var u = Fs(this).constructor;
      a = Reflect.construct(n, arguments, u);
    } else
      a = n.apply(this, arguments);
    return km(this, a);
  };
}
function km(e, t) {
  if (t && (Sa(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return jm(e);
}
function jm(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function dF() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch {
    return !1;
  }
}
function Fs(e) {
  return Fs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Fs(e);
}
var Tr = /* @__PURE__ */ (function(e) {
  cF(r, e);
  var t = fF(r);
  function r(n, a) {
    var u;
    oF(this, r), u = t.call(this, n, a);
    var l = u.props, c = l.isActive, f = l.attributeName, d = l.from, v = l.to, h = l.steps, m = l.children, x = l.duration;
    if (u.handleStyleChange = u.handleStyleChange.bind(jm(u)), u.changeStyle = u.changeStyle.bind(jm(u)), !c || x <= 0)
      return u.state = {
        style: {}
      }, typeof m == "function" && (u.state = {
        style: v
      }), km(u);
    if (h && h.length)
      u.state = {
        style: h[0].style
      };
    else if (d) {
      if (typeof m == "function")
        return u.state = {
          style: d
        }, km(u);
      u.state = {
        style: f ? Ho({}, f, d) : d
      };
    } else
      u.state = {
        style: {}
      };
    return u;
  }
  return lF(r, [{
    key: "componentDidMount",
    value: function() {
      var a = this.props, u = a.isActive, l = a.canBegin;
      this.mounted = !0, !(!u || !l) && this.runAnimation(this.props);
    }
  }, {
    key: "componentDidUpdate",
    value: function(a) {
      var u = this.props, l = u.isActive, c = u.canBegin, f = u.attributeName, d = u.shouldReAnimate, v = u.to, h = u.from, m = this.state.style;
      if (c) {
        if (!l) {
          var x = {
            style: f ? Ho({}, f, v) : v
          };
          this.state && m && (f && m[f] !== v || !f && m !== v) && this.setState(x);
          return;
        }
        if (!(gz(a.to, v) && a.canBegin && a.isActive)) {
          var S = !a.canBegin || !a.isActive;
          this.manager && this.manager.stop(), this.stopJSAnimation && this.stopJSAnimation();
          var w = S || d ? h : a.to;
          if (this.state && m) {
            var b = {
              style: f ? Ho({}, f, w) : w
            };
            (f && m[f] !== w || !f && m !== w) && this.setState(b);
          }
          this.runAnimation(_r(_r({}, this.props), {}, {
            from: w,
            begin: 0
          }));
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function() {
      this.mounted = !1;
      var a = this.props.onAnimationEnd;
      this.unSubscribe && this.unSubscribe(), this.manager && (this.manager.stop(), this.manager = null), this.stopJSAnimation && this.stopJSAnimation(), a && a();
    }
  }, {
    key: "handleStyleChange",
    value: function(a) {
      this.changeStyle(a);
    }
  }, {
    key: "changeStyle",
    value: function(a) {
      this.mounted && this.setState({
        style: a
      });
    }
  }, {
    key: "runJSAnimation",
    value: function(a) {
      var u = this, l = a.from, c = a.to, f = a.duration, d = a.easing, v = a.begin, h = a.onAnimationEnd, m = a.onAnimationStart, x = Zz(l, c, zz(d), f, this.changeStyle), S = function() {
        u.stopJSAnimation = x();
      };
      this.manager.start([m, v, S, f, h]);
    }
  }, {
    key: "runStepAnimation",
    value: function(a) {
      var u = this, l = a.steps, c = a.begin, f = a.onAnimationStart, d = l[0], v = d.style, h = d.duration, m = h === void 0 ? 0 : h, x = function(w, b, P) {
        if (P === 0)
          return w;
        var C = b.duration, A = b.easing, T = A === void 0 ? "ease" : A, _ = b.style, O = b.properties, k = b.onAnimationEnd, M = P > 0 ? l[P - 1] : b, N = O || Object.keys(_);
        if (typeof T == "function" || T === "spring")
          return [].concat(py(w), [u.runJSAnimation.bind(u, {
            from: M.style,
            to: _,
            duration: C,
            easing: T
          }), C]);
        var W = OP(N, C, T), R = _r(_r(_r({}, M.style), _), {}, {
          transition: W
        });
        return [].concat(py(w), [R, C, k]).filter(Cz);
      };
      return this.manager.start([f].concat(py(l.reduce(x, [v, Math.max(m, c)])), [a.onAnimationEnd]));
    }
  }, {
    key: "runAnimation",
    value: function(a) {
      this.manager || (this.manager = Pz());
      var u = a.begin, l = a.duration, c = a.attributeName, f = a.to, d = a.easing, v = a.onAnimationStart, h = a.onAnimationEnd, m = a.steps, x = a.children, S = this.manager;
      if (this.unSubscribe = S.subscribe(this.handleStyleChange), typeof d == "function" || typeof x == "function" || d === "spring") {
        this.runJSAnimation(a);
        return;
      }
      if (m.length > 1) {
        this.runStepAnimation(a);
        return;
      }
      var w = c ? Ho({}, c, f) : f, b = OP(Object.keys(w), l, d);
      S.start([v, u, _r(_r({}, w), {}, {
        transition: b
      }), l, h]);
    }
  }, {
    key: "render",
    value: function() {
      var a = this.props, u = a.children;
      a.begin;
      var l = a.duration;
      a.attributeName, a.easing;
      var c = a.isActive;
      a.steps, a.from, a.to, a.canBegin, a.onAnimationEnd, a.shouldReAnimate, a.onAnimationReStart;
      var f = eF(a, Jz), d = V.Children.count(u), v = this.state.style;
      if (typeof u == "function")
        return u(v);
      if (!c || d === 0 || l <= 0)
        return u;
      var h = function(x) {
        var S = x.props, w = S.style, b = w === void 0 ? {} : w, P = S.className, C = /* @__PURE__ */ V.cloneElement(x, _r(_r({}, f), {}, {
          style: _r(_r({}, b), v),
          className: P
        }));
        return C;
      };
      return d === 1 ? h(V.Children.only(u)) : /* @__PURE__ */ $.createElement("div", null, V.Children.map(u, function(m) {
        return h(m);
      }));
    }
  }]), r;
})(V.PureComponent);
Tr.displayName = "Animate";
Tr.defaultProps = {
  begin: 0,
  duration: 1e3,
  from: "",
  to: "",
  attributeName: "",
  easing: "ease",
  isActive: !0,
  canBegin: !0,
  steps: [],
  onAnimationEnd: function() {
  },
  onAnimationStart: function() {
  }
};
Tr.propTypes = {
  from: De.oneOfType([De.object, De.string]),
  to: De.oneOfType([De.object, De.string]),
  attributeName: De.string,
  // animation duration
  duration: De.number,
  begin: De.number,
  easing: De.oneOfType([De.string, De.func]),
  steps: De.arrayOf(De.shape({
    duration: De.number.isRequired,
    style: De.object.isRequired,
    easing: De.oneOfType([De.oneOf(["ease", "ease-in", "ease-out", "ease-in-out", "linear"]), De.func]),
    // transition css properties(dash case), optional
    properties: De.arrayOf("string"),
    onAnimationEnd: De.func
  })),
  children: De.oneOfType([De.node, De.func]),
  isActive: De.bool,
  canBegin: De.bool,
  onAnimationEnd: De.func,
  // decide if it should reanimate with initial from style when props change
  shouldReAnimate: De.bool,
  onAnimationStart: De.func,
  onAnimationReStart: De.func
};
function Pu(e) {
  "@babel/helpers - typeof";
  return Pu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pu(e);
}
function Us() {
  return Us = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Us.apply(this, arguments);
}
function pF(e, t) {
  return mF(e) || yF(e, t) || vF(e, t) || hF();
}
function hF() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function vF(e, t) {
  if (e) {
    if (typeof e == "string") return kP(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return kP(e, t);
  }
}
function kP(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function yF(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function mF(e) {
  if (Array.isArray(e)) return e;
}
function jP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function MP(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jP(Object(r), !0).forEach(function(n) {
      gF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : jP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function gF(e, t, r) {
  return t = bF(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function bF(e) {
  var t = xF(e, "string");
  return Pu(t) == "symbol" ? t : t + "";
}
function xF(e, t) {
  if (Pu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Pu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var IP = function(t, r, n, a, u) {
  var l = Math.min(Math.abs(n) / 2, Math.abs(a) / 2), c = a >= 0 ? 1 : -1, f = n >= 0 ? 1 : -1, d = a >= 0 && n >= 0 || a < 0 && n < 0 ? 1 : 0, v;
  if (l > 0 && u instanceof Array) {
    for (var h = [0, 0, 0, 0], m = 0, x = 4; m < x; m++)
      h[m] = u[m] > l ? l : u[m];
    v = "M".concat(t, ",").concat(r + c * h[0]), h[0] > 0 && (v += "A ".concat(h[0], ",").concat(h[0], ",0,0,").concat(d, ",").concat(t + f * h[0], ",").concat(r)), v += "L ".concat(t + n - f * h[1], ",").concat(r), h[1] > 0 && (v += "A ".concat(h[1], ",").concat(h[1], ",0,0,").concat(d, `,
        `).concat(t + n, ",").concat(r + c * h[1])), v += "L ".concat(t + n, ",").concat(r + a - c * h[2]), h[2] > 0 && (v += "A ".concat(h[2], ",").concat(h[2], ",0,0,").concat(d, `,
        `).concat(t + n - f * h[2], ",").concat(r + a)), v += "L ".concat(t + f * h[3], ",").concat(r + a), h[3] > 0 && (v += "A ".concat(h[3], ",").concat(h[3], ",0,0,").concat(d, `,
        `).concat(t, ",").concat(r + a - c * h[3])), v += "Z";
  } else if (l > 0 && u === +u && u > 0) {
    var S = Math.min(l, u);
    v = "M ".concat(t, ",").concat(r + c * S, `
            A `).concat(S, ",").concat(S, ",0,0,").concat(d, ",").concat(t + f * S, ",").concat(r, `
            L `).concat(t + n - f * S, ",").concat(r, `
            A `).concat(S, ",").concat(S, ",0,0,").concat(d, ",").concat(t + n, ",").concat(r + c * S, `
            L `).concat(t + n, ",").concat(r + a - c * S, `
            A `).concat(S, ",").concat(S, ",0,0,").concat(d, ",").concat(t + n - f * S, ",").concat(r + a, `
            L `).concat(t + f * S, ",").concat(r + a, `
            A `).concat(S, ",").concat(S, ",0,0,").concat(d, ",").concat(t, ",").concat(r + a - c * S, " Z");
  } else
    v = "M ".concat(t, ",").concat(r, " h ").concat(n, " v ").concat(a, " h ").concat(-n, " Z");
  return v;
}, wF = function(t, r) {
  if (!t || !r)
    return !1;
  var n = t.x, a = t.y, u = r.x, l = r.y, c = r.width, f = r.height;
  if (Math.abs(c) > 0 && Math.abs(f) > 0) {
    var d = Math.min(u, u + c), v = Math.max(u, u + c), h = Math.min(l, l + f), m = Math.max(l, l + f);
    return n >= d && n <= v && a >= h && a <= m;
  }
  return !1;
}, SF = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  // The radius of border
  // The radius of four corners when radius is a number
  // The radius of left-top, right-top, right-bottom, left-bottom when radius is an array
  radius: 0,
  isAnimationActive: !1,
  isUpdateAnimationActive: !1,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
}, Zg = function(t) {
  var r = MP(MP({}, SF), t), n = V.useRef(), a = V.useState(-1), u = pF(a, 2), l = u[0], c = u[1];
  V.useEffect(function() {
    if (n.current && n.current.getTotalLength)
      try {
        var T = n.current.getTotalLength();
        T && c(T);
      } catch {
      }
  }, []);
  var f = r.x, d = r.y, v = r.width, h = r.height, m = r.radius, x = r.className, S = r.animationEasing, w = r.animationDuration, b = r.animationBegin, P = r.isAnimationActive, C = r.isUpdateAnimationActive;
  if (f !== +f || d !== +d || v !== +v || h !== +h || v === 0 || h === 0)
    return null;
  var A = ke("recharts-rectangle", x);
  return C ? /* @__PURE__ */ $.createElement(Tr, {
    canBegin: l > 0,
    from: {
      width: v,
      height: h,
      x: f,
      y: d
    },
    to: {
      width: v,
      height: h,
      x: f,
      y: d
    },
    duration: w,
    animationEasing: S,
    isActive: C
  }, function(T) {
    var _ = T.width, O = T.height, k = T.x, M = T.y;
    return /* @__PURE__ */ $.createElement(Tr, {
      canBegin: l > 0,
      from: "0px ".concat(l === -1 ? 1 : l, "px"),
      to: "".concat(l, "px 0px"),
      attributeName: "strokeDasharray",
      begin: b,
      duration: w,
      isActive: P,
      easing: S
    }, /* @__PURE__ */ $.createElement("path", Us({}, Ae(r, !0), {
      className: A,
      d: IP(k, M, _, O, m),
      ref: n
    })));
  }) : /* @__PURE__ */ $.createElement("path", Us({}, Ae(r, !0), {
    className: A,
    d: IP(f, d, v, h, m)
  }));
};
function Mm() {
  return Mm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Mm.apply(this, arguments);
}
var Mc = function(t) {
  var r = t.cx, n = t.cy, a = t.r, u = t.className, l = ke("recharts-dot", u);
  return r === +r && n === +n && a === +a ? /* @__PURE__ */ V.createElement("circle", Mm({}, Ae(t, !1), ds(t), {
    className: l,
    cx: r,
    cy: n,
    r: a
  })) : null;
};
function Au(e) {
  "@babel/helpers - typeof";
  return Au = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Au(e);
}
var _F = ["x", "y", "top", "left", "width", "height", "className"];
function Im() {
  return Im = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Im.apply(this, arguments);
}
function $P(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function OF(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $P(Object(r), !0).forEach(function(n) {
      PF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : $P(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function PF(e, t, r) {
  return t = AF(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function AF(e) {
  var t = EF(e, "string");
  return Au(t) == "symbol" ? t : t + "";
}
function EF(e, t) {
  if (Au(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Au(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function TF(e, t) {
  if (e == null) return {};
  var r = CF(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function CF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var kF = function(t, r, n, a, u, l) {
  return "M".concat(t, ",").concat(u, "v").concat(a, "M").concat(l, ",").concat(r, "h").concat(n);
}, jF = function(t) {
  var r = t.x, n = r === void 0 ? 0 : r, a = t.y, u = a === void 0 ? 0 : a, l = t.top, c = l === void 0 ? 0 : l, f = t.left, d = f === void 0 ? 0 : f, v = t.width, h = v === void 0 ? 0 : v, m = t.height, x = m === void 0 ? 0 : m, S = t.className, w = TF(t, _F), b = OF({
    x: n,
    y: u,
    top: c,
    left: d,
    width: h,
    height: x
  }, w);
  return !le(n) || !le(u) || !le(h) || !le(x) || !le(c) || !le(d) ? null : /* @__PURE__ */ $.createElement("path", Im({}, Ae(b, !0), {
    className: ke("recharts-cross", S),
    d: kF(n, u, h, x, c, d)
  }));
}, hy, NP;
function MF() {
  if (NP) return hy;
  NP = 1;
  var e = kE(), t = e(Object.getPrototypeOf, Object);
  return hy = t, hy;
}
var vy, RP;
function IF() {
  if (RP) return vy;
  RP = 1;
  var e = hn(), t = MF(), r = vn(), n = "[object Object]", a = Function.prototype, u = Object.prototype, l = a.toString, c = u.hasOwnProperty, f = l.call(Object);
  function d(v) {
    if (!r(v) || e(v) != n)
      return !1;
    var h = t(v);
    if (h === null)
      return !0;
    var m = c.call(h, "constructor") && h.constructor;
    return typeof m == "function" && m instanceof m && l.call(m) == f;
  }
  return vy = d, vy;
}
var $F = IF();
const NF = /* @__PURE__ */ Fe($F);
var yy, DP;
function RF() {
  if (DP) return yy;
  DP = 1;
  var e = hn(), t = vn(), r = "[object Boolean]";
  function n(a) {
    return a === !0 || a === !1 || t(a) && e(a) == r;
  }
  return yy = n, yy;
}
var DF = RF();
const LF = /* @__PURE__ */ Fe(DF);
function Eu(e) {
  "@babel/helpers - typeof";
  return Eu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Eu(e);
}
function Ws() {
  return Ws = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Ws.apply(this, arguments);
}
function qF(e, t) {
  return UF(e) || FF(e, t) || zF(e, t) || BF();
}
function BF() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zF(e, t) {
  if (e) {
    if (typeof e == "string") return LP(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return LP(e, t);
  }
}
function LP(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function FF(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function UF(e) {
  if (Array.isArray(e)) return e;
}
function qP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function BP(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? qP(Object(r), !0).forEach(function(n) {
      WF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : qP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function WF(e, t, r) {
  return t = HF(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function HF(e) {
  var t = KF(e, "string");
  return Eu(t) == "symbol" ? t : t + "";
}
function KF(e, t) {
  if (Eu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Eu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var zP = function(t, r, n, a, u) {
  var l = n - a, c;
  return c = "M ".concat(t, ",").concat(r), c += "L ".concat(t + n, ",").concat(r), c += "L ".concat(t + n - l / 2, ",").concat(r + u), c += "L ".concat(t + n - l / 2 - a, ",").concat(r + u), c += "L ".concat(t, ",").concat(r, " Z"), c;
}, GF = {
  x: 0,
  y: 0,
  upperWidth: 0,
  lowerWidth: 0,
  height: 0,
  isUpdateAnimationActive: !1,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
}, VF = function(t) {
  var r = BP(BP({}, GF), t), n = V.useRef(), a = V.useState(-1), u = qF(a, 2), l = u[0], c = u[1];
  V.useEffect(function() {
    if (n.current && n.current.getTotalLength)
      try {
        var A = n.current.getTotalLength();
        A && c(A);
      } catch {
      }
  }, []);
  var f = r.x, d = r.y, v = r.upperWidth, h = r.lowerWidth, m = r.height, x = r.className, S = r.animationEasing, w = r.animationDuration, b = r.animationBegin, P = r.isUpdateAnimationActive;
  if (f !== +f || d !== +d || v !== +v || h !== +h || m !== +m || v === 0 && h === 0 || m === 0)
    return null;
  var C = ke("recharts-trapezoid", x);
  return P ? /* @__PURE__ */ $.createElement(Tr, {
    canBegin: l > 0,
    from: {
      upperWidth: 0,
      lowerWidth: 0,
      height: m,
      x: f,
      y: d
    },
    to: {
      upperWidth: v,
      lowerWidth: h,
      height: m,
      x: f,
      y: d
    },
    duration: w,
    animationEasing: S,
    isActive: P
  }, function(A) {
    var T = A.upperWidth, _ = A.lowerWidth, O = A.height, k = A.x, M = A.y;
    return /* @__PURE__ */ $.createElement(Tr, {
      canBegin: l > 0,
      from: "0px ".concat(l === -1 ? 1 : l, "px"),
      to: "".concat(l, "px 0px"),
      attributeName: "strokeDasharray",
      begin: b,
      duration: w,
      easing: S
    }, /* @__PURE__ */ $.createElement("path", Ws({}, Ae(r, !0), {
      className: C,
      d: zP(k, M, T, _, O),
      ref: n
    })));
  }) : /* @__PURE__ */ $.createElement("g", null, /* @__PURE__ */ $.createElement("path", Ws({}, Ae(r, !0), {
    className: C,
    d: zP(f, d, v, h, m)
  })));
}, XF = ["option", "shapeType", "propTransformer", "activeClassName", "isActive"];
function Tu(e) {
  "@babel/helpers - typeof";
  return Tu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Tu(e);
}
function YF(e, t) {
  if (e == null) return {};
  var r = QF(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function QF(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function FP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Hs(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? FP(Object(r), !0).forEach(function(n) {
      ZF(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : FP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function ZF(e, t, r) {
  return t = JF(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function JF(e) {
  var t = e4(e, "string");
  return Tu(t) == "symbol" ? t : t + "";
}
function e4(e, t) {
  if (Tu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Tu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function t4(e, t) {
  return Hs(Hs({}, t), e);
}
function r4(e, t) {
  return e === "symbols";
}
function UP(e) {
  var t = e.shapeType, r = e.elementProps;
  switch (t) {
    case "rectangle":
      return /* @__PURE__ */ $.createElement(Zg, r);
    case "trapezoid":
      return /* @__PURE__ */ $.createElement(VF, r);
    case "sector":
      return /* @__PURE__ */ $.createElement(rC, r);
    case "symbols":
      if (r4(t))
        return /* @__PURE__ */ $.createElement(bc, r);
      break;
    default:
      return null;
  }
}
function n4(e) {
  return /* @__PURE__ */ V.isValidElement(e) ? e.props : e;
}
function $m(e) {
  var t = e.option, r = e.shapeType, n = e.propTransformer, a = n === void 0 ? t4 : n, u = e.activeClassName, l = u === void 0 ? "recharts-active-shape" : u, c = e.isActive, f = YF(e, XF), d;
  if (/* @__PURE__ */ V.isValidElement(t))
    d = /* @__PURE__ */ V.cloneElement(t, Hs(Hs({}, f), n4(t)));
  else if (Ee(t))
    d = t(f);
  else if (NF(t) && !LF(t)) {
    var v = a(t, f);
    d = /* @__PURE__ */ $.createElement(UP, {
      shapeType: r,
      elementProps: v
    });
  } else {
    var h = f;
    d = /* @__PURE__ */ $.createElement(UP, {
      shapeType: r,
      elementProps: h
    });
  }
  return c ? /* @__PURE__ */ $.createElement(Ne, {
    className: l
  }, d) : d;
}
function Ic(e, t) {
  return t != null && "trapezoids" in e.props;
}
function $c(e, t) {
  return t != null && "sectors" in e.props;
}
function Cu(e, t) {
  return t != null && "points" in e.props;
}
function i4(e, t) {
  var r, n, a = e.x === (t == null || (r = t.labelViewBox) === null || r === void 0 ? void 0 : r.x) || e.x === t.x, u = e.y === (t == null || (n = t.labelViewBox) === null || n === void 0 ? void 0 : n.y) || e.y === t.y;
  return a && u;
}
function a4(e, t) {
  var r = e.endAngle === t.endAngle, n = e.startAngle === t.startAngle;
  return r && n;
}
function o4(e, t) {
  var r = e.x === t.x, n = e.y === t.y, a = e.z === t.z;
  return r && n && a;
}
function u4(e, t) {
  var r;
  return Ic(e, t) ? r = i4 : $c(e, t) ? r = a4 : Cu(e, t) && (r = o4), r;
}
function l4(e, t) {
  var r;
  return Ic(e, t) ? r = "trapezoids" : $c(e, t) ? r = "sectors" : Cu(e, t) && (r = "points"), r;
}
function s4(e, t) {
  if (Ic(e, t)) {
    var r;
    return (r = t.tooltipPayload) === null || r === void 0 || (r = r[0]) === null || r === void 0 || (r = r.payload) === null || r === void 0 ? void 0 : r.payload;
  }
  if ($c(e, t)) {
    var n;
    return (n = t.tooltipPayload) === null || n === void 0 || (n = n[0]) === null || n === void 0 || (n = n.payload) === null || n === void 0 ? void 0 : n.payload;
  }
  return Cu(e, t) ? t.payload : {};
}
function c4(e) {
  var t = e.activeTooltipItem, r = e.graphicalItem, n = e.itemData, a = l4(r, t), u = s4(r, t), l = n.filter(function(f, d) {
    var v = wi(u, f), h = r.props[a].filter(function(S) {
      var w = u4(r, t);
      return w(S, t);
    }), m = r.props[a].indexOf(h[h.length - 1]), x = d === m;
    return v && x;
  }), c = n.indexOf(l[l.length - 1]);
  return c;
}
var my, WP;
function f4() {
  if (WP) return my;
  WP = 1;
  var e = Math.ceil, t = Math.max;
  function r(n, a, u, l) {
    for (var c = -1, f = t(e((a - n) / (u || 1)), 0), d = Array(f); f--; )
      d[l ? f : ++c] = n, n += u;
    return d;
  }
  return my = r, my;
}
var gy, HP;
function cC() {
  if (HP) return gy;
  HP = 1;
  var e = KE(), t = 1 / 0, r = 17976931348623157e292;
  function n(a) {
    if (!a)
      return a === 0 ? a : 0;
    if (a = e(a), a === t || a === -t) {
      var u = a < 0 ? -1 : 1;
      return u * r;
    }
    return a === a ? a : 0;
  }
  return gy = n, gy;
}
var by, KP;
function d4() {
  if (KP) return by;
  KP = 1;
  var e = f4(), t = Sc(), r = cC();
  function n(a) {
    return function(u, l, c) {
      return c && typeof c != "number" && t(u, l, c) && (l = c = void 0), u = r(u), l === void 0 ? (l = u, u = 0) : l = r(l), c = c === void 0 ? u < l ? 1 : -1 : r(c), e(u, l, c, a);
    };
  }
  return by = n, by;
}
var xy, GP;
function p4() {
  if (GP) return xy;
  GP = 1;
  var e = d4(), t = e();
  return xy = t, xy;
}
var h4 = p4();
const Ks = /* @__PURE__ */ Fe(h4);
function ku(e) {
  "@babel/helpers - typeof";
  return ku = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ku(e);
}
function VP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function XP(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? VP(Object(r), !0).forEach(function(n) {
      fC(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : VP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function fC(e, t, r) {
  return t = v4(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function v4(e) {
  var t = y4(e, "string");
  return ku(t) == "symbol" ? t : t + "";
}
function y4(e, t) {
  if (ku(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ku(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var m4 = ["Webkit", "Moz", "O", "ms"], g4 = function(t, r) {
  var n = t.replace(/(\w)/, function(u) {
    return u.toUpperCase();
  }), a = m4.reduce(function(u, l) {
    return XP(XP({}, u), {}, fC({}, l + n, r));
  }, {});
  return a[t] = r, a;
};
function _a(e) {
  "@babel/helpers - typeof";
  return _a = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _a(e);
}
function Gs() {
  return Gs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Gs.apply(this, arguments);
}
function YP(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function wy(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? YP(Object(r), !0).forEach(function(n) {
      Yt(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : YP(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function b4(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function QP(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, pC(n.key), n);
  }
}
function x4(e, t, r) {
  return t && QP(e.prototype, t), r && QP(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function w4(e, t, r) {
  return t = Vs(t), S4(e, dC() ? Reflect.construct(t, r || [], Vs(e).constructor) : t.apply(e, r));
}
function S4(e, t) {
  if (t && (_a(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return _4(e);
}
function _4(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function dC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (dC = function() {
    return !!e;
  })();
}
function Vs(e) {
  return Vs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Vs(e);
}
function O4(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Nm(e, t);
}
function Nm(e, t) {
  return Nm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Nm(e, t);
}
function Yt(e, t, r) {
  return t = pC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function pC(e) {
  var t = P4(e, "string");
  return _a(t) == "symbol" ? t : t + "";
}
function P4(e, t) {
  if (_a(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (_a(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var A4 = function(t) {
  var r = t.data, n = t.startIndex, a = t.endIndex, u = t.x, l = t.width, c = t.travellerWidth;
  if (!r || !r.length)
    return {};
  var f = r.length, d = Vo().domain(Ks(0, f)).range([u, u + l - c]), v = d.domain().map(function(h) {
    return d(h);
  });
  return {
    isTextActive: !1,
    isSlideMoving: !1,
    isTravellerMoving: !1,
    isTravellerFocused: !1,
    startX: d(n),
    endX: d(a),
    scale: d,
    scaleValues: v
  };
}, ZP = function(t) {
  return t.changedTouches && !!t.changedTouches.length;
}, Oa = /* @__PURE__ */ (function(e) {
  function t(r) {
    var n;
    return b4(this, t), n = w4(this, t, [r]), Yt(n, "handleDrag", function(a) {
      n.leaveTimer && (clearTimeout(n.leaveTimer), n.leaveTimer = null), n.state.isTravellerMoving ? n.handleTravellerMove(a) : n.state.isSlideMoving && n.handleSlideDrag(a);
    }), Yt(n, "handleTouchMove", function(a) {
      a.changedTouches != null && a.changedTouches.length > 0 && n.handleDrag(a.changedTouches[0]);
    }), Yt(n, "handleDragEnd", function() {
      n.setState({
        isTravellerMoving: !1,
        isSlideMoving: !1
      }, function() {
        var a = n.props, u = a.endIndex, l = a.onDragEnd, c = a.startIndex;
        l?.({
          endIndex: u,
          startIndex: c
        });
      }), n.detachDragEndListener();
    }), Yt(n, "handleLeaveWrapper", function() {
      (n.state.isTravellerMoving || n.state.isSlideMoving) && (n.leaveTimer = window.setTimeout(n.handleDragEnd, n.props.leaveTimeOut));
    }), Yt(n, "handleEnterSlideOrTraveller", function() {
      n.setState({
        isTextActive: !0
      });
    }), Yt(n, "handleLeaveSlideOrTraveller", function() {
      n.setState({
        isTextActive: !1
      });
    }), Yt(n, "handleSlideDragStart", function(a) {
      var u = ZP(a) ? a.changedTouches[0] : a;
      n.setState({
        isTravellerMoving: !1,
        isSlideMoving: !0,
        slideMoveStartX: u.pageX
      }), n.attachDragEndListener();
    }), n.travellerDragStartHandlers = {
      startX: n.handleTravellerDragStart.bind(n, "startX"),
      endX: n.handleTravellerDragStart.bind(n, "endX")
    }, n.state = {}, n;
  }
  return O4(t, e), x4(t, [{
    key: "componentWillUnmount",
    value: function() {
      this.leaveTimer && (clearTimeout(this.leaveTimer), this.leaveTimer = null), this.detachDragEndListener();
    }
  }, {
    key: "getIndex",
    value: function(n) {
      var a = n.startX, u = n.endX, l = this.state.scaleValues, c = this.props, f = c.gap, d = c.data, v = d.length - 1, h = Math.min(a, u), m = Math.max(a, u), x = t.getIndexInRange(l, h), S = t.getIndexInRange(l, m);
      return {
        startIndex: x - x % f,
        endIndex: S === v ? v : S - S % f
      };
    }
  }, {
    key: "getTextOfTick",
    value: function(n) {
      var a = this.props, u = a.data, l = a.tickFormatter, c = a.dataKey, f = pt(u[n], c, n);
      return Ee(l) ? l(f, n) : f;
    }
  }, {
    key: "attachDragEndListener",
    value: function() {
      window.addEventListener("mouseup", this.handleDragEnd, !0), window.addEventListener("touchend", this.handleDragEnd, !0), window.addEventListener("mousemove", this.handleDrag, !0);
    }
  }, {
    key: "detachDragEndListener",
    value: function() {
      window.removeEventListener("mouseup", this.handleDragEnd, !0), window.removeEventListener("touchend", this.handleDragEnd, !0), window.removeEventListener("mousemove", this.handleDrag, !0);
    }
  }, {
    key: "handleSlideDrag",
    value: function(n) {
      var a = this.state, u = a.slideMoveStartX, l = a.startX, c = a.endX, f = this.props, d = f.x, v = f.width, h = f.travellerWidth, m = f.startIndex, x = f.endIndex, S = f.onChange, w = n.pageX - u;
      w > 0 ? w = Math.min(w, d + v - h - c, d + v - h - l) : w < 0 && (w = Math.max(w, d - l, d - c));
      var b = this.getIndex({
        startX: l + w,
        endX: c + w
      });
      (b.startIndex !== m || b.endIndex !== x) && S && S(b), this.setState({
        startX: l + w,
        endX: c + w,
        slideMoveStartX: n.pageX
      });
    }
  }, {
    key: "handleTravellerDragStart",
    value: function(n, a) {
      var u = ZP(a) ? a.changedTouches[0] : a;
      this.setState({
        isSlideMoving: !1,
        isTravellerMoving: !0,
        movingTravellerId: n,
        brushMoveStartX: u.pageX
      }), this.attachDragEndListener();
    }
  }, {
    key: "handleTravellerMove",
    value: function(n) {
      var a = this.state, u = a.brushMoveStartX, l = a.movingTravellerId, c = a.endX, f = a.startX, d = this.state[l], v = this.props, h = v.x, m = v.width, x = v.travellerWidth, S = v.onChange, w = v.gap, b = v.data, P = {
        startX: this.state.startX,
        endX: this.state.endX
      }, C = n.pageX - u;
      C > 0 ? C = Math.min(C, h + m - x - d) : C < 0 && (C = Math.max(C, h - d)), P[l] = d + C;
      var A = this.getIndex(P), T = A.startIndex, _ = A.endIndex, O = function() {
        var M = b.length - 1;
        return l === "startX" && (c > f ? T % w === 0 : _ % w === 0) || c < f && _ === M || l === "endX" && (c > f ? _ % w === 0 : T % w === 0) || c > f && _ === M;
      };
      this.setState(Yt(Yt({}, l, d + C), "brushMoveStartX", n.pageX), function() {
        S && O() && S(A);
      });
    }
  }, {
    key: "handleTravellerMoveKeyboard",
    value: function(n, a) {
      var u = this, l = this.state, c = l.scaleValues, f = l.startX, d = l.endX, v = this.state[a], h = c.indexOf(v);
      if (h !== -1) {
        var m = h + n;
        if (!(m === -1 || m >= c.length)) {
          var x = c[m];
          a === "startX" && x >= d || a === "endX" && x <= f || this.setState(Yt({}, a, x), function() {
            u.props.onChange(u.getIndex({
              startX: u.state.startX,
              endX: u.state.endX
            }));
          });
        }
      }
    }
  }, {
    key: "renderBackground",
    value: function() {
      var n = this.props, a = n.x, u = n.y, l = n.width, c = n.height, f = n.fill, d = n.stroke;
      return /* @__PURE__ */ $.createElement("rect", {
        stroke: d,
        fill: f,
        x: a,
        y: u,
        width: l,
        height: c
      });
    }
  }, {
    key: "renderPanorama",
    value: function() {
      var n = this.props, a = n.x, u = n.y, l = n.width, c = n.height, f = n.data, d = n.children, v = n.padding, h = V.Children.only(d);
      return h ? /* @__PURE__ */ $.cloneElement(h, {
        x: a,
        y: u,
        width: l,
        height: c,
        margin: v,
        compact: !0,
        data: f
      }) : null;
    }
  }, {
    key: "renderTravellerLayer",
    value: function(n, a) {
      var u, l, c = this, f = this.props, d = f.y, v = f.travellerWidth, h = f.height, m = f.traveller, x = f.ariaLabel, S = f.data, w = f.startIndex, b = f.endIndex, P = Math.max(n, this.props.x), C = wy(wy({}, Ae(this.props, !1)), {}, {
        x: P,
        y: d,
        width: v,
        height: h
      }), A = x || "Min value: ".concat((u = S[w]) === null || u === void 0 ? void 0 : u.name, ", Max value: ").concat((l = S[b]) === null || l === void 0 ? void 0 : l.name);
      return /* @__PURE__ */ $.createElement(Ne, {
        tabIndex: 0,
        role: "slider",
        "aria-label": A,
        "aria-valuenow": n,
        className: "recharts-brush-traveller",
        onMouseEnter: this.handleEnterSlideOrTraveller,
        onMouseLeave: this.handleLeaveSlideOrTraveller,
        onMouseDown: this.travellerDragStartHandlers[a],
        onTouchStart: this.travellerDragStartHandlers[a],
        onKeyDown: function(_) {
          ["ArrowLeft", "ArrowRight"].includes(_.key) && (_.preventDefault(), _.stopPropagation(), c.handleTravellerMoveKeyboard(_.key === "ArrowRight" ? 1 : -1, a));
        },
        onFocus: function() {
          c.setState({
            isTravellerFocused: !0
          });
        },
        onBlur: function() {
          c.setState({
            isTravellerFocused: !1
          });
        },
        style: {
          cursor: "col-resize"
        }
      }, t.renderTraveller(m, C));
    }
  }, {
    key: "renderSlide",
    value: function(n, a) {
      var u = this.props, l = u.y, c = u.height, f = u.stroke, d = u.travellerWidth, v = Math.min(n, a) + d, h = Math.max(Math.abs(a - n) - d, 0);
      return /* @__PURE__ */ $.createElement("rect", {
        className: "recharts-brush-slide",
        onMouseEnter: this.handleEnterSlideOrTraveller,
        onMouseLeave: this.handleLeaveSlideOrTraveller,
        onMouseDown: this.handleSlideDragStart,
        onTouchStart: this.handleSlideDragStart,
        style: {
          cursor: "move"
        },
        stroke: "none",
        fill: f,
        fillOpacity: 0.2,
        x: v,
        y: l,
        width: h,
        height: c
      });
    }
  }, {
    key: "renderText",
    value: function() {
      var n = this.props, a = n.startIndex, u = n.endIndex, l = n.y, c = n.height, f = n.travellerWidth, d = n.stroke, v = this.state, h = v.startX, m = v.endX, x = 5, S = {
        pointerEvents: "none",
        fill: d
      };
      return /* @__PURE__ */ $.createElement(Ne, {
        className: "recharts-brush-texts"
      }, /* @__PURE__ */ $.createElement(_s, Gs({
        textAnchor: "end",
        verticalAnchor: "middle",
        x: Math.min(h, m) - x,
        y: l + c / 2
      }, S), this.getTextOfTick(a)), /* @__PURE__ */ $.createElement(_s, Gs({
        textAnchor: "start",
        verticalAnchor: "middle",
        x: Math.max(h, m) + f + x,
        y: l + c / 2
      }, S), this.getTextOfTick(u)));
    }
  }, {
    key: "render",
    value: function() {
      var n = this.props, a = n.data, u = n.className, l = n.children, c = n.x, f = n.y, d = n.width, v = n.height, h = n.alwaysShowText, m = this.state, x = m.startX, S = m.endX, w = m.isTextActive, b = m.isSlideMoving, P = m.isTravellerMoving, C = m.isTravellerFocused;
      if (!a || !a.length || !le(c) || !le(f) || !le(d) || !le(v) || d <= 0 || v <= 0)
        return null;
      var A = ke("recharts-brush", u), T = $.Children.count(l) === 1, _ = g4("userSelect", "none");
      return /* @__PURE__ */ $.createElement(Ne, {
        className: A,
        onMouseLeave: this.handleLeaveWrapper,
        onTouchMove: this.handleTouchMove,
        style: _
      }, this.renderBackground(), T && this.renderPanorama(), this.renderSlide(x, S), this.renderTravellerLayer(x, "startX"), this.renderTravellerLayer(S, "endX"), (w || b || P || C || h) && this.renderText());
    }
  }], [{
    key: "renderDefaultTraveller",
    value: function(n) {
      var a = n.x, u = n.y, l = n.width, c = n.height, f = n.stroke, d = Math.floor(u + c / 2) - 1;
      return /* @__PURE__ */ $.createElement($.Fragment, null, /* @__PURE__ */ $.createElement("rect", {
        x: a,
        y: u,
        width: l,
        height: c,
        fill: f,
        stroke: "none"
      }), /* @__PURE__ */ $.createElement("line", {
        x1: a + 1,
        y1: d,
        x2: a + l - 1,
        y2: d,
        fill: "none",
        stroke: "#fff"
      }), /* @__PURE__ */ $.createElement("line", {
        x1: a + 1,
        y1: d + 2,
        x2: a + l - 1,
        y2: d + 2,
        fill: "none",
        stroke: "#fff"
      }));
    }
  }, {
    key: "renderTraveller",
    value: function(n, a) {
      var u;
      return /* @__PURE__ */ $.isValidElement(n) ? u = /* @__PURE__ */ $.cloneElement(n, a) : Ee(n) ? u = n(a) : u = t.renderDefaultTraveller(a), u;
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function(n, a) {
      var u = n.data, l = n.width, c = n.x, f = n.travellerWidth, d = n.updateId, v = n.startIndex, h = n.endIndex;
      if (u !== a.prevData || d !== a.prevUpdateId)
        return wy({
          prevData: u,
          prevTravellerWidth: f,
          prevUpdateId: d,
          prevX: c,
          prevWidth: l
        }, u && u.length ? A4({
          data: u,
          width: l,
          x: c,
          travellerWidth: f,
          startIndex: v,
          endIndex: h
        }) : {
          scale: null,
          scaleValues: null
        });
      if (a.scale && (l !== a.prevWidth || c !== a.prevX || f !== a.prevTravellerWidth)) {
        a.scale.range([c, c + l - f]);
        var m = a.scale.domain().map(function(x) {
          return a.scale(x);
        });
        return {
          prevData: u,
          prevTravellerWidth: f,
          prevUpdateId: d,
          prevX: c,
          prevWidth: l,
          startX: a.scale(n.startIndex),
          endX: a.scale(n.endIndex),
          scaleValues: m
        };
      }
      return null;
    }
  }, {
    key: "getIndexInRange",
    value: function(n, a) {
      for (var u = n.length, l = 0, c = u - 1; c - l > 1; ) {
        var f = Math.floor((l + c) / 2);
        n[f] > a ? c = f : l = f;
      }
      return a >= n[c] ? c : l;
    }
  }]);
})(V.PureComponent);
Yt(Oa, "displayName", "Brush");
Yt(Oa, "defaultProps", {
  height: 40,
  travellerWidth: 5,
  gap: 1,
  fill: "#fff",
  stroke: "#666",
  padding: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  },
  leaveTimeOut: 1e3,
  alwaysShowText: !1
});
var Sy, JP;
function E4() {
  if (JP) return Sy;
  JP = 1;
  var e = _g();
  function t(r, n) {
    var a;
    return e(r, function(u, l, c) {
      return a = n(u, l, c), !a;
    }), !!a;
  }
  return Sy = t, Sy;
}
var _y, eA;
function T4() {
  if (eA) return _y;
  eA = 1;
  var e = _E(), t = Wn(), r = E4(), n = Wt(), a = Sc();
  function u(l, c, f) {
    var d = n(l) ? e : r;
    return f && a(l, c, f) && (c = void 0), d(l, t(c, 3));
  }
  return _y = u, _y;
}
var C4 = T4();
const k4 = /* @__PURE__ */ Fe(C4);
var Wr = function(t, r) {
  var n = t.alwaysShow, a = t.ifOverflow;
  return n && (a = "extendDomain"), a === r;
}, Oy, tA;
function j4() {
  if (tA) return Oy;
  tA = 1;
  var e = zE();
  function t(r, n, a) {
    n == "__proto__" && e ? e(r, n, {
      configurable: !0,
      enumerable: !0,
      value: a,
      writable: !0
    }) : r[n] = a;
  }
  return Oy = t, Oy;
}
var Py, rA;
function M4() {
  if (rA) return Py;
  rA = 1;
  var e = j4(), t = qE(), r = Wn();
  function n(a, u) {
    var l = {};
    return u = r(u, 3), t(a, function(c, f, d) {
      e(l, f, u(c, f, d));
    }), l;
  }
  return Py = n, Py;
}
var I4 = M4();
const $4 = /* @__PURE__ */ Fe(I4);
var Ay, nA;
function N4() {
  if (nA) return Ay;
  nA = 1;
  function e(t, r) {
    for (var n = -1, a = t == null ? 0 : t.length; ++n < a; )
      if (!r(t[n], n, t))
        return !1;
    return !0;
  }
  return Ay = e, Ay;
}
var Ey, iA;
function R4() {
  if (iA) return Ey;
  iA = 1;
  var e = _g();
  function t(r, n) {
    var a = !0;
    return e(r, function(u, l, c) {
      return a = !!n(u, l, c), a;
    }), a;
  }
  return Ey = t, Ey;
}
var Ty, aA;
function D4() {
  if (aA) return Ty;
  aA = 1;
  var e = N4(), t = R4(), r = Wn(), n = Wt(), a = Sc();
  function u(l, c, f) {
    var d = n(l) ? e : t;
    return f && a(l, c, f) && (c = void 0), d(l, r(c, 3));
  }
  return Ty = u, Ty;
}
var L4 = D4();
const hC = /* @__PURE__ */ Fe(L4);
var q4 = ["x", "y"];
function ju(e) {
  "@babel/helpers - typeof";
  return ju = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ju(e);
}
function Rm() {
  return Rm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Rm.apply(this, arguments);
}
function oA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Fo(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? oA(Object(r), !0).forEach(function(n) {
      B4(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : oA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function B4(e, t, r) {
  return t = z4(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function z4(e) {
  var t = F4(e, "string");
  return ju(t) == "symbol" ? t : t + "";
}
function F4(e, t) {
  if (ju(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ju(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function U4(e, t) {
  if (e == null) return {};
  var r = W4(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function W4(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function H4(e, t) {
  var r = e.x, n = e.y, a = U4(e, q4), u = "".concat(r), l = parseInt(u, 10), c = "".concat(n), f = parseInt(c, 10), d = "".concat(t.height || a.height), v = parseInt(d, 10), h = "".concat(t.width || a.width), m = parseInt(h, 10);
  return Fo(Fo(Fo(Fo(Fo({}, t), a), l ? {
    x: l
  } : {}), f ? {
    y: f
  } : {}), {}, {
    height: v,
    width: m,
    name: t.name,
    radius: t.radius
  });
}
function uA(e) {
  return /* @__PURE__ */ $.createElement($m, Rm({
    shapeType: "rectangle",
    propTransformer: H4,
    activeClassName: "recharts-active-bar"
  }, e));
}
var K4 = function(t) {
  var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return function(n, a) {
    if (typeof t == "number") return t;
    var u = le(n) || t2(n);
    return u ? t(n, a) : (u || _i(), r);
  };
}, G4 = ["value", "background"], vC;
function Pa(e) {
  "@babel/helpers - typeof";
  return Pa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pa(e);
}
function V4(e, t) {
  if (e == null) return {};
  var r = X4(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function X4(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Xs() {
  return Xs = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Xs.apply(this, arguments);
}
function lA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ot(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? lA(Object(r), !0).forEach(function(n) {
      Bn(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : lA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Y4(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function sA(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, mC(n.key), n);
  }
}
function Q4(e, t, r) {
  return t && sA(e.prototype, t), r && sA(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Z4(e, t, r) {
  return t = Ys(t), J4(e, yC() ? Reflect.construct(t, r || [], Ys(e).constructor) : t.apply(e, r));
}
function J4(e, t) {
  if (t && (Pa(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return e8(e);
}
function e8(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function yC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (yC = function() {
    return !!e;
  })();
}
function Ys(e) {
  return Ys = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Ys(e);
}
function t8(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Dm(e, t);
}
function Dm(e, t) {
  return Dm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Dm(e, t);
}
function Bn(e, t, r) {
  return t = mC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function mC(e) {
  var t = r8(e, "string");
  return Pa(t) == "symbol" ? t : t + "";
}
function r8(e, t) {
  if (Pa(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Pa(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var pn = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    Y4(this, t);
    for (var n = arguments.length, a = new Array(n), u = 0; u < n; u++)
      a[u] = arguments[u];
    return r = Z4(this, t, [].concat(a)), Bn(r, "state", {
      isAnimationFinished: !1
    }), Bn(r, "id", Ei("recharts-bar-")), Bn(r, "handleAnimationEnd", function() {
      var l = r.props.onAnimationEnd;
      r.setState({
        isAnimationFinished: !0
      }), l && l();
    }), Bn(r, "handleAnimationStart", function() {
      var l = r.props.onAnimationStart;
      r.setState({
        isAnimationFinished: !1
      }), l && l();
    }), r;
  }
  return t8(t, e), Q4(t, [{
    key: "renderRectanglesStatically",
    value: function(n) {
      var a = this, u = this.props, l = u.shape, c = u.dataKey, f = u.activeIndex, d = u.activeBar, v = Ae(this.props, !1);
      return n && n.map(function(h, m) {
        var x = m === f, S = x ? d : l, w = ot(ot(ot({}, v), h), {}, {
          isActive: x,
          option: S,
          index: m,
          dataKey: c,
          onAnimationStart: a.handleAnimationStart,
          onAnimationEnd: a.handleAnimationEnd
        });
        return /* @__PURE__ */ $.createElement(Ne, Xs({
          className: "recharts-bar-rectangle"
        }, eu(a.props, h, m), {
          // https://github.com/recharts/recharts/issues/5415
          // eslint-disable-next-line react/no-array-index-key
          key: "rectangle-".concat(h?.x, "-").concat(h?.y, "-").concat(h?.value, "-").concat(m)
        }), /* @__PURE__ */ $.createElement(uA, w));
      });
    }
  }, {
    key: "renderRectanglesWithAnimation",
    value: function() {
      var n = this, a = this.props, u = a.data, l = a.layout, c = a.isAnimationActive, f = a.animationBegin, d = a.animationDuration, v = a.animationEasing, h = a.animationId, m = this.state.prevData;
      return /* @__PURE__ */ $.createElement(Tr, {
        begin: f,
        duration: d,
        isActive: c,
        easing: v,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "bar-".concat(h),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(x) {
        var S = x.t, w = u.map(function(b, P) {
          var C = m && m[P];
          if (C) {
            var A = it(C.x, b.x), T = it(C.y, b.y), _ = it(C.width, b.width), O = it(C.height, b.height);
            return ot(ot({}, b), {}, {
              x: A(S),
              y: T(S),
              width: _(S),
              height: O(S)
            });
          }
          if (l === "horizontal") {
            var k = it(0, b.height), M = k(S);
            return ot(ot({}, b), {}, {
              y: b.y + b.height - M,
              height: M
            });
          }
          var N = it(0, b.width), W = N(S);
          return ot(ot({}, b), {}, {
            width: W
          });
        });
        return /* @__PURE__ */ $.createElement(Ne, null, n.renderRectanglesStatically(w));
      });
    }
  }, {
    key: "renderRectangles",
    value: function() {
      var n = this.props, a = n.data, u = n.isAnimationActive, l = this.state.prevData;
      return u && a && a.length && (!l || !wi(l, a)) ? this.renderRectanglesWithAnimation() : this.renderRectanglesStatically(a);
    }
  }, {
    key: "renderBackground",
    value: function() {
      var n = this, a = this.props, u = a.data, l = a.dataKey, c = a.activeIndex, f = Ae(this.props.background, !1);
      return u.map(function(d, v) {
        d.value;
        var h = d.background, m = V4(d, G4);
        if (!h)
          return null;
        var x = ot(ot(ot(ot(ot({}, m), {}, {
          fill: "#eee"
        }, h), f), eu(n.props, d, v)), {}, {
          onAnimationStart: n.handleAnimationStart,
          onAnimationEnd: n.handleAnimationEnd,
          dataKey: l,
          index: v,
          className: "recharts-bar-background-rectangle"
        });
        return /* @__PURE__ */ $.createElement(uA, Xs({
          key: "background-bar-".concat(v),
          option: n.props.background,
          isActive: v === c
        }, x));
      });
    }
  }, {
    key: "renderErrorBar",
    value: function(n, a) {
      if (this.props.isAnimationActive && !this.state.isAnimationFinished)
        return null;
      var u = this.props, l = u.data, c = u.xAxis, f = u.yAxis, d = u.layout, v = u.children, h = Ut(v, Ha);
      if (!h)
        return null;
      var m = d === "vertical" ? l[0].height / 2 : l[0].width / 2, x = function(b, P) {
        var C = Array.isArray(b.value) ? b.value[1] : b.value;
        return {
          x: b.x,
          y: b.y,
          value: C,
          errorVal: pt(b, P)
        };
      }, S = {
        clipPath: n ? "url(#clipPath-".concat(a, ")") : null
      };
      return /* @__PURE__ */ $.createElement(Ne, S, h.map(function(w) {
        return /* @__PURE__ */ $.cloneElement(w, {
          key: "error-bar-".concat(a, "-").concat(w.props.dataKey),
          data: l,
          xAxis: c,
          yAxis: f,
          layout: d,
          offset: m,
          dataPointFormatter: x
        });
      }));
    }
  }, {
    key: "render",
    value: function() {
      var n = this.props, a = n.hide, u = n.data, l = n.className, c = n.xAxis, f = n.yAxis, d = n.left, v = n.top, h = n.width, m = n.height, x = n.isAnimationActive, S = n.background, w = n.id;
      if (a || !u || !u.length)
        return null;
      var b = this.state.isAnimationFinished, P = ke("recharts-bar", l), C = c && c.allowDataOverflow, A = f && f.allowDataOverflow, T = C || A, _ = _e(w) ? this.id : w;
      return /* @__PURE__ */ $.createElement(Ne, {
        className: P
      }, C || A ? /* @__PURE__ */ $.createElement("defs", null, /* @__PURE__ */ $.createElement("clipPath", {
        id: "clipPath-".concat(_)
      }, /* @__PURE__ */ $.createElement("rect", {
        x: C ? d : d - h / 2,
        y: A ? v : v - m / 2,
        width: C ? h : h * 2,
        height: A ? m : m * 2
      }))) : null, /* @__PURE__ */ $.createElement(Ne, {
        className: "recharts-bar-rectangles",
        clipPath: T ? "url(#clipPath-".concat(_, ")") : null
      }, S ? this.renderBackground() : null, this.renderRectangles()), this.renderErrorBar(T, _), (!x || b) && Ur.renderCallByParent(this.props, u));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function(n, a) {
      return n.animationId !== a.prevAnimationId ? {
        prevAnimationId: n.animationId,
        curData: n.data,
        prevData: a.curData
      } : n.data !== a.curData ? {
        curData: n.data
      } : null;
    }
  }]);
})(V.PureComponent);
vC = pn;
Bn(pn, "displayName", "Bar");
Bn(pn, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  legendType: "rect",
  minPointSize: 0,
  hide: !1,
  data: [],
  layout: "vertical",
  activeBar: !1,
  isAnimationActive: !Hn.isSsr,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: "ease"
});
Bn(pn, "getComposedData", function(e) {
  var t = e.props, r = e.item, n = e.barPosition, a = e.bandSize, u = e.xAxis, l = e.yAxis, c = e.xAxisTicks, f = e.yAxisTicks, d = e.stackedData, v = e.dataStartIndex, h = e.displayedData, m = e.offset, x = wB(n, r);
  if (!x)
    return null;
  var S = t.layout, w = r.type.defaultProps, b = w !== void 0 ? ot(ot({}, w), r.props) : r.props, P = b.dataKey, C = b.children, A = b.minPointSize, T = S === "horizontal" ? l : u, _ = d ? T.scale.domain() : null, O = CB({
    numericAxis: T
  }), k = Ut(C, Ag), M = h.map(function(N, W) {
    var R, q, F, X, G, Y;
    d ? R = SB(d[v + W], _) : (R = pt(N, P), Array.isArray(R) || (R = [O, R]));
    var ee = K4(A, vC.defaultProps.minPointSize)(R[1], W);
    if (S === "horizontal") {
      var H, Q = [l.scale(R[0]), l.scale(R[1])], J = Q[0], I = Q[1];
      q = KO({
        axis: u,
        ticks: c,
        bandSize: a,
        offset: x.offset,
        entry: N,
        index: W
      }), F = (H = I ?? J) !== null && H !== void 0 ? H : void 0, X = x.size;
      var B = J - I;
      if (G = Number.isNaN(B) ? 0 : B, Y = {
        x: q,
        y: l.y,
        width: X,
        height: l.height
      }, Math.abs(ee) > 0 && Math.abs(G) < Math.abs(ee)) {
        var ue = Er(G || ee) * (Math.abs(ee) - Math.abs(G));
        F -= ue, G += ue;
      }
    } else {
      var pe = [u.scale(R[0]), u.scale(R[1])], me = pe[0], Se = pe[1];
      if (q = me, F = KO({
        axis: l,
        ticks: f,
        bandSize: a,
        offset: x.offset,
        entry: N,
        index: W
      }), X = Se - me, G = x.size, Y = {
        x: u.x,
        y: F,
        width: u.width,
        height: G
      }, Math.abs(ee) > 0 && Math.abs(X) < Math.abs(ee)) {
        var je = Er(X || ee) * (Math.abs(ee) - Math.abs(X));
        X += je;
      }
    }
    return ot(ot(ot({}, N), {}, {
      x: q,
      y: F,
      width: X,
      height: G,
      value: d ? R : R[1],
      payload: N,
      background: Y
    }, k && k[W] && k[W].props), {}, {
      tooltipPayload: [JT(r, N)],
      tooltipPosition: {
        x: q + X / 2,
        y: F + G / 2
      }
    });
  });
  return ot({
    data: M,
    layout: S
  }, m);
});
function Mu(e) {
  "@babel/helpers - typeof";
  return Mu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Mu(e);
}
function n8(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function cA(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, gC(n.key), n);
  }
}
function i8(e, t, r) {
  return t && cA(e.prototype, t), r && cA(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function fA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Or(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? fA(Object(r), !0).forEach(function(n) {
      Nc(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : fA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Nc(e, t, r) {
  return t = gC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function gC(e) {
  var t = a8(e, "string");
  return Mu(t) == "symbol" ? t : t + "";
}
function a8(e, t) {
  if (Mu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Mu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Rc = function(t, r, n, a, u) {
  var l = t.width, c = t.height, f = t.layout, d = t.children, v = Object.keys(r), h = {
    left: n.left,
    leftMirror: n.left,
    right: l - n.right,
    rightMirror: l - n.right,
    top: n.top,
    topMirror: n.top,
    bottom: c - n.bottom,
    bottomMirror: c - n.bottom
  }, m = !!Qt(d, pn);
  return v.reduce(function(x, S) {
    var w = r[S], b = w.orientation, P = w.domain, C = w.padding, A = C === void 0 ? {} : C, T = w.mirror, _ = w.reversed, O = "".concat(b).concat(T ? "Mirror" : ""), k, M, N, W, R;
    if (w.type === "number" && (w.padding === "gap" || w.padding === "no-gap")) {
      var q = P[1] - P[0], F = 1 / 0, X = w.categoricalDomain.sort(a2);
      if (X.forEach(function(pe, me) {
        me > 0 && (F = Math.min((pe || 0) - (X[me - 1] || 0), F));
      }), Number.isFinite(F)) {
        var G = F / q, Y = w.layout === "vertical" ? n.height : n.width;
        if (w.padding === "gap" && (k = G * Y / 2), w.padding === "no-gap") {
          var ee = xi(t.barCategoryGap, G * Y), H = G * Y / 2;
          k = H - ee - (H - ee) / Y * ee;
        }
      }
    }
    a === "xAxis" ? M = [n.left + (A.left || 0) + (k || 0), n.left + n.width - (A.right || 0) - (k || 0)] : a === "yAxis" ? M = f === "horizontal" ? [n.top + n.height - (A.bottom || 0), n.top + (A.top || 0)] : [n.top + (A.top || 0) + (k || 0), n.top + n.height - (A.bottom || 0) - (k || 0)] : M = w.range, _ && (M = [M[1], M[0]]);
    var Q = bB(w, u, m), J = Q.scale, I = Q.realScaleType;
    J.domain(P).range(M), xB(J);
    var B = TB(J, Or(Or({}, w), {}, {
      realScaleType: I
    }));
    a === "xAxis" ? (R = b === "top" && !T || b === "bottom" && T, N = n.left, W = h[O] - R * w.height) : a === "yAxis" && (R = b === "left" && !T || b === "right" && T, N = h[O] - R * w.width, W = n.top);
    var ue = Or(Or(Or({}, w), B), {}, {
      realScaleType: I,
      x: N,
      y: W,
      scale: J,
      width: a === "xAxis" ? n.width : w.width,
      height: a === "yAxis" ? n.height : w.height
    });
    return ue.bandSize = Ds(ue, B), !w.hide && a === "xAxis" ? h[O] += (R ? -1 : 1) * ue.height : w.hide || (h[O] += (R ? -1 : 1) * ue.width), Or(Or({}, x), {}, Nc({}, S, ue));
  }, {});
}, bC = function(t, r) {
  var n = t.x, a = t.y, u = r.x, l = r.y;
  return {
    x: Math.min(n, u),
    y: Math.min(a, l),
    width: Math.abs(u - n),
    height: Math.abs(l - a)
  };
}, o8 = function(t) {
  var r = t.x1, n = t.y1, a = t.x2, u = t.y2;
  return bC({
    x: r,
    y: n
  }, {
    x: a,
    y: u
  });
}, xC = /* @__PURE__ */ (function() {
  function e(t) {
    n8(this, e), this.scale = t;
  }
  return i8(e, [{
    key: "domain",
    get: function() {
      return this.scale.domain;
    }
  }, {
    key: "range",
    get: function() {
      return this.scale.range;
    }
  }, {
    key: "rangeMin",
    get: function() {
      return this.range()[0];
    }
  }, {
    key: "rangeMax",
    get: function() {
      return this.range()[1];
    }
  }, {
    key: "bandwidth",
    get: function() {
      return this.scale.bandwidth;
    }
  }, {
    key: "apply",
    value: function(r) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = n.bandAware, u = n.position;
      if (r !== void 0) {
        if (u)
          switch (u) {
            case "start":
              return this.scale(r);
            case "middle": {
              var l = this.bandwidth ? this.bandwidth() / 2 : 0;
              return this.scale(r) + l;
            }
            case "end": {
              var c = this.bandwidth ? this.bandwidth() : 0;
              return this.scale(r) + c;
            }
            default:
              return this.scale(r);
          }
        if (a) {
          var f = this.bandwidth ? this.bandwidth() / 2 : 0;
          return this.scale(r) + f;
        }
        return this.scale(r);
      }
    }
  }, {
    key: "isInRange",
    value: function(r) {
      var n = this.range(), a = n[0], u = n[n.length - 1];
      return a <= u ? r >= a && r <= u : r >= u && r <= a;
    }
  }], [{
    key: "create",
    value: function(r) {
      return new e(r);
    }
  }]);
})();
Nc(xC, "EPS", 1e-4);
var Jg = function(t) {
  var r = Object.keys(t).reduce(function(n, a) {
    return Or(Or({}, n), {}, Nc({}, a, xC.create(t[a])));
  }, {});
  return Or(Or({}, r), {}, {
    apply: function(a) {
      var u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, l = u.bandAware, c = u.position;
      return $4(a, function(f, d) {
        return r[d].apply(f, {
          bandAware: l,
          position: c
        });
      });
    },
    isInRange: function(a) {
      return hC(a, function(u, l) {
        return r[l].isInRange(u);
      });
    }
  });
};
function u8(e) {
  return (e % 180 + 180) % 180;
}
var l8 = function(t) {
  var r = t.width, n = t.height, a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, u = u8(a), l = u * Math.PI / 180, c = Math.atan(n / r), f = l > c && l < Math.PI - c ? n / Math.sin(l) : r / Math.cos(l);
  return Math.abs(f);
}, Cy, dA;
function s8() {
  if (dA) return Cy;
  dA = 1;
  var e = Wn(), t = Du(), r = xc();
  function n(a) {
    return function(u, l, c) {
      var f = Object(u);
      if (!t(u)) {
        var d = e(l, 3);
        u = r(u), l = function(h) {
          return d(f[h], h, f);
        };
      }
      var v = a(u, l, c);
      return v > -1 ? f[d ? u[v] : v] : void 0;
    };
  }
  return Cy = n, Cy;
}
var ky, pA;
function c8() {
  if (pA) return ky;
  pA = 1;
  var e = cC();
  function t(r) {
    var n = e(r), a = n % 1;
    return n === n ? a ? n - a : n : 0;
  }
  return ky = t, ky;
}
var jy, hA;
function f8() {
  if (hA) return jy;
  hA = 1;
  var e = $E(), t = Wn(), r = c8(), n = Math.max;
  function a(u, l, c) {
    var f = u == null ? 0 : u.length;
    if (!f)
      return -1;
    var d = c == null ? 0 : r(c);
    return d < 0 && (d = n(f + d, 0)), e(u, t(l, 3), d);
  }
  return jy = a, jy;
}
var My, vA;
function d8() {
  if (vA) return My;
  vA = 1;
  var e = s8(), t = f8(), r = e(t);
  return My = r, My;
}
var p8 = d8();
const h8 = /* @__PURE__ */ Fe(p8);
var v8 = XA();
const y8 = /* @__PURE__ */ Fe(v8);
var m8 = y8(function(e) {
  return {
    x: e.left,
    y: e.top,
    width: e.width,
    height: e.height
  };
}, function(e) {
  return ["l", e.left, "t", e.top, "w", e.width, "h", e.height].join("");
}), e0 = /* @__PURE__ */ V.createContext(void 0), t0 = /* @__PURE__ */ V.createContext(void 0), wC = /* @__PURE__ */ V.createContext(void 0), SC = /* @__PURE__ */ V.createContext({}), _C = /* @__PURE__ */ V.createContext(void 0), OC = /* @__PURE__ */ V.createContext(0), PC = /* @__PURE__ */ V.createContext(0), yA = function(t) {
  var r = t.state, n = r.xAxisMap, a = r.yAxisMap, u = r.offset, l = t.clipPathId, c = t.children, f = t.width, d = t.height, v = m8(u);
  return /* @__PURE__ */ $.createElement(e0.Provider, {
    value: n
  }, /* @__PURE__ */ $.createElement(t0.Provider, {
    value: a
  }, /* @__PURE__ */ $.createElement(SC.Provider, {
    value: u
  }, /* @__PURE__ */ $.createElement(wC.Provider, {
    value: v
  }, /* @__PURE__ */ $.createElement(_C.Provider, {
    value: l
  }, /* @__PURE__ */ $.createElement(OC.Provider, {
    value: d
  }, /* @__PURE__ */ $.createElement(PC.Provider, {
    value: f
  }, c)))))));
}, g8 = function() {
  return V.useContext(_C);
}, AC = function(t) {
  var r = V.useContext(e0);
  r == null && _i();
  var n = r[t];
  return n == null && _i(), n;
}, b8 = function() {
  var t = V.useContext(e0);
  return Ln(t);
}, x8 = function() {
  var t = V.useContext(t0), r = h8(t, function(n) {
    return hC(n.domain, Number.isFinite);
  });
  return r || Ln(t);
}, EC = function(t) {
  var r = V.useContext(t0);
  r == null && _i();
  var n = r[t];
  return n == null && _i(), n;
}, w8 = function() {
  var t = V.useContext(wC);
  return t;
}, S8 = function() {
  return V.useContext(SC);
}, r0 = function() {
  return V.useContext(PC);
}, n0 = function() {
  return V.useContext(OC);
};
function Aa(e) {
  "@babel/helpers - typeof";
  return Aa = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Aa(e);
}
function _8(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function O8(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, CC(n.key), n);
  }
}
function P8(e, t, r) {
  return t && O8(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function A8(e, t, r) {
  return t = Qs(t), E8(e, TC() ? Reflect.construct(t, r || [], Qs(e).constructor) : t.apply(e, r));
}
function E8(e, t) {
  if (t && (Aa(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return T8(e);
}
function T8(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function TC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (TC = function() {
    return !!e;
  })();
}
function Qs(e) {
  return Qs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Qs(e);
}
function C8(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Lm(e, t);
}
function Lm(e, t) {
  return Lm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Lm(e, t);
}
function mA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function gA(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? mA(Object(r), !0).forEach(function(n) {
      i0(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : mA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function i0(e, t, r) {
  return t = CC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function CC(e) {
  var t = k8(e, "string");
  return Aa(t) == "symbol" ? t : t + "";
}
function k8(e, t) {
  if (Aa(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Aa(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function j8(e, t) {
  return N8(e) || $8(e, t) || I8(e, t) || M8();
}
function M8() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function I8(e, t) {
  if (e) {
    if (typeof e == "string") return bA(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return bA(e, t);
  }
}
function bA(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function $8(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function N8(e) {
  if (Array.isArray(e)) return e;
}
function qm() {
  return qm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, qm.apply(this, arguments);
}
var R8 = function(t, r) {
  var n;
  return /* @__PURE__ */ $.isValidElement(t) ? n = /* @__PURE__ */ $.cloneElement(t, r) : Ee(t) ? n = t(r) : n = /* @__PURE__ */ $.createElement("line", qm({}, r, {
    className: "recharts-reference-line-line"
  })), n;
}, D8 = function(t, r, n, a, u, l, c, f, d) {
  var v = u.x, h = u.y, m = u.width, x = u.height;
  if (n) {
    var S = d.y, w = t.y.apply(S, {
      position: l
    });
    if (Wr(d, "discard") && !t.y.isInRange(w))
      return null;
    var b = [{
      x: v + m,
      y: w
    }, {
      x: v,
      y: w
    }];
    return f === "left" ? b.reverse() : b;
  }
  if (r) {
    var P = d.x, C = t.x.apply(P, {
      position: l
    });
    if (Wr(d, "discard") && !t.x.isInRange(C))
      return null;
    var A = [{
      x: C,
      y: h + x
    }, {
      x: C,
      y: h
    }];
    return c === "top" ? A.reverse() : A;
  }
  if (a) {
    var T = d.segment, _ = T.map(function(O) {
      return t.apply(O, {
        position: l
      });
    });
    return Wr(d, "discard") && k4(_, function(O) {
      return !t.isInRange(O);
    }) ? null : _;
  }
  return null;
};
function L8(e) {
  var t = e.x, r = e.y, n = e.segment, a = e.xAxisId, u = e.yAxisId, l = e.shape, c = e.className, f = e.alwaysShow, d = g8(), v = AC(a), h = EC(u), m = w8();
  if (!d || !m)
    return null;
  ln(f === void 0, 'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.');
  var x = Jg({
    x: v.scale,
    y: h.scale
  }), S = dt(t), w = dt(r), b = n && n.length === 2, P = D8(x, S, w, b, m, e.position, v.orientation, h.orientation, e);
  if (!P)
    return null;
  var C = j8(P, 2), A = C[0], T = A.x, _ = A.y, O = C[1], k = O.x, M = O.y, N = Wr(e, "hidden") ? "url(#".concat(d, ")") : void 0, W = gA(gA({
    clipPath: N
  }, Ae(e, !0)), {}, {
    x1: T,
    y1: _,
    x2: k,
    y2: M
  });
  return /* @__PURE__ */ $.createElement(Ne, {
    className: ke("recharts-reference-line", c)
  }, R8(l, W), kt.renderCallByParent(e, o8({
    x1: T,
    y1: _,
    x2: k,
    y2: M
  })));
}
var a0 = /* @__PURE__ */ (function(e) {
  function t() {
    return _8(this, t), A8(this, t, arguments);
  }
  return C8(t, e), P8(t, [{
    key: "render",
    value: function() {
      return /* @__PURE__ */ $.createElement(L8, this.props);
    }
  }]);
})($.Component);
i0(a0, "displayName", "ReferenceLine");
i0(a0, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  fill: "none",
  stroke: "#ccc",
  fillOpacity: 1,
  strokeWidth: 1,
  position: "middle"
});
function Bm() {
  return Bm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Bm.apply(this, arguments);
}
function Ea(e) {
  "@babel/helpers - typeof";
  return Ea = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ea(e);
}
function xA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function wA(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? xA(Object(r), !0).forEach(function(n) {
      Dc(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function q8(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function B8(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, jC(n.key), n);
  }
}
function z8(e, t, r) {
  return t && B8(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function F8(e, t, r) {
  return t = Zs(t), U8(e, kC() ? Reflect.construct(t, r || [], Zs(e).constructor) : t.apply(e, r));
}
function U8(e, t) {
  if (t && (Ea(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return W8(e);
}
function W8(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function kC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (kC = function() {
    return !!e;
  })();
}
function Zs(e) {
  return Zs = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Zs(e);
}
function H8(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && zm(e, t);
}
function zm(e, t) {
  return zm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, zm(e, t);
}
function Dc(e, t, r) {
  return t = jC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function jC(e) {
  var t = K8(e, "string");
  return Ea(t) == "symbol" ? t : t + "";
}
function K8(e, t) {
  if (Ea(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ea(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var G8 = function(t) {
  var r = t.x, n = t.y, a = t.xAxis, u = t.yAxis, l = Jg({
    x: a.scale,
    y: u.scale
  }), c = l.apply({
    x: r,
    y: n
  }, {
    bandAware: !0
  });
  return Wr(t, "discard") && !l.isInRange(c) ? null : c;
}, Lc = /* @__PURE__ */ (function(e) {
  function t() {
    return q8(this, t), F8(this, t, arguments);
  }
  return H8(t, e), z8(t, [{
    key: "render",
    value: function() {
      var n = this.props, a = n.x, u = n.y, l = n.r, c = n.alwaysShow, f = n.clipPathId, d = dt(a), v = dt(u);
      if (ln(c === void 0, 'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.'), !d || !v)
        return null;
      var h = G8(this.props);
      if (!h)
        return null;
      var m = h.x, x = h.y, S = this.props, w = S.shape, b = S.className, P = Wr(this.props, "hidden") ? "url(#".concat(f, ")") : void 0, C = wA(wA({
        clipPath: P
      }, Ae(this.props, !0)), {}, {
        cx: m,
        cy: x
      });
      return /* @__PURE__ */ $.createElement(Ne, {
        className: ke("recharts-reference-dot", b)
      }, t.renderDot(w, C), kt.renderCallByParent(this.props, {
        x: m - l,
        y: x - l,
        width: 2 * l,
        height: 2 * l
      }));
    }
  }]);
})($.Component);
Dc(Lc, "displayName", "ReferenceDot");
Dc(Lc, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: "#fff",
  stroke: "#ccc",
  fillOpacity: 1,
  strokeWidth: 1
});
Dc(Lc, "renderDot", function(e, t) {
  var r;
  return /* @__PURE__ */ $.isValidElement(e) ? r = /* @__PURE__ */ $.cloneElement(e, t) : Ee(e) ? r = e(t) : r = /* @__PURE__ */ $.createElement(Mc, Bm({}, t, {
    cx: t.cx,
    cy: t.cy,
    className: "recharts-reference-dot-dot"
  })), r;
});
function Fm() {
  return Fm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Fm.apply(this, arguments);
}
function Ta(e) {
  "@babel/helpers - typeof";
  return Ta = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ta(e);
}
function SA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function _A(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? SA(Object(r), !0).forEach(function(n) {
      qc(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : SA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function V8(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function X8(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, IC(n.key), n);
  }
}
function Y8(e, t, r) {
  return t && X8(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Q8(e, t, r) {
  return t = Js(t), Z8(e, MC() ? Reflect.construct(t, r || [], Js(e).constructor) : t.apply(e, r));
}
function Z8(e, t) {
  if (t && (Ta(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return J8(e);
}
function J8(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function MC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (MC = function() {
    return !!e;
  })();
}
function Js(e) {
  return Js = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, Js(e);
}
function e5(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Um(e, t);
}
function Um(e, t) {
  return Um = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Um(e, t);
}
function qc(e, t, r) {
  return t = IC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function IC(e) {
  var t = t5(e, "string");
  return Ta(t) == "symbol" ? t : t + "";
}
function t5(e, t) {
  if (Ta(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ta(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var r5 = function(t, r, n, a, u) {
  var l = u.x1, c = u.x2, f = u.y1, d = u.y2, v = u.xAxis, h = u.yAxis;
  if (!v || !h) return null;
  var m = Jg({
    x: v.scale,
    y: h.scale
  }), x = {
    x: t ? m.x.apply(l, {
      position: "start"
    }) : m.x.rangeMin,
    y: n ? m.y.apply(f, {
      position: "start"
    }) : m.y.rangeMin
  }, S = {
    x: r ? m.x.apply(c, {
      position: "end"
    }) : m.x.rangeMax,
    y: a ? m.y.apply(d, {
      position: "end"
    }) : m.y.rangeMax
  };
  return Wr(u, "discard") && (!m.isInRange(x) || !m.isInRange(S)) ? null : bC(x, S);
}, Bc = /* @__PURE__ */ (function(e) {
  function t() {
    return V8(this, t), Q8(this, t, arguments);
  }
  return e5(t, e), Y8(t, [{
    key: "render",
    value: function() {
      var n = this.props, a = n.x1, u = n.x2, l = n.y1, c = n.y2, f = n.className, d = n.alwaysShow, v = n.clipPathId;
      ln(d === void 0, 'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.');
      var h = dt(a), m = dt(u), x = dt(l), S = dt(c), w = this.props.shape;
      if (!h && !m && !x && !S && !w)
        return null;
      var b = r5(h, m, x, S, this.props);
      if (!b && !w)
        return null;
      var P = Wr(this.props, "hidden") ? "url(#".concat(v, ")") : void 0;
      return /* @__PURE__ */ $.createElement(Ne, {
        className: ke("recharts-reference-area", f)
      }, t.renderRect(w, _A(_A({
        clipPath: P
      }, Ae(this.props, !0)), b)), kt.renderCallByParent(this.props, b));
    }
  }]);
})($.Component);
qc(Bc, "displayName", "ReferenceArea");
qc(Bc, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: "#ccc",
  fillOpacity: 0.5,
  stroke: "none",
  strokeWidth: 1
});
qc(Bc, "renderRect", function(e, t) {
  var r;
  return /* @__PURE__ */ $.isValidElement(e) ? r = /* @__PURE__ */ $.cloneElement(e, t) : Ee(e) ? r = e(t) : r = /* @__PURE__ */ $.createElement(Zg, Fm({}, t, {
    className: "recharts-reference-area-rect"
  })), r;
});
function $C(e, t, r) {
  if (t < 1)
    return [];
  if (t === 1 && r === void 0)
    return e;
  for (var n = [], a = 0; a < e.length; a += t)
    n.push(e[a]);
  return n;
}
function n5(e, t, r) {
  var n = {
    width: e.width + t.width,
    height: e.height + t.height
  };
  return l8(n, r);
}
function i5(e, t, r) {
  var n = r === "width", a = e.x, u = e.y, l = e.width, c = e.height;
  return t === 1 ? {
    start: n ? a : u,
    end: n ? a + l : u + c
  } : {
    start: n ? a + l : u + c,
    end: n ? a : u
  };
}
function ec(e, t, r, n, a) {
  if (e * t < e * n || e * t > e * a)
    return !1;
  var u = r();
  return e * (t - e * u / 2 - n) >= 0 && e * (t + e * u / 2 - a) <= 0;
}
function a5(e, t) {
  return $C(e, t + 1);
}
function o5(e, t, r, n, a) {
  for (var u = (n || []).slice(), l = t.start, c = t.end, f = 0, d = 1, v = l, h = function() {
    var S = n?.[f];
    if (S === void 0)
      return {
        v: $C(n, d)
      };
    var w = f, b, P = function() {
      return b === void 0 && (b = r(S, w)), b;
    }, C = S.coordinate, A = f === 0 || ec(e, C, P, v, c);
    A || (f = 0, v = l, d += 1), A && (v = C + e * (P() / 2 + a), f += d);
  }, m; d <= u.length; )
    if (m = h(), m) return m.v;
  return [];
}
function Iu(e) {
  "@babel/helpers - typeof";
  return Iu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Iu(e);
}
function OA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ct(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? OA(Object(r), !0).forEach(function(n) {
      u5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : OA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function u5(e, t, r) {
  return t = l5(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function l5(e) {
  var t = s5(e, "string");
  return Iu(t) == "symbol" ? t : t + "";
}
function s5(e, t) {
  if (Iu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Iu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function c5(e, t, r, n, a) {
  for (var u = (n || []).slice(), l = u.length, c = t.start, f = t.end, d = function(m) {
    var x = u[m], S, w = function() {
      return S === void 0 && (S = r(x, m)), S;
    };
    if (m === l - 1) {
      var b = e * (x.coordinate + e * w() / 2 - f);
      u[m] = x = Ct(Ct({}, x), {}, {
        tickCoord: b > 0 ? x.coordinate - b * e : x.coordinate
      });
    } else
      u[m] = x = Ct(Ct({}, x), {}, {
        tickCoord: x.coordinate
      });
    var P = ec(e, x.tickCoord, w, c, f);
    P && (f = x.tickCoord - e * (w() / 2 + a), u[m] = Ct(Ct({}, x), {}, {
      isShow: !0
    }));
  }, v = l - 1; v >= 0; v--)
    d(v);
  return u;
}
function f5(e, t, r, n, a, u) {
  var l = (n || []).slice(), c = l.length, f = t.start, d = t.end;
  if (u) {
    var v = n[c - 1], h = r(v, c - 1), m = e * (v.coordinate + e * h / 2 - d);
    l[c - 1] = v = Ct(Ct({}, v), {}, {
      tickCoord: m > 0 ? v.coordinate - m * e : v.coordinate
    });
    var x = ec(e, v.tickCoord, function() {
      return h;
    }, f, d);
    x && (d = v.tickCoord - e * (h / 2 + a), l[c - 1] = Ct(Ct({}, v), {}, {
      isShow: !0
    }));
  }
  for (var S = u ? c - 1 : c, w = function(C) {
    var A = l[C], T, _ = function() {
      return T === void 0 && (T = r(A, C)), T;
    };
    if (C === 0) {
      var O = e * (A.coordinate - e * _() / 2 - f);
      l[C] = A = Ct(Ct({}, A), {}, {
        tickCoord: O < 0 ? A.coordinate - O * e : A.coordinate
      });
    } else
      l[C] = A = Ct(Ct({}, A), {}, {
        tickCoord: A.coordinate
      });
    var k = ec(e, A.tickCoord, _, f, d);
    k && (f = A.tickCoord + e * (_() / 2 + a), l[C] = Ct(Ct({}, A), {}, {
      isShow: !0
    }));
  }, b = 0; b < S; b++)
    w(b);
  return l;
}
function o0(e, t, r) {
  var n = e.tick, a = e.ticks, u = e.viewBox, l = e.minTickGap, c = e.orientation, f = e.interval, d = e.tickFormatter, v = e.unit, h = e.angle;
  if (!a || !a.length || !n)
    return [];
  if (le(f) || Hn.isSsr)
    return a5(a, typeof f == "number" && le(f) ? f : 0);
  var m = [], x = c === "top" || c === "bottom" ? "width" : "height", S = v && x === "width" ? Go(v, {
    fontSize: t,
    letterSpacing: r
  }) : {
    width: 0,
    height: 0
  }, w = function(A, T) {
    var _ = Ee(d) ? d(A.value, T) : A.value;
    return x === "width" ? n5(Go(_, {
      fontSize: t,
      letterSpacing: r
    }), S, h) : Go(_, {
      fontSize: t,
      letterSpacing: r
    })[x];
  }, b = a.length >= 2 ? Er(a[1].coordinate - a[0].coordinate) : 1, P = i5(u, b, x);
  return f === "equidistantPreserveStart" ? o5(b, P, w, a, l) : (f === "preserveStart" || f === "preserveStartEnd" ? m = f5(b, P, w, a, l, f === "preserveStartEnd") : m = c5(b, P, w, a, l), m.filter(function(C) {
    return C.isShow;
  }));
}
var d5 = ["viewBox"], p5 = ["viewBox"], h5 = ["ticks"];
function Ca(e) {
  "@babel/helpers - typeof";
  return Ca = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ca(e);
}
function ua() {
  return ua = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ua.apply(this, arguments);
}
function PA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ct(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? PA(Object(r), !0).forEach(function(n) {
      u0(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : PA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function Iy(e, t) {
  if (e == null) return {};
  var r = v5(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function v5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function y5(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function AA(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, RC(n.key), n);
  }
}
function m5(e, t, r) {
  return t && AA(e.prototype, t), r && AA(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function g5(e, t, r) {
  return t = tc(t), b5(e, NC() ? Reflect.construct(t, r || [], tc(e).constructor) : t.apply(e, r));
}
function b5(e, t) {
  if (t && (Ca(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return x5(e);
}
function x5(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function NC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (NC = function() {
    return !!e;
  })();
}
function tc(e) {
  return tc = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, tc(e);
}
function w5(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Wm(e, t);
}
function Wm(e, t) {
  return Wm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Wm(e, t);
}
function u0(e, t, r) {
  return t = RC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function RC(e) {
  var t = S5(e, "string");
  return Ca(t) == "symbol" ? t : t + "";
}
function S5(e, t) {
  if (Ca(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ca(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Ka = /* @__PURE__ */ (function(e) {
  function t(r) {
    var n;
    return y5(this, t), n = g5(this, t, [r]), n.state = {
      fontSize: "",
      letterSpacing: ""
    }, n;
  }
  return w5(t, e), m5(t, [{
    key: "shouldComponentUpdate",
    value: function(n, a) {
      var u = n.viewBox, l = Iy(n, d5), c = this.props, f = c.viewBox, d = Iy(c, p5);
      return !sa(u, f) || !sa(l, d) || !sa(a, this.state);
    }
  }, {
    key: "componentDidMount",
    value: function() {
      var n = this.layerReference;
      if (n) {
        var a = n.getElementsByClassName("recharts-cartesian-axis-tick-value")[0];
        a && this.setState({
          fontSize: window.getComputedStyle(a).fontSize,
          letterSpacing: window.getComputedStyle(a).letterSpacing
        });
      }
    }
    /**
     * Calculate the coordinates of endpoints in ticks
     * @param  {Object} data The data of a simple tick
     * @return {Object} (x1, y1): The coordinate of endpoint close to tick text
     *  (x2, y2): The coordinate of endpoint close to axis
     */
  }, {
    key: "getTickLineCoord",
    value: function(n) {
      var a = this.props, u = a.x, l = a.y, c = a.width, f = a.height, d = a.orientation, v = a.tickSize, h = a.mirror, m = a.tickMargin, x, S, w, b, P, C, A = h ? -1 : 1, T = n.tickSize || v, _ = le(n.tickCoord) ? n.tickCoord : n.coordinate;
      switch (d) {
        case "top":
          x = S = n.coordinate, b = l + +!h * f, w = b - A * T, C = w - A * m, P = _;
          break;
        case "left":
          w = b = n.coordinate, S = u + +!h * c, x = S - A * T, P = x - A * m, C = _;
          break;
        case "right":
          w = b = n.coordinate, S = u + +h * c, x = S + A * T, P = x + A * m, C = _;
          break;
        default:
          x = S = n.coordinate, b = l + +h * f, w = b + A * T, C = w + A * m, P = _;
          break;
      }
      return {
        line: {
          x1: x,
          y1: w,
          x2: S,
          y2: b
        },
        tick: {
          x: P,
          y: C
        }
      };
    }
  }, {
    key: "getTickTextAnchor",
    value: function() {
      var n = this.props, a = n.orientation, u = n.mirror, l;
      switch (a) {
        case "left":
          l = u ? "start" : "end";
          break;
        case "right":
          l = u ? "end" : "start";
          break;
        default:
          l = "middle";
          break;
      }
      return l;
    }
  }, {
    key: "getTickVerticalAnchor",
    value: function() {
      var n = this.props, a = n.orientation, u = n.mirror, l = "end";
      switch (a) {
        case "left":
        case "right":
          l = "middle";
          break;
        case "top":
          l = u ? "start" : "end";
          break;
        default:
          l = u ? "end" : "start";
          break;
      }
      return l;
    }
  }, {
    key: "renderAxisLine",
    value: function() {
      var n = this.props, a = n.x, u = n.y, l = n.width, c = n.height, f = n.orientation, d = n.mirror, v = n.axisLine, h = ct(ct(ct({}, Ae(this.props, !1)), Ae(v, !1)), {}, {
        fill: "none"
      });
      if (f === "top" || f === "bottom") {
        var m = +(f === "top" && !d || f === "bottom" && d);
        h = ct(ct({}, h), {}, {
          x1: a,
          y1: u + m * c,
          x2: a + l,
          y2: u + m * c
        });
      } else {
        var x = +(f === "left" && !d || f === "right" && d);
        h = ct(ct({}, h), {}, {
          x1: a + x * l,
          y1: u,
          x2: a + x * l,
          y2: u + c
        });
      }
      return /* @__PURE__ */ $.createElement("line", ua({}, h, {
        className: ke("recharts-cartesian-axis-line", fr(v, "className"))
      }));
    }
  }, {
    key: "renderTicks",
    value: (
      /**
       * render the ticks
       * @param {Array} ticks The ticks to actually render (overrides what was passed in props)
       * @param {string} fontSize Fontsize to consider for tick spacing
       * @param {string} letterSpacing Letterspacing to consider for tick spacing
       * @return {ReactComponent} renderedTicks
       */
      function(n, a, u) {
        var l = this, c = this.props, f = c.tickLine, d = c.stroke, v = c.tick, h = c.tickFormatter, m = c.unit, x = o0(ct(ct({}, this.props), {}, {
          ticks: n
        }), a, u), S = this.getTickTextAnchor(), w = this.getTickVerticalAnchor(), b = Ae(this.props, !1), P = Ae(v, !1), C = ct(ct({}, b), {}, {
          fill: "none"
        }, Ae(f, !1)), A = x.map(function(T, _) {
          var O = l.getTickLineCoord(T), k = O.line, M = O.tick, N = ct(ct(ct(ct({
            textAnchor: S,
            verticalAnchor: w
          }, b), {}, {
            stroke: "none",
            fill: d
          }, P), M), {}, {
            index: _,
            payload: T,
            visibleTicksCount: x.length,
            tickFormatter: h
          });
          return /* @__PURE__ */ $.createElement(Ne, ua({
            className: "recharts-cartesian-axis-tick",
            key: "tick-".concat(T.value, "-").concat(T.coordinate, "-").concat(T.tickCoord)
          }, eu(l.props, T, _)), f && /* @__PURE__ */ $.createElement("line", ua({}, C, k, {
            className: ke("recharts-cartesian-axis-tick-line", fr(f, "className"))
          })), v && t.renderTickItem(v, N, "".concat(Ee(h) ? h(T.value, _) : T.value).concat(m || "")));
        });
        return /* @__PURE__ */ $.createElement("g", {
          className: "recharts-cartesian-axis-ticks"
        }, A);
      }
    )
  }, {
    key: "render",
    value: function() {
      var n = this, a = this.props, u = a.axisLine, l = a.width, c = a.height, f = a.ticksGenerator, d = a.className, v = a.hide;
      if (v)
        return null;
      var h = this.props, m = h.ticks, x = Iy(h, h5), S = m;
      return Ee(f) && (S = m && m.length > 0 ? f(this.props) : f(x)), l <= 0 || c <= 0 || !S || !S.length ? null : /* @__PURE__ */ $.createElement(Ne, {
        className: ke("recharts-cartesian-axis", d),
        ref: function(b) {
          n.layerReference = b;
        }
      }, u && this.renderAxisLine(), this.renderTicks(S, this.state.fontSize, this.state.letterSpacing), kt.renderCallByParent(this.props));
    }
  }], [{
    key: "renderTickItem",
    value: function(n, a, u) {
      var l, c = ke(a.className, "recharts-cartesian-axis-tick-value");
      return /* @__PURE__ */ $.isValidElement(n) ? l = /* @__PURE__ */ $.cloneElement(n, ct(ct({}, a), {}, {
        className: c
      })) : Ee(n) ? l = n(ct(ct({}, a), {}, {
        className: c
      })) : l = /* @__PURE__ */ $.createElement(_s, ua({}, a, {
        className: "recharts-cartesian-axis-tick-value"
      }), u), l;
    }
  }]);
})(V.Component);
u0(Ka, "displayName", "CartesianAxis");
u0(Ka, "defaultProps", {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  // The orientation of axis
  orientation: "bottom",
  // The ticks
  ticks: [],
  stroke: "#666",
  tickLine: !0,
  axisLine: !0,
  tick: !0,
  mirror: !1,
  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: "preserveEnd"
});
var _5 = ["x1", "y1", "x2", "y2", "key"], O5 = ["offset"];
function Oi(e) {
  "@babel/helpers - typeof";
  return Oi = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Oi(e);
}
function EA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function jt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? EA(Object(r), !0).forEach(function(n) {
      P5(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : EA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function P5(e, t, r) {
  return t = A5(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function A5(e) {
  var t = E5(e, "string");
  return Oi(t) == "symbol" ? t : t + "";
}
function E5(e, t) {
  if (Oi(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Oi(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function hi() {
  return hi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, hi.apply(this, arguments);
}
function TA(e, t) {
  if (e == null) return {};
  var r = T5(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function T5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var C5 = function(t) {
  var r = t.fill;
  if (!r || r === "none")
    return null;
  var n = t.fillOpacity, a = t.x, u = t.y, l = t.width, c = t.height, f = t.ry;
  return /* @__PURE__ */ $.createElement("rect", {
    x: a,
    y: u,
    ry: f,
    width: l,
    height: c,
    stroke: "none",
    fill: r,
    fillOpacity: n,
    className: "recharts-cartesian-grid-bg"
  });
};
function DC(e, t) {
  var r;
  if (/* @__PURE__ */ $.isValidElement(e))
    r = /* @__PURE__ */ $.cloneElement(e, t);
  else if (Ee(e))
    r = e(t);
  else {
    var n = t.x1, a = t.y1, u = t.x2, l = t.y2, c = t.key, f = TA(t, _5), d = Ae(f, !1);
    d.offset;
    var v = TA(d, O5);
    r = /* @__PURE__ */ $.createElement("line", hi({}, v, {
      x1: n,
      y1: a,
      x2: u,
      y2: l,
      fill: "none",
      key: c
    }));
  }
  return r;
}
function k5(e) {
  var t = e.x, r = e.width, n = e.horizontal, a = n === void 0 ? !0 : n, u = e.horizontalPoints;
  if (!a || !u || !u.length)
    return null;
  var l = u.map(function(c, f) {
    var d = jt(jt({}, e), {}, {
      x1: t,
      y1: c,
      x2: t + r,
      y2: c,
      key: "line-".concat(f),
      index: f
    });
    return DC(a, d);
  });
  return /* @__PURE__ */ $.createElement("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, l);
}
function j5(e) {
  var t = e.y, r = e.height, n = e.vertical, a = n === void 0 ? !0 : n, u = e.verticalPoints;
  if (!a || !u || !u.length)
    return null;
  var l = u.map(function(c, f) {
    var d = jt(jt({}, e), {}, {
      x1: c,
      y1: t,
      x2: c,
      y2: t + r,
      key: "line-".concat(f),
      index: f
    });
    return DC(a, d);
  });
  return /* @__PURE__ */ $.createElement("g", {
    className: "recharts-cartesian-grid-vertical"
  }, l);
}
function M5(e) {
  var t = e.horizontalFill, r = e.fillOpacity, n = e.x, a = e.y, u = e.width, l = e.height, c = e.horizontalPoints, f = e.horizontal, d = f === void 0 ? !0 : f;
  if (!d || !t || !t.length)
    return null;
  var v = c.map(function(m) {
    return Math.round(m + a - a);
  }).sort(function(m, x) {
    return m - x;
  });
  a !== v[0] && v.unshift(0);
  var h = v.map(function(m, x) {
    var S = !v[x + 1], w = S ? a + l - m : v[x + 1] - m;
    if (w <= 0)
      return null;
    var b = x % t.length;
    return /* @__PURE__ */ $.createElement("rect", {
      key: "react-".concat(x),
      y: m,
      x: n,
      height: w,
      width: u,
      stroke: "none",
      fill: t[b],
      fillOpacity: r,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ $.createElement("g", {
    className: "recharts-cartesian-gridstripes-horizontal"
  }, h);
}
function I5(e) {
  var t = e.vertical, r = t === void 0 ? !0 : t, n = e.verticalFill, a = e.fillOpacity, u = e.x, l = e.y, c = e.width, f = e.height, d = e.verticalPoints;
  if (!r || !n || !n.length)
    return null;
  var v = d.map(function(m) {
    return Math.round(m + u - u);
  }).sort(function(m, x) {
    return m - x;
  });
  u !== v[0] && v.unshift(0);
  var h = v.map(function(m, x) {
    var S = !v[x + 1], w = S ? u + c - m : v[x + 1] - m;
    if (w <= 0)
      return null;
    var b = x % n.length;
    return /* @__PURE__ */ $.createElement("rect", {
      key: "react-".concat(x),
      x: m,
      y: l,
      width: w,
      height: f,
      stroke: "none",
      fill: n[b],
      fillOpacity: a,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ $.createElement("g", {
    className: "recharts-cartesian-gridstripes-vertical"
  }, h);
}
var $5 = function(t, r) {
  var n = t.xAxis, a = t.width, u = t.height, l = t.offset;
  return QT(o0(jt(jt(jt({}, Ka.defaultProps), n), {}, {
    ticks: on(n, !0),
    viewBox: {
      x: 0,
      y: 0,
      width: a,
      height: u
    }
  })), l.left, l.left + l.width, r);
}, N5 = function(t, r) {
  var n = t.yAxis, a = t.width, u = t.height, l = t.offset;
  return QT(o0(jt(jt(jt({}, Ka.defaultProps), n), {}, {
    ticks: on(n, !0),
    viewBox: {
      x: 0,
      y: 0,
      width: a,
      height: u
    }
  })), l.top, l.top + l.height, r);
}, ia = {
  horizontal: !0,
  vertical: !0,
  stroke: "#ccc",
  fill: "none",
  // The fill of colors of grid lines
  verticalFill: [],
  horizontalFill: []
};
function Ko(e) {
  var t, r, n, a, u, l, c = r0(), f = n0(), d = S8(), v = jt(jt({}, e), {}, {
    stroke: (t = e.stroke) !== null && t !== void 0 ? t : ia.stroke,
    fill: (r = e.fill) !== null && r !== void 0 ? r : ia.fill,
    horizontal: (n = e.horizontal) !== null && n !== void 0 ? n : ia.horizontal,
    horizontalFill: (a = e.horizontalFill) !== null && a !== void 0 ? a : ia.horizontalFill,
    vertical: (u = e.vertical) !== null && u !== void 0 ? u : ia.vertical,
    verticalFill: (l = e.verticalFill) !== null && l !== void 0 ? l : ia.verticalFill,
    x: le(e.x) ? e.x : d.left,
    y: le(e.y) ? e.y : d.top,
    width: le(e.width) ? e.width : d.width,
    height: le(e.height) ? e.height : d.height
  }), h = v.x, m = v.y, x = v.width, S = v.height, w = v.syncWithTicks, b = v.horizontalValues, P = v.verticalValues, C = b8(), A = x8();
  if (!le(x) || x <= 0 || !le(S) || S <= 0 || !le(h) || h !== +h || !le(m) || m !== +m)
    return null;
  var T = v.verticalCoordinatesGenerator || $5, _ = v.horizontalCoordinatesGenerator || N5, O = v.horizontalPoints, k = v.verticalPoints;
  if ((!O || !O.length) && Ee(_)) {
    var M = b && b.length, N = _({
      yAxis: A ? jt(jt({}, A), {}, {
        ticks: M ? b : A.ticks
      }) : void 0,
      width: c,
      height: f,
      offset: d
    }, M ? !0 : w);
    ln(Array.isArray(N), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(Oi(N), "]")), Array.isArray(N) && (O = N);
  }
  if ((!k || !k.length) && Ee(T)) {
    var W = P && P.length, R = T({
      xAxis: C ? jt(jt({}, C), {}, {
        ticks: W ? P : C.ticks
      }) : void 0,
      width: c,
      height: f,
      offset: d
    }, W ? !0 : w);
    ln(Array.isArray(R), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(Oi(R), "]")), Array.isArray(R) && (k = R);
  }
  return /* @__PURE__ */ $.createElement("g", {
    className: "recharts-cartesian-grid"
  }, /* @__PURE__ */ $.createElement(C5, {
    fill: v.fill,
    fillOpacity: v.fillOpacity,
    x: v.x,
    y: v.y,
    width: v.width,
    height: v.height,
    ry: v.ry
  }), /* @__PURE__ */ $.createElement(k5, hi({}, v, {
    offset: d,
    horizontalPoints: O,
    xAxis: C,
    yAxis: A
  })), /* @__PURE__ */ $.createElement(j5, hi({}, v, {
    offset: d,
    verticalPoints: k,
    xAxis: C,
    yAxis: A
  })), /* @__PURE__ */ $.createElement(M5, hi({}, v, {
    horizontalPoints: O
  })), /* @__PURE__ */ $.createElement(I5, hi({}, v, {
    verticalPoints: k
  })));
}
Ko.displayName = "CartesianGrid";
var R5 = ["type", "layout", "connectNulls", "ref"], D5 = ["key"];
function ka(e) {
  "@babel/helpers - typeof";
  return ka = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ka(e);
}
function CA(e, t) {
  if (e == null) return {};
  var r = L5(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function L5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Qo() {
  return Qo = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Qo.apply(this, arguments);
}
function kA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Xt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? kA(Object(r), !0).forEach(function(n) {
      Pr(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : kA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function aa(e) {
  return F5(e) || z5(e) || B5(e) || q5();
}
function q5() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function B5(e, t) {
  if (e) {
    if (typeof e == "string") return Hm(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Hm(e, t);
  }
}
function z5(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function F5(e) {
  if (Array.isArray(e)) return Hm(e);
}
function Hm(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function U5(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function jA(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, qC(n.key), n);
  }
}
function W5(e, t, r) {
  return t && jA(e.prototype, t), r && jA(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function H5(e, t, r) {
  return t = rc(t), K5(e, LC() ? Reflect.construct(t, r || [], rc(e).constructor) : t.apply(e, r));
}
function K5(e, t) {
  if (t && (ka(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return G5(e);
}
function G5(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function LC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (LC = function() {
    return !!e;
  })();
}
function rc(e) {
  return rc = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, rc(e);
}
function V5(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Km(e, t);
}
function Km(e, t) {
  return Km = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Km(e, t);
}
function Pr(e, t, r) {
  return t = qC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function qC(e) {
  var t = X5(e, "string");
  return ka(t) == "symbol" ? t : t + "";
}
function X5(e, t) {
  if (ka(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ka(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Pi = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    U5(this, t);
    for (var n = arguments.length, a = new Array(n), u = 0; u < n; u++)
      a[u] = arguments[u];
    return r = H5(this, t, [].concat(a)), Pr(r, "state", {
      isAnimationFinished: !0,
      totalLength: 0
    }), Pr(r, "generateSimpleStrokeDasharray", function(l, c) {
      return "".concat(c, "px ").concat(l - c, "px");
    }), Pr(r, "getStrokeDasharray", function(l, c, f) {
      var d = f.reduce(function(P, C) {
        return P + C;
      });
      if (!d)
        return r.generateSimpleStrokeDasharray(c, l);
      for (var v = Math.floor(l / d), h = l % d, m = c - l, x = [], S = 0, w = 0; S < f.length; w += f[S], ++S)
        if (w + f[S] > h) {
          x = [].concat(aa(f.slice(0, S)), [h - w]);
          break;
        }
      var b = x.length % 2 === 0 ? [0, m] : [m];
      return [].concat(aa(t.repeat(f, v)), aa(x), b).map(function(P) {
        return "".concat(P, "px");
      }).join(", ");
    }), Pr(r, "id", Ei("recharts-line-")), Pr(r, "pathRef", function(l) {
      r.mainCurve = l;
    }), Pr(r, "handleAnimationEnd", function() {
      r.setState({
        isAnimationFinished: !0
      }), r.props.onAnimationEnd && r.props.onAnimationEnd();
    }), Pr(r, "handleAnimationStart", function() {
      r.setState({
        isAnimationFinished: !1
      }), r.props.onAnimationStart && r.props.onAnimationStart();
    }), r;
  }
  return V5(t, e), W5(t, [{
    key: "componentDidMount",
    value: function() {
      if (this.props.isAnimationActive) {
        var n = this.getTotalLength();
        this.setState({
          totalLength: n
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function() {
      if (this.props.isAnimationActive) {
        var n = this.getTotalLength();
        n !== this.state.totalLength && this.setState({
          totalLength: n
        });
      }
    }
  }, {
    key: "getTotalLength",
    value: function() {
      var n = this.mainCurve;
      try {
        return n && n.getTotalLength && n.getTotalLength() || 0;
      } catch {
        return 0;
      }
    }
  }, {
    key: "renderErrorBar",
    value: function(n, a) {
      if (this.props.isAnimationActive && !this.state.isAnimationFinished)
        return null;
      var u = this.props, l = u.points, c = u.xAxis, f = u.yAxis, d = u.layout, v = u.children, h = Ut(v, Ha);
      if (!h)
        return null;
      var m = function(w, b) {
        return {
          x: w.x,
          y: w.y,
          value: w.value,
          errorVal: pt(w.payload, b)
        };
      }, x = {
        clipPath: n ? "url(#clipPath-".concat(a, ")") : null
      };
      return /* @__PURE__ */ $.createElement(Ne, x, h.map(function(S) {
        return /* @__PURE__ */ $.cloneElement(S, {
          key: "bar-".concat(S.props.dataKey),
          data: l,
          xAxis: c,
          yAxis: f,
          layout: d,
          dataPointFormatter: m
        });
      }));
    }
  }, {
    key: "renderDots",
    value: function(n, a, u) {
      var l = this.props.isAnimationActive;
      if (l && !this.state.isAnimationFinished)
        return null;
      var c = this.props, f = c.dot, d = c.points, v = c.dataKey, h = Ae(this.props, !1), m = Ae(f, !0), x = d.map(function(w, b) {
        var P = Xt(Xt(Xt({
          key: "dot-".concat(b),
          r: 3
        }, h), m), {}, {
          index: b,
          cx: w.x,
          cy: w.y,
          value: w.value,
          dataKey: v,
          payload: w.payload,
          points: d
        });
        return t.renderDotItem(f, P);
      }), S = {
        clipPath: n ? "url(#clipPath-".concat(a ? "" : "dots-").concat(u, ")") : null
      };
      return /* @__PURE__ */ $.createElement(Ne, Qo({
        className: "recharts-line-dots",
        key: "dots"
      }, S), x);
    }
  }, {
    key: "renderCurveStatically",
    value: function(n, a, u, l) {
      var c = this.props, f = c.type, d = c.layout, v = c.connectNulls;
      c.ref;
      var h = CA(c, R5), m = Xt(Xt(Xt({}, Ae(h, !0)), {}, {
        fill: "none",
        className: "recharts-line-curve",
        clipPath: a ? "url(#clipPath-".concat(u, ")") : null,
        points: n
      }, l), {}, {
        type: f,
        layout: d,
        connectNulls: v
      });
      return /* @__PURE__ */ $.createElement(gi, Qo({}, m, {
        pathRef: this.pathRef
      }));
    }
  }, {
    key: "renderCurveWithAnimation",
    value: function(n, a) {
      var u = this, l = this.props, c = l.points, f = l.strokeDasharray, d = l.isAnimationActive, v = l.animationBegin, h = l.animationDuration, m = l.animationEasing, x = l.animationId, S = l.animateNewValues, w = l.width, b = l.height, P = this.state, C = P.prevPoints, A = P.totalLength;
      return /* @__PURE__ */ $.createElement(Tr, {
        begin: v,
        duration: h,
        isActive: d,
        easing: m,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "line-".concat(x),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(T) {
        var _ = T.t;
        if (C) {
          var O = C.length / c.length, k = c.map(function(q, F) {
            var X = Math.floor(F * O);
            if (C[X]) {
              var G = C[X], Y = it(G.x, q.x), ee = it(G.y, q.y);
              return Xt(Xt({}, q), {}, {
                x: Y(_),
                y: ee(_)
              });
            }
            if (S) {
              var H = it(w * 2, q.x), Q = it(b / 2, q.y);
              return Xt(Xt({}, q), {}, {
                x: H(_),
                y: Q(_)
              });
            }
            return Xt(Xt({}, q), {}, {
              x: q.x,
              y: q.y
            });
          });
          return u.renderCurveStatically(k, n, a);
        }
        var M = it(0, A), N = M(_), W;
        if (f) {
          var R = "".concat(f).split(/[,\s]+/gim).map(function(q) {
            return parseFloat(q);
          });
          W = u.getStrokeDasharray(N, A, R);
        } else
          W = u.generateSimpleStrokeDasharray(A, N);
        return u.renderCurveStatically(c, n, a, {
          strokeDasharray: W
        });
      });
    }
  }, {
    key: "renderCurve",
    value: function(n, a) {
      var u = this.props, l = u.points, c = u.isAnimationActive, f = this.state, d = f.prevPoints, v = f.totalLength;
      return c && l && l.length && (!d && v > 0 || !wi(d, l)) ? this.renderCurveWithAnimation(n, a) : this.renderCurveStatically(l, n, a);
    }
  }, {
    key: "render",
    value: function() {
      var n, a = this.props, u = a.hide, l = a.dot, c = a.points, f = a.className, d = a.xAxis, v = a.yAxis, h = a.top, m = a.left, x = a.width, S = a.height, w = a.isAnimationActive, b = a.id;
      if (u || !c || !c.length)
        return null;
      var P = this.state.isAnimationFinished, C = c.length === 1, A = ke("recharts-line", f), T = d && d.allowDataOverflow, _ = v && v.allowDataOverflow, O = T || _, k = _e(b) ? this.id : b, M = (n = Ae(l, !1)) !== null && n !== void 0 ? n : {
        r: 3,
        strokeWidth: 2
      }, N = M.r, W = N === void 0 ? 3 : N, R = M.strokeWidth, q = R === void 0 ? 2 : R, F = eE(l) ? l : {}, X = F.clipDot, G = X === void 0 ? !0 : X, Y = W * 2 + q;
      return /* @__PURE__ */ $.createElement(Ne, {
        className: A
      }, T || _ ? /* @__PURE__ */ $.createElement("defs", null, /* @__PURE__ */ $.createElement("clipPath", {
        id: "clipPath-".concat(k)
      }, /* @__PURE__ */ $.createElement("rect", {
        x: T ? m : m - x / 2,
        y: _ ? h : h - S / 2,
        width: T ? x : x * 2,
        height: _ ? S : S * 2
      })), !G && /* @__PURE__ */ $.createElement("clipPath", {
        id: "clipPath-dots-".concat(k)
      }, /* @__PURE__ */ $.createElement("rect", {
        x: m - Y / 2,
        y: h - Y / 2,
        width: x + Y,
        height: S + Y
      }))) : null, !C && this.renderCurve(O, k), this.renderErrorBar(O, k), (C || l) && this.renderDots(O, G, k), (!w || P) && Ur.renderCallByParent(this.props, c));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function(n, a) {
      return n.animationId !== a.prevAnimationId ? {
        prevAnimationId: n.animationId,
        curPoints: n.points,
        prevPoints: a.curPoints
      } : n.points !== a.curPoints ? {
        curPoints: n.points
      } : null;
    }
  }, {
    key: "repeat",
    value: function(n, a) {
      for (var u = n.length % 2 !== 0 ? [].concat(aa(n), [0]) : n, l = [], c = 0; c < a; ++c)
        l = [].concat(aa(l), aa(u));
      return l;
    }
  }, {
    key: "renderDotItem",
    value: function(n, a) {
      var u;
      if (/* @__PURE__ */ $.isValidElement(n))
        u = /* @__PURE__ */ $.cloneElement(n, a);
      else if (Ee(n))
        u = n(a);
      else {
        var l = a.key, c = CA(a, D5), f = ke("recharts-line-dot", typeof n != "boolean" ? n.className : "");
        u = /* @__PURE__ */ $.createElement(Mc, Qo({
          key: l
        }, c, {
          className: f
        }));
      }
      return u;
    }
  }]);
})(V.PureComponent);
Pr(Pi, "displayName", "Line");
Pr(Pi, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  connectNulls: !1,
  activeDot: !0,
  dot: !0,
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  fill: "#fff",
  points: [],
  isAnimationActive: !Hn.isSsr,
  animateNewValues: !0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  hide: !1,
  label: !1
});
Pr(Pi, "getComposedData", function(e) {
  var t = e.props, r = e.xAxis, n = e.yAxis, a = e.xAxisTicks, u = e.yAxisTicks, l = e.dataKey, c = e.bandSize, f = e.displayedData, d = e.offset, v = t.layout, h = f.map(function(m, x) {
    var S = pt(m, l);
    return v === "horizontal" ? {
      x: wa({
        axis: r,
        ticks: a,
        bandSize: c,
        entry: m,
        index: x
      }),
      y: _e(S) ? null : n.scale(S),
      value: S,
      payload: m
    } : {
      x: _e(S) ? null : r.scale(S),
      y: wa({
        axis: n,
        ticks: u,
        bandSize: c,
        entry: m,
        index: x
      }),
      value: S,
      payload: m
    };
  });
  return Xt({
    points: h,
    layout: v
  }, d);
});
var Y5 = ["layout", "type", "stroke", "connectNulls", "isRange", "ref"], Q5 = ["key"], BC;
function ja(e) {
  "@babel/helpers - typeof";
  return ja = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ja(e);
}
function zC(e, t) {
  if (e == null) return {};
  var r = Z5(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function Z5(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function vi() {
  return vi = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, vi.apply(this, arguments);
}
function MA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Rn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? MA(Object(r), !0).forEach(function(n) {
      qr(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : MA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function J5(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function IA(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, UC(n.key), n);
  }
}
function e6(e, t, r) {
  return t && IA(e.prototype, t), r && IA(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function t6(e, t, r) {
  return t = nc(t), r6(e, FC() ? Reflect.construct(t, r || [], nc(e).constructor) : t.apply(e, r));
}
function r6(e, t) {
  if (t && (ja(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return n6(e);
}
function n6(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function FC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (FC = function() {
    return !!e;
  })();
}
function nc(e) {
  return nc = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, nc(e);
}
function i6(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Gm(e, t);
}
function Gm(e, t) {
  return Gm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Gm(e, t);
}
function qr(e, t, r) {
  return t = UC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function UC(e) {
  var t = a6(e, "string");
  return ja(t) == "symbol" ? t : t + "";
}
function a6(e, t) {
  if (ja(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ja(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Kr = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    J5(this, t);
    for (var n = arguments.length, a = new Array(n), u = 0; u < n; u++)
      a[u] = arguments[u];
    return r = t6(this, t, [].concat(a)), qr(r, "state", {
      isAnimationFinished: !0
    }), qr(r, "id", Ei("recharts-area-")), qr(r, "handleAnimationEnd", function() {
      var l = r.props.onAnimationEnd;
      r.setState({
        isAnimationFinished: !0
      }), Ee(l) && l();
    }), qr(r, "handleAnimationStart", function() {
      var l = r.props.onAnimationStart;
      r.setState({
        isAnimationFinished: !1
      }), Ee(l) && l();
    }), r;
  }
  return i6(t, e), e6(t, [{
    key: "renderDots",
    value: function(n, a, u) {
      var l = this.props.isAnimationActive, c = this.state.isAnimationFinished;
      if (l && !c)
        return null;
      var f = this.props, d = f.dot, v = f.points, h = f.dataKey, m = Ae(this.props, !1), x = Ae(d, !0), S = v.map(function(b, P) {
        var C = Rn(Rn(Rn({
          key: "dot-".concat(P),
          r: 3
        }, m), x), {}, {
          index: P,
          cx: b.x,
          cy: b.y,
          dataKey: h,
          value: b.value,
          payload: b.payload,
          points: v
        });
        return t.renderDotItem(d, C);
      }), w = {
        clipPath: n ? "url(#clipPath-".concat(a ? "" : "dots-").concat(u, ")") : null
      };
      return /* @__PURE__ */ $.createElement(Ne, vi({
        className: "recharts-area-dots"
      }, w), S);
    }
  }, {
    key: "renderHorizontalRect",
    value: function(n) {
      var a = this.props, u = a.baseLine, l = a.points, c = a.strokeWidth, f = l[0].x, d = l[l.length - 1].x, v = n * Math.abs(f - d), h = qn(l.map(function(m) {
        return m.y || 0;
      }));
      return le(u) && typeof u == "number" ? h = Math.max(u, h) : u && Array.isArray(u) && u.length && (h = Math.max(qn(u.map(function(m) {
        return m.y || 0;
      })), h)), le(h) ? /* @__PURE__ */ $.createElement("rect", {
        x: f < d ? f : f - v,
        y: 0,
        width: v,
        height: Math.floor(h + (c ? parseInt("".concat(c), 10) : 1))
      }) : null;
    }
  }, {
    key: "renderVerticalRect",
    value: function(n) {
      var a = this.props, u = a.baseLine, l = a.points, c = a.strokeWidth, f = l[0].y, d = l[l.length - 1].y, v = n * Math.abs(f - d), h = qn(l.map(function(m) {
        return m.x || 0;
      }));
      return le(u) && typeof u == "number" ? h = Math.max(u, h) : u && Array.isArray(u) && u.length && (h = Math.max(qn(u.map(function(m) {
        return m.x || 0;
      })), h)), le(h) ? /* @__PURE__ */ $.createElement("rect", {
        x: 0,
        y: f < d ? f : f - v,
        width: h + (c ? parseInt("".concat(c), 10) : 1),
        height: Math.floor(v)
      }) : null;
    }
  }, {
    key: "renderClipRect",
    value: function(n) {
      var a = this.props.layout;
      return a === "vertical" ? this.renderVerticalRect(n) : this.renderHorizontalRect(n);
    }
  }, {
    key: "renderAreaStatically",
    value: function(n, a, u, l) {
      var c = this.props, f = c.layout, d = c.type, v = c.stroke, h = c.connectNulls, m = c.isRange;
      c.ref;
      var x = zC(c, Y5);
      return /* @__PURE__ */ $.createElement(Ne, {
        clipPath: u ? "url(#clipPath-".concat(l, ")") : null
      }, /* @__PURE__ */ $.createElement(gi, vi({}, Ae(x, !0), {
        points: n,
        connectNulls: h,
        type: d,
        baseLine: a,
        layout: f,
        stroke: "none",
        className: "recharts-area-area"
      })), v !== "none" && /* @__PURE__ */ $.createElement(gi, vi({}, Ae(this.props, !1), {
        className: "recharts-area-curve",
        layout: f,
        type: d,
        connectNulls: h,
        fill: "none",
        points: n
      })), v !== "none" && m && /* @__PURE__ */ $.createElement(gi, vi({}, Ae(this.props, !1), {
        className: "recharts-area-curve",
        layout: f,
        type: d,
        connectNulls: h,
        fill: "none",
        points: a
      })));
    }
  }, {
    key: "renderAreaWithAnimation",
    value: function(n, a) {
      var u = this, l = this.props, c = l.points, f = l.baseLine, d = l.isAnimationActive, v = l.animationBegin, h = l.animationDuration, m = l.animationEasing, x = l.animationId, S = this.state, w = S.prevPoints, b = S.prevBaseLine;
      return /* @__PURE__ */ $.createElement(Tr, {
        begin: v,
        duration: h,
        isActive: d,
        easing: m,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "area-".concat(x),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(P) {
        var C = P.t;
        if (w) {
          var A = w.length / c.length, T = c.map(function(M, N) {
            var W = Math.floor(N * A);
            if (w[W]) {
              var R = w[W], q = it(R.x, M.x), F = it(R.y, M.y);
              return Rn(Rn({}, M), {}, {
                x: q(C),
                y: F(C)
              });
            }
            return M;
          }), _;
          if (le(f) && typeof f == "number") {
            var O = it(b, f);
            _ = O(C);
          } else if (_e(f) || Ba(f)) {
            var k = it(b, 0);
            _ = k(C);
          } else
            _ = f.map(function(M, N) {
              var W = Math.floor(N * A);
              if (b[W]) {
                var R = b[W], q = it(R.x, M.x), F = it(R.y, M.y);
                return Rn(Rn({}, M), {}, {
                  x: q(C),
                  y: F(C)
                });
              }
              return M;
            });
          return u.renderAreaStatically(T, _, n, a);
        }
        return /* @__PURE__ */ $.createElement(Ne, null, /* @__PURE__ */ $.createElement("defs", null, /* @__PURE__ */ $.createElement("clipPath", {
          id: "animationClipPath-".concat(a)
        }, u.renderClipRect(C))), /* @__PURE__ */ $.createElement(Ne, {
          clipPath: "url(#animationClipPath-".concat(a, ")")
        }, u.renderAreaStatically(c, f, n, a)));
      });
    }
  }, {
    key: "renderArea",
    value: function(n, a) {
      var u = this.props, l = u.points, c = u.baseLine, f = u.isAnimationActive, d = this.state, v = d.prevPoints, h = d.prevBaseLine, m = d.totalLength;
      return f && l && l.length && (!v && m > 0 || !wi(v, l) || !wi(h, c)) ? this.renderAreaWithAnimation(n, a) : this.renderAreaStatically(l, c, n, a);
    }
  }, {
    key: "render",
    value: function() {
      var n, a = this.props, u = a.hide, l = a.dot, c = a.points, f = a.className, d = a.top, v = a.left, h = a.xAxis, m = a.yAxis, x = a.width, S = a.height, w = a.isAnimationActive, b = a.id;
      if (u || !c || !c.length)
        return null;
      var P = this.state.isAnimationFinished, C = c.length === 1, A = ke("recharts-area", f), T = h && h.allowDataOverflow, _ = m && m.allowDataOverflow, O = T || _, k = _e(b) ? this.id : b, M = (n = Ae(l, !1)) !== null && n !== void 0 ? n : {
        r: 3,
        strokeWidth: 2
      }, N = M.r, W = N === void 0 ? 3 : N, R = M.strokeWidth, q = R === void 0 ? 2 : R, F = eE(l) ? l : {}, X = F.clipDot, G = X === void 0 ? !0 : X, Y = W * 2 + q;
      return /* @__PURE__ */ $.createElement(Ne, {
        className: A
      }, T || _ ? /* @__PURE__ */ $.createElement("defs", null, /* @__PURE__ */ $.createElement("clipPath", {
        id: "clipPath-".concat(k)
      }, /* @__PURE__ */ $.createElement("rect", {
        x: T ? v : v - x / 2,
        y: _ ? d : d - S / 2,
        width: T ? x : x * 2,
        height: _ ? S : S * 2
      })), !G && /* @__PURE__ */ $.createElement("clipPath", {
        id: "clipPath-dots-".concat(k)
      }, /* @__PURE__ */ $.createElement("rect", {
        x: v - Y / 2,
        y: d - Y / 2,
        width: x + Y,
        height: S + Y
      }))) : null, C ? null : this.renderArea(O, k), (l || C) && this.renderDots(O, G, k), (!w || P) && Ur.renderCallByParent(this.props, c));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function(n, a) {
      return n.animationId !== a.prevAnimationId ? {
        prevAnimationId: n.animationId,
        curPoints: n.points,
        curBaseLine: n.baseLine,
        prevPoints: a.curPoints,
        prevBaseLine: a.curBaseLine
      } : n.points !== a.curPoints || n.baseLine !== a.curBaseLine ? {
        curPoints: n.points,
        curBaseLine: n.baseLine
      } : null;
    }
  }]);
})(V.PureComponent);
BC = Kr;
qr(Kr, "displayName", "Area");
qr(Kr, "defaultProps", {
  stroke: "#3182bd",
  fill: "#3182bd",
  fillOpacity: 0.6,
  xAxisId: 0,
  yAxisId: 0,
  legendType: "line",
  connectNulls: !1,
  // points of area
  points: [],
  dot: !1,
  activeDot: !0,
  hide: !1,
  isAnimationActive: !Hn.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
});
qr(Kr, "getBaseValue", function(e, t, r, n) {
  var a = e.layout, u = e.baseValue, l = t.props.baseValue, c = l ?? u;
  if (le(c) && typeof c == "number")
    return c;
  var f = a === "horizontal" ? n : r, d = f.scale.domain();
  if (f.type === "number") {
    var v = Math.max(d[0], d[1]), h = Math.min(d[0], d[1]);
    return c === "dataMin" ? h : c === "dataMax" || v < 0 ? v : Math.max(Math.min(d[0], d[1]), 0);
  }
  return c === "dataMin" ? d[0] : c === "dataMax" ? d[1] : d[0];
});
qr(Kr, "getComposedData", function(e) {
  var t = e.props, r = e.item, n = e.xAxis, a = e.yAxis, u = e.xAxisTicks, l = e.yAxisTicks, c = e.bandSize, f = e.dataKey, d = e.stackedData, v = e.dataStartIndex, h = e.displayedData, m = e.offset, x = t.layout, S = d && d.length, w = BC.getBaseValue(t, r, n, a), b = x === "horizontal", P = !1, C = h.map(function(T, _) {
    var O;
    S ? O = d[v + _] : (O = pt(T, f), Array.isArray(O) ? P = !0 : O = [w, O]);
    var k = O[1] == null || S && pt(T, f) == null;
    return b ? {
      x: wa({
        axis: n,
        ticks: u,
        bandSize: c,
        entry: T,
        index: _
      }),
      y: k ? null : a.scale(O[1]),
      value: O,
      payload: T
    } : {
      x: k ? null : n.scale(O[1]),
      y: wa({
        axis: a,
        ticks: l,
        bandSize: c,
        entry: T,
        index: _
      }),
      value: O,
      payload: T
    };
  }), A;
  return S || P ? A = C.map(function(T) {
    var _ = Array.isArray(T.value) ? T.value[0] : null;
    return b ? {
      x: T.x,
      y: _ != null && T.y != null ? a.scale(_) : null
    } : {
      x: _ != null ? n.scale(_) : null,
      y: T.y
    };
  }) : A = b ? a.scale(w) : n.scale(w), Rn({
    points: C,
    baseLine: A,
    layout: x,
    isRange: P
  }, m);
});
qr(Kr, "renderDotItem", function(e, t) {
  var r;
  if (/* @__PURE__ */ $.isValidElement(e))
    r = /* @__PURE__ */ $.cloneElement(e, t);
  else if (Ee(e))
    r = e(t);
  else {
    var n = ke("recharts-area-dot", typeof e != "boolean" ? e.className : ""), a = t.key, u = zC(t, Q5);
    r = /* @__PURE__ */ $.createElement(Mc, vi({}, u, {
      key: a,
      className: n
    }));
  }
  return r;
});
function Ma(e) {
  "@babel/helpers - typeof";
  return Ma = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ma(e);
}
function o6(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function u6(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, KC(n.key), n);
  }
}
function l6(e, t, r) {
  return t && u6(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function s6(e, t, r) {
  return t = ic(t), c6(e, WC() ? Reflect.construct(t, r || [], ic(e).constructor) : t.apply(e, r));
}
function c6(e, t) {
  if (t && (Ma(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return f6(e);
}
function f6(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function WC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (WC = function() {
    return !!e;
  })();
}
function ic(e) {
  return ic = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, ic(e);
}
function d6(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Vm(e, t);
}
function Vm(e, t) {
  return Vm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Vm(e, t);
}
function HC(e, t, r) {
  return t = KC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function KC(e) {
  var t = p6(e, "string");
  return Ma(t) == "symbol" ? t : t + "";
}
function p6(e, t) {
  if (Ma(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ma(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var zc = /* @__PURE__ */ (function(e) {
  function t() {
    return o6(this, t), s6(this, t, arguments);
  }
  return d6(t, e), l6(t, [{
    key: "render",
    value: function() {
      return null;
    }
  }]);
})(V.Component);
HC(zc, "displayName", "ZAxis");
HC(zc, "defaultProps", {
  zAxisId: 0,
  range: [64, 64],
  scale: "auto",
  type: "number"
});
var h6 = ["option", "isActive"];
function Zo() {
  return Zo = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Zo.apply(this, arguments);
}
function v6(e, t) {
  if (e == null) return {};
  var r = y6(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function y6(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function m6(e) {
  var t = e.option, r = e.isActive, n = v6(e, h6);
  return typeof t == "string" ? /* @__PURE__ */ V.createElement($m, Zo({
    option: /* @__PURE__ */ V.createElement(bc, Zo({
      type: t
    }, n)),
    isActive: r,
    shapeType: "symbols"
  }, n)) : /* @__PURE__ */ V.createElement($m, Zo({
    option: t,
    isActive: r,
    shapeType: "symbols"
  }, n));
}
function Ia(e) {
  "@babel/helpers - typeof";
  return Ia = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ia(e);
}
function Jo() {
  return Jo = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Jo.apply(this, arguments);
}
function $A(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function sr(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? $A(Object(r), !0).forEach(function(n) {
      zn(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : $A(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function g6(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function NA(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, VC(n.key), n);
  }
}
function b6(e, t, r) {
  return t && NA(e.prototype, t), r && NA(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function x6(e, t, r) {
  return t = ac(t), w6(e, GC() ? Reflect.construct(t, r || [], ac(e).constructor) : t.apply(e, r));
}
function w6(e, t) {
  if (t && (Ia(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return S6(e);
}
function S6(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function GC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (GC = function() {
    return !!e;
  })();
}
function ac(e) {
  return ac = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, ac(e);
}
function _6(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Xm(e, t);
}
function Xm(e, t) {
  return Xm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Xm(e, t);
}
function zn(e, t, r) {
  return t = VC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function VC(e) {
  var t = O6(e, "string");
  return Ia(t) == "symbol" ? t : t + "";
}
function O6(e, t) {
  if (Ia(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ia(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Fc = /* @__PURE__ */ (function(e) {
  function t() {
    var r;
    g6(this, t);
    for (var n = arguments.length, a = new Array(n), u = 0; u < n; u++)
      a[u] = arguments[u];
    return r = x6(this, t, [].concat(a)), zn(r, "state", {
      isAnimationFinished: !1
    }), zn(r, "handleAnimationEnd", function() {
      r.setState({
        isAnimationFinished: !0
      });
    }), zn(r, "handleAnimationStart", function() {
      r.setState({
        isAnimationFinished: !1
      });
    }), zn(r, "id", Ei("recharts-scatter-")), r;
  }
  return _6(t, e), b6(t, [{
    key: "renderSymbolsStatically",
    value: function(n) {
      var a = this, u = this.props, l = u.shape, c = u.activeShape, f = u.activeIndex, d = Ae(this.props, !1);
      return n.map(function(v, h) {
        var m = f === h, x = m ? c : l, S = sr(sr({}, d), v);
        return /* @__PURE__ */ $.createElement(Ne, Jo({
          className: "recharts-scatter-symbol",
          key: "symbol-".concat(v?.cx, "-").concat(v?.cy, "-").concat(v?.size, "-").concat(h)
        }, eu(a.props, v, h), {
          role: "img"
        }), /* @__PURE__ */ $.createElement(m6, Jo({
          option: x,
          isActive: m,
          key: "symbol-".concat(h)
        }, S)));
      });
    }
  }, {
    key: "renderSymbolsWithAnimation",
    value: function() {
      var n = this, a = this.props, u = a.points, l = a.isAnimationActive, c = a.animationBegin, f = a.animationDuration, d = a.animationEasing, v = a.animationId, h = this.state.prevPoints;
      return /* @__PURE__ */ $.createElement(Tr, {
        begin: c,
        duration: f,
        isActive: l,
        easing: d,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "pie-".concat(v),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(m) {
        var x = m.t, S = u.map(function(w, b) {
          var P = h && h[b];
          if (P) {
            var C = it(P.cx, w.cx), A = it(P.cy, w.cy), T = it(P.size, w.size);
            return sr(sr({}, w), {}, {
              cx: C(x),
              cy: A(x),
              size: T(x)
            });
          }
          var _ = it(0, w.size);
          return sr(sr({}, w), {}, {
            size: _(x)
          });
        });
        return /* @__PURE__ */ $.createElement(Ne, null, n.renderSymbolsStatically(S));
      });
    }
  }, {
    key: "renderSymbols",
    value: function() {
      var n = this.props, a = n.points, u = n.isAnimationActive, l = this.state.prevPoints;
      return u && a && a.length && (!l || !wi(l, a)) ? this.renderSymbolsWithAnimation() : this.renderSymbolsStatically(a);
    }
  }, {
    key: "renderErrorBar",
    value: function() {
      var n = this.props.isAnimationActive;
      if (n && !this.state.isAnimationFinished)
        return null;
      var a = this.props, u = a.points, l = a.xAxis, c = a.yAxis, f = a.children, d = Ut(f, Ha);
      return d ? d.map(function(v, h) {
        var m = v.props, x = m.direction, S = m.dataKey;
        return /* @__PURE__ */ $.cloneElement(v, {
          key: "".concat(x, "-").concat(S, "-").concat(u[h]),
          data: u,
          xAxis: l,
          yAxis: c,
          layout: x === "x" ? "vertical" : "horizontal",
          dataPointFormatter: function(b, P) {
            return {
              x: b.cx,
              y: b.cy,
              value: x === "x" ? +b.node.x : +b.node.y,
              errorVal: pt(b, P)
            };
          }
        });
      }) : null;
    }
  }, {
    key: "renderLine",
    value: function() {
      var n = this.props, a = n.points, u = n.line, l = n.lineType, c = n.lineJointType, f = Ae(this.props, !1), d = Ae(u, !1), v, h;
      if (l === "joint")
        v = a.map(function(A) {
          return {
            x: A.cx,
            y: A.cy
          };
        });
      else if (l === "fitting") {
        var m = i2(a), x = m.xmin, S = m.xmax, w = m.a, b = m.b, P = function(T) {
          return w * T + b;
        };
        v = [{
          x,
          y: P(x)
        }, {
          x: S,
          y: P(S)
        }];
      }
      var C = sr(sr(sr({}, f), {}, {
        fill: "none",
        stroke: f && f.fill
      }, d), {}, {
        points: v
      });
      return /* @__PURE__ */ $.isValidElement(u) ? h = /* @__PURE__ */ $.cloneElement(u, C) : Ee(u) ? h = u(C) : h = /* @__PURE__ */ $.createElement(gi, Jo({}, C, {
        type: c
      })), /* @__PURE__ */ $.createElement(Ne, {
        className: "recharts-scatter-line",
        key: "recharts-scatter-line"
      }, h);
    }
  }, {
    key: "render",
    value: function() {
      var n = this.props, a = n.hide, u = n.points, l = n.line, c = n.className, f = n.xAxis, d = n.yAxis, v = n.left, h = n.top, m = n.width, x = n.height, S = n.id, w = n.isAnimationActive;
      if (a || !u || !u.length)
        return null;
      var b = this.state.isAnimationFinished, P = ke("recharts-scatter", c), C = f && f.allowDataOverflow, A = d && d.allowDataOverflow, T = C || A, _ = _e(S) ? this.id : S;
      return /* @__PURE__ */ $.createElement(Ne, {
        className: P,
        clipPath: T ? "url(#clipPath-".concat(_, ")") : null
      }, C || A ? /* @__PURE__ */ $.createElement("defs", null, /* @__PURE__ */ $.createElement("clipPath", {
        id: "clipPath-".concat(_)
      }, /* @__PURE__ */ $.createElement("rect", {
        x: C ? v : v - m / 2,
        y: A ? h : h - x / 2,
        width: C ? m : m * 2,
        height: A ? x : x * 2
      }))) : null, l && this.renderLine(), this.renderErrorBar(), /* @__PURE__ */ $.createElement(Ne, {
        key: "recharts-scatter-symbols"
      }, this.renderSymbols()), (!w || b) && Ur.renderCallByParent(this.props, u));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function(n, a) {
      return n.animationId !== a.prevAnimationId ? {
        prevAnimationId: n.animationId,
        curPoints: n.points,
        prevPoints: a.curPoints
      } : n.points !== a.curPoints ? {
        curPoints: n.points
      } : null;
    }
  }]);
})(V.PureComponent);
zn(Fc, "displayName", "Scatter");
zn(Fc, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  zAxisId: 0,
  legendType: "circle",
  lineType: "joint",
  lineJointType: "linear",
  data: [],
  shape: "circle",
  hide: !1,
  isAnimationActive: !Hn.isSsr,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: "linear"
});
zn(Fc, "getComposedData", function(e) {
  var t = e.xAxis, r = e.yAxis, n = e.zAxis, a = e.item, u = e.displayedData, l = e.xAxisTicks, c = e.yAxisTicks, f = e.offset, d = a.props.tooltipType, v = Ut(a.props.children, Ag), h = _e(t.dataKey) ? a.props.dataKey : t.dataKey, m = _e(r.dataKey) ? a.props.dataKey : r.dataKey, x = n && n.dataKey, S = n ? n.range : zc.defaultProps.range, w = S && S[0], b = t.scale.bandwidth ? t.scale.bandwidth() : 0, P = r.scale.bandwidth ? r.scale.bandwidth() : 0, C = u.map(function(A, T) {
    var _ = pt(A, h), O = pt(A, m), k = !_e(x) && pt(A, x) || "-", M = [{
      name: _e(t.dataKey) ? a.props.name : t.name || t.dataKey,
      unit: t.unit || "",
      value: _,
      payload: A,
      dataKey: h,
      type: d
    }, {
      name: _e(r.dataKey) ? a.props.name : r.name || r.dataKey,
      unit: r.unit || "",
      value: O,
      payload: A,
      dataKey: m,
      type: d
    }];
    k !== "-" && M.push({
      name: n.name || n.dataKey,
      unit: n.unit || "",
      value: k,
      payload: A,
      dataKey: x,
      type: d
    });
    var N = wa({
      axis: t,
      ticks: l,
      bandSize: b,
      entry: A,
      index: T,
      dataKey: h
    }), W = wa({
      axis: r,
      ticks: c,
      bandSize: P,
      entry: A,
      index: T,
      dataKey: m
    }), R = k !== "-" ? n.scale(k) : w, q = Math.sqrt(Math.max(R, 0) / Math.PI);
    return sr(sr({}, A), {}, {
      cx: N,
      cy: W,
      x: N - q,
      y: W - q,
      xAxis: t,
      yAxis: r,
      zAxis: n,
      width: 2 * q,
      height: 2 * q,
      size: R,
      node: {
        x: _,
        y: O,
        z: k
      },
      tooltipPayload: M,
      tooltipPosition: {
        x: N,
        y: W
      },
      payload: A
    }, v && v[T] && v[T].props);
  });
  return sr({
    points: C
  }, f);
});
function $a(e) {
  "@babel/helpers - typeof";
  return $a = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $a(e);
}
function P6(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function A6(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, QC(n.key), n);
  }
}
function E6(e, t, r) {
  return t && A6(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function T6(e, t, r) {
  return t = oc(t), C6(e, XC() ? Reflect.construct(t, r || [], oc(e).constructor) : t.apply(e, r));
}
function C6(e, t) {
  if (t && ($a(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return k6(e);
}
function k6(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function XC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (XC = function() {
    return !!e;
  })();
}
function oc(e) {
  return oc = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, oc(e);
}
function j6(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Ym(e, t);
}
function Ym(e, t) {
  return Ym = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Ym(e, t);
}
function YC(e, t, r) {
  return t = QC(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function QC(e) {
  var t = M6(e, "string");
  return $a(t) == "symbol" ? t : t + "";
}
function M6(e, t) {
  if ($a(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if ($a(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Qm() {
  return Qm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Qm.apply(this, arguments);
}
function I6(e) {
  var t = e.xAxisId, r = r0(), n = n0(), a = AC(t);
  return a == null ? null : (
    // @ts-expect-error the axisOptions type is not exactly what CartesianAxis is expecting.
    /* @__PURE__ */ V.createElement(Ka, Qm({}, a, {
      className: ke("recharts-".concat(a.axisType, " ").concat(a.axisType), a.className),
      viewBox: {
        x: 0,
        y: 0,
        width: r,
        height: n
      },
      ticksGenerator: function(l) {
        return on(l, !0);
      }
    }))
  );
}
var Br = /* @__PURE__ */ (function(e) {
  function t() {
    return P6(this, t), T6(this, t, arguments);
  }
  return j6(t, e), E6(t, [{
    key: "render",
    value: function() {
      return /* @__PURE__ */ V.createElement(I6, this.props);
    }
  }]);
})(V.Component);
YC(Br, "displayName", "XAxis");
YC(Br, "defaultProps", {
  allowDecimals: !0,
  hide: !1,
  orientation: "bottom",
  width: 0,
  height: 30,
  mirror: !1,
  xAxisId: 0,
  tickCount: 5,
  type: "category",
  padding: {
    left: 0,
    right: 0
  },
  allowDataOverflow: !1,
  scale: "auto",
  reversed: !1,
  allowDuplicatedCategory: !0
});
function Na(e) {
  "@babel/helpers - typeof";
  return Na = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Na(e);
}
function $6(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function N6(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, ek(n.key), n);
  }
}
function R6(e, t, r) {
  return t && N6(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function D6(e, t, r) {
  return t = uc(t), L6(e, ZC() ? Reflect.construct(t, r || [], uc(e).constructor) : t.apply(e, r));
}
function L6(e, t) {
  if (t && (Na(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return q6(e);
}
function q6(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ZC() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (ZC = function() {
    return !!e;
  })();
}
function uc(e) {
  return uc = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, uc(e);
}
function B6(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && Zm(e, t);
}
function Zm(e, t) {
  return Zm = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, Zm(e, t);
}
function JC(e, t, r) {
  return t = ek(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ek(e) {
  var t = z6(e, "string");
  return Na(t) == "symbol" ? t : t + "";
}
function z6(e, t) {
  if (Na(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Na(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Jm() {
  return Jm = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, Jm.apply(this, arguments);
}
var F6 = function(t) {
  var r = t.yAxisId, n = r0(), a = n0(), u = EC(r);
  return u == null ? null : (
    // @ts-expect-error the axisOptions type is not exactly what CartesianAxis is expecting.
    /* @__PURE__ */ V.createElement(Ka, Jm({}, u, {
      className: ke("recharts-".concat(u.axisType, " ").concat(u.axisType), u.className),
      viewBox: {
        x: 0,
        y: 0,
        width: n,
        height: a
      },
      ticksGenerator: function(c) {
        return on(c, !0);
      }
    }))
  );
}, zr = /* @__PURE__ */ (function(e) {
  function t() {
    return $6(this, t), D6(this, t, arguments);
  }
  return B6(t, e), R6(t, [{
    key: "render",
    value: function() {
      return /* @__PURE__ */ V.createElement(F6, this.props);
    }
  }]);
})(V.Component);
JC(zr, "displayName", "YAxis");
JC(zr, "defaultProps", {
  allowDuplicatedCategory: !0,
  allowDecimals: !0,
  hide: !1,
  orientation: "left",
  width: 60,
  height: 0,
  mirror: !1,
  yAxisId: 0,
  tickCount: 5,
  type: "number",
  padding: {
    top: 0,
    bottom: 0
  },
  allowDataOverflow: !1,
  scale: "auto",
  reversed: !1
});
function RA(e) {
  return K6(e) || H6(e) || W6(e) || U6();
}
function U6() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function W6(e, t) {
  if (e) {
    if (typeof e == "string") return eg(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return eg(e, t);
  }
}
function H6(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function K6(e) {
  if (Array.isArray(e)) return eg(e);
}
function eg(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var tg = function(t, r, n, a, u) {
  var l = Ut(t, a0), c = Ut(t, Lc), f = [].concat(RA(l), RA(c)), d = Ut(t, Bc), v = "".concat(a, "Id"), h = a[0], m = r;
  if (f.length && (m = f.reduce(function(w, b) {
    if (b.props[v] === n && Wr(b.props, "extendDomain") && le(b.props[h])) {
      var P = b.props[h];
      return [Math.min(w[0], P), Math.max(w[1], P)];
    }
    return w;
  }, m)), d.length) {
    var x = "".concat(h, "1"), S = "".concat(h, "2");
    m = d.reduce(function(w, b) {
      if (b.props[v] === n && Wr(b.props, "extendDomain") && le(b.props[x]) && le(b.props[S])) {
        var P = b.props[x], C = b.props[S];
        return [Math.min(w[0], P, C), Math.max(w[1], P, C)];
      }
      return w;
    }, m);
  }
  return u && u.length && (m = u.reduce(function(w, b) {
    return le(b) ? [Math.min(w[0], b), Math.max(w[1], b)] : w;
  }, m)), m;
}, $y = { exports: {} }, DA;
function G6() {
  return DA || (DA = 1, (function(e) {
    var t = Object.prototype.hasOwnProperty, r = "~";
    function n() {
    }
    Object.create && (n.prototype = /* @__PURE__ */ Object.create(null), new n().__proto__ || (r = !1));
    function a(f, d, v) {
      this.fn = f, this.context = d, this.once = v || !1;
    }
    function u(f, d, v, h, m) {
      if (typeof v != "function")
        throw new TypeError("The listener must be a function");
      var x = new a(v, h || f, m), S = r ? r + d : d;
      return f._events[S] ? f._events[S].fn ? f._events[S] = [f._events[S], x] : f._events[S].push(x) : (f._events[S] = x, f._eventsCount++), f;
    }
    function l(f, d) {
      --f._eventsCount === 0 ? f._events = new n() : delete f._events[d];
    }
    function c() {
      this._events = new n(), this._eventsCount = 0;
    }
    c.prototype.eventNames = function() {
      var d = [], v, h;
      if (this._eventsCount === 0) return d;
      for (h in v = this._events)
        t.call(v, h) && d.push(r ? h.slice(1) : h);
      return Object.getOwnPropertySymbols ? d.concat(Object.getOwnPropertySymbols(v)) : d;
    }, c.prototype.listeners = function(d) {
      var v = r ? r + d : d, h = this._events[v];
      if (!h) return [];
      if (h.fn) return [h.fn];
      for (var m = 0, x = h.length, S = new Array(x); m < x; m++)
        S[m] = h[m].fn;
      return S;
    }, c.prototype.listenerCount = function(d) {
      var v = r ? r + d : d, h = this._events[v];
      return h ? h.fn ? 1 : h.length : 0;
    }, c.prototype.emit = function(d, v, h, m, x, S) {
      var w = r ? r + d : d;
      if (!this._events[w]) return !1;
      var b = this._events[w], P = arguments.length, C, A;
      if (b.fn) {
        switch (b.once && this.removeListener(d, b.fn, void 0, !0), P) {
          case 1:
            return b.fn.call(b.context), !0;
          case 2:
            return b.fn.call(b.context, v), !0;
          case 3:
            return b.fn.call(b.context, v, h), !0;
          case 4:
            return b.fn.call(b.context, v, h, m), !0;
          case 5:
            return b.fn.call(b.context, v, h, m, x), !0;
          case 6:
            return b.fn.call(b.context, v, h, m, x, S), !0;
        }
        for (A = 1, C = new Array(P - 1); A < P; A++)
          C[A - 1] = arguments[A];
        b.fn.apply(b.context, C);
      } else {
        var T = b.length, _;
        for (A = 0; A < T; A++)
          switch (b[A].once && this.removeListener(d, b[A].fn, void 0, !0), P) {
            case 1:
              b[A].fn.call(b[A].context);
              break;
            case 2:
              b[A].fn.call(b[A].context, v);
              break;
            case 3:
              b[A].fn.call(b[A].context, v, h);
              break;
            case 4:
              b[A].fn.call(b[A].context, v, h, m);
              break;
            default:
              if (!C) for (_ = 1, C = new Array(P - 1); _ < P; _++)
                C[_ - 1] = arguments[_];
              b[A].fn.apply(b[A].context, C);
          }
      }
      return !0;
    }, c.prototype.on = function(d, v, h) {
      return u(this, d, v, h, !1);
    }, c.prototype.once = function(d, v, h) {
      return u(this, d, v, h, !0);
    }, c.prototype.removeListener = function(d, v, h, m) {
      var x = r ? r + d : d;
      if (!this._events[x]) return this;
      if (!v)
        return l(this, x), this;
      var S = this._events[x];
      if (S.fn)
        S.fn === v && (!m || S.once) && (!h || S.context === h) && l(this, x);
      else {
        for (var w = 0, b = [], P = S.length; w < P; w++)
          (S[w].fn !== v || m && !S[w].once || h && S[w].context !== h) && b.push(S[w]);
        b.length ? this._events[x] = b.length === 1 ? b[0] : b : l(this, x);
      }
      return this;
    }, c.prototype.removeAllListeners = function(d) {
      var v;
      return d ? (v = r ? r + d : d, this._events[v] && l(this, v)) : (this._events = new n(), this._eventsCount = 0), this;
    }, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = r, c.EventEmitter = c, e.exports = c;
  })($y)), $y.exports;
}
var V6 = G6();
const X6 = /* @__PURE__ */ Fe(V6);
var Ny = new X6(), Ry = "recharts.syncMouseEvents";
function $u(e) {
  "@babel/helpers - typeof";
  return $u = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, $u(e);
}
function Y6(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function Q6(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, tk(n.key), n);
  }
}
function Z6(e, t, r) {
  return t && Q6(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function Dy(e, t, r) {
  return t = tk(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function tk(e) {
  var t = J6(e, "string");
  return $u(t) == "symbol" ? t : t + "";
}
function J6(e, t) {
  if ($u(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if ($u(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var eU = /* @__PURE__ */ (function() {
  function e() {
    Y6(this, e), Dy(this, "activeIndex", 0), Dy(this, "coordinateList", []), Dy(this, "layout", "horizontal");
  }
  return Z6(e, [{
    key: "setDetails",
    value: function(r) {
      var n, a = r.coordinateList, u = a === void 0 ? null : a, l = r.container, c = l === void 0 ? null : l, f = r.layout, d = f === void 0 ? null : f, v = r.offset, h = v === void 0 ? null : v, m = r.mouseHandlerCallback, x = m === void 0 ? null : m;
      this.coordinateList = (n = u ?? this.coordinateList) !== null && n !== void 0 ? n : [], this.container = c ?? this.container, this.layout = d ?? this.layout, this.offset = h ?? this.offset, this.mouseHandlerCallback = x ?? this.mouseHandlerCallback, this.activeIndex = Math.min(Math.max(this.activeIndex, 0), this.coordinateList.length - 1);
    }
  }, {
    key: "focus",
    value: function() {
      this.spoofMouse();
    }
  }, {
    key: "keyboardEvent",
    value: function(r) {
      if (this.coordinateList.length !== 0)
        switch (r.key) {
          case "ArrowRight": {
            if (this.layout !== "horizontal")
              return;
            this.activeIndex = Math.min(this.activeIndex + 1, this.coordinateList.length - 1), this.spoofMouse();
            break;
          }
          case "ArrowLeft": {
            if (this.layout !== "horizontal")
              return;
            this.activeIndex = Math.max(this.activeIndex - 1, 0), this.spoofMouse();
            break;
          }
        }
    }
  }, {
    key: "setIndex",
    value: function(r) {
      this.activeIndex = r;
    }
  }, {
    key: "spoofMouse",
    value: function() {
      var r, n;
      if (this.layout === "horizontal" && this.coordinateList.length !== 0) {
        var a = this.container.getBoundingClientRect(), u = a.x, l = a.y, c = a.height, f = this.coordinateList[this.activeIndex].coordinate, d = ((r = window) === null || r === void 0 ? void 0 : r.scrollX) || 0, v = ((n = window) === null || n === void 0 ? void 0 : n.scrollY) || 0, h = u + f + d, m = l + this.offset.top + c / 2 + v;
        this.mouseHandlerCallback({
          pageX: h,
          pageY: m
        });
      }
    }
  }]);
})();
function tU(e, t, r) {
  if (r === "number" && t === !0 && Array.isArray(e)) {
    var n = e?.[0], a = e?.[1];
    if (n && a && le(n) && le(a))
      return !0;
  }
  return !1;
}
function rU(e, t, r, n) {
  var a = n / 2;
  return {
    stroke: "none",
    fill: "#ccc",
    x: e === "horizontal" ? t.x - a : r.left + 0.5,
    y: e === "horizontal" ? r.top + 0.5 : t.y - a,
    width: e === "horizontal" ? n : r.width - 1,
    height: e === "horizontal" ? r.height - 1 : n
  };
}
function rk(e) {
  var t = e.cx, r = e.cy, n = e.radius, a = e.startAngle, u = e.endAngle, l = Ot(t, r, n, a), c = Ot(t, r, n, u);
  return {
    points: [l, c],
    cx: t,
    cy: r,
    radius: n,
    startAngle: a,
    endAngle: u
  };
}
function nU(e, t, r) {
  var n, a, u, l;
  if (e === "horizontal")
    n = t.x, u = n, a = r.top, l = r.top + r.height;
  else if (e === "vertical")
    a = t.y, l = a, n = r.left, u = r.left + r.width;
  else if (t.cx != null && t.cy != null)
    if (e === "centric") {
      var c = t.cx, f = t.cy, d = t.innerRadius, v = t.outerRadius, h = t.angle, m = Ot(c, f, d, h), x = Ot(c, f, v, h);
      n = m.x, a = m.y, u = x.x, l = x.y;
    } else
      return rk(t);
  return [{
    x: n,
    y: a
  }, {
    x: u,
    y: l
  }];
}
function Nu(e) {
  "@babel/helpers - typeof";
  return Nu = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Nu(e);
}
function LA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ss(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? LA(Object(r), !0).forEach(function(n) {
      iU(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : LA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function iU(e, t, r) {
  return t = aU(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function aU(e) {
  var t = oU(e, "string");
  return Nu(t) == "symbol" ? t : t + "";
}
function oU(e, t) {
  if (Nu(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Nu(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function uU(e) {
  var t, r, n = e.element, a = e.tooltipEventType, u = e.isActive, l = e.activeCoordinate, c = e.activePayload, f = e.offset, d = e.activeTooltipIndex, v = e.tooltipAxisBandSize, h = e.layout, m = e.chartName, x = (t = n.props.cursor) !== null && t !== void 0 ? t : (r = n.type.defaultProps) === null || r === void 0 ? void 0 : r.cursor;
  if (!n || !x || !u || !l || m !== "ScatterChart" && a !== "axis")
    return null;
  var S, w = gi;
  if (m === "ScatterChart")
    S = l, w = jF;
  else if (m === "BarChart")
    S = rU(h, l, f, v), w = Zg;
  else if (h === "radial") {
    var b = rk(l), P = b.cx, C = b.cy, A = b.radius, T = b.startAngle, _ = b.endAngle;
    S = {
      cx: P,
      cy: C,
      startAngle: T,
      endAngle: _,
      innerRadius: A,
      outerRadius: A
    }, w = rC;
  } else
    S = {
      points: nU(h, l, f)
    }, w = gi;
  var O = ss(ss(ss(ss({
    stroke: "#ccc",
    pointerEvents: "none"
  }, f), S), Ae(x, !1)), {}, {
    payload: c,
    payloadIndex: d,
    className: ke("recharts-tooltip-cursor", x.className)
  });
  return /* @__PURE__ */ V.isValidElement(x) ? /* @__PURE__ */ V.cloneElement(x, O) : /* @__PURE__ */ V.createElement(w, O);
}
var lU = ["item"], sU = ["children", "className", "width", "height", "style", "compact", "title", "desc"];
function Ra(e) {
  "@babel/helpers - typeof";
  return Ra = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ra(e);
}
function la() {
  return la = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, la.apply(this, arguments);
}
function qA(e, t) {
  return dU(e) || fU(e, t) || ik(e, t) || cU();
}
function cU() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function fU(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var n, a, u, l, c = [], f = !0, d = !1;
    try {
      if (u = (r = r.call(e)).next, t !== 0) for (; !(f = (n = u.call(r)).done) && (c.push(n.value), c.length !== t); f = !0) ;
    } catch (v) {
      d = !0, a = v;
    } finally {
      try {
        if (!f && r.return != null && (l = r.return(), Object(l) !== l)) return;
      } finally {
        if (d) throw a;
      }
    }
    return c;
  }
}
function dU(e) {
  if (Array.isArray(e)) return e;
}
function BA(e, t) {
  if (e == null) return {};
  var r = pU(e, t), n, a;
  if (Object.getOwnPropertySymbols) {
    var u = Object.getOwnPropertySymbols(e);
    for (a = 0; a < u.length; a++)
      n = u[a], !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]);
  }
  return r;
}
function pU(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function hU(e, t) {
  if (!(e instanceof t))
    throw new TypeError("Cannot call a class as a function");
}
function vU(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, ak(n.key), n);
  }
}
function yU(e, t, r) {
  return t && vU(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
function mU(e, t, r) {
  return t = lc(t), gU(e, nk() ? Reflect.construct(t, r || [], lc(e).constructor) : t.apply(e, r));
}
function gU(e, t) {
  if (t && (Ra(t) === "object" || typeof t == "function"))
    return t;
  if (t !== void 0)
    throw new TypeError("Derived constructors may only return object or undefined");
  return bU(e);
}
function bU(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function nk() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (nk = function() {
    return !!e;
  })();
}
function lc(e) {
  return lc = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r) {
    return r.__proto__ || Object.getPrototypeOf(r);
  }, lc(e);
}
function xU(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), Object.defineProperty(e, "prototype", { writable: !1 }), t && rg(e, t);
}
function rg(e, t) {
  return rg = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, a) {
    return n.__proto__ = a, n;
  }, rg(e, t);
}
function Da(e) {
  return _U(e) || SU(e) || ik(e) || wU();
}
function wU() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ik(e, t) {
  if (e) {
    if (typeof e == "string") return ng(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return ng(e, t);
  }
}
function SU(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function _U(e) {
  if (Array.isArray(e)) return ng(e);
}
function ng(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function zA(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(a) {
      return Object.getOwnPropertyDescriptor(e, a).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Z(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? zA(Object(r), !0).forEach(function(n) {
      xe(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : zA(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function xe(e, t, r) {
  return t = ak(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
}
function ak(e) {
  var t = OU(e, "string");
  return Ra(t) == "symbol" ? t : t + "";
}
function OU(e, t) {
  if (Ra(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ra(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var PU = {
  xAxis: ["bottom", "top"],
  yAxis: ["left", "right"]
}, AU = {
  width: "100%",
  height: "100%"
}, ok = {
  x: 0,
  y: 0
};
function cs(e) {
  return e;
}
var EU = function(t, r) {
  return r === "horizontal" ? t.x : r === "vertical" ? t.y : r === "centric" ? t.angle : t.radius;
}, TU = function(t, r, n, a) {
  var u = r.find(function(v) {
    return v && v.index === n;
  });
  if (u) {
    if (t === "horizontal")
      return {
        x: u.coordinate,
        y: a.y
      };
    if (t === "vertical")
      return {
        x: a.x,
        y: u.coordinate
      };
    if (t === "centric") {
      var l = u.coordinate, c = a.radius;
      return Z(Z(Z({}, a), Ot(a.cx, a.cy, c, l)), {}, {
        angle: l,
        radius: c
      });
    }
    var f = u.coordinate, d = a.angle;
    return Z(Z(Z({}, a), Ot(a.cx, a.cy, f, d)), {}, {
      angle: d,
      radius: f
    });
  }
  return ok;
}, Uc = function(t, r) {
  var n = r.graphicalItems, a = r.dataStartIndex, u = r.dataEndIndex, l = (n ?? []).reduce(function(c, f) {
    var d = f.props.data;
    return d && d.length ? [].concat(Da(c), Da(d)) : c;
  }, []);
  return l.length > 0 ? l : t && t.length && le(a) && le(u) ? t.slice(a, u + 1) : [];
};
function uk(e) {
  return e === "number" ? [0, "auto"] : void 0;
}
var ig = function(t, r, n, a) {
  var u = t.graphicalItems, l = t.tooltipAxis, c = Uc(r, t);
  return n < 0 || !u || !u.length || n >= c.length ? null : u.reduce(function(f, d) {
    var v, h = (v = d.props.data) !== null && v !== void 0 ? v : r;
    h && t.dataStartIndex + t.dataEndIndex !== 0 && // https://github.com/recharts/recharts/issues/4717
    // The data is sliced only when the active index is within the start/end index range.
    t.dataEndIndex - t.dataStartIndex >= n && (h = h.slice(t.dataStartIndex, t.dataEndIndex + 1));
    var m;
    if (l.dataKey && !l.allowDuplicatedCategory) {
      var x = h === void 0 ? c : h;
      m = fs(x, l.dataKey, a);
    } else
      m = h && h[n] || c[n];
    return m ? [].concat(Da(f), [JT(d, m)]) : f;
  }, []);
}, FA = function(t, r, n, a) {
  var u = a || {
    x: t.chartX,
    y: t.chartY
  }, l = EU(u, n), c = t.orderedTooltipTicks, f = t.tooltipAxis, d = t.tooltipTicks, v = pB(l, c, d, f);
  if (v >= 0 && d) {
    var h = d[v] && d[v].value, m = ig(t, r, v, h), x = TU(n, c, v, u);
    return {
      activeTooltipIndex: v,
      activeLabel: h,
      activePayload: m,
      activeCoordinate: x
    };
  }
  return null;
}, CU = function(t, r) {
  var n = r.axes, a = r.graphicalItems, u = r.axisType, l = r.axisIdKey, c = r.stackGroups, f = r.dataStartIndex, d = r.dataEndIndex, v = t.layout, h = t.children, m = t.stackOffset, x = YT(v, u);
  return n.reduce(function(S, w) {
    var b, P = w.type.defaultProps !== void 0 ? Z(Z({}, w.type.defaultProps), w.props) : w.props, C = P.type, A = P.dataKey, T = P.allowDataOverflow, _ = P.allowDuplicatedCategory, O = P.scale, k = P.ticks, M = P.includeHidden, N = P[l];
    if (S[N])
      return S;
    var W = Uc(t.data, {
      graphicalItems: a.filter(function(B) {
        var ue, pe = l in B.props ? B.props[l] : (ue = B.type.defaultProps) === null || ue === void 0 ? void 0 : ue[l];
        return pe === N;
      }),
      dataStartIndex: f,
      dataEndIndex: d
    }), R = W.length, q, F, X;
    tU(P.domain, T, C) && (q = gm(P.domain, null, T), x && (C === "number" || O !== "auto") && (X = Xo(W, A, "category")));
    var G = uk(C);
    if (!q || q.length === 0) {
      var Y, ee = (Y = P.domain) !== null && Y !== void 0 ? Y : G;
      if (A) {
        if (q = Xo(W, A, C), C === "category" && x) {
          var H = n2(q);
          _ && H ? (F = q, q = Ks(0, R)) : _ || (q = XO(ee, q, w).reduce(function(B, ue) {
            return B.indexOf(ue) >= 0 ? B : [].concat(Da(B), [ue]);
          }, []));
        } else if (C === "category")
          _ ? q = q.filter(function(B) {
            return B !== "" && !_e(B);
          }) : q = XO(ee, q, w).reduce(function(B, ue) {
            return B.indexOf(ue) >= 0 || ue === "" || _e(ue) ? B : [].concat(Da(B), [ue]);
          }, []);
        else if (C === "number") {
          var Q = gB(W, a.filter(function(B) {
            var ue, pe, me = l in B.props ? B.props[l] : (ue = B.type.defaultProps) === null || ue === void 0 ? void 0 : ue[l], Se = "hide" in B.props ? B.props.hide : (pe = B.type.defaultProps) === null || pe === void 0 ? void 0 : pe.hide;
            return me === N && (M || !Se);
          }), A, u, v);
          Q && (q = Q);
        }
        x && (C === "number" || O !== "auto") && (X = Xo(W, A, "category"));
      } else x ? q = Ks(0, R) : c && c[N] && c[N].hasStack && C === "number" ? q = m === "expand" ? [0, 1] : ZT(c[N].stackGroups, f, d) : q = XT(W, a.filter(function(B) {
        var ue = l in B.props ? B.props[l] : B.type.defaultProps[l], pe = "hide" in B.props ? B.props.hide : B.type.defaultProps.hide;
        return ue === N && (M || !pe);
      }), C, v, !0);
      if (C === "number")
        q = tg(h, q, N, u, k), ee && (q = gm(ee, q, T));
      else if (C === "category" && ee) {
        var J = ee, I = q.every(function(B) {
          return J.indexOf(B) >= 0;
        });
        I && (q = J);
      }
    }
    return Z(Z({}, S), {}, xe({}, N, Z(Z({}, P), {}, {
      axisType: u,
      domain: q,
      categoricalDomain: X,
      duplicateDomain: F,
      originalDomain: (b = P.domain) !== null && b !== void 0 ? b : G,
      isCategorical: x,
      layout: v
    })));
  }, {});
}, kU = function(t, r) {
  var n = r.graphicalItems, a = r.Axis, u = r.axisType, l = r.axisIdKey, c = r.stackGroups, f = r.dataStartIndex, d = r.dataEndIndex, v = t.layout, h = t.children, m = Uc(t.data, {
    graphicalItems: n,
    dataStartIndex: f,
    dataEndIndex: d
  }), x = m.length, S = YT(v, u), w = -1;
  return n.reduce(function(b, P) {
    var C = P.type.defaultProps !== void 0 ? Z(Z({}, P.type.defaultProps), P.props) : P.props, A = C[l], T = uk("number");
    if (!b[A]) {
      w++;
      var _;
      return S ? _ = Ks(0, x) : c && c[A] && c[A].hasStack ? (_ = ZT(c[A].stackGroups, f, d), _ = tg(h, _, A, u)) : (_ = gm(T, XT(m, n.filter(function(O) {
        var k, M, N = l in O.props ? O.props[l] : (k = O.type.defaultProps) === null || k === void 0 ? void 0 : k[l], W = "hide" in O.props ? O.props.hide : (M = O.type.defaultProps) === null || M === void 0 ? void 0 : M.hide;
        return N === A && !W;
      }), "number", v), a.defaultProps.allowDataOverflow), _ = tg(h, _, A, u)), Z(Z({}, b), {}, xe({}, A, Z(Z({
        axisType: u
      }, a.defaultProps), {}, {
        hide: !0,
        orientation: fr(PU, "".concat(u, ".").concat(w % 2), null),
        domain: _,
        originalDomain: T,
        isCategorical: S,
        layout: v
        // specify scale when no Axis
        // scale: isCategorical ? 'band' : 'linear',
      })));
    }
    return b;
  }, {});
}, jU = function(t, r) {
  var n = r.axisType, a = n === void 0 ? "xAxis" : n, u = r.AxisComp, l = r.graphicalItems, c = r.stackGroups, f = r.dataStartIndex, d = r.dataEndIndex, v = t.children, h = "".concat(a, "Id"), m = Ut(v, u), x = {};
  return m && m.length ? x = CU(t, {
    axes: m,
    graphicalItems: l,
    axisType: a,
    axisIdKey: h,
    stackGroups: c,
    dataStartIndex: f,
    dataEndIndex: d
  }) : l && l.length && (x = kU(t, {
    Axis: u,
    graphicalItems: l,
    axisType: a,
    axisIdKey: h,
    stackGroups: c,
    dataStartIndex: f,
    dataEndIndex: d
  })), x;
}, MU = function(t) {
  var r = Ln(t), n = on(r, !1, !0);
  return {
    tooltipTicks: n,
    orderedTooltipTicks: Og(n, function(a) {
      return a.coordinate;
    }),
    tooltipAxis: r,
    tooltipAxisBandSize: Ds(r, n)
  };
}, UA = function(t) {
  var r = t.children, n = t.defaultShowTooltip, a = Qt(r, Oa), u = 0, l = 0;
  return t.data && t.data.length !== 0 && (l = t.data.length - 1), a && a.props && (a.props.startIndex >= 0 && (u = a.props.startIndex), a.props.endIndex >= 0 && (l = a.props.endIndex)), {
    chartX: 0,
    chartY: 0,
    dataStartIndex: u,
    dataEndIndex: l,
    activeTooltipIndex: -1,
    isTooltipActive: !!n
  };
}, IU = function(t) {
  return !t || !t.length ? !1 : t.some(function(r) {
    var n = un(r && r.type);
    return n && n.indexOf("Bar") >= 0;
  });
}, WA = function(t) {
  return t === "horizontal" ? {
    numericAxisName: "yAxis",
    cateAxisName: "xAxis"
  } : t === "vertical" ? {
    numericAxisName: "xAxis",
    cateAxisName: "yAxis"
  } : t === "centric" ? {
    numericAxisName: "radiusAxis",
    cateAxisName: "angleAxis"
  } : {
    numericAxisName: "angleAxis",
    cateAxisName: "radiusAxis"
  };
}, $U = function(t, r) {
  var n = t.props, a = t.graphicalItems, u = t.xAxisMap, l = u === void 0 ? {} : u, c = t.yAxisMap, f = c === void 0 ? {} : c, d = n.width, v = n.height, h = n.children, m = n.margin || {}, x = Qt(h, Oa), S = Qt(h, Dr), w = Object.keys(f).reduce(function(_, O) {
    var k = f[O], M = k.orientation;
    return !k.mirror && !k.hide ? Z(Z({}, _), {}, xe({}, M, _[M] + k.width)) : _;
  }, {
    left: m.left || 0,
    right: m.right || 0
  }), b = Object.keys(l).reduce(function(_, O) {
    var k = l[O], M = k.orientation;
    return !k.mirror && !k.hide ? Z(Z({}, _), {}, xe({}, M, fr(_, "".concat(M)) + k.height)) : _;
  }, {
    top: m.top || 0,
    bottom: m.bottom || 0
  }), P = Z(Z({}, b), w), C = P.bottom;
  x && (P.bottom += x.props.height || Oa.defaultProps.height), S && r && (P = yB(P, a, n, r));
  var A = d - P.left - P.right, T = v - P.top - P.bottom;
  return Z(Z({
    brushBottom: C
  }, P), {}, {
    // never return negative values for height and width
    width: Math.max(A, 0),
    height: Math.max(T, 0)
  });
}, NU = function(t, r) {
  if (r === "xAxis")
    return t[r].width;
  if (r === "yAxis")
    return t[r].height;
}, Wc = function(t) {
  var r = t.chartName, n = t.GraphicalChild, a = t.defaultTooltipEventType, u = a === void 0 ? "axis" : a, l = t.validateTooltipEventTypes, c = l === void 0 ? ["axis"] : l, f = t.axisComponents, d = t.legendContent, v = t.formatAxisMap, h = t.defaultProps, m = function(P, C) {
    var A = C.graphicalItems, T = C.stackGroups, _ = C.offset, O = C.updateId, k = C.dataStartIndex, M = C.dataEndIndex, N = P.barSize, W = P.layout, R = P.barGap, q = P.barCategoryGap, F = P.maxBarSize, X = WA(W), G = X.numericAxisName, Y = X.cateAxisName, ee = IU(A), H = [];
    return A.forEach(function(Q, J) {
      var I = Uc(P.data, {
        graphicalItems: [Q],
        dataStartIndex: k,
        dataEndIndex: M
      }), B = Q.type.defaultProps !== void 0 ? Z(Z({}, Q.type.defaultProps), Q.props) : Q.props, ue = B.dataKey, pe = B.maxBarSize, me = B["".concat(G, "Id")], Se = B["".concat(Y, "Id")], je = {}, Oe = f.reduce(function(Nt, vr) {
        var ji = C["".concat(vr.axisType, "Map")], Ga = B["".concat(vr.axisType, "Id")];
        ji && ji[Ga] || vr.axisType === "zAxis" || _i();
        var Va = ji[Ga];
        return Z(Z({}, Nt), {}, xe(xe({}, vr.axisType, Va), "".concat(vr.axisType, "Ticks"), on(Va)));
      }, je), ae = Oe[Y], ye = Oe["".concat(Y, "Ticks")], Pe = T && T[me] && T[me].hasStack && kB(Q, T[me].stackGroups), ne = un(Q.type).indexOf("Bar") >= 0, Be = Ds(ae, ye), Ce = [], Ze = ee && hB({
        barSize: N,
        stackGroups: T,
        totalSize: NU(Oe, Y)
      });
      if (ne) {
        var Je, vt, hr = _e(pe) ? F : pe, kr = (Je = (vt = Ds(ae, ye, !0)) !== null && vt !== void 0 ? vt : hr) !== null && Je !== void 0 ? Je : 0;
        Ce = vB({
          barGap: R,
          barCategoryGap: q,
          bandSize: kr !== Be ? kr : Be,
          sizeList: Ze[Se],
          maxBarSize: hr
        }), kr !== Be && (Ce = Ce.map(function(Nt) {
          return Z(Z({}, Nt), {}, {
            position: Z(Z({}, Nt.position), {}, {
              offset: Nt.position.offset - kr / 2
            })
          });
        }));
      }
      var jr = Q && Q.type && Q.type.getComposedData;
      jr && H.push({
        props: Z(Z({}, jr(Z(Z({}, Oe), {}, {
          displayedData: I,
          props: P,
          dataKey: ue,
          item: Q,
          bandSize: Be,
          barPosition: Ce,
          offset: _,
          stackedData: Pe,
          layout: W,
          dataStartIndex: k,
          dataEndIndex: M
        }))), {}, xe(xe(xe({
          key: Q.key || "item-".concat(J)
        }, G, Oe[G]), Y, Oe[Y]), "animationId", O)),
        childIndex: y2(Q, P.children),
        item: Q
      });
    }), H;
  }, x = function(P, C) {
    var A = P.props, T = P.dataStartIndex, _ = P.dataEndIndex, O = P.updateId;
    if (!c1({
      props: A
    }))
      return null;
    var k = A.children, M = A.layout, N = A.stackOffset, W = A.data, R = A.reverseStackOrder, q = WA(M), F = q.numericAxisName, X = q.cateAxisName, G = Ut(k, n), Y = EB(W, G, "".concat(F, "Id"), "".concat(X, "Id"), N, R), ee = f.reduce(function(B, ue) {
      var pe = "".concat(ue.axisType, "Map");
      return Z(Z({}, B), {}, xe({}, pe, jU(A, Z(Z({}, ue), {}, {
        graphicalItems: G,
        stackGroups: ue.axisType === F && Y,
        dataStartIndex: T,
        dataEndIndex: _
      }))));
    }, {}), H = $U(Z(Z({}, ee), {}, {
      props: A,
      graphicalItems: G
    }), C?.legendBBox);
    Object.keys(ee).forEach(function(B) {
      ee[B] = v(A, ee[B], H, B.replace("Map", ""), r);
    });
    var Q = ee["".concat(X, "Map")], J = MU(Q), I = m(A, Z(Z({}, ee), {}, {
      dataStartIndex: T,
      dataEndIndex: _,
      updateId: O,
      graphicalItems: G,
      stackGroups: Y,
      offset: H
    }));
    return Z(Z({
      formattedGraphicalItems: I,
      graphicalItems: G,
      offset: H,
      stackGroups: Y
    }, J), ee);
  }, S = /* @__PURE__ */ (function(b) {
    function P(C) {
      var A, T, _;
      return hU(this, P), _ = mU(this, P, [C]), xe(_, "eventEmitterSymbol", Symbol("rechartsEventEmitter")), xe(_, "accessibilityManager", new eU()), xe(_, "handleLegendBBoxUpdate", function(O) {
        if (O) {
          var k = _.state, M = k.dataStartIndex, N = k.dataEndIndex, W = k.updateId;
          _.setState(Z({
            legendBBox: O
          }, x({
            props: _.props,
            dataStartIndex: M,
            dataEndIndex: N,
            updateId: W
          }, Z(Z({}, _.state), {}, {
            legendBBox: O
          }))));
        }
      }), xe(_, "handleReceiveSyncEvent", function(O, k, M) {
        if (_.props.syncId === O) {
          if (M === _.eventEmitterSymbol && typeof _.props.syncMethod != "function")
            return;
          _.applySyncEvent(k);
        }
      }), xe(_, "handleBrushChange", function(O) {
        var k = O.startIndex, M = O.endIndex;
        if (k !== _.state.dataStartIndex || M !== _.state.dataEndIndex) {
          var N = _.state.updateId;
          _.setState(function() {
            return Z({
              dataStartIndex: k,
              dataEndIndex: M
            }, x({
              props: _.props,
              dataStartIndex: k,
              dataEndIndex: M,
              updateId: N
            }, _.state));
          }), _.triggerSyncEvent({
            dataStartIndex: k,
            dataEndIndex: M
          });
        }
      }), xe(_, "handleMouseEnter", function(O) {
        var k = _.getMouseInfo(O);
        if (k) {
          var M = Z(Z({}, k), {}, {
            isTooltipActive: !0
          });
          _.setState(M), _.triggerSyncEvent(M);
          var N = _.props.onMouseEnter;
          Ee(N) && N(M, O);
        }
      }), xe(_, "triggeredAfterMouseMove", function(O) {
        var k = _.getMouseInfo(O), M = k ? Z(Z({}, k), {}, {
          isTooltipActive: !0
        }) : {
          isTooltipActive: !1
        };
        _.setState(M), _.triggerSyncEvent(M);
        var N = _.props.onMouseMove;
        Ee(N) && N(M, O);
      }), xe(_, "handleItemMouseEnter", function(O) {
        _.setState(function() {
          return {
            isTooltipActive: !0,
            activeItem: O,
            activePayload: O.tooltipPayload,
            activeCoordinate: O.tooltipPosition || {
              x: O.cx,
              y: O.cy
            }
          };
        });
      }), xe(_, "handleItemMouseLeave", function() {
        _.setState(function() {
          return {
            isTooltipActive: !1
          };
        });
      }), xe(_, "handleMouseMove", function(O) {
        O.persist(), _.throttleTriggeredAfterMouseMove(O);
      }), xe(_, "handleMouseLeave", function(O) {
        _.throttleTriggeredAfterMouseMove.cancel();
        var k = {
          isTooltipActive: !1
        };
        _.setState(k), _.triggerSyncEvent(k);
        var M = _.props.onMouseLeave;
        Ee(M) && M(k, O);
      }), xe(_, "handleOuterEvent", function(O) {
        var k = v2(O), M = fr(_.props, "".concat(k));
        if (k && Ee(M)) {
          var N, W;
          /.*touch.*/i.test(k) ? W = _.getMouseInfo(O.changedTouches[0]) : W = _.getMouseInfo(O), M((N = W) !== null && N !== void 0 ? N : {}, O);
        }
      }), xe(_, "handleClick", function(O) {
        var k = _.getMouseInfo(O);
        if (k) {
          var M = Z(Z({}, k), {}, {
            isTooltipActive: !0
          });
          _.setState(M), _.triggerSyncEvent(M);
          var N = _.props.onClick;
          Ee(N) && N(M, O);
        }
      }), xe(_, "handleMouseDown", function(O) {
        var k = _.props.onMouseDown;
        if (Ee(k)) {
          var M = _.getMouseInfo(O);
          k(M, O);
        }
      }), xe(_, "handleMouseUp", function(O) {
        var k = _.props.onMouseUp;
        if (Ee(k)) {
          var M = _.getMouseInfo(O);
          k(M, O);
        }
      }), xe(_, "handleTouchMove", function(O) {
        O.changedTouches != null && O.changedTouches.length > 0 && _.throttleTriggeredAfterMouseMove(O.changedTouches[0]);
      }), xe(_, "handleTouchStart", function(O) {
        O.changedTouches != null && O.changedTouches.length > 0 && _.handleMouseDown(O.changedTouches[0]);
      }), xe(_, "handleTouchEnd", function(O) {
        O.changedTouches != null && O.changedTouches.length > 0 && _.handleMouseUp(O.changedTouches[0]);
      }), xe(_, "handleDoubleClick", function(O) {
        var k = _.props.onDoubleClick;
        if (Ee(k)) {
          var M = _.getMouseInfo(O);
          k(M, O);
        }
      }), xe(_, "handleContextMenu", function(O) {
        var k = _.props.onContextMenu;
        if (Ee(k)) {
          var M = _.getMouseInfo(O);
          k(M, O);
        }
      }), xe(_, "triggerSyncEvent", function(O) {
        _.props.syncId !== void 0 && Ny.emit(Ry, _.props.syncId, O, _.eventEmitterSymbol);
      }), xe(_, "applySyncEvent", function(O) {
        var k = _.props, M = k.layout, N = k.syncMethod, W = _.state.updateId, R = O.dataStartIndex, q = O.dataEndIndex;
        if (O.dataStartIndex !== void 0 || O.dataEndIndex !== void 0)
          _.setState(Z({
            dataStartIndex: R,
            dataEndIndex: q
          }, x({
            props: _.props,
            dataStartIndex: R,
            dataEndIndex: q,
            updateId: W
          }, _.state)));
        else if (O.activeTooltipIndex !== void 0) {
          var F = O.chartX, X = O.chartY, G = O.activeTooltipIndex, Y = _.state, ee = Y.offset, H = Y.tooltipTicks;
          if (!ee)
            return;
          if (typeof N == "function")
            G = N(H, O);
          else if (N === "value") {
            G = -1;
            for (var Q = 0; Q < H.length; Q++)
              if (H[Q].value === O.activeLabel) {
                G = Q;
                break;
              }
          }
          var J = Z(Z({}, ee), {}, {
            x: ee.left,
            y: ee.top
          }), I = Math.min(F, J.x + J.width), B = Math.min(X, J.y + J.height), ue = H[G] && H[G].value, pe = ig(_.state, _.props.data, G), me = H[G] ? {
            x: M === "horizontal" ? H[G].coordinate : I,
            y: M === "horizontal" ? B : H[G].coordinate
          } : ok;
          _.setState(Z(Z({}, O), {}, {
            activeLabel: ue,
            activeCoordinate: me,
            activePayload: pe,
            activeTooltipIndex: G
          }));
        } else
          _.setState(O);
      }), xe(_, "renderCursor", function(O) {
        var k, M = _.state, N = M.isTooltipActive, W = M.activeCoordinate, R = M.activePayload, q = M.offset, F = M.activeTooltipIndex, X = M.tooltipAxisBandSize, G = _.getTooltipEventType(), Y = (k = O.props.active) !== null && k !== void 0 ? k : N, ee = _.props.layout, H = O.key || "_recharts-cursor";
        return /* @__PURE__ */ $.createElement(uU, {
          key: H,
          activeCoordinate: W,
          activePayload: R,
          activeTooltipIndex: F,
          chartName: r,
          element: O,
          isActive: Y,
          layout: ee,
          offset: q,
          tooltipAxisBandSize: X,
          tooltipEventType: G
        });
      }), xe(_, "renderPolarAxis", function(O, k, M) {
        var N = fr(O, "type.axisType"), W = fr(_.state, "".concat(N, "Map")), R = O.type.defaultProps, q = R !== void 0 ? Z(Z({}, R), O.props) : O.props, F = W && W[q["".concat(N, "Id")]];
        return /* @__PURE__ */ V.cloneElement(O, Z(Z({}, F), {}, {
          className: ke(N, F.className),
          key: O.key || "".concat(k, "-").concat(M),
          ticks: on(F, !0)
        }));
      }), xe(_, "renderPolarGrid", function(O) {
        var k = O.props, M = k.radialLines, N = k.polarAngles, W = k.polarRadius, R = _.state, q = R.radiusAxisMap, F = R.angleAxisMap, X = Ln(q), G = Ln(F), Y = G.cx, ee = G.cy, H = G.innerRadius, Q = G.outerRadius;
        return /* @__PURE__ */ V.cloneElement(O, {
          polarAngles: Array.isArray(N) ? N : on(G, !0).map(function(J) {
            return J.coordinate;
          }),
          polarRadius: Array.isArray(W) ? W : on(X, !0).map(function(J) {
            return J.coordinate;
          }),
          cx: Y,
          cy: ee,
          innerRadius: H,
          outerRadius: Q,
          key: O.key || "polar-grid",
          radialLines: M
        });
      }), xe(_, "renderLegend", function() {
        var O = _.state.formattedGraphicalItems, k = _.props, M = k.children, N = k.width, W = k.height, R = _.props.margin || {}, q = N - (R.left || 0) - (R.right || 0), F = GT({
          children: M,
          formattedGraphicalItems: O,
          legendWidth: q,
          legendContent: d
        });
        if (!F)
          return null;
        var X = F.item, G = BA(F, lU);
        return /* @__PURE__ */ V.cloneElement(X, Z(Z({}, G), {}, {
          chartWidth: N,
          chartHeight: W,
          margin: R,
          onBBoxUpdate: _.handleLegendBBoxUpdate
        }));
      }), xe(_, "renderTooltip", function() {
        var O, k = _.props, M = k.children, N = k.accessibilityLayer, W = Qt(M, Zt);
        if (!W)
          return null;
        var R = _.state, q = R.isTooltipActive, F = R.activeCoordinate, X = R.activePayload, G = R.activeLabel, Y = R.offset, ee = (O = W.props.active) !== null && O !== void 0 ? O : q;
        return /* @__PURE__ */ V.cloneElement(W, {
          viewBox: Z(Z({}, Y), {}, {
            x: Y.left,
            y: Y.top
          }),
          active: ee,
          label: G,
          payload: ee ? X : [],
          coordinate: F,
          accessibilityLayer: N
        });
      }), xe(_, "renderBrush", function(O) {
        var k = _.props, M = k.margin, N = k.data, W = _.state, R = W.offset, q = W.dataStartIndex, F = W.dataEndIndex, X = W.updateId;
        return /* @__PURE__ */ V.cloneElement(O, {
          key: O.key || "_recharts-brush",
          onChange: as(_.handleBrushChange, O.props.onChange),
          data: N,
          x: le(O.props.x) ? O.props.x : R.left,
          y: le(O.props.y) ? O.props.y : R.top + R.height + R.brushBottom - (M.bottom || 0),
          width: le(O.props.width) ? O.props.width : R.width,
          startIndex: q,
          endIndex: F,
          updateId: "brush-".concat(X)
        });
      }), xe(_, "renderReferenceElement", function(O, k, M) {
        if (!O)
          return null;
        var N = _, W = N.clipPathId, R = _.state, q = R.xAxisMap, F = R.yAxisMap, X = R.offset, G = O.type.defaultProps || {}, Y = O.props, ee = Y.xAxisId, H = ee === void 0 ? G.xAxisId : ee, Q = Y.yAxisId, J = Q === void 0 ? G.yAxisId : Q;
        return /* @__PURE__ */ V.cloneElement(O, {
          key: O.key || "".concat(k, "-").concat(M),
          xAxis: q[H],
          yAxis: F[J],
          viewBox: {
            x: X.left,
            y: X.top,
            width: X.width,
            height: X.height
          },
          clipPathId: W
        });
      }), xe(_, "renderActivePoints", function(O) {
        var k = O.item, M = O.activePoint, N = O.basePoint, W = O.childIndex, R = O.isRange, q = [], F = k.props.key, X = k.item.type.defaultProps !== void 0 ? Z(Z({}, k.item.type.defaultProps), k.item.props) : k.item.props, G = X.activeDot, Y = X.dataKey, ee = Z(Z({
          index: W,
          dataKey: Y,
          cx: M.x,
          cy: M.y,
          r: 4,
          fill: Qg(k.item),
          strokeWidth: 2,
          stroke: "#fff",
          payload: M.payload,
          value: M.value
        }, Ae(G, !1)), ds(G));
        return q.push(P.renderActiveDot(G, ee, "".concat(F, "-activePoint-").concat(W))), N ? q.push(P.renderActiveDot(G, Z(Z({}, ee), {}, {
          cx: N.x,
          cy: N.y
        }), "".concat(F, "-basePoint-").concat(W))) : R && q.push(null), q;
      }), xe(_, "renderGraphicChild", function(O, k, M) {
        var N = _.filterFormatItem(O, k, M);
        if (!N)
          return null;
        var W = _.getTooltipEventType(), R = _.state, q = R.isTooltipActive, F = R.tooltipAxis, X = R.activeTooltipIndex, G = R.activeLabel, Y = _.props.children, ee = Qt(Y, Zt), H = N.props, Q = H.points, J = H.isRange, I = H.baseLine, B = N.item.type.defaultProps !== void 0 ? Z(Z({}, N.item.type.defaultProps), N.item.props) : N.item.props, ue = B.activeDot, pe = B.hide, me = B.activeBar, Se = B.activeShape, je = !!(!pe && q && ee && (ue || me || Se)), Oe = {};
        W !== "axis" && ee && ee.props.trigger === "click" ? Oe = {
          onClick: as(_.handleItemMouseEnter, O.props.onClick)
        } : W !== "axis" && (Oe = {
          onMouseLeave: as(_.handleItemMouseLeave, O.props.onMouseLeave),
          onMouseEnter: as(_.handleItemMouseEnter, O.props.onMouseEnter)
        });
        var ae = /* @__PURE__ */ V.cloneElement(O, Z(Z({}, N.props), Oe));
        function ye(vr) {
          return typeof F.dataKey == "function" ? F.dataKey(vr.payload) : null;
        }
        if (je)
          if (X >= 0) {
            var Pe, ne;
            if (F.dataKey && !F.allowDuplicatedCategory) {
              var Be = typeof F.dataKey == "function" ? ye : "payload.".concat(F.dataKey.toString());
              Pe = fs(Q, Be, G), ne = J && I && fs(I, Be, G);
            } else
              Pe = Q?.[X], ne = J && I && I[X];
            if (Se || me) {
              var Ce = O.props.activeIndex !== void 0 ? O.props.activeIndex : X;
              return [/* @__PURE__ */ V.cloneElement(O, Z(Z(Z({}, N.props), Oe), {}, {
                activeIndex: Ce
              })), null, null];
            }
            if (!_e(Pe))
              return [ae].concat(Da(_.renderActivePoints({
                item: N,
                activePoint: Pe,
                basePoint: ne,
                childIndex: X,
                isRange: J
              })));
          } else {
            var Ze, Je = (Ze = _.getItemByXY(_.state.activeCoordinate)) !== null && Ze !== void 0 ? Ze : {
              graphicalItem: ae
            }, vt = Je.graphicalItem, hr = vt.item, kr = hr === void 0 ? O : hr, jr = vt.childIndex, Nt = Z(Z(Z({}, N.props), Oe), {}, {
              activeIndex: jr
            });
            return [/* @__PURE__ */ V.cloneElement(kr, Nt), null, null];
          }
        return J ? [ae, null, null] : [ae, null];
      }), xe(_, "renderCustomized", function(O, k, M) {
        return /* @__PURE__ */ V.cloneElement(O, Z(Z({
          key: "recharts-customized-".concat(M)
        }, _.props), _.state));
      }), xe(_, "renderMap", {
        CartesianGrid: {
          handler: cs,
          once: !0
        },
        ReferenceArea: {
          handler: _.renderReferenceElement
        },
        ReferenceLine: {
          handler: cs
        },
        ReferenceDot: {
          handler: _.renderReferenceElement
        },
        XAxis: {
          handler: cs
        },
        YAxis: {
          handler: cs
        },
        Brush: {
          handler: _.renderBrush,
          once: !0
        },
        Bar: {
          handler: _.renderGraphicChild
        },
        Line: {
          handler: _.renderGraphicChild
        },
        Area: {
          handler: _.renderGraphicChild
        },
        Radar: {
          handler: _.renderGraphicChild
        },
        RadialBar: {
          handler: _.renderGraphicChild
        },
        Scatter: {
          handler: _.renderGraphicChild
        },
        Pie: {
          handler: _.renderGraphicChild
        },
        Funnel: {
          handler: _.renderGraphicChild
        },
        Tooltip: {
          handler: _.renderCursor,
          once: !0
        },
        PolarGrid: {
          handler: _.renderPolarGrid,
          once: !0
        },
        PolarAngleAxis: {
          handler: _.renderPolarAxis
        },
        PolarRadiusAxis: {
          handler: _.renderPolarAxis
        },
        Customized: {
          handler: _.renderCustomized
        }
      }), _.clipPathId = "".concat((A = C.id) !== null && A !== void 0 ? A : Ei("recharts"), "-clip"), _.throttleTriggeredAfterMouseMove = GE(_.triggeredAfterMouseMove, (T = C.throttleDelay) !== null && T !== void 0 ? T : 1e3 / 60), _.state = {}, _;
    }
    return xU(P, b), yU(P, [{
      key: "componentDidMount",
      value: function() {
        var A, T;
        this.addListener(), this.accessibilityManager.setDetails({
          container: this.container,
          offset: {
            left: (A = this.props.margin.left) !== null && A !== void 0 ? A : 0,
            top: (T = this.props.margin.top) !== null && T !== void 0 ? T : 0
          },
          coordinateList: this.state.tooltipTicks,
          mouseHandlerCallback: this.triggeredAfterMouseMove,
          layout: this.props.layout
        }), this.displayDefaultTooltip();
      }
    }, {
      key: "displayDefaultTooltip",
      value: function() {
        var A = this.props, T = A.children, _ = A.data, O = A.height, k = A.layout, M = Qt(T, Zt);
        if (M) {
          var N = M.props.defaultIndex;
          if (!(typeof N != "number" || N < 0 || N > this.state.tooltipTicks.length - 1)) {
            var W = this.state.tooltipTicks[N] && this.state.tooltipTicks[N].value, R = ig(this.state, _, N, W), q = this.state.tooltipTicks[N].coordinate, F = (this.state.offset.top + O) / 2, X = k === "horizontal", G = X ? {
              x: q,
              y: F
            } : {
              y: q,
              x: F
            }, Y = this.state.formattedGraphicalItems.find(function(H) {
              var Q = H.item;
              return Q.type.name === "Scatter";
            });
            Y && (G = Z(Z({}, G), Y.props.points[N].tooltipPosition), R = Y.props.points[N].tooltipPayload);
            var ee = {
              activeTooltipIndex: N,
              isTooltipActive: !0,
              activeLabel: W,
              activePayload: R,
              activeCoordinate: G
            };
            this.setState(ee), this.renderCursor(M), this.accessibilityManager.setIndex(N);
          }
        }
      }
    }, {
      key: "getSnapshotBeforeUpdate",
      value: function(A, T) {
        if (!this.props.accessibilityLayer)
          return null;
        if (this.state.tooltipTicks !== T.tooltipTicks && this.accessibilityManager.setDetails({
          coordinateList: this.state.tooltipTicks
        }), this.props.layout !== A.layout && this.accessibilityManager.setDetails({
          layout: this.props.layout
        }), this.props.margin !== A.margin) {
          var _, O;
          this.accessibilityManager.setDetails({
            offset: {
              left: (_ = this.props.margin.left) !== null && _ !== void 0 ? _ : 0,
              top: (O = this.props.margin.top) !== null && O !== void 0 ? O : 0
            }
          });
        }
        return null;
      }
    }, {
      key: "componentDidUpdate",
      value: function(A) {
        By([Qt(A.children, Zt)], [Qt(this.props.children, Zt)]) || this.displayDefaultTooltip();
      }
    }, {
      key: "componentWillUnmount",
      value: function() {
        this.removeListener(), this.throttleTriggeredAfterMouseMove.cancel();
      }
    }, {
      key: "getTooltipEventType",
      value: function() {
        var A = Qt(this.props.children, Zt);
        if (A && typeof A.props.shared == "boolean") {
          var T = A.props.shared ? "axis" : "item";
          return c.indexOf(T) >= 0 ? T : u;
        }
        return u;
      }
      /**
       * Get the information of mouse in chart, return null when the mouse is not in the chart
       * @param  {MousePointer} event    The event object
       * @return {Object}          Mouse data
       */
    }, {
      key: "getMouseInfo",
      value: function(A) {
        if (!this.container)
          return null;
        var T = this.container, _ = T.getBoundingClientRect(), O = nR(_), k = {
          chartX: Math.round(A.pageX - O.left),
          chartY: Math.round(A.pageY - O.top)
        }, M = _.width / T.offsetWidth || 1, N = this.inRange(k.chartX, k.chartY, M);
        if (!N)
          return null;
        var W = this.state, R = W.xAxisMap, q = W.yAxisMap, F = this.getTooltipEventType(), X = FA(this.state, this.props.data, this.props.layout, N);
        if (F !== "axis" && R && q) {
          var G = Ln(R).scale, Y = Ln(q).scale, ee = G && G.invert ? G.invert(k.chartX) : null, H = Y && Y.invert ? Y.invert(k.chartY) : null;
          return Z(Z({}, k), {}, {
            xValue: ee,
            yValue: H
          }, X);
        }
        return X ? Z(Z({}, k), X) : null;
      }
    }, {
      key: "inRange",
      value: function(A, T) {
        var _ = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1, O = this.props.layout, k = A / _, M = T / _;
        if (O === "horizontal" || O === "vertical") {
          var N = this.state.offset, W = k >= N.left && k <= N.left + N.width && M >= N.top && M <= N.top + N.height;
          return W ? {
            x: k,
            y: M
          } : null;
        }
        var R = this.state, q = R.angleAxisMap, F = R.radiusAxisMap;
        if (q && F) {
          var X = Ln(q);
          return ZO({
            x: k,
            y: M
          }, X);
        }
        return null;
      }
    }, {
      key: "parseEventsOfWrapper",
      value: function() {
        var A = this.props.children, T = this.getTooltipEventType(), _ = Qt(A, Zt), O = {};
        _ && T === "axis" && (_.props.trigger === "click" ? O = {
          onClick: this.handleClick
        } : O = {
          onMouseEnter: this.handleMouseEnter,
          onDoubleClick: this.handleDoubleClick,
          onMouseMove: this.handleMouseMove,
          onMouseLeave: this.handleMouseLeave,
          onTouchMove: this.handleTouchMove,
          onTouchStart: this.handleTouchStart,
          onTouchEnd: this.handleTouchEnd,
          onContextMenu: this.handleContextMenu
        });
        var k = ds(this.props, this.handleOuterEvent);
        return Z(Z({}, k), O);
      }
    }, {
      key: "addListener",
      value: function() {
        Ny.on(Ry, this.handleReceiveSyncEvent);
      }
    }, {
      key: "removeListener",
      value: function() {
        Ny.removeListener(Ry, this.handleReceiveSyncEvent);
      }
    }, {
      key: "filterFormatItem",
      value: function(A, T, _) {
        for (var O = this.state.formattedGraphicalItems, k = 0, M = O.length; k < M; k++) {
          var N = O[k];
          if (N.item === A || N.props.key === A.key || T === un(N.item.type) && _ === N.childIndex)
            return N;
        }
        return null;
      }
    }, {
      key: "renderClipPath",
      value: function() {
        var A = this.clipPathId, T = this.state.offset, _ = T.left, O = T.top, k = T.height, M = T.width;
        return /* @__PURE__ */ $.createElement("defs", null, /* @__PURE__ */ $.createElement("clipPath", {
          id: A
        }, /* @__PURE__ */ $.createElement("rect", {
          x: _,
          y: O,
          height: k,
          width: M
        })));
      }
    }, {
      key: "getXScales",
      value: function() {
        var A = this.state.xAxisMap;
        return A ? Object.entries(A).reduce(function(T, _) {
          var O = qA(_, 2), k = O[0], M = O[1];
          return Z(Z({}, T), {}, xe({}, k, M.scale));
        }, {}) : null;
      }
    }, {
      key: "getYScales",
      value: function() {
        var A = this.state.yAxisMap;
        return A ? Object.entries(A).reduce(function(T, _) {
          var O = qA(_, 2), k = O[0], M = O[1];
          return Z(Z({}, T), {}, xe({}, k, M.scale));
        }, {}) : null;
      }
    }, {
      key: "getXScaleByAxisId",
      value: function(A) {
        var T;
        return (T = this.state.xAxisMap) === null || T === void 0 || (T = T[A]) === null || T === void 0 ? void 0 : T.scale;
      }
    }, {
      key: "getYScaleByAxisId",
      value: function(A) {
        var T;
        return (T = this.state.yAxisMap) === null || T === void 0 || (T = T[A]) === null || T === void 0 ? void 0 : T.scale;
      }
    }, {
      key: "getItemByXY",
      value: function(A) {
        var T = this.state, _ = T.formattedGraphicalItems, O = T.activeItem;
        if (_ && _.length)
          for (var k = 0, M = _.length; k < M; k++) {
            var N = _[k], W = N.props, R = N.item, q = R.type.defaultProps !== void 0 ? Z(Z({}, R.type.defaultProps), R.props) : R.props, F = un(R.type);
            if (F === "Bar") {
              var X = (W.data || []).find(function(H) {
                return wF(A, H);
              });
              if (X)
                return {
                  graphicalItem: N,
                  payload: X
                };
            } else if (F === "RadialBar") {
              var G = (W.data || []).find(function(H) {
                return ZO(A, H);
              });
              if (G)
                return {
                  graphicalItem: N,
                  payload: G
                };
            } else if (Ic(N, O) || $c(N, O) || Cu(N, O)) {
              var Y = c4({
                graphicalItem: N,
                activeTooltipItem: O,
                itemData: q.data
              }), ee = q.activeIndex === void 0 ? Y : q.activeIndex;
              return {
                graphicalItem: Z(Z({}, N), {}, {
                  childIndex: ee
                }),
                payload: Cu(N, O) ? q.data[Y] : N.props.data[Y]
              };
            }
          }
        return null;
      }
    }, {
      key: "render",
      value: function() {
        var A = this;
        if (!c1(this))
          return null;
        var T = this.props, _ = T.children, O = T.className, k = T.width, M = T.height, N = T.style, W = T.compact, R = T.title, q = T.desc, F = BA(T, sU), X = Ae(F, !1);
        if (W)
          return /* @__PURE__ */ $.createElement(yA, {
            state: this.state,
            width: this.props.width,
            height: this.props.height,
            clipPathId: this.clipPathId
          }, /* @__PURE__ */ $.createElement(Fy, la({}, X, {
            width: k,
            height: M,
            title: R,
            desc: q
          }), this.renderClipPath(), d1(_, this.renderMap)));
        if (this.props.accessibilityLayer) {
          var G, Y;
          X.tabIndex = (G = this.props.tabIndex) !== null && G !== void 0 ? G : 0, X.role = (Y = this.props.role) !== null && Y !== void 0 ? Y : "application", X.onKeyDown = function(H) {
            A.accessibilityManager.keyboardEvent(H);
          }, X.onFocus = function() {
            A.accessibilityManager.focus();
          };
        }
        var ee = this.parseEventsOfWrapper();
        return /* @__PURE__ */ $.createElement(yA, {
          state: this.state,
          width: this.props.width,
          height: this.props.height,
          clipPathId: this.clipPathId
        }, /* @__PURE__ */ $.createElement("div", la({
          className: ke("recharts-wrapper", O),
          style: Z({
            position: "relative",
            cursor: "default",
            width: k,
            height: M
          }, N)
        }, ee, {
          ref: function(Q) {
            A.container = Q;
          }
        }), /* @__PURE__ */ $.createElement(Fy, la({}, X, {
          width: k,
          height: M,
          title: R,
          desc: q,
          style: AU
        }), this.renderClipPath(), d1(_, this.renderMap)), this.renderLegend(), this.renderTooltip()));
      }
    }]);
  })(V.Component);
  xe(S, "displayName", r), xe(S, "defaultProps", Z({
    layout: "horizontal",
    stackOffset: "none",
    barCategoryGap: "10%",
    barGap: 4,
    margin: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },
    reverseStackOrder: !1,
    syncMethod: "index"
  }, h)), xe(S, "getDerivedStateFromProps", function(b, P) {
    var C = b.dataKey, A = b.data, T = b.children, _ = b.width, O = b.height, k = b.layout, M = b.stackOffset, N = b.margin, W = P.dataStartIndex, R = P.dataEndIndex;
    if (P.updateId === void 0) {
      var q = UA(b);
      return Z(Z(Z({}, q), {}, {
        updateId: 0
      }, x(Z(Z({
        props: b
      }, q), {}, {
        updateId: 0
      }), P)), {}, {
        prevDataKey: C,
        prevData: A,
        prevWidth: _,
        prevHeight: O,
        prevLayout: k,
        prevStackOffset: M,
        prevMargin: N,
        prevChildren: T
      });
    }
    if (C !== P.prevDataKey || A !== P.prevData || _ !== P.prevWidth || O !== P.prevHeight || k !== P.prevLayout || M !== P.prevStackOffset || !sa(N, P.prevMargin)) {
      var F = UA(b), X = {
        // (chartX, chartY) are (0,0) in default state, but we want to keep the last mouse position to avoid
        // any flickering
        chartX: P.chartX,
        chartY: P.chartY,
        // The tooltip should stay active when it was active in the previous render. If this is not
        // the case, the tooltip disappears and immediately re-appears, causing a flickering effect
        isTooltipActive: P.isTooltipActive
      }, G = Z(Z({}, FA(P, A, k)), {}, {
        updateId: P.updateId + 1
      }), Y = Z(Z(Z({}, F), X), G);
      return Z(Z(Z({}, Y), x(Z({
        props: b
      }, Y), P)), {}, {
        prevDataKey: C,
        prevData: A,
        prevWidth: _,
        prevHeight: O,
        prevLayout: k,
        prevStackOffset: M,
        prevMargin: N,
        prevChildren: T
      });
    }
    if (!By(T, P.prevChildren)) {
      var ee, H, Q, J, I = Qt(T, Oa), B = I && (ee = (H = I.props) === null || H === void 0 ? void 0 : H.startIndex) !== null && ee !== void 0 ? ee : W, ue = I && (Q = (J = I.props) === null || J === void 0 ? void 0 : J.endIndex) !== null && Q !== void 0 ? Q : R, pe = B !== W || ue !== R, me = !_e(A), Se = me && !pe ? P.updateId : P.updateId + 1;
      return Z(Z({
        updateId: Se
      }, x(Z(Z({
        props: b
      }, P), {}, {
        updateId: Se,
        dataStartIndex: B,
        dataEndIndex: ue
      }), P)), {}, {
        prevChildren: T,
        dataStartIndex: B,
        dataEndIndex: ue
      });
    }
    return null;
  }), xe(S, "renderActiveDot", function(b, P, C) {
    var A;
    return /* @__PURE__ */ V.isValidElement(b) ? A = /* @__PURE__ */ V.cloneElement(b, P) : Ee(b) ? A = b(P) : A = /* @__PURE__ */ $.createElement(Mc, P), /* @__PURE__ */ $.createElement(Ne, {
      className: "recharts-active-dot",
      key: C
    }, A);
  });
  var w = /* @__PURE__ */ V.forwardRef(function(P, C) {
    return /* @__PURE__ */ $.createElement(S, la({}, P, {
      ref: C
    }));
  });
  return w.displayName = S.displayName, w;
}, RU = Wc({
  chartName: "LineChart",
  GraphicalChild: Pi,
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: Br
  }, {
    axisType: "yAxis",
    AxisComp: zr
  }],
  formatAxisMap: Rc
}), DU = Wc({
  chartName: "BarChart",
  GraphicalChild: pn,
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ["axis", "item"],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: Br
  }, {
    axisType: "yAxis",
    AxisComp: zr
  }],
  formatAxisMap: Rc
}), LU = Wc({
  chartName: "AreaChart",
  GraphicalChild: Kr,
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: Br
  }, {
    axisType: "yAxis",
    AxisComp: zr
  }],
  formatAxisMap: Rc
}), qU = Wc({
  chartName: "ComposedChart",
  GraphicalChild: [Pi, Kr, pn, Fc],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: Br
  }, {
    axisType: "yAxis",
    AxisComp: zr
  }, {
    axisType: "zAxis",
    AxisComp: zc
  }],
  formatAxisMap: Rc
});
const BU = ":host{display:block;width:100%}.recharts-responsive-container{width:100%!important;height:100%!important;min-width:0}.recharts-rectangle.recharts-tooltip-cursor{fill:none!important;opacity:0!important}";
var zU = Object.defineProperty, FU = Object.getOwnPropertyDescriptor, UU = (e, t, r) => t in e ? zU(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, WU = (e, t, r, n) => {
  for (var a = n > 1 ? void 0 : n ? FU(t, r) : t, u = e.length - 1, l; u >= 0; u--)
    (l = e[u]) && (a = l(a) || a);
  return a;
}, lk = (e, t, r) => UU(e, typeof t != "symbol" ? t + "" : t, r);
let sc = class extends aM {
  containerRef = null;
  root = null;
  /**
   * 生成颜色
   */
  getColor(e, t) {
    if (t) return t;
    const r = [
      "var(--blue-400)",
      "var(--purple-400)",
      "var(--green-400)",
      "var(--orange-400)",
      "var(--pink-400)",
      "var(--teal-400)"
    ];
    return r[e % r.length];
  }
  /**
   * 自定义简单 Tooltip - 使用 theme.css 中的 _ChartTooltip_1mdf2_62 样式
   */
  createCustomTooltip = (e) => ({ active: t, payload: r }) => !t || !r || !r.length ? null : V.createElement(
    "div",
    {
      className: "_ChartTooltip_1mdf2_62",
      style: {
        // 使用 theme.css 中的 CSS 变量
        padding: "calc(var(--spacing) * 1.5) calc(var(--spacing) * 2)",
        gap: "calc(var(--spacing) * 1.5)",
        borderRadius: "var(--popover-radius)",
        background: "var(--color-surface-elevated)",
        fontSize: "var(--font-text-xs-size)",
        lineHeight: "var(--font-text-xs-line-height)",
        border: "1px solid var(--color-border)"
      }
    },
    r.map((n, a) => {
      const u = e.find(
        (f) => f.dataKey === n.dataKey
      ), l = this.getColor(a, u?.color), c = u?.label || n.dataKey;
      return V.createElement(
        "div",
        {
          key: n.dataKey,
          style: {
            display: "flex",
            alignItems: "center",
            gap: "calc(var(--spacing) * 2)"
          }
        },
        V.createElement("div", {
          style: {
            width: "calc(var(--spacing) * 2.5)",
            height: "calc(var(--spacing) * 2.5)",
            backgroundColor: l,
            borderRadius: "var(--radius-2xs)",
            flexShrink: 0
          }
        }),
        V.createElement(
          "span",
          {
            style: {
              color: "var(--color-text-secondary)",
              fontSize: "var(--font-text-xs-size)",
              lineHeight: "var(--font-text-xs-line-height)"
            }
          },
          c
        ),
        V.createElement(
          "span",
          {
            style: {
              color: "var(--color-text)",
              fontSize: "var(--font-text-xs-size)",
              lineHeight: "var(--font-text-xs-line-height)",
              fontWeight: "500"
            }
          },
          n.value
        )
      );
    })
  );
  /**
   * 创建 React Chart 组件
   */
  createReactChart(e) {
    const {
      data: t = [],
      series: r = [],
      xAxis: n = "name",
      showTooltip: a = !0,
      showYAxis: u = !1,
      // 默认不展示 Y 轴
      showLegend: l = !0,
      aspectRatio: c = 4 / 3,
      // 柱状图间距属性
      barGap: f,
      barCategoryGap: d
    } = e, v = typeof n == "string" ? n : n.dataKey, m = (() => {
      if (!r || r.length === 0) return "line";
      const T = r.map((O) => O.type || "line"), _ = Array.from(new Set(T));
      return _.length === 1 ? _[0] : "mixed";
    })(), x = () => r.map((T, _) => {
      const O = this.getColor(_, T.color);
      return V.createElement(
        "linearGradient",
        {
          id: `fill-${T.dataKey}-bar`,
          x1: "0",
          y1: "0",
          x2: "0",
          y2: "1",
          key: T.dataKey
        },
        V.createElement("stop", {
          offset: "0%",
          stopColor: O,
          stopOpacity: 1
        }),
        V.createElement("stop", {
          offset: "100%",
          stopColor: O,
          stopOpacity: 0.9
        })
      );
    }), S = this.createCustomTooltip(r), w = () => {
      const T = { data: t };
      return f !== void 0 && (T.barGap = typeof f == "number" ? f : parseFloat(f)), d !== void 0 && (T.barCategoryGap = typeof d == "number" ? d : parseFloat(d)), V.createElement(
        DU,
        T,
        V.createElement(Ko, {
          strokeDasharray: "3 3",
          stroke: "var(--color-border)",
          vertical: !1
          // 不显示纵向网格线
        }),
        V.createElement(Br, {
          dataKey: v,
          className: "_Axis_1mdf2_55",
          tick: {
            fontSize: "var(--font-text-xs-size)",
            fill: "var(--color-text-secondary)"
          },
          axisLine: { stroke: "var(--color-border)" },
          tickLine: { stroke: "var(--color-border)" }
        }),
        u && V.createElement(zr, {
          className: "_Axis_1mdf2_55",
          tick: {
            fontSize: "var(--font-text-xs-size)",
            fill: "var(--color-text-secondary)"
          },
          axisLine: { stroke: "var(--color-border)" },
          tickLine: { stroke: "var(--color-border)" }
        }),
        a && V.createElement(Zt, { content: S }),
        l && V.createElement(Dr, {
          wrapperStyle: {
            fontSize: "var(--font-text-xs-size)",
            paddingTop: "calc(var(--spacing) * 2.5)"
          },
          iconType: "square",
          iconSize: 8,
          formatter: (_) => V.createElement(
            "span",
            {
              style: {
                verticalAlign: "middle",
                display: "inline-block",
                lineHeight: "calc(var(--spacing) * 2)"
              }
            },
            _
          )
        }),
        V.createElement("defs", {}, x()),
        ...r.map((_, O) => {
          const k = this.getColor(O, _.color);
          return V.createElement(pn, {
            key: _.dataKey,
            dataKey: _.dataKey,
            name: _.label || _.dataKey,
            fill: `url(#fill-${_.dataKey}-bar)`,
            stroke: k,
            radius: [4, 4, 1, 1],
            // hover 效果：使用 activeBar 属性定义 hover 时的样式
            activeBar: {
              fill: k,
              stroke: k,
              opacity: 0.8
            }
          });
        })
      );
    }, b = () => V.createElement(
      RU,
      { data: t },
      V.createElement(Ko, {
        strokeDasharray: "3 3",
        stroke: "var(--color-border)",
        vertical: !1
        // 默认不显示纵向网格线
      }),
      V.createElement(Br, {
        dataKey: v,
        className: "_Axis_1mdf2_55",
        tick: {
          fontSize: "var(--font-text-xs-size)",
          fill: "var(--color-text-secondary)"
        },
        axisLine: { stroke: "var(--color-border)" },
        tickLine: { stroke: "var(--color-border)" }
      }),
      u && V.createElement(zr, {
        className: "_Axis_1mdf2_55",
        tick: {
          fontSize: "var(--font-text-xs-size)",
          fill: "var(--color-text-secondary)"
        },
        axisLine: { stroke: "var(--color-border)" },
        tickLine: { stroke: "var(--color-border)" }
      }),
      a && V.createElement(Zt, { content: S }),
      l && V.createElement(Dr, {
        wrapperStyle: {
          fontSize: "var(--font-text-xs-size)",
          paddingTop: "calc(var(--spacing) * 2.5)"
        },
        iconType: "square",
        iconSize: 8,
        formatter: (T) => V.createElement(
          "span",
          {
            style: {
              verticalAlign: "middle",
              display: "inline-block",
              lineHeight: "calc(var(--spacing) * 2)"
            }
          },
          T
        )
      }),
      ...r.map(
        (T, _) => V.createElement(Pi, {
          key: T.dataKey,
          name: T.label || T.dataKey,
          type: "monotone",
          dataKey: T.dataKey,
          stroke: this.getColor(_, T.color),
          strokeWidth: 2,
          dot: !1,
          activeDot: { r: 4 }
        })
      )
    ), P = () => V.createElement(
      LU,
      { data: t },
      V.createElement(Ko, {
        strokeDasharray: "3 3",
        stroke: "var(--color-border)",
        vertical: !1
        // 默认不显示纵向网格线
      }),
      V.createElement(Br, {
        dataKey: v,
        className: "_Axis_1mdf2_55",
        tick: {
          fontSize: "var(--font-text-xs-size)",
          fill: "var(--color-text-secondary)"
        },
        axisLine: { stroke: "var(--color-border)" },
        tickLine: { stroke: "var(--color-border)" }
      }),
      u && V.createElement(zr, {
        className: "_Axis_1mdf2_55",
        tick: {
          fontSize: "var(--font-text-xs-size)",
          fill: "var(--color-text-secondary)"
        },
        axisLine: { stroke: "var(--color-border)" },
        tickLine: { stroke: "var(--color-border)" }
      }),
      a && V.createElement(Zt, { content: S }),
      l && V.createElement(Dr, {
        wrapperStyle: {
          fontSize: "var(--font-text-xs-size)",
          paddingTop: "calc(var(--spacing) * 2.5)"
        },
        iconType: "square",
        iconSize: 8,
        formatter: (T) => V.createElement(
          "span",
          {
            style: {
              verticalAlign: "middle",
              display: "inline-block",
              lineHeight: "calc(var(--spacing) * 2)"
            }
          },
          T
        )
      }),
      V.createElement("defs", {}, x()),
      ...r.map(
        (T, _) => V.createElement(Kr, {
          key: T.dataKey,
          name: T.label || T.dataKey,
          type: "monotone",
          dataKey: T.dataKey,
          stroke: this.getColor(_, T.color),
          fill: `url(#fill-${T.dataKey}-bar)`
        })
      )
    ), C = () => {
      const T = { data: t }, _ = r.some((O) => (O.type || "line") === "bar");
      return _ && f !== void 0 && (T.barGap = typeof f == "number" ? f : parseFloat(f)), _ && d !== void 0 && (T.barCategoryGap = typeof d == "number" ? d : parseFloat(d)), V.createElement(
        qU,
        T,
        V.createElement(Ko, {
          strokeDasharray: "3 3",
          stroke: "var(--color-border)",
          vertical: !1
        }),
        V.createElement(Br, {
          dataKey: v,
          className: "_Axis_1mdf2_55",
          tick: {
            fontSize: "var(--font-text-xs-size)",
            fill: "var(--color-text-secondary)"
          },
          axisLine: { stroke: "var(--color-border)" },
          tickLine: { stroke: "var(--color-border)" }
        }),
        u && V.createElement(zr, {
          className: "_Axis_1mdf2_55",
          tick: {
            fontSize: "var(--font-text-xs-size)",
            fill: "var(--color-text-secondary)"
          },
          axisLine: { stroke: "var(--color-border)" },
          tickLine: { stroke: "var(--color-border)" }
        }),
        a && V.createElement(Zt, { content: S }),
        l && V.createElement(Dr, {
          wrapperStyle: {
            fontSize: "var(--font-text-xs-size)",
            paddingTop: "calc(var(--spacing) * 2.5)"
          },
          iconType: "square",
          iconSize: 8,
          formatter: (O) => V.createElement(
            "span",
            {
              style: {
                verticalAlign: "middle",
                display: "inline-block",
                lineHeight: "calc(var(--spacing) * 2)"
              }
            },
            O
          )
        }),
        V.createElement("defs", {}, x()),
        ...r.map((O, k) => {
          const M = O.type || "line", N = this.getColor(k, O.color);
          switch (M) {
            case "bar":
              return V.createElement(pn, {
                key: O.dataKey,
                dataKey: O.dataKey,
                name: O.label || O.dataKey,
                fill: `url(#fill-${O.dataKey}-bar)`,
                stroke: N,
                radius: [4, 4, 1, 1],
                activeBar: {
                  fill: N,
                  stroke: N,
                  opacity: 0.8
                }
              });
            case "area":
              return V.createElement(Kr, {
                key: O.dataKey,
                name: O.label || O.dataKey,
                type: "monotone",
                dataKey: O.dataKey,
                stroke: N,
                fill: `url(#fill-${O.dataKey}-bar)`
              });
            case "line":
            default:
              return V.createElement(Pi, {
                key: O.dataKey,
                name: O.label || O.dataKey,
                type: "monotone",
                dataKey: O.dataKey,
                stroke: N,
                strokeWidth: 2,
                dot: !1,
                activeDot: { r: 4 }
              });
          }
        })
      );
    };
    if (!t || t.length === 0)
      return V.createElement(
        "div",
        {
          className: "_Box_fbeyu_1 _Chart_1mdf2_1",
          style: { aspectRatio: String(c) }
        },
        V.createElement(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--color-text-secondary)"
            }
          },
          "No data available"
        )
      );
    let A;
    if (m === "mixed")
      A = C();
    else
      switch (m) {
        case "line":
          A = b();
          break;
        case "area":
          A = P();
          break;
        case "bar":
        default:
          A = w();
      }
    return V.createElement(
      YN,
      { width: "100%", height: "100%" },
      A
    );
  }
  /**
   * 组件安装后，使用 ReactDOM 渲染 Recharts
   */
  installed() {
    this.updateHostAttributes(), this.renderReactChart();
  }
  /**
   * 属性更新时，重新渲染
   */
  receiveProps() {
    return this.updateHostAttributes(), this.renderReactChart(), !0;
  }
  /**
   * 更新宿主元素的属性
   */
  updateHostAttributes() {
    const e = this;
    e && e.setAttribute("data-w-component", "chart");
  }
  /**
   * 使用 ReactDOM 渲染 React 图表组件
   */
  renderReactChart() {
    if (!this.containerRef && this.shadowRoot && (this.containerRef = this.shadowRoot.querySelector(
      "._Chart_1mdf2_1"
    )), !this.containerRef) return;
    const e = this.createReactChart(this.props);
    this.root || (this.root = hM.createRoot(this.containerRef)), this.root.render(e);
  }
  /**
   * 组件卸载时，清理 React root
   */
  uninstall() {
    this.root && (this.root.unmount(), this.root = null);
  }
  /**
   * 检查组件是否在容器内（检查父元素是否有 data-w-container 属性）
   */
  isInContainer() {
    const e = this;
    if (!e || !e.parentElement) return !1;
    let t = e.parentElement;
    for (; t; ) {
      if (t.hasAttribute("data-w-container"))
        return !0;
      t = t.parentElement;
    }
    return !1;
  }
  render() {
    const {
      aspectRatio: e = 4 / 3,
      showYAxis: t = !1,
      width: r,
      minWidth: n,
      maxWidth: a,
      size: u,
      flex: l
    } = this.props, c = [];
    if (c.push(`aspect-ratio: ${e}`), r !== void 0 || u !== void 0 || l !== void 0 || this.isInContainer() ? c.push("width: 100%") : c.push("width: 260px"), u !== void 0) {
      const v = typeof u == "number" ? `${u}px` : u;
      c[c.length - 1] = `width: ${v}`;
    }
    if (r !== void 0) {
      const v = typeof r == "number" ? `${r}px` : r;
      c[c.length - 1] = `width: ${v}`;
    }
    if (n !== void 0) {
      const v = typeof n == "number" ? `${n}px` : n;
      c.push(`min-width: ${v}`);
    }
    if (a !== void 0) {
      const v = typeof a == "number" ? `${a}px` : a;
      c.push(`max-width: ${v}`);
    }
    l !== void 0 && (c.push(`flex: ${l}`), c[1] = "");
    const d = c.filter((v) => v).join("; ");
    return /* @__PURE__ */ oM(
      "div",
      {
        class: "_Box_fbeyu_1 _Chart_1mdf2_1",
        "data-w-direction": "col",
        "data-w-auto-spacing": "",
        "data-y-axis": t ? "visible" : "hidden",
        style: d
      }
    );
  }
};
lk(sc, "props", {
  data: Array,
  series: Array,
  xAxis: [String, Object],
  // 支持 string 或 { dataKey: string }
  showTooltip: Boolean,
  showYAxis: Boolean,
  showLegend: Boolean,
  aspectRatio: Number,
  // 柱状图间距属性
  barGap: [String, Number],
  barCategoryGap: [String, Number],
  // 尺寸属性
  width: [String, Number],
  minWidth: [String, Number],
  maxWidth: [String, Number],
  size: [String, Number],
  flex: [String, Number]
});
lk(sc, "css", BU);
sc = WU([
  uM("chart-widget")
], sc);
class HU {
  render(t) {
    const r = {};
    return t.data !== void 0 && (r.data = t.data), t.series !== void 0 && (r.series = t.series), t.xAxis !== void 0 && (r.xAxis = typeof t.xAxis == "string" ? t.xAxis : t.xAxis.dataKey), t.showTooltip !== void 0 && (r.showTooltip = t.showTooltip), t.showYAxis !== void 0 && (r.showYAxis = t.showYAxis), t.showLegend !== void 0 && (r.showLegend = t.showLegend), t.aspectRatio !== void 0 && (r.aspectRatio = t.aspectRatio), t.barGap !== void 0 && (r.barGap = t.barGap), t.barCategoryGap !== void 0 && (r.barCategoryGap = t.barCategoryGap), t.width !== void 0 && (r.width = t.width), t.minWidth !== void 0 && (r.minWidth = t.minWidth), t.maxWidth !== void 0 && (r.maxWidth = t.maxWidth), t.size !== void 0 && (r.size = t.size), t.flex !== void 0 && (r.flex = t.flex), {
      tag: "chart-widget",
      props: r,
      attrs: {
        ...t.id ? { id: t.id } : {},
        ...t.key ? { "data-key": t.key } : {}
      }
    };
  }
}
function GU(e) {
  e.registerComponent("Chart", new HU()), console.log("✓ Chart adapter registered");
}
export {
  sc as ChartWidget,
  GU as registerChartAdapter
};
