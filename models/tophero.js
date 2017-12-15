const mongoose = require('mongoose');
const aoiSchema = new mongoose.Schema({
    waza: {
        type: String,
        required: true
    },
    dameji: {
        type: Number,
        required: true
    }
});
const topHeroSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    skill: {
        type: String
    },
    aoi:{
        type:[aoiSchema],
        required: true
    }
});
mongoose.model('topHero', topHeroSchema);