var mongoose = require('mongoose');

var PriceSchema = new mongoose.Schema(
    {
        tokenId: {
            type: Number,
            index: true,
            unique: true
        },
        tokenName: {
            type: String,
            required: [true, 'This field is required'],
        },
        price: { type: Number, default: 0 },
    },
    { timestamps: true }
);

PriceSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        tokenId: this.tokenId,
        tokenName: this.tokenName,
        price: this.price,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

mongoose.model('price', PriceSchema);
