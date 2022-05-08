import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useUser from '../../Hook/useUser';
import './Inventory.css'
const Inventory = () => {
  const [product, setProduct] = useState([]);
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    fetch('http://localhost:5000/product')
      .then(res => res.json())
      .then(json => setProduct(json))
  }, []);

  const delet = (id) => {
    const confirmD = window.confirm('Are You Sure')
    if (confirmD) {

      fetch(`http://localhost:5000/product/${id}`, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(json => {

          const newproduct = product.filter(produ => produ._id !== id);
          setProduct(newproduct)
          console.log(json)
        })
    }
  }
  const user = useUser()
  function AddProduct(e) {
    e.preventDefault()
    const name = e.target.name.value
    const image = e.target.image.value
    const price = e.target.price.value
    const quantity = e.target.quantity.value
    const description = e.target.description.value
    const email = user.email
    const suplier = user.displayName

    const newproduct = { name, image, price, quantity, description, email , suplier }
    fetch("http://localhost:5000/product",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(newproduct)
      })
      .then(res => res.json)
      .then(res => { 
        console.log(res) 
        const newproducts = [ newproduct , ...product]
        setProduct(newproducts)
        e.target.reset();
      })
  }

  return (
    <div className='container mt-5'>


      <button onClick={() => setShow(true)} className='my-5 mx-auto d-block btn-special2'>Add Item</button>



      <div className="grid-3-col">
        {
          product.map(prod => <div key={prod._id} className='inventory-card'>
            <div style={{
              backgroundImage: `url(${prod.image})`
            }} className='inv-image'></div>
            {/* image end  */}
            <p>Name : {prod.name.slice(0, 24)}</p>
            <p>Suplier : {prod.suplier}</p>
            <p>Price : {prod.price}</p>
            <p>Quantity : {prod.quantity}</p>
            <p>{prod.description.slice(0, 100)} </p>
            <button onClick={() => delet(prod._id)} className="btn-special2">Delete</button>
          </div>
          )
        }
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product On Your Inventory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={AddProduct} className='add-product-db'>
            <input name='image' type="text" placeholder='Product Image Url .' required />
            <input name='name' type="text" placeholder='Product Name' required />
            <input name='price' type="number" placeholder='Product Price' required />
            <input name='quantity' type="number" placeholder='Product Quantity' required />
            <textarea name='description' type="number" placeholder='Product Description' required />
            <input className='mt-3' type="text" value={user.email} readOnly />
            <input className='mt-3' type="text" value={user.displayName} readOnly />
            <Modal.Footer>
              <Button type='submit' variant="primary" >
                Add Product
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>

      </Modal>
    </div>
  )
}

export default Inventory