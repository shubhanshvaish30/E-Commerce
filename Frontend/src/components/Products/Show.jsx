import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Show.css'
import { url } from '../../utils/constant';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../Redux/cartSlice';
import { FaStar } from 'react-icons/fa';
import Rating from 'react-rating-stars-component';
import {toast} from 'react-toastify'

function Show() {    
    const { id } = useParams();
    const dispatch=useDispatch();
    const { token, user } = useSelector(store => store.auth);
    const [review, setReview] = useState({
        rating: 0,
        comment: "",
    });
    const [foundProduct, setFoundProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [ratingValue, setRatingValue] = useState(0);
    const quantityRef = useRef(null);
    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${url}/products/${id}`);            
            setFoundProduct(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
        }
    };

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setReview({ ...review, [name]: value });
    };

    const onRatingChange = (newRating) => {
        setRatingValue(newRating);
        setReview({ ...review, rating: newRating });
    };
    
    const onSubmiReview = async (e) => {
        e.preventDefault();   
        try {
            const response = await axios.post(`${url}/products/${id}/review`, {...review, userId: user._id},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            if (response.data.success) {
                setReview({
                    rating: 0,
                    comment: "",
                });
                setRatingValue(0);
            } else {
                console.log("Failed to submit review:", response.data);
            }
        } catch (error) {
            toast.error("Please Login!")
            setReview({
                rating: 0,
                comment: "",
            });
            setRatingValue(0);
            console.log(error);
        }
    };
    const calculateGrandTotal = (cartItems) => {
        return cartItems.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
    }

    useEffect(() => { fetchProduct() }, [id,ratingValue]);

    const cartAdd=async(e)=>{
        e.preventDefault();
        const formData=new FormData(e.target);
        const quantity=formData.get("quantity");
        try {
            const response=await axios.post(`${url}/products/${id}/cart`, {
                itemId:foundProduct._id,
                userId:user._id,
                quantity:parseInt(quantity),
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            console.log(response.data);
            
            if (response.data.success) {
                console.log("Item added to cart successfully!");
                dispatch(setCart({
                    items: response.data.cart,
                    totalQuantity: response.data.totalQuantity, // This is returned from the backend
                    grandTotal: calculateGrandTotal(response.data.cart), // Calculate grand total if needed
                }));
                if (quantityRef.current) {
                    quantityRef.current.value = 1;
                }
            } else {
                console.log("Failed to add item to cart:", response.data.message);
            }
        } catch (error) {
            toast.error("Please Login!")
            console.log(error);
        }
    };
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1);
    };
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!foundProduct) {
        return <div>No product found</div>;
    }
    const averageRating = calculateAverageRating(foundProduct.reviews);
    const totalReviews = foundProduct.reviews.length;
    return (
        <div className="product-page">
            <div className="product-left">
                <div id="productCarousel" className="carousel">
                <div className="main-image">
                        <img src={`${url}/images/${foundProduct.img}`} alt="Main product" className="big-image" />
                    </div>
                    <div className="thumbnails">
                        {[...Array(5)].map((_, index) => (
                            <img
                                key={index}
                                src={`${url}/images/${foundProduct.img}`}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => setMainImage(foundProduct.img)}
                                className={mainImage === foundProduct.img ? 'active' : ''}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="product-right">
                <h1>{foundProduct.name}</h1>
                <p className="description">{foundProduct.desc}</p>
                <div className="rating-info">
                    {averageRating} <FaStar className="rating-star" /> | ({totalReviews} Ratings)
                </div>
                <h2 className="price">₹{foundProduct.price}</h2>
                <div className="facilities">
                    <hr />
                    <div className="facility-grid">
                        <div className="facility-item">
                            <i className="fas fa-undo-alt"></i>
                            <p>Return</p>
                        </div>
                        <div className="facility-item">
                            <i className="fas fa-exchange-alt"></i>
                            <p>Exchange</p>
                        </div>
                        <div className="facility-item">
                            <i className="fas fa-tags"></i>
                            <p>Offers</p>
                        </div>
                        <div className="facility-item">
                            <i className="fas fa-truck"></i>
                            <p>Free Shipping</p>
                        </div>
                    </div>
                    <hr />
                    </div>
                <div className="show-buttons">
                    <Link to="#" className="btn-buy">
                        <i className="fas fa-shopping-bag"></i> Buy Now
                    </Link>
                    <form onSubmit={cartAdd} className="inline-form">
                        <button type="submit" className="btn-add-cart">
                            <i className="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <select name="quantity" className="quantity-dropdown" ref={quantityRef}>
                            {[...Array(5)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </form>
                </div>
                <div className="col right">
                    <h1>Add a review :</h1>
                    <form className="review-form" onSubmit={onSubmiReview} noValidate>
                        <div className='rating-input'>
                            <label htmlFor="rating">Rating:</label>
                            <Rating
                                count={5}
                                value={ratingValue}
                                onChange={onRatingChange}
                                size={30}
                                activeColor="#ffd700"
                                isHalf={false}
                                key={ratingValue}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comment">Comment:</label>
                            <textarea 
                                name="comment" 
                                id="comment" 
                                className="form-control" 
                                rows="3" 
                                value={review.comment} // bind value to state
                                required 
                                onChange={onChangeHandler}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-post"><i className="fas fa-paper-plane"></i> Post</button>
                    </form>
                    <div className="reviews">
                        {foundProduct.reviews.map((review, index) => (
                            <div key={index} className="review-card">
                                <p className="review-date">
                                    {review.createdAt ? new Date(review.createdAt).toDateString() : ''}
                                </p>
                                <p className="review-user">
                                    {review.userId ? review.userId.name : 'Anonymous'}
                                </p>
                                <div className="rating">
                                    {review.rating} <FaStar className="rating-star" />
                                </div>
                                <div className="review-body">
                                    <p>Comment: {review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>            
            </div>
        </div>
    );
}

export default Show;
