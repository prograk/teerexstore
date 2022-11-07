import { useParams } from "react-router-dom";
import { useProducts } from "src/Providers/ProductsProvider";

const ProductDetails = (props) => {
  const { id } = useParams();
  const { productsMapped } = useProducts();
  const product = productsMapped[id];

  return (<div>
    <div>{product.name}</div>
  </div>)
};

export default ProductDetails;

//review

const product = {
  // data,
  'reviews': [{
    'user': {
      'name': 'name1',
      'avatar': 'imageurl',

    },
    'product': {
      'name': 'name1',
    },
    'reviewData': {
      'verified': Boolean,
      'date': 'date of purchase',
      'ratings': '3', 
      'review1Data': 'somedata',
      'images': ['image1', 'image2'],
      'replies': [{
        'date': 'date of reply',
        'replymessae': 'message',
      }]
    },
  }]
}