/* global NSEvent, NSHeight, NSScreen */

import BrowserWindow from 'sketch-module-web-view'
import UI from 'sketch/ui'
import math from 'mathjs'

//= =====================
// Helpers
//= =====================
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

function getElementAttributes(layer) {
  return {
    x: layer.absoluteRect().rulerX(),
    y: layer.absoluteRect().rulerY(),
    width: layer.frame().width(),
    height: layer.frame().height(),
  }
}

//= =====================
// Updates
//= =====================
const updateMethodList = {
  x: updateAttributeX,
  y: updateAttributeY,
  height: updateAttributeHeight,
  width: updateAttributeWidth,
}

function updateAttributeHeight(layer, num) {
  layer.frame().setHeight(num)
}

function updateAttributeWidth(layer, num) {
  layer.frame().setWidth(num)
}

function updateAttributeY(layer, num) {
  layer.absoluteRect().setRulerY(num)
}

function updateAttributeX(layer, num) {
  layer.absoluteRect().setRulerX(num)
}

//= =====================
// Main
//= =====================
export default function(context) {
  if (!context.selection) {
    return
  }

  const selection = context.selection

  // Error: Select element!
  if (selection.length <= 0) {
    UI.message('You need select a element')
    return
  }

  const point = getMousePosition()
  const options = {
    identifier: 'sketch-pochette.frames',
    x: point.x,
    y: point.y,
    width: 170,
    height: 100,
    show: false,
    alwaysOnTop: true,
    maximizable: false,
    title: ' ',
    minimizable: false,
    vibrancy: 'popover',
    hasShadow: true,
    resizable: false,
    // frame: false
  }

  let browserWindow = new BrowserWindow(options)
  const webContents = browserWindow.webContents

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
    let result = 0

    try {
      result = math.eval(num)
    } catch (error) {
      this.loadProperties()
      return
    }

    const updateAttribute = updateMethodList[attribute]

    for (let i = 0; i < selection.count(); i++) {
      const layer = selection.objectAtIndex(i)
      updateAttribute(layer, result)
    }

    this.loadProperties()
  })

  webContents.on('loadSelectElements', s => {
    this.loadProperties()
  })

  this.loadProperties = () => {
    const object = []
    for (let i = 0; i < selection.count(); i++) {
      const layer = selection.objectAtIndex(i)
      object.push(getElementAttributes(layer))
    }

    webContents.executeJavaScript(`writeNotes(${JSON.stringify(object)})`)
  }

  browserWindow.loadURL(require('../resources/webview.html'))
}
