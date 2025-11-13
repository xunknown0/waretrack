 const addModal = document.getElementById('addModal');
  const editModal = document.getElementById('editModal');
  const viewModal = document.getElementById('viewModal');
  const deleteModal = document.getElementById('deleteModal');

  const openAddBtn = document.getElementById('openAddModal');
  const closeAddBtn = document.getElementById('closeAddModal');
  const closeEditBtn = document.getElementById('closeEditModal');
  const closeViewBtn = document.getElementById('closeViewBtn');
  const closeViewSpan = document.getElementById('closeViewModal');
  const closeDeleteBtn = document.getElementById('closeDeleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDelete');

  const editForm = document.getElementById('editForm');
  const deleteForm = document.getElementById('deleteForm');

  const viewSKU = document.getElementById('viewSKU');
  const viewTitle = document.getElementById('viewTitle');
  const viewDescription = document.getElementById('viewDescription');
  const viewPrice = document.getElementById('viewPrice');
  const viewStock = document.getElementById('viewStock');

  // OPEN ADD MODAL
  openAddBtn.addEventListener('click', ()=> addModal.style.display='flex');
  closeAddBtn.addEventListener('click', ()=> addModal.style.display='none');

  // EDIT MODAL
  document.querySelectorAll('.edit-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const tr = e.target.closest('tr');
      editForm.action = `/products/${tr.dataset.id}?_method=PUT`;
      document.getElementById('editTitle').value = tr.dataset.title;
      document.getElementById('editDescription').value = tr.dataset.description;
      document.getElementById('editPrice').value = tr.dataset.price;
      document.getElementById('editStock').value = tr.dataset.stock;
      editModal.style.display='flex';
    });
  });
  closeEditBtn.addEventListener('click', ()=> editModal.style.display='none');

  // VIEW MODAL
  document.querySelectorAll('.view-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const tr = e.target.closest('tr');
      viewSKU.textContent = tr.dataset.sku;
      viewTitle.textContent = tr.dataset.title;
      viewDescription.textContent = tr.dataset.description;
      viewPrice.textContent = parseFloat(tr.dataset.price).toFixed(2);
      viewStock.textContent = tr.dataset.stock;
      viewModal.style.display='flex';
    });
  });
  closeViewBtn.addEventListener('click', ()=> viewModal.style.display='none');
  closeViewSpan.addEventListener('click', ()=> viewModal.style.display='none');

  // DELETE MODAL
  document.querySelectorAll('.delete-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const tr = e.target.closest('tr');
      deleteForm.action = `/products/${tr.dataset.id}?_method=DELETE`;
      deleteModal.style.display='flex';
    });
  });
  closeDeleteBtn.addEventListener('click', ()=> deleteModal.style.display='none');
  cancelDeleteBtn.addEventListener('click', ()=> deleteModal.style.display='none');

  // CLICK OUTSIDE MODAL
  window.addEventListener('click', e=>{
    if(e.target===addModal) addModal.style.display='none';
    if(e.target===editModal) editModal.style.display='none';
    if(e.target===viewModal) viewModal.style.display='none';
    if(e.target===deleteModal) deleteModal.style.display='none';
  });

  