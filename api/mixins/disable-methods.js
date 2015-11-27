module.exports = function(model, options) {
  if (options.selfMethods) {
    options.selfMethods.forEach(function(method) {
      model.disableRemoteMethod(method, false);
      model.disableRemoteMethod(method, true);
    });
  }

  if (options.relationsMethods) {
    options.relationsMethods.forEach(function(relation) {
      relation.methods.forEach(function(method) {
        model.disableRemoteMethod('__' + method + '__' + relation.name , false);
        model.disableRemoteMethod('__' + method + '__' + relation.name , true);
      });
    });
  }
}