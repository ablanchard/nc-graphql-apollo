import { Injectable } from '@angular/core'
import { Apollo, QueryRef } from 'apollo-angular'
import gql from 'graphql-tag'

@Injectable()
export class TchatService {

  private messageQuery: QueryRef<any> ;

    constructor(public apollo: Apollo) {
      this.messageQuery = this.apollo.watchQuery({ query: GET_REQUEST });
      this.subscribeMessages()
    }

    getMessages() {
      return this.messageQuery
    }

    saveMessage(message) {
      return this.apollo.mutate(
        {
          mutation: SAVE_REQUEST,
          variables: {messageInput: message},
          update: (store,  { data: { saveMessage } }) => {
            const data: any = store.readQuery({query: GET_REQUEST});
            data.getMessages.push(saveMessage)
            store.writeQuery({
              query: GET_REQUEST,
              data
            })
          },
          optimisticResponse: {
            __typename: "Mutation",
            saveMessage: {
              __typename: "Message",
              ...message,
              date: Date.now(),
              sender: {
                __typename: "Sender",
                ...message.sender
              }
            }

          }
          }

      )

    }


  subscribeMessages() {
      this.messageQuery.subscribeToMore({
        document: SUBSCRIBE_MESSAGES,
        updateQuery: (prev: any, {subscriptionData}) => {
          let messages = prev.getMessages.slice(0)
          messages.push(subscriptionData.data.subscribeMessages)
          return {
            getMessages: messages
          }
        }
      })

    }
}

const GET_REQUEST = gql`{
        getMessages {
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

const SAVE_REQUEST = gql`
          mutation SaveMessage($messageInput: MessageInput!) {
            saveMessage(message: $messageInput) {
              content
              localisation
              status
              date
              sender {
                pseudo
                firstName
                lastName
              }
            }
          }
          `;

const SUBSCRIBE_MESSAGES = gql`subscription {
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
}`;

