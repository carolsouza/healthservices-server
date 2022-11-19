import { getRepository } from 'typeorm';
import { Triagens } from '../entity/Triagens';
import { Request, Response } from 'express';

export const getTriagens = async(request: Request, response: Response) => {
    //pega todas as triagens

    const triagens = await getRepository(Triagens).find()
    console.log(triagens)

    return response.json(triagens);
}

export const getTriagem = async(request: Request, response: Response) => {
    //pega uma triagem só

    const { id } = request.params

    const triagem = await getRepository(Triagens).findOne(id);    
    return response.json(triagem);
}

export const saveTriagem = async(request: Request, response: Response) => {
    //salva triagem

    //receber values pelo body e adicionar ao objeto triagens

    const triagens = new Triagens();

    const triagem = await getRepository(Triagens).save(triagens);
    response.json(triagem);   
}

export const removeTriagem = async(request: Request, response: Response) => {
    //deleta triagem

    const { id } = request.params

    const triagem = await getRepository(Triagens).delete(id);

    if (triagem.affected == 1) {
        const triagemUpdated = await getRepository(Triagens).findOne(id)
        return response.json({ message: 'Usuário removido' })
    }

    return response.status(404).json({ message: 'Usuário não encontrado' })
}