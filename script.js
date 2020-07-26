var fontSize = 48

const app = new Vue({
  el: '#app',
  data: {
    defaultTexts: [
      "Making a meme using a commercial image macro creator, with a watermark",
      "Making a meme with Meme Machine"
    ],
    texts: [],
    memes: [],
    currentMeme: {}
  },
  methods: {
    renderImageMacro: function(meme) {
      var img = new Image()
      const ctx = this.ctx
      img.onload = () => {
        canvas.width = img.width * 2
        canvas.height= img.height * 2
        ctx.drawImage(img, 0, 0, img.width * 2, img.height * 2)

        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.strokeWidth = "4px"
        ctx.font = fontSize + "px arial"
        
        ctx.fillStyle = "black"
        ctx.strokeStyle = "none"

        meme['textBoxes'].forEach((box, i) => this.texts[i] && this.boxText(ctx, box, this.texts[i]))
      }
      img.src = meme.src
    },
    boxText: function(ctx, box, text) {
      let words = text.split(" ")
      let lines = [""]
      box = box.map(b=>b*2) // small dpi fix thing
      words.forEach(word => {
        if(ctx.measureText(lines[lines.length-1] + ` ${word}`).width < box[2])
          lines[lines.length-1] += ` ${word}`
        else
          lines.push(word)
      })
      lines.forEach((line, i) => {
        ctx.fillText(line.trim(), box[0], box[1] + (box[3]/2) - (fontSize * (lines.length/2 - i) ))
        ctx.strokeText(line.trim(), box[0], box[1] + box[3]/2 - (fontSize * (lines.length/2 - i) ))
      })
    },
    download: function() {
      var link = document.createElement('a')
      link.href = canvas.toDataURL()
      link.target = "_new"
      document.body.appendChild(link)
      link.click()
      document.body.removeElement(link)
      delete link

    }
  },
  updated: function(e) {
    this.renderImageMacro(this.currentMeme)
  },
  mounted: function() {
    this.ctx = canvas.getContext('2d')

    fetch('memes.json')
    .then(res=>res.json())
    .then(json => {
      this.memes = json
      this.currentMeme = json.drake
      this.texts = this.defaultTexts
    })
  }
})