import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';

const apiHost = import.meta.env.VITE_API_HOST;


export default function Create(){
  const { register, handleSubmit, formState: { errors } } = useForm();

  const apiUrl = apiHost + "/api/photo/create";

  function addImage(data){
    //form
    const formData = new FormData();
    formData.append('image_name', data.image_name);
    formData.append('description', data.description);
    formData.append('tags', data.tags);
    formData.append('animal', data.animal);
    formData.append('image_size', data.image_size);
    formData.append('genre', data.genre);
    formData.append('image', data.image[0] || null);

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
    <form onSubmit={handleSubmit(addImage)} method="post" encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Image Name</label>
          <input {...register("image_name", { required: true })} type="text" className="form-control" />
          {errors.image_name && <span className="text-danger">Image name is required.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input {...register("description", { required: true })} type="text" className="form-control" />
          {errors.description && <span className="text-danger">Description is required.</span>}
        </div>
        {/* TODO: mininum three tags, comma separation, use regex, still needs work. */}
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <input {...register("tags", { required: true, pattern: /([\w+]*[,\w+]*)/i })} type="text" className="form-control" />
          {errors.tags && <span className="text-danger">Tags are required.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Animal</label>
          <input {...register("animal", { required: true })} type="text" className="form-control" />
          {errors.animal && <span className="text-danger">Animal is required.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Image Size</label>
          <input {...register("image_size", { required: true })} type="text" className="form-control" />
          {errors.image_size && <span className="text-danger">Image size is required.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Genre</label>
          <input {...register("genre", { required: true })} type="text" className="form-control" />
          {errors.genre && <span className="text-danger">Genre is required.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input {...register("image", { required: true })} type="file" className="form-control" />
        </div>        
        <button type="submit" className="rounded-0 btn btn-primary">Add</button>
        <Link to="/" className="btn btn-outline-secondary ms-3">Cancel</Link>
      </form>
      </main>
  )
}