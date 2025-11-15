
  document.querySelectorAll('.editProductForm').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const productId = this.dataset.id;
    const formData = new FormData(this);

    // Convert FormData to URLSearchParams for easier JSON parsing
    const data = Object.fromEntries(formData.entries());

    fetch(`/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(product => {
      const row = document.getElementById(`productRow-${product._id}`);
      row.querySelector('.title').innerText = product.title;
      row.querySelector('.category').innerText = product.category || 'N/A';
      row.querySelector('.stock').innerText = product.stock ?? 0;
      row.querySelector('.price').innerText = `₱${Number(product.price).toLocaleString()}`;
      const statusCell = row.querySelector('.status');
      statusCell.innerText =
        product.stock <= 0 ? 'Out of Stock' : product.stock <= 5 ? 'Critical' : 'In Stock';
      statusCell.className = `status fw-bold ${product.stock <= 0 ? 'text-danger' : product.stock <=5 ? 'text-warning' : 'text-success'}`;

      // Close modal
      const modalEl = document.getElementById(`editProductModal-${product._id}`);
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    })
    .catch(err => {
      console.error(err);
      alert('Error updating product.');
    });
  });
});
