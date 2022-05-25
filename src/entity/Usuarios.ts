import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Triagens } from "./Triagens";
import { Resultados } from "./Resultados";

@Entity()
export class Usuarios {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    dataNascimento: Date;

    @Column()
    genero: string;

    @Column()
    UF: string;


    // Relations //
    @OneToMany(type => Triagens, triagem => triagem.id, {cascade: false})
    triagens: Triagens[]

    @OneToMany(type => Resultados, resultado => resultado.id, {cascade: false})
    resultados: Resultados[]
}
