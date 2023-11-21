import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    environment: process.env.ENV || 'develop'
};

export const db = {
    port: process.env.DB_PORT || 3306,
    type: process.env.DB_TYPE || 'mysql',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS ||  '',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'app',
}

export const lg = {
    level: process.env.LOGGER_LEVEL || 'info'
}

export const jwt = {
    secretKey:process.env.JWT_SECRET || 'your_secret_key',
    expirationTime: process.env.JWT_EXPIRATION_TIME
}

export const redis_env = {
    url: process.env.REDIS_URL || 'otra_url'
}

export const bcrypt_vars = {
    saltSync: Number(process.env.BCRYPT_SALT_SYNC) 
}

export const userLimits = {
    linkNumber: Number(process.env.MAX_LINKS)
}