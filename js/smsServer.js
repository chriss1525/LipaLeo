//Please create a preferred shortcode

const express = require('express');
const sendSMS = require('./sendSMS');

const app = express();


module.exports = function smsServer() {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    //Incoming messages route
    app.post('/incoming-messages', (req, res) => {
        const data = req.body;
        console.log(`Received message: \n ${data}`);
        res.sendStatus(200);
      });
      

    //Delivery reports route

    const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`App running on port: ${port}`);

        //call sendSMS to send message after server starts

    });
};

//callback url is https://ozozebov.developers.africastalking.com/incoming-messages