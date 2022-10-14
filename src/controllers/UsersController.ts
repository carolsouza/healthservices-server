import { getRepository } from 'typeorm';
import { Usuarios } from '../entity/Usuarios';
import { Request, Response } from 'express';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


export const getUsers = async (request: Request, response: Response) => {

    let Users = await getRepository(Usuarios).find();

    Users = Users.map((user) => { delete user.senha; delete user.token; return user })

    return response.json(Users)
}


export const getUser = async (request: Request, response: Response) => {
    const { id } = request.params

    const user = await getRepository(Usuarios).findOne(id);
    return response.json(user);
}


export const saveUser = async (request: Request, response: Response) => {
    // console.log(request.body)
    const hashPassword = await bcrypt.hash(request.body.senha, 10);
    const users = new Usuarios();
    users.nome = request.body.nome;
    users.senha = hashPassword;
    users.dataNascimento = request.body.dataNascimento;
    users.genero = request.body.genero;
    users.UF = request.body.UF;
    users.cidade = request.body.cidade;
    users.email = request.body.email;

    const user = await getRepository(Usuarios).save(users);
    response.json(user);
}

export const updateUser = async (request: Request, response: Response) => {
    const { id } = request.params

    const hashPassword = await bcrypt.hash(request.body.senha, 10);
    const users = new Usuarios();
    users.nome = request.body.nome;
    users.senha = hashPassword;
    users.email = request.body.email;

    const user = await getRepository(Usuarios).update(id, users);

    if (user.affected == 1) {
        const userUpdated = await getRepository(Usuarios).findOne(id)
        return response.json(userUpdated)
    }

    return response.status(404).json({ message: 'Usuário não encontrado' })
}

export const removeUser = async (request: Request, response: Response) => {
    const { id } = request.params

    const user = await getRepository(Usuarios).delete(id);

    if (user.affected == 1) {
        const userUpdated = await getRepository(Usuarios).findOne(id)
        return response.json({ message: 'Usuário removido' })
    }

    return response.status(404).json({ message: 'Usuário não encontrado' })
}

export const verificaLogin = async (request: Request, response: Response) => {

    if (request.body) {

        const values = request.body;
        const users = await getRepository(Usuarios).findOne({
            where: {
                email: values.email
            }
        })

        if (users == null) {
            return response.status(400).send('Nenhum usuário encontrado!')
        }

        const isValid = await bcrypt.compare(values.senha, users.senha)

        if (!isValid) {
            return response.sendStatus(401)
        }

        const token = jwt.sign({ id: users.id }, 'secret', { expiresIn: '2d' })

        const usersToken = { ...users, token: token }

        const res = await getRepository(Usuarios).save(usersToken)

        delete users.senha;

        return response.json({
            users,
            token
        })

    } else {
        response.status(400).json({ message: 'Requisicao Inválida!' })
    }

}