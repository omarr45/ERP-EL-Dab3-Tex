const socket = io('https://el-dab3-tex.herokuapp.com/');
socket.on('connection');
socket.on('department2',(data)=>{
    console.log(data);


    // Creating elements
    const orderBox = document.createElement('div');
    const orderBody = document.createElement('div');
    const innerDiv = document.createElement('div');
    const orderHolder = document.createElement('h5');
    const orderTime = document.createElement('p');
    const orderType = document.createElement('p');
    const currentDepartment = document.createElement('p');
    const body = document.querySelector('body');
    const redirectionForm = document.createElement('form')
    const redirectionSelect = document.createElement('select');
    let redirectionOptionsArr = [];
    for(let i=0;i<3;i++){
        const redirectionOptions = document.createElement('option');
        redirectionOptionsArr.push(redirectionOptions);
    }
    const redirectionButton = document.createElement('button');
    const inputCurrDep = document.createElement('input');
    const inputCurrOrderNo = document.createElement('input');


    //Styling
    orderBox.style.width="18rem";
    redirectionButton.style.margin="10px";
    inputCurrDep.style.display="none";
    inputCurrOrderNo.style.display="none";


    //Adding classes
    orderBox.classList.toggle('card')
    orderBody.classList.toggle('card-body');
    innerDiv.classList.toggle('card-body');
    orderHolder.classList.toggle('card-title');
    orderTime.classList.toggle('card-text');
    orderType.classList.toggle('card-text');
    currentDepartment.classList.toggle('card-text');
    redirectionForm.classList.toggle('order-form');
    redirectionSelect.classList.toggle('form-select');
    redirectionButton.classList.toggle('btn');
    redirectionButton.classList.toggle('btn-primary');
    redirectionButton.classList.toggle('submit');


    //Adding another attributes
    redirectionForm.setAttribute('method','post');
    redirectionForm.setAttribute('action','/DepartmentRedirection');
    redirectionButton.setAttribute('type','submit');
    redirectionSelect.name="selection";
    inputCurrOrderNo.name="currentOrderNo";
    inputCurrOrderNo.setAttribute('value',data[0]);
    inputCurrDep.name="currentDep";
    inputCurrDep.setAttribute('value',data[3]);



    //Adding texts
    orderHolder.innerText=`Order Number : ${data[0]}`
    orderType.innerText=`Order Time :  ${data[2]}`;
    orderTime.innerText=`Order Type :${data[1]}`;
    currentDepartment.innerText=`Current Department :${data[3]}`;
    redirectionButton.innerText='Redirect';
    for(let i = 0 ;i<redirectionOptionsArr.length;i++){
        redirectionOptionsArr[i].innerText=`Dep${i+1}`;
        redirectionOptionsArr[i].value=`Dep${i+1}`;
    }


    //Body appending
    body.appendChild(orderBox);
    orderBox.appendChild(orderBody);
    orderBody.appendChild(orderHolder);
    orderBody.appendChild(orderType);
    orderBody.appendChild(orderTime)
    orderBody.appendChild(currentDepartment);
    orderBody.appendChild(redirectionForm);
    redirectionForm.appendChild(inputCurrDep);
    redirectionForm.appendChild(inputCurrOrderNo);
    redirectionForm.appendChild(redirectionSelect);
    redirectionForm.appendChild(redirectionButton);
    for(let i = 0 ;i<redirectionOptionsArr.length;i++){
        redirectionSelect.appendChild(redirectionOptionsArr[i]);
    }
});