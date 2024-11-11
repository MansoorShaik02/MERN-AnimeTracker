const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    mal_id: { type: Number, required: true },
    title: { type: String, required: true },
    image_url: { type: String }
});

module.exports = mongoose.model('Anime', animeSchema);
