# Hash API

## Tecnologies
Loopback
MongoDB

## Usage

### Find

**Find a tweet that contains a hashtag with match a minimum of array of string**

    API_URL/v1/tweets?filter=FILTER

_FILTER_

    {
      "where": { 
        "status.entities.hashtags.text": { 
          "inq": ["G1", "G2"] 
        } 
      } 
    }

For more information about filter see [Loopback documentation about Querying data](https://docs.strongloop.com/display/public/LB/Querying+data)

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

### Metrics

    API_URL/v1/tweets/metrics?type=TYPE&filter=FILTER

_TYPE_

 - top-retweets
 - top-mentions
 - top-urls
 - top-images
 - top-hashtags
 - top-users
 - retweet-count
 - word (not implemented)

_FILTER_

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
      },
      "limit": 25,
      "skip": 0
    }

_where['status.created_at'].gte_ and _where['status.created_at'].lte_ is required.
_limit_ and _skip_ is for pagination but is't required, default values is _limit: 25_ and _skip: 0_

**Example: Top Retweets by Date Range**

    API_URL/v1/tweets/metrics?type=retweet&filter={ "where": { "status.created_at": { "gte": "2015-08-23T15:30", "lte": "2015-08-23T15:45" } }, "limit": 25, "skip": 0 }

**Example: Top Retweets by Theme and Date Range**

    API_URL/v1/tweets/metrics?type=retweet&filter={ "where": { "status.created_at": { "gte": "2015-08-23T15:30", "lte": "2015-08-23T15:45" }, "theme": "negros" }, "limit": 25, "skip": 0 }

**Example: Top Retweets by Categories and Date Range**

    API_URL/v1/tweets/metrics?type=retweet&filter={ "where": { "status.created_at": { "gte": "2015-08-23T15:30", "lte": "2015-08-23T15:45" }, "categories": { "inq": ["perfil", "conteudo"] } }, "limit": 25, "skip": 0 }

**Example: Top Retweets by Theme, Categories and Date Range**

    API_URL/v1/tweets/metrics?type=retweet&filter={ "where": { "status.created_at": { "gte": "2015-08-23T15:30", "lte": "2015-08-23T15:45" }, "theme": "negros", "categories": { "inq": ["perfil", "conteudo"] } }, "limit": 25, "skip": 0 }

**Pagination**
  
To make pagination just change _limit_ and _skip_ properties. Ex.: first page is _limit: 25, skip: 0_, next page is _limit: 50, skip: 25_, and so on.