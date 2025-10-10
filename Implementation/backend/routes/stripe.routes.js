import { Router } from 'express';
import {
  getStripeConfig,
  createCheckoutSession,
  createPortalSession,
} from '../controllers/stripe.controller.js';

const router = Router();

router.get('/config', getStripeConfig);
router.post('/checkout', createCheckoutSession);
router.post('/portal', createPortalSession);

export default router;
