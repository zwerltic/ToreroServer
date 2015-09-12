var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var http = require('http');
var nodemailer = require('nodemailer');
var conekta = require('conekta');
var dispatcher = require('httpdispatcher');

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
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

var server = http.createServer(handleRequest);

server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');

    console.log("Listening to " + ipaddress + ":" + port + "...");
});

//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//A sample POST request
dispatcher.onPost("/charge", function(req, res) {
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
    res.end('Got Post Data');
});
