var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var http = require('http');
var nodemailer = require('nodemailer');
var conekta = require('conekta');

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
    from: 'Torero Server <zwerltic@gmail.com>', // sender address
    to: 'toreroapp@gmail.com ,jose.tlacuilo@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url + ' With token: ' + request.param.token + ' by ' + request.name + ' ' + request.last);
    // send mail with defined transport object
    conekta.Charge.create({
      amount: 51000,
      currency: "MXN",
      description: "Pizza Delivery",
      reference_id: "internal_order_id",
      card: "tok_test_visa_4242",
      details: {
        email: "logan@x-men.org",
        line_items: [{
          name: "Box of Cohiba S1s",
          sku: "cohb_s1",
          unit_price: 51000,
          description: "Imported from Mex.",
          quantity: 1,
          type: "pizza-purchase"
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

	response.writeHead(200, {'Content-Type': 'text/plain'});
	  response.write("Welcome to Node.js on OpenShift!\n\n");
	  response.end("Thanks for visiting us! \n");
});

server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});



console.log("Listening to " + ipaddress + ":" + port + "...");
