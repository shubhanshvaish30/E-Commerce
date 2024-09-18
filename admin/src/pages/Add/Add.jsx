import React, { useEffect, useState } from "react";
import './Add.css'
import {assets} from'../../assets/assets'
import axios from 'axios'
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
function Add({url}){
    const {token}=useSelector(store=>store.auth)
    const [image,setImage]=useState(false)
    const [data, setData] = useState({
        name: "",
        price: "",
        description: "",
        category:"",
        subCategory:""
    })
    const [flashMsg,setFlashMsg]=useState({success:'',error:''})
    const onChangeHandler=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setData({...data,[name]:value})
    }
    const onSubmitHandler=async (e)=>{
        e.preventDefault()
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('price', Number(data.price));
        formData.append('img', image);
        formData.append('desc', data.description);
        formData.append('category', data.category);
        formData.append('subCategory', data.subCategory);
        const response= await axios.post(`${url}/add`,formData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if(response.data.success){
            setData({
                name: "",
                price: "",
                description: "",
                category:"",
                subCategory:""
            })
            setImage(false)
            toast.success(response.data.message)
        }
        else{
            toast.error(response.data.message)
        }
    }
    return (
        <div className="add">
            <form onSubmit={onSubmitHandler} className="custom-needs-validation" noValidate>
                <div className="custom-form-group">
                    <label htmlFor="naam">Name:</label>
                    <input 
                    type="text" 
                    className="custom-form-control" 
                    name="name" 
                    id="naam" 
                    onChange={onChangeHandler}
                    value={data.name}
                    placeholder="Name of the product" 
                    required 
                    />
                    <div className="custom-valid-feedback">
                    Looks good!
                    </div>
                    <div className="custom-invalid-feedback">
                    Please enter the name.
                    </div>
                </div>

                <div className="custom-form-group">
                <p>Upload Image:</p>
                    <label htmlFor="img">
                        <img src={image?URL.createObjectURL(image):assets.upload_photo} />
                    </label>
                    <input 
                    type="file" 
                    className="custom-form-control" 
                    name="img" 
                    id="img" 
                    onChange={(e)=>setImage(e.target.files[0])}
                    hidden
                    required 
                    />
                    <div className="custom-valid-feedback">
                    Looks good!
                    </div>
                    <div className="custom-invalid-feedback">
                    Please upload the image.
                    </div>
                </div>

                <div className="custom-form-group">
                    <label htmlFor="category">Category:</label>
                    <select 
                    className="custom-form-control" 
                    name="category" 
                    id="category" 
                    onChange={onChangeHandler}
                    value={data.category}
                    defaultValue=""
                    required
                    >
                    <option value="" disabled>Select a category</option>
                    <option value="Mens">Mens</option>
                    <option value="Women">Womens</option>
                    <option value="Kids">Kids</option>
                    <option value="Beauty">Footwears</option>
                    <option value="Beauty & Health">Beauty</option>
                    </select>
                    <div className="custom-valid-feedback">
                    Looks good!
                    </div>
                    <div className="custom-invalid-feedback">
                    Please select a category.
                    </div>
                </div>

                <div className="custom-form-group">
                    <label htmlFor="price">Price:</label>
                    <input 
                    type="text" 
                    className="custom-form-control" 
                    name="price" 
                    id="price" 
                    onChange={onChangeHandler}
                    value={data.price}
                    placeholder="Price of the product" 
                    required 
                    />
                    <div className="custom-valid-feedback">
                    Looks good!
                    </div>
                    <div className="custom-invalid-feedback">
                    Please enter the price.
                    </div>
                </div>

                <div className="custom-form-group">
                    <label htmlFor="desc">Description:</label>
                    <textarea 
                    className="custom-form-control" 
                    name="description" 
                    rows="3" 
                    onChange={onChangeHandler}
                    value={data.description}
                    placeholder="Description of the product" 
                    required
                    />
                    <div className="custom-valid-feedback">
                    Looks good!
                    </div>
                    <div className="custom-invalid-feedback">
                    Please enter the description.
                    </div>
                </div>
                <div className="custom-form-group">
                    <label htmlFor="subCat">SubCategory:</label>
                    <input 
                    type="text" 
                    className="custom-form-control" 
                    name="subCategory" 
                    id="subCat" 
                    onChange={onChangeHandler}
                    value={data.subCategory}
                    placeholder="SubCategory of the product" 
                    required 
                    />
                    <div className="custom-valid-feedback">
                    Looks good!
                    </div>
                    <div className="custom-invalid-feedback">
                    Please enter the SubCategory.
                    </div>
                </div>

                <button className="custom-btn custom-btn-success" type="submit">Add Product</button>
            </form>
        </div>
    )
}

export default Add