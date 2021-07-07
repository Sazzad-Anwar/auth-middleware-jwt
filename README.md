# auth-middleware-jwt

<div style="display:flex;justify-content:space-between">
![npm](https://img.shields.io/npm/v/auth-middleware-jwt)

![GitHub commit activity](https://img.shields.io/github/commit-activity/w/Sazzad-Anwar/auth-middleware-auth)

![npm](https://img.shields.io/npm/dw/auth-middleware-jwt)
![GitHub](https://img.shields.io/github/license/Sazzad-Anwar/auth-middleware-auth)

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
const { getToken, tokenValidation } = require('auth-middleware-jwt');
const app = express();
const port = 3000 || process.env.PORT;
require('dotenv').config();

//make a get request to generate a token
app.get('/', async (req, res) => {
    let user = {
        id: '49afbf2a-0c08-4636-963c-1933507fb168',
        name: 'user',
        email: 'user@email.com',
        image: 'https://picsum.photos/100/100',
    };
    let token = await getToken(user);
    res.json({ token });
});

//JWT protected route
app.post('/', tokenValidation, async (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.json({ message: 'Authentication Failed' });
    }
});

app.listen(port, () => console.log(`App is listening on ${port}`));
```
