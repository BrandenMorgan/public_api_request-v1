// Select gallery div to append new elements
const gallery = document.getElementById("gallery");

// Select the search container div
const searchContainer = document.querySelector(".search-container");

// Create form element and append to the search container div
const form = document.createElement("form");
form.setAttribute("action", "#");
form.setAttribute("method", "GET");
searchContainer.appendChild(form);

// Create input field and submit button markup
const searchHTML = `
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
`;

// Insert into form element
form.insertAdjacentHTML("beforeend", searchHTML);

// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
/**
 * Formats phone number to (XXX) XXX-XXXX
 * @param {string} phoneNumberString - The phone number to format
 * @return {string} Formatted phone number or 'No phone number on file'
 */
function formatPhoneNumber(phoneNumberString) {
  // Replace any characters that aren't numbers at the beginning of the string with empty string
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  // Display message if no number provided
  return "No phone number on file";
}

/**
 * Format employee date of birth to MM/DD/YYYY
 * @param {string} dob - Employee date of birth
 * @return {string} - Formatted date of birth string
 */
function formatDOB(dob) {
  const month = dob.substring(5, 7);
  const day = dob.substring(8, 10);
  const year = dob.substring(0, 4);
  return (dob = `${month}/${day}/${year}`);
}

/**
 * Generate data to use in modal pop up window
 * @param {string} employee - The data for an employee
 * @return {string} - Formatted html string with interpolated data
 */
function generateModalData(employee) {
  // Format phone number and date of birth to interpolate
  let phoneNumber = formatPhoneNumber(employee.cell);
  let dob = formatDOB(employee.dob.date);

  // Create modal html string to insert into modal window
  let modalInfoHTML = `
  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    <div class="modal-info-container">
        <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
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
      </div>
      `;
  return modalInfoHTML;
}

/**
 * Function to create an element and give it a class name
 * @param {string} element - The name of the element to create
 * @param {string} className - The name of the class to add to the element
 * @return {element} - The element created
 */
function makeElement(element, className) {
  const newElement = document.createElement(element);
  newElement.className = className;
  return newElement;
}

/**
 * Function to dynamically create and insert each employee card into the markup
 * @param {array} jsonData - Array of employee objects
 */
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
      <img class="card-img" src="${employee.picture.medium}"
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

    // Click event listener on each card div to trigger modal window
    cardDiv.addEventListener("click", () => {
      // Modal toggle button variables
      let currentEmployeeIndex;
      let nextEmployee;
      let currentEmployee;
      let previousEmployee;

      // Iterate through jsonData to find the object that matches the clicked employee
      for (let obj of jsonData) {
        if (obj === employee) {
          currentEmployee = obj;
          // Get index of clicked employee for toggling
          currentEmployeeIndex = jsonData.indexOf(obj);
        }
      }

      // Container for modal window
      const modalContainer = makeElement("div", "modal-container");
      gallery.appendChild(modalContainer);

      // Create modal window and append to modal container
      const modalDiv = makeElement("div", "modal");
      modalContainer.appendChild(modalDiv);

      // Create container for employee details
      const modalInfoContainer = makeElement("div", "modal-info-container");
      modalDiv.appendChild(modalInfoContainer);

      // Create and append buttons to modal window to toggle through employee cards
      const modalButtonContainer = document.createElement("div");
      modalButtonContainer.className = "modal-btn-container";
      const modalPaginationHTML = `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>`;
      modalButtonContainer.insertAdjacentHTML("beforeend", modalPaginationHTML);
      modalContainer.appendChild(modalButtonContainer);
      const modalPrevBtn = document.getElementById("modal-prev");
      const modalNextBtn = document.getElementById("modal-next");

      // Create modal html string of current employee and append to inner html of modal div
      let modalInfoHTML = generateModalData(currentEmployee);
      modalDiv.innerHTML = modalInfoHTML;

      // Event listener to toggle to previous employee
      modalPrevBtn.addEventListener("click", () => {
        /**
          Conditional to check if the index of the current
          employee is in range of the jsonData array
        */
        if (currentEmployeeIndex > 0) {
          // Get previous employee data
          previousEmployee = jsonData[currentEmployeeIndex - 1];
          // Decrement index
          currentEmployeeIndex--;

          // Change inner html of modal div to previous employee
          modalInfoHTML = generateModalData(previousEmployee);
          modalDiv.innerHTML = modalInfoHTML;

          // Set click event listener on modal window close button
          const button = document.getElementById("modal-close-btn");
          button.addEventListener("click", () => {
            modalContainer.remove();
          });
        }
      });

      // Event listener to toggle to next employee
      modalNextBtn.addEventListener("click", () => {
        /**
          Conditional to check if the index of the current
          employee is in range of the jsonData array
        */
        if (currentEmployeeIndex < jsonData.length - 1) {
          // Get next employee data
          nextEmployee = jsonData[currentEmployeeIndex + 1];
          // Increment index
          currentEmployeeIndex++;

          // Change inner html of modal div to next employee
          modalInfoHTML = generateModalData(nextEmployee);
          modalDiv.innerHTML = modalInfoHTML;

          // Set click event listener on modal window close button
          const button = document.getElementById("modal-close-btn");
          button.addEventListener("click", () => {
            modalContainer.remove();
          });
        }
      });

      /**
      Event listener to close modal window if neither toggle buttons have
      been clicked
      */
      const button = document.getElementById("modal-close-btn");
      button.addEventListener("click", () => {
        modalContainer.remove();
      });
    });
  });
}

/**
 * Function to fetch data from url and parse to json
 * @param {string} url - The url to get data from
 * @return {object} - The parsed json data from the url
 */
function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then((res) => res.json())
    .catch((e) => {
      (gallery.innerHTML =
        "<h3>Looks like there was a problem! Refresh the page.</h3>"),
        console.error(e);
    });
}

/**
 * Helper function to check status response of the requested jsonData
 * @param {object} response - The response received from the fetch api
 * @return {object} - Resolved or rejected Promise
 */
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

// Select submit button and input field in the search bar
const searchSubmit = document.getElementById("search-submit");
const formInput = document.getElementById("search-input");

// Request data from api
fetchData("https://randomuser.me/api/?nat=us,au,nz&results=12").then((data) => {
  // Get all employee elements in a collection
  const cards = document.getElementsByClassName("card");

  function showSearchResults() {
    // Array for storing search results
    let searchArray = [];
    for (let employee of data.results) {
      const search = formInput.value.toLowerCase();
      let name = employee.name.first + employee.name.last;
      name = name.toLowerCase();

      // Add employees whose names contain the search bar value
      if (name.includes(search)) {
        searchArray.push(employee);
      }
    }

    // Display search results if they exist
    if (searchArray.length) {
      gallery.innerHTML = "";

      for (let card of cards) {
        card.style.display = "none";
      }
    } else {
      for (let card of cards) {
        gallery.innerHTML = "<p>There are no results for your search.</p>";
        card.style.display = "none";
      }
    }
    // Generate employee cards for the search results
    generateEmployees(searchArray);
  }

  // Add keyup event listener on search bar
  searchContainer.addEventListener("keyup", () => {
    showSearchResults();
  });

  // Add click event listener on submit button
  searchSubmit.addEventListener("click", () => {
    showSearchResults();
  });

  // Generate employee cards from parsed json
  generateEmployees(data.results);
});
