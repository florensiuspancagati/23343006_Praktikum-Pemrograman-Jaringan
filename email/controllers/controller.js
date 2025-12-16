const nodemailer = require('nodemailer');
const mailgen = require('mailgen');

const { EMAIL, PASSWORD } = require('../env.js');

const signup = (req, res) => {
    res.status(201).json("Signup Sukses Lorrr...!");
}

const getbill = (req, res) => {
    const { userEmail } = req.body;

    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(config);
    let mailGenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'Mailgen',
            link: 'https://mailgen.js/'
        }
    });
    // yang di tampilkan di email
    let response = {
        body: {
            name: 'Pwancaaa',
            intro: 'Your Bill Blablablabla',
            table: {
                data: [{
                    item: 'Nodemailer Stack',
                    description: 'A Backend application',
                    price: "$123.99",
                }]
            },
            outro: 'Looking forward to do more business'
        }
    }
    let mail = mailGenerator.generate(response);
    let message = {
        from: EMAIL,
        to: userEmail,
        subject: 'Place Order',
        html: mail
    }
    
    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: 'You should receive an email!'
        })
    }).catch(error => {
        return res.status(500).json({ error });
    })

    // res.status(201).json("Getbill Sukses Lorrr...!");
}

module.exports = { signup, getbill };