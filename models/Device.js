const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const DeviceSchema = mongoose.Schema({
    filled: {
        type: Boolean
    },
    msg:{
        type: String
    },
    time: {
        type: String,
    }

})
const Device = mongoose.model("device", DeviceSchema);
module.exports = Device;

