'use strict';

// to enable these logs set `DEBUG=boot:01-load-settings` or `DEBUG=boot:*`
var log = require('debug')('boot:01-load-settings');

module.exports = function(app) {

  if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
    return;
  }

  var Setting = app.models.Setting;

  function loadDefaultSettings() {
    console.error('Creating default settings');

    var settings = [{
      type: 'string',
      key: 'app_name',
      value: 'Hash Web'
    }, {
      type: 'boolean',
      key: 'com.module.users.enable_registration',
      value: true
    }];

    settings.forEach(function(setting) {
      Setting.create(setting, function(err) {
        if (err) {
          console.error(err);
        }
      });
    });
  }

  function loadExistingSettings() {
    console.info('Loading existing settings');

    Setting.find(function(err, data) {
      log(data);
    });
  }


  Setting.count(function(err, result) {
    if (err) {
      console.error(err);
    }
    if (result < 1) {
      loadDefaultSettings();
    } else {
      loadExistingSettings();
    }
  });

};
