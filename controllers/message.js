const messageSender = require('../lib/messageSender');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = function(request, response) {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  response.writeHead(200, { 'Content-Type': 'text/xml' });
  response.end(twiml.toString());
};

// Handle form submission
exports.sendMessages = function(request, response) {
  // Get message info from form submission
  const message = request.body.message;
  const imageUrl = request.body.imageUrl;
  
  messageSender.broadcastToRSVP(message)
  .then(() => {
    request.flash('successes', 'Messages on their way!');
    response.redirect('/');
  })
  .catch(() => {
    request.flash('errors', 'Failed sending texts');
    response.redirect('/');
  });
};
