import React, { useEffect } from "react";
import './ProductItem.css'
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { url } from "../../utils/constant";
import { FaStar } from "react-icons/fa";
function ProductItem({name,id,desc,category,price,reviews,img}){
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };
    const averageRating = calculateAverageRating(reviews);    
    const totalReviews = reviews.length;
    return(
        <div className="prod-item">
            <NavLink to={`/products/${id}`}>
            <div className="img-container">
                <img src={`${url}/images/${img}`} alt="" className="item-img" />
            </div>
            <div className="item-info">
                <div className="name-rating">
                    <p>{name}</p>
                </div>
                <div className="rating-info">
                    {averageRating} <FaStar className="rating-star" /> | ({totalReviews} Ratings)
                </div>
                {/* <p className="item-desc">{desc}</p> */}
                <p className="item-price">Rs. {price}</p>
            </div>
            </NavLink>
        </div>
    )
}

export default ProductItem;