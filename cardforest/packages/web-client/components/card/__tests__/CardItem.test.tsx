import { render, screen, fireEvent } from '@testing-library/react';
import { CardItem } from '../CardItem';
import { Card } from '@/atoms/cardAtoms';

// 模拟卡片数据
const mockCard: Card = {
  _id: 'card-1',
  _key: 'card-1',
  modelId: 'model-1',
  title: 'Test Card',
  content: 'This is a test card content',
  body: '',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  createdBy: {
    username: 'testuser'
  }
};

describe('CardItem', () => {
  it('renders card title and content', () => {
    render(<CardItem card={mockCard} />);
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card content')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<CardItem card={mockCard} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test Card'));
    
    expect(handleClick).toHaveBeenCalledWith(mockCard);
  });

  it('renders creator username when available', () => {
    render(<CardItem card={mockCard} />);
    
    expect(screen.getByText(/testuser/)).toBeInTheDocument();
  });

  it('does not render creator username when not available', () => {
    const cardWithoutCreator = { ...mockCard, createdBy: undefined };
    render(<CardItem card={cardWithoutCreator} />);
    
    expect(screen.queryByText(/testuser/)).not.toBeInTheDocument();
  });
});
