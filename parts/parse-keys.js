module.exports = function parseKeys (inputQueries, relatedName) {
  return inputQueries.map(inputQuery => {
    return Object.entries(inputQuery).reduce((acc, [key, value]) => {
      if (key === 'related' || key.includes('.')) {
        acc[key] = value
        return acc
      }

      const keyParts = key.split('_')
      const field = relatedName ? `${relatedName}.${keyParts.shift()}` : keyParts.shift()

      const negation = keyParts[0] === 'not'
      if (negation) keyParts.shift()

      const modifier = keyParts.join('_') || 'equals'

      acc[field] = acc[field] || []
      acc[field].push({ value, negation, modifier })

      return acc
    }, {})
  })
}
