const express = require('express');
const app = express();
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

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요~~~~~~~");
})


// 전체조회
app.get('/', (req, res) => {
    User.find({}, (err, users) => {return res.json(users)})
});

// 회원가입
app.post('/register', (req, res) => {
     // new User 키워드를 사용할 수 있도록 미리 지정해둔 모델 스키마를 가져옴(1)
     // req.body 는 Client 에서 받아온 값들이며, 이것이 가능한 이유는 bodyParser 때문임
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({success : false, err});
        return res.status(200).json({
            success:true
        })
    })
})

// 로그인
app.post('/login', (req, res) => {
    // 요청된 이메일이 데이터베이스에 있는지 조회
    const user = new User(req.body);

    console.log(req.body);
    // 몽구스 - 조회find, 하나만조회findOne, 수정update, 삭제remove, 저장save
    User.findOne({"email" : req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인.
        user.comparePassword(req.body.password, user.password, (err, isMatch) => {
            if(!isMatch) return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
            return res.json({loginSuccess: true, message:"로그인 성공!"})

            // 비밀번호까지 맞다면 토큰 생성하기
            // user.generateToken((err, user) => {
            //     if(err) return res.status(400).send(err);
            //     console.log(user.token);
            //     // 토큰을 저장한다. ==> 쿠키,로컬스토리지, ... ==> 쿠키
            //     res.cookies("x_auth", user.token)
            //     .status(200)
            //     .json({ loginSuccess:true, userId: user._id })
            // })
        })
    })
})

// 정보변경
app.post('/update', (req, res) => {
    User.findOneAndUpdate(
        {"email" : req.body.email},     // filter
        {"name" : req.body.name},       // update object
        {},                             // option condition
        (err, user) => {                // callback function
            if(!user) return res.json({success:false, message : "회원정보 변경 중 오류가 발생하였습니다."});
            return res.json({success : true, message : "변경되었습니다.", results: user});
        }
    )
});

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
