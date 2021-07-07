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
TOKEN_EXPIRES_IN=1h //modify as you need eg: 60s, 1m, 1h, 7d
SECRET_KEY=my_secret_key //use your secret key
```

To have this a try copy this template and run your node application

```js
const express = require('express');
const dotenv = require('dotenv');
const { getToken, tokenValidation } = require('auth-middleware-jwt');
const app = express();
const port = 3000 || process.env.PORT;
dotenv.config();

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
    let user = {
        id: '49afbf2a-0c08-4636-963c-1933507fb168',
        name,
        email,
        image: 'https://picsum.photos/100/100',
    };
    let token = await getToken(user);
    res.json({ token });
});

//@Description: Set the bearer token in header as key 'Authorization' and value 'Bearer <the token will be given after login>'
//Route: http://localhost:3000/protected_route
//Method: POST
app.post('/protected_route', tokenValidation, async (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.json({ message: 'Authentication Failed' });
    }
});

app.listen(port, () => console.log(`App is listening on ${port}`));
```
