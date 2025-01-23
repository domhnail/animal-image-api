import {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
const apiHost = import.meta.env.VITE_API_HOST;
import { useParams } from 'react-router-dom';

export default function Update(){
  const { id } = useParams();
  
  const apiUrl = `${apiHost}/api/photo/update/${id}`;

  const [image, setImage] = useState(null);
  const getUrl = `${apiHost}/api/photo/read/${id}`;

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

  function updateImage(e){
    e.preventDefault();
  
    //form
    const formData = new FormData();
    formData.append('image_name',image.image_name);
    formData.append('description',image.description);
    formData.append('tags',image.tags);
    formData.append('animal',image.animal);
    formData.append('image_size',image.image_size);
    formData.append('genre',image.genre);
    // formData.append('image',image.imageFile);

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
  {image ? (
    <form onSubmit={updateImage} method="post" encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Image Name</label>
          <input required type="text" name="Image Name" className="form-control" value={image.image_name} onChange={e => setImageName(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input required type="text" name="Description" className="form-control" value={image.description} onChange={e => setDescription(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input type="text" name="Tags" className="form-control" value={image.tags} onChange={e => setTags(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Animal</label>
          <input required type="text" name="Animal" className="form-control" value={image.animal} onChange={e => setAnimal(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Image Size</label>
          <input required type="text" name="Image Size" className="form-control" value={image.image_size} onChange={e => setImageSize(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Genre</label>
          <input required type="text" name="Genre" className="form-control" value={image.genre} onChange={e => setGenre(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" name="Image" className="form-control" onChange={e => setImageFile(e.target.files[0])} />
        </div>        
        <button type="submit" className="rounded-0 btn btn-primary">Add</button>
        <Link to="/" className="btn btn-outline-secondary ms-3">Cancel</Link>
      </form>
              ) : (
                <p>Loading...</p>
              )}
      </main>
  )
}