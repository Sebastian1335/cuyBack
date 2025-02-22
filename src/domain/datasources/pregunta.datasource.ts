import { CreatePreguntaDTO, UpdatePreguntaDTO } from "../dtos";
import { PreguntaEntity, RespuestaEntity } from "../entities";

export abstract class PreguntaDatasource{
    abstract create(createPreguntaDTO: CreatePreguntaDTO): Promise<PreguntaEntity>
    abstract getById(id: number): Promise<PreguntaEntity>
    abstract updateById(updatePreguntaDTO: UpdatePreguntaDTO): Promise<PreguntaEntity>
    abstract deleteById(id: number): Promise<PreguntaEntity>
    abstract getRespuestasbyIdPregunta(id: number): Promise<PreguntaEntity>
}