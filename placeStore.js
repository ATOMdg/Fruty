import { makeAutoObservable } from "mobx";
import { fetchPlaces, createPlace, updatePlace, deletePlace, fetchTypes } from "../../http/placeAPI";

export default class PlaceStore {
    places = [];
    types = [];
    selectedType = {};
    isLoading = false;
    error = null;
    totalCount = 0;
    page = 1;
    limit = 5;

    constructor() {
        makeAutoObservable(this);
        this.fetchAllData();
    }
    
    async fetchAllData() {
        this.isLoading = true;
        try {
            const [types, places] = await Promise.all([
                fetchTypes(),
                fetchPlaces()
            ]);
            this.setTypes(types);
            this.setPlaces(Array.isArray(places.rows) ? places.rows : (Array.isArray(places) ? places : []));
            this.setTotalCount(places.count || 0);
        } catch (e) {
            console.error("Ошибка загрузки:", e);
            this.error = e;
        } finally {
            this.isLoading = false;
        }
    }

    setPlaces(places) {
        this.places = Array.isArray(places) ? places : [];
    }

    setTypes(types) {
        this.types = types;
    }

    setSelectedType(type) {
        this.selectedType = type;
    }

    setTotalCount(count) {
        this.totalCount = count;
    }

    setPage(page) {
        this.page = page;
    }

    async createPlace(placeData) {
        try {
            const formData = new FormData();
            formData.append('name', placeData.name);
            formData.append('img', placeData.file);
            formData.append('typeId', placeData.typeId);
            const info = [{ description: placeData.description || '' }];
            formData.append('info', JSON.stringify(info));
            console.log('Отправляемые данные:', { name: placeData.name, file: placeData.file, typeId: placeData.typeId, description: placeData.description });
            const response = await createPlace(formData);
            if (response) {
                this.setPlaces([...(Array.isArray(this.places) ? this.places : []), response]);
            }
            return response;
        } catch (e) {
            console.error("Ошибка при создании:", e);
            throw e;
        }
    }

    async updatePlace(id, placeData) {
        try {
            const formData = new FormData();
            formData.append('name', placeData.name);
            if (placeData.file) {
                formData.append('img', placeData.file);
            }
            formData.append('typeId', placeData.typeId);
            const info = [{ description: placeData.description || '' }];
            formData.append('info', JSON.stringify(info));
            const data = await updatePlace(id, formData);
            if (data) {
                const updatedPlaces = (Array.isArray(this.places) ? this.places : []).map(place => 
                    place.id === id ? data : place
                );
                this.setPlaces(updatedPlaces);
            }
            return data;
        } catch (e) {
            console.error("Ошибка при обновлении:", e);
            throw e;
        }
    }

    async deletePlace(id) {
        try {
            await deletePlace(id);
            this.setPlaces((Array.isArray(this.places) ? this.places : []).filter(place => place.id !== id));
        } catch (e) {
            console.error("Ошибка при удалении:", e);
            throw e;
        }
    }
}