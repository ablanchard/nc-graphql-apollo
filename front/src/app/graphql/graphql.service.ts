import { Injectable } from '@angular/core'
import { Apollo } from 'apollo-angular'
import { HttpLink } from 'apollo-angular-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { environment } from '../../environments/environment'
import { OperationDefinitionNode } from 'graphql';

@Injectable()
export class GraphqlService {

  constructor(apollo: Apollo, httpLink: HttpLink, inMemoryCache: InMemoryCache) {
    // INSERT HERE APOLLO CLIENT CREATION
  }
}
