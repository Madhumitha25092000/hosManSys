var express = require('express');
var cors = require('cors');
var nodemailer = require('nodemailer')
const { createConnection } = require('mysql');
var app = express();
var {MongoClient} = require('mongodb');
const { async } = require('rxjs');
var doctorController = require('./controllers/doctorController.js');
app.use(cors());
app.use(express.json());
app.listen(3000, () => console.log('server is running'))

let uri = 'mongodb+srv://Madhu:Madhu%4025@cluster0.agxhj80.mongodb.net/test';
let db;
///let uri = 'mongodb://localhost:27017'
//MongoClient.createConnection(uri,() => {

    // db.collection('admin')

(async function () {
   db =  await connectToCluster(uri)
} )();


 //})
var con = createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospitalrecord'
})

con.connect((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('mysql connected')
    }
})
// app.use('/doctor',doc)
app.post('/signup',async  (req, res) => {
    console.log(req.body);

    db.collection('user').insertOne(req.body)

    let insertQuery = 'INSERT INTO patient (p_name,address,phn_no,age,gender,email,pswd) values (?,?,?,?,?,?,?)';

    con.query(insertQuery, [req.body.uname, req.body.address, req.body
        .phonenumber, req.body.age, req.body.gender, req.body.email, req.body.pswd], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(422).json(    {message:'Something went wrong'});
            }

            console.log(result);
            return res.status(200).send('Inserted Successfullyy');

        })
})


async function connectToCluster(uri) {
    let mongoClient;
 
    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
 
         return   mongoClient.db('test');
         
        // const collection = db.collection('admin');
        // const insertQuery = collection.insertOne({'username':'admin','pswd':'admin@123'});
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
 }

app.get('/department', async (_req, res) => {
    // let db = await connectToCluster(uri);
    try{
      let dept = await db.collection('department').find({}).toArray();
      console.log(dept);

      if (dept) {
        return res.status(200).json(
            {
                success: true,
                data: dept

              
            }
        );
    } else {
        return res.status(422).json({
            success: false,
           
        })
    }

    }catch (err){
        console.log(err);
        return res.status(422).json(
            {
                success: false,
                //message: 'login failed'
            }
        )
    }finally {
         //db.close()
    }
})

app.post('/doctorlogin', async (req, res) => {
    try{
      let user = await db.collection('doctor').findOne({$and:[{'username':req.body.uname},{'pswd':req.body.pname}]})
      console.log(user);

      if (user) {
        return res.status(200).json(
            {
                success: true,
                message: 'login successfully'
            }
        );
    } else {
        return res.status(422).json({
            success: false,
            message: 'Invalid EmailId or Password'
        })
    }

    }catch (err){
        console.log(err);
        return res.status(422).json(
            {
                success: false,
                message: 'login failed'
            }
        )
    }finally {
        // db.close()
    }
})

app.post('/patientlogin', async (req, res) => {
    try{
      let user = await db.collection('patient').findOne({$and:[{'username':req.body.uname},{'pswd':req.body.pname}]})
      console.log(user);

      if (user) {
        return res.status(200).json(
            {
                success: true,
                message: 'login successfully'
            }
        );
    } else {
        return res.status(422).json({
            success: false,
            message: 'Invalid EmailId or Password'
        })
    }

    }catch (err){
        console.log(err);
        return res.status(422).json(
            {
                success: false,
                message: 'login failed'
            }
        )
    }finally {
        // db.close()
    }
})
app.post('/supportingstafflogin', async (req, res) => {
    try{
      let user = await db.collection('suppstaff').findOne({$and:[{'username':req.body.uname},{'pswd':req.body.pname},{'type':req.body.type}]})
      console.log(user);

      if (user) {
        return res.status(200).json(
            {
                success: true,
                message: 'login successfully'
            }
        );
    } else {
        return res.status(422).json({
            success: false,
            message: 'Invalid EmailId or Password'
        })
    }

    }catch (err){
        console.log(err);
        return res.status(422).json(
            {
                success: false,
                message: 'login failed'
            }
        )
    }finally {
        // db.close()
    }
})

