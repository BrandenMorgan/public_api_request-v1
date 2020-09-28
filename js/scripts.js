// Select gallery div to append new elements
const gallery = document.getElementById("gallery");
const searchContainer = document.querySelector(".search-container");

// Search container
const form = document.createElement("form");
form.setAttribute("action", "#");
form.setAttribute("method", "GET");
searchContainer.appendChild(form);

const searchHTML = `
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
`;

form.insertAdjacentHTML("beforeend", searchHTML);
const searchSubmit = document.getElementById("search-submit");
const formInput = document.getElementById("search-input");

function generateEmployees(jsonData) {
  const employees = jsonData.map((employee) => {
    // Create a card container for each employee
    const cardDiv = makeElement("div", "card");
    gallery.appendChild(cardDiv);

    // Create element container for thumbnail image
    const imageDiv = makeElement("div", "card-img-container");
    cardDiv.appendChild(imageDiv);

    // Create HTML string to insert into the image div
    const imgHTML = `
      <img class="card-img" src="${employee.picture.thumbnail}"
        alt="profile picture">
      `;
    imageDiv.insertAdjacentHTML("beforeend", imgHTML);

    // Create element container for name, email, location of each employee
    const infoDiv = makeElement("div", "card-info-container");
    cardDiv.appendChild(infoDiv);

    // Create HTML string to insert into the info div
    const infoHTML = `
      <h3 id="name" class="card-name cap">${employee.name.first}
        ${employee.name.last}</h3>
      <p class="card-text">${employee.email}</p>
      <p class="card-text cap">${employee.location.city},
        ${employee.location.state}</p>
    `;
    infoDiv.insertAdjacentHTML("beforeend", infoHTML);

    // Event listener on each card div to triger modal window
    cardDiv.addEventListener("click", (e) => {
      // Container for modal window
      const modalContainer = makeElement("div", "modal-container");
      gallery.appendChild(modalContainer);

      // Create modal window and append to modal container
      const modalDiv = makeElement("div", "modal");
      modalContainer.appendChild(modalDiv);

      // Create and append exit button to modal window
      const button = document.createElement("button");
      button.setAttribute("id", "modal-close-btn");
      button.className = "modal-close-btn";

      const modalHTML = "<strong>X</strong>";
      button.insertAdjacentHTML("beforeend", modalHTML);
      modalDiv.appendChild(button);

      // Create container for employee details
      const modalInfoContainer = makeElement("div", "modal-info-container");
      modalDiv.appendChild(modalInfoContainer);

      const phoneNumber = formatPhoneNumber(employee.cell);

      const dob = formatDOB(employee.dob.date);

      // Create modal html string to insert into modal window
      const modalInfoHTML = `
            <img class="modal-img" src="${employee.picture.medium}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${employee.name.first}
              ${employee.name.last}</h3>
            <p class="modal-text">${employee.email}</p>
            <p class="modal-text cap">${employee.location.city}</p>
            <hr>
            <p class="modal-text">${phoneNumber}</p>
            <p class="modal-text">${employee.location.street.number}
            ${employee.location.street.name}, ${employee.location.state}
              ${employee.location.postcode}</p>
            <p class="modal-text">Birthday: ${dob}</p>
          `;
      modalDiv.insertAdjacentHTML("beforeend", modalInfoHTML);

      // Event listener to close modal window
      button.addEventListener("click", () => {
        modalContainer.remove();
      });
    });
  });
}

// Function to create an element and give it a class name
function makeElement(element, className) {
  const newElement = document.createElement(element);
  newElement.className = className;
  return newElement;
}

// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
// Function to format phone number to (XXX) XXX-XXXX
function formatPhoneNumber(phoneNumberString) {
  // replace any characters that aren't numbers at the beginning of the string with empty string
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    // return the formatted number
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  // Display message if no number provided
  return "No phone number on file";
}
// Format employee date of birth to MM/DD/YYYY
function formatDOB(dob) {
  const month = dob.substring(5, 7);
  const day = dob.substring(8, 10);
  const year = dob.substring(0, 4);
  return (dob = `${month}/${day}/${year}`);
}

// Function to fetch data from url and parse to json
function fetchData(url) {
  return fetch(url).then((res) => res.json());
}

