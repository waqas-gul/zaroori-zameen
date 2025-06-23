import axios from "axios";
import { Backendurl } from "../App";

export const getFavoriteProperties = async () => {
    const token = localStorage.getItem('token');

    // If user is not logged in, just return an empty array
    if (!token) {
        return [];
    }

    try {
        const response = await axios.get(`${Backendurl}/api/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response?.data?.data || [];
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};
