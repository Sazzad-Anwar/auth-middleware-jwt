const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')

//Description: Generate an access token when login is successful
exports.getAccessToken = asyncHandler(async (data) => {
    if (process.env.ACCESS_TOKEN_SECRET_KEY && process.env.ACCESS_TOKEN_EXPIRES_IN) {
        let token = await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}`,
        });
        return token;
    } else {
        throw new Error('ACCESS_TOKEN_SECRET_KEY and  ACCESS_TOKEN_EXPIRES_IN is not found in your .env file');
    }
})

//Description: Generate a refresh token when login is successful
exports.getRefreshToken = asyncHandler(async (data) => {
    if (process.env.REFRESH_TOKEN_SECRET_KEY && process.env.REFRESH_TOKEN_EXPIRES_IN) {
        let token = await jwt.sign(data, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}`,
        });
        return token;
    } else {
        throw new Error('REFRESH_TOKEN_SECRET_KEY and  REFRESH_TOKEN_EXPIRES_IN is not found in your .env file');
    }
})


//Description: add this to a protected route which needs the authentication
exports.AccessTokenValidation = asyncHandler(async (req, res, next) => {

    let token = req.headers.accessToken ?? req.cookies.accessToken

    if (token) {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        try {
            let decoded = await jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET_KEY);
            req.user = decoded;
            next()
        } catch (error) {
            res.status(401)
            throw new Error("Request Not Allowed");
        }
    }
    else {
        res.status(401)
        throw new Error("Request Not Allowed");
    }
});


//Description: add this to a protected route which needs the authentication
exports.RefreshTokenValidation = asyncHandler(async (req, res, next) => {

    let token = req.headers.refreshToken ?? req.cookies.refreshToken;

    if (token) {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        try {
            let decoded = await jwt.verify(bearerToken, process.env.REFRESH_TOKEN_SECRET_KEY);
            req.user = {
                id: decoded.user,
                token: bearerToken
            };
            next()
        } catch (error) {
            console.log(error);
            res.status(403)
            throw new Error("Request Not Allowed");
        }
    }
    else {
        res.status(403)
        throw new Error("Request Not Allowed");
    }
});