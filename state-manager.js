(function () {
    'use strict';

    var notifications = {
        isNullOrUndefined: 'The argument is null or undefined',
        stateIsNotAnObject: 'The state argument is not an object'
    };

    window.StateManager = {
        State: function (obj) {
            var context = {
                state: this,
                privateState: {},
                watchers: obj.watch
            };
            this.props = {};
            this.onStateChange = function () { };

            (function () {
                if (!obj || !obj.data)
                    throw notifications.isNullOrUndefined;
                
                if (obj instanceof Object === false || obj.data instanceof Object === false)
                    throw notifications.stateIsNotAnObject;

                for (var prop in obj.data) {
                    context.privateState[prop] = obj.data[prop];
                    (function (ctx, prop) {
                        Object.defineProperty(ctx.state, prop, {
                            get: function () {
                                return ctx.privateState[prop];
                            },
                            set: function (val) {
                                if (val === window.undefined)
                                    throw ctx.notifications.isNullOrUndefined;

                                if (ctx.watchers && ctx.watchers.hasOwnProperty(prop) && ctx.watchers[prop] instanceof Function === true) {
                                    ctx.watchers[prop](val, ctx.state, ctx.privateState[prop]);
                                }

                                ctx.privateState[prop] = val;
                                ctx.state.onStateChange({ state: ctx.state, prop: prop });
                            }
                        });
                    })(context, prop);
                }
            })();

            (function (ctx) {
                debugger;
                if (!obj.props)
                    return;

                for (var prop in obj.props) {
                    ctx.state.props[prop] = obj.props[prop];
                    ctx.state.props[prop].bind(ctx.state);
                }
            })(context);
        }
    };
})();