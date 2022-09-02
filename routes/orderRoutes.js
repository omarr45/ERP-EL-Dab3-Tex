const express = require('express');
require('dotenv').config();
const router = express.Router();
const Orders = require('../models/Orders');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let LocalStorage = require('node-localstorage').LocalStorage;
let dir = __dirname.replace('routes','');
localStorage = new LocalStorage('./scratch');


const ordersMap = new Map();
let successOrder = [];

router.get('/arr',async (req,res)=>{
    try {
        const res2 =  await Orders.updateOne({ 'email':'yasser@gmail.com' },
            {$push: {optionList: ["فايبر-ساده","فايبر-بيتش-ساده","اسبن-مطبوع","اسبن-ساده","بوركيني","كوت","زبده-ساده","زبده-مطبوع","موهير-ساده",
                    "موهير-مطبوع","شعيرات-مايوه","بوركيني","مايوه-ميامي","دفايه-شعيرات-مطبوع","دفايه-شعيرات-مطبوع-بيتش","دفايه-شعيرات-ساده","دفايه شعيرات-ساده-بيتش",
                    "فيجا-خفيف","فيجا-تقيل","فيجا-اطفال","ميلتون-اسبن","ميلتون-قطن","ميلتون-اسلب","بولار-مطبوع","بولار-ساده","بولار-حفر","ميلتون-قطن",
                    "فرو-ثقيل","براش-بيتش","كوريشه","سمر-ميلتون-مبرد","بور-نت"]}});
    }
    catch(err){
        console.log("error");
    }
    console.log("done");
    res.redirect('/');
});


router.get('/',async(req,res)=>{
    let docs;
    let docsArr = [];
    let options = []
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){console.log("errorr mesh 3aref eh")}
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    try{
        options = await Orders.find({email:"yasser@gmail.com"},{optionList:1});
    }
    catch (err){
        console.log("hena error el options");
    }
    for(let k = 0 ;k<docs.length;k++){
        ordersMap.set(docs[k].orderNo,"1");
    }
    res.render(dir+'/views/order.ejs',{records:docs,errorsOrder:errorsOrder,successOrder:successOrder,options:options[0].optionList});
    successOrder = [];
    errorsOrder = [];
})

// Delete order Route
router.post('/DeleteOrder',async(req,res)=>{
    try{
        const DeletedOrder = await Orders.deleteOne({orderNo:req.body.currentOrderNo});
        console.log("Order Deleted Successfully");
    }
    catch (err) {
        res.redirect('/login');
    };
    console.log(req.body.page);
    if(req.body.page === "order") {
        successOrder.push("تم مسح الاوردر بنجاح")
        res.redirect('/');
    }
    else
        res.redirect('/Admin');
})

router.get('/Shops',async(req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,time:1,orderNo: 1, type: 1,currentDepartment:1,clientName:1,Notes:1,redirectionType:1,graphNo:1,requiredColor:1});
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
    res.render(dir+'/views/Shops.ejs',{records:docs});
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
let errorsOrder = []
let errors = [];
router.post('/addOrder',async (req,res)=>{
    errorsOrder = []
    let options;
    const {orderNo,orderType,orderDep,flexRadioDefault,clientName,Notes, graphNo , requiredColor, Dep2Type,
        flexRadioDefault2, mediumRequired, widthRequired, machineNo } = req.body;
    if(ordersMap.has(orderNo)){
        errorsOrder.push("هناك اوردر بنفس هذا الرقم من قبل")
        res.redirect('/');
    }
    else {
        console.log(orderDep + " " + flexRadioDefault + "  " + Dep2Type);
        if (orderDep === "قسم-الفرد") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep1: true,
                    visitedDeps: orderDep,
                    Dep1EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 1,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo
                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-الرام-تثبيت" || orderDep === "قسم-الرام-تجهيز") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: 'قسم-الرام',
                    Dep2: true,
                    visitedDeps: 'قسم-الرام',
                    Dep2EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 2,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo
                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-طباعه") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep3: true,
                    visitedDeps: orderDep,
                    Dep3EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 3,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-صباغه") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep4: true,
                    visitedDeps: orderDep,
                    Dep4EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 4,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-وبريات") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep5: true,
                    visitedDeps: orderDep,
                    Dep5EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 5,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-كستره") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep6: true,
                    visitedDeps: orderDep,
                    Dep6EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 6,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep7: true,
                    visitedDeps: orderDep,
                    Dep7EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 7,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-تجهيز-علي-المقفول") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep8: true,
                    visitedDeps: orderDep,
                    Dep8EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 8,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-تغليف") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep9: true,
                    visitedDeps: orderDep,
                    Dep9EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 9,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-غسيل-الطباعه") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep10: true,
                    visitedDeps: orderDep,
                    Dep10EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 10,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        } else if (orderDep === "قسم-جاهز-للاستلام") {
            try {
                const newOrder = await new Orders({
                    orderNo,
                    type: orderType,
                    time: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    currentDepartment: orderDep,
                    Dep10: true,
                    visitedDeps: orderDep,
                    Dep11EntryTime: new Date().toLocaleString('en-EG', {timeZone: 'Africa/Cairo'}),
                    DepNo: 11,
                    redirectionType: flexRadioDefault,
                    clientName,
                    Notes,
                    graphNo,
                    requiredColor,
                    Dep2Type,
                    textureType: flexRadioDefault2,
                    mediumRequired,
                    widthRequired,
                    machineNo

                })
                newOrder.save();
            } catch (err) {
                errorsOrder.push("لم يتم اضافه الاوردر برجاء تفقد شبكه الانترنت او الرجوع للمطور")
                res.render('Login', errorsOrder);
            }
        }
        console.log("new order saved");
        successOrder.push("تم اضافه الاوردر بنجاح");
        res.redirect('/');
    }
})

