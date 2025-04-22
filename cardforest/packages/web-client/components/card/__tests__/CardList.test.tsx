import { render, screen } from '@testing-library/react';
import { CardList } from '../CardList';
import { Card } from '@/atoms/cardAtoms';

// 模拟卡片数据
const mockCards: Card[] = [
  {
    _id: 'card-1',
    _key: 'card-1',
    modelId: 'model-1',
    title: 'Test Card 1',
    content: 'This is test card 1 content',
    body: '',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'card-2',
    _key: 'card-2',
    modelId: 'model-1',
    title: 'Test Card 2',
    content: 'This is test card 2 content',
    body: '',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z'
  }
];

describe('CardList', () => {
  it('renders loading state', () => {
    render(<CardList cards={[]} loading={true} />);
    
    expect(screen.getByText('Loading cards...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const error = new Error('Test error');
    render(<CardList cards={[]} error={error} />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders empty state with custom message', () => {
    render(<CardList cards={[]} emptyMessage="Custom empty message" />);
    
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('renders cards', () => {
    render(<CardList cards={mockCards} />);
    
    expect(screen.getByText('Test Card 1')).toBeInTheDocument();
    expect(screen.getByText('This is test card 1 content')).toBeInTheDocument();
    expect(screen.getByText('Test Card 2')).toBeInTheDocument();
    expect(screen.getByText('This is test card 2 content')).toBeInTheDocument();
  });
});
