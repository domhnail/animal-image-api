import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
//TODO: reuse image cards here from home.
const apiHost = import.meta.env.VITE_API_HOST;

export default function Delete(){
  const { id } = useParams();
  const deleteUrl = `${apiHost}/api/photo/delete/${id}`;
  function deleteImage(e){
    e.preventDefault();

    async function deleteData() {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      if(response.ok){
        window.location.href='/';
        if (!ignore) {
          
        }
      } else {
      }
    }
    deleteData();
  }

  // Store the result from API
  const [image, setImage] = useState(null);
  const getUrl = `${apiHost}/api/photo/read/${id}`;
  // to-do: const deleteUrl

  useEffect(() => {
   async function fetchImage() {    
     const response = await fetch(getUrl);
     if(response.ok){
       const data = await response.json();
       console.log("Fetched data:", data); // Log fetched data
       if (!ignore) {
         setImage(data.image);
       }
     } else {
       setImage(null);
     }
   }

   let ignore = false;
   fetchImage();
   return () => {
      ignore = true;
   }
 }, []);

  return (
    <div className='container-fluid'>
      <div class="row align-items-center my-5 mx-5 shadow-lg rounded-3">
        <div class="col-11 p-3 container-fluid rounded-3">
          <h1 className='fw-bold'>Are you sure you want to delete the image with ID: { id }?</h1>
        </div>
      </div>
      <div className='row d-flex align-items-center justify-content-center my-5'>
        {image ? (
        <div className='card col-6 rounded-0 shadow-lg border-info mx-2 my-5'>
          <div className='card-body'>
            <h5 key={image.id} className='card-title'>
              {image.image_name}
            </h5>
            <img className='img-fluid' src={`${apiHost}/images/${image.filename}`}>
            </img>
            <p className='card-text'>
              {image.tags}
            </p>
            <div className='row d-flex justify-content-center'>
              <button type='submit' onClick={deleteImage} className='col-4 rounded-0 btn btn-danger mx-1 mt-3'><Link to={`/delete/${image.id}`} className='text-light text-decoration-none'>Yes</Link></button>
              <button type='submit' className='col-4 rounded-0 btn btn-info mx-1 mt-3'><Link to={`/`} className='text-light text-decoration-none'>Cancel</Link></button>
            </div>
          </div>
        </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}