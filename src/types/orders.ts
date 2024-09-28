export interface FileType {
    Link: string
}

export interface OrderType {
    Id: number,
    Description: string,
    Budget: number,
    CategoryId: number,
    files: Array<FileType>,
}
