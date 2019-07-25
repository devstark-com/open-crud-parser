module.exports = function formatAnd (inputQueries) {
  let queries = []

  inputQueries.forEach(inputQuery => {
    if (!inputQuery.AND) {
      queries.push(inputQuery)
      return
    }

    const andContent = inputQuery.AND
    delete inputQuery.AND

    queries.push(andContent.reduce((query, andArg) => {
      query = { ...query, ...andArg }
      return query
    }, inputQuery))
  })

  queries = queries.map(query => {
    if (query.AND) return formatAnd(query)
    else return query
  })

  return queries
}
