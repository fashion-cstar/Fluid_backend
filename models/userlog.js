var mongoose = require('mongoose');

var UserLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: "user"
        },
        ip: String,
        actions: String,
        device: String,
        location: String
    },
    { timestamps: true }
);

UserLogSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        user: this.user,
        ip: this.ip,
        actions: this.actions,
        device: this.device,
        location: this.location,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
};

mongoose.model('userlog', UserLogSchema);
