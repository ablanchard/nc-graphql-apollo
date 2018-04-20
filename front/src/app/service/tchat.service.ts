import { Injectable } from '@angular/core'
import { Apollo, QueryRef } from 'apollo-angular'
import gql from 'graphql-tag'

@Injectable()
export class TchatService {

    constructor(public apollo: Apollo) {
    }

    getMessages() {
      return this.apollo.watchQuery({
        query: GET_REQUEST
        }
      )
    }

    saveMessage(message) {
      return this.apollo.mutate(
        {
          mutation: gql`
          mutation SaveMessage($messageInput: MessageInput!) {
            saveMessage(message: $messageInput) {
              content
              localisation
              status
              date
              id
              sender {
                pseudo
                firstName
                lastName
              }
            }
          }
          `,
          variables: {messageInput: message},
          update: (store,  { data: { saveMessage } }) => {
            const data: any = store.readQuery({query: GET_REQUEST});
            data.getMessages.push(saveMessage)
            store.writeQuery({
              query: GET_REQUEST,
              data
            })
          }
          }

      )

    }

    subscribeMessages() { }
}

const GET_REQUEST = gql`{
        getMessages {
        id
        date
        sender {
          pseudo
          firstName
          lastName
        }
        content
        localisation
        status
        }
      }`;

const SAVE_REQUEST = ``

const SUBSCRIBE_MESSAGES = ``

const MESSAGES = [
    {
        "id": "0",
        "date": "1523999166295",
        "sender": {
            "pseudo": "Canard Man",
            "firstName": "Frédéric",
            "lastName": "Molas"
        },
        "content": "Coin Coin",
        "localisation": "Duckpound",
        "status": "OK"
    },
    {
        "id": "1",
        "date": "1523999199456",
        "sender": {
            "pseudo": "Developer Man",
            "firstName": "Jean-Michel",
            "lastName": "Graphi"
        },
        "content": "Salut mon canard...",
        "localisation": "Nantes",
        "status": "OK"
    },
    {
        "id": "1",
        "date": "1523999199456",
        "sender": {
            "pseudo": "Developer Man",
            "firstName": "Jean-Michel",
            "lastName": "Graphi"
        },
        "content": "J'ai besoin d'un coup de main !",
        "localisation": "Nantes",
        "status": "OK"
    }
]
