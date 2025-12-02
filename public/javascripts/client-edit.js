document.addEventListener('DOMContentLoaded', () => {
  let clientId = window.__CLIENT_ID;
  const clientData = window.__CLIENT_DATA || null;

  const avatarFileInput = document.getElementById('avatarFile');
  const avatarPreviewEl = document.getElementById('avatarPreview');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // initial preview from server data
  if (clientData && clientData.avatar) {
    // already rendered on server
  }

  avatarFileInput?.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
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

  cancelBtn?.addEventListener('click', (e) => { e.preventDefault(); window.location = '/client/perfil'; });

  saveBtn?.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!clientId) {
      try {
        const meRes = await fetch('/api/v1/clients/me', { method: 'POST', credentials: 'same-origin' });
        if (!meRes.ok) {
          const err = await meRes.json().catch(() => ({}));
          return alert(err.error || 'Perfil não identificado');
        }
        const client = await meRes.json();
        clientId = client && client.id ? client.id : clientId;
        window.__CLIENT_ID = clientId;
      } catch (err) {
        console.error('Erro ao criar/obter client:', err);
        return alert('Perfil não identificado');
      }
    }

    const companyName = document.querySelector('input[name="companyName"]')?.value || '';
    const budgetRange = document.querySelector('input[name="budgetRange"]')?.value || '';

    try {
      const avatarFile = avatarFileInput && avatarFileInput.files && avatarFileInput.files[0];
      if (avatarFile) {
        const form = new FormData();
        form.append('avatar', avatarFile);
        const avRes = await fetch(`/api/v1/clients/${clientId}/avatar`, { method: 'POST', body: form, credentials: 'same-origin' });
        if (!avRes.ok) {
          const err = await avRes.json().catch(() => ({}));
          return alert(err.error || 'Erro ao fazer upload do avatar');
        }
      }

      const res = await fetch(`/api/v1/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ companyName, budgetRange }),
      });

      if (res.ok) {
        window.location = '/client/perfil?t=' + Date.now();
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