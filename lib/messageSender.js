const twilio = require('twilio');
const config = require('../config');
const reader = require('./sheetReader')

// create an authenticated Twilio REST API client
const client = twilio(config.accountSid, config.authToken);

const sendSingleTwilioMessage = function(number, message) {
  return new Promise((resolve, reject) => {
    // Create options to send the message
    const options = {
      to: `+${number}`,
      from: config.twilioNumber,
      body: message,
    };
  
    client.messages.create(options)
      .then((message) => {
        console.log(message);
        resolve(message);
      })
      .catch((error) => {
        console.log('error')
        console.log(error);
        reject(error);
      });
  })
};

// Function to send a message to all current subscribers
const broadcastToRSVP = function(message) {
  // Find all subscribed users
  return new Promise((resolve, reject) => {
    reader().then(rsvps => {
      if (rsvps.length == 0) {
        reject({message: 'Could not find any subscribers!'});
      } else {
        // Send messages to all subscribers via Twilio
        rsvps.map((guest) => {
          const number = guest[4]
          console.log(`sending sms to ${number}`)
          return sendSingleTwilioMessage(number, message);
        })
        .reduce((all, currentPromise) => {
          return Promise.all([all, currentPromise]);
          }, Promise.resolve()
        ).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      }
    })
    // .catch(err => reject(err)) 
  });
};

module.exports = {
  broadcastToRSVP
}