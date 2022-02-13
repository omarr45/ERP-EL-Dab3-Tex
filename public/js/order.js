const orderNo = document.querySelector('.form-control');
const orderType = document.querySelectorAll('.form-check-input');
const addOrder = () =>{
    let x=orderNo.value;
    let f;
    if(orderType[0].checked)
        f='x';
    else if(orderType[1].checked)
        f='y';
    else
        f='z';
    let currentDepartment;
    if(f==='x')
        currentDepartment='Dep1';
    else if(f==='y')
        currentDepartment='Dep2';
    else
        currentDepartment='Dep3';
    console.log(currentDepartment);
    const arr = [x,f,new Date().toLocaleString(),currentDepartment];
    console.log(arr[3]);
    if(f==='x')
        socket.emit('department1',arr);
    else if(f==='y')
        socket.emit('department2',arr);
    else
        socket.emit('department3',arr);
}
const socket = io('http://localhost:4000');
socket.on('connection');