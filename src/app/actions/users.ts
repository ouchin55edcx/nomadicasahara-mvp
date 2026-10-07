"use server";
const demoUsers = [
  {id:"traveler-demo-1",full_name:"Sofia Martin",email:"sofia@example.com",phone:"+34 600 111 222",role:"tourist",is_active:true,verification_status:"verified"},
  {id:"guide-demo-1",full_name:"Youssef El Amrani",email:"youssef@example.com",phone:"+212 600 333 444",role:"guide",is_active:true,verification_status:"verified"},
  {id:"guide-demo-2",full_name:"Amine Benali",email:"amine@example.com",phone:"+212 600 555 666",role:"guide",is_active:true,verification_status:"pending"},
];
export async function getAdminUsersPage(..._args: any[]) { return demoUsers; }
export async function toggleUserStatus(..._args: any[]) { return {success: true, message: "Demo status updated."}; }
export async function toggleGuideVerification(..._args: any[]) { return {success: true}; }
export async function archiveUser(..._args: any[]) { return {success: true}; }
export async function verifyGuide(..._args: any[]) { return {success: true}; }
export async function rejectGuide(..._args: any[]) { return {success: true}; }
