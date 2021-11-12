const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const { User } = require("./model/User"); // (1)

// 브라우저? 설정
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.json({extended: true}));
app.use(cookieParser())

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



app.post('/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    const user = new User(req.body);
    User.findOne({"email" : req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    })

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch) return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."}) ///////////////////????????????분명 맞는 ID/PW 쳤는데 false가 리턴됨.

        // 비밀번호까지 맞다면 토큰 생성하기
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            console.log(user.token);
            // 토큰을 저장한다. 어디에 ? 쿠키,로컬스토리지, ...
            // ===> 여기서는 쿠키
            res.cookies("x_auth", user.token)
            .status(200)
            .json({ loginSuccess:true, userId: user._id })

        })
    })

})







app.listen(port, () => console.log(`Example app listening on port ${port}!`));