//Login Route
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
                    console.log("hello")
                    console.log(req.session);
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

// Dep1 = قسم الفرد
router.get('/Dep1', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{
            _id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    /*console.log(docs);
    console.log(docs[0].graphNo);*/
    res.render(dir+'views/Dep1.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})

//Dep2 = قسم الرام

router.get('/Dep2', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{
            _id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    //console.log(docsArr2);
    res.render(dir+'views/Dep2.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})

//Dep3 = قسم الرام

router.get('/Dep3', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{
            _id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep3.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})

// Dep4  = صباغه

router.get('/Dep4', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep4.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})


// Dep5  = بوليش

router.get('/Dep5', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep5.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})


// Dep6  = كستره

/*router.get('/Dep6', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep6.ejs',{records:docs});
})*/


// Dep7  = كومبكتور علي المفتوح

router.get('/Dep7', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep7.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})


// Dep8  = كومبكتور علي المقفول

router.get('/Dep8',async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    console.log(docs);
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep8.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})

// Dep9  = تغليف

router.get('/Dep9', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep9.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})

// Dep10  = جاهز للاستلام

router.get('/Dep10', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep10.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})

// Dep11  = جاهز للاستلام

router.get('/Dep11', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            Notes:1,
            redirectionType:1,
            graphNo:1,
            requiredColor:1,
            Dep2Type:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=''){
                docsArr2.push(re);
            }
        })
    })
    res.render(dir+'views/Dep11.ejs',{records:docs,successOrder:successOrder});
    successOrder = [];
})


