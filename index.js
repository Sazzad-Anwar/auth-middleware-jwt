const jwt = require('jsonwebtoken');

//Description: Generate a token when login is successful
exports.getToken = async (data) => {
    try {
        if (process.env.SECRET_KEY && process.env.TOKEN_EXPIRES_IN) {
            let token = await jwt.sign(data, process.env.SECRET_KEY, {
                expiresIn: process.env.TOKEN_EXPIRES_IN,
            });
            return token;
        } else {
            throw new Error('Please set up a variable named SECRET_KEY and  TOKEN_EXPIRES_IN in your .env file');
        }
    } catch (error) {
        throw new Error(error);
    }


}

//Description: add this to a protected route which needs the authentication
//eg: router.route('/:id').all(tokenValidation, authenticated_route)
exports.tokenValidation = (async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (typeof authorization !== 'undefined') {
            const bearer = authorization.split(' ');
            const bearerToken = bearer[1];
            var decoded = await jwt.verify(bearerToken, process.env.SECRET_KEY);
            req.user = decoded;
            next()
        } else {
            throw new Error("Authorization token not found");
        }
    } catch (err) {
        throw new Error(err);
    }
});
