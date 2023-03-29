import { Res } from "@nestjs/common";
import { Response } from 'express';

interface ResponseData {
    success: boolean;
    data?: any;
    error?: any;
}

export class CustomResponse {
    private responseData: ResponseData;
    constructor(private res: Response, private success: boolean, private statusCode: number, private data?: any, private error?: any) {
        this.responseData = {
            success: success,
            data: data,
            error: error
        }
    }
    returnResponse() {
        return this.res.status(this.statusCode || 500).json(this.responseData);
    }

    static responseSuccess(res: Response, statusCode: number, data: any) {
        let resSuccess = new CustomResponse(res, true, statusCode, data)
        return resSuccess.returnResponse()
    }
    static responseFailure(res: Response, error: any) {
        let resFailure = new CustomResponse(res, false, error.status, undefined, error.response)
        return resFailure.returnResponse()
    }

}