import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import CreatePlace from "../components/modals/CreatePlace";
import CreateType from "../components/modals/CreateType";


const Admin = () => {
    const [placeVisible, setPlaceVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    return (
      <Container className="d-flex flex-column">
        
        <Button variant={"outline-dark"} className="mt-4 p-2" onClick={() => setTypeVisible(true)}>Добавить место обитания</Button>
        <Button variant={"outline-dark"} className="mt-4 p-2" onClick={() => setPlaceVisible(true)}>Добавить персонажа</Button>
        <CreatePlace show={placeVisible} onHide={() => setPlaceVisible(false)}/>
        <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
      </Container>
    )
}

export default Admin;
