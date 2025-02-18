(function() {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c)
                        return c(i, !0);
                    if (u)
                        return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND",
                    a
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function(r) {
                    var n = e[i][1][r];
                    return o(n || r)
                }, p, p.exports, r, e, n, t)
            }
            return n[i].exports
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)
            o(t[i]);
        return o
    }
    return r
}
)()({
    1: [function(require, module, exports) {
        "use strict";
        /* global AFRAME */
        if ("undefined" == typeof AFRAME)
            throw new Error("Component attempted to register before AFRAME was available.");
        /**
 * Super Hands component for A-Frame.
 */
        require("./systems/super-hands-system.js"),
        require("./reaction_components/hoverable.js"),
        require("./reaction_components/grabbable.js"),
        require("./reaction_components/stretchable.js"),
        require("./reaction_components/drag-droppable.js"),
        require("./reaction_components/draggable.js"),
        require("./reaction_components/droppable.js"),
        require("./reaction_components/clickable.js"),
        AFRAME.registerComponent("super-hands", {
            schema: {
                colliderEvent: {
                    default: "hit"
                },
                colliderEventProperty: {
                    default: "el"
                },
                colliderEndEvent: {
                    default: "hitend"
                },
                colliderEndEventProperty: {
                    default: "el"
                },
                grabStartButtons: {
                    default: ["gripdown", "trackpaddown", "triggerdown", "gripclose", "abuttondown", "bbuttondown", "xbuttondown", "ybuttondown", "pointup", "thumbup", "pointingstart", "pistolstart", "thumbstickdown", "mousedown", "touchstart"]
                },
                grabEndButtons: {
                    default: ["gripup", "trackpadup", "triggerup", "gripopen", "abuttonup", "bbuttonup", "xbuttonup", "ybuttonup", "pointdown", "thumbdown", "pointingend", "pistolend", "thumbstickup", "mouseup", "touchend"]
                },
                stretchStartButtons: {
                    default: ["gripdown", "trackpaddown", "triggerdown", "gripclose", "abuttondown", "bbuttondown", "xbuttondown", "ybuttondown", "pointup", "thumbup", "pointingstart", "pistolstart", "thumbstickdown", "mousedown", "touchstart"]
                },
                stretchEndButtons: {
                    default: ["gripup", "trackpadup", "triggerup", "gripopen", "abuttonup", "bbuttonup", "xbuttonup", "ybuttonup", "pointdown", "thumbdown", "pointingend", "pistolend", "thumbstickup", "mouseup", "touchend"]
                },
                dragDropStartButtons: {
                    default: ["gripdown", "trackpaddown", "triggerdown", "gripclose", "abuttondown", "bbuttondown", "xbuttondown", "ybuttondown", "pointup", "thumbup", "pointingstart", "pistolstart", "thumbstickdown", "mousedown", "touchstart"]
                },
                dragDropEndButtons: {
                    default: ["gripup", "trackpadup", "triggerup", "gripopen", "abuttonup", "bbuttonup", "xbuttonup", "ybuttonup", "pointdown", "thumbdown", "pointingend", "pistolend", "thumbstickup", "mouseup", "touchend"]
                },
                interval: {
                    default: 0
                }
            },
            /**
   * Set if component needs multiple instancing.
   */
            multiple: !1,
            /**
   * Called once when component is attached. Generally for initial setup.
   */
            init: function() {
                // constants
                // links to other systems/components
                // state tracking - global event handlers (GEH)
                // state tracking - reaction components
                this.HOVER_EVENT = "hover-start",
                this.UNHOVER_EVENT = "hover-end",
                this.GRAB_EVENT = "grab-start",
                this.UNGRAB_EVENT = "grab-end",
                this.STRETCH_EVENT = "stretch-start",
                this.UNSTRETCH_EVENT = "stretch-end",
                this.DRAG_EVENT = "drag-start",
                this.UNDRAG_EVENT = "drag-end",
                this.DRAGOVER_EVENT = "dragover-start",
                this.UNDRAGOVER_EVENT = "dragover-end",
                this.DRAGDROP_EVENT = "drag-drop",
                this.otherSuperHand = null,
                this.gehDragged = new Set,
                this.gehClicking = new Set,
                this.hoverEls = [],
                this.hoverElsIntersections = [],
                this.prevCheckTime = null,
                this.state = new Map,
                this.dragging = !1,
                this.unHover = this.unHover.bind(this),
                this.unWatch = this.unWatch.bind(this),
                this.onHit = this.onHit.bind(this),
                this.onGrabStartButton = this.onGrabStartButton.bind(this),
                this.onGrabEndButton = this.onGrabEndButton.bind(this),
                this.onStretchStartButton = this.onStretchStartButton.bind(this),
                this.onStretchEndButton = this.onStretchEndButton.bind(this),
                this.onDragDropStartButton = this.onDragDropStartButton.bind(this),
                this.onDragDropEndButton = this.onDragDropEndButton.bind(this),
                this.system.registerMe(this)
            },
            /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
            update: function(a) {
                this.unRegisterListeners(a),
                this.registerListeners()
            },
            /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
            remove: function() {
                this.system.unregisterMe(this),
                this.unRegisterListeners(),
                this.hoverEls.length = 0,
                this.state.get(this.HOVER_EVENT) && this._unHover(this.state.get(this.HOVER_EVENT)),
                this.onGrabEndButton(),
                this.onStretchEndButton(),
                this.onDragDropEndButton()
            },
            tick: function() {
                // closer objects and objects with no distance come later in list
                function a(c, a) {
                    const b = null == c.distance ? -1 : c.distance
                      , d = null == a.distance ? -1 : a.distance;
                    return b < d ? 1 : d < b ? -1 : 0
                }
                return function(b) {
                    const c = this.data
                      , d = this.prevCheckTime;
                    if (d && b - d < c.interval)
                        return;
                    this.prevCheckTime = b;
                    let e = !1;
                    this.hoverElsIntersections.sort(a);
                    for (let a = 0; a < this.hoverElsIntersections.length; a++)
                        this.hoverEls[a] !== this.hoverElsIntersections[a].object.el && (e = !0,
                        this.hoverEls[a] = this.hoverElsIntersections[a].object.el);
                    e && this.hover()
                }
            }(),
            onGrabStartButton: function(a) {
                let b = this.state.get(this.GRAB_EVENT);
                this.dispatchMouseEventAll("mousedown", this.el),
                this.gehClicking = new Set(this.hoverEls),
                b || (b = this.findTarget(this.GRAB_EVENT, {
                    hand: this.el,
                    buttonEvent: a
                }),
                b && (this.state.set(this.GRAB_EVENT, b),
                this._unHover(b)))
            },
            onGrabEndButton: function(a) {
                const b = this.hoverEls.filter(a => this.gehClicking.has(a))
                  , c = this.state.get(this.GRAB_EVENT)
                  , d = {
                    hand: this.el,
                    buttonEvent: a
                };
                this.dispatchMouseEventAll("mouseup", this.el);
                for (let c = 0; c < b.length; c++)
                    this.dispatchMouseEvent(b[c], "click", this.el);
                this.gehClicking.clear(),
                c && !this.emitCancelable(c, this.UNGRAB_EVENT, d) && (this.promoteHoveredEl(this.state.get(this.GRAB_EVENT)),
                this.state.delete(this.GRAB_EVENT),
                this.hover())
            },
            onStretchStartButton: function(a) {
                let b = this.state.get(this.STRETCH_EVENT);
                b || (b = this.findTarget(this.STRETCH_EVENT, {
                    hand: this.el,
                    buttonEvent: a
                }),
                b && (this.state.set(this.STRETCH_EVENT, b),
                this._unHover(b)))
            },
            onStretchEndButton: function(a) {
                const b = this.state.get(this.STRETCH_EVENT)
                  , c = {
                    hand: this.el,
                    buttonEvent: a
                };
                // check if end event accepted
                b && !this.emitCancelable(b, this.UNSTRETCH_EVENT, c) && (this.promoteHoveredEl(b),
                this.state.delete(this.STRETCH_EVENT),
                this.hover())
            },
            onDragDropStartButton: function(a) {
                let b = this.state.get(this.DRAG_EVENT);
                this.dragging = !0,
                this.hoverEls.length && (this.gehDragged = new Set(this.hoverEls),
                this.dispatchMouseEventAll("dragstart", this.el)),
                b || (b = this.state.get(this.GRAB_EVENT) && !this.emitCancelable(this.state.get(this.GRAB_EVENT), this.DRAG_EVENT, {
                    hand: this.el,
                    buttonEvent: a
                }) ? this.state.get(this.GRAB_EVENT) : this.findTarget(this.DRAG_EVENT, {
                    hand: this.el,
                    buttonEvent: a
                }),
                b && (this.state.set(this.DRAG_EVENT, b),
                this._unHover(b)))
            },
            onDragDropEndButton: function(a) {
                const b = this.state.get(this.DRAG_EVENT);
                if (this.dragging = !1,
                this.gehDragged.forEach(a => {
                    this.dispatchMouseEvent(a, "dragend", this.el),
                    this.dispatchMouseEventAll("drop", a, !0, !0),
                    this.dispatchMouseEventAll("dragleave", a, !0, !0)
                }
                ),
                this.gehDragged.clear(),
                b) {
                    const c = {
                        hand: this.el,
                        dropped: b,
                        on: null,
                        buttonEvent: a
                    }
                      , d = {
                        hand: this.el,
                        buttonEvent: a
                    }
                      , e = this.findTarget(this.DRAGDROP_EVENT, c, !0);
                    e && (c.on = e,
                    this.emitCancelable(b, this.DRAGDROP_EVENT, c),
                    this._unHover(e)),
                    this.emitCancelable(b, this.UNDRAG_EVENT, d) || (this.promoteHoveredEl(b),
                    this.state.delete(this.DRAG_EVENT),
                    this.hover())
                }
            },
            processHitEl: function(a, b) {
                const c = b && b.distance
                  , d = this.hoverElsIntersections
                  , e = this.hoverEls
                  , f = this.hoverEls.indexOf(a);
                let g = !1;
                if (c && void 0 !== b.instanceId && (a.object3D.userData = {
                    instanceId: b.instanceId
                }),
                -1 === f) {
                    // insert in order of distance when available
                    if (g = !0,
                    null != c) {
                        let f = 0;
                        for (; f < d.length && c < d[f].distance; )
                            f++;
                        e.splice(f, 0, a),
                        d.splice(f, 0, b)
                    } else
                        e.push(a),
                        d.push({
                            object: {
                                el: a
                            }
                        });
                    this.dispatchMouseEvent(a, "mouseover", this.el),
                    this.dragging && this.gehDragged.size && this.gehDragged.forEach(a => {
                        this.dispatchMouseEventAll("dragenter", a, !0, !0)
                    }
                    )
                }
                return g
            },
            onHit: function(a) {
                const b = a.detail[this.data.colliderEventProperty];
                let c = 0;
                if (b) {
                    if (Array.isArray(b))
                        for (let d, e = 0; e < b.length; e++)
                            d = a.detail.intersections && a.detail.intersections[e],
                            c += this.processHitEl(b[e], d);
                    else
                        c += this.processHitEl(b, null);
                    c && this.hover()
                }
            },
            /* search collided entities for target to hover/dragover */
            hover: function() {
                let a, b;
                // end previous hover
                this.state.has(this.HOVER_EVENT) && this._unHover(this.state.get(this.HOVER_EVENT), !0),
                this.state.has(this.DRAGOVER_EVENT) && this._unHover(this.state.get(this.DRAGOVER_EVENT), !0),
                this.dragging && this.state.get(this.DRAG_EVENT) && (a = {
                    hand: this.el,
                    hovered: b,
                    carried: this.state.get(this.DRAG_EVENT)
                },
                b = this.findTarget(this.DRAGOVER_EVENT, a, !0),
                b && (this.emitCancelable(this.state.get(this.DRAG_EVENT), this.DRAGOVER_EVENT, a),
                this.state.set(this.DRAGOVER_EVENT, b))),
                this.state.has(this.DRAGOVER_EVENT) || (b = this.findTarget(this.HOVER_EVENT, {
                    hand: this.el
                }, !0),
                b && this.state.set(this.HOVER_EVENT, b))
            },
            /* called when controller moves out of collision range of entity */
            unHover: function(a) {
                const b = a.detail[this.data.colliderEndEventProperty];
                b && (Array.isArray(b) ? b.forEach(a => this._unHover(a)) : this._unHover(b))
            },
            /* inner unHover steps needed regardless of cause of unHover */
            _unHover: function(a, b) {
                let c, d = !1;
                a === this.state.get(this.DRAGOVER_EVENT) && (this.state.delete(this.DRAGOVER_EVENT),
                d = !0,
                c = {
                    hand: this.el,
                    hovered: a,
                    carried: this.state.get(this.DRAG_EVENT)
                },
                this.emitCancelable(a, this.UNDRAGOVER_EVENT, c),
                this.state.has(this.DRAG_EVENT) && this.emitCancelable(this.state.get(this.DRAG_EVENT), this.UNDRAGOVER_EVENT, c)),
                a === this.state.get(this.HOVER_EVENT) && (this.state.delete(this.HOVER_EVENT),
                d = !0,
                this.emitCancelable(a, this.UNHOVER_EVENT, {
                    hand: this.el
                })),
                d && !b && this.hover()
            },
            unWatch: function(a) {
                const b = a.detail[this.data.colliderEndEventProperty];
                b && (Array.isArray(b) ? b.forEach(a => this._unWatch(a)) : this._unWatch(b))
            },
            _unWatch: function(a) {
                const b = this.hoverEls.indexOf(a);
                -1 !== b && (this.hoverEls.splice(b, 1),
                this.hoverElsIntersections.splice(b, 1)),
                this.gehDragged.forEach(b => {
                    this.dispatchMouseEvent(a, "dragleave", b),
                    this.dispatchMouseEvent(b, "dragleave", a)
                }
                ),
                this.dispatchMouseEvent(a, "mouseout", this.el)
            },
            registerListeners: function() {
                // binding order to keep grabEnd from triggering dragover
                // again before dragDropEnd can delete its carried state
                this.el.addEventListener(this.data.colliderEvent, this.onHit),
                this.el.addEventListener(this.data.colliderEndEvent, this.unWatch),
                this.el.addEventListener(this.data.colliderEndEvent, this.unHover),
                this.data.grabStartButtons.forEach(a => {
                    this.el.addEventListener(a, this.onGrabStartButton)
                }
                ),
                this.data.stretchStartButtons.forEach(a => {
                    this.el.addEventListener(a, this.onStretchStartButton)
                }
                ),
                this.data.dragDropStartButtons.forEach(a => {
                    this.el.addEventListener(a, this.onDragDropStartButton)
                }
                ),
                this.data.dragDropEndButtons.forEach(a => {
                    this.el.addEventListener(a, this.onDragDropEndButton)
                }
                ),
                this.data.stretchEndButtons.forEach(a => {
                    this.el.addEventListener(a, this.onStretchEndButton)
                }
                ),
                this.data.grabEndButtons.forEach(a => {
                    this.el.addEventListener(a, this.onGrabEndButton)
                }
                )
            },
            unRegisterListeners: function(a) {
                a = a || this.data;
                0 === Object.keys(a).length || (this.el.removeEventListener(a.colliderEvent, this.onHit),
                this.el.removeEventListener(a.colliderEndEvent, this.unHover),
                this.el.removeEventListener(a.colliderEndEvent, this.unWatch),
                a.grabStartButtons.forEach(a => {
                    this.el.removeEventListener(a, this.onGrabStartButton)
                }
                ),
                a.grabEndButtons.forEach(a => {
                    this.el.removeEventListener(a, this.onGrabEndButton)
                }
                ),
                a.stretchStartButtons.forEach(a => {
                    this.el.removeEventListener(a, this.onStretchStartButton)
                }
                ),
                a.stretchEndButtons.forEach(a => {
                    this.el.removeEventListener(a, this.onStretchEndButton)
                }
                ),
                a.dragDropStartButtons.forEach(a => {
                    this.el.removeEventListener(a, this.onDragDropStartButton)
                }
                ),
                a.dragDropEndButtons.forEach(a => {
                    this.el.removeEventListener(a, this.onDragDropEndButton)
                }
                ))
            },
            emitCancelable: function(a, b, c) {
                c = c || {};
                const d = {
                    bubbles: !0,
                    cancelable: !0,
                    detail: c
                };
                d.detail.target = d.detail.target || a;
                const e = new window.CustomEvent(b,d);
                return a.dispatchEvent(e)
            },
            dispatchMouseEvent: function(a, b, c) {
                const d = new window.MouseEvent(b,{
                    relatedTarget: c
                });
                a.dispatchEvent(d)
            },
            dispatchMouseEventAll: function(a, b, c, d) {
                let e = this.hoverEls;
                if (c && (e = e.filter(a => a !== this.state.get(this.GRAB_EVENT) && a !== this.state.get(this.DRAG_EVENT) && a !== this.state.get(this.STRETCH_EVENT) && !this.gehDragged.has(a))),
                d)
                    for (let c = 0; c < e.length; c++)
                        this.dispatchMouseEvent(e[c], a, b),
                        this.dispatchMouseEvent(b, a, e[c]);
                else
                    for (let c = 0; c < e.length; c++)
                        this.dispatchMouseEvent(e[c], a, b)
            },
            findTarget: function(a, b, c) {
                let d, e = this.hoverEls;
                for (c && (e = e.filter(a => a !== this.state.get(this.GRAB_EVENT) && a !== this.state.get(this.DRAG_EVENT) && a !== this.state.get(this.STRETCH_EVENT))),
                d = e.length - 1; 0 <= d; d--)
                    if (!this.emitCancelable(e[d], a, b))
                        return e[d];
                return null
            },
            // Helper to ensure dropping and regrabbing finds the same target for
            // for order-sorted hoverEls (grabbing; no-op for distance-sorted (pointing)
            promoteHoveredEl: function(a) {
                const b = this.hoverEls.indexOf(a);
                if (-1 !== b && null == this.hoverElsIntersections[b].distance) {
                    this.hoverEls.splice(b, 1);
                    const c = this.hoverElsIntersections.splice(b, 1);
                    this.hoverEls.push(a),
                    this.hoverElsIntersections.push(c[0])
                }
            }
        });

    }
    , {
        "./reaction_components/clickable.js": 2,
        "./reaction_components/drag-droppable.js": 3,
        "./reaction_components/draggable.js": 4,
        "./reaction_components/droppable.js": 5,
        "./reaction_components/grabbable.js": 6,
        "./reaction_components/hoverable.js": 7,
        "./reaction_components/stretchable.js": 10,
        "./systems/super-hands-system.js": 11
    }],
    2: [function(require, module, exports) {
        "use strict";
        /* global AFRAME */
        const buttonCore = require("./prototypes/buttons-proto.js");
        AFRAME.registerComponent("clickable", AFRAME.utils.extendDeep({}, buttonCore, {
            schema: {
                onclick: {
                    type: "string"
                }
            },
            init: function() {
                this.CLICKED_STATE = "clicked",
                this.CLICK_EVENT = "grab-start",
                this.UNCLICK_EVENT = "grab-end",
                this.clickers = [],
                this.start = this.start.bind(this),
                this.end = this.end.bind(this),
                this.el.addEventListener(this.CLICK_EVENT, this.start),
                this.el.addEventListener(this.UNCLICK_EVENT, this.end)
            },
            remove: function() {
                this.el.removeEventListener(this.CLICK_EVENT, this.start),
                this.el.removeEventListener(this.UNCLICK_EVENT, this.end)
            },
            start: function(a) {
                a.defaultPrevented || !this.startButtonOk(a) || (this.el.addState(this.CLICKED_STATE),
                -1 === this.clickers.indexOf(a.detail.hand) && (this.clickers.push(a.detail.hand),
                a.preventDefault && a.preventDefault()))
            },
            end: function(a) {
                const b = this.clickers.indexOf(a.detail.hand);
                a.defaultPrevented || !this.endButtonOk(a) || (-1 !== b && this.clickers.splice(b, 1),
                1 > this.clickers.length && this.el.removeState(this.CLICKED_STATE),
                a.preventDefault && a.preventDefault())
            }
        }));

    }
    , {
        "./prototypes/buttons-proto.js": 8
    }],
    3: [function(require, module, exports) {
        "use strict";
        /* global AFRAME */
        const inherit = AFRAME.utils.extendDeep
          , buttonCore = require("./prototypes/buttons-proto.js");
        AFRAME.registerComponent("drag-droppable", inherit({}, buttonCore, {
            init: function() {
                console.warn("Warning: drag-droppable is deprecated. Use draggable and droppable components instead"),
                this.HOVERED_STATE = "dragover",
                this.DRAGGED_STATE = "dragged",
                this.HOVER_EVENT = "dragover-start",
                this.UNHOVER_EVENT = "dragover-end",
                this.DRAG_EVENT = "drag-start",
                this.UNDRAG_EVENT = "drag-end",
                this.DRAGDROP_EVENT = "drag-drop",
                this.hoverStart = this.hoverStart.bind(this),
                this.dragStart = this.dragStart.bind(this),
                this.hoverEnd = this.hoverEnd.bind(this),
                this.dragEnd = this.dragEnd.bind(this),
                this.dragDrop = this.dragDrop.bind(this),
                this.el.addEventListener(this.HOVER_EVENT, this.hoverStart),
                this.el.addEventListener(this.DRAG_EVENT, this.dragStart),
                this.el.addEventListener(this.UNHOVER_EVENT, this.hoverEnd),
                this.el.addEventListener(this.UNDRAG_EVENT, this.dragEnd),
                this.el.addEventListener(this.DRAGDROP_EVENT, this.dragDrop)
            },
            remove: function() {
                this.el.removeEventListener(this.HOVER_EVENT, this.hoverStart),
                this.el.removeEventListener(this.DRAG_EVENT, this.dragStart),
                this.el.removeEventListener(this.UNHOVER_EVENT, this.hoverEnd),
                this.el.removeEventListener(this.UNDRAG_EVENT, this.dragEnd),
                this.el.removeEventListener(this.DRAGDROP_EVENT, this.dragDrop)
            },
            hoverStart: function(a) {
                this.el.addState(this.HOVERED_STATE),
                a.preventDefault && a.preventDefault()
            },
            dragStart: function(a) {
                this.startButtonOk(a) && (this.el.addState(this.DRAGGED_STATE),
                a.preventDefault && a.preventDefault())
            },
            hoverEnd: function() {
                this.el.removeState(this.HOVERED_STATE)
            },
            dragEnd: function(a) {
                this.endButtonOk(a) && (this.el.removeState(this.DRAGGED_STATE),
                a.preventDefault && a.preventDefault())
            },
            dragDrop: function(a) {
                !this.endButtonOk(a) || a.preventDefault && a.preventDefault()
            }
        }));

    }
    , {
        "./prototypes/buttons-proto.js": 8
    }],
    4: [function(require, module, exports) {
        "use strict";
        /* global AFRAME */
        const inherit = AFRAME.utils.extendDeep
          , buttonCore = require("./prototypes/buttons-proto.js");
        AFRAME.registerComponent("draggable", inherit({}, buttonCore, {
            init: function() {
                this.DRAGGED_STATE = "dragged",
                this.DRAG_EVENT = "drag-start",
                this.UNDRAG_EVENT = "drag-end",
                this.dragStartBound = this.dragStart.bind(this),
                this.dragEndBound = this.dragEnd.bind(this),
                this.el.addEventListener(this.DRAG_EVENT, this.dragStartBound),
                this.el.addEventListener(this.UNDRAG_EVENT, this.dragEndBound)
            },
            remove: function() {
                this.el.removeEventListener(this.DRAG_EVENT, this.dragStart),
                this.el.removeEventListener(this.UNDRAG_EVENT, this.dragEnd)
            },
            dragStart: function(a) {
                a.defaultPrevented || !this.startButtonOk(a) || (this.el.addState(this.DRAGGED_STATE),
                a.preventDefault && a.preventDefault())
            },
            dragEnd: function(a) {
                a.defaultPrevented || !this.endButtonOk(a) || (this.el.removeState(this.DRAGGED_STATE),
                a.preventDefault && a.preventDefault())
            }
        }));

    }
    , {
        "./prototypes/buttons-proto.js": 8
    }],
    5: [function(require, module, exports) {
        "use strict";
        /* global AFRAME */
        function elementMatches(a, b) {
            return a.matches ? a.matches(b) : a.msMatchesSelector ? a.msMatchesSelector(b) : a.webkitMatchesSelector ? a.webkitMatchesSelector(b) : void 0
        }
        AFRAME.registerComponent("droppable", {
            schema: {
                accepts: {
                    default: ""
                },
                autoUpdate: {
                    default: !0
                },
                acceptEvent: {
                    default: ""
                },
                rejectEvent: {
                    default: ""
                }
            },
            multiple: !0,
            init: function() {
                // better for Sinon spying if original method not overwritten
                this.HOVERED_STATE = "dragover",
                this.HOVER_EVENT = "dragover-start",
                this.UNHOVER_EVENT = "dragover-end",
                this.DRAGDROP_EVENT = "drag-drop",
                this.hoverStartBound = this.hoverStart.bind(this),
                this.hoverEndBound = this.hoverEnd.bind(this),
                this.dragDropBound = this.dragDrop.bind(this),
                this.mutateAcceptsBound = this.mutateAccepts.bind(this),
                this.acceptableEntities = [],
                this.observer = new window.MutationObserver(this.mutateAcceptsBound),
                this.observerOpts = {
                    childList: !0,
                    subtree: !0
                },
                this.el.addEventListener(this.HOVER_EVENT, this.hoverStartBound),
                this.el.addEventListener(this.UNHOVER_EVENT, this.hoverEndBound),
                this.el.addEventListener(this.DRAGDROP_EVENT, this.dragDropBound)
            },
            update: function() {
                this.acceptableEntities = this.data.accepts.length ? Array.prototype.slice.call(this.el.sceneEl.querySelectorAll(this.data.accepts)) : null,
                this.data.autoUpdate && null != this.acceptableEntities ? this.observer.observe(this.el.sceneEl, this.observerOpts) : this.observer.disconnect()
            },
            remove: function() {
                this.el.removeEventListener(this.HOVER_EVENT, this.hoverStartBound),
                this.el.removeEventListener(this.UNHOVER_EVENT, this.hoverEndBound),
                this.el.removeEventListener(this.DRAGDROP_EVENT, this.dragDropBound),
                this.observer.disconnect()
            },
            mutateAccepts: function(a) {
                const b = this.data.accepts;
                a.forEach(a => {
                    a.addedNodes.forEach(a => {
                        elementMatches(a, b) && this.acceptableEntities.push(a)
                    }
                    )
                }
                )
            },
            entityAcceptable: function(a) {
                const b = this.acceptableEntities;
                if (null == b)
                    return !0;
                for (const c of b)
                    if (c === a)
                        return !0;
                return !1
            },
            hoverStart: function(a) {
                a.defaultPrevented || !this.entityAcceptable(a.detail.carried) || (this.el.addState(this.HOVERED_STATE),
                a.preventDefault && a.preventDefault())
            },
            hoverEnd: function(a) {
                a.defaultPrevented || this.el.removeState(this.HOVERED_STATE)
            },
            dragDrop: function(a) {
                if (!a.defaultPrevented) {
                    const b = a.detail.dropped;
                    return this.entityAcceptable(b) ? void (this.data.acceptEvent.length && this.el.emit(this.data.acceptEvent, {
                        el: b
                    }),
                    a.preventDefault && a.preventDefault()) : void (this.data.rejectEvent.length && this.el.emit(this.data.rejectEvent, {
                        el: b
                    }))
                }
            }
        });

    }
    , {}],
    6: [function(require, module, exports) {
        "use strict";
        /* global AFRAME, THREE */
        const inherit = AFRAME.utils.extendDeep
          , physicsCore = require("./prototypes/physics-grab-proto.js")
          , buttonsCore = require("./prototypes/buttons-proto.js")
          , base = inherit({}, physicsCore, buttonsCore);
        // new object with all core modules
        AFRAME.registerComponent("grabbable", inherit(base, {
            schema: {
                maxGrabbers: {
                    type: "int",
                    default: NaN
                },
                invert: {
                    default: !1
                },
                suppressY: {
                    default: !1
                }
            },
            init: function() {
                // persistent object speeds up repeat setAttribute calls
                // Store bound event handlers
                console.log("Grabbable component initialized"),
                this.GRABBED_STATE = "grabbed",
                this.GRAB_EVENT = "grab-start",
                this.UNGRAB_EVENT = "grab-end",
                this.grabbed = !1,
                this.grabbers = [],
                this.constraints = new Map,
                this.deltaPositionIsValid = !1,
                this.grabDistance = void 0,
                this.grabDirection = {
                    x: 0,
                    y: 0,
                    z: -1
                },
                this.grabOffset = {
                    x: 0,
                    y: 0,
                    z: 0
                },
                this.destPosition = {
                    x: 0,
                    y: 0,
                    z: 0
                },
                this.deltaPosition = new THREE.Vector3,
                this.targetPosition = new THREE.Vector3,
                this.physicsInit(),
                this.onGrabStart = this.start.bind(this),
                this.onGrabEnd = this.end.bind(this),
                this.onMouseOut = this.lostGrabber.bind(this),
                this.el.addEventListener(this.GRAB_EVENT, this.onGrabStart),
                this.el.addEventListener(this.UNGRAB_EVENT, this.onGrabEnd),
                this.el.addEventListener("mouseout", this.onMouseOut)
            },
            update: function() {
                this.physicsUpdate(),
                this.xFactor = this.data.invert ? -1 : 1,
                this.zFactor = this.data.invert ? -1 : 1,
                this.yFactor = (this.data.invert ? -1 : 1) * !this.data.suppressY
            },
            tick: function() {
                const a = new THREE.Quaternion
                  , b = new THREE.Vector3;
                return function() {
                    let c;
                    this.grabber && (this.targetPosition.copy(this.grabDirection),
                    this.targetPosition.applyQuaternion(this.grabber.object3D.getWorldQuaternion(a)).setLength(this.grabDistance).add(this.grabber.object3D.getWorldPosition(b)).add(this.grabOffset),
                    this.deltaPositionIsValid ? (this.deltaPosition.sub(this.targetPosition),
                    c = this.el.getAttribute("position"),
                    this.destPosition.x = c.x - this.deltaPosition.x * this.xFactor,
                    this.destPosition.y = c.y - this.deltaPosition.y * this.yFactor,
                    this.destPosition.z = c.z - this.deltaPosition.z * this.zFactor,
                    this.el.setAttribute("position", this.destPosition)) : this.deltaPositionIsValid = !0,
                    this.deltaPosition.copy(this.targetPosition))
                }
            }(),
            remove: function() {
                // Clear references to grabbers and constraints
                // Reset flags and states
                // Clean up physics resources if applicable
                this.el.removeEventListener(this.GRAB_EVENT, this.onGrabStart),
                this.el.removeEventListener(this.UNGRAB_EVENT, this.onGrabEnd),
                this.el.removeEventListener("mouseout", this.onMouseOut),
                this.grabbers.length = 0,
                this.grabber = null,
                this.constraints.clear(),
                this.grabbed = !1,
                this.el.removeState(this.GRABBED_STATE),
                this.physicsRemove(),
                this.onGrabStart = null,
                this.onGrabEnd = null,
                this.onMouseOut = null,
                console.log("succesfully removed")
            },
            start: function(a) {
                var b = Number.isFinite;
                if (!a.defaultPrevented && this.startButtonOk(a)) {
                    // room for more grabbers?
                    const c = !b(this.data.maxGrabbers) || this.grabbers.length < this.data.maxGrabbers;
                    if (-1 === this.grabbers.indexOf(a.detail.hand) && c) {
                        if (!a.detail.hand.object3D)
                            return void console.warn("grabbable entities must have an object3D");
                        this.grabbers.push(a.detail.hand),
                        this.physicsStart(a) || this.grabber || (this.grabber = a.detail.hand,
                        this.resetGrabber()),
                        a.preventDefault && a.preventDefault(),
                        this.grabbed = !0,
                        this.el.addState(this.GRABBED_STATE)
                    }
                }
            },
            end: function(a) {
                const b = this.grabbers.indexOf(a.detail.hand);
                a.defaultPrevented || !this.endButtonOk(a) || (-1 !== b && (this.grabbers.splice(b, 1),
                this.grabber = this.grabbers[0]),
                this.physicsEnd(a),
                !this.resetGrabber() && (this.grabbed = !1,
                this.el.removeState(this.GRABBED_STATE)),
                a.preventDefault && a.preventDefault())
            },
            resetGrabber: function() {
                const a = new THREE.Vector3
                  , b = new THREE.Vector3;
                return function() {
                    if (!this.grabber)
                        return !1;
                    const c = this.grabber.getAttribute("raycaster");
                    return this.deltaPositionIsValid = !1,
                    this.grabDistance = this.el.object3D.getWorldPosition(a).distanceTo(this.grabber.object3D.getWorldPosition(b)),
                    c && (this.grabDirection = c.direction,
                    this.grabOffset = c.origin),
                    !0
                }
            }(),
            lostGrabber: function(a) {
                const b = this.grabbers.indexOf(a.relatedTarget);
                // if a queued, non-physics grabber leaves the collision zone, forget it
                -1 === b || a.relatedTarget === this.grabber || this.physicsIsConstrained(a.relatedTarget) || this.grabbers.splice(b, 1)
            }
        }));

    }
    , {
        "./prototypes/buttons-proto.js": 8,
        "./prototypes/physics-grab-proto.js": 9
    }],
    7: [function(require, module, exports) {
        "use strict";
        /* global AFRAME */
        AFRAME.registerComponent("hoverable", {
            init: function() {
                this.HOVERED_STATE = "hovered",
                this.HOVER_EVENT = "hover-start",
                this.UNHOVER_EVENT = "hover-end",
                this.hoverers = [],
                this.start = this.start.bind(this),
                this.end = this.end.bind(this),
                this.el.addEventListener(this.HOVER_EVENT, this.start),
                this.el.addEventListener(this.UNHOVER_EVENT, this.end)
            },
            remove: function() {
                this.el.removeEventListener(this.HOVER_EVENT, this.start),
                this.el.removeEventListener(this.UNHOVER_EVENT, this.end)
            },
            start: function(a) {
                a.defaultPrevented || (this.el.addState(this.HOVERED_STATE),
                -1 === this.hoverers.indexOf(a.detail.hand) && this.hoverers.push(a.detail.hand),
                a.preventDefault && a.preventDefault())
            },
            end: function(a) {
                if (!a.defaultPrevented) {
                    const b = this.hoverers.indexOf(a.detail.hand);
                    -1 !== b && this.hoverers.splice(b, 1),
                    1 > this.hoverers.length && this.el.removeState(this.HOVERED_STATE)
                }
            }
        });

    }
    , {}],
    8: [function(require, module, exports) {
        "use strict";
        // common code used in customizing reaction components by button
        module.exports = function() {
            function a(a, b) {
                return 0 === b.length || -1 !== b.indexOf(a.detail.buttonEvent.type)
            }
            return {
                schema: {
                    startButtons: {
                        default: []
                    },
                    endButtons: {
                        default: []
                    }
                },
                startButtonOk: function(b) {
                    return a(b, this.data.startButtons)
                },
                endButtonOk: function(b) {
                    return a(b, this.data.endButtons)
                }
            }
        }();

    }
    , {}],
    9: [function(require, module, exports) {
        "use strict";
        // base code used by grabbable for physics interactions
        module.exports = {
            schema: {
                usePhysics: {
                    default: "ifavailable"
                }
            },
            physicsInit: function() {
                this.constraints = new Map
            },
            physicsUpdate: function() {
                "never" === this.data.usePhysics && this.constraints.size && this.physicsClear()
            },
            physicsRemove: function() {
                this.physicsClear()
            },
            physicsStart: function(a) {
                // initiate physics constraint if available and not already existing
                if ("never" !== this.data.usePhysics && this.el.body && a.detail.hand.body && !this.constraints.has(a.detail.hand)) {
                    const b = Math.random().toString(36).substr(2, 9);
                    return this.el.setAttribute("constraint__" + b, {
                        target: a.detail.hand
                    }),
                    this.constraints.set(a.detail.hand, b),
                    !0
                }
                // Prevent manual grab by returning true
                return "only" === this.data.usePhysics
            },
            physicsEnd: function(a) {
                const b = this.constraints.get(a.detail.hand);
                b && (this.el.removeAttribute("constraint__" + b),
                this.constraints.delete(a.detail.hand))
            },
            physicsClear: function() {
                if (this.el.body)
                    for (const a of this.constraints.values())
                        this.el.body.world.removeConstraint(a);
                this.constraints.clear()
            },
            physicsIsConstrained: function(a) {
                return this.constraints.has(a)
            },
            physicsIsGrabbing() {
                return 0 < this.constraints.size
            }
        };

    }
    , {}],
    10: [function(require, module, exports) {
        "use strict";
        /* global AFRAME, THREE */
        const inherit = AFRAME.utils.extendDeep
          , buttonsCore = require("./prototypes/buttons-proto.js")
          , base = inherit({}, buttonsCore);
        // new object with all core modules
        AFRAME.registerComponent("stretchable", inherit(base, {
            schema: {
                usePhysics: {
                    default: "ifavailable"
                },
                invert: {
                    default: !1
                },
                physicsUpdateRate: {
                    default: 100
                }
            },
            init: function() {
                this.STRETCHED_STATE = "stretched",
                this.STRETCH_EVENT = "stretch-start",
                this.UNSTRETCH_EVENT = "stretch-end",
                this.stretched = !1,
                this.stretchers = [],
                this.scale = new THREE.Vector3,
                this.handPos = new THREE.Vector3,
                this.otherHandPos = new THREE.Vector3,
                this.start = this.start.bind(this),
                this.end = this.end.bind(this),
                this.el.addEventListener(this.STRETCH_EVENT, this.start),
                this.el.addEventListener(this.UNSTRETCH_EVENT, this.end)
            },
            update: function() {
                this.updateBodies = AFRAME.utils.throttleTick(this._updateBodies, this.data.physicsUpdateRate, this)
            },
            tick: function(a, b) {
                if (!this.stretched)
                    return;
                this.scale.copy(this.el.getAttribute("scale")),
                this.stretchers[0].object3D.getWorldPosition(this.handPos),
                this.stretchers[1].object3D.getWorldPosition(this.otherHandPos);
                const c = this.handPos.distanceTo(this.otherHandPos);
                let d = 1;
                // scale update for all nested physics bodies (throttled)
                null !== this.previousStretch && 0 !== c && (d = Math.pow(c / this.previousStretch, this.data.invert ? -1 : 1)),
                this.previousStretch = c,
                null == this.previousPhysicsStretch && (this.previousPhysicsStretch = c),
                this.scale.multiplyScalar(d),
                this.el.setAttribute("scale", this.scale),
                this.updateBodies(a, b)
            },
            remove: function() {
                this.el.removeEventListener(this.STRETCH_EVENT, this.start),
                this.el.removeEventListener(this.UNSTRETCH_EVENT, this.end)
            },
            start: function(a) {
                this.stretched || this.stretchers.includes(a.detail.hand) || !this.startButtonOk(a) || a.defaultPrevented || (// already stretched or already captured this hand or wrong button
                this.stretchers.push(a.detail.hand),
                2 === this.stretchers.length && (this.stretched = !0,
                this.previousStretch = null,
                this.previousPhysicsStretch = null,
                this.el.addState(this.STRETCHED_STATE)),
                a.preventDefault && a.preventDefault())
            },
            end: function(a) {
                const b = this.stretchers.indexOf(a.detail.hand);
                a.defaultPrevented || !this.endButtonOk(a) || (-1 !== b && (this.stretchers.splice(b, 1),
                this.stretched = !1,
                this.el.removeState(this.STRETCHED_STATE),
                this._updateBodies()),
                a.preventDefault && a.preventDefault())
            },
            _updateBodies: function() {
                var a = Math.pow;
                if (!this.el.body || "never" === this.data.usePhysics)
                    return;
                const b = this.previousStretch;
                // last visible geometry stretch
                let d = 1;
                if (null !== this.previousPhysicsStretch && 0 < b && (d = a(b / this.previousPhysicsStretch, this.data.invert ? -1 : 1)),
                this.previousPhysicsStretch = b,
                1 !== d) {
                    for (const a of this.el.childNodes)
                        this.stretchBody(a, d);
                    this.stretchBody(this.el, d)
                }
            },
            stretchBody: function(a, b) {
                if (!a.body)
                    return;
                let c, d;
                for (let e = 0; e < a.body.shapes.length; e++)
                    // also move offset to match scale change
                    c = a.body.shapes[e],
                    c.halfExtents ? (c.halfExtents.scale(b, c.halfExtents),
                    c.updateConvexPolyhedronRepresentation()) : c.radius ? (c.radius *= b,
                    c.updateBoundingSphereRadius()) : !this.shapeWarned && (console.warn("Unable to stretch physics body: unsupported shape"),
                    this.shapeWarned = !0),
                    d = a.body.shapeOffsets[e],
                    d.scale(b, d);
                a.body.updateBoundingRadius()
            }
        }));

    }
    , {
        "./prototypes/buttons-proto.js": 8
    }],
    11: [function(require, module, exports) {
        "use strict";
        /* global AFRAME */
        AFRAME.registerSystem("super-hands", {
            init: function() {
                this.superHands = []
            },
            registerMe: function(a) {
                1 === this.superHands.length && (this.superHands[0].otherSuperHand = a,
                a.otherSuperHand = this.superHands[0]),
                this.superHands.push(a)
            },
            unregisterMe: function(a) {
                const b = this.superHands.indexOf(a);
                -1 !== b && this.superHands.splice(b, 1),
                this.superHands.forEach(b => {
                    b.otherSuperHand === a && (b.otherSuperHand = null)
                }
                )
            }
        });

    }
    , {}]
}, {}, [1]);
