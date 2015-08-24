# Hash API

## Tecnologies
Loopback
MongoDB

## Usage

### Find

**Find a tweet that contains a hashtag with match a minimum of array of string**

    API_URL/v1/tweets?filter=FILTER

    // FILTER
    {
      "where": { 
        "status.entities.hashtags.text": { 
          "inq": ["G1", "G2"] 
        } 
      } 
    }

### Count

    API_URL/v1/tweets/count?where=WHERE

**Count tweets with categorie "conteudo-estupro"**

    // WHERE
    {
      "categories": {
        "inq": ["conteudo-estupro"]
      }
    }

**Count tweets with categorie "conteudo-estupro" and on a time range**

    // WHERE NOT WORK
    {
      "categories": {
        "inq": ["conteudo-estupro"]
      },
      "status.created_at": { 
        "gte": "2015-08-12T00:00:00.000Z",
        "lte": "2015-08-19T00:00:00.000Z"
      }
    }

or
    // WHERE NOT WORK
    {
      "and": [
        {
          "categories": {
            "inq": ["conteudo-estupro"]
          }
        },
        {
          "status.created_at": { 
            "gte": "2015-08-12T00:00:00.000Z",
            "lte": "2015-08-19T00:00:00.000Z"
          }
        }
      ]
    }

### Top

    API_URL/v1/tweets/top?type=TYPE&filter=FILTER

#### type
 - retweet
 - mention
 - url
 - image
 - hashtag
 - user (not implement)
 - word (not implement)

    // FILTER
    { 
      "where": { 
        "status.created_at": { 
          "gte": "2015-08-23T15:30", 
          "lte": "2015-08-23T15:45" 
        }, 
        "theme": "negros", 
        "categories": { 
          "inq": ["perfil", "conteudo"] 
        } 
      }
    }

