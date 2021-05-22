import axios from "axios";
import { toast } from "react-toastify";



axios.defaults.headers.post["Content-Type"] = "application/json";


axios.interceptors.response.use(null, error => {

    if(error.response.status === 422){
        toast.error( error.response.data.result.msg , {
            position: "bottom-right",
            closeOnClick: true
        });
    }

    const expectedErrors =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;
    
    if (!expectedErrors) {
        toast.error( "از طرف سرور مشکلی پیش آمده است" , {
            position: "bottom-right",
            closeOnClick: true
        });
    }

    return Promise.reject(error);
});



export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
};