// Select gallery div to append new elements
const gallery = document.getElementById("gallery");

// function fetchData(url) {
//   return fetch(url)
//     .then((res) => res.json())
//     .then((data) => data.results);
// }
// const data = fetchData("https://randomuser.me/api/?results=12");
// // console.log(data);

fetch("https://randomuser.me/api/?results=12")
  .then((response) => response.json())
  .then((data) => generatePeople(data.results));

function generatePeople(data) {
  const employees = data.map((employee) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    gallery.appendChild(cardDiv);

    const imageDiv = document.createElement("div");
    imageDiv.className = "card-img-container";
    cardDiv.appendChild(imageDiv);

    let imgHTML = `
      <img class="card-img" src="${employee.picture.thumbnail}"
        alt="profile picture">
      `;
    imageDiv.insertAdjacentHTML("beforeend", imgHTML);

    const infoDiv = document.createElement("div");
    infoDiv.className = "card-info-container";
    cardDiv.appendChild(infoDiv);

    let infoHTML = `
      <h3 id="name" class="card-name cap">${employee.name.first}
        ${employee.name.last}</h3>
      <p class="card-text">${employee.email}</p>
      <p class="card-text cap">${employee.location.city},
        ${employee.location.state}</p>
    `;
    infoDiv.insertAdjacentHTML("beforeend", infoHTML);
  });
}
