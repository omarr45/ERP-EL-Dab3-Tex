const express = require('express');
require('dotenv').config();
const router = express.Router();
const Orders = require('../models/Orders');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let LocalStorage = require('node-localstorage').LocalStorage;
let dir = __dirname.replace('routes','');
localStorage = new LocalStorage('./scratch');

router.get('/',(req,res)=>{
    res.sendFile(dir+'/views/order.html');
})



//Authenticate
const auth = (req,res,next) => {
    if (!req.session.user)
        res.redirect('login');
    else {
        if (req.session.user.email === "admin@gmail.com")
            next();
        else
            res.sendStatus(403);
    }
}
const authDep1 = (req,res,next) =>{
    if (!req.session.user)
        res.redirect('login');
    else {
        if (req.session.user.email === "dep1@gmail.com")
            next();
        else
            res.sendStatus(403);
    }
}

const authDep2 = (req,res,next) =>{
    if (!req.session.user)
        res.redirect('login');
    else {
        if (req.session.user.email === "dep2@gmail.com")
            next();
        else
            res.sendStatus(403);
    }
}

const authDep3 = (req,res,next) =>{
    if (!req.session.user)
        res.redirect('login');
    else {
        if (req.session.user.email === "dep3@gmail.com")
            next();
        else
            res.sendStatus(403);
    }
}

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

//Login Route
let errors = [];
router.get('/login',(req,res)=>{
    res.render(dir+'views/Login.ejs',{error:errors});
});

router.post('/login',(req,res)=>{
    errors = [];
    Orders.findOne({email:req.body.email}).then(user=>{
        if(!user){
            errors.push('Wrong Email & Password Combination');
            res.render('Login',{error:errors});
        }
        else{
            if(user.password !== req.body.password){
                errors.push('Wrong Email & Password Combination');
                res.render('Login',{error:errors});
            }
            else {
                let token
                if (user.email === "admin@gmail.com") {
                    req.session.user = user;
                    req.session.save();
                    res.redirect('/Admin');
                }
                else if (user.email === "dep1@gmail.com") {
                    req.session.user = user;
                    req.session.save();
                    res.redirect('/Dep1');
                }
                else if (user.email === "dep2@gmail.com") {
                    req.session.user = user;
                    req.session.save();
                    res.redirect('/Dep2');
                }
                else if (user.email === "dep3@gmail.com") {
                    req.session.user = user;
                    req.session.save();
                    res.redirect('/Dep3');
                }
            }
        }
    })
});

//Logout route
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.render(dir+'views/Login.ejs',{error:errors});
})

//Departments routes
router.get('/Dep1',authDep1, async (req,res)=>{
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
    res.render(dir+'views/Dep1.ejs',{records:docsArr2});
})

router.get('/Dep2',authDep2, async (req,res)=>{
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
    res.render(dir+'views/Dep2.ejs',{records:docsArr2});
})

router.get('/Dep3',authDep3, async (req,res)=>{
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
    res.render(dir+'views/Dep3.ejs',{records:docsArr2});
})

router.get('/Admin',auth, async (req,res)=>{
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
        await Orders.updateOne({'orderNo': req.body.currentOrderNo},{$set:{'currentDepartment':req.body.selection}});
        console.log('order updated');
    }
    catch(err){throw err;}
    res.redirect(`/${req.body.currentDep}`);
})

module.exports = router;