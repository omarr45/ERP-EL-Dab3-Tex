const express = require('express');
const router = express.Router();
const Orders = require('../models/Orders');
router.get('/',(req,res)=>{
    res.sendFile('E:/Projects/eldabeeaaa/views/order.html');
})
// Order Routes
router.post('/addOrder',async (req,res)=>{
    const {orderNo,flexRadioDefault} = req.body;
    console.log(orderNo,flexRadioDefault);
    let currentDepartment;
    if(flexRadioDefault==='x')
        currentDepartment="Dep1";
    else if(flexRadioDefault==='y')
        currentDepartment="Dep2";
    else
        currentDepartment="Dep3";
    const newOrder = await new Orders({
        orderNo,
        type:flexRadioDefault,
        time:new Date().toLocaleString(),
        currentDepartment,
        Dep1:flexRadioDefault==='x',
        Dep2:flexRadioDefault==='y',
        Dep3:flexRadioDefault==='z'
    })
    newOrder.save();
    console.log("new order saved");
    res.redirect('/');
})


//Departments routes
router.get('/Dep1', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({currentDepartment:'Dep1'},{_id:0,time:1,orderNo: 1, type: 1,currentDepartment:1});
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){throw err}
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    //console.log(docsArr2);
    res.render('Dep1',{records:docsArr2});
})

router.get('/Dep2', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({currentDepartment:'Dep2'},{_id:0,time:1,orderNo: 1, type: 1,currentDepartment:1});
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){throw err}
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    //console.log(docsArr2);
    res.render('Dep2',{records:docsArr2});
})

router.get('/Dep3', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({currentDepartment:'Dep3'},{_id:0,time:1,orderNo: 1, type: 1,currentDepartment:1});
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){throw err}
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render('Dep3',{records:docsArr2});
})

router.get('/Admin', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({},{_id:0,time:1,orderNo: 1, type: 1,currentDepartment:1});
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){throw err}
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render('Admin',{records:docsArr2});
})

router.post('/DepartmentRedirection',async (req,res)=>{
    try{
        console.log(req.body.currentOrderNo);
        console.log(req.body.selection);
        console.log(req.body.currentDep);
        await Orders.updateOne({'orderNo': req.body.currentOrderNo},{$set:{'currentDepartment':req.body.selection}});
        console.log('order updated');
    }
    catch(err){throw err;}
    res.redirect(`/${req.body.currentDep}`);
})

module.exports = router;