app.post('/adminlogin', async (req, res) => {
    
    try{
      let user = await db.collection('admin').findOne({$and:[{'username':req.body.uname},{'pswd':req.body.pname}]})
      console.log(user);

      if (user) {
        return res.status(200).json(
            {
                success: true,
                message: 'login successfully'
            }
        );
    } else {
        return res.status(422).json({
            success: false,
            message: 'Invalid EmailId or Password'
        })
    }

    }catch (err){
        console.log(err);
        return res.status(422).json(
            {
                success: false,
                message: 'login failed'
            }
        )
    }finally {
        // db.close()
    }

})


app.post('/addDepartment',async (req, res) => {
    
    try {

        let dep = await db.collection('department').insertOne({dname:req.body.deptname,location:req.body.deptlocation})
    
        if (dep) {
            // sendmail(req.body.docemail,req.body.docpswd,'doctor-dashboard');
    
            return res.status(200).json(
                {
                    success: true,
                    message: 'added successfully'
                }
            );
        } else {
            return res.status(422).json({
                success: false,
                message: 'unable to add'
            })
        }
    
        }catch (err){
            console.log(err);
            return res.status(422).json(
                {
                    success: false,
                    message: 'failed to add dept'
                }
            )
        }
       
    })
    app.post('/appointment',async (req, res) => {
        try {
            const appointment=await req.body;
            db.collection("appointment").insertOne({appointment})
            res.status(200).json({message:"success"})
        }catch(err){
            res.status(200).json({message:"failed"})
        }
        })
    

app.post('/addSupportingstaff',async (req,res) => {
    try {

        let supp = await db.collection('suppstaff').insertOne({sname:req.body.suppname,username:req.body.suppemail,pswd:req.body.supppswd,type:req.body.supptype,sgender:req.body.suppgender})
    
        if (supp) {
             sendmail(req.body.suppemail,req.body.supppswd,'supportingstaffdashboard');
    
            return res.status(200).json(
                {
                    success: true,
                    message: 'added successfully'
                }
            );
        } else {
            return res.status(422).json({
                success: false,
                message: 'unable to add'
            })
        }
    
        }catch (err){
            console.log(err);
            return res.status(422).json(
                {
                    success: false,
                    message: 'failed to add supporting staff'
                }
            )
        }
       
    })
    
    

app.post('/addDoctor',async(req,res) => {
    try {

    let doc = await db.collection('doctor').insertOne({docname:req.body.docname,dept:req.body.docdept,username:req.body.docemail,pswd:req.body.docpswd,phnnum:req.body.phnnum})

    if (doc) {
        sendmail(req.body.docemail,req.body.docpswd,'doctor-dashboard');

        return res.status(200).json(
            {
                success: true,
                message: 'added successfully'
            }
        );
    } else {
        return res.status(422).json({
            success: false,
            message: 'unable to add'
        })
    }

    }catch (err){
        console.log(err);
        return res.status(422).json(
            {
                success: false,
                message: 'failed to add doctor'
            }
        )
    }
   
})

app.post('/addPatient',async (req,res) => {
    try {

        let pat = await db.collection('patient').insertOne({patname:req.body.patname,address:req.body.address,username:req.body.patemail,pswd:req.body.patpswd,age:req.body.age,phnnum:req.body.phnnum,gender:req.body.suppgender})
    
        if (pat) {
            sendmail(req.body.patemail,req.body.patpswd,'patient-dashboard');
    
            return res.status(200).json(
                {
                    success: true,
                    message: 'added successfully'
                }
            );
        } else {
            return res.status(422).json({
                success: false,
                message: 'unable to add'
            })
        }
    
        }catch (err){
            console.log(err);
            return res.status(422).json(
                {
                    success: false,
                    message: 'failed to add doctor'
                }
            )
        }
       
    })


app.get('/doctor', async (req, res) => {
    try { 
        let doctorArr = await db.collection('doctor').find({}).toArray();
    
        if (doctorArr) {
            return res.status(200).json(
                {
                    success: true,
                    data: doctorArr,
    
                  
                }
            );
        } else {
            return res.status(422).json({
                success: false,
               
            })
        }
    
        }catch (err){
            console.log(err);
            return res.status(422).json(
                {
                    success: false,
                    //message: 'login failed'
                }
            )
        }finally {
             //db.close()
        }
    })   
    
    

