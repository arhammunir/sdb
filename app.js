var express= require("express");
var app = express();
var port= process.env.PORT || 3000;
var bodyParser= require("body-parser");
var path = require("path");
var hbs = require("hbs");
var {owner, teacher, student}= require("./data.js");
var multer= require("multer");

var page_path= path.join(__dirname+"/public/views");
var partials_path= path.join(__dirname+"/public/partials");

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended:false}));


app.use(express.static(__dirname+"/public/"));
app.set("view engine", "hbs");
app.set("views", page_path);
hbs.registerPartials(partials_path);

app.get("/",(req, res)=>{
	try{
		var find= async function(){
		var data_find = await student.find().sort({_id: -1});
		var data = data_find;
		res.render("index", {data: data, status: "student"});
	};
	find();
	}
	catch{
		(e)=>{
			console.log(e)
		}
	}
});


app.get("/add/:v", (req, res)=>{
	if(req.params.v==="student"){
		res.render("student")
	}
	else if(req.params.v==="teacher"){
		res.render("teacher")
	}
})

app.post("/add-student", (req, res)=>{
	var data_insert;
	var data;
	var insert_student_data= async function(){
		try{
			data_insert= new student({
			_id: req.body.roll,
			name: req.body.name,
			f_name: req.body.fname,
			class: req.body.class,
			gender: req.body.gender,
			phone_no: req.body.phone,
			email: req.body.email,
			address: req.body.address,
			fees: req.body.fees,
			badge: req.body.badge
			});
			data = await data_insert.save();
			//
		}
		catch{
			(e)=>{console.log("STUDENT DATABASE ERROR IS "+ e) }
		}
	};
	insert_student_data();
	res.render("img-student", {id: data_insert._id})
});


app.post("/add-teacher", (req, res)=>{
	console.log(req.body);
	var data_teacher;
	var data_insert_teacher;
	var teacher_insert_data= async function(){
		data_insert_teacher= new teacher({
			_id: req.body.id,
			name: req.body.name,
			f_name: req.body.fname,
			gender: req.body.gender,
			sub:req.body.sub,
			phone_no: req.body.phone,
			email: req.body.email,
			address: req.body.address,
			salary: req.body.salary,
			qualification: req.body.qualification
		});
		data_teacher=await data_insert_teacher.save();
		
	};
	teacher_insert_data();
	res.render("img-teacher", {id: data_insert_teacher._id})
});



app.get("/find/:i", (req, res)=>{
	try{
		console.log(req.params.i)
		var find= async function(){
		if(req.params.i==="student"){
		var data_find = await student.find().sort({_id: -1});
		var data = data_find;
		res.render("index", {data: data, status: "student"});
		}
		else if(req.params.i==="teacher"){	
		var data_find = await teacher.find().sort({_id: -1});
		var data = data_find;
		res.render("find-teacher", {data: data, status: "teacher"});
		}
		else{
			res.send("COULDN'T GET DATA");
		}
	};
	find();
	}
	catch{
		(e)=>{console.log(e)}
	}
	
});


app.get("/find/:v/id/:id", (req, res)=>{

	var detail= async function(){
		var v= req.params.v;
		var id= req.params.id;
		if(v==="teacher"){
		data =await  teacher.findOne({_id: id});
		console.log(data);
		res.render("teacher-detail", {data: data});

		}
		else if(v==="student"){
		data =await  student.findOne({_id: id});
		console.log(data);
		res.render("detail", {data: data});
		}
	};
	detail();
	
})



var Storage1= multer.diskStorage({
	destination: function(req, file, cb){cb(null, "./public/img/student")},
	filename: (req, file, cb)=>{cb(null, req.params.id+path.extname(file.originalname));}
	
})
var upload1 = multer({
	storage: Storage1
}).single("file");


app.post("/img/student/id/:id",upload1, (req, res)=>{
	console.log(req.params.id)
	console.log(req.file)
	var add = async function(){
		var e = req.file.originalname.split(".");
		var ext =e[1];
		var img= req.params.id+"."+ext
		var data = await student.findByIdAndUpdate(
			{_id: req.params.id},
			{$set:{img: img}},
			{new: true, useFindAndModify: false}
			)
	};
	add();
	res.redirect("/");
});



