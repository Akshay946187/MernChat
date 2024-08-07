import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import authrouter from './routes/authRoute.js'
import contactsRoute from './routes/ContactsRoute.js'
import setupSocket from './socket.js'
import messageRoute from './routes/message.js'

dotenv.config()

const app = express()
const port = process.env.PORT
const databaseUrl = process.env.DATABASE_URL

// middlewares 
app.use(cors({
    origin:"http://localhost:5173",
    methods:['GET','POST','DELETE',"PUT",'PATCH',],
    credentials:true
}))

app.use("/uploads/files",express.static("uploads/files"))
app.use(cookieParser())
app.use(express.json())

app.use('/api',authrouter)
app.use('/api/contacts',contactsRoute)
app.use('/api/message',messageRoute)

//database connection
async function dbConnection(){
    try {
        
        const db = await mongoose.connect(databaseUrl)
       console.log('data base connected')
       
    } catch (error) {
        console.log(error)
    }

}
dbConnection()

const server = app.listen(8000,()=>{
    console.log('server started')
})

// sockitio 
setupSocket(server)