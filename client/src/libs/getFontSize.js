function isHTMLElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}

function getFontSize(node) {
  if (!isHTMLElement(node)) {
    throw "Expected type HTMLElement";
  }
  let textLength = node.textContent.length;
  const baseSize = 9;
  if (textLength >= baseSize) {
    textLength = baseSize - 2;
  }
  const fontSize = baseSize - textLength;
  return `${fontSize}vw`;
}

export default getFontSize;
