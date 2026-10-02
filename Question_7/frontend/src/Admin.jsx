import { useEffect, useState } from "react";

function Admin({ setSite }) {
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);

  const [categoryName, setCategoryName] = useState("");

  const [productName, setProductName] = useState("");

  const [price, setPrice] = useState("");

  const [quantity, setQuantity] = useState("");

  const [category, setCategory] = useState("");

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

  // Add category

  async function addCategory(e) {
    e.preventDefault();

    await fetch("http://localhost:5000/api/categories", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: categoryName,
      }),
    });

    setCategoryName("");

    getCategories();
  }

  // Delete category

  async function deleteCategory(id) {
    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: "DELETE",
    });

    getCategories();
  }

  // Add product

  async function addProduct(e) {
    e.preventDefault();

    await fetch("http://localhost:5000/api/products", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: productName,

        price: price,

        quantity: quantity,

        category: category,
      }),
    });

    setProductName("");

    setPrice("");

    setQuantity("");

    getProducts();
  }

  // Delete product

  async function deleteProduct(id) {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });

    getProducts();
  }

  return (
    <div>
      <h2>Admin Site</h2>

      <button onClick={() => setSite("user")}>Go to User Site</button>

      <hr />

      <h3>Add Category</h3>

      <form onSubmit={addCategory}>
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <button type="submit">Add Category</button>
      </form>

      <h3>Categories</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>

              <td>
                <button onClick={() => deleteCategory(cat._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h3>Add Product</h3>

      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <br />
        <br />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <button type="submit">Add Product</button>
      </form>

      <h3>Products</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>

            <th>Price</th>

            <th>Quantity</th>

            <th>Category</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>

              <td>{product.price}</td>

              <td>{product.quantity}</td>

              <td>{product.category.name}</td>

              <td>
                <button onClick={() => deleteProduct(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
