var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SignalAbstract'], function (require, exports, SignalAbstract) {
    /**
     * @namespace createts.events
     * @module createts
     * @class Signal
     */
    var Signal = (function (_super) {
        __extends(Signal, _super);
        function Signal() {
            _super.apply(this, arguments);
        }
        /**
         * Emit the signal, notifying each connected listener.
         *
         * @method emit
         */
        Signal.prototype.emit = function () {
            var _this = this;
            if (this.dispatching()) {
                this.defer(function () { return _this.emitImpl(); });
            }
            else {
                this.emitImpl();
            }
        };
        Signal.prototype.emitImpl = function () {
            var head = this.willEmit();
            var p = head;
            while (p != null) {
                p._listener();
                if (!p.stayInList) {
                    p.dispose();
                }
                p = p._next;
            }
            this.didEmit(head);
        };
        return Signal;
    })(SignalAbstract);
    return Signal;
});
