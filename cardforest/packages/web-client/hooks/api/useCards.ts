import { useQuery, useMutation } from '@apollo/client';
import { useAtom } from 'jotai';
import { 
  cardsAtom, 
  selectedCardAtom, 
  Card, 
  CardEditorData 
} from '@/atoms/cardAtoms';
import { 
  GET_MY_CARDS, 
  GET_CARD, 
  GET_CARD_WITH_MODEL 
} from '@/graphql/queries/cardQueries';
import { 
  CREATE_CARD, 
  UPDATE_CARD, 
  DELETE_CARD 
} from '@/graphql/mutations/cardMutations';

/**
 * 卡片 API 钩子
 * 封装所有卡片相关的 GraphQL 操作
 */
export function useCards() {
  const [cards, setCards] = useAtom(cardsAtom);
  const [selectedCard, setSelectedCard] = useAtom(selectedCardAtom);

  // 获取我的卡片
  const { loading: loadingCards, error: cardsError, refetch: refetchCards } = useQuery(
    GET_MY_CARDS,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        if (data?.myCards) {
          setCards(data.myCards);
        }
      },
      onError: (error) => {
        console.error('Error fetching cards:', error);
      }
    }
  );

  // 获取单个卡片
  const getCard = async (id: string, withModel = false) => {
    try {
      const { data } = await useQuery(
        withModel ? GET_CARD_WITH_MODEL : GET_CARD,
        {
          variables: { id },
          fetchPolicy: 'network-only'
        }
      );
      
      if (data?.card) {
        setSelectedCard(data.card);
        return data.card;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching card:', error);
      return null;
    }
  };

  // 创建卡片
  const [createCardMutation, { loading: creatingCard }] = useMutation(CREATE_CARD);
  
  const createCard = async (input: CardEditorData & { modelId: string }) => {
    try {
      const { data } = await createCardMutation({
        variables: { input },
        refetchQueries: [{ query: GET_MY_CARDS }]
      });
      
      if (data?.createCard) {
        return data.createCard;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  };

  // 更新卡片
  const [updateCardMutation, { loading: updatingCard }] = useMutation(UPDATE_CARD);
  
  const updateCard = async (id: string, input: Partial<CardEditorData>) => {
    try {
      const { data } = await updateCardMutation({
        variables: { id, input },
        refetchQueries: [{ query: GET_MY_CARDS }]
      });
      
      if (data?.updateCard) {
        return data.updateCard;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  };

  // 删除卡片
  const [deleteCardMutation, { loading: deletingCard }] = useMutation(DELETE_CARD);
  
  const deleteCard = async (id: string) => {
    try {
      const { data } = await deleteCardMutation({
        variables: { id },
        refetchQueries: [{ query: GET_MY_CARDS }]
      });
      
      if (data?.deleteCard) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  // 选择卡片
  const selectCard = (card: Card | null) => {
    setSelectedCard(card);
  };

  return {
    // 数据
    cards,
    selectedCard,
    
    // 加载状态
    loading: loadingCards || creatingCard || updatingCard || deletingCard,
    error: cardsError,
    
    // 操作
    getCard,
    createCard,
    updateCard,
    deleteCard,
    selectCard,
    refetchCards
  };
}
