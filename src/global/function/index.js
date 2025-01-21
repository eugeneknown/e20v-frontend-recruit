import axios from "api/axios";
import { axiosPrivate } from "api/axios";
import propTypes from 'prop-types'
import moment from "moment-timezone";


export const dataService = async (method, url, data, params={}) => {
    switch (method) {
        case 'GET':
            return await axios.get(url, data, params)

        case 'POST':
            return await axios.post(url, data, params)
    }
}

export const dataServicePrivate = async (method, url, data, params={}) => {
    switch (method) {
        case 'GET':
            return await axiosPrivate.get(url, data, params)

        case 'POST':
            return await axiosPrivate.post(url, data, params)
    }
}

export const formatDateTime = (date, output, timezone, is_tz) => {
    return is_tz ? moment().tz( date, timezone ).format( output ) : moment( date ).format( output );
}

formatDateTime.defaultProps = {
    date: '',
    output: 'YYYY-MM-DD HH:mm:ss',
    timezone: 'Asia/Manila',
    is_tz: false
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

formatDateTime.propTypes = {
    date: propTypes.string.isRequired,
    output: propTypes.string,
}