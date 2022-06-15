var mongoose = require('mongoose');

var ApyLogSchema = new mongoose.Schema(
    {
        apyBefore: Number,
        apyAfter: Number,
        // updatedBy: [{
        //     type: mongoose.Schema.Types.ObjectId, ref: "user"
        // }],
        // apys: [{
        //     type: mongoose.Schema.Types.ObjectId, ref: "apy"
        // }],
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId, ref: "user"
        },
        apy: {
            type: mongoose.Schema.Types.ObjectId, ref: "apy"
        },
    },
    { timestamps: true }
);

ApyLogSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        apyBefore: this.apyBefore,
        apyAfter: this.apyAfter,
        updatedBy: this.updatedBy,
        apy: this.apy,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

mongoose.model('apylog', ApyLogSchema);
