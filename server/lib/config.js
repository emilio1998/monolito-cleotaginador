const env = process.env;

export const PORT = env.PORT || 4002;
export const SECRET_KEY= env.JWT_SECRET_KEY;
export const REPOSITORIO_ARCHIVOS = env.REPOSITORIO_ARCHIVOS || 'D:\\Documentos\\RepositorioBD\\CleoTaginador\\';
export const ENTORNO = env.ENTORNO || 'PROD';