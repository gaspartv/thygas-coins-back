import {
  CustomDecorator,
  SetMetadata,
} from '@nestjs/common/decorators/core/set-metadata.decorator';

export const IS_SUPER = 'isSuperCheckRequired';

export function IsSuper(): CustomDecorator<string> {
  return SetMetadata(IS_SUPER, true);
}
