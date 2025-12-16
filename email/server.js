const express = require('express');
const appRoute = require('./routes/route.js');

const app = express();
const PORT = 5000;

app.use(express.json());

// routes
app.use('/api', appRoute);

app.listen(PORT, () => {
    console.log(`SERVER MLAKU NENG: http://localhost:${PORT}`);
});
