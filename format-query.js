const cloneDeep = require('lodash.clonedeep')

const formatOr = require('./parts/format-or')
const formatAnd = require('./parts/format-and')
const validateRelations = require('./parts/validate-relations')
const formatRelations = require('./parts/format-relations')
const parseKeys = require('./parts/parse-keys')

module.exports = function (relations) {
  return function formatQuery (inputQuery, relatedName) {
    if (!inputQuery) return inputQuery

    let queries = formatOr(cloneDeep(inputQuery))
    queries = formatAnd(queries)
    validateRelations(queries, { relations })
    queries = formatRelations(queries, { relations, formatQuery })
    queries = parseKeys(queries, relatedName)

    return queries
  }
}
