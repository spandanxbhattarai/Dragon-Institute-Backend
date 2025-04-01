import express from 'express';
import {
  getClassMaterial,
  createClassMaterial,
  updateClassMaterial,
  deleteClassMaterial,
  getClassMaterials,
  getAllClassMaterials
} from '../controllers/classMaterialController.js';

const router = express.Router();

router.get('/', getAllClassMaterials);
router.get('/:id', getClassMaterial);
router.post('/', createClassMaterial);
router.put('/:id', updateClassMaterial);
router.delete('/:id', deleteClassMaterial);
router.get('/batch/:batchId', getClassMaterials);

export default router;