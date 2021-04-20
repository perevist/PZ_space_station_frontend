import { KeycloakService, KeycloakOptions } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any>{
    const options: KeycloakOptions = {
        config: environment.keycloakConfig

    };
    return (): Promise<any> => keycloak.init(options);
}