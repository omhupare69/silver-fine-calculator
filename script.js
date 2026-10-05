/* =========================================================
   SILVER FINE CALCULATOR
   ========================================================= */


/* ================= DEFAULT ITEMS ================= */

const defaultItems = [
    "Chatai Payal",
    "Selam ChumChum",
    "Mathura Khushbu ChumChum",
    "Mix Kardore",
    "Mix Thosrawa",
    "ChumChum Double Kadi",
    "Arju Double Kadi",
    "22 Gej Rupali",
    "21 Gej Rupali",
    "Mix Masoli",
    "Bigar Sakhli",
    "Gof Kardode",
    "Fancy Vedhni",
    "Daak Paati",
    "Sutte Fase",
    "Ghungru",
    "Mix Wale",
    "Ball Kardode",
    "Selam Aarya",
    "Gajri Wale",
    "Fancy Kardode",
    "Mangati Taar",
    "Agra Fancy Payal",
    "Shindeshai Tode",
    "23 Gej 2 Line",
    "22 Gej 2 Line",
    "22 Gej 3 Line",
    "20 Gej 2 Line",
    "20 Gej 3 Line",
    "Selam Khushbu ChumChum",
    "Neck Chain",
    "Ek Rava Rupali",
    "3 Kalash"
];


/* ================= STORAGE ================= */

const CUSTOM_ITEMS_KEY = "silverCustomItems";

let pieces = [];

let customItems = JSON.parse(
    localStorage.getItem(CUSTOM_ITEMS_KEY) || "[]"
);


/* ================= DOM ELEMENTS ================= */

const pieceNameInput = document.getElementById("pieceName");
const weightInput = document.getElementById("weight");
const touchInput = document.getElementById("touch");
const majuriInput = document.getElementById("majuri");

const addPieceBtn = document.getElementById("addPieceBtn");
const addItemBtn = document.getElementById("addItemBtn");

const tableBody = document.getElementById("piecesTableBody");
const emptyMessage = document.getElementById("emptyMessage");

const clearBtn = document.getElementById("clearBtn");
const printBtn = document.getElementById("printBtn");

const totalPiecesElement = document.getElementById("totalPieces");
const totalWeightElement = document.getElementById("totalWeight");
const totalFineElement = document.getElementById("totalFine");
const totalMajuriElement = document.getElementById("totalMajuri");


/* ================= ITEM LIST ================= */

function getAllItems() {

    return [
        ...defaultItems,
        ...customItems
    ];
}


/* ================= LOAD DROPDOWN ================= */

function loadItems() {

    pieceNameInput.innerHTML = `
        <option value="">Select Item</option>
    `;

    const allItems = getAllItems();

    allItems.forEach(item => {

        const option = document.createElement("option");

        option.value = item;
        option.textContent = item;

        pieceNameInput.appendChild(option);

    });
}


/* ================= ADD CUSTOM ITEM ================= */

function addNewItem() {

    const itemName = prompt("Enter new item name:");

    if (!itemName) {
        return;
    }

    const cleanName = itemName.trim();

    if (!cleanName) {
        return;
    }

    const exists = getAllItems().some(
        item => item.toLowerCase() === cleanName.toLowerCase()
    );

    if (exists) {

        alert("This item already exists.");

        return;
    }

    customItems.push(cleanName);

    localStorage.setItem(
        CUSTOM_ITEMS_KEY,
        JSON.stringify(customItems)
    );

    loadItems();

    pieceNameInput.value = cleanName;

    pieceNameInput.focus();
}


/* ================= CALCULATE FINE ================= */

function calculateFine(weight, touch) {

    return (weight * touch) / 100;
}


/* ================= CALCULATE MAJURI ================= */

/*
    Majuri entered by user = rate per kilogram.

    Example:
    Weight = 250 grams
    Majuri = ₹800/kg

    Making Charges =
    (250 / 1000) × 800
    = ₹200
*/

function calculateMajuri(weight, majuriRate) {

    return (weight / 1000) * majuriRate;
}


/* ================= ADD PIECE ================= */

