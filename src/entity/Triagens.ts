import {Entity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm";
import { Resultados } from "./Resultados";

@Entity()
export class Triagens {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    perguntas: string[];

    @Column()
    respostas: string[];

    @Column()
    idUsuario: number;

    @Column()
    dataCad: Date;

    // Relations 
    @OneToOne(type => Resultados, resultado => resultado.id, {cascade: false})
    resultados: Resultados

}