import swal from 'sweetalert';

const DEFAULT_OPTS = {
  icon: 'warning',
};

export default function(options) {
  return swal(Object.assign(DEFAULT_OPTS, options));
}
