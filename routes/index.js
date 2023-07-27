const recurrenceOptions = require("../utils/recurrenceOption");

const Router = require("express").Router;

const router = Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to the USSD API" });
});

const registeredNumbers = new Set();

// Helper function to validate if the input is a number
function isNumber(input) {
  return /^\d+$/.test(input);
}

// Helper function to format date as dd/mm/yyyy
function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

router.post("/ussd", (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = "";

  if (!registeredNumbers.has(phoneNumber)) {
    // User is not registered, ask for their name to register
    if (text === "") {
      response =
        "CON Welcome to LipaLeo Payment Service. Please enter your name:";
    } else if (!text.includes("*")) {
      // User provided their name, ask for their phone number
      response = `CON Hi ${text}. Please enter your phone number:`;
    } else if (text.split("*").length === 2) {
      // User provided their phone number, ask for their ID number
      response = "CON Please enter your ID number:";
    } else if (text.split("*").length === 3) {
      // User provided their ID number, ask to add their first bill
      // Process the user's input to save their registration details in the database
      // Respond with a message and option to add a bill
      // ...

      // After saving the registration details, update the registeredNumbers Set
      registeredNumbers.add(phoneNumber);

      response = `CON Registration successful. You can now add your first bill.
            1. Add Bill
            2. Show Bills
            3. Edit Bills
            4. Delete Bills
            5. Exit`;
    } else {
      response = "END Invalid input. Please try again.";
    }
  } else {
    // User is registered, show the main menu
    if (text === "") {
      response = `CON Welcome back to LipaLeo Bill Payment Service
            1. Add Bill
            2. Show Bills
            3. Edit Bills
            4. Delete Bills
            5. Exit`;
    } else if (text === "1") {
      // User selected to add a bill, show the add bill options
      response = `CON Enter the bill details:
            Title:`;
    } else if (text.startsWith("1*")) {
      const inputArray = text.split("*").slice(1);

      if (inputArray.length === 1) {
        // User provided the title, ask for the payment method
        response = `CON Enter the payment method for the bill:
		  e.g. PayBill, Till Number, Phone Number;
		  Method:`;
      } else if (inputArray.length === 2) {
        // User provided the payment method, ask for the amount
        response = `CON Enter the amount for the bill:
		  Amount:`;
      } else if (inputArray.length === 3) {
        // User provided the amount, ask for the recurrence option
        response = `CON Enter the recurrence option for the bill:
		  1. Daily
		  2. Weekly
		  3. Monthly
		  4. Yearly
		  `;
      } else if (inputArray.length === 4) {
        // User provided the recurrence option, ask for the reminder details
		response = recurrenceOptions(inputArray[3]);
      } else if (inputArray.length === 5) {
        // User provided the reminder details, show the confirmation message
        // Save the bill details to the database and send the SMS notification
        response = "END Bill details added. SMS notification sent.";
      } else {
        response = "END Invalid input. Please try again.";
      }
    } else if (text === "2") {
      // User selected to show bills, show the list of bills according to the title name
      // Fetch the bills from the database and display them as a list
      // ...
    } else if (text.startsWith("2*")) {
      // User is selecting a bill to edit or delete
      // ...
    } else if (text === "3") {
      // User selected to edit bills, show the list of bills to choose from
      // Fetch the bills from the database and display them as a list
      // ...
    } else if (text.startsWith("3*")) {
      // User is entering the edit details step by step
      // ...
    } else if (text === "4") {
      // User selected to delete bills, show the list of bills to choose from
      // Fetch the bills from the database and display them as a list
      // ...
    } else if (text.startsWith("4*")) {
      // User is confirming the deletion
      // ...
    } else if (text === "5") {
      // User selected to exit
      response = "END Thank you for using LipaLeo Bill Payment Service.";
    } else {
      // Invalid input, show the main menu
      response = `CON Invalid input. Please try again:
            1. Add Bill
            2. Show Bills
            3. Edit Bills
            4. Delete Bills
            5. Exit`;
    }
  }

  // Send the response back to the API
  res.set("Content-Type: text/plain");
  res.send(response);
});

module.exports = router;