var Storage2= multer.diskStorage({
	destination: function(req, file, cb){cb(null, "./public/img/teacher/")},
	filename: (req, file, cb)=>{cb(null, req.params.id+path.extname(file.originalname));}
	
})
var upload2 = multer({
	storage: Storage2
}).single("file");



app.post("/img/teacher/id/:id",upload2, (req, res)=>{
	console.log(req.params.id)
	console.log(req.file)
	var add = async function(){
		var e = req.file.originalname.split(".");
		var ext =e[1];
		var img= req.params.id+"."+ext
		var data = await teacher.findByIdAndUpdate(
			{_id: req.params.id},
			{$set:{img: img}},
			{new: true, useFindAndModify: false}
			)
	};
	add();
	res.redirect("/");
})

app.get("/search", (req, res)=>{
	console.log(req.query);
	if(req.query.status==="student"){

	if(req.query.choose==="name"){
	var f_n_s= async function(){
		var data= await student.find({name:{$regex: req.query.find}})
		res.render("index", {data: data, status: "student"})
	};
	f_n_s();
	}

	else if(req.query.choose==="roll"){
		var f_r_s= async function(){
		var data= await student.find({_id: req.query.find})
		res.render("index", {data: data, status: "student"})
	};
	f_r_s();
	}
	else{
		res.send("NO DATA FOUND");
	}
	}


	else if(req.query.status==="teacher"){

	if(req.query.choose==="name"){
	var f_n_t= async function(){
		var data= await teacher.find({name:{$regex: req.query.find}})
		res.render("index", {data: data, status: "student"})
	};
	f_n_t();
	}

	else if(req.query.choose==="roll"){
		var f_r_t= async function(){
		var data= await teacher.find({_id: req.query.find})
		res.render("index", {data: data, status: "teacher"})
	};
	f_r_t();
	}
	else{
		res.send("NO DATA FOUND");
	}
	}
	
});


app.get("/fees/:s/:id", (req, res)=>{
	var f_m= async function(){
		if(req.params.s==="student"){
			let data_s= await student.findOne({_id: req.params.id})
			res.render("fees", {data: data_s});
		}
		else if (req.params.s==="teacher"){

			let data_t= await teacher.findOne({_id: req.params.id});
			res.render("fees", {data: data_t});
		}
		else{
			console.log("ERROR")
		}
	};
	f_m();
})

app.post("/pay/:s/:id", (req, res)=>{
	var pay= async function(){
		try{
			if(req.params.s==="student"){
			let m= req.body.month;
			try{	
			let data_s= await student.findOne({_id: req.params.id});
			console.log("YEAR IS "+data_s.years)
			let push = data_s.years.concat(m)
			let data_s2 = await student.findOneAndUpdate({_id: req.params.id}, {years: push}, {new: true});
			}catch(err){console.log(err)};
		}
		else if (req.params.s==="teacher") {
			let m= req.body.month;
			try{	
			let data_t = await teacher.findOne({_id: req.params.id});
			console.log("YEAR IS "+data_t.years)
			let push = data_t.years.concat(m)
			let data_t2 = await teacher.findOneAndUpdate({_id: req.params.id}, {years: push}, {new: true});			}catch(err){console.log(err)};
			console.log(data_t2)
		}
		else{
			console.log("ERROR")
		}
		}catch(err){
			console.log(err)
			res.render("error", {data: err})
		}
	};
	pay();
	
	res.redirect(`/find/${req.params.s}/id/${req.params.id}`);
});

app.get("/find/fees/unpaid", (req, res)=>{
	res.render("unpaid");
});

app.post("/find/fees/unpaid", (req, res)=>{
	var unpaid= async function(){
		let data= await student.find({years: {$nin: req.body.month}})
		console.log(data);
		res.render("all", {data: data})
	};
	unpaid();
});

app.listen(port, ()=>{
	console.log("CONNECTED AT PORT NO " + port)
})