/* global document, window */

// Disable the context menu to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

window.postMessage('loadSelectElements', 'Called from the webview')

// Less Hardcore :(
window.writeNotes = function(content) {
  let xValue = content[0].x
  let yValue = content[0].y
  let widthValue = content[0].width
  let heightValue = content[0].height
  content.forEach(item => {
    xValue = xValue === item.x ? xValue : 'Multiple'
    yValue = yValue === item.y ? yValue : 'Multiple'
    widthValue = widthValue === item.width ? widthValue : 'Multiple'
    heightValue = heightValue === item.height ? heightValue : 'Multiple'
  })

  document.getElementById('posx').value = xValue
  document.getElementById('posy').value = yValue
  document.getElementById('width').value = widthValue
  document.getElementById('height').value = heightValue
}

window.unload = function() {
  document.getElementById('posx').blur()
  document.getElementById('posy').blur()
  document.getElementById('width').blur()
  document.getElementById('height').blur()
}

function arrowKeys(e, prop) {
  const keyCode = e.keyCode || e.which
  if ((keyCode == 38 || keyCode == 40) && e.target.value != 'Multiple') {
    let value = Number(e.target.value)
    const mod = {
      38: 1,
      40: -1,
    }

    value += mod[keyCode]
    if (e.shiftKey) value = mod[keyCode] > 0 ? value + 9 : value - 9
    window.postMessage('updateElements', prop, value)

    e.preventDefault()
    return false
  }
}

// Listeners
document.getElementById('posx').addEventListener('change', e => {
  window.postMessage('updateElements', 'x', e.target.value)
})

document.getElementById('posy').addEventListener('change', e => {
  window.postMessage('updateElements', 'y', e.target.value)
})

document.getElementById('width').addEventListener('change', e => {
  window.postMessage('updateElements', 'width', e.target.value)
})

document.getElementById('height').addEventListener('change', e => {
  window.postMessage('updateElements', 'height', e.target.value)
})

document.getElementById('posx').addEventListener('keydown', e => {
  arrowKeys(e, 'x')
})

document.getElementById('posy').addEventListener('keydown', e => {
  arrowKeys(e, 'y')
})

document.getElementById('width').addEventListener('keydown', e => {
  arrowKeys(e, 'width')
})

document.getElementById('height').addEventListener('keydown', e => {
  arrowKeys(e, 'height')
})
