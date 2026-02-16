import { slugify } from '../../common/domain/slug.util';

export class StorePolicy {
  static subdomainFromName(name: string): string {
    return slugify(name, 'ma-boutique');
  }
}
