document.addEventListener('DOMContentLoaded', () => {
  const developerId = window.__DEVELOPER_ID;
  const developerData = window.__DEVELOPER_DATA || null;

  const techListEl = document.getElementById('techList');
  const addTechBtn = document.getElementById('addTech');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const projectsContainer = document.getElementById('projectsContainer');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // helpers
  function makeTechChip(text) {
    const chip = document.createElement('div');
    chip.className = 'tech-chip';
    chip.textContent = text;
    const rem = document.createElement('button');
    rem.style.marginLeft = '8px';
    rem.style.background = 'transparent';
    rem.style.border = 'none';
    rem.style.color = '#c9c9c9';
    rem.textContent = '✕';
    rem.title = 'Remover';
    rem.addEventListener('click', () => chip.remove());
    chip.appendChild(rem);
    return chip;
  }

  function makeProjectItem(item = {}) {
    const root = document.createElement('div');
    root.className = 'projeto-card project-item';

    const logo = document.createElement('div');
    logo.className = 'logo-placeholder';
    logo.innerHTML = '<iconify-icon icon="mdi:github" width="40"></iconify-icon>';

    const inner = document.createElement('div');
    inner.style.flex = '1';
    const title = document.createElement('p');
    title.className = 'proj-title';
    title.textContent = item.title || 'Novo projeto';

    const link = document.createElement('p');
    link.className = 'proj-link';
    link.textContent = 'Link : ' + (item.url || '—');

    const rem = document.createElement('button');
    rem.style.marginLeft = '10px';
    rem.style.background = 'transparent';
    rem.style.border = 'none';
    rem.style.color = '#c9c9c9';
    rem.textContent = '✕';
    rem.title = 'Remover projeto';
    rem.addEventListener('click', () => root.remove());

    inner.appendChild(title);
    inner.appendChild(link);
    root.appendChild(logo);
    root.appendChild(inner);
    root.appendChild(rem);

    return root;
  }

  // initial render
  if (developerData) {
    // render technology stacks if not already (server already inserted some)
    if (Array.isArray(developerData.TechnologyStacks)) {
      // clear and render
      if (techListEl) techListEl.innerHTML = '';
      developerData.TechnologyStacks.forEach((ts) => {
        if (techListEl) techListEl.appendChild(makeTechChip(ts.name || ts));
      });
    }

    if (Array.isArray(developerData.PortfolioItems)) {
      if (projectsContainer) projectsContainer.innerHTML = '';
      developerData.PortfolioItems.forEach((p) => {
        if (projectsContainer) projectsContainer.appendChild(makeProjectItem({ title: p.title, url: p.url }));
      });
    }
  }

  addTechBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const name = prompt('Nome da tecnologia (ex: JavaScript, React):');
    if (name) {
      techListEl.appendChild(makeTechChip(name));
    }
  });

  addProjectBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const title = prompt('Título do projeto:');
    if (!title) return;
    const url = prompt('URL do projeto (opcional):');
    projectsContainer.appendChild(makeProjectItem({ title, url }));
  });

  cancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location = '/develop/perfil';
  });

  saveBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!developerId) return alert('Perfil não identificado');

    const phone = document.querySelector('input[name="phone"]')?.value || '';
    const country = document.querySelector('input[name="country"]')?.value || '';

    const techs = Array.from(document.querySelectorAll('#techList .tech-chip'))
      .map((el) => el.firstChild && el.firstChild.textContent ? el.firstChild.textContent.trim() : el.textContent.trim())
      .map((t) => t.replace('✕', '').trim())
      .filter(Boolean);

    const projects = Array.from(document.querySelectorAll('#projectsContainer .project-item')).map((el) => {
      const title = el.querySelector('.proj-title')?.textContent || '';
      const linkText = el.querySelector('.proj-link')?.textContent || '';
      const url = linkText.replace(/^Link\s*:\s*/, '').trim();
      return { title: title.trim(), url };
    }).filter(p => p.title || p.url);

    const payload = { phone, country, technologyStacks: techs, portfolioItems: projects };

    try {
      const res = await fetch(`/api/v1/developers/${developerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.location = '/develop/perfil';
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Erro ao salvar');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão');
    }
  });
});
