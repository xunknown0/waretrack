document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addProductForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const product = await res.json();

        // Update the dashboard table dynamically
        addProductToTable(product);

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();

        // Reset the form
        form.reset();
      }
    } catch (err) {
      console.error(err);
    }
  });
});