function addPiece() {

    const itemName = pieceNameInput.value.trim();

    const weight = Number(weightInput.value);

    const touch = Number(touchInput.value);

    const majuriRate = Number(majuriInput.value);


    /* ---------- VALIDATION ---------- */

    if (!itemName) {

        alert("Please select an item.");

        pieceNameInput.focus();

        return;
    }


    if (!Number.isFinite(weight) || weight <= 0) {

        alert("Please enter a valid weight.");

        weightInput.focus();

        return;
    }


    if (!Number.isFinite(touch) || touch < 0 || touch > 100) {

        alert("Please enter a valid touch between 0 and 100.");

        touchInput.focus();

        return;
    }


    if (!Number.isFinite(majuriRate) || majuriRate < 0) {

        alert("Please enter a valid Majuri rate per kg.");

        majuriInput.focus();

        return;
    }


    /* ---------- CALCULATIONS ---------- */

    const fine = calculateFine(
        weight,
        touch
    );

    const majuri = calculateMajuri(
        weight,
        majuriRate
    );


    /* ---------- CREATE PIECE ---------- */

    const piece = {

        id: Date.now() + Math.random(),

        itemName: itemName,

        weight: weight,

        touch: touch,

        majuriRate: majuriRate,

        fine: fine,

        majuri: majuri
    };


    pieces.push(piece);


    /* ---------- UPDATE UI ---------- */

    renderPieces();

    updateTotals();


    /* ---------- CLEAR INPUTS ---------- */

    pieceNameInput.value = "";

    weightInput.value = "";

    touchInput.value = "";

    majuriInput.value = "";

    pieceNameInput.focus();
}


/* ================= RENDER PIECES ================= */

function renderPieces() {

    tableBody.innerHTML = "";

    if (pieces.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }

    emptyMessage.style.display = "none";


    pieces.forEach((piece, index) => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${escapeHTML(piece.itemName)}</td>

            <td>${piece.weight.toFixed(3)}</td>

            <td>${piece.touch.toFixed(2)}</td>

            <td>${piece.fine.toFixed(3)}</td>

            <td>₹${piece.majuri.toFixed(2)}</td>

            <td>
                <button
                    class="delete-btn"
                    data-id="${piece.id}">
                    Delete
                </button>
            </td>

        `;


        tableBody.appendChild(row);

    });
}


/* ================= DELETE PIECE ================= */

function deletePiece(id) {

    pieces = pieces.filter(
        piece => piece.id !== id
    );

    renderPieces();

    updateTotals();
}


/* ================= UPDATE TOTALS ================= */

function updateTotals() {

    let totalWeight = 0;

    let totalFine = 0;

    let totalMajuri = 0;


    pieces.forEach(piece => {

        totalWeight += piece.weight;

        totalFine += piece.fine;

        totalMajuri += piece.majuri;

    });


    totalPiecesElement.textContent =
        pieces.length;


    totalWeightElement.textContent =
        totalWeight.toFixed(3);


    totalFineElement.textContent =
        totalFine.toFixed(3);


    totalMajuriElement.textContent =
        totalMajuri.toFixed(2);
}


/* ================= CLEAR ALL ================= */

function clearAll() {

    if (pieces.length === 0) {
        return;
    }


    const confirmed = confirm(
        "Are you sure you want to clear all silver pieces?"
    );


    if (!confirmed) {
        return;
    }


    pieces = [];

    renderPieces();

    updateTotals();

    pieceNameInput.value = "";

    weightInput.value = "";

    touchInput.value = "";

    majuriInput.value = "";
}


/* ================= PRINT ================= */

function printPage() {

    if (pieces.length === 0) {

        alert(
            "Please add at least one silver piece before printing."
        );

        return;
    }

    window.print();
}


/* ================= ESCAPE HTML ================= */

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* ================= TABLE DELETE EVENT ================= */

tableBody.addEventListener("click", function(event) {

    const deleteButton =
        event.target.closest(".delete-btn");


    if (!deleteButton) {
        return;
    }


    const id = Number(
        deleteButton.dataset.id
    );


    deletePiece(id);
});


/* ================= BUTTON EVENTS ================= */

addPieceBtn.addEventListener(
    "click",
    addPiece
);


addItemBtn.addEventListener(
    "click",
    addNewItem
);


clearBtn.addEventListener(
    "click",
    clearAll
);


printBtn.addEventListener(
    "click",
    printPage
);


/* ================= ENTER KEY ================= */

document.addEventListener("keydown", function(event) {

    if (event.key !== "Enter") {
        return;
    }


    const activeElement = document.activeElement;


    if (
        activeElement === pieceNameInput ||
        activeElement === addItemBtn ||
        activeElement === clearBtn ||
        activeElement === printBtn
    ) {
        return;
    }


    event.preventDefault();

    addPiece();
});


/* ================= INITIALIZE ================= */

loadItems();

renderPieces();

updateTotals();