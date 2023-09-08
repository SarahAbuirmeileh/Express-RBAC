import './config.js'
import express from 'express'
import "reflect-metadata";
import dataSource from './db/dataSource.js';
import userRouter from './routes/user.js'
import permissionRouter from './routes/permission.js'
import roleRouter from './routes/role.js'

const app = express()
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server UP!');
});

app.use('/user', userRouter);
app.use('/permission', permissionRouter);
app.use('/role', roleRouter);


app.use((req, res) => {
    res.status(404).send("You requested something I don't have :(");
});

app.listen(PORT, () => {
    console.log(`App is running and Listening on port ${PORT}`);
    dataSource.initialize()
    console.log(new Date())
});

export default app;