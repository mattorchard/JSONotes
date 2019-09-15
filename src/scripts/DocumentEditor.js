import DocumentParser from "./DocumentParser";
import DocumentView from "./DocumentView";

const scrollToStart = element => element.scrollTo(0, 0);
const scrollToEnd = element => element.scrollTo(element.scrollHeight, element.scrollHeight);

function syncScroll(textarea, elementToSync, buffer=10) {
  const {value, selectionEnd} = textarea;
  if (selectionEnd < buffer) {
    scrollToStart(elementToSync)
  }
  if (value.length - selectionEnd < buffer) {
    scrollToEnd(elementToSync);
  }
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

function compile(inputElement, outputElement) {
  try {
    const parsedDoc = DocumentParser.parseInput(inputElement.value);
    inputElement.setCustomValidity("");

    outputElement.innerHTML = DocumentView.render(parsedDoc);
  } catch (error) {
    inputElement.setCustomValidity("Invalid input");
    console.error(error);
  }
}


function attachEditor(inputElement, outputElement, outputScrollElement) {

  const handleInput = event => {
    compile(inputElement, outputElement);
    syncScroll(event.target, outputScrollElement);
  };

  const saveInput = event =>
    localStorage.setItem("offline-document", event.target.value);

  const loadInput = element =>
    element.value = localStorage.getItem("offline-document") || element.value;

  inputElement.addEventListener("input", debounce(handleInput));
  inputElement.addEventListener("input", debounce(saveInput, 1000));

  loadInput(inputElement);
  compile(inputElement, outputElement);
}

export default {attachEditor}