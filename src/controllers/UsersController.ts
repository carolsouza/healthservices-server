import { getRepository } from 'typeorm';
import { Usuarios } from '../entity/Usuarios';
import { Request, Response } from 'express';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


export const getUsers = async (request: Request, response: Response) => {
    response.json({
        message: 'testando'
    });
    console.log('ok')
    //const Users = await getRepository(Users).find();    
    // return response.send({id: request.params.id});
}


export const getUser = async (request: Request, response: Response) => {
    const { id } = request.params

    const user = await getRepository(Usuarios).findOne(id);    
    return response.json(user);
}


export const saveUser = async (request: Request, response: Response) => {
    console.log(request.body)
    const hashPassword = await bcrypt.hash(request.body.values.senha, 10);
    const users = new Usuarios();
    users.nome = request.body.values.nome;
    users.senha = hashPassword;
    users.dataNascimento = request.body.values.dataNascimento;
    users.genero = request.body.values.genero;
    users.UF = request.body.values.UF;
    users.cidade = request.body.values.cidade;
    users.email = request.body.values.email;

    const user = await getRepository(Usuarios).save(users);    
    response.json(user);
}

export const updateUser = async(request: Request, response: Response) => {
    const { id } = request.params

    const hashPassword = await bcrypt.hash(request.body.senha, 10);
    const users = new Usuarios();
    users.nome = request.body.nome;
    users.senha = hashPassword;

    const user = await getRepository(Usuarios).update(id, users);

    if(user.affected == 1){
        const userUpdated = await getRepository(Usuarios).findOne(id)
        return response.json(userUpdated)
    }

    return response.status(404).json({message: 'Usuário não encontrado'})
}

export const removeUser = async(request: Request, response: Response) => {
    const { id } = request.params

    const user = await getRepository(Usuarios).delete(id);

    if(user.affected == 1){
        const userUpdated = await getRepository(Usuarios).findOne(id)
        return response.json({message: 'Usuário removido'})
    }

    return response.status(404).json({message: 'Usuário não encontrado'})
}

export const verificaLogin = async(request: Request, response: Response) => {
    
    if (request.body) {
        
        const { values } = request.body;
        const users = await getRepository(Usuarios).findOne({
            where: {
                email: values.email
            }
        })  
        
        if(users == null){
            return response.status(400).send('Nenhum usuário encontrado!')
        }
    
        const isValid = await bcrypt.compare(values.senha, users.senha)
    
        if(!isValid){
            return response.sendStatus(401)
        }
    
        const token = jwt.sign({id: users.id}, 'secret', {expiresIn: '2d'})
    
        delete users.senha;
    
        return response.json({
            users,
            token
        })

    } else {
        response.status(400).json({message: 'Requisicao Inválida!'})
    }

}