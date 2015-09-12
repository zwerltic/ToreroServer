var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var http = require('http');

var nodemailer = require('nodemailer');
var conekta = require('conekta');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var token;
var name;
var last;
var street;
var number;
var colonia;
var deleg;
var juzgado;
var itinerante;

//var dispatcher = require('httpdispatcher');
//var url = require('url');

conekta.api_key = 'key_EfsX62HbiTSNsuHr5q6xv2Q';
conekta.locale = 'es';

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'toreroapp@gmail.com',
        pass: 'crater790'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Torero Server <toreroapp@gmail.com>', // sender address
    to: 'zwerltic@gmail.com', // list of receivers
    subject: 'New request from:' + name, // Subject line
    text: 'Nombre: ' + name + '\nApellido: ' + last + '\nCalle: ' + street +
          '\nNumero: ' + number + '\nColonia: ' + colonia + '\nDelegacion: '
          + deleg + '\nJuzgado: ' + juzgado + '\nItinerante: ' + itinerante, // plaintext body
    html: '<b><p>Nombre: ' + name + '</p><p>Apellido: ' + last + '</p><p>Calle: ' + street +
          '</p><p>Numero: ' + number + '</p><p>Colonia: ' + colonia + '</p><p>Delegacion: '
          + deleg + '</p><p>Juzgado: ' + juzgado + '</p><p>Itinerante: ' + itinerante + '</p></b>'// html body
};


var server = http.createServer(app);

server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');

    console.log("Listening to " + ipaddress + ":" + port + "...");
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies








// var server = http.createServer(handleRequest);
//
// server.listen( port, ipaddress, function() {
//     console.log((new Date()) + ' Server is listening on port 8080');
//
//     console.log("Listening to " + ipaddress + ":" + port + "...");
// });





// //Lets use our dispatcher
// function handleRequest(request, response){
//     try {
//         //log the request on console
//         console.log(request.url);
//         //Disptach
//         dispatcher.dispatch(request, response);
//     } catch(err) {
//         console.log(err);
//     }
// }


//Express style post

app.post('/api/charge', function(req, res) {
    token = req.body.token;
    name = req.body.name;
    last = req.body.last;
    street = req.body.street;
    number = req.body.number;
    colonia = req.body.colonia;
    deleg = req.body.deleg;
    juzgado = req.body.juzgado;
    itinerante = req.body.itinerante;
    conekta.Charge.create({
      amount: 250000,
      currency: "MXN",
      description: "tramite de amparo",
      reference_id: "internal_order_id",
      card: "tok_test_visa_4242",
      details: {
        email: "toreroapp@gmail.com",
        line_items: [{
          name: "Amparo",
          sku: "amp_s1",
          unit_price: 250000,
          description: "Mexico.",
          quantity: 1,
          type: "laws-purchase"
        }]
      }
      }, function(res) {
        console.log(res.toObject());
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
              response.write("Message gone wrong");
              return console.log(error);
            }
              console.log('Message sent: ' + info.response);
              response.write("message sent");

          });
      }, function(err) {
        console.log(err.message_to_purchaser);
      });
    console.log(user_id + ' ' + token + ' ' + geo);;
    res.end('Got Post Data');
    //res.send(user_id + ' ' + token + ' ' + geo);
});


//A sample POST request
// dispatcher.onPost("/charge", function(req, res) {
//   var queryObject = url.parse(req.url,true).query;
//   console.log(queryObject);
//
//     conekta.Charge.create({
//       amount: 250000,
//       currency: "MXN",
//       description: "tramite de amparo",
//       reference_id: "internal_order_id",
//       card: "tok_test_visa_4242",
//       details: {
//         email: "toreroapp@gmail.com",
//         line_items: [{
//           name: "Amparo",
//           sku: "amp_s1",
//           unit_price: 250000,
//           description: "Mexico.",
//           quantity: 1,
//           type: "laws-purchase"
//         }]
//       }
//       }, function(res) {
//         console.log(res.toObject());
//         transporter.sendMail(mailOptions, function(error, info){
//           if(error){
//               response.write("Message gone wrong");
//               return console.log(error);
//             }
//               console.log('Message sent: ' + info.response);
//               response.write("message sent");
//
//           });
//       }, function(err) {
//         console.log(err.message_to_purchaser);
//       });
//     res.end('Got Post Data');
// });