router.get('/Admin', async (req,res)=>{
    let docs;
    let docsArr = [];
    try {
        docs = await Orders.find({email:false},{_id:0,
            time:1,
            orderNo: 1,
            type: 1,
            currentDepartment:1,
            clientName:1,
            redirectionType:1,
            Notes:1,
            visitedDeps:1,
            Dep1EntryTime:1,
            Dep1ExitTime:1,
            Dep2EntryTime:1,
            Dep2ExitTime:1,
            Dep3EntryTime:1,
            Dep3ExitTime:1,
            Dep4EntryTime:1,
            Dep4ExitTime:1,
            Dep5EntryTime:1,
            Dep5ExitTime:1,
            Dep6EntryTime:1,
            Dep6ExitTime:1,
            Dep7EntryTime:1,
            Dep7ExitTime:1,
            Dep8EntryTime:1,
            Dep8ExitTime:1,
            Dep9EntryTime:1,
            Dep9ExitTime:1,
            Dep10EntryTime:1,
            Dep10ExitTime:1,
            Dep11EntryTime:1,
            Dep11ExitTime:1,
            DepNo:1,
            graphNo:1,
            requiredColor:1,
            textureType:1,
            mediumRequired:1,
            widthRequired:1,
            machineNo:1,
            inchNo:1
        });
        //console.log(docs);
        docs.forEach(doc=>{
            //console.log(doc);
            let docHolder = doc.toString().replace(/[{',}]/g,'  ');
            docsArr.push(docHolder.split(' '));
        })
    }
    catch (err){
        errorsOrder.push("لم يتم اظهار القسم, تفقد شبكه الانترنت او الرجوع للمطور")
        res.render('Login',errorsOrder);
    }
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
                //console.log(re);
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
    let deps =[];
        //visitedDeps[0].split('-');
    //console.log(depTimes);
   // console.log(deps);
    res.render('Admin',{records:docs,times:depTimes,deps:deps});
})

router.post('/changeRequiredColor',async (req,res)=>{
    const {newColor,orderNo} = req.body;
    console.log(newColor + "  " + orderNo);
    try {
        await Orders.updateOne({'orderNo': orderNo}, {
            $set: {
                'requiredColor': newColor
            }
        });
    }
    catch (err){
        res.redirect('/dep4');
    }
    res.redirect('/dep4');
});

router.post('/changeGraphNo',async (req,res)=>{
    const {newNo,orderNo} = req.body;
    console.log(newNo + "  " + orderNo);
    try {
        await Orders.updateOne({'orderNo': orderNo}, {
            $set: {
                'graphNo': newNo
            }
        });
    }
    catch (err){
        res.redirect('/dep3');
    }
    res.redirect('/dep3');
});

router.post('/addType',async (req,res)=>{
    const {newType} = req.body;
    try {
        const res2 =  await Orders.updateOne({ 'email':'yasser@gmail.com' },
            {$push: {optionList:newType }});
    }
    catch(err){
        console.log("error");
    }
    console.log("done");
    res.redirect('/');
});



const departmentsEntryTime = new Map();
const departmentsExitTime = new Map();
departmentsExitTime.set('قسم-الفرد','Dep1ExitTime');
departmentsExitTime.set('قسم-الرام-تثبيت','Dep2ExitTime');
departmentsExitTime.set('قسم-الرام-تجهيز','Dep2ExitTime');
departmentsExitTime.set('قسم-طباعه','Dep3ExitTime');
departmentsExitTime.set('قسم-صباغه','Dep4ExitTime');
departmentsExitTime.set('قسم-صباغه','Dep4ExitTime');
departmentsExitTime.set('قسم-وبريات','Dep5ExitTime');
departmentsExitTime.set('قسم-كستره','Dep6ExitTime');
departmentsExitTime.set('قسم-كمبكتور-علي-المفتوح','Dep7ExitTime');
departmentsExitTime.set('قسم-تجهيز-علي-المقفول','Dep8ExitTime');
departmentsExitTime.set('قسم-تغليف','Dep9ExitTime');
departmentsExitTime.set('قسم-غسيل-الطباعه','Dep10ExitTime');
departmentsExitTime.set('قسم-جاهز-للاستلام','Dep11ExitTime');

departmentsEntryTime.set('قسم-الفرد','Dep1EntryTime');
departmentsEntryTime.set('قسم-الرام-تثبيت','Dep2EntryTime');
departmentsEntryTime.set('قسم-الرام-تجهيز','Dep2EntryTime');
departmentsEntryTime.set('قسم-طباعه','Dep3EntryTime');
departmentsEntryTime.set('قسم-صباغه','Dep4EntryTime');
departmentsExitTime.set('قسم-وبريات','Dep5EntryTime');
departmentsEntryTime.set('قسم-كستره','Dep6EntryTime');
departmentsEntryTime.set('قسم-كمبكتور-علي-المفتوح','Dep7EntryTime');
departmentsEntryTime.set('قسم-تجهيز-علي-المقفول','Dep8EntryTime');
departmentsEntryTime.set('قسم-تغليف','Dep9EntryTime');
departmentsEntryTime.set('قسم-غسيل-الطباعه','Dep10EntryTime');
departmentsEntryTime.set('قسم-جاهز-للاستلام','Dep11EntryTime');


router.post('/try',(req,res)=>{
   console.log(req.body.orderDep + " ay 7agaa");
});

router.post('/DepartmentRedirection',async (req,res)=>{
    // To get the visitedDeps value;
    console.log("i am here");
    const {orderDep,currentDep,newNotes} = req.body;
    console.log("new notes  " + newNotes);
    console.log("New department   " + orderDep);
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
            Dep4:0,
            Dep5:0,
            Dep6:0,
            Dep7:0,
            Dep8:0,
            Dep9:0,
            Dep10:0,
            Dep11:0,
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
            Dep7EntryTime:0,
            Dep7ExitTime:0,
            Dep8EntryTime:0,
            Dep8ExitTime:0,
            Dep9EntryTime:0,
            Dep9ExitTime:0,
            Dep10EntryTime:0,
            Dep10ExitTime:0,
            Dep11EntryTime:0,
            Dep11ExitTime:0,
            visitedDeps:0,
            graphNo:0,
            requiredColor:0,
            textureType:0,
            mediumRequired:0,
            widthRequired:0,
            machineNo:0,
            inchNo:0
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{'}]/g,'  ');
            DepNo.push(docHolder.split(':'));
        })
    }
    catch (err){console.log("error 1");}

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
            Dep4:0,
            Dep5:0,
            Dep6:0,
            Dep7:0,
            Dep8:0,
            Dep9:0,
            Dep10:0,
            Dep11:0,
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
            Dep7EntryTime:0,
            Dep7ExitTime:0,
            Dep8EntryTime:0,
            Dep8ExitTime:0,
            Dep9EntryTime:0,
            Dep9ExitTime:0,
            Dep10EntryTime:0,
            Dep10ExitTime:0,
            Dep11EntryTime:0,
            Dep11ExitTime:0,
            DepNo:0,
            graphNo:0,
            requiredColor:0,
            textureType:0,
            mediumRequired:0,
            widthRequired:0,
            machineNo:0,
            optionList:0,
        });
        docs.forEach(doc=>{
            let docHolder = doc.toString().replace(/[{'}]/g,'  ');
            docsArr.push(docHolder.split(':'));
        })
    }//13 => 15
    catch (err){console.log("error 2");}
    let docsArr2 = [];
    docsArr.forEach(rec=>{
        rec.forEach(re=>{
            if(re!=='' && re!=='\\n' && re!=='false'){
                docsArr2.push(re);
            }
        })
    })

    console.log(docs);

    // Update its values
    let No = parseInt(DepNo[0][4]);
    No++;
    //console.log(No);
    //let depNoSpaces = docsArr2[1].replace(/ /g, '');
    let x = docsArr2[5];
    //console.log("1  " + docsArr2[5] +"  2  " + docsArr2[6] +" 3  " + docsArr2[7] + "  4  " + docsArr2[8]  )
    x = x.replace(/^\s+|\s+$/gm,'');
   // console.log(x);
    console.log(orderDep);

    let obj ={};
    let obj2={};
    obj[departmentsExitTime.get(currentDep)] = new Date().toLocaleString('en-EG',{timeZone: 'Africa/Cairo'});
    obj2[departmentsEntryTime.get(orderDep)] = new Date().toLocaleString('en-EG',{timeZone: 'Africa/Cairo'});
    if(orderDep ==='قسم-الرام-تثبيت'){
        const name = "قسم-الرام";
        try {
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {$set: obj});
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {$set: obj2});
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                'currentDepartment': name,
                'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                'Dep2Type':1,
                'Notes' : newNotes
            });
            console.log('order updated');
        } catch (err) {
            console.log("error 3")
        }
    }
    else if(orderDep ==='قسم-الرام-تجهيز'){
        const name = "قسم-الرام";
        try {
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {$set: obj});
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {$set: obj2});
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                'currentDepartment': name,
                'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                'Dep2Type':2,
                'Notes' : newNotes
            });
            console.log('order updated');
        } catch (err) {
            console.log("error 5")
        }
    }
    else {
        try {
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {$set: obj});
            console.log('order updated');
        } catch (err) {
            console.log("error updating Entry");
        }
        try {
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {$set: obj2});
            console.log('order updated');
        } catch (err) {
            console.log("error updating Entry");
        }
        try {
            await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                'currentDepartment': orderDep,
                'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                'Notes' : newNotes
            });
            console.log('order updated');
        } catch (err) {
            console.log("error updating visited deps and dep number");
        }
    }
