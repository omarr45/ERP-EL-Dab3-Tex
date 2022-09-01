const orders = document.querySelectorAll('.orders-box');
const cards = document.querySelectorAll('.card');
const orderBox = document.querySelector('.orders-box');
const ordersHolder = orders[0].innerHTML;

const Dep2Type = document.querySelector('.Dep2Type');
const Dep2TypeInput = document.querySelector('.Dep2Type-input');



const sel = () =>{
    if(Dep2TypeInput.value === 'قسم-الرام-تثبيت'){
        Dep2Type.value = 1;
    }
    else if (Dep2TypeInput.value === 'قسم-الرام-تجهيز')
        Dep2Type.value = 2;
}


search = () =>{
    const searchInput = document.querySelector('.form-label-css');
    for(let i = 0 ;i<cards.length;i++) {
        let orderNo = cards[i].children[0].children[0].innerText;
        let clientName = cards[i].children[0].children[6].innerText;
        orderNo = orderNo.split(':');
        orderNo = orderNo[1].toString().replace(" ", '');
        clientName = clientName.split(':');
        clientName = clientName[1].toString().replace(' ','');
        //console.log(clientName);
        console.log(searchInput.value===clientName);
        if (searchInput.value === orderNo || (' '+searchInput.value)===clientName) {
            orderBox.innerHTML = "";
            orderBox.appendChild(cards[i]);
            break;
        }
        else {
            orderBox.innerHTML=ordersHolder;
        }
    }
}