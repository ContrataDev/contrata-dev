document.addEventListener('DOMContentLoaded', () => {
  let developerId = window.__DEVELOPER_ID;
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

  // avatar file handling
  const avatarFileInput = document.getElementById('avatarFile');
  const avatarPreviewEl = document.getElementById('avatarPreview');

  avatarFileInput?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // preview image
    const reader = new FileReader();
    reader.onload = () => {
      if (avatarPreviewEl) {
        avatarPreviewEl.innerHTML = '';
        const img = document.createElement('img');
        img.src = reader.result;
        img.alt = 'avatar preview';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        avatarPreviewEl.appendChild(img);
      }
    };
    reader.readAsDataURL(file);
  });

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
    const url = prompt('URL do projeto:');
    projectsContainer.appendChild(makeProjectItem({ title, url }));
  });

  cancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location = '/develop/perfil';
  });

  saveBtn?.addEventListener('click', async (e) => {
    e.preventDefault();

    // If the page doesn't have an associated Developer id, ask the server
    // to create/get the current user's Developer. This helps when the
    // logged-in user doesn't yet have a Developer row.
    if (!developerId) {
      try {
        const meRes = await fetch('/api/v1/developers/me', { method: 'POST', credentials: 'same-origin' });
        if (!meRes.ok) {
          const err = await meRes.json().catch(() => ({}));
          return alert(err.error || 'Perfil não identificado');
        }
        const dev = await meRes.json();
        developerId = dev && dev.id ? dev.id : developerId;
        // update global variable so other scripts could use it
        window.__DEVELOPER_ID = developerId;
      } catch (err) {
        console.error('Erro ao criar/obter developer:', err);
        return alert('Perfil não identificado');
      }
    }

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
      // first: upload avatar if provided
      const avatarFile = avatarFileInput && avatarFileInput.files && avatarFileInput.files[0];
      if (avatarFile) {
        const form = new FormData();
        form.append('avatar', avatarFile);
        const avRes = await fetch(`/api/v1/developers/${developerId}/avatar`, {
          method: 'POST',
          body: form,
          credentials: 'same-origin'
        });
        if (!avRes.ok) {
          const err = await avRes.json().catch(() => ({}));
          return alert(err.error || 'Erro ao fazer upload do avatar');
        }
        // merge returned avatar (optionally) into developerData so preview is consistent
        const updatedDev = await avRes.json().catch(() => null);
        if (updatedDev && updatedDev.avatar) {
          // ensure the form will send the latest avatar if needed, and update UI
          // do not display filename in UI per design
        }
      }

      const res = await fetch(`/api/v1/developers/${developerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // add a timestamp to bust cache so the newly uploaded avatar is fetched
        window.location = '/develop/perfil?t=' + Date.now();
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
