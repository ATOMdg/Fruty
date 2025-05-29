import React, { useContext } from "react";
import { Card, Col, Image, Button, ButtonGroup } from "react-bootstrap";
import { Context } from "../index";
import { WidgetContext } from "./WidgetManager";

const PlaceItem = ({ place, onEdit, onDelete }) => {
    const { user } = useContext(Context);
    const { showWidget } = useContext(WidgetContext);

    if (!place) return null;

    // Для отладки
    console.log('user.user:', user.user);
    console.log('user.isAuth:', user.isAuth);
    console.log('user.user.role:', user.user.role);
    const role = String(user.user.role);
    console.log('role:', role);

    const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000/';
    const imgSrc = place.img ? `${apiUrl}/${place.img}` : 'https://via.placeholder.com/300';
    // Для отладки
    console.log('imgSrc:', imgSrc, 'place.img:', place.img, 'REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

    return (
        <Col md={3} className="mt-3">
            <Card 
                style={{ 
                    width: 200, 
                    height: 420, 
                    cursor: 'pointer', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    position: 'relative'
                }} 
                border="light"
                onClick={() => showWidget('place', { id: place.id })}
            >
                <Image 
                    width={200} 
                    height={200} 
                    style={{ objectFit: 'cover' }}
                    src={imgSrc}
                    alt={place.name || 'Изображение персонажа'}
                />
                <Card.Body style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="mt-1 d-flex justify-content-between align-items-center">
                        <div>{place.type?.name || 'Тип не указан'}</div>
                    </div>
                    <div className="mt-2">
                        <h5>{place.name || 'Без названия'}</h5>
                    </div>
                    {/* Кнопки действий только для админа */}
                    {user.isAuth && role === 'ADMIN' && (
                        <div style={{
                            marginTop: 'auto',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '8px'
                        }}>
                            <Button 
                                variant="outline-warning" 
                                size="sm"
                                onClick={e => { e.stopPropagation(); onEdit(place); }}
                            >
                                ✏️
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={e => { e.stopPropagation(); onDelete(place.id); }}
                            >
                                🗑️
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default PlaceItem;