const formatQuery = require('./format-query')
const formatOrderBy = require('./format-order-by')

module.exports = function openCrudParser (relations) {
  return {
    formatQuery: formatQuery(relations),
    formatOrderBy
  }
}
