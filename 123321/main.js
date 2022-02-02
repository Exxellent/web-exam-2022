let apiKey = "eb3e7937-3673-4b44-b7b4-d266e8503ef3";
let apiUrl =
    "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";
let restaurantsJson;
let selectedRestaurant;


async function getRestaurants() {
    let url = new URL(apiUrl);
    url.searchParams.set("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    restaurantsJson = json;
    return json;
}

function createRestaurantTableItem(record) {
    let item = document.querySelector("#tr-template").cloneNode(true);
    item.classList.remove("d-none");
    item.querySelector(".restaurant-name").innerHTML = record.name;
    item.querySelector(".restaurant-type").innerHTML = record.typeObject;
    item.querySelector(".restaurant-addr").innerHTML = record.address;
    item.querySelector(".restaurant-id").value = record.id;
    item.querySelector(".btn-choose").onclick = chooseRest;

    return item;
}

function renderRecords(records) {
    let restaurantTable = document.querySelector("tbody");
    for (let i = 0; i < records.length; i++) {
        restaurantTable.append(createRestaurantTableItem(records[i]));
    }
    getFilter();
}

function filterRecords() {
    let selectedAdm = document.getElementById("area").value;
    let selectedDistrict = document.getElementById("district").value;
    let selectedType = document.getElementById("type").value;
    let selectedDiscount = document.getElementById("discount").value;
    let restaurantTable = document.querySelector("tbody");
    while (restaurantTable.children.length > 1) {
        restaurantTable.removeChild(restaurantTable.lastChild);
    }

    for (let i = 0; i < restaurantsJson.length; i++) {
        if (
            (selectedAdm == "Не выбрано" ||
                selectedAdm == restaurantsJson[i].admArea) &&
            (selectedDistrict == "Не выбрано" ||
                selectedDistrict == restaurantsJson[i].district) &&
            (selectedDiscount == "Не выбрано" ||
                selectedDiscount == restaurantsJson[i].socialPrivileges) &&
            (selectedType == "Не выбрано" ||
                selectedType == restaurantsJson[i].typeObject)
        ) {
            restaurantTable.append(createRestaurantTableItem(restaurantsJson[i]));
        }
    }
}

function getFilter() {
    var arrType = [];
    for (let i = 0; i < restaurantsJson.length; i++) {
        arrType.push(restaurantsJson[i].typeObject);
    }
    var unarr = new Set(arrType);

    for (let value of unarr) {
        let qwe = document.createElement("option");
        qwe.innerHTML = value;
        document.querySelector("#type").appendChild(qwe);
    }

    var arrAdm = [];
    for (let i = 0; i < restaurantsJson.length; i++) {
        arrAdm.push(restaurantsJson[i].admArea);
    }
    var unarr = new Set(arrAdm);

    for (let value of unarr) {
        let qwe = document.createElement("option");
        qwe.innerHTML = value;
        document.querySelector("#area").appendChild(qwe);
    }

    var arrDistrict = [];
    for (let i = 0; i < restaurantsJson.length; i++) {
        arrDistrict.push(restaurantsJson[i].district);
    }
    var unarr = new Set(arrDistrict);

    for (let value of unarr) {
        let qwe = document.createElement("option");
        qwe.innerHTML = value;
        document.querySelector("#district").appendChild(qwe);
    }
}



function countplus(event) {
    let qwe = event.target.closest("div");    
    let count = qwe.querySelector('span')
    count.innerHTML++;
    countOrder();
}
function countmin(event) {
    let qwe = event.target.closest("div");    
    let count = qwe.querySelector('span')
    if (count.innerHTML>0)
        count.innerHTML--;
    countOrder();
}


function countOrder() {
    let CoOrder = document.querySelectorAll(".count-order");
    let countDish = document.querySelectorAll(".countSpan");
    let price = document.querySelectorAll(".pricing-card");
    let summ = 0;
    let masPrice = [];
    let masDish = [];
    for ( let h of price){
        masPrice.push(h.textContent)
    }
    for (let span of countDish) {
        masDish.push(span.textContent)
    }
    for (let i = 0; i<=9;i++){
        summ += masPrice[i+1]*masDish[i+1];
    }
    for (let i of CoOrder){
        i.innerHTML=summ;
    }
    
}

function checkoption() {
    countOrder();
    let CoOrder = document.querySelector(".count-order");
    let option1 = document.getElementById("faster-delivery");
    let option2 = document.getElementById("soc-disc");
    if (option1.checked) {CoOrder.innerHTML *=1.2}
    if (option2.checked && selectedRestaurant.socialPrivileges){CoOrder.innerHTML *= 1-(selectedRestaurant.socialDiscount/100)}
    else if ((!option1.checked && !option2.checked)) countOrder();
    
}






async function getSet() {
    let response = await fetch("http://external.std-1611.ist.mospolytech.ru/set.json");
    let json = await response.json();
    return json;
}

function createSet(record) {
    let cart = document.querySelector(".card").closest(".col").cloneNode(true);
    cart.classList.remove("d-none");
    cart.querySelector('img').src=record.img;
    cart.querySelector(".name-set").innerHTML=record.name;
    cart.querySelector(".description").innerHTML=record.description;
    return cart;

}

function recordSet(records) {
    let menu = document.querySelector(".card").closest(".row");
    for (let i = 0; i < records.length; i++) {
       menu.append(createSet(records[i]));
    }
    for (let btn of document.querySelectorAll(".btn-plus")) {
        btn.onclick = countplus;
    }
    for (let btn of document.querySelectorAll(".btn-minus")) {
        btn.onclick = countmin;
    }

}

function clearsets() {
    let menu = document.querySelectorAll(".cart");
    for (let i = 11; i < menu.length; i++) {
        menu[i].remove();
    }
}
function setPrice(){
    let price = document.querySelectorAll(".pricing-card")
    setnum=0;
    for (let h5 of price) {
        h5.innerHTML=selectedRestaurant["set_"+setnum];
        ++setnum;
    }
}

function chooseRest(event) {
    let id = event.target.closest("form").querySelector(".restaurant-id").value;
    getSet().then(recordSet).then(clearsets).then(function () {
        getRestById(id).then(setPrice).then(countOrder).then(checkoption)
    });


}

async function getRestById(id) {
    let url = new URL(apiUrl + `/${id}`);
    url.searchParams.set("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    selectedRestaurant = json;
    return json;
}





window.onload = function() {
    getRestaurants().then(renderRecords);
    document.querySelector("#find").onclick = filterRecords;
    document.querySelector("#faster-delivery").onclick = checkoption;
    document.querySelector("#soc-disc").onclick = checkoption;

    for (let btn of document.querySelectorAll(".btn-choose")) {
        btn.onclick = chooseRest;
    }

}








