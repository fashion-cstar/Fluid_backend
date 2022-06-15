var mongoose = require('mongoose');

var PriceLogSchema = new mongoose.Schema(
    {
        priceBefore: Number,
        priceAfter: Number,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId, ref: "user"
        },
        price: {
            type: mongoose.Schema.Types.ObjectId, ref: "price"
        },
    },
    { timestamps: true }
);

PriceLogSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        priceBefore: this.priceBefore,
        priceAfter: this.priceAfter,
        updatedBy: this.updatedBy,
        price: this.price,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

mongoose.model('pricelog', PriceLogSchema);
