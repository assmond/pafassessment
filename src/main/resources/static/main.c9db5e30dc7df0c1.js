"use strict";
(self.webpackChunkclient = self.webpackChunkclient || []).push([[179], {
    939: () => {
        function Y(e) {
            return "function" == typeof e
        }

        function _r(e) {
            const n = e(r => {
                Error.call(r), r.stack = (new Error).stack
            });
            return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n
        }

        const yo = _r(e => function (n) {
            e(this), this.message = n ? `${n.length} errors occurred during unsubscription:\n${n.map((r, o) => `${o + 1}) ${r.toString()}`).join("\n  ")}` : "", this.name = "UnsubscriptionError", this.errors = n
        });

        function vr(e, t) {
            if (e) {
                const n = e.indexOf(t);
                0 <= n && e.splice(n, 1)
            }
        }

        class _t {
            constructor(t) {
                this.initialTeardown = t, this.closed = !1, this._parentage = null, this._finalizers = null
            }

            unsubscribe() {
                let t;
                if (!this.closed) {
                    this.closed = !0;
                    const {_parentage: n} = this;
                    if (n) if (this._parentage = null, Array.isArray(n)) for (const i of n) i.remove(this); else n.remove(this);
                    const {initialTeardown: r} = this;
                    if (Y(r)) try {
                        r()
                    } catch (i) {
                        t = i instanceof yo ? i.errors : [i]
                    }
                    const {_finalizers: o} = this;
                    if (o) {
                        this._finalizers = null;
                        for (const i of o) try {
                            tc(i)
                        } catch (s) {
                            t = null != t ? t : [], s instanceof yo ? t = [...t, ...s.errors] : t.push(s)
                        }
                    }
                    if (t) throw new yo(t)
                }
            }

            add(t) {
                var n;
                if (t && t !== this) if (this.closed) tc(t); else {
                    if (t instanceof _t) {
                        if (t.closed || t._hasParent(this)) return;
                        t._addParent(this)
                    }
                    (this._finalizers = null !== (n = this._finalizers) && void 0 !== n ? n : []).push(t)
                }
            }

            _hasParent(t) {
                const {_parentage: n} = this;
                return n === t || Array.isArray(n) && n.includes(t)
            }

            _addParent(t) {
                const {_parentage: n} = this;
                this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t
            }

            _removeParent(t) {
                const {_parentage: n} = this;
                n === t ? this._parentage = null : Array.isArray(n) && vr(n, t)
            }

            remove(t) {
                const {_finalizers: n} = this;
                n && vr(n, t), t instanceof _t && t._removeParent(this)
            }
        }

        _t.EMPTY = (() => {
            const e = new _t;
            return e.closed = !0, e
        })();
        const Xl = _t.EMPTY;

        function ec(e) {
            return e instanceof _t || e && "closed" in e && Y(e.remove) && Y(e.add) && Y(e.unsubscribe)
        }

        function tc(e) {
            Y(e) ? e() : e.unsubscribe()
        }

        const an = {
            onUnhandledError: null,
            onStoppedNotification: null,
            Promise: void 0,
            useDeprecatedSynchronousErrorHandling: !1,
            useDeprecatedNextContext: !1
        }, Do = {
            setTimeout(e, t, ...n) {
                const {delegate: r} = Do;
                return (null == r ? void 0 : r.setTimeout) ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
            }, clearTimeout(e) {
                const {delegate: t} = Do;
                return ((null == t ? void 0 : t.clearTimeout) || clearTimeout)(e)
            }, delegate: void 0
        };

        function nc(e) {
            Do.setTimeout(() => {
                const {onUnhandledError: t} = an;
                if (!t) throw e;
                t(e)
            })
        }

        function rc() {
        }

        const cD = cs("C", void 0, void 0);

        function cs(e, t, n) {
            return {kind: e, value: t, error: n}
        }

        let un = null;

        function _o(e) {
            if (an.useDeprecatedSynchronousErrorHandling) {
                const t = !un;
                if (t && (un = {errorThrown: !1, error: null}), e(), t) {
                    const {errorThrown: n, error: r} = un;
                    if (un = null, n) throw r
                }
            } else e()
        }

        class ds extends _t {
            constructor(t) {
                super(), this.isStopped = !1, t ? (this.destination = t, ec(t) && t.add(this)) : this.destination = yD
            }

            static create(t, n, r) {
                return new vo(t, n, r)
            }

            next(t) {
                this.isStopped ? hs(function fD(e) {
                    return cs("N", e, void 0)
                }(t), this) : this._next(t)
            }

            error(t) {
                this.isStopped ? hs(function dD(e) {
                    return cs("E", void 0, e)
                }(t), this) : (this.isStopped = !0, this._error(t))
            }

            complete() {
                this.isStopped ? hs(cD, this) : (this.isStopped = !0, this._complete())
            }

            unsubscribe() {
                this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null)
            }

            _next(t) {
                this.destination.next(t)
            }

            _error(t) {
                try {
                    this.destination.error(t)
                } finally {
                    this.unsubscribe()
                }
            }

            _complete() {
                try {
                    this.destination.complete()
                } finally {
                    this.unsubscribe()
                }
            }
        }

        const pD = Function.prototype.bind;

        function fs(e, t) {
            return pD.call(e, t)
        }

        class gD {
            constructor(t) {
                this.partialObserver = t
            }

            next(t) {
                const {partialObserver: n} = this;
                if (n.next) try {
                    n.next(t)
                } catch (r) {
                    Co(r)
                }
            }

            error(t) {
                const {partialObserver: n} = this;
                if (n.error) try {
                    n.error(t)
                } catch (r) {
                    Co(r)
                } else Co(t)
            }

            complete() {
                const {partialObserver: t} = this;
                if (t.complete) try {
                    t.complete()
                } catch (n) {
                    Co(n)
                }
            }
        }

        class vo extends ds {
            constructor(t, n, r) {
                let o;
                if (super(), Y(t) || !t) o = {
                    next: null != t ? t : void 0,
                    error: null != n ? n : void 0,
                    complete: null != r ? r : void 0
                }; else {
                    let i;
                    this && an.useDeprecatedNextContext ? (i = Object.create(t), i.unsubscribe = () => this.unsubscribe(), o = {
                        next: t.next && fs(t.next, i),
                        error: t.error && fs(t.error, i),
                        complete: t.complete && fs(t.complete, i)
                    }) : o = t
                }
                this.destination = new gD(o)
            }
        }

        function Co(e) {
            an.useDeprecatedSynchronousErrorHandling ? function hD(e) {
                an.useDeprecatedSynchronousErrorHandling && un && (un.errorThrown = !0, un.error = e)
            }(e) : nc(e)
        }

        function hs(e, t) {
            const {onStoppedNotification: n} = an;
            n && Do.setTimeout(() => n(e, t))
        }

        const yD = {
            closed: !0, next: rc, error: function mD(e) {
                throw e
            }, complete: rc
        }, ps = "function" == typeof Symbol && Symbol.observable || "@@observable";

        function oc(e) {
            return e
        }

        let _e = (() => {
            class e {
                constructor(n) {
                    n && (this._subscribe = n)
                }

                lift(n) {
                    const r = new e;
                    return r.source = this, r.operator = n, r
                }

                subscribe(n, r, o) {
                    const i = function _D(e) {
                        return e && e instanceof ds || function DD(e) {
                            return e && Y(e.next) && Y(e.error) && Y(e.complete)
                        }(e) && ec(e)
                    }(n) ? n : new vo(n, r, o);
                    return _o(() => {
                        const {operator: s, source: a} = this;
                        i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i))
                    }), i
                }

                _trySubscribe(n) {
                    try {
                        return this._subscribe(n)
                    } catch (r) {
                        n.error(r)
                    }
                }

                forEach(n, r) {
                    return new (r = sc(r))((o, i) => {
                        const s = new vo({
                            next: a => {
                                try {
                                    n(a)
                                } catch (u) {
                                    i(u), s.unsubscribe()
                                }
                            }, error: i, complete: o
                        });
                        this.subscribe(s)
                    })
                }

                _subscribe(n) {
                    var r;
                    return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(n)
                }

                [ps]() {
                    return this
                }

                pipe(...n) {
                    return function ic(e) {
                        return 0 === e.length ? oc : 1 === e.length ? e[0] : function (n) {
                            return e.reduce((r, o) => o(r), n)
                        }
                    }(n)(this)
                }

                toPromise(n) {
                    return new (n = sc(n))((r, o) => {
                        let i;
                        this.subscribe(s => i = s, s => o(s), () => r(i))
                    })
                }
            }

            return e.create = t => new e(t), e
        })();

        function sc(e) {
            var t;
            return null !== (t = null != e ? e : an.Promise) && void 0 !== t ? t : Promise
        }

        const vD = _r(e => function () {
            e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"
        });
        let gs = (() => {
            class e extends _e {
                constructor() {
                    super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null
                }

                lift(n) {
                    const r = new ac(this, this);
                    return r.operator = n, r
                }

                _throwIfClosed() {
                    if (this.closed) throw new vD
                }

                next(n) {
                    _o(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.currentObservers || (this.currentObservers = Array.from(this.observers));
                            for (const r of this.currentObservers) r.next(n)
                        }
                    })
                }

                error(n) {
                    _o(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.hasError = this.isStopped = !0, this.thrownError = n;
                            const {observers: r} = this;
                            for (; r.length;) r.shift().error(n)
                        }
                    })
                }

                complete() {
                    _o(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.isStopped = !0;
                            const {observers: n} = this;
                            for (; n.length;) n.shift().complete()
                        }
                    })
                }

                unsubscribe() {
                    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null
                }

                get observed() {
                    var n;
                    return (null === (n = this.observers) || void 0 === n ? void 0 : n.length) > 0
                }

                _trySubscribe(n) {
                    return this._throwIfClosed(), super._trySubscribe(n)
                }

                _subscribe(n) {
                    return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n)
                }

                _innerSubscribe(n) {
                    const {hasError: r, isStopped: o, observers: i} = this;
                    return r || o ? Xl : (this.currentObservers = null, i.push(n), new _t(() => {
                        this.currentObservers = null, vr(i, n)
                    }))
                }

                _checkFinalizedStatuses(n) {
                    const {hasError: r, thrownError: o, isStopped: i} = this;
                    r ? n.error(o) : i && n.complete()
                }

                asObservable() {
                    const n = new _e;
                    return n.source = this, n
                }
            }

            return e.create = (t, n) => new ac(t, n), e
        })();

        class ac extends gs {
            constructor(t, n) {
                super(), this.destination = t, this.source = n
            }

            next(t) {
                var n, r;
                null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.next) || void 0 === r || r.call(n, t)
            }

            error(t) {
                var n, r;
                null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.error) || void 0 === r || r.call(n, t)
            }

            complete() {
                var t, n;
                null === (n = null === (t = this.destination) || void 0 === t ? void 0 : t.complete) || void 0 === n || n.call(t)
            }

            _subscribe(t) {
                var n, r;
                return null !== (r = null === (n = this.source) || void 0 === n ? void 0 : n.subscribe(t)) && void 0 !== r ? r : Xl
            }
        }

        function ln(e) {
            return t => {
                if (function CD(e) {
                    return Y(null == e ? void 0 : e.lift)
                }(t)) return t.lift(function (n) {
                    try {
                        return e(n, this)
                    } catch (r) {
                        this.error(r)
                    }
                });
                throw new TypeError("Unable to lift unknown Observable type")
            }
        }

        function cn(e, t, n, r, o) {
            return new ED(e, t, n, r, o)
        }

        class ED extends ds {
            constructor(t, n, r, o, i, s) {
                super(t), this.onFinalize = i, this.shouldUnsubscribe = s, this._next = n ? function (a) {
                    try {
                        n(a)
                    } catch (u) {
                        t.error(u)
                    }
                } : super._next, this._error = o ? function (a) {
                    try {
                        o(a)
                    } catch (u) {
                        t.error(u)
                    } finally {
                        this.unsubscribe()
                    }
                } : super._error, this._complete = r ? function () {
                    try {
                        r()
                    } catch (a) {
                        t.error(a)
                    } finally {
                        this.unsubscribe()
                    }
                } : super._complete
            }

            unsubscribe() {
                var t;
                if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                    const {closed: n} = this;
                    super.unsubscribe(), !n && (null === (t = this.onFinalize) || void 0 === t || t.call(this))
                }
            }
        }

        function dn(e, t) {
            return ln((n, r) => {
                let o = 0;
                n.subscribe(cn(r, i => {
                    r.next(e.call(t, i, o++))
                }))
            })
        }

        function fn(e) {
            return this instanceof fn ? (this.v = e, this) : new fn(e)
        }

        function MD(e, t, n) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var o, r = n.apply(e, t || []), i = [];
            return o = {}, s("next"), s("throw"), s("return"), o[Symbol.asyncIterator] = function () {
                return this
            }, o;

            function s(f) {
                r[f] && (o[f] = function (h) {
                    return new Promise(function (p, m) {
                        i.push([f, h, p, m]) > 1 || a(f, h)
                    })
                })
            }

            function a(f, h) {
                try {
                    !function u(f) {
                        f.value instanceof fn ? Promise.resolve(f.value.v).then(l, c) : d(i[0][2], f)
                    }(r[f](h))
                } catch (p) {
                    d(i[0][3], p)
                }
            }

            function l(f) {
                a("next", f)
            }

            function c(f) {
                a("throw", f)
            }

            function d(f, h) {
                f(h), i.shift(), i.length && a(i[0][0], i[0][1])
            }
        }

        function AD(e) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var n, t = e[Symbol.asyncIterator];
            return t ? t.call(e) : (e = function cc(e) {
                var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], r = 0;
                if (n) return n.call(e);
                if (e && "number" == typeof e.length) return {
                    next: function () {
                        return e && r >= e.length && (e = void 0), {value: e && e[r++], done: !e}
                    }
                };
                throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
            }(e), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function () {
                return this
            }, n);

            function r(i) {
                n[i] = e[i] && function (s) {
                    return new Promise(function (a, u) {
                        !function o(i, s, a, u) {
                            Promise.resolve(u).then(function (l) {
                                i({value: l, done: a})
                            }, s)
                        }(a, u, (s = e[i](s)).done, s.value)
                    })
                }
            }
        }

        const dc = e => e && "number" == typeof e.length && "function" != typeof e;

        function fc(e) {
            return Y(null == e ? void 0 : e.then)
        }

        function hc(e) {
            return Y(e[ps])
        }

        function pc(e) {
            return Symbol.asyncIterator && Y(null == e ? void 0 : e[Symbol.asyncIterator])
        }

        function gc(e) {
            return new TypeError(`You provided ${null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
        }

        const mc = function TD() {
            return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator"
        }();

        function yc(e) {
            return Y(null == e ? void 0 : e[mc])
        }

        function Dc(e) {
            return MD(this, arguments, function* () {
                const n = e.getReader();
                try {
                    for (; ;) {
                        const {value: r, done: o} = yield fn(n.read());
                        if (o) return yield fn(void 0);
                        yield yield fn(r)
                    }
                } finally {
                    n.releaseLock()
                }
            })
        }

        function _c(e) {
            return Y(null == e ? void 0 : e.getReader)
        }

        function hn(e) {
            if (e instanceof _e) return e;
            if (null != e) {
                if (hc(e)) return function SD(e) {
                    return new _e(t => {
                        const n = e[ps]();
                        if (Y(n.subscribe)) return n.subscribe(t);
                        throw new TypeError("Provided object does not correctly implement Symbol.observable")
                    })
                }(e);
                if (dc(e)) return function FD(e) {
                    return new _e(t => {
                        for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                        t.complete()
                    })
                }(e);
                if (fc(e)) return function ND(e) {
                    return new _e(t => {
                        e.then(n => {
                            t.closed || (t.next(n), t.complete())
                        }, n => t.error(n)).then(null, nc)
                    })
                }(e);
                if (pc(e)) return vc(e);
                if (yc(e)) return function xD(e) {
                    return new _e(t => {
                        for (const n of e) if (t.next(n), t.closed) return;
                        t.complete()
                    })
                }(e);
                if (_c(e)) return function PD(e) {
                    return vc(Dc(e))
                }(e)
            }
            throw gc(e)
        }

        function vc(e) {
            return new _e(t => {
                (function OD(e, t) {
                    var n, r, o, i;
                    return function wD(e, t, n, r) {
                        return new (n || (n = Promise))(function (i, s) {
                            function a(c) {
                                try {
                                    l(r.next(c))
                                } catch (d) {
                                    s(d)
                                }
                            }

                            function u(c) {
                                try {
                                    l(r.throw(c))
                                } catch (d) {
                                    s(d)
                                }
                            }

                            function l(c) {
                                c.done ? i(c.value) : function o(i) {
                                    return i instanceof n ? i : new n(function (s) {
                                        s(i)
                                    })
                                }(c.value).then(a, u)
                            }

                            l((r = r.apply(e, t || [])).next())
                        })
                    }(this, void 0, void 0, function* () {
                        try {
                            for (n = AD(e); !(r = yield n.next()).done;) if (t.next(r.value), t.closed) return
                        } catch (s) {
                            o = {error: s}
                        } finally {
                            try {
                                r && !r.done && (i = n.return) && (yield i.call(n))
                            } finally {
                                if (o) throw o.error
                            }
                        }
                        t.complete()
                    })
                })(e, t).catch(n => t.error(n))
            })
        }

        function Gt(e, t, n, r = 0, o = !1) {
            const i = t.schedule(function () {
                n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe()
            }, r);
            if (e.add(i), !o) return i
        }

        function Eo(e, t, n = 1 / 0) {
            return Y(t) ? Eo((r, o) => dn((i, s) => t(r, i, o, s))(hn(e(r, o))), n) : ("number" == typeof t && (n = t), ln((r, o) => function RD(e, t, n, r, o, i, s, a) {
                const u = [];
                let l = 0, c = 0, d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete()
                }, h = m => l < r ? p(m) : u.push(m), p = m => {
                    i && t.next(m), l++;
                    let _ = !1;
                    hn(n(m, c++)).subscribe(cn(t, D => {
                        null == o || o(D), i ? h(D) : t.next(D)
                    }, () => {
                        _ = !0
                    }, void 0, () => {
                        if (_) try {
                            for (l--; u.length && l < r;) {
                                const D = u.shift();
                                s ? Gt(t, s, () => p(D)) : p(D)
                            }
                            f()
                        } catch (D) {
                            t.error(D)
                        }
                    }))
                };
                return e.subscribe(cn(t, h, () => {
                    d = !0, f()
                })), () => {
                    null == a || a()
                }
            }(r, o, e, n)))
        }

        const ys = new _e(e => e.complete());

        function Ds(e) {
            return e[e.length - 1]
        }

        function Cc(e) {
            return function LD(e) {
                return e && Y(e.schedule)
            }(Ds(e)) ? e.pop() : void 0
        }

        function Ec(e, t = 0) {
            return ln((n, r) => {
                n.subscribe(cn(r, o => Gt(r, e, () => r.next(o), t), () => Gt(r, e, () => r.complete(), t), o => Gt(r, e, () => r.error(o), t)))
            })
        }

        function wc(e, t = 0) {
            return ln((n, r) => {
                r.add(e.schedule(() => n.subscribe(r), t))
            })
        }

        function bc(e, t) {
            if (!e) throw new Error("Iterable cannot be null");
            return new _e(n => {
                Gt(n, t, () => {
                    const r = e[Symbol.asyncIterator]();
                    Gt(n, t, () => {
                        r.next().then(o => {
                            o.done ? n.complete() : n.next(o.value)
                        })
                    }, 0, !0)
                })
            })
        }

        function wo(e, t) {
            return t ? function zD(e, t) {
                if (null != e) {
                    if (hc(e)) return function jD(e, t) {
                        return hn(e).pipe(wc(t), Ec(t))
                    }(e, t);
                    if (dc(e)) return function UD(e, t) {
                        return new _e(n => {
                            let r = 0;
                            return t.schedule(function () {
                                r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule())
                            })
                        })
                    }(e, t);
                    if (fc(e)) return function $D(e, t) {
                        return hn(e).pipe(wc(t), Ec(t))
                    }(e, t);
                    if (pc(e)) return bc(e, t);
                    if (yc(e)) return function GD(e, t) {
                        return new _e(n => {
                            let r;
                            return Gt(n, t, () => {
                                r = e[mc](), Gt(n, t, () => {
                                    let o, i;
                                    try {
                                        ({value: o, done: i} = r.next())
                                    } catch (s) {
                                        return void n.error(s)
                                    }
                                    i ? n.complete() : n.next(o)
                                }, 0, !0)
                            }), () => Y(null == r ? void 0 : r.return) && r.return()
                        })
                    }(e, t);
                    if (_c(e)) return function qD(e, t) {
                        return bc(Dc(e), t)
                    }(e, t)
                }
                throw gc(e)
            }(e, t) : hn(e)
        }

        function _s(e, t, ...n) {
            return !0 === t ? (e(), null) : !1 === t ? null : t(...n).pipe(function QD(e) {
                return e <= 0 ? () => ys : ln((t, n) => {
                    let r = 0;
                    t.subscribe(cn(n, o => {
                        ++r <= e && (n.next(o), e <= r && n.complete())
                    }))
                })
            }(1)).subscribe(() => e())
        }

        function z(e) {
            for (let t in e) if (e[t] === z) return t;
            throw Error("Could not find renamed property on target object.")
        }

        function vs(e, t) {
            for (const n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n])
        }

        function U(e) {
            if ("string" == typeof e) return e;
            if (Array.isArray(e)) return "[" + e.map(U).join(", ") + "]";
            if (null == e) return "" + e;
            if (e.overriddenName) return `${e.overriddenName}`;
            if (e.name) return `${e.name}`;
            const t = e.toString();
            if (null == t) return "" + t;
            const n = t.indexOf("\n");
            return -1 === n ? t : t.substring(0, n)
        }

        function Cs(e, t) {
            return null == e || "" === e ? null === t ? "" : t : null == t || "" === t ? e : e + " " + t
        }

        const KD = z({__forward_ref__: z});

        function Q(e) {
            return e.__forward_ref__ = Q, e.toString = function () {
                return U(this())
            }, e
        }

        function x(e) {
            return Mc(e) ? e() : e
        }

        function Mc(e) {
            return "function" == typeof e && e.hasOwnProperty(KD) && e.__forward_ref__ === Q
        }

        class B extends Error {
            constructor(t, n) {
                super(function Es(e, t) {
                    return `NG0${Math.abs(e)}${t ? ": " + t : ""}`
                }(t, n)), this.code = t
            }
        }

        function Ie(e) {
            return "function" == typeof e ? e.name || e.toString() : "object" == typeof e && null != e && "function" == typeof e.type ? e.type.name || e.type.toString() : function I(e) {
                return "string" == typeof e ? e : null == e ? "" : String(e)
            }(e)
        }

        function bo(e, t) {
            const n = t ? ` in ${t}` : "";
            throw new B(-201, `No provider for ${Ie(e)} found${n}`)
        }

        function He(e, t) {
            null == e && function J(e, t, n, r) {
                throw new Error(`ASSERTION ERROR: ${e}` + (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`))
            }(t, e, null, "!=")
        }

        function $(e) {
            return {token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0}
        }

        function Ze(e) {
            return {providers: e.providers || [], imports: e.imports || []}
        }

        function ws(e) {
            return Ac(e, Mo) || Ac(e, Tc)
        }

        function Ac(e, t) {
            return e.hasOwnProperty(t) ? e[t] : null
        }

        function Ic(e) {
            return e && (e.hasOwnProperty(bs) || e.hasOwnProperty(r_)) ? e[bs] : null
        }

        const Mo = z({\u0275prov: z}), bs = z({\u0275inj: z}), Tc = z({ngInjectableDef: z}), r_ = z({ngInjectorDef: z});
        var F = (() => ((F = F || {})[F.Default = 0] = "Default", F[F.Host = 1] = "Host", F[F.Self = 2] = "Self", F[F.SkipSelf = 4] = "SkipSelf", F[F.Optional = 8] = "Optional", F))();
        let Ms;

        function qt(e) {
            const t = Ms;
            return Ms = e, t
        }

        function Sc(e, t, n) {
            const r = ws(e);
            return r && "root" == r.providedIn ? void 0 === r.value ? r.value = r.factory() : r.value : n & F.Optional ? null : void 0 !== t ? t : void bo(U(e), "Injector")
        }

        function zt(e) {
            return {toString: e}.toString()
        }

        var ot = (() => ((ot = ot || {})[ot.OnPush = 0] = "OnPush", ot[ot.Default = 1] = "Default", ot))(),
            vt = (() => {
                return (e = vt || (vt = {}))[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", vt;
                var e
            })();
        const i_ = "undefined" != typeof globalThis && globalThis, s_ = "undefined" != typeof window && window,
            a_ = "undefined" != typeof self && "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && self,
            q = i_ || "undefined" != typeof global && global || s_ || a_, Tn = {}, W = [], Ao = z({\u0275cmp: z}),
            As = z({\u0275dir: z}), Is = z({\u0275pipe: z}), Fc = z({\u0275mod: z}), Ot = z({\u0275fac: z}),
            Cr = z({__NG_ELEMENT_ID__: z});
        let u_ = 0;

        function Ts(e) {
            return zt(() => {
                const n = {}, r = {
                    type: e.type,
                    providersResolver: null,
                    decls: e.decls,
                    vars: e.vars,
                    factory: null,
                    template: e.template || null,
                    consts: e.consts || null,
                    ngContentSelectors: e.ngContentSelectors,
                    hostBindings: e.hostBindings || null,
                    hostVars: e.hostVars || 0,
                    hostAttrs: e.hostAttrs || null,
                    contentQueries: e.contentQueries || null,
                    declaredInputs: n,
                    inputs: null,
                    outputs: null,
                    exportAs: e.exportAs || null,
                    onPush: e.changeDetection === ot.OnPush,
                    directiveDefs: null,
                    pipeDefs: null,
                    selectors: e.selectors || W,
                    viewQuery: e.viewQuery || null,
                    features: e.features || null,
                    data: e.data || {},
                    encapsulation: e.encapsulation || vt.Emulated,
                    id: "c",
                    styles: e.styles || W,
                    _: null,
                    setInput: null,
                    schemas: e.schemas || null,
                    tView: null
                }, o = e.directives, i = e.features, s = e.pipes;
                return r.id += u_++, r.inputs = Oc(e.inputs, n), r.outputs = Oc(e.outputs), i && i.forEach(a => a(r)), r.directiveDefs = o ? () => ("function" == typeof o ? o() : o).map(Nc) : null, r.pipeDefs = s ? () => ("function" == typeof s ? s() : s).map(xc) : null, r
            })
        }

        function Nc(e) {
            return ve(e) || function Wt(e) {
                return e[As] || null
            }(e)
        }

        function xc(e) {
            return function pn(e) {
                return e[Is] || null
            }(e)
        }

        const Pc = {};

        function it(e) {
            return zt(() => {
                const t = {
                    type: e.type,
                    bootstrap: e.bootstrap || W,
                    declarations: e.declarations || W,
                    imports: e.imports || W,
                    exports: e.exports || W,
                    transitiveCompileScopes: null,
                    schemas: e.schemas || null,
                    id: e.id || null
                };
                return null != e.id && (Pc[e.id] = e.type), t
            })
        }

        function Oc(e, t) {
            if (null == e) return Tn;
            const n = {};
            for (const r in e) if (e.hasOwnProperty(r)) {
                let o = e[r], i = o;
                Array.isArray(o) && (i = o[1], o = o[0]), n[o] = r, t && (t[o] = i)
            }
            return n
        }

        const T = Ts;

        function ve(e) {
            return e[Ao] || null
        }

        function Ke(e, t) {
            const n = e[Fc] || null;
            if (!n && !0 === t) throw new Error(`Type ${U(e)} does not have '\u0275mod' property.`);
            return n
        }

        const P = 11, Z = 20;

        function Ct(e) {
            return Array.isArray(e) && "object" == typeof e[1]
        }

        function at(e) {
            return Array.isArray(e) && !0 === e[1]
        }

        function Ns(e) {
            return 0 != (8 & e.flags)
        }

        function Fo(e) {
            return 2 == (2 & e.flags)
        }

        function No(e) {
            return 1 == (1 & e.flags)
        }

        function ut(e) {
            return null !== e.template
        }

        function p_(e) {
            return 0 != (512 & e[2])
        }

        function Dn(e, t) {
            return e.hasOwnProperty(Ot) ? e[Ot] : null
        }

        class y_ {
            constructor(t, n, r) {
                this.previousValue = t, this.currentValue = n, this.firstChange = r
            }

            isFirstChange() {
                return this.firstChange
            }
        }

        function Rt() {
            return Vc
        }

        function Vc(e) {
            return e.type.prototype.ngOnChanges && (e.setInput = __), D_
        }

        function D_() {
            const e = Lc(this), t = null == e ? void 0 : e.current;
            if (t) {
                const n = e.previous;
                if (n === Tn) e.previous = t; else for (let r in t) n[r] = t[r];
                e.current = null, this.ngOnChanges(t)
            }
        }

        function __(e, t, n, r) {
            const o = Lc(e) || function v_(e, t) {
                    return e[kc] = t
                }(e, {previous: Tn, current: null}), i = o.current || (o.current = {}), s = o.previous,
                a = this.declaredInputs[n], u = s[a];
            i[a] = new y_(u && u.currentValue, t, s === Tn), e[r] = t
        }

        Rt.ngInherit = !0;
        const kc = "__ngSimpleChanges__";

        function Lc(e) {
            return e[kc] || null
        }

        let Vs;

        function ne(e) {
            return !!e.listen
        }

        const Bc = {
            createRenderer: (e, t) => function ks() {
                return void 0 !== Vs ? Vs : "undefined" != typeof document ? document : void 0
            }()
        };

        function ue(e) {
            for (; Array.isArray(e);) e = e[0];
            return e
        }

        function Xe(e, t) {
            return ue(t[e.index])
        }

        function Ls(e, t) {
            return e.data[t]
        }

        function $e(e, t) {
            const n = t[e];
            return Ct(n) ? n : n[0]
        }

        function Bs(e) {
            return 128 == (128 & e[2])
        }

        function Qt(e, t) {
            return null == t ? null : e[t]
        }

        function jc(e) {
            e[18] = 0
        }

        function Hs(e, t) {
            e[5] += t;
            let n = e, r = e[3];
            for (; null !== r && (1 === t && 1 === n[5] || -1 === t && 0 === n[5]);) r[5] += t, n = r, r = r[3]
        }

        const A = {lFrame: Kc(null), bindingsEnabled: !0, isInCheckNoChangesMode: !1};

        function $c() {
            return A.bindingsEnabled
        }

        function y() {
            return A.lFrame.lView
        }

        function H() {
            return A.lFrame.tView
        }

        function he() {
            let e = Gc();
            for (; null !== e && 64 === e.type;) e = e.parent;
            return e
        }

        function Gc() {
            return A.lFrame.currentTNode
        }

        function Et(e, t) {
            const n = A.lFrame;
            n.currentTNode = e, n.isParent = t
        }

        function js() {
            return A.lFrame.isParent
        }

        function Po() {
            return A.isInCheckNoChangesMode
        }

        function Oo(e) {
            A.isInCheckNoChangesMode = e
        }

        function k_(e, t) {
            const n = A.lFrame;
            n.bindingIndex = n.bindingRootIndex = e, Us(t)
        }

        function Us(e) {
            A.lFrame.currentDirectiveIndex = e
        }

        function qs(e) {
            A.lFrame.currentQueryIndex = e
        }

        function B_(e) {
            const t = e[1];
            return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null
        }

        function Qc(e, t, n) {
            if (n & F.SkipSelf) {
                let o = t, i = e;
                for (; !(o = o.parent, null !== o || n & F.Host || (o = B_(i), null === o || (i = i[15], 10 & o.type)));) ;
                if (null === o) return !1;
                t = o, e = i
            }
            const r = A.lFrame = Zc();
            return r.currentTNode = t, r.lView = e, !0
        }

        function Ro(e) {
            const t = Zc(), n = e[1];
            A.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = !1
        }

        function Zc() {
            const e = A.lFrame, t = null === e ? null : e.child;
            return null === t ? Kc(e) : t
        }

        function Kc(e) {
            const t = {
                currentTNode: null,
                isParent: !0,
                lView: null,
                tView: null,
                selectedIndex: -1,
                contextLView: null,
                elementDepthCount: 0,
                currentNamespace: null,
                currentDirectiveIndex: -1,
                bindingRootIndex: -1,
                bindingIndex: -1,
                currentQueryIndex: 0,
                parent: e,
                child: null,
                inI18n: !1
            };
            return null !== e && (e.child = t), t
        }

        function Jc() {
            const e = A.lFrame;
            return A.lFrame = e.parent, e.currentTNode = null, e.lView = null, e
        }

        const Yc = Jc;

        function Vo() {
            const e = Jc();
            e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0
        }

        function Se() {
            return A.lFrame.selectedIndex
        }

        function Zt(e) {
            A.lFrame.selectedIndex = e
        }

        function ko(e, t) {
            for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
                const i = e.data[n].type.prototype, {
                    ngAfterContentInit: s,
                    ngAfterContentChecked: a,
                    ngAfterViewInit: u,
                    ngAfterViewChecked: l,
                    ngOnDestroy: c
                } = i;
                s && (e.contentHooks || (e.contentHooks = [])).push(-n, s), a && ((e.contentHooks || (e.contentHooks = [])).push(n, a), (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)), u && (e.viewHooks || (e.viewHooks = [])).push(-n, u), l && ((e.viewHooks || (e.viewHooks = [])).push(n, l), (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, l)), null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c)
            }
        }

        function Lo(e, t, n) {
            Xc(e, t, 3, n)
        }

        function Bo(e, t, n, r) {
            (3 & e[2]) === n && Xc(e, t, n, r)
        }

        function zs(e, t) {
            let n = e[2];
            (3 & n) === t && (n &= 2047, n += 1, e[2] = n)
        }

        function Xc(e, t, n, r) {
            const i = null != r ? r : -1, s = t.length - 1;
            let a = 0;
            for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++) if ("number" == typeof t[u + 1]) {
                if (a = t[u], null != r && a >= r) break
            } else t[u] < 0 && (e[18] += 65536), (a < i || -1 == i) && (Q_(e, n, t, u), e[18] = (4294901760 & e[18]) + u + 2), u++
        }

        function Q_(e, t, n, r) {
            const o = n[r] < 0, i = n[r + 1], a = e[o ? -n[r] : n[r]];
            if (o) {
                if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
                    e[2] += 2048;
                    try {
                        i.call(a)
                    } finally {
                    }
                }
            } else try {
                i.call(a)
            } finally {
            }
        }

        class Ar {
            constructor(t, n, r) {
                this.factory = t, this.resolving = !1, this.canSeeViewProviders = n, this.injectImpl = r
            }
        }

        function Ho(e, t, n) {
            const r = ne(e);
            let o = 0;
            for (; o < n.length;) {
                const i = n[o];
                if ("number" == typeof i) {
                    if (0 !== i) break;
                    o++;
                    const s = n[o++], a = n[o++], u = n[o++];
                    r ? e.setAttribute(t, a, u, s) : t.setAttributeNS(s, a, u)
                } else {
                    const s = i, a = n[++o];
                    Qs(s) ? r && e.setProperty(t, s, a) : r ? e.setAttribute(t, s, a) : t.setAttribute(s, a), o++
                }
            }
            return o
        }

        function ed(e) {
            return 3 === e || 4 === e || 6 === e
        }

        function Qs(e) {
            return 64 === e.charCodeAt(0)
        }

        function jo(e, t) {
            if (null !== t && 0 !== t.length) if (null === e || 0 === e.length) e = t.slice(); else {
                let n = -1;
                for (let r = 0; r < t.length; r++) {
                    const o = t[r];
                    "number" == typeof o ? n = o : 0 === n || td(e, n, o, null, -1 === n || 2 === n ? t[++r] : null)
                }
            }
            return e
        }

        function td(e, t, n, r, o) {
            let i = 0, s = e.length;
            if (-1 === t) s = -1; else for (; i < e.length;) {
                const a = e[i++];
                if ("number" == typeof a) {
                    if (a === t) {
                        s = -1;
                        break
                    }
                    if (a > t) {
                        s = i - 1;
                        break
                    }
                }
            }
            for (; i < e.length;) {
                const a = e[i];
                if ("number" == typeof a) break;
                if (a === n) {
                    if (null === r) return void (null !== o && (e[i + 1] = o));
                    if (r === e[i + 1]) return void (e[i + 2] = o)
                }
                i++, null !== r && i++, null !== o && i++
            }
            -1 !== s && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), null !== r && e.splice(i++, 0, r), null !== o && e.splice(i++, 0, o)
        }

        function nd(e) {
            return -1 !== e
        }

        function Rn(e) {
            return 32767 & e
        }

        function Vn(e, t) {
            let n = function X_(e) {
                return e >> 16
            }(e), r = t;
            for (; n > 0;) r = r[15], n--;
            return r
        }

        let Zs = !0;

        function $o(e) {
            const t = Zs;
            return Zs = e, t
        }

        let ev = 0;

        function Tr(e, t) {
            const n = Js(e, t);
            if (-1 !== n) return n;
            const r = t[1];
            r.firstCreatePass && (e.injectorIndex = t.length, Ks(r.data, e), Ks(t, null), Ks(r.blueprint, null));
            const o = Uo(e, t), i = e.injectorIndex;
            if (nd(o)) {
                const s = Rn(o), a = Vn(o, t), u = a[1].data;
                for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l]
            }
            return t[i + 8] = o, i
        }

        function Ks(e, t) {
            e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
        }

        function Js(e, t) {
            return -1 === e.injectorIndex || e.parent && e.parent.injectorIndex === e.injectorIndex || null === t[e.injectorIndex + 8] ? -1 : e.injectorIndex
        }

        function Uo(e, t) {
            if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
            let n = 0, r = null, o = t;
            for (; null !== o;) {
                const i = o[1], s = i.type;
                if (r = 2 === s ? i.declTNode : 1 === s ? o[6] : null, null === r) return -1;
                if (n++, o = o[15], -1 !== r.injectorIndex) return r.injectorIndex | n << 16
            }
            return -1
        }

        function Go(e, t, n) {
            !function tv(e, t, n) {
                let r;
                "string" == typeof n ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(Cr) && (r = n[Cr]), null == r && (r = n[Cr] = ev++);
                const o = 255 & r;
                t.data[e + (o >> 5)] |= 1 << o
            }(e, t, n)
        }

        function id(e, t, n) {
            if (n & F.Optional) return e;
            bo(t, "NodeInjector")
        }

        function sd(e, t, n, r) {
            if (n & F.Optional && void 0 === r && (r = null), 0 == (n & (F.Self | F.Host))) {
                const o = e[9], i = qt(void 0);
                try {
                    return o ? o.get(t, r, n & F.Optional) : Sc(t, r, n & F.Optional)
                } finally {
                    qt(i)
                }
            }
            return id(r, t, n)
        }

        function ad(e, t, n, r = F.Default, o) {
            if (null !== e) {
                const i = function iv(e) {
                    if ("string" == typeof e) return e.charCodeAt(0) || 0;
                    const t = e.hasOwnProperty(Cr) ? e[Cr] : void 0;
                    return "number" == typeof t ? t >= 0 ? 255 & t : rv : t
                }(n);
                if ("function" == typeof i) {
                    if (!Qc(t, e, r)) return r & F.Host ? id(o, n, r) : sd(t, n, r, o);
                    try {
                        const s = i(r);
                        if (null != s || r & F.Optional) return s;
                        bo(n)
                    } finally {
                        Yc()
                    }
                } else if ("number" == typeof i) {
                    let s = null, a = Js(e, t), u = -1, l = r & F.Host ? t[16][6] : null;
                    for ((-1 === a || r & F.SkipSelf) && (u = -1 === a ? Uo(e, t) : t[a + 8], -1 !== u && cd(r, !1) ? (s = t[1], a = Rn(u), t = Vn(u, t)) : a = -1); -1 !== a;) {
                        const c = t[1];
                        if (ld(i, a, c.data)) {
                            const d = ov(a, t, n, s, r, l);
                            if (d !== ud) return d
                        }
                        u = t[a + 8], -1 !== u && cd(r, t[1].data[a + 8] === l) && ld(i, a, t) ? (s = c, a = Rn(u), t = Vn(u, t)) : a = -1
                    }
                }
            }
            return sd(t, n, r, o)
        }

        const ud = {};

        function rv() {
            return new kn(he(), y())
        }

        function ov(e, t, n, r, o, i) {
            const s = t[1], a = s.data[e + 8], c = function qo(e, t, n, r, o) {
                const i = e.providerIndexes, s = t.data, a = 1048575 & i, u = e.directiveStart, c = i >> 20,
                    f = o ? a + c : e.directiveEnd;
                for (let h = r ? a : a + c; h < f; h++) {
                    const p = s[h];
                    if (h < u && n === p || h >= u && p.type === n) return h
                }
                if (o) {
                    const h = s[u];
                    if (h && ut(h) && h.type === n) return u
                }
                return null
            }(a, s, n, null == r ? Fo(a) && Zs : r != s && 0 != (3 & a.type), o & F.Host && i === a);
            return null !== c ? Sr(t, s, c, a) : ud
        }

        function Sr(e, t, n, r) {
            let o = e[n];
            const i = t.data;
            if (function Z_(e) {
                return e instanceof Ar
            }(o)) {
                const s = o;
                s.resolving && function JD(e, t) {
                    const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
                    throw new B(-200, `Circular dependency in DI detected for ${e}${n}`)
                }(Ie(i[n]));
                const a = $o(s.canSeeViewProviders);
                s.resolving = !0;
                const u = s.injectImpl ? qt(s.injectImpl) : null;
                Qc(e, r, F.Default);
                try {
                    o = e[n] = s.factory(void 0, i, e, r), t.firstCreatePass && n >= r.directiveStart && function W_(e, t, n) {
                        const {ngOnChanges: r, ngOnInit: o, ngDoCheck: i} = t.type.prototype;
                        if (r) {
                            const s = Vc(t);
                            (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s), (n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, s)
                        }
                        o && (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o), i && ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i), (n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(e, i))
                    }(n, i[n], t)
                } finally {
                    null !== u && qt(u), $o(a), s.resolving = !1, Yc()
                }
            }
            return o
        }

        function ld(e, t, n) {
            return !!(n[t + (e >> 5)] & 1 << e)
        }

        function cd(e, t) {
            return !(e & F.Self || e & F.Host && t)
        }

        class kn {
            constructor(t, n) {
                this._tNode = t, this._lView = n
            }

            get(t, n, r) {
                return ad(this._tNode, this._lView, t, r, n)
            }
        }

        function Ee(e) {
            return zt(() => {
                const t = e.prototype.constructor, n = t[Ot] || Ys(t), r = Object.prototype;
                let o = Object.getPrototypeOf(e.prototype).constructor;
                for (; o && o !== r;) {
                    const i = o[Ot] || Ys(o);
                    if (i && i !== n) return i;
                    o = Object.getPrototypeOf(o)
                }
                return i => new i
            })
        }

        function Ys(e) {
            return Mc(e) ? () => {
                const t = Ys(x(e));
                return t && t()
            } : Dn(e)
        }

        const Bn = "__parameters__";

        function jn(e, t, n) {
            return zt(() => {
                const r = function ea(e) {
                    return function (...n) {
                        if (e) {
                            const r = e(...n);
                            for (const o in r) this[o] = r[o]
                        }
                    }
                }(t);

                function o(...i) {
                    if (this instanceof o) return r.apply(this, i), this;
                    const s = new o(...i);
                    return a.annotation = s, a;

                    function a(u, l, c) {
                        const d = u.hasOwnProperty(Bn) ? u[Bn] : Object.defineProperty(u, Bn, {value: []})[Bn];
                        for (; d.length <= c;) d.push(null);
                        return (d[c] = d[c] || []).push(s), u
                    }
                }

                return n && (o.prototype = Object.create(n.prototype)), o.prototype.ngMetadataName = e, o.annotationCls = o, o
            })
        }

        class L {
            constructor(t, n) {
                this._desc = t, this.ngMetadataName = "InjectionToken", this.\u0275prov = void 0, "number" == typeof n ? this.__NG_ELEMENT_ID__ = n : void 0 !== n && (this.\u0275prov = $({
                    token: this,
                    providedIn: n.providedIn || "root",
                    factory: n.factory
                }))
            }

            toString() {
                return `InjectionToken ${this._desc}`
            }
        }

        function wt(e, t) {
            e.forEach(n => Array.isArray(n) ? wt(n, t) : t(n))
        }

        function fd(e, t, n) {
            t >= e.length ? e.push(n) : e.splice(t, 0, n)
        }

        function zo(e, t) {
            return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
        }

        function Ue(e, t, n) {
            let r = $n(e, t);
            return r >= 0 ? e[1 | r] = n : (r = ~r, function lv(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r); else if (1 === o) e.push(r, e[0]), e[0] = n; else {
                    for (o--, e.push(e[o - 1], e[o]); o > t;) e[o] = e[o - 2], o--;
                    e[t] = n, e[t + 1] = r
                }
            }(e, r, t, n)), r
        }

        function na(e, t) {
            const n = $n(e, t);
            if (n >= 0) return e[1 | n]
        }

        function $n(e, t) {
            return function gd(e, t, n) {
                let r = 0, o = e.length >> n;
                for (; o !== r;) {
                    const i = r + (o - r >> 1), s = e[i << n];
                    if (t === s) return i << n;
                    s > t ? o = i : r = i + 1
                }
                return ~(o << n)
            }(e, t, 1)
        }

        const Pr = {}, oa = "__NG_DI_FLAG__", Qo = "ngTempTokenPath", mv = /\n/gm, yd = "__source",
            Dv = z({provide: String, useValue: z});
        let Or;

        function Dd(e) {
            const t = Or;
            return Or = e, t
        }

        function _v(e, t = F.Default) {
            if (void 0 === Or) throw new B(203, "");
            return null === Or ? Sc(e, void 0, t) : Or.get(e, t & F.Optional ? null : void 0, t)
        }

        function V(e, t = F.Default) {
            return (function o_() {
                return Ms
            }() || _v)(x(e), t)
        }

        const vv = V;

        function ia(e) {
            const t = [];
            for (let n = 0; n < e.length; n++) {
                const r = x(e[n]);
                if (Array.isArray(r)) {
                    if (0 === r.length) throw new B(900, "");
                    let o, i = F.Default;
                    for (let s = 0; s < r.length; s++) {
                        const a = r[s], u = Cv(a);
                        "number" == typeof u ? -1 === u ? o = a.token : i |= u : o = a
                    }
                    t.push(V(o, i))
                } else t.push(V(r))
            }
            return t
        }

        function Rr(e, t) {
            return e[oa] = t, e.prototype[oa] = t, e
        }

        function Cv(e) {
            return e[oa]
        }

        const Zo = Rr(jn("Optional"), 8), Ko = Rr(jn("SkipSelf"), 4);
        const Ld = "__ngContext__";

        function we(e, t) {
            e[Ld] = t
        }

        function ga(e) {
            const t = function Hr(e) {
                return e[Ld] || null
            }(e);
            return t ? Array.isArray(t) ? t : t.lView : null
        }

        function ya(e) {
            return e.ngOriginalError
        }

        function hC(e, ...t) {
            e.error(...t)
        }

        class jr {
            constructor() {
                this._console = console
            }

            handleError(t) {
                const n = this._findOriginalError(t), r = function fC(e) {
                    return e && e.ngErrorLogger || hC
                }(t);
                r(this._console, "ERROR", t), n && r(this._console, "ORIGINAL ERROR", n)
            }

            _findOriginalError(t) {
                let n = t && ya(t);
                for (; n && ya(n);) n = ya(n);
                return n || null
            }
        }

        const wC = (() => ("undefined" != typeof requestAnimationFrame && requestAnimationFrame || setTimeout).bind(q))();

        function Mt(e) {
            return e instanceof Function ? e() : e
        }

        var Ge = (() => ((Ge = Ge || {})[Ge.Important = 1] = "Important", Ge[Ge.DashCase = 2] = "DashCase", Ge))();

        function _a(e, t) {
            return undefined(e, t)
        }

        function $r(e) {
            const t = e[3];
            return at(t) ? t[3] : t
        }

        function va(e) {
            return Wd(e[13])
        }

        function Ca(e) {
            return Wd(e[4])
        }

        function Wd(e) {
            for (; null !== e && !at(e);) e = e[4];
            return e
        }

        function zn(e, t, n, r, o) {
            if (null != r) {
                let i, s = !1;
                at(r) ? i = r : Ct(r) && (s = !0, r = r[0]);
                const a = ue(r);
                0 === e && null !== n ? null == o ? Xd(t, n, a) : _n(t, n, a, o || null, !0) : 1 === e && null !== n ? _n(t, n, a, o || null, !0) : 2 === e ? function af(e, t, n) {
                    const r = ni(e, t);
                    r && function kC(e, t, n, r) {
                        ne(e) ? e.removeChild(t, n, r) : t.removeChild(n)
                    }(e, r, t, n)
                }(t, a, s) : 3 === e && t.destroyNode(a), null != i && function HC(e, t, n, r, o) {
                    const i = n[7];
                    i !== ue(n) && zn(t, e, r, i, o);
                    for (let a = 10; a < n.length; a++) {
                        const u = n[a];
                        Ur(u[1], u, e, t, r, i)
                    }
                }(t, e, i, n, o)
            }
        }

        function wa(e, t, n) {
            if (ne(e)) return e.createElement(t, n);
            {
                const r = null !== n ? function b_(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "http://www.w3.org/2000/svg" : "math" === t ? "http://www.w3.org/1998/MathML/" : null
                }(n) : null;
                return null === r ? e.createElement(t) : e.createElementNS(r, t)
            }
        }

        function Zd(e, t) {
            const n = e[9], r = n.indexOf(t), o = t[3];
            1024 & t[2] && (t[2] &= -1025, Hs(o, -1)), n.splice(r, 1)
        }

        function ba(e, t) {
            if (e.length <= 10) return;
            const n = 10 + t, r = e[n];
            if (r) {
                const o = r[17];
                null !== o && o !== e && Zd(o, r), t > 0 && (e[n - 1][4] = r[4]);
                const i = zo(e, 10 + t);
                !function SC(e, t) {
                    Ur(e, t, t[P], 2, null, null), t[0] = null, t[6] = null
                }(r[1], r);
                const s = i[19];
                null !== s && s.detachView(i[1]), r[3] = null, r[4] = null, r[2] &= -129
            }
            return r
        }

        function Kd(e, t) {
            if (!(256 & t[2])) {
                const n = t[P];
                ne(n) && n.destroyNode && Ur(e, t, n, 3, null, null), function xC(e) {
                    let t = e[13];
                    if (!t) return Ma(e[1], e);
                    for (; t;) {
                        let n = null;
                        if (Ct(t)) n = t[13]; else {
                            const r = t[10];
                            r && (n = r)
                        }
                        if (!n) {
                            for (; t && !t[4] && t !== e;) Ct(t) && Ma(t[1], t), t = t[3];
                            null === t && (t = e), Ct(t) && Ma(t[1], t), n = t && t[4]
                        }
                        t = n
                    }
                }(t)
            }
        }

        function Ma(e, t) {
            if (!(256 & t[2])) {
                t[2] &= -129, t[2] |= 256, function VC(e, t) {
                    let n;
                    if (null != e && null != (n = e.destroyHooks)) for (let r = 0; r < n.length; r += 2) {
                        const o = t[n[r]];
                        if (!(o instanceof Ar)) {
                            const i = n[r + 1];
                            if (Array.isArray(i)) for (let s = 0; s < i.length; s += 2) {
                                const a = o[i[s]], u = i[s + 1];
                                try {
                                    u.call(a)
                                } finally {
                                }
                            } else try {
                                i.call(o)
                            } finally {
                            }
                        }
                    }
                }(e, t), function RC(e, t) {
                    const n = e.cleanup, r = t[7];
                    let o = -1;
                    if (null !== n) for (let i = 0; i < n.length - 1; i += 2) if ("string" == typeof n[i]) {
                        const s = n[i + 1], a = "function" == typeof s ? s(t) : ue(t[s]), u = r[o = n[i + 2]],
                            l = n[i + 3];
                        "boolean" == typeof l ? a.removeEventListener(n[i], u, l) : l >= 0 ? r[o = l]() : r[o = -l].unsubscribe(), i += 2
                    } else {
                        const s = r[o = n[i + 1]];
                        n[i].call(s)
                    }
                    if (null !== r) {
                        for (let i = o + 1; i < r.length; i++) r[i]();
                        t[7] = null
                    }
                }(e, t), 1 === t[1].type && ne(t[P]) && t[P].destroy();
                const n = t[17];
                if (null !== n && at(t[3])) {
                    n !== t[3] && Zd(n, t);
                    const r = t[19];
                    null !== r && r.detachView(e)
                }
            }
        }

        function Jd(e, t, n) {
            return function Yd(e, t, n) {
                let r = t;
                for (; null !== r && 40 & r.type;) r = (t = r).parent;
                if (null === r) return n[0];
                if (2 & r.flags) {
                    const o = e.data[r.directiveStart].encapsulation;
                    if (o === vt.None || o === vt.Emulated) return null
                }
                return Xe(r, n)
            }(e, t.parent, n)
        }

        function _n(e, t, n, r, o) {
            ne(e) ? e.insertBefore(t, n, r, o) : t.insertBefore(n, r, o)
        }

        function Xd(e, t, n) {
            ne(e) ? e.appendChild(t, n) : t.appendChild(n)
        }

        function ef(e, t, n, r, o) {
            null !== r ? _n(e, t, n, r, o) : Xd(e, t, n)
        }

        function ni(e, t) {
            return ne(e) ? e.parentNode(t) : t.parentNode
        }

        let rf = function nf(e, t, n) {
            return 40 & e.type ? Xe(e, n) : null
        };

        function ri(e, t, n, r) {
            const o = Jd(e, r, t), i = t[P], a = function tf(e, t, n) {
                return rf(e, t, n)
            }(r.parent || t[6], r, t);
            if (null != o) if (Array.isArray(n)) for (let u = 0; u < n.length; u++) ef(i, o, n[u], a, !1); else ef(i, o, n, a, !1)
        }

        function oi(e, t) {
            if (null !== t) {
                const n = t.type;
                if (3 & n) return Xe(t, e);
                if (4 & n) return Ia(-1, e[t.index]);
                if (8 & n) {
                    const r = t.child;
                    if (null !== r) return oi(e, r);
                    {
                        const o = e[t.index];
                        return at(o) ? Ia(-1, o) : ue(o)
                    }
                }
                if (32 & n) return _a(t, e)() || ue(e[t.index]);
                {
                    const r = sf(e, t);
                    return null !== r ? Array.isArray(r) ? r[0] : oi($r(e[16]), r) : oi(e, t.next)
                }
            }
            return null
        }

        function sf(e, t) {
            return null !== t ? e[16][6].projection[t.projection] : null
        }

        function Ia(e, t) {
            const n = 10 + e + 1;
            if (n < t.length) {
                const r = t[n], o = r[1].firstChild;
                if (null !== o) return oi(r, o)
            }
            return t[7]
        }

        function Ta(e, t, n, r, o, i, s) {
            for (; null != n;) {
                const a = r[n.index], u = n.type;
                if (s && 0 === t && (a && we(ue(a), r), n.flags |= 4), 64 != (64 & n.flags)) if (8 & u) Ta(e, t, n.child, r, o, i, !1), zn(t, e, o, a, i); else if (32 & u) {
                    const l = _a(n, r);
                    let c;
                    for (; c = l();) zn(t, e, o, c, i);
                    zn(t, e, o, a, i)
                } else 16 & u ? uf(e, t, r, n, o, i) : zn(t, e, o, a, i);
                n = s ? n.projectionNext : n.next
            }
        }

        function Ur(e, t, n, r, o, i) {
            Ta(n, r, e.firstChild, t, o, i, !1)
        }

        function uf(e, t, n, r, o, i) {
            const s = n[16], u = s[6].projection[r.projection];
            if (Array.isArray(u)) for (let l = 0; l < u.length; l++) zn(t, e, o, u[l], i); else Ta(e, t, u, s[3], o, i, !0)
        }

        function lf(e, t, n) {
            ne(e) ? e.setAttribute(t, "style", n) : t.style.cssText = n
        }

        function Sa(e, t, n) {
            ne(e) ? "" === n ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n) : t.className = n
        }

        function cf(e, t, n) {
            let r = e.length;
            for (; ;) {
                const o = e.indexOf(t, n);
                if (-1 === o) return o;
                if (0 === o || e.charCodeAt(o - 1) <= 32) {
                    const i = t.length;
                    if (o + i === r || e.charCodeAt(o + i) <= 32) return o
                }
                n = o + 1
            }
        }

        const df = "ng-template";

        function $C(e, t, n) {
            let r = 0;
            for (; r < e.length;) {
                let o = e[r++];
                if (n && "class" === o) {
                    if (o = e[r], -1 !== cf(o.toLowerCase(), t, 0)) return !0
                } else if (1 === o) {
                    for (; r < e.length && "string" == typeof (o = e[r++]);) if (o.toLowerCase() === t) return !0;
                    return !1
                }
            }
            return !1
        }

        function ff(e) {
            return 4 === e.type && e.value !== df
        }

        function UC(e, t, n) {
            return t === (4 !== e.type || n ? e.value : df)
        }

        function GC(e, t, n) {
            let r = 4;
            const o = e.attrs || [], i = function WC(e) {
                for (let t = 0; t < e.length; t++) if (ed(e[t])) return t;
                return e.length
            }(o);
            let s = !1;
            for (let a = 0; a < t.length; a++) {
                const u = t[a];
                if ("number" != typeof u) {
                    if (!s) if (4 & r) {
                        if (r = 2 | 1 & r, "" !== u && !UC(e, u, n) || "" === u && 1 === t.length) {
                            if (lt(r)) return !1;
                            s = !0
                        }
                    } else {
                        const l = 8 & r ? u : t[++a];
                        if (8 & r && null !== e.attrs) {
                            if (!$C(e.attrs, l, n)) {
                                if (lt(r)) return !1;
                                s = !0
                            }
                            continue
                        }
                        const d = qC(8 & r ? "class" : u, o, ff(e), n);
                        if (-1 === d) {
                            if (lt(r)) return !1;
                            s = !0;
                            continue
                        }
                        if ("" !== l) {
                            let f;
                            f = d > i ? "" : o[d + 1].toLowerCase();
                            const h = 8 & r ? f : null;
                            if (h && -1 !== cf(h, l, 0) || 2 & r && l !== f) {
                                if (lt(r)) return !1;
                                s = !0
                            }
                        }
                    }
                } else {
                    if (!s && !lt(r) && !lt(u)) return !1;
                    if (s && lt(u)) continue;
                    s = !1, r = u | 1 & r
                }
            }
            return lt(r) || s
        }

        function lt(e) {
            return 0 == (1 & e)
        }

        function qC(e, t, n, r) {
            if (null === t) return -1;
            let o = 0;
            if (r || !n) {
                let i = !1;
                for (; o < t.length;) {
                    const s = t[o];
                    if (s === e) return o;
                    if (3 === s || 6 === s) i = !0; else {
                        if (1 === s || 2 === s) {
                            let a = t[++o];
                            for (; "string" == typeof a;) a = t[++o];
                            continue
                        }
                        if (4 === s) break;
                        if (0 === s) {
                            o += 4;
                            continue
                        }
                    }
                    o += i ? 1 : 2
                }
                return -1
            }
            return function QC(e, t) {
                let n = e.indexOf(4);
                if (n > -1) for (n++; n < e.length;) {
                    const r = e[n];
                    if ("number" == typeof r) return -1;
                    if (r === t) return n;
                    n++
                }
                return -1
            }(t, e)
        }

        function hf(e, t, n = !1) {
            for (let r = 0; r < t.length; r++) if (GC(e, t[r], n)) return !0;
            return !1
        }

        function pf(e, t) {
            return e ? ":not(" + t.trim() + ")" : t
        }

        function KC(e) {
            let t = e[0], n = 1, r = 2, o = "", i = !1;
            for (; n < e.length;) {
                let s = e[n];
                if ("string" == typeof s) if (2 & r) {
                    const a = e[++n];
                    o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
                } else 8 & r ? o += "." + s : 4 & r && (o += " " + s); else "" !== o && !lt(s) && (t += pf(i, o), o = ""), r = s, i = i || !lt(r);
                n++
            }
            return "" !== o && (t += pf(i, o)), t
        }

        const S = {};

        function Wn(e) {
            gf(H(), y(), Se() + e, Po())
        }

        function gf(e, t, n, r) {
            if (!r) if (3 == (3 & t[2])) {
                const i = e.preOrderCheckHooks;
                null !== i && Lo(t, i, n)
            } else {
                const i = e.preOrderHooks;
                null !== i && Bo(t, i, 0, n)
            }
            Zt(n)
        }

        function ii(e, t) {
            return e << 17 | t << 2
        }

        function ct(e) {
            return e >> 17 & 32767
        }

        function Fa(e) {
            return 2 | e
        }

        function Lt(e) {
            return (131068 & e) >> 2
        }

        function Na(e, t) {
            return -131069 & e | t << 2
        }

        function xa(e) {
            return 1 | e
        }

        function Af(e, t) {
            const n = e.contentQueries;
            if (null !== n) for (let r = 0; r < n.length; r += 2) {
                const o = n[r], i = n[r + 1];
                if (-1 !== i) {
                    const s = e.data[i];
                    qs(o), s.contentQueries(2, t[i], i)
                }
            }
        }

        function Gr(e, t, n, r, o, i, s, a, u, l) {
            const c = t.blueprint.slice();
            return c[0] = o, c[2] = 140 | r, jc(c), c[3] = c[15] = e, c[8] = n, c[10] = s || e && e[10], c[P] = a || e && e[P], c[12] = u || e && e[12] || null, c[9] = l || e && e[9] || null, c[6] = i, c[16] = 2 == t.type ? e[16] : c, c
        }

        function Qn(e, t, n, r, o) {
            let i = e.data[t];
            if (null === i) i = function ja(e, t, n, r, o) {
                const i = Gc(), s = js(), u = e.data[t] = function pE(e, t, n, r, o, i) {
                    return {
                        type: n,
                        index: r,
                        insertBeforeIndex: null,
                        injectorIndex: t ? t.injectorIndex : -1,
                        directiveStart: -1,
                        directiveEnd: -1,
                        directiveStylingLast: -1,
                        propertyBindings: null,
                        flags: 0,
                        providerIndexes: 0,
                        value: o,
                        attrs: i,
                        mergedAttrs: null,
                        localNames: null,
                        initialInputs: void 0,
                        inputs: null,
                        outputs: null,
                        tViews: null,
                        next: null,
                        projectionNext: null,
                        child: null,
                        parent: t,
                        projection: null,
                        styles: null,
                        stylesWithoutHost: null,
                        residualStyles: void 0,
                        classes: null,
                        classesWithoutHost: null,
                        residualClasses: void 0,
                        classBindings: 0,
                        styleBindings: 0
                    }
                }(0, s ? i : i && i.parent, n, t, r, o);
                return null === e.firstChild && (e.firstChild = u), null !== i && (s ? null == i.child && null !== u.parent && (i.child = u) : null === i.next && (i.next = u)), u
            }(e, t, n, r, o), function V_() {
                return A.lFrame.inI18n
            }() && (i.flags |= 64); else if (64 & i.type) {
                i.type = n, i.value = r, i.attrs = o;
                const s = function Mr() {
                    const e = A.lFrame, t = e.currentTNode;
                    return e.isParent ? t : t.parent
                }();
                i.injectorIndex = null === s ? -1 : s.injectorIndex
            }
            return Et(i, !0), i
        }

        function Zn(e, t, n, r) {
            if (0 === n) return -1;
            const o = t.length;
            for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
            return o
        }

        function qr(e, t, n) {
            Ro(t);
            try {
                const r = e.viewQuery;
                null !== r && Ka(1, r, n);
                const o = e.template;
                null !== o && If(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), e.staticContentQueries && Af(e, t), e.staticViewQueries && Ka(2, e.viewQuery, n);
                const i = e.components;
                null !== i && function dE(e, t) {
                    for (let n = 0; n < t.length; n++) xE(e, t[n])
                }(t, i)
            } catch (r) {
                throw e.firstCreatePass && (e.incompleteFirstPass = !0, e.firstCreatePass = !1), r
            } finally {
                t[2] &= -5, Vo()
            }
        }

        function Kn(e, t, n, r) {
            const o = t[2];
            if (256 == (256 & o)) return;
            Ro(t);
            const i = Po();
            try {
                jc(t), function qc(e) {
                    return A.lFrame.bindingIndex = e
                }(e.bindingStartIndex), null !== n && If(e, t, n, 2, r);
                const s = 3 == (3 & o);
                if (!i) if (s) {
                    const l = e.preOrderCheckHooks;
                    null !== l && Lo(t, l, null)
                } else {
                    const l = e.preOrderHooks;
                    null !== l && Bo(t, l, 0, null), zs(t, 0)
                }
                if (function FE(e) {
                    for (let t = va(e); null !== t; t = Ca(t)) {
                        if (!t[2]) continue;
                        const n = t[9];
                        for (let r = 0; r < n.length; r++) {
                            const o = n[r], i = o[3];
                            0 == (1024 & o[2]) && Hs(i, 1), o[2] |= 1024
                        }
                    }
                }(t), function SE(e) {
                    for (let t = va(e); null !== t; t = Ca(t)) for (let n = 10; n < t.length; n++) {
                        const r = t[n], o = r[1];
                        Bs(r) && Kn(o, r, o.template, r[8])
                    }
                }(t), null !== e.contentQueries && Af(e, t), !i) if (s) {
                    const l = e.contentCheckHooks;
                    null !== l && Lo(t, l)
                } else {
                    const l = e.contentHooks;
                    null !== l && Bo(t, l, 1), zs(t, 1)
                }
                !function lE(e, t) {
                    const n = e.hostBindingOpCodes;
                    if (null !== n) try {
                        for (let r = 0; r < n.length; r++) {
                            const o = n[r];
                            if (o < 0) Zt(~o); else {
                                const i = o, s = n[++r], a = n[++r];
                                k_(s, i), a(2, t[i])
                            }
                        }
                    } finally {
                        Zt(-1)
                    }
                }(e, t);
                const a = e.components;
                null !== a && function cE(e, t) {
                    for (let n = 0; n < t.length; n++) NE(e, t[n])
                }(t, a);
                const u = e.viewQuery;
                if (null !== u && Ka(2, u, r), !i) if (s) {
                    const l = e.viewCheckHooks;
                    null !== l && Lo(t, l)
                } else {
                    const l = e.viewHooks;
                    null !== l && Bo(t, l, 2), zs(t, 2)
                }
                !0 === e.firstUpdatePass && (e.firstUpdatePass = !1), i || (t[2] &= -73), 1024 & t[2] && (t[2] &= -1025, Hs(t[3], -1))
            } finally {
                Vo()
            }
        }

        function fE(e, t, n, r) {
            const o = t[10], i = !Po(), s = function Hc(e) {
                return 4 == (4 & e[2])
            }(t);
            try {
                i && !s && o.begin && o.begin(), s && qr(e, t, r), Kn(e, t, n, r)
            } finally {
                i && !s && o.end && o.end()
            }
        }

        function If(e, t, n, r, o) {
            const i = Se(), s = 2 & r;
            try {
                Zt(-1), s && t.length > Z && gf(e, t, Z, Po()), n(r, o)
            } finally {
                Zt(i)
            }
        }

        function $a(e, t, n) {
            !$c() || (function CE(e, t, n, r) {
                const o = n.directiveStart, i = n.directiveEnd;
                e.firstCreatePass || Tr(n, t), we(r, t);
                const s = n.initialInputs;
                for (let a = o; a < i; a++) {
                    const u = e.data[a], l = ut(u);
                    l && AE(t, n, u);
                    const c = Sr(t, e, a, n);
                    we(c, t), null !== s && IE(0, a - o, c, u, 0, s), l && ($e(n.index, t)[8] = c)
                }
            }(e, t, n, Xe(n, t)), 128 == (128 & n.flags) && function EE(e, t, n) {
                const r = n.directiveStart, o = n.directiveEnd, s = n.index, a = function L_() {
                    return A.lFrame.currentDirectiveIndex
                }();
                try {
                    Zt(s);
                    for (let u = r; u < o; u++) {
                        const l = e.data[u], c = t[u];
                        Us(u), (null !== l.hostBindings || 0 !== l.hostVars || null !== l.hostAttrs) && Vf(l, c)
                    }
                } finally {
                    Zt(-1), Us(a)
                }
            }(e, t, n))
        }

        function Ua(e, t, n = Xe) {
            const r = t.localNames;
            if (null !== r) {
                let o = t.index + 1;
                for (let i = 0; i < r.length; i += 2) {
                    const s = r[i + 1], a = -1 === s ? n(t, e) : e[s];
                    e[o++] = a
                }
            }
        }

        function Sf(e) {
            const t = e.tView;
            return null === t || t.incompleteFirstPass ? e.tView = ui(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts) : t
        }

        function ui(e, t, n, r, o, i, s, a, u, l) {
            const c = Z + r, d = c + o, f = function hE(e, t) {
                const n = [];
                for (let r = 0; r < t; r++) n.push(r < e ? null : S);
                return n
            }(c, d), h = "function" == typeof l ? l() : l;
            return f[1] = {
                type: e,
                blueprint: f,
                template: n,
                queries: null,
                viewQuery: a,
                declTNode: t,
                data: f.slice().fill(null, c),
                bindingStartIndex: c,
                expandoStartIndex: d,
                hostBindingOpCodes: null,
                firstCreatePass: !0,
                firstUpdatePass: !0,
                staticViewQueries: !1,
                staticContentQueries: !1,
                preOrderHooks: null,
                preOrderCheckHooks: null,
                contentHooks: null,
                contentCheckHooks: null,
                viewHooks: null,
                viewCheckHooks: null,
                destroyHooks: null,
                cleanup: null,
                contentQueries: null,
                components: null,
                directiveRegistry: "function" == typeof i ? i() : i,
                pipeRegistry: "function" == typeof s ? s() : s,
                firstChild: null,
                schemas: u,
                consts: h,
                incompleteFirstPass: !1
            }
        }

        function Pf(e, t, n) {
            for (let r in e) if (e.hasOwnProperty(r)) {
                const o = e[r];
                (n = null === n ? {} : n).hasOwnProperty(r) ? n[r].push(t, o) : n[r] = [t, o]
            }
            return n
        }

        function Ga(e, t, n, r) {
            let o = !1;
            if ($c()) {
                const i = function wE(e, t, n) {
                    const r = e.directiveRegistry;
                    let o = null;
                    if (r) for (let i = 0; i < r.length; i++) {
                        const s = r[i];
                        hf(n, s.selectors, !1) && (o || (o = []), Go(Tr(n, t), e, s.type), ut(s) ? (kf(e, n), o.unshift(s)) : o.push(s))
                    }
                    return o
                }(e, t, n), s = null === r ? null : {"": -1};
                if (null !== i) {
                    o = !0, Lf(n, e.data.length, i.length);
                    for (let c = 0; c < i.length; c++) {
                        const d = i[c];
                        d.providersResolver && d.providersResolver(d)
                    }
                    let a = !1, u = !1, l = Zn(e, t, i.length, null);
                    for (let c = 0; c < i.length; c++) {
                        const d = i[c];
                        n.mergedAttrs = jo(n.mergedAttrs, d.hostAttrs), Bf(e, n, t, l, d), ME(l, d, s), null !== d.contentQueries && (n.flags |= 8), (null !== d.hostBindings || null !== d.hostAttrs || 0 !== d.hostVars) && (n.flags |= 128);
                        const f = d.type.prototype;
                        !a && (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) && ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index), a = !0), !u && (f.ngOnChanges || f.ngDoCheck) && ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(n.index), u = !0), l++
                    }
                    !function gE(e, t) {
                        const r = t.directiveEnd, o = e.data, i = t.attrs, s = [];
                        let a = null, u = null;
                        for (let l = t.directiveStart; l < r; l++) {
                            const c = o[l], d = c.inputs, f = null === i || ff(t) ? null : TE(d, i);
                            s.push(f), a = Pf(d, l, a), u = Pf(c.outputs, l, u)
                        }
                        null !== a && (a.hasOwnProperty("class") && (t.flags |= 16), a.hasOwnProperty("style") && (t.flags |= 32)), t.initialInputs = s, t.inputs = a, t.outputs = u
                    }(e, n)
                }
                s && function bE(e, t, n) {
                    if (t) {
                        const r = e.localNames = [];
                        for (let o = 0; o < t.length; o += 2) {
                            const i = n[t[o + 1]];
                            if (null == i) throw new B(-301, !1);
                            r.push(t[o], i)
                        }
                    }
                }(n, r, s)
            }
            return n.mergedAttrs = jo(n.mergedAttrs, n.attrs), o
        }

        function Rf(e, t, n, r, o, i) {
            const s = i.hostBindings;
            if (s) {
                let a = e.hostBindingOpCodes;
                null === a && (a = e.hostBindingOpCodes = []);
                const u = ~t.index;
                (function vE(e) {
                    let t = e.length;
                    for (; t > 0;) {
                        const n = e[--t];
                        if ("number" == typeof n && n < 0) return n
                    }
                    return 0
                })(a) != u && a.push(u), a.push(r, o, s)
            }
        }

        function Vf(e, t) {
            null !== e.hostBindings && e.hostBindings(1, t)
        }

        function kf(e, t) {
            t.flags |= 2, (e.components || (e.components = [])).push(t.index)
        }

        function ME(e, t, n) {
            if (n) {
                if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
                ut(t) && (n[""] = e)
            }
        }

        function Lf(e, t, n) {
            e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t
        }

        function Bf(e, t, n, r, o) {
            e.data[r] = o;
            const i = o.factory || (o.factory = Dn(o.type)), s = new Ar(i, ut(o), null);
            e.blueprint[r] = s, n[r] = s, Rf(e, t, 0, r, Zn(e, n, o.hostVars, S), o)
        }

        function AE(e, t, n) {
            const r = Xe(t, e), o = Sf(n), i = e[10],
                s = li(e, Gr(e, o, null, n.onPush ? 64 : 16, r, t, i, i.createRenderer(r, n), null, null));
            e[t.index] = s
        }

        function IE(e, t, n, r, o, i) {
            const s = i[t];
            if (null !== s) {
                const a = r.setInput;
                for (let u = 0; u < s.length;) {
                    const l = s[u++], c = s[u++], d = s[u++];
                    null !== a ? r.setInput(n, d, l, c) : n[c] = d
                }
            }
        }

        function TE(e, t) {
            let n = null, r = 0;
            for (; r < t.length;) {
                const o = t[r];
                if (0 !== o) if (5 !== o) {
                    if ("number" == typeof o) break;
                    e.hasOwnProperty(o) && (null === n && (n = []), n.push(o, e[o], t[r + 1])), r += 2
                } else r += 2; else r += 4
            }
            return n
        }

        function Hf(e, t, n, r) {
            return new Array(e, !0, !1, t, null, 0, r, n, null, null)
        }

        function NE(e, t) {
            const n = $e(t, e);
            if (Bs(n)) {
                const r = n[1];
                80 & n[2] ? Kn(r, n, r.template, n[8]) : n[5] > 0 && za(n)
            }
        }

        function za(e) {
            for (let r = va(e); null !== r; r = Ca(r)) for (let o = 10; o < r.length; o++) {
                const i = r[o];
                if (1024 & i[2]) {
                    const s = i[1];
                    Kn(s, i, s.template, i[8])
                } else i[5] > 0 && za(i)
            }
            const n = e[1].components;
            if (null !== n) for (let r = 0; r < n.length; r++) {
                const o = $e(n[r], e);
                Bs(o) && o[5] > 0 && za(o)
            }
        }

        function xE(e, t) {
            const n = $e(t, e), r = n[1];
            (function PE(e, t) {
                for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n])
            })(r, n), qr(r, n, n[8])
        }

        function li(e, t) {
            return e[13] ? e[14][4] = t : e[13] = t, e[14] = t, t
        }

        function Wa(e) {
            for (; e;) {
                e[2] |= 64;
                const t = $r(e);
                if (p_(e) && !t) return e;
                e = t
            }
            return null
        }

        function Za(e, t, n) {
            const r = t[10];
            r.begin && r.begin();
            try {
                Kn(e, t, e.template, n)
            } catch (o) {
                throw qf(t, o), o
            } finally {
                r.end && r.end()
            }
        }

        function jf(e) {
            !function Qa(e) {
                for (let t = 0; t < e.components.length; t++) {
                    const n = e.components[t], r = ga(n), o = r[1];
                    fE(o, r, o.template, n)
                }
            }(e[8])
        }

        function Ka(e, t, n) {
            qs(0), t(e, n)
        }

        const kE = (() => Promise.resolve(null))();

        function $f(e) {
            return e[7] || (e[7] = [])
        }

        function Uf(e) {
            return e.cleanup || (e.cleanup = [])
        }

        function qf(e, t) {
            const n = e[9], r = n ? n.get(jr, null) : null;
            r && r.handleError(t)
        }

        function zf(e, t, n, r, o) {
            for (let i = 0; i < n.length;) {
                const s = n[i++], a = n[i++], u = t[s], l = e.data[s];
                null !== l.setInput ? l.setInput(u, o, r, a) : u[a] = o
            }
        }

        function ci(e, t, n) {
            let r = n ? e.styles : null, o = n ? e.classes : null, i = 0;
            if (null !== t) for (let s = 0; s < t.length; s++) {
                const a = t[s];
                "number" == typeof a ? i = a : 1 == i ? o = Cs(o, a) : 2 == i && (r = Cs(r, a + ": " + t[++s] + ";"))
            }
            n ? e.styles = r : e.stylesWithoutHost = r, n ? e.classes = o : e.classesWithoutHost = o
        }

        const Ja = new L("INJECTOR", -1);

        class Wf {
            get(t, n = Pr) {
                if (n === Pr) {
                    const r = new Error(`NullInjectorError: No provider for ${U(t)}!`);
                    throw r.name = "NullInjectorError", r
                }
                return n
            }
        }

        const Ya = new L("Set Injector scope."), zr = {}, HE = {};
        let Xa;

        function Qf() {
            return void 0 === Xa && (Xa = new Wf), Xa
        }

        function Zf(e, t = null, n = null, r) {
            const o = Kf(e, t, n, r);
            return o._resolveInjectorDefTypes(), o
        }

        function Kf(e, t = null, n = null, r) {
            return new jE(e, n, t || Qf(), r)
        }

        class jE {
            constructor(t, n, r, o = null) {
                this.parent = r, this.records = new Map, this.injectorDefTypes = new Set, this.onDestroy = new Set, this._destroyed = !1;
                const i = [];
                n && wt(n, a => this.processProvider(a, t, n)), wt([t], a => this.processInjectorType(a, [], i)), this.records.set(Ja, Jn(void 0, this));
                const s = this.records.get(Ya);
                this.scope = null != s ? s.value : null, this.source = o || ("object" == typeof t ? null : U(t))
            }

            get destroyed() {
                return this._destroyed
            }

            destroy() {
                this.assertNotDestroyed(), this._destroyed = !0;
                try {
                    this.onDestroy.forEach(t => t.ngOnDestroy())
                } finally {
                    this.records.clear(), this.onDestroy.clear(), this.injectorDefTypes.clear()
                }
            }

            get(t, n = Pr, r = F.Default) {
                this.assertNotDestroyed();
                const o = Dd(this), i = qt(void 0);
                try {
                    if (!(r & F.SkipSelf)) {
                        let a = this.records.get(t);
                        if (void 0 === a) {
                            const u = function ZE(e) {
                                return "function" == typeof e || "object" == typeof e && e instanceof L
                            }(t) && ws(t);
                            a = u && this.injectableDefInScope(u) ? Jn(eu(t), zr) : null, this.records.set(t, a)
                        }
                        if (null != a) return this.hydrate(t, a)
                    }
                    return (r & F.Self ? Qf() : this.parent).get(t, n = r & F.Optional && n === Pr ? null : n)
                } catch (s) {
                    if ("NullInjectorError" === s.name) {
                        if ((s[Qo] = s[Qo] || []).unshift(U(t)), o) throw s;
                        return function Ev(e, t, n, r) {
                            const o = e[Qo];
                            throw t[yd] && o.unshift(t[yd]), e.message = function wv(e, t, n, r = null) {
                                e = e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1) ? e.substr(2) : e;
                                let o = U(t);
                                if (Array.isArray(t)) o = t.map(U).join(" -> "); else if ("object" == typeof t) {
                                    let i = [];
                                    for (let s in t) if (t.hasOwnProperty(s)) {
                                        let a = t[s];
                                        i.push(s + ":" + ("string" == typeof a ? JSON.stringify(a) : U(a)))
                                    }
                                    o = `{${i.join(", ")}}`
                                }
                                return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(mv, "\n  ")}`
                            }("\n" + e.message, o, n, r), e.ngTokenPath = o, e[Qo] = null, e
                        }(s, t, "R3InjectorError", this.source)
                    }
                    throw s
                } finally {
                    qt(i), Dd(o)
                }
            }

            _resolveInjectorDefTypes() {
                this.injectorDefTypes.forEach(t => this.get(t))
            }

            toString() {
                const t = [];
                return this.records.forEach((r, o) => t.push(U(o))), `R3Injector[${t.join(", ")}]`
            }

            assertNotDestroyed() {
                if (this._destroyed) throw new B(205, !1)
            }

            processInjectorType(t, n, r) {
                if (!(t = x(t))) return !1;
                let o = Ic(t);
                const i = null == o && t.ngModule || void 0, s = void 0 === i ? t : i, a = -1 !== r.indexOf(s);
                if (void 0 !== i && (o = Ic(i)), null == o) return !1;
                if (null != o.imports && !a) {
                    let c;
                    r.push(s);
                    try {
                        wt(o.imports, d => {
                            this.processInjectorType(d, n, r) && (void 0 === c && (c = []), c.push(d))
                        })
                    } finally {
                    }
                    if (void 0 !== c) for (let d = 0; d < c.length; d++) {
                        const {ngModule: f, providers: h} = c[d];
                        wt(h, p => this.processProvider(p, f, h || W))
                    }
                }
                this.injectorDefTypes.add(s);
                const u = Dn(s) || (() => new s);
                this.records.set(s, Jn(u, zr));
                const l = o.providers;
                if (null != l && !a) {
                    const c = t;
                    wt(l, d => this.processProvider(d, c, l))
                }
                return void 0 !== i && void 0 !== t.providers
            }

            processProvider(t, n, r) {
                let o = Yn(t = x(t)) ? t : x(t && t.provide);
                const i = function UE(e, t, n) {
                    return Yf(e) ? Jn(void 0, e.useValue) : Jn(Jf(e), zr)
                }(t);
                if (Yn(t) || !0 !== t.multi) this.records.get(o); else {
                    let s = this.records.get(o);
                    s || (s = Jn(void 0, zr, !0), s.factory = () => ia(s.multi), this.records.set(o, s)), o = t, s.multi.push(t)
                }
                this.records.set(o, i)
            }

            hydrate(t, n) {
                return n.value === zr && (n.value = HE, n.value = n.factory()), "object" == typeof n.value && n.value && function QE(e) {
                    return null !== e && "object" == typeof e && "function" == typeof e.ngOnDestroy
                }(n.value) && this.onDestroy.add(n.value), n.value
            }

            injectableDefInScope(t) {
                if (!t.providedIn) return !1;
                const n = x(t.providedIn);
                return "string" == typeof n ? "any" === n || n === this.scope : this.injectorDefTypes.has(n)
            }
        }

        function eu(e) {
            const t = ws(e), n = null !== t ? t.factory : Dn(e);
            if (null !== n) return n;
            if (e instanceof L) throw new B(204, !1);
            if (e instanceof Function) return function $E(e) {
                const t = e.length;
                if (t > 0) throw function xr(e, t) {
                    const n = [];
                    for (let r = 0; r < e; r++) n.push(t);
                    return n
                }(t, "?"), new B(204, !1);
                const n = function t_(e) {
                    const t = e && (e[Mo] || e[Tc]);
                    if (t) {
                        const n = function n_(e) {
                            if (e.hasOwnProperty("name")) return e.name;
                            const t = ("" + e).match(/^function\s*([^\s(]+)/);
                            return null === t ? "" : t[1]
                        }(e);
                        return console.warn(`DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`), t
                    }
                    return null
                }(e);
                return null !== n ? () => n.factory(e) : () => new e
            }(e);
            throw new B(204, !1)
        }

        function Jf(e, t, n) {
            let r;
            if (Yn(e)) {
                const o = x(e);
                return Dn(o) || eu(o)
            }
            if (Yf(e)) r = () => x(e.useValue); else if (function qE(e) {
                return !(!e || !e.useFactory)
            }(e)) r = () => e.useFactory(...ia(e.deps || [])); else if (function GE(e) {
                return !(!e || !e.useExisting)
            }(e)) r = () => V(x(e.useExisting)); else {
                const o = x(e && (e.useClass || e.provide));
                if (!function WE(e) {
                    return !!e.deps
                }(e)) return Dn(o) || eu(o);
                r = () => new o(...ia(e.deps))
            }
            return r
        }

        function Jn(e, t, n = !1) {
            return {factory: e, value: t, multi: n ? [] : void 0}
        }

        function Yf(e) {
            return null !== e && "object" == typeof e && Dv in e
        }

        function Yn(e) {
            return "function" == typeof e
        }

        let ze = (() => {
            class e {
                static create(n, r) {
                    var o;
                    if (Array.isArray(n)) return Zf({name: ""}, r, n, "");
                    {
                        const i = null !== (o = n.name) && void 0 !== o ? o : "";
                        return Zf({name: i}, n.parent, n.providers, i)
                    }
                }
            }

            return e.THROW_IF_NOT_FOUND = Pr, e.NULL = new Wf, e.\u0275prov = $({
                token: e,
                providedIn: "any",
                factory: () => V(Ja)
            }), e.__NG_ELEMENT_ID__ = -1, e
        })();

        function rw(e, t) {
            ko(ga(e)[1], he())
        }

        function G(e) {
            let t = function ch(e) {
                return Object.getPrototypeOf(e.prototype).constructor
            }(e.type), n = !0;
            const r = [e];
            for (; t;) {
                let o;
                if (ut(e)) o = t.\u0275cmp || t.\u0275dir; else {
                    if (t.\u0275cmp) throw new B(903, "");
                    o = t.\u0275dir
                }
                if (o) {
                    if (n) {
                        r.push(o);
                        const s = e;
                        s.inputs = ru(e.inputs), s.declaredInputs = ru(e.declaredInputs), s.outputs = ru(e.outputs);
                        const a = o.hostBindings;
                        a && aw(e, a);
                        const u = o.viewQuery, l = o.contentQueries;
                        if (u && iw(e, u), l && sw(e, l), vs(e.inputs, o.inputs), vs(e.declaredInputs, o.declaredInputs), vs(e.outputs, o.outputs), ut(o) && o.data.animation) {
                            const c = e.data;
                            c.animation = (c.animation || []).concat(o.data.animation)
                        }
                    }
                    const i = o.features;
                    if (i) for (let s = 0; s < i.length; s++) {
                        const a = i[s];
                        a && a.ngInherit && a(e), a === G && (n = !1)
                    }
                }
                t = Object.getPrototypeOf(t)
            }
            !function ow(e) {
                let t = 0, n = null;
                for (let r = e.length - 1; r >= 0; r--) {
                    const o = e[r];
                    o.hostVars = t += o.hostVars, o.hostAttrs = jo(o.hostAttrs, n = jo(n, o.hostAttrs))
                }
            }(r)
        }

        function ru(e) {
            return e === Tn ? {} : e === W ? [] : e
        }

        function iw(e, t) {
            const n = e.viewQuery;
            e.viewQuery = n ? (r, o) => {
                t(r, o), n(r, o)
            } : t
        }

        function sw(e, t) {
            const n = e.contentQueries;
            e.contentQueries = n ? (r, o, i) => {
                t(r, o, i), n(r, o, i)
            } : t
        }

        function aw(e, t) {
            const n = e.hostBindings;
            e.hostBindings = n ? (r, o) => {
                t(r, o), n(r, o)
            } : t
        }

        let di = null;

        function Xn() {
            if (!di) {
                const e = q.Symbol;
                if (e && e.iterator) di = e.iterator; else {
                    const t = Object.getOwnPropertyNames(Map.prototype);
                    for (let n = 0; n < t.length; ++n) {
                        const r = t[n];
                        "entries" !== r && "size" !== r && Map.prototype[r] === Map.prototype.entries && (di = r)
                    }
                }
            }
            return di
        }

        function Wr(e) {
            return !!function ou(e) {
                return null !== e && ("function" == typeof e || "object" == typeof e)
            }(e) && (Array.isArray(e) || !(e instanceof Map) && Xn() in e)
        }

        function be(e, t, n) {
            return !Object.is(e[t], n) && (e[t] = n, !0)
        }

        function hi(e, t, n, r, o, i, s, a) {
            const u = y(), l = H(), c = e + Z, d = l.firstCreatePass ? function pw(e, t, n, r, o, i, s, a, u) {
                const l = t.consts, c = Qn(t, e, 4, s || null, Qt(l, a));
                Ga(t, n, c, Qt(l, u)), ko(t, c);
                const d = c.tViews = ui(2, c, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, l);
                return null !== t.queries && (t.queries.template(t, c), d.queries = t.queries.embeddedTView(c)), c
            }(c, l, u, t, n, r, o, i, s) : l.data[c];
            Et(d, !1);
            const f = u[P].createComment("");
            ri(l, u, f, d), we(f, u), li(u, u[c] = Hf(f, u, f, d)), No(d) && $a(l, u, d), null != s && Ua(u, d, a)
        }

        function v(e, t = F.Default) {
            const n = y();
            return null === n ? V(e, t) : ad(he(), n, x(e), t)
        }

        function en(e, t, n) {
            const r = y();
            return be(r, function On() {
                return A.lFrame.bindingIndex++
            }(), t) && function qe(e, t, n, r, o, i, s, a) {
                const u = Xe(t, n);
                let c, l = t.inputs;
                !a && null != l && (c = l[r]) ? (zf(e, n, c, r, o), Fo(t) && function yE(e, t) {
                    const n = $e(t, e);
                    16 & n[2] || (n[2] |= 64)
                }(n, t.index)) : 3 & t.type && (r = function mE(e) {
                    return "class" === e ? "className" : "for" === e ? "htmlFor" : "formaction" === e ? "formAction" : "innerHtml" === e ? "innerHTML" : "readonly" === e ? "readOnly" : "tabindex" === e ? "tabIndex" : e
                }(r), o = null != s ? s(o, t.value || "", r) : o, ne(i) ? i.setProperty(u, r, o) : Qs(r) || (u.setProperty ? u.setProperty(r, o) : u[r] = o))
            }(H(), function re() {
                const e = A.lFrame;
                return Ls(e.tView, e.selectedIndex)
            }(), r, e, t, r[P], n, !1), en
        }

        function lu(e, t, n, r, o) {
            const s = o ? "class" : "style";
            zf(e, n, t.inputs[s], s, r)
        }

        function ge(e, t, n, r) {
            const o = y(), i = H(), s = Z + e, a = o[P], u = o[s] = wa(a, t, function z_() {
                return A.lFrame.currentNamespace
            }()), l = i.firstCreatePass ? function kw(e, t, n, r, o, i, s) {
                const a = t.consts, l = Qn(t, e, 2, o, Qt(a, i));
                return Ga(t, n, l, Qt(a, s)), null !== l.attrs && ci(l, l.attrs, !1), null !== l.mergedAttrs && ci(l, l.mergedAttrs, !0), null !== t.queries && t.queries.elementStart(t, l), l
            }(s, i, o, 0, t, n, r) : i.data[s];
            Et(l, !0);
            const c = l.mergedAttrs;
            null !== c && Ho(a, u, c);
            const d = l.classes;
            null !== d && Sa(a, u, d);
            const f = l.styles;
            return null !== f && lf(a, u, f), 64 != (64 & l.flags) && ri(i, o, u, l), 0 === function F_() {
                return A.lFrame.elementDepthCount
            }() && we(u, o), function N_() {
                A.lFrame.elementDepthCount++
            }(), No(l) && ($a(i, o, l), function Tf(e, t, n) {
                if (Ns(t)) {
                    const o = t.directiveEnd;
                    for (let i = t.directiveStart; i < o; i++) {
                        const s = e.data[i];
                        s.contentQueries && s.contentQueries(1, n[i], i)
                    }
                }
            }(i, l, o)), null !== r && Ua(o, l), ge
        }

        function se() {
            let e = he();
            js() ? function $s() {
                A.lFrame.isParent = !1
            }() : (e = e.parent, Et(e, !1));
            const t = e;
            !function x_() {
                A.lFrame.elementDepthCount--
            }();
            const n = H();
            return n.firstCreatePass && (ko(n, e), Ns(e) && n.queries.elementEnd(e)), null != t.classesWithoutHost && function J_(e) {
                return 0 != (16 & e.flags)
            }(t) && lu(n, t, y(), t.classesWithoutHost, !0), null != t.stylesWithoutHost && function Y_(e) {
                return 0 != (32 & e.flags)
            }(t) && lu(n, t, y(), t.stylesWithoutHost, !1), se
        }

        function cr(e, t, n, r) {
            return ge(e, t, n, r), se(), cr
        }

        function gi(e) {
            return !!e && "function" == typeof e.then
        }

        const Ph = function xh(e) {
            return !!e && "function" == typeof e.subscribe
        };

        function Ve(e, t, n, r) {
            const o = y(), i = H(), s = he();
            return function Rh(e, t, n, r, o, i, s, a) {
                const u = No(r), c = e.firstCreatePass && Uf(e), d = t[8], f = $f(t);
                let h = !0;
                if (3 & r.type || a) {
                    const _ = Xe(r, t), D = a ? a(_) : _, g = f.length, w = a ? N => a(ue(N[r.index])) : r.index;
                    if (ne(n)) {
                        let N = null;
                        if (!a && u && (N = function Bw(e, t, n, r) {
                            const o = e.cleanup;
                            if (null != o) for (let i = 0; i < o.length - 1; i += 2) {
                                const s = o[i];
                                if (s === n && o[i + 1] === r) {
                                    const a = t[7], u = o[i + 2];
                                    return a.length > u ? a[u] : null
                                }
                                "string" == typeof s && (i += 2)
                            }
                            return null
                        }(e, t, o, r.index)), null !== N) (N.__ngLastListenerFn__ || N).__ngNextListenerFn__ = i, N.__ngLastListenerFn__ = i, h = !1; else {
                            i = fu(r, t, d, i, !1);
                            const j = n.listen(D, o, i);
                            f.push(i, j), c && c.push(o, w, g, g + 1)
                        }
                    } else i = fu(r, t, d, i, !0), D.addEventListener(o, i, s), f.push(i), c && c.push(o, w, g, s)
                } else i = fu(r, t, d, i, !1);
                const p = r.outputs;
                let m;
                if (h && null !== p && (m = p[o])) {
                    const _ = m.length;
                    if (_) for (let D = 0; D < _; D += 2) {
                        const Qe = t[m[D]][m[D + 1]].subscribe(i), In = f.length;
                        f.push(i, Qe), c && c.push(o, r.index, In, -(In + 1))
                    }
                }
            }(i, o, o[P], s, e, t, !!n, r), Ve
        }

        function Vh(e, t, n, r) {
            try {
                return !1 !== n(r)
            } catch (o) {
                return qf(e, o), !1
            }
        }

        function fu(e, t, n, r, o) {
            return function i(s) {
                if (s === Function) return r;
                const a = 2 & e.flags ? $e(e.index, t) : t;
                0 == (32 & t[2]) && Wa(a);
                let u = Vh(t, 0, r, s), l = i.__ngNextListenerFn__;
                for (; l;) u = Vh(t, 0, l, s) && u, l = l.__ngNextListenerFn__;
                return o && !1 === u && (s.preventDefault(), s.returnValue = !1), u
            }
        }

        function hu(e = 1) {
            return function H_(e) {
                return (A.lFrame.contextLView = function j_(e, t) {
                    for (; e > 0;) t = t[15], e--;
                    return t
                }(e, A.lFrame.contextLView))[8]
            }(e)
        }

        function zh(e, t, n, r, o) {
            const i = e[n + 1], s = null === t;
            let a = r ? ct(i) : Lt(i), u = !1;
            for (; 0 !== a && (!1 === u || s);) {
                const c = e[a + 1];
                qw(e[a], t) && (u = !0, e[a + 1] = r ? xa(c) : Fa(c)), a = r ? ct(c) : Lt(c)
            }
            u && (e[n + 1] = r ? Fa(i) : xa(i))
        }

        function qw(e, t) {
            return null === e || null == t || (Array.isArray(e) ? e[1] : e) === t || !(!Array.isArray(e) || "string" != typeof t) && $n(e, t) >= 0
        }

        function mi(e, t) {
            return function ft(e, t, n, r) {
                const o = y(), i = H(), s = function kt(e) {
                    const t = A.lFrame, n = t.bindingIndex;
                    return t.bindingIndex = t.bindingIndex + e, n
                }(2);
                i.firstUpdatePass && function tp(e, t, n, r) {
                    const o = e.data;
                    if (null === o[n + 1]) {
                        const i = o[Se()], s = function ep(e, t) {
                            return t >= e.expandoStartIndex
                        }(e, n);
                        (function ip(e, t) {
                            return 0 != (e.flags & (t ? 16 : 32))
                        })(i, r) && null === t && !s && (t = !1), t = function eb(e, t, n, r) {
                            const o = function Gs(e) {
                                const t = A.lFrame.currentDirectiveIndex;
                                return -1 === t ? null : e[t]
                            }(e);
                            let i = r ? t.residualClasses : t.residualStyles;
                            if (null === o) 0 === (r ? t.classBindings : t.styleBindings) && (n = Zr(n = gu(null, e, t, n, r), t.attrs, r), i = null); else {
                                const s = t.directiveStylingLast;
                                if (-1 === s || e[s] !== o) if (n = gu(o, e, t, n, r), null === i) {
                                    let u = function tb(e, t, n) {
                                        const r = n ? t.classBindings : t.styleBindings;
                                        if (0 !== Lt(r)) return e[ct(r)]
                                    }(e, t, r);
                                    void 0 !== u && Array.isArray(u) && (u = gu(null, e, t, u[1], r), u = Zr(u, t.attrs, r), function nb(e, t, n, r) {
                                        e[ct(n ? t.classBindings : t.styleBindings)] = r
                                    }(e, t, r, u))
                                } else i = function rb(e, t, n) {
                                    let r;
                                    const o = t.directiveEnd;
                                    for (let i = 1 + t.directiveStylingLast; i < o; i++) r = Zr(r, e[i].hostAttrs, n);
                                    return Zr(r, t.attrs, n)
                                }(e, t, r)
                            }
                            return void 0 !== i && (r ? t.residualClasses = i : t.residualStyles = i), n
                        }(o, i, t, r), function Uw(e, t, n, r, o, i) {
                            let s = i ? t.classBindings : t.styleBindings, a = ct(s), u = Lt(s);
                            e[r] = n;
                            let c, l = !1;
                            if (Array.isArray(n)) {
                                const d = n;
                                c = d[1], (null === c || $n(d, c) > 0) && (l = !0)
                            } else c = n;
                            if (o) if (0 !== u) {
                                const f = ct(e[a + 1]);
                                e[r + 1] = ii(f, a), 0 !== f && (e[f + 1] = Na(e[f + 1], r)), e[a + 1] = function XC(e, t) {
                                    return 131071 & e | t << 17
                                }(e[a + 1], r)
                            } else e[r + 1] = ii(a, 0), 0 !== a && (e[a + 1] = Na(e[a + 1], r)), a = r; else e[r + 1] = ii(u, 0), 0 === a ? a = r : e[u + 1] = Na(e[u + 1], r), u = r;
                            l && (e[r + 1] = Fa(e[r + 1])), zh(e, c, r, !0), zh(e, c, r, !1), function Gw(e, t, n, r, o) {
                                const i = o ? e.residualClasses : e.residualStyles;
                                null != i && "string" == typeof t && $n(i, t) >= 0 && (n[r + 1] = xa(n[r + 1]))
                            }(t, c, e, r, i), s = ii(a, u), i ? t.classBindings = s : t.styleBindings = s
                        }(o, i, t, n, s, r)
                    }
                }(i, e, s, r), t !== S && be(o, s, t) && function rp(e, t, n, r, o, i, s, a) {
                    if (!(3 & t.type)) return;
                    const u = e.data, l = u[a + 1];
                    yi(function Df(e) {
                        return 1 == (1 & e)
                    }(l) ? op(u, t, n, o, Lt(l), s) : void 0) || (yi(i) || function yf(e) {
                        return 2 == (2 & e)
                    }(l) && (i = op(u, null, n, o, a, s)), function jC(e, t, n, r, o) {
                        const i = ne(e);
                        if (t) o ? i ? e.addClass(n, r) : n.classList.add(r) : i ? e.removeClass(n, r) : n.classList.remove(r); else {
                            let s = -1 === r.indexOf("-") ? void 0 : Ge.DashCase;
                            if (null == o) i ? e.removeStyle(n, r, s) : n.style.removeProperty(r); else {
                                const a = "string" == typeof o && o.endsWith("!important");
                                a && (o = o.slice(0, -10), s |= Ge.Important), i ? e.setStyle(n, r, o, s) : n.style.setProperty(r, o, a ? "important" : "")
                            }
                        }
                    }(r, s, function xo(e, t) {
                        return ue(t[e])
                    }(Se(), n), o, i))
                }(i, i.data[Se()], o, o[P], e, o[s + 1] = function sb(e, t) {
                    return null == e || ("string" == typeof t ? e += t : "object" == typeof e && (e = U(function Jt(e) {
                        return e instanceof class Id {
                            constructor(t) {
                                this.changingThisBreaksApplicationSecurity = t
                            }

                            toString() {
                                return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`
                            }
                        } ? e.changingThisBreaksApplicationSecurity : e
                    }(e)))), e
                }(t, n), r, s)
            }(e, t, null, !0), mi
        }

        function gu(e, t, n, r, o) {
            let i = null;
            const s = n.directiveEnd;
            let a = n.directiveStylingLast;
            for (-1 === a ? a = n.directiveStart : a++; a < s && (i = t[a], r = Zr(r, i.hostAttrs, o), i !== e);) a++;
            return null !== e && (n.directiveStylingLast = a), r
        }

        function Zr(e, t, n) {
            const r = n ? 1 : 2;
            let o = -1;
            if (null !== t) for (let i = 0; i < t.length; i++) {
                const s = t[i];
                "number" == typeof s ? o = s : o === r && (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]), Ue(e, s, !!n || t[++i]))
            }
            return void 0 === e ? null : e
        }

        function op(e, t, n, r, o, i) {
            const s = null === t;
            let a;
            for (; o > 0;) {
                const u = e[o], l = Array.isArray(u), c = l ? u[1] : u, d = null === c;
                let f = n[o + 1];
                f === S && (f = d ? W : void 0);
                let h = d ? na(f, r) : c === r ? f : void 0;
                if (l && !yi(h) && (h = na(u, r)), yi(h) && (a = h, s)) return a;
                const p = e[o + 1];
                o = s ? ct(p) : Lt(p)
            }
            if (null !== t) {
                let u = i ? t.residualClasses : t.residualStyles;
                null != u && (a = na(u, r))
            }
            return a
        }

        function yi(e) {
            return void 0 !== e
        }

        function We(e, t = "") {
            const n = y(), r = H(), o = e + Z, i = r.firstCreatePass ? Qn(r, o, 1, t, null) : r.data[o],
                s = n[o] = function Ea(e, t) {
                    return ne(e) ? e.createText(t) : e.createTextNode(t)
                }(n[P], t);
            ri(r, n, s, i), Et(i, !1)
        }

        const Di = "en-US";
        let Tp = Di;

        function _u(e, t, n, r, o) {
            if (e = x(e), Array.isArray(e)) for (let i = 0; i < e.length; i++) _u(e[i], t, n, r, o); else {
                const i = H(), s = y();
                let a = Yn(e) ? e : x(e.provide), u = Jf(e);
                const l = he(), c = 1048575 & l.providerIndexes, d = l.directiveStart, f = l.providerIndexes >> 20;
                if (Yn(e) || !e.multi) {
                    const h = new Ar(u, o, v), p = Cu(a, t, o ? c : c + f, d);
                    -1 === p ? (Go(Tr(l, s), i, a), vu(i, e, t.length), t.push(a), l.directiveStart++, l.directiveEnd++, o && (l.providerIndexes += 1048576), n.push(h), s.push(h)) : (n[p] = h, s[p] = h)
                } else {
                    const h = Cu(a, t, c + f, d), p = Cu(a, t, c, c + f), m = h >= 0 && n[h], _ = p >= 0 && n[p];
                    if (o && !_ || !o && !m) {
                        Go(Tr(l, s), i, a);
                        const D = function MM(e, t, n, r, o) {
                            const i = new Ar(e, n, v);
                            return i.multi = [], i.index = t, i.componentProviders = 0, Yp(i, o, r && !n), i
                        }(o ? bM : wM, n.length, o, r, u);
                        !o && _ && (n[p].providerFactory = D), vu(i, e, t.length, 0), t.push(a), l.directiveStart++, l.directiveEnd++, o && (l.providerIndexes += 1048576), n.push(D), s.push(D)
                    } else vu(i, e, h > -1 ? h : p, Yp(n[o ? p : h], u, !o && r));
                    !o && r && _ && n[p].componentProviders++
                }
            }
        }

        function vu(e, t, n, r) {
            const o = Yn(t), i = function zE(e) {
                return !!e.useClass
            }(t);
            if (o || i) {
                const u = (i ? x(t.useClass) : t).prototype.ngOnDestroy;
                if (u) {
                    const l = e.destroyHooks || (e.destroyHooks = []);
                    if (!o && t.multi) {
                        const c = l.indexOf(n);
                        -1 === c ? l.push(n, [r, u]) : l[c + 1].push(r, u)
                    } else l.push(n, u)
                }
            }
        }

        function Yp(e, t, n) {
            return n && e.componentProviders++, e.multi.push(t) - 1
        }

        function Cu(e, t, n, r) {
            for (let o = n; o < r; o++) if (t[o] === e) return o;
            return -1
        }

        function wM(e, t, n, r) {
            return Eu(this.multi, [])
        }

        function bM(e, t, n, r) {
            const o = this.multi;
            let i;
            if (this.providerFactory) {
                const s = this.providerFactory.componentProviders, a = Sr(n, n[1], this.providerFactory.index, r);
                i = a.slice(0, s), Eu(o, i);
                for (let u = s; u < a.length; u++) i.push(a[u])
            } else i = [], Eu(o, i);
            return i
        }

        function Eu(e, t) {
            for (let n = 0; n < e.length; n++) t.push((0, e[n])());
            return t
        }

        function ee(e, t = []) {
            return n => {
                n.providersResolver = (r, o) => function EM(e, t, n) {
                    const r = H();
                    if (r.firstCreatePass) {
                        const o = ut(e);
                        _u(n, r.data, r.blueprint, o, !0), _u(t, r.data, r.blueprint, o, !1)
                    }
                }(r, o ? o(e) : e, t)
            }
        }

        class Xp {
        }

        class TM {
            resolveComponentFactory(t) {
                throw function IM(e) {
                    const t = Error(`No component factory found for ${U(e)}. Did you add it to @NgModule.entryComponents?`);
                    return t.ngComponent = e, t
                }(t)
            }
        }

        let wi = (() => {
            class e {
            }

            return e.NULL = new TM, e
        })();

        function SM() {
            return pr(he(), y())
        }

        function pr(e, t) {
            return new pt(Xe(e, t))
        }

        let pt = (() => {
            class e {
                constructor(n) {
                    this.nativeElement = n
                }
            }

            return e.__NG_ELEMENT_ID__ = SM, e
        })();

        class tg {
        }

        let En = (() => {
            class e {
            }

            return e.__NG_ELEMENT_ID__ = () => function xM() {
                const e = y(), n = $e(he().index, e);
                return function NM(e) {
                    return e[P]
                }(Ct(n) ? n : e)
            }(), e
        })(), PM = (() => {
            class e {
            }

            return e.\u0275prov = $({token: e, providedIn: "root", factory: () => null}), e
        })();

        class bi {
            constructor(t) {
                this.full = t, this.major = t.split(".")[0], this.minor = t.split(".")[1], this.patch = t.split(".").slice(2).join(".")
            }
        }

        const OM = new bi("13.3.2"), wu = {};

        function Mi(e, t, n, r, o = !1) {
            for (; null !== n;) {
                const i = t[n.index];
                if (null !== i && r.push(ue(i)), at(i)) for (let a = 10; a < i.length; a++) {
                    const u = i[a], l = u[1].firstChild;
                    null !== l && Mi(u[1], u, l, r)
                }
                const s = n.type;
                if (8 & s) Mi(e, t, n.child, r); else if (32 & s) {
                    const a = _a(n, t);
                    let u;
                    for (; u = a();) r.push(u)
                } else if (16 & s) {
                    const a = sf(t, n);
                    if (Array.isArray(a)) r.push(...a); else {
                        const u = $r(t[16]);
                        Mi(u[1], u, a, r, !0)
                    }
                }
                n = o ? n.projectionNext : n.next
            }
            return r
        }

        class eo {
            constructor(t, n) {
                this._lView = t, this._cdRefInjectingView = n, this._appRef = null, this._attachedToViewContainer = !1
            }

            get rootNodes() {
                const t = this._lView, n = t[1];
                return Mi(n, t, n.firstChild, [])
            }

            get context() {
                return this._lView[8]
            }

            set context(t) {
                this._lView[8] = t
            }

            get destroyed() {
                return 256 == (256 & this._lView[2])
            }

            destroy() {
                if (this._appRef) this._appRef.detachView(this); else if (this._attachedToViewContainer) {
                    const t = this._lView[3];
                    if (at(t)) {
                        const n = t[8], r = n ? n.indexOf(this) : -1;
                        r > -1 && (ba(t, r), zo(n, r))
                    }
                    this._attachedToViewContainer = !1
                }
                Kd(this._lView[1], this._lView)
            }

            onDestroy(t) {
                !function xf(e, t, n, r) {
                    const o = $f(t);
                    null === n ? o.push(r) : (o.push(n), e.firstCreatePass && Uf(e).push(r, o.length - 1))
                }(this._lView[1], this._lView, null, t)
            }

            markForCheck() {
                Wa(this._cdRefInjectingView || this._lView)
            }

            detach() {
                this._lView[2] &= -129
            }

            reattach() {
                this._lView[2] |= 128
            }

            detectChanges() {
                Za(this._lView[1], this._lView, this.context)
            }

            checkNoChanges() {
                !function RE(e, t, n) {
                    Oo(!0);
                    try {
                        Za(e, t, n)
                    } finally {
                        Oo(!1)
                    }
                }(this._lView[1], this._lView, this.context)
            }

            attachToViewContainerRef() {
                if (this._appRef) throw new B(902, "");
                this._attachedToViewContainer = !0
            }

            detachFromAppRef() {
                this._appRef = null, function NC(e, t) {
                    Ur(e, t, t[P], 2, null, null)
                }(this._lView[1], this._lView)
            }

            attachToAppRef(t) {
                if (this._attachedToViewContainer) throw new B(902, "");
                this._appRef = t
            }
        }

        class RM extends eo {
            constructor(t) {
                super(t), this._view = t
            }

            detectChanges() {
                jf(this._view)
            }

            checkNoChanges() {
                !function VE(e) {
                    Oo(!0);
                    try {
                        jf(e)
                    } finally {
                        Oo(!1)
                    }
                }(this._view)
            }

            get context() {
                return null
            }
        }

        class ng extends wi {
            constructor(t) {
                super(), this.ngModule = t
            }

            resolveComponentFactory(t) {
                const n = ve(t);
                return new bu(n, this.ngModule)
            }
        }

        function rg(e) {
            const t = [];
            for (let n in e) e.hasOwnProperty(n) && t.push({propName: e[n], templateName: n});
            return t
        }

        class bu extends Xp {
            constructor(t, n) {
                super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = function JC(e) {
                    return e.map(KC).join(",")
                }(t.selectors), this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : [], this.isBoundToModule = !!n
            }

            get inputs() {
                return rg(this.componentDef.inputs)
            }

            get outputs() {
                return rg(this.componentDef.outputs)
            }

            create(t, n, r, o) {
                const i = (o = o || this.ngModule) ? function kM(e, t) {
                        return {
                            get: (n, r, o) => {
                                const i = e.get(n, wu, o);
                                return i !== wu || r === wu ? i : t.get(n, r, o)
                            }
                        }
                    }(t, o.injector) : t, s = i.get(tg, Bc), a = i.get(PM, null),
                    u = s.createRenderer(null, this.componentDef), l = this.componentDef.selectors[0][0] || "div",
                    c = r ? function Nf(e, t, n) {
                        if (ne(e)) return e.selectRootElement(t, n === vt.ShadowDom);
                        let r = "string" == typeof t ? e.querySelector(t) : t;
                        return r.textContent = "", r
                    }(u, r, this.componentDef.encapsulation) : wa(s.createRenderer(null, this.componentDef), l, function VM(e) {
                        const t = e.toLowerCase();
                        return "svg" === t ? "svg" : "math" === t ? "math" : null
                    }(l)), d = this.componentDef.onPush ? 576 : 528, f = function lh(e, t) {
                        return {components: [], scheduler: e || wC, clean: kE, playerHandler: t || null, flags: 0}
                    }(), h = ui(0, null, null, 1, 0, null, null, null, null, null),
                    p = Gr(null, h, f, d, null, null, s, u, a, i);
                let m, _;
                Ro(p);
                try {
                    const D = function ah(e, t, n, r, o, i) {
                        const s = n[1];
                        n[20] = e;
                        const u = Qn(s, 20, 2, "#host", null), l = u.mergedAttrs = t.hostAttrs;
                        null !== l && (ci(u, l, !0), null !== e && (Ho(o, e, l), null !== u.classes && Sa(o, e, u.classes), null !== u.styles && lf(o, e, u.styles)));
                        const c = r.createRenderer(e, t),
                            d = Gr(n, Sf(t), null, t.onPush ? 64 : 16, n[20], u, r, c, i || null, null);
                        return s.firstCreatePass && (Go(Tr(u, n), s, t.type), kf(s, u), Lf(u, n.length, 1)), li(n, d), n[20] = d
                    }(c, this.componentDef, p, s, u);
                    if (c) if (r) Ho(u, c, ["ng-version", OM.full]); else {
                        const {attrs: g, classes: w} = function YC(e) {
                            const t = [], n = [];
                            let r = 1, o = 2;
                            for (; r < e.length;) {
                                let i = e[r];
                                if ("string" == typeof i) 2 === o ? "" !== i && t.push(i, e[++r]) : 8 === o && n.push(i); else {
                                    if (!lt(o)) break;
                                    o = i
                                }
                                r++
                            }
                            return {attrs: t, classes: n}
                        }(this.componentDef.selectors[0]);
                        g && Ho(u, c, g), w && w.length > 0 && Sa(u, c, w.join(" "))
                    }
                    if (_ = Ls(h, Z), void 0 !== n) {
                        const g = _.projection = [];
                        for (let w = 0; w < this.ngContentSelectors.length; w++) {
                            const N = n[w];
                            g.push(null != N ? Array.from(N) : null)
                        }
                    }
                    m = function uh(e, t, n, r, o) {
                        const i = n[1], s = function _E(e, t, n) {
                            const r = he();
                            e.firstCreatePass && (n.providersResolver && n.providersResolver(n), Bf(e, r, t, Zn(e, t, 1, null), n));
                            const o = Sr(t, e, r.directiveStart, r);
                            we(o, t);
                            const i = Xe(r, t);
                            return i && we(i, t), o
                        }(i, n, t);
                        if (r.components.push(s), e[8] = s, o && o.forEach(u => u(s, t)), t.contentQueries) {
                            const u = he();
                            t.contentQueries(1, s, u.directiveStart)
                        }
                        const a = he();
                        return !i.firstCreatePass || null === t.hostBindings && null === t.hostAttrs || (Zt(a.index), Rf(n[1], a, 0, a.directiveStart, a.directiveEnd, t), Vf(t, s)), s
                    }(D, this.componentDef, p, f, [rw]), qr(h, p, null)
                } finally {
                    Vo()
                }
                return new BM(this.componentType, m, pr(_, p), p, _)
            }
        }

        class BM extends class AM {
        } {
            constructor(t, n, r, o, i) {
                super(), this.location = r, this._rootLView = o, this._tNode = i, this.instance = n, this.hostView = this.changeDetectorRef = new RM(o), this.componentType = t
            }

            get injector() {
                return new kn(this._tNode, this._rootLView)
            }

            destroy() {
                this.hostView.destroy()
            }

            onDestroy(t) {
                this.hostView.onDestroy(t)
            }
        }

        class gr {
        }

        const mr = new Map;

        class sg extends gr {
            constructor(t, n) {
                super(), this._parent = n, this._bootstrapComponents = [], this.injector = this, this.destroyCbs = [], this.componentFactoryResolver = new ng(this);
                const r = Ke(t);
                this._bootstrapComponents = Mt(r.bootstrap), this._r3Injector = Kf(t, n, [{
                    provide: gr,
                    useValue: this
                }, {
                    provide: wi,
                    useValue: this.componentFactoryResolver
                }], U(t)), this._r3Injector._resolveInjectorDefTypes(), this.instance = this.get(t)
            }

            get(t, n = ze.THROW_IF_NOT_FOUND, r = F.Default) {
                return t === ze || t === gr || t === Ja ? this : this._r3Injector.get(t, n, r)
            }

            destroy() {
                const t = this._r3Injector;
                !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null
            }

            onDestroy(t) {
                this.destroyCbs.push(t)
            }
        }

        class Mu extends class jM {
        } {
            constructor(t) {
                super(), this.moduleType = t, null !== Ke(t) && function $M(e) {
                    const t = new Set;
                    !function n(r) {
                        const o = Ke(r, !0), i = o.id;
                        null !== i && (function og(e, t, n) {
                            if (t && t !== n) throw new Error(`Duplicate module registered for ${e} - ${U(t)} vs ${U(t.name)}`)
                        }(i, mr.get(i), r), mr.set(i, r));
                        const s = Mt(o.imports);
                        for (const a of s) t.has(a) || (t.add(a), n(a))
                    }(e)
                }(t)
            }

            create(t) {
                return new sg(this.moduleType, t)
            }
        }

        function Au(e) {
            return t => {
                setTimeout(e, void 0, t)
            }
        }

        const Me = class a0 extends gs {
            constructor(t = !1) {
                super(), this.__isAsync = t
            }

            emit(t) {
                super.next(t)
            }

            subscribe(t, n, r) {
                var o, i, s;
                let a = t, u = n || (() => null), l = r;
                if (t && "object" == typeof t) {
                    const d = t;
                    a = null === (o = d.next) || void 0 === o ? void 0 : o.bind(d), u = null === (i = d.error) || void 0 === i ? void 0 : i.bind(d), l = null === (s = d.complete) || void 0 === s ? void 0 : s.bind(d)
                }
                this.__isAsync && (u = Au(u), a && (a = Au(a)), l && (l = Au(l)));
                const c = super.subscribe({next: a, error: u, complete: l});
                return t instanceof _t && t.add(c), c
            }
        };
        Symbol;
        let jt = (() => {
            class e {
            }

            return e.__NG_ELEMENT_ID__ = d0, e
        })();
        const l0 = jt, c0 = class extends l0 {
            constructor(t, n, r) {
                super(), this._declarationLView = t, this._declarationTContainer = n, this.elementRef = r
            }

            createEmbeddedView(t) {
                const n = this._declarationTContainer.tViews,
                    r = Gr(this._declarationLView, n, t, 16, null, n.declTNode, null, null, null, null);
                r[17] = this._declarationLView[this._declarationTContainer.index];
                const i = this._declarationLView[19];
                return null !== i && (r[19] = i.createEmbeddedView(n)), qr(n, r, t), new eo(r)
            }
        };

        function d0() {
            return function Ai(e, t) {
                return 4 & e.type ? new c0(t, e, pr(e, t)) : null
            }(he(), y())
        }

        let Ft = (() => {
            class e {
            }

            return e.__NG_ELEMENT_ID__ = f0, e
        })();

        function f0() {
            return function pg(e, t) {
                let n;
                const r = t[e.index];
                if (at(r)) n = r; else {
                    let o;
                    if (8 & e.type) o = ue(r); else {
                        const i = t[P];
                        o = i.createComment("");
                        const s = Xe(e, t);
                        _n(i, ni(i, s), o, function LC(e, t) {
                            return ne(e) ? e.nextSibling(t) : t.nextSibling
                        }(i, s), !1)
                    }
                    t[e.index] = n = Hf(r, t, o, e), li(t, n)
                }
                return new fg(n, e, t)
            }(he(), y())
        }

        const h0 = Ft, fg = class extends h0 {
            constructor(t, n, r) {
                super(), this._lContainer = t, this._hostTNode = n, this._hostLView = r
            }

            get element() {
                return pr(this._hostTNode, this._hostLView)
            }

            get injector() {
                return new kn(this._hostTNode, this._hostLView)
            }

            get parentInjector() {
                const t = Uo(this._hostTNode, this._hostLView);
                if (nd(t)) {
                    const n = Vn(t, this._hostLView), r = Rn(t);
                    return new kn(n[1].data[r + 8], n)
                }
                return new kn(null, this._hostLView)
            }

            clear() {
                for (; this.length > 0;) this.remove(this.length - 1)
            }

            get(t) {
                const n = hg(this._lContainer);
                return null !== n && n[t] || null
            }

            get length() {
                return this._lContainer.length - 10
            }

            createEmbeddedView(t, n, r) {
                const o = t.createEmbeddedView(n || {});
                return this.insert(o, r), o
            }

            createComponent(t, n, r, o, i) {
                const s = t && !function Nr(e) {
                    return "function" == typeof e
                }(t);
                let a;
                if (s) a = n; else {
                    const d = n || {};
                    a = d.index, r = d.injector, o = d.projectableNodes, i = d.ngModuleRef
                }
                const u = s ? t : new bu(ve(t)), l = r || this.parentInjector;
                if (!i && null == u.ngModule) {
                    const f = (s ? l : this.parentInjector).get(gr, null);
                    f && (i = f)
                }
                const c = u.create(l, o, void 0, i);
                return this.insert(c.hostView, a), c
            }

            insert(t, n) {
                const r = t._lView, o = r[1];
                if (function S_(e) {
                    return at(e[3])
                }(r)) {
                    const c = this.indexOf(t);
                    if (-1 !== c) this.detach(c); else {
                        const d = r[3], f = new fg(d, d[6], d[3]);
                        f.detach(f.indexOf(t))
                    }
                }
                const i = this._adjustIndex(n), s = this._lContainer;
                !function PC(e, t, n, r) {
                    const o = 10 + r, i = n.length;
                    r > 0 && (n[o - 1][4] = t), r < i - 10 ? (t[4] = n[o], fd(n, 10 + r, t)) : (n.push(t), t[4] = null), t[3] = n;
                    const s = t[17];
                    null !== s && n !== s && function OC(e, t) {
                        const n = e[9];
                        t[16] !== t[3][3][16] && (e[2] = !0), null === n ? e[9] = [t] : n.push(t)
                    }(s, t);
                    const a = t[19];
                    null !== a && a.insertView(e), t[2] |= 128
                }(o, r, s, i);
                const a = Ia(i, s), u = r[P], l = ni(u, s[7]);
                return null !== l && function FC(e, t, n, r, o, i) {
                    r[0] = o, r[6] = t, Ur(e, r, n, 1, o, i)
                }(o, s[6], u, r, l, a), t.attachToViewContainerRef(), fd(Tu(s), i, t), t
            }

            move(t, n) {
                return this.insert(t, n)
            }

            indexOf(t) {
                const n = hg(this._lContainer);
                return null !== n ? n.indexOf(t) : -1
            }

            remove(t) {
                const n = this._adjustIndex(t, -1), r = ba(this._lContainer, n);
                r && (zo(Tu(this._lContainer), n), Kd(r[1], r))
            }

            detach(t) {
                const n = this._adjustIndex(t, -1), r = ba(this._lContainer, n);
                return r && null != zo(Tu(this._lContainer), n) ? new eo(r) : null
            }

            _adjustIndex(t, n = 0) {
                return null == t ? this.length + n : t
            }
        };

        function hg(e) {
            return e[8]
        }

        function Tu(e) {
            return e[8] || (e[8] = [])
        }

        function Si(...e) {
        }

        const Vg = new L("Application Initializer");
        let Bu = (() => {
            class e {
                constructor(n) {
                    this.appInits = n, this.resolve = Si, this.reject = Si, this.initialized = !1, this.done = !1, this.donePromise = new Promise((r, o) => {
                        this.resolve = r, this.reject = o
                    })
                }

                runInitializers() {
                    if (this.initialized) return;
                    const n = [], r = () => {
                        this.done = !0, this.resolve()
                    };
                    if (this.appInits) for (let o = 0; o < this.appInits.length; o++) {
                        const i = this.appInits[o]();
                        if (gi(i)) n.push(i); else if (Ph(i)) {
                            const s = new Promise((a, u) => {
                                i.subscribe({complete: a, error: u})
                            });
                            n.push(s)
                        }
                    }
                    Promise.all(n).then(() => {
                        r()
                    }).catch(o => {
                        this.reject(o)
                    }), 0 === n.length && r(), this.initialized = !0
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(Vg, 8))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac, providedIn: "root"}), e
        })();
        const oo = new L("AppId", {
            providedIn: "root", factory: function kg() {
                return `${Hu()}${Hu()}${Hu()}`
            }
        });

        function Hu() {
            return String.fromCharCode(97 + Math.floor(25 * Math.random()))
        }

        const Lg = new L("Platform Initializer"), Fi = new L("Platform ID"), U0 = new L("appBootstrapListener");
        let G0 = (() => {
            class e {
                log(n) {
                    console.log(n)
                }

                warn(n) {
                    console.warn(n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();
        const tn = new L("LocaleId", {
            providedIn: "root",
            factory: () => vv(tn, F.Optional | F.SkipSelf) || function q0() {
                return "undefined" != typeof $localize && $localize.locale || Di
            }()
        }), Z0 = (() => Promise.resolve(0))();

        function ju(e) {
            "undefined" == typeof Zone ? Z0.then(() => {
                e && e.apply(null, null)
            }) : Zone.current.scheduleMicroTask("scheduleMicrotask", e)
        }

        class ke {
            constructor({
                            enableLongStackTrace: t = !1,
                            shouldCoalesceEventChangeDetection: n = !1,
                            shouldCoalesceRunChangeDetection: r = !1
                        }) {
                if (this.hasPendingMacrotasks = !1, this.hasPendingMicrotasks = !1, this.isStable = !0, this.onUnstable = new Me(!1), this.onMicrotaskEmpty = new Me(!1), this.onStable = new Me(!1), this.onError = new Me(!1), "undefined" == typeof Zone) throw new Error("In this configuration Angular requires Zone.js");
                Zone.assertZonePatched();
                const o = this;
                o._nesting = 0, o._outer = o._inner = Zone.current, Zone.TaskTrackingZoneSpec && (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec)), t && Zone.longStackTraceZoneSpec && (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)), o.shouldCoalesceEventChangeDetection = !r && n, o.shouldCoalesceRunChangeDetection = r, o.lastRequestAnimationFrameId = -1, o.nativeRequestAnimationFrame = function K0() {
                    let e = q.requestAnimationFrame, t = q.cancelAnimationFrame;
                    if ("undefined" != typeof Zone && e && t) {
                        const n = e[Zone.__symbol__("OriginalDelegate")];
                        n && (e = n);
                        const r = t[Zone.__symbol__("OriginalDelegate")];
                        r && (t = r)
                    }
                    return {nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: t}
                }().nativeRequestAnimationFrame, function X0(e) {
                    const t = () => {
                        !function Y0(e) {
                            e.isCheckStableRunning || -1 !== e.lastRequestAnimationFrameId || (e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(q, () => {
                                e.fakeTopEventTask || (e.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
                                    e.lastRequestAnimationFrameId = -1, Uu(e), e.isCheckStableRunning = !0, $u(e), e.isCheckStableRunning = !1
                                }, void 0, () => {
                                }, () => {
                                })), e.fakeTopEventTask.invoke()
                            }), Uu(e))
                        }(e)
                    };
                    e._inner = e._inner.fork({
                        name: "angular",
                        properties: {isAngularZone: !0},
                        onInvokeTask: (n, r, o, i, s, a) => {
                            try {
                                return Bg(e), n.invokeTask(o, i, s, a)
                            } finally {
                                (e.shouldCoalesceEventChangeDetection && "eventTask" === i.type || e.shouldCoalesceRunChangeDetection) && t(), Hg(e)
                            }
                        },
                        onInvoke: (n, r, o, i, s, a, u) => {
                            try {
                                return Bg(e), n.invoke(o, i, s, a, u)
                            } finally {
                                e.shouldCoalesceRunChangeDetection && t(), Hg(e)
                            }
                        },
                        onHasTask: (n, r, o, i) => {
                            n.hasTask(o, i), r === o && ("microTask" == i.change ? (e._hasPendingMicrotasks = i.microTask, Uu(e), $u(e)) : "macroTask" == i.change && (e.hasPendingMacrotasks = i.macroTask))
                        },
                        onHandleError: (n, r, o, i) => (n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1)
                    })
                }(o)
            }

            static isInAngularZone() {
                return "undefined" != typeof Zone && !0 === Zone.current.get("isAngularZone")
            }

            static assertInAngularZone() {
                if (!ke.isInAngularZone()) throw new Error("Expected to be in Angular Zone, but it is not!")
            }

            static assertNotInAngularZone() {
                if (ke.isInAngularZone()) throw new Error("Expected to not be in Angular Zone, but it is!")
            }

            run(t, n, r) {
                return this._inner.run(t, n, r)
            }

            runTask(t, n, r, o) {
                const i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + o, t, J0, Si, Si);
                try {
                    return i.runTask(s, n, r)
                } finally {
                    i.cancelTask(s)
                }
            }

            runGuarded(t, n, r) {
                return this._inner.runGuarded(t, n, r)
            }

            runOutsideAngular(t) {
                return this._outer.run(t)
            }
        }

        const J0 = {};

        function $u(e) {
            if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable) try {
                e._nesting++, e.onMicrotaskEmpty.emit(null)
            } finally {
                if (e._nesting--, !e.hasPendingMicrotasks) try {
                    e.runOutsideAngular(() => e.onStable.emit(null))
                } finally {
                    e.isStable = !0
                }
            }
        }

        function Uu(e) {
            e.hasPendingMicrotasks = !!(e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && -1 !== e.lastRequestAnimationFrameId)
        }

        function Bg(e) {
            e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null))
        }

        function Hg(e) {
            e._nesting--, $u(e)
        }

        class eA {
            constructor() {
                this.hasPendingMicrotasks = !1, this.hasPendingMacrotasks = !1, this.isStable = !0, this.onUnstable = new Me, this.onMicrotaskEmpty = new Me, this.onStable = new Me, this.onError = new Me
            }

            run(t, n, r) {
                return t.apply(n, r)
            }

            runGuarded(t, n, r) {
                return t.apply(n, r)
            }

            runOutsideAngular(t) {
                return t()
            }

            runTask(t, n, r, o) {
                return t.apply(n, r)
            }
        }

        let Gu = (() => {
            class e {
                constructor(n) {
                    this._ngZone = n, this._pendingCount = 0, this._isZoneStable = !0, this._didWork = !1, this._callbacks = [], this.taskTrackingZone = null, this._watchAngularEvents(), n.run(() => {
                        this.taskTrackingZone = "undefined" == typeof Zone ? null : Zone.current.get("TaskTrackingZone")
                    })
                }

                _watchAngularEvents() {
                    this._ngZone.onUnstable.subscribe({
                        next: () => {
                            this._didWork = !0, this._isZoneStable = !1
                        }
                    }), this._ngZone.runOutsideAngular(() => {
                        this._ngZone.onStable.subscribe({
                            next: () => {
                                ke.assertNotInAngularZone(), ju(() => {
                                    this._isZoneStable = !0, this._runCallbacksIfReady()
                                })
                            }
                        })
                    })
                }

                increasePendingRequestCount() {
                    return this._pendingCount += 1, this._didWork = !0, this._pendingCount
                }

                decreasePendingRequestCount() {
                    if (this._pendingCount -= 1, this._pendingCount < 0) throw new Error("pending async requests below zero");
                    return this._runCallbacksIfReady(), this._pendingCount
                }

                isStable() {
                    return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks
                }

                _runCallbacksIfReady() {
                    if (this.isStable()) ju(() => {
                        for (; 0 !== this._callbacks.length;) {
                            let n = this._callbacks.pop();
                            clearTimeout(n.timeoutId), n.doneCb(this._didWork)
                        }
                        this._didWork = !1
                    }); else {
                        let n = this.getPendingTasks();
                        this._callbacks = this._callbacks.filter(r => !r.updateCb || !r.updateCb(n) || (clearTimeout(r.timeoutId), !1)), this._didWork = !0
                    }
                }

                getPendingTasks() {
                    return this.taskTrackingZone ? this.taskTrackingZone.macroTasks.map(n => ({
                        source: n.source,
                        creationLocation: n.creationLocation,
                        data: n.data
                    })) : []
                }

                addCallback(n, r, o) {
                    let i = -1;
                    r && r > 0 && (i = setTimeout(() => {
                        this._callbacks = this._callbacks.filter(s => s.timeoutId !== i), n(this._didWork, this.getPendingTasks())
                    }, r)), this._callbacks.push({doneCb: n, timeoutId: i, updateCb: o})
                }

                whenStable(n, r, o) {
                    if (o && !this.taskTrackingZone) throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?');
                    this.addCallback(n, r, o), this._runCallbacksIfReady()
                }

                getPendingRequestCount() {
                    return this._pendingCount
                }

                findProviders(n, r, o) {
                    return []
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(ke))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })(), jg = (() => {
            class e {
                constructor() {
                    this._applications = new Map, qu.addToWindow(this)
                }

                registerApplication(n, r) {
                    this._applications.set(n, r)
                }

                unregisterApplication(n) {
                    this._applications.delete(n)
                }

                unregisterAllApplications() {
                    this._applications.clear()
                }

                getTestability(n) {
                    return this._applications.get(n) || null
                }

                getAllTestabilities() {
                    return Array.from(this._applications.values())
                }

                getAllRootElements() {
                    return Array.from(this._applications.keys())
                }

                findTestabilityInTree(n, r = !0) {
                    return qu.findTestabilityInTree(this, n, r)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();

        class tA {
            addToWindow(t) {
            }

            findTestabilityInTree(t, n, r) {
                return null
            }
        }

        let gt, qu = new tA;
        const $g = new L("AllowMultipleToken");

        function Ug(e, t, n = []) {
            const r = `Platform: ${t}`, o = new L(r);
            return (i = []) => {
                let s = Gg();
                if (!s || s.injector.get($g, !1)) if (e) e(n.concat(i).concat({provide: o, useValue: !0})); else {
                    const a = n.concat(i).concat({provide: o, useValue: !0}, {provide: Ya, useValue: "platform"});
                    !function iA(e) {
                        if (gt && !gt.destroyed && !gt.injector.get($g, !1)) throw new B(400, "");
                        gt = e.get(qg);
                        const t = e.get(Lg, null);
                        t && t.forEach(n => n())
                    }(ze.create({providers: a, name: r}))
                }
                return function sA(e) {
                    const t = Gg();
                    if (!t) throw new B(401, "");
                    return t
                }()
            }
        }

        function Gg() {
            return gt && !gt.destroyed ? gt : null
        }

        let qg = (() => {
            class e {
                constructor(n) {
                    this._injector = n, this._modules = [], this._destroyListeners = [], this._destroyed = !1
                }

                bootstrapModuleFactory(n, r) {
                    const a = function aA(e, t) {
                        let n;
                        return n = "noop" === e ? new eA : ("zone.js" === e ? void 0 : e) || new ke({
                            enableLongStackTrace: !1,
                            shouldCoalesceEventChangeDetection: !!(null == t ? void 0 : t.ngZoneEventCoalescing),
                            shouldCoalesceRunChangeDetection: !!(null == t ? void 0 : t.ngZoneRunCoalescing)
                        }), n
                    }(r ? r.ngZone : void 0, {
                        ngZoneEventCoalescing: r && r.ngZoneEventCoalescing || !1,
                        ngZoneRunCoalescing: r && r.ngZoneRunCoalescing || !1
                    }), u = [{provide: ke, useValue: a}];
                    return a.run(() => {
                        const l = ze.create({providers: u, parent: this.injector, name: n.moduleType.name}),
                            c = n.create(l), d = c.injector.get(jr, null);
                        if (!d) throw new B(402, "");
                        return a.runOutsideAngular(() => {
                            const f = a.onError.subscribe({
                                next: h => {
                                    d.handleError(h)
                                }
                            });
                            c.onDestroy(() => {
                                zu(this._modules, c), f.unsubscribe()
                            })
                        }), function uA(e, t, n) {
                            try {
                                const r = n();
                                return gi(r) ? r.catch(o => {
                                    throw t.runOutsideAngular(() => e.handleError(o)), o
                                }) : r
                            } catch (r) {
                                throw t.runOutsideAngular(() => e.handleError(r)), r
                            }
                        }(d, a, () => {
                            const f = c.injector.get(Bu);
                            return f.runInitializers(), f.donePromise.then(() => (function Nb(e) {
                                He(e, "Expected localeId to be defined"), "string" == typeof e && (Tp = e.toLowerCase().replace(/_/g, "-"))
                            }(c.injector.get(tn, Di) || Di), this._moduleDoBootstrap(c), c))
                        })
                    })
                }

                bootstrapModule(n, r = []) {
                    const o = zg({}, r);
                    return function rA(e, t, n) {
                        const r = new Mu(n);
                        return Promise.resolve(r)
                    }(0, 0, n).then(i => this.bootstrapModuleFactory(i, o))
                }

                _moduleDoBootstrap(n) {
                    const r = n.injector.get(Wg);
                    if (n._bootstrapComponents.length > 0) n._bootstrapComponents.forEach(o => r.bootstrap(o)); else {
                        if (!n.instance.ngDoBootstrap) throw new B(403, "");
                        n.instance.ngDoBootstrap(r)
                    }
                    this._modules.push(n)
                }

                onDestroy(n) {
                    this._destroyListeners.push(n)
                }

                get injector() {
                    return this._injector
                }

                destroy() {
                    if (this._destroyed) throw new B(404, "");
                    this._modules.slice().forEach(n => n.destroy()), this._destroyListeners.forEach(n => n()), this._destroyed = !0
                }

                get destroyed() {
                    return this._destroyed
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(ze))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();

        function zg(e, t) {
            return Array.isArray(t) ? t.reduce(zg, e) : Object.assign(Object.assign({}, e), t)
        }

        let Wg = (() => {
            class e {
                constructor(n, r, o, i, s) {
                    this._zone = n, this._injector = r, this._exceptionHandler = o, this._componentFactoryResolver = i, this._initStatus = s, this._bootstrapListeners = [], this._views = [], this._runningTick = !1, this._stable = !0, this.componentTypes = [], this.components = [], this._onMicrotaskEmptySubscription = this._zone.onMicrotaskEmpty.subscribe({
                        next: () => {
                            this._zone.run(() => {
                                this.tick()
                            })
                        }
                    });
                    const a = new _e(l => {
                        this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks, this._zone.runOutsideAngular(() => {
                            l.next(this._stable), l.complete()
                        })
                    }), u = new _e(l => {
                        let c;
                        this._zone.runOutsideAngular(() => {
                            c = this._zone.onStable.subscribe(() => {
                                ke.assertNotInAngularZone(), ju(() => {
                                    !this._stable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks && (this._stable = !0, l.next(!0))
                                })
                            })
                        });
                        const d = this._zone.onUnstable.subscribe(() => {
                            ke.assertInAngularZone(), this._stable && (this._stable = !1, this._zone.runOutsideAngular(() => {
                                l.next(!1)
                            }))
                        });
                        return () => {
                            c.unsubscribe(), d.unsubscribe()
                        }
                    });
                    this.isStable = function WD(...e) {
                        const t = Cc(e), n = function HD(e, t) {
                            return "number" == typeof Ds(e) ? e.pop() : t
                        }(e, 1 / 0), r = e;
                        return r.length ? 1 === r.length ? hn(r[0]) : function VD(e = 1 / 0) {
                            return Eo(oc, e)
                        }(n)(wo(r, t)) : ys
                    }(a, u.pipe(function ZD(e = {}) {
                        const {
                            connector: t = (() => new gs),
                            resetOnError: n = !0,
                            resetOnComplete: r = !0,
                            resetOnRefCountZero: o = !0
                        } = e;
                        return i => {
                            let s = null, a = null, u = null, l = 0, c = !1, d = !1;
                            const f = () => {
                                null == a || a.unsubscribe(), a = null
                            }, h = () => {
                                f(), s = u = null, c = d = !1
                            }, p = () => {
                                const m = s;
                                h(), null == m || m.unsubscribe()
                            };
                            return ln((m, _) => {
                                l++, !d && !c && f();
                                const D = u = null != u ? u : t();
                                _.add(() => {
                                    l--, 0 === l && !d && !c && (a = _s(p, o))
                                }), D.subscribe(_), s || (s = new vo({
                                    next: g => D.next(g), error: g => {
                                        d = !0, f(), a = _s(h, n, g), D.error(g)
                                    }, complete: () => {
                                        c = !0, f(), a = _s(h, r), D.complete()
                                    }
                                }), wo(m).subscribe(s))
                            })(i)
                        }
                    }()))
                }

                bootstrap(n, r) {
                    if (!this._initStatus.done) throw new B(405, "");
                    let o;
                    o = n instanceof Xp ? n : this._componentFactoryResolver.resolveComponentFactory(n), this.componentTypes.push(o.componentType);
                    const i = function oA(e) {
                            return e.isBoundToModule
                        }(o) ? void 0 : this._injector.get(gr), a = o.create(ze.NULL, [], r || o.selector, i),
                        u = a.location.nativeElement, l = a.injector.get(Gu, null), c = l && a.injector.get(jg);
                    return l && c && c.registerApplication(u, l), a.onDestroy(() => {
                        this.detachView(a.hostView), zu(this.components, a), c && c.unregisterApplication(u)
                    }), this._loadComponent(a), a
                }

                tick() {
                    if (this._runningTick) throw new B(101, "");
                    try {
                        this._runningTick = !0;
                        for (let n of this._views) n.detectChanges()
                    } catch (n) {
                        this._zone.runOutsideAngular(() => this._exceptionHandler.handleError(n))
                    } finally {
                        this._runningTick = !1
                    }
                }

                attachView(n) {
                    const r = n;
                    this._views.push(r), r.attachToAppRef(this)
                }

                detachView(n) {
                    const r = n;
                    zu(this._views, r), r.detachFromAppRef()
                }

                _loadComponent(n) {
                    this.attachView(n.hostView), this.tick(), this.components.push(n), this._injector.get(U0, []).concat(this._bootstrapListeners).forEach(o => o(n))
                }

                ngOnDestroy() {
                    this._views.slice().forEach(n => n.destroy()), this._onMicrotaskEmptySubscription.unsubscribe()
                }

                get viewCount() {
                    return this._views.length
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(ke), V(ze), V(jr), V(wi), V(Bu))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac, providedIn: "root"}), e
        })();

        function zu(e, t) {
            const n = e.indexOf(t);
            n > -1 && e.splice(n, 1)
        }

        let Zg = !0;

        class tm {
            constructor() {
            }

            supports(t) {
                return Wr(t)
            }

            create(t) {
                return new DA(t)
            }
        }

        const yA = (e, t) => t;

        class DA {
            constructor(t) {
                this.length = 0, this._linkedRecords = null, this._unlinkedRecords = null, this._previousItHead = null, this._itHead = null, this._itTail = null, this._additionsHead = null, this._additionsTail = null, this._movesHead = null, this._movesTail = null, this._removalsHead = null, this._removalsTail = null, this._identityChangesHead = null, this._identityChangesTail = null, this._trackByFn = t || yA
            }

            forEachItem(t) {
                let n;
                for (n = this._itHead; null !== n; n = n._next) t(n)
            }

            forEachOperation(t) {
                let n = this._itHead, r = this._removalsHead, o = 0, i = null;
                for (; n || r;) {
                    const s = !r || n && n.currentIndex < rm(r, o, i) ? n : r, a = rm(s, o, i), u = s.currentIndex;
                    if (s === r) o--, r = r._nextRemoved; else if (n = n._next, null == s.previousIndex) o++; else {
                        i || (i = []);
                        const l = a - o, c = u - o;
                        if (l != c) {
                            for (let f = 0; f < l; f++) {
                                const h = f < i.length ? i[f] : i[f] = 0, p = h + f;
                                c <= p && p < l && (i[f] = h + 1)
                            }
                            i[s.previousIndex] = c - l
                        }
                    }
                    a !== u && t(s, a, u)
                }
            }

            forEachPreviousItem(t) {
                let n;
                for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n)
            }

            forEachAddedItem(t) {
                let n;
                for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n)
            }

            forEachMovedItem(t) {
                let n;
                for (n = this._movesHead; null !== n; n = n._nextMoved) t(n)
            }

            forEachRemovedItem(t) {
                let n;
                for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n)
            }

            forEachIdentityChange(t) {
                let n;
                for (n = this._identityChangesHead; null !== n; n = n._nextIdentityChange) t(n)
            }

            diff(t) {
                if (null == t && (t = []), !Wr(t)) throw new B(900, "");
                return this.check(t) ? this : null
            }

            onDestroy() {
            }

            check(t) {
                this._reset();
                let o, i, s, n = this._itHead, r = !1;
                if (Array.isArray(t)) {
                    this.length = t.length;
                    for (let a = 0; a < this.length; a++) i = t[a], s = this._trackByFn(a, i), null !== n && Object.is(n.trackById, s) ? (r && (n = this._verifyReinsertion(n, i, s, a)), Object.is(n.item, i) || this._addIdentityChange(n, i)) : (n = this._mismatch(n, i, s, a), r = !0), n = n._next
                } else o = 0, function hw(e, t) {
                    if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]); else {
                        const n = e[Xn()]();
                        let r;
                        for (; !(r = n.next()).done;) t(r.value)
                    }
                }(t, a => {
                    s = this._trackByFn(o, a), null !== n && Object.is(n.trackById, s) ? (r && (n = this._verifyReinsertion(n, a, s, o)), Object.is(n.item, a) || this._addIdentityChange(n, a)) : (n = this._mismatch(n, a, s, o), r = !0), n = n._next, o++
                }), this.length = o;
                return this._truncate(n), this.collection = t, this.isDirty
            }

            get isDirty() {
                return null !== this._additionsHead || null !== this._movesHead || null !== this._removalsHead || null !== this._identityChangesHead
            }

            _reset() {
                if (this.isDirty) {
                    let t;
                    for (t = this._previousItHead = this._itHead; null !== t; t = t._next) t._nextPrevious = t._next;
                    for (t = this._additionsHead; null !== t; t = t._nextAdded) t.previousIndex = t.currentIndex;
                    for (this._additionsHead = this._additionsTail = null, t = this._movesHead; null !== t; t = t._nextMoved) t.previousIndex = t.currentIndex;
                    this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null
                }
            }

            _mismatch(t, n, r, o) {
                let i;
                return null === t ? i = this._itTail : (i = t._prev, this._remove(t)), null !== (t = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null)) ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, o)) : null !== (t = null === this._linkedRecords ? null : this._linkedRecords.get(r, o)) ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, o)) : t = this._addAfter(new _A(n, r), i, o), t
            }

            _verifyReinsertion(t, n, r, o) {
                let i = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(r, null);
                return null !== i ? t = this._reinsertAfter(i, t._prev, o) : t.currentIndex != o && (t.currentIndex = o, this._addToMoves(t, o)), t
            }

            _truncate(t) {
                for (; null !== t;) {
                    const n = t._next;
                    this._addToRemovals(this._unlink(t)), t = n
                }
                null !== this._unlinkedRecords && this._unlinkedRecords.clear(), null !== this._additionsTail && (this._additionsTail._nextAdded = null), null !== this._movesTail && (this._movesTail._nextMoved = null), null !== this._itTail && (this._itTail._next = null), null !== this._removalsTail && (this._removalsTail._nextRemoved = null), null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null)
            }

            _reinsertAfter(t, n, r) {
                null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
                const o = t._prevRemoved, i = t._nextRemoved;
                return null === o ? this._removalsHead = i : o._nextRemoved = i, null === i ? this._removalsTail = o : i._prevRemoved = o, this._insertAfter(t, n, r), this._addToMoves(t, r), t
            }

            _moveAfter(t, n, r) {
                return this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t
            }

            _addAfter(t, n, r) {
                return this._insertAfter(t, n, r), this._additionsTail = null === this._additionsTail ? this._additionsHead = t : this._additionsTail._nextAdded = t, t
            }

            _insertAfter(t, n, r) {
                const o = null === n ? this._itHead : n._next;
                return t._next = o, t._prev = n, null === o ? this._itTail = t : o._prev = t, null === n ? this._itHead = t : n._next = t, null === this._linkedRecords && (this._linkedRecords = new nm), this._linkedRecords.put(t), t.currentIndex = r, t
            }

            _remove(t) {
                return this._addToRemovals(this._unlink(t))
            }

            _unlink(t) {
                null !== this._linkedRecords && this._linkedRecords.remove(t);
                const n = t._prev, r = t._next;
                return null === n ? this._itHead = r : n._next = r, null === r ? this._itTail = n : r._prev = n, t
            }

            _addToMoves(t, n) {
                return t.previousIndex === n || (this._movesTail = null === this._movesTail ? this._movesHead = t : this._movesTail._nextMoved = t), t
            }

            _addToRemovals(t) {
                return null === this._unlinkedRecords && (this._unlinkedRecords = new nm), this._unlinkedRecords.put(t), t.currentIndex = null, t._nextRemoved = null, null === this._removalsTail ? (this._removalsTail = this._removalsHead = t, t._prevRemoved = null) : (t._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = t), t
            }

            _addIdentityChange(t, n) {
                return t.item = n, this._identityChangesTail = null === this._identityChangesTail ? this._identityChangesHead = t : this._identityChangesTail._nextIdentityChange = t, t
            }
        }

        class _A {
            constructor(t, n) {
                this.item = t, this.trackById = n, this.currentIndex = null, this.previousIndex = null, this._nextPrevious = null, this._prev = null, this._next = null, this._prevDup = null, this._nextDup = null, this._prevRemoved = null, this._nextRemoved = null, this._nextAdded = null, this._nextMoved = null, this._nextIdentityChange = null
            }
        }

        class vA {
            constructor() {
                this._head = null, this._tail = null
            }

            add(t) {
                null === this._head ? (this._head = this._tail = t, t._nextDup = null, t._prevDup = null) : (this._tail._nextDup = t, t._prevDup = this._tail, t._nextDup = null, this._tail = t)
            }

            get(t, n) {
                let r;
                for (r = this._head; null !== r; r = r._nextDup) if ((null === n || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
                return null
            }

            remove(t) {
                const n = t._prevDup, r = t._nextDup;
                return null === n ? this._head = r : n._nextDup = r, null === r ? this._tail = n : r._prevDup = n, null === this._head
            }
        }

        class nm {
            constructor() {
                this.map = new Map
            }

            put(t) {
                const n = t.trackById;
                let r = this.map.get(n);
                r || (r = new vA, this.map.set(n, r)), r.add(t)
            }

            get(t, n) {
                const o = this.map.get(t);
                return o ? o.get(t, n) : null
            }

            remove(t) {
                const n = t.trackById;
                return this.map.get(n).remove(t) && this.map.delete(n), t
            }

            get isEmpty() {
                return 0 === this.map.size
            }

            clear() {
                this.map.clear()
            }
        }

        function rm(e, t, n) {
            const r = e.previousIndex;
            if (null === r) return r;
            let o = 0;
            return n && r < n.length && (o = n[r]), r + t + o
        }

        function im() {
            return new Pi([new tm])
        }

        let Pi = (() => {
            class e {
                constructor(n) {
                    this.factories = n
                }

                static create(n, r) {
                    if (null != r) {
                        const o = r.factories.slice();
                        n = n.concat(o)
                    }
                    return new e(n)
                }

                static extend(n) {
                    return {provide: e, useFactory: r => e.create(n, r || im()), deps: [[e, new Ko, new Zo]]}
                }

                find(n) {
                    const r = this.factories.find(o => o.supports(n));
                    if (null != r) return r;
                    throw new B(901, "")
                }
            }

            return e.\u0275prov = $({token: e, providedIn: "root", factory: im}), e
        })();
        const MA = Ug(null, "core", [{provide: Fi, useValue: "unknown"}, {provide: qg, deps: [ze]}, {
            provide: jg,
            deps: []
        }, {provide: G0, deps: []}]);
        let AA = (() => {
            class e {
                constructor(n) {
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(Wg))
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({}), e
        })(), Oi = null;

        function bn() {
            return Oi
        }

        const mt = new L("DocumentToken");

        function ym(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
                const r = n.indexOf("="), [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
                if (o.trim() === t) return decodeURIComponent(i)
            }
            return null
        }

        class yI {
            constructor(t, n, r, o) {
                this.$implicit = t, this.ngForOf = n, this.index = r, this.count = o
            }

            get first() {
                return 0 === this.index
            }

            get last() {
                return this.index === this.count - 1
            }

            get even() {
                return this.index % 2 == 0
            }

            get odd() {
                return !this.even
            }
        }

        let Dm = (() => {
            class e {
                constructor(n, r, o) {
                    this._viewContainer = n, this._template = r, this._differs = o, this._ngForOf = null, this._ngForOfDirty = !0, this._differ = null
                }

                set ngForOf(n) {
                    this._ngForOf = n, this._ngForOfDirty = !0
                }

                set ngForTrackBy(n) {
                    this._trackByFn = n
                }

                get ngForTrackBy() {
                    return this._trackByFn
                }

                set ngForTemplate(n) {
                    n && (this._template = n)
                }

                ngDoCheck() {
                    if (this._ngForOfDirty) {
                        this._ngForOfDirty = !1;
                        const n = this._ngForOf;
                        !this._differ && n && (this._differ = this._differs.find(n).create(this.ngForTrackBy))
                    }
                    if (this._differ) {
                        const n = this._differ.diff(this._ngForOf);
                        n && this._applyChanges(n)
                    }
                }

                _applyChanges(n) {
                    const r = this._viewContainer;
                    n.forEachOperation((o, i, s) => {
                        if (null == o.previousIndex) r.createEmbeddedView(this._template, new yI(o.item, this._ngForOf, -1, -1), null === s ? void 0 : s); else if (null == s) r.remove(null === i ? void 0 : i); else if (null !== i) {
                            const a = r.get(i);
                            r.move(a, s), _m(a, o)
                        }
                    });
                    for (let o = 0, i = r.length; o < i; o++) {
                        const a = r.get(o).context;
                        a.index = o, a.count = i, a.ngForOf = this._ngForOf
                    }
                    n.forEachIdentityChange(o => {
                        _m(r.get(o.currentIndex), o)
                    })
                }

                static ngTemplateContextGuard(n, r) {
                    return !0
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(Ft), v(jt), v(Pi))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["", "ngFor", "", "ngForOf", ""]],
                inputs: {ngForOf: "ngForOf", ngForTrackBy: "ngForTrackBy", ngForTemplate: "ngForTemplate"}
            }), e
        })();

        function _m(e, t) {
            e.context.$implicit = t.item
        }

        let vm = (() => {
            class e {
                constructor(n, r) {
                    this._viewContainer = n, this._context = new DI, this._thenTemplateRef = null, this._elseTemplateRef = null, this._thenViewRef = null, this._elseViewRef = null, this._thenTemplateRef = r
                }

                set ngIf(n) {
                    this._context.$implicit = this._context.ngIf = n, this._updateView()
                }

                set ngIfThen(n) {
                    Cm("ngIfThen", n), this._thenTemplateRef = n, this._thenViewRef = null, this._updateView()
                }

                set ngIfElse(n) {
                    Cm("ngIfElse", n), this._elseTemplateRef = n, this._elseViewRef = null, this._updateView()
                }

                _updateView() {
                    this._context.$implicit ? this._thenViewRef || (this._viewContainer.clear(), this._elseViewRef = null, this._thenTemplateRef && (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context))) : this._elseViewRef || (this._viewContainer.clear(), this._thenViewRef = null, this._elseTemplateRef && (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)))
                }

                static ngTemplateContextGuard(n, r) {
                    return !0
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(Ft), v(jt))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["", "ngIf", ""]],
                inputs: {ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse"}
            }), e
        })();

        class DI {
            constructor() {
                this.$implicit = null, this.ngIf = null
            }
        }

        function Cm(e, t) {
            if (t && !t.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${U(t)}'.`)
        }

        let qI = (() => {
            class e {
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({}), e
        })();

        class Am {
        }

        class cl extends class KI extends class SA {
        } {
            constructor() {
                super(...arguments), this.supportsDOMEvents = !0
            }
        } {
            static makeCurrent() {
                !function TA(e) {
                    Oi || (Oi = e)
                }(new cl)
            }

            onAndCancel(t, n, r) {
                return t.addEventListener(n, r, !1), () => {
                    t.removeEventListener(n, r, !1)
                }
            }

            dispatchEvent(t, n) {
                t.dispatchEvent(n)
            }

            remove(t) {
                t.parentNode && t.parentNode.removeChild(t)
            }

            createElement(t, n) {
                return (n = n || this.getDefaultDocument()).createElement(t)
            }

            createHtmlDocument() {
                return document.implementation.createHTMLDocument("fakeTitle")
            }

            getDefaultDocument() {
                return document
            }

            isElementNode(t) {
                return t.nodeType === Node.ELEMENT_NODE
            }

            isShadowRoot(t) {
                return t instanceof DocumentFragment
            }

            getGlobalEventTarget(t, n) {
                return "window" === n ? window : "document" === n ? t : "body" === n ? t.body : null
            }

            getBaseHref(t) {
                const n = function JI() {
                    return uo = uo || document.querySelector("base"), uo ? uo.getAttribute("href") : null
                }();
                return null == n ? null : function YI(e) {
                    Gi = Gi || document.createElement("a"), Gi.setAttribute("href", e);
                    const t = Gi.pathname;
                    return "/" === t.charAt(0) ? t : `/${t}`
                }(n)
            }

            resetBaseElement() {
                uo = null
            }

            getUserAgent() {
                return window.navigator.userAgent
            }

            getCookie(t) {
                return ym(document.cookie, t)
            }
        }

        let Gi, uo = null;
        const Im = new L("TRANSITION_ID"), eT = [{
            provide: Vg, useFactory: function XI(e, t, n) {
                return () => {
                    n.get(Bu).donePromise.then(() => {
                        const r = bn(), o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                        for (let i = 0; i < o.length; i++) r.remove(o[i])
                    })
                }
            }, deps: [Im, mt, ze], multi: !0
        }];

        class dl {
            static init() {
                !function nA(e) {
                    qu = e
                }(new dl)
            }

            addToWindow(t) {
                q.getAngularTestability = (r, o = !0) => {
                    const i = t.findTestabilityInTree(r, o);
                    if (null == i) throw new Error("Could not find testability for element.");
                    return i
                }, q.getAllAngularTestabilities = () => t.getAllTestabilities(), q.getAllAngularRootElements = () => t.getAllRootElements(), q.frameworkStabilizers || (q.frameworkStabilizers = []), q.frameworkStabilizers.push(r => {
                    const o = q.getAllAngularTestabilities();
                    let i = o.length, s = !1;
                    const a = function (u) {
                        s = s || u, i--, 0 == i && r(s)
                    };
                    o.forEach(function (u) {
                        u.whenStable(a)
                    })
                })
            }

            findTestabilityInTree(t, n, r) {
                if (null == n) return null;
                const o = t.getTestability(n);
                return null != o ? o : r ? bn().isShadowRoot(n) ? this.findTestabilityInTree(t, n.host, !0) : this.findTestabilityInTree(t, n.parentElement, !0) : null
            }
        }

        let tT = (() => {
            class e {
                build() {
                    return new XMLHttpRequest
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();
        const qi = new L("EventManagerPlugins");
        let zi = (() => {
            class e {
                constructor(n, r) {
                    this._zone = r, this._eventNameToPlugin = new Map, n.forEach(o => o.manager = this), this._plugins = n.slice().reverse()
                }

                addEventListener(n, r, o) {
                    return this._findPluginFor(r).addEventListener(n, r, o)
                }

                addGlobalEventListener(n, r, o) {
                    return this._findPluginFor(r).addGlobalEventListener(n, r, o)
                }

                getZone() {
                    return this._zone
                }

                _findPluginFor(n) {
                    const r = this._eventNameToPlugin.get(n);
                    if (r) return r;
                    const o = this._plugins;
                    for (let i = 0; i < o.length; i++) {
                        const s = o[i];
                        if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s
                    }
                    throw new Error(`No event manager plugin found for event ${n}`)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(qi), V(ke))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();

        class Tm {
            constructor(t) {
                this._doc = t
            }

            addGlobalEventListener(t, n, r) {
                const o = bn().getGlobalEventTarget(this._doc, t);
                if (!o) throw new Error(`Unsupported event target ${o} for event ${n}`);
                return this.addEventListener(o, n, r)
            }
        }

        let Sm = (() => {
            class e {
                constructor() {
                    this._stylesSet = new Set
                }

                addStyles(n) {
                    const r = new Set;
                    n.forEach(o => {
                        this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o))
                    }), this.onStylesAdded(r)
                }

                onStylesAdded(n) {
                }

                getAllStyles() {
                    return Array.from(this._stylesSet)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })(), lo = (() => {
            class e extends Sm {
                constructor(n) {
                    super(), this._doc = n, this._hostNodes = new Map, this._hostNodes.set(n.head, [])
                }

                _addStylesToHost(n, r, o) {
                    n.forEach(i => {
                        const s = this._doc.createElement("style");
                        s.textContent = i, o.push(r.appendChild(s))
                    })
                }

                addHost(n) {
                    const r = [];
                    this._addStylesToHost(this._stylesSet, n, r), this._hostNodes.set(n, r)
                }

                removeHost(n) {
                    const r = this._hostNodes.get(n);
                    r && r.forEach(Fm), this._hostNodes.delete(n)
                }

                onStylesAdded(n) {
                    this._hostNodes.forEach((r, o) => {
                        this._addStylesToHost(n, o, r)
                    })
                }

                ngOnDestroy() {
                    this._hostNodes.forEach(n => n.forEach(Fm))
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(mt))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();

        function Fm(e) {
            bn().remove(e)
        }

        const fl = {
            svg: "http://www.w3.org/2000/svg",
            xhtml: "http://www.w3.org/1999/xhtml",
            xlink: "http://www.w3.org/1999/xlink",
            xml: "http://www.w3.org/XML/1998/namespace",
            xmlns: "http://www.w3.org/2000/xmlns/",
            math: "http://www.w3.org/1998/MathML/"
        }, hl = /%COMP%/g;

        function Wi(e, t, n) {
            for (let r = 0; r < t.length; r++) {
                let o = t[r];
                Array.isArray(o) ? Wi(e, o, n) : (o = o.replace(hl, e), n.push(o))
            }
            return n
        }

        function Pm(e) {
            return t => {
                if ("__ngUnwrap__" === t) return e;
                !1 === e(t) && (t.preventDefault(), t.returnValue = !1)
            }
        }

        let pl = (() => {
            class e {
                constructor(n, r, o) {
                    this.eventManager = n, this.sharedStylesHost = r, this.appId = o, this.rendererByCompId = new Map, this.defaultRenderer = new gl(n)
                }

                createRenderer(n, r) {
                    if (!n || !r) return this.defaultRenderer;
                    switch (r.encapsulation) {
                        case vt.Emulated: {
                            let o = this.rendererByCompId.get(r.id);
                            return o || (o = new aT(this.eventManager, this.sharedStylesHost, r, this.appId), this.rendererByCompId.set(r.id, o)), o.applyToHost(n), o
                        }
                        case 1:
                        case vt.ShadowDom:
                            return new uT(this.eventManager, this.sharedStylesHost, n, r);
                        default:
                            if (!this.rendererByCompId.has(r.id)) {
                                const o = Wi(r.id, r.styles, []);
                                this.sharedStylesHost.addStyles(o), this.rendererByCompId.set(r.id, this.defaultRenderer)
                            }
                            return this.defaultRenderer
                    }
                }

                begin() {
                }

                end() {
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(zi), V(lo), V(oo))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();

        class gl {
            constructor(t) {
                this.eventManager = t, this.data = Object.create(null), this.destroyNode = null
            }

            destroy() {
            }

            createElement(t, n) {
                return n ? document.createElementNS(fl[n] || n, t) : document.createElement(t)
            }

            createComment(t) {
                return document.createComment(t)
            }

            createText(t) {
                return document.createTextNode(t)
            }

            appendChild(t, n) {
                t.appendChild(n)
            }

            insertBefore(t, n, r) {
                t && t.insertBefore(n, r)
            }

            removeChild(t, n) {
                t && t.removeChild(n)
            }

            selectRootElement(t, n) {
                let r = "string" == typeof t ? document.querySelector(t) : t;
                if (!r) throw new Error(`The selector "${t}" did not match any elements`);
                return n || (r.textContent = ""), r
            }

            parentNode(t) {
                return t.parentNode
            }

            nextSibling(t) {
                return t.nextSibling
            }

            setAttribute(t, n, r, o) {
                if (o) {
                    n = o + ":" + n;
                    const i = fl[o];
                    i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)
                } else t.setAttribute(n, r)
            }

            removeAttribute(t, n, r) {
                if (r) {
                    const o = fl[r];
                    o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`)
                } else t.removeAttribute(n)
            }

            addClass(t, n) {
                t.classList.add(n)
            }

            removeClass(t, n) {
                t.classList.remove(n)
            }

            setStyle(t, n, r, o) {
                o & (Ge.DashCase | Ge.Important) ? t.style.setProperty(n, r, o & Ge.Important ? "important" : "") : t.style[n] = r
            }

            removeStyle(t, n, r) {
                r & Ge.DashCase ? t.style.removeProperty(n) : t.style[n] = ""
            }

            setProperty(t, n, r) {
                t[n] = r
            }

            setValue(t, n) {
                t.nodeValue = n
            }

            listen(t, n, r) {
                return "string" == typeof t ? this.eventManager.addGlobalEventListener(t, n, Pm(r)) : this.eventManager.addEventListener(t, n, Pm(r))
            }
        }

        class aT extends gl {
            constructor(t, n, r, o) {
                super(t), this.component = r;
                const i = Wi(o + "-" + r.id, r.styles, []);
                n.addStyles(i), this.contentAttr = function oT(e) {
                    return "_ngcontent-%COMP%".replace(hl, e)
                }(o + "-" + r.id), this.hostAttr = function iT(e) {
                    return "_nghost-%COMP%".replace(hl, e)
                }(o + "-" + r.id)
            }

            applyToHost(t) {
                super.setAttribute(t, this.hostAttr, "")
            }

            createElement(t, n) {
                const r = super.createElement(t, n);
                return super.setAttribute(r, this.contentAttr, ""), r
            }
        }

        class uT extends gl {
            constructor(t, n, r, o) {
                super(t), this.sharedStylesHost = n, this.hostEl = r, this.shadowRoot = r.attachShadow({mode: "open"}), this.sharedStylesHost.addHost(this.shadowRoot);
                const i = Wi(o.id, o.styles, []);
                for (let s = 0; s < i.length; s++) {
                    const a = document.createElement("style");
                    a.textContent = i[s], this.shadowRoot.appendChild(a)
                }
            }

            nodeOrShadowRoot(t) {
                return t === this.hostEl ? this.shadowRoot : t
            }

            destroy() {
                this.sharedStylesHost.removeHost(this.shadowRoot)
            }

            appendChild(t, n) {
                return super.appendChild(this.nodeOrShadowRoot(t), n)
            }

            insertBefore(t, n, r) {
                return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
            }

            removeChild(t, n) {
                return super.removeChild(this.nodeOrShadowRoot(t), n)
            }

            parentNode(t) {
                return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
            }
        }

        let lT = (() => {
            class e extends Tm {
                constructor(n) {
                    super(n)
                }

                supports(n) {
                    return !0
                }

                addEventListener(n, r, o) {
                    return n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o)
                }

                removeEventListener(n, r, o) {
                    return n.removeEventListener(r, o)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(mt))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();
        const Rm = ["alt", "control", "meta", "shift"], dT = {
            "\b": "Backspace",
            "\t": "Tab",
            "\x7f": "Delete",
            "\x1b": "Escape",
            Del: "Delete",
            Esc: "Escape",
            Left: "ArrowLeft",
            Right: "ArrowRight",
            Up: "ArrowUp",
            Down: "ArrowDown",
            Menu: "ContextMenu",
            Scroll: "ScrollLock",
            Win: "OS"
        }, Vm = {
            A: "1",
            B: "2",
            C: "3",
            D: "4",
            E: "5",
            F: "6",
            G: "7",
            H: "8",
            I: "9",
            J: "*",
            K: "+",
            M: "-",
            N: ".",
            O: "/",
            "`": "0",
            "\x90": "NumLock"
        }, fT = {alt: e => e.altKey, control: e => e.ctrlKey, meta: e => e.metaKey, shift: e => e.shiftKey};
        let hT = (() => {
            class e extends Tm {
                constructor(n) {
                    super(n)
                }

                supports(n) {
                    return null != e.parseEventName(n)
                }

                addEventListener(n, r, o) {
                    const i = e.parseEventName(r), s = e.eventCallback(i.fullKey, o, this.manager.getZone());
                    return this.manager.getZone().runOutsideAngular(() => bn().onAndCancel(n, i.domEventName, s))
                }

                static parseEventName(n) {
                    const r = n.toLowerCase().split("."), o = r.shift();
                    if (0 === r.length || "keydown" !== o && "keyup" !== o) return null;
                    const i = e._normalizeKey(r.pop());
                    let s = "";
                    if (Rm.forEach(u => {
                        const l = r.indexOf(u);
                        l > -1 && (r.splice(l, 1), s += u + ".")
                    }), s += i, 0 != r.length || 0 === i.length) return null;
                    const a = {};
                    return a.domEventName = o, a.fullKey = s, a
                }

                static getEventFullKey(n) {
                    let r = "", o = function pT(e) {
                        let t = e.key;
                        if (null == t) {
                            if (t = e.keyIdentifier, null == t) return "Unidentified";
                            t.startsWith("U+") && (t = String.fromCharCode(parseInt(t.substring(2), 16)), 3 === e.location && Vm.hasOwnProperty(t) && (t = Vm[t]))
                        }
                        return dT[t] || t
                    }(n);
                    return o = o.toLowerCase(), " " === o ? o = "space" : "." === o && (o = "dot"), Rm.forEach(i => {
                        i != o && fT[i](n) && (r += i + ".")
                    }), r += o, r
                }

                static eventCallback(n, r, o) {
                    return i => {
                        e.getEventFullKey(i) === n && o.runGuarded(() => r(i))
                    }
                }

                static _normalizeKey(n) {
                    return "esc" === n ? "escape" : n
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(mt))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();
        const DT = Ug(MA, "browser", [{provide: Fi, useValue: "browser"}, {
            provide: Lg, useValue: function gT() {
                cl.makeCurrent(), dl.init()
            }, multi: !0
        }, {
            provide: mt, useFactory: function yT() {
                return function M_(e) {
                    Vs = e
                }(document), document
            }, deps: []
        }]), _T = [{provide: Ya, useValue: "root"}, {
            provide: jr, useFactory: function mT() {
                return new jr
            }, deps: []
        }, {provide: qi, useClass: lT, multi: !0, deps: [mt, ke, Fi]}, {
            provide: qi,
            useClass: hT,
            multi: !0,
            deps: [mt]
        }, {provide: pl, useClass: pl, deps: [zi, lo, oo]}, {provide: tg, useExisting: pl}, {
            provide: Sm,
            useExisting: lo
        }, {provide: lo, useClass: lo, deps: [mt]}, {provide: Gu, useClass: Gu, deps: [ke]}, {
            provide: zi,
            useClass: zi,
            deps: [qi, ke]
        }, {provide: Am, useClass: tT, deps: []}];
        let vT = (() => {
            class e {
                constructor(n) {
                    if (n) throw new Error("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.")
                }

                static withServerTransition(n) {
                    return {
                        ngModule: e,
                        providers: [{provide: oo, useValue: n.appId}, {provide: Im, useExisting: oo}, eT]
                    }
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(e, 12))
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({providers: _T, imports: [qI, AA]}), e
        })();
        "undefined" != typeof window && window;
        const {isArray: NT} = Array, {getPrototypeOf: xT, prototype: PT, keys: OT} = Object;
        const {isArray: kT} = Array;

        function HT(e, t) {
            return e.reduce((n, r, o) => (n[r] = t[o], n), {})
        }

        function jT(...e) {
            const t = function BD(e) {
                return Y(Ds(e)) ? e.pop() : void 0
            }(e), {args: n, keys: r} = function RT(e) {
                if (1 === e.length) {
                    const t = e[0];
                    if (NT(t)) return {args: t, keys: null};
                    if (function VT(e) {
                        return e && "object" == typeof e && xT(e) === PT
                    }(t)) {
                        const n = OT(t);
                        return {args: n.map(r => t[r]), keys: n}
                    }
                }
                return {args: e, keys: null}
            }(e), o = new _e(i => {
                const {length: s} = n;
                if (!s) return void i.complete();
                const a = new Array(s);
                let u = s, l = s;
                for (let c = 0; c < s; c++) {
                    let d = !1;
                    hn(n[c]).subscribe(cn(i, f => {
                        d || (d = !0, l--), a[c] = f
                    }, () => u--, void 0, () => {
                        (!u || !d) && (l || i.next(r ? HT(r, a) : a), i.complete())
                    }))
                }
            });
            return t ? o.pipe(function BT(e) {
                return dn(t => function LT(e, t) {
                    return kT(t) ? e(...t) : e(t)
                }(e, t))
            }(t)) : o
        }

        let Bm = (() => {
            class e {
                constructor(n, r) {
                    this._renderer = n, this._elementRef = r, this.onChange = o => {
                    }, this.onTouched = () => {
                    }
                }

                setProperty(n, r) {
                    this._renderer.setProperty(this._elementRef.nativeElement, n, r)
                }

                registerOnTouched(n) {
                    this.onTouched = n
                }

                registerOnChange(n) {
                    this.onChange = n
                }

                setDisabledState(n) {
                    this.setProperty("disabled", n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(En), v(pt))
            }, e.\u0275dir = T({type: e}), e
        })(), Mn = (() => {
            class e extends Bm {
            }

            return e.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = Ee(e)))(r || e)
                }
            }(), e.\u0275dir = T({type: e, features: [G]}), e
        })();
        const Nt = new L("NgValueAccessor"), UT = {provide: Nt, useExisting: Q(() => Qi), multi: !0},
            qT = new L("CompositionEventMode");
        let Qi = (() => {
            class e extends Bm {
                constructor(n, r, o) {
                    super(n, r), this._compositionMode = o, this._composing = !1, null == this._compositionMode && (this._compositionMode = !function GT() {
                        const e = bn() ? bn().getUserAgent() : "";
                        return /android (\d+)/.test(e.toLowerCase())
                    }())
                }

                writeValue(n) {
                    this.setProperty("value", null == n ? "" : n)
                }

                _handleInput(n) {
                    (!this._compositionMode || this._compositionMode && !this._composing) && this.onChange(n)
                }

                _compositionStart() {
                    this._composing = !0
                }

                _compositionEnd(n) {
                    this._composing = !1, this._compositionMode && this.onChange(n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(En), v(pt), v(qT, 8))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]],
                hostBindings: function (n, r) {
                    1 & n && Ve("input", function (i) {
                        return r._handleInput(i.target.value)
                    })("blur", function () {
                        return r.onTouched()
                    })("compositionstart", function () {
                        return r._compositionStart()
                    })("compositionend", function (i) {
                        return r._compositionEnd(i.target.value)
                    })
                },
                features: [ee([UT]), G]
            }), e
        })();

        function rn(e) {
            return null == e || 0 === e.length
        }

        function jm(e) {
            return null != e && "number" == typeof e.length
        }

        const Ae = new L("NgValidators"), on = new L("NgAsyncValidators"),
            zT = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        class co {
            static min(t) {
                return function $m(e) {
                    return t => {
                        if (rn(t.value) || rn(e)) return null;
                        const n = parseFloat(t.value);
                        return !isNaN(n) && n < e ? {min: {min: e, actual: t.value}} : null
                    }
                }(t)
            }

            static max(t) {
                return function Um(e) {
                    return t => {
                        if (rn(t.value) || rn(e)) return null;
                        const n = parseFloat(t.value);
                        return !isNaN(n) && n > e ? {max: {max: e, actual: t.value}} : null
                    }
                }(t)
            }

            static required(t) {
                return function Gm(e) {
                    return rn(e.value) ? {required: !0} : null
                }(t)
            }

            static requiredTrue(t) {
                return function qm(e) {
                    return !0 === e.value ? null : {required: !0}
                }(t)
            }

            static email(t) {
                return function zm(e) {
                    return rn(e.value) || zT.test(e.value) ? null : {email: !0}
                }(t)
            }

            static minLength(t) {
                return function Wm(e) {
                    return t => rn(t.value) || !jm(t.value) ? null : t.value.length < e ? {
                        minlength: {
                            requiredLength: e,
                            actualLength: t.value.length
                        }
                    } : null
                }(t)
            }

            static maxLength(t) {
                return function Qm(e) {
                    return t => jm(t.value) && t.value.length > e ? {
                        maxlength: {
                            requiredLength: e,
                            actualLength: t.value.length
                        }
                    } : null
                }(t)
            }

            static pattern(t) {
                return function Zm(e) {
                    if (!e) return Zi;
                    let t, n;
                    return "string" == typeof e ? (n = "", "^" !== e.charAt(0) && (n += "^"), n += e, "$" !== e.charAt(e.length - 1) && (n += "$"), t = new RegExp(n)) : (n = e.toString(), t = e), r => {
                        if (rn(r.value)) return null;
                        const o = r.value;
                        return t.test(o) ? null : {pattern: {requiredPattern: n, actualValue: o}}
                    }
                }(t)
            }

            static nullValidator(t) {
                return null
            }

            static compose(t) {
                return ty(t)
            }

            static composeAsync(t) {
                return ny(t)
            }
        }

        function Zi(e) {
            return null
        }

        function Km(e) {
            return null != e
        }

        function Jm(e) {
            const t = gi(e) ? wo(e) : e;
            return Ph(t), t
        }

        function Ym(e) {
            let t = {};
            return e.forEach(n => {
                t = null != n ? Object.assign(Object.assign({}, t), n) : t
            }), 0 === Object.keys(t).length ? null : t
        }

        function Xm(e, t) {
            return t.map(n => n(e))
        }

        function ey(e) {
            return e.map(t => function WT(e) {
                return !e.validate
            }(t) ? t : n => t.validate(n))
        }

        function ty(e) {
            if (!e) return null;
            const t = e.filter(Km);
            return 0 == t.length ? null : function (n) {
                return Ym(Xm(n, t))
            }
        }

        function yl(e) {
            return null != e ? ty(ey(e)) : null
        }

        function ny(e) {
            if (!e) return null;
            const t = e.filter(Km);
            return 0 == t.length ? null : function (n) {
                return jT(Xm(n, t).map(Jm)).pipe(dn(Ym))
            }
        }

        function Dl(e) {
            return null != e ? ny(ey(e)) : null
        }

        function ry(e, t) {
            return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t]
        }

        function oy(e) {
            return e._rawValidators
        }

        function iy(e) {
            return e._rawAsyncValidators
        }

        function _l(e) {
            return e ? Array.isArray(e) ? e : [e] : []
        }

        function Ki(e, t) {
            return Array.isArray(e) ? e.includes(t) : e === t
        }

        function sy(e, t) {
            const n = _l(t);
            return _l(e).forEach(o => {
                Ki(n, o) || n.push(o)
            }), n
        }

        function ay(e, t) {
            return _l(t).filter(n => !Ki(e, n))
        }

        class uy {
            constructor() {
                this._rawValidators = [], this._rawAsyncValidators = [], this._onDestroyCallbacks = []
            }

            get value() {
                return this.control ? this.control.value : null
            }

            get valid() {
                return this.control ? this.control.valid : null
            }

            get invalid() {
                return this.control ? this.control.invalid : null
            }

            get pending() {
                return this.control ? this.control.pending : null
            }

            get disabled() {
                return this.control ? this.control.disabled : null
            }

            get enabled() {
                return this.control ? this.control.enabled : null
            }

            get errors() {
                return this.control ? this.control.errors : null
            }

            get pristine() {
                return this.control ? this.control.pristine : null
            }

            get dirty() {
                return this.control ? this.control.dirty : null
            }

            get touched() {
                return this.control ? this.control.touched : null
            }

            get status() {
                return this.control ? this.control.status : null
            }

            get untouched() {
                return this.control ? this.control.untouched : null
            }

            get statusChanges() {
                return this.control ? this.control.statusChanges : null
            }

            get valueChanges() {
                return this.control ? this.control.valueChanges : null
            }

            get path() {
                return null
            }

            _setValidators(t) {
                this._rawValidators = t || [], this._composedValidatorFn = yl(this._rawValidators)
            }

            _setAsyncValidators(t) {
                this._rawAsyncValidators = t || [], this._composedAsyncValidatorFn = Dl(this._rawAsyncValidators)
            }

            get validator() {
                return this._composedValidatorFn || null
            }

            get asyncValidator() {
                return this._composedAsyncValidatorFn || null
            }

            _registerOnDestroy(t) {
                this._onDestroyCallbacks.push(t)
            }

            _invokeOnDestroyCallbacks() {
                this._onDestroyCallbacks.forEach(t => t()), this._onDestroyCallbacks = []
            }

            reset(t) {
                this.control && this.control.reset(t)
            }

            hasError(t, n) {
                return !!this.control && this.control.hasError(t, n)
            }

            getError(t, n) {
                return this.control ? this.control.getError(t, n) : null
            }
        }

        class sn extends uy {
            constructor() {
                super(...arguments), this._parent = null, this.name = null, this.valueAccessor = null
            }
        }

        class Pe extends uy {
            get formDirective() {
                return null
            }

            get path() {
                return null
            }
        }

        class ly {
            constructor(t) {
                this._cd = t
            }

            is(t) {
                var n, r, o;
                return "submitted" === t ? !!(null === (n = this._cd) || void 0 === n ? void 0 : n.submitted) : !!(null === (o = null === (r = this._cd) || void 0 === r ? void 0 : r.control) || void 0 === o ? void 0 : o[t])
            }
        }

        let cy = (() => {
            class e extends ly {
                constructor(n) {
                    super(n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(sn, 2))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]],
                hostVars: 14,
                hostBindings: function (n, r) {
                    2 & n && mi("ng-untouched", r.is("untouched"))("ng-touched", r.is("touched"))("ng-pristine", r.is("pristine"))("ng-dirty", r.is("dirty"))("ng-valid", r.is("valid"))("ng-invalid", r.is("invalid"))("ng-pending", r.is("pending"))
                },
                features: [G]
            }), e
        })(), dy = (() => {
            class e extends ly {
                constructor(n) {
                    super(n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(Pe, 10))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]],
                hostVars: 16,
                hostBindings: function (n, r) {
                    2 & n && mi("ng-untouched", r.is("untouched"))("ng-touched", r.is("touched"))("ng-pristine", r.is("pristine"))("ng-dirty", r.is("dirty"))("ng-valid", r.is("valid"))("ng-invalid", r.is("invalid"))("ng-pending", r.is("pending"))("ng-submitted", r.is("submitted"))
                },
                features: [G]
            }), e
        })();

        function Yi(e, t) {
            return [...t.path, e]
        }

        function fo(e, t) {
            El(e, t), t.valueAccessor.writeValue(e.value), function tS(e, t) {
                t.valueAccessor.registerOnChange(n => {
                    e._pendingValue = n, e._pendingChange = !0, e._pendingDirty = !0, "change" === e.updateOn && hy(e, t)
                })
            }(e, t), function rS(e, t) {
                const n = (r, o) => {
                    t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r)
                };
                e.registerOnChange(n), t._registerOnDestroy(() => {
                    e._unregisterOnChange(n)
                })
            }(e, t), function nS(e, t) {
                t.valueAccessor.registerOnTouched(() => {
                    e._pendingTouched = !0, "blur" === e.updateOn && e._pendingChange && hy(e, t), "submit" !== e.updateOn && e.markAsTouched()
                })
            }(e, t), function eS(e, t) {
                if (t.valueAccessor.setDisabledState) {
                    const n = r => {
                        t.valueAccessor.setDisabledState(r)
                    };
                    e.registerOnDisabledChange(n), t._registerOnDestroy(() => {
                        e._unregisterOnDisabledChange(n)
                    })
                }
            }(e, t)
        }

        function Xi(e, t, n = !0) {
            const r = () => {
            };
            t.valueAccessor && (t.valueAccessor.registerOnChange(r), t.valueAccessor.registerOnTouched(r)), ts(e, t), e && (t._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {
            }))
        }

        function es(e, t) {
            e.forEach(n => {
                n.registerOnValidatorChange && n.registerOnValidatorChange(t)
            })
        }

        function El(e, t) {
            const n = oy(e);
            null !== t.validator ? e.setValidators(ry(n, t.validator)) : "function" == typeof n && e.setValidators([n]);
            const r = iy(e);
            null !== t.asyncValidator ? e.setAsyncValidators(ry(r, t.asyncValidator)) : "function" == typeof r && e.setAsyncValidators([r]);
            const o = () => e.updateValueAndValidity();
            es(t._rawValidators, o), es(t._rawAsyncValidators, o)
        }

        function ts(e, t) {
            let n = !1;
            if (null !== e) {
                if (null !== t.validator) {
                    const o = oy(e);
                    if (Array.isArray(o) && o.length > 0) {
                        const i = o.filter(s => s !== t.validator);
                        i.length !== o.length && (n = !0, e.setValidators(i))
                    }
                }
                if (null !== t.asyncValidator) {
                    const o = iy(e);
                    if (Array.isArray(o) && o.length > 0) {
                        const i = o.filter(s => s !== t.asyncValidator);
                        i.length !== o.length && (n = !0, e.setAsyncValidators(i))
                    }
                }
            }
            const r = () => {
            };
            return es(t._rawValidators, r), es(t._rawAsyncValidators, r), n
        }

        function hy(e, t) {
            e._pendingDirty && e.markAsDirty(), e.setValue(e._pendingValue, {emitModelToViewChange: !1}), t.viewToModelUpdate(e._pendingValue), e._pendingChange = !1
        }

        function Ml(e, t) {
            const n = e.indexOf(t);
            n > -1 && e.splice(n, 1)
        }

        const ho = "VALID", ns = "INVALID", Dr = "PENDING", po = "DISABLED";

        function Il(e) {
            return (rs(e) ? e.validators : e) || null
        }

        function yy(e) {
            return Array.isArray(e) ? yl(e) : e || null
        }

        function Tl(e, t) {
            return (rs(t) ? t.asyncValidators : e) || null
        }

        function Dy(e) {
            return Array.isArray(e) ? Dl(e) : e || null
        }

        function rs(e) {
            return null != e && !Array.isArray(e) && "object" == typeof e
        }

        const Sl = e => e instanceof Nl, os = e => e instanceof is, _y = e => e instanceof wy;

        function vy(e) {
            return Sl(e) ? e.value : e.getRawValue()
        }

        function Cy(e, t) {
            const n = os(e), r = e.controls;
            if (!(n ? Object.keys(r) : r).length) throw new B(1e3, "");
            if (!r[t]) throw new B(1001, "")
        }

        function Ey(e, t) {
            os(e), e._forEachChild((r, o) => {
                if (void 0 === t[o]) throw new B(1002, "")
            })
        }

        class Fl {
            constructor(t, n) {
                this._pendingDirty = !1, this._hasOwnPendingAsyncValidator = !1, this._pendingTouched = !1, this._onCollectionChange = () => {
                }, this._parent = null, this.pristine = !0, this.touched = !1, this._onDisabledChange = [], this._rawValidators = t, this._rawAsyncValidators = n, this._composedValidatorFn = yy(this._rawValidators), this._composedAsyncValidatorFn = Dy(this._rawAsyncValidators)
            }

            get validator() {
                return this._composedValidatorFn
            }

            set validator(t) {
                this._rawValidators = this._composedValidatorFn = t
            }

            get asyncValidator() {
                return this._composedAsyncValidatorFn
            }

            set asyncValidator(t) {
                this._rawAsyncValidators = this._composedAsyncValidatorFn = t
            }

            get parent() {
                return this._parent
            }

            get valid() {
                return this.status === ho
            }

            get invalid() {
                return this.status === ns
            }

            get pending() {
                return this.status == Dr
            }

            get disabled() {
                return this.status === po
            }

            get enabled() {
                return this.status !== po
            }

            get dirty() {
                return !this.pristine
            }

            get untouched() {
                return !this.touched
            }

            get updateOn() {
                return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change"
            }

            setValidators(t) {
                this._rawValidators = t, this._composedValidatorFn = yy(t)
            }

            setAsyncValidators(t) {
                this._rawAsyncValidators = t, this._composedAsyncValidatorFn = Dy(t)
            }

            addValidators(t) {
                this.setValidators(sy(t, this._rawValidators))
            }

            addAsyncValidators(t) {
                this.setAsyncValidators(sy(t, this._rawAsyncValidators))
            }

            removeValidators(t) {
                this.setValidators(ay(t, this._rawValidators))
            }

            removeAsyncValidators(t) {
                this.setAsyncValidators(ay(t, this._rawAsyncValidators))
            }

            hasValidator(t) {
                return Ki(this._rawValidators, t)
            }

            hasAsyncValidator(t) {
                return Ki(this._rawAsyncValidators, t)
            }

            clearValidators() {
                this.validator = null
            }

            clearAsyncValidators() {
                this.asyncValidator = null
            }

            markAsTouched(t = {}) {
                this.touched = !0, this._parent && !t.onlySelf && this._parent.markAsTouched(t)
            }

            markAllAsTouched() {
                this.markAsTouched({onlySelf: !0}), this._forEachChild(t => t.markAllAsTouched())
            }

            markAsUntouched(t = {}) {
                this.touched = !1, this._pendingTouched = !1, this._forEachChild(n => {
                    n.markAsUntouched({onlySelf: !0})
                }), this._parent && !t.onlySelf && this._parent._updateTouched(t)
            }

            markAsDirty(t = {}) {
                this.pristine = !1, this._parent && !t.onlySelf && this._parent.markAsDirty(t)
            }

            markAsPristine(t = {}) {
                this.pristine = !0, this._pendingDirty = !1, this._forEachChild(n => {
                    n.markAsPristine({onlySelf: !0})
                }), this._parent && !t.onlySelf && this._parent._updatePristine(t)
            }

            markAsPending(t = {}) {
                this.status = Dr, !1 !== t.emitEvent && this.statusChanges.emit(this.status), this._parent && !t.onlySelf && this._parent.markAsPending(t)
            }

            disable(t = {}) {
                const n = this._parentMarkedDirty(t.onlySelf);
                this.status = po, this.errors = null, this._forEachChild(r => {
                    r.disable(Object.assign(Object.assign({}, t), {onlySelf: !0}))
                }), this._updateValue(), !1 !== t.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._updateAncestors(Object.assign(Object.assign({}, t), {skipPristineCheck: n})), this._onDisabledChange.forEach(r => r(!0))
            }

            enable(t = {}) {
                const n = this._parentMarkedDirty(t.onlySelf);
                this.status = ho, this._forEachChild(r => {
                    r.enable(Object.assign(Object.assign({}, t), {onlySelf: !0}))
                }), this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: t.emitEvent
                }), this._updateAncestors(Object.assign(Object.assign({}, t), {skipPristineCheck: n})), this._onDisabledChange.forEach(r => r(!1))
            }

            _updateAncestors(t) {
                this._parent && !t.onlySelf && (this._parent.updateValueAndValidity(t), t.skipPristineCheck || this._parent._updatePristine(), this._parent._updateTouched())
            }

            setParent(t) {
                this._parent = t
            }

            updateValueAndValidity(t = {}) {
                this._setInitialStatus(), this._updateValue(), this.enabled && (this._cancelExistingSubscription(), this.errors = this._runValidator(), this.status = this._calculateStatus(), (this.status === ho || this.status === Dr) && this._runAsyncValidator(t.emitEvent)), !1 !== t.emitEvent && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)), this._parent && !t.onlySelf && this._parent.updateValueAndValidity(t)
            }

            _updateTreeValidity(t = {emitEvent: !0}) {
                this._forEachChild(n => n._updateTreeValidity(t)), this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: t.emitEvent
                })
            }

            _setInitialStatus() {
                this.status = this._allControlsDisabled() ? po : ho
            }

            _runValidator() {
                return this.validator ? this.validator(this) : null
            }

            _runAsyncValidator(t) {
                if (this.asyncValidator) {
                    this.status = Dr, this._hasOwnPendingAsyncValidator = !0;
                    const n = Jm(this.asyncValidator(this));
                    this._asyncValidationSubscription = n.subscribe(r => {
                        this._hasOwnPendingAsyncValidator = !1, this.setErrors(r, {emitEvent: t})
                    })
                }
            }

            _cancelExistingSubscription() {
                this._asyncValidationSubscription && (this._asyncValidationSubscription.unsubscribe(), this._hasOwnPendingAsyncValidator = !1)
            }

            setErrors(t, n = {}) {
                this.errors = t, this._updateControlsErrors(!1 !== n.emitEvent)
            }

            get(t) {
                return function aS(e, t, n) {
                    if (null == t || (Array.isArray(t) || (t = t.split(n)), Array.isArray(t) && 0 === t.length)) return null;
                    let r = e;
                    return t.forEach(o => {
                        r = os(r) ? r.controls.hasOwnProperty(o) ? r.controls[o] : null : _y(r) && r.at(o) || null
                    }), r
                }(this, t, ".")
            }

            getError(t, n) {
                const r = n ? this.get(n) : this;
                return r && r.errors ? r.errors[t] : null
            }

            hasError(t, n) {
                return !!this.getError(t, n)
            }

            get root() {
                let t = this;
                for (; t._parent;) t = t._parent;
                return t
            }

            _updateControlsErrors(t) {
                this.status = this._calculateStatus(), t && this.statusChanges.emit(this.status), this._parent && this._parent._updateControlsErrors(t)
            }

            _initObservables() {
                this.valueChanges = new Me, this.statusChanges = new Me
            }

            _calculateStatus() {
                return this._allControlsDisabled() ? po : this.errors ? ns : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Dr) ? Dr : this._anyControlsHaveStatus(ns) ? ns : ho
            }

            _anyControlsHaveStatus(t) {
                return this._anyControls(n => n.status === t)
            }

            _anyControlsDirty() {
                return this._anyControls(t => t.dirty)
            }

            _anyControlsTouched() {
                return this._anyControls(t => t.touched)
            }

            _updatePristine(t = {}) {
                this.pristine = !this._anyControlsDirty(), this._parent && !t.onlySelf && this._parent._updatePristine(t)
            }

            _updateTouched(t = {}) {
                this.touched = this._anyControlsTouched(), this._parent && !t.onlySelf && this._parent._updateTouched(t)
            }

            _isBoxedValue(t) {
                return "object" == typeof t && null !== t && 2 === Object.keys(t).length && "value" in t && "disabled" in t
            }

            _registerOnCollectionChange(t) {
                this._onCollectionChange = t
            }

            _setUpdateStrategy(t) {
                rs(t) && null != t.updateOn && (this._updateOn = t.updateOn)
            }

            _parentMarkedDirty(t) {
                return !t && !(!this._parent || !this._parent.dirty) && !this._parent._anyControlsDirty()
            }
        }

        class Nl extends Fl {
            constructor(t = null, n, r) {
                super(Il(n), Tl(r, n)), this.defaultValue = null, this._onChange = [], this._pendingChange = !1, this._applyFormState(t), this._setUpdateStrategy(n), this._initObservables(), this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: !!this.asyncValidator
                }), rs(n) && n.initialValueIsDefault && (this.defaultValue = this._isBoxedValue(t) ? t.value : t)
            }

            setValue(t, n = {}) {
                this.value = this._pendingValue = t, this._onChange.length && !1 !== n.emitModelToViewChange && this._onChange.forEach(r => r(this.value, !1 !== n.emitViewToModelChange)), this.updateValueAndValidity(n)
            }

            patchValue(t, n = {}) {
                this.setValue(t, n)
            }

            reset(t = this.defaultValue, n = {}) {
                this._applyFormState(t), this.markAsPristine(n), this.markAsUntouched(n), this.setValue(this.value, n), this._pendingChange = !1
            }

            _updateValue() {
            }

            _anyControls(t) {
                return !1
            }

            _allControlsDisabled() {
                return this.disabled
            }

            registerOnChange(t) {
                this._onChange.push(t)
            }

            _unregisterOnChange(t) {
                Ml(this._onChange, t)
            }

            registerOnDisabledChange(t) {
                this._onDisabledChange.push(t)
            }

            _unregisterOnDisabledChange(t) {
                Ml(this._onDisabledChange, t)
            }

            _forEachChild(t) {
            }

            _syncPendingControls() {
                return !("submit" !== this.updateOn || (this._pendingDirty && this.markAsDirty(), this._pendingTouched && this.markAsTouched(), !this._pendingChange) || (this.setValue(this._pendingValue, {
                    onlySelf: !0,
                    emitModelToViewChange: !1
                }), 0))
            }

            _applyFormState(t) {
                this._isBoxedValue(t) ? (this.value = this._pendingValue = t.value, t.disabled ? this.disable({
                    onlySelf: !0,
                    emitEvent: !1
                }) : this.enable({onlySelf: !0, emitEvent: !1})) : this.value = this._pendingValue = t
            }
        }

        class is extends Fl {
            constructor(t, n, r) {
                super(Il(n), Tl(r, n)), this.controls = t, this._initObservables(), this._setUpdateStrategy(n), this._setUpControls(), this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: !!this.asyncValidator
                })
            }

            registerControl(t, n) {
                return this.controls[t] ? this.controls[t] : (this.controls[t] = n, n.setParent(this), n._registerOnCollectionChange(this._onCollectionChange), n)
            }

            addControl(t, n, r = {}) {
                this.registerControl(t, n), this.updateValueAndValidity({emitEvent: r.emitEvent}), this._onCollectionChange()
            }

            removeControl(t, n = {}) {
                this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {
                }), delete this.controls[t], this.updateValueAndValidity({emitEvent: n.emitEvent}), this._onCollectionChange()
            }

            setControl(t, n, r = {}) {
                this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {
                }), delete this.controls[t], n && this.registerControl(t, n), this.updateValueAndValidity({emitEvent: r.emitEvent}), this._onCollectionChange()
            }

            contains(t) {
                return this.controls.hasOwnProperty(t) && this.controls[t].enabled
            }

            setValue(t, n = {}) {
                Ey(this, t), Object.keys(t).forEach(r => {
                    Cy(this, r), this.controls[r].setValue(t[r], {onlySelf: !0, emitEvent: n.emitEvent})
                }), this.updateValueAndValidity(n)
            }

            patchValue(t, n = {}) {
                null != t && (Object.keys(t).forEach(r => {
                    this.controls[r] && this.controls[r].patchValue(t[r], {onlySelf: !0, emitEvent: n.emitEvent})
                }), this.updateValueAndValidity(n))
            }

            reset(t = {}, n = {}) {
                this._forEachChild((r, o) => {
                    r.reset(t[o], {onlySelf: !0, emitEvent: n.emitEvent})
                }), this._updatePristine(n), this._updateTouched(n), this.updateValueAndValidity(n)
            }

            getRawValue() {
                return this._reduceChildren({}, (t, n, r) => (t[r] = vy(n), t))
            }

            _syncPendingControls() {
                let t = this._reduceChildren(!1, (n, r) => !!r._syncPendingControls() || n);
                return t && this.updateValueAndValidity({onlySelf: !0}), t
            }

            _forEachChild(t) {
                Object.keys(this.controls).forEach(n => {
                    const r = this.controls[n];
                    r && t(r, n)
                })
            }

            _setUpControls() {
                this._forEachChild(t => {
                    t.setParent(this), t._registerOnCollectionChange(this._onCollectionChange)
                })
            }

            _updateValue() {
                this.value = this._reduceValue()
            }

            _anyControls(t) {
                for (const n of Object.keys(this.controls)) {
                    const r = this.controls[n];
                    if (this.contains(n) && t(r)) return !0
                }
                return !1
            }

            _reduceValue() {
                return this._reduceChildren({}, (t, n, r) => ((n.enabled || this.disabled) && (t[r] = n.value), t))
            }

            _reduceChildren(t, n) {
                let r = t;
                return this._forEachChild((o, i) => {
                    r = n(r, o, i)
                }), r
            }

            _allControlsDisabled() {
                for (const t of Object.keys(this.controls)) if (this.controls[t].enabled) return !1;
                return Object.keys(this.controls).length > 0 || this.disabled
            }
        }

        class wy extends Fl {
            constructor(t, n, r) {
                super(Il(n), Tl(r, n)), this.controls = t, this._initObservables(), this._setUpdateStrategy(n), this._setUpControls(), this.updateValueAndValidity({
                    onlySelf: !0,
                    emitEvent: !!this.asyncValidator
                })
            }

            at(t) {
                return this.controls[t]
            }

            push(t, n = {}) {
                this.controls.push(t), this._registerControl(t), this.updateValueAndValidity({emitEvent: n.emitEvent}), this._onCollectionChange()
            }

            insert(t, n, r = {}) {
                this.controls.splice(t, 0, n), this._registerControl(n), this.updateValueAndValidity({emitEvent: r.emitEvent})
            }

            removeAt(t, n = {}) {
                this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {
                }), this.controls.splice(t, 1), this.updateValueAndValidity({emitEvent: n.emitEvent})
            }

            setControl(t, n, r = {}) {
                this.controls[t] && this.controls[t]._registerOnCollectionChange(() => {
                }), this.controls.splice(t, 1), n && (this.controls.splice(t, 0, n), this._registerControl(n)), this.updateValueAndValidity({emitEvent: r.emitEvent}), this._onCollectionChange()
            }

            get length() {
                return this.controls.length
            }

            setValue(t, n = {}) {
                Ey(this, t), t.forEach((r, o) => {
                    Cy(this, o), this.at(o).setValue(r, {onlySelf: !0, emitEvent: n.emitEvent})
                }), this.updateValueAndValidity(n)
            }

            patchValue(t, n = {}) {
                null != t && (t.forEach((r, o) => {
                    this.at(o) && this.at(o).patchValue(r, {onlySelf: !0, emitEvent: n.emitEvent})
                }), this.updateValueAndValidity(n))
            }

            reset(t = [], n = {}) {
                this._forEachChild((r, o) => {
                    r.reset(t[o], {onlySelf: !0, emitEvent: n.emitEvent})
                }), this._updatePristine(n), this._updateTouched(n), this.updateValueAndValidity(n)
            }

            getRawValue() {
                return this.controls.map(t => vy(t))
            }

            clear(t = {}) {
                this.controls.length < 1 || (this._forEachChild(n => n._registerOnCollectionChange(() => {
                })), this.controls.splice(0), this.updateValueAndValidity({emitEvent: t.emitEvent}))
            }

            _syncPendingControls() {
                let t = this.controls.reduce((n, r) => !!r._syncPendingControls() || n, !1);
                return t && this.updateValueAndValidity({onlySelf: !0}), t
            }

            _forEachChild(t) {
                this.controls.forEach((n, r) => {
                    t(n, r)
                })
            }

            _updateValue() {
                this.value = this.controls.filter(t => t.enabled || this.disabled).map(t => t.value)
            }

            _anyControls(t) {
                return this.controls.some(n => n.enabled && t(n))
            }

            _setUpControls() {
                this._forEachChild(t => this._registerControl(t))
            }

            _allControlsDisabled() {
                for (const t of this.controls) if (t.enabled) return !1;
                return this.controls.length > 0 || this.disabled
            }

            _registerControl(t) {
                t.setParent(this), t._registerOnCollectionChange(this._onCollectionChange)
            }
        }

        let by = (() => {
            class e extends Pe {
                ngOnInit() {
                    this._checkParentType(), this.formDirective.addFormGroup(this)
                }

                ngOnDestroy() {
                    this.formDirective && this.formDirective.removeFormGroup(this)
                }

                get control() {
                    return this.formDirective.getFormGroup(this)
                }

                get path() {
                    return Yi(null == this.name ? this.name : this.name.toString(), this._parent)
                }

                get formDirective() {
                    return this._parent ? this._parent.formDirective : null
                }

                _checkParentType() {
                }
            }

            return e.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = Ee(e)))(r || e)
                }
            }(), e.\u0275dir = T({type: e, features: [G]}), e
        })(), Ty = (() => {
            class e {
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275dir = T({
                type: e,
                selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
                hostAttrs: ["novalidate", ""]
            }), e
        })(), Fy = (() => {
            class e {
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({}), e
        })();
        const Pl = new L("NgModelWithFormControlWarning"), mS = {provide: Pe, useExisting: Q(() => ss)};
        let ss = (() => {
            class e extends Pe {
                constructor(n, r) {
                    super(), this.validators = n, this.asyncValidators = r, this.submitted = !1, this._onCollectionChange = () => this._updateDomValue(), this.directives = [], this.form = null, this.ngSubmit = new Me, this._setValidators(n), this._setAsyncValidators(r)
                }

                ngOnChanges(n) {
                    this._checkFormPresent(), n.hasOwnProperty("form") && (this._updateValidators(), this._updateDomValue(), this._updateRegistrations(), this._oldForm = this.form)
                }

                ngOnDestroy() {
                    this.form && (ts(this.form, this), this.form._onCollectionChange === this._onCollectionChange && this.form._registerOnCollectionChange(() => {
                    }))
                }

                get formDirective() {
                    return this
                }

                get control() {
                    return this.form
                }

                get path() {
                    return []
                }

                addControl(n) {
                    const r = this.form.get(n.path);
                    return fo(r, n), r.updateValueAndValidity({emitEvent: !1}), this.directives.push(n), r
                }

                getControl(n) {
                    return this.form.get(n.path)
                }

                removeControl(n) {
                    Xi(n.control || null, n, !1), Ml(this.directives, n)
                }

                addFormGroup(n) {
                    this._setUpFormContainer(n)
                }

                removeFormGroup(n) {
                    this._cleanUpFormContainer(n)
                }

                getFormGroup(n) {
                    return this.form.get(n.path)
                }

                addFormArray(n) {
                    this._setUpFormContainer(n)
                }

                removeFormArray(n) {
                    this._cleanUpFormContainer(n)
                }

                getFormArray(n) {
                    return this.form.get(n.path)
                }

                updateModel(n, r) {
                    this.form.get(n.path).setValue(r)
                }

                onSubmit(n) {
                    return this.submitted = !0, function my(e, t) {
                        e._syncPendingControls(), t.forEach(n => {
                            const r = n.control;
                            "submit" === r.updateOn && r._pendingChange && (n.viewToModelUpdate(r._pendingValue), r._pendingChange = !1)
                        })
                    }(this.form, this.directives), this.ngSubmit.emit(n), !1
                }

                onReset() {
                    this.resetForm()
                }

                resetForm(n) {
                    this.form.reset(n), this.submitted = !1
                }

                _updateDomValue() {
                    this.directives.forEach(n => {
                        const r = n.control, o = this.form.get(n.path);
                        r !== o && (Xi(r || null, n), Sl(o) && (fo(o, n), n.control = o))
                    }), this.form._updateTreeValidity({emitEvent: !1})
                }

                _setUpFormContainer(n) {
                    const r = this.form.get(n.path);
                    (function py(e, t) {
                        El(e, t)
                    })(r, n), r.updateValueAndValidity({emitEvent: !1})
                }

                _cleanUpFormContainer(n) {
                    if (this.form) {
                        const r = this.form.get(n.path);
                        r && function oS(e, t) {
                            return ts(e, t)
                        }(r, n) && r.updateValueAndValidity({emitEvent: !1})
                    }
                }

                _updateRegistrations() {
                    this.form._registerOnCollectionChange(this._onCollectionChange), this._oldForm && this._oldForm._registerOnCollectionChange(() => {
                    })
                }

                _updateValidators() {
                    El(this.form, this), this._oldForm && ts(this._oldForm, this)
                }

                _checkFormPresent() {
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(Ae, 10), v(on, 10))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["", "formGroup", ""]],
                hostBindings: function (n, r) {
                    1 & n && Ve("submit", function (i) {
                        return r.onSubmit(i)
                    })("reset", function () {
                        return r.onReset()
                    })
                },
                inputs: {form: ["formGroup", "form"]},
                outputs: {ngSubmit: "ngSubmit"},
                exportAs: ["ngForm"],
                features: [ee([mS]), G, Rt]
            }), e
        })();
        const yS = {provide: Pe, useExisting: Q(() => Ol)};
        let Ol = (() => {
            class e extends by {
                constructor(n, r, o) {
                    super(), this._parent = n, this._setValidators(r), this._setAsyncValidators(o)
                }

                _checkParentType() {
                    Oy(this._parent)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(Pe, 13), v(Ae, 10), v(on, 10))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["", "formGroupName", ""]],
                inputs: {name: ["formGroupName", "name"]},
                features: [ee([yS]), G]
            }), e
        })();
        const DS = {provide: Pe, useExisting: Q(() => as)};
        let as = (() => {
            class e extends Pe {
                constructor(n, r, o) {
                    super(), this._parent = n, this._setValidators(r), this._setAsyncValidators(o)
                }

                ngOnInit() {
                    this._checkParentType(), this.formDirective.addFormArray(this)
                }

                ngOnDestroy() {
                    this.formDirective && this.formDirective.removeFormArray(this)
                }

                get control() {
                    return this.formDirective.getFormArray(this)
                }

                get formDirective() {
                    return this._parent ? this._parent.formDirective : null
                }

                get path() {
                    return Yi(null == this.name ? this.name : this.name.toString(), this._parent)
                }

                _checkParentType() {
                    Oy(this._parent)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(Pe, 13), v(Ae, 10), v(on, 10))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["", "formArrayName", ""]],
                inputs: {name: ["formArrayName", "name"]},
                features: [ee([DS]), G]
            }), e
        })();

        function Oy(e) {
            return !(e instanceof Ol || e instanceof ss || e instanceof as)
        }

        const _S = {provide: sn, useExisting: Q(() => Rl)};
        let Rl = (() => {
            class e extends sn {
                constructor(n, r, o, i, s) {
                    super(), this._ngModelWarningConfig = s, this._added = !1, this.update = new Me, this._ngModelWarningSent = !1, this._parent = n, this._setValidators(r), this._setAsyncValidators(o), this.valueAccessor = function bl(e, t) {
                        if (!t) return null;
                        let n, r, o;
                        return Array.isArray(t), t.forEach(i => {
                            i.constructor === Qi ? n = i : function sS(e) {
                                return Object.getPrototypeOf(e.constructor) === Mn
                            }(i) ? r = i : o = i
                        }), o || r || n || null
                    }(0, i)
                }

                set isDisabled(n) {
                }

                ngOnChanges(n) {
                    this._added || this._setUpControl(), function wl(e, t) {
                        if (!e.hasOwnProperty("model")) return !1;
                        const n = e.model;
                        return !!n.isFirstChange() || !Object.is(t, n.currentValue)
                    }(n, this.viewModel) && (this.viewModel = this.model, this.formDirective.updateModel(this, this.model))
                }

                ngOnDestroy() {
                    this.formDirective && this.formDirective.removeControl(this)
                }

                viewToModelUpdate(n) {
                    this.viewModel = n, this.update.emit(n)
                }

                get path() {
                    return Yi(null == this.name ? this.name : this.name.toString(), this._parent)
                }

                get formDirective() {
                    return this._parent ? this._parent.formDirective : null
                }

                _checkParentType() {
                }

                _setUpControl() {
                    this._checkParentType(), this.control = this.formDirective.addControl(this), this.control.disabled && this.valueAccessor.setDisabledState && this.valueAccessor.setDisabledState(!0), this._added = !0
                }
            }

            return e._ngModelWarningSentOnce = !1, e.\u0275fac = function (n) {
                return new (n || e)(v(Pe, 13), v(Ae, 10), v(on, 10), v(Nt, 10), v(Pl, 8))
            }, e.\u0275dir = T({
                type: e,
                selectors: [["", "formControlName", ""]],
                inputs: {
                    name: ["formControlName", "name"],
                    isDisabled: ["disabled", "isDisabled"],
                    model: ["ngModel", "model"]
                },
                outputs: {update: "ngModelChange"},
                features: [ee([_S]), G, Rt]
            }), e
        })();
        const vS = {provide: Nt, useExisting: Q(() => us), multi: !0};

        function Ry(e, t) {
            return null == e ? `${t}` : (t && "object" == typeof t && (t = "Object"), `${e}: ${t}`.slice(0, 50))
        }

        let us = (() => {
            class e extends Mn {
                constructor() {
                    super(...arguments), this._optionMap = new Map, this._idCounter = 0, this._compareWith = Object.is
                }

                set compareWith(n) {
                    this._compareWith = n
                }

                writeValue(n) {
                    this.value = n;
                    const o = Ry(this._getOptionId(n), n);
                    this.setProperty("value", o)
                }

                registerOnChange(n) {
                    this.onChange = r => {
                        this.value = this._getOptionValue(r), n(this.value)
                    }
                }

                _registerOption() {
                    return (this._idCounter++).toString()
                }

                _getOptionId(n) {
                    for (const r of Array.from(this._optionMap.keys())) if (this._compareWith(this._optionMap.get(r), n)) return r;
                    return null
                }

                _getOptionValue(n) {
                    const r = function CS(e) {
                        return e.split(":")[0]
                    }(n);
                    return this._optionMap.has(r) ? this._optionMap.get(r) : n
                }
            }

            return e.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = Ee(e)))(r || e)
                }
            }(), e.\u0275dir = T({
                type: e,
                selectors: [["select", "formControlName", "", 3, "multiple", ""], ["select", "formControl", "", 3, "multiple", ""], ["select", "ngModel", "", 3, "multiple", ""]],
                hostBindings: function (n, r) {
                    1 & n && Ve("change", function (i) {
                        return r.onChange(i.target.value)
                    })("blur", function () {
                        return r.onTouched()
                    })
                },
                inputs: {compareWith: "compareWith"},
                features: [ee([vS]), G]
            }), e
        })(), Vy = (() => {
            class e {
                constructor(n, r, o) {
                    this._element = n, this._renderer = r, this._select = o, this._select && (this.id = this._select._registerOption())
                }

                set ngValue(n) {
                    null != this._select && (this._select._optionMap.set(this.id, n), this._setElementValue(Ry(this.id, n)), this._select.writeValue(this._select.value))
                }

                set value(n) {
                    this._setElementValue(n), this._select && this._select.writeValue(this._select.value)
                }

                _setElementValue(n) {
                    this._renderer.setProperty(this._element.nativeElement, "value", n)
                }

                ngOnDestroy() {
                    this._select && (this._select._optionMap.delete(this.id), this._select.writeValue(this._select.value))
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(pt), v(En), v(us, 9))
            }, e.\u0275dir = T({type: e, selectors: [["option"]], inputs: {ngValue: "ngValue", value: "value"}}), e
        })();
        const ES = {provide: Nt, useExisting: Q(() => Vl), multi: !0};

        function ky(e, t) {
            return null == e ? `${t}` : ("string" == typeof t && (t = `'${t}'`), t && "object" == typeof t && (t = "Object"), `${e}: ${t}`.slice(0, 50))
        }

        let Vl = (() => {
            class e extends Mn {
                constructor() {
                    super(...arguments), this._optionMap = new Map, this._idCounter = 0, this._compareWith = Object.is
                }

                set compareWith(n) {
                    this._compareWith = n
                }

                writeValue(n) {
                    let r;
                    if (this.value = n, Array.isArray(n)) {
                        const o = n.map(i => this._getOptionId(i));
                        r = (i, s) => {
                            i._setSelected(o.indexOf(s.toString()) > -1)
                        }
                    } else r = (o, i) => {
                        o._setSelected(!1)
                    };
                    this._optionMap.forEach(r)
                }

                registerOnChange(n) {
                    this.onChange = r => {
                        const o = [], i = r.selectedOptions;
                        if (void 0 !== i) {
                            const s = i;
                            for (let a = 0; a < s.length; a++) {
                                const l = this._getOptionValue(s[a].value);
                                o.push(l)
                            }
                        } else {
                            const s = r.options;
                            for (let a = 0; a < s.length; a++) {
                                const u = s[a];
                                if (u.selected) {
                                    const l = this._getOptionValue(u.value);
                                    o.push(l)
                                }
                            }
                        }
                        this.value = o, n(o)
                    }
                }

                _registerOption(n) {
                    const r = (this._idCounter++).toString();
                    return this._optionMap.set(r, n), r
                }

                _getOptionId(n) {
                    for (const r of Array.from(this._optionMap.keys())) if (this._compareWith(this._optionMap.get(r)._value, n)) return r;
                    return null
                }

                _getOptionValue(n) {
                    const r = function wS(e) {
                        return e.split(":")[0]
                    }(n);
                    return this._optionMap.has(r) ? this._optionMap.get(r)._value : n
                }
            }

            return e.\u0275fac = function () {
                let t;
                return function (r) {
                    return (t || (t = Ee(e)))(r || e)
                }
            }(), e.\u0275dir = T({
                type: e,
                selectors: [["select", "multiple", "", "formControlName", ""], ["select", "multiple", "", "formControl", ""], ["select", "multiple", "", "ngModel", ""]],
                hostBindings: function (n, r) {
                    1 & n && Ve("change", function (i) {
                        return r.onChange(i.target)
                    })("blur", function () {
                        return r.onTouched()
                    })
                },
                inputs: {compareWith: "compareWith"},
                features: [ee([ES]), G]
            }), e
        })(), Ly = (() => {
            class e {
                constructor(n, r, o) {
                    this._element = n, this._renderer = r, this._select = o, this._select && (this.id = this._select._registerOption(this))
                }

                set ngValue(n) {
                    null != this._select && (this._value = n, this._setElementValue(ky(this.id, n)), this._select.writeValue(this._select.value))
                }

                set value(n) {
                    this._select ? (this._value = n, this._setElementValue(ky(this.id, n)), this._select.writeValue(this._select.value)) : this._setElementValue(n)
                }

                _setElementValue(n) {
                    this._renderer.setProperty(this._element.nativeElement, "value", n)
                }

                _setSelected(n) {
                    this._renderer.setProperty(this._element.nativeElement, "selected", n)
                }

                ngOnDestroy() {
                    this._select && (this._select._optionMap.delete(this.id), this._select.writeValue(this._select.value))
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(pt), v(En), v(Vl, 9))
            }, e.\u0275dir = T({type: e, selectors: [["option"]], inputs: {ngValue: "ngValue", value: "value"}}), e
        })(), Qy = (() => {
            class e {
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({imports: [[Fy]]}), e
        })(), PS = (() => {
            class e {
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({imports: [Qy]}), e
        })(), Zy = (() => {
            class e {
                static withConfig(n) {
                    return {ngModule: e, providers: [{provide: Pl, useValue: n.warnOnNgModelWithFormControl}]}
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({imports: [Qy]}), e
        })(), RS = (() => {
            class e {
                group(n, r = null) {
                    const o = this._reduceControls(n);
                    let a, i = null, s = null;
                    return null != r && (function OS(e) {
                        return void 0 !== e.asyncValidators || void 0 !== e.validators || void 0 !== e.updateOn
                    }(r) ? (i = null != r.validators ? r.validators : null, s = null != r.asyncValidators ? r.asyncValidators : null, a = null != r.updateOn ? r.updateOn : void 0) : (i = null != r.validator ? r.validator : null, s = null != r.asyncValidator ? r.asyncValidator : null)), new is(o, {
                        asyncValidators: s,
                        updateOn: a,
                        validators: i
                    })
                }

                control(n, r, o) {
                    return new Nl(n, r, o)
                }

                array(n, r, o) {
                    const i = n.map(s => this._createControl(s));
                    return new wy(i, r, o)
                }

                _reduceControls(n) {
                    const r = {};
                    return Object.keys(n).forEach(o => {
                        r[o] = this._createControl(n[o])
                    }), r
                }

                _createControl(n) {
                    return Sl(n) || os(n) || _y(n) ? n : Array.isArray(n) ? this.control(n[0], n.length > 1 ? n[1] : null, n.length > 2 ? n[2] : null) : this.control(n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac, providedIn: Zy}), e
        })();

        class Ky {
        }

        class Jy {
        }

        class xt {
            constructor(t) {
                this.normalizedNames = new Map, this.lazyUpdate = null, t ? this.lazyInit = "string" == typeof t ? () => {
                    this.headers = new Map, t.split("\n").forEach(n => {
                        const r = n.indexOf(":");
                        if (r > 0) {
                            const o = n.slice(0, r), i = o.toLowerCase(), s = n.slice(r + 1).trim();
                            this.maybeSetNormalizedName(o, i), this.headers.has(i) ? this.headers.get(i).push(s) : this.headers.set(i, [s])
                        }
                    })
                } : () => {
                    this.headers = new Map, Object.keys(t).forEach(n => {
                        let r = t[n];
                        const o = n.toLowerCase();
                        "string" == typeof r && (r = [r]), r.length > 0 && (this.headers.set(o, r), this.maybeSetNormalizedName(n, o))
                    })
                } : this.headers = new Map
            }

            has(t) {
                return this.init(), this.headers.has(t.toLowerCase())
            }

            get(t) {
                this.init();
                const n = this.headers.get(t.toLowerCase());
                return n && n.length > 0 ? n[0] : null
            }

            keys() {
                return this.init(), Array.from(this.normalizedNames.values())
            }

            getAll(t) {
                return this.init(), this.headers.get(t.toLowerCase()) || null
            }

            append(t, n) {
                return this.clone({name: t, value: n, op: "a"})
            }

            set(t, n) {
                return this.clone({name: t, value: n, op: "s"})
            }

            delete(t, n) {
                return this.clone({name: t, value: n, op: "d"})
            }

            maybeSetNormalizedName(t, n) {
                this.normalizedNames.has(n) || this.normalizedNames.set(n, t)
            }

            init() {
                this.lazyInit && (this.lazyInit instanceof xt ? this.copyFrom(this.lazyInit) : this.lazyInit(), this.lazyInit = null, this.lazyUpdate && (this.lazyUpdate.forEach(t => this.applyUpdate(t)), this.lazyUpdate = null))
            }

            copyFrom(t) {
                t.init(), Array.from(t.headers.keys()).forEach(n => {
                    this.headers.set(n, t.headers.get(n)), this.normalizedNames.set(n, t.normalizedNames.get(n))
                })
            }

            clone(t) {
                const n = new xt;
                return n.lazyInit = this.lazyInit && this.lazyInit instanceof xt ? this.lazyInit : this, n.lazyUpdate = (this.lazyUpdate || []).concat([t]), n
            }

            applyUpdate(t) {
                const n = t.name.toLowerCase();
                switch (t.op) {
                    case"a":
                    case"s":
                        let r = t.value;
                        if ("string" == typeof r && (r = [r]), 0 === r.length) return;
                        this.maybeSetNormalizedName(t.name, n);
                        const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
                        o.push(...r), this.headers.set(n, o);
                        break;
                    case"d":
                        const i = t.value;
                        if (i) {
                            let s = this.headers.get(n);
                            if (!s) return;
                            s = s.filter(a => -1 === i.indexOf(a)), 0 === s.length ? (this.headers.delete(n), this.normalizedNames.delete(n)) : this.headers.set(n, s)
                        } else this.headers.delete(n), this.normalizedNames.delete(n)
                }
            }

            forEach(t) {
                this.init(), Array.from(this.normalizedNames.keys()).forEach(n => t(this.normalizedNames.get(n), this.headers.get(n)))
            }
        }

        class BS {
            encodeKey(t) {
                return Yy(t)
            }

            encodeValue(t) {
                return Yy(t)
            }

            decodeKey(t) {
                return decodeURIComponent(t)
            }

            decodeValue(t) {
                return decodeURIComponent(t)
            }
        }

        const jS = /%(\d[a-f0-9])/gi,
            $S = {40: "@", "3A": ":", 24: "$", "2C": ",", "3B": ";", "2B": "+", "3D": "=", "3F": "?", "2F": "/"};

        function Yy(e) {
            return encodeURIComponent(e).replace(jS, (t, n) => {
                var r;
                return null !== (r = $S[n]) && void 0 !== r ? r : t
            })
        }

        function Xy(e) {
            return `${e}`
        }

        class Ut {
            constructor(t = {}) {
                if (this.updates = null, this.cloneFrom = null, this.encoder = t.encoder || new BS, t.fromString) {
                    if (t.fromObject) throw new Error("Cannot specify both fromString and fromObject.");
                    this.map = function HS(e, t) {
                        const n = new Map;
                        return e.length > 0 && e.replace(/^\?/, "").split("&").forEach(o => {
                            const i = o.indexOf("="), [s, a] = -1 == i ? [t.decodeKey(o), ""] : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
                                u = n.get(s) || [];
                            u.push(a), n.set(s, u)
                        }), n
                    }(t.fromString, this.encoder)
                } else t.fromObject ? (this.map = new Map, Object.keys(t.fromObject).forEach(n => {
                    const r = t.fromObject[n];
                    this.map.set(n, Array.isArray(r) ? r : [r])
                })) : this.map = null
            }

            has(t) {
                return this.init(), this.map.has(t)
            }

            get(t) {
                this.init();
                const n = this.map.get(t);
                return n ? n[0] : null
            }

            getAll(t) {
                return this.init(), this.map.get(t) || null
            }

            keys() {
                return this.init(), Array.from(this.map.keys())
            }

            append(t, n) {
                return this.clone({param: t, value: n, op: "a"})
            }

            appendAll(t) {
                const n = [];
                return Object.keys(t).forEach(r => {
                    const o = t[r];
                    Array.isArray(o) ? o.forEach(i => {
                        n.push({param: r, value: i, op: "a"})
                    }) : n.push({param: r, value: o, op: "a"})
                }), this.clone(n)
            }

            set(t, n) {
                return this.clone({param: t, value: n, op: "s"})
            }

            delete(t, n) {
                return this.clone({param: t, value: n, op: "d"})
            }

            toString() {
                return this.init(), this.keys().map(t => {
                    const n = this.encoder.encodeKey(t);
                    return this.map.get(t).map(r => n + "=" + this.encoder.encodeValue(r)).join("&")
                }).filter(t => "" !== t).join("&")
            }

            clone(t) {
                const n = new Ut({encoder: this.encoder});
                return n.cloneFrom = this.cloneFrom || this, n.updates = (this.updates || []).concat(t), n
            }

            init() {
                null === this.map && (this.map = new Map), null !== this.cloneFrom && (this.cloneFrom.init(), this.cloneFrom.keys().forEach(t => this.map.set(t, this.cloneFrom.map.get(t))), this.updates.forEach(t => {
                    switch (t.op) {
                        case"a":
                        case"s":
                            const n = ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                            n.push(Xy(t.value)), this.map.set(t.param, n);
                            break;
                        case"d":
                            if (void 0 === t.value) {
                                this.map.delete(t.param);
                                break
                            }
                        {
                            let r = this.map.get(t.param) || [];
                            const o = r.indexOf(Xy(t.value));
                            -1 !== o && r.splice(o, 1), r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param)
                        }
                    }
                }), this.cloneFrom = this.updates = null)
            }
        }

        class US {
            constructor() {
                this.map = new Map
            }

            set(t, n) {
                return this.map.set(t, n), this
            }

            get(t) {
                return this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
            }

            delete(t) {
                return this.map.delete(t), this
            }

            has(t) {
                return this.map.has(t)
            }

            keys() {
                return this.map.keys()
            }
        }

        function eD(e) {
            return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer
        }

        function tD(e) {
            return "undefined" != typeof Blob && e instanceof Blob
        }

        function nD(e) {
            return "undefined" != typeof FormData && e instanceof FormData
        }

        class mo {
            constructor(t, n, r, o) {
                let i;
                if (this.url = n, this.body = null, this.reportProgress = !1, this.withCredentials = !1, this.responseType = "json", this.method = t.toUpperCase(), function GS(e) {
                    switch (e) {
                        case"DELETE":
                        case"GET":
                        case"HEAD":
                        case"OPTIONS":
                        case"JSONP":
                            return !1;
                        default:
                            return !0
                    }
                }(this.method) || o ? (this.body = void 0 !== r ? r : null, i = o) : i = r, i && (this.reportProgress = !!i.reportProgress, this.withCredentials = !!i.withCredentials, i.responseType && (this.responseType = i.responseType), i.headers && (this.headers = i.headers), i.context && (this.context = i.context), i.params && (this.params = i.params)), this.headers || (this.headers = new xt), this.context || (this.context = new US), this.params) {
                    const s = this.params.toString();
                    if (0 === s.length) this.urlWithParams = n; else {
                        const a = n.indexOf("?");
                        this.urlWithParams = n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s
                    }
                } else this.params = new Ut, this.urlWithParams = n
            }

            serializeBody() {
                return null === this.body ? null : eD(this.body) || tD(this.body) || nD(this.body) || function qS(e) {
                    return "undefined" != typeof URLSearchParams && e instanceof URLSearchParams
                }(this.body) || "string" == typeof this.body ? this.body : this.body instanceof Ut ? this.body.toString() : "object" == typeof this.body || "boolean" == typeof this.body || Array.isArray(this.body) ? JSON.stringify(this.body) : this.body.toString()
            }

            detectContentTypeHeader() {
                return null === this.body || nD(this.body) ? null : tD(this.body) ? this.body.type || null : eD(this.body) ? null : "string" == typeof this.body ? "text/plain" : this.body instanceof Ut ? "application/x-www-form-urlencoded;charset=UTF-8" : "object" == typeof this.body || "number" == typeof this.body || "boolean" == typeof this.body ? "application/json" : null
            }

            clone(t = {}) {
                var n;
                const r = t.method || this.method, o = t.url || this.url, i = t.responseType || this.responseType,
                    s = void 0 !== t.body ? t.body : this.body,
                    a = void 0 !== t.withCredentials ? t.withCredentials : this.withCredentials,
                    u = void 0 !== t.reportProgress ? t.reportProgress : this.reportProgress;
                let l = t.headers || this.headers, c = t.params || this.params;
                const d = null !== (n = t.context) && void 0 !== n ? n : this.context;
                return void 0 !== t.setHeaders && (l = Object.keys(t.setHeaders).reduce((f, h) => f.set(h, t.setHeaders[h]), l)), t.setParams && (c = Object.keys(t.setParams).reduce((f, h) => f.set(h, t.setParams[h]), c)), new mo(r, o, s, {
                    params: c,
                    headers: l,
                    context: d,
                    reportProgress: u,
                    responseType: i,
                    withCredentials: a
                })
            }
        }

        var fe = (() => ((fe = fe || {})[fe.Sent = 0] = "Sent", fe[fe.UploadProgress = 1] = "UploadProgress", fe[fe.ResponseHeader = 2] = "ResponseHeader", fe[fe.DownloadProgress = 3] = "DownloadProgress", fe[fe.Response = 4] = "Response", fe[fe.User = 5] = "User", fe))();

        class Ll {
            constructor(t, n = 200, r = "OK") {
                this.headers = t.headers || new xt, this.status = void 0 !== t.status ? t.status : n, this.statusText = t.statusText || r, this.url = t.url || null, this.ok = this.status >= 200 && this.status < 300
            }
        }

        class Bl extends Ll {
            constructor(t = {}) {
                super(t), this.type = fe.ResponseHeader
            }

            clone(t = {}) {
                return new Bl({
                    headers: t.headers || this.headers,
                    status: void 0 !== t.status ? t.status : this.status,
                    statusText: t.statusText || this.statusText,
                    url: t.url || this.url || void 0
                })
            }
        }

        class ls extends Ll {
            constructor(t = {}) {
                super(t), this.type = fe.Response, this.body = void 0 !== t.body ? t.body : null
            }

            clone(t = {}) {
                return new ls({
                    body: void 0 !== t.body ? t.body : this.body,
                    headers: t.headers || this.headers,
                    status: void 0 !== t.status ? t.status : this.status,
                    statusText: t.statusText || this.statusText,
                    url: t.url || this.url || void 0
                })
            }
        }

        class rD extends Ll {
            constructor(t) {
                super(t, 0, "Unknown Error"), this.name = "HttpErrorResponse", this.ok = !1, this.message = this.status >= 200 && this.status < 300 ? `Http failure during parsing for ${t.url || "(unknown url)"}` : `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`, this.error = t.error || null
            }
        }

        function Hl(e, t) {
            return {
                body: t,
                headers: e.headers,
                context: e.context,
                observe: e.observe,
                params: e.params,
                reportProgress: e.reportProgress,
                responseType: e.responseType,
                withCredentials: e.withCredentials
            }
        }

        let oD = (() => {
            class e {
                constructor(n) {
                    this.handler = n
                }

                request(n, r, o = {}) {
                    let i;
                    if (n instanceof mo) i = n; else {
                        let u, l;
                        u = o.headers instanceof xt ? o.headers : new xt(o.headers), o.params && (l = o.params instanceof Ut ? o.params : new Ut({fromObject: o.params})), i = new mo(n, r, void 0 !== o.body ? o.body : null, {
                            headers: u,
                            context: o.context,
                            params: l,
                            reportProgress: o.reportProgress,
                            responseType: o.responseType || "json",
                            withCredentials: o.withCredentials
                        })
                    }
                    const s = function VS(...e) {
                        return wo(e, Cc(e))
                    }(i).pipe(function kS(e, t) {
                        return Y(t) ? Eo(e, t, 1) : Eo(e, 1)
                    }(u => this.handler.handle(u)));
                    if (n instanceof mo || "events" === o.observe) return s;
                    const a = s.pipe(function LS(e, t) {
                        return ln((n, r) => {
                            let o = 0;
                            n.subscribe(cn(r, i => e.call(t, i, o++) && r.next(i)))
                        })
                    }(u => u instanceof ls));
                    switch (o.observe || "body") {
                        case"body":
                            switch (i.responseType) {
                                case"arraybuffer":
                                    return a.pipe(dn(u => {
                                        if (null !== u.body && !(u.body instanceof ArrayBuffer)) throw new Error("Response is not an ArrayBuffer.");
                                        return u.body
                                    }));
                                case"blob":
                                    return a.pipe(dn(u => {
                                        if (null !== u.body && !(u.body instanceof Blob)) throw new Error("Response is not a Blob.");
                                        return u.body
                                    }));
                                case"text":
                                    return a.pipe(dn(u => {
                                        if (null !== u.body && "string" != typeof u.body) throw new Error("Response is not a string.");
                                        return u.body
                                    }));
                                default:
                                    return a.pipe(dn(u => u.body))
                            }
                        case"response":
                            return a;
                        default:
                            throw new Error(`Unreachable: unhandled observe type ${o.observe}}`)
                    }
                }

                delete(n, r = {}) {
                    return this.request("DELETE", n, r)
                }

                get(n, r = {}) {
                    return this.request("GET", n, r)
                }

                head(n, r = {}) {
                    return this.request("HEAD", n, r)
                }

                jsonp(n, r) {
                    return this.request("JSONP", n, {
                        params: (new Ut).append(r, "JSONP_CALLBACK"),
                        observe: "body",
                        responseType: "json"
                    })
                }

                options(n, r = {}) {
                    return this.request("OPTIONS", n, r)
                }

                patch(n, r, o = {}) {
                    return this.request("PATCH", n, Hl(o, r))
                }

                post(n, r, o = {}) {
                    return this.request("POST", n, Hl(o, r))
                }

                put(n, r, o = {}) {
                    return this.request("PUT", n, Hl(o, r))
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(Ky))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();

        class iD {
            constructor(t, n) {
                this.next = t, this.interceptor = n
            }

            handle(t) {
                return this.interceptor.intercept(t, this.next)
            }
        }

        const sD = new L("HTTP_INTERCEPTORS");
        let zS = (() => {
            class e {
                intercept(n, r) {
                    return r.handle(n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();
        const WS = /^\)\]\}',?\n/;
        let aD = (() => {
            class e {
                constructor(n) {
                    this.xhrFactory = n
                }

                handle(n) {
                    if ("JSONP" === n.method) throw new Error("Attempted to construct Jsonp request without HttpClientJsonpModule installed.");
                    return new _e(r => {
                        const o = this.xhrFactory.build();
                        if (o.open(n.method, n.urlWithParams), n.withCredentials && (o.withCredentials = !0), n.headers.forEach((h, p) => o.setRequestHeader(h, p.join(","))), n.headers.has("Accept") || o.setRequestHeader("Accept", "application/json, text/plain, */*"), !n.headers.has("Content-Type")) {
                            const h = n.detectContentTypeHeader();
                            null !== h && o.setRequestHeader("Content-Type", h)
                        }
                        if (n.responseType) {
                            const h = n.responseType.toLowerCase();
                            o.responseType = "json" !== h ? h : "text"
                        }
                        const i = n.serializeBody();
                        let s = null;
                        const a = () => {
                            if (null !== s) return s;
                            const h = o.statusText || "OK", p = new xt(o.getAllResponseHeaders()), m = function QS(e) {
                                return "responseURL" in e && e.responseURL ? e.responseURL : /^X-Request-URL:/m.test(e.getAllResponseHeaders()) ? e.getResponseHeader("X-Request-URL") : null
                            }(o) || n.url;
                            return s = new Bl({headers: p, status: o.status, statusText: h, url: m}), s
                        }, u = () => {
                            let {headers: h, status: p, statusText: m, url: _} = a(), D = null;
                            204 !== p && (D = void 0 === o.response ? o.responseText : o.response), 0 === p && (p = D ? 200 : 0);
                            let g = p >= 200 && p < 300;
                            if ("json" === n.responseType && "string" == typeof D) {
                                const w = D;
                                D = D.replace(WS, "");
                                try {
                                    D = "" !== D ? JSON.parse(D) : null
                                } catch (N) {
                                    D = w, g && (g = !1, D = {error: N, text: D})
                                }
                            }
                            g ? (r.next(new ls({
                                body: D,
                                headers: h,
                                status: p,
                                statusText: m,
                                url: _ || void 0
                            })), r.complete()) : r.error(new rD({
                                error: D,
                                headers: h,
                                status: p,
                                statusText: m,
                                url: _ || void 0
                            }))
                        }, l = h => {
                            const {url: p} = a(), m = new rD({
                                error: h,
                                status: o.status || 0,
                                statusText: o.statusText || "Unknown Error",
                                url: p || void 0
                            });
                            r.error(m)
                        };
                        let c = !1;
                        const d = h => {
                            c || (r.next(a()), c = !0);
                            let p = {type: fe.DownloadProgress, loaded: h.loaded};
                            h.lengthComputable && (p.total = h.total), "text" === n.responseType && !!o.responseText && (p.partialText = o.responseText), r.next(p)
                        }, f = h => {
                            let p = {type: fe.UploadProgress, loaded: h.loaded};
                            h.lengthComputable && (p.total = h.total), r.next(p)
                        };
                        return o.addEventListener("load", u), o.addEventListener("error", l), o.addEventListener("timeout", l), o.addEventListener("abort", l), n.reportProgress && (o.addEventListener("progress", d), null !== i && o.upload && o.upload.addEventListener("progress", f)), o.send(i), r.next({type: fe.Sent}), () => {
                            o.removeEventListener("error", l), o.removeEventListener("abort", l), o.removeEventListener("load", u), o.removeEventListener("timeout", l), n.reportProgress && (o.removeEventListener("progress", d), null !== i && o.upload && o.upload.removeEventListener("progress", f)), o.readyState !== o.DONE && o.abort()
                        }
                    })
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(Am))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();
        const jl = new L("XSRF_COOKIE_NAME"), $l = new L("XSRF_HEADER_NAME");

        class uD {
        }

        let ZS = (() => {
            class e {
                constructor(n, r, o) {
                    this.doc = n, this.platform = r, this.cookieName = o, this.lastCookieString = "", this.lastToken = null, this.parseCount = 0
                }

                getToken() {
                    if ("server" === this.platform) return null;
                    const n = this.doc.cookie || "";
                    return n !== this.lastCookieString && (this.parseCount++, this.lastToken = ym(n, this.cookieName), this.lastCookieString = n), this.lastToken
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(mt), V(Fi), V(jl))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })(), Ul = (() => {
            class e {
                constructor(n, r) {
                    this.tokenService = n, this.headerName = r
                }

                intercept(n, r) {
                    const o = n.url.toLowerCase();
                    if ("GET" === n.method || "HEAD" === n.method || o.startsWith("http://") || o.startsWith("https://")) return r.handle(n);
                    const i = this.tokenService.getToken();
                    return null !== i && !n.headers.has(this.headerName) && (n = n.clone({headers: n.headers.set(this.headerName, i)})), r.handle(n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(uD), V($l))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })(), KS = (() => {
            class e {
                constructor(n, r) {
                    this.backend = n, this.injector = r, this.chain = null
                }

                handle(n) {
                    if (null === this.chain) {
                        const r = this.injector.get(sD, []);
                        this.chain = r.reduceRight((o, i) => new iD(o, i), this.backend)
                    }
                    return this.chain.handle(n)
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(Jy), V(ze))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })(), JS = (() => {
            class e {
                static disable() {
                    return {ngModule: e, providers: [{provide: Ul, useClass: zS}]}
                }

                static withOptions(n = {}) {
                    return {
                        ngModule: e,
                        providers: [n.cookieName ? {
                            provide: jl,
                            useValue: n.cookieName
                        } : [], n.headerName ? {provide: $l, useValue: n.headerName} : []]
                    }
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({
                providers: [Ul, {
                    provide: sD,
                    useExisting: Ul,
                    multi: !0
                }, {provide: uD, useClass: ZS}, {provide: jl, useValue: "XSRF-TOKEN"}, {
                    provide: $l,
                    useValue: "X-XSRF-TOKEN"
                }]
            }), e
        })(), YS = (() => {
            class e {
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275mod = it({type: e}), e.\u0275inj = Ze({
                providers: [oD, {
                    provide: Ky,
                    useClass: KS
                }, aD, {provide: Jy, useExisting: aD}],
                imports: [[JS.withOptions({cookieName: "XSRF-TOKEN", headerName: "X-XSRF-TOKEN"})]]
            }), e
        })();
        const XS = _r(e => function () {
            e(this), this.name = "EmptyError", this.message = "no elements in sequence"
        });
        let lD = (() => {
            class e {
                constructor(n) {
                    this.http = n
                }

                addTaskList(n) {
                    let r = (new Ut).set("username", n.username);
                    for (let i = 0; i < n.todos.length; i++) r = r.set(`description-${i}`, n.todos[i].description).set(`priority-${i}`, n.todos[i].priority).set(`dueDate-${i}`, n.todos[i].dueDate);
                    const o = (new xt).set("Content-Type", "application/x-www-form-urlencoded");
                    return function eF(e, t) {
                        const n = "object" == typeof t;
                        return new Promise((r, o) => {
                            let s, i = !1;
                            e.subscribe({
                                next: a => {
                                    s = a, i = !0
                                }, error: o, complete: () => {
                                    i ? r(s) : n ? r(t.defaultValue) : o(new XS)
                                }
                            })
                        })
                    }(this.http.post("/task", r.toString(), {headers: o, responseType: "text"}))
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(V(oD))
            }, e.\u0275prov = $({token: e, factory: e.\u0275fac}), e
        })();

        function nF(e, t) {
            1 & e && (ge(0, "div")(1, "h2"), We(2, "You currently have no TODOs"), se()())
        }

        function rF(e, t) {
            if (1 & e) {
                const n = function Nh() {
                    return y()
                }();
                ge(0, "tr", 15)(1, "td"), cr(2, "input", 16), se(), ge(3, "td")(4, "select", 17)(5, "option", 18), We(6, "Low"), se(), ge(7, "option", 19), We(8, "Medium"), se(), ge(9, "option", 20), We(10, "High"), se()()(), ge(11, "td"), cr(12, "input", 21), se(), ge(13, "td")(14, "button", 22), Ve("click", function () {
                    const i = function Uc(e) {
                        return A.lFrame.contextLView = e, e[8]
                    }(n).index;
                    return hu(2).removeTodo(i)
                }), We(15, " X "), se()()()
            }
            2 & e && en("formGroup", t.$implicit)
        }

        function oF(e, t) {
            if (1 & e && (ge(0, "table", 12)(1, "thead")(2, "th"), We(3, " Description "), se(), ge(4, "th"), We(5, " Priority "), se(), ge(6, "th"), We(7, " Due Date "), se(), cr(8, "th"), se(), ge(9, "tbody", 13), hi(10, rF, 16, 1, "tr", 14), se()()), 2 & e) {
                const n = hu();
                Wn(10), en("ngForOf", n.todos.controls)
            }
        }

        let iF = (() => {
            class e {
                constructor(n, r) {
                    this.fb = n, this.taskSvc = r
                }

                ngOnInit() {
                    this.todos = this.fb.array([], [co.required]), this.form = this.fb.group({
                        username: this.fb.control("", [co.required]),
                        todos: this.todos
                    })
                }

                addTodo() {
                    this.todos.push(this.createTodo())
                }

                removeTodo(n) {
                    this.todos.removeAt(n)
                }

                submit() {
                    const n = {username: this.form.controls.username.value, todos: []};
                    for (let r = 0; r < this.todos.controls.length; r++) {
                        const o = this.todos.at(r);
                        n.todos.push({
                            description: o.controls.description.value,
                            priority: parseInt(o.controls.priority.value),
                            dueDate: o.controls.dueDate.value
                        })
                    }
                    this.taskSvc.addTaskList(n).then(r => {
                        console.info("Result: ", r), this.ngOnInit(), alert(`Result: ${r}`)
                    }).catch(r => alert(`Error: ${JSON.stringify(r)}`))
                }

                createTodo() {
                    return this.fb.group({
                        description: this.fb.control("", [co.required, co.minLength(3)]),
                        priority: this.fb.control("1"),
                        dueDate: this.fb.control("", [co.required])
                    })
                }
            }

            return e.\u0275fac = function (n) {
                return new (n || e)(v(RS), v(lD))
            }, e.\u0275cmp = Ts({
                type: e,
                selectors: [["app-root"]],
                decls: 17,
                vars: 4,
                consts: [[1, "container"], [1, "row", "mt-5", "mb-3"], [1, "col"], [3, "formGroup", "ngSubmit"], [1, "mb-3"], ["for", "username", 1, "form-label"], ["id", "username", "type", "text", "formControlName", "username", 1, "form-control"], [1, "mb-3", "d-flex", "justify-content-between"], ["type", "submit", 1, "btn", "btn-success", 3, "disabled"], ["type", "button", 1, "btn", "btn-dark", 3, "click"], [4, "ngIf"], ["class", "table", 4, "ngIf"], [1, "table"], ["formArrayName", "todos"], [3, "formGroup", 4, "ngFor", "ngForOf"], [3, "formGroup"], ["type", "text", "formControlName", "description", 1, "form-control"], ["formControlName", "priority", 1, "form-control"], ["value", "1"], ["value", "2"], ["value", "3"], ["type", "date", "formControlName", "dueDate", 1, "form-control"], ["type", "button", 1, "btn", "btn-danger", 3, "click"]],
                template: function (n, r) {
                    1 & n && (ge(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2"), We(4, "Todo List"), se()()(), ge(5, "form", 3), Ve("ngSubmit", function () {
                        return r.submit()
                    }), ge(6, "div", 4)(7, "label", 5), We(8, "Username"), se(), cr(9, "input", 6), se(), ge(10, "div", 7)(11, "button", 8), We(12, " Save "), se(), ge(13, "button", 9), Ve("click", function () {
                        return r.addTodo()
                    }), We(14, " Add Todo "), se()(), hi(15, nF, 3, 0, "div", 10), hi(16, oF, 11, 1, "table", 11), se()()), 2 & n && (Wn(5), en("formGroup", r.form), Wn(6), en("disabled", r.form.invalid), Wn(4), en("ngIf", r.todos.length <= 0), Wn(1), en("ngIf", r.todos.length > 0))
                },
                directives: [Ty, dy, ss, Qi, cy, Rl, vm, as, Dm, us, Vy, Ly],
                styles: [""]
            }), e
        })(), sF = (() => {
            class e {
            }

            return e.\u0275fac = function (n) {
                return new (n || e)
            }, e.\u0275mod = it({type: e, bootstrap: [iF]}), e.\u0275inj = Ze({
                providers: [lD],
                imports: [[vT, PS, Zy, YS]]
            }), e
        })();
        (function cA() {
            Zg = !1
        })(), DT().bootstrapModule(sF).catch(e => console.error(e))
    }
}, Y => {
    Y(Y.s = 939)
}]);