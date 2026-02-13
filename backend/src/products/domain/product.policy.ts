import { slugify } from '../../common/domain/slug.util';

export class ProductPolicy {
  static slugify(name: string): string {
    return slugify(name, 'produit');
  }
}
