const dotenv = require('dotenv')
const app = require("./app");
const { connectToDatabase } = require("./database/db");

dotenv.config()


const PORT = process.env.PORT || 8001

connectToDatabase()

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
}) 