app.get('/doctorById', async (req, res) => {
try {
  let doctorDetails = await  db.collection('doctor').aggregate([
        { $lookup:
           {
             from: 'department',
             localField: 'dept',
             foreignField: 'dname',
             as: 'deptDetails'
           }
         }
        ]).toArray()

        
        if (doctorDetails) {
            return res.status(200).json(
                {
                    success: true,
                    data: doctorDetails,

    
                  
                }
            );
        } else {
            return res.status(422).json({
                success: false,
               message:'unable to load doctor details'
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(422).json(
            {
                success: false,
                message:'unable to load doctor details'
                //message: 'login failed'
            }
        )
    }
})

app.get('/patient', async (req, res) => {
    // let selectQuery = '';
    try { 
    let patientArr = await db.collection('patient').find({}).toArray();

    if (patientArr) {
        return res.status(200).json(
            {
                success: true,
                data: patientArr,

              
            }
        );
    } else {
        return res.status(422).json({
            success: false,
           
        })
    }

    }catch (err){
        console.log(err);
        return res.status(422).json(
            {
                success: false,
                //message: 'login failed'
            }
        )
    }finally {
         //db.close()
    }
})   


app.get('/patientById', async (req, res) => {
    try { 
        let patArr = await db.collection('patient').find({}).toArray();
    
        if (doctorArr) {
            return res.status(200).json(
                {
                    success: true,
                    data: doctorArr,
    
                  
                }
            );
        } else {
            return res.status(422).json({
                success: false,
               
            })
        }
    
        }catch (err){
            console.log(err);
            return res.status(422).json(
                {
                    success: false,
                    //message: 'login failed'
                }
            )
        }finally {
             //db.close()
        }
    })   
//     let selectQuery = 'SELECT * from patient where patient_id = ?';
//     con.query(selectQuery, [req.query.id],(err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(422).json({message:'Something went wrong'});
//         }

//         console.log(result);
//         return res.status(200).json(result);
//     })
// })


function sendmail(email,password,path) {

    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "35d8a70abecfe4",
            pass: "b9ed2f31e103c2"
        }
    });

    message = {

        from: "from-example@email.com",
        to: email,
        subject: "Reset Password",
        text: "",
        html: '<html><body><br><br><p><h1> Your Login Credentials <h1><br> <p> Email :'+email 
        +'</p><br><p>Password:'+password 
        +' </p> <br> <a href="http://localhost:4200/'+path+'"> click here to login </a> </p> </body> </html>'
    }

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    })
}


app.post('/generateBill', async (req, res) => {

    try {

        let pat = await db.collection('bill').insertOne({username:req.body.patientName,amount:req.body.amount})
    
        if (pat) {
            
    
            return res.status(200).json(
                {
                    success: true,
                    message: 'added successfully'
                }
            );
        } else {
            return res.status(422).json({
                success: false,
                message: 'unable to add'
            })
        }
    
        }catch (err){
            console.log(err);
            return res.status(422).json(
                {
                    success: false,
                    message: 'failed to add bill'
                }
            )
        }
       
    })
  
    // let insertQuery = 'INSERT INTO bill (patient_id,amount) VALUES (?,?)';

    // con.query(insertQuery,[req.body.patientName,req.body.amount] ,(err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(422).json({message:'Something went wrong'});
    //     }

    //     console.log(result);
    //     return res.status(200).json({message:'Bill Generated Successfully'});
    // })


