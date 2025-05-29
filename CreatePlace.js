import React, { useEffect, useState } from "react" // Импортируем библиотеки и хуки React
import { Col, Dropdown, Modal, Row } from "react-bootstrap" // Импортируем компоненты из react-bootstrap
import { Form, Button } from "react-bootstrap" // Импортируем Form и Button из react-bootstrap
import { Context } from "../../index" // Импортируем контекст из основной папки приложения
import { useContext } from "react" // Импортируем хук useContext для контекста
import { createPlace, fetchPlaces, fetchTypes } from "../../http/placeAPI" // Импортируем API функции для работы с местами
import { observer } from "mobx-react-lite" // Импортируем observer для отслеживания изменений в MobX

// Создаем компонент "CreatePlace", который принимает show и onHide как свойства
const CreatePlace = observer(({show, onHide}) => {
    const {place} = useContext(Context) // Получаем состояние из контекста
    const [name, setName] = useState('') // Состояние для названия персонажа
    const [file, setFile] = useState(null) // Состояние для файла изображения
    const [description, setDescription] = useState('') // Состояние для описания персонажа
    const [error, setError] = useState('') // Состояние для ошибок валидации

    // useEffect для загрузки типов и мест при монтировании компонента
    useEffect(() => {
        fetchTypes().then(data => place.setTypes(data)) // Загружаем типы и сохраняем их в состоянии
        fetchPlaces().then(data => place.setPlaces(data.rows)) // Загружаем места и сохраняем их в состоянии
    }, [])

    // Функция для обработки выбора файла
    const selectFile = e => {
        setFile(e.target.files[0]) // Устанавливаем выбранный файл в состояние
    }

    // Функция для добавления места
    const addPlace = async () => {
        try {
            setError('') // Сбрасываем ошибки перед валидацией
            if (!place.selectedType?.id) { // Проверяем, выбран ли тип
                setError('Выберите тип обитания') // Устанавливаем ошибку, если тип не выбран
                return
            }
            if (!name) { // Проверяем, введено ли название
                setError('Введите название персонажа') // Устанавливаем ошибку, если название пустое
                return
            }
            if (!file) { // Проверяем, загружен ли файл
                setError('Загрузите изображение') // Устанавливаем ошибку, если файл не загружен
                return
            }
            if (!description || description.trim() === '') { // Проверяем, введено ли описание
                setError('Введите описание персонажа') // Устанавливаем ошибку, если описание пустое или только пробелы
                return
            }

            // Создаем объект formData для передачи на сервер
            const formData = {
                name,
                file,
                typeId: place.selectedType.id, // Идентификатор выбранного типа
                description: description.trim() // Удаляем лишние пробелы в описании
            };

            console.log('Описание для передачи:', description); // Логируем описание для отладки
            await place.createPlace(formData); // Отправляем данные на сервер
            onHide(); // Закрываем модальное окно
            setName('') // Сбрасываем состояние для названия
            setFile(null) // Сбрасываем состояние для файла
            setDescription('') // Сбрасываем состояние для описания
            setError('') // Сбрасываем ошибки
        } catch (e) {
            console.error("Ошибка создания:", e); // Логируем ошибку в консоль
            setError(e.response?.data?.message || "Ошибка при создании места обитания") // Устанавливаем сообщение об ошибке
        }
    };

    return(
        <Modal // Само модальное окно
            show={show} // Определяем, показывать ли модал
            onHide={onHide} // Обработчик для закрытия модала
            size="lg" // Размер модального окна
            centered // Центрируем модальное окно
        >
            <Modal.Header closeButton> 
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить персонажа 
                </Modal.Title>
            </Modal.Header>
            <Modal.Body> 
                <Form> 
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{place.selectedType.name || "Выберите тип"}</Dropdown.Toggle> 
                        <Dropdown.Menu>
                            {place.types.map(type => // Перебираем и отображаем все типы
                                <Dropdown.Item 
                                    onClick={() => place.setSelectedType(type)} // Устанавливаем выбранный тип
                                    key={type.id}> 
                                    {type.name} 
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name} // Значение инпута для названия
                        onChange={e => setName(e.target.value)} // Обработчик изменения названия
                        className="mt-3"
                        placeholder="Введите название персонажа" // Плейсхолдер
                    />
                    
                    <Form.Control
                        className="mt-3"
                        type="file" // Тип инпута для загрузки файла
                        onChange={selectFile} // Обработчик изменения файла
                    />

                    <Form.Group className="mt-3"> 
                        <Form.Label>Описание</Form.Label> 
                        <Form.Control
                            as="textarea" // Тип инпута - многострочный текст (textarea)
                            rows={3} // Количество строк
                            value={description} // Значение инпута для описания
                            onChange={e => setDescription(e.target.value)} // Обработчик изменения описания
                            placeholder="Введите описание персонажа" // Плейсхолдер
                            required // Поле обязательно для заполнения
                        />
                    </Form.Group>

                    {error && <div className="text-danger mt-3">{error}</div>} 
                </Form>
            </Modal.Body>
            <Modal.Footer> 
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button> 
                <Button variant="outline-success" onClick={addPlace}>Добавить</Button> 
            </Modal.Footer>
        </Modal>
    )
})

export default CreatePlace // Экспортируем компонент