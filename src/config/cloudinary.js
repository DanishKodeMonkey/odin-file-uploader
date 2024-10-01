require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({
    cloud_name: 'dovdjmghz',
    api_key: '212258372454289',
    api_secret: process.env.CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
