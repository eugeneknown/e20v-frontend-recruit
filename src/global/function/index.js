import axios from "api/axios";
import { axiosPrivate } from "api/axios";
import propTypes from 'prop-types'


export const dataService = async (method, url, data) => {
    switch (method) {
        case 'GET':
            return await axios.get(url, data)

        case 'POST':
            return await axios.post(url, data)
    }
}

export const dataServicePrivate = async (method, url, data) => {
    switch (method) {
        case 'GET':
            return await axiosPrivate.get(url, data)

        case 'POST':
            return await axiosPrivate.post(url, data)
    }
}

dataService.propTypes = {
    method: propTypes.string.isRequired,
    url: propTypes.string.isRequired,
    data: propTypes.object.isRequired,
}

dataServicePrivate.propTypes = {
    method: propTypes.string.isRequired,
    url: propTypes.string.isRequired,
    data: propTypes.object.isRequired,
}