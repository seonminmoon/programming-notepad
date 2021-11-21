const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 암호화 자릿수 설정
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxLength : 100
    },
    email : {
        type : String,
        trim: true,
        unique: 1
    },
    password : {
        type: String,
        minLength : 5
    },
    lastname : {
        type: String,
        maxLength : 50
    },
    role : {
        type: Number,
        default:0
    },
    image : String,
    token : {
        type: String
    },
    tokenExp : { // 유효기간
        type: Number
    }
});

// save 하기 전 로직. next()를 만나면 종료
userSchema.pre('save', function(next){
    var user = this; // this:userSchema

    if(user.isModified('password')) {
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash; // 해시된 비밀번호 생성 성공 시 hash 비번으로 교체
                next();
            })
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(requrestPassword, originPassword, cb) {
    bcrypt.compare(requrestPassword, originPassword, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    //jsonwebtoken을 이용하여 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    });
}


const User = mongoose.model('User', userSchema);

module.exports = {User};



/*
사용자 전체 조회


router.get('/users', (req, res) => {
    UserService.readAll(req, res);
});

    readAll: function(req, res) {
        User.find({}, (err, users) => {
            if(err) return res.json({ success: false, err })
            return res.json({ users : users })
        })
    },


*/