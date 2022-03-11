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
    if(flexRadioDefault==='x') {
        currentDepartment = "Dep1";
        try {
            const newOrder = await new Orders({
                orderNo,
                type: flexRadioDefault,
                time: new Date().toLocaleString(),
                currentDepartment,
                Dep1: true,
                Dep2: false,
                Dep3: false,
                visitedDeps: currentDepartment,
                Dep1EntryTime: new Date().toLocaleString(),
                DepNo:1
            })
            newOrder.save();
        }
        catch (err){throw err;}
    }
    else if(flexRadioDefault==='y') {
        currentDepartment = "Dep2";
        try {
            const newOrder = await new Orders({
                orderNo,
                type: flexRadioDefault,
                time: new Date().toLocaleString(),
                currentDepartment,
                Dep1: false,
                Dep2: true,
                Dep3: false,
                visitedDeps: currentDepartment,
                Dep2EntryTime: new Date().toLocaleString(),
                DepNo:1
            })
            newOrder.save();
        }
        catch (err){throw err;}
    }
    else if(flexRadioDefault==='z') {
        currentDepartment = "Dep3";
        try{
            const newOrder = await new Orders({
                orderNo,
                type: flexRadioDefault,
                time: new Date().toLocaleString(),
                currentDepartment,
                Dep1: false,
                Dep2: false,
                Dep3: true,
                visitedDeps: currentDepartment,
                Dep3EntryTime: new Date().toLocaleString(),
                DepNo:1
            })
            newOrder.save();
        }
        catch (err){throw err;}
    }
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
    console.log(docsArr2);
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
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            visitedDeps:1,
            Dep1EntryTime:1,
            Dep1ExitTime:1,
            Dep2EntryTime:1,
            Dep2ExitTime:1,
            Dep3EntryTime:1,
            Dep3ExitTime:1,
            DepNo:1
        });
        console.log(docs);
        docs.forEach(doc=>{
            console.log(doc);
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){throw err}
    let docsArr2 = [];
    let isDep=0;
    let isVis=0;
    let depTimes = [];
    let visitedDeps = [];
   //console.log(docs[1]);
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=='' && re!==/\n/g && re!=='false'){
                docsArr2.push(re);
                console.log(re);
                if(re==='Dep1EntryTime:') {
                    isDep = 1;
                    isVis = 0;
                }
                if(isVis)
                    visitedDeps.push(re);
                if(re==='visitedDeps:')
                    isVis=1;
                if(isDep)
                    depTimes.push(re);
                if(re==="DepNo")
                    isDep=0;
            }
        })
    })
    let deps = visitedDeps[0].split('-');
    //console.log(depTimes);
   // console.log(deps);
    res.render('Admin',{records:docs,times:depTimes,deps:deps});
})

router.post('/DepartmentRedirection',async (req,res)=>{
    // To get the visitedDeps value;
    console.log("i am here");
    let docs;
    let docsArr = [];
    let DepNo = [];
    // to get total number of visited deps
    try {
        docs = await Orders.find({'orderNo': req.body.currentOrderNo},{
            __v:0,
            _id:0,
            time:0,
            orderNo: 0,
            type: 0,
            currentDepartment:0,
            Dep1:0,
            Dep2:0,
            Dep3:0,
            email:0,
            password:0,
            Dep1EntryTime:0,
            Dep1ExitTime:0,
            Dep2EntryTime:0,
            Dep2ExitTime:0,
            Dep3EntryTime:0,
            Dep3ExitTime:0,
            Dep4EntryTime:0,
            Dep4ExitTime:0,
            Dep5EntryTime:0,
            Dep5ExitTime:0,
            Dep6EntryTime:0,
            Dep6ExitTime:0,
            visitedDeps:0
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{'}]/g,'  ');
            DepNo.push(docHolder.split(':'));
        })
    }
    catch (err){throw err}

    // to get visited deps
    try {
        docs = await Orders.find({'orderNo': req.body.currentOrderNo},{
            __v:0,
            _id:0,
            time:0,
            orderNo: 0,
            type: 0,
            currentDepartment:0,
            Dep1:0,
            Dep2:0,
            Dep3:0,
            email:0,
            password:0,
            Dep1EntryTime:0,
            Dep1ExitTime:0,
            Dep2EntryTime:0,
            Dep2ExitTime:0,
            Dep3EntryTime:0,
            Dep3ExitTime:0,
            Dep4EntryTime:0,
            Dep4ExitTime:0,
            Dep5EntryTime:0,
            Dep5ExitTime:0,
            Dep6EntryTime:0,
            Dep6ExitTime:0,
            DepNo:0
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{'}]/g,'  ');
            docsArr.push(docHolder.split(':'));
        })
    }//13 => 15
    catch (err){throw err}
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=='' && re!=='\\n' && re!=='false'){
                docsArr2.push(re);
            }
        })
    })

    // Update its values
    //let depNoSpaces = docsArr2[1].replace(/ /g, '');
    let No = parseInt(DepNo[0][1]);
    No++;
    let x = docsArr2[1];
    x = x.replace(/^\s+|\s+$/gm,'');
    if(req.body.selection === "Dep1") {
        if(req.body.currentDep === "Dep2") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': req.body.selection,
                        'visitedDeps': `${x}`+`-${req.body.selection}`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(req.body.currentDep === "Dep3") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': req.body.selection,
                        'visitedDeps': `${x}`+`-${req.body.selection}`,
                        'Dep3ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(req.body.selection === "Dep2") {
        if(req.body.currentDep === "Dep1") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': req.body.selection,
                        'visitedDeps': `${x}`+`-${req.body.selection}`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep2EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(req.body.currentDep === "Dep3") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': req.body.selection,
                        'visitedDeps': `${x}`+`-${req.body.selection}`,
                        'Dep3ExitTime':new Date().toLocaleString(),
                        'Dep2EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(req.body.selection === "Dep3") {
        if(req.body.currentDep === "Dep1") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': req.body.selection,
                        'visitedDeps': `${x}`+`-${req.body.selection}`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep3EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(req.body.currentDep === "Dep2") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': req.body.selection,
                        'visitedDeps': `${x}`+`-${req.body.selection}`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep3EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    console.log(req.body.currentDep);
    res.redirect(`/${req.body.currentDep}`);
})

module.exports = router;