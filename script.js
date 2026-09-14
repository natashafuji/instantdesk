const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

if (menu && nav) {
  menu.onclick = () => nav.classList.toggle("open");
  nav.onclick = () => nav.classList.remove("open");
}

const form = document.querySelector("#lead");
const success = document.querySelector(".success");

if (form && success) {
  form.onsubmit = (event) => {
    event.preventDefault();
    form.hidden = true;
    success.hidden = false;
  };

  success.querySelector("button").onclick = () => {
    success.hidden = true;
    form.hidden = false;
  };
}
