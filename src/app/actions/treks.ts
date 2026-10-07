"use server";
export type GalleryImage = any;
export type ItineraryStep = any;
export type Trek = any;
export type TrekFormData = any;
const treks:any[] = [
  {id:"demo-agafay",title:"Agafay Desert Sunset Tour",slug:"agafay-sunset-tour",is_active:true,cover_image:"/images/tour-agafay.jpg",category_name:"Desert",price:49,duration_hours:5},
  {id:"demo-medina",title:"Marrakech Medina Food Walk",slug:"marrakech-medina-food-walk",is_active:true,cover_image:"/images/tour-gastronomia.jpg",category_name:"Cultural Tours",price:39,duration_hours:3},
  {id:"demo-merzouga",title:"Merzouga Desert Circuit",slug:"merzouga-desert-circuit",is_active:false,cover_image:"/images/tour-merzouga.jpg",category_name:"Multi-Day Tours",price:289,duration_days:3},
];
export async function getTreks() { return treks; }
export async function getTrekById(id:string) { return treks.find((trek)=>trek.id===id) ?? null; }
export async function getAdminTrekOptions() { return treks.map(({id,title,slug})=>({id,title,slug})); }
export async function toggleTrekStatus(..._args:any[]) { return {success:true,message:"Demo product status updated."}; }
export async function deleteTrek(..._args:any[]) { return {success:true}; }
export async function createTrek(..._args:any[]) { return {success:true,trek:treks[0]}; }
export async function updateTrek(..._args:any[]) { return {success:true,trek:treks[0]}; }
export async function uploadTrekImage(..._args:any[]) { return {success:true,url:"/images/tour-agafay.jpg"}; }
