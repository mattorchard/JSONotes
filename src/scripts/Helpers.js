function capitalizeFirst(text) {
  const first = text.substring(0, 1);
  const rest = text.substring(1);
  return first.toUpperCase() + rest;
}

const isType = type =>
  value =>
    Object.prototype.toString.call(value) === `[object ${type}]`;

const isString = isType("String");


export {capitalizeFirst, isType, isString};