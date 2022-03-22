const orders = document.querySelectorAll('.orders-box');
const cards = document.querySelectorAll('.card');
const orderBox = document.querySelector('.orders-box');
const ordersHolder = orders[0].innerHTML;
search = () =>{
    const searchInput = document.querySelector('.form-label-css');
    for(let i = 0 ;i<cards.length;i++) {
        let orderNo = cards[i].children[0].children[1].innerText;
        orderNo = orderNo.split(':');
        orderNo = orderNo[1].toString().replace(" ", '');
        if (searchInput.value === orderNo) {
            console.log('found');
            orderBox.innerHTML = "";
            orderBox.appendChild(cards[i]);
            break;
        }
        else {
            orderBox.innerHTML=ordersHolder;
        }
    }
}