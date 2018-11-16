/* global NSEvent, NSHeight, NSScreen */

import BrowserWindow from 'sketch-module-web-view'
import sketch from 'sketch'
import math from 'mathjs'

// ======================
// Helpers
// ======================
function getMousePosition() {
  const mainScreenRect = NSScreen.screens()
    .firstObject()
    .frame()
  const point = NSEvent.mouseLocation()
  return {
    x: point.x.doubleValue(),
    // the mouse coordinate starts from the bottom instead of the top
    y: NSHeight(mainScreenRect) - point.y.doubleValue(),
  }
}

function loadAndSendProperties(selection, webContents) {
  const frames = selection.map(layer => layer.frame.toJSON())
  webContents.executeJavaScript(`writeNotes(${JSON.stringify(frames)})`)
}

// ======================
// Main
// ======================
export default function() {
  const document = sketch.getSelectedDocument()
  if (!document) {
    return
  }

  const selection = document.selectedLayers

  // Error: Select element!
  if (selection.length <= 0) {
    sketch.UI.message('You need select a element')
    return
  }

  const point = getMousePosition()
  const options = {
    identifier: 'sketch-pochette.frames',
    x: point.x + 30,
    y: point.y,
    width: 170,
    height: 80,
    show: false,
    alwaysOnTop: true,
    title: ' ',
    vibrancy: 'popover',
    hasShadow: true,
    resizable: false,
    frame: false,
  }

  let browserWindow = new BrowserWindow(options)
  browserWindow.loadURL(require('../resources/webview.html'))

  const { webContents } = browserWindow

  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  browserWindow.on('blur', () => {
    webContents.executeJavaScript('unload()')
    browserWindow.close()
  })

  browserWindow.on('closed', () => {
    browserWindow = null
  })

  // Handlers
  webContents.on('updateElements', (attribute, num) => {
    try {
      const result = math.eval(num)
      selection.forEach(layer => {
        // eslint-disable-next-line
        layer.frame[attribute] = result
      })
    } catch (error) {
      console.error(error)
    }

    loadAndSendProperties(selection, webContents)
  })

  webContents.on('loadSelectElements', () => {
    loadAndSendProperties(selection, webContents)
  })
}
