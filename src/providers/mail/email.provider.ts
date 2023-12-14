import { Send } from './dtos/email-send.dto';

export abstract class EmailProvider {
  abstract send(dto: Send): Promise<void>;
}
