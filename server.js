const express = require('express');
const app = express();
const router = express.Router();

// Middleware
app.use(express.json()); // for parsing application/json

// Router definitions
router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/tickets', (req, res) => {
    res.send('Ticket created!');
});

router.get('/tickets', (req, res) => {
    res.send('List of tickets');
});

// Use the router
app.use('/', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = router;