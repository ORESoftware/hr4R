
/**
 * Created by denman on 12/21/2014.
 */

var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
    auth: {
        api_user: 'denmanm1',
        api_key: 'F1nintelD*t@'
    },
    template:{
        ID:'2a5f64d5-0b79-4a77-9255-32abf01cfadf'
    }
}

var client = nodemailer.createTransport(sgTransport(options));


exports.sendMail = function (email,req, res, next) {

    var email = {
        from: 'cooper@backyard.com',
        to: email,
        template:{
            ID:'2a5f64d5-0b79-4a77-9255-32abf01cfadf'
        },
        subject: 'Woof',
        text: 'I am starving haven\'t eaten in days',
        html: '<b>I am starving haven\'t eaten in days</b>'
    };

    client.sendMail(email, function(err, info){
        if (err){
            console.error(err);
            res.send('error sending email');
        }
        else {
            console.log('Message sent: ' + info.response);
            res.send('email sent successfully');
        }
    });
};

