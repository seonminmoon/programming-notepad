const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const config = require('./config/key');
const { User } = require("./model/User"); // (1)

// 브라우저? 설정
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.json({extended: true}));

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
    .then(()=>console.log("mongo db connect success!"))
    .catch((error) => console.log(error));

app.get('/', (req, res) => res.send("Hello World! 새해복 많이 받으세요!"));

// 회원가입 할 때 필요한 정보들을 Client 에서 가져오면 그것들을 데이터베이스에 넣어줌
app.post('/register', (req, res) => {
     // new User 키워드를 사용할 수 있도록 미리 지정해둔 모델 스키마를 가져옴(1)
     // req.body 는 Client 에서 받아온 값들이며, 이것이 가능한 이유는 bodyParser 때문임
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err});
        return res.status(200).json({
            success:true
        })
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));