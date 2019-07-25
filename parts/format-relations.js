module.exports = function formatRelations (inputQueries, { relations, formatQuery } = {}) {
  return inputQueries.map(inputQuery => {
    Object.keys(inputQuery).forEach(key => {
      const keyParts = key.split('_')

      const relation = keyParts.shift()
      const modifier = keyParts.join('_') || 'equals'

      if (relations.includes(relation)) {
        inputQuery.related = inputQuery.related || {}

        inputQuery.related[relation] = { value: formatQuery(inputQuery[key], relation), modifier }
        delete inputQuery[key]
      }
    })
    return inputQuery
  })
}
