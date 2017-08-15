# Hash API

API de Analytics e metrics para Twitter, Facebook e Instagram.

## A Fazer

- [ ] Implementar Test de API com [Dreed](https://dredd.readthedocs.io/en/latest/how-to-guides.html)
- [ ] Implementar CI com [Travis](https://travis-ci.org/)
- [ ] Integrar com autenciação do [Hydra] https://github.com/ory/hydra
- [ ] Integrar com Kong
- [ ] Usar loopback-connector-kue?

# Analytics - Facebook 

## Perfis Mais Ativos

```javascript
angular
  .module('app', ['hash.api'])
  .controller('MyCtrl', function ($scope, AnalyticsFacebook) {
    AnalyticsFacebook.mostActiveProfiles({
        profile_type: 'page', // Requiried
        period: '1d',
        'filter[with_tags]': ['tag-1', 'tag-2'],
        'filter[contain_tags]': ['tag-1', 'tag-2'],
        'filter[hashtags]': ['hashtag1'],
        'filter[profiles]': [123129313013, 123129313013, 123129313013, 123129313013],
        'filter[mentions]': ['user1', 'user2'],
        'filter[type]': ['link', 'video', 'photo']
      }, 
      function success(res) {
        console.info(res);
      },
      function error(err) {
        console.error(err);
      });
  });
```

> O código acima retornara uma estrutura em `JSON` parecida com essa:

```json
[
]
```

Esse endpoint retorna todos os posts de Facecook com opção de selecionar um período e filtros.

### HTTP Request

`GET https://hash-api.herokuapp.com/v1/analytics/facebook/most_active_profiles`

### Paramentros da Query

Parameter            | Default | Description
---------------------| ------- | -----------
profile_type | | **Obrigatório**. Tipo de perfil a ser analisado, páginas `page` ou usuários `user`.
period               |   1d    | _Opcional_. Período que vai ser consultado a parti do inicio da requisição, as opções são: <ul> <li>`15m` : 15 minutos</li> <li>`30m` : 30 minutos</li> <li>`1h` : 1 hora</li> <li>`6h` : 6 horas</li> <li>`12h` : 12 horas</li> <li>`1d` : 1 dia</li> <li>`7d` : 7 dias</li> <li>`15d` - 15 dias</li> </ul>
filter[with_tags]    |         | _Opcional_. Uma array de strings que filtra os posts que possuem todas as tags informadas.
filter[contain_tags] |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das tags informadas.
filter[hashtags]     |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das hashtags informadas.
filter[profiles]        |         | _Opcional_. Uma array de inteiros `int32` dos ids dos perfis que filtra os posts que possuem qualquer um dos perfis informados.
filter[mentions]     |         | _Opcional_. Uma array que filtra os posts que possuem qualquer um dos usuários informados e que foram mencionados.
filter[type]          |         | _Opcional_. Uma array que filtra os tweets que possuem todas as condições informadas. As condições são: <ul> <li>`link` : URL/Link</li> <li>`photo` : Fotos ou Imagens</li> <li>`video` : Vídeos</li> <li>`event` : Eventos</li> <li>`status` : Status</li> <li>`music` : Música</li></ul> 

## Posts Mais Comentados

```javascript
angular
  .module('app', ['hash.api'])
  .controller('MyCtrl', function ($scope, AnalyticsFacebook) {
    AnalyticsFacebook.mostCommentedPosts({
        profile_type: 'page', // Requiried
        period: '1d',
        'filter[with_tags]': ['tag-1', 'tag-2'],
        'filter[contain_tags]': ['tag-1', 'tag-2'],
        'filter[hashtags]': ['hashtag1'],
        'filter[profiles]': [123129313013, 123129313013, 123129313013, 123129313013],
        'filter[mentions]': ['user1', 'user2'],
        'filter[type]': ['link', 'video', 'photo']
      }, 
      function success(res) {
        console.info(res);
      },
      function error(err) {
        console.error(err);
      });
  });
```

> O código acima retornara uma estrutura em `JSON` parecida com essa:

```json
[
]
```

Esse endpoint retorna todos os posts de Facecook com opção de selecionar um período e filtros.

### HTTP Request

`GET https://hash-api.herokuapp.com/v1/analytics/facebook/most_commented_posts`

### Paramentros da Query

Parameter            | Default | Description
---------------------| ------- | -----------
profile_type | | **Obrigatório**. Tipo de perfil a ser analisado, páginas `page` ou usuários `user`.
period               |   1d    | _Opcional_. Período que vai ser consultado a parti do inicio da requisição, as opções são: <ul> <li>`15m` : 15 minutos</li> <li>`30m` : 30 minutos</li> <li>`1h` : 1 hora</li> <li>`6h` : 6 horas</li> <li>`12h` : 12 horas</li> <li>`1d` : 1 dia</li> <li>`7d` : 7 dias</li> <li>`15d` - 15 dias</li> </ul>
filter[with_tags]    |         | _Opcional_. Uma array de strings que filtra os posts que possuem todas as tags informadas.
filter[contain_tags] |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das tags informadas.
filter[hashtags]     |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das hashtags informadas.
filter[profiles]        |         | _Opcional_. Uma array de inteiros `int32` dos ids dos perfis que filtra os posts que possuem qualquer um dos perfis informados.
filter[mentions]     |         | _Opcional_. Uma array que filtra os posts que possuem qualquer um dos usuários informados e que foram mencionados.
filter[type]          |         | _Opcional_. Uma array que filtra os tweets que possuem todas as condições informadas. As condições são: <ul> <li>`link` : URL/Link</li> <li>`photo` : Fotos ou Imagens</li> <li>`video` : Vídeos</li> <li>`event` : Eventos</li> <li>`status` : Status</li> <li>`music` : Música</li></ul> 

## Posts Mais Curtidos

```javascript
angular
  .module('app', ['hash.api'])
  .controller('MyCtrl', function ($scope, AnalyticsFacebook) {
    AnalyticsFacebook.mostLikedPosts({
        profile_type: 'page', // Requiried
        period: '1d',
        'filter[with_tags]': ['tag-1', 'tag-2'],
        'filter[contain_tags]': ['tag-1', 'tag-2'],
        'filter[hashtags]': ['hashtag1'],
        'filter[profiles]': [123129313013, 123129313013, 123129313013, 123129313013],
        'filter[mentions]': ['user1', 'user2'],
        'filter[type]': ['link', 'video', 'photo']
      }, 
      function success(res) {
        console.info(res);
      },
      function error(err) {
        console.error(err);
      });
  });
```

> O código acima retornara uma estrutura em `JSON` parecida com essa:

```json
[
]
```

Esse endpoint retorna todos os posts de Facecook com opção de selecionar um período e filtros.

### HTTP Request

`GET https://hash-api.herokuapp.com/v1/analytics/facebook/most_liked_posts`

### Paramentros da Query

Parameter            | Default | Description
---------------------| ------- | -----------
profile_type | | **Obrigatório**. Tipo de perfil a ser analisado, páginas `page` ou usuários `user`.
period               |   1d    | _Opcional_. Período que vai ser consultado a parti do inicio da requisição, as opções são: <ul> <li>`15m` : 15 minutos</li> <li>`30m` : 30 minutos</li> <li>`1h` : 1 hora</li> <li>`6h` : 6 horas</li> <li>`12h` : 12 horas</li> <li>`1d` : 1 dia</li> <li>`7d` : 7 dias</li> <li>`15d` - 15 dias</li> </ul>
filter[with_tags]    |         | _Opcional_. Uma array de strings que filtra os posts que possuem todas as tags informadas.
filter[contain_tags] |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das tags informadas.
filter[hashtags]     |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das hashtags informadas.
filter[profiles]        |         | _Opcional_. Uma array de inteiros `int32` dos ids dos perfis que filtra os posts que possuem qualquer um dos perfis informados.
filter[mentions]     |         | _Opcional_. Uma array que filtra os posts que possuem qualquer um dos usuários informados e que foram mencionados.
filter[type]          |         | _Opcional_. Uma array que filtra os tweets que possuem todas as condições informadas. As condições são: <ul> <li>`link` : URL/Link</li> <li>`photo` : Fotos ou Imagens</li> <li>`video` : Vídeos</li> <li>`event` : Eventos</li> <li>`status` : Status</li> <li>`music` : Música</li></ul> 

## Imagens Mais Recorrentes

```javascript
angular
  .module('app', ['hash.api'])
  .controller('MyCtrl', function ($scope, AnalyticsFacebook) {
    AnalyticsFacebook.mostRecurringIimages({
        profile_type: 'page', // Requiried
        period: '1d',
        'filter[with_tags]': ['tag-1', 'tag-2'],
        'filter[contain_tags]': ['tag-1', 'tag-2'],
        'filter[hashtags]': ['hashtag1'],
        'filter[profiles]': [123129313013, 123129313013, 123129313013, 123129313013],
        'filter[mentions]': ['user1', 'user2'],
        'filter[type]': ['link', 'video', 'photo']
      }, 
      function success(res) {
        console.info(res);
      },
      function error(err) {
        console.error(err);
      });
  });
```

> O código acima retornara uma estrutura em `JSON` parecida com essa:

```json
[
]
```

Esse endpoint retorna todos os posts de Facecook com opção de selecionar um período e filtros.

### HTTP Request

`GET https://hash-api.herokuapp.com/v1/analytics/facebook/most_recurring_images`

### Paramentros da Query

Parameter            | Default | Description
---------------------| ------- | -----------
profile_type | | **Obrigatório**. Tipo de perfil a ser analisado, páginas `page` ou usuários `user`.
period               |   1d    | _Opcional_. Período que vai ser consultado a parti do inicio da requisição, as opções são: <ul> <li>`15m` : 15 minutos</li> <li>`30m` : 30 minutos</li> <li>`1h` : 1 hora</li> <li>`6h` : 6 horas</li> <li>`12h` : 12 horas</li> <li>`1d` : 1 dia</li> <li>`7d` : 7 dias</li> <li>`15d` - 15 dias</li> </ul>
filter[with_tags]    |         | _Opcional_. Uma array de strings que filtra os posts que possuem todas as tags informadas.
filter[contain_tags] |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das tags informadas.
filter[hashtags]     |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das hashtags informadas.
filter[profiles]        |         | _Opcional_. Uma array de inteiros `int32` dos ids dos perfis que filtra os posts que possuem qualquer um dos perfis informados.
filter[mentions]     |         | _Opcional_. Uma array que filtra os posts que possuem qualquer um dos usuários informados e que foram mencionados.
filter[type]          |         | _Opcional_. Uma array que filtra os tweets que possuem todas as condições informadas. As condições são: <ul> <li>`link` : URL/Link</li> <li>`photo` : Fotos ou Imagens</li> <li>`video` : Vídeos</li> <li>`event` : Eventos</li> <li>`status` : Status</li> <li>`music` : Música</li></ul> 

## Posts Mais Compartilhados

```javascript
angular
  .module('app', ['hash.api'])
  .controller('MyCtrl', function ($scope, AnalyticsFacebook) {
    AnalyticsFacebook.mostSharedPosts({
        profile_type: 'page', // Requiried
        period: '1d',
        'filter[with_tags]': ['tag-1', 'tag-2'],
        'filter[contain_tags]': ['tag-1', 'tag-2'],
        'filter[hashtags]': ['hashtag1'],
        'filter[profiles]': [123129313013, 123129313013, 123129313013, 123129313013],
        'filter[mentions]': ['user1', 'user2'],
        'filter[type]': ['link', 'video', 'photo']
      }, 
      function success(res) {
        console.info(res);
      },
      function error(err) {
        console.error(err);
      });
  });
```

> O código acima retornara uma estrutura em `JSON` parecida com essa:

```json
[
]
```

Esse endpoint retorna todos os posts de Facecook com opção de selecionar um período e filtros.

### HTTP Request

`GET https://hash-api.herokuapp.com/v1/analytics/facebook/most_shared_posts`

### Paramentros da Query

Parameter            | Default | Description
---------------------| ------- | -----------
profile_type | | **Obrigatório**. Tipo de perfil a ser analisado, páginas `page` ou usuários `user`.
period               |   1d    | _Opcional_. Período que vai ser consultado a parti do inicio da requisição, as opções são: <ul> <li>`15m` : 15 minutos</li> <li>`30m` : 30 minutos</li> <li>`1h` : 1 hora</li> <li>`6h` : 6 horas</li> <li>`12h` : 12 horas</li> <li>`1d` : 1 dia</li> <li>`7d` : 7 dias</li> <li>`15d` - 15 dias</li> </ul>
filter[with_tags]    |         | _Opcional_. Uma array de strings que filtra os posts que possuem todas as tags informadas.
filter[contain_tags] |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das tags informadas.
filter[hashtags]     |         | _Opcional_. Uma array de strings que filtra os posts que possuem qualquer uma das hashtags informadas.
filter[profiles]        |         | _Opcional_. Uma array de inteiros `int32` dos ids dos perfis que filtra os posts que possuem qualquer um dos perfis informados.
filter[mentions]     |         | _Opcional_. Uma array que filtra os posts que possuem qualquer um dos usuários informados e que foram mencionados.
filter[type]          |         | _Opcional_. Uma array que filtra os tweets que possuem todas as condições informadas. As condições são: <ul> <li>`link` : URL/Link</li> <li>`photo` : Fotos ou Imagens</li> <li>`video` : Vídeos</li> <li>`event` : Eventos</li> <li>`status` : Status</li> <li>`music` : Música</li></ul> 
