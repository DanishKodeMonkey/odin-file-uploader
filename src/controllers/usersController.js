const asyncHandler = require('express-async-handler');

exports.signUpGet = asyncHandler(async (req, res) => {
    res.render('pages/signup', {
        description: 'Sign up page',
        title: 'Sign up',
    });
});
