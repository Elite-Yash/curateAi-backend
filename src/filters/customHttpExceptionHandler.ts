import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        let errorResponse;

        // Check for validation errors
        if (exception.response && exception.response.message && Array.isArray(exception.response.message)) {
            errorResponse = {
                success: false,
                message: 'Validation failed',
                data: {

                    validation_errors: exception.response.message.map((msg: string) => ({
                        field: msg.split(' ')[0],
                        errors: [msg],
                    })),
                }
            };
        } else {
            // Handle other errors
            errorResponse = {
                success: false,
                message: exception.message || 'Internal server error',
                data: {},
            };
        }

        response.status(status).json(errorResponse);
    }
}
