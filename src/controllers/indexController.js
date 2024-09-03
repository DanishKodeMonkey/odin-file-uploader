const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res) => {
    res.render('pages/index', {
        user: res.locals.currentUser,
        description: 'Home page',
        title: 'Odin file uploader',
    });
});
