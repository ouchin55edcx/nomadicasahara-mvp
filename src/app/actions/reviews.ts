"use server";
const reviews = [
  {id:"review-demo-1",author:"Sofia Martin",tourist_name:"Sofia Martin",rating:5,body:"A wonderful introduction to Morocco.",status:"approved",trek_title:"Agafay Desert Sunset Tour",created_at:"2026-10-02"},
  {id:"review-demo-2",author:"Daniel Costa",tourist_name:"Daniel Costa",rating:4,body:"Great guide and beautiful scenery.",status:"pending",trek_title:"Marrakech Medina Food Walk",created_at:"2026-10-04"},
];
export async function getAllReviews(..._args:any[]) { return reviews; }
export async function approveReview(..._args:any[]) { return {success:true}; }
export async function rejectReview(..._args:any[]) { return {success:true}; }
export async function sendReviewRequest(..._args:any[]) { return {success:true}; }
