var mongoose = require('mongoose');

var ApySchema = new mongoose.Schema(
    {
        poolId: {
            type: Number,
            index: true,
            unique: true
        },
        pool: {
            type: String,
            required: [true, 'This field is required'],
        },
        apy: { type: Number, default: 0 },
    },
    { timestamps: true }
);

ApySchema.methods.toJSON = function () {
    return {
        _id: this._id,
        poolId: this.poolId,
        pool: this.pool,
        apy: this.apy,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

mongoose.model('apy', ApySchema);
