import express from "express";
import mongoose from 'mongoose';
import {registerValidation, loginValidation, postCreateValidation} from './validations.js';
import checkAuth from "./utils/checkAuth.js";
import {register, login, getMe} from "./controllers/UserController.js";
import {create, getAll, getOne, remove, update, getLastTags} from "./controllers/PostController.js";
import multer from "multer";
import cors from 'cors';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.8gqjqzr.mongodb.net/social?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


const app = express();


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage })

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post("/auth/login", loginValidation, login);
app.post("/auth/register", registerValidation, register);

app.get('/tags', getLastTags)
app.get('auth/me', checkAuth, getMe);
app.get('/posts', getAll);
app.get('/posts/tags', getLastTags);
app.get('/posts/:id', getOne);

app.post('/posts', checkAuth, postCreateValidation, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, update);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.listen(4444, (err)=>{
    if (err) {
        return console.log(err);
    }

    console.log("Server OK")
});
