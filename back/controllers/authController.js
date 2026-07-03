// Placeholder auth controller
export async function login(req, res){
  res.json({ok:true, user:{id:1,name:'Demo'}});
}
export async function register(req,res){
  res.json({ok:true});
}
