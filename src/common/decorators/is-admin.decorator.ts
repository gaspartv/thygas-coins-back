import {
  CustomDecorator,
  SetMetadata,
} from '@nestjs/common/decorators/core/set-metadata.decorator';

export const IS_ADMIN = 'isAdminCheckRequired';

export function IsAdmin(): CustomDecorator<string> {
  return SetMetadata(IS_ADMIN, true);
}
