import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/loyalty', loyaltyRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log(`Server listening on ${port}`));
