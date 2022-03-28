const orderNo = document.querySelector('.form-control');
const orderType = document.querySelectorAll('.form-check-input');
const radioTeba3a = document.querySelector('#Teba3a');
const radioSeba8a = document.querySelector('#Seba8a');
const Teba3a = document.querySelectorAll('.graphNo');
const Seba8a = document.querySelectorAll('.requiredColor');

Seba8a[0].style.display="none";
Seba8a[1].style.display="none";
Teba3a[0].style.display="none";
Teba3a[1].style.display="none";

radioTeba3a.addEventListener('click',()=>{

   Seba8a[0].style.display="none";
   Seba8a[1].style.display="none";
   Teba3a[0].style.display="block";
   Teba3a[1].style.display="block";
})
radioSeba8a.addEventListener('click',()=>{

   Seba8a[0].style.display="block";
   Seba8a[1].style.display="block";
   Teba3a[0].style.display="none";
   Teba3a[1].style.display="none";
})

const addOrder = () =>{
   const orderNumber = orderNo.value;
   const sel = document.querySelector('.list');
   const type = document.querySelector('.list2');
   let arr = [orderNumber,type.value,new Date().toLocaleString(),type.value];
   socket.emit(sel,arr);
}


const socket = io('http://localhost:4000');
socket.on('connection');