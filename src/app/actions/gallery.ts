"use server";
export async function getGalleryImages() { return Array.from({length:8},(_,i)=>({id:`gallery-${i+1}`,slot:i+1,image_url:"/images/marrakech.jpg",cf_image_id:null,title:`Morocco experience ${i+1}`})); }
export async function updateGalleryImage(..._args:any[]) { return {success:true,image_url:"/images/marrakech.jpg"}; }
