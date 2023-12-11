import { FastifyRequest } from 'fastify';
import { ApplicationInterface } from './jwt-payload.interface';

export interface JwtRequest extends FastifyRequest {
  user: ApplicationInterface;
}
