

var express = require('express');
var nodemailer = require("nodemailer");
const Handlebars = require('handlebars');
const util = require("util");
const axios = require("axios");


var app = express();

let recieved = [];
let notRecieved = [];

app.get('./sendMails', function (req, res) {

    let recievers = req.body.contactList;
    let textBody  = req.body.text;
    let template = Handlebars.compile(textBody);
    
    let smtpTransport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
            user: req.body.senderEmail,
            pass: req.body.password
        }
    });
    
    async function SendBulkMail() {
        for(var i = 0; i < recievers.length; i++) {
            let data = recievers[i].name;
            text = template(data);
            var mailOptions = {
                to: recievers[i].email,
                subject: req.body.subject,
                text: text,
                dsn: {
                    id: recievers[i].id,
                    return: 'headers',
                    notify: ['failure', 'delay'],
                    recipient: req.body.senderEmail
                },
                html: <img src='http://172.17.104.204:3000/track/{{campaign_id}}/{{contact_id}}' ></img>
                }
            console.log(mailOptions);
            await smtpTransport.sendMail(mailOptions);
            recieved.push(mailOptions.to);
        }
        console.log(recieved);
        console.log(notRecieved);
        res.send(recieved);
    }
    SendBulkMail();

});



app.listen(8080, function () {
    console.log("Listening on Port 8080...");
});