import { useEffect, useState } from "react";

function User({ setSite }) {
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCategories();

    getProducts();
  }, []);

  // Get categories

  async function getCategories() {
    const response = await fetch("http://localhost:5000/api/categories");

    const data = await response.json();

    setCategories(data);
  }

  // Get products

  async function getProducts() {
    const response = await fetch("http://localhost:5000/api/products");

    const data = await response.json();

    setProducts(data);
  }

  // Filter products by category

  async function selectCategory(id) {
    const response = await fetch(
      `http://localhost:5000/api/products/category/${id}`,
    );

    const data = await response.json();

    setProducts(data);
  }

  // Add to cart

  function addToCart(product) {
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                cartQuantity: item.cartQuantity + 1,
              }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,

        {
          ...product,
          cartQuantity: 1,
        },
      ]);
    }
  }

  // Remove from cart

  function removeFromCart(id) {
    setCart(cart.filter((item) => item._id !== id));
  }

  // Increase quantity

  function increase(id) {
    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              cartQuantity: item.cartQuantity + 1,
            }
          : item,
      ),
    );
  }

  // Decrease quantity

  function decrease(id) {
    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              cartQuantity: item.cartQuantity > 1 ? item.cartQuantity - 1 : 1,
            }
          : item,
      ),
    );
  }

  // Calculate total

  function getTotal() {
    return cart.reduce(
      (total, item) => total + item.price * item.cartQuantity,

      0,
    );
  }

  return (
    <div>
      <h2>User Site</h2>

      <button onClick={() => setSite("admin")}>Admin Site</button>

      <hr />

      <h3>Categories</h3>

      <button onClick={getProducts}>All Products</button>

      {categories.map((cat) => (
        <button key={cat._id} onClick={() => selectCategory(cat._id)}>
          {cat.name}
        </button>
      ))}

      <h3>Products</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>

            <th>Price</th>

            <th>Category</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>

              <td>₹{product.price}</td>

              <td>{product.category.name}</td>

              <td>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>Shopping Cart</h3>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div key={item._id}>
          <p>
            {item.name}
            {" - "}₹{item.price}
            {" - Quantity: "}
            {item.cartQuantity}{" "}
            <button onClick={() => increase(item._id)}>+</button>{" "}
            <button onClick={() => decrease(item._id)}>-</button>{" "}
            <button onClick={() => removeFromCart(item._id)}>Remove</button>
          </p>
        </div>
      ))}

      <h3>Total: ₹{getTotal()}</h3>
    </div>
  );
}

export default User;
