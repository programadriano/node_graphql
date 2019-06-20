const app = require("express")();
const expressGraphql = require("express-graphql");
const { buildSchema } = require("graphql");
const opn = require('opn');


const schema = buildSchema(`
  type User {
    id: ID
    nome: String    
    idade: Int
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    createUser(nome: String!, idade: Int!): User
  }
`);


const providers = {
    users: []
};


let id = 1;

const resolvers = {

    user({ id }) {
        return providers.users.find(item => item.id === Number(id));
    },
    users() {
        return providers.users;
    },
    createUser({ nome, idade }) {
        const user = {
            id: id++,
            nome,
            idade
        };

        providers.users.push(user);

        return user;
    }
};


app.use(
    "/graphql",
    expressGraphql({
        schema: schema,
        rootValue: resolvers,
        graphiql: true
    })
);

app.listen(3000, () => {
    opn('http://localhost:3000/graphql');
    console.log('Express GraphQL Server Now Running On localhost:3000/graphql')
});
