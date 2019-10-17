const axios= require('axios');

goHome= (req,res)=>{
  if(req.session.user){
      var rooms = [];
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
          for(var i=0;i<result.length;i++){
            rooms.push({
              id: result[i].number,
              name: result[i].sys_name
            });
          }
          console.log(rooms);
          res.render('index.hbs',{
            username: req.session.user.username,
            rooms: rooms

          });
      },(rej)=>{

      });

  }
  else{
    res.render('login.hbs');
  }
};

module.exports.goHome=goHome;
