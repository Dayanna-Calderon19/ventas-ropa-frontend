// Standard response wrapper to ensure consistency
const handleApiResponse = async (promise) => {
    try {
        const response = await promise;
        // Assume API returns { data: ..., message: ... }
        return response.data;
    } catch (error) {
        // Log error and rethrow to be handled by caller
        console.error("Service Error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Error inesperado en el servicio" };
    }
};

export default handleApiResponse;
