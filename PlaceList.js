import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Row, Button, Modal, Form, ButtonGroup } from "react-bootstrap";
import PlaceItem from "./PlaceItem";

const EditPlaceModal = ({ show, onHide, placeData, onSave }) => {
    const { place } = useContext(Context);
    const [formData, setFormData] = useState({
        name: placeData?.name || "",
        description: placeData?.info?.[0]?.description || "",
        typeId: placeData?.typeId || place.selectedType?.id || (place.types[0]?.id || "")
    });
    const [error, setError] = useState("");

    React.useEffect(() => {
        setFormData({
            name: placeData?.name || "",
            description: placeData?.info?.[0]?.description || "",
            typeId: placeData?.typeId || place.selectedType?.id || (place.types[0]?.id || "")
        });
    }, [placeData, place.types, place.selectedType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError("");
            if (!formData.name || !formData.description || !formData.typeId) {
                setError("Заполните все поля и выберите тип!");
                return;
            }
            await onSave(formData);
        } catch (e) {
            setError(e.response?.data?.message || "Произошла ошибка");
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Редактировать персонажа</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Тип</Form.Label>
                        <Form.Select
                            value={formData.typeId}
                            onChange={e => setFormData({ ...formData, typeId: e.target.value })}
                            required
                        >
                            {place.types.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Form.Group>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <Button variant="primary" type="submit">Сохранить</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const PlaceList = observer(() => {
    const { place, user } = useContext(Context);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPlaceData, setEditPlaceData] = useState(null);
    const [error, setError] = useState("");
    console.log('Все персонажи:', place.places);
    const filteredPlaces = place.selectedType?.id
        ? place.places.filter(p => p.typeId === place.selectedType.id)
        : place.places;

    // Открытие модалки для редактирования
    const handleEdit = (placeItem) => {
        setEditPlaceData(placeItem);
        setShowEditModal(true);
    };

    // Сохранение изменений
    const handleSave = async (formData) => {
        if (!editPlaceData) return;
        await place.updatePlace(editPlaceData.id, formData);
        setShowEditModal(false);
        setEditPlaceData(null);
    };

    // Удаление места
    const handleDelete = async (id) => {
        if (window.confirm("Вы уверены, что хотите удалить этого персонажа?")) {
            try {
                await place.deletePlace(id);
                place.setSelectedType({}); // сброс фильтрации
                place.setPage(1); // возврат на первую страницу
            } catch (e) {
                setError(e.response?.data?.message || "Ошибка при удалении");
            }
        }
    };

    if (!place.places) return <div>Загрузка...</div>;

    return (
        <div>
            <Row className="d-flex mt-3">
                {filteredPlaces.map((placeItem) => (
                    <PlaceItem 
                        key={placeItem.id} 
                        place={placeItem}
                        onEdit={() => handleEdit(placeItem)}
                        onDelete={() => handleDelete(placeItem.id)}
                    />
                ))}
            </Row>
            <EditPlaceModal
                show={showEditModal}
                onHide={() => { setShowEditModal(false); setEditPlaceData(null); }}
                placeData={editPlaceData}
                onSave={handleSave}
            />
            {error && <div className="text-danger mt-3">{error}</div>}
        </div>
    );
});

export default PlaceList;