module.exports = function formatOrderBy (inputOrders) {
  if (!inputOrders) return inputOrders

  if (!Array.isArray(inputOrders)) inputOrders = [inputOrders]

  return inputOrders.map(o => {
    const [column, order] = o.split('_')
    return { column, order }
  })
}
