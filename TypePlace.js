import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Context } from "../index";
import ListGroup from 'react-bootstrap/ListGroup';
import { fetchTypes } from "../http/placeAPI";

const TypePlace = observer(() => {
  const { place } = useContext(Context);
  
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await fetchTypes();
        if (types && Array.isArray(types)) {
          place.setTypes(types);
        }
      } catch (e) {
        console.error('Ошибка загрузки типов:', e);
      }
    };
    
    loadTypes();
  }, []);
  
  if (!place) return <div>Контекст не инициализирован</div>;
  if (!place.types) return <div>Загрузка...</div>;
  if (!place.types.length) return <div>Нет доступных типов</div>;
  
  return (
    <ListGroup>
      {place.types.map(type => (
        <ListGroup.Item 
          key={type.id}
          onClick={() => place.setSelectedType(type)}
          style={{cursor: 'pointer'}}
          active={place.selectedType?.id === type.id}
        >
          {type.name || 'Без названия'}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default TypePlace