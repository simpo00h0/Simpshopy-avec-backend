import { slugify } from '../../common/domain/slug.util';

export class StorePolicy {
  static slugify(name: string): string {
    return slugify(name);
  }
}