app.get('/getBills', async (req, res) => {

    try{
        let bills = await  db.collection('patient').aggregate([
            { $lookup:
               {
                 from: 'bill',
                 localField: '_id',
                 foreignField: 'username',
                 as: 'bills'
               }
             }
            ]).toArray()
        //let bills = await db.collection('bill').find({}).toArray();
        console.log(bills);
  
        if (bills) {
          return res.status(200).json(
              {
                  success: true,
                  data: bills
  
                
              }
          );
      } else {
          return res.status(422).json({
              success: false,
             
          })
      }
  
      }catch (err){
          console.log(err);
          return res.status(422).json(
              {
                  success: false,
                  //message: 'login failed'
              }
          )
      }finally {
           //db.close()
      }
  })
    // let selectQuery = 'SELECT pat.p_name,b.bill_no,b.amount,b.status from bill b left join patient pat on  b.patient_id = pat.patient_id';
    
    // con.query(selectQuery, (err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(422).json({message:'Something went wrong'});
    //     }

    //     console.log(result);
    //     return res.status(200).json(result);
    // })
// })

app.get('/getBillById', async (req, res) => {

    let selectQuery = 'SELECT pat.p_name,b.bill_no,b.amount,b.status from bill b left join patient pat on  b.patient_id = pat.patient_id where pat.patient_id = ?';
    
    con.query(selectQuery, [req.query.id],(err, result) => {
        if (err) {
            console.error(err);
            return res.status(422).json({message:'Something went wrong'});
        }

        console.log(result);
        return res.status(200).json(result);
    })
})

app.post('/updateBillStatus', (req, res) => {
   
    let insertQuery = 'Update bill set status = ? where bill_no = ?';

    con.query(insertQuery,[req.body.status,req.body.billNo] ,(err, result) => {
        if (err) {
            console.error(err);
            return res.status(422).json({message:'Something went wrong'});
        }

        console.log(result);
        return res.status(200).json({message:'Bill Updated Successfully'});
    })
})


app.get('/getSummaryById', async (req, res) => {
    
    let selectQuery = 'SELECT pat.p_name,s.summary,pat.patient_id from inpatient s inner join patient pat on s.patient_id = pat.patient_id where pat.patient_id = ?';
    
    con.query(selectQuery, [req.query.id],(err, result) => {
        if (err) {
            console.error(err);
            return res.status(422).json({message:'Something went wrong'});
        }

        console.log(result);
        return res.status(200).json(result);
    })
})


app.post('/updateSummary', async (req, res) => {
    try {

        let summ = await db.collection('patient').insertOne({patname:req.body.patname,summary:req.body.summary})
    
        if (summ) {
            console.log(result);
            return res.status(200).json({message:'Summary Updated Successfully'});
            }
            else {
                return res.status(422).json({
                    success: false,
                    message: 'unable to add'
                })
            }
        
            }catch (err){
                console.log(err);
                return res.status(422).json(
                    {
                        success: false,
                        message: 'failed to update summary'
                    }
                )
            }
           
        })
    
            
    

app.post('/updateSalary', async (req, res) => {
    try {
        let  saldet= await  db.collection('doctor').aggregate([
            { $lookup:
               {
                 from: 'salary',
                 localField: 'dname',
                 foreignField: 'docname',
                 as: 'saldet'
               }
             }
            ]).toArray()
    
            
            if (saldet) {
                return res.status(200).json({message: saldet});
            } else {
                return res.status(422).json({message:"error"})
            }
        } catch (err) {
            console.log(err);
            return res.status(422).json(
                {
                    success: false,
                    message:'unable to load doctor details'
                    //message: 'login failed'
                }
            )
        }
    })
   
    // let insertQuery = 'INSERT INTO salary (doctor_id,salary,creditDate) VALUES (?,?,?)';

    // con.query(insertQuery,[req.body.docId,req.body.amount,req.body.creditDate] ,(err, result) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(422).json({message:'Something went wrong'});
    //     }

    //     console.log(result);
    //     return res.status(200).json({message:'Salary Updated Successfully'});
    // })
// })


app.get('/getDocSalary', (req, res) => {

    let selectQuery = 'SELECT d.doctor_id,d.dname,s.salary,s.creditDate from doctor d inner join salary s on s.doctor_id = d.doctor_id where d.doctor_id = ?';
    
    con.query(selectQuery, [req.query.id],(err, result) => {
        if (err) {
            console.error(err);
            return res.status(422).json({message:'Something went wrong'});
        }

        console.log(result);
        return res.status(200).json(result);
    })
})





