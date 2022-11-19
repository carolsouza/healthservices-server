import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
// import { Usuarios } from './Usuarios';

@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  especialidade: string;

  @Column()
  data_consulta: Date;

  @Column()
  horario: Date;

  @Column()
  email: string;
}
