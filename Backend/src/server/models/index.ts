import { Pais } from "./Pais";
import { Estado } from "./Estado";
import { Municipio } from "./Municipio";
import { Bioma } from "./Bioma";
import { Satelite } from "./Satelite";
import { Ocorrencia } from "./Ocorrencia";

const pais = new Pais(1, "Brasil");
const estado = new Estado(1, "São Paulo", 1);
const municipio = new Municipio(1, "Jacareí", 1);
const bioma = new Bioma(1, "Mata Atlântica");
const satelite = new Satelite(1, "Aqua");
const ocorrencia = new Ocorrencia( 1, 1,1,  new Date("2025-04-14T10:00:00Z"),  1,  "Segunda-feira",  5.5,  80,  -22.9,  -47.06,  50.0);

