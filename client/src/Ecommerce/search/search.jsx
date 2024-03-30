import React from 'react'
import Navbar from '../../componentsCart/navbar/navbar'
import SearchResultsPage from "../../componentsCart/searchResults/searchResults"
import Footer from '../../componentsCart/footer/footer'
import Searchbox from '../../componentsCart/searchbox/searchbar'
const Search = () => {
  return (<>
    <Navbar/>
    <Searchbox/>
    <SearchResultsPage/>
    <Footer/>
    </>
  )
}

export default Search