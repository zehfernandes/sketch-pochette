// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

window.postMessage("loadSelectElements", "Called from the webview");

//Less Hardcore :(
window.writeNotes = function(content) {
  let xValue = content[0].x;
  let yValue = content[0].y;
  let widthValue = content[0].width;
  let heightValue = content[0].height;
  content.forEach(item => {
    xValue = xValue === item.x ? xValue : "Multiple";
    yValue = yValue === item.y ? yValue : "Multiple";
    widthValue = widthValue === item.width ? widthValue : "Multiple";
    heightValue = heightValue === item.height ? heightValue : "Multiple";
  });

  document.getElementById("posx").value = xValue;
  document.getElementById("posy").value = yValue;
  document.getElementById("width").value = widthValue;
  document.getElementById("height").value = heightValue;
};

window.unload = function() {
  document.getElementById("posx").blur();
  document.getElementById("posy").blur();
  document.getElementById("width").blur();
  document.getElementById("height").blur();
};

function isNumberKey(evt) {
  let charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode != 46 && (charCode < 48 || charCode > 57)))
    return false;
  return true;
}

// Listeners
document.getElementById("posx").addEventListener("change", e => {
  window.postMessage("updateElements", "x", e.target.value);
});

document.getElementById("posy").addEventListener("change", e => {
  window.postMessage("updateElements", "y", e.target.value);
});

document.getElementById("width").addEventListener("change", e => {
  window.postMessage("updateElements", "width", e.target.value);
});

document.getElementById("height").addEventListener("change", e => {
  window.postMessage("updateElements", "height", e.target.value);
});
