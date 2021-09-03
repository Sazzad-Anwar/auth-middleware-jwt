const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

//Description: Generate an access token when login is successful
exports.getAccessToken = asyncHandler(async (data) => {
    if (process.env.SECRET_ACCESS_TOKEN_KEY && process.env.ACCESS_TOKEN_EXPIRES_IN) {
        let token = await jwt.sign(data, process.env.SECRET_ACCESS_TOKEN_KEY, {
            expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}`,
        });
        return token;
    } else {
        throw new Error('SECRET_ACCESS_TOKEN_KEY and  ACCESS_TOKEN_EXPIRES_IN is not found in your .env file');
    }
})

//Description: Generate a refresh token when login is successful
exports.getRefreshToken = asyncHandler(async (data) => {
    if (process.env.SECRET_REFRESH_TOKEN_KEY && process.env.REFRESH_TOKEN_EXPIRES_IN) {
        let token = await jwt.sign(data, process.env.SECRET_REFRESH_TOKEN_KEY, {
            expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}`,
        });
        return token;
    } else {
        throw new Error('SECRET_REFRESH_TOKEN_KEY and  REFRESH_TOKEN_EXPIRES_IN is not found in your .env file');
    }
})


//Description: add this to a protected route which needs the authentication
exports.AccessTokenValidation = asyncHandler(async (req, res, next) => {

    let token = req.headers.authorization ?? req.cookies.accessToken

    if (token) {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        try {
            var decoded = await jwt.verify(bearerToken, process.env.SECRET_ACCESS_TOKEN_KEY);
            req.user = decoded;
            next()
        } catch (error) {
            throw new Error("Request Not Allowed");
        }
    }
    else {
        throw new Error("Request Not Allowed");
    }
});


//Description: add this to a protected route which needs the authentication
exports.RefreshTokenValidation = asyncHandler(async (token) => {

    if (token) {
        try {

            var decoded = await jwt.verify(token, process.env.SECRET_REFRESH_TOKEN_KEY);
            return decoded;

        } catch (error) {
            throw new Error("Invalid token");
        }
    }
    else {
        throw new Error("Request Not Allowed");
    }
});

