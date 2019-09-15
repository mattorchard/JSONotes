function isMap(value) {
  return Object.prototype.toString.call(value) === "[object Map]"
}

function renderMap(map, depth=0) {
  return `<dl style="--depth: ${depth}">
        ${[...map.entries()].map(([key, value]) =>
    `<dt>${key}</dt>
            <dd>${render(value, depth + 1)}</dd>`
  ).join("")}
    </dl>`;
}

function renderArray(array, depth=0) {
  return `<ul style="--depth: ${depth}">
        ${array.map(item =>
    `<li>${item}</li>`
  ).join("")}
    </ul>`;
}

function render(value, depth=0) {
  if (!value) {
    return "null";
  }
  if (Array.isArray(value)) {
    return renderArray(value, depth);
  }
  if (isMap(value)) {
    return renderMap(value, depth);
  }
  return value;
}

export default {render};