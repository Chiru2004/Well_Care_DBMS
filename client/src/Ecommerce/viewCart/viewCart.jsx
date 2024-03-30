import React from 'react'
import Footer from '../../componentsCart/footer/footer'
import Navbar from '../../componentsCart/navbar/navbar'
import Addtocart from '../../componentsCart/addtocart/addtocarrt'
import Searchbox from '../../componentsCart/searchbox/searchbar'
const ViewCart = () => {
  return (
 <div>
  <Navbar/>
  <Searchbox/>
<Addtocart/>
  <Footer/>
 </div>
  )
}

export default ViewCart