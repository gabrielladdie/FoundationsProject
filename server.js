const express = requires ('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.post('/tickets', (req, res) => {
    res.send('Hello World!');
});

router.get('/tickets', (req, res) => {
    res.send('Hello World!');
});

module.exports = router;