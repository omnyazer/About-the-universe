const listePlanetes = document.getElementById('planet-list');
const controlePagination = document.getElementById('controle-pagination');
const filterSelect = document.getElementById('filter-population');

let allPlanetsData = []; // Toutes les planètes récupérées
let filteredData = []; // Planètes filtrées
let pageActuelle = 1; // Page courante
const PLANETES_PAR_PAGE = 10; // Nombre de planètes affichées par page

// Récupérer toutes les planètes de la SWAPI
async function recupererToutesLesPlanetes(url) {
    try {
        const reponse = await fetch(url);
        const donnees = await reponse.json();

        allPlanetsData = [...allPlanetsData, ...donnees.results];

        if (donnees.next) {
            await recupererToutesLesPlanetes(donnees.next);
        } else {
            // Toutes les données récupérées
            filteredData = [...allPlanetsData];
            afficherPlanetes(filteredData, pageActuelle);
            ControlePagination();
        }
    } catch (erreur) {
        console.error('Erreur lors de la récupération des planètes :', erreur);
    }
}

// Afficher les planètes pour une page donnée
function afficherPlanetes(planetes, page) {
    const debut = (page - 1) * PLANETES_PAR_PAGE;
    const fin = page * PLANETES_PAR_PAGE;
    const planetesPage = planetes.slice(debut, fin);

    const elementsPlanetes = planetesPage
        .map(
            (planete, index) => `
        <div class="carte-planete" data-index="${debut + index}">
            <h3>${planete.name}</h3>
            <p><strong>Population :</strong> ${
                planete.population !== 'unknown'
                    ? planete.population
                    : 'Inconnue'
            }</p>
            <p><strong>Climat :</strong> ${planete.climate}</p>
        </div>
    `
        )
        .join('');

    listePlanetes.innerHTML = `
        <div class="liste-planetes">${elementsPlanetes}</div>
    `;

    // Ajouter les écouteurs sur chaque carte
    const cartesPlanetes = document.querySelectorAll('.carte-planete');
    cartesPlanetes.forEach((carte) => {
        const index = carte.getAttribute('data-index');
        carte.addEventListener('click', () =>
            afficherDetailsPlanete(filteredData[index])
        );
    });
}

// Afficher les détails d'une planète dans une modal
function afficherDetailsPlanete(planete) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="text-center mb-4">
            <h2 class="text-uppercase">${planete.name}</h2>
        </div>
        <div class="info-item mb-3">
            <i class="fas fa-users me-2"></i>
            <strong>Population :</strong> ${
                planete.population !== 'unknown'
                    ? planete.population
                    : 'Inconnue'
            }
        </div>
        <div class="info-item mb-3">
            <i class="fas fa-cloud-sun me-2"></i>
            <strong>Climat :</strong> ${planete.climate}
        </div>
        <div class="info-item mb-3">
            <i class="fas fa-circle me-2"></i>
            <strong>Diamètre :</strong> ${planete.diameter}
        </div>
        <div class="info-item mb-3">
            <i class="fas fa-map me-2"></i>
            <strong>Terrain :</strong> ${planete.terrain}
        </div>
        <div class="info-item mb-3">
            <i class="fas fa-magnet me-2"></i>
            <strong>Gravité :</strong> ${planete.gravity}
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
}

// Mettre à jour les boutons de pagination
function ControlePagination() {
    const totalPages = Math.ceil(filteredData.length / PLANETES_PAR_PAGE);

    controlePagination.innerHTML = `
        <button id="bouton-precedent" ${pageActuelle === 1 ? 'disabled' : ''}>
            Précédent
        </button>
        <button id="bouton-suivant" ${
            pageActuelle === totalPages ? 'disabled' : ''
        }>
            Suivant
        </button>
    `;

    document.getElementById('bouton-precedent').addEventListener('click', () => {
        if (pageActuelle > 1) {
            pageActuelle--;
            afficherPlanetes(filteredData, pageActuelle);
            ControlePagination();
        }
    });

    document.getElementById('bouton-suivant').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / PLANETES_PAR_PAGE);
        if (pageActuelle < totalPages) {
            pageActuelle++;
            afficherPlanetes(filteredData, pageActuelle);
            ControlePagination();
        }
    });
}

// Gérer le filtre de population
filterSelect.addEventListener('change', (event) => {
    const filterValue = event.target.value;

    if (filterValue === 'all') {
        filteredData = [...allPlanetsData];
    } else if (filterValue === 'small') {
        filteredData = allPlanetsData.filter(
            (planete) =>
                planete.population !== 'unknown' &&
                Number(planete.population) <= 100000
        );
    } else if (filterValue === 'medium') {
        filteredData = allPlanetsData.filter(
            (planete) =>
                planete.population !== 'unknown' &&
                Number(planete.population) > 100000 &&
                Number(planete.population) <= 100000000
        );
    } else if (filterValue === 'large') {
        filteredData = allPlanetsData.filter(
            (planete) =>
                planete.population !== 'unknown' &&
                Number(planete.population) > 100000000
        );
    }

    pageActuelle = 1; // Réinitialiser à la première page après un filtre
    afficherPlanetes(filteredData, pageActuelle);
    ControlePagination();
});

// Charger toutes les planètes au démarrage
recupererToutesLesPlanetes('https://swapi.dev/api/planets/');
