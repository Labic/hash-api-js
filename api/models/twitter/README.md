## Questions
 - Use `Rule.id` as type 
   > Don't do this? If do, do with interger type, avoid random hashs. [$need_ref]


## REF: Content Elastic Search

### Articles
 - [Optimizing Elasticsearch: How Many Shards per Index?](https://qbox.io/blog/optimizing-elasticsearch-how-many-shards-per-index)
 - [The ideal Elasticsearch index](https://bonsai.io/2016/01/11/ideal-elasticsearch-cluster)
 - [Custom Similarity for ElasticSearch](http://stefansavev.com/blog/custom-similarity-for-elasticsearch/)
 - [searchkick - Intelligent search made easy with Rails and Elasticsearch](https://github.com/ankane/searchkick)
 - [Index vs. Type](https://www.elastic.co/blog/index-vs-type)
### Twitter
 - [Tweet data dictionaries](https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/intro-to-tweet-json)
 - https://www.compose.com/articles/transporter-maps-mongodb-to-elasticsearch/
 - https://www.datadoghq.com/blog/elasticsearch-performance-scaling-problems/
 - https://www.datadoghq.com/blog/monitor-elasticsearch-performance-metrics/


### Documentation
 
 - [Elasticsearch Reference [5.6]](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/index.html)
 - [Elasticsearch Reference [5.6] » Getting Started » Basic Concepts](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/_basic_concepts.html)
 - [Elasticsearch Reference [5.6] » Mapping](https://www.elastic.co/guide/en/elasticsearch/reference/5.6/mapping.html)

https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-shingle-tokenfilter.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-word-delimiter-tokenfilter.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-keyword-marker-tokenfilter.html
!!! https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-synonym-tokenfilter.html
!!! https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-synonym-graph-tokenfilter.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-elision-tokenfilter.html
!!! https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-pattern-capture-tokenfilter.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-limit-token-count-tokenfilter.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-common-grams-tokenfilter.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-keep-types-tokenfilter.html
https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-fingerprint-tokenfilter.html


## Elasticseach Enpoints

```kibana
DELETE twitter/statuses?routing=${PROJECT}~${collector_id}

# DELETE twitter/statuses?routing=project-0~collector-0


PUT twitter/statuses?routing=${PROJECT}~${collector_id}
${./_index-timplate-es.yaml | json}


POST twitter/statuses?routing=${PROJECT}~${collector_id}
${demo.json.statusuesFull}

# POST twitter/statuses?routing=project-0~collector-0
{
  "text": "bla bla bla"
}
```

```kibana



```

## REF: Models

```json
{
  "categories": [
    "cidade-recife",
    "institucional",
    "público geral",
    "uf-pe"
  ],
  "keywords": [
    "cidade-recife",
    "institucional",
    "público geral",
    "uf-pe"
  ],
  "reverse_geocode": [
    "-8.01175",
    "-34.95291"
  ],
  "status": {
    "contributors": null,
    "coordinates": null,
    "created_at": "2017-10-21T20:24:57.000-02:00",
    "entities": {
      "hashtags": [],
      "symbols": [],
      "urls": [
        {
          "url": "https://t.co/8fGxotNVMK",
          "indices": [
            38,
            61
          ],
          "expanded_url": "https://twitter.com/jtlixo/status/921862954076852225",
          "display_url": "twitter.com/jtlixo/status/…"
        }
      ],
      "user_mentions": [
        {
          "id": 369784911,
          "id_str": "369784911",
          "indices": [
            3,
            13
          ],
          "name": "pedro",
          "screen_name": "getwreird"
        }
      ]
    },
    "favorite_count": 0,
    "favorited": false,
    "filter_level": "low",
    "geo": null,
    "id": 9.21864913303241,
    "id_str": "921864913303240704",
    "in_reply_to_screen_name": null,
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "is_quote_status": true,
    "lang": "pt",
    "place": null,
    "possibly_sensitive": true,
    "quote_count": 0,
    "quoted_status": {
      "contributors": null,
      "truncated": false,
      "text": "quem for fazer a prova do enem amanhã, boa prova pessoal",
      "in_reply_to_status_id": null,
      "id": 9.21862954076852,
      "in_reply_to_status_id_str": null,
      "in_reply_to_user_id": null,
      "in_reply_to_user_id_str": null,
      "in_reply_to_screen_name": null,
      "favorite_count": 0,
      "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
      "retweeted": false,
      "coordinates": null,
      "entities": {
        "symbols": [],
        "urls": [],
        "hashtags": [],
        "user_mentions": []
      },
      "id_str": "921862954076852225",
      "retweet_count": 0,
      "favorited": false,
      "user": {
        "location": "Recife, Brasil",
        "default_profile": false,
        "statuses_count": 268332,
        "profile_background_tile": false,
        "lang": "pt",
        "profile_link_color": "999999",
        "id": 421487768,
        "following": null,
        "favourites_count": 32339,
        "protected": false,
        "profile_text_color": "333333",
        "contributors_enabled": false,
        "verified": false,
        "description": "se eu to na terra é pra divulgar e enaltecer as rappers femininas",
        "name": "junior 100 limitesrs",
        "profile_sidebar_border_color": "FFFFFF",
        "profile_background_color": "FFFFFF",
        "created_at": "2011-11-25T22:51:26.000-02:00",
        "default_profile_image": false,
        "followers_count": 5829,
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/918336406858096640/vu5em0b3_normal.jpg",
        "geo_enabled": true,
        "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/603355494028169216/dGIosjjz.jpg",
        "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/603355494028169216/dGIosjjz.jpg",
        "follow_request_sent": null,
        "url": "http://www.last.fm/pt/user/jtlixo",
        "utc_offset": true,
        "time_zone": "Brasilia",
        "notifications": null,
        "friends_count": 942,
        "profile_use_background_image": true,
        "profile_sidebar_fill_color": "EFEFEF",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/421487768/1494593771",
        "screen_name": "jtlixo",
        "id_str": "421487768",
        "profile_image_url": "http://pbs.twimg.com/profile_images/918336406858096640/vu5em0b3_normal.jpg",
        "listed_count": 73,
        "is_translator": false,
        "translator_type": "regular"
      },
      "geo": null,
      "is_quote_status": false,
      "lang": "pt",
      "created_at": "2017-10-21T20:17:10.000-02:00",
      "filter_level": "low",
      "place": null,
      "quote_count": 1,
      "reply_count": 1
    },
    "quoted_status_id": 9.21862954076852,
    "quoted_status_id_str": "921862954076852225",
    "reply_count": 0,
    "retweet_count": 0,
    "retweeted": false,
    "retweeted_status": {
      "contributors": null,
      "truncated": false,
      "text": "quem vai fazer amanhã? https://t.co/8fGxotNVMK",
      "in_reply_to_status_id": null,
      "id": 9.21863224210985,
      "in_reply_to_status_id_str": null,
      "in_reply_to_user_id": null,
      "in_reply_to_user_id_str": null,
      "in_reply_to_screen_name": null,
      "quoted_status_id": 9.21862954076852,
      "quoted_status_id_str": "921862954076852225",
      "quoted_status": {
        "contributors": null,
        "truncated": false,
        "text": "quem for fazer a prova do enem amanhã, boa prova pessoal",
        "in_reply_to_status_id": null,
        "id": 9.21862954076852,
        "in_reply_to_status_id_str": null,
        "in_reply_to_user_id": null,
        "in_reply_to_user_id_str": null,
        "in_reply_to_screen_name": null,
        "favorite_count": 0,
        "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
        "retweeted": false,
        "coordinates": null,
        "entities": {
          "symbols": [],
          "urls": [],
          "hashtags": [],
          "user_mentions": []
        },
        "id_str": "921862954076852225",
        "retweet_count": 0,
        "favorited": false,
        "user": {
          "location": "Recife, Brasil",
          "default_profile": false,
          "statuses_count": 268332,
          "profile_background_tile": false,
          "lang": "pt",
          "profile_link_color": "999999",
          "id": 421487768,
          "following": null,
          "favourites_count": 32339,
          "protected": false,
          "profile_text_color": "333333",
          "contributors_enabled": false,
          "verified": false,
          "description": "se eu to na terra é pra divulgar e enaltecer as rappers femininas",
          "name": "junior 100 limitesrs",
          "profile_sidebar_border_color": "FFFFFF",
          "profile_background_color": "FFFFFF",
          "created_at": "2011-11-25T22:51:26.000-02:00",
          "default_profile_image": false,
          "followers_count": 5829,
          "profile_image_url_https": "https://pbs.twimg.com/profile_images/918336406858096640/vu5em0b3_normal.jpg",
          "geo_enabled": true,
          "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/603355494028169216/dGIosjjz.jpg",
          "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/603355494028169216/dGIosjjz.jpg",
          "follow_request_sent": null,
          "url": "http://www.last.fm/pt/user/jtlixo",
          "utc_offset": true,
          "time_zone": "Brasilia",
          "notifications": null,
          "friends_count": 942,
          "profile_use_background_image": true,
          "profile_sidebar_fill_color": "EFEFEF",
          "profile_banner_url": "https://pbs.twimg.com/profile_banners/421487768/1494593771",
          "screen_name": "jtlixo",
          "id_str": "421487768",
          "profile_image_url": "http://pbs.twimg.com/profile_images/918336406858096640/vu5em0b3_normal.jpg",
          "listed_count": 73,
          "is_translator": false,
          "translator_type": "regular"
        },
        "geo": null,
        "is_quote_status": false,
        "lang": "pt",
        "created_at": "2017-10-21T20:17:10.000-02:00",
        "filter_level": "low",
        "place": null,
        "quote_count": 1,
        "reply_count": 1
      },
      "favorite_count": 0,
      "source": "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>",
      "retweeted": false,
      "coordinates": null,
      "entities": {
        "symbols": [],
        "urls": [
          {
            "url": "https://t.co/8fGxotNVMK",
            "indices": [
              23,
              46
            ],
            "expanded_url": "https://twitter.com/jtlixo/status/921862954076852225",
            "display_url": "twitter.com/jtlixo/status/…"
          }
        ],
        "hashtags": [],
        "user_mentions": []
      },
      "id_str": "921863224210984960",
      "retweet_count": 1,
      "favorited": false,
      "user": {
        "location": "Brasília, Brasil",
        "default_profile": false,
        "statuses_count": 451146,
        "profile_background_tile": true,
        "lang": "pt",
        "profile_link_color": "000000",
        "id": 369784911,
        "following": null,
        "favourites_count": 726,
        "protected": false,
        "profile_text_color": "FDBAA9",
        "contributors_enabled": false,
        "verified": false,
        "description": "Just a touch of your love and a quick shout out to all your exes is all it takes to win a BRIT award.",
        "name": "pedro",
        "profile_sidebar_border_color": "000000",
        "profile_background_color": "FFFFFF",
        "created_at": "2011-09-07T21:12:47.000-02:00",
        "default_profile_image": false,
        "followers_count": 134369,
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/916348481794723840/cIZXHnuN_normal.jpg",
        "geo_enabled": true,
        "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/521889346371080192/r6wCWHHn.png",
        "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/521889346371080192/r6wCWHHn.png",
        "follow_request_sent": null,
        "url": "https://www.youtube.com/channel/UCSx1HWpPLD1fWuaYuRVOBgw?view_as=subscriber",
        "utc_offset": true,
        "time_zone": "Brasilia",
        "notifications": null,
        "friends_count": 934,
        "profile_use_background_image": false,
        "profile_sidebar_fill_color": "976F63",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/369784911/1507309638",
        "screen_name": "getwreird",
        "id_str": "369784911",
        "profile_image_url": "http://pbs.twimg.com/profile_images/916348481794723840/cIZXHnuN_normal.jpg",
        "listed_count": 321,
        "is_translator": true,
        "translator_type": "regular"
      },
      "geo": null,
      "possibly_sensitive": false,
      "is_quote_status": true,
      "lang": "pt",
      "created_at": "2017-10-21T20:18:14.000-02:00",
      "filter_level": "low",
      "place": null,
      "quote_count": 0,
      "reply_count": 0,
      "display_text_range": [
        0,
        22
      ]
    },
    "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
    "text": "RT @getwreird: quem vai fazer amanhã? https://t.co/8fGxotNVMK",
    "timestamp_ms": 1508624697410,
    "truncated": false,
    "user": {
      "contributors_enabled": false,
      "created_at": "2011-11-25T22:51:26.000-02:00",
      "default_profile": false,
      "default_profile_image": false,
      "description": "se eu to na terra é pra divulgar e enaltecer as rappers femininas",
      "favourites_count": 32339,
      "follow_request_sent": null,
      "followers_count": 5829,
      "following": null,
      "friends_count": 942,
      "geo_enabled": true,
      "id": 421487768,
      "id_str": "421487768",
      "is_translator": false,
      "lang": "pt",
      "listed_count": 73,
      "location": "Recife, Brasil",
      "name": "junior 100 limitesrs",
      "notifications": null,
      "profile_background_color": "FFFFFF",
      "profile_background_image_url": "http://pbs.twimg.com/profile_background_images/603355494028169216/dGIosjjz.jpg",
      "profile_background_image_url_https": "https://pbs.twimg.com/profile_background_images/603355494028169216/dGIosjjz.jpg",
      "profile_background_tile": false,
      "profile_banner_url": "https://pbs.twimg.com/profile_banners/421487768/1494593771",
      "profile_image_url": "http://pbs.twimg.com/profile_images/918336406858096640/vu5em0b3_normal.jpg",
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/918336406858096640/vu5em0b3_normal.jpg",
      "profile_link_color": "999999",
      "profile_sidebar_border_color": "FFFFFF",
      "profile_sidebar_fill_color": "EFEFEF",
      "profile_text_color": "333333",
      "profile_use_background_image": true,
      "protected": false,
      "screen_name": "jtlixo",
      "statuses_count": 268333,
      "time_zone": "Brasilia",
      "translator_type": "regular",
      "url": "http://www.last.fm/pt/user/jtlixo",
      "utc_offset": true,
      "verified": false
    }
  }
}
```


## REF: Index Template for Elastic Search

```json
${./_index-timplate-es.yaml}
```




twitter-statuses?routing={project_id}.{collector_id}
  
{org_id}-socialmediapost-twitter-statuses-3.2017.10.23


## REF: Analysis for Twitter

```yaml
twitter_emojis:
  type: "pattern"
  # REFERENCE: https://github.com/twitter/twemoji/blob/v2.5.0/twemoji.js
  pattern: """/((?:\ud83c\udde8\ud83c\uddf3|\ud83c\uddfa\ud83c\uddf8|\ud83c\uddf7\ud83c\uddfa|\ud83c\uddf0\ud83c\uddf7|\ud83c\uddef\ud83c\uddf5|\ud83c\uddee\ud83c\uddf9|\ud83c\uddec\ud83c\udde7|\ud83c\uddeb\ud83c\uddf7|\ud83c\uddea\ud83c\uddf8|\ud83c\udde9\ud83c\uddea|\u0039\ufe0f?\u20e3|\u0038\ufe0f?\u20e3|\u0037\ufe0f?\u20e3|\u0036\ufe0f?\u20e3|\u0035\ufe0f?\u20e3|\u0034\ufe0f?\u20e3|\u0033\ufe0f?\u20e3|\u0032\ufe0f?\u20e3|\u0031\ufe0f?\u20e3|\u0030\ufe0f?\u20e3|\u0023\ufe0f?\u20e3|\ud83d\udeb3|\ud83d\udeb1|\ud83d\udeb0|\ud83d\udeaf|\ud83d\udeae|\ud83d\udea6|\ud83d\udea3|\ud83d\udea1|\ud83d\udea0|\ud83d\ude9f|\ud83d\ude9e|\ud83d\ude9d|\ud83d\ude9c|\ud83d\ude9b|\ud83d\ude98|\ud83d\ude96|\ud83d\ude94|\ud83d\ude90|\ud83d\ude8e|\ud83d\ude8d|\ud83d\ude8b|\ud83d\ude8a|\ud83d\ude88|\ud83d\ude86|\ud83d\ude82|\ud83d\ude81|\ud83d\ude36|\ud83d\ude34|\ud83d\ude2f|\ud83d\ude2e|\ud83d\ude2c|\ud83d\ude27|\ud83d\ude26|\ud83d\ude1f|\ud83d\ude1b|\ud83d\ude19|\ud83d\ude17|\ud83d\ude15|\ud83d\ude11|\ud83d\ude10|\ud83d\ude0e|\ud83d\ude08|\ud83d\ude07|\ud83d\ude00|\ud83d\udd67|\ud83d\udd66|\ud83d\udd65|\ud83d\udd64|\ud83d\udd63|\ud83d\udd62|\ud83d\udd61|\ud83d\udd60|\ud83d\udd5f|\ud83d\udd5e|\ud83d\udd5d|\ud83d\udd5c|\ud83d\udd2d|\ud83d\udd2c|\ud83d\udd15|\ud83d\udd09|\ud83d\udd08|\ud83d\udd07|\ud83d\udd06|\ud83d\udd05|\ud83d\udd04|\ud83d\udd02|\ud83d\udd01|\ud83d\udd00|\ud83d\udcf5|\ud83d\udcef|\ud83d\udced|\ud83d\udcec|\ud83d\udcb7|\ud83d\udcb6|\ud83d\udcad|\ud83d\udc6d|\ud83d\udc6c|\ud83d\udc65|\ud83d\udc2a|\ud83d\udc16|\ud83d\udc15|\ud83d\udc13|\ud83d\udc10|\ud83d\udc0f|\ud83d\udc0b|\ud83d\udc0a|\ud83d\udc09|\ud83d\udc08|\ud83d\udc07|\ud83d\udc06|\ud83d\udc05|\ud83d\udc04|\ud83d\udc03|\ud83d\udc02|\ud83d\udc01|\ud83d\udc00|\ud83c\udfe4|\ud83c\udfc9|\ud83c\udfc7|\ud83c\udf7c|\ud83c\udf50|\ud83c\udf4b|\ud83c\udf33|\ud83c\udf32|\ud83c\udf1e|\ud83c\udf1d|\ud83c\udf1c|\ud83c\udf1a|\ud83c\udf18|\ud83c\udccf|\ud83c\udd8e|\ud83c\udd91|\ud83c\udd92|\ud83c\udd93|\ud83c\udd94|\ud83c\udd95|\ud83c\udd96|\ud83c\udd97|\ud83c\udd98|\ud83c\udd99|\ud83c\udd9a|\ud83d\udc77|\ud83d\udec5|\ud83d\udec4|\ud83d\udec3|\ud83d\udec2|\ud83d\udec1|\ud83d\udebf|\ud83d\udeb8|\ud83d\udeb7|\ud83d\udeb5|\ud83c\ude01|\ud83c\ude32|\ud83c\ude33|\ud83c\ude34|\ud83c\ude35|\ud83c\ude36|\ud83c\ude38|\ud83c\ude39|\ud83c\ude3a|\ud83c\ude50|\ud83c\ude51|\ud83c\udf00|\ud83c\udf01|\ud83c\udf02|\ud83c\udf03|\ud83c\udf04|\ud83c\udf05|\ud83c\udf06|\ud83c\udf07|\ud83c\udf08|\ud83c\udf09|\ud83c\udf0a|\ud83c\udf0b|\ud83c\udf0c|\ud83c\udf0f|\ud83c\udf11|\ud83c\udf13|\ud83c\udf14|\ud83c\udf15|\ud83c\udf19|\ud83c\udf1b|\ud83c\udf1f|\ud83c\udf20|\ud83c\udf30|\ud83c\udf31|\ud83c\udf34|\ud83c\udf35|\ud83c\udf37|\ud83c\udf38|\ud83c\udf39|\ud83c\udf3a|\ud83c\udf3b|\ud83c\udf3c|\ud83c\udf3d|\ud83c\udf3e|\ud83c\udf3f|\ud83c\udf40|\ud83c\udf41|\ud83c\udf42|\ud83c\udf43|\ud83c\udf44|\ud83c\udf45|\ud83c\udf46|\ud83c\udf47|\ud83c\udf48|\ud83c\udf49|\ud83c\udf4a|\ud83c\udf4c|\ud83c\udf4d|\ud83c\udf4e|\ud83c\udf4f|\ud83c\udf51|\ud83c\udf52|\ud83c\udf53|\ud83c\udf54|\ud83c\udf55|\ud83c\udf56|\ud83c\udf57|\ud83c\udf58|\ud83c\udf59|\ud83c\udf5a|\ud83c\udf5b|\ud83c\udf5c|\ud83c\udf5d|\ud83c\udf5e|\ud83c\udf5f|\ud83c\udf60|\ud83c\udf61|\ud83c\udf62|\ud83c\udf63|\ud83c\udf64|\ud83c\udf65|\ud83c\udf66|\ud83c\udf67|\ud83c\udf68|\ud83c\udf69|\ud83c\udf6a|\ud83c\udf6b|\ud83c\udf6c|\ud83c\udf6d|\ud83c\udf6e|\ud83c\udf6f|\ud83c\udf70|\ud83c\udf71|\ud83c\udf72|\ud83c\udf73|\ud83c\udf74|\ud83c\udf75|\ud83c\udf76|\ud83c\udf77|\ud83c\udf78|\ud83c\udf79|\ud83c\udf7a|\ud83c\udf7b|\ud83c\udf80|\ud83c\udf81|\ud83c\udf82|\ud83c\udf83|\ud83c\udf84|\ud83c\udf85|\ud83c\udf86|\ud83c\udf87|\ud83c\udf88|\ud83c\udf89|\ud83c\udf8a|\ud83c\udf8b|\ud83c\udf8c|\ud83c\udf8d|\ud83c\udf8e|\ud83c\udf8f|\ud83c\udf90|\ud83c\udf91|\ud83c\udf92|\ud83c\udf93|\ud83c\udfa0|\ud83c\udfa1|\ud83c\udfa2|\ud83c\udfa3|\ud83c\udfa4|\ud83c\udfa5|\ud83c\udfa6|\ud83c\udfa7|\ud83c\udfa8|\ud83c\udfa9|\ud83c\udfaa|\ud83c\udfab|\ud83c\udfac|\ud83c\udfad|\ud83c\udfae|\ud83c\udfaf|\ud83c\udfb0|\ud83c\udfb1|\ud83c\udfb2|\ud83c\udfb3|\ud83c\udfb4|\ud83c\udfb5|\ud83c\udfb6|\ud83c\udfb7|\ud83c\udfb8|\ud83c\udfb9|\ud83c\udfba|\ud83c\udfbb|\ud83c\udfbc|\ud83c\udfbd|\ud83c\udfbe|\ud83c\udfbf|\ud83c\udfc0|\ud83c\udfc1|\ud83c\udfc2|\ud83c\udfc3|\ud83c\udfc4|\ud83c\udfc6|\ud83c\udfc8|\ud83c\udfca|\ud83c\udfe0|\ud83c\udfe1|\ud83c\udfe2|\ud83c\udfe3|\ud83c\udfe5|\ud83c\udfe6|\ud83c\udfe7|\ud83c\udfe8|\ud83c\udfe9|\ud83c\udfea|\ud83c\udfeb|\ud83c\udfec|\ud83c\udfed|\ud83c\udfee|\ud83c\udfef|\ud83c\udff0|\ud83d\udc0c|\ud83d\udc0d|\ud83d\udc0e|\ud83d\udc11|\ud83d\udc12|\ud83d\udc14|\ud83d\udc17|\ud83d\udc18|\ud83d\udc19|\ud83d\udc1a|\ud83d\udc1b|\ud83d\udc1c|\ud83d\udc1d|\ud83d\udc1e|\ud83d\udc1f|\ud83d\udc20|\ud83d\udc21|\ud83d\udc22|\ud83d\udc23|\ud83d\udc24|\ud83d\udc25|\ud83d\udc26|\ud83d\udc27|\ud83d\udc28|\ud83d\udc29|\ud83d\udc2b|\ud83d\udc2c|\ud83d\udc2d|\ud83d\udc2e|\ud83d\udc2f|\ud83d\udc30|\ud83d\udc31|\ud83d\udc32|\ud83d\udc33|\ud83d\udc34|\ud83d\udc35|\ud83d\udc36|\ud83d\udc37|\ud83d\udc38|\ud83d\udc39|\ud83d\udc3a|\ud83d\udc3b|\ud83d\udc3c|\ud83d\udc3d|\ud83d\udc3e|\ud83d\udc40|\ud83d\udc42|\ud83d\udc43|\ud83d\udc44|\ud83d\udc45|\ud83d\udc46|\ud83d\udc47|\ud83d\udc48|\ud83d\udc49|\ud83d\udc4a|\ud83d\udc4b|\ud83d\udc4c|\ud83d\udc4d|\ud83d\udc4e|\ud83d\udc4f|\ud83d\udc50|\ud83d\udc51|\ud83d\udc52|\ud83d\udc53|\ud83d\udc54|\ud83d\udc55|\ud83d\udc56|\ud83d\udc57|\ud83d\udc58|\ud83d\udc59|\ud83d\udc5a|\ud83d\udc5b|\ud83d\udc5c|\ud83d\udc5d|\ud83d\udc5e|\ud83d\udc5f|\ud83d\udc60|\ud83d\udc61|\ud83d\udc62|\ud83d\udc63|\ud83d\udc64|\ud83d\udc66|\ud83d\udc67|\ud83d\udc68|\ud83d\udc69|\ud83d\udc6a|\ud83d\udc6b|\ud83d\udc6e|\ud83d\udc6f|\ud83d\udc70|\ud83d\udc71|\ud83d\udc72|\ud83d\udc73|\ud83d\udc74|\ud83d\udc75|\ud83d\udc76|\ud83d\udeb4|\ud83d\udc78|\ud83d\udc79|\ud83d\udc7a|\ud83d\udc7b|\ud83d\udc7c|\ud83d\udc7d|\ud83d\udc7e|\ud83d\udc7f|\ud83d\udc80|\ud83d\udc81|\ud83d\udc82|\ud83d\udc83|\ud83d\udc84|\ud83d\udc85|\ud83d\udc86|\ud83d\udc87|\ud83d\udc88|\ud83d\udc89|\ud83d\udc8a|\ud83d\udc8b|\ud83d\udc8c|\ud83d\udc8d|\ud83d\udc8e|\ud83d\udc8f|\ud83d\udc90|\ud83d\udc91|\ud83d\udc92|\ud83d\udc93|\ud83d\udc94|\ud83d\udc95|\ud83d\udc96|\ud83d\udc97|\ud83d\udc98|\ud83d\udc99|\ud83d\udc9a|\ud83d\udc9b|\ud83d\udc9c|\ud83d\udc9d|\ud83d\udc9e|\ud83d\udc9f|\ud83d\udca0|\ud83d\udca1|\ud83d\udca2|\ud83d\udca3|\ud83d\udca4|\ud83d\udca5|\ud83d\udca6|\ud83d\udca7|\ud83d\udca8|\ud83d\udca9|\ud83d\udcaa|\ud83d\udcab|\ud83d\udcac|\ud83d\udcae|\ud83d\udcaf|\ud83d\udcb0|\ud83d\udcb1|\ud83d\udcb2|\ud83d\udcb3|\ud83d\udcb4|\ud83d\udcb5|\ud83d\udcb8|\ud83d\udcb9|\ud83d\udcba|\ud83d\udcbb|\ud83d\udcbc|\ud83d\udcbd|\ud83d\udcbe|\ud83d\udcbf|\ud83d\udcc0|\ud83d\udcc1|\ud83d\udcc2|\ud83d\udcc3|\ud83d\udcc4|\ud83d\udcc5|\ud83d\udcc6|\ud83d\udcc7|\ud83d\udcc8|\ud83d\udcc9|\ud83d\udcca|\ud83d\udccb|\ud83d\udccc|\ud83d\udccd|\ud83d\udcce|\ud83d\udccf|\ud83d\udcd0|\ud83d\udcd1|\ud83d\udcd2|\ud83d\udcd3|\ud83d\udcd4|\ud83d\udcd5|\ud83d\udcd6|\ud83d\udcd7|\ud83d\udcd8|\ud83d\udcd9|\ud83d\udcda|\ud83d\udcdb|\ud83d\udcdc|\ud83d\udcdd|\ud83d\udcde|\ud83d\udcdf|\ud83d\udce0|\ud83d\udce1|\ud83d\udce2|\ud83d\udce3|\ud83d\udce4|\ud83d\udce5|\ud83d\udce6|\ud83d\udce7|\ud83d\udce8|\ud83d\udce9|\ud83d\udcea|\ud83d\udceb|\ud83d\udcee|\ud83d\udcf0|\ud83d\udcf1|\ud83d\udcf2|\ud83d\udcf3|\ud83d\udcf4|\ud83d\udcf6|\ud83d\udcf7|\ud83d\udcf9|\ud83d\udcfa|\ud83d\udcfb|\ud83d\udcfc|\ud83d\udd03|\ud83d\udd0a|\ud83d\udd0b|\ud83d\udd0c|\ud83d\udd0d|\ud83d\udd0e|\ud83d\udd0f|\ud83d\udd10|\ud83d\udd11|\ud83d\udd12|\ud83d\udd13|\ud83d\udd14|\ud83d\udd16|\ud83d\udd17|\ud83d\udd18|\ud83d\udd19|\ud83d\udd1a|\ud83d\udd1b|\ud83d\udd1c|\ud83d\udd1d|\ud83d\udd1e|\ud83d\udd1f|\ud83d\udd20|\ud83d\udd21|\ud83d\udd22|\ud83d\udd23|\ud83d\udd24|\ud83d\udd25|\ud83d\udd26|\ud83d\udd27|\ud83d\udd28|\ud83d\udd29|\ud83d\udd2a|\ud83d\udd2b|\ud83d\udd2e|\ud83d\udd2f|\ud83d\udd30|\ud83d\udd31|\ud83d\udd32|\ud83d\udd33|\ud83d\udd34|\ud83d\udd35|\ud83d\udd36|\ud83d\udd37|\ud83d\udd38|\ud83d\udd39|\ud83d\udd3a|\ud83d\udd3b|\ud83d\udd3c|\ud83d\udd3d|\ud83d\udd50|\ud83d\udd51|\ud83d\udd52|\ud83d\udd53|\ud83d\udd54|\ud83d\udd55|\ud83d\udd56|\ud83d\udd57|\ud83d\udd58|\ud83d\udd59|\ud83d\udd5a|\ud83d\udd5b|\ud83d\uddfb|\ud83d\uddfc|\ud83d\uddfd|\ud83d\uddfe|\ud83d\uddff|\ud83d\ude01|\ud83d\ude02|\ud83d\ude03|\ud83d\ude04|\ud83d\ude05|\ud83d\ude06|\ud83d\ude09|\ud83d\ude0a|\ud83d\ude0b|\ud83d\ude0c|\ud83d\ude0d|\ud83d\ude0f|\ud83d\ude12|\ud83d\ude13|\ud83d\ude14|\ud83d\ude16|\ud83d\ude18|\ud83d\ude1a|\ud83d\ude1c|\ud83d\ude1d|\ud83d\ude1e|\ud83d\ude20|\ud83d\ude21|\ud83d\ude22|\ud83d\ude23|\ud83d\ude24|\ud83d\ude25|\ud83d\ude28|\ud83d\ude29|\ud83d\ude2a|\ud83d\ude2b|\ud83d\ude2d|\ud83d\ude30|\ud83d\ude31|\ud83d\ude32|\ud83d\ude33|\ud83d\ude35|\ud83d\ude37|\ud83d\ude38|\ud83d\ude39|\ud83d\ude3a|\ud83d\ude3b|\ud83d\ude3c|\ud83d\ude3d|\ud83d\ude3e|\ud83d\ude3f|\ud83d\ude40|\ud83d\ude45|\ud83d\ude46|\ud83d\ude47|\ud83d\ude48|\ud83d\ude49|\ud83d\ude4a|\ud83d\ude4b|\ud83d\ude4c|\ud83d\ude4d|\ud83d\ude4e|\ud83d\ude4f|\ud83d\ude80|\ud83d\ude83|\ud83d\ude84|\ud83d\ude85|\ud83d\ude87|\ud83d\ude89|\ud83d\ude8c|\ud83d\ude8f|\ud83d\ude91|\ud83d\ude92|\ud83d\ude93|\ud83d\ude95|\ud83d\ude97|\ud83d\ude99|\ud83d\ude9a|\ud83d\udea2|\ud83d\udea4|\ud83d\udea5|\ud83d\udea7|\ud83d\udea8|\ud83d\udea9|\ud83d\udeaa|\ud83d\udeab|\ud83d\udeac|\ud83d\udead|\ud83d\udeb2|\ud83d\udeb6|\ud83d\udeb9|\ud83d\udeba|\ud83d\udebb|\ud83d\udebc|\ud83d\udebd|\ud83d\udebe|\ud83d\udec0|\ud83c\udde6|\ud83c\udde7|\ud83c\udde8|\ud83c\udde9|\ud83c\uddea|\ud83c\uddeb|\ud83c\uddec|\ud83c\udded|\ud83c\uddee|\ud83c\uddef|\ud83c\uddf0|\ud83c\uddf1|\ud83c\uddf2|\ud83c\uddf3|\ud83c\uddf4|\ud83c\uddf5|\ud83c\uddf6|\ud83c\uddf7|\ud83c\uddf8|\ud83c\uddf9|\ud83c\uddfa|\ud83c\uddfb|\ud83c\uddfc|\ud83c\uddfd|\ud83c\uddfe|\ud83c\uddff|\ud83c\udf0d|\ud83c\udf0e|\ud83c\udf10|\ud83c\udf12|\ud83c\udf16|\ud83c\udf17|\ue50a|\u27b0|\u2797|\u2796|\u2795|\u2755|\u2754|\u2753|\u274e|\u274c|\u2728|\u270b|\u270a|\u2705|\u26ce|\u23f3|\u23f0|\u23ec|\u23eb|\u23ea|\u23e9|\u27bf|\u00a9|\u00ae)|(?:(?:\ud83c\udc04|\ud83c\udd70|\ud83c\udd71|\ud83c\udd7e|\ud83c\udd7f|\ud83c\ude02|\ud83c\ude1a|\ud83c\ude2f|\ud83c\ude37|\u3299|\u303d|\u3030|\u2b55|\u2b50|\u2b1c|\u2b1b|\u2b07|\u2b06|\u2b05|\u2935|\u2934|\u27a1|\u2764|\u2757|\u2747|\u2744|\u2734|\u2733|\u2716|\u2714|\u2712|\u270f|\u270c|\u2709|\u2708|\u2702|\u26fd|\u26fa|\u26f5|\u26f3|\u26f2|\u26ea|\u26d4|\u26c5|\u26c4|\u26be|\u26bd|\u26ab|\u26aa|\u26a1|\u26a0|\u2693|\u267f|\u267b|\u3297|\u2666|\u2665|\u2663|\u2660|\u2653|\u2652|\u2651|\u2650|\u264f|\u264e|\u264d|\u264c|\u264b|\u264a|\u2649|\u2648|\u263a|\u261d|\u2615|\u2614|\u2611|\u260e|\u2601|\u2600|\u25fe|\u25fd|\u25fc|\u25fb|\u25c0|\u25b6|\u25ab|\u25aa|\u24c2|\u231b|\u231a|\u21aa|\u21a9|\u2199|\u2198|\u2197|\u2196|\u2195|\u2194|\u2139|\u2122|\u2049|\u203c|\u2668)([\uFE0E\uFE0F]?)))/g"""
twitter_hashtag:
  type: "pattern"
  # REFERENCE: https://stackoverflow.com/questions/8451846/actual-twitter-format-for-hashtags-not-your-regex-not-his-code-the-actual
  pattern: """/(#|＃)([a-z0-9_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253-\u0254\u0256-\u0257\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff\u0500-\u0527\u2de0-\u2dff\ua640-\ua69f\u0591-\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05d0-\u05ea\u05f0-\u05f4\ufb12-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4f\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06de-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u0750-\u077f\u08a2-\u08ac\u08e4-\u08fe\ufb50-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\u200c-\u200c\u0e01-\u0e3a\u0e40-\u0e4e\u1100-\u11ff\u3130-\u3185\ua960-\ua97f\uac00-\ud7af\ud7b0-\ud7ff\uffa1-\uffdc\u30a1-\u30fa\u30fc-\u30fe\uff66-\uff9f\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u3041-\u3096\u3099-\u309e\u3400-\u4dbf\u4e00-\u9fff\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2f800-\u2fa1f]*[a-z_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253-\u0254\u0256-\u0257\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff\u0500-\u0527\u2de0-\u2dff\ua640-\ua69f\u0591-\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05d0-\u05ea\u05f0-\u05f4\ufb12-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4f\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06de-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u0750-\u077f\u08a2-\u08ac\u08e4-\u08fe\ufb50-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\u200c-\u200c\u0e01-\u0e3a\u0e40-\u0e4e\u1100-\u11ff\u3130-\u3185\ua960-\ua97f\uac00-\ud7af\ud7b0-\ud7ff\uffa1-\uffdc\u30a1-\u30fa\u30fc-\u30fe\uff66-\uff9f\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u3041-\u3096\u3099-\u309e\u3400-\u4dbf\u4e00-\u9fff\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2f800-\u2fa1f][a-z0-9_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253-\u0254\u0256-\u0257\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff\u0500-\u0527\u2de0-\u2dff\ua640-\ua69f\u0591-\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05d0-\u05ea\u05f0-\u05f4\ufb12-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4f\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06de-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u0750-\u077f\u08a2-\u08ac\u08e4-\u08fe\ufb50-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\u200c-\u200c\u0e01-\u0e3a\u0e40-\u0e4e\u1100-\u11ff\u3130-\u3185\ua960-\ua97f\uac00-\ud7af\ud7b0-\ud7ff\uffa1-\uffdc\u30a1-\u30fa\u30fc-\u30fe\uff66-\uff9f\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u3041-\u3096\u3099-\u309e\u3400-\u4dbf\u4e00-\u9fff\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2f800-\u2fa1f]*)/gi"""
  # pattern: "/#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/g"
  group: 1
twitter_mention:
  type: "pattern"
  pattern: "/^(?!.*\bRT\b)(?:.+\s)?@\w+/i"
  group: 1
```