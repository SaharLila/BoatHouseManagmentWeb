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

function showInfoPopup(divToInject){
    Swal.fire({
        html: divToInject,
        showConfirmButton: false,
        showCancelButton: true,
        focusConfirm: false,
        width : "80%" ,
        cancelButtonText:
            '<i class="fa fa-close"></i> Exit',
        cancelButtonAriaLabel: 'Exit'
    })
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