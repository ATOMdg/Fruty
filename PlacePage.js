import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { fetchOnePlace } from "../http/placeAPI";

const PlacePage = ({ id }) => {
  const [place, setPlace] = useState({info: []})

  useEffect(() => {
    fetchOnePlace(id).then(data => {
      console.log('Полученные данные персонажа:', data); // Для отладки
      setPlace(data);
    }).catch(error => {
      console.error('Ошибка при загрузке персонажа:', error);
    });
  }, [id]);

  const apiUrl = process.env.REACT_APP_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000/';
const imgSrc = place.img ? `${apiUrl}/${place.img}` : 'https://via.placeholder.com/300';

  return (  
    <Container className='mt-3'>
      <Row>
        <Col md={4} className="d-flex flex-column align-items-center">
          <h2 className="mb-3" style={{textAlign: 'center'}}>{place.name || 'Без названия'}</h2>
          <Image 
            width={300} 
            height={300} 
            src={imgSrc}
            alt={place.name || 'Изображение персонажа'}
          />
        </Col>
        <Col>
          <Row className="align-items-center justify-content-center">
            {}
          </Row>
        </Col>
      </Row>
      <Row className="d-flex flex-column m-3">
        <h1>Описание</h1>
        {place.info && place.info.length > 0 ? (
          place.info.map(info => (
            <Row key={info.id} className="mb-3">
              <p>{info.description}</p>
            </Row>
          ))
        ) : (
          <Row>
            <p>Описание отсутствует</p>
          </Row>
        )}
      </Row>
    </Container>
  )
}

export default PlacePage;
