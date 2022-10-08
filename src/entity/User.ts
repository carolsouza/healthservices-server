import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    birthday: Date;

    @Column()
    gender: string;

    @Column()
    UF: string;

    // Relations //

}