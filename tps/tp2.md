## TP2 : Modifier une donnée et mettre à jour les données à afficher

Dans cette deuxième partie nous allons envoyer un message et l’enregistrer via graphql. Pour réaliser cela, modifiez le service `tchat.service.ts` afin de lui ajouter une fonction permettant de sauvegarder un message via graphql. Ensuite nous allons modifier le composant `tchat.component.ts` pour adapter la fonction d’envoi.

#### Étape 1 : Création de la requête

Si on regarde les opérations existantes dans l'api graphql via graphiql et sa documentation (http://localhost:3000/api/graphql), on peut observer l’existence de la mutation suivante :

```javascript
saveMessage(message: MessageInput): Message
```

Avec les types suivants :

```javascript
MessageInput :
sender: SenderInput!
content: String!
localisation: String!
status: String!

SenderInput :
pseudo: String!
firstName: String!
lastName: String!
```

Maintenant connectez-vous à graphiql (http://localhost:4200/api/graphql) et tentez d’ajouter un message avec une requête graphql. Les liens suivants vous seront utiles :

* http://graphql.org/learn/queries/#variables
* http://graphql.org/learn/queries/#mutations

Vous pouvez utiliser la combinaison ctrl + space pour l’autocomplétion.

#### Étape 2 : Modification du service

Le service `tchat.service.ts` a besoin d’une nouvelle fonction prenant en paramètre un message et dont l’objectif est d’envoyer une requête graphql pour la sauvegarde de celui-ci.

```
saveMessage(message)
```

L’objet `apollo` que nous avons injecté plus tôt contient une fonction mutation qui va envoyer une requête de mutation. Cette fois-ci nous ne vous donnerons pas le squelette de la fonction. Le lien suivant pourra vous servir : http://dev.apollodata.com/angular2/mutations.html#calling-mutations

#### Étape 3 : Modification du composant

Modifier le composant `tchat.component.ts` pour appeler le service d’envoi de message à partir de la méthode `sendMessage`. La variable `spamGuard` permet de bloquer la saisie d’un nouveau message le temps de la requête. Une fois votre requête d’ajout de message terminé il faudra assigner `false` à `spamGuard` et une chaîne de caractère vide à message. Comme pour `getMessages`, la méthode `mutate` d’apollo vous renvoie un observable.

Squelette de la fonction :

```javascript
sendMessage() {
    this.spamGuard = true
    const message = {
        sender: {
            pseudo: 'Developer Man',
            firstName: 'Jean-Michel',
            lastName: 'GraphQL'
        },
        content: this.messageContent,
        localisation: 'Nantes',
        status: 'PENDING'
    }
    [APPEL DU SERVICE]
}
```

Nous vous conseillons de regarder les requêtes qui sont réalisées par votre navigateur. Vous pouvez observer votre requête graphql partir, et en cas d’erreur, avoir quelques informations supplémentaires.

Dans un premier temps, lorsque vous aurez réussi votre requête, votre message ne s'affichera pas. Vous allez être devoir recharger votre page pour voir votre message.

#### Étape 4 : Affichage du nouveau message

Recharger la page pour voir les nouveaux messages n’est pas acceptable. Il existe plusieurs façons permettant de pallier à ce problème.

Il est possible lors de l’exécution d’une mutation de renseigner des propriétés supplémentaires en plus de query. Ces propriétés permettent d’enrichir le comportement voulu. L’une de ces propriétés est `refetchQueries` et permet de spécifier une requête à exécuter une fois que le résultat de la mutation est reçu. Ici nous allons nous en servir pour aller rechercher les messages une fois la mutation terminée.

Le lien suivant vous sera utile pour comprendre comment renseigner le paramètre refetchQueries : https://www.apollographql.com/docs/react/advanced/caching.html#after-mutations

Enfin il ne faut pas oublier de changer l’appel de la fonction `query` de `getMessage` dans `tchat.service.ts` en `watchQuery`. La différence est que `query` est un observable qui se termine après que le premier résultat ait été trouvé tandis que `watchQuery` écoute continuellement les valeurs enregistrées dans le cache.
