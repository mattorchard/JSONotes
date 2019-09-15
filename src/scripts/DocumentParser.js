class EntryContainer {
  constructor(key) {
    this.key = key;
    this.value = [];
  }

  addKeyValue(key, value) {
    return this.value.push({key, value});
  }

  addListItem(value) {
    return this.value.push(value);
  }

}

function capitalizeFirst(text) {
  const first = text.substring(0, 1);
  const rest = text.substring(1);
  return first.toUpperCase() + rest;
}

function tokenize(line) {
  if (!line) {
    return {type: "END"};
  }
  if (/:\s*\S/.test(line)) {
    return {
      type: "KEY_VALUE",
      data: [
        capitalizeFirst(line.replace(/\s*:.*$/, "")),
        capitalizeFirst(line.replace(/^.*:\s*/, ""))
      ]
    }
  }
  if (/:/.test(line)) {
    return  {
      type: "START",
      data: capitalizeFirst(line.replace(/\s*:.*$/, ""))
    }
  }
  return {
    type: "LIST_ITEM",
    data: capitalizeFirst(line)
  };

}

function parseTokens(tokens) {
  let lastContainer = new EntryContainer(null);
  const stack = [lastContainer];

  tokens.forEach(({type, data}) => {
    switch(type) {
      case "START": {
        lastContainer = new EntryContainer(data);
        stack.push(lastContainer);
      } break;
      case "LIST_ITEM": {
        lastContainer.addListItem(data);
      } break;
      case "KEY_VALUE": {
        const [key, value] = data;
        lastContainer.addKeyValue(key, value);
      } break;
      case "END": {
        if (stack.length > 1) {
          const {key, value} = stack.pop();
          lastContainer = stack[stack.length - 1];

          const adjustedValue = value && value.length === 1 ? value[0] : value;
          lastContainer.addKeyValue(key, adjustedValue);
        }
      } break;
    }
  });
  // Handles any omitted END tokens from the end of input
  while (stack.length > 1) {
    const {key, value} = stack.pop();
    stack[stack.length - 1].addKeyValue(key, value);
  }
  return stack[0].value;
}


function parseInput(text) {
  const tokens = text.split(/\s*?\n\s*?/).map(tokenize);
  return parseTokens(tokens);
}

export default {parseInput};