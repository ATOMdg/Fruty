const uuid = require('uuid');
const path = require('path');
const {Place, PlaceInfo, Type} = require('../models/models');
const ApiError = require('../error/ApiError');

class PlaceController {
    async create(req, res, next) {
        try {
            console.log('Create place request body:', req.body);
            console.log('Create place request files:', req.files);
            
            let {name, info, typeId} = req.body;
            
            if (!name) {
                return next(ApiError.badRequest('Не указано название персонажа'));
            }
            
            if (!typeId) {
                return next(ApiError.badRequest('Не указан тип обитания персонажа'));
            }
            
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Не загружено изображение'));
            }
            
            const {img} = req.files;
            let fileName = uuid.v4() + ".jpg";
            await img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const place = await Place.create({name, typeId, img: fileName});

            if (info) {
                try {
                    info = JSON.parse(info);
                    if (Array.isArray(info)) {
                        await Promise.all(info.map(i => 
                            PlaceInfo.create({
                                description: i.description || '',
                                placeId: place.id
                            })
                        ));
                    }
                } catch (e) {
                    console.error('Error parsing info:', e);
                }
            }

            const createdPlace = await Place.findOne({
                where: {id: place.id},
                include: [
                    {model: Type},
                    {model: PlaceInfo, as: 'info'}
                ]
            });
            
            console.log('Created place:', createdPlace);
            return res.json(createdPlace);
        } catch (e) {
            console.error('Error in create place:', e);
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        try {
            let {typeId, limit, page} = req.query;
            limit = limit ? parseInt(limit) : 5;
            page = page ? parseInt(page) : 1;
            const offset = (page - 1) * limit;
            let places;
            let count;
            if (typeId) {
                const result = await Place.findAndCountAll({
                    where: {typeId},
                    include: [
                        {model: Type},
                        {model: PlaceInfo, as: 'info'}
                    ],
                    limit,
                    offset
                });
                places = result.rows;
                count = result.count;
            } else {
                const result = await Place.findAndCountAll({
                    include: [
                        {model: Type},
                        {model: PlaceInfo, as: 'info'}
                    ],
                    limit,
                    offset
                });
                places = result.rows;
                count = result.count;
            }
            return res.json({rows: places, count});
        } catch (e) {
            console.error('Error in get all places:', e);
            return res.status(500).json({message: e.message});
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params;
            const place = await Place.findOne({
                where: {id},
                include: [
                    {model: Type},
                    {model: PlaceInfo, as: 'info'}
                ]
            });
            
            if (!place) {
                return res.status(404).json({message: 'Персонаж не найден'});
            }
            
            console.log('Found place:', place);
            return res.json(place);
        } catch (e) {
            console.error('Error in get one place:', e);
            return res.status(500).json({message: e.message});
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {name, typeId, info} = req.body;
            
            if (!name) {
                return next(ApiError.badRequest('Не указано название персонажа'));
            }
            
            if (!typeId) {
                return next(ApiError.badRequest('Не указан место обитания персонажа'));
            }
            
            let fileName;
            
            if (req.files?.img) {
                const {img} = req.files;
                fileName = uuid.v4() + ".jpg";
                await img.mv(path.resolve(__dirname, '..', 'static', fileName));
            }
            
            const [updated] = await Place.update(
                {name, typeId, ...(fileName && {img: fileName})},
                {where: {id}}
            );
            
            if (!updated) {
                return next(ApiError.notFound('Персонаж не найден'));
            }

            // Обновляем информацию о месте
            if (info) {
                try {
                    const parsedInfo = JSON.parse(info);
                    if (Array.isArray(parsedInfo)) {
                        // Удаляем старую информацию
                        await PlaceInfo.destroy({where: {placeId: id}});
                        // Создаем новую информацию
                        await Promise.all(parsedInfo.map(i => 
                            PlaceInfo.create({
                                description: i.description || '',
                                placeId: id
                            })
                        ));
                    }
                } catch (e) {
                    console.error('Error updating info:', e);
                }
            }
            
            const updatedPlace = await Place.findOne({
                where: {id},
                include: [
                    {model: Type},
                    {model: PlaceInfo, as: 'info'}
                ]
            });
            
            console.log('Updated place:', updatedPlace);
            return res.json(updatedPlace);
        } catch (e) {
            console.error('Error in update place:', e);
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const deleted = await Place.destroy({where: {id}});
            
            if (!deleted) {
                return next(ApiError.notFound('Персонаж не найден'));
            }
            
            return res.json({message: 'Персонаж успешно удален'});
        } catch (e) {
            console.error('Error in delete place:', e);
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new PlaceController();