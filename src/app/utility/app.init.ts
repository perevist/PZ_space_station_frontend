import { KeycloakService, KeycloakOptions } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any>{
    const options: KeycloakOptions = {
        config: environment.keycloakConfig,
        initOptions:
        {
            redirectUri: "http://localhost:4200",
        },
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
        bearerExcludedUrls: [
            '/assets',
            '/clients/public']
    };
    return (): Promise<any> => keycloak.init(options);
}
