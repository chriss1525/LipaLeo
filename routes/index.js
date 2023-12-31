const recurrenceOptions = require("../utils/recurrenceOption");
const {
  fetchBillByTitle,
  fetchBills,
  storeNewBill,
  storeNewUser,
  fetchUserByPhoneNumber,
} = require("../utils/storage");

const smsNotifications = require("./smsNotifications");

const supabase = require("../utils/supabase");

const Router = require("express").Router;

const router = Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to the USSD API" });
});

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

router.post("/ussd", async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  let response = "";
  let userData = await fetchUserByPhoneNumber(phoneNumber);

  console.log("userData", userData);
  console.log(!userData);

  if (!userData.length) {
    // User is not registered, ask for their name to register
    if (text === "") {
      response =
        "CON Welcome to LipaLeo Payment Service. Please enter your name:";
    } else if (!text.includes("*")) {
      // User provided their name, ask for their phone number
      // Respond with a message and option to add a bill
      const user = await storeNewUser(text, phoneNumber);
      console.log(user);
      response = `END ${user[0]?.name}, you have been registered successfully. Dial *789*123456# to start using the service.`;
      // calling a function to send a welcome message to the user
      smsNotifications.sendWelcomeMessage(text.split("*")[0], phoneNumber);
    } else {
      response = "END Invalid input. Please try again.";
    }
  } else {
    userData = userData[0];
    console.log(userData);
    // User is registered, show the main menu
    if (text === "") {
      response = `CON Welcome back to LipaLeo ${userData?.name}. Please select an option:
1. Add Bill
2. Show Bills
3. Delete Bills`;
    } else if (text === "1") {
      // User selected to add a bill, show the add bill options
      response = `CON Enter the title for your bill:\n`;
    } else if (text === "3") {
      const bills = await fetchBills(userData.id);
      response = `CON Select a bill to delete:
${bills.map((bill, idx) => `${idx + 1}. ${bill.title}`).join("\n")}
`;
    } else if (text.startsWith("3*")) {
      const bills = await fetchBills(userData.id);
      const billIndex = parseInt(text.split("*")[1]) - 1;
      const [bill] = await fetchBillByTitle(bills[billIndex].title);
      const { error } = await supabase.from("bills").delete().eq("id", bill.id);
      response = `END The bill ${bill.title} deleted successfully.`;
    } else if (text === "2") {
      const bills = await fetchBills(userData.id);
      response = `CON Select a bill to view:
${bills.map((bill, idx) => `${idx + 1}. ${bill.title}`).join("\n")}
`;
    } else if (text.startsWith("2*")) {
      const bills = await fetchBills(userData.id);'''''
      const billIndex = parseInt(text.split("*")[1]) - 1;
      const [bill] = await fetchBillByTitle(bills[billIndex].title);

      response = `END Bill Details:
Title: ${bill.title}
Amount: ${bill.amount}
Payment Method: ${bill.payment_method}
${
  bill.payment_method === "paybill"
    ? `PayBill Number: ${bill.business_number}\nA/C Number: ${bill.account_number}`
    : bill.payment_method === "till"
    ? `Till Number: ${bill.till_number}`
    : `Phone Number: ${bill.phone_number}`
}
Recurrence: ${bill.recurrence}
`;
    } else if (text.startsWith("1*")) {
      const inputArray = text.split("*").slice(1);

      if (inputArray.length === 1) {
        // User provided the title, ask for the payment method
        response = `CON Enter the payment method for the bill:
1. PayBill
2. Till Number
3. Phone Number
		  `;
      } else if (inputArray.length === 2 && inputArray[1] === "1") {
        // User selected PayBill, ask for the PayBill number
        response = `CON Enter the PayBill/Business number for the bill:\n`;
      } else if (inputArray.length === 3 && inputArray[1] === "1") {
        // User provided the PayBill number, ask for the account number
        response = `CON Enter the account number for the bill:\n`;
      } else if (inputArray.length === 2 && inputArray[1] === "2") {
        // User selected Till Number, ask for the Till Number
        response = `CON Enter the Till Number for the bill:\n`;
      } else if (inputArray.length === 2 && inputArray[1] === "3") {
        // User selected Phone Number, ask for the Phone Number
        response = `CON Enter the Phone Number for the bill:`;
      } else if (
        // User provided the PayBill/Till Number/Phone Number, ask for the amount
        (inputArray.length === 3 &&
          (inputArray[1] === "2" || inputArray[1] === "3")) ||
        (inputArray.length === 4 && inputArray[1] === "1")
      ) {
        // User provided the payment method, ask for the amount
        response = `CON Enter the amount for the bill:\n`;
      } else if (
        (inputArray.length === 4 &&
          (inputArray[1] === "2" || inputArray[1] === "3")) ||
        (inputArray.length === 5 && inputArray[1] === "1")
      ) {
        // User provided the amount, ask for the recurrence option
        response = `CON Enter the recurrence option for the bill:
<<<<<<< HEAD
		  1. Daily
		  2. Weekly
		  3. Monthly

		  4. Yearly
		  `;
=======
1. Daily
2. Weekly
3. Monthly
4. Yearly
`;
>>>>>>> 5802db0b95f2cf85bbaca2969dfabd6dc387aa31
      } else if (
        (inputArray.length === 5 &&
          (inputArray[1] === "2" || inputArray[1] === "3")) ||
        (inputArray.length === 6 && inputArray[1] === "1")
      ) {
        // User provided the recurrence option, ask for the reminder details
        if (inputArray.length === 6) {
          response = recurrenceOptions(inputArray[5]);
        } else {
          response = recurrenceOptions(inputArray[4]);
        }
      } else if (
        (inputArray.length === 6 &&
          (inputArray[1] === "2" || inputArray[1] === "3")) ||
        (inputArray.length === 7 && inputArray[1] === "1")
      ) {
        // User provided the reminder details, show the confirmation message
        // Save the bill details to the database and send the SMS notification
        const [bill] = await storeNewBill(inputArray, userData.id);
        response = "END Bill details added. SMS notification sent.";
        // calling a function to send a bill added confirmation message to the user
        // smsNotifications.sendBillAddedMessage(phoneNumber);
        // calling a function to send a payment due reminder message to the user
        smsNotifications.sendPaymentDueMessage(
          userData.name,
          phoneNumber,
          bill
        );
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
