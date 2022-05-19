import type {NextApiRequest, NextApiResponse} from 'next'
import axios from "axios";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {playlistId} = req.query
    if (!playlistId) return res.status(404).send('playlistId not found')
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${process.env.YOUTUBE_DATA_API_KEY}&part=snippet&maxResults=50`)
        .catch(() => null)
    if (!response) return res.status(200).send('invalid playlistId')
    return res.status(200).json(response.data)
}
