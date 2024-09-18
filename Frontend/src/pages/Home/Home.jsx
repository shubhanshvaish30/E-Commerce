import React from "react";
import { useState,useEffect } from "react";
import './Home.css'
import Header from "../../components/caraousel/Header/Header";
import Component1 from "../../components/caraousel/Component1/Component1";
import Component2 from "../../components/caraousel/Component2/Component2";
import Explore from "../../components/Explore/Explore";
import Product from "../Product/Product";
import Display from "../../components/Display/Display";
import { useDispatch,useSelector } from "react-redux";
import { resetFilters } from "../../Redux/productSlice";

function Home(){
    const components = [<Header />, <Component1 />, <Component2 />];
    const [currentIndex, setCurrentIndex] = useState(0);
    const dispatch = useDispatch();
    const category=useSelector((store)=>store.product.category);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % components.length);
        }, 5000);
        dispatch(resetFilters());

        return () => clearInterval(interval);
    }, [components.length,dispatch]);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % components.length);
    };
    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + components.length) % components.length);
    };
    return (
        <div>
            <div >
            <button className="arrow prev-arrow" onClick={goToPrev}>&lt;</button>
            {components[currentIndex]}
            <button className="arrow next-arrow" onClick={goToNext}>&gt;</button>
            </div>
            <Explore/>
            <Display/>
        </div>
    );
}

export default Home