fetchData("https://randomuser.me/api/?nat=us,au,nz&results=12").then((data) => {
  // Get employee info in an array data.results
  const cards = document.getElementsByClassName("card");
  const displayNoResultsMessage = document.createElement("p");
  // displayNoResultsMessage.textContent = "There are no results for your search.";

  searchContainer.addEventListener("keyup", () => {
    let searchArray = [];
    for (let employee of data.results) {
      const search = formInput.value.toLowerCase();
      let name = employee.name.first + employee.name.last;
      name = name.toLowerCase();

      if (name.includes(search)) {
        searchArray.push(employee);
      }
    }
    // Display search results

    if (searchArray.length) {
      // gallery.removeChild(displayNoResultsMessage);
      displayNoResultsMessage.textContent = "";

      for (let card of cards) {
        console.log("results.");
        card.style.display = "none";
      }
    } else {
      for (let card of cards) {
        gallery.appendChild(displayNoResultsMessage);
        displayNoResultsMessage.textContent =
          "There are no results for your search.";

        console.log("No results");
        card.style.display = "none";
      }
      // const displayNoResultsMessage = document.createElement("p");
      // gallery.appendChild(displayNoResultsMessage);
      // const noResultsMessage = "There are no results for your search.";
      // displayNoResultsMessage.innerHTML = noResultsMessage;
    }

    generateEmployees(searchArray);

    // const searchResults = searchArray.map((employee) => {
    //   // Create a card container for each employee
    //   const cardDiv = makeElement("div", "card");
    //   gallery.appendChild(cardDiv);
    //
    //   // Create element container for thumbnail image
    //   const imageDiv = makeElement("div", "card-img-container");
    //   cardDiv.appendChild(imageDiv);
    //
    //   // Create HTML string to insert into the image div
    //   const imgHTML = `
    //     <img class="card-img" src="${employee.picture.thumbnail}"
    //       alt="profile picture">
    //     `;
    //   imageDiv.insertAdjacentHTML("beforeend", imgHTML);
    //
    //   // Create element container for name, email, location of each employee
    //   const infoDiv = makeElement("div", "card-info-container");
    //   cardDiv.appendChild(infoDiv);
    //
    //   // Create HTML string to insert into the info div
    //   const infoHTML = `
    //     <h3 id="name" class="card-name cap">${employee.name.first}
    //       ${employee.name.last}</h3>
    //     <p class="card-text">${employee.email}</p>
    //     <p class="card-text cap">${employee.location.city},
    //       ${employee.location.state}</p>
    //   `;
    //   infoDiv.insertAdjacentHTML("beforeend", infoHTML);
    //
    //   // Event listener on each card div to triger modal window
    //   cardDiv.addEventListener("click", (e) => {
    //     // Container for modal window
    //     const modalContainer = makeElement("div", "modal-container");
    //     gallery.appendChild(modalContainer);
    //
    //     // Create modal window and append to modal container
    //     const modalDiv = makeElement("div", "modal");
    //     modalContainer.appendChild(modalDiv);
    //
    //     // Create and append exit button to modal window
    //     const button = document.createElement("button");
    //     button.setAttribute("id", "modal-close-btn");
    //     button.className = "modal-close-btn";
    //
    //     const modalHTML = "<strong>X</strong>";
    //     button.insertAdjacentHTML("beforeend", modalHTML);
    //     modalDiv.appendChild(button);
    //
    //     // Create container for employee details
    //     const modalInfoContainer = makeElement("div", "modal-info-container");
    //     modalDiv.appendChild(modalInfoContainer);
    //
    //     const phoneNumber = formatPhoneNumber(employee.cell);
    //
    //     const dob = formatDOB(employee.dob.date);
    //
    //     // Create modal html string to insert into modal window
    //     const modalInfoHTML = `
    //           <img class="modal-img" src="${employee.picture.medium}" alt="profile picture">
    //           <h3 id="name" class="modal-name cap">${employee.name.first}
    //             ${employee.name.last}</h3>
    //           <p class="modal-text">${employee.email}</p>
    //           <p class="modal-text cap">${employee.location.city}</p>
    //           <hr>
    //           <p class="modal-text">${phoneNumber}</p>
    //           <p class="modal-text">${employee.location.street.number}
    //           ${employee.location.street.name}, ${employee.location.state}
    //             ${employee.location.postcode}</p>
    //           <p class="modal-text">Birthday: ${dob}</p>
    //         `;
    //     modalDiv.insertAdjacentHTML("beforeend", modalInfoHTML);
    //
    //     // Event listener to close modal window
    //     button.addEventListener("click", () => {
    //       modalContainer.remove();
    //     });
    //   });
    // });
  });

  // const cards = document.getElementsByClassName("card");
  // const displayNoResultsMessage = document.createElement("p");
  // displayNoResultsMessage.textContent = "There are no results for your search.";

  searchSubmit.addEventListener("click", () => {
    let searchArray = [];
    for (let employee of data.results) {
      const search = formInput.value.toLowerCase();
      let name = employee.name.first + employee.name.last;
      name = name.toLowerCase();

      if (name.includes(search)) {
        searchArray.push(employee);
      }
    }

    // Display search results

    if (searchArray.length) {
      gallery.removeChild(displayNoResultsMessage);

      // displayNoResultsMessage.innerHTML = "";
      for (let card of cards) {
        card.style.display = "none";
      }
    } else {
      for (let card of cards) {
        // displayNoResultsMessage.innerHTML =
        //   "There are no results for your search.";
        card.style.display = "none";
      }
    }

    formInput.value = "";
    // const displayNoResultsMessage = document.createElement("p");
    // gallery.appendChild(displayNoResultsMessage);
    // const noResultsMessage = "There are no results for your search.";
    // displayNoResultsMessage.innerHTML = noResultsMessage;

    generateEmployees(searchArray);
    // const searchResults = searchArray.map((employee) => {
    //   // Create a card container for each employee
    //   const cardDiv = makeElement("div", "card");
    //   gallery.appendChild(cardDiv);
    //
    //   // Create element container for thumbnail image
    //   const imageDiv = makeElement("div", "card-img-container");
    //   cardDiv.appendChild(imageDiv);
    //
    //   // Create HTML string to insert into the image div
    //   const imgHTML = `
    //     <img class="card-img" src="${employee.picture.thumbnail}"
    //       alt="profile picture">
    //     `;
    //   imageDiv.insertAdjacentHTML("beforeend", imgHTML);
    //
    //   // Create element container for name, email, location of each employee
    //   const infoDiv = makeElement("div", "card-info-container");
    //   cardDiv.appendChild(infoDiv);
    //
    //   // Create HTML string to insert into the info div
    //   const infoHTML = `
    //     <h3 id="name" class="card-name cap">${employee.name.first}
    //       ${employee.name.last}</h3>
    //     <p class="card-text">${employee.email}</p>
    //     <p class="card-text cap">${employee.location.city},
    //       ${employee.location.state}</p>
    //   `;
    //   infoDiv.insertAdjacentHTML("beforeend", infoHTML);
    //
    //   // Event listener on each card div to triger modal window
    //   cardDiv.addEventListener("click", (e) => {
    //     // Container for modal window
    //     const modalContainer = makeElement("div", "modal-container");
    //     gallery.appendChild(modalContainer);
    //
    //     // Create modal window and append to modal container
    //     const modalDiv = makeElement("div", "modal");
    //     modalContainer.appendChild(modalDiv);
    //
    //     // Create and append exit button to modal window
    //     const button = document.createElement("button");
    //     button.setAttribute("id", "modal-close-btn");
    //     button.className = "modal-close-btn";
    //
    //     const modalHTML = "<strong>X</strong>";
    //     button.insertAdjacentHTML("beforeend", modalHTML);
    //     modalDiv.appendChild(button);
    //
    //     // Create container for employee details
    //     const modalInfoContainer = makeElement("div", "modal-info-container");
    //     modalDiv.appendChild(modalInfoContainer);
    //
    //     const phoneNumber = formatPhoneNumber(employee.cell);
    //
    //     const dob = formatDOB(employee.dob.date);
    //
    //     // Create modal html string to insert into modal window
    //     const modalInfoHTML = `
    //           <img class="modal-img" src="${employee.picture.medium}" alt="profile picture">
    //           <h3 id="name" class="modal-name cap">${employee.name.first}
    //             ${employee.name.last}</h3>
    //           <p class="modal-text">${employee.email}</p>
    //           <p class="modal-text cap">${employee.location.city}</p>
    //           <hr>
    //           <p class="modal-text">${phoneNumber}</p>
    //           <p class="modal-text">${employee.location.street.number}
    //           ${employee.location.street.name}, ${employee.location.state}
    //             ${employee.location.postcode}</p>
    //           <p class="modal-text">Birthday: ${dob}</p>
    //         `;
    //     modalDiv.insertAdjacentHTML("beforeend", modalInfoHTML);
    //
    //     // Event listener to close modal window
    //     button.addEventListener("click", () => {
    //       modalContainer.remove();
    //     });
    //   });
    // });
  });

  generateEmployees(data.results);

  // const employees = data.results.map((employee) => {
  //   // Create a card container for each employee
  //   const cardDiv = makeElement("div", "card");
  //   gallery.appendChild(cardDiv);
  //
  //   // Create element container for thumbnail image
  //   const imageDiv = makeElement("div", "card-img-container");
  //   cardDiv.appendChild(imageDiv);
  //
  //   // Create HTML string to insert into the image div
  //   const imgHTML = `
  //     <img class="card-img" src="${employee.picture.thumbnail}"
  //       alt="profile picture">
  //     `;
  //   imageDiv.insertAdjacentHTML("beforeend", imgHTML);
  //
  //   // Create element container for name, email, location of each employee
  //   const infoDiv = makeElement("div", "card-info-container");
  //   cardDiv.appendChild(infoDiv);
  //
  //   // Create HTML string to insert into the info div
  //   const infoHTML = `
  //     <h3 id="name" class="card-name cap">${employee.name.first}
  //       ${employee.name.last}</h3>
  //     <p class="card-text">${employee.email}</p>
  //     <p class="card-text cap">${employee.location.city},
  //       ${employee.location.state}</p>
  //   `;
  //   infoDiv.insertAdjacentHTML("beforeend", infoHTML);
  //
  //   // Event listener on each card div to triger modal window
  //   cardDiv.addEventListener("click", (e) => {
  //     // Container for modal window
  //     const modalContainer = makeElement("div", "modal-container");
  //     gallery.appendChild(modalContainer);
  //
  //     // Create modal window and append to modal container
  //     const modalDiv = makeElement("div", "modal");
  //     modalContainer.appendChild(modalDiv);
  //
  //     // Create and append exit button to modal window
  //     const button = document.createElement("button");
  //     button.setAttribute("id", "modal-close-btn");
  //     button.className = "modal-close-btn";
  //
  //     const modalHTML = "<strong>X</strong>";
  //     button.insertAdjacentHTML("beforeend", modalHTML);
  //     modalDiv.appendChild(button);
  //
  //     // Create container for employee details
  //     const modalInfoContainer = makeElement("div", "modal-info-container");
  //     modalDiv.appendChild(modalInfoContainer);
  //
  //     const phoneNumber = formatPhoneNumber(employee.cell);
  //
  //     const dob = formatDOB(employee.dob.date);
  //
  //     // Create modal html string to insert into modal window
  //     const modalInfoHTML = `
  //           <img class="modal-img" src="${employee.picture.medium}" alt="profile picture">
  //           <h3 id="name" class="modal-name cap">${employee.name.first}
  //             ${employee.name.last}</h3>
  //           <p class="modal-text">${employee.email}</p>
  //           <p class="modal-text cap">${employee.location.city}</p>
  //           <hr>
  //           <p class="modal-text">${phoneNumber}</p>
  //           <p class="modal-text">${employee.location.street.number}
  //           ${employee.location.street.name}, ${employee.location.state}
  //             ${employee.location.postcode}</p>
  //           <p class="modal-text">Birthday: ${dob}</p>
  //         `;
  //     modalDiv.insertAdjacentHTML("beforeend", modalInfoHTML);
  //
  //     // Event listener to close modal window
  //     button.addEventListener("click", () => {
  //       modalContainer.remove();
  //     });
  //   });
  // });
});
