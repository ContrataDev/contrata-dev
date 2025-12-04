async function getProjects(status) {
  let url = new URL(window.location.origin + "/api/v1/projects/my");

  if (status) {
    url.searchParams.set("status", status);
  }

  const res = await fetch(url);
  const projects = await res.json();

  return projects;
}

function renderProjects(projects) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // header
    const header = document.createElement("div");
    header.classList.add("header-card");

    const valor = document.createElement("p");
    valor.classList.add("valor");
    valor.textContent = `💰 R$ ${project.budget}`;

    const titulo = document.createElement("p");
    titulo.classList.add("titulo");

    // link para página de detalhes
    const link = document.createElement("a");
    link.href = `/projects/${project.id}`;
    link.textContent = project.title;
    titulo.appendChild(link);

    header.appendChild(valor);
    header.appendChild(titulo);

    const descricao = document.createElement("p");
    descricao.textContent = project.description;

    const requisitos = document.createElement("p");
    requisitos.textContent = `📅 Prazo: ${new Date(
      project.deadline
    ).toLocaleDateString()} | Status: ${project.status}`;

    const techIcons = document.createElement("div");
    techIcons.classList.add("tech-icons");
    techIcons.innerHTML = `
      <iconify-icon icon="logos:javascript" width="24"></iconify-icon>
      <iconify-icon icon="vscode-icons:file-type-html" width="25"></iconify-icon>
    `;

    card.appendChild(header);
    card.appendChild(descricao);
    card.appendChild(requisitos);
    card.appendChild(techIcons);

    container.appendChild(card);
  });
}

getProjects().then((projects) => {
  renderProjects(projects);
});
