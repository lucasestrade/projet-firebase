import { html, render } from "lit-html";

export default class Restaurant {
  constructor(page, postalCode, name) {
    this.postalCode = postalCode;
    this.restaurantName = name;
    this.page = page;
    this.renderView();
  }

  template() {
    return html`
      ${this.restaurantName}
      ${this.postalCode}    
    `
  }

  renderView() {
    const view = this.template();
    render(view, this.page);
  }
}