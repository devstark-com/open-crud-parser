
module.exports = function validateRelations (inputQueries, { relations } = {}) {
  inputQueries.forEach(query => {
    let invalidRelationsQueryRequest = false

    invalidRelationsQueryRequest = Object.keys(query)
      .map(key => key.split('_')[0])
      .sort()
      .some((field, i, arr) => field === arr[i + 1] && relations.includes(field))

    if (invalidRelationsQueryRequest) throw new Error('Different modifiers for one relation are not allowed')
  })
}
