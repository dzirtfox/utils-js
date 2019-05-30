function State() {
  var state = {};

  var module = {};
  module.onStateChange = function() {
    bus.emit('onStateChange', toolbar.scope, state);
  };

  module.set = function(prop, val) {
    if (state.hasOwnProperty(prop) === false) {
      throw 'State does not have a propery: ' + prop;
    }

    state[prop] = val;
    module.onStateChange();
  };
  module.get = function() {
    return state;
  };

  return module;
}
