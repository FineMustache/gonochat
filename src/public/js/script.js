const form = document.querySelector('#username-form');
const input = document.querySelector('#username-input');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const username = input.value;
  
  if (username.trim() === '') {
    return;
  }
  
  window.location.href = `/chat?username=${encodeURIComponent(username)}`;
});
