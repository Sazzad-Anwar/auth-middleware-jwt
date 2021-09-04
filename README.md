# auth-middleware-jwt

<div style="display:flex;justify-content:start;">

![npm](https://img.shields.io/npm/v/auth-middleware-jwt)

![npm](https://img.shields.io/npm/dw/auth-middleware-jwt)
![GitHub](https://img.shields.io/github/license/Sazzad-Anwar/auth-middleware-jwt)

</div>

JWT authentication middleware for any nodejs API. Just install and import two objects from package as shown below.

Install using npm

```sh
npm i auth-middleware-jwt jsonwebtoken
```

Or using yarn

```sh
yarn add auth-middleware-jwt jsonwebtoken
```

Make a `.env` file of your project root and set two environment variables as shown below

```sh
ACCESS_TOKEN_EXPIRES_IN=1h //modify as you need eg: 60s, 1m, 1h, 7d
REFRESH_TOKEN_EXPIRES_IN=1y //modify as you need eg: 30d, 7d, 24h
ACCESS_TOKEN_SECRET_KEY=my_secret_key //use your secret key
REFRESH_TOKEN_SECRET_KEY=my_secret_key //use your secret key
```

To have this a try copy this template and run your node application

```js
const express = require('express');
const dotenv = require('dotenv');
const {
    getAccessToken,
    getRefreshToken,
    RefreshTokenValidation,
    AccessTokenValidation,
} = require('auth-middleware-jwt');
const app = express();
const port = 3010 || process.env.PORT;
dotenv.config();

app.use(express.json());

// use redis to store the refresh tokens;
let refreshTokens = [];
// use your database to store the user data
let user = {};

//@Description: Route for a login auth route with user credentials
//Route: http://localhost:3000
//Method: POST
//Set Login credentials in body as shown below
// {
//     name:'useer',
//     email:'user@email.com',
//     password:'password'
// }
app.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    //setup your authentication checking logics
    //get your user data to send as payload of JWT
    user.id = '49afbf2a-0c08-4636-963c-1933507fb168';
    user.name = name;
    user.email = email;
    user.image = 'https://picsum.photos/100/100';
    try {
        let accessToken = await getAccessToken(user);
        let refreshToken = await getRefreshToken({ user: user.id });

        refreshTokens.push(refreshToken);

        res.json({
            code: 200,
            isSuccess: true,
            status: 'success',
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: 200,
            isSuccess: true,
            status: 'success',
            message: error.message,
        });
    }
});

//@Description: Set the access token as bearer token in header as key 'Authorization' and value 'Bearer <the token will be given after login />'
//Route: http://localhost:3000/protected_route
//Method: POST
app.post('/protected_route', AccessTokenValidation, async (req, res) => {
    if (req.user) {
        res.json({
            code: 200,
            isSuccess: true,
            status: 'success',
            data: {
                user: req.user,
            },
        });
    } else {
        res.json({
            code: 404,
            isSuccess: false,
            status: 'failed',
            message: 'User is not found',
        });
    }
});

/*
@Description: If the the access token is expired then use this route to renew access and refresh token by sending the refresh token in header as refreshToken and value 'Bearer <the refresh token will be given after login or registration />'
Route: http:localhost:3000/get-access-token
Method: POST
*/
app.post('/get-access-token', RefreshTokenValidation, async (req, res) => {
    let { id, token } = req.user;

    if (refreshTokens.includes(token)) {
        try {
            let accessToken = await getAccessToken(id);
            let refreshToken = await getAccessToken({ user: id });

            refreshTokens[id] = refreshToken;

            res.json({
                code: 200,
                status: 'success',
                isSuccess: true,
                data: {
                    isLoggedIn: true,
                    accessToken,
                    refreshToken,
                },
            });
        } catch {
            res.status(403).json({
                code: 403,
                isSuccess: false,
                status: 'failed',
                message: 'Request not allowed !',
            });
        }
    } else {
        res.status(403).json({
            code: 403,
            isSuccess: false,
            status: 'failed',
            message: 'Request not allowed !',
        });
    }
});

app.listen(port, () => console.log(`App is listening on ${port}`));
```
