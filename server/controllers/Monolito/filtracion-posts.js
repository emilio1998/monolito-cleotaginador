import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { REPOSITORIO_ARCHIVOS } from '../../lib/config.js';
import sizeOf from 'image-size';
import fs from 'node:fs';

export const listarPosts = async (req, res) => {
    try {
        const urlRepo = join(REPOSITORIO_ARCHIVOS, 'posts');
        const entradas = await readdir(urlRepo, { withFileTypes: true });
        const carpetas = entradas
            .filter((entrada) => entrada.isDirectory())
            .map((entrada) => entrada.name);

        const imagenes = [];
        for (const carpeta of carpetas) {
            const urlCarpeta = join(urlRepo, carpeta);
            const urlImagenes = join(urlCarpeta, 'Imagenes');
            const archivos = await readdir(urlImagenes, { withFileTypes: true });
            const imagenesCarpeta = archivos
                .filter((archivo) => archivo.isFile())
                .map((archivo) => archivo.name);

            const datosImagenes = []
            for (const imagen of imagenesCarpeta) {
                const urlImagen = join(urlImagenes, imagen);
                const archivoBuffer = fs.readFileSync(urlImagen);
                const dimensiones = sizeOf(archivoBuffer);

                const extension = imagen.split('.').pop();
                const base64Data = archivoBuffer.toString('base64');

                const srcBase64 = `data:image/${extension};base64,${base64Data}`;

                datosImagenes.push({ nombre: imagen, 
                    ancho: dimensiones.width,
                    alto: dimensiones.height,
                    srcBase64 });
            }

            imagenes.push({ carpeta, 
                imagenes: datosImagenes, imagenPrincipal: datosImagenes[0],
                imagenesDestacadas: datosImagenes.slice(0, 7) });
        }

        return res.status(200).json({ message: 'OK!!!', data: imagenes });
    } catch (err) {
        console.log('error', err);
        return res.status(500).json({
            message: 'No se pudieron listar las carpetas de posts',
        });
    }
};