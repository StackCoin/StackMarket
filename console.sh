#!/bin/bash
if ! hasura; then
  curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash &
fi
hasura console &
HASURA_PID=$!
ngrok http 8080
kill $HASURA_PID
