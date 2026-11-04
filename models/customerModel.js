const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true },

    phone: { type: String, required: false },

    email: { type: String, trim: true, lowercase: true },

    notes: {type: String, trim: true},
}, {
    timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);