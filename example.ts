import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

interface Success {
    success: string,
}
interface Error {
    error: string,
}

const res = (message: string, successCode?: number) => {
    console.log(`${successCode}: ${message}`)
}

const replyWithSuccess = (reply: typeof res, successCode: number) => (success: Success) => reply(success.success, successCode)
const replyWithError = (reply: typeof res) => (error: Error) => reply(error.error)

const foldReply = (reply: typeof res, successCode?: number): ((ma: E.Either<Error, Success>) => void) => E.fold(
    replyWithError(reply),
    replyWithSuccess(reply, successCode)
)

pipe(
    TE.left<Error, Success>({
        error: 'account-not-found'
    }),
    TE.fold(
        left => left.error === 'account-not-found' ? TE.right({success: 'call successful'}) : TE.left(left),
        right => TE.left({error: 'account-exits'})
    ),
    T.map(foldReply(res))
)()

