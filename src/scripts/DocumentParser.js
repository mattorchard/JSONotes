import {capitalizeFirst, isString} from "./Helpers";

class EntryContainer {
  constructor(key) {
    this.key = key;
    this.value = [];
    this.isLeaf = true;
  }

  addKeyValue(key, value) {
    this.isLeaf = false;
    return this.value.push({key, value});
  }

  addListItem(value) {
    this.isLeaf = this.isLeaf && isString(value);
    return this.value.push(value);
  }

  addEntryContainer(entryContainer) {
    this.isLeaf = false;
    return this.value.push(entryContainer)
  }
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
          const finishedContainer = stack.pop();
          lastContainer = stack[stack.length - 1];
          lastContainer.addEntryContainer(finishedContainer);
        }
      } break;
    }
  });
  // Handles any omitted END tokens from the end of input
  while (stack.length > 1) {
    const finishedContainer = stack.pop();
    stack[stack.length - 1].addEntryContainer(finishedContainer);
  }
  return stack[0].value;
}


function parseInput(text) {
  const tokens = text.split(/\s*?\n\s*?/).map(tokenize);
  return parseTokens(tokens);
}

export default {parseInput};