var mongoose = require('mongoose');

var VestingAmountLogSchema = new mongoose.Schema(
    {
        action: { type: Number, default: 0 },
        typeId: { type: Number, default: 0 },
        typeName: String,
        wallet: { type: String, lowercase: true },
        amount: { type: Number, default: 0 },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId, ref: "user"
        }
    },
    { timestamps: true }
);

VestingAmountLogSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        action: this.action,
        typeId: this.typeId,
        typeName: this.typeName,
        wallet: this.wallet,
        amount: this.amount,
        updatedBy: this.updatedBy,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

mongoose.model('vestingamount_log', VestingAmountLogSchema);
