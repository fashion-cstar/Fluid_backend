var mongoose = require('mongoose');
var router = require('express').Router();
var VestingAmountLog = mongoose.model('vestingamount_log');
var VestingTypeLog = mongoose.model('vestingtype_log');
var auth = require('../auth');
var secret = require('../../config').secret;
var jwt = require('jsonwebtoken');

router.post('/vestingamount_log', auth.required, async (req, res, next) => {
    VestingAmountLog.find({ typeId: req.body.typeId, wallet: req.body.wallet }).populate('updatedBy').exec((err, logs) => {
        if (err) return res.status(401).json({ errors: { message: err } });
        return res.status(200).json({ logs: logs });
    })
});

router.post('/vestingtype_log', auth.required, async (req, res, next) => {
    VestingTypeLog.find({ typeId: req.body.typeId }).populate('updatedBy').exec((err, logs) => {
        if (err) return res.status(401).json({ errors: { message: err } });
        return res.status(200).json({ logs: logs });
    })
});

router.post('/save_amountlog', auth.required, async (req, res, next) => {
    let decoded;
    try {
        decoded = jwt.verify(req.headers.authorization.split(' ')[1], secret);
    } catch (e) {
        return res.status(401).send({ errors: { message: 'Unauthorized!' } });
    }

    var log = new VestingAmountLog();
    log.action = req.body.action;
    log.typeId = req.body.typeId;
    log.typeName = req.body.typeName;
    log.wallet = req.body.wallet;
    log.amount = req.body.amount;
    log.updatedBy = decoded.id;
    log.save()
        .then(() => {
            res.status(200).json({ action: 'success' });
        })
        .catch(next);
});

router.post('/save_typelog', auth.required, async (req, res, next) => {
    let decoded;
    try {
        decoded = jwt.verify(req.headers.authorization.split(' ')[1], secret);
    } catch (e) {
        return res.status(401).send({ errors: { message: 'Unauthorized!' } });
    }

    var log = new VestingTypeLog();
    log.action = req.body.action;
    log.typeId = req.body.typeId;
    log.name = req.body.name;
    log.startTime = req.body.startTime;
    log.endTime = req.body.endTime;
    log.lockupDuration = req.body.lockupDuration;
    log.vestingFrequencyId = req.body.vestingFrequencyId;
    log.amount = req.body.amount;
    log.updatedBy = decoded.id;
    log.save()
        .then(() => {
            res.status(200).json({ action: 'success' });
        })
        .catch(next);
});

module.exports = router;
