var mongoose = require('mongoose');
var router = require('express').Router();
var Price = mongoose.model('price');
var PriceLog = mongoose.model('pricelog');
var auth = require('../auth');
var secret = require('../../config').secret;
var jwt = require('jsonwebtoken');

router.post('/pricelist', auth.required, async (req, res, next) => {
    Price.find({}, async function (err, prices) {
        if (err) return res.status(401).json({ errors: { message: err } });
        if (prices.length == 0) {
            try {
                let newPrices = await Price.create([{ tokenId: 0, tokenName: "FLD" }])
                return res.status(200).json({ pricelist: newPrices });
            } catch (err) {
                console.log(err.message)
            }
        }
        return res.status(200).json({ pricelist: prices });
    })
});

router.post('/log', auth.required, async (req, res, next) => {
    PriceLog.find({ price: req.body.id }).populate(['price', 'updatedBy']).exec((err, logs) => {
        if (err) return res.status(401).json({ errors: { message: err } });
        return res.status(200).json({ logs: logs });
    })
});

router.post('/updateprice', auth.required, async (req, res, next) => {
    const update = { price: req.body.price };
    let decoded;
    try {
        decoded = jwt.verify(req.headers.authorization.split(' ')[1], secret);
    } catch (e) {
        return res.status(401).send({ errors: { message: 'Unauthorized!' } });
    }
    let doc = await Price.findByIdAndUpdate(req.body.id, update, {
        new: true
    });
    if (doc) {
        var log = new PriceLog();
        log.priceBefore = req.body.priceBefore;
        log.priceAfter = req.body.price;
        log.updatedBy = decoded.id;
        log.price = req.body.id;
        log.save()
            .then(() => {
                res.status(200).json({ action: 'success' });
            })
            .catch(next);
    } else {
        res.status(401).json({ errors: { message: 'Updating DB failed' } });
    }
});

module.exports = router;
