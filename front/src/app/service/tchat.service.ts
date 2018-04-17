import { Injectable } from '@angular/core'
import { Apollo, QueryRef } from 'apollo-angular'
import gql from 'graphql-tag'

@Injectable()
export class TchatService {

    constructor(public apollo: Apollo) {}

    getMessages() {
        return this.apollo.watchQuery({
            query: GET_REQUEST
        })
    }

    saveMessage(message) {
        return this.apollo.mutate({
            mutation: SAVE_REQUEST,
            variables: { message },
            update: (store, { data: { saveMessage } }) => {
                const data: any = store.readQuery({ query: GET_REQUEST })
                data.getMessages.push(saveMessage)
                store.writeQuery({ query: GET_REQUEST, data })
            }
        })
    }

    subscribeMessages() {}
}

const GET_REQUEST = gql`
{
    getMessages {
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
}`

const SAVE_REQUEST = gql`
mutation saveMessage($message: MessageInput!) {
    saveMessage(message: $message) {
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
}`

const SUBSCRIBE_MESSAGES = ``