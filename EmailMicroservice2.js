//MicroService2:Will not fail

var express = require('express');
var nodemailer = require("nodemailer");
const Handlebars = require('handlebars');
const Verifier = require("email-verifier");
const util = require("util");
const axios = require("axios");

var app = express();
let verifier = new Verifier("at_EGgoaOpT1WEkuXomX6yLR2rqhPaLK");



async function sendBulk2(req) {
    let textBody = req.body.text;

    let recievers = req.body.contacts


    let smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: req.body.email,//"dsosc.sih@gmail.com",
            pass: req.body.pass//"dsosc1234"
        }
    });
    let template = Handlebars.compile(textBody);
    let recieved = [];
    let notRecieved = [];

    for (let i = 0; i < recievers.length; i++) {


        try {
            let res = await axios(`https://emailverification.whoisxmlapi.com/api/v1?apiKey=at_EGgoaOpT1WEkuXomX6yLR2rqhPaLK&emailAddress=${recievers[i].email}`);
            recieved.push(recievers[i]);
            console.log(recievers[i].name + " Done");
        } catch (err) {
            notRecieved.push(recievers[i]);
            console.log("Error: ");
            //console.log(err)
        }
    }

    console.log('recieved', recieved);
    console.log('Not recieved', notRecieved)

    for (var i = 0; i < recievers.length; i++) {
        let data = recievers[i];
        let text = template(data);
        var mailOptions = {
            to: recievers[i].email,
            subject: req.body.subject,
            text: text,
            dsn: {
                id: recievers[i].id,
                return: 'headers',
                notify: ['failure', 'delay'],
                recipient: req.body.email
            },
            html: {
                path: 'index.html'
            }
        }
        console.log(mailOptions);


        smtpTransport.sendMail(mailOptions)
            .then(data => {
                //  console.log(data)
            }).catch(err => {
                // console.log(err)
                console.log("errorsmtptransport")
            });

    }
}


app.get('/send', async function (req, res) {
    sendBulk2(req)
    res.status(200).send({
        message: "Processing"
    });
});


app.listen(8080, function () {
    console.log("Listening on Port 8080...");
});