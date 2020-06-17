import { html, render } from "lit-html";

export default class Home {
  constructor(page) {
    this.page = page;
    this.renderView();
  }

  template() {
    return html`
      bbbb
    `
  }

  renderView() {
    const view = this.template();
    render(view, this.page);
  }
}