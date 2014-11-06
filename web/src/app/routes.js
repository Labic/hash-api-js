var request = require('request');
var Parallel = require('node-parallel');
var slug = require('slug');
var util = require('util');

var DOCUMENTS_LIMIT = 20;

var tweetApiUrl = 'http://104.131.228.31:3000/api/Tweets?filter=';
var facebookApiUrl = 'http://104.131.228.31:3000/api/FacebookPosts?filter=';
var tweetTopsApiUrl = 'http://104.131.228.31:3000/api/Tops?filter=';
var tweetTopDiaryApiUrl = 'http://104.131.228.31:3000/api/TopDiaries?filter=';
var tweetBannedUsersApiUrl = 'http://104.131.228.31:3000/api/Streams/5451b0778cb2279b0cedd3b9/filters?filter=';

var filterUsersBannedTwitter = {
  "where": {
    "operator": "!="
  }
};

var tweetBannedUsersUrl = tweetBannedUsersApiUrl + JSON.stringify(filterUsersBannedTwitter);

// app/routes.js
module.exports = function(app, passport) {
  // Handle 404
  app.use(function (err, req, res, next) {
    if (err.status !== 404)
      return next();

    res.status(404).render('404.jade', {title: '404: File Not Found'});
  });

  // Handle 500
  app.use(function (err, req, res, next) {
    if (err.status !== 500)
      return next();

    console.error(err.stack);
    res.status(500).render('500.jade', {title:'500: Internal Server Error', error: error});
  });
  
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    //res.render('index', {title: 'App ENEM | Inep'});
    res.redirect('/twitter/secoes/hits');
  });
  
  // =====================================
  // Twitter =============================
  // =====================================
  app.get('/twitter/secoes/hits', function(req, res) {
    request.get({url: tweetBannedUsersUrl, json: true}, function(err, bannedUsersResp) {
      var bannedUsersFilter = [];

      bannedUsersResp.body.forEach(function (bannedUser) {
        bannedUsersFilter.push(bannedUser.element);
      });

      var filterTopTweets = {
        "where": {
          "categories": {"inq": ["topTweets"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC",
        "limit": DOCUMENTS_LIMIT
      };
      
      var filterTopURL = '{"fields": { "MENTIONS": false, "URL": true }}';
      
      var filterTopMentions = '{"fields": { "MENTIONS": true, "URL": false }}';
      
      var filterTopDiaryMentions ='{"fields": { "MENTIONS": true, "URL": false }}';
      
      var filterTopDiaryURL = '{"fields": { "MENTIONS": false, "URL": true }}';

      var urls = [
        { id: "top-tweets", title: "Top Tweets", uri: tweetApiUrl + JSON.stringify(filterTopTweets) },
        { id: "top-mencoes", title: "Usuários Mais Mencionados", uri: tweetTopDiaryApiUrl + filterTopDiaryMentions },
        { id: "top-urls", title: "Top URLS", uri: tweetTopDiaryApiUrl + filterTopDiaryURL }
      ];

      var parallel = new Parallel();
      
      urls.forEach(function (url) {
        parallel.timeout(10000).add(function (done) {
          request.get({url: url.uri, json: true}, function(err, res) {
            res.body.url = url.uri;
            res.body.categorieId = url.id;
            res.body.categorieTitle = url.title;
            
            done(err, res.body);
          })
        })
      });
    
      parallel.done(function (err, hitsQueries) {
        res.render('twitter-secao-hits', { route: req.route, title: 'Twitter por Seções - App ENEM | Inep', hitsQueries: hitsQueries });
      });
    });
  });
  
  // =====================================
  // Twitter =============================
  // =====================================
  app.get('/twitter/secoes/publico-geral', function(req, res) {
    request.get({url: tweetBannedUsersUrl, json: true}, function(err, bannedUsersResp) {
      var bannedUsersFilter = [];

      bannedUsersResp.body.forEach(function (bannedUser) {
        bannedUsersFilter.push(bannedUser.element);
      });

      var filterDicasOrientacoes = {
        "where": {
          "categories": {"inq": ["ORIENTACOES"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        },
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };
      
      var filterInfraestruturaLogistica = {
        "where": {
          "categories": {"inq": ["INFRAESTRUTURA_E_LOGISTICA"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };
      
      var filterConteudoProva = {
        "where": {
          "categories": {"inq": ["PROVA"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };
      
      var filterRumores = {
        "where": {
          "categories": {"inq": ["RUMORES"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterSentimentos = {
        "where": {
          "categories": {"inq": ["SENTIMENTOS"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterHumor = {
        "where": {
          "categories": {"inq": ["HUMOR"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var urls = [
        { id: "dicas-orientacoes", title: "Dicas & Orientações", uri: tweetApiUrl + JSON.stringify(filterDicasOrientacoes) },
        { id: "infraestrutura-logistica", title: "Infraestrutura & Logistica", uri: tweetApiUrl + JSON.stringify(filterInfraestruturaLogistica) },
        { id: "conteudo-prova", title: "Conteúdo da Prova", uri: tweetApiUrl + JSON.stringify(filterConteudoProva) },
        { id: "rumores", title: "Rumores", uri: tweetApiUrl + JSON.stringify(filterRumores) },
        { id: "sentimentos", title: "Sentimentos", uri: tweetApiUrl + JSON.stringify(filterSentimentos) },
        { id: "humor", title: "Humor", uri: tweetApiUrl + JSON.stringify(filterHumor) }
      ];

      var parallel = new Parallel();

      urls.forEach(function (url) {
        parallel.timeout(10000).add(function (done) {
          request.get({url: url.uri, json: true}, function(err, res) {
            res.body.url = url.uri;
            res.body.categorieId = url.id;
            res.body.categorieTitle = url.title;
            done(err, res.body);
          })
        })
      });

      parallel.done(function (err, tweetsCategoriesQuery) {
        res.render('twitter-secao', { route: req.route, title: 'Twitter por Seções - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
      });
    });
  });
  
  // =====================================
  // Twitter =============================
  // =====================================
  app.get('/twitter/secoes/repercussao-midiatica', function(req, res) {
    request.get({url: tweetBannedUsersUrl, json: true}, function(err, bannedUsersResp) {
      var bannedUsersFilter = [];

      bannedUsersResp.body.forEach(function (bannedUser) {
        bannedUsersFilter.push(bannedUser.element);
      });

      var filterNoticiasPopulares = {
        "where": {
          "categories": {"inq": ["NOTICIAS"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterConteudoProva = {
        "where": {
          "categor-ies": {"inq": ["PROVA"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterLogisticaInfraestrutura = {
        "where": {
          "categories": {"inq": ["LOGISTICA_E_INFRA"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterCanaisEspecializados = {
        "where": {
          "categories": {"inq": ["CANAIS"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterPersonalidades = {
        "where": {
          "categories": {"inq": ["CELEBRIDADES"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        },
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var urls = [
        { id: "noticias-populares", title: "Notícias Mais Populares", uri: tweetApiUrl + JSON.stringify(filterNoticiasPopulares) },
        //{ id: "conteudo-prova", title: "Conteúdo da Prova", uri: tweetApiUrl + JSON.stringify(filterConteudoProva) },
        //{ id: "logistica-infraestrutura", title: "Logistica & Infraestrutura", uri: tweetApiUrl + JSON.stringify(filterLogisticaInfraestrutura) },
        { id: "canais-especializados", title: "Canais Especializados", uri: tweetApiUrl + JSON.stringify(filterCanaisEspecializados) },
        { id: "personalidades", title: "Personalidades", uri: tweetApiUrl + JSON.stringify(filterPersonalidades) }
      ];

      var parallel = new Parallel();

      urls.forEach(function (url) {
        parallel.timeout(10000).add(function (done) {
          request.get({url: url.uri, json: true}, function(err, res) {
            res.body.url = url.uri;
            res.body.categorieId = url.id;
            res.body.categorieTitle = url.title;
            done(err, res.body);
          })
        })
      });

      parallel.done(function (err, tweetsCategoriesQuery) {
        res.render('twitter-secao', { route: req.route, title: 'Twitter por Seções - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
      });
    });
  });


  app.get('/twitter/estados/sudeste', function(req, res) {
    request.get({url: tweetBannedUsersUrl, json: true}, function(err, bannedUsersResp) {
      var bannedUsersFilter = [];

      bannedUsersResp.body.forEach(function (bannedUser) {
        bannedUsersFilter.push(bannedUser.element);
      });

      var filterSP = {
        "where": {
          "categories": {"inq": ["Sao Paulo"]}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterRJ = {
        "where": {
          "categories": {"inq": ["Rio de Janeiro"]}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterES = {
        "where": {
          "categories": {"inq": ["Espirito Santo"]}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterMG = {
        "where": {
          "categories": {"inq": ["Minas Gerais"]}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var urls = [
        { id: "sp", title: "São Paulo", uri: tweetApiUrl + JSON.stringify(filterSP) },
        { id: "rj", title: "Rio de Janeiro", uri: tweetApiUrl + JSON.stringify(filterRJ) },
        { id: "es", title: "Espírito Santo", uri: tweetApiUrl + JSON.stringify(filterES) },
        { id: "mg", title: "Minas Gerais", uri: tweetApiUrl + JSON.stringify(filterMG) }
      ];

      var parallel = new Parallel();

      urls.forEach(function (url) {
        parallel.timeout(2000).add(function (done) {
          request.get({url: url.uri, json: true}, function(err, res) {
            res.body.url = url.uri;
            res.body.categorieId = url.id;
            res.body.categorieTitle = url.title;
            done(err, res.body);
          })
        })
      });

      parallel.done(function (err, tweetsCategoriesQuery) {
        res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
      });
    });
  });
  

  app.get('/twitter/estados/sul', function(req, res) {
    request.get({url: tweetBannedUsersUrl, json: true}, function(err, bannedUsersResp) {
      var bannedUsersFilter = [];

      bannedUsersResp.body.forEach(function (bannedUser) {
        bannedUsersFilter.push(bannedUser.element);
      });

      // Sul
      var filterPR = {
        "where": {
          "categories": {"inq": ["Parana"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterSC = {
        "where": {
          "categories": {"inq": ["Santa Catarina"]},
            "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterRS = {
        "where": {
          "categories": {"inq": ["Rio Grande do Sul"]},
            "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var urls = [
        { id: "pr", title: "Paraná", uri: tweetApiUrl + JSON.stringify(filterPR) },
        { id: "sc", title: "Santa Catarina", uri: tweetApiUrl + JSON.stringify(filterSC) },
        { id: "rs", title: "Rio Grande do Sul", uri: tweetApiUrl + JSON.stringify(filterRS) }
      ];

      var parallel = new Parallel();

      urls.forEach(function (url) {
        parallel.timeout(10000).add(function (done) {
          request.get({url: url.uri, json: true}, function(err, res) {
            res.body.url = url.uri;
            res.body.categorieId = url.id;
            res.body.categorieTitle = url.title;
            done(err, res.body);
          })
        })
      });

      parallel.done(function (err, tweetsCategoriesQuery) {
        res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
      });
    });
  });

  app.get('/twitter/estados/centro-oeste', function(req, res) {
    request.get({url: tweetBannedUsersUrl, json: true}, function(err, bannedUsersResp) {
      var bannedUsersFilter = [];

      bannedUsersResp.body.forEach(function (bannedUser) {
        bannedUsersFilter.push(bannedUser.element);
      });
      //Centro-Oeste  
      var filterBrasilia = {
        "where": {
          "categories": {"inq": ["Brasilia"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterMT = {
        "where": {
          "categories": {"inq": ["Mato Grosso"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterRS = {
        "where": {
          "categories": {"inq": ["Mato Grosso do Sul"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterGO = {
        "where": {
          "categories": {"inq": ["Goias"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var urls = [
        { id: "brasilia", title: "Brasília", uri: tweetApiUrl + JSON.stringify(filterBrasilia) },
        { id: "mt", title: "Mato Grosso", uri: tweetApiUrl + JSON.stringify(filterMT) },
        { id: "rs", title: "Mato Grosso do Sul", uri: tweetApiUrl + JSON.stringify(filterRS) },
        { id: "go", title: "Goiás", uri: tweetApiUrl + JSON.stringify(filterGO) }
      ];

      var parallel = new Parallel();

      urls.forEach(function (url) {
        parallel.timeout(10000).add(function (done) {
          request.get({url: url.uri, json: true}, function(err, res) {
            res.body.url = url.uri;
            res.body.categorieId = url.id;
            res.body.categorieTitle = url.title;
            done(err, res.body);
          })
        })
      });

      parallel.done(function (err, tweetsCategoriesQuery) {
        res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
      });
    });
  });
  

  app.get('/twitter/estados/nordeste', function(req, res) {
    request.get({url: tweetBannedUsersUrl, json: true}, function(err, bannedUsersResp) {
      var bannedUsersFilter = [];

      bannedUsersResp.body.forEach(function (bannedUser) {
        bannedUsersFilter.push(bannedUser.element);
      });

      //Nordeste
      var filterMA = {
        "where": {
          "categories": {"inq": ["Maranhao"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterPI = {
        "where": {
          "categories": {"inq": ["Piaui"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterCE = {
        "where": {
          "categories": {"inq": ["Ceara"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterRN = {
        "where": {
          "categories": {"inq": ["Rio Grande do Norte"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterPB = {
        "where": {
          "categories": {"inq": ["Paraiba"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterPE = {
        "where": {
          "categories": {"inq": ["Pernambuco"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterAL = {
        "where": {
          "categories": {"inq": ["Alagoas"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterSE = {
        "where": {
          "categories": {"inq": ["Sergipe"]}}, 
          "order": "rts DESC", 
          "limit": DOCUMENTS_LIMIT
      };

      var filterBA = {
        "where": {
          "categories": {"inq": ["Bahia"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var urls = [
        { id: "ma", title: "Maranhão", uri: tweetApiUrl + JSON.stringify(filterMA) },
        { id: "pi", title: "Piauí", uri: tweetApiUrl + JSON.stringify(filterPI) },
        { id: "ce", title: "Ceará", uri: tweetApiUrl + JSON.stringify(filterCE) },
        { id: "rn", title: "Rio Grande do Norte", uri: tweetApiUrl + JSON.stringify(filterRN) },
        { id: "pb", title: "Paraíba", uri: tweetApiUrl + JSON.stringify(filterPB) },
        { id: "pe", title: "Pernambuco", uri: tweetApiUrl + JSON.stringify(filterPE) },
        { id: "al", title: "Alagoas", uri: tweetApiUrl + JSON.stringify(filterAL) },
        { id: "se", title: "Sergipe", uri: tweetApiUrl + JSON.stringify(filterSE) },
        { id: "ba", title: "Bahia", uri: tweetApiUrl + JSON.stringify(filterBA) }
      ];

      var parallel = new Parallel();

      urls.forEach(function (url) {
        parallel.timeout(10000).add(function (done) {
          request.get({url: url.uri, json: true}, function(err, res) {
            res.body.url = url.uri;
            res.body.categorieId = url.id;
            res.body.categorieTitle = url.title;
            done(err, res.body);
          })
        })
      });

      parallel.done(function (err, tweetsCategoriesQuery) {
        res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
      });
    });
  });


app.get('/twitter/estados/norte', function(req, res) {
    request.get({url: tweetBannedUsersUrl, json: true}, function(err, bannedUsersResp) {
      var bannedUsersFilter = [];

      bannedUsersResp.body.forEach(function (bannedUser) {
        bannedUsersFilter.push(bannedUser.element);
      });
      // Norte
      var filterAM = {
        "where": {
          "categories": {"inq": ["Amazonas"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterAC = {
        "where": {
          "categories": {"inq": ["Acre"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterRR = {
        "where": {
          "categories": {"inq": ["Roraima"]},
            "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterRO = {
        "where": {
          "categories": {"inq": ["Rondonia"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterAP = {
        "where": {
          "categories": {"inq": ["Amapa"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterPA = {
        "where": {
          "categories": {"inq": ["Para"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var filterTO = {
        "where": {
          "categories": {"inq": ["Tocantins"]},
          "status.user.screen_name": {"nin": bannedUsersFilter}
        }, 
        "order": "rts DESC", 
        "limit": DOCUMENTS_LIMIT
      };

      var urls = [
        { id: "am", title: "Amazonas", uri: tweetApiUrl + JSON.stringify(filterAM) },
        { id: "ac", title: "Acre", uri: tweetApiUrl + JSON.stringify(filterAC) },
        { id: "rr", title: "Roraima", uri: tweetApiUrl + JSON.stringify(filterRR) },
        { id: "ro", title: "Rondônia", uri: tweetApiUrl + JSON.stringify(filterRO) },
        { id: "ap", title: "Amapá", uri: tweetApiUrl + JSON.stringify(filterAP) },
        { id: "pa", title: "Pará", uri: tweetApiUrl + JSON.stringify(filterPA) },
        { id: "to", title: "Tocantins", uri: tweetApiUrl + JSON.stringify(filterTO) }
      ];

      var parallel = new Parallel();

      urls.forEach(function (url) {
        parallel.timeout(10000).add(function (done) {
          request.get({url: url.uri, json: true}, function(err, res) {
            res.body.url = url.uri;
            res.body.categorieId = url.id;
            res.body.categorieTitle = url.title;
            done(err, res.body);
          })
        })
      });

      parallel.done(function (err, tweetsCategoriesQuery) {
        res.render('twitter-secao', { route: req.route, title: 'Twitter por Estados - App ENEM | Inep', tweetsCategories: tweetsCategoriesQuery });
      });
    });
  });

  app.get('/facebook/secoes', function(req, res) {
    var filterTopPosts = {
      "where": {
        "Section": {"inq": ["TopFace"]}
      }, 
      "order": ["LikesCount DESC", "CommentsCount DESC"], 
      "limit": DOCUMENTS_LIMIT
    };

    var filterHumor = {
      "where": {
        "Section": {"inq": ["PERFIS DE HUMOR - Perfis"]}
      }, 
      "order": ["LikesCount DESC", "CommentsCount DESC"], 
      "limit": DOCUMENTS_LIMIT
    };
    
    var filterEducacional = {
      "where": {
        "Section": {"inq": ["PERFIS EDUCACIONAIS - Perfis"]}
      }, 
      "order": ["LikesCount DESC", "CommentsCount DESC"], 
      "limit": DOCUMENTS_LIMIT
    };
    
    var filterInstitucional = {
      "where": {
        "Section": {"inq": ["PERFIS INSTITUCIONAIS - Perfis"]}
      }, 
      "order": ["LikesCount DESC", "CommentsCount DESC"], 
      "limit": DOCUMENTS_LIMIT
    };
    
    var filterMidia = {
      "where": {
        "Section": {"inq": ["PERFIS DE MÍDIA - Perfis"]}
      }, 
      "order": ["LikesCount DESC", "CommentsCount DESC"], 
      "limit": DOCUMENTS_LIMIT
    };

    var urls = [
      { id: "top", title: "Top Posts", uri: facebookApiUrl + JSON.stringify(filterTopPosts) },
      { id: "humor", title: "Humor", uri: facebookApiUrl + JSON.stringify(filterHumor) },
      { id: "educacional", title: "Educacional", uri: facebookApiUrl + JSON.stringify(filterEducacional) },
      { id: "institucional", title: "Institucional", uri: facebookApiUrl + JSON.stringify(filterInstitucional) },
      { id: "midia", title: "Mídia", uri: facebookApiUrl + JSON.stringify(filterMidia) }
    ];

    var parallel = new Parallel();

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          res.body.url = url.uri;
          res.body.sectionId = url.id;
          res.body.sectionTitle = url.title;
          done(err, res.body);
        })
      })
    });

    parallel.done(function (err, facebookSectionsQuery) {
      res.render('facebook', { route: req.route, title: 'Facebook por Seções - App ENEM | Inep', facebookSections: facebookSectionsQuery });
    });
  });
  
  // =====================================
  // Twitter Gráficos ====================
  // =====================================
  // show the login form
  app.get('/twitter/analytics', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('twitter-analytics', { route: req.route, title: 'Gráficos do Twitter - App ENEM | Inep' }); 
  });
  
  // =====================================
  // Facebook Gráficos ===================
  // =====================================
  // show the login form
  app.get('/facebook/analytics', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('facebook-estatisticas', { route: req.route, title: 'Gráficos do Facebook - App ENEM | Inep' }); 
  });
  
  // =====================================
  // Configurações =======================
  // =====================================
  // show the login form
  app.get('/configuracoes', function (req, res) {
    var filterUsersBannedTwitter = {
      "where": {
        "operator": "!="
      }
    };

    var urls = [
      { uri: 'http://104.131.228.31:3000/api/Streams/5451b0778cb2279b0cedd3b9/filters?filter=' + JSON.stringify(filterUsersBannedTwitter)}
    ];

    var parallel = new Parallel();

    var configuration = {};
    //configuration.usersBannedTwitter = []

    urls.forEach(function (url) {
      parallel.timeout(10000).add(function (done) {
        request.get({url: url.uri, json: true}, function(err, res) {
          configuration.usersBannedTwitter = res.body;
          //console.log(configuration.usersBannedTwitter);
          done(err, configuration);
        })
      })
    });

    parallel.done(function (err, configuration) {
      res.render('configuracoes', { route: req.route, title: 'Configurações - App ENEM | Inep', configuration: configuration  }); 
    });
  });
  
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', { route: req.route, message: req.flash('loginMessage') }); 
  });

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function (req, res) {
    
    // render the page and pass in any flash data if it exists
    res.render('signup', { route: req.route, message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));
  
  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));
  
  // =====================================
  // TWITTER ROUTES ======================
  // =====================================
  // route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      route: req.route, 
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}