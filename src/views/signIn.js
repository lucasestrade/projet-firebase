import { html, render } from "lit-html";
import { loginAction } from "../actions/login.js";

export default class SignIn {
  constructor(page) {
    this.page = page;
    this.renderView();
    this.onSubmit();
  }

  template() {
    return html`
      <form id="form-login">
        <input type="email" value="zsdf@ff.fr" class="field" placeholder="Entrer un mail" />
        <input type="password" class="field" placeholder="Entrer un mot de passe" />
        <button type="submit" class="cta" >Se connecter</button>
      </form>    
    `
  }

  onSubmit() {
    document.getElementById("form-login").addEventListener("submit", function(event){
      event.preventDefault();
      let mail = this.firstElementChild.value;
      let password = this[1].value;
      loginAction(mail, password);
    })
  }

  renderView() {
    const view = this.template();
    render(view, this.page);
  }
}