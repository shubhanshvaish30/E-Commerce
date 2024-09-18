import React, { useEffect, useState } from "react";
import './Show.css'
import axios from 'axios'
import { toast } from "react-toastify";

function Show({url}){
    const [list,setList]=useState([])
    const fetchList=async ()=>{
        const response=await axios.get(`${url}/products`)
        console.log(response.data);
        
        if(response.data.success){
            setList(response.data.data)
        }else{
            toast.error("Error")
        }
    }
    const removeProd=async (prodId)=>{
        const response=await axios.post(`${url}/products/delete`,{id:prodId})
        await fetchList();
        if(response.data.success){
            toast.success(response.data.message)
        }
        else{
            toast.error("Error")
        }
    }
    useEffect(()=>{fetchList()},[])
    return (
        <div className="list add flex-col">
            <p>All Products</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item,index)=>{
                    return (
                        <div key={index} className="list-table-format">
                            <img src={`${url}/images/`+item.img} alt="" />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>Rs.{item.price}</p>
                            <button onClick={()=>removeProd(item._id)} className="cursor">Delete</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Show