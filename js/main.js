const API = "http://localhost:8000/clothes";
let inpCloth = document.querySelector("#inpCloth");
let inpImage = document.querySelector("#inpImage");
let inpPrice = document.querySelector("#inpPrice");
let btnAdd = document.querySelector("#btnAdd");
let btnOpenForm = document.querySelector("#flush-collapseOne");
let sectionClothes = document.querySelector("#sectionClothes");
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
let inpSearch = document.querySelector("#inpSearch");
let currentPage = 1;
let countPage = 1;
let searchValue = "";
let detailsContainer = document.querySelector(".details");

btnAdd.addEventListener("click", () => {
  if (
    !inpCloth.value.trim() ||
    !inpImage.value.trim() ||
    !inpPrice.value.trim()
  ) {
    alert("Заполните все поля!");
    return;
  }
  let newCloth = {
    clothesName: inpCloth.value,
    clothesImage: inpImage.value,
    clothesPrice: inpPrice.value,
  };
  createClothes(newCloth);
  readClothes();
});

// Функция создания одежды
function createClothes(clothes) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(clothes),
  });
  inpCloth.value = "";
  inpImage.value = "";
  inpPrice.value = "";

  btnOpenForm.classList.toggle = "show";
}

async function readClothes() {
  const response = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=8`
  );
  const data = await response.json();
  sectionClothes.innerHTML = "";
  data.forEach((item) => {
    sectionClothes.innerHTML += `
      <div class="card m-3 cardClothes" style="width: 18rem">
        <img 
          id="${item.id}" 
          src="${item.clothesImage}" 
          alt="" 
          class="card-img-top detailsCard" 
          style="height: 400px">
        <div class="card-body">
          <p class="card-text">${item.clothesName}</p>
          <span class="card-text price">${item.clothesPrice} сом</span>
          <div>
            <button class="btn btn-outline-dark btnDelete" id="${item.id}">Удалить</button>
            <button class="btn btn-outline-dark btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Изменить</button>
            <button class="btn btn-dark btnEdit" id="${item.id}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Details</button>
          </div>
        </div>
      </div>
    `;
  });
  pageFunc();
}

readClothes();

document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;

    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readClothes());
  }
});

let editInpСloth = document.querySelector("#editInpСloth");
let editInpImage = document.querySelector("#editInpImage");
let editInpPrice = document.querySelector("#editInpPrice");
let editBtnSave = document.querySelector("#editBtnSave");

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        editInpСloth.value = data.clothesName;
        editInpImage.value = data.clothesImage;
        editInpPrice.value = data.clothesPrice;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let editedClothes = {
    clothesName: editInpСloth.value,
    clothesImage: editInpImage.value,
    clothesPrice: editInpPrice.value,
  };

  editClothes(editedClothes, editBtnSave.id);
});

function editClothes(editedClothes, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedClothes),
  }).then(() => readClothes());
}

function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      countPage = Math.ceil(data.length / 8);
    });
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readClothes();
});

nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readClothes();
});

inpSearch.addEventListener("input", (e) => {
  currentPage = 1;
  searchValue = e.target.value.trim();
  readClothes();
});

//! DETAILS
