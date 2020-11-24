import React, {useState, useEffect} from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import {updateProduct, getCategories, getProduct } from './apiAdmin'
import '../styles.css'

const AddProduct = ({match}) => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        image: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })

    const {user, token} = isAuthenticated();

    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        image,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values

    // Load categories and set form data
    const init = productId => {
        getProduct(productId).then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({ 
                    ...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    shipping: data.shipping,
                    quantity: data.quantity, 
                    formData: new FormData()})
                    initCategories()
            }
        })
    }

    // Load categories and set form data
    const initCategories = () => {
        getCategories().then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({ 
                    categories: data, 
                    formData: new FormData()})
            }
        })
    }

    useEffect(() => {
        init(match.params.productId)
    }, [])

    const handleChange = name => event => {
        const value = name === 'image' ? event.target.files[0] : event.target.value;
        formData.set(name, value)
        setValues({...values, [name]: value})
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: "", loading: true});

        updateProduct(match.params.productId, user._id, token, formData)
        .then(data => {
            if(data.error) {
                setValues({ ...values, error: data.error})
            } else {
                setValues({ ...values, name: '', description: '', 
                image: '', price: '', quantity: '', 
                loading: false, error: false, category: '',
                redirectToProfile: true, createdProduct: data.name})
            } 
        })
    }

    const newPostForm = () => (
        <form className="mb-3" onSubmit={onSubmit}>
            <h4>Post Image</h4>
            <div className="form-group">
                <label >
                    <div className="file-body">
                        <input className="file-btn" onChange={handleChange('image')} 
                        type="file" name="image" accept="image/*"/>
                    </div>
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                    <input onChange={handleChange('name')} type="text" value={name} className="form-control" />
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                    <input onChange={handleChange('description')} type="text" value={description} className="form-control"/>
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                    <input onChange={handleChange('price')} type="number" value={price} className="form-control"/>
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                    <select onChange={handleChange('category')} className="form-control">
                        <option>Select Category</option>
                        {categories && categories.map((c,i) => (
                            <option key={i} value={c._id}>{c.name}</option>
                        ))}
                    </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                    <select onChange={handleChange('shipping')} className="form-control">
                        <option value="0">Please Select</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                    <input onChange={handleChange('quantity')} type="number" value={quantity} className="form-control"/>
            </div>

            <button className="btn btn-outline-primary">Update Product</button>
        </form>
    )

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
                {error}
        </div>
        )

    const showSuccess = () => (
        <div
            className="alert alert-info"
            style={{ display: createdProduct ? "" : "none" }}
        >
            <h2>{`${createdProduct}`} is updated!</h2>
        </div>
    )

    const showLoading = () => (
        loading && (
            <div className="alert alert-success"><h2>Loading...</h2></div>
        )
    )

    return (
        <Layout title="Update Product" 
            description={`Hello ${user.name}, Update the Product`}
            className="container-fluid">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
        )
}

export default AddProduct