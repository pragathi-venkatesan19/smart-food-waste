export function calculateInsights(entries) {
  const totalPrepared = entries.reduce((a,b)=>a+b.prepared,0)
  const totalConsumed = entries.reduce((a,b)=>a+b.consumed,0)
  const totalWaste = totalPrepared - totalConsumed

  const efficiency = totalPrepared > 0
    ? ((totalConsumed/totalPrepared)*100).toFixed(1)
    : 0

  const trendData = entries.map(e => ({
    name: e.foodItem,
    waste: e.waste
  }))

  return {
    totalPrepared,
    totalConsumed,
    totalWaste,
    efficiency,
    trendData
  }
}