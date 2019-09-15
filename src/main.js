document.addEventListener("DOMContentLoaded", () => {
const inputArea = document.querySelector("#inputArea");
const visualOutput = document.querySelector("#visualOutput");
const visualOutputPanel = visualOutput.closest(".panel");

class EntryContainer {
    constructor(key) {
        this.key = key;
        this.map = new Map();
        this.array = [];
    }

    addKeyValue(key, value) {
        return this.map.set(key, value);
    }

    addListItem(value) {
        return this.array.push(value);
    }

    getArrayKeyName(base="Other") {
        if (!(base in this.map)) {
            return base;
        }
        for (let i = 1; i < 100; i++) {
            const key = `${base} (${i})`;
            if (!(key in this.map)) {
                return key;
            }
        }
        console.warn("Tried 100 different names, but all were taken");
        return base;
    }

    get value() {
        const hasKeyValues = this.map.size > 0;
        const hasListItems = this.array.length > 0;
        
        if (hasKeyValues && hasListItems) {
            this.map.set(this.getArrayKeyName(), this.array);
            return this.map;
        } else if (hasListItems) {
            return this.array;
        } else if (hasKeyValues) {
            return this.map;
        } else {
            return null;
        }
    }
}

function scrollToStart(element) {
    element.scrollTo(0, 0);
}

function scrollToEnd(element) {
    element.scrollTo(element.scrollHeight, element.scrollHeight);
}


function debounce(callback, delay=100) {
    let timeoutId = null;
    return function() {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        const that = this;
        const args = arguments;
        timeoutId = setTimeout(() => callback.apply(that, args), delay);
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

function createDataTree(tokens) {
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
    return createDataTree(tokens);
}

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

function compile() {
     try {
        const data = parseInput(inputArea.value);
        inputArea.setCustomValidity("");

        visualOutput.innerHTML = render(data);
    } catch (error) {
        inputArea.setCustomValidity("Invalid input");
        console.error(error);
    }
 }

 function syncScroll(element, buffer=10) {
    const {value, selectionEnd} = element;
    if (selectionEnd < buffer) {
        scrollToStart(visualOutputPanel)
    }
    if (value.length - selectionEnd < buffer) {
        scrollToEnd(visualOutputPanel);
    }
 }

function handleInput(event) {
    compile();
    syncScroll(event.target);
}

function saveInput(event) {
    const {value} = event.target;
    localStorage.setItem("offline-document", value);
}

function loadInput(element) {
    element.value = localStorage.getItem("offline-document") || element.value;
}


inputArea.addEventListener("input", debounce(handleInput));
inputArea.addEventListener("input", debounce(saveInput, 1000));
loadInput(inputArea);
compile();

});