const { default: mongoose } = require('mongoose')

const connectToDatabase = async () => {
  try {
    const db_url = process.env.DATABASE_URL
    await mongoose.connect(db_url)
    console.log('connnected')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  connectToDatabase
}
