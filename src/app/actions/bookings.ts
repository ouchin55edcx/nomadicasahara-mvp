"use server";
const bookings = [
  {id:"demo-1", booking_ref:"TV-2601", tourist_name:"Sofia Martin", trek_date:"2026-10-08", status:"confirmed", payment_status:"paid", source:"website", total_price:490, treks:{title:"Agafay Desert Sunset Tour"}},
  {id:"demo-2", booking_ref:"TV-2602", tourist_name:"Daniel Costa", trek_date:"2026-10-09", status:"pending", payment_status:"unpaid", source:"walkin", total_price:289, treks:{title:"Merzouga Desert Circuit"}},
  {id:"demo-3", booking_ref:"TV-2603", tourist_name:"Amira Haddad", trek_date:"2026-10-10", status:"confirmed", payment_status:"paid", source:"website", total_price:180, treks:{title:"Marrakech Medina Food Walk"}},
];
export async function getAllBookings(offset=0, limit=50) { return bookings.slice(offset, offset+limit); }
export async function getActiveGuides() { return [{id:"guide-demo-1", full_name:"Youssef El Amrani", name:"Youssef El Amrani"}]; }
export async function updateBookingStatus(..._args: any[]) { return {success:true, message:"Demo booking updated."}; }
export async function markBookingPaid(..._args: any[]) { return {success:true, message:"Demo payment updated."}; }
export async function assignGuide(..._args: any[]) { return {success:true, message:"Demo guide assigned."}; }
export async function autoAssignGuide(..._args: any[]) { return {success:true, message:"Demo guide assigned."}; }
