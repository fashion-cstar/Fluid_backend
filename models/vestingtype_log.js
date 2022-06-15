var mongoose = require('mongoose');

var VestingTypeLogSchema = new mongoose.Schema(
    {
        action: { type: Number, default: 0 },
        typeId: { type: Number, default: 0 },
        name: String,
        startTime: { type: Date, default: Date.now },
        endTime: { type: Date, default: Date.now },
        lockupDuration: { type: Number, default: 0 },
        vestingFrequencyId: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId, ref: "user"
        }
    },
    { timestamps: true }
);

VestingTypeLogSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        action: this.action,
        typeId: this.typeId,
        name: this.name,
        startTime: this.startTime,
        endTime: this.endTime,
        lockupDuration: this.lockupDuration,
        vestingFrequencyId: this.vestingFrequencyId,
        amount: this.amount,
        updatedBy: this.updatedBy,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

mongoose.model('vestingtype_log', VestingTypeLogSchema);
