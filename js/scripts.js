// Select gallery div to append new elements
const gallery = document.getElementById("gallery");

function fetchData(url) {
  return fetch(url).then((res) => res.json());
}

fetchData("https://randomuser.me/api/?results=12").then((data) => {
  const allData = data.results;
  const employees = allData.map((employee) => {
    // console.log(employee);
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

    cardDiv.addEventListener("click", (e) => {
      const modalContainer = document.createElement("div");
      modalContainer.className = "modal-container";
      gallery.appendChild(modalContainer);

      const modalDiv = document.createElement("div");
      modalDiv.className = "modal";
      modalContainer.appendChild(modalDiv);

      const button = document.createElement("button");
      button.setAttribute("id", "modal-close-btn");
      button.className = "modal-close-btn";
      const modalHTML = "<strong>X</strong>";
      button.insertAdjacentHTML("beforeend", modalHTML);
      modalDiv.appendChild(button);

      const modalInfoContainer = document.createElement("div");
      modalInfoContainer.className = "modal-info-container";
      modalDiv.appendChild(modalInfoContainer);

      // https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
      function formatPhoneNumber(phoneNumberString) {
        const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return "No phone number on file";
      }

      const phoneNumber = formatPhoneNumber(employee.cell);

      // https://stackoverflow.com/questions/25159330/convert-an-iso-date-to-the-date-format-yyyy-mm-dd-in-javascript
      const date = new Date(employee.dob.date);
      const month = employee.dob.date.substring(5, 7);
      const day = employee.dob.date.substring(8, 10);
      const year = employee.dob.date.substring(0, 4);
      const dob = `${month}/${day}/${year}`;

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
      button.addEventListener("click", () => {
        modalContainer.remove();
      });
    });
  });

  // gallery.addEventListener("click", (e) => {
  //   const cards = document.getElementsByClassName("card");
  //
  //   // for (let card of cards) {
  //   //   console.log(card);
  //   // }
  //
  //   if (e.target.className.includes("card")) {
  //     console.log(e.target);
  //
  //     const modalContainer = document.createElement("div");
  //     modalContainer.className = "modal-container";
  //     gallery.appendChild(modalContainer);
  //
  //     const modalDiv = document.createElement("div");
  //     modalDiv.className = "modal";
  //     modalContainer.appendChild(modalDiv);
  //
  //     const button = document.createElement("button");
  //     button.setAttribute("id", "modal-close-btn");
  //     button.className = "modal-close-btn";
  //     const modalHTML = "<strong>X</strong>";
  //     button.insertAdjacentHTML("beforeend", modalHTML);
  //     modalDiv.appendChild(button);
  //
  //     const modalInfoContainer = document.createElement("div");
  //     modalInfoContainer.className = "modal-info-container";
  //     modalDiv.appendChild(modalInfoContainer);
  //
  //     const modalInfoHTML = `
  //       <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
  //       <h3 id="name" class="modal-name cap">name</h3>
  //       <p class="modal-text">email</p>
  //       <p class="modal-text cap">city</p>
  //       <hr>
  //       <p class="modal-text">(555) 555-5555</p>
  //       <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
  //       <p class="modal-text">Birthday: 10/21/2015</p>
  //     `;
  //   }
  // });
});

// function generatePeople(data) {
//   const employees = data.map((employee) => {
//     // console.log(employee);
//     const cardDiv = document.createElement("div");
//     cardDiv.className = "card";
//     gallery.appendChild(cardDiv);
//
//     const imageDiv = document.createElement("div");
//     imageDiv.className = "card-img-container";
//     cardDiv.appendChild(imageDiv);
//
//     let imgHTML = `
//       <img class="card-img" src="${employee.picture.thumbnail}"
//         alt="profile picture">
//       `;
//     imageDiv.insertAdjacentHTML("beforeend", imgHTML);
//
//     const infoDiv = document.createElement("div");
//     infoDiv.className = "card-info-container";
//     cardDiv.appendChild(infoDiv);
//
//     let infoHTML = `
//       <h3 id="name" class="card-name cap">${employee.name.first}
//         ${employee.name.last}</h3>
//       <p class="card-text">${employee.email}</p>
//       <p class="card-text cap">${employee.location.city},
//         ${employee.location.state}</p>
//     `;
//     infoDiv.insertAdjacentHTML("beforeend", infoHTML);
//   });
// }

// gallery.addEventListener("click", (e) => {
//   const cards = document.getElementsByClassName("card");
//
//   // for (let card of cards) {
//   //   console.log(card);
//   // }
//
//   if (e.target.className.includes("card")) {
//     // console.log(e.target);
//
//     const modalContainer = document.createElement("div");
//     modalContainer.className = "modal-container";
//     gallery.appendChild(modalContainer);
//
//     const modalDiv = document.createElement("div");
//     modalDiv.className = "modal";
//     modalContainer.appendChild(modalDiv);
//
//     const button = document.createElement("button");
//     button.setAttribute("id", "modal-close-btn");
//     button.className = "modal-close-btn";
//     const modalHTML = "<strong>X</strong>";
//     button.insertAdjacentHTML("beforeend", modalHTML);
//     modalDiv.appendChild(button);
//
//     const modalInfoContainer = document.createElement("div");
//     modalInfoContainer.className = "modal-info-container";
//     modalDiv.appendChild(modalInfoContainer);
//
//     // const modalInfoHTML = `
//     //
//     // `;
//   }
// });
