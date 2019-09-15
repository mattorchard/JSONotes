const isType = type =>
  value =>
    Object.prototype.toString.call(value) === `[object ${type}]`;

const isString = isType("String");

function render(value, depth=0) {
  if (!value) {
    return "null";
  }
  if (isString(value)) {
    return value;
  }
  if (Array.isArray(value)) {
    const children = value.map(item => `<li>${render(item, depth + 1)}</li>`);
    return `<ul>${children.join("")}</ul>`
  }
  if ("key" in value && "value" in value) {
    
    return `<strong>${value.key}</strong><div>${render(value.value, depth + 1)}</div>`
  }
}

export default {render};