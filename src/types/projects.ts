export interface FileType {
    Link: string
}

export interface ProjectType {
    Id: number,
    Description: string,
    Name: string,
    UserId: number,
    comments?: string,
    files: Array<FileType>,
}
