import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const apiHost = import.meta.env.VITE_API_HOST;

//TODO: color scheme, mint, greens, turquoises. maybe brown, dark mode? forest. fall colors.

export default function Home() {
  const [images, setImages] = useState([]); // initialize as empty array
  const apiUrl = apiHost + '/api/photo/all';

  useEffect(() => {
    // Fetch data from API
    async function fetchData() {
      const response = await fetch(apiUrl); 
      if(response.ok){
        const data = await response.json();
        console.log("Fetched data:", data); // Log fetched data
        if (!ignore) { 
          setImages(data.image);
        }
      } else {
        setImages(null);
      }
    }
    let ignore = false;
    fetchData();
    return () => {
       ignore = true;
    }
  }, []); // run only once

  return (
    <main>
      <div className="container">
        <div className="row align-items-center my-sm-3 shadow-lg rounded-3">
          <div className="col-6 container-fluid p-3 px-0 rounded-3">
            <h1 className="fw-bold"><Link to="/" className='text-decoration-none text-info'>Animal-warez</Link></h1>
          </div>
          <div className="col-3 p-3 px-0 rounded-3">
            <button type='submit' className='rounded-0 btn btn-success mx-1'><Link to="/create" className='text-light text-decoration-none'>Upload</Link></button>
            
            {/* <button type='submit' className='rounded-0 btn btn-secondary mx-1'><Link to="/read" className='text-light text-decoration-none'>Search</Link></button> */}
          </div>
        </div>
      </div>
      <div className='row d-flex align-items-center justify-content-center my-3'>
      {
        images.length > 0 ?
        images.map(image => (
          <div className='card col-3 rounded-0 shadow-lg border-info mx-2 my-2'>
            <div className='card-body'>
              <h5 key={image.id} className='card-title d-flex justify-content-between align-items-center'>
                {image.image_name}
                <small className='text-muted'>
                {image.genre}
                </small>
              </h5>
              <img className='img-fluid' src={`${apiHost}/images/${image.filename}`}>
              </img>
              <p className='card-text text-muted'>
                {image.tags}
              </p>
              <p>
                {image.description}
              </p>
              <div className='row d-flex justify-content-center'>
                <button type='submit' className='col-4 rounded-0 btn btn-danger mx-1 mt-3'><Link to={`/delete/${image.id}`} className='text-light text-decoration-none'>Delete</Link></button>
                <button type='submit' className='col-4 rounded-0 btn btn-info mx-1 mt-3'><Link to={`/update/${image.id}`} className='text-light text-decoration-none'>Update</Link></button>
              </div>
            </div>
          </div>
        )) :
        <p>No images.</p>
      }
      </div>
    </main>
  )
}