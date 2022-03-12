const {mapSchema, getDirective, MapperKind} = require('@graphql-tools/utils');
const apollo = require('apollo-server')
const {defaultFieldResolver} = require("graphql");
const authDirectiveName = 'auth';
const adminDirectiveName = 'admin';

let admins = [2, 3];

function authDirectiveTransformer(schema) {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const authDirective = getDirective(schema, fieldConfig, authDirectiveName)?.[0];
            if (authDirective) {
                const {resolve = defaultFieldResolver} = fieldConfig;
                fieldConfig.resolve = async function (source, args, context, info) {
                    const result = await resolve(source, args, context, info);
                    if (!context.user) {
                        return new apollo.AuthenticationError("You must be logged in to do this action")
                    }
                    return result;
                }
                return fieldConfig;
            }
            const adminDirective = getDirective(schema, fieldConfig, adminDirectiveName)?.[0];
            if (adminDirective) {
                const {resolve = defaultFieldResolver} = fieldConfig;
                fieldConfig.resolve = async function (source, args, context, info) {
                    const result = await resolve(source, args, context, info);
                    if (!admins.includes(context.user.id)) {
                        return new apollo.AuthenticationError("You must be an admin to do this action")
                    }
                    return result;
                }
                return fieldConfig;
            }

        },

    });
};
module.exports = authDirectiveTransformer;
