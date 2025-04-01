const { default: mongoose } = require('mongoose')

const connectToDatabase = async () => {
  try {
    const db_url = `${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`
    await mongoose.connect(`mongodb://127.0.0.1:27017/point-of-sale`)
    console.log('connnected')
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
  connectToDatabase
}
