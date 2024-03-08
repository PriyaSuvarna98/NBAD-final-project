const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    title: {type: String, required: [true, 'Title is required']},
    category: {type: String, required: [true, 'Category is required']},
    hostedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    companyName: {type: String, required: [true, 'Company Name is required']},
    details: {type: String, required: [true, 'Details is required']},
    date: {type: String, required: [true, 'Date is required']},
    time: {type: String, required: [true, 'Time is required']},
    location: {type: String, required: [true, 'Location is required']},
    duration: {type: String, required: [true, 'Duration is required']},
    image: {type: String, required: [true, 'Image URL is required']},
}

);

module.exports = mongoose.model('Event', connectionSchema);

