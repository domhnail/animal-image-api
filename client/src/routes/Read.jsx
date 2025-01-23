import { useParams } from 'react-router-dom';
import {Link} from 'react-router-dom';

export default function Read(){
  const { id } = useParams();

  return (
    <h1>Read page for { id }</h1>
  )
}