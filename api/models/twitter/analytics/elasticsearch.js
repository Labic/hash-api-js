const format = require('util').format
const debug = require('debug')('hashapi:twitter:analytics:elasticsearch:mostCommonTerms')

const _ = require('../../../lib/underscoreExtended');

function mostCommonTerms(client, params, cb) { 
  let body = {
    size: 0,
    query: {
      bool: {
        must: []
      },
      terms: {},
    },
    aggregations: {
      most_common_terms: {
        terms: {
          field: 'status.text.brazilian',
          size: params.perPage * params.page,
        }
      }
    }
  }

  body.query.bool.must.push({
    range: {
      'status.created_at': {
        gte: params.since.getTime(),
        lte: params.until.getTime()
      }
    }
  })

  if (params.filter.tags) {
    if (params.filter.tags.with)
      body.query.bool.must.push({ 
        terms: { 'keywords': params.filter.tags.with } 
      })

    if (params.filter.tags.contains)
      body.query.terms['keywords'] = params.filter.tags.contains
  }

  if (params.filter.hashtags)
    body.query.bool.must.push({ 
      terms: { 'status.entities.hashtags.text': params.filter.hashtags } 
    })

  if (params.filter.mentions)
    body.query.bool.must.push({ 
      terms: { 'status.entities.user_mentions.screen_name': params.filter.mentions } 
    })

  if (params.filter.users)
    body.query.bool.must.push({ 
      terms: { 'status.user.screen_name': params.filter.users }
    })

  if (params.filter.retweeted)
    body.query.bool.must.push({ 
      exists: { field: 'status.retweeted_status' }
    })

  if (params.filter.quoted)
    body.query.bool.must.push({ 
      exists: { field: 'status.quoted_status' }
    })

  if (params.filter.replay)
    body.query.bool.must.push({ 
      exists: { field: 'status.in_reply_to_status_id_str' }
    })

  if (_.isBoolean(params.filter.blocked))
    body.query.bool.must.push({ term: { 'block': params.filter.blocked } })

  client.search({
    index: 'twitter',
    type: 'statuses',
    routing: params.project,
    _source: false,
    body: body,
  }, (err, resp) => {
    if (err) return cb(err)
    
    return cb(null, resp.aggregations.most_common_terms.buckets)
  })
}

exports.mostCommonTerms = mostCommonTerms