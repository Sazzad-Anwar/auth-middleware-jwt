const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

//Description: Generate a token when login is successful
exports.getToken = asyncHandler(async (data) => {
    if (process.env.SECRET_KEY && process.env.TOKEN_EXPIRES_IN) {
        let token = await jwt.sign(data, process.env.SECRET_KEY, {
            expiresIn: `${process.env.TOKEN_EXPIRES_IN}`,
        });
        return token;
    } else {
        throw new Error('Please set up a variable named SECRET_KEY and  TOKEN_EXPIRES_IN in your .env file');
    }
})

//Description: add this to a protected route which needs the authentication
//eg: router.route('/:id').all(tokenValidation, authenticated_route)
exports.tokenValidation = asyncHandler(async (req, res, next) => {

    let token = req.headers.authorization ?? req.cookies.token

    if (token) {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        var decoded = await jwt.verify(bearerToken, process.env.SECRET_KEY);
        req.user = decoded;
        next()
    }
    else {
        res.status(401)
        throw new Error("Request Not Allowed");
    }
});
