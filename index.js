const express = require('express')
const app = express()
const axios = require("axios");
let ejs = require('ejs');
const store = require('store');
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

app.get("/", (req, res) => {
    axios.get(`http://localhost:3000/api/queries/ListLandTitlesForSale`).then(data => {
        console.log(data.data);
        res.render('listings.ejs', { data: data.data });
    }).catch(err => {
        console.log(err);
        res.render('index.ejs');
    });
});

app.get("/admin", (req, res) => {
    res.render('admin.ejs');
});

app.get("/login", (req, res) => {
    res.render('index.ejs');
});


app.get("/listallbank", (req, res) => {
    axios.get(`http://localhost:3000/api/Bank`).then(data => {
        console.log(data.data);
        res.render('listallbank', { data: data.data });
    }).catch(err => {
        console.log(err);
        res.render('index.ejs');
    });
});

app.get("/listofallInsuranceCompany", (req, res) => {
    axios.get(`http://localhost:3000/api/InsuranceCompany`).then(data => {
        console.log(data.data);
        res.render('listallInsuranceCompany', { data: data.data });
    }).catch(err => {
        console.log(err);
        res.render('index.ejs');
    });
});


app.post("/addBank", (req, res) => {

    
    let payload = {
        $class: "org.landregv0.Bank",
        id: req.body.Lid,
        name: req.body.bname,
        balance: req.body.balance
      }
   
    let data = JSON.stringify(payload);
    axios.post('http://localhost:3000/api/Bank', data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            console.log(response);
            res.redirect("/")
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.post("/addParticipant", (req, res) => {

    var payload = {
        $class: "org.landregv0.Individual",
        aadharNumber: req.body.aadhar,
        first_name: req.body.fname,
        last_name: req.body.lname,
        father_name: req.body.fathername,
        pancard_no: req.body.pan,
        address: {
            $class: "org.landregv0.IndianAddress",
            postalCode: req.body.postal,
            addressLine1: req.body.add1,
            adreessLine2: req.body.add2,
            city: req.body.city,
            distict: req.body.district,
            state: req.body.state,
        },
        gender: req.body.gender,
        mode: "BUY",
       bankBal:req.body.bankBal,
        status: "DEFAULT",
        bidAmount: 0
    }
   
    var data = JSON.stringify(payload);
    axios.post('http://localhost:3000/api/Individual', data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            console.log(response);
            res.redirect("/")
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.post("/addRegisterar", (req, res) => {

    
    let payload = {
        $class: "org.landregv0.Registerar",
        rId: req.body.rid,
        name: req.body.rname,
        Designation: req.body.desg,
        bankBal: req.body.bankbal
      }
   
    let data = JSON.stringify(payload);
    axios.post('http://localhost:3000/api/Registerar', data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            console.log(response);
            res.redirect("/")
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.post("/addInsuranceCompany", (req, res) => {

    
    let payload = {
        $class: "org.landregv0.InsuranceCompany",
        id:req.body.Iid,
        name: req.body.Iname,
        balance: req.body.bankbal
      }
   
    let data = JSON.stringify(payload);
    axios.post('http://localhost:3000/api/InsuranceCompany', data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            console.log(response);
            res.redirect("/")
        })
        .catch(function (error) {
            console.log(error);
        });
});


app.post("/addProperty", (req, res) => {

    
    var payload = {
        $class: "org.landregv0.LandTitle",
        id: req.body.plot,
        address: {
            $class: "org.landregv0.LandAddress",
            plotNo: req.body.plot,
            postalCode: req.body.postal,
            addressLine1: req.body.add1,
            adreessLine2: req.body.add2,
            city: req.body.city,
            distict: req.body.district,
            state: req.body.state,
        },
        area: req.body.area,
        forSale: false,
        marketValue: req.body.mvalue,
        property_type: req.body.ptype,
        registration_date: "30 Dec 2019",
        owner: `resource:org.landregv0.Individual#${req.body.owner}`,
        
    }


    var data = JSON.stringify(payload);
    axios.post('http://localhost:3000/api/LandTitle', data, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
});


app.post("/participantLogin", (req, res) => {
    var aadhar = req.body.aadhar;
    store.set('aadhar', aadhar)
    console.log("cookie ", store.get('aadhar'));
    res.writeHead(301,
        { Location: 'http://localhost:2000/participant/' }
    );
    res.end();
});

app.get("/participant", (req, res) => {
    var aadhar = store.get('aadhar');
    console.log('aadhar part', aadhar);
    if (aadhar) {
        axios.get(`http://localhost:3000/api/Individual/${aadhar}`).then(data => {
            console.log(data.data);
            axios.get(`http://localhost:3000/api/queries/ListOwnedLandTitles?owner=${aadhar}`).then(data2 => {
                console.log('land details', data2.data);
                res.render('pprofile.ejs', {
                    data: data.data,
                    data2: data2.data
                });
            }).catch(err => res.render('index.ejs'));
        }).catch(err => {
            console.log(err);
            res.render('index.ejs');
        });
    }
    else {
        res.writeHead(301,
            { Location: 'http://localhost:2000/' }
        );
        res.end();
    }
})

app.get("/pprofile", (req, res) => {
    res.render('pprofile');
});


app.get("/landSale/:landId", async (req, res) => {
    // const landDet = await axios(`http://localhost:3000/api/LandTitle/${req.params.landId}`);
    // console.log(landDet.data.requests);

    // const name = await axios(`http://localhost:3000/api/Individual/4`);
    // console.log(name.data.first_name);

    var aadhar = store.get('aadhar');
    console.log('aadhar part', aadhar);
    axios.get(`http://localhost:3000/api/LandTitle/${req.params.landId}`).then(data => {
        console.log(data.data);
        res.render('landSale', { data: data.data, user: aadhar });
    }).catch(err => {
        console.log(err);
        res.render('index.ejs');
    });
});

app.post("/addBidAmount", (req, res) => {
    var id = req.body.id;
    var amount = req.body.bidAmount;
    var aadhar = store.get('aadhar');
    var payload = {
        bidder: aadhar,
        land: id,
        bidAmount: amount,
        seller:'abc'
    }
    console.log(payload);
    var data = JSON.stringify(payload);
    if (aadhar) {
        axios.post('http://localhost:3000/api/LandBid', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (response) {
                console.log(response);
                res.redirect(`/pprofile/${aadhar}`);
            })
            .catch(function (error) {
                console.log(error);
                res.redirect("/");
            });
    }
    else {
        res.redirect("/login");
    }
});


app.get("/rprofile", (req, res) => {
    res.render('rprofile');
});

app.post("/registrarLogin", (req, res) => {
    var Raadhar = req.body.aadhar;
    store.set('Raadhar', Raadhar)
    console.log("cookie ", store.get('Raadhar'));
    res.writeHead(301,
        { Location: 'http://localhost:2000/registrar/' }
    );
    res.end();
});

app.get("/registrar", (req, res) => {
    var Raadhar = store.get('Raadhar');
    console.log('aadhar part', Raadhar);
    if (Raadhar) {
        axios.get(`http://localhost:3000/api/Registerar/${Raadhar}`).then(data => {
            console.log(data.data);
            res.render('rprofile',{data:data.data});
        }).catch(err => {
            console.log(err);
            res.render('index.ejs');
        });
    }
    else {
        res.writeHead(301,
            { Location: 'http://localhost:2000/' }
        );
        res.end();
    }
});

app.get("/propDet", (req, res) => {
    res.render('propDet');
});

app.get("/addParticipant", (req, res) => {
    res.render('addParticipant');
});

app.get("/addProperty", (req, res) => {
    res.render('addProperty');
});

app.get("/addBank",(req,res)=> {
    res.render('addBank');
});

app.get("/addRegisterar",(req,res)=> {
    res.render('addRegisterar');
});

app.get("/addInsuranceCompany",(req,res)=> {
    res.render('addInsuranceCompany');
});

app.listen(2000, () => {
    console.log("2000");
});