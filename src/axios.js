import axios from 'axios';

const instance = axios.create({
    baseURL:"https://us-central1-fir-d374a.cloudfunctions.net/api"
})

export default instance;

// http://localhost:5001/fir-d374a/us-central1/api