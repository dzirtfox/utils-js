(function () {
    'use strict';
    var EventBus = function () {
        var eventCallbacksPairs = [];

        this.register = function (eventName, scope) {
            var pair = getBusEventCallbacksPair(eventName, scope);

            if (!pair) {
                eventCallbacksPairs.push(new EventCallbackPair(eventName, scope));
            } else {
                throw 'Event alerady registered: ' + eventName + ' scope ' + scope;
            }
            return this;
        };

        this.subscribe = function (eventName, scope, callback) {
            var pair = getBusEventCallbacksPair(eventName, scope);

            if (pair) {
                pair.callbacks.push(callback);
            } else {
                throw 'Event not registered: ' + eventName + ' scope: ' + scope;
            }
        };

        this.emit = function (eventName, scope, args) {
            var pair = getBusEventCallbacksPair(eventName, scope);
            if (pair && pair.callbacks.length > 0) {
                pair.callbacks.forEach(function (callback) {
                    callback(args);
                });
            } else {
                console.log('No subscribers for event: ' + eventName, ' scope: ' + scope);
            }

            return this;
        };

        this.clear = function () {
            eventCallbacksPairs = [];
        };

        function getBusEventCallbacksPair(name, scope) {
            var result = eventCallbacksPairs.filter(function (item) {
                return item.name === name && item.scope === scope;
            });

            return result.length ? result[0] : null;
        }

        function EventCallbackPair(name, scope) {
            this.name = name;
            this.scope = scope;
            this.callbacks = [];
        }
    };

    window.EventBusManager = (function () {
        var modules = [];
        var manager = {};
        manager.getModule = function (moduleName) {
            var module = findModule(moduleName);

            if (module) return module.eventBus;

            return null;
        };

        manager.registerModule = function (moduleName) {
            var module = findModule(moduleName);

            if (module) {
                console.error('Module is already registered!');
                return null;
            }

            var newModule = new EventBusModule(moduleName);
            modules.push(newModule);

            return newModule.eventBus;
        };

        function findModule(moduleName) {
            var result = modules.filter(function (module) {
                return module.name === moduleName;
            });

            return result.length ? result[0] : null;
        }

        function EventBusModule(moduleName) {
            this.name = moduleName;
            this.eventBus = new EventBus();
        }

        return manager;
    })();
})();
