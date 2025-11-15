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