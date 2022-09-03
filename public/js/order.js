const orderNo = document.querySelector('.form-control');
const orderType = document.querySelectorAll('.form-check-input');
const radioTeba3a = document.querySelector('#Teba3a');
const radioSeba8a = document.querySelector('#Seba8a');
const Teba3a = document.querySelectorAll('.graphNo');
const Seba8a = document.querySelectorAll('.requiredColor');
const Dep2Type = document.querySelector('.Dep2Type');
const Dep2TypeInput = document.querySelector('.Dep2Type-input');
const errorBox = document.querySelector('.error');
const successBox = document.querySelector('.success');

if (successBox.innerText.length) {
  successBox.classList.add('success');
} else {
  successBox.classList.remove('success');
}

if (errorBox.innerText.length) {
  errorBox.classList.add('error');
} else {
  errorBox.classList.remove('error');
}

const sel = () => {
  if (Dep2TypeInput.value === 'قسم-الرام-تثبيت') {
    Dep2Type.value = 1;
  } else Dep2Type.value = 2;
};

Seba8a[0].style.display = 'none';
Seba8a[1].style.display = 'none';
Teba3a[0].style.display = 'none';
Teba3a[1].style.display = 'none';

radioTeba3a.addEventListener('click', () => {
  Seba8a[0].style.display = 'none';
  Seba8a[1].style.display = 'none';
  Teba3a[0].style.display = 'block';
  Teba3a[1].style.display = 'block';
  Teba3a[1].required = true;
  Seba8a[1].required = false;
});
radioSeba8a.addEventListener('click', () => {
  Seba8a[0].style.display = 'block';
  Seba8a[1].style.display = 'block';
  Teba3a[0].style.display = 'none';
  Teba3a[1].style.display = 'none';
  Teba3a[1].required = false;
  Seba8a[1].required = true;
});

const addOrder = () => {
  const orderNumber = orderNo.value;
  const sel = document.querySelector('.list');
  const type = document.querySelector('.list2');
  let arr = [orderNumber, type.value, new Date().toLocaleString(), type.value];
  socket.emit(sel, arr);
};

const socket = io('http://localhost:4000');
socket.on('connection');
