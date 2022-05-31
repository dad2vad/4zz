//import { app } from "./app"
import puppeteer from "https://deno.land/x/puppeteer_plus/mod.ts"

var puu = async () => {
    
    
  
    var ibb = (image) => {
      var details = {
        image: image.split(",")[1] || image.split(",")[0],
      }
      var formBody = []
      for (var property in details) {
        var encodedKey = encodeURIComponent(property)
        var encodedValue = encodeURIComponent(details[property])
        formBody.push(encodedKey + "=" + encodedValue)
      }
      formBody = formBody.join("&")
      return fetch(
        `https://api.imgbb.com/1/upload?key=af7cad64d90d19e2a26889f92f6b3ed8`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: formBody,
        }
      )
        .then((data) => data.json)
        .catch((err) => {
    console.log(err)
})
        //.then((r) => r.data)
    }
  
    
  
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto("https://danube-webshop.herokuapp.com", {
      waitUntil: "networkidle2",
    })
    var rr = await page.screenshot({ encoding: "base64", fullPage: true })
    rr = await ibb(rr)
  
    console.log(rr)
  
    await browser.close()
  }


export default async r => {

//console.info(r)

    var req = await r.json()


        
    
 //
 //await app(req)

    req[Object.keys(req)[1]].type = Object.keys(req)[1]
    req = req[Object.keys(req)[1]]
    req.from = req.chat || req.from
    req.chat = req.from.id
    req.from = req.from.username || req.from.title || req.from.first_name

if (req.text && req.text.startsWith(".")) {
  req.ref = req.text.replace(".", "")
  delete req.text
}

    if (req.entities && req.text) {
        req.entities.forEach((element) => {
            if (element.type === "text_link") {
                req.url = element.url
            } else {
                req[element.type] = req.text.substring(element.offset, (element.offset + element.length))
                if (req.text === req[element.type]) {
                    delete req.text
                }
            }
        })
        delete req.entities
    }
        if (req.document && req.document.mime_type.startsWith("image")) {
        req.photo = [{
            file_size: req.document.file_size,
            file_id: req.document.file_id
        }]
        delete req.document
    }
            if (req.sticker) {
        req.photo = [{
            file_size: req.sticker.file_size,
            file_id: req.sticker.file_id
        }]
        delete req.sticker
    }
    if (req.photo) {
        //  var t = ""
        // if(req.caption) t += `b_rgb:21211f,c_fit,co_white,fl_relative,g_north,l_text:Yanone%20Kaffeesatz_50_center:${req.caption.toUpperCase().replace(/ /g, '%20').replace(/,/g, '%20')},w_960/`
        if (!req.caption) {
            await puu()
            req.caption = ""
        } else {
            req.caption = req.caption.toLowerCase()
        }
        req.photo = req.photo[req.photo.length - 1]
        req.width = req.photo.width
        req.photo = await fetch('https://api.telegram.org/bot' + Deno.env.get("TOKEN") + '/getFile?file_id=' + req.photo.file_id)
            .then(r => r.json())
            .then(r => {
                return 'https://api.telegram.org/file/bot' + Deno.env.get("TOKEN") + '/' + r.result.file_path
            })

        
    }
    if (req.location && !req.id && !req.result_id) {
        req.location = req.location.latitude.toFixed(5) + "," + req.location.longitude.toFixed(5)
    }


console.info(req)
// delete req.forward_from
// delete req.forward_date

  
}

// const upd = _upd()

// export default upd