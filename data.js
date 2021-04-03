var mongoose= require("mongoose");
mongoose.connect("mongodb+srv://stream:nodejswebproject_p1@cluster0.gayms.mongodb.net/stream?retryWrites=true&w=majorit",{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false 
}).then(()=>{console.log("DATABASE CONNECTED")}).catch((e)=>{
	console.log("DATABASE ERROR IS " + e)
});

var owner_data= new mongoose.Schema({
	user:{type: String, trim: true},
	pass:{type: String, trim: true}
});


var teacher_data= new mongoose.Schema({
	_id: {type: Number, required: true},

	name:{type: String, required: true,lowercase: true, trim: true},
	
	f_name: {type: String, required: true,lowercase: true, trim: true},

	gender: {type: String, required: true},

	img: {type: String},

	status: {type: String, default: "teacher"},

	sub:  {type: String, required: true},
	
	phone_no: {type: Number, required: true,trim: true},
	
	email: {type: String, require: true, trim: true, unique: true},
	
	address:{type: String, required: true, trim: true,},
	
	qualification:{	type: String, required: true,trim: true, },
	
	salary: {type: Number, required: true,trim: true},

	date:{type: Date, default: Date.now(Date.Year+ " "+ Date.Month+ " "+ Date.Day)},

	years: [{type: String}]
});


var student_data = new mongoose.Schema({

	_id:{type: Number, required: true},
	
	name:{type: String, required: true,lowercase: true, trim: true},
	
	f_name: {type: String, required: true,lowercase: true, trim: true},
	
	class: {type: String, required: true},

	gender: {type: String, required: true},

	img: {type: String},

	status: {type: String, default: "student"},

	phone_no: {type: Number, required: true,trim: true},
	
	email: {type: String, require: true, trim: true,  unique: true},
	
	address:{type: String, required: true, trim: true,},
	 
	fees:{type: Number,required: true,trim: true},

	date:{type: Date, default: Date.now(Date.Year+ " "+ Date.Month+ " "+ Date.Day)},

	badge:{type: String, required: true, trim: true,},

	years: [{type: String}]
});

var owner= new mongoose.model("owner", owner_data);
var teacher= new mongoose.model("teacher", teacher_data)
var student= new mongoose.model("student", student_data)

module.exports= {owner, teacher, student};