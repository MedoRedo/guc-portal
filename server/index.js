const mongoose = require('mongoose');
const { app } = require('./app.js');
const dotenv = require('dotenv');

dotenv.config();
mongoose.connect(process.env.DB_URL_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Main database connected successfully');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});