const mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);
app.use(bodyParser.json());

var methodOverride = require('method-override')
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }));



//mysql details
var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: '',
    database: 'learners',
    multipleStatements: true
});

mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Connection Established Successfully');
    else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));



var mesage = "Welcome to student info";

//Creating GET Router to fetch all the learner details from the MySQL Database
app.get('/' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails', (err, rows, fields) => {
    if (!err){
    res.render("index",{data:rows, message:mesage })}
    else{
    console.log(err);}
    })
    });

//Router to GET specific learner detail from the MySQL database
app.get('/learners/:id' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails WHERE learner_id = ?',[req.params.id], (err, results, fields) => {
    if (!err){
    res.render("index",{data:results, message:"Welcome to student info"})}
    else{
    console.log(err);}
    })
    });


// add or insert opertaion
app.post('/_insert',urlencodedParser, (req, res) => {
    let learner = req.body;
    console.log(learner);
    var sql = "INSERT INTO learnerdetails (learner_name,learner_email,course_Id) values (?,?,?)";
    mysqlConnection.query(sql, [learner.learner_name, learner.learner_email, learner.course_Id], (err, rows, fields) => {
        if (!err){
            mesage = 'New Learner Details added Successfully';
            console.log(rows,rows.affectedRows);
            console.log(mesage);
            res.redirect('/');
        }else{
        console.log(err);}
    });
});


/// Update operation
app.put('/update',(req,res)=>{
    let learner = req.body;
    console.log(learner);
    var sql = "UPDATE learnerdetails SET learner_name = ? , learner_email = ? , course_Id = ? WHERE learner_id = ? ";
    mysqlConnection.query(sql,[learner.learner_name,learner.learner_email,learner.course_Id,learner.learner_id],(err,rows,fields) => {
        if(!err){
            mesage = "Learners record updated successfully..";
            console.log(rows);
            console.log(mesage);
             res.redirect('/');}
        else{
        console.log(err);}
    });
});

// delete data using id
app.delete('/learners/:id', (req, res) => {
    mysqlConnection.query("DELETE FROM learnerdetails WHERE learner_id = ?",[req.params.id] , (err, rows, fields) =>{
        if(!err){
            mesage = "Learners record deleted successfully..";
            console.log(mesage);
            res.redirect('/');}
        else{
        console.log(err);}
    });
});
