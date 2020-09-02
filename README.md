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
4. `docker-compose up`

Setting up **Hasura CLI**

1. `./console.sh`
2. Copy the `ngrok` url and paste it in your JWT aquire rule

Visit `http://localhost:3000/` to see the app

