// Catch errors for all fetch requests globally
window.addEventListener('error', function () {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Unexpected server error. Please try again later.',
    });
  });
  
  // Use fetch for API calls (no need to mention specific routes)
  fetch('/some-api-endpoint')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Unexpected server error. Please try again later.',
      });
    });
  