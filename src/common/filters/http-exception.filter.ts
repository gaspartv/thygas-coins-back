import { Catch } from '@nestjs/common/decorators/core/catch.decorator';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { ExceptionFilter } from '@nestjs/common/interfaces/exceptions/exception-filter.interface';
import { ArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string[] = [];

    if (exception.getStatus) {
      statusCode = exception.getStatus();
      error = exception.response.error || 'Internal Server Error';
      message =
        typeof exception.response.message === 'string'
          ? [exception.response.message]
          : exception.response.message || [error];
    }

    response.status(statusCode).send({
      message,
      error,
      statusCode,
    });
  }
}
