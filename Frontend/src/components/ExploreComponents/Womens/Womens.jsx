import React, { useState } from "react";
import './Womens.css'
import { explore_list_women } from "../../../assets/assets";
import { NavLink } from "react-router-dom";
import Display from "../../Display/Display";
import { useDispatch,useSelector } from "react-redux";
import { setSubCategory } from "../../../Redux/productSlice";

export default function Mens(){
    const dispatch=useDispatch()
    const {subCategory}=useSelector(store=>store.product)
    const handleSubCategoryClick = (itemCateg) => {
        const newSubCategory = subCategory === itemCateg ? "All" : itemCateg;
        dispatch(setSubCategory(newSubCategory));
    };
    return (
        <div>
            <div className="explore">
                <h1>Categories:</h1>
                <hr />
                <div className="explore-list">
                    {explore_list_women.map((item,index)=>{
                        return (
                            <div onClick={()=>handleSubCategoryClick(item.subCateg)} key={index} className="explore-list-item">
                                {/* <NavLink to={`/${item.categ.toLowerCase()}`}> */}
                                    <img className={subCategory===item.subCateg?"active":""} src={item.categ_img} alt="" />
                                    <p>{item.categ}</p>
                                {/* </NavLink> */}
                            </div>
                        )
                    })}
                </div>
            </div>
            <Display/>
        </div>
    )
}
