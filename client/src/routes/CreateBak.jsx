import {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
const apiHost = import.meta.env.VITE_API_HOST;

export default function CreateBak(){

  const apiUrl = apiHost + "/api/photo/create";

  const [image_name, setImageName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [animal, setAnimal] = useState('');
  const [image_size, setImageSize] = useState('');
  const [genre, setGenre] = useState('');
  const [imageFile, setImageFile] = useState(null);



  function addImage(e){
    e.preventDefault();
  
    //form
    const formData = new FormData();
    formData.append('image_name',image_name);
    formData.append('description',description);
    formData.append('tags',tags);
    formData.append('animal',animal);
    formData.append('image_size',image_size);
    formData.append('genre',genre);
    formData.append('image',imageFile);

    async function postData() {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if(response.ok){
        window.location.href='/';
        if (!ignore) {
          
        }
      } else {
      }
    }

    postData();
  }
  return (
    <main>
      <div class="container">
        <div class="row align-items-center my-sm-3 shadow-lg rounded-3">
          <div class="col-6 container-fluid p-3 px-0 rounded-3">
            <h1 class="fw-bold"><Link to="/" className='text-decoration-none text-info'>Animal-warez</Link></h1>
          </div>
          <div class="col-3 p-3 px-0 rounded-3">
            <button type='submit' className='rounded-0 btn btn-success mx-1'><Link to="/create" className='text-light text-decoration-none'>Upload</Link></button>
            
            {/* <button type='submit' className='rounded-0 btn btn-secondary mx-1'><Link to="/read" className='text-light text-decoration-none'>Search</Link></button> */}
          </div>
        </div>
      </div>
    <form onSubmit={addImage} method="post" encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Image Name</label>
          <input required type="text" name="Image Name" className="form-control" value={image_name} onChange={e => setImageName(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input required type="text" name="Description" className="form-control" value={description} onChange={e => setDescription(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input type="text" name="Tags" className="form-control" value={tags} onChange={e => setTags(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Animal</label>
          <input required type="text" name="Animal" className="form-control" value={animal} onChange={e => setAnimal(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Image Size</label>
          <input required type="text" name="Image Size" className="form-control" value={image_size} onChange={e => setImageSize(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Genre</label>
          <input required type="text" name="Genre" className="form-control" value={genre} onChange={e => setGenre(e.target.value)}  />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" name="Image" className="form-control" onChange={e => setImageFile(e.target.files[0])} />
        </div>        
        <button type="submit" className="rounded-0 btn btn-primary">Add</button>
        <Link to="/" className="btn btn-outline-secondary ms-3">Cancel</Link>
      </form>
      </main>
  )
}