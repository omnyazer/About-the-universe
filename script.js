const planets = document.getElementById('planets');
const vehicles = document.getElementById('vehicles');
const people = document.getElementById('people');
const missionBtn = document.getElementById('missionBtn');

// récupérer les données de l'API
function getData(url, element) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            element.textContent = data.count; 
        })
        .catch((error) => {
            console.error('Erreur API:', error);
        });
}

// statistiques
function loadStats() {
    getData('https://swapi.dev/api/planets/', planets); 
    getData('https://swapi.dev/api/vehicles/', vehicles); 
    getData('https://swapi.dev/api/people/', people); 
}

missionBtn.addEventListener('click', () => {
    alert('Merci de votre participation à la prochaine mission !');
});



loadStats();
