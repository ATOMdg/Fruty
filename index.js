require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const bcrypt = require('bcrypt')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'] 
}));
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)

app.get('/', (req, res) => {
    res.status(200).json({message: 'WORKING!!!'})
})

const initTestData = async () => {
    // Проверяем, есть ли уже тестовые данные
    const adminExists = await models.User.findOne({ where: { email: 'admin@admin.com' } });
    const typeExists = await models.Type.findOne({ where: { name: 'Лес' } });

    if (!adminExists) {
        const hashPassword = await bcrypt.hash('123456', 5);
        await models.User.create({
            email: 'admin@admin.com',
            password: hashPassword,
            role: 'ADMIN'
        });
    }

    if (!typeExists) {
        await models.Type.bulkCreate([
            { name: 'Лес' },
            { name: 'Равнина' },
            { name: 'Саванна' }
        ]);

        const forestType = await models.Type.findOne({ where: { name: 'Лес' } });
        const plainType = await models.Type.findOne({ where: { name: 'Равнина' } });
        const savannahType = await models.Type.findOne({ where: { name: 'Саванна' } });

        // Создаем места только если их нет
        const placeExists = await models.Place.findOne();
        if (!placeExists) {
            const forest1 = await models.Place.create({
                name: 'Каменный аспект',
                img: 'e8251ca09d8e473681c55f0dcd147f83.jpg',
                typeId: forestType.id
            });
            await models.PlaceInfo.create({
                description: 'Большой каменный или лавовый голем...',
                placeId: forest1.id
            });

            
        }
    }
}

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // БЕЗ force: true
        
        // Инициализируем тестовые данные только если их нет
        await initTestData();
        
        console.log('База данных подключена успешно');
        app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
    } catch (e) {
        console.error('Ошибка инициализации:', e);
    }
};

start()