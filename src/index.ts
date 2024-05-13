import cors from "cors";
import  Express  from "express";
import { config } from "dotenv";
//importamos las dependecias

const PORT= 3001;//le decimos al api en que puerto se alojara
const app=Express();//permite definir rutas que corresponden a métodos HTTP
config();//permite seleccionar distintas funciones y configuraciones

app.use(Express.json(), Express.urlencoded({ extended: true }), cors());//lo usaremos para recibir peticiones POST

app.use("/ai",)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost: ${PORT}`);
  });//nos avisara si el servidor funciona corrctamente y donde se aloja  en la consola