import { merge } from 'lodash'
import { subscriptions as messageSubscriptions, resolvers as messageResolvers } from '../schema/message/message.subscription'

export const subscriptions = `
    type Subscription {
        ${messageSubscriptions}
    }
`
export const resolvers = {
    Subscription: merge(
        messageResolvers,
    )
}