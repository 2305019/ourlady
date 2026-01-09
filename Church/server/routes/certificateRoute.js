import express from 'express'
import { adminCertStatus, certStatus, createCertificateRequest,markCertificatePaid,updateStatus,uploadCertificatePdf } from '../controllers/certiController.js';
import userAuth from '../middleWare/userAuth.js';
import { uploadCertificatePdf as upload} from '../config/multer.js';

const router = express.Router();
router.post('/request',userAuth ,createCertificateRequest);
router.get('/status',userAuth,certStatus);
router.get("/admin/status", userAuth, adminCertStatus);
router.patch("/admin/update-status",userAuth,updateStatus);

router.post('/pay',userAuth,markCertificatePaid);

router.post('/admin/upload-Pdf',userAuth,upload.single("certificate"),uploadCertificatePdf)
export default router