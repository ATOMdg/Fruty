import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TypePlace from "../components/TypePlace";
import PlaceList from "../components/PlaceList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchPlaces, fetchTypes } from "../http/placeAPI";
import Pages from "../components/Pages";

const Home = observer(() => {
    const {place} = useContext(Context);
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const [types, places] = await Promise.all([
                    fetchTypes(),
                    fetchPlaces(undefined, place.page, place.limit)
                ]);
                
                if (types) place.setTypes(types);
                if (places) {
                    place.setPlaces(places.rows || places);
                    place.setTotalCount(places.count || 0);
                }
            } catch (e) {
                console.error("Ошибка загрузки:", e);
                place.setTypes([]);
                place.setPlaces([]);
                place.setTotalCount(0);
            }
        };
        
        loadData();
    }, [place.page, place.selectedType]);

    if (!place) return <div>Загрузка...</div>;

    return (
        <Container>
            <Row className="mt-2">
                <Col md={3}>
                    <TypePlace/>
                </Col>
                <Col md={9}>
                    <div style={{display: 'flex', flexDirection: 'column', minHeight: '70vh', justifyContent: 'space-between'}}>
                        <PlaceList/>
                        <div style={{marginTop: 'auto'}}>
                            <Pages/>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
});

export default Home;
