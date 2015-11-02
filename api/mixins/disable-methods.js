module.exports = function(model, options) {
  if (options.selfMethods) {
    options.selfMethods.forEach(function(method) {
      model.disableRemoteMethod(method, true);
      model.disableRemoteMethod(method, false);
    });
  }
}