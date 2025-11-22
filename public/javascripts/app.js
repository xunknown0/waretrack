/*!
 * Start Bootstrap - SB Admin v7.0.7
 */

// Sidebar toggle
window.addEventListener("DOMContentLoaded", (event) => {
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }

  // Confirm delete
  document.querySelectorAll(".deleteProductForm").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (confirm("Are you sure you want to delete this product?")) {
        form.submit();
      }
    });
  });
});

function previewImage(event, previewId) {
  const reader = new FileReader();
  const preview = document.getElementById(previewId);
  reader.onload = function () {
    preview.src = reader.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(event.target.files[0]);
}

function previewImage(event, previewId) {
  const input = event.target;
  const preview = document.getElementById(previewId);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

function previewImage(event, previewId) {
  const input = event.target;
  const preview = document.getElementById(previewId);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

function previewImage(event, previewId) {
  const input = event.target;
  const preview = document.getElementById(previewId);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

// Delete confirmation
function confirmDelete(url) {
  const deleteForm = document.getElementById("deleteForm");
  deleteForm.action = url;
  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteConfirmModal")
  );
  deleteModal.show();
}

function previewImage(event, previewId) {
  const output = document.getElementById(previewId);
  output.src = URL.createObjectURL(event.target.files[0]);
  output.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const editModal = document.getElementById("editCategoryModal");
  editModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    document.getElementById("editCatId").value = button.getAttribute("data-id");
    document.getElementById("editCatName").value =
      button.getAttribute("data-name");
    document.getElementById("editParentCategory").value =
      button.getAttribute("data-parent");
  });
});

function previewImage(event, id) {
  const output = document.getElementById(id);
  output.src = URL.createObjectURL(event.target.files[0]);
  output.style.display = "block";
}

$(document).ready(function () {
  $("#productCategory").select2({
    theme: "bootstrap-5",
    width: "100%",
    templateResult: function (state) {
      if (!state.id) return state.text; // placeholder
      const isParent = $(state.element).data("parent"); // check parent
      if (isParent) {
        return $(
          '<span style="font-weight:bold; color:#333;">' +
            state.text +
            "</span>"
        );
      }
      return $("<span>" + state.text + "</span>");
    },
    templateSelection: function (state) {
      return state.text;
    },
  });
});

// Auto-remove flash messages after 5s
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".flash-message").forEach((flash) => {
    setTimeout(() => flash.remove(), 5000);
  });

  // Show loading on form submit
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", () => {
      document.getElementById("loading-overlay").classList.add("active");
    });
  });
});

// Hide loader after page fully loads
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('fade-out'); // trigger CSS fade

        // Wait for the CSS transition to finish, then remove loader
        loader.addEventListener('transitionend', () => {
            loader.style.display = 'none';
        });
    }
});
