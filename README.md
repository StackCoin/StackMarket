# Stackmarket

A marketplace for the [Stackcoin Pseudo Currency](https://github.com/jackharrhy/StackCoin/). Trade Products and Services via STK.

### Running locally:
Setting up **Auth0**
1. See https://hasura.io/docs/1.0/graphql/manual/guides/integrations/auth0-jwt.html
2. Use `http://localhost:3000` for the allowed urls, and `http://localhost:3000/dashboard` for the callback 

Setting up **Hasura**

1. `cp .env.dist .env`
2. Define `HASURA_GRAPHQL_JWT_SECRET` via https://hasura.io/jwt-config/ 
3. Define `HASURA_GRAPHQL_ADMIN_SECRET` to a nice long password (save it)

Setting up **ngrok**

1.  `./ngrok http 8080`
2. Grab the two rules from `AUTH0_RULES.md` and apply them to your Auth0 account (don't forget to change the things that need to be changed)

Setting up **frontend**

1. Add a API to your Auth0 app name it `hasura`
2. Define variables in `frontend/.env` from Auth0
3. `cd frontend && yarn`
4. `yarn start`


Visit `http://localhost:3000/` to see the app

