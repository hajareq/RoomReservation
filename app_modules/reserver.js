const axios= require('axios');

check = (req,res)=>{

const options={
    url:'https://dev64642.service-now.com/api/now/v2/table/x_252403_roomreser_room',
    method:'get',
    auth:{
        username: req.session.user.username,
        password: req.session.user.password
    }
};
axios(options).then((val)=>{
    var result=val.data.result;
    console.log(result);
    res.render('index.hbs',{
      username: req.session.user.username,
    });
},(rej)=>{

});
};
module.exports.check=check;
