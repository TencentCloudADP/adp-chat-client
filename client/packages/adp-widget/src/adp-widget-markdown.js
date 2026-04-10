import { c as la, a as An, e as ti, A as Tr, t as ri, b as ui, G as ai } from "./adp-widget-vendor.js";
var Mr = { exports: {} }, oa;
function ni() {
  return oa || (oa = 1, (function(t) {
    var e = typeof window < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {};
    var r = (function(u) {
      var a = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, n = 0, i = {}, s = {
        /**
         * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
         * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
         * additional languages or plugins yourself.
         *
         * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
         *
         * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.manual = true;
         * // add a new <script> to load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        manual: u.Prism && u.Prism.manual,
        /**
         * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
         * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
         * own worker, you don't want it to do this.
         *
         * By setting this value to `true`, Prism will not add its own listeners to the worker.
         *
         * You obviously have to change this value before Prism executes. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.disableWorkerMessageHandler = true;
         * // Load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        disableWorkerMessageHandler: u.Prism && u.Prism.disableWorkerMessageHandler,
        /**
         * A namespace for utility methods.
         *
         * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
         * change or disappear at any time.
         *
         * @namespace
         * @memberof Prism
         */
        util: {
          encode: function v(w) {
            return w instanceof o ? new o(w.type, v(w.content), w.alias) : Array.isArray(w) ? w.map(v) : w.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
          },
          /**
           * Returns the name of the type of the given value.
           *
           * @param {any} o
           * @returns {string}
           * @example
           * type(null)      === 'Null'
           * type(undefined) === 'Undefined'
           * type(123)       === 'Number'
           * type('foo')     === 'String'
           * type(true)      === 'Boolean'
           * type([1, 2])    === 'Array'
           * type({})        === 'Object'
           * type(String)    === 'Function'
           * type(/abc+/)    === 'RegExp'
           */
          type: function(v) {
            return Object.prototype.toString.call(v).slice(8, -1);
          },
          /**
           * Returns a unique number for the given object. Later calls will still return the same number.
           *
           * @param {Object} obj
           * @returns {number}
           */
          objId: function(v) {
            return v.__id || Object.defineProperty(v, "__id", { value: ++n }), v.__id;
          },
          /**
           * Creates a deep clone of the given object.
           *
           * The main intended use of this function is to clone language definitions.
           *
           * @param {T} o
           * @param {Record<number, any>} [visited]
           * @returns {T}
           * @template T
           */
          clone: function v(w, C) {
            C = C || {};
            var D, M;
            switch (s.util.type(w)) {
              case "Object":
                if (M = s.util.objId(w), C[M])
                  return C[M];
                D = /** @type {Record<string, any>} */
                {}, C[M] = D;
                for (var z in w)
                  w.hasOwnProperty(z) && (D[z] = v(w[z], C));
                return (
                  /** @type {any} */
                  D
                );
              case "Array":
                return M = s.util.objId(w), C[M] ? C[M] : (D = [], C[M] = D, /** @type {Array} */
                /** @type {any} */
                w.forEach(function(P, N) {
                  D[N] = v(P, C);
                }), /** @type {any} */
                D);
              default:
                return w;
            }
          },
          /**
           * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
           *
           * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
           *
           * @param {Element} element
           * @returns {string}
           */
          getLanguage: function(v) {
            for (; v; ) {
              var w = a.exec(v.className);
              if (w)
                return w[1].toLowerCase();
              v = v.parentElement;
            }
            return "none";
          },
          /**
           * Sets the Prism `language-xxxx` class of the given element.
           *
           * @param {Element} element
           * @param {string} language
           * @returns {void}
           */
          setLanguage: function(v, w) {
            v.className = v.className.replace(RegExp(a, "gi"), ""), v.classList.add("language-" + w);
          },
          /**
           * Returns the script element that is currently executing.
           *
           * This does __not__ work for line script element.
           *
           * @returns {HTMLScriptElement | null}
           */
          currentScript: function() {
            if (typeof document > "u")
              return null;
            if (document.currentScript && document.currentScript.tagName === "SCRIPT")
              return (
                /** @type {any} */
                document.currentScript
              );
            try {
              throw new Error();
            } catch (D) {
              var v = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(D.stack) || [])[1];
              if (v) {
                var w = document.getElementsByTagName("script");
                for (var C in w)
                  if (w[C].src == v)
                    return w[C];
              }
              return null;
            }
          },
          /**
           * Returns whether a given class is active for `element`.
           *
           * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
           * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
           * given class is just the given class with a `no-` prefix.
           *
           * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
           * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
           * ancestors have the given class or the negated version of it, then the default activation will be returned.
           *
           * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
           * version of it, the class is considered active.
           *
           * @param {Element} element
           * @param {string} className
           * @param {boolean} [defaultActivation=false]
           * @returns {boolean}
           */
          isActive: function(v, w, C) {
            for (var D = "no-" + w; v; ) {
              var M = v.classList;
              if (M.contains(w))
                return !0;
              if (M.contains(D))
                return !1;
              v = v.parentElement;
            }
            return !!C;
          }
        },
        /**
         * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
         *
         * @namespace
         * @memberof Prism
         * @public
         */
        languages: {
          /**
           * The grammar for plain, unformatted text.
           */
          plain: i,
          plaintext: i,
          text: i,
          txt: i,
          /**
           * Creates a deep copy of the language with the given id and appends the given tokens.
           *
           * If a token in `redef` also appears in the copied language, then the existing token in the copied language
           * will be overwritten at its original position.
           *
           * ## Best practices
           *
           * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
           * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
           * understand the language definition because, normally, the order of tokens matters in Prism grammars.
           *
           * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
           * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
           *
           * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
           * @param {Grammar} redef The new tokens to append.
           * @returns {Grammar} The new language created.
           * @public
           * @example
           * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
           *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
           *     // at its original position
           *     'comment': { ... },
           *     // CSS doesn't have a 'color' token, so this token will be appended
           *     'color': /\b(?:red|green|blue)\b/
           * });
           */
          extend: function(v, w) {
            var C = s.util.clone(s.languages[v]);
            for (var D in w)
              C[D] = w[D];
            return C;
          },
          /**
           * Inserts tokens _before_ another token in a language definition or any other grammar.
           *
           * ## Usage
           *
           * This helper method makes it easy to modify existing languages. For example, the CSS language definition
           * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
           * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
           * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
           * this:
           *
           * ```js
           * Prism.languages.markup.style = {
           *     // token
           * };
           * ```
           *
           * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
           * before existing tokens. For the CSS example above, you would use it like this:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'cdata', {
           *     'style': {
           *         // token
           *     }
           * });
           * ```
           *
           * ## Special cases
           *
           * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
           * will be ignored.
           *
           * This behavior can be used to insert tokens after `before`:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'comment', {
           *     'comment': Prism.languages.markup.comment,
           *     // tokens after 'comment'
           * });
           * ```
           *
           * ## Limitations
           *
           * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
           * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
           * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
           * deleting properties which is necessary to insert at arbitrary positions.
           *
           * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
           * Instead, it will create a new object and replace all references to the target object with the new one. This
           * can be done without temporarily deleting properties, so the iteration order is well-defined.
           *
           * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
           * you hold the target object in a variable, then the value of the variable will not change.
           *
           * ```js
           * var oldMarkup = Prism.languages.markup;
           * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
           *
           * assert(oldMarkup !== Prism.languages.markup);
           * assert(newMarkup === Prism.languages.markup);
           * ```
           *
           * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
           * object to be modified.
           * @param {string} before The key to insert before.
           * @param {Grammar} insert An object containing the key-value pairs to be inserted.
           * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
           * object to be modified.
           *
           * Defaults to `Prism.languages`.
           * @returns {Grammar} The new grammar object.
           * @public
           */
          insertBefore: function(v, w, C, D) {
            D = D || /** @type {any} */
            s.languages;
            var M = D[v], z = {};
            for (var P in M)
              if (M.hasOwnProperty(P)) {
                if (P == w)
                  for (var N in C)
                    C.hasOwnProperty(N) && (z[N] = C[N]);
                C.hasOwnProperty(P) || (z[P] = M[P]);
              }
            var Y = D[v];
            return D[v] = z, s.languages.DFS(s.languages, function(G, K) {
              K === Y && G != v && (this[G] = z);
            }), z;
          },
          // Traverse a language definition with Depth First Search
          DFS: function v(w, C, D, M) {
            M = M || {};
            var z = s.util.objId;
            for (var P in w)
              if (w.hasOwnProperty(P)) {
                C.call(w, P, w[P], D || P);
                var N = w[P], Y = s.util.type(N);
                Y === "Object" && !M[z(N)] ? (M[z(N)] = !0, v(N, C, null, M)) : Y === "Array" && !M[z(N)] && (M[z(N)] = !0, v(N, C, P, M));
              }
          }
        },
        plugins: {},
        /**
         * This is the most high-level function in Prism’s API.
         * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
         * each one of them.
         *
         * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
         *
         * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
         * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
         * @memberof Prism
         * @public
         */
        highlightAll: function(v, w) {
          s.highlightAllUnder(document, v, w);
        },
        /**
         * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
         * {@link Prism.highlightElement} on each one of them.
         *
         * The following hooks will be run:
         * 1. `before-highlightall`
         * 2. `before-all-elements-highlight`
         * 3. All hooks of {@link Prism.highlightElement} for each element.
         *
         * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
         * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
         * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
         * @memberof Prism
         * @public
         */
        highlightAllUnder: function(v, w, C) {
          var D = {
            callback: C,
            container: v,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          s.hooks.run("before-highlightall", D), D.elements = Array.prototype.slice.apply(D.container.querySelectorAll(D.selector)), s.hooks.run("before-all-elements-highlight", D);
          for (var M = 0, z; z = D.elements[M++]; )
            s.highlightElement(z, w === !0, D.callback);
        },
        /**
         * Highlights the code inside a single element.
         *
         * The following hooks will be run:
         * 1. `before-sanity-check`
         * 2. `before-highlight`
         * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
         * 4. `before-insert`
         * 5. `after-highlight`
         * 6. `complete`
         *
         * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
         * the element's language.
         *
         * @param {Element} element The element containing the code.
         * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
         * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
         * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
         * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
         *
         * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
         * asynchronous highlighting to work. You can build your own bundle on the
         * [Download page](https://prismjs.com/download.html).
         * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
         * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
         * @memberof Prism
         * @public
         */
        highlightElement: function(v, w, C) {
          var D = s.util.getLanguage(v), M = s.languages[D];
          s.util.setLanguage(v, D);
          var z = v.parentElement;
          z && z.nodeName.toLowerCase() === "pre" && s.util.setLanguage(z, D);
          var P = v.textContent, N = {
            element: v,
            language: D,
            grammar: M,
            code: P
          };
          function Y(K) {
            N.highlightedCode = K, s.hooks.run("before-insert", N), N.element.innerHTML = N.highlightedCode, s.hooks.run("after-highlight", N), s.hooks.run("complete", N), C && C.call(N.element);
          }
          if (s.hooks.run("before-sanity-check", N), z = N.element.parentElement, z && z.nodeName.toLowerCase() === "pre" && !z.hasAttribute("tabindex") && z.setAttribute("tabindex", "0"), !N.code) {
            s.hooks.run("complete", N), C && C.call(N.element);
            return;
          }
          if (s.hooks.run("before-highlight", N), !N.grammar) {
            Y(s.util.encode(N.code));
            return;
          }
          if (w && u.Worker) {
            var G = new Worker(s.filename);
            G.onmessage = function(K) {
              Y(K.data);
            }, G.postMessage(JSON.stringify({
              language: N.language,
              code: N.code,
              immediateClose: !0
            }));
          } else
            Y(s.highlight(N.code, N.grammar, N.language));
        },
        /**
         * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
         * and the language definitions to use, and returns a string with the HTML produced.
         *
         * The following hooks will be run:
         * 1. `before-tokenize`
         * 2. `after-tokenize`
         * 3. `wrap`: On each {@link Token}.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @param {string} language The name of the language definition passed to `grammar`.
         * @returns {string} The highlighted HTML.
         * @memberof Prism
         * @public
         * @example
         * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
         */
        highlight: function(v, w, C) {
          var D = {
            code: v,
            grammar: w,
            language: C
          };
          if (s.hooks.run("before-tokenize", D), !D.grammar)
            throw new Error('The language "' + D.language + '" has no grammar.');
          return D.tokens = s.tokenize(D.code, D.grammar), s.hooks.run("after-tokenize", D), o.stringify(s.util.encode(D.tokens), D.language);
        },
        /**
         * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
         * and the language definitions to use, and returns an array with the tokenized code.
         *
         * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
         *
         * This method could be useful in other contexts as well, as a very crude parser.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @returns {TokenStream} An array of strings and tokens, a token stream.
         * @memberof Prism
         * @public
         * @example
         * let code = `var foo = 0;`;
         * let tokens = Prism.tokenize(code, Prism.languages.javascript);
         * tokens.forEach(token => {
         *     if (token instanceof Prism.Token && token.type === 'number') {
         *         console.log(`Found numeric literal: ${token.content}`);
         *     }
         * });
         */
        tokenize: function(v, w) {
          var C = w.rest;
          if (C) {
            for (var D in C)
              w[D] = C[D];
            delete w.rest;
          }
          var M = new p();
          return k(M, M.head, v), f(v, M, w, M.head, 0), y(M);
        },
        /**
         * @namespace
         * @memberof Prism
         * @public
         */
        hooks: {
          all: {},
          /**
           * Adds the given callback to the list of callbacks for the given hook.
           *
           * The callback will be invoked when the hook it is registered for is run.
           * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
           *
           * One callback function can be registered to multiple hooks and the same hook multiple times.
           *
           * @param {string} name The name of the hook.
           * @param {HookCallback} callback The callback function which is given environment variables.
           * @public
           */
          add: function(v, w) {
            var C = s.hooks.all;
            C[v] = C[v] || [], C[v].push(w);
          },
          /**
           * Runs a hook invoking all registered callbacks with the given environment variables.
           *
           * Callbacks will be invoked synchronously and in the order in which they were registered.
           *
           * @param {string} name The name of the hook.
           * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
           * @public
           */
          run: function(v, w) {
            var C = s.hooks.all[v];
            if (!(!C || !C.length))
              for (var D = 0, M; M = C[D++]; )
                M(w);
          }
        },
        Token: o
      };
      u.Prism = s;
      function o(v, w, C, D) {
        this.type = v, this.content = w, this.alias = C, this.length = (D || "").length | 0;
      }
      o.stringify = function v(w, C) {
        if (typeof w == "string")
          return w;
        if (Array.isArray(w)) {
          var D = "";
          return w.forEach(function(Y) {
            D += v(Y, C);
          }), D;
        }
        var M = {
          type: w.type,
          content: v(w.content, C),
          tag: "span",
          classes: ["token", w.type],
          attributes: {},
          language: C
        }, z = w.alias;
        z && (Array.isArray(z) ? Array.prototype.push.apply(M.classes, z) : M.classes.push(z)), s.hooks.run("wrap", M);
        var P = "";
        for (var N in M.attributes)
          P += " " + N + '="' + (M.attributes[N] || "").replace(/"/g, "&quot;") + '"';
        return "<" + M.tag + ' class="' + M.classes.join(" ") + '"' + P + ">" + M.content + "</" + M.tag + ">";
      };
      function h(v, w, C, D) {
        v.lastIndex = w;
        var M = v.exec(C);
        if (M && D && M[1]) {
          var z = M[1].length;
          M.index += z, M[0] = M[0].slice(z);
        }
        return M;
      }
      function f(v, w, C, D, M, z) {
        for (var P in C)
          if (!(!C.hasOwnProperty(P) || !C[P])) {
            var N = C[P];
            N = Array.isArray(N) ? N : [N];
            for (var Y = 0; Y < N.length; ++Y) {
              if (z && z.cause == P + "," + Y)
                return;
              var G = N[Y], K = G.inside, C0 = !!G.lookbehind, o0 = !!G.greedy, m0 = G.alias;
              if (o0 && !G.pattern.global) {
                var L0 = G.pattern.toString().match(/[imsuy]*$/)[0];
                G.pattern = RegExp(G.pattern.source, L0 + "g");
              }
              for (var ee = G.pattern || G, n0 = D.next, E0 = M; n0 !== w.tail && !(z && E0 >= z.reach); E0 += n0.value.length, n0 = n0.next) {
                var k0 = n0.value;
                if (w.length > v.length)
                  return;
                if (!(k0 instanceof o)) {
                  var e0 = 1, u0;
                  if (o0) {
                    if (u0 = h(ee, E0, v, C0), !u0 || u0.index >= v.length)
                      break;
                    var U0 = u0.index, s0 = u0.index + u0[0].length, T0 = E0;
                    for (T0 += n0.value.length; U0 >= T0; )
                      n0 = n0.next, T0 += n0.value.length;
                    if (T0 -= n0.value.length, E0 = T0, n0.value instanceof o)
                      continue;
                    for (var J = n0; J !== w.tail && (T0 < s0 || typeof J.value == "string"); J = J.next)
                      e0++, T0 += J.value.length;
                    e0--, k0 = v.slice(E0, T0), u0.index -= E0;
                  } else if (u0 = h(ee, 0, k0, C0), !u0)
                    continue;
                  var U0 = u0.index, M0 = u0[0], S0 = k0.slice(0, U0), ie = k0.slice(U0 + M0.length), Y0 = E0 + k0.length;
                  z && Y0 > z.reach && (z.reach = Y0);
                  var ye = n0.prev;
                  S0 && (ye = k(w, ye, S0), E0 += S0.length), x(w, ye, e0);
                  var Je = new o(P, K ? s.tokenize(M0, K) : M0, m0, M0);
                  if (n0 = k(w, ye, Je), ie && k(w, n0, ie), e0 > 1) {
                    var X0 = {
                      cause: P + "," + Y,
                      reach: Y0
                    };
                    f(v, w, C, n0.prev, E0, X0), z && X0.reach > z.reach && (z.reach = X0.reach);
                  }
                }
              }
            }
          }
      }
      function p() {
        var v = { value: null, prev: null, next: null }, w = { value: null, prev: v, next: null };
        v.next = w, this.head = v, this.tail = w, this.length = 0;
      }
      function k(v, w, C) {
        var D = w.next, M = { value: C, prev: w, next: D };
        return w.next = M, D.prev = M, v.length++, M;
      }
      function x(v, w, C) {
        for (var D = w.next, M = 0; M < C && D !== v.tail; M++)
          D = D.next;
        w.next = D, D.prev = w, v.length -= M;
      }
      function y(v) {
        for (var w = [], C = v.head.next; C !== v.tail; )
          w.push(C.value), C = C.next;
        return w;
      }
      if (!u.document)
        return u.addEventListener && (s.disableWorkerMessageHandler || u.addEventListener("message", function(v) {
          var w = JSON.parse(v.data), C = w.language, D = w.code, M = w.immediateClose;
          u.postMessage(s.highlight(D, s.languages[C], C)), M && u.close();
        }, !1)), s;
      var _ = s.util.currentScript();
      _ && (s.filename = _.src, _.hasAttribute("data-manual") && (s.manual = !0));
      function E() {
        s.manual || s.highlightAll();
      }
      if (!s.manual) {
        var F = document.readyState;
        F === "loading" || F === "interactive" && _ && _.defer ? document.addEventListener("DOMContentLoaded", E) : window.requestAnimationFrame ? window.requestAnimationFrame(E) : window.setTimeout(E, 16);
      }
      return s;
    })(e);
    t.exports && (t.exports = r), typeof la < "u" && (la.Prism = r), r.languages.markup = {
      comment: {
        pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
        greedy: !0
      },
      prolog: {
        pattern: /<\?[\s\S]+?\?>/,
        greedy: !0
      },
      doctype: {
        // https://www.w3.org/TR/xml/#NT-doctypedecl
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
          "internal-subset": {
            pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
            lookbehind: !0,
            greedy: !0,
            inside: null
            // see below
          },
          string: {
            pattern: /"[^"]*"|'[^']*'/,
            greedy: !0
          },
          punctuation: /^<!|>$|[[\]]/,
          "doctype-tag": /^DOCTYPE/i,
          name: /[^\s<>'"]+/
        }
      },
      cdata: {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        greedy: !0
      },
      tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
          tag: {
            pattern: /^<\/?[^\s>\/]+/,
            inside: {
              punctuation: /^<\/?/,
              namespace: /^[^\s>\/:]+:/
            }
          },
          "special-attr": [],
          "attr-value": {
            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
            inside: {
              punctuation: [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                {
                  pattern: /^(\s*)["']|["']$/,
                  lookbehind: !0
                }
              ]
            }
          },
          punctuation: /\/?>/,
          "attr-name": {
            pattern: /[^\s>\/]+/,
            inside: {
              namespace: /^[^\s>\/:]+:/
            }
          }
        }
      },
      entity: [
        {
          pattern: /&[\da-z]{1,8};/i,
          alias: "named-entity"
        },
        /&#x?[\da-f]{1,8};/i
      ]
    }, r.languages.markup.tag.inside["attr-value"].inside.entity = r.languages.markup.entity, r.languages.markup.doctype.inside["internal-subset"].inside = r.languages.markup, r.hooks.add("wrap", function(u) {
      u.type === "entity" && (u.attributes.title = u.content.replace(/&amp;/, "&"));
    }), Object.defineProperty(r.languages.markup.tag, "addInlined", {
      /**
       * Adds an inlined language to markup.
       *
       * An example of an inlined language is CSS with `<style>` tags.
       *
       * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addInlined('style', 'css');
       */
      value: function(a, n) {
        var i = {};
        i["language-" + n] = {
          pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
          lookbehind: !0,
          inside: r.languages[n]
        }, i.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var s = {
          "included-cdata": {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            inside: i
          }
        };
        s["language-" + n] = {
          pattern: /[\s\S]+/,
          inside: r.languages[n]
        };
        var o = {};
        o[a] = {
          pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
            return a;
          }), "i"),
          lookbehind: !0,
          greedy: !0,
          inside: s
        }, r.languages.insertBefore("markup", "cdata", o);
      }
    }), Object.defineProperty(r.languages.markup.tag, "addAttribute", {
      /**
       * Adds an pattern to highlight languages embedded in HTML attributes.
       *
       * An example of an inlined language is CSS with `style` attributes.
       *
       * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addAttribute('style', 'css');
       */
      value: function(u, a) {
        r.languages.markup.tag.inside["special-attr"].push({
          pattern: RegExp(
            /(^|["'\s])/.source + "(?:" + u + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
            "i"
          ),
          lookbehind: !0,
          inside: {
            "attr-name": /^[^\s=]+/,
            "attr-value": {
              pattern: /=[\s\S]+/,
              inside: {
                value: {
                  pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                  lookbehind: !0,
                  alias: [a, "language-" + a],
                  inside: r.languages[a]
                },
                punctuation: [
                  {
                    pattern: /^=/,
                    alias: "attr-equals"
                  },
                  /"|'/
                ]
              }
            }
          }
        });
      }
    }), r.languages.html = r.languages.markup, r.languages.mathml = r.languages.markup, r.languages.svg = r.languages.markup, r.languages.xml = r.languages.extend("markup", {}), r.languages.ssml = r.languages.xml, r.languages.atom = r.languages.xml, r.languages.rss = r.languages.xml, (function(u) {
      var a = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
      u.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
          pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + a.source + ")*?" + /(?:;|(?=\s*\{))/.source),
          inside: {
            rule: /^@[\w-]+/,
            "selector-function-argument": {
              pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
              lookbehind: !0,
              alias: "selector"
            },
            keyword: {
              pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
              lookbehind: !0
            }
            // See rest below
          }
        },
        url: {
          // https://drafts.csswg.org/css-values-3/#urls
          pattern: RegExp("\\burl\\((?:" + a.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
          greedy: !0,
          inside: {
            function: /^url/i,
            punctuation: /^\(|\)$/,
            string: {
              pattern: RegExp("^" + a.source + "$"),
              alias: "url"
            }
          }
        },
        selector: {
          pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + a.source + ")*(?=\\s*\\{)"),
          lookbehind: !0
        },
        string: {
          pattern: a,
          greedy: !0
        },
        property: {
          pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
          lookbehind: !0
        },
        important: /!important\b/i,
        function: {
          pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
          lookbehind: !0
        },
        punctuation: /[(){};:,]/
      }, u.languages.css.atrule.inside.rest = u.languages.css;
      var n = u.languages.markup;
      n && (n.tag.addInlined("style", "css"), n.tag.addAttribute("style", "css"));
    })(r), r.languages.clike = {
      comment: [
        {
          pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
          lookbehind: !0,
          greedy: !0
        },
        {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: !0,
          greedy: !0
        }
      ],
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
      },
      "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {
          punctuation: /[.\\]/
        }
      },
      keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
      boolean: /\b(?:false|true)\b/,
      function: /\b\w+(?=\()/,
      number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
      operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
      punctuation: /[{}[\];(),.:]/
    }, r.languages.javascript = r.languages.extend("clike", {
      "class-name": [
        r.languages.clike["class-name"],
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
          lookbehind: !0
        }
      ],
      keyword: [
        {
          pattern: /((?:^|\})\s*)catch\b/,
          lookbehind: !0
        },
        {
          pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
          lookbehind: !0
        }
      ],
      // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
      function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
      number: {
        pattern: RegExp(
          /(^|[^\w$])/.source + "(?:" + // constant
          (/NaN|Infinity/.source + "|" + // binary integer
          /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
          /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
          /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
          /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
          /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
        ),
        lookbehind: !0
      },
      operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    }), r.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, r.languages.insertBefore("javascript", "keyword", {
      regex: {
        pattern: RegExp(
          // lookbehind
          // eslint-disable-next-line regexp/no-dupe-characters-character-class
          /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
          // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
          // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
          // with the only syntax, so we have to define 2 different regex patterns.
          /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
          /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
          /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          "regex-source": {
            pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
            lookbehind: !0,
            alias: "language-regex",
            inside: r.languages.regex
          },
          "regex-delimiter": /^\/|\/$/,
          "regex-flags": /^[a-z]+$/
        }
      },
      // This must be declared before keyword because we use "function" inside the look-forward
      "function-variable": {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: "function"
      },
      parameter: [
        {
          pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
          lookbehind: !0,
          inside: r.languages.javascript
        },
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
          lookbehind: !0,
          inside: r.languages.javascript
        },
        {
          pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
          lookbehind: !0,
          inside: r.languages.javascript
        },
        {
          pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
          lookbehind: !0,
          inside: r.languages.javascript
        }
      ],
      constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    }), r.languages.insertBefore("javascript", "string", {
      hashbang: {
        pattern: /^#!.*/,
        greedy: !0,
        alias: "comment"
      },
      "template-string": {
        pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: !0,
        inside: {
          "template-punctuation": {
            pattern: /^`|`$/,
            alias: "string"
          },
          interpolation: {
            pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
            lookbehind: !0,
            inside: {
              "interpolation-punctuation": {
                pattern: /^\$\{|\}$/,
                alias: "punctuation"
              },
              rest: r.languages.javascript
            }
          },
          string: /[\s\S]+/
        }
      },
      "string-property": {
        pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: !0,
        greedy: !0,
        alias: "property"
      }
    }), r.languages.insertBefore("javascript", "operator", {
      "literal-property": {
        pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: !0,
        alias: "property"
      }
    }), r.languages.markup && (r.languages.markup.tag.addInlined("script", "javascript"), r.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
      "javascript"
    )), r.languages.js = r.languages.javascript, (function() {
      if (typeof r > "u" || typeof document > "u")
        return;
      Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
      var u = "Loading…", a = function(_, E) {
        return "✖ Error " + _ + " while fetching file: " + E;
      }, n = "✖ Error: File does not exist or is empty", i = {
        js: "javascript",
        py: "python",
        rb: "ruby",
        ps1: "powershell",
        psm1: "powershell",
        sh: "bash",
        bat: "batch",
        h: "c",
        tex: "latex"
      }, s = "data-src-status", o = "loading", h = "loaded", f = "failed", p = "pre[data-src]:not([" + s + '="' + h + '"]):not([' + s + '="' + o + '"])';
      function k(_, E, F) {
        var v = new XMLHttpRequest();
        v.open("GET", _, !0), v.onreadystatechange = function() {
          v.readyState == 4 && (v.status < 400 && v.responseText ? E(v.responseText) : v.status >= 400 ? F(a(v.status, v.statusText)) : F(n));
        }, v.send(null);
      }
      function x(_) {
        var E = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(_ || "");
        if (E) {
          var F = Number(E[1]), v = E[2], w = E[3];
          return v ? w ? [F, Number(w)] : [F, void 0] : [F, F];
        }
      }
      r.hooks.add("before-highlightall", function(_) {
        _.selector += ", " + p;
      }), r.hooks.add("before-sanity-check", function(_) {
        var E = (
          /** @type {HTMLPreElement} */
          _.element
        );
        if (E.matches(p)) {
          _.code = "", E.setAttribute(s, o);
          var F = E.appendChild(document.createElement("CODE"));
          F.textContent = u;
          var v = E.getAttribute("data-src"), w = _.language;
          if (w === "none") {
            var C = (/\.(\w+)$/.exec(v) || [, "none"])[1];
            w = i[C] || C;
          }
          r.util.setLanguage(F, w), r.util.setLanguage(E, w);
          var D = r.plugins.autoloader;
          D && D.loadLanguages(w), k(
            v,
            function(M) {
              E.setAttribute(s, h);
              var z = x(E.getAttribute("data-range"));
              if (z) {
                var P = M.split(/\r\n?|\n/g), N = z[0], Y = z[1] == null ? P.length : z[1];
                N < 0 && (N += P.length), N = Math.max(0, Math.min(N - 1, P.length)), Y < 0 && (Y += P.length), Y = Math.max(0, Math.min(Y, P.length)), M = P.slice(N, Y).join(`
`), E.hasAttribute("data-start") || E.setAttribute("data-start", String(N + 1));
              }
              F.textContent = M, r.highlightElement(F);
            },
            function(M) {
              E.setAttribute(s, f), F.textContent = M;
            }
          );
        }
      }), r.plugins.fileHighlight = {
        /**
         * Executes the File Highlight plugin for all matching `pre` elements under the given container.
         *
         * Note: Elements which are already loaded or currently loading will not be touched by this method.
         *
         * @param {ParentNode} [container=document]
         */
        highlight: function(E) {
          for (var F = (E || document).querySelectorAll(p), v = 0, w; w = F[v++]; )
            r.highlightElement(w);
        }
      };
      var y = !1;
      r.fileHighlight = function() {
        y || (console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."), y = !0), r.plugins.fileHighlight.highlight.apply(this, arguments);
      };
    })();
  })(Mr)), Mr.exports;
}
var ii = ni();
const Fr = /* @__PURE__ */ An(ii), ca = {};
function si(t) {
  let e = ca[t];
  if (e)
    return e;
  e = ca[t] = [];
  for (let r = 0; r < 128; r++) {
    const u = String.fromCharCode(r);
    e.push(u);
  }
  for (let r = 0; r < t.length; r++) {
    const u = t.charCodeAt(r);
    e[u] = "%" + ("0" + u.toString(16).toUpperCase()).slice(-2);
  }
  return e;
}
function lt(t, e) {
  typeof e != "string" && (e = lt.defaultChars);
  const r = si(e);
  return t.replace(/(%[a-f0-9]{2})+/gi, function(u) {
    let a = "";
    for (let n = 0, i = u.length; n < i; n += 3) {
      const s = parseInt(u.slice(n + 1, n + 3), 16);
      if (s < 128) {
        a += r[s];
        continue;
      }
      if ((s & 224) === 192 && n + 3 < i) {
        const o = parseInt(u.slice(n + 4, n + 6), 16);
        if ((o & 192) === 128) {
          const h = s << 6 & 1984 | o & 63;
          h < 128 ? a += "��" : a += String.fromCharCode(h), n += 3;
          continue;
        }
      }
      if ((s & 240) === 224 && n + 6 < i) {
        const o = parseInt(u.slice(n + 4, n + 6), 16), h = parseInt(u.slice(n + 7, n + 9), 16);
        if ((o & 192) === 128 && (h & 192) === 128) {
          const f = s << 12 & 61440 | o << 6 & 4032 | h & 63;
          f < 2048 || f >= 55296 && f <= 57343 ? a += "���" : a += String.fromCharCode(f), n += 6;
          continue;
        }
      }
      if ((s & 248) === 240 && n + 9 < i) {
        const o = parseInt(u.slice(n + 4, n + 6), 16), h = parseInt(u.slice(n + 7, n + 9), 16), f = parseInt(u.slice(n + 10, n + 12), 16);
        if ((o & 192) === 128 && (h & 192) === 128 && (f & 192) === 128) {
          let p = s << 18 & 1835008 | o << 12 & 258048 | h << 6 & 4032 | f & 63;
          p < 65536 || p > 1114111 ? a += "����" : (p -= 65536, a += String.fromCharCode(55296 + (p >> 10), 56320 + (p & 1023))), n += 9;
          continue;
        }
      }
      a += "�";
    }
    return a;
  });
}
lt.defaultChars = ";/?:@&=+$,#";
lt.componentChars = "";
const ha = {};
function li(t) {
  let e = ha[t];
  if (e)
    return e;
  e = ha[t] = [];
  for (let r = 0; r < 128; r++) {
    const u = String.fromCharCode(r);
    /^[0-9a-z]$/i.test(u) ? e.push(u) : e.push("%" + ("0" + r.toString(16).toUpperCase()).slice(-2));
  }
  for (let r = 0; r < t.length; r++)
    e[t.charCodeAt(r)] = t[r];
  return e;
}
function Tt(t, e, r) {
  typeof e != "string" && (r = e, e = Tt.defaultChars), typeof r > "u" && (r = !0);
  const u = li(e);
  let a = "";
  for (let n = 0, i = t.length; n < i; n++) {
    const s = t.charCodeAt(n);
    if (r && s === 37 && n + 2 < i && /^[0-9a-f]{2}$/i.test(t.slice(n + 1, n + 3))) {
      a += t.slice(n, n + 3), n += 2;
      continue;
    }
    if (s < 128) {
      a += u[s];
      continue;
    }
    if (s >= 55296 && s <= 57343) {
      if (s >= 55296 && s <= 56319 && n + 1 < i) {
        const o = t.charCodeAt(n + 1);
        if (o >= 56320 && o <= 57343) {
          a += encodeURIComponent(t[n] + t[n + 1]), n++;
          continue;
        }
      }
      a += "%EF%BF%BD";
      continue;
    }
    a += encodeURIComponent(t[n]);
  }
  return a;
}
Tt.defaultChars = ";/?:@&=+$,-_.!~*'()#";
Tt.componentChars = "-_.!~*'()";
function ku(t) {
  let e = "";
  return e += t.protocol || "", e += t.slashes ? "//" : "", e += t.auth ? t.auth + "@" : "", t.hostname && t.hostname.indexOf(":") !== -1 ? e += "[" + t.hostname + "]" : e += t.hostname || "", e += t.port ? ":" + t.port : "", e += t.pathname || "", e += t.search || "", e += t.hash || "", e;
}
function er() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
const oi = /^([a-z0-9.+-]+:)/i, ci = /:[0-9]*$/, hi = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, di = ["<", ">", '"', "`", " ", "\r", `
`, "	"], fi = ["{", "}", "|", "\\", "^", "`"].concat(di), mi = ["'"].concat(fi), da = ["%", "/", "?", ";", "#"].concat(mi), fa = ["/", "?", "#"], pi = 255, ma = /^[+a-z0-9A-Z_-]{0,63}$/, bi = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, pa = {
  javascript: !0,
  "javascript:": !0
}, ba = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
};
function wu(t, e) {
  if (t && t instanceof er) return t;
  const r = new er();
  return r.parse(t, e), r;
}
er.prototype.parse = function(t, e) {
  let r, u, a, n = t;
  if (n = n.trim(), !e && t.split("#").length === 1) {
    const h = hi.exec(n);
    if (h)
      return this.pathname = h[1], h[2] && (this.search = h[2]), this;
  }
  let i = oi.exec(n);
  if (i && (i = i[0], r = i.toLowerCase(), this.protocol = i, n = n.substr(i.length)), (e || i || n.match(/^\/\/[^@\/]+@[^@\/]+/)) && (a = n.substr(0, 2) === "//", a && !(i && pa[i]) && (n = n.substr(2), this.slashes = !0)), !pa[i] && (a || i && !ba[i])) {
    let h = -1;
    for (let y = 0; y < fa.length; y++)
      u = n.indexOf(fa[y]), u !== -1 && (h === -1 || u < h) && (h = u);
    let f, p;
    h === -1 ? p = n.lastIndexOf("@") : p = n.lastIndexOf("@", h), p !== -1 && (f = n.slice(0, p), n = n.slice(p + 1), this.auth = f), h = -1;
    for (let y = 0; y < da.length; y++)
      u = n.indexOf(da[y]), u !== -1 && (h === -1 || u < h) && (h = u);
    h === -1 && (h = n.length), n[h - 1] === ":" && h--;
    const k = n.slice(0, h);
    n = n.slice(h), this.parseHost(k), this.hostname = this.hostname || "";
    const x = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!x) {
      const y = this.hostname.split(/\./);
      for (let _ = 0, E = y.length; _ < E; _++) {
        const F = y[_];
        if (F && !F.match(ma)) {
          let v = "";
          for (let w = 0, C = F.length; w < C; w++)
            F.charCodeAt(w) > 127 ? v += "x" : v += F[w];
          if (!v.match(ma)) {
            const w = y.slice(0, _), C = y.slice(_ + 1), D = F.match(bi);
            D && (w.push(D[1]), C.unshift(D[2])), C.length && (n = C.join(".") + n), this.hostname = w.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > pi && (this.hostname = ""), x && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  const s = n.indexOf("#");
  s !== -1 && (this.hash = n.substr(s), n = n.slice(0, s));
  const o = n.indexOf("?");
  return o !== -1 && (this.search = n.substr(o), n = n.slice(0, o)), n && (this.pathname = n), ba[r] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
er.prototype.parseHost = function(t) {
  let e = ci.exec(t);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), t = t.substr(0, t.length - e.length)), t && (this.hostname = t);
};
const gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: lt,
  encode: Tt,
  format: ku,
  parse: wu
}, Symbol.toStringTag, { value: "Module" })), Sn = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, _n = /[\0-\x1F\x7F-\x9F]/, vi = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, Au = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, Cn = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, En = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: Sn,
  Cc: _n,
  Cf: vi,
  P: Au,
  S: Cn,
  Z: En
}, Symbol.toStringTag, { value: "Module" })), yi = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((t) => t.charCodeAt(0))
), ki = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((t) => t.charCodeAt(0))
);
var zr;
const wi = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]), Ai = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (zr = String.fromCodePoint) !== null && zr !== void 0 ? zr : function(t) {
    let e = "";
    return t > 65535 && (t -= 65536, e += String.fromCharCode(t >>> 10 & 1023 | 55296), t = 56320 | t & 1023), e += String.fromCharCode(t), e;
  }
);
function Si(t) {
  var e;
  return t >= 55296 && t <= 57343 || t > 1114111 ? 65533 : (e = wi.get(t)) !== null && e !== void 0 ? e : t;
}
var A0;
(function(t) {
  t[t.NUM = 35] = "NUM", t[t.SEMI = 59] = "SEMI", t[t.EQUALS = 61] = "EQUALS", t[t.ZERO = 48] = "ZERO", t[t.NINE = 57] = "NINE", t[t.LOWER_A = 97] = "LOWER_A", t[t.LOWER_F = 102] = "LOWER_F", t[t.LOWER_X = 120] = "LOWER_X", t[t.LOWER_Z = 122] = "LOWER_Z", t[t.UPPER_A = 65] = "UPPER_A", t[t.UPPER_F = 70] = "UPPER_F", t[t.UPPER_Z = 90] = "UPPER_Z";
})(A0 || (A0 = {}));
const _i = 32;
var Oe;
(function(t) {
  t[t.VALUE_LENGTH = 49152] = "VALUE_LENGTH", t[t.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", t[t.JUMP_TABLE = 127] = "JUMP_TABLE";
})(Oe || (Oe = {}));
function lu(t) {
  return t >= A0.ZERO && t <= A0.NINE;
}
function Ci(t) {
  return t >= A0.UPPER_A && t <= A0.UPPER_F || t >= A0.LOWER_A && t <= A0.LOWER_F;
}
function Ei(t) {
  return t >= A0.UPPER_A && t <= A0.UPPER_Z || t >= A0.LOWER_A && t <= A0.LOWER_Z || lu(t);
}
function Di(t) {
  return t === A0.EQUALS || Ei(t);
}
var w0;
(function(t) {
  t[t.EntityStart = 0] = "EntityStart", t[t.NumericStart = 1] = "NumericStart", t[t.NumericDecimal = 2] = "NumericDecimal", t[t.NumericHex = 3] = "NumericHex", t[t.NamedEntity = 4] = "NamedEntity";
})(w0 || (w0 = {}));
var Le;
(function(t) {
  t[t.Legacy = 0] = "Legacy", t[t.Strict = 1] = "Strict", t[t.Attribute = 2] = "Attribute";
})(Le || (Le = {}));
class Ti {
  constructor(e, r, u) {
    this.decodeTree = e, this.emitCodePoint = r, this.errors = u, this.state = w0.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = Le.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(e) {
    this.decodeMode = e, this.state = w0.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(e, r) {
    switch (this.state) {
      case w0.EntityStart:
        return e.charCodeAt(r) === A0.NUM ? (this.state = w0.NumericStart, this.consumed += 1, this.stateNumericStart(e, r + 1)) : (this.state = w0.NamedEntity, this.stateNamedEntity(e, r));
      case w0.NumericStart:
        return this.stateNumericStart(e, r);
      case w0.NumericDecimal:
        return this.stateNumericDecimal(e, r);
      case w0.NumericHex:
        return this.stateNumericHex(e, r);
      case w0.NamedEntity:
        return this.stateNamedEntity(e, r);
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(e, r) {
    return r >= e.length ? -1 : (e.charCodeAt(r) | _i) === A0.LOWER_X ? (this.state = w0.NumericHex, this.consumed += 1, this.stateNumericHex(e, r + 1)) : (this.state = w0.NumericDecimal, this.stateNumericDecimal(e, r));
  }
  addToNumericResult(e, r, u, a) {
    if (r !== u) {
      const n = u - r;
      this.result = this.result * Math.pow(a, n) + parseInt(e.substr(r, n), a), this.consumed += n;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(e, r) {
    const u = r;
    for (; r < e.length; ) {
      const a = e.charCodeAt(r);
      if (lu(a) || Ci(a))
        r += 1;
      else
        return this.addToNumericResult(e, u, r, 16), this.emitNumericEntity(a, 3);
    }
    return this.addToNumericResult(e, u, r, 16), -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(e, r) {
    const u = r;
    for (; r < e.length; ) {
      const a = e.charCodeAt(r);
      if (lu(a))
        r += 1;
      else
        return this.addToNumericResult(e, u, r, 10), this.emitNumericEntity(a, 2);
    }
    return this.addToNumericResult(e, u, r, 10), -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(e, r) {
    var u;
    if (this.consumed <= r)
      return (u = this.errors) === null || u === void 0 || u.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
    if (e === A0.SEMI)
      this.consumed += 1;
    else if (this.decodeMode === Le.Strict)
      return 0;
    return this.emitCodePoint(Si(this.result), this.consumed), this.errors && (e !== A0.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(e, r) {
    const { decodeTree: u } = this;
    let a = u[this.treeIndex], n = (a & Oe.VALUE_LENGTH) >> 14;
    for (; r < e.length; r++, this.excess++) {
      const i = e.charCodeAt(r);
      if (this.treeIndex = Mi(u, a, this.treeIndex + Math.max(1, n), i), this.treeIndex < 0)
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === Le.Attribute && // We shouldn't have consumed any characters after the entity,
        (n === 0 || // And there should be no invalid characters.
        Di(i)) ? 0 : this.emitNotTerminatedNamedEntity();
      if (a = u[this.treeIndex], n = (a & Oe.VALUE_LENGTH) >> 14, n !== 0) {
        if (i === A0.SEMI)
          return this.emitNamedEntityData(this.treeIndex, n, this.consumed + this.excess);
        this.decodeMode !== Le.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var e;
    const { result: r, decodeTree: u } = this, a = (u[r] & Oe.VALUE_LENGTH) >> 14;
    return this.emitNamedEntityData(r, a, this.consumed), (e = this.errors) === null || e === void 0 || e.missingSemicolonAfterCharacterReference(), this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(e, r, u) {
    const { decodeTree: a } = this;
    return this.emitCodePoint(r === 1 ? a[e] & ~Oe.VALUE_LENGTH : a[e + 1], u), r === 3 && this.emitCodePoint(a[e + 2], u), u;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var e;
    switch (this.state) {
      case w0.NamedEntity:
        return this.result !== 0 && (this.decodeMode !== Le.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      // Otherwise, emit a numeric entity if we have one.
      case w0.NumericDecimal:
        return this.emitNumericEntity(0, 2);
      case w0.NumericHex:
        return this.emitNumericEntity(0, 3);
      case w0.NumericStart:
        return (e = this.errors) === null || e === void 0 || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
      case w0.EntityStart:
        return 0;
    }
  }
}
function Dn(t) {
  let e = "";
  const r = new Ti(t, (u) => e += Ai(u));
  return function(a, n) {
    let i = 0, s = 0;
    for (; (s = a.indexOf("&", s)) >= 0; ) {
      e += a.slice(i, s), r.startEntity(n);
      const h = r.write(
        a,
        // Skip the "&"
        s + 1
      );
      if (h < 0) {
        i = s + r.end();
        break;
      }
      i = s + h, s = h === 0 ? i + 1 : i;
    }
    const o = e + a.slice(i);
    return e = "", o;
  };
}
function Mi(t, e, r, u) {
  const a = (e & Oe.BRANCH_LENGTH) >> 7, n = e & Oe.JUMP_TABLE;
  if (a === 0)
    return n !== 0 && u === n ? r : -1;
  if (n) {
    const o = u - n;
    return o < 0 || o >= a ? -1 : t[r + o] - 1;
  }
  let i = r, s = i + a - 1;
  for (; i <= s; ) {
    const o = i + s >>> 1, h = t[o];
    if (h < u)
      i = o + 1;
    else if (h > u)
      s = o - 1;
    else
      return t[o + a];
  }
  return -1;
}
const Fi = Dn(yi);
Dn(ki);
function Tn(t, e = Le.Legacy) {
  return Fi(t, e);
}
function zi(t) {
  return Object.prototype.toString.call(t);
}
function Su(t) {
  return zi(t) === "[object String]";
}
const Bi = Object.prototype.hasOwnProperty;
function Ii(t, e) {
  return Bi.call(t, e);
}
function or(t) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(r) {
    if (r) {
      if (typeof r != "object")
        throw new TypeError(r + "must be object");
      Object.keys(r).forEach(function(u) {
        t[u] = r[u];
      });
    }
  }), t;
}
function Mn(t, e, r) {
  return [].concat(t.slice(0, e), r, t.slice(e + 1));
}
function _u(t) {
  return !(t >= 55296 && t <= 57343 || t >= 64976 && t <= 65007 || (t & 65535) === 65535 || (t & 65535) === 65534 || t >= 0 && t <= 8 || t === 11 || t >= 14 && t <= 31 || t >= 127 && t <= 159 || t > 1114111);
}
function tr(t) {
  if (t > 65535) {
    t -= 65536;
    const e = 55296 + (t >> 10), r = 56320 + (t & 1023);
    return String.fromCharCode(e, r);
  }
  return String.fromCharCode(t);
}
const Fn = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, Ri = /&([a-z#][a-z0-9]{1,31});/gi, Ni = new RegExp(Fn.source + "|" + Ri.source, "gi"), Li = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function Oi(t, e) {
  if (e.charCodeAt(0) === 35 && Li.test(e)) {
    const u = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return _u(u) ? tr(u) : t;
  }
  const r = Tn(t);
  return r !== t ? r : t;
}
function qi(t) {
  return t.indexOf("\\") < 0 ? t : t.replace(Fn, "$1");
}
function ot(t) {
  return t.indexOf("\\") < 0 && t.indexOf("&") < 0 ? t : t.replace(Ni, function(e, r, u) {
    return r || Oi(e, u);
  });
}
const Pi = /[&<>"]/, Hi = /[&<>"]/g, $i = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function Ui(t) {
  return $i[t];
}
function Pe(t) {
  return Pi.test(t) ? t.replace(Hi, Ui) : t;
}
const Gi = /[.?*+^$[\]\\(){}|-]/g;
function Vi(t) {
  return t.replace(Gi, "\\$&");
}
function r0(t) {
  switch (t) {
    case 9:
    case 32:
      return !0;
  }
  return !1;
}
function At(t) {
  if (t >= 8192 && t <= 8202)
    return !0;
  switch (t) {
    case 9:
    // \t
    case 10:
    // \n
    case 11:
    // \v
    case 12:
    // \f
    case 13:
    // \r
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return !0;
  }
  return !1;
}
function St(t) {
  return Au.test(t) || Cn.test(t);
}
function _t(t) {
  switch (t) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function cr(t) {
  return t = t.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (t = t.replace(/ẞ/g, "ß")), t.toLowerCase().toUpperCase();
}
const ji = { mdurl: gi, ucmicro: xi }, Wi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayReplaceAt: Mn,
  assign: or,
  escapeHtml: Pe,
  escapeRE: Vi,
  fromCodePoint: tr,
  has: Ii,
  isMdAsciiPunct: _t,
  isPunctChar: St,
  isSpace: r0,
  isString: Su,
  isValidEntityCode: _u,
  isWhiteSpace: At,
  lib: ji,
  normalizeReference: cr,
  unescapeAll: ot,
  unescapeMd: qi
}, Symbol.toStringTag, { value: "Module" }));
function Zi(t, e, r) {
  let u, a, n, i;
  const s = t.posMax, o = t.pos;
  for (t.pos = e + 1, u = 1; t.pos < s; ) {
    if (n = t.src.charCodeAt(t.pos), n === 93 && (u--, u === 0)) {
      a = !0;
      break;
    }
    if (i = t.pos, t.md.inline.skipToken(t), n === 91) {
      if (i === t.pos - 1)
        u++;
      else if (r)
        return t.pos = o, -1;
    }
  }
  let h = -1;
  return a && (h = t.pos), t.pos = o, h;
}
function Yi(t, e, r) {
  let u, a = e;
  const n = {
    ok: !1,
    pos: 0,
    str: ""
  };
  if (t.charCodeAt(a) === 60) {
    for (a++; a < r; ) {
      if (u = t.charCodeAt(a), u === 10 || u === 60)
        return n;
      if (u === 62)
        return n.pos = a + 1, n.str = ot(t.slice(e + 1, a)), n.ok = !0, n;
      if (u === 92 && a + 1 < r) {
        a += 2;
        continue;
      }
      a++;
    }
    return n;
  }
  let i = 0;
  for (; a < r && (u = t.charCodeAt(a), !(u === 32 || u < 32 || u === 127)); ) {
    if (u === 92 && a + 1 < r) {
      if (t.charCodeAt(a + 1) === 32)
        break;
      a += 2;
      continue;
    }
    if (u === 40 && (i++, i > 32))
      return n;
    if (u === 41) {
      if (i === 0)
        break;
      i--;
    }
    a++;
  }
  return e === a || i !== 0 || (n.str = ot(t.slice(e, a)), n.pos = a, n.ok = !0), n;
}
function Xi(t, e, r, u) {
  let a, n = e;
  const i = {
    // if `true`, this is a valid link title
    ok: !1,
    // if `true`, this link can be continued on the next line
    can_continue: !1,
    // if `ok`, it's the position of the first character after the closing marker
    pos: 0,
    // if `ok`, it's the unescaped title
    str: "",
    // expected closing marker character code
    marker: 0
  };
  if (u)
    i.str = u.str, i.marker = u.marker;
  else {
    if (n >= r)
      return i;
    let s = t.charCodeAt(n);
    if (s !== 34 && s !== 39 && s !== 40)
      return i;
    e++, n++, s === 40 && (s = 41), i.marker = s;
  }
  for (; n < r; ) {
    if (a = t.charCodeAt(n), a === i.marker)
      return i.pos = n + 1, i.str += ot(t.slice(e, n)), i.ok = !0, i;
    if (a === 40 && i.marker === 41)
      return i;
    a === 92 && n + 1 < r && n++, n++;
  }
  return i.can_continue = !0, i.str += ot(t.slice(e, n)), i;
}
const Ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseLinkDestination: Yi,
  parseLinkLabel: Zi,
  parseLinkTitle: Xi
}, Symbol.toStringTag, { value: "Module" })), pe = {};
pe.code_inline = function(t, e, r, u, a) {
  const n = t[e];
  return "<code" + a.renderAttrs(n) + ">" + Pe(n.content) + "</code>";
};
pe.code_block = function(t, e, r, u, a) {
  const n = t[e];
  return "<pre" + a.renderAttrs(n) + "><code>" + Pe(t[e].content) + `</code></pre>
`;
};
pe.fence = function(t, e, r, u, a) {
  const n = t[e], i = n.info ? ot(n.info).trim() : "";
  let s = "", o = "";
  if (i) {
    const f = i.split(/(\s+)/g);
    s = f[0], o = f.slice(2).join("");
  }
  let h;
  if (r.highlight ? h = r.highlight(n.content, s, o) || Pe(n.content) : h = Pe(n.content), h.indexOf("<pre") === 0)
    return h + `
`;
  if (i) {
    const f = n.attrIndex("class"), p = n.attrs ? n.attrs.slice() : [];
    f < 0 ? p.push(["class", r.langPrefix + s]) : (p[f] = p[f].slice(), p[f][1] += " " + r.langPrefix + s);
    const k = {
      attrs: p
    };
    return `<pre><code${a.renderAttrs(k)}>${h}</code></pre>
`;
  }
  return `<pre><code${a.renderAttrs(n)}>${h}</code></pre>
`;
};
pe.image = function(t, e, r, u, a) {
  const n = t[e];
  return n.attrs[n.attrIndex("alt")][1] = a.renderInlineAsText(n.children, r, u), a.renderToken(t, e, r);
};
pe.hardbreak = function(t, e, r) {
  return r.xhtmlOut ? `<br />
` : `<br>
`;
};
pe.softbreak = function(t, e, r) {
  return r.breaks ? r.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
pe.text = function(t, e) {
  return Pe(t[e].content);
};
pe.html_block = function(t, e) {
  return t[e].content;
};
pe.html_inline = function(t, e) {
  return t[e].content;
};
function ht() {
  this.rules = or({}, pe);
}
ht.prototype.renderAttrs = function(e) {
  let r, u, a;
  if (!e.attrs)
    return "";
  for (a = "", r = 0, u = e.attrs.length; r < u; r++)
    a += " " + Pe(e.attrs[r][0]) + '="' + Pe(e.attrs[r][1]) + '"';
  return a;
};
ht.prototype.renderToken = function(e, r, u) {
  const a = e[r];
  let n = "";
  if (a.hidden)
    return "";
  a.block && a.nesting !== -1 && r && e[r - 1].hidden && (n += `
`), n += (a.nesting === -1 ? "</" : "<") + a.tag, n += this.renderAttrs(a), a.nesting === 0 && u.xhtmlOut && (n += " /");
  let i = !1;
  if (a.block && (i = !0, a.nesting === 1 && r + 1 < e.length)) {
    const s = e[r + 1];
    (s.type === "inline" || s.hidden || s.nesting === -1 && s.tag === a.tag) && (i = !1);
  }
  return n += i ? `>
` : ">", n;
};
ht.prototype.renderInline = function(t, e, r) {
  let u = "";
  const a = this.rules;
  for (let n = 0, i = t.length; n < i; n++) {
    const s = t[n].type;
    typeof a[s] < "u" ? u += a[s](t, n, e, r, this) : u += this.renderToken(t, n, e);
  }
  return u;
};
ht.prototype.renderInlineAsText = function(t, e, r) {
  let u = "";
  for (let a = 0, n = t.length; a < n; a++)
    switch (t[a].type) {
      case "text":
        u += t[a].content;
        break;
      case "image":
        u += this.renderInlineAsText(t[a].children, e, r);
        break;
      case "html_inline":
      case "html_block":
        u += t[a].content;
        break;
      case "softbreak":
      case "hardbreak":
        u += `
`;
        break;
    }
  return u;
};
ht.prototype.render = function(t, e, r) {
  let u = "";
  const a = this.rules;
  for (let n = 0, i = t.length; n < i; n++) {
    const s = t[n].type;
    s === "inline" ? u += this.renderInline(t[n].children, e, r) : typeof a[s] < "u" ? u += a[s](t, n, e, r, this) : u += this.renderToken(t, n, e, r);
  }
  return u;
};
function H0() {
  this.__rules__ = [], this.__cache__ = null;
}
H0.prototype.__find__ = function(t) {
  for (let e = 0; e < this.__rules__.length; e++)
    if (this.__rules__[e].name === t)
      return e;
  return -1;
};
H0.prototype.__compile__ = function() {
  const t = this, e = [""];
  t.__rules__.forEach(function(r) {
    r.enabled && r.alt.forEach(function(u) {
      e.indexOf(u) < 0 && e.push(u);
    });
  }), t.__cache__ = {}, e.forEach(function(r) {
    t.__cache__[r] = [], t.__rules__.forEach(function(u) {
      u.enabled && (r && u.alt.indexOf(r) < 0 || t.__cache__[r].push(u.fn));
    });
  });
};
H0.prototype.at = function(t, e, r) {
  const u = this.__find__(t), a = r || {};
  if (u === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__[u].fn = e, this.__rules__[u].alt = a.alt || [], this.__cache__ = null;
};
H0.prototype.before = function(t, e, r, u) {
  const a = this.__find__(t), n = u || {};
  if (a === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__.splice(a, 0, {
    name: e,
    enabled: !0,
    fn: r,
    alt: n.alt || []
  }), this.__cache__ = null;
};
H0.prototype.after = function(t, e, r, u) {
  const a = this.__find__(t), n = u || {};
  if (a === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__.splice(a + 1, 0, {
    name: e,
    enabled: !0,
    fn: r,
    alt: n.alt || []
  }), this.__cache__ = null;
};
H0.prototype.push = function(t, e, r) {
  const u = r || {};
  this.__rules__.push({
    name: t,
    enabled: !0,
    fn: e,
    alt: u.alt || []
  }), this.__cache__ = null;
};
H0.prototype.enable = function(t, e) {
  Array.isArray(t) || (t = [t]);
  const r = [];
  return t.forEach(function(u) {
    const a = this.__find__(u);
    if (a < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + u);
    }
    this.__rules__[a].enabled = !0, r.push(u);
  }, this), this.__cache__ = null, r;
};
H0.prototype.enableOnly = function(t, e) {
  Array.isArray(t) || (t = [t]), this.__rules__.forEach(function(r) {
    r.enabled = !1;
  }), this.enable(t, e);
};
H0.prototype.disable = function(t, e) {
  Array.isArray(t) || (t = [t]);
  const r = [];
  return t.forEach(function(u) {
    const a = this.__find__(u);
    if (a < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + u);
    }
    this.__rules__[a].enabled = !1, r.push(u);
  }, this), this.__cache__ = null, r;
};
H0.prototype.getRules = function(t) {
  return this.__cache__ === null && this.__compile__(), this.__cache__[t] || [];
};
function ne(t, e, r) {
  this.type = t, this.tag = e, this.attrs = null, this.map = null, this.nesting = r, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
ne.prototype.attrIndex = function(e) {
  if (!this.attrs)
    return -1;
  const r = this.attrs;
  for (let u = 0, a = r.length; u < a; u++)
    if (r[u][0] === e)
      return u;
  return -1;
};
ne.prototype.attrPush = function(e) {
  this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
ne.prototype.attrSet = function(e, r) {
  const u = this.attrIndex(e), a = [e, r];
  u < 0 ? this.attrPush(a) : this.attrs[u] = a;
};
ne.prototype.attrGet = function(e) {
  const r = this.attrIndex(e);
  let u = null;
  return r >= 0 && (u = this.attrs[r][1]), u;
};
ne.prototype.attrJoin = function(e, r) {
  const u = this.attrIndex(e);
  u < 0 ? this.attrPush([e, r]) : this.attrs[u][1] = this.attrs[u][1] + " " + r;
};
function zn(t, e, r) {
  this.src = t, this.env = r, this.tokens = [], this.inlineMode = !1, this.md = e;
}
zn.prototype.Token = ne;
const Ji = /\r\n?|\n/g, Qi = /\0/g;
function es(t) {
  let e;
  e = t.src.replace(Ji, `
`), e = e.replace(Qi, "�"), t.src = e;
}
function ts(t) {
  let e;
  t.inlineMode ? (e = new t.Token("inline", "", 0), e.content = t.src, e.map = [0, 1], e.children = [], t.tokens.push(e)) : t.md.block.parse(t.src, t.md, t.env, t.tokens);
}
function rs(t) {
  const e = t.tokens;
  for (let r = 0, u = e.length; r < u; r++) {
    const a = e[r];
    a.type === "inline" && t.md.inline.parse(a.content, t.md, t.env, a.children);
  }
}
function us(t) {
  return /^<a[>\s]/i.test(t);
}
function as(t) {
  return /^<\/a\s*>/i.test(t);
}
function ns(t) {
  const e = t.tokens;
  if (t.md.options.linkify)
    for (let r = 0, u = e.length; r < u; r++) {
      if (e[r].type !== "inline" || !t.md.linkify.pretest(e[r].content))
        continue;
      let a = e[r].children, n = 0;
      for (let i = a.length - 1; i >= 0; i--) {
        const s = a[i];
        if (s.type === "link_close") {
          for (i--; a[i].level !== s.level && a[i].type !== "link_open"; )
            i--;
          continue;
        }
        if (s.type === "html_inline" && (us(s.content) && n > 0 && n--, as(s.content) && n++), !(n > 0) && s.type === "text" && t.md.linkify.test(s.content)) {
          const o = s.content;
          let h = t.md.linkify.match(o);
          const f = [];
          let p = s.level, k = 0;
          h.length > 0 && h[0].index === 0 && i > 0 && a[i - 1].type === "text_special" && (h = h.slice(1));
          for (let x = 0; x < h.length; x++) {
            const y = h[x].url, _ = t.md.normalizeLink(y);
            if (!t.md.validateLink(_))
              continue;
            let E = h[x].text;
            h[x].schema ? h[x].schema === "mailto:" && !/^mailto:/i.test(E) ? E = t.md.normalizeLinkText("mailto:" + E).replace(/^mailto:/, "") : E = t.md.normalizeLinkText(E) : E = t.md.normalizeLinkText("http://" + E).replace(/^http:\/\//, "");
            const F = h[x].index;
            if (F > k) {
              const D = new t.Token("text", "", 0);
              D.content = o.slice(k, F), D.level = p, f.push(D);
            }
            const v = new t.Token("link_open", "a", 1);
            v.attrs = [["href", _]], v.level = p++, v.markup = "linkify", v.info = "auto", f.push(v);
            const w = new t.Token("text", "", 0);
            w.content = E, w.level = p, f.push(w);
            const C = new t.Token("link_close", "a", -1);
            C.level = --p, C.markup = "linkify", C.info = "auto", f.push(C), k = h[x].lastIndex;
          }
          if (k < o.length) {
            const x = new t.Token("text", "", 0);
            x.content = o.slice(k), x.level = p, f.push(x);
          }
          e[r].children = a = Mn(a, i, f);
        }
      }
    }
}
const Bn = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, is = /\((c|tm|r)\)/i, ss = /\((c|tm|r)\)/ig, ls = {
  c: "©",
  r: "®",
  tm: "™"
};
function os(t, e) {
  return ls[e.toLowerCase()];
}
function cs(t) {
  let e = 0;
  for (let r = t.length - 1; r >= 0; r--) {
    const u = t[r];
    u.type === "text" && !e && (u.content = u.content.replace(ss, os)), u.type === "link_open" && u.info === "auto" && e--, u.type === "link_close" && u.info === "auto" && e++;
  }
}
function hs(t) {
  let e = 0;
  for (let r = t.length - 1; r >= 0; r--) {
    const u = t[r];
    u.type === "text" && !e && Bn.test(u.content) && (u.content = u.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), u.type === "link_open" && u.info === "auto" && e--, u.type === "link_close" && u.info === "auto" && e++;
  }
}
function ds(t) {
  let e;
  if (t.md.options.typographer)
    for (e = t.tokens.length - 1; e >= 0; e--)
      t.tokens[e].type === "inline" && (is.test(t.tokens[e].content) && cs(t.tokens[e].children), Bn.test(t.tokens[e].content) && hs(t.tokens[e].children));
}
const fs = /['"]/, ga = /['"]/g, va = "’";
function qt(t, e, r) {
  return t.slice(0, e) + r + t.slice(e + 1);
}
function ms(t, e) {
  let r;
  const u = [];
  for (let a = 0; a < t.length; a++) {
    const n = t[a], i = t[a].level;
    for (r = u.length - 1; r >= 0 && !(u[r].level <= i); r--)
      ;
    if (u.length = r + 1, n.type !== "text")
      continue;
    let s = n.content, o = 0, h = s.length;
    e:
      for (; o < h; ) {
        ga.lastIndex = o;
        const f = ga.exec(s);
        if (!f)
          break;
        let p = !0, k = !0;
        o = f.index + 1;
        const x = f[0] === "'";
        let y = 32;
        if (f.index - 1 >= 0)
          y = s.charCodeAt(f.index - 1);
        else
          for (r = a - 1; r >= 0 && !(t[r].type === "softbreak" || t[r].type === "hardbreak"); r--)
            if (t[r].content) {
              y = t[r].content.charCodeAt(t[r].content.length - 1);
              break;
            }
        let _ = 32;
        if (o < h)
          _ = s.charCodeAt(o);
        else
          for (r = a + 1; r < t.length && !(t[r].type === "softbreak" || t[r].type === "hardbreak"); r++)
            if (t[r].content) {
              _ = t[r].content.charCodeAt(0);
              break;
            }
        const E = _t(y) || St(String.fromCharCode(y)), F = _t(_) || St(String.fromCharCode(_)), v = At(y), w = At(_);
        if (w ? p = !1 : F && (v || E || (p = !1)), v ? k = !1 : E && (w || F || (k = !1)), _ === 34 && f[0] === '"' && y >= 48 && y <= 57 && (k = p = !1), p && k && (p = E, k = F), !p && !k) {
          x && (n.content = qt(n.content, f.index, va));
          continue;
        }
        if (k)
          for (r = u.length - 1; r >= 0; r--) {
            let C = u[r];
            if (u[r].level < i)
              break;
            if (C.single === x && u[r].level === i) {
              C = u[r];
              let D, M;
              x ? (D = e.md.options.quotes[2], M = e.md.options.quotes[3]) : (D = e.md.options.quotes[0], M = e.md.options.quotes[1]), n.content = qt(n.content, f.index, M), t[C.token].content = qt(
                t[C.token].content,
                C.pos,
                D
              ), o += M.length - 1, C.token === a && (o += D.length - 1), s = n.content, h = s.length, u.length = r;
              continue e;
            }
          }
        p ? u.push({
          token: a,
          pos: f.index,
          single: x,
          level: i
        }) : k && x && (n.content = qt(n.content, f.index, va));
      }
  }
}
function ps(t) {
  if (t.md.options.typographer)
    for (let e = t.tokens.length - 1; e >= 0; e--)
      t.tokens[e].type !== "inline" || !fs.test(t.tokens[e].content) || ms(t.tokens[e].children, t);
}
function bs(t) {
  let e, r;
  const u = t.tokens, a = u.length;
  for (let n = 0; n < a; n++) {
    if (u[n].type !== "inline") continue;
    const i = u[n].children, s = i.length;
    for (e = 0; e < s; e++)
      i[e].type === "text_special" && (i[e].type = "text");
    for (e = r = 0; e < s; e++)
      i[e].type === "text" && e + 1 < s && i[e + 1].type === "text" ? i[e + 1].content = i[e].content + i[e + 1].content : (e !== r && (i[r] = i[e]), r++);
    e !== r && (i.length = r);
  }
}
const Br = [
  ["normalize", es],
  ["block", ts],
  ["inline", rs],
  ["linkify", ns],
  ["replacements", ds],
  ["smartquotes", ps],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", bs]
];
function Cu() {
  this.ruler = new H0();
  for (let t = 0; t < Br.length; t++)
    this.ruler.push(Br[t][0], Br[t][1]);
}
Cu.prototype.process = function(t) {
  const e = this.ruler.getRules("");
  for (let r = 0, u = e.length; r < u; r++)
    e[r](t);
};
Cu.prototype.State = zn;
function be(t, e, r, u) {
  this.src = t, this.md = e, this.env = r, this.tokens = u, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
  const a = this.src;
  for (let n = 0, i = 0, s = 0, o = 0, h = a.length, f = !1; i < h; i++) {
    const p = a.charCodeAt(i);
    if (!f)
      if (r0(p)) {
        s++, p === 9 ? o += 4 - o % 4 : o++;
        continue;
      } else
        f = !0;
    (p === 10 || i === h - 1) && (p !== 10 && i++, this.bMarks.push(n), this.eMarks.push(i), this.tShift.push(s), this.sCount.push(o), this.bsCount.push(0), f = !1, s = 0, o = 0, n = i + 1);
  }
  this.bMarks.push(a.length), this.eMarks.push(a.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
be.prototype.push = function(t, e, r) {
  const u = new ne(t, e, r);
  return u.block = !0, r < 0 && this.level--, u.level = this.level, r > 0 && this.level++, this.tokens.push(u), u;
};
be.prototype.isEmpty = function(e) {
  return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
be.prototype.skipEmptyLines = function(e) {
  for (let r = this.lineMax; e < r && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
    ;
  return e;
};
be.prototype.skipSpaces = function(e) {
  for (let r = this.src.length; e < r; e++) {
    const u = this.src.charCodeAt(e);
    if (!r0(u))
      break;
  }
  return e;
};
be.prototype.skipSpacesBack = function(e, r) {
  if (e <= r)
    return e;
  for (; e > r; )
    if (!r0(this.src.charCodeAt(--e)))
      return e + 1;
  return e;
};
be.prototype.skipChars = function(e, r) {
  for (let u = this.src.length; e < u && this.src.charCodeAt(e) === r; e++)
    ;
  return e;
};
be.prototype.skipCharsBack = function(e, r, u) {
  if (e <= u)
    return e;
  for (; e > u; )
    if (r !== this.src.charCodeAt(--e))
      return e + 1;
  return e;
};
be.prototype.getLines = function(e, r, u, a) {
  if (e >= r)
    return "";
  const n = new Array(r - e);
  for (let i = 0, s = e; s < r; s++, i++) {
    let o = 0;
    const h = this.bMarks[s];
    let f = h, p;
    for (s + 1 < r || a ? p = this.eMarks[s] + 1 : p = this.eMarks[s]; f < p && o < u; ) {
      const k = this.src.charCodeAt(f);
      if (r0(k))
        k === 9 ? o += 4 - (o + this.bsCount[s]) % 4 : o++;
      else if (f - h < this.tShift[s])
        o++;
      else
        break;
      f++;
    }
    o > u ? n[i] = new Array(o - u + 1).join(" ") + this.src.slice(f, p) : n[i] = this.src.slice(f, p);
  }
  return n.join("");
};
be.prototype.Token = ne;
const gs = 65536;
function Ir(t, e) {
  const r = t.bMarks[e] + t.tShift[e], u = t.eMarks[e];
  return t.src.slice(r, u);
}
function xa(t) {
  const e = [], r = t.length;
  let u = 0, a = t.charCodeAt(u), n = !1, i = 0, s = "";
  for (; u < r; )
    a === 124 && (n ? (s += t.substring(i, u - 1), i = u) : (e.push(s + t.substring(i, u)), s = "", i = u + 1)), n = a === 92, u++, a = t.charCodeAt(u);
  return e.push(s + t.substring(i)), e;
}
function vs(t, e, r, u) {
  if (e + 2 > r)
    return !1;
  let a = e + 1;
  if (t.sCount[a] < t.blkIndent || t.sCount[a] - t.blkIndent >= 4)
    return !1;
  let n = t.bMarks[a] + t.tShift[a];
  if (n >= t.eMarks[a])
    return !1;
  const i = t.src.charCodeAt(n++);
  if (i !== 124 && i !== 45 && i !== 58 || n >= t.eMarks[a])
    return !1;
  const s = t.src.charCodeAt(n++);
  if (s !== 124 && s !== 45 && s !== 58 && !r0(s) || i === 45 && r0(s))
    return !1;
  for (; n < t.eMarks[a]; ) {
    const C = t.src.charCodeAt(n);
    if (C !== 124 && C !== 45 && C !== 58 && !r0(C))
      return !1;
    n++;
  }
  let o = Ir(t, e + 1), h = o.split("|");
  const f = [];
  for (let C = 0; C < h.length; C++) {
    const D = h[C].trim();
    if (!D) {
      if (C === 0 || C === h.length - 1)
        continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(D))
      return !1;
    D.charCodeAt(D.length - 1) === 58 ? f.push(D.charCodeAt(0) === 58 ? "center" : "right") : D.charCodeAt(0) === 58 ? f.push("left") : f.push("");
  }
  if (o = Ir(t, e).trim(), o.indexOf("|") === -1 || t.sCount[e] - t.blkIndent >= 4)
    return !1;
  h = xa(o), h.length && h[0] === "" && h.shift(), h.length && h[h.length - 1] === "" && h.pop();
  const p = h.length;
  if (p === 0 || p !== f.length)
    return !1;
  if (u)
    return !0;
  const k = t.parentType;
  t.parentType = "table";
  const x = t.md.block.ruler.getRules("blockquote"), y = t.push("table_open", "table", 1), _ = [e, 0];
  y.map = _;
  const E = t.push("thead_open", "thead", 1);
  E.map = [e, e + 1];
  const F = t.push("tr_open", "tr", 1);
  F.map = [e, e + 1];
  for (let C = 0; C < h.length; C++) {
    const D = t.push("th_open", "th", 1);
    f[C] && (D.attrs = [["style", "text-align:" + f[C]]]);
    const M = t.push("inline", "", 0);
    M.content = h[C].trim(), M.children = [], t.push("th_close", "th", -1);
  }
  t.push("tr_close", "tr", -1), t.push("thead_close", "thead", -1);
  let v, w = 0;
  for (a = e + 2; a < r && !(t.sCount[a] < t.blkIndent); a++) {
    let C = !1;
    for (let M = 0, z = x.length; M < z; M++)
      if (x[M](t, a, r, !0)) {
        C = !0;
        break;
      }
    if (C || (o = Ir(t, a).trim(), !o) || t.sCount[a] - t.blkIndent >= 4 || (h = xa(o), h.length && h[0] === "" && h.shift(), h.length && h[h.length - 1] === "" && h.pop(), w += p - h.length, w > gs))
      break;
    if (a === e + 2) {
      const M = t.push("tbody_open", "tbody", 1);
      M.map = v = [e + 2, 0];
    }
    const D = t.push("tr_open", "tr", 1);
    D.map = [a, a + 1];
    for (let M = 0; M < p; M++) {
      const z = t.push("td_open", "td", 1);
      f[M] && (z.attrs = [["style", "text-align:" + f[M]]]);
      const P = t.push("inline", "", 0);
      P.content = h[M] ? h[M].trim() : "", P.children = [], t.push("td_close", "td", -1);
    }
    t.push("tr_close", "tr", -1);
  }
  return v && (t.push("tbody_close", "tbody", -1), v[1] = a), t.push("table_close", "table", -1), _[1] = a, t.parentType = k, t.line = a, !0;
}
function xs(t, e, r) {
  if (t.sCount[e] - t.blkIndent < 4)
    return !1;
  let u = e + 1, a = u;
  for (; u < r; ) {
    if (t.isEmpty(u)) {
      u++;
      continue;
    }
    if (t.sCount[u] - t.blkIndent >= 4) {
      u++, a = u;
      continue;
    }
    break;
  }
  t.line = a;
  const n = t.push("code_block", "code", 0);
  return n.content = t.getLines(e, a, 4 + t.blkIndent, !1) + `
`, n.map = [e, t.line], !0;
}
function ys(t, e, r, u) {
  let a = t.bMarks[e] + t.tShift[e], n = t.eMarks[e];
  if (t.sCount[e] - t.blkIndent >= 4 || a + 3 > n)
    return !1;
  const i = t.src.charCodeAt(a);
  if (i !== 126 && i !== 96)
    return !1;
  let s = a;
  a = t.skipChars(a, i);
  let o = a - s;
  if (o < 3)
    return !1;
  const h = t.src.slice(s, a), f = t.src.slice(a, n);
  if (i === 96 && f.indexOf(String.fromCharCode(i)) >= 0)
    return !1;
  if (u)
    return !0;
  let p = e, k = !1;
  for (; p++, !(p >= r || (a = s = t.bMarks[p] + t.tShift[p], n = t.eMarks[p], a < n && t.sCount[p] < t.blkIndent)); )
    if (t.src.charCodeAt(a) === i && !(t.sCount[p] - t.blkIndent >= 4) && (a = t.skipChars(a, i), !(a - s < o) && (a = t.skipSpaces(a), !(a < n)))) {
      k = !0;
      break;
    }
  o = t.sCount[e], t.line = p + (k ? 1 : 0);
  const x = t.push("fence", "code", 0);
  return x.info = f, x.content = t.getLines(e + 1, p, o, !0), x.markup = h, x.map = [e, t.line], !0;
}
function ks(t, e, r, u) {
  let a = t.bMarks[e] + t.tShift[e], n = t.eMarks[e];
  const i = t.lineMax;
  if (t.sCount[e] - t.blkIndent >= 4 || t.src.charCodeAt(a) !== 62)
    return !1;
  if (u)
    return !0;
  const s = [], o = [], h = [], f = [], p = t.md.block.ruler.getRules("blockquote"), k = t.parentType;
  t.parentType = "blockquote";
  let x = !1, y;
  for (y = e; y < r; y++) {
    const w = t.sCount[y] < t.blkIndent;
    if (a = t.bMarks[y] + t.tShift[y], n = t.eMarks[y], a >= n)
      break;
    if (t.src.charCodeAt(a++) === 62 && !w) {
      let D = t.sCount[y] + 1, M, z;
      t.src.charCodeAt(a) === 32 ? (a++, D++, z = !1, M = !0) : t.src.charCodeAt(a) === 9 ? (M = !0, (t.bsCount[y] + D) % 4 === 3 ? (a++, D++, z = !1) : z = !0) : M = !1;
      let P = D;
      for (s.push(t.bMarks[y]), t.bMarks[y] = a; a < n; ) {
        const N = t.src.charCodeAt(a);
        if (r0(N))
          N === 9 ? P += 4 - (P + t.bsCount[y] + (z ? 1 : 0)) % 4 : P++;
        else
          break;
        a++;
      }
      x = a >= n, o.push(t.bsCount[y]), t.bsCount[y] = t.sCount[y] + 1 + (M ? 1 : 0), h.push(t.sCount[y]), t.sCount[y] = P - D, f.push(t.tShift[y]), t.tShift[y] = a - t.bMarks[y];
      continue;
    }
    if (x)
      break;
    let C = !1;
    for (let D = 0, M = p.length; D < M; D++)
      if (p[D](t, y, r, !0)) {
        C = !0;
        break;
      }
    if (C) {
      t.lineMax = y, t.blkIndent !== 0 && (s.push(t.bMarks[y]), o.push(t.bsCount[y]), f.push(t.tShift[y]), h.push(t.sCount[y]), t.sCount[y] -= t.blkIndent);
      break;
    }
    s.push(t.bMarks[y]), o.push(t.bsCount[y]), f.push(t.tShift[y]), h.push(t.sCount[y]), t.sCount[y] = -1;
  }
  const _ = t.blkIndent;
  t.blkIndent = 0;
  const E = t.push("blockquote_open", "blockquote", 1);
  E.markup = ">";
  const F = [e, 0];
  E.map = F, t.md.block.tokenize(t, e, y);
  const v = t.push("blockquote_close", "blockquote", -1);
  v.markup = ">", t.lineMax = i, t.parentType = k, F[1] = t.line;
  for (let w = 0; w < f.length; w++)
    t.bMarks[w + e] = s[w], t.tShift[w + e] = f[w], t.sCount[w + e] = h[w], t.bsCount[w + e] = o[w];
  return t.blkIndent = _, !0;
}
function ws(t, e, r, u) {
  const a = t.eMarks[e];
  if (t.sCount[e] - t.blkIndent >= 4)
    return !1;
  let n = t.bMarks[e] + t.tShift[e];
  const i = t.src.charCodeAt(n++);
  if (i !== 42 && i !== 45 && i !== 95)
    return !1;
  let s = 1;
  for (; n < a; ) {
    const h = t.src.charCodeAt(n++);
    if (h !== i && !r0(h))
      return !1;
    h === i && s++;
  }
  if (s < 3)
    return !1;
  if (u)
    return !0;
  t.line = e + 1;
  const o = t.push("hr", "hr", 0);
  return o.map = [e, t.line], o.markup = Array(s + 1).join(String.fromCharCode(i)), !0;
}
function ya(t, e) {
  const r = t.eMarks[e];
  let u = t.bMarks[e] + t.tShift[e];
  const a = t.src.charCodeAt(u++);
  if (a !== 42 && a !== 45 && a !== 43)
    return -1;
  if (u < r) {
    const n = t.src.charCodeAt(u);
    if (!r0(n))
      return -1;
  }
  return u;
}
function ka(t, e) {
  const r = t.bMarks[e] + t.tShift[e], u = t.eMarks[e];
  let a = r;
  if (a + 1 >= u)
    return -1;
  let n = t.src.charCodeAt(a++);
  if (n < 48 || n > 57)
    return -1;
  for (; ; ) {
    if (a >= u)
      return -1;
    if (n = t.src.charCodeAt(a++), n >= 48 && n <= 57) {
      if (a - r >= 10)
        return -1;
      continue;
    }
    if (n === 41 || n === 46)
      break;
    return -1;
  }
  return a < u && (n = t.src.charCodeAt(a), !r0(n)) ? -1 : a;
}
function As(t, e) {
  const r = t.level + 2;
  for (let u = e + 2, a = t.tokens.length - 2; u < a; u++)
    t.tokens[u].level === r && t.tokens[u].type === "paragraph_open" && (t.tokens[u + 2].hidden = !0, t.tokens[u].hidden = !0, u += 2);
}
function Ss(t, e, r, u) {
  let a, n, i, s, o = e, h = !0;
  if (t.sCount[o] - t.blkIndent >= 4 || t.listIndent >= 0 && t.sCount[o] - t.listIndent >= 4 && t.sCount[o] < t.blkIndent)
    return !1;
  let f = !1;
  u && t.parentType === "paragraph" && t.sCount[o] >= t.blkIndent && (f = !0);
  let p, k, x;
  if ((x = ka(t, o)) >= 0) {
    if (p = !0, i = t.bMarks[o] + t.tShift[o], k = Number(t.src.slice(i, x - 1)), f && k !== 1) return !1;
  } else if ((x = ya(t, o)) >= 0)
    p = !1;
  else
    return !1;
  if (f && t.skipSpaces(x) >= t.eMarks[o])
    return !1;
  if (u)
    return !0;
  const y = t.src.charCodeAt(x - 1), _ = t.tokens.length;
  p ? (s = t.push("ordered_list_open", "ol", 1), k !== 1 && (s.attrs = [["start", k]])) : s = t.push("bullet_list_open", "ul", 1);
  const E = [o, 0];
  s.map = E, s.markup = String.fromCharCode(y);
  let F = !1;
  const v = t.md.block.ruler.getRules("list"), w = t.parentType;
  for (t.parentType = "list"; o < r; ) {
    n = x, a = t.eMarks[o];
    const C = t.sCount[o] + x - (t.bMarks[o] + t.tShift[o]);
    let D = C;
    for (; n < a; ) {
      const m0 = t.src.charCodeAt(n);
      if (m0 === 9)
        D += 4 - (D + t.bsCount[o]) % 4;
      else if (m0 === 32)
        D++;
      else
        break;
      n++;
    }
    const M = n;
    let z;
    M >= a ? z = 1 : z = D - C, z > 4 && (z = 1);
    const P = C + z;
    s = t.push("list_item_open", "li", 1), s.markup = String.fromCharCode(y);
    const N = [o, 0];
    s.map = N, p && (s.info = t.src.slice(i, x - 1));
    const Y = t.tight, G = t.tShift[o], K = t.sCount[o], C0 = t.listIndent;
    if (t.listIndent = t.blkIndent, t.blkIndent = P, t.tight = !0, t.tShift[o] = M - t.bMarks[o], t.sCount[o] = D, M >= a && t.isEmpty(o + 1) ? t.line = Math.min(t.line + 2, r) : t.md.block.tokenize(t, o, r, !0), (!t.tight || F) && (h = !1), F = t.line - o > 1 && t.isEmpty(t.line - 1), t.blkIndent = t.listIndent, t.listIndent = C0, t.tShift[o] = G, t.sCount[o] = K, t.tight = Y, s = t.push("list_item_close", "li", -1), s.markup = String.fromCharCode(y), o = t.line, N[1] = o, o >= r || t.sCount[o] < t.blkIndent || t.sCount[o] - t.blkIndent >= 4)
      break;
    let o0 = !1;
    for (let m0 = 0, L0 = v.length; m0 < L0; m0++)
      if (v[m0](t, o, r, !0)) {
        o0 = !0;
        break;
      }
    if (o0)
      break;
    if (p) {
      if (x = ka(t, o), x < 0)
        break;
      i = t.bMarks[o] + t.tShift[o];
    } else if (x = ya(t, o), x < 0)
      break;
    if (y !== t.src.charCodeAt(x - 1))
      break;
  }
  return p ? s = t.push("ordered_list_close", "ol", -1) : s = t.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(y), E[1] = o, t.line = o, t.parentType = w, h && As(t, _), !0;
}
function _s(t, e, r, u) {
  let a = t.bMarks[e] + t.tShift[e], n = t.eMarks[e], i = e + 1;
  if (t.sCount[e] - t.blkIndent >= 4 || t.src.charCodeAt(a) !== 91)
    return !1;
  function s(v) {
    const w = t.lineMax;
    if (v >= w || t.isEmpty(v))
      return null;
    let C = !1;
    if (t.sCount[v] - t.blkIndent > 3 && (C = !0), t.sCount[v] < 0 && (C = !0), !C) {
      const z = t.md.block.ruler.getRules("reference"), P = t.parentType;
      t.parentType = "reference";
      let N = !1;
      for (let Y = 0, G = z.length; Y < G; Y++)
        if (z[Y](t, v, w, !0)) {
          N = !0;
          break;
        }
      if (t.parentType = P, N)
        return null;
    }
    const D = t.bMarks[v] + t.tShift[v], M = t.eMarks[v];
    return t.src.slice(D, M + 1);
  }
  let o = t.src.slice(a, n + 1);
  n = o.length;
  let h = -1;
  for (a = 1; a < n; a++) {
    const v = o.charCodeAt(a);
    if (v === 91)
      return !1;
    if (v === 93) {
      h = a;
      break;
    } else if (v === 10) {
      const w = s(i);
      w !== null && (o += w, n = o.length, i++);
    } else if (v === 92 && (a++, a < n && o.charCodeAt(a) === 10)) {
      const w = s(i);
      w !== null && (o += w, n = o.length, i++);
    }
  }
  if (h < 0 || o.charCodeAt(h + 1) !== 58)
    return !1;
  for (a = h + 2; a < n; a++) {
    const v = o.charCodeAt(a);
    if (v === 10) {
      const w = s(i);
      w !== null && (o += w, n = o.length, i++);
    } else if (!r0(v)) break;
  }
  const f = t.md.helpers.parseLinkDestination(o, a, n);
  if (!f.ok)
    return !1;
  const p = t.md.normalizeLink(f.str);
  if (!t.md.validateLink(p))
    return !1;
  a = f.pos;
  const k = a, x = i, y = a;
  for (; a < n; a++) {
    const v = o.charCodeAt(a);
    if (v === 10) {
      const w = s(i);
      w !== null && (o += w, n = o.length, i++);
    } else if (!r0(v)) break;
  }
  let _ = t.md.helpers.parseLinkTitle(o, a, n);
  for (; _.can_continue; ) {
    const v = s(i);
    if (v === null) break;
    o += v, a = n, n = o.length, i++, _ = t.md.helpers.parseLinkTitle(o, a, n, _);
  }
  let E;
  for (a < n && y !== a && _.ok ? (E = _.str, a = _.pos) : (E = "", a = k, i = x); a < n; ) {
    const v = o.charCodeAt(a);
    if (!r0(v))
      break;
    a++;
  }
  if (a < n && o.charCodeAt(a) !== 10 && E)
    for (E = "", a = k, i = x; a < n; ) {
      const v = o.charCodeAt(a);
      if (!r0(v))
        break;
      a++;
    }
  if (a < n && o.charCodeAt(a) !== 10)
    return !1;
  const F = cr(o.slice(1, h));
  return F ? (u || (typeof t.env.references > "u" && (t.env.references = {}), typeof t.env.references[F] > "u" && (t.env.references[F] = { title: E, href: p }), t.line = i), !0) : !1;
}
const Cs = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], Es = "[a-zA-Z_:][a-zA-Z0-9:._-]*", Ds = "[^\"'=<>`\\x00-\\x20]+", Ts = "'[^']*'", Ms = '"[^"]*"', Fs = "(?:" + Ds + "|" + Ts + "|" + Ms + ")", zs = "(?:\\s+" + Es + "(?:\\s*=\\s*" + Fs + ")?)", In = "<[A-Za-z][A-Za-z0-9\\-]*" + zs + "*\\s*\\/?>", Rn = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", Bs = "<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->", Is = "<[?][\\s\\S]*?[?]>", Rs = "<![A-Za-z][^>]*>", Ns = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", Ls = new RegExp("^(?:" + In + "|" + Rn + "|" + Bs + "|" + Is + "|" + Rs + "|" + Ns + ")"), Os = new RegExp("^(?:" + In + "|" + Rn + ")"), at = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
  [/^<!--/, /-->/, !0],
  [/^<\?/, /\?>/, !0],
  [/^<![A-Z]/, />/, !0],
  [/^<!\[CDATA\[/, /\]\]>/, !0],
  [new RegExp("^</?(" + Cs.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
  [new RegExp(Os.source + "\\s*$"), /^$/, !1]
];
function qs(t, e, r, u) {
  let a = t.bMarks[e] + t.tShift[e], n = t.eMarks[e];
  if (t.sCount[e] - t.blkIndent >= 4 || !t.md.options.html || t.src.charCodeAt(a) !== 60)
    return !1;
  let i = t.src.slice(a, n), s = 0;
  for (; s < at.length && !at[s][0].test(i); s++)
    ;
  if (s === at.length)
    return !1;
  if (u)
    return at[s][2];
  let o = e + 1;
  if (!at[s][1].test(i)) {
    for (; o < r && !(t.sCount[o] < t.blkIndent); o++)
      if (a = t.bMarks[o] + t.tShift[o], n = t.eMarks[o], i = t.src.slice(a, n), at[s][1].test(i)) {
        i.length !== 0 && o++;
        break;
      }
  }
  t.line = o;
  const h = t.push("html_block", "", 0);
  return h.map = [e, o], h.content = t.getLines(e, o, t.blkIndent, !0), !0;
}
function Ps(t, e, r, u) {
  let a = t.bMarks[e] + t.tShift[e], n = t.eMarks[e];
  if (t.sCount[e] - t.blkIndent >= 4)
    return !1;
  let i = t.src.charCodeAt(a);
  if (i !== 35 || a >= n)
    return !1;
  let s = 1;
  for (i = t.src.charCodeAt(++a); i === 35 && a < n && s <= 6; )
    s++, i = t.src.charCodeAt(++a);
  if (s > 6 || a < n && !r0(i))
    return !1;
  if (u)
    return !0;
  n = t.skipSpacesBack(n, a);
  const o = t.skipCharsBack(n, 35, a);
  o > a && r0(t.src.charCodeAt(o - 1)) && (n = o), t.line = e + 1;
  const h = t.push("heading_open", "h" + String(s), 1);
  h.markup = "########".slice(0, s), h.map = [e, t.line];
  const f = t.push("inline", "", 0);
  f.content = t.src.slice(a, n).trim(), f.map = [e, t.line], f.children = [];
  const p = t.push("heading_close", "h" + String(s), -1);
  return p.markup = "########".slice(0, s), !0;
}
function Hs(t, e, r) {
  const u = t.md.block.ruler.getRules("paragraph");
  if (t.sCount[e] - t.blkIndent >= 4)
    return !1;
  const a = t.parentType;
  t.parentType = "paragraph";
  let n = 0, i, s = e + 1;
  for (; s < r && !t.isEmpty(s); s++) {
    if (t.sCount[s] - t.blkIndent > 3)
      continue;
    if (t.sCount[s] >= t.blkIndent) {
      let x = t.bMarks[s] + t.tShift[s];
      const y = t.eMarks[s];
      if (x < y && (i = t.src.charCodeAt(x), (i === 45 || i === 61) && (x = t.skipChars(x, i), x = t.skipSpaces(x), x >= y))) {
        n = i === 61 ? 1 : 2;
        break;
      }
    }
    if (t.sCount[s] < 0)
      continue;
    let k = !1;
    for (let x = 0, y = u.length; x < y; x++)
      if (u[x](t, s, r, !0)) {
        k = !0;
        break;
      }
    if (k)
      break;
  }
  if (!n)
    return !1;
  const o = t.getLines(e, s, t.blkIndent, !1).trim();
  t.line = s + 1;
  const h = t.push("heading_open", "h" + String(n), 1);
  h.markup = String.fromCharCode(i), h.map = [e, t.line];
  const f = t.push("inline", "", 0);
  f.content = o, f.map = [e, t.line - 1], f.children = [];
  const p = t.push("heading_close", "h" + String(n), -1);
  return p.markup = String.fromCharCode(i), t.parentType = a, !0;
}
function $s(t, e, r) {
  const u = t.md.block.ruler.getRules("paragraph"), a = t.parentType;
  let n = e + 1;
  for (t.parentType = "paragraph"; n < r && !t.isEmpty(n); n++) {
    if (t.sCount[n] - t.blkIndent > 3 || t.sCount[n] < 0)
      continue;
    let h = !1;
    for (let f = 0, p = u.length; f < p; f++)
      if (u[f](t, n, r, !0)) {
        h = !0;
        break;
      }
    if (h)
      break;
  }
  const i = t.getLines(e, n, t.blkIndent, !1).trim();
  t.line = n;
  const s = t.push("paragraph_open", "p", 1);
  s.map = [e, t.line];
  const o = t.push("inline", "", 0);
  return o.content = i, o.map = [e, t.line], o.children = [], t.push("paragraph_close", "p", -1), t.parentType = a, !0;
}
const Pt = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", vs, ["paragraph", "reference"]],
  ["code", xs],
  ["fence", ys, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", ks, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", ws, ["paragraph", "reference", "blockquote", "list"]],
  ["list", Ss, ["paragraph", "reference", "blockquote"]],
  ["reference", _s],
  ["html_block", qs, ["paragraph", "reference", "blockquote"]],
  ["heading", Ps, ["paragraph", "reference", "blockquote"]],
  ["lheading", Hs],
  ["paragraph", $s]
];
function hr() {
  this.ruler = new H0();
  for (let t = 0; t < Pt.length; t++)
    this.ruler.push(Pt[t][0], Pt[t][1], { alt: (Pt[t][2] || []).slice() });
}
hr.prototype.tokenize = function(t, e, r) {
  const u = this.ruler.getRules(""), a = u.length, n = t.md.options.maxNesting;
  let i = e, s = !1;
  for (; i < r && (t.line = i = t.skipEmptyLines(i), !(i >= r || t.sCount[i] < t.blkIndent)); ) {
    if (t.level >= n) {
      t.line = r;
      break;
    }
    const o = t.line;
    let h = !1;
    for (let f = 0; f < a; f++)
      if (h = u[f](t, i, r, !1), h) {
        if (o >= t.line)
          throw new Error("block rule didn't increment state.line");
        break;
      }
    if (!h) throw new Error("none of the block rules matched");
    t.tight = !s, t.isEmpty(t.line - 1) && (s = !0), i = t.line, i < r && t.isEmpty(i) && (s = !0, i++, t.line = i);
  }
};
hr.prototype.parse = function(t, e, r, u) {
  if (!t)
    return;
  const a = new this.State(t, e, r, u);
  this.tokenize(a, a.line, a.lineMax);
};
hr.prototype.State = be;
function Mt(t, e, r, u) {
  this.src = t, this.env = r, this.md = e, this.tokens = u, this.tokens_meta = Array(u.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
Mt.prototype.pushPending = function() {
  const t = new ne("text", "", 0);
  return t.content = this.pending, t.level = this.pendingLevel, this.tokens.push(t), this.pending = "", t;
};
Mt.prototype.push = function(t, e, r) {
  this.pending && this.pushPending();
  const u = new ne(t, e, r);
  let a = null;
  return r < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), u.level = this.level, r > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], a = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(u), this.tokens_meta.push(a), u;
};
Mt.prototype.scanDelims = function(t, e) {
  const r = this.posMax, u = this.src.charCodeAt(t), a = t > 0 ? this.src.charCodeAt(t - 1) : 32;
  let n = t;
  for (; n < r && this.src.charCodeAt(n) === u; )
    n++;
  const i = n - t, s = n < r ? this.src.charCodeAt(n) : 32, o = _t(a) || St(String.fromCharCode(a)), h = _t(s) || St(String.fromCharCode(s)), f = At(a), p = At(s), k = !p && (!h || f || o), x = !f && (!o || p || h);
  return { can_open: k && (e || !x || o), can_close: x && (e || !k || h), length: i };
};
Mt.prototype.Token = ne;
function Us(t) {
  switch (t) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function Gs(t, e) {
  let r = t.pos;
  for (; r < t.posMax && !Us(t.src.charCodeAt(r)); )
    r++;
  return r === t.pos ? !1 : (e || (t.pending += t.src.slice(t.pos, r)), t.pos = r, !0);
}
const Vs = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function js(t, e) {
  if (!t.md.options.linkify || t.linkLevel > 0) return !1;
  const r = t.pos, u = t.posMax;
  if (r + 3 > u || t.src.charCodeAt(r) !== 58 || t.src.charCodeAt(r + 1) !== 47 || t.src.charCodeAt(r + 2) !== 47) return !1;
  const a = t.pending.match(Vs);
  if (!a) return !1;
  const n = a[1], i = t.md.linkify.matchAtStart(t.src.slice(r - n.length));
  if (!i) return !1;
  let s = i.url;
  if (s.length <= n.length) return !1;
  s = s.replace(/\*+$/, "");
  const o = t.md.normalizeLink(s);
  if (!t.md.validateLink(o)) return !1;
  if (!e) {
    t.pending = t.pending.slice(0, -n.length);
    const h = t.push("link_open", "a", 1);
    h.attrs = [["href", o]], h.markup = "linkify", h.info = "auto";
    const f = t.push("text", "", 0);
    f.content = t.md.normalizeLinkText(s);
    const p = t.push("link_close", "a", -1);
    p.markup = "linkify", p.info = "auto";
  }
  return t.pos += s.length - n.length, !0;
}
function Ws(t, e) {
  let r = t.pos;
  if (t.src.charCodeAt(r) !== 10)
    return !1;
  const u = t.pending.length - 1, a = t.posMax;
  if (!e)
    if (u >= 0 && t.pending.charCodeAt(u) === 32)
      if (u >= 1 && t.pending.charCodeAt(u - 1) === 32) {
        let n = u - 1;
        for (; n >= 1 && t.pending.charCodeAt(n - 1) === 32; ) n--;
        t.pending = t.pending.slice(0, n), t.push("hardbreak", "br", 0);
      } else
        t.pending = t.pending.slice(0, -1), t.push("softbreak", "br", 0);
    else
      t.push("softbreak", "br", 0);
  for (r++; r < a && r0(t.src.charCodeAt(r)); )
    r++;
  return t.pos = r, !0;
}
const Eu = [];
for (let t = 0; t < 256; t++)
  Eu.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(t) {
  Eu[t.charCodeAt(0)] = 1;
});
function Zs(t, e) {
  let r = t.pos;
  const u = t.posMax;
  if (t.src.charCodeAt(r) !== 92 || (r++, r >= u)) return !1;
  let a = t.src.charCodeAt(r);
  if (a === 10) {
    for (e || t.push("hardbreak", "br", 0), r++; r < u && (a = t.src.charCodeAt(r), !!r0(a)); )
      r++;
    return t.pos = r, !0;
  }
  let n = t.src[r];
  if (a >= 55296 && a <= 56319 && r + 1 < u) {
    const s = t.src.charCodeAt(r + 1);
    s >= 56320 && s <= 57343 && (n += t.src[r + 1], r++);
  }
  const i = "\\" + n;
  if (!e) {
    const s = t.push("text_special", "", 0);
    a < 256 && Eu[a] !== 0 ? s.content = n : s.content = i, s.markup = i, s.info = "escape";
  }
  return t.pos = r + 1, !0;
}
function Ys(t, e) {
  let r = t.pos;
  if (t.src.charCodeAt(r) !== 96)
    return !1;
  const a = r;
  r++;
  const n = t.posMax;
  for (; r < n && t.src.charCodeAt(r) === 96; )
    r++;
  const i = t.src.slice(a, r), s = i.length;
  if (t.backticksScanned && (t.backticks[s] || 0) <= a)
    return e || (t.pending += i), t.pos += s, !0;
  let o = r, h;
  for (; (h = t.src.indexOf("`", o)) !== -1; ) {
    for (o = h + 1; o < n && t.src.charCodeAt(o) === 96; )
      o++;
    const f = o - h;
    if (f === s) {
      if (!e) {
        const p = t.push("code_inline", "code", 0);
        p.markup = i, p.content = t.src.slice(r, h).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
      }
      return t.pos = o, !0;
    }
    t.backticks[f] = h;
  }
  return t.backticksScanned = !0, e || (t.pending += i), t.pos += s, !0;
}
function Xs(t, e) {
  const r = t.pos, u = t.src.charCodeAt(r);
  if (e || u !== 126)
    return !1;
  const a = t.scanDelims(t.pos, !0);
  let n = a.length;
  const i = String.fromCharCode(u);
  if (n < 2)
    return !1;
  let s;
  n % 2 && (s = t.push("text", "", 0), s.content = i, n--);
  for (let o = 0; o < n; o += 2)
    s = t.push("text", "", 0), s.content = i + i, t.delimiters.push({
      marker: u,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: t.tokens.length - 1,
      end: -1,
      open: a.can_open,
      close: a.can_close
    });
  return t.pos += a.length, !0;
}
function wa(t, e) {
  let r;
  const u = [], a = e.length;
  for (let n = 0; n < a; n++) {
    const i = e[n];
    if (i.marker !== 126 || i.end === -1)
      continue;
    const s = e[i.end];
    r = t.tokens[i.token], r.type = "s_open", r.tag = "s", r.nesting = 1, r.markup = "~~", r.content = "", r = t.tokens[s.token], r.type = "s_close", r.tag = "s", r.nesting = -1, r.markup = "~~", r.content = "", t.tokens[s.token - 1].type === "text" && t.tokens[s.token - 1].content === "~" && u.push(s.token - 1);
  }
  for (; u.length; ) {
    const n = u.pop();
    let i = n + 1;
    for (; i < t.tokens.length && t.tokens[i].type === "s_close"; )
      i++;
    i--, n !== i && (r = t.tokens[i], t.tokens[i] = t.tokens[n], t.tokens[n] = r);
  }
}
function Ks(t) {
  const e = t.tokens_meta, r = t.tokens_meta.length;
  wa(t, t.delimiters);
  for (let u = 0; u < r; u++)
    e[u] && e[u].delimiters && wa(t, e[u].delimiters);
}
const Nn = {
  tokenize: Xs,
  postProcess: Ks
};
function Js(t, e) {
  const r = t.pos, u = t.src.charCodeAt(r);
  if (e || u !== 95 && u !== 42)
    return !1;
  const a = t.scanDelims(t.pos, u === 42);
  for (let n = 0; n < a.length; n++) {
    const i = t.push("text", "", 0);
    i.content = String.fromCharCode(u), t.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker: u,
      // Total length of these series of delimiters.
      //
      length: a.length,
      // A position of the token this delimiter corresponds to.
      //
      token: t.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: a.can_open,
      close: a.can_close
    });
  }
  return t.pos += a.length, !0;
}
function Aa(t, e) {
  const r = e.length;
  for (let u = r - 1; u >= 0; u--) {
    const a = e[u];
    if (a.marker !== 95 && a.marker !== 42 || a.end === -1)
      continue;
    const n = e[a.end], i = u > 0 && e[u - 1].end === a.end + 1 && // check that first two markers match and adjacent
    e[u - 1].marker === a.marker && e[u - 1].token === a.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    e[a.end + 1].token === n.token + 1, s = String.fromCharCode(a.marker), o = t.tokens[a.token];
    o.type = i ? "strong_open" : "em_open", o.tag = i ? "strong" : "em", o.nesting = 1, o.markup = i ? s + s : s, o.content = "";
    const h = t.tokens[n.token];
    h.type = i ? "strong_close" : "em_close", h.tag = i ? "strong" : "em", h.nesting = -1, h.markup = i ? s + s : s, h.content = "", i && (t.tokens[e[u - 1].token].content = "", t.tokens[e[a.end + 1].token].content = "", u--);
  }
}
function Qs(t) {
  const e = t.tokens_meta, r = t.tokens_meta.length;
  Aa(t, t.delimiters);
  for (let u = 0; u < r; u++)
    e[u] && e[u].delimiters && Aa(t, e[u].delimiters);
}
const Ln = {
  tokenize: Js,
  postProcess: Qs
};
function el(t, e) {
  let r, u, a, n, i = "", s = "", o = t.pos, h = !0;
  if (t.src.charCodeAt(t.pos) !== 91)
    return !1;
  const f = t.pos, p = t.posMax, k = t.pos + 1, x = t.md.helpers.parseLinkLabel(t, t.pos, !0);
  if (x < 0)
    return !1;
  let y = x + 1;
  if (y < p && t.src.charCodeAt(y) === 40) {
    for (h = !1, y++; y < p && (r = t.src.charCodeAt(y), !(!r0(r) && r !== 10)); y++)
      ;
    if (y >= p)
      return !1;
    if (o = y, a = t.md.helpers.parseLinkDestination(t.src, y, t.posMax), a.ok) {
      for (i = t.md.normalizeLink(a.str), t.md.validateLink(i) ? y = a.pos : i = "", o = y; y < p && (r = t.src.charCodeAt(y), !(!r0(r) && r !== 10)); y++)
        ;
      if (a = t.md.helpers.parseLinkTitle(t.src, y, t.posMax), y < p && o !== y && a.ok)
        for (s = a.str, y = a.pos; y < p && (r = t.src.charCodeAt(y), !(!r0(r) && r !== 10)); y++)
          ;
    }
    (y >= p || t.src.charCodeAt(y) !== 41) && (h = !0), y++;
  }
  if (h) {
    if (typeof t.env.references > "u")
      return !1;
    if (y < p && t.src.charCodeAt(y) === 91 ? (o = y + 1, y = t.md.helpers.parseLinkLabel(t, y), y >= 0 ? u = t.src.slice(o, y++) : y = x + 1) : y = x + 1, u || (u = t.src.slice(k, x)), n = t.env.references[cr(u)], !n)
      return t.pos = f, !1;
    i = n.href, s = n.title;
  }
  if (!e) {
    t.pos = k, t.posMax = x;
    const _ = t.push("link_open", "a", 1), E = [["href", i]];
    _.attrs = E, s && E.push(["title", s]), t.linkLevel++, t.md.inline.tokenize(t), t.linkLevel--, t.push("link_close", "a", -1);
  }
  return t.pos = y, t.posMax = p, !0;
}
function tl(t, e) {
  let r, u, a, n, i, s, o, h, f = "";
  const p = t.pos, k = t.posMax;
  if (t.src.charCodeAt(t.pos) !== 33 || t.src.charCodeAt(t.pos + 1) !== 91)
    return !1;
  const x = t.pos + 2, y = t.md.helpers.parseLinkLabel(t, t.pos + 1, !1);
  if (y < 0)
    return !1;
  if (n = y + 1, n < k && t.src.charCodeAt(n) === 40) {
    for (n++; n < k && (r = t.src.charCodeAt(n), !(!r0(r) && r !== 10)); n++)
      ;
    if (n >= k)
      return !1;
    for (h = n, s = t.md.helpers.parseLinkDestination(t.src, n, t.posMax), s.ok && (f = t.md.normalizeLink(s.str), t.md.validateLink(f) ? n = s.pos : f = ""), h = n; n < k && (r = t.src.charCodeAt(n), !(!r0(r) && r !== 10)); n++)
      ;
    if (s = t.md.helpers.parseLinkTitle(t.src, n, t.posMax), n < k && h !== n && s.ok)
      for (o = s.str, n = s.pos; n < k && (r = t.src.charCodeAt(n), !(!r0(r) && r !== 10)); n++)
        ;
    else
      o = "";
    if (n >= k || t.src.charCodeAt(n) !== 41)
      return t.pos = p, !1;
    n++;
  } else {
    if (typeof t.env.references > "u")
      return !1;
    if (n < k && t.src.charCodeAt(n) === 91 ? (h = n + 1, n = t.md.helpers.parseLinkLabel(t, n), n >= 0 ? a = t.src.slice(h, n++) : n = y + 1) : n = y + 1, a || (a = t.src.slice(x, y)), i = t.env.references[cr(a)], !i)
      return t.pos = p, !1;
    f = i.href, o = i.title;
  }
  if (!e) {
    u = t.src.slice(x, y);
    const _ = [];
    t.md.inline.parse(
      u,
      t.md,
      t.env,
      _
    );
    const E = t.push("image", "img", 0), F = [["src", f], ["alt", ""]];
    E.attrs = F, E.children = _, E.content = u, o && F.push(["title", o]);
  }
  return t.pos = n, t.posMax = k, !0;
}
const rl = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, ul = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function al(t, e) {
  let r = t.pos;
  if (t.src.charCodeAt(r) !== 60)
    return !1;
  const u = t.pos, a = t.posMax;
  for (; ; ) {
    if (++r >= a) return !1;
    const i = t.src.charCodeAt(r);
    if (i === 60) return !1;
    if (i === 62) break;
  }
  const n = t.src.slice(u + 1, r);
  if (ul.test(n)) {
    const i = t.md.normalizeLink(n);
    if (!t.md.validateLink(i))
      return !1;
    if (!e) {
      const s = t.push("link_open", "a", 1);
      s.attrs = [["href", i]], s.markup = "autolink", s.info = "auto";
      const o = t.push("text", "", 0);
      o.content = t.md.normalizeLinkText(n);
      const h = t.push("link_close", "a", -1);
      h.markup = "autolink", h.info = "auto";
    }
    return t.pos += n.length + 2, !0;
  }
  if (rl.test(n)) {
    const i = t.md.normalizeLink("mailto:" + n);
    if (!t.md.validateLink(i))
      return !1;
    if (!e) {
      const s = t.push("link_open", "a", 1);
      s.attrs = [["href", i]], s.markup = "autolink", s.info = "auto";
      const o = t.push("text", "", 0);
      o.content = t.md.normalizeLinkText(n);
      const h = t.push("link_close", "a", -1);
      h.markup = "autolink", h.info = "auto";
    }
    return t.pos += n.length + 2, !0;
  }
  return !1;
}
function nl(t) {
  return /^<a[>\s]/i.test(t);
}
function il(t) {
  return /^<\/a\s*>/i.test(t);
}
function sl(t) {
  const e = t | 32;
  return e >= 97 && e <= 122;
}
function ll(t, e) {
  if (!t.md.options.html)
    return !1;
  const r = t.posMax, u = t.pos;
  if (t.src.charCodeAt(u) !== 60 || u + 2 >= r)
    return !1;
  const a = t.src.charCodeAt(u + 1);
  if (a !== 33 && a !== 63 && a !== 47 && !sl(a))
    return !1;
  const n = t.src.slice(u).match(Ls);
  if (!n)
    return !1;
  if (!e) {
    const i = t.push("html_inline", "", 0);
    i.content = n[0], nl(i.content) && t.linkLevel++, il(i.content) && t.linkLevel--;
  }
  return t.pos += n[0].length, !0;
}
const ol = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, cl = /^&([a-z][a-z0-9]{1,31});/i;
function hl(t, e) {
  const r = t.pos, u = t.posMax;
  if (t.src.charCodeAt(r) !== 38 || r + 1 >= u) return !1;
  if (t.src.charCodeAt(r + 1) === 35) {
    const n = t.src.slice(r).match(ol);
    if (n) {
      if (!e) {
        const i = n[1][0].toLowerCase() === "x" ? parseInt(n[1].slice(1), 16) : parseInt(n[1], 10), s = t.push("text_special", "", 0);
        s.content = _u(i) ? tr(i) : tr(65533), s.markup = n[0], s.info = "entity";
      }
      return t.pos += n[0].length, !0;
    }
  } else {
    const n = t.src.slice(r).match(cl);
    if (n) {
      const i = Tn(n[0]);
      if (i !== n[0]) {
        if (!e) {
          const s = t.push("text_special", "", 0);
          s.content = i, s.markup = n[0], s.info = "entity";
        }
        return t.pos += n[0].length, !0;
      }
    }
  }
  return !1;
}
function Sa(t) {
  const e = {}, r = t.length;
  if (!r) return;
  let u = 0, a = -2;
  const n = [];
  for (let i = 0; i < r; i++) {
    const s = t[i];
    if (n.push(0), (t[u].marker !== s.marker || a !== s.token - 1) && (u = i), a = s.token, s.length = s.length || 0, !s.close) continue;
    e.hasOwnProperty(s.marker) || (e[s.marker] = [-1, -1, -1, -1, -1, -1]);
    const o = e[s.marker][(s.open ? 3 : 0) + s.length % 3];
    let h = u - n[u] - 1, f = h;
    for (; h > o; h -= n[h] + 1) {
      const p = t[h];
      if (p.marker === s.marker && p.open && p.end < 0) {
        let k = !1;
        if ((p.close || s.open) && (p.length + s.length) % 3 === 0 && (p.length % 3 !== 0 || s.length % 3 !== 0) && (k = !0), !k) {
          const x = h > 0 && !t[h - 1].open ? n[h - 1] + 1 : 0;
          n[i] = i - h + x, n[h] = x, s.open = !1, p.end = i, p.close = !1, f = -1, a = -2;
          break;
        }
      }
    }
    f !== -1 && (e[s.marker][(s.open ? 3 : 0) + (s.length || 0) % 3] = f);
  }
}
function dl(t) {
  const e = t.tokens_meta, r = t.tokens_meta.length;
  Sa(t.delimiters);
  for (let u = 0; u < r; u++)
    e[u] && e[u].delimiters && Sa(e[u].delimiters);
}
function fl(t) {
  let e, r, u = 0;
  const a = t.tokens, n = t.tokens.length;
  for (e = r = 0; e < n; e++)
    a[e].nesting < 0 && u--, a[e].level = u, a[e].nesting > 0 && u++, a[e].type === "text" && e + 1 < n && a[e + 1].type === "text" ? a[e + 1].content = a[e].content + a[e + 1].content : (e !== r && (a[r] = a[e]), r++);
  e !== r && (a.length = r);
}
const Rr = [
  ["text", Gs],
  ["linkify", js],
  ["newline", Ws],
  ["escape", Zs],
  ["backticks", Ys],
  ["strikethrough", Nn.tokenize],
  ["emphasis", Ln.tokenize],
  ["link", el],
  ["image", tl],
  ["autolink", al],
  ["html_inline", ll],
  ["entity", hl]
], Nr = [
  ["balance_pairs", dl],
  ["strikethrough", Nn.postProcess],
  ["emphasis", Ln.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", fl]
];
function Ft() {
  this.ruler = new H0();
  for (let t = 0; t < Rr.length; t++)
    this.ruler.push(Rr[t][0], Rr[t][1]);
  this.ruler2 = new H0();
  for (let t = 0; t < Nr.length; t++)
    this.ruler2.push(Nr[t][0], Nr[t][1]);
}
Ft.prototype.skipToken = function(t) {
  const e = t.pos, r = this.ruler.getRules(""), u = r.length, a = t.md.options.maxNesting, n = t.cache;
  if (typeof n[e] < "u") {
    t.pos = n[e];
    return;
  }
  let i = !1;
  if (t.level < a) {
    for (let s = 0; s < u; s++)
      if (t.level++, i = r[s](t, !0), t.level--, i) {
        if (e >= t.pos)
          throw new Error("inline rule didn't increment state.pos");
        break;
      }
  } else
    t.pos = t.posMax;
  i || t.pos++, n[e] = t.pos;
};
Ft.prototype.tokenize = function(t) {
  const e = this.ruler.getRules(""), r = e.length, u = t.posMax, a = t.md.options.maxNesting;
  for (; t.pos < u; ) {
    const n = t.pos;
    let i = !1;
    if (t.level < a) {
      for (let s = 0; s < r; s++)
        if (i = e[s](t, !1), i) {
          if (n >= t.pos)
            throw new Error("inline rule didn't increment state.pos");
          break;
        }
    }
    if (i) {
      if (t.pos >= u)
        break;
      continue;
    }
    t.pending += t.src[t.pos++];
  }
  t.pending && t.pushPending();
};
Ft.prototype.parse = function(t, e, r, u) {
  const a = new this.State(t, e, r, u);
  this.tokenize(a);
  const n = this.ruler2.getRules(""), i = n.length;
  for (let s = 0; s < i; s++)
    n[s](a);
};
Ft.prototype.State = Mt;
function ml(t) {
  const e = {};
  t = t || {}, e.src_Any = Sn.source, e.src_Cc = _n.source, e.src_Z = En.source, e.src_P = Au.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
  const r = "[><｜]";
  return e.src_pseudo_letter = "(?:(?!" + r + "|" + e.src_ZPCc + ")" + e.src_Any + ")", e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = "(?:(?:(?!" + e.src_ZCc + "|[@/\\[\\]()]).)+@)?", e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = "(?=$|" + r + "|" + e.src_ZPCc + ")(?!" + (t["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + e.src_ZPCc + "))", e.src_path = "(?:[/?#](?:(?!" + e.src_ZCc + "|" + r + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + e.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + e.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + e.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + e.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + e.src_ZCc + "|[']).)+\\'|\\'(?=" + e.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + e.src_ZCc + "|[.]|$)|" + (t["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  ",(?!" + e.src_ZCc + "|$)|;(?!" + e.src_ZCc + "|$)|\\!+(?!" + e.src_ZCc + "|[!]|$)|\\?(?!" + e.src_ZCc + "|[?]|$))+|\\/)?", e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + e.src_xn + "|" + e.src_pseudo_letter + "{1,63})", e.src_domain = "(?:" + e.src_xn + "|(?:" + e.src_pseudo_letter + ")|(?:" + e.src_pseudo_letter + "(?:-|" + e.src_pseudo_letter + "){0,61}" + e.src_pseudo_letter + "))", e.src_host = "(?:(?:(?:(?:" + e.src_domain + ")\\.)*" + e.src_domain + "))", e.tpl_host_fuzzy = "(?:" + e.src_ip4 + "|(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%)))", e.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%))", e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + e.src_ZPCc + "|>|$))", e.tpl_email_fuzzy = "(^|" + r + '|"|\\(|' + e.src_ZCc + ")(" + e.src_email_name + "@" + e.tpl_host_fuzzy_strict + ")", e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_fuzzy_strict + e.src_path + ")", e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_no_ip_fuzzy_strict + e.src_path + ")", e;
}
function ou(t) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(r) {
    r && Object.keys(r).forEach(function(u) {
      t[u] = r[u];
    });
  }), t;
}
function dr(t) {
  return Object.prototype.toString.call(t);
}
function pl(t) {
  return dr(t) === "[object String]";
}
function bl(t) {
  return dr(t) === "[object Object]";
}
function gl(t) {
  return dr(t) === "[object RegExp]";
}
function _a(t) {
  return dr(t) === "[object Function]";
}
function vl(t) {
  return t.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
const On = {
  fuzzyLink: !0,
  fuzzyEmail: !0,
  fuzzyIP: !1
};
function xl(t) {
  return Object.keys(t || {}).reduce(function(e, r) {
    return e || On.hasOwnProperty(r);
  }, !1);
}
const yl = {
  "http:": {
    validate: function(t, e, r) {
      const u = t.slice(e);
      return r.re.http || (r.re.http = new RegExp(
        "^\\/\\/" + r.re.src_auth + r.re.src_host_port_strict + r.re.src_path,
        "i"
      )), r.re.http.test(u) ? u.match(r.re.http)[0].length : 0;
    }
  },
  "https:": "http:",
  "ftp:": "http:",
  "//": {
    validate: function(t, e, r) {
      const u = t.slice(e);
      return r.re.no_http || (r.re.no_http = new RegExp(
        "^" + r.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
        // with code comments
        "(?:localhost|(?:(?:" + r.re.src_domain + ")\\.)+" + r.re.src_domain_root + ")" + r.re.src_port + r.re.src_host_terminator + r.re.src_path,
        "i"
      )), r.re.no_http.test(u) ? e >= 3 && t[e - 3] === ":" || e >= 3 && t[e - 3] === "/" ? 0 : u.match(r.re.no_http)[0].length : 0;
    }
  },
  "mailto:": {
    validate: function(t, e, r) {
      const u = t.slice(e);
      return r.re.mailto || (r.re.mailto = new RegExp(
        "^" + r.re.src_email_name + "@" + r.re.src_host_strict,
        "i"
      )), r.re.mailto.test(u) ? u.match(r.re.mailto)[0].length : 0;
    }
  }
}, kl = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", wl = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function Al(t) {
  t.__index__ = -1, t.__text_cache__ = "";
}
function Sl(t) {
  return function(e, r) {
    const u = e.slice(r);
    return t.test(u) ? u.match(t)[0].length : 0;
  };
}
function Ca() {
  return function(t, e) {
    e.normalize(t);
  };
}
function rr(t) {
  const e = t.re = ml(t.__opts__), r = t.__tlds__.slice();
  t.onCompile(), t.__tlds_replaced__ || r.push(kl), r.push(e.src_xn), e.src_tlds = r.join("|");
  function u(s) {
    return s.replace("%TLDS%", e.src_tlds);
  }
  e.email_fuzzy = RegExp(u(e.tpl_email_fuzzy), "i"), e.link_fuzzy = RegExp(u(e.tpl_link_fuzzy), "i"), e.link_no_ip_fuzzy = RegExp(u(e.tpl_link_no_ip_fuzzy), "i"), e.host_fuzzy_test = RegExp(u(e.tpl_host_fuzzy_test), "i");
  const a = [];
  t.__compiled__ = {};
  function n(s, o) {
    throw new Error('(LinkifyIt) Invalid schema "' + s + '": ' + o);
  }
  Object.keys(t.__schemas__).forEach(function(s) {
    const o = t.__schemas__[s];
    if (o === null)
      return;
    const h = { validate: null, link: null };
    if (t.__compiled__[s] = h, bl(o)) {
      gl(o.validate) ? h.validate = Sl(o.validate) : _a(o.validate) ? h.validate = o.validate : n(s, o), _a(o.normalize) ? h.normalize = o.normalize : o.normalize ? n(s, o) : h.normalize = Ca();
      return;
    }
    if (pl(o)) {
      a.push(s);
      return;
    }
    n(s, o);
  }), a.forEach(function(s) {
    t.__compiled__[t.__schemas__[s]] && (t.__compiled__[s].validate = t.__compiled__[t.__schemas__[s]].validate, t.__compiled__[s].normalize = t.__compiled__[t.__schemas__[s]].normalize);
  }), t.__compiled__[""] = { validate: null, normalize: Ca() };
  const i = Object.keys(t.__compiled__).filter(function(s) {
    return s.length > 0 && t.__compiled__[s];
  }).map(vl).join("|");
  t.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "i"), t.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "ig"), t.re.schema_at_start = RegExp("^" + t.re.schema_search.source, "i"), t.re.pretest = RegExp(
    "(" + t.re.schema_test.source + ")|(" + t.re.host_fuzzy_test.source + ")|@",
    "i"
  ), Al(t);
}
function _l(t, e) {
  const r = t.__index__, u = t.__last_index__, a = t.__text_cache__.slice(r, u);
  this.schema = t.__schema__.toLowerCase(), this.index = r + e, this.lastIndex = u + e, this.raw = a, this.text = a, this.url = a;
}
function cu(t, e) {
  const r = new _l(t, e);
  return t.__compiled__[r.schema].normalize(r, t), r;
}
function j0(t, e) {
  if (!(this instanceof j0))
    return new j0(t, e);
  e || xl(t) && (e = t, t = {}), this.__opts__ = ou({}, On, e), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = ou({}, yl, t), this.__compiled__ = {}, this.__tlds__ = wl, this.__tlds_replaced__ = !1, this.re = {}, rr(this);
}
j0.prototype.add = function(e, r) {
  return this.__schemas__[e] = r, rr(this), this;
};
j0.prototype.set = function(e) {
  return this.__opts__ = ou(this.__opts__, e), this;
};
j0.prototype.test = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return !1;
  let r, u, a, n, i, s, o, h, f;
  if (this.re.schema_test.test(e)) {
    for (o = this.re.schema_search, o.lastIndex = 0; (r = o.exec(e)) !== null; )
      if (n = this.testSchemaAt(e, r[2], o.lastIndex), n) {
        this.__schema__ = r[2], this.__index__ = r.index + r[1].length, this.__last_index__ = r.index + r[0].length + n;
        break;
      }
  }
  return this.__opts__.fuzzyLink && this.__compiled__["http:"] && (h = e.search(this.re.host_fuzzy_test), h >= 0 && (this.__index__ < 0 || h < this.__index__) && (u = e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null && (i = u.index + u[1].length, (this.__index__ < 0 || i < this.__index__) && (this.__schema__ = "", this.__index__ = i, this.__last_index__ = u.index + u[0].length))), this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && (f = e.indexOf("@"), f >= 0 && (a = e.match(this.re.email_fuzzy)) !== null && (i = a.index + a[1].length, s = a.index + a[0].length, (this.__index__ < 0 || i < this.__index__ || i === this.__index__ && s > this.__last_index__) && (this.__schema__ = "mailto:", this.__index__ = i, this.__last_index__ = s))), this.__index__ >= 0;
};
j0.prototype.pretest = function(e) {
  return this.re.pretest.test(e);
};
j0.prototype.testSchemaAt = function(e, r, u) {
  return this.__compiled__[r.toLowerCase()] ? this.__compiled__[r.toLowerCase()].validate(e, u, this) : 0;
};
j0.prototype.match = function(e) {
  const r = [];
  let u = 0;
  this.__index__ >= 0 && this.__text_cache__ === e && (r.push(cu(this, u)), u = this.__last_index__);
  let a = u ? e.slice(u) : e;
  for (; this.test(a); )
    r.push(cu(this, u)), a = a.slice(this.__last_index__), u += this.__last_index__;
  return r.length ? r : null;
};
j0.prototype.matchAtStart = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length) return null;
  const r = this.re.schema_at_start.exec(e);
  if (!r) return null;
  const u = this.testSchemaAt(e, r[2], r[0].length);
  return u ? (this.__schema__ = r[2], this.__index__ = r.index + r[1].length, this.__last_index__ = r.index + r[0].length + u, cu(this, 0)) : null;
};
j0.prototype.tlds = function(e, r) {
  return e = Array.isArray(e) ? e : [e], r ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(u, a, n) {
    return u !== n[a - 1];
  }).reverse(), rr(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, rr(this), this);
};
j0.prototype.normalize = function(e) {
  e.schema || (e.url = "http://" + e.url), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = "mailto:" + e.url);
};
j0.prototype.onCompile = function() {
};
const it = 2147483647, de = 36, Du = 1, Ct = 26, Cl = 38, El = 700, qn = 72, Pn = 128, Hn = "-", Dl = /^xn--/, Tl = /[^\0-\x7F]/, Ml = /[\x2E\u3002\uFF0E\uFF61]/g, Fl = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, Lr = de - Du, fe = Math.floor, Or = String.fromCharCode;
function Ne(t) {
  throw new RangeError(Fl[t]);
}
function zl(t, e) {
  const r = [];
  let u = t.length;
  for (; u--; )
    r[u] = e(t[u]);
  return r;
}
function $n(t, e) {
  const r = t.split("@");
  let u = "";
  r.length > 1 && (u = r[0] + "@", t = r[1]), t = t.replace(Ml, ".");
  const a = t.split("."), n = zl(a, e).join(".");
  return u + n;
}
function Un(t) {
  const e = [];
  let r = 0;
  const u = t.length;
  for (; r < u; ) {
    const a = t.charCodeAt(r++);
    if (a >= 55296 && a <= 56319 && r < u) {
      const n = t.charCodeAt(r++);
      (n & 64512) == 56320 ? e.push(((a & 1023) << 10) + (n & 1023) + 65536) : (e.push(a), r--);
    } else
      e.push(a);
  }
  return e;
}
const Bl = (t) => String.fromCodePoint(...t), Il = function(t) {
  return t >= 48 && t < 58 ? 26 + (t - 48) : t >= 65 && t < 91 ? t - 65 : t >= 97 && t < 123 ? t - 97 : de;
}, Ea = function(t, e) {
  return t + 22 + 75 * (t < 26) - ((e != 0) << 5);
}, Gn = function(t, e, r) {
  let u = 0;
  for (t = r ? fe(t / El) : t >> 1, t += fe(t / e); t > Lr * Ct >> 1; u += de)
    t = fe(t / Lr);
  return fe(u + (Lr + 1) * t / (t + Cl));
}, Vn = function(t) {
  const e = [], r = t.length;
  let u = 0, a = Pn, n = qn, i = t.lastIndexOf(Hn);
  i < 0 && (i = 0);
  for (let s = 0; s < i; ++s)
    t.charCodeAt(s) >= 128 && Ne("not-basic"), e.push(t.charCodeAt(s));
  for (let s = i > 0 ? i + 1 : 0; s < r; ) {
    const o = u;
    for (let f = 1, p = de; ; p += de) {
      s >= r && Ne("invalid-input");
      const k = Il(t.charCodeAt(s++));
      k >= de && Ne("invalid-input"), k > fe((it - u) / f) && Ne("overflow"), u += k * f;
      const x = p <= n ? Du : p >= n + Ct ? Ct : p - n;
      if (k < x)
        break;
      const y = de - x;
      f > fe(it / y) && Ne("overflow"), f *= y;
    }
    const h = e.length + 1;
    n = Gn(u - o, h, o == 0), fe(u / h) > it - a && Ne("overflow"), a += fe(u / h), u %= h, e.splice(u++, 0, a);
  }
  return String.fromCodePoint(...e);
}, jn = function(t) {
  const e = [];
  t = Un(t);
  const r = t.length;
  let u = Pn, a = 0, n = qn;
  for (const o of t)
    o < 128 && e.push(Or(o));
  const i = e.length;
  let s = i;
  for (i && e.push(Hn); s < r; ) {
    let o = it;
    for (const f of t)
      f >= u && f < o && (o = f);
    const h = s + 1;
    o - u > fe((it - a) / h) && Ne("overflow"), a += (o - u) * h, u = o;
    for (const f of t)
      if (f < u && ++a > it && Ne("overflow"), f === u) {
        let p = a;
        for (let k = de; ; k += de) {
          const x = k <= n ? Du : k >= n + Ct ? Ct : k - n;
          if (p < x)
            break;
          const y = p - x, _ = de - x;
          e.push(
            Or(Ea(x + y % _, 0))
          ), p = fe(y / _);
        }
        e.push(Or(Ea(p, 0))), n = Gn(a, h, s === i), a = 0, ++s;
      }
    ++a, ++u;
  }
  return e.join("");
}, Rl = function(t) {
  return $n(t, function(e) {
    return Dl.test(e) ? Vn(e.slice(4).toLowerCase()) : e;
  });
}, Nl = function(t) {
  return $n(t, function(e) {
    return Tl.test(e) ? "xn--" + jn(e) : e;
  });
}, Wn = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  version: "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  ucs2: {
    decode: Un,
    encode: Bl
  },
  decode: Vn,
  encode: jn,
  toASCII: Nl,
  toUnicode: Rl
}, Ll = {
  options: {
    // Enable HTML tags in source
    html: !1,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !1,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 100
  },
  components: {
    core: {},
    block: {},
    inline: {}
  }
}, Ol = {
  options: {
    // Enable HTML tags in source
    html: !1,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !1,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "text"
      ],
      rules2: [
        "balance_pairs",
        "fragments_join"
      ]
    }
  }
}, ql = {
  options: {
    // Enable HTML tags in source
    html: !0,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !0,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    // Internal protection, recursion limit
    maxNesting: 20
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "autolink",
        "backticks",
        "emphasis",
        "entity",
        "escape",
        "html_inline",
        "image",
        "link",
        "newline",
        "text"
      ],
      rules2: [
        "balance_pairs",
        "emphasis",
        "fragments_join"
      ]
    }
  }
}, Pl = {
  default: Ll,
  zero: Ol,
  commonmark: ql
}, Hl = /^(vbscript|javascript|file|data):/, $l = /^data:image\/(gif|png|jpeg|webp);/;
function Ul(t) {
  const e = t.trim().toLowerCase();
  return Hl.test(e) ? $l.test(e) : !0;
}
const Zn = ["http:", "https:", "mailto:"];
function Gl(t) {
  const e = wu(t, !0);
  if (e.hostname && (!e.protocol || Zn.indexOf(e.protocol) >= 0))
    try {
      e.hostname = Wn.toASCII(e.hostname);
    } catch {
    }
  return Tt(ku(e));
}
function Vl(t) {
  const e = wu(t, !0);
  if (e.hostname && (!e.protocol || Zn.indexOf(e.protocol) >= 0))
    try {
      e.hostname = Wn.toUnicode(e.hostname);
    } catch {
    }
  return lt(ku(e), lt.defaultChars + "%");
}
function W0(t, e) {
  if (!(this instanceof W0))
    return new W0(t, e);
  e || Su(t) || (e = t || {}, t = "default"), this.inline = new Ft(), this.block = new hr(), this.core = new Cu(), this.renderer = new ht(), this.linkify = new j0(), this.validateLink = Ul, this.normalizeLink = Gl, this.normalizeLinkText = Vl, this.utils = Wi, this.helpers = or({}, Ki), this.options = {}, this.configure(t), e && this.set(e);
}
W0.prototype.set = function(t) {
  return or(this.options, t), this;
};
W0.prototype.configure = function(t) {
  const e = this;
  if (Su(t)) {
    const r = t;
    if (t = Pl[r], !t)
      throw new Error('Wrong `markdown-it` preset "' + r + '", check name');
  }
  if (!t)
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  return t.options && e.set(t.options), t.components && Object.keys(t.components).forEach(function(r) {
    t.components[r].rules && e[r].ruler.enableOnly(t.components[r].rules), t.components[r].rules2 && e[r].ruler2.enableOnly(t.components[r].rules2);
  }), this;
};
W0.prototype.enable = function(t, e) {
  let r = [];
  Array.isArray(t) || (t = [t]), ["core", "block", "inline"].forEach(function(a) {
    r = r.concat(this[a].ruler.enable(t, !0));
  }, this), r = r.concat(this.inline.ruler2.enable(t, !0));
  const u = t.filter(function(a) {
    return r.indexOf(a) < 0;
  });
  if (u.length && !e)
    throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + u);
  return this;
};
W0.prototype.disable = function(t, e) {
  let r = [];
  Array.isArray(t) || (t = [t]), ["core", "block", "inline"].forEach(function(a) {
    r = r.concat(this[a].ruler.disable(t, !0));
  }, this), r = r.concat(this.inline.ruler2.disable(t, !0));
  const u = t.filter(function(a) {
    return r.indexOf(a) < 0;
  });
  if (u.length && !e)
    throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + u);
  return this;
};
W0.prototype.use = function(t) {
  const e = [this].concat(Array.prototype.slice.call(arguments, 1));
  return t.apply(t, e), this;
};
W0.prototype.parse = function(t, e) {
  if (typeof t != "string")
    throw new Error("Input data should be a String");
  const r = new this.core.State(t, this, e);
  return this.core.process(r), r.tokens;
};
W0.prototype.render = function(t, e) {
  return e = e || {}, this.renderer.render(this.parse(t, e), this.options, e);
};
W0.prototype.parseInline = function(t, e) {
  const r = new this.core.State(t, this, e);
  return r.inlineMode = !0, this.core.process(r), r.tokens;
};
W0.prototype.renderInline = function(t, e) {
  return e = e || {}, this.renderer.render(this.parseInline(t, e), this.options, e);
};
const jl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: W0
}, Symbol.toStringTag, { value: "Module" }));
var qr, Da;
function Wl() {
  if (Da) return qr;
  Da = 1;
  var t = !0, e = !1, r = !1;
  qr = function(_, E) {
    E && (t = !E.enabled, e = !!E.label, r = !!E.labelAfter), _.core.ruler.after("inline", "github-task-lists", function(F) {
      for (var v = F.tokens, w = 2; w < v.length; w++)
        n(v, w) && (i(v[w], F.Token), u(v[w - 2], "class", "task-list-item" + (t ? "" : " enabled")), u(v[a(v, w - 2)], "class", "contains-task-list"));
    });
  };
  function u(_, E, F) {
    var v = _.attrIndex(E), w = [E, F];
    v < 0 ? _.attrPush(w) : _.attrs[v] = w;
  }
  function a(_, E) {
    for (var F = _[E].level - 1, v = E - 1; v >= 0; v--)
      if (_[v].level === F)
        return v;
    return -1;
  }
  function n(_, E) {
    return p(_[E]) && k(_[E - 1]) && x(_[E - 2]) && y(_[E]);
  }
  function i(_, E) {
    if (_.children.unshift(s(_, E)), _.children[1].content = _.children[1].content.slice(3), _.content = _.content.slice(3), e)
      if (r) {
        _.children.pop();
        var F = "task-item-" + Math.ceil(Math.random() * (1e4 * 1e3) - 1e3);
        _.children[0].content = _.children[0].content.slice(0, -1) + ' id="' + F + '">', _.children.push(f(_.content, F, E));
      } else
        _.children.unshift(o(E)), _.children.push(h(E));
  }
  function s(_, E) {
    var F = new E("html_inline", "", 0), v = t ? ' disabled="" ' : "";
    return _.content.indexOf("[ ] ") === 0 ? F.content = '<input class="task-list-item-checkbox"' + v + 'type="checkbox">' : (_.content.indexOf("[x] ") === 0 || _.content.indexOf("[X] ") === 0) && (F.content = '<input class="task-list-item-checkbox" checked=""' + v + 'type="checkbox">'), F;
  }
  function o(_) {
    var E = new _("html_inline", "", 0);
    return E.content = "<label>", E;
  }
  function h(_) {
    var E = new _("html_inline", "", 0);
    return E.content = "</label>", E;
  }
  function f(_, E, F) {
    var v = new F("html_inline", "", 0);
    return v.content = '<label class="task-list-item-label" for="' + E + '">' + _ + "</label>", v.attrs = [{ for: E }], v;
  }
  function p(_) {
    return _.type === "inline";
  }
  function k(_) {
    return _.type === "paragraph_open";
  }
  function x(_) {
    return _.type === "list_item_open";
  }
  function y(_) {
    return _.content.indexOf("[ ] ") === 0 || _.content.indexOf("[x] ") === 0 || _.content.indexOf("[X] ") === 0;
  }
  return qr;
}
var Zl = Wl();
const Yl = /* @__PURE__ */ An(Zl), ur = (t) => t.replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/"/gu, "&quot;").replace(/'/gu, "&#39;"), Ta = (t, e, r = 0) => {
  let u = 0, a = e - 1;
  for (; a >= r && t.charCodeAt(a) === 92; ) u++, a--;
  return u;
}, Ma = (t, e, r) => {
  const u = t.src.charCodeAt(e - 1), a = t.src.charCodeAt(e + 1);
  return { canOpen: r || !r0(a), canClose: !(a >= 48 && a <= 57) && (r || !r0(u)) };
}, Xl = (t) => (e, r) => {
  if (e.src[e.pos] !== "$") return !1;
  let u = Ma(e, e.pos, t);
  if (!u.canOpen) return r || (e.pending += "$"), e.pos++, !0;
  const a = e.pos + 1;
  let n = a, i;
  const s = e.src.lastIndexOf("$");
  if (s === -1) return !1;
  for (; (n = e.src.indexOf("$", n)) <= s; ) {
    for (i = n - 1; e.src.charCodeAt(i) === 92; ) i--;
    if ((n - i) % 2 === 1) break;
    n++;
  }
  if (n === -1) return r || (e.pending += "$"), e.pos = a, !0;
  if (n - a === 0) return r || (e.pending += "$$"), e.pos = a + 1, !0;
  if (u = Ma(e, n, t), !u.canClose) return r || (e.pending += "$"), e.pos = a, !0;
  if (!r) {
    const o = e.push("math_inline", "math", 0);
    o.markup = "$", o.content = e.src.slice(a, n);
  }
  return e.pos = n + 1, !0;
}, Kl = () => (t, e) => {
  const r = t.pos;
  if (t.src.charCodeAt(r) !== 92 || t.src.charCodeAt(r + 1) !== 40) return !1;
  let u = r + 2, a = !1;
  const n = t.src.length;
  for (; u < n - 1; ) {
    if (t.src.charCodeAt(u) === 92 && t.src.charCodeAt(u + 1) === 41) {
      if (Ta(t.src, r) % 2 === 1) return !1;
      if (Ta(t.src, u, r + 2) % 2 === 0) {
        a = !0;
        break;
      }
    }
    u++;
  }
  if (!a) return !1;
  if (!e) {
    const i = t.push("math_inline", "math", 0);
    i.markup = "\\(", i.content = t.src.slice(r + 2, u);
  }
  return t.pos = u + 2, !0;
}, Jl = (t, e, r, u) => {
  const a = t.bMarks[e] + t.tShift[e];
  let n = t.eMarks[e];
  if (a + 2 > n || t.src.charCodeAt(a) !== 36 || t.src.charCodeAt(a + 1) !== 36) return !1;
  if (u) return !0;
  let i = t.skipSpacesBack(n, a), s = a + 2, o, h = !1;
  i - s >= 2 && t.src.charCodeAt(i - 1) === 36 && t.src.charCodeAt(i - 2) === 36 ? (o = t.src.slice(s, i - 2), h = !0) : o = t.src.slice(s, n);
  let f = e, p = "";
  for (; !h && (f++, !(f >= r || (s = t.bMarks[f] + t.tShift[f], n = t.eMarks[f], s < n && t.tShift[f] < t.blkIndent))); ) i = t.skipSpacesBack(n, s), i - s >= 2 && t.src.charCodeAt(i - 1) === 36 && t.src.charCodeAt(i - 2) === 36 && (p = t.src.slice(s, i - 2), h = !0);
  t.line = h ? f + 1 : f;
  const k = t.push("math_block", "math", 0);
  return k.block = !0, k.content = (o ? `${o}
` : "") + t.getLines(e + 1, f, t.tShift[e], !0) + (p ? `${p}
` : ""), k.map = [e, t.line], k.markup = "$$", !0;
}, Ql = () => (t, e, r, u) => {
  const a = t.bMarks[e] + t.tShift[e];
  let n = t.eMarks[e];
  if (a + 2 > n || t.src.charCodeAt(a) !== 92 || t.src.charCodeAt(a + 1) !== 91) return !1;
  if (u) return !0;
  let i = t.skipSpacesBack(n, a), s = a + 2, o, h = !1;
  i - s >= 2 && t.src.charCodeAt(i - 1) === 93 && t.src.charCodeAt(i - 2) === 92 ? (o = t.src.slice(s, i - 2), h = !0) : o = t.src.slice(s, n);
  let f = e, p = "";
  for (; !h && (f++, !(f >= r || (s = t.bMarks[f] + t.tShift[f], n = t.eMarks[f], s < n && t.tShift[f] < t.blkIndent))); ) i = t.skipSpacesBack(n, s), i - s >= 2 && t.src.charCodeAt(i - 1) === 93 && t.src.charCodeAt(i - 2) === 92 && (p = t.src.slice(s, i - 2).trimEnd(), h = !0);
  if (!h) return !1;
  t.line = f + 1;
  const k = t.push("math_block", "math", 0);
  return k.block = !0, k.content = (o ? `${o}
` : "") + t.getLines(e + 1, f, t.tShift[e], !0) + (p ? `${p}
` : ""), k.map = [e, t.line], k.markup = "\\[", !0;
}, Fa = { alt: ["paragraph", "reference", "blockquote", "list"] }, eo = (t, e) => {
  if (typeof e?.render != "function") throw new Error('[@mdit/plugin-tex]: "render" option should be a function');
  const { allowInlineWithSpace: r = !1, mathFence: u = !1, delimiters: a = "dollars", render: n } = e;
  if (u) {
    const i = t.renderer.rules.fence;
    t.renderer.rules.fence = (...s) => {
      const [o, h, , f] = s, { content: p, info: k } = o[h];
      return k.trim() === "math" ? n(p, !0, f) : i(...s);
    };
  }
  (a === "dollars" || a === "all") && (t.inline.ruler.after("escape", "math_inline_dollar", Xl(r)), t.block.ruler.after("blockquote", "math_block_dollar", Jl, Fa)), (a === "brackets" || a === "all") && (t.inline.ruler.before("escape", "math_inline_bracket", Kl()), t.block.ruler.after("blockquote", "math_block_bracket", Ql(), Fa)), t.renderer.rules.math_inline = (i, s, o, h) => n(i[s].content, !1, h), t.renderer.rules.math_block = (i, s, o, h) => n(i[s].content, !0, h);
};
class P0 {
  // The + prefix indicates that these fields aren't writeable
  // Lexer holding the input string.
  // Start offset, zero-based inclusive.
  // End offset, zero-based exclusive.
  constructor(e, r, u) {
    this.lexer = void 0, this.start = void 0, this.end = void 0, this.lexer = e, this.start = r, this.end = u;
  }
  /**
   * Merges two `SourceLocation`s from location providers, given they are
   * provided in order of appearance.
   * - Returns the first one's location if only the first is provided.
   * - Returns a merged range of the first and the last if both are provided
   *   and their lexers match.
   * - Otherwise, returns null.
   */
  static range(e, r) {
    return r ? !e || !e.loc || !r.loc || e.loc.lexer !== r.loc.lexer ? null : new P0(e.loc.lexer, e.loc.start, r.loc.end) : e && e.loc;
  }
}
class V0 {
  // don't expand the token
  // used in \noexpand
  constructor(e, r) {
    this.text = void 0, this.loc = void 0, this.noexpand = void 0, this.treatAsRelax = void 0, this.text = e, this.loc = r;
  }
  /**
   * Given a pair of tokens (this and endToken), compute a `Token` encompassing
   * the whole input range enclosed by these two.
   */
  range(e, r) {
    return new V0(r, P0.range(this, e));
  }
}
class R {
  // Error start position based on passed-in Token or ParseNode.
  // Length of affected text based on passed-in Token or ParseNode.
  // The underlying error message without any context added.
  constructor(e, r) {
    this.name = void 0, this.position = void 0, this.length = void 0, this.rawMessage = void 0;
    var u = "KaTeX parse error: " + e, a, n, i = r && r.loc;
    if (i && i.start <= i.end) {
      var s = i.lexer.input;
      a = i.start, n = i.end, a === s.length ? u += " at end of input: " : u += " at position " + (a + 1) + ": ";
      var o = s.slice(a, n).replace(/[^]/g, "$&̲"), h;
      a > 15 ? h = "…" + s.slice(a - 15, a) : h = s.slice(0, a);
      var f;
      n + 15 < s.length ? f = s.slice(n, n + 15) + "…" : f = s.slice(n), u += h + o + f;
    }
    var p = new Error(u);
    return p.name = "ParseError", p.__proto__ = R.prototype, p.position = a, a != null && n != null && (p.length = n - a), p.rawMessage = e, p;
  }
}
R.prototype.__proto__ = Error.prototype;
var to = function(e, r) {
  return e === void 0 ? r : e;
}, ro = /([A-Z])/g, uo = function(e) {
  return e.replace(ro, "-$1").toLowerCase();
}, ao = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  '"': "&quot;",
  "'": "&#x27;"
}, no = /[&><"']/g;
function io(t) {
  return String(t).replace(no, (e) => ao[e]);
}
var Yn = function t(e) {
  return e.type === "ordgroup" || e.type === "color" ? e.body.length === 1 ? t(e.body[0]) : e : e.type === "font" ? t(e.body) : e;
}, so = function(e) {
  var r = Yn(e);
  return r.type === "mathord" || r.type === "textord" || r.type === "atom";
}, lo = function(e) {
  if (!e)
    throw new Error("Expected non-null, but got " + String(e));
  return e;
}, oo = function(e) {
  var r = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(e);
  return r ? r[2] !== ":" || !/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(r[1]) ? null : r[1].toLowerCase() : "_relative";
}, t0 = {
  deflt: to,
  escape: io,
  hyphenate: uo,
  getBaseElem: Yn,
  isCharacterBox: so,
  protocolFromUrl: oo
}, Pr = {
  displayMode: {
    type: "boolean",
    description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
    cli: "-d, --display-mode"
  },
  output: {
    type: {
      enum: ["htmlAndMathml", "html", "mathml"]
    },
    description: "Determines the markup language of the output.",
    cli: "-F, --format <type>"
  },
  leqno: {
    type: "boolean",
    description: "Render display math in leqno style (left-justified tags)."
  },
  fleqn: {
    type: "boolean",
    description: "Render display math flush left."
  },
  throwOnError: {
    type: "boolean",
    default: !0,
    cli: "-t, --no-throw-on-error",
    cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
  },
  errorColor: {
    type: "string",
    default: "#cc0000",
    cli: "-c, --error-color <color>",
    cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
    cliProcessor: (t) => "#" + t
  },
  macros: {
    type: "object",
    cli: "-m, --macro <def>",
    cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
    cliDefault: [],
    cliProcessor: (t, e) => (e.push(t), e)
  },
  minRuleThickness: {
    type: "number",
    description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
    processor: (t) => Math.max(0, t),
    cli: "--min-rule-thickness <size>",
    cliProcessor: parseFloat
  },
  colorIsTextColor: {
    type: "boolean",
    description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
    cli: "-b, --color-is-text-color"
  },
  strict: {
    type: [{
      enum: ["warn", "ignore", "error"]
    }, "boolean", "function"],
    description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
    cli: "-S, --strict",
    cliDefault: !1
  },
  trust: {
    type: ["boolean", "function"],
    description: "Trust the input, enabling all HTML features such as \\url.",
    cli: "-T, --trust"
  },
  maxSize: {
    type: "number",
    default: 1 / 0,
    description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
    processor: (t) => Math.max(0, t),
    cli: "-s, --max-size <n>",
    cliProcessor: parseInt
  },
  maxExpand: {
    type: "number",
    default: 1e3,
    description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
    processor: (t) => Math.max(0, t),
    cli: "-e, --max-expand <n>",
    cliProcessor: (t) => t === "Infinity" ? 1 / 0 : parseInt(t)
  },
  globalGroup: {
    type: "boolean",
    cli: !1
  }
};
function co(t) {
  if (t.default)
    return t.default;
  var e = t.type, r = Array.isArray(e) ? e[0] : e;
  if (typeof r != "string")
    return r.enum[0];
  switch (r) {
    case "boolean":
      return !1;
    case "string":
      return "";
    case "number":
      return 0;
    case "object":
      return {};
  }
}
class ho {
  constructor(e) {
    this.displayMode = void 0, this.output = void 0, this.leqno = void 0, this.fleqn = void 0, this.throwOnError = void 0, this.errorColor = void 0, this.macros = void 0, this.minRuleThickness = void 0, this.colorIsTextColor = void 0, this.strict = void 0, this.trust = void 0, this.maxSize = void 0, this.maxExpand = void 0, this.globalGroup = void 0, e = e || {};
    for (var r in Pr)
      if (Pr.hasOwnProperty(r)) {
        var u = Pr[r];
        this[r] = e[r] !== void 0 ? u.processor ? u.processor(e[r]) : e[r] : co(u);
      }
  }
  /**
   * Report nonstrict (non-LaTeX-compatible) input.
   * Can safely not be called if `this.strict` is false in JavaScript.
   */
  reportNonstrict(e, r, u) {
    var a = this.strict;
    if (typeof a == "function" && (a = a(e, r, u)), !(!a || a === "ignore")) {
      if (a === !0 || a === "error")
        throw new R("LaTeX-incompatible input and strict mode is set to 'error': " + (r + " [" + e + "]"), u);
      a === "warn" ? typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (r + " [" + e + "]")) : typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + a + "': " + r + " [" + e + "]"));
    }
  }
  /**
   * Check whether to apply strict (LaTeX-adhering) behavior for unusual
   * input (like `\\`).  Unlike `nonstrict`, will not throw an error;
   * instead, "error" translates to a return value of `true`, while "ignore"
   * translates to a return value of `false`.  May still print a warning:
   * "warn" prints a warning and returns `false`.
   * This is for the second category of `errorCode`s listed in the README.
   */
  useStrictBehavior(e, r, u) {
    var a = this.strict;
    if (typeof a == "function")
      try {
        a = a(e, r, u);
      } catch {
        a = "error";
      }
    return !a || a === "ignore" ? !1 : a === !0 || a === "error" ? !0 : a === "warn" ? (typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (r + " [" + e + "]")), !1) : (typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + a + "': " + r + " [" + e + "]")), !1);
  }
  /**
   * Check whether to test potentially dangerous input, and return
   * `true` (trusted) or `false` (untrusted).  The sole argument `context`
   * should be an object with `command` field specifying the relevant LaTeX
   * command (as a string starting with `\`), and any other arguments, etc.
   * If `context` has a `url` field, a `protocol` field will automatically
   * get added by this function (changing the specified object).
   */
  isTrusted(e) {
    if (e.url && !e.protocol) {
      var r = t0.protocolFromUrl(e.url);
      if (r == null)
        return !1;
      e.protocol = r;
    }
    var u = typeof this.trust == "function" ? this.trust(e) : this.trust;
    return !!u;
  }
}
class Ie {
  constructor(e, r, u) {
    this.id = void 0, this.size = void 0, this.cramped = void 0, this.id = e, this.size = r, this.cramped = u;
  }
  /**
   * Get the style of a superscript given a base in the current style.
   */
  sup() {
    return he[fo[this.id]];
  }
  /**
   * Get the style of a subscript given a base in the current style.
   */
  sub() {
    return he[mo[this.id]];
  }
  /**
   * Get the style of a fraction numerator given the fraction in the current
   * style.
   */
  fracNum() {
    return he[po[this.id]];
  }
  /**
   * Get the style of a fraction denominator given the fraction in the current
   * style.
   */
  fracDen() {
    return he[bo[this.id]];
  }
  /**
   * Get the cramped version of a style (in particular, cramping a cramped style
   * doesn't change the style).
   */
  cramp() {
    return he[go[this.id]];
  }
  /**
   * Get a text or display version of this style.
   */
  text() {
    return he[vo[this.id]];
  }
  /**
   * Return true if this style is tightly spaced (scriptstyle/scriptscriptstyle)
   */
  isTight() {
    return this.size >= 2;
  }
}
var Tu = 0, ar = 1, st = 2, De = 3, Et = 4, K0 = 5, ct = 6, B0 = 7, he = [new Ie(Tu, 0, !1), new Ie(ar, 0, !0), new Ie(st, 1, !1), new Ie(De, 1, !0), new Ie(Et, 2, !1), new Ie(K0, 2, !0), new Ie(ct, 3, !1), new Ie(B0, 3, !0)], fo = [Et, K0, Et, K0, ct, B0, ct, B0], mo = [K0, K0, K0, K0, B0, B0, B0, B0], po = [st, De, Et, K0, ct, B0, ct, B0], bo = [De, De, K0, K0, B0, B0, B0, B0], go = [ar, ar, De, De, K0, K0, B0, B0], vo = [Tu, ar, st, De, st, De, st, De], j = {
  DISPLAY: he[Tu],
  TEXT: he[st],
  SCRIPT: he[Et],
  SCRIPTSCRIPT: he[ct]
}, hu = [{
  // Latin characters beyond the Latin-1 characters we have metrics for.
  // Needed for Czech, Hungarian and Turkish text, for example.
  name: "latin",
  blocks: [
    [256, 591],
    // Latin Extended-A and Latin Extended-B
    [768, 879]
    // Combining Diacritical marks
  ]
}, {
  // The Cyrillic script used by Russian and related languages.
  // A Cyrillic subset used to be supported as explicitly defined
  // symbols in symbols.js
  name: "cyrillic",
  blocks: [[1024, 1279]]
}, {
  // Armenian
  name: "armenian",
  blocks: [[1328, 1423]]
}, {
  // The Brahmic scripts of South and Southeast Asia
  // Devanagari (0900–097F)
  // Bengali (0980–09FF)
  // Gurmukhi (0A00–0A7F)
  // Gujarati (0A80–0AFF)
  // Oriya (0B00–0B7F)
  // Tamil (0B80–0BFF)
  // Telugu (0C00–0C7F)
  // Kannada (0C80–0CFF)
  // Malayalam (0D00–0D7F)
  // Sinhala (0D80–0DFF)
  // Thai (0E00–0E7F)
  // Lao (0E80–0EFF)
  // Tibetan (0F00–0FFF)
  // Myanmar (1000–109F)
  name: "brahmic",
  blocks: [[2304, 4255]]
}, {
  name: "georgian",
  blocks: [[4256, 4351]]
}, {
  // Chinese and Japanese.
  // The "k" in cjk is for Korean, but we've separated Korean out
  name: "cjk",
  blocks: [
    [12288, 12543],
    // CJK symbols and punctuation, Hiragana, Katakana
    [19968, 40879],
    // CJK ideograms
    [65280, 65376]
    // Fullwidth punctuation
    // TODO: add halfwidth Katakana and Romanji glyphs
  ]
}, {
  // Korean
  name: "hangul",
  blocks: [[44032, 55215]]
}];
function xo(t) {
  for (var e = 0; e < hu.length; e++)
    for (var r = hu[e], u = 0; u < r.blocks.length; u++) {
      var a = r.blocks[u];
      if (t >= a[0] && t <= a[1])
        return r.name;
    }
  return null;
}
var Jt = [];
hu.forEach((t) => t.blocks.forEach((e) => Jt.push(...e)));
function Xn(t) {
  for (var e = 0; e < Jt.length; e += 2)
    if (t >= Jt[e] && t <= Jt[e + 1])
      return !0;
  return !1;
}
var nt = 80, yo = function(e, r) {
  return "M95," + (622 + e + r) + `
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l` + e / 2.075 + " -" + e + `
c5.3,-9.3,12,-14,20,-14
H400000v` + (40 + e) + `H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M` + (834 + e) + " " + r + "h400000v" + (40 + e) + "h-400000z";
}, ko = function(e, r) {
  return "M263," + (601 + e + r) + `c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l` + e / 2.084 + " -" + e + `
c4.7,-7.3,11,-11,19,-11
H40000v` + (40 + e) + `H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M` + (1001 + e) + " " + r + "h400000v" + (40 + e) + "h-400000z";
}, wo = function(e, r) {
  return "M983 " + (10 + e + r) + `
l` + e / 3.13 + " -" + e + `
c4,-6.7,10,-10,18,-10 H400000v` + (40 + e) + `
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M` + (1001 + e) + " " + r + "h400000v" + (40 + e) + "h-400000z";
}, Ao = function(e, r) {
  return "M424," + (2398 + e + r) + `
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l` + e / 4.223 + " -" + e + `c4,-6.7,10,-10,18,-10 H400000
v` + (40 + e) + `H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M` + (1001 + e) + " " + r + `
h400000v` + (40 + e) + "h-400000z";
}, So = function(e, r) {
  return "M473," + (2713 + e + r) + `
c339.3,-1799.3,509.3,-2700,510,-2702 l` + e / 5.298 + " -" + e + `
c3.3,-7.3,9.3,-11,18,-11 H400000v` + (40 + e) + `H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM` + (1001 + e) + " " + r + "h400000v" + (40 + e) + "H1017.7z";
}, _o = function(e) {
  var r = e / 2;
  return "M400000 " + e + " H0 L" + r + " 0 l65 45 L145 " + (e - 80) + " H400000z";
}, Co = function(e, r, u) {
  var a = u - 54 - r - e;
  return "M702 " + (e + r) + "H400000" + (40 + e) + `
H742v` + a + `l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 ` + r + "H400000v" + (40 + e) + "H742z";
}, Eo = function(e, r, u) {
  r = 1e3 * r;
  var a = "";
  switch (e) {
    case "sqrtMain":
      a = yo(r, nt);
      break;
    case "sqrtSize1":
      a = ko(r, nt);
      break;
    case "sqrtSize2":
      a = wo(r, nt);
      break;
    case "sqrtSize3":
      a = Ao(r, nt);
      break;
    case "sqrtSize4":
      a = So(r, nt);
      break;
    case "sqrtTall":
      a = Co(r, nt, u);
  }
  return a;
}, Do = function(e, r) {
  switch (e) {
    case "⎜":
      return "M291 0 H417 V" + r + " H291z M291 0 H417 V" + r + " H291z";
    case "∣":
      return "M145 0 H188 V" + r + " H145z M145 0 H188 V" + r + " H145z";
    case "∥":
      return "M145 0 H188 V" + r + " H145z M145 0 H188 V" + r + " H145z" + ("M367 0 H410 V" + r + " H367z M367 0 H410 V" + r + " H367z");
    case "⎟":
      return "M457 0 H583 V" + r + " H457z M457 0 H583 V" + r + " H457z";
    case "⎢":
      return "M319 0 H403 V" + r + " H319z M319 0 H403 V" + r + " H319z";
    case "⎥":
      return "M263 0 H347 V" + r + " H263z M263 0 H347 V" + r + " H263z";
    case "⎪":
      return "M384 0 H504 V" + r + " H384z M384 0 H504 V" + r + " H384z";
    case "⏐":
      return "M312 0 H355 V" + r + " H312z M312 0 H355 V" + r + " H312z";
    case "‖":
      return "M257 0 H300 V" + r + " H257z M257 0 H300 V" + r + " H257z" + ("M478 0 H521 V" + r + " H478z M478 0 H521 V" + r + " H478z");
    default:
      return "";
  }
}, za = {
  // The doubleleftarrow geometry is from glyph U+21D0 in the font KaTeX Main
  doubleleftarrow: `M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,
  // doublerightarrow is from glyph U+21D2 in font KaTeX Main
  doublerightarrow: `M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,
  // leftarrow is from glyph U+2190 in font KaTeX Main
  leftarrow: `M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,
  // overbrace is from glyphs U+23A9/23A8/23A7 in font KaTeX_Size4-Regular
  leftbrace: `M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,
  leftbraceunder: `M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,
  // overgroup is from the MnSymbol package (public domain)
  leftgroup: `M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,
  leftgroupunder: `M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,
  // Harpoons are from glyph U+21BD in font KaTeX Main
  leftharpoon: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,
  leftharpoonplus: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,
  leftharpoondown: `M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,
  leftharpoondownplus: `M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,
  // hook is from glyph U+21A9 in font KaTeX Main
  lefthook: `M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,
  leftlinesegment: `M40 281 V428 H0 V94 H40 V241 H400000 v40z
M40 281 V428 H0 V94 H40 V241 H400000 v40z`,
  leftmapsto: `M40 281 V448H0V74H40V241H400000v40z
M40 281 V448H0V74H40V241H400000v40z`,
  // tofrom is from glyph U+21C4 in font KaTeX AMS Regular
  leftToFrom: `M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,
  longequal: `M0 50 h400000 v40H0z m0 194h40000v40H0z
M0 50 h400000 v40H0z m0 194h40000v40H0z`,
  midbrace: `M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,
  midbraceunder: `M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,
  oiintSize1: `M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,
  oiintSize2: `M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,
  oiiintSize1: `M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,
  oiiintSize2: `M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,
  rightarrow: `M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,
  rightbrace: `M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,
  rightbraceunder: `M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,
  rightgroup: `M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,
  rightgroupunder: `M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,
  rightharpoon: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,
  rightharpoonplus: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,
  rightharpoondown: `M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,
  rightharpoondownplus: `M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,
  righthook: `M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,
  rightlinesegment: `M399960 241 V94 h40 V428 h-40 V281 H0 v-40z
M399960 241 V94 h40 V428 h-40 V281 H0 v-40z`,
  rightToFrom: `M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,
  // twoheadleftarrow is from glyph U+219E in font KaTeX AMS Regular
  twoheadleftarrow: `M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,
  twoheadrightarrow: `M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,
  // tilde1 is a modified version of a glyph from the MnSymbol package
  tilde1: `M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,
  // ditto tilde2, tilde3, & tilde4
  tilde2: `M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,
  tilde3: `M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,
  tilde4: `M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,
  // vec is from glyph U+20D7 in font KaTeX Main
  vec: `M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,
  // widehat1 is a modified version of a glyph from the MnSymbol package
  widehat1: `M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,
  // ditto widehat2, widehat3, & widehat4
  widehat2: `M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  widehat3: `M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  widehat4: `M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  // widecheck paths are all inverted versions of widehat
  widecheck1: `M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,
  widecheck2: `M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  widecheck3: `M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  widecheck4: `M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  // The next ten paths support reaction arrows from the mhchem package.
  // Arrows for \ce{<-->} are offset from xAxis by 0.22ex, per mhchem in LaTeX
  // baraboveleftarrow is mostly from glyph U+2190 in font KaTeX Main
  baraboveleftarrow: `M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,
  // rightarrowabovebar is mostly from glyph U+2192, KaTeX Main
  rightarrowabovebar: `M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,
  // The short left harpoon has 0.5em (i.e. 500 units) kern on the left end.
  // Ref from mhchem.sty: \rlap{\raisebox{-.22ex}{$\kern0.5em
  baraboveshortleftharpoon: `M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,
  rightharpoonaboveshortbar: `M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,
  shortbaraboveleftharpoon: `M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,
  shortrightharpoonabovebar: `M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`
}, To = function(e, r) {
  switch (e) {
    case "lbrack":
      return "M403 1759 V84 H666 V0 H319 V1759 v" + r + ` v1759 h347 v-84
H403z M403 1759 V0 H319 V1759 v` + r + " v1759 h84z";
    case "rbrack":
      return "M347 1759 V0 H0 V84 H263 V1759 v" + r + ` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v` + r + " v1759 h84z";
    case "vert":
      return "M145 15 v585 v" + r + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -r + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` + r + " v585 h43z";
    case "doublevert":
      return "M145 15 v585 v" + r + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -r + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` + r + ` v585 h43z
M367 15 v585 v` + r + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -r + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v` + r + " v585 h43z";
    case "lfloor":
      return "M319 602 V0 H403 V602 v" + r + ` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v` + r + " v1715 H319z";
    case "rfloor":
      return "M319 602 V0 H403 V602 v" + r + ` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v` + r + " v1715 H319z";
    case "lceil":
      return "M403 1759 V84 H666 V0 H319 V1759 v" + r + ` v602 h84z
M403 1759 V0 H319 V1759 v` + r + " v602 h84z";
    case "rceil":
      return "M347 1759 V0 H0 V84 H263 V1759 v" + r + ` v602 h84z
M347 1759 V0 h-84 V1759 v` + r + " v602 h84z";
    case "lparen":
      return `M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,` + (r + 84) + `c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-` + (r + 92) + `c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`;
    case "rparen":
      return `M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,` + (r + 9) + `
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-` + (r + 144) + `c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`;
    default:
      throw new Error("Unknown stretchy delimiter.");
  }
};
class zt {
  // Never used; needed for satisfying interface.
  constructor(e) {
    this.children = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.children = e, this.classes = [], this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = {};
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  /** Convert the fragment into a node. */
  toNode() {
    for (var e = document.createDocumentFragment(), r = 0; r < this.children.length; r++)
      e.appendChild(this.children[r].toNode());
    return e;
  }
  /** Convert the fragment into HTML markup. */
  toMarkup() {
    for (var e = "", r = 0; r < this.children.length; r++)
      e += this.children[r].toMarkup();
    return e;
  }
  /**
   * Converts the math node into a string, similar to innerText. Applies to
   * MathDomNode's only.
   */
  toText() {
    var e = (r) => r.toText();
    return this.children.map(e).join("");
  }
}
var Ee = {
  "AMS-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.68889, 0, 0, 0.72222],
    66: [0, 0.68889, 0, 0, 0.66667],
    67: [0, 0.68889, 0, 0, 0.72222],
    68: [0, 0.68889, 0, 0, 0.72222],
    69: [0, 0.68889, 0, 0, 0.66667],
    70: [0, 0.68889, 0, 0, 0.61111],
    71: [0, 0.68889, 0, 0, 0.77778],
    72: [0, 0.68889, 0, 0, 0.77778],
    73: [0, 0.68889, 0, 0, 0.38889],
    74: [0.16667, 0.68889, 0, 0, 0.5],
    75: [0, 0.68889, 0, 0, 0.77778],
    76: [0, 0.68889, 0, 0, 0.66667],
    77: [0, 0.68889, 0, 0, 0.94445],
    78: [0, 0.68889, 0, 0, 0.72222],
    79: [0.16667, 0.68889, 0, 0, 0.77778],
    80: [0, 0.68889, 0, 0, 0.61111],
    81: [0.16667, 0.68889, 0, 0, 0.77778],
    82: [0, 0.68889, 0, 0, 0.72222],
    83: [0, 0.68889, 0, 0, 0.55556],
    84: [0, 0.68889, 0, 0, 0.66667],
    85: [0, 0.68889, 0, 0, 0.72222],
    86: [0, 0.68889, 0, 0, 0.72222],
    87: [0, 0.68889, 0, 0, 1],
    88: [0, 0.68889, 0, 0, 0.72222],
    89: [0, 0.68889, 0, 0, 0.72222],
    90: [0, 0.68889, 0, 0, 0.66667],
    107: [0, 0.68889, 0, 0, 0.55556],
    160: [0, 0, 0, 0, 0.25],
    165: [0, 0.675, 0.025, 0, 0.75],
    174: [0.15559, 0.69224, 0, 0, 0.94666],
    240: [0, 0.68889, 0, 0, 0.55556],
    295: [0, 0.68889, 0, 0, 0.54028],
    710: [0, 0.825, 0, 0, 2.33334],
    732: [0, 0.9, 0, 0, 2.33334],
    770: [0, 0.825, 0, 0, 2.33334],
    771: [0, 0.9, 0, 0, 2.33334],
    989: [0.08167, 0.58167, 0, 0, 0.77778],
    1008: [0, 0.43056, 0.04028, 0, 0.66667],
    8245: [0, 0.54986, 0, 0, 0.275],
    8463: [0, 0.68889, 0, 0, 0.54028],
    8487: [0, 0.68889, 0, 0, 0.72222],
    8498: [0, 0.68889, 0, 0, 0.55556],
    8502: [0, 0.68889, 0, 0, 0.66667],
    8503: [0, 0.68889, 0, 0, 0.44445],
    8504: [0, 0.68889, 0, 0, 0.66667],
    8513: [0, 0.68889, 0, 0, 0.63889],
    8592: [-0.03598, 0.46402, 0, 0, 0.5],
    8594: [-0.03598, 0.46402, 0, 0, 0.5],
    8602: [-0.13313, 0.36687, 0, 0, 1],
    8603: [-0.13313, 0.36687, 0, 0, 1],
    8606: [0.01354, 0.52239, 0, 0, 1],
    8608: [0.01354, 0.52239, 0, 0, 1],
    8610: [0.01354, 0.52239, 0, 0, 1.11111],
    8611: [0.01354, 0.52239, 0, 0, 1.11111],
    8619: [0, 0.54986, 0, 0, 1],
    8620: [0, 0.54986, 0, 0, 1],
    8621: [-0.13313, 0.37788, 0, 0, 1.38889],
    8622: [-0.13313, 0.36687, 0, 0, 1],
    8624: [0, 0.69224, 0, 0, 0.5],
    8625: [0, 0.69224, 0, 0, 0.5],
    8630: [0, 0.43056, 0, 0, 1],
    8631: [0, 0.43056, 0, 0, 1],
    8634: [0.08198, 0.58198, 0, 0, 0.77778],
    8635: [0.08198, 0.58198, 0, 0, 0.77778],
    8638: [0.19444, 0.69224, 0, 0, 0.41667],
    8639: [0.19444, 0.69224, 0, 0, 0.41667],
    8642: [0.19444, 0.69224, 0, 0, 0.41667],
    8643: [0.19444, 0.69224, 0, 0, 0.41667],
    8644: [0.1808, 0.675, 0, 0, 1],
    8646: [0.1808, 0.675, 0, 0, 1],
    8647: [0.1808, 0.675, 0, 0, 1],
    8648: [0.19444, 0.69224, 0, 0, 0.83334],
    8649: [0.1808, 0.675, 0, 0, 1],
    8650: [0.19444, 0.69224, 0, 0, 0.83334],
    8651: [0.01354, 0.52239, 0, 0, 1],
    8652: [0.01354, 0.52239, 0, 0, 1],
    8653: [-0.13313, 0.36687, 0, 0, 1],
    8654: [-0.13313, 0.36687, 0, 0, 1],
    8655: [-0.13313, 0.36687, 0, 0, 1],
    8666: [0.13667, 0.63667, 0, 0, 1],
    8667: [0.13667, 0.63667, 0, 0, 1],
    8669: [-0.13313, 0.37788, 0, 0, 1],
    8672: [-0.064, 0.437, 0, 0, 1.334],
    8674: [-0.064, 0.437, 0, 0, 1.334],
    8705: [0, 0.825, 0, 0, 0.5],
    8708: [0, 0.68889, 0, 0, 0.55556],
    8709: [0.08167, 0.58167, 0, 0, 0.77778],
    8717: [0, 0.43056, 0, 0, 0.42917],
    8722: [-0.03598, 0.46402, 0, 0, 0.5],
    8724: [0.08198, 0.69224, 0, 0, 0.77778],
    8726: [0.08167, 0.58167, 0, 0, 0.77778],
    8733: [0, 0.69224, 0, 0, 0.77778],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8737: [0, 0.69224, 0, 0, 0.72222],
    8738: [0.03517, 0.52239, 0, 0, 0.72222],
    8739: [0.08167, 0.58167, 0, 0, 0.22222],
    8740: [0.25142, 0.74111, 0, 0, 0.27778],
    8741: [0.08167, 0.58167, 0, 0, 0.38889],
    8742: [0.25142, 0.74111, 0, 0, 0.5],
    8756: [0, 0.69224, 0, 0, 0.66667],
    8757: [0, 0.69224, 0, 0, 0.66667],
    8764: [-0.13313, 0.36687, 0, 0, 0.77778],
    8765: [-0.13313, 0.37788, 0, 0, 0.77778],
    8769: [-0.13313, 0.36687, 0, 0, 0.77778],
    8770: [-0.03625, 0.46375, 0, 0, 0.77778],
    8774: [0.30274, 0.79383, 0, 0, 0.77778],
    8776: [-0.01688, 0.48312, 0, 0, 0.77778],
    8778: [0.08167, 0.58167, 0, 0, 0.77778],
    8782: [0.06062, 0.54986, 0, 0, 0.77778],
    8783: [0.06062, 0.54986, 0, 0, 0.77778],
    8785: [0.08198, 0.58198, 0, 0, 0.77778],
    8786: [0.08198, 0.58198, 0, 0, 0.77778],
    8787: [0.08198, 0.58198, 0, 0, 0.77778],
    8790: [0, 0.69224, 0, 0, 0.77778],
    8791: [0.22958, 0.72958, 0, 0, 0.77778],
    8796: [0.08198, 0.91667, 0, 0, 0.77778],
    8806: [0.25583, 0.75583, 0, 0, 0.77778],
    8807: [0.25583, 0.75583, 0, 0, 0.77778],
    8808: [0.25142, 0.75726, 0, 0, 0.77778],
    8809: [0.25142, 0.75726, 0, 0, 0.77778],
    8812: [0.25583, 0.75583, 0, 0, 0.5],
    8814: [0.20576, 0.70576, 0, 0, 0.77778],
    8815: [0.20576, 0.70576, 0, 0, 0.77778],
    8816: [0.30274, 0.79383, 0, 0, 0.77778],
    8817: [0.30274, 0.79383, 0, 0, 0.77778],
    8818: [0.22958, 0.72958, 0, 0, 0.77778],
    8819: [0.22958, 0.72958, 0, 0, 0.77778],
    8822: [0.1808, 0.675, 0, 0, 0.77778],
    8823: [0.1808, 0.675, 0, 0, 0.77778],
    8828: [0.13667, 0.63667, 0, 0, 0.77778],
    8829: [0.13667, 0.63667, 0, 0, 0.77778],
    8830: [0.22958, 0.72958, 0, 0, 0.77778],
    8831: [0.22958, 0.72958, 0, 0, 0.77778],
    8832: [0.20576, 0.70576, 0, 0, 0.77778],
    8833: [0.20576, 0.70576, 0, 0, 0.77778],
    8840: [0.30274, 0.79383, 0, 0, 0.77778],
    8841: [0.30274, 0.79383, 0, 0, 0.77778],
    8842: [0.13597, 0.63597, 0, 0, 0.77778],
    8843: [0.13597, 0.63597, 0, 0, 0.77778],
    8847: [0.03517, 0.54986, 0, 0, 0.77778],
    8848: [0.03517, 0.54986, 0, 0, 0.77778],
    8858: [0.08198, 0.58198, 0, 0, 0.77778],
    8859: [0.08198, 0.58198, 0, 0, 0.77778],
    8861: [0.08198, 0.58198, 0, 0, 0.77778],
    8862: [0, 0.675, 0, 0, 0.77778],
    8863: [0, 0.675, 0, 0, 0.77778],
    8864: [0, 0.675, 0, 0, 0.77778],
    8865: [0, 0.675, 0, 0, 0.77778],
    8872: [0, 0.69224, 0, 0, 0.61111],
    8873: [0, 0.69224, 0, 0, 0.72222],
    8874: [0, 0.69224, 0, 0, 0.88889],
    8876: [0, 0.68889, 0, 0, 0.61111],
    8877: [0, 0.68889, 0, 0, 0.61111],
    8878: [0, 0.68889, 0, 0, 0.72222],
    8879: [0, 0.68889, 0, 0, 0.72222],
    8882: [0.03517, 0.54986, 0, 0, 0.77778],
    8883: [0.03517, 0.54986, 0, 0, 0.77778],
    8884: [0.13667, 0.63667, 0, 0, 0.77778],
    8885: [0.13667, 0.63667, 0, 0, 0.77778],
    8888: [0, 0.54986, 0, 0, 1.11111],
    8890: [0.19444, 0.43056, 0, 0, 0.55556],
    8891: [0.19444, 0.69224, 0, 0, 0.61111],
    8892: [0.19444, 0.69224, 0, 0, 0.61111],
    8901: [0, 0.54986, 0, 0, 0.27778],
    8903: [0.08167, 0.58167, 0, 0, 0.77778],
    8905: [0.08167, 0.58167, 0, 0, 0.77778],
    8906: [0.08167, 0.58167, 0, 0, 0.77778],
    8907: [0, 0.69224, 0, 0, 0.77778],
    8908: [0, 0.69224, 0, 0, 0.77778],
    8909: [-0.03598, 0.46402, 0, 0, 0.77778],
    8910: [0, 0.54986, 0, 0, 0.76042],
    8911: [0, 0.54986, 0, 0, 0.76042],
    8912: [0.03517, 0.54986, 0, 0, 0.77778],
    8913: [0.03517, 0.54986, 0, 0, 0.77778],
    8914: [0, 0.54986, 0, 0, 0.66667],
    8915: [0, 0.54986, 0, 0, 0.66667],
    8916: [0, 0.69224, 0, 0, 0.66667],
    8918: [0.0391, 0.5391, 0, 0, 0.77778],
    8919: [0.0391, 0.5391, 0, 0, 0.77778],
    8920: [0.03517, 0.54986, 0, 0, 1.33334],
    8921: [0.03517, 0.54986, 0, 0, 1.33334],
    8922: [0.38569, 0.88569, 0, 0, 0.77778],
    8923: [0.38569, 0.88569, 0, 0, 0.77778],
    8926: [0.13667, 0.63667, 0, 0, 0.77778],
    8927: [0.13667, 0.63667, 0, 0, 0.77778],
    8928: [0.30274, 0.79383, 0, 0, 0.77778],
    8929: [0.30274, 0.79383, 0, 0, 0.77778],
    8934: [0.23222, 0.74111, 0, 0, 0.77778],
    8935: [0.23222, 0.74111, 0, 0, 0.77778],
    8936: [0.23222, 0.74111, 0, 0, 0.77778],
    8937: [0.23222, 0.74111, 0, 0, 0.77778],
    8938: [0.20576, 0.70576, 0, 0, 0.77778],
    8939: [0.20576, 0.70576, 0, 0, 0.77778],
    8940: [0.30274, 0.79383, 0, 0, 0.77778],
    8941: [0.30274, 0.79383, 0, 0, 0.77778],
    8994: [0.19444, 0.69224, 0, 0, 0.77778],
    8995: [0.19444, 0.69224, 0, 0, 0.77778],
    9416: [0.15559, 0.69224, 0, 0, 0.90222],
    9484: [0, 0.69224, 0, 0, 0.5],
    9488: [0, 0.69224, 0, 0, 0.5],
    9492: [0, 0.37788, 0, 0, 0.5],
    9496: [0, 0.37788, 0, 0, 0.5],
    9585: [0.19444, 0.68889, 0, 0, 0.88889],
    9586: [0.19444, 0.74111, 0, 0, 0.88889],
    9632: [0, 0.675, 0, 0, 0.77778],
    9633: [0, 0.675, 0, 0, 0.77778],
    9650: [0, 0.54986, 0, 0, 0.72222],
    9651: [0, 0.54986, 0, 0, 0.72222],
    9654: [0.03517, 0.54986, 0, 0, 0.77778],
    9660: [0, 0.54986, 0, 0, 0.72222],
    9661: [0, 0.54986, 0, 0, 0.72222],
    9664: [0.03517, 0.54986, 0, 0, 0.77778],
    9674: [0.11111, 0.69224, 0, 0, 0.66667],
    9733: [0.19444, 0.69224, 0, 0, 0.94445],
    10003: [0, 0.69224, 0, 0, 0.83334],
    10016: [0, 0.69224, 0, 0, 0.83334],
    10731: [0.11111, 0.69224, 0, 0, 0.66667],
    10846: [0.19444, 0.75583, 0, 0, 0.61111],
    10877: [0.13667, 0.63667, 0, 0, 0.77778],
    10878: [0.13667, 0.63667, 0, 0, 0.77778],
    10885: [0.25583, 0.75583, 0, 0, 0.77778],
    10886: [0.25583, 0.75583, 0, 0, 0.77778],
    10887: [0.13597, 0.63597, 0, 0, 0.77778],
    10888: [0.13597, 0.63597, 0, 0, 0.77778],
    10889: [0.26167, 0.75726, 0, 0, 0.77778],
    10890: [0.26167, 0.75726, 0, 0, 0.77778],
    10891: [0.48256, 0.98256, 0, 0, 0.77778],
    10892: [0.48256, 0.98256, 0, 0, 0.77778],
    10901: [0.13667, 0.63667, 0, 0, 0.77778],
    10902: [0.13667, 0.63667, 0, 0, 0.77778],
    10933: [0.25142, 0.75726, 0, 0, 0.77778],
    10934: [0.25142, 0.75726, 0, 0, 0.77778],
    10935: [0.26167, 0.75726, 0, 0, 0.77778],
    10936: [0.26167, 0.75726, 0, 0, 0.77778],
    10937: [0.26167, 0.75726, 0, 0, 0.77778],
    10938: [0.26167, 0.75726, 0, 0, 0.77778],
    10949: [0.25583, 0.75583, 0, 0, 0.77778],
    10950: [0.25583, 0.75583, 0, 0, 0.77778],
    10955: [0.28481, 0.79383, 0, 0, 0.77778],
    10956: [0.28481, 0.79383, 0, 0, 0.77778],
    57350: [0.08167, 0.58167, 0, 0, 0.22222],
    57351: [0.08167, 0.58167, 0, 0, 0.38889],
    57352: [0.08167, 0.58167, 0, 0, 0.77778],
    57353: [0, 0.43056, 0.04028, 0, 0.66667],
    57356: [0.25142, 0.75726, 0, 0, 0.77778],
    57357: [0.25142, 0.75726, 0, 0, 0.77778],
    57358: [0.41951, 0.91951, 0, 0, 0.77778],
    57359: [0.30274, 0.79383, 0, 0, 0.77778],
    57360: [0.30274, 0.79383, 0, 0, 0.77778],
    57361: [0.41951, 0.91951, 0, 0, 0.77778],
    57366: [0.25142, 0.75726, 0, 0, 0.77778],
    57367: [0.25142, 0.75726, 0, 0, 0.77778],
    57368: [0.25142, 0.75726, 0, 0, 0.77778],
    57369: [0.25142, 0.75726, 0, 0, 0.77778],
    57370: [0.13597, 0.63597, 0, 0, 0.77778],
    57371: [0.13597, 0.63597, 0, 0, 0.77778]
  },
  "Caligraphic-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.68333, 0, 0.19445, 0.79847],
    66: [0, 0.68333, 0.03041, 0.13889, 0.65681],
    67: [0, 0.68333, 0.05834, 0.13889, 0.52653],
    68: [0, 0.68333, 0.02778, 0.08334, 0.77139],
    69: [0, 0.68333, 0.08944, 0.11111, 0.52778],
    70: [0, 0.68333, 0.09931, 0.11111, 0.71875],
    71: [0.09722, 0.68333, 0.0593, 0.11111, 0.59487],
    72: [0, 0.68333, 965e-5, 0.11111, 0.84452],
    73: [0, 0.68333, 0.07382, 0, 0.54452],
    74: [0.09722, 0.68333, 0.18472, 0.16667, 0.67778],
    75: [0, 0.68333, 0.01445, 0.05556, 0.76195],
    76: [0, 0.68333, 0, 0.13889, 0.68972],
    77: [0, 0.68333, 0, 0.13889, 1.2009],
    78: [0, 0.68333, 0.14736, 0.08334, 0.82049],
    79: [0, 0.68333, 0.02778, 0.11111, 0.79611],
    80: [0, 0.68333, 0.08222, 0.08334, 0.69556],
    81: [0.09722, 0.68333, 0, 0.11111, 0.81667],
    82: [0, 0.68333, 0, 0.08334, 0.8475],
    83: [0, 0.68333, 0.075, 0.13889, 0.60556],
    84: [0, 0.68333, 0.25417, 0, 0.54464],
    85: [0, 0.68333, 0.09931, 0.08334, 0.62583],
    86: [0, 0.68333, 0.08222, 0, 0.61278],
    87: [0, 0.68333, 0.08222, 0.08334, 0.98778],
    88: [0, 0.68333, 0.14643, 0.13889, 0.7133],
    89: [0.09722, 0.68333, 0.08222, 0.08334, 0.66834],
    90: [0, 0.68333, 0.07944, 0.13889, 0.72473],
    160: [0, 0, 0, 0, 0.25]
  },
  "Fraktur-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69141, 0, 0, 0.29574],
    34: [0, 0.69141, 0, 0, 0.21471],
    38: [0, 0.69141, 0, 0, 0.73786],
    39: [0, 0.69141, 0, 0, 0.21201],
    40: [0.24982, 0.74947, 0, 0, 0.38865],
    41: [0.24982, 0.74947, 0, 0, 0.38865],
    42: [0, 0.62119, 0, 0, 0.27764],
    43: [0.08319, 0.58283, 0, 0, 0.75623],
    44: [0, 0.10803, 0, 0, 0.27764],
    45: [0.08319, 0.58283, 0, 0, 0.75623],
    46: [0, 0.10803, 0, 0, 0.27764],
    47: [0.24982, 0.74947, 0, 0, 0.50181],
    48: [0, 0.47534, 0, 0, 0.50181],
    49: [0, 0.47534, 0, 0, 0.50181],
    50: [0, 0.47534, 0, 0, 0.50181],
    51: [0.18906, 0.47534, 0, 0, 0.50181],
    52: [0.18906, 0.47534, 0, 0, 0.50181],
    53: [0.18906, 0.47534, 0, 0, 0.50181],
    54: [0, 0.69141, 0, 0, 0.50181],
    55: [0.18906, 0.47534, 0, 0, 0.50181],
    56: [0, 0.69141, 0, 0, 0.50181],
    57: [0.18906, 0.47534, 0, 0, 0.50181],
    58: [0, 0.47534, 0, 0, 0.21606],
    59: [0.12604, 0.47534, 0, 0, 0.21606],
    61: [-0.13099, 0.36866, 0, 0, 0.75623],
    63: [0, 0.69141, 0, 0, 0.36245],
    65: [0, 0.69141, 0, 0, 0.7176],
    66: [0, 0.69141, 0, 0, 0.88397],
    67: [0, 0.69141, 0, 0, 0.61254],
    68: [0, 0.69141, 0, 0, 0.83158],
    69: [0, 0.69141, 0, 0, 0.66278],
    70: [0.12604, 0.69141, 0, 0, 0.61119],
    71: [0, 0.69141, 0, 0, 0.78539],
    72: [0.06302, 0.69141, 0, 0, 0.7203],
    73: [0, 0.69141, 0, 0, 0.55448],
    74: [0.12604, 0.69141, 0, 0, 0.55231],
    75: [0, 0.69141, 0, 0, 0.66845],
    76: [0, 0.69141, 0, 0, 0.66602],
    77: [0, 0.69141, 0, 0, 1.04953],
    78: [0, 0.69141, 0, 0, 0.83212],
    79: [0, 0.69141, 0, 0, 0.82699],
    80: [0.18906, 0.69141, 0, 0, 0.82753],
    81: [0.03781, 0.69141, 0, 0, 0.82699],
    82: [0, 0.69141, 0, 0, 0.82807],
    83: [0, 0.69141, 0, 0, 0.82861],
    84: [0, 0.69141, 0, 0, 0.66899],
    85: [0, 0.69141, 0, 0, 0.64576],
    86: [0, 0.69141, 0, 0, 0.83131],
    87: [0, 0.69141, 0, 0, 1.04602],
    88: [0, 0.69141, 0, 0, 0.71922],
    89: [0.18906, 0.69141, 0, 0, 0.83293],
    90: [0.12604, 0.69141, 0, 0, 0.60201],
    91: [0.24982, 0.74947, 0, 0, 0.27764],
    93: [0.24982, 0.74947, 0, 0, 0.27764],
    94: [0, 0.69141, 0, 0, 0.49965],
    97: [0, 0.47534, 0, 0, 0.50046],
    98: [0, 0.69141, 0, 0, 0.51315],
    99: [0, 0.47534, 0, 0, 0.38946],
    100: [0, 0.62119, 0, 0, 0.49857],
    101: [0, 0.47534, 0, 0, 0.40053],
    102: [0.18906, 0.69141, 0, 0, 0.32626],
    103: [0.18906, 0.47534, 0, 0, 0.5037],
    104: [0.18906, 0.69141, 0, 0, 0.52126],
    105: [0, 0.69141, 0, 0, 0.27899],
    106: [0, 0.69141, 0, 0, 0.28088],
    107: [0, 0.69141, 0, 0, 0.38946],
    108: [0, 0.69141, 0, 0, 0.27953],
    109: [0, 0.47534, 0, 0, 0.76676],
    110: [0, 0.47534, 0, 0, 0.52666],
    111: [0, 0.47534, 0, 0, 0.48885],
    112: [0.18906, 0.52396, 0, 0, 0.50046],
    113: [0.18906, 0.47534, 0, 0, 0.48912],
    114: [0, 0.47534, 0, 0, 0.38919],
    115: [0, 0.47534, 0, 0, 0.44266],
    116: [0, 0.62119, 0, 0, 0.33301],
    117: [0, 0.47534, 0, 0, 0.5172],
    118: [0, 0.52396, 0, 0, 0.5118],
    119: [0, 0.52396, 0, 0, 0.77351],
    120: [0.18906, 0.47534, 0, 0, 0.38865],
    121: [0.18906, 0.47534, 0, 0, 0.49884],
    122: [0.18906, 0.47534, 0, 0, 0.39054],
    160: [0, 0, 0, 0, 0.25],
    8216: [0, 0.69141, 0, 0, 0.21471],
    8217: [0, 0.69141, 0, 0, 0.21471],
    58112: [0, 0.62119, 0, 0, 0.49749],
    58113: [0, 0.62119, 0, 0, 0.4983],
    58114: [0.18906, 0.69141, 0, 0, 0.33328],
    58115: [0.18906, 0.69141, 0, 0, 0.32923],
    58116: [0.18906, 0.47534, 0, 0, 0.50343],
    58117: [0, 0.69141, 0, 0, 0.33301],
    58118: [0, 0.62119, 0, 0, 0.33409],
    58119: [0, 0.47534, 0, 0, 0.50073]
  },
  "Main-Bold": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.35],
    34: [0, 0.69444, 0, 0, 0.60278],
    35: [0.19444, 0.69444, 0, 0, 0.95833],
    36: [0.05556, 0.75, 0, 0, 0.575],
    37: [0.05556, 0.75, 0, 0, 0.95833],
    38: [0, 0.69444, 0, 0, 0.89444],
    39: [0, 0.69444, 0, 0, 0.31944],
    40: [0.25, 0.75, 0, 0, 0.44722],
    41: [0.25, 0.75, 0, 0, 0.44722],
    42: [0, 0.75, 0, 0, 0.575],
    43: [0.13333, 0.63333, 0, 0, 0.89444],
    44: [0.19444, 0.15556, 0, 0, 0.31944],
    45: [0, 0.44444, 0, 0, 0.38333],
    46: [0, 0.15556, 0, 0, 0.31944],
    47: [0.25, 0.75, 0, 0, 0.575],
    48: [0, 0.64444, 0, 0, 0.575],
    49: [0, 0.64444, 0, 0, 0.575],
    50: [0, 0.64444, 0, 0, 0.575],
    51: [0, 0.64444, 0, 0, 0.575],
    52: [0, 0.64444, 0, 0, 0.575],
    53: [0, 0.64444, 0, 0, 0.575],
    54: [0, 0.64444, 0, 0, 0.575],
    55: [0, 0.64444, 0, 0, 0.575],
    56: [0, 0.64444, 0, 0, 0.575],
    57: [0, 0.64444, 0, 0, 0.575],
    58: [0, 0.44444, 0, 0, 0.31944],
    59: [0.19444, 0.44444, 0, 0, 0.31944],
    60: [0.08556, 0.58556, 0, 0, 0.89444],
    61: [-0.10889, 0.39111, 0, 0, 0.89444],
    62: [0.08556, 0.58556, 0, 0, 0.89444],
    63: [0, 0.69444, 0, 0, 0.54305],
    64: [0, 0.69444, 0, 0, 0.89444],
    65: [0, 0.68611, 0, 0, 0.86944],
    66: [0, 0.68611, 0, 0, 0.81805],
    67: [0, 0.68611, 0, 0, 0.83055],
    68: [0, 0.68611, 0, 0, 0.88194],
    69: [0, 0.68611, 0, 0, 0.75555],
    70: [0, 0.68611, 0, 0, 0.72361],
    71: [0, 0.68611, 0, 0, 0.90416],
    72: [0, 0.68611, 0, 0, 0.9],
    73: [0, 0.68611, 0, 0, 0.43611],
    74: [0, 0.68611, 0, 0, 0.59444],
    75: [0, 0.68611, 0, 0, 0.90138],
    76: [0, 0.68611, 0, 0, 0.69166],
    77: [0, 0.68611, 0, 0, 1.09166],
    78: [0, 0.68611, 0, 0, 0.9],
    79: [0, 0.68611, 0, 0, 0.86388],
    80: [0, 0.68611, 0, 0, 0.78611],
    81: [0.19444, 0.68611, 0, 0, 0.86388],
    82: [0, 0.68611, 0, 0, 0.8625],
    83: [0, 0.68611, 0, 0, 0.63889],
    84: [0, 0.68611, 0, 0, 0.8],
    85: [0, 0.68611, 0, 0, 0.88472],
    86: [0, 0.68611, 0.01597, 0, 0.86944],
    87: [0, 0.68611, 0.01597, 0, 1.18888],
    88: [0, 0.68611, 0, 0, 0.86944],
    89: [0, 0.68611, 0.02875, 0, 0.86944],
    90: [0, 0.68611, 0, 0, 0.70277],
    91: [0.25, 0.75, 0, 0, 0.31944],
    92: [0.25, 0.75, 0, 0, 0.575],
    93: [0.25, 0.75, 0, 0, 0.31944],
    94: [0, 0.69444, 0, 0, 0.575],
    95: [0.31, 0.13444, 0.03194, 0, 0.575],
    97: [0, 0.44444, 0, 0, 0.55902],
    98: [0, 0.69444, 0, 0, 0.63889],
    99: [0, 0.44444, 0, 0, 0.51111],
    100: [0, 0.69444, 0, 0, 0.63889],
    101: [0, 0.44444, 0, 0, 0.52708],
    102: [0, 0.69444, 0.10903, 0, 0.35139],
    103: [0.19444, 0.44444, 0.01597, 0, 0.575],
    104: [0, 0.69444, 0, 0, 0.63889],
    105: [0, 0.69444, 0, 0, 0.31944],
    106: [0.19444, 0.69444, 0, 0, 0.35139],
    107: [0, 0.69444, 0, 0, 0.60694],
    108: [0, 0.69444, 0, 0, 0.31944],
    109: [0, 0.44444, 0, 0, 0.95833],
    110: [0, 0.44444, 0, 0, 0.63889],
    111: [0, 0.44444, 0, 0, 0.575],
    112: [0.19444, 0.44444, 0, 0, 0.63889],
    113: [0.19444, 0.44444, 0, 0, 0.60694],
    114: [0, 0.44444, 0, 0, 0.47361],
    115: [0, 0.44444, 0, 0, 0.45361],
    116: [0, 0.63492, 0, 0, 0.44722],
    117: [0, 0.44444, 0, 0, 0.63889],
    118: [0, 0.44444, 0.01597, 0, 0.60694],
    119: [0, 0.44444, 0.01597, 0, 0.83055],
    120: [0, 0.44444, 0, 0, 0.60694],
    121: [0.19444, 0.44444, 0.01597, 0, 0.60694],
    122: [0, 0.44444, 0, 0, 0.51111],
    123: [0.25, 0.75, 0, 0, 0.575],
    124: [0.25, 0.75, 0, 0, 0.31944],
    125: [0.25, 0.75, 0, 0, 0.575],
    126: [0.35, 0.34444, 0, 0, 0.575],
    160: [0, 0, 0, 0, 0.25],
    163: [0, 0.69444, 0, 0, 0.86853],
    168: [0, 0.69444, 0, 0, 0.575],
    172: [0, 0.44444, 0, 0, 0.76666],
    176: [0, 0.69444, 0, 0, 0.86944],
    177: [0.13333, 0.63333, 0, 0, 0.89444],
    184: [0.17014, 0, 0, 0, 0.51111],
    198: [0, 0.68611, 0, 0, 1.04166],
    215: [0.13333, 0.63333, 0, 0, 0.89444],
    216: [0.04861, 0.73472, 0, 0, 0.89444],
    223: [0, 0.69444, 0, 0, 0.59722],
    230: [0, 0.44444, 0, 0, 0.83055],
    247: [0.13333, 0.63333, 0, 0, 0.89444],
    248: [0.09722, 0.54167, 0, 0, 0.575],
    305: [0, 0.44444, 0, 0, 0.31944],
    338: [0, 0.68611, 0, 0, 1.16944],
    339: [0, 0.44444, 0, 0, 0.89444],
    567: [0.19444, 0.44444, 0, 0, 0.35139],
    710: [0, 0.69444, 0, 0, 0.575],
    711: [0, 0.63194, 0, 0, 0.575],
    713: [0, 0.59611, 0, 0, 0.575],
    714: [0, 0.69444, 0, 0, 0.575],
    715: [0, 0.69444, 0, 0, 0.575],
    728: [0, 0.69444, 0, 0, 0.575],
    729: [0, 0.69444, 0, 0, 0.31944],
    730: [0, 0.69444, 0, 0, 0.86944],
    732: [0, 0.69444, 0, 0, 0.575],
    733: [0, 0.69444, 0, 0, 0.575],
    915: [0, 0.68611, 0, 0, 0.69166],
    916: [0, 0.68611, 0, 0, 0.95833],
    920: [0, 0.68611, 0, 0, 0.89444],
    923: [0, 0.68611, 0, 0, 0.80555],
    926: [0, 0.68611, 0, 0, 0.76666],
    928: [0, 0.68611, 0, 0, 0.9],
    931: [0, 0.68611, 0, 0, 0.83055],
    933: [0, 0.68611, 0, 0, 0.89444],
    934: [0, 0.68611, 0, 0, 0.83055],
    936: [0, 0.68611, 0, 0, 0.89444],
    937: [0, 0.68611, 0, 0, 0.83055],
    8211: [0, 0.44444, 0.03194, 0, 0.575],
    8212: [0, 0.44444, 0.03194, 0, 1.14999],
    8216: [0, 0.69444, 0, 0, 0.31944],
    8217: [0, 0.69444, 0, 0, 0.31944],
    8220: [0, 0.69444, 0, 0, 0.60278],
    8221: [0, 0.69444, 0, 0, 0.60278],
    8224: [0.19444, 0.69444, 0, 0, 0.51111],
    8225: [0.19444, 0.69444, 0, 0, 0.51111],
    8242: [0, 0.55556, 0, 0, 0.34444],
    8407: [0, 0.72444, 0.15486, 0, 0.575],
    8463: [0, 0.69444, 0, 0, 0.66759],
    8465: [0, 0.69444, 0, 0, 0.83055],
    8467: [0, 0.69444, 0, 0, 0.47361],
    8472: [0.19444, 0.44444, 0, 0, 0.74027],
    8476: [0, 0.69444, 0, 0, 0.83055],
    8501: [0, 0.69444, 0, 0, 0.70277],
    8592: [-0.10889, 0.39111, 0, 0, 1.14999],
    8593: [0.19444, 0.69444, 0, 0, 0.575],
    8594: [-0.10889, 0.39111, 0, 0, 1.14999],
    8595: [0.19444, 0.69444, 0, 0, 0.575],
    8596: [-0.10889, 0.39111, 0, 0, 1.14999],
    8597: [0.25, 0.75, 0, 0, 0.575],
    8598: [0.19444, 0.69444, 0, 0, 1.14999],
    8599: [0.19444, 0.69444, 0, 0, 1.14999],
    8600: [0.19444, 0.69444, 0, 0, 1.14999],
    8601: [0.19444, 0.69444, 0, 0, 1.14999],
    8636: [-0.10889, 0.39111, 0, 0, 1.14999],
    8637: [-0.10889, 0.39111, 0, 0, 1.14999],
    8640: [-0.10889, 0.39111, 0, 0, 1.14999],
    8641: [-0.10889, 0.39111, 0, 0, 1.14999],
    8656: [-0.10889, 0.39111, 0, 0, 1.14999],
    8657: [0.19444, 0.69444, 0, 0, 0.70277],
    8658: [-0.10889, 0.39111, 0, 0, 1.14999],
    8659: [0.19444, 0.69444, 0, 0, 0.70277],
    8660: [-0.10889, 0.39111, 0, 0, 1.14999],
    8661: [0.25, 0.75, 0, 0, 0.70277],
    8704: [0, 0.69444, 0, 0, 0.63889],
    8706: [0, 0.69444, 0.06389, 0, 0.62847],
    8707: [0, 0.69444, 0, 0, 0.63889],
    8709: [0.05556, 0.75, 0, 0, 0.575],
    8711: [0, 0.68611, 0, 0, 0.95833],
    8712: [0.08556, 0.58556, 0, 0, 0.76666],
    8715: [0.08556, 0.58556, 0, 0, 0.76666],
    8722: [0.13333, 0.63333, 0, 0, 0.89444],
    8723: [0.13333, 0.63333, 0, 0, 0.89444],
    8725: [0.25, 0.75, 0, 0, 0.575],
    8726: [0.25, 0.75, 0, 0, 0.575],
    8727: [-0.02778, 0.47222, 0, 0, 0.575],
    8728: [-0.02639, 0.47361, 0, 0, 0.575],
    8729: [-0.02639, 0.47361, 0, 0, 0.575],
    8730: [0.18, 0.82, 0, 0, 0.95833],
    8733: [0, 0.44444, 0, 0, 0.89444],
    8734: [0, 0.44444, 0, 0, 1.14999],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8739: [0.25, 0.75, 0, 0, 0.31944],
    8741: [0.25, 0.75, 0, 0, 0.575],
    8743: [0, 0.55556, 0, 0, 0.76666],
    8744: [0, 0.55556, 0, 0, 0.76666],
    8745: [0, 0.55556, 0, 0, 0.76666],
    8746: [0, 0.55556, 0, 0, 0.76666],
    8747: [0.19444, 0.69444, 0.12778, 0, 0.56875],
    8764: [-0.10889, 0.39111, 0, 0, 0.89444],
    8768: [0.19444, 0.69444, 0, 0, 0.31944],
    8771: [222e-5, 0.50222, 0, 0, 0.89444],
    8773: [0.027, 0.638, 0, 0, 0.894],
    8776: [0.02444, 0.52444, 0, 0, 0.89444],
    8781: [222e-5, 0.50222, 0, 0, 0.89444],
    8801: [222e-5, 0.50222, 0, 0, 0.89444],
    8804: [0.19667, 0.69667, 0, 0, 0.89444],
    8805: [0.19667, 0.69667, 0, 0, 0.89444],
    8810: [0.08556, 0.58556, 0, 0, 1.14999],
    8811: [0.08556, 0.58556, 0, 0, 1.14999],
    8826: [0.08556, 0.58556, 0, 0, 0.89444],
    8827: [0.08556, 0.58556, 0, 0, 0.89444],
    8834: [0.08556, 0.58556, 0, 0, 0.89444],
    8835: [0.08556, 0.58556, 0, 0, 0.89444],
    8838: [0.19667, 0.69667, 0, 0, 0.89444],
    8839: [0.19667, 0.69667, 0, 0, 0.89444],
    8846: [0, 0.55556, 0, 0, 0.76666],
    8849: [0.19667, 0.69667, 0, 0, 0.89444],
    8850: [0.19667, 0.69667, 0, 0, 0.89444],
    8851: [0, 0.55556, 0, 0, 0.76666],
    8852: [0, 0.55556, 0, 0, 0.76666],
    8853: [0.13333, 0.63333, 0, 0, 0.89444],
    8854: [0.13333, 0.63333, 0, 0, 0.89444],
    8855: [0.13333, 0.63333, 0, 0, 0.89444],
    8856: [0.13333, 0.63333, 0, 0, 0.89444],
    8857: [0.13333, 0.63333, 0, 0, 0.89444],
    8866: [0, 0.69444, 0, 0, 0.70277],
    8867: [0, 0.69444, 0, 0, 0.70277],
    8868: [0, 0.69444, 0, 0, 0.89444],
    8869: [0, 0.69444, 0, 0, 0.89444],
    8900: [-0.02639, 0.47361, 0, 0, 0.575],
    8901: [-0.02639, 0.47361, 0, 0, 0.31944],
    8902: [-0.02778, 0.47222, 0, 0, 0.575],
    8968: [0.25, 0.75, 0, 0, 0.51111],
    8969: [0.25, 0.75, 0, 0, 0.51111],
    8970: [0.25, 0.75, 0, 0, 0.51111],
    8971: [0.25, 0.75, 0, 0, 0.51111],
    8994: [-0.13889, 0.36111, 0, 0, 1.14999],
    8995: [-0.13889, 0.36111, 0, 0, 1.14999],
    9651: [0.19444, 0.69444, 0, 0, 1.02222],
    9657: [-0.02778, 0.47222, 0, 0, 0.575],
    9661: [0.19444, 0.69444, 0, 0, 1.02222],
    9667: [-0.02778, 0.47222, 0, 0, 0.575],
    9711: [0.19444, 0.69444, 0, 0, 1.14999],
    9824: [0.12963, 0.69444, 0, 0, 0.89444],
    9825: [0.12963, 0.69444, 0, 0, 0.89444],
    9826: [0.12963, 0.69444, 0, 0, 0.89444],
    9827: [0.12963, 0.69444, 0, 0, 0.89444],
    9837: [0, 0.75, 0, 0, 0.44722],
    9838: [0.19444, 0.69444, 0, 0, 0.44722],
    9839: [0.19444, 0.69444, 0, 0, 0.44722],
    10216: [0.25, 0.75, 0, 0, 0.44722],
    10217: [0.25, 0.75, 0, 0, 0.44722],
    10815: [0, 0.68611, 0, 0, 0.9],
    10927: [0.19667, 0.69667, 0, 0, 0.89444],
    10928: [0.19667, 0.69667, 0, 0, 0.89444],
    57376: [0.19444, 0.69444, 0, 0, 0]
  },
  "Main-BoldItalic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.11417, 0, 0.38611],
    34: [0, 0.69444, 0.07939, 0, 0.62055],
    35: [0.19444, 0.69444, 0.06833, 0, 0.94444],
    37: [0.05556, 0.75, 0.12861, 0, 0.94444],
    38: [0, 0.69444, 0.08528, 0, 0.88555],
    39: [0, 0.69444, 0.12945, 0, 0.35555],
    40: [0.25, 0.75, 0.15806, 0, 0.47333],
    41: [0.25, 0.75, 0.03306, 0, 0.47333],
    42: [0, 0.75, 0.14333, 0, 0.59111],
    43: [0.10333, 0.60333, 0.03306, 0, 0.88555],
    44: [0.19444, 0.14722, 0, 0, 0.35555],
    45: [0, 0.44444, 0.02611, 0, 0.41444],
    46: [0, 0.14722, 0, 0, 0.35555],
    47: [0.25, 0.75, 0.15806, 0, 0.59111],
    48: [0, 0.64444, 0.13167, 0, 0.59111],
    49: [0, 0.64444, 0.13167, 0, 0.59111],
    50: [0, 0.64444, 0.13167, 0, 0.59111],
    51: [0, 0.64444, 0.13167, 0, 0.59111],
    52: [0.19444, 0.64444, 0.13167, 0, 0.59111],
    53: [0, 0.64444, 0.13167, 0, 0.59111],
    54: [0, 0.64444, 0.13167, 0, 0.59111],
    55: [0.19444, 0.64444, 0.13167, 0, 0.59111],
    56: [0, 0.64444, 0.13167, 0, 0.59111],
    57: [0, 0.64444, 0.13167, 0, 0.59111],
    58: [0, 0.44444, 0.06695, 0, 0.35555],
    59: [0.19444, 0.44444, 0.06695, 0, 0.35555],
    61: [-0.10889, 0.39111, 0.06833, 0, 0.88555],
    63: [0, 0.69444, 0.11472, 0, 0.59111],
    64: [0, 0.69444, 0.09208, 0, 0.88555],
    65: [0, 0.68611, 0, 0, 0.86555],
    66: [0, 0.68611, 0.0992, 0, 0.81666],
    67: [0, 0.68611, 0.14208, 0, 0.82666],
    68: [0, 0.68611, 0.09062, 0, 0.87555],
    69: [0, 0.68611, 0.11431, 0, 0.75666],
    70: [0, 0.68611, 0.12903, 0, 0.72722],
    71: [0, 0.68611, 0.07347, 0, 0.89527],
    72: [0, 0.68611, 0.17208, 0, 0.8961],
    73: [0, 0.68611, 0.15681, 0, 0.47166],
    74: [0, 0.68611, 0.145, 0, 0.61055],
    75: [0, 0.68611, 0.14208, 0, 0.89499],
    76: [0, 0.68611, 0, 0, 0.69777],
    77: [0, 0.68611, 0.17208, 0, 1.07277],
    78: [0, 0.68611, 0.17208, 0, 0.8961],
    79: [0, 0.68611, 0.09062, 0, 0.85499],
    80: [0, 0.68611, 0.0992, 0, 0.78721],
    81: [0.19444, 0.68611, 0.09062, 0, 0.85499],
    82: [0, 0.68611, 0.02559, 0, 0.85944],
    83: [0, 0.68611, 0.11264, 0, 0.64999],
    84: [0, 0.68611, 0.12903, 0, 0.7961],
    85: [0, 0.68611, 0.17208, 0, 0.88083],
    86: [0, 0.68611, 0.18625, 0, 0.86555],
    87: [0, 0.68611, 0.18625, 0, 1.15999],
    88: [0, 0.68611, 0.15681, 0, 0.86555],
    89: [0, 0.68611, 0.19803, 0, 0.86555],
    90: [0, 0.68611, 0.14208, 0, 0.70888],
    91: [0.25, 0.75, 0.1875, 0, 0.35611],
    93: [0.25, 0.75, 0.09972, 0, 0.35611],
    94: [0, 0.69444, 0.06709, 0, 0.59111],
    95: [0.31, 0.13444, 0.09811, 0, 0.59111],
    97: [0, 0.44444, 0.09426, 0, 0.59111],
    98: [0, 0.69444, 0.07861, 0, 0.53222],
    99: [0, 0.44444, 0.05222, 0, 0.53222],
    100: [0, 0.69444, 0.10861, 0, 0.59111],
    101: [0, 0.44444, 0.085, 0, 0.53222],
    102: [0.19444, 0.69444, 0.21778, 0, 0.4],
    103: [0.19444, 0.44444, 0.105, 0, 0.53222],
    104: [0, 0.69444, 0.09426, 0, 0.59111],
    105: [0, 0.69326, 0.11387, 0, 0.35555],
    106: [0.19444, 0.69326, 0.1672, 0, 0.35555],
    107: [0, 0.69444, 0.11111, 0, 0.53222],
    108: [0, 0.69444, 0.10861, 0, 0.29666],
    109: [0, 0.44444, 0.09426, 0, 0.94444],
    110: [0, 0.44444, 0.09426, 0, 0.64999],
    111: [0, 0.44444, 0.07861, 0, 0.59111],
    112: [0.19444, 0.44444, 0.07861, 0, 0.59111],
    113: [0.19444, 0.44444, 0.105, 0, 0.53222],
    114: [0, 0.44444, 0.11111, 0, 0.50167],
    115: [0, 0.44444, 0.08167, 0, 0.48694],
    116: [0, 0.63492, 0.09639, 0, 0.385],
    117: [0, 0.44444, 0.09426, 0, 0.62055],
    118: [0, 0.44444, 0.11111, 0, 0.53222],
    119: [0, 0.44444, 0.11111, 0, 0.76777],
    120: [0, 0.44444, 0.12583, 0, 0.56055],
    121: [0.19444, 0.44444, 0.105, 0, 0.56166],
    122: [0, 0.44444, 0.13889, 0, 0.49055],
    126: [0.35, 0.34444, 0.11472, 0, 0.59111],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.69444, 0.11473, 0, 0.59111],
    176: [0, 0.69444, 0, 0, 0.94888],
    184: [0.17014, 0, 0, 0, 0.53222],
    198: [0, 0.68611, 0.11431, 0, 1.02277],
    216: [0.04861, 0.73472, 0.09062, 0, 0.88555],
    223: [0.19444, 0.69444, 0.09736, 0, 0.665],
    230: [0, 0.44444, 0.085, 0, 0.82666],
    248: [0.09722, 0.54167, 0.09458, 0, 0.59111],
    305: [0, 0.44444, 0.09426, 0, 0.35555],
    338: [0, 0.68611, 0.11431, 0, 1.14054],
    339: [0, 0.44444, 0.085, 0, 0.82666],
    567: [0.19444, 0.44444, 0.04611, 0, 0.385],
    710: [0, 0.69444, 0.06709, 0, 0.59111],
    711: [0, 0.63194, 0.08271, 0, 0.59111],
    713: [0, 0.59444, 0.10444, 0, 0.59111],
    714: [0, 0.69444, 0.08528, 0, 0.59111],
    715: [0, 0.69444, 0, 0, 0.59111],
    728: [0, 0.69444, 0.10333, 0, 0.59111],
    729: [0, 0.69444, 0.12945, 0, 0.35555],
    730: [0, 0.69444, 0, 0, 0.94888],
    732: [0, 0.69444, 0.11472, 0, 0.59111],
    733: [0, 0.69444, 0.11472, 0, 0.59111],
    915: [0, 0.68611, 0.12903, 0, 0.69777],
    916: [0, 0.68611, 0, 0, 0.94444],
    920: [0, 0.68611, 0.09062, 0, 0.88555],
    923: [0, 0.68611, 0, 0, 0.80666],
    926: [0, 0.68611, 0.15092, 0, 0.76777],
    928: [0, 0.68611, 0.17208, 0, 0.8961],
    931: [0, 0.68611, 0.11431, 0, 0.82666],
    933: [0, 0.68611, 0.10778, 0, 0.88555],
    934: [0, 0.68611, 0.05632, 0, 0.82666],
    936: [0, 0.68611, 0.10778, 0, 0.88555],
    937: [0, 0.68611, 0.0992, 0, 0.82666],
    8211: [0, 0.44444, 0.09811, 0, 0.59111],
    8212: [0, 0.44444, 0.09811, 0, 1.18221],
    8216: [0, 0.69444, 0.12945, 0, 0.35555],
    8217: [0, 0.69444, 0.12945, 0, 0.35555],
    8220: [0, 0.69444, 0.16772, 0, 0.62055],
    8221: [0, 0.69444, 0.07939, 0, 0.62055]
  },
  "Main-Italic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.12417, 0, 0.30667],
    34: [0, 0.69444, 0.06961, 0, 0.51444],
    35: [0.19444, 0.69444, 0.06616, 0, 0.81777],
    37: [0.05556, 0.75, 0.13639, 0, 0.81777],
    38: [0, 0.69444, 0.09694, 0, 0.76666],
    39: [0, 0.69444, 0.12417, 0, 0.30667],
    40: [0.25, 0.75, 0.16194, 0, 0.40889],
    41: [0.25, 0.75, 0.03694, 0, 0.40889],
    42: [0, 0.75, 0.14917, 0, 0.51111],
    43: [0.05667, 0.56167, 0.03694, 0, 0.76666],
    44: [0.19444, 0.10556, 0, 0, 0.30667],
    45: [0, 0.43056, 0.02826, 0, 0.35778],
    46: [0, 0.10556, 0, 0, 0.30667],
    47: [0.25, 0.75, 0.16194, 0, 0.51111],
    48: [0, 0.64444, 0.13556, 0, 0.51111],
    49: [0, 0.64444, 0.13556, 0, 0.51111],
    50: [0, 0.64444, 0.13556, 0, 0.51111],
    51: [0, 0.64444, 0.13556, 0, 0.51111],
    52: [0.19444, 0.64444, 0.13556, 0, 0.51111],
    53: [0, 0.64444, 0.13556, 0, 0.51111],
    54: [0, 0.64444, 0.13556, 0, 0.51111],
    55: [0.19444, 0.64444, 0.13556, 0, 0.51111],
    56: [0, 0.64444, 0.13556, 0, 0.51111],
    57: [0, 0.64444, 0.13556, 0, 0.51111],
    58: [0, 0.43056, 0.0582, 0, 0.30667],
    59: [0.19444, 0.43056, 0.0582, 0, 0.30667],
    61: [-0.13313, 0.36687, 0.06616, 0, 0.76666],
    63: [0, 0.69444, 0.1225, 0, 0.51111],
    64: [0, 0.69444, 0.09597, 0, 0.76666],
    65: [0, 0.68333, 0, 0, 0.74333],
    66: [0, 0.68333, 0.10257, 0, 0.70389],
    67: [0, 0.68333, 0.14528, 0, 0.71555],
    68: [0, 0.68333, 0.09403, 0, 0.755],
    69: [0, 0.68333, 0.12028, 0, 0.67833],
    70: [0, 0.68333, 0.13305, 0, 0.65277],
    71: [0, 0.68333, 0.08722, 0, 0.77361],
    72: [0, 0.68333, 0.16389, 0, 0.74333],
    73: [0, 0.68333, 0.15806, 0, 0.38555],
    74: [0, 0.68333, 0.14028, 0, 0.525],
    75: [0, 0.68333, 0.14528, 0, 0.76888],
    76: [0, 0.68333, 0, 0, 0.62722],
    77: [0, 0.68333, 0.16389, 0, 0.89666],
    78: [0, 0.68333, 0.16389, 0, 0.74333],
    79: [0, 0.68333, 0.09403, 0, 0.76666],
    80: [0, 0.68333, 0.10257, 0, 0.67833],
    81: [0.19444, 0.68333, 0.09403, 0, 0.76666],
    82: [0, 0.68333, 0.03868, 0, 0.72944],
    83: [0, 0.68333, 0.11972, 0, 0.56222],
    84: [0, 0.68333, 0.13305, 0, 0.71555],
    85: [0, 0.68333, 0.16389, 0, 0.74333],
    86: [0, 0.68333, 0.18361, 0, 0.74333],
    87: [0, 0.68333, 0.18361, 0, 0.99888],
    88: [0, 0.68333, 0.15806, 0, 0.74333],
    89: [0, 0.68333, 0.19383, 0, 0.74333],
    90: [0, 0.68333, 0.14528, 0, 0.61333],
    91: [0.25, 0.75, 0.1875, 0, 0.30667],
    93: [0.25, 0.75, 0.10528, 0, 0.30667],
    94: [0, 0.69444, 0.06646, 0, 0.51111],
    95: [0.31, 0.12056, 0.09208, 0, 0.51111],
    97: [0, 0.43056, 0.07671, 0, 0.51111],
    98: [0, 0.69444, 0.06312, 0, 0.46],
    99: [0, 0.43056, 0.05653, 0, 0.46],
    100: [0, 0.69444, 0.10333, 0, 0.51111],
    101: [0, 0.43056, 0.07514, 0, 0.46],
    102: [0.19444, 0.69444, 0.21194, 0, 0.30667],
    103: [0.19444, 0.43056, 0.08847, 0, 0.46],
    104: [0, 0.69444, 0.07671, 0, 0.51111],
    105: [0, 0.65536, 0.1019, 0, 0.30667],
    106: [0.19444, 0.65536, 0.14467, 0, 0.30667],
    107: [0, 0.69444, 0.10764, 0, 0.46],
    108: [0, 0.69444, 0.10333, 0, 0.25555],
    109: [0, 0.43056, 0.07671, 0, 0.81777],
    110: [0, 0.43056, 0.07671, 0, 0.56222],
    111: [0, 0.43056, 0.06312, 0, 0.51111],
    112: [0.19444, 0.43056, 0.06312, 0, 0.51111],
    113: [0.19444, 0.43056, 0.08847, 0, 0.46],
    114: [0, 0.43056, 0.10764, 0, 0.42166],
    115: [0, 0.43056, 0.08208, 0, 0.40889],
    116: [0, 0.61508, 0.09486, 0, 0.33222],
    117: [0, 0.43056, 0.07671, 0, 0.53666],
    118: [0, 0.43056, 0.10764, 0, 0.46],
    119: [0, 0.43056, 0.10764, 0, 0.66444],
    120: [0, 0.43056, 0.12042, 0, 0.46389],
    121: [0.19444, 0.43056, 0.08847, 0, 0.48555],
    122: [0, 0.43056, 0.12292, 0, 0.40889],
    126: [0.35, 0.31786, 0.11585, 0, 0.51111],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.66786, 0.10474, 0, 0.51111],
    176: [0, 0.69444, 0, 0, 0.83129],
    184: [0.17014, 0, 0, 0, 0.46],
    198: [0, 0.68333, 0.12028, 0, 0.88277],
    216: [0.04861, 0.73194, 0.09403, 0, 0.76666],
    223: [0.19444, 0.69444, 0.10514, 0, 0.53666],
    230: [0, 0.43056, 0.07514, 0, 0.71555],
    248: [0.09722, 0.52778, 0.09194, 0, 0.51111],
    338: [0, 0.68333, 0.12028, 0, 0.98499],
    339: [0, 0.43056, 0.07514, 0, 0.71555],
    710: [0, 0.69444, 0.06646, 0, 0.51111],
    711: [0, 0.62847, 0.08295, 0, 0.51111],
    713: [0, 0.56167, 0.10333, 0, 0.51111],
    714: [0, 0.69444, 0.09694, 0, 0.51111],
    715: [0, 0.69444, 0, 0, 0.51111],
    728: [0, 0.69444, 0.10806, 0, 0.51111],
    729: [0, 0.66786, 0.11752, 0, 0.30667],
    730: [0, 0.69444, 0, 0, 0.83129],
    732: [0, 0.66786, 0.11585, 0, 0.51111],
    733: [0, 0.69444, 0.1225, 0, 0.51111],
    915: [0, 0.68333, 0.13305, 0, 0.62722],
    916: [0, 0.68333, 0, 0, 0.81777],
    920: [0, 0.68333, 0.09403, 0, 0.76666],
    923: [0, 0.68333, 0, 0, 0.69222],
    926: [0, 0.68333, 0.15294, 0, 0.66444],
    928: [0, 0.68333, 0.16389, 0, 0.74333],
    931: [0, 0.68333, 0.12028, 0, 0.71555],
    933: [0, 0.68333, 0.11111, 0, 0.76666],
    934: [0, 0.68333, 0.05986, 0, 0.71555],
    936: [0, 0.68333, 0.11111, 0, 0.76666],
    937: [0, 0.68333, 0.10257, 0, 0.71555],
    8211: [0, 0.43056, 0.09208, 0, 0.51111],
    8212: [0, 0.43056, 0.09208, 0, 1.02222],
    8216: [0, 0.69444, 0.12417, 0, 0.30667],
    8217: [0, 0.69444, 0.12417, 0, 0.30667],
    8220: [0, 0.69444, 0.1685, 0, 0.51444],
    8221: [0, 0.69444, 0.06961, 0, 0.51444],
    8463: [0, 0.68889, 0, 0, 0.54028]
  },
  "Main-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.27778],
    34: [0, 0.69444, 0, 0, 0.5],
    35: [0.19444, 0.69444, 0, 0, 0.83334],
    36: [0.05556, 0.75, 0, 0, 0.5],
    37: [0.05556, 0.75, 0, 0, 0.83334],
    38: [0, 0.69444, 0, 0, 0.77778],
    39: [0, 0.69444, 0, 0, 0.27778],
    40: [0.25, 0.75, 0, 0, 0.38889],
    41: [0.25, 0.75, 0, 0, 0.38889],
    42: [0, 0.75, 0, 0, 0.5],
    43: [0.08333, 0.58333, 0, 0, 0.77778],
    44: [0.19444, 0.10556, 0, 0, 0.27778],
    45: [0, 0.43056, 0, 0, 0.33333],
    46: [0, 0.10556, 0, 0, 0.27778],
    47: [0.25, 0.75, 0, 0, 0.5],
    48: [0, 0.64444, 0, 0, 0.5],
    49: [0, 0.64444, 0, 0, 0.5],
    50: [0, 0.64444, 0, 0, 0.5],
    51: [0, 0.64444, 0, 0, 0.5],
    52: [0, 0.64444, 0, 0, 0.5],
    53: [0, 0.64444, 0, 0, 0.5],
    54: [0, 0.64444, 0, 0, 0.5],
    55: [0, 0.64444, 0, 0, 0.5],
    56: [0, 0.64444, 0, 0, 0.5],
    57: [0, 0.64444, 0, 0, 0.5],
    58: [0, 0.43056, 0, 0, 0.27778],
    59: [0.19444, 0.43056, 0, 0, 0.27778],
    60: [0.0391, 0.5391, 0, 0, 0.77778],
    61: [-0.13313, 0.36687, 0, 0, 0.77778],
    62: [0.0391, 0.5391, 0, 0, 0.77778],
    63: [0, 0.69444, 0, 0, 0.47222],
    64: [0, 0.69444, 0, 0, 0.77778],
    65: [0, 0.68333, 0, 0, 0.75],
    66: [0, 0.68333, 0, 0, 0.70834],
    67: [0, 0.68333, 0, 0, 0.72222],
    68: [0, 0.68333, 0, 0, 0.76389],
    69: [0, 0.68333, 0, 0, 0.68056],
    70: [0, 0.68333, 0, 0, 0.65278],
    71: [0, 0.68333, 0, 0, 0.78472],
    72: [0, 0.68333, 0, 0, 0.75],
    73: [0, 0.68333, 0, 0, 0.36111],
    74: [0, 0.68333, 0, 0, 0.51389],
    75: [0, 0.68333, 0, 0, 0.77778],
    76: [0, 0.68333, 0, 0, 0.625],
    77: [0, 0.68333, 0, 0, 0.91667],
    78: [0, 0.68333, 0, 0, 0.75],
    79: [0, 0.68333, 0, 0, 0.77778],
    80: [0, 0.68333, 0, 0, 0.68056],
    81: [0.19444, 0.68333, 0, 0, 0.77778],
    82: [0, 0.68333, 0, 0, 0.73611],
    83: [0, 0.68333, 0, 0, 0.55556],
    84: [0, 0.68333, 0, 0, 0.72222],
    85: [0, 0.68333, 0, 0, 0.75],
    86: [0, 0.68333, 0.01389, 0, 0.75],
    87: [0, 0.68333, 0.01389, 0, 1.02778],
    88: [0, 0.68333, 0, 0, 0.75],
    89: [0, 0.68333, 0.025, 0, 0.75],
    90: [0, 0.68333, 0, 0, 0.61111],
    91: [0.25, 0.75, 0, 0, 0.27778],
    92: [0.25, 0.75, 0, 0, 0.5],
    93: [0.25, 0.75, 0, 0, 0.27778],
    94: [0, 0.69444, 0, 0, 0.5],
    95: [0.31, 0.12056, 0.02778, 0, 0.5],
    97: [0, 0.43056, 0, 0, 0.5],
    98: [0, 0.69444, 0, 0, 0.55556],
    99: [0, 0.43056, 0, 0, 0.44445],
    100: [0, 0.69444, 0, 0, 0.55556],
    101: [0, 0.43056, 0, 0, 0.44445],
    102: [0, 0.69444, 0.07778, 0, 0.30556],
    103: [0.19444, 0.43056, 0.01389, 0, 0.5],
    104: [0, 0.69444, 0, 0, 0.55556],
    105: [0, 0.66786, 0, 0, 0.27778],
    106: [0.19444, 0.66786, 0, 0, 0.30556],
    107: [0, 0.69444, 0, 0, 0.52778],
    108: [0, 0.69444, 0, 0, 0.27778],
    109: [0, 0.43056, 0, 0, 0.83334],
    110: [0, 0.43056, 0, 0, 0.55556],
    111: [0, 0.43056, 0, 0, 0.5],
    112: [0.19444, 0.43056, 0, 0, 0.55556],
    113: [0.19444, 0.43056, 0, 0, 0.52778],
    114: [0, 0.43056, 0, 0, 0.39167],
    115: [0, 0.43056, 0, 0, 0.39445],
    116: [0, 0.61508, 0, 0, 0.38889],
    117: [0, 0.43056, 0, 0, 0.55556],
    118: [0, 0.43056, 0.01389, 0, 0.52778],
    119: [0, 0.43056, 0.01389, 0, 0.72222],
    120: [0, 0.43056, 0, 0, 0.52778],
    121: [0.19444, 0.43056, 0.01389, 0, 0.52778],
    122: [0, 0.43056, 0, 0, 0.44445],
    123: [0.25, 0.75, 0, 0, 0.5],
    124: [0.25, 0.75, 0, 0, 0.27778],
    125: [0.25, 0.75, 0, 0, 0.5],
    126: [0.35, 0.31786, 0, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    163: [0, 0.69444, 0, 0, 0.76909],
    167: [0.19444, 0.69444, 0, 0, 0.44445],
    168: [0, 0.66786, 0, 0, 0.5],
    172: [0, 0.43056, 0, 0, 0.66667],
    176: [0, 0.69444, 0, 0, 0.75],
    177: [0.08333, 0.58333, 0, 0, 0.77778],
    182: [0.19444, 0.69444, 0, 0, 0.61111],
    184: [0.17014, 0, 0, 0, 0.44445],
    198: [0, 0.68333, 0, 0, 0.90278],
    215: [0.08333, 0.58333, 0, 0, 0.77778],
    216: [0.04861, 0.73194, 0, 0, 0.77778],
    223: [0, 0.69444, 0, 0, 0.5],
    230: [0, 0.43056, 0, 0, 0.72222],
    247: [0.08333, 0.58333, 0, 0, 0.77778],
    248: [0.09722, 0.52778, 0, 0, 0.5],
    305: [0, 0.43056, 0, 0, 0.27778],
    338: [0, 0.68333, 0, 0, 1.01389],
    339: [0, 0.43056, 0, 0, 0.77778],
    567: [0.19444, 0.43056, 0, 0, 0.30556],
    710: [0, 0.69444, 0, 0, 0.5],
    711: [0, 0.62847, 0, 0, 0.5],
    713: [0, 0.56778, 0, 0, 0.5],
    714: [0, 0.69444, 0, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0, 0, 0.5],
    729: [0, 0.66786, 0, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.75],
    732: [0, 0.66786, 0, 0, 0.5],
    733: [0, 0.69444, 0, 0, 0.5],
    915: [0, 0.68333, 0, 0, 0.625],
    916: [0, 0.68333, 0, 0, 0.83334],
    920: [0, 0.68333, 0, 0, 0.77778],
    923: [0, 0.68333, 0, 0, 0.69445],
    926: [0, 0.68333, 0, 0, 0.66667],
    928: [0, 0.68333, 0, 0, 0.75],
    931: [0, 0.68333, 0, 0, 0.72222],
    933: [0, 0.68333, 0, 0, 0.77778],
    934: [0, 0.68333, 0, 0, 0.72222],
    936: [0, 0.68333, 0, 0, 0.77778],
    937: [0, 0.68333, 0, 0, 0.72222],
    8211: [0, 0.43056, 0.02778, 0, 0.5],
    8212: [0, 0.43056, 0.02778, 0, 1],
    8216: [0, 0.69444, 0, 0, 0.27778],
    8217: [0, 0.69444, 0, 0, 0.27778],
    8220: [0, 0.69444, 0, 0, 0.5],
    8221: [0, 0.69444, 0, 0, 0.5],
    8224: [0.19444, 0.69444, 0, 0, 0.44445],
    8225: [0.19444, 0.69444, 0, 0, 0.44445],
    8230: [0, 0.123, 0, 0, 1.172],
    8242: [0, 0.55556, 0, 0, 0.275],
    8407: [0, 0.71444, 0.15382, 0, 0.5],
    8463: [0, 0.68889, 0, 0, 0.54028],
    8465: [0, 0.69444, 0, 0, 0.72222],
    8467: [0, 0.69444, 0, 0.11111, 0.41667],
    8472: [0.19444, 0.43056, 0, 0.11111, 0.63646],
    8476: [0, 0.69444, 0, 0, 0.72222],
    8501: [0, 0.69444, 0, 0, 0.61111],
    8592: [-0.13313, 0.36687, 0, 0, 1],
    8593: [0.19444, 0.69444, 0, 0, 0.5],
    8594: [-0.13313, 0.36687, 0, 0, 1],
    8595: [0.19444, 0.69444, 0, 0, 0.5],
    8596: [-0.13313, 0.36687, 0, 0, 1],
    8597: [0.25, 0.75, 0, 0, 0.5],
    8598: [0.19444, 0.69444, 0, 0, 1],
    8599: [0.19444, 0.69444, 0, 0, 1],
    8600: [0.19444, 0.69444, 0, 0, 1],
    8601: [0.19444, 0.69444, 0, 0, 1],
    8614: [0.011, 0.511, 0, 0, 1],
    8617: [0.011, 0.511, 0, 0, 1.126],
    8618: [0.011, 0.511, 0, 0, 1.126],
    8636: [-0.13313, 0.36687, 0, 0, 1],
    8637: [-0.13313, 0.36687, 0, 0, 1],
    8640: [-0.13313, 0.36687, 0, 0, 1],
    8641: [-0.13313, 0.36687, 0, 0, 1],
    8652: [0.011, 0.671, 0, 0, 1],
    8656: [-0.13313, 0.36687, 0, 0, 1],
    8657: [0.19444, 0.69444, 0, 0, 0.61111],
    8658: [-0.13313, 0.36687, 0, 0, 1],
    8659: [0.19444, 0.69444, 0, 0, 0.61111],
    8660: [-0.13313, 0.36687, 0, 0, 1],
    8661: [0.25, 0.75, 0, 0, 0.61111],
    8704: [0, 0.69444, 0, 0, 0.55556],
    8706: [0, 0.69444, 0.05556, 0.08334, 0.5309],
    8707: [0, 0.69444, 0, 0, 0.55556],
    8709: [0.05556, 0.75, 0, 0, 0.5],
    8711: [0, 0.68333, 0, 0, 0.83334],
    8712: [0.0391, 0.5391, 0, 0, 0.66667],
    8715: [0.0391, 0.5391, 0, 0, 0.66667],
    8722: [0.08333, 0.58333, 0, 0, 0.77778],
    8723: [0.08333, 0.58333, 0, 0, 0.77778],
    8725: [0.25, 0.75, 0, 0, 0.5],
    8726: [0.25, 0.75, 0, 0, 0.5],
    8727: [-0.03472, 0.46528, 0, 0, 0.5],
    8728: [-0.05555, 0.44445, 0, 0, 0.5],
    8729: [-0.05555, 0.44445, 0, 0, 0.5],
    8730: [0.2, 0.8, 0, 0, 0.83334],
    8733: [0, 0.43056, 0, 0, 0.77778],
    8734: [0, 0.43056, 0, 0, 1],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8739: [0.25, 0.75, 0, 0, 0.27778],
    8741: [0.25, 0.75, 0, 0, 0.5],
    8743: [0, 0.55556, 0, 0, 0.66667],
    8744: [0, 0.55556, 0, 0, 0.66667],
    8745: [0, 0.55556, 0, 0, 0.66667],
    8746: [0, 0.55556, 0, 0, 0.66667],
    8747: [0.19444, 0.69444, 0.11111, 0, 0.41667],
    8764: [-0.13313, 0.36687, 0, 0, 0.77778],
    8768: [0.19444, 0.69444, 0, 0, 0.27778],
    8771: [-0.03625, 0.46375, 0, 0, 0.77778],
    8773: [-0.022, 0.589, 0, 0, 0.778],
    8776: [-0.01688, 0.48312, 0, 0, 0.77778],
    8781: [-0.03625, 0.46375, 0, 0, 0.77778],
    8784: [-0.133, 0.673, 0, 0, 0.778],
    8801: [-0.03625, 0.46375, 0, 0, 0.77778],
    8804: [0.13597, 0.63597, 0, 0, 0.77778],
    8805: [0.13597, 0.63597, 0, 0, 0.77778],
    8810: [0.0391, 0.5391, 0, 0, 1],
    8811: [0.0391, 0.5391, 0, 0, 1],
    8826: [0.0391, 0.5391, 0, 0, 0.77778],
    8827: [0.0391, 0.5391, 0, 0, 0.77778],
    8834: [0.0391, 0.5391, 0, 0, 0.77778],
    8835: [0.0391, 0.5391, 0, 0, 0.77778],
    8838: [0.13597, 0.63597, 0, 0, 0.77778],
    8839: [0.13597, 0.63597, 0, 0, 0.77778],
    8846: [0, 0.55556, 0, 0, 0.66667],
    8849: [0.13597, 0.63597, 0, 0, 0.77778],
    8850: [0.13597, 0.63597, 0, 0, 0.77778],
    8851: [0, 0.55556, 0, 0, 0.66667],
    8852: [0, 0.55556, 0, 0, 0.66667],
    8853: [0.08333, 0.58333, 0, 0, 0.77778],
    8854: [0.08333, 0.58333, 0, 0, 0.77778],
    8855: [0.08333, 0.58333, 0, 0, 0.77778],
    8856: [0.08333, 0.58333, 0, 0, 0.77778],
    8857: [0.08333, 0.58333, 0, 0, 0.77778],
    8866: [0, 0.69444, 0, 0, 0.61111],
    8867: [0, 0.69444, 0, 0, 0.61111],
    8868: [0, 0.69444, 0, 0, 0.77778],
    8869: [0, 0.69444, 0, 0, 0.77778],
    8872: [0.249, 0.75, 0, 0, 0.867],
    8900: [-0.05555, 0.44445, 0, 0, 0.5],
    8901: [-0.05555, 0.44445, 0, 0, 0.27778],
    8902: [-0.03472, 0.46528, 0, 0, 0.5],
    8904: [5e-3, 0.505, 0, 0, 0.9],
    8942: [0.03, 0.903, 0, 0, 0.278],
    8943: [-0.19, 0.313, 0, 0, 1.172],
    8945: [-0.1, 0.823, 0, 0, 1.282],
    8968: [0.25, 0.75, 0, 0, 0.44445],
    8969: [0.25, 0.75, 0, 0, 0.44445],
    8970: [0.25, 0.75, 0, 0, 0.44445],
    8971: [0.25, 0.75, 0, 0, 0.44445],
    8994: [-0.14236, 0.35764, 0, 0, 1],
    8995: [-0.14236, 0.35764, 0, 0, 1],
    9136: [0.244, 0.744, 0, 0, 0.412],
    9137: [0.244, 0.745, 0, 0, 0.412],
    9651: [0.19444, 0.69444, 0, 0, 0.88889],
    9657: [-0.03472, 0.46528, 0, 0, 0.5],
    9661: [0.19444, 0.69444, 0, 0, 0.88889],
    9667: [-0.03472, 0.46528, 0, 0, 0.5],
    9711: [0.19444, 0.69444, 0, 0, 1],
    9824: [0.12963, 0.69444, 0, 0, 0.77778],
    9825: [0.12963, 0.69444, 0, 0, 0.77778],
    9826: [0.12963, 0.69444, 0, 0, 0.77778],
    9827: [0.12963, 0.69444, 0, 0, 0.77778],
    9837: [0, 0.75, 0, 0, 0.38889],
    9838: [0.19444, 0.69444, 0, 0, 0.38889],
    9839: [0.19444, 0.69444, 0, 0, 0.38889],
    10216: [0.25, 0.75, 0, 0, 0.38889],
    10217: [0.25, 0.75, 0, 0, 0.38889],
    10222: [0.244, 0.744, 0, 0, 0.412],
    10223: [0.244, 0.745, 0, 0, 0.412],
    10229: [0.011, 0.511, 0, 0, 1.609],
    10230: [0.011, 0.511, 0, 0, 1.638],
    10231: [0.011, 0.511, 0, 0, 1.859],
    10232: [0.024, 0.525, 0, 0, 1.609],
    10233: [0.024, 0.525, 0, 0, 1.638],
    10234: [0.024, 0.525, 0, 0, 1.858],
    10236: [0.011, 0.511, 0, 0, 1.638],
    10815: [0, 0.68333, 0, 0, 0.75],
    10927: [0.13597, 0.63597, 0, 0, 0.77778],
    10928: [0.13597, 0.63597, 0, 0, 0.77778],
    57376: [0.19444, 0.69444, 0, 0, 0]
  },
  "Math-BoldItalic": {
    32: [0, 0, 0, 0, 0.25],
    48: [0, 0.44444, 0, 0, 0.575],
    49: [0, 0.44444, 0, 0, 0.575],
    50: [0, 0.44444, 0, 0, 0.575],
    51: [0.19444, 0.44444, 0, 0, 0.575],
    52: [0.19444, 0.44444, 0, 0, 0.575],
    53: [0.19444, 0.44444, 0, 0, 0.575],
    54: [0, 0.64444, 0, 0, 0.575],
    55: [0.19444, 0.44444, 0, 0, 0.575],
    56: [0, 0.64444, 0, 0, 0.575],
    57: [0.19444, 0.44444, 0, 0, 0.575],
    65: [0, 0.68611, 0, 0, 0.86944],
    66: [0, 0.68611, 0.04835, 0, 0.8664],
    67: [0, 0.68611, 0.06979, 0, 0.81694],
    68: [0, 0.68611, 0.03194, 0, 0.93812],
    69: [0, 0.68611, 0.05451, 0, 0.81007],
    70: [0, 0.68611, 0.15972, 0, 0.68889],
    71: [0, 0.68611, 0, 0, 0.88673],
    72: [0, 0.68611, 0.08229, 0, 0.98229],
    73: [0, 0.68611, 0.07778, 0, 0.51111],
    74: [0, 0.68611, 0.10069, 0, 0.63125],
    75: [0, 0.68611, 0.06979, 0, 0.97118],
    76: [0, 0.68611, 0, 0, 0.75555],
    77: [0, 0.68611, 0.11424, 0, 1.14201],
    78: [0, 0.68611, 0.11424, 0, 0.95034],
    79: [0, 0.68611, 0.03194, 0, 0.83666],
    80: [0, 0.68611, 0.15972, 0, 0.72309],
    81: [0.19444, 0.68611, 0, 0, 0.86861],
    82: [0, 0.68611, 421e-5, 0, 0.87235],
    83: [0, 0.68611, 0.05382, 0, 0.69271],
    84: [0, 0.68611, 0.15972, 0, 0.63663],
    85: [0, 0.68611, 0.11424, 0, 0.80027],
    86: [0, 0.68611, 0.25555, 0, 0.67778],
    87: [0, 0.68611, 0.15972, 0, 1.09305],
    88: [0, 0.68611, 0.07778, 0, 0.94722],
    89: [0, 0.68611, 0.25555, 0, 0.67458],
    90: [0, 0.68611, 0.06979, 0, 0.77257],
    97: [0, 0.44444, 0, 0, 0.63287],
    98: [0, 0.69444, 0, 0, 0.52083],
    99: [0, 0.44444, 0, 0, 0.51342],
    100: [0, 0.69444, 0, 0, 0.60972],
    101: [0, 0.44444, 0, 0, 0.55361],
    102: [0.19444, 0.69444, 0.11042, 0, 0.56806],
    103: [0.19444, 0.44444, 0.03704, 0, 0.5449],
    104: [0, 0.69444, 0, 0, 0.66759],
    105: [0, 0.69326, 0, 0, 0.4048],
    106: [0.19444, 0.69326, 0.0622, 0, 0.47083],
    107: [0, 0.69444, 0.01852, 0, 0.6037],
    108: [0, 0.69444, 88e-4, 0, 0.34815],
    109: [0, 0.44444, 0, 0, 1.0324],
    110: [0, 0.44444, 0, 0, 0.71296],
    111: [0, 0.44444, 0, 0, 0.58472],
    112: [0.19444, 0.44444, 0, 0, 0.60092],
    113: [0.19444, 0.44444, 0.03704, 0, 0.54213],
    114: [0, 0.44444, 0.03194, 0, 0.5287],
    115: [0, 0.44444, 0, 0, 0.53125],
    116: [0, 0.63492, 0, 0, 0.41528],
    117: [0, 0.44444, 0, 0, 0.68102],
    118: [0, 0.44444, 0.03704, 0, 0.56666],
    119: [0, 0.44444, 0.02778, 0, 0.83148],
    120: [0, 0.44444, 0, 0, 0.65903],
    121: [0.19444, 0.44444, 0.03704, 0, 0.59028],
    122: [0, 0.44444, 0.04213, 0, 0.55509],
    160: [0, 0, 0, 0, 0.25],
    915: [0, 0.68611, 0.15972, 0, 0.65694],
    916: [0, 0.68611, 0, 0, 0.95833],
    920: [0, 0.68611, 0.03194, 0, 0.86722],
    923: [0, 0.68611, 0, 0, 0.80555],
    926: [0, 0.68611, 0.07458, 0, 0.84125],
    928: [0, 0.68611, 0.08229, 0, 0.98229],
    931: [0, 0.68611, 0.05451, 0, 0.88507],
    933: [0, 0.68611, 0.15972, 0, 0.67083],
    934: [0, 0.68611, 0, 0, 0.76666],
    936: [0, 0.68611, 0.11653, 0, 0.71402],
    937: [0, 0.68611, 0.04835, 0, 0.8789],
    945: [0, 0.44444, 0, 0, 0.76064],
    946: [0.19444, 0.69444, 0.03403, 0, 0.65972],
    947: [0.19444, 0.44444, 0.06389, 0, 0.59003],
    948: [0, 0.69444, 0.03819, 0, 0.52222],
    949: [0, 0.44444, 0, 0, 0.52882],
    950: [0.19444, 0.69444, 0.06215, 0, 0.50833],
    951: [0.19444, 0.44444, 0.03704, 0, 0.6],
    952: [0, 0.69444, 0.03194, 0, 0.5618],
    953: [0, 0.44444, 0, 0, 0.41204],
    954: [0, 0.44444, 0, 0, 0.66759],
    955: [0, 0.69444, 0, 0, 0.67083],
    956: [0.19444, 0.44444, 0, 0, 0.70787],
    957: [0, 0.44444, 0.06898, 0, 0.57685],
    958: [0.19444, 0.69444, 0.03021, 0, 0.50833],
    959: [0, 0.44444, 0, 0, 0.58472],
    960: [0, 0.44444, 0.03704, 0, 0.68241],
    961: [0.19444, 0.44444, 0, 0, 0.6118],
    962: [0.09722, 0.44444, 0.07917, 0, 0.42361],
    963: [0, 0.44444, 0.03704, 0, 0.68588],
    964: [0, 0.44444, 0.13472, 0, 0.52083],
    965: [0, 0.44444, 0.03704, 0, 0.63055],
    966: [0.19444, 0.44444, 0, 0, 0.74722],
    967: [0.19444, 0.44444, 0, 0, 0.71805],
    968: [0.19444, 0.69444, 0.03704, 0, 0.75833],
    969: [0, 0.44444, 0.03704, 0, 0.71782],
    977: [0, 0.69444, 0, 0, 0.69155],
    981: [0.19444, 0.69444, 0, 0, 0.7125],
    982: [0, 0.44444, 0.03194, 0, 0.975],
    1009: [0.19444, 0.44444, 0, 0, 0.6118],
    1013: [0, 0.44444, 0, 0, 0.48333],
    57649: [0, 0.44444, 0, 0, 0.39352],
    57911: [0.19444, 0.44444, 0, 0, 0.43889]
  },
  "Math-Italic": {
    32: [0, 0, 0, 0, 0.25],
    48: [0, 0.43056, 0, 0, 0.5],
    49: [0, 0.43056, 0, 0, 0.5],
    50: [0, 0.43056, 0, 0, 0.5],
    51: [0.19444, 0.43056, 0, 0, 0.5],
    52: [0.19444, 0.43056, 0, 0, 0.5],
    53: [0.19444, 0.43056, 0, 0, 0.5],
    54: [0, 0.64444, 0, 0, 0.5],
    55: [0.19444, 0.43056, 0, 0, 0.5],
    56: [0, 0.64444, 0, 0, 0.5],
    57: [0.19444, 0.43056, 0, 0, 0.5],
    65: [0, 0.68333, 0, 0.13889, 0.75],
    66: [0, 0.68333, 0.05017, 0.08334, 0.75851],
    67: [0, 0.68333, 0.07153, 0.08334, 0.71472],
    68: [0, 0.68333, 0.02778, 0.05556, 0.82792],
    69: [0, 0.68333, 0.05764, 0.08334, 0.7382],
    70: [0, 0.68333, 0.13889, 0.08334, 0.64306],
    71: [0, 0.68333, 0, 0.08334, 0.78625],
    72: [0, 0.68333, 0.08125, 0.05556, 0.83125],
    73: [0, 0.68333, 0.07847, 0.11111, 0.43958],
    74: [0, 0.68333, 0.09618, 0.16667, 0.55451],
    75: [0, 0.68333, 0.07153, 0.05556, 0.84931],
    76: [0, 0.68333, 0, 0.02778, 0.68056],
    77: [0, 0.68333, 0.10903, 0.08334, 0.97014],
    78: [0, 0.68333, 0.10903, 0.08334, 0.80347],
    79: [0, 0.68333, 0.02778, 0.08334, 0.76278],
    80: [0, 0.68333, 0.13889, 0.08334, 0.64201],
    81: [0.19444, 0.68333, 0, 0.08334, 0.79056],
    82: [0, 0.68333, 773e-5, 0.08334, 0.75929],
    83: [0, 0.68333, 0.05764, 0.08334, 0.6132],
    84: [0, 0.68333, 0.13889, 0.08334, 0.58438],
    85: [0, 0.68333, 0.10903, 0.02778, 0.68278],
    86: [0, 0.68333, 0.22222, 0, 0.58333],
    87: [0, 0.68333, 0.13889, 0, 0.94445],
    88: [0, 0.68333, 0.07847, 0.08334, 0.82847],
    89: [0, 0.68333, 0.22222, 0, 0.58056],
    90: [0, 0.68333, 0.07153, 0.08334, 0.68264],
    97: [0, 0.43056, 0, 0, 0.52859],
    98: [0, 0.69444, 0, 0, 0.42917],
    99: [0, 0.43056, 0, 0.05556, 0.43276],
    100: [0, 0.69444, 0, 0.16667, 0.52049],
    101: [0, 0.43056, 0, 0.05556, 0.46563],
    102: [0.19444, 0.69444, 0.10764, 0.16667, 0.48959],
    103: [0.19444, 0.43056, 0.03588, 0.02778, 0.47697],
    104: [0, 0.69444, 0, 0, 0.57616],
    105: [0, 0.65952, 0, 0, 0.34451],
    106: [0.19444, 0.65952, 0.05724, 0, 0.41181],
    107: [0, 0.69444, 0.03148, 0, 0.5206],
    108: [0, 0.69444, 0.01968, 0.08334, 0.29838],
    109: [0, 0.43056, 0, 0, 0.87801],
    110: [0, 0.43056, 0, 0, 0.60023],
    111: [0, 0.43056, 0, 0.05556, 0.48472],
    112: [0.19444, 0.43056, 0, 0.08334, 0.50313],
    113: [0.19444, 0.43056, 0.03588, 0.08334, 0.44641],
    114: [0, 0.43056, 0.02778, 0.05556, 0.45116],
    115: [0, 0.43056, 0, 0.05556, 0.46875],
    116: [0, 0.61508, 0, 0.08334, 0.36111],
    117: [0, 0.43056, 0, 0.02778, 0.57246],
    118: [0, 0.43056, 0.03588, 0.02778, 0.48472],
    119: [0, 0.43056, 0.02691, 0.08334, 0.71592],
    120: [0, 0.43056, 0, 0.02778, 0.57153],
    121: [0.19444, 0.43056, 0.03588, 0.05556, 0.49028],
    122: [0, 0.43056, 0.04398, 0.05556, 0.46505],
    160: [0, 0, 0, 0, 0.25],
    915: [0, 0.68333, 0.13889, 0.08334, 0.61528],
    916: [0, 0.68333, 0, 0.16667, 0.83334],
    920: [0, 0.68333, 0.02778, 0.08334, 0.76278],
    923: [0, 0.68333, 0, 0.16667, 0.69445],
    926: [0, 0.68333, 0.07569, 0.08334, 0.74236],
    928: [0, 0.68333, 0.08125, 0.05556, 0.83125],
    931: [0, 0.68333, 0.05764, 0.08334, 0.77986],
    933: [0, 0.68333, 0.13889, 0.05556, 0.58333],
    934: [0, 0.68333, 0, 0.08334, 0.66667],
    936: [0, 0.68333, 0.11, 0.05556, 0.61222],
    937: [0, 0.68333, 0.05017, 0.08334, 0.7724],
    945: [0, 0.43056, 37e-4, 0.02778, 0.6397],
    946: [0.19444, 0.69444, 0.05278, 0.08334, 0.56563],
    947: [0.19444, 0.43056, 0.05556, 0, 0.51773],
    948: [0, 0.69444, 0.03785, 0.05556, 0.44444],
    949: [0, 0.43056, 0, 0.08334, 0.46632],
    950: [0.19444, 0.69444, 0.07378, 0.08334, 0.4375],
    951: [0.19444, 0.43056, 0.03588, 0.05556, 0.49653],
    952: [0, 0.69444, 0.02778, 0.08334, 0.46944],
    953: [0, 0.43056, 0, 0.05556, 0.35394],
    954: [0, 0.43056, 0, 0, 0.57616],
    955: [0, 0.69444, 0, 0, 0.58334],
    956: [0.19444, 0.43056, 0, 0.02778, 0.60255],
    957: [0, 0.43056, 0.06366, 0.02778, 0.49398],
    958: [0.19444, 0.69444, 0.04601, 0.11111, 0.4375],
    959: [0, 0.43056, 0, 0.05556, 0.48472],
    960: [0, 0.43056, 0.03588, 0, 0.57003],
    961: [0.19444, 0.43056, 0, 0.08334, 0.51702],
    962: [0.09722, 0.43056, 0.07986, 0.08334, 0.36285],
    963: [0, 0.43056, 0.03588, 0, 0.57141],
    964: [0, 0.43056, 0.1132, 0.02778, 0.43715],
    965: [0, 0.43056, 0.03588, 0.02778, 0.54028],
    966: [0.19444, 0.43056, 0, 0.08334, 0.65417],
    967: [0.19444, 0.43056, 0, 0.05556, 0.62569],
    968: [0.19444, 0.69444, 0.03588, 0.11111, 0.65139],
    969: [0, 0.43056, 0.03588, 0, 0.62245],
    977: [0, 0.69444, 0, 0.08334, 0.59144],
    981: [0.19444, 0.69444, 0, 0.08334, 0.59583],
    982: [0, 0.43056, 0.02778, 0, 0.82813],
    1009: [0.19444, 0.43056, 0, 0.08334, 0.51702],
    1013: [0, 0.43056, 0, 0.05556, 0.4059],
    57649: [0, 0.43056, 0, 0.02778, 0.32246],
    57911: [0.19444, 0.43056, 0, 0.08334, 0.38403]
  },
  "SansSerif-Bold": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.36667],
    34: [0, 0.69444, 0, 0, 0.55834],
    35: [0.19444, 0.69444, 0, 0, 0.91667],
    36: [0.05556, 0.75, 0, 0, 0.55],
    37: [0.05556, 0.75, 0, 0, 1.02912],
    38: [0, 0.69444, 0, 0, 0.83056],
    39: [0, 0.69444, 0, 0, 0.30556],
    40: [0.25, 0.75, 0, 0, 0.42778],
    41: [0.25, 0.75, 0, 0, 0.42778],
    42: [0, 0.75, 0, 0, 0.55],
    43: [0.11667, 0.61667, 0, 0, 0.85556],
    44: [0.10556, 0.13056, 0, 0, 0.30556],
    45: [0, 0.45833, 0, 0, 0.36667],
    46: [0, 0.13056, 0, 0, 0.30556],
    47: [0.25, 0.75, 0, 0, 0.55],
    48: [0, 0.69444, 0, 0, 0.55],
    49: [0, 0.69444, 0, 0, 0.55],
    50: [0, 0.69444, 0, 0, 0.55],
    51: [0, 0.69444, 0, 0, 0.55],
    52: [0, 0.69444, 0, 0, 0.55],
    53: [0, 0.69444, 0, 0, 0.55],
    54: [0, 0.69444, 0, 0, 0.55],
    55: [0, 0.69444, 0, 0, 0.55],
    56: [0, 0.69444, 0, 0, 0.55],
    57: [0, 0.69444, 0, 0, 0.55],
    58: [0, 0.45833, 0, 0, 0.30556],
    59: [0.10556, 0.45833, 0, 0, 0.30556],
    61: [-0.09375, 0.40625, 0, 0, 0.85556],
    63: [0, 0.69444, 0, 0, 0.51945],
    64: [0, 0.69444, 0, 0, 0.73334],
    65: [0, 0.69444, 0, 0, 0.73334],
    66: [0, 0.69444, 0, 0, 0.73334],
    67: [0, 0.69444, 0, 0, 0.70278],
    68: [0, 0.69444, 0, 0, 0.79445],
    69: [0, 0.69444, 0, 0, 0.64167],
    70: [0, 0.69444, 0, 0, 0.61111],
    71: [0, 0.69444, 0, 0, 0.73334],
    72: [0, 0.69444, 0, 0, 0.79445],
    73: [0, 0.69444, 0, 0, 0.33056],
    74: [0, 0.69444, 0, 0, 0.51945],
    75: [0, 0.69444, 0, 0, 0.76389],
    76: [0, 0.69444, 0, 0, 0.58056],
    77: [0, 0.69444, 0, 0, 0.97778],
    78: [0, 0.69444, 0, 0, 0.79445],
    79: [0, 0.69444, 0, 0, 0.79445],
    80: [0, 0.69444, 0, 0, 0.70278],
    81: [0.10556, 0.69444, 0, 0, 0.79445],
    82: [0, 0.69444, 0, 0, 0.70278],
    83: [0, 0.69444, 0, 0, 0.61111],
    84: [0, 0.69444, 0, 0, 0.73334],
    85: [0, 0.69444, 0, 0, 0.76389],
    86: [0, 0.69444, 0.01528, 0, 0.73334],
    87: [0, 0.69444, 0.01528, 0, 1.03889],
    88: [0, 0.69444, 0, 0, 0.73334],
    89: [0, 0.69444, 0.0275, 0, 0.73334],
    90: [0, 0.69444, 0, 0, 0.67223],
    91: [0.25, 0.75, 0, 0, 0.34306],
    93: [0.25, 0.75, 0, 0, 0.34306],
    94: [0, 0.69444, 0, 0, 0.55],
    95: [0.35, 0.10833, 0.03056, 0, 0.55],
    97: [0, 0.45833, 0, 0, 0.525],
    98: [0, 0.69444, 0, 0, 0.56111],
    99: [0, 0.45833, 0, 0, 0.48889],
    100: [0, 0.69444, 0, 0, 0.56111],
    101: [0, 0.45833, 0, 0, 0.51111],
    102: [0, 0.69444, 0.07639, 0, 0.33611],
    103: [0.19444, 0.45833, 0.01528, 0, 0.55],
    104: [0, 0.69444, 0, 0, 0.56111],
    105: [0, 0.69444, 0, 0, 0.25556],
    106: [0.19444, 0.69444, 0, 0, 0.28611],
    107: [0, 0.69444, 0, 0, 0.53056],
    108: [0, 0.69444, 0, 0, 0.25556],
    109: [0, 0.45833, 0, 0, 0.86667],
    110: [0, 0.45833, 0, 0, 0.56111],
    111: [0, 0.45833, 0, 0, 0.55],
    112: [0.19444, 0.45833, 0, 0, 0.56111],
    113: [0.19444, 0.45833, 0, 0, 0.56111],
    114: [0, 0.45833, 0.01528, 0, 0.37222],
    115: [0, 0.45833, 0, 0, 0.42167],
    116: [0, 0.58929, 0, 0, 0.40417],
    117: [0, 0.45833, 0, 0, 0.56111],
    118: [0, 0.45833, 0.01528, 0, 0.5],
    119: [0, 0.45833, 0.01528, 0, 0.74445],
    120: [0, 0.45833, 0, 0, 0.5],
    121: [0.19444, 0.45833, 0.01528, 0, 0.5],
    122: [0, 0.45833, 0, 0, 0.47639],
    126: [0.35, 0.34444, 0, 0, 0.55],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.69444, 0, 0, 0.55],
    176: [0, 0.69444, 0, 0, 0.73334],
    180: [0, 0.69444, 0, 0, 0.55],
    184: [0.17014, 0, 0, 0, 0.48889],
    305: [0, 0.45833, 0, 0, 0.25556],
    567: [0.19444, 0.45833, 0, 0, 0.28611],
    710: [0, 0.69444, 0, 0, 0.55],
    711: [0, 0.63542, 0, 0, 0.55],
    713: [0, 0.63778, 0, 0, 0.55],
    728: [0, 0.69444, 0, 0, 0.55],
    729: [0, 0.69444, 0, 0, 0.30556],
    730: [0, 0.69444, 0, 0, 0.73334],
    732: [0, 0.69444, 0, 0, 0.55],
    733: [0, 0.69444, 0, 0, 0.55],
    915: [0, 0.69444, 0, 0, 0.58056],
    916: [0, 0.69444, 0, 0, 0.91667],
    920: [0, 0.69444, 0, 0, 0.85556],
    923: [0, 0.69444, 0, 0, 0.67223],
    926: [0, 0.69444, 0, 0, 0.73334],
    928: [0, 0.69444, 0, 0, 0.79445],
    931: [0, 0.69444, 0, 0, 0.79445],
    933: [0, 0.69444, 0, 0, 0.85556],
    934: [0, 0.69444, 0, 0, 0.79445],
    936: [0, 0.69444, 0, 0, 0.85556],
    937: [0, 0.69444, 0, 0, 0.79445],
    8211: [0, 0.45833, 0.03056, 0, 0.55],
    8212: [0, 0.45833, 0.03056, 0, 1.10001],
    8216: [0, 0.69444, 0, 0, 0.30556],
    8217: [0, 0.69444, 0, 0, 0.30556],
    8220: [0, 0.69444, 0, 0, 0.55834],
    8221: [0, 0.69444, 0, 0, 0.55834]
  },
  "SansSerif-Italic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.05733, 0, 0.31945],
    34: [0, 0.69444, 316e-5, 0, 0.5],
    35: [0.19444, 0.69444, 0.05087, 0, 0.83334],
    36: [0.05556, 0.75, 0.11156, 0, 0.5],
    37: [0.05556, 0.75, 0.03126, 0, 0.83334],
    38: [0, 0.69444, 0.03058, 0, 0.75834],
    39: [0, 0.69444, 0.07816, 0, 0.27778],
    40: [0.25, 0.75, 0.13164, 0, 0.38889],
    41: [0.25, 0.75, 0.02536, 0, 0.38889],
    42: [0, 0.75, 0.11775, 0, 0.5],
    43: [0.08333, 0.58333, 0.02536, 0, 0.77778],
    44: [0.125, 0.08333, 0, 0, 0.27778],
    45: [0, 0.44444, 0.01946, 0, 0.33333],
    46: [0, 0.08333, 0, 0, 0.27778],
    47: [0.25, 0.75, 0.13164, 0, 0.5],
    48: [0, 0.65556, 0.11156, 0, 0.5],
    49: [0, 0.65556, 0.11156, 0, 0.5],
    50: [0, 0.65556, 0.11156, 0, 0.5],
    51: [0, 0.65556, 0.11156, 0, 0.5],
    52: [0, 0.65556, 0.11156, 0, 0.5],
    53: [0, 0.65556, 0.11156, 0, 0.5],
    54: [0, 0.65556, 0.11156, 0, 0.5],
    55: [0, 0.65556, 0.11156, 0, 0.5],
    56: [0, 0.65556, 0.11156, 0, 0.5],
    57: [0, 0.65556, 0.11156, 0, 0.5],
    58: [0, 0.44444, 0.02502, 0, 0.27778],
    59: [0.125, 0.44444, 0.02502, 0, 0.27778],
    61: [-0.13, 0.37, 0.05087, 0, 0.77778],
    63: [0, 0.69444, 0.11809, 0, 0.47222],
    64: [0, 0.69444, 0.07555, 0, 0.66667],
    65: [0, 0.69444, 0, 0, 0.66667],
    66: [0, 0.69444, 0.08293, 0, 0.66667],
    67: [0, 0.69444, 0.11983, 0, 0.63889],
    68: [0, 0.69444, 0.07555, 0, 0.72223],
    69: [0, 0.69444, 0.11983, 0, 0.59722],
    70: [0, 0.69444, 0.13372, 0, 0.56945],
    71: [0, 0.69444, 0.11983, 0, 0.66667],
    72: [0, 0.69444, 0.08094, 0, 0.70834],
    73: [0, 0.69444, 0.13372, 0, 0.27778],
    74: [0, 0.69444, 0.08094, 0, 0.47222],
    75: [0, 0.69444, 0.11983, 0, 0.69445],
    76: [0, 0.69444, 0, 0, 0.54167],
    77: [0, 0.69444, 0.08094, 0, 0.875],
    78: [0, 0.69444, 0.08094, 0, 0.70834],
    79: [0, 0.69444, 0.07555, 0, 0.73611],
    80: [0, 0.69444, 0.08293, 0, 0.63889],
    81: [0.125, 0.69444, 0.07555, 0, 0.73611],
    82: [0, 0.69444, 0.08293, 0, 0.64584],
    83: [0, 0.69444, 0.09205, 0, 0.55556],
    84: [0, 0.69444, 0.13372, 0, 0.68056],
    85: [0, 0.69444, 0.08094, 0, 0.6875],
    86: [0, 0.69444, 0.1615, 0, 0.66667],
    87: [0, 0.69444, 0.1615, 0, 0.94445],
    88: [0, 0.69444, 0.13372, 0, 0.66667],
    89: [0, 0.69444, 0.17261, 0, 0.66667],
    90: [0, 0.69444, 0.11983, 0, 0.61111],
    91: [0.25, 0.75, 0.15942, 0, 0.28889],
    93: [0.25, 0.75, 0.08719, 0, 0.28889],
    94: [0, 0.69444, 0.0799, 0, 0.5],
    95: [0.35, 0.09444, 0.08616, 0, 0.5],
    97: [0, 0.44444, 981e-5, 0, 0.48056],
    98: [0, 0.69444, 0.03057, 0, 0.51667],
    99: [0, 0.44444, 0.08336, 0, 0.44445],
    100: [0, 0.69444, 0.09483, 0, 0.51667],
    101: [0, 0.44444, 0.06778, 0, 0.44445],
    102: [0, 0.69444, 0.21705, 0, 0.30556],
    103: [0.19444, 0.44444, 0.10836, 0, 0.5],
    104: [0, 0.69444, 0.01778, 0, 0.51667],
    105: [0, 0.67937, 0.09718, 0, 0.23889],
    106: [0.19444, 0.67937, 0.09162, 0, 0.26667],
    107: [0, 0.69444, 0.08336, 0, 0.48889],
    108: [0, 0.69444, 0.09483, 0, 0.23889],
    109: [0, 0.44444, 0.01778, 0, 0.79445],
    110: [0, 0.44444, 0.01778, 0, 0.51667],
    111: [0, 0.44444, 0.06613, 0, 0.5],
    112: [0.19444, 0.44444, 0.0389, 0, 0.51667],
    113: [0.19444, 0.44444, 0.04169, 0, 0.51667],
    114: [0, 0.44444, 0.10836, 0, 0.34167],
    115: [0, 0.44444, 0.0778, 0, 0.38333],
    116: [0, 0.57143, 0.07225, 0, 0.36111],
    117: [0, 0.44444, 0.04169, 0, 0.51667],
    118: [0, 0.44444, 0.10836, 0, 0.46111],
    119: [0, 0.44444, 0.10836, 0, 0.68334],
    120: [0, 0.44444, 0.09169, 0, 0.46111],
    121: [0.19444, 0.44444, 0.10836, 0, 0.46111],
    122: [0, 0.44444, 0.08752, 0, 0.43472],
    126: [0.35, 0.32659, 0.08826, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.67937, 0.06385, 0, 0.5],
    176: [0, 0.69444, 0, 0, 0.73752],
    184: [0.17014, 0, 0, 0, 0.44445],
    305: [0, 0.44444, 0.04169, 0, 0.23889],
    567: [0.19444, 0.44444, 0.04169, 0, 0.26667],
    710: [0, 0.69444, 0.0799, 0, 0.5],
    711: [0, 0.63194, 0.08432, 0, 0.5],
    713: [0, 0.60889, 0.08776, 0, 0.5],
    714: [0, 0.69444, 0.09205, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0.09483, 0, 0.5],
    729: [0, 0.67937, 0.07774, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.73752],
    732: [0, 0.67659, 0.08826, 0, 0.5],
    733: [0, 0.69444, 0.09205, 0, 0.5],
    915: [0, 0.69444, 0.13372, 0, 0.54167],
    916: [0, 0.69444, 0, 0, 0.83334],
    920: [0, 0.69444, 0.07555, 0, 0.77778],
    923: [0, 0.69444, 0, 0, 0.61111],
    926: [0, 0.69444, 0.12816, 0, 0.66667],
    928: [0, 0.69444, 0.08094, 0, 0.70834],
    931: [0, 0.69444, 0.11983, 0, 0.72222],
    933: [0, 0.69444, 0.09031, 0, 0.77778],
    934: [0, 0.69444, 0.04603, 0, 0.72222],
    936: [0, 0.69444, 0.09031, 0, 0.77778],
    937: [0, 0.69444, 0.08293, 0, 0.72222],
    8211: [0, 0.44444, 0.08616, 0, 0.5],
    8212: [0, 0.44444, 0.08616, 0, 1],
    8216: [0, 0.69444, 0.07816, 0, 0.27778],
    8217: [0, 0.69444, 0.07816, 0, 0.27778],
    8220: [0, 0.69444, 0.14205, 0, 0.5],
    8221: [0, 0.69444, 316e-5, 0, 0.5]
  },
  "SansSerif-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.31945],
    34: [0, 0.69444, 0, 0, 0.5],
    35: [0.19444, 0.69444, 0, 0, 0.83334],
    36: [0.05556, 0.75, 0, 0, 0.5],
    37: [0.05556, 0.75, 0, 0, 0.83334],
    38: [0, 0.69444, 0, 0, 0.75834],
    39: [0, 0.69444, 0, 0, 0.27778],
    40: [0.25, 0.75, 0, 0, 0.38889],
    41: [0.25, 0.75, 0, 0, 0.38889],
    42: [0, 0.75, 0, 0, 0.5],
    43: [0.08333, 0.58333, 0, 0, 0.77778],
    44: [0.125, 0.08333, 0, 0, 0.27778],
    45: [0, 0.44444, 0, 0, 0.33333],
    46: [0, 0.08333, 0, 0, 0.27778],
    47: [0.25, 0.75, 0, 0, 0.5],
    48: [0, 0.65556, 0, 0, 0.5],
    49: [0, 0.65556, 0, 0, 0.5],
    50: [0, 0.65556, 0, 0, 0.5],
    51: [0, 0.65556, 0, 0, 0.5],
    52: [0, 0.65556, 0, 0, 0.5],
    53: [0, 0.65556, 0, 0, 0.5],
    54: [0, 0.65556, 0, 0, 0.5],
    55: [0, 0.65556, 0, 0, 0.5],
    56: [0, 0.65556, 0, 0, 0.5],
    57: [0, 0.65556, 0, 0, 0.5],
    58: [0, 0.44444, 0, 0, 0.27778],
    59: [0.125, 0.44444, 0, 0, 0.27778],
    61: [-0.13, 0.37, 0, 0, 0.77778],
    63: [0, 0.69444, 0, 0, 0.47222],
    64: [0, 0.69444, 0, 0, 0.66667],
    65: [0, 0.69444, 0, 0, 0.66667],
    66: [0, 0.69444, 0, 0, 0.66667],
    67: [0, 0.69444, 0, 0, 0.63889],
    68: [0, 0.69444, 0, 0, 0.72223],
    69: [0, 0.69444, 0, 0, 0.59722],
    70: [0, 0.69444, 0, 0, 0.56945],
    71: [0, 0.69444, 0, 0, 0.66667],
    72: [0, 0.69444, 0, 0, 0.70834],
    73: [0, 0.69444, 0, 0, 0.27778],
    74: [0, 0.69444, 0, 0, 0.47222],
    75: [0, 0.69444, 0, 0, 0.69445],
    76: [0, 0.69444, 0, 0, 0.54167],
    77: [0, 0.69444, 0, 0, 0.875],
    78: [0, 0.69444, 0, 0, 0.70834],
    79: [0, 0.69444, 0, 0, 0.73611],
    80: [0, 0.69444, 0, 0, 0.63889],
    81: [0.125, 0.69444, 0, 0, 0.73611],
    82: [0, 0.69444, 0, 0, 0.64584],
    83: [0, 0.69444, 0, 0, 0.55556],
    84: [0, 0.69444, 0, 0, 0.68056],
    85: [0, 0.69444, 0, 0, 0.6875],
    86: [0, 0.69444, 0.01389, 0, 0.66667],
    87: [0, 0.69444, 0.01389, 0, 0.94445],
    88: [0, 0.69444, 0, 0, 0.66667],
    89: [0, 0.69444, 0.025, 0, 0.66667],
    90: [0, 0.69444, 0, 0, 0.61111],
    91: [0.25, 0.75, 0, 0, 0.28889],
    93: [0.25, 0.75, 0, 0, 0.28889],
    94: [0, 0.69444, 0, 0, 0.5],
    95: [0.35, 0.09444, 0.02778, 0, 0.5],
    97: [0, 0.44444, 0, 0, 0.48056],
    98: [0, 0.69444, 0, 0, 0.51667],
    99: [0, 0.44444, 0, 0, 0.44445],
    100: [0, 0.69444, 0, 0, 0.51667],
    101: [0, 0.44444, 0, 0, 0.44445],
    102: [0, 0.69444, 0.06944, 0, 0.30556],
    103: [0.19444, 0.44444, 0.01389, 0, 0.5],
    104: [0, 0.69444, 0, 0, 0.51667],
    105: [0, 0.67937, 0, 0, 0.23889],
    106: [0.19444, 0.67937, 0, 0, 0.26667],
    107: [0, 0.69444, 0, 0, 0.48889],
    108: [0, 0.69444, 0, 0, 0.23889],
    109: [0, 0.44444, 0, 0, 0.79445],
    110: [0, 0.44444, 0, 0, 0.51667],
    111: [0, 0.44444, 0, 0, 0.5],
    112: [0.19444, 0.44444, 0, 0, 0.51667],
    113: [0.19444, 0.44444, 0, 0, 0.51667],
    114: [0, 0.44444, 0.01389, 0, 0.34167],
    115: [0, 0.44444, 0, 0, 0.38333],
    116: [0, 0.57143, 0, 0, 0.36111],
    117: [0, 0.44444, 0, 0, 0.51667],
    118: [0, 0.44444, 0.01389, 0, 0.46111],
    119: [0, 0.44444, 0.01389, 0, 0.68334],
    120: [0, 0.44444, 0, 0, 0.46111],
    121: [0.19444, 0.44444, 0.01389, 0, 0.46111],
    122: [0, 0.44444, 0, 0, 0.43472],
    126: [0.35, 0.32659, 0, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.67937, 0, 0, 0.5],
    176: [0, 0.69444, 0, 0, 0.66667],
    184: [0.17014, 0, 0, 0, 0.44445],
    305: [0, 0.44444, 0, 0, 0.23889],
    567: [0.19444, 0.44444, 0, 0, 0.26667],
    710: [0, 0.69444, 0, 0, 0.5],
    711: [0, 0.63194, 0, 0, 0.5],
    713: [0, 0.60889, 0, 0, 0.5],
    714: [0, 0.69444, 0, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0, 0, 0.5],
    729: [0, 0.67937, 0, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.66667],
    732: [0, 0.67659, 0, 0, 0.5],
    733: [0, 0.69444, 0, 0, 0.5],
    915: [0, 0.69444, 0, 0, 0.54167],
    916: [0, 0.69444, 0, 0, 0.83334],
    920: [0, 0.69444, 0, 0, 0.77778],
    923: [0, 0.69444, 0, 0, 0.61111],
    926: [0, 0.69444, 0, 0, 0.66667],
    928: [0, 0.69444, 0, 0, 0.70834],
    931: [0, 0.69444, 0, 0, 0.72222],
    933: [0, 0.69444, 0, 0, 0.77778],
    934: [0, 0.69444, 0, 0, 0.72222],
    936: [0, 0.69444, 0, 0, 0.77778],
    937: [0, 0.69444, 0, 0, 0.72222],
    8211: [0, 0.44444, 0.02778, 0, 0.5],
    8212: [0, 0.44444, 0.02778, 0, 1],
    8216: [0, 0.69444, 0, 0, 0.27778],
    8217: [0, 0.69444, 0, 0, 0.27778],
    8220: [0, 0.69444, 0, 0, 0.5],
    8221: [0, 0.69444, 0, 0, 0.5]
  },
  "Script-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.7, 0.22925, 0, 0.80253],
    66: [0, 0.7, 0.04087, 0, 0.90757],
    67: [0, 0.7, 0.1689, 0, 0.66619],
    68: [0, 0.7, 0.09371, 0, 0.77443],
    69: [0, 0.7, 0.18583, 0, 0.56162],
    70: [0, 0.7, 0.13634, 0, 0.89544],
    71: [0, 0.7, 0.17322, 0, 0.60961],
    72: [0, 0.7, 0.29694, 0, 0.96919],
    73: [0, 0.7, 0.19189, 0, 0.80907],
    74: [0.27778, 0.7, 0.19189, 0, 1.05159],
    75: [0, 0.7, 0.31259, 0, 0.91364],
    76: [0, 0.7, 0.19189, 0, 0.87373],
    77: [0, 0.7, 0.15981, 0, 1.08031],
    78: [0, 0.7, 0.3525, 0, 0.9015],
    79: [0, 0.7, 0.08078, 0, 0.73787],
    80: [0, 0.7, 0.08078, 0, 1.01262],
    81: [0, 0.7, 0.03305, 0, 0.88282],
    82: [0, 0.7, 0.06259, 0, 0.85],
    83: [0, 0.7, 0.19189, 0, 0.86767],
    84: [0, 0.7, 0.29087, 0, 0.74697],
    85: [0, 0.7, 0.25815, 0, 0.79996],
    86: [0, 0.7, 0.27523, 0, 0.62204],
    87: [0, 0.7, 0.27523, 0, 0.80532],
    88: [0, 0.7, 0.26006, 0, 0.94445],
    89: [0, 0.7, 0.2939, 0, 0.70961],
    90: [0, 0.7, 0.24037, 0, 0.8212],
    160: [0, 0, 0, 0, 0.25]
  },
  "Size1-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.35001, 0.85, 0, 0, 0.45834],
    41: [0.35001, 0.85, 0, 0, 0.45834],
    47: [0.35001, 0.85, 0, 0, 0.57778],
    91: [0.35001, 0.85, 0, 0, 0.41667],
    92: [0.35001, 0.85, 0, 0, 0.57778],
    93: [0.35001, 0.85, 0, 0, 0.41667],
    123: [0.35001, 0.85, 0, 0, 0.58334],
    125: [0.35001, 0.85, 0, 0, 0.58334],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.72222, 0, 0, 0.55556],
    732: [0, 0.72222, 0, 0, 0.55556],
    770: [0, 0.72222, 0, 0, 0.55556],
    771: [0, 0.72222, 0, 0, 0.55556],
    8214: [-99e-5, 0.601, 0, 0, 0.77778],
    8593: [1e-5, 0.6, 0, 0, 0.66667],
    8595: [1e-5, 0.6, 0, 0, 0.66667],
    8657: [1e-5, 0.6, 0, 0, 0.77778],
    8659: [1e-5, 0.6, 0, 0, 0.77778],
    8719: [0.25001, 0.75, 0, 0, 0.94445],
    8720: [0.25001, 0.75, 0, 0, 0.94445],
    8721: [0.25001, 0.75, 0, 0, 1.05556],
    8730: [0.35001, 0.85, 0, 0, 1],
    8739: [-599e-5, 0.606, 0, 0, 0.33333],
    8741: [-599e-5, 0.606, 0, 0, 0.55556],
    8747: [0.30612, 0.805, 0.19445, 0, 0.47222],
    8748: [0.306, 0.805, 0.19445, 0, 0.47222],
    8749: [0.306, 0.805, 0.19445, 0, 0.47222],
    8750: [0.30612, 0.805, 0.19445, 0, 0.47222],
    8896: [0.25001, 0.75, 0, 0, 0.83334],
    8897: [0.25001, 0.75, 0, 0, 0.83334],
    8898: [0.25001, 0.75, 0, 0, 0.83334],
    8899: [0.25001, 0.75, 0, 0, 0.83334],
    8968: [0.35001, 0.85, 0, 0, 0.47222],
    8969: [0.35001, 0.85, 0, 0, 0.47222],
    8970: [0.35001, 0.85, 0, 0, 0.47222],
    8971: [0.35001, 0.85, 0, 0, 0.47222],
    9168: [-99e-5, 0.601, 0, 0, 0.66667],
    10216: [0.35001, 0.85, 0, 0, 0.47222],
    10217: [0.35001, 0.85, 0, 0, 0.47222],
    10752: [0.25001, 0.75, 0, 0, 1.11111],
    10753: [0.25001, 0.75, 0, 0, 1.11111],
    10754: [0.25001, 0.75, 0, 0, 1.11111],
    10756: [0.25001, 0.75, 0, 0, 0.83334],
    10758: [0.25001, 0.75, 0, 0, 0.83334]
  },
  "Size2-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.65002, 1.15, 0, 0, 0.59722],
    41: [0.65002, 1.15, 0, 0, 0.59722],
    47: [0.65002, 1.15, 0, 0, 0.81111],
    91: [0.65002, 1.15, 0, 0, 0.47222],
    92: [0.65002, 1.15, 0, 0, 0.81111],
    93: [0.65002, 1.15, 0, 0, 0.47222],
    123: [0.65002, 1.15, 0, 0, 0.66667],
    125: [0.65002, 1.15, 0, 0, 0.66667],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.75, 0, 0, 1],
    732: [0, 0.75, 0, 0, 1],
    770: [0, 0.75, 0, 0, 1],
    771: [0, 0.75, 0, 0, 1],
    8719: [0.55001, 1.05, 0, 0, 1.27778],
    8720: [0.55001, 1.05, 0, 0, 1.27778],
    8721: [0.55001, 1.05, 0, 0, 1.44445],
    8730: [0.65002, 1.15, 0, 0, 1],
    8747: [0.86225, 1.36, 0.44445, 0, 0.55556],
    8748: [0.862, 1.36, 0.44445, 0, 0.55556],
    8749: [0.862, 1.36, 0.44445, 0, 0.55556],
    8750: [0.86225, 1.36, 0.44445, 0, 0.55556],
    8896: [0.55001, 1.05, 0, 0, 1.11111],
    8897: [0.55001, 1.05, 0, 0, 1.11111],
    8898: [0.55001, 1.05, 0, 0, 1.11111],
    8899: [0.55001, 1.05, 0, 0, 1.11111],
    8968: [0.65002, 1.15, 0, 0, 0.52778],
    8969: [0.65002, 1.15, 0, 0, 0.52778],
    8970: [0.65002, 1.15, 0, 0, 0.52778],
    8971: [0.65002, 1.15, 0, 0, 0.52778],
    10216: [0.65002, 1.15, 0, 0, 0.61111],
    10217: [0.65002, 1.15, 0, 0, 0.61111],
    10752: [0.55001, 1.05, 0, 0, 1.51112],
    10753: [0.55001, 1.05, 0, 0, 1.51112],
    10754: [0.55001, 1.05, 0, 0, 1.51112],
    10756: [0.55001, 1.05, 0, 0, 1.11111],
    10758: [0.55001, 1.05, 0, 0, 1.11111]
  },
  "Size3-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.95003, 1.45, 0, 0, 0.73611],
    41: [0.95003, 1.45, 0, 0, 0.73611],
    47: [0.95003, 1.45, 0, 0, 1.04445],
    91: [0.95003, 1.45, 0, 0, 0.52778],
    92: [0.95003, 1.45, 0, 0, 1.04445],
    93: [0.95003, 1.45, 0, 0, 0.52778],
    123: [0.95003, 1.45, 0, 0, 0.75],
    125: [0.95003, 1.45, 0, 0, 0.75],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.75, 0, 0, 1.44445],
    732: [0, 0.75, 0, 0, 1.44445],
    770: [0, 0.75, 0, 0, 1.44445],
    771: [0, 0.75, 0, 0, 1.44445],
    8730: [0.95003, 1.45, 0, 0, 1],
    8968: [0.95003, 1.45, 0, 0, 0.58334],
    8969: [0.95003, 1.45, 0, 0, 0.58334],
    8970: [0.95003, 1.45, 0, 0, 0.58334],
    8971: [0.95003, 1.45, 0, 0, 0.58334],
    10216: [0.95003, 1.45, 0, 0, 0.75],
    10217: [0.95003, 1.45, 0, 0, 0.75]
  },
  "Size4-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [1.25003, 1.75, 0, 0, 0.79167],
    41: [1.25003, 1.75, 0, 0, 0.79167],
    47: [1.25003, 1.75, 0, 0, 1.27778],
    91: [1.25003, 1.75, 0, 0, 0.58334],
    92: [1.25003, 1.75, 0, 0, 1.27778],
    93: [1.25003, 1.75, 0, 0, 0.58334],
    123: [1.25003, 1.75, 0, 0, 0.80556],
    125: [1.25003, 1.75, 0, 0, 0.80556],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.825, 0, 0, 1.8889],
    732: [0, 0.825, 0, 0, 1.8889],
    770: [0, 0.825, 0, 0, 1.8889],
    771: [0, 0.825, 0, 0, 1.8889],
    8730: [1.25003, 1.75, 0, 0, 1],
    8968: [1.25003, 1.75, 0, 0, 0.63889],
    8969: [1.25003, 1.75, 0, 0, 0.63889],
    8970: [1.25003, 1.75, 0, 0, 0.63889],
    8971: [1.25003, 1.75, 0, 0, 0.63889],
    9115: [0.64502, 1.155, 0, 0, 0.875],
    9116: [1e-5, 0.6, 0, 0, 0.875],
    9117: [0.64502, 1.155, 0, 0, 0.875],
    9118: [0.64502, 1.155, 0, 0, 0.875],
    9119: [1e-5, 0.6, 0, 0, 0.875],
    9120: [0.64502, 1.155, 0, 0, 0.875],
    9121: [0.64502, 1.155, 0, 0, 0.66667],
    9122: [-99e-5, 0.601, 0, 0, 0.66667],
    9123: [0.64502, 1.155, 0, 0, 0.66667],
    9124: [0.64502, 1.155, 0, 0, 0.66667],
    9125: [-99e-5, 0.601, 0, 0, 0.66667],
    9126: [0.64502, 1.155, 0, 0, 0.66667],
    9127: [1e-5, 0.9, 0, 0, 0.88889],
    9128: [0.65002, 1.15, 0, 0, 0.88889],
    9129: [0.90001, 0, 0, 0, 0.88889],
    9130: [0, 0.3, 0, 0, 0.88889],
    9131: [1e-5, 0.9, 0, 0, 0.88889],
    9132: [0.65002, 1.15, 0, 0, 0.88889],
    9133: [0.90001, 0, 0, 0, 0.88889],
    9143: [0.88502, 0.915, 0, 0, 1.05556],
    10216: [1.25003, 1.75, 0, 0, 0.80556],
    10217: [1.25003, 1.75, 0, 0, 0.80556],
    57344: [-499e-5, 0.605, 0, 0, 1.05556],
    57345: [-499e-5, 0.605, 0, 0, 1.05556],
    57680: [0, 0.12, 0, 0, 0.45],
    57681: [0, 0.12, 0, 0, 0.45],
    57682: [0, 0.12, 0, 0, 0.45],
    57683: [0, 0.12, 0, 0, 0.45]
  },
  "Typewriter-Regular": {
    32: [0, 0, 0, 0, 0.525],
    33: [0, 0.61111, 0, 0, 0.525],
    34: [0, 0.61111, 0, 0, 0.525],
    35: [0, 0.61111, 0, 0, 0.525],
    36: [0.08333, 0.69444, 0, 0, 0.525],
    37: [0.08333, 0.69444, 0, 0, 0.525],
    38: [0, 0.61111, 0, 0, 0.525],
    39: [0, 0.61111, 0, 0, 0.525],
    40: [0.08333, 0.69444, 0, 0, 0.525],
    41: [0.08333, 0.69444, 0, 0, 0.525],
    42: [0, 0.52083, 0, 0, 0.525],
    43: [-0.08056, 0.53055, 0, 0, 0.525],
    44: [0.13889, 0.125, 0, 0, 0.525],
    45: [-0.08056, 0.53055, 0, 0, 0.525],
    46: [0, 0.125, 0, 0, 0.525],
    47: [0.08333, 0.69444, 0, 0, 0.525],
    48: [0, 0.61111, 0, 0, 0.525],
    49: [0, 0.61111, 0, 0, 0.525],
    50: [0, 0.61111, 0, 0, 0.525],
    51: [0, 0.61111, 0, 0, 0.525],
    52: [0, 0.61111, 0, 0, 0.525],
    53: [0, 0.61111, 0, 0, 0.525],
    54: [0, 0.61111, 0, 0, 0.525],
    55: [0, 0.61111, 0, 0, 0.525],
    56: [0, 0.61111, 0, 0, 0.525],
    57: [0, 0.61111, 0, 0, 0.525],
    58: [0, 0.43056, 0, 0, 0.525],
    59: [0.13889, 0.43056, 0, 0, 0.525],
    60: [-0.05556, 0.55556, 0, 0, 0.525],
    61: [-0.19549, 0.41562, 0, 0, 0.525],
    62: [-0.05556, 0.55556, 0, 0, 0.525],
    63: [0, 0.61111, 0, 0, 0.525],
    64: [0, 0.61111, 0, 0, 0.525],
    65: [0, 0.61111, 0, 0, 0.525],
    66: [0, 0.61111, 0, 0, 0.525],
    67: [0, 0.61111, 0, 0, 0.525],
    68: [0, 0.61111, 0, 0, 0.525],
    69: [0, 0.61111, 0, 0, 0.525],
    70: [0, 0.61111, 0, 0, 0.525],
    71: [0, 0.61111, 0, 0, 0.525],
    72: [0, 0.61111, 0, 0, 0.525],
    73: [0, 0.61111, 0, 0, 0.525],
    74: [0, 0.61111, 0, 0, 0.525],
    75: [0, 0.61111, 0, 0, 0.525],
    76: [0, 0.61111, 0, 0, 0.525],
    77: [0, 0.61111, 0, 0, 0.525],
    78: [0, 0.61111, 0, 0, 0.525],
    79: [0, 0.61111, 0, 0, 0.525],
    80: [0, 0.61111, 0, 0, 0.525],
    81: [0.13889, 0.61111, 0, 0, 0.525],
    82: [0, 0.61111, 0, 0, 0.525],
    83: [0, 0.61111, 0, 0, 0.525],
    84: [0, 0.61111, 0, 0, 0.525],
    85: [0, 0.61111, 0, 0, 0.525],
    86: [0, 0.61111, 0, 0, 0.525],
    87: [0, 0.61111, 0, 0, 0.525],
    88: [0, 0.61111, 0, 0, 0.525],
    89: [0, 0.61111, 0, 0, 0.525],
    90: [0, 0.61111, 0, 0, 0.525],
    91: [0.08333, 0.69444, 0, 0, 0.525],
    92: [0.08333, 0.69444, 0, 0, 0.525],
    93: [0.08333, 0.69444, 0, 0, 0.525],
    94: [0, 0.61111, 0, 0, 0.525],
    95: [0.09514, 0, 0, 0, 0.525],
    96: [0, 0.61111, 0, 0, 0.525],
    97: [0, 0.43056, 0, 0, 0.525],
    98: [0, 0.61111, 0, 0, 0.525],
    99: [0, 0.43056, 0, 0, 0.525],
    100: [0, 0.61111, 0, 0, 0.525],
    101: [0, 0.43056, 0, 0, 0.525],
    102: [0, 0.61111, 0, 0, 0.525],
    103: [0.22222, 0.43056, 0, 0, 0.525],
    104: [0, 0.61111, 0, 0, 0.525],
    105: [0, 0.61111, 0, 0, 0.525],
    106: [0.22222, 0.61111, 0, 0, 0.525],
    107: [0, 0.61111, 0, 0, 0.525],
    108: [0, 0.61111, 0, 0, 0.525],
    109: [0, 0.43056, 0, 0, 0.525],
    110: [0, 0.43056, 0, 0, 0.525],
    111: [0, 0.43056, 0, 0, 0.525],
    112: [0.22222, 0.43056, 0, 0, 0.525],
    113: [0.22222, 0.43056, 0, 0, 0.525],
    114: [0, 0.43056, 0, 0, 0.525],
    115: [0, 0.43056, 0, 0, 0.525],
    116: [0, 0.55358, 0, 0, 0.525],
    117: [0, 0.43056, 0, 0, 0.525],
    118: [0, 0.43056, 0, 0, 0.525],
    119: [0, 0.43056, 0, 0, 0.525],
    120: [0, 0.43056, 0, 0, 0.525],
    121: [0.22222, 0.43056, 0, 0, 0.525],
    122: [0, 0.43056, 0, 0, 0.525],
    123: [0.08333, 0.69444, 0, 0, 0.525],
    124: [0.08333, 0.69444, 0, 0, 0.525],
    125: [0.08333, 0.69444, 0, 0, 0.525],
    126: [0, 0.61111, 0, 0, 0.525],
    127: [0, 0.61111, 0, 0, 0.525],
    160: [0, 0, 0, 0, 0.525],
    176: [0, 0.61111, 0, 0, 0.525],
    184: [0.19445, 0, 0, 0, 0.525],
    305: [0, 0.43056, 0, 0, 0.525],
    567: [0.22222, 0.43056, 0, 0, 0.525],
    711: [0, 0.56597, 0, 0, 0.525],
    713: [0, 0.56555, 0, 0, 0.525],
    714: [0, 0.61111, 0, 0, 0.525],
    715: [0, 0.61111, 0, 0, 0.525],
    728: [0, 0.61111, 0, 0, 0.525],
    730: [0, 0.61111, 0, 0, 0.525],
    770: [0, 0.61111, 0, 0, 0.525],
    771: [0, 0.61111, 0, 0, 0.525],
    776: [0, 0.61111, 0, 0, 0.525],
    915: [0, 0.61111, 0, 0, 0.525],
    916: [0, 0.61111, 0, 0, 0.525],
    920: [0, 0.61111, 0, 0, 0.525],
    923: [0, 0.61111, 0, 0, 0.525],
    926: [0, 0.61111, 0, 0, 0.525],
    928: [0, 0.61111, 0, 0, 0.525],
    931: [0, 0.61111, 0, 0, 0.525],
    933: [0, 0.61111, 0, 0, 0.525],
    934: [0, 0.61111, 0, 0, 0.525],
    936: [0, 0.61111, 0, 0, 0.525],
    937: [0, 0.61111, 0, 0, 0.525],
    8216: [0, 0.61111, 0, 0, 0.525],
    8217: [0, 0.61111, 0, 0, 0.525],
    8242: [0, 0.61111, 0, 0, 0.525],
    9251: [0.11111, 0.21944, 0, 0, 0.525]
  }
}, Ht = {
  slant: [0.25, 0.25, 0.25],
  // sigma1
  space: [0, 0, 0],
  // sigma2
  stretch: [0, 0, 0],
  // sigma3
  shrink: [0, 0, 0],
  // sigma4
  xHeight: [0.431, 0.431, 0.431],
  // sigma5
  quad: [1, 1.171, 1.472],
  // sigma6
  extraSpace: [0, 0, 0],
  // sigma7
  num1: [0.677, 0.732, 0.925],
  // sigma8
  num2: [0.394, 0.384, 0.387],
  // sigma9
  num3: [0.444, 0.471, 0.504],
  // sigma10
  denom1: [0.686, 0.752, 1.025],
  // sigma11
  denom2: [0.345, 0.344, 0.532],
  // sigma12
  sup1: [0.413, 0.503, 0.504],
  // sigma13
  sup2: [0.363, 0.431, 0.404],
  // sigma14
  sup3: [0.289, 0.286, 0.294],
  // sigma15
  sub1: [0.15, 0.143, 0.2],
  // sigma16
  sub2: [0.247, 0.286, 0.4],
  // sigma17
  supDrop: [0.386, 0.353, 0.494],
  // sigma18
  subDrop: [0.05, 0.071, 0.1],
  // sigma19
  delim1: [2.39, 1.7, 1.98],
  // sigma20
  delim2: [1.01, 1.157, 1.42],
  // sigma21
  axisHeight: [0.25, 0.25, 0.25],
  // sigma22
  // These font metrics are extracted from TeX by using tftopl on cmex10.tfm;
  // they correspond to the font parameters of the extension fonts (family 3).
  // See the TeXbook, page 441. In AMSTeX, the extension fonts scale; to
  // match cmex7, we'd use cmex7.tfm values for script and scriptscript
  // values.
  defaultRuleThickness: [0.04, 0.049, 0.049],
  // xi8; cmex7: 0.049
  bigOpSpacing1: [0.111, 0.111, 0.111],
  // xi9
  bigOpSpacing2: [0.166, 0.166, 0.166],
  // xi10
  bigOpSpacing3: [0.2, 0.2, 0.2],
  // xi11
  bigOpSpacing4: [0.6, 0.611, 0.611],
  // xi12; cmex7: 0.611
  bigOpSpacing5: [0.1, 0.143, 0.143],
  // xi13; cmex7: 0.143
  // The \sqrt rule width is taken from the height of the surd character.
  // Since we use the same font at all sizes, this thickness doesn't scale.
  sqrtRuleThickness: [0.04, 0.04, 0.04],
  // This value determines how large a pt is, for metrics which are defined
  // in terms of pts.
  // This value is also used in katex.scss; if you change it make sure the
  // values match.
  ptPerEm: [10, 10, 10],
  // The space between adjacent `|` columns in an array definition. From
  // `\showthe\doublerulesep` in LaTeX. Equals 2.0 / ptPerEm.
  doubleRuleSep: [0.2, 0.2, 0.2],
  // The width of separator lines in {array} environments. From
  // `\showthe\arrayrulewidth` in LaTeX. Equals 0.4 / ptPerEm.
  arrayRuleWidth: [0.04, 0.04, 0.04],
  // Two values from LaTeX source2e:
  fboxsep: [0.3, 0.3, 0.3],
  //        3 pt / ptPerEm
  fboxrule: [0.04, 0.04, 0.04]
  // 0.4 pt / ptPerEm
}, Ba = {
  // Latin-1
  Å: "A",
  Ð: "D",
  Þ: "o",
  å: "a",
  ð: "d",
  þ: "o",
  // Cyrillic
  А: "A",
  Б: "B",
  В: "B",
  Г: "F",
  Д: "A",
  Е: "E",
  Ж: "K",
  З: "3",
  И: "N",
  Й: "N",
  К: "K",
  Л: "N",
  М: "M",
  Н: "H",
  О: "O",
  П: "N",
  Р: "P",
  С: "C",
  Т: "T",
  У: "y",
  Ф: "O",
  Х: "X",
  Ц: "U",
  Ч: "h",
  Ш: "W",
  Щ: "W",
  Ъ: "B",
  Ы: "X",
  Ь: "B",
  Э: "3",
  Ю: "X",
  Я: "R",
  а: "a",
  б: "b",
  в: "a",
  г: "r",
  д: "y",
  е: "e",
  ж: "m",
  з: "e",
  и: "n",
  й: "n",
  к: "n",
  л: "n",
  м: "m",
  н: "n",
  о: "o",
  п: "n",
  р: "p",
  с: "c",
  т: "o",
  у: "y",
  ф: "b",
  х: "x",
  ц: "n",
  ч: "n",
  ш: "w",
  щ: "w",
  ъ: "a",
  ы: "m",
  ь: "a",
  э: "e",
  ю: "m",
  я: "r"
};
function Mu(t, e, r) {
  if (!Ee[e])
    throw new Error("Font metrics not found for font: " + e + ".");
  var u = t.charCodeAt(0), a = Ee[e][u];
  if (!a && t[0] in Ba && (u = Ba[t[0]].charCodeAt(0), a = Ee[e][u]), !a && r === "text" && Xn(u) && (a = Ee[e][77]), a)
    return {
      depth: a[0],
      height: a[1],
      italic: a[2],
      skew: a[3],
      width: a[4]
    };
}
var Hr = {};
function Mo(t) {
  var e;
  if (t >= 5 ? e = 0 : t >= 3 ? e = 1 : e = 2, !Hr[e]) {
    var r = Hr[e] = {
      cssEmPerMu: Ht.quad[e] / 18
    };
    for (var u in Ht)
      Ht.hasOwnProperty(u) && (r[u] = Ht[u][e]);
  }
  return Hr[e];
}
var Fo = [
  // Each element contains [textsize, scriptsize, scriptscriptsize].
  // The size mappings are taken from TeX with \normalsize=10pt.
  [1, 1, 1],
  // size1: [5, 5, 5]              \tiny
  [2, 1, 1],
  // size2: [6, 5, 5]
  [3, 1, 1],
  // size3: [7, 5, 5]              \scriptsize
  [4, 2, 1],
  // size4: [8, 6, 5]              \footnotesize
  [5, 2, 1],
  // size5: [9, 6, 5]              \small
  [6, 3, 1],
  // size6: [10, 7, 5]             \normalsize
  [7, 4, 2],
  // size7: [12, 8, 6]             \large
  [8, 6, 3],
  // size8: [14.4, 10, 7]          \Large
  [9, 7, 6],
  // size9: [17.28, 12, 10]        \LARGE
  [10, 8, 7],
  // size10: [20.74, 14.4, 12]     \huge
  [11, 10, 9]
  // size11: [24.88, 20.74, 17.28] \HUGE
], Ia = [
  // fontMetrics.js:getGlobalMetrics also uses size indexes, so if
  // you change size indexes, change that function.
  0.5,
  0.6,
  0.7,
  0.8,
  0.9,
  1,
  1.2,
  1.44,
  1.728,
  2.074,
  2.488
], Ra = function(e, r) {
  return r.size < 2 ? e : Fo[e - 1][r.size - 1];
};
class Ce {
  // A font family applies to a group of fonts (i.e. SansSerif), while a font
  // represents a specific font (i.e. SansSerif Bold).
  // See: https://tex.stackexchange.com/questions/22350/difference-between-textrm-and-mathrm
  /**
   * The base size index.
   */
  constructor(e) {
    this.style = void 0, this.color = void 0, this.size = void 0, this.textSize = void 0, this.phantom = void 0, this.font = void 0, this.fontFamily = void 0, this.fontWeight = void 0, this.fontShape = void 0, this.sizeMultiplier = void 0, this.maxSize = void 0, this.minRuleThickness = void 0, this._fontMetrics = void 0, this.style = e.style, this.color = e.color, this.size = e.size || Ce.BASESIZE, this.textSize = e.textSize || this.size, this.phantom = !!e.phantom, this.font = e.font || "", this.fontFamily = e.fontFamily || "", this.fontWeight = e.fontWeight || "", this.fontShape = e.fontShape || "", this.sizeMultiplier = Ia[this.size - 1], this.maxSize = e.maxSize, this.minRuleThickness = e.minRuleThickness, this._fontMetrics = void 0;
  }
  /**
   * Returns a new options object with the same properties as "this".  Properties
   * from "extension" will be copied to the new options object.
   */
  extend(e) {
    var r = {
      style: this.style,
      size: this.size,
      textSize: this.textSize,
      color: this.color,
      phantom: this.phantom,
      font: this.font,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      fontShape: this.fontShape,
      maxSize: this.maxSize,
      minRuleThickness: this.minRuleThickness
    };
    for (var u in e)
      e.hasOwnProperty(u) && (r[u] = e[u]);
    return new Ce(r);
  }
  /**
   * Return an options object with the given style. If `this.style === style`,
   * returns `this`.
   */
  havingStyle(e) {
    return this.style === e ? this : this.extend({
      style: e,
      size: Ra(this.textSize, e)
    });
  }
  /**
   * Return an options object with a cramped version of the current style. If
   * the current style is cramped, returns `this`.
   */
  havingCrampedStyle() {
    return this.havingStyle(this.style.cramp());
  }
  /**
   * Return an options object with the given size and in at least `\textstyle`.
   * Returns `this` if appropriate.
   */
  havingSize(e) {
    return this.size === e && this.textSize === e ? this : this.extend({
      style: this.style.text(),
      size: e,
      textSize: e,
      sizeMultiplier: Ia[e - 1]
    });
  }
  /**
   * Like `this.havingSize(BASESIZE).havingStyle(style)`. If `style` is omitted,
   * changes to at least `\textstyle`.
   */
  havingBaseStyle(e) {
    e = e || this.style.text();
    var r = Ra(Ce.BASESIZE, e);
    return this.size === r && this.textSize === Ce.BASESIZE && this.style === e ? this : this.extend({
      style: e,
      size: r
    });
  }
  /**
   * Remove the effect of sizing changes such as \Huge.
   * Keep the effect of the current style, such as \scriptstyle.
   */
  havingBaseSizing() {
    var e;
    switch (this.style.id) {
      case 4:
      case 5:
        e = 3;
        break;
      case 6:
      case 7:
        e = 1;
        break;
      default:
        e = 6;
    }
    return this.extend({
      style: this.style.text(),
      size: e
    });
  }
  /**
   * Create a new options object with the given color.
   */
  withColor(e) {
    return this.extend({
      color: e
    });
  }
  /**
   * Create a new options object with "phantom" set to true.
   */
  withPhantom() {
    return this.extend({
      phantom: !0
    });
  }
  /**
   * Creates a new options object with the given math font or old text font.
   * @type {[type]}
   */
  withFont(e) {
    return this.extend({
      font: e
    });
  }
  /**
   * Create a new options objects with the given fontFamily.
   */
  withTextFontFamily(e) {
    return this.extend({
      fontFamily: e,
      font: ""
    });
  }
  /**
   * Creates a new options object with the given font weight
   */
  withTextFontWeight(e) {
    return this.extend({
      fontWeight: e,
      font: ""
    });
  }
  /**
   * Creates a new options object with the given font weight
   */
  withTextFontShape(e) {
    return this.extend({
      fontShape: e,
      font: ""
    });
  }
  /**
   * Return the CSS sizing classes required to switch from enclosing options
   * `oldOptions` to `this`. Returns an array of classes.
   */
  sizingClasses(e) {
    return e.size !== this.size ? ["sizing", "reset-size" + e.size, "size" + this.size] : [];
  }
  /**
   * Return the CSS sizing classes required to switch to the base size. Like
   * `this.havingSize(BASESIZE).sizingClasses(this)`.
   */
  baseSizingClasses() {
    return this.size !== Ce.BASESIZE ? ["sizing", "reset-size" + this.size, "size" + Ce.BASESIZE] : [];
  }
  /**
   * Return the font metrics for this size.
   */
  fontMetrics() {
    return this._fontMetrics || (this._fontMetrics = Mo(this.size)), this._fontMetrics;
  }
  /**
   * Gets the CSS color of the current options object
   */
  getColor() {
    return this.phantom ? "transparent" : this.color;
  }
}
Ce.BASESIZE = 6;
var du = {
  // https://en.wikibooks.org/wiki/LaTeX/Lengths and
  // https://tex.stackexchange.com/a/8263
  pt: 1,
  // TeX point
  mm: 7227 / 2540,
  // millimeter
  cm: 7227 / 254,
  // centimeter
  in: 72.27,
  // inch
  bp: 803 / 800,
  // big (PostScript) points
  pc: 12,
  // pica
  dd: 1238 / 1157,
  // didot
  cc: 14856 / 1157,
  // cicero (12 didot)
  nd: 685 / 642,
  // new didot
  nc: 1370 / 107,
  // new cicero (12 new didot)
  sp: 1 / 65536,
  // scaled point (TeX's internal smallest unit)
  // https://tex.stackexchange.com/a/41371
  px: 803 / 800
  // \pdfpxdimen defaults to 1 bp in pdfTeX and LuaTeX
}, zo = {
  ex: !0,
  em: !0,
  mu: !0
}, Kn = function(e) {
  return typeof e != "string" && (e = e.unit), e in du || e in zo || e === "ex";
}, f0 = function(e, r) {
  var u;
  if (e.unit in du)
    u = du[e.unit] / r.fontMetrics().ptPerEm / r.sizeMultiplier;
  else if (e.unit === "mu")
    u = r.fontMetrics().cssEmPerMu;
  else {
    var a;
    if (r.style.isTight() ? a = r.havingStyle(r.style.text()) : a = r, e.unit === "ex")
      u = a.fontMetrics().xHeight;
    else if (e.unit === "em")
      u = a.fontMetrics().quad;
    else
      throw new R("Invalid unit: '" + e.unit + "'");
    a !== r && (u *= a.sizeMultiplier / r.sizeMultiplier);
  }
  return Math.min(e.number * u, r.maxSize);
}, O = function(e) {
  return +e.toFixed(4) + "em";
}, He = function(e) {
  return e.filter((r) => r).join(" ");
}, Jn = function(e, r, u) {
  if (this.classes = e || [], this.attributes = {}, this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = u || {}, r) {
    r.style.isTight() && this.classes.push("mtight");
    var a = r.getColor();
    a && (this.style.color = a);
  }
}, Qn = function(e) {
  var r = document.createElement(e);
  r.className = He(this.classes);
  for (var u in this.style)
    this.style.hasOwnProperty(u) && (r.style[u] = this.style[u]);
  for (var a in this.attributes)
    this.attributes.hasOwnProperty(a) && r.setAttribute(a, this.attributes[a]);
  for (var n = 0; n < this.children.length; n++)
    r.appendChild(this.children[n].toNode());
  return r;
}, Bo = /[\s"'>/=\x00-\x1f]/, e1 = function(e) {
  var r = "<" + e;
  this.classes.length && (r += ' class="' + t0.escape(He(this.classes)) + '"');
  var u = "";
  for (var a in this.style)
    this.style.hasOwnProperty(a) && (u += t0.hyphenate(a) + ":" + this.style[a] + ";");
  u && (r += ' style="' + t0.escape(u) + '"');
  for (var n in this.attributes)
    if (this.attributes.hasOwnProperty(n)) {
      if (Bo.test(n))
        throw new R("Invalid attribute name '" + n + "'");
      r += " " + n + '="' + t0.escape(this.attributes[n]) + '"';
    }
  r += ">";
  for (var i = 0; i < this.children.length; i++)
    r += this.children[i].toMarkup();
  return r += "</" + e + ">", r;
};
class fr {
  constructor(e, r, u, a) {
    this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.width = void 0, this.maxFontSize = void 0, this.style = void 0, Jn.call(this, e, u, a), this.children = r || [];
  }
  /**
   * Sets an arbitrary attribute on the span. Warning: use this wisely. Not
   * all browsers support attributes the same, and having too many custom
   * attributes is probably bad.
   */
  setAttribute(e, r) {
    this.attributes[e] = r;
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  toNode() {
    return Qn.call(this, "span");
  }
  toMarkup() {
    return e1.call(this, "span");
  }
}
class t1 {
  constructor(e, r, u, a) {
    this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, Jn.call(this, r, a), this.children = u || [], this.setAttribute("href", e);
  }
  setAttribute(e, r) {
    this.attributes[e] = r;
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  toNode() {
    return Qn.call(this, "a");
  }
  toMarkup() {
    return e1.call(this, "a");
  }
}
class Io {
  constructor(e, r, u) {
    this.src = void 0, this.alt = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.alt = r, this.src = e, this.classes = ["mord"], this.style = u;
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  toNode() {
    var e = document.createElement("img");
    e.src = this.src, e.alt = this.alt, e.className = "mord";
    for (var r in this.style)
      this.style.hasOwnProperty(r) && (e.style[r] = this.style[r]);
    return e;
  }
  toMarkup() {
    var e = '<img src="' + t0.escape(this.src) + '"' + (' alt="' + t0.escape(this.alt) + '"'), r = "";
    for (var u in this.style)
      this.style.hasOwnProperty(u) && (r += t0.hyphenate(u) + ":" + this.style[u] + ";");
    return r && (e += ' style="' + t0.escape(r) + '"'), e += "'/>", e;
  }
}
var Ro = {
  î: "ı̂",
  ï: "ı̈",
  í: "ı́",
  // 'ī': '\u0131\u0304', // enable when we add Extended Latin
  ì: "ı̀"
};
class ae {
  constructor(e, r, u, a, n, i, s, o) {
    this.text = void 0, this.height = void 0, this.depth = void 0, this.italic = void 0, this.skew = void 0, this.width = void 0, this.maxFontSize = void 0, this.classes = void 0, this.style = void 0, this.text = e, this.height = r || 0, this.depth = u || 0, this.italic = a || 0, this.skew = n || 0, this.width = i || 0, this.classes = s || [], this.style = o || {}, this.maxFontSize = 0;
    var h = xo(this.text.charCodeAt(0));
    h && this.classes.push(h + "_fallback"), /[îïíì]/.test(this.text) && (this.text = Ro[this.text]);
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  /**
   * Creates a text node or span from a symbol node. Note that a span is only
   * created if it is needed.
   */
  toNode() {
    var e = document.createTextNode(this.text), r = null;
    this.italic > 0 && (r = document.createElement("span"), r.style.marginRight = O(this.italic)), this.classes.length > 0 && (r = r || document.createElement("span"), r.className = He(this.classes));
    for (var u in this.style)
      this.style.hasOwnProperty(u) && (r = r || document.createElement("span"), r.style[u] = this.style[u]);
    return r ? (r.appendChild(e), r) : e;
  }
  /**
   * Creates markup for a symbol node.
   */
  toMarkup() {
    var e = !1, r = "<span";
    this.classes.length && (e = !0, r += ' class="', r += t0.escape(He(this.classes)), r += '"');
    var u = "";
    this.italic > 0 && (u += "margin-right:" + this.italic + "em;");
    for (var a in this.style)
      this.style.hasOwnProperty(a) && (u += t0.hyphenate(a) + ":" + this.style[a] + ";");
    u && (e = !0, r += ' style="' + t0.escape(u) + '"');
    var n = t0.escape(this.text);
    return e ? (r += ">", r += n, r += "</span>", r) : n;
  }
}
class $e {
  constructor(e, r) {
    this.children = void 0, this.attributes = void 0, this.children = e || [], this.attributes = r || {};
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", r = document.createElementNS(e, "svg");
    for (var u in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, u) && r.setAttribute(u, this.attributes[u]);
    for (var a = 0; a < this.children.length; a++)
      r.appendChild(this.children[a].toNode());
    return r;
  }
  toMarkup() {
    var e = '<svg xmlns="http://www.w3.org/2000/svg"';
    for (var r in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, r) && (e += " " + r + '="' + t0.escape(this.attributes[r]) + '"');
    e += ">";
    for (var u = 0; u < this.children.length; u++)
      e += this.children[u].toMarkup();
    return e += "</svg>", e;
  }
}
class Ye {
  constructor(e, r) {
    this.pathName = void 0, this.alternate = void 0, this.pathName = e, this.alternate = r;
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", r = document.createElementNS(e, "path");
    return this.alternate ? r.setAttribute("d", this.alternate) : r.setAttribute("d", za[this.pathName]), r;
  }
  toMarkup() {
    return this.alternate ? '<path d="' + t0.escape(this.alternate) + '"/>' : '<path d="' + t0.escape(za[this.pathName]) + '"/>';
  }
}
class Na {
  constructor(e) {
    this.attributes = void 0, this.attributes = e || {};
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", r = document.createElementNS(e, "line");
    for (var u in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, u) && r.setAttribute(u, this.attributes[u]);
    return r;
  }
  toMarkup() {
    var e = "<line";
    for (var r in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, r) && (e += " " + r + '="' + t0.escape(this.attributes[r]) + '"');
    return e += "/>", e;
  }
}
function La(t) {
  if (t instanceof ae)
    return t;
  throw new Error("Expected symbolNode but got " + String(t) + ".");
}
function No(t) {
  if (t instanceof fr)
    return t;
  throw new Error("Expected span<HtmlDomNode> but got " + String(t) + ".");
}
var Lo = {
  bin: 1,
  close: 1,
  inner: 1,
  open: 1,
  punct: 1,
  rel: 1
}, Oo = {
  "accent-token": 1,
  mathord: 1,
  "op-token": 1,
  spacing: 1,
  textord: 1
}, i0 = {
  math: {},
  text: {}
};
function l(t, e, r, u, a, n) {
  i0[t][a] = {
    font: e,
    group: r,
    replace: u
  }, n && u && (i0[t][u] = i0[t][a]);
}
var c = "math", B = "text", d = "main", b = "ams", h0 = "accent-token", H = "bin", N0 = "close", dt = "inner", V = "mathord", v0 = "op-token", Z0 = "open", mr = "punct", g = "rel", ze = "spacing", S = "textord";
l(c, d, g, "≡", "\\equiv", !0);
l(c, d, g, "≺", "\\prec", !0);
l(c, d, g, "≻", "\\succ", !0);
l(c, d, g, "∼", "\\sim", !0);
l(c, d, g, "⊥", "\\perp");
l(c, d, g, "⪯", "\\preceq", !0);
l(c, d, g, "⪰", "\\succeq", !0);
l(c, d, g, "≃", "\\simeq", !0);
l(c, d, g, "∣", "\\mid", !0);
l(c, d, g, "≪", "\\ll", !0);
l(c, d, g, "≫", "\\gg", !0);
l(c, d, g, "≍", "\\asymp", !0);
l(c, d, g, "∥", "\\parallel");
l(c, d, g, "⋈", "\\bowtie", !0);
l(c, d, g, "⌣", "\\smile", !0);
l(c, d, g, "⊑", "\\sqsubseteq", !0);
l(c, d, g, "⊒", "\\sqsupseteq", !0);
l(c, d, g, "≐", "\\doteq", !0);
l(c, d, g, "⌢", "\\frown", !0);
l(c, d, g, "∋", "\\ni", !0);
l(c, d, g, "∝", "\\propto", !0);
l(c, d, g, "⊢", "\\vdash", !0);
l(c, d, g, "⊣", "\\dashv", !0);
l(c, d, g, "∋", "\\owns");
l(c, d, mr, ".", "\\ldotp");
l(c, d, mr, "⋅", "\\cdotp");
l(c, d, S, "#", "\\#");
l(B, d, S, "#", "\\#");
l(c, d, S, "&", "\\&");
l(B, d, S, "&", "\\&");
l(c, d, S, "ℵ", "\\aleph", !0);
l(c, d, S, "∀", "\\forall", !0);
l(c, d, S, "ℏ", "\\hbar", !0);
l(c, d, S, "∃", "\\exists", !0);
l(c, d, S, "∇", "\\nabla", !0);
l(c, d, S, "♭", "\\flat", !0);
l(c, d, S, "ℓ", "\\ell", !0);
l(c, d, S, "♮", "\\natural", !0);
l(c, d, S, "♣", "\\clubsuit", !0);
l(c, d, S, "℘", "\\wp", !0);
l(c, d, S, "♯", "\\sharp", !0);
l(c, d, S, "♢", "\\diamondsuit", !0);
l(c, d, S, "ℜ", "\\Re", !0);
l(c, d, S, "♡", "\\heartsuit", !0);
l(c, d, S, "ℑ", "\\Im", !0);
l(c, d, S, "♠", "\\spadesuit", !0);
l(c, d, S, "§", "\\S", !0);
l(B, d, S, "§", "\\S");
l(c, d, S, "¶", "\\P", !0);
l(B, d, S, "¶", "\\P");
l(c, d, S, "†", "\\dag");
l(B, d, S, "†", "\\dag");
l(B, d, S, "†", "\\textdagger");
l(c, d, S, "‡", "\\ddag");
l(B, d, S, "‡", "\\ddag");
l(B, d, S, "‡", "\\textdaggerdbl");
l(c, d, N0, "⎱", "\\rmoustache", !0);
l(c, d, Z0, "⎰", "\\lmoustache", !0);
l(c, d, N0, "⟯", "\\rgroup", !0);
l(c, d, Z0, "⟮", "\\lgroup", !0);
l(c, d, H, "∓", "\\mp", !0);
l(c, d, H, "⊖", "\\ominus", !0);
l(c, d, H, "⊎", "\\uplus", !0);
l(c, d, H, "⊓", "\\sqcap", !0);
l(c, d, H, "∗", "\\ast");
l(c, d, H, "⊔", "\\sqcup", !0);
l(c, d, H, "◯", "\\bigcirc", !0);
l(c, d, H, "∙", "\\bullet", !0);
l(c, d, H, "‡", "\\ddagger");
l(c, d, H, "≀", "\\wr", !0);
l(c, d, H, "⨿", "\\amalg");
l(c, d, H, "&", "\\And");
l(c, d, g, "⟵", "\\longleftarrow", !0);
l(c, d, g, "⇐", "\\Leftarrow", !0);
l(c, d, g, "⟸", "\\Longleftarrow", !0);
l(c, d, g, "⟶", "\\longrightarrow", !0);
l(c, d, g, "⇒", "\\Rightarrow", !0);
l(c, d, g, "⟹", "\\Longrightarrow", !0);
l(c, d, g, "↔", "\\leftrightarrow", !0);
l(c, d, g, "⟷", "\\longleftrightarrow", !0);
l(c, d, g, "⇔", "\\Leftrightarrow", !0);
l(c, d, g, "⟺", "\\Longleftrightarrow", !0);
l(c, d, g, "↦", "\\mapsto", !0);
l(c, d, g, "⟼", "\\longmapsto", !0);
l(c, d, g, "↗", "\\nearrow", !0);
l(c, d, g, "↩", "\\hookleftarrow", !0);
l(c, d, g, "↪", "\\hookrightarrow", !0);
l(c, d, g, "↘", "\\searrow", !0);
l(c, d, g, "↼", "\\leftharpoonup", !0);
l(c, d, g, "⇀", "\\rightharpoonup", !0);
l(c, d, g, "↙", "\\swarrow", !0);
l(c, d, g, "↽", "\\leftharpoondown", !0);
l(c, d, g, "⇁", "\\rightharpoondown", !0);
l(c, d, g, "↖", "\\nwarrow", !0);
l(c, d, g, "⇌", "\\rightleftharpoons", !0);
l(c, b, g, "≮", "\\nless", !0);
l(c, b, g, "", "\\@nleqslant");
l(c, b, g, "", "\\@nleqq");
l(c, b, g, "⪇", "\\lneq", !0);
l(c, b, g, "≨", "\\lneqq", !0);
l(c, b, g, "", "\\@lvertneqq");
l(c, b, g, "⋦", "\\lnsim", !0);
l(c, b, g, "⪉", "\\lnapprox", !0);
l(c, b, g, "⊀", "\\nprec", !0);
l(c, b, g, "⋠", "\\npreceq", !0);
l(c, b, g, "⋨", "\\precnsim", !0);
l(c, b, g, "⪹", "\\precnapprox", !0);
l(c, b, g, "≁", "\\nsim", !0);
l(c, b, g, "", "\\@nshortmid");
l(c, b, g, "∤", "\\nmid", !0);
l(c, b, g, "⊬", "\\nvdash", !0);
l(c, b, g, "⊭", "\\nvDash", !0);
l(c, b, g, "⋪", "\\ntriangleleft");
l(c, b, g, "⋬", "\\ntrianglelefteq", !0);
l(c, b, g, "⊊", "\\subsetneq", !0);
l(c, b, g, "", "\\@varsubsetneq");
l(c, b, g, "⫋", "\\subsetneqq", !0);
l(c, b, g, "", "\\@varsubsetneqq");
l(c, b, g, "≯", "\\ngtr", !0);
l(c, b, g, "", "\\@ngeqslant");
l(c, b, g, "", "\\@ngeqq");
l(c, b, g, "⪈", "\\gneq", !0);
l(c, b, g, "≩", "\\gneqq", !0);
l(c, b, g, "", "\\@gvertneqq");
l(c, b, g, "⋧", "\\gnsim", !0);
l(c, b, g, "⪊", "\\gnapprox", !0);
l(c, b, g, "⊁", "\\nsucc", !0);
l(c, b, g, "⋡", "\\nsucceq", !0);
l(c, b, g, "⋩", "\\succnsim", !0);
l(c, b, g, "⪺", "\\succnapprox", !0);
l(c, b, g, "≆", "\\ncong", !0);
l(c, b, g, "", "\\@nshortparallel");
l(c, b, g, "∦", "\\nparallel", !0);
l(c, b, g, "⊯", "\\nVDash", !0);
l(c, b, g, "⋫", "\\ntriangleright");
l(c, b, g, "⋭", "\\ntrianglerighteq", !0);
l(c, b, g, "", "\\@nsupseteqq");
l(c, b, g, "⊋", "\\supsetneq", !0);
l(c, b, g, "", "\\@varsupsetneq");
l(c, b, g, "⫌", "\\supsetneqq", !0);
l(c, b, g, "", "\\@varsupsetneqq");
l(c, b, g, "⊮", "\\nVdash", !0);
l(c, b, g, "⪵", "\\precneqq", !0);
l(c, b, g, "⪶", "\\succneqq", !0);
l(c, b, g, "", "\\@nsubseteqq");
l(c, b, H, "⊴", "\\unlhd");
l(c, b, H, "⊵", "\\unrhd");
l(c, b, g, "↚", "\\nleftarrow", !0);
l(c, b, g, "↛", "\\nrightarrow", !0);
l(c, b, g, "⇍", "\\nLeftarrow", !0);
l(c, b, g, "⇏", "\\nRightarrow", !0);
l(c, b, g, "↮", "\\nleftrightarrow", !0);
l(c, b, g, "⇎", "\\nLeftrightarrow", !0);
l(c, b, g, "△", "\\vartriangle");
l(c, b, S, "ℏ", "\\hslash");
l(c, b, S, "▽", "\\triangledown");
l(c, b, S, "◊", "\\lozenge");
l(c, b, S, "Ⓢ", "\\circledS");
l(c, b, S, "®", "\\circledR");
l(B, b, S, "®", "\\circledR");
l(c, b, S, "∡", "\\measuredangle", !0);
l(c, b, S, "∄", "\\nexists");
l(c, b, S, "℧", "\\mho");
l(c, b, S, "Ⅎ", "\\Finv", !0);
l(c, b, S, "⅁", "\\Game", !0);
l(c, b, S, "‵", "\\backprime");
l(c, b, S, "▲", "\\blacktriangle");
l(c, b, S, "▼", "\\blacktriangledown");
l(c, b, S, "■", "\\blacksquare");
l(c, b, S, "⧫", "\\blacklozenge");
l(c, b, S, "★", "\\bigstar");
l(c, b, S, "∢", "\\sphericalangle", !0);
l(c, b, S, "∁", "\\complement", !0);
l(c, b, S, "ð", "\\eth", !0);
l(B, d, S, "ð", "ð");
l(c, b, S, "╱", "\\diagup");
l(c, b, S, "╲", "\\diagdown");
l(c, b, S, "□", "\\square");
l(c, b, S, "□", "\\Box");
l(c, b, S, "◊", "\\Diamond");
l(c, b, S, "¥", "\\yen", !0);
l(B, b, S, "¥", "\\yen", !0);
l(c, b, S, "✓", "\\checkmark", !0);
l(B, b, S, "✓", "\\checkmark");
l(c, b, S, "ℶ", "\\beth", !0);
l(c, b, S, "ℸ", "\\daleth", !0);
l(c, b, S, "ℷ", "\\gimel", !0);
l(c, b, S, "ϝ", "\\digamma", !0);
l(c, b, S, "ϰ", "\\varkappa");
l(c, b, Z0, "┌", "\\@ulcorner", !0);
l(c, b, N0, "┐", "\\@urcorner", !0);
l(c, b, Z0, "└", "\\@llcorner", !0);
l(c, b, N0, "┘", "\\@lrcorner", !0);
l(c, b, g, "≦", "\\leqq", !0);
l(c, b, g, "⩽", "\\leqslant", !0);
l(c, b, g, "⪕", "\\eqslantless", !0);
l(c, b, g, "≲", "\\lesssim", !0);
l(c, b, g, "⪅", "\\lessapprox", !0);
l(c, b, g, "≊", "\\approxeq", !0);
l(c, b, H, "⋖", "\\lessdot");
l(c, b, g, "⋘", "\\lll", !0);
l(c, b, g, "≶", "\\lessgtr", !0);
l(c, b, g, "⋚", "\\lesseqgtr", !0);
l(c, b, g, "⪋", "\\lesseqqgtr", !0);
l(c, b, g, "≑", "\\doteqdot");
l(c, b, g, "≓", "\\risingdotseq", !0);
l(c, b, g, "≒", "\\fallingdotseq", !0);
l(c, b, g, "∽", "\\backsim", !0);
l(c, b, g, "⋍", "\\backsimeq", !0);
l(c, b, g, "⫅", "\\subseteqq", !0);
l(c, b, g, "⋐", "\\Subset", !0);
l(c, b, g, "⊏", "\\sqsubset", !0);
l(c, b, g, "≼", "\\preccurlyeq", !0);
l(c, b, g, "⋞", "\\curlyeqprec", !0);
l(c, b, g, "≾", "\\precsim", !0);
l(c, b, g, "⪷", "\\precapprox", !0);
l(c, b, g, "⊲", "\\vartriangleleft");
l(c, b, g, "⊴", "\\trianglelefteq");
l(c, b, g, "⊨", "\\vDash", !0);
l(c, b, g, "⊪", "\\Vvdash", !0);
l(c, b, g, "⌣", "\\smallsmile");
l(c, b, g, "⌢", "\\smallfrown");
l(c, b, g, "≏", "\\bumpeq", !0);
l(c, b, g, "≎", "\\Bumpeq", !0);
l(c, b, g, "≧", "\\geqq", !0);
l(c, b, g, "⩾", "\\geqslant", !0);
l(c, b, g, "⪖", "\\eqslantgtr", !0);
l(c, b, g, "≳", "\\gtrsim", !0);
l(c, b, g, "⪆", "\\gtrapprox", !0);
l(c, b, H, "⋗", "\\gtrdot");
l(c, b, g, "⋙", "\\ggg", !0);
l(c, b, g, "≷", "\\gtrless", !0);
l(c, b, g, "⋛", "\\gtreqless", !0);
l(c, b, g, "⪌", "\\gtreqqless", !0);
l(c, b, g, "≖", "\\eqcirc", !0);
l(c, b, g, "≗", "\\circeq", !0);
l(c, b, g, "≜", "\\triangleq", !0);
l(c, b, g, "∼", "\\thicksim");
l(c, b, g, "≈", "\\thickapprox");
l(c, b, g, "⫆", "\\supseteqq", !0);
l(c, b, g, "⋑", "\\Supset", !0);
l(c, b, g, "⊐", "\\sqsupset", !0);
l(c, b, g, "≽", "\\succcurlyeq", !0);
l(c, b, g, "⋟", "\\curlyeqsucc", !0);
l(c, b, g, "≿", "\\succsim", !0);
l(c, b, g, "⪸", "\\succapprox", !0);
l(c, b, g, "⊳", "\\vartriangleright");
l(c, b, g, "⊵", "\\trianglerighteq");
l(c, b, g, "⊩", "\\Vdash", !0);
l(c, b, g, "∣", "\\shortmid");
l(c, b, g, "∥", "\\shortparallel");
l(c, b, g, "≬", "\\between", !0);
l(c, b, g, "⋔", "\\pitchfork", !0);
l(c, b, g, "∝", "\\varpropto");
l(c, b, g, "◀", "\\blacktriangleleft");
l(c, b, g, "∴", "\\therefore", !0);
l(c, b, g, "∍", "\\backepsilon");
l(c, b, g, "▶", "\\blacktriangleright");
l(c, b, g, "∵", "\\because", !0);
l(c, b, g, "⋘", "\\llless");
l(c, b, g, "⋙", "\\gggtr");
l(c, b, H, "⊲", "\\lhd");
l(c, b, H, "⊳", "\\rhd");
l(c, b, g, "≂", "\\eqsim", !0);
l(c, d, g, "⋈", "\\Join");
l(c, b, g, "≑", "\\Doteq", !0);
l(c, b, H, "∔", "\\dotplus", !0);
l(c, b, H, "∖", "\\smallsetminus");
l(c, b, H, "⋒", "\\Cap", !0);
l(c, b, H, "⋓", "\\Cup", !0);
l(c, b, H, "⩞", "\\doublebarwedge", !0);
l(c, b, H, "⊟", "\\boxminus", !0);
l(c, b, H, "⊞", "\\boxplus", !0);
l(c, b, H, "⋇", "\\divideontimes", !0);
l(c, b, H, "⋉", "\\ltimes", !0);
l(c, b, H, "⋊", "\\rtimes", !0);
l(c, b, H, "⋋", "\\leftthreetimes", !0);
l(c, b, H, "⋌", "\\rightthreetimes", !0);
l(c, b, H, "⋏", "\\curlywedge", !0);
l(c, b, H, "⋎", "\\curlyvee", !0);
l(c, b, H, "⊝", "\\circleddash", !0);
l(c, b, H, "⊛", "\\circledast", !0);
l(c, b, H, "⋅", "\\centerdot");
l(c, b, H, "⊺", "\\intercal", !0);
l(c, b, H, "⋒", "\\doublecap");
l(c, b, H, "⋓", "\\doublecup");
l(c, b, H, "⊠", "\\boxtimes", !0);
l(c, b, g, "⇢", "\\dashrightarrow", !0);
l(c, b, g, "⇠", "\\dashleftarrow", !0);
l(c, b, g, "⇇", "\\leftleftarrows", !0);
l(c, b, g, "⇆", "\\leftrightarrows", !0);
l(c, b, g, "⇚", "\\Lleftarrow", !0);
l(c, b, g, "↞", "\\twoheadleftarrow", !0);
l(c, b, g, "↢", "\\leftarrowtail", !0);
l(c, b, g, "↫", "\\looparrowleft", !0);
l(c, b, g, "⇋", "\\leftrightharpoons", !0);
l(c, b, g, "↶", "\\curvearrowleft", !0);
l(c, b, g, "↺", "\\circlearrowleft", !0);
l(c, b, g, "↰", "\\Lsh", !0);
l(c, b, g, "⇈", "\\upuparrows", !0);
l(c, b, g, "↿", "\\upharpoonleft", !0);
l(c, b, g, "⇃", "\\downharpoonleft", !0);
l(c, d, g, "⊶", "\\origof", !0);
l(c, d, g, "⊷", "\\imageof", !0);
l(c, b, g, "⊸", "\\multimap", !0);
l(c, b, g, "↭", "\\leftrightsquigarrow", !0);
l(c, b, g, "⇉", "\\rightrightarrows", !0);
l(c, b, g, "⇄", "\\rightleftarrows", !0);
l(c, b, g, "↠", "\\twoheadrightarrow", !0);
l(c, b, g, "↣", "\\rightarrowtail", !0);
l(c, b, g, "↬", "\\looparrowright", !0);
l(c, b, g, "↷", "\\curvearrowright", !0);
l(c, b, g, "↻", "\\circlearrowright", !0);
l(c, b, g, "↱", "\\Rsh", !0);
l(c, b, g, "⇊", "\\downdownarrows", !0);
l(c, b, g, "↾", "\\upharpoonright", !0);
l(c, b, g, "⇂", "\\downharpoonright", !0);
l(c, b, g, "⇝", "\\rightsquigarrow", !0);
l(c, b, g, "⇝", "\\leadsto");
l(c, b, g, "⇛", "\\Rrightarrow", !0);
l(c, b, g, "↾", "\\restriction");
l(c, d, S, "‘", "`");
l(c, d, S, "$", "\\$");
l(B, d, S, "$", "\\$");
l(B, d, S, "$", "\\textdollar");
l(c, d, S, "%", "\\%");
l(B, d, S, "%", "\\%");
l(c, d, S, "_", "\\_");
l(B, d, S, "_", "\\_");
l(B, d, S, "_", "\\textunderscore");
l(c, d, S, "∠", "\\angle", !0);
l(c, d, S, "∞", "\\infty", !0);
l(c, d, S, "′", "\\prime");
l(c, d, S, "△", "\\triangle");
l(c, d, S, "Γ", "\\Gamma", !0);
l(c, d, S, "Δ", "\\Delta", !0);
l(c, d, S, "Θ", "\\Theta", !0);
l(c, d, S, "Λ", "\\Lambda", !0);
l(c, d, S, "Ξ", "\\Xi", !0);
l(c, d, S, "Π", "\\Pi", !0);
l(c, d, S, "Σ", "\\Sigma", !0);
l(c, d, S, "Υ", "\\Upsilon", !0);
l(c, d, S, "Φ", "\\Phi", !0);
l(c, d, S, "Ψ", "\\Psi", !0);
l(c, d, S, "Ω", "\\Omega", !0);
l(c, d, S, "A", "Α");
l(c, d, S, "B", "Β");
l(c, d, S, "E", "Ε");
l(c, d, S, "Z", "Ζ");
l(c, d, S, "H", "Η");
l(c, d, S, "I", "Ι");
l(c, d, S, "K", "Κ");
l(c, d, S, "M", "Μ");
l(c, d, S, "N", "Ν");
l(c, d, S, "O", "Ο");
l(c, d, S, "P", "Ρ");
l(c, d, S, "T", "Τ");
l(c, d, S, "X", "Χ");
l(c, d, S, "¬", "\\neg", !0);
l(c, d, S, "¬", "\\lnot");
l(c, d, S, "⊤", "\\top");
l(c, d, S, "⊥", "\\bot");
l(c, d, S, "∅", "\\emptyset");
l(c, b, S, "∅", "\\varnothing");
l(c, d, V, "α", "\\alpha", !0);
l(c, d, V, "β", "\\beta", !0);
l(c, d, V, "γ", "\\gamma", !0);
l(c, d, V, "δ", "\\delta", !0);
l(c, d, V, "ϵ", "\\epsilon", !0);
l(c, d, V, "ζ", "\\zeta", !0);
l(c, d, V, "η", "\\eta", !0);
l(c, d, V, "θ", "\\theta", !0);
l(c, d, V, "ι", "\\iota", !0);
l(c, d, V, "κ", "\\kappa", !0);
l(c, d, V, "λ", "\\lambda", !0);
l(c, d, V, "μ", "\\mu", !0);
l(c, d, V, "ν", "\\nu", !0);
l(c, d, V, "ξ", "\\xi", !0);
l(c, d, V, "ο", "\\omicron", !0);
l(c, d, V, "π", "\\pi", !0);
l(c, d, V, "ρ", "\\rho", !0);
l(c, d, V, "σ", "\\sigma", !0);
l(c, d, V, "τ", "\\tau", !0);
l(c, d, V, "υ", "\\upsilon", !0);
l(c, d, V, "ϕ", "\\phi", !0);
l(c, d, V, "χ", "\\chi", !0);
l(c, d, V, "ψ", "\\psi", !0);
l(c, d, V, "ω", "\\omega", !0);
l(c, d, V, "ε", "\\varepsilon", !0);
l(c, d, V, "ϑ", "\\vartheta", !0);
l(c, d, V, "ϖ", "\\varpi", !0);
l(c, d, V, "ϱ", "\\varrho", !0);
l(c, d, V, "ς", "\\varsigma", !0);
l(c, d, V, "φ", "\\varphi", !0);
l(c, d, H, "∗", "*", !0);
l(c, d, H, "+", "+");
l(c, d, H, "−", "-", !0);
l(c, d, H, "⋅", "\\cdot", !0);
l(c, d, H, "∘", "\\circ", !0);
l(c, d, H, "÷", "\\div", !0);
l(c, d, H, "±", "\\pm", !0);
l(c, d, H, "×", "\\times", !0);
l(c, d, H, "∩", "\\cap", !0);
l(c, d, H, "∪", "\\cup", !0);
l(c, d, H, "∖", "\\setminus", !0);
l(c, d, H, "∧", "\\land");
l(c, d, H, "∨", "\\lor");
l(c, d, H, "∧", "\\wedge", !0);
l(c, d, H, "∨", "\\vee", !0);
l(c, d, S, "√", "\\surd");
l(c, d, Z0, "⟨", "\\langle", !0);
l(c, d, Z0, "∣", "\\lvert");
l(c, d, Z0, "∥", "\\lVert");
l(c, d, N0, "?", "?");
l(c, d, N0, "!", "!");
l(c, d, N0, "⟩", "\\rangle", !0);
l(c, d, N0, "∣", "\\rvert");
l(c, d, N0, "∥", "\\rVert");
l(c, d, g, "=", "=");
l(c, d, g, ":", ":");
l(c, d, g, "≈", "\\approx", !0);
l(c, d, g, "≅", "\\cong", !0);
l(c, d, g, "≥", "\\ge");
l(c, d, g, "≥", "\\geq", !0);
l(c, d, g, "←", "\\gets");
l(c, d, g, ">", "\\gt", !0);
l(c, d, g, "∈", "\\in", !0);
l(c, d, g, "", "\\@not");
l(c, d, g, "⊂", "\\subset", !0);
l(c, d, g, "⊃", "\\supset", !0);
l(c, d, g, "⊆", "\\subseteq", !0);
l(c, d, g, "⊇", "\\supseteq", !0);
l(c, b, g, "⊈", "\\nsubseteq", !0);
l(c, b, g, "⊉", "\\nsupseteq", !0);
l(c, d, g, "⊨", "\\models");
l(c, d, g, "←", "\\leftarrow", !0);
l(c, d, g, "≤", "\\le");
l(c, d, g, "≤", "\\leq", !0);
l(c, d, g, "<", "\\lt", !0);
l(c, d, g, "→", "\\rightarrow", !0);
l(c, d, g, "→", "\\to");
l(c, b, g, "≱", "\\ngeq", !0);
l(c, b, g, "≰", "\\nleq", !0);
l(c, d, ze, " ", "\\ ");
l(c, d, ze, " ", "\\space");
l(c, d, ze, " ", "\\nobreakspace");
l(B, d, ze, " ", "\\ ");
l(B, d, ze, " ", " ");
l(B, d, ze, " ", "\\space");
l(B, d, ze, " ", "\\nobreakspace");
l(c, d, ze, null, "\\nobreak");
l(c, d, ze, null, "\\allowbreak");
l(c, d, mr, ",", ",");
l(c, d, mr, ";", ";");
l(c, b, H, "⊼", "\\barwedge", !0);
l(c, b, H, "⊻", "\\veebar", !0);
l(c, d, H, "⊙", "\\odot", !0);
l(c, d, H, "⊕", "\\oplus", !0);
l(c, d, H, "⊗", "\\otimes", !0);
l(c, d, S, "∂", "\\partial", !0);
l(c, d, H, "⊘", "\\oslash", !0);
l(c, b, H, "⊚", "\\circledcirc", !0);
l(c, b, H, "⊡", "\\boxdot", !0);
l(c, d, H, "△", "\\bigtriangleup");
l(c, d, H, "▽", "\\bigtriangledown");
l(c, d, H, "†", "\\dagger");
l(c, d, H, "⋄", "\\diamond");
l(c, d, H, "⋆", "\\star");
l(c, d, H, "◃", "\\triangleleft");
l(c, d, H, "▹", "\\triangleright");
l(c, d, Z0, "{", "\\{");
l(B, d, S, "{", "\\{");
l(B, d, S, "{", "\\textbraceleft");
l(c, d, N0, "}", "\\}");
l(B, d, S, "}", "\\}");
l(B, d, S, "}", "\\textbraceright");
l(c, d, Z0, "{", "\\lbrace");
l(c, d, N0, "}", "\\rbrace");
l(c, d, Z0, "[", "\\lbrack", !0);
l(B, d, S, "[", "\\lbrack", !0);
l(c, d, N0, "]", "\\rbrack", !0);
l(B, d, S, "]", "\\rbrack", !0);
l(c, d, Z0, "(", "\\lparen", !0);
l(c, d, N0, ")", "\\rparen", !0);
l(B, d, S, "<", "\\textless", !0);
l(B, d, S, ">", "\\textgreater", !0);
l(c, d, Z0, "⌊", "\\lfloor", !0);
l(c, d, N0, "⌋", "\\rfloor", !0);
l(c, d, Z0, "⌈", "\\lceil", !0);
l(c, d, N0, "⌉", "\\rceil", !0);
l(c, d, S, "\\", "\\backslash");
l(c, d, S, "∣", "|");
l(c, d, S, "∣", "\\vert");
l(B, d, S, "|", "\\textbar", !0);
l(c, d, S, "∥", "\\|");
l(c, d, S, "∥", "\\Vert");
l(B, d, S, "∥", "\\textbardbl");
l(B, d, S, "~", "\\textasciitilde");
l(B, d, S, "\\", "\\textbackslash");
l(B, d, S, "^", "\\textasciicircum");
l(c, d, g, "↑", "\\uparrow", !0);
l(c, d, g, "⇑", "\\Uparrow", !0);
l(c, d, g, "↓", "\\downarrow", !0);
l(c, d, g, "⇓", "\\Downarrow", !0);
l(c, d, g, "↕", "\\updownarrow", !0);
l(c, d, g, "⇕", "\\Updownarrow", !0);
l(c, d, v0, "∐", "\\coprod");
l(c, d, v0, "⋁", "\\bigvee");
l(c, d, v0, "⋀", "\\bigwedge");
l(c, d, v0, "⨄", "\\biguplus");
l(c, d, v0, "⋂", "\\bigcap");
l(c, d, v0, "⋃", "\\bigcup");
l(c, d, v0, "∫", "\\int");
l(c, d, v0, "∫", "\\intop");
l(c, d, v0, "∬", "\\iint");
l(c, d, v0, "∭", "\\iiint");
l(c, d, v0, "∏", "\\prod");
l(c, d, v0, "∑", "\\sum");
l(c, d, v0, "⨂", "\\bigotimes");
l(c, d, v0, "⨁", "\\bigoplus");
l(c, d, v0, "⨀", "\\bigodot");
l(c, d, v0, "∮", "\\oint");
l(c, d, v0, "∯", "\\oiint");
l(c, d, v0, "∰", "\\oiiint");
l(c, d, v0, "⨆", "\\bigsqcup");
l(c, d, v0, "∫", "\\smallint");
l(B, d, dt, "…", "\\textellipsis");
l(c, d, dt, "…", "\\mathellipsis");
l(B, d, dt, "…", "\\ldots", !0);
l(c, d, dt, "…", "\\ldots", !0);
l(c, d, dt, "⋯", "\\@cdots", !0);
l(c, d, dt, "⋱", "\\ddots", !0);
l(c, d, S, "⋮", "\\varvdots");
l(B, d, S, "⋮", "\\varvdots");
l(c, d, h0, "ˊ", "\\acute");
l(c, d, h0, "ˋ", "\\grave");
l(c, d, h0, "¨", "\\ddot");
l(c, d, h0, "~", "\\tilde");
l(c, d, h0, "ˉ", "\\bar");
l(c, d, h0, "˘", "\\breve");
l(c, d, h0, "ˇ", "\\check");
l(c, d, h0, "^", "\\hat");
l(c, d, h0, "⃗", "\\vec");
l(c, d, h0, "˙", "\\dot");
l(c, d, h0, "˚", "\\mathring");
l(c, d, V, "", "\\@imath");
l(c, d, V, "", "\\@jmath");
l(c, d, S, "ı", "ı");
l(c, d, S, "ȷ", "ȷ");
l(B, d, S, "ı", "\\i", !0);
l(B, d, S, "ȷ", "\\j", !0);
l(B, d, S, "ß", "\\ss", !0);
l(B, d, S, "æ", "\\ae", !0);
l(B, d, S, "œ", "\\oe", !0);
l(B, d, S, "ø", "\\o", !0);
l(B, d, S, "Æ", "\\AE", !0);
l(B, d, S, "Œ", "\\OE", !0);
l(B, d, S, "Ø", "\\O", !0);
l(B, d, h0, "ˊ", "\\'");
l(B, d, h0, "ˋ", "\\`");
l(B, d, h0, "ˆ", "\\^");
l(B, d, h0, "˜", "\\~");
l(B, d, h0, "ˉ", "\\=");
l(B, d, h0, "˘", "\\u");
l(B, d, h0, "˙", "\\.");
l(B, d, h0, "¸", "\\c");
l(B, d, h0, "˚", "\\r");
l(B, d, h0, "ˇ", "\\v");
l(B, d, h0, "¨", '\\"');
l(B, d, h0, "˝", "\\H");
l(B, d, h0, "◯", "\\textcircled");
var r1 = {
  "--": !0,
  "---": !0,
  "``": !0,
  "''": !0
};
l(B, d, S, "–", "--", !0);
l(B, d, S, "–", "\\textendash");
l(B, d, S, "—", "---", !0);
l(B, d, S, "—", "\\textemdash");
l(B, d, S, "‘", "`", !0);
l(B, d, S, "‘", "\\textquoteleft");
l(B, d, S, "’", "'", !0);
l(B, d, S, "’", "\\textquoteright");
l(B, d, S, "“", "``", !0);
l(B, d, S, "“", "\\textquotedblleft");
l(B, d, S, "”", "''", !0);
l(B, d, S, "”", "\\textquotedblright");
l(c, d, S, "°", "\\degree", !0);
l(B, d, S, "°", "\\degree");
l(B, d, S, "°", "\\textdegree", !0);
l(c, d, S, "£", "\\pounds");
l(c, d, S, "£", "\\mathsterling", !0);
l(B, d, S, "£", "\\pounds");
l(B, d, S, "£", "\\textsterling", !0);
l(c, b, S, "✠", "\\maltese");
l(B, b, S, "✠", "\\maltese");
var Oa = '0123456789/@."';
for (var $r = 0; $r < Oa.length; $r++) {
  var qa = Oa.charAt($r);
  l(c, d, S, qa, qa);
}
var Pa = '0123456789!@*()-=+";:?/.,';
for (var Ur = 0; Ur < Pa.length; Ur++) {
  var Ha = Pa.charAt(Ur);
  l(B, d, S, Ha, Ha);
}
var nr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
for (var Gr = 0; Gr < nr.length; Gr++) {
  var $t = nr.charAt(Gr);
  l(c, d, V, $t, $t), l(B, d, S, $t, $t);
}
l(c, b, S, "C", "ℂ");
l(B, b, S, "C", "ℂ");
l(c, b, S, "H", "ℍ");
l(B, b, S, "H", "ℍ");
l(c, b, S, "N", "ℕ");
l(B, b, S, "N", "ℕ");
l(c, b, S, "P", "ℙ");
l(B, b, S, "P", "ℙ");
l(c, b, S, "Q", "ℚ");
l(B, b, S, "Q", "ℚ");
l(c, b, S, "R", "ℝ");
l(B, b, S, "R", "ℝ");
l(c, b, S, "Z", "ℤ");
l(B, b, S, "Z", "ℤ");
l(c, d, V, "h", "ℎ");
l(B, d, V, "h", "ℎ");
var W = "";
for (var F0 = 0; F0 < nr.length; F0++) {
  var p0 = nr.charAt(F0);
  W = String.fromCharCode(55349, 56320 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56372 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56424 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56580 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56684 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56736 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56788 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56840 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56944 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), F0 < 26 && (W = String.fromCharCode(55349, 56632 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W), W = String.fromCharCode(55349, 56476 + F0), l(c, d, V, p0, W), l(B, d, S, p0, W));
}
W = "𝕜";
l(c, d, V, "k", W);
l(B, d, S, "k", W);
for (var We = 0; We < 10; We++) {
  var Re = We.toString();
  W = String.fromCharCode(55349, 57294 + We), l(c, d, V, Re, W), l(B, d, S, Re, W), W = String.fromCharCode(55349, 57314 + We), l(c, d, V, Re, W), l(B, d, S, Re, W), W = String.fromCharCode(55349, 57324 + We), l(c, d, V, Re, W), l(B, d, S, Re, W), W = String.fromCharCode(55349, 57334 + We), l(c, d, V, Re, W), l(B, d, S, Re, W);
}
var fu = "ÐÞþ";
for (var Vr = 0; Vr < fu.length; Vr++) {
  var Ut = fu.charAt(Vr);
  l(c, d, V, Ut, Ut), l(B, d, S, Ut, Ut);
}
var Gt = [
  ["mathbf", "textbf", "Main-Bold"],
  // A-Z bold upright
  ["mathbf", "textbf", "Main-Bold"],
  // a-z bold upright
  ["mathnormal", "textit", "Math-Italic"],
  // A-Z italic
  ["mathnormal", "textit", "Math-Italic"],
  // a-z italic
  ["boldsymbol", "boldsymbol", "Main-BoldItalic"],
  // A-Z bold italic
  ["boldsymbol", "boldsymbol", "Main-BoldItalic"],
  // a-z bold italic
  // Map fancy A-Z letters to script, not calligraphic.
  // This aligns with unicode-math and math fonts (except Cambria Math).
  ["mathscr", "textscr", "Script-Regular"],
  // A-Z script
  ["", "", ""],
  // a-z script.  No font
  ["", "", ""],
  // A-Z bold script. No font
  ["", "", ""],
  // a-z bold script. No font
  ["mathfrak", "textfrak", "Fraktur-Regular"],
  // A-Z Fraktur
  ["mathfrak", "textfrak", "Fraktur-Regular"],
  // a-z Fraktur
  ["mathbb", "textbb", "AMS-Regular"],
  // A-Z double-struck
  ["mathbb", "textbb", "AMS-Regular"],
  // k double-struck
  // Note that we are using a bold font, but font metrics for regular Fraktur.
  ["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
  // A-Z bold Fraktur
  ["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
  // a-z bold Fraktur
  ["mathsf", "textsf", "SansSerif-Regular"],
  // A-Z sans-serif
  ["mathsf", "textsf", "SansSerif-Regular"],
  // a-z sans-serif
  ["mathboldsf", "textboldsf", "SansSerif-Bold"],
  // A-Z bold sans-serif
  ["mathboldsf", "textboldsf", "SansSerif-Bold"],
  // a-z bold sans-serif
  ["mathitsf", "textitsf", "SansSerif-Italic"],
  // A-Z italic sans-serif
  ["mathitsf", "textitsf", "SansSerif-Italic"],
  // a-z italic sans-serif
  ["", "", ""],
  // A-Z bold italic sans. No font
  ["", "", ""],
  // a-z bold italic sans. No font
  ["mathtt", "texttt", "Typewriter-Regular"],
  // A-Z monospace
  ["mathtt", "texttt", "Typewriter-Regular"]
  // a-z monospace
], $a = [
  ["mathbf", "textbf", "Main-Bold"],
  // 0-9 bold
  ["", "", ""],
  // 0-9 double-struck. No KaTeX font.
  ["mathsf", "textsf", "SansSerif-Regular"],
  // 0-9 sans-serif
  ["mathboldsf", "textboldsf", "SansSerif-Bold"],
  // 0-9 bold sans-serif
  ["mathtt", "texttt", "Typewriter-Regular"]
  // 0-9 monospace
], qo = function(e, r) {
  var u = e.charCodeAt(0), a = e.charCodeAt(1), n = (u - 55296) * 1024 + (a - 56320) + 65536, i = r === "math" ? 0 : 1;
  if (119808 <= n && n < 120484) {
    var s = Math.floor((n - 119808) / 26);
    return [Gt[s][2], Gt[s][i]];
  } else if (120782 <= n && n <= 120831) {
    var o = Math.floor((n - 120782) / 10);
    return [$a[o][2], $a[o][i]];
  } else {
    if (n === 120485 || n === 120486)
      return [Gt[0][2], Gt[0][i]];
    if (120486 < n && n < 120782)
      return ["", ""];
    throw new R("Unsupported character: " + e);
  }
}, pr = function(e, r, u) {
  return i0[u][e] && i0[u][e].replace && (e = i0[u][e].replace), {
    value: e,
    metrics: Mu(e, r, u)
  };
}, ue = function(e, r, u, a, n) {
  var i = pr(e, r, u), s = i.metrics;
  e = i.value;
  var o;
  if (s) {
    var h = s.italic;
    (u === "text" || a && a.font === "mathit") && (h = 0), o = new ae(e, s.height, s.depth, h, s.skew, s.width, n);
  } else
    typeof console < "u" && console.warn("No character metrics " + ("for '" + e + "' in style '" + r + "' and mode '" + u + "'")), o = new ae(e, 0, 0, 0, 0, 0, n);
  if (a) {
    o.maxFontSize = a.sizeMultiplier, a.style.isTight() && o.classes.push("mtight");
    var f = a.getColor();
    f && (o.style.color = f);
  }
  return o;
}, Po = function(e, r, u, a) {
  return a === void 0 && (a = []), u.font === "boldsymbol" && pr(e, "Main-Bold", r).metrics ? ue(e, "Main-Bold", r, u, a.concat(["mathbf"])) : e === "\\" || i0[r][e].font === "main" ? ue(e, "Main-Regular", r, u, a) : ue(e, "AMS-Regular", r, u, a.concat(["amsrm"]));
}, Ho = function(e, r, u, a, n) {
  return n !== "textord" && pr(e, "Math-BoldItalic", r).metrics ? {
    fontName: "Math-BoldItalic",
    fontClass: "boldsymbol"
  } : {
    fontName: "Main-Bold",
    fontClass: "mathbf"
  };
}, $o = function(e, r, u) {
  var a = e.mode, n = e.text, i = ["mord"], s = a === "math" || a === "text" && r.font, o = s ? r.font : r.fontFamily, h = "", f = "";
  if (n.charCodeAt(0) === 55349 && ([h, f] = qo(n, a)), h.length > 0)
    return ue(n, h, a, r, i.concat(f));
  if (o) {
    var p, k;
    if (o === "boldsymbol") {
      var x = Ho(n, a, r, i, u);
      p = x.fontName, k = [x.fontClass];
    } else s ? (p = n1[o].fontName, k = [o]) : (p = Vt(o, r.fontWeight, r.fontShape), k = [o, r.fontWeight, r.fontShape]);
    if (pr(n, p, a).metrics)
      return ue(n, p, a, r, i.concat(k));
    if (r1.hasOwnProperty(n) && p.slice(0, 10) === "Typewriter") {
      for (var y = [], _ = 0; _ < n.length; _++)
        y.push(ue(n[_], p, a, r, i.concat(k)));
      return a1(y);
    }
  }
  if (u === "mathord")
    return ue(n, "Math-Italic", a, r, i.concat(["mathnormal"]));
  if (u === "textord") {
    var E = i0[a][n] && i0[a][n].font;
    if (E === "ams") {
      var F = Vt("amsrm", r.fontWeight, r.fontShape);
      return ue(n, F, a, r, i.concat("amsrm", r.fontWeight, r.fontShape));
    } else if (E === "main" || !E) {
      var v = Vt("textrm", r.fontWeight, r.fontShape);
      return ue(n, v, a, r, i.concat(r.fontWeight, r.fontShape));
    } else {
      var w = Vt(E, r.fontWeight, r.fontShape);
      return ue(n, w, a, r, i.concat(w, r.fontWeight, r.fontShape));
    }
  } else
    throw new Error("unexpected type: " + u + " in makeOrd");
}, Uo = (t, e) => {
  if (He(t.classes) !== He(e.classes) || t.skew !== e.skew || t.maxFontSize !== e.maxFontSize)
    return !1;
  if (t.classes.length === 1) {
    var r = t.classes[0];
    if (r === "mbin" || r === "mord")
      return !1;
  }
  for (var u in t.style)
    if (t.style.hasOwnProperty(u) && t.style[u] !== e.style[u])
      return !1;
  for (var a in e.style)
    if (e.style.hasOwnProperty(a) && t.style[a] !== e.style[a])
      return !1;
  return !0;
}, Go = (t) => {
  for (var e = 0; e < t.length - 1; e++) {
    var r = t[e], u = t[e + 1];
    r instanceof ae && u instanceof ae && Uo(r, u) && (r.text += u.text, r.height = Math.max(r.height, u.height), r.depth = Math.max(r.depth, u.depth), r.italic = u.italic, t.splice(e + 1, 1), e--);
  }
  return t;
}, Fu = function(e) {
  for (var r = 0, u = 0, a = 0, n = 0; n < e.children.length; n++) {
    var i = e.children[n];
    i.height > r && (r = i.height), i.depth > u && (u = i.depth), i.maxFontSize > a && (a = i.maxFontSize);
  }
  e.height = r, e.depth = u, e.maxFontSize = a;
}, q0 = function(e, r, u, a) {
  var n = new fr(e, r, u, a);
  return Fu(n), n;
}, u1 = (t, e, r, u) => new fr(t, e, r, u), Vo = function(e, r, u) {
  var a = q0([e], [], r);
  return a.height = Math.max(u || r.fontMetrics().defaultRuleThickness, r.minRuleThickness), a.style.borderBottomWidth = O(a.height), a.maxFontSize = 1, a;
}, jo = function(e, r, u, a) {
  var n = new t1(e, r, u, a);
  return Fu(n), n;
}, a1 = function(e) {
  var r = new zt(e);
  return Fu(r), r;
}, Wo = function(e, r) {
  return e instanceof zt ? q0([], [e], r) : e;
}, Zo = function(e) {
  if (e.positionType === "individualShift") {
    for (var r = e.children, u = [r[0]], a = -r[0].shift - r[0].elem.depth, n = a, i = 1; i < r.length; i++) {
      var s = -r[i].shift - n - r[i].elem.depth, o = s - (r[i - 1].elem.height + r[i - 1].elem.depth);
      n = n + s, u.push({
        type: "kern",
        size: o
      }), u.push(r[i]);
    }
    return {
      children: u,
      depth: a
    };
  }
  var h;
  if (e.positionType === "top") {
    for (var f = e.positionData, p = 0; p < e.children.length; p++) {
      var k = e.children[p];
      f -= k.type === "kern" ? k.size : k.elem.height + k.elem.depth;
    }
    h = f;
  } else if (e.positionType === "bottom")
    h = -e.positionData;
  else {
    var x = e.children[0];
    if (x.type !== "elem")
      throw new Error('First child must have type "elem".');
    if (e.positionType === "shift")
      h = -x.elem.depth - e.positionData;
    else if (e.positionType === "firstBaseline")
      h = -x.elem.depth;
    else
      throw new Error("Invalid positionType " + e.positionType + ".");
  }
  return {
    children: e.children,
    depth: h
  };
}, Yo = function(e, r) {
  for (var {
    children: u,
    depth: a
  } = Zo(e), n = 0, i = 0; i < u.length; i++) {
    var s = u[i];
    if (s.type === "elem") {
      var o = s.elem;
      n = Math.max(n, o.maxFontSize, o.height);
    }
  }
  n += 2;
  var h = q0(["pstrut"], []);
  h.style.height = O(n);
  for (var f = [], p = a, k = a, x = a, y = 0; y < u.length; y++) {
    var _ = u[y];
    if (_.type === "kern")
      x += _.size;
    else {
      var E = _.elem, F = _.wrapperClasses || [], v = _.wrapperStyle || {}, w = q0(F, [h, E], void 0, v);
      w.style.top = O(-n - x - E.depth), _.marginLeft && (w.style.marginLeft = _.marginLeft), _.marginRight && (w.style.marginRight = _.marginRight), f.push(w), x += E.height + E.depth;
    }
    p = Math.min(p, x), k = Math.max(k, x);
  }
  var C = q0(["vlist"], f);
  C.style.height = O(k);
  var D;
  if (p < 0) {
    var M = q0([], []), z = q0(["vlist"], [M]);
    z.style.height = O(-p);
    var P = q0(["vlist-s"], [new ae("​")]);
    D = [q0(["vlist-r"], [C, P]), q0(["vlist-r"], [z])];
  } else
    D = [q0(["vlist-r"], [C])];
  var N = q0(["vlist-t"], D);
  return D.length === 2 && N.classes.push("vlist-t2"), N.height = k, N.depth = -p, N;
}, Xo = (t, e) => {
  var r = q0(["mspace"], [], e), u = f0(t, e);
  return r.style.marginRight = O(u), r;
}, Vt = function(e, r, u) {
  var a = "";
  switch (e) {
    case "amsrm":
      a = "AMS";
      break;
    case "textrm":
      a = "Main";
      break;
    case "textsf":
      a = "SansSerif";
      break;
    case "texttt":
      a = "Typewriter";
      break;
    default:
      a = e;
  }
  var n;
  return r === "textbf" && u === "textit" ? n = "BoldItalic" : r === "textbf" ? n = "Bold" : r === "textit" ? n = "Italic" : n = "Regular", a + "-" + n;
}, n1 = {
  // styles
  mathbf: {
    variant: "bold",
    fontName: "Main-Bold"
  },
  mathrm: {
    variant: "normal",
    fontName: "Main-Regular"
  },
  textit: {
    variant: "italic",
    fontName: "Main-Italic"
  },
  mathit: {
    variant: "italic",
    fontName: "Main-Italic"
  },
  mathnormal: {
    variant: "italic",
    fontName: "Math-Italic"
  },
  mathsfit: {
    variant: "sans-serif-italic",
    fontName: "SansSerif-Italic"
  },
  // "boldsymbol" is missing because they require the use of multiple fonts:
  // Math-BoldItalic and Main-Bold.  This is handled by a special case in
  // makeOrd which ends up calling boldsymbol.
  // families
  mathbb: {
    variant: "double-struck",
    fontName: "AMS-Regular"
  },
  mathcal: {
    variant: "script",
    fontName: "Caligraphic-Regular"
  },
  mathfrak: {
    variant: "fraktur",
    fontName: "Fraktur-Regular"
  },
  mathscr: {
    variant: "script",
    fontName: "Script-Regular"
  },
  mathsf: {
    variant: "sans-serif",
    fontName: "SansSerif-Regular"
  },
  mathtt: {
    variant: "monospace",
    fontName: "Typewriter-Regular"
  }
}, i1 = {
  //   path, width, height
  vec: ["vec", 0.471, 0.714],
  // values from the font glyph
  oiintSize1: ["oiintSize1", 0.957, 0.499],
  // oval to overlay the integrand
  oiintSize2: ["oiintSize2", 1.472, 0.659],
  oiiintSize1: ["oiiintSize1", 1.304, 0.499],
  oiiintSize2: ["oiiintSize2", 1.98, 0.659]
}, Ko = function(e, r) {
  var [u, a, n] = i1[e], i = new Ye(u), s = new $e([i], {
    width: O(a),
    height: O(n),
    // Override CSS rule `.katex svg { width: 100% }`
    style: "width:" + O(a),
    viewBox: "0 0 " + 1e3 * a + " " + 1e3 * n,
    preserveAspectRatio: "xMinYMin"
  }), o = u1(["overlay"], [s], r);
  return o.height = n, o.style.height = O(n), o.style.width = O(a), o;
}, T = {
  fontMap: n1,
  makeSymbol: ue,
  mathsym: Po,
  makeSpan: q0,
  makeSvgSpan: u1,
  makeLineSpan: Vo,
  makeAnchor: jo,
  makeFragment: a1,
  wrapFragment: Wo,
  makeVList: Yo,
  makeOrd: $o,
  makeGlue: Xo,
  staticSvg: Ko,
  svgData: i1,
  tryCombineChars: Go
}, d0 = {
  number: 3,
  unit: "mu"
}, Ze = {
  number: 4,
  unit: "mu"
}, _e = {
  number: 5,
  unit: "mu"
}, Jo = {
  mord: {
    mop: d0,
    mbin: Ze,
    mrel: _e,
    minner: d0
  },
  mop: {
    mord: d0,
    mop: d0,
    mrel: _e,
    minner: d0
  },
  mbin: {
    mord: Ze,
    mop: Ze,
    mopen: Ze,
    minner: Ze
  },
  mrel: {
    mord: _e,
    mop: _e,
    mopen: _e,
    minner: _e
  },
  mopen: {},
  mclose: {
    mop: d0,
    mbin: Ze,
    mrel: _e,
    minner: d0
  },
  mpunct: {
    mord: d0,
    mop: d0,
    mrel: _e,
    mopen: d0,
    mclose: d0,
    mpunct: d0,
    minner: d0
  },
  minner: {
    mord: d0,
    mop: d0,
    mbin: Ze,
    mrel: _e,
    mopen: d0,
    mpunct: d0,
    minner: d0
  }
}, Qo = {
  mord: {
    mop: d0
  },
  mop: {
    mord: d0,
    mop: d0
  },
  mbin: {},
  mrel: {},
  mopen: {},
  mclose: {
    mop: d0
  },
  mpunct: {},
  minner: {
    mop: d0
  }
}, s1 = {}, ir = {}, sr = {};
function q(t) {
  for (var {
    type: e,
    names: r,
    props: u,
    handler: a,
    htmlBuilder: n,
    mathmlBuilder: i
  } = t, s = {
    type: e,
    numArgs: u.numArgs,
    argTypes: u.argTypes,
    allowedInArgument: !!u.allowedInArgument,
    allowedInText: !!u.allowedInText,
    allowedInMath: u.allowedInMath === void 0 ? !0 : u.allowedInMath,
    numOptionalArgs: u.numOptionalArgs || 0,
    infix: !!u.infix,
    primitive: !!u.primitive,
    handler: a
  }, o = 0; o < r.length; ++o)
    s1[r[o]] = s;
  e && (n && (ir[e] = n), i && (sr[e] = i));
}
function Xe(t) {
  var {
    type: e,
    htmlBuilder: r,
    mathmlBuilder: u
  } = t;
  q({
    type: e,
    names: [],
    props: {
      numArgs: 0
    },
    handler() {
      throw new Error("Should never be called.");
    },
    htmlBuilder: r,
    mathmlBuilder: u
  });
}
var lr = function(e) {
  return e.type === "ordgroup" && e.body.length === 1 ? e.body[0] : e;
}, b0 = function(e) {
  return e.type === "ordgroup" ? e.body : [e];
}, Me = T.makeSpan, ec = ["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"], tc = ["rightmost", "mrel", "mclose", "mpunct"], rc = {
  display: j.DISPLAY,
  text: j.TEXT,
  script: j.SCRIPT,
  scriptscript: j.SCRIPTSCRIPT
}, uc = {
  mord: "mord",
  mop: "mop",
  mbin: "mbin",
  mrel: "mrel",
  mopen: "mopen",
  mclose: "mclose",
  mpunct: "mpunct",
  minner: "minner"
}, y0 = function(e, r, u, a) {
  a === void 0 && (a = [null, null]);
  for (var n = [], i = 0; i < e.length; i++) {
    var s = Q(e[i], r);
    if (s instanceof zt) {
      var o = s.children;
      n.push(...o);
    } else
      n.push(s);
  }
  if (T.tryCombineChars(n), !u)
    return n;
  var h = r;
  if (e.length === 1) {
    var f = e[0];
    f.type === "sizing" ? h = r.havingSize(f.size) : f.type === "styling" && (h = r.havingStyle(rc[f.style]));
  }
  var p = Me([a[0] || "leftmost"], [], r), k = Me([a[1] || "rightmost"], [], r), x = u === "root";
  return Ua(n, (y, _) => {
    var E = _.classes[0], F = y.classes[0];
    E === "mbin" && tc.includes(F) ? _.classes[0] = "mord" : F === "mbin" && ec.includes(E) && (y.classes[0] = "mord");
  }, {
    node: p
  }, k, x), Ua(n, (y, _) => {
    var E = mu(_), F = mu(y), v = E && F ? y.hasClass("mtight") ? Qo[E][F] : Jo[E][F] : null;
    if (v)
      return T.makeGlue(v, h);
  }, {
    node: p
  }, k, x), n;
}, Ua = function t(e, r, u, a, n) {
  a && e.push(a);
  for (var i = 0; i < e.length; i++) {
    var s = e[i], o = l1(s);
    if (o) {
      t(o.children, r, u, null, n);
      continue;
    }
    var h = !s.hasClass("mspace");
    if (h) {
      var f = r(s, u.node);
      f && (u.insertAfter ? u.insertAfter(f) : (e.unshift(f), i++));
    }
    h ? u.node = s : n && s.hasClass("newline") && (u.node = Me(["leftmost"])), u.insertAfter = /* @__PURE__ */ ((p) => (k) => {
      e.splice(p + 1, 0, k), i++;
    })(i);
  }
  a && e.pop();
}, l1 = function(e) {
  return e instanceof zt || e instanceof t1 || e instanceof fr && e.hasClass("enclosing") ? e : null;
}, ac = function t(e, r) {
  var u = l1(e);
  if (u) {
    var a = u.children;
    if (a.length) {
      if (r === "right")
        return t(a[a.length - 1], "right");
      if (r === "left")
        return t(a[0], "left");
    }
  }
  return e;
}, mu = function(e, r) {
  return e ? (r && (e = ac(e, r)), uc[e.classes[0]] || null) : null;
}, Dt = function(e, r) {
  var u = ["nulldelimiter"].concat(e.baseSizingClasses());
  return Me(r.concat(u));
}, Q = function(e, r, u) {
  if (!e)
    return Me();
  if (ir[e.type]) {
    var a = ir[e.type](e, r);
    if (u && r.size !== u.size) {
      a = Me(r.sizingClasses(u), [a], r);
      var n = r.sizeMultiplier / u.sizeMultiplier;
      a.height *= n, a.depth *= n;
    }
    return a;
  } else
    throw new R("Got group of unknown type: '" + e.type + "'");
};
function jt(t, e) {
  var r = Me(["base"], t, e), u = Me(["strut"]);
  return u.style.height = O(r.height + r.depth), r.depth && (u.style.verticalAlign = O(-r.depth)), r.children.unshift(u), r;
}
function Ga(t, e) {
  var r = null;
  t.length === 1 && t[0].type === "tag" && (r = t[0].tag, t = t[0].body);
  var u = y0(t, e, "root"), a;
  u.length === 2 && u[1].hasClass("tag") && (a = u.pop());
  for (var n = [], i = [], s = 0; s < u.length; s++)
    if (i.push(u[s]), u[s].hasClass("mbin") || u[s].hasClass("mrel") || u[s].hasClass("allowbreak")) {
      for (var o = !1; s < u.length - 1 && u[s + 1].hasClass("mspace") && !u[s + 1].hasClass("newline"); )
        s++, i.push(u[s]), u[s].hasClass("nobreak") && (o = !0);
      o || (n.push(jt(i, e)), i = []);
    } else u[s].hasClass("newline") && (i.pop(), i.length > 0 && (n.push(jt(i, e)), i = []), n.push(u[s]));
  i.length > 0 && n.push(jt(i, e));
  var h;
  r ? (h = jt(y0(r, e, !0)), h.classes = ["tag"], n.push(h)) : a && n.push(a);
  var f = Me(["katex-html"], n);
  if (f.setAttribute("aria-hidden", "true"), h) {
    var p = h.children[0];
    p.style.height = O(f.height + f.depth), f.depth && (p.style.verticalAlign = O(-f.depth));
  }
  return f;
}
function o1(t) {
  return new zt(t);
}
class G0 {
  constructor(e, r, u) {
    this.type = void 0, this.attributes = void 0, this.children = void 0, this.classes = void 0, this.type = e, this.attributes = {}, this.children = r || [], this.classes = u || [];
  }
  /**
   * Sets an attribute on a MathML node. MathML depends on attributes to convey a
   * semantic content, so this is used heavily.
   */
  setAttribute(e, r) {
    this.attributes[e] = r;
  }
  /**
   * Gets an attribute on a MathML node.
   */
  getAttribute(e) {
    return this.attributes[e];
  }
  /**
   * Converts the math node into a MathML-namespaced DOM element.
   */
  toNode() {
    var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
    for (var r in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, r) && e.setAttribute(r, this.attributes[r]);
    this.classes.length > 0 && (e.className = He(this.classes));
    for (var u = 0; u < this.children.length; u++)
      if (this.children[u] instanceof me && this.children[u + 1] instanceof me) {
        for (var a = this.children[u].toText() + this.children[++u].toText(); this.children[u + 1] instanceof me; )
          a += this.children[++u].toText();
        e.appendChild(new me(a).toNode());
      } else
        e.appendChild(this.children[u].toNode());
    return e;
  }
  /**
   * Converts the math node into an HTML markup string.
   */
  toMarkup() {
    var e = "<" + this.type;
    for (var r in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, r) && (e += " " + r + '="', e += t0.escape(this.attributes[r]), e += '"');
    this.classes.length > 0 && (e += ' class ="' + t0.escape(He(this.classes)) + '"'), e += ">";
    for (var u = 0; u < this.children.length; u++)
      e += this.children[u].toMarkup();
    return e += "</" + this.type + ">", e;
  }
  /**
   * Converts the math node into a string, similar to innerText, but escaped.
   */
  toText() {
    return this.children.map((e) => e.toText()).join("");
  }
}
class me {
  constructor(e) {
    this.text = void 0, this.text = e;
  }
  /**
   * Converts the text node into a DOM text node.
   */
  toNode() {
    return document.createTextNode(this.text);
  }
  /**
   * Converts the text node into escaped HTML markup
   * (representing the text itself).
   */
  toMarkup() {
    return t0.escape(this.toText());
  }
  /**
   * Converts the text node into a string
   * (representing the text itself).
   */
  toText() {
    return this.text;
  }
}
class nc {
  /**
   * Create a Space node with width given in CSS ems.
   */
  constructor(e) {
    this.width = void 0, this.character = void 0, this.width = e, e >= 0.05555 && e <= 0.05556 ? this.character = " " : e >= 0.1666 && e <= 0.1667 ? this.character = " " : e >= 0.2222 && e <= 0.2223 ? this.character = " " : e >= 0.2777 && e <= 0.2778 ? this.character = "  " : e >= -0.05556 && e <= -0.05555 ? this.character = " ⁣" : e >= -0.1667 && e <= -0.1666 ? this.character = " ⁣" : e >= -0.2223 && e <= -0.2222 ? this.character = " ⁣" : e >= -0.2778 && e <= -0.2777 ? this.character = " ⁣" : this.character = null;
  }
  /**
   * Converts the math node into a MathML-namespaced DOM element.
   */
  toNode() {
    if (this.character)
      return document.createTextNode(this.character);
    var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
    return e.setAttribute("width", O(this.width)), e;
  }
  /**
   * Converts the math node into an HTML markup string.
   */
  toMarkup() {
    return this.character ? "<mtext>" + this.character + "</mtext>" : '<mspace width="' + O(this.width) + '"/>';
  }
  /**
   * Converts the math node into a string, similar to innerText.
   */
  toText() {
    return this.character ? this.character : " ";
  }
}
var I = {
  MathNode: G0,
  TextNode: me,
  SpaceNode: nc,
  newDocumentFragment: o1
}, J0 = function(e, r, u) {
  return i0[r][e] && i0[r][e].replace && e.charCodeAt(0) !== 55349 && !(r1.hasOwnProperty(e) && u && (u.fontFamily && u.fontFamily.slice(4, 6) === "tt" || u.font && u.font.slice(4, 6) === "tt")) && (e = i0[r][e].replace), new I.TextNode(e);
}, zu = function(e) {
  return e.length === 1 ? e[0] : new I.MathNode("mrow", e);
}, Bu = function(e, r) {
  if (r.fontFamily === "texttt")
    return "monospace";
  if (r.fontFamily === "textsf")
    return r.fontShape === "textit" && r.fontWeight === "textbf" ? "sans-serif-bold-italic" : r.fontShape === "textit" ? "sans-serif-italic" : r.fontWeight === "textbf" ? "bold-sans-serif" : "sans-serif";
  if (r.fontShape === "textit" && r.fontWeight === "textbf")
    return "bold-italic";
  if (r.fontShape === "textit")
    return "italic";
  if (r.fontWeight === "textbf")
    return "bold";
  var u = r.font;
  if (!u || u === "mathnormal")
    return null;
  var a = e.mode;
  if (u === "mathit")
    return "italic";
  if (u === "boldsymbol")
    return e.type === "textord" ? "bold" : "bold-italic";
  if (u === "mathbf")
    return "bold";
  if (u === "mathbb")
    return "double-struck";
  if (u === "mathsfit")
    return "sans-serif-italic";
  if (u === "mathfrak")
    return "fraktur";
  if (u === "mathscr" || u === "mathcal")
    return "script";
  if (u === "mathsf")
    return "sans-serif";
  if (u === "mathtt")
    return "monospace";
  var n = e.text;
  if (["\\imath", "\\jmath"].includes(n))
    return null;
  i0[a][n] && i0[a][n].replace && (n = i0[a][n].replace);
  var i = T.fontMap[u].fontName;
  return Mu(n, i, a) ? T.fontMap[u].variant : null;
};
function jr(t) {
  if (!t)
    return !1;
  if (t.type === "mi" && t.children.length === 1) {
    var e = t.children[0];
    return e instanceof me && e.text === ".";
  } else if (t.type === "mo" && t.children.length === 1 && t.getAttribute("separator") === "true" && t.getAttribute("lspace") === "0em" && t.getAttribute("rspace") === "0em") {
    var r = t.children[0];
    return r instanceof me && r.text === ",";
  } else
    return !1;
}
var $0 = function(e, r, u) {
  if (e.length === 1) {
    var a = a0(e[0], r);
    return u && a instanceof G0 && a.type === "mo" && (a.setAttribute("lspace", "0em"), a.setAttribute("rspace", "0em")), [a];
  }
  for (var n = [], i, s = 0; s < e.length; s++) {
    var o = a0(e[s], r);
    if (o instanceof G0 && i instanceof G0) {
      if (o.type === "mtext" && i.type === "mtext" && o.getAttribute("mathvariant") === i.getAttribute("mathvariant")) {
        i.children.push(...o.children);
        continue;
      } else if (o.type === "mn" && i.type === "mn") {
        i.children.push(...o.children);
        continue;
      } else if (jr(o) && i.type === "mn") {
        i.children.push(...o.children);
        continue;
      } else if (o.type === "mn" && jr(i))
        o.children = [...i.children, ...o.children], n.pop();
      else if ((o.type === "msup" || o.type === "msub") && o.children.length >= 1 && (i.type === "mn" || jr(i))) {
        var h = o.children[0];
        h instanceof G0 && h.type === "mn" && (h.children = [...i.children, ...h.children], n.pop());
      } else if (i.type === "mi" && i.children.length === 1) {
        var f = i.children[0];
        if (f instanceof me && f.text === "̸" && (o.type === "mo" || o.type === "mi" || o.type === "mn")) {
          var p = o.children[0];
          p instanceof me && p.text.length > 0 && (p.text = p.text.slice(0, 1) + "̸" + p.text.slice(1), n.pop());
        }
      }
    }
    n.push(o), i = o;
  }
  return n;
}, Ue = function(e, r, u) {
  return zu($0(e, r, u));
}, a0 = function(e, r) {
  if (!e)
    return new I.MathNode("mrow");
  if (sr[e.type]) {
    var u = sr[e.type](e, r);
    return u;
  } else
    throw new R("Got group of unknown type: '" + e.type + "'");
};
function Va(t, e, r, u, a) {
  var n = $0(t, r), i;
  n.length === 1 && n[0] instanceof G0 && ["mrow", "mtable"].includes(n[0].type) ? i = n[0] : i = new I.MathNode("mrow", n);
  var s = new I.MathNode("annotation", [new I.TextNode(e)]);
  s.setAttribute("encoding", "application/x-tex");
  var o = new I.MathNode("semantics", [i, s]), h = new I.MathNode("math", [o]);
  h.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML"), u && h.setAttribute("display", "block");
  var f = a ? "katex" : "katex-mathml";
  return T.makeSpan([f], [h]);
}
var ic = function(e) {
  return new Ce({
    style: e.displayMode ? j.DISPLAY : j.TEXT,
    maxSize: e.maxSize,
    minRuleThickness: e.minRuleThickness
  });
}, sc = function(e, r) {
  if (r.displayMode) {
    var u = ["katex-display"];
    r.leqno && u.push("leqno"), r.fleqn && u.push("fleqn"), e = T.makeSpan(u, [e]);
  }
  return e;
}, lc = function(e, r, u) {
  var a = ic(u), n;
  if (u.output === "mathml")
    return Va(e, r, a, u.displayMode, !0);
  if (u.output === "html") {
    var i = Ga(e, a);
    n = T.makeSpan(["katex"], [i]);
  } else {
    var s = Va(e, r, a, u.displayMode, !1), o = Ga(e, a);
    n = T.makeSpan(["katex"], [s, o]);
  }
  return sc(n, u);
}, oc = {
  widehat: "^",
  widecheck: "ˇ",
  widetilde: "~",
  utilde: "~",
  overleftarrow: "←",
  underleftarrow: "←",
  xleftarrow: "←",
  overrightarrow: "→",
  underrightarrow: "→",
  xrightarrow: "→",
  underbrace: "⏟",
  overbrace: "⏞",
  overgroup: "⏠",
  undergroup: "⏡",
  overleftrightarrow: "↔",
  underleftrightarrow: "↔",
  xleftrightarrow: "↔",
  Overrightarrow: "⇒",
  xRightarrow: "⇒",
  overleftharpoon: "↼",
  xleftharpoonup: "↼",
  overrightharpoon: "⇀",
  xrightharpoonup: "⇀",
  xLeftarrow: "⇐",
  xLeftrightarrow: "⇔",
  xhookleftarrow: "↩",
  xhookrightarrow: "↪",
  xmapsto: "↦",
  xrightharpoondown: "⇁",
  xleftharpoondown: "↽",
  xrightleftharpoons: "⇌",
  xleftrightharpoons: "⇋",
  xtwoheadleftarrow: "↞",
  xtwoheadrightarrow: "↠",
  xlongequal: "=",
  xtofrom: "⇄",
  xrightleftarrows: "⇄",
  xrightequilibrium: "⇌",
  // Not a perfect match.
  xleftequilibrium: "⇋",
  // None better available.
  "\\cdrightarrow": "→",
  "\\cdleftarrow": "←",
  "\\cdlongequal": "="
}, cc = function(e) {
  var r = new I.MathNode("mo", [new I.TextNode(oc[e.replace(/^\\/, "")])]);
  return r.setAttribute("stretchy", "true"), r;
}, hc = {
  //   path(s), minWidth, height, align
  overrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
  overleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
  underrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
  underleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
  xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"],
  "\\cdrightarrow": [["rightarrow"], 3, 522, "xMaxYMin"],
  // CD minwwidth2.5pc
  xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"],
  "\\cdleftarrow": [["leftarrow"], 3, 522, "xMinYMin"],
  Overrightarrow: [["doublerightarrow"], 0.888, 560, "xMaxYMin"],
  xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"],
  xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"],
  overleftharpoon: [["leftharpoon"], 0.888, 522, "xMinYMin"],
  xleftharpoonup: [["leftharpoon"], 0.888, 522, "xMinYMin"],
  xleftharpoondown: [["leftharpoondown"], 0.888, 522, "xMinYMin"],
  overrightharpoon: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
  xrightharpoonup: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
  xrightharpoondown: [["rightharpoondown"], 0.888, 522, "xMaxYMin"],
  xlongequal: [["longequal"], 0.888, 334, "xMinYMin"],
  "\\cdlongequal": [["longequal"], 3, 334, "xMinYMin"],
  xtwoheadleftarrow: [["twoheadleftarrow"], 0.888, 334, "xMinYMin"],
  xtwoheadrightarrow: [["twoheadrightarrow"], 0.888, 334, "xMaxYMin"],
  overleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
  overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548],
  underbrace: [["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548],
  underleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
  xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522],
  xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560],
  xrightleftharpoons: [["leftharpoondownplus", "rightharpoonplus"], 1.75, 716],
  xleftrightharpoons: [["leftharpoonplus", "rightharpoondownplus"], 1.75, 716],
  xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522],
  xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522],
  overlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
  underlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
  overgroup: [["leftgroup", "rightgroup"], 0.888, 342],
  undergroup: [["leftgroupunder", "rightgroupunder"], 0.888, 342],
  xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522],
  xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528],
  // The next three arrows are from the mhchem package.
  // In mhchem.sty, min-length is 2.0em. But these arrows might appear in the
  // document as \xrightarrow or \xrightleftharpoons. Those have
  // min-length = 1.75em, so we set min-length on these next three to match.
  xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901],
  xrightequilibrium: [["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716],
  xleftequilibrium: [["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716]
}, dc = function(e) {
  return e.type === "ordgroup" ? e.body.length : 1;
}, fc = function(e, r) {
  function u() {
    var s = 4e5, o = e.label.slice(1);
    if (["widehat", "widecheck", "widetilde", "utilde"].includes(o)) {
      var h = e, f = dc(h.base), p, k, x;
      if (f > 5)
        o === "widehat" || o === "widecheck" ? (p = 420, s = 2364, x = 0.42, k = o + "4") : (p = 312, s = 2340, x = 0.34, k = "tilde4");
      else {
        var y = [1, 1, 2, 2, 3, 3][f];
        o === "widehat" || o === "widecheck" ? (s = [0, 1062, 2364, 2364, 2364][y], p = [0, 239, 300, 360, 420][y], x = [0, 0.24, 0.3, 0.3, 0.36, 0.42][y], k = o + y) : (s = [0, 600, 1033, 2339, 2340][y], p = [0, 260, 286, 306, 312][y], x = [0, 0.26, 0.286, 0.3, 0.306, 0.34][y], k = "tilde" + y);
      }
      var _ = new Ye(k), E = new $e([_], {
        width: "100%",
        height: O(x),
        viewBox: "0 0 " + s + " " + p,
        preserveAspectRatio: "none"
      });
      return {
        span: T.makeSvgSpan([], [E], r),
        minWidth: 0,
        height: x
      };
    } else {
      var F = [], v = hc[o], [w, C, D] = v, M = D / 1e3, z = w.length, P, N;
      if (z === 1) {
        var Y = v[3];
        P = ["hide-tail"], N = [Y];
      } else if (z === 2)
        P = ["halfarrow-left", "halfarrow-right"], N = ["xMinYMin", "xMaxYMin"];
      else if (z === 3)
        P = ["brace-left", "brace-center", "brace-right"], N = ["xMinYMin", "xMidYMin", "xMaxYMin"];
      else
        throw new Error(`Correct katexImagesData or update code here to support
                    ` + z + " children.");
      for (var G = 0; G < z; G++) {
        var K = new Ye(w[G]), C0 = new $e([K], {
          width: "400em",
          height: O(M),
          viewBox: "0 0 " + s + " " + D,
          preserveAspectRatio: N[G] + " slice"
        }), o0 = T.makeSvgSpan([P[G]], [C0], r);
        if (z === 1)
          return {
            span: o0,
            minWidth: C,
            height: M
          };
        o0.style.height = O(M), F.push(o0);
      }
      return {
        span: T.makeSpan(["stretchy"], F, r),
        minWidth: C,
        height: M
      };
    }
  }
  var {
    span: a,
    minWidth: n,
    height: i
  } = u();
  return a.height = i, a.style.height = O(i), n > 0 && (a.style.minWidth = O(n)), a;
}, mc = function(e, r, u, a, n) {
  var i, s = e.height + e.depth + u + a;
  if (/fbox|color|angl/.test(r)) {
    if (i = T.makeSpan(["stretchy", r], [], n), r === "fbox") {
      var o = n.color && n.getColor();
      o && (i.style.borderColor = o);
    }
  } else {
    var h = [];
    /^[bx]cancel$/.test(r) && h.push(new Na({
      x1: "0",
      y1: "0",
      x2: "100%",
      y2: "100%",
      "stroke-width": "0.046em"
    })), /^x?cancel$/.test(r) && h.push(new Na({
      x1: "0",
      y1: "100%",
      x2: "100%",
      y2: "0",
      "stroke-width": "0.046em"
    }));
    var f = new $e(h, {
      width: "100%",
      height: O(s)
    });
    i = T.makeSvgSpan([], [f], n);
  }
  return i.height = s, i.style.height = O(s), i;
}, Fe = {
  encloseSpan: mc,
  mathMLnode: cc,
  svgSpan: fc
};
function Z(t, e) {
  if (!t || t.type !== e)
    throw new Error("Expected node of type " + e + ", but got " + (t ? "node of type " + t.type : String(t)));
  return t;
}
function Iu(t) {
  var e = br(t);
  if (!e)
    throw new Error("Expected node of symbol group type, but got " + (t ? "node of type " + t.type : String(t)));
  return e;
}
function br(t) {
  return t && (t.type === "atom" || Oo.hasOwnProperty(t.type)) ? t : null;
}
var Ru = (t, e) => {
  var r, u, a;
  t && t.type === "supsub" ? (u = Z(t.base, "accent"), r = u.base, t.base = r, a = No(Q(t, e)), t.base = u) : (u = Z(t, "accent"), r = u.base);
  var n = Q(r, e.havingCrampedStyle()), i = u.isShifty && t0.isCharacterBox(r), s = 0;
  if (i) {
    var o = t0.getBaseElem(r), h = Q(o, e.havingCrampedStyle());
    s = La(h).skew;
  }
  var f = u.label === "\\c", p = f ? n.height + n.depth : Math.min(n.height, e.fontMetrics().xHeight), k;
  if (u.isStretchy)
    k = Fe.svgSpan(u, e), k = T.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: n
      }, {
        type: "elem",
        elem: k,
        wrapperClasses: ["svg-align"],
        wrapperStyle: s > 0 ? {
          width: "calc(100% - " + O(2 * s) + ")",
          marginLeft: O(2 * s)
        } : void 0
      }]
    }, e);
  else {
    var x, y;
    u.label === "\\vec" ? (x = T.staticSvg("vec", e), y = T.svgData.vec[1]) : (x = T.makeOrd({
      mode: u.mode,
      text: u.label
    }, e, "textord"), x = La(x), x.italic = 0, y = x.width, f && (p += x.depth)), k = T.makeSpan(["accent-body"], [x]);
    var _ = u.label === "\\textcircled";
    _ && (k.classes.push("accent-full"), p = n.height);
    var E = s;
    _ || (E -= y / 2), k.style.left = O(E), u.label === "\\textcircled" && (k.style.top = ".2em"), k = T.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: n
      }, {
        type: "kern",
        size: -p
      }, {
        type: "elem",
        elem: k
      }]
    }, e);
  }
  var F = T.makeSpan(["mord", "accent"], [k], e);
  return a ? (a.children[0] = F, a.height = Math.max(F.height, a.height), a.classes[0] = "mord", a) : F;
}, c1 = (t, e) => {
  var r = t.isStretchy ? Fe.mathMLnode(t.label) : new I.MathNode("mo", [J0(t.label, t.mode)]), u = new I.MathNode("mover", [a0(t.base, e), r]);
  return u.setAttribute("accent", "true"), u;
}, pc = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map((t) => "\\" + t).join("|"));
q({
  type: "accent",
  names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"],
  props: {
    numArgs: 1
  },
  handler: (t, e) => {
    var r = lr(e[0]), u = !pc.test(t.funcName), a = !u || t.funcName === "\\widehat" || t.funcName === "\\widetilde" || t.funcName === "\\widecheck";
    return {
      type: "accent",
      mode: t.parser.mode,
      label: t.funcName,
      isStretchy: u,
      isShifty: a,
      base: r
    };
  },
  htmlBuilder: Ru,
  mathmlBuilder: c1
});
q({
  type: "accent",
  names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\c", "\\r", "\\H", "\\v", "\\textcircled"],
  props: {
    numArgs: 1,
    allowedInText: !0,
    allowedInMath: !0,
    // unless in strict mode
    argTypes: ["primitive"]
  },
  handler: (t, e) => {
    var r = e[0], u = t.parser.mode;
    return u === "math" && (t.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + t.funcName + " works only in text mode"), u = "text"), {
      type: "accent",
      mode: u,
      label: t.funcName,
      isStretchy: !1,
      isShifty: !0,
      base: r
    };
  },
  htmlBuilder: Ru,
  mathmlBuilder: c1
});
q({
  type: "accentUnder",
  names: ["\\underleftarrow", "\\underrightarrow", "\\underleftrightarrow", "\\undergroup", "\\underlinesegment", "\\utilde"],
  props: {
    numArgs: 1
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0];
    return {
      type: "accentUnder",
      mode: r.mode,
      label: u,
      base: a
    };
  },
  htmlBuilder: (t, e) => {
    var r = Q(t.base, e), u = Fe.svgSpan(t, e), a = t.label === "\\utilde" ? 0.12 : 0, n = T.makeVList({
      positionType: "top",
      positionData: r.height,
      children: [{
        type: "elem",
        elem: u,
        wrapperClasses: ["svg-align"]
      }, {
        type: "kern",
        size: a
      }, {
        type: "elem",
        elem: r
      }]
    }, e);
    return T.makeSpan(["mord", "accentunder"], [n], e);
  },
  mathmlBuilder: (t, e) => {
    var r = Fe.mathMLnode(t.label), u = new I.MathNode("munder", [a0(t.base, e), r]);
    return u.setAttribute("accentunder", "true"), u;
  }
});
var Wt = (t) => {
  var e = new I.MathNode("mpadded", t ? [t] : []);
  return e.setAttribute("width", "+0.6em"), e.setAttribute("lspace", "0.3em"), e;
};
q({
  type: "xArrow",
  names: [
    "\\xleftarrow",
    "\\xrightarrow",
    "\\xLeftarrow",
    "\\xRightarrow",
    "\\xleftrightarrow",
    "\\xLeftrightarrow",
    "\\xhookleftarrow",
    "\\xhookrightarrow",
    "\\xmapsto",
    "\\xrightharpoondown",
    "\\xrightharpoonup",
    "\\xleftharpoondown",
    "\\xleftharpoonup",
    "\\xrightleftharpoons",
    "\\xleftrightharpoons",
    "\\xlongequal",
    "\\xtwoheadrightarrow",
    "\\xtwoheadleftarrow",
    "\\xtofrom",
    // The next 3 functions are here to support the mhchem extension.
    // Direct use of these functions is discouraged and may break someday.
    "\\xrightleftarrows",
    "\\xrightequilibrium",
    "\\xleftequilibrium",
    // The next 3 functions are here only to support the {CD} environment.
    "\\\\cdrightarrow",
    "\\\\cdleftarrow",
    "\\\\cdlongequal"
  ],
  props: {
    numArgs: 1,
    numOptionalArgs: 1
  },
  handler(t, e, r) {
    var {
      parser: u,
      funcName: a
    } = t;
    return {
      type: "xArrow",
      mode: u.mode,
      label: a,
      body: e[0],
      below: r[0]
    };
  },
  // Flow is unable to correctly infer the type of `group`, even though it's
  // unambiguously determined from the passed-in `type` above.
  htmlBuilder(t, e) {
    var r = e.style, u = e.havingStyle(r.sup()), a = T.wrapFragment(Q(t.body, u, e), e), n = t.label.slice(0, 2) === "\\x" ? "x" : "cd";
    a.classes.push(n + "-arrow-pad");
    var i;
    t.below && (u = e.havingStyle(r.sub()), i = T.wrapFragment(Q(t.below, u, e), e), i.classes.push(n + "-arrow-pad"));
    var s = Fe.svgSpan(t, e), o = -e.fontMetrics().axisHeight + 0.5 * s.height, h = -e.fontMetrics().axisHeight - 0.5 * s.height - 0.111;
    (a.depth > 0.25 || t.label === "\\xleftequilibrium") && (h -= a.depth);
    var f;
    if (i) {
      var p = -e.fontMetrics().axisHeight + i.height + 0.5 * s.height + 0.111;
      f = T.makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: a,
          shift: h
        }, {
          type: "elem",
          elem: s,
          shift: o
        }, {
          type: "elem",
          elem: i,
          shift: p
        }]
      }, e);
    } else
      f = T.makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: a,
          shift: h
        }, {
          type: "elem",
          elem: s,
          shift: o
        }]
      }, e);
    return f.children[0].children[0].children[1].classes.push("svg-align"), T.makeSpan(["mrel", "x-arrow"], [f], e);
  },
  mathmlBuilder(t, e) {
    var r = Fe.mathMLnode(t.label);
    r.setAttribute("minsize", t.label.charAt(0) === "x" ? "1.75em" : "3.0em");
    var u;
    if (t.body) {
      var a = Wt(a0(t.body, e));
      if (t.below) {
        var n = Wt(a0(t.below, e));
        u = new I.MathNode("munderover", [r, n, a]);
      } else
        u = new I.MathNode("mover", [r, a]);
    } else if (t.below) {
      var i = Wt(a0(t.below, e));
      u = new I.MathNode("munder", [r, i]);
    } else
      u = Wt(), u = new I.MathNode("mover", [r, u]);
    return u;
  }
});
var bc = T.makeSpan;
function h1(t, e) {
  var r = y0(t.body, e, !0);
  return bc([t.mclass], r, e);
}
function d1(t, e) {
  var r, u = $0(t.body, e);
  return t.mclass === "minner" ? r = new I.MathNode("mpadded", u) : t.mclass === "mord" ? t.isCharacterBox ? (r = u[0], r.type = "mi") : r = new I.MathNode("mi", u) : (t.isCharacterBox ? (r = u[0], r.type = "mo") : r = new I.MathNode("mo", u), t.mclass === "mbin" ? (r.attributes.lspace = "0.22em", r.attributes.rspace = "0.22em") : t.mclass === "mpunct" ? (r.attributes.lspace = "0em", r.attributes.rspace = "0.17em") : t.mclass === "mopen" || t.mclass === "mclose" ? (r.attributes.lspace = "0em", r.attributes.rspace = "0em") : t.mclass === "minner" && (r.attributes.lspace = "0.0556em", r.attributes.width = "+0.1111em")), r;
}
q({
  type: "mclass",
  names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0];
    return {
      type: "mclass",
      mode: r.mode,
      mclass: "m" + u.slice(5),
      // TODO(kevinb): don't prefix with 'm'
      body: b0(a),
      isCharacterBox: t0.isCharacterBox(a)
    };
  },
  htmlBuilder: h1,
  mathmlBuilder: d1
});
var gr = (t) => {
  var e = t.type === "ordgroup" && t.body.length ? t.body[0] : t;
  return e.type === "atom" && (e.family === "bin" || e.family === "rel") ? "m" + e.family : "mord";
};
q({
  type: "mclass",
  names: ["\\@binrel"],
  props: {
    numArgs: 2
  },
  handler(t, e) {
    var {
      parser: r
    } = t;
    return {
      type: "mclass",
      mode: r.mode,
      mclass: gr(e[0]),
      body: b0(e[1]),
      isCharacterBox: t0.isCharacterBox(e[1])
    };
  }
});
q({
  type: "mclass",
  names: ["\\stackrel", "\\overset", "\\underset"],
  props: {
    numArgs: 2
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u
    } = t, a = e[1], n = e[0], i;
    u !== "\\stackrel" ? i = gr(a) : i = "mrel";
    var s = {
      type: "op",
      mode: a.mode,
      limits: !0,
      alwaysHandleSupSub: !0,
      parentIsSupSub: !1,
      symbol: !1,
      suppressBaseShift: u !== "\\stackrel",
      body: b0(a)
    }, o = {
      type: "supsub",
      mode: n.mode,
      base: s,
      sup: u === "\\underset" ? null : n,
      sub: u === "\\underset" ? n : null
    };
    return {
      type: "mclass",
      mode: r.mode,
      mclass: i,
      body: [o],
      isCharacterBox: t0.isCharacterBox(o)
    };
  },
  htmlBuilder: h1,
  mathmlBuilder: d1
});
q({
  type: "pmb",
  names: ["\\pmb"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(t, e) {
    var {
      parser: r
    } = t;
    return {
      type: "pmb",
      mode: r.mode,
      mclass: gr(e[0]),
      body: b0(e[0])
    };
  },
  htmlBuilder(t, e) {
    var r = y0(t.body, e, !0), u = T.makeSpan([t.mclass], r, e);
    return u.style.textShadow = "0.02em 0.01em 0.04px", u;
  },
  mathmlBuilder(t, e) {
    var r = $0(t.body, e), u = new I.MathNode("mstyle", r);
    return u.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px"), u;
  }
});
var gc = {
  ">": "\\\\cdrightarrow",
  "<": "\\\\cdleftarrow",
  "=": "\\\\cdlongequal",
  A: "\\uparrow",
  V: "\\downarrow",
  "|": "\\Vert",
  ".": "no arrow"
}, ja = () => ({
  type: "styling",
  body: [],
  mode: "math",
  style: "display"
}), Wa = (t) => t.type === "textord" && t.text === "@", vc = (t, e) => (t.type === "mathord" || t.type === "atom") && t.text === e;
function xc(t, e, r) {
  var u = gc[t];
  switch (u) {
    case "\\\\cdrightarrow":
    case "\\\\cdleftarrow":
      return r.callFunction(u, [e[0]], [e[1]]);
    case "\\uparrow":
    case "\\downarrow": {
      var a = r.callFunction("\\\\cdleft", [e[0]], []), n = {
        type: "atom",
        text: u,
        mode: "math",
        family: "rel"
      }, i = r.callFunction("\\Big", [n], []), s = r.callFunction("\\\\cdright", [e[1]], []), o = {
        type: "ordgroup",
        mode: "math",
        body: [a, i, s]
      };
      return r.callFunction("\\\\cdparent", [o], []);
    }
    case "\\\\cdlongequal":
      return r.callFunction("\\\\cdlongequal", [], []);
    case "\\Vert": {
      var h = {
        type: "textord",
        text: "\\Vert",
        mode: "math"
      };
      return r.callFunction("\\Big", [h], []);
    }
    default:
      return {
        type: "textord",
        text: " ",
        mode: "math"
      };
  }
}
function yc(t) {
  var e = [];
  for (t.gullet.beginGroup(), t.gullet.macros.set("\\cr", "\\\\\\relax"), t.gullet.beginGroup(); ; ) {
    e.push(t.parseExpression(!1, "\\\\")), t.gullet.endGroup(), t.gullet.beginGroup();
    var r = t.fetch().text;
    if (r === "&" || r === "\\\\")
      t.consume();
    else if (r === "\\end") {
      e[e.length - 1].length === 0 && e.pop();
      break;
    } else
      throw new R("Expected \\\\ or \\cr or \\end", t.nextToken);
  }
  for (var u = [], a = [u], n = 0; n < e.length; n++) {
    for (var i = e[n], s = ja(), o = 0; o < i.length; o++)
      if (!Wa(i[o]))
        s.body.push(i[o]);
      else {
        u.push(s), o += 1;
        var h = Iu(i[o]).text, f = new Array(2);
        if (f[0] = {
          type: "ordgroup",
          mode: "math",
          body: []
        }, f[1] = {
          type: "ordgroup",
          mode: "math",
          body: []
        }, !("=|.".indexOf(h) > -1)) if ("<>AV".indexOf(h) > -1)
          for (var p = 0; p < 2; p++) {
            for (var k = !0, x = o + 1; x < i.length; x++) {
              if (vc(i[x], h)) {
                k = !1, o = x;
                break;
              }
              if (Wa(i[x]))
                throw new R("Missing a " + h + " character to complete a CD arrow.", i[x]);
              f[p].body.push(i[x]);
            }
            if (k)
              throw new R("Missing a " + h + " character to complete a CD arrow.", i[o]);
          }
        else
          throw new R('Expected one of "<>AV=|." after @', i[o]);
        var y = xc(h, f, t), _ = {
          type: "styling",
          body: [y],
          mode: "math",
          style: "display"
          // CD is always displaystyle.
        };
        u.push(_), s = ja();
      }
    n % 2 === 0 ? u.push(s) : u.shift(), u = [], a.push(u);
  }
  t.gullet.endGroup(), t.gullet.endGroup();
  var E = new Array(a[0].length).fill({
    type: "align",
    align: "c",
    pregap: 0.25,
    // CD package sets \enskip between columns.
    postgap: 0.25
    // So pre and post each get half an \enskip, i.e. 0.25em.
  });
  return {
    type: "array",
    mode: "math",
    body: a,
    arraystretch: 1,
    addJot: !0,
    rowGaps: [null],
    cols: E,
    colSeparationType: "CD",
    hLinesBeforeRow: new Array(a.length + 1).fill([])
  };
}
q({
  type: "cdlabel",
  names: ["\\\\cdleft", "\\\\cdright"],
  props: {
    numArgs: 1
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u
    } = t;
    return {
      type: "cdlabel",
      mode: r.mode,
      side: u.slice(4),
      label: e[0]
    };
  },
  htmlBuilder(t, e) {
    var r = e.havingStyle(e.style.sup()), u = T.wrapFragment(Q(t.label, r, e), e);
    return u.classes.push("cd-label-" + t.side), u.style.bottom = O(0.8 - u.depth), u.height = 0, u.depth = 0, u;
  },
  mathmlBuilder(t, e) {
    var r = new I.MathNode("mrow", [a0(t.label, e)]);
    return r = new I.MathNode("mpadded", [r]), r.setAttribute("width", "0"), t.side === "left" && r.setAttribute("lspace", "-1width"), r.setAttribute("voffset", "0.7em"), r = new I.MathNode("mstyle", [r]), r.setAttribute("displaystyle", "false"), r.setAttribute("scriptlevel", "1"), r;
  }
});
q({
  type: "cdlabelparent",
  names: ["\\\\cdparent"],
  props: {
    numArgs: 1
  },
  handler(t, e) {
    var {
      parser: r
    } = t;
    return {
      type: "cdlabelparent",
      mode: r.mode,
      fragment: e[0]
    };
  },
  htmlBuilder(t, e) {
    var r = T.wrapFragment(Q(t.fragment, e), e);
    return r.classes.push("cd-vert-arrow"), r;
  },
  mathmlBuilder(t, e) {
    return new I.MathNode("mrow", [a0(t.fragment, e)]);
  }
});
q({
  type: "textord",
  names: ["\\@char"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(t, e) {
    for (var {
      parser: r
    } = t, u = Z(e[0], "ordgroup"), a = u.body, n = "", i = 0; i < a.length; i++) {
      var s = Z(a[i], "textord");
      n += s.text;
    }
    var o = parseInt(n), h;
    if (isNaN(o))
      throw new R("\\@char has non-numeric argument " + n);
    if (o < 0 || o >= 1114111)
      throw new R("\\@char with invalid code point " + n);
    return o <= 65535 ? h = String.fromCharCode(o) : (o -= 65536, h = String.fromCharCode((o >> 10) + 55296, (o & 1023) + 56320)), {
      type: "textord",
      mode: r.mode,
      text: h
    };
  }
});
var f1 = (t, e) => {
  var r = y0(t.body, e.withColor(t.color), !1);
  return T.makeFragment(r);
}, m1 = (t, e) => {
  var r = $0(t.body, e.withColor(t.color)), u = new I.MathNode("mstyle", r);
  return u.setAttribute("mathcolor", t.color), u;
};
q({
  type: "color",
  names: ["\\textcolor"],
  props: {
    numArgs: 2,
    allowedInText: !0,
    argTypes: ["color", "original"]
  },
  handler(t, e) {
    var {
      parser: r
    } = t, u = Z(e[0], "color-token").color, a = e[1];
    return {
      type: "color",
      mode: r.mode,
      color: u,
      body: b0(a)
    };
  },
  htmlBuilder: f1,
  mathmlBuilder: m1
});
q({
  type: "color",
  names: ["\\color"],
  props: {
    numArgs: 1,
    allowedInText: !0,
    argTypes: ["color"]
  },
  handler(t, e) {
    var {
      parser: r,
      breakOnTokenText: u
    } = t, a = Z(e[0], "color-token").color;
    r.gullet.macros.set("\\current@color", a);
    var n = r.parseExpression(!0, u);
    return {
      type: "color",
      mode: r.mode,
      color: a,
      body: n
    };
  },
  htmlBuilder: f1,
  mathmlBuilder: m1
});
q({
  type: "cr",
  names: ["\\\\"],
  props: {
    numArgs: 0,
    numOptionalArgs: 0,
    allowedInText: !0
  },
  handler(t, e, r) {
    var {
      parser: u
    } = t, a = u.gullet.future().text === "[" ? u.parseSizeGroup(!0) : null, n = !u.settings.displayMode || !u.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
    return {
      type: "cr",
      mode: u.mode,
      newLine: n,
      size: a && Z(a, "size").value
    };
  },
  // The following builders are called only at the top level,
  // not within tabular/array environments.
  htmlBuilder(t, e) {
    var r = T.makeSpan(["mspace"], [], e);
    return t.newLine && (r.classes.push("newline"), t.size && (r.style.marginTop = O(f0(t.size, e)))), r;
  },
  mathmlBuilder(t, e) {
    var r = new I.MathNode("mspace");
    return t.newLine && (r.setAttribute("linebreak", "newline"), t.size && r.setAttribute("height", O(f0(t.size, e)))), r;
  }
});
var pu = {
  "\\global": "\\global",
  "\\long": "\\\\globallong",
  "\\\\globallong": "\\\\globallong",
  "\\def": "\\gdef",
  "\\gdef": "\\gdef",
  "\\edef": "\\xdef",
  "\\xdef": "\\xdef",
  "\\let": "\\\\globallet",
  "\\futurelet": "\\\\globalfuture"
}, p1 = (t) => {
  var e = t.text;
  if (/^(?:[\\{}$&#^_]|EOF)$/.test(e))
    throw new R("Expected a control sequence", t);
  return e;
}, kc = (t) => {
  var e = t.gullet.popToken();
  return e.text === "=" && (e = t.gullet.popToken(), e.text === " " && (e = t.gullet.popToken())), e;
}, b1 = (t, e, r, u) => {
  var a = t.gullet.macros.get(r.text);
  a == null && (r.noexpand = !0, a = {
    tokens: [r],
    numArgs: 0,
    // reproduce the same behavior in expansion
    unexpandable: !t.gullet.isExpandable(r.text)
  }), t.gullet.macros.set(e, a, u);
};
q({
  type: "internal",
  names: [
    "\\global",
    "\\long",
    "\\\\globallong"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler(t) {
    var {
      parser: e,
      funcName: r
    } = t;
    e.consumeSpaces();
    var u = e.fetch();
    if (pu[u.text])
      return (r === "\\global" || r === "\\\\globallong") && (u.text = pu[u.text]), Z(e.parseFunction(), "internal");
    throw new R("Invalid token after macro prefix", u);
  }
});
q({
  type: "internal",
  names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(t) {
    var {
      parser: e,
      funcName: r
    } = t, u = e.gullet.popToken(), a = u.text;
    if (/^(?:[\\{}$&#^_]|EOF)$/.test(a))
      throw new R("Expected a control sequence", u);
    for (var n = 0, i, s = [[]]; e.gullet.future().text !== "{"; )
      if (u = e.gullet.popToken(), u.text === "#") {
        if (e.gullet.future().text === "{") {
          i = e.gullet.future(), s[n].push("{");
          break;
        }
        if (u = e.gullet.popToken(), !/^[1-9]$/.test(u.text))
          throw new R('Invalid argument number "' + u.text + '"');
        if (parseInt(u.text) !== n + 1)
          throw new R('Argument number "' + u.text + '" out of order');
        n++, s.push([]);
      } else {
        if (u.text === "EOF")
          throw new R("Expected a macro definition");
        s[n].push(u.text);
      }
    var {
      tokens: o
    } = e.gullet.consumeArg();
    return i && o.unshift(i), (r === "\\edef" || r === "\\xdef") && (o = e.gullet.expandTokens(o), o.reverse()), e.gullet.macros.set(a, {
      tokens: o,
      numArgs: n,
      delimiters: s
    }, r === pu[r]), {
      type: "internal",
      mode: e.mode
    };
  }
});
q({
  type: "internal",
  names: [
    "\\let",
    "\\\\globallet"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(t) {
    var {
      parser: e,
      funcName: r
    } = t, u = p1(e.gullet.popToken());
    e.gullet.consumeSpaces();
    var a = kc(e);
    return b1(e, u, a, r === "\\\\globallet"), {
      type: "internal",
      mode: e.mode
    };
  }
});
q({
  type: "internal",
  names: [
    "\\futurelet",
    "\\\\globalfuture"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(t) {
    var {
      parser: e,
      funcName: r
    } = t, u = p1(e.gullet.popToken()), a = e.gullet.popToken(), n = e.gullet.popToken();
    return b1(e, u, n, r === "\\\\globalfuture"), e.gullet.pushToken(n), e.gullet.pushToken(a), {
      type: "internal",
      mode: e.mode
    };
  }
});
var kt = function(e, r, u) {
  var a = i0.math[e] && i0.math[e].replace, n = Mu(a || e, r, u);
  if (!n)
    throw new Error("Unsupported symbol " + e + " and font size " + r + ".");
  return n;
}, Nu = function(e, r, u, a) {
  var n = u.havingBaseStyle(r), i = T.makeSpan(a.concat(n.sizingClasses(u)), [e], u), s = n.sizeMultiplier / u.sizeMultiplier;
  return i.height *= s, i.depth *= s, i.maxFontSize = n.sizeMultiplier, i;
}, g1 = function(e, r, u) {
  var a = r.havingBaseStyle(u), n = (1 - r.sizeMultiplier / a.sizeMultiplier) * r.fontMetrics().axisHeight;
  e.classes.push("delimcenter"), e.style.top = O(n), e.height -= n, e.depth += n;
}, wc = function(e, r, u, a, n, i) {
  var s = T.makeSymbol(e, "Main-Regular", n, a), o = Nu(s, r, a, i);
  return u && g1(o, a, r), o;
}, Ac = function(e, r, u, a) {
  return T.makeSymbol(e, "Size" + r + "-Regular", u, a);
}, v1 = function(e, r, u, a, n, i) {
  var s = Ac(e, r, n, a), o = Nu(T.makeSpan(["delimsizing", "size" + r], [s], a), j.TEXT, a, i);
  return u && g1(o, a, j.TEXT), o;
}, Wr = function(e, r, u) {
  var a;
  r === "Size1-Regular" ? a = "delim-size1" : a = "delim-size4";
  var n = T.makeSpan(["delimsizinginner", a], [T.makeSpan([], [T.makeSymbol(e, r, u)])]);
  return {
    type: "elem",
    elem: n
  };
}, Zr = function(e, r, u) {
  var a = Ee["Size4-Regular"][e.charCodeAt(0)] ? Ee["Size4-Regular"][e.charCodeAt(0)][4] : Ee["Size1-Regular"][e.charCodeAt(0)][4], n = new Ye("inner", Do(e, Math.round(1e3 * r))), i = new $e([n], {
    width: O(a),
    height: O(r),
    // Override CSS rule `.katex svg { width: 100% }`
    style: "width:" + O(a),
    viewBox: "0 0 " + 1e3 * a + " " + Math.round(1e3 * r),
    preserveAspectRatio: "xMinYMin"
  }), s = T.makeSvgSpan([], [i], u);
  return s.height = r, s.style.height = O(r), s.style.width = O(a), {
    type: "elem",
    elem: s
  };
}, bu = 8e-3, Zt = {
  type: "kern",
  size: -1 * bu
}, Sc = ["|", "\\lvert", "\\rvert", "\\vert"], _c = ["\\|", "\\lVert", "\\rVert", "\\Vert"], x1 = function(e, r, u, a, n, i) {
  var s, o, h, f, p = "", k = 0;
  s = h = f = e, o = null;
  var x = "Size1-Regular";
  e === "\\uparrow" ? h = f = "⏐" : e === "\\Uparrow" ? h = f = "‖" : e === "\\downarrow" ? s = h = "⏐" : e === "\\Downarrow" ? s = h = "‖" : e === "\\updownarrow" ? (s = "\\uparrow", h = "⏐", f = "\\downarrow") : e === "\\Updownarrow" ? (s = "\\Uparrow", h = "‖", f = "\\Downarrow") : Sc.includes(e) ? (h = "∣", p = "vert", k = 333) : _c.includes(e) ? (h = "∥", p = "doublevert", k = 556) : e === "[" || e === "\\lbrack" ? (s = "⎡", h = "⎢", f = "⎣", x = "Size4-Regular", p = "lbrack", k = 667) : e === "]" || e === "\\rbrack" ? (s = "⎤", h = "⎥", f = "⎦", x = "Size4-Regular", p = "rbrack", k = 667) : e === "\\lfloor" || e === "⌊" ? (h = s = "⎢", f = "⎣", x = "Size4-Regular", p = "lfloor", k = 667) : e === "\\lceil" || e === "⌈" ? (s = "⎡", h = f = "⎢", x = "Size4-Regular", p = "lceil", k = 667) : e === "\\rfloor" || e === "⌋" ? (h = s = "⎥", f = "⎦", x = "Size4-Regular", p = "rfloor", k = 667) : e === "\\rceil" || e === "⌉" ? (s = "⎤", h = f = "⎥", x = "Size4-Regular", p = "rceil", k = 667) : e === "(" || e === "\\lparen" ? (s = "⎛", h = "⎜", f = "⎝", x = "Size4-Regular", p = "lparen", k = 875) : e === ")" || e === "\\rparen" ? (s = "⎞", h = "⎟", f = "⎠", x = "Size4-Regular", p = "rparen", k = 875) : e === "\\{" || e === "\\lbrace" ? (s = "⎧", o = "⎨", f = "⎩", h = "⎪", x = "Size4-Regular") : e === "\\}" || e === "\\rbrace" ? (s = "⎫", o = "⎬", f = "⎭", h = "⎪", x = "Size4-Regular") : e === "\\lgroup" || e === "⟮" ? (s = "⎧", f = "⎩", h = "⎪", x = "Size4-Regular") : e === "\\rgroup" || e === "⟯" ? (s = "⎫", f = "⎭", h = "⎪", x = "Size4-Regular") : e === "\\lmoustache" || e === "⎰" ? (s = "⎧", f = "⎭", h = "⎪", x = "Size4-Regular") : (e === "\\rmoustache" || e === "⎱") && (s = "⎫", f = "⎩", h = "⎪", x = "Size4-Regular");
  var y = kt(s, x, n), _ = y.height + y.depth, E = kt(h, x, n), F = E.height + E.depth, v = kt(f, x, n), w = v.height + v.depth, C = 0, D = 1;
  if (o !== null) {
    var M = kt(o, x, n);
    C = M.height + M.depth, D = 2;
  }
  var z = _ + w + C, P = Math.max(0, Math.ceil((r - z) / (D * F))), N = z + P * D * F, Y = a.fontMetrics().axisHeight;
  u && (Y *= a.sizeMultiplier);
  var G = N / 2 - Y, K = [];
  if (p.length > 0) {
    var C0 = N - _ - w, o0 = Math.round(N * 1e3), m0 = To(p, Math.round(C0 * 1e3)), L0 = new Ye(p, m0), ee = (k / 1e3).toFixed(3) + "em", n0 = (o0 / 1e3).toFixed(3) + "em", E0 = new $e([L0], {
      width: ee,
      height: n0,
      viewBox: "0 0 " + k + " " + o0
    }), k0 = T.makeSvgSpan([], [E0], a);
    k0.height = o0 / 1e3, k0.style.width = ee, k0.style.height = n0, K.push({
      type: "elem",
      elem: k0
    });
  } else {
    if (K.push(Wr(f, x, n)), K.push(Zt), o === null) {
      var e0 = N - _ - w + 2 * bu;
      K.push(Zr(h, e0, a));
    } else {
      var u0 = (N - _ - w - C) / 2 + 2 * bu;
      K.push(Zr(h, u0, a)), K.push(Zt), K.push(Wr(o, x, n)), K.push(Zt), K.push(Zr(h, u0, a));
    }
    K.push(Zt), K.push(Wr(s, x, n));
  }
  var s0 = a.havingBaseStyle(j.TEXT), T0 = T.makeVList({
    positionType: "bottom",
    positionData: G,
    children: K
  }, s0);
  return Nu(T.makeSpan(["delimsizing", "mult"], [T0], s0), j.TEXT, a, i);
}, Yr = 80, Xr = 0.08, Kr = function(e, r, u, a, n) {
  var i = Eo(e, a, u), s = new Ye(e, i), o = new $e([s], {
    // Note: 1000:1 ratio of viewBox to document em width.
    width: "400em",
    height: O(r),
    viewBox: "0 0 400000 " + u,
    preserveAspectRatio: "xMinYMin slice"
  });
  return T.makeSvgSpan(["hide-tail"], [o], n);
}, Cc = function(e, r) {
  var u = r.havingBaseSizing(), a = A1("\\surd", e * u.sizeMultiplier, w1, u), n = u.sizeMultiplier, i = Math.max(0, r.minRuleThickness - r.fontMetrics().sqrtRuleThickness), s, o = 0, h = 0, f = 0, p;
  return a.type === "small" ? (f = 1e3 + 1e3 * i + Yr, e < 1 ? n = 1 : e < 1.4 && (n = 0.7), o = (1 + i + Xr) / n, h = (1 + i) / n, s = Kr("sqrtMain", o, f, i, r), s.style.minWidth = "0.853em", p = 0.833 / n) : a.type === "large" ? (f = (1e3 + Yr) * wt[a.size], h = (wt[a.size] + i) / n, o = (wt[a.size] + i + Xr) / n, s = Kr("sqrtSize" + a.size, o, f, i, r), s.style.minWidth = "1.02em", p = 1 / n) : (o = e + i + Xr, h = e + i, f = Math.floor(1e3 * e + i) + Yr, s = Kr("sqrtTall", o, f, i, r), s.style.minWidth = "0.742em", p = 1.056), s.height = h, s.style.height = O(o), {
    span: s,
    advanceWidth: p,
    // Calculate the actual line width.
    // This actually should depend on the chosen font -- e.g. \boldmath
    // should use the thicker surd symbols from e.g. KaTeX_Main-Bold, and
    // have thicker rules.
    ruleWidth: (r.fontMetrics().sqrtRuleThickness + i) * n
  };
}, y1 = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "⌊", "⌋", "\\lceil", "\\rceil", "⌈", "⌉", "\\surd"], Ec = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "⟮", "⟯", "\\lmoustache", "\\rmoustache", "⎰", "⎱"], k1 = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"], wt = [0, 1.2, 1.8, 2.4, 3], Dc = function(e, r, u, a, n) {
  if (e === "<" || e === "\\lt" || e === "⟨" ? e = "\\langle" : (e === ">" || e === "\\gt" || e === "⟩") && (e = "\\rangle"), y1.includes(e) || k1.includes(e))
    return v1(e, r, !1, u, a, n);
  if (Ec.includes(e))
    return x1(e, wt[r], !1, u, a, n);
  throw new R("Illegal delimiter: '" + e + "'");
}, Tc = [{
  type: "small",
  style: j.SCRIPTSCRIPT
}, {
  type: "small",
  style: j.SCRIPT
}, {
  type: "small",
  style: j.TEXT
}, {
  type: "large",
  size: 1
}, {
  type: "large",
  size: 2
}, {
  type: "large",
  size: 3
}, {
  type: "large",
  size: 4
}], Mc = [{
  type: "small",
  style: j.SCRIPTSCRIPT
}, {
  type: "small",
  style: j.SCRIPT
}, {
  type: "small",
  style: j.TEXT
}, {
  type: "stack"
}], w1 = [{
  type: "small",
  style: j.SCRIPTSCRIPT
}, {
  type: "small",
  style: j.SCRIPT
}, {
  type: "small",
  style: j.TEXT
}, {
  type: "large",
  size: 1
}, {
  type: "large",
  size: 2
}, {
  type: "large",
  size: 3
}, {
  type: "large",
  size: 4
}, {
  type: "stack"
}], Fc = function(e) {
  if (e.type === "small")
    return "Main-Regular";
  if (e.type === "large")
    return "Size" + e.size + "-Regular";
  if (e.type === "stack")
    return "Size4-Regular";
  throw new Error("Add support for delim type '" + e.type + "' here.");
}, A1 = function(e, r, u, a) {
  for (var n = Math.min(2, 3 - a.style.size), i = n; i < u.length && u[i].type !== "stack"; i++) {
    var s = kt(e, Fc(u[i]), "math"), o = s.height + s.depth;
    if (u[i].type === "small") {
      var h = a.havingBaseStyle(u[i].style);
      o *= h.sizeMultiplier;
    }
    if (o > r)
      return u[i];
  }
  return u[u.length - 1];
}, S1 = function(e, r, u, a, n, i) {
  e === "<" || e === "\\lt" || e === "⟨" ? e = "\\langle" : (e === ">" || e === "\\gt" || e === "⟩") && (e = "\\rangle");
  var s;
  k1.includes(e) ? s = Tc : y1.includes(e) ? s = w1 : s = Mc;
  var o = A1(e, r, s, a);
  return o.type === "small" ? wc(e, o.style, u, a, n, i) : o.type === "large" ? v1(e, o.size, u, a, n, i) : x1(e, r, u, a, n, i);
}, zc = function(e, r, u, a, n, i) {
  var s = a.fontMetrics().axisHeight * a.sizeMultiplier, o = 901, h = 5 / a.fontMetrics().ptPerEm, f = Math.max(r - s, u + s), p = Math.max(
    // In real TeX, calculations are done using integral values which are
    // 65536 per pt, or 655360 per em. So, the division here truncates in
    // TeX but doesn't here, producing different results. If we wanted to
    // exactly match TeX's calculation, we could do
    //   Math.floor(655360 * maxDistFromAxis / 500) *
    //    delimiterFactor / 655360
    // (To see the difference, compare
    //    x^{x^{\left(\rule{0.1em}{0.68em}\right)}}
    // in TeX and KaTeX)
    f / 500 * o,
    2 * f - h
  );
  return S1(e, p, !0, a, n, i);
}, Te = {
  sqrtImage: Cc,
  sizedDelim: Dc,
  sizeToMaxHeight: wt,
  customSizedDelim: S1,
  leftRightDelim: zc
}, Za = {
  "\\bigl": {
    mclass: "mopen",
    size: 1
  },
  "\\Bigl": {
    mclass: "mopen",
    size: 2
  },
  "\\biggl": {
    mclass: "mopen",
    size: 3
  },
  "\\Biggl": {
    mclass: "mopen",
    size: 4
  },
  "\\bigr": {
    mclass: "mclose",
    size: 1
  },
  "\\Bigr": {
    mclass: "mclose",
    size: 2
  },
  "\\biggr": {
    mclass: "mclose",
    size: 3
  },
  "\\Biggr": {
    mclass: "mclose",
    size: 4
  },
  "\\bigm": {
    mclass: "mrel",
    size: 1
  },
  "\\Bigm": {
    mclass: "mrel",
    size: 2
  },
  "\\biggm": {
    mclass: "mrel",
    size: 3
  },
  "\\Biggm": {
    mclass: "mrel",
    size: 4
  },
  "\\big": {
    mclass: "mord",
    size: 1
  },
  "\\Big": {
    mclass: "mord",
    size: 2
  },
  "\\bigg": {
    mclass: "mord",
    size: 3
  },
  "\\Bigg": {
    mclass: "mord",
    size: 4
  }
}, Bc = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "⌊", "⌋", "\\lceil", "\\rceil", "⌈", "⌉", "<", ">", "\\langle", "⟨", "\\rangle", "⟩", "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "⟮", "⟯", "\\lmoustache", "\\rmoustache", "⎰", "⎱", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."];
function vr(t, e) {
  var r = br(t);
  if (r && Bc.includes(r.text))
    return r;
  throw r ? new R("Invalid delimiter '" + r.text + "' after '" + e.funcName + "'", t) : new R("Invalid delimiter type '" + t.type + "'", t);
}
q({
  type: "delimsizing",
  names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"],
  props: {
    numArgs: 1,
    argTypes: ["primitive"]
  },
  handler: (t, e) => {
    var r = vr(e[0], t);
    return {
      type: "delimsizing",
      mode: t.parser.mode,
      size: Za[t.funcName].size,
      mclass: Za[t.funcName].mclass,
      delim: r.text
    };
  },
  htmlBuilder: (t, e) => t.delim === "." ? T.makeSpan([t.mclass]) : Te.sizedDelim(t.delim, t.size, e, t.mode, [t.mclass]),
  mathmlBuilder: (t) => {
    var e = [];
    t.delim !== "." && e.push(J0(t.delim, t.mode));
    var r = new I.MathNode("mo", e);
    t.mclass === "mopen" || t.mclass === "mclose" ? r.setAttribute("fence", "true") : r.setAttribute("fence", "false"), r.setAttribute("stretchy", "true");
    var u = O(Te.sizeToMaxHeight[t.size]);
    return r.setAttribute("minsize", u), r.setAttribute("maxsize", u), r;
  }
});
function Ya(t) {
  if (!t.body)
    throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
}
q({
  type: "leftright-right",
  names: ["\\right"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (t, e) => {
    var r = t.parser.gullet.macros.get("\\current@color");
    if (r && typeof r != "string")
      throw new R("\\current@color set to non-string in \\right");
    return {
      type: "leftright-right",
      mode: t.parser.mode,
      delim: vr(e[0], t).text,
      color: r
      // undefined if not set via \color
    };
  }
});
q({
  type: "leftright",
  names: ["\\left"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (t, e) => {
    var r = vr(e[0], t), u = t.parser;
    ++u.leftrightDepth;
    var a = u.parseExpression(!1);
    --u.leftrightDepth, u.expect("\\right", !1);
    var n = Z(u.parseFunction(), "leftright-right");
    return {
      type: "leftright",
      mode: u.mode,
      body: a,
      left: r.text,
      right: n.delim,
      rightColor: n.color
    };
  },
  htmlBuilder: (t, e) => {
    Ya(t);
    for (var r = y0(t.body, e, !0, ["mopen", "mclose"]), u = 0, a = 0, n = !1, i = 0; i < r.length; i++)
      r[i].isMiddle ? n = !0 : (u = Math.max(r[i].height, u), a = Math.max(r[i].depth, a));
    u *= e.sizeMultiplier, a *= e.sizeMultiplier;
    var s;
    if (t.left === "." ? s = Dt(e, ["mopen"]) : s = Te.leftRightDelim(t.left, u, a, e, t.mode, ["mopen"]), r.unshift(s), n)
      for (var o = 1; o < r.length; o++) {
        var h = r[o], f = h.isMiddle;
        f && (r[o] = Te.leftRightDelim(f.delim, u, a, f.options, t.mode, []));
      }
    var p;
    if (t.right === ".")
      p = Dt(e, ["mclose"]);
    else {
      var k = t.rightColor ? e.withColor(t.rightColor) : e;
      p = Te.leftRightDelim(t.right, u, a, k, t.mode, ["mclose"]);
    }
    return r.push(p), T.makeSpan(["minner"], r, e);
  },
  mathmlBuilder: (t, e) => {
    Ya(t);
    var r = $0(t.body, e);
    if (t.left !== ".") {
      var u = new I.MathNode("mo", [J0(t.left, t.mode)]);
      u.setAttribute("fence", "true"), r.unshift(u);
    }
    if (t.right !== ".") {
      var a = new I.MathNode("mo", [J0(t.right, t.mode)]);
      a.setAttribute("fence", "true"), t.rightColor && a.setAttribute("mathcolor", t.rightColor), r.push(a);
    }
    return zu(r);
  }
});
q({
  type: "middle",
  names: ["\\middle"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (t, e) => {
    var r = vr(e[0], t);
    if (!t.parser.leftrightDepth)
      throw new R("\\middle without preceding \\left", r);
    return {
      type: "middle",
      mode: t.parser.mode,
      delim: r.text
    };
  },
  htmlBuilder: (t, e) => {
    var r;
    if (t.delim === ".")
      r = Dt(e, []);
    else {
      r = Te.sizedDelim(t.delim, 1, e, t.mode, []);
      var u = {
        delim: t.delim,
        options: e
      };
      r.isMiddle = u;
    }
    return r;
  },
  mathmlBuilder: (t, e) => {
    var r = t.delim === "\\vert" || t.delim === "|" ? J0("|", "text") : J0(t.delim, t.mode), u = new I.MathNode("mo", [r]);
    return u.setAttribute("fence", "true"), u.setAttribute("lspace", "0.05em"), u.setAttribute("rspace", "0.05em"), u;
  }
});
var Lu = (t, e) => {
  var r = T.wrapFragment(Q(t.body, e), e), u = t.label.slice(1), a = e.sizeMultiplier, n, i = 0, s = t0.isCharacterBox(t.body);
  if (u === "sout")
    n = T.makeSpan(["stretchy", "sout"]), n.height = e.fontMetrics().defaultRuleThickness / a, i = -0.5 * e.fontMetrics().xHeight;
  else if (u === "phase") {
    var o = f0({
      number: 0.6,
      unit: "pt"
    }, e), h = f0({
      number: 0.35,
      unit: "ex"
    }, e), f = e.havingBaseSizing();
    a = a / f.sizeMultiplier;
    var p = r.height + r.depth + o + h;
    r.style.paddingLeft = O(p / 2 + o);
    var k = Math.floor(1e3 * p * a), x = _o(k), y = new $e([new Ye("phase", x)], {
      width: "400em",
      height: O(k / 1e3),
      viewBox: "0 0 400000 " + k,
      preserveAspectRatio: "xMinYMin slice"
    });
    n = T.makeSvgSpan(["hide-tail"], [y], e), n.style.height = O(p), i = r.depth + o + h;
  } else {
    /cancel/.test(u) ? s || r.classes.push("cancel-pad") : u === "angl" ? r.classes.push("anglpad") : r.classes.push("boxpad");
    var _ = 0, E = 0, F = 0;
    /box/.test(u) ? (F = Math.max(
      e.fontMetrics().fboxrule,
      // default
      e.minRuleThickness
      // User override.
    ), _ = e.fontMetrics().fboxsep + (u === "colorbox" ? 0 : F), E = _) : u === "angl" ? (F = Math.max(e.fontMetrics().defaultRuleThickness, e.minRuleThickness), _ = 4 * F, E = Math.max(0, 0.25 - r.depth)) : (_ = s ? 0.2 : 0, E = _), n = Fe.encloseSpan(r, u, _, E, e), /fbox|boxed|fcolorbox/.test(u) ? (n.style.borderStyle = "solid", n.style.borderWidth = O(F)) : u === "angl" && F !== 0.049 && (n.style.borderTopWidth = O(F), n.style.borderRightWidth = O(F)), i = r.depth + E, t.backgroundColor && (n.style.backgroundColor = t.backgroundColor, t.borderColor && (n.style.borderColor = t.borderColor));
  }
  var v;
  if (t.backgroundColor)
    v = T.makeVList({
      positionType: "individualShift",
      children: [
        // Put the color background behind inner;
        {
          type: "elem",
          elem: n,
          shift: i
        },
        {
          type: "elem",
          elem: r,
          shift: 0
        }
      ]
    }, e);
  else {
    var w = /cancel|phase/.test(u) ? ["svg-align"] : [];
    v = T.makeVList({
      positionType: "individualShift",
      children: [
        // Write the \cancel stroke on top of inner.
        {
          type: "elem",
          elem: r,
          shift: 0
        },
        {
          type: "elem",
          elem: n,
          shift: i,
          wrapperClasses: w
        }
      ]
    }, e);
  }
  return /cancel/.test(u) && (v.height = r.height, v.depth = r.depth), /cancel/.test(u) && !s ? T.makeSpan(["mord", "cancel-lap"], [v], e) : T.makeSpan(["mord"], [v], e);
}, Ou = (t, e) => {
  var r = 0, u = new I.MathNode(t.label.indexOf("colorbox") > -1 ? "mpadded" : "menclose", [a0(t.body, e)]);
  switch (t.label) {
    case "\\cancel":
      u.setAttribute("notation", "updiagonalstrike");
      break;
    case "\\bcancel":
      u.setAttribute("notation", "downdiagonalstrike");
      break;
    case "\\phase":
      u.setAttribute("notation", "phasorangle");
      break;
    case "\\sout":
      u.setAttribute("notation", "horizontalstrike");
      break;
    case "\\fbox":
      u.setAttribute("notation", "box");
      break;
    case "\\angl":
      u.setAttribute("notation", "actuarial");
      break;
    case "\\fcolorbox":
    case "\\colorbox":
      if (r = e.fontMetrics().fboxsep * e.fontMetrics().ptPerEm, u.setAttribute("width", "+" + 2 * r + "pt"), u.setAttribute("height", "+" + 2 * r + "pt"), u.setAttribute("lspace", r + "pt"), u.setAttribute("voffset", r + "pt"), t.label === "\\fcolorbox") {
        var a = Math.max(
          e.fontMetrics().fboxrule,
          // default
          e.minRuleThickness
          // user override
        );
        u.setAttribute("style", "border: " + a + "em solid " + String(t.borderColor));
      }
      break;
    case "\\xcancel":
      u.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
      break;
  }
  return t.backgroundColor && u.setAttribute("mathbackground", t.backgroundColor), u;
};
q({
  type: "enclose",
  names: ["\\colorbox"],
  props: {
    numArgs: 2,
    allowedInText: !0,
    argTypes: ["color", "text"]
  },
  handler(t, e, r) {
    var {
      parser: u,
      funcName: a
    } = t, n = Z(e[0], "color-token").color, i = e[1];
    return {
      type: "enclose",
      mode: u.mode,
      label: a,
      backgroundColor: n,
      body: i
    };
  },
  htmlBuilder: Lu,
  mathmlBuilder: Ou
});
q({
  type: "enclose",
  names: ["\\fcolorbox"],
  props: {
    numArgs: 3,
    allowedInText: !0,
    argTypes: ["color", "color", "text"]
  },
  handler(t, e, r) {
    var {
      parser: u,
      funcName: a
    } = t, n = Z(e[0], "color-token").color, i = Z(e[1], "color-token").color, s = e[2];
    return {
      type: "enclose",
      mode: u.mode,
      label: a,
      backgroundColor: i,
      borderColor: n,
      body: s
    };
  },
  htmlBuilder: Lu,
  mathmlBuilder: Ou
});
q({
  type: "enclose",
  names: ["\\fbox"],
  props: {
    numArgs: 1,
    argTypes: ["hbox"],
    allowedInText: !0
  },
  handler(t, e) {
    var {
      parser: r
    } = t;
    return {
      type: "enclose",
      mode: r.mode,
      label: "\\fbox",
      body: e[0]
    };
  }
});
q({
  type: "enclose",
  names: ["\\cancel", "\\bcancel", "\\xcancel", "\\sout", "\\phase"],
  props: {
    numArgs: 1
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0];
    return {
      type: "enclose",
      mode: r.mode,
      label: u,
      body: a
    };
  },
  htmlBuilder: Lu,
  mathmlBuilder: Ou
});
q({
  type: "enclose",
  names: ["\\angl"],
  props: {
    numArgs: 1,
    argTypes: ["hbox"],
    allowedInText: !1
  },
  handler(t, e) {
    var {
      parser: r
    } = t;
    return {
      type: "enclose",
      mode: r.mode,
      label: "\\angl",
      body: e[0]
    };
  }
});
var _1 = {};
function ge(t) {
  for (var {
    type: e,
    names: r,
    props: u,
    handler: a,
    htmlBuilder: n,
    mathmlBuilder: i
  } = t, s = {
    type: e,
    numArgs: u.numArgs || 0,
    allowedInText: !1,
    numOptionalArgs: 0,
    handler: a
  }, o = 0; o < r.length; ++o)
    _1[r[o]] = s;
  n && (ir[e] = n), i && (sr[e] = i);
}
var C1 = {};
function m(t, e) {
  C1[t] = e;
}
function Xa(t) {
  var e = [];
  t.consumeSpaces();
  var r = t.fetch().text;
  for (r === "\\relax" && (t.consume(), t.consumeSpaces(), r = t.fetch().text); r === "\\hline" || r === "\\hdashline"; )
    t.consume(), e.push(r === "\\hdashline"), t.consumeSpaces(), r = t.fetch().text;
  return e;
}
var xr = (t) => {
  var e = t.parser.settings;
  if (!e.displayMode)
    throw new R("{" + t.envName + "} can be used only in display mode.");
};
function qu(t) {
  if (t.indexOf("ed") === -1)
    return t.indexOf("*") === -1;
}
function Ge(t, e, r) {
  var {
    hskipBeforeAndAfter: u,
    addJot: a,
    cols: n,
    arraystretch: i,
    colSeparationType: s,
    autoTag: o,
    singleRow: h,
    emptySingleRow: f,
    maxNumCols: p,
    leqno: k
  } = e;
  if (t.gullet.beginGroup(), h || t.gullet.macros.set("\\cr", "\\\\\\relax"), !i) {
    var x = t.gullet.expandMacroAsText("\\arraystretch");
    if (x == null)
      i = 1;
    else if (i = parseFloat(x), !i || i < 0)
      throw new R("Invalid \\arraystretch: " + x);
  }
  t.gullet.beginGroup();
  var y = [], _ = [y], E = [], F = [], v = o != null ? [] : void 0;
  function w() {
    o && t.gullet.macros.set("\\@eqnsw", "1", !0);
  }
  function C() {
    v && (t.gullet.macros.get("\\df@tag") ? (v.push(t.subparse([new V0("\\df@tag")])), t.gullet.macros.set("\\df@tag", void 0, !0)) : v.push(!!o && t.gullet.macros.get("\\@eqnsw") === "1"));
  }
  for (w(), F.push(Xa(t)); ; ) {
    var D = t.parseExpression(!1, h ? "\\end" : "\\\\");
    t.gullet.endGroup(), t.gullet.beginGroup(), D = {
      type: "ordgroup",
      mode: t.mode,
      body: D
    }, r && (D = {
      type: "styling",
      mode: t.mode,
      style: r,
      body: [D]
    }), y.push(D);
    var M = t.fetch().text;
    if (M === "&") {
      if (p && y.length === p) {
        if (h || s)
          throw new R("Too many tab characters: &", t.nextToken);
        t.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.");
      }
      t.consume();
    } else if (M === "\\end") {
      C(), y.length === 1 && D.type === "styling" && D.body[0].body.length === 0 && (_.length > 1 || !f) && _.pop(), F.length < _.length + 1 && F.push([]);
      break;
    } else if (M === "\\\\") {
      t.consume();
      var z = void 0;
      t.gullet.future().text !== " " && (z = t.parseSizeGroup(!0)), E.push(z ? z.value : null), C(), F.push(Xa(t)), y = [], _.push(y), w();
    } else
      throw new R("Expected & or \\\\ or \\cr or \\end", t.nextToken);
  }
  return t.gullet.endGroup(), t.gullet.endGroup(), {
    type: "array",
    mode: t.mode,
    addJot: a,
    arraystretch: i,
    body: _,
    cols: n,
    rowGaps: E,
    hskipBeforeAndAfter: u,
    hLinesBeforeRow: F,
    colSeparationType: s,
    tags: v,
    leqno: k
  };
}
function Pu(t) {
  return t.slice(0, 1) === "d" ? "display" : "text";
}
var ve = function(e, r) {
  var u, a, n = e.body.length, i = e.hLinesBeforeRow, s = 0, o = new Array(n), h = [], f = Math.max(
    // From LaTeX \showthe\arrayrulewidth. Equals 0.04 em.
    r.fontMetrics().arrayRuleWidth,
    r.minRuleThickness
    // User override.
  ), p = 1 / r.fontMetrics().ptPerEm, k = 5 * p;
  if (e.colSeparationType && e.colSeparationType === "small") {
    var x = r.havingStyle(j.SCRIPT).sizeMultiplier;
    k = 0.2778 * (x / r.sizeMultiplier);
  }
  var y = e.colSeparationType === "CD" ? f0({
    number: 3,
    unit: "ex"
  }, r) : 12 * p, _ = 3 * p, E = e.arraystretch * y, F = 0.7 * E, v = 0.3 * E, w = 0;
  function C(te) {
    for (var ke = 0; ke < te.length; ++ke)
      ke > 0 && (w += 0.25), h.push({
        pos: w,
        isDashed: te[ke]
      });
  }
  for (C(i[0]), u = 0; u < e.body.length; ++u) {
    var D = e.body[u], M = F, z = v;
    s < D.length && (s = D.length);
    var P = new Array(D.length);
    for (a = 0; a < D.length; ++a) {
      var N = Q(D[a], r);
      z < N.depth && (z = N.depth), M < N.height && (M = N.height), P[a] = N;
    }
    var Y = e.rowGaps[u], G = 0;
    Y && (G = f0(Y, r), G > 0 && (G += v, z < G && (z = G), G = 0)), e.addJot && (z += _), P.height = M, P.depth = z, w += M, P.pos = w, w += z + G, o[u] = P, C(i[u + 1]);
  }
  var K = w / 2 + r.fontMetrics().axisHeight, C0 = e.cols || [], o0 = [], m0, L0, ee = [];
  if (e.tags && e.tags.some((te) => te))
    for (u = 0; u < n; ++u) {
      var n0 = o[u], E0 = n0.pos - K, k0 = e.tags[u], e0 = void 0;
      k0 === !0 ? e0 = T.makeSpan(["eqn-num"], [], r) : k0 === !1 ? e0 = T.makeSpan([], [], r) : e0 = T.makeSpan([], y0(k0, r, !0), r), e0.depth = n0.depth, e0.height = n0.height, ee.push({
        type: "elem",
        elem: e0,
        shift: E0
      });
    }
  for (
    a = 0, L0 = 0;
    // Continue while either there are more columns or more column
    // descriptions, so trailing separators don't get lost.
    a < s || L0 < C0.length;
    ++a, ++L0
  ) {
    for (var u0 = C0[L0] || {}, s0 = !0; u0.type === "separator"; ) {
      if (s0 || (m0 = T.makeSpan(["arraycolsep"], []), m0.style.width = O(r.fontMetrics().doubleRuleSep), o0.push(m0)), u0.separator === "|" || u0.separator === ":") {
        var T0 = u0.separator === "|" ? "solid" : "dashed", J = T.makeSpan(["vertical-separator"], [], r);
        J.style.height = O(w), J.style.borderRightWidth = O(f), J.style.borderRightStyle = T0, J.style.margin = "0 " + O(-f / 2);
        var U0 = w - K;
        U0 && (J.style.verticalAlign = O(-U0)), o0.push(J);
      } else
        throw new R("Invalid separator type: " + u0.separator);
      L0++, u0 = C0[L0] || {}, s0 = !1;
    }
    if (!(a >= s)) {
      var M0 = void 0;
      (a > 0 || e.hskipBeforeAndAfter) && (M0 = t0.deflt(u0.pregap, k), M0 !== 0 && (m0 = T.makeSpan(["arraycolsep"], []), m0.style.width = O(M0), o0.push(m0)));
      var S0 = [];
      for (u = 0; u < n; ++u) {
        var ie = o[u], Y0 = ie[a];
        if (Y0) {
          var ye = ie.pos - K;
          Y0.depth = ie.depth, Y0.height = ie.height, S0.push({
            type: "elem",
            elem: Y0,
            shift: ye
          });
        }
      }
      S0 = T.makeVList({
        positionType: "individualShift",
        children: S0
      }, r), S0 = T.makeSpan(["col-align-" + (u0.align || "c")], [S0]), o0.push(S0), (a < s - 1 || e.hskipBeforeAndAfter) && (M0 = t0.deflt(u0.postgap, k), M0 !== 0 && (m0 = T.makeSpan(["arraycolsep"], []), m0.style.width = O(M0), o0.push(m0)));
    }
  }
  if (o = T.makeSpan(["mtable"], o0), h.length > 0) {
    for (var Je = T.makeLineSpan("hline", r, f), X0 = T.makeLineSpan("hdashline", r, f), Be = [{
      type: "elem",
      elem: o,
      shift: 0
    }]; h.length > 0; ) {
      var se = h.pop(), Qe = se.pos - K;
      se.isDashed ? Be.push({
        type: "elem",
        elem: X0,
        shift: Qe
      }) : Be.push({
        type: "elem",
        elem: Je,
        shift: Qe
      });
    }
    o = T.makeVList({
      positionType: "individualShift",
      children: Be
    }, r);
  }
  if (ee.length === 0)
    return T.makeSpan(["mord"], [o], r);
  var Ve = T.makeVList({
    positionType: "individualShift",
    children: ee
  }, r);
  return Ve = T.makeSpan(["tag"], [Ve], r), T.makeFragment([o, Ve]);
}, Ic = {
  c: "center ",
  l: "left ",
  r: "right "
}, xe = function(e, r) {
  for (var u = [], a = new I.MathNode("mtd", [], ["mtr-glue"]), n = new I.MathNode("mtd", [], ["mml-eqn-num"]), i = 0; i < e.body.length; i++) {
    for (var s = e.body[i], o = [], h = 0; h < s.length; h++)
      o.push(new I.MathNode("mtd", [a0(s[h], r)]));
    e.tags && e.tags[i] && (o.unshift(a), o.push(a), e.leqno ? o.unshift(n) : o.push(n)), u.push(new I.MathNode("mtr", o));
  }
  var f = new I.MathNode("mtable", u), p = e.arraystretch === 0.5 ? 0.1 : 0.16 + e.arraystretch - 1 + (e.addJot ? 0.09 : 0);
  f.setAttribute("rowspacing", O(p));
  var k = "", x = "";
  if (e.cols && e.cols.length > 0) {
    var y = e.cols, _ = "", E = !1, F = 0, v = y.length;
    y[0].type === "separator" && (k += "top ", F = 1), y[y.length - 1].type === "separator" && (k += "bottom ", v -= 1);
    for (var w = F; w < v; w++)
      y[w].type === "align" ? (x += Ic[y[w].align], E && (_ += "none "), E = !0) : y[w].type === "separator" && E && (_ += y[w].separator === "|" ? "solid " : "dashed ", E = !1);
    f.setAttribute("columnalign", x.trim()), /[sd]/.test(_) && f.setAttribute("columnlines", _.trim());
  }
  if (e.colSeparationType === "align") {
    for (var C = e.cols || [], D = "", M = 1; M < C.length; M++)
      D += M % 2 ? "0em " : "1em ";
    f.setAttribute("columnspacing", D.trim());
  } else e.colSeparationType === "alignat" || e.colSeparationType === "gather" ? f.setAttribute("columnspacing", "0em") : e.colSeparationType === "small" ? f.setAttribute("columnspacing", "0.2778em") : e.colSeparationType === "CD" ? f.setAttribute("columnspacing", "0.5em") : f.setAttribute("columnspacing", "1em");
  var z = "", P = e.hLinesBeforeRow;
  k += P[0].length > 0 ? "left " : "", k += P[P.length - 1].length > 0 ? "right " : "";
  for (var N = 1; N < P.length - 1; N++)
    z += P[N].length === 0 ? "none " : P[N][0] ? "dashed " : "solid ";
  return /[sd]/.test(z) && f.setAttribute("rowlines", z.trim()), k !== "" && (f = new I.MathNode("menclose", [f]), f.setAttribute("notation", k.trim())), e.arraystretch && e.arraystretch < 1 && (f = new I.MathNode("mstyle", [f]), f.setAttribute("scriptlevel", "1")), f;
}, E1 = function(e, r) {
  e.envName.indexOf("ed") === -1 && xr(e);
  var u = [], a = e.envName.indexOf("at") > -1 ? "alignat" : "align", n = e.envName === "split", i = Ge(e.parser, {
    cols: u,
    addJot: !0,
    autoTag: n ? void 0 : qu(e.envName),
    emptySingleRow: !0,
    colSeparationType: a,
    maxNumCols: n ? 2 : void 0,
    leqno: e.parser.settings.leqno
  }, "display"), s, o = 0, h = {
    type: "ordgroup",
    mode: e.mode,
    body: []
  };
  if (r[0] && r[0].type === "ordgroup") {
    for (var f = "", p = 0; p < r[0].body.length; p++) {
      var k = Z(r[0].body[p], "textord");
      f += k.text;
    }
    s = Number(f), o = s * 2;
  }
  var x = !o;
  i.body.forEach(function(F) {
    for (var v = 1; v < F.length; v += 2) {
      var w = Z(F[v], "styling"), C = Z(w.body[0], "ordgroup");
      C.body.unshift(h);
    }
    if (x)
      o < F.length && (o = F.length);
    else {
      var D = F.length / 2;
      if (s < D)
        throw new R("Too many math in a row: " + ("expected " + s + ", but got " + D), F[0]);
    }
  });
  for (var y = 0; y < o; ++y) {
    var _ = "r", E = 0;
    y % 2 === 1 ? _ = "l" : y > 0 && x && (E = 1), u[y] = {
      type: "align",
      align: _,
      pregap: E,
      postgap: 0
    };
  }
  return i.colSeparationType = x ? "align" : "alignat", i;
};
ge({
  type: "array",
  names: ["array", "darray"],
  props: {
    numArgs: 1
  },
  handler(t, e) {
    var r = br(e[0]), u = r ? [e[0]] : Z(e[0], "ordgroup").body, a = u.map(function(i) {
      var s = Iu(i), o = s.text;
      if ("lcr".indexOf(o) !== -1)
        return {
          type: "align",
          align: o
        };
      if (o === "|")
        return {
          type: "separator",
          separator: "|"
        };
      if (o === ":")
        return {
          type: "separator",
          separator: ":"
        };
      throw new R("Unknown column alignment: " + o, i);
    }), n = {
      cols: a,
      hskipBeforeAndAfter: !0,
      // \@preamble in lttab.dtx
      maxNumCols: a.length
    };
    return Ge(t.parser, n, Pu(t.envName));
  },
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix", "matrix*", "pmatrix*", "bmatrix*", "Bmatrix*", "vmatrix*", "Vmatrix*"],
  props: {
    numArgs: 0
  },
  handler(t) {
    var e = {
      matrix: null,
      pmatrix: ["(", ")"],
      bmatrix: ["[", "]"],
      Bmatrix: ["\\{", "\\}"],
      vmatrix: ["|", "|"],
      Vmatrix: ["\\Vert", "\\Vert"]
    }[t.envName.replace("*", "")], r = "c", u = {
      hskipBeforeAndAfter: !1,
      cols: [{
        type: "align",
        align: r
      }]
    };
    if (t.envName.charAt(t.envName.length - 1) === "*") {
      var a = t.parser;
      if (a.consumeSpaces(), a.fetch().text === "[") {
        if (a.consume(), a.consumeSpaces(), r = a.fetch().text, "lcr".indexOf(r) === -1)
          throw new R("Expected l or c or r", a.nextToken);
        a.consume(), a.consumeSpaces(), a.expect("]"), a.consume(), u.cols = [{
          type: "align",
          align: r
        }];
      }
    }
    var n = Ge(t.parser, u, Pu(t.envName)), i = Math.max(0, ...n.body.map((s) => s.length));
    return n.cols = new Array(i).fill({
      type: "align",
      align: r
    }), e ? {
      type: "leftright",
      mode: t.mode,
      body: [n],
      left: e[0],
      right: e[1],
      rightColor: void 0
      // \right uninfluenced by \color in array
    } : n;
  },
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["smallmatrix"],
  props: {
    numArgs: 0
  },
  handler(t) {
    var e = {
      arraystretch: 0.5
    }, r = Ge(t.parser, e, "script");
    return r.colSeparationType = "small", r;
  },
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["subarray"],
  props: {
    numArgs: 1
  },
  handler(t, e) {
    var r = br(e[0]), u = r ? [e[0]] : Z(e[0], "ordgroup").body, a = u.map(function(i) {
      var s = Iu(i), o = s.text;
      if ("lc".indexOf(o) !== -1)
        return {
          type: "align",
          align: o
        };
      throw new R("Unknown column alignment: " + o, i);
    });
    if (a.length > 1)
      throw new R("{subarray} can contain only one column");
    var n = {
      cols: a,
      hskipBeforeAndAfter: !1,
      arraystretch: 0.5
    };
    if (n = Ge(t.parser, n, "script"), n.body.length > 0 && n.body[0].length > 1)
      throw new R("{subarray} can contain only one column");
    return n;
  },
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["cases", "dcases", "rcases", "drcases"],
  props: {
    numArgs: 0
  },
  handler(t) {
    var e = {
      arraystretch: 1.2,
      cols: [{
        type: "align",
        align: "l",
        pregap: 0,
        // TODO(kevinb) get the current style.
        // For now we use the metrics for TEXT style which is what we were
        // doing before.  Before attempting to get the current style we
        // should look at TeX's behavior especially for \over and matrices.
        postgap: 1
        /* 1em quad */
      }, {
        type: "align",
        align: "l",
        pregap: 0,
        postgap: 0
      }]
    }, r = Ge(t.parser, e, Pu(t.envName));
    return {
      type: "leftright",
      mode: t.mode,
      body: [r],
      left: t.envName.indexOf("r") > -1 ? "." : "\\{",
      right: t.envName.indexOf("r") > -1 ? "\\}" : ".",
      rightColor: void 0
    };
  },
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["align", "align*", "aligned", "split"],
  props: {
    numArgs: 0
  },
  handler: E1,
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["gathered", "gather", "gather*"],
  props: {
    numArgs: 0
  },
  handler(t) {
    ["gather", "gather*"].includes(t.envName) && xr(t);
    var e = {
      cols: [{
        type: "align",
        align: "c"
      }],
      addJot: !0,
      colSeparationType: "gather",
      autoTag: qu(t.envName),
      emptySingleRow: !0,
      leqno: t.parser.settings.leqno
    };
    return Ge(t.parser, e, "display");
  },
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["alignat", "alignat*", "alignedat"],
  props: {
    numArgs: 1
  },
  handler: E1,
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["equation", "equation*"],
  props: {
    numArgs: 0
  },
  handler(t) {
    xr(t);
    var e = {
      autoTag: qu(t.envName),
      emptySingleRow: !0,
      singleRow: !0,
      maxNumCols: 1,
      leqno: t.parser.settings.leqno
    };
    return Ge(t.parser, e, "display");
  },
  htmlBuilder: ve,
  mathmlBuilder: xe
});
ge({
  type: "array",
  names: ["CD"],
  props: {
    numArgs: 0
  },
  handler(t) {
    return xr(t), yc(t.parser);
  },
  htmlBuilder: ve,
  mathmlBuilder: xe
});
m("\\nonumber", "\\gdef\\@eqnsw{0}");
m("\\notag", "\\nonumber");
q({
  type: "text",
  // Doesn't matter what this is.
  names: ["\\hline", "\\hdashline"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !0
  },
  handler(t, e) {
    throw new R(t.funcName + " valid only within array environment");
  }
});
var Ka = _1;
q({
  type: "environment",
  names: ["\\begin", "\\end"],
  props: {
    numArgs: 1,
    argTypes: ["text"]
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0];
    if (a.type !== "ordgroup")
      throw new R("Invalid environment name", a);
    for (var n = "", i = 0; i < a.body.length; ++i)
      n += Z(a.body[i], "textord").text;
    if (u === "\\begin") {
      if (!Ka.hasOwnProperty(n))
        throw new R("No such environment: " + n, a);
      var s = Ka[n], {
        args: o,
        optArgs: h
      } = r.parseArguments("\\begin{" + n + "}", s), f = {
        mode: r.mode,
        envName: n,
        parser: r
      }, p = s.handler(f, o, h);
      r.expect("\\end", !1);
      var k = r.nextToken, x = Z(r.parseFunction(), "environment");
      if (x.name !== n)
        throw new R("Mismatch: \\begin{" + n + "} matched by \\end{" + x.name + "}", k);
      return p;
    }
    return {
      type: "environment",
      mode: r.mode,
      name: n,
      nameGroup: a
    };
  }
});
var D1 = (t, e) => {
  var r = t.font, u = e.withFont(r);
  return Q(t.body, u);
}, T1 = (t, e) => {
  var r = t.font, u = e.withFont(r);
  return a0(t.body, u);
}, Ja = {
  "\\Bbb": "\\mathbb",
  "\\bold": "\\mathbf",
  "\\frak": "\\mathfrak",
  "\\bm": "\\boldsymbol"
};
q({
  type: "font",
  names: [
    // styles, except \boldsymbol defined below
    "\\mathrm",
    "\\mathit",
    "\\mathbf",
    "\\mathnormal",
    "\\mathsfit",
    // families
    "\\mathbb",
    "\\mathcal",
    "\\mathfrak",
    "\\mathscr",
    "\\mathsf",
    "\\mathtt",
    // aliases, except \bm defined below
    "\\Bbb",
    "\\bold",
    "\\frak"
  ],
  props: {
    numArgs: 1,
    allowedInArgument: !0
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u
    } = t, a = lr(e[0]), n = u;
    return n in Ja && (n = Ja[n]), {
      type: "font",
      mode: r.mode,
      font: n.slice(1),
      body: a
    };
  },
  htmlBuilder: D1,
  mathmlBuilder: T1
});
q({
  type: "mclass",
  names: ["\\boldsymbol", "\\bm"],
  props: {
    numArgs: 1
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t, u = e[0], a = t0.isCharacterBox(u);
    return {
      type: "mclass",
      mode: r.mode,
      mclass: gr(u),
      body: [{
        type: "font",
        mode: r.mode,
        font: "boldsymbol",
        body: u
      }],
      isCharacterBox: a
    };
  }
});
q({
  type: "font",
  names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u,
      breakOnTokenText: a
    } = t, {
      mode: n
    } = r, i = r.parseExpression(!0, a), s = "math" + u.slice(1);
    return {
      type: "font",
      mode: n,
      font: s,
      body: {
        type: "ordgroup",
        mode: r.mode,
        body: i
      }
    };
  },
  htmlBuilder: D1,
  mathmlBuilder: T1
});
var M1 = (t, e) => {
  var r = e;
  return t === "display" ? r = r.id >= j.SCRIPT.id ? r.text() : j.DISPLAY : t === "text" && r.size === j.DISPLAY.size ? r = j.TEXT : t === "script" ? r = j.SCRIPT : t === "scriptscript" && (r = j.SCRIPTSCRIPT), r;
}, Hu = (t, e) => {
  var r = M1(t.size, e.style), u = r.fracNum(), a = r.fracDen(), n;
  n = e.havingStyle(u);
  var i = Q(t.numer, n, e);
  if (t.continued) {
    var s = 8.5 / e.fontMetrics().ptPerEm, o = 3.5 / e.fontMetrics().ptPerEm;
    i.height = i.height < s ? s : i.height, i.depth = i.depth < o ? o : i.depth;
  }
  n = e.havingStyle(a);
  var h = Q(t.denom, n, e), f, p, k;
  t.hasBarLine ? (t.barSize ? (p = f0(t.barSize, e), f = T.makeLineSpan("frac-line", e, p)) : f = T.makeLineSpan("frac-line", e), p = f.height, k = f.height) : (f = null, p = 0, k = e.fontMetrics().defaultRuleThickness);
  var x, y, _;
  r.size === j.DISPLAY.size || t.size === "display" ? (x = e.fontMetrics().num1, p > 0 ? y = 3 * k : y = 7 * k, _ = e.fontMetrics().denom1) : (p > 0 ? (x = e.fontMetrics().num2, y = k) : (x = e.fontMetrics().num3, y = 3 * k), _ = e.fontMetrics().denom2);
  var E;
  if (f) {
    var v = e.fontMetrics().axisHeight;
    x - i.depth - (v + 0.5 * p) < y && (x += y - (x - i.depth - (v + 0.5 * p))), v - 0.5 * p - (h.height - _) < y && (_ += y - (v - 0.5 * p - (h.height - _)));
    var w = -(v - 0.5 * p);
    E = T.makeVList({
      positionType: "individualShift",
      children: [{
        type: "elem",
        elem: h,
        shift: _
      }, {
        type: "elem",
        elem: f,
        shift: w
      }, {
        type: "elem",
        elem: i,
        shift: -x
      }]
    }, e);
  } else {
    var F = x - i.depth - (h.height - _);
    F < y && (x += 0.5 * (y - F), _ += 0.5 * (y - F)), E = T.makeVList({
      positionType: "individualShift",
      children: [{
        type: "elem",
        elem: h,
        shift: _
      }, {
        type: "elem",
        elem: i,
        shift: -x
      }]
    }, e);
  }
  n = e.havingStyle(r), E.height *= n.sizeMultiplier / e.sizeMultiplier, E.depth *= n.sizeMultiplier / e.sizeMultiplier;
  var C;
  r.size === j.DISPLAY.size ? C = e.fontMetrics().delim1 : r.size === j.SCRIPTSCRIPT.size ? C = e.havingStyle(j.SCRIPT).fontMetrics().delim2 : C = e.fontMetrics().delim2;
  var D, M;
  return t.leftDelim == null ? D = Dt(e, ["mopen"]) : D = Te.customSizedDelim(t.leftDelim, C, !0, e.havingStyle(r), t.mode, ["mopen"]), t.continued ? M = T.makeSpan([]) : t.rightDelim == null ? M = Dt(e, ["mclose"]) : M = Te.customSizedDelim(t.rightDelim, C, !0, e.havingStyle(r), t.mode, ["mclose"]), T.makeSpan(["mord"].concat(n.sizingClasses(e)), [D, T.makeSpan(["mfrac"], [E]), M], e);
}, $u = (t, e) => {
  var r = new I.MathNode("mfrac", [a0(t.numer, e), a0(t.denom, e)]);
  if (!t.hasBarLine)
    r.setAttribute("linethickness", "0px");
  else if (t.barSize) {
    var u = f0(t.barSize, e);
    r.setAttribute("linethickness", O(u));
  }
  var a = M1(t.size, e.style);
  if (a.size !== e.style.size) {
    r = new I.MathNode("mstyle", [r]);
    var n = a.size === j.DISPLAY.size ? "true" : "false";
    r.setAttribute("displaystyle", n), r.setAttribute("scriptlevel", "0");
  }
  if (t.leftDelim != null || t.rightDelim != null) {
    var i = [];
    if (t.leftDelim != null) {
      var s = new I.MathNode("mo", [new I.TextNode(t.leftDelim.replace("\\", ""))]);
      s.setAttribute("fence", "true"), i.push(s);
    }
    if (i.push(r), t.rightDelim != null) {
      var o = new I.MathNode("mo", [new I.TextNode(t.rightDelim.replace("\\", ""))]);
      o.setAttribute("fence", "true"), i.push(o);
    }
    return zu(i);
  }
  return r;
};
q({
  type: "genfrac",
  names: [
    "\\dfrac",
    "\\frac",
    "\\tfrac",
    "\\dbinom",
    "\\binom",
    "\\tbinom",
    "\\\\atopfrac",
    // can’t be entered directly
    "\\\\bracefrac",
    "\\\\brackfrac"
    // ditto
  ],
  props: {
    numArgs: 2,
    allowedInArgument: !0
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0], n = e[1], i, s = null, o = null, h = "auto";
    switch (u) {
      case "\\dfrac":
      case "\\frac":
      case "\\tfrac":
        i = !0;
        break;
      case "\\\\atopfrac":
        i = !1;
        break;
      case "\\dbinom":
      case "\\binom":
      case "\\tbinom":
        i = !1, s = "(", o = ")";
        break;
      case "\\\\bracefrac":
        i = !1, s = "\\{", o = "\\}";
        break;
      case "\\\\brackfrac":
        i = !1, s = "[", o = "]";
        break;
      default:
        throw new Error("Unrecognized genfrac command");
    }
    switch (u) {
      case "\\dfrac":
      case "\\dbinom":
        h = "display";
        break;
      case "\\tfrac":
      case "\\tbinom":
        h = "text";
        break;
    }
    return {
      type: "genfrac",
      mode: r.mode,
      continued: !1,
      numer: a,
      denom: n,
      hasBarLine: i,
      leftDelim: s,
      rightDelim: o,
      size: h,
      barSize: null
    };
  },
  htmlBuilder: Hu,
  mathmlBuilder: $u
});
q({
  type: "genfrac",
  names: ["\\cfrac"],
  props: {
    numArgs: 2
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0], n = e[1];
    return {
      type: "genfrac",
      mode: r.mode,
      continued: !0,
      numer: a,
      denom: n,
      hasBarLine: !0,
      leftDelim: null,
      rightDelim: null,
      size: "display",
      barSize: null
    };
  }
});
q({
  type: "infix",
  names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
  props: {
    numArgs: 0,
    infix: !0
  },
  handler(t) {
    var {
      parser: e,
      funcName: r,
      token: u
    } = t, a;
    switch (r) {
      case "\\over":
        a = "\\frac";
        break;
      case "\\choose":
        a = "\\binom";
        break;
      case "\\atop":
        a = "\\\\atopfrac";
        break;
      case "\\brace":
        a = "\\\\bracefrac";
        break;
      case "\\brack":
        a = "\\\\brackfrac";
        break;
      default:
        throw new Error("Unrecognized infix genfrac command");
    }
    return {
      type: "infix",
      mode: e.mode,
      replaceWith: a,
      token: u
    };
  }
});
var Qa = ["display", "text", "script", "scriptscript"], en = function(e) {
  var r = null;
  return e.length > 0 && (r = e, r = r === "." ? null : r), r;
};
q({
  type: "genfrac",
  names: ["\\genfrac"],
  props: {
    numArgs: 6,
    allowedInArgument: !0,
    argTypes: ["math", "math", "size", "text", "math", "math"]
  },
  handler(t, e) {
    var {
      parser: r
    } = t, u = e[4], a = e[5], n = lr(e[0]), i = n.type === "atom" && n.family === "open" ? en(n.text) : null, s = lr(e[1]), o = s.type === "atom" && s.family === "close" ? en(s.text) : null, h = Z(e[2], "size"), f, p = null;
    h.isBlank ? f = !0 : (p = h.value, f = p.number > 0);
    var k = "auto", x = e[3];
    if (x.type === "ordgroup") {
      if (x.body.length > 0) {
        var y = Z(x.body[0], "textord");
        k = Qa[Number(y.text)];
      }
    } else
      x = Z(x, "textord"), k = Qa[Number(x.text)];
    return {
      type: "genfrac",
      mode: r.mode,
      numer: u,
      denom: a,
      continued: !1,
      hasBarLine: f,
      barSize: p,
      leftDelim: i,
      rightDelim: o,
      size: k
    };
  },
  htmlBuilder: Hu,
  mathmlBuilder: $u
});
q({
  type: "infix",
  names: ["\\above"],
  props: {
    numArgs: 1,
    argTypes: ["size"],
    infix: !0
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u,
      token: a
    } = t;
    return {
      type: "infix",
      mode: r.mode,
      replaceWith: "\\\\abovefrac",
      size: Z(e[0], "size").value,
      token: a
    };
  }
});
q({
  type: "genfrac",
  names: ["\\\\abovefrac"],
  props: {
    numArgs: 3,
    argTypes: ["math", "size", "math"]
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0], n = lo(Z(e[1], "infix").size), i = e[2], s = n.number > 0;
    return {
      type: "genfrac",
      mode: r.mode,
      numer: a,
      denom: i,
      continued: !1,
      hasBarLine: s,
      barSize: n,
      leftDelim: null,
      rightDelim: null,
      size: "auto"
    };
  },
  htmlBuilder: Hu,
  mathmlBuilder: $u
});
var F1 = (t, e) => {
  var r = e.style, u, a;
  t.type === "supsub" ? (u = t.sup ? Q(t.sup, e.havingStyle(r.sup()), e) : Q(t.sub, e.havingStyle(r.sub()), e), a = Z(t.base, "horizBrace")) : a = Z(t, "horizBrace");
  var n = Q(a.base, e.havingBaseStyle(j.DISPLAY)), i = Fe.svgSpan(a, e), s;
  if (a.isOver ? (s = T.makeVList({
    positionType: "firstBaseline",
    children: [{
      type: "elem",
      elem: n
    }, {
      type: "kern",
      size: 0.1
    }, {
      type: "elem",
      elem: i
    }]
  }, e), s.children[0].children[0].children[1].classes.push("svg-align")) : (s = T.makeVList({
    positionType: "bottom",
    positionData: n.depth + 0.1 + i.height,
    children: [{
      type: "elem",
      elem: i
    }, {
      type: "kern",
      size: 0.1
    }, {
      type: "elem",
      elem: n
    }]
  }, e), s.children[0].children[0].children[0].classes.push("svg-align")), u) {
    var o = T.makeSpan(["mord", a.isOver ? "mover" : "munder"], [s], e);
    a.isOver ? s = T.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: o
      }, {
        type: "kern",
        size: 0.2
      }, {
        type: "elem",
        elem: u
      }]
    }, e) : s = T.makeVList({
      positionType: "bottom",
      positionData: o.depth + 0.2 + u.height + u.depth,
      children: [{
        type: "elem",
        elem: u
      }, {
        type: "kern",
        size: 0.2
      }, {
        type: "elem",
        elem: o
      }]
    }, e);
  }
  return T.makeSpan(["mord", a.isOver ? "mover" : "munder"], [s], e);
}, Rc = (t, e) => {
  var r = Fe.mathMLnode(t.label);
  return new I.MathNode(t.isOver ? "mover" : "munder", [a0(t.base, e), r]);
};
q({
  type: "horizBrace",
  names: ["\\overbrace", "\\underbrace"],
  props: {
    numArgs: 1
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u
    } = t;
    return {
      type: "horizBrace",
      mode: r.mode,
      label: u,
      isOver: /^\\over/.test(u),
      base: e[0]
    };
  },
  htmlBuilder: F1,
  mathmlBuilder: Rc
});
q({
  type: "href",
  names: ["\\href"],
  props: {
    numArgs: 2,
    argTypes: ["url", "original"],
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t, u = e[1], a = Z(e[0], "url").url;
    return r.settings.isTrusted({
      command: "\\href",
      url: a
    }) ? {
      type: "href",
      mode: r.mode,
      href: a,
      body: b0(u)
    } : r.formatUnsupportedCmd("\\href");
  },
  htmlBuilder: (t, e) => {
    var r = y0(t.body, e, !1);
    return T.makeAnchor(t.href, [], r, e);
  },
  mathmlBuilder: (t, e) => {
    var r = Ue(t.body, e);
    return r instanceof G0 || (r = new G0("mrow", [r])), r.setAttribute("href", t.href), r;
  }
});
q({
  type: "href",
  names: ["\\url"],
  props: {
    numArgs: 1,
    argTypes: ["url"],
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t, u = Z(e[0], "url").url;
    if (!r.settings.isTrusted({
      command: "\\url",
      url: u
    }))
      return r.formatUnsupportedCmd("\\url");
    for (var a = [], n = 0; n < u.length; n++) {
      var i = u[n];
      i === "~" && (i = "\\textasciitilde"), a.push({
        type: "textord",
        mode: "text",
        text: i
      });
    }
    var s = {
      type: "text",
      mode: r.mode,
      font: "\\texttt",
      body: a
    };
    return {
      type: "href",
      mode: r.mode,
      href: u,
      body: b0(s)
    };
  }
});
q({
  type: "hbox",
  names: ["\\hbox"],
  props: {
    numArgs: 1,
    argTypes: ["text"],
    allowedInText: !0,
    primitive: !0
  },
  handler(t, e) {
    var {
      parser: r
    } = t;
    return {
      type: "hbox",
      mode: r.mode,
      body: b0(e[0])
    };
  },
  htmlBuilder(t, e) {
    var r = y0(t.body, e, !1);
    return T.makeFragment(r);
  },
  mathmlBuilder(t, e) {
    return new I.MathNode("mrow", $0(t.body, e));
  }
});
q({
  type: "html",
  names: ["\\htmlClass", "\\htmlId", "\\htmlStyle", "\\htmlData"],
  props: {
    numArgs: 2,
    argTypes: ["raw", "original"],
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u,
      token: a
    } = t, n = Z(e[0], "raw").string, i = e[1];
    r.settings.strict && r.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
    var s, o = {};
    switch (u) {
      case "\\htmlClass":
        o.class = n, s = {
          command: "\\htmlClass",
          class: n
        };
        break;
      case "\\htmlId":
        o.id = n, s = {
          command: "\\htmlId",
          id: n
        };
        break;
      case "\\htmlStyle":
        o.style = n, s = {
          command: "\\htmlStyle",
          style: n
        };
        break;
      case "\\htmlData": {
        for (var h = n.split(","), f = 0; f < h.length; f++) {
          var p = h[f].split("=");
          if (p.length !== 2)
            throw new R("Error parsing key-value for \\htmlData");
          o["data-" + p[0].trim()] = p[1].trim();
        }
        s = {
          command: "\\htmlData",
          attributes: o
        };
        break;
      }
      default:
        throw new Error("Unrecognized html command");
    }
    return r.settings.isTrusted(s) ? {
      type: "html",
      mode: r.mode,
      attributes: o,
      body: b0(i)
    } : r.formatUnsupportedCmd(u);
  },
  htmlBuilder: (t, e) => {
    var r = y0(t.body, e, !1), u = ["enclosing"];
    t.attributes.class && u.push(...t.attributes.class.trim().split(/\s+/));
    var a = T.makeSpan(u, r, e);
    for (var n in t.attributes)
      n !== "class" && t.attributes.hasOwnProperty(n) && a.setAttribute(n, t.attributes[n]);
    return a;
  },
  mathmlBuilder: (t, e) => Ue(t.body, e)
});
q({
  type: "htmlmathml",
  names: ["\\html@mathml"],
  props: {
    numArgs: 2,
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t;
    return {
      type: "htmlmathml",
      mode: r.mode,
      html: b0(e[0]),
      mathml: b0(e[1])
    };
  },
  htmlBuilder: (t, e) => {
    var r = y0(t.html, e, !1);
    return T.makeFragment(r);
  },
  mathmlBuilder: (t, e) => Ue(t.mathml, e)
});
var Jr = function(e) {
  if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e))
    return {
      number: +e,
      unit: "bp"
    };
  var r = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);
  if (!r)
    throw new R("Invalid size: '" + e + "' in \\includegraphics");
  var u = {
    number: +(r[1] + r[2]),
    // sign + magnitude, cast to number
    unit: r[3]
  };
  if (!Kn(u))
    throw new R("Invalid unit: '" + u.unit + "' in \\includegraphics.");
  return u;
};
q({
  type: "includegraphics",
  names: ["\\includegraphics"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1,
    argTypes: ["raw", "url"],
    allowedInText: !1
  },
  handler: (t, e, r) => {
    var {
      parser: u
    } = t, a = {
      number: 0,
      unit: "em"
    }, n = {
      number: 0.9,
      unit: "em"
    }, i = {
      number: 0,
      unit: "em"
    }, s = "";
    if (r[0])
      for (var o = Z(r[0], "raw").string, h = o.split(","), f = 0; f < h.length; f++) {
        var p = h[f].split("=");
        if (p.length === 2) {
          var k = p[1].trim();
          switch (p[0].trim()) {
            case "alt":
              s = k;
              break;
            case "width":
              a = Jr(k);
              break;
            case "height":
              n = Jr(k);
              break;
            case "totalheight":
              i = Jr(k);
              break;
            default:
              throw new R("Invalid key: '" + p[0] + "' in \\includegraphics.");
          }
        }
      }
    var x = Z(e[0], "url").url;
    return s === "" && (s = x, s = s.replace(/^.*[\\/]/, ""), s = s.substring(0, s.lastIndexOf("."))), u.settings.isTrusted({
      command: "\\includegraphics",
      url: x
    }) ? {
      type: "includegraphics",
      mode: u.mode,
      alt: s,
      width: a,
      height: n,
      totalheight: i,
      src: x
    } : u.formatUnsupportedCmd("\\includegraphics");
  },
  htmlBuilder: (t, e) => {
    var r = f0(t.height, e), u = 0;
    t.totalheight.number > 0 && (u = f0(t.totalheight, e) - r);
    var a = 0;
    t.width.number > 0 && (a = f0(t.width, e));
    var n = {
      height: O(r + u)
    };
    a > 0 && (n.width = O(a)), u > 0 && (n.verticalAlign = O(-u));
    var i = new Io(t.src, t.alt, n);
    return i.height = r, i.depth = u, i;
  },
  mathmlBuilder: (t, e) => {
    var r = new I.MathNode("mglyph", []);
    r.setAttribute("alt", t.alt);
    var u = f0(t.height, e), a = 0;
    if (t.totalheight.number > 0 && (a = f0(t.totalheight, e) - u, r.setAttribute("valign", O(-a))), r.setAttribute("height", O(u + a)), t.width.number > 0) {
      var n = f0(t.width, e);
      r.setAttribute("width", O(n));
    }
    return r.setAttribute("src", t.src), r;
  }
});
q({
  type: "kern",
  names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
  props: {
    numArgs: 1,
    argTypes: ["size"],
    primitive: !0,
    allowedInText: !0
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u
    } = t, a = Z(e[0], "size");
    if (r.settings.strict) {
      var n = u[1] === "m", i = a.value.unit === "mu";
      n ? (i || r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + u + " supports only mu units, " + ("not " + a.value.unit + " units")), r.mode !== "math" && r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + u + " works only in math mode")) : i && r.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + u + " doesn't support mu units");
    }
    return {
      type: "kern",
      mode: r.mode,
      dimension: a.value
    };
  },
  htmlBuilder(t, e) {
    return T.makeGlue(t.dimension, e);
  },
  mathmlBuilder(t, e) {
    var r = f0(t.dimension, e);
    return new I.SpaceNode(r);
  }
});
q({
  type: "lap",
  names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0];
    return {
      type: "lap",
      mode: r.mode,
      alignment: u.slice(5),
      body: a
    };
  },
  htmlBuilder: (t, e) => {
    var r;
    t.alignment === "clap" ? (r = T.makeSpan([], [Q(t.body, e)]), r = T.makeSpan(["inner"], [r], e)) : r = T.makeSpan(["inner"], [Q(t.body, e)]);
    var u = T.makeSpan(["fix"], []), a = T.makeSpan([t.alignment], [r, u], e), n = T.makeSpan(["strut"]);
    return n.style.height = O(a.height + a.depth), a.depth && (n.style.verticalAlign = O(-a.depth)), a.children.unshift(n), a = T.makeSpan(["thinbox"], [a], e), T.makeSpan(["mord", "vbox"], [a], e);
  },
  mathmlBuilder: (t, e) => {
    var r = new I.MathNode("mpadded", [a0(t.body, e)]);
    if (t.alignment !== "rlap") {
      var u = t.alignment === "llap" ? "-1" : "-0.5";
      r.setAttribute("lspace", u + "width");
    }
    return r.setAttribute("width", "0px"), r;
  }
});
q({
  type: "styling",
  names: ["\\(", "$"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !1
  },
  handler(t, e) {
    var {
      funcName: r,
      parser: u
    } = t, a = u.mode;
    u.switchMode("math");
    var n = r === "\\(" ? "\\)" : "$", i = u.parseExpression(!1, n);
    return u.expect(n), u.switchMode(a), {
      type: "styling",
      mode: u.mode,
      style: "text",
      body: i
    };
  }
});
q({
  type: "text",
  // Doesn't matter what this is.
  names: ["\\)", "\\]"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !1
  },
  handler(t, e) {
    throw new R("Mismatched " + t.funcName);
  }
});
var tn = (t, e) => {
  switch (e.style.size) {
    case j.DISPLAY.size:
      return t.display;
    case j.TEXT.size:
      return t.text;
    case j.SCRIPT.size:
      return t.script;
    case j.SCRIPTSCRIPT.size:
      return t.scriptscript;
    default:
      return t.text;
  }
};
q({
  type: "mathchoice",
  names: ["\\mathchoice"],
  props: {
    numArgs: 4,
    primitive: !0
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t;
    return {
      type: "mathchoice",
      mode: r.mode,
      display: b0(e[0]),
      text: b0(e[1]),
      script: b0(e[2]),
      scriptscript: b0(e[3])
    };
  },
  htmlBuilder: (t, e) => {
    var r = tn(t, e), u = y0(r, e, !1);
    return T.makeFragment(u);
  },
  mathmlBuilder: (t, e) => {
    var r = tn(t, e);
    return Ue(r, e);
  }
});
var z1 = (t, e, r, u, a, n, i) => {
  t = T.makeSpan([], [t]);
  var s = r && t0.isCharacterBox(r), o, h;
  if (e) {
    var f = Q(e, u.havingStyle(a.sup()), u);
    h = {
      elem: f,
      kern: Math.max(u.fontMetrics().bigOpSpacing1, u.fontMetrics().bigOpSpacing3 - f.depth)
    };
  }
  if (r) {
    var p = Q(r, u.havingStyle(a.sub()), u);
    o = {
      elem: p,
      kern: Math.max(u.fontMetrics().bigOpSpacing2, u.fontMetrics().bigOpSpacing4 - p.height)
    };
  }
  var k;
  if (h && o) {
    var x = u.fontMetrics().bigOpSpacing5 + o.elem.height + o.elem.depth + o.kern + t.depth + i;
    k = T.makeVList({
      positionType: "bottom",
      positionData: x,
      children: [{
        type: "kern",
        size: u.fontMetrics().bigOpSpacing5
      }, {
        type: "elem",
        elem: o.elem,
        marginLeft: O(-n)
      }, {
        type: "kern",
        size: o.kern
      }, {
        type: "elem",
        elem: t
      }, {
        type: "kern",
        size: h.kern
      }, {
        type: "elem",
        elem: h.elem,
        marginLeft: O(n)
      }, {
        type: "kern",
        size: u.fontMetrics().bigOpSpacing5
      }]
    }, u);
  } else if (o) {
    var y = t.height - i;
    k = T.makeVList({
      positionType: "top",
      positionData: y,
      children: [{
        type: "kern",
        size: u.fontMetrics().bigOpSpacing5
      }, {
        type: "elem",
        elem: o.elem,
        marginLeft: O(-n)
      }, {
        type: "kern",
        size: o.kern
      }, {
        type: "elem",
        elem: t
      }]
    }, u);
  } else if (h) {
    var _ = t.depth + i;
    k = T.makeVList({
      positionType: "bottom",
      positionData: _,
      children: [{
        type: "elem",
        elem: t
      }, {
        type: "kern",
        size: h.kern
      }, {
        type: "elem",
        elem: h.elem,
        marginLeft: O(n)
      }, {
        type: "kern",
        size: u.fontMetrics().bigOpSpacing5
      }]
    }, u);
  } else
    return t;
  var E = [k];
  if (o && n !== 0 && !s) {
    var F = T.makeSpan(["mspace"], [], u);
    F.style.marginRight = O(n), E.unshift(F);
  }
  return T.makeSpan(["mop", "op-limits"], E, u);
}, B1 = ["\\smallint"], ft = (t, e) => {
  var r, u, a = !1, n;
  t.type === "supsub" ? (r = t.sup, u = t.sub, n = Z(t.base, "op"), a = !0) : n = Z(t, "op");
  var i = e.style, s = !1;
  i.size === j.DISPLAY.size && n.symbol && !B1.includes(n.name) && (s = !0);
  var o;
  if (n.symbol) {
    var h = s ? "Size2-Regular" : "Size1-Regular", f = "";
    if ((n.name === "\\oiint" || n.name === "\\oiiint") && (f = n.name.slice(1), n.name = f === "oiint" ? "\\iint" : "\\iiint"), o = T.makeSymbol(n.name, h, "math", e, ["mop", "op-symbol", s ? "large-op" : "small-op"]), f.length > 0) {
      var p = o.italic, k = T.staticSvg(f + "Size" + (s ? "2" : "1"), e);
      o = T.makeVList({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: o,
          shift: 0
        }, {
          type: "elem",
          elem: k,
          shift: s ? 0.08 : 0
        }]
      }, e), n.name = "\\" + f, o.classes.unshift("mop"), o.italic = p;
    }
  } else if (n.body) {
    var x = y0(n.body, e, !0);
    x.length === 1 && x[0] instanceof ae ? (o = x[0], o.classes[0] = "mop") : o = T.makeSpan(["mop"], x, e);
  } else {
    for (var y = [], _ = 1; _ < n.name.length; _++)
      y.push(T.mathsym(n.name[_], n.mode, e));
    o = T.makeSpan(["mop"], y, e);
  }
  var E = 0, F = 0;
  return (o instanceof ae || n.name === "\\oiint" || n.name === "\\oiiint") && !n.suppressBaseShift && (E = (o.height - o.depth) / 2 - e.fontMetrics().axisHeight, F = o.italic), a ? z1(o, r, u, e, i, F, E) : (E && (o.style.position = "relative", o.style.top = O(E)), o);
}, Bt = (t, e) => {
  var r;
  if (t.symbol)
    r = new G0("mo", [J0(t.name, t.mode)]), B1.includes(t.name) && r.setAttribute("largeop", "false");
  else if (t.body)
    r = new G0("mo", $0(t.body, e));
  else {
    r = new G0("mi", [new me(t.name.slice(1))]);
    var u = new G0("mo", [J0("⁡", "text")]);
    t.parentIsSupSub ? r = new G0("mrow", [r, u]) : r = o1([r, u]);
  }
  return r;
}, Nc = {
  "∏": "\\prod",
  "∐": "\\coprod",
  "∑": "\\sum",
  "⋀": "\\bigwedge",
  "⋁": "\\bigvee",
  "⋂": "\\bigcap",
  "⋃": "\\bigcup",
  "⨀": "\\bigodot",
  "⨁": "\\bigoplus",
  "⨂": "\\bigotimes",
  "⨄": "\\biguplus",
  "⨆": "\\bigsqcup"
};
q({
  type: "op",
  names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", "∏", "∐", "∑", "⋀", "⋁", "⋂", "⋃", "⨀", "⨁", "⨂", "⨄", "⨆"],
  props: {
    numArgs: 0
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u
    } = t, a = u;
    return a.length === 1 && (a = Nc[a]), {
      type: "op",
      mode: r.mode,
      limits: !0,
      parentIsSupSub: !1,
      symbol: !0,
      name: a
    };
  },
  htmlBuilder: ft,
  mathmlBuilder: Bt
});
q({
  type: "op",
  names: ["\\mathop"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t, u = e[0];
    return {
      type: "op",
      mode: r.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !1,
      body: b0(u)
    };
  },
  htmlBuilder: ft,
  mathmlBuilder: Bt
});
var Lc = {
  "∫": "\\int",
  "∬": "\\iint",
  "∭": "\\iiint",
  "∮": "\\oint",
  "∯": "\\oiint",
  "∰": "\\oiiint"
};
q({
  type: "op",
  names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"],
  props: {
    numArgs: 0
  },
  handler(t) {
    var {
      parser: e,
      funcName: r
    } = t;
    return {
      type: "op",
      mode: e.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !1,
      name: r
    };
  },
  htmlBuilder: ft,
  mathmlBuilder: Bt
});
q({
  type: "op",
  names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"],
  props: {
    numArgs: 0
  },
  handler(t) {
    var {
      parser: e,
      funcName: r
    } = t;
    return {
      type: "op",
      mode: e.mode,
      limits: !0,
      parentIsSupSub: !1,
      symbol: !1,
      name: r
    };
  },
  htmlBuilder: ft,
  mathmlBuilder: Bt
});
q({
  type: "op",
  names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", "∫", "∬", "∭", "∮", "∯", "∰"],
  props: {
    numArgs: 0
  },
  handler(t) {
    var {
      parser: e,
      funcName: r
    } = t, u = r;
    return u.length === 1 && (u = Lc[u]), {
      type: "op",
      mode: e.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !0,
      name: u
    };
  },
  htmlBuilder: ft,
  mathmlBuilder: Bt
});
var I1 = (t, e) => {
  var r, u, a = !1, n;
  t.type === "supsub" ? (r = t.sup, u = t.sub, n = Z(t.base, "operatorname"), a = !0) : n = Z(t, "operatorname");
  var i;
  if (n.body.length > 0) {
    for (var s = n.body.map((p) => {
      var k = p.text;
      return typeof k == "string" ? {
        type: "textord",
        mode: p.mode,
        text: k
      } : p;
    }), o = y0(s, e.withFont("mathrm"), !0), h = 0; h < o.length; h++) {
      var f = o[h];
      f instanceof ae && (f.text = f.text.replace(/\u2212/, "-").replace(/\u2217/, "*"));
    }
    i = T.makeSpan(["mop"], o, e);
  } else
    i = T.makeSpan(["mop"], [], e);
  return a ? z1(i, r, u, e, e.style, 0, 0) : i;
}, Oc = (t, e) => {
  for (var r = $0(t.body, e.withFont("mathrm")), u = !0, a = 0; a < r.length; a++) {
    var n = r[a];
    if (!(n instanceof I.SpaceNode)) if (n instanceof I.MathNode)
      switch (n.type) {
        case "mi":
        case "mn":
        case "ms":
        case "mspace":
        case "mtext":
          break;
        // Do nothing yet.
        case "mo": {
          var i = n.children[0];
          n.children.length === 1 && i instanceof I.TextNode ? i.text = i.text.replace(/\u2212/, "-").replace(/\u2217/, "*") : u = !1;
          break;
        }
        default:
          u = !1;
      }
    else
      u = !1;
  }
  if (u) {
    var s = r.map((f) => f.toText()).join("");
    r = [new I.TextNode(s)];
  }
  var o = new I.MathNode("mi", r);
  o.setAttribute("mathvariant", "normal");
  var h = new I.MathNode("mo", [J0("⁡", "text")]);
  return t.parentIsSupSub ? new I.MathNode("mrow", [o, h]) : I.newDocumentFragment([o, h]);
};
q({
  type: "operatorname",
  names: ["\\operatorname@", "\\operatornamewithlimits"],
  props: {
    numArgs: 1
  },
  handler: (t, e) => {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0];
    return {
      type: "operatorname",
      mode: r.mode,
      body: b0(a),
      alwaysHandleSupSub: u === "\\operatornamewithlimits",
      limits: !1,
      parentIsSupSub: !1
    };
  },
  htmlBuilder: I1,
  mathmlBuilder: Oc
});
m("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@");
Xe({
  type: "ordgroup",
  htmlBuilder(t, e) {
    return t.semisimple ? T.makeFragment(y0(t.body, e, !1)) : T.makeSpan(["mord"], y0(t.body, e, !0), e);
  },
  mathmlBuilder(t, e) {
    return Ue(t.body, e, !0);
  }
});
q({
  type: "overline",
  names: ["\\overline"],
  props: {
    numArgs: 1
  },
  handler(t, e) {
    var {
      parser: r
    } = t, u = e[0];
    return {
      type: "overline",
      mode: r.mode,
      body: u
    };
  },
  htmlBuilder(t, e) {
    var r = Q(t.body, e.havingCrampedStyle()), u = T.makeLineSpan("overline-line", e), a = e.fontMetrics().defaultRuleThickness, n = T.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: r
      }, {
        type: "kern",
        size: 3 * a
      }, {
        type: "elem",
        elem: u
      }, {
        type: "kern",
        size: a
      }]
    }, e);
    return T.makeSpan(["mord", "overline"], [n], e);
  },
  mathmlBuilder(t, e) {
    var r = new I.MathNode("mo", [new I.TextNode("‾")]);
    r.setAttribute("stretchy", "true");
    var u = new I.MathNode("mover", [a0(t.body, e), r]);
    return u.setAttribute("accent", "true"), u;
  }
});
q({
  type: "phantom",
  names: ["\\phantom"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t, u = e[0];
    return {
      type: "phantom",
      mode: r.mode,
      body: b0(u)
    };
  },
  htmlBuilder: (t, e) => {
    var r = y0(t.body, e.withPhantom(), !1);
    return T.makeFragment(r);
  },
  mathmlBuilder: (t, e) => {
    var r = $0(t.body, e);
    return new I.MathNode("mphantom", r);
  }
});
q({
  type: "hphantom",
  names: ["\\hphantom"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t, u = e[0];
    return {
      type: "hphantom",
      mode: r.mode,
      body: u
    };
  },
  htmlBuilder: (t, e) => {
    var r = T.makeSpan([], [Q(t.body, e.withPhantom())]);
    if (r.height = 0, r.depth = 0, r.children)
      for (var u = 0; u < r.children.length; u++)
        r.children[u].height = 0, r.children[u].depth = 0;
    return r = T.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: r
      }]
    }, e), T.makeSpan(["mord"], [r], e);
  },
  mathmlBuilder: (t, e) => {
    var r = $0(b0(t.body), e), u = new I.MathNode("mphantom", r), a = new I.MathNode("mpadded", [u]);
    return a.setAttribute("height", "0px"), a.setAttribute("depth", "0px"), a;
  }
});
q({
  type: "vphantom",
  names: ["\\vphantom"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      parser: r
    } = t, u = e[0];
    return {
      type: "vphantom",
      mode: r.mode,
      body: u
    };
  },
  htmlBuilder: (t, e) => {
    var r = T.makeSpan(["inner"], [Q(t.body, e.withPhantom())]), u = T.makeSpan(["fix"], []);
    return T.makeSpan(["mord", "rlap"], [r, u], e);
  },
  mathmlBuilder: (t, e) => {
    var r = $0(b0(t.body), e), u = new I.MathNode("mphantom", r), a = new I.MathNode("mpadded", [u]);
    return a.setAttribute("width", "0px"), a;
  }
});
q({
  type: "raisebox",
  names: ["\\raisebox"],
  props: {
    numArgs: 2,
    argTypes: ["size", "hbox"],
    allowedInText: !0
  },
  handler(t, e) {
    var {
      parser: r
    } = t, u = Z(e[0], "size").value, a = e[1];
    return {
      type: "raisebox",
      mode: r.mode,
      dy: u,
      body: a
    };
  },
  htmlBuilder(t, e) {
    var r = Q(t.body, e), u = f0(t.dy, e);
    return T.makeVList({
      positionType: "shift",
      positionData: -u,
      children: [{
        type: "elem",
        elem: r
      }]
    }, e);
  },
  mathmlBuilder(t, e) {
    var r = new I.MathNode("mpadded", [a0(t.body, e)]), u = t.dy.number + t.dy.unit;
    return r.setAttribute("voffset", u), r;
  }
});
q({
  type: "internal",
  names: ["\\relax"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInArgument: !0
  },
  handler(t) {
    var {
      parser: e
    } = t;
    return {
      type: "internal",
      mode: e.mode
    };
  }
});
q({
  type: "rule",
  names: ["\\rule"],
  props: {
    numArgs: 2,
    numOptionalArgs: 1,
    allowedInText: !0,
    allowedInMath: !0,
    argTypes: ["size", "size", "size"]
  },
  handler(t, e, r) {
    var {
      parser: u
    } = t, a = r[0], n = Z(e[0], "size"), i = Z(e[1], "size");
    return {
      type: "rule",
      mode: u.mode,
      shift: a && Z(a, "size").value,
      width: n.value,
      height: i.value
    };
  },
  htmlBuilder(t, e) {
    var r = T.makeSpan(["mord", "rule"], [], e), u = f0(t.width, e), a = f0(t.height, e), n = t.shift ? f0(t.shift, e) : 0;
    return r.style.borderRightWidth = O(u), r.style.borderTopWidth = O(a), r.style.bottom = O(n), r.width = u, r.height = a + n, r.depth = -n, r.maxFontSize = a * 1.125 * e.sizeMultiplier, r;
  },
  mathmlBuilder(t, e) {
    var r = f0(t.width, e), u = f0(t.height, e), a = t.shift ? f0(t.shift, e) : 0, n = e.color && e.getColor() || "black", i = new I.MathNode("mspace");
    i.setAttribute("mathbackground", n), i.setAttribute("width", O(r)), i.setAttribute("height", O(u));
    var s = new I.MathNode("mpadded", [i]);
    return a >= 0 ? s.setAttribute("height", O(a)) : (s.setAttribute("height", O(a)), s.setAttribute("depth", O(-a))), s.setAttribute("voffset", O(a)), s;
  }
});
function R1(t, e, r) {
  for (var u = y0(t, e, !1), a = e.sizeMultiplier / r.sizeMultiplier, n = 0; n < u.length; n++) {
    var i = u[n].classes.indexOf("sizing");
    i < 0 ? Array.prototype.push.apply(u[n].classes, e.sizingClasses(r)) : u[n].classes[i + 1] === "reset-size" + e.size && (u[n].classes[i + 1] = "reset-size" + r.size), u[n].height *= a, u[n].depth *= a;
  }
  return T.makeFragment(u);
}
var rn = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"], qc = (t, e) => {
  var r = e.havingSize(t.size);
  return R1(t.body, r, e);
};
q({
  type: "sizing",
  names: rn,
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler: (t, e) => {
    var {
      breakOnTokenText: r,
      funcName: u,
      parser: a
    } = t, n = a.parseExpression(!1, r);
    return {
      type: "sizing",
      mode: a.mode,
      // Figure out what size to use based on the list of functions above
      size: rn.indexOf(u) + 1,
      body: n
    };
  },
  htmlBuilder: qc,
  mathmlBuilder: (t, e) => {
    var r = e.havingSize(t.size), u = $0(t.body, r), a = new I.MathNode("mstyle", u);
    return a.setAttribute("mathsize", O(r.sizeMultiplier)), a;
  }
});
q({
  type: "smash",
  names: ["\\smash"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1,
    allowedInText: !0
  },
  handler: (t, e, r) => {
    var {
      parser: u
    } = t, a = !1, n = !1, i = r[0] && Z(r[0], "ordgroup");
    if (i)
      for (var s = "", o = 0; o < i.body.length; ++o) {
        var h = i.body[o];
        if (s = h.text, s === "t")
          a = !0;
        else if (s === "b")
          n = !0;
        else {
          a = !1, n = !1;
          break;
        }
      }
    else
      a = !0, n = !0;
    var f = e[0];
    return {
      type: "smash",
      mode: u.mode,
      body: f,
      smashHeight: a,
      smashDepth: n
    };
  },
  htmlBuilder: (t, e) => {
    var r = T.makeSpan([], [Q(t.body, e)]);
    if (!t.smashHeight && !t.smashDepth)
      return r;
    if (t.smashHeight && (r.height = 0, r.children))
      for (var u = 0; u < r.children.length; u++)
        r.children[u].height = 0;
    if (t.smashDepth && (r.depth = 0, r.children))
      for (var a = 0; a < r.children.length; a++)
        r.children[a].depth = 0;
    var n = T.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: r
      }]
    }, e);
    return T.makeSpan(["mord"], [n], e);
  },
  mathmlBuilder: (t, e) => {
    var r = new I.MathNode("mpadded", [a0(t.body, e)]);
    return t.smashHeight && r.setAttribute("height", "0px"), t.smashDepth && r.setAttribute("depth", "0px"), r;
  }
});
q({
  type: "sqrt",
  names: ["\\sqrt"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1
  },
  handler(t, e, r) {
    var {
      parser: u
    } = t, a = r[0], n = e[0];
    return {
      type: "sqrt",
      mode: u.mode,
      body: n,
      index: a
    };
  },
  htmlBuilder(t, e) {
    var r = Q(t.body, e.havingCrampedStyle());
    r.height === 0 && (r.height = e.fontMetrics().xHeight), r = T.wrapFragment(r, e);
    var u = e.fontMetrics(), a = u.defaultRuleThickness, n = a;
    e.style.id < j.TEXT.id && (n = e.fontMetrics().xHeight);
    var i = a + n / 4, s = r.height + r.depth + i + a, {
      span: o,
      ruleWidth: h,
      advanceWidth: f
    } = Te.sqrtImage(s, e), p = o.height - h;
    p > r.height + r.depth + i && (i = (i + p - r.height - r.depth) / 2);
    var k = o.height - r.height - i - h;
    r.style.paddingLeft = O(f);
    var x = T.makeVList({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: r,
        wrapperClasses: ["svg-align"]
      }, {
        type: "kern",
        size: -(r.height + k)
      }, {
        type: "elem",
        elem: o
      }, {
        type: "kern",
        size: h
      }]
    }, e);
    if (t.index) {
      var y = e.havingStyle(j.SCRIPTSCRIPT), _ = Q(t.index, y, e), E = 0.6 * (x.height - x.depth), F = T.makeVList({
        positionType: "shift",
        positionData: -E,
        children: [{
          type: "elem",
          elem: _
        }]
      }, e), v = T.makeSpan(["root"], [F]);
      return T.makeSpan(["mord", "sqrt"], [v, x], e);
    } else
      return T.makeSpan(["mord", "sqrt"], [x], e);
  },
  mathmlBuilder(t, e) {
    var {
      body: r,
      index: u
    } = t;
    return u ? new I.MathNode("mroot", [a0(r, e), a0(u, e)]) : new I.MathNode("msqrt", [a0(r, e)]);
  }
});
var un = {
  display: j.DISPLAY,
  text: j.TEXT,
  script: j.SCRIPT,
  scriptscript: j.SCRIPTSCRIPT
};
q({
  type: "styling",
  names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(t, e) {
    var {
      breakOnTokenText: r,
      funcName: u,
      parser: a
    } = t, n = a.parseExpression(!0, r), i = u.slice(1, u.length - 5);
    return {
      type: "styling",
      mode: a.mode,
      // Figure out what style to use by pulling out the style from
      // the function name
      style: i,
      body: n
    };
  },
  htmlBuilder(t, e) {
    var r = un[t.style], u = e.havingStyle(r).withFont("");
    return R1(t.body, u, e);
  },
  mathmlBuilder(t, e) {
    var r = un[t.style], u = e.havingStyle(r), a = $0(t.body, u), n = new I.MathNode("mstyle", a), i = {
      display: ["0", "true"],
      text: ["0", "false"],
      script: ["1", "false"],
      scriptscript: ["2", "false"]
    }, s = i[t.style];
    return n.setAttribute("scriptlevel", s[0]), n.setAttribute("displaystyle", s[1]), n;
  }
});
var Pc = function(e, r) {
  var u = e.base;
  if (u)
    if (u.type === "op") {
      var a = u.limits && (r.style.size === j.DISPLAY.size || u.alwaysHandleSupSub);
      return a ? ft : null;
    } else if (u.type === "operatorname") {
      var n = u.alwaysHandleSupSub && (r.style.size === j.DISPLAY.size || u.limits);
      return n ? I1 : null;
    } else {
      if (u.type === "accent")
        return t0.isCharacterBox(u.base) ? Ru : null;
      if (u.type === "horizBrace") {
        var i = !e.sub;
        return i === u.isOver ? F1 : null;
      } else
        return null;
    }
  else return null;
};
Xe({
  type: "supsub",
  htmlBuilder(t, e) {
    var r = Pc(t, e);
    if (r)
      return r(t, e);
    var {
      base: u,
      sup: a,
      sub: n
    } = t, i = Q(u, e), s, o, h = e.fontMetrics(), f = 0, p = 0, k = u && t0.isCharacterBox(u);
    if (a) {
      var x = e.havingStyle(e.style.sup());
      s = Q(a, x, e), k || (f = i.height - x.fontMetrics().supDrop * x.sizeMultiplier / e.sizeMultiplier);
    }
    if (n) {
      var y = e.havingStyle(e.style.sub());
      o = Q(n, y, e), k || (p = i.depth + y.fontMetrics().subDrop * y.sizeMultiplier / e.sizeMultiplier);
    }
    var _;
    e.style === j.DISPLAY ? _ = h.sup1 : e.style.cramped ? _ = h.sup3 : _ = h.sup2;
    var E = e.sizeMultiplier, F = O(0.5 / h.ptPerEm / E), v = null;
    if (o) {
      var w = t.base && t.base.type === "op" && t.base.name && (t.base.name === "\\oiint" || t.base.name === "\\oiiint");
      (i instanceof ae || w) && (v = O(-i.italic));
    }
    var C;
    if (s && o) {
      f = Math.max(f, _, s.depth + 0.25 * h.xHeight), p = Math.max(p, h.sub2);
      var D = h.defaultRuleThickness, M = 4 * D;
      if (f - s.depth - (o.height - p) < M) {
        p = M - (f - s.depth) + o.height;
        var z = 0.8 * h.xHeight - (f - s.depth);
        z > 0 && (f += z, p -= z);
      }
      var P = [{
        type: "elem",
        elem: o,
        shift: p,
        marginRight: F,
        marginLeft: v
      }, {
        type: "elem",
        elem: s,
        shift: -f,
        marginRight: F
      }];
      C = T.makeVList({
        positionType: "individualShift",
        children: P
      }, e);
    } else if (o) {
      p = Math.max(p, h.sub1, o.height - 0.8 * h.xHeight);
      var N = [{
        type: "elem",
        elem: o,
        marginLeft: v,
        marginRight: F
      }];
      C = T.makeVList({
        positionType: "shift",
        positionData: p,
        children: N
      }, e);
    } else if (s)
      f = Math.max(f, _, s.depth + 0.25 * h.xHeight), C = T.makeVList({
        positionType: "shift",
        positionData: -f,
        children: [{
          type: "elem",
          elem: s,
          marginRight: F
        }]
      }, e);
    else
      throw new Error("supsub must have either sup or sub.");
    var Y = mu(i, "right") || "mord";
    return T.makeSpan([Y], [i, T.makeSpan(["msupsub"], [C])], e);
  },
  mathmlBuilder(t, e) {
    var r = !1, u, a;
    t.base && t.base.type === "horizBrace" && (a = !!t.sup, a === t.base.isOver && (r = !0, u = t.base.isOver)), t.base && (t.base.type === "op" || t.base.type === "operatorname") && (t.base.parentIsSupSub = !0);
    var n = [a0(t.base, e)];
    t.sub && n.push(a0(t.sub, e)), t.sup && n.push(a0(t.sup, e));
    var i;
    if (r)
      i = u ? "mover" : "munder";
    else if (t.sub)
      if (t.sup) {
        var h = t.base;
        h && h.type === "op" && h.limits && e.style === j.DISPLAY || h && h.type === "operatorname" && h.alwaysHandleSupSub && (e.style === j.DISPLAY || h.limits) ? i = "munderover" : i = "msubsup";
      } else {
        var o = t.base;
        o && o.type === "op" && o.limits && (e.style === j.DISPLAY || o.alwaysHandleSupSub) || o && o.type === "operatorname" && o.alwaysHandleSupSub && (o.limits || e.style === j.DISPLAY) ? i = "munder" : i = "msub";
      }
    else {
      var s = t.base;
      s && s.type === "op" && s.limits && (e.style === j.DISPLAY || s.alwaysHandleSupSub) || s && s.type === "operatorname" && s.alwaysHandleSupSub && (s.limits || e.style === j.DISPLAY) ? i = "mover" : i = "msup";
    }
    return new I.MathNode(i, n);
  }
});
Xe({
  type: "atom",
  htmlBuilder(t, e) {
    return T.mathsym(t.text, t.mode, e, ["m" + t.family]);
  },
  mathmlBuilder(t, e) {
    var r = new I.MathNode("mo", [J0(t.text, t.mode)]);
    if (t.family === "bin") {
      var u = Bu(t, e);
      u === "bold-italic" && r.setAttribute("mathvariant", u);
    } else t.family === "punct" ? r.setAttribute("separator", "true") : (t.family === "open" || t.family === "close") && r.setAttribute("stretchy", "false");
    return r;
  }
});
var N1 = {
  mi: "italic",
  mn: "normal",
  mtext: "normal"
};
Xe({
  type: "mathord",
  htmlBuilder(t, e) {
    return T.makeOrd(t, e, "mathord");
  },
  mathmlBuilder(t, e) {
    var r = new I.MathNode("mi", [J0(t.text, t.mode, e)]), u = Bu(t, e) || "italic";
    return u !== N1[r.type] && r.setAttribute("mathvariant", u), r;
  }
});
Xe({
  type: "textord",
  htmlBuilder(t, e) {
    return T.makeOrd(t, e, "textord");
  },
  mathmlBuilder(t, e) {
    var r = J0(t.text, t.mode, e), u = Bu(t, e) || "normal", a;
    return t.mode === "text" ? a = new I.MathNode("mtext", [r]) : /[0-9]/.test(t.text) ? a = new I.MathNode("mn", [r]) : t.text === "\\prime" ? a = new I.MathNode("mo", [r]) : a = new I.MathNode("mi", [r]), u !== N1[a.type] && a.setAttribute("mathvariant", u), a;
  }
});
var Qr = {
  "\\nobreak": "nobreak",
  "\\allowbreak": "allowbreak"
}, eu = {
  " ": {},
  "\\ ": {},
  "~": {
    className: "nobreak"
  },
  "\\space": {},
  "\\nobreakspace": {
    className: "nobreak"
  }
};
Xe({
  type: "spacing",
  htmlBuilder(t, e) {
    if (eu.hasOwnProperty(t.text)) {
      var r = eu[t.text].className || "";
      if (t.mode === "text") {
        var u = T.makeOrd(t, e, "textord");
        return u.classes.push(r), u;
      } else
        return T.makeSpan(["mspace", r], [T.mathsym(t.text, t.mode, e)], e);
    } else {
      if (Qr.hasOwnProperty(t.text))
        return T.makeSpan(["mspace", Qr[t.text]], [], e);
      throw new R('Unknown type of space "' + t.text + '"');
    }
  },
  mathmlBuilder(t, e) {
    var r;
    if (eu.hasOwnProperty(t.text))
      r = new I.MathNode("mtext", [new I.TextNode(" ")]);
    else {
      if (Qr.hasOwnProperty(t.text))
        return new I.MathNode("mspace");
      throw new R('Unknown type of space "' + t.text + '"');
    }
    return r;
  }
});
var an = () => {
  var t = new I.MathNode("mtd", []);
  return t.setAttribute("width", "50%"), t;
};
Xe({
  type: "tag",
  mathmlBuilder(t, e) {
    var r = new I.MathNode("mtable", [new I.MathNode("mtr", [an(), new I.MathNode("mtd", [Ue(t.body, e)]), an(), new I.MathNode("mtd", [Ue(t.tag, e)])])]);
    return r.setAttribute("width", "100%"), r;
  }
});
var nn = {
  "\\text": void 0,
  "\\textrm": "textrm",
  "\\textsf": "textsf",
  "\\texttt": "texttt",
  "\\textnormal": "textrm"
}, sn = {
  "\\textbf": "textbf",
  "\\textmd": "textmd"
}, Hc = {
  "\\textit": "textit",
  "\\textup": "textup"
}, ln = (t, e) => {
  var r = t.font;
  if (r) {
    if (nn[r])
      return e.withTextFontFamily(nn[r]);
    if (sn[r])
      return e.withTextFontWeight(sn[r]);
    if (r === "\\emph")
      return e.fontShape === "textit" ? e.withTextFontShape("textup") : e.withTextFontShape("textit");
  } else return e;
  return e.withTextFontShape(Hc[r]);
};
q({
  type: "text",
  names: [
    // Font families
    "\\text",
    "\\textrm",
    "\\textsf",
    "\\texttt",
    "\\textnormal",
    // Font weights
    "\\textbf",
    "\\textmd",
    // Font Shapes
    "\\textit",
    "\\textup",
    "\\emph"
  ],
  props: {
    numArgs: 1,
    argTypes: ["text"],
    allowedInArgument: !0,
    allowedInText: !0
  },
  handler(t, e) {
    var {
      parser: r,
      funcName: u
    } = t, a = e[0];
    return {
      type: "text",
      mode: r.mode,
      body: b0(a),
      font: u
    };
  },
  htmlBuilder(t, e) {
    var r = ln(t, e), u = y0(t.body, r, !0);
    return T.makeSpan(["mord", "text"], u, r);
  },
  mathmlBuilder(t, e) {
    var r = ln(t, e);
    return Ue(t.body, r);
  }
});
q({
  type: "underline",
  names: ["\\underline"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(t, e) {
    var {
      parser: r
    } = t;
    return {
      type: "underline",
      mode: r.mode,
      body: e[0]
    };
  },
  htmlBuilder(t, e) {
    var r = Q(t.body, e), u = T.makeLineSpan("underline-line", e), a = e.fontMetrics().defaultRuleThickness, n = T.makeVList({
      positionType: "top",
      positionData: r.height,
      children: [{
        type: "kern",
        size: a
      }, {
        type: "elem",
        elem: u
      }, {
        type: "kern",
        size: 3 * a
      }, {
        type: "elem",
        elem: r
      }]
    }, e);
    return T.makeSpan(["mord", "underline"], [n], e);
  },
  mathmlBuilder(t, e) {
    var r = new I.MathNode("mo", [new I.TextNode("‾")]);
    r.setAttribute("stretchy", "true");
    var u = new I.MathNode("munder", [a0(t.body, e), r]);
    return u.setAttribute("accentunder", "true"), u;
  }
});
q({
  type: "vcenter",
  names: ["\\vcenter"],
  props: {
    numArgs: 1,
    argTypes: ["original"],
    // In LaTeX, \vcenter can act only on a box.
    allowedInText: !1
  },
  handler(t, e) {
    var {
      parser: r
    } = t;
    return {
      type: "vcenter",
      mode: r.mode,
      body: e[0]
    };
  },
  htmlBuilder(t, e) {
    var r = Q(t.body, e), u = e.fontMetrics().axisHeight, a = 0.5 * (r.height - u - (r.depth + u));
    return T.makeVList({
      positionType: "shift",
      positionData: a,
      children: [{
        type: "elem",
        elem: r
      }]
    }, e);
  },
  mathmlBuilder(t, e) {
    return new I.MathNode("mpadded", [a0(t.body, e)], ["vcenter"]);
  }
});
q({
  type: "verb",
  names: ["\\verb"],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler(t, e, r) {
    throw new R("\\verb ended by end of line instead of matching delimiter");
  },
  htmlBuilder(t, e) {
    for (var r = on(t), u = [], a = e.havingStyle(e.style.text()), n = 0; n < r.length; n++) {
      var i = r[n];
      i === "~" && (i = "\\textasciitilde"), u.push(T.makeSymbol(i, "Typewriter-Regular", t.mode, a, ["mord", "texttt"]));
    }
    return T.makeSpan(["mord", "text"].concat(a.sizingClasses(e)), T.tryCombineChars(u), a);
  },
  mathmlBuilder(t, e) {
    var r = new I.TextNode(on(t)), u = new I.MathNode("mtext", [r]);
    return u.setAttribute("mathvariant", "monospace"), u;
  }
});
var on = (t) => t.body.replace(/ /g, t.star ? "␣" : " "), qe = s1, L1 = `[ \r
	]`, $c = "\\\\[a-zA-Z@]+", Uc = "\\\\[^\uD800-\uDFFF]", Gc = "(" + $c + ")" + L1 + "*", Vc = `\\\\(
|[ \r	]+
?)[ \r	]*`, gu = "[̀-ͯ]", jc = new RegExp(gu + "+$"), Wc = "(" + L1 + "+)|" + // whitespace
(Vc + "|") + // \whitespace
"([!-\\[\\]-‧‪-퟿豈-￿]" + // single codepoint
(gu + "*") + // ...plus accents
"|[\uD800-\uDBFF][\uDC00-\uDFFF]" + // surrogate pair
(gu + "*") + // ...plus accents
"|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" + // \verb unstarred
("|" + Gc) + // \macroName + spaces
("|" + Uc + ")");
class cn {
  // Category codes. The lexer only supports comment characters (14) for now.
  // MacroExpander additionally distinguishes active (13).
  constructor(e, r) {
    this.input = void 0, this.settings = void 0, this.tokenRegex = void 0, this.catcodes = void 0, this.input = e, this.settings = r, this.tokenRegex = new RegExp(Wc, "g"), this.catcodes = {
      "%": 14,
      // comment character
      "~": 13
      // active character
    };
  }
  setCatcode(e, r) {
    this.catcodes[e] = r;
  }
  /**
   * This function lexes a single token.
   */
  lex() {
    var e = this.input, r = this.tokenRegex.lastIndex;
    if (r === e.length)
      return new V0("EOF", new P0(this, r, r));
    var u = this.tokenRegex.exec(e);
    if (u === null || u.index !== r)
      throw new R("Unexpected character: '" + e[r] + "'", new V0(e[r], new P0(this, r, r + 1)));
    var a = u[6] || u[3] || (u[2] ? "\\ " : " ");
    if (this.catcodes[a] === 14) {
      var n = e.indexOf(`
`, this.tokenRegex.lastIndex);
      return n === -1 ? (this.tokenRegex.lastIndex = e.length, this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)")) : this.tokenRegex.lastIndex = n + 1, this.lex();
    }
    return new V0(a, new P0(this, r, this.tokenRegex.lastIndex));
  }
}
class Zc {
  /**
   * Both arguments are optional.  The first argument is an object of
   * built-in mappings which never change.  The second argument is an object
   * of initial (global-level) mappings, which will constantly change
   * according to any global/top-level `set`s done.
   */
  constructor(e, r) {
    e === void 0 && (e = {}), r === void 0 && (r = {}), this.current = void 0, this.builtins = void 0, this.undefStack = void 0, this.current = r, this.builtins = e, this.undefStack = [];
  }
  /**
   * Start a new nested group, affecting future local `set`s.
   */
  beginGroup() {
    this.undefStack.push({});
  }
  /**
   * End current nested group, restoring values before the group began.
   */
  endGroup() {
    if (this.undefStack.length === 0)
      throw new R("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
    var e = this.undefStack.pop();
    for (var r in e)
      e.hasOwnProperty(r) && (e[r] == null ? delete this.current[r] : this.current[r] = e[r]);
  }
  /**
   * Ends all currently nested groups (if any), restoring values before the
   * groups began.  Useful in case of an error in the middle of parsing.
   */
  endGroups() {
    for (; this.undefStack.length > 0; )
      this.endGroup();
  }
  /**
   * Detect whether `name` has a definition.  Equivalent to
   * `get(name) != null`.
   */
  has(e) {
    return this.current.hasOwnProperty(e) || this.builtins.hasOwnProperty(e);
  }
  /**
   * Get the current value of a name, or `undefined` if there is no value.
   *
   * Note: Do not use `if (namespace.get(...))` to detect whether a macro
   * is defined, as the definition may be the empty string which evaluates
   * to `false` in JavaScript.  Use `if (namespace.get(...) != null)` or
   * `if (namespace.has(...))`.
   */
  get(e) {
    return this.current.hasOwnProperty(e) ? this.current[e] : this.builtins[e];
  }
  /**
   * Set the current value of a name, and optionally set it globally too.
   * Local set() sets the current value and (when appropriate) adds an undo
   * operation to the undo stack.  Global set() may change the undo
   * operation at every level, so takes time linear in their number.
   * A value of undefined means to delete existing definitions.
   */
  set(e, r, u) {
    if (u === void 0 && (u = !1), u) {
      for (var a = 0; a < this.undefStack.length; a++)
        delete this.undefStack[a][e];
      this.undefStack.length > 0 && (this.undefStack[this.undefStack.length - 1][e] = r);
    } else {
      var n = this.undefStack[this.undefStack.length - 1];
      n && !n.hasOwnProperty(e) && (n[e] = this.current[e]);
    }
    r == null ? delete this.current[e] : this.current[e] = r;
  }
}
var Yc = C1;
m("\\noexpand", function(t) {
  var e = t.popToken();
  return t.isExpandable(e.text) && (e.noexpand = !0, e.treatAsRelax = !0), {
    tokens: [e],
    numArgs: 0
  };
});
m("\\expandafter", function(t) {
  var e = t.popToken();
  return t.expandOnce(!0), {
    tokens: [e],
    numArgs: 0
  };
});
m("\\@firstoftwo", function(t) {
  var e = t.consumeArgs(2);
  return {
    tokens: e[0],
    numArgs: 0
  };
});
m("\\@secondoftwo", function(t) {
  var e = t.consumeArgs(2);
  return {
    tokens: e[1],
    numArgs: 0
  };
});
m("\\@ifnextchar", function(t) {
  var e = t.consumeArgs(3);
  t.consumeSpaces();
  var r = t.future();
  return e[0].length === 1 && e[0][0].text === r.text ? {
    tokens: e[1],
    numArgs: 0
  } : {
    tokens: e[2],
    numArgs: 0
  };
});
m("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");
m("\\TextOrMath", function(t) {
  var e = t.consumeArgs(2);
  return t.mode === "text" ? {
    tokens: e[0],
    numArgs: 0
  } : {
    tokens: e[1],
    numArgs: 0
  };
});
var hn = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
};
m("\\char", function(t) {
  var e = t.popToken(), r, u = "";
  if (e.text === "'")
    r = 8, e = t.popToken();
  else if (e.text === '"')
    r = 16, e = t.popToken();
  else if (e.text === "`")
    if (e = t.popToken(), e.text[0] === "\\")
      u = e.text.charCodeAt(1);
    else {
      if (e.text === "EOF")
        throw new R("\\char` missing argument");
      u = e.text.charCodeAt(0);
    }
  else
    r = 10;
  if (r) {
    if (u = hn[e.text], u == null || u >= r)
      throw new R("Invalid base-" + r + " digit " + e.text);
    for (var a; (a = hn[t.future().text]) != null && a < r; )
      u *= r, u += a, t.popToken();
  }
  return "\\@char{" + u + "}";
});
var Uu = (t, e, r, u) => {
  var a = t.consumeArg().tokens;
  if (a.length !== 1)
    throw new R("\\newcommand's first argument must be a macro name");
  var n = a[0].text, i = t.isDefined(n);
  if (i && !e)
    throw new R("\\newcommand{" + n + "} attempting to redefine " + (n + "; use \\renewcommand"));
  if (!i && !r)
    throw new R("\\renewcommand{" + n + "} when command " + n + " does not yet exist; use \\newcommand");
  var s = 0;
  if (a = t.consumeArg().tokens, a.length === 1 && a[0].text === "[") {
    for (var o = "", h = t.expandNextToken(); h.text !== "]" && h.text !== "EOF"; )
      o += h.text, h = t.expandNextToken();
    if (!o.match(/^\s*[0-9]+\s*$/))
      throw new R("Invalid number of arguments: " + o);
    s = parseInt(o), a = t.consumeArg().tokens;
  }
  return i && u || t.macros.set(n, {
    tokens: a,
    numArgs: s
  }), "";
};
m("\\newcommand", (t) => Uu(t, !1, !0, !1));
m("\\renewcommand", (t) => Uu(t, !0, !1, !1));
m("\\providecommand", (t) => Uu(t, !0, !0, !0));
m("\\message", (t) => {
  var e = t.consumeArgs(1)[0];
  return console.log(e.reverse().map((r) => r.text).join("")), "";
});
m("\\errmessage", (t) => {
  var e = t.consumeArgs(1)[0];
  return console.error(e.reverse().map((r) => r.text).join("")), "";
});
m("\\show", (t) => {
  var e = t.popToken(), r = e.text;
  return console.log(e, t.macros.get(r), qe[r], i0.math[r], i0.text[r]), "";
});
m("\\bgroup", "{");
m("\\egroup", "}");
m("~", "\\nobreakspace");
m("\\lq", "`");
m("\\rq", "'");
m("\\aa", "\\r a");
m("\\AA", "\\r A");
m("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`©}");
m("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");
m("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}");
m("ℬ", "\\mathscr{B}");
m("ℰ", "\\mathscr{E}");
m("ℱ", "\\mathscr{F}");
m("ℋ", "\\mathscr{H}");
m("ℐ", "\\mathscr{I}");
m("ℒ", "\\mathscr{L}");
m("ℳ", "\\mathscr{M}");
m("ℛ", "\\mathscr{R}");
m("ℭ", "\\mathfrak{C}");
m("ℌ", "\\mathfrak{H}");
m("ℨ", "\\mathfrak{Z}");
m("\\Bbbk", "\\Bbb{k}");
m("·", "\\cdotp");
m("\\llap", "\\mathllap{\\textrm{#1}}");
m("\\rlap", "\\mathrlap{\\textrm{#1}}");
m("\\clap", "\\mathclap{\\textrm{#1}}");
m("\\mathstrut", "\\vphantom{(}");
m("\\underbar", "\\underline{\\text{#1}}");
m("\\not", '\\html@mathml{\\mathrel{\\mathrlap\\@not}}{\\char"338}');
m("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}");
m("\\ne", "\\neq");
m("≠", "\\neq");
m("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}");
m("∉", "\\notin");
m("≘", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}");
m("≙", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}");
m("≚", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}");
m("≛", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}");
m("≝", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}");
m("≞", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}");
m("≟", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}");
m("⟂", "\\perp");
m("‼", "\\mathclose{!\\mkern-0.8mu!}");
m("∌", "\\notni");
m("⌜", "\\ulcorner");
m("⌝", "\\urcorner");
m("⌞", "\\llcorner");
m("⌟", "\\lrcorner");
m("©", "\\copyright");
m("®", "\\textregistered");
m("️", "\\textregistered");
m("\\ulcorner", '\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}');
m("\\urcorner", '\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}');
m("\\llcorner", '\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}');
m("\\lrcorner", '\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}');
m("\\vdots", "{\\varvdots\\rule{0pt}{15pt}}");
m("⋮", "\\vdots");
m("\\varGamma", "\\mathit{\\Gamma}");
m("\\varDelta", "\\mathit{\\Delta}");
m("\\varTheta", "\\mathit{\\Theta}");
m("\\varLambda", "\\mathit{\\Lambda}");
m("\\varXi", "\\mathit{\\Xi}");
m("\\varPi", "\\mathit{\\Pi}");
m("\\varSigma", "\\mathit{\\Sigma}");
m("\\varUpsilon", "\\mathit{\\Upsilon}");
m("\\varPhi", "\\mathit{\\Phi}");
m("\\varPsi", "\\mathit{\\Psi}");
m("\\varOmega", "\\mathit{\\Omega}");
m("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
m("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");
m("\\boxed", "\\fbox{$\\displaystyle{#1}$}");
m("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;");
m("\\implies", "\\DOTSB\\;\\Longrightarrow\\;");
m("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
m("\\dddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");
m("\\ddddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");
var dn = {
  ",": "\\dotsc",
  "\\not": "\\dotsb",
  // \keybin@ checks for the following:
  "+": "\\dotsb",
  "=": "\\dotsb",
  "<": "\\dotsb",
  ">": "\\dotsb",
  "-": "\\dotsb",
  "*": "\\dotsb",
  ":": "\\dotsb",
  // Symbols whose definition starts with \DOTSB:
  "\\DOTSB": "\\dotsb",
  "\\coprod": "\\dotsb",
  "\\bigvee": "\\dotsb",
  "\\bigwedge": "\\dotsb",
  "\\biguplus": "\\dotsb",
  "\\bigcap": "\\dotsb",
  "\\bigcup": "\\dotsb",
  "\\prod": "\\dotsb",
  "\\sum": "\\dotsb",
  "\\bigotimes": "\\dotsb",
  "\\bigoplus": "\\dotsb",
  "\\bigodot": "\\dotsb",
  "\\bigsqcup": "\\dotsb",
  "\\And": "\\dotsb",
  "\\longrightarrow": "\\dotsb",
  "\\Longrightarrow": "\\dotsb",
  "\\longleftarrow": "\\dotsb",
  "\\Longleftarrow": "\\dotsb",
  "\\longleftrightarrow": "\\dotsb",
  "\\Longleftrightarrow": "\\dotsb",
  "\\mapsto": "\\dotsb",
  "\\longmapsto": "\\dotsb",
  "\\hookrightarrow": "\\dotsb",
  "\\doteq": "\\dotsb",
  // Symbols whose definition starts with \mathbin:
  "\\mathbin": "\\dotsb",
  // Symbols whose definition starts with \mathrel:
  "\\mathrel": "\\dotsb",
  "\\relbar": "\\dotsb",
  "\\Relbar": "\\dotsb",
  "\\xrightarrow": "\\dotsb",
  "\\xleftarrow": "\\dotsb",
  // Symbols whose definition starts with \DOTSI:
  "\\DOTSI": "\\dotsi",
  "\\int": "\\dotsi",
  "\\oint": "\\dotsi",
  "\\iint": "\\dotsi",
  "\\iiint": "\\dotsi",
  "\\iiiint": "\\dotsi",
  "\\idotsint": "\\dotsi",
  // Symbols whose definition starts with \DOTSX:
  "\\DOTSX": "\\dotsx"
};
m("\\dots", function(t) {
  var e = "\\dotso", r = t.expandAfterFuture().text;
  return r in dn ? e = dn[r] : (r.slice(0, 4) === "\\not" || r in i0.math && ["bin", "rel"].includes(i0.math[r].group)) && (e = "\\dotsb"), e;
});
var Gu = {
  // \rightdelim@ checks for the following:
  ")": !0,
  "]": !0,
  "\\rbrack": !0,
  "\\}": !0,
  "\\rbrace": !0,
  "\\rangle": !0,
  "\\rceil": !0,
  "\\rfloor": !0,
  "\\rgroup": !0,
  "\\rmoustache": !0,
  "\\right": !0,
  "\\bigr": !0,
  "\\biggr": !0,
  "\\Bigr": !0,
  "\\Biggr": !0,
  // \extra@ also tests for the following:
  $: !0,
  // \extrap@ checks for the following:
  ";": !0,
  ".": !0,
  ",": !0
};
m("\\dotso", function(t) {
  var e = t.future().text;
  return e in Gu ? "\\ldots\\," : "\\ldots";
});
m("\\dotsc", function(t) {
  var e = t.future().text;
  return e in Gu && e !== "," ? "\\ldots\\," : "\\ldots";
});
m("\\cdots", function(t) {
  var e = t.future().text;
  return e in Gu ? "\\@cdots\\," : "\\@cdots";
});
m("\\dotsb", "\\cdots");
m("\\dotsm", "\\cdots");
m("\\dotsi", "\\!\\cdots");
m("\\dotsx", "\\ldots\\,");
m("\\DOTSI", "\\relax");
m("\\DOTSB", "\\relax");
m("\\DOTSX", "\\relax");
m("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");
m("\\,", "\\tmspace+{3mu}{.1667em}");
m("\\thinspace", "\\,");
m("\\>", "\\mskip{4mu}");
m("\\:", "\\tmspace+{4mu}{.2222em}");
m("\\medspace", "\\:");
m("\\;", "\\tmspace+{5mu}{.2777em}");
m("\\thickspace", "\\;");
m("\\!", "\\tmspace-{3mu}{.1667em}");
m("\\negthinspace", "\\!");
m("\\negmedspace", "\\tmspace-{4mu}{.2222em}");
m("\\negthickspace", "\\tmspace-{5mu}{.277em}");
m("\\enspace", "\\kern.5em ");
m("\\enskip", "\\hskip.5em\\relax");
m("\\quad", "\\hskip1em\\relax");
m("\\qquad", "\\hskip2em\\relax");
m("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
m("\\tag@paren", "\\tag@literal{({#1})}");
m("\\tag@literal", (t) => {
  if (t.macros.get("\\df@tag"))
    throw new R("Multiple \\tag");
  return "\\gdef\\df@tag{\\text{#1}}";
});
m("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");
m("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");
m("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
m("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");
m("\\newline", "\\\\\\relax");
m("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
var O1 = O(Ee["Main-Regular"][84][1] - 0.7 * Ee["Main-Regular"][65][1]);
m("\\LaTeX", "\\textrm{\\html@mathml{" + ("L\\kern-.36em\\raisebox{" + O1 + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{LaTeX}}");
m("\\KaTeX", "\\textrm{\\html@mathml{" + ("K\\kern-.17em\\raisebox{" + O1 + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{KaTeX}}");
m("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
m("\\@hspace", "\\hskip #1\\relax");
m("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");
m("\\ordinarycolon", ":");
m("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}");
m("\\dblcolon", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}');
m("\\coloneqq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}');
m("\\Coloneqq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}');
m("\\coloneq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}');
m("\\Coloneq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}');
m("\\eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}');
m("\\Eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}');
m("\\eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}');
m("\\Eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}');
m("\\colonapprox", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}');
m("\\Colonapprox", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}');
m("\\colonsim", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}');
m("\\Colonsim", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}');
m("∷", "\\dblcolon");
m("∹", "\\eqcolon");
m("≔", "\\coloneqq");
m("≕", "\\eqqcolon");
m("⩴", "\\Coloneqq");
m("\\ratio", "\\vcentcolon");
m("\\coloncolon", "\\dblcolon");
m("\\colonequals", "\\coloneqq");
m("\\coloncolonequals", "\\Coloneqq");
m("\\equalscolon", "\\eqqcolon");
m("\\equalscoloncolon", "\\Eqqcolon");
m("\\colonminus", "\\coloneq");
m("\\coloncolonminus", "\\Coloneq");
m("\\minuscolon", "\\eqcolon");
m("\\minuscoloncolon", "\\Eqcolon");
m("\\coloncolonapprox", "\\Colonapprox");
m("\\coloncolonsim", "\\Colonsim");
m("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
m("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");
m("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
m("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");
m("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}");
m("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}");
m("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}");
m("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}");
m("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}");
m("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}");
m("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}");
m("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}");
m("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}");
m("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{≩}");
m("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{≨}");
m("\\ngeqq", "\\html@mathml{\\@ngeqq}{≱}");
m("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{≱}");
m("\\nleqq", "\\html@mathml{\\@nleqq}{≰}");
m("\\nleqslant", "\\html@mathml{\\@nleqslant}{≰}");
m("\\nshortmid", "\\html@mathml{\\@nshortmid}{∤}");
m("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{∦}");
m("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{⊈}");
m("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{⊉}");
m("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{⊊}");
m("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{⫋}");
m("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{⊋}");
m("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{⫌}");
m("\\imath", "\\html@mathml{\\@imath}{ı}");
m("\\jmath", "\\html@mathml{\\@jmath}{ȷ}");
m("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}");
m("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}");
m("⟦", "\\llbracket");
m("⟧", "\\rrbracket");
m("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}");
m("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}");
m("⦃", "\\lBrace");
m("⦄", "\\rBrace");
m("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}");
m("⦵", "\\minuso");
m("\\darr", "\\downarrow");
m("\\dArr", "\\Downarrow");
m("\\Darr", "\\Downarrow");
m("\\lang", "\\langle");
m("\\rang", "\\rangle");
m("\\uarr", "\\uparrow");
m("\\uArr", "\\Uparrow");
m("\\Uarr", "\\Uparrow");
m("\\N", "\\mathbb{N}");
m("\\R", "\\mathbb{R}");
m("\\Z", "\\mathbb{Z}");
m("\\alef", "\\aleph");
m("\\alefsym", "\\aleph");
m("\\Alpha", "\\mathrm{A}");
m("\\Beta", "\\mathrm{B}");
m("\\bull", "\\bullet");
m("\\Chi", "\\mathrm{X}");
m("\\clubs", "\\clubsuit");
m("\\cnums", "\\mathbb{C}");
m("\\Complex", "\\mathbb{C}");
m("\\Dagger", "\\ddagger");
m("\\diamonds", "\\diamondsuit");
m("\\empty", "\\emptyset");
m("\\Epsilon", "\\mathrm{E}");
m("\\Eta", "\\mathrm{H}");
m("\\exist", "\\exists");
m("\\harr", "\\leftrightarrow");
m("\\hArr", "\\Leftrightarrow");
m("\\Harr", "\\Leftrightarrow");
m("\\hearts", "\\heartsuit");
m("\\image", "\\Im");
m("\\infin", "\\infty");
m("\\Iota", "\\mathrm{I}");
m("\\isin", "\\in");
m("\\Kappa", "\\mathrm{K}");
m("\\larr", "\\leftarrow");
m("\\lArr", "\\Leftarrow");
m("\\Larr", "\\Leftarrow");
m("\\lrarr", "\\leftrightarrow");
m("\\lrArr", "\\Leftrightarrow");
m("\\Lrarr", "\\Leftrightarrow");
m("\\Mu", "\\mathrm{M}");
m("\\natnums", "\\mathbb{N}");
m("\\Nu", "\\mathrm{N}");
m("\\Omicron", "\\mathrm{O}");
m("\\plusmn", "\\pm");
m("\\rarr", "\\rightarrow");
m("\\rArr", "\\Rightarrow");
m("\\Rarr", "\\Rightarrow");
m("\\real", "\\Re");
m("\\reals", "\\mathbb{R}");
m("\\Reals", "\\mathbb{R}");
m("\\Rho", "\\mathrm{P}");
m("\\sdot", "\\cdot");
m("\\sect", "\\S");
m("\\spades", "\\spadesuit");
m("\\sub", "\\subset");
m("\\sube", "\\subseteq");
m("\\supe", "\\supseteq");
m("\\Tau", "\\mathrm{T}");
m("\\thetasym", "\\vartheta");
m("\\weierp", "\\wp");
m("\\Zeta", "\\mathrm{Z}");
m("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}");
m("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}");
m("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits");
m("\\bra", "\\mathinner{\\langle{#1}|}");
m("\\ket", "\\mathinner{|{#1}\\rangle}");
m("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
m("\\Bra", "\\left\\langle#1\\right|");
m("\\Ket", "\\left|#1\\right\\rangle");
var q1 = (t) => (e) => {
  var r = e.consumeArg().tokens, u = e.consumeArg().tokens, a = e.consumeArg().tokens, n = e.consumeArg().tokens, i = e.macros.get("|"), s = e.macros.get("\\|");
  e.macros.beginGroup();
  var o = (p) => (k) => {
    t && (k.macros.set("|", i), a.length && k.macros.set("\\|", s));
    var x = p;
    if (!p && a.length) {
      var y = k.future();
      y.text === "|" && (k.popToken(), x = !0);
    }
    return {
      tokens: x ? a : u,
      numArgs: 0
    };
  };
  e.macros.set("|", o(!1)), a.length && e.macros.set("\\|", o(!0));
  var h = e.consumeArg().tokens, f = e.expandTokens([
    ...n,
    ...h,
    ...r
    // reversed
  ]);
  return e.macros.endGroup(), {
    tokens: f.reverse(),
    numArgs: 0
  };
};
m("\\bra@ket", q1(!1));
m("\\bra@set", q1(!0));
m("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");
m("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");
m("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");
m("\\angln", "{\\angl n}");
m("\\blue", "\\textcolor{##6495ed}{#1}");
m("\\orange", "\\textcolor{##ffa500}{#1}");
m("\\pink", "\\textcolor{##ff00af}{#1}");
m("\\red", "\\textcolor{##df0030}{#1}");
m("\\green", "\\textcolor{##28ae7b}{#1}");
m("\\gray", "\\textcolor{gray}{#1}");
m("\\purple", "\\textcolor{##9d38bd}{#1}");
m("\\blueA", "\\textcolor{##ccfaff}{#1}");
m("\\blueB", "\\textcolor{##80f6ff}{#1}");
m("\\blueC", "\\textcolor{##63d9ea}{#1}");
m("\\blueD", "\\textcolor{##11accd}{#1}");
m("\\blueE", "\\textcolor{##0c7f99}{#1}");
m("\\tealA", "\\textcolor{##94fff5}{#1}");
m("\\tealB", "\\textcolor{##26edd5}{#1}");
m("\\tealC", "\\textcolor{##01d1c1}{#1}");
m("\\tealD", "\\textcolor{##01a995}{#1}");
m("\\tealE", "\\textcolor{##208170}{#1}");
m("\\greenA", "\\textcolor{##b6ffb0}{#1}");
m("\\greenB", "\\textcolor{##8af281}{#1}");
m("\\greenC", "\\textcolor{##74cf70}{#1}");
m("\\greenD", "\\textcolor{##1fab54}{#1}");
m("\\greenE", "\\textcolor{##0d923f}{#1}");
m("\\goldA", "\\textcolor{##ffd0a9}{#1}");
m("\\goldB", "\\textcolor{##ffbb71}{#1}");
m("\\goldC", "\\textcolor{##ff9c39}{#1}");
m("\\goldD", "\\textcolor{##e07d10}{#1}");
m("\\goldE", "\\textcolor{##a75a05}{#1}");
m("\\redA", "\\textcolor{##fca9a9}{#1}");
m("\\redB", "\\textcolor{##ff8482}{#1}");
m("\\redC", "\\textcolor{##f9685d}{#1}");
m("\\redD", "\\textcolor{##e84d39}{#1}");
m("\\redE", "\\textcolor{##bc2612}{#1}");
m("\\maroonA", "\\textcolor{##ffbde0}{#1}");
m("\\maroonB", "\\textcolor{##ff92c6}{#1}");
m("\\maroonC", "\\textcolor{##ed5fa6}{#1}");
m("\\maroonD", "\\textcolor{##ca337c}{#1}");
m("\\maroonE", "\\textcolor{##9e034e}{#1}");
m("\\purpleA", "\\textcolor{##ddd7ff}{#1}");
m("\\purpleB", "\\textcolor{##c6b9fc}{#1}");
m("\\purpleC", "\\textcolor{##aa87ff}{#1}");
m("\\purpleD", "\\textcolor{##7854ab}{#1}");
m("\\purpleE", "\\textcolor{##543b78}{#1}");
m("\\mintA", "\\textcolor{##f5f9e8}{#1}");
m("\\mintB", "\\textcolor{##edf2df}{#1}");
m("\\mintC", "\\textcolor{##e0e5cc}{#1}");
m("\\grayA", "\\textcolor{##f6f7f7}{#1}");
m("\\grayB", "\\textcolor{##f0f1f2}{#1}");
m("\\grayC", "\\textcolor{##e3e5e6}{#1}");
m("\\grayD", "\\textcolor{##d6d8da}{#1}");
m("\\grayE", "\\textcolor{##babec2}{#1}");
m("\\grayF", "\\textcolor{##888d93}{#1}");
m("\\grayG", "\\textcolor{##626569}{#1}");
m("\\grayH", "\\textcolor{##3b3e40}{#1}");
m("\\grayI", "\\textcolor{##21242c}{#1}");
m("\\kaBlue", "\\textcolor{##314453}{#1}");
m("\\kaGreen", "\\textcolor{##71B307}{#1}");
var P1 = {
  "^": !0,
  // Parser.js
  _: !0,
  // Parser.js
  "\\limits": !0,
  // Parser.js
  "\\nolimits": !0
  // Parser.js
};
class Xc {
  constructor(e, r, u) {
    this.settings = void 0, this.expansionCount = void 0, this.lexer = void 0, this.macros = void 0, this.stack = void 0, this.mode = void 0, this.settings = r, this.expansionCount = 0, this.feed(e), this.macros = new Zc(Yc, r.macros), this.mode = u, this.stack = [];
  }
  /**
   * Feed a new input string to the same MacroExpander
   * (with existing macros etc.).
   */
  feed(e) {
    this.lexer = new cn(e, this.settings);
  }
  /**
   * Switches between "text" and "math" modes.
   */
  switchMode(e) {
    this.mode = e;
  }
  /**
   * Start a new group nesting within all namespaces.
   */
  beginGroup() {
    this.macros.beginGroup();
  }
  /**
   * End current group nesting within all namespaces.
   */
  endGroup() {
    this.macros.endGroup();
  }
  /**
   * Ends all currently nested groups (if any), restoring values before the
   * groups began.  Useful in case of an error in the middle of parsing.
   */
  endGroups() {
    this.macros.endGroups();
  }
  /**
   * Returns the topmost token on the stack, without expanding it.
   * Similar in behavior to TeX's `\futurelet`.
   */
  future() {
    return this.stack.length === 0 && this.pushToken(this.lexer.lex()), this.stack[this.stack.length - 1];
  }
  /**
   * Remove and return the next unexpanded token.
   */
  popToken() {
    return this.future(), this.stack.pop();
  }
  /**
   * Add a given token to the token stack.  In particular, this get be used
   * to put back a token returned from one of the other methods.
   */
  pushToken(e) {
    this.stack.push(e);
  }
  /**
   * Append an array of tokens to the token stack.
   */
  pushTokens(e) {
    this.stack.push(...e);
  }
  /**
   * Find an macro argument without expanding tokens and append the array of
   * tokens to the token stack. Uses Token as a container for the result.
   */
  scanArgument(e) {
    var r, u, a;
    if (e) {
      if (this.consumeSpaces(), this.future().text !== "[")
        return null;
      r = this.popToken(), {
        tokens: a,
        end: u
      } = this.consumeArg(["]"]);
    } else
      ({
        tokens: a,
        start: r,
        end: u
      } = this.consumeArg());
    return this.pushToken(new V0("EOF", u.loc)), this.pushTokens(a), new V0("", P0.range(r, u));
  }
  /**
   * Consume all following space tokens, without expansion.
   */
  consumeSpaces() {
    for (; ; ) {
      var e = this.future();
      if (e.text === " ")
        this.stack.pop();
      else
        break;
    }
  }
  /**
   * Consume an argument from the token stream, and return the resulting array
   * of tokens and start/end token.
   */
  consumeArg(e) {
    var r = [], u = e && e.length > 0;
    u || this.consumeSpaces();
    var a = this.future(), n, i = 0, s = 0;
    do {
      if (n = this.popToken(), r.push(n), n.text === "{")
        ++i;
      else if (n.text === "}") {
        if (--i, i === -1)
          throw new R("Extra }", n);
      } else if (n.text === "EOF")
        throw new R("Unexpected end of input in a macro argument, expected '" + (e && u ? e[s] : "}") + "'", n);
      if (e && u)
        if ((i === 0 || i === 1 && e[s] === "{") && n.text === e[s]) {
          if (++s, s === e.length) {
            r.splice(-s, s);
            break;
          }
        } else
          s = 0;
    } while (i !== 0 || u);
    return a.text === "{" && r[r.length - 1].text === "}" && (r.pop(), r.shift()), r.reverse(), {
      tokens: r,
      start: a,
      end: n
    };
  }
  /**
   * Consume the specified number of (delimited) arguments from the token
   * stream and return the resulting array of arguments.
   */
  consumeArgs(e, r) {
    if (r) {
      if (r.length !== e + 1)
        throw new R("The length of delimiters doesn't match the number of args!");
      for (var u = r[0], a = 0; a < u.length; a++) {
        var n = this.popToken();
        if (u[a] !== n.text)
          throw new R("Use of the macro doesn't match its definition", n);
      }
    }
    for (var i = [], s = 0; s < e; s++)
      i.push(this.consumeArg(r && r[s + 1]).tokens);
    return i;
  }
  /**
   * Increment `expansionCount` by the specified amount.
   * Throw an error if it exceeds `maxExpand`.
   */
  countExpansion(e) {
    if (this.expansionCount += e, this.expansionCount > this.settings.maxExpand)
      throw new R("Too many expansions: infinite loop or need to increase maxExpand setting");
  }
  /**
   * Expand the next token only once if possible.
   *
   * If the token is expanded, the resulting tokens will be pushed onto
   * the stack in reverse order, and the number of such tokens will be
   * returned.  This number might be zero or positive.
   *
   * If not, the return value is `false`, and the next token remains at the
   * top of the stack.
   *
   * In either case, the next token will be on the top of the stack,
   * or the stack will be empty (in case of empty expansion
   * and no other tokens).
   *
   * Used to implement `expandAfterFuture` and `expandNextToken`.
   *
   * If expandableOnly, only expandable tokens are expanded and
   * an undefined control sequence results in an error.
   */
  expandOnce(e) {
    var r = this.popToken(), u = r.text, a = r.noexpand ? null : this._getExpansion(u);
    if (a == null || e && a.unexpandable) {
      if (e && a == null && u[0] === "\\" && !this.isDefined(u))
        throw new R("Undefined control sequence: " + u);
      return this.pushToken(r), !1;
    }
    this.countExpansion(1);
    var n = a.tokens, i = this.consumeArgs(a.numArgs, a.delimiters);
    if (a.numArgs) {
      n = n.slice();
      for (var s = n.length - 1; s >= 0; --s) {
        var o = n[s];
        if (o.text === "#") {
          if (s === 0)
            throw new R("Incomplete placeholder at end of macro body", o);
          if (o = n[--s], o.text === "#")
            n.splice(s + 1, 1);
          else if (/^[1-9]$/.test(o.text))
            n.splice(s, 2, ...i[+o.text - 1]);
          else
            throw new R("Not a valid argument number", o);
        }
      }
    }
    return this.pushTokens(n), n.length;
  }
  /**
   * Expand the next token only once (if possible), and return the resulting
   * top token on the stack (without removing anything from the stack).
   * Similar in behavior to TeX's `\expandafter\futurelet`.
   * Equivalent to expandOnce() followed by future().
   */
  expandAfterFuture() {
    return this.expandOnce(), this.future();
  }
  /**
   * Recursively expand first token, then return first non-expandable token.
   */
  expandNextToken() {
    for (; ; )
      if (this.expandOnce() === !1) {
        var e = this.stack.pop();
        return e.treatAsRelax && (e.text = "\\relax"), e;
      }
    throw new Error();
  }
  /**
   * Fully expand the given macro name and return the resulting list of
   * tokens, or return `undefined` if no such macro is defined.
   */
  expandMacro(e) {
    return this.macros.has(e) ? this.expandTokens([new V0(e)]) : void 0;
  }
  /**
   * Fully expand the given token stream and return the resulting list of
   * tokens.  Note that the input tokens are in reverse order, but the
   * output tokens are in forward order.
   */
  expandTokens(e) {
    var r = [], u = this.stack.length;
    for (this.pushTokens(e); this.stack.length > u; )
      if (this.expandOnce(!0) === !1) {
        var a = this.stack.pop();
        a.treatAsRelax && (a.noexpand = !1, a.treatAsRelax = !1), r.push(a);
      }
    return this.countExpansion(r.length), r;
  }
  /**
   * Fully expand the given macro name and return the result as a string,
   * or return `undefined` if no such macro is defined.
   */
  expandMacroAsText(e) {
    var r = this.expandMacro(e);
    return r && r.map((u) => u.text).join("");
  }
  /**
   * Returns the expanded macro as a reversed array of tokens and a macro
   * argument count.  Or returns `null` if no such macro.
   */
  _getExpansion(e) {
    var r = this.macros.get(e);
    if (r == null)
      return r;
    if (e.length === 1) {
      var u = this.lexer.catcodes[e];
      if (u != null && u !== 13)
        return;
    }
    var a = typeof r == "function" ? r(this) : r;
    if (typeof a == "string") {
      var n = 0;
      if (a.indexOf("#") !== -1)
        for (var i = a.replace(/##/g, ""); i.indexOf("#" + (n + 1)) !== -1; )
          ++n;
      for (var s = new cn(a, this.settings), o = [], h = s.lex(); h.text !== "EOF"; )
        o.push(h), h = s.lex();
      o.reverse();
      var f = {
        tokens: o,
        numArgs: n
      };
      return f;
    }
    return a;
  }
  /**
   * Determine whether a command is currently "defined" (has some
   * functionality), meaning that it's a macro (in the current group),
   * a function, a symbol, or one of the special commands listed in
   * `implicitCommands`.
   */
  isDefined(e) {
    return this.macros.has(e) || qe.hasOwnProperty(e) || i0.math.hasOwnProperty(e) || i0.text.hasOwnProperty(e) || P1.hasOwnProperty(e);
  }
  /**
   * Determine whether a command is expandable.
   */
  isExpandable(e) {
    var r = this.macros.get(e);
    return r != null ? typeof r == "string" || typeof r == "function" || !r.unexpandable : qe.hasOwnProperty(e) && !qe[e].primitive;
  }
}
var fn = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/, Yt = Object.freeze({
  "₊": "+",
  "₋": "-",
  "₌": "=",
  "₍": "(",
  "₎": ")",
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "ₐ": "a",
  "ₑ": "e",
  "ₕ": "h",
  "ᵢ": "i",
  "ⱼ": "j",
  "ₖ": "k",
  "ₗ": "l",
  "ₘ": "m",
  "ₙ": "n",
  "ₒ": "o",
  "ₚ": "p",
  "ᵣ": "r",
  "ₛ": "s",
  "ₜ": "t",
  "ᵤ": "u",
  "ᵥ": "v",
  "ₓ": "x",
  "ᵦ": "β",
  "ᵧ": "γ",
  "ᵨ": "ρ",
  "ᵩ": "ϕ",
  "ᵪ": "χ",
  "⁺": "+",
  "⁻": "-",
  "⁼": "=",
  "⁽": "(",
  "⁾": ")",
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "ᴬ": "A",
  "ᴮ": "B",
  "ᴰ": "D",
  "ᴱ": "E",
  "ᴳ": "G",
  "ᴴ": "H",
  "ᴵ": "I",
  "ᴶ": "J",
  "ᴷ": "K",
  "ᴸ": "L",
  "ᴹ": "M",
  "ᴺ": "N",
  "ᴼ": "O",
  "ᴾ": "P",
  "ᴿ": "R",
  "ᵀ": "T",
  "ᵁ": "U",
  "ⱽ": "V",
  "ᵂ": "W",
  "ᵃ": "a",
  "ᵇ": "b",
  "ᶜ": "c",
  "ᵈ": "d",
  "ᵉ": "e",
  "ᶠ": "f",
  "ᵍ": "g",
  ʰ: "h",
  "ⁱ": "i",
  ʲ: "j",
  "ᵏ": "k",
  ˡ: "l",
  "ᵐ": "m",
  ⁿ: "n",
  "ᵒ": "o",
  "ᵖ": "p",
  ʳ: "r",
  ˢ: "s",
  "ᵗ": "t",
  "ᵘ": "u",
  "ᵛ": "v",
  ʷ: "w",
  ˣ: "x",
  ʸ: "y",
  "ᶻ": "z",
  "ᵝ": "β",
  "ᵞ": "γ",
  "ᵟ": "δ",
  "ᵠ": "ϕ",
  "ᵡ": "χ",
  "ᶿ": "θ"
}), tu = {
  "́": {
    text: "\\'",
    math: "\\acute"
  },
  "̀": {
    text: "\\`",
    math: "\\grave"
  },
  "̈": {
    text: '\\"',
    math: "\\ddot"
  },
  "̃": {
    text: "\\~",
    math: "\\tilde"
  },
  "̄": {
    text: "\\=",
    math: "\\bar"
  },
  "̆": {
    text: "\\u",
    math: "\\breve"
  },
  "̌": {
    text: "\\v",
    math: "\\check"
  },
  "̂": {
    text: "\\^",
    math: "\\hat"
  },
  "̇": {
    text: "\\.",
    math: "\\dot"
  },
  "̊": {
    text: "\\r",
    math: "\\mathring"
  },
  "̋": {
    text: "\\H"
  },
  "̧": {
    text: "\\c"
  }
}, mn = {
  á: "á",
  à: "à",
  ä: "ä",
  ǟ: "ǟ",
  ã: "ã",
  ā: "ā",
  ă: "ă",
  ắ: "ắ",
  ằ: "ằ",
  ẵ: "ẵ",
  ǎ: "ǎ",
  â: "â",
  ấ: "ấ",
  ầ: "ầ",
  ẫ: "ẫ",
  ȧ: "ȧ",
  ǡ: "ǡ",
  å: "å",
  ǻ: "ǻ",
  ḃ: "ḃ",
  ć: "ć",
  ḉ: "ḉ",
  č: "č",
  ĉ: "ĉ",
  ċ: "ċ",
  ç: "ç",
  ď: "ď",
  ḋ: "ḋ",
  ḑ: "ḑ",
  é: "é",
  è: "è",
  ë: "ë",
  ẽ: "ẽ",
  ē: "ē",
  ḗ: "ḗ",
  ḕ: "ḕ",
  ĕ: "ĕ",
  ḝ: "ḝ",
  ě: "ě",
  ê: "ê",
  ế: "ế",
  ề: "ề",
  ễ: "ễ",
  ė: "ė",
  ȩ: "ȩ",
  ḟ: "ḟ",
  ǵ: "ǵ",
  ḡ: "ḡ",
  ğ: "ğ",
  ǧ: "ǧ",
  ĝ: "ĝ",
  ġ: "ġ",
  ģ: "ģ",
  ḧ: "ḧ",
  ȟ: "ȟ",
  ĥ: "ĥ",
  ḣ: "ḣ",
  ḩ: "ḩ",
  í: "í",
  ì: "ì",
  ï: "ï",
  ḯ: "ḯ",
  ĩ: "ĩ",
  ī: "ī",
  ĭ: "ĭ",
  ǐ: "ǐ",
  î: "î",
  ǰ: "ǰ",
  ĵ: "ĵ",
  ḱ: "ḱ",
  ǩ: "ǩ",
  ķ: "ķ",
  ĺ: "ĺ",
  ľ: "ľ",
  ļ: "ļ",
  ḿ: "ḿ",
  ṁ: "ṁ",
  ń: "ń",
  ǹ: "ǹ",
  ñ: "ñ",
  ň: "ň",
  ṅ: "ṅ",
  ņ: "ņ",
  ó: "ó",
  ò: "ò",
  ö: "ö",
  ȫ: "ȫ",
  õ: "õ",
  ṍ: "ṍ",
  ṏ: "ṏ",
  ȭ: "ȭ",
  ō: "ō",
  ṓ: "ṓ",
  ṑ: "ṑ",
  ŏ: "ŏ",
  ǒ: "ǒ",
  ô: "ô",
  ố: "ố",
  ồ: "ồ",
  ỗ: "ỗ",
  ȯ: "ȯ",
  ȱ: "ȱ",
  ő: "ő",
  ṕ: "ṕ",
  ṗ: "ṗ",
  ŕ: "ŕ",
  ř: "ř",
  ṙ: "ṙ",
  ŗ: "ŗ",
  ś: "ś",
  ṥ: "ṥ",
  š: "š",
  ṧ: "ṧ",
  ŝ: "ŝ",
  ṡ: "ṡ",
  ş: "ş",
  ẗ: "ẗ",
  ť: "ť",
  ṫ: "ṫ",
  ţ: "ţ",
  ú: "ú",
  ù: "ù",
  ü: "ü",
  ǘ: "ǘ",
  ǜ: "ǜ",
  ǖ: "ǖ",
  ǚ: "ǚ",
  ũ: "ũ",
  ṹ: "ṹ",
  ū: "ū",
  ṻ: "ṻ",
  ŭ: "ŭ",
  ǔ: "ǔ",
  û: "û",
  ů: "ů",
  ű: "ű",
  ṽ: "ṽ",
  ẃ: "ẃ",
  ẁ: "ẁ",
  ẅ: "ẅ",
  ŵ: "ŵ",
  ẇ: "ẇ",
  ẘ: "ẘ",
  ẍ: "ẍ",
  ẋ: "ẋ",
  ý: "ý",
  ỳ: "ỳ",
  ÿ: "ÿ",
  ỹ: "ỹ",
  ȳ: "ȳ",
  ŷ: "ŷ",
  ẏ: "ẏ",
  ẙ: "ẙ",
  ź: "ź",
  ž: "ž",
  ẑ: "ẑ",
  ż: "ż",
  Á: "Á",
  À: "À",
  Ä: "Ä",
  Ǟ: "Ǟ",
  Ã: "Ã",
  Ā: "Ā",
  Ă: "Ă",
  Ắ: "Ắ",
  Ằ: "Ằ",
  Ẵ: "Ẵ",
  Ǎ: "Ǎ",
  Â: "Â",
  Ấ: "Ấ",
  Ầ: "Ầ",
  Ẫ: "Ẫ",
  Ȧ: "Ȧ",
  Ǡ: "Ǡ",
  Å: "Å",
  Ǻ: "Ǻ",
  Ḃ: "Ḃ",
  Ć: "Ć",
  Ḉ: "Ḉ",
  Č: "Č",
  Ĉ: "Ĉ",
  Ċ: "Ċ",
  Ç: "Ç",
  Ď: "Ď",
  Ḋ: "Ḋ",
  Ḑ: "Ḑ",
  É: "É",
  È: "È",
  Ë: "Ë",
  Ẽ: "Ẽ",
  Ē: "Ē",
  Ḗ: "Ḗ",
  Ḕ: "Ḕ",
  Ĕ: "Ĕ",
  Ḝ: "Ḝ",
  Ě: "Ě",
  Ê: "Ê",
  Ế: "Ế",
  Ề: "Ề",
  Ễ: "Ễ",
  Ė: "Ė",
  Ȩ: "Ȩ",
  Ḟ: "Ḟ",
  Ǵ: "Ǵ",
  Ḡ: "Ḡ",
  Ğ: "Ğ",
  Ǧ: "Ǧ",
  Ĝ: "Ĝ",
  Ġ: "Ġ",
  Ģ: "Ģ",
  Ḧ: "Ḧ",
  Ȟ: "Ȟ",
  Ĥ: "Ĥ",
  Ḣ: "Ḣ",
  Ḩ: "Ḩ",
  Í: "Í",
  Ì: "Ì",
  Ï: "Ï",
  Ḯ: "Ḯ",
  Ĩ: "Ĩ",
  Ī: "Ī",
  Ĭ: "Ĭ",
  Ǐ: "Ǐ",
  Î: "Î",
  İ: "İ",
  Ĵ: "Ĵ",
  Ḱ: "Ḱ",
  Ǩ: "Ǩ",
  Ķ: "Ķ",
  Ĺ: "Ĺ",
  Ľ: "Ľ",
  Ļ: "Ļ",
  Ḿ: "Ḿ",
  Ṁ: "Ṁ",
  Ń: "Ń",
  Ǹ: "Ǹ",
  Ñ: "Ñ",
  Ň: "Ň",
  Ṅ: "Ṅ",
  Ņ: "Ņ",
  Ó: "Ó",
  Ò: "Ò",
  Ö: "Ö",
  Ȫ: "Ȫ",
  Õ: "Õ",
  Ṍ: "Ṍ",
  Ṏ: "Ṏ",
  Ȭ: "Ȭ",
  Ō: "Ō",
  Ṓ: "Ṓ",
  Ṑ: "Ṑ",
  Ŏ: "Ŏ",
  Ǒ: "Ǒ",
  Ô: "Ô",
  Ố: "Ố",
  Ồ: "Ồ",
  Ỗ: "Ỗ",
  Ȯ: "Ȯ",
  Ȱ: "Ȱ",
  Ő: "Ő",
  Ṕ: "Ṕ",
  Ṗ: "Ṗ",
  Ŕ: "Ŕ",
  Ř: "Ř",
  Ṙ: "Ṙ",
  Ŗ: "Ŗ",
  Ś: "Ś",
  Ṥ: "Ṥ",
  Š: "Š",
  Ṧ: "Ṧ",
  Ŝ: "Ŝ",
  Ṡ: "Ṡ",
  Ş: "Ş",
  Ť: "Ť",
  Ṫ: "Ṫ",
  Ţ: "Ţ",
  Ú: "Ú",
  Ù: "Ù",
  Ü: "Ü",
  Ǘ: "Ǘ",
  Ǜ: "Ǜ",
  Ǖ: "Ǖ",
  Ǚ: "Ǚ",
  Ũ: "Ũ",
  Ṹ: "Ṹ",
  Ū: "Ū",
  Ṻ: "Ṻ",
  Ŭ: "Ŭ",
  Ǔ: "Ǔ",
  Û: "Û",
  Ů: "Ů",
  Ű: "Ű",
  Ṽ: "Ṽ",
  Ẃ: "Ẃ",
  Ẁ: "Ẁ",
  Ẅ: "Ẅ",
  Ŵ: "Ŵ",
  Ẇ: "Ẇ",
  Ẍ: "Ẍ",
  Ẋ: "Ẋ",
  Ý: "Ý",
  Ỳ: "Ỳ",
  Ÿ: "Ÿ",
  Ỹ: "Ỹ",
  Ȳ: "Ȳ",
  Ŷ: "Ŷ",
  Ẏ: "Ẏ",
  Ź: "Ź",
  Ž: "Ž",
  Ẑ: "Ẑ",
  Ż: "Ż",
  ά: "ά",
  ὰ: "ὰ",
  ᾱ: "ᾱ",
  ᾰ: "ᾰ",
  έ: "έ",
  ὲ: "ὲ",
  ή: "ή",
  ὴ: "ὴ",
  ί: "ί",
  ὶ: "ὶ",
  ϊ: "ϊ",
  ΐ: "ΐ",
  ῒ: "ῒ",
  ῑ: "ῑ",
  ῐ: "ῐ",
  ό: "ό",
  ὸ: "ὸ",
  ύ: "ύ",
  ὺ: "ὺ",
  ϋ: "ϋ",
  ΰ: "ΰ",
  ῢ: "ῢ",
  ῡ: "ῡ",
  ῠ: "ῠ",
  ώ: "ώ",
  ὼ: "ὼ",
  Ύ: "Ύ",
  Ὺ: "Ὺ",
  Ϋ: "Ϋ",
  Ῡ: "Ῡ",
  Ῠ: "Ῠ",
  Ώ: "Ώ",
  Ὼ: "Ὼ"
};
class yr {
  constructor(e, r) {
    this.mode = void 0, this.gullet = void 0, this.settings = void 0, this.leftrightDepth = void 0, this.nextToken = void 0, this.mode = "math", this.gullet = new Xc(e, r, this.mode), this.settings = r, this.leftrightDepth = 0;
  }
  /**
   * Checks a result to make sure it has the right type, and throws an
   * appropriate error otherwise.
   */
  expect(e, r) {
    if (r === void 0 && (r = !0), this.fetch().text !== e)
      throw new R("Expected '" + e + "', got '" + this.fetch().text + "'", this.fetch());
    r && this.consume();
  }
  /**
   * Discards the current lookahead token, considering it consumed.
   */
  consume() {
    this.nextToken = null;
  }
  /**
   * Return the current lookahead token, or if there isn't one (at the
   * beginning, or if the previous lookahead token was consume()d),
   * fetch the next token as the new lookahead token and return it.
   */
  fetch() {
    return this.nextToken == null && (this.nextToken = this.gullet.expandNextToken()), this.nextToken;
  }
  /**
   * Switches between "text" and "math" modes.
   */
  switchMode(e) {
    this.mode = e, this.gullet.switchMode(e);
  }
  /**
   * Main parsing function, which parses an entire input.
   */
  parse() {
    this.settings.globalGroup || this.gullet.beginGroup(), this.settings.colorIsTextColor && this.gullet.macros.set("\\color", "\\textcolor");
    try {
      var e = this.parseExpression(!1);
      return this.expect("EOF"), this.settings.globalGroup || this.gullet.endGroup(), e;
    } finally {
      this.gullet.endGroups();
    }
  }
  /**
   * Fully parse a separate sequence of tokens as a separate job.
   * Tokens should be specified in reverse order, as in a MacroDefinition.
   */
  subparse(e) {
    var r = this.nextToken;
    this.consume(), this.gullet.pushToken(new V0("}")), this.gullet.pushTokens(e);
    var u = this.parseExpression(!1);
    return this.expect("}"), this.nextToken = r, u;
  }
  /**
   * Parses an "expression", which is a list of atoms.
   *
   * `breakOnInfix`: Should the parsing stop when we hit infix nodes? This
   *                 happens when functions have higher precedence han infix
   *                 nodes in implicit parses.
   *
   * `breakOnTokenText`: The text of the token that the expression should end
   *                     with, or `null` if something else should end the
   *                     expression.
   */
  parseExpression(e, r) {
    for (var u = []; ; ) {
      this.mode === "math" && this.consumeSpaces();
      var a = this.fetch();
      if (yr.endOfExpression.indexOf(a.text) !== -1 || r && a.text === r || e && qe[a.text] && qe[a.text].infix)
        break;
      var n = this.parseAtom(r);
      if (n) {
        if (n.type === "internal")
          continue;
      } else break;
      u.push(n);
    }
    return this.mode === "text" && this.formLigatures(u), this.handleInfixNodes(u);
  }
  /**
   * Rewrites infix operators such as \over with corresponding commands such
   * as \frac.
   *
   * There can only be one infix operator per group.  If there's more than one
   * then the expression is ambiguous.  This can be resolved by adding {}.
   */
  handleInfixNodes(e) {
    for (var r = -1, u, a = 0; a < e.length; a++)
      if (e[a].type === "infix") {
        if (r !== -1)
          throw new R("only one infix operator per group", e[a].token);
        r = a, u = e[a].replaceWith;
      }
    if (r !== -1 && u) {
      var n, i, s = e.slice(0, r), o = e.slice(r + 1);
      s.length === 1 && s[0].type === "ordgroup" ? n = s[0] : n = {
        type: "ordgroup",
        mode: this.mode,
        body: s
      }, o.length === 1 && o[0].type === "ordgroup" ? i = o[0] : i = {
        type: "ordgroup",
        mode: this.mode,
        body: o
      };
      var h;
      return u === "\\\\abovefrac" ? h = this.callFunction(u, [n, e[r], i], []) : h = this.callFunction(u, [n, i], []), [h];
    } else
      return e;
  }
  /**
   * Handle a subscript or superscript with nice errors.
   */
  handleSupSubscript(e) {
    var r = this.fetch(), u = r.text;
    this.consume(), this.consumeSpaces();
    var a;
    do {
      var n;
      a = this.parseGroup(e);
    } while (((n = a) == null ? void 0 : n.type) === "internal");
    if (!a)
      throw new R("Expected group after '" + u + "'", r);
    return a;
  }
  /**
   * Converts the textual input of an unsupported command into a text node
   * contained within a color node whose color is determined by errorColor
   */
  formatUnsupportedCmd(e) {
    for (var r = [], u = 0; u < e.length; u++)
      r.push({
        type: "textord",
        mode: "text",
        text: e[u]
      });
    var a = {
      type: "text",
      mode: this.mode,
      body: r
    }, n = {
      type: "color",
      mode: this.mode,
      color: this.settings.errorColor,
      body: [a]
    };
    return n;
  }
  /**
   * Parses a group with optional super/subscripts.
   */
  parseAtom(e) {
    var r = this.parseGroup("atom", e);
    if (r?.type === "internal" || this.mode === "text")
      return r;
    for (var u, a; ; ) {
      this.consumeSpaces();
      var n = this.fetch();
      if (n.text === "\\limits" || n.text === "\\nolimits") {
        if (r && r.type === "op") {
          var i = n.text === "\\limits";
          r.limits = i, r.alwaysHandleSupSub = !0;
        } else if (r && r.type === "operatorname")
          r.alwaysHandleSupSub && (r.limits = n.text === "\\limits");
        else
          throw new R("Limit controls must follow a math operator", n);
        this.consume();
      } else if (n.text === "^") {
        if (u)
          throw new R("Double superscript", n);
        u = this.handleSupSubscript("superscript");
      } else if (n.text === "_") {
        if (a)
          throw new R("Double subscript", n);
        a = this.handleSupSubscript("subscript");
      } else if (n.text === "'") {
        if (u)
          throw new R("Double superscript", n);
        var s = {
          type: "textord",
          mode: this.mode,
          text: "\\prime"
        }, o = [s];
        for (this.consume(); this.fetch().text === "'"; )
          o.push(s), this.consume();
        this.fetch().text === "^" && o.push(this.handleSupSubscript("superscript")), u = {
          type: "ordgroup",
          mode: this.mode,
          body: o
        };
      } else if (Yt[n.text]) {
        var h = fn.test(n.text), f = [];
        for (f.push(new V0(Yt[n.text])), this.consume(); ; ) {
          var p = this.fetch().text;
          if (!Yt[p] || fn.test(p) !== h)
            break;
          f.unshift(new V0(Yt[p])), this.consume();
        }
        var k = this.subparse(f);
        h ? a = {
          type: "ordgroup",
          mode: "math",
          body: k
        } : u = {
          type: "ordgroup",
          mode: "math",
          body: k
        };
      } else
        break;
    }
    return u || a ? {
      type: "supsub",
      mode: this.mode,
      base: r,
      sup: u,
      sub: a
    } : r;
  }
  /**
   * Parses an entire function, including its base and all of its arguments.
   */
  parseFunction(e, r) {
    var u = this.fetch(), a = u.text, n = qe[a];
    if (!n)
      return null;
    if (this.consume(), r && r !== "atom" && !n.allowedInArgument)
      throw new R("Got function '" + a + "' with no arguments" + (r ? " as " + r : ""), u);
    if (this.mode === "text" && !n.allowedInText)
      throw new R("Can't use function '" + a + "' in text mode", u);
    if (this.mode === "math" && n.allowedInMath === !1)
      throw new R("Can't use function '" + a + "' in math mode", u);
    var {
      args: i,
      optArgs: s
    } = this.parseArguments(a, n);
    return this.callFunction(a, i, s, u, e);
  }
  /**
   * Call a function handler with a suitable context and arguments.
   */
  callFunction(e, r, u, a, n) {
    var i = {
      funcName: e,
      parser: this,
      token: a,
      breakOnTokenText: n
    }, s = qe[e];
    if (s && s.handler)
      return s.handler(i, r, u);
    throw new R("No function handler for " + e);
  }
  /**
   * Parses the arguments of a function or environment
   */
  parseArguments(e, r) {
    var u = r.numArgs + r.numOptionalArgs;
    if (u === 0)
      return {
        args: [],
        optArgs: []
      };
    for (var a = [], n = [], i = 0; i < u; i++) {
      var s = r.argTypes && r.argTypes[i], o = i < r.numOptionalArgs;
      (r.primitive && s == null || // \sqrt expands into primitive if optional argument doesn't exist
      r.type === "sqrt" && i === 1 && n[0] == null) && (s = "primitive");
      var h = this.parseGroupOfType("argument to '" + e + "'", s, o);
      if (o)
        n.push(h);
      else if (h != null)
        a.push(h);
      else
        throw new R("Null argument, please report this as a bug");
    }
    return {
      args: a,
      optArgs: n
    };
  }
  /**
   * Parses a group when the mode is changing.
   */
  parseGroupOfType(e, r, u) {
    switch (r) {
      case "color":
        return this.parseColorGroup(u);
      case "size":
        return this.parseSizeGroup(u);
      case "url":
        return this.parseUrlGroup(u);
      case "math":
      case "text":
        return this.parseArgumentGroup(u, r);
      case "hbox": {
        var a = this.parseArgumentGroup(u, "text");
        return a != null ? {
          type: "styling",
          mode: a.mode,
          body: [a],
          style: "text"
          // simulate \textstyle
        } : null;
      }
      case "raw": {
        var n = this.parseStringGroup("raw", u);
        return n != null ? {
          type: "raw",
          mode: "text",
          string: n.text
        } : null;
      }
      case "primitive": {
        if (u)
          throw new R("A primitive argument cannot be optional");
        var i = this.parseGroup(e);
        if (i == null)
          throw new R("Expected group as " + e, this.fetch());
        return i;
      }
      case "original":
      case null:
      case void 0:
        return this.parseArgumentGroup(u);
      default:
        throw new R("Unknown group type as " + e, this.fetch());
    }
  }
  /**
   * Discard any space tokens, fetching the next non-space token.
   */
  consumeSpaces() {
    for (; this.fetch().text === " "; )
      this.consume();
  }
  /**
   * Parses a group, essentially returning the string formed by the
   * brace-enclosed tokens plus some position information.
   */
  parseStringGroup(e, r) {
    var u = this.gullet.scanArgument(r);
    if (u == null)
      return null;
    for (var a = "", n; (n = this.fetch()).text !== "EOF"; )
      a += n.text, this.consume();
    return this.consume(), u.text = a, u;
  }
  /**
   * Parses a regex-delimited group: the largest sequence of tokens
   * whose concatenated strings match `regex`. Returns the string
   * formed by the tokens plus some position information.
   */
  parseRegexGroup(e, r) {
    for (var u = this.fetch(), a = u, n = "", i; (i = this.fetch()).text !== "EOF" && e.test(n + i.text); )
      a = i, n += a.text, this.consume();
    if (n === "")
      throw new R("Invalid " + r + ": '" + u.text + "'", u);
    return u.range(a, n);
  }
  /**
   * Parses a color description.
   */
  parseColorGroup(e) {
    var r = this.parseStringGroup("color", e);
    if (r == null)
      return null;
    var u = /^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(r.text);
    if (!u)
      throw new R("Invalid color: '" + r.text + "'", r);
    var a = u[0];
    return /^[0-9a-f]{6}$/i.test(a) && (a = "#" + a), {
      type: "color-token",
      mode: this.mode,
      color: a
    };
  }
  /**
   * Parses a size specification, consisting of magnitude and unit.
   */
  parseSizeGroup(e) {
    var r, u = !1;
    if (this.gullet.consumeSpaces(), !e && this.gullet.future().text !== "{" ? r = this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size") : r = this.parseStringGroup("size", e), !r)
      return null;
    !e && r.text.length === 0 && (r.text = "0pt", u = !0);
    var a = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(r.text);
    if (!a)
      throw new R("Invalid size: '" + r.text + "'", r);
    var n = {
      number: +(a[1] + a[2]),
      // sign + magnitude, cast to number
      unit: a[3]
    };
    if (!Kn(n))
      throw new R("Invalid unit: '" + n.unit + "'", r);
    return {
      type: "size",
      mode: this.mode,
      value: n,
      isBlank: u
    };
  }
  /**
   * Parses an URL, checking escaped letters and allowed protocols,
   * and setting the catcode of % as an active character (as in \hyperref).
   */
  parseUrlGroup(e) {
    this.gullet.lexer.setCatcode("%", 13), this.gullet.lexer.setCatcode("~", 12);
    var r = this.parseStringGroup("url", e);
    if (this.gullet.lexer.setCatcode("%", 14), this.gullet.lexer.setCatcode("~", 13), r == null)
      return null;
    var u = r.text.replace(/\\([#$%&~_^{}])/g, "$1");
    return {
      type: "url",
      mode: this.mode,
      url: u
    };
  }
  /**
   * Parses an argument with the mode specified.
   */
  parseArgumentGroup(e, r) {
    var u = this.gullet.scanArgument(e);
    if (u == null)
      return null;
    var a = this.mode;
    r && this.switchMode(r), this.gullet.beginGroup();
    var n = this.parseExpression(!1, "EOF");
    this.expect("EOF"), this.gullet.endGroup();
    var i = {
      type: "ordgroup",
      mode: this.mode,
      loc: u.loc,
      body: n
    };
    return r && this.switchMode(a), i;
  }
  /**
   * Parses an ordinary group, which is either a single nucleus (like "x")
   * or an expression in braces (like "{x+y}") or an implicit group, a group
   * that starts at the current position, and ends right before a higher explicit
   * group ends, or at EOF.
   */
  parseGroup(e, r) {
    var u = this.fetch(), a = u.text, n;
    if (a === "{" || a === "\\begingroup") {
      this.consume();
      var i = a === "{" ? "}" : "\\endgroup";
      this.gullet.beginGroup();
      var s = this.parseExpression(!1, i), o = this.fetch();
      this.expect(i), this.gullet.endGroup(), n = {
        type: "ordgroup",
        mode: this.mode,
        loc: P0.range(u, o),
        body: s,
        // A group formed by \begingroup...\endgroup is a semi-simple group
        // which doesn't affect spacing in math mode, i.e., is transparent.
        // https://tex.stackexchange.com/questions/1930/when-should-one-
        // use-begingroup-instead-of-bgroup
        semisimple: a === "\\begingroup" || void 0
      };
    } else if (n = this.parseFunction(r, e) || this.parseSymbol(), n == null && a[0] === "\\" && !P1.hasOwnProperty(a)) {
      if (this.settings.throwOnError)
        throw new R("Undefined control sequence: " + a, u);
      n = this.formatUnsupportedCmd(a), this.consume();
    }
    return n;
  }
  /**
   * Form ligature-like combinations of characters for text mode.
   * This includes inputs like "--", "---", "``" and "''".
   * The result will simply replace multiple textord nodes with a single
   * character in each value by a single textord node having multiple
   * characters in its value.  The representation is still ASCII source.
   * The group will be modified in place.
   */
  formLigatures(e) {
    for (var r = e.length - 1, u = 0; u < r; ++u) {
      var a = e[u], n = a.text;
      n === "-" && e[u + 1].text === "-" && (u + 1 < r && e[u + 2].text === "-" ? (e.splice(u, 3, {
        type: "textord",
        mode: "text",
        loc: P0.range(a, e[u + 2]),
        text: "---"
      }), r -= 2) : (e.splice(u, 2, {
        type: "textord",
        mode: "text",
        loc: P0.range(a, e[u + 1]),
        text: "--"
      }), r -= 1)), (n === "'" || n === "`") && e[u + 1].text === n && (e.splice(u, 2, {
        type: "textord",
        mode: "text",
        loc: P0.range(a, e[u + 1]),
        text: n + n
      }), r -= 1);
    }
  }
  /**
   * Parse a single symbol out of the string. Here, we handle single character
   * symbols and special functions like \verb.
   */
  parseSymbol() {
    var e = this.fetch(), r = e.text;
    if (/^\\verb[^a-zA-Z]/.test(r)) {
      this.consume();
      var u = r.slice(5), a = u.charAt(0) === "*";
      if (a && (u = u.slice(1)), u.length < 2 || u.charAt(0) !== u.slice(-1))
        throw new R(`\\verb assertion failed --
                    please report what input caused this bug`);
      return u = u.slice(1, -1), {
        type: "verb",
        mode: "text",
        body: u,
        star: a
      };
    }
    mn.hasOwnProperty(r[0]) && !i0[this.mode][r[0]] && (this.settings.strict && this.mode === "math" && this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + r[0] + '" used in math mode', e), r = mn[r[0]] + r.slice(1));
    var n = jc.exec(r);
    n && (r = r.substring(0, n.index), r === "i" ? r = "ı" : r === "j" && (r = "ȷ"));
    var i;
    if (i0[this.mode][r]) {
      this.settings.strict && this.mode === "math" && fu.indexOf(r) >= 0 && this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + r[0] + '" used in math mode', e);
      var s = i0[this.mode][r].group, o = P0.range(e), h;
      if (Lo.hasOwnProperty(s)) {
        var f = s;
        h = {
          type: "atom",
          mode: this.mode,
          family: f,
          loc: o,
          text: r
        };
      } else
        h = {
          type: s,
          mode: this.mode,
          loc: o,
          text: r
        };
      i = h;
    } else if (r.charCodeAt(0) >= 128)
      this.settings.strict && (Xn(r.charCodeAt(0)) ? this.mode === "math" && this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + r[0] + '" used in math mode', e) : this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + r[0] + '"' + (" (" + r.charCodeAt(0) + ")"), e)), i = {
        type: "textord",
        mode: "text",
        loc: P0.range(e),
        text: r
      };
    else
      return null;
    if (this.consume(), n)
      for (var p = 0; p < n[0].length; p++) {
        var k = n[0][p];
        if (!tu[k])
          throw new R("Unknown accent ' " + k + "'", e);
        var x = tu[k][this.mode] || tu[k].text;
        if (!x)
          throw new R("Accent " + k + " unsupported in " + this.mode + " mode", e);
        i = {
          type: "accent",
          mode: this.mode,
          loc: P0.range(e),
          label: x,
          isStretchy: !1,
          isShifty: !0,
          // $FlowFixMe
          base: i
        };
      }
    return i;
  }
}
yr.endOfExpression = ["}", "\\endgroup", "\\end", "\\right", "&"];
var Kc = function(e, r) {
  if (!(typeof e == "string" || e instanceof String))
    throw new TypeError("KaTeX can only parse string typed expression");
  var u = new yr(e, r);
  delete u.gullet.macros.current["\\df@tag"];
  var a = u.parse();
  if (delete u.gullet.macros.current["\\current@color"], delete u.gullet.macros.current["\\color"], u.gullet.macros.get("\\df@tag")) {
    if (!r.displayMode)
      throw new R("\\tag works only in display equations");
    a = [{
      type: "tag",
      mode: "text",
      body: a,
      tag: u.subparse([new V0("\\df@tag")])
    }];
  }
  return a;
};
typeof document < "u" && document.compatMode !== "CSS1Compat" && typeof console < "u" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.");
var H1 = function(e, r) {
  var u = Qc(e, r).toMarkup();
  return u;
}, Jc = function(e, r, u) {
  if (u.throwOnError || !(e instanceof R))
    throw e;
  var a = T.makeSpan(["katex-error"], [new ae(r)]);
  return a.setAttribute("title", e.toString()), a.setAttribute("style", "color:" + u.errorColor), a;
}, Qc = function(e, r) {
  var u = new ho(r);
  try {
    var a = Kc(e, u);
    return lc(a, e, u);
  } catch (n) {
    return Jc(n, e, u);
  }
};
const e2 = (t, e, r) => {
  let u;
  try {
    u = H1(t, { ...e, displayMode: !1 });
  } catch (a) {
    if (a instanceof R) console.error(a), u = `<span class='katex-error' title='${ur(a.toString())}'>${ur(t)}</span>`;
    else throw a;
  }
  return r?.(u, !1) ?? u;
}, t2 = (t, e, r) => {
  let u;
  try {
    u = `<p class='katex-block'>${H1(t, { ...e, displayMode: !0 })}</p>
`;
  } catch (a) {
    if (a instanceof R) console.error(a), u = `<p class='katex-block katex-error' title='${ur(a.toString())}'>${ur(t)}</p>
`;
    else throw a;
  }
  return r?.(u, !0) ?? u;
}, r2 = (t, e = {}) => {
  const { allowInlineWithSpace: r = !1, delimiters: u, mathFence: a, logger: n = (h) => h === "newLineInDisplayMode" ? "ignore" : "warn", macros: i = {}, transformer: s, ...o } = e;
  t.use(eo, { allowInlineWithSpace: r, delimiters: u, mathFence: a, render: (h, f, p) => {
    const k = { strict: (x, y, _) => n(x, y, _, p) ?? "ignore", macros: i, throwOnError: !1, ...o };
    return f ? t2(h, k, s) : e2(h, k, s);
  } });
};
const {
  entries: $1,
  setPrototypeOf: pn,
  isFrozen: u2,
  getPrototypeOf: a2,
  getOwnPropertyDescriptor: n2
} = Object;
let {
  freeze: I0,
  seal: Q0,
  create: vu
} = Object, {
  apply: xu,
  construct: yu
} = typeof Reflect < "u" && Reflect;
I0 || (I0 = function(e) {
  return e;
});
Q0 || (Q0 = function(e) {
  return e;
});
xu || (xu = function(e, r) {
  for (var u = arguments.length, a = new Array(u > 2 ? u - 2 : 0), n = 2; n < u; n++)
    a[n - 2] = arguments[n];
  return e.apply(r, a);
});
yu || (yu = function(e) {
  for (var r = arguments.length, u = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++)
    u[a - 1] = arguments[a];
  return new e(...u);
});
const Xt = R0(Array.prototype.forEach), i2 = R0(Array.prototype.lastIndexOf), bn = R0(Array.prototype.pop), bt = R0(Array.prototype.push), s2 = R0(Array.prototype.splice), Qt = R0(String.prototype.toLowerCase), ru = R0(String.prototype.toString), uu = R0(String.prototype.match), gt = R0(String.prototype.replace), l2 = R0(String.prototype.indexOf), o2 = R0(String.prototype.trim), re = R0(Object.prototype.hasOwnProperty), z0 = R0(RegExp.prototype.test), vt = c2(TypeError);
function R0(t) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var r = arguments.length, u = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++)
      u[a - 1] = arguments[a];
    return xu(t, e, u);
  };
}
function c2(t) {
  return function() {
    for (var e = arguments.length, r = new Array(e), u = 0; u < e; u++)
      r[u] = arguments[u];
    return yu(t, r);
  };
}
function X(t, e) {
  let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Qt;
  pn && pn(t, null);
  let u = e.length;
  for (; u--; ) {
    let a = e[u];
    if (typeof a == "string") {
      const n = r(a);
      n !== a && (u2(e) || (e[u] = n), a = n);
    }
    t[a] = !0;
  }
  return t;
}
function h2(t) {
  for (let e = 0; e < t.length; e++)
    re(t, e) || (t[e] = null);
  return t;
}
function ce(t) {
  const e = vu(null);
  for (const [r, u] of $1(t))
    re(t, r) && (Array.isArray(u) ? e[r] = h2(u) : u && typeof u == "object" && u.constructor === Object ? e[r] = ce(u) : e[r] = u);
  return e;
}
function xt(t, e) {
  for (; t !== null; ) {
    const u = n2(t, e);
    if (u) {
      if (u.get)
        return R0(u.get);
      if (typeof u.value == "function")
        return R0(u.value);
    }
    t = a2(t);
  }
  function r() {
    return null;
  }
  return r;
}
const gn = I0(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), au = I0(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), nu = I0(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), d2 = I0(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), iu = I0(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), f2 = I0(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), vn = I0(["#text"]), xn = I0(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), su = I0(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), yn = I0(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Kt = I0(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), m2 = Q0(/\{\{[\w\W]*|[\w\W]*\}\}/gm), p2 = Q0(/<%[\w\W]*|[\w\W]*%>/gm), b2 = Q0(/\$\{[\w\W]*/gm), g2 = Q0(/^data-[\-\w.\u00B7-\uFFFF]+$/), v2 = Q0(/^aria-[\-\w]+$/), U1 = Q0(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), x2 = Q0(/^(?:\w+script|data):/i), y2 = Q0(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), G1 = Q0(/^html$/i), k2 = Q0(/^[a-z][.\w]*(-[.\w]+)+$/i);
var kn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: v2,
  ATTR_WHITESPACE: y2,
  CUSTOM_ELEMENT: k2,
  DATA_ATTR: g2,
  DOCTYPE_NAME: G1,
  ERB_EXPR: p2,
  IS_ALLOWED_URI: U1,
  IS_SCRIPT_OR_DATA: x2,
  MUSTACHE_EXPR: m2,
  TMPLIT_EXPR: b2
});
const yt = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, w2 = function() {
  return typeof window > "u" ? null : window;
}, A2 = function(e, r) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let u = null;
  const a = "data-tt-policy-suffix";
  r && r.hasAttribute(a) && (u = r.getAttribute(a));
  const n = "dompurify" + (u ? "#" + u : "");
  try {
    return e.createPolicy(n, {
      createHTML(i) {
        return i;
      },
      createScriptURL(i) {
        return i;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + n + " could not be created."), null;
  }
}, wn = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function V1() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : w2();
  const e = (U) => V1(U);
  if (e.version = "3.3.1", e.removed = [], !t || !t.document || t.document.nodeType !== yt.document || !t.Element)
    return e.isSupported = !1, e;
  let {
    document: r
  } = t;
  const u = r, a = u.currentScript, {
    DocumentFragment: n,
    HTMLTemplateElement: i,
    Node: s,
    Element: o,
    NodeFilter: h,
    NamedNodeMap: f = t.NamedNodeMap || t.MozNamedAttrMap,
    HTMLFormElement: p,
    DOMParser: k,
    trustedTypes: x
  } = t, y = o.prototype, _ = xt(y, "cloneNode"), E = xt(y, "remove"), F = xt(y, "nextSibling"), v = xt(y, "childNodes"), w = xt(y, "parentNode");
  if (typeof i == "function") {
    const U = r.createElement("template");
    U.content && U.content.ownerDocument && (r = U.content.ownerDocument);
  }
  let C, D = "";
  const {
    implementation: M,
    createNodeIterator: z,
    createDocumentFragment: P,
    getElementsByTagName: N
  } = r, {
    importNode: Y
  } = u;
  let G = wn();
  e.isSupported = typeof $1 == "function" && typeof w == "function" && M && M.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: K,
    ERB_EXPR: C0,
    TMPLIT_EXPR: o0,
    DATA_ATTR: m0,
    ARIA_ATTR: L0,
    IS_SCRIPT_OR_DATA: ee,
    ATTR_WHITESPACE: n0,
    CUSTOM_ELEMENT: E0
  } = kn;
  let {
    IS_ALLOWED_URI: k0
  } = kn, e0 = null;
  const u0 = X({}, [...gn, ...au, ...nu, ...iu, ...vn]);
  let s0 = null;
  const T0 = X({}, [...xn, ...su, ...yn, ...Kt]);
  let J = Object.seal(vu(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), U0 = null, M0 = null;
  const S0 = Object.seal(vu(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let ie = !0, Y0 = !0, ye = !1, Je = !0, X0 = !1, Be = !0, se = !1, Qe = !1, Ve = !1, te = !1, ke = !1, It = !1, Vu = !0, ju = !1;
  const W1 = "user-content-";
  let kr = !0, mt = !1, et = {}, le = null;
  const wr = X({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Wu = null;
  const Zu = X({}, ["audio", "video", "img", "source", "image", "track"]);
  let Ar = null;
  const Yu = X({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Rt = "http://www.w3.org/1998/Math/MathML", Nt = "http://www.w3.org/2000/svg", we = "http://www.w3.org/1999/xhtml";
  let tt = we, Sr = !1, _r = null;
  const Z1 = X({}, [Rt, Nt, we], ru);
  let Lt = X({}, ["mi", "mo", "mn", "ms", "mtext"]), Ot = X({}, ["annotation-xml"]);
  const Y1 = X({}, ["title", "style", "font", "a", "script"]);
  let pt = null;
  const X1 = ["application/xhtml+xml", "text/html"], K1 = "text/html";
  let x0 = null, rt = null;
  const J1 = r.createElement("form"), Xu = function(A) {
    return A instanceof RegExp || A instanceof Function;
  }, Cr = function() {
    let A = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(rt && rt === A)) {
      if ((!A || typeof A != "object") && (A = {}), A = ce(A), pt = // eslint-disable-next-line unicorn/prefer-includes
      X1.indexOf(A.PARSER_MEDIA_TYPE) === -1 ? K1 : A.PARSER_MEDIA_TYPE, x0 = pt === "application/xhtml+xml" ? ru : Qt, e0 = re(A, "ALLOWED_TAGS") ? X({}, A.ALLOWED_TAGS, x0) : u0, s0 = re(A, "ALLOWED_ATTR") ? X({}, A.ALLOWED_ATTR, x0) : T0, _r = re(A, "ALLOWED_NAMESPACES") ? X({}, A.ALLOWED_NAMESPACES, ru) : Z1, Ar = re(A, "ADD_URI_SAFE_ATTR") ? X(ce(Yu), A.ADD_URI_SAFE_ATTR, x0) : Yu, Wu = re(A, "ADD_DATA_URI_TAGS") ? X(ce(Zu), A.ADD_DATA_URI_TAGS, x0) : Zu, le = re(A, "FORBID_CONTENTS") ? X({}, A.FORBID_CONTENTS, x0) : wr, U0 = re(A, "FORBID_TAGS") ? X({}, A.FORBID_TAGS, x0) : ce({}), M0 = re(A, "FORBID_ATTR") ? X({}, A.FORBID_ATTR, x0) : ce({}), et = re(A, "USE_PROFILES") ? A.USE_PROFILES : !1, ie = A.ALLOW_ARIA_ATTR !== !1, Y0 = A.ALLOW_DATA_ATTR !== !1, ye = A.ALLOW_UNKNOWN_PROTOCOLS || !1, Je = A.ALLOW_SELF_CLOSE_IN_ATTR !== !1, X0 = A.SAFE_FOR_TEMPLATES || !1, Be = A.SAFE_FOR_XML !== !1, se = A.WHOLE_DOCUMENT || !1, te = A.RETURN_DOM || !1, ke = A.RETURN_DOM_FRAGMENT || !1, It = A.RETURN_TRUSTED_TYPE || !1, Ve = A.FORCE_BODY || !1, Vu = A.SANITIZE_DOM !== !1, ju = A.SANITIZE_NAMED_PROPS || !1, kr = A.KEEP_CONTENT !== !1, mt = A.IN_PLACE || !1, k0 = A.ALLOWED_URI_REGEXP || U1, tt = A.NAMESPACE || we, Lt = A.MATHML_TEXT_INTEGRATION_POINTS || Lt, Ot = A.HTML_INTEGRATION_POINTS || Ot, J = A.CUSTOM_ELEMENT_HANDLING || {}, A.CUSTOM_ELEMENT_HANDLING && Xu(A.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (J.tagNameCheck = A.CUSTOM_ELEMENT_HANDLING.tagNameCheck), A.CUSTOM_ELEMENT_HANDLING && Xu(A.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (J.attributeNameCheck = A.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), A.CUSTOM_ELEMENT_HANDLING && typeof A.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (J.allowCustomizedBuiltInElements = A.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), X0 && (Y0 = !1), ke && (te = !0), et && (e0 = X({}, vn), s0 = [], et.html === !0 && (X(e0, gn), X(s0, xn)), et.svg === !0 && (X(e0, au), X(s0, su), X(s0, Kt)), et.svgFilters === !0 && (X(e0, nu), X(s0, su), X(s0, Kt)), et.mathMl === !0 && (X(e0, iu), X(s0, yn), X(s0, Kt))), A.ADD_TAGS && (typeof A.ADD_TAGS == "function" ? S0.tagCheck = A.ADD_TAGS : (e0 === u0 && (e0 = ce(e0)), X(e0, A.ADD_TAGS, x0))), A.ADD_ATTR && (typeof A.ADD_ATTR == "function" ? S0.attributeCheck = A.ADD_ATTR : (s0 === T0 && (s0 = ce(s0)), X(s0, A.ADD_ATTR, x0))), A.ADD_URI_SAFE_ATTR && X(Ar, A.ADD_URI_SAFE_ATTR, x0), A.FORBID_CONTENTS && (le === wr && (le = ce(le)), X(le, A.FORBID_CONTENTS, x0)), A.ADD_FORBID_CONTENTS && (le === wr && (le = ce(le)), X(le, A.ADD_FORBID_CONTENTS, x0)), kr && (e0["#text"] = !0), se && X(e0, ["html", "head", "body"]), e0.table && (X(e0, ["tbody"]), delete U0.tbody), A.TRUSTED_TYPES_POLICY) {
        if (typeof A.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw vt('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof A.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw vt('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        C = A.TRUSTED_TYPES_POLICY, D = C.createHTML("");
      } else
        C === void 0 && (C = A2(x, a)), C !== null && typeof D == "string" && (D = C.createHTML(""));
      I0 && I0(A), rt = A;
    }
  }, Ku = X({}, [...au, ...nu, ...d2]), Ju = X({}, [...iu, ...f2]), Q1 = function(A) {
    let L = w(A);
    (!L || !L.tagName) && (L = {
      namespaceURI: tt,
      tagName: "template"
    });
    const $ = Qt(A.tagName), c0 = Qt(L.tagName);
    return _r[A.namespaceURI] ? A.namespaceURI === Nt ? L.namespaceURI === we ? $ === "svg" : L.namespaceURI === Rt ? $ === "svg" && (c0 === "annotation-xml" || Lt[c0]) : !!Ku[$] : A.namespaceURI === Rt ? L.namespaceURI === we ? $ === "math" : L.namespaceURI === Nt ? $ === "math" && Ot[c0] : !!Ju[$] : A.namespaceURI === we ? L.namespaceURI === Nt && !Ot[c0] || L.namespaceURI === Rt && !Lt[c0] ? !1 : !Ju[$] && (Y1[$] || !Ku[$]) : !!(pt === "application/xhtml+xml" && _r[A.namespaceURI]) : !1;
  }, oe = function(A) {
    bt(e.removed, {
      element: A
    });
    try {
      w(A).removeChild(A);
    } catch {
      E(A);
    }
  }, je = function(A, L) {
    try {
      bt(e.removed, {
        attribute: L.getAttributeNode(A),
        from: L
      });
    } catch {
      bt(e.removed, {
        attribute: null,
        from: L
      });
    }
    if (L.removeAttribute(A), A === "is")
      if (te || ke)
        try {
          oe(L);
        } catch {
        }
      else
        try {
          L.setAttribute(A, "");
        } catch {
        }
  }, Qu = function(A) {
    let L = null, $ = null;
    if (Ve)
      A = "<remove></remove>" + A;
    else {
      const g0 = uu(A, /^[\r\n\t ]+/);
      $ = g0 && g0[0];
    }
    pt === "application/xhtml+xml" && tt === we && (A = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + A + "</body></html>");
    const c0 = C ? C.createHTML(A) : A;
    if (tt === we)
      try {
        L = new k().parseFromString(c0, pt);
      } catch {
      }
    if (!L || !L.documentElement) {
      L = M.createDocument(tt, "template", null);
      try {
        L.documentElement.innerHTML = Sr ? D : c0;
      } catch {
      }
    }
    const D0 = L.body || L.documentElement;
    return A && $ && D0.insertBefore(r.createTextNode($), D0.childNodes[0] || null), tt === we ? N.call(L, se ? "html" : "body")[0] : se ? L.documentElement : D0;
  }, ea = function(A) {
    return z.call(
      A.ownerDocument || A,
      A,
      // eslint-disable-next-line no-bitwise
      h.SHOW_ELEMENT | h.SHOW_COMMENT | h.SHOW_TEXT | h.SHOW_PROCESSING_INSTRUCTION | h.SHOW_CDATA_SECTION,
      null
    );
  }, Er = function(A) {
    return A instanceof p && (typeof A.nodeName != "string" || typeof A.textContent != "string" || typeof A.removeChild != "function" || !(A.attributes instanceof f) || typeof A.removeAttribute != "function" || typeof A.setAttribute != "function" || typeof A.namespaceURI != "string" || typeof A.insertBefore != "function" || typeof A.hasChildNodes != "function");
  }, ta = function(A) {
    return typeof s == "function" && A instanceof s;
  };
  function Ae(U, A, L) {
    Xt(U, ($) => {
      $.call(e, A, L, rt);
    });
  }
  const ra = function(A) {
    let L = null;
    if (Ae(G.beforeSanitizeElements, A, null), Er(A))
      return oe(A), !0;
    const $ = x0(A.nodeName);
    if (Ae(G.uponSanitizeElement, A, {
      tagName: $,
      allowedTags: e0
    }), Be && A.hasChildNodes() && !ta(A.firstElementChild) && z0(/<[/\w!]/g, A.innerHTML) && z0(/<[/\w!]/g, A.textContent) || A.nodeType === yt.progressingInstruction || Be && A.nodeType === yt.comment && z0(/<[/\w]/g, A.data))
      return oe(A), !0;
    if (!(S0.tagCheck instanceof Function && S0.tagCheck($)) && (!e0[$] || U0[$])) {
      if (!U0[$] && aa($) && (J.tagNameCheck instanceof RegExp && z0(J.tagNameCheck, $) || J.tagNameCheck instanceof Function && J.tagNameCheck($)))
        return !1;
      if (kr && !le[$]) {
        const c0 = w(A) || A.parentNode, D0 = v(A) || A.childNodes;
        if (D0 && c0) {
          const g0 = D0.length;
          for (let O0 = g0 - 1; O0 >= 0; --O0) {
            const Se = _(D0[O0], !0);
            Se.__removalCount = (A.__removalCount || 0) + 1, c0.insertBefore(Se, F(A));
          }
        }
      }
      return oe(A), !0;
    }
    return A instanceof o && !Q1(A) || ($ === "noscript" || $ === "noembed" || $ === "noframes") && z0(/<\/no(script|embed|frames)/i, A.innerHTML) ? (oe(A), !0) : (X0 && A.nodeType === yt.text && (L = A.textContent, Xt([K, C0, o0], (c0) => {
      L = gt(L, c0, " ");
    }), A.textContent !== L && (bt(e.removed, {
      element: A.cloneNode()
    }), A.textContent = L)), Ae(G.afterSanitizeElements, A, null), !1);
  }, ua = function(A, L, $) {
    if (Vu && (L === "id" || L === "name") && ($ in r || $ in J1))
      return !1;
    if (!(Y0 && !M0[L] && z0(m0, L))) {
      if (!(ie && z0(L0, L))) {
        if (!(S0.attributeCheck instanceof Function && S0.attributeCheck(L, A))) {
          if (!s0[L] || M0[L]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(aa(A) && (J.tagNameCheck instanceof RegExp && z0(J.tagNameCheck, A) || J.tagNameCheck instanceof Function && J.tagNameCheck(A)) && (J.attributeNameCheck instanceof RegExp && z0(J.attributeNameCheck, L) || J.attributeNameCheck instanceof Function && J.attributeNameCheck(L, A)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              L === "is" && J.allowCustomizedBuiltInElements && (J.tagNameCheck instanceof RegExp && z0(J.tagNameCheck, $) || J.tagNameCheck instanceof Function && J.tagNameCheck($)))
            ) return !1;
          } else if (!Ar[L]) {
            if (!z0(k0, gt($, n0, ""))) {
              if (!((L === "src" || L === "xlink:href" || L === "href") && A !== "script" && l2($, "data:") === 0 && Wu[A])) {
                if (!(ye && !z0(ee, gt($, n0, "")))) {
                  if ($)
                    return !1;
                }
              }
            }
          }
        }
      }
    }
    return !0;
  }, aa = function(A) {
    return A !== "annotation-xml" && uu(A, E0);
  }, na = function(A) {
    Ae(G.beforeSanitizeAttributes, A, null);
    const {
      attributes: L
    } = A;
    if (!L || Er(A))
      return;
    const $ = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: s0,
      forceKeepAttr: void 0
    };
    let c0 = L.length;
    for (; c0--; ) {
      const D0 = L[c0], {
        name: g0,
        namespaceURI: O0,
        value: Se
      } = D0, ut = x0(g0), Dr = Se;
      let _0 = g0 === "value" ? Dr : o2(Dr);
      if ($.attrName = ut, $.attrValue = _0, $.keepAttr = !0, $.forceKeepAttr = void 0, Ae(G.uponSanitizeAttribute, A, $), _0 = $.attrValue, ju && (ut === "id" || ut === "name") && (je(g0, A), _0 = W1 + _0), Be && z0(/((--!?|])>)|<\/(style|title|textarea)/i, _0)) {
        je(g0, A);
        continue;
      }
      if (ut === "attributename" && uu(_0, "href")) {
        je(g0, A);
        continue;
      }
      if ($.forceKeepAttr)
        continue;
      if (!$.keepAttr) {
        je(g0, A);
        continue;
      }
      if (!Je && z0(/\/>/i, _0)) {
        je(g0, A);
        continue;
      }
      X0 && Xt([K, C0, o0], (sa) => {
        _0 = gt(_0, sa, " ");
      });
      const ia = x0(A.nodeName);
      if (!ua(ia, ut, _0)) {
        je(g0, A);
        continue;
      }
      if (C && typeof x == "object" && typeof x.getAttributeType == "function" && !O0)
        switch (x.getAttributeType(ia, ut)) {
          case "TrustedHTML": {
            _0 = C.createHTML(_0);
            break;
          }
          case "TrustedScriptURL": {
            _0 = C.createScriptURL(_0);
            break;
          }
        }
      if (_0 !== Dr)
        try {
          O0 ? A.setAttributeNS(O0, g0, _0) : A.setAttribute(g0, _0), Er(A) ? oe(A) : bn(e.removed);
        } catch {
          je(g0, A);
        }
    }
    Ae(G.afterSanitizeAttributes, A, null);
  }, ei = function U(A) {
    let L = null;
    const $ = ea(A);
    for (Ae(G.beforeSanitizeShadowDOM, A, null); L = $.nextNode(); )
      Ae(G.uponSanitizeShadowNode, L, null), ra(L), na(L), L.content instanceof n && U(L.content);
    Ae(G.afterSanitizeShadowDOM, A, null);
  };
  return e.sanitize = function(U) {
    let A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, L = null, $ = null, c0 = null, D0 = null;
    if (Sr = !U, Sr && (U = "<!-->"), typeof U != "string" && !ta(U))
      if (typeof U.toString == "function") {
        if (U = U.toString(), typeof U != "string")
          throw vt("dirty is not a string, aborting");
      } else
        throw vt("toString is not a function");
    if (!e.isSupported)
      return U;
    if (Qe || Cr(A), e.removed = [], typeof U == "string" && (mt = !1), mt) {
      if (U.nodeName) {
        const Se = x0(U.nodeName);
        if (!e0[Se] || U0[Se])
          throw vt("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (U instanceof s)
      L = Qu("<!---->"), $ = L.ownerDocument.importNode(U, !0), $.nodeType === yt.element && $.nodeName === "BODY" || $.nodeName === "HTML" ? L = $ : L.appendChild($);
    else {
      if (!te && !X0 && !se && // eslint-disable-next-line unicorn/prefer-includes
      U.indexOf("<") === -1)
        return C && It ? C.createHTML(U) : U;
      if (L = Qu(U), !L)
        return te ? null : It ? D : "";
    }
    L && Ve && oe(L.firstChild);
    const g0 = ea(mt ? U : L);
    for (; c0 = g0.nextNode(); )
      ra(c0), na(c0), c0.content instanceof n && ei(c0.content);
    if (mt)
      return U;
    if (te) {
      if (ke)
        for (D0 = P.call(L.ownerDocument); L.firstChild; )
          D0.appendChild(L.firstChild);
      else
        D0 = L;
      return (s0.shadowroot || s0.shadowrootmode) && (D0 = Y.call(u, D0, !0)), D0;
    }
    let O0 = se ? L.outerHTML : L.innerHTML;
    return se && e0["!doctype"] && L.ownerDocument && L.ownerDocument.doctype && L.ownerDocument.doctype.name && z0(G1, L.ownerDocument.doctype.name) && (O0 = "<!DOCTYPE " + L.ownerDocument.doctype.name + `>
` + O0), X0 && Xt([K, C0, o0], (Se) => {
      O0 = gt(O0, Se, " ");
    }), C && It ? C.createHTML(O0) : O0;
  }, e.setConfig = function() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Cr(U), Qe = !0;
  }, e.clearConfig = function() {
    rt = null, Qe = !1;
  }, e.isValidAttribute = function(U, A, L) {
    rt || Cr({});
    const $ = x0(U), c0 = x0(A);
    return ua($, c0, L);
  }, e.addHook = function(U, A) {
    typeof A == "function" && bt(G[U], A);
  }, e.removeHook = function(U, A) {
    if (A !== void 0) {
      const L = i2(G[U], A);
      return L === -1 ? void 0 : s2(G[U], L, 1)[0];
    }
    return bn(G[U]);
  }, e.removeHooks = function(U) {
    G[U] = [];
  }, e.removeAllHooks = function() {
    G = wn();
  }, e;
}
var j1 = V1();
const S2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: j1
}, Symbol.toStringTag, { value: "Module" })), _2 = "code[class*=language-],pre[class*=language-]{color:#000;background:none;text-shadow:0 1px white;font-family:Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,code[class*=language-] ::-moz-selection{text-shadow:none;background:#b3d4fc}pre[class*=language-]::selection,pre[class*=language-] ::selection,code[class*=language-]::selection,code[class*=language-] ::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*=language-],pre[class*=language-]{text-shadow:none}}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background:#f5f2f0}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.comment,.token.prolog,.token.doctype,.token.cdata{color:#708090}.token.punctuation{color:#999}.token.namespace{opacity:.7}.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol,.token.deleted{color:#905}.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.inserted{color:#690}.token.operator,.token.entity,.token.url,.language-css .token.string,.style .token.string{color:#9a6e3a;background:#ffffff80}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.function,.token.class-name{color:#dd4a68}.token.regex,.token.important,.token.variable{color:#e90}.token.important,.token.bold{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}";
var C2 = Object.defineProperty, E2 = Object.getOwnPropertyDescriptor, D2 = (t, e, r) => e in t ? C2(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, T2 = (t, e, r, u) => {
  for (var a = u > 1 ? void 0 : u ? E2(e, r) : e, n = t.length - 1, i; n >= 0; n--)
    (i = t[n]) && (a = i(a) || a);
  return a;
}, Ke = (t, e, r) => D2(t, typeof e != "symbol" ? e + "" : e, r);
const M2 = j1 || S2;
let l0 = class extends ti {
  // 存储 setInterval ID（用于清理）
  intervalId = null;
  static getMdItInstance() {
    return W0 || jl;
  }
  // 动态加载 Katex CSS（从 CDN）并注入到 Shadow DOM
  static async loadKatexCSS() {
    if (l0.katexCssContent)
      return l0.katexCssContent;
    if (l0.katexCssLoading)
      return new Promise((t) => {
        let e = 0;
        const r = 50, u = setInterval(() => {
          e++, l0.katexCssContent ? (clearInterval(u), t(l0.katexCssContent)) : e >= r && (clearInterval(u), console.warn("⚠ Katex CSS loading timeout"), t(""));
        }, 100);
      });
    l0.katexCssLoading = !0;
    try {
      const t = await fetch(
        "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
      );
      if (!t.ok)
        throw new Error(`Failed to fetch Katex CSS: ${t.status}`);
      return l0.katexCssContent = await t.text(), l0.katexCssLoading = !1, console.log("✓ Katex CSS loaded from CDN"), l0.katexCssContent;
    } catch (t) {
      return l0.katexCssLoading = !1, console.warn("⚠ Failed to load Katex CSS from CDN:", t), "";
    }
  }
  // 将 Katex CSS 注入到当前组件的 Shadow DOM
  injectKatexCSS() {
    this.shadowRoot && (this.shadowRoot.querySelector("style[data-katex]") || l0.loadKatexCSS().then((t) => {
      if (!t || !this.shadowRoot) return;
      const e = document.createElement("style");
      e.setAttribute("data-katex", "true"), e.textContent = t, this.shadowRoot.appendChild(e), this.update();
    }));
  }
  // 检测内容是否包含数学公式
  static hasMathFormula(t) {
    return /\$\$[\s\S]+?\$\$|\$[^$]+?\$|\\begin\{equation\}|\\begin\{align\}/.test(
      t
    );
  }
  // 组件安装时初始化
  installed() {
    l0.hasMathFormula(this.props.value || "") && this.injectKatexCSS();
  }
  /**
   * 组件卸载时清理
   */
  uninstalled() {
    this.intervalId !== null && (clearInterval(this.intervalId), this.intervalId = null), this.timeoutIds.forEach((t) => clearTimeout(t)), this.timeoutIds = [], this.copyButtonHandlers = /* @__PURE__ */ new WeakMap();
  }
  render() {
    return /* @__PURE__ */ Tr("div", { class: "markdown-container" }, this.renderMarkdownPreview());
  }
  renderMarkdownPreview() {
    const t = this.props.value || "";
    l0.hasMathFormula(t) && this.injectKatexCSS();
    const e = l0.mdIt.render(t), r = M2.sanitize(e, l0.purifyConfig);
    return /* @__PURE__ */ Tr(
      "div",
      {
        class: "_MarkdownContent_13a10_1 _SmoothedMarkdown_1g6h2_1",
        ref: (u) => this.setupCopyListeners(u)
      },
      /* @__PURE__ */ Tr("div", { class: "md-content", innerHTML: r })
    );
  }
  // 存储事件处理器，用于移除
  copyButtonHandlers = /* @__PURE__ */ new WeakMap();
  // 存储 setTimeout ID
  timeoutIds = [];
  // 设置复制按钮事件监听器
  setupCopyListeners(t) {
    if (!t) return;
    t.querySelectorAll("._Button_1jdeq_1").forEach((r) => {
      const u = this.copyButtonHandlers.get(r);
      u && r.removeEventListener("click", u);
      const a = (n) => {
        n.preventDefault();
        const i = r.getAttribute("data-code");
        i && navigator.clipboard.writeText(i).then(() => {
          console.log("代码已复制到剪贴板"), r.classList.add("copy-success-btn"), r.classList.remove("copy-error-btn");
          const s = window.setTimeout(() => {
            r.classList.remove("copy-success-btn");
            const o = this.timeoutIds.indexOf(s);
            o > -1 && this.timeoutIds.splice(o, 1);
          }, 2e3);
          this.timeoutIds.push(s);
        }).catch((s) => {
          console.error("复制失败:", s), r.classList.add("copy-error-btn"), r.classList.remove("copy-success-btn");
          const o = window.setTimeout(() => {
            r.classList.remove("copy-error-btn");
            const h = this.timeoutIds.indexOf(o);
            h > -1 && this.timeoutIds.splice(h, 1);
          }, 2e3);
          this.timeoutIds.push(o);
        });
      };
      r.addEventListener("click", a), this.copyButtonHandlers.set(r, a);
    });
  }
};
Ke(l0, "css", ui`
    ${_2}
    ${ri}
  `);
Ke(l0, "defaultProps", {
  value: ""
});
Ke(l0, "props", {
  value: String
});
Ke(l0, "katexCssLoading", !1);
Ke(l0, "mdIt", (() => {
  const t = l0.getMdItInstance()({
    html: !0,
    breaks: !0,
    linkify: !0,
    typographer: !0,
    highlight: (e, r) => {
      let u = `<div class="_SmoothedCodeBlock_1g6h2_50">
              <div class="_CodeBlock_1n4c0_1 _CodeBlock_1g6h2_54">
            <div>`;
      if (r && Fr.languages[r])
        try {
          const a = Fr.highlight(
            e,
            Fr.languages[r],
            r
          );
          u += `<pre class="prismjs _SyntaxHighlighter_1n4c0_18"><code class="language-${r}">${a}</code></pre>`;
        } catch {
        }
      else
        u += `<pre class="prismjs _SyntaxHighlighter_1n4c0_18"><code>${t.utils.escapeHtml(
          e
        )}</code></pre>`;
      return u += `</div>
         <div class="_CopyButtonContainer_1n4c0_8 _CodeCopy_1g6h2_72">
        <button type="button" class="_Button_1jdeq_1"
          data-color="secondary" data-variant="ghost" data-uniform="" data-size="md">
          <span class="_ButtonInner_1jdeq_4">
            <span class="block relative w-[var(--button-icon-size)] h-[var(--button-icon-size)]"
              data-transition-position="absolute"
              style="--tg-will-change: transform, opacity; --tg-enter-opacity: 1; --tg-enter-transform: scale(1); --tg-enter-filter: none; --tg-enter-duration: 300ms; --tg-enter-delay: 150ms; --tg-enter-timing-function: var(--cubic-enter); --tg-exit-opacity: 0; --tg-exit-transform: scale(0.6); --tg-exit-filter: none; --tg-exit-duration: 150ms; --tg-exit-delay: 0ms; --tg-exit-timing-function: var(--cubic-exit); --tg-initial-opacity: 0; --tg-initial-transform: scale(0.6); --tg-initial-filter: none;"><span
                class="_TransitionItem_1lpir_1 _TransitionGroupChild_1d6a5_1"><svg width="1em" height="1em"
                  viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12.7587 2H16.2413C17.0463 1.99999 17.7106 1.99998 18.2518 2.04419C18.8139 2.09012 19.3306 2.18868 19.816 2.43597C20.5686 2.81947 21.1805 3.43139 21.564 4.18404C21.8113 4.66937 21.9099 5.18608 21.9558 5.74817C22 6.28936 22 6.95372 22 7.75868V11.2413C22 12.0463 22 12.7106 21.9558 13.2518C21.9099 13.8139 21.8113 14.3306 21.564 14.816C21.1805 15.5686 20.5686 16.1805 19.816 16.564C19.3306 16.8113 18.8139 16.9099 18.2518 16.9558C17.8906 16.9853 17.4745 16.9951 16.9984 16.9984C16.9951 17.4745 16.9853 17.8906 16.9558 18.2518C16.9099 18.8139 16.8113 19.3306 16.564 19.816C16.1805 20.5686 15.5686 21.1805 14.816 21.564C14.3306 21.8113 13.8139 21.9099 13.2518 21.9558C12.7106 22 12.0463 22 11.2413 22H7.75868C6.95372 22 6.28936 22 5.74818 21.9558C5.18608 21.9099 4.66937 21.8113 4.18404 21.564C3.43139 21.1805 2.81947 20.5686 2.43597 19.816C2.18868 19.3306 2.09012 18.8139 2.04419 18.2518C1.99998 17.7106 1.99999 17.0463 2 16.2413V12.7587C1.99999 11.9537 1.99998 11.2894 2.04419 10.7482C2.09012 10.1861 2.18868 9.66937 2.43597 9.18404C2.81947 8.43139 3.43139 7.81947 4.18404 7.43598C4.66937 7.18868 5.18608 7.09012 5.74817 7.04419C6.10939 7.01468 6.52548 7.00487 7.00162 7.00162C7.00487 6.52548 7.01468 6.10939 7.04419 5.74817C7.09012 5.18608 7.18868 4.66937 7.43598 4.18404C7.81947 3.43139 8.43139 2.81947 9.18404 2.43597C9.66937 2.18868 10.1861 2.09012 10.7482 2.04419C11.2894 1.99998 11.9537 1.99999 12.7587 2ZM9.00176 7L11.2413 7C12.0463 6.99999 12.7106 6.99998 13.2518 7.04419C13.8139 7.09012 14.3306 7.18868 14.816 7.43598C15.5686 7.81947 16.1805 8.43139 16.564 9.18404C16.8113 9.66937 16.9099 10.1861 16.9558 10.7482C17 11.2894 17 11.9537 17 12.7587V14.9982C17.4455 14.9951 17.7954 14.9864 18.089 14.9624C18.5274 14.9266 18.7516 14.8617 18.908 14.782C19.2843 14.5903 19.5903 14.2843 19.782 13.908C19.8617 13.7516 19.9266 13.5274 19.9624 13.089C19.9992 12.6389 20 12.0566 20 11.2V7.8C20 6.94342 19.9992 6.36113 19.9624 5.91104C19.9266 5.47262 19.8617 5.24842 19.782 5.09202C19.5903 4.7157 19.2843 4.40973 18.908 4.21799C18.7516 4.1383 18.5274 4.07337 18.089 4.03755C17.6389 4.00078 17.0566 4 16.2 4H12.8C11.9434 4 11.3611 4.00078 10.911 4.03755C10.4726 4.07337 10.2484 4.1383 10.092 4.21799C9.7157 4.40973 9.40973 4.7157 9.21799 5.09202C9.1383 5.24842 9.07337 5.47262 9.03755 5.91104C9.01357 6.20463 9.00489 6.55447 9.00176 7ZM5.91104 9.03755C5.47262 9.07337 5.24842 9.1383 5.09202 9.21799C4.7157 9.40973 4.40973 9.7157 4.21799 10.092C4.1383 10.2484 4.07337 10.4726 4.03755 10.911C4.00078 11.3611 4 11.9434 4 12.8V16.2C4 17.0566 4.00078 17.6389 4.03755 18.089C4.07337 18.5274 4.1383 18.7516 4.21799 18.908C4.40973 19.2843 4.7157 19.5903 5.09202 19.782C5.24842 19.8617 5.47262 19.9266 5.91104 19.9624C6.36113 19.9992 6.94342 20 7.8 20H11.2C12.0566 20 12.6389 19.9992 13.089 19.9624C13.5274 19.9266 13.7516 19.8617 13.908 19.782C14.2843 19.5903 14.5903 19.2843 14.782 18.908C14.8617 18.7516 14.9266 18.5274 14.9624 18.089C14.9992 17.6389 15 17.0566 15 16.2V12.8C15 11.9434 14.9992 11.3611 14.9624 10.911C14.9266 10.4726 14.8617 10.2484 14.782 10.092C14.5903 9.7157 14.2843 9.40973 13.908 9.21799C13.7516 9.1383 13.5274 9.07337 13.089 9.03755C12.6389 9.00078 12.0566 9 11.2 9H7.8C6.94342 9 6.36113 9.00078 5.91104 9.03755Z"
                    fill="currentColor"></path>
                </svg></span></span></span></button>
              </div>
        </div></div>`, u;
    }
  }).use(r2).use(Yl);
  return t.renderer.rules.code_inline = (e, r) => {
    const u = e[r];
    return `<code class="_InlineCode_13a10_243">${t.utils.escapeHtml(u.content)}</code>`;
  }, t.renderer.rules.link_open = (e, r, u, a, n) => {
    const i = e[r];
    return i.attrSet("data-underline", ""), i.attrSet("target", "_blank"), i.attrSet("rel", "noopener noreferrer"), i.attrSet("class", "_TextLink_105xj_1"), n.renderToken(e, r, u);
  }, t;
})());
Ke(l0, "purifyConfig", {
  // 只允许必要的属性
  ADD_ATTR: [
    "target",
    "rel",
    "data-underline",
    "data-code",
    "data-color",
    "data-variant",
    "data-uniform",
    "data-size",
    "data-transition-position"
  ],
  ADD_TAGS: ["svg", "path"],
  // 不使用 ALLOW_DATA_ATTR: true，而是通过 ADD_ATTR 明确指定允许的 data 属性
  FORBID_TAGS: [
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "textarea"
  ],
  FORBID_ATTR: [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onfocus",
    "onblur"
  ]
});
Ke(l0, "katexCssContent", "");
l0 = T2([
  ai("markdown-widget")
], l0);
class F2 {
  // console.log('widget',widget)
  render(e, r) {
    return {
      tag: "markdown-widget",
      props: {
        // 传递内容给 Omi 组件
        value: e.value,
        // 传递streaming属性给 Omi 组件
        streaming: e.streaming || !1
      },
      style: {
        display: "block",
        width: "100%"
      }
    };
  }
}
function B2(t) {
  t.registerComponent("Markdown", new F2()), console.log("✓ Markdown adapter registered");
}
export {
  l0 as MarkdownWidget,
  B2 as registerMarkdownAdapter
};
