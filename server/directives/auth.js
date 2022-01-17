import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const requiredRole = this.args.requires;
        const originalResolve = field.resolve || defaultFieldResolver;
        field.resolve = function(...args) {
            const context = args[2];
            const user = context.getUser() || {};

            // const isAuthorized = user.role === requiredRole;
            if (!user) {
                throw new AuthenticationError(`You should be logged in`);
            }
            return originalResolve.apply(this, args);
        }
    }
}
export default AuthDirective;
