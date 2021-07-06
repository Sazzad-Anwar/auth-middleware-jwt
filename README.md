# auth-middleware-jwt

JWT authentication middleware for any nodejs API. Just install and import two object from package.

```sh
npm i auth-middleware-jwt jsonwebtoken
```

or

```sh
yarn add auth-middleware-jwt jsonwebtoken
```

Make a `.env` file of your project root and set two environment variables as shown below

```sh
TOKEN_EXPIRES_IN=
SECRET_KEY=
```

To have this a try copy this template and run your node application

```js
const express = require('express');
const { getToken, tokenValidation } = require('./index');
const app = express();
const port = 3000 || process.env.PORT;
require('dotenv').config();

//make a get request to generate a token
app.get('/', async (req, res) => {
    let user = {
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
