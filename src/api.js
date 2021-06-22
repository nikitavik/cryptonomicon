const API_KEY =
    "3a9939c71614aa7ead54d731e2a9a43b498ffaa7897eaa5cb884257b3297e3b9";
const AGGREGATE_INDEX = "5"

const tickersHandlers = new Map()
const socket =  new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
    )
socket.addEventListener("message", e => {
    const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data)

    if (type !== AGGREGATE_INDEX || !newPrice){
        return;
    }
    const handlers = tickersHandlers.get(currency) ?? []
    handlers.forEach(
      (fn) => fn(newPrice)
    )
})
function sendToWebSocket(message) {
    const stringifiedMsg =JSON.stringify(message)
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMsg)
        return
    }
    socket.addEventListener("open", ()=> socket.send(stringifiedMsg), {once:true})
}
function subscribeToTickerOnWs(ticker) {
    sendToWebSocket(
      {
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~USD`]
      }
    )
}
function unsubscribeToTickerOnWs(ticker) {
    sendToWebSocket(
      {
          "action": "SubRemove",
          "subs": [`5~CCCAGG~${ticker}~USD`]
      }
    )
}
export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
    subscribeToTickerOnWs(ticker)
}
export const unsubscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker)
    unsubscribeToTickerOnWs(ticker)
}
// TODO EXPAND WEBSOCKET INTERFACE














// HTTP
//
// export const loadTickers = () => {
//     if (tickersHandlers.size === 0) {return}
//     fetch(
//         `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()]}&tsyms=USD&api_key=${API_KEY}`
//     ).then(
//         r => r.json()
//     ).then(rawData => {
//         const updatedPrices = Object.fromEntries(
//             Object
//               .entries(rawData)
//               .map(([key, value]) => [key, value.USD])
//             )
//             Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
//                 const handlers = tickersHandlers.get(currency) || []
//                 handlers.forEach(
//                   (fn) => fn(newPrice)
//                 )
//             })
//         })
// };
// setInterval(loadTickers, 5000)
// window.tickers = tickersHandlers
