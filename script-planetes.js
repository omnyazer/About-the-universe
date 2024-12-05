const listePlanetes = document.getElementById('planet-list');
const controlePagination = document.getElementById('controle-pagination');

let urlPageActuelle = 'https://swapi.dev/api/planets/';
let urlPageSuivante = null;
let urlPagePrecedente = null;
let planetsData = []; // stocker les données des planètes récupérées

// eécupérer et afficher les planètes d'une page
async function recupererEtAfficherPlanetes(url) {
    try {
        const reponse = await fetch(url);
        const donnees = await reponse.json();

        //mettre à jour les URLs pour la pagination
        urlPageSuivante = donnees.next;
        urlPagePrecedente = donnees.previous;

        afficherPlanetes(donnees.results);
        ControlePagination();
    } catch (erreur) {
        console.error('Erreur lors de la récupération des planètes :', erreur);
    }
}

//afficher les planètes
function afficherPlanetes(planetes) {
    planetsData = planetes; // stocker les données pour utilisation future
    const elementsPlanetes = planetes
        .map((planete, index) => `
            <div class="carte-planete" data-index="${index}">
                <h3>${planete.name}</h3>
                <p><strong>Population :</strong> ${planete.population}</p>
                <p><strong>Climat :</strong> ${planete.climate}</p>
            </div>
        `)
        .join('');

    listePlanetes.innerHTML = `
        <div class="liste-planetes">${elementsPlanetes}</div>
    `;

    // ajouter les écouteurs sur chaque carte pour cliquer
    const cartesPlanetes = document.querySelectorAll('.carte-planete');
    cartesPlanetes.forEach(carte => {
        carte.addEventListener('click', afficherDetailsPlanete);
    });
}

function afficherDetailsPlanete(event) {
    const index = event.currentTarget.getAttribute('data-index');
    const planete = planetsData[index]; // Récupérer la planète correspondante

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="text-center mb-4">
            <h2 class="text-uppercase">${planete.name}</h2>
        </div>
        <div class="info-item mb-3">
            <i class="fas fa-users me-2"></i>
            <strong>Population :</strong> ${planete.population}
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

    // Afficher la modal
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
}

// Pagination
function ControlePagination() {
    controlePagination.innerHTML = `
        <button id="bouton-precedent" ${urlPagePrecedente ? '' : 'disabled'}>Précédent</button>
        <button id="bouton-suivant" ${urlPageSuivante ? '' : 'disabled'}>Suivant</button>
    `;

    document.getElementById('bouton-precedent').addEventListener('click', () => {
        if (urlPagePrecedente) recupererEtAfficherPlanetes(urlPagePrecedente);
    });
    document.getElementById('bouton-suivant').addEventListener('click', () => {
        if (urlPageSuivante) recupererEtAfficherPlanetes(urlPageSuivante);
    });
}

// Charger la première page au chargement
recupererEtAfficherPlanetes(urlPageActuelle);
