function showSuccess(message, title) {
    if (title === undefined) {
        title = "Success!";
    }

    Swal.fire(title, message, 'success')
}

function showError(message, title) {
    if (title === undefined) {
        title = "Error!";
    }

    Swal.fire(title, message, "error")
}

function showAreYouSureMessage(message, title) {
    if (title === undefined) {
        title = "Are you sure?";
    }
    let res = Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        return result.isConfirmed;
    });

    return res;
}