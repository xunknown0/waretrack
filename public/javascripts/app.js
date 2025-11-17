/*!
 * Start Bootstrap - SB Admin v7.0.7
 */

// Sidebar toggle
window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    // Confirm delete
    document.querySelectorAll('.deleteProductForm').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this product?')) {
                form.submit();
            }
        });
    });
});

function previewImage(event, previewId){
  const reader = new FileReader();
  const preview = document.getElementById(previewId);
  reader.onload = function(){
    preview.src = reader.result;
    preview.style.display = 'block';
  }
  reader.readAsDataURL(event.target.files[0]);
}


  function previewImage(event, previewId) {
    const input = event.target;
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      }
      reader.readAsDataURL(input.files[0]);
    } else {
      preview.src = '';
      preview.style.display = 'none';
    }
  }

  function previewImage(event, previewId){
  const input = event.target;
  const preview = document.getElementById(previewId);
  if(input.files && input.files[0]){
    const reader = new FileReader();
    reader.onload = function(e){
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
}

function previewImage(event, previewId){
  const input = event.target;
  const preview = document.getElementById(previewId);
  if(input.files && input.files[0]){
    const reader = new FileReader();
    reader.onload = function(e){
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
}

// Delete confirmation
function confirmDelete(url){
  const deleteForm = document.getElementById('deleteForm');
  deleteForm.action = url;
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
  deleteModal.show();
}

document.addEventListener("DOMContentLoaded", function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });

document.addEventListener("DOMContentLoaded", function () {
  var toastElList = [].slice.call(document.querySelectorAll('.toast'));
  toastElList.forEach(function (toastEl) {
    var toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();
  });
});

