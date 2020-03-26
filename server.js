var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/cs5610';
mongoose.connect(connectionString);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: 'secret string' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());// donot ask everytime for details, check in session for username passsowrd

app.use(express.static(__dirname + '/public'));
//****For NodeJs experiments*******************************************
var developers = [
    { firstName: "Christian", lastName: "Bale" },
    { firstName: "Tom", lastName: "Hardy" },
    { firstName: "Heath", lastName: "Ledger" }
];
app.post("/api/developer", function (req, res) {
    var obj = req.body;
    developers.push(obj);
    res.json(developers);
});
app.delete("/api/developer/:id", function (req, res) {
    var index = req.params.id;
    developers.splice(index, 1);
    res.json(developers);
});

app.get("/api/developer", function (req, res) {
    res.json(developers);
});
app.get("/api/developer/:index", function (req, res) {
    var idx = req.params['index'];
    res.json(developers[idx]);
});
app.put("/api/developer/:index", function (req, res) {
    var obj = req.body;
    developers[req.params.index] = obj;
    res.json(developers);
});
/******************************end of NodeJs experiment*********************/

//************** Schema for courses involving Mongo db*****************************************
var projectSchema = new mongoose.Schema({
    name: String,
    created:{type:Date , default:Date.now}
});

var CourseSchema = new mongoose.Schema({
    courseName: String,
    branch : String,
    created: { type: Date, default: Date.now },
    project: [projectSchema]
}, { collection: "course" });

var Course = mongoose.model("Course", CourseSchema);
/*
Form.findById("54f8c23bc7 c19bf079a3075e", function (err, data) {
    console.log(data);
});*/

/************express********/
app.get('/api/course', function (req, res) {
    Course.find(function (err, data) {
       res.json(data);
    });
});
app.get('/api/course:id', function (req, res) {
    Course.findById(req.params.id, function (err, data) {
        res.json(data);
      });
});
app.delete('/api/course:id', function (req, res) {
    Course.remove({ _id: req.params.id }, function (err, count) {
        Course.find(function (err, data) {
            res.json(data);
        });
    });
});
app.post('/api/course', function (req, res) {
    var obj = req.body;
    Course.create(obj, function (err, data) {
        Course.find(function (err, data) {
            res.json(data);
        });
    });
});

app.put('/api/course/:index', function (req, res) {
    Course.update({ _id: req.params.index }, {
        $set: {
            courseName: req.body.courseName,
            branch: req.body.branch,
            project: req.body.project
        }
    },
    function (err, doc) {
        console.log(req.body);
        Course.find(function (err, data) {
            res.json(data);
        });
       });
});

app.get('/api/course/:index/page', function (req, res) {
    Course.findById(req.params.index, function (err, data) {
        res.json(data.project);
    });
});
app.delete('/api/course/:id/page/:pageId', function (req, res) {
    Course.remove({ _id: req.params.id }, function (err, count) {
        Course.find(function (err, data) {
            res.json(data);
        });
    });
});
//************** Schema for courses involving Mongo db ends*****************************************

/********************** For user schema***************/


var UserSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String
}, { collection: "user" });

var User = mongoose.model("User", UserSchema);



/************express********/
app.get('/api/user', function (req, res) {
    User.find(function (err, data) {
        res.json(data);
    });
});

app.delete('/api/user:id', function (req, res) {
    User.remove({ _id: req.params.id }, function (err, count) {
        User.find(function (err, data) {
            res.json(data);
        });
    });
});
app.post('/api/user', function (req, res) {
    var obj = req.body;
    User.findOne(obj, function (err, data) {
        res.json(data);
    });
});
app.post('/api/user/add', function (req, res) {
    var obj = req.body;
    User.create(obj, function (err, data) {
        console.log("inserted");
    });
});

/*app.get('/api/profile:username', function (req, res) {
    var username = req.params.username;
    console.log("in server in profile controller");
    res.json(login(username, username));

})*/
/********************** end of user scheme******************/
/*  start of project based experiments*/
var SchdeuleSchema = new mongoose.Schema({
    schdeulename: String,
    startdate: Date,  //{ type: Date, default: Date.now }
    userid:Number},
     { collection: "schdeule" });
var SchdeuleModel = mongoose.model("SchdeuleModel", SchdeuleSchema);

var CommentSchema = new mongoose.Schema({
    userid: String,
    commentdesc: String,
    creationdate: { type: Date, default: Date.now },
    reply:[CommentSchema]
},
    { collection: "comment" });

var CommentUserSchema = new mongoose.Schema({
    commentid: String,
    commentdesc: String,
    creationdate: { type: Date, default: Date.now },
    exercisename :String
},
    { collection: "usercomment" });

