import { useQuery, useMutation } from '@apollo/client';
import { useAtom } from 'jotai';
import { 
  modelListAtom, 
  selectedModelAtom, 
  modelEditorAtom, 
  Model 
} from '@/atoms/modelAtoms';
import { 
  GET_MODELS, 
  GET_MODEL, 
  GET_MODEL_WITH_INHERITANCE 
} from '@/graphql/queries/modelQueries';
import { 
  CREATE_MODEL, 
  UPDATE_MODEL, 
  DELETE_MODEL 
} from '@/graphql/mutations/modelMutations';

/**
 * 模型 API 钩子
 * 封装所有模型相关的 GraphQL 操作
 */
export function useModels() {
  const [models, setModels] = useAtom(modelListAtom);
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
  const [modelEditor, setModelEditor] = useAtom(modelEditorAtom);

  // 获取所有模型
  const { loading: loadingModels, error: modelsError, refetch: refetchModels } = useQuery(
    GET_MODELS,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        if (data?.models) {
          setModels(data.models);
        }
      },
      onError: (error) => {
        console.error('Error fetching models:', error);
      }
    }
  );

  // 获取单个模型
  const getModel = async (id: string, withInheritance = false) => {
    try {
      const { data } = await useQuery(
        withInheritance ? GET_MODEL_WITH_INHERITANCE : GET_MODEL,
        {
          variables: { id },
          fetchPolicy: 'network-only'
        }
      );
      
      if (data?.model) {
        setSelectedModel(data.model);
        return data.model;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching model:', error);
      return null;
    }
  };

  // 创建模型
  const [createModelMutation, { loading: creatingModel }] = useMutation(CREATE_MODEL);
  
  const createModel = async (input: Partial<Model>) => {
    try {
      const { data } = await createModelMutation({
        variables: { input },
        refetchQueries: [{ query: GET_MODELS }]
      });
      
      if (data?.createModel) {
        return data.createModel;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating model:', error);
      throw error;
    }
  };

  // 更新模型
  const [updateModelMutation, { loading: updatingModel }] = useMutation(UPDATE_MODEL);
  
  const updateModel = async (id: string, input: Partial<Model>) => {
    try {
      const { data } = await updateModelMutation({
        variables: { id, input },
        refetchQueries: [{ query: GET_MODELS }]
      });
      
      if (data?.updateModel) {
        return data.updateModel;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  };

  // 删除模型
  const [deleteModelMutation, { loading: deletingModel }] = useMutation(DELETE_MODEL);
  
  const deleteModel = async (id: string) => {
    try {
      const { data } = await deleteModelMutation({
        variables: { id },
        refetchQueries: [{ query: GET_MODELS }]
      });
      
      if (data?.deleteModel) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  };

  // 选择模型
  const selectModel = (model: Model | null) => {
    setSelectedModel(model);
  };

  // 更新模型编辑器
  const updateModelEditor = (data: Partial<Model>) => {
    setModelEditor(prev => ({
      ...prev,
      ...data
    }));
  };

  // 重置模型编辑器
  const resetModelEditor = () => {
    setModelEditor({
      name: '',
      inherits_from: [],
      fields: [],
      system: false
    });
  };

  return {
    // 数据
    models,
    selectedModel,
    modelEditor,
    
    // 加载状态
    loading: loadingModels || creatingModel || updatingModel || deletingModel,
    error: modelsError,
    
    // 操作
    getModel,
    createModel,
    updateModel,
    deleteModel,
    selectModel,
    updateModelEditor,
    resetModelEditor,
    refetchModels
  };
}
