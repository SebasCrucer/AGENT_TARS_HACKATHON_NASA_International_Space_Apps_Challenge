export const throwError = (mesagge: string, status: number) => {
    const error: any = new Error(mesagge)
    error.status = status
    throw error
}