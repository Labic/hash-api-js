var Parallel = require('node-parallel');
var slug = require('slug');

var tweetApiUrl = 'http://104.131.228.31:3000/api/Tweets?filter=';

module.export = getEstados;

var getEstados = function (res) {
  var querys = [
        {
          title: 'Rio Grande do Sul',
          filter: {
            categories: {inq: ["Rio Grande do Sul"]}
          }
        },
        {
          title: 'Rio Grande do Norte',
          filter: {
            categories: {inq: ["Rio Grande do Norte"]}
          }
        },
        {
          title: 'Paraná',
          filter: {
            categories: {inq: ["Parana"]}
          }
        },
        {
          title: 'Espírito Santo',
          filter: {
            categories: {inq: ["Espirito Santo"]}
          }
        },
        {
          title: 'São Paulo',
          filter: {
            categories: {inq: ["Sao Paulo"]}
          }
        },
        {
          title: 'Pará',
          filter: {
            categories: {inq: ["Para"]}
          }
        },
        {
          title: 'Brasília',
          filter: {
            categories: {inq: ["Brasilia"]}
          }
        },
        {
          title: 'Piauí',
          filter: {
            categories: {inq: ["Piaui"]}
          }
        }
      ];

    querys.forEach(function (query) {
      query.id = slug(query.title);
      query.uri = tweetApiUrl + JSON.stringify(query.filter);
      query.filter.order = ["rts DESC"];
      query.filter.limit = 10;
    });

    var parallel = new Parallel();

    querys.forEach(function (query) {
      parallel.timeout(5000).add(function (done) {
        request.get({url: query.uri, json: true}, function(err, res) {
          res.body.url = query.uri;
          res.body.categorieId = query.id;
          res.body.categorieTitle = query.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, tweetsCategoriesQuery) {
      res.render('twitter-secao', { route: req.route, title: 'Twitter por Seções - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
    });
}