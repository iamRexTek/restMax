//importamos las dependencias
import { Request, Response, Router, response } from "express";
import fs from "fs";
import multer from "multer";
import PdfParse from "pdf-parse";
//importamos los utils
import { EnviarOpenAi } from "../services/OpenAI_Services";
import { summarizeText } from "../utils/SummarizeText";
import { generatePrompt } from "../utils/prompt";



const router = Router();
const subir = multer({ dest:"uploads/"})
//usaremos los interface para integrar los servicios 
interface evaluarCandidato {
    puntuacion_Exp: number;
    puntuacion_eduacion: number;
    punt_habilidades:number;
    punt_lenguaje: number;
    lvl_antiguedad: string;
    soft_skill:string[];
    hard_skill: string[];
}

 interface PerfilCandidato {
    nombreArchivo: string;
    evaluacion: evaluarCandidato;
}

interface respuestaApi {
    respuesta: string;//esto es lo que vamos a recibir
}

router.post("/generate", async(req:Request, res:Response)=>{
    try {
        const { prompt } = req.body;
    
        const AIResponse = await EnviarOpenAi (prompt);
    
        res.json({ response: AIResponse });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    router.post(
        "/upload-cv",

        subir.fields([
            {name: "pdfs", maxCount:50},
            {name:"posicion", maxCount: 1}
        ]),
        async(req:Request, res:Response)=>{
            try{
                const {pdfs , posicion}  = req.files as {
                    pdfs:Express.Multer.File[];
                     posicion:Express.Multer.File[];
                };
                if (!posicion || !pdfs){
                    return res
                    .status(400)
                    .send("faltan archivos de las vacantes PDF")
                }

                const vacanteText = fs.readFileSync(posicion[0].path, "utf-8")
                const summaries = [];

                for(const pdf of pdfs){
                    const dataBuffer= fs.readFileSync(pdf.path);
                    const pdfText = await PdfParse(dataBuffer); 

                    const summary = summarizeText(pdfText.text);
                    summaries.push({filename: pdf.originalname, summary});

                }

                const promptText = await generatePrompt(
                    vacanteText,
                    JSON.stringify(summaries)
                );
                
                if(!promptText){
                    return res
                    .status(500)
                    .send("ocurrio un error al procesar los pdf")
                }

                const jsonData = await EnviarOpenAi(JSON.stringify(promptText));
              
                res.json({
                    response: JSON.parse(jsonData),
                })

            } catch (error:any){
                console.error({error})
                res.status(500).send({error: error.message})

            }
        }
    );

    export default router;