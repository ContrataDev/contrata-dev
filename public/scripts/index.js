document.addEventListener("DOMContentLoaded", () => {
	const btnTrabalhar = document.getElementById("btnTrabalhar");
	const btnContratar = document.getElementById("btnContratar");

	const sectionTrabalhar = document.getElementById("sectionTrabalhar");
	const sectionContratar = document.getElementById("sectionContratar");

	btnTrabalhar.addEventListener("click", (e) => {
		e.preventDefault();
		sectionTrabalhar.classList.add("active");
		sectionContratar.classList.remove("active");
	});

	btnContratar.addEventListener("click", (e) => {
		e.preventDefault();
		sectionContratar.classList.add("active");
		sectionTrabalhar.classList.remove("active");
	});
});

document.querySelectorAll(".nav-link").forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();

		// remove "active" de todos os links
		document
			.querySelectorAll(".nav-link")
			.forEach((el) => el.classList.remove("active"));
		// adiciona "active" ao clicado
		link.classList.add("active");

		// troca de conteúdo
		const page = link.getAttribute("data-page");
		document
			.querySelectorAll(".page")
			.forEach((el) => el.classList.add("hidden"));
		document.getElementById(page).classList.remove("hidden");
	});
});
