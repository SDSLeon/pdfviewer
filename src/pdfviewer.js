'use strict'

var PdfViewer = function(opts) {
  this.source = opts.source || ''
  this.onerror = opts.onerror || null
  this.staticHost = opts.staticHost || ''
  this.download = opts.download || ''
  this.language = opts.language || ''
  this.name = opts.name
}

PdfViewer.prototype.embed = function(container) {
  this.container = container

  var iframe = document.createElement('iframe')
  iframe.height = '100%'
  iframe.width = '100%'
  iframe.frameBorder = 'none'
  iframe.src = this.staticHost + '?width=' + container.clientWidth + '&download=' + this.download

  container.innerHTML = ''
  container.appendChild(iframe)
  var win = iframe.contentWindow;

  win['FILE_URL'] = this.source;
  win['FILE_NAME'] = this.name;
  win['PDF_LANGUAGE'] = this.language;
  var self =  this, receiveMessage

  if (typeof self.onerror !== 'function') { return }

  this.receiveMessage = receiveMessage = function (event) {
    var origin = event.origin
    var error  = event.data
    if(self.staticHost.indexOf(origin) == -1) { return }
    self.onerror(error)
    window.removeEventListener('message', receiveMessage, false)
  }

  window.addEventListener('message', receiveMessage, false)

  return this

}

PdfViewer.prototype.destroy = function() {
  if (this.container) {
    this.container.innerHTML = ''
  }
  if (this.receiveMessage) {
    window.removeEventListener('message', this.receiveMessage, false)
  }
}

module.exports = PdfViewer
