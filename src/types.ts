export type User = {
    id: string,
    username: string,
    lang: string,
    pwd: string
    creationDate: string
}

export type Message = {
    id: string,
    sender: User
    receiver: User
    body: string
    time: Date
}