let card = document.querySelector(".card");
let loginButton = document.querySelector(".loginButton");
let cadastroButton = document.querySelector(".cadastroButton");

loginButton.onclick = () => {
  card.classList.remove("cadastroActive");
  card.classList.add("loginActive");
};

cadastroButton.onclick = () => {
  card.classList.remove("loginActive");
  card.classList.add("cadastroActive");
};

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("loginForm");
  const formCadastro = document.getElementById("registerForm");

  // LOGIN
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formLogin));

      try {
        const res = await fetch("/auth/password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Erro ao fazer login");

        alert(result.message);
        if (result.user.role === "developer") {
          window.location.href = "/homeD";
        } else if (result.user.role === "client") {
          window.location.href = "/homeE";
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        alert("Erro: " + err.message);
      }
    });
  }

  // CADASTRO
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
c         tipoUsuario === "dev" ? "/auth/register/dev" : "/auth/register/client";

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Erro no cadastro");
        alert(result.message);

        // LOGIN AUTOMÁTICO
        const loginRes = await fetch("/auth/password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        const loginResult = await loginRes.json();
        if (loginRes.ok) {
          alert("Conta criada e login realizado com sucesso!");
          window.location.href =
            loginResult.user.role === "developer" ? "/homeD" : "/homeE";
        } else {
          alert("Conta criada, mas falha ao realizar login automático.");
        }
      } catch (err) {
        alert("Erro: " + err.message);
      }
    });
  }
});
