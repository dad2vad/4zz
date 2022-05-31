async function sendMessage(token, {chat_id, ...messageBody}) {
  if(!chat_id) {
    throw new Error("chat_id may not be null"); 
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({chat_id, ...messageBody})
  });
  return await res.json();
}

var _handlers

export function Bot(token) {
  _handlers = []

  this.on = (event: string, callback: (req: any, res: any) => boolean) => {
      _handlers.push({event, callback })
  },
  this.handle = (update):boolean => {
    _handlers.forEach(h => {

      // 'message' event
      if(h.event === 'message') {
        const res = {
          sendMessage: (message) => {
            return sendMessage(token, message);
          } ,
          // sendPhoto,
          // send....
        }
        h.callback(update.message, res);  
      }
    })
    return true;
  } 
}
