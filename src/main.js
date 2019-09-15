import ThemeRepository from "./scripts/ThemeRepository";
import DocumentEditor from "./scripts/DocumentEditor";

const themeForm = document.querySelector("#themeForm");
const themeRepo = new ThemeRepository(themeForm);

themeForm.addEventListener("input", event => {
    const {value, name} = event.target;
    themeRepo.propertyChanged(name, value);
});


const inputArea = document.querySelector("#inputArea");
const visualOutput = document.querySelector("#visualOutput");
const visualOutputPanel = visualOutput.closest(".panel");
DocumentEditor.attachEditor(inputArea, visualOutput, visualOutputPanel);