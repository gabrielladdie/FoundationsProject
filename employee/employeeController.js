const express = require('express');
const router = express.Router();

const employeeService = require('./employeeService');

// route to handle POST requests
router.post("/", validateUserMiddleware, (req, res) => {
    const jsonData = req.body;
    console.log(jsonData);
    res.status(201).json({message: "Data Received"});
});

function validateUserMiddleware(req, res, next){
    // Check if there is a valid username and password
    let jsonBody = req.body;
    if(validateItem(jsonBody)){
        next();
    }else{
        res.status(400).json({
            message: "Invalid Username or Password"
        })
    }
}

function validateItem(data){
    // Check if there is a valid username and password
    if(data.username && data.password){
        return data.username && data.password;
    }
}

module.exports = router;