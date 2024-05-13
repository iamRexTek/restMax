import  fetch  from "node-fetch";
import { getConfig } from "../utils/Config";
import { response } from "express";
//importamos las dependencias y el getConfig de la carpeta de utils

export const EnviarOpenAi = async(prompt:string) => { //exportamos todo este codigo con el nombre EnviarOpenAi
    const OPENAI_URL = "https://api.openai.com/v1/chat/completions";//url de open ai para el chat
     try{//intentamos hacer funcionar esto, con try vigilamos que no haya errores
        const Response = await fetch(OPENAI_URL,{//hacemos una peticion HTTP
            method:"POST",//actualizamos el recurso
            headers:{
                "content-type":"appliaction/json",//tipo de contenido
                Authorization:`Bearer ${getConfig("OPENAI_API_KEY")}`,//la autorizcion de OpenAi
            },
            body:prompt,
        });

        if (!Response.ok){//si es diferente a la respuesta
            const errorData = await Response.text();//pausara el codigo hasta que error se acabe o se cancele
            throw new Error(`Error de OpenAI: ${Response.status} ${errorData}`)//si algo sale mal se nso avisara junto al error

        }
        const data = await Response.json();
        console.log(data.choices[0].message);//nos dara la informacion
        return data.choices[0].message.content;
     }catch (error){//si hubo algun error en la ejecucion de este codigo catch lo atrapa 
        console.error("Falla al enviar los datos a OpenAi:", error);//nos dira el mensaje en la consola y dira el error
        throw new Error("falla al comunicarse con OpenaAi API");//si se produce uan excepcion esto nos lo avisara 

     }
}