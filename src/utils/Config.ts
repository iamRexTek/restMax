import { error } from "console";

export const getConfig =(key: string) =>{
    const value= process.env[key];

    if(value === undefined){
        throw new Error(`Variable de entorno faltante: ${key}`)//usamos throw para lanzar una excepcion
    }
    return value;//nos regresara el mensaje si falta una variable
}

