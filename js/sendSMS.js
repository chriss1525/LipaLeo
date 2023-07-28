const AfricasTalking = require('africastalking');

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: '532e6a47e8ec6e016dbb3ed47309df81f73523ae500699feda2da91efaad4bb1', 
  username: 'sandbox'
});


module.exports = async function sendSMS() {
    
    // Send message
    try {
      const result=await africastalking.SMS.send({
        to: '[phone_number_goes_here]', 
        message: 'Hello World',
        from: '[sender_ID_goes_here]'
      });
      console.log(result);
    } catch(ex) {
      console.error(ex);
    } 
};