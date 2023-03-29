import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private static handleResponse(response: Response, exception: HttpException | QueryFailedError | Error) {
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let responseBody: any = { message: 'INTERNAL SERVER ERROR' };

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            responseBody = exception.getResponse();
        }
        else if (exception instanceof QueryFailedError) {
            statusCode = HttpStatus.BAD_REQUEST;
            responseBody = {
                statusCode: statusCode,
                message: exception.message
            }
        }
        else if (exception instanceof Error) {
            responseBody = {
                statusCode: statusCode,
                message: exception.stack
            }
        }
        responseBody.success = false;
        response.status(statusCode).json(responseBody);
    }

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        this.printMessage(exception);
        HttpExceptionFilter.handleResponse(response, exception);
    };

    private printMessage(exception: HttpException | QueryFailedError | Error): void {
        let message = 'Internal Server Error';
        if (exception instanceof HttpException) {
            message = JSON.stringify(exception.getResponse())
        } else if (exception instanceof QueryFailedError) {
            message = exception.stack.toString()
        } else if (exception instanceof Error) {
            message = exception.stack.toString()
        }
        console.log(message);
    }
}