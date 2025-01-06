// Configuration
const config = {
  apiUrl: "simple-ecommerce-backend-d4cqfhayfrhphag0.southeastasia-01.azurewebsites.net/api/",
};

let accounts = [];

let users = [];

let currentPage = 1;

// Function to fetch users from the API
function fetchAccounts() {
  $.ajax({
    url: `${config.apiUrl}accounts`,
    method: "GET",
    success: function (response) {
      accounts = response;
      populateUserTable(accounts);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching accounts:", error);
      alert("Failed to load users. Please try again later.");
    },
  });
}

// Function to populate user table
function populateUserTable(accounts) {
  const tableBody = $("#userTableBody");
  tableBody.empty();
  
  // Sort accounts by created_at in descending order
  const sortedAccounts = accounts.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Paginate the sorted accounts
  const paginatedAccounts = PaginationUtils.paginate(sortedAccounts, currentPage);
  
  paginatedAccounts.forEach((account) => {
    const fullName = account.userInfo
      ? `${account.userInfo.firstName || ""} ${
          account.userInfo.lastName || ""
        }`.trim()
      : "N/A";

    tableBody.append(`
            <tr>
                <td>${fullName}</td>
                <td>${account.email}</td>
                <td>${account.role}</td>
                <td>${account.lastLogin || "Never"}</td>
                <td><span class="badge bg-${
                  account.accountStatus === "Active" ? "success" : "danger"
                }">${account.accountStatus}</span></td>
                <td>${TableActions.getActionButtons(account.id)}</td>
            </tr>
        `);
  });

  // Setup pagination
  PaginationUtils.setupPagination(sortedAccounts.length, currentPage, (page) => {
    currentPage = page;
    populateUserTable(accounts);
  });
}

// Initial load
$(document).ready(function () {
  fetchAccounts();

  // Initialize table actions
  TableActions.initializeTableActions("userTableBody", {
    onView: (id) => {
      window.location.href = `user-details.html?id=${id}`;
    },
    onDelete: async (id) => {
      return await TableActions.handleDelete(
        "accounts",
        id,
        "Are you sure you want to delete this user?"
      );
    },
    onDeleteSuccess: () => {
      fetchAccounts(); // Refresh the table
    },
  });

  // Search functionality
  $("#searchUser").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    $("#userTableBody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Add new user
  $("#saveUserBtn").click(function () {
    const email = $("#userEmail").val();
    const role = $("#userRole").val();
    const status = $("#userStatus").val();
    if (email && role && status) {
      const newUser = {
        email: email,
        role: role,
        accountStatus: status,
      };
      // TODO: Implement API call to create user
      $("#addUserModal").modal("hide");
      $("#addUserForm")[0].reset();
      fetchAccounts(); // Refresh the table
    } else {
      alert("Please fill all fields");
    }
  });

  // Edit user (placeholder functionality)
  $(document).on("click", ".edit-user", function () {
    const userId = $(this).data("id");
    alert(`Edit user with ID: ${userId}`);
    // Implement edit functionality here
  });

  // Delete user
  $(document).on("click", ".delete-user", function () {
    const userId = $(this).data("id");
    if (confirm("Are you sure you want to delete this user?")) {
      const index = accounts.findIndex((user) => user.id === userId);
      if (index !== -1) {
        accounts.splice(index, 1);
        populateUserTable(accounts);
      }
    }
  });

  // Dark mode toggle
  $("#darkModeToggle").click(function () {
    $("body").toggleClass("dark-mode");
    const isDarkMode = $("body").hasClass("dark-mode");
    $(this).html(
      isDarkMode
        ? '<i class="bi bi-sun"></i> Light Mode'
        : '<i class="bi bi-moon"></i> Dark Mode'
    );
  });
});

function showAddUserModal() {
  const template = document.getElementById("userFormTemplate");
  const modalOptions = {
    title: "Add New User",
    content: template.innerHTML,
    saveButtonText: "Add User",
    onSave: async function () {
      try {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("userEmail").value;
        const role = document.getElementById("userRole").value;

        if (firstName && lastName && email && role) {
          const userData = {
            firstName,
            lastName,
            email,
            password: "DefaultPassword123",
            role,
          };

          await ApiService.createEntity("accounts", userData);
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("dynamicModal")
          );
          modal.hide();
          document.getElementById("addUserForm").reset();
          fetchAccounts(); // Refresh the table
        } else {
          alert("Please fill all required fields");
        }
      } catch (error) {
        alert("Error creating user: " + error.message);
      }
    },
  };

  initializeModal(modalOptions);
  const modal = new bootstrap.Modal(document.getElementById("dynamicModal"));
  modal.show();
}

// Update event listener for Add New User button
$(document).ready(function () {
  $(document).on("click", '[data-bs-target="#addUserModal"]', function (e) {
    e.preventDefault();
    showAddUserModal();
  });
});
