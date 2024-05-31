export default class ResponseError extends Error {
    constructor(public status: number, public error: string, public data?: any) {
        super(error)
        this.error = error
        this.data = data
    }
}