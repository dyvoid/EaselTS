var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Container', '../../tweents/Timeline', '../../tweents/Tween', './DisplayObject'], function (require, exports, Container, Timeline, Tween, DisplayObject) {
    /**
     * The MovieClip class associates a TweenJS Timeline with an EaselJS {{#crossLink "Container"}}{{/crossLink}}. It allows
     * you to create objects which encapsulate timeline animations, state changes, and synched actions. Due to the
     * complexities inherent in correctly setting up a MovieClip, it is largely intended for tool output and is not included
     * in the main EaselJS library.
     *
     * Currently MovieClip only works properly if it is tick based (as opposed to time based) though some concessions have
     * been made to support time-based timelines in the future.
     *
     * <h4>Example</h4>
     * This example animates two shapes back and forth. The grey shape starts on the left, but we jump to a mid-point in
     * the animation using {{#crossLink "MovieClip/gotoAndPlay"}}{{/crossLink}}.
     *
     *      var stage = new createjs.Stage("canvas");
     *      createjs.Ticker.addEventListener("tick", stage);
     *
     *      var mc = new createjs.MovieClip(null, 0, true, {start:20});
     *      stage.addChild(mc);
     *
     *      var child1 = new createjs.Shape(
     *          new createjs.Graphics().beginFill("#999999")
     *              .drawCircle(30,30,30));
     *      var child2 = new createjs.Shape(
     *          new createjs.Graphics().beginFill("#5a9cfb")
     *              .drawCircle(30,30,30));
     *
     *      mc.timeline.addTween(
     *          createjs.Tween.get(child1)
     *              .to({x:0}).to({x:60}, 50).to({x:0}, 50));
     *      mc.timeline.addTween(
     *          createjs.Tween.get(child2)
     *              .to({x:60}).to({x:0}, 50).to({x:60}, 50));
     *
     *      mc.gotoAndPlay("start");
     *
     * It is recommended to use <code>tween.to()</code> to animate and set properties (use no duration to have it set
     * immediately), and the <code>tween.wait()</code> method to create delays between animations. Note that using the
     * <code>tween.set()</code> method to affect properties will likely not provide the desired result.
     *
     * @class MovieClip
     * @main MovieClip
     * @extends Container
     * @constructor
     * @param {String} [mode=independent] Initial value for the mode property. One of MovieClip.INDEPENDENT,
     * MovieClip.SINGLE_FRAME, or MovieClip.SYNCHED. The default is MovieClip.INDEPENDENT.
     * @param {Number} [startPosition=0] Initial value for the startPosition property.
     * @param {Boolean} [loop=true] Initial value for the loop property. The default is true.
     * @param {Object} [labels=null] A hash of labels to pass to the timeline instance associated with this MovieClip.
     * Labels only need to be passed if they need to be used.
     **/
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        // constructor:
        /**
         * Initialization method called by the constructor.
         * @method initialize
         * @param {String} [mode=independent] Initial value for the mode property. One of MovieClip.INDEPENDENT,
         * MovieClip.SINGLE_FRAME, or MovieClip.SYNCHED. The default is MovieClip.INDEPENDENT.
         * @param {Number} [startPosition=0] Initial value for the startPosition property.
         * @param {Boolean} [loop=true] Initial value for the loop property. The default is true.
         * @param {Object} [labels=null] A hash of labels to pass to the timeline instance associated with this MovieClip.
         * Labels only need to be passed if they need to be used.
         * @protected
         **/
        function MovieClip(mode, startPosition, loop, labels) {
            _super.call(this);
            /**
             * Specifies what the first frame to play in this movieclip, or the only frame to display if mode is SINGLE_FRAME.
             * @property startPosition
             * @type Number
             * @default 0
             */
            this.startPosition = 0;
            /**
             * Indicates whether this MovieClip should loop when it reaches the end of its timeline.
             * @property loop
             * @type Boolean
             * @default true
             */
            this.loop = true;
            /**
             * The current frame of the movieclip.
             * @property currentFrame
             * @type Number
             * @default 0
             * @readonly
             */
            this.currentFrame = 0;
            /**
             * The TweenJS Timeline that is associated with this MovieClip. This is created automatically when the MovieClip
             * instance is initialized. Animations are created by adding <a href="http://tweenjs.com">TweenJS</a> Tween
             * instances to the timeline.
             *
             * <h4>Example</h4>
             *
             *      var tween = createjs.Tween.get(target).to({x:0}).to({x:100}, 30);
             *      var mc = new createjs.MovieClip();
             *      mc.timeline.addTween(tween);
             *
             * Elements can be added and removed from the timeline by toggling an "_off" property
             * using the <code>tweenInstance.to()</code> method. Note that using <code>Tween.set</code> is not recommended to
             * create MovieClip animations. The following example will toggle the target off on frame 0, and then back on for
             * frame 1. You can use the "visible" property to achieve the same effect.
             *
             *      var tween = createjs.Tween.get(target).to({_off:false})
             *          .wait(1).to({_off:true})
             *          .wait(1).to({_off:false});
             *
             * @property timeline
             * @type Timeline
             * @default null
             */
            this.timeline = null;
            /**
             * If true, the MovieClip's position will not advance when ticked.
             * @property paused
             * @type Boolean
             * @default false
             */
            this.paused = false;
            /**
             * If true, actions in this MovieClip's tweens will be run when the playhead advances.
             * @property actionsEnabled
             * @type Boolean
             * @default true
             */
            this.actionsEnabled = true;
            /**
             * If true, the MovieClip will automatically be reset to its first frame whenever the timeline adds
             * it back onto the display list. This only applies to MovieClip instances with mode=INDEPENDENT.
             * <br><br>
             * For example, if you had a character animation with a "body" child MovieClip instance
             * with different costumes on each frame, you could set body.autoReset = false, so that
             * you can manually change the frame it is on, without worrying that it will be reset
             * automatically.
             * @property autoReset
             * @type Boolean
             * @default true
             */
            this.autoReset = true;
            /**
             * An array of bounds for each frame in the MovieClip. This is mainly intended for tool output.
             * @property frameBounds
             * @type Array
             * @default null
             */
            this.frameBounds = null;
            /**
             * By default MovieClip instances advance one frame per tick. Specifying a framerate for the MovieClip
             * will cause it to advance based on elapsed time between ticks as appropriate to maintain the target
             * framerate.
             *
             * For example, if a MovieClip with a framerate of 10 is placed on a Stage being updated at 40fps, then the MovieClip will
             * advance roughly one frame every 4 ticks. This will not be exact, because the time between each tick will
             * vary slightly between frames.
             *
             * This feature is dependent on the tick event object (or an object with an appropriate "delta" property) being
             * passed into {{#crossLink "Stage/update"}}{{/crossLink}}.
             * @property framerate
             * @type {Number}
             * @default 0
             **/
            this.framerate = null;
            this._framerate = null;
            // private properties:
            /**
             * @property _synchOffset
             * @type Number
             * @default 0
             * @private
             */
            this._synchOffset = 0;
            /**
             * @property _prevPos
             * @type Number
             * @default -1
             * @private
             */
            this._prevPos = -1; // TODO: evaluate using a ._reset Boolean prop instead of -1.
            /**
             * @property _prevPosition
             * @type Number
             * @default 0
             * @private
             */
            this._prevPosition = 0;
            /**
             * The time remaining from the previous tick, only applicable when .framerate is set.
             * @property _t
             * @type Number
             * @private
             */
            this._t = 0;
            this.parent = null;
            this.mode = mode || MovieClip.INDEPENDENT;
            this.startPosition = startPosition || 0;
            this.loop = loop;
            var props = { paused: true, position: startPosition, useTicks: true };
            this.timeline = new Timeline(null, labels, props);
            this._managed = {};
        }
        /**
         * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
         * Returns true if the draw was handled (useful for overriding functionality).
         * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
         * @method draw
         * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
         * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
         * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
         * into itself).
         **/
        MovieClip.prototype.draw = function (ctx, ignoreCache) {
            // draw to cache first:
            if (this.DisplayObject_draw(ctx, ignoreCache)) {
                return true;
            }
            this._updateTimeline();
            _super.prototype.draw.call(this, ctx, ignoreCache);
            return true;
        };
        /**
         * Sets paused to false.
         * @method play
         **/
        MovieClip.prototype.play = function () {
            this.paused = false;
        };
        /**
         * Sets paused to true.
         * @method stop
         **/
        MovieClip.prototype.stop = function () {
            this.paused = true;
        };
        /**
         * Advances this movie clip to the specified position or label and sets paused to false.
         * @method gotoAndPlay
         * @param {String|Number} positionOrLabel The animation name or frame number to go to.
         **/
        MovieClip.prototype.gotoAndPlay = function (positionOrLabel) {
            this.paused = false;
            this._goto(positionOrLabel);
        };
        /**
         * Advances this movie clip to the specified position or label and sets paused to true.
         * @method gotoAndStop
         * @param {String|Number} positionOrLabel The animation or frame name to go to.
         **/
        MovieClip.prototype.gotoAndStop = function (positionOrLabel) {
            this.paused = true;
            this._goto(positionOrLabel);
        };
        /**
         * Advances the playhead. This occurs automatically each tick by default.
         * @param [time] {Number} The amount of time in ms to advance by. Only applicable if framerate is set.
         * @method advance
         */
        MovieClip.prototype.advance = function (time) {
            // TODO: should we worry at all about clips who change their own modes via frame scripts?
            var independent = MovieClip.INDEPENDENT;
            if (this.mode != independent) {
                return;
            }
            var o = this, fps = o.framerate;
            while ((o = o.parent) && fps == null) {
                if (o.mode == independent) {
                    fps = o._framerate;
                }
            }
            this._framerate = fps;
            var t = (fps != null && fps != -1 && time != null) ? time / (1000 / fps) + this._t : 1;
            var frames = t | 0;
            this._t = t - frames;
            while (frames--) {
                if (!this.paused) {
                    this._prevPosition = (this._prevPos < 0) ? 0 : this._prevPosition + 1;
                    this._updateTimeline();
                }
            }
        };
        /**
         * Returns a sorted list of the labels defined on this MovieClip. Shortcut to TweenJS: Timeline.getLabels();
         * @method getLabels
         * @return {Array[Object]} A sorted array of objects with label and position (aka frame) properties.
         **/
        MovieClip.prototype.getLabels = function () {
            return this.timeline.getLabels();
        };
        /**
         * Returns the name of the label on or immediately before the current frame. See TweenJS: Timeline.getCurrentLabel()
         * for more information.
         * @method getCurrentLabel
         * @return {String} The name of the current label or null if there is no label.
         **/
        MovieClip.prototype.getCurrentLabel = function () {
            this._updateTimeline();
            return this.timeline.getCurrentLabel();
        };
        /**
         * MovieClip instances cannot be cloned.
         * @method clone
         **/
        MovieClip.prototype.clone = function (recursive) {
            throw ("MovieClip cannot be cloned.");
        };
        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {String} a string representation of the instance.
         **/
        MovieClip.prototype.toString = function () {
            return "[MovieClip (name=" + this.name + ")]";
        };
        // private methods:
        /**
         * @property Container__tick
         * @type Function
         * @protected
         **/
        //	p.Container__tick = p._tick;
        /**
         * @method _tick
         * @param {Object} props Properties to copy to the DisplayObject {{#crossLink "DisplayObject/tick"}}{{/crossLink}} event object.
         * function.
         * @protected
         **/
        MovieClip.prototype.onTick = function (e) {
            this.advance(e && e.delta);
            _super.prototype.onTick.call(this, e);
        };
        /**
         * @method _goto
         * @param {String|Number} positionOrLabel The animation name or frame number to go to.
         * @protected
         **/
        MovieClip.prototype._goto = function (positionOrLabel) {
            var pos = this.timeline.resolve(positionOrLabel);
            if (pos == null) {
                return;
            }
            // prevent _updateTimeline from overwriting the new position because of a reset:
            if (this._prevPos == -1) {
                this._prevPos = NaN;
            }
            this._prevPosition = pos;
            this._t = 0;
            this._updateTimeline();
        };
        /**
         * @method _reset
         * @private
         **/
        MovieClip.prototype._reset = function () {
            this._prevPos = -1;
            this._t = 0;
            this.currentFrame = 0;
        };
        /**
         * @method _updateTimeline
         * @protected
         **/
        MovieClip.prototype._updateTimeline = function () {
            var tl = this.timeline;
            var synched = this.mode != MovieClip.INDEPENDENT;
            tl.loop = (this.loop == null) ? true : this.loop;
            // update timeline position, ignoring actions if this is a graphic.
            if (synched) {
                tl.setPosition(this.startPosition + (this.mode == MovieClip.SINGLE_FRAME ? 0 : this._synchOffset), Tween.NONE);
            }
            else {
                tl.setPosition(this._prevPos < 0 ? 0 : this._prevPosition, this.actionsEnabled ? null : Tween.NONE);
            }
            this._prevPosition = tl._prevPosition;
            if (this._prevPos == tl._prevPos) {
                return;
            }
            this.currentFrame = this._prevPos = tl._prevPos;
            for (var n in this._managed) {
                this._managed[n] = 1;
            }
            var tweens = tl._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween = tweens[i];
                var target = tween._target;
                if (target == this || tween.passive) {
                    continue;
                } // TODO: this assumes actions tween has this as the target. Valid?
                var offset = tween._stepPosition;
                if (target instanceof DisplayObject) {
                    // motion tween.
                    this._addManagedChild(target, offset);
                }
                else {
                    // state tween.
                    this._setState(target.state, offset);
                }
            }
            var kids = this.children;
            for (i = kids.length - 1; i >= 0; i--) {
                var id = kids[i].id;
                if (this._managed[id] == 1) {
                    this.removeChildAt(i);
                    delete (this._managed[id]);
                }
            }
        };
        /**
         * @method _setState
         * @param {Array} state
         * @param {Number} offset
         * @protected
         **/
        MovieClip.prototype._setState = function (state, offset) {
            if (!state) {
                return;
            }
            for (var i = state.length - 1; i >= 0; i--) {
                var o = state[i];
                var target = o.t;
                var props = o.p;
                for (var n in props) {
                    target[n] = props[n];
                }
                this._addManagedChild(target, offset);
            }
        };
        /**
         * Adds a child to the timeline, and sets it up as a managed child.
         * @method _addManagedChild
         * @param {MovieClip} child The child MovieClip to manage
         * @param {Number} offset
         * @private
         **/
        MovieClip.prototype._addManagedChild = function (child, offset) {
            if (child._off) {
                return;
            }
            this.addChildAt(child, 0);
            if (child instanceof MovieClip) {
                child._synchOffset = offset;
                // TODO: this does not precisely match Flash. Flash loses track of the clip if it is renamed or removed from the timeline, which causes it to reset.
                if (child.mode == MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) {
                    child._reset();
                }
            }
            this._managed[child.id] = 2;
        };
        /**
         * @method Container__getBounds
         * @param {Matrix2D} matrix
         * @param {Boolean} ignoreTransform
         * @return {Rectangle}
         * @protected
         **/
        //	Container__getBounds = p._getBounds;
        /**
         * @method _getBounds
         * @param {Matrix2D} matrix
         * @param {Boolean} ignoreTransform
         * @return {Rectangle}
         * @protected
         **/
        MovieClip.prototype._getBounds = function (matrix, ignoreTransform) {
            var bounds = this.DisplayObject_getBounds();
            if (!bounds) {
                this._updateTimeline();
                if (this.frameBounds) {
                    bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]);
                }
            }
            if (bounds) {
                return this._transformBounds(bounds, matrix, ignoreTransform);
            }
            return _super.prototype._getBounds.call(this, matrix, ignoreTransform);
        };
        /**
         * The MovieClip will advance independently of its parent, even if its parent is paused.
         * This is the default mode.
         * @property INDEPENDENT
         * @static
         * @type String
         * @default "independent"
         * @readonly
         **/
        MovieClip.INDEPENDENT = "independent";
        /**
         * The MovieClip will only display a single frame (as determined by the startPosition property).
         * @property SINGLE_FRAME
         * @static
         * @type String
         * @default "single"
         * @readonly
         **/
        MovieClip.SINGLE_FRAME = "single";
        /**
         * The MovieClip will be advanced only when its parent advances and will be synched to the position of
         * the parent MovieClip.
         * @property SYNCHED
         * @static
         * @type String
         * @default "synched"
         * @readonly
         **/
        MovieClip.SYNCHED = "synched";
        return MovieClip;
    })(Container);
    /**
     * This plugin works with <a href="http://tweenjs.com" target="_blank">TweenJS</a> to prevent the startPosition
     * property from tweening.
     * @private
     * @class MovieClipPlugin
     * @constructor
     **/
    var MovieClipPlugin = (function () {
        function MovieClipPlugin() {
            throw ("MovieClipPlugin cannot be instantiated.");
        }
        /**
         * @method install
         * @private
         **/
        MovieClipPlugin.install = function () {
            Tween.installPlugin(MovieClipPlugin, ["startPosition"]);
        };
        /**
         * @method init
         * @param {Tween} tween
         * @param {String} prop
         * @param {String|Number|Boolean} value
         * @private
         **/
        MovieClipPlugin.init = function (tween, prop, value) {
            return value;
        };
        /**
         * @method step
         * @private
         **/
        MovieClipPlugin.step = function () {
            // unused.
        };
        /**
         * @method tween
         * @param {Tween} tween
         * @param {String} prop
         * @param {String | Number | Boolean} value
         * @param {Array} startValues
         * @param {Array} endValues
         * @param {Number} ratio
         * @param {Object} wait
         * @param {Object} end
         * @return {*}
         */
        MovieClipPlugin.tween = function (tween, prop, value, startValues, endValues, ratio, wait, end) {
            if (!(tween.target instanceof MovieClip)) {
                return value;
            }
            return (ratio == 1 ? endValues[prop] : startValues[prop]);
        };
        /**
         * @method priority
         * @private
         **/
        MovieClipPlugin.priority = 100; // very high priority, should run first
        return MovieClipPlugin;
    })();
    exports.MovieClipPlugin = MovieClipPlugin;
    MovieClipPlugin.install();
});
