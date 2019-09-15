class ThemeRepository {
  constructor(element) {
    this.themeRoot = element.closest(".theme-root");
    this.theme = JSON.parse(localStorage.getItem("theme")) || {};
    this.applyTheme();
  }

  applyTheme() {
    Object.entries(this.theme).forEach(([property, value]) => {
      this.applyProperty(property, value);
      this.themeRoot.querySelectorAll(`[name=${property}]`)
        .forEach(input => input.value = value);
    });
  }

  applyProperty(propertyName, value) {
    this.themeRoot.style.setProperty(`--theme-${propertyName}`, value);
  }

  propertyChanged(propertyName, value) {
    this.applyProperty(propertyName, value);
    this.theme[propertyName] = value;
    localStorage.setItem("theme", JSON.stringify(this.theme));
  }
}

export default ThemeRepository;