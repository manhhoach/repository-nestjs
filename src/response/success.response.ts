export class CustomResponse {
    constructor(public statusCode: number, private data: any) { }

    static responseSuccess(statusCode: number, data: any) {
        return new CustomResponse(statusCode, data)
    }

    getResponse() {
        return {
            success: true,
            statusCode: this.statusCode,
            data: this.data,
        }
    }

}