/*
    if(orderDep === "قسم-الفرد") {
        if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
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
        else if(currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
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
        else if(currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
                        'Dep4ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
                        'Dep5ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
                        'Dep6ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
                        'Dep7ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
                        'Dep8ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
                        'Dep9ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
                        'Dep10ExitTime':new Date().toLocaleString(),
                        'Dep1EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → `+`[${orderDep}]`,
                        'Dep11ExitTime':new Date().toLocaleString(),
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
    else if(orderDep==="قسم-الرام-تثبيت" || orderDep==="قسم-الرام-تجهيز") {
        let type=0;
        if(orderDep==="قسم-الرام-تثبيت")
            type=1;
        else
            type=2;
        if (currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': 'قسم-الرام',
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep2EntryTime': new Date().toLocaleString(),
                        'DepNo': No,
                        'Dep2Type':type
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep === "قسم-طباعه") {
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
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
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
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
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep3EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep3EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep3EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep3EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep3EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep3EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep3EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep3EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep === "قسم-صباغه"){
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep4EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep4EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep4EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep4EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep4EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep4EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep4EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep4EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep4EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep4EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep === "قسم-بوليش"){
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep5EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep5EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep5EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep5EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep5EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep5EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep5EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep5EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep5EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep5EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep === "قسم-كستره"){
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep6EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep6EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep6EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep6EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep6EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep6EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep6EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep6EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep6EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep6EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep==="قسم-كمبكتور-علي-المفتوح"){
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep7EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep7EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep7EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep7EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep7EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep7EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep7EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep7EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep7EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep7EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep==="قسم-كمبكتور-علي-المقفول"){
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep8EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep8EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep8EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep8EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep8EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep8EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep8EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep8EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep8EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep8EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep==="قسم-تغليف"){
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep9EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep9EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep9EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep9EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep9EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep9EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep9EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep9EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep9EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep9EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep==="قسم-غسيل-الطباعه"){
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep10EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep10EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep10EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep10EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep10EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep10EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep10EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep10EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep10EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-جاهز-للاستلام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep11ExitTime': new Date().toLocaleString(),
                        'Dep10EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    else if(orderDep==="قسم-جاهز-للاستلام"){
        if(currentDep === "قسم-الفرد") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep1ExitTime':new Date().toLocaleString(),
                        'Dep11EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if(currentDep === "قسم-الرام") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep2ExitTime':new Date().toLocaleString(),
                        'Dep11EntryTime':new Date().toLocaleString(),
                        'DepNo':No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-طباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep3ExitTime': new Date().toLocaleString(),
                        'Dep11EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-صباغه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep4ExitTime': new Date().toLocaleString(),
                        'Dep11EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-بوليش") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep5ExitTime': new Date().toLocaleString(),
                        'Dep11EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كستره") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep6ExitTime': new Date().toLocaleString(),
                        'Dep11EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المفتوح") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep7ExitTime': new Date().toLocaleString(),
                        'Dep11EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-كمبكتور-علي-المقفول") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep8ExitTime': new Date().toLocaleString(),
                        'Dep11EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-تغليف") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep9ExitTime': new Date().toLocaleString(),
                        'Dep11EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
        else if (currentDep === "قسم-غسيل-الطباعه") {
            try {
                await Orders.updateOne({'orderNo': req.body.currentOrderNo}, {
                    $set: {
                        'currentDepartment': orderDep,
                        'visitedDeps': `[${x}] → ` + `[${orderDep}]`,
                        'Dep10ExitTime': new Date().toLocaleString(),
                        'Dep11EntryTime': new Date().toLocaleString(),
                        'DepNo': No
                    }
                });
                console.log('order updated');
            } catch (err) {
                throw err;
            }
        }
    }
    */


    console.log(currentDep + "  vvvv");
    let depHolder;
    if(currentDep === "قسم-الفرد")
        depHolder="Dep1";
    else if(currentDep === "قسم-الرام")
        depHolder="Dep2";
    else if(currentDep === "قسم-طباعه")
        depHolder="Dep3";
    else if(currentDep === "قسم-صباغه")
        depHolder="Dep4";
    else if(currentDep === "قسم-وبريات")
        depHolder="Dep5";
    else if(currentDep === "قسم-كمبكتور-علي-المفتوح")
        depHolder="Dep7";
    else if(currentDep === "قسم-تجهيز-علي-المقفول")
        depHolder="Dep8";
    else if(currentDep === "قسم-تغليف")
        depHolder="Dep9";
    else if(currentDep === "قسم-غسيل-الطباعه")
        depHolder="Dep10";
    else if(currentDep === "قسم-جاهز-للاستلام")
        depHolder="Dep11";
    successOrder.push("تم توجيه الاوردر بنجاح")
    res.redirect(`/${depHolder}`);
})

module.exports = router;