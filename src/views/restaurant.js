import { html, render } from "lit-html";

export default class Restaurant {
  constructor(page, id) {
    this.restaurantId = id;
    this.page = page;
    this.renderView();
  }

  template() {
    return html`
      ${this.restaurantId}   
    `
  }

  renderView() {
    const view = this.template();
    render(view, this.page);
  }
}