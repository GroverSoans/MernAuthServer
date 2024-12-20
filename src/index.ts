import "dotenv/config"
import express from 'express';
import cors from 'cors'
import connectToDatabase from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import catchErrors from "./utils/catchErrors";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.routes";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.routes";
import sessionRoutes from "./routes/sesion.route";




const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: '*',      // Allow only this frontend to access the backend
    credentials: true,       // Allow cookies or credentials to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Allowed headers
}));
// Handle preflight (OPTIONS) requests for all routes
app.options('*', cors()); 


app.use(cookieParser())

app.get("/",(req, res, next) => {
    res.status(OK).json({
        status: "healthy"
    })
});

app.use("/auth", authRoutes)

//protected routes
app.use("/user", authenticate, userRoutes)
app.use("/sessions", authenticate, sessionRoutes)

app.use(errorHandler)

app.listen(PORT, async()=> {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} enviornment`);
    await connectToDatabase();
});

