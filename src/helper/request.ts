import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import ResponseError from "../error/ResponseError";

class http {
    private static headersList: AxiosHeaders | null = null;
    private static axRes: AxiosResponse | null = null;

    static headers(heads: AxiosHeaders) {
        this.headersList = heads;
        return this
    }

    static axiosResponse() {
        return this.axRes;
    }

    static async post(url: string, body?: any) {
        try {
            const response = await axios.request({
                url,
                data: body,
                headers: this.headersList || {}, // Provide a default empty object if this.headersList is null
                method: 'POST'
            });
            this.axRes = response;
            this.headersList = null;
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log()
                throw new ResponseError(error.response?.status!, '', error.response?.data)
            }
        }
    }

    static async get(url: string) {
        const response = await axios.request({
            url,
            headers: this.headersList || {},
            method: 'GET'
        });
        this.axRes = response;
        this.headersList = null;
        return response.data;
    }

    static response(status?: number, data?: any) {
        return {
            status: status ? status : 200,
            data: data
        }
    }
}

export default http;
