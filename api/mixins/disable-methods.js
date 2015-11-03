module.exports = function(model, options) {
  if (options.selfMethods) {
    options.selfMethods.forEach(function(method) {
      model.disableRemoteMethod(method, true);
      model.disableRemoteMethod(method, false);
    });
  }

  if (options.relationsMethods) {
    options.relationsMethods.forEach(function(relation) {
      relation.methods.forEach(function(method) {
        model.disableRemoteMethod('__' + method + '__' + relation.name , true);
        model.disableRemoteMethod('__' + method + '__' + relation.name , false);
      });
    });
  }
}