## TP5 : Subscription

Dans ce dernier TP nous allons mettre en place les subscriptions sur notre application angular. L'objectif ici, va être de récupérer les réponses de Canard Man. Ces réponses sont générées par le serveur après trois secondes suite au dernier message de l'utilisateur. Le serveur utilise les websockets pour faire parvenir les messages de Canard Man au client. Cette récupération se fera via les subscription graphQL.

### TP5.1 : Modification de la configuration serveur

Afin que Canard Man puisse nous répondre, il faut activer la fonctionnalité du coté serveur. Dans le fichier config.js à la racine du projet back, veuillez entrer la configuration suivante :

```javascript
module.exports = {
    latency: 2000, // millisecond
    enableSuperCoinFeature: true,
    server: {
        port: 3000
    }
}
```

### TP5.2 : Test avec graphiql

Dans un premier temps ouvrez graphiql (http://localhost:4200/api/graphiql) dans un nouvel onglet et essayez la requête suivante :

```javascript
subscription {
  subscribeMessages {
    sender {
        pseudo
        firstName
        lastName
    }
    content
    localisation
    date
    status
  }
}
```

Le message suivant devrait apparaître : `"Your subscription data will appear here after server publication!"`. Vous venez de réaliser une subscription avec graphiQL. Le client est en attente de l'ajout d'un message. Si vous envoyez un message via l'application vous devriez recevoir grace à la subscription ce message et tous les messages qui arriveront par la suite. Ainsi le dernier message reçu sera celui de Canard Man.

### TP5.3 : Modification et mise en place du client Apollo pour la réception des websockets

Pour le moment le client Apollo est configuré pour l'envoi et la réception de requêtes http. Dans l'état actuel il est incapable de traiter les websockets. Il va donc falloir modifier la configuration de celui-ci dans le fichier `src/app/graphql/graphql.service.ts`.

La configuration est la suivante :

```javascript
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
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    inMemoryCache: InMemoryCache,
  ) {
    // Create an http link:
    const http = httpLink.create({
      uri: 'api/graphql',
    })

    // Create a WebSocket link:
    const ws = new WebSocketLink({
      uri: environment.webSocket
    })

    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = (getMainDefinition(query) as OperationDefinitionNode)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      ws,
      http,
    )

    apollo.create({
      link: link,
      cache: new InMemoryCache(),
    })
  }
}

```

Quelques explications sont nécéssaires. Par rapport à l'ancienne configuration, nous créons ici une connexion websocket via le code suivant :

```javascript
    // Create a WebSocket link:
    const ws = new WebSocketLink({
      uri: environment.webSocket,
    })
```

L'object `WebSocketLink` permet de créer une instance d'objet permettant la connexion websocket. Le paramètre `uri` permet d'indiquer où doit se faire la connexion.

Une fois la connexion configurée pour les websockets et les requêtes http (tp1), il est nécéssaire de configurer le client apollo. Pour celà, il faut une instance d'objet de la classe ApolloLink que nous créons avec le code suivant :

```javascript
    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = (getMainDefinition(query) as OperationDefinitionNode)
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      ws,
      http,
    )
```

Ce code permet de signaler l'utilisation de la connexion websocket, ou la connexion http en fonction du type d'opération reçu par le client graphQL. Ainsi si l'opération est de type subscription, on utilisera la connexion websocket, sinon la connexion http.

Enfin la dernière étape de ce code est la création du client apollo :

```javascript
    apollo.create({
      link: link,
      cache: new InMemoryCache(),
    })
```

### TP5.4 : Modification du service tchat pour récupérer les websockets et mettre à jour le cache

Il est temps de modifier le service `src/app/service/tchat.service.ts` pour s'inscrire à la subscription et mettre le cache de message à jour lors de l'arrivée d'un message. Nous allons nous appuyer sur la documentation suivante : https://www.apollographql.com/docs/angular/features/subscriptions.html#subscribe-to-more

La fonction subscribeToMore permet de mettre à jour le résultat d'une requête à partir du résultat d'une autre requête. L'objectif ici, va être d'enrichir le résultat de la requête `getMessages` avec la requête de subscription.

Dans un premier temps assignez à `SUBSCRIBE_MESSAGES` la requête de subscription vue plus haut.

Créez une propriété `private messageQuery: QueryRef<any>` puis assignez-y une référence de la query `getMessages` soit le code suivant :

```javascript
    this.apollo.watchQuery({
        query: GET_REQUEST
    })
```

Ensuite aidez-vous du lien de la documentation pour implementer la fonction `subscribeMessages` de manière à remplir le cache avec le résultat des messages reçus par la subscription. Votre fonction doit commencer comme ceci :

```javascript
    subscribeMessages() {
        this.messageQuery.subscribeToMore({
            // [VOTRE CODE]
        })
    }
```

Enfin dans le constructeur appelez la fonction `subscribeMessages`.

Le message de Canard Man devrait s'afficher !
