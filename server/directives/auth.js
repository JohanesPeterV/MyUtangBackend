const {mapSchema, getDirective, MapperKind} = require('@graphql-tools/utils');
const apollo = require('apollo-server')
const {defaultFieldResolver} = require("graphql");
const directiveName = 'auth';

function authDirectiveTransformer(schema) {
    return mapSchema(schema, {
        // Executes once for each object field definition in the schema
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const {resolve = defaultFieldResolver} = fieldConfig;
            const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
            console.log('testing terakhir')
            if (authDirective) {
                console.log('testing terakhir')
                console.log(authDirective)
                fieldConfig.resolve = async function (source, args, context, info) {
                    const result = await resolve(source, args, context, info);
                    if (!context.user) {
                        return new apollo.AuthenticationError("You must be logged in to do this action")
                    }
                    return result;
                }
                return fieldConfig;
            }
        },

    });
};
module.exports = authDirectiveTransformer;
