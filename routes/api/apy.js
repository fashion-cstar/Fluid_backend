var mongoose = require('mongoose');
var router = require('express').Router();
var Apy = mongoose.model('apy');
var ApyLog = mongoose.model('apylog');
var auth = require('../auth');
var secret = require('../../config').secret;
var jwt = require('jsonwebtoken');

router.post('/apylist', auth.required, async (req, res, next) => {
    Apy.find({}, async function (err, apys) {
        if (err) return res.status(401).json({ errors: { message: err } });
        if (apys.length == 0) {
            try {
                let newApys = await Apy.create([{ poolId: 0, pool: "FLD-ETH Pool" }, { poolId: 1, pool: "FLD Pool" }])
                return res.status(200).json({ apylist: newApys });
            } catch (err) {
                console.log(err.message)
            }
        }
        return res.status(200).json({ apylist: apys });
    })
});

router.post('/log', auth.required, async (req, res, next) => {
    ApyLog.find({ apy: req.body.id }).populate(['apy', 'updatedBy']).exec((err, logs) => {
        if (err) return res.status(401).json({ errors: { message: err } });
        return res.status(200).json({ logs: logs });
    })
});

router.post('/updateapy', auth.required, async (req, res, next) => {
    const update = { apy: req.body.apy };
    let decoded;
    try {
        decoded = jwt.verify(req.headers.authorization.split(' ')[1], secret);
    } catch (e) {
        return res.status(401).send({ errors: { message: 'Unauthorized!' } });
    }
    let doc = await Apy.findByIdAndUpdate(req.body.id, update, {
        new: true
    });
    if (doc) {
        var log = new ApyLog();
        log.apyBefore = req.body.apyBefore;
        log.apyAfter = req.body.apy;
        log.updatedBy = decoded.id;
        log.apy = req.body.id;
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