var ExerciseSchema = new mongoose.Schema({
    exerciseid: Number,
    comment: [CommentSchema]},
    {collection : "exercise"});
var ExerciseModel = mongoose.model("ExerciseModel", ExerciseSchema);

var WorkoutSchema = new mongoose.Schema({
    creationdate: { type: Date, default: Date.now },
    description: String,
    userid: String,
    publish: Boolean,
    comment: [CommentSchema],
    followers: Number,
    followed: Boolean,
    followersid :[String]
},
    { collection: "workout" });
var WorkoutModel = mongoose.model("WorkoutModel", WorkoutSchema);
//var obj = new WorkoutModel({ description: "Sample workout", userid: "123" });
//obj.save();

var ExerciseRepModel = new mongoose.Schema({
    exercisename: String,
    reps: Number,
    sets: Number
},
    { collection: "exercise" });

var DaySchema = new mongoose.Schema({
    workoutid: String,
    description: String,
    days: Number,
    exercises:[ExerciseRepModel],
    order :Number},

    {collection: "day" })
var DayModel = mongoose.model("DayModel", DaySchema);
//var obj = new DayModel({ description: "Sample workout", days: [1] });
//obj.save();

var SchdeuleStep = new mongoose.Schema({
    schdeuleid:Number,
    workoutid: Number},
 { collection: "schdeulestep" });

var UserProfileSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: String,
    firstname: String,
    lastname: String,
    pic: String,
    comment: [CommentUserSchema]
    
}, { collection: "usermodel" });

var UserModel = mongoose.model("UserModel", UserProfileSchema);
//UserProfileSchema.createIndex({ username: 1 }, { unique: true, sparse: true });
/*    username: 'john', password: 'john1', role: ['student', 'admin']
});
alice.save();*/
var obj = new UserModel({ username: 'a', password: 'a' });
//obj.save();
passport.use(new LocalStrategy(
    function (username, password, done) {
         UserModel.findOne({ username: username, password: password }, function (err,user) {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        });
        
    }));
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.post("/api/login", passport.authenticate('local'),
    function (req, res) { // once user is authenticated by passport it puts the user object in req 
        var user = req.user;
        res.json(user);
    });
app.post("/api/signup/", function (req, res) {
    var user = req.body;
    console.log(user);
    UserModel.create({
        username: user.username, password: user.password, role: "Member", pic: user.pic, firstname: user.firstname,
        lastname:user.lastname
    }, function (err, data) {
        res.json(data);
    });
    });
app.post("/api/logout", function (req, res) {
    req.logout(); res.send(200);
});
app.get("/api/loggedin", function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});
app.get("/api/workoutid/:id", function (req, res) {
    var workoutid = req.params.id;
    WorkoutModel.find({ _id: workoutid }, function (err, data) {
        res.json(data);
    });
})
app.get("/api/ownworkout/:id", function (req, res) {
    var userid = req.params.id;
    WorkoutModel.find({ userid: userid } , function (err, data) {
        res.json(data);
    });
});
app.get("/api/followingworkout/:id", function (req, res) { // id is userid
    var userid = req.params.id;
    WorkoutModel.find( { followersid: { $in: [userid] } }, function (err, data) {
        res.json(data);
    });
});
app.get("/api/famousworkout_excludingcurrentuser/:id", function (req, res) { //
    var userid = req.params.id;
    WorkoutModel.find({ userid: { $nin: [userid] }, publish: true, followersid:{$nin: [userid]}}, function (err, data) {
        res.json(data);
    });
});
app.get("/api/famousworkout_userspecific/:id", function (req, res) { //
    var userid = req.params.id;
    WorkoutModel.find({ userid: userid, publish: true }, function (err, data) {
        res.json(data);
    });
});
app.get("/api/famousworkout_notuserspecific/", function (req, res) {
    //var userid = req.params.id;
    WorkoutModel.find({ publish: true }, function (err, data) {
        res.json(data);
    });
})
app.post("/api/workout/:id", function (req, res) { // here id is user id for which i want to store this workout
    var desc = req.body.description;
    var userid1 = req.params.id;
    WorkoutModel.create({ description: desc, userid: userid1,publish:false, followers :0,followersid:[] }, function (err, data) {
        console.log("workout inserted");
        WorkoutModel.find({ userid: userid1 }, function (err, data) {
            res.json(data);
        });
    });
});

app.put("/api/workout/:id", function (req, res) { // id is workout id for which i have to edit
    var workoutid = req.params.id;
    var userid = req.body.userid;
    console.log("publish true");
    WorkoutModel.update({ _id: workoutid }, {
        $set: { publish: true }
       }, function (err, doc) {
            WorkoutModel.find({ userid: userid }, function (err, data) {
                res.json(data);
            });
        });
    });
