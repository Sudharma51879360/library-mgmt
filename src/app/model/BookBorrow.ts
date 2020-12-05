export class BookBorrow {
    constructor(public requestercode: string = "",
        public requestername: string = "",
        public bookdata: string[] = []) { }
}