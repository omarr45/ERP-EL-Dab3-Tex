const express = require('express');
require('dotenv').config();
const router = express.Router();
const Orders = require('../models/Orders');
const jwt = require('jsonwebtoken');
let LocalStorage = require('node-localstorage').LocalStorage;
let dir = __dirname.replace('orderRoutes','');
localStorage = new LocalStorage('./scratch');
router.get('/',(req,res)=>{
    res.sendFile(dir + '/views/order.html');
})

//Authenticate
const auth = (req,res,next) =>{
    let token=null;
    token = localStorage.getItem('accessTokenAdmin');
    console.log("middleware token:   " + token);
    if(token!==null){
        req.token = token;
        next();
    }
    else{
        res.sendStatus(403);
    }
}

const authDep1 = (req,res,next) =>{
    let token=null;
    token = localStorage.getItem('accessTokenDep1');
    console.log("middleware token:   " + token);
    if(token!==null){
        req.token = token;
        next();
    }
    else{
        res.sendStatus(403);
    }
}

const authDep2 = (req,res,next) =>{
    let token=null;
    token = localStorage.getItem('accessTokenDep2');
    console.log("middleware token:   " + token);
    if(token!==null){
        req.token = token;
        next();
    }
    else{
        res.sendStatus(403);
    }
}

const authDep3 = (req,res,next) =>{
    let token=null;
    token = localStorage.getItem('accessTokenDep3');
    console.log("middleware token:   " + token);
    if(token!==null){
        req.token = token;
        next();
    }
    else{
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
let errors = [];
//Login Route
router.get('/Login',(req,res)=>{
    res.render(dir + '/views/login.ejs',{error:errors});
});

router.post('/login',(req,res)=>{
    console.log(req.body.email);
    Orders.findOne({email:req.body.email}).then(user=>{
        if(!user){
            errors.push('Wrong Email & Password Combination');
            res.render('Login',{error:errors});
        }
        else{
            if(user.password !== req.body.password){
                errors.push('Wrong Email & Password Combination');
            }
            else {
                let token
                if (user.email === "admin@gmail.com") {
                    token =  jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET_ADMIN,{expiresIn: '120m'});
                    localStorage.setItem('accessTokenAdmin',token);
                    res.redirect('/Admin');
                }
                else if (user.email === "dep1@gmail.com") {
                    token =  jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET_DEP1,{expiresIn: '120m'});
                    localStorage.setItem('accessTokenDep1',token);
                    res.redirect('/Dep1');
                }
                else if (user.email === "dep2@gmail.com") {
                    token =  jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET_DEP2,{expiresIn: '120m'});
                    localStorage.setItem('accessTokenDep2',token);
                    res.redirect('/Dep2');
                }
                else if (user.email === "dep3@gmail.com") {
                    token =  jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET_DEP3,{expiresIn: '120m'});
                    localStorage.setItem('accessTokenDep3',token);
                    res.redirect('/Dep3');
                }
            }
        }
    })
});

//Logout route
router.get('/logoutAdmin',(req,res)=>{
    localStorage.setItem('accessTokenAdmin',null);
    res.render('login',{error:errors});
})

router.get('/logoutDep1',(req,res)=>{
    localStorage.setItem('accessTokenDep1',null);
    res.render('login',{error:errors});
})

router.get('/LogoutDep2',(req,res)=>{
    localStorage.setItem('accessTokenDep2',null);
    res.render('login',{error:errors});
})

router.get('/logoutDep3',(req,res)=>{
    localStorage.setItem('accessTokenDep3',null);
    res.render('login',{error:errors});
})

//Departments routes
router.get('/Dep1',authDep1, async (req,res)=>{
    jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET_DEP1,(err,authData)=>{
        if(err)
            res.sendStatus(403);
        else
            console.log(authData);
    });
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

router.get('/Dep2',authDep2, async (req,res)=>{
    jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET_DEP2,(err,authData)=>{
        if(err)
            res.sendStatus(403);
        else
            console.log(authData);
    });
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

router.get('/Dep3',authDep3, async (req,res)=>{
    jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET_DEP3,(err,authData)=>{
        if(err)
            res.sendStatus(403);
        else
            console.log(authData);
    });
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

router.get('/Admin',auth, async (req,res)=>{
    jwt.verify(req.token,process.env.ACCESS_TOKEN_SECRET_ADMIN,(err,authData)=>{
        if(err)
            res.sendStatus(403);
        else
            console.log(authData);
    });
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