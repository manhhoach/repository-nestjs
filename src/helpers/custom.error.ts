import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomError extends HttpException{
    constructor(statusCode: number, error: string){
        super(error, statusCode);
    }
}