app.put("/api/workoutupdate/:id", function (req, res) { // once users follows then add userid to followersid
    var workoutid = req.params.id;
    var followersid = req.body.followersid;
    var userid = req.body.userId;
    var followers = req.body.followers;
    WorkoutModel.update({ _id: workoutid }, {
        $set: { followersid: followersid, followers: followers }
    }, function (err, doc) {
        // returning all user specific following workouts and  famous  workouts will be called separately
        WorkoutModel.find( { followersid: { $in: [userid] } }, function (err, data) {
            res.json(data);
        });
    });
});
app.put("/api/editworkout/:id", function (req, res) { // EDIT workout name
    var workoutid = req.params.id;
   WorkoutModel.update({ _id: workoutid }, {
        $set: { description : req.body.description }
   }, function (err, doc) {
       res.json(doc);
      });
});
app.put("/api/removeexercisefromday/:dayid", function (req, res) {
    var dayid=req.params.dayid;
    DayModel.update({ _id: dayid },
        { $set: { exercises: req.body } }, function (err, doc) {

        });
});
app.delete("/api/workout/:id", function (req, res) {
    var workoutid = req.params.id;
    WorkoutModel.remove({ _id: workoutid }, function (err, data) {
        res.json(data);
        });
});
app.delete("/api/removeworkoutday/:dayid", function (req, res) {
    var dayid = req.params.dayid;
    DayModel.remove({ _id: dayid }, function (err, data) {
        res.json(data);
    });
});

app.post("/api/newworkout/", function (req, res) {
    var workout = req.body;
    WorkoutModel.create(workout, function (err, data) {
        res.json(data);
    });
});
app.post("/api/workoutFollowers/", function (req, res) {
    WorkoutModel.update({ _id: req.body.workoutid },
        {
            $set: { followers: req.body.followers }
        },
    function (err, doc) {
        WorkoutModel.find({ _id: req.body.workoutid }, function (err, data) {
            //console.log(data);
            res.json(data);
        });
    });
});
app.get("/api/workoutdetail/:id", function (req, res) {
    var id = req.params.id;
    WorkoutModel.findOne({ _id: id }, function (err, data) {
        res.json(data);
    });
});

app.get("/api/days/:id", function (req, res) {
    var id = req.params.id;
    DayModel.find({ workoutid: id }, function (err, data) {
        res.json(data);
    });
});

app.post("/api/days/", function (req, res) {
    var day = req.body;
    var workoutid = day.workoutid;
    DayModel.create(day, function (err, data) {
        DayModel.find({ workoutid: workoutid }, function (err, data) {
            res.json(data);
        });
    });
});
app.post("/api/daysArray/:id", function (req, res) {
    var dayid = req.params.id;
    DayModel.update(days, function (err, data) {
          res.json(data);
       
    });
});
app.post("/api/adddays/:id", function (req, res) {
   // var days = req.body;
    var dayid = req.params.id;
    console.log(dayid);
    console.log(req.body)
    DayModel.update({ _id: dayid },
        {
            $set: { exercises: req.body }
        },
    function (err, doc) {
        DayModel.find({ _id: dayid }, function (err, data) {
            res.json(data);
        });
    });
});
app.get("/api/users/", function (req, res) {
    UserModel.find(function (err, data) {
        res.json(data);
    });
});
app.get("/api/user/:userid", function (req, res) {
    UserModel.find({ _id: req.params.userid }, function (err, data) {
        res.json(data);
    });
});
app.post("/api/exercisecomment/:exerciseid", function (req, res) { // save the comments for an exercise
    var exerciseid = req.params.exerciseid;
    var exercise = req.body;
   // console.log(exercise);
    ExerciseModel.findOneAndUpdate(
                 { exerciseid: exercise.exerciseid },
                 { $set: { comment: exercise.comment } },
                 { safe: true, upsert: true }, function (err, doc) {
                     res.json(doc);
                 }
    )
});
app.post("/api/usercomment/:userid", function (req, res) { // save the comments for an exercise
    var userid = req.params.userid;
    var usercomment = req.body;
   // console.log(usercomment);
    UserModel.findOneAndUpdate(
                 { _id: userid },
                 { $set: { comment: usercomment} },
                 { safe: true, upsert: true }, function (err, doc) {
                     res.json(doc);
                 }
    )
});

app.get("/api/exercisecomment/:exerciseid", function (req, res) {   // get all comments on an exercise
    ExerciseModel.find({ exerciseid: req.params.exerciseid }, function (err, data) {
       // console.log(data);
        res.json(data);
    });
});
/*  end of project based experiments*/

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ip);


