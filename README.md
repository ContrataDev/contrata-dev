<br />
<div align="center">
  <a href="https://github.com/ContrataDev/contrata-dev">
    <img src="docs/images/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">ContrataDev</h3>
<p align="center">
    Final Project for the Systems Development Course - Etec of Carapicuíba 
</p>

## Developer profile (web)

Two server-rendered pages are available for developers once authenticated:

- `/develop/perfil` — View the current developer profile (name, email, stacks, portfolio).
- `/develop/edit-perfil` — Edit the profile fields (stack, seniority, availability, hourlyRate).

The web pages connect to API endpoints that live under `/api/v1/developers` (GET/PUT/POST/DELETE) — the edit page uses `PUT /api/v1/developers/:id` to save changes.

Run the small API sanity test:

```bash
npm install
npm test
```

