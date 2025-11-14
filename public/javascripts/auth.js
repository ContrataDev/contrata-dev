let card = document.querySelector(".card");
let loginButton = document.querySelector(".loginButton");
let cadastroButton = document.querySelector(".cadastroButton");

function toggleCardMode(card, mode) {
  if (mode === "login") {
    card.classList.remove("cadastroActive");
    card.classList.add("loginActive");
  } else if (mode === "cadastro") {
    card.classList.remove("loginActive");
    card.classList.add("cadastroActive");
  }
}
const params = new URLSearchParams(window.location.search);

if (params.get("type") === "login") {
  toggleCardMode(card, "login");
} else if (params.get("type") === "cadastro") {
  toggleCardMode(card, "cadastro");
}

loginButton.onclick = () => toggleCardMode(card, "login");
cadastroButton.onclick = () => toggleCardMode(card, "cadastro");

document.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("registerForm");

  if (formCadastro) {
    formCadastro.addEventListener("submit", async (e) => {
      e.preventDefault();

      const tipoUsuario = document.querySelector(
        'input[name="tipoUsuario"]:checked'
      )?.value;
      if (!tipoUsuario) {
        alert("Selecione o tipo de usuário (desenvolvedor ou contratante).");
        return;
      }

      const data = Object.fromEntries(new FormData(formCadastro));
      const url =
        tipoUsuario === "dev"
          ? "/auth/register/develop"
          : "/auth/register/client";

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Erro no cadastro");

        toggleCardMode(card, "login");
      } catch (err) {
        alert("Erro: " + err.message);
      }
    });
  }
});
