import {fileURLToPath} from 'url';
import { dirname } from 'path';

// PATH
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// ERROR (500)
export const catchError = (res, error) =>{
    res.setHeader('Content-Type', 'application/json'); 
    return res.status(500).json(
        {
            status: 'error',
            error: 'Unexpected server error. Try later.', 
            detalle: `${error.message}`
        }
    )
}