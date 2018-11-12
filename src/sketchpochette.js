import BrowserWindow from "sketch-module-web-view";
import UI from "sketch/ui";

//======================
// Helpers
//======================
function mouseInCanvasViewForDocument(document) {
  var mouseInWindow = document
    .documentWindow()
    .convertScreenToBase(NSEvent.mouseLocation());
  return document.contentDrawView().convertPoint_fromView(mouseInWindow, null);
}

function CGPointToObject(point) {
  return {
    x: point.x.doubleValue() + 75,
    y: point.y.doubleValue()
  };
}

function getElementAttributes(layer) {
  return {
    x: layer.absoluteRect().rulerX(),
    y: layer.absoluteRect().rulerY(),
    width: layer.frame().width(),
    height: layer.frame().height()
  };
}

//======================
// Updates
//======================
const updateMethodList = {
  x: updateAttributeX,
  y: updateAttributeY,
  height: updateAttributeHeight,
  width: updateAttributeWidth
};

function updateAttributeHeight(layer, num) {
  layer.frame().setHeight(num);
}

function updateAttributeWidth(layer, num) {
  layer.frame().setWidth(num);
}

function updateAttributeY(layer, num) {
  layer.absoluteRect().setRulerY(num);
}

function updateAttributeX(layer, num) {
  layer.absoluteRect().setRulerX(num);
}

//======================
// Main
//======================
export default function(context) {
  if (!context.selection) {
    return;
  }

  const selection = context.selection;

  // Error: Select element!
  if (selection.length <= 0) {
    UI.message("You need select a element");
    return;
  }

  const point = CGPointToObject(mouseInCanvasViewForDocument(context.document));
  const options = {
    identifier: "unique.id",
    x: point.x,
    y: point.y,
    width: 170,
    height: 110,
    show: false,
    alwaysOnTop: true,
    maximizable: false,
    title: " ",
    minimizable: false,
    vibrancy: "popover",
    hasShadow: true,
    resizable: false
    //frame: false
  };

  let browserWindow = new BrowserWindow(options);
  const webContents = browserWindow.webContents;

  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
  });

  browserWindow.on("blur", () => {
    webContents.executeJavaScript("unload()");
    browserWindow.close();
  });

  browserWindow.on("closed", () => {
    browserWindow = null;
  });

  //Handlers
  webContents.on("updateElements", (attribute, num) => {
    if (typeof parseInt(num) != "number") {
      return;
    }

    const updateAttribute = updateMethodList[attribute];

    for (var i = 0; i < selection.count(); i++) {
      const layer = selection.objectAtIndex(i);
      updateAttribute(layer, num);
    }
  });

  webContents.on("loadSelectElements", s => {
    const object = [];
    for (var i = 0; i < selection.count(); i++) {
      const layer = selection.objectAtIndex(i);
      object.push(getElementAttributes(layer));
    }

    webContents.executeJavaScript("writeNotes(" + JSON.stringify(object) + ")");
  });

  browserWindow.loadURL(require("../resources/webview.html"));
}
