const orderNo = document.querySelector('.form-control');
const orderType = document.querySelectorAll('.form-check-input');
const addOrder = () =>{
   const orderNumber = orderNo.value;
   const sel = document.querySelector('.list');
   const type = document.querySelector('.list2');
   let arr = [orderNumber,type.value,new Date().toLocaleString(),type.value];
   socket.emit(sel,arr);
}
const socket = io('http://localhost:4000');
socket.on('connection');