import { render, screen } from '@testing-library/react';
import { IconShoppingCart } from '@tabler/icons-react';
import { EmptyState } from './EmptyState';
import { AllTheProviders } from '@/__tests__/utils/test-utils';

function renderWithProviders(ui: React.ReactElement) {
  return render(ui, {
    wrapper: AllTheProviders,
  });
}

describe('EmptyState', () => {
  it('affiche le titre et la description', () => {
    renderWithProviders(
      <EmptyState
        icon={IconShoppingCart}
        title="Aucun produit"
        description="Ajoutez votre premier produit pour commencer."
      />,
    );

    expect(screen.getByText('Aucun produit')).toBeInTheDocument();
    expect(screen.getByText('Ajoutez votre premier produit pour commencer.')).toBeInTheDocument();
  });

  it('affiche l\'action quand fournie', () => {
    renderWithProviders(
      <EmptyState
        icon={IconShoppingCart}
        title="Vide"
        description="Description"
        action={<button>Ajouter</button>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeInTheDocument();
  });
});
