// SET GLOBAL VARIBALES
const itemForm = document.getElementById('item-form'); // this is <form>
const itemInput = document.getElementById('item-input'); // this is id for <input>
const itemList = document.getElementById('item-list'); // this is <ul>
const clearBtn = document.getElementById('clear');
const filter = document.getElementById('filter');
const items = itemList.querySelectorAll('li');
const formBtn = document.querySelector('button')
let isEdit = false;


// FUNCTION TO RETRIEVE LIST ITEMS WHEN PAGE LOADS THAT ARE SET IN LOCAL STORAGE
function displayItems() {
    const itemsFromStorage = getItemsFromLocalStorage()

    // looops through each item in local stroage to render them onto page via addItemToDOM function
    itemsFromStorage.forEach(item => addItemToDOM(item))
    // calls checkUI function to determine if "filter" and "Clear all" button should render
    checkUI();
}

// GENERAL FUNCTION TO CONTROL ALL ACTIONS UPON CLICKING "ADD ITEM" BUTTON
function onAddItemSubmit(e) {
    e.preventDefault();

    // event connected to itemInput id on HTML form
    const newItem = itemInput.value

    // simple validation: if no text is entered, user receives an alert
    if (newItem.value === '') {
        alert("Enter input")
        return;
    }
    // check for edit mode
    if (isEdit) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        // remove old item from local storage so new one can be added
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEdit - false;
    } else {
        // calls function to prevent duplicate entries 
        if (checkIfItemExists(newItem)) {
            alert("That item already exists");
            return;
        }
    }
    // calls the followig functions with argument (newItem) to be passed into function parameters
    addItemToDOM(newItem)
    addItemToStorage(newItem)

    checkUI();

    // resets HTML form to empty placeholder
    itemInput.value = '';
};

// FUNCTION TO ADD LIST ITEM TO PAGE
function addItemToDOM(item) {
    // create "li" element to be added to DOM
    const li = document.createElement('li')

    // append item to the <li> tag, (newItem) argument being passed into (item) from line 33 call
    li.appendChild(document.createTextNode(item))

    // create <button> element via createButton function on line 60. Argument is for (classes) in createButton function
    const button = createButton("remove-item btn-link text-red");
    // append <button> to <li>
    li.appendChild(button);

    // item list is <ul> parent of <li>
    itemList.appendChild(li)
}

// FUNCTION TO CREATE BUTTON, TAKES IN CLASSES FROM CALL IN PREVIOUS FUNCTION
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;

    // icon function called with (classes) argument and appended to <button> element
    const icon = createIcon("fa-solid fa-xmark")
    button.appendChild(icon)
    return button;
}

// FUNCTION TO CREATE ICON, TAKES IN (CLASSES) FROM CALL IN PREVIOUS FUNCTION
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon
}

// ADDS (NEWITEM) TO LOCAL STORAGE
function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromLocalStorage();

    // empty array for this push found in next function
    itemsFromStorage.push(item)
    // JSON stringify to create array of strings in local storage to persist entries upon page reload
    localStorage.setItem("items", JSON.stringify(itemsFromStorage))
}

// RETRIEVE LOCAL STORAGE ITEMS IF THERE ARE ANY UPON PAGE LOAD 
function getItemsFromLocalStorage() {
    // checks to see if there are any items in local storage, if not, create empty array for newItems
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
        // if items do exist, then retrieve them via JSON.stringify("items")
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage;
}

// HANDLER TO DO DIFFERENT FUNCTIONS UPON CLICK EVENT on <li> ELEMENT
function onClickItem(e) {
    // if "x" is clicked, then call remove item from page
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)

        // if text is clicked, it will call the edit function and pass (e.trget) into (item) parameter
    } else {
        editItem(e.target)
    }
}

// FUNCTION TO PREVENT DUPLICATES IN UI LIST
function checkIfItemExists(item) {
    const itemFromStorage = getItemsFromLocalStorage();
    // if the same item already exists
    return itemFromStorage.includes(item)
}

function editItem(item) {
    // when text is clicked, idEdit is set to true.
    isEdit = true;

    // this forEach loop makes sure that only the selected item changes color and changes back if another element is selected
    itemList.
    querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'))

    // color of text changes upon click
    item.classList.add('edit-mode')

    // button content and style changes to reflect state chage into edit mode
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = 'green'
    itemInput.value = item.textContent.trim()
    
}

function removeItem(item) {
    if (confirm("Are you sure?"))
        item.remove();

    // Remove item from Storage
    removeItemFromStorage(item.textContent)

    checkUI;
}

function removeItemFromStorage(item) {
    // this variable gets the array of local storage objects
    let itemsFromStorage = getItemsFromLocalStorage();

    // redefine variable to create new array minus the selected one for 
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // reset the new array to local storage without selected item
    localStorage.setItem("items", JSON.stringify(itemsFromStorage))
}

function removeAll() {
    // while loop
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }
    // clear form local storage
    localStorage.removeItem('items')

    checkUI();
}

function filterItem(e) {  // lists only items that 
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li')

    items.forEach((item) => {
        const itemName = item.textContent.toLowerCase();
        // if (itemName.indexOf(text) != -1) {  **** indexOf works on 0 / -1 values, -1 is false

        //     console.log(true)
        // }

        if (itemName.includes(text)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none"
        }
    })
}

// FUNTION TO REST UI AND HIDE UNNECESSARY ELEMENTS DURING UX 
function checkUI() {
    itemInput.value = "";
    const items = itemList.querySelectorAll('li')
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        filter.style.display = 'none';
    } else {
        clearBtn.style.display = "block";
        filter.style.display = "block";
    }
    formBtn.innerHTML = '<li class="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = "#333"

}

// INITIAL RENDERING WHEN PAGE LOADS
function init() {
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', removeAll);
    filter.addEventListener('input', filterItem);
    document.addEventListener("DOMContentLoaded", displayItems);

    checkUI();
}

init()

// localStorage.setItem("name", "Rod")
// localStorage.setItem("address", "727") // set item has key/vale pair
// console.log(localStorage.getItem("address")) // get item is called by key
// localStorage.removeItem("address") // remove item only uses key
// localStorage.clear()

