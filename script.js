/* =====================================
   SILVER FINE CALCULATOR
   ===================================== */


/* =====================================
   DEFAULT ITEM CATALOG
   ===================================== */

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



/* =====================================
   LOAD CUSTOM ITEMS
   ===================================== */

let customItems =
    JSON.parse(
        localStorage.getItem(
            "silverCustomItems"
        )
    ) || [];



/* =====================================
   COMBINE DEFAULT + CUSTOM ITEMS
   ===================================== */

let allItems = [
    ...defaultItems,
    ...customItems
];



/* =====================================
   SILVER PIECES
   ===================================== */

let pieces = [];



/* =====================================
   GET HTML ELEMENTS
   ===================================== */

const pieceNameInput =
    document.getElementById(
        "pieceName"
    );


const weightInput =
    document.getElementById(
        "weight"
    );


const touchInput =
    document.getElementById(
        "touch"
    );


const addPieceBtn =
    document.getElementById(
        "addPieceBtn"
    );


const addItemBtn =
    document.getElementById(
        "addItemBtn"
    );


const clearBtn =
    document.getElementById(
        "clearBtn"
    );


const printBtn =
    document.getElementById(
        "printBtn"
    );


const tableBody =
    document.getElementById(
        "piecesTableBody"
    );


const emptyMessage =
    document.getElementById(
        "emptyMessage"
    );


const totalPiecesElement =
    document.getElementById(
        "totalPieces"
    );


const totalWeightElement =
    document.getElementById(
        "totalWeight"
    );


const totalFineElement =
    document.getElementById(
        "totalFine"
    );



/* =====================================
   LOAD ITEM DROPDOWN
   ===================================== */

function loadItemDropdown() {

    /*
        Remove existing options except
        the first "Select Item" option.
    */

    pieceNameInput.innerHTML = `
        <option value="">
            Select Item
        </option>
    `;


    /* Add all items */

    allItems.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = item;

            option.textContent = item;

            pieceNameInput.appendChild(
                option
            );

        }
    );

}



/* =====================================
   ADD NEW ITEM TO CATALOG
   ===================================== */

function addNewItem() {

    const newItem =
        prompt(
            "Enter new item name:"
        );


    /* User cancelled */

    if (newItem === null) {

        return;
    }


    const itemName =
        newItem.trim();


    /* Empty name */

    if (itemName === "") {

        alert(
            "Please enter an item name."
        );

        return;
    }


    /* Check duplicate */

    const alreadyExists =
        allItems.some(
            item =>
                item.toLowerCase() ===
                itemName.toLowerCase()
        );


    if (alreadyExists) {

        alert(
            "This item already exists in the catalogue."
        );

        return;
    }


    /* Add custom item */

    customItems.push(
        itemName
    );


    /* Save in browser */

    localStorage.setItem(
        "silverCustomItems",
        JSON.stringify(
            customItems
        )
    );


    /* Update combined list */

    allItems.push(
        itemName
    );


    /* Reload dropdown */

    loadItemDropdown();


    /* Automatically select new item */

    pieceNameInput.value =
        itemName;


    alert(
        `"${itemName}" has been added to the catalogue.`
    );

}



/* =====================================
   FINE CALCULATION
   ===================================== */

/*

    Fine = (Weight × Touch) / 100

*/

function calculateFine(
    weight,
    touch
) {

    return (
        weight * touch
    ) / 100;

}



/* =====================================
   ADD PIECE
   ===================================== */

function addPiece() {


    const name =
        pieceNameInput.value;


    const weight =
        Number(
            weightInput.value
        );


    const touch =
        Number(
            touchInput.value
        );



    /* =================================
       VALIDATION
       ================================= */

    if (name === "") {

        alert(
            "Please select an item."
        );

        pieceNameInput.focus();

        return;
    }


    if (
        !Number.isFinite(weight) ||
        weight <= 0
    ) {

        alert(
            "Please enter a valid weight."
        );

        weightInput.focus();

        return;
    }


    if (
        !Number.isFinite(touch) ||
        touch < 0 ||
        touch > 100
    ) {

        alert(
            "Please enter a valid touch between 0 and 100."
        );

        touchInput.focus();

        return;
    }



    /* =================================
       CALCULATE FINE
       ================================= */

    const fine =
        calculateFine(
            weight,
            touch
        );



    /* =================================
       CREATE PIECE
       ================================= */

    const piece = {

        id:
            Date.now() +
            Math.random(),

        name:
            name,

        weight:
            weight,

        touch:
            touch,

        fine:
            fine

    };



    /* Add piece */

    pieces.push(
        piece
    );



    /* Update screen */

    renderPieces();

    updateTotals();



    /* Clear inputs */

    pieceNameInput.value = "";

    weightInput.value = "";

    touchInput.value = "";


    /* Focus item dropdown */

    pieceNameInput.focus();

}



/* =====================================
   DISPLAY PIECES
   ===================================== */

function renderPieces() {


    /* Clear table */

    tableBody.innerHTML = "";



    /* No pieces */

    if (
        pieces.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        return;
    }


    /* Hide empty message */

    emptyMessage.style.display =
        "none";



    /* Create rows */

    pieces.forEach(
        (piece, index) => {


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    ${escapeHTML(
                        piece.name
                    )}
                </td>


                <td>
                    ${piece.weight.toFixed(3)}
                </td>


                <td>
                    ${piece.touch.toFixed(2)}%
                </td>


                <td class="fine-value">
                    ${piece.fine.toFixed(3)}
                </td>


                <td>

                    <button
                        class="delete-btn"
                        onclick="deletePiece(${piece.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}



/* =====================================
   DELETE PIECE
   ===================================== */

function deletePiece(id) {


    pieces =
        pieces.filter(
            piece =>
                piece.id !== id
        );


    renderPieces();

    updateTotals();

}



/* =====================================
   UPDATE TOTALS
   ===================================== */

function updateTotals() {


    let totalWeight = 0;

    let totalFine = 0;



    pieces.forEach(
        piece => {

            totalWeight +=
                piece.weight;

            totalFine +=
                piece.fine;

        }
    );



    totalPiecesElement.textContent =
        pieces.length;


    totalWeightElement.textContent =
        totalWeight.toFixed(3);


    totalFineElement.textContent =
        totalFine.toFixed(3);

}



/* =====================================
   CLEAR ALL
   ===================================== */

function clearAll() {


    if (
        pieces.length === 0
    ) {

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to clear all pieces?"
        );


    if (!confirmed) {

        return;
    }


    pieces = [];


    renderPieces();

    updateTotals();

}



/* =====================================
   PRINT
   ===================================== */

function printPage() {

    window.print();

}



/* =====================================
   ESCAPE HTML
   ===================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;

}



/* =====================================
   BUTTON EVENTS
   ===================================== */

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



/* =====================================
   ENTER KEY
   ===================================== */

document.addEventListener(
    "keydown",
    function (event) {

        /*
            Press Enter to add a piece.
        */

        if (
            event.key === "Enter" &&
            document.activeElement !==
            addItemBtn &&
            document.activeElement !==
            clearBtn &&
            document.activeElement !==
            printBtn
        ) {

            /*
                Don't add a piece when
                typing/using the dropdown.
            */

            if (
                document.activeElement ===
                pieceNameInput
            ) {
                return;
            }


            addPiece();

        }

    }
);



/* =====================================
   INITIALIZE
   ===================================== */

loadItemDropdown();

renderPieces();

updateTotals();