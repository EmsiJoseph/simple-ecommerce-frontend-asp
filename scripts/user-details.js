let currentAccount = null;

$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('id');

    if (!accountId) {
        alert('No account ID provided');
        window.location.href = 'user-management.html';
        return;
    }

    try {
        const account = await ApiService.getEntity('accounts', accountId);
        populateUserDetails(account);
    } catch (error) {
        console.error('Error loading account:', error);
        alert('Error loading user details');
    }

    // Back button handler
    $('#backBtn').click(() => {
        window.location.href = 'user-management.html';
    });

    // Edit button handler
    $('#editUserBtn').click(() => {
        toggleEditMode(true);
    });

    // Cancel button handler
    $('#cancelEditBtn').click(() => {
        toggleEditMode(false);
        // Reset form to original values
        populateUserDetails(currentAccount);
    });

    // Save button handler
    $('#saveUserBtn').click(async () => {
        try {
            // Prepare user data
            const userData = {
                firstName: $('#editFirstName').val(),
                lastName: $('#editLastName').val(),
                gender: $('#editGender').val(),
                phone: $('#editPhone').val(),
                addressLine1: $('#editAddressLine1').val(),
                addressLine2: $('#editAddressLine2').val(),
                city: $('#editCity').val(),
                state: $('#editState').val(),
                zipCode: $('#editZipCode').val(),
                country: $('#editCountry').val()
            };

            // Prepare account data
            const accountData = {
                email: $('#editEmail').val(),
                role: $('#editRole').val(),
                accountStatus: $('#editAccountStatus').val()
            };

            // Make parallel API calls to update both user and account
            const [userResponse, accountResponse] = await Promise.all([
                ApiService.updateEntity('users', currentAccount.userInfo.id, userData),
                ApiService.updateEntity('accounts', currentAccount.id, accountData)
            ]);

            // Fetch the updated account data to refresh the view
            const updatedAccount = await ApiService.getEntity('accounts', currentAccount.id);
            currentAccount = updatedAccount;
            populateUserDetails(updatedAccount);
            toggleEditMode(false);
            alert('User details updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user details');
        }
    });
});

function toggleEditMode(isEdit) {
    $('.view-mode').toggle(!isEdit);
    $('.edit-mode').toggle(isEdit);
    $('#editButtons').toggle(!isEdit);
    $('#saveButtons').toggle(isEdit);
}

function populateUserDetails(account) {
    currentAccount = account;
    
    // View mode elements
    $('#viewFirstName').text(account.userInfo?.firstName || 'N/A');
    $('#viewLastName').text(account.userInfo?.lastName || 'N/A');
    $('#viewGender').text(account.userInfo?.gender || 'N/A');
    $('#viewPhone').text(account.userInfo?.phone || 'N/A');
    $('#viewAddressLine1').text(account.userInfo?.addressLine1 || 'N/A');
    $('#viewAddressLine2').text(account.userInfo?.addressLine2 || 'N/A');
    $('#viewCity').text(account.userInfo?.city || 'N/A');
    $('#viewState').text(account.userInfo?.state || 'N/A');
    $('#viewZipCode').text(account.userInfo?.zipCode || 'N/A');
    $('#viewCountry').text(account.userInfo?.country || 'N/A');
    $('#viewEmail').text(account.email || 'N/A');
    $('#viewRole').text(account.role || 'N/A');
    $('#viewAccountStatus').text(account.accountStatus || 'N/A');
    $('#viewLastLogin').text(account.lastLogin || 'Never');

    // Edit mode elements
    $('#editFirstName').val(account.userInfo?.firstName || '');
    $('#editLastName').val(account.userInfo?.lastName || '');
    $('#editGender').val(account.userInfo?.gender || 'Unspecified');
    $('#editPhone').val(account.userInfo?.phone || '');
    $('#editAddressLine1').val(account.userInfo?.addressLine1 || '');
    $('#editAddressLine2').val(account.userInfo?.addressLine2 || '');
    $('#editCity').val(account.userInfo?.city || '');
    $('#editState').val(account.userInfo?.state || '');
    $('#editZipCode').val(account.userInfo?.zipCode || '');
    $('#editCountry').val(account.userInfo?.country || '');
    $('#editEmail').val(account.email || '');
    $('#editRole').val(account.role || '');
    $('#editAccountStatus').val(account.accountStatus || '');
}
