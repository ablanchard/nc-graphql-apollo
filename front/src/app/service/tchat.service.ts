import { Injectable } from '@angular/core'
import { Apollo, QueryRef } from 'apollo-angular'
import gql from 'graphql-tag'

@Injectable()
export class TchatService {

    constructor(public apollo: Apollo) {}

    getMessages() {
        return this.apollo.query({
            query: GET_REQUEST
        })
    }

    saveMessage(message) {}

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

const SAVE_REQUEST = ``

const SUBSCRIBE_MESSAGES = ``