import {Router} from 'express'
import {verifyToken} from '../middlewares/AuthMiddleware.js'
import { searchContacts } from '../controllers/contacts.js'
import { getContactsForDmList } from '../controllers/contacts.js'


const contactsRoute = Router()

contactsRoute.post('/search',verifyToken,searchContacts)
contactsRoute.get('/getdm-list',verifyToken,getContactsForDmList)


export default contactsRoute