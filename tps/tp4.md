## TP4 : Optimistic UI

Dans ce TP, nous allons simuler la latence vers le serveur. Pour celà dans l’application back-end, veuillez modifier le fichier config.js à la racine du projet back.

```javascript
module.exports = {
    latency: 2000, // millisecond
    enableSuperCoinFeature: false,
    server: {
        port: 3000
    }
}
```

Cette configuration va simuler une latence de deux secondes entre le serveur et l’application front.

Si vous envoyez un message après avoir modifié la configuration, vous devriez apercevoir qu’un blanc s’affiche entre le moment où vous appuyez sur le bouton et le moment où vous apercevez le résultat.

Ce moment est dû au faite que le client ne met à jour le cache qu’une fois la requête d'acquittement du message reçu. La propriété `optimisticResponse` de `mutate` permet de simuler la réponse avant même qu’elle soit reçu. Cela permet d’optimiser l’interface utilisateur sans tenir compte du réseau. À la fin du TP vous devriez avoir un message qui s’affiche directement en mode “PENDING” (avec un logo de chargement sur le coté) jusqu'à la réception du message avec un status “OK” (logo check).

La propriété prend un objet qui représente la réponse de la requête. Attention ici la réponse attend la propriété `__typename__` et `date`. Nous vous conseillons de regarder à quoi ressemble une réponse sans optimisticUI afin de pouvoir la simuler. À noter que les propriétés `__typename__` peuvent être supprimées des réponses via une configuration du `InMemoryCache`. Nous ne le feront pas pour ce TP.

Aide : http://dev.apollodata.com/angular2/mutations.html#optimistic-ui
