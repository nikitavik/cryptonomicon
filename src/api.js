const API_KEY =
    "3a9939c71614aa7ead54d731e2a9a43b498ffaa7897eaa5cb884257b3297e3b9";

const tickersHandlers = new Map()
export const loadTickers = () => {
    if (tickersHandlers.size === 0) {return}
    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()]}&tsyms=USD&api_key=${API_KEY}`
    ).then(
        r => r.json()
    ).then(rawData => {
        const updatedPrices = Object.fromEntries(
            Object
              .entries(rawData)
              .map(([key, value]) => [key, value.USD])
            )
            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) || []
                handlers.forEach(
                  (fn) => fn(newPrice)
                )
            })
        })
};
export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
}
export const unsubscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker)
}
setInterval(loadTickers, 5000)
// Refactor with URL search params
window.tickers = tickersHandlers