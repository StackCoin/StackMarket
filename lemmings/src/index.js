import { GraphQLClient, gql } from "graphql-request";
import faker from "faker";
import "cross-fetch/polyfill";

require("dotenv").config();

const endpoint = "http://localhost:2015/api/v1/graphql";
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    "x-hasura-admin-secret": window.__env__.HASURA_ADMIN_SECRET,
  },
});

const insert_users = gql`
  mutation($objects: [user_insert_input!]!) {
    insert_user(
      on_conflict: {
        constraint: user_pkey
        update_columns: [full_name, email, avatar]
      }
      objects: $objects
    ) {
      returning {
        id
        full_name
      }
    }
  }
`;

const users = [
  {
    id: 0,
    full_name: faker.name.findName(),
    email: faker.internet.email(),
    avatar: faker.internet.avatar(),
  },
  {
    id: 1,
    full_name: faker.name.findName(),
    email: faker.internet.email(),
    avatar: faker.internet.avatar(),
  },
];

graphQLClient.request(insert_users, { objects: users }).then((data) =>
  console.log(
    "Upserted Users: ",
    data.insert_user.returning.map(({ full_name }) => full_name)
  )
);

const insert_stores = gql`
  mutation($objects: [store_insert_input!]!) {
    insert_store(
      objects: $objects
      on_conflict: { constraint: store_pkey, update_columns: name }
    ) {
      returning {
        id
        name
      }
    }
  }
`;

const stores = [
  {
    admin: 0,
    id: 0,
    name: `${users[0].full_name}'s store`,
  },
  {
    admin: 1,
    id: 1,
    name: `${users[1].full_name}'s store`,
  },
];

graphQLClient.request(insert_stores, { objects: stores }).then((data) =>
  console.log(
    "Upserted Stores: ",
    data.insert_store.returning.map(({ name }) => name)
  )
);
