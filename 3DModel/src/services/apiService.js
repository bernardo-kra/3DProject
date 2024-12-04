import { FILE_URL, VERIFY_TOKEN_URL, PROJECTS_URL, SITE_URL } from '../assets/variables'

const getAuthToken = () => localStorage.getItem('authToken')

const apiRequest = async (url, method = 'GET', body = null) => {
    const headers = {
        'Authorization': `Bearer ${getAuthToken()}`,
    }

    const options = {
        method,
        headers,
    }

    if (body) {
        options.body = body
    }

    try {
        const response = await fetch(url, options)
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.mensagem || `Erro: ${response.statusText}`)
        }
        return await response.json()
    } catch (error) {
        console.error('Erro na requisição API:', error)
        throw error
    }
}

export const fetchUploads = async () => {
    const response = await apiRequest(`${SITE_URL}/list-all`)
    return response
}

export const fetchS3Items = async () => {
    const response = await apiRequest(`${SITE_URL}/list-all-s3`)
    return response
}

export const fetchSignedUrl = async (filePath) => {
    const url = `${FILE_URL}?filePath=${encodeURIComponent(filePath)}`
    const response = await apiRequest(url)
    return response.signedUrl
}

export const fetchProjects = async () => {
    return await apiRequest(`${SITE_URL}/list-all`)
}

export const verifyToken = async () => {
    return await apiRequest(VERIFY_TOKEN_URL, 'POST')
}
