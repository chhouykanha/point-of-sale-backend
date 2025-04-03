require('dotenv').config()

const UserModel = require("../models/user.model")
const { connectToDatabase } = require("./db")
const bcrypt = require('bcrypt')

const run = async () => {
    try{
        await connectToDatabase()

      const existSuper = await UserModel.findOne({
        email: process.env.SUPER_EMAIL
      })

      const password = process.env.SUPER_PASSWORD

      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)

      if (!existSuper) {
        await new UserModel({
          username: process.env.SUPER_USERNAME,
          email: process.env.SUPER_EMAIL,
          password: hashed,
          role: "super"
        }).save()
      }

      console.log('✅ Seeding Succesfull.')
      process.exit(0)
    }catch(error){
        console.error('Error during execution:', error.message)
        process.exitCode = 1 // Indicate failure
    }
}

run()
