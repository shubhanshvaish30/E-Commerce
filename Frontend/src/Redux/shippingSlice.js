import {createSlice} from '@reduxjs/toolkit';

const initialState={
    shippingInfo:{
        addressId:"",
        address:'',
        city:'',
        state:'',
        country:'',
        pinCode:'',
        phoneNo:'',
    },
    orderItems:[],
    paymentInfo:{
        id:null,
        status:""
    },
    totalPrice:0,
    isCheckOut:false,
};

const shippingSlice=createSlice({
    name:'shipping',
    initialState,
    reducers:{
        setShippingInfo:(state,action)=>{
            state.shippingInfo=action.payload;
        },
        setOrderItems:(state,action)=>{
            state.orderItems=action.payload;
        },
        setPaymentInfo:(state,action)=>{
            state.paymentInfo=action.payload;
        },
        setTotalPrice:(state,action)=>{
            state.totalPrice=action.payload;
        },
        setCheckOut:(state,action)=>{
            state.isCheckOut=action.payload;
        }
    },
});

export const {setShippingInfo,setOrderItems,setPaymentInfo,setTotalPrice,setCheckOut}=shippingSlice.actions;
export default shippingSlice.reducer;
