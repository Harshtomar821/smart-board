// axios
import axios from 'axios'
import BASE_URL from './baseUrl'

export const getRoom = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/rooms/${id}`);
        return response.data;
    } catch (err) {
        throw err;
    }
}