export default getSwal = function(title, text, type) {
  if (! type) type = 'warning';

  return {
    title,
    text,
    type,
    confirmButtonColor: '#dd6b55',
    cancelButtonColor: '#d44',
    closeOnConfirm: true,
  };
}
