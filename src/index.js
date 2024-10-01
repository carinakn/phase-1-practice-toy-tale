let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    
    addBtn.addEventListener("click", () => {
        addToy = !addToy;
        toyFormContainer.style.display = addToy ? "block" : "none";
    });

    fetchToys();
    const toyForm = document.querySelector(".add-toy-form");
    toyForm.addEventListener("submit", createToy);
});

function fetchToys() {
    fetch('http://localhost:3000/toys')
        .then(response => response.json())
        .then(toys => {
            const toyCollection = document.getElementById('toy-collection');
            toys.forEach(toy => {
                const toyCard = createToyCard(toy);
                toyCollection.appendChild(toyCard);
            });
        })
        .catch(error => console.error('Error fetching toys:', error));
}

function createToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;

    const img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar';

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement('button');
    button.className = 'like-btn';
    button.id = toy.id;
    button.textContent = 'Like ❤️';
    button.addEventListener('click', () => updateLikes(toy));

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    return card;
}

function createToy(event) {
    event.preventDefault();

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
        name: toyName,
        image: toyImage,
        likes: 0
    };

    fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
        const toyCollection = document.getElementById('toy-collection');
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
        event.target.reset();
    })
    .catch(error => console.error('Error creating toy:', error));
}

function updateLikes(toy) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
        const card = document.querySelector(`button[id="${toy.id}"]`).parentElement;
        const likesParagraph = card.querySelector('p');
        likesParagraph.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => console.error('Error updating likes:', error));
}
