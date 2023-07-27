const AfricasTalking = require("africastalking");

// Set your app credentials
const credentials = {
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
};

// Initialize the SDK
const africastalking = AfricasTalking(credentials);

// Get the SMS service
const sms = africastalking.SMS;

// Function to send a welcome message during user registration
function sendWelcomeMessage(name, phoneNumber) {
  const message = `Welcome ${name}, Thank you for joining LipaLeo Bill Payment Service.`;

  const options = {
    to: [phoneNumber], // Phone number of the user in international format
    message: message,
  };

  sms
    .send(options)
    .then((response) => {
      console.log("Welcome message sent:", response);
    })
    .catch((error) => {
      console.error("Error sending welcome message:", error);
    });
}

// Function to send a bill added confirmation message
function sendBillAddedMessage(phoneNumber) {
  const message = `Your bill has been added successfully.`;

  const options = {
    to: [phoneNumber],
    message: message,
  };

  sms
    .send(options)
    .then((response) => {
      console.log("Bill added confirmation message sent:", response);
    })
    .catch((error) => {
      console.error("Error sending bill added confirmation message:", error);
    });
}

// Function to send a payment due reminder message
function sendPaymentDueMessage(name, phoneNumber, bill) {
  const message = `Hey ${name}. Your bill ${
    bill.title
  } is due. Here are the details of your bill.\nTitle: ${bill.title}\nAmount: ${
    bill.amount
  }\nPayment Method: ${bill.payment_method}\n${
    bill.payment_method === "paybill"
      ? `PayBill Number: ${bill.business_number}\nA/C Number: ${bill.account_number}\n`
      : bill.payment_method === "till"
      ? `Till Number: ${bill.till_number}\n`
      : `Phone Number: ${bill.phone_number}\n`
  }Recurrence: ${bill.recurrence}\n\n`;

  const options = {
    to: [phoneNumber],
    message: message,
  };

  sms
    .send(options)
    .then((response) => {
      console.log("Payment due reminder message sent:", response);
    })
    .catch((error) => {
      console.error("Error sending payment due reminder message:", error);
    });
}

// Function to send a payment complete message
function sendPaymentCompleteMessage(phoneNumber, title) {
  const message = `'${title}' has been paid.`;

  const options = {
    to: [phoneNumber],
    message: message,
  };

  sms
    .send(options)
    .then((response) => {
      console.log("Payment complete message sent:", response);
    })
    .catch((error) => {
      console.error("Error sending payment complete message:", error);
    });
}

// Example usage:
// Replace 'name' and 'phoneNumber' with actual values from the database
const name = "John Doe";
const phoneNumber = "+254711XXXYYY";

sendWelcomeMessage(name, phoneNumber);

// To send other messages for different events, use the respective functions as needed.
// export to index.js
// Export all the functions together
module.exports = {
  sendWelcomeMessage,
  sendBillAddedMessage,
  sendPaymentDueMessage,
  sendPaymentCompleteMessage,
};
// Path: routes/index.js
