const AfricasTalking = require('africastalking');

// Set your app credentials
const credentials = {
    apiKey: 'MyAppAPIkey',
    username: 'MyAppUsername',
}

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
        from: 'LipaLeo' // Replace with your desired sender ID or short code
    };

    sms.send(options)
        .then(response => {
            console.log('Welcome message sent:', response);
        })
        .catch(error => {
            console.error('Error sending welcome message:', error);
        });
}

// Function to send a bill added confirmation message
function sendBillAddedMessage(phoneNumber) {
    const message = `Your bill has been added successfully.`;
    
    const options = {
        to: [phoneNumber],
        message: message,
        from: 'LipaLeo'
    };

    sms.send(options)
        .then(response => {
            console.log('Bill added confirmation message sent:', response);
        })
        .catch(error => {
            console.error('Error sending bill added confirmation message:', error);
        });
}

// Function to send a payment due reminder message
function sendPaymentDueMessage(phoneNumber, title, dueDate) {
    const message = `'${title}' is due on ${dueDate}.`;

    const options = {
        to: [phoneNumber],
        message: message,
        from: 'LipaLeo'
    };

    sms.send(options)
        .then(response => {
            console.log('Payment due reminder message sent:', response);
        })
        .catch(error => {
            console.error('Error sending payment due reminder message:', error);
        });
}

// Function to send a payment complete message
function sendPaymentCompleteMessage(phoneNumber, title) {
    const message = `'${title}' has been paid.`;

    const options = {
        to: [phoneNumber],
        message: message,
        from: 'LipaLeo'
    };

    sms.send(options)
        .then(response => {
            console.log('Payment complete message sent:', response);
        })
        .catch(error => {
            console.error('Error sending payment complete message:', error);
        });
}

// Example usage:
// Replace 'name' and 'phoneNumber' with actual values from the database
const name = 'John Doe';
const phoneNumber = '+254711XXXYYY';

sendWelcomeMessage(name, phoneNumber);

// To send other messages for different events, use the respective functions as needed.
// export to index.js
// Export all the functions together
module.exports = {
    sendWelcomeMessage,
    sendBillAddedMessage,
    sendPaymentDueMessage,
    sendPaymentCompleteMessage
};
// Path: routes/index.js