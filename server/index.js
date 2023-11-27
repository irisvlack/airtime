const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const UserModel = require('./models/user')
const multer = require('multer')
const path = require('path')
const AfricasTalking = require('africastalking');

const username = 'Romandus';
const apiKey = '1ab9c97e81b3693fe4751e923e3171e31dbcb15fc0975ad98d933c375e5d32d6';
const africastalking = AfricasTalking({
    username: username,
    apiKey: apiKey
})

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

mongoose.connect("mongodb://127.0.0.1:27017/user")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/files')
    }, 
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

// Move the sendAirtimeReward function outside of the route handler
const sendAirtimeReward = async (phonenumber, amount) => {
    const recipients = [
        {phonenumber, amount },
    ];
    try {
        const response = await AfricasTalking.AIRTIME.send({recipients});
        console.log('Airtime response:', response);
    } catch (error) {
        console.error('Airtime error:', error);
    }
}

app.post('/home', upload.single('file'), async (req, res) => {
    UserModel.create({file: req.file.filename})
    .then(result => {
        sendAirtimeReward(req.body.phonenumber, req.body.amount);
        res.json(result);
    })
    .catch(err => console.log(err))
    
    // Call the sendAirtimeReward function here
    
})

app.get('/getfile', (req, res) => {
    UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                res.json("Success")
            } else {
                res.json("The password is incorrect")
            }
        } else {
            res.json("No record exists")
        }
    })
})

app.post('/register', (req, res) => {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("Server is running")
})
