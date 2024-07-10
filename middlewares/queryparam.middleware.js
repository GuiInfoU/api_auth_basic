
const isValidDate = (req, res, next) => {
    const fechaA = req.query.login_before_date;
    const fechaD = req.query.login_after_date;
    if(!fechaA){
    }else if(isNaN(fechaA)){
        return res.status(400).json({
            message: 'login_before_date error1: No es un integer!'
        });
    }else if (parseInt(fechaA)<0){
        return res.status(400).json({
            message: 'login_before_date error2: Fecha no válida!'
        });
    }
    if(!fechaD){
    }else if(isNaN(fechaD)){
        return res.status(400).json({
            message: 'login_after_date error1: No es un integer!'
        });
    }else if (parseInt(fechaD)<0){
        return res.status(400).json({
            message: 'login_after_date error2: Fecha no válida!'
        });
    }
    if(!fechaA || !fechaD){
    }else if(parseInt(fechaA)<parseInt(fechaD)){
        return res.status(400).json({
            message: 'error: valores de fechas no válidos! (sesionAnteDate no puede ser menor que sesionDespDate)'
        });
    }
    next();
};

export default {
    isValidDate,
};
