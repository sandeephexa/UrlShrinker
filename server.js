const express = require('express');
const mongoose = require('mongoose');
const app = express();
const shortUrl = require('./models/shortUrl');

mongoose.connect('mongodb+srv://sandy512:sandy512@mongotest-kh7ik.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false
}, () =>{
    console.log('db connected...');
});

app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

app.get('/', async (req,res) => {
    const shortUrls = await shortUrl.find();
    res.render('index', {shortUrls : shortUrls});
})

app.post('/shortUrls', async (req,res) => {
    console.log('inside post');
    await shortUrl.create({full: req.body.fullUrl});
    res.redirect('/');
})

app.get('/:shortUrl', async (req,res) => {
    const short =  await shortUrl.findOne({short: req.params.shortUrl})

    if(short == null) return res.sendStatus(400);
    short.clicks++;
    short.save();

    res.redirect(short.full);
});

app.listen(3000, () => {
    console.log('app started...');
});