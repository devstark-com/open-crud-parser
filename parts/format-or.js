module.exports = function formatOr (inputQuery) {
  if (!inputQuery.OR) return [inputQuery]

  const orContent = inputQuery.OR
  delete inputQuery.OR

  let queries = orContent.map(query => {
    return { ...inputQuery, ...query }
  })

  queries = queries.reduce((acc, query) => {
    if (query.OR) acc.push(...formatOr(query))
    else acc.push(query)

    return acc
  }, [])

  return queries
}
