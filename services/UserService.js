import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

const createUser = async (req) => {
    const {
        name,
        email,
        password,
        password_second,
        cellphone
    } = req.body;
    if (password !== password_second) {
        return {
            code: 400,
            message: 'Passwords do not match'
        };
    }
    const user = await db.User.findOne({
        where: {
            email: email
        }
    });
    if (user) {
        return {
            code: 400,
            message: 'User already exists'
        };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
        name,
        email,
        password: encryptedPassword,
        cellphone,
        status: true
    });
    return {
        code: 200,
        message: 'User created successfully with ID: ' + newUser.id,
    }
};

const getUserById = async (id) => {
    return {
        code: 200,
        message: await db.User.findOne({
            where: {
                id: id,
                status: true,
            }
        })
    };
}

const updateUser = async (req) => {
    const user = db.User.findOne({
        where: {
            id: req.params.id,
            status: true,
        }
    });
    const payload = {};
    payload.name = req.body.name ?? user.name;
    payload.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
    payload.cellphone = req.body.cellphone ?? user.cellphone;
    await db.User.update(payload, {
        where: {
            id: req.params.id
        }

    });
    return {
        code: 200,
        message: 'User updated successfully'
    };
}

const deleteUser = async (id) => {
    /* await db.User.destroy({
        where: {
            id: id
        }
    }); */
    const user = db.User.findOne({
        where: {
            id: id,
            status: true,
        }
    });
    await  db.User.update({
        status: false
    }, {
        where: {
            id: id
        }
    });
    return {
        code: 200,
        message: 'User deleted successfully'
    };
}

const getAll = async () => {
    return {
        code: 200,
        message: await db.User.findAll({
            where: {
                status: true,
            }
        })
    };
}

const getUserByFilter = async (req) => {
    const activo = req.query.active;
    let filtro1 = {};
    if(!activo || activo === null) {
    }else{
        if(activo === 'true'){
            filtro1 = {status:true};
        }else if(activo === 'false'){
            filtro1 = {status:false};
        }
    }

    const nameParcial = req.query.name;
    let filtro2 = {};
    if(!nameParcial || nameParcial === null){
    }else{
        filtro2 = {name:{[Op.like]:'%'+nameParcial+'%'}};
    }

    const sesionAnteDate = req.query.login_before_date;
    let grupo1=null;
    if(!sesionAnteDate || sesionAnteDate === null){
    }else{
        let filterDate = parseInt(sesionAnteDate,10);
        const usersId = await db.Session.findAll({
            attributes: ['id_user'],
            where: {
                createdAt:{
                    [Op.gte]:filterDate
                }
            }
        });
        let idUserFilter = usersId.map(session => session.id_user);
        idUserFilter = idUserFilter.filter((item,index) => idUserFilter.indexOf(item) === index);
        const usersId2 = await db.Session.findAll({
            attributes: ['id_user'],
            where: {
                id_user:{
                    [Op.notIn]:idUserFilter
                }
            }
        });
        let idUserFilter2 = usersId2.map(session => session.id_user);
        idUserFilter2 = idUserFilter2.filter((item,index) => idUserFilter2.indexOf(item) === index);
        grupo1 = idUserFilter2;
    }

    const sesionDespDate = req.query.login_after_date;
    let grupo2=null;
    if(!sesionDespDate || sesionDespDate === null) {
    }else{
        let filterDate = parseInt(sesionDespDate,10);
        const usersId = await db.Session.findAll({
            attributes: ['id_user'],
            where: {
                createdAt:{
                    [Op.gte]:filterDate
                }
            }
        });
        let idUserFilter = usersId.map(session => session.id_user);
        idUserFilter = idUserFilter.filter((item,index) => idUserFilter.indexOf(item) === index);
        grupo2 = idUserFilter;
    }
    let filtro3 = {};
    if(grupo1 !== null && grupo2 !== null){
        let inter = grupo1.filter(id_user => grupo2.includes(id_user));
        console.log(inter);
        if(inter.length !== 0){
            filtro3 = {id:{[Op.in]:inter}}
        }else{
            return {
                code: 200,
                message: inter
            }
        }
    }else if(grupo1 !== null){
        filtro3 = {id:{[Op.in]:grupo1}}
    }
    else if(grupo2 !== null){
        filtro3 = {id:{[Op.in]:grupo2}}
    }

    let listaFiltros = {};
    if (filtro1 !== null || filtro1 !== undefined) {
        Object.assign(listaFiltros, filtro1);
    }
    if (filtro2 !== null || filtro2 !== undefined) {
        Object.assign(listaFiltros, filtro2);
    }
    if (filtro3 !== null || filtro3 !== undefined) {
        Object.assign(listaFiltros, filtro3);
    }

    return {
        code: 200,
        message: await db.User.findAll({
            order: [['createdAt','DESC']],
            where: listaFiltros,
        })
    };
}

const createUserOnBulk = async (req) => {
    if(!req.name || req.name ==='') {
        return false;
    }
    const name = req.name;
    if(!req.email || req.email ==='') {
        return false;
    }
    const email = req.email;
    if(!req.password || req.password ==='') {
        return false;
    }
    const password = req.password;
    if(!req.password_second) {
        return false;
    }
    const password_second = req.password_second;
    if (req.password !== req.password_second) {
        return false;
    }
    if(!req.cellphone || req.cellphone ==='') {
        return false;
    }
    const cellphone = req.cellphone;
    const user = await db.User.findOne({
        where: {
            email: email
        }
    });
    if (user) {
        return false;
    }
    const encryptedPassword = await bcrypt.hash(req.password, 10);
    const newUser = await db.User.create({
        name,
        email,
        password: encryptedPassword,
        cellphone,
        status: true
    });
    return true;
};

export default {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAll,
    getUserByFilter,
    createUserOnBulk,
}