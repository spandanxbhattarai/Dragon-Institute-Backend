import {
    createClassMaterial,
    getClassMaterialById,
    updateClassMaterial,
    deleteClassMaterial,
    getPaginatedClassMaterials,
    getAllPaginatedClassMaterials
  } from '../repository/classMaterialRepository.js';
  
  export const createClassMaterialService = async (materialData) => {
    // Ensure batches is an array
    if (!Array.isArray(materialData.batches)) {
      materialData.batches = [materialData.batches];
    }
    return await createClassMaterial(materialData);
  };
  
  export const getClassMaterialByIdService = async (materialId) => {
    return await getClassMaterialById(materialId);
  };
  
  export const updateClassMaterialService = async (materialId, updateData) => {
    // If updating batches, ensure it's an array
    if (updateData.batches && !Array.isArray(updateData.batches)) {
      updateData.batches = [updateData.batches];
    }
    return await updateClassMaterial(materialId, updateData);
  };
  
  export const deleteClassMaterialService = async (materialId) => {
    return await deleteClassMaterial(materialId);
  };
  
  export const getPaginatedClassMaterialsService = async (batchId, page, limit) => {
    return await getPaginatedClassMaterials(batchId, page, limit);
  };

  export const getAllPaginatedClassMaterialsService = async (page, limit) => {
    return await getAllPaginatedClassMaterials(page, limit);
  };