import express from 'express'
import { adminMassStatus, createMassBooking, massStatus, updateMassStatus } from '../controllers/massController.js'
import userAuth from '../middleWare/userAuth.js';
const router= express.Router();
router.post('/massForm',userAuth,createMassBooking);
router.get('/status',userAuth,massStatus);
router.get("/admin/status", userAuth, adminMassStatus);
router.patch('/admin/update-status',userAuth,updateMassStatus);

export default router;