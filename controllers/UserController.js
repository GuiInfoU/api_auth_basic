import { Router } from 'express';
import UserService from '../services/UserService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import UserMiddleware from '../middlewares/user.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import QueryparamMiddleware from '../middlewares/queryparam.middleware.js';

const router = Router();

router.post('/create', async (req, res) => {
    const response = await UserService.createUser(req);
    res.status(response.code).json(response.message);
});

router.get('/getAllUsers',
    [
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions
    ],
    async (req, res) => {
        const response = await UserService.getAll();
        res.status(response.code).json(response.message);
    });

router.get('/findUsers',
    [
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
        QueryparamMiddleware.isValidDate,
    ],
    async (req, res) => {
        const response = await UserService.getUserByFilter(req);
        res.status(response.code).json(response.message);
    });

router.get('/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions
    ],
    async (req, res) => {
        const response = await UserService.getUserById(req.params.id);
        res.status(response.code).json(response.message);
    });

router.put('/:id', 
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
    ],
    async(req, res) => {
        const response = await UserService.updateUser(req);
        res.status(response.code).json(response.message);
    });

router.delete('/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
    ],
    async (req, res) => {
       const response = await UserService.deleteUser(req.params.id);
       res.status(response.code).json(response.message);
    });

    router.post('/bulkCreate', async (req, res) => {
        const usersGroup = req.body;
        const cantidad = usersGroup.length;
        let valido=0;
        let noValido=0;
        for( let i = 0; i < cantidad; i++){
            let valid =await UserService.createUserOnBulk(req.body[i]);
            if(valid){ 
                valido++;
            }else{
                noValido++;
            }
        }
        res.status(200).json('Proceso bulkCreate completado. Cantidad de usuarios registrados exitosamente: '+valido+'. Cantidad de usuarios no registrados: '+noValido);
    });

export default router;