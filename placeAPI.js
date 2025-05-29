import { $host, $authHost } from "./index";

export const createType = async (type) => {
  const { data } = await $authHost.post('type', type);
  return data;
};

export const fetchTypes = async () => {
    try {
      const { data } = await $host.get('/type');
      return Array.isArray(data) ? data : []; 
    } catch (e) {
      console.error('Ошибка загрузки типов:', e);
      return []; 
    }
};
  
export const fetchPlaces = async (typeId, page, limit) => {
    try {
        let url = 'place?';
        if (typeId) url += `typeId=${typeId}&`;
        if (page) url += `page=${page}&`;
        if (limit) url += `limit=${limit}`;
        const { data } = await $host.get(url);
        return data;
    } catch (e) {
        console.error('Ошибка загрузки мест:', e);
        return { rows: [], count: 0 };
    }
};

export const createPlace = async (place) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Требуется авторизация');
        }
        const { data } = await $authHost.post('place', place, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    } catch (e) {
        console.error('Ошибка создания места:', e);
        throw e;
    }
};

export const fetchOnePlace = async (id) => {
    try {
        const { data } = await $host.get(`place/${id}`);
        return data;
    } catch (e) {
        console.error('Ошибка загрузки места:', e);
        throw e;
    }
};

export const updatePlace = async (id, placeData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Требуется авторизация');
        }
        const { data } = await $authHost.put('place/' + id, placeData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    } catch (e) {
        console.error('Ошибка обновления места:', e);
        throw e;
    }
};

export const deletePlace = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Требуется авторизация');
        }
        const { data } = await $authHost.delete('place/' + id, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    } catch (e) {
        console.error('Ошибка удаления персонажа:', e);
        throw e;
    }
};
