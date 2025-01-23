import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const apiHost = import.meta.env.VITE_API_HOST;

export default function Update(){
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { id } = useParams();
  const apiUrl = `${apiHost}/api/photo/update/${id}`;

  function updateImage(data){
    //form
    console.log('fired.');
    const formData = new FormData();
    formData.append('image_name', data.image_name);
    formData.append('description', data.description);
    formData.append('tags', data.tags);
    formData.append('animal', data.animal);
    formData.append('image_size', data.image_size);
    formData.append('genre', data.genre);
    formData.append('image', data.image[0] || null);

    async function updateData() {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        body: formData,
      });

      if(response.ok){
        window.location.href='/';
        if (!ignore) {
          
        }
      } else {
      }
    }

    updateData();
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
    <main>
      <div className="container">
        <div className="row align-items-center my-5 shadow-lg rounded-3">
          <div className="col-6 p-3 container-fluid rounded-3">
            <h1 className='fw-bold'>Updating image with ID: { id }</h1>
          </div>
        </div>
      </div>
      {image ? (
      <div className="row justify-content-between align-items-center my-5">
        <div className="col-6 shadow-lg rounded-3 p-3 ">
          <form onSubmit={handleSubmit(updateImage)} method="post" encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Image Name</label>
              <input {...register("image_name", { required: true })} type="text" className="form-control" defaultValue={image.image_name}/>
              {errors.image_name && <span className="text-danger">Image name is required.</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input {...register("description", { required: true })} type="text" className="form-control" defaultValue={image.description}/>
              {errors.description && <span className="text-danger">Description is required.</span>}
            </div>
            {/* TODO: mininum three tags, comma separation, use regex, still needs work. */}
            <div className="mb-3">
              <label className="form-label">Tags</label>
              <input {...register("tags", { required: true, pattern: /([\w+]*[,\w+]*)/i })} type="text" className="form-control" defaultValue={image.tags}/>
              {errors.tags && <span className="text-danger">Tags are required.</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Animal</label>
              <input {...register("animal", { required: true })} type="text" className="form-control" defaultValue={image.animal}/>
              {errors.animal && <span className="text-danger">Animal is required.</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Image Size</label>
              <input {...register("image_size", { required: true })} type="text" className="form-control" defaultValue={image.image_size}/>
              {errors.image_size && <span className="text-danger">Image size is required.</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Genre</label>
              <input {...register("genre", { required: true })} type="text" className="form-control" defaultValue={image.genre}/>
              {errors.genre && <span className="text-danger">Genre is required.</span>}
            </div>
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input {...register("image", { required: false })} type="file" className="form-control" />
            </div>        
            <button type="submit" className="rounded-0 btn btn-primary">Update</button>
            <Link to="/" className="btn btn-outline-secondary ms-3">Cancel</Link>
          </form>
        </div>
        <div className="card col-5 rounded-0 shadow-lg border-info mx-2 my-2">
          <div className='card-body'>
            <h5 key={image.id} className='card-title'>
              {image.image_name}
            </h5>
            <img className='img-fluid' src={`${apiHost}/images/${image.filename}`}>
            </img>
          </div>
        </div>
      </div>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  )
}