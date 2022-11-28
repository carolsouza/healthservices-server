import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuarios } from './Usuarios';

@Entity()
export class Resultados {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dataCad: Date;

  @Column()
  idTriagem: number;

  @Column()
  gravidade: string;

  @Column()
  especialidade: string;

  @Column()
  localidade: string;

  // Relations //
  @ManyToOne(() => Usuarios, (usuario) => usuario.id, { cascade: false })
  public usuarios: Usuarios;
}
