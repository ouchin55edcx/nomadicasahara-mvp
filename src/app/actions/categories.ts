"use server";
export type Category = {id:string; name:string; description?:string; photo?:string|null; is_active?:boolean};
const categories: Category[] = ["Desert","Cultural Tours","Private Tours","Dinner Shows","Hammam & Spa","Transfers","Multi-Day Tours"].map((name,index)=>({id:`category-${index+1}`,name,description:`Explore ${name.toLowerCase()} in Morocco.`,is_active:true}));
export async function getCategories() { return categories; }
export async function createCategory(..._args:any[]) { return {success:true, category:categories[0]}; }
export async function updateCategory(..._args:any[]) { return {success:true}; }
export async function deleteCategory(..._args:any[]) { return {success:true}; }
export async function uploadCategoryImage(..._args:any[]) { return {success:true,url:"/images/marrakech.jpg"}; }
